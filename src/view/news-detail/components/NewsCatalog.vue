<template>
  <nav ref="catalogRef" class="news-catalog">
    <div
      v-for="item in catalog"
      :key="item.index"
      class="catalog-item"
      :class="[`level-${item.level}`, { active: activeText === item.text }]"
      @click="scrollToHeading(item)"
    >
      <span class="catalog-indicator" />
      <span class="catalog-text">{{ item.text }}</span>
    </div>

    <div v-if="!catalog.length" class="catalog-empty">
      <AoImage
        src="@/assets/news/icon_catalog.svg"
        width="40px"
        height="40px"
      />
      <p>文章没有大纲</p>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps<{
  data: {
    catalogs: any[];
    offsetTop?: number;
  };
}>();

const catalog = computed(() => props.data?.catalogs ?? []);
const offsetTop = computed(() => props.data?.offsetTop ?? 0);
const activeText = ref<string>('');
const catalogRef = ref<HTMLElement>();

/* 让目录滚动容器跟随当前激活项，避免最后/第一个目录项被裁切 */
const ensureActiveVisible = () => {
  const nav = catalogRef.value;
  const active = nav?.querySelector<HTMLElement>('.catalog-item.active');
  const scrollParent = nav?.closest<HTMLElement>('.outline-content');
  if (!nav || !active || !scrollParent) return;

  const parentRect = scrollParent.getBoundingClientRect();
  const activeRect = active.getBoundingClientRect();
  const itemTop =
    activeRect.top - parentRect.top + scrollParent.scrollTop;
  const itemBottom = itemTop + activeRect.height;
  const viewTop = scrollParent.scrollTop;
  const viewBottom = viewTop + scrollParent.clientHeight;
  const maxScroll = scrollParent.scrollHeight - scrollParent.clientHeight;
  const items = Array.from(
    nav.querySelectorAll<HTMLElement>('.catalog-item'),
  );
  const activeIndex = items.indexOf(active);

  let target: number | null = null;

  /* 首项/末项直接滚到两端，保证滚动条也到顶/到底 */
  if (activeIndex === 0) {
    target = 0;
  } else if (activeIndex === items.length - 1) {
    target = maxScroll;
  } else if (itemTop < viewTop) {
    target = itemTop;
  } else if (itemBottom > viewBottom) {
    target = itemBottom - scrollParent.clientHeight;
  }

  if (target !== null && Math.abs(target - viewTop) > 1) {
    scrollParent.scrollTo({
      top: Math.max(0, Math.min(target, maxScroll)),
      behavior: 'smooth',
    });
  }
};

watch(activeText, async () => {
  await nextTick();
  ensureActiveVisible();
});

const scrollToHeading = (item: any) => {
  const el = document.getElementById(item.text);
  if (!el) return;
  const top =
    el.getBoundingClientRect().top + window.scrollY - offsetTop.value - 16;
  window.scrollTo({ top, behavior: 'smooth' });
  activeText.value = item.text;
};

const onScroll = () => {
  const threshold = offsetTop.value + 24;
  const headings = catalog.value.map((item) => {
    const el = document.getElementById(item.text);
    return {
      text: item.text,
      top: el ? el.getBoundingClientRect().top : Infinity,
    };
  });

  const passed = headings.filter((h) => h.top <= threshold);
  if (passed.length) {
    activeText.value = passed[passed.length - 1].text;
  } else if (headings.length) {
    activeText.value = headings[0].text;
  }
};

watch(
  () => catalog.value.length,
  async () => {
    await nextTick();
    onScroll();
  },
  { immediate: true },
);

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped lang="scss">
.news-catalog {
  display: flex;
  flex-direction: column;
  gap: 1px;
  padding: var(--ao-spacing-xxs) 0;
}

.catalog-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  border-left: var(--ao-border-width-medium) solid transparent;
  transition: all 0.18s ease;

  &:hover {
    background: color-mix(in srgb, var(--ao-color-primary) 10%, transparent);
    .catalog-text {
      color: #333;
    }
    .catalog-indicator {
      opacity: 1;
    }
  }

  &.active {
    border-left-color: var(--ao-color-primary);
    background: color-mix(in srgb, var(--ao-color-primary) 8%, transparent);

    .catalog-indicator {
      opacity: 1;
      background: var(--ao-color-primary) !important;
      transform: scale(1.4);
    }

    .catalog-text {
      color: var(--ao-color-primary) !important;
      font-weight: var(--ao-font-weight-semibold) !important;
    }
  }

  // ---- H1 ----
  &.level-1 {
    padding: 6px 8px 6px 10px;
    .catalog-indicator {
      width: 5px;
      height: 5px;
      border-radius: var(--ao-border-radius-xs);
      background: #555;
    }
    .catalog-text {
      font-size: 15px;
      font-weight: var(--ao-font-weight-semibold);
      color: #222;
      letter-spacing: 0.01em;
    }
  }

  // ---- H2 ----
  &.level-2 {
    padding: 5px 8px 5px 20px;
    .catalog-indicator {
      width: 4px;
      height: 4px;
      border-radius: var(--ao-border-radius-circle);
      background: #777;
    }
    .catalog-text {
      font-size: var(--ao-font-size-sm);
      font-weight: var(--ao-font-weight-medium);
      color: #444;
    }
  }

  // ---- H3 ----
  &.level-3 {
    padding: 4px 8px 4px 32px;
    .catalog-indicator {
      width: 3px;
      height: 3px;
      border-radius: var(--ao-border-radius-circle);
      background: #aaa;
    }
    .catalog-text {
      font-size: 13px;
      font-weight: var(--ao-font-weight-normal);
      color: #666;
    }
  }

  // ---- H4 ----
  &.level-4 {
    padding: 4px 8px 4px 44px;
    .catalog-indicator {
      width: 3px;
      height: 3px;
      border-radius: var(--ao-border-radius-circle);
      background: #bbb;
    }
    .catalog-text {
      font-size: 12.5px;
      font-weight: var(--ao-font-weight-normal);
      color: #888;
    }
  }

  // ---- H5 / H6 ----
  &.level-5 {
    padding: 3px 8px 3px 56px;
    .catalog-indicator {
      width: 2px;
      height: 2px;
      border-radius: var(--ao-border-radius-circle);
      background: #ccc;
    }
    .catalog-text {
      font-size: 11.5px;
      font-weight: var(--ao-font-weight-normal);
      color: #aaa;
    }
  }

  &.level-6 {
    padding: 3px 8px 3px 68px;
    .catalog-indicator {
      width: 2px;
      height: 2px;
      border-radius: var(--ao-border-radius-circle);
      background: #ccc;
    }
    .catalog-text {
      font-size: 11.5px;
      font-weight: var(--ao-font-weight-normal);
      color: #aaa;
    }
  }
}

.catalog-indicator {
  flex-shrink: 0;
  opacity: 0.7;
  transition: all 0.18s ease;
}

.catalog-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.6;
  transition: color 0.18s ease;
}

.catalog-empty {
  font-size: var(--ao-font-size-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  height: 300px;
  color: #bbb;
  text-align: center;
  padding: 16px 0;
}
</style>
