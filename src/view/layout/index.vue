<template>
  <div class="layout" :class="{ 'layout--wide': isWidePage }">
    <header>
      <LayoutHeader />
    </header>
    <main
      :style="{
        paddingTop: $route.path === '/profile' ? '5px' : 'var(-ao-spacing-sm)',
      }"
    >
      <router-view />
    </main>
    <footer>
      <LayoutFooter />
    </footer>
  </div>
</template>
<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LayoutHeader from '@/view/layout/components/Header.vue';
import LayoutFooter from '@/view/layout/components/Footer.vue';

// 组件名称
defineOptions({
  name: 'Layout',
});

const route = useRoute();

/** 宽屏页面：视频详情页需要更宽的头部内容与主内容区 */
const isWidePage = computed(() => route.name === 'video-detail');

// 响应式主题状态
const currentTheme = ref('light');

// 设置主题
const setTheme = () => {
  document.documentElement.setAttribute('data-theme', currentTheme.value);
};

// 生命周期：挂载后设置主题
onMounted(() => {
  setTheme();
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
