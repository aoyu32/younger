<template>
  <div
    class="ao-scrollbar"
    :class="{
      'is-always': always,
      'is-dragging': draggingY || draggingX,
      'is-scrolling': scrolling,
    }"
    :style="containerStyle"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
    <div
      ref="wrapRef"
      class="ao-scrollbar__wrap"
      :class="wrapClass"
      :style="wrapStyle"
      @scroll="handleScroll"
    >
      <component :is="tag" ref="viewRef" class="ao-scrollbar__view">
        <slot />
      </component>
    </div>

    <template v-if="!native">
      <div
        v-show="sizeHeight"
        class="ao-scrollbar__bar is-vertical"
        :style="{ '--track-color': trackColor }"
      >
        <div
          class="ao-scrollbar__thumb"
          :class="{ 'is-dragging': draggingY }"
          :style="{
            '--thumb-color': thumbColor,
            height: sizeHeight,
            transform: `translateY(${moveY}%)`,
          }"
          @mousedown="onThumbMouseDown($event, 'y')"
        />
      </div>
      <div
        v-show="sizeWidth"
        class="ao-scrollbar__bar is-horizontal"
        :style="{ '--track-color': trackColor }"
      >
        <div
          class="ao-scrollbar__thumb"
          :class="{ 'is-dragging': draggingX }"
          :style="{
            '--thumb-color': thumbColor,
            width: sizeWidth,
            transform: `translateX(${moveX}%)`,
          }"
          @mousedown="onThumbMouseDown($event, 'x')"
        />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';
import type { AoScrollbarProps, AoScrollbarScrollEvent } from './types';

defineOptions({ name: 'ao-scrollbar' });

const props = withDefaults(defineProps<AoScrollbarProps>(), {
  tag: 'div',
  always: false,
  native: false,
  trackColor: 'transparent',
  thumbColor: 'rgba(144, 147, 153, 0.4)',
});

const emit = defineEmits<{
  scroll: [e: AoScrollbarScrollEvent];
}>();

const wrapRef = ref<HTMLElement>();
const viewRef = ref<HTMLElement>();

const hovering = ref(false);
const scrolling = ref(false);
const draggingY = ref(false);
const draggingX = ref(false);

// 移动端没有 mouseenter，靠滚动事件短暂显示滚动条
const SCROLL_VISIBLE_DURATION = 800;
let hideTimer: ReturnType<typeof setTimeout> | null = null;

const moveY = ref(0);
const moveX = ref(0);
const sizeHeight = ref('');
const sizeWidth = ref('');

const containerStyle = computed(() => ({
  height: props.height,
  maxHeight: props.maxHeight,
}));

const showBar = computed(
  () =>
    props.always ||
    hovering.value ||
    scrolling.value ||
    draggingY.value ||
    draggingX.value,
);

let resizeObserver: ResizeObserver | null = null;

function update() {
  const wrap = wrapRef.value;
  if (!wrap) return;

  // 容差 1px，避免子像素取整造成的 scrollWidth/clientWidth 误差被误判为溢出
  const hasOverflowY = wrap.scrollHeight > wrap.clientHeight + 1;
  const hasOverflowX = wrap.scrollWidth > wrap.clientWidth + 1;
  const heightPercentage = (wrap.clientHeight * 100) / wrap.scrollHeight;
  const widthPercentage = (wrap.clientWidth * 100) / wrap.scrollWidth;

  // 内容未溢出时隐藏对应滚动条；最窄保底 20%，避免滑块太小
  sizeHeight.value = hasOverflowY
    ? `${Math.max(heightPercentage, 20)}%`
    : '';
  sizeWidth.value = hasOverflowX ? `${Math.max(widthPercentage, 20)}%` : '';

  // translate 百分比基于滑块自身尺寸：scrollTop / clientHeight * 100 恰好映射到轨道位置
  moveY.value = (wrap.scrollTop * 100) / wrap.clientHeight;
  moveX.value = (wrap.scrollLeft * 100) / wrap.clientWidth;
}

function handleScroll() {
  const wrap = wrapRef.value;
  if (!wrap) return;
  update();

  scrolling.value = true;
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = setTimeout(() => {
    scrolling.value = false;
  }, SCROLL_VISIBLE_DURATION);

  emit('scroll', { scrollTop: wrap.scrollTop, scrollLeft: wrap.scrollLeft });
}

function scrollTo(options?: ScrollToOptions | number, y?: number) {
  const wrap = wrapRef.value;
  if (!wrap) return;
  if (typeof options === 'object') {
    wrap.scrollTo(options);
  } else if (typeof options === 'number' && typeof y === 'number') {
    wrap.scrollTo(options, y);
  }
}

function setScrollTop(value: number) {
  if (wrapRef.value) wrapRef.value.scrollTop = value;
}

function setScrollLeft(value: number) {
  if (wrapRef.value) wrapRef.value.scrollLeft = value;
}

function onThumbMouseDown(e: MouseEvent, axis: 'x' | 'y') {
  e.preventDefault();
  e.stopPropagation();

  const wrap = wrapRef.value;
  if (!wrap) return;

  const barEl = (e.currentTarget as HTMLElement).parentElement;
  if (!barEl) return;

  const rect = barEl.getBoundingClientRect();
  const startPos = axis === 'y' ? e.clientY : e.clientX;
  const startScroll = axis === 'y' ? wrap.scrollTop : wrap.scrollLeft;
  const trackSize = axis === 'y' ? rect.height : rect.width;
  const scrollSize = axis === 'y' ? wrap.scrollHeight : wrap.scrollWidth;
  const clientSize = axis === 'y' ? wrap.clientHeight : wrap.clientWidth;

  if (axis === 'y') draggingY.value = true;
  else draggingX.value = true;

  function onMouseMove(ev: MouseEvent) {
    if (!wrap) return;
    const delta = (axis === 'y' ? ev.clientY : ev.clientX) - startPos;
    const thumbSize = sizeHeightTrack(axis, trackSize);
    const scrollable = scrollSize - clientSize;
    if (scrollable <= 0 || thumbSize >= trackSize) return;
    wrap[axis === 'y' ? 'scrollTop' : 'scrollLeft'] =
      startScroll + (delta / (trackSize - thumbSize)) * scrollable;
  }

  function onMouseUp() {
    draggingY.value = false;
    draggingX.value = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
}

// 滑块自身占用的轨道长度（px），拖拽位移需按"轨道剩余长度"折算
function sizeHeightTrack(axis: 'x' | 'y', trackSize: number) {
  const wrap = wrapRef.value;
  if (!wrap) return 0;
  const percentage =
    axis === 'y'
      ? (wrap.clientHeight * 100) / wrap.scrollHeight
      : (wrap.clientWidth * 100) / wrap.scrollWidth;
  return (trackSize * Math.max(percentage, 20)) / 100;
}

onMounted(async () => {
  update();
  await nextTick();
  const wrap = wrapRef.value;
  const view = viewRef.value;
  if (!wrap || !view) return;
  resizeObserver = new ResizeObserver(update);
  // 同时监听容器与内容，内容尺寸或容器尺寸变化时重算滑块
  resizeObserver.observe(wrap);
  resizeObserver.observe(view);
});

onBeforeUnmount(() => {
  if (hideTimer) clearTimeout(hideTimer);
  hideTimer = null;
  resizeObserver?.disconnect();
  resizeObserver = null;
});

watch(
  () => showBar.value,
  (visible) => {
    if (visible) update();
  },
);

defineExpose({
  wrapRef,
  scrollTo,
  setScrollTop,
  setScrollLeft,
  update,
});
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
