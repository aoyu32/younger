<template>
  <aside class="tutorial-toc">
    <div class="toc-header">
      <div class="title">目录</div>
    </div>
    <AoScrollbar class="toc-scroll" always>
      <NewsCatalog :data="{ catalogs: catalog, offsetTop: offsetTop }" />
    </AoScrollbar>
  </aside>
</template>

<script setup lang="ts">
import AoScrollbar from '@/components/ao-scrollbar/index.vue';
import NewsCatalog from '@/view/news-detail/components/NewsCatalog.vue';
import type { TutorialCatalogItem } from '../types';

defineOptions({
  name: 'TutorialToc',
});

withDefaults(
  defineProps<{
    catalog: TutorialCatalogItem[];
    offsetTop?: number;
  }>(),
  {
    offsetTop: 76,
  },
);
</script>

<style lang="scss" scoped>
.tutorial-toc {
  flex: 1 1 auto;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  background-color: var(--ao-color-bg-layout);
}

.toc-header {
  flex: none;
  padding: 14px 16px;
  background-color: var(--ao-gray-3);
  border-bottom: 1px solid var(--ao-gray-4);

  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: var(--ao-color-text-base);
  }
}

.toc-scroll {
  flex: 1;
  min-height: 0;
  padding: 12px 20px 20px;

  :deep(.ao-scrollbar__bar) {
    width: 4px;
  }

  :deep(.ao-scrollbar__wrap) {
    overscroll-behavior: contain;
  }
}
</style>
