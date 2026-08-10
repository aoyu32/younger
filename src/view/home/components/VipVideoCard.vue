<template>
  <div class="vip-video-card">
    <div class="card-top">
      <AoImage :src="data.video.cover" width="100%" height="160px"></AoImage>
      <div
        class="tag"
        v-if="data.isNew"
        style="background-color: var(--ao-color-warning)"
      >
        最新
      </div>
      <div
        class="tag"
        v-if="data.isHot"
        style="background-color: var(--ao-color-error)"
      >
        最热
      </div>
      <div
        class="tag"
        v-if="data.isRecommended"
        style="background-color: var(--ao-color-success)"
      >
        推荐
      </div>
      <div class="info-meta flex">
        <div class="meta-play flex-center">
          <AoImage
            src="@/assets/home/icon_video_play_count.svg"
            width="14px"
            height="14px"
          />
          {{ data.meta.playCount }}
        </div>
        <div class="meta-date">{{ data.publishTime }}</div>
      </div>
    </div>
    <div class="card-bottom">
      <div class="info_title">
        <span class="dot"></span><span>{{ props.data.title }}</span>
      </div>
      <div class="info-price flex-between">
        <div class="tags">
          <div class="vip-free">会员免费</div>
        </div>
        <div class="price">
          <span class="origin-price">￥99.9</span>
          <span class="now-price">￥19.9</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Video } from '@/api/type/video';
import playIcon from '@/assets/video/icon_play_count.svg';
// 你的代码
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
</script>

<style scoped lang="scss">
.vip-video-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: var(--ao-border-radius-lg);
  overflow: hidden;
  background-color: var(--ao-color-bg-container);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  transition: 0.18s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
  }

  .card-top {
    position: relative;
    .tag {
      position: absolute;
      top: 0;
      right: 0;
      color: var(--ao-gray-1);
      font-size: 10px;
      padding: 4px 6px;
      border-bottom-left-radius: var(--ao-border-radius-lg);
    }
    .info-meta {
      width: 100%;
      padding: 5px 10px;
      color: var(--ao-gray-1);
      font-size: var(--ao-font-size-xs);
      position: absolute;
      display: flex;
      justify-content: space-between;
      bottom: 0px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
    }

    .meta-play {
      gap: 5px;
    }
  }

  .card-bottom {
    flex: 1;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .info_title {
      flex: 1;
      font-size: var(--ao-font-size-sm);
      line-height: 1.35;
      color: var(--ao-color-text-base);
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;

      .dot {
        display: inline-block;
        width: 3px;
        height: 10px;
        margin-right: 4px;
        border-radius: var(--ao-border-radius-sm);
        background-color: var(--ao-color-primary);
      }
    }
  }

  .info-price {
    .tags {
      padding: 4px 12px;
      border: 1px solid #b8860b;
      border-radius: 4px;
      font-size: var(--ao-font-size-xs, 12px);
      color: #d4af37;
      background: rgba(255, 221, 137, 0.2);
      transition: all 0.3s ease-in-out;
    }

    .tags:hover {
      background: rgba(255, 201, 65, 0.3);
      border-color: #d4af37;
    }

    .price {
      display: flex;
      gap: var(--ao-spacing-xs);
      align-items: center;
      font-weight: 550;
      margin-right: 5px;
      .now-price {
        font-weight: 700;
        color: rgb(255, 78, 78);
        font-size: 16px;
      }
      .origin-price {
        font-weight: 650;
        position: relative;
        color: var(--ao-gray-5);
        font-size: 13px;
        text-decoration: line-through;
      }
    }
  }
}
</style>
