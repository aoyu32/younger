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

<script setup>
defineOptions({
  name: 'ScrollText'
})

defineProps({
  lable: {
    type: String,
    default: '默认标题'
  },
  text: {
    type: String,
    default: '默认文本'
  },
  height: {
    type: String,
    default: '30px'
  },
  speed: {
    type: Number,
    default: 60
  }
})
</script>

<style lang="scss" scoped>
.scroll-text {
  width: 100%;

  .scroll_container {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    background-color: var(--scroll-text-bg-color);
    display: flex;
    align-items: center;
    overflow: hidden;

    .label_wrapper {
      flex-shrink: 0;
      padding: 0 12px;
      font-weight: 600;
      color: var(--app-bg-color-light);
      background-color: var(--scroll-text-label-bg-color);
      height: 100%;
      display: flex;
      align-items: center;

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

        .text-item {
          display: inline-block;
          color: var(--app-text-color-dark);
          font-weight: 500;
          padding: 0 10px;
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