<template>
  <div
    :class="['card', type === 'year' ? 'year-card' : 'month-card']"
    ref="cardRef"
    @mouseenter="handleEnter"
    @mouseleave="handleLeave"
    @mousemove="handleOver"
  >
    <div class="card-inner">
      <div class="card-tier" ref="tierRef">{{ tier }}</div>
      <div class="card-price">
        <span class="price-symbol">{{ priceSymbol }}</span>
        <span class="price-value" ref="priceValueRef">{{ priceValue }}</span>
        <span class="price-unit">{{ priceUnit }}</span>
      </div>
      <ul class="card-benefits">
        <li v-for="(benefit, index) in benefits" :key="index">
          <span
            :class="['benefit-dot', { 'benefit-dot--gold': type === 'year' }]"
          ></span>
          {{ benefit }}
        </li>
      </ul>
      <div class="vip-mark">
        {{ mark }}
      </div>
      <ao-button class="card-btn" :bg="buttonBg" @click="$emit('pay')"
        >立即开通</ao-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const cardRef = ref<HTMLElement | null>(null);
const tierRef = ref<HTMLElement | null>(null);
const priceValueRef = ref<HTMLElement | null>(null);

const props = defineProps<{
  type: 'month' | 'year';
  tier: string;
  priceSymbol: string;
  priceValue: string | number;
  priceUnit: string;
  benefits: string[];
  buttonBg: string;
  mark: string;
}>();

defineEmits<{
  pay: [];
}>();

/**
 * 应用动态渐变（仅年卡调用）
 * @param el         目标元素
 * @param offsetX    鼠标相对卡片中心的水平偏移比例（-1 ~ 1）
 * @param offsetY    鼠标相对卡片中心的垂直偏移比例（-1 ~ 1）
 */
const applyYearTextGradient = (
  el: HTMLElement,
  offsetX: number,
  offsetY: number,
) => {
  // 将偏移比例映射为背景位置百分比 (0% ~ 100%)
  const posX = ((offsetX + 1) / 2) * 100;
  const posY = ((offsetY + 1) / 2) * 100;

  // 使用 135° 对角渐变，白色高光收窄
  el.style.backgroundImage = `linear-gradient(
    135deg,
    rgb(233, 182, 75) 0%,
    rgb(249, 217, 118) 35%,
    #ffffff 50%,
    rgb(249, 217, 118) 65%,
    rgb(233, 182, 75) 100%
  )`;
  el.style.backgroundSize = '200% 200%'; // 放大背景，以便移动
  el.style.backgroundPosition = `${posX}% ${posY}%`; // 移动白色高光
  el.style.backgroundClip = 'text';
  el.style.webkitBackgroundClip = 'text';
  el.style.webkitTextFillColor = 'transparent';
  el.style.textShadow = `
    0 0 4px rgba(255, 255, 255, 0.3),
    0 0 10px rgba(233, 182, 75, 0.15)
  `;
};

/**
 * 清除内联样式，恢复 CSS 默认
 */
const clearTextStyle = (el: HTMLElement) => {
  el.style.backgroundImage = '';
  el.style.backgroundSize = '';
  el.style.backgroundPosition = '';
  el.style.backgroundClip = '';
  el.style.webkitBackgroundClip = '';
  el.style.webkitTextFillColor = '';
  el.style.textShadow = '';
};

const handleEnter = () => {
  console.log('鼠标进入');
};

const handleLeave = () => {
  const card = cardRef.value;
  const tier = tierRef.value;
  const price = priceValueRef.value;

  if (card) {
    card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg)`;
  }
  if (tier) clearTextStyle(tier);
  if (price) clearTextStyle(price);
};

const handleOver = (event: MouseEvent) => {
  const card = cardRef.value;
  const tier = tierRef.value;
  const price = priceValueRef.value;
  if (!card || !tier || !price) return;

  const cardRect = card.getBoundingClientRect();
  const cardHalfHeight = cardRect.height / 2;
  const cardHalfWidth = cardRect.width / 2;
  const cardCenterX = cardRect.left + cardHalfWidth;
  const cardCenterY = cardRect.top + cardHalfHeight;

  // 1. 计算卡片倾斜角度（保留原有逻辑）
  const rotateRate = 25;
  const mouseY = event.clientY;
  const mouseX = event.clientX;
  const cardRotateX = cardHalfHeight + cardRect.top - mouseY;
  const cardRotateY = cardHalfWidth + cardRect.left - mouseX;
  card.style.transform = `perspective(800px) rotateX(${cardRotateX / rotateRate}deg) rotateY(${-cardRotateY / rotateRate}deg) translateZ(10px)`;

  // 2. 计算鼠标相对中心的偏移比例，用于控制背景位置（扫光效果）
  const offsetX = (mouseX - cardCenterX) / cardHalfWidth; // -1 ~ 1
  const offsetY = (mouseY - cardCenterY) / cardHalfHeight; // -1 ~ 1

  // 3. 仅年卡应用动态文本渐变
  if (props.type === 'year') {
    applyYearTextGradient(tier, offsetX, offsetY);
    applyYearTextGradient(price, offsetX, offsetY);
  } else {
    clearTextStyle(tier);
    clearTextStyle(price);
  }
};
</script>

<style scoped lang="scss">
/* 样式保持不变，与原代码相同 */
.card {
  width: 320px;
  min-height: 460px;
  border-radius: var(--ao-border-radius-xl);
  border: 1.5px solid;
  position: relative;
  backdrop-filter: blur(22px);
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  transform-style: preserve-3d;
  cursor: pointer;
}

.card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--ao-spacing-xl) var(--ao-spacing-lg);
  height: 100%;
  box-sizing: border-box;
  gap: var(--ao-spacing-md);
}

.card-tier {
  font-size: var(--ao-font-size-xl);
  font-weight: 700;
  letter-spacing: 4px;
}

.card-price {
  display: flex;
  align-items: baseline;
  margin: var(--ao-spacing-xs) 0;
}

.price-symbol {
  font-size: var(--ao-font-size-lg);
  font-weight: 600;
  margin-right: 2px;
}

.price-value {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -1px;
}

.price-unit {
  font-size: var(--ao-font-size-sm);
  font-weight: 500;
  margin-left: 2px;
}

.card-saving {
  font-size: var(--ao-font-size-xs);
  padding: 4px 14px;
  border-radius: 9999px;
  letter-spacing: 1px;
  margin-top: -8px;
}

.card-benefits {
  list-style: none;
  padding: 0;
  margin: var(--ao-spacing-xs) 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-sm);
  width: 100%;

  li {
    font-size: var(--ao-font-size-sm);
    display: flex;
    align-items: center;
    gap: var(--ao-spacing-xs);
    transition: all 0.2s ease-in-out;
  }
}

.benefit-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.card-btn {
  margin-top: auto;
  width: 100%;
}

.vip-mark {
  position: absolute;
  right: 12px;
  bottom: 88px;
  font-family: 'Times New Roman', 'Georgia', 'Playfair Display', serif;
  font-size: 110px;
  font-weight: 900;
  font-style: italic;
  letter-spacing: 8px;
  pointer-events: none;
  user-select: none;
  opacity: 0.07;
  transform: rotate(-6deg);
}

/* ===== 月卡 - 青色系 ===== */
.month-card {
  border-color: rgba(0, 230, 230, 0.5);
  background: linear-gradient(
    145deg,
    rgba(0, 55, 70, 0.55) 0%,
    rgba(0, 30, 40, 0.78) 100%
  );
  box-shadow:
    0 0 30px rgba(0, 181, 181, 0.2),
    0 0 60px rgba(0, 181, 181, 0.08),
    inset 0 1px 0 rgba(0, 181, 181, 0.1);

  &:hover {
    box-shadow:
      0 0 40px rgba(0, 181, 181, 0.3),
      0 0 80px rgba(0, 181, 181, 0.12),
      inset 0 1px 0 rgba(0, 181, 181, 0.15);
  }

  .card-tier {
    color: var(--ao-color-primary);
  }

  .price-symbol,
  .price-value,
  .price-unit {
    color: #fff;
  }

  .benefit-dot {
    background: var(--ao-color-primary);
    box-shadow: 0 0 6px rgba(0, 181, 181, 0.5);
  }

  li {
    color: rgba(255, 255, 255, 0.7);

    &:hover {
      text-shadow:
        0 0 8px rgba(0, 181, 181, 1),
        0 0 25px rgba(0, 181, 181, 0.7),
        0 0 60px rgba(0, 181, 181, 0.4);
    }
  }

  .vip-mark {
    color: var(--ao-color-primary);
  }
}

/* ===== 年卡 - 金色系 ===== */
.year-card {
  border-color: rgba(233, 182, 75, 0.55);
  background: linear-gradient(
    145deg,
    rgba(60, 40, 18, 0.6) 0%,
    rgba(30, 18, 8, 0.82) 100%
  );
  box-shadow:
    0 0 30px rgba(233, 182, 75, 0.2),
    0 0 60px rgba(233, 182, 75, 0.08),
    inset 0 1px 0 rgba(249, 217, 118, 0.1);

  &:hover {
    box-shadow:
      0 0 40px rgba(233, 182, 75, 0.3),
      0 0 80px rgba(233, 182, 75, 0.12),
      inset 0 1px 0 rgba(249, 217, 118, 0.16);
  }

  .card-tier {
    background: linear-gradient(135deg, rgb(249, 217, 118), rgb(233, 182, 75));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .price-symbol,
  .price-value,
  .price-unit {
    background: linear-gradient(180deg, rgb(249, 217, 118), rgb(233, 182, 75));
    background-clip: text;
    -webkit-background-clip: text;
    background-size: 200% 200%;
    -webkit-text-fill-color: transparent;
  }

  .card-saving {
    color: rgb(233, 182, 75);
    background: rgba(168, 123, 62, 0.15);
    border: 1px solid rgba(168, 123, 62, 0.25);
  }

  .benefit-dot--gold {
    background: rgb(233, 182, 75);
    box-shadow: 0 0 6px rgba(233, 182, 75, 0.6);
  }

  li {
    color: rgba(255, 255, 255, 0.75);

    &:hover {
      text-shadow:
        0 0 10px gold,
        0 0 20px gold,
        0 0 40px #ffaa00,
        0 0 80px #ff8800;
    }
  }

  .vip-mark {
    opacity: 0.1;
    background: linear-gradient(135deg, rgb(249, 217, 118), rgb(233, 182, 75));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

@keyframes sword-glow {
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>
