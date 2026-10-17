<template>
  <div class="news-card" @click="handleClick">
    <div v-if="item.cover" class="cover-img">
      <img :src="item.cover" :alt="item.title || ''" />
    </div>

    <div class="content">
      <div class="title" :class="{ 'is-empty': !item.title }">
        {{ item.title || '' }}
      </div>
      <div class="content-part">
        {{ item.content || '' }}
      </div>

      <div class="meta">
        <div v-if="item.date" class="meta-item date">
          {{ item.date }}
        </div>
        <div v-if="item.viewCount != null" class="meta-item">
          <AoImage
            src="@/assets/news/icon_views.svg"
            width="16px"
            height="16px"
          ></AoImage>
          {{ formatNumber(item.viewCount) }}
        </div>
        <div v-if="item.likeCount != null" class="meta-item">
          <AoImage
            src="@/assets/news/icon_like.svg"
            width="16px"
            height="16px"
          ></AoImage>
          {{ formatNumber(item.likeCount) }}
        </div>
        <div v-if="item.collectCount != null" class="meta-item">
          <AoImage
            src="@/assets/news/icon_favorite.svg"
            width="16px"
            height="16px"
          ></AoImage>
          {{ formatNumber(item.collectCount) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'NewsCard' });

export interface NewsCardItem {
  id: string | number;
  title?: string;
  content?: string;
  cover?: string;
  date?: string;
  viewCount?: number;
  likeCount?: number;
  collectCount?: number;
}

const props = defineProps<{
  item: NewsCardItem;
}>();

const emit = defineEmits<{
  click: [id: string | number];
}>();

function handleClick() {
  emit('click', props.item.id);
}

const formatNumber = (n: number): string => {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
  return String(n);
};
</script>

<style scoped lang="scss">
.news-card {
  display: flex;
  gap: 12px;
  padding:12px 10px;
  background: var(--ao-color-bg-container);
  // border: 1px solid var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: color-mix(
      in srgb,
      var(--ao-lime-6) 45%,
      var(--ao-color-border)
    );

    .cover-img img {
      transform: scale(1.04);
    }

    .title {
      color: var(--ao-lime-6);
    }
  }

  .cover-img {
    flex-shrink: 0;
    width: 140px;
    height: 100%;
    border-radius: var(--ao-border-radius-sm);
    overflow: hidden;
    background: var(--ao-gray-4);

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  .content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .title {
    font-size: 15px;
    font-weight: var(--ao-font-weight-semibold);
    line-height: 1.4;
    color: var(--ao-color-text-base);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.15s ease;
    margin-bottom: 2px;

    &.is-empty {
      visibility: hidden;
    }
  }

  .content-part {
    font-size: 13px;
    line-height: 1.5;
    color: var(--ao-color-text-tertiary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: calc(1.5em * 2);
    flex-shrink: 0;
  }

  .meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    color: var(--ao-color-text-tertiary);
    flex-shrink: 0;
    margin-top: auto;

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      white-space: nowrap;

      svg {
        flex-shrink: 0;
        opacity: 0.85;
      }
    }

    .date {
      margin-right: auto;
    }
  }
}
</style>
