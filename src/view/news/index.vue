<template>
  <div class="news">
    <div class="slogan">
      <PageSlogan
        content="追踪 AI 前沿资讯，读懂正在发生的未来。"
        sub-content="AI资讯"
      />
      <div class="section-wrapper flex">
        <div class="wrapper-left">
          <div class="topic">
            <TodayTopic
              :content="topicContent"
              :date="topicDate"
              :people-count="peopleCount"
              :comments="topicMessages"
            />
          </div>
          <div class="line">
            <AoImage
              src="@/assets/news/icon_love_arrow_line.svg"
              width="100%"
              height="40px"
              fit="contain"
            ></AoImage>
          </div>
          <div class="new-news">
            <NewsListCard
              label="最新资讯"
              sub-label="今日更新"
              :list="newNewsList"
              @click="handleNewsClick"
            />
          </div>
        </div>
        <div class="wrapper-right">
          <div class="hot-course">
            <HotCourseList
              label="热门课程"
              sub-label="推荐学习"
              :list="hotCourseList"
              @click="handleCourseClick"
            />
          </div>
        </div>
      </div>
      <div class="tabs-wrapper">
        <NewsTabs
          v-model="activeTab"
          :tabs="newsTabs"
          :list="currentTabList"
          @card-click="handleCardClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useTopic } from '@/store/module/topic';
import PageSlogan from '@/components/page-slogan/index.vue';
import TodayTopic from './components/TodayTopic.vue';
import NewsListCard from './components/NewsListCard.vue';
import HotCourseList from './components/HotCourseList.vue';
import NewsTabs from './components/NewsTabs.vue';
import { aiImagePool } from '@/mock/aiImages';

const router = useRouter();

const { latestTopic } = useTopic();

const topicContent = computed(() => latestTopic.value?.title ?? '');
const topicDate = computed(() => latestTopic.value?.date ?? '');
const peopleCount = computed(() =>
  String(latestTopic.value?.participants ?? 0),
);

const topicMessages = computed(() =>
  (latestTopic.value?.messages ?? []).slice(0, 2).map((message) => ({
    id: message.id,
    user: message.user.name,
    avatar: message.user.avatar,
    text: message.content?.trim() ?? '',
    images: message.images ?? [],
    likes: message.likes ?? 0,
  })),
);

const newNewsList = ref([
  {
    id: 1,
    title: 'OpenAI 发布 GPT-5 预览版，多模态能力大幅提升',
    summary: '新模型支持图像、音频和文本的联合推理，预计年底正式上线。',
    cover: aiImagePool[0],
    views: 15800,
  },
  {
    id: 2,
    title: 'Google DeepMind 推出 AlphaFold 3，加速药物研发',
    summary: '蛋白质结构预测精度再创新高，有望大幅缩短新药研发周期。',
    cover: aiImagePool[1],
    views: 9200,
  },
  {
    id: 3,
    title: '国内首个 AI 大模型合规备案名单公布，百度、阿里、腾讯在列',
    summary: '首批通过备案的大模型将率先面向公众提供服务。',
    cover: aiImagePool[2],
    views: 6700,
  },
  {
    id: 5,
    title: '微软 Copilot 全面集成 Office 全家桶，提升办公效率',
    summary: '用户可通过自然语言指令完成文档、表格、幻灯片创作。',
    cover: aiImagePool[3],
    views: 24500,
  },
  {
    id: 6,
    title: 'AI 芯片大战：NVIDIA H200 发布，AMD 紧随其后',
    summary: '算力军备竞赛加速，AI 基础设施投资持续升温。',
    cover: aiImagePool[4],
    views: 19800,
  },
]);

const handleNewsClick = (id: string | number) => {
  console.log('点击资讯 ID:', id);
};

const hotCourseList = ref([
  {
    id: 1,
    name: '大模型应用开发实战',
    desc: '从 0 到 1 构建你的 AI 应用',
    image: aiImagePool[5],
    studingCount: 28640,
  },
  {
    id: 2,
    name: '提示词工程从入门到精通',
    desc: '结构化提示词与评测方法',
    image: aiImagePool[16],
    studingCount: 19280,
  },
  {
    id: 3,
    name: 'RAG 知识库实战',
    desc: 'Embedding、向量库与引用',
    image: aiImagePool[11],
    studingCount: 15760,
  },
  {
    id: 4,
    name: 'AI Agent 开发指南',
    desc: '工具调用、MCP 与多智能体',
    image: aiImagePool[12],
    studingCount: 13420,
  },
  {
    id: 5,
    name: 'AIGC 视觉创作工作流',
    desc: 'Midjourney + 可灵 + Runway',
    image: aiImagePool[7],
    studingCount: 21800,
  },
  {
    id: 6,
    name: '多模态大模型应用',
    desc: '图文、视频与语音统一理解',
    image: aiImagePool[13],
    studingCount: 11650,
  },
  {
    id: 7,
    name: 'AI 产品经理实战',
    desc: '从需求验证到上线复盘',
    image: aiImagePool[14],
    studingCount: 9860,
  },
  {
    id: 8,
    name: '深度学习与 PyTorch',
    desc: '从张量到模型微调',
    image: aiImagePool[8],
    studingCount: 18700,
  },
  {
    id: 9,
    name: 'AI 编程与代码智能',
    desc: 'Copilot、Cursor 与代码审查',
    image: aiImagePool[9],
    studingCount: 16400,
  },
  {
    id: 10,
    name: 'AI 数据分析实战',
    desc: '用自然语言完成数据洞察',
    image: aiImagePool[15],
    studingCount: 7300,
  },
]);

const handleCourseClick = (id: string | number) => {
  const course = hotCourseList.value.find((item) => item.id === id);
  router.push({
    name: 'totorial',
    query: { chapter: String(id), title: course?.name ?? '' },
  });
};

/* ================= 分类 Tab 列表 ================= */
const newsTabs = ref([
  { id: 'all', label: '全部' },
  { id: 'ai', label: 'AI 资讯' },
  { id: 'llm', label: '大模型' },
  { id: 'aigc', label: 'AIGC' },
  { id: 'dev', label: 'AI 编程' },
  { id: 'frontend', label: 'AI 应用' },
  { id: 'backend', label: '模型训练' },
  { id: 'product', label: 'AI 产品' },
  { id: 'career', label: 'AI 职场' },
  { id: 'industry', label: '行业观察' },
  { id: 'opensource', label: '开源模型' },
  { id: 'tools', label: '效率工具' },
]);

const activeTab = ref('all');

type NewsCard = {
  id: string | number;
  title: string;
  content: string;
  cover?: string;
  date?: string;
  viewCount?: number;
  likeCount?: number;
  collectCount?: number;
};

const allList: NewsCard[] = [
  {
    id: 101,
    title: 'OpenAI 发布 GPT-5 预览版，多模态能力大幅提升',
    content:
      '新模型支持图像、音频和文本的联合推理，在复杂推理任务上的表现相比 GPT-4 提升显著，数学推理、代码生成、多语言理解等多项基准测试创下新高，预计年底正式上线，定价策略尚未公布。',
    cover: aiImagePool[15],
    date: '2026-09-12',
    viewCount: 15800,
    likeCount: 320,
    collectCount: 88,
  },
  {
    id: 102,
    title: 'Google DeepMind 推出 AlphaFold 3，加速药物研发',
    content:
      '蛋白质结构预测精度再创新高，可同时预测蛋白质与 DNA、RNA 及小分子的相互作用，有望大幅缩短新药研发周期。',
    cover: aiImagePool[16],
    date: '2026-09-11',
    viewCount: 9200,
    likeCount: 210,
  },
  {
    id: 103,
    title: '国内首个 AI 大模型合规备案名单公布',
    content:
      '百度、阿里、腾讯等企业首批通过备案，覆盖通用对话、内容生成与企业服务等场景。备案要求明确数据来源、安全评估和内容标识，也意味着大模型产品从灰度测试走向规范化运营。',
    cover: aiImagePool[0],
    date: '2026-09-10',
    viewCount: 6700,
    collectCount: 42,
  },
  {
    id: 104,
    title: '微软 Copilot 全面集成 Office 全家桶',
    content:
      '用户可通过自然语言指令完成文档撰写、表格分析、幻灯片创作等任务，Word、Excel、PPT 均获得 AI 能力加持，工作效率提升显著，但企业版订阅费用也成为关注焦点，分析师认为这将重塑办公软件市场格局。',
    cover: aiImagePool[1],
    date: '2026-09-09',
    viewCount: 24500,
    likeCount: 580,
    collectCount: 152,
  },
  {
    id: 105,
    title: 'AI 芯片大战：NVIDIA H200 发布，AMD 紧随其后',
    content:
      'H200 主打更大显存与更高带宽，面向千亿参数模型的训练和推理；AMD 则用 MI300 系列强调性价比与开放生态。云厂商的采购策略将直接影响算力成本和模型迭代速度。',
    cover: aiImagePool[2],
    date: '2026-09-08',
    viewCount: 19800,
    likeCount: 340,
    collectCount: 96,
  },
  {
    id: 106,
    title: '如何用 Cursor 提升前端开发效率',
    content:
      '从项目初始化、组件拆分到跨文件重构，Cursor 可以读取整个代码库并按指令生成 diff。实践中要把需求拆小、先写验收标准，再用测试和类型检查兜住 AI 改动。',
    cover: aiImagePool[3],
    date: '2026-09-07',
    viewCount: 12300,
    likeCount: 420,
    collectCount: 210,
  },
  {
    id: 107,
    title: '苹果发布 Apple Intelligence，Siri 迎来史上最大更新',
    content:
      '基于设备端大模型与云端协同，Siri 在理解能力、上下文记忆、跨应用操作等方面获得质的飞跃，可以直接读取屏幕内容、理解用户当前场景，并在多个应用之间完成任务链路，隐私保护也做了全新设计。',
    cover: aiImagePool[4],
    date: '2026-09-06',
    viewCount: 31200,
    likeCount: 780,
    collectCount: 320,
  },
  {
    id: 108,
    title: '从 0 到 1 搭建 RAG 知识库系统',
    content:
      '先完成文档解析、切分与向量化，再接入检索、重排和引用生成。上线前要评估召回率、答案忠实度和响应延迟，并为权限过滤、增量更新和失败重试预留工程方案。',
    cover: aiImagePool[5],
    date: '2026-09-05',
    viewCount: 8600,
    likeCount: 260,
    collectCount: 145,
  },
  {
    id: 109,
    title: 'Meta 开源 Llama 4，性能对标 GPT-4',
    content:
      'Llama 4 提供 8B、70B、400B 三个版本，全部开放商用授权，本地部署成本大幅降低，推理速度相比上一代提升 2 倍。',
    cover: aiImagePool[6],
    date: '2026-09-04',
    viewCount: 18200,
    likeCount: 520,
    collectCount: 280,
  },
  {
    id: 110,
    title: 'AI 编程助手横向评测：Copilot vs Cursor vs Claude Code',
    content:
      '从代码补全、跨文件修改、终端操作和代码审查四个维度对比，结合团队规模与安全要求给出选型建议。个人开发者更看重流畅度，企业团队则要优先考虑权限、审计和私有化部署。',
    cover: aiImagePool[7],
    date: '2026-09-03',
    viewCount: 22400,
    likeCount: 680,
    collectCount: 340,
  },
  {
    id: 111,
    title: 'AI 时代下程序员的职业发展路径思考',
    content:
      '当 AI 可以自动写代码时，程序员的核心竞争力在哪里？本文从技术深度、业务理解、AI 协作能力三个角度探讨，并给出一份可执行的学习路线图，帮助开发者在变革中找准自己的定位。',
    cover: aiImagePool[2],
    date: '2026-09-02',
    viewCount: 5400,
    likeCount: 180,
    collectCount: 92,
  },
  {
    id: 112,
    title: '2026 年 AI 行业投融资趋势报告',
    content:
      '资本继续向基础设施、智能体和垂直行业应用集中，早期项目更看重真实收入与留存。报告梳理融资轮次、估值变化和退出路径，并提示算力成本、监管合规与同质化竞争风险。',
    cover: aiImagePool[8],
    date: '2026-09-01',
    viewCount: 3200,
  },
  {
    id: 113,
    title: 'AI 视频生成进入 4K 时代，创作者工作流正在重构',
    content:
      '从脚本、分镜到生成和剪辑，AI 视频工具正在把过去需要团队协作的流程压缩到一个人。本文梳理当前主流工具的能力边界和实际制作流程。',
    cover: aiImagePool[9],
    date: '2026-08-30',
    viewCount: 1200,
  },
];

const aiList: NewsCard[] = [
  {
    id: 201,
    title: 'OpenAI 发布 GPT-5 预览版',
    content:
      '新模型在推理、代码和多模态理解上均有提升，支持更长的上下文与更稳定的工具调用。OpenAI 表示将分阶段开放 API，并加强高风险场景的安全评估与内容标识。',
    cover: aiImagePool[10],
    date: '2026-09-12',
    viewCount: 15800,
    likeCount: 320,
    collectCount: 88,
  },
  {
    id: 202,
    title: 'Anthropic 发布 Claude 4 Opus，长上下文能力突破 1M tokens',
    content:
      '可以一次性处理整本书的内容，在代码理解和文档分析场景下表现尤为突出，同时在安全对齐上做了大量工作。',
    cover: aiImagePool[11],
    date: '2026-09-11',
    viewCount: 12400,
    likeCount: 280,
  },
  {
    id: 203,
    title: 'DeepMind 推出新一代通用智能体',
    content:
      '新智能体可以在浏览器、代码环境和办公软件中自主规划任务，并根据执行结果调整步骤。研究团队重点展示了长任务拆解、工具使用和失败恢复能力，距离通用助手又近一步。',
    cover: aiImagePool[12],
    date: '2026-09-10',
    viewCount: 9800,
  },
  {
    id: 204,
    title: '欧盟 AI 法案正式生效，全球监管趋严',
    content:
      '对高风险 AI 应用提出严格的透明度和审计要求，违规最高可处全球营收 7% 的罚款，所有在欧盟市场运营的 AI 厂商都需要重新评估合规策略，中小企业面临更大压力。',
    cover: aiImagePool[13],
    date: '2026-09-09',
    viewCount: 7600,
    likeCount: 190,
    collectCount: 72,
  },
  {
    id: 205,
    title: '多模态大模型的下一步：从理解到生成',
    content:
      '从图文理解到图像、音频和视频生成，多模态模型正在走向统一表征与跨模态推理。文章梳理技术演进路径，并展望未来三年在内容创作、机器人和教育场景的落地机会。',
    cover: aiImagePool[14],
    date: '2026-09-08',
    viewCount: 6300,
  },
  {
    id: 206,
    title: 'AI 生成内容的法律边界在哪里',
    content:
      '从著作权归属、训练数据合规、生成内容责任三个维度讨论 AIGC 的法律风险，结合近期国内外典型案例，给出企业合规建议。',
    cover: aiImagePool[16],
    date: '2026-09-07',
    viewCount: 4400,
    likeCount: 120,
  },
];

const llmList: NewsCard[] = [
  {
    id: 301,
    title: '大模型微调的 5 种主流方案对比',
    content:
      '全量微调、LoRA、QLoRA、Prefix Tuning、Adapter 的原理、成本与适用场景详细对比，附具体代码示例和实测性能数据，帮助你根据团队预算和任务难度做出最优选择。',
    cover: aiImagePool[15],
    date: '2026-09-12',
    viewCount: 9400,
    likeCount: 260,
    collectCount: 180,
  },
  {
    id: 302,
    title: '从零训练一个 7B 大模型需要多少钱',
    content:
      '成本主要包括 GPU 租用、数据清洗、人工标注和反复实验。以 7B 模型为例，预训练、微调和评测各阶段的开销差异很大，文章给出不同规模下的预算区间与省钱策略。',
    cover: aiImagePool[16],
    date: '2026-09-11',
    viewCount: 12800,
    likeCount: 380,
    collectCount: 220,
  },
  {
    id: 303,
    title: '为什么大模型会有幻觉？如何缓解',
    content:
      '从训练数据、解码策略、知识边界三个角度分析幻觉成因，并给出 RAG、CoT 等缓解手段。',
    cover: aiImagePool[0],
    date: '2026-09-10',
    viewCount: 8700,
  },
  {
    id: 304,
    title: 'MoE 架构详解：如何用更少的算力训练更大的模型',
    content:
      'MoE 通过稀疏激活让每次推理只调用部分专家，在控制计算量的同时扩大模型容量。文章解释路由机制、负载均衡和专家并行，并对比 Dense 模型在训练与部署上的差异。',
    cover: aiImagePool[1],
    date: '2026-09-09',
    viewCount: 7100,
    likeCount: 210,
  },
];

const aigcList: NewsCard[] = [
  {
    id: 401,
    title: 'Midjourney v7 发布，真实感再升级',
    content:
      '新版在光影、材质和细节一致性上明显提升，人物手部和复杂场景的崩坏率降低。文章实测不同风格提示词，并分享构图、参考图和局部重绘的实用技巧。',
    cover: aiImagePool[2],
    date: '2026-09-12',
    viewCount: 18400,
    likeCount: 520,
    collectCount: 280,
  },
  {
    id: 402,
    title: 'Stable Diffusion 3.5 开源，消费级显卡可跑',
    content:
      '8GB 显存即可运行，生成质量接近闭源模型，社区生态迅速丰富，大量第三方插件和模型微调版本已经上线，让个人创作者也能玩转高质量 AI 绘画。',
    cover: aiImagePool[3],
    date: '2026-09-11',
    viewCount: 14200,
    likeCount: 420,
    collectCount: 240,
  },
  {
    id: 403,
    title: 'AI 视频生成三巨头横评：Sora vs Runway vs Pika',
    content:
      '从画面稳定性、镜头控制、生成时长和音效同步四个维度对比，结合广告、短片和社交媒体场景给出选择建议。三款工具在一致性和可控性上各有取舍。',
    cover: aiImagePool[4],
    date: '2026-09-10',
    viewCount: 22600,
    likeCount: 680,
    collectCount: 340,
  },
  {
    id: 404,
    title: 'AI 配音已经能骗过专业听众了吗',
    content:
      '用 10 段不同风格的语音做盲测，结果出乎意料，但也暴露出情感表达的短板。',
    cover: aiImagePool[5],
    date: '2026-09-09',
    viewCount: 9800,
  },
  {
    id: 405,
    title: '如何用 AI 工具做出一个完整的短剧',
    content:
      '从剧本拆解、角色设定到分镜生成、配音和剪辑，AI 可以覆盖短剧生产的大部分环节。关键是用统一角色参考和镜头描述保持连贯，并在后期人工把关节奏与情绪。',
    cover: aiImagePool[6],
    date: '2026-09-08',
    viewCount: 11300,
    likeCount: 340,
  },
];

const devList: NewsCard[] = [
  {
    id: 501,
    title: 'GitHub Copilot 推出多模型代理模式',
    content:
      '可以在 IDE 内切换不同模型与推理强度，并让 Copilot 自动规划多文件修改。新版还加强了代码审查和终端错误解释，适合把 AI 真正放进日常开发流程。',
    cover: aiImagePool[0],
    date: '2026-09-12',
    viewCount: 12400,
    likeCount: 320,
    collectCount: 180,
  },
  {
    id: 502,
    title: 'Cursor 2.0 发布：全项目理解与多文件编辑',
    content:
      '新版索引整个代码库，支持用 @ 引用文件和符号，一次指令完成跨文件重构，并以 diff 形式逐步审阅。对大型项目来说，上下文管理比单纯补全更关键。',
    cover: aiImagePool[3],
    date: '2026-09-11',
    viewCount: 10800,
    likeCount: 280,
    collectCount: 140,
  },
  {
    id: 503,
    title: 'Claude Code 实战：从需求到提交',
    content:
      '用自然语言描述需求后，让智能体读取项目、编写测试、运行命令并修复失败用例。本文给出一套可控的协作流程，重点是如何设置验收标准和回滚边界。',
    cover: aiImagePool[5],
    date: '2026-09-10',
    viewCount: 8600,
  },
  {
    id: 504,
    title: 'Windsurf 智能体：让 AI 参与完整开发流程',
    content:
      'Cascade 会先规划步骤，再自动收集相关文件和终端输出。团队可以把编码规范写成规则，减少风格漂移，并通过清晰的 diff 记录控制每次改动。',
    cover: aiImagePool[9],
    date: '2026-09-09',
    viewCount: 7200,
    likeCount: 180,
  },
  {
    id: 505,
    title: 'MCP 工具链：把内部系统接入 AI 编程助手',
    content:
      '通过 MCP 把数据库、工单系统和部署平台暴露成标准工具，让编程助手在权限范围内查询和操作。关键是参数校验、最小权限和副作用操作的人工确认。',
    cover: aiImagePool[11],
    date: '2026-09-08',
    viewCount: 9400,
    collectCount: 96,
  },
  {
    id: 506,
    title: 'AI 代码审查如何落地：规则、评测与人工复核',
    content:
      '先让 AI 找明显缺陷和安全风险，再用规则引擎处理格式与依赖问题，最后保留人工复核。上线前需要用历史 Bug 和误报样本评测审查效果。',
    cover: aiImagePool[14],
    date: '2026-09-07',
    viewCount: 6800,
    likeCount: 220,
  },
];

const frontendList: NewsCard[] = [
  {
    id: 601,
    title: '用 v0 生成 Vue 3 界面：从设计稿到代码',
    content:
      '把设计稿和交互说明交给生成式 UI 工具，得到可运行的 Vue 组件，再补上状态管理和接口。文章重点讨论如何控制组件粒度，避免生成难以维护的巨型文件。',
    cover: aiImagePool[4],
    date: '2026-09-12',
    viewCount: 8200,
    likeCount: 260,
    collectCount: 180,
  },
  {
    id: 602,
    title: 'AI 生成组件测试：覆盖率与可维护性',
    content:
      '让模型根据组件行为生成单元测试和边界用例，再用覆盖率与变异测试检查质量。生成测试必须可读、稳定，不能只是堆砌断言。',
    cover: aiImagePool[6],
    date: '2026-09-11',
    viewCount: 6400,
    likeCount: 190,
  },
  {
    id: 603,
    title: '设计稿转代码的准确率如何提升',
    content:
      '统一的 Design Token、清晰的组件命名和结构化标注，是提升生成准确率的关键。本文给出一套从 Figma 到前端代码的协作规范。',
    cover: aiImagePool[13],
    date: '2026-09-10',
    viewCount: 13200,
    likeCount: 420,
    collectCount: 280,
  },
  {
    id: 604,
    title: 'AI 可观测性：让前端错误自动归因',
    content:
      '把错误堆栈、用户操作和接口日志交给模型做初步归因，再交给工程师确认。重点是如何脱敏、如何避免误判，以及如何把结论沉淀成排查规则。',
    cover: aiImagePool[16],
    date: '2026-09-09',
    viewCount: 5800,
  },
];

const backendList: NewsCard[] = [
  {
    id: 701,
    title: 'vLLM 部署实战：吞吐、显存与并发',
    content:
      '从模型加载、PagedAttention 到连续批处理，拆解 vLLM 的关键参数。结合真实压测数据，说明如何平衡并发、首 token 延迟和显存占用。',
    cover: aiImagePool[11],
    date: '2026-09-12',
    viewCount: 7600,
    likeCount: 210,
  },
  {
    id: 702,
    title: '向量数据库选型：pgvector、Milvus 与 Qdrant',
    content:
      '从数据规模、过滤条件、运维成本和一致性要求四个维度对比主流向量库。已有 PostgreSQL 的团队可以先用 pgvector，大规模场景再考虑专用向量数据库。',
    cover: aiImagePool[6],
    date: '2026-09-11',
    viewCount: 6800,
    collectCount: 88,
  },
  {
    id: 703,
    title: 'RAG 服务架构：检索、重排与缓存',
    content:
      '一个可上线的 RAG 服务需要处理文档解析、权限过滤、混合检索、重排、上下文裁剪和引用生成。本文给出一套分层架构和关键监控指标。',
    cover: aiImagePool[1],
    date: '2026-09-10',
    viewCount: 11400,
    likeCount: 340,
    collectCount: 220,
  },
  {
    id: 704,
    title: '大模型网关：多模型路由与限流',
    content:
      '在业务和模型供应商之间加一层网关，统一鉴权、计费、重试、限流和日志。按任务难度动态路由模型，可以在体验和成本之间取得平衡。',
    cover: aiImagePool[12],
    date: '2026-09-09',
    viewCount: 9200,
    likeCount: 280,
  },
  {
    id: 705,
    title: 'Kubernetes GPU 调度与推理服务弹性',
    content:
      'GPU 共享、节点亲和、队列和自动扩缩容，是推理服务上 K8s 的四个关键问题。本文结合真实集群，说明如何避免 GPU 碎片和冷启动抖动。',
    cover: aiImagePool[10],
    date: '2026-09-08',
    viewCount: 6200,
  },
];

const productList: NewsCard[] = [
  {
    id: 801,
    title: 'AI 时代的产品设计：交互范式正在重构',
    content:
      '从点击菜单到自然语言对话，产品经理需要重新设计意图表达、结果确认和错误恢复流程。文章结合 AI 笔记与助手类产品，讨论如何降低学习成本并建立用户信任。',
    cover: aiImagePool[5],
    date: '2026-09-12',
    viewCount: 8800,
    likeCount: 260,
    collectCount: 180,
  },
  {
    id: 802,
    title: '为什么你的 AI 产品用户留存差',
    content:
      'AI 产品的三大留存陷阱：期望落差、能力边界不清、学习成本高，本文结合多个真实案例，给出提升留存的具体产品设计策略。',
    cover: aiImagePool[6],
    date: '2026-09-11',
    viewCount: 7200,
    likeCount: 220,
  },
  {
    id: 803,
    title: '从 0 到 1 设计一款 AI 笔记应用',
    content:
      '先明确目标用户和核心场景，再设计捕捉、整理、回顾的完整闭环。AI 能力应服务于检索、摘要和关联发现，而不是堆砌功能；同时要处理好隐私、同步和离线体验。',
    cover: aiImagePool[7],
    date: '2026-09-10',
    viewCount: 9400,
    collectCount: 140,
  },
];

const careerList: NewsCard[] = [
  {
    id: 901,
    title: 'AI 时代程序员的三大能力升级方向',
    content:
      '技术深度、AI 协作、业务理解，三者缺一不可。文章给出一份可执行的学习路径，帮助你从“会写代码”升级为“能设计 AI 系统并交付结果”。',
    cover: aiImagePool[14],
    date: '2026-09-12',
    viewCount: 14200,
    likeCount: 480,
    collectCount: 320,
  },
  {
    id: 902,
    title: '从初级到高级：AI 工程师的 5 年成长地图',
    content:
      '从 API 调用、提示词和 RAG，到模型微调、Agent 和工程化，每个阶段的核心目标与常见误区都不同。文章给出可验证的项目清单。',
    cover: aiImagePool[9],
    date: '2026-09-11',
    viewCount: 12400,
    likeCount: 420,
    collectCount: 280,
  },
  {
    id: 903,
    title: 'AI 岗位面试到底考什么？',
    content:
      '从机器学习基础、提示词设计、RAG 架构到系统设计，逐环节拆解 AI 应用岗位的考察点。比起背概念，面试官更关注你如何权衡效果、成本和风险。',
    cover: aiImagePool[4],
    date: '2026-09-10',
    viewCount: 18600,
    likeCount: 620,
    collectCount: 380,
  },
  {
    id: 904,
    title: '从传统开发转 AI 应用开发，我踩过的 5 个坑',
    content:
      '一开始只盯着模型效果，忽略了数据质量、评测和成本；后来才发现，AI 应用更像一个持续迭代的产品。本文记录转型过程中的真实教训。',
    cover: aiImagePool[16],
    date: '2026-09-09',
    viewCount: 8200,
    likeCount: 320,
    collectCount: 160,
  },
];

const industryList: NewsCard[] = [
  {
    id: 1001,
    title: '2026 年 AI 行业投融资趋势报告',
    content:
      '哪些赛道最热、资本在关注什么方向？报告从基础设施、模型层和应用层拆解融资数据，分析估值逻辑与退出环境，并给出创业团队在下一轮周期中的融资建议。',
    cover: aiImagePool[7],
    date: '2026-09-12',
    viewCount: 9800,
    likeCount: 260,
    collectCount: 180,
  },
  {
    id: 1002,
    title: '英伟达市值突破 5 万亿美元背后',
    content:
      '从 GPU 到 CUDA 生态，英伟达如何构建起难以撼动的护城河，同时面临 AMD、Intel 以及各大云厂商自研芯片的挑战。',
    cover: aiImagePool[10],
    date: '2026-09-11',
    viewCount: 13400,
    likeCount: 340,
  },
  {
    id: 1003,
    title: '中国 AI 大模型的出海之路',
    content:
      '从多语言能力、合规适配到本地化运营，国产大模型正在寻找新的增长空间。文章梳理了主要厂商的出海策略与面临的现实挑战。',
    cover: aiImagePool[12],
    date: '2026-09-10',
    viewCount: 8200,
  },
];

const opensourceList: NewsCard[] = [
  {
    id: 1101,
    title: '本周 GitHub 最火 AI 开源项目 Top 10',
    content:
      '涵盖推理框架、Agent 工具、向量数据库和 AIGC 应用，附项目地址、Star 数与适用场景，帮你快速找到值得跟进的开源项目。',
    cover: aiImagePool[3],
    date: '2026-09-12',
    viewCount: 12400,
    likeCount: 380,
    collectCount: 260,
  },
  {
    id: 1102,
    title: '如何参与一个开源大模型项目',
    content:
      '从读文档、复现 Issue 到提交第一个 PR，文章给出一条低门槛的参与路径，并说明如何理解模型许可证和社区协作规范。',
    cover: aiImagePool[6],
    date: '2026-09-11',
    viewCount: 7200,
    likeCount: 220,
  },
  {
    id: 1103,
    title: '开源模型如何找到第一批用户',
    content:
      '好的模型卡、可一键运行的 Demo、清晰的评测数据，往往比堆功能更重要。本文总结 AI 开源项目冷启动的常见渠道。',
    cover: aiImagePool[13],
    date: '2026-09-10',
    viewCount: 6400,
    collectCount: 140,
  },
  {
    id: 1104,
    title: '从 0 到 1k Star：一个 AI 开源项目的心路历程',
    content:
      '作者亲述从想法到落地、从无人问津到社区活跃的完整故事，包括中间踩过的坑、关键贡献者以及推广渠道的复盘。',
    cover: aiImagePool[1],
    date: '2026-09-09',
    viewCount: 5400,
    likeCount: 180,
  },
];

const toolsList: NewsCard[] = [
  {
    id: 1201,
    title: '10 款提升开发效率的 AI 编程工具',
    content:
      '涵盖代码补全、代码审查、文档生成、测试编写等不同场景，每款工具都给出了实际使用体验和适用团队规模建议，帮你快速筛选出适合团队的那几款。',
    cover: aiImagePool[9],
    date: '2026-09-12',
    viewCount: 15400,
    likeCount: 480,
    collectCount: 320,
  },
  {
    id: 1202,
    title: 'Raycast AI：把常用 AI 命令放进启动器',
    content:
      '用快捷键唤起对话、总结和翻译，把高频 AI 操作嵌入工作流。本文分享一套面向开发者的 Raycast AI 配置。',
    cover: aiImagePool[15],
    date: '2026-09-11',
    viewCount: 9800,
    likeCount: 320,
  },
  {
    id: 1203,
    title: 'Notion AI vs Obsidian AI：知识管理工具选型',
    content:
      '从数据主权、协作能力、AI 检索和扩展性四个维度对比，结合个人与团队场景给出推荐，帮你选到真正顺手的知识管理工具。',
    cover: aiImagePool[5],
    date: '2026-09-10',
    viewCount: 8400,
    collectCount: 220,
  },
  {
    id: 1204,
    title: 'Arc Max：浏览器里的 AI 助手体验',
    content:
      '自动整理标签页、总结网页和智能搜索，让浏览器从“入口”变成“助手”。本文记录一周深度使用后的真实感受。',
    cover: aiImagePool[0],
    date: '2026-09-09',
    viewCount: 7200,
    likeCount: 240,
  },
  {
    id: 1205,
    title: 'Warp AI：重新定义命令行体验',
    content:
      '块状输出、自然语言转命令和错误解释，让终端对新手更友好。文章也讨论了 AI 执行命令时的安全边界。',
    cover: aiImagePool[11],
    date: '2026-09-08',
    viewCount: 6800,
    likeCount: 260,
  },
];

/* ================= 分类数据映射 ================= */
const tabListMap: Record<string, NewsCard[]> = {
  all: allList,
  ai: aiList,
  llm: llmList,
  aigc: aigcList,
  dev: devList,
  frontend: frontendList,
  backend: backendList,
  product: productList,
  career: careerList,
  industry: industryList,
  opensource: opensourceList,
  tools: toolsList,
};

const currentTabList = computed(() => tabListMap[activeTab.value] || []);

const handleCardClick = (id: string | number) => {
  console.log('点击卡片 ID:', id);
};
</script>

<style scoped lang="scss">
@use './index.scss' as *;
</style>
