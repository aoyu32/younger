<template>
    <div
      ref="barRef"
      class="profile-mobile-nav"
      :class="{ 'is-stuck': isStuck }"
      data-lenis-prevent
    >
    <div
      class="nav-btn nav-btn--prev"
      :class="{ disabled: scrollAtStart }"
      @click="scrollByItem(-1)"
    >
      <AoImage src="@/assets/home/icon_pre.svg" width="12px" height="12px" />
    </div>
      <div class="nav-scroll" ref="scrollRef" @scroll="handleNavScroll">
        <div
          v-for="(group, index) in groups"
          :key="group.key"
          :ref="(el) => setChipRef(group.key, el)"
          class="nav-item"
          :class="{
            active: isGroupActive(group),
            open: openGroup === group.key,
            'is-middle': index === middleIndex,
          }"
          @pointerenter="handleGroupEnter(group.key)"
          @click="handleGroupClick(group.key)"
        >
          {{ group.title }}
        </div>
      </div>
    <div
      class="nav-btn nav-btn--next"
      :class="{ disabled: scrollAtEnd }"
      @click="scrollByItem(1)"
    >
      <AoImage src="@/assets/home/icon_next.svg" width="12px" height="12px" />
    </div>
    <!-- 二级菜单：竖向下拉面板，挂在导航条下方，左右对齐当前一级分类插槽 -->
    <Transition name="sub-panel">
      <div
        v-if="openGroupChildren.length"
        class="sub-panel"
        :style="panelStyle"
        @pointerleave="handleRowLeave"
      >
        <div
          v-for="child in openGroupChildren"
          :key="child.key"
          class="sub-item"
          :class="{ active: child.key === activeKey }"
          @click="handleChildClick(child)"
        >
          {{ child.title }}
        </div>
      </div>
    </Transition>
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

defineOptions({
  name: 'ProfileMobileNav',
});

interface NavChild {
  key: string;
  title: string;
}

interface NavGroup {
  key: string;
  title: string;
  children?: NavChild[];
}

const props = defineProps<{
  /** 激活的菜单项 key */
  activeKey: string;
  /** 一级分组数据 */
  groups: NavGroup[];
}>();

const emit = defineEmits<{
  select: [item: NavChild];
}>();

const barRef = ref<HTMLElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const chipRefs = new Map<string, HTMLElement>();
const setChipRef = (key: string, el: any) => {
  if (el) chipRefs.set(key, el.$el ?? el);
  else chipRefs.delete(key);
};

/** 当前展开二级菜单的一级分类 key */
const openGroup = ref('');
// 悬浮能力检测：桌面端悬浮即展开，触屏端点按切换
const hoverCapable = matchMedia('(hover: hover)').matches;

/* ---------- 一级分类横向翻动：按钮逐个翻动 ---------- */
const scrollAtStart = ref(true);
const scrollAtEnd = ref(false);

const updateScrollState = () => {
  const el = scrollRef.value;
  if (!el) return;
  scrollAtStart.value = el.scrollLeft <= 1;
  scrollAtEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
  updateMiddleIndex();
};

/* 当前可视页中间项的下标（0 基）：分割线只画在它左右两侧 */
const middleIndex = ref(1);

const updateMiddleIndex = () => {
  const el = scrollRef.value;
  if (!el) return;
  const firstItem = el.querySelector('.nav-item') as HTMLElement | null;
  const slot = firstItem ? firstItem.offsetWidth : 0;
  if (!slot) return;
  const page = Math.min(
    Math.max(Math.round(el.scrollLeft / slot), 0),
    props.groups.length - 3,
  );
  // 可视页显示 [page, page+1, page+2]，中间项为 page + 1
  middleIndex.value = Math.min(page + 1, props.groups.length - 1);
};

const scrollByItem = (direction: number) => {
  // 翻页时收起展开中的二级菜单
  openGroup.value = '';
  const el = scrollRef.value;
  if (!el) return;
  const firstItem = el.querySelector('.nav-item') as HTMLElement | null;
  const step = firstItem ? firstItem.offsetWidth + 1 : 160;
  el.scrollBy({ left: direction * step, behavior: 'smooth' });
};

const handleNavScroll = () => {
  openGroup.value = '';
  updateScrollState();
  notifyLayout();
};

/* 吸附状态：导航条顶部到达 header 下沿后进入吸附（占满视口宽度） */
const isStuck = ref(false);

const updateStuck = () => {
  const bar = barRef.value;
  if (!bar) return;
  isStuck.value = bar.getBoundingClientRect().top <= 65;
};

const isGroupActive = (group: NavGroup) =>
  group.children?.some((child) => child.key === props.activeKey) ?? false;

const openGroupChildren = computed(
  () =>
    props.groups.find((group) => group.key === openGroup.value)?.children ?? [],
);

/* ---------- 下拉面板定位：computed 实时计算（悬浮切换分类时立即按
   最新坐标对齐，不存在"内容新、位置旧"的错位） ---------- */
const layoutTick = ref(0);
const notifyLayout = () => {
  layoutTick.value++;
};

const panelStyle = computed(() => {
  // 依赖 layoutTick：导航条滚动/尺寸变化时强制重算
  void layoutTick.value;
  const bar = barRef.value;
  const chip = openGroup.value ? chipRefs.get(openGroup.value) : null;
  if (!bar || !chip) return { left: '-9999px', width: '0px' };
  const barRect = bar.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  // 面板与插槽同宽；插槽贴近视口边缘时向内收，保证不超出屏幕
  const width = chipRect.width;
  const relLeft = chipRect.left - barRect.left;
  const left = Math.min(Math.max(relLeft, 8), barRect.width - width - 8);
  return { left: `${left}px`, width: `${width}px` };
});

const handleGroupEnter = (key: string) => {
  if (hoverCapable) openGroup.value = key;
};

const handleGroupClick = (key: string) => {
  // 桌面端由悬浮控制展开，点击不做切换
  if (hoverCapable) return;
  openGroup.value = openGroup.value === key ? '' : key;
};

const handleRowLeave = () => {
  if (hoverCapable) openGroup.value = '';
};

const handleChildClick = (child: NavChild) => {
  emit('select', child);
  openGroup.value = '';
};

// 点击导航外部时收起二级菜单（触屏场景）
const handleDocClick = (event: Event) => {
  if (barRef.value && !barRef.value.contains(event.target as Node)) {
    openGroup.value = '';
  }
};

/* 激活项变化（点选二级项）后，所属一级 chip 不在可视页时自动翻过去 */
watch(
  () => props.activeKey,
  (key) => {
    const el = scrollRef.value;
    if (!el || !key) return;
    const group = props.groups.find((item) =>
      item.children?.some((child) => child.key === key),
    );
    const chip = group ? chipRefs.get(group.key) : null;
    if (!chip) return;
    const elRect = el.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const visible =
      chipRect.left >= elRect.left && chipRect.right <= elRect.right;
    if (!visible) {
      chip.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  },
);

let barObserver: ResizeObserver | null = null;

onMounted(() => {
  document.addEventListener('click', handleDocClick);
  window.addEventListener('scroll', updateStuck, { passive: true });
  window.addEventListener('resize', updateStuck);
  if (barRef.value && typeof ResizeObserver !== 'undefined') {
    barObserver = new ResizeObserver(() => {
      updateScrollState();
      notifyLayout();
      updateStuck();
    });
    barObserver.observe(barRef.value);
  }
  nextTick(() => {
    updateScrollState();
    updateStuck();
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocClick);
  window.removeEventListener('scroll', updateStuck);
  window.removeEventListener('resize', updateStuck);
  barObserver?.disconnect();
  barObserver = null;
});
</script>

<style scoped lang="scss">
.profile-mobile-nav {
  display: none;
}

@media (max-width: 768px) {
  .profile-mobile-nav {
    /* 非吸附态：与页面内容对齐；
       吸附态（.is-stuck）负 margin 全出血，通栏占满视口宽度。
       z-index 4：高于内容卡片内部的浮层（播放时间 z2、勾选框 z3），
       保证二级下拉面板盖在视频卡片之上 */
    position: sticky;
    top: var(--ao-header-height-lg);
    z-index: 4;
    display: flex;
    align-items: stretch;
    background-color: var(--ao-color-bg-container);
    border-radius: var(--ao-border-radius-lg);
    box-shadow: var(--ao-shadow-sm);

    &.is-stuck {
      width: 100vw;
      margin-left: calc(50% - 50vw);
      margin-right: calc(50% - 50vw);
      border-radius: 0;
    }
  }

  .nav-btn {
    flex-shrink: 0;
    align-self: stretch;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    background-color: color-mix(in srgb, var(--ao-gray-6) 14%, transparent);
    cursor: pointer;
    user-select: none;
    transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:not(.disabled) {
      background-color: color-mix(in srgb, var(--ao-gray-6) 24%, transparent);

      &:hover {
        background-color: color-mix(in srgb, var(--ao-gray-6) 32%, transparent);
      }
    }

    &.disabled {
      cursor: not-allowed;
    }
  }

  .nav-scroll {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    overflow-x: hidden;
    white-space: nowrap;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 0;
  }

  .nav-item {
    position: relative;
    flex: 0 0 33.333%;
    overflow: hidden;
    padding: 10px 8px;
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-medium);
    color: var(--ao-color-text-base);
    text-align: center;
    text-overflow: ellipsis;
    cursor: pointer;
    scroll-snap-align: start;
    transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

    /* 分割线：只画在当前可视页中间项的左右两侧 */
    &.is-middle::before,
    &.is-middle::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: var(--ao-border-width-thin);
      height: 14px;
      background-color: var(--ao-color-border);
      pointer-events: none;
    }

    &.is-middle::before {
      left: 0;
    }

    &.is-middle::after {
      right: 0;
    }

    &:hover {
      color: var(--ao-color-primary);
    }
  }

  .nav-item.active,
  .nav-item.open {
    color: var(--ao-color-primary);
    font-weight: var(--ao-font-weight-medium);
  }

  .sub-panel {
    position: absolute;
    top: 100%;
    z-index: 1;
    box-sizing: border-box;
    padding: 4px 0;
    background-color: var(--ao-color-bg-container);
    border: var(--ao-border-width-thin) solid var(--ao-gray-3);
    border-top: none;
    border-radius: 0 0 var(--ao-border-radius-lg) var(--ao-border-radius-lg);
    box-shadow: var(--ao-shadow-md);
  }

  .sub-item {
    padding: 9px 12px;
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-medium);
    color: var(--ao-color-text-base);
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    transition: all var(--ao-duration-fast) var(--ao-ease-in-out);

    &:hover {
      color: var(--ao-color-primary);
      background-color: var(--ao-gray-1);
    }

    &.active {
      color: var(--ao-color-primary);
      font-weight: var(--ao-font-weight-medium);
    }
  }
}

.sub-panel-enter-active,
.sub-panel-leave-active {
  transition:
    opacity var(--ao-duration-fast) var(--ao-ease-in-out),
    transform var(--ao-duration-fast) var(--ao-ease-in-out);
}

.sub-panel-enter-from,
.sub-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
