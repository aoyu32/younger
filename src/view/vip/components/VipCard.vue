<template>
  <div :class="['card', type === 'year' ? 'year-card' : 'month-card']">
    <div class="card-inner">
      <div class="card-tier">{{ tier }}</div>
      <div class="card-price">
        <span class="price-symbol">{{ priceSymbol }}</span>
        <span class="price-value">{{ priceValue }}</span>
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
defineProps<{
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
</script>

<style scoped lang="scss">
.card {
  width: 320px;
  min-height: 460px;
  border-radius: var(--ao-border-radius-xl);
  border: 1.5px solid;
  backdrop-filter: blur(32px);
  position: relative;
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.35s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-6px);
  }
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
  }

  .vip-mark {
    opacity: 0.1;
    background: linear-gradient(135deg, rgb(249, 217, 118), rgb(233, 182, 75));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
</style>
