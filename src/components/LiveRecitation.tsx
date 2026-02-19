'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Square,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  Target,
  Trophy,
  Volume2,
} from 'lucide-react';
import TajweedText, { type WordState } from '@/components/TajweedText';
import WordByWordInline from '@/components/WordByWordInline';
import { fetchTajweedSurah, type TajweedSurahData } from '@/lib/quranTajweedApi';
import {
  TarteelService,
  checkBrowserSupport,
} from '@/lib/tarteelService';
import { WebSpeechService } from '@/lib/webSpeechService';
import { SURAH_METADATA } from '@/lib/surahMetadata';
import TajweedReport from '@/components/TajweedReport';
import { detectTajweedRules } from '@/lib/realtimeTajweedService';

// ============ Types ============

interface LiveRecitationProps {
  surahNumber: number;
  startAyah?: number;
  endAyah?: number;
  onBack: () => void;
}

interface SessionStats {
  accuracy: number;
  totalWords: number;
  matchedWords: number;
  missedWords: number;
  errorWords: number;
  duration: number; // seconds
  practiceWords: Array<{ index: number; expected: string; confidence: number }>;
  tajweedRules?: ReturnType<typeof detectTajweedRules>;
  allWords?: string[];
}

type Phase = 'loading' | 'ready' | 'recording' | 'complete' | 'error';

// ============ Helpers ============

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ============ Audio Visualizer ============

function AudioVisualizer({ service }: { service: TarteelService | WebSpeechService | null }) {
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

      // Draw concentric circles based on audio level
      const bars = 24;
      const centerX = w / 2;
      const centerY = h / 2;
      const maxRadius = Math.min(w, h) / 2 - 4;

      for (let i = 0; i < bars; i++) {
        const angle = (i / bars) * Math.PI * 2;
        const barLevel = level * (0.5 + 0.5 * Math.sin(angle * 3 + Date.now() / 200));
        const barHeight = 4 + barLevel * maxRadius * 0.6;
        const innerR = maxRadius * 0.35;

        const x1 = centerX + Math.cos(angle) * innerR;
        const y1 = centerY + Math.sin(angle) * innerR;
        const x2 = centerX + Math.cos(angle) * (innerR + barHeight);
        const y2 = centerY + Math.sin(angle) * (innerR + barHeight);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(201, 162, 39, ${0.3 + barLevel * 0.7})`;
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [service]);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={80}
      className="mx-auto"
    />
  );
}

// ============ Session Summary ============

function SessionSummary({
  stats,
  onRetry,
  onBack,
  onNextAyah,
  surahNumber,
  startAyah,
  endAyah,
  wordConfidences,
}: {
  stats: SessionStats;
  onRetry: () => void;
  onBack: () => void;
  onNextAyah?: () => void;
  surahNumber?: number;
  startAyah?: number;
  endAyah?: number;
  wordConfidences?: number[];
}) {
  const [showWordByWord, setShowWordByWord] = useState(false);
  const grade = useMemo(() => {
    if (stats.accuracy >= 95) return { label: 'Excellent!', emoji: '🌟', color: 'text-gold-400' };
    if (stats.accuracy >= 85) return { label: 'Great Job!', emoji: '✨', color: 'text-sage-400' };
    if (stats.accuracy >= 70) return { label: 'Good Effort', emoji: '💪', color: 'text-midnight-400' };
    return { label: 'Keep Practicing', emoji: '📖', color: 'text-night-300' };
  }, [stats.accuracy]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4 py-8 max-w-md mx-auto"
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50 text-center">
          <Target className="w-5 h-5 mx-auto mb-2 text-gold-500" />
          <div className="text-2xl font-bold text-night-100">{stats.accuracy}%</div>
          <div className="text-xs text-night-400">Accuracy</div>
        </div>
        <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-midnight-400" />
          <div className="text-2xl font-bold text-night-100">{formatTime(stats.duration)}</div>
          <div className="text-xs text-night-400">Duration</div>
        </div>
        <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50 text-center">
          <CheckCircle2 className="w-5 h-5 mx-auto mb-2 text-sage-500" />
          <div className="text-2xl font-bold text-night-100">
            {stats.matchedWords}/{stats.totalWords}
          </div>
          <div className="text-xs text-night-400">Words Matched</div>
        </div>
        <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50 text-center">
          <XCircle className="w-5 h-5 mx-auto mb-2 text-red-400" />
          <div className="text-2xl font-bold text-night-100">{stats.errorWords + stats.missedWords}</div>
          <div className="text-xs text-night-400">Mistakes</div>
        </div>
      </div>

      {/* Practice Words */}
      {stats.practiceWords.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-night-400 uppercase tracking-wider mb-3">
            Words to Practice
          </h3>
          <div className="bg-night-900/60 rounded-xl p-4 border border-night-800/50">
            <div className="flex flex-wrap gap-2" dir="rtl">
              {stats.practiceWords.map((pw) => (
                <span
                  key={pw.index}
                  className="inline-block px-3 py-1.5 rounded-lg text-sm font-arabic border"
                  style={{
                    color: pw.confidence < 0.5 ? '#ef4444' : '#facc15',
                    borderColor:
                      pw.confidence < 0.5
                        ? 'rgba(239, 68, 68, 0.3)'
                        : 'rgba(250, 204, 21, 0.3)',
                    backgroundColor:
                      pw.confidence < 0.5
                        ? 'rgba(239, 68, 68, 0.1)'
                        : 'rgba(250, 204, 21, 0.08)',
                  }}
                >
                  {pw.expected}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Word-by-Word Breakdown */}
      {surahNumber && startAyah && (
        <div className="mb-6">
          <button
            onClick={() => setShowWordByWord(!showWordByWord)}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-night-900/60 border border-night-800/50 hover:bg-night-800/60 transition-colors"
          >
            <span className="text-sm font-medium text-night-300">
              📝 Word-by-Word Breakdown
            </span>
            <ChevronRight className={`w-4 h-4 text-night-500 transition-transform ${showWordByWord ? 'rotate-90' : ''}`} />
          </button>
          <AnimatePresence>
            {showWordByWord && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-3 space-y-4">
                  {Array.from({ length: (endAyah || startAyah) - startAyah + 1 }, (_, i) => startAyah + i).map(ayahNum => (
                    <div key={ayahNum} className="bg-night-900/40 rounded-xl p-3 border border-night-800/30">
                      <p className="text-xs text-night-500 mb-2">Ayah {ayahNum}</p>
                      <WordByWordInline
                        surah={surahNumber}
                        ayah={ayahNum}
                        showTransliteration={true}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Tajweed Report */}
      {stats.tajweedRules && stats.tajweedRules.length > 0 && stats.allWords && (
        <TajweedReport
          rulesDetected={stats.tajweedRules}
          alignments={[]}
          words={stats.allWords}
          accuracy={stats.accuracy}
          duration={stats.duration}
        />
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-xl bg-night-800 text-night-300 
            border border-night-700 font-medium transition hover:bg-night-700"
        >
          Back
        </button>
        <button
          onClick={onRetry}
          className="flex-1 py-3 rounded-xl bg-night-800 text-night-300 
            border border-night-700 font-medium transition hover:bg-night-700
            flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Retry
        </button>
        {onNextAyah && (
          <button
            onClick={onNextAyah}
            className="flex-1 py-3 rounded-xl bg-gold-500/90 text-night-950 
              font-semibold transition hover:bg-gold-400 flex items-center justify-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ============ Bismillah Header ============

function BismillahHeader({ surahNumber }: { surahNumber: number }) {
  // No bismillah for Al-Fatiha (it's part of the surah) or At-Tawba
  if (surahNumber === 1 || surahNumber === 9) return null;

  return (
    <div className="text-center py-4 mb-2">
      <span
        className="font-quran text-night-300/70 text-quran-md"
        dir="rtl"
        lang="ar"
      >
        بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
      </span>
    </div>
  );
}

// ============ Main LiveRecitation Component ============

export default function LiveRecitation({
  surahNumber,
  startAyah = 1,
  endAyah,
  onBack,
}: LiveRecitationProps) {
  // Core state
  const [phase, setPhase] = useState<Phase>('loading');
  const [tajweedData, setTajweedData] = useState<TajweedSurahData | null>(null);
  const [wordStates, setWordStates] = useState<WordState[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [wordConfidences, setWordConfidences] = useState<number[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [wordByWordView, setWordByWordView] = useState(false);
  const [activeProvider, setActiveProvider] = useState<'tarteel' | 'browser' | null>(null);

  // Refs
  const serviceRef = useRef<TarteelService | WebSpeechService | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wordElementsRef = useRef<Map<number, HTMLElement>>(new Map());

  const [previousBest, setPreviousBest] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  // Surah metadata
  const surahMeta = useMemo(
    () => SURAH_METADATA.find((s) => s.number === surahNumber),
    [surahNumber]
  );

  const effectiveEndAyah = endAyah || surahMeta?.numberOfAyahs;

  // ============ Load Tajweed Data ============

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setPhase('loading');

        // Fetch tajweed data from Quran.com
        const data = await fetchTajweedSurah(surahNumber, startAyah, effectiveEndAyah);

        if (cancelled) return;

        if (data.allWords.length === 0) {
          setErrorMessage('No text found for the selected range.');
          setPhase('error');
          return;
        }

        setTajweedData(data);
        setWordStates(new Array(data.allWords.length).fill('hidden'));
        setWordConfidences(new Array(data.allWords.length).fill(0));
        setCurrentWordIndex(-1);
        setPhase('ready');
      } catch (err) {
        if (cancelled) return;
        console.error('Failed to load tajweed data:', err);
        setErrorMessage('Failed to load Quran text. Please check your connection.');
        setPhase('error');
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [surahNumber, startAyah, effectiveEndAyah]);

  // ============ Tarteel Integration ============

  const handleStateChange = useCallback((state: { alignments: Array<{ status: string; confidence: number }>; currentWordIndex: number }) => {
    setWordStates((prev) => {
      const newStates = [...prev];
      state.alignments.forEach((alignment, idx) => {
        if (idx >= newStates.length) return;
        if (alignment.status === 'matched') {
          newStates[idx] = 'revealed';
        } else if (alignment.status === 'partial') {
          newStates[idx] = 'revealed';
        } else if (alignment.status === 'missed') {
          newStates[idx] = 'missed';
        }
      });
      return newStates;
    });

    setWordConfidences((prev) => {
      const next = [...prev];
      state.alignments.forEach((alignment, idx) => {
        if (idx < next.length && alignment.confidence > 0) {
          next[idx] = alignment.confidence;
        }
      });
      return next;
    });

    if (state.currentWordIndex >= 0) {
      setCurrentWordIndex(state.currentWordIndex);
    }
  }, []);

  const handleWord = useCallback((index: number, _word: string, confidence: number) => {
    setCurrentWordIndex(index);

    setWordConfidences((prev) => {
      const next = [...prev];
      if (index >= 0 && index < next.length) {
        next[index] = confidence;
      }
      return next;
    });

    setWordStates((prev) => {
      const newStates = [...prev];
      if (index >= 0 && index < newStates.length) {
        if (newStates[index] === 'hidden' || newStates[index] === 'current') {
          newStates[index] = 'revealed';
        }
      }
      return newStates;
    });
  }, []);

  const startRecording = useCallback(async () => {
    if (!tajweedData) return;

    const expectedText = tajweedData.plainWords.join(' ');

    // Try Tarteel first, fall back to Web Speech API
    let useTarteel = false;
    try {
      console.log('[Sheikh Hifz] Checking Tarteel health at /api/tarteel...');
      const checkRes = await fetch('/api/tarteel', { signal: AbortSignal.timeout(3000) });
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        useTarteel = checkData.configured === true;
        console.log('[Sheikh Hifz] Health check result:', checkData, '→ useTarteel:', useTarteel);
      } else {
        console.warn('[Sheikh Hifz] Health check failed with status:', checkRes.status);
      }
    } catch (e) {
      console.warn('[Sheikh Hifz] Health check error, falling back to lite:', e);
      useTarteel = false;
    }

    try {
      if (useTarteel) {
        console.log('[Sheikh Hifz] Using Tarteel (full) provider');
        const service = new TarteelService({
          expectedText,
          chunkIntervalMs: 2500,
          onStateChange: handleStateChange,
          onWord: handleWord,
          onError: (error) => console.error('Tarteel error:', error),
        });
        serviceRef.current = service;
        await service.start();
        setActiveProvider('tarteel');
      } else {
        console.log('[Sheikh Hifz] Using WebSpeech (lite) provider');
        // Fallback: Web Speech API
        if (!WebSpeechService.isSupported()) {
          setErrorMessage(
            'Speech recognition is not supported in this browser. Please use Chrome or Edge.'
          );
          setPhase('error');
          return;
        }
        const service = new WebSpeechService({
          expectedText,
          onStateChange: handleStateChange,
          onWord: handleWord,
          onError: (error) => console.error('WebSpeech error:', error),
        });
        serviceRef.current = service;
        await service.start();
        setActiveProvider('browser');
      }

      setPhase('recording');
      setElapsedTime(0);
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start recording:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to start recording. Please allow microphone access.'
      );
      setPhase('error');
    }
  }, [tajweedData, handleStateChange, handleWord]);

  const stopRecording = useCallback(async () => {
    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!serviceRef.current || !tajweedData) {
      setPhase('ready');
      return;
    }

    try {
      const result = await serviceRef.current.stop();
      serviceRef.current = null;

      // Calculate stats from our word states
      const totalWords = tajweedData.allWords.length;

      setWordStates((prev) => {
        const finalStates = [...prev];
        const matchedWords = finalStates.filter((s) => s === 'revealed').length;
        const errorWords = finalStates.filter((s) => s === 'error').length;
        const missedWords = finalStates.filter(
          (s) => s === 'missed' || s === 'hidden' || s === 'current'
        ).length;

        // Count high-confidence words for accuracy
        const goodWords = wordConfidences.filter(
          (c, i) => finalStates[i] === 'revealed' && c > 0.8
        ).length;
        const accuracy =
          totalWords > 0
            ? Math.round((goodWords / totalWords) * 100)
            : 0;

        // Collect words that need practice (low confidence or missed)
        const practiceWords: SessionStats['practiceWords'] = [];
        finalStates.forEach((s, i) => {
          if (s === 'missed' || (s === 'revealed' && wordConfidences[i] <= 0.8)) {
            practiceWords.push({
              index: i,
              expected: tajweedData!.plainWords[i] || '',
              confidence: wordConfidences[i],
            });
          }
        });

        // Detect tajweed rules from the expected text
        const fullText = tajweedData?.plainWords.join(' ') || '';
        const tajweedRules = detectTajweedRules(fullText);

        setStats({
          accuracy,
          totalWords,
          matchedWords,
          missedWords,
          errorWords,
          duration: elapsedTime,
          practiceWords,
          tajweedRules,
          allWords: tajweedData?.plainWords || [],
        });

        return finalStates;
      });

      setPhase('complete');
    } catch (err) {
      console.error('Error stopping recording:', err);
      setPhase('complete');
    }
  }, [tajweedData, elapsedTime]);

  // ============ Reset ============

  const resetSession = useCallback(() => {
    if (tajweedData) {
      setWordStates(new Array(tajweedData.allWords.length).fill('hidden'));
      setWordConfidences(new Array(tajweedData.allWords.length).fill(0));
      setCurrentWordIndex(-1);
      setElapsedTime(0);
      setStats(null);
      setSaved(false);
      setPhase('ready');
    }
  }, [tajweedData]);

  // ============ Fetch Previous Best ============

  useEffect(() => {
    async function fetchBest() {
      try {
        const res = await fetch(`/api/recitation?surah=${surahNumber}&limit=100`);
        if (res.ok) {
          const data = await res.json();
          const best = data.bestScores?.find((b: { surahNumber: number }) => b.surahNumber === surahNumber);
          if (best) setPreviousBest(best.bestAccuracy);
        }
      } catch {
        // Check localStorage for guests
        try {
          const stored = JSON.parse(localStorage.getItem('recitation-history') || '[]');
          const surahSessions = stored.filter((s: { surahNumber: number }) => s.surahNumber === surahNumber);
          if (surahSessions.length > 0) {
            const best = Math.max(...surahSessions.map((s: { overallAccuracy: number }) => s.overallAccuracy));
            setPreviousBest(best);
          }
        } catch { /* ignore */ }
      }
    }
    fetchBest();
  }, [surahNumber]);

  // ============ Auto-Save Session ============

  useEffect(() => {
    if (phase !== 'complete' || !stats || saved) return;
    setSaved(true);

    const sessionData = {
      surahNumber,
      startAyah,
      endAyah: effectiveEndAyah,
      overallAccuracy: stats.accuracy,
      duration: stats.duration,
      totalWords: stats.totalWords,
      matchedWords: stats.matchedWords,
      words: tajweedData?.allWords.map((w, i) => ({
        wordIndex: i,
        expectedWord: w.text,
        transcribedWord: null,
        confidence: wordConfidences[i] || 0,
        isCorrect: wordStates[i] === 'revealed',
      })) || [],
    };

    // Save to API
    fetch('/api/recitation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessionData),
    }).catch(() => {
      // If API fails (guest user), save to localStorage
      try {
        const stored = JSON.parse(localStorage.getItem('recitation-history') || '[]');
        stored.unshift({ ...sessionData, createdAt: new Date().toISOString() });
        // Keep last 50 local sessions
        localStorage.setItem('recitation-history', JSON.stringify(stored.slice(0, 50)));
      } catch { /* ignore */ }
    });
  }, [phase, stats, saved, surahNumber, startAyah, effectiveEndAyah, tajweedData, wordStates, wordConfidences]);

  // ============ Cleanup ============

  useEffect(() => {
    return () => {
      if (serviceRef.current) {
        serviceRef.current.stop().catch(() => {});
        serviceRef.current = null;
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // ============ Auto-scroll to current word ============

  useEffect(() => {
    if (currentWordIndex < 0 || !scrollContainerRef.current) return;

    // Find the word element by querying the data attribute
    const container = scrollContainerRef.current;
    const wordEl = container.querySelector(
      `[data-word-index="${currentWordIndex}"]`
    );

    if (wordEl) {
      wordEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [currentWordIndex]);

  // ============ Verse data for TajweedText ============

  const versesForDisplay = useMemo(() => {
    if (!tajweedData) return [];
    return tajweedData.verses.map((v) => ({
      verseKey: v.verseKey,
      verseNumber: v.verseNumber,
      words: v.words,
    }));
  }, [tajweedData]);

  // ============ Running Accuracy ============

  const runningAccuracy = useMemo(() => {
    if (!tajweedData || tajweedData.allWords.length === 0) return 0;
    const processed = wordStates.filter((s) => s === 'revealed' || s === 'missed').length;
    if (processed === 0) return 100;
    const goodWords = wordConfidences.filter(
      (c, i) => wordStates[i] === 'revealed' && c > 0.8
    ).length;
    return Math.round((goodWords / processed) * 100);
  }, [wordStates, wordConfidences, tajweedData]);

  // ============ Progress bar ============

  const progress = useMemo(() => {
    if (!tajweedData || tajweedData.allWords.length === 0) return 0;
    const revealed = wordStates.filter(
      (s) => s === 'revealed' || s === 'error' || s === 'missed'
    ).length;
    return Math.round((revealed / tajweedData.allWords.length) * 100);
  }, [wordStates, tajweedData]);

  // ============ Render ============

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-night-950/90 backdrop-blur-xl border-b border-night-800/50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => {
              if (phase === 'recording') {
                stopRecording();
              }
              onBack();
            }}
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
              {startAyah === 1 && !endAyah
                ? 'Full Surah'
                : `Ayah ${startAyah}${effectiveEndAyah ? `–${effectiveEndAyah}` : ''}`}
            </p>
          </div>

          {/* Timer & Accuracy */}
          <div className="min-w-[60px] text-right">
            {phase === 'recording' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-end gap-0.5"
              >
                <span className="text-sm font-mono text-gold-400">
                  {formatTime(elapsedTime)}
                </span>
                {currentWordIndex >= 0 && (
                  <span
                    className={`text-xs font-medium ${
                      runningAccuracy >= 80
                        ? 'text-green-400'
                        : runningAccuracy >= 50
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {runningAccuracy}%
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {(phase === 'recording' || phase === 'complete') && (
          <div className="h-0.5 bg-night-800">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Loading State */}
        {phase === 'loading' && (
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <Loader2 className="w-8 h-8 animate-spin text-gold-500 mx-auto mb-3" />
              <p className="text-night-400 text-sm">Loading tajweed text...</p>
            </motion.div>
          </div>
        )}

        {/* Error State */}
        {phase === 'error' && (
          <div className="flex-1 flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-sm"
            >
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-night-100 mb-2">
                Something went wrong
              </h2>
              <p className="text-sm text-night-400 mb-6">{errorMessage}</p>
              <button
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-night-800 text-night-200 
                  border border-night-700 font-medium transition hover:bg-night-700"
              >
                Go Back
              </button>
            </motion.div>
          </div>
        )}

        {/* Ready / Recording / Complete States */}
        {(phase === 'ready' || phase === 'recording' || phase === 'complete') &&
          tajweedData && (
            <>
              {/* Scrollable Quran text area */}
              <div
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto px-4 sm:px-6 pb-48"
                style={{
                  scrollBehavior: 'smooth',
                }}
              >
                {/* Surah Header */}
                <div className="pt-6 pb-2">
                  <div className="text-center mb-4">
                    {/* Decorative surah name plate */}
                    <div className="inline-block relative px-8 py-3">
                      {/* Decorative frame */}
                      <div
                        className="absolute inset-0 border border-gold-500/20 rounded-2xl"
                        style={{
                          background:
                            'linear-gradient(135deg, rgba(201,162,39,0.05) 0%, transparent 50%, rgba(201,162,39,0.05) 100%)',
                        }}
                      />
                      <h2
                        className="font-quran text-quran-lg text-gold-400/90 relative"
                        dir="rtl"
                        lang="ar"
                      >
                        {surahMeta?.name}
                      </h2>
                    </div>
                  </div>

                  <BismillahHeader surahNumber={surahNumber} />
                </div>

                {/* Word-by-Word Toggle */}
                <div className="max-w-2xl mx-auto flex justify-end mb-2">
                  <button
                    onClick={() => setWordByWordView(!wordByWordView)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                      wordByWordView
                        ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                        : 'bg-night-800/50 text-night-400 border-night-700/30 hover:bg-night-800'
                    }`}
                  >
                    {wordByWordView ? '📝 Word-by-Word' : '📖 Tajweed View'}
                  </button>
                </div>

                {/* Tajweed Text or Word-by-Word */}
                <div className="max-w-2xl mx-auto">
                  {wordByWordView ? (
                    <div className="space-y-4">
                      {Array.from(
                        { length: (effectiveEndAyah || startAyah) - startAyah + 1 },
                        (_, i) => startAyah + i
                      ).map(ayahNum => (
                        <div key={ayahNum} className="bg-night-900/30 rounded-xl p-3 border border-night-800/30">
                          <WordByWordInline
                            surah={surahNumber}
                            ayah={ayahNum}
                            showTransliteration={true}
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <TajweedText
                      verses={versesForDisplay}
                      wordStates={wordStates}
                      wordConfidences={wordConfidences}
                      currentWordIndex={currentWordIndex}
                      showAyahMarkers={true}
                    />
                  )}
                </div>
              </div>

              {/* Bottom Control Panel */}
              {phase !== 'complete' && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  className="fixed bottom-0 left-0 right-0 z-30"
                  style={{
                    paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
                  }}
                >
                  <div className="max-w-md mx-auto px-4">
                    <div
                      className="rounded-2xl overflow-hidden"
                      style={{
                        background: 'rgba(22, 27, 34, 0.85)',
                        backdropFilter: 'blur(48px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(48px) saturate(180%)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        boxShadow:
                          '0 -4px 30px rgba(0, 0, 0, 0.3), 0 4px 20px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      <div className="p-4 flex items-center justify-center gap-6">
                        {phase === 'ready' && (
                          <>
                            {/* Previous best & hint */}
                            <div className="mr-auto">
                              {previousBest !== null && (
                                <p className="text-xs text-gold-400/80 mb-0.5">
                                  Previous best: {previousBest}%
                                </p>
                              )}
                              <p className="text-xs text-night-500">
                                Tap to start reciting
                              </p>
                            </div>

                            {/* Start button */}
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={startRecording}
                              className="w-14 h-14 rounded-full bg-gold-500 flex items-center 
                                justify-center shadow-glow-gold transition hover:bg-gold-400"
                            >
                              <Mic className="w-6 h-6 text-night-950" />
                            </motion.button>
                          </>
                        )}

                        {phase === 'recording' && (
                          <>
                            {/* Audio visualizer */}
                            <AudioVisualizer service={serviceRef.current} />

                            {/* Recording indicator */}
                            <div className="flex items-center gap-2 mr-auto">
                              <motion.div
                                className="w-2 h-2 rounded-full bg-red-500"
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{
                                  duration: 1.2,
                                  repeat: Infinity,
                                }}
                              />
                              <span className="text-xs text-night-400">
                                Listening...
                              </span>
                              {activeProvider && (
                                <span className="text-[10px] text-night-500 flex items-center gap-1">
                                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${activeProvider === 'tarteel' ? 'bg-gold-400' : 'bg-night-500'}`} />
                                  {activeProvider === 'tarteel' ? 'Sheikh Hifz' : 'Sheikh Hifz (lite)'}
                                </span>
                              )}
                            </div>

                            {/* Stop button */}
                            <motion.button
                              whileTap={{ scale: 0.92 }}
                              onClick={stopRecording}
                              className="w-14 h-14 rounded-full bg-red-500/90 flex items-center 
                                justify-center shadow-lg transition hover:bg-red-400"
                            >
                              <Square className="w-5 h-5 text-white fill-white" />
                            </motion.button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Session Summary Overlay */}
              {phase === 'complete' && stats && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 z-40 bg-night-950/95 backdrop-blur-lg overflow-y-auto"
                >
                  <div className="min-h-screen flex items-center justify-center">
                    <SessionSummary
                      stats={stats}
                      onRetry={resetSession}
                      onBack={onBack}
                      surahNumber={surahNumber}
                      startAyah={startAyah}
                      endAyah={effectiveEndAyah}
                      wordConfidences={wordConfidences}
                    />
                  </div>
                </motion.div>
              )}
            </>
          )}
      </div>
    </div>
  );
}
