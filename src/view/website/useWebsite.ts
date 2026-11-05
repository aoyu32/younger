import { ref } from 'vue';
import { webTools } from '@/mock/webTools';

export interface WebsiteLink {
  id?: number | string;
  icon: string;
  name: string;
  url?: string;
}

const collectList = ref<WebsiteLink[]>([...webTools]);
const historyList = ref<WebsiteLink[]>([]);
const likedList = ref<string[]>([]);

/** 同一个网址只保留一份收藏 / 浏览记录 */
const linkKey = (link: WebsiteLink) => link.url || link.name;

const addHistory = (link: WebsiteLink) => {
  const key = linkKey(link);
  historyList.value = [
    link,
    ...historyList.value.filter((item) => linkKey(item) !== key),
  ].slice(0, 24);
};

const isCollected = (link: WebsiteLink) =>
  collectList.value.some((item) => linkKey(item) === linkKey(link));

const toggleCollect = (link: WebsiteLink) => {
  const key = linkKey(link);
  collectList.value = isCollected(link)
    ? collectList.value.filter((item) => linkKey(item) !== key)
    : [link, ...collectList.value];
};

const isLiked = (link: WebsiteLink) => likedList.value.includes(linkKey(link));

const toggleLike = (link: WebsiteLink) => {
  const key = linkKey(link);
  likedList.value = isLiked(link)
    ? likedList.value.filter((item) => item !== key)
    : [...likedList.value, key];
};

export const useWebsite = () => ({
  collectList,
  historyList,
  likedList,
  addHistory,
  isCollected,
  toggleCollect,
  isLiked,
  toggleLike,
});

export default useWebsite;
