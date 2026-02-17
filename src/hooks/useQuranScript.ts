/**
 * Hook to fetch and provide Quran text in the user's preferred script.
 * Returns a function that maps (ayahNumber) -> text in the chosen script.
 * Falls back to the local Uthmani text if fetch fails.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePreferences } from '@/lib/preferencesStore';
import { fetchScriptText, preloadScript, type QuranScript } from '@/lib/quranScripts';

export function useQuranScript(surahNumber: number) {
  const { preferences, isLoaded } = usePreferences();
  const script: QuranScript = isLoaded ? preferences.display.quranScript : 'uthmani';
  
  const [scriptTexts, setScriptTexts] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (script === 'uthmani') {
      setScriptTexts(new Map());
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetchScriptText(script, surahNumber).then((texts) => {
      if (!cancelled) {
        setScriptTexts(texts);
        setLoading(false);
        // Preload adjacent
        preloadScript(script, surahNumber);
      }
    });

    return () => { cancelled = true; };
  }, [script, surahNumber]);

  /**
   * Get the text for a specific ayah in the current script.
   * Returns null if we should use the default local text.
   */
  const getScriptText = useCallback(
    (ayahNumber: number): string | null => {
      if (script === 'uthmani') return null;
      return scriptTexts.get(ayahNumber) ?? null;
    },
    [script, scriptTexts]
  );

  return {
    script,
    getScriptText,
    isScriptLoading: loading,
    isAlternateScript: script !== 'uthmani',
  };
}
