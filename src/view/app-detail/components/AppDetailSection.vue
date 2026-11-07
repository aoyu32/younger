<template>
  <section class="detail-section">
    <header v-if="title" class="detail-section__header">
      <h2 class="detail-section__title">{{ title }}</h2>
      <p v-if="desc" class="detail-section__desc">{{ desc }}</p>
    </header>
    <div class="detail-section__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'AppDetailSection' });

defineProps<{
  /** 区块标题 */
  title?: string;
  /** 标题下的补充说明 */
  desc?: string;
}>();
</script>

<style scoped lang="scss">
.detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--ao-spacing-md);

  &__header {
    display: flex;
    align-items: baseline;
    gap: var(--ao-spacing-sm);
  }

  &__title {
    position: relative;
    margin: 0;
    padding-left: 12px;
    font-size: var(--ao-font-size-xl);
    font-weight: var(--ao-font-weight-semibold);
    color: var(--ao-color-text-base);

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 18px;
      border-radius: 2px;
      background-color: var(--ao-color-primary);
      transform: translateY(-50%);
    }
  }

  &__desc {
    margin: 0;
    font-size: var(--ao-font-size-sm);
    color: var(--ao-color-text-tertiary);
  }
}
</style>
