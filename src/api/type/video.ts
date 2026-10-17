interface Author {
  id: number;
  name: string;
  /** 作者头像，缺省时使用默认头像兜底 */
  avatar?: string;
  /** 作者简介，缺省时展示兜底文案 */
  bio?: string;
}

interface VideoMeta {
  playCount: number;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  shareCount: number;
}

interface VideoInfo {
  cover: string;
  url: string;
  duration: number; // 单位：秒
}

/** 视频章节（支持多级，按树形展示） */
export interface VideoChapter {
  id: number;
  title: string;
  /** 时长（秒），可选 */
  duration?: number;
  /** 是否可免费观看，付费视频中为 false 的章节会标记为需付费 */
  free?: boolean;
  /** 子章节 */
  children?: VideoChapter[];
}

export interface Video {
  id: number;
  title: string;
  description: string;
  tags: string[];
  repostAllow: boolean;
  publishTime: string; // 格式: YYYY-MM-DD
  isHot: boolean;
  isRecommended: boolean;
  isNew: boolean;
  author: Author;
  meta: VideoMeta;
  video: VideoInfo;
  /** 是否付费视频 */
  isPaid?: boolean;
  /** 价格（元），付费视频展示 */
  price?: number;
  /** 详细介绍（Markdown），有值时按 Markdown 渲染，否则用 description 纯文本 */
  detail?: string;
  /** 章节列表（树形），没有章节时不展示 */
  chapters?: VideoChapter[];
}
