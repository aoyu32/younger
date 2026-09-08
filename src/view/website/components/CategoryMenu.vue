<template>
  <div class="category-menu">
    <div class="menu-header">
      <span class="header-title">{{ title }}</span>
    </div>
    <div class="menu-body">
      <!-- data-lenis-prevent：滚轮悬停在菜单上时 Lenis 不接管，避免页面跟着滚动 -->
      <AoScrollbar ref="scrollbarRef" data-lenis-prevent>
        <div
          class="menu-group"
          v-for="(group, index) in data"
          :key="group.name"
        >
          <div
            class="menu-item level-1"
            :class="{
              expanded: expandedFirst.has(index),
              active: activeFirst === index,
            }"
            @click="handleFirstClick(index)"
          >
            <div class="item-main">
              <AoIcon v-if="group.icon" :icon="group.icon" size="15px"></AoIcon>
              <span class="item-name">{{ group.name }}</span>
            </div>
            <span
              class="arrow"
              :class="{ open: expandedFirst.has(index) }"
              v-if="group.children && group.children.length"
            ></span>
          </div>
          <div
            class="sub-list"
            :class="{ expanded: expandedFirst.has(index) }"
            :style="{
              height: expandedFirst.has(index)
                ? `${(group.children?.length || 0) * subItemHeight}px`
                : '0px',
            }"
          >
            <div
              class="menu-item level-2"
              :class="{ active: activeSecond === `${index}-${sIndex}` }"
              v-for="(sub, sIndex) in group.children"
              :key="sub.name"
              @click="handleSecondClick(index, sIndex, $event)"
            >
              <span class="item-name">{{ sub.name }}</span>
            </div>
          </div>
        </div>
      </AoScrollbar>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import AoScrollbar from '@/components/ao-scrollbar/index.vue';

export interface CategoryChild {
  name: string;
  [key: string]: any;
}

export interface CategoryGroup {
  name: string;
  icon?: string;
  children?: CategoryChild[];
}

const props = withDefaults(
  defineProps<{
    /** 菜单头部标题 */
    title?: string;
    /** 分类数据 */
    data?: CategoryGroup[];
    /** 默认展开的一级索引，-1 表示不展开 */
    defaultExpanded?: number;
    /** 外部控制的激活二级分类名（如滚动侦测），变化时自动选中并展开所在分组 */
    activeName?: string;
  }>(),
  {
    title: '网站分类',
    data: () => [],
    defaultExpanded: 0,
    activeName: '',
  },
);

const emit = defineEmits<{
  (
    e: 'select',
    group: CategoryGroup,
    sub: CategoryChild,
    el?: HTMLElement,
  ): void;
  (e: 'group-click', group: CategoryGroup): void;
}>();

const subItemHeight = 38; // 二级菜单项高度 34px + 上下 margin 2px

// 当前选中的一级 / 二级（二级用 "组索引-项索引" 标识）
// 默认选中 defaultExpanded 组的第一个二级项，与右侧默认展示内容保持一致
const hasDefault = props.data.length > 0 && props.defaultExpanded >= 0;
const activeFirst = ref(hasDefault ? props.defaultExpanded : -1);
const activeSecond = ref(hasDefault ? `${props.defaultExpanded}-0` : '');

// 当前展开的一级索引（可多组同时展开）
const expandedFirst = ref<Set<number>>(
  hasDefault ? new Set([props.defaultExpanded]) : new Set(),
);

// 数据异步加载后，默认展开与选中仍未设置时生效
watch(
  () => props.data.length,
  (len) => {
    if (len && expandedFirst.value.size === 0 && props.defaultExpanded >= 0) {
      expandedFirst.value = new Set([props.defaultExpanded]);
      activeFirst.value = props.defaultExpanded;
      activeSecond.value = `${props.defaultExpanded}-0`;
    }
  },
);

// 外部驱动激活（滚动侦测）：按名称定位分组与二级项；所在分组折叠时展开以便看到高亮，
// 但不自动滚动菜单滚动条
watch(
  () => props.activeName,
  (name) => {
    if (!name) return;
    for (let gIndex = 0; gIndex < props.data.length; gIndex++) {
      const group = props.data[gIndex];
      const sIndex = group.children?.findIndex((c) => c.name === name) ?? -1;
      if (sIndex > -1) {
        activeFirst.value = gIndex;
        activeSecond.value = `${gIndex}-${sIndex}`;
        if (!expandedFirst.value.has(gIndex)) {
          const next = new Set(expandedFirst.value);
          next.add(gIndex);
          expandedFirst.value = next;
        }
        return;
      }
    }
  },
);

const scrollbarRef = ref<InstanceType<typeof AoScrollbar>>();

// 点击菜单项后，若该项被裁切在可视区外则最小距离平滑滚入
const scrollActiveIntoView = () => {
  nextTick(() => {
    const wrap = scrollbarRef.value?.wrapRef;
    const el = wrap?.querySelector<HTMLElement>('.level-2.active');
    if (!wrap || !el) return;

    const wrapRect = wrap.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const elTop = elRect.top - wrapRect.top + wrap.scrollTop;
    const elBottom = elTop + elRect.height;

    if (elTop >= wrap.scrollTop && elBottom <= wrap.scrollTop + wrap.clientHeight) {
      return; // 已完整可见，不滚动
    }
    const target =
      elTop < wrap.scrollTop ? elTop : elBottom - wrap.clientHeight;
    wrap.scrollTo({ top: target, behavior: 'smooth' });
  });
};

const handleFirstClick = (index: number) => {
  const group = props.data[index];
  if (!group) return;

  // 点击已展开的一级：收起；否则展开（不影响其他分组）
  const next = new Set(expandedFirst.value);
  if (next.has(index)) {
    next.delete(index);
  } else {
    next.add(index);
  }
  expandedFirst.value = next;

  // 无子分类时，一级可直接选中
  if (!group.children?.length) {
    activeFirst.value = index;
    activeSecond.value = '';
    emit('group-click', group);
  }
};

const handleSecondClick = (
  gIndex: number,
  sIndex: number,
  e?: MouseEvent,
) => {
  const group = props.data[gIndex];
  const sub = group?.children?.[sIndex];
  if (!group || !sub) return;

  activeFirst.value = gIndex;
  activeSecond.value = `${gIndex}-${sIndex}`;
  scrollActiveIntoView();
  // 把被点击的导航项元素传给父级，用于锚点对齐
  emit(
    'select',
    group,
    sub,
    (e?.currentTarget ?? undefined) as HTMLElement | undefined,
  );
};
</script>

<style scoped lang="scss">
.category-menu {
  display: flex;
  flex-direction: column;
  width: 200px;
  height: 100%;
  background: var(--ao-gray-0);
  border: 1px solid var(--ao-gray-3);
  border-radius: var(--ao-border-radius-lg);
  box-shadow: var(--ao-shadow-xs);
  overflow: hidden;

  .menu-header {
    padding: 10px 15px;
    font-size: var(--ao-font-size-base);
    font-weight: 550;
    color: var(--ao-gray-8);
    position: relative;
    user-select: none;
    background-color: var(--ao-gray-2);
  }

  .menu-body {
    flex: 1;
    min-height: 0;
  }

  .menu-group {
    padding: 0 15px;
    padding-top: 5px;
  }

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-radius: var(--ao-border-radius-base);
    transition: all 0.2s ease;
    user-select: none;

    .item-main {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }

  :deep(.ao-scrollbar__bar) {
    width: 4px;
  }

  /* 切断滚动链：菜单滚到顶/底后不再把滚动传给页面，
     悬浮在菜单上时滚轮只作用于菜单 */
  :deep(.ao-scrollbar__wrap) {
    overscroll-behavior: contain;
  }

  .level-1 {
    height: 40px;
    padding: 0 10px;
    margin: 2px 0;
    color: var(--ao-gray-7);

    .item-name {
      font-size: var(--ao-font-size-sm);
      font-weight: var(--ao-font-weight-medium);
    }

    .arrow {
      width: 6px;
      height: 6px;
      border-right: 1.5px solid var(--ao-gray-5);
      border-bottom: 1.5px solid var(--ao-gray-5);
      transform: rotate(45deg) translateY(-2px);
      transition: transform 0.2s ease;

      &.open {
        transform: rotate(225deg) translateY(-2px);
      }
    }

    &:hover {
      color: var(--ao-gray-8);
    }

    /* 展开的分组：仅箭头变色，不加背景 */
    &.expanded {
      .arrow {
        border-color: var(--ao-color-primary);
      }
    }

    /* 激活：文本主题色 */
    &.active {
      color: var(--ao-color-primary);
    }
  }

  /* 二级分类 */
  .sub-list {
    position: relative;
    overflow: hidden;
    transition: height 0.25s ease;
  }

  .level-2 {
    height: 34px;
    padding: 0 10px 0 32px;
    margin: 2px 0;
    color: var(--ao-gray-6);
    font-size: 13px;
    position: relative;

    /* 激活项右侧的圆点（呼应右侧 section 标题左侧的圆点），
       item-name 为静态定位，圆点相对 .level-2 定位到最右侧 */
    .item-name::after {
      content: '';
      position: absolute;
      right: 12px;
      top: 50%;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--ao-color-primary);
      transform: translateY(-50%) scale(0);
      transition: transform 0.25s var(--ao-ease-in-out);
    }

    &::before {
      content: '';
      position: absolute;
      left: 18px;
      top: 50%;
      width: 8px;
      height: 1px;
      background: var(--ao-gray-4);
      transform: translateY(-50%);
    }

    &::after {
      content: '';
      position: absolute;
      left: 18px;
      top: -2px;
      bottom: -2px;
      width: 1px;
      background: var(--ao-gray-4);
    }

    &:last-child::after {
      bottom: 50%; // 止于自身中线，与横向短线相接
    }

    &:hover {
      background: var(--ao-gray-0);
      color: var(--ao-gray-8);
    }

    /* 激活：文本主题色 + 右侧圆点放大出现 */
    &.active {
      color: var(--ao-color-primary);
      font-weight: var(--ao-font-weight-medium);

      .item-name::after {
        transform: translateY(-50%) scale(1);
      }
    }
  }

  .footer {
    height: 20px;
    background-color: var(--ao-gray-2);
  }
}
</style>
