<template>
  <div
    class="video-collect-card"
    :class="{ 'is-batch': batchMode }"
    @click="handleCardClick"
  >
    <!-- 封面 -->
    <div class="card-cover">
      <img
        :src="item.cover"
        :alt="item.title"
        loading="lazy"
        @error="handleImgError"
      />
      <div
        v-if="batchMode"
        class="card-check"
        :class="{ 'is-checked': selected }"
      >
        <img :src="checkIcon" alt="" />
      </div>
    </div>

    <!-- 标题 -->
    <p class="card-title" :title="item.title">{{ item.title }}</p>

    <!-- 底部：左收藏日期，右取消收藏 -->
    <div class="card-footer">
      <span class="footer-collect">收藏于{{ item.collectDate }}</span>
      <button type="button" class="footer-cancel" @click.stop="handleCancel">
        取消收藏
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export interface VideoCollectItem {
  id: number;
  cover: string;
  title: string;
  collectDate: string;
}
</script>

<script setup lang="ts">
import emptyCover from '@/assets/images/icon_empty_img.svg?url';
import checkIcon from '@/assets/profile/icon_check.svg?url';

defineOptions({ name: 'VideoCollectCard' });

interface Props {
  item: VideoCollectItem;
  /** 批量管理模式：开启后展示右上角勾选框 */
  batchMode?: boolean;
  /** 批量管理模式下是否已勾选 */
  selected?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  cancel: [item: VideoCollectItem];
  select: [item: VideoCollectItem];
}>();

/** 封面加载失败兜底 */
function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement;
  if (!img || img.src === emptyCover) return;
  img.src = emptyCover;
}

function handleCancel() {
  emit('cancel', props.item);
}

/** 批量管理模式下点击整卡 = 切换勾选 */
function handleCardClick() {
  if (!props.batchMode) return;
  emit('select', props.item);
}
</script>

<style scoped lang="scss">
.video-collect-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-color-bg-container);
  transition:
    transform var(--ao-duration-base) var(--ao-ease-out),
    box-shadow var(--ao-duration-base) var(--ao-ease-out);

  /* 批量管理模式下整卡可点击勾选 */
  &.is-batch {
    cursor: pointer;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--ao-shadow-md);

    .card-cover img {
      transform: scale(1.04);
    }
  }

  .card-cover {
    /* 勾选框的定位基准，勿删 */
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    /* 限制封面高度：宽卡片时整体更紧凑 */
    max-height: 112px;
    overflow: hidden;
    background-color: var(--ao-color-bg-layout);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform var(--ao-duration-base) var(--ao-ease-out);
    }
  }

  .card-title {
    margin: 0;
    padding: var(--ao-spacing-xs) var(--ao-spacing-sm) 0;
    font-size: 13px;
    line-height: var(--ao-line-height-base);
    color: var(--ao-color-text-base);
    min-height: 2lh;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ao-spacing-xs);
    padding: var(--ao-spacing-xs) var(--ao-spacing-sm);

    .footer-collect {
      min-width: 0;
      font-size: var(--ao-font-size-xs);
      color: var(--ao-color-text-tertiary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .footer-cancel {
      flex-shrink: 0;
      padding: 0;
      border: none;
      background: none;
      font-size: var(--ao-font-size-xs);
      color: var(--ao-color-text-tertiary);
      cursor: pointer;
      white-space: nowrap;
      transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

      &:hover {
        color: var(--ao-color-error);
      }
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
