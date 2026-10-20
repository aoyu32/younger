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
      :size="pageSize"
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
      <div class="list-wrapper" v-if="pagedData.length > 0">
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
import { computed, ref, watch } from 'vue';

interface WebsiteData {
  id?: number | string;
  icon: string;
  name: string;
  url?: string;
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
  open: [item: WebsiteData];
}>();

const currentPage = ref(1);

// 固定四行三列，条目不足时也保留卡片尺寸
const totalPages = computed(() =>
  Math.max(1, Math.ceil(props.data.length / props.pageSize)),
);

const pagedData = computed(() => {
  const start = (currentPage.value - 1) * props.pageSize;
  return props.data.slice(start, start + props.pageSize);
});

/** 当前页第 index 项在完整 data 中的下标 */
const dataIndex = (index: number) =>
  (currentPage.value - 1) * props.pageSize + index;

const isSelected = (index: number) => props.selected.includes(dataIndex(index));

const handleCardClick = (index: number) => {
  if (!props.editing) {
    const item = pagedData.value[index];
    if (item?.url) emit('open', item);
    return;
  }
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

// 页容量或数据量变化时避免当前页码越界
watch([() => props.pageSize, () => props.data.length], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
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
    // 固定三列四行：即使当前页不足 3 个，卡片也不会被拉宽
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-auto-rows: 100px;
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
