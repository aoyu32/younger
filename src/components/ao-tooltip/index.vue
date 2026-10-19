<template>
  <span
    class="ao-tooltip"
    @mouseenter="open"
    @mouseleave="close"
    @focusin="open"
    @focusout="close"
  >
    <slot />
    <span
      v-if="!disabled"
      class="ao-tooltip__content"
      :class="[`ao-tooltip__content--${placement}`, { 'is-visible': visible }]"
      :style="contentStyle"
      role="tooltip"
      :aria-hidden="!visible"
    >
      <slot name="content">{{ content }}</slot>
      <svg
        class="ao-tooltip__arrow"
        viewBox="0 0 20 6"
        width="20"
        height="6"
        aria-hidden="true"
      >
        <path
          d="M0 0 C5 0 7 1.8 8.5 4.6 C9.3 6.1 10.7 6.1 11.5 4.6 C13 1.8 15 0 20 0 Z"
        />
      </svg>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { CSSProperties } from 'vue';

defineOptions({
  name: 'ao-tooltip',
});

const props = withDefaults(
  defineProps<{
    content?: string;
    placement?: 'top' | 'bottom' | 'left' | 'right';
    background?: string;
    color?: string;
    offset?: number;
    maxWidth?: string | number;
    disabled?: boolean;
    openDelay?: number;
    closeDelay?: number;
  }>(),
  {
    content: '',
    placement: 'top',
    background: 'var(--ao-gray-6)',
    color: 'var(--ao-gray-0)',
    offset: 8,
    maxWidth: 240,
    disabled: false,
    openDelay: 0,
    closeDelay: 60,
  },
);

const visible = ref(false);

const contentStyle = computed(
  () =>
    ({
      '--ao-tooltip-bg': props.background,
      '--ao-tooltip-color': props.color,
      '--ao-tooltip-offset': `${props.offset}px`,
      '--ao-tooltip-max-width':
        typeof props.maxWidth === 'number'
          ? `${props.maxWidth}px`
          : props.maxWidth,
    }) as CSSProperties,
);

let timer: ReturnType<typeof setTimeout> | undefined;

const clearTimer = () => {
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
};

const open = () => {
  if (props.disabled) return;
  clearTimer();
  if (props.openDelay > 0) {
    timer = setTimeout(() => (visible.value = true), props.openDelay);
  } else {
    visible.value = true;
  }
};

const close = () => {
  clearTimer();
  if (props.closeDelay > 0) {
    timer = setTimeout(() => (visible.value = false), props.closeDelay);
  } else {
    visible.value = false;
  }
};

watch(
  () => props.disabled,
  (disabled) => {
    if (disabled) {
      clearTimer();
      visible.value = false;
    }
  },
);

onBeforeUnmount(clearTimer);
</script>

<style scoped lang="scss" src="./index.scss"></style>
