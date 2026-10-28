/**
 * AoMessage 命令式调用
 *
 * import { message } from '@/components/ao-message';
 *
 * message.success('保存成功');
 * message.warning({ content: '请先登录', duration: 0, showClose: false });
 */
import { createVNode, render } from 'vue';
import MessageContainer from './container.vue';
import { addMessage, messageState, removeMessage } from './state';
import type { AoMessageOptions } from './types';

export * from './types';

/** 手动关闭 */
export type MessageHandle = () => void;

let mounted = false;

function ensureMounted(): void {
  if (mounted || typeof document === 'undefined') return;
  const host = document.createElement('div');
  document.body.appendChild(host);
  render(createVNode(MessageContainer), host);
  mounted = true;
}

/** 显示一条消息，返回手动关闭函数 */
export function showMessage(
  options: string | AoMessageOptions = {},
): MessageHandle {
  const opts: AoMessageOptions =
    typeof options === 'string' ? { content: options } : options;

  if (typeof document === 'undefined') return () => {};

  ensureMounted();
  const id = addMessage(opts);

  return () => {
    removeMessage(id);
    opts.onClose?.();
  };
}

/** 关闭全部消息 */
export function closeAll(): void {
  [...messageState.list].forEach((item) => {
    removeMessage(item.id);
    item.options.onClose?.();
  });
}

type MessageFactory = (
  options?: string | Omit<AoMessageOptions, 'type'>,
) => MessageHandle;

const create =
  (type: AoMessageOptions['type']): MessageFactory =>
  (options = {}) =>
    showMessage({
      ...(typeof options === 'string' ? { content: options } : options),
      type,
    });

export const message = {
  show: showMessage,
  primary: create('primary'),
  success: create('success'),
  warning: create('warning'),
  info: create('info'),
  error: create('error'),
  closeAll,
};

export default message;
