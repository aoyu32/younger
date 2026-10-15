<template>
  <svg
    class="rose-divider"
    viewBox="0 0 48 150"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <!-- 枝干渐变：花朵处最深，向下逐渐淡出，末端自然消隐 -->
      <linearGradient
        :id="stemGradientId"
        x1="0"
        y1="42"
        x2="0"
        y2="150"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="#00b5b5" stop-opacity="0.85" />
        <stop offset="0.55" stop-color="#00b5b5" stop-opacity="0.42" />
        <stop offset="0.85" stop-color="#00b5b5" stop-opacity="0.12" />
        <stop offset="1" stop-color="#00b5b5" stop-opacity="0" />
      </linearGradient>

      <!-- 花瓣描边渐变：与站内其它玫瑰保持一致 -->
      <linearGradient :id="roseGradientId" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#00b5b5" />
        <stop offset="1" stop-color="#00e5e5" />
      </linearGradient>

      <!-- 叶片：叶身 + 叶脉 -->
      <g :id="leafId">
        <path
          d="M0,0 C3,-4 8,-5 12,-3 C8,1 3,2 0,0Z"
          stroke-width="0.4"
          fill="none"
          opacity="0.65"
        />
        <path d="M0,0 L10,-3" stroke-width="0.22" opacity="0.35" />
      </g>
    </defs>

    <!-- 枝干：自花朵下方起笔，两个缓弯到底 -->
    <path
      d="M24,42 C35,64 13,84 24,106 C32,120 22,134 24,150"
      :stroke="`url(#${stemGradientId})`"
      stroke-width="0.9"
      stroke-linecap="round"
    />

    <!-- 叶片：错落在枝干外侧 -->
    <g :stroke="`url(#${stemGradientId})`">
      <use
        :href="`#${leafId}`"
        transform="translate(28,60) rotate(-30) scale(1.1)"
      />
      <use
        :href="`#${leafId}`"
        transform="translate(21,92) rotate(155) scale(1)"
      />
      <use
        :href="`#${leafId}`"
        transform="translate(26,128) rotate(-20) scale(0.85)"
      />
    </g>

    <!-- 花朵：极轻微摇曳，与导航处的玫瑰同一种呼吸感 -->
    <g transform="translate(24,30) scale(1.5)">
      <g>
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="-2.5;2.5;-2.5"
          dur="6s"
          repeatCount="indefinite"
          calcMode="spline"
          keyTimes="0;0.5;1"
          keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
        />
        <path
          d="M7,-6.5 C10.5,-3 10.5,2.5 7,5.5 C3.5,8.5 -2.5,8.5 -6,5.5 C-9.5,2.5 -9.5,-2.5 -6,-5.5"
          :stroke="`url(#${roseGradientId})`"
          stroke-width="0.6"
          fill="none"
          stroke-linecap="round"
        />
        <path
          d="M-4,-4.5 C-1,-6 3.5,-5 5,-2 C6.5,1 5,4.5 2.5,5.5"
          :stroke="`url(#${roseGradientId})`"
          stroke-width="0.5"
          fill="none"
          stroke-linecap="round"
          opacity="0.85"
        />
        <path
          d="M0.5,-2 C2.2,-1.5 2.8,0.5 1.8,2 C0.8,3.5 -1.5,3.5 -2.5,2 C-3.5,0.5 -2.8,-1.8 -1,-2.5"
          :stroke="`url(#${roseGradientId})`"
          stroke-width="0.5"
          fill="none"
          stroke-linecap="round"
          opacity="0.95"
        />
        <circle r="0.55" fill="#00b5b5" opacity="0.9" />
      </g>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';

/**
 * 头像与资料字段之间的竖分割：一支带枝干的玫瑰
 * 位置、尺寸与 viewBox 1:1 对应，描边可保持最细；枝干用渐变向下淡出，
 * 因此高度略有出入也不会露出"截断"的尾巴。
 * @author LiangQiYang
 * @date 2026-10-15
 */
defineOptions({ name: 'RoseDivider' });

/** 渐变/叶片 id 需唯一，避免多实例互相抢占 */
const uid = useId();
const stemGradientId = `rose-divider-stem-${uid}`;
const roseGradientId = `rose-divider-rose-${uid}`;
const leafId = `rose-divider-leaf-${uid}`;
</script>

<style scoped lang="scss">
.rose-divider {
  display: block;
  flex-shrink: 0;
  /* 与 viewBox 等宽等高，描边不被缩放拉伸 */
  width: 48px;
  height: 150px;
  /* 相对字段区垂直居中 */
  align-self: center;
  pointer-events: none;
}
</style>
