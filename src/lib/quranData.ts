/**
 * Quran Data Utility — Code-split per surah
 *
 * Metadata (17 KB) is loaded synchronously.
 * Individual surah data is loaded on demand via dynamic import.
 */

import metadataJson from '@/data/quran-metadata.json';
import pageIndexJson from '@/data/page-index.json';

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

export type SurahMeta = Omit<Surah, 'ayahs'>;

export interface QuranData {
  metadata: QuranMetadata;
  surahs: Surah[];
}

// ============ METADATA (sync, 17 KB) ============

const metadata = metadataJson as { metadata: QuranMetadata; surahs: SurahMeta[] };
const pageIndex = pageIndexJson as Record<string, number[]>;

// ============ SURAH CACHE ============

const surahCache = new Map<number, Surah>();

async function loadSurah(surahNumber: number): Promise<Surah | undefined> {
  if (surahNumber < 1 || surahNumber > 114) return undefined;
  const cached = surahCache.get(surahNumber);
  if (cached) return cached;

  try {
    const mod = await import(`@/data/surahs/${surahNumber}.json`);
    const surah = mod.default as Surah;
    surahCache.set(surahNumber, surah);
    return surah;
  } catch {
    return undefined;
  }
}

// ============ DATA ACCESS ============

/**
 * Get all surahs (metadata only, no ayahs) — synchronous
 */
export function getAllSurahs(): SurahMeta[] {
  return metadata.surahs;
}

/**
 * Get a specific surah with all ayahs — async (dynamic import)
 */
export async function getSurah(surahNumber: number): Promise<Surah | undefined> {
  return loadSurah(surahNumber);
}

/**
 * Get a specific ayah — async
 */
export async function getAyah(surahNumber: number, ayahNumber: number): Promise<Ayah | undefined> {
  const surah = await getSurah(surahNumber);
  return surah?.ayahs.find(a => a.numberInSurah === ayahNumber);
}

/**
 * Get ayahs by juz — async, loads only relevant surahs
 */
export async function getAyahsByJuz(juzNumber: number): Promise<{ surah: number; ayah: Ayah }[]> {
  const results: { surah: number; ayah: Ayah }[] = [];
  const surahs = await Promise.all(
    metadata.surahs.map(m => loadSurah(m.number))
  );

  for (const surah of surahs) {
    if (!surah) continue;
    for (const ayah of surah.ayahs) {
      if (ayah.juz === juzNumber) {
        results.push({ surah: surah.number, ayah });
      }
    }
  }

  return results;
}

/**
 * Get ayahs by page — async, uses page index to load only relevant surahs
 */
export async function getAyahsByPage(pageNumber: number): Promise<{ surah: Surah; ayah: Ayah }[]> {
  const surahNumbers = pageIndex[String(pageNumber)] || [];
  const surahs = await Promise.all(surahNumbers.map(n => loadSurah(n)));
  const results: { surah: Surah; ayah: Ayah }[] = [];

  for (const surah of surahs) {
    if (!surah) continue;
    for (const ayah of surah.ayahs) {
      if (ayah.page === pageNumber) {
        results.push({ surah, ayah });
      }
    }
  }

  return results;
}

/**
 * Search in Arabic text or translation — async, loads all surahs on first call
 */
export async function searchQuran(query: string, searchIn: 'arabic' | 'translation' | 'both' = 'both'): Promise<{
  surah: number;
  surahName: string;
  ayah: Ayah;
}[]> {
  const results: { surah: number; surahName: string; ayah: Ayah }[] = [];
  const lowerQuery = query.toLowerCase();

  const surahs = await Promise.all(
    metadata.surahs.map(m => loadSurah(m.number))
  );

  for (const surah of surahs) {
    if (!surah) continue;
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
 * Get total statistics — synchronous (metadata only)
 */
export function getQuranStats() {
  return {
    totalSurahs: metadata.metadata.total_surahs,
    totalVerses: metadata.metadata.total_verses,
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
  description: string;
  tags: string[];
  sampleUrl: string;
  listenOnly?: boolean;
  surahAudioUrl?: string;
}

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'Murattal',
    folder: 'Alafasy_128kbps',
    description: 'Kuwaiti imam known for his beautiful, melodic voice. One of the most popular reciters worldwide.',
    tags: ['melodic', 'emotional', 'popular'],
    sampleUrl: 'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'Murattal',
    folder: 'Husary_128kbps',
    description: 'Egyptian master, considered the gold standard for tajweed precision. His recordings are used for memorization globally.',
    tags: ['precise', 'tajweed', 'classic'],
    sampleUrl: 'https://everyayah.com/data/Husary_128kbps/001001.mp3',
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبدالرحمن السديس',
    style: 'Murattal',
    folder: 'Abdurrahmaan_As-Sudais_192kbps',
    description: 'Imam of Masjid al-Haram in Makkah. Powerful, reverent recitation that millions hear during Hajj.',
    tags: ['powerful', 'reverent', 'Makkah'],
    sampleUrl: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/001001.mp3',
  },
  {
    id: 'abdul_basit',
    name: 'Abdul Basit Abdul Samad',
    arabicName: 'عبدالباسط عبدالصمد',
    style: 'Mujawwad',
    folder: 'Abdul_Basit_Mujawwad_128kbps',
    description: 'Legendary Egyptian reciter famed for his mujawwad (elaborate) style. UNESCO recognized his voice.',
    tags: ['mujawwad', 'legendary', 'elaborate'],
    sampleUrl: 'https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/001001.mp3',
  },
  {
    id: 'ghamadi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    style: 'Murattal',
    folder: 'Ghamadi_40kbps',
    description: 'Saudi reciter with a calm, soothing voice. Great for daily listening and relaxation.',
    tags: ['calm', 'soothing', 'gentle'],
    sampleUrl: 'https://everyayah.com/data/Ghamadi_40kbps/001001.mp3',
  },
  {
    id: 'shuraym',
    name: "Sa'ud ash-Shuraym",
    arabicName: 'سعود الشريم',
    style: 'Murattal',
    folder: 'Saood_ash-Shuraym_128kbps',
    description: 'Imam of Masjid al-Haram. Clear, measured pace ideal for following along.',
    tags: ['clear', 'measured', 'Makkah'],
    sampleUrl: 'https://everyayah.com/data/Saood_ash-Shuraym_128kbps/001001.mp3',
  },
  {
    id: 'hani_rifai',
    name: 'Hani ar-Rifai',
    arabicName: 'هاني الرفاعي',
    style: 'Murattal',
    folder: 'Hani_Rifai_192kbps',
    description: 'Saudi reciter known for his sweet, gentle tone. Popular for bedtime and calm recitation.',
    tags: ['sweet', 'gentle', 'soft'],
    sampleUrl: 'https://everyayah.com/data/Hani_Rifai_192kbps/001001.mp3',
  },
  {
    id: 'yasser_dossari',
    name: 'Yasser Ad-Dossari',
    arabicName: 'ياسر الدوسري',
    style: 'Murattal',
    folder: 'Yasser_Ad-Dussary_128kbps',
    description: 'Young Saudi reciter with a powerful, emotional style. Rising star.',
    tags: ['emotional', 'powerful', 'modern'],
    sampleUrl: 'https://everyayah.com/data/Yasser_Ad-Dussary_128kbps/001001.mp3',
  },
];

export const DEFAULT_RECITER_ID = 'alafasy';

export function supportsPerAyah(reciterId: string): boolean {
  const reciter = RECITERS.find(r => r.id === reciterId);
  return reciter ? !reciter.listenOnly : true;
}

export function getEffectiveReciterForPerAyah(reciterId: string): string {
  return supportsPerAyah(reciterId) ? reciterId : DEFAULT_RECITER_ID;
}

export function getSurahAudioUrl(surah: number, reciterId: string): string | null {
  const reciter = RECITERS.find(r => r.id === reciterId);
  if (!reciter?.surahAudioUrl) return null;
  const surahStr = surah.toString().padStart(3, '0');
  return reciter.surahAudioUrl.replace('{surah}', surahStr);
}

export function getAudioUrl(surah: number, ayah: number, reciterId: string = 'alafasy'): string {
  const effectiveId = getEffectiveReciterForPerAyah(reciterId);
  const reciter = RECITERS.find(r => r.id === effectiveId) || RECITERS[0];
  const surahStr = surah.toString().padStart(3, '0');
  const ayahStr = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciter.folder}/${surahStr}${ayahStr}.mp3`;
}

export function getReciterPreview(reciterId: string): string[] {
  return [1, 2, 3].map(ayah => getAudioUrl(1, ayah, reciterId));
}

// ============ HELPERS ============

export const JUZ_AMMA = Array.from({ length: 37 }, (_, i) => 78 + i);

export const SHORT_SURAHS = [108, 112, 110, 113, 114, 103, 101, 107, 106, 111, 105, 109, 104, 102, 100, 99, 97, 95, 94, 93];

export async function getSurahDifficulty(surahNumber: number): Promise<'beginner' | 'intermediate' | 'advanced'> {
  const surah = await getSurah(surahNumber);
  if (!surah) return 'advanced';

  if (surah.numberOfAyahs <= 10) return 'beginner';
  if (surah.numberOfAyahs <= 50) return 'intermediate';
  return 'advanced';
}

export async function formatVerseRef(surah: number, ayah: number): Promise<string> {
  const surahData = await getSurah(surah);
  if (!surahData) return `${surah}:${ayah}`;
  return `${surahData.englishName} ${surah}:${ayah}`;
}

export const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

const BISMILLAH_PATTERNS = [
  'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ',
  'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
  'بسم الله الرحمن الرحيم',
];

export function shouldShowBismillah(surahNumber: number): boolean {
  return surahNumber !== 1 && surahNumber !== 9;
}

export function cleanAyahText(text: string, surahNumber: number, ayahNumber: number): string {
  if (surahNumber === 1 || ayahNumber !== 1) {
    return text;
  }

  let cleaned = text.trim();
  const normalizedCleaned = cleaned.normalize('NFC');
  for (const pattern of BISMILLAH_PATTERNS) {
    const normalizedPattern = pattern.normalize('NFC');
    if (normalizedCleaned.startsWith(normalizedPattern)) {
      cleaned = normalizedCleaned.slice(normalizedPattern.length).trim();
      break;
    }
  }

  return cleaned;
}

export function getAyahTextForDisplay(ayah: Ayah, surahNumber: number): string {
  return cleanAyahText(ayah.text.arabic, surahNumber, ayah.numberInSurah);
}
