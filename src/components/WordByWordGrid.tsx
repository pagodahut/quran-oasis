'use client';

/**
 * Word-by-Word Grid Component
 * 
 * Displays Quran words in a responsive RTL grid layout.
 * Each cell is a liquid-glass card showing Arabic, transliteration, and translation.
 * Tap any word to hear its pronunciation.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Loader2 } from 'lucide-react';
import { usePreferences, ARABIC_FONT_STYLE_OPTIONS } from '@/lib/preferencesStore';

interface WordData {
  position: number;
  text: string;
  textUthmani: string;
  textIndopak?: string;
  translation: string;
  transliteration?: string;
  audioUrl?: string;
}

interface WordByWordGridProps {
  surah: number;
  ayah: number;
  className?: string;
}

const WORD_AUDIO_BASE = 'https://audio.qurancdn.com/';

const wordCache = new Map<string, WordData[]>();

async function fetchWordData(surah: number, ayah: number): Promise<WordData[]> {
  const cacheKey = `${surah}:${ayah}`;
  if (wordCache.has(cacheKey)) return wordCache.get(cacheKey)!;

  const response = await fetch(
    `https://api.quran.com/api/v4/verses/by_key/${surah}:${ayah}?words=true&word_fields=text_uthmani,text_indopak,translation,transliteration`
  );
  if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

  const data = await response.json();
  const verse = data.verse;
  if (!verse?.words) throw new Error('No word data');

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

async function playWordAudio(audioUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => resolve();
    audio.onerror = () => reject(new Error('Audio failed'));
    audio.play().catch(reject);
  });
}

export default function WordByWordGrid({ surah, ayah, className = '' }: WordByWordGridProps) {
  const { preferences, isLoaded } = usePreferences();
  const [words, setWords] = useState<WordData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingWord, setPlayingWord] = useState<number | null>(null);

  const fontStyle = isLoaded ? preferences.display.arabicFontStyle : 'uthmani';
  const fontOption = ARABIC_FONT_STYLE_OPTIONS.find(f => f.value === fontStyle);
  const fontFamily = fontOption?.fontFamily || 'var(--font-arabic)';
  const fontSize = isLoaded ? preferences.display.arabicFontSizePx : 28;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    fetchWordData(surah, ayah)
      .then(data => { if (mounted) { setWords(data); setLoading(false); } })
      .catch(err => { if (mounted) { setError(err.message); setLoading(false); } });

    return () => { mounted = false; };
  }, [surah, ayah]);

  const handleWordTap = useCallback(async (word: WordData, index: number) => {
    if (!word.audioUrl) return;
    setPlayingWord(index);
    try {
      await playWordAudio(word.audioUrl);
    } catch (e) {
      console.error('Word audio failed:', e);
    }
    setPlayingWord(null);
  }, []);

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-8 ${className}`}>
        <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
        <span className="ml-2 text-night-400 text-sm">Loading word grid...</span>
      </div>
    );
  }

  if (error || !words) {
    return (
      <div className={`text-center py-4 text-night-500 text-sm ${className}`}>
        Word-by-word unavailable
      </div>
    );
  }

  return (
    <div
      className={`word-by-word-grid ${className}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '0.75rem',
        direction: 'rtl',
      }}
    >
      {words.map((word, index) => {
        const isWordPlaying = index === playingWord;

        return (
          <motion.button
            key={`${word.position}-${word.text}`}
            onClick={(e) => { e.stopPropagation(); handleWordTap(word, index); }}
            className={`
              relative flex flex-col items-center text-center
              p-3 rounded-xl transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-gold-500/50
              ${isWordPlaying
                ? 'bg-gold-500/20 shadow-glow-gold border-gold-500/30'
                : 'hover:bg-white/[0.06] border-white/[0.06]'
              }
            `}
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid',
              borderColor: isWordPlaying ? 'rgba(201,162,39,0.3)' : 'rgba(255,255,255,0.06)',
              background: isWordPlaying
                ? 'rgba(201,162,39,0.12)'
                : 'rgba(255,255,255,0.02)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Arabic word */}
            <span
              className={`block leading-relaxed mb-1.5 ${isWordPlaying ? 'text-gold-300' : 'text-night-100'}`}
              style={{
                fontFamily,
                fontSize: Math.max(fontSize * 0.85, 20),
                direction: 'rtl',
              }}
            >
              {fontStyle === 'indopak' && word.textIndopak ? word.textIndopak : word.textUthmani}
            </span>

            {/* Transliteration */}
            {word.transliteration && (
              <span className="text-[10px] text-night-500 italic leading-tight" style={{ direction: 'ltr' }}>
                {word.transliteration}
              </span>
            )}

            {/* Translation */}
            <span
              className={`text-[11px] mt-1 leading-tight ${isWordPlaying ? 'text-gold-400' : 'text-night-400'}`}
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
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center"
                >
                  <Volume2 className="w-3 h-3 text-night-950" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
