<template>
  <div ref="cardRef" class="app-info-card-wrap">
    <article class="app-info-card">
      <div ref="stageRef" class="app-info-card__stage">
        <span
          v-for="index in RIPPLE_COUNT"
          :key="index"
          :ref="(el) => setRippleEl(el, index - 1)"
          class="app-info-card__ripple"
          aria-hidden="true"
        ></span>
        <img
          ref="iconRef"
          class="app-info-card__icon"
          :src="app.icon"
          :alt="app.name"
          @click="playRipple"
        />
      </div>
      <div class="app-info-card__text">
        <h1 class="app-info-card__name">{{ app.name }}</h1>
        <span class="app-info-card__category">{{ app.category }}</span>
        <div v-if="descLines.length" class="app-info-card__desc">
          <div
            v-for="(line, index) in descLines"
            :key="index"
            class="app-info-card__desc-line"
          >
            {{ line }}
          </div>
        </div>
        <div v-if="tags.length" class="app-info-card__tags">
          <span v-for="tag in tags" :key="tag" class="app-info-card__tag">
            {{ tag }}
          </span>
        </div>
        <AppDownloadButtons
          class="app-info-card__downloads"
          :platforms="app.platforms"
        />
      </div>
    </article>

    <div class="app-info-card__switch">
      <AoTooltip
        content="切换模式"
        placement="bottom"
        :background="`rgb(${mainRgb})`"
        :offset="10"
      >
        <RouterLink
          class="app-info-card__switch-btn"
          :to="to"
          aria-label="切换模式"
        >
          <component :is="switchIcon" class="app-info-card__switch-icon" />
        </RouterLink>
      </AoTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { gsap } from 'gsap';
import { Vibrant } from 'node-vibrant/browser';
import AppDownloadButtons from './AppDownloadButtons.vue';
import AoTooltip from '@/components/ao-tooltip/index.vue';
import switchIcon from '@/assets/app-detail/icon_switch.svg';
import type { RouteLocationRaw } from 'vue-router';
import type { AppDetailItem } from '../types';

defineOptions({ name: 'AppInfoCard' });

const props = defineProps<{
  app: AppDetailItem;
  /** 切换到原版详情页的目标地址 */
  to: RouteLocationRaw;
}>();

const emit = defineEmits<{ palette: [rgb: string] }>();

/** 当前图标主色（tooltip 背景用） */
const mainRgb = ref('0, 181, 181');

/** 标签：排除已在名称下方展示过的分类 */
const tags = computed(() =>
  (props.app.tags ?? []).filter((tag) => tag !== props.app.category),
);

/** 第一行比应用名称多取的字符数 */
const DESC_EXTRA_CHARS = 6;

/**
 * 描述拆成上下两行：
 * 第一行取「应用名称字符数 + 6」，其余放第二行。
 * 处理空描述、描述较短、按空白/标点断行、emoji 等边界。
 */
const descLines = computed<string[]>(() => {
  const desc = (props.app.desc ?? '').trim();
  if (!desc) return [];

  // 按码点计数，避免把 emoji / 代理对切成两半
  const chars = Array.from(desc);
  const nameChars = Array.from(props.app.name ?? '').length;
  const limit = Math.max(nameChars + DESC_EXTRA_CHARS, 1);

  if (chars.length <= limit) return [desc];

  // 在截断点附近回退到空白/标点处，避免把英文单词或句子切一半
  let cut = limit;
  const boundary = /[\s，,、；;：:。.！!？?]/;
  for (let i = limit; i > 0 && i > limit - 6; i -= 1) {
    if (boundary.test(chars[i] ?? '')) {
      cut = i;
      break;
    }
  }

  const first = chars.slice(0, cut).join('').trim();
  const rest = chars.slice(cut).join('').trim();
  return rest ? [first, rest] : [first];
});

/** 水波纹层数（由内到外） */
const RIPPLE_COUNT = 4;

/** 取不到图标色时的兜底（品牌色系） */
const FALLBACK_PALETTE: BrandPalette = {
  main: [0, 181, 181],
  muted: [90, 200, 200],
  light: [200, 240, 240],
};

interface BrandPalette {
  /** 主色：波纹、强调 */
  main: number[];
  /** 次色：渐变的过渡层 */
  muted: number[];
  /** 亮色：背景顶部的高光 */
  light: number[];
}

const cardRef = ref<HTMLElement>();
const stageRef = ref<HTMLElement>();
const iconRef = ref<HTMLImageElement>();
const rippleEls: HTMLElement[] = [];

const setRippleEl = (el: unknown, index: number) => {
  if (el) rippleEls[index] = el as HTMLElement;
};

/** 把图标配色写成 CSS 变量，背景渐变和波纹共用 */
const applyPalette = (palette: BrandPalette) => {
  const el = cardRef.value;
  if (!el) return;
  mainRgb.value = palette.main.join(', ');
  el.style.setProperty('--app-main-rgb', palette.main.join(', '));
  el.style.setProperty('--app-muted-rgb', palette.muted.join(', '));
  el.style.setProperty('--app-light-rgb', palette.light.join(', '));
  // 把主色抛给外层，让 Banner 等区域也能用同一套配色
  emit('palette', palette.main.join(', '));
};

/** 等图片可绘制；不用 decode()，部分环境下它不会 resolve */
const waitForImage = (img: HTMLImageElement) =>
  img.complete
    ? Promise.resolve()
    : new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', done, { once: true });
        // 双保险：图片异常时也不让取色流程卡住
        setTimeout(done, 2000);
      });

/**
 * 读取图标配色（参考原版：取 Vibrant / Muted / LightVibrant 三档）。
 * 取色较慢，所以不阻塞动画：先用品牌色跑起来，取到后再替换。
 */
const resolvePalette = async (): Promise<BrandPalette> => {
  const icon = iconRef.value;
  if (!icon) return FALLBACK_PALETTE;
  try {
    await waitForImage(icon);
    const palette = await Vibrant.from(icon).getPalette();
    const toRgb = (value?: number[] | null, fallback = FALLBACK_PALETTE.main) =>
      value ? value.map((channel) => Math.round(channel)) : fallback;
    return {
      main: toRgb(palette.Vibrant?.rgb),
      muted: toRgb(palette.Muted?.rgb, FALLBACK_PALETTE.muted),
      light: toRgb(palette.LightVibrant?.rgb, FALLBACK_PALETTE.light),
    };
  } catch {
    return FALLBACK_PALETTE;
  }
};

/** 图标弹入 + 水波纹逐层扩散（点击图标可重播） */
const playRipple = () => {
  const icon = iconRef.value;
  const rings = rippleEls.filter(Boolean);
  if (!icon || !rings.length) return;

  gsap.killTweensOf([icon, ...rings]);
  rings.forEach((ring) => gsap.set(ring, { xPercent: -50, yPercent: -50 }));

  gsap.fromTo(
    icon,
    { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.9, ease: 'bounce.out(2)' },
  );

  // 四层同时从图标处向外扩散，放大到覆盖整张卡片后淡出，循环播放
  rings.forEach((ring, index) => {
    gsap.fromTo(
      ring,
      { scale: 0.18, opacity: 0.32 },
      {
        scale: 2.2,
        opacity: 0,
        duration: 4,
        delay: index * 1,
        repeat: -1,
        ease: 'sine.out',
      },
    );
  });
};

/** 先用品牌色跑动画，再异步换成图标配色 */
const refresh = () => {
  applyPalette(FALLBACK_PALETTE);
  playRipple();
  void resolvePalette().then(applyPalette);
};

onMounted(refresh);
watch(() => props.app.icon, refresh);
</script>

<style scoped lang="scss">
.app-info-card-wrap {
  /* 图标尺寸，水波纹按它等比放大 */
  --icon-size: 50px;

  position: relative;
  align-self: start;
  width: 100%;
  /* 竖版比例：320 × 460 */
  aspect-ratio: 16 / 23;
}

.app-info-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--ao-spacing-sm);
  height: 100%;
  padding: var(--ao-spacing-xs) var(--ao-spacing-md) var(--ao-spacing-lg);
  border-radius: var(--ao-border-radius-xl);
  /* 底色 + 图标主色渐变：顶部亮、向下淡出，和波纹同色系 */
  background-color: var(--ao-color-bg-container);
  background-image:
    radial-gradient(
      120% 70% at 50% 0%,
      rgba(var(--app-light-rgb, 200, 240, 240), 0.5) 0%,
      rgba(var(--app-light-rgb, 200, 240, 240), 0) 65%
    ),
    linear-gradient(
      165deg,
      rgba(var(--app-main-rgb, 0, 181, 181), 0.22) 0%,
      rgba(var(--app-muted-rgb, 90, 200, 200), 0.1) 55%,
      rgba(var(--app-muted-rgb, 90, 200, 200), 0) 100%
    );
  /* 阴影用图标主色浅色 */
  box-shadow: 0 4px 12px rgba(var(--app-main-rgb, 0, 181, 181), 0.18);
  /* 波纹会扩散到整张卡片，超出部分裁掉 */
  overflow: hidden;
  text-align: center;

  /* 图标区固定在卡片上方 30%，卡片高度不定时按图标撑开 */
  &__stage {
    position: relative;
    display: flex;
    flex: 0 0 30%;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: calc(var(--icon-size) * 2);
  }

  /* 水波纹：以图标为圆心向外扩散，放大后覆盖整张卡片 */
  &__ripple {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    aspect-ratio: 1;
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    will-change: transform, opacity;
    background-color: rgba(var(--app-main-rgb, 0, 181, 181), 0.16);
  }

  &__icon {
    position: relative;
    z-index: 2;
    width: var(--icon-size);
    height: var(--icon-size);
    border-radius: var(--ao-border-radius-lg);
    object-fit: cover;
    cursor: pointer;
    filter: drop-shadow(
      0 0 14px rgba(var(--app-main-rgb, 0, 181, 181), 0.35)
    );
  }

  /* 名称一行（宽度贴合内容）、描述一行（更长） */
  &__text {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-width: 0;
    /* 往上收一点，贴近图标 */
    margin-top: -20px;
  }

  &__name {
    margin: 0;
    font-size: var(--ao-font-size-xl);
    font-weight: var(--ao-font-weight-semibold);
    color: var(--ao-color-text-base);
    white-space: nowrap;
  }

  /* 分类标签：图标主色浅色透明底 + 小圆角 */
  &__category {
    padding: 3px 8px;
    border-radius: var(--ao-border-radius-xs);
    background-color: rgba(var(--app-main-rgb, 0, 181, 181), 0.12);
    font-size: var(--ao-font-size-xs);
    color: var(--ao-color-text-secondary);
    white-space: nowrap;
  }

  /* 描述下方的标签：grid 居中排列 */
  &__tags {
    display: grid;
    grid-auto-flow: column;
    justify-content: center;
    gap: 8px;
    width: 100%;
  }

  &__tag {
    padding: 2px 8px;
    border-radius: var(--ao-border-radius-xs);
    background-color: rgba(0, 0, 0, 0.04);
    font-size: var(--ao-font-size-xs);
    color: var(--ao-color-text-tertiary);
    white-space: nowrap;
  }

  &__desc {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 100%;
    max-width: 100%;
    font-size: var(--ao-font-size-sm);
    line-height: var(--ao-line-height-base);
    color: var(--ao-color-text-tertiary);
  }

  &__desc-line {
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  /* 下载按钮与上方文字留一点间距 */
  &__downloads {
    margin-top: 24px;
  }

  /* 底部切换图标（无背景，hover 出现圆角方形底） */
  &__switch {
    position: absolute;
    bottom: 20px;
    left: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(var(--app-main-rgb, 0, 181, 181), 0.72);
    transform: translateX(-50%);
    z-index: 2;

    /* tooltip 包装层居中 */
    :deep(.ao-tooltip) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &__switch-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    border-radius: var(--ao-border-radius-sm);
    background-color: transparent;
    color: inherit;
    cursor: pointer;
    transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:hover {
      background-color: rgba(var(--app-main-rgb, 0, 181, 181), 0.14);
    }

    &:focus-visible {
      outline: 2px solid var(--ao-color-primary-bg-hover);
      outline-offset: 2px;
    }
  }

  /* 切换图标完整展示 */
  &__switch-icon {
    display: block;
    width: 20px;
    height: 20px;
  }
}

/* 单列布局下限制卡片宽度，保持 320 × 460 比例 */
@media (max-width: 992px) {
  .app-info-card-wrap {
    width: min(100%, 320px);
    margin-inline: auto;
  }
}
</style>
