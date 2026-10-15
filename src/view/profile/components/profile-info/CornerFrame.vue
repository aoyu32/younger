<template>
  <span class="corner-frame" aria-hidden="true">
    <!-- 只画「左上角」一段路径与渐变，其余三角由 CSS 镜像得到 -->
    <svg
      v-for="(corner, index) in CORNERS"
      :key="corner"
      class="corner-frame__item"
      :class="`is-${corner}`"
      viewBox="0 0 40 40"
      fill="none"
    >
      <defs v-if="index === 0">
        <radialGradient
          :id="gradientId"
          cx="0"
          cy="0"
          r="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" style="stop-color: var(--ao-color-primary)" />
          <stop
            offset="1"
            style="stop-color: var(--ao-color-bg-container)"
          />
        </radialGradient>
      </defs>
      <path
        d="M39.5 0.5 L8.5 0.5 A8 8 0 0 0 0.5 8.5 L0.5 39.5"
        :stroke="`url(#${gradientId})`"
        stroke-width="0.75"
        stroke-linecap="round"
      />
    </svg>
  </span>
</template>

<script setup lang="ts">
/**
 * 四角圆角装饰框
 * 四个角共用同一段「左上角」路径与径向渐变，通过 CSS 镜像得到其余三角；
 * 渐变为径向：由角的品牌色向外渐变到页面底色，两端自然消隐。
 * @author LiangQiYang
 * @date 2026-10-15
 */
defineOptions({ name: 'CornerFrame' });

/** 四角标识，顺序与定位样式一一对应 */
const CORNERS = ['tl', 'tr', 'bl', 'br'] as const;

/** 渐变 id：随机后缀，避免同页多次使用时 id 冲突 */
const gradientId = `profile-corner-gradient-${Math.random()
  .toString(36)
  .slice(2, 8)}`;
</script>

<style scoped lang="scss">
.corner-frame {
  position: absolute;
  /* 铺满定位父级，自身不参与文档流 */
  inset: 0;
  /* 纯装饰，不拦截点击 */
  pointer-events: none;
  /* 距 tab 边缘的留白，不贴边 */
  --corner-inset: 20px;
}

.corner-frame__item {
  position: absolute;
  width: 40px;
  height: 40px;

  &.is-tl {
    top: var(--corner-inset);
    left: var(--corner-inset);
  }

  /* 其余三角由左上角镜像得到 */
  &.is-tr {
    top: var(--corner-inset);
    right: var(--corner-inset);
    transform: scaleX(-1);
  }

  &.is-bl {
    bottom: var(--corner-inset);
    left: var(--corner-inset);
    transform: scaleY(-1);
  }

  &.is-br {
    bottom: var(--corner-inset);
    right: var(--corner-inset);
    transform: scale(-1, -1);
  }
}
</style>
