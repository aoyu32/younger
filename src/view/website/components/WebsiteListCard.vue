<template>
  <div class="website-list-card">
    <div class="header" v-if="titlePos === 'left'">
      <div class="header-left">
        <div class="title">{{ title }}</div>
      </div>
      <div class="header-right">
        <div class="action">
          <slot name="action"></slot>
        </div>
      </div>
    </div>
    <div class="header" v-else>
      <div class="header-right">
        <div class="action">
          <slot name="action"></slot>
        </div>
      </div>
      <div class="header-left">
        <div class="title">{{ title }}</div>
      </div>
    </div>
    <AoPage
      class="list"
      v-model:current="currentPage"
      :size="dynamicPageSize"
      :total="data.length"
      controls-position="bottom"
    >
      <template #controls="{ isPrev, isNext, change }">
        <div class="footer">
          <div class="footer-left">
            <div class="number">{{ currentPage }} / {{ totalPages }}</div>
          </div>
          <div class="footer-right">
            <div class="controls">
              <div
                class="pre-btn"
                :class="{ disabled: isPrev }"
                @click="change('pre')"
              >
                <AoImage
                  src="@/assets/home/icon_pre.svg"
                  width="16px"
                  height="16px"
                />
              </div>
              <div
                class="next-btn"
                :class="{ disabled: isNext }"
                @click="change('next')"
              >
                <AoImage
                  src="@/assets/home/icon_next.svg"
                  width="16px"
                  height="16px"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <div
        class="list-wrapper"
        ref="listWrapperRef"
        v-if="pagedData.length > 0"
      >
        <div
          class="card-item"
          v-for="(item, index) in pagedData"
          :key="item.id ?? item.name"
          :class="{
            'is-selecting': editing,
            'is-selected': isSelected(index),
          }"
          @click="handleCardClick(index)"
        >
          <span class="check" v-if="editing"></span>
          <div class="icon">
            <img :src="item.icon" alt="" />
          </div>
          <div class="name">
            {{ item.name }}
          </div>
        </div>
      </div>
      <div class="empty flex-center" v-else>
        <AoImage
          src="@/assets/website/icon_empty.svg"
          width="64px"
          height="64px"
        ></AoImage>
        <p>{{ empty }}</p>
      </div>
    </AoPage>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

interface WebsiteData {
  id?: number | string;
  icon: string;
  name: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    titlePos?: string;
    data: WebsiteData[];
    pageSize?: number;
    empty?: string;
    /** 编辑模式：卡片右上角显示勾选框，点击卡片切换选中 */
    editing?: boolean;
    /** 选中的全局索引（相对 data） */
    selected?: number[];
  }>(),
  {
    title: '标题',
    data: () => [
      {
        icon: '',
        name: '',
      },
    ],
    titlePos: 'left',
    pageSize: 12,
    empty: '暂无内容',
    editing: false,
    selected: () => [],
  },
);

const emit = defineEmits<{
  'update:selected': [value: number[]];
}>();

// 与下方 .list-wrapper 的 grid 定义保持一致
const GRID_MIN_COL = 128;
const GRID_ROW_HEIGHT = 100;
const GRID_GAP = 20;
// 容器高度存在亚像素误差时，避免刚好差 1~2px 就少算一行/一列
const GRID_TOLERANCE = 4;

const listWrapperRef = ref<HTMLElement>();

// 每页数量 = 网格容量（列数 × 行数），随容器尺寸自动重算，
// 保证满页时内容正好填满、间距固定
const dynamicPageSize = ref(props.pageSize);

const currentPage = ref(1);

const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.data.length / dynamicPageSize.value)),
);

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * dynamicPageSize.value;
  return props.data.slice(start, start + dynamicPageSize.value);
});

/** 当前页第 index 项在完整 data 中的下标 */
const dataIndex = (index: number) =>
  (currentPage.value - 1) * dynamicPageSize.value + index;

const isSelected = (index: number) => props.selected.includes(dataIndex(index));

const handleCardClick = (index: number) => {
  if (!props.editing) return;
  const target = dataIndex(index);
  const next = new Set(props.selected);
  if (next.has(target)) {
    next.delete(target);
  } else {
    next.add(target);
  }
  emit(
    'update:selected',
    [...next].sort((a, b) => a - b),
  );
};

// 退出编辑模式时清空勾选
watch(
  () => props.editing,
  (editing) => {
    if (!editing) emit('update:selected', []);
  },
);

// 页容量变化后全局下标会失效，清空勾选
watch(dynamicPageSize, () => {
  emit('update:selected', []);
});

function updatePageSize() {
  const el = listWrapperRef.value;
  if (!el) return;
  const cs = getComputedStyle(el);
  const width =
    el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const height =
    el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const cols = Math.max(
    1,
    Math.floor((width + GRID_GAP + GRID_TOLERANCE) / (GRID_MIN_COL + GRID_GAP)),
  );
  const rows = Math.max(
    1,
    Math.floor(
      (height + GRID_GAP + GRID_TOLERANCE) / (GRID_ROW_HEIGHT + GRID_GAP),
    ),
  );
  dynamicPageSize.value = cols * rows;
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  updatePageSize();
  resizeObserver = new ResizeObserver(updatePageSize);
  if (listWrapperRef.value) {
    resizeObserver.observe(listWrapperRef.value);
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  resizeObserver = null;
});

// 页容量或数据量变化时避免当前页码越界
watch([dynamicPageSize, () => props.data.length], () => {
  const max = totalPages.value;
  if (currentPage.value > max) {
    currentPage.value = max;
  }
});
</script>

<style scoped lang="scss">
.website-list-card {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: var(--ao-color-bg-container);
  box-shadow: var(--ao-shadow-sm);
  border-radius: var(--ao-border-radius-lg);
  overflow: hidden;
}

.header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ao-spacing-sm) var(--ao-spacing-md);
  background-color: var(--ao-gray-2);

  .header-left {
    display: flex;
    align-items: center;
    gap: var(--ao-spacing-xs);

    .icon {
      width: var(--ao-size-icon-md);
      height: var(--ao-size-icon-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ao-color-primary);

      img,
      svg {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .title {
      font-size: var(--ao-font-size-base);
      font-weight: var(--ao-font-weight-semibold);
      line-height: var(--ao-line-height-tight);
      color: var(--ao-color-text-base);
    }
  }

  .header-right {
    .action {
      display: flex;
      align-items: center;
      gap: var(--ao-spacing-xs);
    }
  }
}

.list {
  flex: 1;
  min-height: 0;

  .list-wrapper {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
    gap: 20px;
    align-content: start;
    padding: var(--ao-spacing-md);
  }
}

.footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ao-spacing-sm) var(--ao-spacing-md);
  border-top: var(--ao-border-width-thin) solid var(--ao-color-divider);
  background-color: var(--ao-gray-2);

  .footer-left {
    .number {
      font-size: var(--ao-font-size-sm);
      line-height: var(--ao-line-height-tight);
      color: var(--ao-color-text-secondary);
    }
  }

  .footer-right {
    .controls {
      display: flex;
      align-items: center;
      gap: var(--ao-spacing-xs);
    }
  }
}

.pre-btn,
.next-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--ao-border-radius-sm);
  background-color: var(--ao-color-bg-container);
  border: var(--ao-border-width-thin) solid var(--ao-color-border-secondary);
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color var(--ao-duration-base) var(--ao-ease-in-out);

  &:hover {
    background-color: var(--ao-gray-3);
  }

  &.disabled {
    opacity: var(--ao-opacity-disabled);
    cursor: not-allowed;
  }
}

.empty {
  width: 100%;
  height: 100%;
  flex-direction: column;
  gap: 15px;
  p {
    color: var(--ao-gray-7);
  }
}

.card-item {
  position: relative;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ao-spacing-xs);
  background-color: var(--ao-color-bg-container);
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-radius: 10px;
  box-sizing: border-box;
  cursor: pointer;
  transition:
    box-shadow var(--ao-duration-base) var(--ao-ease-in-out),
    transform var(--ao-duration-base) var(--ao-ease-in-out),
    border-color var(--ao-duration-base) var(--ao-ease-in-out);

  &:hover {
    box-shadow: var(--ao-shadow-md);
    transform: translateY(calc(var(--ao-border-width-medium) * -1));
  }

  &.is-selecting:hover .check {
    border-color: var(--ao-color-primary);
  }

  .check {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 16px;
    height: 16px;
    box-sizing: border-box;
    border: var(--ao-border-width-thin) solid var(--ao-color-border);
    border-radius: 4px;
    background-color: var(--ao-color-bg-container);
    pointer-events: none;
    transition:
      background-color var(--ao-duration-base) var(--ao-ease-in-out),
      border-color var(--ao-duration-base) var(--ao-ease-in-out);
  }

  &.is-selected {
    border-color: var(--ao-color-primary);

    .check {
      border-color: var(--ao-color-primary);
      background-color: var(--ao-color-primary);

      &::after {
        content: '';
        position: absolute;
        top: 1px;
        left: 4px;
        width: 5px;
        height: 9px;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
      }
    }
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
}
</style>
