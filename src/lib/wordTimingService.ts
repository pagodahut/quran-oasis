/**
 * Word Timing Service for Quran Recitation
 *
 * Provides word-level timing data for synchronized highlighting
 * Uses Quran.com API for word data and estimates timing based on audio duration
 */

import logger from '@/lib/logger';

/** Raw word object from Quran.com API v4 */
interface QuranComApiWord {
  char_type_name: string;
  position: number;
  text: string;
  text_uthmani: string;
  translation?: { text: string };
  transliteration?: { text: string };
}

export interface WordData {
  position: number;
  text: string;
  transliteration?: string;
  translation?: string;
  audioStart: number; // seconds
  audioEnd: number; // seconds
}

export interface AyahWordTiming {
  surah: number;
  ayah: number;
  words: WordData[];
  totalDuration: number;
}

// Cache for word timing data
const timingCache = new Map<string, AyahWordTiming>();

/**
 * Split Arabic text into words
 */
export function splitArabicIntoWords(text: string): string[] {
  // Remove verse number markers and clean the text
  const cleaned = text
    .replace(/[\u06DD\u0660-\u0669۰-۹]+/g, '') // Remove verse markers and Arabic numerals
    .replace(/\s+/g, ' ')
    .trim();
  
  // Split by spaces but keep the word boundaries correct
  return cleaned.split(' ').filter(word => word.length > 0);
}

/**
 * Estimate word timings based on character count and total duration
 * This provides approximate timing when exact timestamps aren't available
 */
export function estimateWordTimings(
  words: string[],
  totalDuration: number
): WordData[] {
  // Calculate total character count (rough proxy for word length)
  const totalChars = words.reduce((sum, word) => sum + word.length, 0);
  
  // Add pause time between words (about 10% of total time)
  const pauseTime = totalDuration * 0.1;
  const speakingTime = totalDuration - pauseTime;
  const pausePerWord = pauseTime / (words.length - 1 || 1);
  
  let currentTime = 0;
  
  return words.map((word, index) => {
    // Duration proportional to word length
    const wordDuration = (word.length / totalChars) * speakingTime;
    const start = currentTime;
    const end = currentTime + wordDuration;
    
    currentTime = end + (index < words.length - 1 ? pausePerWord : 0);
    
    return {
      position: index + 1,
      text: word,
      audioStart: start,
      audioEnd: end,
    };
  });
}

/**
 * Get word timing for an ayah
 * Fetches word data from Quran.com API and estimates timing
 */
export async function getAyahWordTiming(
  surah: number,
  ayah: number,
  audioDuration?: number
): Promise<AyahWordTiming | null> {
  const cacheKey = `${surah}:${ayah}`;
  
  // Check cache first
  if (timingCache.has(cacheKey)) {
    const cached = timingCache.get(cacheKey)!;
    // If we have a new duration, recalculate timing
    if (audioDuration && Math.abs(cached.totalDuration - audioDuration) > 0.1) {
      const words = cached.words.map(w => w.text);
      const newTiming = estimateWordTimings(words, audioDuration);
      cached.words = newTiming.map((t, i) => ({ ...cached.words[i], ...t }));
      cached.totalDuration = audioDuration;
    }
    return cached;
  }

  try {
    // Fetch word data from Quran.com API
    const response = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani,transliteration,translation`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch word data: ${response.status}`);
    }
    
    const data = await response.json();
    const verse = data.verse;
    
    if (!verse || !verse.words) {
      throw new Error('No word data available');
    }
    
    // Filter out non-word elements (like verse numbers)
    const wordObjects = (verse.words as QuranComApiWord[]).filter((w) => w.char_type_name === 'word');

    // Default duration if not provided (estimate ~0.8 sec per word)
    const duration = audioDuration || wordObjects.length * 0.8;

    const words = wordObjects.map((w) => w.text_uthmani);
    const wordTimings = estimateWordTimings(words, duration);
    
    // Enhance with additional data
    const enhancedWords: WordData[] = wordTimings.map((timing, i) => ({
      ...timing,
      transliteration: wordObjects[i]?.transliteration?.text,
      translation: wordObjects[i]?.translation?.text,
    }));
    
    const result: AyahWordTiming = {
      surah,
      ayah,
      words: enhancedWords,
      totalDuration: duration,
    };
    
    // Cache the result
    timingCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    logger.error('Error fetching word timing:', error);
    return null;
  }
}

/**
 * Get word timing from local text (fallback when API is unavailable)
 */
export function getWordTimingFromText(
  surah: number,
  ayah: number,
  arabicText: string,
  audioDuration: number
): AyahWordTiming {
  const cacheKey = `${surah}:${ayah}:local`;
  
  if (timingCache.has(cacheKey)) {
    const cached = timingCache.get(cacheKey)!;
    if (Math.abs(cached.totalDuration - audioDuration) <= 0.1) {
      return cached;
    }
  }
  
  const words = splitArabicIntoWords(arabicText);
  const wordTimings = estimateWordTimings(words, audioDuration);
  
  const result: AyahWordTiming = {
    surah,
    ayah,
    words: wordTimings,
    totalDuration: audioDuration,
  };
  
  timingCache.set(cacheKey, result);
  return result;
}

/**
 * Find the current word index based on playback time
 */
export function getCurrentWordIndex(
  timing: AyahWordTiming,
  currentTime: number
): number {
  for (let i = 0; i < timing.words.length; i++) {
    const word = timing.words[i];
    if (currentTime >= word.audioStart && currentTime < word.audioEnd) {
      return i;
    }
  }
  
  // If past all words, return last word
  if (currentTime >= timing.words[timing.words.length - 1]?.audioEnd) {
    return timing.words.length - 1;
  }
  
  // If before first word, return -1
  return -1;
}

/**
 * Clear timing cache
 */
export function clearTimingCache(): void {
  timingCache.clear();
}
