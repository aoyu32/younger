<template>
  <div class="app-detail">
    <div class="app-info flex-center">
      <div class="app-icon">
        <div class="glow-bg" :style="{ background: gradientStyle }"></div>
        <div class="icon">
          <!-- <img src="@/assets/aoyukmt.ico" alt="" ref="iconRef" /> -->
          <img src="@/assets/logo.png" alt="" ref="iconRef" />
        </div>
      </div>
      <div class="info-content">
        <div class="desc">
          <h2>{{ data.desc }}</h2>
          <p>{{ data.sub }}</p>
        </div>
        <div class="download">
          <button :style="{ backgroundColor: primaryColor }">免费下载</button>
          <a href="">
            快速了解
            <span :style="{ color: primaryColor }">{{ data.name }}</span>
          </a>
        </div>
      </div>
    </div>
    <div class="app-swiper">
      <h2>{{ data.banner.desc }}</h2>
      <DetailSwiper></DetailSwiper>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Vibrant } from 'node-vibrant/browser'
import DetailSwiper from './components/DetailSwiper.vue'

const gradientStyle = ref('')
const iconRef = ref<HTMLImageElement>()
const primaryColor = ref('')

const data = ref({
  id: 0,
  name: 'AOYUKMT',
  desc: '一个轻量实用的键盘按钮重映射工具',
  icon: '',
  sub: '快速、易用的按键映射工具',
  banner:{
    desc: '超多实用、快速、便携的功能'
  }
})

const generateFromVibrant = async () => {
  if (!iconRef.value) return

  try {
    const palette = await Vibrant.from(iconRef.value).getPalette()

    const vibrant = palette.Vibrant
    const muted = palette.Muted
    const darkVibrant = palette.DarkVibrant
    const lightVibrant = palette.LightVibrant

    primaryColor.value = `rgb(${vibrant?.rgb.join(',')})`
    console.log(primaryColor.value);
    

    console.log('颜色：', vibrant, muted, darkVibrant, lightVibrant)

    // 构建渐变色标
    const colorA = vibrant
    const colorB = muted
    const colorC = lightVibrant

    const a = `rgba(${colorA?.rgb.join(',')},0.8)`
    const b = `rgba(${colorB?.rgb.join(',')},0.3)`
    const c = `rgba(${colorC?.rgb.join(',')},0.1)`
    console.log(a)

    const colorStops = [`${a} 0%`, `${b} 50%`, `${c} 80%`, `transparent 90%`].join(', ')

    gradientStyle.value = `radial-gradient(circle at center, ${colorStops})`
    console.log('渐变样式:', gradientStyle.value)
  } catch (error) {
    console.error('Vibrant 提取颜色失败:', error)
    gradientStyle.value = `radial-gradient(circle at center, rgba(255,160,207,0.7) 0%, rgba(255,200,180,0.4) 30%, rgba(255,220,200,0.15) 70%, transparent 100%)`
    primaryColor.value = '#ffa0cf'
  }
}

onMounted(() => {
  if (iconRef.value?.complete) {
    generateFromVibrant()
  } else {
    iconRef.value?.addEventListener('load', generateFromVibrant)
  }
})
</script>
<style lang="scss" scoped>
@use './index.scss' as *;
</style>
