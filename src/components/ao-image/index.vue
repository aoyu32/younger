<template>
  <div class="ao-image" :style="containerStyle">
    <!-- 使用解析后的 realSrc -->
    <img :src="realSrc" alt="" :style="imgStyle" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import emptyImage from '@/assets/images/icon_empty_img.svg';

defineOptions({ name: 'AoImage' });

const props = defineProps({
  src: {
    type: String,
    default: emptyImage,
  },
  width: {
    type: String,
    default: '100%',
  },
  height: {
    type: String,
    default: '100%',
  },
  fit: {
    type: String,
    default: 'cover',
  },
  circle: {
    type: Boolean,
    default: false,
  },
});

const imageModules = import.meta.glob(
  '/src/assets/**/*.{svg,png,jpg,jpeg,gif,webp}',
  { eager: true, query: '?url', import: 'default' },
);

const realSrc = computed(() => {
  const source = props.src?.trim();
  if (!source) return '';

  // 外链、内联图片、blob 以及 Vite 构建后的 /assets/... 地址直接使用
  if (
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.startsWith('//') ||
    source.startsWith('data:') ||
    source.startsWith('blob:')
  ) {
    return source;
  }

  // 模板里的 @/assets/... 需要转成 glob 的 /src/assets/... 键
  if (source.startsWith('@/')) {
    const modulePath = source.replace('@/', '/src/');
    return imageModules[modulePath] || '';
  }

  // 开发环境是 /src/assets/...，生产构建后是 /assets/...（带 hash）
  if (source.startsWith('/src/assets/')) {
    return imageModules[source] || source;
  }

  return imageModules[source] || source;
});

const containerStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));

const imgStyle = computed(() => ({
  objectFit: props.fit,
  borderRadius: props.circle ? '50%' : '0',
}));
</script>

<style lang="scss" scoped>
.ao-image {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
img {
  width: 100%;
  height: 100%;
}
</style>
