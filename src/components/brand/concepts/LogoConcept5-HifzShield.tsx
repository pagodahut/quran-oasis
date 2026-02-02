'use client';

/**
 * Concept 5: Hifz Shield (حفظ)
 * 
 * The word حفظ (Hifz) means "to preserve/protect/memorize".
 * A shield shape symbolizes preservation and protection.
 * The book inside represents the Quran being preserved in memory.
 * 
 * Meaning: Preservation, protection of the Quran in memory
 * Strength: Unique, meaningful metaphor, simple shape
 */

interface LogoProps {
  size?: number;
  className?: string;
}

export function LogoConceptHifzShield({ size = 100, className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="hs-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="hs-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
      </defs>
      
      {/* Shield shape - rounded top, pointed bottom */}
      <path
        d="M 50 8
           C 25 8, 12 15, 12 30
           L 12 50
           C 12 70, 30 88, 50 95
           C 70 88, 88 70, 88 50
           L 88 30
           C 88 15, 75 8, 50 8
           Z"
        fill="url(#hs-night)"
        stroke="url(#hs-gold)"
        strokeWidth="3"
      />
      
      {/* Inner shield accent */}
      <path
        d="M 50 16
           C 32 16, 22 22, 22 33
           L 22 50
           C 22 65, 35 78, 50 84
           C 65 78, 78 65, 78 50
           L 78 33
           C 78 22, 68 16, 50 16
           Z"
        fill="none"
        stroke="url(#hs-gold)"
        strokeWidth="1.5"
        opacity="0.5"
      />
      
      {/* Simplified book/Quran in center */}
      <path
        d="M 50 35
           C 44 37, 32 40, 28 42
           L 28 62
           C 32 60, 44 58, 50 55
           Z"
        fill="url(#hs-gold)"
        opacity="0.9"
      />
      
      <path
        d="M 50 35
           C 56 37, 68 40, 72 42
           L 72 62
           C 68 60, 56 58, 50 55
           Z"
        fill="url(#hs-gold)"
      />
      
      {/* Book spine */}
      <line 
        x1="50" y1="35" 
        x2="50" y2="55" 
        stroke="url(#hs-night)" 
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Top crescent */}
      <path
        d="M 44 25
           A 6 6 0 1 1 56 25
           A 5 5 0 1 0 44 25"
        fill="url(#hs-gold)"
      />
    </svg>
  );
}

export default LogoConceptHifzShield;
