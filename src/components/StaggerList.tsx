'use client';

import { motion } from 'framer-motion';
import { type ReactNode, Children } from 'react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
  },
};

interface StaggerListProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms between items (default 50) */
  staggerMs?: number;
}

export default function StaggerList({ children, className = '', staggerMs = 50 }: StaggerListProps) {
  const container = {
    ...containerVariants,
    visible: { transition: { staggerChildren: staggerMs / 1000 } },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {Children.map(children, (child) =>
        child ? <motion.div variants={itemVariants}>{child}</motion.div> : null
      )}
    </motion.div>
  );
}

export { itemVariants, containerVariants };
