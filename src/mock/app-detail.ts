import { aiAppCatalog, aiAppIcons, type AiAppCatalogItem } from './aiCatalog';
import { aiImagePool } from './aiImages';

const animations = ['fadeUp', 'fadeLeft', 'zoomIn', 'fadeRight'] as const;

/**
 * 应用详情页正文由目录数据统一生成。
 * 这样新增 AI 应用时只需要维护 aiCatalog，不会出现卡片与详情页内容不一致。
 */
const buildContent = (app: AiAppCatalogItem) => {
  const featureBlocks = app.features
    .map(
      (feature, index) => `### ${index + 1}. ${feature.title}
${feature.desc}`,
    )
    .join('\n\n');

  return `## 📌 简介

**${app.name}** 是一款面向 ${app.category} 场景的 AI 应用。${app.description}。

> 官方地址：${app.website}

## ✨ 核心能力

${featureBlocks}

## 🎯 适用场景

${app.useCases.map((item) => `- ${item}`).join('\n')}

## 💡 使用建议

${app.tips.map((item) => `- ${item}`).join('\n')}

## 🧭 快速上手

1. 打开官网并完成账号登录
2. 从一个小任务开始，例如总结一段文字或生成一张配图
3. 观察输出结果，补充背景、目标和格式要求后再次生成
4. 把稳定的提示词保存为模板，形成自己的工作流

## ❓ 常见问题

**Q：需要付费吗？**

A：${app.name} 通常提供免费额度或试用方案，高频使用可以选择订阅或 API 按量计费，具体以官网为准。

**Q：可以直接商用生成内容吗？**

A：请先阅读官方的服务条款和版权说明。涉及品牌、肖像或第三方素材时，务必确认授权范围。

**Q：如何减少 AI 幻觉？**

A：提供可靠资料作为上下文，要求标注来源，并对关键事实进行人工复核。`;
};

/** 手写的段落化应用介绍：按需覆盖默认生成内容 */
const articleContent: Record<string, string> = {
  qwen: `通义千问是阿里云推出的通用大模型助手，覆盖对话、写作、编程和多模态生成等场景。它基于通义系列模型构建，对中文语境、行业术语和长文本的理解比较稳定，适合把日常的信息处理工作直接交给它完成。

日常使用中，最常见的做法是把它当作一个随时可用的写作与整理工具：把零散的材料贴进去，让它梳理结构、提炼要点、改写成不同语气；也可以围绕一份文档连续追问，逐步把模糊的问题问清楚。遇到需要外部信息的任务时，可以打开联网检索，让它先汇总多个来源，再给出带出处的结论。

对于开发者，通义千问提供了兼容主流接口风格的 API，能够把对话、摘要和代码生成能力接进自己的产品。模型支持较长的上下文，处理合同、报告或代码仓库时不必频繁切片，跨章节的信息关联也更完整。

在内容生产上，它更适合承担“从零到初稿”的那一步：写营销文案时先给出几个不同方向的版本，再由人来挑选和打磨；整理会议记录时直接输出结论、待办和负责人；做资料调研时把多篇材料放在一起，让它先归纳共性，再指出其中的分歧。相比一次问一句，把上下文一次性交代清楚，往往能省掉大量来回修改的时间。

多模态能力则补齐了图片和文档这两块常见需求。上传一张截图，可以请它读出图表里的关键数字，或者把界面上的报错信息提取出来；上传一份 PDF，可以按章节提问，也可以要求它把要点整理成表格。对于需要反复使用的固定格式，还可以把提示词和示例一起保存成模板，让每次输出都保持一致的结构。

当然，它也有需要注意的地方。涉及专业结论、法律条款或财务数据时，最好要求它标注依据，并安排人工复核；生成的事实性内容不要直接对外发布，先做一次交叉验证。对于时效性强的信息，记得开启联网检索，而不是依赖模型记忆里的旧数据。

如果你刚开始使用，建议从一个具体的小任务入手，例如总结一篇文章或改写一段文案。给出背景、目标、受众和期望的格式，得到的结果会明显更贴近需求；当某套提示词效果稳定时，把它保存成模板，下次直接复用即可。`,
};

/** 应用正文：优先用手写文章，其余按目录数据自动生成 */
const pickContent = (app: AiAppCatalogItem) =>
  articleContent[app.key] ?? buildContent(app);

/** 功能块：按目录数据原样映射，不足 8 个由功能卡片组件用占位卡补齐 */
const buildPictorial = (app: AiAppCatalogItem) =>
  app.features.map((feature, index) => ({
    id: index + 1,
    text: feature.title,
    desc: feature.desc,
    animation: animations[index % animations.length],
    images: [
      {
        img: {
          src: aiImagePool[(app.id * 4 + index) % aiImagePool.length],
          broken: false,
        },
      },
    ],
  }));

export const appDetailList = aiAppCatalog.map((app) => ({
  id: app.id,
  name: app.name,
  desc: app.description,
  icon: aiAppIcons[app.key],
  sub: app.sub,
  banner: { desc: app.banner },
  category: app.category,
  platforms: app.platforms ?? ['windows', 'macos', 'linux'],
  content: pickContent(app),
  tags: Array.from(new Set([app.category, ...app.tags])),
  pictorial: buildPictorial(app),
}));
