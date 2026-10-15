<template>
  <div class="bottom-line-switch" :class="{ 'is-disabled': disabled }">
    <!-- 触发器：左侧当前值，右侧切换图标；点击（或回车/空格）在选项之间轮换 -->
    <button
      ref="triggerRef"
      type="button"
      class="bottom-line-switch__trigger"
      :disabled="disabled"
      @click="toggle"
    >
      <span
        class="bottom-line-switch__text"
        :class="{ 'is-placeholder': !currentOption }"
      >
        {{ currentOption ? currentOption.label : placeholder }}
      </span>
      <img
        class="bottom-line-switch__icon"
        :src="switchIcon"
        alt=""
        aria-hidden="true"
        :style="{ transform: `rotate(${iconAngle}deg)` }"
      />
    </button>

    <!-- 下划线：出现时由左向右生长，聚焦时换成品牌色 -->
    <span class="bottom-line-switch__line" aria-hidden="true"></span>
  </div>
</template>

<script setup lang="ts" generic="T extends string | number = string">
/**
 * 下划线切换框
 * 只有一条下划线：出现时由 0 生长到整宽。左侧展示当前值，右侧是切换图标，
 * 点击在选项之间轮换（两个值即「男/女」这种互切）；图标每次点击转 180°，呼应「切换」。
 * @author LiangQiYang
 * @date 2026-10-15
 */
import { computed, ref } from 'vue';
import switchIcon from '@/assets/profile/icon_switch.svg?url';

/** 切换项结构：label 用于展示，value 用于绑定 */
export interface BottomLineSwitchOption<T = string | number> {
  /** 展示文本 */
  label: string;
  /** 绑定值，类型由业务数据决定 */
  value: T;
  /** 是否禁用该项（禁用项不参与轮换） */
  disabled?: boolean;
}

defineOptions({ name: 'BottomLineSwitch' });

/**
 * @property {T} modelValue - v-model 绑定的值，类型跟随 options
 * @property {BottomLineSwitchOption<T>[]} options - 可切换的选项
 * @property {string} placeholder - 值为空时的占位文本
 * @property {boolean} disabled - 是否禁用
 */
const props = withDefaults(
  defineProps<{
    modelValue?: T;
    options?: BottomLineSwitchOption<T>[];
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    modelValue: undefined,
    options: () => [],
    placeholder: '未设置',
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void;
  (e: 'change', value: T, option: BottomLineSwitchOption<T>): void;
}>();

const triggerRef = ref<HTMLButtonElement>();
/** 图标累计旋转角度：每次切换 +180°，让「交换」有反馈 */
const iconAngle = ref(0);

/** 当前值对应的选项：没匹配上时按未设置处理 */
const currentOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue),
);

/** 参与轮换的选项（跳过禁用项） */
const selectableOptions = computed(() =>
  props.options.filter((option) => !option.disabled),
);

/** 切换到下一个值：位于末尾时回到第一个；当前值无效时取第一个 */
function toggle() {
  if (props.disabled) return;
  const { length } = selectableOptions.value;
  if (!length) return;
  const currentIndex = selectableOptions.value.findIndex(
    (option) => option.value === props.modelValue,
  );
  const next = selectableOptions.value[(currentIndex + 1) % length];
  iconAngle.value += 180;
  emit('update:modelValue', next.value);
  emit('change', next.value, next);
}

defineExpose({ toggle, triggerRef });
</script>

<style scoped lang="scss">
.bottom-line-switch {
  /* 高度与下划线厚度可按场景覆盖 */
  --bottom-line-switch-height: 32px;
  --bottom-line-switch-line-width: var(--ao-border-width-thin);

  position: relative;
  width: 100%;
}

.bottom-line-switch__trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ao-spacing-xs);
  width: 100%;
  height: var(--bottom-line-switch-height);
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

.bottom-line-switch__text {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  /* 值为空时按占位文本样式展示 */
  &.is-placeholder {
    color: var(--ao-color-text-disabled);
  }
}

.bottom-line-switch__icon {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  /* 图标固定色，用透明度区分常态/激活态 */
  opacity: 0.75;
  transition:
    transform var(--ao-duration-base) var(--ao-ease-out),
    opacity var(--ao-duration-fast) var(--ao-ease-in-out);
}

.bottom-line-switch__trigger:hover .bottom-line-switch__icon {
  opacity: 1;
}

.bottom-line-switch__line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: var(--bottom-line-switch-line-width);
  background-color: var(--ao-color-border);
  /* 由左端开始生长 */
  transform-origin: left center;
  animation: bottom-line-switch-grow var(--ao-duration-base) var(--ao-ease-out)
    both;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);
}

/* 聚焦（点过之后即处于聚焦态）：下划线换成品牌色 */
.bottom-line-switch:focus-within {
  .bottom-line-switch__line {
    background-color: var(--ao-color-primary);
  }
}

.bottom-line-switch.is-disabled {
  .bottom-line-switch__text {
    color: var(--ao-color-text-disabled);
  }

  .bottom-line-switch__icon {
    opacity: 0.4;
  }

  .bottom-line-switch__line {
    background-color: var(--ao-color-border-secondary);
  }
}

/* 下划线宽度由 0 到整宽 */
@keyframes bottom-line-switch-grow {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
