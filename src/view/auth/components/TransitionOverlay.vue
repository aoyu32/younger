<template>
  <Transition name="overlay">
    <div v-if="overlayVisible" class="auth-overlay flex-center">
      <div class="overlay-logo">
        <AoImage src="@/assets/logo.svg" width="48px" />
        <p class="overlay-text">{{ overlayText }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useAuthTransition } from '@/hooks/useAuthTransition';

const { overlayVisible, overlayText } = useAuthTransition();
</script>

<style lang="scss" scoped>
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
}

.overlay-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  p {
    font-family: var(--ao-font-family-ali);
    color: var(--ao-gray-9);
    font-size: var(--ao-font-size-xxl);
    margin-top: 15px;
  }

  .overlay-text {
    margin-top: 8px;
    font-size: var(--ao-font-size-sm);
    opacity: 0.7;
  }
}

.overlay-enter-active {
  transition: opacity 0.3s ease;
}

.overlay-leave-active {
  transition: none;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
