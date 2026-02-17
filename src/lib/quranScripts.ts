/**
 * Quran Script Text Fetcher
 * 
 * Fetches verse text in different script editions from api.quran.com.
 * Used when user selects IndoPak script (different text rendering than Uthmani).
 * Uthmani text comes from local JSON, IndoPak is fetched from API.
 */

export type QuranScript = 'uthmani' | 'indopak';

export const QURAN_SCRIPT_OPTIONS: {
  value: QuranScript;
  label: string;
  description: string;
  arabicSample: string;
  apiEndpoint: string;
  textField: string;
}[] = [
  {
    value: 'uthmani',
    label: 'Uthmani',
    description: 'Standard Uthmani script used in most Mushafs worldwide',
    arabicSample: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ',
    apiEndpoint: 'uthmani',
    textField: 'text_uthmani',
  },
  {
    value: 'indopak',
    label: 'Indo-Pak',
    description: 'Popular script style used in South Asian Mushafs',
    arabicSample: 'بِسۡمِ اللهِ الرَّحۡمٰنِ الرَّحِيۡمِ',
    apiEndpoint: 'indopak',
    textField: 'text_indopak',
  },
];

interface ScriptVerse {
  id: number;
  verse_key: string;
  text: string;
}

// In-memory cache: script -> surah -> verses
const scriptCache = new Map<string, Map<number, ScriptVerse[]>>();

/**
 * Fetch verse texts for a surah in a specific script edition.
 * Returns a map of ayahNumber -> text.
 */
export async function fetchScriptText(
  script: QuranScript,
  surahNumber: number
): Promise<Map<number, string>> {
  // Uthmani is served from local data, no need to fetch
  if (script === 'uthmani') {
    return new Map();
  }

  const cacheKey = script;
  if (!scriptCache.has(cacheKey)) {
    scriptCache.set(cacheKey, new Map());
  }
  const surahCache = scriptCache.get(cacheKey)!;

  // Check cache
  if (surahCache.has(surahNumber)) {
    const cached = surahCache.get(surahNumber)!;
    const result = new Map<number, string>();
    for (const v of cached) {
      const ayahNum = parseInt(v.verse_key.split(':')[1]);
      result.set(ayahNum, v.text);
    }
    return result;
  }

  const option = QURAN_SCRIPT_OPTIONS.find(o => o.value === script);
  if (!option) return new Map();

  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/quran/verses/${option.apiEndpoint}?chapter_number=${surahNumber}`
    );
    
    if (!res.ok) {
      console.error(`[QuranScripts] API error: ${res.status}`);
      return new Map();
    }

    const data = await res.json();
    const verses: ScriptVerse[] = (data.verses || []).map((v: Record<string, unknown>) => ({
      id: v.id as number,
      verse_key: v.verse_key as string,
      text: v[option.textField] as string,
    }));

    // Cache
    surahCache.set(surahNumber, verses);

    const result = new Map<number, string>();
    for (const v of verses) {
      const ayahNum = parseInt(v.verse_key.split(':')[1]);
      result.set(ayahNum, v.text);
    }
    return result;
  } catch (err) {
    console.error('[QuranScripts] Fetch error:', err);
    return new Map();
  }
}

/**
 * Preload adjacent surahs for smoother navigation
 */
export function preloadScript(script: QuranScript, surahNumber: number): void {
  if (script === 'uthmani') return;
  
  // Preload current and adjacent
  fetchScriptText(script, surahNumber);
  if (surahNumber > 1) fetchScriptText(script, surahNumber - 1);
  if (surahNumber < 114) fetchScriptText(script, surahNumber + 1);
}
