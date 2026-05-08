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
      <div class="svg-wrapper">
        <div class="svg-label-1" :style="{ color: primaryColor }">
          <p>向下滚动，立马快速上手APP</p>
        </div>
        <div class="svg-label-2" :style="{ color: primaryColor }">
          <p>查看{{ data.name }}文档，了解更多</p>
        </div>
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
    </div>

    <div class="intro-section">
      <div class="intro-wrapper flex-center" ref="introWrapperRef">
        <div class="intro-card">
          <div class="name">{{ data.name }}文档</div>
        </div>
        <div class="app-intro-md">
          <div class="md-scroll-inner" ref="mdScrollInnerRef">
            <MdPreview :id="id" :modelValue="data.content" />
          </div>
        </div>
        <div class="intro-btns">
          <div class="download btn-item">
            <AoImage
              src="@/assets/app-detail/icon_download.svg"
              width="24px"
              height="24px"
            />
          </div>
          <div class="share btn-item">
            <AoImage
              src="@/assets/app-detail/icon_share.svg"
              width="24px"
              height="24px"
            />
          </div>
          <div class="github btn-item">
            <AoImage
              src="@/assets/app-detail/icon_github.svg"
              width="24px"
              height="24px"
            />
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
import AoImage from '@/components/ao-image/index.vue';
let lenis: Lenis | null = null;
const id = 'preview-only';
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
  const svgLabel1 = document.querySelector('.svg-label-1') as HTMLElement;

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

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: svgPathRef.value,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
    },
  });

  tl.to(
    path,
    {
      strokeDashoffset: 0,
      ease: 'none',
    },
    0,
  ).fromTo(
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

  gsap
    .timeline({
      scrollTrigger: {
        trigger: '.svg-wrapper',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    })
    .fromTo(
      '.svg-label-1',
      { opacity: 0, x: -800, y: 0 },
      {
        opacity: 1,
        x: -(svgPathRef.value.offsetWidth / 2 - svgLabel1.offsetWidth - 100),
        y: 300,
      },
    )
    .fromTo(
      '.svg-label-2',
      { opacity: 0, x: 600, y: 400 },
      { opacity: 1, x: 250, y: 1000 },
      0.5,
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
  const mdInner = mdScrollInnerRef.value as HTMLElement;
  const introBtns = document.querySelector('.intro-btns') as HTMLElement;
  const introCard = document.querySelector('.intro-card') as HTMLElement;

  if (!introSectionEl || !innerWrapperEl || !headerEl || !mdEl || !mdInner) {
    console.warn('setupDownloadPin: 缺少必要元素，跳过');
    return;
  }
  const maxScroll = getMaxScroll();

  gsap.set(mdInner, { y: 0 });
  gsap.set(innerWrapperEl, {
    position: 'relative',
    left: '50%',
    xPercent: -50,
  });
  const tl = gsap
    .timeline()
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
    .addLabel('enter', 1)
    .to(
      introCard,
      {
        scale: 0.5,
        x: () =>
          -(
            innerWrapperEl.getBoundingClientRect().width -
            mdInner.getBoundingClientRect().width
          ),
        y: () =>
          -(
            innerWrapperEl.getBoundingClientRect().height -
            introCard.getBoundingClientRect().height +
            20
          ) / 2,
        duration: 1,
        ease: 'power2.out',
      },
      'enter',
    )
    .fromTo(
      mdEl,
      { x: '150%' },
      { x: '0%', duration: 1, ease: 'power2.out' },
      'enter',
    )
    .to(
      introBtns,
      {
        x: '0',
        y: '0',
        opacity: 1,
        duration: 0.5,
        delay: 0.5,
        ease: 'power2.out',
      },
      '<',
    )
    .addLabel('scrollStart', 2);
  if (maxScroll > 0) {
    tl.to(
      mdInner,
      {
        y: -maxScroll,
        ease: 'none',
        duration: 2,
      },
      'scrollStart',
    ).addLabel('scrollEnd', 'scrollStart+=2');
  } else {
    tl.addLabel('scrollEnd', 'scrollStart');
  }

  tl.addLabel('leave', 'scrollEnd')
    .to(mdEl, { x: '-150%', duration: 1, ease: 'power2.in' }, 'leave')
    .addLabel('shrink', 'leave+=1')
    .to(
      headerEl,
      { width: '1200px', duration: 1, ease: 'power2.inOut' },
      'shrink',
    )
    .to(
      '.intro-card',
      {
        x: '0',
        y: '0',
        scale: '1',
        duration: 1,
        ease: 'power2.out',
      },
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

  const st = ScrollTrigger.create({
    trigger: introSectionEl,
    start: 'top top+=72px',
    end: '+=6000',
    scrub: 1,
    pin: true,
    animation: tl,
    invalidateOnRefresh: true,
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
    infinite: false,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
  });

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

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

  document.addEventListener('keydown', handleKeydown);
});

onBeforeUnmount(() => {
  lenis?.destroy();
  scrollTriggers.forEach((trigger) => trigger.kill());

  document.removeEventListener('keydown', handleKeydown);

  document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
