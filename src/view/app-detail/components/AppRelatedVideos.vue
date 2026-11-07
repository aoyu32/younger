<template>
  <div class="related-videos">
    <RouterLink
      v-for="video in videos"
      :key="video.id"
      class="related-videos__item"
      :to="`/video/${video.id}`"
    >
      <VideoCard :data="video" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VideoCard from '@/view/home/components/VideoCard.vue';
import { videoData } from '@/mock/videoData';

defineOptions({ name: 'AppRelatedVideos' });

/** 相关视频：复用首页视频卡片，过滤掉付费课程，取前 4 条 */
const videos = computed(() =>
  videoData.filter((item) => !('isPaid' in item) || !item.isPaid).slice(0, 4),
);
</script>

<style scoped lang="scss">
.related-videos {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ao-spacing-md);

  &__item {
    display: block;
    color: inherit;
    text-decoration: none;
  }
}

@media (max-width: 992px) {
  .related-videos {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .related-videos {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
