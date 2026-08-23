export const MAP_COLORS = {
  // ---------- 高亮辉光（品牌浅青） ----------
  glowLight: '0,181,181', // ao-lime-6 主品牌色：shadowColor 光晕主体
  glowBase: '0,159,167', // ao-lime-5：高亮线条/文字主色，比 glowLight 深一档

  // ---------- 连线 ----------
  lineNormal: 'rgba(203, 209, 219, 0.7)',
  lineNormalAnim: 'rgba(203, 209, 219, 0.35)',

  // ---------- 高亮蒙版 ----------
  maskRgb: '71,85,105', // slate-600，比 30,41,59 浅两档，配合同样的透明度会明显更"透"

  // ---------- 背景 ----------
  bgBase: '#ffffff00',
  bgDotGrid: 'rgba(148, 163, 184, 0.25)',
  bgLineGrid: 'rgba(148, 163, 184, 0.10)',

  // ---------- 节点 ----------
  labelBg: '#454545',
  labelText: '#ffffff',
  appBg: '#dbecffca', // 明显深于背景的浅灰蓝，对比度拉开

  // ---------- 激活态配色（比未激活更亮更鲜艳，与蒙版下的内容形成对比） ----------
  activeLabelBg: '#00a5ad', // 激活 Label 背景：品牌青，醒目
  activeLabelText: '#ffffff', // 激活 Label 文字
  activeAppBg: '#e8fbfd', // 激活 AppNode 卡片：浅青白
  activeAppBorder: 'rgba(0,181,181,0.6)', // 激活 AppNode 卡片描边：品牌青
};

// ============================================================
// app-map 效果开关配置
// ============================================================
export const MAP_OPTIONS = {
  glowEnabled: false, // 是否开启光晕：控制高亮节点辉光、连线光晕、名称文字发光
};
