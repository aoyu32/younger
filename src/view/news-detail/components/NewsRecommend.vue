<template>
  <div class="news-recommend">
    <div class="recommend-header">
      <span class="header-icon"></span>
      <span class="header-title">热门推荐</span>
    </div>
    <div class="recommend-list">
      <div
        v-for="(item, index) in displayList"
        :key="index"
        class="recommend-item"
        @click="handleClick(item)"
      >
        <div class="item-content">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-meta">
            <span class="meta-views">{{ formatCount(item.views) }}阅读</span>
            <span class="meta-dot">·</span>
            <span class="meta-likes">{{ formatCount(item.likes) }}点赞</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatCount } from '@/utils/format';

const props = withDefaults(
  defineProps<{
    newsList: any;
    limit?: number;
  }>(),
  {
    limit: 5,
  },
);

const emit = defineEmits<{
  (e: 'click', item: any): void;
}>();

const displayList = computed(() => props.newsList.slice(0, props.limit) as any);

const handleClick = (item: any) => {
  emit('click', item);
};
</script>

<style scoped lang="scss">
.news-recommend {
  width: 100%;
}

.recommend-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding-bottom: 15px;
  border-bottom: var(--ao-border-width-thin) solid #9999996a;
  margin-bottom: 4px;
}

.header-icon {
  font-size: var(--ao-font-size-base);
  line-height: 1;
}

.header-title {
  font-size: var(--ao-font-size-base);
  font-weight: var(--ao-font-weight-semibold);
  color: #1a1a1a;
}

.recommend-list {
  display: flex;
  flex-direction: column;
}

.recommend-item {
  display: flex;
  align-items: flex-start;
  gap: var(--ao-spacing-sm);
  padding: var(--ao-spacing-sm) 0;
  border-bottom: var(--ao-border-width-thin) solid #cacaca49;
  cursor: pointer;
  transition: opacity var(--ao-duration-fast) ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    opacity: 0.75;

    .item-title {
      color: var(--ao-color-primary);
    }
  }
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-xxs);
}

.item-title {
  font-size: 13.5px;
  font-weight: var(--ao-font-weight-medium);
  color: #222;
  line-height: var(--ao-line-height-base);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color var(--ao-duration-fast) ease;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-xxs);
  font-size: var(--ao-font-size-xs);
  color: #999;
}

.meta-dot {
  color: #ddd;
}
</style>
