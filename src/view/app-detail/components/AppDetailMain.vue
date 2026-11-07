<template>
  <div class="app-detail-main" :style="{ '--app-main-rgb': mainRgb }">
    <!-- 1. 应用基本信息：左卡片 + 右 Banner（高度跟随卡片） -->
    <section class="app-detail-main__hero">
      <AppInfoCard :app="app" :to="classicTarget" @palette="mainRgb = $event" />
      <div class="app-detail-main__banner">
        <AppBannerSwiper
          :slides="bannerSlides"
          :title="app.banner.desc"
          :tag="app.category"
        />
      </div>
    </section>

    <!-- 分割线：section1 与 section2 之间 -->
    <div class="app-detail-main__divider" aria-hidden="true">
      <component :is="diamondLine" />
    </div>

    <!-- 2. 功能块：中心矩形卡片 + 环绕功能项 -->
    <AppDetailSection class="app-detail-main__features">
      <AppFeatureGrid :features="app.pictorial" />
    </AppDetailSection>

    <!-- 3. 应用介绍 + 相关帖子：左右两栏，中间竖向分割线 -->
    <AppDetailSection>
      <div
        class="app-detail-main__article"
        :class="{ 'app-detail-main__article--solo': !hasRelatedNews }"
      >
        <div class="app-detail-main__intro">
          <div class="app-detail-main__label-row">
            <h2 class="app-detail-main__label">应用介绍</h2>
          </div>
          <div class="app-detail-main__markdown">
            <MdPreview
              id="app-detail-main"
              :modelValue="app.content"
              preview-theme="default"
              code-theme="github"
            />
          </div>
        </div>

        <aside v-if="hasRelatedNews" class="app-detail-main__related">
          <div class="app-detail-main__label-row">
            <h2 class="app-detail-main__label">相关帖子</h2>
          </div>
          <AppRelatedNews />
        </aside>
      </div>
    </AppDetailSection>

    <!-- 4. 相关视频：横向四列 grid -->
    <AppDetailSection>
      <div class="app-detail-main__label-row app-detail-main__label-row--spaced">
        <h2 class="app-detail-main__label">相关视频</h2>
      </div>
      <AppRelatedVideos />
    </AppDetailSection>

    <!-- 5. 相关课程：横向四列 grid -->
    <AppDetailSection>
      <div class="app-detail-main__label-row app-detail-main__label-row--spaced">
        <h2 class="app-detail-main__label">相关课程</h2>
      </div>
      <AppRelatedCourses />
    </AppDetailSection>

    <!-- 6. 评论区：无标签、无内边距 -->
    <AppDetailSection>
      <AppCommentSection :app-id="app.id" />
    </AppDetailSection>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { appDetailList } from '@/mock/app-detail';
import { latestAiNews } from '@/mock/aiNews';
import AppInfoCard from './AppInfoCard.vue';
import diamondLine from '@/assets/app-detail/icon_diamond_line.svg?skipsvgo';
import AppBannerSwiper from './AppBannerSwiper.vue';
import AppFeatureGrid from './AppFeatureGrid.vue';
import AppDetailSection from './AppDetailSection.vue';
import AppCommentSection from './AppCommentSection.vue';
import AppRelatedNews from './AppRelatedNews.vue';
import AppRelatedVideos from './AppRelatedVideos.vue';
import AppRelatedCourses from './AppRelatedCourses.vue';
import type { AppDetailItem } from '../types';

defineOptions({ name: 'AppDetailMain' });

const route = useRoute();

/** 图标主色，供 Banner 等区域做同色系描边 */
const mainRgb = ref('0, 181, 181');

/** 没有相关资讯时隐藏右栏 */
const hasRelatedNews = computed(() => latestAiNews.length > 0);

/** 切换到原版（简版）详情页 */
const classicTarget = computed(() => ({
  path: route.path,
  query: { ...route.query, mode: 'classic' },
}));

/** 路由参数命中时取对应应用，否则回退第一个 */
const app = computed<AppDetailItem>(() => {
  const id = Number(route.params.id);
  return appDetailList.find((item) => item.id === id) ?? appDetailList[0];
});

/** Banner 图：取每个功能块的配图 */
const bannerSlides = computed(() =>
  app.value.pictorial
    .map((feature) => feature.images[0]?.img.src)
    .filter((src): src is string => Boolean(src)),
);

watch(
  () => app.value.name,
  (name) => {
    if (name) document.title = name;
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.app-detail-main {
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-xxl);
  /* 顶部间距交给 layout 的 main，避免多出一截空白 */
  margin: 0 0 var(--ao-spacing-xxl);

  &__hero {
    display: grid;
    /* 左卡片固定 320 宽，右 Banner 撑满剩余空间并与卡片等高 */
    grid-template-columns: 320px minmax(0, 1fr);
    gap: var(--ao-spacing-md);
    align-items: stretch;
  }

  /* Banner 外层：主色流动渐变边框，轮播图内嵌 3px */
  &__banner {
    --banner-radius: 13px;

    position: relative;
    min-width: 0;
    border: 3px solid transparent;
    border-radius: 16px;
    /* 内层底色铺 padding-box，渐变只画在 border-box，四边宽度严格一致 */
    background:
      linear-gradient(var(--ao-color-bg-container), var(--ao-color-bg-container))
        padding-box,
      conic-gradient(
          from var(--app-banner-angle, 0deg),
          rgba(var(--app-main-rgb, 0, 181, 181), 0.25) 0deg,
          rgba(var(--app-main-rgb, 0, 181, 181), 1) 70deg,
          rgba(var(--app-main-rgb, 0, 181, 181), 0.35) 140deg,
          rgba(var(--app-main-rgb, 0, 181, 181), 0.25) 250deg,
          rgba(var(--app-main-rgb, 0, 181, 181), 0.25) 360deg
        )
        border-box;
    animation: app-banner-glow 5s linear infinite;

    :deep(.app-banner) {
      position: absolute;
      inset: 0;
      height: auto;
      min-height: 0;
      border-radius: var(--banner-radius);
      z-index: 1;
    }
  }

  /* section1 与 section2 之间的钻石分割线：定高裁掉上下留白，宽度保持顶满 */
  &__divider {
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
    /* 与下方 features 间距保持相等 */
    margin-top: var(--ao-spacing-xl);
    overflow: hidden;
    /* 动画扫线部分跟随图标主色 */
    color: rgb(var(--app-main-rgb, 0, 181, 181));

    :deep(svg) {
      display: block;
      width: 100%;
      height: auto;
      flex: none;
    }
  }

  /* 功能块与分割线间距保持相等（与上方 hero 到分割线一致） */
  &__features {
    margin-top: var(--ao-spacing-xl);
  }

  /* 应用介绍 + 相关帖子：左右两栏 */
  &__article {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: var(--ao-spacing-xl);

    /* 没有相关帖子时只保留介绍栏 */
    &--solo {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__intro,
  &__related {
    display: flex;
    flex-direction: column;
    gap: var(--ao-spacing-md);
    min-width: 0;
  }

  /* 相关帖子左侧的竖向分割线 */
  &__related {
    position: relative;
    padding-left: var(--ao-spacing-xl);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      width: var(--ao-border-width-thin);
      background-color: var(--ao-color-border-secondary);
    }
  }

  /* 应用介绍：主色小标题，右侧接一条主色细线，和标题底部对齐 */
  &__label-row {
    display: flex;
    align-items: baseline;
    gap: var(--ao-spacing-md);

    /* 与下方列表拉开距离，和介绍区标题到正文的间距一致 */
    &--spaced {
      margin-bottom: var(--ao-spacing-xl);
    }

    &::after {
      content: '';
      flex: 1;
      height: var(--ao-border-width-thin);
      /* 从主色渐变到透明，收尾更自然 */
      background-image: linear-gradient(
        90deg,
        rgba(var(--app-main-rgb, 0, 181, 181), 0.6),
        rgba(var(--app-main-rgb, 0, 181, 181), 0)
      );
    }
  }

  &__label {
    margin: 0;
    font-size: var(--ao-font-size-lg);
    font-weight: var(--ao-font-weight-semibold);
    color: rgb(var(--app-main-rgb, 0, 181, 181));
    white-space: nowrap;
  }

  /* 应用介绍：无边框、无边距，按正常文章排版 */
  &__markdown {
    :deep(.md-editor) {
      background-color: transparent;
    }

    :deep(.md-editor-preview-wrapper) {
      padding: 0;
    }

    :deep(.md-editor-preview) {
      padding: 0;
      font-size: var(--ao-font-size-base);
      line-height: 1.8;
      color: var(--ao-color-text-secondary);

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin: var(--ao-spacing-lg) 0 var(--ao-spacing-sm);
        font-weight: var(--ao-font-weight-semibold);
        line-height: 1.4;
        color: var(--ao-color-text-base);
      }

      h1 {
        font-size: var(--ao-font-size-xxl);
      }

      h2 {
        font-size: var(--ao-font-size-xl);
      }

      h3 {
        font-size: var(--ao-font-size-lg);
      }

      p {
        margin: var(--ao-spacing-sm) 0;
      }

      ul,
      ol {
        margin: var(--ao-spacing-sm) 0;
        padding-left: var(--ao-spacing-lg);
      }

      li {
        margin: var(--ao-spacing-xxs) 0;
      }

      li > p {
        margin: 0;
      }

      blockquote {
        margin: var(--ao-spacing-md) 0;
        padding: var(--ao-spacing-xs) var(--ao-spacing-md);
      }

      hr {
        margin: var(--ao-spacing-lg) 0;
      }
    }
  }
}

@media (max-width: 992px) {
  .app-detail-main {
    gap: var(--ao-spacing-xl);
    &__hero {
      grid-template-columns: minmax(0, 1fr);
    }

    /* 单列堆叠时没有卡片撑高，给 Banner 一个固定高度 */
    &__banner {
      min-height: 320px;
    }

    /* 应用介绍与相关帖子改为上下堆叠，竖向分割线取消 */
    &__article {
      grid-template-columns: minmax(0, 1fr);
    }

    &__related {
      padding-left: 0;

      &::before {
        display: none;
      }
    }
  }
}

@media (max-width: 768px) {
  .app-detail-main {
    &__article {
      gap: var(--ao-spacing-lg);
    }
  }
}

/* Banner 边框流光：用 @property 旋转渐变角度，避免旋转大图层导致转角锯齿 */
@property --app-banner-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}

@keyframes app-banner-glow {
  to {
    --app-banner-angle: 360deg;
  }
}
</style>
