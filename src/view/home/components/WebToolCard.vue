<template>
  <a class="web-tool-card" :href="tool.url" target="_blank" rel="noopener noreferrer">
    <div class="card_icon">
      <img v-if="tool.icon" :src="tool.icon" :alt="tool.name" />
      <div v-else class="icon_placeholder"></div>
    </div>
    <div class="card_name">{{ tool.name }}</div>
  </a>
</template>

<script setup lang="ts">
defineOptions({
  name: 'WebToolCard',
});

defineProps({
  tool: {
    type: Object,
    default: () => ({
      id: 0,
      name: '',
      url: '',
      icon: '',
    }),
  },
});
</script>

<style scoped lang="scss">
.web-tool-card {
  width: 100%;
  height: 100%;
  min-height: 111px;
  background-color: var(--ao-color-bg-container);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: var(--ao-spacing-xs);
  text-decoration: none;
  border: var(--ao-border-width-thin) solid var(--ao-color-border);
  box-sizing: border-box;

  .card_icon {
    width: var(--ao-control-height-md);
    height: var(--ao-control-height-md);
    border-radius: var(--ao-border-radius-xl);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: var(--ao-control-height-md);
      height: var(--ao-control-height-md);
      object-fit: cover;
    }

    .icon_placeholder {
      width: var(--ao-control-height-md);
      height: var(--ao-control-height-md);
      background-color: var(--ao-color-border);
    }
  }

  .card_name {
    width: 100%;
    font-size: var(--ao-font-size-sm);
    font-weight: var(--ao-font-weight-semibold);
    text-align: center;
    line-height: var(--ao-line-height-tight);
    color: var(--ao-color-text-base);
    opacity: var(--ao-opacity-hover);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
