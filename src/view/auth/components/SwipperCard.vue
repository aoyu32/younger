<template>
  <swiper
    :effect="'cards'"
    :grabCursor="true"
    :modules="modules"
    class="mySwiper"
  >
    <swiper-slide>教程视频</swiper-slide>
    <swiper-slide>软件工具</swiper-slide>
    <swiper-slide>AI资讯</swiper-slide>
    <swiper-slide>网站导航</swiper-slide>
  </swiper>
</template>
<script>
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue';

// Import Swiper styles
import 'swiper/css';

import 'swiper/css/effect-cards';

// import required modules
import { EffectCards } from 'swiper/modules';

export default {
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      modules: [EffectCards],
    };
  },
};
</script>
<style lang="scss" scoped>
.swiper {
  width: 200px;
  height: 280px;
}

.swiper-slide {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  font-size: 22px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
  box-shadow: 0 8px 24px rgba(0, 82, 82, 0.25);
}

.swiper-slide:nth-child(1) {
  background: linear-gradient(145deg, var(--app-primary-color), #007878);
}

.swiper-slide:nth-child(2) {
  background: linear-gradient(145deg, var(--app-secondary-color), var(--app-primary-color));
}

.swiper-slide:nth-child(3) {
  background: linear-gradient(145deg, #006b6b, #009999);
}

.swiper-slide:nth-child(4) {
  background: linear-gradient(145deg, #33d4d4, var(--app-secondary-color));
}
</style>
