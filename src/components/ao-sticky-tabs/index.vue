<template>
  <Teleport to="body">
    <Transition name="ao-sticky-tabs">
      <div
        v-if="visible"
        ref="barRef"
        class="ao-sticky-tabs"
        :style="{ top: `${offsetTop}px` }"
      >
        <div
          class="ao-sticky-tabs__inner"
          :class="{
            'has-left': canScrollLeft,
            'has-right': canScrollRight,
          }"
        >
          <div
            ref="listRef"
            class="ao-sticky-tabs__list"
            :class="{ 'is-dragging': dragging }"
            @scroll="updateScrollState"
            @wheel="handleWheel"
            @pointerdown="handlePointerDown"
            @pointermove="handlePointerMove"
            @pointerup="handlePointerUp"
            @pointercancel="handlePointerUp"
          >
            <button
              v-for="item in items"
              :key="item.id"
              :ref="(el) => setItemRef(item.id, el)"
              type="button"
              class="ao-sticky-tabs__item"
              :class="{
                'is-active': isItemActive(item),
                'is-open': String(openId) === String(item.id),
              }"
              @click="handleSelect(item)"
            >
              <span v-if="item.icon" class="ao-sticky-tabs__icon">
                {{ item.icon }}
              </span>
              <span class="ao-sticky-tabs__label">{{ item.label }}</span>
              <span
                v-if="item.children?.length"
                class="ao-sticky-tabs__arrow"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        <div
          v-if="panelItem"
          ref="panelRef"
          class="ao-sticky-tabs__panel"
          :style="panelStyle"
        >
          <div class="ao-sticky-tabs__panel-scroll">
            <button
              v-for="child in panelItem.children"
              :key="child.id"
              type="button"
              class="ao-sticky-tabs__panel-item"
              :class="{
                'is-active': String(child.id) === String(modelValue),
              }"
              @click="handleChildSelect(panelItem, child)"
            >
              {{ child.label }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

export interface StickyTabChild {
  id: string | number;
  label: string;
}

export interface StickyTabItem {
  id: string | number;
  label: string;
  icon?: string;
  /** 二级分类：存在时点击展开下拉面板 */
  children?: StickyTabChild[];
}

defineOptions({ name: 'ao-sticky-tabs' });

const props = withDefaults(
  defineProps<{
    /** 分类项 */
    items: StickyTabItem[];
    /** 当前选中项（可以是二级分类的 id） */
    modelValue?: string | number;
    /** 触发显示的锚点元素：滚出视口顶部后出现 */
    anchor?: HTMLElement | null | undefined;
    /** 吸顶时距视口顶部距离，默认站点头部高度 */
    offsetTop?: number;
    /** 仅在移动端显示（桌面已有侧边导航时使用） */
    mobileOnly?: boolean;
    /** 常驻显示：不等锚点滚出视口，直接固定在头部下方（需页面自行留出占位高度） */
    alwaysVisible?: boolean;
  }>(),
  {
    offsetTop: 64,
    mobileOnly: false,
    alwaysVisible: false,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string | number];
  /** 选中二级分类 */
  select: [item: StickyTabItem, child: StickyTabChild];
}>();

const visible = ref(false);
const barRef = ref<HTMLElement>();
const listRef = ref<HTMLElement>();

/** 当前展开二级菜单的一级项 id（空串表示收起）；需在 updateVisible 之前初始化 */
const openId = ref<string | number | ''>('');

function closePanel() {
  openId.value = '';
}

/** 左右是否还有可滚动内容：控制两侧渐变遮罩 */
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

function updateScrollState() {
  const list = listRef.value;
  if (!list) return;
  const max = list.scrollWidth - list.clientWidth;
  canScrollLeft.value = list.scrollLeft > 1;
  canScrollRight.value = max > 1 && list.scrollLeft < max - 1;

  if (openId.value === '') return;
  const el = itemRefs.get(String(openId.value));
  if (!el) return;
  const listRect = list.getBoundingClientRect();
  const itemRect = el.getBoundingClientRect();
  // 父项被完全滚出可视区：收起二级菜单
  if (itemRect.right <= listRect.left || itemRect.left >= listRect.right) {
    closePanel();
    return;
  }
  updatePanelPosition();
}

/** 锚点是否已经滚到吸顶线以上 */
function updateVisible() {
  // 桌面端不需要这个移动端吸顶栏时直接隐藏
  if (props.mobileOnly && window.innerWidth > 768) {
    visible.value = false;
    closePanel();
    return;
  }
  // 常驻模式：不依赖锚点位置，挂载即显示
  if (props.alwaysVisible) {
    visible.value = true;
    return;
  }
  const anchor = props.anchor;
  if (!anchor) {
    visible.value = false;
    closePanel();
    return;
  }
  visible.value = anchor.getBoundingClientRect().bottom <= props.offsetTop;
  if (!visible.value) closePanel();
}

function bindScroll() {
  unbindScroll();
  if (!props.anchor && !props.alwaysVisible) {
    visible.value = false;
    return;
  }
  updateVisible();
  updateScrollState();
  window.addEventListener('scroll', updateVisible, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  document.addEventListener('pointerdown', handleDocPointerDown);
  document.addEventListener('keydown', handleKeydown);
}

function handleResize() {
  updateVisible();
  updateScrollState();
  if (openId.value !== '') updatePanelPosition();
}

function unbindScroll() {
  window.removeEventListener('scroll', updateVisible);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('pointerdown', handleDocPointerDown);
  document.removeEventListener('keydown', handleKeydown);
}

watch(() => props.anchor, bindScroll, { immediate: true, flush: 'post' });
watch(() => props.offsetTop, updateVisible);

/** 出现时把选中项滚动到可视区域中间 */
watch(visible, async (value) => {
  if (!value) return;
  await nextTick();
  const list = listRef.value;
  const active = list?.querySelector<HTMLElement>('.is-active');
  if (!list || !active) return;
  list.scrollLeft =
    active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
  updateScrollState();
});

/** 拖拽结束后短时间内的点击不触发切换 */
let suppressClickUntil = 0;

/** 一级项是否处于激活态：自身被选中，或包含被选中的二级项 */
function isItemActive(item: StickyTabItem) {
  if (String(item.id) === String(props.modelValue)) return true;
  return !!item.children?.some(
    (child) => String(child.id) === String(props.modelValue),
  );
}

/* ---------- 二级菜单 ---------- */
const itemRefs = new Map<string, HTMLElement>();

function setItemRef(id: string | number, el: unknown) {
  const key = String(id);
  if (el) itemRefs.set(key, el as HTMLElement);
  else itemRefs.delete(key);
}

const panelItem = computed(() =>
  props.items.find(
    (item) =>
      String(item.id) === String(openId.value) && !!item.children?.length,
  ),
);

const panelRef = ref<HTMLElement>();

/** 面板相对吸顶栏的位置：紧贴分类栏底边，不留空隙（1px 让过栏的下边框） */
const PANEL_TOP = 'calc(100% + 1px)';

/** 气泡箭头距面板左右边缘的最小留白 */
const ARROW_GAP = 16;

interface PanelStyle {
  left: string;
  top: string;
  /** 面板最小宽度（跟随父项宽度，样式里再与 144px 兜底取大值） */
  '--panel-min-width': string;
  /** 气泡箭头的水平锚点（相对面板左边缘） */
  '--panel-arrow-left': string;
}

const panelStyle = ref<PanelStyle>({
  left: '0px',
  top: PANEL_TOP,
  '--panel-min-width': '0px',
  '--panel-arrow-left': '24px',
});

/**
 * 面板锚定在对应一级项下方：以父项中心为轴居中展开，
 * 宽度至少与父项一致（样式里另有 150px 兜底），内容更宽时按内容撑开。
 * @param measureContent 是否连内容实际宽度一起算（首帧还没渲染出新内容时为 false）
 */
function applyPanelLayout(measureContent: boolean) {
  const bar = barRef.value;
  const el = openId.value === '' ? null : itemRefs.get(String(openId.value));
  if (!bar || !el) return;
  const barRect = bar.getBoundingClientRect();
  const itemRect = el.getBoundingClientRect();

  // 面板宽度由 min-width 和内容共同决定，读渲染结果即可
  const panelEl = panelRef.value;
  const width = Math.max(
    itemRect.width,
    measureContent && panelEl ? panelEl.offsetWidth : 0,
  );
  const itemCenter = itemRect.left + itemRect.width / 2;
  // 居中展开；贴近视口两侧时收进边距内
  const left = Math.min(
    Math.max(itemCenter - width / 2, barRect.left + 12),
    window.innerWidth - width - 12,
  );
  // 箭头指向父项中心，靠近面板两端时收进留白范围内
  const arrowLeft = Math.min(
    Math.max(itemCenter - left, ARROW_GAP),
    Math.max(width - ARROW_GAP, ARROW_GAP),
  );

  panelStyle.value = {
    left: `${left - barRect.left}px`,
    top: PANEL_TOP,
    '--panel-min-width': `${itemRect.width}px`,
    '--panel-arrow-left': `${arrowLeft}px`,
  };
}

function updatePanelPosition() {
  applyPanelLayout(true);
}

/** 切换面板时先按父项占位，等新内容渲染后再测量实际宽度并居中 */
async function placePanelForCurrentItem() {
  applyPanelLayout(false);
  await nextTick();
  updatePanelPosition();
  // 字体/内容布局完成后校正一次，避免复用旧宽度导致偏移
  requestAnimationFrame(() => {
    if (openId.value !== '') updatePanelPosition();
  });
}

function handleSelect(item: StickyTabItem) {
  if (Date.now() < suppressClickUntil) return;
  if (item.children?.length) {
    openId.value = String(openId.value) === String(item.id) ? '' : item.id;
    return;
  }
  closePanel();
  emit('update:modelValue', item.id);
}

function handleChildSelect(item: StickyTabItem, child: StickyTabChild) {
  emit('select', item, child);
  emit('update:modelValue', child.id);
  closePanel();
}

/** 点击外部 / Esc 收起二级菜单 */
function handleDocPointerDown(event: PointerEvent) {
  if (!openId.value) return;
  const bar = barRef.value;
  if (bar && !bar.contains(event.target as Node)) closePanel();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') closePanel();
}

watch(openId, (value) => {
  if (value === '') return;
  placePanelForCurrentItem();
  const list = listRef.value;
  const el = itemRefs.get(String(value));
  if (!list || !el) return;
  const listRect = list.getBoundingClientRect();
  const itemRect = el.getBoundingClientRect();
  if (itemRect.left < listRect.left || itemRect.right > listRect.right) {
    list.scrollLeft += itemRect.left - listRect.left - 12;
  }
});

/** 选中项跟随（滚动 spy 激活的项在溢出外时自动滚到可视区中间） */
watch(
  () => props.modelValue,
  (value) => {
    // 页面滚动导致激活项变化时，收起已展开的二级菜单
    closePanel();
    if (!visible.value || value === undefined || value === null) return;
    const list = listRef.value;
    if (!list) return;
    const owner = props.items.find(
      (item) =>
        String(item.id) === String(value) ||
        item.children?.some((child) => String(child.id) === String(value)),
    );
    if (!owner) return;
    const el = itemRefs.get(String(owner.id));
    if (!el) return;
    const listRect = list.getBoundingClientRect();
    const itemRect = el.getBoundingClientRect();
    if (itemRect.left >= listRect.left && itemRect.right <= listRect.right) {
      return;
    }
    list.scrollLeft +=
      itemRect.left - listRect.left - (list.clientWidth - itemRect.width) / 2;
    updateScrollState();
  },
);

/** 按下拖拽横向滚动 */
const dragging = ref(false);
let dragStartX = 0;
let dragStartLeft = 0;
let dragged = false;

function handlePointerDown(event: PointerEvent) {
  if (event.button !== 0) return;
  const list = listRef.value;
  if (!list || list.scrollWidth <= list.clientWidth) return;
  dragging.value = true;
  dragged = false;
  dragStartX = event.clientX;
  dragStartLeft = list.scrollLeft;
}

function handlePointerMove(event: PointerEvent) {
  if (!dragging.value) return;
  const list = listRef.value;
  if (!list) return;
  const distance = event.clientX - dragStartX;
  if (!dragged && Math.abs(distance) > 3) {
    dragged = true;
    // 超过阈值才算拖拽，此时才捕获指针；否则会影响正常点击
    try {
      list.setPointerCapture?.(event.pointerId);
    } catch {
      // 指针已释放时忽略
    }
  }
  if (!dragged) return;
  event.preventDefault();
  list.scrollLeft = dragStartLeft - distance;
}

function handlePointerUp(event: PointerEvent) {
  if (!dragging.value) return;
  dragging.value = false;
  if (dragged) suppressClickUntil = Date.now() + 300;
  dragged = false;
  const list = listRef.value;
  if (list?.hasPointerCapture?.(event.pointerId)) {
    list.releasePointerCapture(event.pointerId);
  }
}

/** 鼠标纵向滚轮转成横向滚动；到达两端时交还页面滚动 */
function handleWheel(event: WheelEvent) {
  const list = listRef.value;
  if (!list) return;
  const max = list.scrollWidth - list.clientWidth;
  if (max <= 0) return;

  const delta = event.deltaY !== 0 ? event.deltaY : event.deltaX;
  if (!delta) return;

  const atStart = delta < 0 && list.scrollLeft <= 0;
  const atEnd = delta > 0 && list.scrollLeft >= max - 1;
  if (atStart || atEnd) return;

  event.preventDefault();
  list.scrollLeft = Math.max(0, Math.min(max, list.scrollLeft + delta));
  updateScrollState();
}

onBeforeUnmount(() => {
  unbindScroll();
});
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
