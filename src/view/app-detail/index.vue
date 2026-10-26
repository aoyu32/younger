<template>
  <AppDetailResponsive v-if="isResponsive" />
  <AppDetailDesktop v-else />
</template>

<script setup lang="ts">
import {
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
import AppDetailResponsive from './components/AppDetailResponsive.vue';

/**
 * 应用详情页双形态：
 * - 桌面：完整 GSAP / ScrollTrigger / Lenis 动效
 * - 响应式：纯静态布局，无动画
 *
 * 断点以 header 内容宽度（1200px）为准：
 * 可视宽度小于 1200px 时直接切换到响应式组件，避免窄屏下动效被压缩变形。
 */
const HEADER_CONTENT_WIDTH = 1200;

/**
 * 响应式版同步加载，保证窄屏首屏立即出现；
 * 桌面版异步加载，避免移动端下载 GSAP / Lenis 等桌面动画依赖。
 */
const AppDetailDesktop = defineAsyncComponent(
  () => import('./components/AppDetailDesktop.vue'),
);

const getViewportWidth = () =>
  typeof document === 'undefined'
    ? HEADER_CONTENT_WIDTH
    : document.documentElement.clientWidth;

const isResponsive = ref(getViewportWidth() < HEADER_CONTENT_WIDTH);

let resizeRaf = 0;
const syncResponsive = () => {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    isResponsive.value = getViewportWidth() < HEADER_CONTENT_WIDTH;
  });
};

onMounted(() => {
  syncResponsive();
  window.addEventListener('resize', syncResponsive);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(resizeRaf);
  window.removeEventListener('resize', syncResponsive);
});
</script>
