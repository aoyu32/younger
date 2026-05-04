<template>
  <div class="home">
    <div class="home_text">
      <ScrollText
        lable="站长说"
        text="THE  MORE YOU LEARN，THE YOUNGER YOU BECOME（越学习，越年轻）"
        height="40px"
        :speed="60"
      />
    </div>
    <div class="home_banner">
      <div class="banner_left">
        <AoBanner :screenshots="bannerImage" width="800px" height="450px" />
      </div>
      <div class="banner_right">
        <div class="right_top">
          <CalendarCard />
        </div>
        <div class="right_bottom">
          <NewsCard />
        </div>
      </div>
    </div>
    <div class="home_content" id="tools">
      <div class="content_left">
        <div class="content-wrapper" ref="leftWrapperRef">
          <div class="content_label">
            <h3>实用工具</h3>
            <div class="label_text">
              <span>值得放入收藏夹的实用利器</span>
            </div>
          </div>

          <div class="apps_grid">
            <div class="apps_item" v-for="item in appList" :key="item.id">
              <router-link to="/app/detail">
                <AppCard :app="item" />
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="content_right">
        <div class="content-wrapper" ref="rightWrapperRef">
          <div class="content_label">
            <h3>网页工具</h3>
            <div class="label_text">
              <span>常用在线工具与站点</span>
            </div>
          </div>

          <div class="webs_grid" @mouseleave="showPointer = false">
            <div
              class="pointer"
              ref="webToolPointerRef"
              v-show="showPointer"
            ></div>
            <div
              class="webs_item"
              v-for="tool in webToolList"
              :key="tool.id"
              @mouseenter="handleMouseEnterWebTool"
            >
              <WebToolCard :tool="tool" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="video_content" id="videos">
      <div class="video_label">
        <div class="content_label">
          <h3>视频专区</h3>
          <div class="label_text">
            <span>精选 AI 学习内容</span>
          </div>
        </div>
      </div>
      <div class="video_list">
        <div class="video_item" v-for="item in videos" :key="item.id">
          <router-link :to="`/video/${item.id}`">
            <VideoCard :data="item" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
import AoBanner from '@/components/ao-banner/index.vue';
import AppCard from '@/view/home/components/AppCard.vue';
import WebToolCard from '@/view/home/components/WebToolCard.vue';
import VideoCard from '@/view/home/components/VideoCard.vue';
import { appData } from '@/mock/appData';
import { webTools } from '@/mock/webTools';
import { videoData } from '@/mock/videoData';
import ScrollText from './components/ScrollText.vue';
import CalendarCard from './components/CalendarCard.vue';
import NewsCard from './components/NewsCard.vue';

defineOptions({
  name: 'Home',
});

// 响应式数据
const bannerImage = ref([
  'https://picsum.photos/800/450?random=1',
  'https://picsum.photos/800/450?random=2',
  'https://picsum.photos/800/450?random=3',
  'https://picsum.photos/800/450?random=4',
  'https://picsum.photos/800/450?random=5',
  'https://picsum.photos/800/450?random=6',
]);
const apps = ref(appData);
const tools = ref(webTools);
const videos = ref(videoData);
const webToolPointerRef = ref<HTMLElement>();
const showPointer = ref<boolean>(false);

// 计算属性
const appList = computed(() => {
  return apps.value
    .map((app) => ({
      ...app,
      size: Math.floor(app.size / 1024 / 1024),
    }))
    .slice(0, 8);
});

const webToolList = computed(() => {
  return tools.value.slice(0, 20);
});

// DOM 引用
const leftWrapperRef = ref<HTMLElement | null>(null);
const rightWrapperRef = ref<HTMLElement | null>(null);

// MutationObserver 实例
let heightObserver: MutationObserver | null = null;

// 同步左右高度的方法
const syncHeights = () => {
  nextTick(() => {
    const leftWrapper = leftWrapperRef.value;
    const rightWrapper = rightWrapperRef.value;
    if (!leftWrapper || !rightWrapper) return;

    rightWrapper.style.height = 'auto';
    const h = leftWrapper.getBoundingClientRect().height;
    const target = Math.max(420, Math.ceil(h || 0));
    rightWrapper.style.height = `${target}px`;
  });
};

// 数据获取（模拟）
const getData = () => {
  console.log(apps.value);
};

const handleMouseEnterWebTool = (event: MouseEvent) => {
  const targetEl = event.currentTarget as HTMLElement;
  showPointer.value = true;
  console.log(targetEl.offsetWidth, targetEl.offsetHeight);

  if (webToolPointerRef.value) {
    webToolPointerRef.value.style.setProperty(
      '--pointer-width',
      targetEl?.offsetWidth + 'px',
    );
    webToolPointerRef.value.style.setProperty(
      '--pointer-height',
      targetEl.offsetHeight + 'px',
    );
    webToolPointerRef.value.style.setProperty(
      '--pointer-x',
      targetEl.offsetLeft + 'px',
    );
    webToolPointerRef.value.style.setProperty(
      '--pointer-y',
      targetEl.offsetTop + 'px',
    );
  }
};

// 生命周期
onMounted(() => {
  getData();
  nextTick(() => {
    syncHeights();
    window.addEventListener('resize', syncHeights);

    const leftWrapper = leftWrapperRef.value;
    if (leftWrapper && typeof MutationObserver !== 'undefined') {
      heightObserver = new MutationObserver(() => {
        syncHeights();
      });
      heightObserver.observe(leftWrapper, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }
  });
});

onBeforeUnmount(() => {
  // window.removeEventListener('resize', syncHeights);
  if (heightObserver) {
    heightObserver.disconnect();
    heightObserver = null;
  }
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
