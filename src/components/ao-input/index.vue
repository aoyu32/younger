<template>
  <div ref="rootRef" class="ao-input" :class="[`ao-input--${size}`]">
    <div
      class="input-wrapper"
      :class="{
        'is-error': errorMessage,
        'is-disabled': disabled,
      }"
    >
      <div v-if="$slots['icon-front']" class="icon-front">
        <slot name="icon-front"></slot>
      </div>
      <input
        ref="inputRef"
        class="ao-input__inner"
        :type="resolvedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :maxlength="maxlength"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
      />
      <!-- 可清空按钮 -->
      <div
        v-if="clearable && modelValue && !disabled"
        class="icon-back icon-clear"
        @click="handleClear"
      >
        <slot name="clear-icon">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path
              d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
            />
          </svg>
        </slot>
      </div>
      <!-- 密码可见切换 -->
      <div
        v-else-if="type === 'password' && modelValue"
        class="icon-back"
        @click="togglePasswordVisible"
      >
        <slot :name="passwordVisible ? 'icon-eye-open' : 'icon-eye-close'">
          <svg
            v-if="passwordVisible"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
          <svg
            v-else
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path
              d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
            />
          </svg>
        </slot>
      </div>
      <div v-else-if="$slots['icon-back']" class="icon-back">
        <slot name="icon-back"></slot>
      </div>
    </div>
    <transition name="fade">
      <div v-if="errorMessage" class="validate-message">{{ errorMessage }}</div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, watchEffect } from 'vue';

defineOptions({
  name: 'AoInput',
});

/**
 * 校验规则定义
 */
export interface ValidateRule {
  /** 是否必填 */
  required?: boolean;
  /** 错误提示文字 */
  message?: string;
  /** 正则表达式校验 */
  pattern?: RegExp;
  /** 最小长度（字符串） */
  min?: number;
  /** 最大长度（字符串） */
  max?: number;
  /** 自定义校验函数，返回 true 表示通过，false 或字符串表示失败 */
  validator?: (value: string) => boolean | string;
  /** 触发校验的时机，默认 blur */
  trigger?: 'blur' | 'input' | 'change';
}

const props = defineProps({
  /** v-model 绑定的值 */
  modelValue: {
    type: String,
    default: '',
  },
  /** 输入框类型 */
  type: {
    type: String,
    default: 'text',
  },
  /** 占位文本 */
  placeholder: {
    type: String,
    default: '',
  },
  /** 自定义主题色 */
  color: {
    type: String,
    default: '#409eff',
  },
  /** 尺寸: small / normal / large */
  size: {
    type: String,
    default: 'normal',
  },
  /** 是否禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 最大输入长度 */
  maxlength: {
    type: [Number, String],
    default: undefined,
  },
  /** 是否可清空 */
  clearable: {
    type: Boolean,
    default: false,
  },
  /** 校验规则列表 */
  rules: {
    type: Array as () => ValidateRule[],
    default: () => [],
  },
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  change: [event: Event];
  clear: [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const rootRef = ref<HTMLDivElement | null>(null);
const errorMessage = ref<string>('');
const touched = ref(false);
const passwordVisible = ref(false);

/** 根据 passwordVisible 动态切换 input type */
const resolvedType = ref(props.type);

/**
 * 将十六进制颜色转换为 rgba 格式
 * @param hex - 十六进制颜色（带或不带 #）
 * @param alpha - 透明度
 * @returns rgba 颜色字符串
 */
function hexToRgba(hex: string, alpha: number = 0.15): string {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

watchEffect(() => {
  if (props.type === 'password') {
    resolvedType.value = passwordVisible.value ? 'text' : 'password';
  } else {
    resolvedType.value = props.type;
  }
});

/** 通过 CSS 变量注入主题色 */
watchEffect(() => {
  const el = rootRef.value;
  if (!el) return;
  el.style.setProperty('--input-color', props.color);
  el.style.setProperty('--input-focus-color', props.color);
  el.style.setProperty('--input-focus-shadow', hexToRgba(props.color));
});

/** 根据 rules 提取指定 trigger 的规则 */
function getRulesByTrigger(trigger: ValidateRule['trigger']): ValidateRule[] {
  return props.rules.filter((r) => !r.trigger || r.trigger === trigger);
}

/** 执行校验，返回 true 表示通过 */
function validate(): boolean {
  const value = props.modelValue ?? '';
  const rules = props.rules;

  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      errorMessage.value = rule.message || '此项为必填项';
      return false;
    }
    if (rule.pattern && value && !rule.pattern.test(value)) {
      errorMessage.value = rule.message || '格式不正确';
      return false;
    }
    if (typeof rule.min === 'number' && value.length < rule.min) {
      errorMessage.value = rule.message || `最少输入 ${rule.min} 个字符`;
      return false;
    }
    if (typeof rule.max === 'number' && value.length > rule.max) {
      errorMessage.value = rule.message || `最多输入 ${rule.max} 个字符`;
      return false;
    }
    if (rule.validator) {
      const result = rule.validator(value);
      if (result === false) {
        errorMessage.value = rule.message || '校验不通过';
        return false;
      }
      if (typeof result === 'string') {
        errorMessage.value = result;
        return false;
      }
    }
  }

  errorMessage.value = '';
  return true;
}

/** 清空错误 */
function clearError() {
  errorMessage.value = '';
}

/** 暴露 validate 给父组件调用 */
defineExpose({
  validate,
  clearError,
  inputRef,
});

// 监听值变化，如果是 input 触发器则实时校验
watch(
  () => props.modelValue,
  () => {
    if (touched.value) {
      const inputRules = getRulesByTrigger('input');
      if (inputRules.length > 0) {
        validate();
      } else {
        clearError();
      }
    }
  },
);

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  touched.value = true;
  emit('blur', event);
  const blurRules = getRulesByTrigger('blur');
  if (blurRules.length > 0 || props.rules.length === 0) {
    // 默认 blur 时触发全部校验
    validate();
  }
};

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
  // 聚焦时清除错误状态
  clearError();
};

const handleChange = (event: Event) => {
  emit('change', event);
  const changeRules = getRulesByTrigger('change');
  if (changeRules.length > 0) {
    validate();
  }
};

const handleClear = () => {
  emit('update:modelValue', '');
  errorMessage.value = '';
  emit('clear');
  inputRef.value?.focus();
};

function togglePasswordVisible() {
  passwordVisible.value = !passwordVisible.value;
}
</script>

<style scoped lang="scss">
@use './index.scss' as *;

.ao-input {
  // 由 watchEffect 动态设置
  --input-color: #409eff;
  --input-focus-color: #409eff;
  --input-focus-shadow: rgba(64, 158, 255, 0.15);
  // 静态变量
  --input-border-color: #dcdfe6;
  --input-text-color: #303133;
  --input-placeholder-color: #c0c4cc;
  --input-icon-color: #a8abb2;
  --input-error-color: #f56c6c;
  --input-error-shadow: rgba(245, 108, 108, 0.15);
  --input-bg: #fff;
}

.icon-clear {
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.7;
  }
}

.icon-back {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
