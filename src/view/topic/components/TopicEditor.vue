<template>
  <div class="topic-editor">
    <div class="editor-body">
      <div v-if="replyTo" class="editor-quote">
        <div class="quote-content">
          <span class="quote-name">{{ replyTo.name }}：</span>
          <span class="quote-text">{{ replyTo.content }}</span>
        </div>
        <button
          type="button"
          class="quote-close"
          title="取消引用"
          @click="cancelReply"
        >
          <AoIcon :icon="closeIcon" :size="12" />
        </button>
      </div>
      <div v-if="images.length" class="editor-images">
        <div v-for="(img, index) in images" :key="img.id" class="image-item">
          <img :src="img.url" alt="" />
          <button
            type="button"
            class="image-remove"
            title="移除图片"
            @click="removeImage(index)"
          >
            <AoIcon :icon="closeIcon" :size="10" />
          </button>
        </div>
      </div>
      <textarea
        ref="textareaRef"
        v-model="text"
        class="editor-textarea"
        rows="1"
        placeholder="说说你的看法…（Enter 发送，Shift + Enter 换行）"
        @input="adjustHeight"
        @keydown="handleKeydown"
      ></textarea>
      <div class="editor-toolbar">
        <button
          type="button"
          class="tool-btn emoji-btn"
          title="表情"
          @click="toggleEmoji"
        >
          <AoIcon :icon="emojiIcon" :size="18" />
        </button>
        <button
          type="button"
          class="tool-btn"
          title="插入图片"
          @click="handlePick"
        >
          <AoIcon :icon="imageIcon" :size="18" />
        </button>
        <input
          ref="fileRef"
          class="file-input"
          type="file"
          accept="image/*"
          multiple
          @change="handleFiles"
        />
        <button
          type="button"
          class="send-btn"
          :disabled="!canSend"
          @click="handleSend"
        >
          发送
        </button>
      </div>
      <TopicEmojiPicker
        v-if="showEmoji"
        @select="insertEmoji"
        @close="showEmoji = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import AoIcon from '@/components/ao-icon/index.vue';
import TopicEmojiPicker from './TopicEmojiPicker.vue';
import closeIcon from '@/assets/topic/icon_close.svg';
import emojiIcon from '@/assets/topic/icon_emoji.svg';
import imageIcon from '@/assets/topic/icon_image.svg';
import type { TopicReplyTarget } from '../types';

defineOptions({
  name: 'TopicEditor',
});

type EditorImage = {
  id: string;
  url: string;
};

const MAX_IMAGE_COUNT = 9;

const props = withDefaults(
  defineProps<{
    replyTo?: TopicReplyTarget | null;
  }>(),
  {
    replyTo: null,
  },
);

const emit = defineEmits<{
  send: [payload: { text: string; images: string[] }];
  cancelReply: [];
}>();

const text = ref('');
const images = ref<EditorImage[]>([]);
const showEmoji = ref(false);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const fileRef = ref<HTMLInputElement | null>(null);

const canSend = computed(
  () => text.value.trim().length > 0 || images.value.length > 0,
);

const adjustHeight = () => {
  const el = textareaRef.value;
  if (!el) return;
  el.style.height = 'auto';
  let height = el.scrollHeight;
  if (height < 40) height = 40;
  if (height > 120) height = 120;
  el.style.height = `${height}px`;
  el.style.overflowY = height >= 120 ? 'auto' : 'hidden';
};

const focusEnd = () => {
  nextTick(() => {
    adjustHeight();
    const el = textareaRef.value;
    if (!el) return;
    el.focus();
    const position = text.value.length;
    el.setSelectionRange(position, position);
  });
};

watch(
  () => props.replyTo,
  (target, previous) => {
    if (!target) return;

    let next = text.value;
    if (previous) {
      const previousMention = `@${previous.name} `;
      if (next.startsWith(previousMention)) {
        next = next.slice(previousMention.length);
      }
    }

    const mention = `@${target.name} `;
    if (!next.startsWith(mention)) {
      next = mention + next;
    }

    text.value = next;
    focusEnd();
  },
);

const cancelReply = () => {
  const target = props.replyTo;
  if (target) {
    const mention = `@${target.name} `;
    if (text.value.startsWith(mention)) {
      text.value = text.value.slice(mention.length);
    }
  }
  emit('cancelReply');
  nextTick(adjustHeight);
};

const toggleEmoji = () => {
  showEmoji.value = !showEmoji.value;
};

const insertEmoji = (emoji: string) => {
  const el = textareaRef.value;
  if (!el) {
    text.value += emoji;
    showEmoji.value = false;
    return;
  }
  const start = el.selectionStart;
  const end = el.selectionEnd;
  text.value = text.value.slice(0, start) + emoji + text.value.slice(end);
  nextTick(() => {
    el.focus();
    const position = start + emoji.length;
    el.setSelectionRange(position, position);
    adjustHeight();
  });
  showEmoji.value = false;
};

const handlePick = () => {
  fileRef.value?.click();
};

const handleFiles = (e: Event) => {
  const input = e.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  const rest = MAX_IMAGE_COUNT - images.value.length;
  files.slice(0, rest).forEach((file) => {
    images.value.push({
      id: `${Date.now()}-${Math.random()}`,
      url: URL.createObjectURL(file),
    });
  });
  input.value = '';
};

const removeImage = (index: number) => {
  const [removed] = images.value.splice(index, 1);
  if (removed) {
    URL.revokeObjectURL(removed.url);
  }
};

const handleSend = () => {
  if (!canSend.value) return;
  emit('send', {
    text: text.value.trim(),
    images: images.value.map((item) => item.url),
  });
  text.value = '';
  images.value = [];
  showEmoji.value = false;
  nextTick(adjustHeight);
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key !== 'Enter' || e.shiftKey || e.isComposing) return;
  e.preventDefault();
  handleSend();
};

const handleClickOutside = (e: MouseEvent) => {
  if (!showEmoji.value) return;
  const target = e.target as HTMLElement;
  if (!target.closest('.emoji-btn') && !target.closest('.emoji-picker')) {
    showEmoji.value = false;
  }
};

watch(showEmoji, (visible) => {
  if (visible) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  images.value.forEach((item) => URL.revokeObjectURL(item.url));
});
</script>

<style lang="scss" scoped>
.topic-editor {
  flex: none;
  padding: 12px 20px 16px;
}

.editor-body {
  position: relative;
  padding: 6px 12px 8px;
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-color-bg-container);
  transition: border-color var(--ao-duration-fast) var(--ao-ease-out);

  &:focus-within {
    border-color: var(--ao-color-primary);
  }
}

.editor-quote {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0 2px;
  padding: 6px 10px;
  border-radius: var(--ao-border-radius-sm);
  background-color: var(--ao-gray-3);
}

.quote-content {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  font-size: var(--ao-font-size-xs);
  line-height: 18px;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--ao-color-text-tertiary);
}

.quote-name {
  color: var(--ao-color-primary);
}

.quote-close {
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: none;
  border-radius: var(--ao-border-radius-circle);
  background: transparent;
  color: var(--ao-color-text-tertiary);
  cursor: pointer;

  &:hover {
    color: var(--ao-color-text-base);
    background-color: var(--ao-gray-4);
  }
}

.editor-images {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 4px 0 8px;
}

.image-item {
  position: relative;
  width: 80px;
  height: 60px;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: var(--ao-border-radius-base);
  }
}

.image-remove {
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.55);
  color: #fff;
  cursor: pointer;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-out);

  &:hover {
    background-color: rgba(0, 0, 0, 0.75);
  }
}

.editor-textarea {
  display: block;
  width: 100%;
  height: 40px;
  padding: 8px 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: var(--ao-font-size-sm);
  line-height: var(--ao-line-height-base);
  color: var(--ao-color-text-base);
  resize: none;

  &::placeholder {
    color: var(--ao-color-text-tertiary);
  }
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.tool-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  border-radius: var(--ao-border-radius-base);
  background: transparent;
  color: var(--ao-color-text-tertiary);
  cursor: pointer;
  transition: all var(--ao-duration-fast) var(--ao-ease-out);

  &:hover {
    color: var(--ao-color-primary);
    background-color: var(--ao-gray-3);
  }
}

.file-input {
  display: none;
}

.send-btn {
  margin-left: auto;
  height: 32px;
  padding: 0 18px;
  border: none;
  border-radius: var(--ao-border-radius-base);
  background-color: var(--ao-color-primary);
  font-size: var(--ao-font-size-sm);
  color: #fff;
  cursor: pointer;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-out);

  &:hover:not(:disabled) {
    background-color: var(--ao-color-primary-hover);
  }

  &:disabled {
    opacity: var(--ao-opacity-disabled);
    cursor: not-allowed;
  }
}
</style>
