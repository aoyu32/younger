<template>
  <svg
    class="nav-flower-line"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 600 130"
    preserveAspectRatio="xMidYMax meet"
    fill="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        :id="gradientId"
        x1="0"
        x2="600"
        y1="0"
        y2="0"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stop-color="currentColor" stop-opacity="0" />
        <stop offset="0.10" stop-color="currentColor" stop-opacity="0.7" />
        <stop offset="0.30" stop-color="currentColor" stop-opacity="1" />
        <stop offset="0.88" stop-color="currentColor" stop-opacity="1" />
        <stop offset="1" stop-color="currentColor" stop-opacity="0" />
      </linearGradient>
    </defs>

    <!-- ① 枝干：0 ~ 0.80s 一气呵成，dasharray 贴实际长度，末段不放缓 -->
    <path
      d="M 15,96
           C 95,86 155,100 235,90
           C 315,80 375,98 394,92
           C 420,89 440,89 458,90
           C 478,92 490,104 483,114
           C 476,123 460,118 460,108
           C 460,100 470,98 475,104"
      :stroke="`url(#${gradientId})`"
      stroke-width="1.1"
      stroke-linecap="round"
      fill="none"
      vector-effect="non-scaling-stroke"
      stroke-dasharray="560"
      stroke-dashoffset="560"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="560;140;0"
        dur="0.8s"
        fill="freeze"
        calcMode="spline"
        keyTimes="0;0.6;1"
        keySplines="0.3 0 0.4 1; 0.25 0 0.3 1"
      />
    </path>

    <!-- ② 花茎：0.36s 起，枝干才画到一半就分叉，边画边开花 -->
    <path
      d="M 394,92 C 402,80 404,60 410,44"
      stroke="currentColor"
      stroke-width="1"
      stroke-linecap="round"
      fill="none"
      vector-effect="non-scaling-stroke"
      stroke-dasharray="70"
      stroke-dashoffset="70"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="70;17;0"
        dur="0.26s"
        begin="0.36s"
        fill="freeze"
        calcMode="spline"
        keyTimes="0;0.6;1"
        keySplines="0.3 0 0.4 1; 0.25 0 0.3 1"
      />
    </path>

    <!-- ③ 茎上叶子：0.46s 淡入（花茎已画过它） -->
    <g transform="translate(400,70) rotate(-40) scale(0.85)" opacity="0">
      <path
        d="M0,0 C3,-4 8,-5 12,-3 C8,1 3,2 0,0Z"
        stroke="currentColor"
        stroke-width="0.5"
        fill="none"
        opacity="0.7"
        vector-effect="non-scaling-stroke"
      />
      <path
        d="M0,0 L10,-3"
        stroke="currentColor"
        stroke-width="0.35"
        opacity="0.4"
        vector-effect="non-scaling-stroke"
      />
      <animate
        attributeName="opacity"
        from="0"
        to="1"
        dur="0.2s"
        begin="0.46s"
        fill="freeze"
        calcMode="spline"
        keyTimes="0;1"
        keySplines="0.3 0 0.4 1"
      />
    </g>

    <!-- ④ 玫瑰：0.50s 起逐圈绘制，花茎还没画完就开始 -->
    <g transform="translate(410,42) scale(1.7)">
      <path
        d="M7,-6.5 C10.5,-3 10.5,2.5 7,5.5 C3.5,8.5 -2.5,8.5 -6,5.5 C-9.5,2.5 -9.5,-2.5 -6,-5.5"
        stroke="currentColor"
        stroke-width="0.9"
        fill="none"
        stroke-linecap="butt"
        vector-effect="non-scaling-stroke"
        stroke-dasharray="44"
        stroke-dashoffset="44"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="44;11;0"
          dur="0.32s"
          begin="0.5s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;0.6;1"
          keySplines="0.3 0 0.4 1; 0.25 0 0.3 1"
        />
      </path>
      <path
        d="M-4,-4.5 C-1,-6 3.5,-5 5,-2 C6.5,1 5,4.5 2.5,5.5"
        stroke="currentColor"
        stroke-width="0.8"
        fill="none"
        stroke-linecap="butt"
        opacity="0.85"
        vector-effect="non-scaling-stroke"
        stroke-dasharray="24"
        stroke-dashoffset="24"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="24;6;0"
          dur="0.28s"
          begin="0.64s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;0.6;1"
          keySplines="0.3 0 0.4 1; 0.25 0 0.3 1"
        />
      </path>
      <path
        d="M0.5,-2 C2.2,-1.5 2.8,0.5 1.8,2 C0.8,3.5 -1.5,3.5 -2.5,2 C-3.5,0.5 -2.8,-1.8 -1,-2.5"
        stroke="currentColor"
        stroke-width="0.7"
        fill="none"
        stroke-linecap="butt"
        opacity="0.95"
        vector-effect="non-scaling-stroke"
        stroke-dasharray="18"
        stroke-dashoffset="18"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="18;4.5;0"
          dur="0.24s"
          begin="0.76s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;0.6;1"
          keySplines="0.3 0 0.4 1; 0.25 0 0.3 1"
        />
      </path>
      <!-- 半径放大仅因整体被缩小到约 1/3.5，0.55 在页面上不足 0.3px -->
      <circle r="1.4" fill="currentColor" opacity="0">
        <animate
          attributeName="opacity"
          from="0"
          to="1"
          dur="0.18s"
          begin="0.84s"
          fill="freeze"
          calcMode="spline"
          keyTimes="0;1"
          keySplines="0.3 0 0.4 1"
        />
      </circle>
    </g>
  </svg>
</template>

<script setup lang="ts">
import { useId } from 'vue';

/** 渐变 id 需唯一，避免多实例互相抢占 */
const gradientId = `nav-flower-fade-${useId()}`;
</script>

<style scoped lang="scss">
.nav-flower-line {
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
