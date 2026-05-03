// utils/fragment.ts

interface FragmentConfig {
  count?: number;        // 碎片数量，默认 4
  width?: number;        // 图片宽(px)，用于计算裁剪比例
  height?: number;       // 图片高(px)
  randomness?: number;   // 裁剪点随机偏离程度 0~1，默认 0.3
  displacement?: number; // 碎片初始偏移幅度(px)，默认 100
}

interface FragmentPiece {
  id: number;
  clipPath: string;      // CSS clip-path 值
  offsetX: number;       // 初始 X 偏移(px)
  offsetY: number;       // 初始 Y 偏移(px)
}

export function createFragments(config: FragmentConfig = {}): FragmentPiece[] {
  const {
    count = 4,
    width = 800,
    height = 500,
    randomness = 0.3,
    displacement = 80,
  } = config;

  // 1. 生成一个分割中心（略微随机偏离几何中心）
  const cx = 0.5 + (Math.random() - 0.5) * randomness;
  const cy = 0.4 + (Math.random() - 0.5) * randomness;

  const pieces: FragmentPiece[] = [];
  const angleStep = (2 * Math.PI) / count;

  // 2. 为每个碎片计算裁剪多边形
  for (let i = 0; i < count; i++) {
    const angle1 = i * angleStep;
    const angle2 = (i + 1) * angleStep;

    // 扇形的两个角点（边界极值）
    const corner1 = getCorner(angle1);
    const corner2 = getCorner(angle2);

    // 多边形顶点：中心点 + 两个边界角点
    const polygon = [
      { x: cx * 100, y: cy * 100 },      // 中心点（百分比）
      { x: corner1.x * 100, y: corner1.y * 100 },
      { x: corner2.x * 100, y: corner2.y * 100 },
    ];

    const clipPath = `polygon(${polygon
      .map(p => `${p.x.toFixed(1)}% ${p.y.toFixed(1)}%`)
      .join(', ')})`;

    // 3. 计算初始偏移方向（从中心指向该扇形的反方向）
    const dirAngle = (angle1 + angle2) / 2 + Math.PI; // 指向外
    const offsetX = Math.cos(dirAngle) * displacement;
    const offsetY = Math.sin(dirAngle) * displacement;

    pieces.push({
      id: i,
      clipPath,
      offsetX,
      offsetY,
    });
  }

  return pieces;
}

/**
 * 根据角度获取图片边界的归一化坐标 (0~1)
 */
function getCorner(angle: number): { x: number; y: number } {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);

  // 计算射线与图片矩形边界的交点（归一化坐标）
  const t = Math.min(
    dx > 0 ? (1 - 0.5) / dx : (0 - 0.5) / dx,
    dy > 0 ? (1 - 0.5) / dy : (0 - 0.5) / dy
  );

  return {
    x: 0.5 + dx * Math.abs(t),
    y: 0.5 + dy * Math.abs(t),
  };
}