<template>
  <div class="video-course">
    <div v-if="collectList.length" class="video-course__grid">
      <VideoCollectCard
        v-for="item in collectList"
        :key="item.id"
        :item="item"
        :batch-mode="batchMode"
        :selected="selectedIds.includes(item.id)"
        @cancel="handleCancel"
        @select="handleSelect"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="video-course__empty">
      <img :src="emptyIcon" alt="" />
      <p>没有收藏的视频</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import VideoCollectCard from './VideoCollectCard.vue';
import type { VideoCollectItem } from './VideoCollectCard.vue';
import emptyIcon from '@/assets/website/icon_empty.svg?url';
import { categoryData } from '@/mock/videoLIst';

defineOptions({ name: 'VideoCourse' });

const props = defineProps<{
  /** 批量管理模式：开启后每张卡片右上角展示勾选框 */
  batchMode?: boolean;
}>();

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const formatCollectDate = (ts: number) => {
  const date = new Date(ts);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const collectList = ref<VideoCollectItem[]>(
  categoryData
    .flatMap((category) => category.list)
    .map((video, index) => ({
      id: video.id,
      cover: video.video.cover,
      title: video.title,
      collectDate: formatCollectDate(Date.now() - (index + 1) * MS_PER_DAY),
    })),
);

/** 已勾选的视频 id */
const selectedIds = ref<number[]>([]);

const selectedItems = computed<VideoCollectItem[]>(() =>
  collectList.value.filter((video) => selectedIds.value.includes(video.id)),
);

/** 勾选 / 取消勾选一条记录 */
function handleSelect(item: VideoCollectItem) {
  const index = selectedIds.value.indexOf(item.id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(item.id);
  }
}

/** 退出批量管理时清空勾选 */
watch(
  () => props.batchMode,
  (batchMode) => {
    if (!batchMode) selectedIds.value = [];
  },
);

/** 取消收藏：从列表移除，并同步剔除勾选缓存 */
function handleCancel(item: VideoCollectItem) {
  collectList.value = collectList.value.filter(
    (video) => video.id !== item.id,
  );
  selectedIds.value = selectedIds.value.filter((id) => id !== item.id);
  // TODO: 调用取消收藏接口
}

/** 是否已全选 */
const isAllSelected = computed(
  () =>
    collectList.value.length > 0 &&
    selectedIds.value.length === collectList.value.length,
);

/** 全选 / 取消全选 */
function toggleSelectAll() {
  selectedIds.value = isAllSelected.value
    ? []
    : collectList.value.map((video) => video.id);
}

/** 删除（取消收藏）勾选的视频 */
function deleteSelected() {
  if (!selectedIds.value.length) return;
  collectList.value = collectList.value.filter(
    (video) => !selectedIds.value.includes(video.id),
  );
  selectedIds.value = [];
}

/** 已勾选数量 */
const selectedCount = computed(() => selectedIds.value.length);

defineExpose({
  selectedItems,
  isAllSelected,
  toggleSelectAll,
  selectedCount,
  deleteSelected,
});
</script>

<style scoped lang="scss">
/* 滚动由 UserCenterTabs 的 content-body 滚动条统一处理 */
.video-course {
  display: flex;
  flex-direction: column;
  /* 与历史记录页保持一致 */
  padding: 20px 20px 0;
  box-sizing: border-box;
}

.video-course__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px 15px;
  padding-bottom: 20px;
}

.video-course__empty {
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
