/** 消息类型 */
export type AoMessageType = 'primary' | 'success' | 'warning' | 'info' | 'error';

export interface AoMessageProps {
  /** 消息类型，决定默认图标、文字色和背景色 */
  type?: AoMessageType;
  /** 文本内容，插槽优先 */
  content?: string;
  /** 文字颜色，默认用类型色（深色背景时自动转白） */
  color?: string;
  /** 背景色，默认类型色混白 12% 的不透明浅底；传深色会自动转白字白图标 */
  background?: string;
  /** 自定义图标地址（图片 URL / base64），默认用类型对应的内置图标 */
  icon?: string;
  /** 是否显示左侧图标，默认 true */
  showIcon?: boolean;
  /** 是否显示右侧关闭按钮，默认 false */
  showClose?: boolean;
  /** 自动关闭时间（ms），0 表示不自动关闭，默认 3000 */
  duration?: number;
}

export interface AoMessageOptions extends AoMessageProps {
  /** 关闭后的回调（自动关闭、点击叉号、手动关闭都会触发） */
  onClose?: () => void;
}

/** 队列中的一条消息 */
export interface AoMessageItem {
  id: number;
  options: AoMessageOptions;
}
