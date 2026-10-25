<template>
  <section class="tutorial-content">
    <h1 v-if="title" class="content-title">{{ title }}</h1>
    <div class="content-body">
      <AoMarkdown
        mode="preview"
        :content="content"
        :editor-id="editorId"
        :preview-props="{ previewTheme }"
        @get-catalog="emit('get-catalog', $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import AoMarkdown from '@/components/ao-markdown/index.vue';
import type { TutorialCatalogItem } from '../types';

defineOptions({
  name: 'TutorialContent',
});

withDefaults(
  defineProps<{
    content: string;
    title?: string;
    editorId: string;
    previewTheme?: string;
  }>(),
  {
    title: '',
    previewTheme: 'smart-blue',
  },
);

const emit = defineEmits<{
  'get-catalog': [catalog: TutorialCatalogItem[]];
}>();
</script>

<style lang="scss" scoped>
.tutorial-content {
  padding: 30px;
  background-color: var(--ao-color-bg-layout);
}

.content-title {
  margin-bottom: 20px;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--ao-color-text-base);
}

.content-body {
  :deep(.md-editor-preview-wrapper) {
    padding: 0;
  }

  /* 代码块内部横向滚动，长代码行不再把内容区撑出横向滚动 */
  :deep(.md-editor-preview pre) {
    overflow-x: auto;
  }

  :deep(.md-editor-preview.smart-blue-theme) {
    --md-theme-heading-color: var(--ao-color-primary);
    --md-theme-link-color: var(--ao-color-primary);

    strong,
    em strong {
      color: var(--ao-color-primary);
    }
  }
}

/* ≤768（移动端）：内边距与标题字号收紧；正文图片防溢出 */
@media (max-width: 768px) {
  .tutorial-content {
    padding: 20px 16px;
  }

  .content-title {
    margin-bottom: 14px;
    font-size: 1.35rem;
  }

  .content-body {
    :deep(.md-editor-preview) {
      img {
        max-width: 100%;
      }
    }
  }
}
</style>
