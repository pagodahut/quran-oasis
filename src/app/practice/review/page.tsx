'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import {
  RefreshCw,
  Play,
  Star,
  ArrowLeft,
  Clock,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useCalibrationGuard } from '@/hooks/useCalibrationGuard';
import { SURAH_METADATA } from '@/lib/surahMetadata';
import { getDifficultyLabel, getDifficultyColor } from '@/lib/adaptiveDifficulty';
import { getReviewQueueLocal, type ReviewItem } from '@/lib/reviewQueue';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

function getReasonIcon(reason: string) {
  switch (reason) {
    case 'overdue': return <Clock className="w-3.5 h-3.5" />;
    case 'struggling': return <AlertTriangle className="w-3.5 h-3.5" />;
    default: return <CheckCircle className="w-3.5 h-3.5" />;
  }
}

function getReasonColor(reason: string) {
  switch (reason) {
    case 'overdue': return 'text-orange-400';
    case 'struggling': return 'text-red-400';
    default: return 'text-sage-400';
  }
}

function getSurahName(num: number): string {
  return SURAH_METADATA[num - 1]?.englishName || `Surah ${num}`;
}

export default function ReviewQueuePage() {
  const { isSignedIn } = useUser();
  const { isChecking: isCheckingCalibration } = useCalibrationGuard();
  const [queue, setQueue] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQueue() {
      try {
        if (isSignedIn) {
          const res = await fetch('/api/review/queue?limit=20');
          if (res.ok) {
            const data = await res.json();
            setQueue(data.queue.map((item: ReviewItem & { nextReviewAt: string }) => ({
              ...item,
              nextReviewAt: new Date(item.nextReviewAt),
            })));
            setLoading(false);
            return;
          }
        }
      } catch {
        // Fall through to local
      }

      // Guest fallback
      setQueue(getReviewQueueLocal(20));
      setLoading(false);
    }
    loadQueue();
  }, [isSignedIn]);

  if (isCheckingCalibration) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950 text-night-100 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-night-950/80 backdrop-blur-xl border-b border-night-800/50">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/practice" className="p-2 -ml-2 rounded-xl hover:bg-night-800/50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-night-400" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">Smart Review</h1>
            <p className="text-xs text-night-500">{queue.length} verses to review</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-night-800/30 animate-pulse" />
            ))}
          </div>
        ) : queue.length === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold-500/10 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-gold-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">All caught up! 🌟</h2>
            <p className="text-night-400 mb-8 max-w-xs mx-auto">
              You&apos;ve reviewed all your verses. Keep up the great work!
            </p>
            <Link
              href="/surahs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/30 hover:bg-gold-500/30 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Memorize New Verses
            </Link>
          </motion.div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
            {/* Start Review CTA */}
            <motion.div variants={fadeInUp}>
              <Link
                href={`/recite?surah=${queue[0].surahNumber}&ayah=${queue[0].ayahNumber}`}
                className="block w-full p-4 rounded-2xl bg-gradient-to-r from-gold-500/20 to-gold-600/10 border border-gold-500/30 hover:border-gold-500/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                    <Play className="w-6 h-6 text-gold-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gold-300">Start Review Session</p>
                    <p className="text-sm text-night-400">
                      Begin with {getSurahName(queue[0].surahNumber)} {queue[0].surahNumber}:{queue[0].ayahNumber}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Queue list */}
            {queue.map((item, index) => (
              <motion.div key={`${item.surahNumber}:${item.ayahNumber}`} variants={fadeInUp}>
                <Link
                  href={`/recite?surah=${item.surahNumber}&ayah=${item.ayahNumber}`}
                  className="block p-4 rounded-2xl bg-night-900/50 border border-night-800/50 hover:border-night-700/50 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-xs text-night-600 w-5 text-right shrink-0">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {getSurahName(item.surahNumber)}{' '}
                          <span className="text-night-500">{item.surahNumber}:{item.ayahNumber}</span>
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-night-500">
                            Accuracy: {Math.round(item.lastAccuracy * 100)}%
                          </span>
                          <span className="text-xs text-night-600">•</span>
                          <span className="text-xs text-night-500">
                            {item.attemptCount} attempt{item.attemptCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getDifficultyColor(item.difficultyScore)}`}>
                        {item.difficultyLabel}
                      </span>
                      <span className={`flex items-center gap-1 text-xs ${getReasonColor(item.reason)}`}>
                        {getReasonIcon(item.reason)}
                        {item.reason}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
