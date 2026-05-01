<!-- EmojiPicker.vue -->
<template>
  <div class="emoji-picker" @click.stop>
    <div class="emoji-grid">
      <button
        v-for="emoji in emojiList"
        :key="emoji"
        class="emoji-item"
        @click="selectEmoji(emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'select', emoji: string): void;
  (e: 'close'): void;
}>();

// 常用表情列表
const emojiList = [
  '😀',
  '😂',
  '😍',
  '😎',
  '👍',
  '❤️',
  '😢',
  '😡',
  '🥳',
  '😱',
  '🔥',
  '✨',
  '🎉',
  '💯',
  '🤔',
  '😴',
  '🙏',
  '🍻',
];

const selectEmoji = (emoji: string) => {
  emit('select', emoji);
  emit('close');
};
</script>

<style scoped lang="scss">
.emoji-picker {
  position: absolute;
  bottom: 32px;
  left: 0;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 12px;
  z-index: 100;
  border: 1px solid #e9ecef;

  .emoji-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 8px;
    overflow-y: auto;

    
    .emoji-item {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
      border-radius: 12px;
      transition:
        background-color 0.2s,
        transform 0.1s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background-color: #f0f2f5;
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}
</style>
