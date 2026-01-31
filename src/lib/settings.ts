/**
 * Settings System
 * Store and manage user preferences in localStorage
 */

export interface UserSettings {
  // Audio
  reciter: string;
  playbackSpeed: number;
  
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

const STORAGE_KEY = 'quran-oasis-settings';

export const DEFAULT_SETTINGS: UserSettings = {
  reciter: 'alafasy',
  playbackSpeed: 1,
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

// React hook for settings
import { useState, useEffect, useCallback } from 'react';

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
