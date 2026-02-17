'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Flame, Sparkles, BookOpen, Clock } from 'lucide-react';

interface DailyGoalData {
  targetMinutes: number;
  targetVerses: number;
  completedMinutes: number;
  completedVerses: number;
  isComplete: boolean;
}

interface DailyGoalCardProps {
  goal: DailyGoalData | null;
  streak: number;
  loading?: boolean;
}

function CircularProgress({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#D4A843',
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-night-800"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

export default function DailyGoalCard({ goal, streak, loading }: DailyGoalCardProps) {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (goal?.isComplete) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [goal?.isComplete]);

  if (loading || !goal) {
    return (
      <div className="liquid-glass-gold rounded-2xl p-6 animate-pulse">
        <div className="h-20 bg-night-800/50 rounded-xl" />
      </div>
    );
  }

  const minutesPercent = goal.targetMinutes > 0
    ? Math.round((goal.completedMinutes / goal.targetMinutes) * 100)
    : 0;
  const versesPercent = goal.targetVerses > 0
    ? Math.round((goal.completedVerses / goal.targetVerses) * 100)
    : 0;
  const overallPercent = Math.max(minutesPercent, versesPercent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-gold-500/15 via-gold-500/5 to-night-900 border border-gold-500/20"
      style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}
    >
      {/* Celebration overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center bg-night-950/80 rounded-2xl"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: 3, duration: 0.3 }}
                className="text-5xl mb-2"
              >
                🎉
              </motion.div>
              <p className="text-gold-400 font-semibold text-lg">Goal Complete!</p>
              <p className="text-night-400 text-sm mt-1">
                AlhamdulillAh, keep going!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-gold-400" />
          <h3 className="text-night-100 font-semibold text-lg">Today&apos;s Goal</h3>
        </div>
        {streak > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/20"
          >
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-orange-300 font-bold text-sm">{streak}</span>
            <span className="text-orange-400/70 text-xs">day{streak !== 1 ? 's' : ''}</span>
          </motion.div>
        )}
      </div>

      <div className="flex items-center gap-6">
        {/* Circular progress */}
        <div className="relative flex-shrink-0">
          <CircularProgress
            progress={overallPercent}
            size={88}
            strokeWidth={7}
            color={goal.isComplete ? '#22c55e' : '#D4A843'}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            {goal.isComplete ? (
              <Sparkles className="w-6 h-6 text-green-400" />
            ) : (
              <span className="text-night-100 font-bold text-lg">{overallPercent}%</span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-night-500" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-night-300">Minutes</span>
                <span className="text-night-100 font-medium">
                  {goal.completedMinutes}/{goal.targetMinutes}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-night-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gold-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(minutesPercent, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <BookOpen className="w-4 h-4 text-night-500" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-night-300">Verses</span>
                <span className="text-night-100 font-medium">
                  {goal.completedVerses}/{goal.targetVerses}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-night-800 overflow-hidden">
                <motion.div
                  className="h-full bg-sage-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(versesPercent, 100)}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {goal.isComplete && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-green-400 text-sm mt-4 flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          MashaAllah! Keep going to earn extra reward.
        </motion.p>
      )}
    </motion.div>
  );
}
