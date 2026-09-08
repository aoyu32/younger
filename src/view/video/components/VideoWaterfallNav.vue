<template>
  <div class="video-waterfall-nav">
    <div class="waterfall-wrapper">
      <div
        v-for="item in menuItems"
        :key="item.id"
        class="nav-item"
        :class="{ active: modelValue === item.id }"
        @click="$emit('update:modelValue', item.id)"
      >
        <span v-if="item.icon" class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </div>
    </div>
    <div class="filter flex">
      <div class="filter-item" v-for="group in filterList" :key="group.id">
        <div class="filter-label">{{ group.label }}</div>
        <div class="filter-list">
          <div
            class="filter-tag"
            v-for="child in group.children"
            :key="child.id"
            :class="{ active: activeFilters[group.id] === child.id }"
            @click="activeFilters[group.id] = child.id"
          >
            {{ child.label }}
          </div>
        </div>
      </div>
    </div>
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
  width: 100%;
  padding: 10px 15px;
  background-color: var(--ao-gray-2);
  border-radius: var(--ao-border-radius-base);
  position: relative;
  overflow: hidden;
}

.waterfall-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.nav-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 25px;
  background: var(--ao-gray-0);
  border-radius: var(--ao-border-radius-base);
  border: 1px solid var(--ao-gray-3);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  white-space: nowrap;
  color: var(--ao-gray-7);

  &:hover {
    background: #fff;
    border-color: var(--ao-gray-4);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  &.active {
    background: var(--ao-color-primary);
    border-color: var(--ao-color-primary);
    color: #fff;
  }
}

.nav-icon {
  font-size: 16px;
  line-height: 1;
}

.nav-label {
  font-size: 13px;
  font-weight: var(--ao-font-weight-medium);
}

.filter {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--ao-gray-3);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.filter-label {
  flex-shrink: 0;
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-semibold);
  color: var(--ao-gray-7);
  padding: 0 20px;
  position: relative;

  &::after {
    content: '';
    width: 3px;
    height: 70%;
    background-color: var(--ao-color-primary);
    position: absolute;
    border-radius: var(--ao-border-radius-base);
    left: 0;
    top: 55%;
    transform: translateY(-50%);
  }
}

.filter-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  padding: 4px 14px;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-gray-6);
  background: var(--ao-gray-0);
  border: 1px solid var(--ao-gray-3);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    color: var(--ao-color-primary);
    border-color: var(--ao-color-primary);
  }

  &.active {
    color: var(--ao-color-primary);
    background: color-mix(
      in srgb,
      var(--ao-color-primary) 8%,
      var(--ao-gray-0)
    );
    border-color: var(--ao-color-primary);
    font-weight: var(--ao-font-weight-medium);
  }
}
</style>
