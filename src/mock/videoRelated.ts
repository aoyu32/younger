/**
 * 视频详情页右侧「相关应用 / 相关网站」mock
 * 一个通用结构：应用（站内）/ 网站（外链）字段一致，external 决定跳转方式
 */
import { aiAppCatalog, aiAppIcons } from './aiCatalog';

export interface RelatedAppItem {
  /** 图标：站内资源或站外 favicon */
  icon: string;
  name: string;
  /** 类别：如 AI 编程 / AI 视频 */
  category: string;
  /** 简介（最多两行，超出省略） */
  description: string;
  /** 应用为站内路由 /app/:id，网站为外部 URL */
  link: string;
  /** 外链时新窗口打开 */
  external?: boolean;
}

const appById = (id: number) => aiAppCatalog.find((app) => app.id === id)!;

const relatedApp = (id: number): RelatedAppItem => {
  const app = appById(id);
  return {
    icon: aiAppIcons[app.key],
    name: app.name,
    category: app.category,
    description: app.description,
    link: `/app/${app.id}`,
  };
};

export const relatedApps: RelatedAppItem[] = [
  relatedApp(0),
  relatedApp(1),
  relatedApp(10),
  relatedApp(17),
];

export const relatedSites: RelatedAppItem[] = [
  {
    icon: 'https://favicon.im/huggingface.co?size=128',
    name: 'Hugging Face',
    category: '模型社区',
    description: '全球最大的开源模型与数据集社区，找模型、看论文、试 Demo 一次完成。',
    link: 'https://huggingface.co',
    external: true,
  },
  {
    icon: 'https://favicon.im/jiqizhixin.com?size=128',
    name: '机器之心',
    category: 'AI 资讯',
    description: '关注全球 AI 前沿研究、产业动态与工程实践的中文媒体。',
    link: 'https://www.jiqizhixin.com',
    external: true,
  },
  {
    icon: 'https://favicon.im/arxiv.org?size=128',
    name: 'arXiv',
    category: 'AI 论文',
    description: 'AI 论文预印本首选平台，追踪大模型、多模态与 Agent 最新研究。',
    link: 'https://arxiv.org',
    external: true,
  },
  {
    icon: 'https://favicon.im/openrouter.ai?size=128',
    name: 'OpenRouter',
    category: '模型平台',
    description: '一个 API 聚合多家主流大模型，方便比较价格、延迟和效果。',
    link: 'https://openrouter.ai',
    external: true,
  },
];
