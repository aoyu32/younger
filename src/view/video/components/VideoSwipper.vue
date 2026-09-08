<template>
  <div class="video-swipper">
    <swiper
      :style="{
        '--swiper-navigation-color': '#fff',
        '--swiper-pagination-color': '#fff',
      }"
      :speed="600"
      :parallax="true"
      :pagination="{
        clickable: true,
      }"
      :navigation="{
        prevEl: prevButton,
        nextEl: nextButton,
      }"
      :modules="modules"
    >
      <div
        slot="container-start"
        class="parallax-bg"
        :style="{
          'background-image':
            'url(https://swiperjs.com/demos/images/abstract-1.jpg)',
        }"
        data-swiper-parallax="-23%"
      ></div>
      <swiper-slide>
        <div class="text" data-swiper-parallax="-100">
          <p>最火的Codex使用教程</p>
        </div> </swiper-slide
      ><swiper-slide>
        <div class="text" data-swiper-parallax="-100">
          <p>手把手教你如何使用VibeCoding实现一个贪吃蛇</p>
        </div> </swiper-slide
      ><swiper-slide>
        <div class="text" data-swiper-parallax="-100">
          <p>最新AI绘画视频教程已上线</p>
        </div>
      </swiper-slide>
      <div ref="prevButton" class="prev navigation">
        <AoImage
          src="@/assets/video/icon_pre.svg"
          width="26px"
          height="26px"
        ></AoImage>
      </div>
      <div ref="nextButton" class="next navigation">
        <AoImage
          src="@/assets/video/icon_next.svg"
          width="26px"
          height="26px"
        ></AoImage>
      </div>
    </swiper>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Parallax, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
const prevButton = ref<HTMLElement | null>(null);
const nextButton = ref<HTMLElement | null>(null);
const modules = [Parallax, Pagination, Navigation];
</script>

<style scoped lang="scss">
.video-swipper {
  width: 100%;
  height: 100%;
}

.swiper {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  border-radius: var(--ao-border-radius-base);
  background-color: var(--ao-gray-1);
  cursor: pointer;
}

.swiper-slide {
  font-size: 18px;
  color: #fff;
  box-sizing: border-box;
  padding: 40px 60px;
}

.parallax-bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 130%;
  height: 100%;
  background-size: cover;
  border-radius: var(--ao-border-radius-base);
  background-position: center;
}

.swiper-slide .text {
  font-size: 14px;
  max-width: 400px;
  line-height: 1.3;
}

/* 自定义导航按钮 */
.navigation {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition:
    opacity 0.3s ease,
    background-color 0.3s ease;
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.video-swipper:hover .navigation {
  opacity: 1;
}
</style>
