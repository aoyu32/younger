<template>
  <aside class="tutorial-side-nav">
    <div ref="panelRef" class="side-panel">
      <div class="side-title">{{ title }}</div>
      <AoScrollbar class="side-scroll" always>
        <div ref="listRef" class="side-list">
          <div v-for="group in groups" :key="group.id" class="group">
            <div class="group-title">{{ group.title }}</div>
            <div class="group-children">
              <div
                v-for="chapter in group.children"
                :key="chapter.id"
                class="chapter-item"
                :class="{ active: chapter.id === activeId }"
                @click="emit('select', chapter)"
              >
                {{ chapter.title }}
              </div>
            </div>
          </div>
        </div>
      </AoScrollbar>
      <div class="footer"></div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import AoScrollbar from '@/components/ao-scrollbar/index.vue';
import type { TutorialChapter, TutorialGroup } from '../types';

defineOptions({
  name: 'TutorialSideNav',
});

const props = withDefaults(
  defineProps<{
    groups: TutorialGroup[];
    activeId?: string;
    title?: string;
  }>(),
  {
    activeId: '',
    title: '',
  },
);

const emit = defineEmits<{
  select: [chapter: TutorialChapter];
}>();

const panelRef = ref<HTMLElement | null>(null);
const listRef = ref<HTMLElement | null>(null);
let wrapObserver: ResizeObserver | null = null;
let settleTimer: ReturnType<typeof setTimeout> | undefined;
let panelHeight = 0;

const scrollActiveIntoView = () => {
  const list = listRef.value;
  const scroller = list?.closest('.ao-scrollbar__wrap') as HTMLElement | null;
  const item = list?.querySelector<HTMLElement>('.chapter-item.active');
  if (!list || !scroller || !item) return;
  const scrollerRect = scroller.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  if (itemRect.top < scrollerRect.top)
    scroller.scrollTop -= scrollerRect.top - itemRect.top + 8;
  else if (itemRect.bottom > scrollerRect.bottom) {
    scroller.scrollTop += itemRect.bottom - scrollerRect.bottom + 8;
  }
};

watch(
  () => props.activeId,
  () => {
    nextTick(scrollActiveIntoView);
  },
);

const syncPanelHeight = () => {
  const panel = panelRef.value;
  const wrap = panel?.closest('.totorial') as HTMLElement | null;
  if (!panel || !wrap) return;
  const top = parseFloat(getComputedStyle(panel).top) || 0;
  const full = window.innerHeight - top - 24;
  const limit = wrap.getBoundingClientRect().bottom - top;
  const next = Math.round(Math.max(0, Math.min(full, limit)));
  if (next === panelHeight) return;
  panelHeight = next;
  panel.style.height = `${next}px`;
  scrollActiveIntoView();
};

const onScroll = () => {
  syncPanelHeight();
  clearTimeout(settleTimer);
  settleTimer = setTimeout(syncPanelHeight, 140);
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', syncPanelHeight);
  const wrap = panelRef.value?.closest('.totorial');
  if (wrap) {
    wrapObserver = new ResizeObserver(syncPanelHeight);
    wrapObserver.observe(wrap);
  }
  syncPanelHeight();
  nextTick(scrollActiveIntoView);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', syncPanelHeight);
  wrapObserver?.disconnect();
  wrapObserver = null;
  clearTimeout(settleTimer);
});
</script>

<style lang="scss" scoped>
.tutorial-side-nav {
  width: 240px;
  flex: none;
}

.side-panel {
  position: fixed;
  top: calc(var(--ao-header-height-lg) + var(--ao-spacing-sm));
  left: calc((100% - var(--ao-container-max-width)) / 2);
  z-index: 1;
  display: flex;
  flex-direction: column;
  width: 240px;
  height: calc(
    100vh - var(--ao-header-height-lg) - var(--ao-spacing-sm) - 24px
  );
  overflow: hidden;
  background-color: var(--ao-gray-2);
}

.side-title {
  flex: none;
  padding: 14px 16px;
  background-color: var(--ao-gray-3);
  border-bottom: 1px solid var(--ao-gray-4);
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--ao-color-text-base);
  word-break: break-word;
}

.side-scroll {
  flex: 1;
  min-height: 0;

  :deep(.ao-scrollbar__bar) {
    width: 4px;
  }

  :deep(.ao-scrollbar__wrap) {
    overscroll-behavior: contain;
  }
}

.side-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
}

.group-title {
  padding: 10px 8px 6px;
  font-size: 15px;
  font-weight: 600;
  line-height: 21px;
  color: var(--ao-color-text-base);
  word-break: break-word;
}

.group-children {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.chapter-item {
  position: relative;
  padding: 7px 8px 7px 20px;
  font-size: 14px;
  line-height: 20px;
  color: var(--ao-color-text-secondary);
  cursor: pointer;
  user-select: none;
  word-break: break-word;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    left: 9px;
    top: 0;
    bottom: 0;
    width: 1px;
    background-color: var(--ao-gray-4);
  }

  &:not(:last-child)::before {
    bottom: -1px;
  }

  &::after {
    content: '';
    position: absolute;
    left: 9px;
    top: 50%;
    width: 7px;
    height: 1px;
    background-color: var(--ao-gray-4);
  }

  &:last-child::before {
    bottom: 50%;
  }

  &:hover {
    color: var(--ao-color-text-base);
  }

  &.active {
    color: var(--ao-color-primary);
    font-weight: 600;
  }
}

.footer {
  width: 100%;
  height: 24px;
  background-color: var(--ao-gray-3);
}
</style>
