// ==================== 工具函数 ====================
const minioVideoUrl = (filename: string) =>
  `${import.meta.env.VITE_MINIO_ADDRESS}/younger/video/${filename}`;

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
          cover:
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1676299081847-824916de030a?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=60',
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
          cover:
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=60',
          url: minioVideoUrl('new-16.mp4'),
          duration: 580,
        },
      },
    ],
  },
];
