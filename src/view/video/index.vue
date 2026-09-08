<template>
  <div class="video">
    <PageSlogan content="看得见的教程，带得走的技能。" sub-content="教程中心" />
    <div class="video-main">
      <div class="swipper-wrapper">
        <VideoSwipper />
        <div class="link-video">
          <div class="title flex">
            <div class="left">
              <div class="tag">最新</div>
              <span>梁老师最新AI Coding教程</span>
            </div>
            <div class="right">已有2000人观看</div>
          </div>
          <div class="player">
            <VideoPlayer
              src="http://114.55.176.18:19000/younger/video/37768793798-1-192.mp4"
              :controls="false"
              :hover-play="true"
              :auto-play="false"
            />
          </div>
        </div>
      </div>
      <div class="nav-wrapper">
        <VideoWaterfallNav v-model="activeNavItem" :menu-items="navList" />
      </div>
      <div class="video-list">
        <div class="video-item" v-for="item in videoData">
          <VipVideoCard :data="item" />
        </div>
      </div>
      <VideoSection
        v-for="data in categoryData"
        :title="data.category"
        :sub-title="data.categoryDesc"
        :items="data.list"
      >
        <template #video-card="{ item }">
          <router-link :to="`/video/${item.id}`">
            <VipVideoCard :data="item" />
          </router-link>
        </template>
      </VideoSection>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import PageSlogan from '@/components/page-slogan/index.vue';
import VideoSection from './components/VideoSection.vue';
import { categoryData } from '@/mock/videoLIst';
import VipVideoCard from '../home/components/VipVideoCard.vue';
import VideoSwipper from './components/VideoSwipper.vue';
import VideoWaterfallNav from './components/VideoWaterfallNav.vue';
import type { MenuItem } from './components/VideoWaterfallNav.vue';
import { videoData } from '@/mock/videoData';
import VideoPlayer from '@/components/video-player/index.vue';
const activeNavItem = ref<string | number>('ai-paint');
const navList = ref<MenuItem[]>([
  { id: 'all', label: '全部', icon: '' },
  { id: 'ai-paint', label: 'AI绘画', icon: '' },
  { id: 'ai-video', label: 'AI视频制作', icon: '' },
  { id: 'vibe-coding', label: 'VibeCoding', icon: '' },
  { id: 'cursor', label: 'Cursor教程', icon: '' },
  { id: 'chatgpt', label: 'ChatGPT', icon: '' },
  { id: 'claude', label: 'Claude', icon: '' },
  { id: 'stable-diffusion', label: 'Stable Diffusion', icon: '' },
  { id: 'midjourney', label: 'Midjourney', icon: '' },
  { id: 'suno', label: 'Suno音乐', icon: '' },
  { id: 'runway', label: 'Runway', icon: '' },
  { id: 'comfyui', label: '大模型与基础技术', icon: '' },
  { id: 'comfyui', label: 'AI 应用与工具', icon: '' },
  { id: 'comfyui', label: '多模态与 AIGC', icon: '' },
  { id: 'comfyui', label: '智能体与自动化', icon: '' },
]);
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
