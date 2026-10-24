<template>
  <Transition name="mobile-nav">
    <div v-if="visible" ref="barRef" class="mobile-category-nav">
      <div
        class="nav-btn"
        :class="{ disabled: scrollAtStart }"
        @click="scrollByItem(-1)"
      >
        <AoImage
          src="@/assets/home/icon_pre.svg"
          width="12px"
          height="12px"
        />
      </div>
      <div class="nav-scroll-wrap">
        <div class="nav-scroll" ref="scrollRef" @scroll="handleNavScroll">
          <div
            v-for="group in categories"
            :key="group.name"
            :ref="(el) => setChipRef(group.name, el)"
            class="nav-item"
            :class="{
              active: isGroupActive(group),
              open: openGroup === group.name,
            }"
            @pointerenter="handleGroupEnter(group.name)"
            @click="handleGroupClick(group.name)"
          >
            <span class="nav-label">{{ group.name }}</span>
          </div>
        </div>
      </div>
      <div
        class="nav-btn"
        :class="{ disabled: scrollAtEnd }"
        @click="scrollByItem(1)"
      >
        <AoImage
          src="@/assets/home/icon_next.svg"
          width="12px"
          height="12px"
        />
      </div>
      <!-- 二级菜单：竖向下拉面板，锚定在当前一级分类下方 -->
      <Transition name="sub-panel">
        <div
          v-if="openGroupChildren.length"
          ref="panelRef"
          class="sub-panel"
          :style="panelStyle"
          @pointerleave="handleRowLeave"
        >
          <div
            v-for="child in openGroupChildren"
            :key="child.name"
            class="sub-item"
            :class="{ active: child.name === activeName }"
            @click="handleChildClick(child)"
          >
            {{ child.name }}
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { WebsiteSite } from '@/mock/websiteCategories';

defineOptions({
  name: 'WebsiteMobileNav',
});

interface CategoryChild {
  name: string;
  sites?: WebsiteSite[];
}

interface CategoryGroup {
  name: string;
  children: CategoryChild[];
}

const props = defineProps<{
  /** 是否显示（页面滚动过心电图分割线后） */
  visible: boolean;
  /** 当前激活的二级分类名 */
  activeName: string;
  /** 分组数据：一级分类 -> 二级分类 */
  categories: CategoryGroup[];
}>();

const emit = defineEmits<{
  select: [group: { name: string }, sub: CategoryChild];
}>();

const barRef = ref<HTMLElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const chipRefs = new Map<string, HTMLElement>();
const setChipRef = (name: string, el: any) => {
  if (el) chipRefs.set(name, el.$el ?? el);
  else chipRefs.delete(name);
};

/** 当前展开二级菜单的一级分类名 */
const openGroup = ref('');
// 悬浮能力检测：桌面端悬浮即展开，触屏端点按切换
const hoverCapable = matchMedia('(hover: hover)').matches;

/* ---------- 一级分类横向翻动：按钮逐个翻动，不做手势/滚轮滚动 ---------- */
const scrollAtStart = ref(true);
const scrollAtEnd = ref(false);

const updateScrollState = () => {
  const el = scrollRef.value;
  if (!el) return;
  scrollAtStart.value = el.scrollLeft <= 1;
  scrollAtEnd.value = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
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
  // 导航条滚动（按钮翻页或激活项自动跟随翻页）时，展开中的面板锚点
  // 已移位，立即收起避免面板悬浮在错误位置
  openGroup.value = '';
  updateScrollState();
  updatePanelPosition();
};

const isGroupActive = (group: CategoryGroup) =>
  group.children.some((child) => child.name === props.activeName);

const openGroupChildren = computed(
  () =>
    props.categories.find((group) => group.name === openGroup.value)
      ?.children ?? [],
);

/* ---------- 下拉面板定位：与当前一级分类插槽同宽、边缘线对齐 ---------- */
const panelStyle = ref<{
  left: string;
  top: string;
  width: string;
  paddingLeft: string;
}>({
  left: '0px',
  top: '0px',
  width: '0px',
  paddingLeft: '0px',
});

const updatePanelPosition = () => {
  const bar = barRef.value;
  const chip = openGroup.value ? chipRefs.get(openGroup.value) : null;
  if (!bar || !chip) return;
  const barRect = bar.getBoundingClientRect();
  const chipRect = chip.getBoundingClientRect();
  // 面板与插槽同宽，左右边缘对齐插槽的两条分割线；
  // 插槽贴近视口右缘时向左收，保证不超出屏幕
  const width = chipRect.width;
  const left = Math.min(
    Math.max(chipRect.left, 12),
    window.innerWidth - width - 12,
  );
  // 二级文本左缘对齐一级文本实际左缘（一级文本居中，左缘随名称变化）
  const label = chip.querySelector('.nav-label');
  const labelLeft = label
    ? label.getBoundingClientRect().left
    : left + 12;
  // 面板紧贴导航条下沿（无间距），仅下方圆角
  panelStyle.value = {
    left: `${left}px`,
    top: `${barRect.bottom}px`,
    width: `${width}px`,
    paddingLeft: `${Math.max(labelLeft - left, 0)}px`,
  };
};

const handleGroupEnter = (name: string) => {
  if (hoverCapable) openGroup.value = name;
};

const handleGroupClick = (name: string) => {
  // 桌面端由悬浮控制展开，点击不做切换
  if (hoverCapable) return;
  openGroup.value = openGroup.value === name ? '' : name;
};

const handleRowLeave = () => {
  if (hoverCapable) openGroup.value = '';
};

const handleChildClick = (child: CategoryChild) => {
  const group = props.categories.find((item) =>
    item.children.some((itemChild) => itemChild.name === child.name),
  );
  if (group) emit('select', group, child);
  openGroup.value = '';
};

// 点击导航外部时收起二级菜单（触屏场景）
const handleDocClick = (event: Event) => {
  if (barRef.value && !barRef.value.contains(event.target as Node)) {
    openGroup.value = '';
  }
};

/* 激活的一级分类不在当前可视页时，自动翻到该项
   （scroll-spy 跟随滚动高亮时导航同步跟随） */
watch(
  () => props.activeName,
  (name) => {
    const el = scrollRef.value;
    if (!el || !name) return;
    // 找到包含该二级分类的一级 chip
    const group = props.categories.find((item) =>
      item.children.some((child) => child.name === name),
    );
    const chip = group ? chipRefs.get(group.name) : null;
    if (!chip) return;
    const elRect = el.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const visible = chipRect.left >= elRect.left && chipRect.right <= elRect.right;
    if (!visible) {
      chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  },
);

watch(openGroup, () => {
  nextTick(updatePanelPosition);
});

onMounted(() => {
  document.addEventListener('click', handleDocClick);
  window.addEventListener('resize', handleNavScroll);
  nextTick(updateScrollState);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleDocClick);
  window.removeEventListener('resize', handleNavScroll);
});
</script>

<style scoped lang="scss">
/* 桌面端隐藏：仅移动端（≤768）出现 */
.mobile-category-nav {
  display: none;
}

@media (max-width: 768px) {
  .mobile-category-nav {
    display: flex;
    align-items: stretch;
    position: fixed;
    top: var(--ao-header-height-lg);
    left: 0;
    right: 0;
    /* 容器左右内边距与页面内容最外层边距（16px）对齐 */
    padding: 0 16px;
    /* 高于卡片悬浮面板（1001），与固定头部齐平（两者上下相邻不重叠） */
    z-index: var(--ao-z-sticky);
    background-color: var(--ao-color-bg-container);
    box-shadow: var(--ao-shadow-sm);
  }

  /* 左右翻动按钮：正方形、始终浅灰透明背景，可点击的稍深一档 */
  .nav-btn {
    flex-shrink: 0;
    align-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    background-color: color-mix(
      in srgb,
      var(--ao-gray-6) 14%,
      transparent
    );
    border-radius: var(--ao-border-radius-sm);
    cursor: pointer;
    user-select: none;
    transition:
      background-color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:not(.disabled) {
      background-color: color-mix(
        in srgb,
        var(--ao-gray-6) 24%,
        transparent
      );

      &:hover {
        background-color: color-mix(
          in srgb,
          var(--ao-gray-6) 32%,
          transparent
        );
      }
    }

    &.disabled {
      cursor: not-allowed;
    }
  }

  /* 边缘线画在不滚动的外层 wrapper 上：滚动容器内的绝对定位元素
     （含伪元素）会跟随内容滚动，画在里面翻页后就被滚走了 */
  .nav-scroll-wrap {
    position: relative;
    flex: 1;
    min-width: 0;
    margin: 0 12px;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: var(--ao-border-width-thin);
      height: 14px;
      background-color: var(--ao-color-border);
      z-index: 1;
      pointer-events: none;
    }

    &::before {
      left: 0;
    }

    &::after {
      right: 0;
    }
  }

  .nav-scroll {
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

    // 右缘一条与字符等高的短竖线（左缘由容器伪元素负责，避免相邻线
    // 叠加变粗；snap 对齐保证相邻条目的线落在同一直线上）
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: var(--ao-border-width-thin);
      height: 14px;
      background-color: var(--ao-color-border);
      pointer-events: none;
    }

    .nav-label {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &:hover {
      color: var(--ao-color-primary);
    }
  }

  /* 窄屏一屏放不下三个字宽时改两等分 */
  @media (max-width: 480px) {
    .nav-item {
      flex-basis: 50%;
    }
  }

  .nav-item.active,
  .nav-item.open {
    color: var(--ao-color-primary);
    font-weight: var(--ao-font-weight-medium);
  }

  /* 二级菜单：竖向下拉面板，与一级分类插槽同宽（宽度由内联样式给定，
     左右边缘对齐插槽分割线），紧贴导航条（无间距），仅下方圆角 */
  .sub-panel {
    position: fixed;
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
    /* 左内边距由面板内联样式给出（对齐一级文本左缘），此处只留右侧余量 */
    padding: 9px 12px 9px 0;
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-medium);
    color: var(--ao-color-text-base);
    text-align: left;
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

.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition:
    transform var(--ao-duration-base) var(--ao-ease-in-out),
    opacity var(--ao-duration-base) var(--ao-ease-in-out);
}

.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
  transform: translateY(-100%);
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
