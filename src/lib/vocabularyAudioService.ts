/**
 * Vocabulary Audio Service
 *
 * Provides human-recited audio for Quranic vocabulary using:
 * - Quran.com Word-by-Word API (77k+ words with human audio)
 * 
 * NO AI/TTS - all audio is from authentic human reciters
 */

import logger from '@/lib/logger';

// ============================================
// Types
// ============================================

/** Raw word object from Quran.com API v4 */
interface QuranComApiWord {
  char_type_name: string;
  position: number;
  text: string;
  text_uthmani: string;
  translation?: { text: string };
  transliteration?: { text: string };
  audio_url?: string;
}

export interface QuranWord {
  position: number;
  text: string;
  textUthmani: string;
  translation: string;
  transliteration?: string;
  audioUrl: string;
}

export interface VocabularyMatch {
  word: string;
  audioUrl: string;
  surah: number;
  ayah: number;
  position: number;
}

// ============================================
// Constants
// ============================================

const QURAN_API_BASE = 'https://api.quran.com/api/v4';
const AUDIO_CDN_BASE = 'https://audio.qurancdn.com';

// Cache for word lookups
const wordCache = new Map<string, VocabularyMatch>();
const verseCache = new Map<string, QuranWord[]>();

// ============================================
// Pre-mapped common vocabulary
// Format: word -> { surah, ayah, position }
// ============================================

const VOCABULARY_MAP: Record<string, { surah: number; ayah: number; position: number }> = {
  // Al-Fatiha vocabulary
  'بِسْمِ': { surah: 1, ayah: 1, position: 1 },
  'ٱللَّهِ': { surah: 1, ayah: 1, position: 2 },
  'ٱلرَّحْمَـٰنِ': { surah: 1, ayah: 1, position: 3 },
  'ٱلرَّحِيمِ': { surah: 1, ayah: 1, position: 4 },
  'ٱلْحَمْدُ': { surah: 1, ayah: 2, position: 1 },
  'لِلَّهِ': { surah: 1, ayah: 2, position: 2 },
  'رَبِّ': { surah: 1, ayah: 2, position: 3 },
  'ٱلْعَـٰلَمِينَ': { surah: 1, ayah: 2, position: 4 },
  'مَـٰلِكِ': { surah: 1, ayah: 4, position: 1 },
  'يَوْمِ': { surah: 1, ayah: 4, position: 2 },
  'ٱلدِّينِ': { surah: 1, ayah: 4, position: 3 },
  'إِيَّاكَ': { surah: 1, ayah: 5, position: 1 },
  'نَعْبُدُ': { surah: 1, ayah: 5, position: 2 },
  'نَسْتَعِينُ': { surah: 1, ayah: 5, position: 4 },
  'ٱهْدِنَا': { surah: 1, ayah: 6, position: 1 },
  'ٱلصِّرَٰطَ': { surah: 1, ayah: 6, position: 2 },
  'ٱلْمُسْتَقِيمَ': { surah: 1, ayah: 6, position: 3 },
  'صِرَٰطَ': { surah: 1, ayah: 7, position: 1 },
  'ٱلَّذِينَ': { surah: 1, ayah: 7, position: 2 },
  'أَنْعَمْتَ': { surah: 1, ayah: 7, position: 3 },
  'عَلَيْهِمْ': { surah: 1, ayah: 7, position: 4 },
  'غَيْرِ': { surah: 1, ayah: 7, position: 5 },
  'ٱلْمَغْضُوبِ': { surah: 1, ayah: 7, position: 6 },
  'وَلَا': { surah: 1, ayah: 7, position: 8 },
  'ٱلضَّآلِّينَ': { surah: 1, ayah: 7, position: 9 },
  
  // Names of Allah (from various verses)
  'الله': { surah: 1, ayah: 1, position: 2 },
  'الرَّحْمَٰن': { surah: 1, ayah: 1, position: 3 },
  'الرَّحِيم': { surah: 1, ayah: 1, position: 4 },
  'الْمَلِك': { surah: 59, ayah: 23, position: 4 },
  'الْقُدُّوس': { surah: 59, ayah: 23, position: 5 },
  'السَّلَام': { surah: 59, ayah: 23, position: 6 },
  'الْمُؤْمِن': { surah: 59, ayah: 23, position: 7 },
  'الْمُهَيْمِن': { surah: 59, ayah: 23, position: 8 },
  'الْعَزِيز': { surah: 59, ayah: 23, position: 9 },
  'الْجَبَّار': { surah: 59, ayah: 23, position: 10 },
  'الْمُتَكَبِّر': { surah: 59, ayah: 23, position: 11 },
  'الْخَالِق': { surah: 59, ayah: 24, position: 3 },
  'الْبَارِئ': { surah: 59, ayah: 24, position: 4 },
  'الْمُصَوِّر': { surah: 59, ayah: 24, position: 5 },
  
  // Common Quranic words from Surah Al-Ikhlas
  'قُلْ': { surah: 112, ayah: 1, position: 1 },
  'هُوَ': { surah: 112, ayah: 1, position: 2 },
  'أَحَدٌ': { surah: 112, ayah: 1, position: 4 },
  'ٱلصَّمَدُ': { surah: 112, ayah: 2, position: 2 },
  'لَمْ': { surah: 112, ayah: 3, position: 1 },
  'يَلِدْ': { surah: 112, ayah: 3, position: 2 },
  'يُولَدْ': { surah: 112, ayah: 3, position: 5 },
  'كُفُوًا': { surah: 112, ayah: 4, position: 5 },
  
  // Common particles and words
  'مِن': { surah: 113, ayah: 1, position: 2 },
  'شَرِّ': { surah: 113, ayah: 2, position: 2 },
  'مَا': { surah: 113, ayah: 2, position: 3 },
  'خَلَقَ': { surah: 113, ayah: 2, position: 4 },
  'إِذَا': { surah: 113, ayah: 3, position: 2 },
  'وَقَبَ': { surah: 113, ayah: 3, position: 3 },
  'فِي': { surah: 114, ayah: 5, position: 3 },
  'صُدُورِ': { surah: 114, ayah: 5, position: 4 },
  'ٱلنَّاسِ': { surah: 114, ayah: 6, position: 1 },
  'ٱلْجِنَّةِ': { surah: 114, ayah: 6, position: 3 },
};

// ============================================
// Helper Functions
// ============================================

/**
 * Normalize Arabic text for comparison
 */
function normalizeArabic(text: string): string {
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    .replace(/[ٱأإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
}

/**
 * Build audio URL from position
 */
function buildAudioUrl(surah: number, ayah: number, position: number): string {
  const surahStr = surah.toString().padStart(3, '0');
  const ayahStr = ayah.toString().padStart(3, '0');
  const posStr = position.toString().padStart(3, '0');
  return `${AUDIO_CDN_BASE}/wbw/${surahStr}_${ayahStr}_${posStr}.mp3`;
}

// ============================================
// Main Functions
// ============================================

/**
 * Get audio URL for a vocabulary word
 */
export function getVocabularyAudioUrl(word: string): string | null {
  const normalized = normalizeArabic(word);
  
  // Direct match
  if (VOCABULARY_MAP[word]) {
    const { surah, ayah, position } = VOCABULARY_MAP[word];
    return buildAudioUrl(surah, ayah, position);
  }
  
  // Check normalized versions
  for (const [key, value] of Object.entries(VOCABULARY_MAP)) {
    if (normalizeArabic(key) === normalized) {
      return buildAudioUrl(value.surah, value.ayah, value.position);
    }
  }
  
  // Check cache
  const cached = wordCache.get(normalized);
  if (cached) {
    return cached.audioUrl;
  }
  
  return null;
}

/**
 * Fetch word data for a specific verse from Quran.com API
 */
export async function fetchVerseWords(surah: number, ayah: number): Promise<QuranWord[]> {
  const cacheKey = `${surah}:${ayah}`;
  
  if (verseCache.has(cacheKey)) {
    return verseCache.get(cacheKey)!;
  }
  
  try {
    const response = await fetch(
      `${QURAN_API_BASE}/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani,audio_url,transliteration,translation`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const verse = data.verse;
    
    if (!verse?.words) {
      return [];
    }
    
    const words: QuranWord[] = (verse.words as QuranComApiWord[])
      .filter((w) => w.char_type_name === 'word')
      .map((w) => ({
        position: w.position,
        text: w.text,
        textUthmani: w.text_uthmani,
        translation: w.translation?.text || '',
        transliteration: w.transliteration?.text || undefined,
        audioUrl: w.audio_url ? `${AUDIO_CDN_BASE}/${w.audio_url}` : '',
      }));
    
    verseCache.set(cacheKey, words);
    
    // Add to word cache
    words.forEach(w => {
      const norm = normalizeArabic(w.textUthmani);
      if (!wordCache.has(norm)) {
        wordCache.set(norm, {
          word: w.textUthmani,
          audioUrl: w.audioUrl,
          surah,
          ayah,
          position: w.position,
        });
      }
    });
    
    return words;
  } catch (error) {
    logger.error('Failed to fetch verse words:', error);
    return [];
  }
}

// ============================================
// Audio Playback
// ============================================

let currentAudio: HTMLAudioElement | null = null;

export function stopVocabularyAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

export async function playVocabularyAudio(
  audioUrl: string,
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}
): Promise<boolean> {
  stopVocabularyAudio();
  
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    
    audio.oncanplaythrough = () => {
      options.onStart?.();
    };
    
    audio.onended = () => {
      currentAudio = null;
      options.onEnd?.();
      resolve(true);
    };
    
    audio.onerror = () => {
      currentAudio = null;
      options.onError?.('Audio playback failed');
      resolve(false);
    };
    
    audio.play().catch((e) => {
      options.onError?.(e.message);
      resolve(false);
    });
  });
}

/**
 * Play vocabulary word with human audio
 */
export async function playVocabulary(
  word: string,
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}
): Promise<boolean> {
  const audioUrl = getVocabularyAudioUrl(word);
  
  if (!audioUrl) {
    return false;
  }
  
  return playVocabularyAudio(audioUrl, options);
}

/**
 * Pre-load common vocabulary
 */
export async function preloadCommonVocabulary(): Promise<void> {
  const commonVerses = [
    { surah: 1, ayah: 1 }, { surah: 1, ayah: 2 }, { surah: 1, ayah: 3 },
    { surah: 1, ayah: 4 }, { surah: 1, ayah: 5 }, { surah: 1, ayah: 6 },
    { surah: 1, ayah: 7 },
    { surah: 112, ayah: 1 }, { surah: 112, ayah: 2 }, { surah: 112, ayah: 3 },
    { surah: 112, ayah: 4 },
    { surah: 113, ayah: 1 }, { surah: 114, ayah: 1 },
  ];
  
  await Promise.all(
    commonVerses.map(v => fetchVerseWords(v.surah, v.ayah).catch(() => []))
  );
}
