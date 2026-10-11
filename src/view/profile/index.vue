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
            <button
              type="button"
              class="header-action-btn"
              @click="clearDialogVisible = true"
            >
              全部清空
            </button>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UserInfoCard from './components/UserInfoCard.vue';
import UserCenterTabs from './components/UserCenterTabs.vue';
import HistoryRecord from './components/history-record/HistoryRecord.vue';
import MyPurchases from './my-purchases/MyPurchases.vue';
import AoDialog from '@/components/ao-dialog/index.vue';
import bgUrl from '@/assets/green-rose-flower.jpg';

/** 历史记录菜单 key：命中后内容区渲染 HistoryRecord */
const HISTORY_KEY = 'course-watching';
/** 「我购买的」菜单 key：命中后内容区渲染 MyPurchases */
const PURCHASED_KEY = 'course-purchased';

/** 批量管理模式：开启后历史卡片右上角展示勾选框 */
const batchMode = ref(false);

/** 清空二次确认弹窗 */
const clearDialogVisible = ref(false);

const historyRef = ref<InstanceType<typeof HistoryRecord>>();

const handleChange = (item: { key: string; title: string }) => {
  // 离开历史记录菜单时退出批量管理
  if (item.key !== HISTORY_KEY) batchMode.value = false;
  console.log('当前选中：', item.title);
};

/** 确认清空全部历史记录 */
function handleClearHistory() {
  historyRef.value?.clearAll();
  clearDialogVisible.value = false;
  batchMode.value = false;
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

  &:hover {
    color: var(--ao-color-primary);
  }
}
</style>
