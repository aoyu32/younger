import { aiAppCatalog, aiAppIcons } from './aiCatalog';

/**
 * 应用中心卡片数据
 * 与 app-detail、应用图谱共用 aiCatalog，点击任意卡片都能进入对应详情。
 */
export const appData = aiAppCatalog.map((app) => ({
  icon: aiAppIcons[app.key],
  id: app.id,
  name: app.name,
  description: app.description,
  category: app.category,
  size: app.size * 1024 * 1024,
}));
