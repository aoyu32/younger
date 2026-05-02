<template>
  <div class="video-recommend">
    <div
      class="recommend-item"
      v-for="(item, index) in data"
      :key="index"
      @click="handleClick(item.id)"
    >
      <div class="cover">
        <AoImage :src="item.video.cover" />
      </div>
      <div class="info">
        <div class="title">{{ item.title }}</div>
        <div class="author flex-x">
          <AoImage
            src="@/assets/video/icon_up.svg"
            width="16px"
            height="16px"
          />
          <span>{{ item.author.name }}</span>
        </div>
        <div class="meta flex-x">
          <div class="meta-item flex-x">
            <AoImage
              src="@/assets/video/icon_play_count.svg"
              width="16px"
              height="16px"
            />
            <span>{{ item.meta.playCount }}万</span>
          </div>
          <div class="meta-item flex-x">
            <AoImage
              src="@/assets/video/icon_comment.svg"
              width="16px"
              height="16px"
            />
            <span>{{ item.meta.commentCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import AoImage from '@/components/ao-image/index.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const props = defineProps<{
  data: any[];
}>();

const handleClick = (id: number) => {
  router.push('/video/' + id);
};
</script>
<style scoped lang="scss">
@use './VideoRecommend.scss' as *;
</style>
