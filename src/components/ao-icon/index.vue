<template>
  <span class="ao-icon" :style="iconStyle">
    <slot v-if="$slots.default"></slot>
    <component :is="icon" v-else-if="icon" />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'AoIcon',
});

const props = defineProps({
  icon: {
    type: String,
    default: undefined,
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  hoverColor: {
    type: String,
    default: undefined,
  },
  size: {
    type: [String, Number],
    default: '1em',
  },
});

const iconStyle = computed(() => {
  const size = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return {
    '--icon-color': props.color,
    '--icon-hover-color': props.hoverColor || props.color,
    width: size,
    height: size,
  };
});
</script>

<style scoped lang="scss">
.ao-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  color: var(--icon-color);
  &:hover {
    color: var(--icon-hover-color);
  }

  :deep(svg),
  :deep(svg *) {
    fill: currentColor;
    stroke: currentColor;
  }

  svg {
    width: 100%;
    height: 100%;
  }
}
</style>
