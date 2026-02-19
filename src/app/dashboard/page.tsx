'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import {
  Flame,
  BookOpen,
  Sparkles,
  ChevronRight,
  Clock,
  Target,
  RefreshCw,
  Play,
  ArrowRight,
  Star,
  Zap,
  Award,
  AlertCircle,
  CheckCircle2,
  Mic,
  GraduationCap,
  BookMarked,
  TrendingUp,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import AnimatedNumber from '@/components/AnimatedNumber';
import GuestBanner from '@/components/GuestBanner';
import DashboardGreeting from '@/components/DashboardGreeting';
import DailyGoalCard from '@/components/DailyGoalCard';
import NudgeBanner from '@/components/NudgeBanner';
import { getClientNudge } from '@/lib/nudges';
import {
  getStreakInfo,
  getDailyGoalStatus,
  getQuranProgress,
  getAchievements,
  getSurahProgressList,
  type SurahProgressItem,
} from '@/lib/motivationStore';
import { getProgress } from '@/lib/progressStore';
import { useLearningPreferences } from '@/lib/preferencesStore';
import { SURAH_METADATA } from '@/lib/surahMetadata';

// ============================================
// Types
// ============================================

interface ReviewQueueData {
  total: number;
  items: Array<{
    surahNumber: number;
    ayahNumber: number;
    surahName: string;
  }>;
}

interface RecentSession {
  surahNumber: number;
  surahName: string;
  accuracy: number;
  createdAt: string;
  duration: number;
}

interface WeeklyStats {
  minutesStudied: number;
  versesReviewed: number;
  averageAccuracy: number;
  currentStreak: number;
}

// ============================================
// Animation Variants
// ============================================

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

// ============================================
// Helpers
// ============================================

function getGreetingArabic(): string {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 12) return 'صباح الخير';
  if (hour >= 12 && hour < 17) return 'مساء الخير';
  if (hour >= 17 && hour < 21) return 'مساء النور';
  return 'تصبح على خير';
}

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 3 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
}

function getApproxHijriDate(): string {
  // Simple Hijri approximation (not astronomically precise)
  const gregorian = new Date();
  const epochDiff = 227015; // Julian day diff between Hijri and Gregorian epochs
  const julianDay =
    Math.floor(365.25 * (gregorian.getFullYear() + 4716)) +
    Math.floor(30.6001 * (gregorian.getMonth() + 2)) +
    gregorian.getDate() -
    1524;
  const hijriJD = julianDay - 1948439.5;
  const hijriYear = Math.floor((30 * hijriJD + 10646) / 10631);
  const temp = Math.floor(hijriJD - Math.floor((10631 * hijriYear - 10617) / 30));
  const hijriMonth = Math.min(12, Math.ceil((temp + 28.5001) / 29.5));
  const hijriDay = Math.max(1, temp - Math.floor((29.5001 * hijriMonth - 29) / 1) + 1);

  const hijriMonths = [
    'Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Thani",
    'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', "Sha'ban",
    'Ramadan', 'Shawwal', "Dhul Qi'dah", 'Dhul Hijjah',
  ];

  const monthName = hijriMonths[Math.max(0, Math.min(11, hijriMonth - 1))];
  return `${hijriDay} ${monthName} ${hijriYear} AH`;
}

function getGregorianDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  return `${mins}m`;
}

// ============================================
// Sub-components
// ============================================

function CircularProgress({
  progress,
  size = 80,
  strokeWidth = 6,
  children,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, progress) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-night-800, #1a2420)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-gold-600, #b8860b)" />
            <stop offset="100%" stopColor="var(--color-gold-400, #daa520)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}

function ReviewAlert({ total, onStart }: { total: number; onStart: () => void }) {
  if (total === 0) {
    return (
      <motion.div variants={fadeInUp} className="liquid-glass rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sage-500/20 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-sage-400" />
          </div>
          <div>
            <p className="text-night-100 font-medium">All caught up!</p>
            <p className="text-night-500 text-sm">No overdue reviews. Great job!</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const urgencyColor =
    total > 20
      ? 'from-rose-500/20 via-rose-500/10 to-rose-600/5 border-rose-500/20'
      : total > 10
      ? 'from-amber-500/20 via-amber-500/10 to-amber-600/5 border-amber-500/20'
      : 'from-gold-500/20 via-gold-500/10 to-gold-600/5 border-gold-500/20';

  const urgencyTextColor =
    total > 20 ? 'text-rose-400' : total > 10 ? 'text-amber-400' : 'text-gold-400';

  return (
    <motion.div variants={fadeInUp}>
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onStart}
        className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer bg-gradient-to-br ${urgencyColor} border transition-all`}
        style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
      >
        <div className="relative z-10 flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl bg-night-900/50 flex items-center justify-center ${urgencyTextColor}`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-night-100 font-semibold text-lg">
              {total} verse{total !== 1 ? 's' : ''} need review
            </h3>
            <p className="text-night-400 text-sm">
              {total > 20
                ? 'Overdue — review soon to retain progress'
                : total > 10
                ? 'Getting behind — start a quick session'
                : 'Stay on track with a review'}
            </p>
          </div>
          <div className={`px-4 py-2 rounded-xl bg-night-900/50 ${urgencyTextColor} font-medium text-sm`}>
            Start Review
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function WeeklyStatsGrid({ stats }: { stats: WeeklyStats }) {
  const items = [
    { icon: Clock, value: `${stats.minutesStudied}`, label: 'Minutes This Week', color: 'text-teal-400', bg: 'bg-teal-500/20' },
    { icon: BookOpen, value: `${stats.versesReviewed}`, label: 'Verses Reviewed', color: 'text-gold-400', bg: 'bg-gold-500/20' },
    { icon: TrendingUp, value: `${stats.averageAccuracy}%`, label: 'Avg Accuracy', color: 'text-sage-400', bg: 'bg-sage-500/20' },
    { icon: Flame, value: `${stats.currentStreak}`, label: 'Day Streak', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <motion.div key={i} variants={scaleIn} className="liquid-glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center`}>
              <item.icon className={`w-4 h-4 ${item.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-night-100">
            <AnimatedNumber value={parseInt(String(item.value).replace('%', '')) || 0} suffix={String(item.value).includes('%') ? '%' : ''} />
          </p>
          <p className="text-xs text-night-500 mt-0.5">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

function RecentActivityList({ sessions }: { sessions: RecentSession[] }) {
  if (sessions.length === 0) {
    return (
      <motion.div variants={fadeInUp} className="liquid-glass rounded-2xl p-6 text-center">
        <Sparkles className="w-8 h-8 text-night-600 mx-auto mb-3" />
        <p className="text-night-400">No recent sessions yet.</p>
        <Link
          href="/recite"
          className="inline-flex items-center gap-2 mt-3 text-gold-400 hover:text-gold-300 transition-colors text-sm"
        >
          Start reciting <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeInUp} className="liquid-glass rounded-2xl divide-y divide-night-800/50">
      {sessions.map((session, i) => {
        const accuracyColor =
          session.accuracy >= 80
            ? 'text-sage-400'
            : session.accuracy >= 50
            ? 'text-amber-400'
            : 'text-rose-400';
        return (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="w-10 h-10 rounded-xl bg-night-800 flex items-center justify-center text-night-300 font-medium text-sm">
              {session.surahNumber}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-night-200 text-sm font-medium truncate">{session.surahName}</p>
              <p className="text-night-500 text-xs">{formatDuration(session.duration)} · {timeAgo(session.createdAt)}</p>
            </div>
            <span className={`text-sm font-semibold ${accuracyColor}`}>{session.accuracy}%</span>
          </div>
        );
      })}
    </motion.div>
  );
}

function QuickActions() {
  const actions = [
    { icon: BookMarked, label: 'Mushaf', href: '/mushaf', color: 'text-teal-400', bg: 'bg-teal-500/20' },
    { icon: Mic, label: 'Recite', href: '/recite', color: 'text-gold-400', bg: 'bg-gold-500/20' },
    { icon: GraduationCap, label: 'Lessons', href: '/lessons', color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { icon: Zap, label: 'Flashcards', href: '/practice/flashcards', color: 'text-amber-400', bg: 'bg-amber-500/20' },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action, i) => (
        <Link key={i} href={action.href}>
          <motion.div
            variants={scaleIn}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            className="liquid-glass rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-xl ${action.bg} flex items-center justify-center`}>
              <action.icon className={`w-5 h-5 ${action.color}`} />
            </div>
            <span className="text-night-400 text-xs font-medium">{action.label}</span>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}

// ============================================
// Main Dashboard
// ============================================

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { learning: learningPrefs } = useLearningPreferences();
  const [hasSynced, setHasSynced] = useState(false);

  // Local state (localStorage-based)
  const [streakInfo, setStreakInfo] = useState(getStreakInfo());
  const [goalStatus, setGoalStatus] = useState(getDailyGoalStatus());
  const [quranProgress, setQuranProgress] = useState(getQuranProgress());
  const [surahProgress, setSurahProgress] = useState<SurahProgressItem[]>([]);
  const [userProgress, setUserProgress] = useState(getProgress());

  // Daily goal + nudge state
  const [serverGoal, setServerGoal] = useState<{
    targetMinutes: number; targetVerses: number;
    completedMinutes: number; completedVerses: number;
    isComplete: boolean;
  } | null>(null);
  const [serverStreak, setServerStreak] = useState(0);
  const [nudgeMessage, setNudgeMessage] = useState<string | null>(null);
  const [nudgeType, setNudgeType] = useState<string | undefined>();
  const [goalLoading, setGoalLoading] = useState(true);

  // Server-fetched state
  const [reviewQueue, setReviewQueue] = useState<ReviewQueueData>({ total: 0, items: [] });
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    minutesStudied: 0,
    versesReviewed: 0,
    averageAccuracy: 0,
    currentStreak: 0,
  });

  // Sync local data on sign in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasSynced) return;
    const migrateLocalData = async () => {
      try {
        const onboardingData = localStorage.getItem('quranOasis_onboarding');
        if (onboardingData) {
          await fetch('/api/onboarding', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: onboardingData,
          });
        }
        const prefs = localStorage.getItem('quranOasis_preferences');
        if (prefs) {
          const parsed = JSON.parse(prefs);
          await fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ settings: { preferredReciter: parsed.reciter } }),
          });
        }
        localStorage.removeItem('quranOasis_guestMode');
        setHasSynced(true);
      } catch (error) {
        console.error('Failed to migrate local data:', error);
      }
    };
    migrateLocalData();
  }, [isLoaded, isSignedIn, hasSynced]);

  // Load local data
  useEffect(() => {
    const loadData = () => {
      setStreakInfo(getStreakInfo());
      setGoalStatus(getDailyGoalStatus());
      setQuranProgress(getQuranProgress());
      setSurahProgress(getSurahProgressList());
      setUserProgress(getProgress());
    };
    loadData();
    window.addEventListener('motivation-updated', loadData);
    window.addEventListener('progress-updated', loadData);
    return () => {
      window.removeEventListener('motivation-updated', loadData);
      window.removeEventListener('progress-updated', loadData);
    };
  }, []);

  // Fetch daily goal + nudge
  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      fetch('/api/goals/daily')
        .then(r => r.ok ? r.json() : null)
        .then(data => {
          if (data) {
            setServerGoal(data.goal);
            setServerStreak(data.streak);
            if (data.nudge) {
              setNudgeMessage(data.nudge.message);
              setNudgeType(data.nudge.type);
            }
          }
          setGoalLoading(false);
        })
        .catch(() => setGoalLoading(false));
    } else {
      const nudge = getClientNudge({
        streakDays: streakInfo.current,
        totalVerses: quranProgress.versesMemorized,
        daysSinceLastVisit: 0,
        goalComplete: goalStatus.progress >= goalStatus.target,
      });
      setNudgeMessage(nudge.message);
      setNudgeType(nudge.type);
      setGoalLoading(false);
    }
  }, [isLoaded, isSignedIn]);

  // Fetch server data for signed-in users
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    // Fetch review queue
    fetch('/api/review/queue?limit=20')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.queue) {
          setReviewQueue({
            total: data.queue.length,
            items: data.queue.map((item: { surahNumber: number; ayahNumber: number }) => {
              const meta = SURAH_METADATA[item.surahNumber];
              return {
                surahNumber: item.surahNumber,
                ayahNumber: item.ayahNumber,
                surahName: meta?.englishName || `Surah ${item.surahNumber}`,
              };
            }),
          });
        }
      })
      .catch(() => {});

    // Fetch recent recitation sessions
    fetch('/api/recitation?limit=5')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.sessions) {
          setRecentSessions(
            data.sessions.map((s: { surahNumber: number; overallAccuracy: number; createdAt: string; duration: number }) => {
              const meta = SURAH_METADATA[s.surahNumber];
              return {
                surahNumber: s.surahNumber,
                surahName: meta?.englishName || `Surah ${s.surahNumber}`,
                accuracy: s.overallAccuracy,
                createdAt: s.createdAt,
                duration: s.duration,
              };
            })
          );
        }
      })
      .catch(() => {});
  }, [isLoaded, isSignedIn]);

  // Computed values
  const displayName = useMemo(() => {
    if (isSignedIn && user) return user.firstName || user.username || 'Learner';
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quranOasis_userName');
      if (stored) return stored;
    }
    return 'Learner';
  }, [isSignedIn, user]);

  const lastActiveVerse = useMemo(() => {
    const verses = userProgress.verses;
    const verseEntries = Object.entries(verses);
    if (verseEntries.length === 0) {
      return { surah: 1, ayah: 1, surahName: 'Al-Fatihah', arabicName: 'سُورَةُ ٱلْفَاتِحَةِ', progress: 0, totalAyahs: 7 };
    }
    let mostRecent = verseEntries[0];
    for (const entry of verseEntries) {
      if ((entry[1].lastReview || '') > (mostRecent[1].lastReview || '')) {
        mostRecent = entry;
      }
    }
    const [key] = mostRecent;
    const [surah, ayah] = key.split(':').map(Number);
    const surahMeta = SURAH_METADATA[surah];
    const surahData = surahProgress.find(s => s.surahNumber === surah);
    return {
      surah,
      ayah,
      surahName: surahMeta?.englishName || `Surah ${surah}`,
      arabicName: surahMeta?.name || '',
      progress: surahData?.percentage || 0,
      totalAyahs: surahMeta?.numberOfAyahs || 0,
    };
  }, [userProgress, surahProgress]);

  const goalProgress = useMemo(() => {
    const target = learningPrefs.dailyGoalVerses || goalStatus.target;
    return Math.min(100, Math.round((goalStatus.progress / Math.max(1, target)) * 100));
  }, [goalStatus, learningPrefs]);

  // Merge local + server streak
  const effectiveStreak = useMemo(() => {
    return Math.max(streakInfo.current, weeklyStats.currentStreak);
  }, [streakInfo, weeklyStats]);

  const handleStartReview = useCallback(() => {
    window.location.href = '/practice/review';
  }, []);

  return (
    <div className="min-h-screen">
      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">
          {/* Guest Banner */}
          {isLoaded && !isSignedIn && <GuestBanner />}

          {/* ── 1. Greeting Header ── */}
          <motion.header variants={fadeInUp} className="pt-4 pb-1">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-night-500 text-xs uppercase tracking-wider mb-1">
                  {getGregorianDate()}
                </p>
                <p className="text-night-600 text-xs font-arabic" dir="rtl">
                  {getApproxHijriDate()}
                </p>
              </div>
              {/* Streak Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-night-900 border border-night-800"
              >
                <Flame className={`w-5 h-5 ${effectiveStreak > 0 ? 'text-orange-400' : 'text-night-600'}`} />
                <span className="font-bold text-night-100">{effectiveStreak}</span>
                <span className="text-night-500 text-xs">day{effectiveStreak !== 1 ? 's' : ''}</span>
              </motion.div>
            </div>

            <h1 className="text-2xl font-bold text-night-100">
              Assalamu Alaikum, {displayName}
            </h1>
            <p className="text-night-400 text-sm mt-1">{getTimeGreeting()} — may your recitation be blessed today</p>
          </motion.header>

          {/* AI Sheikh Greeting (contextual) */}
          <motion.section variants={fadeInUp}>
            <DashboardGreeting
              userName={displayName}
              userLevel="beginner"
              streakDays={effectiveStreak}
              totalVersesMemorized={quranProgress.versesMemorized}
              totalSurahsCompleted={surahProgress.filter(s => s.status === 'complete').length}
              currentProgress={lastActiveVerse.surahName}
              lastStudied={
                quranProgress.versesMemorized > 0
                  ? {
                      surahName: lastActiveVerse.surahName,
                      ayahNumber: lastActiveVerse.ayah,
                      daysAgo: 0,
                    }
                  : undefined
              }
            />
          </motion.section>

          {/* ── 2. Daily Goal with Circular Progress Ring ── */}
          <motion.section variants={fadeInUp}>
            <DailyGoalCard
              goal={serverGoal ?? {
                targetMinutes: 20,
                targetVerses: learningPrefs.dailyGoalVerses || goalStatus.target,
                completedMinutes: 0,
                completedVerses: goalStatus.progress,
                isComplete: goalProgress >= 100,
              }}
              streak={isSignedIn ? serverStreak : streakInfo.current}
              loading={goalLoading}
            />
          </motion.section>

          {/* ── 2b. Motivational Nudge ── */}
          {nudgeMessage && (
            <motion.section variants={fadeInUp}>
              <NudgeBanner message={nudgeMessage} type={nudgeType} variant="card" />
            </motion.section>
          )}

          {/* Toast nudge on page load */}
          <NudgeBanner message={nudgeMessage} type={nudgeType} variant="toast" />

          {/* ── 3. Smart Review Alert ── */}
          {isSignedIn && (
            <ReviewAlert total={reviewQueue.total} onStart={handleStartReview} />
          )}

          {/* ── 4. Continue Learning ── */}
          {quranProgress.versesMemorized > 0 && (
            <motion.section variants={fadeInUp}>
              <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">
                Continue Learning
              </h2>
              <Link href={`/memorize/${lastActiveVerse.surah}/${lastActiveVerse.ayah}`}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="liquid-card rounded-2xl p-5 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center">
                        <span className="text-gold-400 font-semibold">{lastActiveVerse.surah}</span>
                      </div>
                      <div>
                        <h4 className="text-night-100 font-medium">{lastActiveVerse.surahName}</h4>
                        <p className="text-night-600 text-xs font-arabic" dir="rtl">
                          {lastActiveVerse.arabicName}
                        </p>
                        <p className="text-night-500 text-sm">Ayah {lastActiveVerse.ayah} of {lastActiveVerse.totalAyahs}</p>
                      </div>
                    </div>
                    <motion.div className="w-11 h-11 rounded-full bg-gold-500 flex items-center justify-center text-night-950 group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5" />
                    </motion.div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-night-800 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${lastActiveVerse.progress}%` }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                    </div>
                    <span className="text-night-400 text-sm font-medium">{lastActiveVerse.progress}%</span>
                  </div>
                </motion.div>
              </Link>
            </motion.section>
          )}

          {/* ── 5. Weekly Stats Grid ── */}
          <motion.section variants={fadeInUp}>
            <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">
              This Week
            </h2>
            <WeeklyStatsGrid
              stats={{
                minutesStudied: weeklyStats.minutesStudied,
                versesReviewed: weeklyStats.versesReviewed || quranProgress.versesMemorized,
                averageAccuracy: weeklyStats.averageAccuracy,
                currentStreak: effectiveStreak,
              }}
            />
          </motion.section>

          {/* ── 6. Recent Activity ── */}
          <motion.section variants={fadeInUp}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-night-500 text-xs uppercase tracking-wider">Recent Activity</h2>
              {recentSessions.length > 0 && (
                <Link href="/recite/history" className="text-gold-400 text-xs hover:text-gold-300 transition-colors">
                  View all
                </Link>
              )}
            </div>
            <RecentActivityList sessions={recentSessions} />
          </motion.section>

          {/* ── 7. Quick Actions ── */}
          <motion.section variants={fadeInUp}>
            <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">
              Quick Actions
            </h2>
            <QuickActions />
          </motion.section>

          {/* New User CTA */}
          {quranProgress.versesMemorized === 0 && (
            <motion.section variants={fadeInUp} className="mt-2">
              <div className="space-y-4">
                {/* Primary CTA */}
                <div className="liquid-glass-gold-premium rounded-2xl p-6 text-center">
                  <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-night-100 mb-2">Begin Your Journey</h3>
                  <p className="text-night-400 mb-5 max-w-sm mx-auto">
                    Start with Al-Fatihah or pick any surah to begin your memorization journey.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/memorize/1/1" className="liquid-btn inline-flex items-center justify-center gap-2">
                      <BookOpen className="w-4 h-4" /> Start with Al-Fatihah
                    </Link>
                    <Link
                      href="/surahs"
                      className="liquid-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-night-600 text-night-200 hover:bg-night-800/50 transition-colors"
                    >
                      Browse Surahs
                    </Link>
                  </div>
                </div>

                {/* Feature Discovery Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link href="/recite" className="liquid-glass rounded-2xl p-4 flex items-center gap-4 group hover:border-gold-500/20 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-gold-500/15 flex items-center justify-center flex-shrink-0">
                      <Mic className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <h4 className="text-night-100 font-medium text-sm">Recite & Track</h4>
                      <p className="text-night-500 text-xs">Voice recognition scores your accuracy</p>
                    </div>
                  </Link>
                  <Link href="/identify" className="liquid-glass rounded-2xl p-4 flex items-center gap-4 group hover:border-gold-500/20 transition-all">
                    <div className="w-11 h-11 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="text-night-100 font-medium text-sm">Identify Verses</h4>
                      <p className="text-night-500 text-xs">Shazam for Quran — find any ayah</p>
                    </div>
                  </Link>
                </div>
              </div>
            </motion.section>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
