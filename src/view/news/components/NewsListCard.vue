<template>
  <div class="today-news-list">
    <div class="card-header">
      <h3>{{ labelParts.before }}<span v-if="labelParts.highlight" class="brand">{{ labelParts.highlight }}</span>{{ labelParts.after }}</h3>
      <span class="sub-label">{{ subLabel }}</span>
    </div>

    <div class="news-list" v-if="list.length > 0">
      <div
        class="news-item"
        v-for="item in list"
        :key="item.id"
        @click="handleItemClick(item.id)"
      >
        <div class="cover-image" v-if="item.cover">
          <img :src="item.cover" alt="封面" />
        </div>
        <div class="cover-image" v-else>
          <div class="cover-placeholder">📷</div>
        </div>

        <div class="content-wrapper">
          <div class="title">{{ item.title }}</div>
          <div class="content">{{ item.summary || item.content }}</div>
        </div>

        <div class="view-count">{{ formatViews(item.views) }}</div>
      </div>
    </div>

    <div v-else class="empty-state">暂无资讯，敬请期待</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  name: 'TodayNewsList',
});

const props = defineProps<{
  label: string;
  highlight?: string;
  subLabel: string;
  list: Array<{
    id: string | number;
    title: string;
    summary?: string;
    content?: string;
    cover?: string;
    views: number;
  }>;
}>();

const labelParts = computed(() => {
  const text = props.label;
  const keyword = props.highlight;
  const index = keyword ? text.indexOf(keyword) : -1;

  if (!keyword || index === -1) {
    return { before: text, highlight: '', after: '' };
  }

  return {
    before: text.slice(0, index),
    highlight: keyword,
    after: text.slice(index + keyword.length),
  };
});

const emit = defineEmits<{
  (event: 'click', id: string | number): void;
}>();

const formatViews = (views: number) => {
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + 'w';
  }
  return views.toString();
};

const handleItemClick = (id: string | number) => {
  emit('click', id);
};
</script>

<style scoped lang="scss">
.today-news-list {
  background: var(--ao-color-bg-container);
  border-radius: var(--ao-border-radius-xl);
  padding: 15px;
  overflow: hidden;
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  min-height: 280px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: var(--ao-spacing-xs);
    border-bottom: 1px solid var(--ao-color-border);

    h3 {
      margin: 0;
      font-size: var(--ao-font-size-base);
      font-weight: var(--ao-font-weight-semibold);
      color: var(--ao-color-text-base);
      position: relative;

      .brand {
        color: var(--ao-color-primary);
      }
    }

    .sub-label {
      font-size: var(--ao-font-size-sm);
      color: var(--ao-color-text-tertiary);
      white-space: nowrap;
    }
  }

  .news-list {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .news-item {
      display: flex;
      align-items: flex-start;
      padding-bottom: 10px;
      cursor: pointer;
      transition: all var(--ao-duration-fast) var(--ao-ease-out);
      gap: 12px;
      position: relative;

      &:last-child {
        padding-bottom: 0;
      }

      /* 分割线：使用 border-top 更细，颜色更浅 */
      &:not(:last-child)::after {
        content: '';
        position: absolute;
        left: calc(80px + 12px);
        top: 60px;
        right: 0;
        border-top: 0.5px solid var(--ao-color-border);
        opacity: 0.6;
        pointer-events: none;
      }

      .cover-image {
        flex-shrink: 0;
        width: 80px;
        height: 60px;
        border-radius: var(--ao-border-radius-sm);
        overflow: hidden;
        background: var(--ao-gray-4);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cover-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--ao-gray-6);
        }
      }

      .content-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        height: 100%;
        justify-content: space-between;
        gap: 5px;

        .title {
          font-size: 15px;
          font-weight: var(--ao-font-weight-medium);
          color: var(--ao-color-text-base);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 4px;
        }

        .content {
          font-size: 13px;
          color: var(--ao-color-text-tertiary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      /* 浏览量：垂直居中 */
      .view-count {
        flex-shrink: 0;
        font-size: var(--ao-font-size-xs);
        color: var(--ao-color-text-tertiary);
        font-weight: var(--ao-font-weight-medium);
        white-space: nowrap;
        margin-left: 8px;
        align-self: center; /* 垂直居中 */
      }
    }
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--ao-font-size-md);
    color: var(--ao-color-text-tertiary);
  }
}
</style>
