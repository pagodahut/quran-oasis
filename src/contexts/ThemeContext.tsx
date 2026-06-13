'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { AMBIENT_PALETTES, type PrayerPeriod, type AmbientColors } from '@/hooks/usePrayerTime';

export type ThemeId = 'manuscript' | 'manuscript-dark' | 'auto';

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
  glassBase: string;
  glassBorder: string;
  isDark: boolean;
}

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  nameAr: string;
  description: string;
  colors: ThemeColors;
}

function colorsFromAmbient(a: AmbientColors, isDark: boolean): ThemeColors {
  return {
    surface: a.bg,
    surfaceAlt: a.bgAlt,
    card: a.surface,
    cardHover: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    text: a.textPrimary,
    textSecondary: a.textSecondary,
    textMuted: a.textMuted,
    accent: a.goldLeaf,
    accentLight: a.goldLeafSubtle,
    accentDark: a.goldLeaf,
    border: a.border,
    borderSubtle: a.borderSubtle,
    glassBase: a.surface,
    glassBorder: a.border,
    isDark,
  };
}

const MANUSCRIPT_LIGHT = colorsFromAmbient(AMBIENT_PALETTES.dhuhr, false);
const MANUSCRIPT_DARK = colorsFromAmbient(AMBIENT_PALETTES.isha, true);

export const THEMES: Record<ThemeId, ThemeMeta> = {
  'manuscript': {
    id: 'manuscript',
    name: 'Manuscript',
    nameAr: 'المخطوطة',
    description: 'Warm parchment — like reading a beautiful book',
    colors: MANUSCRIPT_LIGHT,
  },
  'manuscript-dark': {
    id: 'manuscript-dark',
    name: 'Candlelit',
    nameAr: 'ضوء الشمعة',
    description: 'Deep warm sepia — night reading by candlelight',
    colors: MANUSCRIPT_DARK,
  },
  'auto': {
    id: 'auto',
    name: 'Prayer Time',
    nameAr: 'أوقات الصلاة',
    description: 'Shifts with the rhythm of the day — dawn blue to night indigo',
    colors: MANUSCRIPT_LIGHT,
  },
};

export const THEME_LIST = Object.values(THEMES);

const STORAGE_KEY = 'hifz_theme';

interface ThemeContextValue {
  themeId: ThemeId;
  theme: ThemeMeta;
  setTheme: (id: ThemeId) => void;
  isLoaded: boolean;
  prayerPeriod: PrayerPeriod;
  ambientColors: AmbientColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId: 'auto',
  theme: THEMES['auto'],
  setTheme: () => {},
  isLoaded: false,
  prayerPeriod: 'dhuhr',
  ambientColors: AMBIENT_PALETTES.dhuhr,
  isDark: false,
});

export function useAppTheme() {
  return useContext(ThemeContext);
}

function getPrayerPeriod(hour: number): PrayerPeriod {
  if (hour >= 4 && hour < 7) return 'fajr';
  if (hour >= 7 && hour < 15) return 'dhuhr';
  if (hour >= 15 && hour < 18) return 'asr';
  if (hour >= 18 && hour < 20) return 'maghrib';
  return 'isha';
}

function applyThemeToDOM(themeId: ThemeId, period: PrayerPeriod) {
  const root = document.documentElement;
  root.setAttribute('data-theme', themeId);

  let ambient: AmbientColors;
  let isDark: boolean;

  if (themeId === 'auto') {
    ambient = AMBIENT_PALETTES[period];
    isDark = period === 'isha';
  } else if (themeId === 'manuscript-dark') {
    ambient = AMBIENT_PALETTES.isha;
    isDark = true;
  } else {
    ambient = AMBIENT_PALETTES.dhuhr;
    isDark = false;
  }

  if (isDark) {
    root.classList.add('dark');
    root.classList.remove('light');
  } else {
    root.classList.remove('dark');
    root.classList.add('light');
  }

  const vars: Record<string, string> = {
    '--theme-surface': ambient.bg,
    '--theme-surface-alt': ambient.bgAlt,
    '--theme-card': ambient.surface,
    '--theme-card-hover': isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
    '--theme-text': ambient.textPrimary,
    '--theme-text-secondary': ambient.textSecondary,
    '--theme-text-muted': ambient.textMuted,
    '--theme-accent': ambient.goldLeaf,
    '--theme-accent-light': ambient.goldLeafSubtle,
    '--theme-accent-dark': ambient.goldLeaf,
    '--theme-border': ambient.border,
    '--theme-border-subtle': ambient.borderSubtle,
    '--theme-glass-base': ambient.surface,
    '--theme-glass-border': ambient.border,
    '--ambient-bg': ambient.bg,
    '--ambient-bg-alt': ambient.bgAlt,
    '--ambient-surface': ambient.surface,
    '--ambient-warmth': ambient.warmth,
    '--ambient-accent': ambient.accent,
    '--ambient-accent-subtle': ambient.accentSubtle,
    '--ambient-gold': ambient.goldLeaf,
    '--ambient-gold-subtle': ambient.goldLeafSubtle,
  };

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', ambient.bg);
  }
}

function getDefaultTheme(): ThemeId {
  if (typeof window === 'undefined') return 'auto';
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
  if (stored && THEMES[stored]) return stored;
  return 'auto';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>('auto');
  const [isLoaded, setIsLoaded] = useState(false);
  const [period, setPeriod] = useState<PrayerPeriod>(() =>
    typeof window !== 'undefined' ? getPrayerPeriod(new Date().getHours()) : 'dhuhr'
  );

  useEffect(() => {
    const id = getDefaultTheme();
    const p = getPrayerPeriod(new Date().getHours());
    setThemeId(id);
    setPeriod(p);
    applyThemeToDOM(id, p);
    setIsLoaded(true);

    const interval = setInterval(() => {
      const newP = getPrayerPeriod(new Date().getHours());
      setPeriod(prev => {
        if (prev !== newP) {
          applyThemeToDOM(id, newP);
          window.dispatchEvent(new CustomEvent('prayerPeriodChanged', { detail: newP }));
          return newP;
        }
        return prev;
      });
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeId(id);
    localStorage.setItem(STORAGE_KEY, id);
    applyThemeToDOM(id, period);
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: id }));
  }, [period]);

  const ambient = themeId === 'auto'
    ? AMBIENT_PALETTES[period]
    : themeId === 'manuscript-dark'
      ? AMBIENT_PALETTES.isha
      : AMBIENT_PALETTES.dhuhr;

  const isDark = themeId === 'manuscript-dark' || (themeId === 'auto' && period === 'isha');

  return (
    <ThemeContext.Provider value={{
      themeId,
      theme: THEMES[themeId],
      setTheme,
      isLoaded,
      prayerPeriod: period,
      ambientColors: ambient,
      isDark,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}
