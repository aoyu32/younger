import { MAP_COLORS } from './colors';

export class AppNode {
  size: number;
  x: number;
  y: number;
  img: HTMLImageElement; // 缓存图片
  name: string;

  constructor(
    img: HTMLImageElement,
    name: string,
    x: number,
    y: number,
    size: number = 40,
  ) {
    ((this.img = img),
      (this.x = x),
      (this.y = y),
      (this.size = size),
      (this.name = name));
  }

  getCenter() {
    return {
      appCenterX: this.x,
      appCenterY: this.y,
    };
  }

  contains(px: number, py: number, ctx: CanvasRenderingContext2D) {
    const padding = 10;
    const bgSize = this.size + padding * 2;
    const bgX = this.x - bgSize / 2;
    const bgY = this.y - bgSize / 2;
    return px >= bgX && px <= bgX + bgSize && py >= bgY && py <= bgY + bgSize;
  }

  draw(ctx: CanvasRenderingContext2D, highlighted: boolean = false) {
    const padding = 10;
    const bgSize = this.size + padding * 2;

    const bgX = this.x - bgSize / 2;
    const bgY = this.y - bgSize / 2;

    const imgX = this.x - this.size / 2;
    const imgY = this.y - this.size / 2;

    ctx.beginPath();
    ctx.roundRect(bgX, bgY, bgSize, bgSize, 10);
    // 激活时卡片更亮（浅青白）并加品牌青描边
    ctx.fillStyle = highlighted ? MAP_COLORS.activeAppBg : MAP_COLORS.appBg;
    ctx.fill();
    if (highlighted) {
      ctx.strokeStyle = MAP_COLORS.activeAppBorder;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.drawImage(this.img, imgX, imgY, this.size, this.size);
  }
}
