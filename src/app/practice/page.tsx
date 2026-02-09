'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Layers,
  Calendar,
  Flame,
  Star,
  ChevronRight,
  Play,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sparkles,
  Moon,
  Heart,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import { 
  getVersesByCategory, 
  getDueVerses, 
  getStats, 
  getTodayActivity,
  getRecentActivity,
  getProgress,
  getSettings,
} from '@/lib/progressStore';
import { type VerseProgress } from '@/lib/memorizationSystem';
import { getSurah, formatVerseRef } from '@/lib/quranData';
import BottomNav from '@/components/BottomNav';
import SheikhReviewSession from '@/components/SheikhReviewSession';
import type { ReviewAyah } from '@/hooks/useSheikhReview';

// ============ COMPONENTS ============

function StreakDisplay({ streak, longestStreak }: { streak: number; longestStreak: number }) {
  const isActive = streak > 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl ${
        isActive 
          ? 'bg-gradient-to-r from-orange-900/30 to-night-900 border border-orange-700/30' 
          : 'bg-night-900/50 border border-night-800'
      }`}
    >
      <motion.div
        animate={isActive ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <Flame className={`w-6 h-6 ${isActive ? 'text-orange-400' : 'text-night-600'}`} />
      </motion.div>
      <div>
        <p className={`font-bold text-lg ${isActive ? 'text-orange-400' : 'text-night-500'}`}>
          {streak} day{streak !== 1 ? 's' : ''}
        </p>
        <p className="text-night-500 text-xs">
          {isActive ? 'Current streak' : 'No streak yet'}
          {longestStreak > streak && ` • Best: ${longestStreak}`}
        </p>
      </div>
    </motion.div>
  );
}

function StatCard({ 
  icon: Icon, 
  value, 
  label, 
  color,
  delay = 0,
}: { 
  icon: React.ComponentType<{ className?: string }>;
  value: number | string;
  label: string;
  color: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-night-900/50 border border-night-800 rounded-2xl p-4 flex flex-col items-center"
    >
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-2`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <p className="text-2xl font-bold text-night-100">{value}</p>
      <p className="text-night-500 text-xs text-center">{label}</p>
    </motion.div>
  );
}

function CategoryCard({
  title,
  arabicTitle,
  description,
  icon: Icon,
  verses,
  dueCount,
  color,
  gradient,
  onStartReview,
  delay = 0,
}: {
  title: string;
  arabicTitle: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  verses: VerseProgress[];
  dueCount: number;
  color: string;
  gradient: string;
  onStartReview: () => void;
  delay?: number;
}) {
  const totalVerses = verses.length;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`relative overflow-hidden rounded-2xl border ${
        dueCount > 0 
          ? `bg-gradient-to-br ${gradient} border-${color}-700/50` 
          : 'bg-night-900/50 border-night-800'
      }`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
          backgroundSize: '16px 16px',
        }} />
      </div>

      <div className="relative p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
              <Icon className={`w-6 h-6 text-${color}-400`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-night-100 text-lg">{title}</h3>
                <span className="font-arabic text-gold-400/70 text-lg">{arabicTitle}</span>
              </div>
              <p className="text-night-400 text-sm">{description}</p>
            </div>
          </div>
          
          {dueCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-8 h-8 rounded-full bg-${color}-500 flex items-center justify-center text-white font-bold text-sm`}
            >
              {dueCount}
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-night-500">
            {totalVerses > 0 ? (
              <span>{totalVerses} verse{totalVerses !== 1 ? 's' : ''} total</span>
            ) : (
              <span>No verses yet</span>
            )}
          </div>

          {dueCount > 0 ? (
            <motion.button
              onClick={onStartReview}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-${color}-500 hover:bg-${color}-400 text-white font-medium transition-colors`}
            >
              <Play className="w-4 h-4" />
              Review
            </motion.button>
          ) : totalVerses > 0 ? (
            <span className="flex items-center gap-1 text-sage-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              All reviewed
            </span>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
}

// ============ FLASHCARD SECTION ============
function FlashcardSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-night-900 to-night-950 border border-purple-700/30 p-6 mb-6"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
            <Layers className="w-7 h-7 text-night-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-night-100 mb-1">Flashcard Practice</h2>
            <p className="text-night-400 text-sm">Master Arabic letters, vocabulary & Tajweed rules</p>
          </div>
        </div>
        
        <Link href="/practice/flashcards">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-semibold transition-colors"
          >
            <Layers className="w-5 h-5" />
            Practice Flashcards
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

function QuickStartSection() {
  const [recommendedSurah, setRecommendedSurah] = useState<{
    number: number;
    name: string;
    verses: number;
    difficulty: string;
  } | null>(null);

  useEffect(() => {
    // Recommend starting with Al-Fatiha or short surahs from Juz Amma
    const beginnerSurahs = [
      { number: 1, name: 'Al-Fatiha', verses: 7, difficulty: 'Beginner' },
      { number: 112, name: 'Al-Ikhlas', verses: 4, difficulty: 'Beginner' },
      { number: 113, name: 'Al-Falaq', verses: 5, difficulty: 'Beginner' },
      { number: 114, name: 'An-Nas', verses: 6, difficulty: 'Beginner' },
      { number: 108, name: 'Al-Kawthar', verses: 3, difficulty: 'Beginner' },
    ];
    
    // Check which one isn't started yet
    const progress = getProgress();
    const notStarted = beginnerSurahs.find(s => 
      !Object.keys(progress.verses).some(key => key.startsWith(`${s.number}:`))
    );
    
    setRecommendedSurah(notStarted || beginnerSurahs[0]);
  }, []);

  if (!recommendedSurah) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gold-900/40 via-night-900 to-night-950 border border-gold-700/30 p-6"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-sage-500/10 rounded-full blur-2xl" />

      <div className="relative">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold flex-shrink-0">
            <Sparkles className="w-7 h-7 text-night-950" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-night-100 mb-1">Start Your Journey</h2>
            <p className="text-night-400 text-sm">Begin with a short, beautiful surah</p>
          </div>
        </div>

        <div className="bg-night-900/60 rounded-xl p-4 border border-night-800 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gold-400 text-sm font-medium mb-1">Recommended</p>
              <h3 className="text-night-100 font-semibold text-lg">{recommendedSurah.name}</h3>
              <p className="text-night-500 text-sm">
                {recommendedSurah.verses} verses • {recommendedSurah.difficulty}
              </p>
            </div>
            <div className="text-right">
              <p className="font-arabic text-gold-300 text-2xl">
                {recommendedSurah.number === 1 ? 'الفاتحة' : 
                 recommendedSurah.number === 112 ? 'الإخلاص' :
                 recommendedSurah.number === 113 ? 'الفلق' :
                 recommendedSurah.number === 114 ? 'الناس' :
                 recommendedSurah.number === 108 ? 'الكوثر' : ''}
              </p>
            </div>
          </div>
        </div>

        <Link href={`/memorize/${recommendedSurah.number}/1`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-night-950 font-semibold transition-colors shadow-glow-gold"
          >
            <Play className="w-5 h-5" />
            Start Memorizing
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}

function ActivityChart({ activity }: { activity: Array<{ date: string; versesReviewed: number; versesMemorized: number }> }) {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayActivity = activity.find(a => a.date === dateStr);
    last7Days.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      reviewed: dayActivity?.versesReviewed || 0,
      memorized: dayActivity?.versesMemorized || 0,
    });
  }

  const maxValue = Math.max(...last7Days.map(d => d.reviewed + d.memorized), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-night-900/50 border border-night-800 rounded-2xl p-5"
    >
      <h3 className="font-semibold text-night-100 mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-gold-400" />
        Weekly Activity
      </h3>
      
      <div className="flex items-end justify-between gap-2 h-24">
        {last7Days.map((day, i) => {
          const height = ((day.reviewed + day.memorized) / maxValue) * 100;
          const isToday = i === last7Days.length - 1;
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(height, 4)}%` }}
                transition={{ delay: 0.1 * i, duration: 0.5 }}
                className={`w-full rounded-t-lg ${
                  day.reviewed + day.memorized > 0
                    ? isToday
                      ? 'bg-gradient-to-t from-gold-600 to-gold-400'
                      : 'bg-gold-500/50'
                    : 'bg-night-700'
                }`}
              />
              <span className={`text-xs ${isToday ? 'text-gold-400 font-medium' : 'text-night-500'}`}>
                {day.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-night-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gold-500" />
          <span className="text-night-500 text-xs">Reviewed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-sage-500" />
          <span className="text-night-500 text-xs">Memorized</span>
        </div>
      </div>
    </motion.div>
  );
}

function DueVersesList({ verses }: { verses: VerseProgress[] }) {
  const router = useRouter();
  
  if (verses.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-night-900/50 border border-night-800 rounded-2xl overflow-hidden"
    >
      <div className="p-4 border-b border-night-800 flex items-center justify-between">
        <h3 className="font-semibold text-night-100 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gold-400" />
          Due for Review
        </h3>
        <span className="text-night-500 text-sm">{verses.length} verses</span>
      </div>
      
      <div className="divide-y divide-night-800 max-h-64 overflow-y-auto">
        {verses.slice(0, 10).map((verse, i) => {
          const surah = getSurah(verse.surah);
          return (
            <motion.button
              key={`${verse.surah}:${verse.ayah}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              onClick={() => router.push(`/memorize/${verse.surah}/${verse.ayah}`)}
              className="w-full flex items-center justify-between p-4 hover:bg-night-800/50 transition-colors text-left"
            >
              <div>
                <p className="text-night-100 font-medium">
                  {surah?.englishName || `Surah ${verse.surah}`} : {verse.ayah}
                </p>
                <p className="text-night-500 text-sm">
                  Confidence: {verse.confidence}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  verse.category === 'sabaq' ? 'bg-gold-500/20 text-gold-400' :
                  verse.category === 'sabqi' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-sage-500/20 text-sage-400'
                }`}>
                  {verse.category}
                </span>
                <ChevronRight className="w-4 h-4 text-night-600" />
              </div>
            </motion.button>
          );
        })}
      </div>

      {verses.length > 10 && (
        <div className="p-3 border-t border-night-800 text-center">
          <span className="text-night-500 text-sm">
            +{verses.length - 10} more verses
          </span>
        </div>
      )}
    </motion.div>
  );
}

// ============ MAIN COMPONENT ============

export default function PracticePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{
    sabaq: VerseProgress[];
    sabqi: VerseProgress[];
    manzil: VerseProgress[];
  }>({ sabaq: [], sabqi: [], manzil: [] });
  const [dueVerses, setDueVerses] = useState<VerseProgress[]>([]);
  const [stats, setStats] = useState<ReturnType<typeof getStats> | null>(null);
  const [todayActivity, setTodayActivity] = useState<ReturnType<typeof getTodayActivity> | null>(null);
  const [recentActivity, setRecentActivity] = useState<ReturnType<typeof getRecentActivity>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSheikhReview, setShowSheikhReview] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Load all data
    setCategories(getVersesByCategory());
    setDueVerses(getDueVerses());
    setStats(getStats());
    setTodayActivity(getTodayActivity());
    setRecentActivity(getRecentActivity(7));
    setIsLoading(false);
    
    // Try to get user name
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('quranOasis_userName');
      if (stored) setUserName(stored);
    }
  }, []);
  
  // Convert VerseProgress to ReviewAyah format
  const convertToReviewAyahs = (verses: VerseProgress[]): ReviewAyah[] => {
    return verses.slice(0, 5).map(v => {
      const surah = getSurah(v.surah);
      const daysSince = v.lastReview 
        ? Math.floor((Date.now() - new Date(v.lastReview).getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
      return {
        surahNumber: v.surah,
        surahName: surah?.englishName || `Surah ${v.surah}`,
        surahNameArabic: surah?.name || '',
        ayahNumber: v.ayah,
        arabicText: '', // Would need to fetch from API
        translation: '', // Would need to fetch from API
        daysSinceReview: daysSince,
        lastAccuracy: v.confidence,
      };
    });
  };
  
  // Get due verses by category
  const getDueByCategory = (verses: VerseProgress[]) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return verses.filter(v => new Date(v.nextReview) <= now);
  };

  const startReview = (category: 'sabaq' | 'sabqi' | 'manzil') => {
    const verses = categories[category].filter(v => {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      return new Date(v.nextReview) <= now;
    });
    
    if (verses.length > 0) {
      // Show Sheikh-guided review instead of direct navigation
      setShowSheikhReview(true);
    }
  };

  const hasProgress = stats && stats.totalVerses > 0;
  const totalDue = dueVerses.length;
  
  // Calculate due counts per category
  const sabaqDue = categories.sabaq.filter(v => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(v.nextReview) <= now;
  }).length;
  
  const sabqiDue = categories.sabqi.filter(v => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(v.nextReview) <= now;
  }).length;
  
  const manzilDue = categories.manzil.filter(v => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(v.nextReview) <= now;
  }).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  
  // Show Sheikh-guided review session
  if (showSheikhReview) {
    return (
      <SheikhReviewSession
        sabaqAyahs={convertToReviewAyahs(getDueByCategory(categories.sabaq))}
        sabqiAyahs={convertToReviewAyahs(getDueByCategory(categories.sabqi))}
        manzilAyahs={convertToReviewAyahs(getDueByCategory(categories.manzil))}
        userLevel="beginner"
        userName={userName}
        streakDays={stats?.streak}
        onComplete={(type, result) => {
          console.log('Review complete:', type, result);
          // Could save review results here
        }}
        onExit={() => setShowSheikhReview(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-night-950 pb-24">
      {/* Background pattern */}
      <div className="fixed inset-0 pattern-arabesque opacity-20" />
      <div className="fixed inset-0 bg-gradient-to-b from-night-950 via-transparent to-night-950" />

      {/* Header - Premium Frosted Glass */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass mx-2 mt-2 rounded-2xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                  boxShadow: '0 4px 16px rgba(201,162,39,0.3)',
                }}
              >
                <Moon className="w-5 h-5 text-night-950" />
              </div>
              <div>
                <h1 className="font-bold text-night-100 text-lg">Daily Practice</h1>
                <p className="text-night-500 text-sm">Sabaq • Sabqi • Manzil</p>
              </div>
            </div>
            
            {stats && <StreakDisplay streak={stats.streak} longestStreak={stats.longestStreak} />}
          </div>

          {/* Due summary - Smooth glass card */}
          {totalDue > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3.5 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.05) 100%)',
                border: '1px solid rgba(201,162,39,0.15)',
              }}
            >
              <AlertCircle className="w-5 h-5 text-gold-400" />
              <span className="text-gold-200 text-sm">
                You have <strong>{totalDue} verse{totalDue !== 1 ? 's' : ''}</strong> due for review today
              </span>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative px-4 py-6 space-y-6">
        {/* Quick Start for new users */}
        {/* Flashcard Practice - always show */}
        <FlashcardSection />
        
        {!hasProgress && <QuickStartSection />}

        {/* Stats Row */}
        {stats && stats.totalVerses > 0 && (
          <div className="grid grid-cols-4 gap-3">
            <StatCard
              icon={BookOpen}
              value={stats.totalVerses}
              label="Total Verses"
              color="bg-gold-500"
              delay={0}
            />
            <StatCard
              icon={Brain}
              value={stats.memorized}
              label="Memorized"
              color="bg-sage-500"
              delay={0.1}
            />
            <StatCard
              icon={RefreshCw}
              value={stats.dueToday}
              label="Due Today"
              color="bg-purple-500"
              delay={0.2}
            />
            <StatCard
              icon={Star}
              value={stats.avgConfidence + '%'}
              label="Confidence"
              color="bg-orange-500"
              delay={0.3}
            />
          </div>
        )}

        {/* XP & Level */}
        {stats && stats.totalXP > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-900/30 to-night-900 border border-purple-700/30 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-300 font-semibold">Level {stats.level}</p>
                <p className="text-night-500 text-sm">{stats.totalXP} XP earned</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-night-400 text-sm">Next level</p>
              <div className="w-24 h-2 bg-night-800 rounded-full overflow-hidden mt-1">
                <div 
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${(stats.totalXP % 100)}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Traditional Three-Part System */}
        <div>
          <h2 className="text-lg font-semibold text-night-100 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold-400" />
            Traditional Review System
          </h2>

          <div className="space-y-4">
            <CategoryCard
              title="Sabaq"
              arabicTitle="سبق"
              description="New lessons - Today's memorization"
              icon={Sparkles}
              verses={categories.sabaq}
              dueCount={sabaqDue}
              color="gold"
              gradient="from-gold-900/30 to-night-900"
              onStartReview={() => startReview('sabaq')}
              delay={0}
            />

            <CategoryCard
              title="Sabqi"
              arabicTitle="سبقی"
              description="Recent review - Last 7 days"
              icon={RefreshCw}
              verses={categories.sabqi}
              dueCount={sabqiDue}
              color="purple"
              gradient="from-purple-900/30 to-night-900"
              onStartReview={() => startReview('sabqi')}
              delay={0.1}
            />

            <CategoryCard
              title="Manzil"
              arabicTitle="منزل"
              description="Old revision - Maintenance review"
              icon={Layers}
              verses={categories.manzil}
              dueCount={manzilDue}
              color="sage"
              gradient="from-sage-900/30 to-night-900"
              onStartReview={() => startReview('manzil')}
              delay={0.2}
            />
          </div>
        </div>

        {/* Activity Chart */}
        {recentActivity.length > 0 && (
          <ActivityChart activity={recentActivity} />
        )}

        {/* Due Verses List */}
        <DueVersesList verses={dueVerses} />

        {/* Start New Section */}
        {hasProgress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-night-900/50 border border-night-800 rounded-2xl p-5"
          >
            <h3 className="font-semibold text-night-100 mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gold-400" />
              Learn New Verses
            </h3>
            <p className="text-night-400 text-sm mb-4">
              Add more verses to your memorization journey
            </p>
            <Link href="/mushaf">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-night-800 hover:bg-night-700 text-night-200 transition-colors"
              >
                Browse Quran
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        )}

        {/* Motivation Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-8"
        >
          <p className="text-night-500 italic text-sm max-w-xs mx-auto">
            "Whoever recites a letter from the Book of Allah, 
            he will receive one good deed as ten good deeds like it."
          </p>
          <p className="text-gold-500/70 text-xs mt-2">— Prophet Muhammad ﷺ (Tirmidhi)</p>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
