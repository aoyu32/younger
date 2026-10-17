<template>
  <section class="video-chapters">
    <!-- 付费信息：无章节的视频只展示这一部分 -->
    <div class="video-chapters__pay">
      <span class="pay-tag" :class="paid ? 'is-paid' : 'is-free'">
        {{ payLabel }}
      </span>
      <span class="pay-note">{{ payNote }}</span>

      <!-- 付费时右侧给出购买入口（功能色） -->
      <div v-if="paid" class="pay-actions">
        <button type="button" class="pay-btn" @click="handleBuy">购买</button>
        <button type="button" class="pay-btn is-vip" @click="handleBuy">
          开通会员
        </button>
      </div>
    </div>

    <!-- 章节卡片：最高高度对齐播放器，超出部分在卡片内滚动 -->
    <div v-if="items.length" class="video-chapters__card">
      <h2 class="video-chapters__title">
        {{ title }}
        <span v-if="leafCount" class="video-chapters__count">
          共 {{ leafCount }} 节
        </span>
      </h2>

      <ao-scrollbar class="video-chapters__scroll">
        <ul class="video-chapters__list">
          <template v-for="item in items" :key="item.id">
            <!-- 叶子章节：直接一行 -->
            <li
              v-if="item.kind === 'leaf'"
              class="chapter-row"
              :class="{
                'is-current': item.id === currentId,
                'is-locked': isLocked(item),
              }"
              @click="handleSelect(item)"
            >
              <span class="chapter-row__lead">
                <AoImage
                  v-if="item.id === currentId"
                  class="chapter-row__playing"
                  src="@/assets/video/icon_playing.svg"
                  width="14px"
                  height="14px"
                />
                <span v-else class="chapter-row__no">{{ item.no }}</span>
              </span>

              <div class="chapter-row__body">
                <div class="chapter-row__title" :title="item.title">
                  {{ item.title }}
                </div>
                <div v-if="item.duration" class="chapter-row__meta">
                  <AoImage
                    src="@/assets/video/icon_publish_time.svg"
                    width="14px"
                    height="14px"
                  />
                  <span>{{ formatDurationCN(item.duration) }}</span>
                </div>
              </div>

              <span v-if="isTrial(item)" class="chapter-row__trial">可试看</span>
              <AoImage
                v-else-if="isLocked(item)"
                src="@/assets/video/icon_lock.svg"
                width="18px"
                height="18px"
              />
            </li>

            <!-- 章节分组头：点击收起 / 展开下面的视频 -->
            <li
              v-else
              class="chapter-group"
              :class="{ 'is-open': expandedIds.has(item.id) }"
              @click="toggle(item.id)"
            >
              <AoImage
                class="chapter-group__arrow"
                src="@/assets/video/icon_arrow_right.svg"
                width="14px"
                height="14px"
              />
              <span class="chapter-group__title" :title="item.title">
                {{ item.title }}
              </span>
            </li>

            <template v-if="item.kind === 'group' && expandedIds.has(item.id)">
              <li
                v-for="leaf in item.leaves"
                :key="leaf.id"
                class="chapter-row"
                :class="{
                  'is-current': leaf.id === currentId,
                  'is-locked': isLocked(leaf),
                }"
                @click="handleSelect(leaf)"
              >
                <span class="chapter-row__lead">
                  <AoImage
                    v-if="leaf.id === currentId"
                    class="chapter-row__playing"
                    src="@/assets/video/icon_playing.svg"
                    width="14px"
                    height="14px"
                  />
                  <span v-else class="chapter-row__no">{{ leaf.no }}</span>
                </span>

                <div class="chapter-row__body">
                  <div class="chapter-row__title" :title="leaf.title">
                    {{ leaf.title }}
                  </div>
                  <div v-if="leaf.duration" class="chapter-row__meta">
                    <span>时长</span>
                    <span>{{ formatDurationCN(leaf.duration) }}</span>
                  </div>
                </div>

                <span v-if="isTrial(leaf)" class="chapter-row__trial">可试看</span>
                <AoImage
                  v-else-if="isLocked(leaf)"
                  src="@/assets/video/icon_lock.svg"
                  width="18px"
                  height="18px"
                />
              </li>
            </template>
          </template>
        </ul>
      </ao-scrollbar>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { formatDurationCN } from '@/utils/format';
import type { VideoChapter } from '@/api/type/video';

defineOptions({ name: 'VideoChapters' });

const props = withDefaults(
  defineProps<{
    /** 章节树（数据结构保持树形，展示按「章节分组 + 视频行」渲染） */
    chapters?: VideoChapter[];
    /** 当前播放的章节 id */
    currentId?: number;
    /** 是否付费视频：付费视频里未标记免费的章节展示锁定图标 */
    paid?: boolean;
    /** 价格（元），付费视频展示 */
    price?: number;
    /** 区块标题 */
    title?: string;
  }>(),
  {
    chapters: () => [],
    currentId: undefined,
    paid: false,
    price: undefined,
    title: '视频章节',
  },
);

const emit = defineEmits<{
  (e: 'select', chapter: VideoChapter): void;
}>();

/* ---------------- 付费信息 ---------------- */

const payLabel = computed(() => {
  if (!props.paid) return '免费';
  return props.price ? `付费 ¥${props.price}` : '付费';
});

const payNote = computed(() =>
  props.paid ? '购买或会员可观看' : '无需付费，免费观看',
);

/** 购买 / 开通会员：mock 交互，接接口后换真实逻辑 */
const handleBuy = () => {
  console.log('TODO 购买 / 开通会员');
};

/* ---------------- 章节：分组 + 叶子视频行 ---------------- */

/** 叶子章节行，no 为全局两位序号 */
interface ChapterLeaf extends VideoChapter {
  kind: 'leaf';
  no: string;
}

/** 分组头：点击展开 / 收起子级视频 */
interface ChapterGroup {
  kind: 'group';
  id: number;
  title: string;
  /** 该分组下的全部叶子视频（含深层子级） */
  leaves: ChapterLeaf[];
}

type ChapterItem = ChapterLeaf | ChapterGroup;

/**
 * 章节树 → 「叶子行 / 分组头」列表：
 * - 有子级的节点作为分组头，叶子视频挂在其下（深层子级直接摊平到最近的分组）；
 * - 序号按整棵树里叶子的顺序 01、02… 全局递增，展开收缩时不重新编号。
 */
const items = computed<ChapterItem[]>(() => {
  let counter = 0;
  const toLeaf = (chapter: VideoChapter): ChapterLeaf => {
    counter += 1;
    return {
      ...chapter,
      kind: 'leaf',
      no: String(counter),
    };
  };

  const build = (list: VideoChapter[]): ChapterItem[] =>
    list.map((chapter) => {
      if (!chapter.children?.length) return toLeaf(chapter);

      const leaves: ChapterLeaf[] = [];
      const walk = (nodes: VideoChapter[]) => {
        nodes.forEach((node) => {
          if (node.children?.length) walk(node.children);
          else leaves.push(toLeaf(node));
        });
      };
      walk(chapter.children);

      return {
        kind: 'group',
        id: chapter.id,
        title: chapter.title,
        leaves,
      };
    });

  return build(props.chapters);
});

/** 视频总数（全部分组的叶子之和） */
const leafCount = computed(() =>
  items.value.reduce(
    (count, item) => count + (item.kind === 'group' ? item.leaves.length : 1),
    0,
  ),
);

/** 展开状态（每次整体替换，保证 Set 的响应式） */
const expandedIds = ref<Set<number>>(new Set());

const toggle = (id: number) => {
  const next = new Set(expandedIds.value);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  expandedIds.value = next;
};

/** 章节列表变化时默认展开全部分组 */
watch(
  () => props.chapters,
  (chapters) => {
    const ids = new Set<number>();
    const walk = (list: VideoChapter[]) => {
      list.forEach((item) => {
        if (item.children?.length) {
          ids.add(item.id);
          walk(item.children);
        }
      });
    };
    walk(chapters);
    expandedIds.value = ids;
  },
  { immediate: true },
);

const isTrial = (row: ChapterLeaf) => props.paid && row.free === true;

/** 付费视频里未标记免费的章节未解锁 */
const isLocked = (row: ChapterLeaf) => props.paid && row.free !== true;

const handleSelect = (row: ChapterLeaf) => {
  // TODO 接入接口后在这里切换播放地址（锁定章节回到购买引导）
  console.log('切换章节：', row.title);
  emit('select', row as VideoChapter);
};
</script>

<style lang="scss" scoped>
@use './VideoChapters.scss' as *;
</style>
