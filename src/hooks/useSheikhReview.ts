'use client';

import { useState, useCallback } from 'react';

// ─── Types ─────────────────────────────────────────────────────────

export type ReviewType = 'sabaq' | 'sabqi' | 'manzil';

export interface ReviewAyah {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  daysSinceReview?: number;
  lastAccuracy?: number;
}

export interface ReviewMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface SessionResult {
  ayahsCovered: number;
  overallPerformance: 'excellent' | 'good' | 'needs_work';
  recommendation: string;
  nextReviewSuggestion: string;
}

interface ReviewSessionConfig {
  reviewType: ReviewType;
  ayahs: ReviewAyah[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  userName?: string;
  streakDays?: number;
}

interface UseSheikhReviewReturn {
  /** All messages in the review session */
  messages: ReviewMessage[];
  /** Whether the sheikh is generating a response */
  isLoading: boolean;
  /** Error message */
  error: string | null;
  /** Session completion result */
  sessionResult: SessionResult | null;
  /** Whether the session is complete */
  isComplete: boolean;
  /** Start the review session */
  start: (config: ReviewSessionConfig) => Promise<void>;
  /** Send a user message */
  respond: (message: string, recitationScore?: number) => Promise<void>;
  /** Reset the session */
  reset: () => void;
  /** Current review type */
  reviewType: ReviewType | null;
  /** The ayahs being reviewed */
  ayahs: ReviewAyah[];
}

// ─── Hook ──────────────────────────────────────────────────────────

export function useSheikhReview(): UseSheikhReviewReturn {
  const [messages, setMessages] = useState<ReviewMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [config, setConfig] = useState<ReviewSessionConfig | null>(null);

  const callAPI = useCallback(
    async (
      allMessages: ReviewMessage[],
      sessionConfig: ReviewSessionConfig,
      action?: string,
      recitationScore?: number
    ) => {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/sheikh/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reviewType: sessionConfig.reviewType,
            ayahs: sessionConfig.ayahs,
            messages: allMessages,
            userLevel: sessionConfig.userLevel,
            userName: sessionConfig.userName,
            streakDays: sessionConfig.streakDays,
            action: action || 'continue',
            recitationScore,
          }),
        });

        if (!res.ok) throw new Error('Failed to get response');

        const data = await res.json();

        const assistantMsg: ReviewMessage = {
          role: 'assistant',
          content: data.message,
        };

        setMessages((prev) => [...prev, assistantMsg]);

        if (data.isComplete && data.sessionResult) {
          setSessionResult(data.sessionResult);
          setIsComplete(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const start = useCallback(
    async (sessionConfig: ReviewSessionConfig) => {
      setMessages([]);
      setSessionResult(null);
      setIsComplete(false);
      setConfig(sessionConfig);
      await callAPI([], sessionConfig, 'start');
    },
    [callAPI]
  );

  const respond = useCallback(
    async (message: string, recitationScore?: number) => {
      if (isComplete || isLoading || !config) return;

      const userMsg: ReviewMessage = { role: 'user', content: message };
      const updated = [...messages, userMsg];

      setMessages(updated);

      const action = recitationScore !== undefined ? 'recited' : 'continue';
      await callAPI(updated, config, action, recitationScore);
    },
    [messages, isComplete, isLoading, config, callAPI]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setSessionResult(null);
    setIsComplete(false);
    setConfig(null);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sessionResult,
    isComplete,
    start,
    respond,
    reset,
    reviewType: config?.reviewType ?? null,
    ayahs: config?.ayahs ?? [],
  };
}
