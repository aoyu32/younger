<template>
  <div class="video-player">
    <video
      ref="videoElement"
      controls
      src="https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM.m3u8"
      style="width: 100%;"
    ></video>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from 'video.js'
import 'video.js/dist/video-js.css' 


</script>

<style scoped>
.video-player {
  width: 1000px;
}
</style>
