<template>
  <div style="position: relative">
    <div
      v-if="type === '2'"
      class="verify-img-out"
      :style="{ height: parseInt(setSize.imgHeight) + vSpace + 'px' }"
    >
      <div
        class="verify-img-panel"
        :style="{ width: setSize.imgWidth, height: setSize.imgHeight }"
      >
        <img
          v-if="backImgBase && !loadFailed"
          :src="'data:image/png;base64,' + backImgBase"
          alt=""
          style="width: 100%; height: 100%; display: block"
        />
        <div v-else-if="loadFailed" class="verify-empty" :key="emptyKey">
          <img
            class="verify-empty-icon"
            :src="emptyIcon"
            alt=""
            aria-hidden="true"
          />
          <span class="verify-empty-text">验证码加载失败，点击右上角刷新重试</span>
        </div>
        <transition name="verify-fade">
          <div class="verify-loading" v-if="isLoading">
            <img
              class="verify-loading-icon"
              src="../image/loading.svg"
              alt=""
              aria-hidden="true"
            />
            <span class="verify-loading-text">稍等，正在加载中...</span>
          </div>
        </transition>
        <div
          class="verify-refresh"
          @click="refresh"
          v-show="showRefresh && !isLoading"
        >
          <i class="iconfont icon-refresh"></i>
        </div>
        <transition name="tips">
          <span
            class="verify-tips"
            v-if="tipWords && !loadFailed"
            :class="passFlag ? 'suc-bg' : 'err-bg'"
            >{{ tipWords }}</span
          >
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :class="{ 'is-loading': isLoading, 'is-failed': loadFailed }"
      :style="{
        width: setSize.imgWidth,
        height: barSize.height,
        'line-height': barSize.height,
      }"
    >
      <span class="verify-msg" v-text="text"></span>
      <div
        class="verify-left-bar"
        :style="{
          width: leftBarWidth !== undefined ? leftBarWidth : barSize.height,
          height: barSize.height,
          'border-color': leftBarBorderColor,
          transaction: transitionWidth,
        }"
      >
        <span class="verify-msg" v-text="finishText"></span>
        <div
          class="verify-move-block"
          :class="{
            'is-success': iconClass === 'icon-check',
            'is-error': iconClass === 'icon-close',
          }"
          @touchstart="start"
          @mousedown="start"
          :style="{
            width: barSize.height,
            height: barSize.height,
            'background-color': moveBlockBackgroundColor,
            left: moveBlockLeft,
            transition: transitionLeft,
          }"
        >
          <span class="verify-icon" :style="{ color: iconColor }">
            <svg
              v-if="iconClass === 'icon-check'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12.5l4.4 4.4L19 7" />
            </svg>
            <svg
              v-else-if="iconClass === 'icon-close'"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.4"
              stroke-linecap="round"
              aria-hidden="true"
            >
              <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
            </svg>
            <svg
              v-else
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h12.5" />
              <path d="M12 6.5 17.5 12 12 17.5" />
            </svg>
          </span>
          <div
            v-if="type === '2' && blockBackImgBase"
            class="verify-sub-block"
            :style="{
              width: Math.floor((parseInt(setSize.imgWidth) * 47) / 310) + 'px',
              height: setSize.imgHeight,
              top: '-' + (parseInt(setSize.imgHeight) + vSpace) + 'px',
              'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
            }"
          >
            <img
              :src="'data:image/png;base64,' + blockBackImgBase"
              alt=""
              style="width: 100%; height: 100%; display: block"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * VerifySlide
 * @description 滑块
 * */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRefs,
  watch,
  getCurrentInstance,
} from 'vue';
import emptyIcon from '../image/icon_empty.svg?url';

/**
 * 通用滑块组件：网络与加密能力由外部通过 props 注入，
 * 本文件仅依赖 vue 与相对路径资源，可直接跨项目复用。
 */

/** aj-captcha 原图宽度，坐标按这个宽度换算后再提交 */
const SOURCE_WIDTH = 310;

export default {
  name: 'VerifySlide',
  props: {
    captchaType: {
      type: String,
    },
    type: {
      type: String,
      default: '1',
    },
    //弹出式pop，固定fixed
    mode: {
      type: String,
      default: 'fixed',
    },
    vSpace: {
      type: Number,
      default: 5,
    },
    explain: {
      type: String,
      default: '向右滑动完成验证',
    },
    imgSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '155px',
        };
      },
    },
    blockSize: {
      type: Object,
      default() {
        return {
          width: '50px',
          height: '50px',
        };
      },
    },
    barSize: {
      type: Object,
      default() {
        return {
          width: '310px',
          height: '40px',
        };
      },
    },
    /** 生成验证码：使用方注入，返回原图/滑块图/token/密钥 */
    generateCaptcha: {
      type: Function,
      required: true,
    },
    /** 校验验证码：使用方注入，返回一次性 captchaVerification */
    checkCaptcha: {
      type: Function,
      required: true,
    },
    /** 坐标加密：使用方注入，如 (plainText, secretKey) => AES 密文 */
    encryptPoint: {
      type: Function,
      required: true,
    },
  },
  setup(props, context) {
    const {
      mode,
      captchaType,
      vSpace,
      imgSize,
      barSize,
      type,
      blockSize,
      explain,
    } = toRefs(props);
    const { proxy } = getCurrentInstance();

    let secretKey = ref(''), //后端返回的加密秘钥 字段
      passFlag = ref(''), //是否通过的标识
      backImgBase = ref(''), //验证码背景图片
      blockBackImgBase = ref(''), //验证滑块的背景图片
      backToken = ref(''), //后端返回的唯一token值
      startMoveTime = ref(''), //移动开始的时间
      endMovetime = ref(''), //移动结束的时间
      tipWords = ref(''),
      text = ref(''),
      finishText = ref(''),
      setSize = reactive({
        imgHeight: 0,
        imgWidth: 0,
        barHeight: 0,
        barWidth: 0,
      }),
      moveBlockLeft = ref(undefined),
      leftBarWidth = ref(undefined),
      // 移动中样式
      moveBlockBackgroundColor = ref(undefined),
      leftBarBorderColor = ref('#c8eded'),
      iconColor = ref(undefined),
      iconClass = ref('icon-right'),
      status = ref(false), //鼠标状态
      isEnd = ref(false), //是否验证完成
      showRefresh = ref(true),
      isLoading = ref(true), //验证码图片加载中
      loadFailed = ref(false), //验证码加载失败
      emptyKey = ref(0), //失败占位的 key，每次失败 +1 让出场动画重播
      transitionLeft = ref(''),
      transitionWidth = ref(''),
      startLeft = ref(0),
      /** 正在请求后端校验 */
      checking = ref(false);

    const barArea = computed(() => {
      return proxy.$el.querySelector('.verify-bar-area');
    });

    // 内联原 resetSize：根据 imgSize / barSize 计算实际尺寸
    const resetSize = (vm) => {
      const parentWidth =
        (vm.$el && vm.$el.parentNode && vm.$el.parentNode.offsetWidth) ||
        window.innerWidth;
      const parentHeight =
        (vm.$el && vm.$el.parentNode && vm.$el.parentNode.offsetHeight) ||
        window.innerHeight;
      const getSize = (value, parent) =>
        String(value).indexOf('%') !== -1
          ? (parseInt(value) / 100) * parent + 'px'
          : value;

      return {
        imgWidth: getSize(vm.imgSize.width, parentWidth),
        imgHeight: getSize(vm.imgSize.height, parentHeight),
        barWidth: getSize(vm.barSize.width, parentWidth),
        barHeight: getSize(vm.barSize.height, parentHeight),
      };
    };

    const loadImage = (src) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = src;
      });

    let loadToken = 0;

    /** 拉取验证码：后端返回 Base64 原图、滑块图、token 和加密密钥 */
    const fetchCaptcha = async () => {
      const token = ++loadToken;
      isLoading.value = true;
      tipWords.value = '';
      // 先清掉旧图；失败态保持到新图就绪，避免闪出坏图
      backImgBase.value = '';
      blockBackImgBase.value = '';
      try {
        const data = await props.generateCaptcha({
          captchaType: props.captchaType || 'blockPuzzle',
        });
        if (token !== loadToken) return;

        secretKey.value = data.secretKey;
        backToken.value = data.token;
        blockBackImgBase.value = data.jigsawImageBase64 || '';

        // 等图片解码完成再撤掉 loading，避免闪一下白底
        try {
          await loadImage(`data:image/png;base64,${data.originalImageBase64}`);
        } catch {
          // 解码失败也照常展示，浏览器会重试渲染
        }
        if (token !== loadToken) return;
        backImgBase.value = data.originalImageBase64;
        loadFailed.value = false;
      } catch (error) {
        if (token !== loadToken) return;
        loadFailed.value = true;
        emptyKey.value += 1;
        passFlag.value = false;
        tipWords.value = '验证码加载失败，点击右上角刷新重试';
      } finally {
        if (token === loadToken) isLoading.value = false;
      }
    };

    const init = () => {
      text.value = explain.value;
      fetchCaptcha();
      nextTick(() => {
        const size = resetSize(proxy);
        setSize.imgHeight = size.imgHeight;
        setSize.imgWidth = size.imgWidth;
        setSize.barHeight = size.barHeight;
        setSize.barWidth = size.barWidth;
        context.emit('ready', proxy);
      });
    };

    //鼠标按下
    const start = (e) => {
      if (isLoading.value || loadFailed.value || checking.value) return;
      e = e || window.event;
      let x;
      if (!e.touches) {
        //兼容PC端
        x = e.clientX;
      } else {
        //兼容移动端
        x = e.touches[0].pageX;
      }
      startLeft.value = Math.floor(
        x - barArea.value.getBoundingClientRect().left,
      );
      startMoveTime.value = +new Date(); //开始滑动的时间
      if (isEnd.value == false) {
        text.value = '';
        moveBlockBackgroundColor.value = '#00b5b5';
        leftBarBorderColor.value = '#00b5b5';
        iconColor.value = '#fff';
        e.stopPropagation();
        status.value = true;
      }
    };

    //鼠标移动
    const move = (e) => {
      e = e || window.event;
      if (status.value && isEnd.value == false) {
        let x;
        if (!e.touches) {
          //兼容PC端
          x = e.clientX;
        } else {
          //兼容移动端
          x = e.touches[0].pageX;
        }
        const bar_area_left = barArea.value.getBoundingClientRect().left;
        let move_block_left = x - bar_area_left; //小方块相对于父元素的left值
        if (
          move_block_left >=
          barArea.value.offsetWidth -
            parseInt(parseInt(blockSize.value.width) / 2) -
            2
        ) {
          move_block_left =
            barArea.value.offsetWidth -
            parseInt(parseInt(blockSize.value.width) / 2) -
            2;
        }
        if (move_block_left <= 0) {
          move_block_left = parseInt(parseInt(blockSize.value.width) / 2);
        }
        //拖动后小方块的left值
        moveBlockLeft.value = move_block_left - startLeft.value + 'px';
        leftBarWidth.value = move_block_left - startLeft.value + 'px';
      }
    };

    //鼠标松开：提交后端校验
    const end = async () => {
      endMovetime.value = +new Date();
      if (!status.value || isEnd.value || checking.value) return;
      status.value = false;

      let moveLeftDistance = parseInt(
        (moveBlockLeft.value || '').replace('px', ''),
      );
      if (Number.isNaN(moveLeftDistance)) moveLeftDistance = 0;
      // 换算回原图坐标系（后端按 310px 宽度校验）
      moveLeftDistance =
        (moveLeftDistance * SOURCE_WIDTH) / parseInt(setSize.imgWidth);

      // 坐标加密后提交，加密实现由使用方通过 encryptPoint 注入
      const pointJson = props.encryptPoint(
        JSON.stringify({ x: moveLeftDistance, y: 5 }),
        secretKey.value,
      );

      checking.value = true;
      try {
        const res = await props.checkCaptcha({
          captchaType: props.captchaType || 'blockPuzzle',
          token: backToken.value,
          pointJson,
        });

        moveBlockBackgroundColor.value = '#21b866';
        leftBarBorderColor.value = '#21b866';
        iconColor.value = '#fff';
        iconClass.value = 'icon-check';
        showRefresh.value = false;
        isEnd.value = true;
        passFlag.value = true;
        tipWords.value = `${(
          (endMovetime.value - startMoveTime.value) /
          1000
        ).toFixed(2)}s验证成功`;

        setTimeout(() => {
          tipWords.value = '';
          context.emit('success', {
            captchaVerification: res.captchaVerification,
          });
        }, 1000);
      } catch (error) {
        moveBlockBackgroundColor.value = '#f05656';
        leftBarBorderColor.value = '#f05656';
        iconColor.value = '#fff';
        iconClass.value = 'icon-close';
        passFlag.value = false;
        tipWords.value = error?.message || '验证失败，请重试';
        setTimeout(() => {
          tipWords.value = '';
          refresh();
        }, 1000);
        context.emit('error', proxy);
      } finally {
        checking.value = false;
      }
    };

    const refresh = () => {
      showRefresh.value = true;
      finishText.value = '';

      transitionLeft.value = 'left .3s';
      moveBlockLeft.value = 0;

      leftBarWidth.value = undefined;
      transitionWidth.value = 'width .3s';

      leftBarBorderColor.value = '#c8eded';
      moveBlockBackgroundColor.value = '#fff';
      iconColor.value = '#00b5b5';
      iconClass.value = 'icon-right';
      isEnd.value = false;

      fetchCaptcha();
      setTimeout(() => {
        transitionWidth.value = '';
        transitionLeft.value = '';
        text.value = explain.value;
      }, 300);
    };

    watch(type, () => {
      init();
    });

    onMounted(() => {
      init();
      // 禁止拖拽
      proxy.$el.onselectstart = function () {
        return false;
      };
      window.addEventListener('touchmove', move);
      window.addEventListener('mousemove', move);
      //鼠标松开
      window.addEventListener('touchend', end);
      window.addEventListener('mouseup', end);
    });

    onBeforeUnmount(() => {
      loadToken += 1;
      window.removeEventListener('touchmove', move);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('touchend', end);
      window.removeEventListener('mouseup', end);
    });

    return {
      secretKey,
      passFlag,
      backImgBase,
      blockBackImgBase,
      backToken,
      startMoveTime,
      endMovetime,
      tipWords,
      text,
      finishText,
      setSize,
      moveBlockLeft,
      leftBarWidth,
      moveBlockBackgroundColor,
      leftBarBorderColor,
      iconColor,
      iconClass,
      status,
      isEnd,
      showRefresh,
      isLoading,
      loadFailed,
      emptyKey,
      emptyIcon,
      transitionLeft,
      transitionWidth,
      barArea,
      refresh,
      start,
    };
  },
};
</script>
