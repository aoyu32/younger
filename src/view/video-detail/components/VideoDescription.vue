<template>
  <section class="video-description">
    <h2 class="video-description__title">{{ title }}</h2>

    <div class="video-description__body">
      <p v-if="!content" class="video-description__empty">暂无介绍</p>

      <!-- Markdown 介绍 -->
      <AoMarkdown
        v-else-if="type === 'markdown'"
        mode="preview"
        :content="content"
        :preview-props="{ previewTheme: 'default' }"
      />

      <!-- 纯文本介绍：保留换行 -->
      <p v-else class="video-description__text">{{ content }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import AoMarkdown from '@/components/ao-markdown/index.vue';

defineOptions({ name: 'VideoDescription' });

withDefaults(
  defineProps<{
    /** 介绍内容 */
    content?: string;
    /** 渲染方式：markdown 用 Markdown 渲染，text 按纯文本展示 */
    type?: 'markdown' | 'text';
    /** 区块标题 */
    title?: string;
  }>(),
  {
    content: '',
    type: 'text',
    title: '视频介绍',
  },
);
</script>

<style lang="scss" scoped>
@use './VideoDescription.scss' as *;
</style>
