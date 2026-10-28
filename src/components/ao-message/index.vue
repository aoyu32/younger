<template>
  <div
    class="ao-message"
    :class="{ 'is-inverse': isInverse }"
    :style="rootStyle"
    role="alert"
  >
    <canvas ref="canvasEl" class="ao-message__particles" aria-hidden="true"></canvas>
    <img
      v-if="showIcon"
      class="ao-message__icon"
      :class="{ 'is-inverse': isInverse && !icon }"
      :src="iconSrc"
      alt=""
      aria-hidden="true"
    />
    <span class="ao-message__content">
      <slot>{{ content }}</slot>
    </span>
    <img
      v-if="showClose"
      class="ao-message__close"
      :src="closeIcon"
      alt="关闭"
      @click="close"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * AoMessage
 * @description 消息提示，通常用命令式调用：
 * message.success('保存成功')
 * message.warning({ content: '内容', duration: 0, showClose: false })
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { AoMessageProps, AoMessageType } from './types';
import { useParticles } from './use-particles';
import iconPrimary from './image/icon_primary.svg?url';
import iconSuccess from './image/icon_success.svg?url';
import iconWarning from './image/icon_warning.svg?url';
import iconInfo from './image/icon_info.svg?url';
import iconError from './image/icon_error.svg?url';
import closeIcon from './image/icon_close.svg?url';

defineOptions({ name: 'ao-message' });

const props = withDefaults(defineProps<AoMessageProps>(), {
  type: 'primary',
  content: '',
  color: '',
  background: '',
  icon: '',
  showIcon: true,
  showClose: false,
  duration: 3000,
});

const emit = defineEmits<{
  /** 请求关闭（叉号或自动关闭），由容器负责移除 */
  close: [];
}>();

/** 类型主题色，与内置图标颜色保持一致 */
const THEME: Record<AoMessageType, string> = {
  primary: '#00b5b5',
  success: '#67c23a',
  warning: '#e6a23c',
  info: '#909399',
  error: '#f56c6c',
};

const ICONS: Record<AoMessageType, string> = {
  primary: iconPrimary,
  success: iconSuccess,
  warning: iconWarning,
  info: iconInfo,
  error: iconError,
};

const themeColor = computed(() => THEME[props.type]);

const iconSrc = computed(() => props.icon || ICONS[props.type]);

/** 默认背景 = 类型色混白（不透明的浅色底），比例越大颜色越深 */
const TINT_RATIO = 0.18;

/** 实际背景色：默认浅色品牌底 */
const bgColor = computed(
  () => props.background || mixWithWhite(themeColor.value, TINT_RATIO),
);

/** 浅底用类型色文字，深底用白字 */
const isLightBg = computed(() => isLightColor(bgColor.value));

const textColor = computed(
  () => props.color || (isLightBg.value ? themeColor.value : '#fff'),
);

/** 深色背景：内置图标和关闭叉号转白，自定义图标保持原样 */
const isInverse = computed(() => !isLightBg.value);

const rootStyle = computed(() => ({
  '--ao-message-bg': bgColor.value,
  '--ao-message-color': textColor.value,
}));

/** 出现时的粒子拖尾 */
const canvasEl = ref<HTMLCanvasElement | null>(null);
useParticles(canvasEl, () => themeColor.value);

let timer: ReturnType<typeof setTimeout> | undefined;

/** 关闭：由容器负责离场动画和销毁 */
function close() {
  if (timer) clearTimeout(timer);
  emit('close');
}

onMounted(() => {
  if (props.duration > 0) {
    timer = setTimeout(close, props.duration);
  }
});

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer);
});

defineExpose({ close });

type RGB = [number, number, number];

/** 解析 #rgb / #rrggbb / rgb() / rgba()，失败返回 null */
function parseColor(color: string): RGB | null {
  const value = color.trim();
  if (value.startsWith('#')) {
    const hex = value.slice(1);
    const full =
      hex.length === 3
        ? hex
            .split('')
            .map((c) => c + c)
            .join('')
        : hex;
    if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
    return [
      parseInt(full.slice(0, 2), 16),
      parseInt(full.slice(2, 4), 16),
      parseInt(full.slice(4, 6), 16),
    ];
  }
  const match = value.match(/^rgba?\(([^)]+)\)$/i);
  if (!match) return null;
  const parts = match[1]
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  if (parts.length < 3 || parts.slice(0, 3).some((n) => Number.isNaN(n))) {
    return null;
  }
  return [parts[0], parts[1], parts[2]];
}

/** 颜色是否偏亮 */
function isLightColor(color: string): boolean {
  const rgb = parseColor(color);
  if (!rgb) return false;
  const [r, g, b] = rgb;
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

/** 按比例把颜色和白色混合，得到不透明的浅色 */
function mixWithWhite(color: string, ratio: number): string {
  const rgb = parseColor(color);
  if (!rgb) return color;
  const mixed = rgb.map((c) => Math.round(c * ratio + 255 * (1 - ratio)));
  return `rgb(${mixed[0]}, ${mixed[1]}, ${mixed[2]})`;
}
</script>

<style scoped src="./index.css"></style>
