/**
 * Complete Quran Data Utility
 * Uses offline JSON for fast, reliable access
 */

import quranData from '@/data/complete_quran.json';

// ============ TYPES ============

export interface QuranMetadata {
  total_surahs: number;
  total_verses: number;
  source: string;
  arabic_edition: string;
  translations: {
    asad: string;
    sahih: string;
  };
}

export interface AyahText {
  arabic: string;
  translations: {
    asad: string;
    sahih: string;
  };
}

export interface Ayah {
  number: number;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  text: AyahText;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: 'Meccan' | 'Medinan';
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface QuranData {
  metadata: QuranMetadata;
  surahs: Surah[];
}

// ============ DATA ACCESS ============

const data = quranData as QuranData;

/**
 * Get all surahs (metadata only, no ayahs)
 */
export function getAllSurahs(): Omit<Surah, 'ayahs'>[] {
  return data.surahs.map(({ ayahs, ...surah }) => surah);
}

/**
 * Get a specific surah with all ayahs
 */
export function getSurah(surahNumber: number): Surah | undefined {
  return data.surahs.find(s => s.number === surahNumber);
}

/**
 * Get a specific ayah
 */
export function getAyah(surahNumber: number, ayahNumber: number): Ayah | undefined {
  const surah = getSurah(surahNumber);
  return surah?.ayahs.find(a => a.numberInSurah === ayahNumber);
}

/**
 * Get ayahs by juz
 */
export function getAyahsByJuz(juzNumber: number): { surah: number; ayah: Ayah }[] {
  const results: { surah: number; ayah: Ayah }[] = [];
  
  for (const surah of data.surahs) {
    for (const ayah of surah.ayahs) {
      if (ayah.juz === juzNumber) {
        results.push({ surah: surah.number, ayah });
      }
    }
  }
  
  return results;
}

/**
 * Get ayahs by page
 */
export function getAyahsByPage(pageNumber: number): { surah: Surah; ayah: Ayah }[] {
  const results: { surah: Surah; ayah: Ayah }[] = [];
  
  for (const surah of data.surahs) {
    for (const ayah of surah.ayahs) {
      if (ayah.page === pageNumber) {
        results.push({ surah, ayah });
      }
    }
  }
  
  return results;
}

/**
 * Search in Arabic text or translation
 */
export function searchQuran(query: string, searchIn: 'arabic' | 'translation' | 'both' = 'both'): {
  surah: number;
  surahName: string;
  ayah: Ayah;
}[] {
  const results: { surah: number; surahName: string; ayah: Ayah }[] = [];
  const lowerQuery = query.toLowerCase();
  
  for (const surah of data.surahs) {
    for (const ayah of surah.ayahs) {
      let match = false;
      
      if (searchIn === 'arabic' || searchIn === 'both') {
        if (ayah.text.arabic.includes(query)) {
          match = true;
        }
      }
      
      if (searchIn === 'translation' || searchIn === 'both') {
        if (
          ayah.text.translations.sahih.toLowerCase().includes(lowerQuery) ||
          ayah.text.translations.asad.toLowerCase().includes(lowerQuery)
        ) {
          match = true;
        }
      }
      
      if (match) {
        results.push({
          surah: surah.number,
          surahName: surah.englishName,
          ayah,
        });
      }
    }
  }
  
  return results;
}

/**
 * Get total statistics
 */
export function getQuranStats() {
  return {
    totalSurahs: data.metadata.total_surahs,
    totalVerses: data.metadata.total_verses,
    totalJuz: 30,
    totalPages: 604,
    totalManzil: 7,
    totalRuku: 558,
  };
}

// ============ AUDIO ============

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: string;
  folder: string;
  listenOnly?: boolean; // Full surah only, no per-ayah audio
  surahAudioUrl?: string; // URL pattern for full surah (use {surah} placeholder)
}

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'Murattal',
    folder: 'Alafasy_128kbps',
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'Murattal',
    folder: 'Husary_128kbps',
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبدالرحمن السديس',
    style: 'Murattal',
    folder: 'Abdurrahmaan_As-Sudais_192kbps',
  },
  {
    id: 'abdul_basit',
    name: 'Abdul Basit Abdul Samad',
    arabicName: 'عبدالباسط عبدالصمد',
    style: 'Mujawwad',
    folder: 'Abdul_Basit_Mujawwad_128kbps',
  },
  {
    id: 'ghamadi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    style: 'Murattal',
    folder: 'Ghamadi_40kbps',
  },
  {
    id: 'hazza',
    name: 'Hazza Al Balushi',
    arabicName: 'هزاع البلوشي',
    style: 'Murattal',
    folder: '', // No EveryAyah folder
    listenOnly: true,
    surahAudioUrl: 'https://ia801208.us.archive.org/33/items/Quran-Huzza-Al_Baloushi/{surah}.mp3',
  },
];

// Default reciter for fallback when listen-only reciter can't be used
export const DEFAULT_RECITER_ID = 'alafasy';

/**
 * Check if a reciter supports per-ayah audio
 */
export function supportsPerAyah(reciterId: string): boolean {
  const reciter = RECITERS.find(r => r.id === reciterId);
  return reciter ? !reciter.listenOnly : true;
}

/**
 * Get full surah audio URL for listen-only reciters
 */
export function getSurahAudioUrl(surah: number, reciterId: string): string | null {
  const reciter = RECITERS.find(r => r.id === reciterId);
  if (!reciter?.surahAudioUrl) return null;
  const surahStr = surah.toString().padStart(3, '0');
  return reciter.surahAudioUrl.replace('{surah}', surahStr);
}

/**
 * Get audio URL for an ayah
 */
export function getAudioUrl(surah: number, ayah: number, reciterId: string = 'alafasy'): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const surahStr = surah.toString().padStart(3, '0');
  const ayahStr = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciter.folder}/${surahStr}${ayahStr}.mp3`;
}

/**
 * Get preview audio URLs (first 3 verses of Al-Fatiha)
 */
export function getReciterPreview(reciterId: string): string[] {
  return [1, 2, 3].map(ayah => getAudioUrl(1, ayah, reciterId));
}

// ============ HELPERS ============

/**
 * Juz Amma surahs (78-114)
 */
export const JUZ_AMMA = Array.from({ length: 37 }, (_, i) => 78 + i);

/**
 * Short surahs for beginners (sorted by length)
 */
export const SHORT_SURAHS = [108, 112, 110, 113, 114, 103, 101, 107, 106, 111, 105, 109, 104, 102, 100, 99, 97, 95, 94, 93];

/**
 * Get surah difficulty level based on length
 */
export function getSurahDifficulty(surahNumber: number): 'beginner' | 'intermediate' | 'advanced' {
  const surah = getSurah(surahNumber);
  if (!surah) return 'advanced';
  
  if (surah.numberOfAyahs <= 10) return 'beginner';
  if (surah.numberOfAyahs <= 50) return 'intermediate';
  return 'advanced';
}

/**
 * Format verse reference
 */
export function formatVerseRef(surah: number, ayah: number): string {
  const surahData = getSurah(surah);
  if (!surahData) return `${surah}:${ayah}`;
  return `${surahData.englishName} ${surah}:${ayah}`;
}

/**
 * Get Bismillah (except for Surah 9)
 */
export const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

// Various Bismillah text patterns that might appear in data
const BISMILLAH_PATTERNS = [
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ',
  'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  'بسم الله الرحمن الرحيم',
];

export function shouldShowBismillah(surahNumber: number): boolean {
  return surahNumber !== 1 && surahNumber !== 9;
}

/**
 * Clean ayah text by removing Bismillah prefix if present
 * Bismillah is only counted as part of ayah 1 in Al-Fatiha (surah 1)
 * For all other surahs, Bismillah is separate and should not be in ayah 1 text
 * This ensures audio sync with EveryAyah.com which doesn't include Bismillah in ayah 1 audio
 */
export function cleanAyahText(text: string, surahNumber: number, ayahNumber: number): string {
  // Only clean ayah 1 of non-Fatiha surahs
  if (surahNumber === 1 || ayahNumber !== 1) {
    return text;
  }
  
  // Remove Bismillah prefix if present
  let cleaned = text.trim();
  for (const pattern of BISMILLAH_PATTERNS) {
    if (cleaned.startsWith(pattern)) {
      cleaned = cleaned.slice(pattern.length).trim();
      break;
    }
  }
  
  return cleaned;
}

/**
 * Get ayah text with Bismillah handling
 */
export function getAyahTextForDisplay(ayah: Ayah, surahNumber: number): string {
  return cleanAyahText(ayah.text.arabic, surahNumber, ayah.numberInSurah);
}
