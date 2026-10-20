<template>
  <AoDialog
    v-model="visible"
    title="意见反馈"
    width="640px"
    :close-on-mask="!submitting"
    @close="handleDialogClose"
  >
    <div v-if="submitted" class="feedback-success">
      <div class="success-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h4>反馈已提交</h4>
      <p>感谢你的反馈，我们会尽快查看并处理。</p>
    </div>

    <form v-else class="feedback-form" @submit.prevent="handleSubmit">
      <div class="form-item">
        <div class="form-label">
          <span>反馈事项</span>
          <span class="required">*</span>
        </div>
        <div class="type-options" role="radiogroup" aria-label="反馈事项">
          <button
            v-for="item in feedbackTypes"
            :key="item.value"
            type="button"
            class="type-option"
            :class="[
              `type-option--${item.tone}`,
              { 'is-active': form.type === item.value },
            ]"
            role="radio"
            :aria-checked="form.type === item.value"
            @click="selectType(item.value)"
          >
            <span class="type-icon">
              <AoImage
                :src="item.icon"
                width="22px"
                height="22px"
                fit="contain"
                aria-hidden="true"
              />
            </span>
            <span class="type-text">
              <span class="type-label">{{ item.label }}</span>
              <span class="type-desc">{{ item.desc }}</span>
            </span>
          </button>
        </div>
        <p v-if="errors.type" class="form-error">{{ errors.type }}</p>
      </div>

      <div class="form-item">
        <div class="form-label">
          <span>上传附件</span>
        </div>
        <div
          class="upload-zone"
          :class="{ 'is-dragover': dragging }"
          role="button"
          tabindex="0"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
          @dragover.prevent="dragging = true"
          @dragleave.prevent="dragging = false"
          @drop.prevent="handleDrop"
        >
          <span class="upload-icon">
            <AoImage
              src="@/assets/layout/icon_upload.svg"
              width="22px"
              height="22px"
              fit="contain"
              aria-hidden="true"
            />
          </span>
          <span class="upload-title">
            点击上传<span>，或将文件拖拽到这里</span>
          </span>
          <span class="upload-hint">
            支持图片、视频和常见文档，单个文件不超过 50MB，最多 5 个
          </span>
        </div>
        <input
          ref="fileInputRef"
          class="file-input"
          type="file"
          multiple
          @change="handleFileChange"
        />
        <ul v-if="attachments.length" class="file-list">
          <li
            v-for="(file, index) in attachments"
            :key="`${file.name}-${file.size}-${file.lastModified}`"
          >
            <span class="file-type" :class="`file-type--${getFileKind(file)}`">
              {{ getFileKindLabel(file) }}
            </span>
            <span class="file-info">
              <span class="file-name" :title="file.name">{{ file.name }}</span>
              <span class="file-size">{{ formatFileSize(file.size) }}</span>
            </span>
            <button
              type="button"
              class="file-remove"
              aria-label="移除附件"
              @click.stop="removeFile(index)"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </li>
        </ul>
        <p v-if="errors.files" class="form-error">{{ errors.files }}</p>
      </div>

      <div class="form-item">
        <div class="form-label">
          <span>问题描述</span>
          <span class="required">*</span>
          <span class="label-tip">支持 Markdown</span>
        </div>
        <div
          class="markdown-editor"
          :class="{ 'is-error': errors.description }"
        >
          <AoMarkdown
            v-model:content="form.description"
            mode="editor"
            editor-id="feedback-markdown-editor"
            :editor-props="editorProps"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <template v-if="submitted">
        <button
          type="button"
          class="feedback-btn feedback-btn--primary"
          @click="handleFinish"
        >
          完成
        </button>
      </template>
      <template v-else>
        <button
          type="button"
          class="feedback-btn feedback-btn--ghost"
          :disabled="submitting"
          @click="handleCancel"
        >
          取消
        </button>
        <button
          type="button"
          class="feedback-btn feedback-btn--primary"
          :disabled="submitting"
          @click="handleSubmit"
        >
          <span v-if="submitting" class="btn-spinner" />
          {{ submitting ? '提交中...' : '提交反馈' }}
        </button>
      </template>
    </template>
  </AoDialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import AoDialog from '@/components/ao-dialog/index.vue';
import AoMarkdown from '@/components/ao-markdown/index.vue';

defineOptions({
  name: 'FeedbackDialog',
});

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
}>();

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

type FeedbackType = 'bug' | 'order' | 'suggestion';

type FeedbackTypeOption = {
  value: FeedbackType;
  label: string;
  desc: string;
  tone: 'danger' | 'warning' | 'primary';
  icon: string;
};

const feedbackTypes: FeedbackTypeOption[] = [
  {
    value: 'bug',
    label: '网站 bug',
    desc: '页面异常、功能不可用',
    tone: 'danger',
    icon: '@/assets/layout/icon_bug.svg',
  },
  {
    value: 'order',
    label: '订单问题',
    desc: '支付、退款、订单状态',
    tone: 'warning',
    icon: '@/assets/layout/icon_order.svg',
  },
  {
    value: 'suggestion',
    label: '意见和建议',
    desc: '功能建议、体验优化',
    tone: 'primary',
    icon: '@/assets/layout/icon_suggest.svg',
  },
];

const MAX_FILES = 5;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

const form = reactive<{ type: FeedbackType | ''; description: string }>({
  type: '',
  description: '',
});

const attachments = ref<File[]>([]);
const fileInputRef = ref<HTMLInputElement>();
const dragging = ref(false);
const submitting = ref(false);
const submitted = ref(false);

const errors = reactive({
  type: '',
  files: '',
  description: '',
});

const editorProps = {
  language: 'zh-CN',
  placeholder: '请详细描述问题的具体情况、复现步骤，或你希望增加的功能...',
  noUploadImg: true,
  preview: false,
  htmlPreview: false,
  footers: [],
  toolbars: [
    'bold',
    'italic',
    'strikeThrough',
    'title',
    'quote',
    'unorderedList',
    'orderedList',
    'code',
    'link',
    'table',
    'revoke',
    'next',
    'preview',
    'fullscreen',
  ],
  style: {
    height: '220px',
  },
  previewTheme: 'smart-blue',
  codeTheme: 'atom',
};

const selectType = (value: FeedbackType) => {
  form.type = value;
  errors.type = '';
};

watch(
  () => form.description,
  (value) => {
    if (errors.description && value.trim()) {
      errors.description = '';
    }
  },
);

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      errors.type = '';
      errors.files = '';
      errors.description = '';
      if (submitted.value) {
        submitted.value = false;
      }
    }
  },
);

const resetForm = () => {
  form.type = '';
  form.description = '';
  attachments.value = [];
  errors.type = '';
  errors.files = '';
  errors.description = '';
  dragging.value = false;
  submitting.value = false;
  submitted.value = false;
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const openFilePicker = () => {
  if (submitting.value) return;
  fileInputRef.value?.click();
};

const addFiles = (files: FileList | File[]) => {
  errors.files = '';
  for (const file of Array.from(files)) {
    if (attachments.value.length >= MAX_FILES) {
      errors.files = `最多上传 ${MAX_FILES} 个附件`;
      break;
    }
    if (file.size > MAX_FILE_SIZE) {
      errors.files = `「${file.name}」超过 50MB，请压缩后再上传`;
      continue;
    }
    const duplicated = attachments.value.some(
      (item) =>
        item.name === file.name &&
        item.size === file.size &&
        item.lastModified === file.lastModified,
    );
    if (!duplicated) {
      attachments.value.push(file);
    }
  }
};

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    addFiles(input.files);
  }
  input.value = '';
};

const handleDrop = (event: DragEvent) => {
  dragging.value = false;
  if (event.dataTransfer?.files?.length) {
    addFiles(event.dataTransfer.files);
  }
};

const removeFile = (index: number) => {
  attachments.value.splice(index, 1);
  errors.files = '';
};

const getFileKind = (file: File) => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  return 'file';
};

const getFileKindLabel = (file: File) => {
  const kind = getFileKind(file);
  if (kind === 'image') return '图片';
  if (kind === 'video') return '视频';
  return '文件';
};

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

const handleSubmit = async () => {
  if (submitting.value) return;

  errors.type = form.type ? '' : '请选择反馈事项';
  errors.description = form.description.trim() ? '' : '请填写问题描述';
  if (!errors.description && form.description.length > 5000) {
    errors.description = '问题描述不能超过 5000 字';
  }

  if (errors.type || errors.description) return;

  submitting.value = true;
  // TODO: 接入真实反馈接口，提交 form.type、form.description 与 attachments.value
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  submitting.value = false;
  if (!props.modelValue) return;
  submitted.value = true;
};

const handleCancel = () => {
  visible.value = false;
};

const handleDialogClose = () => {
  if (submitted.value) {
    resetForm();
  }
};

const handleFinish = () => {
  resetForm();
  visible.value = false;
};

defineExpose({
  resetForm,
});
</script>

<style scoped lang="scss">
.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-semibold);
  color: var(--ao-color-text-base);

  .required {
    color: var(--ao-color-error);
  }

  .optional {
    font-size: var(--ao-font-size-xs);
    font-weight: var(--ao-font-weight-normal);
    color: var(--ao-color-text-tertiary);
  }

  .label-tip {
    margin-left: auto;
    font-size: var(--ao-font-size-xs);
    font-weight: var(--ao-font-weight-normal);
    color: var(--ao-color-text-tertiary);
  }
}

.type-options {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.type-option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border: 1px solid var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
  background: var(--ao-color-bg-container);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color var(--ao-duration-fast) var(--ao-ease-in-out),
    background-color var(--ao-duration-fast) var(--ao-ease-in-out),
    box-shadow var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover {
    border-color: color-mix(
      in srgb,
      var(--ao-color-primary) 55%,
      var(--ao-color-border)
    );
  }

  &.is-active {
    border-color: var(--ao-color-primary);
    background: color-mix(
      in srgb,
      var(--ao-color-primary) 7%,
      var(--ao-color-bg-container)
    );
    box-shadow: 0 0 0 1px
      color-mix(in srgb, var(--ao-color-primary) 25%, transparent);
  }
}

.type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 34px;
  height: 34px;
}

.type-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.type-label {
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-medium);
  color: var(--ao-color-text-base);
  white-space: nowrap;
}

.type-desc {
  font-size: var(--ao-font-size-xs);
  line-height: 1.4;
  color: var(--ao-color-text-tertiary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 18px 16px;
  border: 1px dashed var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
  background: var(--ao-gray-1);
  text-align: center;
  cursor: pointer;
  transition:
    border-color var(--ao-duration-fast) var(--ao-ease-in-out),
    background-color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover,
  &.is-dragover {
    border-color: var(--ao-color-primary);
    background: color-mix(
      in srgb,
      var(--ao-color-primary) 5%,
      var(--ao-gray-1)
    );
  }
}

.upload-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
}

.upload-title {
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-secondary);

  span {
    color: var(--ao-color-text-tertiary);
  }
}

.upload-hint {
  font-size: var(--ao-font-size-xs);
  line-height: 1.5;
  color: var(--ao-color-text-tertiary);
}

.file-input {
  display: none;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.file-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  padding: 8px 10px;
  border-radius: var(--ao-border-radius-base);
  background: var(--ao-gray-2);
}

.file-type {
  flex-shrink: 0;
  padding: 2px 6px;
  border-radius: var(--ao-border-radius-sm);
  font-size: var(--ao-font-size-xs);
  line-height: 1.4;

  &--image {
    color: var(--ao-color-primary);
    background: color-mix(in srgb, var(--ao-color-primary) 10%, transparent);
  }

  &--video {
    color: #7c5cff;
    background: color-mix(in srgb, #7c5cff 10%, transparent);
  }

  &--file {
    color: var(--ao-color-info);
    background: var(--ao-color-info-bg);
  }
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.file-name {
  min-width: 0;
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-secondary);
}

.file-size {
  flex-shrink: 0;
  font-size: var(--ao-font-size-xs);
  color: var(--ao-color-text-tertiary);
}

.file-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--ao-color-text-tertiary);
  cursor: pointer;
  transition:
    color var(--ao-duration-fast) var(--ao-ease-in-out),
    background-color var(--ao-duration-fast) var(--ao-ease-in-out);

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    color: var(--ao-color-error);
    background: var(--ao-color-error-bg);
  }
}

.markdown-editor {
  overflow: hidden;
  border-radius: var(--ao-border-radius-lg);

  :deep(.md-editor) {
    border-color: var(--ao-color-border);
    border-radius: var(--ao-border-radius-lg);
    box-shadow: none;
  }

  &.is-error :deep(.md-editor) {
    border-color: var(--ao-color-error);
  }
}

.description-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 18px;
  font-size: var(--ao-font-size-xs);
  line-height: 1.5;
  color: var(--ao-color-text-tertiary);
}

.description-tip {
  flex: 1;
}

.word-count {
  margin-left: auto;
  flex-shrink: 0;

  &.is-over {
    color: var(--ao-color-error);
  }
}

.form-error {
  margin: 0;
  font-size: var(--ao-font-size-xs);
  line-height: 1.5;
  color: var(--ao-color-error);
}

.feedback-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 88px;
  height: 36px;
  padding: 0 20px;
  border-radius: var(--ao-border-radius-base);
  font-family: inherit;
  font-size: var(--ao-font-size-sm);
  cursor: pointer;
  transition:
    color var(--ao-duration-fast) var(--ao-ease-in-out),
    background-color var(--ao-duration-fast) var(--ao-ease-in-out),
    border-color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--ghost {
    border: 1px solid var(--ao-color-border);
    background: var(--ao-color-bg-container);
    color: var(--ao-color-text-secondary);

    &:hover:not(:disabled) {
      border-color: var(--ao-color-primary);
      color: var(--ao-color-primary);
    }
  }

  &--primary {
    border: 1px solid var(--ao-color-primary);
    background: var(--ao-color-primary);
    color: #fff;

    &:hover:not(:disabled) {
      border-color: var(--ao-color-primary-hover);
      background: var(--ao-color-primary-hover);
    }
  }
}

.btn-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  border-top-color: #fff;
  border-radius: 50%;
  animation: feedback-spin 0.7s linear infinite;
}

@keyframes feedback-spin {
  to {
    transform: rotate(360deg);
  }
}

.feedback-success {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0 18px;
  text-align: center;

  h4 {
    margin: 14px 0 0;
    font-size: var(--ao-font-size-lg);
    font-weight: var(--ao-font-weight-semibold);
    color: var(--ao-color-text-base);
  }

  p {
    margin: 8px 0 0;
    font-size: var(--ao-font-size-sm);
    color: var(--ao-color-text-tertiary);
  }
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: var(--ao-color-primary);
  background: color-mix(in srgb, var(--ao-color-primary) 11%, transparent);

  svg {
    width: 28px;
    height: 28px;
  }
}

@media (max-width: 560px) {
  .type-options {
    grid-template-columns: 1fr;
  }

  .type-option {
    padding: 10px 12px;
  }

  .type-desc {
    white-space: normal;
  }

  .upload-title span {
    display: block;
  }
}
</style>
