'use client';

import { forwardRef, type ReactNode, type CSSProperties, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type GlassBlur  = 'none' | 'sm' | 'md' | 'lg' | 'xl';
export type GlassTint  = 'neutral' | 'gold' | 'sage' | 'deep';

export interface GlassPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  blur?: GlassBlur;
  tint?: GlassTint;
  glow?: boolean;
  noise?: boolean;
  rounded?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const BLUR_MAP: Record<GlassBlur, string> = {
  none: 'none',
  sm:   'blur(8px)',
  md:   'blur(16px)',
  lg:   'blur(24px)',
  xl:   'blur(40px)',
};

export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      blur    = 'lg',
      tint    = 'neutral',
      glow    = false,
      noise   = false,
      rounded = 'rounded-2xl',
      className,
      children,
      style,
      ...rest
    },
    ref,
  ) => {
    const tintVar = {
      neutral: 'var(--panel-neutral)',
      gold:    'var(--panel-gold)',
      sage:    'var(--panel-sage)',
      deep:    'var(--panel-deep)',
    }[tint];

    const borderVar = {
      neutral: 'var(--panel-border-neutral)',
      gold:    'var(--panel-border-gold)',
      sage:    'var(--panel-border-sage)',
      deep:    'var(--panel-border-neutral)',
    }[tint];

    const panelStyle: CSSProperties = {
      background: tintVar,
      backdropFilter: BLUR_MAP[blur],
      WebkitBackdropFilter: BLUR_MAP[blur],
      border: `1px solid ${borderVar}`,
      boxShadow: glow
        ? 'var(--panel-shadow), 0 0 32px var(--ambient-gold-subtle, rgba(201,162,39,0.1))'
        : 'var(--panel-shadow)',
      // Drift gently when the prayer-time palette shifts
      transition: 'background-color 1.2s ease, border-color 1.2s ease, box-shadow 1.2s ease, color 0.8s ease',
      ...style,
    };

    return (
      <div
        ref={ref}
        className={cn('relative overflow-hidden', rounded, className)}
        style={panelStyle}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

GlassPanel.displayName = 'GlassPanel';
export default GlassPanel;
