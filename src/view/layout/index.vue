<template>
  <div
    class="layout"
    :class="{ 'layout--wide': isWidePage, 'layout--totorial': isTotorialPage }"
  >
    <header>
      <LayoutHeader />
    </header>
    <main
      :style="{
        paddingTop: `${mainPaddingTop}px`,
      }"
    >
      <router-view />
    </main>
    <footer>
      <LayoutFooter />
    </footer>
    <EdgeBar />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LayoutHeader from '@/view/layout/components/Header.vue';
import LayoutFooter from '@/view/layout/components/Footer.vue';
import EdgeBar from '@/view/layout/components/EdgeBar.vue';

// 组件名称
defineOptions({
  name: 'Layout',
});

const route = useRoute();

/** 宽屏页面：视频详情页、教程页需要更宽的头部内容与主内容区 */
const isWidePage = computed(() =>
  ['video-detail', 'totorial'].includes(String(route.name)),
);

/** 教程页内容宽度：1500px */
const isTotorialPage = computed(() => route.name === 'totorial');

// 响应式主题状态
const currentTheme = ref('light');

// 设置主题
const setTheme = () => {
  document.documentElement.setAttribute('data-theme', currentTheme.value);
};

/** 主内容区上内边距：个人中心 5px、其他页面 12px */
const mainPaddingTop = computed(() => {
  if (route.path === '/profile') return 5;
  return 12;
});

// 生命周期：挂载后设置主题
onMounted(() => {
  setTheme();
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
