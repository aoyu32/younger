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
      <!-- 移动端：返回首页移到表单底部，圆形浅灰底 home 图标按钮 -->
      <div class="mobile-back-home" @click="handleBackHome" aria-label="返回首页">
        <AoImage src="@/assets/auth/icon_home.svg" width="20px" height="20px"></AoImage>
      </div>
      <div class="form-wrapper flex-c">
        <div class="login-title">
          <h2>YOUNGER <span>SIGN IN</span></h2>
          <p>Welcome To 洋果教育</p>
        </div>
        <div class="login-form flex-col">
          <div class="form-item">
            <ao-form-input
              ref="usernameRef"
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
              ref="passwordRef"
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
          <ao-button :disabled="submitting" @click="handleLogin">
            <span class="submit-inner">
              <ao-loading v-if="submitting" />
              <span>{{ submitting ? '登录中...' : '登录' }}</span>
            </span>
          </ao-button>
        </div>
        <!-- 移动端：品牌面板隐藏后，注册入口移到表单下方 -->
        <div class="mobile-alt-link">
          没有账号？<span @click="handleToRegister">去注册</span>
        </div>
      </div>
    </div>
    <!-- 连续失败被限流（body code=429）时弹滑块，验证通过后携带凭证重试一次 -->
    <AuthCaptcha
      v-if="showCaptcha"
      @on-success="handleCaptchaRetry"
      @on-close="showCaptcha = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router';
import { useAuthTransition } from '@/hooks/useAuthTransition';
import { useUserStore } from '@/store/module/user';
import AoFormInput from '@/components/ao-form-input/index.vue';
import AuthCaptcha from '../components/AuthCaptcha.vue';
import { message } from '@/components/ao-message';
import { login } from '@/api/auth';
import { ApiError } from '@/request';

const { showOverlay, hideOverlay } = useAuthTransition();

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
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

const showCaptcha = ref(false);
const submitting = ref(false);

const usernameRef = ref<InstanceType<typeof AoFormInput>>();
const passwordRef = ref<InstanceType<typeof AoFormInput>>();

const EMAIL_RE = /^[\w.-]+@[\w.-]+\.\w+$/;

const handleLogin = async () => {
  if (submitting.value) return;

  // 先校验表单
  const valid = [usernameRef, passwordRef].every(
    (field) => field.value?.validate() ?? false,
  );
  if (!valid) return;

  await doLogin();
};

/**
 * 密码登录：silent 自行处理提示，以便识别 body code=429。
 * 被限流时弹滑块，拿到一次性凭证后重试一次。
 */
const doLogin = async (captchaVerification?: string, isRetry = false) => {
  if (submitting.value) return;
  submitting.value = true;
  try {
    const account = loginForm.value.username.trim();
    const res = await login(
      {
        loginType: EMAIL_RE.test(account)
          ? 'EMAIL_PASSWORD'
          : 'USERNAME_PASSWORD',
        account,
        password: loginForm.value.password,
        ...(captchaVerification ? { captchaVerification } : {}),
      },
      { silent: true },
    );
    // 保存后端返回的用户信息并自动登录（token 由 HttpOnly Cookie 维护，不存前端）
    userStore.login({
      userId: res.userId,
      nickname: res.nickname,
      avatar: res.avatar,
      roles: res.roles,
    });
    message.success(`欢迎回来，${res.nickname}`);
    // 401 拦截器带的 redirect 优先回跳，否则去首页
    const redirect = route.query.redirect;
    router.push(
      typeof redirect === 'string' && redirect.startsWith('/')
        ? redirect
        : '/home',
    );
  } catch (e) {
    // 429 且不是重试：弹滑块验证，通过后携带凭证重试一次
    if (e instanceof ApiError && e.code === 429 && !isRetry) {
      showCaptcha.value = true;
      return;
    }
    message.error(e instanceof Error ? e.message : '登录失败，请稍后重试');
  } finally {
    submitting.value = false;
  }
};

/** 滑块校验通过：拿 captchaVerification 重试一次登录（一次性消费） */
const handleCaptchaRetry = async (payload: {
  captchaVerification?: string;
}) => {
  showCaptcha.value = false;
  if (!payload?.captchaVerification) return;

  await doLogin(payload.captchaVerification, true);
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
