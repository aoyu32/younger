<template>
  <div class="app-detail-responsive" :style="appThemeStyle">
    <!-- 应用信息 -->
    <section class="hero">
      <div class="app-icon">
        <img ref="iconRef" :src="data?.icon" alt="" />
      </div>
      <h1>{{ data?.desc }}</h1>
      <p class="sub">{{ data?.sub }}</p>
      <div class="tags">
        <span
          class="tag tag--category"
          :style="{
            color: primaryColor,
            backgroundColor: `color-mix(in srgb, ${primaryColor} 12%, transparent)`,
          }"
        >
          {{ data?.category }}
        </span>
        <span v-for="tag in appTags" :key="tag" class="tag">{{ tag }}</span>
      </div>
      <div class="actions">
        <div ref="downloadRef" class="download-dropdown">
          <button
            type="button"
            class="download-btn"
            :style="{ backgroundColor: primaryColor }"
            @click.stop="downloadOpen = !downloadOpen"
          >
            免费下载
          </button>
          <ul v-if="downloadOpen" class="download-menu">
            <li v-for="platform in downloadPlatforms" :key="platform">
              <button
                type="button"
                class="download-menu__item"
                @click="handleDownload(platform)"
              >
                <component
                  :is="PLATFORM_ICONS[platform]"
                  class="download-menu__icon"
                  :style="{ color: primaryColor }"
                />
                {{ PLATFORM_LABELS[platform] }}版本
              </button>
            </li>
          </ul>
        </div>
        <button type="button" class="quick-link" @click="openVideoModal">
          快速了解 <span :style="{ color: primaryColor }">{{ data?.name }}</span>
        </button>
        <RouterLink
          class="mode-switch"
          :to="{ path: route.path, query: { ...route.query, mode: undefined } }"
        >
          <component
            :is="switchIcon"
            class="mode-switch__icon"
            :style="{ color: primaryColor }"
          />
          切换模式
        </RouterLink>
      </div>
    </section>

    <!-- 应用截图：复用 DetailSwiper，响应式下改为普通滑动，可拖拽/触摸滚动 -->
    <section class="banner">
      <h2>{{ data?.banner.desc }}</h2>
      <div class="banner-swiper">
        <DetailSwiper responsive />
      </div>
    </section>

    <!-- 功能画报 -->
    <section v-if="data?.pictorial?.length" class="pictorial">
      <article
        v-for="item in data?.pictorial || []"
        :key="item.id"
        class="pictorial-item"
      >
        <h2>{{ item.text }}</h2>
        <p v-if="item.desc">{{ item.desc }}</p>
        <img
          v-for="(image, index) in item.images"
          :key="index"
          :src="image.img.src"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </article>
    </section>

    <!-- 应用介绍 -->
    <section class="intro">
      <h2 class="section-title" :style="{ color: primaryColor }">应用介绍</h2>
      <div class="intro-md">
        <MdPreview :id="previewId" :modelValue="data?.content || ''" />
      </div>
    </section>

    <!-- 相关帖子 -->
    <section class="related">
      <h2 class="section-title" :style="{ color: primaryColor }">相关帖子</h2>
      <AppRelatedNews />
    </section>

    <!-- 相关视频 -->
    <section class="related">
      <h2 class="section-title" :style="{ color: primaryColor }">相关视频</h2>
      <AppRelatedVideos />
    </section>

    <!-- 相关课程 -->
    <section class="related">
      <h2 class="section-title" :style="{ color: primaryColor }">相关课程</h2>
      <AppRelatedCourses />
    </section>

    <!-- 返回顶部：原生即时滚动，不做动画 -->
    <div class="back-top">
      <button type="button" @click="scrollToTop">
        <AoImage
          src="@/assets/app-detail/icon_top.svg"
          width="40px"
          height="40px"
        />
      </button>
      <p>返回顶部</p>
    </div>

    <!-- 视频弹窗 -->
    <div
      v-if="showVideoModal"
      class="video-modal-overlay"
      @click.self="closeVideoModal"
    >
      <div class="video-modal-container">
        <div class="video-wrapper">
          <VideoPlayer :src="videoSrc" autoplay />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MdPreview } from 'md-editor-v3';
import { Vibrant } from 'node-vibrant/browser';
import 'md-editor-v3/lib/style.css';
import VideoPlayer from '@/components/video-player/index.vue';
import AoImage from '@/components/ao-image/index.vue';
import DetailSwiper from './DetailSwiper.vue';
import AppRelatedNews from './AppRelatedNews.vue';
import AppRelatedVideos from './AppRelatedVideos.vue';
import AppRelatedCourses from './AppRelatedCourses.vue';
import { appDetailList } from '@/mock/app-detail';
import windowsIcon from '@/assets/app-detail/icon_windows.svg';
import macosIcon from '@/assets/app-detail/icon_macos.svg';
import linuxIcon from '@/assets/app-detail/icon_linux.svg';
import switchIcon from '@/assets/app-detail/icon_switch.svg';

const route = useRoute();
const previewId = 'app-detail-responsive-preview';

const data = computed(() => {
  const id = Number(route.params.id);
  return appDetailList.find((appDetail) => appDetail.id === id);
});

type DownloadPlatform = 'windows' | 'macos' | 'linux';

const PLATFORM_LABELS: Record<DownloadPlatform, string> = {
  windows: 'Windows',
  macos: 'MacOS',
  linux: 'Linux',
};

const PLATFORM_ICONS: Record<DownloadPlatform, unknown> = {
  windows: windowsIcon,
  macos: macosIcon,
  linux: linuxIcon,
};

const downloadPlatforms = computed(
  () => (data.value?.platforms ?? []) as DownloadPlatform[],
);

const appTags = computed(() =>
  (data.value?.tags ?? []).filter((tag) => tag !== data.value?.category),
);

const downloadOpen = ref(false);
const downloadRef = ref<HTMLElement>();

/** 图标主色：取不到时回退品牌色 */
const iconRef = ref<HTMLImageElement>();
const primaryColor = ref('#00b5b5');

const generateFromVibrant = async () => {
  if (!iconRef.value || !iconRef.value.src) return;
  try {
    const palette = await Vibrant.from(iconRef.value).getPalette();
    const vibrant = palette.Vibrant;
    primaryColor.value = vibrant ? `rgb(${vibrant.rgb.join(',')})` : '#00b5b5';
  } catch (error) {
    console.error('Vibrant 提取颜色失败:', error);
    primaryColor.value = '#00b5b5';
  }
};

/** 主色拆成 r,g,b，供相关推荐组件里的 rgba(var(--app-main-rgb), x) 使用 */
const primaryRgb = computed(() => {
  const match = primaryColor.value.match(/\d+,\s*\d+,\s*\d+/);
  return match ? match[0] : '';
});
const appThemeStyle = computed(() =>
  primaryRgb.value ? { '--app-main-rgb': primaryRgb.value } : {},
);

const handleDownload = (_platform: DownloadPlatform) => {
  downloadOpen.value = false;
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!downloadOpen.value) return;
  if (!downloadRef.value?.contains(event.target as Node)) {
    downloadOpen.value = false;
  }
};

const videoSrc = ref(
  'https://gsap.com/community/uploads/monthly_2026_04/easereverseUI.mp4.d8211e8be205c4f869da1eea439903e9.mp4',
);
const showVideoModal = ref(false);

const openVideoModal = () => {
  showVideoModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeVideoModal = () => {
  showVideoModal.value = false;
  document.body.style.overflow = '';
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && showVideoModal.value) {
    closeVideoModal();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  document.addEventListener('click', handleDocumentClick);

  if (iconRef.value?.complete) {
    generateFromVibrant();
  } else {
    iconRef.value?.addEventListener('load', generateFromVibrant);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', handleDocumentClick);
  iconRef.value?.removeEventListener('load', generateFromVibrant);
  document.body.style.overflow = '';
});

/** 切换应用后重新取图标主色 */
watch(
  () => data.value?.icon,
  () => {
    const img = iconRef.value;
    if (!img) return;
    img.removeEventListener('load', generateFromVibrant);
    if (img.complete) {
      generateFromVibrant();
    } else {
      img.addEventListener('load', generateFromVibrant);
    }
  },
);

watch(
  () => route.path,
  () => {
    closeVideoModal();
  },
);

watch(
  () => data.value?.name,
  (name) => {
    if (name) {
      document.title = name;
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
.app-detail-responsive {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
  padding-bottom: 24px;
  color: var(--ao-color-text-base);

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
}

/* ================= 顶部应用信息 ================= */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 20px 24px;
}

.app-icon {
  position: relative;
  width: 92px;
  height: 92px;
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
  background: #fff;
  /* 浅色盒子阴影，保留轻盈的悬浮感 */
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 12px;
  }
}

.hero h1 {
  margin: 26px 0 10px;
  font-size: clamp(20px, 3vw, 26px);
  line-height: 1.45;
  font-weight: var(--ao-font-weight-semibold);
  letter-spacing: 0.5px;
  word-break: break-word;
}

.hero .sub {
  margin: 0 0 20px;
  font-size: clamp(13px, 1.8vw, 15px);
  line-height: 1.7;
  color: var(--ao-color-text-secondary);
  word-break: break-word;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin: 0 0 20px;
}

.tag {
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;
  color: var(--ao-color-text-secondary);
  background-color: rgba(0, 0, 0, 0.04);

  &--category {
    color: var(--ao-color-primary);
    background-color: color-mix(
      in srgb,
      var(--ao-color-primary) 12%,
      transparent
    );
  }
}

.download-dropdown {
  position: relative;
}

.download-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  z-index: 20;
  min-width: 168px;
  margin: 0;
  padding: 6px;
  list-style: none;
  border-radius: 10px;
  background-color: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateX(-50%);

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 8px 10px;
    border: none;
    border-radius: 6px;
    background-color: transparent;
    font-size: 14px;
    color: var(--ao-color-text-base);
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

  &__icon {
    width: 16px;
    height: 16px;
    color: var(--ao-color-primary);
  }
}

.mode-switch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--ao-color-text-secondary);
  text-decoration: none;

  &__icon {
    width: 15px;
    height: 15px;
    color: var(--ao-color-primary);
    transition: transform 0.35s ease;
  }

  &:hover .mode-switch__icon {
    transform: rotate(180deg);
  }
}

.download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-color-primary);
  color: #fff;
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-medium);
  cursor: pointer;
  transition: all 0.3s ease;

  /* 下拉箭头，和非响应式版本保持一致 */
  &::after {
    content: '';
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 5px solid currentColor;
  }

  &:hover {
    transform: scale(1.05);
  }
}

.quick-link {
  padding: 6px 0;
  border: none;
  background: transparent;
  color: var(--ao-color-text-secondary);
  font-size: 15px;
  cursor: pointer;

  span {
    color: var(--ao-color-primary);
  }
}

/* ================= 截图区 ================= */
.banner {
  margin-top: 8px;
}

.banner h2 {
  margin: 0;
  padding: 0 20px 18px;
  font-size: clamp(16px, 2.2vw, 20px);
  font-weight: 400;
  line-height: 1.5;
  text-align: center;
  word-break: break-word;
}

.banner-swiper {
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}

/* ================= 功能画报 ================= */
.pictorial {
  padding: 16px 16px 0;
}

.pictorial-item {
  margin-top: 36px;
  text-align: center;
  /* 与桌面端画报区保持一致，使用阿里妈妈数黑体 */
  font-family: var(--ao-font-family-ali);

  &:first-child {
    margin-top: 20px;
  }

  h2 {
    margin: 0 0 8px;
    font-size: clamp(17px, 2.2vw, 20px);
    line-height: 1.5;
    font-weight: 400;
    word-break: break-word;
  }

  p {
    margin: 0 0 14px;
    font-size: 14px;
    line-height: 1.7;
    color: var(--ao-color-text-secondary);
    word-break: break-word;
  }

  img {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: 14px;
    object-fit: cover;

    & + img {
      margin-top: 12px;
    }
  }
}

/* ================= 应用介绍 / 相关推荐 ================= */
.intro {
  margin: 32px 16px 0;
}

.section-title {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin: 0 0 14px;
  font-size: 18px;
  font-weight: 600;
  white-space: nowrap;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    margin-bottom: 5px;
    opacity: 0.8;
    background-image: linear-gradient(90deg, currentColor, transparent);
  }
}

.related {
  margin: 32px 16px 0;
}

.intro-md {
  width: 100%;
  max-width: 100%;
  overflow: hidden;

  :deep(.md-editor) {
    height: auto;
    padding: 0;
    border: none;
    background: transparent;
    box-shadow: none;
  }

  :deep(.md-editor-preview-wrapper) {
    padding: 0;
  }

  :deep(.md-editor-preview) {
    padding: 0;
    font-size: 14px;
    line-height: 1.8;
    word-break: break-word;
  }

  :deep(.md-editor-preview h1) {
    font-size: 20px;
  }

  :deep(.md-editor-preview h2) {
    font-size: 18px;
  }

  :deep(.md-editor-preview h3) {
    font-size: 16px;
  }

  :deep(.md-editor-preview img) {
    max-width: 100%;
    height: auto;
  }

  :deep(.md-editor-preview table) {
    display: block;
    width: 100%;
    overflow-x: auto;
  }

  :deep(.md-editor-preview pre) {
    overflow-x: auto;
  }
}

/* ================= 返回顶部 ================= */
.back-top {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 32px 0 20px;

  button {
    padding: 0;
    border: none;
    background: transparent;
    line-height: 0;
    cursor: pointer;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: var(--ao-color-text-tertiary);
  }
}

/* ================= 视频弹窗 ================= */
.video-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.6);
}

.video-modal-container {
  width: 100%;
  max-width: 720px;
}

.video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
}

/* ================= 窄屏微调 ================= */
@media (max-width: 768px) {
  .hero {
    padding: 26px 16px 20px;
  }

  .app-icon {
    width: 84px;
    height: 84px;
    padding: 12px;
    border-radius: 22px;

    img {
      border-radius: 10px;
    }
  }

  .banner h2 {
    padding: 0 16px 14px;
  }

  .pictorial {
    padding: 12px 12px 0;
  }

  .pictorial-item {
    margin-top: 30px;

    &:first-child {
      margin-top: 16px;
    }

    img {
      border-radius: 12px;
    }
  }

  .intro {
    margin: 30px 12px 0;
  }

  .related {
    margin: 26px 12px 0;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 22px 14px 18px;
  }

  .app-icon {
    width: 76px;
    height: 76px;
    padding: 11px;
    border-radius: 20px;

    img {
      border-radius: 9px;
    }
  }

  .hero h1 {
    margin-top: 22px;
    font-size: 19px;
  }

  .hero .sub {
    font-size: 13px;
  }

  .download-btn {
    padding: 9px 22px;
    font-size: 14px;
  }

  .quick-link {
    font-size: 14px;
  }

  .banner h2 {
    font-size: 15px;
  }

  .pictorial-item h2 {
    font-size: 16px;
  }

  .pictorial-item p {
    font-size: 13px;
  }

  .intro-md :deep(.md-editor-preview) {
    font-size: 13px;
  }
}
</style>
