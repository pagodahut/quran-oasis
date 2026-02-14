'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  Mic,
  Star,
  BookOpen,
  Repeat,
  Sparkles,
} from 'lucide-react';
import {
  playAyah,
  stopPlayback,
  pausePlayback,
  resumePlayback,
  getAyahAudioUrl,
  RECITERS,
} from '@/lib/quranAudioService';
import { markVerseMemorized, getVerseProgress } from '@/lib/progressStore';
import { useAudioPreferences } from '@/lib/preferencesStore';
import logger from '@/lib/logger';

interface MemorizationPracticeProps {
  surah: number;
  ayah: number;
  arabicText: string;
  translation?: string;
  transliteration?: string;
  reciterId?: string;
  onComplete?: () => void;
  onClose?: () => void;
}

type Phase = 'intro' | 'listen' | 'read' | 'memorize' | 'recall' | 'complete';

const PHASE_INFO: Record<Phase, { title: string; description: string; icon: any }> = {
  intro: {
    title: 'Getting Ready',
    description: 'Prepare yourself to memorize this beautiful verse',
    icon: BookOpen,
  },
  listen: {
    title: 'Listen Carefully',
    description: 'Listen to the verse recited by a professional reciter',
    icon: Volume2,
  },
  read: {
    title: 'Read Along',
    description: 'Read the verse while listening (10 times)',
    icon: Eye,
  },
  memorize: {
    title: 'Memorize',
    description: 'Try to recite from memory (3 times)',
    icon: EyeOff,
  },
  recall: {
    title: 'Final Recall',
    description: 'Recite the complete verse from memory',
    icon: Mic,
  },
  complete: {
    title: 'Congratulations!',
    description: 'You have memorized this verse',
    icon: Star,
  },
};

export default function MemorizationPractice({
  surah,
  ayah,
  arabicText,
  translation,
  transliteration,
  reciterId,
  onComplete,
  onClose,
}: MemorizationPracticeProps) {
  const { audio: audioPrefs } = useAudioPreferences();
  const [phase, setPhase] = useState<Phase>('intro');
  const [isPlaying, setIsPlaying] = useState(false);
  const [readCount, setReadCount] = useState(0);
  const [recallCount, setRecallCount] = useState(0);
  const [showText, setShowText] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const requiredReadCount = 10;
  const requiredRecallCount = 3;

  // Use prop reciter if provided, otherwise use preference
  const effectiveReciterId = reciterId || audioPrefs.reciter;

  // Get current reciter
  const reciter = RECITERS.find(r => r.id === effectiveReciterId) || RECITERS[0];

  // Play audio
  const playVerseAudio = useCallback(async () => {
    if (isPlaying) {
      stopPlayback();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    try {
      await playAyah(surah, ayah, {
        reciterId: effectiveReciterId,
        onStart: () => setIsPlaying(true),
        onEnd: () => {
          setIsPlaying(false);
          // Auto-increment count during read phase
          if (phase === 'read') {
            setReadCount(prev => Math.min(prev + 1, requiredReadCount));
          } else if (phase === 'memorize') {
            setRecallCount(prev => Math.min(prev + 1, requiredRecallCount));
          }
        },
        onError: (error) => {
          logger.error('Audio error:', error);
          setIsPlaying(false);
        },
      });
    } catch (error) {
      logger.error('Failed to play audio:', error);
      setIsPlaying(false);
    }
  }, [isPlaying, surah, ayah, effectiveReciterId, phase]);

  // Move to next phase
  const nextPhase = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
    
    const phases: Phase[] = ['intro', 'listen', 'read', 'memorize', 'recall', 'complete'];
    const currentIndex = phases.indexOf(phase);
    if (currentIndex < phases.length - 1) {
      setPhase(phases[currentIndex + 1]);
    }
  }, [phase]);

  // Handle phase transitions
  useEffect(() => {
    if (phase === 'read' && readCount >= requiredReadCount) {
      // Wait a moment then move to memorize phase
      const timer = setTimeout(() => {
        setPhase('memorize');
        setShowText(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
    
    if (phase === 'memorize' && recallCount >= requiredRecallCount) {
      // Move to final recall
      const timer = setTimeout(() => {
        setPhase('recall');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, readCount, recallCount]);

  // Complete memorization
  const completeMemorization = useCallback(() => {
    // Save progress
    markVerseMemorized(surah, ayah);
    setPhase('complete');
    onComplete?.();
  }, [surah, ayah, onComplete]);

  // Phase content
  const PhaseIcon = PHASE_INFO[phase].icon;

  return (
    <div className="fixed inset-0 z-50 bg-night-950/95 backdrop-blur-xl flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-night-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
            <PhaseIcon className="w-5 h-5 text-gold-400" />
          </div>
          <div>
            <h2 className="font-semibold text-night-100">{PHASE_INFO[phase].title}</h2>
            <p className="text-sm text-night-400">{PHASE_INFO[phase].description}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-night-800/50 flex items-center justify-center text-night-400 hover:text-night-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </header>

      {/* Progress */}
      <div className="px-4 py-3 border-b border-night-800/50">
        <div className="flex items-center gap-2">
          {(['intro', 'listen', 'read', 'memorize', 'recall', 'complete'] as Phase[]).map((p, i) => (
            <div key={p} className="flex-1 flex items-center gap-1">
              <div
                className={`flex-1 h-1 rounded-full transition-colors ${
                  phase === p ? 'bg-gold-500' :
                  ['intro', 'listen', 'read', 'memorize', 'recall', 'complete'].indexOf(phase) > i ? 'bg-sage-500' :
                  'bg-night-700'
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Intro Phase */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center space-y-6"
            >
              <div className="w-20 h-20 rounded-full bg-gold-500/10 flex items-center justify-center mx-auto">
                <Sparkles className="w-10 h-10 text-gold-400" />
              </div>
              
              <h3 className="text-2xl font-semibold text-night-100">
                The 10-3 Method
              </h3>
              
              <p className="text-night-300 leading-relaxed">
                This is the time-tested technique used in traditional Tahfiz schools worldwide.
              </p>

              <div className="bg-night-900/50 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center text-gold-400 font-semibold">
                    10
                  </div>
                  <div>
                    <h4 className="font-medium text-night-100">Read Along</h4>
                    <p className="text-sm text-night-400">Listen and read the verse 10 times while looking at the text</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-sage-500/20 flex items-center justify-center text-sage-400 font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium text-night-100">Recite from Memory</h4>
                    <p className="text-sm text-night-400">Recite the verse 3 times without looking</p>
                  </div>
                </div>
              </div>

              <div className="bg-night-900/50 rounded-2xl p-4">
                <p className="text-sm text-night-400 mb-2">Reciter</p>
                <p className="font-arabic text-gold-400">{reciter.arabicName}</p>
                <p className="text-sm text-night-300">{reciter.name}</p>
              </div>

              <button
                onClick={nextPhase}
                className="liquid-btn w-full py-4 text-lg"
              >
                Begin Memorization
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          )}

          {/* Listen Phase */}
          {phase === 'listen' && (
            <motion.div
              key="listen"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center space-y-6"
            >
              <p className="text-night-400 text-sm">Listen carefully to the pronunciation</p>
              
              <div className="bg-night-900/50 rounded-2xl p-6">
                <p 
                  className="font-arabic text-3xl text-gold-300 leading-[2] mb-4"
                  style={{ direction: 'rtl' }}
                >
                  {arabicText}
                </p>
                {transliteration && (
                  <p className="text-night-400 text-sm italic mb-2">{transliteration}</p>
                )}
                {translation && (
                  <p className="text-night-300 text-sm">{translation}</p>
                )}
              </div>

              <button
                onClick={playVerseAudio}
                className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all ${
                  isPlaying 
                    ? 'bg-gold-500 text-night-950 scale-110' 
                    : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                }`}
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10" />
                ) : (
                  <Play className="w-10 h-10 ml-1" />
                )}
              </button>

              <p className="text-night-400 text-sm">
                {isPlaying ? 'Playing...' : 'Tap to play'}
              </p>

              <button
                onClick={nextPhase}
                className="liquid-btn-outline w-full py-3"
              >
                Continue to Reading
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </motion.div>
          )}

          {/* Read Phase */}
          {phase === 'read' && (
            <motion.div
              key="read"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center space-y-6"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-gold-400">{readCount}</span>
                <span className="text-night-400">/ {requiredReadCount}</span>
              </div>
              
              <div className="h-2 bg-night-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(readCount / requiredReadCount) * 100}%` }}
                />
              </div>

              <div className="bg-night-900/50 rounded-2xl p-6">
                <p 
                  className="font-arabic text-3xl text-gold-300 leading-[2] mb-4"
                  style={{ direction: 'rtl' }}
                >
                  {arabicText}
                </p>
                {showTranslation && transliteration && (
                  <p className="text-night-400 text-sm italic mb-2">{transliteration}</p>
                )}
                {showTranslation && translation && (
                  <p className="text-night-300 text-sm">{translation}</p>
                )}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={playVerseAudio}
                  className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                    isPlaying 
                      ? 'bg-gold-500 text-night-950 scale-105' 
                      : 'bg-gold-500/20 text-gold-400 hover:bg-gold-500/30'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-8 h-8" />
                  ) : (
                    <Play className="w-8 h-8 ml-1" />
                  )}
                </button>
                <button
                  onClick={() => setReadCount(prev => Math.min(prev + 1, requiredReadCount))}
                  className="w-14 h-14 rounded-xl bg-night-800/50 text-night-300 hover:bg-night-800 transition-colors flex items-center justify-center"
                >
                  <CheckCircle2 className="w-6 h-6" />
                </button>
              </div>

              <p className="text-night-400 text-sm">
                Read along with the reciter, then tap ✓ when done
              </p>

              {readCount >= requiredReadCount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-sage-900/30 rounded-xl p-4 text-sage-300"
                >
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
                  <p>Excellent! Moving to memorization...</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Memorize Phase */}
          {phase === 'memorize' && (
            <motion.div
              key="memorize"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center space-y-6"
            >
              <div className="flex items-center justify-center gap-2">
                <span className="text-4xl font-bold text-sage-400">{recallCount}</span>
                <span className="text-night-400">/ {requiredRecallCount}</span>
              </div>
              
              <div className="h-2 bg-night-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-sage-500 to-sage-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(recallCount / requiredRecallCount) * 100}%` }}
                />
              </div>

              <div className="bg-night-900/50 rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
                {showText ? (
                  <p 
                    className="font-arabic text-3xl text-gold-300 leading-[2]"
                    style={{ direction: 'rtl' }}
                  >
                    {arabicText}
                  </p>
                ) : (
                  <div className="text-center text-night-400">
                    <EyeOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Try to recite from memory</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowText(!showText)}
                  className="w-14 h-14 rounded-xl bg-night-800/50 text-night-300 hover:bg-night-800 transition-colors flex items-center justify-center"
                >
                  {showText ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
                <button
                  onClick={playVerseAudio}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                    isPlaying 
                      ? 'bg-gold-500/30 text-gold-400' 
                      : 'bg-night-800/50 text-night-300 hover:bg-night-800'
                  }`}
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => setRecallCount(prev => Math.min(prev + 1, requiredRecallCount))}
                  className="w-20 h-20 rounded-full bg-sage-500/20 text-sage-400 hover:bg-sage-500/30 transition-colors flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8" />
                </button>
              </div>

              <p className="text-night-400 text-sm">
                {showText ? 'Tap 👁️ to hide text, then recite from memory' : 'Recite from memory, tap ✓ when done'}
              </p>

              {recallCount >= requiredRecallCount && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-sage-900/30 rounded-xl p-4 text-sage-300"
                >
                  <CheckCircle2 className="w-6 h-6 mx-auto mb-2" />
                  <p>Mashallah! One more recall...</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Final Recall Phase */}
          {phase === 'recall' && (
            <motion.div
              key="recall"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-lg mx-auto text-center space-y-6"
            >
              <p className="text-night-300">Final test: Recite the verse completely from memory</p>

              <div className="bg-night-900/50 rounded-2xl p-6 min-h-[200px] flex items-center justify-center">
                <div className="text-center text-night-400">
                  <Mic className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Recite the verse out loud</p>
                  <p className="text-sm mt-2">Take a deep breath and begin</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setShowText(!showText)}
                  className="px-6 py-3 rounded-xl bg-night-800/50 text-night-300 hover:bg-night-800 transition-colors flex items-center gap-2"
                >
                  {showText ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  {showText ? 'Hide Hint' : 'Show Hint'}
                </button>
              </div>

              {showText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gold-900/20 rounded-xl p-4"
                >
                  <p 
                    className="font-arabic text-xl text-gold-300/70"
                    style={{ direction: 'rtl' }}
                  >
                    {arabicText}
                  </p>
                </motion.div>
              )}

              <button
                onClick={completeMemorization}
                className="liquid-btn w-full py-4 text-lg"
              >
                <CheckCircle2 className="w-5 h-5 mr-2" />
                I Recited Successfully!
              </button>
              
              <button
                onClick={() => {
                  setPhase('read');
                  setReadCount(0);
                  setRecallCount(0);
                }}
                className="text-night-400 hover:text-night-200 text-sm"
              >
                <RotateCcw className="w-4 h-4 inline mr-1" />
                Practice Again
              </button>
            </motion.div>
          )}

          {/* Complete Phase */}
          {phase === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-lg mx-auto text-center space-y-6 py-8"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto"
              >
                <Star className="w-12 h-12 text-gold-400" />
              </motion.div>

              <h2 className="text-3xl font-bold text-night-100">
                Mashallah! 🎉
              </h2>
              
              <p className="text-night-300 text-lg">
                You have successfully memorized this verse!
              </p>

              <div className="bg-night-900/50 rounded-2xl p-6">
                <p 
                  className="font-arabic text-2xl text-gold-300 leading-[2]"
                  style={{ direction: 'rtl' }}
                >
                  {arabicText}
                </p>
              </div>

              <div className="bg-sage-900/20 rounded-xl p-4 text-sage-300 text-sm">
                <p className="font-medium mb-1">Progress Saved!</p>
                <p>This verse has been added to your memorization progress.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={onClose}
                  className="liquid-btn w-full py-4"
                >
                  Continue Learning
                </button>
                <button
                  onClick={() => {
                    setPhase('intro');
                    setReadCount(0);
                    setRecallCount(0);
                    setShowText(true);
                  }}
                  className="liquid-btn-outline w-full py-3"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Practice Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
