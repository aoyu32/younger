<template>
  <div class="tutorial-courses">
    <div class="courses-header">
      <div class="title">其他课程</div>
    </div>
    <div class="course-list">
      <div v-for="course in courses" :key="course.id" class="course-item">
        <span class="course-name">{{ course.title }}</span>
        <span class="course-count"
          >{{ formatCount(course.learners) }}人学习</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCount } from '@/utils/format';
import type { TutorialCourse } from '../types';

defineOptions({
  name: 'TutorialCourses',
});

withDefaults(
  defineProps<{
    courses: TutorialCourse[];
  }>(),
  {
    courses: () => [],
  },
);
</script>

<style lang="scss" scoped>
.tutorial-courses {
  flex: none;
  background-color: var(--ao-color-bg-layout);
}

.courses-header {
  flex: none;
  padding: 14px 16px;
  background-color: var(--ao-gray-3);
  border-bottom: 1px solid var(--ao-gray-4);

  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 24px;
    color: var(--ao-color-text-base);
  }
}

.course-list {
  display: flex;
  flex-direction: column;
  padding: 4px 20px 20px;
}

.course-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ao-spacing-sm);
  padding: var(--ao-spacing-sm) 0;
  border-bottom: var(--ao-border-width-thin) solid #cacaca49;
  cursor: pointer;
  &:last-child {
    border-bottom: none;
  }

  &:hover .course-name {
    color: var(--ao-color-primary);
  }
}

.course-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13.5px;
  font-weight: var(--ao-font-weight-medium);
  line-height: var(--ao-line-height-base);
  color: #222;
  transition: color var(--ao-duration-fast) ease;
}

.course-count {
  flex: none;
  font-size: var(--ao-font-size-xs);
  color: #999;
}
</style>
