/**
 * Preferences Store - Comprehensive settings management
 * Uses localStorage with future Clerk metadata sync support
 */

import { useEffect, useState, useCallback } from 'react';

// ============================================
// Types
// ============================================

export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type Theme = 'dark' | 'light' | 'auto';
export type PlaybackSpeed = 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2;
export type AudioQuality = 'auto' | 'high' | 'medium' | 'low';

export interface AudioPreferences {
  reciter: string;
  playbackSpeed: PlaybackSpeed;
  autoPlayOnLesson: boolean;
  volume: number; // 0-1
  // New audio enhancement settings
  audioQuality: AudioQuality;
  crossfadeEnabled: boolean;
  crossfadeDuration: number; // ms
  autoPreload: boolean;
  gaplessPlayback: boolean;
}

export interface DisplayPreferences {
  arabicFontSize: FontSize;
  arabicFontSizePx: number;
  showTranslation: boolean;
  showTransliteration: boolean;
  translation: 'sahih' | 'asad';
  theme: Theme;
  highContrast: boolean;
}

export interface LearningPreferences {
  dailyGoalMinutes: number;
  dailyGoalVerses: number;
  notificationsEnabled: boolean;
  practiceReminders: boolean;
  reminderTime: string; // HH:mm format
  preferredLessonLength: 'short' | 'medium' | 'long';
}

export interface PrivacyPreferences {
  analyticsEnabled: boolean;
  syncEnabled: boolean;
  lastSyncAt: string | null;
}

export interface UserPreferences {
  audio: AudioPreferences;
  display: DisplayPreferences;
  learning: LearningPreferences;
  privacy: PrivacyPreferences;
  version: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'quran-oasis-preferences';
const CURRENT_VERSION = 1;

export const FONT_SIZE_MAP: Record<FontSize, number> = {
  'small': 24,
  'medium': 28,
  'large': 34,
  'extra-large': 42,
};

export const FONT_SIZE_OPTIONS: { value: FontSize; label: string; px: number }[] = [
  { value: 'small', label: 'Small', px: 24 },
  { value: 'medium', label: 'Medium', px: 28 },
  { value: 'large', label: 'Large', px: 34 },
  { value: 'extra-large', label: 'Extra Large', px: 42 },
];

export const PLAYBACK_SPEED_OPTIONS: { value: PlaybackSpeed; label: string }[] = [
  { value: 0.5, label: '0.5x (Slow)' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x (Normal)' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x (Fast)' },
];

export const AUDIO_QUALITY_OPTIONS: { value: AudioQuality; label: string; description: string }[] = [
  { value: 'auto', label: 'Auto', description: 'Adjust based on network speed' },
  { value: 'high', label: 'High', description: '128-192 kbps, best quality' },
  { value: 'medium', label: 'Medium', description: '64 kbps, balanced' },
  { value: 'low', label: 'Low', description: 'Save data, lower quality' },
];

export const DAILY_GOAL_OPTIONS = {
  minutes: [
    { value: 5, label: '5 min', description: 'Quick session' },
    { value: 10, label: '10 min', description: 'Light practice' },
    { value: 15, label: '15 min', description: 'Moderate' },
    { value: 30, label: '30 min', description: 'Dedicated' },
    { value: 45, label: '45 min', description: 'Intensive' },
    { value: 60, label: '60 min', description: 'Scholar mode' },
  ],
  verses: [
    { value: 1, label: '1 verse', description: 'Start slow' },
    { value: 3, label: '3 verses', description: 'Beginner' },
    { value: 5, label: '5 verses', description: 'Moderate' },
    { value: 7, label: '7 verses', description: 'Committed' },
    { value: 10, label: '10 verses', description: 'Dedicated' },
    { value: 15, label: '15+ verses', description: 'Intensive' },
  ],
};

export const RECITERS = [
  { 
    id: 'alafasy', 
    name: 'Mishary Rashid Alafasy', 
    arabicName: 'مشاري راشد العفاسي',
    style: 'Murattal',
    description: 'Clear, beautiful recitation perfect for memorization',
  },
  { 
    id: 'husary', 
    name: 'Mahmoud Khalil Al-Husary', 
    arabicName: 'محمود خليل الحصري',
    style: 'Murattal',
    description: 'Classic Egyptian style, excellent for learning tajweed',
  },
  { 
    id: 'sudais', 
    name: 'Abdul Rahman Al-Sudais', 
    arabicName: 'عبدالرحمن السديس',
    style: 'Murattal',
    description: 'Imam of Masjid Al-Haram, powerful recitation',
  },
  { 
    id: 'abdul_basit', 
    name: 'Abdul Basit Abdul Samad', 
    arabicName: 'عبدالباسط عبدالصمد',
    style: 'Mujawwad',
    description: 'Legendary Egyptian reciter, melodious style',
  },
  { 
    id: 'ghamadi', 
    name: 'Saad Al-Ghamdi', 
    arabicName: 'سعد الغامدي',
    style: 'Murattal',
    description: 'Saudi reciter, clear and steady pace',
  },
  { 
    id: 'hazza', 
    name: 'Hazza Al Balushi', 
    arabicName: 'هزاع البلوشي',
    style: 'Murattal',
    description: 'Young Emirati reciter, beautiful voice',
    listenOnly: true,
  },
];

export const TRANSLATIONS = [
  { id: 'sahih', name: 'Sahih International', language: 'English' },
  { id: 'asad', name: 'Muhammad Asad', language: 'English' },
];

// ============================================
// Default Preferences
// ============================================

export const DEFAULT_PREFERENCES: UserPreferences = {
  audio: {
    reciter: 'alafasy',
    playbackSpeed: 1,
    autoPlayOnLesson: true,
    volume: 1,
    audioQuality: 'auto',
    crossfadeEnabled: false,
    crossfadeDuration: 500,
    autoPreload: true,
    gaplessPlayback: true,
  },
  display: {
    arabicFontSize: 'medium',
    arabicFontSizePx: 28,
    showTranslation: true,
    showTransliteration: false,
    translation: 'sahih',
    theme: 'dark',
    highContrast: false,
  },
  learning: {
    dailyGoalMinutes: 15,
    dailyGoalVerses: 5,
    notificationsEnabled: false,
    practiceReminders: false,
    reminderTime: '08:00',
    preferredLessonLength: 'medium',
  },
  privacy: {
    analyticsEnabled: true,
    syncEnabled: false,
    lastSyncAt: null,
  },
  version: CURRENT_VERSION,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ============================================
// Core Functions
// ============================================

/**
 * Get all preferences from localStorage
 */
export function getPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PREFERENCES;
    
    const parsed = JSON.parse(stored) as Partial<UserPreferences>;
    
    // Deep merge with defaults to ensure all fields exist
    return {
      audio: { ...DEFAULT_PREFERENCES.audio, ...parsed.audio },
      display: { ...DEFAULT_PREFERENCES.display, ...parsed.display },
      learning: { ...DEFAULT_PREFERENCES.learning, ...parsed.learning },
      privacy: { ...DEFAULT_PREFERENCES.privacy, ...parsed.privacy },
      version: parsed.version || CURRENT_VERSION,
      createdAt: parsed.createdAt || new Date().toISOString(),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Get a specific preference value
 */
export function getPreference<
  C extends keyof Omit<UserPreferences, 'version' | 'createdAt' | 'updatedAt'>,
  K extends keyof UserPreferences[C]
>(category: C, key: K): UserPreferences[C][K] {
  const preferences = getPreferences();
  return preferences[category][key];
}

/**
 * Save all preferences
 */
export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return;
  
  preferences.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  
  // Dispatch event for real-time updates
  window.dispatchEvent(new CustomEvent('preferences-updated', { detail: preferences }));
}

/**
 * Update preferences for a specific category
 */
export function updatePreferences<
  C extends keyof Omit<UserPreferences, 'version' | 'createdAt' | 'updatedAt'>
>(category: C, updates: Partial<UserPreferences[C]>): UserPreferences {
  const current = getPreferences();
  const updated: UserPreferences = {
    ...current,
    [category]: { ...current[category], ...updates },
  };
  
  // Auto-sync font size px when font size changes
  if (category === 'display' && 'arabicFontSize' in updates) {
    const fontSize = updates.arabicFontSize as FontSize;
    (updated.display as DisplayPreferences).arabicFontSizePx = FONT_SIZE_MAP[fontSize];
  }
  
  savePreferences(updated);
  return updated;
}

/**
 * Reset all preferences to defaults
 */
export function resetPreferences(): UserPreferences {
  const defaults = {
    ...DEFAULT_PREFERENCES,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
    window.dispatchEvent(new CustomEvent('preferences-updated', { detail: defaults }));
  }
  
  return defaults;
}

/**
 * Reset a specific category to defaults
 */
export function resetCategory<
  C extends keyof Omit<UserPreferences, 'version' | 'createdAt' | 'updatedAt'>
>(category: C): UserPreferences {
  return updatePreferences(category, DEFAULT_PREFERENCES[category]);
}

// ============================================
// Export/Import
// ============================================

/**
 * Export preferences as JSON string
 */
export function exportPreferences(): string {
  const preferences = getPreferences();
  return JSON.stringify(preferences, null, 2);
}

/**
 * Import preferences from JSON string
 */
export function importPreferences(json: string): boolean {
  try {
    const parsed = JSON.parse(json) as Partial<UserPreferences>;
    
    // Validate structure
    if (!parsed.audio || !parsed.display || !parsed.learning) {
      return false;
    }
    
    // Merge with defaults and save
    const preferences: UserPreferences = {
      audio: { ...DEFAULT_PREFERENCES.audio, ...parsed.audio },
      display: { ...DEFAULT_PREFERENCES.display, ...parsed.display },
      learning: { ...DEFAULT_PREFERENCES.learning, ...parsed.learning },
      privacy: { ...DEFAULT_PREFERENCES.privacy, ...parsed.privacy },
      version: CURRENT_VERSION,
      createdAt: parsed.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    savePreferences(preferences);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// Data Management
// ============================================

/**
 * Clear all local data (preferences + progress)
 */
export function clearAllLocalData(): void {
  if (typeof window === 'undefined') return;
  
  // Clear preferences
  localStorage.removeItem(STORAGE_KEY);
  
  // Clear progress data
  localStorage.removeItem('quranOasis_progress');
  localStorage.removeItem('quranOasis_currentSession');
  localStorage.removeItem('quran-oasis-settings');
  localStorage.removeItem('quran-oasis-bookmarks');
  localStorage.removeItem('quran-oasis-motivation');
  
  // Dispatch events
  window.dispatchEvent(new CustomEvent('preferences-updated', { detail: DEFAULT_PREFERENCES }));
  window.dispatchEvent(new CustomEvent('progress-cleared'));
}

/**
 * Get storage usage estimate
 */
export function getStorageUsage(): { used: number; total: number; percentage: number } {
  if (typeof window === 'undefined') {
    return { used: 0, total: 0, percentage: 0 };
  }
  
  let totalSize = 0;
  
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      totalSize += localStorage.getItem(key)?.length || 0;
    }
  }
  
  // localStorage limit is typically 5MB
  const limitBytes = 5 * 1024 * 1024;
  
  return {
    used: totalSize,
    total: limitBytes,
    percentage: Math.round((totalSize / limitBytes) * 100),
  };
}

// ============================================
// React Hook
// ============================================

export function usePreferences() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initial load
    setPreferences(getPreferences());
    setIsLoaded(true);

    // Listen for updates
    const handleUpdate = (e: CustomEvent<UserPreferences>) => {
      setPreferences(e.detail);
    };

    window.addEventListener('preferences-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('preferences-updated', handleUpdate as EventListener);
    };
  }, []);

  const update = useCallback(<
    C extends keyof Omit<UserPreferences, 'version' | 'createdAt' | 'updatedAt'>
  >(category: C, updates: Partial<UserPreferences[C]>) => {
    return updatePreferences(category, updates);
  }, []);

  const reset = useCallback(() => {
    return resetPreferences();
  }, []);

  const resetOne = useCallback(<
    C extends keyof Omit<UserPreferences, 'version' | 'createdAt' | 'updatedAt'>
  >(category: C) => {
    return resetCategory(category);
  }, []);

  return {
    preferences,
    isLoaded,
    update,
    reset,
    resetOne,
    // Convenience getters
    audio: preferences.audio,
    display: preferences.display,
    learning: preferences.learning,
    privacy: preferences.privacy,
  };
}

// ============================================
// Specialized Hooks
// ============================================

/**
 * Hook for audio preferences only (lighter)
 */
export function useAudioPreferences() {
  const [audio, setAudio] = useState<AudioPreferences>(DEFAULT_PREFERENCES.audio);

  useEffect(() => {
    setAudio(getPreferences().audio);

    const handleUpdate = (e: CustomEvent<UserPreferences>) => {
      setAudio(e.detail.audio);
    };

    window.addEventListener('preferences-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('preferences-updated', handleUpdate as EventListener);
    };
  }, []);

  const update = useCallback((updates: Partial<AudioPreferences>) => {
    updatePreferences('audio', updates);
  }, []);

  return { audio, update };
}

/**
 * Hook for display preferences only (lighter)
 */
export function useDisplayPreferences() {
  const [display, setDisplay] = useState<DisplayPreferences>(DEFAULT_PREFERENCES.display);

  useEffect(() => {
    setDisplay(getPreferences().display);

    const handleUpdate = (e: CustomEvent<UserPreferences>) => {
      setDisplay(e.detail.display);
    };

    window.addEventListener('preferences-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('preferences-updated', handleUpdate as EventListener);
    };
  }, []);

  const update = useCallback((updates: Partial<DisplayPreferences>) => {
    updatePreferences('display', updates);
  }, []);

  return { display, update };
}

/**
 * Hook for learning preferences only
 */
export function useLearningPreferences() {
  const [learning, setLearning] = useState<LearningPreferences>(DEFAULT_PREFERENCES.learning);

  useEffect(() => {
    setLearning(getPreferences().learning);

    const handleUpdate = (e: CustomEvent<UserPreferences>) => {
      setLearning(e.detail.learning);
    };

    window.addEventListener('preferences-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('preferences-updated', handleUpdate as EventListener);
    };
  }, []);

  const update = useCallback((updates: Partial<LearningPreferences>) => {
    updatePreferences('learning', updates);
  }, []);

  return { learning, update };
}

// ============================================
// CSS Variable Application
// ============================================

/**
 * Apply display preferences to CSS variables
 */
export function applyDisplayPreferences(): void {
  if (typeof window === 'undefined') return;
  
  const { display } = getPreferences();
  const root = document.documentElement;
  
  // Apply Arabic font size
  root.style.setProperty('--arabic-font-size', `${display.arabicFontSizePx}px`);
  
  // Apply theme (currently dark-only)
  // Future: implement light mode
}

// Initialize on load
if (typeof window !== 'undefined') {
  // Apply preferences on initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDisplayPreferences);
  } else {
    applyDisplayPreferences();
  }
  
  // Re-apply on updates
  window.addEventListener('preferences-updated', applyDisplayPreferences);
}
