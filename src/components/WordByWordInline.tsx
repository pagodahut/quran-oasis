'use client';

/**
 * Word-by-Word Inline Component
 * 
 * Displays Quran text with inline word-by-word translation underneath each word,
 * similar to Darussalam books and Quranly app.
 * 
 * Features:
 * - Arabic word with translation below
 * - Optional transliteration
 * - Tap to hear individual word audio
 * - Highlight sync with verse audio playback
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import { usePreferences, ARABIC_FONT_STYLE_OPTIONS } from '@/lib/preferencesStore';
import logger from '@/lib/logger';

// Types
interface WordData {
  position: number;
  text: string;
  textUthmani: string;
  textIndopak?: string;
  translation: string;
  transliteration?: string;
  audioUrl?: string;
}

interface WordByWordInlineProps {
  surah: number;
  ayah: number;
  /** Current audio time for highlight sync */
  currentTime?: number;
  /** Is verse audio playing */
  isPlaying?: boolean;
  /** Show transliteration below translation */
  showTransliteration?: boolean;
  /** Callback when word is tapped */
  onWordTap?: (word: WordData) => void;
  /** Custom class name */
  className?: string;
}

// Quran.com CDN base for word audio
const WORD_AUDIO_BASE = 'https://audio.qurancdn.com/';

// Cache for word data
const wordCache = new Map<string, WordData[]>();

/**
 * Fetch word-by-word data from Quran.com API
 */
async function fetchWordData(surah: number, ayah: number): Promise<WordData[]> {
  const cacheKey = `${surah}:${ayah}`;
  
  if (wordCache.has(cacheKey)) {
    return wordCache.get(cacheKey)!;
  }
  
  const response = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani,text_indopak,translation,transliteration`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${response.status}`);
  }
  
  const data = await response.json();
  const verse = data.verse;
  
  if (!verse?.words) {
    throw new Error('No word data');
  }
  
  // Filter to actual words (not verse numbers)
  const words: WordData[] = verse.words
    .filter((w: any) => w.char_type_name === 'word')
    .map((w: any) => ({
      position: w.position,
      text: w.text,
      textUthmani: w.text_uthmani,
      textIndopak: w.text_indopak,
      translation: w.translation?.text || '',
      transliteration: w.transliteration?.text || undefined,
      audioUrl: w.audio_url ? WORD_AUDIO_BASE + w.audio_url : undefined,
    }));
  
  wordCache.set(cacheKey, words);
  return words;
}

/**
 * Play word audio
 */
async function playWordAudio(audioUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio failed'));
    audio.play().catch(reject);
  });
}

export default function WordByWordInline({
  surah,
  ayah,
  currentTime,
  isPlaying,
  showTransliteration = true,
  onWordTap,
  className = '',
}: WordByWordInlineProps) {
  const { preferences, isLoaded } = usePreferences();
  const [words, setWords] = useState<WordData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingWord, setPlayingWord] = useState<number | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  
  // Get font family from preferences
  const fontStyle = isLoaded ? preferences.display.arabicFontStyle : 'uthmani';
  const fontOption = ARABIC_FONT_STYLE_OPTIONS.find(f => f.value === fontStyle);
  const fontFamily = fontOption?.fontFamily || 'var(--font-arabic)';
  const fontSize = isLoaded ? preferences.display.arabicFontSizePx : 28;
  
  // Fetch word data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    
    fetchWordData(surah, ayah)
      .then(data => {
        if (mounted) {
          setWords(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      });
    
    return () => { mounted = false; };
  }, [surah, ayah]);
  
  // Estimate current word from playback time (rough approximation)
  useEffect(() => {
    if (!isPlaying || currentTime === undefined || !words) {
      setCurrentWordIndex(-1);
      return;
    }
    
    // Rough estimate: divide time equally among words
    const avgWordDuration = 0.8; // seconds per word estimate
    const estimatedIndex = Math.floor(currentTime / avgWordDuration);
    setCurrentWordIndex(Math.min(estimatedIndex, words.length - 1));
  }, [currentTime, isPlaying, words]);
  
  // Handle word tap
  const handleWordTap = useCallback(async (word: WordData, index: number) => {
    if (onWordTap) {
      onWordTap(word);
    }
    
    if (!word.audioUrl) return;
    
    setPlayingWord(index);
    try {
      await playWordAudio(word.audioUrl);
    } catch (e) {
      logger.error('Word audio failed:', e);
    }
    setPlayingWord(null);
  }, [onWordTap]);
  
  // Loading state
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
        <span className="ml-2 text-night-400 text-sm">Loading word-by-word...</span>
      </div>
    );
  }
  
  // Error state
  if (error || !words) {
    return (
      <div className={`text-center py-4 text-night-500 text-sm ${className}`}>
        Word-by-word unavailable
      </div>
    );
  }
  
  return (
    <div className={`word-by-word-inline ${className}`}>
      {/* Words grid - RTL flex wrap */}
      <div 
        className="flex flex-wrap gap-x-4 gap-y-6 justify-center items-start"
        style={{ direction: 'rtl' }}
      >
        {words.map((word, index) => {
          const isActive = index === currentWordIndex;
          const isWordPlaying = index === playingWord;
          
          return (
            <motion.button
              key={`${word.position}-${word.text}`}
              onClick={() => handleWordTap(word, index)}
              className={`
                word-block flex flex-col items-center text-center
                px-2 py-1 rounded-lg transition-all duration-200
                ${isActive || isWordPlaying 
                  ? 'bg-gold-500/20 shadow-glow-gold' 
                  : 'hover:bg-night-800/50'
                }
                focus:outline-none focus:ring-2 focus:ring-gold-500/50
              `}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                scale: isActive ? 1.05 : 1,
                y: isActive ? -2 : 0,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Arabic word */}
              <span 
                className={`
                  block leading-relaxed
                  ${isActive || isWordPlaying ? 'text-gold-300' : 'text-night-100'}
                `}
                style={{ 
                  fontFamily,
                  fontSize: fontSize,
                  direction: 'rtl',
                }}
              >
                {fontStyle === 'indopak' && word.textIndopak ? word.textIndopak : word.textUthmani}
              </span>
              
              {/* Transliteration */}
              {showTransliteration && word.transliteration && (
                <span className="text-xs text-night-500 italic mt-1" style={{ direction: 'ltr' }}>
                  {word.transliteration}
                </span>
              )}
              
              {/* Translation */}
              <span 
                className={`
                  text-sm mt-1 max-w-[100px] leading-tight
                  ${isActive || isWordPlaying ? 'text-gold-400' : 'text-night-400'}
                `}
                style={{ direction: 'ltr' }}
              >
                {word.translation}
              </span>
              
              {/* Playing indicator */}
              <AnimatePresence>
                {isWordPlaying && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold-500 flex items-center justify-center"
                  >
                    <Volume2 className="w-2.5 h-2.5 text-night-950" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      
      {/* Progress bar when playing */}
      {isPlaying && words.length > 0 && currentWordIndex >= 0 && (
        <div className="mt-4 px-4">
          <div className="h-1 bg-night-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
              animate={{ 
                width: `${((currentWordIndex + 1) / words.length) * 100}%`
              }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to prefetch word data for upcoming verses
 */
export function usePrefetchWordData(surah: number, startAyah: number, count: number = 3) {
  useEffect(() => {
    // Prefetch next few verses
    for (let i = 0; i < count; i++) {
      const ayah = startAyah + i;
      fetchWordData(surah, ayah).catch(() => {});
    }
  }, [surah, startAyah, count]);
}
