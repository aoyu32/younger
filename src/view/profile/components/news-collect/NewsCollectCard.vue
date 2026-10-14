<template>
  <div class="news-collect-card" @click="handleClick">
    <div v-if="item.cover" class="cover-img">
      <img :src="item.cover" :alt="item.title || ''" />
    </div>

    <div class="content">
      <div class="title" :class="{ 'is-empty': !item.title }">
        {{ item.title || '' }}
      </div>
      <div class="content-part">
        {{ item.content || '' }}
      </div>

      <div class="meta">
        <span class="collect-date">收藏于{{ item.collectDate }}</span>
        <!-- 批量管理：右侧复选框替代取消收藏按钮 -->
        <button
          v-if="batchMode"
          type="button"
          class="collect-check"
          :class="{ 'is-checked': selected }"
          :aria-label="selected ? '取消勾选' : '勾选'"
          @click.stop="handleSelect"
        >
          <img :src="checkIcon" alt="" />
        </button>
        <button
          v-else
          type="button"
          class="cancel-btn"
          @click.stop="handleCancel"
        >
          取消收藏
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import checkIcon from '@/assets/profile/icon_check.svg?url';

defineOptions({ name: 'NewsCollectCard' });

export interface NewsCollectItem {
  id: string | number;
  title?: string;
  content?: string;
  cover?: string;
  /** 收藏日期展示文本，如「10月8日」 */
  collectDate: string;
}

const props = defineProps<{
  item: NewsCollectItem;
  /** 批量管理模式：开启后右侧显示复选框，整卡点击切换勾选 */
  batchMode?: boolean;
  /** 批量管理模式下是否已勾选 */
  selected?: boolean;
}>();

const emit = defineEmits<{
  click: [id: string | number];
  cancel: [item: NewsCollectItem];
  select: [item: NewsCollectItem];
}>();

/** 卡片点击：批量管理模式下为切换勾选，否则打开详情 */
function handleClick() {
  if (props.batchMode) {
    emit('select', props.item);
    return;
  }
  emit('click', props.item.id);
}

function handleCancel() {
  emit('cancel', props.item);
}

function handleSelect() {
  emit('select', props.item);
}
</script>

<style scoped lang="scss">
/* 卡片样式与资讯页的 NewsCard 保持一致，仅 meta 行改为
   「左：收藏日期 / 右：取消收藏（批量管理时为复选框）」 */
.news-collect-card {
  position: relative;
  display: flex;
  gap: 12px;
  padding: 12px;
  background: var(--ao-color-bg-container);
  border: 1px solid var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
  cursor: pointer;
  box-sizing: border-box;
  overflow: hidden;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.15s ease;

  &:hover {
    border-color: color-mix(
      in srgb,
      var(--ao-lime-6) 45%,
      var(--ao-color-border)
    );
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    transform: translateY(-1px);

    .cover-img img {
      transform: scale(1.04);
    }

    .title {
      color: var(--ao-lime-6);
    }
  }

  .cover-img {
    flex-shrink: 0;
    width: 120px;
    height: 100%;
    border-radius: var(--ao-border-radius-sm);
    overflow: hidden;
    background: var(--ao-gray-4);

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
  }

  .content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .title {
    font-size: 14px;
    font-weight: var(--ao-font-weight-semibold);
    line-height: 1.4;
    color: var(--ao-color-text-base);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-shrink: 0;
    transition: color 0.15s ease;
    margin-bottom: 2px;

    &.is-empty {
      visibility: hidden;
    }
  }

  .content-part {
    font-size: 12px;
    line-height: 1.5;
    color: var(--ao-color-text-tertiary);
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    min-height: calc(1.5em * 2);
    flex-shrink: 0;
  }

  .meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    font-size: 11px;
    color: var(--ao-color-text-tertiary);
    flex-shrink: 0;
    margin-top: 8px;
    min-width: 0;

    .collect-date {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .cancel-btn {
      flex-shrink: 0;
      padding: 0;
      border: none;
      background: none;
      font-size: 11px;
      color: var(--ao-color-text-tertiary);
      cursor: pointer;
      white-space: nowrap;
      transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

      &:hover {
        color: var(--ao-color-error);
      }
    }
  }

  /* 批量管理复选框：绝对定位在右下角（meta 行右侧），
     不占流内高度避免被卡片 overflow 裁切；尺寸缩小到 16px */
  .collect-check {
    position: absolute;
    right: 12px;
    bottom: 12px;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    padding: 0;
    border: var(--ao-border-width-thin) solid var(--ao-gray-5);
    border-radius: var(--ao-border-radius-sm);
    background-color: var(--ao-gray-0);
    cursor: pointer;
    transition:
      background-color var(--ao-duration-fast) var(--ao-ease-in-out),
      border-color var(--ao-duration-fast) var(--ao-ease-in-out);

    img {
      width: 10px;
      height: 10px;
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
}
</style>
