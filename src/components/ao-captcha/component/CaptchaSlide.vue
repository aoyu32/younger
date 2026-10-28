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
          :src="'data:image/png;base64,' + backImgBase"
          alt=""
          style="width: 100%; height: 100%; display: block"
        />
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
            v-if="tipWords"
            :class="passFlag ? 'suc-bg' : 'err-bg'"
            >{{ tipWords }}</span
          >
        </transition>
      </div>
    </div>
    <!-- 公共部分 -->
    <div
      class="verify-bar-area"
      :class="{ 'is-loading': isLoading }"
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
            v-if="type === '2'"
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
import demoBg from '../image/demo-bg.png';
import demoMask from '../image/demo-mask.png';

// 演示图尺寸（与 aj-captcha 服务端返回的尺寸一致）
const SOURCE_WIDTH = 310;
const SOURCE_HEIGHT = 155;
const PIECE_WIDTH = 47;
// 允许的误差（按原图 310px 宽度换算）
const TOLERANCE = 8;

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
      transitionLeft = ref(''),
      transitionWidth = ref(''),
      startLeft = ref(0),
      targetX = ref(0);

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

    // 本地演示图是即时生成的，给一个最短展示时间，方便看到 loading 效果（接真实接口后可去掉）
    const MIN_LOADING_MS = 1000;

    // 本地演示：用 demo 图生成背景和拼图块（后续接接口时替换成 repData）
    const getPictrue = async () => {
      const token = ++loadToken;
      const startedAt = Date.now();
      isLoading.value = true;
      try {
        const [background, mask] = await Promise.all([
          loadImage(demoBg),
          loadImage(demoMask),
        ]);
        if (token !== loadToken) return;

        // 缺口出现的水平位置（原图坐标系）
        const minX = 40;
        const maxX = Math.max(minX, SOURCE_WIDTH - PIECE_WIDTH - 40);
        targetX.value = Math.round(
          minX + Math.random() * Math.max(1, maxX - minX),
        );

        // 拼图块：从背景图裁出对应区域，再用拼图形状做透明遮罩
        const pieceCanvas = document.createElement('canvas');
        pieceCanvas.width = PIECE_WIDTH;
        pieceCanvas.height = SOURCE_HEIGHT;
        const pieceCtx = pieceCanvas.getContext('2d');
        pieceCtx.drawImage(
          background,
          targetX.value,
          0,
          PIECE_WIDTH,
          SOURCE_HEIGHT,
          0,
          0,
          PIECE_WIDTH,
          SOURCE_HEIGHT,
        );
        pieceCtx.globalCompositeOperation = 'destination-in';
        pieceCtx.drawImage(mask, 0, 0, PIECE_WIDTH, SOURCE_HEIGHT);
        blockBackImgBase.value = pieceCanvas
          .toDataURL('image/png')
          .split(',')[1];

        // 背景图：在缺口位置画一块半透明白色拼图形状
        const bgCanvas = document.createElement('canvas');
        bgCanvas.width = SOURCE_WIDTH;
        bgCanvas.height = SOURCE_HEIGHT;
        const bgCtx = bgCanvas.getContext('2d');
        bgCtx.drawImage(background, 0, 0, SOURCE_WIDTH, SOURCE_HEIGHT);

        const holeCanvas = document.createElement('canvas');
        holeCanvas.width = PIECE_WIDTH;
        holeCanvas.height = SOURCE_HEIGHT;
        const holeCtx = holeCanvas.getContext('2d');
        holeCtx.drawImage(mask, 0, 0, PIECE_WIDTH, SOURCE_HEIGHT);
        holeCtx.globalCompositeOperation = 'source-in';
        holeCtx.fillStyle = '#ffffff';
        holeCtx.fillRect(0, 0, PIECE_WIDTH, SOURCE_HEIGHT);

        bgCtx.globalAlpha = 0.55;
        bgCtx.drawImage(holeCanvas, targetX.value, 0);
        bgCtx.globalAlpha = 1;

        backImgBase.value = bgCanvas.toDataURL('image/png').split(',')[1];
      } catch (error) {
        console.error('生成滑块验证码演示图失败', error);
      } finally {
        // 补足最短 loading 时间；已被更新的请求取代时不再改动状态
        if (token === loadToken) {
          const rest = MIN_LOADING_MS - (Date.now() - startedAt);
          if (rest > 0) {
            await new Promise((resolve) => setTimeout(resolve, rest));
          }
          if (token === loadToken) isLoading.value = false;
        }
      }
    };

    const init = () => {
      text.value = explain.value;
      getPictrue();
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
      if (isLoading.value) return;
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

    //鼠标松开
    const end = () => {
      endMovetime.value = +new Date();
      //判断是否重合（本地演示：按滑动距离与缺口位置比较）
      if (status.value && isEnd.value == false) {
        let moveLeftDistance = parseInt(
          (moveBlockLeft.value || '').replace('px', ''),
        );
        if (Number.isNaN(moveLeftDistance)) moveLeftDistance = 0;
        moveLeftDistance =
          (moveLeftDistance * 310) / parseInt(setSize.imgWidth);

        if (Math.abs(moveLeftDistance - targetX.value) <= TOLERANCE) {
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
            context.emit('success', { captchaVerification: 'demo' });
          }, 1000);
        } else {
          moveBlockBackgroundColor.value = '#f05656';
          leftBarBorderColor.value = '#f05656';
          iconColor.value = '#fff';
          iconClass.value = 'icon-close';
          passFlag.value = false;
          tipWords.value = '验证失败';
          setTimeout(() => {
            refresh();
          }, 1000);
          setTimeout(() => {
            tipWords.value = '';
          }, 1000);
          context.emit('error', proxy);
        }
        status.value = false;
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

      getPictrue();
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
      transitionLeft,
      transitionWidth,
      barArea,
      refresh,
      start,
    };
  },
};
</script>
