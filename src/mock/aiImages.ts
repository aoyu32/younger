/**
 * 全站 AI 主题图片池
 * 所有模块统一从这里取图，避免出现与 AI / AIGC 无关的随机风景图。
 */
import aiBrain from '@/assets/ai/ai-brain.jpg';
import aiPhone from '@/assets/ai/ai-phone.jpg';
import robotReading from '@/assets/ai/robot-reading.jpg';
import reactCode from '@/assets/ai/react-code.jpg';
import codeNeon from '@/assets/ai/code-neon.jpg';
import matrixCode from '@/assets/ai/matrix-code.jpg';
import aiDashboard from '@/assets/ai/ai-dashboard.jpg';
import aiLab from '@/assets/ai/ai-lab.jpg';
import robotAssistant from '@/assets/ai/robot-assistant.jpg';
import humanoidRobot from '@/assets/ai/humanoid-robot.jpg';
import circuitBoard from '@/assets/ai/circuit-board.jpg';
import dataCenter from '@/assets/ai/data-center.jpg';
import globalNetwork from '@/assets/ai/global-network.jpg';
import generativeArt from '@/assets/ai/generative-art.jpg';
import aiChip from '@/assets/ai/ai-chip.jpg';
import vrHeadset from '@/assets/ai/vr-headset.jpg';
import neuralAbstract from '@/assets/ai/neural-abstract.jpg';

export const aiImages = {
  aiBrain,
  aiPhone,
  robotReading,
  reactCode,
  codeNeon,
  matrixCode,
  aiDashboard,
  aiLab,
  robotAssistant,
  humanoidRobot,
  circuitBoard,
  dataCenter,
  globalNetwork,
  generativeArt,
  aiChip,
  vrHeadset,
  neuralAbstract,
};

/** 按顺序轮播使用，适合视频封面 / 资讯封面等批量场景 */
export const aiImagePool = Object.values(aiImages);

/** 视频封面：同一批资源按 id 稳定映射，刷新后不会跳图 */
export const coverFor = (id: number) => aiImagePool[id % aiImagePool.length];
