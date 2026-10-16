<template>
  <div class="account-info">
    <!-- 两块横向并排：账号信息 / 登录信息 -->
    <div class="account-info__blocks">
      <section class="account-info__block">
        <h3 class="account-info__title">
          <span class="account-info__title-mark" aria-hidden="true">A</span>
          账号信息
        </h3>
        <dl class="account-info__list">
          <div class="account-info__item">
            <dt class="account-info__label">用户名</dt>
            <dd class="account-info__value">{{ account.username }}</dd>
          </div>
          <div class="account-info__item">
            <dt class="account-info__label">绑定邮箱</dt>
            <dd
              class="account-info__value account-info__value--action"
            >
              <span>{{ account.email }}</span>
              <button
                type="button"
                class="account-info__action"
                @click="rebindVisible = true"
              >
                换绑
              </button>
            </dd>
          </div>
          <div class="account-info__item">
            <dt class="account-info__label">注册时间</dt>
            <dd class="account-info__value">
              {{ formatDateCN(account.registerTime) }}
            </dd>
          </div>
        </dl>
      </section>

      <section class="account-info__block">
        <h3 class="account-info__title">
          <span class="account-info__title-mark" aria-hidden="true">L</span>
          登录信息
        </h3>
        <dl class="account-info__list">
          <div class="account-info__item">
            <dt class="account-info__label">最近登录时间</dt>
            <dd class="account-info__value">
              {{ formatDateCN(account.lastLoginTime) }}
            </dd>
          </div>
          <div class="account-info__item">
            <dt class="account-info__label">最近登录地址</dt>
            <dd class="account-info__value">{{ account.lastLoginAddress }}</dd>
          </div>
          <div class="account-info__item">
            <dt class="account-info__label">登录方式</dt>
            <dd class="account-info__value">{{ account.loginType }}</dd>
          </div>
        </dl>
      </section>
    </div>

    <!-- 换绑邮箱：新邮箱 + 验证码 -->
    <AoDialog
      v-model="rebindVisible"
      title="换绑邮箱"
      confirm-text="确认换绑"
      @confirm="handleRebindConfirm"
      @close="resetRebindForm"
    >
      <div class="rebind-form">
        <AoFormInput
          ref="emailInputRef"
          v-model="rebindForm.email"
          placeholder="请输入新邮箱"
          :rule="rebindRules.email"
          clearable
        >
          <template #label>新邮箱</template>
        </AoFormInput>

        <div class="rebind-form__code">
          <AoFormInput
            ref="codeInputRef"
            v-model="rebindForm.code"
            placeholder="请输入验证码"
            :rule="rebindRules.code"
            maxlength="6"
          >
            <template #label>验证码</template>
          </AoFormInput>
          <button
            type="button"
            class="rebind-form__code-btn"
            :disabled="countdown > 0"
            @click="handleSendCode"
          >
            {{ countdown > 0 ? `${countdown}s 后重发` : '获取验证码' }}
          </button>
        </div>
      </div>
    </AoDialog>
  </div>
</template>

<script setup lang="ts">
/**
 * 账号信息页
 * 横向两栏展示：左栏「账号信息」（用户名 / 绑定邮箱 / 注册时间），
 * 右栏「登录信息」（最近登录时间 / 最近登录地址 / 登录方式）。
 * 绑定邮箱支持「换绑」：弹窗内填写新邮箱 + 邮箱验证码。
 * 均为只读信息，后续替换为账号详情接口。
 * @author LiangQiYang
 * @date 2026-10-16
 */
import { onUnmounted, reactive, ref } from 'vue';
import AoDialog from '@/components/ao-dialog/index.vue';
import AoFormInput from '@/components/ao-form-input/index.vue';
import { formatDateCN } from '@/utils/format';

defineOptions({ name: 'AccountInfo' });

/** 账号信息结构 */
interface AccountDetail {
  /** 用户名 */
  username: string;
  /** 绑定邮箱 */
  email: string;
  /** 注册时间（yyyy-MM-dd HH:mm） */
  registerTime: string;
  /** 最近登录时间（yyyy-MM-dd HH:mm） */
  lastLoginTime: string;
  /** 最近登录地址 */
  lastLoginAddress: string;
  /** 登录方式 */
  loginType: string;
}

/** 账号信息（mock） */
const account = reactive<AccountDetail>({
  username: 'younger_001',
  email: 'younger001@163.com',
  registerTime: '2025-03-12 09:24',
  lastLoginTime: '2026-10-16 08:41',
  lastLoginAddress: '安徽 · 合肥（电信）',
  loginType: '账号密码登录',
});

/** 验证码重发间隔（秒） */
const CODE_COUNTDOWN = 60;

/** 换绑邮箱弹窗显隐 */
const rebindVisible = ref(false);
/** 换绑表单：新邮箱 + 验证码 */
const rebindForm = reactive({ email: '', code: '' });
/** 验证码重发倒计时（秒），大于 0 时「获取验证码」不可点 */
const countdown = ref(0);
/** 新邮箱输入框（用于确认前主动触发校验） */
const emailInputRef = ref<InstanceType<typeof AoFormInput>>();
/** 验证码输入框 */
const codeInputRef = ref<InstanceType<typeof AoFormInput>>();

/** 换绑表单校验规则 */
const rebindRules = {
  email: [
    { required: true, message: '新邮箱不能为空' },
    { pattern: /^[\w.-]+@[\w.-]+\.\w+$/, message: '邮箱格式不正确' },
    {
      validator: (value: string) =>
        value !== account.email || '新邮箱不能与当前邮箱相同',
    },
  ],
  code: [
    { required: true, message: '验证码不能为空' },
    { pattern: /^\d{6}$/, message: '验证码为 6 位数字' },
  ],
};

/** 倒计时定时器 */
let countdownTimer: ReturnType<typeof setInterval> | undefined;

/** 开始倒计时 */
function startCountdown() {
  countdown.value = CODE_COUNTDOWN;
  countdownTimer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) stopCountdown();
  }, 1000);
}

/** 结束倒计时并清理定时器 */
function stopCountdown() {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = undefined;
  countdown.value = 0;
}

/** 清空换绑表单（倒计时继续跑，避免关掉弹窗就重复获取验证码） */
function resetRebindForm() {
  rebindForm.email = '';
  rebindForm.code = '';
}

/** 获取验证码：先校验新邮箱，通过后发送（TODO 接口） */
function handleSendCode() {
  if (!emailInputRef.value?.validate()) return;
  // TODO 调发送邮箱验证码接口
  startCountdown();
}

/** 确认换绑：两项都校验通过后更新绑定邮箱（TODO 接口） */
function handleRebindConfirm() {
  const emailValid = emailInputRef.value?.validate() ?? false;
  const codeValid = codeInputRef.value?.validate() ?? false;
  if (!emailValid || !codeValid) return;

  // TODO 调换绑邮箱接口，成功后再更新展示
  account.email = rebindForm.email.trim();
  rebindVisible.value = false;
  resetRebindForm();
}

onUnmounted(stopCountdown);
</script>

<style scoped lang="scss">
.account-info {
  display: flex;
  flex-direction: column;
  /* 与其它 tab 内容页保持一致 */
  padding: 20px 20px 0;
  box-sizing: border-box;
}

/* 两块横向布局：宽度不够时自动换行堆叠 */
.account-info__blocks {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--ao-spacing-lg);
}

.account-info__block {
  flex: 1 1 220px;
  min-width: 0;
  padding: var(--ao-spacing-lg);
  box-sizing: border-box;
  border: var(--ao-border-width-thin) solid var(--ao-gray-4);
  border-radius: var(--ao-border-radius-lg);
}

.account-info__title {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-xs);
  margin: 0 0 var(--ao-spacing-md);
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-semibold);
  line-height: var(--ao-line-height-tight);
  color: var(--ao-color-text-base);
}

/* 品牌元素：标题前的首字母（账号 A / 登录 L），品牌字体 + 品牌色 */
.account-info__title-mark {
  flex-shrink: 0;
  font-family: var(--ao-font-family-ali);
  font-size: 18px;
  font-weight: var(--ao-font-weight-semibold);
  line-height: 1;
  color: var(--ao-color-primary);
}

.account-info__list {
  display: flex;
  flex-direction: column;
  margin: 0;
}

.account-info__item {
  display: flex;
  align-items: flex-start;
  gap: var(--ao-spacing-md);
  padding: var(--ao-spacing-sm) 0;
  font-size: var(--ao-font-size-sm);

  /* 行间浅分割线，首行不加 */
  & + & {
    border-top: var(--ao-border-width-thin) solid var(--ao-gray-3);
  }
}

/* 标签列定宽：两栏的值都能左端对齐（按最长标签「最近登录时间」6 字取 84px） */
.account-info__label {
  flex-shrink: 0;
  width: 84px;
  margin: 0;
  color: var(--ao-color-text-secondary);
}

.account-info__value {
  margin: 0;
  min-width: 0;
  /* 邮箱等长文本允许折行，不撑破卡片 */
  word-break: break-all;
  color: var(--ao-color-text-base);
}

/* 绑定邮箱行：邮箱与「换绑」按钮两端对齐 */
.account-info__value--action {
  display: flex;
  flex: 1;
  align-items: center;
  gap: var(--ao-spacing-sm);
}

/* 文本按钮：换绑 */
.account-info__action {
  flex-shrink: 0;
  margin-left: auto;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: var(--ao-font-size-xs);
  line-height: 1;
  color: var(--ao-color-primary);
  white-space: nowrap;
  cursor: pointer;
  transition: opacity var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover {
    opacity: 0.75;
  }
}

/* ---------- 换绑邮箱弹窗 ---------- */
.rebind-form {
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-md);
  /* 输入框聚焦描边/角标色跟随品牌色（默认是蓝色 #409eff） */
  --input-focus-color: var(--ao-color-primary);
}

.rebind-form__code {
  display: flex;
  align-items: flex-end;
  gap: var(--ao-spacing-sm);

  /* 输入框占满剩余宽度，按钮不压缩 */
  :deep(.ao-form-input) {
    flex: 1;
    min-width: 0;
  }
}

.rebind-form__code-btn {
  flex-shrink: 0;
  padding: 8px 14px;
  border: var(--ao-border-width-thin) solid var(--ao-color-primary);
  /* 与 ao-form-input 输入框圆角保持一致 */
  border-radius: 6px;
  background-color: transparent;
  font-family: inherit;
  font-size: var(--ao-font-size-sm);
  line-height: 1.5;
  color: var(--ao-color-primary);
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color var(--ao-duration-fast) var(--ao-ease-in-out),
    opacity var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover:not(:disabled) {
    background-color: color-mix(
      in srgb,
      var(--ao-color-primary) 10%,
      transparent
    );
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
