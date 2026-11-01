<template>
  <div class="modify-password">
    <section class="modify-password__card">
      <h3 class="modify-password__title">
        <span class="modify-password__title-mark" aria-hidden="true">P</span>
        修改密码
      </h3>

      <div class="modify-password__form">
        <AoFormInput
          ref="oldPasswordRef"
          v-model="form.oldPassword"
          type="password"
          placeholder="请输入原密码"
          :rule="rules.oldPassword"
        >
          <template #label>原密码</template>
        </AoFormInput>

        <AoFormInput
          ref="newPasswordRef"
          v-model="form.newPassword"
          type="password"
          placeholder="请输入新密码"
          :rule="rules.newPassword"
        >
          <template #label>新密码</template>
        </AoFormInput>

        <AoFormInput
          ref="confirmPasswordRef"
          v-model="form.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          :rule="rules.confirmPassword"
        >
          <template #label>确认密码</template>
        </AoFormInput>
      </div>

      <div class="modify-password__actions">
        <button
          type="button"
          class="modify-password__submit"
          :disabled="submitting"
          @click="handleSubmit"
        >
          {{ submitting ? '提交中...' : '确认修改' }}
        </button>
        <span v-if="successTip" class="modify-password__tip">
          {{ successTip }}
        </span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
/**
 * 修改密码页
 * 填写原密码 / 新密码 / 确认密码，三项校验通过后提交。
 * @author LiangQiYang
 * @date 2026-10-16
 */
import { onUnmounted, reactive, ref } from 'vue';
import AoFormInput from '@/components/ao-form-input/index.vue';
import { changePassword } from '@/api/auth';

defineOptions({ name: 'ModifyPassword' });

/** 密码长度范围（与后端一致：注册、登录、重置统一 8~64） */
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 64;

/** 修改密码表单 */
const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
});

/** 提交中状态：防重复点击 */
const submitting = ref(false);

/** 提交成功提示（几秒后自动消失） */
const successTip = ref('');
/** 三个输入框：提交前主动触发校验 */
const oldPasswordRef = ref<InstanceType<typeof AoFormInput>>();
const newPasswordRef = ref<InstanceType<typeof AoFormInput>>();
const confirmPasswordRef = ref<InstanceType<typeof AoFormInput>>();

/** 校验规则 */
const rules = {
  oldPassword: [{ required: true, message: '原密码不能为空' }],
  newPassword: [
    { required: true, message: '新密码不能为空' },
    {
      min: PASSWORD_MIN,
      max: PASSWORD_MAX,
      message: `密码长度须在 ${PASSWORD_MIN}~${PASSWORD_MAX} 位之间`,
    },
    {
      validator: (value: string) =>
        value !== form.oldPassword || '新密码不能与原密码相同',
    },
  ],
  confirmPassword: [
    { required: true, message: '确认密码不能为空' },
    {
      validator: (value: string) =>
        value === form.newPassword || '两次输入的密码不一致',
    },
  ],
};

/** 成功提示的定时器 */
let tipTimer: ReturnType<typeof setTimeout> | undefined;

/** 提交：三项都校验通过后调修改密码接口，成功后清空表单 */
async function handleSubmit() {
  if (submitting.value) return;
  const oldValid = oldPasswordRef.value?.validate() ?? false;
  const newValid = newPasswordRef.value?.validate() ?? false;
  const confirmValid = confirmPasswordRef.value?.validate() ?? false;
  if (!oldValid || !newValid || !confirmValid) {
    successTip.value = '';
    return;
  }

  submitting.value = true;
  try {
    await changePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });
    successTip.value = '密码修改成功';
    form.oldPassword = '';
    form.newPassword = '';
    form.confirmPassword = '';

    if (tipTimer) clearTimeout(tipTimer);
    tipTimer = setTimeout(() => {
      successTip.value = '';
    }, 3000);
  } catch {
    // 原密码错误等失败由响应拦截器统一提示
    successTip.value = '';
  } finally {
    submitting.value = false;
  }
}

onUnmounted(() => {
  if (tipTimer) clearTimeout(tipTimer);
});
</script>

<style scoped lang="scss">
.modify-password {
  /* 与其它 tab 内容页保持一致 */
  padding: 20px;
  box-sizing: border-box;
}

/* 表单区：不加外框，靠页面留白排版（与「我的资料」一致） */
.modify-password__card {
  max-width: 420px;
  /* 输入框聚焦描边/角标色跟随品牌色（默认是蓝色 #409eff） */
  --input-focus-color: var(--ao-color-primary);
}

.modify-password__title {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-xs);
  margin: 0 0 var(--ao-spacing-md);
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-semibold);
  line-height: var(--ao-line-height-tight);
  color: var(--ao-color-text-base);
}

/* 品牌元素：标题前的首字母（密码 Password），品牌字体 + 品牌色 */
.modify-password__title-mark {
  flex-shrink: 0;
  font-family: var(--ao-font-family-ali);
  font-size: 18px;
  font-weight: var(--ao-font-weight-semibold);
  line-height: 1;
  color: var(--ao-color-primary);
}

.modify-password__form {
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-md);
}

.modify-password__actions {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-sm);
  margin-top: var(--ao-spacing-lg);
}

/* 主操作按钮：与弹窗底部按钮同一尺寸（36px / 6px 圆角） */
.modify-password__submit {
  min-width: 112px;
  height: 36px;
  padding: 0 24px;
  border: var(--ao-border-width-thin) solid var(--ao-color-primary);
  border-radius: var(--ao-border-radius-base);
  background-color: var(--ao-color-primary);
  font-family: inherit;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-gray-0);
  cursor: pointer;
  transition:
    border-color var(--ao-duration-fast) var(--ao-ease-in-out),
    background-color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover {
    border-color: var(--ao-color-primary-hover);
    background-color: var(--ao-color-primary-hover);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.modify-password__tip {
  font-size: var(--ao-font-size-xs);
  color: var(--ao-color-success-text);
}
</style>
