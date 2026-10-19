<template>
  <AoDialog
    :modelValue="modelValue"
    title="添加收藏"
    width="460px"
    @update:modelValue="handleClose"
    @confirm="handleConfirm"
    @close="handleClose"
  >
    <div class="add-website-form">
      <div class="form-item">
        <AoFormInput v-model="form.name" placeholder="请输入网站名称">
          <template #label>名称</template>
        </AoFormInput>
      </div>
      <div class="form-item">
        <AoFormInput v-model="form.url" placeholder="请输入网站地址，如 https://example.com">
          <template #label>网址</template>
        </AoFormInput>
      </div>
      <div class="form-item">
        <AoFormInput v-model="form.desc" placeholder="请输入网站描述（选填）">
          <template #label>描述</template>
        </AoFormInput>
      </div>
    </div>
  </AoDialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import AoDialog from '@/components/ao-dialog/index.vue';
import AoFormInput from '@/components/ao-form-input/index.vue';

interface Props {
  modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [data: { name: string; url: string; desc: string }];
}>();

const form = reactive({
  name: '',
  url: '',
  desc: '',
});

const handleConfirm = () => {
  emit('confirm', { ...form });
  handleClose();
};

const handleClose = () => {
  emit('update:modelValue', false);
  resetForm();
};

const resetForm = () => {
  form.name = '';
  form.url = '';
  form.desc = '';
};

defineExpose({
  resetForm,
});
</script>

<style scoped lang="scss">
.add-website-form {
  --input-focus-color: var(--ao-color-primary);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  width: 100%;
}
</style>
