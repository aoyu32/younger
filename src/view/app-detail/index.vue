<template>
  <div class="app-detail">
    <div class="app-info flex-center">
      <div class="app-icon">
        <div class="icon" @click="triggerRippleAnimation">
          <img :src="data.icon" alt="" ref="iconRef" :style="iconFilterStyle" />
          <div
            :class="['ripple-bg', `ripple-${index}`]"
            v-for="index in 4"
            :key="index"
            :style="rippleStyle(index)"
          ></div>
        </div>
      </div>
      <div class="info-content">
        <div class="desc">
          <h2>{{ data.desc }}</h2>
          <p>{{ data.sub }}</p>
        </div>
        <div class="download">
          <button :style="{ backgroundColor: primaryColor }">免费下载</button>
          <a href="javascript:void(0)" @click.prevent="openVideoModal">
            快速了解
            <span :style="{ color: primaryColor }">{{ data.name }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- 视频模态窗口 -->
    <div
      v-if="showVideoModal"
      class="video-modal-overlay"
      @click.self="closeVideoModal"
    >
      <div class="video-modal-container">
        <div class="video-wrapper">
          <VideoPlayer :src="videoSrc" autoplay />
        </div>
      </div>
    </div>
    <div class="app-swiper">
      <h2>{{ data.banner.desc }}</h2>
      <DetailSwiper ref="detailSwiperRef"></DetailSwiper>
    </div>

    <div class="app-pictorial">
      <div
        class="pictorial-item"
        v-for="(item, index) in data.pictorial"
        :key="index"
      >
        <h2 :class="`text-${item.id}`">{{ item.text }}</h2>
        <p v-if="item.desc">{{ item.desc }}</p>
        <div
          :class="['pictorial-img', `pictorial-img-${item.id}`]"
          v-for="(img, index) in item.images"
          :key="index"
        >
          <img :src="img.img.src" alt="" />
        </div>
      </div>
    </div>

    <div class="svg-path flex-center" ref="svgPathRef">
      <!-- <div class="svg-icon" ref="planeIconRef">
        <img
          src="@/assets/app-detail/icon_plane.svg"
          alt=""
          style="transform: rotate(0deg)"
        />
      </div> -->
      <!-- <svg
        ref="svgRef"
        width="262"
        height="926"
        viewBox="0 0 262 926"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref="motionPathRef"
          d="M78.3135 0.055687C91.3135 116.056 -144.686 363.056 147.314 445.056C439.314 527.056 78.3135 817.056 83.3135 925.056"
          :stroke="primaryColor"
          stroke-width="2"
          fill="none"
        />
      </svg> -->
      <svg
        width="318"
        height="1042"
        viewBox="0 0 318 1042"
        fill="none"
        ref="svgRef"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M160.064 2.80384C144.145 124.195 517.624 404.65 160.064 490.461C-197.496 576.272 166.187 878.179 160.064 991.199"
          :stroke="primaryColor"
          ref="motionPathRef"
          stroke-width="5"
          stroke-linecap="square"
          stroke-linejoin="bevel"
        />
      </svg>
      <svg
        width="61"
        height="78"
        viewBox="0 0 61 78"
        xmlns="http://www.w3.org/2000/svg"
        ref="arrowRef"
        :fill="primaryColor"
      >
        <path
          d="M30.4121 77.4385L60.8242 0L30.4121 26.6592L0.000976562 0H0L30.4121 77.4385Z"
        />
      </svg>
    </div>

    <div class="intro-section">
      <div class="intro-wrapper flex-center" ref="introWrapperRef">
        <!-- <div
          class="app-intro-card"
          :style="{ backgroundColor: toRGBA(primaryColor, 0.1) }"
        >
          <div class="icon">
            <img :src="data.icon" alt="" />
          </div>
          <div class="name">
            <h2>{{ data.name }}</h2>
          </div>
          <div class="desc">
            <p>{{ data.desc }}</p>
          </div>
          <div class="tags">
            <div
              class="tag-item"
              v-for="(item, index) in data.tags"
              :key="index"
            >
              {{ item }}
            </div>
          </div>
          <div class="download-btn">
            <button>立即使用</button>
          </div>
        </div> -->
        <div class="app-intro-md">
          <div class="md-scroll-inner" ref="mdScrollInnerRef">
            <MdPreview :id="id" :modelValue="data.content" />
          </div>
        </div>
      </div>
    </div>
    <div class="next-app flex-center" style="padding: 20px; width: 100%">
      <button>下一个</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount, nextTick } from 'vue';
import { Vibrant } from 'node-vibrant/browser';
import DetailSwiper from './components/DetailSwiper.vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { appDetail } from '@/mock/app-detail';
import { useRouter } from 'vue-router';
import Lenis from 'lenis';
import VideoPlayer from '@/components/video-player/index.vue';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Flip } from 'gsap/Flip';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
let lenis: Lenis | null = null;
const router = useRouter();
const id = 'preview-only';
const text = ref('# Hello Editor');
const data = ref(appDetail);
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(Flip);
const gradientStyle = ref('');
const iconRef = ref<HTMLImageElement>();
const primaryColor = ref('');
const detailSwiperRef = ref();
const introWrapperRef = ref();
const svgPathRef = ref<HTMLElement>();
const planeIconRef = ref<HTMLElement>();
const motionPathRef = ref<SVGPathElement>();
const mdScrollInnerRef = ref<HTMLElement>();
const showVideoModal = ref(false);
// 视频地址
const videoSrc = ref(
  'https://gsap.com/community/uploads/monthly_2026_04/easereverseUI.mp4.d8211e8be205c4f869da1eea439903e9.mp4',
);

const arrowRef = ref<SVGGElement>();
const getMaxScroll = () => {
  if (!mdScrollInnerRef.value) return 0;
  const parent = mdScrollInnerRef.value.parentElement!;
  return mdScrollInnerRef.value.scrollHeight - parent.clientHeight;
};
const setupPathScrollAnimation = () => {
  if (!svgPathRef.value || !motionPathRef.value || !arrowRef.value) return;

  const path = motionPathRef.value;
  const arrow = arrowRef.value;
  const pathLength = path.getTotalLength();
  const startPoint = path.getPointAtLength(0);

  // 初始化：线索隐藏，箭头放到路径起点并隐藏
  gsap.set(path, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength,
    opacity: 1,
  });
  gsap.set(arrow, {
    x: startPoint.x,
    y: startPoint.y,
    opacity: 0,
    transformOrigin: 'center center',
  });

  // 滚动驱动的同步动画
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: svgPathRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
    },
  });

  // 描边生长
  tl.to(
    path,
    {
      strokeDashoffset: 0,
      ease: 'none',
    },
    0,
  )
    // 箭头沿路径移动 + 自动旋转
    .fromTo(
      arrow,
      { opacity: 1 },
      {
        motionPath: {
          path: path,
          align: path,
          alignOrigin: [0.5, 0.5],
          autoRotate: 270,
        },
        ease: 'none',
      },
      0,
    );
};

// 打开视频模态窗口
const openVideoModal = () => {
  showVideoModal.value = true;
  document.body.style.overflow = 'hidden';
  lenis?.stop();
};

const closeVideoModal = () => {
  showVideoModal.value = false;
  document.body.style.overflow = '';
  lenis?.start();
};

// 监听 ESC 键关闭
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showVideoModal.value) {
    closeVideoModal();
  }
};

const iconFilterStyle = computed(() => {
  const color = primaryColor.value;
  return {
    filter: `drop-shadow(0 0 0.56vw ${toRGBA(color, 0.3)})`,
  };
});
const toRGBA = (rgb: string, alpha: number) =>
  rgb.replace(/rgb\(/i, 'rgba(').replace(')', `,${alpha})`);

const generateFromVibrant = async () => {
  console.log('iconref:', iconRef.value);

  if (!iconRef.value) return;

  try {
    const palette = await Vibrant.from(iconRef.value).getPalette();
    const vibrant = palette.Vibrant;
    const muted = palette.Muted;
    const darkVibrant = palette.DarkVibrant;
    const lightVibrant = palette.LightVibrant;

    const main = vibrant ? `rgb(${vibrant.rgb.join(',')})` : '#ffa0cf';
    const sub1 = muted ? `rgb(${muted.rgb.join(',')})` : '#ffc8b4';
    const sub2 = lightVibrant
      ? `rgb(${lightVibrant.rgb.join(',')})`
      : '#ffdcc8';
    gsap.set(introWrapperRef.value, {
      background: `linear-gradient(135deg, ${toRGBA(main, 0.8)}, ${toRGBA(sub1, 0.6)}, ${toRGBA(sub2, 0.4)})`,
    });

    gsap
      .timeline({
        repeat: -1,
        defaults: {
          duration: 2,
          ease: 'none',
        },
      })
      .to(introWrapperRef.value, {
        background: `linear-gradient(135deg, ${toRGBA(main, 0.6)}, ${toRGBA(sub1, 0.6)}, ${toRGBA(sub2, 0.4)})`,
      })
      .to(introWrapperRef.value, {
        background: `linear-gradient(135deg, ${toRGBA(sub1, 0.6)}, ${toRGBA(sub2, 0.4)}, ${toRGBA(main, 0.8)})`,
      })
      .to(introWrapperRef.value, {
        background: `linear-gradient(135deg, ${toRGBA(sub1, 0.8)}, ${toRGBA(sub2, 0.4)}, ${toRGBA(main, 0.8)})`,
      })
      .to(introWrapperRef.value, {
        background: `linear-gradient(135deg, ${toRGBA(sub2, 0.4)}, ${toRGBA(main, 0.8)}, ${toRGBA(sub1, 0.6)})`,
      })
      .to(introWrapperRef.value, {
        background: `linear-gradient(135deg, ${toRGBA(sub2, 0.6)}, ${toRGBA(main, 0.8)}, ${toRGBA(sub1, 0.6)})`,
      })
      .to(introWrapperRef.value, {
        background: `linear-gradient(135deg, ${toRGBA(main, 0.8)}, ${toRGBA(sub1, 0.6)}, ${toRGBA(sub2, 0.4)})`,
      });
    primaryColor.value = `rgb(${vibrant?.rgb.join(',')})`;
    console.log(primaryColor.value);
    const lightShadow = `0 0 15px ${toRGBA(primaryColor.value, 0.6)}`;
    document.documentElement.style.setProperty('--primary-shadow', lightShadow);
    console.log('颜色：', vibrant, muted, darkVibrant, lightVibrant);
    document.documentElement.style.setProperty(
      '--fill-color',
      primaryColor.value,
    );
    const colorA = vibrant;
    const colorB = muted;
    const colorC = lightVibrant;

    const a = `rgba(${colorA?.rgb.join(',')},0.8)`;
    const b = `rgba(${colorB?.rgb.join(',')},0.3)`;
    const c = `rgba(${colorC?.rgb.join(',')},0.1)`;
    console.log(a);

    const colorStops = [
      `${a} 0%`,
      `${b} 50%`,
      `${c} 80%`,
      `transparent 90%`,
    ].join(', ');

    gradientStyle.value = `radial-gradient(circle at center, ${colorStops})`;
    console.log('渐变样式:', gradientStyle.value);
  } catch (error) {
    console.error('Vibrant 提取颜色失败:', error);
    gradientStyle.value = `radial-gradient(circle at center, rgba(255,160,207,0.7) 0%, rgba(255,200,180,0.4) 30%, rgba(255,220,200,0.15) 70%, transparent 100%)`;
    primaryColor.value = '#ffa0cf';
  }
};

const rippleAnimation = () => {
  const desc = document.querySelector('.desc h2');
  const sub = document.querySelector('.desc p');
  const download = document.querySelector('.download');
  triggerRippleAnimation();

  gsap
    .timeline()
    .fromTo(
      desc,
      {
        opacity: 0,
        x: '100%',
      },
      {
        opacity: 1,
        x: '0%',
        duration: 1,
        delay: 0.1,
        repeat: 0,
        ease: 'bounce.out(0.7)',
      },
      '<',
    )
    .fromTo(
      sub,
      {
        opacity: 0,
        x: '100%',
      },
      {
        opacity: 1,
        x: '0%',
        duration: 1.1,
        delay: 0.2,
        repeat: 0,
        ease: 'bounce.out(0.6)',
      },
      '<',
    )
    .fromTo(
      download,
      {
        opacity: 0,
        x: '100%',
      },
      {
        opacity: 1,
        x: '0%',
        duration: 1.2,
        delay: 0.3,
        repeat: 0,
        ease: 'bounce.out(0.5)',
      },
      '<',
    );
};

const triggerRippleAnimation = () => {
  const ripples = document.querySelectorAll('.ripple-bg');
  gsap.killTweensOf(ripples);
  const tl = gsap.timeline({ repeat: 0 });

  gsap.fromTo(
    iconRef.value as any,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1, ease: 'bounce.out(2)' },
  );

  ripples.forEach((ripple, index) => {
    gsap.set(ripple, { xPercent: -50, yPercent: -50 });

    const duration = 1 + index * 0.01;
    tl.fromTo(
      ripple,
      {
        scale: 0.5,
        opacity: 0.2,
      },
      {
        scale: 1.8,
        opacity: 0.5,
        duration: duration,
        ease: 'bounce.out(2)',
      },
      index * 0.1,
    );
  });
};

let scrollTriggers: ScrollTrigger[] = [];

const scrollAnimation = () => {
  scrollTriggers.forEach((trigger) => trigger.kill());
  scrollTriggers = [];

  const items = document.querySelectorAll<HTMLElement>('.pictorial-item');
  items.forEach((item, index) => {
    const animationName = data.value.pictorial[index]?.animation || 'default';
    const buildAnimation =
      animationBuilders[animationName] || animationBuilders.default;

    const targets = item.querySelectorAll('h2, p, .pictorial-img');
    const tween = buildAnimation(targets);

    const st = ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      end: 'top 20%',
      animation: tween,
      scrub: 1,
    });

    scrollTriggers.push(st);
  });
};

const setupDownloadPin = () => {
  const introSectionEl = document.querySelector('.intro-section');
  const innerWrapperEl = document.querySelector('.intro-wrapper');
  const headerEl = document.querySelector('.header');
  const mdEl = document.querySelector('.app-intro-md') as HTMLElement;
  const mdInner = mdScrollInnerRef.value;

  if (!introSectionEl || !innerWrapperEl || !headerEl || !mdEl || !mdInner) {
    console.warn('setupDownloadPin: 缺少必要元素，跳过');
    return;
  }

  // 计算内部可滚动距离（若内容高度小于容器高度，则为 0）
  const maxScroll = getMaxScroll();

  // 重置内部偏移
  gsap.set(mdInner, { y: 0 });
  gsap.set(innerWrapperEl, {
    position: 'relative',
    left: '50%',
    xPercent: -50,
  });

  // 1. 先创建时间线，链式调用到 addLabel('scrollStart', 2) 停止
  const tl = gsap
    .timeline()
    // 阶段1：宽度扩展（进度 0 → 1）
    .fromTo(
      headerEl,
      { width: '1200px' },
      { width: '100vw', duration: 1, ease: 'power2.inOut' },
      0,
    )
    .fromTo(
      innerWrapperEl,
      { width: '1200px', borderRadius: '24px' },
      { width: '100vw', borderRadius: 0, duration: 1, ease: 'power2.inOut' },
      0,
    )
    // 阶段2：md 从右侧滑入（进度 1 → 2）
    .addLabel('enter', 1)
    .fromTo(
      mdEl,
      { x: '150%' },
      { x: '0%', duration: 1, ease: 'power2.out' },
      'enter',
    )
    .addLabel('scrollStart', 2);

  // 2. 根据内容是否溢出，添加内部滚动动画
  if (maxScroll > 0) {
    tl.to(
      mdInner,
      {
        y: -maxScroll,
        ease: 'none',
        duration: 2, // 内容滚动用时 2 秒（即滚动距离）
      },
      'scrollStart',
    ).addLabel('scrollEnd', 'scrollStart+=2');
  } else {
    // 无溢出则直接将 scrollEnd 对齐到 scrollStart
    tl.addLabel('scrollEnd', 'scrollStart');
  }

  // 3. 继续链式添加后续动画
  tl.addLabel('leave', 'scrollEnd')
    // 阶段4：md 向左滑出
    .to(mdEl, { x: '-150%', duration: 1, ease: 'power2.in' }, 'leave')
    // 阶段5：宽度收回（leave 结束后开始）
    .addLabel('shrink', 'leave+=1')
    .to(
      headerEl,
      { width: '1200px', duration: 1, ease: 'power2.inOut' },
      'shrink',
    )
    .to(
      innerWrapperEl,
      {
        width: '1200px',
        borderRadius: '24px',
        duration: 1,
        ease: 'power2.inOut',
      },
      'shrink',
    );

  // 4. 创建 ScrollTrigger
  const st = ScrollTrigger.create({
    trigger: introSectionEl,
    start: 'top top+=72px', // 根据你的头部高度调整
    end: '+=6000', // 数值需匹配时间线总时长（约6秒），可适当增减
    scrub: 1,
    pin: true,
    animation: tl,
  });

  scrollTriggers.push(st);
};
const bannerAnimation = () => {
  const swiperEl = detailSwiperRef.value?.$el;
  gsap
    .timeline()
    .fromTo(
      '.app-swiper h2',
      { opacity: 0, y: 100, duration: 1, ease: 'bounce.out(2)' },
      { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out(2)', delay: 1.3 },
    )
    .fromTo(
      swiperEl,
      { opacity: 0, y: 100, duration: 1, ease: 'bounce.out(2)' },
      { opacity: 1, y: 0, duration: 0.5, ease: 'bounce.out(2)' },
    );
};

const rippleStyle = (index: number) => {
  const sizeMap: Record<number, number> = {
    1: 90,
    2: 130,
    3: 170,
    4: 210,
  };
  const alphaMap: Record<number, number> = {
    1: 0.25,
    2: 0.2,
    3: 0.15,
    4: 0.1,
  };

  const size = sizeMap[index];
  const alpha = alphaMap[index];
  const color = primaryColor.value;

  return {
    width: `${size}px`,
    height: `${size}px`,
    backgroundColor: toRGBA(color, alpha),
  };
};

const animationBuilders: Record<
  string,
  (targets: gsap.TweenTarget) => gsap.core.Tween
> = {
  fadeUp: (targets) =>
    gsap.fromTo(
      targets,
      { opacity: 1, y: 200 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out' },
    ),
  fadeLeft: (targets) =>
    gsap.fromTo(
      targets,
      { opacity: 0, x: '-100%' },
      { opacity: 1, x: 0, duration: 1, stagger: 0.15, ease: 'power2.out' },
    ),
  fadeRight: (targets) =>
    gsap.fromTo(
      targets,
      { opacity: 0, x: '100%' },
      { opacity: 1, x: 0, duration: 1, stagger: 0.15, ease: 'power2.out' },
    ),
  zoomIn: (targets) =>
    gsap.fromTo(
      targets,
      { opacity: 0, scale: 0.3 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        stagger: 0.15,
        ease: 'back.out(1.7)',
      },
    ),
  rotateIn: (targets) =>
    gsap.fromTo(
      targets,
      { opacity: 0, rotation: 20 },
      {
        opacity: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
      },
    ),
  default: (targets) =>
    gsap.fromTo(
      targets,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power2.out' },
    ),
};

const lineBgAnimation = () => {
  const lineBgs = gsap.utils.toArray<HTMLElement>('.line-bg');
  lineBgs.forEach((line, index) => {
    gsap.fromTo(
      line,
      {
        width: 0,
      },
      {
        width: 200 * index + 'px',
        y: 65 * index,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
      },
    );
  });
};
const initLenis = () => {
  lenis = new Lenis({
    duration: 0.3,
    easing: (t) => 1 - Math.pow(1 - t, 2),
    smoothWheel: true,
    // 以下为新增
    infinite: false,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
  });

  // 将 Lenis 回调改为 requestAnimationFrame 方式，更稳定
  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // 同步 ScrollTrigger 更新
  lenis.on('scroll', ScrollTrigger.update);
};

onMounted(async () => {
  await nextTick();
  rippleAnimation();
  setTimeout(() => {
    scrollAnimation();
    lineBgAnimation();
    setupPathScrollAnimation();
    setupDownloadPin();
    ScrollTrigger.refresh();
    initLenis();
  }, 300);
  bannerAnimation();
  if (iconRef.value?.complete) {
    generateFromVibrant();
  } else {
    iconRef.value?.addEventListener('load', generateFromVibrant);
  }

  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  lenis?.destroy();
  scrollTriggers.forEach((trigger) => trigger.kill());

  // 移除键盘事件监听
  document.removeEventListener('keydown', handleKeydown);

  // 确保恢复滚动
  document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
