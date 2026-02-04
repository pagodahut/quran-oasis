'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  X,
  Play,
  Pause,
  RotateCcw,
  Repeat,
  CheckCircle2,
  Circle,
  Star,
  Trophy,
  BookOpen,
  Volume2,
  VolumeX,
  Lightbulb,
  Eye,
  EyeOff,
  Headphones,
  Brain,
  SkipBack,
  SkipForward,
  RefreshCw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Moon,
  Heart,
  ChevronDown,
  Info,
} from 'lucide-react';
import { getLessonById, type Lesson, type LessonStep } from '@/lib/lesson-content';
import { getAudioUrl, getSurah, RECITERS, type Ayah } from '@/lib/quranData';
import { 
  playLetter,
  playWord, 
  playPhrase, 
  playArabic,
  stopAllAudio as stopAudio, 
  getLetterInfo,
  checkAudioProviders,
} from '@/lib/audioService';
import { 
  BismillahHeader, 
  DuaCard, 
  MemoryTrick, 
  Callout,
  PracticePrompt,
  ContentBlock,
} from '@/components/LessonContentRenderer';
import MemorizationPractice from '@/components/MemorizationPractice';
import { playAyah, stopPlayback } from '@/lib/quranAudioService';
import { CelebrationOverlay, useCelebration } from '@/components/Celebrations';
import { 
  updateStreak, 
  updateDailyProgress, 
  triggerCelebration,
  checkAndUnlockAchievements,
  getQuranProgress,
} from '@/lib/motivationStore';

// ============================================
// Audio Speaker Button Component
// ============================================
function AudioButton({ 
  text, 
  type = 'auto',
  size = 'md',
  className = '',
  autoPlay = false,
  showLabel = false,
  variant = 'default',
}: { 
  text: string;
  type?: 'letter' | 'word' | 'phrase' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  autoPlay?: boolean;
  showLabel?: boolean;
  variant?: 'default' | 'minimal';
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVoice, setHasVoice] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);
  
  useEffect(() => {
    checkAudioProviders().then(providers => {
      setHasVoice(providers.elevenlabs || providers.recorded || providers.webspeech);
    });
  }, []);
  
  // Auto-play on mount if requested (only once)
  useEffect(() => {
    if (autoPlay && hasVoice && !hasPlayed) {
      const timer = setTimeout(() => {
        handlePlay();
        setHasPlayed(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, hasVoice, hasPlayed, text]);
  
  // Reset hasPlayed when text changes
  useEffect(() => {
    setHasPlayed(false);
  }, [text]);
  
  const handlePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
      return;
    }
    
    // Determine type based on content if auto
    let actualType = type;
    if (type === 'auto') {
      const charCount = text.replace(/[\u064B-\u0652]/g, '').length; // Remove tashkeel for count
      if (charCount <= 2) actualType = 'letter';
      else if (charCount <= 10) actualType = 'word';
      else actualType = 'phrase';
    }
    
    const playFn = actualType === 'letter' ? playLetter : actualType === 'word' ? playWord : playPhrase;
    
    // New async audio service
    setIsPlaying(true);
    playFn(text, {
      onStart: () => {},
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    }).then((success) => {
      if (!success) setIsPlaying(false);
    });
  };
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };
  
  if (!hasVoice) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-night-800/50 flex items-center justify-center text-night-600 ${className}`}>
        <VolumeX className="w-4 h-4" />
      </div>
    );
  }
  
  // Minimal variant - simple text button
  if (variant === 'minimal') {
    return (
      <motion.button
        onClick={handlePlay}
        whileTap={{ scale: 0.95 }}
        className={`
          flex items-center gap-1.5 text-night-500 hover:text-gold-400 transition-colors text-sm
          ${isPlaying ? 'text-gold-400' : ''}
          ${className}
        `}
        title={isPlaying ? 'Stop' : 'Play sound'}
      >
        {isPlaying ? (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.6 }}
          >
            <Volume2 className="w-4 h-4" />
          </motion.div>
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
        <span className="text-xs font-medium tracking-wide uppercase">
          {isPlaying ? 'Playing...' : 'Listen'}
        </span>
      </motion.button>
    );
  }
  
  return (
    <motion.button
      onClick={handlePlay}
      whileTap={{ scale: 0.9 }}
      className={`
        ${sizeClasses[size]} rounded-full 
        ${isPlaying 
          ? 'bg-gold-500 text-night-950 shadow-glow-gold' 
          : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
        }
        flex items-center justify-center gap-2 transition-all
        ${className}
      `}
      title={isPlaying ? 'Stop' : 'Play sound'}
    >
      {isPlaying ? (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        >
          <Volume2 className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
        </motion.div>
      ) : (
        <Volume2 className={size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
      )}
      {showLabel && <span className="text-sm font-medium">Listen</span>}
    </motion.button>
  );
}

// ============================================
// Arabic Content Display Component
// ============================================
function ArabicDisplay({ 
  content, 
  autoPlayAudio = true,
  showAudioButton = true,
}: { 
  content: string;
  autoPlayAudio?: boolean;
  showAudioButton?: boolean;
}) {
  // Determine if this is a single letter, word, or phrase
  const cleanContent = content.replace(/[\u064B-\u0652]/g, ''); // Remove tashkeel for count
  const charCount = cleanContent.length;
  const isSingleLetter = charCount <= 2;
  const isWord = charCount <= 10 && !content.includes(' ');
  
  // Get letter data if it's a single letter
  const letterData = isSingleLetter ? getLetterInfo(cleanContent) : null;
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative bg-gradient-to-br from-night-800/80 to-night-900 rounded-3xl border border-night-700/50 mb-6 overflow-hidden"
    >
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201, 162, 39, 0.5) 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }} />
      </div>
      
      <div className="relative p-8 flex flex-col items-center justify-center min-h-[160px]">
        {/* Main Arabic text */}
        <div 
          className={`
            font-arabic text-center leading-relaxed
            ${isSingleLetter 
              ? 'text-8xl sm:text-9xl text-gold-400 drop-shadow-[0_0_20px_rgba(201,162,39,0.3)]' 
              : isWord 
                ? 'text-5xl sm:text-6xl text-gold-300' 
                : 'text-3xl sm:text-4xl text-night-100'
            }
          `}
          style={{ direction: 'rtl' }}
        >
          {content}
        </div>
        
        {/* Letter name and phonetic for single letters */}
        {letterData && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center gap-3 text-night-400"
          >
            <span className="text-lg font-medium text-gold-500/80">{letterData.name}</span>
            <span className="text-night-600">•</span>
            <span className="text-base italic">/{letterData.phonetic}/</span>
          </motion.div>
        )}
        
        {/* Audio button - Simple text link style */}
        {showAudioButton && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4"
          >
            <AudioButton 
              text={content} 
              autoPlay={autoPlayAudio}
              size="sm"
              showLabel={false}
              variant="minimal"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// ============================================
// No Voice Warning Component
// ============================================
function NoVoiceWarning() {
  const [hasVoice, setHasVoice] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    checkAudioProviders().then(providers => {
      setHasVoice(providers.elevenlabs || providers.recorded || providers.webspeech);
    });
  }, []);
  
  if (hasVoice || dismissed) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 mb-4 p-3 bg-amber-900/30 border border-amber-700/50 rounded-xl flex items-start gap-3"
    >
      <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-amber-200 text-sm font-medium">Arabic audio not available</p>
        <p className="text-amber-300/70 text-xs mt-1">
          Your device doesn't have an Arabic voice installed. Audio features will be limited.
        </p>
      </div>
      <button 
        onClick={() => setDismissed(true)}
        className="text-amber-400/70 hover:text-amber-400"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

// ============================================
// Celebration Animation
// ============================================
function CelebrationBurst({ show }: { show: boolean }) {
  if (!show) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-gold-400 rounded-full"
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos(i * 30 * Math.PI / 180) * 100,
            y: Math.sin(i * 30 * Math.PI / 180) * 100,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 1] }}
        transition={{ duration: 0.4 }}
      >
        <Sparkles className="w-16 h-16 text-gold-400" />
      </motion.div>
    </motion.div>
  );
}

// ============================================
// XP Animation - Enhanced
// ============================================
function XPGain({ amount, show }: { amount: number; show: boolean }) {
  if (!show) return null;
  
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Radial burst of particles */}
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: i % 2 === 0 ? '#C9A227' : '#F5E6A3',
            boxShadow: '0 0 10px rgba(201, 162, 39, 0.8)',
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            x: Math.cos((i * 22.5) * Math.PI / 180) * 150,
            y: Math.sin((i * 22.5) * Math.PI / 180) * 150,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
      
      {/* Rising sparkles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          initial={{ 
            y: 50, 
            x: (i - 4) * 30, 
            opacity: 0, 
            scale: 0 
          }}
          animate={{
            y: [-50, -200],
            opacity: [0, 1, 0],
            scale: [0, 1.2, 0.5],
            rotate: [0, 180],
          }}
          transition={{ 
            duration: 1.2, 
            delay: i * 0.08,
            ease: 'easeOut' 
          }}
        >
          <Sparkles className="w-6 h-6 text-gold-400" />
        </motion.div>
      ))}
      
      {/* Main XP badge with dramatic entrance */}
      <motion.div
        className="relative"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: [0, 1.4, 1],
          rotate: [-180, 10, 0],
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.34, 1.56, 0.64, 1],
        }}
      >
        {/* Glow ring */}
        <motion.div
          className="absolute inset-0 -m-4 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.4) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 2, 2.5],
            opacity: [0.8, 0.4, 0],
          }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
        
        {/* Badge */}
        <motion.div 
          className="relative flex items-center gap-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-night-950 px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl"
          style={{
            boxShadow: '0 0 40px rgba(201, 162, 39, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4)',
          }}
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.4,
            delay: 0.5,
            ease: 'easeOut',
          }}
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Star className="w-8 h-8 fill-current" />
          </motion.div>
          <span className="text-3xl font-black">+{amount}</span>
          <span className="text-xl font-semibold">XP</span>
        </motion.div>
      </motion.div>
      
      {/* Floating +XP numbers */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`float-${i}`}
          className="absolute text-gold-400 font-bold text-lg"
          initial={{ 
            opacity: 0, 
            y: 0,
            x: (i - 2) * 60,
          }}
          animate={{
            opacity: [0, 1, 0],
            y: -120,
          }}
          transition={{ 
            duration: 1.5, 
            delay: 0.2 + i * 0.1,
            ease: 'easeOut',
          }}
        >
          +{Math.floor(amount / 5)}
        </motion.div>
      ))}
    </motion.div>
  );
}

// ============================================
// Main Lesson Page Component
// ============================================
export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.id as string;
  
  // Core state
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  
  // Exercise state
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  // Memorization module state
  const [showMemorizationModule, setShowMemorizationModule] = useState(false);
  
  // UI state
  const [showCelebration, setShowCelebration] = useState(false);
  const [showXP, setShowXP] = useState(false);
  
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingReciter, setIsPlayingReciter] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Celebration hook
  const { currentEvent, closeCelebration } = useCelebration();

  // Load lesson data
  useEffect(() => {
    const foundLesson = getLessonById(lessonId);
    setLesson(foundLesson || null);
  }, [lessonId]);

  const currentStep = lesson?.steps[currentStepIndex];
  const progress = lesson ? ((currentStepIndex + 1) / lesson.steps.length) * 100 : 0;
  const isLastStep = lesson ? currentStepIndex === lesson.steps.length - 1 : false;

  // Navigation
  const goToNextStep = () => {
    if (!lesson) return;
    
    // Mark current step complete
    if (currentStep) {
      setCompletedSteps(prev => new Set([...prev, currentStep.id]));
    }
    
    // Stop any playing audio
    stopAudio();
    
    if (isLastStep) {
      completeLesson();
    } else {
      setCurrentStepIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
      // Scroll to top of content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      stopAudio();
      setCurrentStepIndex(prev => prev - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      // Scroll to top of content
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Exercise handlers
  const handleAnswerSelect = (index: number) => {
    if (showFeedback) return;
    setSelectedAnswer(index);
  };

  const checkAnswer = () => {
    if (selectedAnswer === null || !currentStep?.exercise) return;
    
    const correct = selectedAnswer === currentStep.exercise.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 800);
    }
  };

  const completeLesson = () => {
    // Show XP animation
    setShowXP(true);
    setTimeout(() => setShowXP(false), 2000);
    
    // Save completion
    const saved = localStorage.getItem('quranOasis_completedLessons');
    const completed = saved ? JSON.parse(saved) : [];
    if (!completed.includes(lessonId)) {
      completed.push(lessonId);
      localStorage.setItem('quranOasis_completedLessons', JSON.stringify(completed));
    }
    
    // Update streak and daily progress
    const streakResult = updateStreak();
    const goalResult = updateDailyProgress(5); // 5 minutes per lesson completion
    
    // Check for new achievements
    const quranProgress = getQuranProgress();
    const newAchievements = checkAndUnlockAchievements(
      quranProgress.versesMemorized,
      [], // completedSurahs - would need to track this
      []  // completedJuz - would need to track this
    );
    
    // Trigger celebration based on results
    if (streakResult.newMilestone) {
      setTimeout(() => {
        triggerCelebration({ type: 'streak_milestone', days: streakResult.newMilestone! });
      }, 2500);
    } else if (goalResult.goalMet) {
      setTimeout(() => {
        triggerCelebration({ type: 'daily_goal_met' });
      }, 2500);
    }
    
    // Navigate after animation
    setTimeout(() => {
      router.push('/lessons?completed=' + lessonId);
    }, streakResult.newMilestone || goalResult.goalMet ? 5000 : 1500);
  };

  // Render step content with proper formatting and smart detection
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const result: React.ReactNode[] = [];
    let i = 0;
    
    // Helper to render inline text with bold and Arabic
    const renderInline = (text: string, key: number) => {
      if (!text.includes('**')) return text;
      
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, j) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const innerText = part.replace(/\*\*/g, '');
          const isArabic = /[\u0600-\u06FF]/.test(innerText);
          return (
            <strong 
              key={`${key}-${j}`} 
              className={`font-semibold ${isArabic ? 'font-arabic text-gold-300 text-2xl' : 'text-gold-400'}`}
              style={isArabic ? { direction: 'rtl', display: 'inline-block' } : undefined}
            >
              {innerText}
            </strong>
          );
        }
        return part;
      });
    };
    
    while (i < lines.length) {
      const line = lines[i];
      
      // Memory Trick blocks - detect and style specially
      if (line.toLowerCase().includes('memory trick:') || line.toLowerCase().startsWith('**memory trick')) {
        const trickContent = line.replace(/\*\*memory trick:?\*\*:?/i, '').replace(/memory trick:?/i, '').trim();
        result.push(
          <div key={i} className="my-4 bg-gradient-to-r from-gold-900/20 via-gold-900/10 to-transparent border border-gold-500/20 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-gold-400" />
              </div>
              <div>
                <h5 className="font-semibold text-gold-400 mb-1">🧠 Memory Trick</h5>
                <p className="text-night-300 text-sm leading-relaxed">{trickContent || lines[++i]}</p>
              </div>
            </div>
          </div>
        );
        i++;
        continue;
      }
      
      // Practice/Try blocks
      if (line.toLowerCase().includes('practice:') || line.toLowerCase().startsWith('**practice')) {
        const practiceContent = line.replace(/\*\*practice:?\*\*:?/i, '').replace(/practice:?/i, '').trim();
        result.push(
          <div key={i} className="my-4 bg-sage-900/20 border border-sage-700/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sage-700/30 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-4 h-4 text-sage-400" />
              </div>
              <div>
                <h5 className="font-semibold text-sage-400 mb-1">🎯 Practice</h5>
                <p className="text-night-300 text-sm leading-relaxed">{practiceContent || lines[++i]}</p>
              </div>
            </div>
          </div>
        );
        i++;
        continue;
      }
      
      // Tip blocks  
      if (line.toLowerCase().includes('tip:') || line.toLowerCase().startsWith('**tip')) {
        const tipContent = line.replace(/\*\*tip:?\*\*:?/i, '').replace(/tip:?/i, '').trim();
        result.push(
          <div key={i} className="my-4 bg-sage-900/20 border border-sage-700/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-sage-700/30 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-4 h-4 text-sage-400" />
              </div>
              <div>
                <h5 className="font-semibold text-sage-400 mb-1">💡 Tip</h5>
                <p className="text-night-300 text-sm leading-relaxed">{tipContent || lines[++i]}</p>
              </div>
            </div>
          </div>
        );
        i++;
        continue;
      }
      
      // Important/Note blocks
      if (line.toLowerCase().startsWith('**important') || line.toLowerCase().startsWith('**note')) {
        const noteContent = line.replace(/\*\*(important|note):?\*\*:?/i, '').trim();
        result.push(
          <div key={i} className="my-4 bg-amber-900/20 border-l-4 border-amber-500/50 rounded-r-xl p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-200 text-sm leading-relaxed">{renderInline(noteContent, i)}</p>
              </div>
            </div>
          </div>
        );
        i++;
        continue;
      }
      
      // Headers (bold line that stands alone)
      if (line.startsWith('**') && line.endsWith('**') && !line.slice(2, -2).includes('**')) {
        result.push(
          <h3 key={i} className="text-lg font-bold text-gold-400 mt-5 mb-3">
            {line.replace(/\*\*/g, '')}
          </h3>
        );
        i++;
        continue;
      }
      
      // Bullet points
      if (line.startsWith('- ')) {
        // Collect consecutive bullet points
        const bullets: string[] = [];
        while (i < lines.length && lines[i].startsWith('- ')) {
          bullets.push(lines[i].substring(2));
          i++;
        }
        result.push(
          <ul key={`ul-${i}`} className="my-3 space-y-2.5 pl-5">
            {bullets.map((bullet, bi) => {
              const isArabic = /[\u0600-\u06FF]/.test(bullet);
              return (
                <li key={bi} className="text-night-300 list-disc marker:text-gold-500/60 pl-1">
                  <span className={isArabic ? 'text-night-200' : ''}>
                    {renderInline(bullet, bi)}
                  </span>
                </li>
              );
            })}
          </ul>
        );
        continue;
      }
      
      // Numbered lists (e.g., "1. ")
      if (/^\d+\.\s/.test(line)) {
        // Collect consecutive numbered items
        const items: string[] = [];
        while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
          items.push(lines[i].replace(/^\d+\.\s*/, ''));
          i++;
        }
        result.push(
          <div key={`ol-${i}`} className="my-3 space-y-2">
            {items.map((item, ni) => (
              <div key={ni} className="flex items-start gap-3 text-night-300">
                <span className="w-6 h-6 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 text-sm font-medium flex-shrink-0">
                  {ni + 1}
                </span>
                <span className="pt-0.5">{renderInline(item, ni)}</span>
              </div>
            ))}
          </div>
        );
        continue;
      }
      
      // Empty lines - visual break
      if (line.trim() === '') {
        result.push(<div key={i} className="h-2" />);
        i++;
        continue;
      }
      
      // Regular paragraphs with inline formatting
      result.push(
        <p key={i} className="text-night-200 mb-3 leading-relaxed">
          {renderInline(line, i)}
        </p>
      );
      i++;
    }
    
    return result;
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-night-400">Loading lesson...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      <audio ref={audioRef} />
      
      {/* Celebration effects */}
      <AnimatePresence>
        {showCelebration && <CelebrationBurst key="celebration" show={showCelebration} />}
        {showXP && <XPGain key="xp-gain" amount={lesson.xpReward} show={showXP} />}
      </AnimatePresence>
      
      {/* Celebration Overlay for achievements, streaks, etc. */}
      <CelebrationOverlay
        event={currentEvent}
        onClose={closeCelebration}
        autoClose={true}
        autoCloseDelay={5000}
      />
      
      {/* Memorization Module Modal */}
      <AnimatePresence>
        {showMemorizationModule && currentStep?.audioSegment && (
          <MemorizationPractice
            surah={currentStep.audioSegment.surah}
            ayah={currentStep.audioSegment.ayahStart}
            arabicText={currentStep.arabicContent || ''}
            reciterId="alafasy"
            onComplete={() => {
              setShowCelebration(true);
              setTimeout(() => setShowCelebration(false), 800);
            }}
            onClose={() => setShowMemorizationModule(false)}
          />
        )}
      </AnimatePresence>

      {/* Header - Premium Frosted Glass */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass mx-2 mt-2 rounded-2xl">
        <div className="flex items-center justify-between px-3 py-3">
          <button 
            onClick={() => router.push('/lessons')} 
            className="liquid-icon-btn"
            aria-label="Close lesson"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex-1 mx-4">
            <div 
              className="h-2.5 rounded-full overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, rgba(201,162,39,0.85) 0%, rgba(201,162,39,1) 50%, rgba(220,180,50,1) 100%)',
                  boxShadow: '0 0 12px rgba(201,162,39,0.4)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
          
          <span className="text-sm text-night-400 min-w-[3rem] text-right font-medium">
            {currentStepIndex + 1}/{lesson.steps.length}
          </span>
        </div>
        
        {/* Lesson info */}
        <div className="px-4 pb-3 pt-0.5">
          <p className="text-xs text-gold-500/80 font-medium">Unit {lesson.unit}: {lesson.unitTitle}</p>
          <h1 className="font-semibold text-night-100">{lesson.title}</h1>
        </div>
      </header>
      
      {/* Voice warning */}
      <NoVoiceWarning />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-6"
          >
            {/* Bismillah - Show at the start of the lesson */}
            {currentStepIndex === 0 && (
              <BismillahHeader />
            )}
            
            {/* Step Title */}
            {currentStep && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  {currentStep.type === 'instruction' && <Lightbulb className="w-5 h-5 text-gold-400" />}
                  {currentStep.type === 'explanation' && <BookOpen className="w-5 h-5 text-sage-400" />}
                  {currentStep.type === 'exercise' && <Brain className="w-5 h-5 text-purple-400" />}
                  {currentStep.type === 'practice' && <Headphones className="w-5 h-5 text-blue-400" />}
                  <span className="text-xs uppercase tracking-wider text-night-500 font-medium">
                    {currentStep.type}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-night-100 mb-4">
                  {currentStep.title}
                </h2>

                {/* Arabic Content Display - now with proper styling and audio */}
                {currentStep.arabicContent && (
                  <ArabicDisplay 
                    content={currentStep.arabicContent}
                    autoPlayAudio={currentStep.type === 'explanation'}
                    showAudioButton={true}
                  />
                )}

                {/* Main Content - check for memorization module */}
                {currentStep.content === 'MEMORIZATION_MODULE' && currentStep.audioSegment ? (
                  <div className="space-y-6">
                    <div className="bg-gold-900/20 rounded-2xl p-6 border border-gold-500/20 text-center">
                      <h3 className="text-xl font-semibold text-gold-400 mb-2">
                        🎯 Memorization Practice
                      </h3>
                      <p className="text-night-300 mb-4">
                        Use the 10-3 method to memorize this verse
                      </p>
                      <button
                        onClick={() => setShowMemorizationModule(true)}
                        className="liquid-btn py-3 px-8 text-lg"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        Start Practice
                      </button>
                    </div>
                    
                    {/* Show Arabic text as preview */}
                    {currentStep.arabicContent && (
                      <div className="bg-night-900/50 rounded-xl p-6">
                        <p 
                          className="font-arabic text-3xl text-gold-300 leading-[2] text-center"
                          style={{ direction: 'rtl' }}
                        >
                          {currentStep.arabicContent}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="prose prose-invert max-w-none">
                    {renderContent(currentStep.content)}
                  </div>
                )}
                
                {/* Reciter Audio Button - for audio steps (supports both audioSegment and audioConfig) */}
                {(currentStep.audioSegment || currentStep.audioConfig) && currentStep.content !== 'MEMORIZATION_MODULE' && (
                  <div className="mt-6 p-4 bg-night-900/50 rounded-xl border border-night-800/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Volume2 className="w-5 h-5 text-gold-400" />
                        <div>
                          <p className="text-sm font-medium text-night-200">Listen to Reciter</p>
                          <p className="text-xs text-night-500">Mishary Rashid Alafasy</p>
                        </div>
                      </div>
                      <button
                        onClick={async () => {
                          if (isPlayingReciter) {
                            stopPlayback();
                            setIsPlayingReciter(false);
                          } else {
                            setIsPlayingReciter(true);
                            try {
                              // Support both audioSegment and audioConfig
                              const audioData = currentStep.audioSegment || currentStep.audioConfig;
                              if (audioData) {
                                await playAyah(
                                  audioData.surah,
                                  audioData.ayahStart ?? 1,
                                  {
                                    reciterId: ('reciterId' in audioData && audioData.reciterId) || 'alafasy',
                                    onEnd: () => setIsPlayingReciter(false),
                                    onError: () => setIsPlayingReciter(false),
                                  }
                                );
                              }
                            } catch {
                              setIsPlayingReciter(false);
                            }
                          }
                        }}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                          isPlayingReciter 
                            ? 'bg-gold-500 text-night-950' 
                            : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                        }`}
                      >
                        {isPlayingReciter ? (
                          <Pause className="w-5 h-5" />
                        ) : (
                          <Play className="w-5 h-5 ml-0.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Exercise Section */}
                {currentStep.exercise && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 bg-night-900/70 rounded-2xl p-6 border border-night-800/80"
                  >
                    <h3 className="text-lg font-semibold text-night-100 mb-5">
                      {currentStep.exercise.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {currentStep.exercise.options?.map((option, index) => {
                        const isArabicOption = /[\u0600-\u06FF]/.test(option);
                        // Extract only Arabic characters for audio playback
                        const arabicOnly = option.match(/[\u0600-\u06FF\u064B-\u0652]+/g)?.join('') || '';
                        return (
                          <motion.button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showFeedback}
                            whileHover={!showFeedback ? { scale: 1.01 } : {}}
                            whileTap={!showFeedback ? { scale: 0.99 } : {}}
                            className={`w-full p-4 rounded-xl text-left transition-all ${
                              showFeedback
                                ? index === currentStep.exercise!.correctAnswer
                                  ? 'bg-green-900/50 border-2 border-green-500 text-green-100'
                                  : selectedAnswer === index
                                    ? 'bg-red-900/50 border-2 border-red-500 text-red-100'
                                    : 'bg-night-800/50 border border-night-700 text-night-400'
                                : selectedAnswer === index
                                  ? 'bg-gold-900/30 border-2 border-gold-500 text-gold-100 shadow-glow-gold'
                                  : 'bg-night-800/50 border border-night-700 text-night-200 hover:bg-night-800 hover:border-night-600'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                                showFeedback
                                  ? index === currentStep.exercise!.correctAnswer
                                    ? 'bg-green-500 text-white'
                                    : selectedAnswer === index
                                      ? 'bg-red-500 text-white'
                                      : 'bg-night-700 text-night-400'
                                  : selectedAnswer === index
                                    ? 'bg-gold-500 text-night-950'
                                    : 'bg-night-700 text-night-300'
                              }`}>
                                {showFeedback && index === currentStep.exercise!.correctAnswer ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  String.fromCharCode(65 + index)
                                )}
                              </span>
                              <span 
                                className={`text-lg ${isArabicOption ? 'font-arabic text-2xl' : ''}`}
                                style={isArabicOption ? { direction: 'rtl' } : undefined}
                              >
                                {option}
                              </span>
                              {/* Audio button - only plays Arabic characters, not Latin transliteration */}
                              {isArabicOption && arabicOnly && !showFeedback && (
                                <div className="ml-auto">
                                  <AudioButton text={arabicOnly} size="sm" />
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Check Answer Button */}
                    {selectedAnswer !== null && !showFeedback && (
                      <motion.button
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={checkAnswer}
                        className="w-full mt-5 py-3.5 bg-gold-500 hover:bg-gold-400 text-night-950 font-semibold rounded-xl transition-colors shadow-glow-gold"
                      >
                        Check Answer
                      </motion.button>
                    )}

                    {/* Feedback */}
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-5 p-4 rounded-xl ${
                          isCorrect 
                            ? 'bg-green-900/30 border border-green-700' 
                            : 'bg-red-900/30 border border-red-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                              <span className="font-semibold text-green-400">Correct! Mashallah! 🌟</span>
                            </>
                          ) : (
                            <>
                              <X className="w-5 h-5 text-red-400" />
                              <span className="font-semibold text-red-400">Not quite - keep trying!</span>
                            </>
                          )}
                        </div>
                        {currentStep.exercise!.explanation && (
                          <p className="text-night-300 text-sm leading-relaxed">
                            {currentStep.exercise!.explanation}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Smooth Floating Glass Controls */}
      <footer 
        className="sticky bottom-0 z-40 safe-area-bottom mx-2 mb-2 rounded-2xl liquid-glass-strong"
      >
        <div className="flex items-center justify-between px-4 py-4">
          {/* Previous Button */}
          <button
            onClick={goToPreviousStep}
            disabled={currentStepIndex === 0}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all min-h-[44px] ${
              currentStepIndex === 0
                ? 'text-night-600 cursor-not-allowed'
                : 'text-night-300 hover:bg-white/5 active:bg-white/10'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Previous</span>
          </button>

          {/* Step indicators */}
          <div className="flex gap-1.5">
            {lesson.steps.slice(
              Math.max(0, currentStepIndex - 2),
              Math.min(lesson.steps.length, currentStepIndex + 3)
            ).map((step, i) => {
              const actualIndex = Math.max(0, currentStepIndex - 2) + i;
              return (
                <motion.div
                  key={step.id}
                  layout
                  className="h-2 rounded-full"
                  style={{
                    width: actualIndex === currentStepIndex ? 24 : 8,
                    background: actualIndex === currentStepIndex
                      ? 'linear-gradient(90deg, rgba(201,162,39,1) 0%, rgba(220,180,50,1) 100%)'
                      : actualIndex < currentStepIndex
                        ? 'rgba(134,169,113,0.8)'
                        : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.25s ease',
                  }}
                />
              );
            })}
          </div>

          {/* Next Button */}
          <motion.button
            onClick={goToNextStep}
            disabled={currentStep?.exercise && !showFeedback}
            whileTap={!(currentStep?.exercise && !showFeedback) ? { scale: 0.97 } : {}}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium min-h-[44px] ${
              currentStep?.exercise && !showFeedback
                ? 'cursor-not-allowed'
                : ''
            }`}
            style={{
              background: currentStep?.exercise && !showFeedback
                ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                : isLastStep
                  ? 'linear-gradient(135deg, rgba(134,169,113,0.95) 0%, rgba(100,140,90,1) 100%)'
                  : 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
              color: currentStep?.exercise && !showFeedback
                ? '#6b7280'
                : isLastStep
                  ? 'white'
                  : '#0a0a0f',
              boxShadow: currentStep?.exercise && !showFeedback
                ? 'none'
                : isLastStep
                  ? '0 4px 16px rgba(134,169,113,0.3)'
                  : '0 4px 16px rgba(201,162,39,0.35)',
              border: '1px solid rgba(255,255,255,0.15)',
              transition: 'all 0.2s ease',
            }}
          >
            <span>{isLastStep ? 'Complete' : 'Continue'}</span>
            {isLastStep ? (
              <Trophy className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </footer>
    </div>
  );
}
