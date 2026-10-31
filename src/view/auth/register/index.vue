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
      <!-- 移动端：右上角返回按钮隐藏后，返回首页改为左上角文本按钮 -->
      <div class="mobile-back-home" @click="handleBackHome">返回首页</div>
      <div class="form-wrapper flex-c">
        <div class="register-title">
          <h2>YOUNGER <span>SIGN UP</span></h2>
          <p>Welcome To Join 洋果教育</p>
        </div>
        <div class="register-form flex-col">
          <div class="form-item">
            <ao-form-input
              ref="usernameRef"
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
              ref="emailRef"
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
                ref="verifyCodeRef"
                type="text"
                placeholder="请输入验证码"
                v-model="form.verifyCode"
                :rule="rules.verifyCode"
                clearable
              >
                <template #label>验证码：</template>
              </ao-form-input>
              <ao-button
                class="code-btn"
                plain
                :disabled="cooldown > 0 || sending"
                @click="handleGetCode"
              >
                {{ sending ? '发送中...' : cooldown > 0 ? `${cooldown}s后重试` : '获取验证码' }}
              </ao-button>
            </div>
          </div>
          <div class="form-item">
            <ao-form-input
              ref="passwordRef"
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
              ref="confirmPasswordRef"
              type="password"
              placeholder="请再次输入密码"
              v-model="form.confirmPassword"
              :rule="rules.confirmPassword"
            >
              <template #label>确认密码：</template>
            </ao-form-input>
          </div>
        </div>
        <div class="register-agreement">
          <span
            class="agreement-checkbox"
            :class="{ checked: agreed }"
            @click="agreed = !agreed"
          >
            <svg v-if="agreed" viewBox="0 0 12 12" class="check-icon">
              <path
                d="M2 6.5L4.8 9.3L10 3.5"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          <span class="agreement-text">
            我已阅读并同意
            <span class="agreement-link" @click="openAgreement('user')"
              >用户协议</span
            >
            和
            <span class="agreement-link" @click="openAgreement('privacy')"
              >隐私政策</span
            >
          </span>
        </div>
        <div class="register-submit">
          <ao-button :disabled="submitting" @click="handleRegister">
            <span class="submit-inner">
              <ao-loading v-if="submitting" />
              <span>{{ submitting ? '注册中...' : '注册' }}</span>
            </span>
          </ao-button>
        </div>
        <!-- 移动端：品牌面板隐藏后，登录入口移到表单下方 -->
        <div class="mobile-alt-link">
          已有账号？<span @click="$router.push('/login')">去登录</span>
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
    <!-- 发码被限流（body code=429）时弹滑块，验证通过后携带凭证重发一次 -->
    <AuthCaptcha
      v-if="showCaptcha"
      @on-success="handleCaptchaRetry"
      @on-close="showCaptcha = false"
    />
    <!-- 用户协议 / 隐私政策全屏阅读 -->
    <AgreementReader v-model="agreementVisible" :type="agreementType" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useAuthTransition } from '../composables/useAuthTransition';
import { useUserStore } from '@/store/module/user';
import AoFormInput from '@/components/ao-form-input/index.vue';
import AuthCaptcha from '../components/AuthCaptcha.vue';
import AgreementReader, {
  type AgreementType,
} from './components/AgreementReader.vue';
import { message } from '@/components/ao-message';
import { sendRegisterCode } from '@/api/codes';
import { register } from '@/api/auth';
import { ApiError } from '@/request';

const { showOverlay, hideOverlay } = useAuthTransition();
const userStore = useUserStore();
const router = useRouter();
const registerBoxRef = ref<HTMLElement>();
const registerLeftRef = ref<HTMLElement>();
const registerRightRef = ref<HTMLElement>();

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
    { min: 4, max: 20, message: '用户名长度须在 4~20 位之间' },
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
    { min: 8, max: 64, message: '密码长度须在 8~64 位之间' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空' },
    {
      validator: (value: string) =>
        value === form.value.password || '两次输入的密码不一致',
    },
  ],
};

const showCaptcha = ref(false);
const submitting = ref(false);

/** 协议勾选 + 协议弹窗 */
const agreed = ref(false);
const agreementVisible = ref(false);
const agreementType = ref<AgreementType>('user');

const openAgreement = (type: AgreementType) => {
  agreementType.value = type;
  agreementVisible.value = true;
};

/** 发送验证码：倒计时 + 发送中状态 */
const sending = ref(false);
const cooldown = ref(0);
let cooldownTimer: ReturnType<typeof setInterval> | undefined;

const emailRef = ref<InstanceType<typeof AoFormInput>>();
const usernameRef = ref<InstanceType<typeof AoFormInput>>();
const verifyCodeRef = ref<InstanceType<typeof AoFormInput>>();
const passwordRef = ref<InstanceType<typeof AoFormInput>>();
const confirmPasswordRef = ref<InstanceType<typeof AoFormInput>>();

/** 获取邮箱验证码（EMAIL 渠道） */
const handleGetCode = async () => {
  if (sending.value || cooldown.value > 0) return;

  // 先校验邮箱格式，不通过不发请求
  if (!emailRef.value?.validate()) return;

  await doSendCode();
};

/** 发码冷却倒计时（仅发送成功后启动） */
const startCooldown = () => {
  // 后端有发送冷却，前端同步做 60s 倒计时
  cooldown.value = 60;
  cooldownTimer = setInterval(() => {
    cooldown.value -= 1;
    if (cooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = undefined;
    }
  }, 1000);
};

/**
 * 发送验证码：silent 自行处理提示，以便识别 body code=429。
 * 高频被限流时弹滑块，拿到一次性凭证后重发一次。
 */
const doSendCode = async (captchaVerification?: string, isRetry = false) => {
  if (sending.value) return;
  sending.value = true;
  try {
    await sendRegisterCode(
      {
        channel: 'EMAIL',
        target: form.value.email,
        ...(captchaVerification ? { captchaVerification } : {}),
      },
      { silent: true },
    );
    message.success('验证码已发送至邮箱，请注意查收');
    startCooldown();
  } catch (e) {
    // 429 且不是重发：弹滑块验证，通过后携带凭证重发一次
    if (e instanceof ApiError && e.code === 429 && !isRetry) {
      showCaptcha.value = true;
      return;
    }
    message.error(e instanceof Error ? e.message : '发送失败，请稍后重试');
  } finally {
    sending.value = false;
  }
};

/** 滑块校验通过：拿 captchaVerification 重发一次验证码（一次性消费） */
const handleCaptchaRetry = async (payload: {
  captchaVerification?: string;
}) => {
  showCaptcha.value = false;
  if (!payload?.captchaVerification) return;

  await doSendCode(payload.captchaVerification, true);
};

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});

const handleRegister = async () => {
  if (submitting.value) return;

  // 先校验整个表单，填得不对先提示表单项
  const fields = [
    usernameRef,
    emailRef,
    verifyCodeRef,
    passwordRef,
    confirmPasswordRef,
  ];
  const valid = fields.every((field) => field.value?.validate() ?? false);
  if (!valid) return;

  // 表单都填对了，没勾选协议时再提醒
  if (!agreed.value) {
    message.warning('请先阅读并同意用户协议和隐私政策');
    return;
  }

  // 注册不再走滑块：直接携带邮箱验证码提交
  submitting.value = true;
  try {
    const res = await register({
      username: form.value.username,
      email: form.value.email,
      emailCode: form.value.verifyCode,
      password: form.value.password,
    });
    // 保存后端返回的用户信息并自动登录（token 由 HttpOnly Cookie 维护，不存前端）
    userStore.login({
      userId: res.userId,
      nickname: res.nickname,
      avatar: res.avatar,
      roles: res.roles,
    });
    message.success(`注册成功，${res.nickname}，欢迎加入洋果教育`);
    router.push('/home');
  } catch {
    // 失败提示由响应拦截器统一处理
  } finally {
    submitting.value = false;
  }
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
