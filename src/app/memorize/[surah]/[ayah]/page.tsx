'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Eye,
  EyeOff,
  Volume2,
  Headphones,
  Brain,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  Star,
  Repeat,
  ChevronRight,
  Layers,
  BookOpen,
  Grid3X3,
} from 'lucide-react';
import WordByWordInline from '@/components/WordByWordInline';
import { getSurah, getAudioUrl, RECITERS, cleanAyahText, type Ayah } from '@/lib/quranData';
import { 
  startMemorizingVerse, 
  markVerseMemorized, 
  completeVerseSession,
  getProgress,
  saveProgress,
} from '@/lib/progressStore';
import { useReadingPreferences } from '@/hooks/useAppliedPreferences';

// ============ PHASE TYPES ============

type MemorizationPhase = 
  | 'intro'      // Show verse, translation, context
  | 'listen'     // Listen 3-5 times
  | 'read'       // Read along with audio
  | 'memorize'   // 10 repetitions while looking
  | 'recall'     // 3 repetitions from memory (hidden)
  | 'stack'      // Recite all previous verses
  | 'complete';  // Celebration & next steps

interface PhaseInfo {
  phase: MemorizationPhase;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const PHASES: PhaseInfo[] = [
  { phase: 'intro', title: 'Introduction', description: 'Familiarize yourself with the verse', icon: <BookOpen className="w-5 h-5" /> },
  { phase: 'listen', title: 'Listen', description: 'Hear the verse multiple times', icon: <Headphones className="w-5 h-5" /> },
  { phase: 'read', title: 'Read Along', description: 'Follow along with the recitation', icon: <Volume2 className="w-5 h-5" /> },
  { phase: 'memorize', title: 'Memorize', description: 'Read 10 times while looking', icon: <Eye className="w-5 h-5" /> },
  { phase: 'recall', title: 'Recall', description: 'Recite 3 times from memory', icon: <Brain className="w-5 h-5" /> },
  { phase: 'stack', title: 'Stack', description: 'Recite with previous verses', icon: <Layers className="w-5 h-5" /> },
  { phase: 'complete', title: 'Complete', description: 'Verse memorized!', icon: <Trophy className="w-5 h-5" /> },
];

// ============ AUDIO HOOK ============

function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.addEventListener('loadstart', () => setIsLoading(true));
    audio.addEventListener('canplay', () => setIsLoading(false));
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });
    audio.addEventListener('timeupdate', () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    });
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [src]);

  const play = useCallback(() => audioRef.current?.play(), []);
  const pause = useCallback(() => audioRef.current?.pause(), []);
  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, play, pause]);
  const reset = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  return { isPlaying, isLoading, progress, duration, play, pause, toggle, reset, audioRef };
}

// ============ CELEBRATION COMPONENT ============

function Celebration({ xp }: { xp: number }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Particle burst */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: i % 2 === 0 ? '#C9A227' : '#4E7A51',
          }}
          initial={{ scale: 0, x: 0, y: 0 }}
          animate={{
            scale: [0, 1.5, 0],
            x: Math.cos((i * 18) * Math.PI / 180) * 150,
            y: Math.sin((i * 18) * Math.PI / 180) * 150,
          }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}
      
      {/* XP Badge */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [0, 1.3, 1], rotate: 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex items-center gap-3 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 text-night-950 px-8 py-4 rounded-2xl font-bold text-2xl shadow-2xl"
        style={{
          boxShadow: '0 0 40px rgba(201, 162, 39, 0.6)',
        }}
      >
        <Star className="w-8 h-8 fill-current" />
        <span className="text-3xl font-black">+{xp}</span>
        <span className="text-xl font-semibold">XP</span>
      </motion.div>
    </motion.div>
  );
}

// ============ VERSE DISPLAY COMPONENT ============

function VerseDisplay({ 
  verse,
  surahNumber,
  showText = true,
  highlight = false,
  size = 'large',
  wordByWord = false,
  isPlaying = false,
  currentTime,
}: { 
  verse: Ayah;
  surahNumber: number;
  showText?: boolean;
  highlight?: boolean;
  size?: 'small' | 'medium' | 'large';
  wordByWord?: boolean;
  isPlaying?: boolean;
  currentTime?: number;
}) {
  // Clean the verse text to remove Bismillah prefix (for audio sync)
  const displayText = cleanAyahText(verse.text.arabic, surahNumber, verse.numberInSurah);
  const sizeClasses = {
    small: 'text-2xl',
    medium: 'text-3xl md:text-4xl',
    large: 'text-4xl md:text-5xl',
  };

  return (
    <motion.div
      layout
      className={`relative p-8 rounded-3xl transition-all duration-300 ${
        highlight 
          ? 'bg-gradient-to-br from-gold-900/30 to-night-900 border-2 border-gold-500/50 shadow-glow-gold' 
          : 'bg-gradient-to-br from-night-800/80 to-night-900 border border-night-700/50'
      }`}
    >
      {/* Decorative pattern */}
      <div className="absolute inset-0 opacity-5 rounded-3xl overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201, 162, 39, 0.5) 1px, transparent 0)`,
          backgroundSize: '20px 20px',
        }} />
      </div>

      <AnimatePresence mode="wait">
        {showText ? (
          wordByWord ? (
            <motion.div
              key="word-by-word"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
            >
              <WordByWordInline
                surah={surahNumber}
                ayah={verse.numberInSurah}
                isPlaying={isPlaying}
                currentTime={currentTime}
                showTransliteration={true}
              />
            </motion.div>
          ) : (
            <motion.p
              key="visible"
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, filter: 'blur(10px)' }}
              className={`font-quran ${sizeClasses[size]} leading-loose text-center ${
                highlight ? 'text-gold-300' : 'text-night-100'
              }`}
              style={{ direction: 'rtl' }}
            >
              {displayText}
            </motion.p>
          )
        ) : (
          <motion.div
            key="hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <EyeOff className="w-16 h-16 text-night-600 mb-4" />
            <p className="text-night-500 text-lg">Recite from memory</p>
            <p className="text-night-600 text-sm mt-1">Tap to reveal if needed</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ============ REPETITION COUNTER ============

function RepetitionCounter({ 
  current, 
  total, 
  label,
}: { 
  current: number; 
  total: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <p className="text-night-500 text-sm mb-2">{label}</p>
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <motion.div
            key={i}
            initial={false}
            animate={{
              scale: i < current ? 1 : 0.8,
              opacity: i < current ? 1 : 0.3,
            }}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              i < current
                ? 'bg-gold-500 text-night-950'
                : 'bg-night-800 text-night-600'
            }`}
          >
            {i < current ? '✓' : i + 1}
          </motion.div>
        ))}
      </div>
      <p className="text-gold-400 font-bold text-xl mt-2">
        {current} / {total}
      </p>
    </div>
  );
}

// ============ AUDIO CONTROLS ============

function AudioControls({ 
  isPlaying, 
  isLoading,
  onToggle, 
  onReset,
  progress,
  repeatMode,
  onRepeatChange,
}: { 
  isPlaying: boolean;
  isLoading: boolean;
  onToggle: () => void;
  onReset: () => void;
  progress: number;
  repeatMode: number;
  onRepeatChange: (mode: number) => void;
}) {
  const repeatModes = [1, 3, 5, 10, -1]; // -1 = infinite
  
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress bar */}
      <div className="w-full max-w-xs h-1.5 bg-night-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gold-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <button
          onClick={onReset}
          className="p-3 rounded-full bg-night-800 hover:bg-night-700 text-night-400 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <button
          onClick={onToggle}
          disabled={isLoading}
          className={`p-5 rounded-full transition-all ${
            isPlaying
              ? 'bg-gold-500 text-night-950 shadow-glow-gold'
              : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
          }`}
        >
          {isLoading ? (
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </button>

        <button
          onClick={() => {
            const currentIndex = repeatModes.indexOf(repeatMode);
            const nextIndex = (currentIndex + 1) % repeatModes.length;
            onRepeatChange(repeatModes[nextIndex]);
          }}
          className={`p-3 rounded-full transition-colors flex items-center gap-1 ${
            repeatMode !== 1
              ? 'bg-gold-500/20 text-gold-400'
              : 'bg-night-800 text-night-400 hover:bg-night-700'
          }`}
        >
          <Repeat className="w-5 h-5" />
          <span className="text-xs font-bold">
            {repeatMode === -1 ? '∞' : `${repeatMode}x`}
          </span>
        </button>
      </div>
    </div>
  );
}

// ============ MAIN COMPONENT ============

export default function MemorizePage() {
  const params = useParams();
  const router = useRouter();
  
  // Get preferences
  const prefs = useReadingPreferences();
  
  const surahNum = parseInt(params.surah as string);
  const ayahNum = parseInt(params.ayah as string);
  
  // Core state
  const [phase, setPhase] = useState<MemorizationPhase>('intro');
  const [verse, setVerse] = useState<Ayah | null>(null);
  const [surahName, setSurahName] = useState('');
  const [previousVerses, setPreviousVerses] = useState<Ayah[]>([]);
  
  // Memorization state
  const [repetitions, setRepetitions] = useState(0);
  const [showText, setShowText] = useState(true);
  const [repeatMode, setRepeatMode] = useState(1);
  const [listenCount, setListenCount] = useState(0);
  
  // UI state
  const [showCelebration, setShowCelebration] = useState(false);
  const [wordByWordMode, setWordByWordMode] = useState(false);
  
  // Audio - use reciter from preferences
  const audioUrl = getAudioUrl(surahNum, ayahNum, prefs.reciter);
  const { isPlaying, isLoading, progress, play, pause, toggle, reset } = useAudio(audioUrl);
  
  const autoPlayRef = useRef(false);
  const repeatCountRef = useRef(0);

  // Load data
  useEffect(() => {
    const surah = getSurah(surahNum);
    if (surah) {
      const foundVerse = surah.ayahs.find(a => a.numberInSurah === ayahNum);
      if (foundVerse) {
        setVerse(foundVerse);
        setSurahName(surah.englishName);
        
        // Get previous verses for stacking (if not the first verse)
        if (ayahNum > 1) {
          const prevVerses = surah.ayahs
            .filter(a => a.numberInSurah < ayahNum)
            .slice(-3); // Last 3 verses for stacking
          setPreviousVerses(prevVerses);
        }
        
        // Start memorizing
        startMemorizingVerse(surahNum, ayahNum);
      }
    }
  }, [surahNum, ayahNum]);

  // Handle audio repeat for listen phase
  useEffect(() => {
    if (!isPlaying && autoPlayRef.current && phase === 'listen') {
      repeatCountRef.current += 1;
      setListenCount(repeatCountRef.current);
      
      if (repeatCountRef.current < 5) {
        // Auto-replay
        setTimeout(() => {
          reset();
          play();
        }, 500);
      } else {
        // Move to next phase
        autoPlayRef.current = false;
      }
    }
  }, [isPlaying, phase, play, reset]);

  const currentPhaseIndex = PHASES.findIndex(p => p.phase === phase);
  const phaseProgress = ((currentPhaseIndex + 1) / PHASES.length) * 100;

  const handleNextPhase = () => {
    const phases: MemorizationPhase[] = ['intro', 'listen', 'read', 'memorize', 'recall', 'stack', 'complete'];
    const currentIndex = phases.indexOf(phase);
    
    if (currentIndex < phases.length - 1) {
      const nextPhase = phases[currentIndex + 1];
      
      // Reset phase-specific state
      setRepetitions(0);
      setShowText(true);
      repeatCountRef.current = 0;
      
      // Special handling for skip-to-complete if no stacking needed
      if (nextPhase === 'stack' && previousVerses.length === 0) {
        setPhase('complete');
        handleComplete();
        return;
      }
      
      setPhase(nextPhase);
      
      // Auto-start audio for listen phase
      if (nextPhase === 'listen') {
        autoPlayRef.current = true;
        setTimeout(() => play(), 500);
      }
      
      // Hide text for recall phase
      if (nextPhase === 'recall') {
        setShowText(false);
      }
    }
  };

  const handleComplete = () => {
    setShowCelebration(true);
    markVerseMemorized(surahNum, ayahNum);
    
    setTimeout(() => {
      setShowCelebration(false);
    }, 2500);
  };

  const handleRepComplete = () => {
    const newReps = repetitions + 1;
    setRepetitions(newReps);
    
    if (phase === 'memorize' && newReps >= 10) {
      handleNextPhase();
    } else if (phase === 'recall' && newReps >= 3) {
      handleNextPhase();
    }
  };

  const goToNextVerse = () => {
    const surah = getSurah(surahNum);
    if (surah && ayahNum < surah.numberOfAyahs) {
      router.push(`/memorize/${surahNum}/${ayahNum + 1}`);
    } else {
      router.push('/practice');
    }
  };

  if (!verse) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      {/* Celebration */}
      <AnimatePresence>
        {showCelebration && <Celebration xp={25} />}
      </AnimatePresence>

      {/* Header */}
      <header className="glass sticky top-0 z-40 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-night-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-night-400" />
          </button>
          
          {/* Progress bar */}
          <div className="flex-1 mx-4">
            <div className="h-2.5 bg-night-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400"
                initial={{ width: 0 }}
                animate={{ width: `${phaseProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
          
          {/* Word-by-Word Toggle */}
          <button
            onClick={() => setWordByWordMode(!wordByWordMode)}
            className={`p-2 rounded-xl transition-colors mr-2 ${
              wordByWordMode 
                ? 'bg-gold-500/20 text-gold-400' 
                : 'hover:bg-night-800 text-night-400'
            }`}
            title={wordByWordMode ? 'Switch to full verse' : 'Word-by-word view'}
          >
            <Grid3X3 className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-night-400 font-medium">
            {currentPhaseIndex + 1}/{PHASES.length}
          </span>
        </div>
        
        {/* Verse info */}
        <div className="px-4 pb-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gold-500/80 font-medium">{surahName}</p>
            <h1 className="font-semibold text-night-100">Ayah {ayahNum}</h1>
          </div>
          <div className="flex items-center gap-2 text-night-500">
            {PHASES[currentPhaseIndex].icon}
            <span className="text-sm">{PHASES[currentPhaseIndex].title}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {/* INTRO PHASE */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-night-100 mb-2">
                  Ready to Memorize
                </h2>
                <p className="text-night-400">
                  Let's memorize this beautiful verse using the 10-3 method
                </p>
              </div>

              <VerseDisplay verse={verse} surahNumber={surahNum} size="large" highlight wordByWord={wordByWordMode} />

              {/* Translation */}
              <div className="bg-night-900/50 rounded-2xl p-6 border border-night-800">
                <p className="text-sm text-gold-500/80 mb-2 font-medium">Translation</p>
                <p className="text-night-300 leading-relaxed">
                  {verse.text.translations.sahih}
                </p>
              </div>

              {/* Method explanation */}
              <div className="bg-gradient-to-r from-purple-900/20 to-night-900 rounded-2xl p-6 border border-purple-700/30">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Brain className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-300 mb-1">The 10-3 Method</h3>
                    <p className="text-night-400 text-sm">
                      You'll listen, then read 10 times while looking, 
                      then recite 3 times from memory. This traditional technique 
                      has helped millions memorize the Quran.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LISTEN PHASE */}
          {phase === 'listen' && (
            <motion.div
              key="listen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-night-100 mb-2">
                  Listen Carefully
                </h2>
                <p className="text-night-400">
                  Focus on the pronunciation and rhythm ({listenCount}/5 plays)
                </p>
              </div>

              <VerseDisplay verse={verse} surahNumber={surahNum} size="large" highlight={isPlaying} wordByWord={wordByWordMode} isPlaying={isPlaying} />

              <AudioControls
                isPlaying={isPlaying}
                isLoading={isLoading}
                onToggle={toggle}
                onReset={reset}
                progress={progress}
                repeatMode={repeatMode}
                onRepeatChange={setRepeatMode}
              />

              {listenCount >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-sage-400 text-sm mb-2">
                    ✓ Great listening! Ready to continue?
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* READ PHASE */}
          {phase === 'read' && (
            <motion.div
              key="read"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-night-100 mb-2">
                  Read Along
                </h2>
                <p className="text-night-400">
                  Follow the text as you listen to the recitation
                </p>
              </div>

              <VerseDisplay verse={verse} surahNumber={surahNum} size="large" highlight={isPlaying} wordByWord={wordByWordMode} isPlaying={isPlaying} />

              <AudioControls
                isPlaying={isPlaying}
                isLoading={isLoading}
                onToggle={toggle}
                onReset={reset}
                progress={progress}
                repeatMode={repeatMode}
                onRepeatChange={setRepeatMode}
              />

              <div className="text-center text-night-500 text-sm">
                <p>Tip: Try to mouth the words as you listen</p>
              </div>
            </motion.div>
          )}

          {/* MEMORIZE PHASE (10 repetitions) */}
          {phase === 'memorize' && (
            <motion.div
              key="memorize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-night-100 mb-2">
                  Read & Memorize
                </h2>
                <p className="text-night-400">
                  Read the verse aloud 10 times while looking
                </p>
              </div>

              <VerseDisplay verse={verse} surahNumber={surahNum} size="large" wordByWord={wordByWordMode} />

              <RepetitionCounter 
                current={repetitions} 
                total={10} 
                label="Repetitions"
              />

              <div className="flex justify-center gap-4">
                <button
                  onClick={toggle}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-night-800 hover:bg-night-700 text-night-300 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  {isPlaying ? 'Pause' : 'Play Audio'}
                </button>
                
                <motion.button
                  onClick={handleRepComplete}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-night-950 font-semibold transition-colors shadow-glow-gold"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  I've Read It ({repetitions + 1}/10)
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* RECALL PHASE (3 from memory) */}
          {phase === 'recall' && (
            <motion.div
              key="recall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-night-100 mb-2">
                  Recite from Memory
                </h2>
                <p className="text-night-400">
                  Now recite 3 times without looking
                </p>
              </div>

              <div onClick={() => setShowText(!showText)} className="cursor-pointer">
                <VerseDisplay verse={verse} surahNumber={surahNum} showText={showText} size="large" />
              </div>

              {!showText && (
                <p className="text-center text-night-600 text-sm">
                  Tap the box above to reveal if needed
                </p>
              )}

              <RepetitionCounter 
                current={repetitions} 
                total={3} 
                label="From Memory"
              />

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowText(!showText)}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-night-800 hover:bg-night-700 text-night-300 transition-colors"
                >
                  {showText ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  {showText ? 'Hide' : 'Reveal'}
                </button>
                
                <motion.button
                  onClick={() => {
                    if (showText) {
                      // If they needed to peek, that's okay but encourage them to hide
                      setShowText(false);
                    }
                    handleRepComplete();
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-sage-600 hover:bg-sage-500 text-white font-semibold transition-colors shadow-glow-sage"
                >
                  <Brain className="w-5 h-5" />
                  I've Recited It ({repetitions + 1}/3)
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STACK PHASE */}
          {phase === 'stack' && previousVerses.length > 0 && (
            <motion.div
              key="stack"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-night-100 mb-2">
                  Stack & Connect
                </h2>
                <p className="text-night-400">
                  Recite all verses together to strengthen connections
                </p>
              </div>

              {/* Previous verses (smaller) */}
              {previousVerses.map((pv, i) => (
                <motion.div
                  key={pv.numberInSurah}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <VerseDisplay verse={pv} surahNumber={surahNum} size="small" />
                  <div className="flex justify-center my-2">
                    <ChevronRight className="w-5 h-5 text-night-600 rotate-90" />
                  </div>
                </motion.div>
              ))}

              {/* Current verse (highlighted) */}
              <VerseDisplay verse={verse} surahNumber={surahNum} size="medium" highlight />

              <div className="text-center text-night-500 text-sm mt-4">
                <p>Recite all verses from the beginning, ending with the new one</p>
              </div>
            </motion.div>
          )}

          {/* COMPLETE PHASE */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-glow-gold"
              >
                <Trophy className="w-12 h-12 text-night-950" />
              </motion.div>

              <h2 className="text-3xl font-bold text-night-100">
                Mashallah! 🌟
              </h2>
              <p className="text-night-400 max-w-md mx-auto">
                You've memorized Ayah {ayahNum} of Surah {surahName}. 
                It will be added to your review queue for tomorrow.
              </p>

              <div className="bg-night-900/50 rounded-2xl p-6 border border-night-800 max-w-sm mx-auto">
                <div className="flex items-center justify-center gap-6">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gold-400">+25</p>
                    <p className="text-night-500 text-sm">XP Earned</p>
                  </div>
                  <div className="w-px h-12 bg-night-700" />
                  <div className="text-center">
                    <p className="text-3xl font-bold text-sage-400">1</p>
                    <p className="text-night-500 text-sm">Verse Added</p>
                  </div>
                </div>
              </div>

              <VerseDisplay verse={verse} surahNumber={surahNum} size="medium" />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 z-40 glass safe-area-bottom border-t border-night-800">
        <div className="flex items-center justify-between px-4 py-4">
          {phase !== 'intro' && phase !== 'complete' ? (
            <>
              <button
                onClick={() => {
                  const phases: MemorizationPhase[] = ['intro', 'listen', 'read', 'memorize', 'recall', 'stack', 'complete'];
                  const currentIndex = phases.indexOf(phase);
                  if (currentIndex > 0) {
                    setPhase(phases[currentIndex - 1]);
                    setRepetitions(0);
                    setShowText(true);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-night-400 hover:bg-night-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex gap-1.5">
                {PHASES.map((p, i) => (
                  <div
                    key={p.phase}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i < currentPhaseIndex
                        ? 'bg-sage-500'
                        : i === currentPhaseIndex
                          ? 'bg-gold-500'
                          : 'bg-night-700'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                onClick={handleNextPhase}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={(phase === 'memorize' && repetitions < 10) || (phase === 'recall' && repetitions < 3)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all ${
                  (phase === 'memorize' && repetitions < 10) || (phase === 'recall' && repetitions < 3)
                    ? 'bg-night-800 text-night-500 cursor-not-allowed'
                    : 'bg-gold-500 hover:bg-gold-400 text-night-950 shadow-glow-gold'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </>
          ) : phase === 'intro' ? (
            <motion.button
              onClick={handleNextPhase}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-night-950 font-semibold transition-colors shadow-glow-gold"
            >
              <Sparkles className="w-5 h-5" />
              Begin Memorization
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="w-full flex gap-4">
              <button
                onClick={() => router.push('/practice')}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-night-800 hover:bg-night-700 text-night-300 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Back to Practice
              </button>
              
              <motion.button
                onClick={goToNextVerse}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl bg-gold-500 hover:bg-gold-400 text-night-950 font-semibold transition-colors shadow-glow-gold"
              >
                Next Verse
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
