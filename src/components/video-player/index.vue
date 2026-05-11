<template>
  <div class="player-container" ref="containerRef">
    <video-player class="video-player">
      <media-container>
        <video
          :src="src"
          autoplay
          playsinline
          ref="videoRef"
          @click="togglePlay"
          @seeked="handleVideoSeeked"
          @volumechange="handleVolumeChange"
          @canplay="handleCanPlay"
          @waiting="handleWaiting"
          @playing="handlePlaying"
          @pause="handlePause"
          @play="handlePlay"
          @loadedmetadata="handleLoadedMetadata"
        ></video>
        <div class="pause-overlay" :class="{ visible: showPauseOverlay }">
          <div class="pause-overlay-wrapper">
            <img :src="iconPlay" alt="暂停" />
          </div>
        </div>
        <div class="loading-overlay" v-if="isVideoLoading">
          <div class="loading-spinner">
            <svg
              fill="#ffffff"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1" rx="1" width="10" height="10">
                <animate
                  id="spinner_c7A9"
                  begin="0;spinner_23zP.end"
                  attributeName="x"
                  dur="0.2s"
                  values="1;13"
                  fill="freeze"
                />
                <animate
                  id="spinner_Acnw"
                  begin="spinner_ZmWi.end"
                  attributeName="y"
                  dur="0.2s"
                  values="1;13"
                  fill="freeze"
                />
                <animate
                  id="spinner_iIcm"
                  begin="spinner_zfQN.end"
                  attributeName="x"
                  dur="0.2s"
                  values="13;1"
                  fill="freeze"
                />
                <animate
                  id="spinner_WX4U"
                  begin="spinner_rRAc.end"
                  attributeName="y"
                  dur="0.2s"
                  values="13;1"
                  fill="freeze"
                />
              </rect>
              <rect x="1" y="13" rx="1" width="10" height="10">
                <animate
                  id="spinner_YLx7"
                  begin="spinner_c7A9.end"
                  attributeName="y"
                  dur="0.2s"
                  values="13;1"
                  fill="freeze"
                />
                <animate
                  id="spinner_vwnJ"
                  begin="spinner_Acnw.end"
                  attributeName="x"
                  dur="0.2s"
                  values="1;13"
                  fill="freeze"
                />
                <animate
                  id="spinner_KQuy"
                  begin="spinner_iIcm.end"
                  attributeName="y"
                  dur="0.2s"
                  values="1;13"
                  fill="freeze"
                />
                <animate
                  id="spinner_arKy"
                  begin="spinner_WX4U.end"
                  attributeName="x"
                  dur="0.2s"
                  values="13;1"
                  fill="freeze"
                />
              </rect>
              <rect x="13" y="13" rx="1" width="10" height="10">
                <animate
                  id="spinner_ZmWi"
                  begin="spinner_YLx7.end"
                  attributeName="x"
                  dur="0.2s"
                  values="13;1"
                  fill="freeze"
                />
                <animate
                  id="spinner_zfQN"
                  begin="spinner_vwnJ.end"
                  attributeName="y"
                  dur="0.2s"
                  values="13;1"
                  fill="freeze"
                />
                <animate
                  id="spinner_rRAc"
                  begin="spinner_KQuy.end"
                  attributeName="x"
                  dur="0.2s"
                  values="1;13"
                  fill="freeze"
                />
                <animate
                  id="spinner_23zP"
                  begin="spinner_arKy.end"
                  attributeName="y"
                  dur="0.2s"
                  values="1;13"
                  fill="freeze"
                />
              </rect>
            </svg>
          </div>
        </div>
        <media-controls class="media-controls">
          <!-- 进度条行 -->
          <div class="progress-row">
            <media-time-slider class="media-time-slider">
              <media-slider-track class="media-slider-track">
                <media-slider-buffer
                  class="media-slider-buffer"
                ></media-slider-buffer>
                <media-slider-fill
                  class="media-slider-fill"
                ></media-slider-fill>
              </media-slider-track>
              <media-slider-thumb
                class="media-slider-thumb"
              ></media-slider-thumb>
              <media-slider-value
                type="pointer"
                class="media-slider-value"
              ></media-slider-value>
            </media-time-slider>
          </div>

          <!-- 按钮行 -->
          <media-controls-group
            class="controls-group"
            aria-label="Playback controls"
          >
            <!-- 播放按钮 -->
            <media-play-button class="button media-play-button">
              <div class="paused">
                <img :src="iconPlay" alt="播放" />
              </div>
              <div class="playing">
                <img :src="iconPause" alt="暂停" />
              </div>
            </media-play-button>

            <!-- 时间显示 -->
            <div class="time-wrapper">
              <media-time class="time" type="current"></media-time>
              <div class="separator">/</div>
              <media-time class="time" type="duration"></media-time>
            </div>

            <!-- 右侧控件组 -->
            <div class="right-controls">
              <!-- 倍速选择器 -->
              <div
                class="playback-rate-wrapper"
                @mouseenter="onRateEnter"
                @mouseleave="onRateLeave"
              >
                <button class="rate-btn">
                  {{ hasSetRate ? currentRate + 'x' : '倍速' }}
                </button>
                <div class="rate-menu" :class="{ visible: showRateMenu }">
                  <button
                    v-for="rate in rates"
                    :key="rate"
                    class="rate-item"
                    :class="{ active: currentRate === rate }"
                    @click="selectRate(rate)"
                  >
                    {{ rate }}x
                  </button>
                </div>
              </div>

              <!-- 静音按钮 -->
              <div
                class="volume-wrapper"
                @mouseenter="onVolumeEnter"
                @mouseleave="onVolumeLeave"
              >
                <div class="volume-popup" :class="{ visible: showVolume }">
                  <media-volume-slider
                    orientation="vertical"
                    class="media-volume-slider-vertical"
                  >
                    <div class="vvs-value">{{ volumeDisplay }}</div>
                    <media-volume-slider-track class="vvs-track">
                      <media-volume-slider-indicator
                        class="vvs-indicator"
                      ></media-volume-slider-indicator>
                    </media-volume-slider-track>
                    <media-volume-slider-thumb
                      class="vvs-thumb"
                    ></media-volume-slider-thumb>
                  </media-volume-slider>
                </div>
                <media-mute-button class="media-mute-button">
                  <div class="muted">
                    <img :src="iconUnmute" alt="取消静音" />
                  </div>
                  <div class="unmuted">
                    <img :src="iconMute" alt="静音" />
                  </div>
                </media-mute-button>
              </div>

              <!-- 画中画按钮 -->
              <media-pip-button
                class="media-pip-button"
                commandfor="tooltip-pip"
              >
                <div class="pip">
                  <img :src="iconExitPip" alt="退出画中画" />
                </div>
                <div class="not-pip">
                  <img :src="iconEnterPip" alt="画中画" />
                </div>
              </media-pip-button>

              <!-- 全屏按钮 -->
              <media-fullscreen-button
                class="media-fullscreen-button"
                commandfor="tooltip-fullscreen"
              >
                <div class="fullscreen">
                  <img :src="iconExitFullscreen" alt="退出全屏" />
                </div>
                <div class="not-fullscreen">
                  <img :src="iconFullscreen" alt="全屏" />
                </div>
              </media-fullscreen-button>
            </div>
          </media-controls-group>
        </media-controls>
      </media-container>
    </video-player>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import '@videojs/html/video/player';
import '@videojs/html/ui/buffering-indicator';
import '@videojs/html/ui/time-slider';
import '@videojs/html/video/skin';
import '@videojs/html/ui/slider';
import '@videojs/html/ui/tooltip';
import '@videojs/html/ui/volume-slider';
import '@videojs/html/ui/popover';

// 图标导入
import iconPlay from './icons/icon_play.svg?url';
import iconPause from './icons/icon_pause.svg?url';
import iconMute from './icons/icon_mute.svg?url';
import iconUnmute from './icons/icon_unmute.svg?url';
import iconEnterPip from './icons/icon_enter_pip.svg?url';
import iconExitPip from './icons/icon_exit_pip.svg?url';
import iconFullscreen from './icons/icon_fullscreen.svg?url';
import iconExitFullscreen from './icons/icon_exit_fullscreen.svg?url';

const props = defineProps<{
  src: string;
  poster?: string;
}>();

const showPauseOverlay = ref(false);
const showVolume = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const containerRef = ref<HTMLElement | null>(null);
const volumeDisplay = ref(100);
const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
const currentRate = ref(1.0);
const showRateMenu = ref(false);
const hasSetRate = ref(false);
const isVideoLoading = ref(true);
let hideTimer: ReturnType<typeof setTimeout> | null = null;
let rateHideTimer: ReturnType<typeof setTimeout> | null = null;

const togglePlay = () => {
  const video = videoRef.value;
  if (!video) return;
  video.paused ? video.play() : video.pause();
};

const handleVideoSeeked = () => {
  const video = videoRef.value;
  if (!video) return;
  if (video.paused) {
    video.play();
    showPauseOverlay.value = false;
  }
};

const selectRate = (rate: number) => {
  currentRate.value = rate;
  hasSetRate.value = true;
  showRateMenu.value = false;
  if (videoRef.value) {
    videoRef.value.playbackRate = rate;
  }
};

const onVolumeEnter = () => {
  if (hideTimer) {
    clearTimeout(hideTimer);
    hideTimer = null;
  }
  showVolume.value = true;
};

const onVolumeLeave = () => {
  hideTimer = setTimeout(() => {
    showVolume.value = false;
  }, 300);
};

const onRateEnter = () => {
  if (rateHideTimer) {
    clearTimeout(rateHideTimer);
    rateHideTimer = null;
  }
  showRateMenu.value = true;
};

const onRateLeave = () => {
  rateHideTimer = setTimeout(() => {
    showRateMenu.value = false;
  }, 300);
};

const handleVolumeChange = () => {
  const video = videoRef.value;
  if (!video) return;
  if (video.muted) {
    volumeDisplay.value = 0;
  } else {
    volumeDisplay.value = Math.round(video.volume * 100);
  }
};

const handleClickOutside = (e: MouseEvent) => {
  const wrapper = document.querySelector('.playback-rate-wrapper');
  if (wrapper && !wrapper.contains(e.target as Node)) {
    showRateMenu.value = false;
  }
};

const handlePause = () => {
  showPauseOverlay.value = true;
};

const handlePlay = () => {
  showPauseOverlay.value = false;
};

const handleCanPlay = () => {
  isVideoLoading.value = false;
  const video = videoRef.value;
  if (video && video.paused) {
    showPauseOverlay.value = true;
  }
};

const handleWaiting = () => {
  isVideoLoading.value = true;
};

const handlePlaying = () => {
  isVideoLoading.value = false;
};

const handleLoadedMetadata = async () => {
  const video = videoRef.value;
  if (!video) return;
  try {
    await video.play();
    showPauseOverlay.value = false;
  } catch (e) {
    showPauseOverlay.value = true;
  }
};

onMounted(() => {
  const video = videoRef.value;
  if (!video) return;
  volumeDisplay.value = video.muted ? 0 : Math.round(video.volume * 100);
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style lang="scss" scoped>
@use './skin/ao-skin.css' as *;

.player-container {
  width: 100%;
}

video {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}

img {
  width: 20px;
  height: 20px;
  object-fit: cover;
}

.video-player,
.video-player media-container {
  display: block;
  position: relative;
  background-color: black;
}
</style>
