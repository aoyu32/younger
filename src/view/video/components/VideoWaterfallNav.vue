<template>
  <div class="video-waterfall-nav">
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
    <span class="signature" aria-hidden="true">快速导航</span>
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
  background-color: var(--ao-gray-0);
  border-radius: var(--ao-border-radius-xl);
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  box-sizing: border-box;

  background-image:
    linear-gradient(
      90deg,
      color-mix(in srgb, var(--ao-gray-4) 25%, transparent) 0.5px,
      transparent 0.5px
    ),
    linear-gradient(
      color-mix(in srgb, var(--ao-gray-4) 25%, transparent) 0.5px,
      transparent 0.5px
    );
  background-size: 24px 24px;
  background-position: -1px -1px;
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
  font-family: var(--ao-font-family-cao);
  font-size: 28px;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 6px;
  color: var(--ao-gray-4);
  opacity: 0.5;
  pointer-events: none;
  user-select: none;
}
</style>
