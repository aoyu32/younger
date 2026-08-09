<template>
  <div class="register flex" ref="registerBoxRef">
    <div class="register-left" ref="registerLeftRef">
      <div class="back-home" @click="handleBackHome">
        <AoImage
          src="@/assets/auth/icon_back_home.svg"
          width="20px"
          height="20px"
        ></AoImage>
      </div>
      <div class="form-wrapper flex-c">
        <div class="register-title">
          <h2>YOUNGER <span>SIGN UP</span></h2>
          <p>Welcome To Join 洋果教育</p>
        </div>
        <div class="register-form flex-col">
          <div class="form-item">
            <label>用户名：</label>
            <AoInput type="text" placeholder="请输入用户名"></AoInput>
          </div>
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
            <label>密码：</label>
            <AoInput type="password" placeholder="请输入密码"></AoInput>
          </div>
          <div class="form-item">
            <label>确认密码：</label>
            <AoInput type="password" placeholder="请再次输入密码"></AoInput>
          </div>
        </div>
        <div class="register-submit">
          <ao-button @click="handleRegister">注册</ao-button>
        </div>
      </div>
    </div>
    <div class="register-right flex-center" ref="registerRightRef">
      <div class="right-content">
        <div class="logo-box">
          <div class="logo-img">
            <AoImage src="@/assets/younger_logo.png" width="24px" />
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
          <p>已有账号？去登录</p>
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
const registerBoxRef = ref<HTMLElement>();
const registerLeftRef = ref<HTMLElement>();
const registerRightRef = ref<HTMLElement>();

defineOptions({
  name: 'Register',
});

const registerForm = ref({
  username: '',
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: '',
});

const handleGetCode = () => {
  console.log('send verify code');
};

const handleRegister = () => {
  console.log(registerForm.value);
};

const handleBackHome = () => {
  if (registerBoxRef.value) {
    registerBoxRef.value.classList.add('shrink-out');
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
    showOverlay('Go To Login Younger Account ...');
    return new Promise((resolve) => {
      const leftEl = registerLeftRef.value;
      const rightEl = registerRightRef.value;
      if (!leftEl) {
        resolve(true);
        return;
      }
      const onEnd = () => {
        leftEl.removeEventListener('animationend', onEnd);
        resolve(true);
      };
      leftEl.addEventListener('animationend', onEnd);
      leftEl.classList.add('slide-out-left');
      rightEl?.classList.add('slide-out');
    });
  }
  return true;
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
