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
        <div class="news-title">{{ item.title }}</div>
        <div class="news-views">{{ formatViews(item.views) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'NewsCard'
})

const newsList = ref([
  { title: 'OpenAI发布GPT-5模型，性能提升显著', views: 125000 },
  { title: '谷歌推出全新AI助手Gemini Ultra版本', views: 98000 },
  { title: '微软将AI技术深度整合到Office套件', views: 87000 },
  { title: 'Meta开源最新大语言模型Llama 3', views: 76000 },
  { title: '百度文心一言4.0正式上线，支持多模态', views: 65000 }
])

const formatViews = (views) => {
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + 'w'
  }
  return views.toString()
}
</script>

<style lang="scss" scoped>
.news-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
    padding-bottom: 8px;
    border-bottom: 2px solid #f0f0f0;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
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
      border-bottom: 1px solid #f5f5f5;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: #f9f9f9;
        border-radius: 6px;
      }

      &:last-child {
        border-bottom: none;
      }

      .news-title {
        flex: 1;
        font-size: 14px;
        color: #555;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: 12px;
      }

      .news-views {
        flex-shrink: 0;
        font-size: 12px;
        color: #999;
        font-weight: 500;
      }
    }
  }
}
</style>