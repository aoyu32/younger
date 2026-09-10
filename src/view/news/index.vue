<template>
  <div class="news">
    <div class="slogan">
      <PageSlogan
        content="查看最新AI资讯，跟随AI时代的发展脚本来发展自己。"
        sub-content="AI资讯"
      />
      <div class="section-wrapper flex">
        <div class="wrapper-left">
          <div class="topic">
            <TodayTopic
              :content="topicContent"
              :date="topicDate"
              :people-count="peopleCount"
              :comments="commentList"
            />
          </div>
          <div class="line">
            <AoImage
              src="@/assets/news/icon_finish_line.svg"
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
          <div class="hot-course"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageSlogan from '@/components/page-slogan/index.vue';
import TodayTopic from './components/TodayTopic.vue';
import NewsListCard from './components/NewsListCard.vue';

const topicContent = ref(
  '今天我们来聊一聊 AI 生成内容（AIGC）对内容创作领域的影响。你是否感受到了 AI 带来的效率提升？或者担心它取代创意工作？欢迎分享你的观点！',
);

const topicDate = ref('2026-09-09');
const peopleCount = ref('1.2k');

const commentList = ref([]);

const newNewsList = ref([
  {
    id: 1,
    title: 'OpenAI 发布 GPT-5 预览版，多模态能力大幅提升',
    summary: '新模型支持图像、音频和文本的联合推理，预计年底正式上线。',
    cover: 'https://picsum.photos/seed/ai1/80/60',
    views: 15800,
  },
  {
    id: 2,
    title: 'Google DeepMind 推出 AlphaFold 3，加速药物研发',
    summary: '蛋白质结构预测精度再创新高，有望大幅缩短新药研发周期。',
    cover: 'https://picsum.photos/seed/ai2/80/60',
    views: 9200,
  },
  {
    id: 3,
    title: '国内首个 AI 大模型合规备案名单公布，百度、阿里、腾讯在列',
    summary: '首批通过备案的大模型将率先面向公众提供服务。',
    cover: 'https://picsum.photos/seed/ai3/80/60',
    views: 6700,
  },
  {
    id: 5,
    title: '微软 Copilot 全面集成 Office 全家桶，提升办公效率',
    summary: '用户可通过自然语言指令完成文档、表格、幻灯片创作。',
    cover: 'https://picsum.photos/seed/ai5/80/60',
    views: 24500,
  },
  {
    id: 6,
    title: 'AI 芯片大战：NVIDIA H200 发布，AMD 紧随其后',
    summary: '算力军备竞赛加速，AI 基础设施投资持续升温。',
    cover: 'https://picsum.photos/seed/ai6/80/60',
    views: 19800,
  },
]);

const handleNewsClick = (id: string | number) => {
  console.log('点击资讯 ID:', id);
};
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
