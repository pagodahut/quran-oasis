'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Pause } from 'lucide-react';
import { playWord } from '@/lib/audioService';
import {
  getAyahWordTiming,
  getWordTimingFromText,
  getCurrentWordIndex,
  type AyahWordTiming,
  type WordData,
} from '@/lib/wordTimingService';
import { getAudioUrl } from '@/lib/quranData';
import { useAudioPreferences, useDisplayPreferences } from '@/lib/preferencesStore';

interface WordByWordProps {
  surah: number;
  ayah: number;
  arabicText: string;
  reciterId?: string;
  isPlaying: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  fontSize?: number;
  showWordTranslation?: boolean;
  onWordTap?: (wordIndex: number, word: WordData) => void;
}

export default function WordByWord({
  surah,
  ayah,
  arabicText,
  reciterId,
  isPlaying,
  audioRef,
  fontSize,
  showWordTranslation = false,
  onWordTap,
}: WordByWordProps) {
  // Use preferences
  const { audio: audioPrefs } = useAudioPreferences();
  const { display: displayPrefs } = useDisplayPreferences();
  
  // Use prop values if provided, otherwise use preferences
  const effectiveReciterId = reciterId || audioPrefs.reciter;
  const effectiveFontSize = fontSize || displayPrefs.arabicFontSizePx;
  const [wordTiming, setWordTiming] = useState<AyahWordTiming | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [playingWordIndex, setPlayingWordIndex] = useState(-1);
  const [hoveredWordIndex, setHoveredWordIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // Fetch word timing data
  useEffect(() => {
    let mounted = true;
    
    async function fetchTiming() {
      try {
        // First try API
        const timing = await getAyahWordTiming(surah, ayah);
        if (timing && mounted) {
          setWordTiming(timing);
          return;
        }
      } catch (e) {
        console.warn('Failed to fetch word timing from API:', e);
      }
      
      // Fallback to local text parsing
      if (mounted) {
        const localTiming = getWordTimingFromText(
          surah,
          ayah,
          arabicText,
          10 // Default estimate
        );
        setWordTiming(localTiming);
      }
    }
    
    fetchTiming();
    
    return () => {
      mounted = false;
    };
  }, [surah, ayah, arabicText]);

  // Update timing when audio duration is known
  useEffect(() => {
    if (!audioRef.current || !wordTiming) return;
    
    const audio = audioRef.current;
    
    const handleLoadedMetadata = () => {
      if (audio.duration && wordTiming) {
        const updatedTiming = getWordTimingFromText(
          surah,
          ayah,
          arabicText,
          audio.duration
        );
        setWordTiming(updatedTiming);
      }
    };
    
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // If already loaded
    if (audio.duration) {
      handleLoadedMetadata();
    }
    
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audioRef, surah, ayah, arabicText, wordTiming]);

  // Sync word highlighting with audio playback
  useEffect(() => {
    if (!isPlaying || !wordTiming || !audioRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (!isPlaying) {
        setCurrentWordIndex(-1);
      }
      return;
    }
    
    const audio = audioRef.current;
    
    const updateHighlight = () => {
      const wordIdx = getCurrentWordIndex(wordTiming, audio.currentTime);
      setCurrentWordIndex(wordIdx);
      
      if (isPlaying) {
        animationRef.current = requestAnimationFrame(updateHighlight);
      }
    };
    
    animationRef.current = requestAnimationFrame(updateHighlight);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isPlaying, wordTiming, audioRef]);

  // Handle word tap for individual playback
  const handleWordTap = useCallback(async (index: number, word: WordData) => {
    if (onWordTap) {
      onWordTap(index, word);
    }
    
    setPlayingWordIndex(index);
    
    try {
      await playWord(word.text, {
        onEnd: () => setPlayingWordIndex(-1),
        onError: () => setPlayingWordIndex(-1),
      });
    } catch (e) {
      setPlayingWordIndex(-1);
    }
  }, [onWordTap]);

  if (!wordTiming) {
    // Loading state or fallback to simple text
    return (
      <p 
        className="quran-text text-night-100"
        style={{ fontSize: effectiveFontSize, direction: 'rtl' }}
      >
        {arabicText}
      </p>
    );
  }

  return (
    <div ref={containerRef} className="word-by-word-container">
      <div 
        className="flex flex-wrap gap-x-3 gap-y-4 justify-center"
        style={{ direction: 'rtl' }}
      >
        {wordTiming.words.map((word, index) => {
          const isCurrentWord = index === currentWordIndex;
          const isPlayingWord = index === playingWordIndex;
          const isHovered = index === hoveredWordIndex;
          
          return (
            <motion.button
              key={`${word.position}-${word.text}`}
              onClick={() => handleWordTap(index, word)}
              onMouseEnter={() => setHoveredWordIndex(index)}
              onMouseLeave={() => setHoveredWordIndex(-1)}
              className={`word-tap-target relative rounded-lg transition-all duration-200 focus-visible-ring ${
                isCurrentWord || isPlayingWord
                  ? 'bg-gold-500/30 text-gold-300 shadow-glow-gold'
                  : isHovered
                    ? 'bg-night-800/60 text-night-100'
                    : 'text-night-200'
              }`}
              style={{
                fontFamily: 'var(--font-quran)',
                fontSize: effectiveFontSize,
              }}
              animate={{
                scale: isCurrentWord ? 1.08 : isPlayingWord ? 1.05 : 1,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              aria-label={`Word ${index + 1}: ${word.text}. Tap to hear pronunciation.`}
              aria-pressed={isPlayingWord}
            >
              {/* Word text */}
              <span className="relative z-10">{word.text}</span>
              
              {/* Highlight underline */}
              <AnimatePresence>
                {(isCurrentWord || isPlayingWord) && (
                  <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-400"
                    style={{ originX: 0.5 }}
                  />
                )}
              </AnimatePresence>
              
              {/* Playing indicator */}
              {isPlayingWord && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center"
                >
                  <Volume2 className="w-3 h-3 text-night-950" />
                </motion.div>
              )}
              
              {/* Word translation tooltip */}
              <AnimatePresence>
                {showWordTranslation && isHovered && word.translation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-20"
                    style={{ direction: 'ltr' }}
                  >
                    <div className="liquid-tooltip whitespace-nowrap">
                      <p className="text-night-100 text-sm">{word.translation}</p>
                      {word.transliteration && (
                        <p className="text-night-400 text-xs mt-0.5">
                          {word.transliteration}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      
      {/* Progress indicator */}
      {isPlaying && wordTiming.words.length > 0 && (
        <div className="mt-4">
          <div className="h-1 bg-night-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-600 to-gold-400"
              initial={{ width: 0 }}
              animate={{ 
                width: currentWordIndex >= 0 
                  ? `${((currentWordIndex + 1) / wordTiming.words.length) * 100}%`
                  : '0%'
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <div className="flex justify-between text-xs text-night-500 mt-1">
            <span>Word {Math.max(0, currentWordIndex + 1)}</span>
            <span>of {wordTiming.words.length}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================
// Styles (add to globals.css if needed)
// ============================================

const WordByWordStyles = `
  .word-by-word-container {
    @apply relative;
  }
  
  .word-item {
    @apply cursor-pointer select-none;
    touch-action: manipulation;
  }
  
  .word-item:active {
    @apply scale-95;
  }
  
  @media (hover: none) {
    .word-item:hover {
      @apply bg-transparent;
    }
  }
`;
