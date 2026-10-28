<template>
  <div :class="mode == 'pop' ? 'mask' : ''" v-show="showBox">
    <div
      :class="mode == 'pop' ? 'verifybox' : ''"
      :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }"
    >
      <div class="verifybox-top" v-if="mode == 'pop'">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div
        class="verifybox-bottom"
        :style="{ padding: mode == 'pop' ? '15px' : '0' }"
      >
        <!-- 验证码容器 -->
        <component
          v-if="componentType"
          :is="componentType"
          :captchaType="captchaType"
          :type="verifyType"
          :figure="figure"
          :arith="arith"
          :mode="mode"
          :vSpace="vSpace"
          :explain="explain"
          :imgSize="imgSize"
          :blockSize="blockSize"
          :barSize="barSize"
          ref="instance"
          @success="$emit('success', $event)"
          @error="$emit('error', $event)"
          @ready="$emit('ready', $event)"
        ></component>
      </div>
    </div>
  </div>
</template>
<script>
/**
 * Verify 验证码组件
 * @description 分发验证码使用
 * */
import CaptchaSlide from './CaptchaSlide.vue';
import { computed, ref, toRefs, watchEffect } from 'vue';

export default {
  name: 'Vue2Verify',
  components: {
    CaptchaSlide,
  },
  emits: ['success', 'error', 'ready'],
  props: {
    captchaType: {
      type: String,
      required: true,
    },
    figure: {
      type: Number,
    },
    arith: {
      type: Number,
    },
    mode: {
      type: String,
      default: 'pop',
    },
    vSpace: {
      type: Number,
    },
    explain: {
      type: String,
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
    },
    barSize: {
      type: Object,
    },
  },
  setup(props) {
    const {
      captchaType,
      figure,
      arith,
      mode,
      vSpace,
      explain,
      imgSize,
      blockSize,
      barSize,
    } = toRefs(props);
    const clickShow = ref(false);
    const verifyType = ref(undefined);
    const componentType = ref(undefined);

    const instance = ref({});

    const showBox = computed(() => {
      if (mode.value == 'pop') {
        return clickShow.value;
      } else {
        return true;
      }
    });
    /**
     * refresh
     * @description 刷新
     * */
    const refresh = () => {
      console.log(instance.value);
      if (instance.value.refresh) {
        instance.value.refresh();
      }
    };
    const closeBox = () => {
      refresh();
    };
    const show = () => {
      if (mode.value == 'pop') {
        clickShow.value = true;
      }
    };
    watchEffect(() => {
      switch (captchaType.value) {
        case 'blockPuzzle':
          verifyType.value = '2';
          componentType.value = 'CaptchaSlide';
          break;
        case 'clickWord':
          verifyType.value = '';
          componentType.value = 'VerifyPoints';
          break;
      }
    });

    return {
      clickShow,
      verifyType,
      componentType,
      instance,
      closeBox,
      showBox,
      show,
    };
  },
};
</script>
<style lang="scss">
.verifybox {
  position: relative;
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid #d9eeee;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 181, 181, 0.18);
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.verifybox-top {
  padding: 0 15px;
  height: 50px;
  line-height: 50px;
  text-align: left;
  font-size: 16px;
  color: #122323;
  box-sizing: border-box;
}

.verifybox-bottom {
  padding: 15px;
  box-sizing: border-box;
}

.verifybox-close {
  position: absolute;
  top: 13px;
  right: 9px;
  width: 24px;
  height: 24px;
  text-align: center;
  cursor: pointer;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  width: 100%;
  height: 100vh;
  background: rgba(10, 26, 28, 0.46);
  /* display: none; */
  transition: all 0.5s;
}

.verify-tips {
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: auto;
  max-width: calc(100% - 24px);
  height: 28px;
  padding: 0 12px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.3px;
  color: #fff;
  white-space: nowrap;
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  box-shadow: 0 3px 10px rgba(0, 40, 40, 0.16);
}

.suc-bg {
  background-color: rgba(33, 184, 102, 0.84);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
}

.err-bg {
  background-color: rgba(240, 86, 86, 0.84);
  filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
}

.tips-enter-from,
.tips-enter,
.tips-leave-to {
  bottom: -36px;
  opacity: 0;
}

.tips-enter-active,
.tips-leave-active {
  transition:
    bottom 0.4s ease,
    opacity 0.32s ease;
}

/*滑动验证码*/
.verify-bar-area {
  position: relative;
  background: linear-gradient(180deg, #f9fcfc 0%, #f2f8f8 100%);
  text-align: center;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border: 1px solid #e2efef;
  border-radius: 4px;
  box-shadow:
    inset 0 1px 2px rgba(16, 75, 75, 0.05),
    0 1px 0 rgba(255, 255, 255, 0.9);
  user-select: none;
}

.verify-bar-area > .verify-msg {
  position: relative;
  z-index: 3;
  font-size: 13px;
  letter-spacing: 0.4px;
  color: #8a9b9b;
  pointer-events: none;
}

.verify-bar-area .verify-move-block {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 4;
  background: #00b5b5 !important;
  cursor: grab;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 4px;
  color: #fff;
  transition: background-color 0.2s ease-out;
  touch-action: none;
}

.verify-bar-area .verify-move-block.is-success {
  background: #21b866 !important;
}

.verify-bar-area .verify-move-block.is-error {
  background: #f05656 !important;
}

.verify-bar-area .verify-move-block:active {
  cursor: grabbing;
}

.verify-bar-area .verify-left-bar {
  position: absolute;
  top: -1px;
  left: -1px;
  background: linear-gradient(
    90deg,
    rgba(0, 181, 181, 0.1) 0%,
    rgba(0, 181, 181, 0.06) 100%
  );
  background-clip: padding-box;
  cursor: pointer;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border: 1px solid transparent;
  border-color: transparent !important;
  border-radius: 4px 0 0 4px;
}

.verify-img-panel {
  margin: 0;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
  border-radius: 3px;
  position: relative;
  background: #f2f8f8;
}

.verify-img-panel > img {
  border-radius: 3px;
}

/* 图片加载中：遮罩 + 动画图标 */
.verify-loading {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 3px;
  background: rgba(249, 252, 252, 0.88);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  color: #00b5b5;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.5px;
}

.verify-loading-icon {
  display: block;
  width: 100px;
  height: 80px;
  pointer-events: none;
}

.verify-fade-enter-active,
.verify-fade-leave-active {
  transition: opacity 0.2s ease;
}

.verify-fade-enter-from,
.verify-fade-leave-to {
  opacity: 0;
}

/* 加载中不允许拖动 */
.verify-bar-area.is-loading {
  cursor: wait;

  .verify-move-block {
    cursor: wait;
  }

  .verify-msg {
    opacity: 0.6;
  }
}

.verify-img-panel .verify-refresh {
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5px;
  cursor: pointer;
  margin: 8px;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2;
}

.verify-img-panel .icon-refresh {
  font-size: 20px;
  color: #fff;
}

.icon-refresh:hover {
  color: #00b5b5;
}

.verify-img-panel .verify-gap {
  background-color: #fff;
  position: relative;
  z-index: 2;
  border: 1px solid #fff;
}

.verify-bar-area .verify-move-block .verify-sub-block {
  position: absolute;
  left: 0;
  text-align: center;
  z-index: 3;
  filter: drop-shadow(0 6px 8px rgba(0, 30, 30, 0.22));
}

.verify-bar-area .verify-move-block .verify-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff !important;
  font-size: 16px;
  pointer-events: none;

  svg {
    display: block;
    width: 16px;
    height: 16px;
  }
}

/* 组件内图标兜底：项目里没有 iconfont，使用字符图标，避免按钮空白 */
.captcha-window {
  .iconfont {
    display: inline-block;
    font-style: normal;
    font-family: inherit;
    line-height: 1;
  }

  .icon-close::before {
    content: '×';
    font-size: 20px;
  }

  .icon-refresh::before {
    content: '↻';
  }

  .icon-right::before,
  .icon-arrow-double-right::before {
    content: '»';
  }

  .icon-check::before,
  .icon-success::before {
    content: '✓';
  }

  .icon-error::before {
    content: '✕';
  }

  .verify-move-block .icon-close::before {
    content: '✕';
  }
}
</style>
