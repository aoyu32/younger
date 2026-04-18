<template>
  <div class="video-card">
    <div class="card_cover">
      <img :src="video.cover" :alt="video.title" @error="handleImgError" />
    </div>
    <div class="card_info">
      <div class="info_title">
        <span>{{ video.title }}</span>
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

<script setup>
import { computed } from 'vue'

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=60'

defineOptions({
  name: 'VideoCard'
})

const props = defineProps({
  video: {
    type: Object,
    default: () => ({
      id: 0,
      title: '',
      cover: '',
      playCount: 0,
      date: ''
    })
  }
})

const playText = computed(() => {
  const num = Number(props.video.playCount || 0)
  if (num >= 10000) return `${(num / 10000).toFixed(1)}万播放`
  return `${num}播放`
})

const dateText = computed(() => {
  return props.video.date || ''
})

const handleImgError = (e) => {
  if (!e || !e.target) return
  if (e.target.src === FALLBACK_COVER) return
  e.target.src = FALLBACK_COVER
}
</script>

<style scoped lang="scss">
.video-card {
  display: flex;
  flex-direction: column;
  height: 100%; // 确保卡片填满 grid item
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8f9fa; /* light theme c-g0 */
  border: 1px solid #dee2e6; /* light theme c-g2 */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15); /* small shadow */
  transition: 0.18s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15); /* medium shadow */
  }

  .card_cover {
    width: 100%;
    height: 135px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: 0.25s;
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
    font-size: 14px;
    line-height: 1.35;
    color: #1a1e21; /* light theme c-g9 */
    opacity: 0.85; /* color(c-g9, 0.85) */

    // 两行省略
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
      font-size: 12px;
      color: #1a1e21; /* light theme c-g9 */
      opacity: 0.45; /* color(c-g9, 0.45) */
    }

    .bottom_date {
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 999px;
      background-color: #dee2e6; /* light theme c-g2 */
      color: #495057; /* light theme c-g6 */
      opacity: 0.5; /* color(c-g6, 0.5) */
    }
  }
}
</style>