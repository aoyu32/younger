import { aiAppCatalog, aiAppIcons } from './aiCatalog';

/**
 * 首页「实用工具」：全部替换为 AI / AIGC 工具。
 * 图标使用本地资源，避免 favicon 服务波动导致空白。
 */
export const webTools = aiAppCatalog.map((app, index) => ({
  id: index + 1,
  name: app.name,
  url: app.website,
  icon: aiAppIcons[app.key],
}));
