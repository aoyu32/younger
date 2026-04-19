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
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-1.jpg" /></swiper-slide>
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-2.jpg" /></swiper-slide>
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-3.jpg" /></swiper-slide>
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-4.jpg" /></swiper-slide>
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-5.jpg" /></swiper-slide>
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-6.jpg" /></swiper-slide>
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-7.jpg" /></swiper-slide>
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-8.jpg" /></swiper-slide>
      <swiper-slide><img src="https://swiperjs.com/demos/images/abstract-9.jpg" /></swiper-slide>
    </swiper>
    <div class="custom-pagination"></div>
  </div>
</template>
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
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
