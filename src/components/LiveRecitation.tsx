'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Square,
  RotateCcw,
  ChevronLeft,
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
import { fetchTajweedSurah, type TajweedSurahData } from '@/lib/quranTajweedApi';
import {
  RealtimeTajweedService,
  normalizeArabic,
  arabicSimilarity,
  checkBrowserSupport,
  type TranscribedWord,
} from '@/lib/realtimeTajweedService';
import { SURAH_METADATA } from '@/lib/surahMetadata';
import logger from '@/lib/logger';

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
}

type Phase = 'loading' | 'ready' | 'recording' | 'complete' | 'error';

// ============ Helpers ============

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ============ Audio Visualizer ============

function AudioVisualizer({ service }: { service: RealtimeTajweedService | null }) {
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
}: {
  stats: SessionStats;
  onRetry: () => void;
  onBack: () => void;
}) {
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
          className="flex-1 py-3 rounded-xl bg-gold-500/90 text-night-950 
            font-semibold transition hover:bg-gold-400 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
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
  const [errorMessage, setErrorMessage] = useState('');
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Refs
  const serviceRef = useRef<RealtimeTajweedService | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wordElementsRef = useRef<Map<number, HTMLElement>>(new Map());

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

        // Check browser support
        const support = checkBrowserSupport();
        if (!support.supported) {
          setErrorMessage(`Browser missing: ${support.missing.join(', ')}`);
          setPhase('error');
          return;
        }

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
        setCurrentWordIndex(-1);
        setPhase('ready');
      } catch (err) {
        if (cancelled) return;
        logger.error('Failed to load tajweed data:', err);
        setErrorMessage('Failed to load Quran text. Please check your connection.');
        setPhase('error');
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, [surahNumber, startAyah, effectiveEndAyah]);

  // ============ Word Alignment Logic ============

  const processTranscribedWords = useCallback(
    (transcribedWords: TranscribedWord[], isFinal: boolean) => {
      if (!tajweedData) return;

      const expected = tajweedData.plainWords;

      setWordStates((prev) => {
        const newStates = [...prev];
        let expectedIdx = 0;

        // Find where we left off (first 'hidden' word)
        for (let i = 0; i < newStates.length; i++) {
          if (newStates[i] === 'hidden' || newStates[i] === 'current') {
            expectedIdx = i;
            break;
          }
          if (i === newStates.length - 1) {
            expectedIdx = newStates.length;
          }
        }

        for (const trans of transcribedWords) {
          if (expectedIdx >= expected.length) break;

          // Look ahead up to 4 words for best match
          let bestMatch = -1;
          let bestSim = 0;

          for (
            let j = expectedIdx;
            j < Math.min(expectedIdx + 4, expected.length);
            j++
          ) {
            const sim = arabicSimilarity(trans.word, expected[j]);
            if (sim > bestSim && sim > 0.4) {
              bestMatch = j;
              bestSim = sim;
            }
          }

          if (bestMatch >= 0) {
            // Mark skipped words as missed
            for (let j = expectedIdx; j < bestMatch; j++) {
              if (newStates[j] === 'hidden' || newStates[j] === 'current') {
                newStates[j] = 'missed';
              }
            }

            // Mark the matched word
            if (isFinal) {
              newStates[bestMatch] = bestSim > 0.75 ? 'revealed' : 'error';
            } else {
              newStates[bestMatch] = 'current';
            }

            expectedIdx = bestMatch + 1;
          }
        }

        return newStates;
      });
    },
    [tajweedData]
  );

  // ============ Deepgram Integration ============

  const startRecording = useCallback(async () => {
    if (!tajweedData) return;

    try {
      // Get Deepgram API key
      const tokenRes = await fetch('/api/deepgram/token');
      const tokenData = await tokenRes.json();

      if (!tokenData.configured || !tokenData.apiKey) {
        setErrorMessage(
          'Deepgram is not configured. Please add DEEPGRAM_API_KEY to your environment.'
        );
        setPhase('error');
        return;
      }

      // Build expected text from tajweed data
      const expectedText = tajweedData.plainWords.join(' ');

      // Create service
      const service = new RealtimeTajweedService({
        apiKey: tokenData.apiKey,
        expectedText,
      });

      serviceRef.current = service;

      // Handle state changes from the service
      service.onStateChange((state) => {
        if (state.words.length > 0) {
          processTranscribedWords(state.words, true);
        }

        // Update current word index
        const lastMatched = state.alignments
          .filter(
            (a) => a.status === 'matched' || a.status === 'partial' || a.status === 'current'
          )
          .map((a) => a.expectedIndex)
          .filter((i) => i >= 0);

        if (lastMatched.length > 0) {
          const maxIdx = Math.max(...lastMatched);
          setCurrentWordIndex(maxIdx);
        }
      });

      // Handle individual word events
      service.onWord((index, word) => {
        setCurrentWordIndex(index);

        setWordStates((prev) => {
          const newStates = [...prev];
          if (index >= 0 && index < newStates.length) {
            if (newStates[index] === 'hidden' || newStates[index] === 'current') {
              const sim = arabicSimilarity(
                word.word,
                tajweedData.plainWords[index] || ''
              );
              newStates[index] = sim > 0.75 ? 'revealed' : 'error';
            }
          }
          return newStates;
        });
      });

      service.onError((error) => {
        logger.error('Deepgram error:', error);
      });

      // Start
      await service.start();
      setPhase('recording');
      setElapsedTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      logger.error('Failed to start recording:', err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Failed to start recording. Please allow microphone access.'
      );
      setPhase('error');
    }
  }, [tajweedData, processTranscribedWords]);

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
        const accuracy =
          totalWords > 0
            ? Math.round((matchedWords / totalWords) * 100)
            : 0;

        setStats({
          accuracy,
          totalWords,
          matchedWords,
          missedWords,
          errorWords,
          duration: elapsedTime,
        });

        return finalStates;
      });

      setPhase('complete');
    } catch (err) {
      logger.error('Error stopping recording:', err);
      setPhase('complete');
    }
  }, [tajweedData, elapsedTime]);

  // ============ Reset ============

  const resetSession = useCallback(() => {
    if (tajweedData) {
      setWordStates(new Array(tajweedData.allWords.length).fill('hidden'));
      setCurrentWordIndex(-1);
      setElapsedTime(0);
      setStats(null);
      setPhase('ready');
    }
  }, [tajweedData]);

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
    <div className="min-h-screen bg-night-950 flex flex-col">
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

          {/* Timer */}
          <div className="min-w-[60px] text-right">
            {phase === 'recording' && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-mono text-gold-400"
              >
                {formatTime(elapsedTime)}
              </motion.span>
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

                {/* Tajweed Text */}
                <div className="max-w-2xl mx-auto">
                  <TajweedText
                    verses={versesForDisplay}
                    wordStates={wordStates}
                    currentWordIndex={currentWordIndex}
                    showAyahMarkers={true}
                  />
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
                            {/* Hint text */}
                            <p className="text-xs text-night-500 mr-auto">
                              Tap to start reciting
                            </p>

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
