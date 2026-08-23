// mockData.ts
import tempIcon from '@/assets/chrome.png';
import tempIcon2 from '@/assets/edge.png';
import tempIcon3 from '@/assets/firefox.png';
import tempIcon4 from '@/assets/googledisk.png';
import tempIcon5 from '@/assets/google.png';
import tempIcon6 from '@/assets/idea.png';
import tempIcon7 from '@/assets/clion.png';

const icons = [
  tempIcon,
  tempIcon2,
  tempIcon3,
  tempIcon4,
  tempIcon5,
  tempIcon6,
  tempIcon7,
];

const typeNames = [
  '浏览器',
  '谷歌产品',
  '开发工具',
  '办公软件',
  '设计工具',
  '媒体播放',
  '社交沟通',
  '安全软件',
  '云存储',
  '系统工具',
];

/**
 * 生成关联较多的 mock 数据
 * @param totalApps 全局应用总数（默认 50）
 * @param minCategories 每个应用最少出现在几个分类（默认 1）
 * @param maxCategories 每个应用最多出现在几个分类（默认 5）
 * @param extraUniquePerCategory 每个分类额外增加多少独有应用（默认 2）
 * @returns 同原始格式的数据
 */
export function generateMockData(
  totalApps = 50,
  minCategories = 1,
  maxCategories = 5,
  extraUniquePerCategory = 2
) {
  // 1. 生成全局应用池
  const appPool = Array.from({ length: totalApps }, (_, i) => ({
    name: `应用${i + 1}`,
    icon: icons[i % icons.length],
  }));

  // 2. 为每个应用分配分类索引
  const categoryCount = typeNames.length;
  const appCategoryMap: number[][] = appPool.map(() => {
    const count = Math.floor(
      Math.random() * (maxCategories - minCategories + 1) + minCategories
    );
    // 随机选择 count 个不同分类
    const shuffled = Array.from({ length: categoryCount }, (_, i) => i);
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count).sort((a, b) => a - b);
  });

  // 3. 构建每个分类的应用列表（先填充共享应用）
  const categoryApps: { name: string; icon: string }[][] = Array.from(
    { length: categoryCount },
    () => []
  );

  appPool.forEach((app, idx) => {
    const categories = appCategoryMap[idx];
    categories.forEach((catIdx) => {
      categoryApps[catIdx].push(app);
    });
  });

  // 4. 为每个分类额外添加独有应用（保证每个分类至少有一些独有的）
  for (let i = 0; i < categoryCount; i++) {
    for (let j = 0; j < extraUniquePerCategory; j++) {
      const uniqueApp = {
        name: `${typeNames[i]}独有${j + 1}`,
        icon: icons[(i * 3 + j + totalApps) % icons.length],
      };
      categoryApps[i].push(uniqueApp);
    }
  }

  // 5. 组装最终数据
  return typeNames.map((type, index) => ({
    type,
    apps: categoryApps[index],
  }));
}

// 导出默认数据（可直接使用，或根据需求调整参数）
export const mockData = generateMockData(50, 2, 4, 3);