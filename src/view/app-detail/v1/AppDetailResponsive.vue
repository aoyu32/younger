<template>
  <div class="app-detail-responsive">
    <!-- 应用信息 -->
    <section class="hero">
      <div class="app-icon">
        <img :src="data?.icon" alt="" />
      </div>
      <h1>{{ data?.desc }}</h1>
      <p class="sub">{{ data?.sub }}</p>
      <div class="actions">
        <button type="button" class="download-btn">免费下载</button>
        <button type="button" class="quick-link" @click="openVideoModal">
          快速了解 <span>{{ data?.name }}</span>
        </button>
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

    <!-- 文档 + 操作按钮 -->
    <section class="intro">
      <div class="intro-card">
        <div class="name">{{ data?.name }}文档</div>
      </div>
      <div class="intro-md">
        <MdPreview :id="previewId" :modelValue="data?.content || ''" />
      </div>
      <div class="intro-btns">
        <button type="button" class="btn-item" aria-label="下载">
          <AoImage
            src="@/assets/app-detail/icon_download.svg"
            width="20px"
            height="20px"
          />
        </button>
        <button type="button" class="btn-item" aria-label="分享">
          <AoImage
            src="@/assets/app-detail/icon_share.svg"
            width="20px"
            height="20px"
          />
        </button>
        <button type="button" class="btn-item" aria-label="GitHub">
          <AoImage
            src="@/assets/app-detail/icon_github.svg"
            width="20px"
            height="20px"
          />
        </button>
      </div>
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
import 'md-editor-v3/lib/style.css';
import VideoPlayer from '@/components/video-player/index.vue';
import AoImage from '@/components/ao-image/index.vue';
import DetailSwiper from './DetailSwiper.vue';
import { appDetailList } from '@/mock/app-detail';

const route = useRoute();
const previewId = 'app-detail-responsive-preview';

const data = computed(() => {
  const id = Number(route.params.id);
  return appDetailList.find((appDetail) => appDetail.id === id);
});

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
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

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

.download-btn {
  padding: 10px 28px;
  border: none;
  border-radius: 999px;
  background: var(--ao-color-primary);
  color: #fff;
  font-size: 15px;
  font-weight: var(--ao-font-weight-medium);
  cursor: pointer;
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

/* ================= 文档区 ================= */
.intro {
  margin: 36px 16px 0;
  padding: 18px 14px;
  border: 1px solid var(--ao-color-border);
  border-radius: 16px;
  background: color-mix(
    in srgb,
    var(--ao-color-primary) 4%,
    var(--ao-color-bg-container)
  );
}

.intro-card {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  .name {
    font-size: clamp(18px, 2.2vw, 21px);
    line-height: 1.4;
    font-weight: var(--ao-font-weight-semibold);
    word-break: break-word;
  }
}

.intro-md {
  width: 100%;
  max-width: 100%;
  margin-top: 12px;
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

.intro-btns {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--ao-color-border);
}

.btn-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--ao-color-primary);
  cursor: pointer;
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
    padding: 16px 12px;
    border-radius: 14px;
  }

  .intro-btns {
    gap: 18px;
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
