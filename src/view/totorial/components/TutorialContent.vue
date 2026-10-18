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

  :deep(.md-editor-preview.smart-blue-theme) {
    --md-theme-heading-color: var(--ao-color-primary);
    --md-theme-link-color: var(--ao-color-primary);

    strong,
    em strong {
      color: var(--ao-color-primary);
    }
  }
}
</style>
