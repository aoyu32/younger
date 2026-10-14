<template>
  <div class="profile">
    <div class="user-card-wrapper">
      <UserInfoCard :src="bgUrl" />
    </div>
    <div class="line">
      <AoImage
        src="@/assets/profile/icon_rose_line.svg"
        width="100%"
        height="96px"
      ></AoImage>
    </div>
    <div class="profile-tabs">
      <UserCenterTabs @change="handleChange">
        <!-- 历史记录：头部右侧操作区 -->
        <template #actions="{ activeItem }">
          <template v-if="activeItem?.key === HISTORY_KEY">
            <button
              type="button"
              class="header-action-btn"
              @click="batchMode = !batchMode"
            >
              {{ batchMode ? '完成管理' : '批量管理' }}
            </button>
            <!-- 批量管理模式下：全选 / 删除（隐藏全部清空） -->
            <template v-if="batchMode">
              <button
                type="button"
                class="header-action-btn"
                @click="historyRef?.toggleSelectAll()"
              >
                {{ historyRef?.isAllSelected ? '取消全选' : '全选' }}
              </button>
              <button
                type="button"
                class="header-action-btn"
                :disabled="!historyRef?.selectedCount"
                @click="openDeleteDialog('history')"
              >
                删除
              </button>
            </template>
            <button
              v-else
              type="button"
              class="header-action-btn"
              @click="clearDialogVisible = true"
            >
              全部清空
            </button>
          </template>
          <!-- 我的收藏-视频课程：批量管理 -->
          <template v-else-if="activeItem?.key === VIDEO_COLLECT_KEY">
            <button
              type="button"
              class="header-action-btn"
              @click="collectBatchMode = !collectBatchMode"
            >
              {{ collectBatchMode ? '完成管理' : '批量管理' }}
            </button>
            <!-- 批量管理模式下：全选 / 删除 -->
            <template v-if="collectBatchMode">
              <button
                type="button"
                class="header-action-btn"
                @click="courseRef?.toggleSelectAll()"
              >
                {{ courseRef?.isAllSelected ? '取消全选' : '全选' }}
              </button>
              <button
                type="button"
                class="header-action-btn"
                :disabled="!courseRef?.selectedCount"
                @click="openDeleteDialog('collect')"
              >
                删除
              </button>
            </template>
          </template>
          <!-- 我的收藏-应用APP：批量管理 -->
          <template v-else-if="activeItem?.key === APP_COLLECT_KEY">
            <button
              type="button"
              class="header-action-btn"
              @click="appCollectBatchMode = !appCollectBatchMode"
            >
              {{ appCollectBatchMode ? '完成管理' : '批量管理' }}
            </button>
            <!-- 批量管理模式下：全选 / 删除 -->
            <template v-if="appCollectBatchMode">
              <button
                type="button"
                class="header-action-btn"
                @click="appCollectRef?.toggleSelectAll()"
              >
                {{ appCollectRef?.isAllSelected ? '取消全选' : '全选' }}
              </button>
              <button
                type="button"
                class="header-action-btn"
                :disabled="!appCollectRef?.selectedCount"
                @click="openDeleteDialog('app-collect')"
              >
                删除
              </button>
            </template>
          </template>
          <!-- 我的收藏-网站收藏：批量管理 -->
          <template v-else-if="activeItem?.key === WEBSITE_COLLECT_KEY">
            <button
              type="button"
              class="header-action-btn"
              @click="websiteCollectBatchMode = !websiteCollectBatchMode"
            >
              {{ websiteCollectBatchMode ? '完成管理' : '批量管理' }}
            </button>
            <!-- 批量管理模式下：全选 / 删除 -->
            <template v-if="websiteCollectBatchMode">
              <button
                type="button"
                class="header-action-btn"
                @click="websiteCollectRef?.toggleSelectAll()"
              >
                {{ websiteCollectRef?.isAllSelected ? '取消全选' : '全选' }}
              </button>
              <button
                type="button"
                class="header-action-btn"
                :disabled="!websiteCollectRef?.selectedCount"
                @click="openDeleteDialog('website')"
              >
                删除
              </button>
            </template>
          </template>
          <!-- 我的收藏-帖子收藏（资讯）：批量管理 -->
          <template v-else-if="activeItem?.key === POST_COLLECT_KEY">
            <button
              type="button"
              class="header-action-btn"
              @click="newsCollectBatchMode = !newsCollectBatchMode"
            >
              {{ newsCollectBatchMode ? '完成管理' : '批量管理' }}
            </button>
            <!-- 批量管理模式下：全选 / 删除 -->
            <template v-if="newsCollectBatchMode">
              <button
                type="button"
                class="header-action-btn"
                @click="newsCollectRef?.toggleSelectAll()"
              >
                {{ newsCollectRef?.isAllSelected ? '取消全选' : '全选' }}
              </button>
              <button
                type="button"
                class="header-action-btn"
                :disabled="!newsCollectRef?.selectedCount"
                @click="openDeleteDialog('post')"
              >
                删除
              </button>
            </template>
          </template>
        </template>

        <template #default="{ activeItem }">
          <!-- 历史记录 -->
          <HistoryRecord
            v-if="activeItem?.key === HISTORY_KEY"
            ref="historyRef"
            :batch-mode="batchMode"
          />
          <!-- 我购买的 -->
          <MyPurchases v-else-if="activeItem?.key === PURCHASED_KEY" />
          <!-- 我的收藏-视频课程 -->
          <VideoCourse
            v-else-if="activeItem?.key === VIDEO_COLLECT_KEY"
            ref="courseRef"
            :batch-mode="collectBatchMode"
          />
          <!-- 我的收藏-应用APP -->
          <AppCollect
            v-else-if="activeItem?.key === APP_COLLECT_KEY"
            ref="appCollectRef"
            :batch-mode="appCollectBatchMode"
          />
          <!-- 我的收藏-网站收藏 -->
          <WebsiteCollect
            v-else-if="activeItem?.key === WEBSITE_COLLECT_KEY"
            ref="websiteCollectRef"
            :batch-mode="websiteCollectBatchMode"
          />
          <!-- 我的收藏-帖子收藏（挂资讯收藏内容） -->
          <NewsCollect
            v-else-if="activeItem?.key === POST_COLLECT_KEY"
            ref="newsCollectRef"
            :batch-mode="newsCollectBatchMode"
          />
          <div v-else class="tab-content">
            <h3 class="tab-title">{{ activeItem?.title }}</h3>
          </div>
        </template>
      </UserCenterTabs>

      <!-- 清空历史记录二次确认 -->
      <AoDialog
        v-model="clearDialogVisible"
        title="清空观看记录"
        confirm-text="清空"
        @confirm="handleClearHistory"
      >
        确定要清空全部观看记录吗？清空后不可恢复。
      </AoDialog>

      <!-- 批量删除选中项二次确认（历史记录 / 收藏视频共用） -->
      <AoDialog
        v-model="deleteDialogVisible"
        :title="deleteTarget === 'history' ? '删除观看记录' : '取消收藏'"
        confirm-text="删除"
        @confirm="handleConfirmDelete"
      >
        {{ deleteConfirmText }}
      </AoDialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import UserInfoCard from './components/UserInfoCard.vue';
import UserCenterTabs from './components/UserCenterTabs.vue';
import HistoryRecord from './components/history-record/HistoryRecord.vue';
import MyPurchases from './components/my-purchases/MyPurchases.vue';
import VideoCourse from './components/video-course/VideoCourse.vue';
import AppCollect from './components/app-collect/AppCollect.vue';
import WebsiteCollect from './components/website-collect/WebsiteCollect.vue';
import NewsCollect from './components/news-collect/NewsCollect.vue';
import AoDialog from '@/components/ao-dialog/index.vue';
import bgUrl from '@/assets/green-rose-flower.jpg';

/** 历史记录菜单 key：命中后内容区渲染 HistoryRecord */
const HISTORY_KEY = 'course-watching';
/** 「我购买的」菜单 key：命中后内容区渲染 MyPurchases */
const PURCHASED_KEY = 'course-purchased';
/** 「我的收藏-视频课程」菜单 key：命中后内容区渲染 VideoCourse */
const VIDEO_COLLECT_KEY = 'collect-video';
/** 「我的收藏-应用APP」菜单 key：命中后内容区渲染 AppCollect */
const APP_COLLECT_KEY = 'collect-app';
/** 「我的收藏-网站收藏」菜单 key：命中后内容区渲染 WebsiteCollect */
const WEBSITE_COLLECT_KEY = 'collect-website';
/** 「我的收藏-帖子收藏」菜单 key：命中后内容区渲染 NewsCollect */
const POST_COLLECT_KEY = 'collect-post';

/** 批量管理模式：开启后历史卡片右上角展示勾选框 */
const batchMode = ref(false);

/** 收藏视频批量管理模式：开启后收藏卡片右上角展示勾选框 */
const collectBatchMode = ref(false);

/** 收藏应用批量管理模式：开启后应用卡片操作区显示复选框 */
const appCollectBatchMode = ref(false);

/** 收藏网站批量管理模式：开启后网站卡片右上角显示勾选框 */
const websiteCollectBatchMode = ref(false);

/** 收藏资讯批量管理模式：开启后资讯卡片右侧显示复选框 */
const newsCollectBatchMode = ref(false);

/** 清空二次确认弹窗 */
const clearDialogVisible = ref(false);

/** 批量删除目标：history 历史记录 / collect 收藏视频 / app-collect 收藏应用 / website 收藏网站 / post 收藏资讯 */
const deleteTarget = ref<
  'history' | 'collect' | 'app-collect' | 'website' | 'post' | null
>(null);

const deleteDialogVisible = computed({
  get: () => deleteTarget.value !== null,
  set: (visible) => {
    if (!visible) deleteTarget.value = null;
  },
});

/** 待删除数量 */
const deleteCount = computed(() => {
  if (deleteTarget.value === 'history') {
    return historyRef.value?.selectedCount ?? 0;
  }
  if (deleteTarget.value === 'collect') {
    return courseRef.value?.selectedCount ?? 0;
  }
  if (deleteTarget.value === 'app-collect') {
    return appCollectRef.value?.selectedCount ?? 0;
  }
  if (deleteTarget.value === 'website') {
    return websiteCollectRef.value?.selectedCount ?? 0;
  }
  if (deleteTarget.value === 'post') {
    return newsCollectRef.value?.selectedCount ?? 0;
  }
  return 0;
});

/** 删除确认弹窗中各收藏类型的名称 */
const DELETE_LABELS: Record<string, string> = {
  collect: '视频',
  'app-collect': '应用',
  website: '网站',
  post: '资讯',
};

/** 删除确认文案 */
const deleteConfirmText = computed(() => {
  if (deleteTarget.value === 'history') {
    return `确定要删除选中的 ${deleteCount.value} 条观看记录吗？删除后不可恢复。`;
  }
  const label = DELETE_LABELS[deleteTarget.value ?? ''] ?? '内容';
  return `确定要取消收藏选中的 ${deleteCount.value} 个${label}吗？取消后不可恢复。`;
});

/** 打开删除确认弹窗 */
function openDeleteDialog(
  target: 'history' | 'collect' | 'app-collect' | 'website' | 'post',
) {
  deleteTarget.value = target;
}

const historyRef = ref<InstanceType<typeof HistoryRecord>>();

const courseRef = ref<InstanceType<typeof VideoCourse>>();

const appCollectRef = ref<InstanceType<typeof AppCollect>>();

const websiteCollectRef = ref<InstanceType<typeof WebsiteCollect>>();

const newsCollectRef = ref<InstanceType<typeof NewsCollect>>();

const handleChange = (item: { key: string; title: string }) => {
  // 离开对应菜单时退出批量管理
  if (item.key !== HISTORY_KEY) batchMode.value = false;
  if (item.key !== VIDEO_COLLECT_KEY) collectBatchMode.value = false;
  if (item.key !== APP_COLLECT_KEY) appCollectBatchMode.value = false;
  if (item.key !== WEBSITE_COLLECT_KEY) websiteCollectBatchMode.value = false;
  if (item.key !== POST_COLLECT_KEY) newsCollectBatchMode.value = false;
  // 关闭可能打开的删除确认弹窗
  deleteTarget.value = null;
  console.log('当前选中：', item.title);
};

/** 确认清空全部历史记录 */
function handleClearHistory() {
  historyRef.value?.clearAll();
  clearDialogVisible.value = false;
  batchMode.value = false;
}

/** 确认删除选中项 */
function handleConfirmDelete() {
  if (deleteTarget.value === 'history') historyRef.value?.deleteSelected();
  if (deleteTarget.value === 'collect') courseRef.value?.deleteSelected();
  if (deleteTarget.value === 'app-collect') {
    appCollectRef.value?.deleteSelected();
  }
  if (deleteTarget.value === 'website') {
    websiteCollectRef.value?.deleteSelected();
  }
  if (deleteTarget.value === 'post') newsCollectRef.value?.deleteSelected();
  deleteTarget.value = null;
}
</script>

<style scoped lang="scss">
@use './index.scss' as *;

/* tabs 头部文本按钮（批量管理 / 全部清空） */
.header-action-btn {
  padding: 0;
  border: none;
  background: none;
  font-size: var(--ao-font-size-sm);
  color: var(--ao-color-text-secondary);
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--ao-duration-fast) var(--ao-ease-in-out);

  &:hover:not(:disabled) {
    color: var(--ao-color-primary);
  }

  /* 无勾选项时禁用（如「删除」） */
  &:disabled {
    cursor: not-allowed;
    color: var(--ao-color-text-disabled);

    &:hover {
      color: var(--ao-color-text-disabled);
    }
  }
}
</style>
