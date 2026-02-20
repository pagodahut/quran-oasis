'use client';

import { motion, type HTMLMotionProps, AnimatePresence } from 'framer-motion';
import { forwardRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type LiquidButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon';
type LiquidButtonSize = 'sm' | 'md' | 'lg';

interface LiquidButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: LiquidButtonVariant;
  size?: LiquidButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
  expandLabel?: string;
  disabled?: boolean;
}

const sizeClasses: Record<LiquidButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-xl',
  md: 'px-5 py-2.5 text-sm gap-2 rounded-2xl',
  lg: 'px-7 py-3.5 text-base gap-2.5 rounded-2xl',
};

const iconSizeClasses: Record<LiquidButtonSize, string> = {
  sm: 'w-8 h-8 rounded-xl',
  md: 'w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl',
  lg: 'w-14 h-14 rounded-2xl',
};

const variantClasses: Record<LiquidButtonVariant, string> = {
  primary: [
    'bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600',
    'text-night-950 font-semibold',
    'border border-white/20',
    'shadow-[0_2px_8px_rgba(201,162,39,0.25),0_8px_24px_rgba(201,162,39,0.2),inset_0_1px_0_rgba(255,255,255,0.25)]',
    'dark:shadow-[0_2px_12px_rgba(201,162,39,0.3),0_8px_28px_rgba(201,162,39,0.25),inset_0_1px_0_rgba(255,255,255,0.20)]',
  ].join(' '),
  secondary: [
    'backdrop-blur-[16px]',
    'bg-white/[0.12] dark:bg-white/[0.06]',
    'text-night-800 dark:text-night-100 font-medium',
    'border border-black/[0.08] dark:border-white/10',
    'shadow-[0_2px_8px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,0.3)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.06)]',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'text-night-600 dark:text-night-300 font-medium',
    'border border-transparent',
    'hover:bg-black/[0.04] dark:hover:bg-white/[0.04]',
  ].join(' '),
  icon: [
    'backdrop-blur-[16px]',
    'bg-white/[0.1] dark:bg-white/[0.05]',
    'text-night-500 dark:text-night-400',
    'border border-black/[0.06] dark:border-white/[0.06]',
    'flex items-center justify-center',
  ].join(' '),
};

const spring = { type: 'spring' as const, stiffness: 400, damping: 25 };

const LiquidButton = forwardRef<HTMLButtonElement, LiquidButtonProps>(
  ({ variant = 'secondary', size = 'md', icon, children, expandLabel, className, disabled, ...props }, ref) => {
    const [expanded, setExpanded] = useState(false);
    const isIcon = variant === 'icon';

    const handlePress = () => {
      if (expandLabel) setExpanded((v) => !v);
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
        onClick={handlePress}
        className={cn(
          'relative inline-flex items-center justify-center cursor-pointer overflow-hidden',
          'transition-colors duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
          '-webkit-tap-highlight-color-transparent',
          isIcon ? iconSizeClasses[size] : sizeClasses[size],
          variantClasses[variant],
          variant === 'primary' && 'after:absolute after:inset-0 after:rounded-inherit after:bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(255,255,255,0.15),transparent_60%)] after:pointer-events-none',
          className,
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {!expandLabel && children}
        <AnimatePresence>
          {expandLabel && expanded && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ ...spring, opacity: { duration: 0.15 } }}
              className="overflow-hidden whitespace-nowrap"
            >
              {expandLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    );
  },
);

LiquidButton.displayName = 'LiquidButton';
export default LiquidButton;
