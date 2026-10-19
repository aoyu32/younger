import { ref } from 'vue';
import { webTools } from '@/mock/webTools';

export interface WebsiteLink {
  id?: number;
  icon: string;
  name: string;
  url?: string;
}

const collectList = ref<WebsiteLink[]>([...webTools]);
const historyList = ref<WebsiteLink[]>([]);

export const useWebsite = () => ({
  collectList,
  historyList,
});
