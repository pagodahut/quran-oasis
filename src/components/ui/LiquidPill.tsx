'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface LiquidPillProps {
  children: ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

const spring = { type: 'spring' as const, stiffness: 500, damping: 30 };

export default function LiquidPill({ children, selected = false, onClick, className }: LiquidPillProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      animate={selected ? { scale: 1.02 } : { scale: 1 }}
      transition={spring}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
        'backdrop-blur-[12px] transition-colors duration-200',
        'border',
        selected
          ? 'bg-gold-500/20 border-gold-500/30 text-gold-400'
          : 'bg-white/[0.06] border-white/[0.08] text-night-400 hover:text-night-200 hover:bg-white/[0.1]',
        className,
      )}
    >
      {children}
    </motion.button>
  );
}
