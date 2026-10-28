import { reactive } from 'vue';
import type { AoMessageItem, AoMessageOptions } from './types';

export interface AoMessageState {
  list: AoMessageItem[];
}

/** 当前展示的消息队列 */
export const messageState = reactive<AoMessageState>({ list: [] });

let seed = 0;

export function addMessage(options: AoMessageOptions): number {
  const id = ++seed;
  messageState.list.push({ id, options });
  return id;
}

export function removeMessage(id: number): void {
  const index = messageState.list.findIndex((item) => item.id === id);
  if (index > -1) {
    messageState.list.splice(index, 1);
  }
}
