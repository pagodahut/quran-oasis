'use client';

import { useAppTheme, type ThemeId } from '@/contexts/ThemeContext';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export function useTheme() {
  const { themeId, theme, setTheme: setAppTheme, isLoaded, isDark } = useAppTheme();

  const legacyTheme: Theme = isDark ? 'dark' : 'light';
  const resolvedTheme: ResolvedTheme = isDark ? 'dark' : 'light';

  const setTheme = (t: Theme) => {
    if (t === 'dark') setAppTheme('manuscript-dark');
    else if (t === 'light') setAppTheme('manuscript');
    else setAppTheme('auto');
  };

  const toggleTheme = () => {
    setAppTheme(isDark ? 'manuscript' : 'manuscript-dark');
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
