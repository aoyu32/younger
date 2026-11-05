<template>
  <div class="website-section" :class="{ 'is-active': active }">
    <div class="section-header">
      <div class="section-title">{{ title }}</div>
    </div>
    <div class="section-body">
      <div class="card-grid" ref="cardGridRef" v-if="displayList.length > 0">
        <div
          class="card-item"
          v-for="(item, index) in displayList"
          :key="item.url"
          @click="handleClick(item)"
        >
          <WebsiteCard
            :icon="item.icon"
            :name="item.name"
            :expand-left="isExpandLeft(index)"
            :url="item.url"
            :collected="isCollected(item)"
            :liked="isLiked(item)"
            :desc="item.desc"
            :view-count="item.views"
            :like-count="item.likes"
            @collect="handleCollect(item)"
            @like="handleLike(item)"
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
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import WebsiteCard from './WebsiteCard.vue';
import useWebsite from '@/view/website/useWebsite';

interface WebsiteItem {
  name: string;
  url: string;
  icon: string;
  desc?: string;
  views?: number;
  likes?: number;
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

const { isCollected, isLiked, toggleCollect, toggleLike } = useWebsite();

const toWebsiteLink = (item: WebsiteItem) => ({
  name: item.name,
  icon: item.icon,
  url: item.url,
});

const handleClick = (item: WebsiteItem) => {
  emit('click', item);
};

/* ---------- 悬浮面板展开方向 ----------
   面板宽约两倍卡宽：只有最后一列向左展开才不会溢出视口，
   其余列（含首列）向右展开都能留在视口内。
   列数随视口变化，用 ResizeObserver 跟踪网格实际列数 */
const cardGridRef = ref<HTMLElement | null>(null);
const gridColumns = ref(0);
let gridObserver: ResizeObserver | null = null;

const isExpandLeft = (index: number) => {
  // 列数未知时退回奇偶交替（保持原行为）
  if (gridColumns.value < 2) return index % 2 === 1;
  return index % gridColumns.value === gridColumns.value - 1;
};

const updateGridColumns = () => {
  const el = cardGridRef.value;
  if (!el) return;
  gridColumns.value = getComputedStyle(el).gridTemplateColumns.split(' ')
    .length;
};

onMounted(() => {
  updateGridColumns();
  if (cardGridRef.value && typeof ResizeObserver !== 'undefined') {
    gridObserver = new ResizeObserver(updateGridColumns);
    gridObserver.observe(cardGridRef.value);
  }
});

onBeforeUnmount(() => {
  gridObserver?.disconnect();
  gridObserver = null;
});

const handleCollect = (item: WebsiteItem) => {
  toggleCollect(toWebsiteLink(item));
};

const handleLike = (item: WebsiteItem) => {
  toggleLike(toWebsiteLink(item));
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
