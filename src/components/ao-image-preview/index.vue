<template>
  <Teleport to="body">
    <Transition name="ao-image-preview-fade">
      <div
        v-if="modelValue"
        class="ao-image-preview"
        @wheel.prevent="handleWheel"
        @click.self="handleClose"
      >
        <div
          ref="stageRef"
          class="ao-image-preview__stage"
          :class="{ 'is-zoomed': isZoomed, 'is-dragging': dragging }"
          @click.self="handleClose"
          @dblclick="resetTransform"
          @pointerdown="handlePointerDown"
          @pointermove="handlePointerMove"
          @pointerup="handlePointerUp"
          @pointercancel="handlePointerUp"
        >
          <img
            v-if="currentImage"
            class="ao-image-preview__img"
            :src="currentImage"
            :style="imgStyle"
            alt=""
            draggable="false"
          />
        </div>

        <div class="ao-image-preview__toolbar" @click.stop>
          <button
            type="button"
            class="ao-image-preview__btn"
            title="缩小"
            :disabled="!canZoomOut"
            @click="zoomOut"
          >
            <ZoomOutIcon class="ao-image-preview__icon" />
          </button>
          <button
            type="button"
            class="ao-image-preview__btn"
            title="放大"
            :disabled="!canZoomIn"
            @click="zoomIn"
          >
            <ZoomInIcon class="ao-image-preview__icon" />
          </button>
          <button
            type="button"
            class="ao-image-preview__btn"
            title="旋转"
            @click="rotate"
          >
            <RotateIcon class="ao-image-preview__icon" />
          </button>
          <button
            type="button"
            class="ao-image-preview__btn"
            title="关闭"
            @click="handleClose"
          >
            <CloseIcon class="ao-image-preview__icon" />
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import CloseIcon from './img/icon_close.svg';
import RotateIcon from './img/icon_rotate.svg';
import ZoomInIcon from './img/icon_zoom_in.svg';
import ZoomOutIcon from './img/icon_zoom_out.svg';

defineOptions({
  name: 'AoImagePreview',
});

const MIN_SCALE = 0.25;
const MAX_SCALE = 5;
const SCALE_STEP = 0.25;
const WHEEL_STEP = 0.1;

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    images?: string[];
    startIndex?: number;
  }>(),
  {
    images: () => [],
    startIndex: 0,
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  close: [];
}>();

const index = ref(0);
const scale = ref(1);
const degree = ref(0);
const offset = ref({ x: 0, y: 0 });
const dragging = ref(false);
const stageRef = ref<HTMLElement | null>(null);
const dragOrigin = { x: 0, y: 0, offsetX: 0, offsetY: 0 };

const currentImage = computed(() => props.images[index.value] ?? '');
const isZoomed = computed(() => scale.value !== 1);
const canZoomOut = computed(() => scale.value > MIN_SCALE);
const canZoomIn = computed(() => scale.value < MAX_SCALE);

const imgStyle = computed(() => ({
  transform: `translate3d(${offset.value.x}px, ${offset.value.y}px, 0) scale(${scale.value}) rotate(${degree.value}deg)`,
}));

const resetTransform = () => {
  scale.value = 1;
  degree.value = 0;
  offset.value = { x: 0, y: 0 };
};

const setScale = (value: number) => {
  const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, Math.round(value * 100) / 100));
  if (next === scale.value) return;

  scale.value = next;
  offset.value = { x: 0, y: 0 };
};

const zoomIn = () => setScale(scale.value + SCALE_STEP);
const zoomOut = () => setScale(scale.value - SCALE_STEP);

const rotate = () => {
  degree.value = (degree.value + 90) % 360;
};

const handleWheel = (event: WheelEvent) => {
  setScale(scale.value + (event.deltaY < 0 ? WHEEL_STEP : -WHEEL_STEP));
};

const handlePointerDown = (event: PointerEvent) => {
  dragging.value = true;
  dragOrigin.x = event.clientX;
  dragOrigin.y = event.clientY;
  dragOrigin.offsetX = offset.value.x;
  dragOrigin.offsetY = offset.value.y;
  stageRef.value?.setPointerCapture(event.pointerId);
};

const handlePointerMove = (event: PointerEvent) => {
  if (!dragging.value) return;

  offset.value = {
    x: dragOrigin.offsetX + event.clientX - dragOrigin.x,
    y: dragOrigin.offsetY + event.clientY - dragOrigin.y,
  };
};

const handlePointerUp = (event: PointerEvent) => {
  if (!dragging.value) return;

  dragging.value = false;
  if (stageRef.value?.hasPointerCapture(event.pointerId)) {
    stageRef.value.releasePointerCapture(event.pointerId);
  }
};

const handleClose = () => {
  emit('update:modelValue', false);
  emit('close');
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose();
    return;
  }

  if (props.images.length < 2) return;

  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    const step = event.key === 'ArrowLeft' ? -1 : 1;
    index.value = (index.value + step + props.images.length) % props.images.length;
    resetTransform();
  }
};

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) {
      index.value = Math.min(props.startIndex, Math.max(props.images.length - 1, 0));
      resetTransform();
      window.addEventListener('keydown', handleKeydown);
      return;
    }

    window.removeEventListener('keydown', handleKeydown);
  },
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
