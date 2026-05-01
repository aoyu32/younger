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
});

const imageModules = import.meta.glob(
  '/src/assets/**/*.{svg,png,jpg,jpeg,gif,webp}',
  { eager: true, query: '?url', import: 'default' },
);

const realSrc = computed(() => {
  if (!props.src) return '';

  if (props.src.startsWith('http') || props.src.startsWith('data:')) {
    return props.src;
  }

  let relativePath = props.src;
  if (relativePath.startsWith('@/')) {
    relativePath = relativePath.replace('@/', '/src/');
  }

  return imageModules[relativePath] || '';
});

const containerStyle = computed(() => ({
  width: props.width,
  height: props.height,
}));

const imgStyle = computed(() => ({ objectFit: props.fit }));
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
  max-width: 100%;
  max-height: 100%;
}
</style>
