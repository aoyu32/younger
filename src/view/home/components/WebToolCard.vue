<template>
  <a class="web-tool-card" :href="tool.url" target="_blank" rel="noopener noreferrer">
    <div class="card_icon">
      <img v-if="tool.icon" :src="tool.icon" :alt="tool.name" />
      <div v-else class="icon_placeholder"></div>
    </div>
    <div class="card_name">{{ tool.name }}</div>
  </a>
</template>

<script setup>
defineOptions({
  name: 'WebToolCard'
})

defineProps({
  tool: {
    type: Object,
    default: () => ({
      id: 0,
      name: '',
      url: '',
      icon: ''
    })
  }
})
</script>

<style scoped lang="scss">
.web-tool-card {
  width: 100%;
  height: 105px;
  background-color: var(--app-bg-color-light);
  border-radius: 10px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.15);
  }

  .card_icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
    }

    .icon_placeholder {
      width: 40px;
      height: 40px;
      background-color: var(--app-border-color);
    }
  }

  .card_name {
    width: 100%;
    padding: 0 10px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    line-height: 1.2;
    color: var(--app-text-color-dark);
    opacity: 0.8;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>