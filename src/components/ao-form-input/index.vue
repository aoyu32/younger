<template>
  <div class="ao-form-input">
    <div class="label-wrapper">
      <div class="label"><slot name="label">输入框标题</slot></div>
      <transition name="fade">
        <div v-if="message" class="validate-message">
          {{ message }}
        </div>
      </transition>
    </div>
    <div
      class="input-wrapper"
      :class="{
        'is-error': message,
        'is-disabled': disabled,
      }"
    >
      <div v-show="$slots['icon-front']" class="icon-front">
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
        @click.prevent="handleClear"
      >
        <slot name="clear-icon">
          <svg
            t="1786781552702"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="24565"
            width="64"
            height="64"
          >
            <path
              d="M286.208287 225.962379a42.581279 42.581279 0 0 0-60.245257 60.245257l225.96238 225.962379-225.96238 225.919713a42.623946 42.623946 0 0 0 60.245257 60.245257l225.962379-225.919713 225.919713 225.919713a42.581279 42.581279 0 1 0 60.245257-60.245257l-225.919713-225.919713 225.919713-225.962379A42.581279 42.581279 0 1 0 738.133046 225.962379l-225.919713 225.96238-225.962379-225.96238z"
              p-id="24566"
              fill="#bfbfbf"
            ></path>
          </svg>
        </slot>
      </div>
      <!-- 密码可见切换 -->
      <div
        v-else-if="type === 'password' && modelValue"
        class="icon-back"
        @click.prevent="togglePasswordVisible"
      >
        <slot :name="passwordVisible ? 'icon-eye-open' : 'icon-eye-close'">
          <svg
            v-if="!passwordVisible"
            t="1786782136854"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="24775"
            width="64"
            height="64"
          >
            <path
              d="M934.954667 494.933333C848.768 294.826667 686.72 170.666667 511.872 170.666667c-174.933333 0-336.981333 124.16-423.125333 324.266666a42.666667 42.666667 0 0 0 0 34.133334C174.933333 729.173333 336.981333 853.333333 511.872 853.333333c174.848 0 336.938667-124.16 423.082667-324.266666a42.666667 42.666667 0 0 0 0-34.133334zM511.872 768c-135.253333 0-263.168-97.706667-336.981333-256 73.813333-158.293333 201.770667-256 336.981333-256 135.168 0 263.125333 97.706667 336.938667 256-73.813333 158.293333-201.770667 256-336.938667 256z m0-426.666667a170.581333 170.581333 0 0 0-167.338667 203.946667 170.666667 170.666667 0 0 0 232.618667 124.373333 170.581333 170.581333 0 0 0 55.338667-278.314666A170.581333 170.581333 0 0 0 511.872 341.333333z m0 256a85.290667 85.290667 0 1 1 0-170.581333 85.290667 85.290667 0 0 1 0 170.581333z"
              p-id="24776"
              fill="#bfbfbf"
            ></path>
          </svg>
          <svg
            v-else
            t="1786782186753"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="24985"
            width="64"
            height="64"
          >
            <path
              d="M466.773333 259.413333A295.68 295.68 0 0 1 512 256c135.68 0 263.253333 97.706667 337.493333 256a649.813333 649.813333 0 0 1-38.4 69.973333 42.666667 42.666667 0 0 0 2.133334 49.152 42.666667 42.666667 0 0 0 70.4-4.352 673.28 673.28 0 0 0 51.626666-98.133333 42.709333 42.709333 0 0 0 0-33.706667C849.066667 294.826667 686.933333 170.666667 512 170.666667a331.52 331.52 0 0 0-59.733333 5.12 43.264 43.264 0 0 0 14.506666 85.333333v-1.706667zM158.293333 97.706667a42.837333 42.837333 0 0 0-60.586666 60.586666l132.266666 131.84a623.786667 623.786667 0 0 0-141.226666 204.8 42.666667 42.666667 0 0 0 0 34.133334C174.933333 729.173333 337.066667 853.333333 512 853.333333a395.093333 395.093333 0 0 0 215.466667-65.706666l138.24 138.666666a42.752 42.752 0 0 0 69.930666-13.866666 42.666667 42.666667 0 0 0-9.344-46.72l-768-768z m271.36 392.106666l104.533334 104.533334a85.333333 85.333333 0 0 1-104.533334-104.533334zM512 768c-135.68 0-263.253333-97.706667-337.066667-256a515.84 515.84 0 0 1 115.2-161.706667L365.653333 426.666667A170.666667 170.666667 0 0 0 597.333333 658.346667L665.173333 725.333333A308.906667 308.906667 0 0 1 512 768z"
              p-id="24986"
              fill="#bfbfbf"
            ></path>
          </svg>
        </slot>
      </div>
      <div v-else-if="$slots['icon-back']" class="icon-back">
        <slot name="icon-back"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { ValidateRule } from './types';

defineOptions({
  name: 'ao-form-input',
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
  change: [event: Event];
  clear: [];
}>();

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
  rule: {
    type: Array as () => ValidateRule[],
    default: () => [],
  },
});

const message = ref<string>('');
const inputRef = ref<HTMLInputElement | null>(null);
const rootRef = ref<HTMLDivElement | null>(null);
const passwordVisible = ref(false);
const resolvedType = ref(props.type);
const focused = ref<boolean>();

watchEffect(() => {
  if (props.type === 'password') {
    resolvedType.value = passwordVisible.value ? 'text' : 'password';
  } else {
    resolvedType.value = props.type;
  }
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const handleBlur = (event: FocusEvent) => {
  focused.value = true;
  emit('blur', event);
  const blurRules = getRulesByTrigger('blur');
  if (blurRules.length > 0 || props.rule.length === 0) {
    // 默认 blur 时触发全部校验
    validate();
  }
};

/** 执行校验，返回 true 表示通过 */
function validate(): boolean {
  const value = props.modelValue ?? '';
  const rules = props.rule;

  for (const rule of rules) {
    if (rule.required && !value.trim()) {
      message.value = rule.message || '此项为必填项';
      return false;
    }
    if (rule.pattern && value && !rule.pattern.test(value)) {
      message.value = rule.message || '格式不正确';
      return false;
    }
    if (typeof rule.min === 'number' && value.length < rule.min) {
      message.value = rule.message || `最少输入 ${rule.min} 个字符`;
      return false;
    }
    if (typeof rule.max === 'number' && value.length > rule.max) {
      message.value = rule.message || `最多输入 ${rule.max} 个字符`;
      return false;
    }
    if (rule.validator) {
      const result = rule.validator(value);
      if (result === false) {
        message.value = rule.message || '校验不通过';
        return false;
      }
      if (typeof result === 'string') {
        message.value = result;
        return false;
      }
    }
  }

  message.value = '';
  return true;
}

function getRulesByTrigger(trigger: ValidateRule['trigger']): ValidateRule[] {
  return props.rule.filter((r) => !r.trigger || r.trigger === trigger);
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event);
  // 聚焦时清除错误状态
  clearError();
};

const clearError = () => {
  message.value = '';
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
  message.value = '';
  emit('clear');
  inputRef.value?.focus();
};

const togglePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
};

defineExpose({
  validate,
  clearError,
  inputRef,
});
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
