<template>
  <div class="swiper-container">
    <swiper
      :effect="'coverflow'"
      :grabCursor="true"
      :centeredSlides="true"
      :slidesPerView="'auto'"
      :loop="true"
      :coverflowEffect="{
        rotate: 0,
        stretch: 100,
        depth: 100,
        modifier: 1,
        slideShadows: false,
        scale: 0.9
      }"
      :pagination="{
        el: '.custom-pagination',
        clickable: true
      }"
      :modules="modules"
      class="mySwiper"
    >
      <swiper-slide><img :src="img1" /></swiper-slide>
      <swiper-slide><img :src="img2" /></swiper-slide>
      <swiper-slide><img :src="img3" /></swiper-slide>
      <swiper-slide><img :src="img4" /></swiper-slide>
    </swiper>
    <div class="custom-pagination"></div>
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import img1 from '@/assets/1.png'
import img2 from '@/assets/2.png'
import img3 from '@/assets/3.png'
import img4 from '@/assets/4.png'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import { EffectCoverflow, Pagination } from 'swiper/modules'
const modules = [EffectCoverflow, Pagination]
</script>
<style lang="scss" scoped>
.swiper-container {
  width: 100%;
}
.swiper-slide {
  background-position: center;
  background-size: cover;
  border: 1px solid var(--app-border-color);
  border-radius: 10px;
  width: 700px;
  height: 500px;
}

.custom-pagination {
  padding: 30px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swiper-slide img {
  border-radius: 10px;
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 0 10px rgba(79, 79, 79, 0.477);
}
</style>
