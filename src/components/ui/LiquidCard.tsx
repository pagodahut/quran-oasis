'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   LiquidCard — Glass card with:
   • Deep backdrop-blur + saturation
   • SVG noise grain texture
   • Top prismatic highlight
   • Ambient gold glow option
   • Multi-layer depth shadows
   ─────────────────────────────────────────────── */

const NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface LiquidCardProps extends HTMLMotionProps<'div'> {
  children?: ReactNode;
  /** Warm amber glow mode */
  glow?: boolean;
  /** Hover lift + shadow animation */
  interactive?: boolean;
  /** Suppress noise grain (e.g. for very small chips) */
  noNoise?: boolean;
}

const LiquidCard = forwardRef<HTMLDivElement, LiquidCardProps>(
  (
    {
      children,
      glow      = false,
      interactive = false,
      noNoise   = false,
      className,
      style,
      ...props
    },
    ref,
  ) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={
        interactive
          ? {
              y: -3,
              boxShadow: glow
                ? '0 0 32px rgba(201,162,39,0.20), 0 12px 40px rgba(0,0,0,0.30), 0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.09)'
                : '0 12px 40px rgba(0,0,0,0.28), 0 4px 12px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.09)',
            }
          : undefined
      }
      className={cn('relative overflow-hidden rounded-2xl', className)}
      style={{
        /* ── Frosted glass base ─────────────────────────── */
        background: glow
          ? 'linear-gradient(135deg, rgba(201,162,39,0.10) 0%, rgba(22,27,34,0.72) 50%, rgba(201,162,39,0.06) 100%)'
          : 'linear-gradient(135deg, rgba(22,27,34,0.72) 0%, rgba(255,255,255,0.018) 100%)',
        backdropFilter:       'blur(32px) saturate(175%) brightness(0.96)',
        WebkitBackdropFilter: 'blur(32px) saturate(175%) brightness(0.96)',

        /* ── Border ────────────────────────────────────── */
        border: glow
          ? '1px solid rgba(201,162,39,0.22)'
          : '1px solid rgba(255,255,255,0.07)',

        /* ── Multi-layer shadow (depth) ─────────────────── */
        boxShadow: glow
          ? '0 0 0 1px rgba(201,162,39,0.08), 0 0 24px rgba(201,162,39,0.12), 0 4px 16px rgba(0,0,0,0.24), 0 16px 40px rgba(0,0,0,0.16), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 0 0 1px rgba(255,255,255,0.04), 0 4px 16px rgba(0,0,0,0.22), 0 16px 40px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.07)',

        transition: interactive
          ? 'transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), border-color 0.25s ease'
          : undefined,

        ...style,
      }}
      {...props}
    >
      {/* ── Prismatic top-edge highlight ───────────────────────────── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-[5%] right-[5%] h-px"
        style={{
          background: glow
            ? 'linear-gradient(90deg, transparent 0%, rgba(244,212,124,0.20) 30%, rgba(255,255,255,0.28) 50%, rgba(244,212,124,0.20) 70%, transparent 100%)'
            : 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.10) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.10) 70%, transparent 100%)',
        }}
      />

      {/* ── Ambient light leak (top radial) ─────────────────────────── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-inherit"
        style={{
          background: glow
            ? 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(201,162,39,0.09) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,255,255,0.025) 0%, transparent 60%)',
        }}
      />

      {/* ── SVG noise grain ──────────────────────────────────────────── */}
      {!noNoise && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-inherit"
          style={{
            backgroundImage: NOISE_DATA_URI,
            opacity:         0.04,
            mixBlendMode:    'overlay',
          }}
        />
      )}

      {/* ── Content ──────────────────────────────────────────────────── */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  ),
);

LiquidCard.displayName = 'LiquidCard';
export default LiquidCard;
