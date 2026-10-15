<template>
  <div
    ref="rootRef"
    class="bottom-line-select"
    :class="{ 'is-open': isOpen, 'is-disabled': disabled }"
    @keydown="handleKeydown"
  >
    <!-- 触发器：左侧展示选中项/占位文本，右侧下拉箭头 -->
    <button
      ref="triggerRef"
      type="button"
      class="bottom-line-select__trigger"
      role="combobox"
      :aria-expanded="isOpen"
      :disabled="disabled"
      @click="toggle"
    >
      <span
        class="bottom-line-select__text"
        :class="{ 'is-placeholder': !selectedOption }"
      >
        {{ selectedOption ? selectedOption.label : placeholder }}
      </span>
      <img
        class="bottom-line-select__arrow"
        :src="arrowDownIcon"
        alt=""
        aria-hidden="true"
      />
    </button>

    <!-- 下划线：出现时由左向右生长，展开时换成品牌色 -->
    <span class="bottom-line-select__line" aria-hidden="true"></span>

    <!-- 下拉面板 -->
    <Transition name="bottom-line-select-drop">
      <ul v-if="isOpen" class="bottom-line-select__panel" role="listbox">
        <li
          v-for="(option, index) in options"
          :key="option.value"
          class="bottom-line-select__option"
          :class="{
            'is-selected': option.value === modelValue,
            'is-active': index === activeIndex,
            'is-disabled': option.disabled,
          }"
          role="option"
          :aria-selected="option.value === modelValue"
          :aria-disabled="option.disabled"
          @click="handleSelect(option)"
          @mouseenter="activeIndex = index"
        >
          {{ option.label }}
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number = string">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import arrowDownIcon from '@/assets/profile/icon_arrow_down.svg?url';

/** 下拉选项结构：label 用于展示，value 用于绑定 */
export interface BottomLineSelectOption<T = string | number> {
  /** 展示文本 */
  label: string;
  /** 绑定值，类型由业务数据决定 */
  value: T;
  /** 是否禁用该选项 */
  disabled?: boolean;
}

/**
 * 下划线下拉选择框
 * 只有一条下划线：出现时由 0 生长到整宽；点击展开面板，展开时下划线换成品牌色、
 * 箭头翻转。选项由 options 传入，组件本身不关心业务数据，可复用到任意下拉场景。
 * @author LiangQiYang
 * @date 2026-10-15
 */
defineOptions({ name: 'BottomLineSelect' });

/**
 * @property {T} modelValue - v-model 绑定的值，类型跟随 options
 * @property {BottomLineSelectOption<T>[]} options - 下拉选项
 * @property {string} placeholder - 未选中时的占位文本
 * @property {boolean} disabled - 是否禁用
 */
const props = withDefaults(
  defineProps<{
    modelValue?: T;
    options?: BottomLineSelectOption<T>[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    placeholder: '请选择',
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void;
  (e: 'change', value: T, option: BottomLineSelectOption<T>): void;
}>();

const rootRef = ref<HTMLElement>();
const triggerRef = ref<HTMLButtonElement>();
const isOpen = ref(false);
/** 键盘操作的高亮项下标，-1 表示无高亮 */
const activeIndex = ref(-1);

/** 当前选中项：找不到匹配值时按未选中处理，回退到占位文本 */
const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue),
);

function toggle() {
  if (isOpen.value) close();
  else open();
}

/** 展开面板，并把高亮定位到当前选中项 */
function open() {
  if (props.disabled) return;
  isOpen.value = true;
  activeIndex.value = props.options.findIndex(
    (option) => option.value === props.modelValue,
  );
}

/** 收起面板，并把焦点交还触发器，便于继续键盘操作 */
function close() {
  isOpen.value = false;
  activeIndex.value = -1;
  triggerRef.value?.focus();
}

/** 选中选项 */
function handleSelect(option: BottomLineSelectOption<T>) {
  if (option.disabled) return;
  emit('update:modelValue', option.value);
  emit('change', option.value, option);
  close();
}

/** 上下键移动高亮：跳过禁用项并循环 */
function moveActive(step: number) {
  const total = props.options.length;
  if (!total) return;
  let next = activeIndex.value;
  for (let i = 0; i < total; i++) {
    next = (next + step + total) % total;
    if (!props.options[next].disabled) break;
  }
  activeIndex.value = next;
}

/**
 * 键盘操作：上下键移动高亮、回车选中、Esc 收起
 * 未展开时的回车/空格交给按钮原生行为（即展开面板）
 */
function handleKeydown(event: KeyboardEvent) {
  if (props.disabled) return;
  const { key } = event;

  if (key === 'Escape') {
    if (!isOpen.value) return;
    event.stopPropagation();
    close();
    return;
  }

  if (!isOpen.value) {
    if (key === 'ArrowDown') {
      event.preventDefault();
      open();
    }
    return;
  }

  if (key === 'ArrowDown' || key === 'ArrowUp') {
    event.preventDefault();
    moveActive(key === 'ArrowDown' ? 1 : -1);
    return;
  }

  if (key === 'Enter') {
    // 阻止按钮的原生点击，改为选中高亮项
    event.preventDefault();
    const option = props.options[activeIndex.value];
    if (option) handleSelect(option);
  }
}

/** 点击组件外部时收起面板 */
function handleDocumentClick(event: MouseEvent) {
  const target = event.target as Node | null;
  if (target && rootRef.value?.contains(target)) return;
  isOpen.value = false;
  activeIndex.value = -1;
}

watch(isOpen, (open) => {
  if (open) document.addEventListener('click', handleDocumentClick, true);
  else document.removeEventListener('click', handleDocumentClick, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocumentClick, true);
});

defineExpose({ open, close });
</script>

<style scoped lang="scss">
.bottom-line-select {
  /* 高度与下划线厚度可按场景覆盖 */
  --bottom-line-select-height: 32px;
  --bottom-line-select-line-width: var(--ao-border-width-thin);

  position: relative;
  display: block;
  width: 100%;
}

.bottom-line-select__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ao-spacing-xs);
  width: 100%;
  height: var(--bottom-line-select-height);
  padding: 0;
  box-sizing: border-box;
  border: none;
  background-color: transparent;
  font-family: inherit;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-base);
  text-align: left;
  cursor: pointer;
  outline: none;

  &:disabled {
    cursor: not-allowed;
  }
}

.bottom-line-select__text {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  /* 未选中时按占位文本样式展示 */
  &.is-placeholder {
    color: var(--ao-color-text-disabled);
  }
}

.bottom-line-select__arrow {
  flex-shrink: 0;
  width: 14px;
  height: auto;
  /* 图标固定色，用透明度区分常态/激活态 */
  opacity: 0.75;
  transition:
    transform var(--ao-duration-fast) var(--ao-ease-in-out),
    opacity var(--ao-duration-fast) var(--ao-ease-in-out);
}

.bottom-line-select__line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: var(--bottom-line-select-line-width);
  background-color: var(--ao-color-border);
  /* 由左端开始生长 */
  transform-origin: left center;
  animation: bottom-line-select-grow var(--ao-duration-base) var(--ao-ease-out)
    both;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);
}

/* 展开或键盘聚焦：下划线换成品牌色 */
.bottom-line-select.is-open,
.bottom-line-select:focus-within {
  .bottom-line-select__line {
    background-color: var(--ao-color-primary);
  }
}

.bottom-line-select__trigger:hover .bottom-line-select__arrow,
.bottom-line-select.is-open .bottom-line-select__arrow {
  opacity: 1;
}

/* 展开时箭头翻转 */
.bottom-line-select.is-open .bottom-line-select__arrow {
  transform: rotate(180deg);
}

.bottom-line-select.is-disabled {
  .bottom-line-select__text,
  .bottom-line-select__arrow {
    color: var(--ao-color-text-disabled);
    opacity: 0.4;
  }

  .bottom-line-select__line {
    background-color: var(--ao-color-border-secondary);
  }
}

/* 下拉面板 */
.bottom-line-select__panel {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  /* 宽度不跟死触发器，长选项可自然撑开 */
  min-width: 100%;
  max-height: 240px;
  margin: 0;
  padding: var(--ao-spacing-xxs) 0;
  box-sizing: border-box;
  overflow-y: auto;
  list-style: none;
  background-color: var(--ao-color-bg-elevated);
  border-radius: var(--ao-border-radius-base);
  box-shadow: var(--ao-shadow-md);
}

.bottom-line-select__option {
  height: 32px;
  padding: 0 var(--ao-spacing-sm);
  line-height: 32px;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover,
  &.is-active {
    background-color: var(--ao-gray-2);
  }

  &.is-selected {
    color: var(--ao-color-primary);
    font-weight: var(--ao-font-weight-medium);
  }

  &.is-disabled {
    color: var(--ao-color-text-disabled);
    cursor: not-allowed;
  }
}

/* 面板下落展开 */
.bottom-line-select-drop-enter-active,
.bottom-line-select-drop-leave-active {
  transition:
    opacity var(--ao-duration-fast) var(--ao-ease-out),
    transform var(--ao-duration-fast) var(--ao-ease-out);
}

.bottom-line-select-drop-enter-from,
.bottom-line-select-drop-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* 下划线宽度由 0 到整宽 */
@keyframes bottom-line-select-grow {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
