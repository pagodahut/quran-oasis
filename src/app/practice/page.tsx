'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  BookOpen,
  Brain,
  Target,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  TreePine,
  Sprout,
  Leaf,
  Star,
  BookMarked,
  Mic,
} from 'lucide-react';
import { MosqueIcon, BookReadIcon, TreeIcon, TargetIcon, CalendarIcon, StarIcon as IslamicStarIcon, CrescentIcon, CrownIcon } from '@/components/icons';
import SheikhReviewSession from '@/components/SheikhReviewSession';
import { useSheikh } from '@/contexts/SheikhContext';
import { loadUserProfile, isCalibrationComplete } from '@/lib/user-profile-sync';
import { srs, srsStateToDueRefs, type ReviewQuality } from '@/lib/spaced-repetition';
import { enrichSRSRefs } from '@/lib/ayah-service';
import BottomNav from '@/components/BottomNav';
import type { ReviewType, SessionResult, ReviewAyah } from '@/hooks/useSheikhReview';

// ─── Types ─────────────────────────────────────────────────────────

type ViewState = 'dashboard' | 'review' | 'add-ayahs';

// ─── Practice Page ─────────────────────────────────────────────────

export default function PracticePage() {
  const { user } = useUser();
  const router = useRouter();
  const { setPageContext, userLevel, setUserLevel } = useSheikh();

  const [view, setView] = useState<ViewState>('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [dueCount, setDueCount] = useState({ sabaq: 0, sabqi: 0, manzil: 0, total: 0 });
  const [stats, setStats] = useState(srs.getStats());

  // Add ayahs form state
  const [addSurah, setAddSurah] = useState('');
  const [addStart, setAddStart] = useState('');
  const [addEnd, setAddEnd] = useState('');
  
  // Review ayahs (enriched with full data)
  const [reviewAyahs, setReviewAyahs] = useState<{
    sabaq: ReviewAyah[];
    sabqi: ReviewAyah[];
    manzil: ReviewAyah[];
  } | null>(null);
  const [loadingReview, setLoadingReview] = useState(false);

  const [isCalibrated, setIsCalibrated] = useState(true);

  // Load profile and SRS state
  useEffect(() => {
    setPageContext({ page: 'practice' });

    async function init() {
      const calibrated = await isCalibrationComplete();
      setIsCalibrated(calibrated);

      const profile = await loadUserProfile();
      if (profile?.level) {
        setUserLevel(profile.level);
      } else {
        setUserLevel('beginner');
      }

      srs.reload();
      setDueCount(srs.getDueCount());
      setStats(srs.getStats());
      setIsLoading(false);
    }

    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshCounts = useCallback(() => {
    setDueCount(srs.getDueCount());
    setStats(srs.getStats());
  }, []);

  const handleReviewComplete = useCallback(
    (type: ReviewType, result: SessionResult) => {
      const qualityMap: Record<string, ReviewQuality> = {
        excellent: 'easy',
        good: 'good',
        needs_work: 'hard',
      };
      const quality = qualityMap[result.overallPerformance] || 'good';
      const due = srs.getDueAyahs();
      const reviewed = due[type].slice(0, result.ayahsCovered);

      for (const ayah of reviewed) {
        srs.recordReview(ayah.surahNumber, ayah.ayahNumber, quality);
      }

      refreshCounts();
    },
    [refreshCounts]
  );

  const handleReviewExit = useCallback(() => {
    setView('dashboard');
    setReviewAyahs(null);
    refreshCounts();
  }, [refreshCounts]);
  
  const startReview = useCallback(async () => {
    setLoadingReview(true);
    try {
      const due = srs.getDueAyahs();
      const refs = srsStateToDueRefs(due);
      
      const [sabaq, sabqi, manzil] = await Promise.all([
        enrichSRSRefs(refs.sabaq),
        enrichSRSRefs(refs.sabqi),
        enrichSRSRefs(refs.manzil),
      ]);
      
      setReviewAyahs({ sabaq, sabqi, manzil });
      setView('review');
    } catch (error) {
      console.error('Failed to load review ayahs:', error);
    } finally {
      setLoadingReview(false);
    }
  }, []);

  const handleAddAyahs = () => {
    const surah = parseInt(addSurah);
    const start = parseInt(addStart);
    const end = parseInt(addEnd || addStart);

    if (!surah || !start || surah < 1 || surah > 114 || start < 1) return;

    srs.addAyahs(surah, start, end);
    setAddSurah('');
    setAddStart('');
    setAddEnd('');
    setView('dashboard');
    refreshCounts();
  };

  // ─── Review View ─────────────────────────────────────────────────

  if (view === 'review' && reviewAyahs) {
    return (
      <SheikhReviewSession
        sabaqAyahs={reviewAyahs.sabaq}
        sabqiAyahs={reviewAyahs.sabqi}
        manzilAyahs={reviewAyahs.manzil}
        userLevel={userLevel}
        userName={user?.firstName || undefined}
        onComplete={handleReviewComplete}
        onExit={handleReviewExit}
      />
    );
  }

  // ─── Add Ayahs View ──────────────────────────────────────────────

  if (view === 'add-ayahs') {
    return (
      <div className="min-h-screen">
        <header className="liquid-glass sticky top-0 z-40 safe-area-top">
          <div className="px-4 py-3 flex items-center gap-3">
            <button onClick={() => setView('dashboard')} className="liquid-icon-btn">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h1 className="font-display text-lg text-night-100">Add Ayahs to Memorize</h1>
          </div>
        </header>

        <main className="px-4 py-6 pb-32 max-w-lg mx-auto space-y-6">
          {/* Sheikh message */}
          <div className="liquid-card p-4 flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
              <BookMarked className="w-5 h-5 text-gold-400" />
            </div>
            <p className="text-night-300 text-sm leading-relaxed">
              Which ayahs are you working on? I&apos;ll schedule them into your daily review cycle.
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm text-night-400 mb-2 block font-medium">Surah Number (1-114)</label>
              <input
                type="number"
                min="1"
                max="114"
                value={addSurah}
                onChange={(e) => setAddSurah(e.target.value)}
                placeholder="e.g. 67 (Al-Mulk)"
                className="w-full bg-night-800/50 border border-night-700/50 rounded-xl px-4 py-3 text-night-100 placeholder-night-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-night-400 mb-2 block font-medium">Start Ayah</label>
                <input
                  type="number"
                  min="1"
                  value={addStart}
                  onChange={(e) => setAddStart(e.target.value)}
                  placeholder="1"
                  className="w-full bg-night-800/50 border border-night-700/50 rounded-xl px-4 py-3 text-night-100 placeholder-night-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-night-400 mb-2 block font-medium">End Ayah</label>
                <input
                  type="number"
                  min="1"
                  value={addEnd}
                  onChange={(e) => setAddEnd(e.target.value)}
                  placeholder="(same)"
                  className="w-full bg-night-800/50 border border-night-700/50 rounded-xl px-4 py-3 text-night-100 placeholder-night-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleAddAyahs}
              disabled={!addSurah || !addStart}
              className="w-full liquid-btn py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add to Review Queue
            </button>
          </div>

          {/* Quick Add Presets */}
          <div className="pt-4 border-t border-night-800/50">
            <p className="text-xs text-night-500 mb-3 uppercase tracking-wider font-medium">Quick add popular surahs</p>
            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Al-Fatiha', surah: 1, start: 1, end: 7 },
                { name: 'Al-Ikhlas', surah: 112, start: 1, end: 4 },
                { name: 'Al-Falaq', surah: 113, start: 1, end: 5 },
                { name: 'An-Nas', surah: 114, start: 1, end: 6 },
                { name: 'Al-Mulk', surah: 67, start: 1, end: 30 },
                { name: 'Ya-Sin', surah: 36, start: 1, end: 83 },
              ].map((preset) => (
                <button
                  key={preset.surah}
                  onClick={() => {
                    srs.addAyahs(preset.surah, preset.start, preset.end);
                    refreshCounts();
                    setView('dashboard');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-night-800/50 border border-night-700/50 text-night-300 text-sm hover:bg-gold-500/10 hover:border-gold-500/30 hover:text-gold-400 transition-all"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </main>

        <BottomNav />
      </div>
    );
  }

  // ─── Dashboard View ──────────────────────────────────────────────

  return (
    <div className="min-h-screen">
      {/* Calibration Banner */}
      {!isCalibrated && (
        <Link href="/onboarding" className="liquid-card mx-4 mt-3 p-3 flex items-center gap-3 bg-gold-500/5 border-gold-500/20">
          <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span className="text-sm text-night-300">Personalize your experience</span>
          <ArrowRight className="w-4 h-4 text-night-500 ml-auto flex-shrink-0" />
        </Link>
      )}

      {/* Header */}
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl text-night-100">
              {getGreeting()}, {user?.firstName || 'Student'}
            </h1>
            <p className="text-sm text-night-500">
              {dueCount.total > 0
                ? `${dueCount.total} ayah${dueCount.total !== 1 ? 's' : ''} waiting for review`
                : 'All caught up! Add more ayahs to memorize.'}
            </p>
          </div>
          <div className="flex flex-col items-center px-3 py-2 rounded-xl bg-gold-500/10 border border-gold-500/20">
            <span className="text-lg font-bold text-gold-400">{stats.longestStreak}</span>
            <span className="text-[10px] text-gold-500/70 uppercase tracking-wider">day streak</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-6 pb-32 max-w-lg mx-auto space-y-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="liquid-card p-6 animate-pulse">
                <div className="h-4 bg-night-800 rounded w-1/3 mb-3" />
                <div className="h-3 bg-night-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Review Cards */}
            {dueCount.total > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-night-500 uppercase tracking-wider mb-3">Today&apos;s Review</h2>
                <div className="space-y-2">
                  {dueCount.sabaq > 0 && (
                    <ReviewCard emoji="" icon={Sprout} label="Sabaq" description="New lesson review" count={dueCount.sabaq} accent="text-sage-400" accentBg="bg-sage-500/10" />
                  )}
                  {dueCount.sabqi > 0 && (
                    <ReviewCard emoji="" icon={Leaf} label="Sabqi" description="Recent review" count={dueCount.sabqi} accent="text-blue-400" accentBg="bg-blue-500/10" />
                  )}
                  {dueCount.manzil > 0 && (
                    <ReviewCard emoji="" icon={TreePine} label="Manzil" description="Long-term review" count={dueCount.manzil} accent="text-gold-400" accentBg="bg-gold-500/10" />
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={startReview}
                  disabled={loadingReview}
                  className="w-full mt-4 liquid-btn py-3.5 text-base disabled:opacity-50"
                >
                  {loadingReview ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-night-950 border-t-transparent rounded-full animate-spin" />
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Start Review Session ({dueCount.total} ayahs)
                    </span>
                  )}
                </motion.button>
              </section>
            )}

            {/* Practice Tools */}
            <section>
              <h2 className="text-xs font-semibold text-night-500 uppercase tracking-wider mb-3">Practice Tools</h2>
              <div className="space-y-2">
                <Link
                  href="/recite"
                  className="liquid-card p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-night-100 font-medium">Live Recitation</p>
                    <p className="text-xs text-night-500">Real-time word tracking and tajweed feedback</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-night-600" />
                </Link>

                <Link
                  href="/practice/flashcards"
                  className="liquid-card p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-night-100 font-medium">Flashcards</p>
                    <p className="text-xs text-night-500">Test your recall with spaced repetition cards</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-night-600" />
                </Link>

                <Link
                  href="/practice/review"
                  className="liquid-card p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-night-100 font-medium">Smart Review</p>
                    <p className="text-xs text-night-500">AI-prioritized verses based on difficulty</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-night-600" />
                </Link>

                <Link
                  href="/lessons"
                  className="liquid-card p-4 flex items-center gap-3 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-night-100 font-medium">Lessons</p>
                    <p className="text-xs text-night-500">Structured learning with guided instruction</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-night-600" />
                </Link>
              </div>
            </section>

            {/* Stats */}
            <section>
              <h2 className="text-xs font-semibold text-night-500 uppercase tracking-wider mb-3">Your Progress</h2>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Total Ayahs" value={stats.totalAyahs} icon={BookOpen} iconColor="text-gold-400" />
                <StatCard label="In Manzil" value={stats.manzilCount} icon={TreePine} iconColor="text-sage-400" />
                <StatCard label="Accuracy" value={`${Math.round(stats.averageAccuracy * 100)}%`} icon={Target} iconColor="text-teal-400" />
                <StatCard label="Days Active" value={stats.daysSinceStart} icon={Calendar} iconColor="text-purple-400" />
              </div>
            </section>

            {/* Add More */}
            {stats.totalAyahs > 0 && (
              <button
                onClick={() => setView('add-ayahs')}
                className="w-full liquid-card p-4 flex items-center justify-center gap-2 text-gold-400 hover:bg-gold-500/5 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Ayahs to Memorize</span>
              </button>
            )}

            {/* Sheikh Nudge */}
            {dueCount.total === 0 && stats.totalAyahs > 0 && (
              <div className="liquid-card p-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-gold-400" />
                </div>
                <p className="text-night-400 text-sm leading-relaxed">
                  Masha&apos;Allah, you&apos;re all caught up! Consider adding new ayahs
                  or reviewing your manzil for extra retention.
                </p>
              </div>
            )}

            {/* Empty State — Quick Start */}
            {stats.totalAyahs === 0 && (
              <div className="space-y-6">
                {/* Welcome */}
                <div className="text-center pt-4 pb-2">
                  <div className="w-14 h-14 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-7 h-7 text-gold-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-night-100 mb-2">Start Your Memorization Journey</h3>
                  <p className="text-night-400 text-sm leading-relaxed max-w-xs mx-auto">
                    Pick a starting point below, and Sheikh HIFZ will guide your daily review with spaced repetition.
                  </p>
                </div>

                {/* Quick Start Review */}
                <Link
                  href="/practice/review"
                  className="liquid-card p-4 flex items-center gap-3 bg-gold-500/5 border-gold-500/20 hover:bg-gold-500/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-gold-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-night-100 font-medium">Try a Quick Review</p>
                    <p className="text-xs text-night-500">Experience a sample review session</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gold-500" />
                </Link>

                {/* Popular Starting Points */}
                <section>
                  <h2 className="text-xs font-semibold text-night-500 uppercase tracking-wider mb-3">Popular Starting Points</h2>
                  <div className="space-y-2">
                    {[
                      {
                        icon: Star,
                        iconColor: 'text-gold-400',
                        iconBg: 'bg-gold-500/15',
                        title: 'Al-Fatihah',
                        desc: 'The Opening — 7 ayahs, recited in every prayer',
                        action: () => { srs.addAyahs(1, 1, 7); refreshCounts(); },
                      },
                      {
                        icon: BookOpen,
                        iconColor: 'text-teal-400',
                        iconBg: 'bg-teal-500/15',
                        title: 'Last 10 Surahs',
                        desc: 'Short surahs perfect for beginners (An-Nasr to An-Nas)',
                        action: () => {
                          const last10: [number, number, number][] = [
                            [105, 1, 5], [106, 1, 4], [107, 1, 7], [108, 1, 3], [109, 1, 6],
                            [110, 1, 3], [111, 1, 5], [112, 1, 4], [113, 1, 5], [114, 1, 6],
                          ];
                          for (const [s, a, e] of last10) srs.addAyahs(s, a, e);
                          refreshCounts();
                        },
                      },
                      {
                        icon: Sparkles,
                        iconColor: 'text-purple-400',
                        iconBg: 'bg-purple-500/15',
                        title: 'Ayat al-Kursi',
                        desc: 'The Throne Verse — Surah Al-Baqarah, Ayah 255',
                        action: () => { srs.addAyahs(2, 255, 255); refreshCounts(); },
                      },
                    ].map((preset) => (
                      <motion.button
                        key={preset.title}
                        whileHover={{ scale: 1.01, boxShadow: '0 0 20px rgba(201, 162, 39, 0.08)' }}
                        whileTap={{ scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        onClick={preset.action}
                        className="w-full liquid-card p-4 flex items-center gap-3 text-left hover:bg-white/[0.04] hover:border-gold-500/15 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-xl ${preset.iconBg} flex items-center justify-center flex-shrink-0`}>
                          <preset.icon className={`w-5 h-5 ${preset.iconColor}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-night-100 font-medium">{preset.title}</p>
                          <p className="text-xs text-night-500 truncate">{preset.desc}</p>
                        </div>
                        <Plus className="w-4 h-4 text-night-600 flex-shrink-0" />
                      </motion.button>
                    ))}
                  </div>
                </section>

                {/* Secondary: manual add */}
                <button
                  onClick={() => setView('add-ayahs')}
                  className="w-full liquid-card p-4 flex items-center justify-center gap-2 text-night-400 hover:text-gold-400 hover:bg-gold-500/5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add specific ayahs manually</span>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────

function ReviewCard({ emoji, icon: Icon, label, description, count, accent, accentBg }: {
  emoji: string; icon: React.ElementType; label: string; description: string; count: number; accent: string; accentBg: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="liquid-card p-4 flex items-center justify-between cursor-default">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${accent}`} />
        </div>
        <div>
          <p className={`font-medium ${accent}`}>{label}</p>
          <p className="text-xs text-night-500">{description}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-xl font-bold ${accent}`}>{count}</span>
        <p className="text-[10px] text-night-600 uppercase tracking-wider">due</p>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, iconColor }: { label: string; value: string | number; icon: React.ElementType; iconColor: string }) {
  return (
    <div className="liquid-card p-4 flex flex-col items-center gap-1.5 text-center">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      <span className="text-lg font-bold text-gold-400">{value}</span>
      <span className="text-[10px] text-night-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Sabah al-Khayr';
  if (hour >= 12 && hour < 17) return 'As-Salamu Alaykum';
  if (hour >= 17 && hour < 21) return "Masa' al-Khayr";
  return 'As-Salamu Alaykum';
}
