<template>
  <div ref="rootRef" class="website-collect">
    <!-- 左侧分类线：无数据时整体隐藏 -->
    <aside v-if="activeGroups.length" class="collect-aside">
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
    <div class="collect-content">
      <template v-for="group in activeGroups" :key="group.key">
        <section
          class="collect-group"
          :ref="(el) => setSectionRef(group.key, el)"
        >
          <!-- 移动端分类线隐藏后，分类名展示在分组卡片上方（≤768 显示） -->
          <div class="collect-group__title">{{ group.label }}</div>
          <div class="collect-group__grid">
            <div
              v-for="item in group.list"
              :key="item.url"
              class="site-card"
              @click="handleCardClick(item)"
            >
              <div class="icon">
                <img :src="item.icon" alt="" />
              </div>
              <div class="name" :title="item.name">{{ item.name }}</div>
              <!-- 批量管理：右上角勾选框 -->
              <button
                v-if="batchMode"
                type="button"
                class="collect-check"
                :class="{ 'is-checked': selectedUrls.includes(item.url) }"
                :aria-label="
                  selectedUrls.includes(item.url) ? '取消勾选' : '勾选'
                "
                @click.stop="handleSelect(item)"
              >
                <img :src="checkIcon" alt="" />
              </button>
            </div>
          </div>
        </section>
      </template>

      <div v-if="!activeGroups.length" class="collect-empty">
        <img :src="emptyIcon" alt="" />
        <p>没有收藏的网站</p>
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
import emptyIcon from '@/assets/website/icon_empty.svg?url';
import checkIcon from '@/assets/profile/icon_check.svg?url';
import { websiteCategories, type WebsiteSite } from '@/mock/websiteCategories';

defineOptions({ name: 'WebsiteCollect' });

const props = defineProps<{
  /** 批量管理模式：开启后卡片右上角显示勾选框，整卡点击切换勾选 */
  batchMode?: boolean;
}>();

interface CollectGroup {
  key: string;
  /** 分类线标签：与网站导航页一致的二级分类名 */
  label: string;
  list: WebsiteSite[];
}

/**
 * 收藏列表：按网站导航页的二级分类（综合门户 / 新闻媒体 / 科技资讯…）分组，
 * 站点跨分类重复时只归入首次出现的分组
 */
function buildGroups(): CollectGroup[] {
  const groups: CollectGroup[] = [];
  const seen = new Set<string>();

  for (const group of websiteCategories) {
    for (const child of group.children ?? []) {
      const list = child.sites.filter((site) => {
        if (seen.has(site.url)) return false;
        seen.add(site.url);
        return true;
      });
      if (!list.length) continue;
      groups.push({
        key: `${group.name}-${child.name}`,
        label: child.name,
        list,
      });
    }
  }
  return groups;
}

const groups = ref<CollectGroup[]>(buildGroups());

/* ============================================================
   批量管理：勾选状态（站点无 id，以 url 为唯一键）
   ============================================================ */
/** 已勾选的站点 url */
const selectedUrls = ref<string[]>([]);

/** 全部站点（跨分组拉平） */
const allSites = computed<WebsiteSite[]>(() =>
  groups.value.flatMap((group) => group.list),
);

/** 已勾选的站点 */
const selectedItems = computed<WebsiteSite[]>(() => {
  const selected = new Set(selectedUrls.value);
  return allSites.value.filter((site) => selected.has(site.url));
});

/** 已勾选数量 */
const selectedCount = computed(() => selectedUrls.value.length);

/** 是否已全选 */
const isAllSelected = computed(
  () =>
    allSites.value.length > 0 &&
    selectedUrls.value.length === allSites.value.length,
);

/** 勾选 / 取消勾选一条记录 */
function handleSelect(site: WebsiteSite) {
  const index = selectedUrls.value.indexOf(site.url);
  if (index > -1) {
    selectedUrls.value.splice(index, 1);
  } else {
    selectedUrls.value.push(site.url);
  }
}

/** 批量管理模式下点卡片 = 切换勾选 */
function handleCardClick(site: WebsiteSite) {
  if (props.batchMode) handleSelect(site);
}

/** 全选 / 取消全选 */
function toggleSelectAll() {
  selectedUrls.value = isAllSelected.value
    ? []
    : allSites.value.map((site) => site.url);
}

/** 退出批量管理时清空勾选 */
watch(
  () => props.batchMode,
  (batchMode) => {
    if (!batchMode) selectedUrls.value = [];
  },
);

/** 删除（取消收藏）勾选的站点 */
function deleteSelected() {
  if (!selectedUrls.value.length) return;
  const selected = new Set(selectedUrls.value);
  groups.value = groups.value.map((group) => ({
    ...group,
    list: group.list.filter((site) => !selected.has(site.url)),
  }));
  selectedUrls.value = [];
  // 分组可能被清空，重算一次
  nextTick(() => {
    syncHeights();
    updateTimeline();
    updateActive();
  });
}

defineExpose({
  selectedItems,
  selectedCount,
  isAllSelected,
  toggleSelectAll,
  deleteSelected,
});

const rootRef = ref<HTMLElement>();
const timelineRef = ref<HTMLElement>();
const activeKey = ref(groups.value[0]?.key ?? '');
const sectionEls = new Map<string, HTMLElement>();
let scrollContainer: HTMLElement | null = null;
let rafId = 0;

/** 圆点间的最小间距（防堆叠重叠的下限） */
const ITEM_HEIGHT = 48;

/** 钉在轴顶时的固定偏移 */
const TIMELINE_TOP = 10;

interface TimelineItem {
  key: string;
  label: string;
  /** 相对分类线顶部的偏移量（px），最终渲染位置 */
  top: number;
  /** 原始期望位置：钉住项为轴顶，自然项为跟随内容的位置 */
  rawTop: number;
}

/** 分类线圆点数据，随滚动动态计算 */
const timelineItems = ref<TimelineItem[]>([]);

/** 空分组不渲染，分类线也同步只展示有数据的分组 */
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

function updateTimeline() {
  const container = scrollContainer;
  const timelineEl = timelineRef.value;
  if (!container || !timelineEl) return;

  const timelineRect = timelineEl.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  const railHeight = timelineEl.clientHeight;

  // 第一遍：只算原始位置（钉住 → 轴顶；其余 → 跟随内容）。
  // 刻意不做防重叠收敛：否则丢弃钉住项后，
  // 后面的自然项还留着按旧堆叠底部算出的位置，被遗弃在轨道外
  const items: TimelineItem[] = [];
  let pinnedCount = 0;

  for (const group of activeGroups.value) {
    const el = sectionEls.get(group.key);
    if (!el) continue;

    const sectionRect = el.getBoundingClientRect();
    // 相对滚动容器顶部（用于判定是否已滚出视口）
    const relToContainer = sectionRect.top - containerRect.top;
    // 相对分类线顶部（用于实际渲染位置）
    const relToTimeline = sectionRect.top - timelineRect.top;

    const rawTop = relToContainer <= 0 ? TIMELINE_TOP : relToTimeline;
    items.push({
      key: group.key,
      label: group.label,
      top: rawTop,
      rawTop,
    });
    if (relToContainer <= 0) pinnedCount++;
  }

  // 收敛：前 pinnedCount 项钉成堆叠贴轴顶，其余跟随原始位置，统一防重叠。
  // 放不下（堆叠本身或连同自然项超出轨道）时，最上面的项先消失并重排，
  // 直到全部落回轨道内；滚回上方时分组回到视口会自然重现。
  // 注意：只有「被堆叠顶下去」的项超出轨道才触发丢弃——
  // 自然落在轨道外的是在下方待命的项，不该因此消失
  let pinned = pinnedCount;
  while (items.length > 0) {
    let lastBottom = 0;
    for (let i = 0; i < items.length; i++) {
      const top =
        i < pinned
          ? TIMELINE_TOP + i * ITEM_HEIGHT
          : Math.max(items[i].rawTop, lastBottom);
      items[i].top = top;
      lastBottom = top + ITEM_HEIGHT;
    }

    const overflow = items.some(
      (item) => item.top + ITEM_HEIGHT > railHeight && item.top > item.rawTop,
    );
    if (items.length <= 1 || !overflow) break;

    items.shift();
    pinned = Math.max(0, pinned - 1);
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

  // 触底兜底：最后一个分组的高度可能不够到触发线，直接点亮
  if (
    container.scrollTop + container.clientHeight >=
    container.scrollHeight - 1
  ) {
    const last = activeGroups.value[activeGroups.value.length - 1];
    if (last) activeKey.value = last.key;
    return;
  }

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

function syncHeights() {
  if (!scrollContainer || !rootRef.value) return;
  const h = scrollContainer.clientHeight;

  // 父级至少和滚动容器一样高 → sticky 一直有可活动空间
  rootRef.value.style.minHeight = `${h}px`;

  // 分类线高度 = 滚动容器高度 → sticky 顶部贴 0 时不会溢出
  const asideEl = rootRef.value.querySelector<HTMLElement>('.collect-aside');
  if (asideEl) asideEl.style.height = `${h}px`;
}

/* ============================================================
   尺寸监听：卡片增减 / 窗口 resize 时重算
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
    // 内容高度变化（卡片增删）时重算
    const content = rootRef.value?.querySelector('.collect-content');
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
.website-collect {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 50px;
  padding: 20px;
  box-sizing: border-box;
}

/* ========== 左侧分类线 ========== */
.collect-aside {
  position: sticky;
  top: 0;
  flex-shrink: 0;
  width: 82px;
  overflow: hidden;
  box-sizing: border-box;

  /* 移动端：分类线隐藏，分类名展示在分组卡片上方 */
  @media (max-width: 768px) {
    display: none;
  }
}

.timeline {
  position: relative;
  width: 100%;
  height: 100%;

  /* 上下渐隐：圆点滚出可视区时柔和过渡 */
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

/* ========== 右侧分组列表 ========== */
.collect-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 70px;
  padding-bottom: 20px;
}

.collect-group {
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-md);
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 24px;

    /* 移动端：卡片至少两列 */
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  &__title {
    margin: 0;
    font-size: var(--ao-font-size-lg);
    font-weight: var(--ao-font-weight-semibold);
    line-height: var(--ao-line-height-tight);
    color: var(--ao-color-text-base);

    /* 桌面端由左侧分类线展示分类名，标题仅在移动端显示 */
    @media (min-width: 769px) {
      display: none;
    }
  }
}

.site-card {
  position: relative;
  aspect-ratio: 8 / 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ao-spacing-xs);
  background-color: var(--ao-color-bg-container);
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-radius: 10px;
  box-sizing: border-box;
  transition:
    box-shadow var(--ao-duration-base) var(--ao-ease-in-out),
    transform var(--ao-duration-base) var(--ao-ease-in-out);

  &:hover {
    box-shadow: var(--ao-shadow-md);
    transform: translateY(calc(var(--ao-border-width-medium) * -1));
  }

  .icon {
    width: var(--ao-control-height-md);
    height: var(--ao-control-height-md);
    border-radius: var(--ao-border-radius-xl);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .name {
    max-width: 100%;
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-semibold);
    line-height: var(--ao-line-height-tight);
    color: var(--ao-color-text-base);
    opacity: var(--ao-opacity-hover);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 批量管理勾选框：右上角角标 */
  .collect-check {
    position: absolute;
    top: var(--ao-spacing-xs);
    right: var(--ao-spacing-xs);
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    padding: 0;
    border: var(--ao-border-width-thin) solid var(--ao-gray-5);
    border-radius: var(--ao-border-radius-sm);
    background-color: var(--ao-gray-0);
    cursor: pointer;
    transition:
      background-color var(--ao-duration-fast) var(--ao-ease-in-out),
      border-color var(--ao-duration-fast) var(--ao-ease-in-out);

    img {
      width: 10px;
      height: 10px;
      opacity: 0;
      transition: opacity var(--ao-duration-fast) var(--ao-ease-in-out);
    }

    &.is-checked {
      border-color: var(--ao-color-primary);
      background-color: var(--ao-color-primary);

      img {
        opacity: 1;
      }
    }
  }
}

.collect-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ao-spacing-md);
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
