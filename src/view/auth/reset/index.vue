<template>
  <div class="reset flex" ref="resetBoxRef">
    <div class="reset-left flex-center" ref="resetLeftRef">
      <div class="left-content">
        <div class="logo-box">
          <div class="logo-img">
            <AoImage src="@/assets/logo.svg" width="30px" height="30px" />
          </div>
          <div class="logo-name">洋果教育</div>
        </div>
        <div class="title-content">
          <div class="title">
            <h2 class="h2-1">越学习<span>.</span>越年轻</h2>
            <h2 class="h2-2">越学习 越年轻</h2>
          </div>
          <p>THE MORE YOU LEARN，THE YOUNGER YOU BECOME</p>
        </div>
        <div class="to-login" @click="$router.push('/login')">
          <p>想起密码？去登录</p>
        </div>
      </div>
    </div>
    <div class="reset-right" ref="resetRightRef">
      <div class="back-home" @click="handleBackHome">
        <AoImage
          src="@/assets/auth/icon_back_home.svg"
          width="20px"
          height="20px"
        ></AoImage>
      </div>
      <div class="form-wrapper flex-c">
        <div class="reset-title">
          <h2>YOUNGER <span>RESET PWD</span></h2>
          <p>Reset Your Password, Back 洋果教育</p>
        </div>
        <div class="reset-form flex-col">
          <div class="form-item">
            <label>邮箱：</label>
            <AoInput type="text" placeholder="请输入邮箱"></AoInput>
          </div>
          <div class="form-item">
            <label>验证码：</label>
            <div class="code-row">
              <AoInput type="text" placeholder="请输入验证码"></AoInput>
              <ao-button class="code-btn" plain>获取验证码</ao-button>
            </div>
          </div>
          <div class="form-item">
            <label>新密码：</label>
            <AoInput type="password" placeholder="请输入新密码"></AoInput>
          </div>
          <div class="form-item">
            <label>确认密码：</label>
            <AoInput type="password" placeholder="请再次输入密码"></AoInput>
          </div>
        </div>
        <div class="reset-submit">
          <ao-button @click="handleReset">重置密码</ao-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useAuthTransition } from '../composables/useAuthTransition';

const { showOverlay, hideOverlay } = useAuthTransition();
const router = useRouter();
const resetBoxRef = ref<HTMLElement>();
const resetLeftRef = ref<HTMLElement>();
const resetRightRef = ref<HTMLElement>();

defineOptions({
  name: 'Reset',
});

const resetForm = ref({
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: '',
});

const handleGetCode = () => {
  console.log('send verify code');
};

const handleReset = () => {
  console.log(resetForm.value);
};

const handleBackHome = () => {
  if (resetBoxRef.value) {
    resetBoxRef.value.classList.add('shrink-out');
    setTimeout(() => {
      showOverlay('洋果教育');
    }, 400);
    setTimeout(() => {
      router.push('/home');
    }, 800);
  } else {
    router.push('/home');
  }
};

onMounted(() => {
  hideOverlay();
});

onBeforeRouteLeave((to) => {
  if (to.name === 'login') {
    showOverlay('Back To Login ...');
    return new Promise((resolve) => {
      const leftEl = resetLeftRef.value;
      const rightEl = resetRightRef.value;
      if (!rightEl) {
        resolve(true);
        return;
      }
      const onEnd = () => {
        rightEl.removeEventListener('animationend', onEnd);
        resolve(true);
      };
      rightEl.addEventListener('animationend', onEnd);
      rightEl.classList.add('slide-out');
      leftEl?.classList.add('slide-out-left');
    });
  }
  return true;
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
