'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Flame, 
  Sparkles, 
  BookOpen,
  Award,
  Target,
  Share2,
  X,
  CheckCircle2,
} from 'lucide-react';
import { 
  type CelebrationEvent, 
  type Achievement,
  clearAllPendingCelebrations,
} from '@/lib/motivationStore';

// ============================================
// Confetti Component - Pure CSS/React Animation
// ============================================

interface ConfettiPiece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  color: string;
  rotation: number;
  size: number;
}

function Confetti({ 
  active, 
  duration = 3000,
  particleCount = 50,
}: { 
  active: boolean;
  duration?: number;
  particleCount?: number;
}) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  
  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }
    
    const colors = [
      '#C9A227', // Gold
      '#F4D47C', // Light gold
      '#86A971', // Sage
      '#5A7F4C', // Dark sage
      '#A855F7', // Purple
      '#EC4899', // Pink
      '#3B82F6', // Blue
      '#ffffff', // White
    ];
    
    const newPieces: ConfettiPiece[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 2 + Math.random() * 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 8,
    }));
    
    setPieces(newPieces);
    
    const timer = setTimeout(() => setPieces([]), duration);
    return () => clearTimeout(timer);
  }, [active, duration, particleCount]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: -20,
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            transform: `rotate(${piece.rotation}deg)`,
          }}
          initial={{ y: -20, opacity: 1, rotate: piece.rotation }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0],
            rotate: piece.rotation + 720,
            x: [-20, 20, -20, 20, 0],
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}

// ============================================
// Achievement Badge Component
// ============================================

function AchievementBadge({ achievement }: { achievement: Achievement }) {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="relative"
    >
      {/* Glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: 'radial-gradient(circle, rgba(201, 162, 39, 0.5) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Badge */}
      <div 
        className="relative w-24 h-24 rounded-full flex items-center justify-center text-5xl"
        style={{
          background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.3) 0%, rgba(201, 162, 39, 0.1) 100%)',
          border: '3px solid rgba(201, 162, 39, 0.5)',
          boxShadow: '0 0 40px rgba(201, 162, 39, 0.3), inset 0 0 20px rgba(201, 162, 39, 0.1)',
        }}
      >
        {achievement.icon}
      </div>
    </motion.div>
  );
}

// ============================================
// Streak Flame Animation
// ============================================

function StreakFlame({ days }: { days: number }) {
  return (
    <motion.div
      className="relative"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {/* Animated flames */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ 
          filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'],
        }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        <Flame className="w-20 h-20 text-orange-500" />
      </motion.div>
      
      {/* Flame particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? '#F97316' : '#FBBF24',
          }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{
            x: Math.cos(i * 45 * Math.PI / 180) * 50,
            y: [0, Math.sin(i * 45 * Math.PI / 180) * 50 - 30],
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
      
      {/* Day count */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-2xl font-bold text-white drop-shadow-lg">{days}</span>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// XP Burst Animation
// ============================================

function XPBurst({ amount }: { amount: number }) {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
    >
      {/* Ring burst */}
      <motion.div
        className="absolute w-40 h-40 rounded-full border-4 border-gold-400"
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
      
      {/* Star particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{
            x: Math.cos(i * 30 * Math.PI / 180) * 80,
            y: Math.sin(i * 30 * Math.PI / 180) * 80,
            opacity: [1, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{ duration: 0.6, delay: i * 0.02 }}
        >
          <Star className="w-5 h-5 text-gold-400 fill-gold-400" />
        </motion.div>
      ))}
      
      {/* Main XP badge */}
      <motion.div
        className="relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-2xl"
        style={{
          background: 'linear-gradient(135deg, #C9A227 0%, #8B6914 100%)',
          color: '#0a0a0f',
          boxShadow: '0 0 40px rgba(201, 162, 39, 0.5)',
        }}
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
      >
        <Star className="w-6 h-6 fill-current" />
        <span>+{amount} XP</span>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// Main Celebration Overlay Component
// ============================================

interface CelebrationOverlayProps {
  event: CelebrationEvent | null;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function CelebrationOverlay({ 
  event, 
  onClose,
  autoClose = true,
  autoCloseDelay = 4000,
}: CelebrationOverlayProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (event) {
      setShowConfetti(true);
      
      if (autoClose) {
        const timer = setTimeout(() => {
          onClose();
        }, autoCloseDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [event, autoClose, autoCloseDelay, onClose]);
  
  const handleShare = () => {
    if (!event) return;
    
    let text = '';
    switch (event.type) {
      case 'surah_complete':
        text = `Alhamdulillah! I just completed memorizing Surah ${event.surahName} 📖✨ #QuranMemorization #HIFZ`;
        break;
      case 'juz_complete':
        text = `Alhamdulillah! I just completed Juz ${event.juzNumber} of the Quran! 🎉📚 #QuranMemorization #HIFZ`;
        break;
      case 'streak_milestone':
        text = `🔥 ${event.days} day streak in Quran memorization! Consistency is key! #QuranMemorization #HIFZ`;
        break;
      case 'achievement_unlocked':
        text = `Just unlocked "${event.achievement.name}" ${event.achievement.icon} in my Quran journey! #QuranMemorization #HIFZ`;
        break;
      default:
        text = `Making progress on my Quran memorization journey! 📖✨ #QuranMemorization #HIFZ`;
    }
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };
  
  if (!event) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[99] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-night-950/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={onClose}
        />
        
        {/* Confetti */}
        <Confetti 
          active={showConfetti} 
          particleCount={event.type === 'surah_complete' || event.type === 'juz_complete' ? 100 : 50}
        />
        
        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-6 py-8 max-w-md"
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-night-400" />
          </button>
          
          {/* Event-specific content */}
          {event.type === 'lesson_complete' && (
            <>
              <XPBurst amount={event.xp} />
              <motion.h2
                className="text-2xl font-bold text-night-100 mt-6 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Lesson Complete! 🎉
              </motion.h2>
              <motion.p
                className="text-night-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Mashallah! Keep up the great work!
              </motion.p>
            </>
          )}
          
          {event.type === 'surah_complete' && (
            <>
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <Trophy className="w-12 h-12 text-night-950" />
                </div>
              </motion.div>
              <motion.h2
                className="text-3xl font-bold text-gold-400 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Surah Complete!
              </motion.h2>
              <motion.p
                className="text-xl text-night-200 font-arabic mb-2"
                style={{ direction: 'rtl' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {event.surahName}
              </motion.p>
              <motion.p
                className="text-night-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Mashallah! You've memorized the entire surah! 📖
              </motion.p>
              <motion.button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-night-800 hover:bg-night-700 text-night-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Share2 className="w-4 h-4" />
                Share Achievement
              </motion.button>
            </>
          )}
          
          {event.type === 'juz_complete' && (
            <>
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-14 h-14 text-white" />
                </div>
              </motion.div>
              <motion.h2
                className="text-3xl font-bold text-purple-400 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Juz {event.juzNumber} Complete!
              </motion.h2>
              <motion.p
                className="text-night-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                SubhanAllah! A major milestone in your HIFZ journey! 🌟
              </motion.p>
              <motion.button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-night-800 hover:bg-night-700 text-night-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Share2 className="w-4 h-4" />
                Share Achievement
              </motion.button>
            </>
          )}
          
          {event.type === 'achievement_unlocked' && (
            <>
              <AchievementBadge achievement={event.achievement} />
              <motion.h2
                className="text-2xl font-bold text-gold-400 mt-6 mb-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Achievement Unlocked!
              </motion.h2>
              <motion.h3
                className="text-xl text-night-100 mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {event.achievement.name}
              </motion.h3>
              <motion.p
                className="text-night-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {event.achievement.description}
              </motion.p>
              <motion.button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-night-800 hover:bg-night-700 text-night-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Share2 className="w-4 h-4" />
                Share
              </motion.button>
            </>
          )}
          
          {event.type === 'streak_milestone' && (
            <>
              <StreakFlame days={event.days} />
              <motion.h2
                className="text-3xl font-bold text-orange-400 mt-8 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {event.days} Day Streak! 🔥
              </motion.h2>
              <motion.p
                className="text-night-400 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Your dedication is incredible! Keep the momentum going!
              </motion.p>
              <motion.button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-night-800 hover:bg-night-700 text-night-200 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Share2 className="w-4 h-4" />
                Share Streak
              </motion.button>
            </>
          )}
          
          {event.type === 'daily_goal_met' && (
            <>
              <motion.div
                className="mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-sage-400 to-sage-600 flex items-center justify-center">
                  <Target className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              <motion.h2
                className="text-2xl font-bold text-sage-400 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Daily Goal Achieved! ✅
              </motion.h2>
              <motion.p
                className="text-night-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You've met your goal for today. Consistency leads to mastery!
              </motion.p>
            </>
          )}
          
          {event.type === 'verse_memorized' && (
            <>
              <motion.div
                className="mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <CheckCircle2 className="w-16 h-16 text-sage-400 mx-auto" />
              </motion.div>
              <motion.h2
                className="text-xl font-bold text-night-100 mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Verse Memorized!
              </motion.h2>
              <motion.p
                className="text-night-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {event.verseCount} verse{event.verseCount > 1 ? 's' : ''} added to your memorization!
              </motion.p>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================
// Celebration Provider Hook
// ============================================

export function useCelebration() {
  const [currentEvent, setCurrentEvent] = useState<CelebrationEvent | null>(null);
  
  useEffect(() => {
    const handleCelebration = (e: CustomEvent<CelebrationEvent>) => {
      setCurrentEvent(e.detail);
    };
    
    window.addEventListener('celebration', handleCelebration as EventListener);
    return () => window.removeEventListener('celebration', handleCelebration as EventListener);
  }, []);
  
  const closeCelebration = useCallback(() => {
    setCurrentEvent(null);
    clearAllPendingCelebrations();
  }, []);
  
  const triggerEvent = useCallback((event: CelebrationEvent) => {
    setCurrentEvent(event);
  }, []);
  
  return {
    currentEvent,
    closeCelebration,
    triggerEvent,
  };
}

// ============================================
// Streak Display Component (for Profile/Home)
// ============================================

interface StreakDisplayProps {
  current: number;
  isActiveToday: boolean;
  streakAtRisk: boolean;
  freezesAvailable: number;
  nextMilestone: number | null;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakDisplay({ 
  current, 
  isActiveToday, 
  streakAtRisk,
  freezesAvailable,
  nextMilestone,
  size = 'md',
}: StreakDisplayProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };
  
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7',
    lg: 'w-10 h-10',
  };
  
  return (
    <div className="flex items-center gap-3">
      <motion.div
        className="relative"
        animate={current > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: current > 0 ? Infinity : 0, repeatDelay: 2 }}
      >
        <Flame 
          className={`${iconSizes[size]} ${
            current > 0 ? 'text-orange-500' : 'text-night-600'
          }`} 
        />
        {streakAtRisk && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </motion.div>
      
      <div>
        <div className="flex items-baseline gap-1">
          <span className={`font-bold ${sizeClasses[size]} ${
            current > 0 ? 'text-orange-400' : 'text-night-500'
          }`}>
            {current}
          </span>
          <span className="text-sm text-night-500">day{current !== 1 ? 's' : ''}</span>
        </div>
        
        {streakAtRisk ? (
          <p className="text-xs text-red-400">Practice today to keep streak!</p>
        ) : isActiveToday && current > 0 ? (
          <p className="text-xs text-sage-400">Streak safe ✓</p>
        ) : nextMilestone ? (
          <p className="text-xs text-night-500">{nextMilestone - current} days to next milestone</p>
        ) : null}
      </div>
      
      {freezesAvailable > 0 && size !== 'sm' && (
        <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-500/10">
          <span className="text-xs text-blue-400">❄️ {freezesAvailable}</span>
        </div>
      )}
    </div>
  );
}

// ============================================
// Daily Goal Progress Ring
// ============================================

interface GoalProgressRingProps {
  progress: number;
  target: number;
  type: 'minutes' | 'verses';
  size?: number;
  showLabel?: boolean;
}

export function GoalProgressRing({ 
  progress, 
  target, 
  type,
  size = 80,
  showLabel = true,
}: GoalProgressRingProps) {
  const percentage = Math.min(100, (progress / target) * 100);
  const circumference = 2 * Math.PI * 35;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isComplete = progress >= target;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={35 * (size / 80)}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={6 * (size / 80)}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={35 * (size / 80)}
          fill="none"
          stroke={isComplete ? '#86A971' : '#C9A227'}
          strokeWidth={6 * (size / 80)}
          strokeLinecap="round"
          strokeDasharray={circumference * (size / 80)}
          initial={{ strokeDashoffset: circumference * (size / 80) }}
          animate={{ strokeDashoffset: strokeDashoffset * (size / 80) }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isComplete ? (
          <CheckCircle2 className="w-6 h-6 text-sage-400" />
        ) : (
          <>
            <span className="text-lg font-bold text-night-100">{Math.round(percentage)}%</span>
            {showLabel && (
              <span className="text-[10px] text-night-500">
                {progress}/{target} {type === 'minutes' ? 'min' : 'verses'}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
