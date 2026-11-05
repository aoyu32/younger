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
      <!-- 移动端：返回首页移到表单底部，圆形浅灰底 home 图标按钮 -->
      <div class="mobile-back-home" @click="handleBackHome" aria-label="返回首页">
        <AoImage src="@/assets/auth/icon_home.svg" width="20px" height="20px"></AoImage>
      </div>
      <!-- 桌面端：绳子吊着的 home 圆球，可拉拽摆动，点击回首页 -->
      <RopeHomeButton @home="handleBackHome" />
      <div class="form-wrapper flex-c">
        <div class="reset-title">
          <h2>YOUNGER <span>RE PWD</span></h2>
          <p>Reset Your Password, Back 洋果教育</p>
        </div>
        <div class="reset-form flex-col">
          <div class="form-item">
            <ao-form-input
              ref="emailRef"
              type="text"
              placeholder="请输入邮箱"
              v-model="resetForm.email"
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
                v-model="resetForm.verifyCode"
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
              placeholder="请输入新密码"
              v-model="resetForm.password"
              :rule="rules.password"
            >
              <template #label>新密码：</template>
            </ao-form-input>
          </div>
          <div class="form-item">
            <ao-form-input
              ref="confirmPasswordRef"
              type="password"
              placeholder="请再次输入密码"
              v-model="resetForm.confirmPassword"
              :rule="rules.confirmPassword"
            >
              <template #label>确认密码：</template>
            </ao-form-input>
          </div>
        </div>
        <div class="reset-submit">
          <ao-button :disabled="submitting" @click="handleReset">
            <span class="submit-inner">
              <ao-loading v-if="submitting" />
              <span>{{ submitting ? '提交中...' : '重置密码' }}</span>
            </span>
          </ao-button>
        </div>
        <!-- 移动端：品牌面板隐藏后，登录入口移到表单下方 -->
        <div class="mobile-alt-link">
          想起密码？<span @click="$router.push('/login')">去登录</span>
        </div>
      </div>
    </div>
    <!-- 发码被限流（body code=429）时弹滑块，验证通过后携带凭证重发一次 -->
    <AoCaptcha
      v-if="showCaptcha"
      @on-success="handleCaptchaRetry"
      @on-close="showCaptcha = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useAuthTransition } from '@/hooks/useAuthTransition';
import AoFormInput from '@/components/ao-form-input/index.vue';
import AoCaptcha from '../components/AuthCaptcha.vue';
import RopeHomeButton from '../components/RopeHomeButton.vue';
import { message } from '@/components/ao-message';
import { sendResetPasswordCode } from '@/api/codes';
import { forgotPassword } from '@/api/auth';
import { ApiError } from '@/request';

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

const rules = {
  email: [
    { required: true, message: '邮箱不能为空' },
    { pattern: /^[\w.-]+@[\w.-]+\.\w+$/, message: '邮箱格式不正确' },
  ],
  verifyCode: [
    { required: true, message: '验证码不能为空' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字' },
  ],
  password: [
    { required: true, message: '新密码不能为空' },
    { min: 8, max: 64, message: '密码长度须在 8~64 位之间' },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空' },
    {
      validator: (value: string) =>
        value === resetForm.value.password || '两次输入的密码不一致',
    },
  ],
};

const showCaptcha = ref(false);
const submitting = ref(false);

/** 发送验证码：倒计时 + 发送中状态 */
const sending = ref(false);
const cooldown = ref(0);
let cooldownTimer: ReturnType<typeof setInterval> | undefined;

const emailRef = ref<InstanceType<typeof AoFormInput>>();
const verifyCodeRef = ref<InstanceType<typeof AoFormInput>>();
const passwordRef = ref<InstanceType<typeof AoFormInput>>();
const confirmPasswordRef = ref<InstanceType<typeof AoFormInput>>();

const handleGetCode = async () => {
  if (sending.value || cooldown.value > 0) return;

  if (!emailRef.value?.validate()) return;

  await doSendCode();
};

/** 发码冷却倒计时（仅发送成功后启动） */
const startCooldown = () => {
  cooldown.value = 60;
  cooldownTimer = setInterval(() => {
    cooldown.value -= 1;
    if (cooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = undefined;
    }
  }, 1000);
};

const doSendCode = async (captchaVerification?: string, isRetry = false) => {
  if (sending.value) return;
  sending.value = true;
  try {
    await sendResetPasswordCode(
      {
        channel: 'EMAIL',
        target: resetForm.value.email,
        ...(captchaVerification ? { captchaVerification } : {}),
      },
      { silent: true },
    );
    message.success('验证码已发送至邮箱，请注意查收');
    startCooldown();
  } catch (e) {
    if (e instanceof ApiError && e.code === 429 && !isRetry) {
      showCaptcha.value = true;
      return;
    }
    message.error(e instanceof Error ? e.message : '发送失败，请稍后重试');
  } finally {
    sending.value = false;
  }
};

/** 滑块校验通过：拿 captchaVerification 重发一次验证码 */
const handleCaptchaRetry = async (payload: {
  captchaVerification?: string;
}) => {
  showCaptcha.value = false;
  if (!payload?.captchaVerification) return;

  await doSendCode(payload.captchaVerification, true);
};

const handleReset = async () => {
  if (submitting.value) return;

  const valid = [emailRef, verifyCodeRef, passwordRef, confirmPasswordRef].every(
    (field) => field.value?.validate() ?? false,
  );
  if (!valid) return;

  submitting.value = true;
  try {
    await forgotPassword({
      channel: 'EMAIL',
      account: resetForm.value.email,
      code: resetForm.value.verifyCode,
      newPassword: resetForm.value.password,
    });
    message.success('密码重置成功，请登录');
    router.push('/login');
  } catch {
    // 失败提示由响应拦截器统一处理
  } finally {
    submitting.value = false;
  }
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

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
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
