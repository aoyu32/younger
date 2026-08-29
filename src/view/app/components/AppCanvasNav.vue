<template>
  <div class="app-canvas-nav">
    <canvas id="nav" ref="navCanvasRef"></canvas>
    <!-- 左侧进度条 -->
    <div class="progress-bar left">
      <div class="progress-fill" :style="{ height: leftProgress + '%' }"></div>
    </div>
    <!-- 右侧进度条 -->
    <div class="progress-bar right">
      <div class="progress-fill" :style="{ height: rightProgress + '%' }"></div>
    </div>
    <!-- 激活项指示小三角 -->
    <div
      class="triangle-indicator"
      :class="indicatorClass"
      :style="{ left: triangleLeft + 'px' }"
      v-show="activeIndex !== -1"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';

const emit = defineEmits(['item-click']);

const navCanvasRef = ref<HTMLCanvasElement>();
const ctx = ref<CanvasRenderingContext2D | null>();

// 进度条状态
const leftProgress = ref(0);
const rightProgress = ref(100);
// 指示三角位置和方向
const triangleLeft = ref(0);
const indicatorClass = ref('');

// 定义三角尺寸常量（与 CSS 中 border 宽度保持一致）
const INDICATOR_SIZE = 8; // 三角形宽度
const EDGE_MARGIN = 6; // 靠边时与容器边缘的距离

const navList = ref([
  { icon: '', name: 'AI应用', to: '/AI应用', active: false },
  { icon: '', name: '网络加速', to: '/网络加速', active: false },
  { icon: '', name: '桌面美化', to: '/桌面美化', active: false },
  { icon: '', name: '浏览器', to: '/浏览器', active: false },
  { icon: '', name: '谷歌产品', to: '/谷歌产品', active: false },
  { icon: '', name: '云盘存储', to: '/云盘存储', active: false },
  { icon: '', name: '下载工具', to: '/下载工具', active: false },
  { icon: '', name: '移动互联', to: '/移动互联', active: false },
  { icon: '', name: '桌面美化', to: '/桌面美化', active: false },
  { icon: '', name: '浏览器', to: '/浏览器', active: false },
  { icon: '', name: '谷歌产品', to: '/谷歌产品', active: false },
  { icon: '', name: '云盘存储', to: '/云盘存储', active: false },
  { icon: '', name: '下载工具', to: '/下载工具', active: false },
  { icon: '', name: '移动互联', to: '/移动互联', active: false },
  { icon: '', name: '社交沟通', to: '/社交沟通', active: false },
]);

// 默认激活第一个
const activeIndex = ref(0);

// 拖动状态
let offsetX = 0;
let isDragging = false;
let startDragX = 0;
let startOffsetX = 0;
let rafId: number | null = null;
let inertiaAnimId: number | null = null;

let velocityX = 0;
let lastMoveX = 0;
let lastMoveTime = 0;
const FRICTION = 0.95;
const MIN_VELOCITY = 0.01;
const SMOOTHING = 0.7;

// Hover 状态
let hoverIndex = -1;

// 点击候选
let clickCandidate = false;
let pointerDownOnNode = false;
let pointerDownPos = { x: 0, y: 0 };
const CLICK_THRESHOLD = 5;

// 滚动动画状态
let scrollAnimId: number | null = null;
let scrollStartTime = 0;
let scrollStartOffset = 0;
let scrollTargetOffset = 0;
const SCROLL_DURATION = 300; // 毫秒

// 节点信息
let allNodes: Array<{
  rectX: number;
  rectY: number;
  rectW: number;
  rectH: number;
  centerX: number;
  centerY: number;
  text: string;
  textHeight: number;
  textDescent: number;
}> = [];

const getCanvasCoords = (e: PointerEvent) => {
  const canvas = navCanvasRef.value;
  if (!canvas) return { x: 0, y: 0 };
  const rect = canvas.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
};

const setupCanvas = () => {
  const canvas = navCanvasRef.value;
  if (!canvas) return;

  const dpr = window.devicePixelRatio || 1;
  const cssWidth = canvas.clientWidth;
  const cssHeight = canvas.clientHeight;

  canvas.width = cssWidth * dpr;
  canvas.height = cssHeight * dpr;
  canvas.style.width = cssWidth + 'px';
  canvas.style.height = cssHeight + 'px';

  const context = canvas.getContext('2d');
  if (context) {
    context.scale(dpr, dpr);
    ctx.value = context;
  }
};

const drawRoundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
};

const getTotalContentWidth = (ctx2d: CanvasRenderingContext2D) => {
  let total = 0;
  const padding = 8;
  const gap = 80;
  const startX = 44;
  ctx2d.font = '12px Arial';
  navList.value.forEach((item) => {
    const metrics = ctx2d.measureText(item.name);
    total += metrics.width + padding * 2 + gap;
  });
  total -= gap;
  return total + 2 * startX;
};

const clampOffset = (newOffset: number) => {
  const ctx2d = ctx.value;
  const canvas = navCanvasRef.value;
  if (!ctx2d || !canvas) return 0;

  const totalWidth = getTotalContentWidth(ctx2d);
  const canvasWidth = canvas.clientWidth;
  const startX = 44;

  if (totalWidth <= canvasWidth) {
    return (canvasWidth - totalWidth) / 2;
  }

  const minOffset = -(totalWidth - canvasWidth);
  return Math.max(minOffset, Math.min(0, newOffset));
};

const drawWatermark = (
  ctx2d: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) => {
  if (activeIndex.value === -1) return;
  const text = navList.value[activeIndex.value]?.name;
  if (!text) return;

  ctx2d.save();
  ctx2d.beginPath();
  ctx2d.rect(0, 0, canvasWidth, canvasHeight);
  ctx2d.clip();

  ctx2d.font = "52px 'STXingkai', '华文行楷', 'Ma Shan Zheng', cursive";
  ctx2d.fillStyle = 'rgba(140, 140, 140, 0.08)';
  ctx2d.textAlign = 'left';
  ctx2d.textBaseline = 'middle';

  ctx2d.fillText(text, 14, canvasHeight / 2 + 2);
  ctx2d.restore();
};

const render = () => {
  const ctx2d = ctx.value;
  const canvas = navCanvasRef.value;
  if (!ctx2d || !canvas) return;

  offsetX = clampOffset(offsetX);

  // 更新进度条
  const totalWidth = getTotalContentWidth(ctx2d);
  const canvasWidth = canvas.clientWidth;
  if (totalWidth <= canvasWidth) {
    leftProgress.value = 0;
    rightProgress.value = 0;
  } else {
    const minOffset = -(totalWidth - canvasWidth);
    const progress = (0 - offsetX) / (0 - minOffset);
    const clampedProgress = Math.max(0, Math.min(1, progress));
    leftProgress.value = clampedProgress * 100;
    rightProgress.value = (1 - clampedProgress) * 100;
  }

  const padding = 8;
  const fontSize = 12;
  const gap = 80;
  const startX = 44;
  const rowGap = 18;
  const rectH = fontSize + padding * 2;
  const borderRadius = 6;

  const lineColor = '#d9d9d9';
  const lineWidth = 1.5;

  const nodeBgDefault = '#ffffff';
  const nodeBorderDefault = '#e5e5e5';
  const nodeBgHover = '#66dcdc';
  const nodeBgActive = '#00b5b5';

  const textColorDefault = '#434343';
  const textColorHover = '#001f26';
  const textColorActive = '#ffffff';

  const canvasHeight = canvas.clientHeight;
  const vPadding = (canvasHeight - rectH - rowGap) / 2;
  const baseYEven = vPadding + rectH / 2;
  const baseYOdd = canvasHeight - vPadding - rectH / 2;

  ctx2d.clearRect(0, 0, canvasWidth, canvasHeight);
  drawWatermark(ctx2d, canvasWidth, canvasHeight);

  ctx2d.font = `${fontSize}px Arial`;
  ctx2d.textBaseline = 'alphabetic';
  ctx2d.textAlign = 'center';

  allNodes = [];
  let currentX = startX + offsetX;

  navList.value.forEach((item, index) => {
    const text = item.name;
    const metrics = ctx2d.measureText(text);
    const textWidth = metrics.width;
    const rectW = textWidth + padding * 2;

    const rectX = currentX;
    const baseY = index % 2 === 0 ? baseYEven : baseYOdd;
    const rectY = baseY - rectH / 2;

    allNodes.push({
      rectX,
      rectY,
      rectW,
      rectH,
      centerX: rectX + rectW / 2,
      centerY: rectY + rectH / 2,
      text,
      textHeight:
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent,
      textDescent: metrics.actualBoundingBoxDescent,
    });

    currentX += rectW + gap;
  });

  // 更新三角指示器位置和方向（边界处理）
  if (activeIndex.value !== -1 && allNodes[activeIndex.value]) {
    const node = allNodes[activeIndex.value];
    if (node.rectX + node.rectW < 0) {
      // 完全在左侧外 → 靠在左边，指向左
      triangleLeft.value = EDGE_MARGIN;
      indicatorClass.value = 'left';
    } else if (node.rectX > canvasWidth) {
      // 完全在右侧外 → 靠在右边，指向右
      triangleLeft.value = canvasWidth - EDGE_MARGIN - INDICATOR_SIZE;
      indicatorClass.value = 'right';
    } else {
      // 在可视区内 → 正常跟随节点
      triangleLeft.value = node.centerX;
      indicatorClass.value = '';
    }
  }

  // 连接线
  ctx2d.strokeStyle = lineColor;
  ctx2d.lineWidth = lineWidth;
  for (let i = 0; i < allNodes.length - 1; i++) {
    const cur = allNodes[i];
    const next = allNodes[i + 1];
    ctx2d.beginPath();
    ctx2d.moveTo(cur.rectX + cur.rectW, cur.centerY);
    ctx2d.lineTo(next.rectX, next.centerY);
    ctx2d.stroke();
  }

  // 节点
  allNodes.forEach((node, index) => {
    let bgColor = nodeBgDefault;
    let textColor = textColorDefault;
    let borderColor: string | null = nodeBorderDefault;

    if (index === activeIndex.value) {
      bgColor = nodeBgActive;
      textColor = textColorActive;
      borderColor = null;
    } else if (index === hoverIndex) {
      bgColor = nodeBgHover;
      textColor = textColorHover;
      borderColor = null;
    }

    ctx2d.fillStyle = bgColor;
    drawRoundRect(
      ctx2d,
      node.rectX,
      node.rectY,
      node.rectW,
      node.rectH,
      borderRadius,
    );
    ctx2d.fill();
    if (borderColor) {
      ctx2d.strokeStyle = borderColor;
      ctx2d.lineWidth = 1;
      ctx2d.stroke();
    }

    const textY = node.centerY + node.textHeight / 2 - node.textDescent;
    ctx2d.fillStyle = textColor;
    ctx2d.fillText(node.text, node.centerX, textY);
  });
};

const hitTestNode = (x: number, y: number): number => {
  for (let i = 0; i < allNodes.length; i++) {
    const node = allNodes[i];
    if (
      x >= node.rectX &&
      x <= node.rectX + node.rectW &&
      y >= node.rectY &&
      y <= node.rectY + node.rectH
    ) {
      return i;
    }
  }
  return -1;
};

const updateHover = (e: PointerEvent) => {
  if (isDragging || clickCandidate) return;
  const { x, y } = getCanvasCoords(e);
  const newHover = hitTestNode(x, y);
  if (newHover !== hoverIndex) {
    hoverIndex = newHover;
    render();
  }
  if (navCanvasRef.value) {
    navCanvasRef.value.style.cursor = 'pointer';
  }
};

const startInertia = () => {
  if (inertiaAnimId) cancelAnimationFrame(inertiaAnimId);

  if (Math.abs(velocityX) < MIN_VELOCITY) {
    velocityX = 0;
    render();
    return;
  }

  const inertiaLoop = () => {
    velocityX *= FRICTION;
    const deltaX = velocityX * 16;
    const newOffset = clampOffset(offsetX + deltaX);

    if (newOffset === offsetX || Math.abs(velocityX) < MIN_VELOCITY) {
      offsetX = newOffset;
      velocityX = 0;
      render();
      inertiaAnimId = null;
      return;
    }

    offsetX = newOffset;
    render();
    inertiaAnimId = requestAnimationFrame(inertiaLoop);
  };

  inertiaAnimId = requestAnimationFrame(inertiaLoop);
};

// 滚动到激活节点
const scrollToActiveNode = () => {
  if (activeIndex.value === -1 || allNodes.length === 0) return;
  const canvas = navCanvasRef.value;
  if (!canvas) return;

  const node = allNodes[activeIndex.value];
  const nodeBaseX = node.rectX - offsetX;
  const nodeCenter = nodeBaseX + node.rectW / 2;
  const canvasCenter = canvas.clientWidth / 2;
  const targetOffset = canvasCenter - nodeCenter;

  const clampedTarget = clampOffset(targetOffset);

  if (inertiaAnimId) {
    cancelAnimationFrame(inertiaAnimId);
    inertiaAnimId = null;
  }
  if (scrollAnimId) {
    cancelAnimationFrame(scrollAnimId);
    scrollAnimId = null;
  }
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  if (Math.abs(clampedTarget - offsetX) < 0.5) {
    offsetX = clampedTarget;
    render();
    return;
  }

  scrollStartOffset = offsetX;
  scrollTargetOffset = clampedTarget;
  scrollStartTime = performance.now();

  const animateScroll = (now: number) => {
    const elapsed = now - scrollStartTime;
    const progress = Math.min(elapsed / SCROLL_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    offsetX = clampOffset(
      scrollStartOffset + (scrollTargetOffset - scrollStartOffset) * eased,
    );
    render();

    if (progress < 1) {
      scrollAnimId = requestAnimationFrame(animateScroll);
    } else {
      offsetX = scrollTargetOffset;
      render();
      scrollAnimId = null;
    }
  };

  scrollAnimId = requestAnimationFrame(animateScroll);
};

const onPointerDown = (e: PointerEvent) => {
  if (scrollAnimId) {
    cancelAnimationFrame(scrollAnimId);
    scrollAnimId = null;
  }
  if (inertiaAnimId) {
    cancelAnimationFrame(inertiaAnimId);
    inertiaAnimId = null;
  }
  if (rafId) cancelAnimationFrame(rafId);

  const { x, y } = getCanvasCoords(e);
  const hitIndex = hitTestNode(x, y);
  pointerDownOnNode = hitIndex !== -1;

  if (pointerDownOnNode) {
    isDragging = false;
    clickCandidate = true;
    pointerDownPos = { x, y };
  } else {
    isDragging = true;
    clickCandidate = false;
    startDragX = e.clientX;
    startOffsetX = offsetX;
    lastMoveX = e.clientX;
    lastMoveTime = e.timeStamp;
    velocityX = 0;
    if (navCanvasRef.value) navCanvasRef.value.style.cursor = 'pointer';
  }

  (e.target as HTMLElement).setPointerCapture(e.pointerId);
};

const onPointerMove = (e: PointerEvent) => {
  if (isDragging) {
    const currentTime = e.timeStamp;
    const deltaTime = currentTime - lastMoveTime;
    if (deltaTime > 0) {
      const instantVelocity = (e.clientX - lastMoveX) / deltaTime;
      velocityX = SMOOTHING * velocityX + (1 - SMOOTHING) * instantVelocity;
    }

    lastMoveX = e.clientX;
    lastMoveTime = currentTime;

    const deltaX = e.clientX - startDragX;
    const newOffset = startOffsetX + deltaX;
    offsetX = clampOffset(newOffset);

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      render();
      rafId = null;
    });
  } else if (clickCandidate) {
    const { x, y } = getCanvasCoords(e);
    const dist = Math.sqrt(
      (x - pointerDownPos.x) ** 2 + (y - pointerDownPos.y) ** 2,
    );
    if (dist > CLICK_THRESHOLD) {
      clickCandidate = false;
      updateHover(e);
    }
  } else {
    updateHover(e);
  }
};

const onPointerUp = (e: PointerEvent) => {
  if (isDragging) {
    isDragging = false;
    const target = e.target as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }
    updateHover(e);
    startInertia();
  } else if (clickCandidate) {
    clickCandidate = false;
    const { x, y } = getCanvasCoords(e);
    const hitIndex = hitTestNode(x, y);
    if (hitIndex !== -1) {
      activeIndex.value = hitIndex;
      emit('item-click', navList.value[hitIndex]);
      render();
      scrollToActiveNode();
    }
    if (navCanvasRef.value) navCanvasRef.value.style.cursor = 'pointer';
    const target = e.target as HTMLElement;
    if (target.hasPointerCapture(e.pointerId)) {
      target.releasePointerCapture(e.pointerId);
    }
  }
};

const onPointerLeave = () => {
  if (!isDragging && !clickCandidate) {
    hoverIndex = -1;
    if (navCanvasRef.value) navCanvasRef.value.style.cursor = 'pointer';
    render();
  }
};

const handleResize = () => {
  if (scrollAnimId) {
    cancelAnimationFrame(scrollAnimId);
    scrollAnimId = null;
  }
  if (inertiaAnimId) {
    cancelAnimationFrame(inertiaAnimId);
    inertiaAnimId = null;
  }
  if (rafId) cancelAnimationFrame(rafId);

  setupCanvas();
  offsetX = clampOffset(offsetX);
  hoverIndex = -1;
  clickCandidate = false;
  if (navCanvasRef.value) navCanvasRef.value.style.cursor = 'pointer';
  render();
};

onMounted(() => {
  setupCanvas();
  offsetX = clampOffset(0);
  render();

  // 默认激活第一个节点，并使其居中（无动画）
  if (activeIndex.value !== -1 && allNodes.length > 0) {
    const node = allNodes[activeIndex.value];
    const canvas = navCanvasRef.value;
    if (canvas) {
      const nodeCenterInCanvas = node.rectX + node.rectW / 2;
      const targetOffset = canvas.clientWidth / 2 - nodeCenterInCanvas;
      offsetX = clampOffset(targetOffset);
      render(); // 重新渲染，使节点居中
    }
  }

  if (navCanvasRef.value) navCanvasRef.value.style.cursor = 'pointer';

  const canvas = navCanvasRef.value;
  if (canvas) {
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
  }

  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  const canvas = navCanvasRef.value;
  if (canvas) {
    canvas.removeEventListener('pointerdown', onPointerDown);
    canvas.removeEventListener('pointermove', onPointerMove);
    canvas.removeEventListener('pointerup', onPointerUp);
    canvas.removeEventListener('pointercancel', onPointerUp);
    canvas.removeEventListener('pointerleave', onPointerLeave);
  }
  window.removeEventListener('resize', handleResize);
  if (rafId) cancelAnimationFrame(rafId);
  if (inertiaAnimId) cancelAnimationFrame(inertiaAnimId);
  if (scrollAnimId) cancelAnimationFrame(scrollAnimId);
});
</script>

<style scoped lang="scss">
.app-canvas-nav {
  position: relative;
  width: 100%;
  height: 100px;
  background: #f0f2f5;
  border-radius: var(--ao-border-radius-sm);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

canvas {
  width: 100%;
  height: 100%;
  cursor: pointer;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}

/* 进度条样式 */
.progress-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  pointer-events: none;
  z-index: 2;
  border-radius: 10px;
}

.progress-bar.left {
  left: 0;
}

.progress-bar.right {
  right: 0;
}

.progress-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--ao-color-primary);
  transition: height 0.1s linear;
}

.triangle-indicator {
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 8px solid var(--ao-color-primary-hover);
  border-radius: var(--ao-border-radius-base);
  transform: translateX(-50%);
  transition: left 0.2s ease;
  pointer-events: none;
  z-index: 3;
}

/* 左侧指示器：节点完全在左侧外，箭头指向左边 */
.triangle-indicator.left {
  border-left: 0;
  border-right: 8px solid var(--ao-color-primary-hover);
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  transform: none;
}

/* 右侧指示器：节点完全在右侧外，箭头指向右边 */
.triangle-indicator.right {
  border-left: 8px solid var(--ao-color-primary-hover);
  border-right: 0;
  border-bottom: 6px solid transparent;
  border-top: 6px solid transparent;
  transform: none;
}
</style>