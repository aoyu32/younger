<template>
  <div class="app-detail" :style="appThemeStyle">
    <div class="app-info flex-center">
      <div class="app-icon">
        <div class="icon" @click="triggerRippleAnimation">
          <img
            :src="data?.icon"
            alt=""
            ref="iconRef"
            :style="iconFilterStyle"
          />
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
          <h2>{{ data?.desc }}</h2>
          <p>{{ data?.sub }}</p>
          <div class="tags">
            <span
              class="tag tag--category"
              :style="{
                color: primaryColor,
                backgroundColor: `color-mix(in srgb, ${primaryColor} 12%, transparent)`,
              }"
            >
              {{ data?.category }}
            </span>
            <span v-for="tag in appTags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
        <div class="download">
          <div ref="downloadRef" class="download-dropdown">
            <button
              type="button"
              class="download-trigger"
              :style="{ backgroundColor: primaryColor }"
              @click.stop="downloadOpen = !downloadOpen"
            >
              免费下载
            </button>

            <ul v-if="downloadOpen" class="download-menu">
              <li v-for="platform in downloadPlatforms" :key="platform">
                <button
                  type="button"
                  class="download-menu__item"
                  @click="handleDownload(platform)"
                >
                  <component
                    :is="PLATFORM_ICONS[platform]"
                    class="download-menu__icon"
                    :style="{ color: primaryColor }"
                  />
                  {{ PLATFORM_LABELS[platform] }}版本
                </button>
              </li>
            </ul>
          </div>

          <a href="javascript:void(0)" @click.prevent="openVideoModal">
            快速了解
            <span :style="{ color: primaryColor }">{{ data?.name }}</span>
          </a>

          <RouterLink
            class="mode-switch"
            :to="{ path: route.path, query: { ...route.query, mode: undefined } }"
          >
            <component
              :is="switchIcon"
              class="mode-switch__icon"
              :style="{ color: primaryColor }"
            />
            切换模式
          </RouterLink>
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
      <h2>{{ data?.banner.desc }}</h2>
      <DetailSwiper ref="detailSwiperRef"></DetailSwiper>
    </div>

    <div class="app-pictorial">
      <div
        class="pictorial-item"
        v-for="(item, index) in data?.pictorial"
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
          <p>继续滚动，了解更多相关信息</p>
        </div>
        <div class="svg-label-2" :style="{ color: primaryColor }">
          <p>查看{{ data?.name }}详细介绍，了解更多</p>
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

    <!-- 应用介绍 + 相关帖子：进入时逐行从左滑入、帖子从右滑入 -->
    <div class="intro-section" ref="introSectionRef">
      <div class="intro-grid">
        <div class="intro-content">
          <h2 class="intro-content__title" :style="{ color: primaryColor }">
            应用介绍
          </h2>
          <MdPreview id="classic-doc" :modelValue="data?.content" />
        </div>
        <aside class="intro-related">
          <h3 class="intro-related__title" :style="{ color: primaryColor }">
            相关帖子
          </h3>
          <AppRelatedNews />
        </aside>
      </div>
    </div>

    <!-- 相关视频：跟随滚动从右侧横向出现 -->
    <div class="classic-extra classic-extra--videos" ref="videosSectionRef">
      <h2 class="classic-extra__title" :style="{ color: primaryColor }">
        相关视频
      </h2>
      <AppRelatedVideos />
    </div>

    <!-- 相关课程：跟随滚动从左侧横向出现 -->
    <div class="classic-extra classic-extra--courses" ref="coursesSectionRef">
      <h2 class="classic-extra__title" :style="{ color: primaryColor }">
        相关课程
      </h2>
      <AppRelatedCourses />
    </div>

    <div class="next-app flex-center">
      <div
        class="icon flex-center"
        @mouseenter="handleBackTopHover"
        @mouseleave="handleBackTopHoverLeave"
      >
        <button @click="handleBackTop">
          <svg
            t="1778235555930"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="64756"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="64"
            height="64"
          >
            <path
              d="M414.92769 863.988713c-0.270899-9.932981 7.856085-17.969665 17.969665-17.698765 9.662081-0.270899 17.969665 7.856085 18.240564 17.969665l-0.0903 62.216578c0.0903 10.02328-8.217284 18.240564-18.330864 17.969665-10.02328 0-18.059965-7.946384-18.240564-17.969665L414.92769 863.988713 414.92769 863.988713zM592.186243 252.207407 592.186243 252.207407c44.156614 43.253616 43.885714 113.326279-0.1806 156.670194-44.246914 43.253616-115.854674 43.614815-159.920988 0.361199C388.198942 366.165785 388.198942 295.731922 432.355556 252.388007S547.93933 208.863492 592.186243 252.207407L592.186243 252.207407zM457.910406 277.401058 457.910406 277.401058c-30.069841 29.437743-30.160141 76.84515 0 106.373192 29.889242 29.257143 78.109347 29.076543 108.088889-0.270899C595.978836 354.246208 596.249735 306.658201 566.360494 277.401058 536.200353 247.873016 487.799647 248.234215 457.910406 277.401058L457.910406 277.401058zM393.436332 793.283951 393.436332 793.283951c-16.615168-16.253968-31.966138-33.049735-46.414109-51.470899C342.055732 735.311464 336.908642 728.900176 332.213051 722.217989l-2.708995 6.320988C323.273369 743.077249 319.751675 758.699118 319.119577 775.133686 318.306878 791.477954 304.310406 804.210229 287.785538 803.75873 284.173545 803.397531 281.193651 803.036332 278.394356 801.952734 238.391534 788.859259 204.167901 763.575309 179.967549 730.977072c-24.110053-32.507937-37.925926-71.87866-37.925926-114.951675l0 0 0 0C141.499824 576.744974 153.7806 539.992945 173.82716 509.200705c17.337566-26.006349 40.544621-47.497707 68.086067-63.571076L241.913228 437.954145 241.642328 437.051146 241.281129 437.322046c0.361199-90.480423 25.193651-176.084656 68.447266-249.588713C354.336508 111.339683 418.991182 48.039506 496.82963 4.244092c9.752381-5.688889 21.310758-5.417989 30.61164-0.1806l0.270899 0.361199L527.892769 4.514991c77.296649 43.885714 141.770723 107.095591 186.378836 183.128042C757.434921 260.96649 782.538272 346.841623 782.357672 437.231746l0.0903 2.889594L782.086772 445.810229C809.718519 461.161199 833.015873 483.104056 850.17284 509.291005c20.22716 30.431041 32.056437 67.183069 31.875838 106.463492l0 2.347795C881.416578 660.091711 867.510406 699.010935 844.303351 730.796473 819.561199 763.665608 785.156966 789.130159 744.522046 802.404233c-15.621869 5.14709-32.869136-3.611993-38.287125-18.962963C705.512522 780.912875 704.970723 777.842681 704.970723 774.953086 704.248325 758.789418 700.816931 742.896649 694.676543 728.448677L691.786949 722.03739C687.001058 728.719577 681.944268 735.582363 676.797178 742.083951c-14.718871 18.962963-30.97284 36.390829-48.220106 53.005996C622.707584 800.778836 615.393298 803.578131 607.717813 803.84903l0 0L416.191887 804.02963C407.071605 803.75873 399.034921 800.056437 393.436332 793.283951L393.436332 793.283951zM394.971429 705.693122 394.971429 705.693122c10.655379 13.454674 22.123457 26.548148 33.772134 38.648325l166.512875 0.0903c11.829277-12.190476 22.936155-25.193651 33.681834-38.738624 12.822575-16.434568 24.922751-33.681834 35.216931-52.102998 1.535097-2.618695 3.611993-5.417989 6.050088-7.494885C682.215168 634.80776 701.719929 635.439859 713.007407 647.720635c15.983069 16.976367 28.625044 36.481129 37.925926 58.153086 2.889594 7.675485 5.779189 15.983069 8.126984 24.200353 14.177072-8.939683 26.457848-20.40776 36.02963-34.223633 16.253968-22.123457 26.006349-48.852205 26.457848-78.380247L821.457496 615.754497c0.361199-27.451146-8.397884-53.005996-22.394356-74.226455C784.615168 519.133686 763.575309 501.61552 738.742857 490.779541 728.087478 486.26455 720.592593 474.706173 721.314991 462.335097l0.270899-12.822575L721.495591 438.857143 721.495591 437.412346c0.361199-80.366843-21.671958-155.857496-59.597884-219.880071C625.506878 155.586596 573.855379 102.4903 511.8194 64.474074 450.32522 102.670899 399.12522 155.315697 362.463492 217.261376c-38.016226 64.835273-59.868783 140.235626-59.868783 220.33157L302.414109 449.151323 302.23351 449.331922l0.632099 11.919577c1.083598 12.371076-5.508289 24.471252-17.698765 29.618342C260.334392 501.70582 239.475132 519.765785 225.20776 541.618342c-14.267372 21.220459-22.574956 46.955908-22.574956 74.407055L202.452205 615.844797c0 30.160141 9.571781 57.611287 26.638448 80.276543 9.391182 13.183774 21.762257 24.922751 35.93933 34.043034 2.438095-8.397884 5.05679-16.615168 8.217284-24.200353 9.210582-21.581658 21.942857-40.634921 37.384127-57.882187 2.257496-2.257496 4.96649-4.695591 8.036684-5.779189 14.357672-8.759083 32.869136-3.070194 41.08642 10.926279C370.500176 671.559788 382.329453 689.258554 394.971429 705.693122L394.971429 705.693122zM573.132981 863.808113 573.132981 863.808113C572.952381 854.055732 581.079365 846.199647 591.102646 846.199647c10.20388-0.1806 18.330864 7.765785 18.150265 17.789065l0 62.577778c-0.1806 9.752381-8.217284 17.698765-17.969665 17.698765-10.11358 0.270899-18.692063-8.126984-18.150265-17.789065L573.132981 863.808113 573.132981 863.808113zM493.759436 863.717813 493.759436 863.717813c0-9.662081 8.126984-17.518166 17.969665-17.698765 10.29418 0 18.421164 7.946384 18.240564 17.969665l0.1806 142.312522c0 9.752381-8.126984 17.789065-17.969665 17.518166-10.565079 0.270899-18.601764-7.765785-18.330864-17.789065L493.759436 863.717813 493.759436 863.717813z"
              p-id="64757"
              fill="#9499a0"
            ></path>
          </svg>
        </button>
        <p>返回顶部</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  computed,
  onBeforeUnmount,
  nextTick,
  watch,
} from 'vue';
import { Vibrant } from 'node-vibrant/browser';
import DetailSwiper from './DetailSwiper.vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { appDetailList } from '@/mock/app-detail';
import { useRoute } from 'vue-router';
import Lenis from 'lenis';
import VideoPlayer from '@/components/video-player/index.vue';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Flip } from 'gsap/Flip';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import AppRelatedNews from './AppRelatedNews.vue';
import AppRelatedVideos from './AppRelatedVideos.vue';
import AppRelatedCourses from './AppRelatedCourses.vue';
import windowsIcon from '@/assets/app-detail/icon_windows.svg';
import macosIcon from '@/assets/app-detail/icon_macos.svg';
import linuxIcon from '@/assets/app-detail/icon_linux.svg';
import switchIcon from '@/assets/app-detail/icon_switch.svg';
let lenis: Lenis | null = null;
let isUnmounted = false;

const route = useRoute();

const data = computed(() => {
  const id = Number(route.params.id);
  return appDetailList.find((appDetail) => appDetail.id === id)!;
});

type DownloadPlatform = 'windows' | 'macos' | 'linux';

const PLATFORM_LABELS: Record<DownloadPlatform, string> = {
  windows: 'Windows',
  macos: 'MacOS',
  linux: 'Linux',
};

const PLATFORM_ICONS: Record<DownloadPlatform, unknown> = {
  windows: windowsIcon,
  macos: macosIcon,
  linux: linuxIcon,
};

/** 当前应用支持的下载平台 */
const downloadPlatforms = computed(
  () => data.value.platforms as DownloadPlatform[],
);

/** 应用标签（去掉重复的分类标签） */
const appTags = computed(() =>
  data.value.tags.filter((tag) => tag !== data.value.category),
);

const downloadOpen = ref(false);
const downloadRef = ref<HTMLElement>();

const handleDownload = (_platform: DownloadPlatform) => {
  downloadOpen.value = false;
};

const handleDocumentClick = (event: MouseEvent) => {
  if (!downloadOpen.value) return;
  if (!downloadRef.value?.contains(event.target as Node)) {
    downloadOpen.value = false;
  }
};

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
gsap.registerPlugin(SplitText);
gsap.registerPlugin(Flip);
const iconRef = ref<HTMLImageElement>();
const primaryColor = ref('');
const detailSwiperRef = ref();
const svgPathRef = ref<HTMLElement>();
const motionPathRef = ref<SVGPathElement>();
const introSectionRef = ref<HTMLElement>();
const videosSectionRef = ref<HTMLElement>();
const coursesSectionRef = ref<HTMLElement>();
let introSplit: SplitText | null = null;
let extrasTriggers: ScrollTrigger[] = [];
const showVideoModal = ref(false);
// 视频地址
const videoSrc = ref(
  'https://gsap.com/community/uploads/monthly_2026_04/easereverseUI.mp4.d8211e8be205c4f869da1eea439903e9.mp4',
);

const arrowRef = ref<SVGGElement>();
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
  if (tl.scrollTrigger) scrollTriggers.push(tl.scrollTrigger);

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

  const labelTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.svg-wrapper',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    },
  });
  if (labelTl.scrollTrigger) scrollTriggers.push(labelTl.scrollTrigger);

  labelTl
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

/** 应用介绍逐行从左滑入，相关帖子从右滑入 */
let introTrigger: ScrollTrigger | null = null;
const setupIntroAnimation = () => {
  const section = introSectionRef.value;
  if (!section) return;

  const preview = section.querySelector<HTMLElement>('.md-editor-preview');
  const posts = section.querySelectorAll<HTMLElement>('.related-news__item');
  const introTitle = section.querySelector<HTMLElement>(
    '.intro-content__title',
  );
  const relatedTitle = section.querySelector<HTMLElement>(
    '.intro-related__title',
  );
  if (!preview) return;

  introSplit?.revert();
  introTrigger?.kill();

  introSplit = new SplitText(preview, {
    type: 'lines',
    linesClass: 'doc-line',
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      end: 'bottom 70%',
      scrub: 1,
    },
  });
  introTrigger = tl.scrollTrigger ?? null;

  if (introTitle) {
    tl.from(introTitle, {
      x: () => -(window.innerWidth / 2 + 200),
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    }, 0);
  }

  tl.from(
    introSplit.lines,
    {
      x: () => -(window.innerWidth / 2 + 200),
      opacity: 0,
      duration: 1,
      stagger: 0.12,
      ease: 'power2.out',
    },
    0.15,
  );

  if (relatedTitle) {
    tl.from(relatedTitle, {
      x: () => window.innerWidth / 2 + 200,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
    }, 0.2);
  }

  if (posts.length) {
    tl.from(
      posts,
      {
        x: () => window.innerWidth / 2 + 200,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power2.out',
      },
      0.3,
    );
  }
};

/** 相关视频从右、相关课程从左，跟随滚动逐张横向出现 */
const setupExtrasAnimation = () => {
  extrasTriggers.forEach((trigger) => trigger.kill());
  extrasTriggers = [];

  const build = (
    section: HTMLElement | undefined,
    selector: string,
    direction: 1 | -1,
  ) => {
    if (!section) return;

    const items = Array.from(section.querySelectorAll<HTMLElement>(selector));
    const title = section.querySelector<HTMLElement>('.classic-extra__title');
    if (!items.length) return;

    // 先归位，按每张卡片最终位置算出它自己的屏幕外起点，
    // 这样所有卡片都从屏幕同一侧边缘依次滑出，而不是整体平移导致叠在一起
    gsap.set(items, { clearProps: 'transform' });
    const vw = window.innerWidth;
    const starts = items.map((el) => {
      const rect = el.getBoundingClientRect();
      return direction === 1 ? vw - rect.left + 60 : -(rect.right + 60);
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 90%',
        end: 'top 35%',
        scrub: 1,
      },
    });
    if (tl.scrollTrigger) extrasTriggers.push(tl.scrollTrigger);

    if (title) {
      tl.fromTo(
        title,
        { x: direction * 300, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power2.out' },
        0,
      );
    }

    tl.fromTo(
      items,
      {
        x: (index: number) => starts[index],
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        /* 从左出场时按倒序播放：最右侧的卡片先从左边滑到目标位，避免压到已落位的卡片 */
        stagger:
          direction === 1 ? 0.35 : { each: 0.35, from: 'end' as const },
        ease: 'power2.out',
      },
      0.1,
    );
  };

  build(videosSectionRef.value, '.related-videos__item', 1);
  build(coursesSectionRef.value, '.related-courses__item', -1);
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

/** 主色拆成 r, g, b，供复用组件里的 rgba(var(--app-main-rgb), x) 使用 */
const primaryRgb = computed(() => {
  const match = primaryColor.value.match(/\d+,\s*\d+,\s*\d+/);
  return match ? match[0] : '';
});
const appThemeStyle = computed(() =>
  primaryRgb.value ? { '--app-main-rgb': primaryRgb.value } : {},
);
const toRGBA = (rgb: string, alpha: number) =>
  rgb.replace(/rgb\(/i, 'rgba(').replace(')', `,${alpha})`);

const generateFromVibrant = async () => {
  if (!iconRef.value || isUnmounted) return;

  try {
    const palette = await Vibrant.from(iconRef.value).getPalette();
    // 图片解析可能晚于组件卸载（例如切换到响应式形态）
    if (isUnmounted) return;
    const vibrant = palette.Vibrant;
    primaryColor.value = vibrant ? `rgb(${vibrant.rgb.join(',')})` : '#ffa0cf';
  } catch (error) {
    console.error('Vibrant 提取颜色失败:', error);
    primaryColor.value = '#ffa0cf';
  }
};

const rippleAnimation = () => {
  const desc = document.querySelector('.desc h2');
  const sub = document.querySelector('.desc p');
  const tags = document.querySelector('.desc .tags');
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
      tags,
      {
        opacity: 0,
        x: '100%',
      },
      {
        opacity: 1,
        x: '0%',
        duration: 1.15,
        delay: 0.25,
        repeat: 0,
        ease: 'bounce.out(0.55)',
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
let lenisRaf = 0;

const initLenis = () => {
  if (lenis) return;

  lenis = new Lenis({
    duration: 0.2,
    easing: (t) => 1 - Math.pow(1 - t, 2),
    smoothWheel: true,
    infinite: false,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    respectReducedMotion: false,
  });

  function raf(time: number) {
    // 组件卸载或切换为响应式形态后停止循环，避免重复挂载产生多条 RAF
    if (!lenis) return;
    lenis.raf(time);
    lenisRaf = requestAnimationFrame(raf);
  }
  lenisRaf = requestAnimationFrame(raf);

  lenis.on('scroll', ScrollTrigger.update);
};

const handleBackTopHover = () => {
  const path = document.querySelector('.next-app .icon svg path');
  const svg = document.querySelector('.next-app .icon svg');
  gsap.to(path, {
    attr: { fill: primaryColor.value },
    duration: 0.3,
    ease: 'power1.inOut',
  });
  gsap.to(svg, {
    y: -10,
    duration: 0.5,
    ease: 'power1.inOut',
  });
};

const handleBackTopHoverLeave = () => {
  const path = document.querySelector('.next-app .icon svg path');
  const svg = document.querySelector('.next-app .icon svg');
  gsap.to(path, {
    attr: { fill: '#9499a0' },
    duration: 0.3,
    ease: 'power1.inOut',
  });
  gsap.to(svg, {
    y: 0,
    duration: 0.5,
    ease: 'power1.inOut',
  });
};

const handleBackTop = () => {
  lenis?.scrollTo(0, {
    duration: 3,
    easing: (t) => 1 - Math.pow(1 - t, 3),
  });
};

let mountTimer = 0;

/** 切换为响应式形态时，停掉所有页面级 GSAP 循环/时间线，避免后台继续跑 */
const killPageAnimations = () => {
  gsap.killTweensOf(
    [
      '.ripple-bg',
      '.desc h2',
      '.desc p',
      '.desc .tags',
      '.download',
      '.app-swiper h2',
      '.swiper-container',
      '.next-app .icon svg',
      '.next-app .icon svg path',
    ].join(', '),
  );
  if (iconRef.value) gsap.killTweensOf(iconRef.value);
};

onMounted(async () => {
  await nextTick();
  rippleAnimation();
  mountTimer = window.setTimeout(() => {
    scrollAnimation();
    lineBgAnimation();
    setupPathScrollAnimation();
    setupIntroAnimation();
    setupExtrasAnimation();
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
  document.addEventListener('click', handleDocumentClick);
});

onBeforeUnmount(() => {
  isUnmounted = true;
  window.clearTimeout(mountTimer);
  cancelAnimationFrame(lenisRaf);
  lenis?.destroy();
  lenis = null;
  killPageAnimations();
  introTrigger?.kill();
  introSplit?.revert();
  extrasTriggers.forEach((trigger) => trigger.kill());
  extrasTriggers = [];
  scrollTriggers.forEach((trigger) => trigger.kill());
  scrollTriggers = [];

  document.removeEventListener('keydown', handleKeydown);
  document.removeEventListener('click', handleDocumentClick);

  document.body.style.overflow = '';
});

watch(
  () => route.path,
  () => {
    document.title = data.value.name;
  },
  { immediate: true },
);

/** 切换应用后重新拆分文档行，重放进入动画 */
watch(
  () => data.value?.content,
  () =>
    nextTick(() => {
      setupIntroAnimation();
      ScrollTrigger.refresh();
    }),
);
</script>

<style lang="scss" scoped>
@use '../index.scss' as *;
</style>
