'use client';

import { motion } from 'framer-motion';
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'sticky top-0 z-50 w-full',
        'backdrop-blur-[20px] backdrop-saturate-150',
        // Light mode glass
        'bg-white/60 border-b border-black/[0.06]',
        'shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_12px_rgba(0,0,0,0.02)]',
        // Dark mode glass
        'dark:bg-[rgba(15,20,25,0.75)] dark:border-b dark:border-white/[0.06]',
        'dark:shadow-[0_1px_3px_rgba(0,0,0,0.2),0_4px_16px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.04)]',
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    ? [
                        'text-gold-700 dark:text-gold-400',
                        'bg-gold-500/10 dark:bg-gold-500/15',
                      ].join(' ')
                    : [
                        'text-night-500 dark:text-night-400',
                        'hover:text-night-700 dark:hover:text-night-200',
                        'hover:bg-black/[0.04] dark:hover:bg-white/[0.06]',
                      ].join(' '),
                )}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
                {item.active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Trailing (user menu, etc) */}
          {trailing && <div className="flex-shrink-0">{trailing}</div>}
        </div>
      </div>
    </motion.nav>
  );
}
