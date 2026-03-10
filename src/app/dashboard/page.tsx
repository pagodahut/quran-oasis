'use client';

import { useStudyTracker } from '@/lib/studyTracker';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useCalibrationGuard } from '@/hooks/useCalibrationGuard';
import {
  Flame,
  BookOpen,
  Sparkles,
  ChevronRight,
  Clock,
  Target,
  Calendar,
  RefreshCw,
  Play,
  ArrowRight,
  Star,
  Zap,
  Award,
  Mic,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { StreakDisplay } from '@/components/Celebrations';
import { GlassPanel } from '@/components/ui/GlassPanel';
import LiquidButton from '@/components/ui/LiquidButton';
import LiquidPill from '@/components/ui/LiquidPill';
import {
  getStreakInfo,
  getDailyGoalStatus,
  getQuranProgress,
  getAchievements,
  getSurahProgressList,
  getJuzProgress,
  type SurahProgressItem,
} from '@/lib/motivationStore';
import { getProgress } from '@/lib/progressStore';
import { useLearningPreferences } from '@/lib/preferencesStore';
import { SURAH_METADATA } from '@/lib/surahMetadata';
import { isRamadan, isLastTenNights, isJummah, getRamadanDay } from '@/lib/islamic-calendar';

// ============================================
// Animation Variants
// ============================================

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
  }
};

// ============================================
// Helper Functions
// ============================================

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Sabah al-Khayr';
  if (hour >= 12 && hour < 17) return 'As-Salamu Alaykum';
  if (hour >= 17 && hour < 21) return "Masa' al-Khayr";
  return 'As-Salamu Alaykum';
}

const INSPIRATION_MESSAGES = [
  '"Whoever recites a letter from the Book of Allah will receive a good deed, and each good deed is multiplied by ten." — Prophet Muhammad ﷺ (Tirmidhi)',
  '"The Quran will be a proof for you or against you." — Prophet Muhammad ﷺ (Muslim)',
  '"The best among you are those who learn the Quran and teach it." — Prophet Muhammad ﷺ (Bukhari)',
  '"Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection." — Prophet Muhammad ﷺ (Muslim)',
  '"The one who is proficient in the recitation of the Quran will be with the honourable and obedient scribes (angels)." — Prophet Muhammad ﷺ (Bukhari & Muslim)',
  '"Verily the one who recites the Quran beautifully and precisely, will be in the company of the noble and obedient angels." — Prophet Muhammad ﷺ (Bukhari)',
  '"Indeed, Allah elevates some people with this Quran and degrades others with it." — Prophet Muhammad ﷺ (Muslim)',
  '"It will be said to the companion of the Quran: Read and ascend, and beautify your voice as you used to in the world." — Prophet Muhammad ﷺ (Abu Dawud & Tirmidhi)',
  '"Do not make your houses graveyards. Indeed, Shaytan flees from the house in which Surah Al-Baqarah is recited." — Prophet Muhammad ﷺ (Muslim)',
  '"The Quran is a rich treasure — whoever finds it has found great wealth." — Abdullah ibn Mas\'ud (رضي الله عنه)',
  'Every verse you memorize is a seed planted for your akhirah. Keep going! 🌱',
  'Consistency is the key to Hifz. Even one ayah a day adds up to 365 ayahs a year.',
  'The journey of a thousand miles begins with a single step. You are already on the path. ✨',
  'Remember: the Quran was revealed gradually over 23 years. Be patient with yourself.',
];

function getInspirationMessage(): string {
  // Use day of year + hour so it changes a few times a day
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
  const index = (dayOfYear * 3 + Math.floor(now.getHours() / 8)) % INSPIRATION_MESSAGES.length;
  return INSPIRATION_MESSAGES[index];
}

function getIslamicDate(): string {
  // Simple approximation - for accurate dates would need a proper Islamic calendar library
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  };
  return new Date().toLocaleDateString('en-US', options);
}

function formatLastActive(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ============================================
// Components
// ============================================

function DailyFocusCard({
  variant,
  icon: Icon,
  title,
  subtitle,
  meta,
  href,
  onClick,
}: {
  variant: 'memorize' | 'review';
  icon: React.ElementType;
  title: string;
  subtitle: string;
  meta: string;
  href?: string;
  onClick?: () => void;
}) {
  const iconBgClass = variant === 'memorize'
    ? 'bg-gold-500/20 text-gold-400'
    : 'bg-sage-500/20 text-sage-400';

  const ariaLabel = `${title}: ${subtitle}, ${meta}`;

  const content = (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    >
      <GlassPanel
        tint={variant === 'memorize' ? 'gold' : 'sage'}
        blur="md"
        glow={variant === 'memorize'}
        className="p-5 cursor-pointer"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-30 pattern-arabesque" />

        {/* Content */}
        <div className="relative z-10">
          <div className={`w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center mb-4`}>
            <Icon className="w-6 h-6" aria-hidden="true" />
          </div>

          <h3 className="text-lg font-semibold text-night-100 mb-1">{title}</h3>
          <p className="text-night-300 text-base mb-3">{subtitle}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-night-500">{meta}</span>
            <ChevronRight className="w-4 h-4 text-night-500" aria-hidden="true" />
          </div>
        </div>
      </GlassPanel>
    </motion.div>
  );

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className="block">
        {content}
      </Link>
    );
  }

  return <div onClick={onClick}>{content}</div>;
}

function ContinueCard({
  surahNumber,
  surahName,
  ayahNumber,
  progress,
  href,
}: {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  progress: number;
  href: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        variants={fadeInUp}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <GlassPanel tint="neutral" blur="md" className="p-5 cursor-pointer group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center text-gold-400 font-semibold">
                  {surahNumber}
                </div>
                <div>
                  <h4 className="text-night-100 font-medium">{surahName}</h4>
                  <p className="text-night-500 text-sm">Ayah {ayahNumber}</p>
                </div>
              </div>
              <motion.div
                className="w-10 h-10 rounded-full bg-gold-500 flex items-center justify-center text-night-950 group-hover:scale-110 transition-transform"
              >
                <Play className="w-5 h-5 ml-0.5" />
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 rounded-full bg-night-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
              <span className="text-night-400 text-sm font-medium">{progress}%</span>
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </Link>
  );
}

function UpNextItem({
  number,
  name,
  meta,
  arabicName,
  status,
  href,
}: {
  number: number;
  name: string;
  meta: string;
  arabicName: string;
  status: 'due' | 'tomorrow' | 'weak' | 'new';
  href: string;
}) {
  const statusStyles = {
    due: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Due today' },
    tomorrow: { bg: 'bg-night-800', text: 'text-night-400', label: 'Tomorrow' },
    weak: { bg: 'bg-rose-500/20', text: 'text-rose-400', label: 'Needs review' },
    new: { bg: 'bg-teal-500/20', text: 'text-teal-400', label: 'New' },
  };

  const style = statusStyles[status];

  return (
    <Link href={href}>
      <motion.div
        variants={fadeInUp}
        whileHover={{ x: 4 }}
        className="flex items-center justify-between py-4 border-b border-night-800/50 last:border-0 cursor-pointer group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-night-800 flex items-center justify-center text-night-300 font-medium">
            {number}
          </div>
          <div>
            <h4 className="text-night-200 font-medium group-hover:text-night-100 transition-colors">{name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                {style.label}
              </span>
              <span className="text-night-600 text-xs">{meta}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-night-600 text-lg font-arabic opacity-50">{arabicName}</span>
          <ChevronRight className="w-4 h-4 text-night-600 group-hover:text-night-400 transition-colors" />
        </div>
      </motion.div>
    </Link>
  );
}

function QuickStat({
  icon: Icon,
  value,
  label,
  color
}: {
  icon: React.ElementType;
  value: string | number;
  label: string;
  color: string;
}) {
  return (
    <motion.div variants={scaleIn}>
      <GlassPanel tint="neutral" blur="sm" rounded="rounded-xl" className="p-4 text-center" role="img" aria-label={`${label}: ${value}`}>
        <div className="relative z-10">
          <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} aria-hidden="true" />
          <p className="text-xl font-bold text-night-100">{value}</p>
          <p className="text-xs text-night-500">{label}</p>
        </div>
      </GlassPanel>
    </motion.div>
  );
}

function RecentActivity({
  activities,
}: {
  activities: Array<{
    action: string;
    detail: string;
    time: string;
    icon: 'complete' | 'review' | 'streak' | 'achievement';
  }>;
}) {
  const iconMap = {
    complete: { icon: BookOpen, color: 'text-sage-400', bg: 'bg-sage-500/20' },
    review: { icon: RefreshCw, color: 'text-gold-400', bg: 'bg-gold-500/20' },
    streak: { icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/20' },
    achievement: { icon: Award, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  };

  if (activities.length === 0) {
    return (
      <motion.div variants={fadeInUp}>
        <GlassPanel tint="neutral" blur="md" className="p-6 text-center">
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 text-night-600 mx-auto mb-3" aria-hidden="true" />
            <p className="text-night-400">Start your first lesson to see your activity!</p>
            <Link
              href="/lessons"
              className="inline-flex items-center gap-2 mt-4 text-gold-400 hover:text-gold-300 transition-colors"
              aria-label="Begin learning to start tracking your activity"
            >
              Begin learning <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </GlassPanel>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeInUp}>
      <GlassPanel tint="neutral" blur="md" className="p-4">
        <ul className="relative z-10 space-y-3" role="list">
          {activities.map((activity, i) => {
            const { icon: Icon, color, bg } = iconMap[activity.icon];
            return (
              <li key={i} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${color}`} aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-night-200 text-sm truncate">{activity.action}</p>
                  <p className="text-night-500 text-xs">{activity.detail}</p>
                </div>
                <time className="text-night-600 text-xs flex-shrink-0" dateTime={activity.time}>
                  {activity.time}
                </time>
              </li>
            );
          })}
        </ul>
      </GlassPanel>
    </motion.div>
  );
}

// ============================================
// Main Dashboard Page
// ============================================

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useAuth();
  useStudyTracker('dashboard');
  const { learning: learningPrefs } = useLearningPreferences();
  const { isChecking } = useCalibrationGuard();

  // State
  const [streakInfo, setStreakInfo] = useState(getStreakInfo());
  const [goalStatus, setGoalStatus] = useState(getDailyGoalStatus());
  const [quranProgress, setQuranProgress] = useState(getQuranProgress());
  const [achievements, setAchievements] = useState(getAchievements());
  const [surahProgress, setSurahProgress] = useState<SurahProgressItem[]>([]);
  const [userProgress, setUserProgress] = useState(getProgress());

  // Load all data
  useEffect(() => {
    const loadData = () => {
      setStreakInfo(getStreakInfo());
      setGoalStatus(getDailyGoalStatus());
      setQuranProgress(getQuranProgress());
      setAchievements(getAchievements());
      setSurahProgress(getSurahProgressList());
      setUserProgress(getProgress());
    };

    loadData();

    // Listen for updates
    window.addEventListener('motivation-updated', loadData);
    window.addEventListener('progress-updated', loadData);

    return () => {
      window.removeEventListener('motivation-updated', loadData);
      window.removeEventListener('progress-updated', loadData);
    };
  }, []);

  // Compute derived data
  const displayName = useMemo(() => {
    if (isSignedIn && user) {
      return user.firstName || 'Learner';
    }
    // Try localStorage for name
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quranOasis_userName');
      if (stored) return stored;
    }
    return 'Learner';
  }, [isSignedIn, user]);

  // Find last active surah/ayah
  const lastActiveVerse = useMemo(() => {
    const verses = userProgress.verses;
    const verseEntries = Object.entries(verses);

    if (verseEntries.length === 0) {
      // Default to Al-Fatihah if no progress
      return { surah: 1, ayah: 1, surahName: 'Al-Fatihah', progress: 0 };
    }

    // Find most recently updated verse
    let mostRecent = verseEntries[0];
    for (const entry of verseEntries) {
      if ((entry[1].lastReview || '') > (mostRecent[1].lastReview || '')) {
        mostRecent = entry;
      }
    }

    const [key] = mostRecent;
    const [surah, ayah] = key.split(':').map(Number);
    const surahMeta = SURAH_METADATA[surah];

    // Calculate progress for this surah
    const surahData = surahProgress.find(s => s.surahNumber === surah);

    return {
      surah,
      ayah,
      surahName: surahMeta?.name || `Surah ${surah}`,
      progress: surahData?.percentage || 0,
    };
  }, [userProgress, surahProgress]);

  // Get surahs that need review
  const reviewQueue = useMemo(() => {
    return surahProgress
      .filter(s => s.status === 'in_progress' || s.versesMemorized > 0)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 4)
      .map(s => {
        const status: 'due' | 'tomorrow' | 'weak' | 'new' =
          s.percentage < 30 ? 'weak' : s.percentage === 100 ? 'due' : 'new';
        return {
          number: s.surahNumber,
          name: s.englishName,
          meta: `${s.versesMemorized}/${s.totalVerses} verses`,
          arabicName: s.name,
          status,
        };
      });
  }, [surahProgress]);

  // Recent activity (mock for now - would come from a proper activity log)
  const recentActivity = useMemo(() => {
    const activities: Array<{
      action: string;
      detail: string;
      time: string;
      icon: 'complete' | 'review' | 'streak' | 'achievement';
    }> = [];

    // Add streak activity if active
    if (streakInfo.isActiveToday) {
      activities.push({
        action: 'Daily streak maintained',
        detail: `${streakInfo.current} day${streakInfo.current !== 1 ? 's' : ''} and counting`,
        time: 'Today',
        icon: 'streak',
      });
    }

    // Add achievement if recently unlocked
    const recentAchievement = achievements.unlocked[achievements.unlocked.length - 1];
    if (recentAchievement) {
      activities.push({
        action: `Earned: ${recentAchievement.name}`,
        detail: recentAchievement.description,
        time: recentAchievement.unlockedAt ? formatLastActive(recentAchievement.unlockedAt) : 'Recently',
        icon: 'achievement',
      });
    }

    // Add recent surah progress
    const recentSurah = surahProgress.find(s => s.status === 'in_progress');
    if (recentSurah) {
      activities.push({
        action: `Working on ${recentSurah.englishName}`,
        detail: `${recentSurah.versesMemorized} verses memorized`,
        time: 'In progress',
        icon: 'review',
      });
    }

    return activities.slice(0, 3);
  }, [streakInfo, achievements, surahProgress]);

  // Goal progress percentage
  const goalProgress = useMemo(() => {
    const target = learningPrefs.dailyGoalVerses || goalStatus.target;
    return Math.min(100, Math.round((goalStatus.progress / target) * 100));
  }, [goalStatus, learningPrefs]);

  const isRamadanNow = isRamadan();
  const lastTenNights = isLastTenNights();
  const ramadanDay = getRamadanDay();
  const isJummahToday = isJummah();

  // Show loading while checking calibration
  if (isChecking) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-night-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950">
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-night-800 focus:text-night-100 focus:rounded-lg focus:border focus:border-gold-500"
      >
        Skip to main content
      </a>

      {/* Main Content */}
      <main id="main-content" className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {/* Header with Greeting */}
          <motion.header variants={fadeInUp} className="pt-4 pb-2">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-night-100 mb-1">
                  {getGreeting()}, {displayName}
                </h1>
                <p className="text-night-500 text-sm">
                  {getIslamicDate()}
                </p>
              </div>

              {/* Streak Badge — LiquidPill */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <LiquidPill
                  selected={streakInfo.current > 0}
                  className="px-4 py-2 text-sm"
                >
                  <Flame className={`w-4 h-4 ${streakInfo.current > 0 ? 'text-orange-400' : 'text-night-600'}`} aria-hidden="true" />
                  <span className="font-bold text-night-100">{streakInfo.current}</span>
                  <span className="text-night-500 text-xs">day{streakInfo.current !== 1 ? 's' : ''}</span>
                </LiquidPill>
              </motion.div>
            </div>
          </motion.header>

          {/* Ramadan Banner */}
          {isRamadanNow && (
            <motion.div variants={fadeInUp}>
              <GlassPanel tint="gold" blur="md" glow>
                <div className="relative z-10 p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🌙</span>
                    <div className="flex-1">
                      <h2 className="text-gold-400 font-semibold text-lg mb-1">
                        Ramadan Mubarak! Day {ramadanDay} of Ramadan
                      </h2>
                      {lastTenNights ? (
                        <p className="text-night-300 text-sm">✨ The Last Ten Nights — seek Laylatul Qadr</p>
                      ) : (
                        <p className="text-night-400 text-sm">1 juz per day = complete the Quran this Ramadan</p>
                      )}
                    </div>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Jummah Banner */}
          {isJummahToday && (
            <motion.div variants={fadeInUp}>
              <Link href="/mushaf?surah=18" className="block">
                <GlassPanel tint="gold" blur="md" className="hover:opacity-90 transition-opacity">
                  <div className="relative z-10 p-4 flex items-center gap-3">
                    <span className="text-xl">🕌</span>
                    <div className="flex-1">
                      <p className="text-night-100 font-medium">Jummah Mubarak!</p>
                      <p className="text-night-400 text-sm">The Prophet ﷺ encouraged reciting Surah Al-Kahf on Fridays</p>
                    </div>
                    <span className="text-gold-400 text-sm font-medium whitespace-nowrap">Read →</span>
                  </div>
                </GlassPanel>
              </Link>
            </motion.div>
          )}

          {/* Inspirational Message */}
          <motion.div variants={fadeInUp}>
            <GlassPanel tint="neutral" blur="md" className="p-4">
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                </div>
                <div>
                  <p className="text-night-200 text-sm leading-relaxed italic">
                    {getInspirationMessage()}
                  </p>
                </div>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Daily Goal Progress */}
          <motion.div
            variants={fadeInUp}
            role="region"
            aria-labelledby="goal-heading"
          >
            <GlassPanel tint="gold" blur="md" className="p-4">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-gold-400" aria-hidden="true" />
                    <span id="goal-heading" className="text-night-300 text-sm">Today&apos;s Goal</span>
                  </div>
                  <span
                    className="text-gold-400 font-medium"
                    aria-label={`Progress: ${goalStatus.progress} of ${learningPrefs.dailyGoalVerses || goalStatus.target} verses completed`}
                  >
                    {goalStatus.progress}/{learningPrefs.dailyGoalVerses || goalStatus.target} verses
                  </span>
                </div>
                <div
                  className="h-2 rounded-full bg-night-800 overflow-hidden"
                  role="progressbar"
                  aria-valuenow={goalProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`Goal progress: ${goalProgress} percent complete`}
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${goalProgress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                {goalProgress >= 100 && (
                  <p className="text-sage-400 text-xs mt-2 flex items-center gap-1" aria-live="polite">
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    Goal completed! Keep going to earn bonus XP.
                  </p>
                )}
              </div>
            </GlassPanel>
          </motion.div>

          {/* Quick Stats Grid - Memorization Progress */}
          <motion.section variants={fadeInUp} role="region" aria-labelledby="progress-heading">
            <h2 id="progress-heading" className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Your Progress</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickStat
                icon={BookOpen}
                value={quranProgress.versesMemorized}
                label="Verses"
                color="text-gold-400"
              />
              <QuickStat
                icon={Zap}
                value={streakInfo.longest}
                label="Best Streak"
                color="text-orange-400"
              />
              <QuickStat
                icon={Award}
                value={achievements.unlocked.length}
                label="Achievements"
                color="text-purple-400"
              />
            </div>
            <Link
              href="/progress"
              className="flex items-center justify-center gap-2 mt-3 text-night-400 hover:text-night-200 transition-colors text-sm"
              aria-label="View detailed progress statistics"
            >
              View detailed progress <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </motion.section>

          {/* Daily Focus Cards */}
          <motion.section variants={fadeInUp} role="region" aria-labelledby="daily-focus-heading">
            <h2 id="daily-focus-heading" className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Daily Focus</h2>
            <div className="grid grid-cols-2 gap-3">
              <DailyFocusCard
                variant="memorize"
                icon={BookOpen}
                title="New Hifz"
                subtitle={lastActiveVerse.surahName}
                meta={`Ayah ${lastActiveVerse.ayah}`}
                href={`/memorize/${lastActiveVerse.surah}/${lastActiveVerse.ayah}`}
              />
              <DailyFocusCard
                variant="review"
                icon={RefreshCw}
                title="Review"
                subtitle={surahProgress.length > 0 ? `${surahProgress.filter(s => s.status === 'in_progress').length} surahs` : 'Start learning'}
                meta={`${quranProgress.versesMemorized} verses`}
                href="/practice"
              />
            </div>
            <div className="mt-3">
              <Link
                href="/recite"
                aria-label="Start live recitation practice with real-time tajweed feedback and word tracking"
                className="block"
              >
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <GlassPanel tint="sage" blur="md" className="cursor-pointer group">
                    <div className="relative z-10 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <Mic className="w-5 h-5" aria-hidden="true" />
                          </div>
                          <div>
                            <h4 className="text-night-100 font-medium">Live Recitation Practice</h4>
                            <p className="text-night-400 text-sm">Real-time tajweed feedback & word tracking</p>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-night-600 group-hover:text-night-400 transition-colors" aria-hidden="true" />
                      </div>
                    </div>
                  </GlassPanel>
                </motion.div>
              </Link>
            </div>
          </motion.section>

          {/* Continue Where You Left Off */}
          {quranProgress.versesMemorized > 0 && (
            <motion.section variants={fadeInUp}>
              <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Continue Learning</h2>
              <ContinueCard
                surahNumber={lastActiveVerse.surah}
                surahName={lastActiveVerse.surahName}
                ayahNumber={lastActiveVerse.ayah}
                progress={lastActiveVerse.progress}
                href={`/memorize/${lastActiveVerse.surah}/${lastActiveVerse.ayah}`}
              />
            </motion.section>
          )}

          {/* Up Next / Review Queue */}
          {reviewQueue.length > 0 && (
            <motion.section variants={fadeInUp}>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-night-500 text-xs uppercase tracking-wider">Up Next</h2>
                <Link href="/surahs" className="text-gold-400 text-xs hover:text-gold-300 transition-colors">
                  See all
                </Link>
              </div>
              <GlassPanel tint="neutral" blur="md" className="px-4">
                <div className="relative z-10">
                  {reviewQueue.map((item) => (
                    <UpNextItem
                      key={item.number}
                      number={item.number}
                      name={item.name}
                      meta={item.meta}
                      arabicName={item.arabicName}
                      status={item.status}
                      href={`/memorize/${item.number}/1`}
                    />
                  ))}
                </div>
              </GlassPanel>
            </motion.section>
          )}

          {/* Recent Activity */}
          <motion.section variants={fadeInUp} role="region" aria-labelledby="activity-heading">
            <h2 id="activity-heading" className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Recent Activity</h2>
            <div aria-live="polite" aria-label="Recent activity updates">
              <RecentActivity activities={recentActivity} />
            </div>
          </motion.section>

          {/* Ramadan Essentials */}
          {isRamadanNow && (
            <motion.section variants={fadeInUp}>
              <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Ramadan Essentials</h2>
              <div className="space-y-2">
                {[
                  { name: 'Surah Al-Qadr', desc: 'The Night of Power', surah: 97 },
                  { name: 'Al-Baqarah 183-187', desc: 'Fasting verses', surah: 2 },
                  { name: 'Surah Al-Mulk', desc: 'Nightly recitation', surah: 67 },
                  { name: 'Surah Ya-Sin', desc: 'Heart of the Quran', surah: 36 },
                  { name: 'Surah Al-Kahf', desc: 'Friday special', surah: 18 },
                ].map((item) => (
                  <Link
                    key={item.surah}
                    href={`/mushaf?surah=${item.surah}`}
                    className="block"
                  >
                    <GlassPanel tint="neutral" blur="sm" rounded="rounded-xl" className="hover:opacity-90 transition-opacity">
                      <div className="relative z-10 p-3 flex items-center gap-3">
                        <span className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-xs font-medium tabular-nums text-gold-400">{item.surah}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-night-100 text-sm font-medium">{item.name}</p>
                          <p className="text-night-500 text-xs">{item.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-night-600" />
                      </div>
                    </GlassPanel>
                  </Link>
                ))}
              </div>
            </motion.section>
          )}

          {/* Quick Actions for New Users */}
          {quranProgress.versesMemorized === 0 && (
            <motion.section variants={fadeInUp} className="mt-6">
              <GlassPanel tint="gold" blur="lg" glow className="p-6 text-center">
                <div className="relative z-10">
                  <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-night-100 mb-2">Begin Your Journey</h3>
                  <p className="text-night-400 mb-5 max-w-sm mx-auto">
                    Start with Al-Fatihah or pick any surah to begin your memorization journey.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/lessons">
                      <LiquidButton variant="primary" size="lg" icon={<BookOpen className="w-4 h-4" />}>
                        Start Learning
                      </LiquidButton>
                    </Link>
                    <Link href="/surahs">
                      <LiquidButton variant="secondary" size="lg">
                        Browse Surahs
                      </LiquidButton>
                    </Link>
                  </div>
                </div>
              </GlassPanel>
            </motion.section>
          )}

        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
