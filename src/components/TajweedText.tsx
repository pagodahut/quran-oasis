'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { getTajweedColor } from '@/lib/tajweedColorMap';
import type { TajweedWord } from '@/lib/quranTajweedApi';

// ============ Types ============

export type WordState = 'hidden' | 'current' | 'revealed' | 'error' | 'missed';

interface TajweedTextProps {
  /** All words grouped by verse */
  verses: {
    verseKey: string;
    verseNumber: number;
    words: TajweedWord[];
  }[];
  /** State for each word (indexed globally across all verses) */
  wordStates: WordState[];
  /** Currently active word index (global) */
  currentWordIndex: number;
  /** Callback when a word is tapped */
  onWordTap?: (globalIndex: number) => void;
  /** Whether to show ayah markers */
  showAyahMarkers?: boolean;
}

// ============ Ayah Number Component ============

function AyahMarker({ number }: { number: number }) {
  // Convert to Eastern Arabic numerals
  const easternArabic = number
    .toString()
    .replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);

  return (
    <span
      className="inline-flex items-center justify-center mx-1 align-middle"
      style={{ verticalAlign: 'middle' }}
    >
      <span
        className="relative inline-flex items-center justify-center w-8 h-8 text-xs font-bold"
        style={{
          color: '#c9a227',
        }}
      >
        {/* Decorative circle */}
        <svg
          viewBox="0 0 40 40"
          className="absolute inset-0 w-full h-full"
          fill="none"
        >
          <circle
            cx="20"
            cy="20"
            r="17"
            stroke="#c9a227"
            strokeWidth="1.5"
            opacity="0.6"
          />
          <circle
            cx="20"
            cy="20"
            r="14"
            stroke="#c9a227"
            strokeWidth="0.5"
            opacity="0.3"
          />
        </svg>
        <span className="relative z-10 font-arabic text-[11px]">
          {easternArabic}
        </span>
      </span>
    </span>
  );
}

// ============ Single Word Component ============

interface TajweedWordDisplayProps {
  word: TajweedWord;
  state: WordState;
  isCurrent: boolean;
  globalIndex: number;
  onTap?: (index: number) => void;
}

function TajweedWordDisplay({
  word,
  state,
  isCurrent,
  globalIndex,
  onTap,
}: TajweedWordDisplayProps) {
  const opacity = useMemo(() => {
    switch (state) {
      case 'hidden':
        return 0.06;
      case 'current':
        return 0.85;
      case 'revealed':
        return 1;
      case 'error':
        return 1;
      case 'missed':
        return 0.4;
      default:
        return 0.06;
    }
  }, [state]);

  const segments = useMemo(() => {
    return word.segments.map((seg, i) => {
      let color: string;

      if (state === 'error') {
        color = '#ef4444'; // red-500
      } else if (state === 'missed') {
        color = '#f97316'; // orange-500
      } else if (seg.rule) {
        color = getTajweedColor(seg.rule);
      } else {
        color = '#e5e5e5'; // night-100 (default white text)
      }

      return (
        <span key={i} style={{ color }}>
          {seg.text}
        </span>
      );
    });
  }, [word.segments, state]);

  return (
    <motion.span
      className={`inline-block cursor-default select-none relative ${
        isCurrent ? 'z-10' : ''
      }`}
      style={{
        opacity,
        padding: '2px 3px',
        borderRadius: '6px',
        transition: 'opacity 0.3s ease',
      }}
      animate={{
        opacity,
        scale: isCurrent ? 1.05 : 1,
        backgroundColor: isCurrent
          ? 'rgba(201, 162, 39, 0.12)'
          : state === 'error'
          ? 'rgba(239, 68, 68, 0.15)'
          : 'transparent',
      }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
      }}
      onClick={() => onTap?.(globalIndex)}
    >
      {/* Active word glow effect */}
      {isCurrent && (
        <motion.span
          className="absolute inset-0 rounded-md"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
            filter: 'blur(4px)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <span className="relative">{segments}</span>
    </motion.span>
  );
}

// ============ Main TajweedText Component ============

export default function TajweedText({
  verses,
  wordStates,
  currentWordIndex,
  onWordTap,
  showAyahMarkers = true,
}: TajweedTextProps) {
  let globalIndex = 0;

  return (
    <div
      className="text-center leading-[3.2] font-quran"
      dir="rtl"
      lang="ar"
      style={{
        fontSize: 'clamp(1.5rem, 4.5vw, 2.25rem)',
        wordSpacing: '0.15em',
        letterSpacing: '0.01em',
      }}
    >
      {verses.map((verse) => {
        const verseElements: React.ReactNode[] = [];

        for (const word of verse.words) {
          const idx = globalIndex;
          const state = wordStates[idx] || 'hidden';
          const isCurrent = idx === currentWordIndex;

          verseElements.push(
            <TajweedWordDisplay
              key={`${verse.verseKey}-${word.wordIndex}`}
              word={word}
              state={state}
              isCurrent={isCurrent}
              globalIndex={idx}
              onTap={onWordTap}
            />
          );
          verseElements.push(
            <span key={`space-${verse.verseKey}-${word.wordIndex}`}> </span>
          );
          globalIndex++;
        }

        // Add ayah marker at the end
        if (showAyahMarkers) {
          verseElements.push(
            <AyahMarker
              key={`marker-${verse.verseKey}`}
              number={verse.verseNumber}
            />
          );
        }

        return (
          <React.Fragment key={verse.verseKey}>
            {verseElements}
          </React.Fragment>
        );
      })}
    </div>
  );
}
