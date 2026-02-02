/**
 * Settings System
 * Store and manage user preferences in localStorage
 */

import { useState, useEffect, useCallback } from 'react';

// ============================================
// Types
// ============================================

export type AudioQuality = 'high' | 'medium' | 'low' | 'auto';

export interface UserSettings {
  // Audio
  reciter: string;
  playbackSpeed: number;
  audioQuality: AudioQuality;
  crossfadeEnabled: boolean;
  crossfadeDuration: number; // ms
  autoPreload: boolean;
  
  // Display
  translation: 'sahih' | 'asad';
  showTranslation: boolean;
  arabicFontSize: number;
  
  // Goals
  dailyGoal: number;  // verses per day
  
  // Notifications (for future)
  reminderEnabled: boolean;
  reminderTime: string;  // HH:mm format
  
  // Theme (for future)
  theme: 'dark' | 'light' | 'system';
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'quran-oasis-settings';

export const DEFAULT_SETTINGS: UserSettings = {
  reciter: 'alafasy',
  playbackSpeed: 1,
  audioQuality: 'auto',
  crossfadeEnabled: false,
  crossfadeDuration: 500,
  autoPreload: true,
  translation: 'sahih',
  showTranslation: true,
  arabicFontSize: 28,
  dailyGoal: 5,
  reminderEnabled: false,
  reminderTime: '08:00',
  theme: 'dark',
};

// Available reciters
export const RECITERS = [
  { 
    id: 'alafasy', 
    name: 'Mishary Rashid Alafasy', 
    arabicName: 'مشاري راشد العفاسي',
    style: 'Murattal',
    folder: 'Alafasy_128kbps'
  },
  { 
    id: 'husary', 
    name: 'Mahmoud Khalil Al-Husary', 
    arabicName: 'محمود خليل الحصري',
    style: 'Murattal',
    folder: 'Husary_128kbps'
  },
  { 
    id: 'minshawi', 
    name: 'Mohamed Siddiq El-Minshawi', 
    arabicName: 'محمد صديق المنشاوي',
    style: 'Murattal',
    folder: 'Minshawy_Murattal_128kbps'
  },
  { 
    id: 'sudais', 
    name: 'Abdul Rahman Al-Sudais', 
    arabicName: 'عبدالرحمن السديس',
    style: 'Murattal',
    folder: 'Abdurrahmaan_As-Sudais_192kbps'
  },
  { 
    id: 'shuraim', 
    name: 'Saood bin Ibraaheem Ash-Shuraym', 
    arabicName: 'سعود الشريم',
    style: 'Murattal',
    folder: 'Saood_ash-Shuraym_128kbps'
  },
];

export const TRANSLATIONS = [
  { id: 'sahih', name: 'Sahih International', language: 'English' },
  { id: 'asad', name: 'Muhammad Asad', language: 'English' },
];

export const DAILY_GOAL_OPTIONS = [
  { value: 1, label: '1 verse', description: 'Start slow' },
  { value: 3, label: '3 verses', description: 'Beginner' },
  { value: 5, label: '5 verses', description: 'Moderate' },
  { value: 7, label: '7 verses', description: 'Committed' },
  { value: 10, label: '10 verses', description: 'Dedicated' },
  { value: 15, label: '15+ verses', description: 'Intensive' },
];

export const AUDIO_QUALITY_OPTIONS: { value: AudioQuality; label: string; description: string }[] = [
  { value: 'auto', label: 'Auto', description: 'Adjust based on network' },
  { value: 'high', label: 'High', description: '128-192 kbps' },
  { value: 'medium', label: 'Medium', description: '64 kbps' },
  { value: 'low', label: 'Low', description: 'Save data' },
];

export const PLAYBACK_SPEED_OPTIONS = [
  { value: 0.5, label: '0.5x' },
  { value: 0.75, label: '0.75x' },
  { value: 1, label: '1x' },
  { value: 1.25, label: '1.25x' },
  { value: 1.5, label: '1.5x' },
  { value: 2, label: '2x' },
];

// ============================================
// Core Functions
// ============================================

// Get all settings
export function getSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Get a single setting
export function getSetting<K extends keyof UserSettings>(key: K): UserSettings[K] {
  const settings = getSettings();
  return settings[key];
}

// Update settings
export function updateSettings(updates: Partial<UserSettings>): UserSettings {
  const current = getSettings();
  const updated = { ...current, ...updates };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('settings-updated', { detail: updated }));
  
  return updated;
}

// Reset all settings
export function resetSettings(): UserSettings {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('settings-updated', { detail: DEFAULT_SETTINGS }));
  return DEFAULT_SETTINGS;
}

// ============================================
// React Hook
// ============================================

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // Initial load
    setSettings(getSettings());

    // Listen for updates
    const handleUpdate = (e: CustomEvent<UserSettings>) => {
      setSettings(e.detail);
    };

    window.addEventListener('settings-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('settings-updated', handleUpdate as EventListener);
    };
  }, []);

  const update = useCallback((updates: Partial<UserSettings>) => {
    return updateSettings(updates);
  }, []);

  const reset = useCallback(() => {
    return resetSettings();
  }, []);

  return {
    settings,
    update,
    reset,
  };
}

// ============================================
// Preferred Reciter per Surah
// ============================================

const SURAH_RECITER_KEY = 'quran-oasis-surah-reciters';

interface SurahReciterPreferences {
  [surah: string]: string; // surah number -> reciter id
}

export function getSurahReciter(surah: number): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const prefs: SurahReciterPreferences = JSON.parse(
      localStorage.getItem(SURAH_RECITER_KEY) || '{}'
    );
    return prefs[surah.toString()] || null;
  } catch {
    return null;
  }
}

export function setSurahReciter(surah: number, reciterId: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const prefs: SurahReciterPreferences = JSON.parse(
      localStorage.getItem(SURAH_RECITER_KEY) || '{}'
    );
    prefs[surah.toString()] = reciterId;
    localStorage.setItem(SURAH_RECITER_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore errors
  }
}

export function clearSurahReciter(surah: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const prefs: SurahReciterPreferences = JSON.parse(
      localStorage.getItem(SURAH_RECITER_KEY) || '{}'
    );
    delete prefs[surah.toString()];
    localStorage.setItem(SURAH_RECITER_KEY, JSON.stringify(prefs));
  } catch {
    // Ignore errors
  }
}

// ============================================
// Effective Reciter (considers surah preference)
// ============================================

export function getEffectiveReciter(surah?: number): string {
  if (surah) {
    const surahReciter = getSurahReciter(surah);
    if (surahReciter) return surahReciter;
  }
  return getSetting('reciter');
}
