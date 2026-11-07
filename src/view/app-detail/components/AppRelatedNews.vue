<template>
  <ul class="related-news">
    <li v-for="news in newsList" :key="news.id" class="related-news__item">
      <RouterLink
        class="related-news__link"
        :to="{ name: 'news-detail', params: { id: news.id } }"
      >
        <span class="related-news__title">{{ news.title }}</span>
        <span class="related-news__meta">
          {{ news.date }} · 已有 {{ news.viewCount }} 人浏览
        </span>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { latestAiNews } from '@/mock/aiNews';

defineOptions({ name: 'AppRelatedNews' });

/** 相关资讯：取最新的 AI 资讯 */
const newsList = computed(() => latestAiNews);
</script>

<style scoped lang="scss">
.related-news {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;

  &__item + &__item {
    border-top: var(--ao-border-width-thin) dashed
      var(--ao-color-border-secondary);
  }

  &__link {
    display: flex;
    flex-direction: column;
    gap: var(--ao-spacing-xxs);
    padding: var(--ao-spacing-sm) 0;
    text-decoration: none;
    transition: color var(--ao-duration-fast) var(--ao-ease-in-out);
  }

  &__title {
    display: -webkit-box;
    overflow: hidden;
    font-size: var(--ao-font-size-sm);
    line-height: var(--ao-line-height-base);
    color: var(--ao-color-text-base);
    text-overflow: ellipsis;
    word-break: break-word;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    transition: color var(--ao-duration-fast) var(--ao-ease-in-out);
  }

  &__link:hover &__title {
    color: rgb(var(--app-main-rgb, 0, 181, 181));
  }

  &__meta {
    font-size: var(--ao-font-size-xs);
    color: var(--ao-color-text-tertiary);
  }
}
</style>
