<template>
  <div class="md-catalog">
    <MdCatalog :editor-id="editorId" v-bind="$attrs" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { MdCatalog } from 'md-editor-v3';

defineProps<{
  editorId: string;
}>();
</script>

<style scoped lang="scss">
.md-catalog {
  width: 100%;
  display: flex;
  padding: 0 10px;
  gap: 20px;

  :deep(.md-editor-catalog) {
    padding: 0 10px;
  }
}
</style>
