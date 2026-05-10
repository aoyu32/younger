<template>
  <MdPreview
    :model-value="content"
    :editor-id="editorId"
    v-bind="$attrs"
    preview-theme="smart-blue"
    @get-catalog="handleGetCatalog"
  />
</template>

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

const emit = defineEmits(['get-catalog']);

defineProps<{
  content: string | undefined;
  editorId: string;
}>();

const handleGetCatalog = (catalog: any) => {
  emit('get-catalog', catalog);
};
</script>
<style lang="scss" scoped></style>
