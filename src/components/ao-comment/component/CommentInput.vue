<template>
  <div class="comment-input-wrapper">
    <!-- 右侧头像插槽 -->
    <div class="avatar-slot">
      <slot name="avatar">
        <div class="default-avatar"></div>
      </slot>
    </div>

    <!-- 主体内容区域 -->
    <div class="comment-main">
      <div class="textarea-wrapper">
        <!-- 文本输入区 -->
        <textarea
          ref="textareaRef"
          class="comment-textarea"
          :value="text"
          placeholder="发表评论..."
          @input="handleInput"
        ></textarea>
        <!-- 图片预览区域 -->
        <div v-if="imgList?.length" class="image-preview-list">
          <div v-for="img in imgList" :key="img.id" class="preview-item">
            <img :src="img.url" alt="预览" />
            <div class="remove-btn" @click="removeImage(img.id)">
              <img :src="iconRemove" alt="" />
            </div>
          </div>
        </div>
      </div>
      <!-- 底部工具栏 -->
      <div class="toolbar">
        <div class="toolbar-left">
          <button
            type="button"
            class="tool-btn emoji-btn"
            @click="toggleEmojiPicker"
          >
            <img :src="iconEmoji" alt="" />
          </button>
          <button
            type="button"
            class="tool-btn image-btn"
            v-if="showUploadBtn"
            @click="triggerFileInput"
          >
            <img :src="iconUploadImg" alt="" />️
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            multiple
            style="display: none"
            @change="handleFileChange"
          />
        </div>
        <div class="toolbar-right">
          <button
            type="button"
            class="send-btn"
            :disabled="!canSend"
            @click="handleSend"
          >
            发送
          </button>
        </div>
      </div>

      <!-- 表情选择器浮层 -->
      <EmojiPicker
        v-if="showEmojiPicker"
        @select="insertEmoji"
        @close="showEmojiPicker = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, inject, onBeforeUnmount } from 'vue';
import EmojiPicker from './EmojiPicker.vue';
import type { UploadFn, ImageItem } from '../index';

// 图标导入
import iconRemove from '../img/icon_remove.svg?url';
import iconEmoji from '../img/icon_emoji.svg?url';
import iconUploadImg from '../img/icon_upload_img.svg?url';

const handleUpload = inject<UploadFn>('on-upload');

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'send', data: { text: string; images: ImageItem[] }): void;
}>();

const text = ref(props.modelValue || '');
const showEmojiPicker = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const showUploadBtn = computed(() => handleUpload);
const imgList = ref<ImageItem[]>([]);

const canSend = computed(() => {
  return text.value.trim().length > 0 || imgList.value.length > 0;
});

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== text.value) {
      text.value = newVal;
      nextTick(() => adjustTextareaHeight());
    }
  },
);

const adjustTextareaHeight = () => {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = 'auto';
  let height = el.scrollHeight;
  if (height < 36) height = 36;
  if (height > 120) height = 120;
  el.style.height = `${height}px`;
  el.style.overflowY = height >= 120 ? 'auto' : 'hidden';
};

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  text.value = target.value;
  emit('update:modelValue', target.value);
  adjustTextareaHeight();
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handleFileChange = async (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  if (files.length === 0) return;
  console.log('上传了文件：', input.files);

  const remainingSlots = 9 - imgList.value.length;
  if (remainingSlots <= 0) {
    alert('最多只能上传9张图片');
    return;
  }

  if (!handleUpload) {
    console.error('未开启上传图片');
    return;
  }
  for (const file of files) {
    try {
      const res = await handleUpload(file);
      if (res.success) {
        imgList.value.push({
          url: res.url,
          id: res.id,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
};

const removeImage = (id: number | string) => {
  imgList.value = imgList.value.filter((img) => img.id !== id);
  if (fileInputRef.value) {
    fileInputRef.value.value = '';
  }
};

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const insertEmoji = (emoji: string) => {
  const textarea = textareaRef.value;
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const newText = text.value.slice(0, start) + emoji + text.value.slice(end);
  text.value = newText;
  emit('update:modelValue', newText);

  nextTick(() => {
    if (textarea) {
      textarea.focus();
      const newCursorPos = start + emoji.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      adjustTextareaHeight();
    }
  });
  showEmojiPicker.value = false;
};

const handleSend = () => {
  if (!canSend.value) return;
  emit('send', {
    text: text.value,
    images: imgList.value,
  });
  text.value = '';
  emit('update:modelValue', '');
  imgList.value = [];
  nextTick(() => adjustTextareaHeight());
};

const handleClickOutside = (e: MouseEvent) => {
  if (!showEmojiPicker.value) return;
  const target = e.target as HTMLElement;
  if (!target.closest('.emoji-btn') && !target.closest('.emoji-picker')) {
    showEmojiPicker.value = false;
  }
};

watch(showEmojiPicker, (visible) => {
  if (visible) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
@use './CommentInput.scss' as *;
</style>