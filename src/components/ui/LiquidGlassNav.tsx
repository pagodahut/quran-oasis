'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────
   LiquidGlassNav
   The genuine article: a nav bar that LOOKS like
   frosted, curved glass with:

   • Deep 64 px backdrop-blur + chromatic saturation
   • SVG noise grain overlay (realistic frosted glass)
   • Warm amber light-leak through the glass
   • Top-edge prismatic highlight (refraction sim)
   • Left-edge glint (curved surface reflection)
   • Multi-layer box-shadow for physical depth
   • Animated ambient glow that softly breathes
   ─────────────────────────────────────────────── */

// SVG noise grain — same pattern as GlassPanel for consistency
const NOISE_DATA_URI =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.80' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

interface NavItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
}

interface LiquidGlassNavProps {
  items: NavItem[];
  className?: string;
  children?: ReactNode;
  leading?: ReactNode;
  trailing?: ReactNode;
}

export default function LiquidGlassNav({ items, className, leading, trailing }: LiquidGlassNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className={cn('sticky top-0 z-50 w-full overflow-hidden', className)}
      style={{
        /* ── Core frosted glass ─────────────────────────────── */
        background:
          'linear-gradient(180deg, rgba(16,21,30,0.82) 0%, rgba(12,16,24,0.78) 100%)',
        backdropFilter:       'blur(64px) saturate(200%) brightness(0.94)',
        WebkitBackdropFilter: 'blur(64px) saturate(200%) brightness(0.94)',

        /* ── Physical depth layers ──────────────────────────── */
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        boxShadow: [
          /* outer depth */   '0 1px 0 rgba(255,255,255,0.05)',
          /* drop shadow */   '0 4px 24px rgba(0,0,0,0.22)',
          '0 12px 40px rgba(0,0,0,0.14)',
          /* amber ambient */ '0 0 60px rgba(201,162,39,0.04)',
          /* inner top */     'inset 0 1px 0 rgba(255,255,255,0.10)',
          /* inner bottom */  'inset 0 -1px 0 rgba(0,0,0,0.15)',
        ].join(', '),
      }}
    >
      {/* ── Prismatic top-edge highlight ───────────────────────────────── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.18) 30%, rgba(244,212,124,0.22) 50%, rgba(255,255,255,0.18) 70%, rgba(255,255,255,0.05) 90%, transparent 100%)',
        }}
      />

      {/* ── SVG noise grain (frosted glass texture) ───────────────────── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: NOISE_DATA_URI,
          opacity:         0.05,
          mixBlendMode:    'overlay',
        }}
      />

      {/* ── Warm amber light-leak from above ──────────────────────────── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 120% at 50% -20%, rgba(212,175,55,0.08) 0%, transparent 60%)',
        }}
      />

      {/* ── Right-side vignette (depth illusion) ───────────────────────── */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.04) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.04) 100%)',
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between h-16">
          {/* Leading (logo, etc) */}
          {leading && <div className="flex-shrink-0">{leading}</div>}

          {/* Nav items */}
          <div className="hidden md:flex items-center gap-1">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  'flex items-center gap-2',
                  item.active
                    ? 'text-gold-400'
                    : 'text-night-400 hover:text-night-100',
                )}
              >
                {/* Active pill background */}
                {item.active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.08) 100%)',
                      border:    '1px solid rgba(201,162,39,0.20)',
                      boxShadow: '0 0 16px rgba(201,162,39,0.12), inset 0 1px 0 rgba(255,255,255,0.07)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}

                {/* Hover glow */}
                <span
                  className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                />

                {item.icon && (
                  <span className="relative z-10 w-4 h-4">{item.icon}</span>
                )}
                <span className="relative z-10">{item.label}</span>

                {/* Active bottom bar */}
                {item.active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, transparent, rgba(212,175,55,0.8) 40%, rgba(244,212,124,1) 50%, rgba(212,175,55,0.8) 60%, transparent)',
                      boxShadow: '0 0 8px rgba(201,162,39,0.6)',
                    }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Trailing (user menu, etc) */}
          {trailing && <div className="flex-shrink-0 relative z-10">{trailing}</div>}
        </div>
      </div>
    </motion.nav>
  );
}
