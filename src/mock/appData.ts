// const ICONS = [
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/facebook.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/whatsapp.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/telegram.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/youtube.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/tiktok.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/snapchat.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/github.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/figma.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/notion.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/discord.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/spotify.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/apple.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/android.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/firefox.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/react.svg',
//   'https://cdn.jsdelivr.net/npm/simple-icons@v16/icons/docker.svg',
// ];

import logo from '@/assets/logo.png';
import google from '@/assets/google.png';
import googledisk from '@/assets/googledisk.png';
import aoyukmt from '@/assets/bandzip.png';
import groupy from '@/assets/groupy.png';
import edge from '@/assets/edge.png';
import firefox from '@/assets/firefox.png';
import bitdock from '@/assets/bitdock.png';
import drawio from '@/assets/draw.io.png';
import clion from '@/assets/clion.png';
import idea from '@/assets/idea.png';
import lively from '@/assets/lively.png';

// ─── Icon 列表（与 appData 保持一致）──────────────────────────────────────────
const ICONS = [
  logo,
  google,
  googledisk,
  aoyukmt,
  groupy,
  edge,
  firefox,
  bitdock,
  drawio,
  clion,
  idea,
  lively,
];

const pickIcon = (id: number) => ICONS[id % ICONS.length];

export const appData = [
  {
    icon: pickIcon(0),
    id: 0,
    name: 'AOYUKMT',
    description: '一个实用的按键映射工具',
    category: '系统工具',
    size: 23.5 * 1024 * 1024,
  },
  {
    icon: pickIcon(1),
    id: 1,
    name: '语音点名',
    description: '一个实用的点名签到工具',
    category: '签到工具',
    size: 12.3 * 1024 * 1024,
  },
  {
    icon: pickIcon(2),
    id: 2,
    name: '智能考勤',
    description: '基于人脸识别的智能考勤系统',
    category: '签到工具',
    size: 15.9 * 1024 * 1024,
  },
  {
    icon: pickIcon(3),
    id: 3,
    name: '课堂互动',
    description: '增强课堂互动性的教学工具',
    category: '教学工具',
    size: 18.7 * 1024 * 1024,
  },
  {
    icon: pickIcon(4),
    id: 4,
    name: '作业管理',
    description: '便捷的作业布置与批改平台',
    category: '学习工具',
    size: 14.7 * 1024 * 1024,
  },
  {
    icon: pickIcon(5),
    id: 5,
    name: '备课助手',
    description: '快速生成课件与课堂节奏规划',
    category: '教学工具',
    size: 20.1 * 1024 * 1024,
  },
  {
    icon: pickIcon(6),
    id: 6,
    name: '试卷管理',
    description: '试卷录入、组卷与批改统计',
    category: '学习工具',
    size: 16.4 * 1024 * 1024,
  },
  {
    icon: pickIcon(7),
    id: 7,
    name: '资源库管理',
    description: '教学资源集中存储与分享',
    category: '资源工具',
    size: 17.2 * 1024 * 1024,
  },
  {
    icon: pickIcon(8),
    id: 8,
    name: '在线考试',
    description: '支持多种题型的在线考试系统',
    category: '教学工具',
    size: 22.5 * 1024 * 1024,
  },
  {
    icon: pickIcon(9),
    id: 9,
    name: '学习分析',
    description: '学情数据可视化与个性化推荐',
    category: '数据工具',
    size: 19.6 * 1024 * 1024,
  },
  {
    icon: pickIcon(10),
    id: 10,
    name: '视频会议',
    description: '高清稳定的远程教学会议工具',
    category: '协作工具',
    size: 25.1 * 1024 * 1024,
  },
  {
    icon: pickIcon(11),
    id: 11,
    name: '课堂反馈',
    description: '实时收集学生课堂疑问与评分',
    category: '教学工具',
    size: 13.8 * 1024 * 1024,
  },
  {
    icon: pickIcon(12),
    id: 12,
    name: '智能白板',
    description: '手势识别的互动教学白板',
    category: '教学工具',
    size: 31.2 * 1024 * 1024,
  },
  {
    icon: pickIcon(13),
    id: 13,
    name: '云盘同步',
    description: '教学资料多端实时同步',
    category: '存储工具',
    size: 28.4 * 1024 * 1024,
  },
  {
    icon: pickIcon(14),
    id: 14,
    name: 'AI 批改',
    description: '智能批改主观题与作文',
    category: 'AI工具',
    size: 36.7 * 1024 * 1024,
  },
  {
    icon: pickIcon(15),
    id: 15,
    name: '课表管理',
    description: '可视化课表编排与提醒',
    category: '效率工具',
    size: 21.3 * 1024 * 1024,
  },
  {
    icon: pickIcon(16),
    id: 16,
    name: '屏幕录制',
    description: '轻量级微课录制与剪辑',
    category: '教学工具',
    size: 27.8 * 1024 * 1024,
  },
  {
    icon: pickIcon(17),
    id: 17,
    name: '编程课堂',
    description: '少儿编程在线编辑器',
    category: '开发工具',
    size: 24.9 * 1024 * 1024,
  },
  {
    icon: pickIcon(18),
    id: 18,
    name: '文献检索',
    description: '教育类文献聚合检索',
    category: '阅读工具',
    size: 19.4 * 1024 * 1024,
  },
  {
    icon: pickIcon(19),
    id: 19,
    name: '班级通知',
    description: '家校通知一键群发',
    category: '通讯工具',
    size: 16.2 * 1024 * 1024,
  },
  {
    icon: pickIcon(20),
    id: 20,
    name: '成绩分析',
    description: '班级成绩统计与趋势预测',
    category: '数据工具',
    size: 23.6 * 1024 * 1024,
  },
  {
    icon: pickIcon(21),
    id: 21,
    name: '板书批注',
    description: 'PDF 课件随手批注与共享',
    category: '效率工具',
    size: 18.3 * 1024 * 1024,
  },
  {
    icon: pickIcon(22),
    id: 22,
    name: '口语测评',
    description: 'AI 驱动的英语口语评测',
    category: 'AI工具',
    size: 33.5 * 1024 * 1024,
  },
  {
    icon: pickIcon(23),
    id: 23,
    name: '校园电台',
    description: '校园广播与音频节目管理',
    category: '媒体工具',
    size: 22.7 * 1024 * 1024,
  },
];