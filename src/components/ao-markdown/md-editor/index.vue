<template>
  <MdEditor
    :model-value="modelValue"
    @update:model-value="emitUpdate"
    :editor-id="editorId"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { MdEditor } from 'md-editor-v3';
const props = defineProps<{
  modelValue: string;
  editorId: string;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
const emitUpdate = (val: string) => emit('update:modelValue', val);
</script>
