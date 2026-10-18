<template>
  <div class="emoji-picker" @click.stop>
    <div class="emoji-grid">
      <button
        v-for="emoji in emojiList"
        :key="emoji"
        class="emoji-item"
        type="button"
        @click="selectEmoji(emoji)"
      >
        {{ emoji }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TopicEmojiPicker',
});

const emit = defineEmits<{
  select: [emoji: string];
  close: [];
}>();

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

<style lang="scss" scoped>
.emoji-picker {
  position: absolute;
  bottom: 32px;
  left: 0;
  z-index: var(--ao-z-dropdown);
  padding: 12px;
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-color-bg-elevated);
  box-shadow: var(--ao-shadow-md);
}

.emoji-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;
  overflow-y: auto;
}

.emoji-item {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border: none;
  border-radius: var(--ao-border-radius-base);
  background: none;
  font-size: 20px;
  cursor: pointer;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-out);

  &:hover {
    background-color: var(--ao-gray-3);
  }

  &:active {
    transform: scale(0.95);
  }
}
</style>
