<template>
  <div class="app-card">
    <div class="card_top">
      <div class="card_image">
        <img :src="app.icon" alt="" />
      </div>
      <div
        class="card-actions"
        :class="{ 'is-visible': actionsVisible }"
      >
        <!-- 操作区插槽（默认插槽）：父组件传入任意内容即可整体替换
             下方的下载 / 收藏 / 分享 三个圆点按钮；不传则展示默认按钮。
             插槽属性：app 当前应用数据，collected 卡片内部收藏态 -->
        <slot :app="app" :collected="collected">
          <button
            type="button"
            class="action-dot action-dot--error"
            data-tooltip="下载"
            aria-label="下载"
            @click.stop.prevent="handleAction('download')"
          />
          <button
            type="button"
            class="action-dot action-dot--warning"
            :class="{ 'is-active': collected }"
            :data-tooltip="collected ? '已收藏' : '收藏'"
            :aria-label="collected ? '取消收藏' : '收藏'"
            @click.stop.prevent="handleCollect"
          />
          <button
            type="button"
            class="action-dot action-dot--info"
            data-tooltip="分享"
            aria-label="分享"
            @click.stop.prevent="handleAction('share')"
          />
        </slot>
      </div>
    </div>
    <div class="card_panels">
      <div class="card_bottom">
        <div class="bottom_name">
          <h3>{{ app.name }}</h3>
        </div>
        <div class="bottom_category">
          <span>{{ app.description }}</span>
        </div>
      </div>
      <div class="card_bottom_2">
        <div class="card_info">
          <div class="info_item">
            <div
              class="item_value name"
              :style="{ background: cardTagBgColor1 }"
            >
              <span>{{ app.name }}</span>
            </div>
          </div>
          <div class="info_item flex">
            <div class="item_value" :style="{ background: cardTagBgColor2 }">
              <span>{{ app.category }}</span>
            </div>
            <div class="item_value" :style="{ background: cardTagBgColor3 }">
              <span>{{ app.size }}MB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { PropType } from 'vue';

defineOptions({
  name: 'ApplicationCard',
});

interface AppInfo {
  id: number;
  name: string;
  description: string;
  category: string;
  tag?: string[];
  size: number;
  icon?: string;
}

const props = defineProps({
  app: {
    type: Object as PropType<AppInfo>,
    default: () => ({
      id: 0,
      name: '',
      description: '',
      category: '',
      tag: [],
      size: 0,
    }),
  },
  /** 批量管理模式：开启后操作区始终可见（如复选框），不再依赖 hover 显隐 */
  actionsVisible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  download: [app: AppInfo];
  collect: [app: AppInfo, collected: boolean];
  share: [app: AppInfo];
}>();

const collected = ref(false);

/** 收藏 / 取消收藏 */
function handleCollect() {
  collected.value = !collected.value;
  emit('collect', props.app, collected.value);
}

/** 下载 / 分享：抛给父级处理 */
function handleAction(action: 'download' | 'share') {
  if (action === 'download') emit('download', props.app);
  else emit('share', props.app);
}

/** 品牌 Lime 亮色系（--ao-lime-5 ~ --ao-lime-9） */
const BRAND_LIME_RANGE = [5, 6, 7, 8, 9] as const;
type LimeShade = (typeof BRAND_LIME_RANGE)[number];

const limeVar = (shade: LimeShade) => `var(--ao-lime-${shade})`;

/** 品牌色 + 透明度混合，降低百分比使颜色更浅 */
const brandMix = (shade: LimeShade, percent: number) =>
  `color-mix(in srgb, ${limeVar(shade)} ${percent}%, transparent)`;

/** 每张卡片随机选取 3 个连续品牌色阶 */
const pickBrandShades = (): [LimeShade, LimeShade, LimeShade] => {
  const start = Math.floor(Math.random() * (BRAND_LIME_RANGE.length - 2));
  return [
    BRAND_LIME_RANGE[start],
    BRAND_LIME_RANGE[start + 1],
    BRAND_LIME_RANGE[start + 2],
  ];
};

const [shade1, shade2, shade3] = pickBrandShades();

/** 背景：浅色品牌渐变 + 柔和光晕，整体更淡雅 */
const cardTopBgColor = `
  radial-gradient(circle at 30% 70%, ${brandMix(shade1, 25)} 0%, transparent 70%),
  radial-gradient(circle at 80% 20%, ${brandMix(shade2, 20)} 0%, transparent 60%),
  linear-gradient(135deg, ${brandMix(shade1, 40)} 0%, ${brandMix(shade2, 30)} 50%, ${brandMix(shade3, 25)} 100%)
`;

const cardTagBgColor1 = brandMix(shade1, 35);
const cardTagBgColor2 = brandMix(shade2, 25);
const cardTagBgColor3 = brandMix(shade3, 20);
</script>

<style scoped lang="scss">
.app-card {
  position: relative;
  width: 100%;
  aspect-ratio: 180 / 145;
  /* 建立尺寸查询容器：批量管理复选框用 cqh 相对整卡高度定位 */
  container-type: size;
  background-color: var(--ao-color-bg-container);
  box-shadow: var(--ao-shadow-sm);
  border-radius: 10px;

  .card_top {
    position: relative;
    width: 100%;
    height: 50%;
    background: v-bind(cardTopBgColor);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border-bottom: var(--ao-border-width-thin) solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: height 0.35s ease;
    border-radius: 10px 10px 0 0;
    z-index: 3;

    .card_image {
      position: absolute;
      left: 50%;
      margin-left: -20px;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        left 0.5s,
        margin-left 0.5s,
        transform 0.5s,
        width 0.5s,
        height 0.5s;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .card-actions {
    position: absolute;
    top: 50%;
    right: 15px;
    transform: translateY(-50%);
    z-index: 3;
    display: flex;
    align-items: center;
    gap: 14px;
    opacity: 0;
    /* visibility 0s 过渡：退场时立即隐藏。否则退出批量管理的一瞬，
       插槽兜底的三个圆点会渲染进正在淡出的容器，闪一下才消失 */
    visibility: hidden;
    transition:
      opacity var(--ao-duration-fast) var(--ao-ease-in-out),
      visibility 0s;

    /* 批量管理等场景：强制常显 */
    &.is-visible {
      opacity: 1;
      visibility: visible;
      /* 对齐 hover 态圆点位置：hover 时 card_top 收缩至 25% 高度，
         其中点即卡面 12.5%。cqh 相对整卡高度，card_top 收缩不影响，
         hover 时复选框完全静止；不支持容器查询的浏览器回退为 25% */
      top: 25%;
      top: 12.5cqh;
    }
  }

  .action-dot {
    --dot-core: var(--ao-gray-5);
    --dot-core-hover: var(--ao-gray-7);
    --dot-ring: var(--ao-gray-3);
    position: relative;
    width: 7px;
    height: 7px;
    padding: 0;
    border: none;
    border-radius: var(--ao-border-radius-circle);
    background-color: var(--dot-core);
    box-shadow: 0 0 0 4px var(--dot-ring);
    cursor: pointer;
    &::before {
      content: '';
      position: absolute;
      inset: -5px;
    }
    transition:
      background-color var(--ao-duration-fast) var(--ao-ease-in-out),
      transform var(--ao-duration-fast) var(--ao-ease-in-out),
      box-shadow var(--ao-duration-fast) var(--ao-ease-in-out);

    /* 悬浮：核心变亮 + 波环外扩 */
    &:hover {
      background-color: var(--dot-core-hover);
      transform: scale(1.15);
      box-shadow: 0 0 0 5px var(--dot-ring);
    }

    /* 已收藏：默认即亮色，不用悬浮也能看出已选中 */
    &.is-active {
      background-color: var(--dot-core-hover);
    }

    &--error {
      --dot-core: color-mix(in srgb, var(--ao-color-error) 55%, white);
      --dot-core-hover: var(--ao-color-error);
      --dot-ring: color-mix(in srgb, var(--ao-color-error) 25%, transparent);
    }

    &--warning {
      --dot-core: color-mix(in srgb, var(--ao-color-warning) 55%, white);
      --dot-core-hover: var(--ao-color-warning);
      --dot-ring: color-mix(in srgb, var(--ao-color-warning) 25%, transparent);
    }

    &--info {
      --dot-core: color-mix(in srgb, var(--ao-color-info) 55%, white);
      --dot-core-hover: var(--ao-color-info);
      --dot-ring: color-mix(in srgb, var(--ao-color-info) 25%, transparent);
    }

    &::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%);
      padding: 3px 6px;
      border-radius: var(--ao-border-radius-sm);
      background-color: var(--dot-core-hover);
      color: var(--ao-gray-0);
      font-size: 10px;
      line-height: var(--ao-line-height-tight);
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity var(--ao-duration-fast) var(--ao-ease-in-out);
    }

    &:hover::after {
      opacity: 1;
    }
  }

  &:hover {
    .card-actions {
      opacity: 1;
      visibility: visible;
    }

    .card_top {
      height: 25%;
      .card_image {
        width: 24px;
        height: 24px;
        /* 固定左边距，和圆点右边距一致，不受卡片宽度影响 */
        left: var(--ao-spacing-sm);
        margin-left: 0;
      }
    }

    .card_bottom {
      transform: translateY(100%);
      opacity: 0;
    }

    .card_bottom_2 {
      transform: translateY(-100%);
      height: calc(100% - 25%);
    }
  }

  /* 滑动面板容器：接替卡片原先的裁剪，
     让 card_bottom / card_bottom_2 滑出卡片时被裁掉 */
  .card_panels {
    position: absolute;
    inset: 0;
    overflow: hidden;
    border-radius: 10px;
  }

  .card_bottom,
  .card_bottom_2 {
    position: absolute;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    text-align: center;
  }

  .card_bottom {
    top: 50%;
    height: 50%;
    z-index: 1;
    transition:
      transform 0.35s ease,
      opacity 0s,
      height 0.35s ease;
  }

  .card_bottom_2 {
    top: 100%;
    height: 50%;
    z-index: 2;
    transition:
      transform 0.35s ease,
      height 0.35s ease;
  }

  .bottom_name {
    max-width: 90%;
    height: auto;
    color: var(--ao-color-text-base);
    border-bottom: var(--ao-border-width-thin) solid var(--ao-color-border);
    padding-bottom: 5px;
    transition: 0.3s;

    h3 {
      font-size: var(--ao-font-size-sm);
      font-weight: var(--ao-font-weight-semibold);
      margin: 0;
    }
  }

  .bottom_category {
    font-size: var(--ao-font-size-xs);
    transition: 0.2s;
    padding: 0 5px;
    color: var(--ao-color-text-tertiary);
  }

  .card_info {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    gap: var(--ao-spacing-xs);

    .info_item {
      transition: 0.2s;
      gap: var(--ao-spacing-xs);
      display: flex;
    }

    .item_value {
      font-size: var(--ao-font-size-xs);
      padding: 3px 5px;
      border-radius: 5px;
      color: var(--ao-color-text-base);
      opacity: 0.7;
      white-space: nowrap;
    }

    .name {
      font-size: var(--ao-font-size-sm);
      font-weight: 550;
    }
  }
}
</style>
