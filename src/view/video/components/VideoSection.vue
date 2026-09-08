<template>
  <div class="video-section">
    <div class="section-header">
      <div class="label flex-between">
        <div class="title">{{ title }}</div>
        <div class="sub-title">{{ subTitle }}</div>
      </div>
    </div>
    <div class="section-content">
      <div class="video-list">
        <div v-for="item in items" :key="item.id" class="video-item">
          <slot name="video-card" :item="item"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  subTitle?: string;
  items?: any[];
}>();
</script>

<style scoped lang="scss">
.video-section {
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    padding: 10px 15px;
    background-color: var(--ao-gray-2);
    border-radius: var(--ao-border-radius-sm);
    position: relative;
    &::after {
      content: '';
      height: 50%;
      aspect-ratio: 1 / 1;
      border-radius: var(--ao-border-radius-sm);
      position: absolute;
      top: 0;
      left: 0;

      --border-gradient-start: var(--ao-lime-7);
      --border-gradient-end: #ffffffd0;

      background:
        linear-gradient(
            to right,
            var(--border-gradient-start),
            var(--border-gradient-end)
          )
          top left / 100% 3px no-repeat,
        linear-gradient(
            to bottom,
            var(--border-gradient-start),
            var(--border-gradient-end)
          )
          top left / 3px 100% no-repeat;
    }
    .label {
      width: 100%;

      .title {
        font-size: var(--ao-font-size-base);
        font-weight: 700;
        color: var(--ao-gray-8);
        letter-spacing: 0.5px;
      }
      .sub-title {
        font-size: var(--ao-font-size-xs);
        color: var(--ao-gray-6);
        font-weight: 400;
      }
    }
  }

  .section-content {
    .video-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;

      .video-item {
        background: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        transition:
          transform 0.25s ease,
          box-shadow 0.25s ease;
        cursor: pointer;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.12);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .video-section {
    padding: 16px 12px;
    .section-content .video-list {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 14px;
    }
  }
}
@media (max-width: 480px) {
  .video-section .section-content .video-list {
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
}
</style>
