'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Star,
  Lock,
  CheckCircle2,
  Sparkles,
  Moon,
  Heart,
  Trophy,
} from 'lucide-react';

// ============================================
// Journey Overview - Shows the full path
// ============================================
export function JourneyOverview() {
  const stages = [
    {
      id: 'letters',
      icon: <span className="font-arabic text-lg">ا</span>,
      title: 'Arabic Letters',
      description: 'Learn all 28 letters',
      lessons: 5,
      color: 'from-gold-500 to-gold-600',
    },
    {
      id: 'vowels',
      icon: <span className="font-arabic text-lg">بَ</span>,
      title: 'Reading Skills',
      description: 'Vowels & marks',
      lessons: 3,
      color: 'from-sage-500 to-sage-600',
    },
    {
      id: 'words',
      icon: <span className="font-arabic text-lg">كلمة</span>,
      title: 'Words',
      description: 'Common vocabulary',
      lessons: 5,
      color: 'from-midnight-500 to-midnight-600',
    },
    {
      id: 'fatiha',
      icon: <Moon className="w-5 h-5" />,
      title: 'Al-Fatiha',
      description: 'Your first surah',
      lessons: 7,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'juz-amma',
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Juz Amma',
      description: 'Short surahs',
      lessons: 20,
      color: 'from-rose-500 to-rose-600',
    },
    {
      id: 'hifz',
      icon: <Trophy className="w-5 h-5" />,
      title: 'Full HIFZ',
      description: 'Complete Quran',
      lessons: '∞',
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="py-6">
      <h3 className="text-lg font-semibold text-night-100 mb-6 text-center">
        Your Journey to <span className="text-gold-400 tracking-wider">HIFZ</span>
      </h3>
      
      <div className="relative">
        {/* Connection Line - Liquid Glass Style */}
        <div 
          className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2"
          style={{
            background: 'linear-gradient(180deg, rgba(201,162,39,0.5) 0%, rgba(134,169,113,0.3) 50%, rgba(255,255,255,0.1) 100%)',
          }}
        />
        
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-4 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`}
            >
              {/* Card - Liquid Glass */}
              <div className={`flex-1 ${index % 2 === 0 ? 'text-right pr-4' : 'text-left pl-4'}`}>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`
                    inline-block p-4 rounded-xl liquid-card-interactive
                    ${index <= 1 ? 'opacity-100' : 'opacity-50'}
                  `}
                >
                  <h4 className="font-medium text-night-100 text-sm">{stage.title}</h4>
                  <p className="text-night-500 text-xs">{stage.description}</p>
                  <p className="text-gold-400/70 text-xs mt-1 font-medium">{stage.lessons} lessons</p>
                </motion.div>
              </div>
              
              {/* Icon Node - Liquid Glass */}
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`
                  relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center
                  bg-gradient-to-br ${stage.color} text-white
                  ${index > 1 ? 'opacity-50 grayscale' : ''}
                `}
                style={{
                  boxShadow: index <= 1 
                    ? '0 8px 24px rgba(0,0,0,0.3), 0 0 20px rgba(201,162,39,0.2)' 
                    : '0 4px 16px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {stage.icon}
              </motion.div>
              
              {/* Spacer */}
              <div className="flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Unit Progress Card - Liquid Glass
// ============================================
interface UnitProgressProps {
  unitNumber: number;
  title: string;
  description: string;
  totalLessons: number;
  completedLessons: number;
  isUnlocked: boolean;
  isActive: boolean;
}

export function UnitProgressCard({
  unitNumber,
  title,
  description,
  totalLessons,
  completedLessons,
  isUnlocked,
  isActive,
}: UnitProgressProps) {
  const progress = (completedLessons / totalLessons) * 100;
  const isComplete = completedLessons === totalLessons;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isUnlocked ? { scale: 1.01 } : undefined}
      className={`relative overflow-hidden rounded-2xl p-5 transition-all duration-300 ${
        !isUnlocked ? 'opacity-50' : ''
      }`}
      style={{
        background: isActive 
          ? 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)'
          : isComplete
            ? 'linear-gradient(135deg, rgba(134,169,113,0.15) 0%, rgba(134,169,113,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: isActive 
          ? '1px solid rgba(201,162,39,0.3)'
          : isComplete
            ? '1px solid rgba(134,169,113,0.3)'
            : '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isActive 
          ? '0 8px 32px rgba(201,162,39,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
          : '0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Background Decoration */}
      {isComplete && (
        <div className="absolute top-0 right-0 w-32 h-32 -translate-y-1/2 translate-x-1/2 pointer-events-none">
          <div className="w-full h-full rounded-full bg-green-500/10 blur-3xl" />
        </div>
      )}
      
      <div className="relative flex items-start gap-4">
        {/* Unit Badge - Liquid Glass */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: isComplete 
              ? 'linear-gradient(135deg, rgba(134,169,113,0.9) 0%, rgba(100,140,90,1) 100%)'
              : isActive 
                ? 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)'
                : isUnlocked 
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
            border: isComplete 
              ? '1px solid rgba(255,255,255,0.3)'
              : isActive
                ? '2px solid rgba(201,162,39,0.5)'
                : '1px solid rgba(255,255,255,0.1)',
            boxShadow: isComplete 
              ? '0 4px 16px rgba(134,169,113,0.4)'
              : isActive
                ? '0 4px 16px rgba(201,162,39,0.2)'
                : '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {isComplete ? (
            <CheckCircle2 className="w-6 h-6 text-white" />
          ) : !isUnlocked ? (
            <Lock className="w-5 h-5 text-night-600" />
          ) : (
            <span className={`text-xl font-bold ${isActive ? 'text-gold-400' : 'text-night-300'}`}>
              {unitNumber}
            </span>
          )}
        </motion.div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold ${isUnlocked ? 'text-night-100' : 'text-night-500'}`}>
              {title}
            </h3>
            {isActive && (
              <span className="liquid-badge text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                In Progress
              </span>
            )}
          </div>
          
          <p className={`text-sm mb-4 ${isUnlocked ? 'text-night-400' : 'text-night-600'}`}>
            {description}
          </p>
          
          {/* Progress */}
          {isUnlocked && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-night-500">{completedLessons} of {totalLessons} lessons</span>
                <span className="text-gold-400 font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="liquid-progress">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`liquid-progress-fill ${isComplete ? '!bg-green-500' : ''}`}
                  style={{
                    background: isComplete 
                      ? 'linear-gradient(90deg, rgba(134,169,113,0.9) 0%, rgba(134,169,113,1) 100%)'
                      : undefined,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// Milestone Badge - Liquid Glass
// ============================================
export function MilestoneBadge({ 
  icon, 
  title, 
  achieved,
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  achieved: boolean;
  description: string;
}) {
  return (
    <motion.div 
      whileHover={achieved ? { scale: 1.05 } : undefined}
      className={`text-center p-4 rounded-2xl transition-all duration-300 ${
        achieved ? '' : 'opacity-50'
      }`}
      style={{
        background: achieved 
          ? 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
        border: achieved 
          ? '1px solid rgba(201,162,39,0.3)'
          : '1px solid rgba(255,255,255,0.05)',
        boxShadow: achieved 
          ? '0 8px 24px rgba(201,162,39,0.15)'
          : 'none',
      }}
    >
      <motion.div 
        animate={achieved ? { scale: [1, 1.1, 1] } : undefined}
        transition={{ duration: 0.5, repeat: achieved ? 0 : undefined }}
        className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-3"
        style={{
          background: achieved 
            ? 'linear-gradient(135deg, rgba(201,162,39,0.9) 0%, rgba(180,140,30,1) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
          border: '1px solid rgba(255,255,255,0.15)',
          boxShadow: achieved 
            ? '0 4px 20px rgba(201,162,39,0.4)'
            : 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        <span className={achieved ? 'text-night-950' : 'text-night-500'}>
          {icon}
        </span>
      </motion.div>
      <h4 className={`font-medium text-sm ${achieved ? 'text-gold-300' : 'text-night-500'}`}>
        {title}
      </h4>
      <p className="text-xs text-night-600 mt-1">{description}</p>
    </motion.div>
  );
}

// ============================================
// Weekly Goal Tracker - Liquid Glass
// ============================================
export function WeeklyGoalTracker({ 
  daysCompleted,
  dailyGoalMinutes,
  currentStreak 
}: { 
  daysCompleted: boolean[];
  dailyGoalMinutes: number;
  currentStreak: number;
}) {
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const today = new Date().getDay();
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-card-interactive rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <h4 className="font-semibold text-night-100">This Week</h4>
        <div className="liquid-badge">
          <Sparkles className="w-3 h-3" />
          <span className="ml-1">{currentStreak} day streak</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between gap-2">
        {days.map((day, index) => {
          const isToday = index === today;
          const isCompleted = daysCompleted[index];
          
          return (
            <motion.div 
              key={index} 
              whileHover={{ scale: 1.1 }}
              className="flex-1 text-center"
            >
              <div 
                className={`
                  w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-xs font-semibold
                  transition-all duration-300
                `}
                style={{
                  background: isCompleted 
                    ? 'linear-gradient(135deg, rgba(134,169,113,0.9) 0%, rgba(100,140,90,1) 100%)'
                    : isToday 
                      ? 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                  border: isCompleted 
                    ? '1px solid rgba(255,255,255,0.2)'
                    : isToday
                      ? '2px solid rgba(201,162,39,0.5)'
                      : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isCompleted 
                    ? '0 4px 12px rgba(134,169,113,0.3)'
                    : isToday
                      ? '0 0 16px rgba(201,162,39,0.2)'
                      : 'none',
                }}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : (
                  <span className={isToday ? 'text-gold-400' : 'text-night-500'}>
                    {day}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <p className="text-center text-night-500 text-xs mt-4">
        Goal: <span className="text-gold-400 font-medium">{dailyGoalMinutes} minutes</span> daily
      </p>
    </motion.div>
  );
}

// ============================================
// Daily Wisdom - Liquid Glass
// ============================================
export function DailyWisdom() {
  const wisdoms = [
    {
      text: "The best among you are those who learn the Quran and teach it.",
      source: "Prophet Muhammad ﷺ (Bukhari)",
    },
    {
      text: "The one who is proficient in the recitation of the Quran will be with the honorable and obedient scribes (angels).",
      source: "Prophet Muhammad ﷺ (Bukhari & Muslim)",
    },
    {
      text: "Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection.",
      source: "Prophet Muhammad ﷺ (Muslim)",
    },
    {
      text: "The one who recites the Quran while struggling with it will have a double reward.",
      source: "Prophet Muhammad ﷺ (Bukhari & Muslim)",
    },
  ];
  
  const wisdom = wisdoms[Math.floor(Math.random() * wisdoms.length)];
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-2xl p-5 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(134,169,113,0.12) 0%, rgba(134,169,113,0.04) 100%)',
        border: '1px solid rgba(134,169,113,0.2)',
        boxShadow: '0 8px 32px rgba(134,169,113,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 -translate-y-1/2 translate-x-1/2 pointer-events-none">
        <div className="w-full h-full rounded-full bg-sage-500/10 blur-2xl" />
      </div>
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-sage-400" />
          <span className="text-xs text-sage-400 uppercase tracking-widest font-semibold">Daily Wisdom</span>
        </div>
        
        <p className="text-night-200 text-sm leading-relaxed mb-3 italic">
          "{wisdom.text}"
        </p>
        
        <p className="text-night-500 text-xs">
          — {wisdom.source}
        </p>
      </div>
    </motion.div>
  );
}

// ============================================
// Achievement Unlock Animation - Liquid Glass
// ============================================
export function AchievementUnlock({ 
  title, 
  description, 
  icon,
  show,
  onClose 
}: { 
  title: string;
  description: string;
  icon: React.ReactNode;
  show: boolean;
  onClose: () => void;
}) {
  if (!show) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(10, 10, 15, 0.9)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          className="relative rounded-3xl p-8 text-center max-w-sm overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, rgba(201,162,39,0.15) 0%, rgba(20,20,25,0.98) 50%)',
            border: '1px solid rgba(201,162,39,0.3)',
            boxShadow: '0 24px 80px rgba(201,162,39,0.2), 0 8px 32px rgba(0,0,0,0.4)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none">
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 -translate-y-1/2"
              style={{
                background: 'radial-gradient(circle, rgba(201,162,39,0.3) 0%, transparent 70%)',
              }}
            />
          </div>
          
          {/* Icon with glow */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ delay: 0.2 }}
            className="relative w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
              boxShadow: '0 8px 32px rgba(201,162,39,0.5), inset 0 1px 0 rgba(255,255,255,0.3)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <span className="text-night-950">{icon}</span>
          </motion.div>
          
          {/* Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(201,162,39,1) 0%, rgba(220,180,50,1) 100%)',
                left: '50%',
                top: '40%',
              }}
              initial={{ scale: 0, x: 0, y: 0 }}
              animate={{
                scale: [0, 1, 0],
                x: Math.cos(i * 45 * Math.PI / 180) * 100,
                y: Math.sin(i * 45 * Math.PI / 180) * 100,
              }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          ))}
          
          <h3 className="relative text-2xl font-bold text-gold-400 mb-2">{title}</h3>
          <p className="relative text-night-300 text-sm mb-6">{description}</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="relative liquid-btn"
          >
            Continue
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
