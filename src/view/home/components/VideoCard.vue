<template>
  <div class="video-card">
    <div class="card_cover">
      <img
        :src="props.data.video.cover"
        :alt="props.data.title"
        @error="handleImgError"
      />
    </div>
    <div class="card_info">
      <div class="info_title">
        <span>{{ props.data.title }}</span>
      </div>
      <div class="info_bottom">
        <div class="bottom_play">
          <span>{{ playText }}</span>
        </div>
        <div class="bottom_date">
          <span>{{ dateText }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Video } from '@/api/type/video';

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=60';

defineOptions({
  name: 'VideoCard',
});

const props = withDefaults(
  defineProps<{
    data: Video;
  }>(),
  {
    data: () => ({
      id: 0,
      title: '',
      description: '',
      tags: [],
      repostAllow: false,
      publishTime: '',
      isHot: false,
      isRecommended: false,
      isNew: false,
      author: { id: 0, name: '' },
      meta: {
        playCount: 0,
        likeCount: 0,
        favoriteCount: 0,
        commentCount: 0,
        shareCount: 0,
      },
      video: {
        cover: '',
        url: '',
        duration: 0,
      },
    }),
  },
);
const playText = computed(() => {
  const num = Number(props.data.meta.playCount || 0);
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万播放`;
  return `${num}播放`;
});

const dateText = computed(() => {
  return props.data.publishTime || '';
});

const handleImgError = (e: any) => {
  if (!e || !e.target) return;
  if (e.target.src === FALLBACK_COVER) return;
  e.target.src = FALLBACK_COVER;
};
</script>

<style scoped lang="scss">
.video-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: var(--ao-border-radius-xl);
  overflow: hidden;
  background-color: var(--ao-color-bg-container);
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  transition: 0.18s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
  }

  .card_cover {
    width: 100%;
    height: 135px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: 0.2s;
    }
  }

  &:hover {
    .card_cover {
      img {
        transform: scale(1.04);
      }
    }
  }

  .card_info {
    flex: 1;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .info_title {
    flex: 1;
    font-size: var(--ao-font-size-sm);
    line-height: 1.35;
    color: var(--ao-color-text-base);
    opacity: 0.85;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .info_bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .bottom_play {
      font-size: var(--ao-font-size-xs);
      color: var(--ao-color-text-base);
      opacity: 0.45;
    }

    .bottom_date {
      font-size: var(--ao-font-size-xs);
      padding: 2px var(--ao-spacing-xs);
      border-radius: var(--ao-border-radius-full);
      color: var(--ao-color-text-tertiary);
      opacity: 0.5;
    }
  }
}
</style>
