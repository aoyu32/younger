import type { TutorialCourse, TutorialGroup } from '@/view/totorial/types';

export const totorialCourseName = '大模型应用开发实战';

export const totorialCourses: TutorialCourse[] = [
  { id: 'llm-app', title: '大模型应用开发实战', learners: 28640 },
  { id: 'prompt-engineering', title: '提示词工程从入门到精通', learners: 19280 },
  { id: 'rag', title: 'RAG 知识库实战', learners: 15760 },
  { id: 'agent', title: 'AI Agent 开发指南', learners: 13420 },
  { id: 'aigc', title: 'AIGC 视觉创作工作流', learners: 21800 },
  { id: 'multimodal', title: '多模态大模型应用', learners: 11650 },
  { id: 'ai-product', title: 'AI 产品经理实战', learners: 9860 },
];

const code = (lang: string, body: string) => '```' + lang + '\n' + body + '\n```';

export const totorialGroups: TutorialGroup[] = [
  {
    id: 'basic',
    title: '入门准备',
    children: [
      {
        id: 'quick-start',
        title: '课程导学与学习路线',
        content: `
欢迎来到 **大模型应用开发实战**。这门课程不讲空泛的概念，而是围绕一个可以真正上线的 AI 应用，把大模型、提示词、RAG、Agent 和工程化串起来。

## 你会完成什么

课程结束时，你将拥有一个具备以下能力的完整项目：

- 能读取企业文档并回答问题的知识库助手
- 支持流式输出、引用来源和多轮对话
- 接入工具调用，能查询数据库和调用外部 API
- 有基础的评测、日志、限流和成本统计

## 学习路线

| 阶段 | 主题 | 产出 |
| --- | --- | --- |
| 1 | 环境与 API | 跑通第一次模型调用 |
| 2 | 提示词工程 | 稳定可复用的提示词模板 |
| 3 | RAG | 可检索、可引用的知识库 |
| 4 | Agent | 能规划并调用工具的智能体 |
| 5 | 多模态 | 图片、视频、语音工作流 |
| 6 | 工程化 | 可部署、可观测、可控制成本 |

## 学习建议

1. **先跑通，再理解**：每节代码都建议亲手运行一次。
2. **保留实验记录**：提示词、模型参数和评测结果都记下来。
3. **不要只追求效果**：延迟、成本、稳定性同样是产品指标。

> 本课程示例默认使用兼容 OpenAI 协议的接口，你可以替换成任意支持该协议的大模型服务。
`,
      },
      {
        id: 'environment',
        title: '开发环境与 API Key',
        content: `
## 环境准备

建议使用 Python 3.11+ 或 Node.js 20+。本课程后端示例以 Python 为主，前端使用 Vue 3。

${code('bash', 'python -m venv .venv\nsource .venv/bin/activate\npip install openai python-dotenv fastapi uvicorn')}

Windows PowerShell 激活虚拟环境：

${code('powershell', '.venv\\Scripts\\Activate.ps1')}

## 配置 API Key

不要把密钥写进代码。创建 \`.env\` 文件：

${code('bash', 'OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxx\nOPENAI_BASE_URL=https://api.openai.com/v1\nMODEL_NAME=gpt-4.1-mini')}

读取配置：

${code('python', 'import os\nfrom dotenv import load_dotenv\n\nload_dotenv()\n\napi_key = os.environ["OPENAI_API_KEY"]\nbase_url = os.environ.get("OPENAI_BASE_URL")\nmodel = os.environ.get("MODEL_NAME", "gpt-4.1-mini")')}

## 选择模型

- **强推理任务**：选择推理能力更强的模型，成本较高
- **日常问答**：选择中小模型，延迟和成本更友好
- **批量处理**：优先考虑离线批处理接口
- **本地隐私场景**：使用 Ollama 等本地推理方案

## 安全提醒

- \`.env\` 必须加入 \`.gitignore\`
- 不要把密钥写进前端代码或提交到仓库
- 生产环境使用服务端代理，不要让浏览器直连模型
`,
      },
      {
        id: 'first-call',
        title: '第一次调用大模型',
        content: `
## 最小可用示例

${code('python', 'from openai import OpenAI\nimport os\n\nclient = OpenAI(\n    api_key=os.environ["OPENAI_API_KEY"],\n    base_url=os.environ.get("OPENAI_BASE_URL"),\n)\n\nresponse = client.chat.completions.create(\n    model=os.environ.get("MODEL_NAME", "gpt-4.1-mini"),\n    messages=[\n        {"role": "system", "content": "你是一名严谨的技术助教。"},\n        {"role": "user", "content": "用三句话解释什么是 RAG。"},\n    ],\n    temperature=0.3,\n)\n\nprint(response.choices[0].message.content)')}

## 消息角色

| 角色 | 作用 | 建议 |
| --- | --- | --- |
| system | 设定身份、边界和输出格式 | 稳定、简洁、可复用 |
| user | 当前任务与输入 | 背景、目标、约束写清楚 |
| assistant | 历史回复 | 多轮对话时保留 |
| tool | 工具调用结果 | 由后端写入，不要伪造 |

## 关键参数

- \`temperature\`：越低越稳定，事实问答建议 0～0.3
- \`max_tokens\`：限制输出长度，控制成本
- \`stream\`：流式输出，改善首字延迟
- \`response_format\`：需要 JSON 时启用结构化输出

## 常见错误

1. **401**：密钥无效或没有正确加载 \`.env\`
2. **404**：模型名或 base_url 不匹配
3. **429**：触发限流，需要退避重试
4. **上下文超限**：先压缩历史消息或做检索裁剪
`,
      },
    ],
  },
  {
    id: 'prompt',
    title: '提示词工程',
    children: [
      {
        id: 'prompt-structure',
        title: '结构化提示词',
        content: `
## 一个稳定的提示词结构

推荐使用「角色 + 任务 + 上下文 + 约束 + 输出格式」五段式：

${code('text', '角色：你是一名资深前端工程师\n任务：审查下面的 Vue 组件代码\n上下文：项目使用 Vue 3 + TypeScript + Pinia\n约束：只指出会导致运行时错误或明显性能问题的地方\n输出格式：按「问题 / 原因 / 修改建议」三列输出 Markdown 表格')}

## 为什么结构化有效

- 模型知道**自己是谁**，减少角色漂移
- 任务边界清晰，避免答非所问
- 约束条件把开放生成变成可控任务
- 输出格式让结果可以被程序继续处理

## 常用约束

- 字数限制：不超过 300 字
- 语言风格：面向非技术读者
- 事实要求：不确定时明确说不知道
- 引用要求：给出原文段落或链接
- 安全要求：不输出个人隐私和密钥

## 反例与改进

**反例**：帮我写一个产品介绍。

**改进**：你是 B2B SaaS 市场文案。为「AI 会议纪要工具」写一段 120 字中文介绍，面向 50 人以下创业团队，突出「自动提取待办」和「支持中文」两个卖点，不要使用夸张形容词。
`,
      },
      {
        id: 'few-shot',
        title: 'Few-shot 与思维链',
        content: `
## Few-shot：用示例定义标准

当任务规则难以用文字说清时，给 2～5 个高质量示例通常比长篇解释更有效。

${code('text', '请把用户反馈分类为：功能建议 / 故障问题 / 付费咨询 / 其他。\n\n示例 1：\n输入：能不能支持导出 PDF？\n输出：功能建议\n\n示例 2：\n输入：今天登录一直提示网络错误\n输出：故障问题\n\n示例 3：\n输入：企业版怎么收费？\n输出：付费咨询\n\n现在分类：生成图片时一直卡在 99%')}

## 思维链提示

对推理任务，可以要求模型先列步骤再给结论：

${code('text', '请先列出已知条件、需要计算的中间量和最终判断依据，\n最后用一句话给出结论。不要在结论前省略推理过程。')}

注意：思维链适合数学、逻辑和复杂决策，不适合简单分类任务，会增加延迟和成本。

## 让示例更可靠

- 示例要覆盖边界情况，而不只是典型情况
- 输入输出格式必须完全一致
- 不要把错误示例混进去
- 示例数量不是越多越好，3～5 个通常足够

## 结构化输出

需要程序解析时，直接要求 JSON，并使用模型提供的结构化输出能力：

${code('json', '{\n  "category": "功能建议",\n  "confidence": 0.92,\n  "reason": "用户希望增加导出能力"\n}')}
`,
      },
      {
        id: 'prompt-eval',
        title: '提示词评测与版本管理',
        content: `
## 提示词也是代码

提示词应该像代码一样被管理：

- 存入版本库
- 有明确的变更记录
- 用固定测试集回归
- 上线前比较效果、延迟和成本

## 建立小型评测集

准备 30～100 条真实输入，覆盖典型和边界场景：

| 字段 | 说明 |
| --- | --- |
| input | 用户原始输入 |
| expected | 期望结果或评分标准 |
| tags | 场景标签 |
| difficulty | 简单 / 中等 / 困难 |

## 自动评分示例

${code('python', 'def exact_match(pred: str, expected: str) -> float:\n    return 1.0 if pred.strip() == expected.strip() else 0.0\n\ndef contains_all(pred: str, keywords: list[str]) -> float:\n    hit = sum(1 for k in keywords if k in pred)\n    return hit / len(keywords)')}

对于开放式回答，可以组合使用：

- 规则匹配：关键词、JSON 字段、长度
- 模型评分：让另一个模型按 rubric 打分
- 人工抽检：每周检查低分和高风险样本

## 版本记录模板

${code('text', 'prompt_id: support-reply\nversion: v3\nchange: 增加退款政策引用要求\nmodel: gpt-4.1-mini\ntemperature: 0.2\neval_score: 0.87\nlatency_p95: 1.8s\nowner: ai-team')}
`,
      },
    ],
  },
  {
    id: 'rag',
    title: 'RAG 知识库',
    children: [
      {
        id: 'rag-pipeline',
        title: 'RAG 全流程',
        content: `
## RAG 解决什么问题

大模型的训练数据有截止时间，也不知道你的企业内部文档。RAG（Retrieval-Augmented Generation）先从知识库检索相关资料，再把资料放进上下文让模型回答。

## 标准流程

1. **文档接入**：PDF、Word、网页、数据库
2. **解析清洗**：去页眉页脚、表格转文本、保留标题层级
3. **切分**：按语义或标题切成合适大小的 chunk
4. **向量化**：用 Embedding 模型把文本转成向量
5. **存储**：写入向量数据库，并保留原文和元数据
6. **检索**：根据问题召回 Top-K 相关内容
7. **重排**：用重排模型提升相关性
8. **生成**：把资料和问题一起交给大模型
9. **引用**：返回答案时标注来源

## 一个常见误区

RAG 的效果瓶颈通常不在模型，而在**文档解析和切分**。如果 chunk 本身语义不完整，再强的模型也答不好。

## 最小项目结构

${code('text', 'rag-demo/\n  data/          原始文档\n  chunks/        切分结果\n  index/         向量索引\n  ingest.py      入库脚本\n  query.py       检索问答\n  eval.py        评测脚本')}
`,
      },
      {
        id: 'embedding',
        title: 'Embedding 与向量库',
        content: `
## Embedding 是什么

Embedding 把文本映射成高维向量，语义相近的文本在向量空间中距离更近。它让「关键词不匹配但意思相近」的内容也能被检索到。

## 切分策略

- 按标题层级优先切分
- 单块 300～800 字，保留 10%～20% 重叠
- 表格和代码块尽量保持完整
- 每个 chunk 保存来源、页码、标题等元数据

${code('python', 'def split_by_heading(text: str, max_len: int = 600):\n    paragraphs = [p.strip() for p in text.split("\\n\\n") if p.strip()]\n    chunks, current = [], ""\n    for p in paragraphs:\n        if len(current) + len(p) > max_len and current:\n            chunks.append(current)\n            current = p\n        else:\n            current = f"{current}\\n\\n{p}".strip()\n    if current:\n        chunks.append(current)\n    return chunks')}

## 向量库选择

| 方案 | 适合场景 |
| --- | --- |
| FAISS | 本地实验、单机小规模 |
| Chroma | 快速原型、开发体验好 |
| pgvector | 已有 PostgreSQL，想统一运维 |
| Milvus | 大规模、生产级向量检索 |
| Qdrant | 过滤条件复杂、需要高性能 |

## 检索参数

- \`top_k\`：先召回 10～30 条，再重排到 3～5 条
- \`score_threshold\`：过滤明显不相关的结果
- 元数据过滤：按部门、文档类型、时间范围缩小范围
`,
      },
      {
        id: 'retrieval',
        title: '检索、重排与引用',
        content: `
## 混合检索

只靠向量检索可能漏掉专有名词和编号，建议结合关键词检索：

- 向量检索：语义相似
- BM25 / 全文检索：精确词命中
- 混合排序：按权重融合两路结果

## 重排

召回阶段追求「不漏」，重排阶段追求「排序准」。常见做法是用 Cross-Encoder 或专用重排模型对候选段落重新打分。

${code('python', 'def build_context(hits, max_chars=4000):\n    parts, total = [], 0\n    for hit in hits:\n        source = hit["source"]\n        page = hit["page"]\n        text = hit["text"]\n        block = f"[{source}#p{page}]\\n{text}"\n        if total + len(block) > max_chars:\n            break\n        parts.append(block)\n        total += len(block)\n    return "\\n\\n".join(parts)')}

## 让模型必须引用

在提示词里明确要求：

${code('text', '只根据提供的资料回答。\n每个结论后面用 [来源#页码] 标注依据。\n如果资料中没有答案，直接回答「资料中未找到」，不要编造。')}

## 评测 RAG

- **召回率**：正确段落是否被召回
- **命中率**：Top-K 中是否包含答案
- **忠实度**：回答是否完全基于资料
- **引用准确率**：引用是否指向真正支持结论的段落

建议先修召回，再调生成。召回不对，提示词再漂亮也没用。
`,
      },
    ],
  },
  {
    id: 'agent',
    title: 'Agent 与工具调用',
    children: [
      {
        id: 'function-calling',
        title: 'Function Calling',
        content: `
## 让模型调用你的代码

Function Calling 让模型输出结构化的工具调用请求，由你的后端真正执行，再把结果返回给模型。

${code('json', '{\n  "name": "query_orders",\n  "description": "按用户 ID 查询最近订单",\n  "parameters": {\n    "type": "object",\n    "properties": {\n      "user_id": { "type": "string" },\n      "limit": { "type": "integer", "default": 5 }\n    },\n    "required": ["user_id"]\n  }\n}')}

## 处理流程

1. 把工具定义和用户问题一起发给模型
2. 模型返回 \`tool_calls\`
3. 后端校验参数并执行真实函数
4. 把结果以 \`tool\` 消息写回
5. 模型生成最终回答

## 安全边界

- **永远不要**让模型直接拼接 SQL 执行
- 参数必须做类型、范围和权限校验
- 写操作需要二次确认或人工审批
- 工具返回值要脱敏，避免泄露隐私
- 为每个工具设置超时和重试上限

## 工具设计原则

- 一个工具只做一件事
- 名称和描述要让模型能判断何时使用
- 返回结构稳定，错误信息可读
- 对高风险操作提供 dry-run 模式
`,
      },
      {
        id: 'agent-loop',
        title: 'Agent 循环与多智能体',
        content: `
## Agent 的基本循环

Agent 不是一次模型调用，而是「观察 → 规划 → 行动 → 再观察」的循环：

${code('python', 'for step in range(max_steps):\n    plan = llm.plan(task, history, tools)\n    if plan.type == "final":\n        return plan.answer\n    result = run_tool(plan.tool, plan.args)\n    history.append({"tool": plan.tool, "result": result})')}

## 必须有的停止条件

- 最大步数，例如 8～12 步
- 最大耗时，例如 60 秒
- 最大工具调用次数
- 连续重复调用同一工具时强制退出
- 预算上限，超过则降级

## 多智能体适合什么

当任务可以明确拆成不同角色时，多智能体才有价值：

- 研究员：收集资料
- 分析师：整理数据和结论
- 审核员：检查事实与合规
- 写作者：生成最终内容

如果只是把一个简单任务拆成多个 Agent，通常只会增加延迟和成本。

## 状态管理

把任务状态显式保存下来，而不是全部塞进对话历史：

${code('json', '{\n  "goal": "生成竞品分析报告",\n  "completed": ["收集资料", "整理功能对比"],\n  "pending": ["补充价格信息", "生成结论"],\n  "artifacts": {"report": "draft.md"}\n}')}
`,
      },
      {
        id: 'mcp',
        title: 'MCP 与工作流编排',
        content: `
## MCP 是什么

MCP（Model Context Protocol）为模型和外部工具、数据源之间提供统一协议。你可以把它理解成「AI 应用的 USB-C 接口」：工具按协议暴露能力，客户端按统一方式发现和调用。

## 一个 MCP Server 通常提供

- Tools：可执行的动作
- Resources：可读取的数据
- Prompts：可复用的提示词模板

## 工作流编排 vs 自由 Agent

| 方式 | 优点 | 缺点 |
| --- | --- | --- |
| 固定工作流 | 稳定、可测试、成本可控 | 灵活性有限 |
| 自由 Agent | 能处理开放任务 | 延迟高、难评测 |
| 混合模式 | 关键步骤固定，局部自主 | 设计复杂度较高 |

生产环境推荐「混合模式」：把确定性强的步骤写成工作流，只在需要判断和探索的节点交给 Agent。

## 编排建议

1. 每个节点输入输出结构化
2. 节点失败可重试，幂等操作优先
3. 全链路记录 trace_id
4. 对外部副作用操作保留人工确认
5. 把提示词、模型和工具版本一起记录
`,
      },
    ],
  },
  {
    id: 'multimodal',
    title: '多模态与 AIGC',
    children: [
      {
        id: 'image',
        title: '图像生成',
        content: `
## 提示词的基本结构

图像提示词建议按「主体 + 环境 + 光线 + 镜头 + 风格 + 质量」组织：

${code('text', '主体：一台半透明的 AI 芯片悬浮在实验台上\n环境：深色未来实验室，蓝色氛围光\n光线：侧逆光，轮廓清晰\n镜头：85mm 微距，浅景深\n风格：科技感、干净、电影级质感\n质量：高细节、真实材质、8K')}

## 常用控制手段

- **参考图**：锁定构图、角色或风格
- **负向提示词**：排除不需要的元素
- **局部重绘**：只修改画面中的某个区域
- **扩图**：扩展画布，补齐场景
- **种子**：复现同一组结果

## 商用注意

- 确认模型和素材的商用许可
- 不要生成与真实品牌高度相似的标识
- 人物肖像需要明确授权
- 保留生成记录，便于版权追溯

## 批量生产工作流

1. 先做 5～10 张风格测试
2. 固定提示词模板和参数
3. 批量生成并人工筛选
4. 统一尺寸、色彩和文件命名
5. 进入设计或剪辑流程
`,
      },
      {
        id: 'video',
        title: 'AI 视频',
        content: `
## 当前视频生成的能力边界

AI 视频擅长短镜头、氛围镜头和风格化画面，但在长时间一致性、复杂动作和精确口型上仍有明显限制。

## 提示词要素

${code('text', '主体：一台白色服务机器人在雨夜街道上缓缓前行\n动作：机器人的头部轻微转动，扫描周围环境\n镜头：低角度跟拍，缓慢向前推进\n光线：霓虹灯反射在湿润地面上\n风格：赛博朋克、电影感、真实材质\n时长：5 秒')}

## 提高成功率

- 一个镜头只描述一个主要动作
- 复杂动作拆成多个短镜头
- 用首尾帧控制过渡
- 用参考图固定角色和场景
- 先用低分辨率测试运动和构图

## 工作流示例

1. 用图像模型生成关键帧
2. 用图生视频生成 5 秒镜头
3. 挑出可用片段，统一调色
4. 在剪辑软件中拼接和配乐
5. 人工检查闪烁、变形和逻辑错误
`,
      },
      {
        id: 'audio',
        title: '语音与数字人',
        content: `
## 语音合成

TTS 已能生成非常自然的中文配音。生产环境重点关注：

- 多音字和专有名词发音
- 长文本的段落停顿
- 情绪和语速控制
- 多语言一致性
- 生成时长与成本

## 声音克隆的边界

声音克隆必须取得本人明确授权。不要克隆公众人物、客户或同事的声音用于未授权内容。

## 数字人视频

典型流程：

1. 准备正脸、光线均匀的素材
2. 生成或录制配音
3. 驱动口型和表情
4. 合成背景与字幕
5. 人工检查口型、手部和边缘瑕疵

## 质量检查清单

- 口型是否与音频同步
- 眨眼和头部运动是否自然
- 牙齿、耳朵、手指是否变形
- 字幕是否遮挡人脸
- 背景是否出现闪烁或漂移
`,
      },
    ],
  },
  {
    id: 'engineering',
    title: '工程化落地',
    children: [
      {
        id: 'streaming',
        title: '流式输出与前端交互',
        content: `
## 为什么需要流式

大模型生成完整回答可能需要数秒到数十秒。流式输出能显著降低首字等待时间，让用户更早看到反馈。

## 后端转发 SSE

${code('python', 'from fastapi import FastAPI\nfrom fastapi.responses import StreamingResponse\n\napp = FastAPI()\n\n@app.post("/chat")\nasync def chat(payload: dict):\n    async def event_stream():\n        stream = await client.chat.completions.create(\n            model=model,\n            messages=payload["messages"],\n            stream=True,\n        )\n        async for chunk in stream:\n            delta = chunk.choices[0].delta.content or ""\n            if delta:\n                yield f"data: {delta}\\n\\n"\n        yield "data: [DONE]\\n\\n"\n    return StreamingResponse(event_stream(), media_type="text/event-stream")')}

## 前端处理

- 使用 \`fetch\` + \`ReadableStream\` 或 EventSource
- 逐段追加到消息内容
- 处理中断、重试和错误提示
- 滚动到底部时尊重用户手动上滑
- 渲染 Markdown 时注意 XSS

## 常见问题

1. 代理服务器缓冲导致「假流式」
2. 没有发送 \`X-Accel-Buffering: no\`
3. 前端一次性 \`await response.text()\`
4. 错误发生在流开始后，无法再改 HTTP 状态码
`,
      },
      {
        id: 'cost',
        title: '缓存、限流与成本',
        content: `
## 成本从哪里来

成本主要由输入 token、输出 token 和调用次数决定。长上下文和 Agent 多轮循环会快速放大成本。

## 降低成本的手段

- **提示词缓存**：复用稳定的 system prompt 和知识前缀
- **结果缓存**：相同问题在短时间内直接命中缓存
- **模型分级**：简单任务用小模型，复杂任务再升级
- **上下文裁剪**：只保留相关历史和检索片段
- **批量处理**：离线任务使用批处理接口
- **输出限制**：设置合理的 max_tokens

## 限流策略

${code('text', '用户级：每分钟 20 次\n租户级：每分钟 300 次\n全局：根据供应商配额设置并发上限\n超限处理：排队 + 退避 + 友好提示')}

## 成本监控指标

| 指标 | 用途 |
| --- | --- |
| 每请求 token | 发现异常长上下文 |
| 每用户日成本 | 识别高消耗用户 |
| 缓存命中率 | 评估缓存收益 |
| 模型分布 | 检查是否过度使用高价模型 |
| P95 延迟 | 平衡体验与成本 |

## 降级方案

当预算或配额接近上限时，可以：

1. 切换到更小的模型
2. 关闭非必要工具调用
3. 缩短检索上下文
4. 返回缓存答案
5. 提示用户稍后重试
`,
      },
      {
        id: 'eval',
        title: '评测、监控与安全',
        content: `
## 上线前必须回答的问题

- 回答准确率是否达到业务要求？
- 哪些问题最容易出错？
- 最坏情况下会发生什么？
- 出问题时能否快速定位？
- 是否存在提示词注入和数据泄露风险？

## 评测分层

1. **单元评测**：固定输入输出，检查格式和关键字段
2. **场景评测**：覆盖真实业务流程
3. **对抗评测**：提示词注入、越权、诱导泄露
4. **线上评测**：用户反馈、采纳率、投诉率

## 监控指标

- 请求量、成功率、错误码
- 首 token 延迟、总延迟
- 输入输出 token 与成本
- 检索命中率、引用覆盖率
- 工具调用成功率
- 用户点赞、点踩和转人工率

## 安全清单

- 系统提示词与用户输入隔离
- 检索内容视为不可信数据
- 工具参数白名单校验
- 敏感信息脱敏后再发给模型
- 输出经过内容安全审核
- 保留审计日志，但遵守最小必要原则

## 事故处理

出现严重错误时，优先降级而不是继续重试：关闭工具调用、切换保守提示词、返回兜底话术，并保留现场日志。
`,
      },
    ],
  },
  {
    id: 'project',
    title: '项目实战',
    children: [
      {
        id: 'knowledge-bot',
        title: '企业知识库助手',
        content: `
## 需求拆解

目标：让员工用自然语言查询内部制度、产品文档和历史项目资料，并给出可追溯的引用。

## 功能清单

- 文档上传与解析
- 自动切分和向量化
- 权限过滤：只能检索有权限的文档
- 多轮对话与追问
- 流式回答与来源引用
- 反馈收集与低分样本回流

## 数据模型

${code('sql', 'create table documents (\n  id uuid primary key,\n  title text not null,\n  department text not null,\n  owner_id uuid not null,\n  created_at timestamptz default now()\n);\n\ncreate table chunks (\n  id uuid primary key,\n  document_id uuid references documents(id),\n  content text not null,\n  page int,\n  embedding vector(1536)\n);')}

## 关键设计

1. 检索前先做权限过滤，不能先检索再隐藏
2. 引用必须精确到文档和页码
3. 没有命中时明确说「未找到」，不要自由发挥
4. 对高频问题做缓存，但权限变化时立即失效
5. 低分回答进入人工复核队列

## 验收标准

- 典型问题命中率 ≥ 85%
- 引用准确率 ≥ 90%
- 首 token 延迟 < 2 秒
- 越权检索为 0
`,
      },
      {
        id: 'video-workflow',
        title: 'AI 视频工作流',
        content: `
## 目标

用 AI 完成一支 30 秒产品概念短片，包含脚本、分镜、画面、配音和字幕。

## 流程

1. **脚本**：用大模型生成 6～8 个镜头的工作人员脚本
2. **分镜图**：用图像模型生成统一风格的关键帧
3. **视频片段**：用图生视频生成每个 5 秒镜头
4. **配音**：用 TTS 生成旁白
5. **音乐**：用音乐生成工具制作背景音乐
6. **剪辑**：统一调色、节奏和字幕
7. **检查**：人工复核品牌、版权和画面瑕疵

## 分镜表模板

| 镜头 | 画面 | 动作 | 时长 | 旁白 |
| --- | --- | --- | --- | --- |
| 1 | 实验室全景 | 镜头缓慢推进 | 5s | 每一次突破，都始于好奇 |
| 2 | AI 芯片特写 | 光线扫过芯片 | 4s | 我们把算力装进更小的空间 |
| 3 | 机器人协作 | 机械臂精准操作 | 5s | 让智能真正走进生产 |

## 一致性技巧

- 固定角色参考图和风格参考图
- 统一色彩关键词和镜头语言
- 每个镜头只描述一个动作
- 失败镜头单独重生成，不要整段重做

## 交付检查

- 画面无闪烁、无肢体变形
- 品牌 Logo 和产品细节正确
- 音乐和旁白版权清晰
- 字幕无错别字
- 导出尺寸和码率符合平台要求
`,
      },
      {
        id: 'launch',
        title: '上线与复盘',
        content: `
## 上线前检查

- 环境变量和密钥已配置到生产环境
- 模型、提示词和工具版本已锁定
- 有超时、重试、限流和降级
- 日志不包含敏感信息
- 监控和告警已接入
- 回滚方案经过演练

## 灰度发布

1. 内部用户试用一周
2. 5% 真实流量灰度
3. 观察错误率、延迟、成本和反馈
4. 逐步扩大到 25%、50%、100%
5. 每个阶段设置明确的放量门槛

## 复盘模板

${code('text', '目标：知识库助手首月上线\n结果：周活 320，回答采纳率 68%\n问题：长文档检索命中率偏低\n原因：PDF 表格解析丢失结构\n改进：接入表格识别，按行切分并保留表头\n下一步：补充 100 条表格问答评测集')}

## 持续迭代

- 每周查看低分样本
- 每月更新评测集
- 跟踪模型版本和价格变化
- 定期审查权限与安全策略
- 把稳定下来的流程固化为工作流

> 上线不是终点，而是评测和迭代的开始。
`,
      },
    ],
  },
];
