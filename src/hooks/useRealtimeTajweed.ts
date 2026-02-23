/**
 * React Hook for Real-time Tajweed Practice
 *
 * Provider priority (unified Tarteel Whisper backend):
 *   1. TarteelService  — Modal-hosted Tarteel Whisper (primary, Quran-optimized)
 *   2. WebSpeechService — Browser built-in Arabic speech recognition (fallback)
 *
 * Deepgram (the original backend) is kept as a tertiary option when the Deepgram
 * token endpoint is configured, but Tarteel is always tried first.
 *
 * Usage:
 * ```tsx
 * function TajweedPractice({ ayahText }) {
 *   const {
 *     state, audioLevel, start, stop, isSupported, isConfigured, reset,
 *   } = useRealtimeTajweed({ expectedText: ayahText });
 *
 *   return (
 *     <div>
 *       {state.alignments.map((a, i) => (
 *         <span key={i} className={a.status === 'current' ? 'highlight' : ''}>
 *           {a.expectedWord}
 *         </span>
 *       ))}
 *       <button onClick={start}>Start</button>
 *       <button onClick={stop}>Stop</button>
 *     </div>
 *   );
 * }
 * ```
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  RealtimeTajweedService,
  RealtimeState,
  RealtimeSessionResult,
  checkBrowserSupport,
  detectTajweedRules,
  TranscribedWord,
} from '@/lib/realtimeTajweedService';
import { TarteelService, TarteelState } from '@/lib/tarteelService';
import { WebSpeechService, WebSpeechState } from '@/lib/webSpeechService';

// ============================================
// Types
// ============================================

type ActiveProvider = 'tarteel' | 'webspeech' | 'deepgram' | null;

interface UseRealtimeTajweedOptions {
  expectedText: string;
  onWord?: (index: number, word: TranscribedWord) => void;
  onComplete?: (result: RealtimeSessionResult) => void;
  onError?: (error: string) => void;
}

interface UseRealtimeTajweedReturn {
  /** Current service state */
  state: RealtimeState;
  /** Audio level 0-1 for visualization */
  audioLevel: number;
  /** Start real-time transcription */
  start: () => Promise<void>;
  /** Stop and get results */
  stop: () => Promise<RealtimeSessionResult | null>;
  /** Browser support info */
  isSupported: boolean;
  /** Missing browser features */
  missingFeatures: string[];
  /**
   * Whether ANY speech recognition provider is available.
   * True as long as Tarteel, WebSpeech, or Deepgram is reachable.
   */
  isConfigured: boolean;
  /** Reset state for new session */
  reset: () => void;
}

// ============================================
// State helpers
// ============================================

function buildInitialAlignments(text: string): RealtimeState['alignments'] {
  const words = text
    .replace(/[\u06DD\u0660-\u0669۰-۹]+/g, '')
    .split(/\s+/)
    .filter(w => w.length > 0);

  return words.map((word, i) => ({
    expectedIndex: i,
    expectedWord: word,
    status: 'pending' as const,
    confidence: 0,
  }));
}

function buildInitialState(expectedText: string): RealtimeState {
  return {
    isConnected: false,
    isRecording: false,
    currentWordIndex: -1,
    transcription: '',
    words: [],
    alignments: buildInitialAlignments(expectedText),
    error: null,
  };
}

/** Map TarteelState (or WebSpeechState — same shape) → RealtimeState */
function mapToRealtimeState(
  src: TarteelState | WebSpeechState,
  connected: boolean
): RealtimeState {
  return {
    isConnected: connected,
    isRecording: src.isRecording,
    currentWordIndex: src.currentWordIndex,
    transcription: src.transcription,
    words: [], // TarteelService works on chunks, word-level timing not available
    alignments: src.alignments,
    error: src.error,
  };
}

// ============================================
// Hook
// ============================================

export function useRealtimeTajweed(
  options: UseRealtimeTajweedOptions
): UseRealtimeTajweedReturn {
  const { expectedText, onWord, onComplete, onError } = options;

  // Initialise with alignments immediately (avoids blank screen on first render)
  const [state, setState] = useState<RealtimeState>(() => buildInitialState(expectedText));
  const [audioLevel, setAudioLevel] = useState(0);
  const [browserSupport] = useState(() => checkBrowserSupport());

  /**
   * isConfigured defaults to `true` (optimistic) — the provider check is async.
   * It is only flipped to `false` when no provider at all is reachable.
   */
  const [isConfigured, setIsConfigured] = useState(true);
  const [activeProvider, setActiveProvider] = useState<ActiveProvider>(null);

  // Internal refs — provider-agnostic union type
  const serviceRef = useRef<
    TarteelService | WebSpeechService | RealtimeTajweedService | null
  >(null);
  const audioLevelIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // Provider availability check (on mount)
  // ============================================

  useEffect(() => {
    let cancelled = false;

    async function detectProvider() {
      // 1. Tarteel Whisper (primary — Quran-optimised)
      //    The /api/tarteel GET endpoint returns { configured: true } when the
      //    Modal service is warm, or quickly after a cold-start attempt.
      try {
        const res = await fetch('/api/tarteel', {
          signal: AbortSignal.timeout(8000),
        });
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.configured === true) {
            console.log('[useRealtimeTajweed] ✅ Tarteel Whisper available (primary)');
            setActiveProvider('tarteel');
            setIsConfigured(true);
            return;
          }
        }
      } catch {
        // Network/timeout — fall through to WebSpeech
      }

      if (cancelled) return;

      // 2. Browser Web Speech API (fallback — no server needed)
      if (typeof window !== 'undefined' && WebSpeechService.isSupported()) {
        console.log('[useRealtimeTajweed] ✅ WebSpeech API available (fallback)');
        setActiveProvider('webspeech');
        setIsConfigured(true);
        return;
      }

      if (cancelled) return;

      // 3. Deepgram token (legacy path — kept for backward compatibility)
      try {
        const res = await fetch('/api/deepgram/token');
        if (!cancelled && res.ok) {
          const data = await res.json();
          if (data.configured && data.apiKey) {
            console.log('[useRealtimeTajweed] ✅ Deepgram available (legacy fallback)');
            setActiveProvider('deepgram');
            setIsConfigured(true);
            // Store the key for use in start()
            deepgramKeyRef.current = data.apiKey as string;
            return;
          }
        }
      } catch {
        // Deepgram not configured
      }

      if (!cancelled) {
        console.warn('[useRealtimeTajweed] ⚠️ No speech recognition provider available');
        setIsConfigured(false);
      }
    }

    detectProvider();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deepgram API key storage (only used if Deepgram path is active)
  const deepgramKeyRef = useRef<string | null>(null);

  // Re-build initial state when expected text changes
  useEffect(() => {
    setState(buildInitialState(expectedText));
  }, [expectedText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioLevelIntervalRef.current) {
        clearInterval(audioLevelIntervalRef.current);
        audioLevelIntervalRef.current = null;
      }
      if (serviceRef.current) {
        serviceRef.current.stop().catch(console.error);
        serviceRef.current = null;
      }
    };
  }, []);

  // ============================================
  // start()
  // ============================================

  const start = useCallback(async () => {
    if (!isConfigured) {
      onError?.('Speech recognition service not configured. Please try standard mode.');
      return;
    }

    if (!browserSupport.supported) {
      onError?.(`Browser missing: ${browserSupport.missing.join(', ')}`);
      return;
    }

    // Determine which provider to use (re-detect in case state settled)
    let provider = activeProvider;
    if (!provider) {
      // Quick fallback: WebSpeech is synchronous
      if (typeof window !== 'undefined' && WebSpeechService.isSupported()) {
        provider = 'webspeech';
      } else {
        onError?.('Speech recognition service not available. Please try standard mode.');
        return;
      }
    }

    try {
      if (provider === 'tarteel') {
        // ── Tarteel Whisper (primary) ──────────────────────────────────────
        const service = new TarteelService({
          expectedText,
          chunkIntervalMs: 2500,

          onWord: (index, word, confidence) => {
            onWord?.(index, {
              word,
              start: 0,
              end: 0,
              confidence,
              isFinal: true,
            });
          },

          onStateChange: (tarteelState: TarteelState) => {
            setState(mapToRealtimeState(tarteelState, tarteelState.isRecording));
          },

          onError: (err) => onError?.(err),
        });

        serviceRef.current = service;

        audioLevelIntervalRef.current = setInterval(() => {
          setAudioLevel(service.getAudioLevel());
        }, 50);

        await service.start();

        // Mark as connected (Tarteel starts immediately with first chunk)
        setState(prev => ({ ...prev, isConnected: true, isRecording: true }));

      } else if (provider === 'webspeech') {
        // ── Web Speech API (fallback) ──────────────────────────────────────
        const service = new WebSpeechService({
          expectedText,

          onWord: (index, word, confidence) => {
            onWord?.(index, {
              word,
              start: 0,
              end: 0,
              confidence,
              isFinal: true,
            });
          },

          onStateChange: (wsState: WebSpeechState) => {
            setState(mapToRealtimeState(wsState, wsState.isRecording));
          },

          onError: (err) => onError?.(err),
        });

        serviceRef.current = service;

        audioLevelIntervalRef.current = setInterval(() => {
          setAudioLevel(service.getAudioLevel());
        }, 50);

        await service.start();

        setState(prev => ({ ...prev, isConnected: true, isRecording: true }));

      } else if (provider === 'deepgram') {
        // ── Deepgram (legacy, only when Tarteel unavailable) ──────────────
        const apiKey = deepgramKeyRef.current;
        if (!apiKey) {
          onError?.('Deepgram API key not available. Please try standard mode.');
          return;
        }

        const service = new RealtimeTajweedService({ apiKey, expectedText });
        serviceRef.current = service;

        service.onStateChange(setState);
        service.onWord((index, word) => onWord?.(index, word));
        service.onError((err) => onError?.(err));

        audioLevelIntervalRef.current = setInterval(() => {
          setAudioLevel(service.getAudioLevel());
        }, 50);

        await service.start();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to start recording';
      onError?.(message);
      setState(prev => ({ ...prev, error: message }));
    }
  }, [expectedText, isConfigured, activeProvider, browserSupport, onWord, onError]);

  // ============================================
  // stop()
  // ============================================

  const stop = useCallback(async (): Promise<RealtimeSessionResult | null> => {
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }
    setAudioLevel(0);

    if (!serviceRef.current) return null;

    try {
      const rawResult = await serviceRef.current.stop();
      serviceRef.current = null;

      // Normalise result into RealtimeSessionResult regardless of provider
      const result: RealtimeSessionResult = {
        transcription: rawResult.transcription,
        // TarteelService/WebSpeechService don't provide word timestamps
        words: (rawResult as RealtimeSessionResult).words ?? [],
        alignments: rawResult.alignments,
        accuracy: rawResult.accuracy,
        // Detect tajweed rules from the expected text (static analysis)
        rulesDetected:
          (rawResult as RealtimeSessionResult).rulesDetected ??
          detectTajweedRules(expectedText),
        duration: rawResult.duration,
      };

      onComplete?.(result);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stop';
      onError?.(message);
      return null;
    }
  }, [expectedText, onComplete, onError]);

  // ============================================
  // reset()
  // ============================================

  const reset = useCallback(() => {
    if (serviceRef.current) {
      serviceRef.current.stop().catch(console.error);
      serviceRef.current = null;
    }
    if (audioLevelIntervalRef.current) {
      clearInterval(audioLevelIntervalRef.current);
      audioLevelIntervalRef.current = null;
    }

    setState(buildInitialState(expectedText));
    setAudioLevel(0);
  }, [expectedText]);

  return {
    state,
    audioLevel,
    start,
    stop,
    isSupported: browserSupport.supported,
    missingFeatures: browserSupport.missing,
    isConfigured,
    reset,
  };
}

export default useRealtimeTajweed;
