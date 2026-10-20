<template>
  <div
    class="video-detail"
    :style="{
      '--video-player-height': playerHeight ? `${playerHeight}px` : undefined,
    }"
  >
    <!-- 第一行左：标题 / 元信息 -->
    <header class="video-detail__head">
      <h1 class="video-detail__title" :title="video.title">
        {{ video.title }}
      </h1>

      <div class="video-detail__meta">
        <span class="meta-item">
          <AoImage
            src="@/assets/video/icon_play_count.svg"
            width="16px"
            height="16px"
          />
          <span>{{ formatCountCN(video.meta.playCount) }} 次播放</span>
        </span>
        <span class="meta-item">
          <AoImage
            src="@/assets/video/icon_publish_time.svg"
            width="16px"
            height="16px"
          />
          <span>{{ formatDateCN(video.publishTime) }}</span>
        </span>
        <span class="meta-item">
          <AoImage
            src="@/assets/video/icon_duration.svg"
            width="16px"
            height="16px"
          />
          <span>时长 {{ formatDuration(video.video.duration) }}</span>
        </span>
        <span v-if="video.repostAllow" class="meta-item">
          <AoImage
            src="@/assets/video/icon_prohibit.svg"
            width="16px"
            height="16px"
          />
          <span>未经作者授权，禁止转载</span>
        </span>
      </div>
    </header>

    <!-- 第一行右：作者卡片（头像 / 名称 / 简介） -->
    <section class="author-card">
      <AoImage
        class="author-card__avatar"
        :src="video.author.avatar || defaultAvatar"
        width="40px"
        height="40px"
        circle
      />
      <div class="author-card__detail">
        <div class="author-card__name">{{ video.author.name }}</div>
        <div class="author-card__bio" :title="video.author.bio">
          {{ video.author.bio || '暂无简介' }}
        </div>
      </div>
    </section>

    <div class="video-detail__content">
      <div ref="playerRef" class="video-detail__player">
        <VideoPlayer
          :src="video.video.url"
          :poster="video.video.cover"
          :quality="qualityList"
        />
      </div>

      <div class="video-detail__actions">
        <div class="video-detail__tags">
          <span
            v-for="tag in video.tags.slice(0, 8)"
            :key="tag"
            class="tag-item"
            :title="tag"
          >
            {{ tag }}
          </span>
        </div>

        <div class="action-btns">
          <button
            type="button"
            class="action-item action-item--like"
            :class="{ 'is-active': liked }"
            @click="liked = !liked"
          >
            <component :is="likeIcon" class="action-item__icon" />
            <span class="action-item__text">
              {{ liked ? '已点赞' : '点赞' }} {{ formatCountCN(likeCount) }}
            </span>
          </button>

          <button
            type="button"
            class="action-item action-item--favorite"
            :class="{ 'is-active': favorited }"
            @click="favorited = !favorited"
          >
            <component :is="favoriteIcon" class="action-item__icon" />
            <span class="action-item__text">
              {{ favorited ? '已收藏' : '收藏' }}
              {{ formatCountCN(favoriteCount) }}
            </span>
          </button>

          <button
            type="button"
            class="action-item action-item--share"
            @click="handleShare"
          >
            <component :is="shareIcon" class="action-item__icon" />
            <span class="action-item__text">
              分享 {{ formatCountCN(video.meta.shareCount) }}
            </span>
          </button>
        </div>
      </div>

      <VideoDescription
        class="video-detail__description"
        :content="detailContent"
        :type="detailType"
      />

      <div class="video-detail__comments">
        <AoComment
          :comments="commentsList"
          :on-upload="handleUpload"
          @send="handleCommentSend"
          @reply="handleCommentReplySend"
        />
      </div>
    </div>

    <!-- 第二行右：章节（含付费信息） / 相关推荐 -->
    <aside class="video-detail__side">
      <!-- 无章节时只展示付费信息；有章节时付费信息 + 章节列表 -->
      <VideoChapters
        :chapters="chapterList"
        :paid="video.isPaid"
        :price="video.price"
        :current-id="currentChapterId"
        @select="handleChapterSelect"
      />

      <section v-if="recommendList.length" class="video-detail__related">
        <h2 class="side-title">相关推荐</h2>
        <VideoRecommend :data="recommendList" />
      </section>

      <!-- 相关站内应用 / 相关网站：同一通用组件，外链数据新窗口打开 -->
      <section v-if="relatedApps.length" class="video-detail__related">
        <h2 class="side-title">相关应用</h2>
        <RelatedApps :data="relatedApps" />
      </section>

      <section v-if="relatedSites.length" class="video-detail__related">
        <h2 class="side-title">相关网站</h2>
        <RelatedApps :data="relatedSites" />
      </section>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import VideoPlayer from '@/components/ao-video-player/index.vue';
import AoComment from '@/components/ao-comment/index.vue';
import { videoData } from '@/mock/videoData';
import { mockComments } from '@/mock/comment';
import { formatCountCN, formatDateCN, formatDuration } from '@/utils/format';
import VideoDescription from './components/VideoDescription.vue';
import VideoChapters from './components/VideoChapters.vue';
import VideoRecommend from './components/VideoRecommend.vue';
import RelatedApps from './components/RelatedApps.vue';
import { relatedApps, relatedSites } from '@/mock/videoRelated';
import likeIcon from '@/assets/video/icon_like.svg';
import favoriteIcon from '@/assets/video/icon_favorite.svg';
import shareIcon from '@/assets/video/icon_share.svg';
import type { Video, VideoChapter } from '@/api/type/video';
import type {
  CommentItemData,
  ImageItem,
  UploadFn,
} from '@/components/ao-comment';

defineOptions({ name: 'VideoDetail' });

const route = useRoute();

/** 作者没有头像时的兜底头像 */
const defaultAvatar = '@/assets/avatar.png';

const video = computed(() => {
  const id = Number(route.params.id);
  return (videoData.find((item) => item.id === id) ?? videoData[0]) as Video;
});

const chapterList = computed<VideoChapter[]>(() => video.value.chapters ?? []);

/**
 * 清晰度列表：默认高清。
 * 目前 mock 只有一份源文件，超清先指向同一地址占位；接入真实地址后替换 src 即可。
 */
const qualityList = computed(() => [
  { label: '高清', src: video.value.video.url },
  { label: '超清', src: video.value.video.url },
]);

const playerRef = ref<HTMLElement>();
const playerHeight = ref<number>();

let playerObserver: ResizeObserver | null = null;

onMounted(() => {
  playerObserver = new ResizeObserver((entries) => {
    const height = Math.round(entries[0].contentRect.height);
    if (height > 0) playerHeight.value = height;
  });
  if (playerRef.value) playerObserver.observe(playerRef.value);
});

const detailContent = computed(
  () => video.value.detail || video.value.description,
);

const detailType = computed<'markdown' | 'text'>(() =>
  video.value.detail ? 'markdown' : 'text',
);

const recommendList = computed(() =>
  videoData.filter((item) => item.isRecommended && item.id !== video.value.id),
);

const liked = ref(false);
const favorited = ref(false);

const likeCount = computed(
  () => video.value.meta.likeCount + (liked.value ? 1 : 0),
);
const favoriteCount = computed(
  () => video.value.meta.favoriteCount + (favorited.value ? 1 : 0),
);

// 分享：复制当前页面链接（不做提示展示）
const handleShare = async () => {
  const link = window.location.href;
  try {
    await navigator.clipboard.writeText(link);
  } catch {
    console.log('分享链接：', link);
  }
};

const currentChapterId = ref<number>();

/** 默认高亮最靠前的可播放章节 */
const findFirstChapterId = (list: VideoChapter[]): number | undefined => {
  if (!list.length) return undefined;
  const first = list[0];
  return findFirstChapterId(first.children ?? []) ?? first.id;
};

const handleChapterSelect = (chapter: VideoChapter) => {
  currentChapterId.value = chapter.id;
  // TODO 接入接口后在这里切换播放地址
  console.log('切换章节：', chapter.title);
};

const commentsList = ref<CommentItemData[]>([]);

const cloneComments = () =>
  JSON.parse(JSON.stringify(mockComments)) as CommentItemData[];

// 模拟上传图片
const handleUpload: UploadFn = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id: String(Date.now()),
        url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=xiaoming',
      });
    }, 1000);
  });

// 递归查找指定 id 的评论（包括嵌套回复）
const findCommentById = (list: CommentItemData[], id: number | string): any => {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.replies && item.replies.length > 0) {
      const found = findCommentById(item.replies as CommentItemData[], id);
      if (found) return found;
    }
  }
  return null;
};

const handleCommentSend = (data: { text: string; images: ImageItem[] }) => {
  commentsList.value.push({
    id: Date.now(),
    user: {
      id: 0,
      name: '当前用户',
      avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=video-user-2',
    },
    content: data.text,
    images: data.images,
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    parentId: null,
    replyTo: null,
    replies: [],
  } as CommentItemData);
};

const handleCommentReplySend = (data: {
  commentId: number | string;
  text: string;
  images: ImageItem[];
}) => {
  const targetComment = findCommentById(commentsList.value, data.commentId);
  if (!targetComment) {
    console.warn('未找到对应评论，commentId:', data.commentId);
    return;
  }
  if (!targetComment.replies) targetComment.replies = [];
  targetComment.replies.push({
    id: Date.now(),
    user: {
      id: 0,
      name: '当前用户',
      avatar: 'https://api.dicebear.com/9.x/bottts/svg?seed=video-user-3',
    },
    content: data.text,
    images: data.images,
    replyTo: targetComment.user.name,
    createdAt: new Date().toISOString(),
    likes: 0,
    dislikes: 0,
    parentId: targetComment.id,
    replies: [],
  } as CommentItemData);
};

watch(
  () => video.value.id,
  () => {
    liked.value = false;
    favorited.value = false;
    commentsList.value = cloneComments();
    currentChapterId.value = findFirstChapterId(chapterList.value);
  },
  { immediate: true },
);

watch(
  () => video.value.title,
  (title) => {
    document.title = title;
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  playerObserver?.disconnect();
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
