'use client';

/**
 * Concept 1: Open Quran
 * 
 * A minimalist open book shape - instantly recognizable as the Quran.
 * The pages have subtle curves suggesting they're being read/memorized.
 * A small crescent sits above, anchoring the Islamic identity.
 * 
 * Meaning: Reading, learning, the Quran itself
 * Strength: Universal "book" recognition + Islamic crescent
 */

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'full' | 'minimal';
}

export function LogoConceptOpenQuran({ size = 100, className = '', variant = 'full' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="oq-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="oq-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#oq-night)" />
      
      {/* Gold border */}
      <circle 
        cx="50" cy="50" r="46" 
        fill="none" 
        stroke="url(#oq-gold)" 
        strokeWidth="2"
      />
      
      {variant === 'full' && (
        /* Crescent moon above book */
        <path
          d="M 42 22 
             A 10 10 0 1 1 58 22
             A 8 8 0 1 0 42 22"
          fill="url(#oq-gold)"
        />
      )}
      
      {/* Open book - left page */}
      <path
        d="M 50 40
           C 45 42, 30 44, 22 46
           L 22 72
           C 30 70, 45 68, 50 66
           Z"
        fill="url(#oq-gold)"
        opacity="0.9"
      />
      
      {/* Open book - right page */}
      <path
        d="M 50 40
           C 55 42, 70 44, 78 46
           L 78 72
           C 70 70, 55 68, 50 66
           Z"
        fill="url(#oq-gold)"
      />
      
      {/* Book spine/center */}
      <line 
        x1="50" y1="40" 
        x2="50" y2="66" 
        stroke="url(#oq-night)" 
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Text lines on left page */}
      <g stroke="url(#oq-night)" strokeWidth="1" strokeLinecap="round" opacity="0.5">
        <line x1="28" y1="52" x2="44" y2="50" />
        <line x1="28" y1="58" x2="44" y2="56" />
        <line x1="28" y1="64" x2="44" y2="62" />
      </g>
      
      {/* Text lines on right page */}
      <g stroke="url(#oq-night)" strokeWidth="1" strokeLinecap="round" opacity="0.5">
        <line x1="56" y1="50" x2="72" y2="52" />
        <line x1="56" y1="56" x2="72" y2="58" />
        <line x1="56" y1="62" x2="72" y2="64" />
      </g>
    </svg>
  );
}

export default LogoConceptOpenQuran;
