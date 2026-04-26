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
          <div class="item_label">
            <span>名称</span>
          </div>
          <div class="item_value">
            <span>{{ app.name }}</span>
          </div>
        </div>
        <div class="info_item">
          <div class="item_label">
            <span>分类</span>
          </div>
          <div class="item_value">
            <span>{{ app.category }}</span>
          </div>
        </div>
        <div class="info_item">
          <div class="item_label">
            <span>大小</span>
          </div>
          <div class="item_value">
            <span>{{ app.size }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({
  name: 'AppCard'
})

const props = defineProps({
  app: {
    type: Object,
    default: () => ({
      id: 0,
      name: '',
      description: '',
      category: '',
      tag: [],
      size: 0
    })
  }
})

const randomHue = () => Math.floor(Math.random() * 80) + 100 // 100~180 绿色系
const hue = randomHue()

const cardTopBgColor = computed(() => {
  const h1 = hue
  const h2 = (hue + 25) % 360
  const h3 = (hue + 50) % 360
  return `linear-gradient(135deg, hsla(${h1}, 70%, 55%, 0.9) 0%, hsla(${h2}, 75%, 50%, 0.9) 50%, hsla(${h3}, 65%, 45%, 0.9) 100%)`
})

const cardTopArrowColor = computed(() => {
  return `hsla(${(hue + 25) % 360}, 75%, 50%, 0.9)`
})
</script>

<style scoped lang="scss">
$card_width: 180px;
$card_height: 145px;

.app-card {
  position: relative;
  width: $card_width;
  height: $card_height;
  background-color: var(--app-bg-color-light);
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
  overflow: hidden;
  border-radius: 10px;

  .card_top {
    position: relative;
    width: $card_width;
    height: calc($card_height / 2);
    background: v-bind(cardTopBgColor);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;

    &::after {
      content: '';
      width: 16px;
      height: 16px;
      background: v-bind(cardTopArrowColor);
      position: absolute;
      clip-path: polygon(50% 50%, 0 0, 100% 0);
      left: 50%;
      bottom: -15px;
      z-index: 1000;
      transform: translate(-50%);
    }
  }

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

  .card_image {
    position: absolute;
    width: 42px;
    height: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));

    img {
      width: 100%;
      height: 100%;
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
      color: var(--app-text-color-dark);
      opacity: 0.5;
      border-bottom: 1px solid var(--app-border-color);
      padding-bottom: 5px;
      transition: 0.2s;

      h3 {
        font-size: 14px;
        font-weight: 600;
      }
    }

    .bottom_category {
      font-size: 11px;
      transition: 0.2s;
      padding: 0 5px;
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
    justify-content: center;
    flex-direction: column;
    gap: 3px;

    .info_item {
      width: 100px;
      height: auto;
      display: flex;
      align-items: normal;
      justify-content: flex-start;
      gap: 8px;
      transition: 0.2s;
    }

    .item_label {
      font-size: 12px;
      font-weight: 550;
      display: flex;
      align-items: normal;
      justify-content: center;
      color: var(--app-border-color);
    }

    .item_value {
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--app-text-color-dark);
      opacity: 0.7;
    }
  }
}
</style>
