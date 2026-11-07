<template>
  <div class="app-banner">
    <Swiper
      class="app-banner__swiper"
      :modules="modules"
      effect="creative"
      :creative-effect="creativeEffect"
      :speed="700"
      :loop="slides.length > 1"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
    >
      <SwiperSlide v-for="(src, index) in slides" :key="index">
        <div class="app-banner__slide">
          <img :src="src" alt="" />
          <div class="app-banner__caption">
            <span v-if="tag" class="app-banner__tag">{{ tag }}</span>
            <h2 v-if="title" class="app-banner__title">{{ title }}</h2>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectCreative, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import 'swiper/css/pagination';

defineOptions({ name: 'AppBannerSwiper' });

withDefaults(
  defineProps<{
    /** 轮播图片 */
    slides: string[];
    /** 主标题（一般用 banner 文案） */
    title?: string;
    /** 标题上方的分类标签 */
    tag?: string;
  }>(),
  { title: '', tag: '' },
);

const modules = [Autoplay, EffectCreative, Pagination];

/** 创意切换：新图从右侧滑入，旧图向后缩小淡出 */
const creativeEffect = {
  prev: {
    shadow: false,
    translate: ['-18%', 0, -1],
    opacity: 0,
  },
  next: {
    translate: ['100%', 0, 0],
  },
};
</script>

<style scoped lang="scss">
.app-banner {
  height: 100%;
  min-height: 320px;
  border-radius: var(--banner-radius, var(--ao-border-radius-xl));
  overflow: hidden;
  /* 切换时露出的底色：暗色透明磨砂 */
  background-color: rgba(16, 20, 28, 0.55);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: var(--ao-shadow-sm);

  &__swiper {
    height: 100%;
    /* 每一层都带上同样的圆角，避免滚动/变换时直角顶出来 */
    border-radius: inherit;
    overflow: hidden;
    background-color: inherit;
    backdrop-filter: inherit;
    -webkit-backdrop-filter: inherit;
  }

  :deep(.swiper-slide) {
    border-radius: var(--banner-radius, var(--ao-border-radius-xl));
    overflow: hidden;
  }

  &__slide {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: var(--banner-radius, var(--ao-border-radius-xl));
    overflow: hidden;

    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: var(--banner-radius, var(--ao-border-radius-xl));
      object-fit: cover;
    }
  }

  &__caption {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--ao-spacing-xs);
    padding: var(--ao-spacing-xl) var(--ao-spacing-lg) var(--ao-spacing-xl);
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(0, 0, 0, 0.55) 100%
    );
  }

  &__tag {
    padding: 2px 10px;
    border-radius: var(--ao-border-radius-full);
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(4px);
    font-size: var(--ao-font-size-xs);
    color: var(--ao-gray-0);
  }

  &__title {
    margin: 0;
    font-size: var(--ao-font-size-xxl);
    font-weight: var(--ao-font-weight-semibold);
    line-height: 1.4;
    color: var(--ao-gray-0);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  /* 分页圆点：默认在图片底部，改为品牌色当前项 */
  :deep(.swiper-pagination) {
    bottom: 12px;
  }

  :deep(.swiper-pagination-bullet) {
    background-color: var(--ao-gray-0);
    opacity: 0.5;
  }

  :deep(.swiper-pagination-bullet-active) {
    width: 18px;
    border-radius: var(--ao-border-radius-full);
    background-color: rgb(var(--app-main-rgb, 0, 181, 181));
    opacity: 1;
  }
}
</style>
