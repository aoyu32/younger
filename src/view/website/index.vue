<template>
  <div class="website">
    <PageSolgan
      content="常用网站一处收藏，智能时代的信息一站直达。"
      sub-content="网站导航"
    />
    <div class="website-main">
      <div class="section-wrapper">
        <div class="history">
          <WebsiteListCard
            title="最近浏览"
            :data="historyList"
            :editing="isEditHistory"
            v-model:selected="historySelected"
            title-pos="left"
            empty="没有浏览历史~"
            @open="handleSiteClick"
          >
            <template #action>
              <div class="action-btn">
                <AoIcon
                  :icon="deleteIcon"
                  hoverColor="red"
                  size="16px"
                  v-if="!isEditHistory"
                  @click="toggleHistoryEdit"
                  color="#595959"
                ></AoIcon>
                <div class="actions flex-center" v-else>
                  <div class="action-item" @click="toggleHistoryAll">
                    {{ historyAllSelected ? '取消全选' : '全选' }}
                  </div>
                  <div
                    class="action-item del"
                    :class="{ disabled: historySelected.length === 0 }"
                    @click="deleteHistorySelected"
                  >
                    删除
                  </div>
                  <div class="action-item close" @click="closeHistoryEdit">
                    关闭
                  </div>
                </div>
              </div>
            </template>
          </WebsiteListCard>
        </div>
        <div class="collect">
          <WebsiteListCard
            title="我的收藏"
            :data="collectList"
            :editing="isEditCollect"
            v-model:selected="collectSelected"
            title-pos="right"
            empty="没有收藏内容~"
            @open="handleSiteClick"
          >
            <template #action>
              <div class="action-btn flex-center">
                <AoIcon
                  :icon="addIcon"
                  size="16px"
                  hoverColor="orange"
                  v-if="!isEditCollect"
                  color="#595959"
                  @click="showAddDialog = true"
                ></AoIcon>
                <div class="actions flex-center" v-else>
                  <div class="action-item" @click="toggleCollectAll">
                    {{ collectAllSelected ? '取消全选' : '全选' }}
                  </div>
                  <div
                    class="action-item del"
                    :class="{ disabled: collectSelected.length === 0 }"
                    @click="deleteCollectSelected"
                  >
                    删除
                  </div>
                  <div class="action-item close" @click="closeCollectEdit">
                    关闭
                  </div>
                </div>
                <AoIcon
                  :icon="deleteIcon"
                  size="16px"
                  hoverColor="red"
                  color="#595959"
                  v-if="!isEditCollect"
                  @click="toggleCollectEdit"
                ></AoIcon>
              </div>
            </template>
          </WebsiteListCard>
        </div>
      </div>
      <div class="line">
        <AoImage
          src="@/assets/website/icon_line.svg"
          width="100%"
          height="64px"
        ></AoImage>
      </div>
      <div class="category-section" ref="categorySectionRef">
        <aside class="category-sidebar">
          <CategoryMenu
            title="分类导航"
            :data="menuCategories"
            :active-name="menuActiveName"
            @select="handleCategorySelect"
          />
        </aside>
        <div class="category-content">
          <WebsiteSection
            v-for="section in categorySections"
            :key="section.title"
            :ref="(el) => setSectionRef(section.title, el)"
            :title="section.title"
            :list="section.list"
            :active="activeSectionName === section.title"
            @click="handleSiteClick"
          />
        </div>
      </div>
    </div>
    <AddWebsiteDialog v-model="showAddDialog" @confirm="handleAddConfirm" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import Lenis from 'lenis';
import PageSolgan from '@/components/page-slogan/index.vue';
import WebsiteListCard from './components/WebsiteListCard.vue';
import { useWebsite, type WebsiteLink } from '@/store/module/website';
import deleteIcon from '@/assets/website/icon_delete.svg';
import addIcon from '@/assets/website/icon_add.svg';
import AddWebsiteDialog from './components/AddWebsiteDialog.vue';
import CategoryMenu from './components/CategoryMenu.vue';
import WebsiteSection from './components/WebsiteSection.vue';
import { websiteCategories, type WebsiteSite } from '@/mock/websiteCategories';

const isEditHistory = ref(false);
const isEditCollect = ref(false);
const showAddDialog = ref(false);
const categorySectionRef = ref();

const { historyList, collectList, addHistory } = useWebsite();
const historySelected = ref<number[]>([]);
const collectSelected = ref<number[]>([]);

const historyAllSelected = computed(
  () =>
    historyList.value.length > 0 &&
    historySelected.value.length === historyList.value.length,
);
const collectAllSelected = computed(
  () =>
    collectList.value.length > 0 &&
    collectSelected.value.length === collectList.value.length,
);

const toggleHistoryEdit = () => {
  isEditHistory.value = !isEditHistory.value;
  historySelected.value = [];
};

const closeHistoryEdit = () => {
  isEditHistory.value = false;
  historySelected.value = [];
};

const toggleHistoryAll = () => {
  historySelected.value = historyAllSelected.value
    ? []
    : historyList.value.map((_, index) => index);
};

const deleteHistorySelected = () => {
  if (historySelected.value.length === 0) return;
  const selected = new Set(historySelected.value);
  historyList.value = historyList.value.filter(
    (_, index) => !selected.has(index),
  );
  historySelected.value = [];
};

const toggleCollectEdit = () => {
  isEditCollect.value = !isEditCollect.value;
  collectSelected.value = [];
};

const closeCollectEdit = () => {
  isEditCollect.value = false;
  collectSelected.value = [];
};

const toggleCollectAll = () => {
  collectSelected.value = collectAllSelected.value
    ? []
    : collectList.value.map((_, index) => index);
};

const deleteCollectSelected = () => {
  if (collectSelected.value.length === 0) return;
  const selected = new Set(collectSelected.value);
  collectList.value = collectList.value.filter(
    (_, index) => !selected.has(index),
  );
  collectSelected.value = [];
};

// 默认选中第一个分组的第一个二级分类
const firstGroup = websiteCategories[0];
const firstSub = firstGroup?.children?.[0];
const activeCategory = ref(firstGroup?.name ?? '');
const activeSub = ref(firstSub?.name ?? '');
const activeSites = ref<WebsiteSite[]>(firstSub?.sites ?? []);

// 分类内容全部由 websiteCategories 驱动，新增 AI 站点无需再改页面
const categorySections = computed(() =>
  websiteCategories.flatMap((group) =>
    group.children
      .filter((child) => child.sites.length > 0)
      .map((child) => ({
        title: child.name,
        group: group.name,
        list: child.sites,
      })),
  ),
);

// 菜单与右侧 section 使用同一份数据，避免分类名硬编码后失配
const menuCategories = websiteCategories;

// 收集各 section 的根元素，用于锚点滚动
const sectionRefMap = new Map<string, HTMLElement>();
const setSectionRef = (title: string, el: any) => {
  if (el) {
    sectionRefMap.set(title, el.$el ?? el);
  } else {
    sectionRefMap.delete(title);
  }
};

const handleCategorySelect = (
  group: { name: string },
  sub: { name: string; sites?: WebsiteSite[] },
) => {
  activeCategory.value = group.name;
  activeSub.value = sub.name;
  activeSites.value = sub.sites ?? [];
  scrollToSection(sub.name);
};

// cubic-bezier(x1, y1, x2, y2) 缓动求解器，与 CSS 同名曲线行为一致
const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const curveX = (t: number) =>
    3 * t * (1 - t) ** 2 * x1 + 3 * t ** 2 * (1 - t) * x2 + t ** 3;
  const curveY = (t: number) =>
    3 * t * (1 - t) ** 2 * y1 + 3 * t ** 2 * (1 - t) * y2 + t ** 3;

  return (x: number): number => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    // 牛顿迭代反解 x(t) = x 对应的 t
    let t = x;
    for (let i = 0; i < 8; i++) {
      const dx = curveX(t) - x;
      if (Math.abs(dx) < 1e-5) break;
      const slope =
        3 * (1 - t) ** 2 * x1 +
        6 * t * (1 - t) * (x2 - x1) +
        3 * t ** 2 * (1 - x2);
      if (Math.abs(slope) < 1e-6) break;
      t -= dx / slope;
    }
    return curveY(Math.min(Math.max(t, 0), 1));
  };
};

// easeInOutCubic：起步和收尾都缓，中间快，滚动观感自然
const easeScroll = cubicBezier(0.65, 0, 0.35, 1);

/* ---------- 页面平滑滚动：Lenis 接管 window 滚动 ---------- */
let lenis: Lenis | null = null;
let lenisRafId = 0;

/* ---------- 导航激活状态：仅由点击驱动，页面滚动不改变高亮 ---------- */
// 菜单高亮即时生效；section 圆点在滚动到位后再点亮（延迟激活）
const menuActiveName = ref(categorySections.value[0]?.title ?? '');
const activeSectionName = ref(categorySections.value[0]?.title ?? '');

// 平滑滚动到对应 section：section 顶部对齐侧边导航栏顶边所在高度。
// 边界钳制：靠近顶部的分类不滚出页面顶部，靠近底部的分类不超过最大滚动距离。
const scrollToSection = (title: string) => {
  const el = sectionRefMap.get(title);
  if (!el) return;
  const raw = el.getBoundingClientRect().top + window.scrollY - getStickyTop();
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const top = Math.max(0, Math.min(raw, maxScroll));

  menuActiveName.value = title;
  if (lenis) {
    const distance = Math.abs(top - window.scrollY);
    const duration = Math.min(0.9, Math.max(0.4, distance * 0.00035));
    lenis.scrollTo(top, {
      // 随距离自适应的时长（秒），与贝塞尔曲线配合
      duration,
      easing: easeScroll,
    });
    // 滚动到位后再点亮 section 圆点（延迟激活）；被手动滚动打断时也兜底点亮
    setTimeout(() => {
      activeSectionName.value = title;
    }, duration * 1000);
  } else {
    // 兜底：Lenis 未就绪时用原生平滑滚动
    window.scrollTo({ top, behavior: 'smooth' });
    activeSectionName.value = title;
  }
};

// 侧边栏 sticky 顶边位置：点击滚动时 section 顶部的对齐基准
const getStickyTop = () => {
  const sidebar = categorySectionRef.value?.querySelector(
    '.category-sidebar',
  ) as HTMLElement | null;
  return sidebar ? parseFloat(getComputedStyle(sidebar).top) : 74;
};

onMounted(() => {
  lenis = new Lenis({
    lerp: 0.2,
    smoothWheel: true,
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    respectReducedMotion: false,
  });
  const raf = (time: number) => {
    lenis?.raf(time);
    lenisRafId = requestAnimationFrame(raf);
  };
  lenisRafId = requestAnimationFrame(raf);
});

onBeforeUnmount(() => {
  if (lenisRafId) cancelAnimationFrame(lenisRafId);
  lenis?.destroy();
  lenis = null;
});

const handleSiteClick = (item: WebsiteLink) => {
  if (!item.url) return;
  addHistory({
    name: item.name,
    icon: item.icon,
    url: item.url,
  });
  window.open(item.url, '_blank', 'noopener,noreferrer');
};

const handleAddConfirm = (data: {
  name: string;
  url: string;
  desc: string;
}) => {
  console.log('添加收藏:', data);
};
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
