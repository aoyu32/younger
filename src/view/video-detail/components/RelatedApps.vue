<template>
  <ul class="related-apps">
    <li
      v-for="item in data"
      :key="item.name"
      class="related-apps__item"
      @click="handleOpen(item)"
    >
      <img class="related-apps__icon" :src="item.icon" :alt="item.name" loading="lazy" />

      <div class="related-apps__info">
        <div class="related-apps__head">
          <span class="related-apps__name">{{ item.name }}</span>
          <span class="related-apps__category">{{ item.category }}</span>
        </div>
        <p class="related-apps__desc">{{ item.description }}</p>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { RelatedAppItem } from '@/mock/videoRelated';

defineOptions({ name: 'RelatedApps' });

defineProps<{
  /** 相关应用 / 相关网站列表，结构一致，由 external 决定跳转方式 */
  data: RelatedAppItem[];
}>();

const router = useRouter();

const handleOpen = (item: RelatedAppItem) => {
  if (item.external) {
    window.open(item.link, '_blank', 'noopener');
  } else {
    router.push(item.link);
  }
};
</script>

<style lang="scss" scoped>
@use './RelatedApps.scss' as *;
</style>
