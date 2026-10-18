<template>
  <div class="totorial">
    <TutorialSideNav
      :groups="groups"
      :title="courseName"
      :active-id="activeChapter.id"
      @select="handleSelect"
    />
    <div class="totorial-main">
      <TutorialContent
        ref="contentRef"
        :title="activeChapter.title"
        :content="activeChapter.content"
        :editor-id="EDITOR_ID"
        @get-catalog="handleGetCatalog"
      />
      <div ref="endRef" class="content-end"></div>
      <Transition name="pager">
        <TutorialPager
          v-show="showPager"
          class="totorial-pager"
          :prev="prevChapter"
          :next="nextChapter"
          @change="handleSelect"
        />
      </Transition>
    </div>
    <aside class="totorial-sidebar">
      <div class="sidebar-inner">
        <TutorialToc :catalog="catalog" />
        <TutorialCourses :courses="otherCourses" />
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { totorialCourseName, totorialCourses, totorialGroups } from '@/mock/totorial';
import TutorialSideNav from './components/TutorialSideNav.vue';
import TutorialContent from './components/TutorialContent.vue';
import TutorialToc from './components/TutorialToc.vue';
import TutorialCourses from './components/TutorialCourses.vue';
import TutorialPager from './components/TutorialPager.vue';
import type {
  TutorialCatalogItem,
  TutorialChapter,
  TutorialGroup,
} from './types';

defineOptions({
  name: 'Totorial',
});

const EDITOR_ID = 'totorial-md';

const route = useRoute();

const courseName = ref(
  String(route.query.title ?? '') || totorialCourseName,
);
const groups = ref<TutorialGroup[]>(totorialGroups);
const otherCourses = computed(() =>
  totorialCourses.filter((item) => item.title !== courseName.value),
);
const chapters = computed<TutorialChapter[]>(() =>
  groups.value.flatMap((group) => group.children),
);
const activeChapter = ref<TutorialChapter>(chapters.value[0]);
const catalog = ref<TutorialCatalogItem[]>([]);
const showPager = ref(false);
const endRef = ref<HTMLElement | null>(null);
const contentRef = ref<{ $el?: HTMLElement } | null>(null);

const activeIndex = computed(() =>
  chapters.value.findIndex((item) => item.id === activeChapter.value.id),
);
const prevChapter = computed(() =>
  activeIndex.value > 0 ? chapters.value[activeIndex.value - 1] : undefined,
);
const nextChapter = computed(() =>
  activeIndex.value < chapters.value.length - 1
    ? chapters.value[activeIndex.value + 1]
    : undefined,
);

const handleSelect = (item: TutorialChapter) => {
  if (item.id === activeChapter.value.id) return;
  activeChapter.value = item;
  catalog.value = [];
  showPager.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleGetCatalog = (data: TutorialCatalogItem[]) => {
  catalog.value = data ?? [];
};

const checkPager = () => {
  const el = endRef.value;
  if (!el) return;
  showPager.value = el.getBoundingClientRect().top <= window.innerHeight;
};

let contentObserver: ResizeObserver | null = null;
let checkTimer: ReturnType<typeof setTimeout> | undefined;

const scheduleCheck = () => {
  clearTimeout(checkTimer);
  requestAnimationFrame(checkPager);
  checkTimer = setTimeout(checkPager, 320);
};

watch(activeChapter, () => {
  nextTick(scheduleCheck);
});

onMounted(() => {
  const key = String(route.query.chapter ?? '');
  if (key) {
    const byId = chapters.value.find((item) => item.id === key);
    const index = Number(key);
    const target =
      byId ??
      (Number.isFinite(index) ? chapters.value[index - 1] : undefined);
    if (target) activeChapter.value = target;
  }
  window.addEventListener('scroll', checkPager, { passive: true });
  window.addEventListener('resize', checkPager);
  nextTick(() => {
    checkPager();
    const el = contentRef.value?.$el;
    if (!el) return;
    contentObserver = new ResizeObserver(scheduleCheck);
    contentObserver.observe(el);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', checkPager);
  window.removeEventListener('resize', checkPager);
  contentObserver?.disconnect();
  contentObserver = null;
  clearTimeout(checkTimer);
});
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
