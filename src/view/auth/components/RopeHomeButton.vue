<template>
  <div ref="rootRef" class="rope-home" :class="{ 'rope-home--left': side === 'left' }">
    <div ref="armRef" class="rope-home__arm">
      <span class="rope-home__string" aria-hidden="true"></span>
      <button
        type="button"
        class="rope-home__bob"
        aria-label="返回首页"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
        @pointercancel="handlePointerUp"
        @click="handleClick"
      >
        <AoImage src="@/assets/auth/icon_home.svg" width="18px" height="18px" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import gsap from 'gsap';

const emit = defineEmits<{ home: [] }>();

withDefaults(
  defineProps<{
    /** 挂在页面哪一侧：默认右侧；表单在左边面板时用 left */
    side?: 'left' | 'right';
  }>(),
  { side: 'right' },
);

/** 摆动系数，越大摆得越快 */
const GRAVITY = 15;
/** 阻尼，越大停得越快 */
const DAMPING = 1.1;
/** 最大摆角（弧度） */
const MAX_ANGLE = (72 * Math.PI) / 180;
/** 松手时的角速度上限（弧度/秒），避免甩飞 */
const MAX_OMEGA = 6;
/** 指针位移不超过该值视为点击而非拖拽 */
const CLICK_TOLERANCE = 6;

const rootRef = ref<HTMLElement>();
const armRef = ref<HTMLElement>();

/** 当前摆角与角速度（弧度、弧度/秒） */
let angle = 0;
let omega = 0;
let dragging = false;
let pointerId = -1;
let startX = 0;
let startY = 0;
let moved = 0;
let lastMoveTime = 0;
let lastAngle = 0;
let ticking = false;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

/** 把角度写到 DOM 上（绕绳子顶端旋转）；CSS 正角度会把下垂方向转到左侧，所以取反 */
function render() {
  if (!armRef.value) return;
  gsap.set(armRef.value, {
    rotation: (-angle * 180) / Math.PI,
    transformOrigin: '50% 0%',
  });
}

/** 单摆：dω/dt = -g·sinθ - 阻尼·ω */
function tick(_time: number, deltaTime: number) {
  const dt = Math.min(deltaTime / 1000, 0.05);
  omega += (-GRAVITY * Math.sin(angle) - DAMPING * omega) * dt;
  angle += omega * dt;

  if (Math.abs(angle) > MAX_ANGLE) {
    angle = clamp(angle, -MAX_ANGLE, MAX_ANGLE);
    omega = 0;
  }

  if (Math.abs(angle) < 0.0015 && Math.abs(omega) < 0.02) {
    angle = 0;
    omega = 0;
    render();
    stopTicker();
    return;
  }

  render();
}

function startTicker() {
  if (ticking) return;
  ticking = true;
  gsap.ticker.add(tick);
}

function stopTicker() {
  if (!ticking) return;
  ticking = false;
  gsap.ticker.remove(tick);
}

/** 支点：绳子顶端在视口中的坐标 */
function getPivot() {
  const root = rootRef.value;
  if (!root) return { x: 0, y: 0 };
  const rect = root.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top };
}

/** 指针位置换算成摆角 */
function angleFromPoint(clientX: number, clientY: number) {
  const pivot = getPivot();
  const dy = clientY - pivot.y;
  // 拉不过支点，否则角度会跳到另一侧
  if (dy < 8) return angle;
  return clamp(Math.atan2(clientX - pivot.x, dy), -MAX_ANGLE, MAX_ANGLE);
}

function handlePointerDown(event: PointerEvent) {
  if (event.button !== 0) return;
  const bob = event.currentTarget as HTMLElement;
  event.preventDefault();

  dragging = true;
  pointerId = event.pointerId;
  moved = 0;
  omega = 0;
  startX = event.clientX;
  startY = event.clientY;
  lastAngle = angle;
  lastMoveTime = performance.now();
  stopTicker();
  bob.setPointerCapture?.(event.pointerId);
}

function handlePointerMove(event: PointerEvent) {
  if (!dragging || event.pointerId !== pointerId) return;

  moved = Math.max(
    moved,
    Math.hypot(event.clientX - startX, event.clientY - startY),
  );

  const next = angleFromPoint(event.clientX, event.clientY);
  const now = performance.now();
  const elapsed = (now - lastMoveTime) / 1000;
  if (elapsed > 0.008) {
    // 记录末速度，松手后带着这股劲继续摆
    omega = clamp((next - lastAngle) / elapsed, -MAX_OMEGA, MAX_OMEGA);
    lastAngle = next;
    lastMoveTime = now;
  }

  angle = next;
  render();
}

function handlePointerUp(event: PointerEvent) {
  if (!dragging) return;
  dragging = false;
  const bob = event.currentTarget as HTMLElement;
  bob.releasePointerCapture?.(pointerId);
  pointerId = -1;
  // 松手后交给单摆物理，自然回摆并停下
  startTicker();
}

function handleClick() {
  // 拖拽过就不算点击，避免甩完绳子误跳转
  if (moved > CLICK_TOLERANCE) return;
  emit('home');
}

onMounted(() => {
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (reduceMotion?.matches) return;
  // 进页面先轻轻摆一下，交代「这东西能拽」
  omega = 0.5;
  startTicker();
});

onBeforeUnmount(() => {
  stopTicker();
});
</script>

<style scoped lang="scss">
.rope-home {
  --rope-length: 88px;
  --bob-size: 38px;

  position: absolute;
  top: 0;
  right: 64px;
  z-index: 3;
  width: var(--bob-size);
  height: 0;

  /* 表单在左侧面板时（注册页）镜像到左边 */
  &--left {
    right: auto;
    left: 64px;
  }

  /* 移动端由页面底部的 home 按钮承担，这里不显示 */
  @media (max-width: 768px) {
    display: none;
  }
}

.rope-home__arm {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--bob-size);
  height: var(--rope-length);
  margin-left: calc(var(--bob-size) / -2);
}

.rope-home__string {
  position: absolute;
  top: 0;
  left: 50%;
  width: 1px;
  height: var(--rope-length);
  margin-left: -0.5px;
  border-radius: 1px;
  background-color: var(--ao-color-border);
  pointer-events: none;
}

.rope-home__bob {
  position: absolute;
  top: calc(var(--rope-length) - var(--bob-size) / 2);
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--bob-size);
  height: var(--bob-size);
  padding: 0;
  border: var(--ao-border-width-thin) solid var(--ao-color-border-secondary);
  border-radius: 50%;
  background-color: var(--ao-gray-0);
  box-shadow: var(--ao-shadow-md);
  cursor: grab;
  /* 拖拽时不要触发页面滚动 */
  touch-action: none;
  user-select: none;
  transition:
    box-shadow var(--ao-duration-base) var(--ao-ease-in-out),
    border-color var(--ao-duration-base) var(--ao-ease-in-out);

  &:hover {
    border-color: var(--ao-color-primary);
    box-shadow: var(--ao-shadow-lg);
  }

  &:active {
    cursor: grabbing;
  }

  &:focus-visible {
    outline: 2px solid var(--ao-color-primary-bg-hover);
    outline-offset: 2px;
  }
}
</style>
