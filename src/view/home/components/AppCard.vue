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
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppCard',
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

/** 品牌色 + 透明度混合 */
const brandMix = (shade: LimeShade, percent: number) =>
  `color-mix(in srgb, ${limeVar(shade)} ${percent}%, transparent)`;

/** 每张卡片随机选取 3 个连续品牌色阶，保证渐变协调 */
const pickBrandShades = (): [LimeShade, LimeShade, LimeShade] => {
  const start = Math.floor(Math.random() * (BRAND_LIME_RANGE.length - 2));
  return [
    BRAND_LIME_RANGE[start],
    BRAND_LIME_RANGE[start + 1],
    BRAND_LIME_RANGE[start + 2],
  ];
};

const [shade1, shade2, shade3] = pickBrandShades();

const cardTopBgColor = `linear-gradient(135deg, ${brandMix(shade1, 70)} 0%, ${brandMix(shade2, 60)} 50%, ${brandMix(shade3, 50)} 100%)`;

const cardTagBgColor1 = brandMix(shade1, 60);
const cardTagBgColor2 = brandMix(shade2, 50);
const cardTagBgColor3 = brandMix(shade3, 40);
</script>

<style scoped lang="scss">
$card_width: 180px;
$card_height: 145px;

.app-card {
  position: relative;
  width: $card_width;
  height: $card_height;
  background-color: var(--ao-color-bg-container);
  box-shadow: var(--ao-shadow-md);
  overflow: hidden;
  border-radius: 10px;

  .card_top {
    position: relative;
    width: $card_width;
    height: calc($card_height / 2);
    background: v-bind(cardTopBgColor);
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border-bottom: var(--ao-border-width-thin) solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;

    // &::after {
    //   content: '';
    //   width: 16px;
    //   height: 16px;
    //   background: v-bind(cardTopArrowColor);
    //   position: absolute;
    //   clip-path: polygon(50% 50%, 0 0, 100% 0);
    //   left: 50%;
    //   bottom: -15px;
    //   z-index: 1000;
    //   transform: translate(-50%);
    // }
  }

  // 触屏点按会粘住 :hover 状态（图标缩小移位、卡片切到标签视图），
  // 悬停动效仅对有指针的设备启用
  @media (hover: hover) {
    &:hover {
      .card_top {
        width: 100%;
        height: 38px;
        .card_image {
          width: 24px;
          height: 24px;
          transform: translate(-70px, 0px);
        }
      }

      .card_bottom {
        top: 300px;
      }

      .card_bottom_2 {
        top: 38px;
        width: $card_width;
        height: calc($card_height - 38px);
      }
    }
  }

  .card_image {
    position: absolute;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 8px;
    background-color: #fff;
    transition: 0.5s;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));

    img {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      object-fit: cover;
    }
  }

  .card_bottom,
  .card_bottom_2 {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 5px;
    width: $card_width;
    height: calc($card_height / 2);
    text-align: center;
    transition: 0.5s;
    position: absolute;
    top: calc($card_height / 2);

    .bottom_name {
      width: 110px;
      height: auto;
      color: var(--ao-color-text-base);
      border-bottom: var(--ao-border-width-thin) solid var(--ao-color-border);
      padding-bottom: 5px;
      transition: 0.2s;

      h3 {
        font-size: var(--ao-font-size-sm);
        font-weight: var(--ao-font-weight-semibold);
      }
    }

    .bottom_category {
      width: 100%;
      box-sizing: border-box;
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      font-size: calc(var(--ao-font-size-xs) - 1px);
      line-height: 1.5;
      text-overflow: ellipsis;
      transition: 0.2s;
      padding: 0 14px;
      color: var(--ao-color-text-tertiary);
    }
  }

  .card_bottom_2 {
    top: 200px;
    height: 200px;
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
    }

    .item_value {
      font-size: var(--ao-font-size-xs);
      padding: 3px 5px;
      border-radius: 5px;
      color: var(--ao-color-text-base);
      opacity: 0.7;
    }

    .name {
      font-size: var(--ao-font-size-sm);
      font-weight: 550;
    }
  }
}

/* 平板/移动端堆叠布局：卡片宽度跟随网格拉伸，
   高度按设计比例（180:145）随宽度缩放，内部上下两半改百分比定位 */
@media (max-width: 1024px) {
  .app-card {
    width: 100%;
    height: auto;
    aspect-ratio: 180 / 145;

    .card_top {
      width: 100%;
      height: 50%;

      // 图标改为显式居中定位，与悬停态之间只过渡 transform / left，
      // 避免静态定位（auto）切换到具体值时产生跳动
      .card_image {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .card_bottom,
    .card_bottom_2 {
      width: 100%;
      height: 50%;
      top: 50%;
    }

    // 隐藏态的标签视图挂在卡片下方，用百分比定位适配流式高度
    .card_bottom_2 {
      top: 110%;
      height: 50%;
    }

    // 流式尺寸下的翻转动效：条带高度、标签视图位置按比例计算；
    // 图标沿用桌面的「滑动 + 缩放」轨迹，仅把位移目标从固定 -70px
    // 改为 left 过渡（20px 与桌面停留位置一致），transition 平滑衔接
    @media (hover: hover) {
      &:hover {
        .card_top {
          width: 100%;
          height: 26%;

          .card_image {
            width: 24px;
            height: 24px;
            left: 20px;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .card_bottom {
          top: 110%;
        }

        .card_bottom_2 {
          top: 26%;
          width: 100%;
          height: 74%;
        }
      }
    }
  }
}
</style>
