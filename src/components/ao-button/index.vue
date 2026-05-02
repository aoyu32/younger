<template>
  <button
    class="ao-button"
    :class="[`ao-button--${type}`, `ao-button--${size}`]"
    :style="buttonStyle"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
      color: '#ff5722',
      width: '1px'
    })
  }
})

const emit = defineEmits(['click'])

const buttonStyle = computed(() => {
  const style: Record<string, string> = {}

  if (props.type === 'fill') {
    style.backgroundColor = props.bg
    style.color = props.color
    style.border = `${props.border.width} solid ${props.border.color}`
  } else {
    // text 类型
    style.backgroundColor = 'transparent'
    style.border = 'none'
    // 如果未显式覆盖颜色，文字颜色默认使用主色（bg）
    style.color = props.color === '#fff' ? props.bg : props.color
  }

  return style
})

const handleClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>