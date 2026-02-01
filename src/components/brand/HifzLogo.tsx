'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showWordmark?: boolean;
}

// The HIFZ icon - An octagram (8-pointed star) with stylized Arabic ح (Ha)
// Represents: Islamic geometry + Hifz (preservation) + memorization
export function HifzIcon({ size = 40, className = '', animated = true }: LogoProps) {
  const Icon = animated ? motion.svg : 'svg';
  
  return (
    <Icon
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      {...(animated && {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
      })}
    >
      <defs>
        {/* Premium gold gradient - manuscript gilding inspired */}
        <linearGradient id="hifz-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="35%" stopColor="#c9a227" />
          <stop offset="65%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        
        {/* Inner glow gradient */}
        <radialGradient id="hifz-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4d47c" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0" />
        </radialGradient>
        
        {/* Dark night gradient for contrast elements */}
        <linearGradient id="hifz-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
        
        {/* Subtle shimmer for animation */}
        <linearGradient id="hifz-shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f4d47c" stopOpacity="0">
            <animate attributeName="offset" values="-1;2" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#fff" stopOpacity="0.3">
            <animate attributeName="offset" values="-0.5;2.5" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#f4d47c" stopOpacity="0">
            <animate attributeName="offset" values="0;3" dur="3s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      
      {/* Background circle - deep night */}
      <circle cx="50" cy="50" r="48" fill="url(#hifz-night)" />
      
      {/* Inner glow effect */}
      <circle cx="50" cy="50" r="44" fill="url(#hifz-glow)" />
      
      {/* Outer ring - thin gold border */}
      <circle 
        cx="50" 
        cy="50" 
        r="46" 
        fill="none" 
        stroke="url(#hifz-gold)" 
        strokeWidth="1.5"
        opacity="0.8"
      />
      
      {/* 8-pointed star (Octagram) - Islamic geometric pattern */}
      <g transform="translate(50, 50)">
        {/* First square (rotated 0°) */}
        <rect 
          x="-22" 
          y="-22" 
          width="44" 
          height="44" 
          fill="none" 
          stroke="url(#hifz-gold)" 
          strokeWidth="2"
          transform="rotate(0)"
          rx="3"
        />
        {/* Second square (rotated 45°) */}
        <rect 
          x="-22" 
          y="-22" 
          width="44" 
          height="44" 
          fill="none" 
          stroke="url(#hifz-gold)" 
          strokeWidth="2"
          transform="rotate(45)"
          rx="3"
        />
      </g>
      
      {/* Center circle - represents the heart/core of memorization */}
      <circle 
        cx="50" 
        cy="50" 
        r="16" 
        fill="url(#hifz-night)"
        stroke="url(#hifz-gold)"
        strokeWidth="1.5"
      />
      
      {/* Stylized ح (Ha) - Arabic letter for Hifz */}
      {/* This is a simplified, geometric interpretation */}
      <path
        d="M 43 46
           Q 43 42, 47 42
           L 53 42
           Q 57 42, 57 46
           Q 57 52, 52 54
           Q 50 55, 50 58"
        fill="none"
        stroke="url(#hifz-gold)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Dot below the Ha (characteristic of ح) */}
      <circle cx="50" cy="61" r="1.5" fill="url(#hifz-gold)" />
      
      {/* Four corner accents - like compass points */}
      {[0, 90, 180, 270].map((angle) => (
        <circle
          key={angle}
          cx={50 + 38 * Math.cos((angle - 90) * Math.PI / 180)}
          cy={50 + 38 * Math.sin((angle - 90) * Math.PI / 180)}
          r="2"
          fill="url(#hifz-gold)"
        />
      ))}
      
      {/* Subtle shimmer overlay */}
      {animated && (
        <circle 
          cx="50" 
          cy="50" 
          r="44" 
          fill="url(#hifz-shimmer)" 
          opacity="0.5"
        />
      )}
    </Icon>
  );
}

// The HIFZ wordmark - strong, modern typography
export function HifzWordmark({ 
  size = 24, 
  className = '',
  color = 'currentColor'
}: { 
  size?: number; 
  className?: string;
  color?: string;
}) {
  // Height-based sizing, width is proportional (roughly 3:1 for "HIFZ")
  const height = size;
  const width = size * 2.8;
  
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
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
      
      {/* HIFZ letters - clean, modern, slightly geometric sans-serif */}
      <text
        x="70"
        y="38"
        textAnchor="middle"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontWeight="700"
        fontSize="38"
        letterSpacing="0.08em"
        fill={color === 'gradient' ? 'url(#wordmark-gold)' : color}
      >
        HIFZ
      </text>
    </svg>
  );
}

// Full logo - icon + wordmark
export function HifzLogo({ 
  size = 40, 
  className = '',
  animated = true,
  variant = 'horizontal'
}: LogoProps & { variant?: 'horizontal' | 'vertical' | 'icon-only' }) {
  if (variant === 'icon-only') {
    return <HifzIcon size={size} className={className} animated={animated} />;
  }
  
  const Container = animated ? motion.div : 'div';
  
  if (variant === 'vertical') {
    return (
      <Container
        className={`flex flex-col items-center gap-2 ${className}`}
        {...(animated && {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5 }
        })}
      >
        <HifzIcon size={size} animated={animated} />
        <HifzWordmark size={size * 0.5} color="gradient" />
      </Container>
    );
  }
  
  // Horizontal (default)
  return (
    <Container
      className={`flex items-center gap-3 ${className}`}
      {...(animated && {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5 }
      })}
    >
      <div className="relative">
        <HifzIcon size={size} animated={animated} />
        {/* Subtle glow behind icon */}
        <div 
          className="absolute inset-0 rounded-full bg-gold-500 blur-md opacity-30 -z-10"
          style={{ width: size, height: size }}
        />
      </div>
      <span 
        className="font-display text-xl font-bold tracking-wider"
        style={{
          background: 'linear-gradient(135deg, #f4d47c 0%, #c9a227 50%, #d4af37 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        HIFZ
      </span>
    </Container>
  );
}

// Animated logo for loading screens
export function HifzLogoAnimated({ size = 80 }: { size?: number }) {
  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          rotate: 360,
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(201, 162, 39, 0.2) 60deg, transparent 120deg)',
          filter: 'blur(8px)',
        }}
      />
      <HifzIcon size={size} animated={true} />
    </motion.div>
  );
}

// Simple icon for navigation/small contexts
export function HifzIconSimple({ 
  size = 24, 
  className = '' 
}: { 
  size?: number; 
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id="simple-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
      </defs>
      
      {/* Simplified octagram */}
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        fill="none"
        stroke="url(#simple-gold)"
        strokeWidth="1.5"
        rx="1"
      />
      <rect
        x="6"
        y="6"
        width="12"
        height="12"
        fill="none"
        stroke="url(#simple-gold)"
        strokeWidth="1.5"
        rx="1"
        transform="rotate(45 12 12)"
      />
      
      {/* Center dot */}
      <circle cx="12" cy="12" r="2" fill="url(#simple-gold)" />
    </svg>
  );
}

export default HifzLogo;
