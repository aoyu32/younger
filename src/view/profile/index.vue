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
      <UserCenterTabs ref="tabsRef" @change="handleChange">
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
          <!-- 个人信息-我的资料：查看态显示「编辑资料」，编辑态显示「取消 / 保存」 -->
          <template v-else-if="activeItem?.key === PROFILE_KEY">
            <template v-if="profileRef?.editing">
              <button
                type="button"
                class="header-action-btn"
                @click="profileRef?.cancelEdit()"
              >
                取消
              </button>
              <button
                type="button"
                class="header-action-btn header-action-btn--primary"
                :disabled="profileRef?.submitting || profileRef?.uploading"
                @click="profileRef?.save()"
              >
                {{ profileRef?.submitting ? '保存中...' : '保存' }}
              </button>
            </template>
            <button
              v-else
              type="button"
              class="header-action-btn"
              @click="profileRef?.startEdit()"
            >
              编辑资料
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
          <!-- 我的订单-会员开通 -->
          <VipOrder v-else-if="activeItem?.key === ORDER_VIP_KEY" />
          <!-- 我的订单-购买课程 -->
          <CourseOrder v-else-if="activeItem?.key === ORDER_COURSE_KEY" />
          <!-- 个人信息-我的资料 -->
          <ProfileInfo
            v-else-if="activeItem?.key === PROFILE_KEY"
            ref="profileRef"
          />
          <!-- 账号安全-账号信息 -->
          <AccountInfo v-else-if="activeItem?.key === SECURITY_INFO_KEY" />
          <!-- 账号安全-修改密码 -->
          <ModifyPassword
            v-else-if="activeItem?.key === SECURITY_PASSWORD_KEY"
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

    <!-- 移动端顶部常驻的吸顶分类栏（带二级菜单），页面卡片已预留其高度 -->
    <AoStickyTabs
      v-model="stickyActiveKey"
      :items="stickyItems"
      mobile-only
      always-visible
      @update:model-value="handleStickySelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserInfoCard from './components/UserInfoCard.vue';
import UserCenterTabs from './components/UserCenterTabs.vue';
import HistoryRecord from './components/history-record/HistoryRecord.vue';
import MyPurchases from './components/my-purchases/MyPurchases.vue';
import VideoCourse from './components/video-course/VideoCourse.vue';
import AppCollect from './components/app-collect/AppCollect.vue';
import WebsiteCollect from './components/website-collect/WebsiteCollect.vue';
import NewsCollect from './components/news-collect/NewsCollect.vue';
import VipOrder from './components/vip-order/VipOrder.vue';
import CourseOrder from './components/course-order/CourseOrder.vue';
import ProfileInfo from './components/profile-info/ProfileInfo.vue';
import AccountInfo from './components/account-info/AccountInfo.vue';
import ModifyPassword from './components/modify-password/ModifyPassword.vue';
import AoDialog from '@/components/ao-dialog/index.vue';
import AoStickyTabs from '@/components/ao-sticky-tabs/index.vue';
import { profileNavGroups } from './components/profile-nav';
import bgUrl from '@/assets/green-rose-flower.jpg';

const route = useRoute();
const router = useRouter();

/** 左侧导航实例：外部跳转（如头部用户下拉的 ?tab=xxx）时需要主动激活某个菜单项 */
const tabsRef = ref<InstanceType<typeof UserCenterTabs>>();

/** 吸顶分类栏：移动端常驻在头部下方，与侧边导航共用同一份导航数据 */
const stickyItems = profileNavGroups.map((group) => ({
  id: group.key,
  label: group.title,
  children: group.children?.map((child) => ({
    id: child.key,
    label: child.title,
  })),
}));

/** 吸顶栏当前选中项，与侧边栏保持同步 */
const stickyActiveKey = ref('course-watching');

const handleStickySelect = (id: string | number) => {
  tabsRef.value?.setActive(String(id));
};

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
/** 「我的订单-会员开通」菜单 key：命中后内容区渲染 VipOrder */
const ORDER_VIP_KEY = 'order-vip';
/** 「我的订单-购买课程」菜单 key：命中后内容区渲染 CourseOrder */
const ORDER_COURSE_KEY = 'order-course';
/** 「个人信息-我的资料」菜单 key：命中后内容区渲染 ProfileInfo */
const PROFILE_KEY = 'profile';
/** 「账号安全-账号信息」菜单 key：命中后内容区渲染 AccountInfo */
const SECURITY_INFO_KEY = 'security-info';
/** 「账号安全-修改密码」菜单 key：命中后内容区渲染 ModifyPassword */
const SECURITY_PASSWORD_KEY = 'security-password';

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

const profileRef = ref<InstanceType<typeof ProfileInfo>>();

/**
 * 应用地址栏 ?tab=xxx 指定的菜单项（头部用户下拉跳转时带过来）
 * 应用后清掉参数：地址栏不残留，也保证再次点击同一项仍能触发
 */
function applyTabFromQuery() {
  const tab = route.query.tab;
  if (typeof tab !== 'string' || !tab) return;
  tabsRef.value?.setActive(tab);
  const query = { ...route.query };
  delete query.tab;
  router.replace({ query });
}

onMounted(applyTabFromQuery);
watch(() => route.query.tab, applyTabFromQuery);

const handleChange = (item: { key: string; title: string }) => {
  // 同步吸顶分类栏的高亮
  stickyActiveKey.value = item.key;
  // 离开对应菜单时退出批量管理
  if (item.key !== HISTORY_KEY) batchMode.value = false;
  if (item.key !== VIDEO_COLLECT_KEY) collectBatchMode.value = false;
  if (item.key !== APP_COLLECT_KEY) appCollectBatchMode.value = false;
  if (item.key !== WEBSITE_COLLECT_KEY) websiteCollectBatchMode.value = false;
  if (item.key !== POST_COLLECT_KEY) newsCollectBatchMode.value = false;
  // 离开「我的资料」时退出编辑态，丢弃未保存的改动
  if (item.key !== PROFILE_KEY) profileRef.value?.cancelEdit();
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

/* 主操作（如「保存」）：常驻品牌色 */
.header-action-btn--primary {
  color: var(--ao-color-primary);

  &:hover:not(:disabled) {
    color: var(--ao-color-primary-hover);
  }
}
</style>
