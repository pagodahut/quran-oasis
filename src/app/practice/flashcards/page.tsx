'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Play,
  Star,
  BookOpen,
  Brain,
  Target,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  Trophy,
  Flame,
} from 'lucide-react';
import {
  FLASHCARD_DECKS,
  getDeckStats,
  getDueCards,
  getNewCards,
} from '@/lib/flashcardSystem';
import FlashcardSession, { SessionComplete } from '@/components/FlashcardSession';
import BottomNav from '@/components/BottomNav';

type ViewState = 'decks' | 'session' | 'complete';

export default function FlashcardsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deckIdParam = searchParams.get('deck');
  
  const [viewState, setViewState] = useState<ViewState>('decks');
  const [selectedDeck, setSelectedDeck] = useState<string | null>(deckIdParam);
  const [sessionCards, setSessionCards] = useState<any[]>([]);
  const [sessionResults, setSessionResults] = useState({ correct: 0, total: 0 });
  const [deckStats, setDeckStats] = useState<Record<string, { total: number; learned: number; due: number; mastered: number }>>({});
  
  // Load deck stats
  useEffect(() => {
    const stats: Record<string, { total: number; learned: number; due: number; mastered: number }> = {};
    for (const deck of FLASHCARD_DECKS) {
      stats[deck.id] = getDeckStats(deck.id);
    }
    setDeckStats(stats);
  }, [viewState]);
  
  // If deck param is set, start that deck
  useEffect(() => {
    if (deckIdParam && viewState === 'decks') {
      startDeck(deckIdParam);
    }
  }, [deckIdParam]);
  
  const startDeck = (deckId: string) => {
    const deck = FLASHCARD_DECKS.find(d => d.id === deckId);
    if (!deck) return;
    
    // Get due cards first, then new cards
    const due = getDueCards(deckId);
    const newCards = getNewCards(deckId, 10 - due.length);
    const cards = [...due, ...newCards].slice(0, 20);  // Max 20 per session
    
    if (cards.length === 0) {
      // No cards to review, show all as review
      setSessionCards(deck.cards.slice(0, 10));
    } else {
      setSessionCards(cards);
    }
    
    setSelectedDeck(deckId);
    setViewState('session');
  };
  
  const handleSessionComplete = (results: { correct: number; total: number }) => {
    setSessionResults(results);
    setViewState('complete');
  };
  
  const handleRestart = () => {
    if (selectedDeck) {
      startDeck(selectedDeck);
    }
  };
  
  const handleExit = () => {
    setViewState('decks');
    setSelectedDeck(null);
    setSessionCards([]);
    router.replace('/practice/flashcards');
  };
  
  // Session view
  if (viewState === 'session' && sessionCards.length > 0) {
    const deck = FLASHCARD_DECKS.find(d => d.id === selectedDeck);
    return (
      <FlashcardSession
        cards={sessionCards}
        onComplete={handleSessionComplete}
        onExit={handleExit}
        deckName={deck?.name || 'Practice'}
      />
    );
  }
  
  // Complete view
  if (viewState === 'complete') {
    return (
      <SessionComplete
        correct={sessionResults.correct}
        total={sessionResults.total}
        onRestart={handleRestart}
        onExit={handleExit}
      />
    );
  }
  
  // Deck selection view
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass mx-2 mt-2 rounded-2xl">
        <div className="flex items-center justify-between px-3 py-3">
          <Link href="/practice" className="liquid-icon-btn" aria-label="Back">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-night-100 text-lg">Flashcards</h1>
          <div className="w-11" />
        </div>
      </header>
      
      <main className="px-4 py-6 pb-28">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center mx-auto mb-4 shadow-glow-gold">
            <Layers className="w-8 h-8 text-night-950" />
          </div>
          <h2 className="text-xl font-bold text-night-100 mb-2">Practice with Flashcards</h2>
          <p className="text-night-400 text-sm max-w-xs mx-auto">
            Learn Arabic letters, Quranic vocabulary, and Tajweed rules with spaced repetition
          </p>
        </motion.div>
        
        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-8"
        >
          {(() => {
            const totalDue = Object.values(deckStats).reduce((sum, s) => sum + s.due, 0);
            const totalLearned = Object.values(deckStats).reduce((sum, s) => sum + s.learned, 0);
            const totalMastered = Object.values(deckStats).reduce((sum, s) => sum + s.mastered, 0);
            
            return (
              <>
                <div className="text-center p-4 rounded-2xl bg-night-900/50 border border-night-800">
                  <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-night-100">{totalDue}</p>
                  <p className="text-night-500 text-xs">Due Today</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-night-900/50 border border-night-800">
                  <Star className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-night-100">{totalLearned}</p>
                  <p className="text-night-500 text-xs">Learned</p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-night-900/50 border border-night-800">
                  <Trophy className="w-5 h-5 text-sage-400 mx-auto mb-1" />
                  <p className="text-xl font-bold text-night-100">{totalMastered}</p>
                  <p className="text-night-500 text-xs">Mastered</p>
                </div>
              </>
            );
          })()}
        </motion.div>
        
        {/* Deck List */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-night-500 uppercase tracking-wider px-1">
            Choose a Deck
          </h3>
          
          {FLASHCARD_DECKS.map((deck, index) => {
            const stats = deckStats[deck.id] || { total: 0, learned: 0, due: 0, mastered: 0 };
            const progress = stats.total > 0 ? (stats.learned / stats.total) * 100 : 0;
            const hasDue = stats.due > 0;
            
            return (
              <motion.button
                key={deck.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                onClick={() => startDeck(deck.id)}
                className="w-full text-left rounded-2xl p-5 transition-all relative overflow-hidden"
                style={{
                  background: hasDue
                    ? 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.04) 100%)'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  border: hasDue
                    ? '1px solid rgba(201,162,39,0.25)'
                    : '1px solid rgba(255,255,255,0.06)',
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl">{deck.icon}</div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-night-100 text-lg">{deck.name}</h4>
                      {hasDue && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gold-500/20 text-gold-400 border border-gold-500/30">
                          {stats.due} due
                        </span>
                      )}
                    </div>
                    <p className="text-night-400 text-sm mb-3">{deck.description}</p>
                    
                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-night-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-night-500">
                        {stats.learned}/{stats.total}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gold-500/20">
                    <Play className="w-5 h-5 text-gold-400" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 p-4 rounded-2xl bg-sage-900/20 border border-sage-700/30"
        >
          <div className="flex items-start gap-3">
            <Brain className="w-5 h-5 text-sage-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-sage-300 text-sm mb-1">Learning Tip</h4>
              <p className="text-night-400 text-sm">
                Review cards daily for best results. The spaced repetition system shows you cards just before you'd forget them.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
}
