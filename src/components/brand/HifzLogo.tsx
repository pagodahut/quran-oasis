'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showWordmark?: boolean;
  color?: string;
}

/**
 * HIFZ Logo - New SVG logo with gold background and white calligraphic design
 * viewBox: 0 0 1952 2176
 */

// SVG-file based logo (uses the full detailed SVG)
function HifzLogoImage({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/hifz-logo.svg"
      alt="HIFZ"
      width={size}
      height={Math.round(size * (2176 / 1952))}
      className={`rounded-lg ${className}`}
      priority
    />
  );
}

// Simplified inline SVG for small contexts - gold rounded rect with stylized "H" calligraphy
function HifzLogoInline({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 112"
      width={size}
      height={Math.round(size * 1.12)}
      className={`rounded-lg ${className}`}
      aria-label="HIFZ"
    >
      <rect width="100" height="112" rx="12" fill="#C9A340" />
      {/* Simplified calligraphic paths representing the logo shape */}
      <path
        d="M50 15 C65 15 78 25 78 40 C78 50 72 58 63 62 L63 85 C63 90 58 95 50 95 C42 95 37 90 37 85 L37 62 C28 58 22 50 22 40 C22 25 35 15 50 15Z"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M35 45 Q50 55 65 45"
        fill="none"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M30 70 L50 82 L70 70"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M33 80 L50 92 L67 80"
        fill="none"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.7"
      />
    </svg>
  );
}

// Main icon using the new SVG logo
export function HifzIcon({ size = 40, className = '', animated = true }: LogoProps) {
  const Container = animated ? motion.div : 'div';

  return (
    <Container
      className={`relative ${className}`}
      style={{ width: size, height: Math.round(size * 1.12) }}
      {...(animated && {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
      })}
    >
      <HifzLogoImage size={size} />
    </Container>
  );
}

// Simple icon for small contexts (nav, tabs)
export function HifzIconSimple({
  size = 24,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return <HifzLogoInline size={size} className={className} />;
}

// The HIFZ wordmark (text logo)
export function HifzWordmark({
  size = 24,
  className = '',
  color = 'currentColor',
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
  active = false,
}: {
  stage: 1 | 2 | 3 | 4 | 5;
  size?: number;
  active?: boolean;
}) {
  const fillColor = active ? '#c9a227' : '#374151';

  const phases: Record<number, JSX.Element> = {
    1: <circle cx="12" cy="12" r="8" fill={fillColor} opacity="0.3" />,
    2: <path d="M 16 6 C 10 6, 6 12, 6 18 C 12 16, 14 12, 16 6" fill={fillColor} />,
    3: <path d="M 12 4 A 8 8 0 0 1 12 20 L 12 4" fill={fillColor} />,
    4: <path d="M 12 4 A 8 8 0 0 1 12 20 A 4 8 0 0 0 12 4" fill={fillColor} />,
    5: <circle cx="12" cy="12" r="8" fill={fillColor} />,
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {phases[stage]}
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
