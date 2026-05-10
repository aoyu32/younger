<template>
  <button
    ref="buttonRef"
    class="ao-button"
    :class="[`ao-button--${type}`, `ao-button--${size}`]"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'

defineOptions({ name: 'AoButton' })

const props = defineProps({
  type: {
    type: String,
    default: 'fill'
  },
  size: {
    type: String,
    default: 'normal'
  },
  bg: {
    type: String,
    default: '#ff5722'
  },
  color: {
    type: String,
    default: '#fff'
  },
  border: {
    type: Object,
    default: () => ({
      color: 'none',
      width: '1px'
    })
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonRef = ref<HTMLButtonElement | null>(null)

/**
 * 将十六进制颜色转换为 rgba 格式
 * @param hex - 十六进制颜色（带或不带 #）
 * @param alpha - 透明度，默认 0.8
 * @returns rgba 颜色字符串
 */
function hexToRgba(hex: string, alpha: number = 0.8): string {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

watchEffect(() => {
  const el = buttonRef.value
  if (!el) return

  const { type, bg, color, border } = props

  if (type === 'fill') {
    el.style.setProperty('--btn-bg', bg)
    el.style.setProperty('--btn-color', color)
    el.style.setProperty('--btn-border', `${border.width} solid ${border.color}`)
    el.style.setProperty('--btn-bg-alpha', hexToRgba(bg, 0.8))
  } else {
    el.style.setProperty('--btn-bg', 'transparent')
    el.style.setProperty('--btn-border', 'none')
    el.style.setProperty('--btn-color', color === '#fff' ? bg : color)
  }
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped lang="scss">
@use './index.scss' as *;

.ao-button {
  background-color: var(--btn-bg);
  color: var(--btn-color);
  border: var(--btn-border);

  &:hover:not(:disabled) {
    background-color: var(--btn-bg-alpha);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>