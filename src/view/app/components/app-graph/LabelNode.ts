import { AppNode } from './AppNode';
import { MAP_COLORS } from './colors';
export class LabelNode {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  padding: number;
  bgColor: string;
  textColor: string;
  borderRadius: number;
  fontFamily: string;

  constructor(
    text: string,
    x: number,
    y: number,
    fontSize: number = 14,
    padding: number = 10,
    bgColor: string = MAP_COLORS.labelBg,
    textColor: string = MAP_COLORS.labelText,
    borderRadius: number = 8,
    fontFamily: string = 'Arial, sans-serif',
  ) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.fontSize = fontSize;
    this.padding = padding;
    this.bgColor = bgColor;
    this.textColor = textColor;
    this.borderRadius = borderRadius;
    this.fontFamily = fontFamily;
  }

  getCenter() {
    return {
      labelCenterX: this.x,
      labelCenterY: this.y,
    };
  }

  contains(px: number, py: number, ctx: CanvasRenderingContext2D): boolean {
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    const metrics = ctx.measureText(this.text);
    const textWidth = metrics.width;
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
    const bgWidth = textWidth + this.padding * 2;
    const bgHeight = textHeight + this.padding * 2;
    const bgX = this.x - bgWidth / 2;
    const bgY = this.y - bgHeight / 2;
    return (
      px >= bgX && px <= bgX + bgWidth && py >= bgY && py <= bgY + bgHeight
    );
  }

  draw(ctx: CanvasRenderingContext2D, highlighted: boolean = false) {
    ctx.font = `${this.fontSize}px ${this.fontFamily}`;
    const metrics = ctx.measureText(this.text);
    const textWidth = metrics.width;
    const textHeight =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const bgWidth = textWidth + this.padding * 2;
    const bgHeight = textHeight + this.padding * 2;
    const bgX = this.x - bgWidth / 2;
    const bgY = this.y - bgHeight / 2;

    // 背景（激活时使用更亮更鲜艳的配色）
    ctx.beginPath();
    ctx.roundRect(bgX, bgY, bgWidth, bgHeight, this.borderRadius);
    ctx.fillStyle = highlighted
      ? MAP_COLORS.activeLabelBg
      : this.bgColor;
    ctx.fill();

    const baselineY =
      this.y +
      (metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2;
    ctx.fillStyle = highlighted
      ? MAP_COLORS.activeLabelText
      : this.textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(this.text, this.x, baselineY);
  }

  lineTo(ctx: CanvasRenderingContext2D, targetNode: AppNode, fromX?: number, fromY?: number, toX?: number, toY?: number) {
    const { appCenterX, appCenterY } = targetNode.getCenter();
    const { labelCenterX, labelCenterY } = this.getCenter();
    const fx = fromX ?? labelCenterX;
    const fy = fromY ?? labelCenterY;
    const tx = toX ?? appCenterX;
    const ty = toY ?? appCenterY;
    ctx.beginPath();
    ctx.moveTo(fx, fy);
    ctx.lineTo(tx, ty);
    ctx.strokeStyle = MAP_COLORS.lineNormal;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}
