<template>
  <!-- 默认：完整版详情；带 mode=classic 时回到原版（简版） -->
  <AppDetailMain v-if="!isClassic" />
  <AppDetailResponsive v-else-if="isResponsive" />
  <AppDetailDesktop v-else />
</template>

<script setup lang="ts">
import {
  computed,
  defineAsyncComponent,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';
import { useRoute } from 'vue-router';
import AppDetailResponsive from './components/AppDetailResponsive.vue';
import AppDetailMain from './components/AppDetailMain.vue';

/**
 * 应用详情页双形态：
 * - 默认：AppDetailMain 完整版（卡片 + Banner + 功能块 + 介绍 + 评论）
 * - 带 ?mode=classic：回到原版详情页，桌面走 GSAP 动效版，窄屏走静态版
 */

/** 断点以 header 内容宽度（1200px）为准 */
const HEADER_CONTENT_WIDTH = 1200;

const AppDetailDesktop = defineAsyncComponent(
  () => import('./components/AppDetailDesktop.vue'),
);

const route = useRoute();
const isClassic = computed(() => route.query.mode === 'classic');

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
