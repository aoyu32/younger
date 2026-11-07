<template>
  <div class="app-comments">
    <AoComment
      :comments="comments"
      :on-upload="handleUpload"
      theme-color="rgb(var(--app-main-rgb, 0, 181, 181))"
      @send="handleSend"
      @reply="handleReplySend"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import AoComment from '@/components/ao-comment/index.vue';
import type {
  CommentItemData,
  ImageItem,
  UploadFn,
} from '@/components/ao-comment';

defineOptions({ name: 'AppCommentSection' });

const props = defineProps<{
  /** 应用 ID：切换应用时重置评论区 */
  appId: number;
}>();

/** 当前评论列表（暂无接口，先本地维护） */
const comments = ref<CommentItemData[]>([]);

watch(
  () => props.appId,
  () => {
    comments.value = [];
  },
  { immediate: true },
);

/** 模拟图片上传，接入接口后替换 */
const handleUpload: UploadFn = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id: String(Date.now()),
        url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=app-detail-user',
      });
    }, 600);
  });

const currentUser = {
  id: 0,
  name: '当前用户',
  avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=app-detail-user',
};

/** 组件上传返回 ImageItem，评论模型要求 id 为字符串 */
const toCommentImages = (images: ImageItem[]) =>
  images.map((image) => ({ url: image.url, id: String(image.id) }));

const handleSend = (data: { text: string; images: ImageItem[] }) => {
  comments.value.unshift({
    id: Date.now(),
    user: currentUser,
    content: data.text,
    images: toCommentImages(data.images),
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    parentId: null,
    replies: [],
  });
};

/** 递归查找目标评论（含嵌套回复） */
const findComment = (
  list: CommentItemData[],
  id: number | string,
): CommentItemData | null => {
  for (const item of list) {
    if (item.id === id) return item;
    const found = item.replies?.length
      ? findComment(item.replies as CommentItemData[], id)
      : null;
    if (found) return found;
  }
  return null;
};

const handleReplySend = (data: {
  commentId: string | number;
  text: string;
  images: ImageItem[];
}) => {
  const target = findComment(comments.value, data.commentId);
  if (!target) return;
  if (!target.replies) target.replies = [];
  target.replies.push({
    id: Date.now(),
    user: currentUser,
    content: data.text,
    images: toCommentImages(data.images),
    replyTo: target.user.name,
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    parentId: target.id,
    replies: [],
  } as CommentItemData);
};
</script>
