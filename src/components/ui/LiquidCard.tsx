'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LiquidCardProps extends HTMLMotionProps<'div'> {
  children?: ReactNode;
  glow?: boolean;
  interactive?: boolean;
}

const LiquidCard = forwardRef<HTMLDivElement, LiquidCardProps>(
  ({ children, glow = false, interactive = false, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      whileHover={interactive ? { y: -2, boxShadow: '0 12px 40px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.14)' } : undefined}
      className={cn(
        'relative rounded-2xl p-4 overflow-hidden',
        'backdrop-blur-[16px]',
        'bg-[linear-gradient(135deg,rgba(22,27,34,0.60),rgba(255,255,255,0.02))]',
        'border border-white/[0.07]',
        'shadow-[0_4px_16px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.06)]',
        'transition-[border-color,box-shadow] duration-250 ease-out',
        glow && 'border-gold-500/20 shadow-[0_0_24px_rgba(201,162,39,0.12),0_4px_16px_rgba(0,0,0,0.18)]',
        interactive && 'cursor-pointer',
        className,
      )}
      {...props}
    >
      {/* Top highlight */}
      <span className="pointer-events-none absolute top-0 left-[5%] right-[5%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08)_50%,transparent)]" />
      {glow && (
        <span className="pointer-events-none absolute inset-0 rounded-inherit bg-[radial-gradient(ellipse_80%_40%_at_50%_0%,rgba(201,162,39,0.06),transparent_60%)]" />
      )}
      {children}
    </motion.div>
  ),
);

LiquidCard.displayName = 'LiquidCard';
export default LiquidCard;
