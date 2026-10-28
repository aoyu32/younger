/** 展示类型 */
export type AoLoadingType = 'base' | 'global';

export interface AoLoadingProps {
  /**
   * 展示类型
   * - base：基础小尺寸，用于按钮、行内、文字旁的加载
   * - global：遮罩层，覆盖大盒子或整个页面
   */
  type?: AoLoadingType;
  /** 是否加载中，默认 true（放到页面上就显示） */
  loading?: boolean;
  /** 文案，仅 global 生效，传 '' 只显示动画 */
  text?: string;
  /** 仅 global：true 全屏固定并挂到 body，false 覆盖最近的定位父元素 */
  fullscreen?: boolean;
  /** 图标宽度，默认 base 为 1em（跟随字号，不撑高行盒）、global 为 100px；数字按 px 处理 */
  size?: number | string;
  /** 仅 global：是否显示半透明遮罩背景，默认 true */
  mask?: boolean;
}
