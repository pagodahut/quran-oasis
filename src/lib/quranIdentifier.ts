/**
 * Quran Verse Identifier — "Shazam for Quran"
 * 
 * Takes transcribed Arabic text and identifies the matching verse
 * from the full Quran dataset using fuzzy text matching.
 */

import { normalizeArabic, arabicSimilarity } from './realtimeTajweedService';

export interface VerseMatch {
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  ayahText: string;
  similarity: number;
  translation?: string;
}

// Build a lightweight search index from Quran data at import time
let searchIndex: Array<{
  surahNumber: number;
  surahName: string;
  surahNameArabic: string;
  ayahNumber: number;
  text: string;
  normalized: string;
}> | null = null;

async function getSearchIndex() {
  if (searchIndex) return searchIndex;
  
  // Dynamic import to avoid loading 600KB+ Quran data eagerly
  const quranData = (await import('@/data/complete_quran.json')).default as any;
  
  searchIndex = [];
  for (const surah of quranData.surahs) {
    for (const ayah of surah.ayahs) {
      searchIndex.push({
        surahNumber: surah.number,
        surahName: surah.englishName,
        surahNameArabic: surah.name,
        ayahNumber: ayah.numberInSurah,
        text: ayah.text?.arabic || ayah.text || '',
        normalized: normalizeArabic(ayah.text?.arabic || ayah.text || ''),
      });
    }
  }
  
  return searchIndex;
}

/**
 * Identify which Quran verse(s) match the given transcribed text.
 * Returns top matches sorted by similarity score.
 */
export async function identifyVerse(
  transcribedText: string,
  maxResults: number = 5
): Promise<VerseMatch[]> {
  const index = await getSearchIndex();
  const normalizedInput = normalizeArabic(transcribedText);
  const inputWords = normalizedInput.split(/\s+/).filter(w => w.length > 0);
  
  if (inputWords.length === 0) return [];
  
  const matches: VerseMatch[] = [];
  
  for (const entry of index) {
    // Quick pre-filter: check if at least one input word appears in the verse
    const hasOverlap = inputWords.some(word => 
      entry.normalized.includes(word.slice(0, 3)) // First 3 chars as prefix check
    );
    if (!hasOverlap) continue;
    
    // Full similarity check
    const sim = computeVerseSimilarity(normalizedInput, entry.normalized);
    
    if (sim > 0.3) {
      matches.push({
        surahNumber: entry.surahNumber,
        surahName: entry.surahName,
        surahNameArabic: entry.surahNameArabic,
        ayahNumber: entry.ayahNumber,
        ayahText: entry.text,
        similarity: sim,
      });
    }
  }
  
  // Sort by similarity descending, take top N
  matches.sort((a, b) => b.similarity - a.similarity);
  return matches.slice(0, maxResults);
}

/**
 * Compute similarity between transcribed text and a verse.
 * Uses a combination of word-level matching and subsequence matching.
 */
function computeVerseSimilarity(input: string, verse: string): number {
  const inputWords = input.split(/\s+/).filter(w => w.length > 0);
  const verseWords = verse.split(/\s+/).filter(w => w.length > 0);
  
  if (inputWords.length === 0 || verseWords.length === 0) return 0;
  
  // Count how many input words match verse words (order-preserving)
  let matchCount = 0;
  let verseIdx = 0;
  
  for (const inputWord of inputWords) {
    let bestSim = 0;
    let bestIdx = -1;
    
    // Search forward in verse from current position
    for (let j = verseIdx; j < verseWords.length; j++) {
      const sim = arabicSimilarity(inputWord, verseWords[j]);
      if (sim > bestSim && sim > 0.5) {
        bestSim = sim;
        bestIdx = j;
      }
    }
    
    if (bestIdx >= 0) {
      matchCount += bestSim;
      verseIdx = bestIdx + 1;
    }
  }
  
  // Normalize by the length of the shorter text
  const minLen = Math.min(inputWords.length, verseWords.length);
  return matchCount / minLen;
}

/**
 * Check if Web Speech API supports Arabic recognition
 */
export function supportsArabicSpeech(): boolean {
  return !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );
}
