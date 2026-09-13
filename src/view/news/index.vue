<template>
  <div class="news">
    <div class="slogan">
      <PageSlogan
        content="查看最新AI资讯，跟随AI时代的发展脚本来发展自己。"
        sub-content="AI资讯"
      />
      <div class="section-wrapper flex">
        <div class="wrapper-left">
          <div class="topic">
            <TodayTopic
              :content="topicContent"
              :date="topicDate"
              :people-count="peopleCount"
              :comments="commentList"
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
import PageSlogan from '@/components/page-slogan/index.vue';
import TodayTopic from './components/TodayTopic.vue';
import NewsListCard from './components/NewsListCard.vue';
import HotCourseList from './components/HotCourseList.vue';
import NewsTabs from './components/NewsTabs.vue';

const topicContent = ref(
  '今天我们来聊一聊 AI 生成内容（AIGC）对内容创作领域的影响。你是否感受到了 AI 带来的效率提升？或者担心它取代创意工作？欢迎分享你的观点！',
);

const topicDate = ref('2026-09-09');
const peopleCount = ref('1.2k');

const commentList = ref([]);

const newNewsList = ref([
  {
    id: 1,
    title: 'OpenAI 发布 GPT-5 预览版，多模态能力大幅提升',
    summary: '新模型支持图像、音频和文本的联合推理，预计年底正式上线。',
    cover: 'https://picsum.photos/seed/ai1/80/60',
    views: 15800,
  },
  {
    id: 2,
    title: 'Google DeepMind 推出 AlphaFold 3，加速药物研发',
    summary: '蛋白质结构预测精度再创新高，有望大幅缩短新药研发周期。',
    cover: 'https://picsum.photos/seed/ai2/80/60',
    views: 9200,
  },
  {
    id: 3,
    title: '国内首个 AI 大模型合规备案名单公布，百度、阿里、腾讯在列',
    summary: '首批通过备案的大模型将率先面向公众提供服务。',
    cover: 'https://picsum.photos/seed/ai3/80/60',
    views: 6700,
  },
  {
    id: 5,
    title: '微软 Copilot 全面集成 Office 全家桶，提升办公效率',
    summary: '用户可通过自然语言指令完成文档、表格、幻灯片创作。',
    cover: 'https://picsum.photos/seed/ai5/80/60',
    views: 24500,
  },
  {
    id: 6,
    title: 'AI 芯片大战：NVIDIA H200 发布，AMD 紧随其后',
    summary: '算力军备竞赛加速，AI 基础设施投资持续升温。',
    cover: 'https://picsum.photos/seed/ai6/80/60',
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
    image: 'https://picsum.photos/seed/c1/80/80',
    studingCount: 12800,
  },
  {
    id: 2,
    name: 'Prompt 工程入门',
    desc: '掌握与 AI 高效对话的技巧',
    image: 'https://picsum.photos/seed/c2/80/80',
    studingCount: 8600,
  },
  {
    id: 3,
    name: 'AI 绘画从零开始',
    desc: 'Midjourney + SD 全流程',
    image: 'https://picsum.photos/seed/c3/80/80',
    studingCount: 5300,
  },
  {
    id: 4,
    name: 'Python 数据分析',
    desc: 'Pandas + NumPy 实战',
    image: 'https://picsum.photos/seed/c4/80/80',
    studingCount: 15200,
  },
  {
    id: 5,
    name: 'Vue 3 全家桶精讲',
    desc: 'Composition API 深度实践',
    image: 'https://picsum.photos/seed/c5/80/80',
    studingCount: 21500,
  },
  {
    id: 6,
    name: 'TypeScript 从入门到进阶',
    desc: '类型体操 + 工程化实战',
    image: 'https://picsum.photos/seed/c6/80/80',
    studingCount: 9800,
  },
  {
    id: 7,
    name: 'RAG 检索增强生成实战',
    desc: 'LangChain + 向量数据库',
    image: 'https://picsum.photos/seed/c7/80/80',
    studingCount: 7200,
  },
  {
    id: 8,
    name: 'AI Agent 开发指南',
    desc: '多智能体协作与工具调用',
    image: 'https://picsum.photos/seed/c8/80/80',
    studingCount: 6400,
  },
  {
    id: 9,
    name: '深度学习基础',
    desc: 'PyTorch 从理论到实践',
    image: 'https://picsum.photos/seed/c9/80/80',
    studingCount: 18700,
  },
  {
    id: 10,
    name: '数据可视化之美',
    desc: 'ECharts + D3 进阶技巧',
    image: 'https://picsum.photos/seed/c10/80/80',
    studingCount: 4300,
  },
]);

const handleCourseClick = (id: string | number) => {
  console.log('点击课程 ID:', id);
};

/* ================= 分类 Tab 列表 ================= */
const newsTabs = ref([
  { id: 'all', label: '全部' },
  { id: 'ai', label: 'AI 资讯' },
  { id: 'llm', label: '大模型' },
  { id: 'aigc', label: 'AIGC' },
  { id: 'dev', label: '编程开发' },
  { id: 'frontend', label: '前端' },
  { id: 'backend', label: '后端' },
  { id: 'product', label: '产品设计' },
  { id: 'career', label: '职场成长' },
  { id: 'industry', label: '行业观察' },
  { id: 'opensource', label: '开源项目' },
  { id: 'tools', label: '效率工具' },
  { id: '1', label: '后端' },
  { id: '2', label: '产品设计' },
  { id: '3', label: '职场成长' },
  { id: '4', label: '行业观察' },
  { id: '5', label: '开源项目' },
  { id: '6', label: '效率工具' },
]);

const activeTab = ref('all');

type NewsCard = {
  id: string | number;
  title?: string;
  content?: string;
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
    cover: 'https://picsum.photos/seed/n101/600/340',
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
    cover: 'https://picsum.photos/seed/n102/600/340',
    date: '2026-09-11',
    viewCount: 9200,
    likeCount: 210,
  },
  {
    id: 103,
    title: '国内首个 AI 大模型合规备案名单公布',
    content: '百度、阿里、腾讯等企业首批通过备案。',
    cover: 'https://picsum.photos/seed/n103/600/340',
    date: '2026-09-10',
    viewCount: 6700,
    collectCount: 42,
  },
  {
    id: 104,
    title: '微软 Copilot 全面集成 Office 全家桶',
    content:
      '用户可通过自然语言指令完成文档撰写、表格分析、幻灯片创作等任务，Word、Excel、PPT 均获得 AI 能力加持，工作效率提升显著，但企业版订阅费用也成为关注焦点，分析师认为这将重塑办公软件市场格局。',
    cover: 'https://picsum.photos/seed/n104/600/340',
    date: '2026-09-09',
    viewCount: 24500,
    likeCount: 580,
    collectCount: 152,
  },
  // 无 content 示例
  {
    id: 105,
    title: 'AI 芯片大战：NVIDIA H200 发布，AMD 紧随其后',
    cover: 'https://picsum.photos/seed/n105/600/340',
    date: '2026-09-08',
    viewCount: 19800,
    likeCount: 340,
    collectCount: 96,
  },
  {
    id: 106,
    title: '如何用 Cursor 提升前端开发效率',
    content: '从项目初始化到代码重构的全流程实践。',
    cover: 'https://picsum.photos/seed/n106/600/340',
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
    cover: 'https://picsum.photos/seed/n107/600/340',
    date: '2026-09-06',
    viewCount: 31200,
    likeCount: 780,
    collectCount: 320,
  },
  // 无 content 示例
  {
    id: 108,
    title: '从 0 到 1 搭建 RAG 知识库系统',
    cover: 'https://picsum.photos/seed/n108/600/340',
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
    cover: 'https://picsum.photos/seed/n109/600/340',
    date: '2026-09-04',
    viewCount: 18200,
    likeCount: 520,
    collectCount: 280,
  },
  {
    id: 110,
    title: 'AI 编程助手横向评测：Copilot vs Cursor vs Claude Code',
    content: '四个维度详细对比，给出场景推荐。',
    cover: 'https://picsum.photos/seed/n110/600/340',
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
    date: '2026-09-02',
    viewCount: 5400,
    likeCount: 180,
    collectCount: 92,
  },
  {
    id: 112,
    title: '2026 年 AI 行业投融资趋势报告',
    cover: 'https://picsum.photos/seed/n112/600/340',
    date: '2026-09-01',
    viewCount: 3200,
  },
  {
    id: 113,
    cover: 'https://picsum.photos/seed/n113/600/340',
    date: '2026-08-30',
    viewCount: 1200,
  },
];

const aiList: NewsCard[] = [
  {
    id: 201,
    title: 'OpenAI 发布 GPT-5 预览版',
    content: '多模态能力大幅提升。',
    cover: 'https://picsum.photos/seed/ai201/600/340',
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
    cover: 'https://picsum.photos/seed/ai202/600/340',
    date: '2026-09-11',
    viewCount: 12400,
    likeCount: 280,
  },
  // 无 content
  {
    id: 203,
    title: 'DeepMind 推出新一代通用智能体',
    cover: 'https://picsum.photos/seed/ai203/600/340',
    date: '2026-09-10',
    viewCount: 9800,
  },
  {
    id: 204,
    title: '欧盟 AI 法案正式生效，全球监管趋严',
    content:
      '对高风险 AI 应用提出严格的透明度和审计要求，违规最高可处全球营收 7% 的罚款，所有在欧盟市场运营的 AI 厂商都需要重新评估合规策略，中小企业面临更大压力。',
    cover: 'https://picsum.photos/seed/ai204/600/340',
    date: '2026-09-09',
    viewCount: 7600,
    likeCount: 190,
    collectCount: 72,
  },
  {
    id: 205,
    title: '多模态大模型的下一步：从理解到生成',
    content: '梳理技术演进路径，展望未来 3 年。',
    cover: 'https://picsum.photos/seed/ai205/600/340',
    date: '2026-09-08',
    viewCount: 6300,
  },
  {
    id: 206,
    title: 'AI 生成内容的法律边界在哪里',
    content:
      '从著作权归属、训练数据合规、生成内容责任三个维度讨论 AIGC 的法律风险，结合近期国内外典型案例，给出企业合规建议。',
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
    cover: 'https://picsum.photos/seed/llm301/600/340',
    date: '2026-09-12',
    viewCount: 9400,
    likeCount: 260,
    collectCount: 180,
  },
  {
    id: 302,
    title: '从零训练一个 7B 大模型需要多少钱',
    content: '全流程成本估算。',
    cover: 'https://picsum.photos/seed/llm302/600/340',
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
    cover: 'https://picsum.photos/seed/llm303/600/340',
    date: '2026-09-10',
    viewCount: 8700,
  },
  // 无 content
  {
    id: 304,
    title: 'MoE 架构详解：如何用更少的算力训练更大的模型',
    cover: 'https://picsum.photos/seed/llm304/600/340',
    date: '2026-09-09',
    viewCount: 7100,
    likeCount: 210,
  },
];

const aigcList: NewsCard[] = [
  {
    id: 401,
    title: 'Midjourney v7 发布，真实感再升级',
    content: '光影、材质、细节大幅提升。',
    cover: 'https://picsum.photos/seed/aigc401/600/340',
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
    cover: 'https://picsum.photos/seed/aigc402/600/340',
    date: '2026-09-11',
    viewCount: 14200,
    likeCount: 420,
    collectCount: 240,
  },
  {
    id: 403,
    title: 'AI 视频生成三巨头横评：Sora vs Runway vs Pika',
    content: '四个维度详细对比。',
    cover: 'https://picsum.photos/seed/aigc403/600/340',
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
    cover: 'https://picsum.photos/seed/aigc404/600/340',
    date: '2026-09-09',
    viewCount: 9800,
  },
  // 无 content
  {
    id: 405,
    title: '如何用 AI 工具做出一个完整的短剧',
    cover: 'https://picsum.photos/seed/aigc405/600/340',
    date: '2026-09-08',
    viewCount: 11300,
    likeCount: 340,
  },
];

const devList: NewsCard[] = [
  {
    id: 501,
    title: 'Vue 3.5 正式发布，性能提升 30%',
    content:
      '响应式系统重构、内存占用降低、模板编译优化，本文详解新特性与升级注意事项，同时对比了与 Vue 3.4 在大型项目中的实际性能差异，给出平滑升级的迁移指南。',
    cover: 'https://picsum.photos/seed/dev501/600/340',
    date: '2026-09-12',
    viewCount: 12400,
    likeCount: 320,
    collectCount: 180,
  },
  {
    id: 502,
    title: 'React 19 新特性全解析',
    content: 'Server Components、Actions 等新特性详解。',
    cover: 'https://picsum.photos/seed/dev502/600/340',
    date: '2026-09-11',
    viewCount: 10800,
    likeCount: 280,
    collectCount: 140,
  },
  {
    id: 503,
    title: 'TypeScript 5.6 发布，类型系统再升级',
    content: '新增满足性检查。',
    cover: 'https://picsum.photos/seed/dev503/600/340',
    date: '2026-09-10',
    viewCount: 8600,
  },
  {
    id: 504,
    title: 'Node.js 22 长期支持版本发布',
    content:
      '内置 WebSocket 客户端、支持 require ESM、V8 引擎升级等，让 Node.js 与现代前端工具链的整合更加顺畅，同时官方也公布了未来两年的 LTS 支持计划。',
    cover: 'https://picsum.photos/seed/dev504/600/340',
    date: '2026-09-09',
    viewCount: 7200,
    likeCount: 180,
  },
  // 无 content
  {
    id: 505,
    title: 'Vite 6 发布：构建速度提升 2 倍',
    cover: 'https://picsum.photos/seed/dev505/600/340',
    date: '2026-09-08',
    viewCount: 9400,
    collectCount: 96,
  },
  {
    id: 506,
    title: 'Rust 1.80 稳定版发布',
    content: '新增 LazyCell / LazyLock 等特性。',
    cover: 'https://picsum.photos/seed/dev506/600/340',
    date: '2026-09-07',
    viewCount: 6800,
    likeCount: 220,
  },
];

const frontendList: NewsCard[] = [
  {
    id: 601,
    title: '从 0 实现一个 Mini Vue：响应式系统',
    content:
      '手写 reactive、effect、computed，深入理解 Vue 3 响应式的核心原理，代码量控制在 200 行以内，非常适合作为进阶学习的第一站。',
    cover: 'https://picsum.photos/seed/fe601/600/340',
    date: '2026-09-12',
    viewCount: 8200,
    likeCount: 260,
    collectCount: 180,
  },
  {
    id: 602,
    title: 'CSS 容器查询实战：真正组件级的响应式',
    content: '用 @container 替代媒体查询。',
    cover: 'https://picsum.photos/seed/fe602/600/340',
    date: '2026-09-11',
    viewCount: 6400,
    likeCount: 190,
  },
  // 无 content
  {
    id: 603,
    title: '前端性能优化清单 2026 版',
    cover: 'https://picsum.photos/seed/fe603/600/340',
    date: '2026-09-10',
    viewCount: 13200,
    likeCount: 420,
    collectCount: 280,
  },
  {
    id: 604,
    title: 'State of CSS 2026 调研结果解读',
    content:
      '最受欢迎的 CSS 新特性、最想学的工具、最大的痛点都在这里，超过 1 万名开发者参与了本次调研，样本量创下历史新高。',
    cover: 'https://picsum.photos/seed/fe604/600/340',
    date: '2026-09-09',
    viewCount: 5800,
  },
];

const backendList: NewsCard[] = [
  {
    id: 701,
    title: 'Go 1.24 发布：泛型性能优化',
    content: '编译速度与运行时性能双提升。',
    cover: 'https://picsum.photos/seed/be701/600/340',
    date: '2026-09-12',
    viewCount: 7600,
    likeCount: 210,
  },
  {
    id: 702,
    title: 'PostgreSQL 17 发布，逻辑复制大升级',
    content:
      '新增增量备份、逻辑复制支持 DDL、JSON 性能提升，让 PostgreSQL 在 OLTP 和 OLAP 场景下的边界进一步模糊，更多企业开始将其作为一站式数据平台。',
    cover: 'https://picsum.photos/seed/be702/600/340',
    date: '2026-09-11',
    viewCount: 6800,
    collectCount: 88,
  },
  // 无 content
  {
    id: 703,
    title: '从单机到分布式：一个电商系统的架构演进',
    cover: 'https://picsum.photos/seed/be703/600/340',
    date: '2026-09-10',
    viewCount: 11400,
    likeCount: 340,
    collectCount: 220,
  },
  {
    id: 704,
    title: 'Redis 8 发布，支持多线程读写',
    content: 'IO 多线程、内存优化。',
    cover: 'https://picsum.photos/seed/be704/600/340',
    date: '2026-09-09',
    viewCount: 9200,
    likeCount: 280,
  },
  {
    id: 705,
    title: 'Kubernetes 1.32 新特性解读',
    content:
      '动态资源分配、Job 管理升级、调度器优化等核心变更，社区也在推进多个长期悬而未决的 KEP，让 K8s 在大规模集群场景下更可靠。',
    cover: 'https://picsum.photos/seed/be705/600/340',
    date: '2026-09-08',
    viewCount: 6200,
  },
];

const productList: NewsCard[] = [
  {
    id: 801,
    title: 'AI 时代的产品设计：交互范式正在重构',
    content: '从"点击"到"对话"，产品经理需要重新思考。',
    cover: 'https://picsum.photos/seed/pd801/600/340',
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
    cover: 'https://picsum.photos/seed/pd802/600/340',
    date: '2026-09-11',
    viewCount: 7200,
    likeCount: 220,
  },
  // 无 content
  {
    id: 803,
    title: '从 0 到 1 设计一款 AI 笔记应用',
    cover: 'https://picsum.photos/seed/pd803/600/340',
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
      '技术深度、AI 协作、业务理解，三者缺一不可，附具体学习路径，帮助你在未来 3 年内保持竞争力，避免被 AI 工具替代的风险。',
    cover: 'https://picsum.photos/seed/car901/600/340',
    date: '2026-09-12',
    viewCount: 14200,
    likeCount: 480,
    collectCount: 320,
  },
  {
    id: 902,
    title: '从初级到高级：程序员的 5 年成长地图',
    content: '每个阶段的核心目标与常见误区。',
    cover: 'https://picsum.photos/seed/car902/600/340',
    date: '2026-09-11',
    viewCount: 12400,
    likeCount: 420,
    collectCount: 280,
  },
  {
    id: 903,
    title: '大厂面试到底考什么？',
    content:
      '从简历筛选、笔试、技术面到 HR 面，逐环节拆解考察点与准备策略，同时给出常见面试题的解题思路与高频考点清单。',
    cover: 'https://picsum.photos/seed/car903/600/340',
    date: '2026-09-10',
    viewCount: 18600,
    likeCount: 620,
    collectCount: 380,
  },
  // 无 content
  {
    id: 904,
    title: '裸辞 3 个月，我学到的最重要一件事',
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
    content: '哪些赛道最热？资本在关注什么方向？',
    cover: 'https://picsum.photos/seed/ind1001/600/340',
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
    cover: 'https://picsum.photos/seed/ind1002/600/340',
    date: '2026-09-11',
    viewCount: 13400,
    likeCount: 340,
  },
  // 无 content
  {
    id: 1003,
    title: '中国 AI 大模型的出海之路',
    cover: 'https://picsum.photos/seed/ind1003/600/340',
    date: '2026-09-10',
    viewCount: 8200,
  },
];

const opensourceList: NewsCard[] = [
  {
    id: 1101,
    title: '本周 GitHub 最火开源项目 Top 10',
    content:
      '涵盖 AI 工具、开发框架、效率软件，附项目地址与简要介绍，每个项目都标注了 Star 数、活跃度和适合的使用场景。',
    cover: 'https://picsum.photos/seed/os1101/600/340',
    date: '2026-09-12',
    viewCount: 12400,
    likeCount: 380,
    collectCount: 260,
  },
  {
    id: 1102,
    title: '如何优雅地维护一个开源项目',
    content: 'Issue 管理与社区运营的实战经验。',
    cover: 'https://picsum.photos/seed/os1102/600/340',
    date: '2026-09-11',
    viewCount: 7200,
    likeCount: 220,
  },
  // 无 content
  {
    id: 1103,
    title: '开源项目如何找到第一批用户',
    cover: 'https://picsum.photos/seed/os1103/600/340',
    date: '2026-09-10',
    viewCount: 6400,
    collectCount: 140,
  },
  {
    id: 1104,
    title: '从 0 到 1k Star：一个小项目的心路历程',
    content:
      '作者亲述从想法到落地、从无人问津到社区活跃的完整故事，包括中间踩过的坑、遇到的关键贡献者以及推广渠道的复盘。',
    cover: 'https://picsum.photos/seed/os1104/600/340',
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
    cover: 'https://picsum.photos/seed/tool1201/600/340',
    date: '2026-09-12',
    viewCount: 15400,
    likeCount: 480,
    collectCount: 320,
  },
  {
    id: 1202,
    title: 'Raycast：Mac 上最强效率启动器',
    content: '从基础用法到自定义脚本。',
    cover: 'https://picsum.photos/seed/tool1202/600/340',
    date: '2026-09-11',
    viewCount: 9800,
    likeCount: 320,
  },
  {
    id: 1203,
    title: 'Notion 还是 Obsidian？知识管理工具选型指南',
    content:
      '从数据主权、协作能力、扩展性、学习曲线四个维度对比，结合不同职业和工作场景给出推荐，帮你选到真正顺手的工具。',
    cover: 'https://picsum.photos/seed/tool1203/600/340',
    date: '2026-09-10',
    viewCount: 8400,
    collectCount: 220,
  },
  // 无 content
  {
    id: 1204,
    title: 'Arc 浏览器深度体验报告',
    cover: 'https://picsum.photos/seed/tool1204/600/340',
    date: '2026-09-09',
    viewCount: 7200,
    likeCount: 240,
  },
  {
    id: 1205,
    title: 'Warp 终端：重新定义命令行体验',
    content: '块状输出与 AI 命令补全。',
    cover: 'https://picsum.photos/seed/tool1205/600/340',
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
