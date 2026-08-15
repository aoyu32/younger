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
            <ao-form-input
              placeholder="请输入用户名"
              v-model="form.username"
              :rule="rules.username"
              clearable
            >
              <template #label>用户名：</template>
            </ao-form-input>
          </div>
          <div class="form-item">
            <ao-form-input
              type="text"
              placeholder="请输入邮箱"
              v-model="form.email"
              :rule="rules.email"
              clearable
            >
              <template #label>邮箱：</template>
            </ao-form-input>
          </div>
          <div class="form-item">
            <div class="code-row">
              <ao-form-input
                type="text"
                placeholder="请输入验证码"
                v-model="form.verifyCode"
                :rule="rules.verifyCode"
                clearable
              >
                <template #label>验证码：</template>
              </ao-form-input>
              <ao-button class="code-btn" plain>获取验证码</ao-button>
            </div>
          </div>
          <div class="form-item">
            <ao-form-input
              type="password"
              placeholder="请输入密码"
              v-model="form.password"
              :rule="rules.password"
            >
              <template #label>密码：</template>
            </ao-form-input>
          </div>
          <div class="form-item">
            <ao-form-input
              type="password"
              placeholder="请再次输入密码"
              v-model="form.confirmPassword"
              :rule="rules.confirmPassword"
            >
              <template #label>确认密码：</template>
            </ao-form-input>
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
import AoFormInput from '@/components/ao-form-input/index.vue';

const { showOverlay, hideOverlay } = useAuthTransition();
const router = useRouter();
const registerBoxRef = ref<HTMLElement>();
const registerLeftRef = ref<HTMLElement>();
const registerRightRef = ref<HTMLElement>();

const usernameRules = [
  { required: true, message: '用户名不能为空' },
  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字或下划线' },
  { min: 3, max: 20, message: '用户名长度须在 3~20 位之间' },
];

defineOptions({
  name: 'Register',
});

const form = ref({
  username: '',
  email: '',
  verifyCode: '',
  password: '',
  confirmPassword: '',
});

const rules = {
  username: [
    { required: true, message: '用户名不能为空' },
    { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名只能包含字母、数字或下划线' },
    { min: 3, max: 20, message: '用户名长度须在 3~20 位之间' },
  ],
  email: [
    { required: true, message: '邮箱不能为空' },
    { pattern: /^[\w.-]+@[\w.-]+\.\w+$/, message: '邮箱格式不正确' },
  ],
  verifyCode: [
    { required: true, message: '验证码不能为空' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字' },
  ],
  password: [
    { required: true, message: '密码不能为空' },
    { min: 6, max: 20, message: '密码长度须在 6~20 位之间' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空' },
    {
      validator: (value: string) =>
        value === form.value.password || '两次输入的密码不一致',
    },
  ],
};

const handleGetCode = () => {
  console.log('send verify code');
};

const handleRegister = () => {
  console.log(form.value);
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
