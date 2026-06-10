'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  TrendingUp,
  BookOpen,
  Mic,
  Clock,
  Target,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import BottomNav from '@/components/BottomNav';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { SURAH_METADATA } from '@/lib/surahMetadata';

interface LocalSession {
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  overallAccuracy: number;
  duration: number;
  totalWords: number;
  matchedWords: number;
  createdAt: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function getSurahName(num: number): string {
  return SURAH_METADATA.find((s) => s.number === num)?.englishName || `Surah ${num}`;
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return 'text-sage-400';
  if (accuracy >= 70) return 'text-gold-400';
  return 'text-red-400';
}

function getAccuracyBg(accuracy: number): string {
  if (accuracy >= 90) return 'bg-sage-500/15 border-sage-500/30';
  if (accuracy >= 70) return 'bg-gold-500/15 border-gold-500/30';
  return 'bg-red-500/15 border-red-500/30';
}

function getAccuracyBarColor(accuracy: number): string {
  if (accuracy >= 90) return 'bg-sage-500';
  if (accuracy >= 70) return 'bg-gold-500';
  return 'bg-red-500';
}

function AccuracyChart({ sessions }: { sessions: { overallAccuracy: number; createdAt: string }[] }) {
  if (sessions.length < 2) return null;

  const data = sessions.slice(0, 10).reverse();

  return (
    <div className="mt-3">
      <div className="flex items-end gap-1.5 h-24">
        {data.map((s, i) => {
          const height = Math.max(8, (s.overallAccuracy / 100) * 100);
          return (
            <motion.div
              key={i}
              className="flex-1 flex flex-col items-center gap-1"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{ originY: 1 }}
            >
              <span className={`text-[10px] font-medium ${getAccuracyColor(s.overallAccuracy)}`}>
                {s.overallAccuracy}%
              </span>
              <div
                className={`w-full rounded-t-md transition-all ${getAccuracyBarColor(s.overallAccuracy)}/60`}
                style={{ height: `${height}%` }}
              />
            </motion.div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] text-night-600">Oldest</span>
        <span className="text-[10px] text-night-600">Latest</span>
      </div>
    </div>
  );
}

function SessionCard({ session, index }: { session: LocalSession; index: number }) {
  return (
    <motion.div variants={fadeInUp}>
      <GlassPanel tint="neutral" blur="sm" className="p-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${getAccuracyBg(
              session.overallAccuracy
            )}`}
          >
            <span className={`text-sm font-bold ${getAccuracyColor(session.overallAccuracy)}`}>
              {session.overallAccuracy}%
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-night-100 truncate">
              {getSurahName(session.surahNumber)}
            </h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-night-500 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Ayah {session.startAyah}–{session.endAyah}
              </span>
              <span className="text-xs text-night-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(session.duration)}
              </span>
            </div>
          </div>

          <div className="w-16">
            <div className="h-1.5 bg-night-800/60 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${getAccuracyBarColor(session.overallAccuracy)}`}
                initial={{ width: 0 }}
                animate={{ width: `${session.overallAccuracy}%` }}
                transition={{ delay: 0.2 + index * 0.05, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <GlassPanel tint="neutral" blur="sm" className="p-3 text-center">
      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center mx-auto mb-2`}>
        {icon}
      </div>
      <p className="text-lg font-bold text-night-100">{value}</p>
      <p className="text-[11px] text-night-500">{label}</p>
    </GlassPanel>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 px-4 py-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <GlassPanel tint="neutral" blur="sm" className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-night-800/60" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-night-800/60 rounded w-32" />
                <div className="h-3 bg-night-800/40 rounded w-48" />
              </div>
            </div>
          </GlassPanel>
        </div>
      ))}
    </div>
  );
}

export default function RecitationHistoryPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [loading, setLoading] = useState(true);
  const [localSessions, setLocalSessions] = useState<LocalSession[]>([]);

  useEffect(() => {
    if (!isLoaded) return;

    try {
      const stored = localStorage.getItem('recitation-history');
      if (stored) {
        setLocalSessions(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [isLoaded]);

  const groupedSessions = useMemo(() => {
    const groups: Record<string, LocalSession[]> = {};
    for (const s of localSessions) {
      const dateKey = formatDate(s.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(s);
    }
    return groups;
  }, [localSessions]);

  const stats = useMemo(() => {
    if (localSessions.length === 0) return null;
    const avgAccuracy = Math.round(localSessions.reduce((sum, s) => sum + s.overallAccuracy, 0) / localSessions.length);
    const totalTime = localSessions.reduce((sum, s) => sum + s.duration, 0);
    const totalWords = localSessions.reduce((sum, s) => sum + s.matchedWords, 0);
    return { avgAccuracy, totalTime, totalWords, sessions: localSessions.length };
  }, [localSessions]);

  return (
    <div className="min-h-screen pb-32">
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/recite')}
              className="p-1 rounded-lg hover:bg-white/5 transition-colors text-night-400 hover:text-night-200"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-xl text-night-100">Recitation History</h1>
              <p className="text-xs text-night-500">
                {localSessions.length} session{localSessions.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-6">
        {loading ? (
          <LoadingSkeleton />
        ) : localSessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <GlassPanel tint="neutral" blur="md" className="inline-block p-8 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-5">
                <Mic className="w-8 h-8 text-gold-400" />
              </div>
              <h2 className="text-lg font-semibold text-night-200 mb-2">No sessions yet</h2>
              <p className="text-sm text-night-500 mb-6 leading-relaxed">
                Complete a recitation to see your history and track your progress over time
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/recite')}
                className="px-6 py-3 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600
                  text-night-950 font-semibold text-sm shadow-[0_2px_12px_rgba(201,162,39,0.3)]"
              >
                Start Reciting
              </motion.button>
            </GlassPanel>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-6"
          >
            {stats && (
              <motion.div variants={fadeInUp} className="grid grid-cols-4 gap-2">
                <StatCard
                  icon={<Target className="w-4 h-4 text-sage-400" />}
                  value={`${stats.avgAccuracy}%`}
                  label="Avg Accuracy"
                  color="bg-sage-500/15"
                />
                <StatCard
                  icon={<Mic className="w-4 h-4 text-gold-400" />}
                  value={`${stats.sessions}`}
                  label="Sessions"
                  color="bg-gold-500/15"
                />
                <StatCard
                  icon={<Clock className="w-4 h-4 text-blue-400" />}
                  value={formatTime(stats.totalTime)}
                  label="Total Time"
                  color="bg-blue-500/15"
                />
                <StatCard
                  icon={<BookOpen className="w-4 h-4 text-purple-400" />}
                  value={`${stats.totalWords}`}
                  label="Words"
                  color="bg-purple-500/15"
                />
              </motion.div>
            )}

            {localSessions.length >= 2 && (
              <motion.div variants={fadeInUp}>
                <GlassPanel tint="neutral" blur="md" className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-gold-500/15 flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 text-gold-400" />
                    </div>
                    <h3 className="text-sm font-semibold text-night-200">Accuracy Trend</h3>
                  </div>
                  <AccuracyChart sessions={localSessions} />
                </GlassPanel>
              </motion.div>
            )}

            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <motion.section key={date} variants={fadeInUp}>
                <h2 className="text-xs font-semibold text-night-500 uppercase tracking-wider mb-3 px-1">
                  {date}
                </h2>
                <div className="space-y-2">
                  {dateSessions.map((s, i) => (
                    <SessionCard key={`local-${i}`} session={s} index={i} />
                  ))}
                </div>
              </motion.section>
            ))}

            {!isSignedIn && (
              <motion.div variants={fadeInUp}>
                <GlassPanel tint="gold" blur="sm" className="p-4 text-center">
                  <p className="text-xs text-night-300">
                    Sign in to save your history across devices and track long-term progress.
                  </p>
                </GlassPanel>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
