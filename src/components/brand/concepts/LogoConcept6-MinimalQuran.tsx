'use client';

/**
 * Concept 6: Minimal Quran (THE WINNER CANDIDATE)
 * 
 * Ultra-simple: Just an open book silhouette.
 * Works at ANY size - even 16x16 favicon.
 * The gold color and context make it clear this is the Quran.
 * 
 * Think: Apple-level simplicity. One shape. Instant recognition.
 * 
 * Meaning: The Quran, reading, memorization
 * Strength: MAXIMUM simplicity, works at all sizes
 */

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'circle' | 'square' | 'raw';
}

export function LogoConceptMinimalQuran({ size = 100, className = '', variant = 'circle' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="mq-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="mq-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
      </defs>
      
      {/* Background based on variant */}
      {variant === 'circle' && (
        <circle cx="50" cy="50" r="48" fill="url(#mq-night)" />
      )}
      {variant === 'square' && (
        <rect x="4" y="4" width="92" height="92" rx="20" fill="url(#mq-night)" />
      )}
      
      {/* THE BOOK - ultra simple open book shape */}
      {/* Left page */}
      <path
        d="M 50 30
           Q 38 32, 22 36
           L 22 72
           Q 38 68, 50 66
           Z"
        fill="url(#mq-gold)"
      />
      
      {/* Right page */}
      <path
        d="M 50 30
           Q 62 32, 78 36
           L 78 72
           Q 62 68, 50 66
           Z"
        fill="url(#mq-gold)"
      />
      
      {/* Dark spine line to separate pages */}
      <path
        d="M 50 30 L 50 66"
        stroke="url(#mq-night)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Even simpler version - just the book outline
export function LogoConceptMinimalQuranOutline({ size = 100, className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="mqo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="mqo-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <circle cx="50" cy="50" r="48" fill="url(#mqo-night)" />
      
      {/* Book outline only */}
      <path
        d="M 50 28
           Q 35 30, 20 35
           L 20 72
           Q 35 68, 50 65
           Q 65 68, 80 72
           L 80 35
           Q 65 30, 50 28
           Z"
        fill="none"
        stroke="url(#mqo-gold)"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      
      {/* Spine */}
      <line
        x1="50" y1="28"
        x2="50" y2="65"
        stroke="url(#mqo-gold)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default LogoConceptMinimalQuran;
