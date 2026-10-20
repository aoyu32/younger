import { aiIconByDomain } from './aiCatalog';

export interface WebsiteSite {
  name: string;
  url: string;
  icon: string;
}

export interface WebsiteCategoryChild {
  name: string;
  sites: WebsiteSite[];
}

export interface WebsiteCategoryGroup {
  name: string;
  children: WebsiteCategoryChild[];
}

// 常用 AI 站点优先复用本地图标，其余走 favicon 服务
const site = (
  name: string,
  domain: string,
  path = '',
): WebsiteSite => ({
  name,
  url: `https://${domain}${path}`,
  icon:
    aiIconByDomain[domain] ??
    `https://favicon.im/${domain}?size=128`,
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
