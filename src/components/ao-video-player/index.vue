<template>
  <div
    class="ao-video-player"
    :class="{
      'ao-video-player--plain': !controls,
      'ao-video-player--hover': hoverPlay,
    }"
    ref="containerRef"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  ></div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import Artplayer from 'artplayer';
import type { Option } from 'artplayer';
import { getRandomDefaultVideo } from '@/utils/defaultVideo';

import iconFullscreen from './icons/icon_fullscreen.svg?raw';
import iconFullscreenExit from './icons/icon_fullscreen_exit.svg?raw';
import iconLoading from './icons/icon_loading.svg?raw';
import iconPause from './icons/icon_pause.svg?raw';
import iconPip from './icons/icon_pip.svg?raw';
import iconPipExit from './icons/icon_pip_exit.svg?raw';
import iconPlay from './icons/icon_play.svg?raw';
import iconVolume from './icons/icon_volume.svg?raw';
import iconVolumeClose from './icons/icon_volume_close.svg?raw';

defineOptions({
  name: 'ao-video-player',
});

interface VideoQuality {
  label: string;
  src: string;
}

const props = withDefaults(
  defineProps<{
    src: string;
    poster?: string;
    controls?: boolean;
    hoverPlay?: boolean;
    autoPlay?: boolean;
    quality?: VideoQuality[];
  }>(),
  {
    controls: true,
    hoverPlay: false,
    autoPlay: true,
  },
);

const RATE_LIST = [0.5, 0.75, 1, 1.25, 1.5, 2];

const containerRef = ref<HTMLDivElement>();
const instance = ref<Artplayer>();

// 当前使用的本地兜底视频；为空表示还未触发兜底
let fallbackUrl = '';
// 远程视频长时间没有加载出元数据时，也切到本地兜底
const FALLBACK_TIMEOUT = 8000;
let loadTimer: ReturnType<typeof setTimeout> | null = null;

const toIcon = (svg: string) => svg.slice(svg.indexOf('<svg'));

const rateControl: NonNullable<Option['controls']>[number] = {
  name: 'playbackRate',
  position: 'right',
  index: 35,
  html: '倍速',
  selector: RATE_LIST.map((rate) => ({
    html: `${rate}x`,
    value: rate,
    default: rate === 1,
  })),
  onSelect(selector) {
    const rate = Number(selector.value);
    this.playbackRate = rate;
    return `${rate}x`;
  },
};

const createQualityControl = ():
  NonNullable<Option['controls']>[number] | null => {
  const list = props.quality;
  if (!list?.length) return null;

  return {
    name: 'quality',
    position: 'right',
    index: 20,
    html: list[0].label,
    selector: list.map((item, index) => ({
      html: item.label,
      value: index,
      default: index === 0,
    })),
    onSelect(selector) {
      const target = list[Number(selector.value)];
      if (!target) return '';
      if (this.url !== target.src) {
        this.switchQuality(target.src).catch(() => {});
      }
      return target.label;
    },
  };
};

const syncPipIcon = (active: boolean) => {
  const icon = containerRef.value?.querySelector('.art-icon-pip');
  if (icon) {
    icon.innerHTML = toIcon(active ? iconPipExit : iconPip);
  }
};

const layoutControls = () => {
  const root = containerRef.value;
  const rightGroup = root?.querySelector('.art-controls-right');
  const volumeControl = root?.querySelector('.art-control-volume');
  if (!rightGroup || !volumeControl) return;
  const pipControl = rightGroup.querySelector('.art-control-pip');
  rightGroup.insertBefore(volumeControl, pipControl);
};

const clearLoadTimer = () => {
  if (loadTimer) {
    clearTimeout(loadTimer);
    loadTimer = null;
  }
};

const switchToFallback = (immediate = false) => {
  const player = instance.value;
  if (!player) return;
  // 本地兜底也失败时不再替换，避免无限重试
  if (fallbackUrl && player.option.url === fallbackUrl) return;
  clearLoadTimer();
  fallbackUrl = getRandomDefaultVideo();
  // Artplayer 自身会在重连时读取 option.url，错误场景只更新目标地址，
  // 避免和内置重连逻辑同时加载造成二次刷新
  player.option.url = fallbackUrl;
  // 超时场景没有 error 事件触发内置重连，需要主动加载
  if (immediate) {
    player.url = fallbackUrl;
  }
};

const startLoadTimer = () => {
  clearLoadTimer();
  if (fallbackUrl) return;
  loadTimer = setTimeout(() => switchToFallback(true), FALLBACK_TIMEOUT);
};

const handleVideoError = () => {
  clearLoadTimer();
  switchToFallback();
};

const createPlayer = () => {
  if (!containerRef.value) return;

  Artplayer.CONTEXTMENU = false;

  const qualityControl = createQualityControl();

  const player = new Artplayer({
    container: containerRef.value,
    url: props.src,
    ...(props.poster ? { poster: props.poster } : {}),
    theme: '#00a3a3',
    lang: 'zh-cn',
    volume: 1,
    autoplay: props.autoPlay,
    playsInline: true,
    pip: true,
    fullscreen: true,
    hotkey: true,
    autoSize: false,
    autoMini: false,
    autoPlayback: false,
    backdrop: false,
    miniProgressBar: false,
    airplay: false,
    fullscreenWeb: false,
    setting: false,
    playbackRate: false,
    aspectRatio: false,
    screenshot: false,
    flip: false,
    loop: false,
    icons: {
      play: toIcon(iconPlay),
      pause: toIcon(iconPause),
      state: toIcon(iconPlay),
      volume: toIcon(iconVolume),
      volumeClose: toIcon(iconVolumeClose),
      pip: toIcon(iconPip),
      fullscreenOn: toIcon(iconFullscreen),
      fullscreenOff: toIcon(iconFullscreenExit),
      loading: toIcon(iconLoading),
    },
    controls: qualityControl ? [qualityControl, rateControl] : [rateControl],
  });

  const video = containerRef.value.querySelector('video');
  video?.addEventListener('enterpictureinpicture', () => syncPipIcon(true));
  video?.addEventListener('leavepictureinpicture', () => syncPipIcon(false));

  layoutControls();

  instance.value = player;
  player.on('video:error', handleVideoError);
  player.on('video:loadedmetadata', clearLoadTimer);
  player.on('video:canplay', clearLoadTimer);
  player.on('video:playing', clearLoadTimer);
  startLoadTimer();
};

const handleMouseEnter = () => {
  if (!props.hoverPlay) return;
  instance.value?.play().catch(() => {});
};

const handleMouseLeave = () => {
  const player = instance.value;
  if (!player || !props.hoverPlay) return;
  player.pause();
  player.currentTime = 0;
  player.notice.show = '';
};

const blockClick = (event: MouseEvent) => {
  if (props.hoverPlay) {
    event.stopPropagation();
  }
};

onMounted(() => {
  createPlayer();
  containerRef.value?.addEventListener('click', blockClick, true);
});

onBeforeUnmount(() => {
  clearLoadTimer();
  containerRef.value?.removeEventListener('click', blockClick, true);
  instance.value?.destroy();
  instance.value = undefined;
});

watch(
  () => props.src,
  (url) => {
    if (instance.value && url) {
      fallbackUrl = '';
      instance.value.option.url = url;
      instance.value.url = url;
      startLoadTimer();
    }
  },
);

watch(
  () => props.poster,
  (poster) => {
    if (instance.value && poster) {
      instance.value.poster = poster;
    }
  },
);

watch(
  () => props.quality,
  () => {
    const player = instance.value;
    if (!player) return;
    player.controls.remove('quality');
    const next = createQualityControl();
    if (next) {
      player.controls.add(next);
    }
  },
  { deep: true },
);

defineExpose({ player: instance });
</script>

<style lang="scss">
@use './skin/ao-skin.scss' as *;
</style>
