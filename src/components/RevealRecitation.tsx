'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Square,
  RotateCcw,
  ChevronLeft,
  Trophy,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Eye,
  Sparkles,
} from 'lucide-react';
import { fetchTajweedSurah, type TajweedSurahData, type TajweedWord } from '@/lib/quranTajweedApi';
import { TarteelService, checkBrowserSupport } from '@/lib/tarteelService';
import { WebSpeechService } from '@/lib/webSpeechService';
import { SURAH_METADATA } from '@/lib/surahMetadata';
import { getTajweedColor } from '@/lib/tajweedColorMap';

// ============ Types ============

export type RevealDifficulty = 'easy' | 'medium' | 'hard';

interface RevealRecitationProps {
  surahNumber: number;
  startAyah?: number;
  endAyah?: number;
  difficulty?: RevealDifficulty;
  onBack: () => void;
  onComplete?: (result: RevealResult) => void;
}

export interface RevealResult {
  accuracy: number;
  totalWords: number;
  correctWords: number;
  partialWords: number;
  missedWords: number;
  duration: number;
}

type WordRevealState = 'hidden' | 'correct' | 'partial' | 'missed' | 'flash-correct';

type Phase = 'loading' | 'ready' | 'recording' | 'complete' | 'error';

// ============ Sparkle Effect ============

function SparkleEffect({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <motion.span
      className="absolute -inset-2 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.8 }}
    >
      {[...Array(6)].map((_, i) => (
        <motion.span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-gold-400"
          initial={{ opacity: 1, scale: 0 }}
          animate={{
            opacity: [1, 0],
            scale: [0, 1.5],
            x: Math.cos((i * 60) * Math.PI / 180) * 16,
            y: Math.sin((i * 60) * Math.PI / 180) * 16,
          }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
          style={{
            left: '50%',
            top: '50%',
          }}
        />
      ))}
    </motion.span>
  );
}

// ============ Hidden Word Placeholder ============

function HiddenWordBlock({
  word,
  difficulty,
}: {
  word: TajweedWord;
  difficulty: RevealDifficulty;
}) {
  const plainText = word.segments.map(s => s.text).join('');

  if (difficulty === 'hard') {
    return (
      <span
        className="inline-block rounded-lg mx-0.5"
        style={{
          width: `${Math.max(plainText.length * 0.7, 1.5)}em`,
          height: '1.4em',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.04) 100%)',
          border: '1px solid rgba(201,162,39,0.12)',
          verticalAlign: 'middle',
        }}
      />
    );
  }

  if (difficulty === 'easy') {
    // Show first letter as hint
    const firstChar = plainText.charAt(0);
    return (
      <span
        className="inline-block rounded-lg mx-0.5 text-center font-quran relative"
        style={{
          minWidth: `${Math.max(plainText.length * 0.7, 1.5)}em`,
          height: '1.4em',
          lineHeight: '1.4em',
          background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.04) 100%)',
          border: '1px solid rgba(201,162,39,0.12)',
          verticalAlign: 'middle',
          color: 'rgba(201,162,39,0.5)',
        }}
        dir="rtl"
      >
        {firstChar}
        <span style={{ color: 'transparent' }}>{plainText.slice(1).replace(/./g, '·')}</span>
      </span>
    );
  }

  // Medium: golden translucent block (word shape visible)
  return (
    <span
      className="inline-block rounded-lg mx-0.5"
      style={{
        width: `${Math.max(plainText.length * 0.7, 1.5)}em`,
        height: '1.4em',
        background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(201,162,39,0.05) 100%)',
        border: '1px dashed rgba(201,162,39,0.15)',
        verticalAlign: 'middle',
      }}
    />
  );
}

// ============ Revealed Word ============

function RevealedWord({
  word,
  state,
  justRevealed,
}: {
  word: TajweedWord;
  state: WordRevealState;
  justRevealed: boolean;
}) {
  const colorMap: Record<string, string> = {
    correct: '#c9a227',
    partial: '#f59e0b',
    'flash-correct': '#e5e5e5',
  };

  const baseColor = colorMap[state] || '#e5e5e5';
  const bgMap: Record<string, string> = {
    correct: 'rgba(201,162,39,0.12)',
    partial: 'rgba(245,158,11,0.1)',
    'flash-correct': 'rgba(255,255,255,0.05)',
  };

  return (
    <motion.span
      className="inline-block relative mx-0.5 rounded-md font-quran"
      initial={justRevealed ? { opacity: 0, scale: 0.8, filter: 'blur(4px)' } : {}}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
      style={{
        padding: '2px 4px',
        backgroundColor: bgMap[state] || 'transparent',
        verticalAlign: 'middle',
      }}
    >
      {/* Gold glow for correct */}
      {state === 'correct' && justRevealed && (
        <motion.span
          className="absolute inset-0 rounded-md"
          style={{
            boxShadow: '0 0 12px rgba(201,162,39,0.4)',
          }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      )}

      <SparkleEffect active={justRevealed && state === 'correct'} />

      {word.segments.map((seg, i) => (
        <span key={i} style={{ color: state === 'correct' && !justRevealed ? (seg.rule ? getTajweedColor(seg.rule) : '#e5e5e5') : baseColor }}>
          {seg.text}
        </span>
      ))}
    </motion.span>
  );
}

// ============ Missed Word Flash ============

function MissedWordFlash({
  word,
  onDone,
}: {
  word: TajweedWord;
  onDone: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onDone, 1500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <motion.span
      className="inline-block relative mx-0.5 rounded-md font-quran"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.9] }}
      transition={{ duration: 1.5, times: [0, 0.15, 0.7, 1] }}
      style={{
        padding: '2px 4px',
        backgroundColor: 'rgba(239,68,68,0.15)',
        verticalAlign: 'middle',
      }}
    >
      {word.segments.map((seg, i) => (
        <span key={i} style={{ color: '#ef4444' }}>
          {seg.text}
        </span>
      ))}
    </motion.span>
  );
}

// ============ Audio Level Ring ============

function AudioLevelRing({ service }: { service: TarteelService | WebSpeechService | null }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!service || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const level = service.getAudioLevel();
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const bars = 20;
      const innerR = 28;

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2 - Math.PI / 2;
        const barLevel = level * (0.4 + 0.6 * Math.sin(angle * 2 + Date.now() / 150));
        const barH = 3 + barLevel * 18;

        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * (innerR + barH);
        const y2 = cy + Math.sin(angle) * (innerR + barH);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(201,162,39,${0.25 + barLevel * 0.75})`;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [service]);

  return <canvas ref={canvasRef} width={96} height={96} className="absolute inset-0" />;
}

// ============ Celebration Overlay ============

function CelebrationOverlay({ result, onRetry, onBack }: {
  result: RevealResult;
  onRetry: () => void;
  onBack: () => void;
}) {
  const grade = useMemo(() => {
    if (result.accuracy >= 95) return { label: 'Excellent!', emoji: '🌟', color: 'text-gold-400' };
    if (result.accuracy >= 85) return { label: 'Great Job!', emoji: '✨', color: 'text-sage-400' };
    if (result.accuracy >= 70) return { label: 'Good Effort', emoji: '💪', color: 'text-midnight-400' };
    return { label: 'Keep Practicing', emoji: '📖', color: 'text-night-300' };
  }, [result.accuracy]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-night-950/95 backdrop-blur-lg overflow-y-auto"
    >
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* Grade */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl mb-3"
            >
              {grade.emoji}
            </motion.div>
            <h2 className={`text-2xl font-bold ${grade.color}`}>{grade.label}</h2>
            <p className="text-night-400 text-sm mt-1">Reveal Recitation Complete</p>
          </div>

          {/* Particles for high scores */}
          {result.accuracy >= 90 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: i % 2 === 0 ? '#C9A227' : '#4E7A51',
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ scale: 0, x: 0, y: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    x: Math.cos((i * 22.5) * Math.PI / 180) * 120,
                    y: Math.sin((i * 22.5) * Math.PI / 180) * 120,
                  }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50 text-center">
              <Target className="w-5 h-5 mx-auto mb-2 text-gold-500" />
              <div className="text-2xl font-bold text-night-100">{result.accuracy}%</div>
              <div className="text-xs text-night-400">Accuracy</div>
            </div>
            <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50 text-center">
              <Clock className="w-5 h-5 mx-auto mb-2 text-midnight-400" />
              <div className="text-2xl font-bold text-night-100">
                {Math.floor(result.duration / 60)}:{Math.floor(result.duration % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-xs text-night-400">Duration</div>
            </div>
            <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50 text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-sage-500" />
              <div className="text-2xl font-bold text-night-100">
                {result.correctWords}/{result.totalWords}
              </div>
              <div className="text-xs text-night-400">Correct</div>
            </div>
            <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50 text-center">
              <XCircle className="w-5 h-5 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-bold text-night-100">{result.missedWords}</div>
              <div className="text-xs text-night-400">Missed</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-xl bg-night-800 text-night-300 border border-night-700 font-medium transition hover:bg-night-700"
            >
              Back
            </button>
            <button
              onClick={onRetry}
              className="flex-1 py-3 rounded-xl bg-gold-500/90 text-night-950 font-semibold transition hover:bg-gold-400 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ============ Difficulty Selector ============

export function DifficultySelector({
  value,
  onChange,
}: {
  value: RevealDifficulty;
  onChange: (d: RevealDifficulty) => void;
}) {
  const options: { key: RevealDifficulty; label: string; desc: string }[] = [
    { key: 'easy', label: 'Easy', desc: 'First letter hints' },
    { key: 'medium', label: 'Medium', desc: 'Layout only' },
    { key: 'hard', label: 'Hard', desc: 'Everything hidden' },
  ];

  return (
    <div className="flex gap-2">
      {options.map(opt => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`flex-1 py-2 px-3 rounded-xl text-center transition border ${
            value === opt.key
              ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
              : 'bg-night-800/50 text-night-400 border-night-700/30 hover:bg-night-800'
          }`}
        >
          <div className="text-sm font-medium">{opt.label}</div>
          <div className="text-[10px] mt-0.5 opacity-70">{opt.desc}</div>
        </button>
      ))}
    </div>
  );
}

// ============ Main RevealRecitation Component ============

export default function RevealRecitation({
  surahNumber,
  startAyah = 1,
  endAyah,
  difficulty = 'medium',
  onBack,
  onComplete,
}: RevealRecitationProps) {
  const [phase, setPhase] = useState<Phase>('loading');
  const [tajweedData, setTajweedData] = useState<TajweedSurahData | null>(null);
  const [revealStates, setRevealStates] = useState<WordRevealState[]>([]);
  const [justRevealedIdx, setJustRevealedIdx] = useState<number | null>(null);
  const [flashingMissed, setFlashingMissed] = useState<Set<number>>(new Set());
  const [errorMessage, setErrorMessage] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [result, setResult] = useState<RevealResult | null>(null);
  const [activeProvider, setActiveProvider] = useState<'tarteel' | 'browser' | null>(null);

  const serviceRef = useRef<TarteelService | WebSpeechService | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const surahMeta = useMemo(
    () => SURAH_METADATA.find(s => s.number === surahNumber),
    [surahNumber]
  );
  const effectiveEndAyah = endAyah || surahMeta?.numberOfAyahs;

  // ============ Load Data ============

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setPhase('loading');
        const data = await fetchTajweedSurah(surahNumber, startAyah, effectiveEndAyah);
        if (cancelled) return;
        if (data.allWords.length === 0) {
          setErrorMessage('No text found for the selected range.');
          setPhase('error');
          return;
        }
        setTajweedData(data);
        setRevealStates(new Array(data.allWords.length).fill('hidden'));
        setPhase('ready');
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load:', err);
        setErrorMessage('Failed to load Quran text.');
        setPhase('error');
      }
    }
    load();
    return () => { cancelled = true; };
  }, [surahNumber, startAyah, effectiveEndAyah]);

  // ============ Progress ============

  const revealedCount = useMemo(
    () => revealStates.filter(s => s === 'correct' || s === 'partial').length,
    [revealStates]
  );
  const totalWords = tajweedData?.allWords.length || 0;
  const progressPct = totalWords > 0 ? Math.round((revealedCount / totalWords) * 100) : 0;

  // ============ Check Completion ============

  useEffect(() => {
    if (phase !== 'recording' || totalWords === 0) return;
    const processed = revealStates.filter(s => s !== 'hidden').length;
    if (processed >= totalWords) {
      // All words processed — finish
      finishSession();
    }
  }, [revealStates, phase, totalWords]);

  // ============ Start Recording ============

  const handleRevealWord = useCallback((index: number, _word: string, confidence: number) => {
    if (index < 0 || index >= totalWords) return;

    setRevealStates(prev => {
      const next = [...prev];
      if (next[index] !== 'hidden') return prev;

      if (confidence > 0.7) {
        next[index] = 'correct';
        setJustRevealedIdx(index);
        setTimeout(() => setJustRevealedIdx(p => p === index ? null : p), 800);
      } else if (confidence >= 0.4) {
        next[index] = 'partial';
        setJustRevealedIdx(index);
        setTimeout(() => setJustRevealedIdx(p => p === index ? null : p), 800);
      } else {
        next[index] = 'missed';
        setFlashingMissed(prev => new Set(prev).add(index));
      }
      return next;
    });

    setTimeout(() => {
      const el = scrollRef.current?.querySelector(`[data-reveal-idx="${index}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }, [totalWords]);

  const handleRevealStateChange = useCallback((state: { alignments: Array<{ status: string }> }) => {
    setRevealStates(prev => {
      const next = [...prev];
      let changed = false;
      state.alignments.forEach((a, idx) => {
        if (idx < next.length && a.status === 'missed' && next[idx] === 'hidden') {
          next[idx] = 'missed';
          changed = true;
          setFlashingMissed(p => new Set(p).add(idx));
        }
      });
      return changed ? next : prev;
    });
  }, []);

  const startRecording = useCallback(async () => {
    if (!tajweedData) return;

    const expectedText = tajweedData.plainWords.join(' ');

    // Try Tarteel first, fall back to Web Speech API
    let useTarteel = false;
    try {
      const checkRes = await fetch('/api/tarteel', { signal: AbortSignal.timeout(3000) });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        useTarteel = checkData.configured === true;
      }
    } catch {
      useTarteel = false;
    }

    try {
      if (useTarteel) {
        const service = new TarteelService({
          expectedText,
          chunkIntervalMs: 2500,
          onWord: handleRevealWord,
          onStateChange: handleRevealStateChange,
          onError: (err) => console.error('Tarteel error:', err),
        });
        serviceRef.current = service;
        await service.start();
        setActiveProvider('tarteel');
      } else {
        if (!WebSpeechService.isSupported()) {
          setErrorMessage('Speech recognition is not supported. Please use Chrome or Edge.');
          setPhase('error');
          return;
        }
        const service = new WebSpeechService({
          expectedText,
          onWord: handleRevealWord,
          onStateChange: handleRevealStateChange,
          onError: (err) => console.error('WebSpeech error:', err),
        });
        serviceRef.current = service;
        await service.start();
        setActiveProvider('browser');
      }

      setPhase('recording');
      setElapsedTime(0);
      timerRef.current = setInterval(() => setElapsedTime(p => p + 1), 1000);
    } catch (err) {
      console.error('Failed to start:', err);
      setErrorMessage(err instanceof Error ? err.message : 'Failed to start recording.');
      setPhase('error');
    }
  }, [tajweedData, totalWords, handleRevealWord, handleRevealStateChange]);

  // ============ Finish Session ============

  const finishSession = useCallback(async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (serviceRef.current) {
      try { await serviceRef.current.stop(); } catch {}
      serviceRef.current = null;
    }

    const correct = revealStates.filter(s => s === 'correct').length;
    const partial = revealStates.filter(s => s === 'partial').length;
    const missed = revealStates.filter(s => s === 'missed' || s === 'hidden').length;
    const accuracy = totalWords > 0 ? Math.round(((correct + partial * 0.5) / totalWords) * 100) : 0;

    const res: RevealResult = {
      accuracy,
      totalWords,
      correctWords: correct,
      partialWords: partial,
      missedWords: missed,
      duration: elapsedTime,
    };
    setResult(res);
    setPhase('complete');
    onComplete?.(res);
  }, [revealStates, totalWords, elapsedTime, onComplete]);

  const stopRecording = useCallback(() => {
    finishSession();
  }, [finishSession]);

  // ============ Reset ============

  const resetSession = useCallback(() => {
    if (tajweedData) {
      setRevealStates(new Array(tajweedData.allWords.length).fill('hidden'));
      setJustRevealedIdx(null);
      setFlashingMissed(new Set());
      setElapsedTime(0);
      setResult(null);
      setPhase('ready');
    }
  }, [tajweedData]);

  // ============ Cleanup ============

  useEffect(() => {
    return () => {
      if (serviceRef.current) { serviceRef.current.stop().catch(() => {}); }
      if (timerRef.current) { clearInterval(timerRef.current); }
    };
  }, []);

  // ============ Handle missed flash done ============

  const handleFlashDone = useCallback((idx: number) => {
    setFlashingMissed(prev => {
      const next = new Set(prev);
      next.delete(idx);
      return next;
    });
  }, []);

  // ============ Render ============

  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-night-950/90 backdrop-blur-xl border-b border-night-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => { if (phase === 'recording') stopRecording(); onBack(); }}
            className="flex items-center gap-1 text-night-400 hover:text-night-200 transition"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-sm font-semibold text-night-100">
              {surahMeta?.englishName || `Surah ${surahNumber}`}
            </h1>
            <p className="text-xs text-night-500">
              Reveal Mode · {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
            </p>
          </div>

          <div className="min-w-[60px] text-right">
            {phase === 'recording' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-end gap-0.5">
                <span className="text-sm font-mono text-gold-400">
                  {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
                </span>
                <span className="text-xs text-night-400">
                  {revealedCount}/{totalWords}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {(phase === 'recording' || phase === 'complete') && (
          <div className="h-1 bg-night-800">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Loading */}
        {phase === 'loading' && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-3" />
              <p className="text-night-400 text-sm">Loading verse text...</p>
            </motion.div>
          </div>
        )}

        {/* Error */}
        {phase === 'error' && (
          <div className="flex-1 flex items-center justify-center px-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-sm">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-night-100 mb-2">Something went wrong</h2>
              <p className="text-sm text-night-400 mb-6">{errorMessage}</p>
              <button onClick={onBack} className="px-6 py-2.5 rounded-xl bg-night-800 text-night-200 border border-night-700 font-medium transition hover:bg-night-700">
                Go Back
              </button>
            </motion.div>
          </div>
        )}

        {/* Ready / Recording */}
        {(phase === 'ready' || phase === 'recording') && tajweedData && (
          <>
            {/* Quran text area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 pb-48" style={{ scrollBehavior: 'smooth' }}>
              {/* Surah header */}
              <div className="pt-6 pb-4 text-center">
                <div className="inline-block relative px-8 py-3">
                  <div
                    className="absolute inset-0 border border-gold-500/20 rounded-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,162,39,0.05) 0%, transparent 50%, rgba(201,162,39,0.05) 100%)',
                    }}
                  />
                  <h2 className="font-quran text-quran-lg text-gold-400/90 relative" dir="rtl" lang="ar">
                    {surahMeta?.name}
                  </h2>
                </div>
              </div>

              {/* Instruction banner (ready phase) */}
              {phase === 'ready' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-md mx-auto mb-6 p-4 rounded-2xl bg-gradient-to-r from-gold-900/20 to-night-900 border border-gold-500/20"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-gold-300 mb-1">Reveal As You Recite</h3>
                      <p className="text-xs text-night-400 leading-relaxed">
                        The verse is hidden. Tap the mic and start reciting — each word will reveal as you say it correctly.
                        {difficulty === 'easy' && ' First letters are shown as hints.'}
                        {difficulty === 'hard' && ' No hints — pure memorization!'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Words display */}
              <div
                className="max-w-2xl mx-auto text-center leading-[3.2] font-quran"
                dir="rtl"
                lang="ar"
                style={{
                  fontSize: 'clamp(1.5rem, 4.5vw, 2.25rem)',
                  wordSpacing: '0.15em',
                }}
              >
                {(() => {
                  let globalIdx = 0;
                  return tajweedData.verses.map(verse => {
                    const elements: React.ReactNode[] = [];
                    for (const word of verse.words) {
                      const idx = globalIdx;
                      const state = revealStates[idx];
                      const isFlashing = flashingMissed.has(idx);

                      elements.push(
                        <span key={`w-${verse.verseKey}-${word.wordIndex}`} data-reveal-idx={idx} className="inline-block">
                          {state === 'hidden' && !isFlashing && (
                            <HiddenWordBlock word={word} difficulty={difficulty} />
                          )}
                          {state === 'hidden' && isFlashing && (
                            <MissedWordFlash word={word} onDone={() => handleFlashDone(idx)} />
                          )}
                          {(state === 'correct' || state === 'partial') && (
                            <RevealedWord
                              word={word}
                              state={state}
                              justRevealed={justRevealedIdx === idx}
                            />
                          )}
                          {state === 'missed' && !isFlashing && (
                            <HiddenWordBlock word={word} difficulty={difficulty} />
                          )}
                        </span>
                      );
                      elements.push(<span key={`sp-${verse.verseKey}-${word.wordIndex}`}> </span>);
                      globalIdx++;
                    }

                    // Ayah marker
                    const num = verse.verseNumber.toString().replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);
                    elements.push(
                      <span key={`marker-${verse.verseKey}`} className="inline-flex items-center justify-center mx-1 align-middle">
                        <span className="relative inline-flex items-center justify-center w-8 h-8 text-xs font-bold" style={{ color: '#c9a227' }}>
                          <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full" fill="none">
                            <circle cx="20" cy="20" r="17" stroke="#c9a227" strokeWidth="1.5" opacity="0.6" />
                          </svg>
                          <span className="relative z-10 font-arabic text-[11px]">{num}</span>
                        </span>
                      </span>
                    );

                    return <React.Fragment key={verse.verseKey}>{elements}</React.Fragment>;
                  });
                })()}
              </div>
            </div>

            {/* Bottom Controls */}
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-0 left-0 right-0 z-30"
              style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
            >
              <div className="max-w-md mx-auto px-4">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(22, 27, 34, 0.85)',
                    backdropFilter: 'blur(48px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(48px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <div className="p-4 flex items-center justify-center gap-6">
                    {phase === 'ready' && (
                      <>
                        <div className="mr-auto">
                          <p className="text-xs text-night-500">Tap to start reciting</p>
                          <p className="text-[10px] text-night-600 mt-0.5">{totalWords} words to reveal</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.92 }}
                          onClick={startRecording}
                          className="w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center shadow-glow-gold transition hover:bg-gold-400"
                        >
                          <Mic className="w-7 h-7 text-night-950" />
                        </motion.button>
                      </>
                    )}

                    {phase === 'recording' && (
                      <>
                        {/* Audio level visualizer around mic */}
                        <div className="relative w-24 h-24 flex items-center justify-center">
                          <AudioLevelRing service={serviceRef.current} />
                          <motion.button
                            whileTap={{ scale: 0.92 }}
                            onClick={stopRecording}
                            className="relative z-10 w-14 h-14 rounded-full bg-red-500/90 flex items-center justify-center shadow-lg transition hover:bg-red-400"
                          >
                            <Square className="w-5 h-5 text-white fill-white" />
                          </motion.button>
                        </div>

                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2 mb-1">
                            <motion.div
                              className="w-2 h-2 rounded-full bg-red-500"
                              animate={{ opacity: [1, 0.3, 1] }}
                              transition={{ duration: 1.2, repeat: Infinity }}
                            />
                            <span className="text-xs text-night-400">Listening...</span>
                            {activeProvider && (
                              <span className="text-[10px] text-night-500">
                                {activeProvider === 'tarteel' ? '🟢 Tarteel' : '🟡 Browser'}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gold-400/80">
                            {revealedCount} of {totalWords} revealed
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* Completion */}
        {phase === 'complete' && result && (
          <CelebrationOverlay
            result={result}
            onRetry={resetSession}
            onBack={onBack}
          />
        )}
      </div>
    </div>
  );
}
