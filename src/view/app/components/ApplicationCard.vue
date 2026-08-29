<template>
  <div class="app-card">
    <div class="card_top">
      <div class="card_image">
        <img :src="app.icon" alt="" />
      </div>
    </div>
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
          <div class="item_value name" :style="{ background: cardTagBgColor1 }">
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
</template>

<script setup lang="ts">
defineOptions({
  name: 'ApplicationCard',
});

defineProps({
  app: {
    type: Object,
    default: () => ({
      id: 0,
      name: '',
      description: '',
      category: '',
      tag: [],
      size: 0,
    }),
  },
});

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

/** 标签背景色（同样调浅） */
const cardTagBgColor1 = brandMix(shade1, 35);
const cardTagBgColor2 = brandMix(shade2, 25);
const cardTagBgColor3 = brandMix(shade3, 20);
</script>

<style scoped lang="scss">
.app-card {
  position: relative;
  width: 100%;
  aspect-ratio: 180 / 145;
  background-color: var(--ao-color-bg-container);
  box-shadow: var(--ao-shadow-sm);
  overflow: hidden;
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

    .card_image {
      position: absolute;
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
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

  &:hover {
    .card_top {
      height: 25%;
      .card_image {
        width: 24px;
        height: 24px;
        transform: translate(-80px, 0px);
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
