<template>
  <div class="news-card">
    <AoPage
      v-model:current="currentPage"
      :size="newsPageSize"
      :total="data.length"
    >
      <template #controls="{ isNext, isPrev, change }">
        <div class="card-header">
          <h3>AI 资讯</h3>
          <div class="page-btns" v-if="data.length > 5">
            <div class="prev" @click="change('pre')">
              <!-- 上一页按钮 -->
              <AoIcon
                :icon="prevIcon"
                :size="16"
                :color="isPrev ? 'var(--ao-gray-4)' : 'var(--ao-gray-6)'"
                :hover-color="isPrev ? 'var(--ao-gray-4)' : 'var(--ao-color-text-base)'"
              />
            </div>
            <div class="next" @click="change('next')">
              <!-- 下一页按钮 -->
              <AoIcon
                :icon="nextIcon"
                :size="16"
                :color="isNext ? 'var(--ao-gray-4)' : 'var(--ao-gray-6)'"
                :hover-color="isNext ? 'var(--ao-gray-4)' : 'var(--ao-color-text-base)'"
              />
            </div>
          </div>
          <div class="label" v-else>
            <div class="label-item">最新</div>
          </div>
        </div>
      </template>
      <div class="news-list">
        <div
          class="news-item"
          v-for="(item, index) in newsList"
          :key="index"
          @click="handleItemClick(item.id)"
        >
          <div class="news-title" :style="{ maxWidth: newsTitleMaxWidth }">
            {{ item.title }}
          </div>
          <div class="news-views">
            {{ formatViews(item.views) }}
          </div>
        </div>
      </div>
    </AoPage>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import prevIcon from '@/assets/home/icon_pre.svg';
import nextIcon from '@/assets/home/icon_next.svg';

defineOptions({
  name: 'NewsCard',
});

const props = defineProps<{
  data: any[];
}>();

const emit = defineEmits<{
  (event: 'click', id: any): void;
}>();

const newsPageSize = ref(5);
const currentPage = ref(1);
const newsTitleMaxWidth = ref('270px');

const newsList = computed(() => {
  const start = (currentPage.value - 1) * newsPageSize.value;
  return props.data.slice(start, start + newsPageSize.value);
});

const formatViews = (views: number) => {
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + 'w';
  }
  return views.toString();
};

const handleItemClick = (id: any) => {
  emit('click', id);
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
  background: var(--ao-color-bg-container);
  border-radius: var(--ao-border-radius-xl);
  padding: 20px;
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
    margin-bottom: 5px;
    padding-bottom: var(--ao-spacing-xs);
    border-bottom: var(--ao-border-width-medium) solid var(--ao-color-border);

    h3 {
      margin: 0;
      font-size: var(--ao-font-size-lg);
      font-weight: var(--ao-font-weight-semibold);
      color: var(--ao-color-text-base);
    }

    .page-btns {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .prev,
    .next {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
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
      border-bottom: var(--ao-border-width-thin) solid var(--ao-color-border);
      cursor: pointer;
      transition: all var(--ao-duration-fast) var(--ao-ease-out);

      &:hover {
        .news-title,
        .news-views {
          color: var(--ao-gray-8);
          text-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
        }
      }

      &:hover {
        background-color: color-mix(in srgb, var(--ao-gray-4) 20%, transparent);
      }

      &:last-child {
        border-bottom: none;
      }

      .news-title {
        flex: 1;
        font-size: var(--ao-font-size-sm);
        color: var(--ao-color-text-tertiary);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-right: var(--ao-spacing-sm);
      }

      .news-views {
        flex-shrink: 0;
        font-size: var(--ao-font-size-xs);
        color: var(--ao-color-text-tertiary);
        max-width: 45px;
        font-weight: var(--ao-font-weight-medium);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>
