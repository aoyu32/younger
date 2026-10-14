<template>
  <div class="news-collect">
    <div v-if="collectList.length" class="news-collect__grid">
      <NewsCollectCard
        v-for="item in collectList"
        :key="item.id"
        :item="item"
        :batch-mode="batchMode"
        :selected="selectedIds.includes(item.id)"
        @click="handleClick"
        @cancel="handleCancel"
        @select="handleSelect"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="news-collect__empty">
      <img :src="emptyIcon" alt="" />
      <p>没有收藏的资讯</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import NewsCollectCard, {
  type NewsCollectItem,
} from './NewsCollectCard.vue';
import emptyIcon from '@/assets/website/icon_empty.svg?url';
import { newsData } from '@/mock/news';

defineOptions({ name: 'NewsCollect' });

const props = defineProps<{
  /** 批量管理模式：开启后卡片右侧显示复选框 */
  batchMode?: boolean;
}>();

const DAY = 24 * 60 * 60 * 1000;

/** 收藏日期：与收藏视频页一致，展示为「X月X日」 */
const formatCollectDate = (ts: number) => {
  const date = new Date(ts);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/** mock 正文是长 markdown，剥掉常见符号截断成两行摘要 */
const toSummary = (raw: string) =>
  raw
    .replace(/[#*`>\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);

/** 收藏列表：取资讯 mock，按收藏时间倒序（近的在前） */
const collectList = ref<NewsCollectItem[]>(
  newsData.map((news, index) => ({
    id: news.id,
    title: news.title,
    cover: news.cover,
    content: toSummary(news.content),
    collectDate: formatCollectDate(Date.now() - (index + 1) * DAY),
  })),
);

/* ============================================================
   批量管理：勾选状态
   ============================================================ */
/** 已勾选的资讯 id */
const selectedIds = ref<(string | number)[]>([]);

/** 已勾选的资讯 */
const selectedItems = computed<NewsCollectItem[]>(() =>
  collectList.value.filter((news) => selectedIds.value.includes(news.id)),
);

/** 已勾选数量 */
const selectedCount = computed(() => selectedIds.value.length);

/** 是否已全选 */
const isAllSelected = computed(
  () =>
    collectList.value.length > 0 &&
    selectedIds.value.length === collectList.value.length,
);

/** 勾选 / 取消勾选一条记录 */
function handleSelect(item: NewsCollectItem) {
  const index = selectedIds.value.indexOf(item.id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(item.id);
  }
}

/** 全选 / 取消全选 */
function toggleSelectAll() {
  selectedIds.value = isAllSelected.value
    ? []
    : collectList.value.map((news) => news.id);
}

/** 退出批量管理时清空勾选 */
watch(
  () => props.batchMode,
  (batchMode) => {
    if (!batchMode) selectedIds.value = [];
  },
);

/** 删除（取消收藏）勾选的资讯 */
function deleteSelected() {
  if (!selectedIds.value.length) return;
  collectList.value = collectList.value.filter(
    (news) => !selectedIds.value.includes(news.id),
  );
  selectedIds.value = [];
}

/* ============================================================
   单卡操作
   ============================================================ */
/** 取消收藏：从列表移除 */
function handleCancel(item: NewsCollectItem) {
  collectList.value = collectList.value.filter(
    (news) => news.id !== item.id,
  );
  // TODO: 调用取消收藏接口
}

/** 点击卡片：新标签页打开资讯详情 */
function handleClick(id: string | number) {
  window.open(`/news/${id}`, '_blank');
}

defineExpose({
  selectedItems,
  selectedCount,
  isAllSelected,
  toggleSelectAll,
  deleteSelected,
});
</script>

<style scoped lang="scss">
/* 滚动由 UserCenterTabs 的 content-body 滚动条统一处理 */
.news-collect {
  display: flex;
  flex-direction: column;
  /* 与历史记录页保持一致 */
  padding: 20px 20px 0;
  box-sizing: border-box;
}

/* 一行两列，行高与资讯页卡片网格一致 */
.news-collect__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  grid-auto-rows: 106px;
  padding-bottom: 20px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
}

/* 空状态：外层滚动容器（.ao-scrollbar）带有定位上下文，
   绝对定位铺满内容区，图标与文案整体居中 */
.news-collect__empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--ao-spacing-md);
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-tertiary);

  img {
    width: 64px;
    height: 64px;
  }

  p {
    margin: 0;
  }
}
</style>
