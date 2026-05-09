<template>
  <div class="news-card">
    <div class="card-header">
      <h3>AI 资讯</h3>
      <span class="icon">
        <i class="iconfont icon-right"></i>
      </span>
    </div>
    <div class="news-list">
      <div class="news-item" v-for="(item, index) in newsList" :key="index">
        <div class="news-title" :style="{ maxWidth: newsTitleMaxWidth }">
          {{ item.title }}
        </div>
        <div class="news-views">
          {{ formatViews(item.views) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { on } from 'node:cluster';
import { computed, onMounted, ref } from 'vue';

defineOptions({
  name: 'NewsCard',
});

const newsTitleMaxWidth = ref('270px');

const newsList = ref([
  {
    title:
      'OpenAI发布GPT-5模型，性能提升显著,5模型，性能提升显著,5模型，性能提升显著,5模型，性能提升显著',
    views: 12500000,
  },
  { title: '谷歌推出全新AI助手Gemini Ultra版本', views: 980000 },
  { title: '微软将AI技术深度整合到Office套件', views: 87000 },
  { title: 'Meta开源最新大语言模型Llama 3', views: 76000 },
  { title: '百度文心一言4.0正式上线，支持多模态', views: 65000 },
]);

const formatViews = (views: number) => {
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + 'w';
  }
  return views.toString();
};

onMounted(() => {
  const newsListEl = document.querySelector('.news-list') as HTMLElement | null;
  const newsViewsEl = document.querySelectorAll('.news-views');

  if (!newsListEl || newsViewsEl.length === 0) {
    return;
  }

  const listWidth = newsListEl.getBoundingClientRect().width;
  const viewsWidth = newsViewsEl[0].getBoundingClientRect().width;
  newsTitleMaxWidth.value = listWidth - viewsWidth - 20 + 'px';
});
</script>

<style lang="scss" scoped>
.news-card {
  background: var(--app-bg-color-light);
  border-radius: 12px;
  padding: 20px;
  // box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--app-border-color);
  display: flex;
  flex-direction: column;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    padding-bottom: 8px;
    border-bottom: 2px solid var(--app-border-color);

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--app-text-color-dark);
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;

      .iconfont {
        font-size: 20px;
      }
    }
  }

  .news-list {
    flex: 1;
    overflow: hidden;

    .news-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 5px;
      border-bottom: 1px solid var(--app-border-color);
      cursor: pointer;
      transition: all 0.2s ease-out;

      &:hover {
        .news-title,
        .news-views {
          color: #434343;
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
        }
      }

      &:hover {
        background-color: #dadada33;
      }

      &:last-child {
        border-bottom: none;
      }

      .news-title {
        flex: 1;
        font-size: 14px;
        color: var(--app-text-color-light);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
      }

      .news-views {
        flex-shrink: 0;
        font-size: 12px;
        color: var(--app-text-color-light);
        max-width: 45px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
