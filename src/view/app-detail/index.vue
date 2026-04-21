<template>
  <div class="app-detail">
    <div class="app-info flex-center">
      <div class="app-icon">
        <div class="glow-bg" :style="{ background: gradientStyle }"></div>
        <div class="icon">
          <!-- <img src="@/assets/aoyukmt.ico" alt="" ref="iconRef" /> -->
          <!-- <img src="@/assets/logo.png" alt="" ref="iconRef" /> -->
          <img :src="data.icon" alt="" ref="iconRef" />
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
    <div class="app-pictorial">
      <div class="pictorial-item" v-for="(item, index) in data.pictorial" :key="index">
        <h2 :class="`text-${item.id}`">{{ item.text }}</h2>
        <p v-if="item.desc">{{ item.desc }}</p>
        <div
          :class="['pictorial-img', `pictorial-img-${item.id}`]"
          v-for="(img, index) in item.images"
          :key="index"
        >
          <img :src="img" alt="" />
        </div>
      </div>
    </div>
    <div
      class="app-download"
      :style="{ boxShadow: `inset 0 0px 100px ${toRGBA(primaryColor, 0.3)}` }"
    >
      <div class="download-wrapper">
        <div class="app-down-icon">
          <img :src="data.icon" alt="" />
        </div>
        <div class="desc">
          <h1>{{ data.name }}</h1>
          <p>{{ data.desc }}</p>
        </div>
        <div class="download-btn">
          <button :style="{ backgroundColor: primaryColor }">立即使用</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Vibrant } from 'node-vibrant/browser'
import DetailSwiper from './components/DetailSwiper.vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import img1 from '@/assets/1.png'
import img2 from '@/assets/2.png'
import img3 from '@/assets/3.png'
import img4 from '@/assets/4.png'
import appIcon from '@/assets/logo.png'
import Lenis from 'lenis'
gsap.registerPlugin(ScrollTrigger)
const gradientStyle = ref('')
const iconRef = ref<HTMLImageElement>()
const primaryColor = ref('')
let lenis: Lenis | null = null
const data = ref({
  id: 0,
  name: 'AOYUKMT',
  desc: '一个轻量实用的键盘按钮重映射工具',
  icon: appIcon,
  sub: '快速、易用的按键映射工具',
  banner: {
    desc: '超多实用、快速、便携的功能'
  },
  pictorial: [
    {
      id: 1,
      text: '简单配置，快速上手使用',
      desc: '无需复杂设置，几步操作即可完成键盘映射配置，让新手也能轻松掌握',
      images: [img1]
    },
    {
      id: 2,
      text: '丰富实用的便捷功能集合',
      desc: '',
      images: [img2]
    },
    {
      id: 3,
      text: '灵活的个性化定制选项',
      desc: '支持自定义按键布局、主题色彩、触发方式等，满足不同用户的使用习惯',
      images: [img3]
    },
    {
      id: 4,
      text: '大幅提升日常工作效率',
      desc: '通过优化键盘操作流程，减少重复性动作，帮助用户更高效地完成工作任务',
      images: [img4]
    }
  ]
})
const toRGBA = (rgb:string, alpha:number) => rgb.replace(/rgb\(/i, 'rgba(').replace(')', `,${alpha})`);
const generateFromVibrant = async () => {
  if (!iconRef.value) return

  try {
    const palette = await Vibrant.from(iconRef.value).getPalette()

    const vibrant = palette.Vibrant
    const muted = palette.Muted
    const darkVibrant = palette.DarkVibrant
    const lightVibrant = palette.LightVibrant

    primaryColor.value = `rgb(${vibrant?.rgb.join(',')})`
    console.log(primaryColor.value)

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

const registerScrollDrivenAnimations = () => {
  gsap.context(() => {
    const items = gsap.utils.toArray('.pictorial-item') as HTMLElement[]

    items.forEach((item) => {
      const heading = item.querySelector('h2')
      const images = item.querySelectorAll('.pictorial-img')

      // 创建时间轴，滚动驱动
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 80%', // 元素顶部到达视口 80% 位置时动画开始
          end: 'top 20%', // 元素顶部到达视口 20% 位置时动画结束
          scrub: 1 // 平滑跟随，延迟 1 秒的追赶感
          // markers: true,     // 调试时开启，观察触发区间
        }
      })

      // 标题：从左滑入 + 淡入
      if (heading) {
        tl.fromTo(heading, { x: -60, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out' }, 0)
      }

      // 图片：从下方滑入 + 淡入，错开出现
      if (images.length) {
        tl.fromTo(
          images,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.2, ease: 'power2.out' },
          '<+=0.2' // 在标题动画开始后 0.2 秒启动图片动画
        )
      }
    })

    // 可选：顶部信息区域也做滚动驱动
    const infoTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.app-info',
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1
      }
    })
    infoTl
      .fromTo('.app-info .desc h2', { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, 0)
      .fromTo('.app-info .desc p', { y: 40, opacity: 0 }, { y: 0, opacity: 1 }, '<+=0.1')
      .fromTo('.app-info .download', { y: 30, opacity: 0 }, { y: 0, opacity: 1 }, '<+=0.1')
      .fromTo(
        '.app-icon',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, ease: 'back.out(1.2)' },
        0
      )
  })
}
onMounted(() => {
  // 初始化 Lenis 平滑滚动
  lenis = new Lenis({
    lerp: 0.1, // 插值系数，控制滚动的“粘滞”程度
    smoothWheel: true, // 平滑鼠标滚轮
    syncTouch: true, // 触摸设备同步
    gestureOrientation: 'vertical'
  })
  lenis.scrollTo(0, { immediate: true })
  // 启动 requestAnimationFrame 循环
  function raf(time: number) {
    lenis?.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  // 将 Lenis 与 ScrollTrigger 同步
  lenis.on('scroll', ScrollTrigger.update)

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000) 
  })

  // 可选：关闭 GSAP 的滞后平滑
  gsap.ticker.lagSmoothing(0)

  if (iconRef.value?.complete) {
    generateFromVibrant()
  } else {
    iconRef.value?.addEventListener('load', generateFromVibrant)
  }

  registerScrollDrivenAnimations()
})

onBeforeUnmount(()=>{
  if (lenis) {
    lenis.destroy()
    lenis = null
  }
})
</script>
<style lang="scss" scoped>
@use './index.scss' as *;
</style>
