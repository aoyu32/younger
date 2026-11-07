<template>
  <div class="app-downloads" :style="{ '--item-size': `${itemSize}px` }">
    <button
      v-for="platform in platforms"
      :key="platform"
      type="button"
      class="app-downloads__item"
      :title="LABELS[platform]"
      :aria-label="`下载 ${LABELS[platform]} 版`"
    >
      <component :is="ICONS[platform]" class="app-downloads__icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import windowsIcon from '@/assets/app-detail/icon_windows.svg';
import macosIcon from '@/assets/app-detail/icon_macos.svg';
import linuxIcon from '@/assets/app-detail/icon_linux.svg';
import type { AppDetailItem } from '../types';

defineOptions({ name: 'AppDownloadButtons' });

type Platform = 'windows' | 'macos' | 'linux';

const props = defineProps<{
  platforms: AppDetailItem['platforms'];
}>();

const LABELS: Record<Platform, string> = {
  windows: 'Windows',
  macos: 'macOS',
  linux: 'Linux',
};

const ICONS: Record<Platform, unknown> = {
  windows: windowsIcon,
  macos: macosIcon,
  linux: linuxIcon,
};

/**
 * 按钮数量越少按钮略大，但整体保持克制，避免和上方内容比例失衡
 */
const SIZE_BY_COUNT: Record<number, number> = { 1: 48, 2: 44, 3: 40 };

const itemSize = computed(() => SIZE_BY_COUNT[props.platforms.length] ?? 48);
</script>

<style scoped lang="scss">
.app-downloads {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ao-spacing-sm);
  width: 100%;

  &__item {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: var(--item-size);
    height: var(--item-size);
    padding: 0;
    border: none;
    border-radius: var(--ao-border-radius-sm);
    /* 图标主色透明底，图标同色系 */
    background-color: rgba(var(--app-main-rgb, 0, 181, 181), 0.18);
    color: rgba(var(--app-main-rgb, 0, 181, 181), 0.72);
    cursor: pointer;
    transition: background-color var(--ao-duration-fast) var(--ao-ease-in-out);

    &:hover {
      background-color: rgba(var(--app-main-rgb, 0, 181, 181), 0.28);
    }
  }

  &__icon {
    width: 55%;
    height: 55%;
  }
}
</style>
