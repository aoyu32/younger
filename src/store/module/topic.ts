import { computed, ref } from 'vue';
import { currentTopicUser, topicList } from '@/mock/topic';
import type {
  TopicItem,
  TopicReplyTarget,
} from '@/view/topic/types';

const topics = ref<TopicItem[]>(JSON.parse(JSON.stringify(topicList)));

const sortByDateDesc = (list: TopicItem[]) =>
  [...list].sort((a, b) => b.date.localeCompare(a.date));

const activeTopicId = ref(topics.value[0]?.id ?? 0);

const activeTopic = computed(
  () =>
    topics.value.find((item) => item.id === activeTopicId.value) ??
    topics.value[0],
);

const latestTopic = computed(() => sortByDateDesc(topics.value)[0]);

const historyList = computed(() =>
  sortByDateDesc(topics.value).map(({ id, title, date, tags }) => ({
    id,
    title,
    date,
    tag: tags[0] ?? '',
  })),
);

const selectTopic = (id: number) => {
  activeTopicId.value = id;
};

const likeMessage = (id: number | string) => {
  const target = activeTopic.value?.messages.find((item) => item.id === id);
  if (!target) return;

  target.liked = !target.liked;
  target.likes = Math.max((target.likes ?? 0) + (target.liked ? 1 : -1), 0);
};

const pad = (value: number) => String(value).padStart(2, '0');

const sendMessage = (payload: {
  text: string;
  images: string[];
  replyTo?: TopicReplyTarget | null;
}) => {
  if (!activeTopic.value) return;

  const now = new Date();
  const createdAt = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate(),
  )}T${pad(now.getHours())}:${pad(now.getMinutes())}:00`;

  activeTopic.value.messages.push({
    id: `m-${Date.now()}`,
    user: currentTopicUser,
    content: payload.text,
    images: payload.images,
    createdAt,
    likes: 0,
    replyTo: payload.replyTo ?? undefined,
  });
};

export const useTopic = () => ({
  topics,
  activeTopicId,
  activeTopic,
  latestTopic,
  historyList,
  selectTopic,
  likeMessage,
  sendMessage,
});
