<template>
  <div class="player-container">
    <video-player class="video-player">
      <video-skin class="video-skin">
        <hls-video :src="src" playsinline :poster="poster"></hls-video>
      </video-skin>
    </video-player>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import '@videojs/html/video/player';
import '@videojs/html/video/skin';
import '@videojs/html/media/hls-video';
import '@videojs/html/background/player';
import '@videojs/html/background/skin';
import '@videojs/html/background/video';

const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  poster: {
    type: String,
    default: '',
  },
});
</script>
<style lang="scss" scoped>
.player-container {
  width: 100%;
  height: 100%;
}

.video-player {
  aspect-ratio: 16 / 9;
}

.video-skin {
  aspect-ratio: 16 / 9;
}

video-skin {
  --media-primary-color: #ff5722;
  --media-secondary-color: #2c3e50;
  --media-controls-background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  --media-controls-background: transparent;
  --media-controls-height: 20px;
  --media-border-radius: 8px;
}
</style>
