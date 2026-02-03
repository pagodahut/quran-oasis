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
 * Design Philosophy:
 * - Crescent moon = Islamic identity
 * - Book chevrons = knowledge, progression, learning
 * - Gold/night color palette matches the app
 * - Works at all sizes
 */
export function HifzIcon({ size = 40, className = '', animated = true }: LogoProps) {
  const Icon = animated ? motion.svg : 'svg';
  
  return (
    <Icon
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      {...(animated && {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      })}
    >
      <defs>
        {/* Premium gold gradient */}
        <linearGradient id="hifz-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f4d47c" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        
        {/* Dark night background */}
        <linearGradient id="hifz-night" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1f25" />
          <stop offset="100%" stopColor="#0f1419" />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#hifz-night)" />
      
      {/* Subtle border */}
      <circle 
        cx="50" cy="50" r="46" 
        fill="none" 
        stroke="url(#hifz-gold)" 
        strokeWidth="1.5"
        opacity="0.4"
      />
      
      {/* Crescent Moon - top left */}
      <path
        d="M 35 15
           C 22 15, 15 28, 15 38
           C 15 48, 22 58, 35 58
           C 25 55, 20 45, 20 38
           C 20 31, 25 21, 35 15
           Z"
        fill="url(#hifz-gold)"
      />
      
      {/* Book shape with chevrons */}
      {/* Top page/chevron - open book shape */}
      <path
        d="M 50 35
           C 40 38, 30 42, 20 48
           L 50 60
           L 80 48
           C 70 42, 60 38, 50 35
           Z"
        fill="url(#hifz-gold)"
      />
      
      {/* Middle chevron */}
      <path
        d="M 20 58 L 50 72 L 80 58"
        fill="none"
        stroke="url(#hifz-gold)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Bottom chevron */}
      <path
        d="M 20 70 L 50 84 L 80 70"
        fill="none"
        stroke="url(#hifz-gold)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

// Simple icon for small contexts (nav, tabs) - Moon + Book
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
      
      {/* Crescent Moon - smaller, top left */}
      <path
        d="M 7 2
           C 4 2, 2 5, 2 8
           C 2 11, 4 14, 7 14
           C 5 13, 4 10.5, 4 8
           C 4 5.5, 5 3, 7 2
           Z"
        fill="url(#simple-gold)"
      />
      
      {/* Book chevron */}
      <path
        d="M 12 9 C 9 10, 6 11, 4 13 L 12 17 L 20 13 C 18 11, 15 10, 12 9 Z"
        fill="url(#simple-gold)"
      />
      
      {/* Bottom chevrons */}
      <path
        d="M 4 16 L 12 20 L 20 16"
        stroke="url(#simple-gold)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// The HIFZ wordmark
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
      <HifzIcon size={size} animated={animated} />
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
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 rounded-full bg-gold-500/20 blur-xl"
      />
      <HifzIcon size={size} animated={true} />
    </motion.div>
  );
}

export default HifzLogo;
