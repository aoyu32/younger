<template>
  <div class="vip-order-card">
    <!-- 左：产品信息（类型图标 + 产品名） -->
    <div class="product">
      <div class="product-icon" :class="'is-' + order.level">
        <img :src="levelIcon" :alt="productName" />
      </div>
      <div class="product-info">
        <div class="product-name">{{ productName }}</div>
        <div class="product-sub">{{ levelTag }} 会员服务</div>
      </div>
    </div>

    <!-- 中：订单详情（订单号 / 支付方式 / 开通时间 / 到期时间） -->
    <div class="details">
      <div class="detail-item">
        <span class="label">订单号</span>
        <span class="value" :title="order.orderNo">{{ order.orderNo }}</span>
      </div>
      <div class="detail-item">
        <span class="label">支付方式</span>
        <span class="value pay-value">
          <img v-if="payIcon" :src="payIcon" class="pay-icon" alt="" />
          {{ order.payMethod }}
        </span>
      </div>
      <div class="detail-item">
        <span class="label">开通时间</span>
        <span class="value">{{ order.startTime }}</span>
      </div>
      <div class="detail-item">
        <span class="label">到期时间</span>
        <span class="value">{{ order.endTime }}</span>
      </div>
    </div>

    <!-- 右：支付金额 -->
    <div class="amount">
      <span class="amount-symbol">¥</span>
      <span class="amount-value">{{ order.amount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 会员开通订单卡片
 * 展示单条会员订单：产品信息（尊贵月卡 / 至尊年卡）、订单号、支付方式、
 * 开通时间、到期时间、支付金额。
 * 布局：无边框，仅用下边框分隔；左侧产品标识 + 中部四字段详情 + 右侧金额。
 * @author LiangQiYang
 * @date 2026-10-14
 */
import aliPayIcon from '@/assets/pay/icon_ali_pay.svg?url';
import wechatPayIcon from '@/assets/pay/icon_wechat_pay.svg?url';
import vipIcon from '@/assets/vip/icon_vip.svg?url';
import svipIcon from '@/assets/vip/icon_svip.svg?url';

defineOptions({ name: 'VipOrderCard' });

export interface VipOrder {
  id: number;
  /** 产品类型：vip 尊贵月卡 / svip 至尊年卡 */
  level: 'vip' | 'svip';
  /** 订单号 */
  orderNo: string;
  /** 支付方式，如「微信支付」 */
  payMethod: string;
  /** 开通时间 */
  startTime: string;
  /** 到期时间 */
  endTime: string;
  /** 支付金额（元），字符串以保留两位小数 */
  amount: string;
}

const props = defineProps<{
  /** 订单数据 */
  order: VipOrder;
}>();

/** 产品类型 → 产品名 */
const PRODUCT_NAMES: Record<VipOrder['level'], string> = {
  vip: '尊贵月卡',
  svip: '至尊年卡',
};

/** 产品类型 → 图标（vip 青色 / svip 金色） */
const LEVEL_ICONS: Record<VipOrder['level'], string> = {
  vip: vipIcon,
  svip: svipIcon,
};

/** 支付方式 → 图标 */
const PAY_ICONS: Record<string, string> = {
  支付宝: aliPayIcon,
  微信支付: wechatPayIcon,
};

const productName = PRODUCT_NAMES[props.order.level];
const levelIcon = LEVEL_ICONS[props.order.level];
const payIcon = PAY_ICONS[props.order.payMethod];
/** 等级标识（VIP / SVIP），用于副标题的会员服务前缀 */
const levelTag = props.order.level.toUpperCase();
</script>

<style scoped lang="scss">
.vip-order-card {
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-lg);
  padding: var(--ao-spacing-lg) 0;
  border-bottom: var(--ao-border-width-thin) solid var(--ao-color-divider);
  box-sizing: border-box;

  &:last-child {
    border-bottom: none;
  }
}

/* ========== 左：产品信息 ========== */
.product {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--ao-spacing-sm);
  width: 160px;

  .product-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
    border: calc(var(--ao-border-width-thin) + 1px) solid transparent;
    border-radius: var(--ao-border-radius-base);
    background-origin: border-box;
    background-clip: padding-box, border-box;

    img {
      width: 24px;
      height: 24px;
    }

    /* VIP：青色渐变描边，自下而上，与月卡同色系 */
    &.is-vip {
      background-image:
        linear-gradient(var(--ao-color-bg-container), var(--ao-color-bg-container)),
        linear-gradient(to top, rgb(0, 176, 176), rgb(0, 216, 216));
    }

    /* SVIP：金色渐变描边，自下而上，与年卡同色系 */
    &.is-svip {
      background-image:
        linear-gradient(var(--ao-color-bg-container), var(--ao-color-bg-container)),
        linear-gradient(to top, rgb(233, 182, 75), rgb(249, 217, 118));
    }
  }

  .product-info {
    min-width: 0;
  }

  .product-name {
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-semibold);
    line-height: var(--ao-line-height-tight);
    color: var(--ao-color-text-base);
    white-space: nowrap;
  }

  .product-sub {
    margin-top: 8px;
    font-size: var(--ao-font-size-xs);
    line-height: var(--ao-line-height-tight);
    color: var(--ao-color-text-tertiary);
    white-space: nowrap;
  }
}

.details {
  flex: 1;
  min-width: 0;
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

/* ========== 右：支付金额 ========== */
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

/* 窄容器：详情降为两列，产品块收缩 */
@media (max-width: 900px) {
  .vip-order-card {
    flex-wrap: wrap;
    gap: var(--ao-spacing-sm) var(--ao-spacing-md);
  }

  .product {
    width: auto;
  }

  .details {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
