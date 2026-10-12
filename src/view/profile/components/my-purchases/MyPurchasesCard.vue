<template>
  <div class="my-purchases-card">
    <!-- 封面 -->
    <div class="card-cover">
      <img
        :src="item.cover"
        :alt="item.title"
        loading="lazy"
        @error="handleImgError"
      />
    </div>

    <p class="card-title" :title="item.title">{{ item.title }}</p>

    <div class="card-footer">
      <span class="footer-date">
        <span class="footer-date__label">购买日期</span>
        {{ item.purchaseDate }}
      </span>
      <span class="footer-price">￥{{ item.price.toFixed(2) }}</span>
    </div>
  </div>
</template>

<script lang="ts">
export interface PurchaseItem {
  id: number;
  cover: string;
  title: string;
  purchaseDate: string;
  price: number;
}
</script>

<script setup lang="ts">
import emptyCover from '@/assets/images/icon_empty_img.svg?url';

defineOptions({ name: 'MyPurchasesCard' });

const props = defineProps<{ item: PurchaseItem }>();

/** 封面加载失败兜底 */
function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement;
  if (!img || img.src === emptyCover) return;
  img.src = emptyCover;
}
</script>

<style scoped lang="scss">
.my-purchases-card {
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

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--ao-shadow-md);

    .card-cover img {
      transform: scale(1.04);
    }
  }

  .card-cover {
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
    font-size: var(--ao-font-size-sm);
    line-height: var(--ao-line-height-base);
    color: var(--ao-color-text-base);
    min-height: 2lh;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 底部信息贴底对齐，保证 grid 内不同标题高度的卡片整齐 */
  .card-footer {
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ao-spacing-xs);
    padding: var(--ao-spacing-xs) var(--ao-spacing-sm);

    .footer-date {
      min-width: 0;
      font-size: var(--ao-font-size-xs);
      color: var(--ao-color-text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &__label {
        margin-right: var(--ao-spacing-xxs);
        color: var(--ao-color-text-tertiary);
      }
    }

    .footer-price {
      flex-shrink: 0;
      font-size: var(--ao-font-size-sm);
      font-weight: var(--ao-font-weight-medium);
      color: var(--ao-color-error);
      font-variant-numeric: tabular-nums;
    }
  }
}
</style>
