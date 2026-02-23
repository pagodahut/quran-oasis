import React from 'react';

// MosqueIcon is defined in its own file for reuse
export { MosqueIcon } from './MosqueIcon';

interface IconProps {
  size?: number;
  className?: string;
}

const defaultProps = { size: 24, className: '' };

function svgBase(size: number, className: string, children: React.ReactNode) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

/** 🌱 Small sprout/plant — beginner level */
export function SeedlingIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M12 22V13" />
    <path d="M12 13C12 13 8 12 6 8C10 8 12 10 12 13Z" />
    <path d="M12 16C12 16 16 14 18 10C14 10 12 13 12 16Z" />
    <line x1="12" y1="22" x2="12" y2="19" />
    <path d="M10 22h4" />
  </>);
}

/** 🔤 Arabic letters representation */
export function LettersIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M4 18h3c1.1 0 2-.9 2-2v0c0-1.1-.9-2-2-2H5.5" />
    <circle cx="5.5" cy="11" r="0.5" fill="currentColor" stroke="none" />
    <path d="M12 18c1.7 0 3-1.3 3-3s-1.3-3-3-3" />
    <circle cx="13" cy="10" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="15" cy="10" r="0.5" fill="currentColor" stroke="none" />
    <path d="M19 12v6" />
    <circle cx="19" cy="10" r="0.5" fill="currentColor" stroke="none" />
  </>);
}

/** 📖 Open book */
export function BookReadIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M2 6s2-2 5-2 5 2 5 2v13s-2-1-5-1-5 1-5 1V6Z" />
    <path d="M12 6s2-2 5-2 5 2 5 2v13s-2-1-5-1-5 1-5 1V6Z" />
  </>);
}

/** 📚 Stacked books */
export function BooksIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <rect x="3" y="14" width="4" height="8" rx="1" transform="rotate(-12 3 14)" />
    <rect x="9" y="12" width="4" height="10" rx="1" />
    <rect x="15" y="10" width="4" height="12" rx="1" transform="rotate(6 15 10)" />
    <line x1="3" y1="22" x2="21" y2="22" />
  </>);
}

/** ✨ Elegant sparkle/star */
export function SparkleIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2Z" />
    <path d="M18 3l.7 2.1L21 6l-2.3.9L18 9l-.7-2.1L15 6l2.3-.9L18 3Z" />
  </>);
}

// MosqueIcon is re-exported from ./MosqueIcon.tsx (see top of file)

/** 🌙 Crescent moon */
export function CrescentIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
  </>);
}

/** ⭐ Islamic 8-point star */
export function StarIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <polygon points="12,1 14.5,8.5 22,8.5 16,13 18,21 12,16.5 6,21 8,13 2,8.5 9.5,8.5" />
  </>);
}

/** 🤲 Hands raised in prayer (dua) */
export function DuaHandsIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M7 14c-1-1-2-3-2-5 0-1.5.8-2 2-2s2 1 2 2c0 1-.5 2-1 3" />
    <path d="M17 14c1-1 2-3 2-5 0-1.5-.8-2-2-2s-2 1-2 2c0 1 .5 2 1 3" />
    <path d="M7 14c0 0 1 4 5 6 4-2 5-6 5-6" />
    <path d="M9 7V4a1 1 0 0 1 2 0v5" />
    <path d="M15 7V4a1 1 0 0 0-2 0v5" />
  </>);
}

/** Quran with bookmark ribbon */
export function QuranIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 3v18" />
    <path d="M15 3v7l2-2 2 2V3" />
  </>);
}

/** Sound waves / recitation */
export function ReciteIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M12 18c3.3 0 6-2.7 6-6s-2.7-6-6-6" />
    <path d="M12 14c1.1 0 2-.9 2-2s-.9-2-2-2" />
    <path d="M2 10v4" />
    <path d="M5 8v8" />
    <path d="M8 6v12" />
  </>);
}

/** Brain with crescent — memorization */
export function MemorizeIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M12 2a7 7 0 0 1 5 12v3a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-3A7 7 0 0 1 12 2Z" />
    <path d="M9 21h6" />
    <path d="M10 17v-3c0-1 2-1 2 0" />
    <path d="M12 14v3" />
    <path d="M14 14c0-1-2-1-2 0" />
    <path d="M19 5a3 3 0 0 0-2-1" />
  </>);
}

/** Arabic letter with accent — tajweed */
export function TajweedIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M6 18c3 0 5-2 5-5s-2-5-5-5" />
    <circle cx="8" cy="6" r="1" fill="currentColor" stroke="none" />
    <path d="M16 8v10" />
    <circle cx="16" cy="6" r="1" fill="currentColor" stroke="none" />
    <path d="M14 20h4" />
    <circle cx="19" cy="12" r="2" strokeWidth="1.5" fill="none" stroke="currentColor" opacity="0.5" />
  </>);
}

/** Ascending stairs — progress */
export function ProgressIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M2 20h4v-4h4v-4h4v-4h4v-4h4" />
    <path d="M22 4v4h-4" />
  </>);
}

/** Calendar with geometric pattern */
export function CalendarIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <circle cx="12" cy="15" r="2" />
    <path d="M12 13l1.5-1.5M12 13l-1.5-1.5M12 17l1.5 1.5M12 17l-1.5 1.5" />
  </>);
}

/** Heart with Islamic geometric pattern */
export function HeartIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
    <path d="M12 8l2 4-2 4-2-4 2-4Z" opacity="0.4" />
  </>);
}

/** 🌳 Tree — long-term manzil review */
export function TreeIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M12 22V13" />
    <path d="M12 13c0 0-6-2-6-7 0-3 3-4 6-4s6 1 6 4c0 5-6 7-6 7Z" />
    <path d="M10 22h4" />
  </>);
}

/** 🌿 Leaf — recent/sabqi review */
export function LeafIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M17 3c-4 0-9 4-9 10" />
    <path d="M6 21c0-6 3-10 7-12" />
    <path d="M17 3c2 6 0 12-4 15" />
    <path d="M8 13c3-1 6-1 9 0" />
  </>);
}

/** 🎯 Target — accuracy/practice */
export function TargetIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </>);
}

/** 🔥 Fire/Streak */
export function FireIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M12 22c4.4 0 7-3.1 7-7 0-3-2-5.5-3.5-7.5C14 5.5 13 3 12 2c-1 1-2 3.5-3.5 5.5C7 9.5 5 12 5 15c0 3.9 2.6 7 7 7Z" />
    <path d="M12 22c-2 0-3.5-1.5-3.5-4 0-2 1-3.5 2-4.5.7-.7 1.2-1.5 1.5-2.5.3 1 .8 1.8 1.5 2.5 1 1 2 2.5 2 4.5 0 2.5-1.5 4-3.5 4Z" />
  </>);
}

/** 🏆 Trophy */
export function TrophyIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M6 9V4h12v5a6 6 0 0 1-12 0Z" />
    <path d="M6 4H4v3a3 3 0 0 0 3 3" />
    <path d="M18 4h2v3a3 3 0 0 1-3 3" />
    <line x1="12" y1="15" x2="12" y2="18" />
    <path d="M8 21h8" />
    <path d="M10 18h4v3H10z" />
  </>);
}

/** 👑 Crown */
export function CrownIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M2 18L5 8l4 4 3-8 3 8 4-4 3 10H2Z" />
    <line x1="2" y1="18" x2="22" y2="18" />
  </>);
}

/** 🎉 Celebration */
export function CelebrationIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M5.8 11.3L2 22l10.7-3.8" />
    <path d="M4 3h.01M22 8h.01M18 2h.01M8 2h.01M22 16h.01" />
    <path d="M6.5 9.5l8 8" />
    <path d="M10 5.5l1.5 1.5" />
    <path d="M16 7l1.5 1.5" />
    <path d="M18 13l1.5 1.5" />
  </>);
}

/** 💡 Lightbulb/Tip */
export function TipIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z" />
  </>);
}

/** 📝 Notes/Writing */
export function NotesIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
    <path d="M14 2v6h6" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </>);
}

/** 💪 Strength/Effort */
export function StrengthIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <path d="M4 15l3-3 2 2 4-4 2 2 5-5" />
    <path d="M20 7v4h-4" />
  </>);
}

/** 🤔 Think/Help */
export function ThinkIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <circle cx="12" cy="17" r="0.5" fill="currentColor" stroke="none" />
  </>);
}

/** 🕋 Kaaba */
export function KaabaIcon({ size = 24, className = '' }: IconProps) {
  return svgBase(size, className, <>
    <rect x="4" y="6" width="16" height="14" rx="1" />
    <path d="M4 6l8-4 8 4" />
    <path d="M10 13h4v7h-4z" />
    <line x1="4" y1="11" x2="20" y2="11" />
  </>);
}
