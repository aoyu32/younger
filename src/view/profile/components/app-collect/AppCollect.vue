<template>
  <div class="app-collect">
    <div v-if="collectList.length" class="app-collect__grid">
      <ApplicationCard
        v-for="item in collectList"
        :key="item.id"
        :app="item"
        :actions-visible="batchMode"
        @collect="handleCollect"
        @download="handleDownload"
        @share="handleShare"
      >
        <!-- 批量管理：用复选框整体替换默认的三个圆点按钮 -->
        <template v-if="batchMode" #default>
          <button
            type="button"
            class="collect-check"
            :class="{ 'is-checked': selectedIds.includes(item.id) }"
            :aria-label="selectedIds.includes(item.id) ? '取消勾选' : '勾选'"
            @click.stop="handleSelect(item)"
          >
            <img :src="checkIcon" alt="" />
          </button>
        </template>
      </ApplicationCard>
    </div>

    <!-- 空状态 -->
    <div v-else class="app-collect__empty">
      <img :src="emptyIcon" alt="" />
      <p>没有收藏的应用</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import ApplicationCard from '@/view/app/components/ApplicationCard.vue';
import emptyIcon from '@/assets/website/icon_empty.svg?url';
import checkIcon from '@/assets/profile/icon_check.svg?url';
import { appData } from '@/mock/appData';

defineOptions({ name: 'AppCollect' });

const props = defineProps<{
  /** 批量管理模式：开启后卡片操作区显示复选框 */
  batchMode?: boolean;
}>();

interface CollectApp {
  id: number;
  name: string;
  description: string;
  category: string;
  size: number;
  icon?: string;
}

/** 收藏列表：mock 的 size 单位为字节，卡片按 MB 展示，需先换算 */
const collectList = ref<CollectApp[]>(
  appData.map((app) => ({
    ...app,
    size: Math.floor(app.size / 1024 / 1024),
  })),
);

/* ============================================================
   批量管理：勾选状态
   ============================================================ */
/** 已勾选的应用 id */
const selectedIds = ref<number[]>([]);

/** 已勾选的应用 */
const selectedItems = computed<CollectApp[]>(() =>
  collectList.value.filter((app) => selectedIds.value.includes(app.id)),
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
function handleSelect(app: CollectApp) {
  const index = selectedIds.value.indexOf(app.id);
  if (index > -1) {
    selectedIds.value.splice(index, 1);
  } else {
    selectedIds.value.push(app.id);
  }
}

/** 全选 / 取消全选 */
function toggleSelectAll() {
  selectedIds.value = isAllSelected.value
    ? []
    : collectList.value.map((app) => app.id);
}

/** 退出批量管理时清空勾选 */
watch(
  () => props.batchMode,
  (batchMode) => {
    if (!batchMode) selectedIds.value = [];
  },
);

/** 删除（取消收藏）勾选的应用 */
function deleteSelected() {
  if (!selectedIds.value.length) return;
  collectList.value = collectList.value.filter(
    (app) => !selectedIds.value.includes(app.id),
  );
  selectedIds.value = [];
}

/* ============================================================
   单卡操作
   ============================================================ */
/** 取消收藏（再次点亮黄色圆点即为取消）：从列表移除 */
function handleCollect(app: CollectApp, collected: boolean) {
  if (collected) return;
  collectList.value = collectList.value.filter((item) => item.id !== app.id);
  // TODO: 调用取消收藏接口
}

/** 下载 / 分享：暂仅占位，后续对接具体能力 */
function handleDownload(app: CollectApp) {
  console.log('下载应用：', app.name);
}

function handleShare(app: CollectApp) {
  console.log('分享应用：', app.name);
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
.app-collect {
  display: flex;
  flex-direction: column;
  /* 与历史记录页保持一致 */
  padding: 20px;
  box-sizing: border-box;
}

.app-collect__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px 15px;
  padding-bottom: 20px;

  /* 移动端：卡片至少两列 */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 批量管理复选框：替换默认操作区后的选中控件 */
.collect-check {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 22px;
  height: 22px;
  padding: 0;
  border: var(--ao-border-width-thin) solid var(--ao-gray-5);
  border-radius: var(--ao-border-radius-sm);
  background-color: var(--ao-gray-0);
  cursor: pointer;
  transition:
    background-color var(--ao-duration-fast) var(--ao-ease-in-out),
    border-color var(--ao-duration-fast) var(--ao-ease-in-out);

  img {
    width: 14px;
    height: 14px;
    opacity: 0;
    transition: opacity var(--ao-duration-fast) var(--ao-ease-in-out);
  }

  &.is-checked {
    border-color: var(--ao-color-primary);
    background-color: var(--ao-color-primary);

    img {
      opacity: 1;
    }
  }
}

/* 空状态：外层滚动容器（.ao-scrollbar）带有定位上下文，
   绝对定位铺满内容区，图标与文案整体居中 */
.app-collect__empty {
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
