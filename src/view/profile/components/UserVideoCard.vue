<template>
  <div
    class="user-video-card"
    :class="{ 'is-batch': batchMode }"
    @click="handleCardClick"
  >
    <div class="card-cover">
      <img
        :src="item.cover"
        :alt="item.title"
        loading="lazy"
        @error="handleImgError"
      />
      <!-- 批量管理：右上角勾选框（纯展示，勾选由整卡点击触发） -->
      <div v-if="batchMode" class="card-check" :class="{ 'is-checked': selected }">
        <img :src="checkIcon" alt="" />
      </div>
      <!-- 封面右下角：当前观看进度 -->
      <span class="cover-progress">{{ progressText }}</span>
    </div>

    <div class="card-body">
      <p class="card-title" :title="item.title">{{ item.title }}</p>
      <div class="card-meta">
        <span class="meta-time">{{ timeText }}</span>
        <button type="button" class="meta-delete" @click.stop="handleDelete">
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
/** 单条观看历史 */
export interface VideoHistoryItem {
  id: string;
  cover: string;
  title: string;
  watched: number;
  duration: number;
  watchedAt: number;
}
</script>

<script setup lang="ts">
import { computed } from 'vue';
import emptyCover from '@/assets/images/icon_empty_img.svg?url';
import checkIcon from '@/assets/profile/icon_check.svg?url';

defineOptions({ name: 'UserVideoCard' });

interface Props {
  item: VideoHistoryItem;
  /** 批量管理模式：开启后展示右上角勾选框 */
  batchMode?: boolean;
  /** 批量管理模式下是否已勾选 */
  selected?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  delete: [item: VideoHistoryItem];
  select: [item: VideoHistoryItem];
}>();

/** 秒 → mm:ss，超过一小时为 h:mm:ss */
function formatDuration(seconds: number) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const hour = Math.floor(total / 3600);
  const minute = Math.floor((total % 3600) / 60);
  const second = total % 60;
  const pad = (num: number) => String(num).padStart(2, '0');
  return hour > 0
    ? `${hour}:${pad(minute)}:${pad(second)}`
    : `${pad(minute)}:${pad(second)}`;
}

const progressText = computed(
  () =>
    `${formatDuration(props.item.watched)}/${formatDuration(props.item.duration)}`,
);

const timeText = computed(() => {
  const date = new Date(props.item.watchedAt);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;

  const today = new Date();
  const startOfToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  ).getTime();
  const startOfDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  ).getTime();
  const dayDiff = Math.round((startOfToday - startOfDate) / 86400000);

  if (dayDiff <= 0) return `今天 ${time}`;
  if (dayDiff === 1) return `昨天 ${time}`;
  return `${date.getMonth() + 1}月${date.getDate()}日 ${time}`;
});

function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement;
  if (!img || img.src === emptyCover) return;
  img.src = emptyCover;
}

function handleDelete() {
  emit('delete', props.item);
}

/** 批量管理模式下点击整卡 = 切换勾选 */
function handleCardClick() {
  if (!props.batchMode) return;
  emit('select', props.item);
}
</script>

<style scoped lang="scss">
.user-video-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-color-bg-container);
  transition:
    transform var(--ao-duration-base) var(--ao-ease-out),
    box-shadow var(--ao-duration-base) var(--ao-ease-out);

  /* 批量管理模式下整卡可点击勾选 */
  &.is-batch {
    cursor: pointer;
  }

  .card-cover {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    background-color: var(--ao-color-bg-layout);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--ao-duration-base) var(--ao-ease-out);
    }

    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 30px;
      background: linear-gradient(
        to top,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      pointer-events: none;
      z-index: 1;
    }
  }

  &:hover .card-cover img {
    transform: scale(1.04);
  }

  .cover-progress {
    position: absolute;
    right: var(--ao-spacing-xxs);
    bottom: var(--ao-spacing-xxs);
    z-index: 2;
    padding: 2px 4px;
    font-size: var(--ao-font-size-xs);
    color: var(--ao-gray-0);
    font-variant-numeric: tabular-nums;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .card-body {
    display: flex;
    flex-direction: column;
    gap: var(--ao-spacing-xs);
    padding: var(--ao-spacing-xs) var(--ao-spacing-sm) var(--ao-spacing-sm);
  }

  .card-title {
    margin: 0;
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-normal);
    line-height: var(--ao-line-height-base);
    color: var(--ao-color-text-base);
    min-height: 2lh;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ao-spacing-xs);
  }

  .meta-time {
    min-width: 0;
    font-size: var(--ao-font-size-xs);
    color: var(--ao-color-text-tertiary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta-delete {
    flex-shrink: 0;
    padding: 0;
    border: none;
    background: none;
    font-size: var(--ao-font-size-xs);
    color: var(--ao-color-text-tertiary);
    cursor: pointer;
    transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:hover {
      color: var(--ao-color-error);
    }
  }
}

/* 批量管理：封面右上角勾选框 */
.card-check {
  position: absolute;
  top: var(--ao-spacing-xs);
  right: var(--ao-spacing-xs);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  border: 1px solid var(--ao-gray-0);
  border-radius: var(--ao-border-radius-sm);
  background-color: rgba(0, 0, 0, 0.35);
  transition:
    background-color var(--ao-duration-fast) var(--ao-ease-in-out),
    border-color var(--ao-duration-fast) var(--ao-ease-in-out);

  img {
    width: 14px;
    height: 14px;
    opacity: 0;
    transition: opacity var(--ao-duration-fast) var(--ao-ease-in-out);
  }

  &.is-checked {
    border-color: var(--ao-color-primary);
    background-color: var(--ao-color-primary);

    img {
      opacity: 1;
    }
  }
}
</style>
