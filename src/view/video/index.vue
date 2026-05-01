<template>
  <div class="video-container">
    <div class="video-wrapper">
      <div class="video-info flex-column">
        <div class="title">
          <h3>
            <!-- 前端开发最强简历攻略，专治找不到工作，来我这就对了，保你年薪百万,我是一个前端开发,我是一个前端开发,我是一个前端开发 -->
            {{ data.title }}
          </h3>
        </div>
        <div class="meta">
          <div class="meta-item flex-x">
            <AoImage
              src="@/assets/video/icon_play_count.svg"
              width="16px"
              height="16px"
            />
            <span>{{ data.meta.playCount }}万</span>
          </div>
          <div class="meta-item flex-x">
            <AoImage
              src="@/assets/video/icon_publish_time.svg"
              width="16px"
              height="16px"
            />
            <span>{{ data.meta.publishTime }}</span>
          </div>
          <div class="meta-item flex-x">
            <AoImage
              src="@/assets/video/icon_author.svg"
              width="16px"
              height="16px"
            />
            <span>作者：{{ data.meta.author }}</span>
          </div>
          <div class="meta-item flex-x" v-if="data.meta.authRequire">
            <AoImage
              src="@/assets/video/icon_prohibit.svg"
              width="16px"
              height="16px"
            />
            <span>未经作者授权，禁止转载</span>
          </div>
        </div>
      </div>

      <!-- 视频区域 -->
      <div class="player-wrapper">
        <VideoPlayer :src="data.video.src" :poster="data.video.poster" />
      </div>

      <div class="video-comment">
        <div class="comment"></div>
        <div class="recommand"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import VideoPlayer from '@/components/video-player/index.vue';
import AoImage from '@/components/ao-image/index.vue';

const data = ref({
  title: 'claude code桌面版终于可以第三方模型了',
  meta: {
    playCount: 2000,
    publishTime: '2026-4-10 20:21:00',
    author: '梁其洋',
    authRequire: true,
  },
  video: {
    poster: 'https://picsum.photos/1280/720?random=1',
    src: 'https://vjs.zencdn.net/v/oceans.mp4',
  },
});
</script>
<style lang="scss" scoped>
@use './index.scss' as *;
</style>
