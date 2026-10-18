<template>
  <div class="topic-history">
    <div class="history-header">
      <div class="title">历史话题</div>
      <div class="month-filter">
        <button
          type="button"
          class="filter-trigger"
          :class="{ 'is-open': panelVisible }"
          @click="togglePanel"
        >
          <span class="filter-label">{{ activeMonth }}</span>
          <AoIcon :icon="arrowIcon" :size="16" class="filter-arrow" />
        </button>
        <Transition name="filter-fade">
          <div v-if="panelVisible" class="filter-panel">
            <AoScrollbar class="panel-years" height="216px">
              <button
                v-for="year in years"
                :key="year"
                type="button"
                class="year-item"
                :class="{ active: year === panelYear }"
                @click="panelYear = year"
              >
                {{ year }}年
              </button>
            </AoScrollbar>
            <AoScrollbar ref="monthsRef" class="panel-months" height="216px">
              <button
                v-for="month in MONTH_LIST"
                :key="month"
                type="button"
                class="month-item"
                :class="{ active: isActiveMonth(month) }"
                @click="selectMonth(month)"
              >
                {{ month }}月
              </button>
            </AoScrollbar>
          </div>
        </Transition>
      </div>
    </div>
    <AoScrollbar class="history-scroll">
      <div class="history-list">
        <div
          v-for="item in visibleList"
          :key="item.id"
          class="history-item"
          :class="{ active: item.id === activeId }"
          @click="emit('select', item.id)"
        >
          <div class="item-title">{{ item.title }}</div>
          <div class="item-foot">
            <span class="item-date">{{ item.date }}</span>
            <span v-if="item.tag" class="item-line"></span>
            <span v-if="item.tag" class="item-tag">#{{ item.tag }}</span>
          </div>
        </div>
        <div v-if="visibleList.length === 0" class="history-empty">
          该月暂无话题
        </div>
      </div>
    </AoScrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import AoIcon from '@/components/ao-icon/index.vue';
import AoScrollbar from '@/components/ao-scrollbar/index.vue';
import arrowIcon from '@/assets/topic/icon_arrow_down.svg';
import type { TopicHistoryItem } from '../types';

defineOptions({
  name: 'TopicHistory',
});

const props = withDefaults(
  defineProps<{
    list: TopicHistoryItem[];
    activeId: number;
  }>(),
  {
    list: () => [],
    activeId: 0,
  },
);

const emit = defineEmits<{
  select: [id: number];
}>();

const MONTH_LIST = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const pad = (value: number) => String(value).padStart(2, '0');
const toMonth = (date: string) => date.slice(0, 7);
const yearMonth = (year: number, month: number) => `${year}-${pad(month)}`;

const activeMonth = ref('');
const panelVisible = ref(false);
const panelYear = ref(new Date().getFullYear());
const monthsRef = ref<InstanceType<typeof AoScrollbar> | null>(null);

const years = computed(() => {
  const list = [
    ...new Set(props.list.map((item) => Number(item.date.slice(0, 4)))),
  ];
  return list.sort((a, b) => b - a);
});

const visibleList = computed(() =>
  props.list.filter((item) => toMonth(item.date) === activeMonth.value),
);

const isActiveMonth = (month: number) =>
  yearMonth(panelYear.value, month) === activeMonth.value;

const scrollActiveIntoView = () => {
  const wrap = monthsRef.value?.wrapRef;
  const target = wrap?.querySelector<HTMLElement>('.month-item.active');
  if (!wrap || !target) return;

  const wrapRect = wrap.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  if (targetRect.top >= wrapRect.top && targetRect.bottom <= wrapRect.bottom) {
    return;
  }

  wrap.scrollTop +=
    targetRect.top - wrapRect.top - (wrap.clientHeight - targetRect.height) / 2;
};

const togglePanel = async () => {
  panelVisible.value = !panelVisible.value;
  if (!panelVisible.value) return;

  panelYear.value = Number(activeMonth.value.slice(0, 4)) || years.value[0];
  await nextTick();
  scrollActiveIntoView();
};

const selectMonth = (month: number) => {
  activeMonth.value = yearMonth(panelYear.value, month);
  panelVisible.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (!panelVisible.value) return;

  const target = event.target as HTMLElement;
  if (!target.closest('.filter-trigger') && !target.closest('.filter-panel')) {
    panelVisible.value = false;
  }
};

watch(panelVisible, (visible) => {
  if (visible) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

watch(
  () => props.list[0]?.date,
  (latest) => {
    if (activeMonth.value || !latest) return;

    activeMonth.value = toMonth(latest);
    panelYear.value = Number(latest.slice(0, 4));
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
.topic-history {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.history-header {
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 16px;
  background-color: var(--ao-gray-3);
  border-bottom: var(--ao-border-width-thin) solid var(--ao-gray-4);

  .title {
    font-size: var(--ao-font-size-base);
    font-weight: var(--ao-font-weight-semibold);
    line-height: 24px;
    color: var(--ao-color-text-base);
  }
}

.month-filter {
  position: relative;
  flex: none;
}

.filter-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  border: none;
  border-radius: var(--ao-border-radius-sm);
  background: none;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-secondary);
  cursor: pointer;
  transition:
    color var(--ao-duration-fast) var(--ao-ease-out),
    background-color var(--ao-duration-fast) var(--ao-ease-out);

  &:hover,
  &.is-open {
    color: var(--ao-color-primary);
  }

  &.is-open .filter-arrow {
    transform: rotate(180deg);
  }
}

.filter-arrow {
  transition: transform var(--ao-duration-fast) var(--ao-ease-out);
}

.filter-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: var(--ao-z-dropdown);
  display: flex;
  width: 180px;
  overflow: hidden;
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-color-bg-elevated);
  box-shadow: var(--ao-shadow-md);
}

.panel-years {
  flex: none;
  width: 78px;
  background-color: var(--ao-gray-2);
  border-right: var(--ao-border-width-thin) solid var(--ao-color-border);
}

.panel-months {
  flex: 1;
  min-width: 0;
}

.panel-years,
.panel-months {
  :deep(.ao-scrollbar__wrap) {
    padding: 6px 4px;
    overscroll-behavior: contain;
  }

  :deep(.ao-scrollbar__bar) {
    width: 4px;

    &.is-vertical {
      top: 6px;
      right: 1px;
      bottom: 6px;
      border-radius: var(--ao-border-radius-full);
    }
  }
}

.year-item,
.month-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  padding: 0 8px;
  border: none;
  border-radius: var(--ao-border-radius-sm);
  background: none;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-secondary);
  cursor: pointer;
  transition:
    color var(--ao-duration-fast) var(--ao-ease-out),
    background-color var(--ao-duration-fast) var(--ao-ease-out);

  &:hover {
    background-color: var(--ao-gray-3);
  }

  &.active {
    color: var(--ao-color-primary);
    background-color: color-mix(
      in srgb,
      var(--ao-color-primary) 10%,
      transparent
    );

    &:hover {
      background-color: color-mix(
        in srgb,
        var(--ao-color-primary) 14%,
        transparent
      );
    }
  }
}

.filter-fade-enter-active,
.filter-fade-leave-active {
  transition:
    opacity var(--ao-duration-fast) var(--ao-ease-out),
    transform var(--ao-duration-fast) var(--ao-ease-out);
}

.filter-fade-enter-from,
.filter-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.history-scroll {
  flex: 1;
  min-height: 0;

  :deep(.ao-scrollbar__wrap) {
    padding: 12px;
    overscroll-behavior: contain;
  }

  :deep(.ao-scrollbar__bar) {
    width: 6px;

    &.is-vertical {
      right: 2px;
      top: 8px;
      bottom: 8px;
      border-radius: var(--ao-border-radius-full);
    }
  }
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-item {
  position: relative;
  padding: 10px 12px;
  border-radius: var(--ao-border-radius-base);
  cursor: pointer;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-out);

  &:hover {
    background-color: color-mix(
      in srgb,
      var(--ao-color-primary) 6%,
      transparent
    );
  }

  &.active {
    .item-title {
      color: var(--ao-color-primary);
      font-weight: var(--ao-font-weight-semibold);
    }
  }
}

.item-title {
  display: -webkit-box;
  overflow: hidden;
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-medium);
  line-height: var(--ao-line-height-base);
  color: var(--ao-color-text-base);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.item-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: 8px;
}

.item-date {
  flex: none;
  font-size: 14px;
  font-variant-numeric: tabular-nums;
  color: var(--ao-color-text-tertiary);
}

.item-line {
  flex: 1;
  min-width: 12px;
  height: 1px;
  align-self: flex-end;
  margin-bottom: 3px;
  background-color: var(--ao-color-border);

  @media (min-resolution: 1.2dppx) and (max-resolution: 1.3dppx) {
    height: 0.8px;
  }

  @media (min-resolution: 1.4dppx) and (max-resolution: 1.6dppx) {
    height: 0.668px;
  }

  @media (min-resolution: 1.7dppx) and (max-resolution: 1.8dppx) {
    height: 0.573px;
  }
}

.item-tag {
  flex: none;
  min-width: 4.6em;
  overflow: hidden;
  font-size: 14px;
  color: var(--ao-color-text-tertiary);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.history-empty {
  padding: 50px 0;
  text-align: center;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-tertiary);
}
</style>
