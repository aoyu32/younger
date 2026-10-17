<template>
  <div class="hot-course-list">
    <div class="card-header">
      <div class="header-wrapper">
        <h3>{{ label }}</h3>
        <span class="sub-label">{{ subLabel }}</span>
      </div>
    </div>

    <div class="list-wrapper">
      <ao-scrollbar v-if="list.length > 0" height="100%">
        <div class="course-list">
          <div
            class="course-item"
            v-for="item in list"
            :key="item.id"
            @click="handleItemClick(item.id)"
          >
            <div class="course-image" v-if="item.image">
              <img :src="item.image" alt="课程封面" />
            </div>
            <div class="course-image" v-else>
              <div class="image-placeholder">📚</div>
            </div>

            <div class="info-wrapper">
              <div class="course-name">{{ item.name }}</div>
              <div class="course-desc">{{ item.desc }}</div>
            </div>

            <div class="studing-count">
              {{ formatCount(item.studingCount) }} 人学习
            </div>
          </div>
        </div>
      </ao-scrollbar>

      <div v-else class="empty-state">暂无课程，敬请期待</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'HotCourseList',
});

const props = defineProps<{
  label: string;
  subLabel: string;
  list: Array<{
    id: string | number;
    name: string;
    desc?: string;
    image?: string;
    studingCount: number;
  }>;
}>();

const emit = defineEmits<{
  (event: 'click', id: string | number): void;
}>();

const formatCount = (count: number) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + 'w';
  }
  return count.toString();
};

const handleItemClick = (id: string | number) => {
  emit('click', id);
};
</script>

<style scoped lang="scss">
.hot-course-list {
  background: var(--ao-color-bg-container);
  border-radius: var(--ao-border-radius-xl);
  overflow: hidden;
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  height: 100%;

  .card-header {
    padding: 15px 15px 0 15px;
    .header-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: var(--ao-spacing-xs);
      border-bottom: 1px solid var(--ao-color-border);
      flex-shrink: 0;
    }

    h3 {
      margin: 0;
      font-size: var(--ao-font-size-base);
      font-weight: var(--ao-font-weight-semibold);
      color: var(--ao-color-text-base);
      position: relative;
    }

    .sub-label {
      font-size: var(--ao-font-size-sm);
      color: var(--ao-color-text-tertiary);
      white-space: nowrap;
    }
  }

  .list-wrapper {
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }

  .course-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-right: 8px;
    padding: 15px;


    .course-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border: var(--ao-border-width-thin) solid var(--ao-color-border);
      border-radius: var(--ao-border-radius-sm);
      cursor: pointer;
      transition: all var(--ao-duration-fast) var(--ao-ease-out);
      flex-shrink: 0;

      &:hover {
        border-color: var(--ao-color-primary);
        background-color: color-mix(in srgb, var(--ao-gray-4) 15%, transparent);

        .course-name,
        .studing-count {
          color: var(--ao-color-text-base);
        }
      }

      .course-image {
        flex-shrink: 0;
        width: 56px;
        height: 56px;
        border-radius: var(--ao-border-radius-sm);
        overflow: hidden;
        background: var(--ao-gray-4);

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: var(--ao-gray-6);
        }
      }

      .info-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-width: 0;
        gap: 4px;

        .course-name {
          font-size: 15px;
          font-weight: var(--ao-font-weight-medium);
          color: var(--ao-color-text-base);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .course-desc {
          font-size: 13px;
          color: var(--ao-color-text-tertiary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .studing-count {
        flex-shrink: 0;
        font-size: var(--ao-font-size-xs);
        color: var(--ao-color-text-tertiary);
        font-weight: var(--ao-font-weight-medium);
        white-space: nowrap;
        margin-left: 8px;
      }
    }
  }

  .empty-state {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--ao-font-size-md);
    color: var(--ao-color-text-tertiary);
  }
}
</style>
