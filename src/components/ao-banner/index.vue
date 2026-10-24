<template>
  <div class="ao-banner">
    <div
      class="carousel"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <div
        class="carousel-inner"
        ref="carouselInnerRef"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
        v-if="carouselList.length > 0"
      >
        <div
          class="carousel-item"
          v-for="(item, index) in carouselList"
          :key="index"
          :style="{ backgroundImage: `url(${resolveFallback(index)})` }"
        >
          <img :src="item.img" alt="" @error="handleImageError($event, index)" />
        </div>
      </div>
      <div class="empty-img" v-else>
        <img :src="emptyIcon" alt="" />
      </div>

      <div class="carousel-control prev" @click="handleToPrev">
        <img :src="prevIcon" alt="" />
      </div>
      <div class="carousel-control next" @click="handleToNext">
        <img :src="nextIcon" alt="" />
      </div>

      <div class="carousel-indicator">
        <span
          v-for="(_, index) in carouselList.length"
          :key="index"
          :class="{ active: indicatorIndex - 1 === index }"
          @click="handleIndicator(index)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import prevIcon from './img/icon_left.svg?url';
import nextIcon from './img/icon_right.svg?url';
import emptyIcon from './img/icon_empty.svg?url';
import bannerOne from '@/assets/banner/banner_1.jfif';
import bannerTwo from '@/assets/banner/banner_2.jfif';

const defaultBanners = [bannerOne, bannerTwo];

// 定义组件名称
defineOptions({
  name: 'AoBanner',
});

// 定义props
const props = defineProps({
  screenshots: {
    type: Array,
    default: () => [],
  },
  fallback: {
    type: [String, Array],
    default: () => [bannerOne, bannerTwo],
  },
});

const resolveFallback = (index) => {
  if (Array.isArray(props.fallback)) {
    if (!props.fallback.length) return defaultBanners[0];
    return props.fallback[index % props.fallback.length];
  }
  return props.fallback || defaultBanners[0];
};

const applyFallback = (img, index) => {
  if (!img || img.dataset.fallback) return;
  img.dataset.fallback = '1';
  img.src = resolveFallback(index);
};

// 响应式数据
const carouselInnerRef = ref(null);
const currentIndex = ref(1);
const indicatorIndex = ref(1);
const isDisable = ref(false);
const autoPlayTimer = ref(null);

// 计算属性
const carouselList = computed(() => {
  if (props.screenshots && props.screenshots.length > 0) {
    return props.screenshots.map((url) => ({
      to: '',
      img: url,
    }));
  }
  return [];
});

// 方法
const handleImageError = (event, index) => {
  const img = event.target;
  const failedSrc = img.getAttribute('src');
  const inner = carouselInnerRef.value;
  const images = inner ? inner.querySelectorAll('img') : [img];

  images.forEach((item) => {
    if (item.getAttribute('src') !== failedSrc) return;
    applyFallback(item, index);
  });
};

const handleMouseEnter = () => {
  startAutoplay(3000, false);
};

const handleMouseLeave = () => {
  startAutoplay(3000, true);
};

const startAutoplay = (time, start) => {
  if (!start) {
    if (autoPlayTimer.value) {
      clearInterval(autoPlayTimer.value);
      autoPlayTimer.value = null;
    }
    return;
  }

  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value);
  }

  autoPlayTimer.value = setInterval(() => {
    if (carouselInnerRef.value) {
      // 确保元素存在
      handleToNext();
    }
  }, time);
};

const handleIndicator = (index) => {
  currentIndex.value = index + 1;
  indicatorIndex.value = currentIndex.value;
};

const initCarousel = async () => {
  await nextTick();
  const inner = carouselInnerRef.value;
  if (!inner || !inner.firstElementChild) return;

  const expected = carouselList.value.length;
  // 清理已有克隆
  while (inner.children.length > expected + 1) {
    // 加1是因为我们后面会添加两个克隆元素
    inner.removeChild(inner.lastElementChild);
  }

  // 克隆首尾
  const first = inner.firstElementChild.cloneNode(true);
  const last = inner.lastElementChild.cloneNode(true);

  const bindFallback = (node, index) => {
    const img = node.querySelector('img');
    if (!img) return;
    img.addEventListener('error', () => applyFallback(img, index));
  };

  bindFallback(first, 0);
  bindFallback(last, expected - 1);

  inner.appendChild(first);
  inner.insertBefore(last, inner.firstElementChild);
};

const handleToPrev = () => {
  if (isDisable.value) return;

  currentIndex.value--;
  indicatorIndex.value = currentIndex.value;
  updateCarousel();

  if (currentIndex.value <= 0) {
    indicatorIndex.value = carouselList.value.length;
    setTimeout(() => {
      isDisable.value = false;
      const inner = carouselInnerRef.value;
      if (inner) {
        inner.style.transition = 'none';
        currentIndex.value = carouselList.value.length;
      }
    }, 300);
  }
};

const updateCarousel = () => {
  const inner = carouselInnerRef.value;
  if (inner) {
    inner.style.transition = 'transform .4s ease-in-out';
  }
};

const handleToNext = () => {
  if (isDisable.value) return;

  currentIndex.value++;
  indicatorIndex.value = currentIndex.value;
  updateCarousel();

  if (currentIndex.value > carouselList.value.length) {
    isDisable.value = true;
    indicatorIndex.value = 1;
    setTimeout(() => {
      isDisable.value = false;
      const inner = carouselInnerRef.value;
      if (inner) {
        inner.style.transition = 'none';
        currentIndex.value = 1;
      }
    }, 300);
  }
};

// 生命周期钩子
onMounted(() => {
  nextTick(() => {
    initCarousel();
    startAutoplay(3000, true);
  });
});

onUnmounted(() => {
  startAutoplay(3000, false); // 清理定时器
});

// 监听器
watch(
  () => props.screenshots,
  (newList) => {
    if (newList && newList.length > 0) {
      startAutoplay(3000, false);
      currentIndex.value = 1;
      indicatorIndex.value = 1;

      nextTick(() => {
        initCarousel();
        startAutoplay(3000, true);
      });
    }
  },
);

watch(carouselList, (newList) => {
  nextTick(() => {
    const inner = carouselInnerRef.value;
    if (inner && inner.children.length === newList.length) {
      initCarousel();
    }
  });
});
</script>

<style scoped lang="scss">
.ao-banner {
  width: 100%;
  height: 100%;
  .carousel {
    position: relative;
    overflow: hidden;
    border-radius: 6px;
    height: 100%;
    width: 100%;

    .carousel-inner {
      height: 100%;
      display: flex;
      transition: transform 0.3s ease-in-out;
      width: 100%;
    }

    .empty-img{
      border: 1px solid rgba(0, 0, 0, 0.1);
      height: 100%;
      border-radius: 6px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .carousel-item {
      flex: 0 0 100%;
      width: 100%;
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;

      img {
        width: 100%;
        height: 100%;
        min-height: 450px;
        object-fit: cover;
        display: block;
      }

      /* 响应式堆叠布局下轮播盒高度为 16:7，取消桌面固定最小高，
         让图片随盒子尺寸缩放，避免溢出被裁切 */
      @media (max-width: 1024px) {
        img {
          min-height: 0;
        }
      }

      &.clone {
        pointer-events: none;
      }
    }

    .carousel-control {
      width: 60px;
      height: 100%;
      position: absolute;
      transition: all 0.3s ease-in-out;
      cursor: pointer;
      border: none;
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: 30px;
        height: 30px;
        object-fit: cover;
      }

      &:disabled {
        cursor: not-allowed;
        opacity: 0.3;
      }
    }

    .prev {
      left: 0;
      top: 0;
    }

    .next {
      right: 0;
      top: 0;
    }

    .carousel-indicator {
      width: 100%;
      height: 50px;
      position: absolute;
      bottom: 0px;
      right: 0px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;

      span {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        display: inline-block;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: var(--app-bg-color-light);
        opacity: 0.5;

        &.active {
          background-color: var(--app-bg-color-light);
          transform: scale(1.2);
        }

        &:hover {
          transform: scale(1.1);
          background-color: var(--app-bg-color-light);
        }
      }
    }
  }

  .carousel:hover .carousel-control {
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
