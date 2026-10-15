<template>
  <div class="bottom-line-input" :class="{ 'is-disabled': disabled }">
    <input
      ref="inputRef"
      class="bottom-line-input__inner"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
      @keyup.enter="emit('enter', $event)"
    />

    <!-- 下划线：挂载时由左向右生长到整宽，聚焦时换成品牌色 -->
    <span class="bottom-line-input__line" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

/**
 * 下划线输入框
 * 只保留下边框：出现时下划线由 0 生长到整宽，聚焦时换成品牌色。
 * 用于「我的资料」编辑态中需要输入基础内容的字段（昵称、用户名、职业等）。
 * @author LiangQiYang
 * @date 2026-10-15
 */
defineOptions({ name: 'BottomLineInput' });

/**
 * @property {string} modelValue - v-model 绑定的值
 * @property {string} type - 原生 input 类型，默认 text
 * @property {string} placeholder - 占位文本
 * @property {number} maxlength - 最大输入长度
 * @property {boolean} disabled - 是否禁用
 * @property {boolean} readonly - 是否只读
 * @property {boolean} autofocus - 挂载后是否自动聚焦（编辑态首个字段用）
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    type?: string;
    placeholder?: string;
    maxlength?: number;
    disabled?: boolean;
    readonly?: boolean;
    autofocus?: boolean;
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    maxlength: undefined,
    disabled: false,
    readonly: false,
    autofocus: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
  (e: 'enter', event: KeyboardEvent): void;
}>();

const inputRef = ref<HTMLInputElement>();

/** 输入时同步 v-model */
function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

onMounted(() => {
  if (props.autofocus) inputRef.value?.focus();
});

defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
});
</script>

<style scoped lang="scss">
.bottom-line-input {
  /* 高度、下划线厚度可按场景覆盖 */
  --bottom-line-input-height: 32px;
  --bottom-line-input-line-width: var(--ao-border-width-thin);

  position: relative;
  display: block;
  width: 100%;
}

.bottom-line-input__inner {
  display: block;
  width: 100%;
  height: var(--bottom-line-input-height);
  /* 不留内边距，与查看态文本左对齐，切换时不横跳 */
  padding: 0;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  font-family: inherit;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-base);
  outline: none;

  &::placeholder {
    color: var(--ao-color-text-disabled);
  }
}

.bottom-line-input__line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: var(--bottom-line-input-line-width);
  background-color: var(--ao-color-border);
  /* 由左端开始生长 */
  transform-origin: left center;
  animation: bottom-line-grow var(--ao-duration-base) var(--ao-ease-out) both;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);
}

/* 聚焦只换色不加粗，避免线条变重 */
.bottom-line-input:focus-within .bottom-line-input__line {
  background-color: var(--ao-color-primary);
}

.bottom-line-input.is-disabled {
  cursor: not-allowed;

  .bottom-line-input__inner {
    color: var(--ao-color-text-disabled);
    cursor: not-allowed;
  }

  .bottom-line-input__line {
    background-color: var(--ao-color-border-secondary);
  }
}

/* 下划线宽度由 0 到整宽 */
@keyframes bottom-line-grow {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
