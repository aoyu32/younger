/**
 * 视频详情页右侧「相关应用 / 相关网站」mock
 * 一个通用结构：应用（站内）/ 网站（外链）字段一致，external 决定跳转方式
 */
import bandzipIcon from '@/assets/bandzip.png';
import edgeIcon from '@/assets/edge.png';
import googlediskIcon from '@/assets/googledisk.png';
import ideaIcon from '@/assets/idea.png';

export interface RelatedAppItem {
  /** 图标：站内资源或站外 favicon */
  icon: string;
  name: string;
  /** 类别：如 开发工具 / 浏览器 */
  category: string;
  /** 简介（最多两行，超出省略） */
  description: string;
  /** 应用为站内路由 /app/:id，网站为外部 URL */
  link: string;
  /** 外链时新窗口打开 */
  external?: boolean;
}

export const relatedApps: RelatedAppItem[] = [
  {
    icon: ideaIcon,
    name: 'IntelliJ IDEA',
    category: '开发工具',
    description: 'JetBrains 出品的 Java / Kotlin 一体化 IDE，智能补全与调试体验一流。',
    link: '/app/1',
  },
  {
    icon: edgeIcon,
    name: 'Microsoft Edge',
    category: '浏览器',
    description: '基于 Chromium 的现代浏览器，内置 AI 助手与高效的标签分区管理。',
    link: '/app/2',
  },
  {
    icon: bandzipIcon,
    name: 'Bandizip',
    category: '系统工具',
    description: '高速压缩解压工具，支持多种格式与智能快速解压。',
    link: '/app/3',
  },
  {
    icon: googlediskIcon,
    name: 'Google Drive',
    category: '云存储',
    description: '跨平台云端存储与协作，多设备文件实时同步。',
    link: '/app/4',
  },
];

export const relatedSites: RelatedAppItem[] = [
  {
    icon: 'https://toolb.cn/favicon/stackoverflow.com',
    name: 'Stack Overflow',
    category: '技术社区',
    description: '面向开发者的高质量问答社区，疑难杂症基本都能搜到答案。',
    link: 'https://stackoverflow.com',
    external: true,
  },
  {
    icon: 'https://toolb.cn/favicon/developer.mozilla.org',
    name: 'MDN Web Docs',
    category: '文档手册',
    description: 'Web 技术权威文档，HTML / CSS / JS 规范与兼容性速查。',
    link: 'https://developer.mozilla.org',
    external: true,
  },
  {
    icon: 'https://toolb.cn/favicon/juejin.cn',
    name: '稀土掘金',
    category: '技术社区',
    description: '中文开发者技术社区，前沿工程实践与经验分享。',
    link: 'https://juejin.cn',
    external: true,
  },
    {
    icon: 'https://toolb.cn/favicon/developer.mozilla.org',
    name: 'MDN Web Docs',
    category: '文档手册',
    description: 'Web 技术权威文档，HTML / CSS / JS 规范与兼容性速查。',
    link: 'https://developer.mozilla.org',
    external: true,
  },
  {
    icon: 'https://toolb.cn/favicon/juejin.cn',
    name: '稀土掘金',
    category: '技术社区',
    description: '中文开发者技术社区，前沿工程实践与经验分享。',
    link: 'https://juejin.cn',
    external: true,
  },
    {
    icon: 'https://toolb.cn/favicon/developer.mozilla.org',
    name: 'MDN Web Docs',
    category: '文档手册',
    description: 'Web 技术权威文档，HTML / CSS / JS 规范与兼容性速查。',
    link: 'https://developer.mozilla.org',
    external: true,
  },
  {
    icon: 'https://toolb.cn/favicon/juejin.cn',
    name: '稀土掘金',
    category: '技术社区',
    description: '中文开发者技术社区，前沿工程实践与经验分享。',
    link: 'https://juejin.cn',
    external: true,
  },
    {
    icon: 'https://toolb.cn/favicon/developer.mozilla.org',
    name: 'MDN Web Docs',
    category: '文档手册',
    description: 'Web 技术权威文档，HTML / CSS / JS 规范与兼容性速查。',
    link: 'https://developer.mozilla.org',
    external: true,
  },
  {
    icon: 'https://toolb.cn/favicon/juejin.cn',
    name: '稀土掘金',
    category: '技术社区',
    description: '中文开发者技术社区，前沿工程实践与经验分享。',
    link: 'https://juejin.cn',
    external: true,
  },
];
