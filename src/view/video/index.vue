<template>
  <div class="video-container">
    <div class="video-wrapper">
      <div class="content">
        <div class="video-info">
          <div class="title">
            <h3>
              前端开发最强简历攻略，专治找不到工作，来我这就对了，保你年薪百万,我是一个前端开发,我是一个前端开发,我是一个前端开发
            </h3>
          </div>
          <div class="meta">
            <div class="play-count flex-x">
              <img
                src="@/assets/video/icon_play_count.svg"
                alt=""
                class="icon-size-16 mr-4"
              />
              <span>2000万</span>
            </div>
            <div class="date flex-x">
              <img
                src="@/assets/video/icon_publish_time.svg"
                alt=""
                class="icon-size-16 mr-4"
              />
              <span>2026-4-10 20:21:00</span>
            </div>
          </div>
        </div>
        <div class="author-info">
          <div class="author-wrapper">
            <div class="avatar">
              <img src="@/assets/avatar.png" alt="" />
            </div>
            <div class="info">
              <div class="name"><h3 class="ellipsis">小满即安</h3></div>
              <div class="desc">
                <p class="ellipsis">
                  我是一个前端开发                  我是一个前端开发
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="player-wrapper">
        <video-player class="video-player">
          <video-skin class="video-skin">
            <hls-video
              :src="videoSource"
              playsinline
              :poster="videoSource"
            ></hls-video>
          </video-skin>
        </video-player>
      </div>
    </div>
    <!-- <div class="video-right">
      <div class="author">
        <div class="avatar">
          <img src="@/assets/avatar.png" alt="" />
        </div>
        <div class="info">
          <div class="name"><h3>小满即安</h3></div>
          <div class="desc"><p>我是一个前端开发</p></div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from 'vue';
import '@videojs/html/video/player';
import '@videojs/html/video/skin';
import '@videojs/html/media/hls-video';
import '@videojs/html/background/player';
import '@videojs/html/background/skin';
import '@videojs/html/background/video';
const videoSource = ref('https://vjs.zencdn.net/v/oceans.mp4');
</script>
<style lang="scss" scoped>
@use './index.scss' as *;
</style>
