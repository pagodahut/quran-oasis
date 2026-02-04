'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Calendar,
  RefreshCw,
  Play,
  ArrowRight,
  Star,
  Zap,
  Award,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { StreakDisplay } from '@/components/Celebrations';
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
  if (hour >= 3 && hour < 12) return 'Good Morning';
  if (hour >= 12 && hour < 17) return 'Good Afternoon';
  if (hour >= 17 && hour < 21) return 'Good Evening';
  return 'Good Night';
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
  const bgClass = variant === 'memorize' 
    ? 'bg-gradient-to-br from-gold-500/20 via-gold-500/10 to-gold-600/5'
    : 'bg-gradient-to-br from-sage-500/20 via-sage-500/10 to-sage-600/5';
  
  const borderClass = variant === 'memorize'
    ? 'border-gold-500/20 hover:border-gold-500/40'
    : 'border-sage-500/20 hover:border-sage-500/40';
  
  const iconBgClass = variant === 'memorize'
    ? 'bg-gold-500/20 text-gold-400'
    : 'bg-sage-500/20 text-sage-400';

  const content = (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl p-5 cursor-pointer
        ${bgClass}
        border ${borderClass}
        transition-all duration-300
      `}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-30 pattern-arabesque" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl ${iconBgClass} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6" />
        </div>
        
        <h3 className="text-lg font-semibold text-night-100 mb-1">{title}</h3>
        <p className="text-night-300 text-base mb-3">{subtitle}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider text-night-500">{meta}</span>
          <ChevronRight className="w-4 h-4 text-night-500" />
        </div>
      </div>
    </motion.div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
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
        className="liquid-card rounded-2xl p-5 cursor-pointer group"
      >
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
    <motion.div variants={scaleIn} className="liquid-card rounded-xl p-4 text-center">
      <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
      <p className="text-xl font-bold text-night-100">{value}</p>
      <p className="text-xs text-night-500">{label}</p>
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
      <motion.div variants={fadeInUp} className="liquid-card rounded-2xl p-6 text-center">
        <Sparkles className="w-8 h-8 text-night-600 mx-auto mb-3" />
        <p className="text-night-400">Start your first lesson to see your activity!</p>
        <Link 
          href="/lessons" 
          className="inline-flex items-center gap-2 mt-4 text-gold-400 hover:text-gold-300 transition-colors"
        >
          Begin learning <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    );
  }
  
  return (
    <motion.div variants={fadeInUp} className="liquid-card rounded-2xl p-4">
      <div className="space-y-3">
        {activities.map((activity, i) => {
          const { icon: Icon, color, bg } = iconMap[activity.icon];
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-night-200 text-sm truncate">{activity.action}</p>
                <p className="text-night-500 text-xs">{activity.detail}</p>
              </div>
              <span className="text-night-600 text-xs flex-shrink-0">{activity.time}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ============================================
// Main Dashboard Page
// ============================================

export default function DashboardPage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { learning: learningPrefs } = useLearningPreferences();
  
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
      return user.firstName || user.username || 'Learner';
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

  return (
    <div className="min-h-screen bg-night-950">
      {/* Main Content */}
      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {/* Header - Greeting */}
          <motion.header variants={fadeInUp} className="pt-4 pb-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-night-500 text-sm uppercase tracking-wider mb-1">
                  {getIslamicDate()}
                </p>
                <h1 className="text-3xl font-semibold text-night-100">
                  <span className="text-gold-400">Salam, </span>
                  {displayName}
                </h1>
              </div>
              
              {/* Streak Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-night-900 border border-night-800"
              >
                <Flame className={`w-5 h-5 ${streakInfo.current > 0 ? 'text-orange-400' : 'text-night-600'}`} />
                <span className="font-bold text-night-100">{streakInfo.current}</span>
                <span className="text-night-500 text-sm">day{streakInfo.current !== 1 ? 's' : ''}</span>
              </motion.div>
            </div>
          </motion.header>
          
          {/* Daily Goal Progress Mini */}
          <motion.div variants={fadeInUp} className="liquid-glass-gold rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gold-400" />
                <span className="text-night-300 text-sm">Today's Goal</span>
              </div>
              <span className="text-gold-400 font-medium">
                {goalStatus.progress}/{learningPrefs.dailyGoalVerses || goalStatus.target} verses
              </span>
            </div>
            <div className="h-2 rounded-full bg-night-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${goalProgress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            {goalProgress >= 100 && (
              <p className="text-sage-400 text-xs mt-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Goal completed! Keep going to earn bonus XP.
              </p>
            )}
          </motion.div>
          
          {/* Daily Focus Cards */}
          <motion.section variants={fadeInUp}>
            <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Daily Focus</h2>
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
              <div className="liquid-card rounded-2xl px-4">
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
            </motion.section>
          )}
          
          {/* Quick Stats Grid */}
          <motion.section variants={fadeInUp}>
            <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Your Progress</h2>
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
            >
              View detailed progress <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.section>
          
          {/* Recent Activity */}
          <motion.section variants={fadeInUp}>
            <h2 className="text-night-500 text-xs uppercase tracking-wider mb-3 px-1">Recent Activity</h2>
            <RecentActivity activities={recentActivity} />
          </motion.section>
          
          {/* Quick Actions for New Users */}
          {quranProgress.versesMemorized === 0 && (
            <motion.section variants={fadeInUp} className="mt-6">
              <div className="liquid-glass-gold-premium rounded-2xl p-6 text-center">
                <Sparkles className="w-10 h-10 text-gold-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-night-100 mb-2">Begin Your Journey</h3>
                <p className="text-night-400 mb-5 max-w-sm mx-auto">
                  Start with Al-Fatihah or pick any surah to begin your memorization journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link 
                    href="/lessons"
                    className="liquid-btn inline-flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Start Learning
                  </Link>
                  <Link 
                    href="/surahs"
                    className="liquid-btn-outline inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl border border-night-600 text-night-200 hover:bg-night-800/50 transition-colors"
                  >
                    Browse Surahs
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
