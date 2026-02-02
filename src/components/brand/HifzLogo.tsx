'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showWordmark?: boolean;
}

/**
 * HIFZ Logo - The Open Quran
 * 
 * Design Philosophy:
 * - Ultra-simple open book shape = instant Quran recognition
 * - Works at ALL sizes (even 16px favicon)
 * - Gold/night color palette matches the app
 * - No complex geometry that breaks at small sizes
 * 
 * The simplicity is intentional: like Apple's logo, 
 * one shape that's instantly recognizable.
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
      
      {/* THE BOOK - Open Quran silhouette */}
      {/* Left page */}
      <path
        d="M 50 28
           Q 38 30, 22 35
           L 22 72
           Q 38 68, 50 65
           Z"
        fill="url(#hifz-gold)"
      />
      
      {/* Right page */}
      <path
        d="M 50 28
           Q 62 30, 78 35
           L 78 72
           Q 62 68, 50 65
           Z"
        fill="url(#hifz-gold)"
      />
      
      {/* Dark spine separating the pages */}
      <path
        d="M 50 28 L 50 65"
        stroke="url(#hifz-night)"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Icon>
  );
}

// Simple icon for small contexts (nav, tabs)
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
      
      {/* Simplified book shape */}
      <path
        d="M 12 5
           Q 8 6, 4 7
           L 4 19
           Q 8 18, 12 17
           Z"
        fill="url(#simple-gold)"
      />
      <path
        d="M 12 5
           Q 16 6, 20 7
           L 20 19
           Q 16 18, 12 17
           Z"
        fill="url(#simple-gold)"
      />
      <line
        x1="12" y1="5"
        x2="12" y2="17"
        stroke="#0f1419"
        strokeWidth="1"
        strokeLinecap="round"
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
