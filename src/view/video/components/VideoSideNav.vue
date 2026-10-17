<template>
  <Teleport to="body">
    <div
      class="video-side-nav"
      @mouseenter="onHoverChange"
      @mouseleave="onHoverChange"
    >
      <Transition name="side-nav">
        <div
          v-show="visible"
          ref="panelRef"
          class="nav-panel"
          :class="{ 'is-overlap': overlapped }"
        >
          <Transition name="collapse">
            <div v-show="!collapsed" class="nav-list">
              <div
                v-for="(item, index) in menuItems"
                :key="`${item.id}-${index}`"
                class="nav-row"
                :class="[{ active: String(item.id) === String(modelValue) }]"
                @click="handleClick(item)"
              >
                <i class="dash"></i>
                <span class="label">{{ item.label }}</span>
              </div>
            </div>
          </Transition>
          <div class="panel-toggle" @click="collapsed = !collapsed">
            <i class="toggle-icon" :class="{ 'is-open': !collapsed }"></i>
            <span>{{ collapsed ? '导航' : '收起' }}</span>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import type { MenuItem } from './VideoWaterfallNav.vue';

const props = defineProps<{
  menuItems: MenuItem[];
  modelValue?: string | number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
}>();

/* 瀑布流导航（.video-waterfall-nav）滚出视口顶部后显示本组件，滚回来隐藏 */
const visible = ref(false);
let observer: IntersectionObserver | null = null;

/* 侧边栏与页面内容（main 宽度）水平重叠时加投影，避免白底浮层与内容混在一起 */
const panelRef = ref<HTMLElement | null>(null);
const overlapped = ref(false);
/* 收起后只留一个「导航」开关行 */
const collapsed = ref(false);

function updateOverlap() {
  const panel = panelRef.value;
  if (!panel || !visible.value) {
    overlapped.value = false;
    return;
  }
  const mainEl = document.querySelector('main');
  if (!mainEl) return;
  const contentLeft = mainEl.getBoundingClientRect().left;
  const panelRight = panel.getBoundingClientRect().right;
  overlapped.value = panelRight > contentLeft;
}

/* 展开收起有 0.25s 过渡，等过渡结束再量宽度 */
let hoverTimer: ReturnType<typeof setTimeout> | undefined;
function onHoverChange() {
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(updateOverlap, 280);
}

function onWindowResize() {
  updateOverlap();
}

onMounted(() => {
  const target = document.querySelector('.video-waterfall-nav');
  if (!target) return;
  observer = new IntersectionObserver(
    ([entry]) => {
      visible.value = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    },
    { threshold: 0 },
  );
  observer.observe(target);
  window.addEventListener('resize', onWindowResize);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  window.removeEventListener('resize', onWindowResize);
  clearTimeout(hoverTimer);
});

watch(visible, () => {
  /* 展示/隐藏切换后（Transition 完成）重测一次 */
  setTimeout(updateOverlap, 280);
});

/* 收起/展开改变面板宽度，过渡结束再重测重叠 */
watch(collapsed, () => {
  setTimeout(updateOverlap, 280);
});

function handleClick(item: MenuItem) {
  emit('update:modelValue', item.id);
  /* 选完回到顶部：页面自身的导航/筛选区重新可见，本组件随之隐藏 */
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped lang="scss">
/* 亮色浮层：白底面板、浅灰行悬浮、激活项品牌色 */
.video-side-nav {
  position: fixed;
  top: 50%;
  left: 10px; /* 与左边留少量间距，不贴边 */
  transform: translateY(-50%);
  z-index: 90;
}

.nav-panel {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0;
  padding: 10px 6px;
  border-radius: 12px;
  background-color: var(--ao-gray-0);
  border: 1px solid transparent;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.nav-panel.is-overlap {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.video-side-nav:hover .nav-panel {
  border-color: var(--ao-color-border);
}

.nav-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  white-space: nowrap;
  color: var(--ao-color-text-tertiary);
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  .dash {
    flex: none;
    width: 12px;
    height: 2px; /* 横条更细 */
    border-radius: 1px;
    background-color: rgba(0, 0, 0, 0.18);
    transition:
      background-color 0.15s ease,
      width 0.2s ease;
  }

  .label {
    line-height: 17px;
    max-width: 0;
    opacity: 0;
    overflow: hidden;
    white-space: nowrap;
    transition:
      max-width 0.25s ease,
      opacity 0.2s ease;
  }

  &:hover {
    background-color: var(--ao-gray-2);
    color: var(--ao-color-text-base);

    .dash {
      background-color: rgba(0, 0, 0, 0.35);
    }
  }

  &.active {
    color: var(--ao-color-primary);

    .label {
      max-width: 200px;
      opacity: 1;
    }

    .dash {
      width: 18px;
      background-color: var(--ao-color-primary);
    }
  }
}

.panel-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
  line-height: 17px;
  color: var(--ao-color-text-tertiary);
  transition: color 0.15s ease;

  .toggle-icon {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px; /* 与导航行 dash 同宽的槽位，保证竖向对齐 */
    height: 8px;
    transition: transform 0.2s ease;

    &::after {
      content: '';
      width: 6px;
      height: 6px;
      border-top: 1.5px solid currentColor;
      border-right: 1.5px solid currentColor;
      transform: rotate(45deg); /* 收起态：箭头朝右 */
      transition: transform 0.2s ease;
    }

    &.is-open::after {
      transform: rotate(-135deg); /* 展开态：箭头朝左（收起方向） */
    }
  }

  &:hover {
    background-color: transparent;
    color: var(--ao-color-text-base);
  }
}

.video-side-nav:hover .nav-row .label {
  max-width: 200px;
  opacity: 1;
}

.side-nav-enter-active,
.side-nav-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.side-nav-enter-from,
.side-nav-leave-to {
  opacity: 0;
  transform: translateX(-24px);
}

/* 列表收起/展开动画（高度收合 + 淡出） */
.collapse-enter-active,
.collapse-leave-active {
  overflow: hidden;
  max-height: 600px;
  opacity: 1;
  transition:
    max-height 0.25s ease,
    opacity 0.2s ease;
}
.collapse-enter-from,
.collapse-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
