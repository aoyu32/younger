<template>
  <div class="tutorial-pager">
    <div
      class="pager-item prev"
      :class="{ disabled: !prev }"
      @click="handleChange(prev)"
    >
      <AoIcon :icon="preIcon" :size="20" class="pager-icon" />
      <span class="pager-title">{{ prev ? prev.title : '已经是第一篇' }}</span>
    </div>
    <div
      class="pager-item next"
      :class="{ disabled: !next }"
      @click="handleChange(next)"
    >
      <span class="pager-title">{{ next ? next.title : '已经是最后一篇' }}</span>
      <AoIcon :icon="nextIcon" :size="20" class="pager-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import AoIcon from '@/components/ao-icon/index.vue';
import preIcon from '@/assets/totorial/icon_pre.svg';
import nextIcon from '@/assets/totorial/icon_next.svg';
import type { TutorialChapter } from '../types';

defineOptions({
  name: 'TutorialPager',
});

const props = defineProps<{
  prev?: TutorialChapter;
  next?: TutorialChapter;
}>();

const emit = defineEmits<{
  change: [item: TutorialChapter];
}>();

const handleChange = (item?: TutorialChapter) => {
  if (!item) return;
  emit('change', item);
};
</script>

<style lang="scss" scoped>
.tutorial-pager {
  display: flex;
  gap: 20px;
}

.pager-item {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background-color: var(--ao-color-bg-layout);
  cursor: pointer;
  transition: background-color 0.2s ease;

  &.next {
    justify-content: flex-end;

    .pager-title {
      text-align: right;
    }
  }

  &:not(.disabled):hover {
    background-color: var(--ao-gray-3);

    .pager-title,
    .pager-icon {
      color: var(--ao-color-primary);
    }
  }

  &.disabled {
    cursor: not-allowed;

    .pager-title {
      color: var(--ao-color-text-tertiary);
    }

    .pager-icon {
      color: var(--ao-color-text-disabled);
    }
  }
}

.pager-icon {
  flex: none;
  color: var(--ao-color-text-secondary);
  transition: color 0.2s ease;
}

.pager-title {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  color: var(--ao-color-text-base);
  transition: color 0.2s ease;
}

/* ≤480（小屏）：上一页/下一页上下堆叠，标题可显示更长 */
@media (max-width: 480px) {
  .tutorial-pager {
    flex-direction: column;
    gap: 12px;
  }

  .pager-item {
    padding: 14px 16px;
  }
}
</style>
