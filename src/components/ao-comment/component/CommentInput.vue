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
        <div v-if="images?.length" class="image-preview-list">
          <div v-for="img in images" :key="img.id" class="preview-item">
            <img :src="img.url" alt="预览" />
            <div class="remove-btn" @click="removeImage(img.id)">
              <img src="../img/icon_remove.svg" alt="" />
            </div>
            <!-- 可选的加载状态 -->
            <div v-if="img.status === 'uploading'" class="uploading-mask"></div>
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
            <img src="../img/icon_emoji.svg" alt="" />
          </button>
          <button
            type="button"
            class="tool-btn image-btn"
            @click="triggerFileInput"
          >
            <img src="../img/icon_upload_img.svg" alt="" />️
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            multiple
            style="display: none"
            @change="handleFileSelect"
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
import { ref, computed, watch, nextTick, onBeforeUnmount } from 'vue';
import EmojiPicker from './EmojiPicker.vue';

// 定义图片项类型
export interface ImageItem {
  id: number | string;
  url: string; // 预览 URL
  file?: File; // 原始文件
  status?: 'uploading' | 'done' | 'error';
}

// 组件 props
const props = defineProps<{
  modelValue: string;
  images?: ImageItem[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:images', images: ImageItem[]): void;
  (e: 'images-added', addedItems: ImageItem[]): void; // 新增文件事件，供父组件上传
  (e: 'send', data: { text: string; images: ImageItem[] }): void;
}>();

// 内部状态
const text = ref(props.modelValue || '');
const showEmojiPicker = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// 当前图片列表
const currentImages = computed(() => props.images || []);

// 是否可发送
const canSend = computed(() => {
  return text.value.trim().length > 0 || currentImages.value.length > 0;
});

// 同步外部 modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== text.value) {
      text.value = newVal;
      nextTick(() => adjustTextareaHeight());
    }
  },
);

// 调整 textarea 高度
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

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click();
};

// 处理文件选择（生成临时预览，通知父组件）
const handleFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  if (files.length === 0) return;

  const remainingSlots = 9 - currentImages.value.length;
  if (remainingSlots <= 0) {
    alert('最多只能上传9张图片');
    return;
  }

  const validFiles = files.slice(0, remainingSlots);
  const addedItems: ImageItem[] = [];

  for (const file of validFiles) {
    if (!file.type.startsWith('image/')) continue;
    const blobUrl = URL.createObjectURL(file);
    const newId = Date.now() + Math.random().toString(36).slice(2, 8);
    const newItem: ImageItem = {
      id: newId,
      url: blobUrl,
      file: file,
      status: 'uploading', // 标记为上传中
    };
    addedItems.push(newItem);
  }

  if (addedItems.length === 0) return;

  // 合并新图片到现有列表
  const newImages = [...currentImages.value, ...addedItems];
  emit('update:images', newImages);

  emit('images-added', addedItems);
  input.value = '';
};

// 删除图片
const removeImage = (id: number | string) => {
  const removed = currentImages.value.find((img) => img.id === id);
  const newImages = currentImages.value.filter((img) => img.id !== id);
  emit('update:images', newImages);
  // 如果是本地 blob URL，主动释放内存
  if (removed?.url && removed.url.startsWith('blob:')) {
    URL.revokeObjectURL(removed.url);
  }
};

// 表情相关
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

// 发送评论
const handleSend = () => {
  if (!canSend.value) return;
  emit('send', {
    text: text.value,
    images: currentImages.value,
  });
  // 清空内容和图片
  text.value = '';
  emit('update:modelValue', '');
  emit('update:images', []);
  // 释放所有 blob URL
  currentImages.value.forEach((img) => {
    if (img.url && img.url.startsWith('blob:')) {
      URL.revokeObjectURL(img.url);
    }
  });
  nextTick(() => adjustTextareaHeight());
};

// 点击外部关闭表情面板
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
  // 清理所有 blob URL
  currentImages.value.forEach((img) => {
    if (img.url && img.url.startsWith('blob:')) {
      URL.revokeObjectURL(img.url);
    }
  });
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped lang="scss">
@use './CommentInput.scss' as *;
</style>
