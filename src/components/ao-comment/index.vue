<template>
  <div class="ao-comment" :style="themeStyle">
    <div class="header">
      <div class="label">
        <h3>
          评论互动<span>{{ comments.length }}条评论</span>
        </h3>
      </div>
      <div class="sort">
        <div class="new">
          <button>最新</button>
        </div>
        <div class="hot">
          <button>最热</button>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="input-wrapper">
        <CommentInput v-model="inputValue" @send="onSend">
          <template #avatar>
            <div class="user-avatar"></div>
          </template>
        </CommentInput>
      </div>
      <div class="comment-list" v-if="comments.length > 0">
        <div
          class="comment-item-wrapper"
          v-for="(item, index) in comments"
          :key="index"
        >
          <CommentItem :comment="item" @reply="handleReplySend"></CommentItem>
        </div>
      </div>
      <div class="comment-empty" v-else>
        <div class="empty-icon">
          <img src="./img/icon_empty_comment.svg" alt="">
        </div>
        <p>暂无评论，快来抢沙发吧</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, provide, computed } from 'vue';
import CommentInput from './component/CommentInput.vue';
import CommentItem from './component/CommentItem.vue';
import type { CommentItemData, UploadFn, ImageItem } from './index.ts';
const emit = defineEmits<{
  (e: 'send', data: { text: string; images: ImageItem[] }): void;
  (
    e: 'reply',
    data: { commentId: string | number; text: string; images: ImageItem[] },
  ): void;
}>();
const props = withDefaults(
  defineProps<{
    comments: CommentItemData[];
    onUpload: UploadFn;
    /** 主题色：默认使用网站品牌色，可传入任意 CSS 颜色自定义 */
    themeColor?: string;
  }>(),
  {
    themeColor: '',
  },
);

/** 仅在显式传入时覆盖 CSS 变量，否则由样式里的品牌色兜底 */
const themeStyle = computed(() =>
  props.themeColor ? { '--ao-comment-theme': props.themeColor } : {},
);

if (props.onUpload) {
  provide('on-upload', props.onUpload);
}

const onSend = (data: any) => {
  console.log('发送内容:', data.text, data.images);
  emit('send', data);
};

const handleReplySend = (data: any) => {
  console.log('回复内容：', data.text, data.images);
  emit('reply', data);
};

const inputValue = ref('');
</script>
<style lang="scss" scoped>
@use './index.scss';
</style>
