'use client';

/**
 * Concept 2: Bold ح (Ha)
 * 
 * The Arabic letter ح for "Hifz" (حفظ = memorization/preservation).
 * Made BOLD and GEOMETRIC - not calligraphic.
 * Simple enough to be recognizable at any size.
 * 
 * Meaning: Hifz (memorization), Arabic/Islamic identity
 * Strength: Unique, meaningful, works at all sizes
 */

interface LogoProps {
  size?: number;
  className?: string;
}

export function LogoConceptBoldHa({ size = 100, className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="bh-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="bh-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
      </defs>
      
      {/* Background - rounded square for app icon feel */}
      <rect x="4" y="4" width="92" height="92" rx="20" fill="url(#bh-night)" />
      
      {/* Gold border */}
      <rect 
        x="6" y="6" width="88" height="88" rx="18" 
        fill="none" 
        stroke="url(#bh-gold)" 
        strokeWidth="2"
      />
      
      {/* Bold geometric ح (Ha) */}
      {/* The shape: curved top opening to the right, with characteristic downward stroke */}
      <path
        d="M 28 32
           Q 28 22, 42 22
           L 58 22
           Q 72 22, 72 32
           Q 72 50, 55 60
           L 55 72"
        fill="none"
        stroke="url(#bh-gold)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* The characteristic dot below ح */}
      <circle cx="55" cy="82" r="6" fill="url(#bh-gold)" />
    </svg>
  );
}

export default LogoConceptBoldHa;
