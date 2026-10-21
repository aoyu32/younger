import { aiIconByDomain } from './aiCatalog';

export interface WebsiteSite {
  name: string;
  url: string;
  icon: string;
  desc: string;
  views: number;
  likes: number;
}

export interface WebsiteCategoryChild {
  name: string;
  sites: WebsiteSite[];
}

export interface WebsiteCategoryGroup {
  name: string;
  children: WebsiteCategoryChild[];
}

// 每个站点使用独立描述，避免导航卡片展开后全部显示同一句话
const siteDescriptions: Record<string, string> = {
  ChatGPT:
    'OpenAI 的通用对话助手，写代码、做分析、生成图片都能在同一个窗口完成。',
  Claude: 'Anthropic 推出的长文本对话模型，擅长阅读文档、写作和复杂推理。',
  Gemini: 'Google 的多模态 AI 助手，深度整合搜索、Workspace 与 Android 生态。',
  DeepSeek: '深度求索的推理与编程模型，中文理解强，适合学习和日常开发。',
  豆包: '字节跳动的 AI 助手，支持对话、写作、图像和语音等多模态玩法。',
  Kimi: '月之暗面的长上下文助手，适合读论文、整理资料和超长文档问答。',
  文心一言: '百度的大模型对话产品，中文知识问答与内容创作场景丰富。',
  通义千问: '阿里云的大模型助手，覆盖办公、学习、编程和多模态任务。',

  Perplexity: '带引用来源的 AI 搜索引擎，适合快速做资料检索和事实核对。',
  '秘塔 AI 搜索': '面向中文用户的 AI 搜索，自动生成大纲、脑图和来源链接。',
  '天工 AI': '昆仑万维的 AI 搜索与创作平台，支持研究、写作和音乐生成。',
  'You.com': '可切换多种模型的 AI 搜索工作台，聚合网页、学术和代码结果。',
  Phind: '面向开发者的 AI 搜索，擅长解释报错、查文档和生成代码示例。',
  '夸克 AI 搜索':
    '夸克浏览器的智能搜索入口，支持深度思考、拍照搜题和文档总结。',

  机器之心: '国内 AI 行业媒体，追踪大模型、机器人与前沿研究动态。',
  量子位: '关注人工智能产业与技术的科技媒体，报道模型发布和行业趋势。',
  AIBase: 'AI 工具与产品资讯库，适合发现新应用和了解产品更新。',
  '36氪': '科技商业媒体，覆盖 AI 创业公司、融资动态和产业观察。',
  TechCrunch: '全球科技媒体，报道 AI 初创公司、产品发布和资本市场。',
  'The Verge': '消费科技媒体，关注 AI 硬件、应用体验和数字生活趋势。',

  Midjourney: '以审美见长的 AI 绘画工具，适合生成插画、概念图和视觉风格探索。',
  '即梦 AI': '字节跳动的图像与视频创作平台，支持文生图、图生视频和智能画布。',
  通义万相: '阿里云的视觉生成模型，覆盖文生图、图生视频和图像编辑。',
  'Stable Diffusion': '开源图像生成生态，可本地部署并灵活搭配模型与插件。',
  'Leonardo.Ai': '面向游戏和设计场景的 AI 绘画平台，提供模型训练与素材生成。',
  Civitai: '开源绘画模型与 LoRA 社区，可浏览、下载并分享生成资源。',

  '可灵 AI': '快手的视频生成模型，支持图生视频、首尾帧和运动控制。',
  Runway: '专业级 AI 视频创作平台，提供生成、抠像、追踪和后期工具。',
  Pika: '轻量易用的 AI 视频生成器，适合做特效短片和社交媒体素材。',
  'Luma AI': '提供视频生成与 3D 重建能力，适合空间捕捉和影视概念预览。',
  '海螺 AI': 'MiniMax 的对话与视频创作产品，支持长文本、语音和视频生成。',
  Sora: 'OpenAI 的视频生成模型，擅长生成物理一致的长镜头与创意场景。',

  Suno: '用文字生成完整歌曲的 AI 音乐平台，支持人声、编曲和风格控制。',
  Udio: 'AI 音乐生成工具，可创作带人声的歌曲并进行分段编辑。',
  ElevenLabs: '高质量 AI 语音平台，支持配音、克隆音色和多语言朗读。',
  网易天音: '网易的 AI 音乐创作工具，提供编曲、写词和歌声合成能力。',
  魔音工坊: '中文 AI 配音平台，拥有多种音色，适合短视频和有声内容。',
  Soundraw: '面向创作者的 AI 音乐生成器，可按情绪、时长和乐器定制配乐。',

  HeyGen: 'AI 数字人视频平台，支持口型同步、翻译和多语言分身。',
  'D-ID': '让静态照片开口说话的 AI 视频工具，常用于虚拟主播和营销素材。',
  Synthesia: '企业级数字人视频平台，适合培训、产品和多语言宣传片。',
  腾讯智影: '腾讯的智能视频创作平台，提供数字人播报、剪辑和配音。',
  硅基智能: '国内数字人服务商，覆盖直播、短视频和智能客服场景。',

  'GitHub Copilot':
    'GitHub 的 AI 编程助手，在编辑器内补全代码、解释逻辑和生成测试。',
  Cursor: 'AI 原生代码编辑器，支持整库理解、多文件修改和对话式编程。',
  Windsurf: '面向开发者的 AI IDE，提供智能补全、Agent 流程和上下文索引。',
  通义灵码: '阿里云的 AI 编程助手，支持代码补全、问答和单元测试生成。',
  Trae: '字节跳动的 AI IDE，支持中文对话、项目级生成和代码重构。',
  文心快码: '百度的智能代码助手，提供补全、注释、单测和代码审查能力。',

  'Hugging Face': '全球开源 AI 社区，聚集模型、数据集、Space 应用和开发文档。',
  'ModelScope 魔搭': '阿里达摩院的开源模型社区，提供模型下载、训练和在线体验。',
  'OpenAI Platform': 'OpenAI 的开发者平台，可调用 GPT、图像、语音和向量模型。',
  'Anthropic Console':
    'Anthropic 的开发者控制台，用于调用 Claude 模型和管理 API。',
  'Google AI Studio': 'Google 的生成式 AI 开发平台，可快速试验 Gemini 模型。',
  Ollama: '本地运行开源大模型的工具，一条命令即可部署和调用模型。',

  GitHub: '全球最大的代码托管平台，也是 AI 开源项目和模型实现的主要聚集地。',
  'Stack Overflow': '开发者问答社区，查找编程问题、报错原因和工程实践。',
  稀土掘金: '中文开发者社区，汇集 AI 编程、前端和后端技术文章。',
  arXiv: '学术预印本平台，AI、机器学习和自然语言处理论文的重要来源。',
  'Papers with Code': '论文与开源代码对照平台，方便复现模型和查找基准结果。',
  'Towards Data Science': '数据科学与机器学习博客，适合阅读实战教程和案例。',

  "There's An AI For That":
    '按任务检索 AI 工具的目录站，覆盖写作、设计、编程等场景。',
  Futurepedia: 'AI 工具百科全书，提供分类浏览、价格信息和产品更新。',
  'AI 工具集': '中文 AI 工具导航，收录写作、绘画、视频和办公类应用。',
  Toolify: '按分类和热度探索 AI 工具的目录，附带用户评分和流量排行。',
  TopAI: 'AI 工具聚合站，可按用途筛选产品并查看热门榜单。',
  'AI Tool Hunt': '面向全球用户的 AI 工具发现平台，支持场景化搜索。',

  'DeepLearning.AI': '吴恩达创办的 AI 教育平台，提供深度学习和大模型课程。',
  Coursera: '国际在线课程平台，可系统学习机器学习、生成式 AI 和数据科学。',
  'Fast.ai': '面向实践者的深度学习课程，强调快速上手和项目驱动学习。',
  'Hugging Face Learn':
    'Hugging Face 官方学习中心，覆盖 NLP、Agent 和模型微调。',
  Udacity: '技术职业课程平台，提供 AI 工程师和数据科学家纳米学位。',
  'OpenAI Academy': 'OpenAI 的 AI 学习资源站，提供提示词、应用和行业案例。',

  'OpenAI Docs': 'OpenAI 官方 API 文档，包含模型参数、调用示例和最佳实践。',
  'Anthropic Docs': 'Claude 的开发者文档，介绍提示词、工具调用和上下文管理。',
  'Prompting Guide': '系统化提示词学习网站，讲解技巧、模型差异和实战案例。',
  LangChain: '构建 LLM 应用的开发框架，支持工具调用、RAG 和 Agent 编排。',
  LlamaIndex: '面向数据连接的 LLM 框架，适合构建知识库和检索增强应用。',
  'Learn Prompting': '免费提示词工程课程，从基础写法到复杂 Agent 工作流。',

  'Semantic Scholar': 'AI 驱动的学术搜索引擎，可查找论文、引用关系和相关研究。',
  'Google Scholar': '谷歌学术搜索，覆盖论文、会议、专利和引用数据。',
  'Connected Papers': '论文关系可视化工具，帮助梳理研究脉络和关联工作。',

  'Product Hunt': '新产品发布社区，可发现最新 AI 应用、工具和创业项目。',
  'GPT Store': 'OpenAI 的 GPT 应用商店，浏览各领域定制助手和插件。',
  Poe: 'Quora 推出的多模型聊天平台，可对比使用不同 AI 机器人。',
  '扣子 Coze': '字节跳动的 AI Bot 开发平台，支持插件、工作流和多平台发布。',
  Dify: '开源 LLM 应用开发平台，提供可视化编排、RAG 和 Agent 能力。',
  FastGPT: '开源知识库问答系统，支持文档导入、向量检索和流程编排。',
  OpenRouter: '统一调用多家大模型的 API 网关，方便比较价格和效果。',
  Figma: '协作式设计工具，结合 AI 插件可快速生成界面和设计素材。',
  Canva: '在线设计平台，提供 AI 生图、文案和演示文稿制作能力。',
  Krea: 'AI 视觉创作工具，支持实时生成、放大和风格迁移。',
  Clipdrop: '图像处理工具箱，提供抠图、扩图、擦除和生成功能。',
  Magnific: 'AI 图像放大与细节增强工具，适合提升素材清晰度。',
  'Adobe Firefly': 'Adobe 的生成式 AI 设计工具，支持图像、文字和矢量生成。',

  'Reddit r/artificial': 'Reddit 的 AI 讨论区，交流模型、产品和行业新闻。',
  知乎: '中文问答社区，可关注 AI 话题、技术解读和行业讨论。',
  V2EX: '开发者社区，常有大模型、AI 工具和独立开发相关讨论。',
  'Hugging Face Discuss':
    'Hugging Face 官方论坛，讨论模型使用、训练和开源项目。',
  Discord: '实时社区平台，许多 AI 项目和开发者在这里建立交流频道。',
  'Linux.do': '中文技术社区，讨论 AI 工具、开发资源和效率玩法。',
  'Simon Willison': '开发者博客，持续分享 LLM 工具、提示词和工程实践。',
  "Lil'Log": '翁丽莲的机器学习博客，深入讲解大模型、Agent 和研究论文。',
  'Import AI': '每周 AI 研究通讯，梳理重要论文、政策与产业进展。',
  'The Gradient': 'AI 研究与评论媒体，提供深度文章和研究者访谈。',
  Gitee: '国内代码托管平台，可查找 AI 开源项目和学习资源。',
  Replicate: '在线运行开源模型的平台，支持图像、视频和语言模型 API。',

  '阿里云 PAI': '阿里云的机器学习平台，提供模型训练、部署和推理服务。',
  '腾讯云 TI': '腾讯云的 AI 平台，覆盖数据标注、训练和模型服务。',
  'AWS SageMaker': '亚马逊云的机器学习平台，支持端到端训练与部署。',
  百度飞桨: '百度开源深度学习框架，配套模型库、工具和算力生态。',
  火山引擎: '字节跳动的云服务平台，提供大模型、算力和视频云能力。',
  华为昇腾: '华为的 AI 算力生态，包含昇腾芯片、开发工具和行业方案。',
  'Label Studio': '开源数据标注平台，支持文本、图像、音频和多模态标注。',
  'Scale AI': '数据标注与模型评估服务商，面向自动驾驶和企业 AI。',
  Appen: '全球数据服务公司，提供训练数据、标注和模型评估。',
  DataRobot: '企业级机器学习平台，支持自动化建模和模型运维。',
  百度众测: '百度旗下的数据众包平台，可参与标注任务和模型评测。',
  'LMSYS Arena': '大模型匿名对战排行榜，通过用户投票比较模型表现。',
  OpenCompass: '开源大模型评测平台，提供多维度基准和榜单。',
  'Artificial Analysis': '独立模型分析网站，对比速度、价格和质量指标。',
  EvalPlus: '代码生成模型评测项目，提供增强测试集和评估工具。',
  'Open LLM Leaderboard': 'Hugging Face 的开源大模型排行榜，比较多项基准成绩。',
};

const hashText = (text: string) => {
  let hash = 2166136261;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

// 浏览量和点赞量由站点名稳定生成：不同站点数值不同，刷新后也不会跳变
const siteStats = (name: string) => {
  const hash = hashText(name);
  const views = 800 + (hash % 18000);
  const likeRate = 0.018 + ((hash >>> 8) % 50) / 1000;
  return {
    views,
    likes: Math.max(12, Math.round(views * likeRate)),
  };
};

// 常用 AI 站点优先复用本地图标，其余走 favicon 服务
const site = (name: string, domain: string, path = ''): WebsiteSite => ({
  name,
  url: `https://${domain}${path}`,
  icon: aiIconByDomain[domain] ?? `https://favicon.im/${domain}?size=128`,
  desc:
    siteDescriptions[name] ??
    `${name} 是 AI 学习、创作与开发中值得收藏的资源站点。`,
  ...siteStats(name),
});

export const websiteCategories: WebsiteCategoryGroup[] = [
  {
    name: 'AI 对话与搜索',
    children: [
      {
        name: 'AI 对话',
        sites: [
          site('ChatGPT', 'chatgpt.com'),
          site('Claude', 'claude.ai'),
          site('Gemini', 'gemini.google.com'),
          site('DeepSeek', 'deepseek.com'),
          site('豆包', 'doubao.com'),
          site('Kimi', 'kimi.moonshot.cn'),
          site('文心一言', 'yiyan.baidu.com'),
          site('通义千问', 'tongyi.aliyun.com'),
        ],
      },
      {
        name: 'AI 搜索',
        sites: [
          site('Perplexity', 'perplexity.ai'),
          site('秘塔 AI 搜索', 'metaso.cn'),
          site('天工 AI', 'tiangong.cn'),
          site('You.com', 'you.com'),
          site('Phind', 'phind.com'),
          site('夸克 AI 搜索', 'quark.cn'),
        ],
      },
      {
        name: 'AI 资讯',
        sites: [
          site('机器之心', 'jiqizhixin.com'),
          site('量子位', 'qbitai.com'),
          site('AIBase', 'aibase.com'),
          site('36氪', '36kr.com'),
          site('TechCrunch', 'techcrunch.com'),
          site('The Verge', 'theverge.com'),
        ],
      },
    ],
  },
  {
    name: 'AIGC 创作',
    children: [
      {
        name: 'AI 绘画',
        sites: [
          site('Midjourney', 'midjourney.com'),
          site('即梦 AI', 'jimeng.jianying.com'),
          site('通义万相', 'tongyi.aliyun.com', '/wanxiang'),
          site('Stable Diffusion', 'stability.ai'),
          site('Leonardo.Ai', 'leonardo.ai'),
          site('Civitai', 'civitai.com'),
        ],
      },
      {
        name: 'AI 视频',
        sites: [
          site('可灵 AI', 'klingai.com'),
          site('Runway', 'runwayml.com'),
          site('Pika', 'pika.art'),
          site('Luma AI', 'lumalabs.ai'),
          site('海螺 AI', 'hailuoai.com'),
          site('Sora', 'openai.com', '/sora'),
        ],
      },
      {
        name: 'AI 音乐',
        sites: [
          site('Suno', 'suno.com'),
          site('Udio', 'udio.com'),
          site('ElevenLabs', 'elevenlabs.io'),
          site('网易天音', 'tianyin.163.com'),
          site('魔音工坊', 'moyin.com'),
          site('Soundraw', 'soundraw.io'),
        ],
      },
      {
        name: 'AI 数字人',
        sites: [
          site('HeyGen', 'heygen.com'),
          site('D-ID', 'd-id.com'),
          site('Synthesia', 'synthesia.io'),
          site('腾讯智影', 'zhiying.tencent.com'),
          site('硅基智能', 'guiji.ai'),
        ],
      },
    ],
  },
  {
    name: 'AI 开发',
    children: [
      {
        name: 'AI 编程',
        sites: [
          site('GitHub Copilot', 'github.com', '/features/copilot'),
          site('Cursor', 'cursor.com'),
          site('Windsurf', 'windsurf.com'),
          site('通义灵码', 'tongyi.aliyun.com', '/lingma'),
          site('Trae', 'trae.ai'),
          site('文心快码', 'comate.baidu.com'),
        ],
      },
      {
        name: '模型平台',
        sites: [
          site('Hugging Face', 'huggingface.co'),
          site('ModelScope 魔搭', 'modelscope.cn'),
          site('OpenAI Platform', 'platform.openai.com'),
          site('Anthropic Console', 'console.anthropic.com'),
          site('Google AI Studio', 'aistudio.google.com'),
          site('Ollama', 'ollama.com'),
        ],
      },
      {
        name: '开发社区',
        sites: [
          site('GitHub', 'github.com'),
          site('Stack Overflow', 'stackoverflow.com'),
          site('稀土掘金', 'juejin.cn'),
          site('arXiv', 'arxiv.org'),
          site('Papers with Code', 'paperswithcode.com'),
          site('Towards Data Science', 'towardsdatascience.com'),
        ],
      },
      {
        name: 'AI 工具',
        sites: [
          site("There's An AI For That", 'theresanaiforthat.com'),
          site('Futurepedia', 'futurepedia.io'),
          site('AI 工具集', 'ai-bot.cn'),
          site('Toolify', 'toolify.ai'),
          site('TopAI', 'topai.tools'),
          site('AI Tool Hunt', 'aitoolhunt.com'),
        ],
      },
    ],
  },
  {
    name: 'AI 学习',
    children: [
      {
        name: 'AI 课程',
        sites: [
          site('DeepLearning.AI', 'deeplearning.ai'),
          site('Coursera', 'coursera.org'),
          site('Fast.ai', 'fast.ai'),
          site('Hugging Face Learn', 'huggingface.co', '/learn'),
          site('Udacity', 'udacity.com'),
          site('OpenAI Academy', 'academy.openai.com'),
        ],
      },
      {
        name: '提示词文档',
        sites: [
          site('OpenAI Docs', 'platform.openai.com', '/docs'),
          site('Anthropic Docs', 'docs.anthropic.com'),
          site('Prompting Guide', 'promptingguide.ai'),
          site('LangChain', 'langchain.com'),
          site('LlamaIndex', 'llamaindex.ai'),
          site('Learn Prompting', 'learnprompting.org'),
        ],
      },
      {
        name: 'AI 论文',
        sites: [
          site('arXiv', 'arxiv.org'),
          site('Papers with Code', 'paperswithcode.com'),
          site('Semantic Scholar', 'semanticscholar.org'),
          site('Google Scholar', 'scholar.google.com'),
          site('Connected Papers', 'connectedpapers.com'),
        ],
      },
    ],
  },
  {
    name: 'AI 产品',
    children: [
      {
        name: 'AI 产品库',
        sites: [
          site('Product Hunt', 'producthunt.com'),
          site("There's An AI For That", 'theresanaiforthat.com'),
          site('Futurepedia', 'futurepedia.io'),
          site('AI Tool Hunt', 'aitoolhunt.com'),
          site('TopAI', 'topai.tools'),
        ],
      },
      {
        name: 'AI 应用市场',
        sites: [
          site('GPT Store', 'chatgpt.com', '/gpts'),
          site('Poe', 'poe.com'),
          site('扣子 Coze', 'coze.cn'),
          site('Dify', 'dify.ai'),
          site('FastGPT', 'fastgpt.in'),
          site('OpenRouter', 'openrouter.ai'),
        ],
      },
      {
        name: 'AI 设计',
        sites: [
          site('Figma', 'figma.com'),
          site('Canva', 'canva.com'),
          site('Krea', 'krea.ai'),
          site('Clipdrop', 'clipdrop.co'),
          site('Magnific', 'magnific.ai'),
          site('Adobe Firefly', 'firefly.adobe.com'),
        ],
      },
    ],
  },
  {
    name: 'AI 社区',
    children: [
      {
        name: 'AI 社区',
        sites: [
          site('Reddit r/artificial', 'reddit.com', '/r/artificial'),
          site('知乎', 'zhihu.com'),
          site('V2EX', 'v2ex.com'),
          site('Hugging Face Discuss', 'discuss.huggingface.co'),
          site('Discord', 'discord.com'),
          site('Linux.do', 'linux.do'),
        ],
      },
      {
        name: 'AI 博客',
        sites: [
          site('机器之心', 'jiqizhixin.com'),
          site('量子位', 'qbitai.com'),
          site('Simon Willison', 'simonwillison.net'),
          site("Lil'Log", 'lilianweng.github.io'),
          site('Import AI', 'importai.substack.com'),
          site('The Gradient', 'thegradient.pub'),
        ],
      },
      {
        name: 'AI 开源',
        sites: [
          site('GitHub', 'github.com'),
          site('Gitee', 'gitee.com'),
          site('Hugging Face', 'huggingface.co'),
          site('ModelScope 魔搭', 'modelscope.cn'),
          site('OpenRouter', 'openrouter.ai'),
          site('Replicate', 'replicate.com'),
        ],
      },
    ],
  },
  {
    name: 'AI 基础设施',
    children: [
      {
        name: '算力平台',
        sites: [
          site('阿里云 PAI', 'aliyun.com', '/product/pai'),
          site('腾讯云 TI', 'cloud.tencent.com', '/product/ti'),
          site('AWS SageMaker', 'aws.amazon.com', '/sagemaker'),
          site('百度飞桨', 'paddlepaddle.org.cn'),
          site('火山引擎', 'volcanoengine.com'),
          site('华为昇腾', 'ascend.huawei.com'),
        ],
      },
      {
        name: '数据标注',
        sites: [
          site('Label Studio', 'labelstud.io'),
          site('Scale AI', 'scale.com'),
          site('Appen', 'appen.com'),
          site('DataRobot', 'datarobot.com'),
          site('百度众测', 'test.baidu.com'),
        ],
      },
      {
        name: '模型评测',
        sites: [
          site('LMSYS Arena', 'lmarena.ai'),
          site('OpenCompass', 'opencompass.org.cn'),
          site('Artificial Analysis', 'artificialanalysis.ai'),
          site('EvalPlus', 'evalplus.github.io'),
          site(
            'Open LLM Leaderboard',
            'huggingface.co',
            '/spaces/open-llm-leaderboard/open_llm_leaderboard',
          ),
        ],
      },
    ],
  },
];
