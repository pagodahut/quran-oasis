'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Loader2,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import BottomNav from '@/components/BottomNav';
import { SURAH_METADATA } from '@/lib/surahMetadata';

// ============ Types ============

interface RecitationWord {
  id: string;
  wordIndex: number;
  expectedWord: string;
  transcribedWord: string | null;
  confidence: number;
  isCorrect: boolean;
}

interface RecitationSession {
  id: string;
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  overallAccuracy: number;
  duration: number;
  totalWords: number;
  matchedWords: number;
  createdAt: string;
  words: RecitationWord[];
}

interface BestScore {
  surahNumber: number;
  bestAccuracy: number;
  sessionCount: number;
}

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

// ============ Helpers ============

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

// ============ CSS Chart ============

function AccuracyChart({ sessions }: { sessions: { overallAccuracy: number; createdAt: string }[] }) {
  if (sessions.length < 2) return null;

  // Show last 10 sessions
  const data = sessions.slice(0, 10).reverse();
  const max = 100;

  return (
    <div className="mt-4">
      <h4 className="text-xs text-night-400 mb-2">Accuracy Trend</h4>
      <div className="flex items-end gap-1 h-20">
        {data.map((s, i) => {
          const height = Math.max(4, (s.overallAccuracy / max) * 100);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[9px] text-night-500">{s.overallAccuracy}%</span>
              <div
                className={`w-full rounded-t transition-all ${
                  s.overallAccuracy >= 90
                    ? 'bg-sage-500/60'
                    : s.overallAccuracy >= 70
                    ? 'bg-gold-500/60'
                    : 'bg-red-500/60'
                }`}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ Session Card ============

function SessionCard({ session }: { session: RecitationSession | LocalSession }) {
  const [expanded, setExpanded] = useState(false);
  const hasWords = 'words' in session && session.words?.length > 0;

  return (
    <motion.div
      layout
      className="bg-night-900/40 border border-night-800/50 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => hasWords && setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
      >
        {/* Accuracy badge */}
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-lg border flex items-center justify-center ${getAccuracyBg(
            session.overallAccuracy
          )}`}
        >
          <span className={`text-sm font-bold ${getAccuracyColor(session.overallAccuracy)}`}>
            {session.overallAccuracy}%
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-night-100 truncate">
            {getSurahName(session.surahNumber)}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-night-500">
              Ayah {session.startAyah}–{session.endAyah}
            </span>
            <span className="text-night-700">·</span>
            <span className="text-xs text-night-500">{formatTime(session.duration)}</span>
          </div>
        </div>

        {hasWords && (
          expanded ? (
            <ChevronUp className="w-4 h-4 text-night-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-night-500 flex-shrink-0" />
          )
        )}
      </button>

      {/* Word details */}
      <AnimatePresence>
        {expanded && hasWords && 'words' in session && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-night-800/30"
          >
            <div className="px-4 py-3 flex flex-wrap gap-1.5" dir="rtl">
              {session.words.map((w) => (
                <span
                  key={w.id}
                  className={`inline-block px-1.5 py-0.5 rounded text-sm font-arabic ${
                    w.isCorrect
                      ? 'bg-sage-500/10 text-sage-300'
                      : 'bg-red-500/10 text-red-300'
                  }`}
                  title={w.transcribedWord ? `Heard: ${w.transcribedWord}` : 'Not detected'}
                >
                  {w.expectedWord}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ Most Practiced ============

function MostPracticed({ bestScores }: { bestScores: BestScore[] }) {
  if (bestScores.length === 0) return null;

  const sorted = [...bestScores].sort((a, b) => b.sessionCount - a.sessionCount).slice(0, 5);

  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold text-night-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Star className="w-3.5 h-3.5" />
        Your Most Practiced
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {sorted.map((s) => (
          <div
            key={s.surahNumber}
            className="flex-shrink-0 px-4 py-3 rounded-xl bg-night-900/50 border border-night-800/40 min-w-[140px]"
          >
            <div className="text-sm font-medium text-night-200">{getSurahName(s.surahNumber)}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs font-bold ${getAccuracyColor(s.bestAccuracy)}`}>
                Best: {s.bestAccuracy}%
              </span>
              <span className="text-night-600">·</span>
              <span className="text-xs text-night-500">{s.sessionCount}×</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============ Main Page ============

export default function RecitationHistoryPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [sessions, setSessions] = useState<RecitationSession[]>([]);
  const [bestScores, setBestScores] = useState<BestScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [localSessions, setLocalSessions] = useState<LocalSession[]>([]);

  // Load from API or localStorage
  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      fetchHistory(1);
    } else {
      // Guest: load from localStorage
      try {
        const stored = localStorage.getItem('recitation-history');
        if (stored) {
          setLocalSessions(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  async function fetchHistory(p: number) {
    setLoading(true);
    try {
      const res = await fetch(`/api/recitation?page=${p}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sessions);
        setBestScores(data.bestScores || []);
        setPage(data.page);
        setTotalPages(data.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  }

  // Group sessions by date
  const groupedSessions = useMemo(() => {
    const items = isSignedIn ? sessions : localSessions;
    const groups: Record<string, (RecitationSession | LocalSession)[]> = {};
    for (const s of items) {
      const dateKey = formatDate(s.createdAt);
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(s);
    }
    return groups;
  }, [sessions, localSessions, isSignedIn]);

  const allSessions = isSignedIn ? sessions : localSessions;

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--theme-surface)]/90 backdrop-blur-xl border-b border-night-800/30">
        <div className="px-4 pt-safe-top">
          <div className="flex items-center gap-3 py-4">
            <button
              onClick={() => router.push('/recite')}
              className="text-night-400 hover:text-night-200 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-night-100">Recitation History</h1>
              <p className="text-xs text-night-500 mt-0.5">
                {allSessions.length} session{allSessions.length !== 1 ? 's' : ''} recorded
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 text-night-500 animate-spin" />
          </div>
        ) : allSessions.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-10 h-10 text-night-600 mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-night-300 mb-1">No sessions yet</h2>
            <p className="text-sm text-night-500 mb-6">
              Complete a recitation to see your history here
            </p>
            <button
              onClick={() => router.push('/recite')}
              className="px-6 py-2.5 rounded-xl bg-gold-500/15 text-gold-400 border border-gold-500/30 
                text-sm font-medium hover:bg-gold-500/25 transition"
            >
              Start Reciting
            </button>
          </div>
        ) : (
          <>
            {/* Most practiced */}
            {isSignedIn && <MostPracticed bestScores={bestScores} />}

            {/* Accuracy chart */}
            {allSessions.length >= 2 && (
              <section className="mb-6 bg-night-900/40 border border-night-800/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-gold-500" />
                  <h3 className="text-sm font-semibold text-night-200">Progress</h3>
                </div>
                <AccuracyChart sessions={allSessions} />
              </section>
            )}

            {/* Grouped sessions */}
            <div className="space-y-6">
              {Object.entries(groupedSessions).map(([date, dateSessions]) => (
                <section key={date}>
                  <h2 className="text-xs font-semibold text-night-500 uppercase tracking-wider mb-2">
                    {date}
                  </h2>
                  <div className="space-y-2">
                    {dateSessions.map((s, i) => (
                      <SessionCard key={'id' in s ? s.id : `local-${i}`} session={s} />
                    ))}
                  </div>
                </section>
              ))}
            </div>

            {/* Pagination */}
            {isSignedIn && totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-6">
                <button
                  disabled={page <= 1}
                  onClick={() => fetchHistory(page - 1)}
                  className="px-4 py-2 rounded-lg bg-night-800 text-night-300 text-sm disabled:opacity-30"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-night-500">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => fetchHistory(page + 1)}
                  className="px-4 py-2 rounded-lg bg-night-800 text-night-300 text-sm disabled:opacity-30"
                >
                  Next
                </button>
              </div>
            )}

            {/* Guest notice */}
            {!isSignedIn && (
              <div className="mt-6 p-4 rounded-xl bg-night-900/40 border border-night-800/50 text-center">
                <p className="text-xs text-night-400">
                  Sign in to save your history across devices and track long-term progress.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
