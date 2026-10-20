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
  content: buildContent(app),
  tags: Array.from(new Set([app.category, ...app.tags])),
  pictorial: buildPictorial(app),
}));
