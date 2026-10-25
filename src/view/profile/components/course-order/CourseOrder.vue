<template>
  <div class="course-order">
    <div v-if="orderList.length" class="course-order__list">
      <CourseOrderCard v-for="item in orderList" :key="item.id" :order="item" />
    </div>

    <!-- 空状态 -->
    <div v-else class="course-order__empty">
      <img :src="emptyIcon" alt="" />
      <p>没有购买课程的订单</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 购买课程订单页
 * 以一行一卡的形式展示课程购买订单列表，暂无批量管理需求。
 * @author LiangQiYang
 * @date 2026-10-15
 */
import { ref } from 'vue';
import CourseOrderCard from './CourseOrderCard.vue';
import type { CourseOrder } from './CourseOrderCard.vue';
import emptyIcon from '@/assets/website/icon_empty.svg?url';
import { categoryData } from '@/mock/videoLIst';

defineOptions({ name: 'CourseOrder' });

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** 取前 8 门课程作为订单数据（mock） */
const MOCK_ORDER_COUNT = 8;

/** 支付方式按序轮换，模拟真实订单 */
const PAY_METHODS = ['微信支付', '支付宝'];

const pad = (n: number) => String(n).padStart(2, '0');

/** 时间戳 → yyyy-MM-dd HH:mm */
const formatTime = (ts: number) => {
  const date = new Date(ts);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

/** 订单列表（mock，按购买时间倒序） */
const orderList = ref<CourseOrder[]>(
  categoryData
    .flatMap((category) => category.list)
    .slice(0, MOCK_ORDER_COUNT)
    .map((video, index) => {
      const purchaseTs = Date.now() - (index + 1) * MS_PER_DAY;
      const date = new Date(purchaseTs);
      const dateStr = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`;
      return {
        id: video.id,
        cover: video.video.cover,
        title: video.title,
        orderNo: `CO${dateStr}${String(index + 1).padStart(3, '0')}`,
        purchaseTime: formatTime(purchaseTs),
        validPeriod: '永久',
        payMethod: PAY_METHODS[index % PAY_METHODS.length],
        amount: (19.9 + (index % 5) * 20).toFixed(2),
      };
    }),
);
</script>

<style scoped lang="scss">
/* 滚动由 UserCenterTabs 的 content-body 滚动条统一处理 */
.course-order {
  display: flex;
  flex-direction: column;
  /* 与历史记录页保持一致 */
  padding: 20px;
  box-sizing: border-box;
}

/* 一行一个单独展示；卡片间用下边框分隔，不需要额外间距 */
.course-order__list {
  display: flex;
  flex-direction: column;
  padding-bottom: 20px;
}

/* 移动端：收窄容器内边距，给订单卡片让出内容宽度 */
@media (max-width: 768px) {
  .course-order {
    padding: var(--ao-spacing-sm) var(--ao-spacing-md);
  }

  .course-order__list {
    padding-bottom: var(--ao-spacing-xs);
  }
}

/* 空状态：外层滚动容器（.ao-scrollbar）带有定位上下文，
   绝对定位铺满内容区，图标与文案整体居中 */
.course-order__empty {
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
