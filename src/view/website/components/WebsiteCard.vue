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
          <button class="collect action-btn" type="button">
            <ao-image
              src="@/assets/website/icon_collect.svg"
              class="action-icon"
              alt="收藏"
              width="16px"
              height="16px"
            />
            <span>收藏</span>
          </button>
          <!-- 分享按钮 -->
          <button class="share action-btn" type="button">
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
          <div class="like">
            <ao-image
              src="@/assets/website/icon_like.svg"
              class="like-icon"
              alt="点赞"
              width="16px"
              height="16px"
            />
            <span>{{ likeCount }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string;
  name?: string;
  expandLeft?: boolean;
  desc?: string;
  viewCount?: number | string;
  likeCount?: number | string;
}

withDefaults(defineProps<Props>(), {
  icon: '',
  name: '',
  expandLeft: false,
  desc: '',
  viewCount: 0,
  likeCount: 0,
});
</script>

<style scoped lang="scss">
.website-card {
  width: 100%;
  height: 100%;
  position: relative;
  cursor: pointer;
}

.card {
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

.website-card:hover .card {
  transform: translateY(-4px);
  box-shadow: var(--ao-shadow-lg);
  border-color: transparent;
}

.website-card:hover .hover-card {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1) translateY(-4px);
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
  transition:
    opacity 0.25s ease,
    transform 0.3s cubic-bezier(0.34, 1.4, 0.64, 1),
    filter 0.3s ease;
  border-radius: var(--ao-border-radius-lg);

  &::before {
    content: '';
    position: absolute;
    width: var(--ao-border-radius-lg);
    height: var(--ao-border-radius-lg);
    top: calc(50% - var(--ao-border-radius-lg));
    left: calc(50% - var(--ao-border-radius-lg));
    background: radial-gradient(
      circle at 0 0,
      transparent calc(var(--ao-border-radius-lg) - 1px),
      var(--ao-gray-0) var(--ao-border-radius-lg)
    );
  }
}

.website-card:hover .hover-card {
  opacity: 1;
  pointer-events: auto;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.12));
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
  border-top-left-radius: var(--ao-border-radius-lg);
  border-top-right-radius: var(--ao-border-radius-lg);
  border-bottom-right-radius: var(--ao-border-radius-lg);
  border-bottom-left-radius: var(--ao-border-radius-lg);
}

.website-card.is-left .hover-card-bottom {
  border-top-left-radius: var(--ao-border-radius-lg);
  border-top-right-radius: var(--ao-border-radius-lg);
  border-bottom-right-radius: var(--ao-border-radius-lg);
  border-bottom-left-radius: var(--ao-border-radius-lg);
}

.website-card.is-left .hover-card::before {
  left: auto;
  right: calc(50% - var(--ao-border-radius-lg));
  background: radial-gradient(
    circle at 100% 0,
    transparent calc(var(--ao-border-radius-lg) - 1px),
    var(--ao-gray-0) var(--ao-border-radius-lg)
  );
}

.hover-card-right {
  width: 50%;
  position: absolute;
  height: 100%;
  background-color: var(--ao-gray-0);
  border-top-left-radius: var(--ao-border-radius-lg);
  display: flex;
  align-items: start;
  right: 0;
  border-top-left-radius: var(--ao-border-radius-lg);
  border-top-right-radius: var(--ao-border-radius-lg);
  border-bottom-right-radius: var(--ao-border-radius-lg);
}

.hover-card-bottom {
  width: 100%;
  height: 50%;
  position: absolute;
  bottom: 0;
  background-color: var(--ao-gray-0);
  border-top-left-radius: var(--ao-border-radius-lg);
  border-bottom-left-radius: var(--ao-border-radius-lg);
  border-bottom-right-radius: var(--ao-border-radius-lg);
  flex-direction: column;
}

/* ========== 新增内容样式（不影响原有样式） ========== */
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
}

.like-icon {
  width: 16px;
  height: 16px;
}
</style>
