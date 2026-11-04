<template>
  <div class="video">
    <PageSlogan content="看得懂的视频教程，学得会的人工智能。" sub-content="教程中心" />
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
      <div class="nav-wrapper" ref="navAnchorRef">
        <VideoWaterfallNav v-model="activeNavItem" :menu-items="navList" />
      </div>
      <!-- 「全部」下把所有分类视频合并成一组展示，不再重复展示分类区块 -->
      <div class="video-list" v-if="activeNavItem === 'all'">
        <div class="video-item" v-for="item in allVideoList" :key="item.id">
          <router-link :to="`/video/${item.id}`">
            <VipVideoCard :data="item" />
          </router-link>
        </div>
      </div>
      <VideoSection
        v-for="data in filteredCategoryData"
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

    <!-- 分类导航滚出视口后，顶部吸顶分类栏 -->
    <AoStickyTabs
      v-model="activeNavItem"
      :items="navList"
      :anchor="navAnchorRef"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import PageSlogan from '@/components/page-slogan/index.vue';
import VideoSection from './components/VideoSection.vue';
import { categoryData } from '@/mock/videoLIst';
import VipVideoCard from '../home/components/VipVideoCard.vue';
import VideoSwipper from './components/VideoSwipper.vue';
import VideoWaterfallNav from './components/VideoWaterfallNav.vue';
import AoStickyTabs from '@/components/ao-sticky-tabs/index.vue';
import type { MenuItem } from './components/VideoWaterfallNav.vue';
import VideoPlayer from '@/components/ao-video-player/index.vue';
const activeNavItem = ref<string | number>('all');
/** 分类导航容器：滚出视口顶部后显示吸顶分类栏 */
const navAnchorRef = ref<HTMLElement>();
/** 分类导航与 mock 分组数据同源：全部 + categoryData 的真实分类，不会出现点了却没数据的分类 */
const navList = ref<MenuItem[]>([
  { id: 'all', label: '全部', icon: '' },
  ...categoryData.map(
    (data): MenuItem => ({ id: data.category, label: data.category, icon: '' }),
  ),
]);
/** 「全部」下合并所有分类视频，并按 id 去重 */
const allVideoList = computed(() =>
  Array.from(
    new Map(
      categoryData
        .flatMap((data) => data.list)
        .map((item) => [item.id, item]),
    ).values(),
  ),
);
/** 点击某分类时只展示该分类的视频区块 */
const filteredCategoryData = computed(() =>
  activeNavItem.value === 'all'
    ? []
    : categoryData.filter((data) => data.category === activeNavItem.value),
);
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
