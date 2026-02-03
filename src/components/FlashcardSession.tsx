'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  ThumbsUp,
  ThumbsDown,
  Brain,
  Sparkles,
  Trophy,
  Flame,
  Star,
  BookOpen,
  Eye,
  EyeOff,
  Lightbulb,
} from 'lucide-react';
import {
  type Flashcard,
  type FlashcardProgress,
  type ReviewResult,
  calculateNextReview,
  getFlashcardProgress,
  saveFlashcardProgress,
} from '@/lib/flashcardSystem';
import { playArabic } from '@/lib/audioService';

interface FlashcardSessionProps {
  cards: Flashcard[];
  onComplete: (results: { correct: number; total: number }) => void;
  onExit: () => void;
  deckName?: string;
}

type CardState = 'question' | 'answer' | 'grading';

export default function FlashcardSession({
  cards,
  onComplete,
  onExit,
  deckName = 'Practice',
}: FlashcardSessionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardState, setCardState] = useState<CardState>('question');
  const [results, setResults] = useState<{ cardId: string; quality: number }[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  const currentCard = cards[currentIndex];
  const progress = ((currentIndex) / cards.length) * 100;
  const isLastCard = currentIndex === cards.length - 1;
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (cardState === 'question') {
        if (e.code === 'Space') {
          e.preventDefault();
          setCardState('answer');
        }
      } else if (cardState === 'answer') {
        if (e.code === 'Digit1') handleGrade(1);
        else if (e.code === 'Digit2') handleGrade(2);
        else if (e.code === 'Digit3') handleGrade(3);
        else if (e.code === 'Digit4') handleGrade(4);
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cardState]);
  
  const playAudio = async () => {
    if (!currentCard || isPlaying) return;
    setIsPlaying(true);
    try {
      await playArabic(currentCard.arabic);
    } finally {
      setIsPlaying(false);
    }
  };
  
  const handleReveal = () => {
    setCardState('answer');
    // Auto-play audio when revealing
    playAudio();
  };
  
  const handleGrade = (quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    // Save result
    setResults(prev => [...prev, { cardId: currentCard.id, quality }]);
    
    // Update progress using SM-2
    const existingProgress = getFlashcardProgress()[currentCard.id];
    const newProgress = calculateNextReview(existingProgress || null, { quality });
    saveFlashcardProgress(currentCard.id, newProgress);
    
    // Move to next card or complete
    if (isLastCard) {
      const correct = results.filter(r => r.quality >= 3).length + (quality >= 3 ? 1 : 0);
      onComplete({ correct, total: cards.length });
    } else {
      setCurrentIndex(prev => prev + 1);
      setCardState('question');
      setShowHint(false);
    }
  };
  
  if (!currentCard) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-night-400">No cards to review</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 safe-area-top px-4 pt-4">
        <div className="liquid-glass rounded-2xl p-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onExit}
              className="liquid-icon-btn"
              aria-label="Exit"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="text-center">
              <h1 className="font-semibold text-night-100 text-sm">{deckName}</h1>
              <p className="text-xs text-night-400">
                {currentIndex + 1} of {cards.length}
              </p>
            </div>
            
            <div className="w-10" />
          </div>
          
          {/* Progress bar */}
          <div className="h-1.5 bg-night-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full"
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>
      
      {/* Card Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            {/* Main Card */}
            <div
              className="relative rounded-3xl p-8 min-h-[400px] flex flex-col"
              style={{
                background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.02) 100%)',
                border: '1px solid rgba(201,162,39,0.2)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              {/* Category badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gold-400/70 uppercase tracking-wider font-medium">
                  {currentCard.category}
                </span>
                <button
                  onClick={playAudio}
                  disabled={isPlaying}
                  className="liquid-icon-btn !w-10 !h-10"
                  aria-label="Play audio"
                >
                  <Volume2 className={`w-5 h-5 ${isPlaying ? 'text-gold-400 animate-pulse' : ''}`} />
                </button>
              </div>
              
              {/* Arabic (always shown) */}
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <motion.p
                  className="font-arabic text-5xl md:text-6xl text-gold-300 mb-4 leading-relaxed"
                  style={{ direction: 'rtl' }}
                  whileHover={{ scale: 1.02 }}
                >
                  {currentCard.arabic}
                </motion.p>
                
                {/* Transliteration - can be toggled as hint */}
                {cardState === 'question' && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-2 text-night-500 hover:text-night-300 transition-colors text-sm mt-4"
                  >
                    {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showHint ? 'Hide' : 'Show'} hint
                  </button>
                )}
                
                <AnimatePresence>
                  {(showHint || cardState === 'answer') && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-night-400 text-lg italic mt-2"
                    >
                      {currentCard.transliteration}
                    </motion.p>
                  )}
                </AnimatePresence>
                
                {/* Answer section */}
                <AnimatePresence>
                  {cardState === 'answer' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 pt-6 border-t border-night-700/50 w-full"
                    >
                      <p className="text-2xl text-night-100 font-medium mb-4">
                        {currentCard.english}
                      </p>
                      
                      {/* Examples if available */}
                      {currentCard.examples && currentCard.examples.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-xs text-night-500 uppercase tracking-wider flex items-center gap-1.5">
                            <Lightbulb className="w-3 h-3" />
                            Examples
                          </p>
                          {currentCard.examples.map((ex, i) => (
                            <div key={i} className="bg-night-800/30 rounded-xl p-3 text-left">
                              <p className="font-arabic text-xl text-gold-300/80" style={{ direction: 'rtl' }}>
                                {ex.arabic}
                              </p>
                              <p className="text-night-400 text-sm mt-1">{ex.english}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Difficulty indicator */}
              <div className="flex items-center justify-center gap-1 mt-4">
                {[1, 2, 3, 4, 5].map(level => (
                  <div
                    key={level}
                    className={`w-2 h-2 rounded-full ${
                      level <= currentCard.difficulty
                        ? 'bg-gold-500'
                        : 'bg-night-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 p-6 pb-8 safe-area-bottom">
        {cardState === 'question' ? (
          <motion.button
            onClick={handleReveal}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-3"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.9) 0%, rgba(180,140,30,1) 100%)',
              boxShadow: '0 8px 32px rgba(201,162,39,0.3)',
              color: '#0a0a0f',
            }}
          >
            <Eye className="w-5 h-5" />
            Show Answer
            <span className="text-night-950/50 text-sm">(Space)</span>
          </motion.button>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-night-400 text-sm mb-3">How well did you know this?</p>
            
            <div className="grid grid-cols-4 gap-2">
              {/* Again */}
              <motion.button
                onClick={() => handleGrade(1)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-red-900/30 border border-red-700/30 hover:bg-red-900/50 transition-colors"
              >
                <ThumbsDown className="w-5 h-5 text-red-400" />
                <span className="text-red-400 text-xs font-medium">Again</span>
                <span className="text-night-600 text-[10px]">1</span>
              </motion.button>
              
              {/* Hard */}
              <motion.button
                onClick={() => handleGrade(2)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-orange-900/30 border border-orange-700/30 hover:bg-orange-900/50 transition-colors"
              >
                <Brain className="w-5 h-5 text-orange-400" />
                <span className="text-orange-400 text-xs font-medium">Hard</span>
                <span className="text-night-600 text-[10px]">2</span>
              </motion.button>
              
              {/* Good */}
              <motion.button
                onClick={() => handleGrade(3)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-sage-900/30 border border-sage-700/30 hover:bg-sage-900/50 transition-colors"
              >
                <Check className="w-5 h-5 text-sage-400" />
                <span className="text-sage-400 text-xs font-medium">Good</span>
                <span className="text-night-600 text-[10px]">3</span>
              </motion.button>
              
              {/* Easy */}
              <motion.button
                onClick={() => handleGrade(5)}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-gold-900/30 border border-gold-700/30 hover:bg-gold-900/50 transition-colors"
              >
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span className="text-gold-400 text-xs font-medium">Easy</span>
                <span className="text-night-600 text-[10px]">4</span>
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// Session Complete Screen
// ============================================
export function SessionComplete({
  correct,
  total,
  onRestart,
  onExit,
}: {
  correct: number;
  total: number;
  onRestart: () => void;
  onExit: () => void;
}) {
  const percentage = Math.round((correct / total) * 100);
  const isGreat = percentage >= 80;
  const isGood = percentage >= 60;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-night-950 flex flex-col items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 rounded-full flex items-center justify-center mb-6"
        style={{
          background: isGreat
            ? 'linear-gradient(135deg, rgba(201,162,39,0.9) 0%, rgba(180,140,30,1) 100%)'
            : isGood
              ? 'linear-gradient(135deg, rgba(134,169,113,0.9) 0%, rgba(100,140,90,1) 100%)'
              : 'linear-gradient(135deg, rgba(255,150,100,0.9) 0%, rgba(200,100,50,1) 100%)',
          boxShadow: isGreat
            ? '0 0 60px rgba(201,162,39,0.5)'
            : isGood
              ? '0 0 60px rgba(134,169,113,0.5)'
              : '0 0 60px rgba(200,100,50,0.5)',
        }}
      >
        <Trophy className="w-12 h-12 text-night-950" />
      </motion.div>
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-night-100 mb-2"
      >
        {isGreat ? 'Excellent!' : isGood ? 'Good Job!' : 'Keep Practicing!'}
      </motion.h1>
      
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-night-400 text-center mb-8"
      >
        You got {correct} out of {total} correct
      </motion.p>
      
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-2 gap-4 mb-8 w-full max-w-xs"
      >
        <div className="text-center p-4 rounded-2xl bg-night-900/50 border border-night-800">
          <p className="text-3xl font-bold text-gold-400">{percentage}%</p>
          <p className="text-night-500 text-sm">Accuracy</p>
        </div>
        <div className="text-center p-4 rounded-2xl bg-night-900/50 border border-night-800">
          <p className="text-3xl font-bold text-night-100">{total}</p>
          <p className="text-night-500 text-sm">Cards Reviewed</p>
        </div>
      </motion.div>
      
      {/* Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex flex-col gap-3 w-full max-w-xs"
      >
        <button
          onClick={onRestart}
          className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2"
          style={{
            background: 'linear-gradient(135deg, rgba(201,162,39,0.9) 0%, rgba(180,140,30,1) 100%)',
            color: '#0a0a0f',
          }}
        >
          <RotateCcw className="w-5 h-5" />
          Practice Again
        </button>
        
        <button
          onClick={onExit}
          className="w-full py-4 rounded-2xl font-semibold text-night-300 bg-night-900/50 border border-night-800 hover:bg-night-800/50 transition-colors"
        >
          Done
        </button>
      </motion.div>
    </motion.div>
  );
}
