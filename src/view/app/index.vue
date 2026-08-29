<template>
  <div class="app">
    <div class="slogan">
      <PageSlogan
        content="学会使用一个APP，就是掌握一项新技能。 "
        sub-content="应用中心"
      />
    </div>
    <div class="app-top">
      <div class="header">
        <div class="label">应用图谱</div>
        <div class="search">
          <div
            class="refresh search-btn"
            style="margin-right: 10px"
            title="重新生成布局"
            @click="handleRefresh"
          >
            <AoImage
              src="@/assets/app/icon_refresh.svg"
              width="12px"
              height="12px"
            ></AoImage>
          </div>
          <div class="search-btn" title="上一个" @click="focusPrev">
            <AoImage
              src="@/assets/home/icon_pre.svg"
              width="12px"
              height="12px"
            ></AoImage>
          </div>
          <div class="input-wrapper">
            <input
              v-model="searchText"
              class="search-input"
              type="text"
              placeholder="寻找你的目标APP"
              @keydown.enter="focusNext"
            />
            <div class="res-count">{{ searchCountText }}</div>
          </div>
          <div class="search-btn" title="下一个" @click="focusNext">
            <AoImage
              src="@/assets/home/icon_next.svg"
              width="12px"
              height="12px"
            ></AoImage>
          </div>
        </div>
      </div>
      <app-graph
        ref="appMapRef"
        :search-text="searchText"
        :search-index="searchIndex"
        @match-count="onMatchCount"
        @app-count="onAppCount"
      ></app-graph>
      <div class="footer flex-between">
        <div class="tips flex">
          <div class="tip">CTRL + 鼠标滚轮： 缩放画布</div>
          <div class="tip">鼠标左键：拖动画布</div>
          <div class="tip">节点可拖动</div>
          <div class="tip">节点可点击</div>
        </div>
        <div class="tip">共 {{ appTotal }} 个APP</div>
      </div>
    </div>
    <div class="app-bottom">
      <div class="label flex-between">
        <div class="title">分类导航</div>
        <div class="desc">点击导航项，快速分类查找你的目标APP</div>
      </div>
      <div class="app-category">
        <AppCanvasNav />
      </div>
      <div class="app-category-list">
        <div class="category-label flex-between">
          <div class="title">AI应用</div>
          <div class="sub-title">目前最热门的AI应用</div>
        </div>
        <div class="app-list">
          <div class="app-item" v-for="item in apps">
            <router-link :to="`/app/${item.id}`">
              <ApplicationCard :app="item" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppGraph from './components/app-graph/index.vue';
import AppCanvasNav from './components/AppCanvasNav.vue';
import ApplicationCard from './components/ApplicationCard.vue';
import PageSlogan from '@/components/page-slogan/index.vue';
import { appData } from '@/mock/appData';
const apps = ref(appData);
const appMapRef = ref<InstanceType<typeof AppGraph> | null>(null);

// 刷新：重新随机生成节点位置并重播生成动画
const handleRefresh = () => {
  appMapRef.value?.regenerate();
};

// 搜索：文本 + 匹配索引（上一个/下一个切换）
const searchText = ref('');
const searchIndex = ref(0);
const matchCount = ref(0);

// app-map 匹配后上报匹配总数，供计数显示
const onMatchCount = (count: number) => {
  matchCount.value = count;
};

// 应用总数（app-map 渲染后上报）
const appTotal = ref(0);
const onAppCount = (count: number) => {
  appTotal.value = count;
};

// 搜索结果计数文本：当前第几个 / 共几个
const searchCountText = computed(() => {
  if (matchCount.value === 0) return '0/0';
  const idx =
    ((searchIndex.value % matchCount.value) + matchCount.value) %
    matchCount.value;
  return `${idx + 1}/${matchCount.value}`;
});

const focusNext = () => {
  if (matchCount.value === 0) return;
  searchIndex.value = (searchIndex.value + 1) % matchCount.value;
};

const focusPrev = () => {
  if (matchCount.value === 0) return;
  searchIndex.value =
    (searchIndex.value - 1 + matchCount.value) % matchCount.value;
};

// 文本变化时重置索引
watch(searchText, () => {
  searchIndex.value = 0;
});
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
