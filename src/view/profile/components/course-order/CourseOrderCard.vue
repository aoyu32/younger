<template>
  <div class="course-order-card">
    <!-- 左：视频封面 -->
    <div class="cover">
      <img
        :src="order.cover"
        :alt="order.title"
        loading="lazy"
        @error="handleImgError"
      />
    </div>

    <!-- 中：视频标题 + 订单详情 -->
    <div class="main">
      <p class="title" :title="order.title">{{ order.title }}</p>

      <div class="details">
        <div class="detail-item">
          <span class="label">订单号</span>
          <span class="value" :title="order.orderNo">{{ order.orderNo }}</span>
        </div>
        <div class="detail-item">
          <span class="label">购买时间</span>
          <span class="value">{{ order.purchaseTime }}</span>
        </div>
        <div class="detail-item">
          <span class="label">有效期</span>
          <span class="value">{{ order.validPeriod }}</span>
        </div>
        <div class="detail-item">
          <span class="label">支付方式</span>
          <span class="value pay-value">
            <img v-if="payIcon" :src="payIcon" class="pay-icon" alt="" />
            {{ order.payMethod }}
          </span>
        </div>
      </div>
    </div>

    <!-- 右：实付金额 -->
    <div class="amount">
      <span class="amount-symbol">¥</span>
      <span class="amount-value">{{ order.amount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 购买课程订单卡片
 * 展示单条课程订单：视频封面、视频标题、订单号、购买时间、有效期、支付方式、实付金额。
 * 布局：无边框，仅用下边框分隔；左侧封面 + 中部标题与四字段详情 + 右侧金额。
 * @author LiangQiYang
 * @date 2026-10-15
 */
import aliPayIcon from '@/assets/pay/icon_ali_pay.svg?url';
import wechatPayIcon from '@/assets/pay/icon_wechat_pay.svg?url';
import emptyCover from '@/assets/images/icon_empty_img.svg?url';

defineOptions({ name: 'CourseOrderCard' });

export interface CourseOrder {
  id: number;
  /** 视频封面地址 */
  cover: string;
  /** 视频标题 */
  title: string;
  /** 订单号 */
  orderNo: string;
  /** 购买时间（yyyy-MM-dd HH:mm） */
  purchaseTime: string;
  /** 有效期，如「永久」 */
  validPeriod: string;
  /** 支付方式，如「微信支付」 */
  payMethod: string;
  /** 实付金额（元），字符串以保留两位小数 */
  amount: string;
}

const props = defineProps<{
  /** 订单数据 */
  order: CourseOrder;
}>();

/** 支付方式 → 图标 */
const PAY_ICONS: Record<string, string> = {
  支付宝: aliPayIcon,
  微信支付: wechatPayIcon,
};

const payIcon = PAY_ICONS[props.order.payMethod];

/** 封面加载失败兜底 */
function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement;
  if (!img || img.src === emptyCover) return;
  img.src = emptyCover;
}
</script>

<style scoped lang="scss">
.course-order-card {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-lg);
  /* 不画整卡边框，仅用下边框分隔列表项；最后一张由 :last-child 收尾 */
  padding: var(--ao-spacing-lg) 0;
  border-bottom: var(--ao-border-width-thin) solid var(--ao-color-divider);
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }
}

/* ========== 左：视频封面 ========== */
.cover {
  flex-shrink: 0;
  width: 132px;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--ao-border-radius-base);
  background-color: var(--ao-color-bg-layout);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

/* ========== 中：标题 + 订单详情 ========== */
.main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-sm);

  /* 标题单行展示，超长省略（悬停可看完整标题） */
  .title {
    margin: 0;
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-medium);
    line-height: var(--ao-line-height-tight);
    color: var(--ao-color-text-base);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .details {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--ao-spacing-xs) var(--ao-spacing-md);

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 0;
    }

    .label {
      font-size: var(--ao-font-size-xs);
      line-height: var(--ao-line-height-tight);
      color: var(--ao-color-text-tertiary);
      white-space: nowrap;
    }

    .value {
      font-size: var(--ao-font-size-sm);
      line-height: var(--ao-line-height-tight);
      color: var(--ao-color-text-base);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* 支付方式：图标 + 文字 */
    .pay-value {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
    }

    .pay-icon {
      flex-shrink: 0;
      width: 14px;
      height: 14px;
    }
  }
}

/* ========== 右：实付金额 ========== */
.amount {
  flex-shrink: 0;
  text-align: right;
  white-space: nowrap;

  /* 金额取电商常用价格色 */
  .amount-symbol {
    margin-right: 2px;
    font-size: var(--ao-font-size-sm);
    color: var(--ao-color-error);
  }

  .amount-value {
    font-size: var(--ao-font-size-xl);
    font-weight: var(--ao-font-weight-semibold);
    line-height: var(--ao-line-height-tight);
    color: var(--ao-color-error);
    font-variant-numeric: tabular-nums;
  }
}

/* 窄容器：详情降为两列，封面与金额保持原尺寸 */
@media (max-width: 900px) {
  .course-order-card {
    gap: var(--ao-spacing-md);
  }

  .details {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
