'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FloatingMenuItem {
  key: string;
  icon: ReactNode;
  label?: string;
  onClick?: () => void;
}

interface FloatingMenuProps {
  open: boolean;
  onClose: () => void;
  items: FloatingMenuItem[];
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 25,
      staggerChildren: 0.04,
    },
  },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 8 },
};

export default function FloatingMenu({ open, onClose, items, direction = 'horizontal', className }: FloatingMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'inline-flex gap-1.5 p-1.5 rounded-2xl z-50',
            'backdrop-blur-[20px] bg-night-900/80 border border-white/[0.08]',
            'shadow-[0_8px_32px_rgba(0,0,0,0.3)]',
            direction === 'vertical' && 'flex-col',
            className,
          )}
        >
          {items.map((item) => (
            <motion.button
              key={item.key}
              variants={itemVariants}
              whileTap={{ scale: 0.92 }}
              onClick={() => { item.onClick?.(); onClose(); }}
              className={cn(
                'w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl flex items-center justify-center',
                'bg-white/[0.05] border border-white/[0.06] text-night-300',
                'hover:bg-white/[0.1] hover:text-night-100 transition-colors duration-150',
              )}
              title={item.label}
            >
              {item.icon}
            </motion.button>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
