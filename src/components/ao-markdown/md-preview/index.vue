<template>
  <MdPreview
    :model-value="content"
    :editor-id="editorId"
    :preview-theme="previewTheme"
    v-bind="$attrs"
    @get-catalog="handleGetCatalog"
  />
</template>

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const emit = defineEmits(['get-catalog']);

withDefaults(
  defineProps<{
    content: string | undefined;
    editorId: string;
    /** 预览主题，默认 smart-blue；个别页面可通过 previewProps 传 previewTheme 覆盖 */
    previewTheme?: string;
  }>(),
  {
    previewTheme: 'smart-blue',
  },
);

const handleGetCatalog = (catalog: any) => {
  emit('get-catalog', catalog);
};
</script>

<style lang="scss">
.ao-markdown-wrapper .md-editor-preview .md-editor-code .md-editor-code-head {
  z-index: 1;
}
</style>
