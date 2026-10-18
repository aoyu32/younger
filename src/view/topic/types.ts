export type TopicMemberLevel = 'vip' | 'svip';

export type TopicUser = {
  id: number;
  name: string;
  avatar: string;
  member?: TopicMemberLevel;
};

export type TopicMessageData = {
  id: number | string;
  user: TopicUser;
  content?: string;
  images?: string[];
  createdAt: string;
  likes: number;
  liked?: boolean;
  replyTo?: TopicReplyTarget;
};

export type TopicReplyTarget = {
  id: number | string;
  name: string;
  content: string;
};

export type TopicItem = {
  id: number;
  title: string;
  date: string;
  tags: string[];
  participants: number;
  messages: TopicMessageData[];
};

export type TopicHistoryItem = {
  id: number;
  title: string;
  date: string;
  tag: string;
};
