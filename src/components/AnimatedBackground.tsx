'use client';

import { useEffect, useRef, useCallback } from 'react';

interface AnimatedBackgroundProps {
  opacity?: number;
  speed?: number;
}

export default function AnimatedBackground({ opacity = 0.2, speed = 1 }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  const draw = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const W = canvas.width;
    const H = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    // Particles state (lazy init via closure)
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    // Draw an n-pointed star polygon
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

    // Draw Islamic geometric rosette (overlapping squares/polygons)
    function drawRosette(x: number, y: number, radius: number, rotation: number, sides: number) {
      const count = sides;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + rotation;
        ctx.beginPath();
        // Draw a rotated square
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

    function frame(timestamp: number) {
      if (!startTime) startTime = timestamp;
      const elapsed = ((timestamp - startTime) / 1000) * speed;

      ctx.clearRect(0, 0, W, H);

      // --- Islamic geometric patterns ---

      // Large central 12-fold rosette (very slow rotation)
      ctx.strokeStyle = `rgba(201, 162, 39, 0.12)`;
      ctx.lineWidth = 1;
      drawRosette(cx, cy, Math.min(W, H) * 0.3, elapsed * 0.05, 12);

      // 8-pointed star center
      ctx.strokeStyle = `rgba(201, 162, 39, 0.15)`;
      ctx.lineWidth = 0.8;
      drawStar(cx, cy, 8, Math.min(W, H) * 0.18, Math.min(W, H) * 0.09, elapsed * -0.03);
      ctx.stroke();

      // Secondary smaller rosettes at corners (8-fold)
      const offsets = [
        { x: W * 0.15, y: H * 0.2 },
        { x: W * 0.85, y: H * 0.2 },
        { x: W * 0.15, y: H * 0.8 },
        { x: W * 0.85, y: H * 0.8 },
        { x: W * 0.5, y: H * 0.15 },
        { x: W * 0.5, y: H * 0.85 },
      ];

      ctx.strokeStyle = `rgba(26, 107, 107, 0.1)`;
      ctx.lineWidth = 0.6;
      offsets.forEach((o, i) => {
        const r = Math.min(W, H) * 0.1;
        const rot = elapsed * (i % 2 === 0 ? 0.04 : -0.04) + (i * Math.PI) / 3;
        drawRosette(o.x, o.y, r, rot, 8);
      });

      // Connecting arcs between rosettes (arabesques)
      ctx.strokeStyle = `rgba(201, 162, 39, 0.06)`;
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

      // Inner concentric 12-pointed star (slow opposite rotation)
      ctx.strokeStyle = `rgba(26, 107, 107, 0.08)`;
      ctx.lineWidth = 0.7;
      drawStar(cx, cy, 12, Math.min(W, H) * 0.12, Math.min(W, H) * 0.06, elapsed * 0.07);
      ctx.stroke();

      // --- Floating light particles ---
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        // Pulsing alpha
        const pulse = Math.sin(elapsed * 0.5 + p.x * 0.01) * 0.15;
        const a = Math.max(0, Math.min(1, p.alpha + pulse));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${a * 0.4})`;
        ctx.fill();
      });

      animFrameRef.current = requestAnimationFrame(frame);
    }

    animFrameRef.current = requestAnimationFrame(frame);
  }, [speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
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
