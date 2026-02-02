'use client';

/**
 * Concept 4: Radiant Quran
 * 
 * An open Quran with light rays emanating upward - representing
 * knowledge, enlightenment, and the light of memorization.
 * 
 * Meaning: Knowledge emanating from the Quran, enlightenment
 * Strength: Dynamic, inspiring, clear meaning
 */

interface LogoProps {
  size?: number;
  className?: string;
}

export function LogoConceptRadiantQuran({ size = 100, className = '' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="rq-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        <linearGradient id="rq-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
        <linearGradient id="rq-glow" x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#f4d47c" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      
      {/* Background */}
      <rect x="4" y="4" width="92" height="92" rx="20" fill="url(#rq-night)" />
      
      {/* Light rays emanating upward */}
      <g stroke="url(#rq-glow)" strokeWidth="2" strokeLinecap="round" opacity="0.6">
        <line x1="50" y1="45" x2="50" y2="18" />
        <line x1="50" y1="45" x2="35" y2="22" />
        <line x1="50" y1="45" x2="65" y2="22" />
        <line x1="50" y1="45" x2="25" y2="30" />
        <line x1="50" y1="45" x2="75" y2="30" />
      </g>
      
      {/* Open book base */}
      <path
        d="M 50 50
           C 42 52, 25 55, 18 58
           L 18 80
           C 25 78, 42 75, 50 72
           Z"
        fill="url(#rq-gold)"
      />
      
      <path
        d="M 50 50
           C 58 52, 75 55, 82 58
           L 82 80
           C 75 78, 58 75, 50 72
           Z"
        fill="url(#rq-gold)"
      />
      
      {/* Center spine */}
      <line 
        x1="50" y1="50" 
        x2="50" y2="72" 
        stroke="url(#rq-night)" 
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Small star at the center of the rays */}
      <circle cx="50" cy="42" r="4" fill="url(#rq-gold)" />
    </svg>
  );
}

export default LogoConceptRadiantQuran;
