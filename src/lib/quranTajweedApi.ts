/**
 * Quran Tajweed API Wrapper
 * 
 * Fetches tajweed-annotated text from Quran.com API and parses it
 * into structured word data for the Live Recitation feature.
 * 
 * API: GET https://api.quran.com/api/v4/quran/verses/uthmani_tajweed
 * Returns HTML with <tajweed class=RULE> tags
 */

// ============ Types ============

export interface TajweedSegment {
  text: string;
  rule: string | null; // tajweed class name or null for plain text
}

export interface TajweedWord {
  /** The full word text (with diacritics) */
  text: string;
  /** The word's tajweed segments (sub-word coloring) */
  segments: TajweedSegment[];
  /** Raw HTML from API for this word */
  rawHtml: string;
  /** Index of this word within its verse */
  wordIndex: number;
  /** Verse key (e.g., "1:1") */
  verseKey: string;
}

export interface TajweedVerse {
  verseKey: string;
  verseNumber: number;
  surahNumber: number;
  /** All words in this verse with tajweed data */
  words: TajweedWord[];
  /** Full raw HTML from API */
  rawHtml: string;
  /** Plain text (no HTML) */
  plainText: string;
}

export interface TajweedSurahData {
  surahNumber: number;
  verses: TajweedVerse[];
  /** All words across all verses, flattened */
  allWords: TajweedWord[];
  /** All plain text words for alignment */
  plainWords: string[];
}

// ============ Cache ============

const cache = new Map<string, TajweedVerse[]>();

// ============ API Functions ============

/**
 * Fetch tajweed-annotated text for a range of verses
 */
export async function fetchTajweedVerses(
  surahNumber: number,
  startAyah: number = 1,
  endAyah?: number
): Promise<TajweedVerse[]> {
  const cacheKey = `${surahNumber}:${startAyah}-${endAyah || 'end'}`;
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  const verses: TajweedVerse[] = [];
  
  // Quran.com API supports fetching by chapter
  // We'll fetch all verses for the chapter and filter
  try {
    const url = new URL('https://api.quran.com/api/v4/quran/verses/uthmani_tajweed');
    url.searchParams.set('chapter_number', surahNumber.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`Quran.com API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.verses || !Array.isArray(data.verses)) {
      throw new Error('Invalid API response format');
    }
    
    for (const verse of data.verses) {
      const verseKey = verse.verse_key as string;
      const [, ayahStr] = verseKey.split(':');
      const ayahNum = parseInt(ayahStr, 10);
      
      // Filter to requested range
      if (ayahNum < startAyah) continue;
      if (endAyah && ayahNum > endAyah) continue;
      
      const rawHtml = verse.text_uthmani_tajweed as string;
      const parsed = parseTajweedHtml(rawHtml, verseKey);
      
      verses.push(parsed);
    }
  } catch (error) {
    console.error('Failed to fetch tajweed data:', error);
    throw error;
  }
  
  cache.set(cacheKey, verses);
  return verses;
}

/**
 * Fetch and structure tajweed data for a full surah
 */
export async function fetchTajweedSurah(
  surahNumber: number,
  startAyah: number = 1,
  endAyah?: number
): Promise<TajweedSurahData> {
  const verses = await fetchTajweedVerses(surahNumber, startAyah, endAyah);
  
  const allWords: TajweedWord[] = [];
  const plainWords: string[] = [];
  
  for (const verse of verses) {
    for (const word of verse.words) {
      allWords.push(word);
      plainWords.push(word.text);
    }
  }
  
  return {
    surahNumber,
    verses,
    allWords,
    plainWords,
  };
}

// ============ HTML Parsing ============

/**
 * Parse tajweed HTML from Quran.com API into structured data
 * 
 * Input format: "بِسۡمِ <tajweed class=laam_shamsiyah>ٱ</tajweed>للَّهِ..."
 * 
 * We split by spaces to get words, then parse each word's HTML.
 */
function parseTajweedHtml(html: string, verseKey: string): TajweedVerse {
  const [surahStr, ayahStr] = verseKey.split(':');
  
  // Strip the end-of-ayah marker for word splitting purposes
  // but keep the raw HTML intact
  const cleanHtml = html.trim();
  
  // Split HTML into word chunks by spaces
  // But we need to be careful: spaces inside tags shouldn't split
  const wordHtmls = splitHtmlIntoWords(cleanHtml);
  
  const words: TajweedWord[] = [];
  
  for (let i = 0; i < wordHtmls.length; i++) {
    const wordHtml = wordHtmls[i].trim();
    if (!wordHtml) continue;
    
    const segments = parseWordSegments(wordHtml);
    const plainText = segments.map(s => s.text).join('');
    
    // Skip ayah number markers (they're just numbers in circles)
    if (/^[\u06DD\u0660-\u0669۰-۹٠-٩0-9]+$/.test(plainText)) continue;
    
    words.push({
      text: plainText,
      segments,
      rawHtml: wordHtml,
      wordIndex: words.length,
      verseKey,
    });
  }
  
  const plainText = words.map(w => w.text).join(' ');
  
  return {
    verseKey,
    verseNumber: parseInt(ayahStr, 10),
    surahNumber: parseInt(surahStr, 10),
    words,
    rawHtml: cleanHtml,
    plainText,
  };
}

/**
 * Split tajweed HTML into word-level chunks, respecting tags
 */
function splitHtmlIntoWords(html: string): string[] {
  const words: string[] = [];
  let current = '';
  let inTag = false;
  
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    
    if (char === '<') {
      inTag = true;
      current += char;
    } else if (char === '>') {
      inTag = false;
      current += char;
    } else if (char === ' ' && !inTag) {
      if (current.trim()) {
        words.push(current);
      }
      current = '';
    } else {
      current += char;
    }
  }
  
  if (current.trim()) {
    words.push(current);
  }
  
  return words;
}

/**
 * Parse a single word's HTML into tajweed segments
 */
function parseWordSegments(wordHtml: string): TajweedSegment[] {
  const segments: TajweedSegment[] = [];
  
  // Match <tajweed class=RULE>text</tajweed> and plain text
  const tagRegex = /<tajweed\s+class=([^>]+)>([^<]*)<\/tajweed>/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = tagRegex.exec(wordHtml)) !== null) {
    // Add any plain text before this tag
    if (match.index > lastIndex) {
      const plainText = wordHtml.slice(lastIndex, match.index);
      if (plainText) {
        segments.push({ text: plainText, rule: null });
      }
    }
    
    const rule = match[1].trim();
    const text = match[2];
    
    if (text) {
      segments.push({ text, rule });
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining plain text after last tag
  if (lastIndex < wordHtml.length) {
    const remaining = wordHtml.slice(lastIndex);
    // Strip any remaining HTML tags
    const clean = remaining.replace(/<[^>]+>/g, '');
    if (clean) {
      segments.push({ text: clean, rule: null });
    }
  }
  
  return segments;
}

/**
 * Clear the tajweed cache
 */
export function clearTajweedCache(): void {
  cache.clear();
}
