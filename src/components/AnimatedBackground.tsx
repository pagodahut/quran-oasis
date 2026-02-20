'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AnimatedBackgroundProps {
  opacity?: number;
  speed?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  layer: 0 | 1 | 2; // 0=far, 1=mid, 2=near
  shape: 'circle' | 'crescent';
  hue: number; // 0=gold, 1=teal
  phase: number;
}

export default function AnimatedBackground({ opacity = 0.2, speed = 1 }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    const isMobile = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) <= 4 : false;
    const isLowEnd = isMobile && (typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency || 4) <= 2 : false);

    let W = canvas.width;
    let H = canvas.height;
    const cx = () => W / (2 * dpr);
    const cy = () => H / (2 * dpr);

    // Particle counts based on device capability
    const maxParticles = isMobile ? 25 : 60;
    const particles: Particle[] = [];

    const layerSpeeds = [0.15, 0.35, 0.7]; // far, mid, near
    const layerSizes = [
      [0.5, 1.5],   // far: small
      [1, 3],       // mid
      [2, 5],       // near: large
    ];
    const layerAlphas = [0.08, 0.2, 0.4];

    for (let i = 0; i < maxParticles; i++) {
      const layer = (i % 3) as 0 | 1 | 2;
      const [minS, maxS] = layerSizes[layer];
      const isCrescent = Math.random() < 0.15; // 15% crescent shapes
      particles.push({
        x: Math.random() * (W / dpr),
        y: Math.random() * (H / dpr),
        vx: (Math.random() - 0.5) * layerSpeeds[layer],
        vy: (Math.random() - 0.5) * layerSpeeds[layer],
        size: Math.random() * (maxS - minS) + minS,
        alpha: Math.random() * layerAlphas[layer] + 0.05,
        layer,
        shape: isCrescent ? 'crescent' : 'circle',
        hue: Math.random() < 0.7 ? 0 : 1, // 70% gold, 30% teal
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Colors
    const gold = { r: 201, g: 162, b: 39 };
    const teal = { r: 26, g: 107, b: 107 };

    function lerpColor(t: number): { r: number; g: number; b: number } {
      return {
        r: gold.r + (teal.r - gold.r) * t,
        g: gold.g + (teal.g - gold.g) * t,
        b: gold.b + (teal.b - gold.b) * t,
      };
    }

    function drawCrescent(x: number, y: number, size: number) {
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      // Cut out inner circle offset to create crescent
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x + size * 0.4, y - size * 0.2, size * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawStar(x: number, y: number, n: number, outerR: number, innerR: number, rotation: number) {
      ctx.beginPath();
      for (let i = 0; i < n * 2; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI * i) / n + rotation;
        const px = x + r * Math.cos(angle);
        const py = y + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    }

    function drawRosette(x: number, y: number, radius: number, rotation: number, sides: number) {
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides + rotation;
        ctx.beginPath();
        for (let j = 0; j < 4; j++) {
          const a = angle + (Math.PI * j) / 2;
          const px = x + radius * Math.cos(a);
          const py = y + radius * Math.sin(a);
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }
    }

    let startTime: number | null = null;
    let frameCount = 0;
    const skipFrames = isLowEnd ? 2 : 0; // Skip every N frames on low-end

    function frame(timestamp: number) {
      if (!startTime) startTime = timestamp;
      frameCount++;

      // Frame skipping for low-end devices
      if (skipFrames > 0 && frameCount % (skipFrames + 1) !== 0) {
        animFrameRef.current = requestAnimationFrame(frame);
        return;
      }

      const elapsed = ((timestamp - startTime) / 1000) * speed;
      const cxVal = cx();
      const cyVal = cy();
      const minDim = Math.min(W / dpr, H / dpr);

      ctx.clearRect(0, 0, W, H);
      ctx.save();
      ctx.scale(dpr, dpr);

      // === Radial glow pulse from center ===
      const glowPulse = 0.03 + Math.sin(elapsed * 0.3) * 0.015;
      const glowGrad = ctx.createRadialGradient(cxVal, cyVal, 0, cxVal, cyVal, minDim * 0.5);
      glowGrad.addColorStop(0, `rgba(201, 162, 39, ${glowPulse})`);
      glowGrad.addColorStop(0.5, `rgba(26, 107, 107, ${glowPulse * 0.5})`);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W / dpr, H / dpr);

      // === Color transition time ===
      const colorT = (Math.sin(elapsed * 0.08) + 1) / 2; // 0-1 smooth oscillation
      const blendColor = lerpColor(colorT);

      // === Islamic geometric patterns ===
      // Large central 12-fold rosette
      ctx.strokeStyle = `rgba(${blendColor.r}, ${blendColor.g}, ${blendColor.b}, 0.10)`;
      ctx.lineWidth = 1;
      drawRosette(cxVal, cyVal, minDim * 0.3, elapsed * 0.05, 12);

      // 8-pointed star center
      ctx.strokeStyle = `rgba(201, 162, 39, 0.12)`;
      ctx.lineWidth = 0.8;
      drawStar(cxVal, cyVal, 8, minDim * 0.18, minDim * 0.09, elapsed * -0.03);
      ctx.stroke();

      // Secondary smaller rosettes
      const offsets = [
        { x: (W / dpr) * 0.15, y: (H / dpr) * 0.2 },
        { x: (W / dpr) * 0.85, y: (H / dpr) * 0.2 },
        { x: (W / dpr) * 0.15, y: (H / dpr) * 0.8 },
        { x: (W / dpr) * 0.85, y: (H / dpr) * 0.8 },
        { x: (W / dpr) * 0.5, y: (H / dpr) * 0.15 },
        { x: (W / dpr) * 0.5, y: (H / dpr) * 0.85 },
      ];

      ctx.strokeStyle = `rgba(26, 107, 107, 0.07)`;
      ctx.lineWidth = 0.6;
      offsets.forEach((o, i) => {
        const r = minDim * 0.1;
        const rot = elapsed * (i % 2 === 0 ? 0.04 : -0.04) + (i * Math.PI) / 3;
        drawRosette(o.x, o.y, r, rot, 8);
      });

      // Connecting arabesques
      ctx.strokeStyle = `rgba(${blendColor.r}, ${blendColor.g}, ${blendColor.b}, 0.05)`;
      ctx.lineWidth = 0.5;
      for (let i = 0; i < offsets.length; i++) {
        const a = offsets[i];
        const b = offsets[(i + 1) % offsets.length];
        const midX = (a.x + b.x) / 2;
        const midY = (a.y + b.y) / 2;
        const bulge = Math.sin(elapsed * 0.1 + i) * 30;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo(midX + bulge, midY - bulge, b.x, b.y);
        ctx.stroke();
      }

      // Inner 12-pointed star
      ctx.strokeStyle = `rgba(26, 107, 107, 0.06)`;
      ctx.lineWidth = 0.7;
      drawStar(cxVal, cyVal, 12, minDim * 0.12, minDim * 0.06, elapsed * 0.07);
      ctx.stroke();

      // === Particles by depth layer ===
      for (let layer = 0; layer < 3; layer++) {
        particles.forEach((p) => {
          if (p.layer !== layer) return;

          p.x += p.vx;
          p.y += p.vy;

          // Wrap
          const w = W / dpr;
          const h = H / dpr;
          if (p.x < -10) p.x = w + 10;
          if (p.x > w + 10) p.x = -10;
          if (p.y < -10) p.y = h + 10;
          if (p.y > h + 10) p.y = -10;

          // Pulsing alpha
          const pulse = Math.sin(elapsed * 0.4 + p.phase) * 0.15;
          const a = Math.max(0, Math.min(1, p.alpha + pulse));

          const c = p.hue === 0 ? gold : teal;
          ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;

          if (p.shape === 'crescent' && p.size > 2) {
            drawCrescent(p.x, p.y, p.size);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(frame);
    }

    animFrameRef.current = requestAnimationFrame(frame);
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }

    resize();
    window.addEventListener('resize', resize);
    draw(canvas, ctx);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity,
        willChange: 'transform',
      }}
    />
  );
}
