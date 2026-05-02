<template>
  <div class="comment-item">
    <!-- 上方内容区域 -->
    <div
      class="comment-wrapper"
      :style="{ paddingLeft: comment.replyTo ? '50px' : '0px' }"
    >
      <div class="user-info">
        <div :class="comment.replyTo ? 'reply-avatar' : 'avatar'">
          <img :src="comment.user.avatar" alt="" />
        </div>
        <div class="user-name">{{ comment.user.name }}</div>
        <div class="reply-info-wrapper" v-if="comment.replyTo">
          <div class="reply-text">回复</div>
          <div class="reply-to">
            <span>@{{ comment.replyTo }}</span>
          </div>
        </div>
      </div>
      <div
        :class="comment.replyTo ? 'reply-comment-content' : 'comment-content'"
      >
        <!-- 评论数据 -->
        <div class="comment-text">{{ comment.content }}</div>
        <!-- 图片列表 -->
        <div
          v-if="comment.images && comment.images.length"
          class="comment-images"
        >
          <div
            v-for="(img, idx) in comment.images"
            :key="idx"
            class="image-wrapper"
          >
            <img :src="img.url" :alt="`图片${idx + 1}`" />
          </div>
        </div>
        <!-- 元信息栏 -->
        <div class="comment-meta">
          <span class="date">{{ formattedDate }}</span>
          <div class="action-buttons">
            <button
              class="action-btn like-btn"
              :class="{ active: liked }"
              @click="handleLike"
            >
              <img src="../img/icon_like_active.svg" alt="" v-if="liked" />
              <img src="../img/icon_like.svg" alt="" v-else />
              <span> {{ comment.likes || 0 }}</span>
            </button>
            <button
              class="action-btn dislike-btn"
              :class="{ active: disliked }"
              @click="handleDislike"
            >
              <img
                src="../img/icon_dislike_active.svg"
                alt=""
                v-if="disliked"
              />
              <img src="../img/icon_dislike.svg" alt="" v-else />
              <span> {{ comment.dislikes || 0 }}</span>
            </button>
            <button class="action-btn reply-btn" @click="toggleReplyInput">
              <img src="../img/icon_reply.svg" alt="" />
              <span>{{ showReplyInput ? '收起回复' : '回复' }}</span>
            </button>

            <button
              class="action-btn arrow-btn"
              @click="toggleExpandReplies"
              v-if="replies.length > 0"
            >
              <img
                src="../img/icon_arrow_down.svg"
                alt=""
                :class="{ expanded: isExpanded }"
              />
              {{ isExpanded ? '收起回复' : `展开 ${replies.length} 条回复` }}
            </button>
          </div>
        </div>
        <!-- 回复输入框 -->
        <div v-if="showReplyInput" class="reply-input-wrapper">
          <CommentInput v-model="replyText" @send="handleReplySend">
            <template #avatar>
              <div class="reply-avatar"></div>
            </template>
          </CommentInput>
        </div>
      </div>
    </div>

    <!-- 回复列表区域 -->
    <div v-if="isExpanded" class="replies-section">
      <div class="replies-list">
        <div
          class="reply-item-wrapper"
          v-for="reply in replies"
          :key="reply.id"
        >
          <CommentItem
            :comment="reply"
            @reply="(payload) => $emit('reply', payload)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import CommentInput from './CommentInput.vue';
import type { CommentItemData } from '../index.d.ts';

const props = defineProps<{
  comment: CommentItemData;
  depth?: number; // 层级：0 一级评论，1 二级回复，2 三级……
}>();

const emit = defineEmits<{
  (e: 'like', commentId: string | number): void;
  (e: 'dislike', commentId: string | number): void;
  (
    e: 'reply',
    data: { commentId: string | number; text: string; images: any[] },
  ): void;
  (e: 'replyLike', replyId: string | number): void;
  (e: 'replyDislike', replyId: string | number): void;
}>();

// UI 状态
const liked = ref(false);
const disliked = ref(false);
const showReplyInput = ref(false);
const replyText = ref('');
const replyImages = ref<any[]>([]);

// 回复列表的展开/收起状态
const isExpanded = ref(false);

// 实际回复列表
const replies = computed(() => props.comment.replies || []);

// 格式化日期
const formattedDate = computed(() => {
  const date = new Date(props.comment.createdAt);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
});

// 切换回复列表展开/收起
const toggleExpandReplies = () => {
  isExpanded.value = !isExpanded.value;
};

// 点赞/踩处理
const handleLike = () => {
  liked.value = !liked.value;
  if (liked.value && disliked.value) disliked.value = false;
  emit('like', props.comment.id);
};

const handleDislike = () => {
  disliked.value = !disliked.value;
  if (disliked.value && liked.value) liked.value = false;
  emit('dislike', props.comment.id);
};

// 回复输入框显示切换
const toggleReplyInput = () => {
  showReplyInput.value = !showReplyInput.value;
  if (!showReplyInput.value) {
    replyText.value = '';
    replyImages.value = [];
  }
};

// 发送回复
const handleReplySend = (data: { text: string; images: any[] }) => {
  emit('reply', {
    commentId: props.comment.id,
    text: data.text,
    images: data.images,
  });
  replyText.value = '';
  replyImages.value = [];
  showReplyInput.value = false;
  isExpanded.value = true;
};
</script>

<style scoped lang="scss">
@use './CommentItem.scss' as *;
</style>
