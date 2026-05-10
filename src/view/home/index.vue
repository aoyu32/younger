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
        <AoBanner :screenshots="bannerImage"/>
      </div>
      <div class="banner_right">
        <div class="right_top">
          <CalendarCard />
        </div>
        <div class="right_bottom">
          <NewsCard :data="news" />
        </div>
      </div>
    </div>
    <div class="home_content" id="tools">
      <div class="content_left">
        <div class="content-wrapper" ref="leftWrapperRef">
          <AoPage
            v-model:current="currentAppCardPage"
            :size="8"
            :total="apps.length"
            ref="aoPageRef"
          >
            <template #controls="{ isPrev, isNext, change }">
              <div class="content_label">
                <h3>实用工具</h3>
                <div class="label_text flex-x">
                  <div
                    class="pre-btn"
                    @click="change('pre')"
                    :class="{ disabled: isPrev }"
                    v-if="apps.length > appCardPageSize"
                  >
                    <AoImage src="@/assets/home/icon_pre.svg" />
                  </div>
                  <span>超级好用的APP</span>
                  <div
                    class="next-btn"
                    @click="change('next')"
                    :class="{ disabled: isNext }"
                    v-if="apps.length > appCardPageSize"
                  >
                    <AoImage src="@/assets/home/icon_next.svg" />
                  </div>
                </div>
              </div>
            </template>
            <div class="apps_grid">
              <div class="apps_item" v-for="item in appList" :key="item.id">
                <router-link :to="`/app/detail/${item.id}`">
                  <AppCard :app="item" />
                </router-link>
              </div>
            </div>
          </AoPage>
        </div>
      </div>

      <div class="content_right">
        <div class="content-wrapper" ref="rightWrapperRef">
          <AoPage
            v-model:current="currentWebToolPage"
            :size="webToolPageSize"
            :total="tools.length"
          >
            <template #controls="{ isNext, isPrev, change }">
              <div class="content_label">
                <h3>网页工具</h3>
                <div class="label_text flex-x">
                  <div
                    class="pre-btn"
                    @click="change('pre')"
                    :class="{ disabled: isPrev }"
                  >
                    <AoImage src="@/assets/home/icon_pre.svg" />
                  </div>
                  <span>常用在线工具与站点</span>
                  <div
                    class="next-btn"
                    @click="change('next')"
                    :class="{ disabled: isNext }"
                  >
                    <AoImage src="@/assets/home/icon_next.svg" />
                  </div>
                </div>
              </div>
            </template>
            <div
              class="webs_grid"
              @mouseleave="showPointer = false"
              ref="websGridRef"
            >
              <div
                class="pointer"
                ref="webToolPointerRef"
                v-show="showPointer"
              ></div>
              <div
                class="webs_item"
                v-for="tool in displayedTools"
                :key="tool.id"
                @mouseenter="handleMouseEnterWebTool"
              >
                <WebToolCard :tool="tool" />
              </div>
            </div>
          </AoPage>
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
          <router-link :to="`/video/${item.id}`" target="_blank">
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
import { newsData } from '@/mock/news';
import ScrollText from './components/ScrollText.vue';
import CalendarCard from './components/CalendarCard.vue';
import NewsCard from './components/NewsCard.vue';
import AoImage from '@/components/ao-image/index.vue';
import AoPage from '@/components/ao-page/index.vue';
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
const news = ref(newsData);
const webToolPointerRef = ref<HTMLElement>();
const showPointer = ref<boolean>(false);
const currentAppCardPage = ref(1);
const currentWebToolPage = ref(1);
const appCardPageSize = ref(8);
const webToolPageSize = ref(20);
// 计算属性
const appList = computed(() => {
  const start = (currentAppCardPage.value - 1) * appCardPageSize.value;
  return apps.value.slice(start, start + appCardPageSize.value).map((app) => ({
    ...app,
    size: Math.floor(app.size / 1024 / 1024),
  }));
});

// 数据获取（模拟）
const getData = () => {
  console.log(apps.value);
};

// 当前页显示的工具
const displayedTools = computed(() => {
  const start = (currentWebToolPage.value - 1) * webToolPageSize.value;
  console.log(start);

  return tools.value.slice(start, start + webToolPageSize.value);
});

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
  document.title = '洋果教育 - 首页';
});

onBeforeUnmount(() => {});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
