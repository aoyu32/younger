<template>
  <div class="ao-page">
    <div class="controls">
      <slot
        name="controls"
        :isPrev="isPreDisabled"
        :isNext="isNextDisabled"
        :change="handlePageChange"
      ></slot>
    </div>
    <div class="page-wrapper" ref="pageWrapperRef">
      <slot :isPrev="isPreDisabled" :isNext="isNextDisabled"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import gsap from 'gsap';

defineOptions({ name: 'AoPage' });

const props = defineProps({
  current: {
    type: Number,
    default: 1,
  },
  size: { type: Number, default: 10 },
  total: { type: Number, default: 0 },
});

const emit = defineEmits(['update:current']);

const pageWrapperRef = ref<HTMLElement | null>(null);

// 当前页码
const currentPage = computed(() => props.current);

// 总页数
const totalPages = computed(() => Math.ceil(props.total / props.size));

// 按钮禁用状态
const isPreDisabled = computed(() => currentPage.value <= 1);
const isNextDisabled = computed(() => currentPage.value >= totalPages.value);

const handlePageChange = (dir: 'pre' | 'next') => {
  const grid = pageWrapperRef.value;
  if (!grid) return;

  let newPage = currentPage.value;
  if (dir === 'pre' && !isPreDisabled.value) newPage--;
  else if (dir === 'next' && !isNextDisabled.value) newPage++;
  else return;

  // 更新父组件数据
  emit('update:current', newPage);

  const distance = grid.offsetWidth;
  const direction = dir === 'next' ? -1 : 1;
  gsap
    .timeline()
    .to(grid, { x: distance * direction, duration: 0.15 })
    .set(grid, { x: -direction * distance })
    .to(grid, { x: 0, duration: 0.15 });
};

defineExpose({ handlePageChange, isNextDisabled, isPreDisabled });
</script>

<style scoped lang="scss">
.ao-page {
  width: 100%;
  height: 100%;
}

.page-wrapper {
  width: 100%;
  height: 100%;
}
</style>
