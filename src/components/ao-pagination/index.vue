<template>
  <div class="ao-pagination">
    <!-- 上一页 -->
    <button
      type="button"
      class="ao-pagination__btn ao-pagination__arrow"
      :disabled="isPrevDisabled"
      aria-label="上一页"
      @click="handleChange(safeCurrent - 1)"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M15.5 4.5 9 12l6.5 7.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>

    <button
      v-for="(item, index) in pagerList"
      :key="index"
      type="button"
      class="ao-pagination__btn ao-pagination__page"
      :class="{
        'is-active': item === safeCurrent,
        'is-jumper': item === JUMPER,
      }"
      :disabled="item === JUMPER"
      @click="item !== JUMPER && handleChange(item)"
    >
      <template v-if="item !== JUMPER">{{ item }}</template>
      <span v-else>•••</span>
    </button>

    <button
      type="button"
      class="ao-pagination__btn ao-pagination__arrow"
      :disabled="isNextDisabled"
      aria-label="下一页"
      @click="handleChange(safeCurrent + 1)"
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          d="M8.5 4.5 15 12l-6.5 7.5"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({ name: 'AoPagination' });

interface Props {
  current?: number;
  pageSize?: number;
  total?: number;
}

const props = withDefaults(defineProps<Props>(), {
  current: 1,
  pageSize: 10,
  total: 0,
});

const emit = defineEmits<{
  'update:current': [page: number];
}>();

/** 省略号占位 */
const JUMPER = 'jumper' as const;
type PagerItem = number | typeof JUMPER;

/** 起始段连续展示的页码数 */
const FIRST_BLOCK = 6;
/** 当前页左右各展示的页码数 */
const BUFFER = 2;

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

/** 总页数 */
const pageCount = computed(() =>
  props.pageSize > 0 ? Math.max(0, Math.ceil(props.total / props.pageSize)) : 0,
);

const safeCurrent = computed(() =>
  Math.min(Math.max(1, props.current), pageCount.value || 1),
);

const isPrevDisabled = computed(() => safeCurrent.value <= 1);
const isNextDisabled = computed(() => safeCurrent.value >= pageCount.value);

const pagerList = computed<PagerItem[]>(() => {
  const count = pageCount.value;
  if (count <= FIRST_BLOCK + 2) return range(1, count);

  const current = safeCurrent.value;
  const hasLeft = current - BUFFER > 3;
  const hasRight = current + BUFFER < count - 1;

  if (!hasLeft && hasRight) {
    return [...range(1, FIRST_BLOCK), JUMPER, count];
  }
  if (hasLeft && !hasRight) {
    return [1, JUMPER, ...range(count - FIRST_BLOCK + 1, count)];
  }
  if (hasLeft && hasRight) {
    return [
      1,
      JUMPER,
      ...range(current - BUFFER, current + BUFFER),
      JUMPER,
      count,
    ];
  }
  return range(1, count);
});

function handleChange(page: number) {
  if (page < 1 || page > pageCount.value || page === safeCurrent.value) return;
  emit('update:current', page);
}
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
