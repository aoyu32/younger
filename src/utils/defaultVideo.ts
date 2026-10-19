import defaultVideoOne from '@/assets/default-video/default.mp4';
import defaultVideoTwo from '@/assets/default-video/default_2.mp4';

const DEFAULT_VIDEOS = [defaultVideoOne, defaultVideoTwo];

/** 视频加载失败时随机取一个本地兜底视频 */
export const getRandomDefaultVideo = (): string =>
  DEFAULT_VIDEOS[Math.floor(Math.random() * DEFAULT_VIDEOS.length)];
