'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Info, X } from 'lucide-react';
import {
  MAKHRAJ_POINTS,
  getMakhrajForLetter,
  type MakhrajPoint,
} from '@/lib/tajweed-rules';

interface MakhrajDiagramProps {
  selectedLetter?: string;
  onPointSelect?: (point: MakhrajPoint) => void;
  showLabels?: boolean;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function MakhrajDiagram({
  selectedLetter,
  onPointSelect,
  showLabels = true,
  interactive = true,
  size = 'md',
  className = '',
}: MakhrajDiagramProps) {
  const [hoveredPoint, setHoveredPoint] = useState<MakhrajPoint | null>(null);
  const [activePoint, setActivePoint] = useState<MakhrajPoint | null>(null);

  // Get the makhraj point for the selected letter
  const selectedPoint = selectedLetter ? getMakhrajForLetter(selectedLetter) : null;

  const handlePointClick = useCallback((point: MakhrajPoint) => {
    if (!interactive) return;
    setActivePoint(activePoint?.id === point.id ? null : point);
    onPointSelect?.(point);
  }, [interactive, activePoint, onPointSelect]);

  const sizes = {
    sm: { width: 280, height: 280, fontSize: 10, dotSize: 6 },
    md: { width: 400, height: 400, fontSize: 12, dotSize: 8 },
    lg: { width: 520, height: 520, fontSize: 14, dotSize: 10 },
  };

  const { width, height, fontSize, dotSize } = sizes[size];

  return (
    <div className={`relative ${className}`}>
      {/* Main SVG Diagram */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ maxWidth: width }}
      >
        {/* Background */}
        <defs>
          <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a1f2a" />
            <stop offset="100%" stopColor="#0f1419" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="innerShadow">
            <feOffset dx="0" dy="2" />
            <feGaussianBlur stdDeviation="2" result="offset-blur" />
            <feComposite operator="out" in="SourceGraphic" in2="offset-blur" result="inverse" />
            <feFlood floodColor="black" floodOpacity="0.3" result="color" />
            <feComposite operator="in" in="color" in2="inverse" result="shadow" />
            <feComposite operator="over" in="shadow" in2="SourceGraphic" />
          </filter>
        </defs>

        {/* Head/Throat Outline */}
        <g className="anatomy">
          {/* Head silhouette - side view */}
          <path
            d={`
              M ${width * 0.85} ${height * 0.15}
              Q ${width * 0.92} ${height * 0.25} ${width * 0.9} ${height * 0.4}
              Q ${width * 0.88} ${height * 0.55} ${width * 0.85} ${height * 0.7}
              Q ${width * 0.82} ${height * 0.85} ${width * 0.75} ${height * 0.95}
              L ${width * 0.65} ${height * 0.95}
              Q ${width * 0.6} ${height * 0.85} ${width * 0.55} ${height * 0.75}
              L ${width * 0.5} ${height * 0.65}
              Q ${width * 0.45} ${height * 0.55} ${width * 0.4} ${height * 0.5}
            `}
            fill="none"
            stroke="#4a5164"
            strokeWidth="2"
            opacity="0.5"
          />

          {/* Throat cavity */}
          <ellipse
            cx={width * 0.72}
            cy={height * 0.65}
            rx={width * 0.08}
            ry={height * 0.15}
            fill="none"
            stroke="#4a5164"
            strokeWidth="1.5"
            strokeDasharray="4 2"
            opacity="0.4"
          />

          {/* Mouth/oral cavity */}
          <path
            d={`
              M ${width * 0.08} ${height * 0.42}
              Q ${width * 0.15} ${height * 0.35} ${width * 0.3} ${height * 0.32}
              Q ${width * 0.45} ${height * 0.3} ${width * 0.55} ${height * 0.35}
              Q ${width * 0.6} ${height * 0.4} ${width * 0.62} ${height * 0.48}
              Q ${width * 0.6} ${height * 0.55} ${width * 0.5} ${height * 0.58}
              Q ${width * 0.35} ${height * 0.6} ${width * 0.2} ${height * 0.55}
              Q ${width * 0.1} ${height * 0.5} ${width * 0.08} ${height * 0.42}
            `}
            fill="none"
            stroke="#4a5164"
            strokeWidth="1.5"
            opacity="0.4"
          />

          {/* Tongue outline */}
          <path
            d={`
              M ${width * 0.15} ${height * 0.5}
              Q ${width * 0.25} ${height * 0.45} ${width * 0.35} ${height * 0.42}
              Q ${width * 0.45} ${height * 0.4} ${width * 0.52} ${height * 0.45}
              Q ${width * 0.55} ${height * 0.5} ${width * 0.5} ${height * 0.55}
              Q ${width * 0.4} ${height * 0.58} ${width * 0.3} ${height * 0.56}
              Q ${width * 0.2} ${height * 0.54} ${width * 0.15} ${height * 0.5}
            `}
            fill="#5d6579"
            fillOpacity="0.3"
            stroke="#788294"
            strokeWidth="1"
          />

          {/* Lips */}
          <ellipse
            cx={width * 0.08}
            cy={height * 0.42}
            rx={width * 0.03}
            ry={height * 0.08}
            fill="#5d6579"
            fillOpacity="0.4"
            stroke="#788294"
            strokeWidth="1"
          />

          {/* Nasal passage */}
          <path
            d={`
              M ${width * 0.35} ${height * 0.15}
              Q ${width * 0.4} ${height * 0.18} ${width * 0.42} ${height * 0.25}
              Q ${width * 0.4} ${height * 0.28} ${width * 0.35} ${height * 0.3}
            `}
            fill="none"
            stroke="#4a5164"
            strokeWidth="1.5"
            strokeDasharray="3 2"
            opacity="0.4"
          />

          {/* Teeth (upper) */}
          <path
            d={`
              M ${width * 0.1} ${height * 0.38}
              L ${width * 0.25} ${height * 0.35}
            `}
            stroke="#a4a9b8"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Teeth (lower) */}
          <path
            d={`
              M ${width * 0.1} ${height * 0.46}
              L ${width * 0.25} ${height * 0.48}
            `}
            stroke="#a4a9b8"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        </g>

        {/* Makhraj Points */}
        {MAKHRAJ_POINTS.map((point) => {
          const x = (point.x / 100) * width;
          const y = (point.y / 100) * height;
          const isHovered = hoveredPoint?.id === point.id;
          const isActive = activePoint?.id === point.id;
          const isSelected = selectedPoint?.id === point.id;
          const highlight = isHovered || isActive || isSelected;

          return (
            <g key={point.id}>
              {/* Connection line to point */}
              {showLabels && (
                <line
                  x1={x}
                  y1={y}
                  x2={x + (point.x > 50 ? -30 : 30)}
                  y2={y - 20}
                  stroke={highlight ? '#c9a227' : '#4a5164'}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity={highlight ? 1 : 0.3}
                />
              )}

              {/* Point circle */}
              <motion.circle
                cx={x}
                cy={y}
                r={dotSize}
                fill={highlight ? '#c9a227' : '#788294'}
                stroke={highlight ? '#fcd34d' : '#a4a9b8'}
                strokeWidth={highlight ? 2 : 1}
                filter={highlight ? 'url(#glow)' : undefined}
                style={{ cursor: interactive ? 'pointer' : 'default' }}
                onMouseEnter={() => interactive && setHoveredPoint(point)}
                onMouseLeave={() => setHoveredPoint(null)}
                onClick={() => handlePointClick(point)}
                animate={{
                  scale: highlight ? 1.3 : 1,
                  r: highlight ? dotSize * 1.3 : dotSize,
                }}
                transition={{ duration: 0.2 }}
              />

              {/* Letters badge */}
              {highlight && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <rect
                    x={x - 35}
                    y={y - 45}
                    width={70}
                    height={25}
                    rx={4}
                    fill="#1a1f2a"
                    stroke="#c9a227"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={y - 28}
                    textAnchor="middle"
                    fill="#fcd34d"
                    fontSize={fontSize + 4}
                    fontFamily="Amiri, serif"
                    direction="rtl"
                  >
                    {point.letters.join(' ')}
                  </text>
                </motion.g>
              )}

              {/* Label */}
              {showLabels && (
                <text
                  x={x + (point.x > 50 ? -35 : 35)}
                  y={y - 25}
                  textAnchor={point.x > 50 ? 'end' : 'start'}
                  fill={highlight ? '#c9a227' : '#788294'}
                  fontSize={fontSize}
                  opacity={highlight ? 1 : 0.7}
                  className="transition-all duration-200"
                >
                  {point.name.split(' ')[0]}
                </text>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <g transform={`translate(${width * 0.05}, ${height * 0.85})`}>
          <text
            x={0}
            y={0}
            fill="#788294"
            fontSize={fontSize - 2}
          >
            Tap a point to see its letters
          </text>
        </g>
      </svg>

      {/* Active Point Details Panel */}
      <AnimatePresence>
        {activePoint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 p-4 rounded-xl bg-night-800/80 border border-night-700 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-gold-400 font-semibold flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gold-400" />
                  {activePoint.name}
                </h3>
                <p className="text-cream-400 font-arabic text-lg mt-1" dir="rtl">
                  {activePoint.arabicName}
                </p>
              </div>
              <button
                onClick={() => setActivePoint(null)}
                className="text-cream-500 hover:text-cream-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-cream-300 mt-3">
              <strong className="text-cream-200">Location:</strong>{' '}
              {activePoint.location}
            </p>

            <div className="mt-4">
              <h4 className="text-xs text-cream-500 uppercase tracking-wide mb-2">
                Letters from this point
              </h4>
              <div className="flex flex-wrap gap-2">
                {activePoint.letters.map((letter) => (
                  <motion.span
                    key={letter}
                    className="px-4 py-2 rounded-lg bg-gold-500/20 text-gold-400 font-quran text-2xl cursor-pointer hover:bg-gold-500/30 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    dir="rtl"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter Lookup Input */}
      {interactive && (
        <LetterLookup onLetterSelect={(letter) => {
          const point = getMakhrajForLetter(letter);
          if (point) {
            setActivePoint(point);
            onPointSelect?.(point);
          }
        }} />
      )}
    </div>
  );
}

// ============================================
// Letter Lookup Component
// ============================================

interface LetterLookupProps {
  onLetterSelect: (letter: string) => void;
}

function LetterLookup({ onLetterSelect }: LetterLookupProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Arabic alphabet
  const arabicLetters = [
    'ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض',
    'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'ء',
  ];

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-cream-400 hover:text-gold-400 transition-colors"
      >
        <Info className="w-4 h-4" />
        <span>Find letter articulation point</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-7 sm:grid-cols-10 gap-2 mt-3 p-3 rounded-xl bg-night-800/50 border border-night-700">
              {arabicLetters.map((letter) => (
                <motion.button
                  key={letter}
                  onClick={() => onLetterSelect(letter)}
                  className="p-2 rounded-lg bg-night-700/50 hover:bg-gold-500/20 text-cream-100 hover:text-gold-400 font-quran text-xl transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  dir="rtl"
                >
                  {letter}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// Compact Makhraj for Cards/Lessons
// ============================================

interface MakhrajCardProps {
  letter: string;
  showDetails?: boolean;
  className?: string;
}

export function MakhrajCard({ letter, showDetails = true, className = '' }: MakhrajCardProps) {
  const point = getMakhrajForLetter(letter);

  if (!point) {
    return (
      <div className={`p-4 rounded-lg bg-night-800/50 border border-night-700 ${className}`}>
        <span className="text-cream-500">Letter not found</span>
      </div>
    );
  }

  return (
    <motion.div
      className={`p-4 rounded-xl bg-night-800/80 border border-night-700 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-4">
        <span className="text-4xl font-quran text-gold-400" dir="rtl">
          {letter}
        </span>
        <div className="flex-1">
          <h4 className="text-cream-100 font-medium">{point.name}</h4>
          <p className="text-sm text-cream-400 font-arabic" dir="rtl">
            {point.arabicName}
          </p>
        </div>
      </div>

      {showDetails && (
        <div className="mt-3 pt-3 border-t border-night-700">
          <p className="text-sm text-cream-300">{point.location}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {point.letters.map((l) => (
              <span
                key={l}
                className={`px-2 py-1 rounded text-sm font-quran ${
                  l === letter
                    ? 'bg-gold-500/30 text-gold-400'
                    : 'bg-night-700 text-cream-400'
                }`}
                dir="rtl"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
