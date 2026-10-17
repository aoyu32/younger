<template>
  <!-- 固定在视口右侧下方的简约快捷栏：客服 / 微信 / QQ / 反馈 / 返回顶部（到底部才出现） -->
  <div v-if="show" class="edge-bar">
    <div
      v-for="item in items"
      :key="item.key"
      class="edge-item"
      :title="item.label"
      @click="handleClick(item)"
    >
      <ao-image :src="item.icon" width="22px" height="22px" fit="contain" />
    </div>
    <Transition name="top-item">
      <div v-if="showTop" class="edge-item" title="返回顶部" @click="scrollToTop">
        <ao-image :src="topItem.icon" width="22px" height="22px" fit="contain" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

// 组件名称
defineOptions({
  name: 'EdgeBar',
});

/** 仅这些页面显示：首页 / 教程中心 / 应用中心 / 网站导航 / AI资讯 */
const SHOW_ROUTES = ['YOUNGER', 'video', 'application', 'website', 'news'];
const route = useRoute();
const show = computed(() => SHOW_ROUTES.includes(String(route.name)));

type EdgeItem = {
  key: string;
  label: string;
  icon: string;
};

/** 图标传路径字符串，由 AoImage 内部解析 */
const items: EdgeItem[] = [
  { key: 'kefu', label: '客服', icon: '@/assets/layout/icon_kefu.svg' },
  { key: 'wechat', label: '微信', icon: '@/assets/layout/icon_wechat.svg' },
  { key: 'qq', label: 'QQ', icon: '@/assets/layout/icon_qq.svg' },
  { key: 'feedback', label: '反馈', icon: '@/assets/layout/icon_feedback.svg' },
];

/* 返回顶部：滚动到接近底部时才显示 */
const topItem: EdgeItem = { key: 'top', label: '返回顶部', icon: '@/assets/layout/icon_back_top.svg' };
const showTop = ref(false);

const onScroll = () => {
  const el = document.scrollingElement;
  if (!el) return;
  const toBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  showTop.value = toBottom <= 150;
};

/** 平滑滚回顶部：rAF 手写缓动（原生 behavior:'smooth' 在部分环境会被禁用导致瞬移） */
const scrollToTop = () => {
  const el = document.scrollingElement ?? document.documentElement;
  const startY = el.scrollTop;
  if (startY <= 0) return;
  const duration = 500;
  const start = performance.now();
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  let cancelled = false;

  /* 用户主动滚动（滚轮/拖动/触摸）时取消动画 */
  const cancel = () => {
    cancelled = true;
  };
  const stopEvents = ['wheel', 'touchstart'];
  stopEvents.forEach((e) => window.addEventListener(e, cancel, { once: true }));

  const tick = (now: number) => {
    if (cancelled) return cleanup();
    const t = Math.min(1, (now - start) / duration);
    el.scrollTop = startY - startY * easeOutCubic(t);
    if (t < 1) requestAnimationFrame(tick);
    else cleanup();
  };
  const cleanup = () => {
    stopEvents.forEach((e) => window.removeEventListener(e, cancel));
  };
  requestAnimationFrame(tick);
};

const emit = defineEmits<{
  click: [key: string];
}>();

/** 点击边缘栏项 */
const handleClick = (item: EdgeItem) => {
  emit('click', item.key);
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style lang="scss" scoped>
.edge-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: fixed;
  right: 26px;
  bottom: 300px;
  z-index: 80;
  padding: 10px 5px;
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-gray-0);
  border: 1px solid var(--ao-color-border);
}

.edge-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--ao-gray-2);
  }
}

/* 返回顶部项出入场：淡入 + 下浮 */
.top-item-enter-active,
.top-item-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.top-item-enter-from,
.top-item-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
