import { onBeforeUnmount, onMounted, type Ref } from 'vue';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  age: number;
  life: number;
}

/** 发射时长，和进场动画（0.4s）对齐 */
const EMIT_DURATION = 420;

/**
 * 出现时的粒子拖尾
 *
 * 消息顶部铺一层 canvas：进场时从消息上沿不断抛出粒子，
 * 消息整体往下落、粒子相对往上飘，屏幕上看起来就是一条被甩在后面的拖尾。
 */
export function useParticles(
  canvasRef: Ref<HTMLCanvasElement | null>,
  getColor: () => string,
): void {
  let frame = 0;
  let last = 0;
  let width = 0;
  let height = 0;
  let emitTime = 0;
  const particles: Particle[] = [];

  function measure(canvas: HTMLCanvasElement): void {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function spawn(): void {
    // 横向范围就是消息本体，左右各留 28px 给 canvas 的溢出区域
    const x = 28 + Math.random() * Math.max(width - 56, 1);
    // 越靠边越往外飘
    const spread = (x - width / 2) / Math.max(width / 2, 1);
    particles.push({
      x,
      // 在消息上沿上方一段高度内铺开，往下落，拖尾更长
      y: 30 + Math.random() * 26,
      vx: spread * (0.3 + Math.random() * 0.5),
      vy: 0.45 + Math.random() * 0.55,
      size: 0.8 + Math.random() * 1,
      age: 0,
      life: 560 + Math.random() * 240,
    });
  }

  function draw(now: number): void {
    const canvas = canvasRef.value;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dt = last ? Math.min(now - last, 32) : 16;
    last = now;
    emitTime += dt;

    ctx.clearRect(0, 0, width, height);

    // 发射：进场初期最密，之后逐渐减少
    if (emitTime < EMIT_DURATION && particles.length < 260) {
      const strength = 1 - emitTime / EMIT_DURATION;
      const count = Math.round(2 + strength * 2);
      for (let i = 0; i < count; i++) spawn();
    }
    ctx.fillStyle = getColor();
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.age += dt;
      if (p.age >= p.life) {
        particles.splice(i, 1);
        continue;
      }
      p.x += p.vx;
      p.y += p.vy;
      // 轻微重力，越落越快
      p.vy = Math.min(p.vy + 0.012, 2.4);

      const left = 1 - p.age / p.life;
      ctx.globalAlpha = Math.pow(left, 1.5) * 0.9;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (0.4 + left * 0.6), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    if (emitTime < EMIT_DURATION || particles.length) {
      frame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  }

  onMounted(() => {
    const canvas = canvasRef.value;
    if (!canvas) return;

    measure(canvas);
    frame = requestAnimationFrame(draw);
  });

  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
  });
}
