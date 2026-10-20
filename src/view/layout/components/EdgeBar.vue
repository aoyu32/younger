<template>
  <!-- 固定在视口右侧下方的简约快捷栏：客服 / 微信 / QQ / 反馈 / 返回顶部（到底部才出现） -->
  <div v-if="show" class="edge-bar">
    <template v-for="item in items" :key="item.key">
      <div v-if="item.qr" class="edge-qr-wrap">
        <div class="edge-item" @click="handleClick(item)">
          <ao-image :src="item.icon" width="22px" height="22px" fit="contain" />
        </div>
        <div class="qr-pop">
          <p v-if="item.qrTitle" class="qr-title">{{ item.qrTitle }}</p>
          <p v-else class="qr-title">
            扫码加入<span class="qr-key">{{ item.qrLabel }}</span>参与讨论吧
          </p>
          <div class="qr-box">
            <ao-image
              :src="item.qr"
              width="160px"
              height="160px"
              fit="contain"
            />
            <span class="qr-logo">
              <ao-image
                :src="item.icon"
                width="18px"
                height="18px"
                fit="contain"
              />
            </span>
          </div>
        </div>
      </div>
      <ao-tooltip v-else :content="item.label" placement="left">
        <div class="edge-item" @click="handleClick(item)">
          <ao-image :src="item.icon" width="22px" height="22px" fit="contain" />
        </div>
      </ao-tooltip>
    </template>
    <Transition name="top-item">
      <ao-tooltip v-if="showTop" content="返回顶部" placement="left">
        <div class="edge-item" @click="scrollToTop">
          <ao-image
            :src="topItem.icon"
            width="22px"
            height="22px"
            fit="contain"
          />
        </div>
      </ao-tooltip>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';

// 组件名称
defineOptions({
  name: 'EdgeBar',
});

/** 仅这些页面显示：首页 / 教程中心 / 应用中心 / 网站导航 / AI资讯 */
const SHOW_ROUTES = ['YOUNGER', 'video', 'application', 'website', 'news'];
const route = useRoute();
const show = computed(() => SHOW_ROUTES.includes(String(route.name)));

type EdgeItem = {
  key: string;
  label: string;
  icon: string;
  qr?: string;
  qrLabel?: string;
  qrTitle?: string;
};

/** 图标传路径字符串，由 AoImage 内部解析 */
const items: EdgeItem[] = [
  {
    key: 'kefu',
    label: '客服',
    icon: '@/assets/layout/icon_kefu.svg',
    qr: '@/assets/layout/qrcode_qq.png',
    qrTitle: '扫码添加官方客服QQ',
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
    qrLabel: 'QQ群',
  },
  { key: 'feedback', label: '反馈', icon: '@/assets/layout/icon_feedback.svg' },
];

/* 返回顶部：滚动到接近底部时才显示 */
const topItem: EdgeItem = {
  key: 'top',
  label: '返回顶部',
  icon: '@/assets/layout/icon_back_top.svg',
};
const showTop = ref(false);

const onScroll = () => {
  const el = document.scrollingElement;
  if (!el) return;
  const toBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
  showTop.value = toBottom <= 150;
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

const emit = defineEmits<{
  click: [key: string];
}>();

/** 点击边缘栏项 */
const handleClick = (item: EdgeItem) => {
  emit('click', item.key);
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style lang="scss" scoped>
.edge-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: fixed;
  right: 26px;
  bottom: 300px;
  z-index: 80;
  padding: 10px 5px;
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-gray-0);
  box-shadow: var(--ao-shadow-sm);
}

.edge-qr-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-pop {
  position: absolute;
  top: 50%;
  right: calc(100% + 12px);
  z-index: 1;
  width: 180px;
  padding: 10px 10px 8px;
  border-radius: var(--ao-border-radius-lg);
  background-color: var(--ao-gray-0);
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
    right: -12px;
    width: 12px;
    height: 100%;
  }

  .qr-title {
    margin: 0 0 6px;
    color: var(--ao-gray-9);
    font-size: 12px;
    font-weight: 500;
    line-height: 1.6;
    text-align: center;
  }

  .qr-key {
    color: var(--ao-color-primary);
    font-weight: 600;
  }

  .qr-box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 160px;
    height: 160px;
  }

  .qr-logo {
    position: absolute;
    left: 50%;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 7px;
    background-color: var(--ao-gray-0);
    box-shadow: 0 0 0 3px var(--ao-gray-0);
    transform: translate(-50%, -50%);
  }
}

.edge-qr-wrap:hover .qr-pop {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(-50%) scale(1);
}

.edge-item {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--ao-gray-2);
  }
}

.top-item-enter-active,
.top-item-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.top-item-enter-from,
.top-item-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
