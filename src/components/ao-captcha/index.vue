<template>
  <div class="captcha-window">
    <div class="captcha">
      <div class="captcha-header">
        <h4>请完成安全校验</h4>
        <button><i class="iconfont icon-close" @click="close"></i></button>
      </div>
      <div class="captcha-body">
        <CaptchaContainer
          @success="success"
          :mode="mode"
          :captchaType="captchaType"
          :generate-captcha="generateCaptcha"
          :check-captcha="checkCaptcha"
          :encrypt-point="encryptPoint"
          :imgSize="{ width: '330px', height: '155px' }"
        ></CaptchaContainer>
      </div>
    </div>
  </div>
</template>
<script setup>
import CaptchaContainer from './component/CaptchaContainer.vue';

/**
 * 通用滑块弹窗：网络与加密能力由外部通过 props 注入，
 * 本组件仅依赖 vue 与相对路径资源，可直接跨项目复用。
 * 项目内使用请走业务侧适配器（如 view/auth/components/AuthCaptcha.vue），
 * 不要在本组件内直接 import 项目的 api / utils。
 */
defineProps({
  /** 验证码类型，默认滑块拼图 */
  captchaType: {
    type: String,
    default: 'blockPuzzle',
  },
  /** 展示模式，默认 fixed 固定弹窗 */
  mode: {
    type: String,
    default: 'fixed',
  },
  /** 生成验证码：使用方注入 */
  generateCaptcha: {
    type: Function,
    required: true,
  },
  /** 校验验证码：使用方注入 */
  checkCaptcha: {
    type: Function,
    required: true,
  },
  /** 坐标加密：使用方注入 */
  encryptPoint: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['on-success', 'on-close']);

//验证成功回调
const success = (param) => {
  emit('on-success', param);
  console.log('验证成功');

  close();
};

//关闭验证窗口
const close = () => {
  emit('on-close');
};
</script>
<style lang="scss" scoped>
@use './index.scss' as *;
</style>
