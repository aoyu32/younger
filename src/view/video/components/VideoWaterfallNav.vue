<template>
  <div class="video-waterfall-nav">
    <!-- 国潮背景:上半部分祥云 + 右上角太阳 -->
    <!-- <AoImage
      class="sky-bg"
      src="@/assets/video/icon_cloud_sun.svg"
      width="100%"
      height="50%"
    /> -->
    <!-- 国潮水纹背景:单排贴底,高度占组件一半 -->
    <AoImage
      class="wave-bg"
      src="@/assets/video/icon_wave_band.svg"
      width="100%"
      height="50%"
    />

    <div class="nav-list">
      <div
        v-for="(item, index) in menuItems"
        :key="item.id"
        class="nav-item"
        :class="[{ active: modelValue === item.id }, `shape-${index % 4}`]"
        @click="$emit('update:modelValue', item.id)"
      >
        <span v-if="item.icon" class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </div>

    <div class="filter">
      <div class="filter-item" v-for="group in filterList" :key="group.id">
        <div class="filter-label">{{ group.label }}</div>
        <div class="filter-list">
          <div
            class="filter-tag"
            v-for="(child, i) in group.children"
            :key="child.id"
            :class="[
              { active: activeFilters[group.id] === child.id },
              `shape-${(i + 1) % 4}`,
            ]"
            @click="activeFilters[group.id] = child.id"
          >
            {{ child.label }}
          </div>
        </div>
      </div>
    </div>

    <!-- 右下角草书水印 -->
    <span class="signature" aria-hidden="true">导航</span>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

export interface MenuItem {
  id: string | number;
  label: string;
  icon?: string;
}

interface FilterChild {
  id: string;
  label: string;
}

interface FilterGroup {
  id: string;
  label: string;
  children: FilterChild[];
}

defineProps<{
  menuItems: MenuItem[];
  modelValue?: string | number;
}>();

defineEmits<{
  'update:modelValue': [value: string | number];
}>();

const filterList = ref<FilterGroup[]>([
  {
    id: 'sort',
    label: '排序',
    children: [
      { id: 'latest', label: '最新' },
      { id: 'hot', label: '最热' },
      { id: 'recommend', label: '推荐' },
    ],
  },
  {
    id: 'price',
    label: '价格',
    children: [
      { id: 'free', label: '免费' },
      { id: 'paid', label: '付费' },
    ],
  },
]);

const activeFilters = reactive<Record<string, string>>({
  sort: 'latest',
  price: '',
});
</script>

<style scoped lang="scss">
.video-waterfall-nav {
  position: relative;
  width: 100%;
  padding: 12px 16px 16px;
  border-radius: var(--ao-border-radius-xl);
  box-sizing: border-box;
  /* 按容器圆角裁切水纹背景，杜绝背景图在圆角处溢出 */
  overflow: hidden;

  /* 1px 渐变边框（真边框方案）：边框透明，由双层背景填充 ——
     border-box 层 = 径向渐变（圆心在底边中点：底边最亮、沿两侧向上渐浅、
     顶部收在浅品牌色），在透明边框处透出为 1px 渐变边框；
     padding-box 层 = 卡片底色。
     真边框随 border-radius 原生渲染，圆角处不会断线 */
  border: 1px solid transparent;
  /* 亮一档的品牌色：主色混一点亮青（随主色令牌联动） */
  $brand-bright: color-mix(in srgb, var(--ao-color-primary) 70%, #00e6ff);
  background:
    /* 卡片底色（最上层，盖住内部） */
    linear-gradient(var(--ao-gray-0), var(--ao-gray-0)) padding-box,
    /* 品牌色径向渐变：底边中点最亮，沿两侧向上渐隐，约到一半高度消失
       （单个渐变场，圆角处无接缝） */
    radial-gradient(
      120% 150% at 50% 100%,
      #{$brand-bright} 0%,
      #{color-mix(in srgb, $brand-bright 60%, transparent)} 40%,
      transparent 70%
    )
      border-box,
    /* 最底层：整圈原边框灰 —— 上半部分与顶部就是它 */
    linear-gradient(var(--ao-color-border), var(--ao-color-border)) border-box;
}

/* 祥云 + 太阳:贴顶靠右(太阳始终在右上角),高度占组件一半 */
.sky-bg {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  width: 100%;
  height: 50%;
  object-fit: cover;
  object-position: right top;
  border-radius: var(--ao-border-radius-xl) var(--ao-border-radius-xl) 0 0;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

/* 水纹背景图:单排贴底,高度占组件一半,透明底、纯线条、无缝
   调高度改 height;调线色改 svg 里的 fill(当前 #e3e7eb);想更淡可调 opacity */
.wave-bg {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 50%;
  object-fit: cover;
  object-position: right bottom; /* 与 sky-bg 同样靠右对齐,云和浪的相对位置固定 */
  border-radius: 0 0 calc(var(--ao-border-radius-xl) - 1px) calc(var(--ao-border-radius-xl) - 1px);
  opacity: 1;
  pointer-events: none;
  user-select: none;
  z-index: 0;
}

/* 内容盖在水纹上面 */
.nav-list,
.filter {
  position: relative;
  z-index: 1;
}

/* ================= 导航区 ================= */
.nav-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  padding: 6px 0 16px;
}

.nav-item {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 26px;
  cursor: pointer;
  user-select: none;
  color: var(--ao-color-text-secondary);
  font-size: 14px;
  font-weight: var(--ao-font-weight-medium);
  background-color: #fff;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.08),
    0 1px 2px rgba(0, 0, 0, 0.05);
  transition:
    color 0.15s ease,
    background-color 0.15s ease,
    box-shadow 0.15s ease;

  &.shape-0 {
    border-radius: 28px 6px 26px 4px / 4px 28px 6px 26px;
  }
  &.shape-1 {
    border-radius: 4px 26px 6px 28px / 26px 4px 28px 6px;
  }
  &.shape-2 {
    border-radius: 26px 4px 28px 7px / 7px 26px 4px 28px;
  }
  &.shape-3 {
    border-radius: 6px 28px 4px 26px / 26px 7px 28px 4px;
  }

  &:hover {
    color: var(--ao-color-text-base);
    background-color: #fff;
    box-shadow:
      0 4px 10px rgba(0, 0, 0, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.06);
  }

  &.active {
    color: #fff;
    background-color: var(--ao-lime-6);
    font-weight: var(--ao-font-weight-semibold);
    box-shadow:
      0 4px 12px color-mix(in srgb, var(--ao-lime-6) 42%, transparent),
      0 2px 4px color-mix(in srgb, var(--ao-lime-6) 25%, transparent);

    &.shape-0 {
      border-radius: 30px 5px 26px 7px / 7px 28px 4px 30px;
    }
    &.shape-1 {
      border-radius: 5px 30px 7px 26px / 28px 5px 30px 4px;
    }
    &.shape-2 {
      border-radius: 28px 7px 30px 4px / 4px 26px 6px 28px;
    }
    &.shape-3 {
      border-radius: 7px 26px 4px 30px / 28px 4px 26px 6px;
    }
  }
}

.nav-icon {
  font-size: 15px;
  line-height: 1;
}

.nav-label {
  line-height: 1;
}

/* ================= 筛选区 ================= */
.filter {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 2px;
  padding-right: 130px; /* 给右下角签名让出空间 */
}

.filter-item {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-label {
  flex-shrink: 0;
  font-size: 13px;
  font-weight: var(--ao-font-weight-semibold);
  color: var(--ao-color-text-base);
}

.filter-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 10px;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  color: var(--ao-color-text-tertiary);
  background-color: #fff;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.06),
    0 1px 2px rgba(0, 0, 0, 0.04);
  transition: all 0.15s ease;

  &.shape-0 {
    border-radius: 20px 4px 18px 3px / 3px 20px 4px 18px;
  }
  &.shape-1 {
    border-radius: 3px 18px 4px 20px / 18px 3px 20px 4px;
  }
  &.shape-2 {
    border-radius: 18px 3px 20px 5px / 5px 18px 3px 20px;
  }
  &.shape-3 {
    border-radius: 4px 20px 3px 18px / 18px 5px 20px 3px;
  }

  &:hover {
    color: var(--ao-color-text-base);
    background-color: #fff;
    box-shadow:
      0 3px 7px rgba(0, 0, 0, 0.09),
      0 1px 3px rgba(0, 0, 0, 0.05);
  }

  &.active {
    color: var(--ao-lime-3);
    background-color: color-mix(in srgb, var(--ao-lime-6) 12%, #fff);
    font-weight: var(--ao-font-weight-medium);
    box-shadow:
      inset 0 0 0 1px var(--ao-lime-6),
      0 2px 5px color-mix(in srgb, var(--ao-lime-6) 20%, transparent);

    &.shape-0 {
      border-radius: 22px 3px 18px 5px / 5px 20px 3px 22px;
    }
    &.shape-1 {
      border-radius: 3px 22px 5px 18px / 20px 4px 22px 3px;
    }
    &.shape-2 {
      border-radius: 20px 5px 22px 3px / 3px 18px 5px 20px;
    }
    &.shape-3 {
      border-radius: 5px 18px 3px 22px / 20px 3px 18px 5px;
    }
  }
}

/* ================= 右下角草书水印 ================= */
.signature {
  position: absolute;
  right: 20px;
  bottom: 16px;
  /* 右下角水印字体与横幅使用同一装饰体（同字号下显小，故放大补偿） */
  font-family: var(--ao-font-family-dinglie);
  font-size: 44px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 6px;
  color: var(--ao-gray-5);
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
  z-index: 1;
}
</style>
