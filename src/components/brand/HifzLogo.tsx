'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showWordmark?: boolean;
}

/**
 * HIFZ Logo - Moon + Book Chevrons
 * 
 * Design: Crescent moon with stacked book chevrons
 * representing Islamic identity and knowledge/learning
 */

// Shared SVG content for the book + crescent logo
function LogoSvgContent() {
  return (
    <>
      <defs>
        <linearGradient id="hifz-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
      </defs>

      {/* Crescent moon — thin elegant arc */}
      <path
        d="M 38 4 A 12 12 0 1 0 38 28 A 9 9 0 1 1 38 4 Z"
        fill="url(#hifz-gold)"
      />

      {/* Left page */}
      <path
        d="M 30 34 C 30 38, 26 42, 12 44 L 12 50 C 26 48, 30 44, 30 40 Z"
        fill="url(#hifz-gold)"
      />

      {/* Right page */}
      <path
        d="M 34 34 C 34 38, 38 42, 52 44 L 52 50 C 38 48, 34 44, 34 40 Z"
        fill="url(#hifz-gold)"
      />

      {/* Spine */}
      <line x1="32" y1="33" x2="32" y2="52" stroke="url(#hifz-gold)" strokeWidth="2.5" strokeLinecap="round" />
    </>
  );
}

// Inline SVG icon - crescent moon + open book, gold gradient
export function HifzIcon({ size = 40, className = '', animated = true }: LogoProps) {
  const Container = animated ? motion.div : 'div';
  
  return (
    <Container
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      {...(animated && {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      })}
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <LogoSvgContent />
      </svg>
    </Container>
  );
}

// Simple icon for small contexts (nav, tabs) - same design, no animation wrapper
export function HifzIconSimple({ 
  size = 24, 
  className = '' 
}: { 
  size?: number; 
  className?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <LogoSvgContent />
    </svg>
  );
}

// The HIFZ wordmark (text logo)
export function HifzWordmark({ 
  size = 24, 
  className = '',
  color = 'currentColor'
}: { 
  size?: number; 
  className?: string;
  color?: string;
}) {
  const height = size;
  const width = size * 2.8;
  
  const isGradient = color === 'gradient';
  
  return (
    <svg
      viewBox="0 0 140 50"
      width={width}
      height={height}
      className={className}
      aria-label="HIFZ"
    >
      <defs>
        <linearGradient id="wordmark-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
      </defs>
      <text
        x="70"
        y="38"
        textAnchor="middle"
        fill={isGradient ? 'url(#wordmark-gold)' : color}
        fontSize="42"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="4"
      >
        HIFZ
      </text>
    </svg>
  );
}

// Full logo: Icon + Wordmark
export function HifzLogo({ 
  iconSize = 40,
  wordmarkSize = 24,
  className = '',
  animated = true,
}: {
  iconSize?: number;
  wordmarkSize?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <HifzIcon size={iconSize} animated={animated} />
      <HifzWordmark size={wordmarkSize} color="gradient" />
    </div>
  );
}

// Stage icons for learning progression
export function StageIcon({ 
  stage, 
  size = 24, 
  active = false 
}: { 
  stage: 1 | 2 | 3 | 4 | 5;
  size?: number;
  active?: boolean;
}) {
  const fillColor = active ? '#c9a227' : '#374151';
  
  // Different moon phases for different stages
  const phases: Record<number, JSX.Element> = {
    1: ( // New moon - beginning
      <circle cx="12" cy="12" r="8" fill={fillColor} opacity="0.3" />
    ),
    2: ( // Crescent - early learning
      <path d="M 16 6 C 10 6, 6 12, 6 18 C 12 16, 14 12, 16 6" fill={fillColor} />
    ),
    3: ( // Half moon - midway
      <path d="M 12 4 A 8 8 0 0 1 12 20 L 12 4" fill={fillColor} />
    ),
    4: ( // Gibbous - almost there
      <path d="M 12 4 A 8 8 0 0 1 12 20 A 4 8 0 0 0 12 4" fill={fillColor} />
    ),
    5: ( // Full moon - mastered
      <circle cx="12" cy="12" r="8" fill={fillColor} />
    ),
  };
  
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {phases[stage]}
      {/* Book chevron at bottom */}
      <path
        d="M 6 18 L 12 22 L 18 18"
        fill="none"
        stroke={fillColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HifzLogo;
