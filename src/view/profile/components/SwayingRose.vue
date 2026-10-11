<template>
  <svg class="sway-rose" viewBox="120 19 20 14" fill="none" aria-hidden="true">
    <defs>
      <!-- 玫瑰描边渐变 -->
      <linearGradient :id="gradientId" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#00b5b5" />
        <stop offset="1" stop-color="#00e5e5" />
      </linearGradient>
    </defs>

    <!-- 花朵 + 摇曳动画 -->
    <g transform="translate(130,26) scale(0.78)">
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-4;4;-4"
          dur="5s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
        />
        <path
          d="M7,-6.5 C10.5,-3 10.5,2.5 7,5.5 C3.5,8.5 -2.5,8.5 -6,5.5 C-9.5,2.5 -9.5,-2.5 -6,-5.5"
          :stroke="`url(#${gradientId})`"
          stroke-width="0.6"
          fill="none"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
        <path
          d="M-4,-4.5 C-1,-6 3.5,-5 5,-2 C6.5,1 5,4.5 2.5,5.5"
          :stroke="`url(#${gradientId})`"
          stroke-width="0.5"
          fill="none"
          stroke-linecap="round"
          opacity="0.85"
          vector-effect="non-scaling-stroke"
        />
        <path
          d="M0.5,-2 C2.2,-1.5 2.8,0.5 1.8,2 C0.8,3.5 -1.5,3.5 -2.5,2 C-3.5,0.5 -2.8,-1.8 -1,-2.5"
          :stroke="`url(#${gradientId})`"
          stroke-width="0.5"
          fill="none"
          stroke-linecap="round"
          opacity="0.95"
          vector-effect="non-scaling-stroke"
        />
        <circle r="0.55" fill="#00b5b5" opacity="0.9" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';

/** 渐变 id 需唯一，避免多实例互相抢占 */
const gradientId = `rose-grad-${useId()}`;
</script>

<style scoped lang="scss">
.sway-rose {
  display: block;
  width: 100%;
  height: 100%;
  /* 花朵在视窗内居中，允许茎尾溢出不被裁掉 */
  overflow: visible;
}
</style>
