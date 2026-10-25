<template>
  <div class="login flex" ref="loginBoxRef">
    <div class="login-left flex-center" ref="loginLeftRef">
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
        <div class="to-register" @click="handleToRegister">
          <p>没有账号？去注册</p>
        </div>
      </div>
    </div>
    <div class="login-right" ref="loginFormRef">
      <div class="back-home" @click="handleBackHome">
        <AoImage
          src="@/assets/auth/icon_back_home.svg"
          width="20px"
          height="20px"
        ></AoImage>
      </div>
      <!-- 移动端：右上角返回按钮隐藏后，返回首页改为左上角文本按钮 -->
      <div class="mobile-back-home" @click="handleBackHome">返回首页</div>
      <div class="form-wrapper flex-c">
        <div class="login-title">
          <h2>YOUNGER <span>SIGN IN</span></h2>
          <p>Welcome To 洋果教育</p>
        </div>
        <div class="login-form flex-col">
          <div class="form-item">
            <ao-form-input
              type="text"
              placeholder="请输入用户名或邮箱"
              v-model="loginForm.username"
              :rule="rules.username"
              clearable
            >
              <template #label>账号：</template>
            </ao-form-input>
          </div>
          <div class="form-item">
            <ao-form-input
              type="password"
              placeholder="请输入密码"
              v-model="loginForm.password"
              :rule="rules.password"
            >
              <template #label>密码：</template>
            </ao-form-input>
          </div>
        </div>
        <div class="form-bottom">
          <div @click="$router.push('/reset')">忘记密码？</div>
        </div>
        <div class="login-submit">
          <ao-button @click="handleLogin">登录</ao-button>
        </div>
        <!-- 移动端：品牌面板隐藏后，注册入口移到表单下方 -->
        <div class="mobile-alt-link">
          没有账号？<span @click="handleToRegister">去注册</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useAuthTransition } from '../composables/useAuthTransition';
import AoFormInput from '@/components/ao-form-input/index.vue';

const { showOverlay, hideOverlay } = useAuthTransition();

const router = useRouter();
const loginBoxRef = ref<HTMLElement>();
const loginFormRef = ref<HTMLElement>();
const loginLeftRef = ref<HTMLElement>();

defineOptions({
  name: 'Login',
});

const loginForm = ref({
  username: '',
  password: '',
});

const rules = {
  username: [{ required: true, message: '账号不能为空' }],
  password: [{ required: true, message: '密码不能为空' }],
};

const handleLogin = () => {
  console.log(loginForm.value);
};

const handleToRegister = () => {
  router.push('/register');
};

const handleBackHome = () => {
  if (loginBoxRef.value) {
    loginBoxRef.value.classList.add('shrink-out');
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

onBeforeRouteLeave((to) => {
  if (to.name === 'register') {
    showOverlay('Go To Register Younger Account ...');
    return new Promise((resolve) => {
      const rightEl = loginFormRef.value;
      const leftEl = loginLeftRef.value;
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
  if (to.name === 'reset') {
    showOverlay('Reset Your Younger Account Password ...');
    return new Promise((resolve) => {
      const rightEl = loginFormRef.value;
      const leftEl = loginLeftRef.value;
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

onMounted(() => {
  hideOverlay();
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
