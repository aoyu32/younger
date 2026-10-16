<template>
  <div class="user-center-tabs">
    <aside class="nav-wrapper">
      <AoScrollbar class="nav-scroll">
        <nav class="side-nav">
          <template v-for="group in navGroups" :key="group.key">
            <div v-if="group.children" class="nav-group">
              <div class="nav-group__title">
                {{ group.parts.prefix
                }}<span class="nav-group__keyword">{{
                  group.parts.keyword
                }}</span
                >{{ group.parts.suffix }}
              </div>
              <ul class="nav-group__list">
                <li
                  v-for="item in group.children"
                  :key="item.key"
                  class="nav-item"
                  :class="{ 'is-active': activeKey === item.key }"
                  @click="handleSelect(item)"
                  @mouseenter="hoverKey = item.key"
                  @mouseleave="hoverKey = null"
                >
                  <NavFlowerLine
                    v-if="isDecorated(item.key)"
                    class="nav-item__flower"
                  />
                  <span class="nav-item__text">{{ item.title }}</span>
                </li>
              </ul>
            </div>
            <div
              v-else
              class="nav-item nav-item--single"
              :class="{ 'is-active': activeKey === group.key }"
              @click="handleSelect(group)"
              @mouseenter="hoverKey = group.key"
              @mouseleave="hoverKey = null"
            >
              <NavFlowerLine
                v-if="isDecorated(group.key)"
                class="nav-item__flower"
              />
              <span class="nav-item__text">{{ group.title }}</span>
            </div>
          </template>
        </nav>
      </AoScrollbar>
    </aside>

    <section class="tabs-wrapper">
      <header class="content-header">
        <div class="breadcrumb">
          <div class="breadcrumb__rose">
            <SwayingRose />
          </div>
          <template v-for="(crumb, index) in breadcrumbs" :key="index">
            <span
              class="breadcrumb-item"
              :class="{ 'is-current': index === breadcrumbs.length - 1 }"
              @click="handleBreadcrumbClick(index)"
              >{{ crumb }}</span
            >
            <span
              v-if="index < breadcrumbs.length - 1"
              class="breadcrumb-separator"
              >/</span
            >
          </template>
        </div>
        <div class="header-actions">
          <slot
            name="actions"
            :active-key="activeKey"
            :active-item="activeItem"
          />
        </div>
      </header>

      <div class="content-inner">
        <ao-scrollbar class="content-body">
          <slot :active-key="activeKey" :active-item="activeItem" />
        </ao-scrollbar>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import NavFlowerLine from './NavFlowerLine.vue';
import SwayingRose from './SwayingRose.vue';

interface NavItem {
  key: string;
  title: string;
  /** 标题中需要标品牌色的关键字 */
  keyword?: string;
  children?: NavItem[];
}

const menuGroups: NavItem[] = [
  {
    key: 'course',
    title: '视频课程',
    keyword: '视频',
    children: [
      { key: 'course-watching', title: '历史记录' },
      { key: 'course-purchased', title: '我购买的' },
    ],
  },
  {
    key: 'collect',
    title: '我的收藏',
    keyword: '收藏',
    children: [
      { key: 'collect-video', title: '视频课程' },
      { key: 'collect-app', title: '应用APP' },
      { key: 'collect-website', title: '网站收藏' },
      { key: 'collect-post', title: '帖子收藏' },
    ],
  },
  {
    key: 'order',
    title: '我的订单',
    keyword: '订单',
    children: [
      { key: 'order-vip', title: '会员开通' },
      { key: 'order-course', title: '购买课程' },
    ],
  },
  {
    key: 'personal-info',
    title: '个人信息',
    keyword: '信息',
    children: [{ key: 'profile', title: '我的资料' }],
  },
  {
    key: 'security',
    title: '账号安全',
    keyword: '账号',
    children: [
      { key: 'security-info', title: '账号信息' },
      { key: 'security-password', title: '修改密码' },
    ],
  },
];

const activeKey = ref('course-watching');

/** 当前悬浮的导航项 key */
const hoverKey = ref<string | null>(null);

/** 悬浮或激活时展示藤蔓玫瑰下划线（v-if 切换可使 SVG 动画重新播放） */
function isDecorated(key: string) {
  return activeKey.value === key || hoverKey.value === key;
}

/** 把分组标题拆成「前缀 + 关键字 + 后缀」，关键字单独上品牌色 */
const navGroups = computed(() =>
  menuGroups.map((group) => ({
    ...group,
    parts: splitTitle(group.title, group.keyword),
  })),
);

function splitTitle(title: string, keyword?: string) {
  const index = keyword ? title.indexOf(keyword) : -1;
  if (index < 0) return { prefix: title, keyword: '', suffix: '' };
  return {
    prefix: title.slice(0, index),
    keyword: keyword as string,
    suffix: title.slice(index + (keyword as string).length),
  };
}

const activeItem = computed<NavItem | undefined>(() =>
  findItem(menuGroups, activeKey.value),
);

const breadcrumbs = computed<string[]>(() => {
  const item = activeItem.value;
  if (!item) return [];
  const parent = menuGroups.find((group) =>
    group.children?.some((child) => child.key === item.key),
  );
  return parent ? [parent.title, item.title] : [item.title];
});

function findItem(groups: NavItem[], key: string): NavItem | undefined {
  for (const group of groups) {
    if (group.key === key) return group;
    const child = group.children?.find((item) => item.key === key);
    if (child) return child;
  }
  return undefined;
}

const emit = defineEmits<{
  change: [item: NavItem];
}>();

function handleSelect(item: NavItem) {
  activeKey.value = item.key;
  emit('change', item);
}

/* 点击面包屑上级：跳到该分组的第一个二级项 */
function handleBreadcrumbClick(index: number) {
  if (index === breadcrumbs.value.length - 1) return;
  const group = menuGroups.find((g) => g.title === breadcrumbs.value[index]);
  if (!group) return;
  handleSelect(group.children?.[0] ?? group);
}

/**
 * 通过菜单 key 激活导航项（外部跳转进入时使用）
 * 传分组 key（如 collect）时激活该分组下的第一个二级项，与点击面包屑上级同一规则
 */
function setActive(key: string) {
  const item = findItem(menuGroups, key);
  if (!item) return;
  handleSelect(item.children?.[0] ?? item);
}

defineExpose({ setActive });
</script>

<style scoped lang="scss">
$nav-padding-x: 15px;
$bw: 1px;

.user-center-tabs {
  display: flex;
  align-items: stretch;
  gap: var(--ao-spacing-md);
  width: 100%;
  height: 100%;
}

.nav-wrapper {
  flex-shrink: 0;
  width: 200px;
  padding: 20px $nav-padding-x;
  display: flex;
  flex-direction: column;
  background-color: var(--ao-color-bg-container);
  border: $bw solid var(--ao-gray-4);
  border-radius: var(--ao-border-radius-lg);
}

/* 菜单滚动区：撑满 nav-wrapper 剩余高度，内部滚动 */
.nav-scroll {
  flex: 1;
  min-height: 0;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-group {
  display: flex;
  flex-direction: column;
  gap: 15px;

  &__title {
    padding: 0 10px;
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-semibold);
    color: var(--ao-color-text-secondary);
    line-height: var(--ao-line-height-tight);
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__keyword {
    color: var(--ao-color-primary);
  }
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  height: 40px;
  padding: 0 15px;
  border: $bw solid transparent;
  border-radius: var(--ao-border-radius-base);
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-secondary);
  cursor: pointer;
  transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover {
    color: var(--ao-color-primary);
  }

  &.is-active {
    color: var(--ao-lime-4);
  }

  &__flower {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
    height: 44px;
    color: var(--ao-color-primary);
    pointer-events: none;
  }

  &__text {
    position: relative;
    z-index: 1;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

.tabs-wrapper {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--ao-color-bg-container);
  border: $bw solid var(--ao-gray-4);
  border-radius: var(--ao-border-radius-lg);
  box-sizing: border-box;
}

.content-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ao-spacing-md);
  min-height: var(--ao-header-height-base);
  padding: 15px;
  border-bottom: $bw solid var(--ao-gray-4);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-xs);
  min-width: 0;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-secondary);
}

.breadcrumb-item {
  white-space: nowrap;
  cursor: pointer;
  transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover {
    color: var(--ao-color-primary);
  }

  &.is-current {
    color: var(--ao-color-text-base);
    font-weight: var(--ao-font-weight-medium);
    cursor: default;

    &:hover {
      color: var(--ao-color-text-base);
    }
  }
}

.breadcrumb-separator {
  color: var(--ao-color-text-disabled);
}

/* 面包屑左侧摇曳的玫瑰 */
.breadcrumb__rose {
  flex-shrink: 0;
  width: 20px;
}

.header-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-md);
}

.content-body {
  flex: 1;
  min-height: 0;
  height: auto;
}

.content-inner {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}
</style>
