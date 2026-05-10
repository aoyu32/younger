<template>
  <div class="news-detail" ref="detailRef">
    <div class="content-wrapper flex-col">
      <div class="content">
        <div class="news-header flex-col">
          <h1>{{ data?.title }}</h1>
          <div class="news-meta flex-x">
            <div class="meta-item flex-center">
              <AoIcon :icon="authorIcon" :size="14" />
              <span> {{ data?.author.name }}</span>
            </div>
            <div class="meta-item flex-center date">
              <AoIcon :icon="dateIcon" :size="14" />
              <span> {{ data?.publishDate }}</span>
            </div>
            <div class="meta-item flex-center views">
              <AoIcon :icon="viewsIcon" :size="14" />
              <span> {{ formatCount(data?.views) }}</span>
            </div>
          </div>
        </div>
        <div class="news-content">
          <div class="md-preview-wrapper" v-if="data?.content">
            <AoMarkdown
              mode="preview"
              :content="data.content"
              editor-id="ao-markdown"
              @get-catalog="handleGetCatalog"
            />
            <div class="content-footer flex-between">
              <div class="labels flex">
                <div class="label">标签：</div>
                <div
                  class="label-item"
                  v-for="(item, index) in data.tags.slice(0, 5)"
                  :key="index"
                >
                  {{ item }}
                </div>
              </div>
              <div class="actions flex-center">
                <div class="action-item flex-center like">
                  <AoIcon
                    :icon="likeIcon"
                    color="#8a8a8a"
                    hover-color="#f05050"
                    :size="20"
                  />
                  <span class="action-text">{{ formatCount(data.likes) }}</span>
                </div>
                <div class="action-item flex-center">
                  <AoIcon
                    :icon="favoriteIcon"
                    color="#8a8a8a"
                    hover-color="#f0a030"
                    :size="20"
                  />
                  <span class="action-text favorite">{{
                    formatCount(data.favorites)
                  }}</span>
                </div>
                <div class="action-item flex-center share">
                  <AoIcon
                    :icon="shareIcon"
                    color="#8a8a8a"
                    hover-color="#4090f0"
                    :size="20"
                  />
                  <span class="action-text">{{
                    formatCount(data.shares)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="empty-content flex-center" v-else>
            <AoImage
              src="@/assets/news/icon_empty.svg"
              width="100px"
              height="100px"
            />
            <p>文章内容不见了，快去找找吧！</p>
          </div>
        </div>
      </div>
      <div class="news-comment">
        <AoComment
          :comments="commentsList"
          :on-upload="handleUpload"
          @send="handleCommentSend"
          @reply="handleCommentReplySend"
        />
      </div>
    </div>

    <div class="news-sidebar" ref="sidebarRef">
      <div class="sidebar-inner" ref="sidebarInnerRef">
        <div class="news-outline">
          <div class="outline-header">
            <div class="title">目录</div>
          </div>
          <div class="outline-content">
            <NewsCatalog :data="{ catalogs: catalogList, offsetTop: 72 }" />
          </div>
        </div>
        <div class="news-other">
          <NewsRecommend :news-list="newsData" @click="handleNewsRecommend" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { formatCount } from '@/utils/format';
import AoMarkdown from '@/components/ao-markdown/index.vue';
import { newsData } from '@/mock/news';
import AoComment from '@/components/ao-comment/index.vue';
import { mockComments } from '@/mock/comment.js';
import authorIcon from '@/assets/news/icon_author.svg';
import dateIcon from '@/assets/news/icon_date.svg';
import viewsIcon from '@/assets/news/icon_views.svg';
import likeIcon from '@/assets/news/icon_like.svg';
import favoriteIcon from '@/assets/news/icon_favorite.svg';
import shareIcon from '@/assets/news/icon_share.svg';
import type { UploadFn } from '@/components/ao-comment';
import NewsCatalog from './components/NewsCatalog.vue';
import NewsRecommend from './components/NewsRecommend.vue';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);

const data = computed(() =>
  newsData.find((item) => item.id === Number(id.value)),
);
const commentsList = ref(mockComments);
const catalogList = ref();
const sidebarInnerRef = ref<HTMLElement>();

let lastScrollY = window.scrollY;
let currentTranslate = 0;
const headerHeight = 72;
const gap = 15;

const onScroll = () => {
  const inner = sidebarInnerRef.value;
  if (!inner) return;

  const scrollY = window.scrollY;
  const delta = scrollY - lastScrollY;
  lastScrollY = scrollY;

  const innerHeight = inner.offsetHeight;
  const viewportHeight = window.innerHeight;
  const availableHeight = viewportHeight - headerHeight - gap;

  if (innerHeight > availableHeight) {
    currentTranslate -= delta;
    const maxTranslate = 0;
    const minTranslate = -(innerHeight - availableHeight);
    currentTranslate = Math.min(
      maxTranslate,
      Math.max(minTranslate, currentTranslate),
    );
    inner.style.transform = `translateY(${currentTranslate}px)`;
  } else {
    currentTranslate = 0;
    inner.style.transform = 'translateY(0)';
  }
};

onMounted(() => {
  lastScrollY = window.scrollY;
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});

const handleGetCatalog = (catalogs: any) => {
  catalogList.value = catalogs;
};

const handleNewsRecommend = (item: any) => {
  console.log(item);

  router.push(`/news/${item.id}`);
};

const handleUpload: UploadFn = async (images: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        id: String(Date.now()),
        url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=xiaoming',
      });
    }, 1000);
  });
};

function findCommentById(list: any, id: any): any {
  for (const item of list) {
    if (item.id === id) return item;
    if (item.replies?.length) {
      const found = findCommentById(item.replies, id);
      if (found) return found;
    }
  }
  return null;
}

const handleCommentSend = (payload: any) => {
  commentsList.value.push({
    id: Date.now(),
    user: { name: '当前用户', avatar: 'https://picsum.photos/50/50?random=2' },
    content: payload.text,
    images: payload.images,
    createdAt: new Date().toISOString(),
  } as any);
};

const handleCommentReplySend = (payload: any) => {
  const target = findCommentById(commentsList.value, payload.commentId);
  if (!target) return;
  if (!target.replies) target.replies = [];
  target.replies.push({
    id: Date.now(),
    user: { name: '当前用户', avatar: 'https://picsum.photos/50/50?random=3' },
    content: payload.text,
    images: payload.images,
    replyTo: target.user.name,
    createdAt: new Date().toISOString(),
  });
};
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
