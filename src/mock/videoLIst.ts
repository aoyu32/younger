// ==================== 工具函数 ====================
const minioVideoUrl = (filename: string) =>
  `${import.meta.env.VITE_MINIO_ADDRESS}/younger/video/${filename}`;

import { aiImagePool } from './aiImages';

// ==================== 类型定义 ====================
export interface VideoItem {
  id: number;
  title: string;
  description: string;
  tags: string[];
  repostAllow: boolean;
  publishTime: string;
  isHot: boolean;
  isRecommended: boolean;
  isNew: boolean;
  author: { id: number; name: string };
  meta: {
    playCount: number;
    likeCount: number;
    favoriteCount: number;
    commentCount: number;
    shareCount: number;
  };
  video: {
    cover: string;
    url: string;
    duration: number;
  };
}

export interface VideoCategory {
  category: string;
  categoryDesc: string;
  list: VideoItem[];
}

// ==================== 完整的分类数据 ====================
export const categoryData: VideoCategory[] = [
  // ---------- 分类1：大模型与基础技术 ----------
  {
    category: '大模型与基础技术',
    categoryDesc: '深入大模型原理、微调、RAG、提示词设计等核心技术',
    list: [
      {
        id: 1,
        title: '2025 AI 发展趋势：大模型、Agent 与多模态应用全景',
        description:
          '全面解析2025年AI领域的最新发展趋势，涵盖大模型、Agent技术和多模态应用的前沿动态，助你把握未来科技脉搏。',
        tags: ['AI', '大模型', 'Agent', '多模态'],
        repostAllow: true,
        publishTime: '2025-01-02',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 16842,
          likeCount: 842,
          favoriteCount: 312,
          commentCount: 56,
          shareCount: 210,
        },
        video: {
          cover: aiImagePool[0],
          url: minioVideoUrl('37721999918-1-192.mp4'),
          duration: 300,
        },
      },
      {
        id: 2,
        title: '用 ChatGPT 提升效率：提示词设计与工作流搭建实战',
        description:
          '深入讲解如何利用 ChatGPT 设计高效提示词，并搭建自动化工作流，全面提升日常办公与开发效率。',
        tags: ['AI', 'ChatGPT', '提示词设计', '工作流'],
        repostAllow: true,
        publishTime: '2024-12-18',
        isHot: true,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 24561,
          likeCount: 1228,
          favoriteCount: 612,
          commentCount: 89,
          shareCount: 245,
        },
        video: {
          cover: aiImagePool[1],
          url: minioVideoUrl('38130749343-1-192.mp4'),
          duration: 420,
        },
      },
      {
        id: 5,
        title: 'RAG 检索增强生成：从原理到落地（含向量库选择）',
        description:
          '详细讲解 RAG 技术的核心原理、应用场景，以及如何选择向量数据库进行工程落地。',
        tags: ['AI', 'RAG', '检索增强', '向量数据库'],
        repostAllow: true,
        publishTime: '2024-09-21',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 15432,
          likeCount: 771,
          favoriteCount: 386,
          commentCount: 42,
          shareCount: 154,
        },
        video: {
          cover: aiImagePool[2],
          url: minioVideoUrl('37768793798-1-192.mp4'),
          duration: 540,
        },
      },
      {
        id: 9,
        title: 'AI 视觉识别：从图片分类到目标检测的学习路径',
        description:
          '系统讲解 AI 视觉识别的发展路径，从基础的图片分类到目标检测，并提供学习资源与实战项目。',
        tags: ['AI', '视觉识别', '图片分类', '目标检测'],
        repostAllow: true,
        publishTime: '2024-05-27',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 12944,
          likeCount: 647,
          favoriteCount: 323,
          commentCount: 46,
          shareCount: 129,
        },
        video: {
          cover: aiImagePool[3],
          url: minioVideoUrl('38130749343-1-192.mp4'),
          duration: 470,
        },
      },
      {
        id: 12,
        title: '大模型微调入门：LoRA、数据集与训练参数怎么配？',
        description:
          '手把手教你进行大模型微调，涵盖 LoRA 原理、数据集准备、训练参数配置与效果评估。',
        tags: ['AI', '大模型', '微调', 'LoRA'],
        repostAllow: true,
        publishTime: '2024-03-30',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 17662,
          likeCount: 883,
          favoriteCount: 441,
          commentCount: 63,
          shareCount: 176,
        },
        video: {
          cover: aiImagePool[4],
          url: minioVideoUrl('37768793798-1-192.mp4'),
          duration: 520,
        },
      },
      {
        id: 14,
        title: 'Prompt Patterns：常见提示词模式总结（附示例）',
        description:
          '总结几十种高效的提示词设计模式，附带真实示例，帮助你和 AI 更好地沟通。',
        tags: ['AI', '提示词', 'Prompt Patterns', 'ChatGPT'],
        repostAllow: true,
        publishTime: '2024-02-22',
        isHot: true,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 31550,
          likeCount: 1577,
          favoriteCount: 788,
          commentCount: 143,
          shareCount: 315,
        },
        video: {
          cover: aiImagePool[5],
          url: minioVideoUrl('37815258037-1-192.mp4'),
          duration: 490,
        },
      },
      {
        id: 17, // 新增
        title: 'Transformer 架构详解：从 Attention 到 GPT',
        description:
          '深入剖析 Transformer 的核心机制，包括自注意力、多头注意力、位置编码，并解读 GPT 系列模型的演进。',
        tags: ['AI', 'Transformer', 'GPT', '注意力机制'],
        repostAllow: true,
        publishTime: '2024-11-10',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 21000,
          likeCount: 1050,
          favoriteCount: 520,
          commentCount: 80,
          shareCount: 210,
        },
        video: {
          cover: aiImagePool[6],
          url: minioVideoUrl('new-1.mp4'),
          duration: 600,
        },
      },
      {
        id: 18, // 新增
        title: '模型量化与部署：ONNX、TensorRT 实战',
        description:
          '介绍模型量化技术，并通过 ONNX 和 TensorRT 实现高效推理部署，适用于边缘设备与云端。',
        tags: ['AI', '量化', 'ONNX', 'TensorRT', '部署'],
        repostAllow: true,
        publishTime: '2024-10-25',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 9800,
          likeCount: 490,
          favoriteCount: 200,
          commentCount: 35,
          shareCount: 98,
        },
        video: {
          cover: aiImagePool[7],
          url: minioVideoUrl('new-2.mp4'),
          duration: 380,
        },
      },
    ],
  },

  // ---------- 分类2：AI 应用与工具 ----------
  {
    category: 'AI 应用与工具',
    categoryDesc: '将 AI 技术落地到编程、办公、音频、设计等实际场景',
    list: [
      {
        id: 4,
        title: 'AI 编程助手：Copilot / Cursor / Claude 如何选？',
        description:
          '对比 GitHub Copilot、Cursor 和 Claude 三款主流 AI 编程助手，给出选型建议与实战技巧。',
        tags: ['AI', '编程助手', 'Copilot', 'Cursor', 'Claude'],
        repostAllow: true,
        publishTime: '2024-10-08',
        isHot: true,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 30211,
          likeCount: 1510,
          favoriteCount: 755,
          commentCount: 124,
          shareCount: 302,
        },
        video: {
          cover: aiImagePool[8],
          url: minioVideoUrl('38215090891-1-192.mp4'),
          duration: 480,
        },
      },
      {
        id: 8,
        title: 'AI+办公：自动化汇报、表格分析与会议纪要一条龙',
        description:
          '利用 AI 技术实现办公自动化，从自动生成汇报、分析表格到整理会议纪要，提升企业效率。',
        tags: ['AI', '办公自动化', '会议纪要', '表格分析'],
        repostAllow: true,
        publishTime: '2024-06-19',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 8901,
          likeCount: 445,
          favoriteCount: 178,
          commentCount: 24,
          shareCount: 89,
        },
        video: {
          cover: aiImagePool[9],
          url: minioVideoUrl('37721999918-1-192.mp4'),
          duration: 380,
        },
      },
      {
        id: 10,
        title: '用 AI 做 PPT：从大纲到排版一键生成（实用技巧）',
        description:
          '教你使用 AI 工具一键生成精美 PPT，涵盖大纲设计、内容填充和智能排版，提升演示效率。',
        tags: ['AI', 'PPT', '办公效率', '一键生成'],
        repostAllow: true,
        publishTime: '2024-05-02',
        isHot: true,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 22317,
          likeCount: 1115,
          favoriteCount: 558,
          commentCount: 79,
          shareCount: 223,
        },
        video: {
          cover: aiImagePool[10],
          url: minioVideoUrl('172156-846731269.mp4'),
          duration: 360,
        },
      },
      {
        id: 11,
        title: 'AI 音频：语音转文字、配音与降噪的常用工具集合',
        description:
          '盘点当前主流的 AI 音频工具，涵盖语音识别、自动配音、噪声消除等功能，附实操演示。',
        tags: ['AI', '音频', '语音转文字', '降噪', '配音'],
        repostAllow: true,
        publishTime: '2024-04-14',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 8012,
          likeCount: 400,
          favoriteCount: 201,
          commentCount: 27,
          shareCount: 80,
        },
        video: {
          cover: aiImagePool[11],
          url: minioVideoUrl('38215090891-1-192.mp4'),
          duration: 340,
        },
      },
      {
        id: 13,
        title: 'AI 产品设计：从需求到原型，如何做出可用的 AI 功能',
        description:
          '从产品经理视角出发，讲解如何设计用户友好的 AI 功能，覆盖需求分析、原型设计到落地验证。',
        tags: ['AI', '产品设计', '需求分析', '原型'],
        repostAllow: true,
        publishTime: '2024-03-10',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 9640,
          likeCount: 482,
          favoriteCount: 241,
          commentCount: 31,
          shareCount: 96,
        },
        video: {
          cover: aiImagePool[12],
          url: minioVideoUrl('37478075686-1-192.mp4'),
          duration: 450,
        },
      },
      {
        id: 15,
        title: 'AI 数据标注与数据治理：质量决定上限',
        description:
          '讲解 AI 项目中数据标注与数据治理的最佳实践，强调数据质量对模型效果的决定性影响。',
        tags: ['AI', '数据标注', '数据治理', '数据质量'],
        repostAllow: true,
        publishTime: '2024-02-03',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 7123,
          likeCount: 356,
          favoriteCount: 142,
          commentCount: 19,
          shareCount: 71,
        },
        video: {
          cover: aiImagePool[13],
          url: minioVideoUrl('37721999918-1-192.mp4'),
          duration: 400,
        },
      },
      {
        id: 19, // 新增
        title: 'AI 写作助手：从文章生成到润色校对全流程',
        description:
          '展示如何利用 AI 进行选题、大纲、初稿生成、润色和校对，帮助内容创作者提升效率。',
        tags: ['AI', '写作', '内容创作', '润色'],
        repostAllow: true,
        publishTime: '2024-12-01',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 13500,
          likeCount: 675,
          favoriteCount: 300,
          commentCount: 45,
          shareCount: 135,
        },
        video: {
          cover: aiImagePool[14],
          url: minioVideoUrl('new-3.mp4'),
          duration: 420,
        },
      },
      {
        id: 20, // 新增
        title: 'AI 法律合规：风险识别与合同审查实战',
        description:
          '利用 AI 进行法律文书审查、风险点识别，帮助法务人员提高工作效率和准确性。',
        tags: ['AI', '法律', '合同审查', '合规'],
        repostAllow: true,
        publishTime: '2024-09-15',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 6200,
          likeCount: 310,
          favoriteCount: 150,
          commentCount: 18,
          shareCount: 62,
        },
        video: {
          cover: aiImagePool[15],
          url: minioVideoUrl('new-4.mp4'),
          duration: 500,
        },
      },
    ],
  },

  // ---------- 分类3：多模态与 AIGC ----------
  {
    category: '多模态与 AIGC',
    categoryDesc: '探索图像、视频、音频等多模态内容生成与理解的前沿技术',
    list: [
      {
        id: 3,
        title: 'AI 绘画入门：从 Stable Diffusion 到应用落地',
        description:
          '从零开始学习 AI 绘画，涵盖 Stable Diffusion 的安装、基础使用与真实场景落地案例。',
        tags: ['AI', '绘画', 'Stable Diffusion', 'AIGC'],
        repostAllow: true,
        publishTime: '2024-11-30',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 9821,
          likeCount: 491,
          favoriteCount: 203,
          commentCount: 34,
          shareCount: 98,
        },
        video: {
          cover: aiImagePool[16],
          url: minioVideoUrl('37768793798-1-192.mp4'),
          duration: 510,
        },
      },
      {
        id: 7,
        title: '多模态 AI：图文理解、语音识别与视频分析怎么玩？',
        description:
          '探索多模态 AI 的前沿应用，包括图文理解、语音识别、视频分析等，并给出实践案例。',
        tags: ['AI', '多模态', '图文理解', '语音识别', '视频分析'],
        repostAllow: true,
        publishTime: '2024-07-03',
        isHot: true,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 27110,
          likeCount: 1355,
          favoriteCount: 678,
          commentCount: 97,
          shareCount: 271,
        },
        video: {
          cover: aiImagePool[0],
          url: minioVideoUrl('37815258037-1-192.mp4'),
          duration: 560,
        },
      },
      {
        id: 21, // 新增
        title: '视频生成模型 Sora 深度解读与未来展望',
        description:
          '全面解读 OpenAI 视频生成模型 Sora 的技术原理、能力边界以及对影视行业的潜在影响。',
        tags: ['AI', '视频生成', 'Sora', '多模态'],
        repostAllow: true,
        publishTime: '2024-12-20',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 34500,
          likeCount: 1720,
          favoriteCount: 860,
          commentCount: 210,
          shareCount: 345,
        },
        video: {
          cover: aiImagePool[1],
          url: minioVideoUrl('new-5.mp4'),
          duration: 650,
        },
      },
      {
        id: 22, // 新增
        title: 'AI 音乐生成：从旋律创作到伴奏编排',
        description:
          '利用 AI 生成旋律、和弦进行与完整伴奏，为音乐创作提供灵感和辅助工具。',
        tags: ['AI', '音乐', '生成', 'AIGC'],
        repostAllow: true,
        publishTime: '2024-08-20',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 7800,
          likeCount: 390,
          favoriteCount: 180,
          commentCount: 22,
          shareCount: 78,
        },
        video: {
          cover: aiImagePool[2],
          url: minioVideoUrl('new-6.mp4'),
          duration: 460,
        },
      },
      {
        id: 23, // 新增
        title: '3D 内容生成：AI 驱动的建模与渲染技术',
        description:
          '介绍利用 AI 生成三维模型、材质和场景的技术，适用于游戏、影视和元宇宙。',
        tags: ['AI', '3D', '生成', '建模', '渲染'],
        repostAllow: true,
        publishTime: '2024-10-05',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 11200,
          likeCount: 560,
          favoriteCount: 280,
          commentCount: 38,
          shareCount: 112,
        },
        video: {
          cover: aiImagePool[3],
          url: minioVideoUrl('new-7.mp4'),
          duration: 540,
        },
      },
      {
        id: 24, // 新增
        title: 'AI 换脸与数字人技术：原理、应用与伦理',
        description:
          '深入解析 AI 换脸（Deepfake）和数字人技术的原理、应用场景，并探讨其中的伦理与法律风险。',
        tags: ['AI', '换脸', '数字人', 'Deepfake', '伦理'],
        repostAllow: true,
        publishTime: '2024-11-18',
        isHot: true,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 18900,
          likeCount: 945,
          favoriteCount: 470,
          commentCount: 110,
          shareCount: 189,
        },
        video: {
          cover: aiImagePool[4],
          url: minioVideoUrl('new-8.mp4'),
          duration: 510,
        },
      },
      {
        id: 25, // 新增
        title: '多模态检索：文本、图像、视频的统一搜索',
        description:
          '介绍多模态检索系统的构建方法，包括跨模态编码、索引和相似性度量，实现统一搜索。',
        tags: ['AI', '多模态', '检索', '搜索'],
        repostAllow: true,
        publishTime: '2024-07-25',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 5400,
          likeCount: 270,
          favoriteCount: 130,
          commentCount: 15,
          shareCount: 54,
        },
        video: {
          cover: aiImagePool[5],
          url: minioVideoUrl('new-9.mp4'),
          duration: 480,
        },
      },
      {
        id: 26, // 新增
        title: 'AIGC 商业案例：从广告到影视的全面落地',
        description:
          '盘点 AIGC 在广告营销、影视制作、游戏美术等领域的成功商业应用案例。',
        tags: ['AIGC', '商业', '广告', '影视', '游戏'],
        repostAllow: true,
        publishTime: '2024-06-10',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 15700,
          likeCount: 785,
          favoriteCount: 390,
          commentCount: 60,
          shareCount: 157,
        },
        video: {
          cover: aiImagePool[6],
          url: minioVideoUrl('new-10.mp4'),
          duration: 530,
        },
      },
    ],
  },

  // ---------- 分类4：智能体与自动化 ----------
  {
    category: '智能体与自动化',
    categoryDesc: '构建自主决策的 AI Agent，实现任务规划、工具调用与流程自动化',
    list: [
      {
        id: 6,
        title: 'Agent 实战：用工具调用与记忆构建个人助理',
        description:
          '手把手教你构建具备工具调用和长期记忆能力的 AI Agent，实现真正的个人智能助理。',
        tags: ['AI', 'Agent', '工具调用', '记忆机制'],
        repostAllow: true,
        publishTime: '2024-08-11',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 11890,
          likeCount: 594,
          favoriteCount: 297,
          commentCount: 38,
          shareCount: 119,
        },
        video: {
          cover: aiImagePool[7],
          url: minioVideoUrl('37478075686-1-192.mp4'),
          duration: 600,
        },
      },
      {
        id: 16,
        title: 'AI 代码生成：如何让模型写出可维护的代码结构',
        description:
          '探讨如何通过提示词设计和工程实践，让 AI 生成具有良好结构、可读性高且易于维护的代码。',
        tags: ['AI', '代码生成', '代码质量', '可维护性'],
        repostAllow: true,
        publishTime: '2024-01-12',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 18801,
          likeCount: 940,
          favoriteCount: 470,
          commentCount: 72,
          shareCount: 188,
        },
        video: {
          cover: aiImagePool[8],
          url: minioVideoUrl('38130749343-1-192.mp4'),
          duration: 530,
        },
      },
      {
        id: 27, // 新增
        title: 'AutoGPT 与自主智能体：原理与实战',
        description:
          '解读 AutoGPT 等自主智能体的架构，实现任务分解、工具选择与自我迭代的自动化流程。',
        tags: ['AI', 'AutoGPT', '自主智能体', '任务分解'],
        repostAllow: true,
        publishTime: '2024-12-10',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 26000,
          likeCount: 1300,
          favoriteCount: 650,
          commentCount: 130,
          shareCount: 260,
        },
        video: {
          cover: aiImagePool[9],
          url: minioVideoUrl('new-11.mp4'),
          duration: 570,
        },
      },
      {
        id: 28, // 新增
        title: 'RPA+AI：智能流程自动化最佳实践',
        description:
          '结合 RPA 与 AI 技术，实现企业级业务流程的智能自动化，提升运营效率。',
        tags: ['AI', 'RPA', '流程自动化', '企业应用'],
        repostAllow: true,
        publishTime: '2024-09-28',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 9200,
          likeCount: 460,
          favoriteCount: 230,
          commentCount: 28,
          shareCount: 92,
        },
        video: {
          cover: aiImagePool[10],
          url: minioVideoUrl('new-12.mp4'),
          duration: 430,
        },
      },
      {
        id: 29, // 新增
        title: 'LLM Agent 框架对比：LangChain vs. LlamaIndex',
        description:
          '详细对比 LangChain 和 LlamaIndex 两大 LLM Agent 框架的特性、适用场景与选型建议。',
        tags: ['AI', 'LLM', 'Agent', 'LangChain', 'LlamaIndex'],
        repostAllow: true,
        publishTime: '2024-11-05',
        isHot: true,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 19800,
          likeCount: 990,
          favoriteCount: 490,
          commentCount: 85,
          shareCount: 198,
        },
        video: {
          cover: aiImagePool[11],
          url: minioVideoUrl('new-13.mp4'),
          duration: 550,
        },
      },
      {
        id: 30, // 新增
        title: 'AI 自动化测试：从用例生成到缺陷定位',
        description:
          '利用 AI 自动生成测试用例、执行测试并智能定位缺陷，提升软件质量保障效率。',
        tags: ['AI', '自动化测试', '用例生成', '缺陷定位'],
        repostAllow: true,
        publishTime: '2024-08-05',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 7300,
          likeCount: 365,
          favoriteCount: 180,
          commentCount: 20,
          shareCount: 73,
        },
        video: {
          cover: aiImagePool[12],
          url: minioVideoUrl('new-14.mp4'),
          duration: 490,
        },
      },
      {
        id: 31, // 新增
        title: '多 Agent 协作：分布式任务规划与执行',
        description:
          '探讨多个 AI Agent 如何通过通信与协商完成复杂任务，实现分布式智能。',
        tags: ['AI', '多Agent', '分布式', '协作'],
        repostAllow: true,
        publishTime: '2024-10-18',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 14200,
          likeCount: 710,
          favoriteCount: 350,
          commentCount: 50,
          shareCount: 142,
        },
        video: {
          cover: aiImagePool[13],
          url: minioVideoUrl('new-15.mp4'),
          duration: 620,
        },
      },
      {
        id: 32, // 新增
        title: '从需求到部署：AI 项目的全生命周期自动化',
        description:
          '讲解如何利用 AI 工具链实现从需求分析、代码生成、测试到部署的全流程自动化。',
        tags: ['AI', 'DevOps', 'CI/CD', '自动化'],
        repostAllow: true,
        publishTime: '2024-12-25',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 22400,
          likeCount: 1120,
          favoriteCount: 560,
          commentCount: 90,
          shareCount: 224,
        },
        video: {
          cover: aiImagePool[14],
          url: minioVideoUrl('new-16.mp4'),
          duration: 580,
        },
      },
    ],
  },

  // ---------- 分类5：提示词工程 ----------
  {
    category: '提示词工程',
    categoryDesc: '掌握提示词设计、Few-shot、结构化输出等与模型对话的核心技能',
    list: [
      {
        id: 33, // 新增
        title: '提示词工程入门：写好第一句 Prompt 的方法论',
        description:
          '从零讲解提示词的基本结构与方法论，学会用角色、任务、约束三要素写出高质量 Prompt。',
        tags: ['AI', '提示词', 'Prompt', '入门'],
        repostAllow: true,
        publishTime: '2025-01-05',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 25300,
          likeCount: 1265,
          favoriteCount: 630,
          commentCount: 95,
          shareCount: 250,
        },
        video: {
          cover: aiImagePool[15],
          url: minioVideoUrl('new-17.mp4'),
          duration: 460,
        },
      },
      {
        id: 34, // 新增
        title: 'Few-shot 与思维链：让模型举一反三',
        description:
          '讲解少样本示例与思维链（Chain-of-Thought）的适用场景与组合技巧，显著提升输出质量。',
        tags: ['AI', '提示词', 'Few-shot', '思维链'],
        repostAllow: true,
        publishTime: '2024-12-14',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 18900,
          likeCount: 945,
          favoriteCount: 470,
          commentCount: 63,
          shareCount: 188,
        },
        video: {
          cover: aiImagePool[16],
          url: minioVideoUrl('new-18.mp4'),
          duration: 520,
        },
      },
      {
        id: 35, // 新增
        title: '结构化输出实战：让模型稳定吐出可用 JSON',
        description:
          '教你用格式约束、示例锚定与校验重试策略，让模型输出稳定可解析的结构化数据。',
        tags: ['AI', '提示词', 'JSON', '结构化输出'],
        repostAllow: true,
        publishTime: '2024-11-22',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 14600,
          likeCount: 730,
          favoriteCount: 365,
          commentCount: 49,
          shareCount: 146,
        },
        video: {
          cover: aiImagePool[0],
          url: minioVideoUrl('new-19.mp4'),
          duration: 480,
        },
      },
      {
        id: 36, // 新增
        title: '系统提示词设计：给 Agent 写好“岗位说明书”',
        description:
          '拆解系统提示词的角色设定、边界约束与流程编排写法，让 Agent 行为稳定可预期。',
        tags: ['AI', '提示词', 'System Prompt', 'Agent'],
        repostAllow: true,
        publishTime: '2024-10-30',
        isHot: true,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 21500,
          likeCount: 1075,
          favoriteCount: 540,
          commentCount: 86,
          shareCount: 215,
        },
        video: {
          cover: aiImagePool[1],
          url: minioVideoUrl('new-20.mp4'),
          duration: 540,
        },
      },
      {
        id: 37, // 新增
        title: '提示词调试与评测：如何科学地迭代你的 Prompt',
        description:
          '介绍提示词版本的调试方法与评测指标搭建，用数据驱动的方式持续改进 Prompt 效果。',
        tags: ['AI', '提示词', '评测', '迭代'],
        repostAllow: true,
        publishTime: '2024-09-12',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 9800,
          likeCount: 490,
          favoriteCount: 245,
          commentCount: 33,
          shareCount: 98,
        },
        video: {
          cover: aiImagePool[2],
          url: minioVideoUrl('new-21.mp4'),
          duration: 430,
        },
      },
      {
        id: 38, // 新增
        title: '多模态提示词：图文混合任务的写法差异',
        description:
          '讲解图像理解、图文生成等多模态任务中提示词的写法差异与常见坑位。',
        tags: ['AI', '提示词', '多模态', '图文'],
        repostAllow: true,
        publishTime: '2024-08-25',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 12400,
          likeCount: 620,
          favoriteCount: 310,
          commentCount: 41,
          shareCount: 124,
        },
        video: {
          cover: aiImagePool[3],
          url: minioVideoUrl('new-22.mp4'),
          duration: 500,
        },
      },
    ],
  },

  // ---------- 分类6：AI 编程开发 ----------
  {
    category: 'AI 编程开发',
    categoryDesc: 'Vibe Coding、Copilot、Cursor 等编程新范式的实战教程',
    list: [
      {
        id: 39, // 新增
        title: 'Vibe Coding 上手：从一句话需求到可运行项目',
        description:
          '体验用自然语言驱动开发的完整流程，掌握需求描述、迭代调试与验收的 Vibe Coding 节奏。',
        tags: ['AI', 'Vibe Coding', '编程范式', '实战'],
        repostAllow: true,
        publishTime: '2025-01-08',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 28700,
          likeCount: 1435,
          favoriteCount: 720,
          commentCount: 108,
          shareCount: 287,
        },
        video: {
          cover: aiImagePool[4],
          url: minioVideoUrl('new-23.mp4'),
          duration: 560,
        },
      },
      {
        id: 40, // 新增
        title: 'Cursor 深度使用：Composer、Rules 与上下文管理',
        description:
          '系统性讲解 Cursor 的核心能力：Composer 多文件编辑、Rules 项目约定与上下文管理技巧。',
        tags: ['AI', 'Cursor', 'Composer', 'Rules'],
        repostAllow: true,
        publishTime: '2024-12-05',
        isHot: true,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 31200,
          likeCount: 1560,
          favoriteCount: 780,
          commentCount: 118,
          shareCount: 312,
        },
        video: {
          cover: aiImagePool[5],
          url: minioVideoUrl('new-24.mp4'),
          duration: 610,
        },
      },
      {
        id: 41, // 新增
        title: 'GitHub Copilot 实战：从补全到 Agent 模式',
        description:
          '覆盖 Copilot 的代码补全、Chat 与 Agent 模式的典型用法，把 AI 助手融进日常开发流。',
        tags: ['AI', 'Copilot', 'GitHub', '编程助手'],
        repostAllow: true,
        publishTime: '2024-11-12',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 19800,
          likeCount: 990,
          favoriteCount: 495,
          commentCount: 74,
          shareCount: 198,
        },
        video: {
          cover: aiImagePool[6],
          url: minioVideoUrl('new-25.mp4'),
          duration: 490,
        },
      },
      {
        id: 42, // 新增
        title: '让 AI 读懂你的项目：CLAUDE.md 与上下文工程',
        description:
          '讲解项目约定文件、上下文注入与检索策略，让 AI 编程助手真正理解你的代码库。',
        tags: ['AI', '上下文工程', 'CLAUDE.md', '代码库'],
        repostAllow: true,
        publishTime: '2024-10-20',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 16300,
          likeCount: 815,
          favoriteCount: 408,
          commentCount: 58,
          shareCount: 163,
        },
        video: {
          cover: aiImagePool[7],
          url: minioVideoUrl('new-26.mp4'),
          duration: 530,
        },
      },
      {
        id: 43, // 新增
        title: 'AI 代码评审：用模型守住质量门禁',
        description:
          '实践用 AI 做代码评审：缺陷发现、规范检查与危险性分级，与人工评审形成互补。',
        tags: ['AI', '代码评审', '工程质量', '门禁'],
        repostAllow: true,
        publishTime: '2024-09-08',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 11600,
          likeCount: 580,
          favoriteCount: 290,
          commentCount: 39,
          shareCount: 116,
        },
        video: {
          cover: aiImagePool[8],
          url: minioVideoUrl('new-27.mp4'),
          duration: 450,
        },
      },
      {
        id: 44, // 新增
        title: 'AI 编程的安全边界：依赖、密钥与代码合规',
        description:
          '梳理 AI 编程中的安全实践：依赖引入审查、密钥防泄漏与生成代码的合规检查。',
        tags: ['AI', '安全', '合规', '依赖管理'],
        repostAllow: true,
        publishTime: '2024-08-16',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 8900,
          likeCount: 445,
          favoriteCount: 222,
          commentCount: 30,
          shareCount: 89,
        },
        video: {
          cover: aiImagePool[9],
          url: minioVideoUrl('new-28.mp4'),
          duration: 420,
        },
      },
    ],
  },

  // ---------- 分类7：AI 前沿与趋势 ----------
  {
    category: 'AI 前沿与趋势',
    categoryDesc: '追踪大模型技术演进、行业动态与商业化落地的前沿观察',
    list: [
      {
        id: 45, // 新增
        title: '2025 大模型格局：闭源、开源与端侧三分天下',
        description:
          '梳理 2025 年大模型竞争格局：闭源旗舰、开源生态与端侧小模型各自的机会与挑战。',
        tags: ['AI', '大模型', '开源', '端侧'],
        repostAllow: true,
        publishTime: '2025-01-12',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 26400,
          likeCount: 1320,
          favoriteCount: 660,
          commentCount: 99,
          shareCount: 264,
        },
        video: {
          cover: aiImagePool[10],
          url: minioVideoUrl('new-29.mp4'),
          duration: 570,
        },
      },
      {
        id: 46, // 新增
        title: '推理成本下降曲线：模型普惠背后的经济学',
        description:
          '分析大模型推理成本的下降趋势与驱动因素，理解 AI 普惠应用背后的经济逻辑。',
        tags: ['AI', '推理成本', '经济学', '趋势'],
        repostAllow: true,
        publishTime: '2024-12-22',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 14100,
          likeCount: 705,
          favoriteCount: 352,
          commentCount: 47,
          shareCount: 141,
        },
        video: {
          cover: aiImagePool[11],
          url: minioVideoUrl('new-30.mp4'),
          duration: 500,
        },
      },
      {
        id: 47, // 新增
        title: 'AI 硬件新物种：从 AI PC 到智能眼镜的落地图谱',
        description:
          '盘点 AI 硬件新品类：AI PC、智能眼镜与陪伴机器人，看 AI 如何重新定义硬件交互。',
        tags: ['AI', '硬件', 'AI PC', '智能眼镜'],
        repostAllow: true,
        publishTime: '2024-11-28',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 12700,
          likeCount: 635,
          favoriteCount: 318,
          commentCount: 42,
          shareCount: 127,
        },
        video: {
          cover: aiImagePool[12],
          url: minioVideoUrl('new-31.mp4'),
          duration: 520,
        },
      },
      {
        id: 48, // 新增
        title: '开源模型选型指南：Llama、Qwen、DeepSeek 怎么选',
        description:
          '对比主流开源模型的能力边界、许可协议与部署成本，给出不同场景下的选型建议。',
        tags: ['AI', '开源模型', '选型', 'Llama', 'DeepSeek'],
        repostAllow: true,
        publishTime: '2024-10-15',
        isHot: true,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 23800,
          likeCount: 1190,
          favoriteCount: 595,
          commentCount: 89,
          shareCount: 238,
        },
        video: {
          cover: aiImagePool[13],
          url: minioVideoUrl('new-32.mp4'),
          duration: 550,
        },
      },
      {
        id: 49, // 新增
        title: 'AI 治理观察：全球监管动向与开发者应对',
        description:
          '跟踪全球 AI 监管框架的最新动向，解析对开发者实名的影响与合规实践要点。',
        tags: ['AI', '治理', '监管', '合规'],
        repostAllow: true,
        publishTime: '2024-09-20',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 7600,
          likeCount: 380,
          favoriteCount: 190,
          commentCount: 25,
          shareCount: 76,
        },
        video: {
          cover: aiImagePool[14],
          url: minioVideoUrl('new-33.mp4'),
          duration: 470,
        },
      },
      {
        id: 50, // 新增
        title: '从实验室到生产线：AI 科技成果转化观察',
        description:
          '观察 AI 技术从论文到产品的转化路径，拆解几个代表性团队的落地故事。',
        tags: ['AI', '科技成果转化', '产业', '案例'],
        repostAllow: true,
        publishTime: '2024-08-30',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 10500,
          likeCount: 525,
          favoriteCount: 262,
          commentCount: 35,
          shareCount: 105,
        },
        video: {
          cover: aiImagePool[15],
          url: minioVideoUrl('new-34.mp4'),
          duration: 510,
        },
      },
    ],
  },

  // ---------- 分类8：AI 绘画与设计 ----------
  {
    category: 'AI 绘画与设计',
    categoryDesc: 'Stable Diffusion、Midjourney 等绘画工具与 AI 设计工作流实战',
    list: [
      {
        id: 51, // 新增
        title: 'Midjourney 精进：风格控制与垫图混音实战',
        description:
          '掌握 Midjourney 的风格参考、垫图与参数组合技巧，稳定产出符合预期的商业级画面。',
        tags: ['AI', 'Midjourney', '绘画', '风格控制'],
        repostAllow: true,
        publishTime: '2025-01-03',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 27600,
          likeCount: 1380,
          favoriteCount: 690,
          commentCount: 104,
          shareCount: 276,
        },
        video: {
          cover: aiImagePool[16],
          url: minioVideoUrl('new-35.mp4'),
          duration: 540,
        },
      },
      {
        id: 52, // 新增
        title: 'Stable Diffusion 工作流：ControlNet 精准控图',
        description:
          '讲解 ControlNet 的线稿、深度、姿态等控制方式，搭建可复现的商业出图工作流。',
        tags: ['AI', 'Stable Diffusion', 'ControlNet', '工作流'],
        repostAllow: true,
        publishTime: '2024-12-10',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 18400,
          likeCount: 920,
          favoriteCount: 460,
          commentCount: 69,
          shareCount: 184,
        },
        video: {
          cover: aiImagePool[0],
          url: minioVideoUrl('new-36.mp4'),
          duration: 580,
        },
      },
      {
        id: 53, // 新增
        title: '电商场景出图：主图、详情页与模特换装的 AI 方案',
        description:
          '实战电商设计需求：用 AI 生成商品主图、批量详情页素材与虚拟模特换装。',
        tags: ['AI', '电商设计', '出图', '换装'],
        repostAllow: true,
        publishTime: '2024-11-16',
        isHot: true,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 22900,
          likeCount: 1145,
          favoriteCount: 572,
          commentCount: 85,
          shareCount: 229,
        },
        video: {
          cover: aiImagePool[1],
          url: minioVideoUrl('new-37.mp4'),
          duration: 490,
        },
      },
      {
        id: 54, // 新增
        title: 'LoRA 训练入门：训练出你自己风格的绘画模型',
        description:
          '从数据集整理到参数调优，手把手训练一个属于自己风格的 LoRA 绘画模型。',
        tags: ['AI', 'LoRA', '训练', '风格模型'],
        repostAllow: true,
        publishTime: '2024-10-12',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 15800,
          likeCount: 790,
          favoriteCount: 395,
          commentCount: 52,
          shareCount: 158,
        },
        video: {
          cover: aiImagePool[2],
          url: minioVideoUrl('new-38.mp4'),
          duration: 620,
        },
      },
      {
        id: 55, // 新增
        title: 'UI 设计 AI 化：从线框到高保真的加速流程',
        description:
          '实践 AI 辅助 UI 设计：线框生成、风格迁移与组件填充，加速从概念到高保真的流程。',
        tags: ['AI', 'UI 设计', '高保真', '流程'],
        repostAllow: true,
        publishTime: '2024-09-18',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 11300,
          likeCount: 565,
          favoriteCount: 282,
          commentCount: 38,
          shareCount: 113,
        },
        video: {
          cover: aiImagePool[3],
          url: minioVideoUrl('new-39.mp4'),
          duration: 480,
        },
      },
      {
        id: 56, // 新增
        title: 'AI 海报与字效：营销物料的批量生产',
        description:
          '用 AI 批量产出活动海报、字体特效与社媒物料，讲清版权边界与交付规范。',
        tags: ['AI', '海报', '营销物料', '版权'],
        repostAllow: true,
        publishTime: '2024-08-22',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 9200,
          likeCount: 460,
          favoriteCount: 230,
          commentCount: 31,
          shareCount: 92,
        },
        video: {
          cover: aiImagePool[4],
          url: minioVideoUrl('new-40.mp4'),
          duration: 440,
        },
      },
    ],
  },

  // ---------- 分类9：AI 音视频创作 ----------
  {
    category: 'AI 音视频创作',
    categoryDesc: 'Suno 音乐、数字人播报与短视频生产的 AI 创作链路',
    list: [
      {
        id: 57, // 新增
        title: 'Suno 进阶：写好歌词结构与曲风的提示词配方',
        description:
          '掌握 Suno 的歌词分段标记、曲风标签与元数据写法，稳定生成可发布的完整歌曲。',
        tags: ['AI', 'Suno', '音乐', '提示词'],
        repostAllow: true,
        publishTime: '2025-01-06',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 24100,
          likeCount: 1205,
          favoriteCount: 602,
          commentCount: 90,
          shareCount: 241,
        },
        video: {
          cover: aiImagePool[5],
          url: minioVideoUrl('new-41.mp4'),
          duration: 500,
        },
      },
      {
        id: 58, // 新增
        title: '数字人短视频：从文案到口播视频的一条龙生产',
        description:
          '搭建数字人口播视频的生产链路：文案生成、形象克隆、口型对齐与批量合成。',
        tags: ['AI', '数字人', '短视频', '生产链路'],
        repostAllow: true,
        publishTime: '2024-12-16',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 19700,
          likeCount: 985,
          favoriteCount: 492,
          commentCount: 74,
          shareCount: 197,
        },
        video: {
          cover: aiImagePool[6],
          url: minioVideoUrl('new-42.mp4'),
          duration: 560,
        },
      },
      {
        id: 59, // 新增
        title: 'AI 视频剪辑：自动粗剪、字幕与成片包装',
        description:
          '实践 AI 剪辑工具链：语音转写自动粗剪、智能字幕与成片包装，效率翻倍的剪辑流。',
        tags: ['AI', '视频剪辑', '字幕', '粗剪'],
        repostAllow: true,
        publishTime: '2024-11-08',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 15200,
          likeCount: 760,
          favoriteCount: 380,
          commentCount: 57,
          shareCount: 152,
        },
        video: {
          cover: aiImagePool[7],
          url: minioVideoUrl('new-43.mp4'),
          duration: 520,
        },
      },
      {
        id: 60, // 新增
        title: 'AI 配音与音效：视频声音层的快速生产力',
        description:
          '用 AI 完成配音、音效与背景音乐匹配，补齐短视频声音层的快速生产方案。',
        tags: ['AI', '配音', '音效', '视频'],
        repostAllow: true,
        publishTime: '2024-10-18',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 12100,
          likeCount: 605,
          favoriteCount: 302,
          commentCount: 40,
          shareCount: 121,
        },
        video: {
          cover: aiImagePool[8],
          url: minioVideoUrl('new-44.mp4'),
          duration: 450,
        },
      },
      {
        id: 61, // 新增
        title: '图生视频实战：把静态海报变成动态宣传片',
        description:
          '讲解图生视频模型的使用要点：运镜控制、时长延展与风格一致性，让静态素材动起来。',
        tags: ['AI', '图生视频', '运镜', '宣传片'],
        repostAllow: true,
        publishTime: '2024-09-24',
        isHot: true,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 20500,
          likeCount: 1025,
          favoriteCount: 512,
          commentCount: 77,
          shareCount: 205,
        },
        video: {
          cover: aiImagePool[9],
          url: minioVideoUrl('new-45.mp4'),
          duration: 530,
        },
      },
      {
        id: 62, // 新增
        title: 'AI 播客工厂：选题、脚本到全平台发布的完整工作流',
        description:
          '搭建 AI 播客生产工作流：自动选题、脚本共创、语音合成与多平台分发。',
        tags: ['AI', '播客', '工作流', '分发'],
        repostAllow: true,
        publishTime: '2024-08-28',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 8800,
          likeCount: 440,
          favoriteCount: 220,
          commentCount: 29,
          shareCount: 88,
        },
        video: {
          cover: aiImagePool[10],
          url: minioVideoUrl('new-46.mp4'),
          duration: 470,
        },
      },
    ],
  },

  // ---------- 分类10：AI 学习与科研 ----------
  {
    category: 'AI 学习与科研',
    categoryDesc: '论文阅读、知识管理与个人学习提效的 AI 方法',
    list: [
      {
        id: 63, // 新增
        title: 'AI 论文精读：从速览到复现的双层阅读法',
        description:
          '用 AI 支撑论文精读：第一层速览抓要点，第二层配合代码库走读完成方法复现。',
        tags: ['AI', '论文', '科研', '阅读法'],
        repostAllow: true,
        publishTime: '2025-01-10',
        isHot: true,
        isRecommended: true,
        isNew: true,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 17300,
          likeCount: 865,
          favoriteCount: 432,
          commentCount: 65,
          shareCount: 173,
        },
        video: {
          cover: aiImagePool[11],
          url: minioVideoUrl('new-47.mp4'),
          duration: 540,
        },
      },
      {
        id: 64, // 新增
        title: '个人知识库：用 RAG 管理你的学习笔记',
        description:
          '动手搭建个人知识库：笔记入库、检索问答与定期回顾，让 AI 成为你的第二大脑。',
        tags: ['AI', '知识库', 'RAG', '笔记'],
        repostAllow: true,
        publishTime: '2024-12-20',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 13900,
          likeCount: 695,
          favoriteCount: 348,
          commentCount: 52,
          shareCount: 139,
        },
        video: {
          cover: aiImagePool[12],
          url: minioVideoUrl('new-48.mp4'),
          duration: 510,
        },
      },
      {
        id: 65, // 新增
        title: 'AI 辅助写作：文献综述的提效与降噪',
        description:
          '实践 AI 辅助文献综述：批量摘要、脉络梳理与引用校验，提效同时守住学术规范。',
        tags: ['AI', '文献综述', '写作', '学术规范'],
        repostAllow: true,
        publishTime: '2024-11-20',
        isHot: false,
        isRecommended: true,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 11700,
          likeCount: 585,
          favoriteCount: 292,
          commentCount: 39,
          shareCount: 117,
        },
        video: {
          cover: aiImagePool[13],
          url: minioVideoUrl('new-49.mp4'),
          duration: 480,
        },
      },
      {
        id: 66, // 新增
        title: '数据可视化学习：让 AI 帮你把笔记变成图表',
        description:
          '用 AI 把文字笔记转成可视化图表与思维导图，加深理解、方便复习与分享。',
        tags: ['AI', '可视化', '学习', '思维导图'],
        repostAllow: true,
        publishTime: '2024-10-26',
        isHot: false,
        isRecommended: false,
        isNew: false,
        author: { id: 1, name: 'AI 助手' },
        meta: {
          playCount: 9600,
          likeCount: 480,
          favoriteCount: 240,
          commentCount: 32,
          shareCount: 96,
        },
        video: {
          cover: aiImagePool[14],
          url: minioVideoUrl('new-50.mp4'),
          duration: 430,
        },
      },
    ],
  },
];
