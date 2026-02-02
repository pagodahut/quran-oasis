'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Bookmark, 
  Search, 
  TrendingUp, 
  BookOpen, 
  Target,
  Sparkles,
  Calendar,
  Star,
  type LucideIcon 
} from 'lucide-react';

// ============================================
// Types
// ============================================

interface EmptyStateProps {
  variant: 'bookmarks' | 'search' | 'progress' | 'lessons' | 'generic';
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  onCtaClick?: () => void;
  searchQuery?: string;
}

// ============================================
// Config for each variant
// ============================================

interface EmptyStateConfig {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  iconBorder: string;
  defaultTitle: string;
  defaultDescription: string;
  defaultCtaLabel?: string;
  defaultCtaHref?: string;
  encouragement?: string;
}

const configs: Record<string, EmptyStateConfig> = {
  bookmarks: {
    icon: Bookmark,
    iconColor: 'text-gold-400',
    iconBg: 'rgba(201,162,39,0.1)',
    iconBorder: 'rgba(201,162,39,0.2)',
    defaultTitle: 'No bookmarks yet',
    defaultDescription: 'Tap the bookmark icon while reading to save verses you want to revisit.',
    defaultCtaLabel: 'Open Quran',
    defaultCtaHref: '/mushaf',
    encouragement: 'Start building your personal collection!',
  },
  search: {
    icon: Search,
    iconColor: 'text-night-500',
    iconBg: 'rgba(255,255,255,0.05)',
    iconBorder: 'rgba(255,255,255,0.08)',
    defaultTitle: 'No results found',
    defaultDescription: 'Try different keywords or check your spelling.',
    encouragement: 'The Quran contains guidance for everything you seek.',
  },
  progress: {
    icon: TrendingUp,
    iconColor: 'text-sage-400',
    iconBg: 'rgba(134,169,113,0.1)',
    iconBorder: 'rgba(134,169,113,0.2)',
    defaultTitle: 'Your journey begins here',
    defaultDescription: 'Start memorizing to track your progress and build your streak!',
    defaultCtaLabel: 'Start Learning',
    defaultCtaHref: '/lessons',
    encouragement: 'Every Hafiz started with a single verse. ✨',
  },
  lessons: {
    icon: BookOpen,
    iconColor: 'text-gold-400',
    iconBg: 'rgba(201,162,39,0.1)',
    iconBorder: 'rgba(201,162,39,0.2)',
    defaultTitle: 'No lessons completed yet',
    defaultDescription: 'Begin your journey to become a Hafiz with our guided lessons.',
    defaultCtaLabel: 'Start First Lesson',
    defaultCtaHref: '/lessons',
    encouragement: 'The best time to start is now!',
  },
  generic: {
    icon: Sparkles,
    iconColor: 'text-night-400',
    iconBg: 'rgba(255,255,255,0.05)',
    iconBorder: 'rgba(255,255,255,0.08)',
    defaultTitle: 'Nothing here yet',
    defaultDescription: 'Content will appear here once available.',
  },
};

// ============================================
// Main Component
// ============================================

export default function EmptyState({
  variant,
  title,
  description,
  ctaLabel,
  ctaHref,
  onCtaClick,
  searchQuery,
}: EmptyStateProps) {
  const config = configs[variant] || configs.generic;
  const Icon = config.icon;
  
  // Customize search result message
  const finalTitle = title || (variant === 'search' && searchQuery 
    ? `No results for "${searchQuery}"`
    : config.defaultTitle);
  
  const finalDescription = description || config.defaultDescription;
  const finalCtaLabel = ctaLabel || config.defaultCtaLabel;
  const finalCtaHref = ctaHref || config.defaultCtaHref;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-16 px-6"
    >
      {/* Icon container with premium glass effect */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6"
        style={{
          background: `linear-gradient(135deg, ${config.iconBg} 0%, transparent 100%)`,
          border: `1px solid ${config.iconBorder}`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)`,
        }}
      >
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
      </motion.div>

      {/* Title */}
      <motion.h3
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-xl font-semibold text-night-100 mb-2"
      >
        {finalTitle}
      </motion.h3>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-night-400 text-sm max-w-xs mx-auto mb-6 leading-relaxed"
      >
        {finalDescription}
      </motion.p>

      {/* Encouragement message */}
      {config.encouragement && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-night-500 mb-6 italic"
        >
          {config.encouragement}
        </motion.p>
      )}

      {/* CTA Button */}
      {(finalCtaLabel && finalCtaHref) || onCtaClick ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          {onCtaClick ? (
            <motion.button
              onClick={onCtaClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(201,162,39,0.9) 0%, rgba(180,140,30,1) 100%)',
                boxShadow: '0 4px 16px rgba(201,162,39,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                color: '#0a0a0f',
              }}
            >
              <Icon className="w-4 h-4" />
              {finalCtaLabel}
            </motion.button>
          ) : (
            <Link href={finalCtaHref!}>
              <motion.span
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.9) 0%, rgba(180,140,30,1) 100%)',
                  boxShadow: '0 4px 16px rgba(201,162,39,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
                  color: '#0a0a0f',
                }}
              >
                <BookOpen className="w-4 h-4" />
                {finalCtaLabel}
              </motion.span>
            </Link>
          )}
        </motion.div>
      ) : null}
    </motion.div>
  );
}

// ============================================
// Specialized Empty States
// ============================================

export function NoProgressYet() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-8 text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(134,169,113,0.08) 0%, rgba(134,169,113,0.02) 100%)',
        border: '1px solid rgba(134,169,113,0.15)',
      }}
    >
      <div 
        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{
          background: 'linear-gradient(135deg, rgba(134,169,113,0.15) 0%, rgba(134,169,113,0.05) 100%)',
          border: '1px solid rgba(134,169,113,0.2)',
        }}
      >
        <Target className="w-8 h-8 text-sage-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-night-100 mb-2">
        Your Journey Begins Here
      </h3>
      <p className="text-sm text-night-400 mb-4 max-w-xs mx-auto">
        Complete your first lesson to see your progress appear here!
      </p>
      
      <div className="flex items-center justify-center gap-6 text-xs text-night-500 mb-6">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gold-400/60" />
          <span>Build streaks</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-gold-400/60" />
          <span>Earn rewards</span>
        </div>
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-sage-400/60" />
          <span>Track growth</span>
        </div>
      </div>
      
      <Link href="/lessons">
        <motion.span
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(134,169,113,0.9) 0%, rgba(100,140,90,1) 100%)',
            boxShadow: '0 4px 16px rgba(134,169,113,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
            color: 'white',
          }}
        >
          <BookOpen className="w-4 h-4" />
          Start First Lesson
        </motion.span>
      </Link>
    </motion.div>
  );
}

export function NoStreakYet() {
  return (
    <div className="text-center py-6">
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-4xl mb-3"
      >
        🔥
      </motion.div>
      <p className="text-night-400 text-sm">
        Practice daily to start your streak!
      </p>
    </div>
  );
}
