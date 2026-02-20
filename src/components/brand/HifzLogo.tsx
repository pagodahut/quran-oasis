'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showWordmark?: boolean;
  color?: string;
}

/**
 * HIFZ Logo - Moon + Book Chevrons (Inline SVG)
 * 
 * Design: Crescent moon with stacked book chevrons
 * representing Islamic identity and knowledge/learning
 */

// Inline SVG paths for the HIFZ logo
function HifzLogoSvg({ size = 40, color = '#c9a227', className = '' }: { size?: number; color?: string; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 246"
      width={size}
      height={size * 1.23}
      fill={color}
      className={className}
      aria-label="HIFZ"
    >
      {/* Crescent Moon */}
      <path d="M125 4a18 18 0 1 1-4.5 35.5A22.5 22.5 0 1 0 125 4Z"/>
      {/* Top chevron - curved open book wings */}
      <path d="M0 60C25 60 50 60 70 60C82 60 90 62 95 68C98 72 100 80 100 80C100 80 102 72 105 68C110 62 118 60 130 60C150 60 175 60 200 60L200 96C165 96 135 100 115 112C106 118 103 130 100 148C97 130 94 118 85 112C65 100 35 96 0 96Z"/>
      {/* Middle chevron */}
      <path d="M0 154L65 154L100 194L135 154L200 154L200 176L135 176L100 216L65 176L0 176Z"/>
      {/* Bottom chevron */}
      <path d="M0 184L65 184L100 224L135 184L200 184L200 206L135 206L100 246L65 206L0 206Z"/>
    </svg>
  );
}

// Main icon using inline SVG
export function HifzIcon({ size = 40, className = '', animated = true, color = '#c9a227' }: LogoProps) {
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
      <HifzLogoSvg size={size} color={color} />
    </Container>
  );
}

// Simple icon for small contexts (nav, tabs)
export function HifzIconSimple({ 
  size = 24, 
  className = '',
  color = '#c9a227'
}: { 
  size?: number; 
  className?: string;
  color?: string;
}) {
  return <HifzLogoSvg size={size} color={color} className={className} />;
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
