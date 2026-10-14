<template>
  <div class="news-tabs">
    <div class="tab-header" ref="headerRef">
      <div class="tab-list">
        <div
          v-for="tab in visibleTabs"
          :key="tab.id"
          class="tab-item"
          :class="{ active: activeTab === tab.id }"
          @click="handleTabClick(tab.id)"
        >
          {{ tab.label }}
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

      <div v-if="hiddenTabs.length > 0" class="tab-more">
        <div class="tab-more-trigger">
          <span>更多分类</span>
        </div>
        <div class="tab-more-dropdown">
          <div
            v-for="tab in hiddenTabs"
            :key="tab.id"
            class="dropdown-item"
            :class="{ active: activeTab === tab.id }"
            @click="handleTabClick(tab.id)"
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

const handleCardClick = (id: string | number) => {
  emit('card-click', id);
};

const currentList = computed(() => props.list || []);

const headerRef = ref<HTMLElement>();
const tabWidths = ref<number[]>([]);
const visibleCount = ref<number>(Number.MAX_SAFE_INTEGER);

const visibleTabs = computed(() => props.tabs.slice(0, visibleCount.value));
const hiddenTabs = computed(() => props.tabs.slice(visibleCount.value));

/* 当前选中项若在隐藏列表里，就返回它，用于占位槽位显示 */
const activeHiddenTab = computed<TabItem | null>(() => {
  return hiddenTabs.value.find((t) => t.id === activeTab.value) ?? null;
});

function measureTabs() {
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
}

function computeVisible() {
  const widths = tabWidths.value;
  if (!headerRef.value || widths.length === 0) {
    visibleCount.value = props.tabs.length;
    return;
  }

  const containerWidth = headerRef.value.clientWidth;
  const GAP = 0;
  const MORE_WIDTH = 90;
  const MORE_GAP = 4;
  /* 占位 tab 需要占的空间（"···" 或激活项文字） */
  const PLACEHOLDER_WIDTH = 64;

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
    if (next + MORE_GAP + MORE_WIDTH + PLACEHOLDER_WIDTH > containerWidth)
      break;
    used = next;
    count++;
  }
  visibleCount.value = Math.max(1, count - 1);
}

onMounted(() => {
  visibleCount.value = props.tabs.length;
  nextTick(() => measureTabs());
  window.addEventListener('resize', computeVisible);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', computeVisible);
});

watch(
  () => props.tabs,
  () => {
    visibleCount.value = props.tabs.length;
    nextTick(() => measureTabs());
  },
  { deep: true },
);
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
  /* 让第一个 tab 激活时的白色背景也能跟随 header 的左上圆角 */
  border-top-left-radius: inherit;
}

.tab-item {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  height: 50px;
  font-size: 13px;
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

.tab-more:hover .tab-more-dropdown {
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
  padding: 16px;
  min-height: 50vh;
}

.card-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  grid-auto-rows: 106px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

.empty-state {
  padding: 60px 0;
  text-align: center;
  font-size: 14px;
  color: var(--ao-color-text-tertiary);
}
</style>