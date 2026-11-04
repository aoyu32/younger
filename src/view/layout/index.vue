<template>
  <div
    class="layout"
    :class="{
      'layout--wide': isWidePage,
      'layout--totorial': isTotorialPage,
      'layout--topic': isTopicPage,
    }"
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
    <footer v-if="!isTopicPage">
      <LayoutFooter />
    </footer>
    <EdgeBarBlocks @click="handleEdgeBarClick" />
    <FeedbackDialog v-if="feedbackMounted" v-model="feedbackVisible" />
  </div>
</template>
<script setup lang="ts">
import { computed, defineAsyncComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import LayoutHeader from '@/view/layout/components/Header.vue';
import LayoutFooter from '@/view/layout/components/Footer.vue';
import EdgeBarBlocks from '@/view/layout/components/EdgeBarBlocks.vue';

// 反馈弹窗包含 Markdown 编辑器，首次点击反馈时再按需加载
const FeedbackDialog = defineAsyncComponent(
  () => import('@/view/layout/components/FeedbackDialog.vue'),
);

// 组件名称
defineOptions({
  name: 'Layout',
});

const route = useRoute();

/** 反馈弹窗显隐 */
const feedbackVisible = ref(false);
/** 是否已加载反馈弹窗（含 Markdown 编辑器，按需加载） */
const feedbackMounted = ref(false);

/** 边缘侧边栏点击：目前仅“反馈”需要打开弹窗 */
const handleEdgeBarClick = (key: string) => {
  if (key === 'feedback') {
    feedbackMounted.value = true;
    feedbackVisible.value = true;
  }
};

/** 宽屏页面：视频详情页、教程页、今日话题页需要更宽的头部内容与主内容区 */
const isWidePage = computed(() =>
  ['video-detail', 'totorial', 'topic'].includes(String(route.name)),
);

/** 教程页内容宽度：1500px */
const isTotorialPage = computed(() => route.name === 'totorial');

/** 今日话题页内容宽度：1340px */
const isTopicPage = computed(() => route.name === 'topic');

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
