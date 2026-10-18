<template>
  <div class="topic">
    <section class="topic-main">
      <TopicInfo
        :title="activeTopic.title"
        :date="activeTopic.date"
        :tags="activeTopic.tags"
        :participants="activeTopic.participants"
      />
      <TopicChat
        :messages="activeTopic.messages"
        @reply="handleReply"
        @like="handleLike"
        @preview="handlePreview"
      />
      <TopicEditor
        :reply-to="replyTarget"
        @send="handleSend"
        @cancel-reply="handleCancelReply"
      />
    </section>
    <aside class="topic-sidebar">
      <TopicHistory
        :list="historyList"
        :active-id="activeTopicId"
        @select="handleSelect"
      />
    </aside>

    <AoImagePreview
      v-model="previewVisible"
      :images="previewImages"
      :start-index="previewIndex"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useTopic } from '@/store/module/topic';
import TopicInfo from './components/TopicInfo.vue';
import TopicChat from './components/TopicChat.vue';
import TopicEditor from './components/TopicEditor.vue';
import TopicHistory from './components/TopicHistory.vue';
import type { TopicMessageData, TopicReplyTarget } from './types';

defineOptions({
  name: 'Topic',
});

const {
  activeTopicId,
  activeTopic,
  historyList,
  selectTopic,
  likeMessage,
  sendMessage,
} = useTopic();

const replyTarget = ref<TopicReplyTarget | null>(null);

const previewVisible = ref(false);
const previewImages = ref<string[]>([]);
const previewIndex = ref(0);

const handlePreview = ({
  images,
  index,
}: {
  images: string[];
  index: number;
}) => {
  previewImages.value = images;
  previewIndex.value = index;
  previewVisible.value = true;
};

const handleSelect = (id: number) => {
  selectTopic(id);
  replyTarget.value = null;
};

const handleReply = (message: TopicMessageData) => {
  replyTarget.value = {
    id: message.id,
    name: message.user.name,
    content: message.content?.trim() || '[图片]',
  };
};

const handleCancelReply = () => {
  replyTarget.value = null;
};

const handleLike = (id: number | string) => {
  likeMessage(id);
};

const handleSend = ({ text, images }: { text: string; images: string[] }) => {
  sendMessage({ text, images, replyTo: replyTarget.value });
  replyTarget.value = null;
};
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
