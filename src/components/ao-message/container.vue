<template>
  <TransitionGroup name="ao-msg" tag="div" class="ao-message-container">
    <div v-for="item in messageState.list" :key="item.id" class="ao-message-item">
      <div class="ao-message-item__inner">
        <AoMessage v-bind="item.options" @close="handleClose(item)" />
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import AoMessage from './index.vue';
import { messageState, removeMessage } from './state';
import type { AoMessageItem } from './types';

defineOptions({ name: 'ao-message-container' });

/** 关闭按钮（若显示）、自动关闭统一走这里 */
function handleClose(item: AoMessageItem): void {
  removeMessage(item.id);
  item.options.onClose?.();
}
</script>

<style scoped src="./container.css"></style>
