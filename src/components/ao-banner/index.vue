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
      >
        <div
          class="carousel-item"
          v-for="(item, index) in carouselList"
          :key="index"
        >
          <img :src="item.img" alt="" />
        </div>
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
import prevIcon from './img/icon_left.svg?url'
import nextIcon from './img/icon_right.svg?url'

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
});

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

    .carousel-item {
      flex: 0 0 100%;
      width: 100%;

      img {
        width: 100%;
        height: 100%;
        min-height: 450px;
        object-fit: cover;
        display: block;
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
