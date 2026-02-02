'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  BookOpen,
  Flame,
  Target,
  Calendar,
  TrendingUp,
  Award,
  Star,
  ChevronRight,
  Lock,
  CheckCircle2,
  Circle,
  Clock,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { StreakDisplay, GoalProgressRing } from '@/components/Celebrations';
import {
  getStreakInfo,
  getDailyGoalStatus,
  getQuranProgress,
  getJuzProgress,
  getSurahProgressList,
  getWeeklyProgress,
  getAchievements,
  type JuzProgress,
  type SurahProgressItem,
  type WeeklyStats,
} from '@/lib/motivationStore';

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

// ============================================
// Quran Completion Progress Ring
// ============================================

function QuranProgressRing({ versesMemorized, totalVerses, percentage }: {
  versesMemorized: number;
  totalVerses: number;
  percentage: number;
}) {
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      variants={fadeInUp}
      className="liquid-glass-gold rounded-2xl p-6"
    >
      <h3 className="text-sm font-medium text-night-400 mb-4">Quran Completion</h3>

      <div className="flex items-center gap-6">
        {/* Large progress ring */}
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg width="144" height="144" className="transform -rotate-90">
            {/* Background */}
            <circle
              cx="72"
              cy="72"
              r="70"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="8"
            />
            {/* Progress */}
            <motion.circle
              cx="72"
              cy="72"
              r="70"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#C9A227" />
                <stop offset="100%" stopColor="#F4D47C" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gold-400">{percentage}%</span>
            <span className="text-xs text-night-500">Complete</span>
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-3">
          <div>
            <p className="text-2xl font-bold text-night-100">{versesMemorized.toLocaleString()}</p>
            <p className="text-sm text-night-500">verses memorized</p>
          </div>
          <div className="h-px bg-night-800" />
          <div>
            <p className="text-lg text-night-300">{totalVerses.toLocaleString()}</p>
            <p className="text-sm text-night-500">total in Quran</p>
          </div>
          <div>
            <p className="text-sm text-night-400">
              {(totalVerses - versesMemorized).toLocaleString()} verses remaining
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Juz Grid
// ============================================

function JuzGrid({ juzProgress }: { juzProgress: JuzProgress[] }) {
  return (
    <motion.div variants={fadeInUp} className="liquid-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-night-400">Juz Progress</h3>
        <span className="text-xs text-night-600">30 parts</span>
      </div>

      <div className="grid grid-cols-6 gap-2">
        {juzProgress.map((juz) => (
          <motion.div
            key={juz.juzNumber}
            whileHover={{ scale: 1.1 }}
            className={`
              relative aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-pointer
              transition-all
              ${juz.status === 'complete'
                ? 'bg-sage-500/20 text-sage-400 border border-sage-500/30'
                : juz.status === 'in_progress'
                  ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                  : 'bg-night-800/50 text-night-600 border border-night-800'
              }
            `}
            title={`Juz ${juz.juzNumber}: ${juz.percentage}%`}
          >
            {juz.juzNumber}
            {juz.status === 'complete' && (
              <CheckCircle2 className="absolute -top-1 -right-1 w-3 h-3 text-sage-400" />
            )}
            {juz.status === 'in_progress' && juz.percentage > 0 && (
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-gold-500/50 rounded-b-lg"
                style={{ width: `${juz.percentage}%` }}
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-night-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-sage-500/20 border border-sage-500/30" />
          <span>Complete</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gold-500/20 border border-gold-500/30" />
          <span>In Progress</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-night-800/50 border border-night-800" />
          <span>Not Started</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Surah Progress List
// ============================================

function SurahProgressList({ surahs }: { surahs: SurahProgressItem[] }) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'complete'>('all');

  const filteredSurahs = surahs.filter(s => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  const displaySurahs = showAll ? filteredSurahs : filteredSurahs.slice(0, 10);
  const hasMore = filteredSurahs.length > 10;

  return (
    <motion.div variants={fadeInUp} className="liquid-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-night-400">Surah Progress</h3>
        
        {/* Filter tabs */}
        <div className="flex gap-1 p-1 rounded-lg bg-night-800/50">
          {(['all', 'in_progress', 'complete'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                filter === f
                  ? 'bg-gold-500/20 text-gold-400'
                  : 'text-night-500 hover:text-night-300'
              }`}
            >
              {f === 'all' ? 'All' : f === 'in_progress' ? 'Learning' : 'Done'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {displaySurahs.length === 0 ? (
          <p className="text-center text-night-500 py-8">
            No surahs {filter === 'complete' ? 'completed' : filter === 'in_progress' ? 'in progress' : ''} yet
          </p>
        ) : (
          displaySurahs.map((surah) => (
            <div
              key={surah.surahNumber}
              className="flex items-center gap-3 p-3 rounded-xl bg-night-900/50 hover:bg-night-900/70 transition-colors"
            >
              {/* Surah number */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                  surah.status === 'complete'
                    ? 'bg-sage-500/20 text-sage-400'
                    : surah.status === 'in_progress'
                      ? 'bg-gold-500/20 text-gold-400'
                      : 'bg-night-800 text-night-500'
                }`}
              >
                {surah.surahNumber}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-night-200 text-sm font-medium truncate">
                  {surah.englishName}
                </p>
                <p className="text-night-500 text-xs">
                  {surah.versesMemorized}/{surah.totalVerses} verses
                </p>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2 w-20">
                <div className="flex-1 h-1.5 rounded-full bg-night-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      surah.status === 'complete'
                        ? 'bg-sage-500'
                        : 'bg-gold-500'
                    }`}
                    style={{ width: `${surah.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-night-500 w-8 text-right">
                  {surah.percentage}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full mt-3 py-2 text-sm text-gold-400 hover:text-gold-300 transition-colors"
        >
          Show all {filteredSurahs.length} surahs
        </button>
      )}
    </motion.div>
  );
}

// ============================================
// Weekly Progress Graph
// ============================================

function WeeklyGraph({ weeklyStats }: { weeklyStats: WeeklyStats[] }) {
  const maxVerses = Math.max(...weeklyStats.map(w => w.versesMemorized + w.versesReviewed), 1);

  return (
    <motion.div variants={fadeInUp} className="liquid-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-night-400">Weekly Activity</h3>
        <span className="text-xs text-night-600">Last 8 weeks</span>
      </div>

      {weeklyStats.length === 0 ? (
        <div className="h-40 flex items-center justify-center text-night-500">
          <p>Start learning to see your progress!</p>
        </div>
      ) : (
        <div className="h-40 flex items-end gap-2">
          {weeklyStats.map((week, i) => {
            const memorizedHeight = (week.versesMemorized / maxVerses) * 100;
            const reviewedHeight = (week.versesReviewed / maxVerses) * 100;

            return (
              <div key={week.week} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full h-32 flex flex-col justify-end gap-0.5">
                  {/* Reviewed */}
                  <motion.div
                    className="w-full rounded-t-sm bg-sage-500/40"
                    initial={{ height: 0 }}
                    animate={{ height: `${reviewedHeight}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                  {/* Memorized */}
                  <motion.div
                    className="w-full rounded-t-sm bg-gold-500"
                    initial={{ height: 0 }}
                    animate={{ height: `${memorizedHeight}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 + 0.1 }}
                  />
                </div>
                <span className="text-[10px] text-night-600">
                  W{week.week.split('-W')[1]}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 text-xs text-night-500">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gold-500" />
          <span>Memorized</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-sage-500/40" />
          <span>Reviewed</span>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Achievements Section
// ============================================

function AchievementsSection() {
  const { unlocked, locked } = getAchievements();

  return (
    <motion.div variants={fadeInUp} className="liquid-card rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-night-400">Achievements</h3>
        <span className="text-xs text-night-600">
          {unlocked.length}/{unlocked.length + locked.length}
        </span>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-night-500 mb-2">Unlocked</p>
          <div className="flex flex-wrap gap-2">
            {unlocked.map((achievement) => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-xl bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-xl cursor-pointer"
                title={`${achievement.name}: ${achievement.description}`}
              >
                {achievement.icon}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Locked preview */}
      <div>
        <p className="text-xs text-night-500 mb-2">Next to unlock</p>
        <div className="flex flex-wrap gap-2">
          {locked.slice(0, 6).map((achievement) => (
            <div
              key={achievement.id}
              className="w-12 h-12 rounded-xl bg-night-800/50 border border-night-800 flex items-center justify-center cursor-pointer relative"
              title={`${achievement.name}: ${achievement.description}`}
            >
              <span className="text-xl opacity-30">{achievement.icon}</span>
              <Lock className="absolute w-4 h-4 text-night-600" />
            </div>
          ))}
          {locked.length > 6 && (
            <div className="w-12 h-12 rounded-xl bg-night-800/50 border border-night-800 flex items-center justify-center text-night-600 text-xs">
              +{locked.length - 6}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Main Progress Page
// ============================================

export default function ProgressPage() {
  const [streakInfo, setStreakInfo] = useState(getStreakInfo());
  const [goalStatus, setGoalStatus] = useState(getDailyGoalStatus());
  const [quranProgress, setQuranProgress] = useState(getQuranProgress());
  const [juzProgress, setJuzProgress] = useState<JuzProgress[]>([]);
  const [surahProgress, setSurahProgress] = useState<SurahProgressItem[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);

  useEffect(() => {
    // Load all data
    setStreakInfo(getStreakInfo());
    setGoalStatus(getDailyGoalStatus());
    setQuranProgress(getQuranProgress());
    setJuzProgress(getJuzProgress());
    setSurahProgress(getSurahProgressList());
    setWeeklyStats(getWeeklyProgress(8));

    // Listen for updates
    const handleUpdate = () => {
      setStreakInfo(getStreakInfo());
      setGoalStatus(getDailyGoalStatus());
      setQuranProgress(getQuranProgress());
      setJuzProgress(getJuzProgress());
      setSurahProgress(getSurahProgressList());
      setWeeklyStats(getWeeklyProgress(8));
    };

    window.addEventListener('motivation-updated', handleUpdate);
    window.addEventListener('progress-updated', handleUpdate);

    return () => {
      window.removeEventListener('motivation-updated', handleUpdate);
      window.removeEventListener('progress-updated', handleUpdate);
    };
  }, []);

  return (
    <div className="min-h-screen bg-night-950">
      {/* Header */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass mx-2 mt-2 rounded-2xl">
        <div className="flex items-center justify-between px-3 py-3">
          <Link href="/profile" className="liquid-icon-btn">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-night-100 text-lg">Progress</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-4"
        >
          {/* Top Stats Row */}
          <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3">
            {/* Streak Card */}
            <div className="liquid-card rounded-2xl p-4">
              <h4 className="text-xs font-medium text-night-500 mb-3">Current Streak</h4>
              <StreakDisplay
                current={streakInfo.current}
                isActiveToday={streakInfo.isActiveToday}
                streakAtRisk={streakInfo.streakAtRisk}
                freezesAvailable={streakInfo.freezesAvailable}
                nextMilestone={streakInfo.nextMilestone}
                size="md"
              />
            </div>

            {/* Daily Goal Card */}
            <div className="liquid-card rounded-2xl p-4">
              <h4 className="text-xs font-medium text-night-500 mb-3">Today's Goal</h4>
              <div className="flex items-center gap-3">
                <GoalProgressRing
                  progress={goalStatus.progress}
                  target={goalStatus.target}
                  type={goalStatus.type}
                  size={60}
                  showLabel={false}
                />
                <div>
                  <p className="text-lg font-bold text-night-100">
                    {goalStatus.progress}/{goalStatus.target}
                  </p>
                  <p className="text-xs text-night-500">
                    {goalStatus.type === 'minutes' ? 'minutes' : 'verses'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quran Completion */}
          <QuranProgressRing
            versesMemorized={quranProgress.versesMemorized}
            totalVerses={quranProgress.totalVerses}
            percentage={quranProgress.percentage}
          />

          {/* Juz Grid */}
          <JuzGrid juzProgress={juzProgress} />

          {/* Weekly Graph */}
          <WeeklyGraph weeklyStats={weeklyStats} />

          {/* Surah Progress */}
          <SurahProgressList surahs={surahProgress} />

          {/* Achievements */}
          <AchievementsSection />

          {/* Quick Stats */}
          <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-3">
            <div className="liquid-card rounded-xl p-4 text-center">
              <TrendingUp className="w-5 h-5 text-gold-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-night-100">{streakInfo.longest}</p>
              <p className="text-xs text-night-500">Best Streak</p>
            </div>
            <div className="liquid-card rounded-xl p-4 text-center">
              <Calendar className="w-5 h-5 text-sage-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-night-100">
                {juzProgress.filter(j => j.status === 'complete').length}
              </p>
              <p className="text-xs text-night-500">Juz Complete</p>
            </div>
            <div className="liquid-card rounded-xl p-4 text-center">
              <Award className="w-5 h-5 text-purple-400 mx-auto mb-2" />
              <p className="text-xl font-bold text-night-100">
                {surahProgress.filter(s => s.status === 'complete').length}
              </p>
              <p className="text-xs text-night-500">Surahs Done</p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
