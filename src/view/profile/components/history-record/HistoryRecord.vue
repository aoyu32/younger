<template>
  <div ref="rootRef" class="history-record">
    <!-- 左侧时间线：无数据时整体隐藏 -->
    <aside v-if="activeGroups.length" class="history-aside">
      <div ref="timelineRef" class="timeline">
        <span class="timeline__rail" aria-hidden="true" />

        <button
          v-for="item in timelineItems"
          :key="item.key"
          type="button"
          class="timeline__item"
          :class="{ 'is-active': activeKey === item.key }"
          :style="{ top: `${item.top}px` }"
          @click="scrollToGroup(item.key)"
        >
          <span class="timeline__dot" />
          <span class="timeline__label">{{ item.label }}</span>
        </button>
      </div>
    </aside>

    <!-- 右侧分组列表 -->
    <div class="history-content">
      <template v-for="group in activeGroups" :key="group.key">
        <section
          class="history-group"
          :ref="(el) => setSectionRef(group.key, el)"
        >
          <div class="history-group__grid">
            <UserVideoCard
              v-for="item in group.list"
              :key="item.id"
              :item="item"
              :batch-mode="batchMode"
              :selected="selectedIds.includes(item.id)"
              @delete="handleDelete"
              @select="handleSelect"
            />
          </div>
        </section>
      </template>

      <div v-if="!activeGroups.length" class="history-empty">
        <img :src="emptyIcon" alt="" />
        <p>没有历史记录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import type { ComponentPublicInstance } from 'vue';
import UserVideoCard from './UserVideoCard.vue';
import type { VideoHistoryItem } from './UserVideoCard.vue';
import { categoryData, type VideoItem } from '@/mock/videoLIst';
import emptyIcon from '@/assets/website/icon_empty.svg?url';

defineOptions({
  name: 'HistoryRecord',
});

const props = defineProps<{
  /** 批量管理模式：开启后每张卡片右上角展示勾选框 */
  batchMode?: boolean;
}>();

const emit = defineEmits<{
  delete: [item: VideoHistoryItem];
}>();

/** 按时间分好组的历史记录 */
interface HistoryGroup {
  key: string;
  /** 右侧分组标题 */
  title: string;
  /** 左侧时间线标签 */
  label: string;
  list: VideoHistoryItem[];
}

/* ============================================================
   观看历史：视频数据取自 mock 视频列表（@/mock/videoLIst）
   观看进度与观看时间暂为模拟值，接入接口后替换为请求结果即可
   ============================================================ */
const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const now = Date.now();

const minutesAgo = (n: number) => now - n * MINUTE;
const hoursAgo = (n: number) => now - n * HOUR;
const daysAgo = (n: number) => now - n * DAY;

const videoMap = new Map<number, VideoItem>(
  categoryData
    .flatMap((category) => category.list)
    .map((video) => [video.id, video]),
);

/** 用 mock 视频数据构造一条观看历史 */
function createItem(
  videoId: number,
  watchedAt: number,
  watchedRatio: number,
): VideoHistoryItem {
  const video = videoMap.get(videoId);
  if (!video) {
    throw new Error(`视频 mock 数据中不存在 id 为 ${videoId} 的视频`);
  }
  return {
    id: `history-${video.id}`,
    cover: video.video.cover,
    title: video.title,
    watched: Math.round(video.video.duration * watchedRatio),
    duration: video.video.duration,
    watchedAt,
  };
}

const groups = ref<HistoryGroup[]>([
  {
    key: 'today',
    title: '今日',
    label: '今天',
    list: [
      createItem(17, minutesAgo(12), 0.32),
      createItem(4, minutesAgo(46), 0.08),
      createItem(19, hoursAgo(3), 0.03),
      createItem(27, hoursAgo(6), 0.93),
    ],
  },
  {
    key: 'yesterday',
    title: '昨日',
    label: '昨天',
    list: [
      createItem(2, daysAgo(1), 0.1),
      createItem(21, daysAgo(1), 0.45),
      createItem(6, daysAgo(1), 0.62),
    ],
  },
  {
    key: 'week',
    title: '近一周',
    label: '近一周',
    list: [
      createItem(32, daysAgo(3), 0.71),
      createItem(29, daysAgo(5), 0.26),
      createItem(10, daysAgo(6), 0.15),
    ],
  },
  {
    key: 'week-ago',
    title: '一周前',
    label: '一周前',
    list: [createItem(23, daysAgo(9), 0.5), createItem(16, daysAgo(12), 0.04)],
  },
  {
    key: 'month-ago',
    title: '一个月前',
    label: '一个月前',
    list: [createItem(3, daysAgo(20), 0.38), createItem(7, daysAgo(25), 0.88)],
  },
]);

/* ============================================================
    批量管理：勾选状态
    ============================================================ */
/** 已勾选的记录 id（进入批量管理后可多选） */
const selectedIds = ref<string[]>([]);

/** 勾选 / 取消勾选一条记录 */
function handleSelect(item: VideoHistoryItem) {
  const index = selectedIds.value.indexOf(item.id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(item.id);
  }
}

/** 退出批量管理时清空勾选 */
watch(
  () => props.batchMode,
  (batchMode) => {
    if (!batchMode) selectedIds.value = [];
  },
);

/** 清空全部历史记录（由父级「全部清空」按钮调用） */
function clearAll() {
  groups.value = groups.value.map((group) => ({ ...group, list: [] }));
  selectedIds.value = [];
  // 分组被清空，重算一次
  nextTick(() => {
    syncHeights();
    updateTimeline();
    updateActive();
  });
}

defineExpose({ clearAll });

/* ============================================================
    时间线
    ============================================================ */
const rootRef = ref<HTMLElement>();
const timelineRef = ref<HTMLElement>();
const activeKey = ref(groups.value[0]?.key ?? '');
const sectionEls = new Map<string, HTMLElement>();
let scrollContainer: HTMLElement | null = null;
let rafId = 0;

/** 每个圆点的高度（px），用于防堆叠重叠 */
const ITEM_HEIGHT = 26;

interface TimelineItem {
  key: string;
  label: string;
  /** 相对时间线顶部的偏移量（px） */
  top: number;
}

/** 时间线圆点数据，随滚动动态计算 */
const timelineItems = ref<TimelineItem[]>([]);

/** 空分组不渲染，时间线也同步只展示有数据的分组 */
const activeGroups = computed(() =>
  groups.value.filter((group) => group.list.length > 0),
);

function setSectionRef(
  key: string,
  el: Element | ComponentPublicInstance | null,
) {
  if (el instanceof HTMLElement) sectionEls.set(key, el);
  else sectionEls.delete(key);
}

/** 向上冒泡查找最近的滚动容器（即 UserCenterTabs 内的 AoScrollbar） */
function findScrollParent(el?: HTMLElement | null) {
  let parent = el?.parentElement ?? null;
  while (parent && parent !== document.body) {
    const { overflowY } = getComputedStyle(parent);
    if (
      overflowY === 'auto' ||
      overflowY === 'scroll' ||
      overflowY === 'overlay'
    ) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return null;
}

/**
 * 核心：根据内容区滚动位置，计算每个圆点的 top 值。
 *
 * 规则：
 *  1. 圆点初始跟随其对应分组的位置（相对时间线顶部）
 *  2. 当分组滚出滚动容器顶部（relToContainer <= 0）时，圆点钳制到 0 → 固定在轴顶
 *  3. 多个已固定的圆点用 lastBottom 依次向下堆叠，避免重叠
 *
 * 关键点：用 .timeline 自身的 rect 作为渲染参照（不用 containerRect），
 * 避免 sticky 位置变化导致的错位。
 */
function updateTimeline() {
  const container = scrollContainer;
  const timelineEl = timelineRef.value;
  if (!container || !timelineEl) return;

  const timelineRect = timelineEl.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const items: TimelineItem[] = [];
  let lastBottom = 0;

  for (const group of activeGroups.value) {
    const el = sectionEls.get(group.key);
    if (!el) continue;

    const sectionRect = el.getBoundingClientRect();
    // 相对滚动容器顶部（用于判定是否已滚出视口）
    const relToContainer = sectionRect.top - containerRect.top;
    // 相对时间线顶部（用于实际渲染位置）
    const relToTimeline = sectionRect.top - timelineRect.top;

    // 滚出顶部 → 固定到轴顶；否则跟随内容
    let top = relToContainer <= 0 ? 0 : relToTimeline;

    // 防堆叠重叠
    if (top < lastBottom) top = lastBottom;

    items.push({ key: group.key, label: group.label, top });
    lastBottom = top + ITEM_HEIGHT;
  }

  timelineItems.value = items;
}

/** 滚动时高亮分组：标题越过滚动区顶部往下 1/4 处即为当前分组 */
function updateActive() {
  rafId = 0;
  const container = scrollContainer;
  if (!container) return;

  // 先更新圆点位置（含固定态）
  updateTimeline();

  const trigger =
    container.getBoundingClientRect().top + container.clientHeight * 0.25;
  let current = '';
  for (const group of activeGroups.value) {
    const el = sectionEls.get(group.key);
    if (el && el.getBoundingClientRect().top <= trigger) current = group.key;
  }
  activeKey.value = current || activeGroups.value[0]?.key || '';
}

function handleScroll() {
  if (rafId) return;
  rafId = requestAnimationFrame(updateActive);
}

function scrollToGroup(key: string) {
  activeKey.value = key;
  const container = scrollContainer;
  const el = sectionEls.get(key);
  if (!container || !el) return;

  const offset =
    el.getBoundingClientRect().top - container.getBoundingClientRect().top;
  container.scrollTo({
    top: container.scrollTop + offset,
    behavior: 'smooth',
  });
}

function handleDelete(item: VideoHistoryItem) {
  groups.value = groups.value.map((group) => ({
    ...group,
    list: group.list.filter((video) => video.id !== item.id),
  }));
  // 同步剔除勾选缓存，避免批量管理下残留已删除项
  selectedIds.value = selectedIds.value.filter((id) => id !== item.id);
  // 分组可能被清空，重算一次
  nextTick(() => {
    syncHeights();
    updateTimeline();
    updateActive();
  });
  // TODO: 调用删除历史记录接口
  emit('delete', item);
}

/* ============================================================
   高度同步：防止 sticky 被父级推上去
   ============================================================ */
function syncHeights() {
  if (!scrollContainer || !rootRef.value) return;
  const h = scrollContainer.clientHeight;

  // 父级至少和滚动容器一样高 → sticky 一直有可活动空间
  rootRef.value.style.minHeight = `${h}px`;

  // 时间线高度 = 滚动容器高度 → sticky 顶部贴 0 时不会溢出
  const asideEl = rootRef.value.querySelector<HTMLElement>('.history-aside');
  if (asideEl) asideEl.style.height = `${h}px`;
}

/* ============================================================
   尺寸监听：图片懒加载 / 卡片增减 / 窗口 resize 时重算
   ============================================================ */
let resizeObserver: ResizeObserver | null = null;

onMounted(async () => {
  await nextTick();
  scrollContainer = findScrollParent(rootRef.value);
  scrollContainer?.addEventListener('scroll', handleScroll, { passive: true });

  syncHeights();

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      syncHeights();
      updateTimeline();
    });
    // 内容高度变化（图片懒加载 / 卡片增删）时重算
    const content = rootRef.value?.querySelector('.history-content');
    if (content instanceof HTMLElement) resizeObserver.observe(content);
    // 滚动容器尺寸变化（窗口 resize）时重算高度
    if (scrollContainer) resizeObserver.observe(scrollContainer);
  }

  updateTimeline();
  updateActive();
});

onBeforeUnmount(() => {
  scrollContainer?.removeEventListener('scroll', handleScroll);
  if (rafId) cancelAnimationFrame(rafId);
  rafId = 0;
  resizeObserver?.disconnect();
  resizeObserver = null;
});
</script>

<style scoped lang="scss">
.history-record {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--ao-spacing-xl);
  /* ✅ 关键：底部不加 padding，保证父级 content-box 底部与 sticky 元素底部齐平 */
  padding: 20px 20px 0;
  box-sizing: border-box;
  /* min-height 由 JS 动态设置 */
}

/* ========== 左侧时间线 ========== */
.history-aside {
  /* 关键：sticky 固定在滚动视口内，高度由 JS 动态设置 */
  position: sticky;
  top: 0;
  flex-shrink: 0;
  width: 88px;
  overflow: hidden;
  box-sizing: border-box;
}

.timeline {
  position: relative;
  width: 100%;
  height: 100%;

  /* 顶部渐变遮罩：盖住 rail 超出第一个圆点的部分 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 5px;
    background: linear-gradient(
      to bottom,
      var(--ao-color-bg-container) 0%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 2;
  }

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 24px;
    background: linear-gradient(
      to top,
      var(--ao-color-bg-container) 0%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 2;
  }

  &__rail {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 4px;
    width: 1px;
    background-color: var(--ao-color-border);
  }

  &__item {
    position: absolute;
    left: 0;
    display: flex;
    align-items: center;
    gap: var(--ao-spacing-sm);
    height: 26px;
    padding: 0;
    border: none;
    background: none;
    font-size: var(--ao-font-size-sm);
    line-height: 1;
    color: var(--ao-color-text-tertiary);
    cursor: pointer;
    white-space: nowrap;
    transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:hover {
      color: var(--ao-color-primary);
    }

    &.is-active {
      color: var(--ao-color-primary);
      font-weight: var(--ao-font-weight-medium);

      .timeline__dot {
        border-color: var(--ao-color-primary);
        background-color: var(--ao-color-primary);
      }
    }
  }

  &__dot {
    flex-shrink: 0;
    width: 9px;
    height: 9px;
    border: 1px solid var(--ao-color-border);
    border-radius: var(--ao-border-radius-circle);
    background-color: var(--ao-color-bg-container);
    transition:
      border-color var(--ao-duration-fast) var(--ao-ease-in-out),
      background-color var(--ao-duration-fast) var(--ao-ease-in-out);
  }

  &__label {
    white-space: nowrap;
  }
}

.history-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 70px;
  padding-bottom: 20px;
}

.history-group {
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-md);

  &__title {
    margin: 0;
    font-size: var(--ao-font-size-lg);
    font-weight: var(--ao-font-weight-semibold);
    line-height: var(--ao-line-height-tight);
    color: var(--ao-color-text-base);
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: var(--ao-spacing-md) var(--ao-spacing-sm);
  }
}

/* 空状态：绝对定位铺满内容区（父级高度为 min-height + auto，flex 无法撑满），
   图标与文案整体水平垂直居中 */
.history-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ao-spacing-md);
  text-align: center;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-tertiary);

  img {
    width: 64px;
    height: 64px;
  }

  p {
    margin: 0;
  }
}
</style>
