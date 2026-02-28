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
 * HIFZ Logo - Gold crescent + open book emblem on transparent background
 * Source: Artboard 1.svg (668x669 raster PNG with alpha)
 */

// PNG-based logo with transparent background — works in both light and dark modes
function HifzLogoImage({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <Image
      src="/hifz-logo.png"
      alt="HIFZ"
      width={size}
      height={size}
      className={className}
      priority
    />
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
      <HifzLogoImage size={size} className="drop-shadow-sm" />
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
  return <HifzLogoImage size={size} className={className} />;
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
