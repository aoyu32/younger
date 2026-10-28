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
          :mode="'fixed'"
          :captchaType="'blockPuzzle'"
          :imgSize="{ width: '330px', height: '155px' }"
        ></CaptchaContainer>
      </div>
    </div>
  </div>
</template>
<script setup>
import CaptchaContainer from './component/CaptchaContainer.vue';

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
