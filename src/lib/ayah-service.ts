/**
 * Ayah Service
 * 
 * Fetches Quran ayah data from Quran.com API with caching.
 */

import type { ReviewAyah } from '@/hooks/useSheikhReview';

const QURAN_API = 'https://api.quran.com/api/v4';

// In-memory cache
const ayahCache = new Map<string, ReviewAyah>();

// Surah names lookup
const SURAH_NAMES: Record<number, { en: string; ar: string }> = {
  1: { en: 'Al-Fatiha', ar: 'الفاتحة' },
  2: { en: 'Al-Baqarah', ar: 'البقرة' },
  36: { en: 'Ya-Sin', ar: 'يس' },
  67: { en: 'Al-Mulk', ar: 'الملك' },
  112: { en: 'Al-Ikhlas', ar: 'الإخلاص' },
  113: { en: 'Al-Falaq', ar: 'الفلق' },
  114: { en: 'An-Nas', ar: 'الناس' },
};

function getSurahName(surahNumber: number): { en: string; ar: string } {
  return SURAH_NAMES[surahNumber] || { en: `Surah ${surahNumber}`, ar: `سورة ${surahNumber}` };
}

export async function fetchAyah(surahNumber: number, ayahNumber: number): Promise<ReviewAyah> {
  const key = `${surahNumber}:${ayahNumber}`;
  
  // Check cache
  const cached = ayahCache.get(key);
  if (cached) return cached;

  try {
    // Fetch from Quran.com API
    const res = await fetch(`${QURAN_API}/verses/by_key/${key}?translations=131&fields=text_uthmani`);
    if (!res.ok) throw new Error('Failed to fetch ayah');
    
    const data = await res.json();
    const verse = data.verse;
    const surahInfo = getSurahName(surahNumber);

    const ayah: ReviewAyah = {
      surahNumber,
      surahName: surahInfo.en,
      surahNameArabic: surahInfo.ar,
      ayahNumber,
      arabicText: verse?.text_uthmani || '',
      translation: verse?.translations?.[0]?.text || '',
    };

    ayahCache.set(key, ayah);
    return ayah;
  } catch (error) {
    console.error('Error fetching ayah:', error);
    const surahInfo = getSurahName(surahNumber);
    
    // Return minimal data
    return {
      surahNumber,
      surahName: surahInfo.en,
      surahNameArabic: surahInfo.ar,
      ayahNumber,
      arabicText: '',
      translation: '',
    };
  }
}

export async function fetchAyahs(refs: { surahNumber: number; ayahNumber: number }[]): Promise<ReviewAyah[]> {
  return Promise.all(refs.map(r => fetchAyah(r.surahNumber, r.ayahNumber)));
}

/**
 * Convert SRS state references to full ReviewAyah format
 */
export async function enrichSRSRefs(
  refs: { surahNumber: number; ayahNumber: number; daysSinceReview?: number; lastAccuracy?: number }[]
): Promise<ReviewAyah[]> {
  const ayahs = await fetchAyahs(refs);
  return ayahs.map((ayah, i) => ({
    ...ayah,
    daysSinceReview: refs[i].daysSinceReview,
    lastAccuracy: refs[i].lastAccuracy,
  }));
}
