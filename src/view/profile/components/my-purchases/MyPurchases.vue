<template>
  <div class="my-purchases">
    <!-- 上：已购课程列表（grid 布局） -->
    <div v-if="purchaseList.length" class="purchases-grid">
      <MyPurchasesCard
        v-for="item in pagedList"
        :key="item.id"
        :item="item"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="purchases-empty">
      <img :src="emptyIcon" alt="" />
      <p>没有购买的课程</p>
    </div>

    <!-- 下：分页 -->
    <div v-if="purchaseList.length" class="purchases-pagination">
      <AoPagination
        v-model:current="current"
        :page-size="pageSize"
        :total="purchaseList.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MyPurchasesCard from './MyPurchasesCard.vue';
import type { PurchaseItem } from './MyPurchasesCard.vue';
import emptyIcon from '@/assets/website/icon_empty.svg?url';
import { categoryData } from '@/mock/videoLIst';

defineOptions({ name: 'MyPurchases' });

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const formatDate = (ts: number) => {
  const date = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const purchaseList = ref<PurchaseItem[]>(
  categoryData
    .flatMap((category) => category.list)
    .map((video, index) => ({
      id: video.id,
      cover: video.video.cover,
      title: video.title,
      purchaseDate: formatDate(Date.now() - (index + 1) * MS_PER_DAY),
      price: 19.9 + (index % 5) * 20,
    })),
);

const current = ref(1);
/** 每页 12 条 = 4 列 × 3 行 */
const pageSize = ref(12);

const pagedList = computed(() => {
  const start = (current.value - 1) * pageSize.value;
  return purchaseList.value.slice(start, start + pageSize.value);
});
</script>

<style scoped lang="scss">
.my-purchases {
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px 20px 20px;
  box-sizing: border-box;
}

.purchases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px 15px;

  /* 移动端：卡片至少两列 */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 空状态：外层滚动容器（.ao-scrollbar）带有定位上下文，
   绝对定位铺满内容区，图标与文案整体居中 */
.purchases-empty {
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

.purchases-pagination {
  display: flex;
  justify-content: center;
}
</style>
