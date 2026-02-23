'use client';

import { forwardRef, type ReactNode, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   GlassPanel — Configurable Liquid Glass Surface
   ─────────────────────────────────────────────
   A single composable primitive that every glass
   surface in the app can be built from.

   Features:
   • Configurable blur intensity (sm / md / lg / xl)
   • Dark frosted glass with warm amber light leak
   • Subtle SVG noise/grain texture overlay
   • Multi-layer refraction box-shadow
   • Edge glow & top highlight
   • Optional border glow (amber)
   • Gradient mesh tint
   ─────────────────────────────────────────────── */

export type GlassBlur  = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type GlassTint  = 'neutral' | 'gold' | 'sage' | 'deep';

export interface GlassPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Blur / frosting intensity */
  blur?: GlassBlur;
  /** Colour tint for the glass surface */
  tint?: GlassTint;
  /** Show warm amber border glow */
  glow?: boolean;
  /** Overlay the SVG noise grain texture */
  noise?: boolean;
  /** Rounded corners — pass a Tailwind class like "rounded-2xl" */
  rounded?: string;
  /** Extra inline styles */
  style?: CSSProperties;
  /** Children */
  children?: ReactNode;
}

// ── Blur values ──────────────────────────────────────────────────────────────
const BLUR_FILTER: Record<GlassBlur, string> = {
  none: 'none',
  sm:   'blur(12px) saturate(160%) brightness(0.97)',
  md:   'blur(24px) saturate(170%) brightness(0.96)',
  lg:   'blur(48px) saturate(180%) brightness(0.95)',
  xl:   'blur(72px) saturate(200%) brightness(0.94)',
};

// ── Tint backgrounds ─────────────────────────────────────────────────────────
const TINT_BG: Record<GlassTint, string> = {
  neutral:
    'linear-gradient(135deg, rgba(22,27,34,0.70) 0%, rgba(15,20,28,0.60) 100%)',
  gold:
    'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(22,27,34,0.65) 50%, rgba(201,162,39,0.08) 100%)',
  sage:
    'linear-gradient(135deg, rgba(78,122,81,0.10) 0%, rgba(22,27,34,0.65) 50%, rgba(78,122,81,0.06) 100%)',
  deep:
    'linear-gradient(135deg, rgba(15,20,30,0.85) 0%, rgba(10,14,22,0.90) 100%)',
};

// ── Box-shadow presets ────────────────────────────────────────────────────────
const TINT_SHADOW: Record<GlassTint, string> = {
  neutral:
    '0 0 0 1px rgba(255,255,255,0.05), 0 4px 16px rgba(0,0,0,0.28), 0 16px 40px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.09)',
  gold:
    '0 0 0 1px rgba(201,162,39,0.12), 0 0 24px rgba(201,162,39,0.10), 0 4px 20px rgba(0,0,0,0.28), 0 16px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
  sage:
    '0 0 0 1px rgba(78,122,81,0.12), 0 4px 20px rgba(0,0,0,0.28), 0 16px 48px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.07)',
  deep:
    '0 0 0 1px rgba(255,255,255,0.04), 0 8px 32px rgba(0,0,0,0.36), 0 24px 64px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.06)',
};

// ── Border colours ────────────────────────────────────────────────────────────
const TINT_BORDER: Record<GlassTint, string> = {
  neutral: 'rgba(255,255,255,0.07)',
  gold:    'rgba(201,162,39,0.20)',
  sage:    'rgba(78,122,81,0.18)',
  deep:    'rgba(255,255,255,0.04)',
};

const GLOW_EXTRA =
  ', 0 0 40px rgba(201,162,39,0.18), 0 0 80px rgba(201,162,39,0.08)';

// ── SVG noise (data URI) ──────────────────────────────────────────────────────
// feTurbulence-based grain that overlays any glass surface
const NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      blur    = 'lg',
      tint    = 'neutral',
      glow    = false,
      noise   = true,
      rounded = 'rounded-2xl',
      className,
      children,
      style,
      ...rest
    },
    ref,
  ) => {
    const panelStyle: CSSProperties = {
      background:           TINT_BG[tint],
      backdropFilter:       BLUR_FILTER[blur],
      WebkitBackdropFilter: BLUR_FILTER[blur],
      border:               `1px solid ${TINT_BORDER[tint]}`,
      boxShadow:            TINT_SHADOW[tint] + (glow ? GLOW_EXTRA : ''),
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', rounded, className)}
        style={panelStyle}
        {...rest}
      >
        {/* ── Top edge highlight (refraction simulation) ─────────────────── */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-[5%] right-[5%] h-px"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 30%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.14) 70%, transparent 100%)',
          }}
        />

        {/* ── Left edge glint (curved glass refraction) ──────────────────── */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[10%] bottom-[10%] w-px"
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.08) 60%, transparent 100%)',
          }}
        />

        {/* ── Ambient gold light leak from top ───────────────────────────── */}
        {(tint === 'gold' || glow) && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-inherit"
            style={{
              background:
                'radial-gradient(ellipse 80% 35% at 50% 0%, rgba(212,175,55,0.10) 0%, transparent 60%)',
            }}
          />
        )}

        {/* ── SVG noise grain overlay ─────────────────────────────────────── */}
        {noise && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-inherit"
            style={{
              backgroundImage: NOISE_DATA_URI,
              opacity:         0.045,
              mixBlendMode:    'overlay',
            }}
          />
        )}

        {/* ── Content ────────────────────────────────────────────────────── */}
        {children}
      </div>
    );
  },
);

GlassPanel.displayName = 'GlassPanel';
export default GlassPanel;
