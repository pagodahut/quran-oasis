'use client';

/**
 * Concept 3: Crescent Book
 * 
 * A clever dual-meaning symbol: a crescent moon that also forms
 * the spine of an open book. Two powerful symbols merged into one.
 * 
 * Meaning: Islam (crescent) + Quran (book) - unified symbol
 * Strength: Elegant, memorable, dual meaning, very simple
 */

interface LogoProps {
  size?: number;
  className?: string;
}

export function LogoConceptCrescentBook({ size = 100, className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="cb-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="cb-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#cb-night)" />
      
      {/* The crescent-book hybrid shape */}
      {/* Crescent moon that doubles as book spine */}
      <path
        d="M 50 15
           A 35 35 0 1 1 50 85
           A 28 28 0 1 0 50 15"
        fill="url(#cb-gold)"
      />
      
      {/* Book pages emanating from the crescent "spine" */}
      {/* Left page */}
      <path
        d="M 50 25
           Q 35 30, 25 35
           L 25 65
           Q 35 70, 50 75"
        fill="none"
        stroke="url(#cb-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      {/* Right page */}
      <path
        d="M 50 25
           Q 58 30, 64 33
           L 64 67
           Q 58 70, 50 75"
        fill="none"
        stroke="url(#cb-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
      
      {/* Star accent */}
      <circle cx="32" cy="35" r="3" fill="url(#cb-gold)" opacity="0.8" />
    </svg>
  );
}

export default LogoConceptCrescentBook;
