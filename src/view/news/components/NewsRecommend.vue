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
  border-bottom: 1px solid #9999996a;
  margin-bottom: 4px;
}

.header-icon {
  font-size: 15px;
  line-height: 1;
}

.header-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.recommend-list {
  display: flex;
  flex-direction: column;
}

.recommend-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #cacaca49;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    opacity: 0.75;

    .item-title {
      color: var(--primary-color, #1677ff);
    }
  }
}

.item-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.item-title {
  font-size: 13.5px;
  font-weight: 500;
  color: #222;
  line-height: 1.5;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.15s ease;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
}

.meta-dot {
  color: #ddd;
}
</style>
