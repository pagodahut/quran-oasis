'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

// ============================================
// Theme Definitions
// ============================================

export type ThemeId = 'dark-luxury' | 'light-cream' | 'olive-earth' | 'pure-white';

export interface ThemeColors {
  surface: string;
  surfaceAlt: string;
  card: string;
  cardHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  border: string;
  borderSubtle: string;
  // Glass specific
  glassBase: string;
  glassBorder: string;
  // Semantic
  isDark: boolean;
}

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  nameAr: string;
  description: string;
  emoji: string;
  colors: ThemeColors;
}

export const THEMES: Record<ThemeId, ThemeMeta> = {
  'dark-luxury': {
    id: 'dark-luxury',
    name: 'Dark Luxury',
    nameAr: 'الفاخر الداكن',
    description: 'Black with gold accents — elegant night reading',
    emoji: '🌙',
    colors: {
      surface: '#0f1419',
      surfaceAlt: '#1a1f2a',
      card: 'rgba(22, 27, 34, 0.72)',
      cardHover: 'rgba(30, 35, 42, 0.80)',
      text: '#E8E8E8',
      textSecondary: '#a4a9b8',
      textMuted: '#5d6579',
      accent: '#D4A342',
      accentLight: '#f4d47c',
      accentDark: '#8b6914',
      border: 'rgba(255, 255, 255, 0.08)',
      borderSubtle: 'rgba(255, 255, 255, 0.04)',
      glassBase: 'rgba(22, 27, 34, 0.72)',
      glassBorder: 'rgba(255, 255, 255, 0.06)',
      isDark: true,
    },
  },
  'light-cream': {
    id: 'light-cream',
    name: 'Light Cream',
    nameAr: 'كريمي فاتح',
    description: 'Warm, paper-like — gentle on the eyes',
    emoji: '☀️',
    colors: {
      surface: '#F9F6F1',
      surfaceAlt: '#F0EBE3',
      card: 'rgba(255, 255, 255, 0.85)',
      cardHover: 'rgba(255, 255, 255, 0.95)',
      text: '#2D2D2D',
      textSecondary: '#5A5A5A',
      textMuted: '#8A8A8A',
      accent: '#C85A3C',
      accentLight: '#E07A5F',
      accentDark: '#9E4530',
      border: 'rgba(0, 0, 0, 0.08)',
      borderSubtle: 'rgba(0, 0, 0, 0.04)',
      glassBase: 'rgba(255, 255, 255, 0.80)',
      glassBorder: 'rgba(0, 0, 0, 0.06)',
      isDark: false,
    },
  },
  'olive-earth': {
    id: 'olive-earth',
    name: 'Olive Earth',
    nameAr: 'أرضي زيتوني',
    description: 'Earthy, grounded — vintage manuscript feel',
    emoji: '🌿',
    colors: {
      surface: '#E8DCCA',
      surfaceAlt: '#DED0BC',
      card: 'rgba(255, 255, 255, 0.60)',
      cardHover: 'rgba(255, 255, 255, 0.75)',
      text: '#2D2D2D',
      textSecondary: '#4A4A3A',
      textMuted: '#7A7A6A',
      accent: '#3F4F28',
      accentLight: '#5A7038',
      accentDark: '#2A3518',
      border: 'rgba(0, 0, 0, 0.10)',
      borderSubtle: 'rgba(0, 0, 0, 0.05)',
      glassBase: 'rgba(255, 255, 255, 0.55)',
      glassBorder: 'rgba(0, 0, 0, 0.08)',
      isDark: false,
    },
  },
  'pure-white': {
    id: 'pure-white',
    name: 'Pure White',
    nameAr: 'أبيض صافي',
    description: 'Clean, minimal — distraction-free focus',
    emoji: '✨',
    colors: {
      surface: '#FFFFFF',
      surfaceAlt: '#F5F5F5',
      card: 'rgba(245, 245, 245, 0.80)',
      cardHover: 'rgba(240, 240, 240, 0.90)',
      text: '#1A1A1A',
      textSecondary: '#555555',
      textMuted: '#999999',
      accent: '#2563EB',
      accentLight: '#60A5FA',
      accentDark: '#1D4ED8',
      border: 'rgba(0, 0, 0, 0.08)',
      borderSubtle: 'rgba(0, 0, 0, 0.04)',
      glassBase: 'rgba(255, 255, 255, 0.90)',
      glassBorder: 'rgba(0, 0, 0, 0.06)',
      isDark: false,
    },
  },
};

export const THEME_LIST = Object.values(THEMES);

// ============================================
// Context
// ============================================

const STORAGE_KEY = 'hifz_theme';

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeMeta;
  setTheme: (id: ThemeId) => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId: 'dark-luxury',
  theme: THEMES['dark-luxury'],
  setTheme: () => {},
  isLoaded: false,
});

export function useAppTheme() {
  return useContext(ThemeContext);
}

// ============================================
// Apply CSS Variables
// ============================================

function applyThemeToDOM(themeId: ThemeId) {
  const meta = THEMES[themeId];
  const c = meta.colors;
  const root = document.documentElement;

  // Set data attribute for CSS selectors
  root.setAttribute('data-theme', themeId);

  // Toggle dark/light class for existing Tailwind compatibility
  if (c.isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
  }

  // Set CSS custom properties
  const vars: Record<string, string> = {
    '--theme-surface': c.surface,
    '--theme-surface-alt': c.surfaceAlt,
    '--theme-card': c.card,
    '--theme-card-hover': c.cardHover,
    '--theme-text': c.text,
    '--theme-text-secondary': c.textSecondary,
    '--theme-text-muted': c.textMuted,
    '--theme-accent': c.accent,
    '--theme-accent-light': c.accentLight,
    '--theme-accent-dark': c.accentDark,
    '--theme-border': c.border,
    '--theme-border-subtle': c.borderSubtle,
    '--theme-glass-base': c.glassBase,
    '--theme-glass-border': c.glassBorder,
  };

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }

  // Update meta theme-color
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', c.surface);
  }
}

// ============================================
// Provider
// ============================================

function getDefaultTheme(): ThemeId {
  if (typeof window === 'undefined') return 'dark-luxury';
  
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  if (stored && THEMES[stored]) return stored;
  
  // Detect system preference as hint
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark-luxury' : 'light-cream';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('dark-luxury');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const id = getDefaultTheme();
    setThemeId(id);
    applyThemeToDOM(id);
    setIsLoaded(true);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem(STORAGE_KEY, id);
    applyThemeToDOM(id);
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: id }));
  }, []);

  return (
    <ThemeContext.Provider value={{ themeId, theme: THEMES[themeId], setTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}
