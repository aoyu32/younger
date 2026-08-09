<template>
  <div class="scroll-text" :style="{ height: height }">
    <div class="scroll_container">
      <div class="label_wrapper">
        <p>{{ lable }}</p>
      </div>
      <div class="text_wrapper">
        <div class="scroll_content">
          <span class="text-item">{{ text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ScrollText',
});

defineProps({
  lable: {
    type: String,
    default: '默认标题',
  },
  text: {
    type: String,
    default: '默认文本',
  },
  height: {
    type: String,
    default: '30px',
  },
  speed: {
    type: Number,
    default: 60,
  },
});
</script>

<style lang="scss" scoped>
.scroll-text {
  width: 100%;

  .scroll_container {
    width: 100%;
    height: 100%;
    border-radius: var(--ao-border-radius-sm);
    background-color: color-mix(
      in srgb,
      var(--ao-color-border) 42%,
      transparent
    );
    display: flex;
    align-items: center;
    overflow: hidden;

    .label_wrapper {
      flex-shrink: 0;
      padding: 0 var(--ao-spacing-sm);
      font-weight: var(--ao-font-weight-semibold);
      color: var(--ao-gray-0);
      background-color: var(--ao-color-text-tertiary);
      height: 100%;
      display: flex;
      align-items: center;
      position: relative;

      p {
        margin: 0;
        white-space: nowrap;
      }
    }

    .text_wrapper {
      flex: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
      width: 100%;

      .scroll_content {
        position: absolute;
        top: 0;
        height: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;
        animation: scroll-left-to-right 15s linear infinite;
        &::after {
          content: '';
          display: block;
          position: absolute;
          border-radius: var(--ao-border-radius-sm);
          width: 100px;
          height: 2px;
          bottom: 0px;
          right: 25px;
          background-color: var(--ao-color-primary);
          margin-left: var(--ao-spacing-sm);
        }
        .text-item {
          display: inline-block;
          color: var(--ao-color-text-base);
          font-weight: var(--ao-font-weight-medium);
          padding: 0 var(--ao-spacing-sm);
        }
      }
    }
  }
}
@keyframes scroll-left-to-right {
  from {
    left: 0;
    transform: translateX(-100%);
  }
  to {
    left: 100%;
    transform: translateX(0);
  }
}
</style>
