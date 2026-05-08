<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({
  showSpinner: false,
  minimum: 0,
  easing: 'ease',
  speed: 200,
});

let ticking = false;
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const maxProgress = 0.9999999;
      const progress =
        docHeight > 0 ? Math.min(scrollTop / docHeight, maxProgress) : 0;
      NProgress.set(progress);
      ticking = false;
    });
    ticking = true;
  }
};

onMounted(() => {
  NProgress.set(0);
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  NProgress.remove();
});
</script>

<style lang="scss">
#nprogress .bar {
  z-index: 99999;
  background: var(--app-primary-color);
  height: 3px;
}
</style>
