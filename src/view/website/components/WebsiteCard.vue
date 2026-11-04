<template>
  <div class="website-card" :class="{ 'is-left': expandLeft }">
    <div class="card">
      <div class="card-icon">
        <img :src="icon" alt="" />
      </div>
      <div class="card-name">{{ name }}</div>
    </div>
    <div class="hover-card">
      <div class="hover-card-right">
        <div class="right-content">
          <!-- 收藏按钮 -->
          <button
            class="collect action-btn"
            :class="{ 'is-active': collected }"
            type="button"
            :aria-pressed="collected"
            @click.stop="emit('collect')"
          >
            <ao-image
              src="@/assets/website/icon_collect.svg"
              class="action-icon"
              alt="收藏"
              width="16px"
              height="16px"
            />
            <span>{{ collected ? '已收藏' : '收藏' }}</span>
          </button>
          <!-- 分享按钮 -->
          <button
            class="share action-btn"
            type="button"
            @click.stop="emit('share')"
          >
            <ao-image
              src="@/assets/website/icon_share.svg"
              class="action-icon"
              alt="分享"
              width="16px"
              height="16px"
            />
            <span>分享</span>
          </button>
        </div>
      </div>
      <div class="hover-card-bottom flex-between">
        <!-- 描述（最多两行，超出省略） -->
        <div class="desc">{{ desc }}</div>
        <div class="footer">
          <!-- 浏览量 -->
          <div class="view-count">
            <span>{{ viewCount }}</span>
            <span class="view-text">浏览</span>
          </div>
          <!-- 点赞图标和数量 -->
          <button
            class="like"
            :class="{ 'is-active': liked }"
            type="button"
            :aria-pressed="liked"
            @click.stop="emit('like')"
          >
            <span class="like-icon" aria-hidden="true"></span>
            <span>{{ likeCountText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  icon?: string;
  name?: string;
  expandLeft?: boolean;
  desc?: string;
  viewCount?: number | string;
  likeCount?: number | string;
  collected?: boolean;
  liked?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  name: '',
  expandLeft: false,
  desc: '',
  viewCount: 0,
  likeCount: 0,
  collected: false,
  liked: false,
});

const emit = defineEmits<{
  collect: [];
  like: [];
  share: [];
}>();

const likeCountText = computed(() => {
  const base = Number(props.likeCount);
  return (Number.isFinite(base) ? base : 0) + (props.liked ? 1 : 0);
});
</script>

<style scoped lang="scss">
.website-card {
  --card-line-fade: 28px; // L 形边框两端渐变的长度
  --collect-color: #f4ea2a; // 与收藏图标保持一致的黄色
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ao-spacing-xs);
  padding: 16px 8px;
  background-color: var(--ao-color-bg-container);
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-radius: 10px;
  cursor: pointer;
  transition:
    box-shadow var(--ao-duration-base) var(--ao-ease-in-out),
    transform var(--ao-duration-base) var(--ao-ease-in-out);
}

/* hover：小卡片不带阴影、不带整圈边框，只在朝向间隔的两侧画两条直线
   （触屏点开会粘住展开态，仅指针设备启用；滚动期间禁用） */
@media (hover: hover) {
  /* 展开时整块卡片一起提升层级，避免相邻卡片盖住面板 */
  .website-card.is-hovered {
    z-index: 1002;
  }

  .website-card.is-hovered .card {
    z-index: 1001; // 盖在展开面板之上
    transform: translateY(-4px);
    box-shadow: none;
    border-color: transparent;
    background-color: var(--ao-gray-0); // 与面板同色
  }
}

/*
 * 一整条 L 形边框（带圆角，不断开）：
 * 竖边从面板顶边一直画到右下圆角，横边从圆角一直画到面板侧边，两端都到头
 * 右下角的圆角与小卡片自身圆角（10px）重合
 */
.card::before {
  content: '';
  position: absolute;
  inset: calc(-1 * var(--ao-border-width-thin)); // 与小卡片外沿完全重合
  border-right: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-bottom: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-bottom-right-radius: 10px;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--ao-duration-base) var(--ao-ease-in-out);

  /* 两个远端（竖边顶部、横边末端）逐渐变浅：两层渐变相乘 */
  -webkit-mask-image:
    linear-gradient(to bottom, transparent 0, #000 var(--card-line-fade)),
    linear-gradient(to right, transparent 0, #000 var(--card-line-fade));
  -webkit-mask-composite: source-in;
  mask-image:
    linear-gradient(to bottom, transparent 0, #000 var(--card-line-fade)),
    linear-gradient(to right, transparent 0, #000 var(--card-line-fade));
  mask-composite: intersect;
}

@media (hover: hover) {
  .website-card.is-hovered .card::before {
    opacity: 1;
  }
}

/* 向左展开：镜像，竖边在左，圆角在左下 */
.website-card.is-left .card::before {
  border-right: none;
  border-left: var(--ao-border-width-thin) solid var(--ao-color-border);
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 10px;
  /* 镜像：横边末端在右侧 */
  -webkit-mask-image:
    linear-gradient(to bottom, transparent 0, #000 var(--card-line-fade)),
    linear-gradient(to left, transparent 0, #000 var(--card-line-fade));
  mask-image:
    linear-gradient(to bottom, transparent 0, #000 var(--card-line-fade)),
    linear-gradient(to left, transparent 0, #000 var(--card-line-fade));
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--ao-border-radius-xl);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.card-name {
  max-width: 100%;
  font-size: var(--ao-font-size-sm);
  font-weight: var(--ao-font-weight-semibold);
  line-height: var(--ao-line-height-tight);
  color: var(--ao-color-text-base);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
}

/* ---------- 展开面板：默认向右（奇数位） ---------- */
.hover-card {
  width: calc(200% + 20px);
  height: calc(200% + 20px);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.6);
  transform-origin: top left;
  background-color: var(--ao-gray-0); // 整块铺底，填满左上角缺口
  border-radius: var(--ao-border-radius-lg);
  transition:
    opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1),
    filter 0.3s ease;
}

@media (hover: hover) {
  .website-card.is-hovered .hover-card {
    opacity: 1;
    pointer-events: auto;
    transform: scale(1) translateY(-4px);
    // 阴影只出现在整个面板的外轮廓
    filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
  }
}

/* ---------- 向左展开（偶数位） ---------- */
.website-card.is-left .hover-card {
  left: auto;
  right: 0;
  transform-origin: top right;
}

.website-card.is-left .hover-card-right {
  right: auto;
  left: 0;
}

/* 以下两块仅负责布局，背景和圆角由 .hover-card 统一提供 */
.hover-card-right {
  width: 50%;
  height: 100%;
  position: absolute;
  right: 0;
  display: flex;
  align-items: start;
}

.hover-card-bottom {
  width: 100%;
  height: 50%;
  position: absolute;
  bottom: 0;
  flex-direction: column;
}

/* ========== 内容样式 ========== */
/* 右侧按钮容器 */
.right-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  justify-content: center;
}

/* 按钮通用样式 */
.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--ao-gray-5);
  padding: 5px 0;
  cursor: pointer;
  border-radius: 6px;
  transition: background-color 0.2s;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-base);

  &:hover {
    background-color: var(--ao-color-bg-hover);
  }

  &.is-active {
    border-color: var(--collect-color);
  }
}

/* 按钮中的图标 */
.action-icon {
  width: 18px;
  height: 18px;
  display: block;
}

/* 描述文本（两行省略） */
.desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-gray-7);
  margin: 16px;
  word-break: break-all;
}

/* 底部信息栏 */
.footer {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px 16px;
  font-size: var(--ao-font-size-xs);
  color: var(--ao-color-text-secondary);
}

/* 浏览量 */
.view-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 点赞 */
.like {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition:
    color 0.2s,
    transform 0.2s;

  &:hover,
  &.is-active {
    color: var(--ao-color-error);
  }

  &.is-active {
    font-weight: var(--ao-font-weight-semibold);
  }
}

.like-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: inline-block;
  background-color: currentColor;
  -webkit-mask: url('@/assets/website/icon_like.svg') center / contain
    no-repeat;
  mask: url('@/assets/website/icon_like.svg') center / contain no-repeat;
  transition: transform 0.2s;
}

.like.is-active .like-icon {
  transform: scale(1.12);
}
</style>