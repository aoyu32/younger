<template>
  <div class="video-container">
    <div class="video-wrapper">
      <div class="video-info flex-column">
        <div class="title">
          <h3>
            {{ data.title }}
          </h3>
        </div>
        <div class="meta">
          <div class="meta-item flex-x">
            <AoImage
              src="@/assets/video/icon_play_count.svg"
              width="16px"
              height="16px"
            />
            <span>{{ data.meta.playCount }}万</span>
          </div>
          <div class="meta-item flex-x">
            <AoImage
              src="@/assets/video/icon_publish_time.svg"
              width="16px"
              height="16px"
            />
            <span>{{ data.publishTime }}</span>
          </div>
          <div class="meta-item flex-x">
            <AoImage
              src="@/assets/video/icon_author.svg"
              width="16px"
              height="16px"
            />
            <span>作者：{{ data.author.name }}</span>
          </div>
          <div class="meta-item flex-x" v-if="data.meta.authRequire">
            <AoImage
              src="@/assets/video/icon_prohibit.svg"
              width="16px"
              height="16px"
            />
            <span>未经作者授权，禁止转载</span>
          </div>
        </div>
      </div>

      <!-- 视频区域 -->
      <div class="player-wrapper">
        <VideoPlayer :src="data.video.url" :poster="data.video.cover" />
      </div>

      <div class="video-footer flex">
        <div
          class="comment"
          :style="{ width: filterRecommendVideo.length > 0 ? '70%' : '100%' }"
        >
          <AoComment
            :comments="commentsList"
            :on-upload="handleUpload"
            @send="handleCommentSend"
            @reply="handleCommentReplySend"
          />
        </div>
        <div class="recommand" v-if="filterRecommendVideo.length > 0">
          <VideoRecommend :data="filterRecommendVideo" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import VideoPlayer from '@/components/video-player/index.vue';
import AoImage from '@/components/ao-image/index.vue';
import AoComment from '@/components/ao-comment/index.vue';
import { mockComments } from '@/mock/comment.js';
import VideoRecommend from './components/VideoRecommend.vue';
import { videoData } from '@/mock/videoData.js';

const route = useRoute();

const data = computed(() => {
  const id = Number(route.params.id);
  return videoData.find((item) => item.id === id) || {};
});

const commentsList = ref(mockComments);

const filterRecommendVideo = computed(() => {
  return videoData.filter((item) => item.isRecommended);
  // return []
});

// 模拟上传图片
const handleUpload = async (images) => {
  console.log('上传图片：', images);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id: Date.now(),
        url: 'https://picsum.photos/1280/720?random=1',
      });
    }, 1000);
  });
};

// 递归查找指定 id 的评论（包括嵌套回复）
function findCommentById(list, id) {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.replies && item.replies.length > 0) {
      const found = findCommentById(item.replies, id);
      if (found) return found;
    }
  }
  return null;
}

// 发送新评论
const handleCommentSend = (data) => {
  console.log('发送评论：', data.text, data.images);
  commentsList.value.push({
    id: Date.now(),
    user: {
      name: '当前用户',
      avatar: 'https://picsum.photos/50/50?random=2',
    },
    content: data.text,
    images: data.images,
    createdAt: new Date().toISOString(),
  });
};

// 回复评论（支持嵌套）
const handleCommentReplySend = (data) => {
  console.log('回复评论：', data.commentId, data.text, data.images);

  const targetComment = findCommentById(commentsList.value, data.commentId);
  if (!targetComment) {
    console.warn('未找到对应评论，commentId:', data.commentId);
    return;
  }

  if (!targetComment.replies) {
    targetComment.replies = [];
  }

  targetComment.replies.push({
    id: Date.now(),
    user: {
      name: '当前用户',
      avatar: 'https://picsum.photos/50/50?random=3',
    },
    content: data.text,
    images: data.images,
    replyTo: targetComment.user.name,
    createdAt: new Date().toISOString(),
  });
};
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
