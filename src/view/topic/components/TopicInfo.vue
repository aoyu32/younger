<template>
  <div class="topic-info">
    <div class="info-main">
      <h2 class="info-title">{{ title }}</h2>
      <div class="info-meta">
        <span class="info-date">{{ date }}</span>
        <div v-if="tags.length" class="topic-tags">
          <span v-for="tag in tags" :key="tag" class="topic-tag"
            >#{{ tag }}</span
          >
        </div>
      </div>
    </div>
    <div class="info-join">{{ participants }} 人正在参与讨论</div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'TopicInfo',
});

withDefaults(
  defineProps<{
    title: string;
    date: string;
    tags: string[];
    participants: number;
  }>(),
  {
    title: '',
    date: '',
    tags: () => [],
    participants: 0,
  },
);
</script>

<style lang="scss" scoped>
.topic-info {
  display: flex;
  flex: none;
  align-items: center;
  gap: 20px;
  padding: 14px 20px 16px;
  background-color: var(--ao-gray-3);
}

.info-main {
  flex: 1;
  min-width: 0;
}

.info-title {
  display: -webkit-box;
  max-width: 75%;
  margin: 0;
  overflow: hidden;
  font-size: 17px;
  font-weight: var(--ao-font-weight-semibold);
  line-height: 1.6;
  color: var(--ao-color-text-base);
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.info-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ao-spacing-sm);
  margin-top: var(--ao-spacing-xs);
}

.info-date {
  font-size: 14px;
  color: var(--ao-color-text-tertiary);
}

.topic-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--ao-spacing-xs);
}

.topic-tag {
  font-size: 14px;
  color: var(--ao-color-text-tertiary);
}

.info-join {
  flex: none;
  font-size: 14px;
  color: var(--ao-color-text-tertiary);
  white-space: nowrap;
}

/* ≤768（移动端）：内边距与间距收紧 */
@media (max-width: 768px) {
  .topic-info {
    gap: 12px;
    padding: 12px 14px 14px;
  }
}

/* ≤480（小屏）：参与人数放不下时换到标题下方 */
@media (max-width: 480px) {
  .topic-info {
    flex-wrap: wrap;

    .info-title {
      max-width: 100%;
    }
  }
}
</style>
