<template>
  <div class="page-slogan">
    <div class="content">
      <div class="block"></div>
      <p>{{ content }}</p>
    </div>
    <span>{{ subContent }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const props = defineProps({
  content: {
    type: String,
    defult: '这是标语',
  },
  subContent: {
    type: String,
    defult: '这是副标语',
  },
});
</script>

<style scoped lang="scss">
.page-slogan {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background-color: var(--ao-gray-2);
  padding: 16px 10px;
  margin-bottom: 15px;
  font-family: var(--ao-font-family-dinglie);
  color: var(--ao-gray-7);
  border-radius: var(--ao-border-radius-base);
  /* 装饰体字面占比比常规字体小，同 px 会显小，放大一档补偿 */
  font-size: var(--ao-font-size-xl);
  span {
    font-size: var(--ao-font-size-base);
  }
}

.content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.block {
  width: 5px;
  height: calc(var(--ao-font-size-lg) - 4px);
  margin-right: 5px;
  border-radius: 3px;
  background-color: var(--ao-lime-7);
}

/* 窄屏：缩小标语字号，避免长标语与右侧副标题挤压溢出 */
@media (max-width: 768px) {
  .page-slogan {
    font-size: var(--ao-font-size-lg);
  }
}

@media (max-width: 480px) {
  .page-slogan {
    padding: 12px 10px;
    font-size: var(--ao-font-size-sm);

    span {
      font-size: var(--ao-font-size-xs);
    }
  }
}
</style>
