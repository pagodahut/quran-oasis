'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { SurahProgressItem } from '@/lib/motivationStore';

/* ─────────────────────────────────────────────
   NightSkyProgress — your memorization as a sky
   ─────────────────────────────────────────────
   Every surah is a star. Untouched surahs are
   faint points of dust; surahs in progress glow
   brighter as you memorize; completed surahs
   burn gold and join into a constellation.
   Over years of hifz, the sky fills with light.
   ─────────────────────────────────────────────── */

const W = 360;
const H = 280;
const CX = W / 2;
const CY = H / 2 + 6;
const GOLDEN_ANGLE = 137.508;

// Deterministic jitter so the sky looks organic but never shifts between renders
function jitter(n: number, salt: number): number {
  const x = Math.sin(n * 127.1 + salt * 311.7) * 43758.5453;
  return (x - Math.floor(x)) - 0.5;
}

interface StarPoint {
  surah: number;
  x: number;
  y: number;
  r: number;
  pct: number;
  status: SurahProgressItem['status'];
  name: string;
  englishName: string;
  versesMemorized: number;
  totalVerses: number;
}

function layoutStars(surahs: SurahProgressItem[]): StarPoint[] {
  return surahs.map((s) => {
    const i = s.surahNumber;
    const angle = (i * GOLDEN_ANGLE * Math.PI) / 180;
    const spread = Math.sqrt(i / 114);
    const rx = 26 + spread * 138 + jitter(i, 1) * 14;
    const ry = (26 + spread * 108 + jitter(i, 2) * 12) * 0.92;
    return {
      surah: i,
      x: CX + Math.cos(angle) * rx,
      y: CY + Math.sin(angle) * ry,
      r: 1.4 + Math.log10(Math.max(s.totalVerses, 3)) * 1.1,
      pct: s.percentage,
      status: s.status,
      name: s.name,
      englishName: s.englishName,
      versesMemorized: s.versesMemorized,
      totalVerses: s.totalVerses,
    };
  });
}

// Fixed background dust — tiny ambient stars
const DUST = Array.from({ length: 46 }, (_, i) => ({
  x: (jitter(i, 7) + 0.5) * W,
  y: (jitter(i, 13) + 0.5) * H,
  r: 0.4 + (jitter(i, 19) + 0.5) * 0.7,
  o: 0.04 + (jitter(i, 23) + 0.5) * 0.10,
}));

export default function NightSkyProgress({
  surahs,
  streak,
  versesMemorized,
}: {
  surahs: SurahProgressItem[];
  streak: number;
  versesMemorized: number;
}) {
  const [selected, setSelected] = useState<StarPoint | null>(null);

  const stars = useMemo(() => layoutStars(surahs), [surahs]);
  const completed = useMemo(() => stars.filter(s => s.status === 'complete'), [stars]);

  // Constellation: connect completed surahs in mushaf order
  const constellationPath = useMemo(() => {
    if (completed.length < 2) return null;
    const sorted = [...completed].sort((a, b) => a.surah - b.surah);
    return sorted.map((s, i) => `${i === 0 ? 'M' : 'L'}${s.x.toFixed(1)} ${s.y.toFixed(1)}`).join(' ');
  }, [completed]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-3xl overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 120% 90% at 50% 110%, #1c1a30 0%, #131221 55%, #0c0b16 100%)',
        border: '1px solid rgba(212,176,80,0.14)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Heading */}
      <div className="relative z-10 px-5 pt-5 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium" style={{ color: '#a8a0b8' }}>Your Sky</h3>
          <p className="text-xs mt-0.5" style={{ color: '#5c5670' }}>
            {completed.length} of 114 surahs shine · {versesMemorized.toLocaleString()} stars lit
          </p>
        </div>

        {/* Crescent moon — streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
              <path
                d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
                fill="#dcc06a"
                opacity="0.9"
              />
            </svg>
            <span className="text-sm font-semibold tabular-nums" style={{ color: '#dcc06a' }}>
              {streak}
            </span>
          </div>
        )}
      </div>

      {/* The sky */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full block"
        role="img"
        aria-label={`Night sky visualization: ${completed.length} of 114 surahs memorized`}
      >
        <defs>
          <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4d47c" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#dcc06a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#dcc06a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient dust */}
        {DUST.map((d, i) => (
          <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.r} fill="#cfc8e8" opacity={d.o} />
        ))}

        {/* Constellation lines between completed surahs */}
        {constellationPath && (
          <motion.path
            d={constellationPath}
            fill="none"
            stroke="#dcc06a"
            strokeWidth="0.6"
            strokeOpacity="0.28"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: 'easeInOut', delay: 0.4 }}
          />
        )}

        {/* Surah stars */}
        {stars.map((s) => {
          const isComplete = s.status === 'complete';
          const isStarted = s.status === 'in_progress';
          const fill = isComplete ? '#f4d47c' : isStarted ? '#e8e0c8' : '#9890b0';
          const opacity = isComplete ? 1 : isStarted ? 0.35 + (s.pct / 100) * 0.5 : 0.14;

          return (
            <g
              key={s.surah}
              onClick={() => setSelected(selected?.surah === s.surah ? null : s)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow halo for completed stars */}
              {isComplete && (
                <circle cx={s.x} cy={s.y} r={s.r * 4} fill="url(#starGlow)" />
              )}
              {/* Twinkle for completed; static otherwise */}
              {isComplete ? (
                <motion.circle
                  cx={s.x}
                  cy={s.y}
                  r={s.r}
                  fill={fill}
                  animate={{ opacity: [1, 0.65, 1] }}
                  transition={{
                    duration: 2.4 + (s.surah % 5) * 0.7,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (s.surah % 7) * 0.4,
                  }}
                />
              ) : (
                <circle cx={s.x} cy={s.y} r={s.r * (isStarted ? 0.9 : 0.65)} fill={fill} opacity={opacity} />
              )}
              {/* Larger invisible hit area */}
              <circle cx={s.x} cy={s.y} r={9} fill="transparent" />
              {/* Selection ring */}
              {selected?.surah === s.surah && (
                <motion.circle
                  cx={s.x}
                  cy={s.y}
                  r={s.r + 5}
                  fill="none"
                  stroke="#dcc06a"
                  strokeWidth="0.8"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.8 }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Selected star caption */}
      <div className="relative z-10 px-5 pb-4 -mt-2 min-h-[2.25rem]">
        {selected ? (
          <motion.div
            key={selected.surah}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tabular-nums px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,176,80,0.14)', color: '#dcc06a' }}>
                {selected.surah}
              </span>
              <span className="text-sm" style={{ color: '#e8e4dc' }}>{selected.englishName}</span>
              <span className="text-sm font-arabic opacity-60" style={{ color: '#a8a0b8' }}>{selected.name}</span>
            </div>
            <span className="text-xs tabular-nums" style={{ color: '#a8a0b8' }}>
              {selected.versesMemorized}/{selected.totalVerses}
            </span>
          </motion.div>
        ) : (
          <p className="text-xs italic" style={{ color: '#4a4560' }}>
            Tap a star to see its surah — every verse you memorize lights the sky
          </p>
        )}
      </div>
    </motion.div>
  );
}
