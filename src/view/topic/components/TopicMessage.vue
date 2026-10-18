<template>
  <div class="topic-message" :data-message-id="message.id">
    <div class="message-avatar">
      <AoImage :src="message.user.avatar" width="40px" height="40px" circle />
    </div>
    <div class="message-body">
      <div class="message-head">
        <span class="message-name">{{ message.user.name }}</span>
        <span
          v-if="memberInfo"
          class="message-member"
          :class="`is-${message.user.member}`"
        >
          <AoImage
            :src="memberInfo.icon"
            width="14px"
            height="14px"
            fit="contain"
          />
          <span>{{ memberInfo.label }}</span>
        </span>
      </div>
      <div class="message-content">
        <div
          v-if="message.replyTo"
          class="message-quote"
          @click="emit('quote', message.replyTo.id)"
        >
          <span class="quote-name">{{ message.replyTo.name }}</span>
          <span class="quote-text">{{ message.replyTo.content }}</span>
        </div>
        <p v-if="message.content" class="message-text">
          <span v-if="mention" class="message-mention">{{ mention }}</span
          >{{ restContent }}
        </p>
        <div v-if="message.images?.length" class="message-images">
          <div
            v-for="(img, index) in message.images"
            :key="index"
            class="image-item"
            @click="previewImage(index)"
          >
            <img :src="img" :alt="`图片${index + 1}`" loading="lazy" />
          </div>
        </div>
      </div>
      <div class="message-foot">
        {{ time }}
        <button
          type="button"
          class="message-action"
          :class="{ active: message.liked }"
          @click="emit('like', message.id)"
        >
          <AoIcon :icon="likeIcon" :size="14" />
          <div class="like-count">{{ message.likes || 0 }}</div>
        </button>
        <button
          type="button"
          class="message-action"
          @click="emit('reply', message)"
        >
          回复
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AoIcon from '@/components/ao-icon/index.vue';
import AoImage from '@/components/ao-image/index.vue';
import likeIcon from '@/assets/topic/icon_like.svg';
import replyIcon from '@/assets/topic/icon_reply.svg';
import type { TopicMessageData } from '../types';

defineOptions({
  name: 'TopicMessage',
});

const props = defineProps<{
  message: TopicMessageData;
}>();

const emit = defineEmits<{
  reply: [message: TopicMessageData];
  like: [id: number | string];
  quote: [id: number | string];
  preview: [payload: { images: string[]; index: number }];
}>();

const previewImage = (index: number) => {
  emit('preview', { images: props.message.images ?? [], index });
};

const memberInfo = computed(() => {
  if (props.message.user.member === 'svip') {
    return { icon: '@/assets/vip/icon_svip.svg', label: 'SVIP' };
  }
  if (props.message.user.member === 'vip') {
    return { icon: '@/assets/vip/icon_vip.svg', label: 'VIP' };
  }
  return null;
});

const mention = computed(() => {
  const name = props.message.replyTo?.name;
  const content = props.message.content ?? '';
  if (!name) return '';
  const prefix = `@${name}`;
  return content.startsWith(prefix) ? prefix : '';
});

const restContent = computed(() => {
  const content = props.message.content ?? '';
  return mention.value ? content.slice(mention.value.length) : content;
});

const time = computed(() => props.message.createdAt.slice(11, 16));
</script>

<style lang="scss" scoped>
.topic-message {
  display: flex;
  gap: 12px;
}

.message-avatar {
  flex: none;
}

.message-body {
  flex: 1;
  min-width: 0;
}

.message-head {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.message-name {
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-medium);
  color: var(--ao-color-text-base);
}

.message-member {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;

  &.is-vip {
    color: #009fa7;
  }

  &.is-svip {
    color: #b8860b;
  }

  span {
    display: block;
    transform: translateY(-0.5px);
  }
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}

.message-text {
  margin: 0;
  font-size: var(--ao-font-size-sm);
  line-height: var(--ao-line-height-relaxed);
  color: var(--ao-color-text-base);
  white-space: pre-wrap;
  word-break: break-word;
}

.message-mention {
  color: var(--ao-color-primary);
}

.message-quote {
  display: flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: var(--ao-border-radius-sm);
  background-color: var(--ao-gray-3);
  font-size: var(--ao-font-size-xs);
  line-height: 18px;
  color: var(--ao-color-text-tertiary);
  cursor: pointer;
  transition: background-color var(--ao-duration-fast) var(--ao-ease-out);

  &:hover {
    background-color: var(--ao-gray-4);
  }
}

.quote-name {
  flex: none;
  color: var(--ao-color-text-secondary);

  &::after {
    content: '：';
  }
}

.quote-text {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.message-images {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.image-item {
  cursor: zoom-in;

  img {
    display: block;
    width: 150px;
    height: 100px;
    object-fit: cover;
    border-radius: var(--ao-border-radius-base);
    transition: opacity var(--ao-duration-fast) var(--ao-ease-out);
  }

  &:hover img {
    opacity: 0.85;
  }
}

.message-foot {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  margin-top: 10px;
  color: var(--ao-color-text-tertiary);
}

.message-action {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: none;
  background: none;
  font-size: 13px;
  color: var(--ao-color-text-tertiary);
  cursor: pointer;
  transition: color var(--ao-duration-fast) var(--ao-ease-out);

  .like-count {
    padding-top: 1px;
  }

  &:hover,
  &.active {
    color: var(--ao-color-primary);
  }
}
</style>
