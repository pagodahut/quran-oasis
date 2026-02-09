/**
 * useSheikhGenerate — Hook for non-chat sheikh content
 * 
 * Calls /api/sheikh/generate for:
 *   - Pre-lesson briefings
 *   - Post-lesson reflections
 *   - Dashboard greetings
 *   - Tajweed feedback
 * 
 * Returns generated content with loading/error states and caching.
 * 
 * Usage:
 *   const { generate, data, isLoading, error } = useSheikhGenerate();
 *   
 *   // Generate a briefing
 *   await generate({
 *     type: 'briefing',
 *     context: { lessonTitle: '...', ayahs: [...], userLevel: 'beginner' }
 *   });
 *   
 *   // data is now the parsed JSON response
 */

'use client';

import { useState, useCallback, useRef } from 'react';

// ─── Types ───────────────────────────────────────────────────────────

interface AyahInfo {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumberStart: number;
  ayahNumberEnd: number;
  arabicText: string;
  translation: string;
}

// Briefing
export interface BriefingContext {
  lessonTitle: string;
  ayahs: AyahInfo[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  isReview?: boolean;
}

export interface BriefingResponse {
  message: string;
  tip: string;
  theme: string;
}

// Reflection
export interface ReflectionContext {
  lessonTitle: string;
  ayahs: AyahInfo[];
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  performance: {
    ayahsMemorized: number;
    totalAttempts: number;
    perfectRecitations: number;
    timeSpentMinutes: number;
    struggles?: string[];
  };
  xpEarned?: number;
  streakDays?: number;
}

export interface ReflectionResponse {
  message: string;
  insight: string;
  hadith: string | null;
}

// Greeting
export interface GreetingContext {
  userName?: string;
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  timeOfDay: 'fajr' | 'morning' | 'afternoon' | 'evening' | 'night';
  streakDays?: number;
  totalVersesMemorized?: number;
  totalSurahsCompleted?: number;
  currentProgress?: string;
  lastStudied?: {
    surahName: string;
    ayahNumber: number;
    daysAgo: number;
  };
  nextMilestone?: string;
}

export interface GreetingResponse {
  greeting: string;
  suggestedQuestions: string[];
}

// Tajweed
export interface TajweedFeedbackContext {
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  ayah: AyahInfo;
  tajweedResults: {
    rule: string;
    location: string;
    feedback: string;
    severity: 'correct' | 'minor' | 'major';
  }[];
  overallScore: number;
  attemptNumber: number;
}

export interface TajweedFeedbackResponse {
  feedback: string;
  corrections: {
    rule: string;
    location: string;
    explanation: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  overallTone: 'excellent' | 'good' | 'encouraging';
  shouldRetry: boolean;
}

// Union types
type GenerateRequest =
  | { type: 'briefing'; context: BriefingContext }
  | { type: 'reflection'; context: ReflectionContext }
  | { type: 'greeting'; context: GreetingContext }
  | { type: 'tajweed'; context: TajweedFeedbackContext };

type GenerateResponse =
  | BriefingResponse
  | ReflectionResponse
  | GreetingResponse
  | TajweedFeedbackResponse;

// ─── Hook ────────────────────────────────────────────────────────────

export function useSheikhGenerate<T extends GenerateResponse = GenerateResponse>() {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple cache to avoid re-fetching same content
  const cacheRef = useRef<Map<string, T>>(new Map());

  const generate = useCallback(async (request: GenerateRequest): Promise<T | null> => {
    // Create cache key from request
    const cacheKey = JSON.stringify(request);
    const cached = cacheRef.current.get(cacheKey);
    if (cached) {
      setData(cached);
      return cached;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/sheikh/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      const responseData = result.data as T;

      // Cache the result
      cacheRef.current.set(cacheKey, responseData);

      // Keep cache size manageable
      if (cacheRef.current.size > 20) {
        const firstKey = cacheRef.current.keys().next().value;
        if (firstKey) cacheRef.current.delete(firstKey);
      }

      setData(responseData);
      return responseData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate content';
      setError(message);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return { generate, data, isLoading, error, clearCache };
}
