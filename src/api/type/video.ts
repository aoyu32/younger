interface Author {
  id: number;
  name: string;
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

export interface Video {
  id: number;
  title: string;
  description: string;
  tags: string[];
  authorRequire: boolean;
  publishTime: string; // 格式: YYYY-MM-DD
  isHot: boolean;
  isRecommended: boolean;
  isNew: boolean;
  author: Author;
  meta: VideoMeta;
  video: VideoInfo;
}