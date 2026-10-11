<template>
  <div class="my-purchases">
    <div class="purchases-grid">
      <MyPurchasesCard v-for="item in pagedList" :key="item.id" :item="item" />
    </div>

    <div class="purchases-pagination">
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
  padding: 20px 20px 0;
  box-sizing: border-box;
}

.purchases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px 15px;
}

.purchases-pagination {
  display: flex;
  justify-content: center;
}
</style>
