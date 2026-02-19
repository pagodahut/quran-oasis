'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LiquidToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

const spring = { type: 'spring' as const, stiffness: 500, damping: 30 };

export default function LiquidToggle({ checked, onChange, disabled = false, className, label }: LiquidToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative w-12 h-7 rounded-full p-0.5 transition-colors duration-300',
        'backdrop-blur-[12px] border',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        checked
          ? 'bg-gold-500/20 border-gold-500/40'
          : 'bg-white/[0.05] border-white/10',
        className,
      )}
    >
      <motion.div
        layout
        transition={spring}
        className={cn(
          'w-[22px] h-[22px] rounded-full',
          checked
            ? 'bg-gradient-to-br from-gold-400 to-gold-600 shadow-[0_0_10px_rgba(201,162,39,0.5),0_2px_4px_rgba(0,0,0,0.2)]'
            : 'bg-gradient-to-br from-white/90 to-white/70 shadow-[0_2px_4px_rgba(0,0,0,0.2)]',
        )}
        style={{ x: checked ? 20 : 0 }}
      />
    </button>
  );
}
