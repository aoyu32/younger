<template>
  <div class="vip-order">
    <div v-if="orderList.length" class="vip-order__list">
      <VipOrderCard v-for="item in orderList" :key="item.id" :order="item" />
    </div>

    <!-- 空状态 -->
    <div v-else class="vip-order__empty">
      <img :src="emptyIcon" alt="" />
      <p>没有会员订单</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 会员开通订单页
 * 以一行一卡的形式展示会员开通订单列表，暂无批量管理需求。
 * @author LiangQiYang
 * @date 2026-10-14
 */
import { ref } from 'vue';
import VipOrderCard, { type VipOrder } from './VipOrderCard.vue';
import emptyIcon from '@/assets/website/icon_empty.svg?url';

defineOptions({ name: 'VipOrder' });

/** 订单列表（mock，按开通时间倒序） */
const orderList = ref<VipOrder[]>([
  {
    id: 1,
    level: 'svip',
    orderNo: 'YO20261014001',
    payMethod: '微信支付',
    startTime: '2026-10-01 00:00',
    endTime: '2027-09-30 23:59',
    amount: '298.00',
  },
  {
    id: 2,
    level: 'vip',
    orderNo: 'YO20260922088',
    payMethod: '支付宝',
    startTime: '2026-09-22 10:31',
    endTime: '2026-10-22 10:31',
    amount: '29.90',
  },
  {
    id: 3,
    level: 'vip',
    orderNo: 'YO20260815034',
    payMethod: '微信支付',
    startTime: '2026-08-15 20:07',
    endTime: '2026-09-15 20:07',
    amount: '29.90',
  },
  {
    id: 4,
    level: 'svip',
    orderNo: 'YO20251001225',
    payMethod: '支付宝',
    startTime: '2025-10-01 00:00',
    endTime: '2026-09-30 23:59',
    amount: '268.00',
  },
]);
</script>

<style scoped lang="scss">
/* 滚动由 UserCenterTabs 的 content-body 滚动条统一处理 */
.vip-order {
  display: flex;
  flex-direction: column;
  /* 与历史记录页保持一致 */
  padding: 20px;
  box-sizing: border-box;
}

/* 一行一个单独展示；卡片间用下边框分隔，不需要额外间距 */
.vip-order__list {
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}

/* 空状态：外层滚动容器（.ao-scrollbar）带有定位上下文，
   绝对定位铺满内容区，图标与文案整体居中 */
.vip-order__empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ao-spacing-md);
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-tertiary);

  img {
    width: 64px;
    height: 64px;
  }

  p {
    margin: 0;
  }
}
</style>
