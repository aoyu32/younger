<template>
  <div
    class="bottom-line-textarea"
    :class="{ 'is-disabled': disabled }"
    :style="{ '--bottom-line-textarea-min-height': `${minHeight}px` }"
  >
    <textarea
      ref="textareaRef"
      class="bottom-line-textarea__inner"
      :value="modelValue"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :disabled="disabled"
      :readonly="readonly"
      @input="handleInput"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    ></textarea>

    <!-- 字符计数：右下角、压在下划线之上 -->
    <span
      v-if="countVisible"
      class="bottom-line-textarea__count"
      :class="{ 'is-limit': isCountLimit }"
    >
      {{ countText }}
    </span>

    <!-- 下划线：挂载时由左向右生长到整宽，聚焦时换成品牌色 -->
    <span class="bottom-line-textarea__line" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts">
/**
 * 下划线多行输入框
 * 只保留下边框：出现时下划线由 0 生长到整宽，聚焦时换成品牌色；尺寸固定，不可拖拽调整。
 * 用于「我的资料」编辑态中的个人介绍；内边距与查看态内容块保持一致，切换编辑时不横跳。
 * @author LiangQiYang
 * @date 2026-10-15
 */
import { computed, onMounted, ref } from 'vue';

defineOptions({ name: 'BottomLineTextarea' });

/**
 * @property {string} modelValue - v-model 绑定的值
 * @property {string} placeholder - 占位文本
 * @property {number} maxlength - 最大输入长度
 * @property {number} minHeight - 最小高度（px），用于对齐查看态内容块
 * @property {boolean} showCount - 是否显示字符计数；不传时默认「有 maxlength 就显示」
 * @property {boolean} disabled - 是否禁用
 * @property {boolean} readonly - 是否只读
 * @property {boolean} autofocus - 挂载后是否自动聚焦
 */
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    maxlength?: number;
    minHeight?: number;
    showCount?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    autofocus?: boolean;
  }>(),
  {
    modelValue: '',
    placeholder: '',
    maxlength: undefined,
    minHeight: 200,
    showCount: undefined,
    disabled: false,
    readonly: false,
    autofocus: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'focus', event: FocusEvent): void;
  (e: 'blur', event: FocusEvent): void;
}>();

const textareaRef = ref<HTMLTextAreaElement>();

/** 是否显示字符计数：显式传入优先，否则有 maxlength 就显示 */
const countVisible = computed(
  () => props.showCount ?? props.maxlength !== undefined,
);

/** 计数文案：有最大长度时显示「当前/最大」，否则只显示当前字数 */
const countText = computed(() =>
  props.maxlength === undefined
    ? String(props.modelValue.length)
    : `${props.modelValue.length}/${props.maxlength}`,
);

/** 是否已达上限：用于给计数换提示色 */
const isCountLimit = computed(
  () => props.maxlength !== undefined && props.modelValue.length >= props.maxlength,
);

/** 输入时同步 v-model */
function handleInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLTextAreaElement).value);
}

onMounted(() => {
  if (props.autofocus) textareaRef.value?.focus();
});

defineExpose({
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
});
</script>

<style scoped lang="scss">
.bottom-line-textarea {
  /* 内边距与下划线厚度可按场景覆盖 */
  --bottom-line-textarea-padding: var(--ao-spacing-sm);
  --bottom-line-textarea-line-width: var(--ao-border-width-thin);

  position: relative;
  display: block;
  width: 100%;
}

.bottom-line-textarea__inner {
  display: block;
  width: 100%;
  min-height: var(--bottom-line-textarea-min-height, 200px);
  /* 内边距与查看态内容块一致，切换编辑时文字不横跳 */
  padding: var(--bottom-line-textarea-padding);
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  font-family: inherit;
  font-size: var(--ao-font-size-sm);
  line-height: var(--ao-line-height-base);
  color: var(--ao-color-text-base);
  /* 尺寸固定，去掉原生拖拽手柄 */
  resize: none;
  outline: none;

  &::placeholder {
    color: var(--ao-color-text-disabled);
  }
}

/* 字符计数：贴右下角，压在下划线之上 */
.bottom-line-textarea__count {
  position: absolute;
  right: var(--bottom-line-textarea-padding);
  bottom: var(--ao-spacing-xxs);
  font-size: var(--ao-font-size-xs);
  line-height: 1;
  color: var(--ao-color-text-disabled);
  /* 不挡鼠标，点到计数字上也能聚焦输入框 */
  pointer-events: none;
  transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

  /* 到上限时换个提示色 */
  &.is-limit {
    color: var(--ao-color-warning);
  }
}

.bottom-line-textarea__line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: var(--bottom-line-textarea-line-width);
  background-color: var(--ao-color-border);
  /* 由左端开始生长 */
  transform-origin: left center;
  animation: bottom-line-textarea-grow var(--ao-duration-base)
    var(--ao-ease-out) both;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);
}

/* 聚焦只换色不加粗，避免线条变重 */
.bottom-line-textarea:focus-within .bottom-line-textarea__line {
  background-color: var(--ao-color-primary);
}

.bottom-line-textarea.is-disabled {
  .bottom-line-textarea__inner {
    color: var(--ao-color-text-disabled);
    cursor: not-allowed;
  }

  .bottom-line-textarea__line {
    background-color: var(--ao-color-border-secondary);
  }
}

/* 下划线宽度由 0 到整宽 */
@keyframes bottom-line-textarea-grow {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
