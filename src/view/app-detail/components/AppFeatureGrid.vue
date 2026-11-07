<template>
  <div ref="rootRef" class="feature-orbit">
    <!-- 中心卡片到各功能项的连接线（灰色 1px，压在卡片下方） -->
    <svg class="feature-orbit__links" aria-hidden="true">
      <line
        v-for="(link, index) in links"
        :key="index"
        :x1="link.x1"
        :y1="link.y1"
        :x2="link.x2"
        :y2="link.y2"
      />
    </svg>

    <!-- 卡位：上三、左右成对、核心行、左右成对、下三，保证功能亮点始终居中 -->
    <article
      v-for="(item, index) in layout.items"
      :key="item.key"
      :ref="(el) => setItemRef(el, index)"
      class="feature-orbit__item"
      :style="{
        '--slot-row': item.slot.row,
        '--slot-col': item.slot.col,
        '--slot-align': item.slot.align,
      }"
    >
      <div
        class="feature-orbit__icon"
        :style="{ color: iconAt(item.iconIndex).color }"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            :d="iconAt(item.iconIndex).path"
            :fill="iconAt(item.iconIndex).filled ? 'currentColor' : 'none'"
            :stroke="iconAt(item.iconIndex).filled ? 'none' : 'currentColor'"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <h3 class="feature-orbit__title">{{ item.text }}</h3>
      <p v-if="item.desc" class="feature-orbit__desc">{{ item.desc }}</p>
    </article>

    <!-- 中心矩形卡片：浅色主色底，行号随卡位行数动态居中 -->
    <div
      ref="coreRef"
      class="feature-orbit__core"
      :style="{ gridRow: layout.coreRow }"
    >
      <span class="feature-orbit__core-title">功能亮点</span>
    </div>
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
import type { ComponentPublicInstance } from 'vue';
import type { AppDetailFeature } from '../types';

defineOptions({ name: 'AppFeatureGrid' });

const props = defineProps<{
  features: AppDetailFeature[];
}>();

/** 功能图标：按顺序循环取用，避免为每个功能单独维护图标资源 */
const ICONS = [
  {
    color: '#f5a623',
    filled: true,
    path: 'M13 2 4 14h6l-1 8 9-12h-6z',
  },
  {
    color: '#7b61ff',
    filled: true,
    path: 'M12 2.5l2.3 6.4 6.7 2.1-6.7 2.1L12 19.5l-2.3-6.4L3 11l6.7-2.1z',
  },
  {
    color: '#2f9cf4',
    filled: false,
    path: 'M12 3l8 3v6c0 5-3.4 9-8 10.5C7.4 21 4 17 4 12V6z',
  },
  {
    color: '#20c997',
    filled: false,
    path: 'M12 3.5 21 8.5l-9 5-9-5 9-5zM3 13.5l9 5 9-5',
  },
  {
    color: '#ff7a45',
    filled: false,
    path: 'M4 20V11m5.3 9V4m5.4 16v-6.5m5.3 6.5V7',
  },
  {
    color: '#eb2f96',
    filled: false,
    path: 'M20 12a8 8 0 1 1-2.4-5.7M20 4.5V9h-4.5',
  },
  {
    color: '#13c2c2',
    filled: false,
    path: 'M3 7h18M3 12h18M3 17h12',
  },
  {
    color: '#a0d911',
    filled: false,
    path: 'M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4',
  },
];

const iconAt = (index: number) => ICONS[index % ICONS.length];

/** 占位卡内容：功能不足 8 个时补齐，内容互不重复 */
const PLACEHOLDERS = [
  { title: '新功能开发中', desc: '更多能力正在打磨，敬请期待。' },
  { title: '更多场景适配', desc: '正在扩展更多使用场景，敬请期待。' },
  { title: '协作能力升级', desc: '团队协作相关能力正在开发中。' },
  { title: '性能持续优化', desc: '响应速度与稳定性仍在持续打磨。' },
  { title: '开放接口扩展', desc: '更多接口能力正在规划中。' },
  { title: '多端体验完善', desc: '移动端与桌面端体验正在完善。' },
  { title: '数据看板', desc: '使用数据与效果分析正在开发中。' },
  { title: '个性化配置', desc: '更灵活的自定义选项即将上线。' },
];

/** 最少展示的卡位数量 */
const MIN_SLOTS = 8;

/**
 * 卡位布局（始终让功能亮点落在矩形正中）：
 * 上三 →（左右成对）×k → 核心行左右各一 →（左右成对）×k → 下三
 * 每多 4 张，上下各加一行左右卡片，保证核心行上下行数对称。
 */
const alignOf = (col: number) => (col === 1 ? 'start' : col === 3 ? 'end' : 'center');

interface Slot {
  row: number;
  col: number;
  align: string;
}

/** 卡位总数量：8、12、16…，不足部分用占位卡补齐 */
const slotCountFor = (count: number) =>
  count <= MIN_SLOTS
    ? MIN_SLOTS
    : MIN_SLOTS + 4 * Math.ceil((count - MIN_SLOTS) / 4);

/** 每行卡片数量：3 或 2（左右各一） */
const rowCountsFor = (total: number) => {
  if (total <= MIN_SLOTS) return [3, 2, 3];
  const pairs = (total - MIN_SLOTS) / 4;
  return [
    3,
    ...Array<number>(pairs).fill(2),
    2,
    ...Array<number>(pairs).fill(2),
    3,
  ];
};

/** 实际渲染的卡位：真实功能按顺序在前，不足卡位数用不重复的占位卡补齐 */
const displayItems = computed(() => {
  const real = props.features.map((feature, index) => ({
    key: `feature-${feature.id}`,
    text: feature.text,
    desc: feature.desc,
    iconIndex: index,
  }));

  const target = slotCountFor(real.length);
  const missing = Math.max(0, target - real.length);
  const start = real.length % PLACEHOLDERS.length;

  const placeholders = Array.from({ length: missing }, (_, i) => {
    const item = PLACEHOLDERS[(start + i) % PLACEHOLDERS.length];
    return {
      key: `placeholder-${i}`,
      text: item.title,
      desc: item.desc,
      iconIndex: real.length + i,
    };
  });

  return [...real, ...placeholders];
});

/** 把卡位按行铺开，并算出核心所在行 */
const layout = computed(() => {
  const items = displayItems.value;
  const rowCounts = rowCountsFor(items.length);
  const slots: Slot[] = [];

  rowCounts.forEach((count, rowIndex) => {
    const row = rowIndex + 1;
    if (count === 3) {
      for (let col = 1; col <= 3; col += 1) {
        slots.push({ row, col, align: alignOf(col) });
      }
      return;
    }
    slots.push({ row, col: 1, align: 'start' });
    slots.push({ row, col: 3, align: 'end' });
  });

  const coreRow = Math.floor(rowCounts.length / 2) + 1;

  return {
    items: items.map((item, index) => ({ ...item, slot: slots[index] })),
    coreRow,
  };
});

/** 连接线坐标：从中心卡片边缘连到每张功能卡片边缘，两头都不压住卡片 */
const rootRef = ref<HTMLElement | null>(null);
const coreRef = ref<HTMLElement | null>(null);
const itemEls = ref<Array<HTMLElement | null>>([]);
const links = ref<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

const setItemRef = (
  el: Element | ComponentPublicInstance | null,
  index: number,
) => {
  itemEls.value[index] = el instanceof HTMLElement ? el : null;
};

let resizeObserver: ResizeObserver | null = null;

/** 射线与矩形边框的交点：从矩形内一点沿方向 (dx, dy) 走到边框上 */
const rectEdge = (
  rect: DOMRect,
  cx: number,
  cy: number,
  dx: number,
  dy: number,
) => {
  const tx =
    dx > 0 ? (rect.right - cx) / dx : dx < 0 ? (rect.left - cx) / dx : Infinity;
  const ty =
    dy > 0
      ? (rect.bottom - cy) / dy
      : dy < 0
        ? (rect.top - cy) / dy
        : Infinity;
  const t = Math.max(0, Math.min(tx, ty));
  return { x: cx + dx * t, y: cy + dy * t };
};

/** 矩形上离目标点最近的点：连接线从卡片最靠近中心的边/角落点，避免斜穿相邻卡片 */
const nearestPoint = (rect: DOMRect, x: number, y: number) => ({
  x: Math.min(Math.max(x, rect.left), rect.right),
  y: Math.min(Math.max(y, rect.top), rect.bottom),
});

const measure = () => {
  const root = rootRef.value;
  const core = coreRef.value;
  if (!root || !core) return;

  const rootRect = root.getBoundingClientRect();
  const coreRect = core.getBoundingClientRect();
  const cx = coreRect.left + coreRect.width / 2;
  const cy = coreRect.top + coreRect.height / 2;

  links.value = itemEls.value
    .filter((el): el is HTMLElement => Boolean(el))
    .map((el) => {
      const rect = el.getBoundingClientRect();
      // 终点取卡片最靠近中心的一侧，而不是卡片中心，避免线擦到相邻卡片
      const end = nearestPoint(rect, cx, cy);
      const dx = end.x - cx;
      const dy = end.y - cy;
      if (dx === 0 && dy === 0) return null;
      // 起点落在中心卡片边框上
      const start = rectEdge(coreRect, cx, cy, dx, dy);
      return {
        x1: start.x - rootRect.left,
        y1: start.y - rootRect.top,
        x2: end.x - rootRect.left,
        y2: end.y - rootRect.top,
      };
    })
    .filter(
      (
        link,
      ): link is { x1: number; y1: number; x2: number; y2: number } =>
        Boolean(link),
    );
};

const observeItems = () => {
  itemEls.value.forEach((el) => {
    if (el) resizeObserver?.observe(el);
  });
};

onMounted(() => {
  measure();

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => measure());
    if (rootRef.value) resizeObserver.observe(rootRef.value);
    if (coreRef.value) resizeObserver.observe(coreRef.value);
    observeItems();
  }

  window.addEventListener('resize', measure);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
  window.removeEventListener('resize', measure);
});

watch(
  () => props.features,
  () => nextTick(() => {
    measure();
    observeItems();
  }),
);
</script>

<style scoped lang="scss">
.feature-orbit {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 100px var(--ao-spacing-md);
  padding: var(--ao-spacing-md) 0;

  /* 连接线：灰色 1px，铺满容器并压在卡片下方 */
  &__links {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    pointer-events: none;
    stroke: var(--ao-color-border-secondary);
    stroke-width: 1;
  }

  /* 中心矩形卡片：浅色主色底（底不透明，避免连接线透出来） */
  &__core {
    position: relative;
    grid-column: 2;
    align-self: center;
    justify-self: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 184px;
    height: 104px;
    border: var(--ao-border-width-thin) solid
      rgba(var(--app-main-rgb, 0, 181, 181), 0.24);
    border-radius: var(--ao-border-radius-xl);
    background-color: var(--ao-color-bg-container);
    background-image: linear-gradient(
      rgba(var(--app-main-rgb, 0, 181, 181), 0.1),
      rgba(var(--app-main-rgb, 0, 181, 181), 0.1)
    );
    color: rgb(var(--app-main-rgb, 0, 181, 181));
    box-shadow: 0 3px 10px rgba(var(--app-main-rgb, 0, 181, 181), 0.1);
    z-index: 2;
  }

  &__core-title {
    font-size: var(--ao-font-size-lg);
    font-weight: var(--ao-font-weight-semibold);
    letter-spacing: 3px;
    /* 去掉最后一字后的字距，保证水平居中 */
    margin-right: -3px;
  }

  /* 功能卡片 */
  &__item {
    position: relative;
    grid-row: var(--slot-row);
    grid-column: var(--slot-col);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-self: var(--slot-align, center);
    width: 100%;
    max-width: 336px;
    padding: var(--ao-spacing-lg);
    border: var(--ao-border-width-thin) solid
      rgba(var(--app-main-rgb, 0, 181, 181), 0.2);
    border-radius: var(--ao-border-radius-xl);
    background-color: var(--ao-color-bg-container);
    box-shadow: 0 3px 10px rgba(var(--app-main-rgb, 0, 181, 181), 0.08);
    text-align: center;
    transition: border-color var(--ao-duration-base) var(--ao-ease-out);
    z-index: 1;

    &:hover {
      border-color: rgba(var(--app-main-rgb, 0, 181, 181), 0.45);
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    margin-bottom: var(--ao-spacing-sm);

    svg {
      width: 32px;
      height: 32px;
    }
  }

  &__title {
    margin: 0;
    font-size: var(--ao-font-size-base);
    font-weight: var(--ao-font-weight-semibold);
    color: var(--ao-color-text-base);
  }

  &__desc {
    margin: var(--ao-spacing-xs) 0 0;
    font-size: var(--ao-font-size-sm);
    line-height: var(--ao-line-height-base);
    color: var(--ao-color-text-tertiary);
  }
}

/* 窄屏：固定卡位退化为流式列表 */
@media (max-width: 992px) {
  .feature-orbit {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ao-spacing-md);

    &__links {
      display: none;
    }

    &__core {
      order: -1;
      /* 行号由内联样式控制，窄屏必须强制回到流式 */
      grid-row: auto !important;
      grid-column: 1 / -1;
      width: 100%;
      height: 88px;
    }

    &__item {
      grid-row: auto;
      grid-column: auto;
      justify-self: center;
      max-width: none;
    }
  }
}

@media (max-width: 768px) {
  .feature-orbit {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
