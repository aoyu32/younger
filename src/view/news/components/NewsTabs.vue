<template>
  <div class="news-tabs">
    <div class="tab-header" ref="headerRef">
      <div class="tab-list" :class="{ filled }">
        <div
          v-for="tab in visibleTabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="handleTabClick(tab.id)"
        >
          <span class="tab-label">{{ tab.label }}</span>
        </div>

        <div
          v-if="hiddenTabs.length > 0"
          class="tab-item tab-item--placeholder"
          :class="{ active: activeHiddenTab }"
          @click="activeHiddenTab && handleTabClick(activeHiddenTab.id)"
        >
          {{ activeHiddenTab ? activeHiddenTab.label : '···' }}
        </div>
      </div>

      <div
        v-if="hiddenTabs.length > 0"
        class="tab-more"
        :class="{ open: moreOpen }"
      >
        <div class="tab-more-trigger" @click="toggleMore">
          <span>更多分类</span>
        </div>
        <div class="tab-more-dropdown">
          <div
            v-for="tab in hiddenTabs"
            :key="tab.id"
            class="dropdown-item"
            :class="{ active: activeTab === tab.id }"
            @click="handleDropdownClick(tab.id)"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
    </div>

    <div class="tab-contents">
      <div v-if="currentList.length > 0" class="card-wrapper">
        <NewsCard
          v-for="item in currentList"
          :key="item.id"
          :item="item"
          @click="handleCardClick"
        />
      </div>

      <div v-else class="empty-state">暂无内容</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
  nextTick,
  watch,
} from 'vue';
import NewsCard from './NewsCard.vue';
import type { NewsCardItem } from './NewsCard.vue';

export interface TabItem {
  id: string | number;
  label: string;
}

const props = defineProps<{
  tabs: TabItem[];
  list: NewsCardItem[];
  modelValue?: string | number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  'card-click': [id: string | number];
}>();

const activeTab = computed({
  get: () => props.modelValue ?? props.tabs[0]?.id,
  set: (v) => emit('update:modelValue', v),
});

const handleTabClick = (id: string | number) => {
  activeTab.value = id;
};

/* 更多分类下拉：桌面端悬浮展开（CSS），触屏端点击切换 */
const hoverCapable = matchMedia('(hover: hover)').matches;
const moreOpen = ref(false);

const toggleMore = () => {
  if (hoverCapable) return;
  moreOpen.value = !moreOpen.value;
};

const handleDropdownClick = (id: string | number) => {
  handleTabClick(id);
  moreOpen.value = false;
};

// 点击组件外部时收起下拉（触屏场景）
const handleDocClick = (event: Event) => {
  if (headerRef.value && !headerRef.value.contains(event.target as Node)) {
    moreOpen.value = false;
  }
};

const handleCardClick = (id: string | number) => {
  emit('card-click', id);
};

const currentList = computed(() => props.list || []);

const headerRef = ref<HTMLElement>();
const tabWidths = ref<number[]>([]);
const visibleCount = ref<number>(Number.MAX_SAFE_INTEGER);
/* 窄屏：收纳数量确定后，可见标签等分填满整行（消除尾部留白） */
const filled = ref(false);

const visibleTabs = computed(() => props.tabs.slice(0, visibleCount.value));
const hiddenTabs = computed(() => props.tabs.slice(visibleCount.value));

/* 当前选中项若在隐藏列表里，就返回它，用于占位槽位显示 */
const activeHiddenTab = computed<TabItem | null>(() => {
  return hiddenTabs.value.find((t) => t.id === activeTab.value) ?? null;
});

function measureTabs() {
  // 先按自然宽度测量，再让可见标签等分填满
  filled.value = false;
  if (!headerRef.value) return;
  const tabList = headerRef.value.querySelector(
    '.tab-list',
  ) as HTMLElement | null;
  if (!tabList) return;

  const children = tabList.children;
  const widths: number[] = [];
  for (let i = 0; i < children.length; i++) {
    widths.push((children[i] as HTMLElement).offsetWidth);
  }
  tabWidths.value = widths;
  computeVisible();
  nextTick(() => {
    filled.value = true;
    // 收纳后“更多分类”按钮和占位槽才真正渲染出来，
    // 用它们的实际宽度再算一次，避免预留不足导致溢出
    nextTick(() => computeVisible());
  });
}

/* “更多”按钮 + 占位槽实际占用的宽度；没渲染时用与 CSS 一致的兜底值 */
function reservedWidth() {
  const MORE_GAP = 4;
  const MORE_FALLBACK = 96;
  /* 占位槽 CSS：min-width 64px + padding 0 20px = 104px */
  const PLACEHOLDER_FALLBACK = 104;
  if (!headerRef.value) {
    return MORE_FALLBACK + PLACEHOLDER_FALLBACK + MORE_GAP;
  }
  const moreEl = headerRef.value.querySelector('.tab-more') as HTMLElement | null;
  const placeholderEl = headerRef.value.querySelector(
    '.tab-item--placeholder',
  ) as HTMLElement | null;
  const moreWidth = moreEl ? moreEl.offsetWidth : MORE_FALLBACK;
  const placeholderWidth = placeholderEl
    ? placeholderEl.offsetWidth
    : PLACEHOLDER_FALLBACK;
  return moreWidth + placeholderWidth + MORE_GAP;
}

function computeVisible() {
  const widths = tabWidths.value;
  if (!headerRef.value || widths.length === 0) {
    visibleCount.value = props.tabs.length;
    return;
  }

  const containerWidth = headerRef.value.clientWidth;
  const GAP = 0;
  const reserved = reservedWidth();

  let totalWidth = 0;
  for (let i = 0; i < widths.length; i++) {
    totalWidth += widths[i] + (i > 0 ? GAP : 0);
  }
  if (totalWidth <= containerWidth) {
    visibleCount.value = props.tabs.length;
    return;
  }

  let used = 0;
  let count = 0;
  for (let i = 0; i < widths.length; i++) {
    const next = used + (i > 0 ? GAP : 0) + widths[i];
    if (next + reserved > containerWidth) break;
    used = next;
    count++;
  }
  // 剩余空间会由等分拉伸吸收，无需额外少显示一个
  visibleCount.value = Math.max(1, count);
}

onMounted(() => {
  visibleCount.value = props.tabs.length;
  nextTick(() => measureTabs());
  window.addEventListener('resize', computeVisible);
  document.addEventListener('click', handleDocClick);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', computeVisible);
  document.removeEventListener('click', handleDocClick);
});

watch(
  () => props.tabs,
  () => {
    visibleCount.value = props.tabs.length;
    nextTick(() => measureTabs());
  },
  { deep: true },
);

/* 从“更多分类”里选中某一项后，占位槽文字（··· → 分类名）宽度会变化，需重算 */
watch(activeTab, () => {
  nextTick(() => computeVisible());
});
</script>

<style scoped lang="scss">
.news-tabs {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
}

.tab-header {
  position: relative;
  display: flex;
  align-items: stretch;
  background: var(--ao-gray-2);
  border-top-left-radius: var(--ao-border-radius-lg);
  border-top-right-radius: var(--ao-border-radius-lg);
  overflow: visible;
}

.tab-list {
  display: flex;
  align-items: stretch;
  flex-wrap: nowrap;
  overflow: hidden;
  flex: 1;
  min-width: 0;
  border-top-left-radius: inherit;

  /* 窄屏：收纳数量确定后，可见标签等分填满整行（含 ··· 占位），
     消除尾部留白；标签文字超长时省略 */
  @media (max-width: 768px) {
    &.filled .tab-item,
    &.filled .tab-item--placeholder {
      flex: 1 1 0;
      min-width: 0;
    }

    .tab-label {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}

.tab-item {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 50px;
  font-size: 14px;
  line-height: 1;
  color: var(--ao-color-text-tertiary);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  background: transparent;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover:not(.active) {
    color: var(--ao-color-text-base);
    background-color: color-mix(in srgb, var(--ao-gray-4) 20%, transparent);
  }

  &.active {
    background: var(--ao-color-bg-container);
    color: var(--ao-lime-6);
    font-weight: var(--ao-font-weight-semibold);
  }

  /* 第一个 tab 激活时左上角跟随 header 圆角 */
  &:first-child {
    border-top-left-radius: inherit;
  }
}

.tab-item--placeholder {
  min-width: 64px;
  padding: 0 20px;
  justify-content: center;
  letter-spacing: 2px;
  color: var(--ao-color-text-tertiary);

  &.active {
    letter-spacing: normal;
    color: var(--ao-lime-6);
    background: var(--ao-color-bg-container);
    font-weight: var(--ao-font-weight-semibold);
  }
}

.tab-more {
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
}

.tab-more-trigger {
  display: inline-flex;
  align-items: center;
  padding: 0 20px;
  height: 50px;
  font-size: 13px;
  line-height: 1;
  color: var(--ao-color-text-tertiary);
  cursor: pointer;
  user-select: none;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
  border-top-right-radius: inherit;

  &:hover {
    color: var(--ao-color-text-base);
    background-color: color-mix(in srgb, var(--ao-gray-4) 20%, transparent);
  }
}

.tab-more-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  max-height: 320px;
  overflow-y: auto;
  background: var(--ao-gray-2);
  border-left: 1px solid var(--ao-gray-2);
  border-radius: var(--ao-border-radius-md);
  border-bottom: 1px solid var(--ao-gray-2);
  display: none;
  z-index: 50;
}

/* 桌面端悬浮展开；触屏无 hover，由点击切换的 open 类控制 */
@media (hover: hover) {
  .tab-more:hover .tab-more-dropdown {
    display: block;
  }
}

.tab-more.open .tab-more-dropdown {
  display: block;
}

.dropdown-item {
  padding: 12px 20px;
  font-size: 13px;
  color: var(--ao-color-text-secondary);
  cursor: pointer;
  border-radius: var(--ao-border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--ao-color-text-base);
    background-color: color-mix(in srgb, var(--ao-gray-4) 25%, transparent);
  }

  &.active {
    color: var(--ao-lime-6);
    font-weight: var(--ao-font-weight-semibold);
  }
}

.tab-contents {
  width: 100%;
  padding: 20px;
  min-height: 50vh;

  /* 窄屏：收紧内边距 */
  @media (max-width: 768px) {
    padding: 12px;
  }
}

.card-wrapper {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
  /* 行高按内容算：16px 内边距 ×2 + 标题 21px + 间距 2px + 摘要 2 行 39px + meta 24px ≈ 118px，额外留出呼吸空间 */
  grid-auto-rows: 148px;
  align-content: start;

  /* 中等宽度下两列会压缩正文，改为单列更易读 */
  @media (max-width: 1120px) {
    grid-template-columns: 1fr;
  }

  @media (max-width: 560px) {
    gap: 14px;
    grid-auto-rows: 132px;
  }
}

.empty-state {
  padding: 60px 0;
  text-align: center;
  font-size: 14px;
  color: var(--ao-color-text-tertiary);
}
</style>