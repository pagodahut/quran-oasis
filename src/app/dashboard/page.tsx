'use client';

import { useStudyTracker } from '@/lib/studyTracker';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useCalibrationGuard } from '@/hooks/useCalibrationGuard';
import { useAppTheme } from '@/contexts/ThemeContext';
import {
  Flame,
  BookOpen,
  Sparkles,
  ChevronRight,
  Target,
  RefreshCw,
  Play,
  ArrowRight,
  Award,
  Mic,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { GlassPanel } from '@/components/ui/GlassPanel';
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
import { isRamadan, isJummah, getRamadanDay } from '@/lib/islamic-calendar';

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const stagger = {
  visible: {
    transition: { staggerChildren: 0.07 }
  }
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 4 && hour < 7) return 'Sabah al-Khayr';
  if (hour >= 7 && hour < 12) return 'Sabah al-Khayr';
  if (hour >= 12 && hour < 17) return 'As-Salamu Alaykum';
  if (hour >= 17 && hour < 21) return "Masa' al-Khayr";
  return 'As-Salamu Alaykum';
}

const HADITH_MESSAGES = [
  { text: 'Whoever recites a letter from the Book of Allah will receive a good deed, and each good deed is multiplied by ten.', source: 'Tirmidhi' },
  { text: 'The best among you are those who learn the Quran and teach it.', source: 'Bukhari' },
  { text: 'Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection.', source: 'Muslim' },
  { text: 'The one who is proficient in the recitation of the Quran will be with the honourable and obedient scribes.', source: 'Bukhari & Muslim' },
  { text: 'It will be said to the companion of the Quran: Read and ascend, and beautify your voice as you used to in the world.', source: 'Abu Dawud & Tirmidhi' },
];

function getDailyHadith() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return HADITH_MESSAGES[dayOfYear % HADITH_MESSAGES.length];
}

function formatLastActive(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useAuth();
  useStudyTracker('dashboard');
  const { learning: learningPrefs } = useLearningPreferences();
  const { isChecking } = useCalibrationGuard();
  const { prayerPeriod, ambientColors, isDark } = useAppTheme();

  const [streakInfo, setStreakInfo] = useState(getStreakInfo());
  const [goalStatus, setGoalStatus] = useState(getDailyGoalStatus());
  const [quranProgress, setQuranProgress] = useState(getQuranProgress());
  const [achievements, setAchievements] = useState(getAchievements());
  const [surahProgress, setSurahProgress] = useState<SurahProgressItem[]>([]);
  const [userProgress, setUserProgress] = useState(getProgress());

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
    window.addEventListener('motivation-updated', loadData);
    window.addEventListener('progress-updated', loadData);
    return () => {
      window.removeEventListener('motivation-updated', loadData);
      window.removeEventListener('progress-updated', loadData);
    };
  }, []);

  const displayName = useMemo(() => {
    if (isSignedIn && user) return user.firstName || 'Learner';
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
      return { surah: 1, ayah: 1, surahName: 'Al-Fatihah', progress: 0 };
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
      surahName: surahMeta?.name || `Surah ${surah}`,
      progress: surahData?.percentage || 0,
    };
  }, [userProgress, surahProgress]);

  const reviewQueue = useMemo(() => {
    return surahProgress
      .filter(s => s.status === 'in_progress' || s.versesMemorized > 0)
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 3);
  }, [surahProgress]);

  const goalTarget = learningPrefs.dailyGoalVerses || goalStatus.target;
  const goalProgress = Math.min(100, Math.round((goalStatus.progress / goalTarget) * 100));
  const hadith = getDailyHadith();
  const isRamadanNow = isRamadan();
  const isJummahToday = isJummah();
  const ramadanDay = getRamadanDay();

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--theme-surface)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 rounded-full mx-auto"
          style={{ border: '2px solid var(--ambient-gold)', borderTopColor: 'transparent' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--theme-surface)' }}>
      <main className="px-5 pt-6 pb-32 max-w-lg mx-auto">
        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-8">

          {/* Header — quiet, editorial */}
          <motion.header variants={fadeIn} className="pt-safe-top">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--theme-text-muted)' }}>
                  {getGreeting()}
                </p>
                <h1 className="text-2xl font-serif font-semibold" style={{ color: 'var(--theme-text)' }}>
                  {displayName}
                </h1>
              </div>

              {/* Streak — understated pill */}
              {streakInfo.current > 0 && (
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                  style={{
                    background: 'var(--ambient-gold-subtle)',
                    color: 'var(--ambient-gold)',
                  }}
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span className="font-semibold tabular-nums">{streakInfo.current}</span>
                </div>
              )}
            </div>
          </motion.header>

          {/* Ramadan / Jummah — thin banner, not a card */}
          {(isRamadanNow || isJummahToday) && (
            <motion.div variants={fadeIn}>
              {isRamadanNow ? (
                <Link href="/mushaf?surah=97" className="block">
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: 'var(--ambient-gold-subtle)',
                      border: '1px solid var(--panel-border-gold)',
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--ambient-gold)' }}>
                      Ramadan Day {ramadanDay}
                    </span>
                    <span style={{ color: 'var(--theme-text-muted)' }}>·</span>
                    <span className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                      1 juz per day to complete the Quran
                    </span>
                    <ChevronRight className="w-4 h-4 ml-auto" style={{ color: 'var(--theme-text-muted)' }} />
                  </div>
                </Link>
              ) : (
                <Link href="/mushaf?surah=18" className="block">
                  <div
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      background: 'var(--ambient-gold-subtle)',
                      border: '1px solid var(--panel-border-gold)',
                    }}
                  >
                    <span className="text-sm font-medium" style={{ color: 'var(--ambient-gold)' }}>
                      Jummah Mubarak
                    </span>
                    <span style={{ color: 'var(--theme-text-muted)' }}>·</span>
                    <span className="text-sm" style={{ color: 'var(--theme-text-secondary)' }}>
                      Read Surah Al-Kahf
                    </span>
                    <ChevronRight className="w-4 h-4 ml-auto" style={{ color: 'var(--theme-text-muted)' }} />
                  </div>
                </Link>
              )}
            </motion.div>
          )}

          {/* THE RIBBON — Continue where you left off, unmissable */}
          <motion.div variants={fadeIn}>
            <Link
              href={quranProgress.versesMemorized > 0
                ? `/memorize/${lastActiveVerse.surah}/${lastActiveVerse.ayah}`
                : '/lessons'}
            >
              <GlassPanel tint="gold" glow blur="none" className="p-6 group cursor-pointer">
                <div className="relative z-10">
                  {quranProgress.versesMemorized > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-xs font-medium uppercase tracking-widest mb-1" style={{ color: 'var(--ambient-gold)' }}>
                            Continue
                          </p>
                          <h2 className="text-xl font-serif" style={{ color: 'var(--theme-text)' }}>
                            {lastActiveVerse.surahName}
                          </h2>
                          <p className="text-sm mt-0.5" style={{ color: 'var(--theme-text-secondary)' }}>
                            Ayah {lastActiveVerse.ayah}
                          </p>
                        </div>
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                          style={{ background: 'var(--ambient-gold)', color: isDark ? '#1e1c28' : '#fff' }}
                        >
                          <Play className="w-5 h-5 ml-0.5" />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--theme-border)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: 'var(--ambient-gold)' }}
                            initial={{ width: 0 }}
                            animate={{ width: `${lastActiveVerse.progress}%` }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                          />
                        </div>
                        <span className="text-sm tabular-nums font-medium" style={{ color: 'var(--theme-text-muted)' }}>
                          {lastActiveVerse.progress}%
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--ambient-gold)' }} />
                      <h2 className="text-xl font-serif mb-1" style={{ color: 'var(--theme-text)' }}>
                        Begin Your Journey
                      </h2>
                      <p className="text-sm mb-4" style={{ color: 'var(--theme-text-secondary)' }}>
                        Start with Al-Fatihah or pick any surah
                      </p>
                      <span
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium"
                        style={{ background: 'var(--ambient-gold)', color: isDark ? '#1e1c28' : '#fff' }}
                      >
                        Start Learning <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  )}
                </div>
              </GlassPanel>
            </Link>
          </motion.div>

          {/* Daily Goal — thin progress line */}
          <motion.div variants={fadeIn}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" style={{ color: 'var(--ambient-gold)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                  Today
                </span>
              </div>
              <span className="text-sm tabular-nums" style={{ color: 'var(--theme-text-muted)' }}>
                {goalStatus.progress}/{goalTarget} verses
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--theme-border)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: goalProgress >= 100 ? '#4e7a51' : 'var(--ambient-gold)' }}
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {goalProgress >= 100 && (
              <p className="text-xs mt-1.5" style={{ color: '#4e7a51' }}>
                Goal complete — keep going for bonus rewards
              </p>
            )}
          </motion.div>

          {/* Quick Actions — two clean rows, no heavy cards */}
          <motion.div variants={fadeIn} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/memorize/${lastActiveVerse.surah}/${lastActiveVerse.ayah}`}>
                <GlassPanel tint="gold" blur="none" className="p-4 cursor-pointer group">
                  <div className="relative z-10">
                    <BookOpen className="w-5 h-5 mb-3" style={{ color: 'var(--ambient-gold)' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>New Hifz</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>
                      {lastActiveVerse.surahName}
                    </p>
                  </div>
                </GlassPanel>
              </Link>
              <Link href="/practice">
                <GlassPanel tint="sage" blur="none" className="p-4 cursor-pointer group">
                  <div className="relative z-10">
                    <RefreshCw className="w-5 h-5 mb-3" style={{ color: '#4e7a51' }} />
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Review</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>
                      {quranProgress.versesMemorized} verses
                    </p>
                  </div>
                </GlassPanel>
              </Link>
            </div>
            <Link href="/recite">
              <GlassPanel tint="neutral" blur="none" className="p-4 cursor-pointer">
                <div className="relative z-10 flex items-center gap-3">
                  <Mic className="w-5 h-5" style={{ color: 'var(--ambient-accent)' }} />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Live Recitation</p>
                    <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>Real-time tajweed feedback</p>
                  </div>
                  <ChevronRight className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                </div>
              </GlassPanel>
            </Link>
          </motion.div>

          {/* Stats — three numbers, no icons, clean */}
          <motion.div variants={fadeIn}>
            <div className="grid grid-cols-3 gap-px rounded-xl overflow-hidden" style={{ background: 'var(--theme-border)' }}>
              {[
                { value: quranProgress.versesMemorized, label: 'Verses' },
                { value: streakInfo.longest, label: 'Best Streak' },
                { value: achievements.unlocked.length, label: 'Achievements' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 text-center"
                  style={{ background: 'var(--theme-card)' }}
                >
                  <p className="text-2xl font-serif tabular-nums" style={{ color: 'var(--theme-text)' }}>
                    {stat.value}
                  </p>
                  <p className="text-xs mt-1" style={{ color: 'var(--theme-text-muted)' }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/progress"
              className="flex items-center justify-center gap-1.5 mt-3 text-sm"
              style={{ color: 'var(--ambient-accent)' }}
            >
              View progress <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Up Next — clean list with hairline separators */}
          {reviewQueue.length > 0 && (
            <motion.div variants={fadeIn}>
              <h2 className="text-xs font-medium uppercase tracking-widest mb-3 px-1" style={{ color: 'var(--theme-text-muted)' }}>
                Up Next
              </h2>
              <div className="rounded-xl overflow-hidden" style={{ background: 'var(--theme-card)', border: '1px solid var(--theme-border)' }}>
                {reviewQueue.map((item, i) => (
                  <Link key={item.surahNumber} href={`/memorize/${item.surahNumber}/1`}>
                    <div
                      className="flex items-center gap-3 px-4 py-3.5 group"
                      style={{
                        borderBottom: i < reviewQueue.length - 1 ? '1px solid var(--theme-border-subtle)' : 'none',
                      }}
                    >
                      <span
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium tabular-nums"
                        style={{ background: 'var(--ambient-gold-subtle)', color: 'var(--ambient-gold)' }}
                      >
                        {item.surahNumber}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
                          {item.englishName}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                          {item.versesMemorized}/{item.totalVerses} verses
                        </p>
                      </div>
                      <span className="text-sm font-arabic opacity-40" style={{ color: 'var(--theme-text-muted)' }}>
                        {item.name}
                      </span>
                      <ChevronRight className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* Hadith — quiet, set like a pull quote */}
          <motion.div variants={fadeIn} className="px-2">
            <div
              className="pl-4"
              style={{ borderLeft: `2px solid var(--ambient-gold-subtle)` }}
            >
              <p className="text-sm italic leading-relaxed" style={{ color: 'var(--theme-text-secondary)' }}>
                &ldquo;{hadith.text}&rdquo;
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--theme-text-muted)' }}>
                Prophet Muhammad (peace be upon him) — {hadith.source}
              </p>
            </div>
          </motion.div>

        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
