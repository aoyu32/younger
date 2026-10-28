<template>
  <Teleport to="body" :disabled="!isFullscreen">
    <Transition name="ao-loading-fade">
      <div
        v-if="loading"
        class="ao-loading"
        :class="[
          `is-${type}`,
          { 'is-fullscreen': isFullscreen, 'is-mask': isMask },
        ]"
        :style="iconStyle"
        role="status"
        aria-live="polite"
      >
        <span class="ao-loading__icon" aria-hidden="true" v-html="iconSvg" />
        <span v-if="type === 'global' && text" class="ao-loading__text">
          {{ text }}
        </span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * AoLoading
 * @description 加载态：base 基础小尺寸（按钮/行内），global 遮罩（大盒子/全屏）
 *
 * 用法：
 * <AoLoading />                                        // 按钮、行内
 * <AoLoading type="global" />                          // 覆盖最近的定位父元素
 * <AoLoading type="global" fullscreen text="加载中..." /> // 全屏
 * <AoLoading v-if="loading" :size="16" />               // 自定义尺寸
 */
import { computed } from 'vue';
import type { AoLoadingProps } from './types';
import baseSvg from './image/loading-base.svg?raw';
import globalSvg from './image/loading-gobal.svg?raw';

defineOptions({ name: 'ao-loading' });

const props = withDefaults(defineProps<AoLoadingProps>(), {
  type: 'base',
  loading: true,
  text: '加载中...',
  fullscreen: false,
  mask: true,
});

/** 全屏时才挂到 body，避免大盒子内的遮罩脱离父级定位 */
const isFullscreen = computed(() => props.type === 'global' && props.fullscreen);

const isMask = computed(() => props.type === 'global' && props.mask);

const iconSize = computed(() =>
  props.size ?? (props.type === 'base' ? '1em' : 100),
);

/** 数字按 px，字符串原样使用（支持 1em、0.9rem 这类相对单位） */
const iconStyle = computed(() => ({
  '--ao-loading-size':
    typeof iconSize.value === 'number' ? `${iconSize.value}px` : iconSize.value,
}));

const iconSvg = computed(() => (props.type === 'base' ? baseSvg : globalSvg));
</script>

<style scoped src="./index.css"></style>
