<template>
  <div class="app-graph" ref="containerRef">
    <canvas
      ref="canvasRef"
      @mousedown="handleDown"
      @mousemove="handleMove"
      @mouseup="handleUp"
      @mouseleave="handleLeave"
      @mouseenter="handleEnter"
      @wheel="handleWheel"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onActivated,
  onDeactivated,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue';
import { AppNode } from './AppNode';
import { LabelNode } from './LabelNode';
import { mockData } from './mock';
import { MAP_COLORS, MAP_OPTIONS } from './colors';

const props = defineProps<{
  searchText?: string; // 搜索文本（Label 或 AppNode 名称，模糊匹配）
  searchIndex?: number; // 当前聚焦第几个匹配项
}>();

const emit = defineEmits<{
  (e: 'match-count', count: number): void;
  (e: 'app-count', count: number): void;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);

const data = ref(mockData);

const camera = ref<{ x: number; y: number; zoom: number }>({
  x: 0,
  y: 0,
  zoom: 0.5,
});
const dpr = window.devicePixelRatio || 1;
const containerRef = ref<HTMLElement | null>(null);

defineOptions({
  name: 'app-graph',
});

const nodes = ref<any[]>([]);
const connections = ref<any[]>([]);

// ---------- 搜索定位（父组件传入 searchText/searchIndex） ----------
// 模糊匹配 Label/AppNode 名称 -> 依次聚焦到视口中心并激活点击高亮效果

let camAnimRafId = 0;
let searchTimer = 0;

// 缓动：先加速后减速
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// 相机平滑动画到目标位置
const animateCameraTo = (tx: number, ty: number) => {
  if (camAnimRafId) cancelAnimationFrame(camAnimRafId);
  const sx = camera.value.x;
  const sy = camera.value.y;
  const startTime = performance.now();
  const duration = 450;
  const step = () => {
    const p = Math.min(1, (performance.now() - startTime) / duration);
    const e = easeInOutCubic(p);
    camera.value.x = sx + (tx - sx) * e;
    camera.value.y = sy + (ty - sy) * e;
    draw();
    if (p < 1) {
      camAnimRafId = requestAnimationFrame(step);
    } else {
      camAnimRafId = 0;
    }
  };
  camAnimRafId = requestAnimationFrame(step);
};

// 节点显示名称
const nodeNameOf = (n: any) => (n instanceof LabelNode ? n.text : n.name);

// 模糊匹配结果（保持节点顺序稳定，供上/下一个遍历）
const matchedNodes = computed(() => {
  const kw = (props.searchText || '').trim().toLowerCase();
  if (!kw) return [];
  return nodes.value.filter((n) => nodeNameOf(n).toLowerCase().includes(kw));
});

// 聚焦节点：相机居中 + 激活点击高亮效果（蒙版/辉光/Tooltip/视口召回）
const focusNode = (node: any) => {
  // 切换焦点：隐藏旧 Tooltip，但蒙版保持连续（不闪）
  hideNameTip();
  searchFocusedNode = node;

  // 激活与点击一致的视觉效果（keepMask=true 保持蒙版透明度连续）
  setHighlight(node, true);
  glowPhase = 0;
  viewRecallAnchor = node;
  if (node instanceof AppNode) {
    showNameTip([node]);
  } else if (node instanceof LabelNode) {
    const children: any[] = [];
    connections.value.forEach((conn) => {
      if (conn.label === node) children.push(conn.app);
    });
    showNameTip(children);
  }

  // 视口召回：把远处的关联节点拉进视野
  if (physicsMap.size === 0) initPhysics();
  bringRelatedIntoView(node);
  if (!physicsRunning) {
    physicsRunning = true;
    physicsRafId = requestAnimationFrame(physicsLoop(renderVersion));
  }

  // 相机平滑居中到该节点
  const container = containerRef.value;
  if (!container) return;
  const tx = container.clientWidth / 2 - node.x * camera.value.zoom;
  const ty = container.clientHeight / 2 - node.y * camera.value.zoom;
  animateCameraTo(tx, ty);
};

// 应用搜索聚焦：取当前索引对应的匹配项（越界自动环绕）
let searchActive = false; // 搜索激活中：画布操作不取消焦点效果
let searchFocusedNode: any = null;

const applySearchFocus = () => {
  const kw = (props.searchText || '').trim();
  const list = matchedNodes.value;
  emit('match-count', list.length);
  if (!kw || list.length === 0) {
    // 清空搜索或无结果：取消搜索激活状态和焦点效果
    searchActive = false;
    searchFocusedNode = null;
    clearHighlight();
    hideNameTip();
    viewRecallAnchor = null;
    return;
  }
  searchActive = true;
  const raw = props.searchIndex ?? 0;
  const idx = ((raw % list.length) + list.length) % list.length;
  focusNode(list[idx]);
};

// 输入防抖 200ms 后执行聚焦
watch(
  () => [props.searchText, props.searchIndex] as const,
  () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(applySearchFocus, 200);
  },
);

// ---------- 性能优化：图片缓存 ----------
const imageCache = new Map<string, HTMLImageElement>();

function loadImage(src: string): HTMLImageElement {
  if (imageCache.has(src)) {
    return imageCache.get(src)!;
  }
  const img = new Image();
  img.src = src;
  img.onload = () => {
    if (ctx.value) requestRedraw(); // 加载完成后节流重绘
  };
  imageCache.set(src, img);
  return img;
}

// ---------- 性能优化：requestAnimationFrame 节流重绘 ----------
// renderVersion：每次 render 递增，用于让旧的 RAF 回调（重绘/动画）过期失效，
// 避免动画执行中重新进入页面时，上一轮残留的 RAF 把旧节点画出来
let renderVersion = 0;
let redrawPending = false;
let redrawRafId = 0;
function requestRedraw() {
  if (!redrawPending) {
    redrawPending = true;
    const v = renderVersion;
    redrawRafId = requestAnimationFrame(() => {
      redrawPending = false;
      redrawRafId = 0;
      if (v !== renderVersion) return; // 过期，放弃绘制
      draw();
    });
  }
}

// 世界坐标转换
const getWorldPos = (clientX: number, clientY: number) => {
  const canvas = canvasRef.value;
  if (!canvas) return { x: 0, y: 0 };

  const rect = canvas.getBoundingClientRect();
  const canvasX = clientX - rect.left;
  const canvasY = clientY - rect.top;

  const worldX = (canvasX - camera.value.x) / camera.value.zoom;
  const worldY = (canvasY - camera.value.y) / camera.value.zoom;

  return { x: worldX, y: worldY };
};

// 创建节点和连接
const render = () => {
  const canvas = canvasRef.value;
  if (!canvas || !ctx.value) return;

  // 递增版本号：让上一轮所有 RAF 回调（动画/重绘）过期失效，避免残留绘制
  renderVersion++;
  // 清理上一次动画状态和 RAF，避免残留循环用旧状态绘制
  stopAnimation();

  nodes.value = [];
  connections.value = [];

  data.value.forEach((item) => {
    const label = new LabelNode(item.type, 0, 0);
    nodes.value.push(label);

    item.apps.forEach((appData) => {
      let appNode = nodes.value.find(
        (n) => n instanceof AppNode && n.name === appData.name,
      ) as AppNode | undefined;

      if (!appNode) {
        appNode = new AppNode(loadImage(appData.icon), appData.name, 0, 0);
        nodes.value.push(appNode);
      }

      connections.value.push({ label, app: appNode });
    });
  });

  // 上报应用总数（去重后的 AppNode 数量），供父组件显示
  emit(
    'app-count',
    nodes.value.filter((n) => n instanceof AppNode).length,
  );

  const { order, parentEdge } = assignPositions();
  // 重置相机到原点（第一个 Label 位置）
  const container = containerRef.value;
  if (container) {
    camera.value = {
      x: container.clientWidth / 2,
      y: container.clientHeight / 2,
      zoom: 0.7,
    };
  }
  startAnimation(order, parentEdge);
};

// ---------- 布局算法：BFS 图遍历 + 极坐标随机散布（星星布局） ----------
// 思路：
//   1. 以 Label <-> AppNode 为二部图，从第一个 Label 开始 BFS 遍历
//   2. 第一个 Label 放在画布原点（视口中心）
//   3. 每访问一个已放置节点，为它的未放置邻居在锚点周围用"随机角度 + 随机距离"
//      生成候选位置，距离在 [MIN_DIST, MAX_DIST] 区间内随机取值（星星散布感）
//   4. 三重校验：节点不重叠 / 新连线不与已有连线交叉 / 新连线不穿过其他节点
//   5. 共享 AppNode 因 BFS 自然把所属的多个 Label 拉到邻近区域
//   6. 无限画布，无边界限制
const assignPositions = (): { order: any[]; parentEdge: Map<any, any> } => {
  const MIN_DIST = 240; // 节点中心间最小距离（硬约束，避免重叠/太近）
  const MAX_DIST = 400; // 节点中心间最大距离（软约束，保证相关节点相邻）
  const GAP = 40; // 节点边缘额外间距

  const labels: LabelNode[] = nodes.value.filter(
    (n): n is LabelNode => n instanceof LabelNode,
  );
  const apps: AppNode[] = nodes.value.filter(
    (n): n is AppNode => n instanceof AppNode,
  );

  // 节点碰撞半径（按实际绘制尺寸估算）
  const radiusOf = (n: any) => (n instanceof AppNode ? 32 : 50);

  // 构建邻接表（Label <-> AppNode 二部图）
  const adj = new Map<any, any[]>();
  const addEdge = (a: any, b: any) => {
    if (!adj.has(a)) adj.set(a, []);
    if (!adj.has(b)) adj.set(b, []);
    adj.get(a)!.push(b);
    adj.get(b)!.push(a);
  };
  connections.value.forEach((conn) => addEdge(conn.label, conn.app));

  // conn 索引：(label, app) -> conn，用于 BFS 记录每个节点的父边
  const connByPair = new Map<LabelNode, Map<AppNode, any>>();
  connections.value.forEach((conn) => {
    if (!connByPair.has(conn.label)) connByPair.set(conn.label, new Map());
    connByPair.get(conn.label)!.set(conn.app, conn);
  });
  const findConn = (a: any, b: any): any => {
    if (a instanceof LabelNode) return connByPair.get(a)?.get(b);
    return connByPair.get(b)?.get(a);
  };
  const parentEdge = new Map<any, any>();

  const placed = new Set<any>();
  const placedNodes: any[] = [];
  const placedLines: { a: any; b: any }[] = [];
  const order: any[] = []; // 按 BFS 放置顺序记录，供动画使用

  // 线段相交检测（共享端点视为不交叉）
  const segCross = (
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
    p4: { x: number; y: number },
  ): boolean => {
    const same = (a: { x: number; y: number }, b: { x: number; y: number }) =>
      a.x === b.x && a.y === b.y;
    if (same(p1, p3) || same(p1, p4) || same(p2, p3) || same(p2, p4))
      return false;
    const d1x = p2.x - p1.x,
      d1y = p2.y - p1.y;
    const d2x = p4.x - p3.x,
      d2y = p4.y - p3.y;
    const denom = d1x * d2y - d1y * d2x;
    if (Math.abs(denom) < 1e-9) return false; // 平行/共线
    const s = ((p3.x - p1.x) * d2y - (p3.y - p1.y) * d2x) / denom;
    const t = ((p3.x - p1.x) * d1y - (p3.y - p1.y) * d1x) / denom;
    return s > 1e-3 && s < 1 - 1e-3 && t > 1e-3 && t < 1 - 1e-3;
  };

  // 点到线段最短距离（用于检测连线是否穿过节点）
  const pointToSegDist = (
    px: number,
    py: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ): number => {
    const dx = x2 - x1,
      dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (len2 < 1e-9) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * dx + (py - y1) * dy) / len2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  };

  const place = (node: any, x: number, y: number) => {
    node.x = x;
    node.y = y;
    placed.add(node);
    placedNodes.push(node);
    order.push(node);
  };

  // 在 anchor 周围用极坐标随机生成候选位置
  // 综合考虑：与 anchor 距离 + 与 target 其他已放置邻居的距离（让共享节点相邻）
  // 强制要求：新连线不与已有连线交叉、不穿过节点（找不到则扩大搜索范围重试）
  // 返回 { x, y } 或 null
  const findPos = (
    anchor: any,
    target: any,
  ): { x: number; y: number } | null => {
    const rT = radiusOf(target);
    // target 的所有已放置邻居（除当前 anchor 外），用于让共享节点相邻
    const otherNeighbors = (adj.get(target) || []).filter(
      (n) => n !== anchor && placed.has(n),
    );

    // 分多轮扩大搜索范围，第一轮用标准距离，之后逐轮放宽 MAX_DIST
    const distMultipliers = [1, 1.25, 1.5, 1.8, 2.2];
    const attemptsPerRound = 150;

    let fallback: { x: number; y: number; score: number } | null = null;

    for (let round = 0; round < distMultipliers.length; round++) {
      const maxD = MAX_DIST * distMultipliers[round];
      let roundFound = false;
      for (let i = 0; i < attemptsPerRound; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = MIN_DIST + Math.random() * (maxD - MIN_DIST);
        const x = anchor.x + dist * Math.cos(angle);
        const y = anchor.y + dist * Math.sin(angle);

        // 1. 与所有已放置节点不重叠（硬约束）
        let overlap = false;
        for (const n of placedNodes) {
          const need = radiusOf(n) + rT + GAP;
          if (Math.hypot(x - n.x, y - n.y) < need) {
            overlap = true;
            break;
          }
        }
        if (overlap) continue;

        // 2. 新连线不与已有连线交叉（硬约束，不允许交叉）
        let crosses = false;
        for (const ln of placedLines) {
          if (segCross({ x: anchor.x, y: anchor.y }, { x, y }, ln.a, ln.b)) {
            crosses = true;
            break;
          }
        }
        if (crosses) continue;

        // 3. 新连线不穿过其他节点（硬约束）
        let through = false;
        for (const n of placedNodes) {
          if (n === anchor) continue;
          const d = pointToSegDist(n.x, n.y, anchor.x, anchor.y, x, y);
          if (d < radiusOf(n) + 8) {
            through = true;
            break;
          }
        }
        if (through) continue;

        // 通过所有硬约束：评估软约束（邻居距离）
        let neighborScore = 0;
        for (const nb of otherNeighbors) {
          const d = Math.hypot(x - nb.x, y - nb.y);
          if (d > MAX_DIST * 1.5) neighborScore += (d - MAX_DIST) * 0.5;
        }

        // 第一轮内且邻居距离合理 → 立即采用
        if (round === 0 && neighborScore === 0) return { x, y };

        // 记录最优候选（软约束得分最低）
        if (!fallback || neighborScore < fallback.score) {
          fallback = { x, y, score: neighborScore };
        }
        roundFound = true;
      }
      // 当前轮找到通过硬约束的候选就返回（优先避免交叉）
      if (roundFound && fallback) {
        return { x: fallback.x, y: fallback.y };
      }
    }

    return null;
  };

  // BFS 遍历放置
  const queue: any[] = [];
  if (labels.length > 0) {
    place(labels[0], 0, 0);
    queue.push(labels[0]);
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    let neighbors = adj.get(current) || [];
    // 过滤未放置的邻居，按连接度降序排列（高连接度的共享节点优先放置，
    // 使其尽早成为已放置锚点，后续相关 Label 放置时能参考它的位置拉近）
    neighbors = neighbors
      .filter((n) => !placed.has(n))
      .sort((a, b) => (adj.get(b)?.length || 0) - (adj.get(a)?.length || 0));
    // 在连接度相同的前若干个邻居中随机选，兼顾多样性
    for (let i = neighbors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [neighbors[i], neighbors[j]] = [neighbors[j], neighbors[i]];
    }
    for (const neighbor of neighbors) {
      if (placed.has(neighbor)) continue;
      const pos = findPos(current, neighbor);
      if (pos) {
        place(neighbor, pos.x, pos.y);
        const conn = findConn(current, neighbor);
        if (conn) parentEdge.set(neighbor, conn);
        placedLines.push({ a: current, b: neighbor });
        queue.push(neighbor);
      }
    }
  }

  // 兜底：图不连通时的未放置节点，在外围随机散布
  for (const n of [...labels, ...apps]) {
    if (placed.has(n)) continue;
    const rN = radiusOf(n);
    let placedOk = false;
    for (let tries = 0; tries < 300; tries++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 520 + Math.random() * 800 + tries * 6;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      let ok = true;
      for (const m of placedNodes) {
        if (Math.hypot(x - m.x, y - m.y) < radiusOf(m) + rN + GAP) {
          ok = false;
          break;
        }
      }
      if (ok) {
        place(n, x, y);
        placedOk = true;
        break;
      }
    }
    // 实在找不到无重叠位置：强制放到远端，保证进入 order（有动画排程）
    // 否则会因无 nodeStart 而在动画中被跳过或被 else 误画
    if (!placedOk) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 1500 + placedNodes.length * 50;
      place(n, Math.cos(angle) * dist, Math.sin(angle) * dist);
    }
  }

  return { order, parentEdge };
};

// ---------- 节点高亮发光系统 ----------
// 点击/拖动 Label：高亮其子 AppNode + 相关联线
// 点击/拖动 AppNode：高亮其所有父 Label + 相关联线
// 使用项目品牌色阶（--ao-lime 浅色阶），浅色柔光效果

interface HighlightState {
  nodes: Set<any>; // 发光节点集合
  lines: Set<any>; // 发光连线集合
}

let highlight: HighlightState | null = null;
// 发光呼吸动画相位
let glowPhase = 0;

// ---------- 高亮蒙版 ----------
// 点击高亮时压暗其他内容，让高亮节点/连线在蒙版之上更突出
const mask = {
  active: false,
  fadingOut: false,
  startTime: 0,
  fadeStart: 0,
};
const MASK_ALPHA = 0.1; // 蒙版最终透明度
const MASK_DURATION = 240; // 淡入/淡出时长

// 计算当前蒙版透明度（含淡入/淡出动画）
const getMaskAlpha = (): number => {
  const now = performance.now();
  if (mask.active && !mask.fadingOut) {
    const p = Math.min(1, (now - mask.startTime) / MASK_DURATION);
    return MASK_ALPHA * easeOutCubic(p);
  }
  if (mask.fadingOut) {
    const p = (now - mask.fadeStart) / MASK_DURATION;
    if (p >= 1) {
      mask.active = false;
      mask.fadingOut = false;
      return 0;
    }
    return MASK_ALPHA * (1 - p);
  }
  return 0;
};

// 设置高亮：根据点击的节点收集相关节点和连线
// keepMask: 切换焦点时传 true，蒙版保持当前透明度不重新淡入（避免闪烁）
const setHighlight = (node: any, keepMask = false) => {
  const nodes = new Set<any>([node]);
  const lines = new Set<any>();

  if (node instanceof LabelNode) {
    // Label：高亮其所有子 AppNode + 相关联线
    connections.value.forEach((conn) => {
      if (conn.label === node) {
        nodes.add(conn.app);
        lines.add(conn);
      }
    });
  } else if (node instanceof AppNode) {
    // AppNode：高亮其所有父 Label + 相关联线
    connections.value.forEach((conn) => {
      if (conn.app === node) {
        nodes.add(conn.label);
        lines.add(conn);
      }
    });
  }

  highlight = { nodes, lines };
  // 启动蒙版淡入（keepMask 时蒙版已在显示，跳过重置保持连续）
  if (!keepMask) {
    mask.active = true;
    mask.fadingOut = false;
    mask.startTime = performance.now();
  } else if (!mask.active || mask.fadingOut) {
    // 蒙版未显示或正在淡出：恢复显示但不从 0 开始（用淡出进度反推恢复起点）
    const now = performance.now();
    if (mask.fadingOut) {
      // 从当前透明度继续淡入到全值：把 startTime 回推等效位置
      const fadeP = Math.min(1, (now - mask.fadeStart) / MASK_DURATION);
      const restoredAlpha = MASK_ALPHA * (1 - fadeP);
      const easedBack =
        restoredAlpha >= MASK_ALPHA
          ? 1
          : 1 - Math.pow(1 - restoredAlpha / MASK_ALPHA, 1 / 3); // easeOutCubic 反函数近似
      mask.startTime = now - easedBack * MASK_DURATION;
    }
    mask.active = true;
    mask.fadingOut = false;
  }
};

const clearHighlight = () => {
  highlight = null;
  // 启动蒙版淡出
  if (mask.active && !mask.fadingOut) {
    mask.fadingOut = true;
    mask.fadeStart = performance.now();
  }
};

// ---------- AppNode 名称 Tooltip ----------
// 点击 AppNode 时在节点上方显示名称：发光文本 + 上浮淡入微动画，松手后延迟淡出
interface NameTipState {
  node: any;
  showTime: number; // 开始显示时间（用于入场动画）
  hideTime: number; // 开始隐藏时间（0 表示未在隐藏）
}

let nameTips: NameTipState[] = [];
const TIP_IN_DURATION = 260; // 入场动画时长
const TIP_OUT_DURATION = 200; // 淡出时长
const TIP_STAGGER = 40; // 多个 Tooltip 错开入场间隔（波浪弹出）

// 显示一组节点的名称 Tooltip（Label 点击时显示其所有子 AppNode）
const showNameTip = (nodeList: any[]) => {
  const now = performance.now();
  nameTips = nodeList.map((node, i) => ({
    node,
    showTime: now + i * TIP_STAGGER, // 依次错开，波浪式弹出
    hideTime: 0,
  }));
};

// 松手后立即开始消失（反向缩回动画）
const scheduleHideNameTip = () => {
  const now = performance.now();
  nameTips.forEach((tip) => {
    if (tip.hideTime === 0) tip.hideTime = now;
  });
};

const hideNameTip = () => {
  nameTips = [];
};

// 绘制名称 Tooltip：从节点处向上弹入（垂直缩放），消失时反向缩回
// 返回 true 表示仍在显示中（需要继续重绘）
const drawNameTip = (ctx2d: CanvasRenderingContext2D): boolean => {
  if (nameTips.length === 0) return false;
  const now = performance.now();
  let anyVisible = false;

  for (const tip of nameTips) {
    // 淡出判断
    if (tip.hideTime > 0 && now >= tip.hideTime + TIP_OUT_DURATION) {
      continue; // 该项已结束
    }
    anyVisible = true;

    // 入场进度（easeOutBack 弹性弹出），未到出场时间的项跳过
    let inP = (now - tip.showTime) / TIP_IN_DURATION;
    if (inP <= 0) continue; // 还没轮到它入场
    inP = Math.min(1, inP);
    inP = Math.max(0.01, easeOutBack(inP));
    // 消失进度（反向：向下缩回 + 淡出）
    let outP = 1;
    if (tip.hideTime > 0 && now > tip.hideTime) {
      outP = 1 - Math.min(1, (now - tip.hideTime) / TIP_OUT_DURATION);
    }
    // 综合动画系数：出场用 inP，退场用 outP 收缩
    const scale = inP * easeOutCubic(outP);
    const alpha = Math.min(1, inP * 1.5) * outP;
    if (alpha <= 0.01 || scale <= 0.01) continue;

    // 锚点在节点顶部：从锚点向上弹出/缩回
    const anchorX = tip.node.x;
    const anchorY = tip.node.y - 40;

    ctx2d.save();
    ctx2d.globalAlpha = alpha;
    ctx2d.font = '600 16px Arial, sans-serif';
    ctx2d.textAlign = 'center';
    ctx2d.textBaseline = 'bottom';
    // 以锚点为原点做垂直缩放（从下向上弹出效果）
    ctx2d.translate(anchorX, anchorY);
    ctx2d.scale(1, scale);
    // 发光文本：随时间柔和呼吸（受光晕总开关控制）
    const breath = 0.5 + Math.sin(now / 300) * 0.25;
    if (MAP_OPTIONS.glowEnabled) {
      ctx2d.shadowColor = `rgba(${MAP_COLORS.glowLight},${0.4 + breath * 0.4})`;
      ctx2d.shadowBlur = 8 + breath * 6;
      ctx2d.fillStyle = `rgba(${MAP_COLORS.glowBase},0.95)`;
      ctx2d.fillText(tip.node.name, 0, -12);
      ctx2d.fillText(tip.node.name, 0, -12); // 画两遍增强光感
    } else {
      ctx2d.fillStyle = `rgb(${MAP_COLORS.glowBase})`;
      ctx2d.fillText(tip.node.name, 0, -12);
    }
    ctx2d.restore();
  }

  // 全部结束后清空列表
  if (!anyVisible) nameTips = [];
  return anyVisible;
};

// ---------- 节点拖动物理排斥效果 ----------
// 物理模型：每个非拖动节点有 rest 位置（弹簧归位）+ 节点间斥力 + 速度阻尼
// 拖动 AppNode：只移动自身；拖动 Label：其子 AppNode 跟随（保持相对偏移）

interface PhysicsState {
  restX: number;
  restY: number;
  vx: number;
  vy: number;
}

const physicsMap = new Map<any, PhysicsState>();
let physicsRunning = false;
let physicsRafId = 0;

// 物理参数
const PHY_REPULSE = 90000; // 斥力强度系数
const PHY_FORCE_CAP = 22; // 单个斥力上限（防止近距力爆炸导致过冲振荡）
const PHY_SLEEP_SPEED = 1.2; // 低速阈值：低于此速度加强阻尼快速静止
const PHY_SPRING = 0.12; // 弹簧刚度（拉回 rest 位置）
const PHY_DAMPING = 0.78; // 速度阻尼（<1 衰减）
const PHY_MAX_SPEED = 30; // 单帧最大速度，防止飞出
const PHY_CHILD_FOLLOW = 0.25; // Label 拖动时子 AppNode 跟随系数（弹性跟随）
const PHY_LINE_LERP = 0.22; // 连线视觉端点跟随节点的插值系数（越小越丝滑延迟）

// 连线视觉端点：用插值跟随节点实际位置，产生丝滑的橡皮筋拉扯感
// key: conn 对象，value: { fx, fy, tx, ty }
const lineVisualMap = new Map<
  any,
  { fx: number; fy: number; tx: number; ty: number }
>();

// 初始化连线视觉端点为节点当前位置
const initLineVisual = () => {
  lineVisualMap.clear();
  connections.value.forEach((conn) => {
    lineVisualMap.set(conn, {
      fx: conn.label.x,
      fy: conn.label.y,
      tx: conn.app.x,
      ty: conn.app.y,
    });
  });
};

// 每帧更新连线视觉端点：向节点当前位置插值靠近（被排斥节点产生丝滑延迟拉扯）
// 拖动节点及其直接跟随子节点本身：连线端点紧跟中心，不插值（避免线头偏移）
const updateLineVisual = () => {
  const lerp = PHY_LINE_LERP;
  connections.value.forEach((conn) => {
    const lv = lineVisualMap.get(conn);
    if (!lv) return;
    // label 端
    if (conn.label === currentDragNode) {
      lv.fx = conn.label.x;
      lv.fy = conn.label.y;
    } else {
      lv.fx += (conn.label.x - lv.fx) * lerp;
      lv.fy += (conn.label.y - lv.fy) * lerp;
    }
    // app 端
    if (conn.app === currentDragNode || currentLabelChildren.has(conn.app)) {
      lv.tx = conn.app.x;
      lv.ty = conn.app.y;
    } else {
      lv.tx += (conn.app.x - lv.tx) * lerp;
      lv.ty += (conn.app.y - lv.ty) * lerp;
    }
  });
};

// 初始化物理状态：记录每个节点的 rest 位置，速度归零
const initPhysics = () => {
  physicsMap.clear();
  nodes.value.forEach((n) => {
    physicsMap.set(n, { restX: n.x, restY: n.y, vx: 0, vy: 0 });
  });
  initLineVisual();
};

// 节点半径（与布局算法一致）
const phyRadius = (n: any) => (n instanceof AppNode ? 32 : 50);

// 执行一帧物理模拟
const physicsStep = (dragNode: any | null, labelChildren: Set<any>) => {
  const all = nodes.value;

  // 1) 硬重叠位置分离：直接推开穿透量（确定性，不注入能量，避免互推振荡）
  for (let i = 0; i < all.length; i++) {
    const a = all[i];
    for (let j = i + 1; j < all.length; j++) {
      const b = all[j];
      if (a === dragNode && b === dragNode) continue;
      const minDist = phyRadius(a) + phyRadius(b) + 20;
      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let d = Math.hypot(dx, dy);
      if (d >= minDist) continue;
      if (d < 1e-6) {
        dx = 1;
        dy = 0;
        d = 1;
      }
      const pen = minDist - d;
      const ux = dx / d;
      const uy = dy / d;
      if (a === dragNode) {
        // 拖动节点固定，只推开对方
        b.x += ux * pen;
        b.y += uy * pen;
      } else if (b === dragNode) {
        a.x -= ux * pen;
        a.y -= uy * pen;
      } else {
        const half = pen / 2;
        a.x -= ux * half;
        a.y -= uy * half;
        b.x += ux * half;
        b.y += uy * half;
      }
    }
  }

  // 2) 力学更新（斥力封顶 + 低速强阻尼防抖）
  for (let i = 0; i < all.length; i++) {
    const n = all[i];
    if (n === dragNode) continue; // 拖动节点由鼠标控制，不参与力学
    const st = physicsMap.get(n);
    if (!st) continue;

    let fx = 0;
    let fy = 0;

    // 节点间斥力（库仑力，封顶防爆）
    for (let j = 0; j < all.length; j++) {
      if (j === i) continue;
      const m = all[j];
      const dx = n.x - m.x;
      const dy = n.y - m.y;
      let d2 = dx * dx + dy * dy;
      if (d2 < 1) d2 = 1;
      const d = Math.sqrt(d2);
      let force = PHY_REPULSE / d2;
      if (force > PHY_FORCE_CAP) force = PHY_FORCE_CAP; // 斥力封顶
      fx += (dx / d) * force;
      fy += (dy / d) * force;
    }

    // 弹簧力：拉回 rest 位置
    fx += (st.restX - n.x) * PHY_SPRING;
    fy += (st.restY - n.y) * PHY_SPRING;

    // 更新速度（带阻尼）
    st.vx = (st.vx + fx) * PHY_DAMPING;
    st.vy = (st.vy + fy) * PHY_DAMPING;

    // 限速
    const sp = Math.hypot(st.vx, st.vy);
    if (sp > PHY_MAX_SPEED) {
      st.vx = (st.vx / sp) * PHY_MAX_SPEED;
      st.vy = (st.vy / sp) * PHY_MAX_SPEED;
    } else if (sp < PHY_SLEEP_SPEED) {
      // 低速时加强衰减，快速静止，消除相邻节点互推的残余振荡
      st.vx *= 0.55;
      st.vy *= 0.55;
    }

    // 更新位置
    n.x += st.vx;
    n.y += st.vy;
  }
};

// 物理循环（带版本校验）：速度足够小时自动停止
const physicsLoop = (myVersion: number) => () => {
  if (myVersion !== renderVersion) {
    physicsRunning = false;
    physicsRafId = 0;
    return;
  }
  physicsStep(currentDragNode, currentLabelChildren);
  updateLineVisual();
  draw();

  // 无拖动节点时，检查所有节点是否已近似静止 → 自动停止
  if (!currentDragNode) {
    let settled = true;
    for (const st of physicsMap.values()) {
      if (Math.abs(st.vx) > 0.15 || Math.abs(st.vy) > 0.15) {
        settled = false;
        break;
      }
    }
    if (settled) {
      physicsRunning = false;
      physicsRafId = 0;
      // 停止前把连线视觉端点 snap 到节点位置，消除插值残差
      connections.value.forEach((conn) => {
        const lv = lineVisualMap.get(conn);
        if (lv) {
          lv.fx = conn.label.x;
          lv.fy = conn.label.y;
          lv.tx = conn.app.x;
          lv.ty = conn.app.y;
        }
      });
      draw();
      return;
    }
  }
  if (physicsRunning) {
    physicsRafId = requestAnimationFrame(physicsLoop(myVersion));
  } else {
    physicsRafId = 0;
  }
};

// 当前拖动上下文（供 physicsLoop 读取）
let currentDragNode: any = null;
let currentLabelChildren = new Set<any>();

const startPhysics = (dragNode: any) => {
  currentDragNode = dragNode;
  currentLabelChildren = new Set<any>();
  // 拖动 Label 时，收集它的子 AppNode
  if (dragNode instanceof LabelNode) {
    connections.value.forEach((conn) => {
      if (conn.label === dragNode) currentLabelChildren.add(conn.app);
    });
  }
  if (!physicsRunning) {
    physicsRunning = true;
    physicsRafId = requestAnimationFrame(physicsLoop(renderVersion));
  }
};

// 松开节点：清除拖动上下文，物理循环继续跑让节点在弹簧作用下回弹静止
const releasePhysics = () => {
  currentDragNode = null;
  currentLabelChildren = new Set<any>();
  // 确保循环在跑（可能在拖动前没启动）
  if (!physicsRunning) {
    physicsRunning = true;
    physicsRafId = requestAnimationFrame(physicsLoop(renderVersion));
  }
};

// 强制停止物理循环（卸载/切走/render 重建时）
const stopPhysics = () => {
  physicsRunning = false;
  if (physicsRafId) {
    cancelAnimationFrame(physicsRafId);
    physicsRafId = 0;
  }
  currentDragNode = null;
  currentLabelChildren = new Set<any>();
};

// ---------- 点击时把视口外的关联节点拉回视口内 ----------
// 视口内边距（世界单位）
const VIEW_MARGIN = 100;
// 关联节点与点击节点的距离约束（复用布局参数量级）
const VIEW_MIN_DIST = 220;
const VIEW_MAX_DIST = 400;

// 当前可视区域的世界坐标范围
const getViewRect = () => {
  const container = containerRef.value;
  const z = camera.value.zoom;
  const w = container ? container.clientWidth : 0;
  const h = container ? container.clientHeight : 0;
  return {
    minX: -camera.value.x / z + VIEW_MARGIN,
    minY: -camera.value.y / z + VIEW_MARGIN,
    maxX: (-camera.value.x + w) / z - VIEW_MARGIN,
    maxY: (-camera.value.y + h) / z - VIEW_MARGIN,
  };
};

const clampToRect = (
  x: number,
  y: number,
  r: { minX: number; minY: number; maxX: number; maxY: number },
) => ({
  x: Math.max(r.minX, Math.min(r.maxX, x)),
  y: Math.max(r.minY, Math.min(r.maxY, y)),
});

// 把高亮集合中位于视口外的关联节点，移动到视口内且与锚点距离在 [VIEW_MIN, VIEW_MAX] 区间
// 通过更新物理 rest 位置，弹簧会平滑地把节点拉过去
const bringRelatedIntoView = (anchor: any) => {
  if (!highlight) return;
  const rect = getViewRect();
  highlight.nodes.forEach((n) => {
    if (n === anchor) return;
    const st = physicsMap.get(n);
    if (!st) return;
    // 已在视口内则不动
    if (
      n.x >= rect.minX &&
      n.x <= rect.maxX &&
      n.y >= rect.minY &&
      n.y <= rect.maxY
    )
      return;

    // 沿锚点→节点方向，取一个满足距离约束的目标点
    const dx = n.x - anchor.x;
    const dy = n.y - anchor.y;
    const dist = Math.hypot(dx, dy) || 1;
    const d = Math.max(VIEW_MIN_DIST, Math.min(VIEW_MAX_DIST, dist));
    let tx = anchor.x + (dx / dist) * d;
    let ty = anchor.y + (dy / dist) * d;
    // 收进视口
    const c = clampToRect(tx, ty, rect);
    tx = c.x;
    ty = c.y;
    // 收进后若离锚点太近，沿反方向推开到最小间距
    const ndx = tx - anchor.x;
    const ndy = ty - anchor.y;
    const ndist = Math.hypot(ndx, ndy) || 1;
    if (ndist < VIEW_MIN_DIST) {
      tx = anchor.x + (ndx / ndist) * VIEW_MIN_DIST;
      ty = anchor.y + (ndy / ndist) * VIEW_MIN_DIST;
      const c2 = clampToRect(tx, ty, rect);
      tx = c2.x;
      ty = c2.y;
    }
    st.restX = tx;
    st.restY = ty;
  });
};

// ---------- 鼠标交互 ----------
let isDragging = false;
let isNodeDragging = false;
let canScale = false;
let startScreenX = 0;
let startScreenY = 0;
let startCameraX = 0;
let startCameraY = 0;
let clickOffsetX = 0;
let clickOffsetY = 0;
let clickNode: any = null;
// 拖动 Label 时子 AppNode 的初始相对偏移，用于跟随移动
let dragChildOffsets = new Map<any, { dx: number; dy: number }>();
// 视口召回的锚点节点（点击的节点），平移/缩放视口时重新计算召回目标
let viewRecallAnchor: any = null;

// 记录 Label 子 AppNode 当前相对偏移（在子节点飞到位后调用才准确）
const captureChildOffsets = () => {
  if (!(clickNode instanceof LabelNode)) return;
  dragChildOffsets = new Map();
  connections.value.forEach((conn) => {
    if (conn.label === clickNode) {
      dragChildOffsets.set(conn.app, {
        dx: conn.app.x - clickNode.x,
        dy: conn.app.y - clickNode.y,
      });
    }
  });
};

const handleDown = (e: MouseEvent) => {
  const clickPosX = e.clientX;
  const clickPosY = e.clientY;

  startScreenX = clickPosX;
  startScreenY = clickPosY;
  startCameraX = camera.value.x;
  startCameraY = camera.value.y;

  const { x: worldX, y: worldY } = getWorldPos(clickPosX, clickPosY);

  let hitNode = null;
  for (const item of nodes.value) {
    if (item.contains(worldX, worldY, ctx.value)) {
      hitNode = item;
      clickOffsetX = worldX - item.x;
      clickOffsetY = worldY - item.y;
      break; // 性能优化：找到后立即停止
    }
  }

  if (hitNode) {
    clickNode = hitNode;
    isNodeDragging = true;
    isDragging = false;
    // 设置高亮发光（品牌浅青色）
    // 蒙版已在显示时保持连续（keepMask），避免切换高亮目标时闪烁
    const maskShowing = mask.active && !mask.fadingOut;
    setHighlight(hitNode, maskShowing);
    if (!maskShowing) glowPhase = 0;
    // 显示名称 Tooltip：AppNode 显示自身；Label 显示其所有子 AppNode
    if (hitNode instanceof AppNode) {
      showNameTip([hitNode]);
    } else if (hitNode instanceof LabelNode) {
      const children: any[] = [];
      connections.value.forEach((conn) => {
        if (conn.label === hitNode) children.push(conn.app);
      });
      showNameTip(children);
    } else {
      hideNameTip();
    }
    // 确保物理状态已初始化（动画可能还在进行中，用当前位置初始化）
    if (physicsMap.size === 0) initPhysics();
    // 把视口外的关联节点平滑拉回视口内（距离约束 [VIEW_MIN, VIEW_MAX]）
    bringRelatedIntoView(hitNode);
    // 子 AppNode 相对偏移延迟到首次拖动时记录：
    // 点击后关联节点可能正在飞向视口（召回动画），此时记录的偏移才是最终布局
    dragChildOffsets = new Map();
    viewRecallAnchor = hitNode;
    startPhysics(hitNode);
  } else {
    clickNode = null;
    isNodeDragging = false;
    isDragging = true;
    // 点击空白处：非搜索状态才清除召回锚点（搜索激活时保持焦点召回）
    if (!searchActive) viewRecallAnchor = null;
  }
};

const handleEnter = () => {
  canScale = true;
};

const handleMove = (e: MouseEvent) => {
  if (!isDragging && !isNodeDragging) return;

  const { x: worldX, y: worldY } = getWorldPos(e.clientX, e.clientY);

  if (isNodeDragging && clickNode) {
    // 首次拖动移动时记录 Label 子节点相对偏移（此时召回飞行已到位）
    if (clickNode instanceof LabelNode && dragChildOffsets.size === 0) {
      captureChildOffsets();
    }
    const newX = worldX - clickOffsetX;
    const newY = worldY - clickOffsetY;
    const deltaX = newX - clickNode.x;
    const deltaY = newY - clickNode.y;
    clickNode.x = newX;
    clickNode.y = newY;

    // 更新拖动节点自身的 rest 位置，松手后停留在拖动落点而非弹回原位
    const selfSt = physicsMap.get(clickNode);
    if (selfSt) {
      selfSt.restX = newX;
      selfSt.restY = newY;
    }

    // 拖动 Label 时子 AppNode 直接同步移动（与 Label 相同位移），保证速度一致
    // 弹簧 + 斥力仍在 physicsStep 中生效：子节点可被其他节点推开，松手回弹到跟随位置
    if (clickNode instanceof LabelNode && dragChildOffsets.size > 0) {
      dragChildOffsets.forEach((off, child) => {
        child.x += deltaX;
        child.y += deltaY;
        const st = physicsMap.get(child);
        if (st) {
          // rest 跟随：保持相对偏移，排斥后回弹到跟随位置
          st.restX = clickNode.x + off.dx;
          st.restY = clickNode.y + off.dy;
        }
      });
    }
    // 物理循环在 startPhysics 时已启动，会持续模拟排斥 + 绘制
    return;
  }

  if (isDragging) {
    camera.value.x = startCameraX + e.clientX - startScreenX;
    camera.value.y = startCameraY + e.clientY - startScreenY;
    // 视口变化后重新计算召回目标（基于新视口）
    if (viewRecallAnchor && highlight) {
      bringRelatedIntoView(viewRecallAnchor);
      if (!physicsRunning) {
        physicsRunning = true;
        physicsRafId = requestAnimationFrame(physicsLoop(renderVersion));
      }
    }
    requestRedraw();
  }
};

const handleUp = () => {
  const releasedNode = clickNode; // 先捕获再清除
  isDragging = false;
  isNodeDragging = false;
  clickNode = null;
  dragChildOffsets = new Map();
  // 搜索激活时保持焦点效果：若临时点了其他节点，松手后恢复搜索焦点节点的效果
  if (searchActive && searchFocusedNode) {
    if (releasedNode && releasedNode !== searchFocusedNode) {
      // 恢复到搜索焦点节点（相机已在附近，居中动画几乎无位移）
      focusNode(searchFocusedNode);
    }
    releasePhysics();
    return;
  }
  clearHighlight();
  viewRecallAnchor = null;
  // 松手后名称 Tooltip 延迟淡出
  scheduleHideNameTip();
  // 松开后清除拖动上下文，节点在弹簧作用下回弹到 rest 位置，静止后自动停止
  releasePhysics();
};

const handleLeave = () => {
  isDragging = false;
  isNodeDragging = false;
  clickNode = null;
  dragChildOffsets = new Map();
  canScale = false;
  if (!searchActive) {
    clearHighlight();
    viewRecallAnchor = null;
    scheduleHideNameTip();
  } else if (searchFocusedNode) {
    // 搜索激活时移出画布：恢复焦点效果
    focusNode(searchFocusedNode);
  }
  releasePhysics();
};

const handleWheel = (e: WheelEvent) => {
  if (e.ctrlKey && canScale) {
    e.preventDefault();
    const mousePosX = e.clientX;
    const mousePosY = e.clientY;

    const canvas = canvasRef.value!;
    const rect = canvas.getBoundingClientRect();

    const mouseCanvasX = mousePosX - rect.left;
    const mouseCanvasY = mousePosY - rect.top;

    const worldPosX = (mouseCanvasX - camera.value.x) / camera.value.zoom;
    const worldPosY = (mouseCanvasY - camera.value.y) / camera.value.zoom;

    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    camera.value.zoom = Math.max(
      0.1,
      Math.min(10, camera.value.zoom * zoomFactor),
    );

    camera.value.x = mouseCanvasX - worldPosX * camera.value.zoom;
    camera.value.y = mouseCanvasY - worldPosY * camera.value.zoom;
    // 视口变化后重新计算召回目标（基于新缩放）
    if (viewRecallAnchor && highlight) {
      bringRelatedIntoView(viewRecallAnchor);
      // 确保物理循环在跑，把节点拉向新目标
      if (!physicsRunning) {
        physicsRunning = true;
        physicsRafId = requestAnimationFrame(physicsLoop(renderVersion));
      }
    }
    requestRedraw();
  }
};

// ---------- 节点链式蔓延动画 ----------
// 动画参数
const NODE_DURATION = 480; // 单个节点出场动画时长（ms）
const LINE_DURATION = 380; // 单条连线延伸动画时长（ms）

// 缓动函数
const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

// 动画状态：记录每个节点/连线的出场开始时间
const animState = {
  active: false,
  nodeStart: new Map<any, number>(),
  lineStart: new Map<any, number>(),
};

let animRunning = false;
let animRafId = 0;

// 停止动画并彻底清理状态（render 开头 / 卸载 / 切走时调用）
const stopAnimation = () => {
  if (animRafId) {
    cancelAnimationFrame(animRafId);
    animRafId = 0;
  }
  if (camAnimRafId) {
    cancelAnimationFrame(camAnimRafId);
    camAnimRafId = 0;
  }
  if (redrawRafId) {
    cancelAnimationFrame(redrawRafId);
    redrawRafId = 0;
    redrawPending = false;
  }
  stopPhysics();
  animRunning = false;
  animState.active = false;
  animState.nodeStart = new Map();
  animState.lineStart = new Map();
  // 重置高亮与蒙版
  highlight = null;
  mask.active = false;
  mask.fadingOut = false;
  searchActive = false;
  searchFocusedNode = null;
};

// 创建带版本校验的动画循环：版本过期（render 重建）则立即停止，避免残留绘制
const createAnimLoop = (myVersion: number) => () => {
  if (myVersion !== renderVersion) {
    animRunning = false;
    return;
  }
  draw();
  if (!animRunning) return;

  const now = performance.now();
  // 判断所有节点和连线是否都已完成
  let done = true;
  for (const start of animState.nodeStart.values()) {
    if (now - start < NODE_DURATION) {
      done = false;
      break;
    }
  }
  if (done) {
    for (const start of animState.lineStart.values()) {
      if (now - start < LINE_DURATION) {
        done = false;
        break;
      }
    }
  }
  if (done) {
    animRunning = false;
    animState.active = false;
    animRafId = 0;
    // 动画结束后初始化物理状态，为拖动排斥做准备
    initPhysics();
  } else {
    animRafId = requestAnimationFrame(createAnimLoop(myVersion));
  }
};

// 按布局放置顺序启动链式蔓延动画：
//   根节点弹出 → 根完成 → 连线延伸 → 线到达 → 子节点弹出 → 子节点完成 → 连线延伸 → ...
//   同一父节点的多个子分支并行生长（错开少许），不同分支也并行
const startAnimation = (order: any[], parentEdge: Map<any, any>) => {
  const now = performance.now();
  animState.nodeStart = new Map();
  animState.lineStart = new Map();

  if (order.length === 0) return;
  const root = order[0];

  // 构建每个节点的子边列表（BFS 树中它作为父节点发现的边）
  const childEdges = new Map<any, any[]>();
  order.forEach((node) => {
    const edge = parentEdge.get(node);
    if (!edge) return;
    const parent = edge.label === node ? edge.app : edge.label;
    if (!childEdges.has(parent)) childEdges.set(parent, []);
    childEdges.get(parent)!.push(edge);
  });

  // 节点完成时间 = 出场开始 + NODE_DURATION
  const nodeComplete = new Map<any, number>();
  animState.nodeStart.set(root, now);
  nodeComplete.set(root, now + NODE_DURATION);

  // 按 BFS 顺序计算：父节点完成后开始画子边，边画完子节点才出场
  const queue: any[] = [root];
  while (queue.length > 0) {
    const cur = queue.shift()!;
    const curComplete = nodeComplete.get(cur)!;
    const edges = childEdges.get(cur) || [];
    edges.forEach((edge, idx) => {
      const stagger = idx * 45; // 同父的多个子分支错开 45ms
      const lineStart = curComplete + 40 + stagger; // 父节点完成后 40ms 开始延伸连线
      animState.lineStart.set(edge, lineStart);
      const lineComplete = lineStart + LINE_DURATION;
      const child = edge.label === cur ? edge.app : edge.label;
      animState.nodeStart.set(child, lineComplete); // 连线到达，子节点才出场
      nodeComplete.set(child, lineComplete + NODE_DURATION);
      queue.push(child);
    });
  }

  // 非树边（共享 AppNode 连向其他 Label 的边）：两端节点都出场后再延伸
  connections.value.forEach((conn) => {
    if (animState.lineStart.has(conn)) return; // 树边已设置
    const lc = nodeComplete.get(conn.label);
    const ac = nodeComplete.get(conn.app);
    if (lc === undefined || ac === undefined) return;
    animState.lineStart.set(conn, Math.max(lc, ac) + 50);
  });

  animState.active = true;
  animRunning = true;
  animRafId = requestAnimationFrame(createAnimLoop(renderVersion));
};

// ---------- 绘制 ----------
const draw = () => {
  const canvas = canvasRef.value;
  const ctx2d = ctx.value;
  if (!canvas || !ctx2d) return;

  ctx2d.save();

  // 当前高亮状态（局部引用，避免 TS 收窄问题）
  const hl = highlight;

  // 清屏（也可使用 fillRect 填充基础背景色）
  ctx2d.setTransform(1, 0, 0, 1, 0, 0);
  ctx2d.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制背景（网格 + 渐变）
  drawBackground(ctx2d, canvas.width, canvas.height);

  // 设置世界变换
  ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx2d.translate(camera.value.x, camera.value.y);
  ctx2d.scale(camera.value.zoom, camera.value.zoom);

  // 绘制连线（带出场动画：从先出场端延伸到后出场端 + 淡入）
  // 第一遍：普通连线（高亮连线延后到蒙版之上绘制）
  for (const conn of connections.value) {
    // 高亮连线一律跳过第一遍，第二遍画在蒙版之上（避免被雾化变暗）
    if (hl && hl.lines.has(conn)) continue;
    const lineStart = animState.lineStart.get(conn);
    if (animState.active) {
      if (lineStart === undefined) continue; // 动画中未排程的连线不画
      const now = performance.now();
      if (now < lineStart) continue; // 未到绘制时间
      const rawP = Math.min(1, (now - lineStart) / LINE_DURATION);
      const p = easeOutCubic(rawP);
      const alpha = Math.min(1, rawP * 1.5);

      // 从先出场的节点端画向后出场节点端（直线延伸）
      const labelStart = animState.nodeStart.get(conn.label) ?? 0;
      const appStart = animState.nodeStart.get(conn.app) ?? 0;
      const fromFirst = labelStart <= appStart;
      const fx = fromFirst ? conn.label.x : conn.app.x;
      const fy = fromFirst ? conn.label.y : conn.app.y;
      const ex = fromFirst ? conn.app.x : conn.label.x;
      const ey = fromFirst ? conn.app.y : conn.label.y;
      const tx = fx + (ex - fx) * p;
      const ty = fy + (ey - fy) * p;

      ctx2d.save();
      ctx2d.globalAlpha = alpha;
      ctx2d.beginPath();
      ctx2d.moveTo(fx, fy);
      ctx2d.lineTo(tx, ty);
      ctx2d.strokeStyle = MAP_COLORS.lineNormalAnim;
      ctx2d.lineWidth = 1.2;
      ctx2d.stroke();
      ctx2d.restore();
    } else {
      // 静态连线：用视觉端点（物理拖动时丝滑插值跟随），无物理时即节点位置
      const lv = lineVisualMap.get(conn);
      const fx = lv ? lv.fx : conn.label.x;
      const fy = lv ? lv.fy : conn.label.y;
      const tx = lv ? lv.tx : conn.app.x;
      const ty = lv ? lv.ty : conn.app.y;
      conn.label.lineTo(ctx2d, conn.app, fx, fy, tx, ty);
    }
  }

  // 绘制节点（带出场动画：缩放 + 淡入）
  // 第一遍：普通节点（高亮节点延后到蒙版之上绘制）
  const glow = hl ? 0.5 + Math.sin(glowPhase) * 0.25 : 0;
  for (const node of nodes.value) {
    if (hl && hl.nodes.has(node)) continue; // 高亮节点第二遍画（蒙版之上）
    const nodeStart = animState.nodeStart.get(node);
    if (animState.active) {
      if (nodeStart === undefined) continue; // 动画中未排程的节点不画
      const now = performance.now();
      if (now < nodeStart) continue; // 未到出场时间
      const rawP = Math.min(1, (now - nodeStart) / NODE_DURATION);
      const p = easeOutBack(rawP);
      const alpha = Math.min(1, rawP * 1.8);
      const scale = Math.max(0.01, p);

      ctx2d.save();
      ctx2d.globalAlpha = alpha;
      // 以节点中心为缩放原点
      ctx2d.translate(node.x, node.y);
      ctx2d.scale(scale, scale);
      ctx2d.translate(-node.x, -node.y);
      applyNodeGlow(ctx2d, node, glow);
      if (node instanceof AppNode) {
        node.draw(ctx2d);
      } else if (node instanceof LabelNode) {
        node.draw(ctx2d);
      }
      ctx2d.restore();
    } else {
      ctx2d.save();
      applyNodeGlow(ctx2d, node, glow);
      if (node instanceof AppNode) {
        node.draw(ctx2d);
      } else if (node instanceof LabelNode) {
        node.draw(ctx2d);
      }
      ctx2d.restore();
    }
  }

  // ---------- 蒙版层（屏幕空间）：压暗普通内容，让高亮内容浮于其上 ----------
  const maskAlpha = getMaskAlpha();
  if (maskAlpha > 0.001) {
    ctx2d.save();
    // 切回屏幕空间画蒙版（不受缩放/平移影响）
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    const container = containerRef.value;
    ctx2d.fillStyle = `rgba(${MAP_COLORS.maskRgb},${maskAlpha})`;
    ctx2d.fillRect(
      0,
      0,
      container ? container.clientWidth : canvas.width,
      container ? container.clientHeight : canvas.height,
    );
    ctx2d.restore();
    // 恢复世界变换继续绘制上层内容
    ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx2d.translate(camera.value.x, camera.value.y);
    ctx2d.scale(camera.value.zoom, camera.value.zoom);
  }

  // 第二遍：高亮连线 + 高亮节点（品牌浅青色 + 柔和呼吸光，始终浮于蒙版之上）
  if (hl) {
    const glowNow = 0.5 + Math.sin(glowPhase) * 0.25;
    hl.lines.forEach((conn) => {
      // 出场动画中：该连线未开始绘制则先不显示
      if (animState.active) {
        const ls = animState.lineStart.get(conn);
        if (ls === undefined || performance.now() < ls) return;
      }
      const lv = lineVisualMap.get(conn);
      const fx = lv ? lv.fx : conn.label.x;
      const fy = lv ? lv.fy : conn.label.y;
      const tx = lv ? lv.tx : conn.app.x;
      const ty = lv ? lv.ty : conn.app.y;
      ctx2d.save();
      if (MAP_OPTIONS.glowEnabled) {
        ctx2d.shadowColor = `rgba(${MAP_COLORS.glowLight},${0.4 + glowNow * 0.35})`;
        ctx2d.shadowBlur = 8 + glowNow * 6;
      }
      ctx2d.beginPath();
      ctx2d.moveTo(fx, fy);
      ctx2d.lineTo(tx, ty);
      ctx2d.strokeStyle = `rgba(${MAP_COLORS.glowBase},${0.55 + glowNow * 0.3})`;
      ctx2d.lineWidth = 1.8;
      ctx2d.stroke();
      ctx2d.restore();
    });

    // 第二遍：高亮节点（本体辉光，浮于蒙版之上）
    hl.nodes.forEach((node) => {
      // 遵守出场动画时序
      let animScale = 1;
      let animAlpha = 1;
      if (animState.active) {
        const ns = animState.nodeStart.get(node);
        if (ns === undefined) return; // 未排程不画
        const now = performance.now();
        if (now < ns) return; // 未到出场时间
        const rawP = Math.min(1, (now - ns) / NODE_DURATION);
        animScale = Math.max(0.01, easeOutBack(rawP));
        animAlpha = Math.min(1, rawP * 1.8);
      }
      ctx2d.save();
      ctx2d.globalAlpha = animAlpha;
      // 以节点中心为缩放原点（保持出场动画的缩放表现）
      ctx2d.translate(node.x, node.y);
      ctx2d.scale(animScale, animScale);
      ctx2d.translate(-node.x, -node.y);
      applyNodeGlow(ctx2d, node, glowNow);
      if (node instanceof AppNode) {
        node.draw(ctx2d, true); // 激活态：更亮更鲜艳
      } else if (node instanceof LabelNode) {
        node.draw(ctx2d, true);
      }
      ctx2d.restore();
    });
  }

  // 呼吸/蒙版动画期间持续重绘
  if (hl || mask.fadingOut || (mask.active && maskAlpha < MASK_ALPHA)) {
    glowPhase += 0.05;
    requestRedraw();
  }

  // 绘制 AppNode 名称 Tooltip（最上层，发光 + 上浮淡入动画）
  const tipVisible = drawNameTip(ctx2d);
  if (tipVisible && !animState.active) {
    // Tooltip 入场/呼吸/淡出期间持续重绘（出场动画循环会自行驱动）
    requestRedraw();
  }

  ctx2d.restore();
};

// 高亮节点辉光：shadow 沿节点轮廓向外溢光（节点本体泛光，非外圈描边）
const applyNodeGlow = (
  ctx2d: CanvasRenderingContext2D,
  node: any,
  glow: number,
) => {
  if (!MAP_OPTIONS.glowEnabled) return; // 光晕总开关
  if (!highlight || !highlight.nodes.has(node)) return;
  ctx2d.shadowColor = `rgba(${MAP_COLORS.glowLight},${0.5 + glow * 0.4})`;
  ctx2d.shadowBlur = 16 + glow * 10;
};

/**
 * 绘制背景：径向渐变 + 网格点阵
 */
const drawBackground = (
  ctx2d: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
) => {
  // 1. 基础底色
  ctx2d.fillStyle = MAP_COLORS.bgBase;
  ctx2d.fillRect(0, 0, canvasWidth, canvasHeight);

  // 2. 径向渐变（中心略亮，边缘稍暗，营造空间感）
  const gradient = ctx2d.createRadialGradient(
    canvasWidth,
    canvasHeight,
    0,
    canvasWidth,
    canvasHeight,
    Math.max(canvasWidth, canvasHeight) * 0.7,
  );

  ctx2d.fillStyle = gradient;
  ctx2d.fillRect(0, 0, canvasWidth, canvasHeight);

  // 3. 网格点阵（世界坐标网格，间距 50 世界单位）
  const gridSize = 50 * camera.value.zoom; // 屏幕上的网格间距
  const offsetX = camera.value.x % gridSize;
  const offsetY = camera.value.y % gridSize;

  ctx2d.fillStyle = MAP_COLORS.bgDotGrid;
  const dotRadius = Math.max(1, camera.value.zoom * 0.8); // 点的大小随缩放变化

  for (let x = offsetX; x <= canvasWidth; x += gridSize) {
    for (let y = offsetY; y <= canvasHeight; y += gridSize) {
      ctx2d.beginPath();
      ctx2d.arc(x, y, dotRadius, 0, Math.PI * 2);
      ctx2d.fill();
    }
  }

  // 4. 可选：绘制淡色线条网格（间隔较大，如 200 世界单位）
  const lineGridSize = 200 * camera.value.zoom;
  const lineOffsetX = camera.value.x % lineGridSize;
  const lineOffsetY = camera.value.y % lineGridSize;

  ctx2d.strokeStyle = MAP_COLORS.bgLineGrid;
  ctx2d.lineWidth = 1;

  ctx2d.beginPath();
  for (let x = lineOffsetX; x <= canvasWidth; x += lineGridSize) {
    ctx2d.moveTo(x, 0);
    ctx2d.lineTo(x, canvasHeight);
  }
  for (let y = lineOffsetY; y <= canvasHeight; y += lineGridSize) {
    ctx2d.moveTo(0, y);
    ctx2d.lineTo(canvasWidth, y);
  }
  ctx2d.stroke();
};
// ---------- 初始化 ----------
const init = () => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (!canvas || !container) return;

  canvas.width = container.clientWidth * dpr;
  canvas.height = container.clientHeight * dpr;
  canvas.style.width = container.clientWidth + 'px';
  canvas.style.height = container.clientHeight + 'px';
  ctx.value = canvas.getContext('2d');

  // 设置初始相机，使视口中心对准画布原点（第一个 Label 所在位置）
  camera.value = {
    x: container.clientWidth / 2,
    y: container.clientHeight / 2,
    zoom: 0.7,
  };

  draw();
};

onMounted(() => {
  init();
  render();

  const container = containerRef.value;
  if (container) {
    const observer = new ResizeObserver(() => {
      // 只更新画布尺寸和重绘，不重置相机位置
      const canvas = canvasRef.value;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth * dpr;
      canvas.height = container.clientHeight * dpr;
      canvas.style.width = container.clientWidth + 'px';
      canvas.style.height = container.clientHeight + 'px';
      requestRedraw();
    });
    observer.observe(container);
  }

  window.addEventListener('resize', () => {
    const container = containerRef.value;
    const canvas = canvasRef.value;
    if (!canvas || !container) return;
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    canvas.style.width = container.clientWidth + 'px';
    canvas.style.height = container.clientHeight + 'px';
    requestRedraw();
  });
});

// keep-alive 场景：路由切回时重新播放生成动画
onActivated(() => {
  const canvas = canvasRef.value;
  const container = containerRef.value;
  if (canvas && container && ctx.value) {
    // 画布尺寸可能变化，重新校准
    canvas.width = container.clientWidth * dpr;
    canvas.height = container.clientHeight * dpr;
    canvas.style.width = container.clientWidth + 'px';
    canvas.style.height = container.clientHeight + 'px';
    render();
  }
});

// keep-alive 场景：路由切走时停止动画，避免后台残留 RAF 继续绘制
onDeactivated(() => {
  stopAnimation();
});

onUnmounted(() => {
  stopAnimation();
});

// 供父组件调用：重新随机生成布局并重播链式生长动画
defineExpose({
  regenerate: () => render(),
});
</script>

<style scoped lang="scss">
.app-graph {
  width: 100%;
  flex: 1;
  min-height: 0; /* 允许在 flex 列容器中收缩，canvas 尺寸由 ResizeObserver 跟随 */
  border-bottom-left-radius: var(--ao-border-radius-lg);
  border-bottom-right-radius: var(--ao-border-radius-lg);
}

canvas {
  background-color: transparent; /* 背景由 draw 函数绘制 */
  cursor: pointer;
}
</style>
