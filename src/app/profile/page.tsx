'use client';

import { useUser, SignOutButton, useClerk } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Settings,
  Moon,
  BookOpen,
  Award,
  Flame,
  Calendar,
  Clock,
  Target,
  ChevronRight,
  Volume2,
  Palette,
  Shield,
  HelpCircle,
  LogOut,
  Bookmark,
  List,
  User,
  Mail,
  Edit3,
  Loader2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { getProgressStats, getSurahProgressList } from '@/lib/progressStore';
import { StreakDisplay, GoalProgressRing } from '@/components/Celebrations';
import { 
  getStreakInfo, 
  getDailyGoalStatus, 
  getQuranProgress,
  getAchievements,
  updateStreak,
} from '@/lib/motivationStore';
import { useLearningPreferences } from '@/lib/preferencesStore';

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

function StatCard({ icon: Icon, value, label, color }: { 
  icon: React.ElementType; 
  value: string | number; 
  label: string; 
  color: string;
}) {
  return (
    <motion.div 
      variants={fadeInUp}
      className="liquid-card p-4 flex flex-col items-center text-center"
    >
      <div 
        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${color}`}
        style={{
          background: 'linear-gradient(135deg, currentColor 0%, transparent 100%)',
          opacity: 0.15,
        }}
      >
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <span className="text-xl font-bold text-night-100">{value}</span>
      <span className="text-xs text-night-500">{label}</span>
    </motion.div>
  );
}

function SettingsRow({ icon: Icon, label, href, onClick }: {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <div className="flex items-center justify-between py-3 px-4 hover:bg-white/5 transition-colors rounded-xl cursor-pointer">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-night-400" />
        <span className="text-night-200">{label}</span>
      </div>
      <ChevronRight className="w-4 h-4 text-night-600" />
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return <div onClick={onClick}>{content}</div>;
}

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openUserProfile } = useClerk();
  const { learning: learningPrefs } = useLearningPreferences();
  const [stats, setStats] = useState({
    versesMemorized: 0,
    surahsCompleted: 0,
    currentStreak: 0,
    totalDaysActive: 0,
    averageSessionMinutes: 0,
    totalMinutesLearned: 0,
  });
  const [recentSurahs, setRecentSurahs] = useState<Array<{
    number: number;
    name: string;
    progress: number;
  }>>([]);
  const [streakInfo, setStreakInfo] = useState(getStreakInfo());
  const [goalStatus, setGoalStatus] = useState(getDailyGoalStatus());
  const [quranProgress, setQuranProgress] = useState(getQuranProgress());
  const [achievements, setAchievements] = useState(getAchievements());

  // Load progress from local storage
  useEffect(() => {
    const progressStats = getProgressStats();
    const surahProgress = getSurahProgressList();
    
    // Convert surah progress to recent surahs
    const surahs = Object.entries(surahProgress)
      .map(([num, data]) => ({
        number: parseInt(num),
        name: data.name || `Surah ${num}`,
        progress: data.progress || 0
      }))
      .filter(s => s.progress > 0)
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 4);

    setRecentSurahs(surahs.length > 0 ? surahs : [
      { number: 1, name: 'Al-Fatihah', progress: 0 },
    ]);

    setStats({
      versesMemorized: progressStats.versesMemorized || 0,
      surahsCompleted: progressStats.surahsCompleted || 0,
      currentStreak: progressStats.currentStreak || 0,
      totalDaysActive: progressStats.totalDaysActive || 1,
      averageSessionMinutes: progressStats.averageSessionMinutes || 0,
      totalMinutesLearned: progressStats.totalMinutesLearned || 0,
    });
    
    // Load motivation data
    setStreakInfo(getStreakInfo());
    setGoalStatus(getDailyGoalStatus());
    setQuranProgress(getQuranProgress());
    setAchievements(getAchievements());
    
    // Listen for updates
    const handleUpdate = () => {
      setStreakInfo(getStreakInfo());
      setGoalStatus(getDailyGoalStatus());
      setQuranProgress(getQuranProgress());
      setAchievements(getAchievements());
    };
    
    window.addEventListener('motivation-updated', handleUpdate);
    window.addEventListener('progress-updated', handleUpdate);
    
    return () => {
      window.removeEventListener('motivation-updated', handleUpdate);
      window.removeEventListener('progress-updated', handleUpdate);
    };
  }, []);

  // Get user info
  const displayName = user?.firstName || user?.username || 'Student of Quran';
  const email = user?.primaryEmailAddress?.emailAddress;
  const avatarUrl = user?.imageUrl;
  const joinedDate = user?.createdAt 
    ? new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(user.createdAt)
    : 'Just started';

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950">
      {/* Header - Premium Frosted Glass */}
      <header 
        className="sticky top-0 z-40 safe-area-top liquid-glass mx-2 mt-2 rounded-2xl"
      >
        <div className="flex items-center justify-between px-3 py-3">
          <Link href="/" className="liquid-icon-btn">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-night-100 text-lg">Profile</h1>
          <Link href="/settings" className="liquid-icon-btn">
            <Settings className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Main Content - with proper bottom padding for nav */}
      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {/* Profile Header */}
          <motion.div 
            variants={fadeInUp}
            className="liquid-glass-gold rounded-2xl p-6 text-center"
          >
            {/* Avatar */}
            <div className="relative w-20 h-20 mx-auto mb-4">
              {isSignedIn && avatarUrl ? (
                <Image 
                  src={avatarUrl} 
                  alt={displayName}
                  width={80}
                  height={80}
                  className="w-full h-full rounded-2xl object-cover"
                  style={{
                    border: '2px solid rgba(201, 162, 39, 0.3)',
                  }}
                  priority
                />
              ) : (
                <div 
                  className="w-full h-full rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.3) 0%, rgba(201, 162, 39, 0.1) 100%)',
                    border: '2px solid rgba(201, 162, 39, 0.3)',
                  }}
                >
                  <Moon className="w-10 h-10 text-gold-400" />
                </div>
              )}
              {/* Streak badge */}
              {stats.currentStreak > 0 && (
                <div 
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #c9a227 0%, #8b6914 100%)',
                    color: '#0a0a0f',
                    boxShadow: '0 2px 8px rgba(201, 162, 39, 0.4)',
                  }}
                >
                  {stats.currentStreak}
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-semibold text-night-100 mb-1">{displayName}</h2>
            {email && (
              <p className="text-sm text-night-400 mb-1 flex items-center justify-center gap-1">
                <Mail className="w-3 h-3" />
                {email}
              </p>
            )}
            <p className="text-sm text-night-500 mb-3">Joined {joinedDate}</p>
            
            {/* Edit Profile Button (Clerk) */}
            {isSignedIn && (
              <button 
                onClick={() => openUserProfile()}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-night-800/50 text-night-300 text-sm hover:bg-night-800 transition-colors mb-3"
              >
                <Edit3 className="w-3 h-3" />
                Edit Profile
              </button>
            )}
            
            {/* Enhanced Streak Display */}
            <div className="flex justify-center mb-4">
              <StreakDisplay
                current={streakInfo.current}
                isActiveToday={streakInfo.isActiveToday}
                streakAtRisk={streakInfo.streakAtRisk}
                freezesAvailable={streakInfo.freezesAvailable}
                nextMilestone={streakInfo.nextMilestone}
                size="lg"
              />
            </div>
            
            {/* Quran Progress Mini */}
            <div className="flex items-center justify-center gap-2 text-sm text-night-400">
              <BookOpen className="w-4 h-4 text-gold-400" />
              <span>{quranProgress.versesMemorized.toLocaleString()} verses</span>
              <span className="text-night-600">•</span>
              <span className="text-gold-400">{quranProgress.percentage}% of Quran</span>
            </div>

            {/* Sign in prompt for guests */}
            {!isSignedIn && (
              <div className="mt-4 pt-4 border-t border-night-800/50">
                <p className="text-night-400 text-sm mb-3">
                  Sign in to save your progress across devices
                </p>
                <Link 
                  href="/sign-in"
                  className="liquid-btn text-sm px-6 py-2 inline-flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              </div>
            )}
          </motion.div>

          {/* Stats Grid - 2 columns, responsive */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-medium text-night-400">Your Progress</h3>
              <Link href="/progress" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                View Details
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <StatCard 
                icon={BookOpen} 
                value={quranProgress.versesMemorized} 
                label="Verses Memorized" 
                color="text-gold-400"
              />
              <StatCard 
                icon={Award} 
                value={achievements.unlocked.length} 
                label="Achievements" 
                color="text-purple-400"
              />
              <StatCard 
                icon={Zap} 
                value={streakInfo.longest} 
                label="Best Streak" 
                color="text-orange-400"
              />
              <StatCard 
                icon={Clock} 
                value={stats.totalMinutesLearned > 0 ? `${Math.floor(stats.totalMinutesLearned / 60)}h` : '0h'} 
                label="Time Learning" 
                color="text-rose-400"
              />
            </div>
          </motion.div>

          {/* Recent Surahs */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-medium text-night-400">Recent Surahs</h3>
              <Link href="/lessons" className="text-xs text-gold-400 hover:text-gold-300">
                View All
              </Link>
            </div>
            <div className="liquid-card divide-y divide-white/5">
              {recentSurahs.map((surah) => (
                <div key={surah.number} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium"
                      style={{
                        background: surah.progress === 100 
                          ? 'linear-gradient(135deg, rgba(134, 169, 113, 0.2) 0%, rgba(134, 169, 113, 0.1) 100%)'
                          : 'linear-gradient(135deg, rgba(201, 162, 39, 0.2) 0%, rgba(201, 162, 39, 0.1) 100%)',
                        color: surah.progress === 100 ? '#86a971' : '#c9a227',
                      }}
                    >
                      {surah.number}
                    </div>
                    <span className="text-night-200">{surah.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-night-800 overflow-hidden">
                      <div 
                        className="h-full rounded-full"
                        style={{
                          width: `${surah.progress}%`,
                          background: surah.progress === 100 
                            ? 'linear-gradient(90deg, #86a971 0%, #5a7f4c 100%)'
                            : 'linear-gradient(90deg, #c9a227 0%, #8b6914 100%)',
                        }}
                      />
                    </div>
                    <span className="text-xs text-night-500 w-8">{surah.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Daily Goal - Enhanced */}
          <motion.div variants={fadeInUp}>
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-medium text-night-400">Today's Goal</h3>
              <Link href="/settings" className="text-xs text-gold-400 hover:text-gold-300 flex items-center gap-1">
                <Target className="w-3 h-3" />
                {learningPrefs.dailyGoalVerses} verses / day
              </Link>
            </div>
            <div className="liquid-card p-4">
              <div className="flex items-center gap-4">
                <GoalProgressRing
                  progress={goalStatus.progress}
                  target={learningPrefs.dailyGoalVerses || goalStatus.target}
                  type="verses"
                  size={70}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-night-200 font-medium">
                      {goalStatus.progress} / {learningPrefs.dailyGoalVerses || goalStatus.target} verses
                    </span>
                    {goalStatus.progress >= (learningPrefs.dailyGoalVerses || goalStatus.target) && (
                      <span className="text-xs text-sage-400 bg-sage-500/20 px-2 py-1 rounded-full">
                        ✓ Complete!
                      </span>
                    )}
                  </div>
                  <div className="h-2 rounded-full bg-night-800 overflow-hidden">
                    <motion.div 
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, (goalStatus.progress / (learningPrefs.dailyGoalVerses || goalStatus.target)) * 100)}%` 
                      }}
                      style={{
                        background: goalStatus.progress >= (learningPrefs.dailyGoalVerses || goalStatus.target)
                          ? 'linear-gradient(90deg, #86a971 0%, #5a7f4c 100%)'
                          : 'linear-gradient(90deg, #c9a227 0%, #f4d47c 100%)',
                      }}
                    />
                  </div>
                  {goalStatus.progress < (learningPrefs.dailyGoalVerses || goalStatus.target) && goalStatus.progress > 0 && (
                    <p className="text-xs text-night-500 mt-2">
                      {(learningPrefs.dailyGoalVerses || goalStatus.target) - goalStatus.progress} verses to go!
                    </p>
                  )}
                  {goalStatus.progress === 0 && (
                    <p className="text-xs text-night-500 mt-2">
                      Start memorizing to build your streak!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-medium text-night-400 mb-3 px-1">Quick Access</h3>
            <div className="liquid-card overflow-hidden">
              <SettingsRow icon={TrendingUp} label="Detailed Progress" href="/progress" />
              <SettingsRow icon={Bookmark} label="Bookmarks" href="/bookmarks" />
              <SettingsRow icon={List} label="Surah Index" href="/surahs" />
            </div>
          </motion.div>

          {/* Settings Sections */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-medium text-night-400 mb-3 px-1">Settings</h3>
            <div className="liquid-card overflow-hidden">
              <SettingsRow icon={Volume2} label="Audio & Reciter" href="/settings" />
              <SettingsRow icon={Target} label="Daily Goal" href="/settings" />
              <SettingsRow icon={Palette} label="Preferences" href="/settings" />
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-sm font-medium text-night-400 mb-3 px-1">Support</h3>
            <div className="liquid-card overflow-hidden">
              <SettingsRow icon={HelpCircle} label="Help Center" />
              <SettingsRow icon={Shield} label="Privacy Policy" />
            </div>
          </motion.div>

          {/* Sign Out - visible at bottom */}
          {isSignedIn && (
            <motion.div variants={fadeInUp} className="pt-4">
              <SignOutButton>
                <button className="w-full py-3 px-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </SignOutButton>
            </motion.div>
          )}

          {/* Footer space to ensure content isn't cut off */}
          <div className="h-8" />
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
