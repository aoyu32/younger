// 应用图谱 mock：与 src/mock/aiCatalog 共用同一批 AI 应用与图标
import {
  aiAppCatalog,
  aiAppIcons,
  type AiAppCatalogItem,
} from '@/mock/aiCatalog';

const categoryMap = aiAppCatalog.reduce<Record<string, AiAppCatalogItem[]>>(
  (groups, app) => {
    (groups[app.category] ??= []).push(app);
    return groups;
  },
  {},
);

// 结构化数据：{ type: 分类名, apps: [{ name, icon }] }
export const mockData = Object.entries(categoryMap).map(([type, apps]) => ({
  type,
  apps: apps.map((app) => ({
    name: app.name,
    icon: aiAppIcons[app.key],
  })),
}));
