/**
 * Hook for applying preferences throughout the app
 * Provides convenient access to preference values and applies them
 */

'use client';

import { useEffect, useMemo } from 'react';
import { 
  usePreferences,
  useDisplayPreferences,
  useAudioPreferences,
  useLearningPreferences,
  FONT_SIZE_MAP,
  type FontSize,
} from '@/lib/preferencesStore';

/**
 * Get Arabic font size in pixels from preference
 */
export function useArabicFontSize(): number {
  const { display } = useDisplayPreferences();
  return display.arabicFontSizePx || FONT_SIZE_MAP[display.arabicFontSize];
}

/**
 * Get preferred reciter ID
 */
export function useReciter(): string {
  const { audio } = useAudioPreferences();
  return audio.reciter;
}

/**
 * Get playback speed
 */
export function usePlaybackSpeed(): number {
  const { audio } = useAudioPreferences();
  return audio.playbackSpeed;
}

/**
 * Get volume (0-1)
 */
export function useVolume(): number {
  const { audio } = useAudioPreferences();
  return audio.volume;
}

/**
 * Get translation preference
 */
export function useTranslation(): { show: boolean; edition: 'sahih' | 'asad' } {
  const { display } = useDisplayPreferences();
  return {
    show: display.showTranslation,
    edition: display.translation,
  };
}

/**
 * Get transliteration preference
 */
export function useTransliteration(): boolean {
  const { display } = useDisplayPreferences();
  return display.showTransliteration;
}

/**
 * Get daily goals
 */
export function useDailyGoals(): { minutes: number; verses: number } {
  const { learning } = useLearningPreferences();
  return {
    minutes: learning.dailyGoalMinutes,
    verses: learning.dailyGoalVerses,
  };
}

/**
 * Apply CSS variables for Arabic text styling
 */
export function useApplyArabicStyles(): void {
  const fontSize = useArabicFontSize();
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--arabic-font-size', `${fontSize}px`);
    }
  }, [fontSize]);
}

/**
 * Combined hook for reading-related preferences
 * Useful for Mushaf, lessons, and memorization pages
 */
export function useReadingPreferences() {
  const { display } = useDisplayPreferences();
  const { audio } = useAudioPreferences();
  
  return useMemo(() => ({
    // Display
    arabicFontSize: display.arabicFontSizePx || FONT_SIZE_MAP[display.arabicFontSize],
    showTranslation: display.showTranslation,
    translation: display.translation,
    showTransliteration: display.showTransliteration,
    
    // Audio
    reciter: audio.reciter,
    playbackSpeed: audio.playbackSpeed,
    volume: audio.volume,
    autoPlay: audio.autoPlayOnLesson,
  }), [display, audio]);
}

/**
 * Hook for audio configuration
 */
export function useAudioConfig() {
  const { audio } = useAudioPreferences();
  
  return useMemo(() => ({
    reciter: audio.reciter,
    playbackSpeed: audio.playbackSpeed,
    volume: audio.volume,
    autoPlayOnLesson: audio.autoPlayOnLesson,
  }), [audio]);
}
