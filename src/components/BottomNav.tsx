'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLearningMode } from '@/hooks/useLearningMode';

// Custom geometric icons - cohesive Islamic-inspired design
function HomeIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true">
      <path d="M3 12l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-5a1 1 0 011-1h2a1 1 0 011 1v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuranIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true">
      {/* Open book shape */}
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      {/* Decorative lines suggesting Arabic text */}
      <path d="M8 7h8M8 10h6M8 13h7" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

function LearnIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true">
      <path d="M12 3L2 9l10 6 10-6-10-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

function PracticeIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

function ReciteIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true">
      {/* Microphone */}
      <rect x="9" y="2" width="6" height="11" rx="3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10a7 7 0 0014 0" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 17v4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 21h8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { showLearn, showPractice, isLoaded } = useLearningMode();

  // Collapse nav on scroll down, expand on scroll up (iOS-style)
  // Using useCallback for better performance
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    
    // Add hysteresis to prevent flickering
    if (currentScrollY > lastScrollY + 10 && currentScrollY > 100) {
      setIsCollapsed(true);
    } else if (currentScrollY < lastScrollY - 10) {
      setIsCollapsed(false);
    }
    
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Build nav items based on learning mode
  // Navigation Updates:
  // - Beginner: Home, Learn, Practice, Quran, Profile
  // - Intermediate: Home, Practice, Quran, Profile
  // - Hafiz: Home, Quran, Profile
  const navItems = useMemo(() => {
    const items = [
      { href: '/dashboard', Icon: HomeIcon, label: 'Home', ariaLabel: 'Go to Dashboard', show: true },
      { href: '/lessons', Icon: LearnIcon, label: 'Learn', ariaLabel: 'Go to Lessons', show: showLearn },
      { href: '/practice', Icon: PracticeIcon, label: 'Practice', ariaLabel: 'Go to Practice', show: showPractice },
      { href: '/recite', Icon: ReciteIcon, label: 'Recite', ariaLabel: 'Live Recitation', show: true },
      { href: '/mushaf', Icon: QuranIcon, label: 'Quran', ariaLabel: 'Read Quran', show: true },
      { href: '/profile', Icon: ProfileIcon, label: 'Profile', ariaLabel: 'View Profile', show: true },
    ];
    
    return items.filter(item => item.show);
  }, [showLearn, showPractice]);

  return (
    <nav 
      role="navigation"
      aria-label="Main navigation"
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ease-out ${
        isCollapsed ? 'pb-3' : 'pb-5 sm:pb-6'
      }`}
      style={{ paddingBottom: `max(${isCollapsed ? '0.75rem' : '1.25rem'}, env(safe-area-inset-bottom))` }}
    >
      {/* Premium frosted glass floating nav - narrower for centered icons */}
      <motion.div 
        layout
        className={`mx-auto overflow-hidden ${
          isCollapsed 
            ? 'max-w-[280px] rounded-full' 
            : 'max-w-sm rounded-2xl'
        }`}
        style={{
          background: 'rgba(22, 27, 34, 0.60)',
          backdropFilter: 'blur(64px) saturate(200%)',
          WebkitBackdropFilter: 'blur(64px) saturate(200%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow: '0 -2px 20px rgba(0, 0, 0, 0.15), 0 4px 24px rgba(0, 0, 0, 0.25), 0 8px 32px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className={`relative flex items-center justify-around ${
          isCollapsed ? 'px-4 py-2' : 'px-2 sm:px-4 py-2.5 sm:py-3'
        }`}
        style={{
          transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  relative flex flex-col items-center gap-0.5 sm:gap-1 
                  min-w-[52px] min-h-[48px]
                  ${isCollapsed ? 'px-2 py-1.5' : 'px-3 sm:px-4 py-1.5'}
                  touch-manipulation
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50 
                  focus-visible:ring-offset-2 focus-visible:ring-offset-night-950
                  rounded-xl
                `}
                style={{
                  WebkitTapHighlightColor: 'transparent',
                  transition: 'transform 0.15s ease',
                }}
              >
                {/* Active indicator - smooth gradient glow */}
                {isActive && (
                  <motion.div 
                    layoutId="nav-indicator"
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{
                      background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201, 162, 39, 0.12) 0%, transparent 70%)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Icon container with smooth glass effect */}
                <motion.div 
                  className="relative p-2 rounded-xl"
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(201, 162, 39, 0.12) 0%, rgba(201, 162, 39, 0.06) 100%)'
                      : 'transparent',
                    border: isActive 
                      ? '1px solid rgba(201, 162, 39, 0.15)'
                      : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                  whileTap={{ scale: 0.92 }}
                >
                  <item.Icon 
                    className={`w-5 h-5 sm:w-[22px] sm:h-[22px] transition-colors duration-200 ${
                      isActive 
                        ? 'text-gold-400' 
                        : 'text-night-400'
                    }`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                </motion.div>
                
                {/* Label - hidden when collapsed */}
                <span 
                  className={`text-[10px] sm:text-xs font-medium ${
                    isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                  } ${
                    isActive ? 'text-gold-400' : 'text-night-500'
                  }`}
                  style={{
                    transition: 'opacity 0.2s ease, color 0.2s ease',
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
}
