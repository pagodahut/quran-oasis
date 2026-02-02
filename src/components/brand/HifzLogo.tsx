'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
  animated?: boolean;
  showWordmark?: boolean;
}

/**
 * HIFZ Logo - The Official Crest
 * 
 * Design: Islamic crest with mihrab arch, crescent moon, stars, 
 * open Quran, and crossed ribbons. Gold on white/transparent.
 * 
 * The crest image is /public/hifz-crest.png
 * All icon sizes are generated in /public/icons/
 */

// Main crest icon using the image
export function HifzIcon({ 
  size = 40, 
  className = '', 
  animated = true 
}: LogoProps) {
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
      <Image
        src="/hifz-crest.png"
        alt="HIFZ"
        width={size}
        height={size}
        className="object-contain"
        priority={size > 100}
      />
    </Container>
  );
}

// Simple icon for small contexts (nav, tabs) - uses smaller pre-generated icons
export function HifzIconSimple({ 
  size = 24, 
  className = '' 
}: { 
  size?: number; 
  className?: string;
}) {
  // Use closest pre-generated icon size
  const iconSize = size <= 24 ? 32 : size <= 48 ? 48 : size <= 72 ? 72 : 96;
  
  return (
    <Image
      src={`/icons/icon-${iconSize}x${iconSize}.png`}
      alt="HIFZ"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
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
  
  // Gold gradient colors matching the crest
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
          <stop offset="0%" stopColor="#d4a84b" />
          <stop offset="50%" stopColor="#c9a227" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
      </defs>
      
      <text
        x="70"
        y="38"
        textAnchor="middle"
        fontFamily="'Playfair Display', Georgia, serif"
        fontWeight="600"
        fontSize="38"
        letterSpacing="0.12em"
        fill={isGradient ? 'url(#wordmark-gold)' : color}
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
        <HifzWordmark size={size * 0.4} color="gradient" />
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
        className="font-serif text-xl font-semibold tracking-widest"
        style={{
          background: 'linear-gradient(135deg, #d4a84b 0%, #c9a227 50%, #8b6914 100%)',
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
      className="relative flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(201, 162, 39, 0.3) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />
      <HifzIcon size={size} animated={true} />
    </motion.div>
  );
}

export default HifzLogo;
