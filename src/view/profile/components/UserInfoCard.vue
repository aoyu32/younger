<template>
  <div class="user-info-card">
    <div class="image-bg-wrapper" :style="wrapperStyle">
      <canvas ref="bgRef" class="ascii-bg" aria-hidden="true"></canvas>
      <div class="veil" aria-hidden="true"></div>

      <div class="card-content">
        <div class="top"></div>

        <div class="bottom">
          <div class="user">
            <div class="user-avatar">
              <img :src="avatarUrl" alt="用户头像" @error="handleImgError" />
            </div>
            <div class="user-info">
              <div class="user-name">{{ displayName }}</div>
              <div class="user-desc">{{ displayDesc }}</div>
              <div class="user-meta">
                <span>{{ displayGender }}</span>
                <span class="dot"></span>
                <span>{{ displayCity }}</span>
                <span class="dot"></span>
                <span>{{ joinText }}</span>
                <span class="dot"></span>
                <span>{{ displayProfession }}</span>
              </div>
            </div>
          </div>
          <div class="logout-wrapper" @click="openLogoutConfirm">退出登录</div>
        </div>
      </div>
    </div>
    <AoDialog
      v-model="logoutConfirmVisible"
      title="退出登录"
      confirm-text="确定退出"
      @confirm="handleLogoutConfirm"
    >
      <p class="logout-confirm-text">确定要退出当前账号吗？</p>
    </AoDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import useStore from '@/store';
import { logout as logoutApi } from '@/api/auth';
import AoDialog from '@/components/ao-dialog/index.vue';
import { message } from '@/components/ao-message';
import defaultAvatar from '@/assets/deafult_avatar.png';
import { resolveFileUrl } from '@/utils/file';

/** 后端数字性别 → 展示文案 */
const GENDER_TEXT: Record<number, string> = { 1: '男', 2: '女' };

const router = useRouter();
const { user: userStore } = useStore();
const { userInfo } = storeToRefs(userStore);
const { logout } = userStore;

/** 头像：后端未设置或加载失败时用默认头像 */
const avatarUrl = computed(
  () => resolveFileUrl(userInfo.value?.avatar) || defaultAvatar,
);
const displayName = computed(() => userInfo.value?.nickname || '未登录');
const displayDesc = computed(() => userInfo.value?.bio || '这个人很懒，还没有写简介');
const displayCity = computed(
  () =>
    [userInfo.value?.province, userInfo.value?.city]
      .filter(Boolean)
      .join(' · ') || '未设置城市',
);
const displayGender = computed(
  () => GENDER_TEXT[userInfo.value?.gender ?? 0] ?? '未设置性别',
);
const displayProfession = computed(
  () => userInfo.value?.profession || '未填写职业',
);
const joinText = computed(() =>
  userInfo.value?.createdTime
    ? `${userInfo.value.createdTime.slice(0, 4)} 年加入`
    : '未知加入时间',
);

function handleImgError(e: Event) {
  const img = e.target as HTMLImageElement;
  if (img && !img.src.endsWith('deafult_avatar.png')) img.src = defaultAvatar;
}

const logoutConfirmVisible = ref(false);

const openLogoutConfirm = () => {
  logoutConfirmVisible.value = true;
};

const handleLogoutConfirm = async () => {
  logoutConfirmVisible.value = false;
  try {
    await logoutApi({ silent: true, skipAuthRedirect: true });
    message.success('已退出登录');
  } catch {
    // 会话已失效时继续清理本地登录态
  } finally {
    logout();
    router.push('/home');
  }
};

const props = withDefaults(
  defineProps<{
    /** 图片地址，或 File / Blob */
    src?: string | File | Blob;
    /** 字符调色板，按亮度从暗到亮排列 */
    chars?: string;
    /** 字号（同时决定字符密度） */
    fontSize?: number;
    /** 单个字符的宽高比（等宽字体一般 0.6 左右） */
    charAspect?: number;
    /** 整体透明度 */
    opacity?: number;
    /** 单色饱和度增强，1 = 原色 */
    saturate?: number;
    fit?: 'cover' | 'contain';
    fontFamily?: string;
    /** 容器高度是否跟随图片宽高比（默认 false，保持固定 250px 高度） */
    autoAspect?: boolean;
  }>(),
  {
    src: '',
    chars: '&',
    fontSize: 10,
    charAspect: 0.25,
    opacity: 0.15,
    saturate: 2,
    fit: 'cover',
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
    autoAspect: false,
  },
);

const bgRef = ref<HTMLCanvasElement | null>(null);
/** 图片原始宽高比 naturalWidth / naturalHeight */
const imgRatio = ref(0);

const wrapperStyle = computed(() => {
  if (!props.autoAspect || !imgRatio.value) return {};
  return {
    aspectRatio: String(imgRatio.value),
    // 行内样式覆盖掉 scss 里的 height: 250px
    height: 'auto',
  };
});

let sampleCanvas: HTMLCanvasElement | null = null;
let observer: ResizeObserver | null = null;
let rafId = 0;
let token = 0;
let img: HTMLImageElement | null = null;
let imgKey = '';
let objectUrl = '';

/* ---------------- 图片加载 ---------------- */

function keyOf(src: string | File | Blob) {
  if (typeof src === 'string') return src;
  const f = src as File;
  return `blob:${f.name ?? ''}:${f.size}:${f.lastModified ?? 0}`;
}

function revoke() {
  if (objectUrl) {
    URL.revokeObjectURL(objectUrl);
    objectUrl = '';
  }
}

async function getImage(): Promise<HTMLImageElement | null> {
  if (!props.src) return null;

  const key = keyOf(props.src);
  if (img && imgKey === key) return img;

  revoke();
  let url: string;
  if (typeof props.src === 'string') {
    url = props.src;
  } else {
    objectUrl = URL.createObjectURL(props.src);
    url = objectUrl;
  }

  try {
    const el = new Image();
    // 跨域图片必须带 CORS 头，否则无法读取像素
    el.crossOrigin = 'anonymous';
    el.decoding = 'async';
    await new Promise<void>((resolve, reject) => {
      el.onload = () => resolve();
      el.onerror = () => reject(new Error(`图片加载失败: ${url}`));
      el.src = url;
    });

    img = el;
    imgKey = key;
    imgRatio.value = el.naturalWidth / el.naturalHeight || 1;
    return el;
  } catch (err) {
    console.error('[user-info-card]', err);
    img = null;
    imgKey = '';
    return null;
  }
}

/* ---------------- 绘制 ---------------- */

function paint(canvas: HTMLCanvasElement, src: HTMLImageElement) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return;

  const { chars, charAspect, fit, fontFamily, saturate } = props;
  const cellH = Math.max(1, props.fontSize);
  const cellW = cellH * charAspect;

  // 网格：每个格子对应一个字符
  const cols = Math.max(1, Math.round(width / cellW));
  const rows = Math.max(1, Math.round(height / cellH));
  // 格子的真实屏幕尺寸（关键：cw 和 ch 通常不相等）
  const cw = width / cols;
  const ch = height / rows;
  const fontSize = Math.min(ch, cw / charAspect);

  // 把图片缩到 cols × rows，一个像素 = 一个字符
  if (!sampleCanvas) sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = cols;
  sampleCanvas.height = rows;
  const sctx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sctx) return;

  sctx.clearRect(0, 0, cols, rows);
  sctx.imageSmoothingEnabled = true;
  sctx.imageSmoothingQuality = 'high';

  const iw = src.naturalWidth || 1;
  const ih = src.naturalHeight || 1;

  const s =
    fit === 'contain'
      ? Math.min(width / iw, height / ih)
      : Math.max(width / iw, height / ih);

  const dw = (iw * s) / cw; // 目标宽（单位：格）
  const dh = (ih * s) / ch; // 目标高（单位：格）

  sctx.drawImage(src, (cols - dw) / 2, (rows - dh) / 2, dw, dh);

  let data: Uint8ClampedArray;
  try {
    data = sctx.getImageData(0, 0, cols, rows).data;
  } catch (err) {
    console.error('[user-info-card] 跨域图片无法读取像素：', err);
    return;
  }

  // 输出画布
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.opacity = String(props.opacity);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.font = `700 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const palette = chars || '*';
  const last = palette.length - 1;

  for (let y = 0; y < rows; y++) {
    const cy = y * ch + ch / 2;
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;
      let r = data[i];
      let g = data[i + 1];
      let b = data[i + 2];
      const a = data[i + 3];
      if (a <= 8) continue;

      const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      const char = palette[Math.min(last, Math.floor(lum * palette.length))];
      if (char === ' ') continue;

      if (saturate !== 1) {
        const gray = lum * 255;
        r = Math.max(0, Math.min(255, gray + (r - gray) * saturate));
        g = Math.max(0, Math.min(255, gray + (g - gray) * saturate));
        b = Math.max(0, Math.min(255, gray + (b - gray) * saturate));
      }

      // 直接用原像素颜色绘制字符
      ctx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},${a / 255})`;
      ctx.fillText(char, x * cw + cw / 2, cy);
    }
  }
}

async function render() {
  const canvas = bgRef.value;
  if (!canvas) return;

  if (!props.src) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    return;
  }

  const my = ++token;
  const source = await getImage();
  if (!source || my !== token || !bgRef.value) return;
  paint(bgRef.value, source);
}

function scheduleRender() {
  if (rafId) cancelAnimationFrame(rafId);
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    void render();
  });
}

onMounted(() => {
  if (bgRef.value && typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(scheduleRender);
    observer.observe(bgRef.value);
  }
  scheduleRender();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  if (rafId) cancelAnimationFrame(rafId);
  revoke();
  img = null;
  imgKey = '';
});

watch(() => ({ ...props }), scheduleRender, { deep: true });

defineExpose({ refresh: scheduleRender });
</script>

<style scoped lang="scss">
.user-info-card {
  width: 100%;
}

.image-bg-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;

  /* 蒙层颜色：改成页面背景色即可无缝衔接 */
  --veil-rgb: 255, 255, 255;

  .ascii-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
    user-select: none;
  }

  .veil {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(var(--veil-rgb), 0) 0%,
      rgba(var(--veil-rgb), 0.25) 45%,
      rgba(var(--veil-rgb), 0.8) 80%,
      rgba(var(--veil-rgb), 1) 100%
    );
  }

  .card-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 40px 20px;
    box-sizing: border-box;
  }

  .top {
    flex: 1;
    min-height: 0;
  }

  .bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
  }

  .user {
    display: flex;
    align-items: center;
    gap: 16px;
    min-width: 0;
    flex: 1;
  }

  .user-avatar {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background-color: #e5e7eb;
    flex-shrink: 0;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .user-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
    flex: 1;
    overflow: hidden;
  }

  .user-name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    line-height: 1.3;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-desc {
    font-size: 13px;
    color: #6b7280;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 单行展示：放不下的每一块各自省略，不换行 */
  .user-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    font-size: 12px;
    color: #9ca3af;
    line-height: 1.4;
    white-space: nowrap;

    > span:not(.dot) {
      min-width: 0;
      flex: 0 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .dot {
      flex-shrink: 0;
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background-color: #d1d5db;
    }
  }

  .logout-wrapper {
    flex-shrink: 0;
    font-weight: 500;
    color: #ff8383;
    transition: color 0.3s ease-in-out;
    cursor: pointer;
    &:hover {
      color: #ff5757;
    }
  }

  /* 小屏：缩小头像与间距，给资料信息留出更多宽度 */
  @media (max-width: 480px) {
    .card-content {
      padding: 30px 16px;
    }

    .user {
      gap: 12px;
    }

    .user-avatar {
      width: 44px;
      height: 44px;
    }
  }
}

.logout-confirm-text {
  margin: 0;
  font-size: calc(var(--ao-font-size-sm) + 1px);
  line-height: 1.8;
}
</style>
