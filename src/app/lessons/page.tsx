'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  CheckCircle2, 
  Play,
  Star,
  Clock,
  BookOpen,
  Trophy,
  Flame,
  Target,
  Moon,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { 
  ALL_BEGINNER_LESSONS,
  ALL_INTERMEDIATE_LESSONS,
  ALL_ADVANCED_LESSONS,
  BEGINNER_UNITS,
  INTERMEDIATE_UNITS,
  ADVANCED_UNITS,
  type Lesson,
  getLessonById,
  getLessonsByUnit,
  getLessonsByPath,
  getUnitsForPath,
  isLessonUnlocked 
} from '@/lib/lesson-content';
import LessonCompletionOverlay from '@/components/LessonCompletionOverlay';
import BottomNav from '@/components/BottomNav';
import { DailyWisdom } from '@/components/JourneyMap';

// ============================================
// Unit Section Component - Liquid Glass
// ============================================
interface UnitSectionProps {
  unit: { number: number; title: string; lessons: number; description: string };
  lessons: Lesson[];
  completedLessons: string[];
  isActive: boolean;
  nextLessonId?: string;
}

function UnitSection({ unit, lessons, completedLessons, isActive, nextLessonId }: UnitSectionProps) {
  const [isExpanded, setIsExpanded] = useState(isActive);
  const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
  const progress = (completedCount / lessons.length) * 100;
  const isComplete = completedCount === lessons.length;
  
  // Unit icons and colors
  const unitStyles = [
    { icon: <span className="font-arabic text-lg">أ</span>, color: 'from-gold-500 to-gold-600' },
    { icon: <span className="font-arabic text-lg">بَ</span>, color: 'from-sage-500 to-sage-600' },
    { icon: <Moon className="w-5 h-5" />, color: 'from-purple-500 to-purple-600' },
    { icon: <Star className="w-5 h-5" />, color: 'from-rose-500 to-rose-600' },
  ];
  const style = unitStyles[unit.number - 1] || unitStyles[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden"
      style={{
        background: isActive 
          ? 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.04) 100%)'
          : isComplete 
            ? 'linear-gradient(135deg, rgba(134,169,113,0.12) 0%, rgba(134,169,113,0.04) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: isActive 
          ? '1px solid rgba(201,162,39,0.25)'
          : isComplete
            ? '1px solid rgba(134,169,113,0.25)'
            : '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: isActive 
          ? '0 8px 32px rgba(201,162,39,0.1), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Unit Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 flex items-center gap-4 text-left transition-all hover:bg-white/[0.02]"
      >
        {/* Unit Badge - Liquid Glass */}
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-white"
          style={{
            background: `linear-gradient(135deg, ${isComplete ? 'rgba(134,169,113,0.9) 0%, rgba(100,140,90,1)' : style.color.split(' ').map(c => c.replace('from-', 'rgba(').replace('to-', 'rgba(').replace('-500', ',0.8)').replace('-600', ',1)')).join(' 0%, ')} 100%)`,
            boxShadow: isComplete 
              ? '0 8px 24px rgba(134,169,113,0.4), inset 0 1px 0 rgba(255,255,255,0.3)'
              : '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {isComplete ? <CheckCircle2 className="w-6 h-6" /> : style.icon}
        </motion.div>
        
        {/* Unit Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-night-500 font-medium">Unit {unit.number}</span>
            {isActive && !isComplete && (
              <span className="liquid-badge text-xs">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                Current
              </span>
            )}
            {isComplete && (
              <span 
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  background: 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)',
                  color: '#86a971',
                  border: '1px solid rgba(134,169,113,0.2)',
                }}
              >
                Complete
              </span>
            )}
          </div>
          <h3 className="font-semibold text-night-100 text-lg mb-1">{unit.title}</h3>
          <div className="flex items-center gap-3 text-xs text-night-500">
            <span>{completedCount}/{lessons.length} lessons</span>
            <span>•</span>
            <span className="text-gold-400/80 font-medium">{Math.round(progress)}% complete</span>
          </div>
        </div>
        
        {/* Expand/Collapse */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="liquid-icon-btn !w-10 !h-10"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      {/* Progress Bar - Liquid Glass */}
      <div className="px-5 pb-3">
        <div className="liquid-progress">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="liquid-progress-fill"
            style={{
              background: isComplete 
                ? 'linear-gradient(90deg, rgba(134,169,113,0.9) 0%, rgba(134,169,113,1) 100%)'
                : undefined,
              boxShadow: isComplete 
                ? '0 0 12px rgba(134,169,113,0.5), inset 0 1px 0 rgba(255,255,255,0.3)'
                : undefined,
            }}
          />
        </div>
      </div>
      
      {/* Lessons List */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-2 space-y-2">
              {lessons.map((lesson, index) => {
                const isLessonComplete = completedLessons.includes(lesson.id);
                const isNextLesson = nextLessonId === lesson.id;
                
                return (
                  <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      className="flex items-center gap-4 p-4 rounded-2xl transition-all"
                      style={{
                        background: isNextLesson 
                          ? 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.05) 100%)'
                          : isLessonComplete 
                            ? 'linear-gradient(135deg, rgba(134,169,113,0.1) 0%, rgba(134,169,113,0.03) 100%)'
                            : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                        border: isNextLesson 
                          ? '1px solid rgba(201,162,39,0.3)'
                          : isLessonComplete
                            ? '1px solid rgba(134,169,113,0.2)'
                            : '1px solid rgba(255,255,255,0.06)',
                        boxShadow: isNextLesson 
                          ? '0 4px 16px rgba(201,162,39,0.15)'
                          : 'none',
                      }}
                    >
                      {/* Lesson Number/Status */}
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold flex-shrink-0"
                        style={{
                          background: isLessonComplete 
                            ? 'linear-gradient(135deg, rgba(134,169,113,0.9) 0%, rgba(100,140,90,1) 100%)'
                            : isNextLesson 
                              ? 'linear-gradient(135deg, rgba(201,162,39,0.9) 0%, rgba(180,140,30,1) 100%)'
                              : 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                          color: isLessonComplete || isNextLesson ? '#0a0a0f' : '#9ca3af',
                          border: '1px solid rgba(255,255,255,0.15)',
                          boxShadow: (isLessonComplete || isNextLesson) 
                            ? '0 4px 12px rgba(0,0,0,0.2)'
                            : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                        }}
                      >
                        {isLessonComplete ? <CheckCircle2 className="w-5 h-5" /> : lesson.number}
                      </div>
                      
                      {/* Lesson Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-medium truncate ${
                          isLessonComplete ? 'text-night-400' : 'text-night-100'
                        }`}>
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-night-500 flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3" />
                          {lesson.estimatedMinutes} min
                          <span>•</span>
                          <Star className="w-3 h-3 text-gold-500/50" />
                          {lesson.xpReward} XP
                        </p>
                      </div>
                      
                      {/* Action */}
                      {isNextLesson && (
                        <div className="flex items-center gap-1.5 text-gold-400 text-xs font-semibold">
                          <Play className="w-4 h-4" />
                          Start
                        </div>
                      )}
                      {isLessonComplete && (
                        <span className="text-sage-400 text-xs font-medium">Review →</span>
                      )}
                      {!isLessonComplete && !isNextLesson && (
                        <ChevronRight className="w-4 h-4 text-night-600" />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// Path Section Component - Accordion Drawer
// ============================================
interface PathSectionProps {
  path: 'beginner' | 'intermediate' | 'advanced';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  lessons: Lesson[];
  units: { number: number; title: string; lessons: number; description: string }[];
  completedLessons: string[];
  isDefaultOpen?: boolean;
  nextLessonId?: string;
}

function PathSection({ 
  path, 
  title, 
  subtitle, 
  icon, 
  lessons, 
  units, 
  completedLessons, 
  isDefaultOpen = false,
  nextLessonId 
}: PathSectionProps) {
  const [isOpen, setIsOpen] = useState(isDefaultOpen);
  const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
  const progress = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;
  const isComplete = completedCount === lessons.length && lessons.length > 0;
  
  // Path colors
  const pathColors = {
    beginner: {
      bg: 'rgba(201,162,39,0.12)',
      bgEnd: 'rgba(201,162,39,0.04)',
      border: 'rgba(201,162,39,0.25)',
      accent: '#c9a227',
    },
    intermediate: {
      bg: 'rgba(134,169,113,0.12)',
      bgEnd: 'rgba(134,169,113,0.04)',
      border: 'rgba(134,169,113,0.25)',
      accent: '#86a971',
    },
    advanced: {
      bg: 'rgba(168,85,247,0.12)',
      bgEnd: 'rgba(168,85,247,0.04)',
      border: 'rgba(168,85,247,0.25)',
      accent: '#a855f7',
    },
  };
  
  const colors = pathColors[path];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl overflow-hidden mb-4"
      style={{
        background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.bgEnd} 100%)`,
        border: `1px solid ${colors.border}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Path Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center gap-4 text-left transition-all hover:bg-white/[0.02]"
      >
        {/* Path Icon */}
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `linear-gradient(135deg, ${colors.accent}dd 0%, ${colors.accent} 100%)`,
            boxShadow: `0 8px 24px ${colors.accent}40, inset 0 1px 0 rgba(255,255,255,0.3)`,
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          {icon}
        </div>
        
        {/* Path Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-night-100 text-lg">{title}</h3>
            {isComplete && (
              <span 
                className="text-xs px-2.5 py-0.5 rounded-full font-medium"
                style={{
                  background: `${colors.accent}20`,
                  color: colors.accent,
                  border: `1px solid ${colors.accent}30`,
                }}
              >
                ✓ Complete
              </span>
            )}
          </div>
          <p className="text-sm text-night-400 mb-2">{subtitle}</p>
          <div className="flex items-center gap-3 text-xs text-night-500">
            <span>{completedCount}/{lessons.length} lessons</span>
            <span>•</span>
            <span style={{ color: colors.accent }} className="font-medium">{Math.round(progress)}%</span>
          </div>
        </div>
        
        {/* Expand/Collapse */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="liquid-icon-btn !w-10 !h-10"
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      {/* Progress Bar */}
      <div className="px-5 pb-3">
        <div className="liquid-progress">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="liquid-progress-fill"
            style={{
              background: `linear-gradient(90deg, ${colors.accent}cc 0%, ${colors.accent} 100%)`,
              boxShadow: `0 0 12px ${colors.accent}50, inset 0 1px 0 rgba(255,255,255,0.3)`,
            }}
          />
        </div>
      </div>
      
      {/* Units List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {units.map((unit) => {
                const unitLessons = lessons.filter(l => l.unit === unit.number);
                const isFirstIncomplete = units.findIndex(u => {
                  const uLessons = lessons.filter(l => l.unit === u.number);
                  return uLessons.some(l => !completedLessons.includes(l.id));
                }) === units.indexOf(unit);
                
                return (
                  <UnitSection
                    key={`${path}-${unit.number}`}
                    unit={unit}
                    lessons={unitLessons}
                    completedLessons={completedLessons}
                    isActive={isFirstIncomplete}
                    nextLessonId={nextLessonId}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============================================
// Branded Path Icons - Matching the HIFZ Logo System
// Beginner: Moon + Open Book (1 chevron)
// Intermediate: Moon + Book with 2 chevrons  
// Advanced: Moon + Book with 3 chevrons
// ============================================
function BeginnerIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
      {/* Crescent Moon - top left */}
      <path 
        d="M12 3C8 3 5 6 5 10s3 7 7 7c-4 0-7-3-7-7s3-7 7-7z" 
        fill="#0a0a0f"
      />
      {/* Open book - single V shape */}
      <path 
        d="M16 14 C12 16, 6 18, 2 21 L16 28 L30 21 C26 18, 20 16, 16 14 Z" 
        fill="#0a0a0f"
      />
    </svg>
  );
}

function IntermediateIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
      {/* Crescent Moon - top left */}
      <path 
        d="M12 2C8 2 5 5 5 9s3 7 7 7c-4 0-7-3-7-7s3-7 7-7z" 
        fill="#0a0a0f"
      />
      {/* Open book - V shape */}
      <path 
        d="M16 11 C12 13, 6 15, 2 17 L16 23 L30 17 C26 15, 20 13, 16 11 Z" 
        fill="#0a0a0f"
      />
      {/* Second chevron */}
      <path 
        d="M2 22 L16 28 L30 22" 
        fill="#0a0a0f"
        stroke="#0a0a0f"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AdvancedIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-7 h-7" fill="none">
      {/* Crescent Moon - top left */}
      <path 
        d="M12 1C8 1 5 4 5 8s3 7 7 7c-4 0-7-3-7-7s3-7 7-7z" 
        fill="#0a0a0f"
      />
      {/* Open book - V shape */}
      <path 
        d="M16 9 C12 11, 6 13, 2 15 L16 20 L30 15 C26 13, 20 11, 16 9 Z" 
        fill="#0a0a0f"
      />
      {/* Second chevron */}
      <path 
        d="M2 19 L16 24 L30 19" 
        fill="#0a0a0f"
        stroke="#0a0a0f"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Third chevron */}
      <path 
        d="M2 24 L16 29 L30 24" 
        fill="#0a0a0f"
        stroke="#0a0a0f"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Wrapper component to handle search params with Suspense
function LessonsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  
  // Handle completion query param
  const completedLessonId = searchParams.get('completed');
  const completedLesson = completedLessonId ? getLessonById(completedLessonId) : null;

  useEffect(() => {
    const saved = localStorage.getItem('quranOasis_completedLessons');
    if (saved) {
      const completed = JSON.parse(saved);
      setCompletedLessons(completed);
      
      const xp = completed.reduce((sum: number, id: string) => {
        const lesson = getLessonById(id);
        return sum + (lesson?.xpReward || 0);
      }, 0);
      setTotalXP(xp);
    }

    const streakData = localStorage.getItem('quranOasis_streak');
    if (streakData) {
      setCurrentStreak(JSON.parse(streakData).current || 0);
    }
  }, []);

  const handleCloseCompletion = () => {
    // Remove the query param
    router.replace('/lessons', { scroll: false });
  };

  const totalLessons = ALL_BEGINNER_LESSONS.length + ALL_INTERMEDIATE_LESSONS.length + ALL_ADVANCED_LESSONS.length;
  const beginnerLessonsCount = ALL_BEGINNER_LESSONS.length;
  const beginnerCompleted = completedLessons.filter(id => ALL_BEGINNER_LESSONS.some(l => l.id === id)).length;
  const progressPercent = (completedLessons.length / totalLessons) * 100;

  const nextLesson = ALL_BEGINNER_LESSONS.find(
    lesson => !completedLessons.includes(lesson.id) && isLessonUnlocked(lesson.id, completedLessons)
  );

  return (
    <>
      {/* Lesson Completion Overlay */}
      <LessonCompletionOverlay
        lessonId={completedLessonId}
        lessonTitle={completedLesson?.title}
        onClose={handleCloseCompletion}
      />
    <div className="min-h-screen bg-night-950">
      {/* Header - Premium Frosted Glass */}
      <header 
        className="sticky top-0 z-40 safe-area-top liquid-glass mx-2 mt-2 rounded-2xl"
      >
        <div className="flex items-center justify-between px-3 py-3">
          <Link href="/" className="liquid-icon-btn" aria-label="Back to home">
            <ChevronLeft className="w-5 h-5" aria-hidden="true" />
          </Link>
          <h1 className="font-semibold text-night-100 text-lg">Lessons</h1>
          <div className="w-11" />
        </div>
      </header>

      <main className="pb-28">
        {/* Stats Section - Liquid Glass Cards */}
        <div className="px-4 py-6">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { icon: Flame, value: currentStreak, label: 'Day Streak', color: 'gold' },
              { icon: Star, value: totalXP, label: 'Total XP', color: 'gold' },
              { icon: Target, value: completedLessons.length, label: 'Completed', color: 'sage' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.02 }}
                className="text-center p-4 rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color === 'gold' ? 'text-gold-400' : 'text-sage-400'}`} />
                  <span className="text-2xl font-bold text-night-100">{stat.value}</span>
                </div>
                <p className="text-xs text-night-500 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Progress Card - Liquid Glass Gold */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-6 mb-6 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.04) 100%)',
              border: '1px solid rgba(201,162,39,0.2)',
              boxShadow: '0 8px 32px rgba(201,162,39,0.1), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-40 h-40 -translate-y-1/2 translate-x-1/2 pointer-events-none">
              <div className="w-full h-full rounded-full bg-gold-500/10 blur-3xl" />
            </div>
            
            <div className="relative flex items-center justify-between mb-5">
              <div>
                <p className="text-night-400 text-sm">Your Progress</p>
                <p className="text-3xl font-bold text-night-100">{Math.round(progressPercent)}%</p>
              </div>
              <div className="text-right">
                <p className="text-night-400 text-sm">All Paths</p>
                <p className="text-sm text-night-300 font-medium">
                  {completedLessons.length} of {totalLessons} lessons
                </p>
              </div>
            </div>
            
            <div className="relative liquid-progress h-3 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="liquid-progress-fill h-full"
              />
            </div>
          </motion.div>

          {/* Continue Learning CTA - Prominent Liquid Glass */}
          {nextLesson && (
            <Link href={`/lessons/${nextLesson.id}`}>
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                className="rounded-2xl p-5 flex items-center gap-4 mb-8 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                  boxShadow: '0 8px 32px rgba(201,162,39,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                  }}
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
                
                <div 
                  className="p-3 rounded-xl"
                  style={{
                    background: 'rgba(10,10,15,0.2)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <Play className="w-6 h-6 text-night-950" />
                </div>
                <div className="flex-1 relative">
                  <p className="text-night-950/70 text-sm font-medium">Continue Learning</p>
                  <p className="font-bold text-night-950">{nextLesson.title}</p>
                </div>
                <ChevronRight className="w-6 h-6 text-night-950/60" />
              </motion.div>
            </Link>
          )}

          {/* Daily Wisdom */}
          <div className="mb-8">
            <DailyWisdom />
          </div>

          {/* Learning Paths - Accordion Structure */}
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-night-500 uppercase tracking-widest px-1 mb-2">
              Learning Paths
            </h2>
            
            {/* Beginner Path - Open by Default */}
            <PathSection
              path="beginner"
              title="Beginner"
              subtitle="Arabic foundations & first surahs"
              icon={<BeginnerIcon />}
              lessons={ALL_BEGINNER_LESSONS}
              units={BEGINNER_UNITS}
              completedLessons={completedLessons}
              isDefaultOpen={true}
              nextLessonId={nextLesson?.id}
            />
            
            {/* Intermediate Path - Collapsed */}
            <PathSection
              path="intermediate"
              title="Intermediate"
              subtitle="Tajweed rules & longer surahs"
              icon={<IntermediateIcon />}
              lessons={ALL_INTERMEDIATE_LESSONS}
              units={INTERMEDIATE_UNITS}
              completedLessons={completedLessons}
              isDefaultOpen={false}
              nextLessonId={nextLesson?.id}
            />
            
            {/* Advanced Path - Collapsed */}
            <PathSection
              path="advanced"
              title="Advanced"
              subtitle="Deep tajweed & full juz memorization"
              icon={<AdvancedIcon />}
              lessons={ALL_ADVANCED_LESSONS}
              units={ADVANCED_UNITS}
              completedLessons={completedLessons}
              isDefaultOpen={false}
              nextLessonId={nextLesson?.id}
            />
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
    </>
  );
}

// Export with Suspense wrapper for useSearchParams
export default function LessonsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-night-950" />}>
      <LessonsContent />
    </Suspense>
  );
}
