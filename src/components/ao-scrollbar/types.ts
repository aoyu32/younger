import type { CSSProperties, StyleValue } from 'vue'

export interface AoScrollbarProps {
  /** 容器高度，默认撑满父元素 */
  height?: CSSProperties['height']
  /** 内容最大高度，超出后出现纵向滚动 */
  maxHeight?: CSSProperties['max-height']
  /** 内容包裹层使用的标签 */
  tag?: string
  /** 透传给滚动容器的 class */
  wrapClass?: string
  /** 透传给滚动容器的样式 */
  wrapStyle?: StyleValue
  /** 是否常显滚动条（默认悬浮才显示） */
  always?: boolean
  /** 使用浏览器原生滚动条，不渲染自定义滚动条 */
  native?: boolean
  /** 滚动条轨道颜色 */
  trackColor?: string
  /** 滑块颜色 */
  thumbColor?: string
}

export interface AoScrollbarScrollEvent {
  scrollTop: number
  scrollLeft: number
}
