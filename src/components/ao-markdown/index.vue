<template>
  <div class="ao-markdown-wrapper">
    <!-- 编辑器模式 -->
    <MdEditorWrapper
      v-if="mode === 'editor'"
      :model-value="content"
      @update:model-value="handleUpdate"
      :editor-id="sharedEditorId"
      v-bind="editorProps"
    />

    <!-- 预览模式 -->
    <MdPreviewWrapper
      v-else-if="mode === 'preview'"
      :content="content"
      :editor-id="sharedEditorId"
      v-bind="previewProps"
      @get-catalog="handleGetCatalog"
    />

    <!-- 目录模式 -->
    <MdCatalogWrapper
      v-else-if="mode === 'catalog'"
      :editor-id="sharedEditorId"
      v-bind="catalogProps"
    />

    <!-- 组合：预览 + 目录 -->
    <div v-else-if="mode === 'preview-catalog'" class="preview-catalog-layout">
      <MdPreviewWrapper
        :content="content"
        :editor-id="sharedEditorId"
        v-bind="previewProps"
      />
      <MdCatalogWrapper :editor-id="sharedEditorId" v-bind="catalogProps" />
    </div>

    <!-- 组合：编辑器 + 目录 -->
    <div v-else-if="mode === 'editor-catalog'" class="editor-catalog-layout">
      <MdEditorWrapper
        :model-value="content"
        @update:model-value="handleUpdate"
        :editor-id="sharedEditorId"
        v-bind="editorProps"
      />
      <MdCatalogWrapper :editor-id="sharedEditorId" v-bind="catalogProps" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import MdEditorWrapper from './md-editor/index.vue';
import MdPreviewWrapper from './md-preview/index.vue';
import MdCatalogWrapper from './md-catalog/index.vue';

const props = withDefaults(
  defineProps<{
    mode:
      | 'editor'
      | 'preview'
      | 'catalog'
      | 'editor-catalog'
      | 'preview-catalog';
    content?: string;
    editorId?: string;
    height?: string;
    editorProps?: Record<string, any>;
    previewProps?: Record<string, any>;
    catalogProps?: Record<string, any>;
  }>(),
  {
    mode: 'preview',
    content: '',
  },
);

const emit = defineEmits<{
  (e: 'update:content', value: string): void;
  (e: 'get-catalog', catalog: any): void;
}>();

const handleGetCatalog = (catalog: any) => {
  emit('get-catalog', catalog);
};
const autoId = `md-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const sharedEditorId = computed(() => props.editorId || autoId);

const handleUpdate = (val: string) => {
  emit('update:content', val);
};
</script>

<style scoped lang="scss">
.ao-markdown-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.md-editor) {
  background-color: transparent;
}

.preview-catalog-layout,
.editor-catalog-layout {
  display: flex;
  gap: 20px;
  height: 100%;
}
</style>
