'use client';

import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export default function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded-md h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  };

  const animationClass = animation === 'pulse' 
    ? 'animate-pulse' 
    : animation === 'wave' 
      ? 'liquid-skeleton' 
      : '';

  return (
    <div
      className={`bg-night-800/60 ${variantStyles[variant]} ${animationClass} ${className}`}
      style={{ width, height }}
      role="status"
      aria-label="Loading..."
    />
  );
}

// Pre-built skeleton layouts
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`liquid-card p-4 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} />
        </div>
      </div>
      <Skeleton width="100%" height={12} />
      <Skeleton width="80%" height={12} />
    </div>
  );
}

export function SkeletonVerse({ className = '' }: { className?: string }) {
  return (
    <div className={`p-5 space-y-4 ${className}`}>
      {/* Arabic text skeleton - right-aligned */}
      <div className="flex flex-col items-end gap-2" style={{ direction: 'rtl' }}>
        <Skeleton width="90%" height={32} className="rounded-lg" />
        <Skeleton width="75%" height={32} className="rounded-lg" />
        <Skeleton width="60%" height={32} className="rounded-lg" />
      </div>
      {/* Translation skeleton */}
      <div className="pt-4 border-t border-night-800/50 space-y-2">
        <Skeleton width="100%" height={14} />
        <Skeleton width="85%" height={14} />
        <Skeleton width="70%" height={14} />
      </div>
    </div>
  );
}

export function SkeletonList({ count = 5, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton width={`${60 + Math.random() * 30}%`} height={14} />
            <Skeleton width={`${40 + Math.random() * 20}%`} height={10} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonSurahCard({ className = '' }: { className?: string }) {
  return (
    <div className={`liquid-card p-4 ${className}`}>
      <div className="flex items-center gap-4">
        {/* Number badge */}
        <Skeleton variant="rounded" width={44} height={44} />
        
        {/* Surah info */}
        <div className="flex-1 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton width={120} height={18} />
            <Skeleton width={80} height={24} className="rounded-lg" />
          </div>
          <Skeleton width={100} height={12} />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLessonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`liquid-card p-4 ${className}`}>
      <div className="flex gap-4">
        <Skeleton variant="rounded" width={56} height={56} />
        <div className="flex-1 space-y-3">
          <Skeleton width="70%" height={18} />
          <Skeleton width="100%" height={12} />
          <div className="flex gap-2">
            <Skeleton width={60} height={20} className="rounded-full" />
            <Skeleton width={80} height={20} className="rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Animated loading dots
export function LoadingDots({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-gold-500"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// Full page loading spinner
export function PageLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-night-950">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 border-3 border-night-700 border-t-gold-500 rounded-full mb-4"
      />
      <p className="text-night-400 text-sm">{message}</p>
    </div>
  );
}
