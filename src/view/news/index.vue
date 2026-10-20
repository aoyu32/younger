<template>
  <div class="news">
    <div class="slogan">
      <PageSlogan
        content="追踪 AI 前沿资讯，读懂正在发生的未来。"
        sub-content="AI资讯"
      />
      <div class="section-wrapper flex">
        <div class="wrapper-left">
          <div class="topic">
            <TodayTopic
              :content="topicContent"
              :date="topicDate"
              :people-count="peopleCount"
              :comments="topicMessages"
            />
          </div>
          <div class="line">
            <AoImage
              src="@/assets/news/icon_love_arrow_line.svg"
              width="100%"
              height="40px"
              fit="contain"
            ></AoImage>
          </div>
          <div class="new-news">
            <NewsListCard
              label="最新资讯"
              sub-label="今日更新"
              :list="newNewsList"
              @click="handleNewsClick"
            />
          </div>
        </div>
        <div class="wrapper-right">
          <div class="hot-course">
            <HotCourseList
              label="热门课程"
              sub-label="推荐学习"
              :list="hotCourseList"
              @click="handleCourseClick"
            />
          </div>
        </div>
      </div>
      <div class="tabs-wrapper">
        <NewsTabs
          v-model="activeTab"
          :tabs="newsTabs"
          :list="currentTabList"
          @card-click="handleCardClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTopic } from '@/store/module/topic';
import PageSlogan from '@/components/page-slogan/index.vue';
import TodayTopic from './components/TodayTopic.vue';
import NewsListCard from './components/NewsListCard.vue';
import HotCourseList from './components/HotCourseList.vue';
import NewsTabs from './components/NewsTabs.vue';
import { aiImagePool } from '@/mock/aiImages';
import {
  aiNewsCategories,
  aiNewsData,
  latestAiNews,
  type AiNewsItem,
} from '@/mock/aiNews';

const router = useRouter();

const { latestTopic } = useTopic();

const topicContent = computed(() => latestTopic.value?.title ?? '');
const topicDate = computed(() => latestTopic.value?.date ?? '');
const peopleCount = computed(() =>
  String(latestTopic.value?.participants ?? 0),
);

const topicMessages = computed(() =>
  (latestTopic.value?.messages ?? []).slice(0, 2).map((message) => ({
    id: message.id,
    user: message.user.name,
    avatar: message.user.avatar,
    text: message.content?.trim() ?? '',
    images: message.images ?? [],
    likes: message.likes ?? 0,
  })),
);

const newNewsList = computed(() =>
  latestAiNews.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    cover: item.cover,
    views: item.viewCount,
  })),
);

const handleNewsClick = (id: string | number) => {
  router.push(`/news/${id}`);
};

const hotCourseList = ref([
  {
    id: 1,
    name: '大模型应用开发实战',
    desc: '从 0 到 1 构建你的 AI 应用',
    image: aiImagePool[5],
    studingCount: 28640,
  },
  {
    id: 2,
    name: '提示词工程从入门到精通',
    desc: '结构化提示词与评测方法',
    image: aiImagePool[16],
    studingCount: 19280,
  },
  {
    id: 3,
    name: 'RAG 知识库实战',
    desc: 'Embedding、向量库与引用',
    image: aiImagePool[11],
    studingCount: 15760,
  },
  {
    id: 4,
    name: 'AI Agent 开发指南',
    desc: '工具调用、MCP 与多智能体',
    image: aiImagePool[12],
    studingCount: 13420,
  },
  {
    id: 5,
    name: 'AIGC 视觉创作工作流',
    desc: 'Midjourney + 可灵 + Runway',
    image: aiImagePool[7],
    studingCount: 21800,
  },
  {
    id: 6,
    name: '多模态大模型应用',
    desc: '图文、视频与语音统一理解',
    image: aiImagePool[13],
    studingCount: 11650,
  },
  {
    id: 7,
    name: 'AI 产品经理实战',
    desc: '从需求验证到上线复盘',
    image: aiImagePool[14],
    studingCount: 9860,
  },
  {
    id: 8,
    name: '深度学习与 PyTorch',
    desc: '从张量到模型微调',
    image: aiImagePool[8],
    studingCount: 18700,
  },
  {
    id: 9,
    name: 'AI 编程与代码智能',
    desc: 'Copilot、Cursor 与代码审查',
    image: aiImagePool[9],
    studingCount: 16400,
  },
  {
    id: 10,
    name: 'AI 数据分析实战',
    desc: '用自然语言完成数据洞察',
    image: aiImagePool[15],
    studingCount: 7300,
  },
]);

const handleCourseClick = (id: string | number) => {
  const course = hotCourseList.value.find((item) => item.id === id);
  router.push({
    name: 'totorial',
    query: { chapter: String(id), title: course?.name ?? '' },
  });
};

/* ================= 分类 Tab 列表 ================= */
const newsTabs = aiNewsCategories;
const activeTab = ref('all');

type NewsCard = {
  id: string | number;
  title: string;
  content: string;
  cover?: string;
  date?: string;
  viewCount?: number;
  likeCount?: number;
  collectCount?: number;
};

const toNewsCard = (item: AiNewsItem): NewsCard => ({
  id: item.id,
  title: item.title,
  content: item.summary,
  cover: item.cover,
  date: item.date,
  viewCount: item.viewCount,
  likeCount: item.likeCount,
  collectCount: item.collectCount,
});

const currentTabList = computed(() => {
  const list =
    activeTab.value === 'all'
      ? aiNewsData
      : aiNewsData.filter((item) => item.category === activeTab.value);

  return list.map(toNewsCard);
});

const handleCardClick = (id: string | number) => {
  router.push(`/news/${id}`);
};
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
