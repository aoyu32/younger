<template>
  <div class="related-courses">
    <RouterLink
      v-for="course in courses"
      :key="course.id"
      class="related-courses__item"
      :to="`/video/${course.id}`"
    >
      <VipVideoCard :data="course" />
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VipVideoCard from '@/view/home/components/VipVideoCard.vue';
import { videoData } from '@/mock/videoData';

defineOptions({ name: 'AppRelatedCourses' });

/** 相关课程：复用首页精品课程卡片，取付费课程 */
const courses = computed(() =>
  videoData.filter((item) => 'isPaid' in item && item.isPaid).slice(0, 4),
);
</script>

<style scoped lang="scss">
.related-courses {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ao-spacing-md);

  &__item {
    display: block;
    color: inherit;
    text-decoration: none;
  }
}

@media (max-width: 992px) {
  .related-courses {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .related-courses {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
