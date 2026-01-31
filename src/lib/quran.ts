/**
 * Quran Data Utilities
 * Fetches from EveryAyah.com and Al-Quran Cloud API
 */

// ============ TYPES ============

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
  number: number;        // Ayah number within surah
  numberInQuran: number; // Absolute position (1-6236)
  text: string;          // Arabic text
  surah: number;
  juz: number;
  page: number;
  translation?: string;
}

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: string;
  everyAyahFolder: string;  // Folder name on EveryAyah.com
}

// ============ RECITERS ============

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'Murattal',
    everyAyahFolder: 'Alafasy_128kbps'
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'Murattal',
    everyAyahFolder: 'Husary_128kbps'
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبدالرحمن السديس',
    style: 'Murattal',
    everyAyahFolder: 'Abdurrahmaan_As-Sudais_192kbps'
  },
  {
    id: 'abdul_basit',
    name: 'Abdul Basit Abdul Samad',
    arabicName: 'عبدالباسط عبدالصمد',
    style: 'Mujawwad',
    everyAyahFolder: 'Abdul_Basit_Mujawwad_128kbps'
  },
  {
    id: 'ghamadi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    style: 'Murattal',
    everyAyahFolder: 'Ghamadi_40kbps'
  }
];

// ============ AUDIO URLS ============

/**
 * Get audio URL for a specific ayah from EveryAyah.com
 * Format: https://everyayah.com/data/{reciter}/{surah:03d}{ayah:03d}.mp3
 */
export function getAyahAudioUrl(surah: number, ayah: number, reciterId: string = 'alafasy'): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const surahStr = surah.toString().padStart(3, '0');
  const ayahStr = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciter.everyAyahFolder}/${surahStr}${ayahStr}.mp3`;
}

/**
 * Get Bismillah audio (001001.mp3 - Al-Fatiha verse 1)
 */
export function getBismillahAudioUrl(reciterId: string = 'alafasy'): string {
  return getAyahAudioUrl(1, 1, reciterId);
}

/**
 * Get preview audio for reciter selection (Al-Fatiha verse 1-3)
 */
export function getReciterPreviewUrls(reciterId: string): string[] {
  return [
    getAyahAudioUrl(1, 1, reciterId),
    getAyahAudioUrl(1, 2, reciterId),
    getAyahAudioUrl(1, 3, reciterId)
  ];
}

// ============ QURAN API ============

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';

/**
 * Fetch all surahs metadata
 */
export async function fetchAllSurahs(): Promise<Surah[]> {
  const res = await fetch(`${QURAN_API_BASE}/surah`);
  const data = await res.json();
  return data.data;
}

/**
 * Fetch a specific surah with Arabic text
 */
export async function fetchSurah(surahNumber: number): Promise<{ surah: Surah; ayahs: Ayah[] }> {
  const res = await fetch(`${QURAN_API_BASE}/surah/${surahNumber}`);
  const data = await res.json();
  
  return {
    surah: {
      number: data.data.number,
      name: data.data.name,
      englishName: data.data.englishName,
      englishNameTranslation: data.data.englishNameTranslation,
      numberOfAyahs: data.data.numberOfAyahs,
      revelationType: data.data.revelationType
    },
    ayahs: data.data.ayahs.map((a: any) => ({
      number: a.numberInSurah,
      numberInQuran: a.number,
      text: a.text,
      surah: surahNumber,
      juz: a.juz,
      page: a.page
    }))
  };
}

/**
 * Fetch surah with translation
 */
export async function fetchSurahWithTranslation(
  surahNumber: number, 
  translationEdition: string = 'en.sahih'
): Promise<{ surah: Surah; ayahs: Ayah[] }> {
  const [arabicRes, transRes] = await Promise.all([
    fetch(`${QURAN_API_BASE}/surah/${surahNumber}`),
    fetch(`${QURAN_API_BASE}/surah/${surahNumber}/${translationEdition}`)
  ]);
  
  const arabicData = await arabicRes.json();
  const transData = await transRes.json();
  
  const ayahs: Ayah[] = arabicData.data.ayahs.map((a: any, i: number) => ({
    number: a.numberInSurah,
    numberInQuran: a.number,
    text: a.text,
    surah: surahNumber,
    juz: a.juz,
    page: a.page,
    translation: transData.data.ayahs[i]?.text
  }));
  
  return {
    surah: {
      number: arabicData.data.number,
      name: arabicData.data.name,
      englishName: arabicData.data.englishName,
      englishNameTranslation: arabicData.data.englishNameTranslation,
      numberOfAyahs: arabicData.data.numberOfAyahs,
      revelationType: arabicData.data.revelationType
    },
    ayahs
  };
}

/**
 * Fetch a specific ayah
 */
export async function fetchAyah(surah: number, ayah: number): Promise<Ayah> {
  const res = await fetch(`${QURAN_API_BASE}/ayah/${surah}:${ayah}`);
  const data = await res.json();
  
  return {
    number: data.data.numberInSurah,
    numberInQuran: data.data.number,
    text: data.data.text,
    surah: data.data.surah.number,
    juz: data.data.juz,
    page: data.data.page
  };
}

/**
 * Search the Quran
 */
export async function searchQuran(query: string, edition: string = 'en.sahih'): Promise<any[]> {
  const res = await fetch(`${QURAN_API_BASE}/search/${encodeURIComponent(query)}/all/${edition}`);
  const data = await res.json();
  return data.data?.matches || [];
}

// ============ SURAH METADATA ============
// Quick reference without API call

export const SURAH_NAMES: { [key: number]: { arabic: string; english: string; translation: string; ayahs: number } } = {
  1: { arabic: 'الفاتحة', english: 'Al-Fatiha', translation: 'The Opening', ayahs: 7 },
  2: { arabic: 'البقرة', english: 'Al-Baqarah', translation: 'The Cow', ayahs: 286 },
  3: { arabic: 'آل عمران', english: "Ali 'Imran", translation: 'Family of Imran', ayahs: 200 },
  // ... (would include all 114 surahs)
  112: { arabic: 'الإخلاص', english: 'Al-Ikhlas', translation: 'The Sincerity', ayahs: 4 },
  113: { arabic: 'الفلق', english: 'Al-Falaq', translation: 'The Daybreak', ayahs: 5 },
  114: { arabic: 'الناس', english: 'An-Nas', translation: 'Mankind', ayahs: 6 }
};

// Juz Amma surahs (Juz 30) - commonly memorized first
export const JUZ_AMMA_SURAHS = [78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];
