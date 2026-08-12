<template>
  <div class="vip-background">
    <canvas ref="canvasRef" id="vip-bg"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let animFrameId = 0;

const GOLD_COLORS = [
  '#FFD700', '#FFC125', '#DAA520', '#F0E68C',
  '#FFF8DC', '#FFEC8B', '#E6C200', '#C5A028',
  '#B8860B', '#F5DEB3', '#FFE4B5', '#FFDEAD',
];
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  opacity: number;
  life: number;
  maxLife: number;
  phase: number;
  amplitude: number;
  frequency: number;
  glow: boolean;
}

let particles: Particle[] = [];
let ctx: CanvasRenderingContext2D | null = null;
let W = 0;
let H = 0;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createParticle(y?: number): Particle {
  const radius = random(0.8, 3.5);
  const isGlow = Math.random() < 0.08;
  return {
    x: random(0, W),
    y: y ?? random(H * 0.7, H),
    vx: 0,
    vy: random(-1.8, -0.3),
    radius,
    baseRadius: radius,
    color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
    opacity: random(0.2, 0.85),
    life: 0,
    maxLife: random(300, 800),
    phase: random(0, Math.PI * 2),
    amplitude: random(0.3, 1.5),
    frequency: random(0.005, 0.02),
    glow: isGlow,
  };
}

function init() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  ctx = canvas.getContext('2d');
  resize();
  particles = Array.from({ length: 180 }, () => createParticle());
}

function resize() {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const dpr = window.devicePixelRatio || 1;
  W = window.innerWidth;
  H = window.innerHeight;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width = `${W}px`;
  canvas.style.height = `${H}px`;
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawParticle(p: Particle) {
  if (!ctx) return;
  const lifeRatio = p.life / p.maxLife;
  let alpha = p.opacity;
  if (lifeRatio < 0.1) alpha *= lifeRatio / 0.1;
  else if (lifeRatio > 0.8) alpha *= (1 - lifeRatio) / 0.2;

  ctx.save();
  ctx.globalAlpha = alpha;

  if (p.glow) {
    const glowRadius = p.baseRadius * 3 + Math.sin(p.life * 0.1) * 2;
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRadius);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(0.4, p.color);
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.beginPath();
    ctx.arc(p.x, p.y, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fillStyle = p.color;
  ctx.fill();

  if (p.glow) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFEF0';
    ctx.fill();
  }

  ctx.restore();
}

function updateParticle(p: Particle) {
  p.life++;
  const lifeRatio = p.life / p.maxLife;

  p.vx = Math.sin(p.life * p.frequency + p.phase) * p.amplitude;
  p.vy = -random(0.3, 1.8) * (1 - lifeRatio * 0.4);

  p.x += p.vx;
  p.y += p.vy;

  const waveLine = Math.sin(p.x * 0.008 + p.life * 0.01) * 8;
  p.y += waveLine * 0.04;

  p.radius = p.baseRadius + Math.sin(p.life * 0.08) * 0.3;

  if (p.y < -20 || p.life >= p.maxLife || p.x < -20 || p.x > W + 20) {
    Object.assign(p, createParticle(H + 20));
    p.life = 0;
  }
}

function drawConnections() {
  if (!ctx) return;
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / maxDist) * 0.06;
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animate() {
  if (!ctx) return;
  ctx.clearRect(0, 0, W, H);

  drawConnections();

  for (const p of particles) {
    updateParticle(p);
    drawParticle(p);
  }

  animFrameId = requestAnimationFrame(animate);
}

let resizeTimer: ReturnType<typeof setTimeout>;
function onResize() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(resize, 150);
}

onMounted(() => {
  init();
  animate();
  window.addEventListener('resize', onResize);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animFrameId);
  window.removeEventListener('resize', onResize);
});
</script>

<style scoped lang="scss">
.vip-background {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}

canvas {
  width: 100%;
  height: 100%;
  background:
    radial-gradient(
      ellipse at 50% 90%,
      rgba(180, 140, 30, 0.25) 0%,
      transparent 60%
    ),
    linear-gradient(
      to top,
      rgba(20, 40, 45, 1) 0%,
      rgba(0, 48, 60, 0.92) 30%,
      rgba(0, 60, 75, 0.9) 50%,
      rgba(0, 85, 105, 0.88) 65%,
      rgba(0, 115, 140, 0.9) 80%,
      var(--ao-lime-5) 95%,
      var(--ao-color-primary) 100%
    );
}
</style>
