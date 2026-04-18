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

          <div class="webs_grid">
            <div class="webs_item" v-for="tool in webTools" :key="tool.id">
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
          <VideoCard :video="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'
import AoBanner from '@/components/banner/AoBanner.vue'
import AppCard from '@/view/home/components/AppCard.vue'
import WebToolCard from '@/view/home/components/WebToolCard.vue'
import VideoCard from '@/view/home/components/VideoCard.vue'
import { appData } from '@/mock/appData'
import { webTools } from '@/mock/webTools'
import { videoData } from '@/mock/videoData'
import ScrollText from './components/ScrollText.vue'
import CalendarCard from './components/CalendarCard.vue'
import NewsCard from './components/NewsCard.vue'

defineOptions({
  name: 'Home'
})

// 响应式数据
const bannerImage = ref([
  'https://picsum.photos/800/450?random=1',
  'https://picsum.photos/800/450?random=2',
  'https://picsum.photos/800/450?random=3',
  'https://picsum.photos/800/450?random=4',
  'https://picsum.photos/800/450?random=5',
  'https://picsum.photos/800/450?random=6'
])
const apps = ref(appData)
const videos = ref(videoData)

// 计算属性
const appList = computed(() => {
  return apps.value.map((app) => ({
    ...app,
    size: Math.floor(app.size / 1024 / 1024)
  }))
})

// DOM 引用
const leftWrapperRef = ref(null)
const rightWrapperRef = ref(null)

// MutationObserver 实例
let heightObserver = null

// 同步左右高度的方法
const syncHeights = () => {
  nextTick(() => {
    const leftWrapper = leftWrapperRef.value
    const rightWrapper = rightWrapperRef.value
    if (!leftWrapper || !rightWrapper) return

    rightWrapper.style.height = 'auto'
    const h = leftWrapper.getBoundingClientRect().height
    const target = Math.max(420, Math.ceil(h || 0))
    rightWrapper.style.height = `${target}px`
  })
}

// 数据获取（模拟）
const getData = () => {
  console.log(apps.value)
}

// 生命周期
onMounted(() => {
  getData()
  nextTick(() => {
    syncHeights()
    window.addEventListener('resize', syncHeights)

    const leftWrapper = leftWrapperRef.value
    if (leftWrapper && typeof MutationObserver !== 'undefined') {
      heightObserver = new MutationObserver(() => {
        syncHeights()
      })
      heightObserver.observe(leftWrapper, {
        childList: true,
        subtree: true,
        attributes: true
      })
    }
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncHeights)
  if (heightObserver) {
    heightObserver.disconnect()
    heightObserver = null
  }
})
</script>

<style lang="scss" scoped>

.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: normal;
  justify-content: center;

  .home_text {
    margin-bottom: 15px;
  }

  .home_banner {
    width: 100%;
    height: 450px;
    display: flex;
    gap: 20px;

    .banner_left {
      flex-shrink: 0;
    }

    .banner_right {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      height: 450px;

      .right_top {
        height: 200px;
      }

      .right_bottom {
        flex: 1;
      }
    }
  }

  .home_content {
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: 420px 1fr;
    gap: 20px;
    margin-top: 20px;
  }

  .video_content {
    width: 100%;
    height: auto;
    margin-top: 20px;

    .video_label {
      width: 100%;
      height: auto;
      margin-bottom: 14px;

      .content_label {
        width: 100%;
        height: auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 10px;

        .label_text {
          font-size: 14px;
          color: #1a1e21; /* light theme c-g9 */
          opacity: 0.4; /* color(c-g9, 0.4) */
        }
      }
    }

    .video_list {
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      grid-auto-rows: 1fr;

      .video_item {
        width: 100%;
        height: 100%;
      }
    }
  }

  .home_content {
    .content_left {
      width: 420px;
    }

    .content_right {
      width: 100%;
      min-width: 0;
    }

    .content_label {
      width: 100%;
      height: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0 0 14px;

      .label_text {
        font-size: 14px;
        color: #1a1e21; /* light theme c-g9 */
        opacity: 0.4; /* color(c-g9, 0.4) */
      }
    }

    .content_left,
    .content_right {
      display: flex;
      flex-direction: column;
      align-items: normal;
      justify-content: center;
      min-width: 0;

      .content-wrapper {
        width: 100%;
        height: auto;
        min-height: 420px;
        background-color: #f8f9fa; /* light theme c-g0 */
        border: 1px solid #dee2e6; /* light theme c-g2 */
        border-radius: 12px;
        padding: 18px;
        box-sizing: border-box;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15); /* small shadow */
      }
    }

    .apps_grid {
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;

      .apps_item {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      a {
        text-decoration: none;
      }
    }

    .webs_grid {
      width: 100%;
      height: auto;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;

      .webs_item {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>