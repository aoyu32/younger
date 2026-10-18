<template>
  <AoScrollbar ref="scrollRef" class="topic-chat">
    <div v-if="messages.length === 0" class="chat-empty">
      <img class="empty-icon" :src="emptyIcon" alt="" />
      <p class="empty-text">还没有人参与讨论，来聊聊你的看法吧</p>
    </div>
    <div v-else class="chat-list">
      <TopicMessage
        v-for="item in messages"
        :key="item.id"
        :message="item"
        @reply="emit('reply', $event)"
        @like="emit('like', $event)"
        @quote="scrollToMessage"
        @preview="emit('preview', $event)"
      />
    </div>
  </AoScrollbar>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import AoScrollbar from '@/components/ao-scrollbar/index.vue';
import TopicMessage from './TopicMessage.vue';
import emptyIcon from '@/assets/topic/icon_empty.svg?url';
import type { TopicMessageData } from '../types';

defineOptions({
  name: 'TopicChat',
});

const props = withDefaults(
  defineProps<{
    messages: TopicMessageData[];
  }>(),
  {
    messages: () => [],
  },
);

const scrollRef = ref<InstanceType<typeof AoScrollbar> | null>(null);

const emit = defineEmits<{
  reply: [message: TopicMessageData];
  like: [id: number | string];
  preview: [payload: { images: string[]; index: number }];
}>();

const scrollToBottom = () => {
  nextTick(() => {
    const wrap = scrollRef.value?.wrapRef;
    if (wrap) {
      wrap.scrollTop = wrap.scrollHeight;
    }
  });
};

const scrollToMessage = (id: number | string) => {
  const wrap = scrollRef.value?.wrapRef;
  if (!wrap) return;

  const target = wrap.querySelector<HTMLElement>(`[data-message-id="${id}"]`);
  if (!target) return;

  const wrapRect = wrap.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  wrap.scrollTop += targetRect.top - wrapRect.top - 16;

  target.classList.add('is-highlight');
  window.setTimeout(() => {
    target.classList.remove('is-highlight');
  }, 1200);
};

watch(() => [props.messages, props.messages.length], scrollToBottom, {
  immediate: true,
  flush: 'post',
});
</script>

<style lang="scss" scoped>
.topic-chat {
  flex: 1;
  min-height: 0;

  :deep(.ao-scrollbar__wrap) {
    position: relative;
    padding: 16px 20px;
    overscroll-behavior: contain;
  }

  :deep(.ao-scrollbar__bar) {
    width: 6px;

    &.is-vertical {
      right: 2px;
      top: 8px;
      bottom: 8px;
      border-radius: var(--ao-border-radius-full);
    }
  }
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.chat-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.empty-icon {
  display: block;
  width: 200px;
  height: 200px;
}

.empty-text {
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-tertiary);
}

.chat-list :deep(.topic-message) {
  .message-body {
    padding: 12px;
    margin: -12px;
    border-radius: var(--ao-border-radius-xs);
    transition: background-color var(--ao-duration-slow) var(--ao-ease-out);
  }

  &.is-highlight .message-body {
    background-color: rgba(0, 0, 0, 0.05);
  }
}
</style>
