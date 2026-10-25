<template>
  <div
    :class="[
      'card',
      type === 'year' ? 'year-card' : 'month-card',
      { 'is-hovering': isHovering && type === 'year' },
    ]"
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
      <ao-button class="card-btn" :bg="buttonBg" @click="$emit('pay')">
        立即开通
      </ao-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

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

const isHovering = ref(false);
let rafId: number | null = null;
let cachedRect: DOMRect | null = null;

const handleResize = () => {
  cachedRect = null;
};

onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  if (rafId !== null) cancelAnimationFrame(rafId);
  window.removeEventListener('resize', handleResize);
});

const handleEnter = () => {
  if (cardRef.value) {
    cachedRect = cardRef.value.getBoundingClientRect();
  }
  isHovering.value = true;
};

const handleLeave = () => {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }

  const card = cardRef.value;
  if (card) {
    card.style.transform = `perspective(800px) rotateX(0deg) rotateY(0deg)`;
  }

  const tier = tierRef.value;
  const price = priceValueRef.value;
  if (tier)
    tier.style.removeProperty('--bg-x') && tier.style.removeProperty('--bg-y');
  if (price)
    price.style.removeProperty('--bg-x') &&
      price.style.removeProperty('--bg-y');

  isHovering.value = false;
  cachedRect = null;
};

const handleOver = (event: MouseEvent) => {
  if (rafId !== null) return;

  rafId = requestAnimationFrame(() => {
    rafId = null;

    const card = cardRef.value;
    if (!card) return;

    if (!cachedRect) {
      cachedRect = card.getBoundingClientRect();
    }
    const cardRect = cachedRect;
    const cardHalfHeight = cardRect.height / 2;
    const cardHalfWidth = cardRect.width / 2;
    const cardCenterX = cardRect.left + cardHalfWidth;
    const cardCenterY = cardRect.top + cardHalfHeight;

    // 卡片倾斜
    const rotateRate = 25;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const cardRotateX = cardHalfHeight + cardRect.top - mouseY;
    const cardRotateY = cardHalfWidth + cardRect.left - mouseX;
    card.style.transform = `perspective(800px) rotateX(${cardRotateX / rotateRate}deg) rotateY(${-cardRotateY / rotateRate}deg) translateZ(10px)`;

    // 仅年卡更新动态扫光位置
    if (props.type === 'year') {
      const offsetX = (mouseX - cardCenterX) / cardHalfWidth;
      const offsetY = (mouseY - cardCenterY) / cardHalfHeight;
      const posX = ((offsetX + 1) / 2) * 100;
      const posY = ((offsetY + 1) / 2) * 100;

      const tier = tierRef.value;
      const price = priceValueRef.value;
      if (tier) {
        tier.style.setProperty('--bg-x', `${posX}%`);
        tier.style.setProperty('--bg-y', `${posY}%`);
      }
      if (price) {
        price.style.setProperty('--bg-x', `${posX}%`);
        price.style.setProperty('--bg-y', `${posY}%`);
      }
    }
  });
};
</script>

<style scoped lang="scss">
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
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
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

/* ≤768（响应式）：卡片随容器等比缩放，锁定 320:460 的宽高比
   （取消 min-height，避免其覆盖 aspect-ratio 计算出的高度） */
@media (max-width: 768px) {
  .card {
    width: min(320px, 100%);
    min-height: 0;
    aspect-ratio: 320 / 460;
  }
}

/* ≤480（小屏）：内边距与字号随卡片一起收缩，保证内容仍放得下 */
@media (max-width: 480px) {
  .card-inner {
    padding: var(--ao-spacing-lg) var(--ao-spacing-md);
    gap: var(--ao-spacing-sm);
  }

  .price-value {
    font-size: 40px;
  }

  .vip-mark {
    font-size: 88px;
  }
}

.year-card.is-hovering {
  .card-tier {
    background-image: linear-gradient(
      135deg,
      rgb(233, 182, 75) 0%,
      rgb(249, 217, 118) 35%,
      #ffffff 50%,
      rgb(249, 217, 118) 65%,
      rgb(233, 182, 75) 100%
    );
    background-size: 200% 200%;
    background-position: var(--bg-x, 50%) var(--bg-y, 50%);
    text-shadow:
      0 0 4px rgba(255, 255, 255, 0.3),
      0 0 10px rgba(233, 182, 75, 0.15);
  }

  .price-value {
    background-image: linear-gradient(
      135deg,
      rgb(233, 182, 75) 0%,
      rgb(249, 217, 118) 35%,
      #ffffff 50%,
      rgb(249, 217, 118) 65%,
      rgb(233, 182, 75) 100%
    );
    background-size: 200% 200%;
    background-position: var(--bg-x, 50%) var(--bg-y, 50%);
    text-shadow:
      0 0 4px rgba(255, 255, 255, 0.3),
      0 0 10px rgba(233, 182, 75, 0.15);
  }

  .price-symbol,
  .price-unit {
    background-image: linear-gradient(
      180deg,
      rgb(249, 217, 118),
      rgb(233, 182, 75)
    );
  }
}
</style>
