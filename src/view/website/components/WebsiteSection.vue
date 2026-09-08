<template>
  <div class="website-section" :class="{ 'is-active': active }">
    <div class="section-header">
      <div class="section-title">{{ title }}</div>
    </div>
    <div class="section-body">
      <div class="card-grid" v-if="displayList.length > 0">
        <div
          class="card-item"
          v-for="(item, index) in displayList"
          :key="item.url"
          @click="handleClick(item)"
        >
          <WebsiteCard
            :icon="item.icon"
            :name="item.name"
            :expand-left="index % 2 === 1"
            :url="item.url"
            desc="这是一个很厉害的网站，你一定要点进去看"
            :view-count="100"
            :like-count="1000"
          />
        </div>
      </div>
      <div class="empty" v-else>
        <p>暂无内容</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import WebsiteCard from './WebsiteCard.vue';

interface WebsiteItem {
  name: string;
  url: string;
  icon: string;
  desc?: string;
}

interface Props {
  title?: string;
  list?: WebsiteItem[];
  limit?: number;
  shuffle?: boolean;
  active?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: '分类标题',
  list: () => [],
  limit: 8,
  shuffle: true,
  active: false,
});

const displayList = computed(() => {
  let result = [...props.list];
  if (props.shuffle) {
    result = result.sort(() => Math.random() - 0.5);
  }
  if (props.limit > 0) {
    result = result.slice(0, props.limit);
  }
  return result;
});

const emit = defineEmits<{
  click: [item: WebsiteItem];
}>();

const handleClick = (item: WebsiteItem) => {
  emit('click', item);
};
</script>

<style scoped lang="scss">
.website-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: var(--ao-shadow-sm);
  border-radius: var(--ao-border-radius-lg);
}

.section-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ao-spacing-sm) var(--ao-spacing-md);
  background-color: var(--ao-gray-2);
  border-top-left-radius: var(--ao-border-radius-lg);
  border-top-right-radius: var(--ao-border-radius-lg);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--ao-font-size-base);
  font-weight: var(--ao-font-weight-semibold);
  line-height: var(--ao-line-height-tight);
  color: var(--ao-color-text-base);

  &::before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--ao-gray-4);
    transition: background 0.3s var(--ao-ease-in-out);
  }
}

/* 激活：先扩散一圈光晕（发光一次），动画结束后保留轻微光晕常亮 */
.website-section.is-active .section-title::before {
  background: var(--ao-color-primary);
  box-shadow: 0 0 6px
    color-mix(in srgb, var(--ao-color-primary) 55%, transparent);
  animation: section-dot-glow 0.7s ease-out;
}

@keyframes section-dot-glow {
  0% {
    box-shadow: 0 0 0 0
      color-mix(in srgb, var(--ao-color-primary) 45%, transparent);
    transform: scale(1);
  }
  60% {
    transform: scale(1.8);
  }
  100% {
    box-shadow: 0 0 0 12px transparent;
    transform: scale(1);
  }
}

.section-body {
  flex: 1;
  min-height: 0;
  padding: var(--ao-spacing-md);
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 16px;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120px;
  color: var(--ao-gray-6);
}
</style>
