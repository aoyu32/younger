<template>
  <button
    ref="buttonRef"
    class="ao-button-btn"
    :class="{
      'is-text': text,
      'is-plain': plain,
    }"
    :style="{ '--aobtn-bg': bg }"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { AoButtonProps } from './types'

defineOptions({ name: 'ao-button' })

const props = withDefaults(defineProps<AoButtonProps>(), {
  bg: '#009fa7',
  text: false,
  plain: false,
  disabled: false,
})

const emit = defineEmits<{
  click: [e: MouseEvent]
}>()

const buttonRef = ref<HTMLButtonElement>()

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.replace('#', '')
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  }
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function updateCssVars() {
  buttonRef.value?.style.setProperty('--aobtn-hover-bg', hexToRgba(props.bg, 0.7))
  buttonRef.value?.style.setProperty('--aobtn-active-bg', hexToRgba(props.bg, 0.5))
}

onMounted(updateCssVars)
watch(() => props.bg, updateCssVars)

const handleClick = (e: MouseEvent) => {
  if (!props.disabled) {
    emit('click', e)
  }
}
</script>

<style scoped src="./index.css"></style>
