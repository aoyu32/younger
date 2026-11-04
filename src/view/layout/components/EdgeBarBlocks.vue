<template>
  <div v-if="show" class="dock-bar">
    <!-- 反馈 + 更多 + 展开项同一区域：只在悬浮「更多」时展开，区域内移动不收起 -->
    <div
      class="dock-more"
      @pointerleave="closeMore"
    >
      <ao-tooltip content="反馈" placement="left">
        <button
          type="button"
          class="dock-btn"
          aria-label="反馈"
          @click="handleClick(feedbackItem)"
        >
          <ao-image
            :src="feedbackItem.icon"
            width="20px"
            height="20px"
            fit="contain"
          />
        </button>
      </ao-tooltip>

      <Transition name="dock-extra">
        <div v-if="moreOpen" class="dock-extra">
          <div
            v-for="item in extraItems"
            :key="item.key"
            class="dock-item--sub"
          >
            <button
              type="button"
              class="dock-btn"
              :aria-label="item.label"
              @click="handleClick(item)"
            >
              <ao-image :src="item.icon" width="20px" height="20px" fit="contain" />
            </button>
            <div class="qr-pop">
              <p class="qr-title">
                扫码加入<span class="qr-key">{{ item.qrLabel }}</span>参与讨论吧
              </p>
              <div class="qr-box">
                <ao-image :src="item.qr" width="150px" height="150px" fit="contain" />
                <span class="qr-logo">
                  <ao-image :src="item.icon" width="18px" height="18px" fit="contain" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <ao-tooltip content="更多" placement="left">
        <button
          type="button"
          class="dock-btn"
          :class="{ 'is-active': moreOpen }"
          aria-label="更多"
          @pointerenter="openMore"
          @click="moreOpen = !moreOpen"
        >
          <span class="more-dots" aria-hidden="true">
            <i></i><i></i><i></i>
          </span>
        </button>
      </ao-tooltip>
    </div>

    <ao-tooltip content="返回顶部" placement="left">
      <button
        type="button"
        class="dock-btn"
        aria-label="返回顶部"
        @click="scrollToTop"
      >
        <ao-image :src="topIcon" width="18px" height="18px" fit="contain" />
      </button>
    </ao-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

defineOptions({ name: 'EdgeBarBlocks' });

interface DockItem {
  key: string;
  label: string;
  icon: string;
  qr: string;
  qrLabel: string;
}

/** 仅这些页面显示 */
const SHOW_ROUTES = ['YOUNGER', 'video', 'application', 'website', 'news'];
const route = useRoute();
const show = computed(() => SHOW_ROUTES.includes(String(route.name)));

const feedbackItem = {
  key: 'feedback',
  icon: '@/assets/layout/icon_feedback.svg',
};

/** 悬浮「更多」后展开的子项 */
const extraItems: DockItem[] = [
  {
    key: 'kefu',
    label: '客服',
    icon: '@/assets/layout/icon_kefu.svg',
    qr: '@/assets/layout/qrcode_qq.png',
    qrLabel: '客服 QQ',
  },
  {
    key: 'wechat',
    label: '微信',
    icon: '@/assets/layout/icon_wechat.svg',
    qr: '@/assets/layout/qrcode_wechat.png',
    qrLabel: '微信群',
  },
  {
    key: 'qq',
    label: 'QQ',
    icon: '@/assets/layout/icon_qq.svg',
    qr: '@/assets/layout/qrcode_qq.png',
    qrLabel: 'QQ 群',
  },
];

const topIcon = '@/assets/layout/icon_back_top.svg';

const moreOpen = ref(false);
let closeTimer: ReturnType<typeof setTimeout> | undefined;

function openMore() {
  if (closeTimer) clearTimeout(closeTimer);
  moreOpen.value = true;
}

/** 离开整个区域后延迟收起，避免移入子项时闪断 */
function closeMore() {
  if (closeTimer) clearTimeout(closeTimer);
  closeTimer = setTimeout(() => {
    moreOpen.value = false;
  }, 150);
}

const emit = defineEmits<{
  click: [key: string];
}>();

const handleClick = (item: { key: string }) => {
  emit('click', item.key);
};

const scrollToTop = () => {
  const el = document.scrollingElement ?? document.documentElement;
  const startY = el.scrollTop;
  if (startY <= 0) return;
  const duration = 500;
  const start = performance.now();
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
  let cancelled = false;

  const cancel = () => {
    cancelled = true;
  };
  const stopEvents = ['wheel', 'touchstart'];
  stopEvents.forEach((e) => window.addEventListener(e, cancel, { once: true }));

  const tick = (now: number) => {
    if (cancelled) return cleanup();
    const t = Math.min(1, (now - start) / duration);
    el.scrollTop = startY - startY * easeOutCubic(t);
    if (t < 1) requestAnimationFrame(tick);
    else cleanup();
  };
  const cleanup = () => {
    stopEvents.forEach((e) => window.removeEventListener(e, cancel));
  };
  requestAnimationFrame(tick);
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
});

const onScroll = () => {
  if ((document.scrollingElement?.scrollTop ?? 0) === 0) moreOpen.value = false;
};

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  if (closeTimer) clearTimeout(closeTimer);
});
</script>

<style lang="scss" scoped>
.dock-bar {
  position: fixed;
  right: 26px;
  bottom: 40px;
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ao-spacing-xs);
}

.dock-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ao-spacing-xs);
}

.dock-extra {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--ao-spacing-xs);
}

.dock-item--sub {
  position: relative;
}

.dock-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: var(--ao-border-width-thin) solid var(--ao-color-border-secondary);
  border-radius: 10px;
  background-color: var(--ao-color-bg-container);
  color: var(--ao-color-text-secondary);
  cursor: pointer;
  transition:
    color var(--ao-duration-fast) var(--ao-ease-in-out),
    border-color var(--ao-duration-fast) var(--ao-ease-in-out),
    background-color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover,
  &.is-active {
    color: var(--ao-color-primary);
    border-color: var(--ao-color-primary);
    background-color: color-mix(
      in srgb,
      var(--ao-color-primary) 6%,
      var(--ao-color-bg-container)
    );
  }
}

/* 更多：三个点 */
.more-dots {
  display: flex;
  align-items: center;
  gap: 3px;

  i {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: currentColor;
  }
}

/* 二维码浮层 */
.qr-pop {
  position: absolute;
  right: calc(100% + 10px);
  top: 50%;
  z-index: 1;
  width: 176px;
  padding: 10px 10px 8px;
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-color-bg-container);
  box-shadow: var(--ao-shadow-md);
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(-50%) scale(0.96);
  transform-origin: right center;
  transition:
    opacity var(--ao-duration-fast) var(--ao-ease-in-out),
    transform var(--ao-duration-fast) var(--ao-ease-in-out),
    visibility var(--ao-duration-fast) var(--ao-ease-in-out);

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: -10px;
    width: 10px;
    height: 100%;
  }

  .qr-title {
    margin: 0 0 6px;
    color: var(--ao-color-text-base);
    font-size: var(--ao-font-size-xs);
    line-height: 1.6;
    text-align: center;
  }

  .qr-key {
    color: var(--ao-color-primary);
    font-weight: var(--ao-font-weight-semibold);
  }

  .qr-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 150px;
    height: 150px;
    margin: 0 auto;
  }

  .qr-logo {
    position: absolute;
    left: 50%;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 7px;
    background-color: var(--ao-color-bg-container);
    box-shadow: 0 0 0 3px var(--ao-color-bg-container);
    transform: translate(-50%, -50%);
  }
}

.dock-item--sub:hover .qr-pop {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(-50%) scale(1);
}

/* 展开/收起 */
.dock-extra-enter-active,
.dock-extra-leave-active {
  transition:
    opacity var(--ao-duration-fast) var(--ao-ease-out),
    transform var(--ao-duration-fast) var(--ao-ease-out);
}

.dock-extra-enter-from,
.dock-extra-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

/* 移动端隐藏：浮层依赖 hover 交互 */
@media (max-width: 768px) {
  .dock-bar {
    display: none;
  }
}
</style>
