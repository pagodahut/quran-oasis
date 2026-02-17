'use client';

import { useAppTheme, type ThemeId } from '@/contexts/ThemeContext';

// Backward-compatible theme types
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

/**
 * Backward-compatible useTheme hook.
 * Maps the old light/dark/system API to the new 4-theme system.
 * Settings page now uses useAppTheme() directly for the full theme switcher.
 */
export function useTheme() {
  const { themeId, theme, setTheme: setAppTheme, isLoaded } = useAppTheme();

  // Map themeId to old Theme type
  const legacyTheme: Theme = theme.colors.isDark ? 'dark' : 'light';
  const resolvedTheme: ResolvedTheme = theme.colors.isDark ? 'dark' : 'light';

  const setTheme = (t: Theme) => {
    // Map old API to new theme IDs
    if (t === 'dark') setAppTheme('dark-luxury');
    else if (t === 'light') setAppTheme('light-cream');
    else {
      // system — use prefers-color-scheme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setAppTheme(prefersDark ? 'dark-luxury' : 'light-cream');
    }
  };

  const toggleTheme = () => {
    setAppTheme(theme.colors.isDark ? 'light-cream' : 'dark-luxury');
  };

  return {
    theme: legacyTheme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isLoaded,
  };
}

export default useTheme;
