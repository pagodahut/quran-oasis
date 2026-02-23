'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

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
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7h8M8 10h6M8 13h7" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
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

function ProfileIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true">
      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Fixed 4-tab navigation: Home, Quran, Practice, Profile
const navItems = [
  { href: '/dashboard', Icon: HomeIcon, label: 'Home', ariaLabel: 'Go to Dashboard' },
  { href: '/mushaf', Icon: QuranIcon, label: 'Quran', ariaLabel: 'Browse Quran' },
  { href: '/practice', Icon: PracticeIcon, label: 'Practice', ariaLabel: 'Go to Practice' },
  { href: '/profile', Icon: ProfileIcon, label: 'Profile', ariaLabel: 'View Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Check if we're on mushaf page
  const isMushafPage = pathname === '/mushaf' || pathname.startsWith('/mushaf?');

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 100) {
      if (isMushafPage) {
        setIsHidden(true);
        setIsCollapsed(false);
      } else {
        setIsCollapsed(true);
        setIsHidden(false);
      }
    } else if (currentScrollY < lastScrollY.current - 10) {
      setIsCollapsed(false);
      setIsHidden(false);
    }
    lastScrollY.current = currentScrollY;
  }, [isMushafPage]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <nav 
      role="navigation"
      aria-label="Main navigation"
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ease-out ${
        isHidden ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      } ${isCollapsed ? 'pb-3' : 'pb-5 sm:pb-6'}`}
      style={{ paddingBottom: `max(${isCollapsed ? '0.75rem' : '1.25rem'}, env(safe-area-inset-bottom))` }}
    >
      {/* Premium frosted glass floating nav - dynamic width based on item count */}
      <motion.div 
        layout
        className={`mx-auto overflow-hidden ${
          isCollapsed 
            ? `rounded-full` 
            : 'max-w-sm rounded-2xl'
        }`}
        style={{
          maxWidth: isCollapsed 
            ? `${Math.min(4 * 52 + 32, 340)}px`
            : undefined,
          background: 'var(--theme-glass-base)',
          backdropFilter: 'blur(64px) saturate(200%)',
          WebkitBackdropFilter: 'blur(64px) saturate(200%)',
          border: '1px solid var(--theme-glass-border)',
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
            // Active matching: exact match or sub-route match
            // /recite covers /recite, /recite/1, /mushaf, /surahs, /identify etc.
            // /practice covers /practice, /practice/*
            // /profile covers /profile, /settings
            const isActive = pathname === item.href || 
              (item.href === '/dashboard' && pathname === '/') ||
              (item.href === '/mushaf' && ['/surahs', '/browse', '/identify', '/recite'].some(p => pathname.startsWith(p))) ||
              (item.href === '/profile' && pathname.startsWith('/settings')) ||
              (item.href !== '/' && item.href !== '/dashboard' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  relative flex flex-col items-center gap-0.5 sm:gap-1 
                  ${isCollapsed ? 'min-w-[44px] min-h-[40px]' : 'min-w-[52px] min-h-[48px]'}
                  ${isCollapsed ? 'px-1.5 py-1' : 'px-3 sm:px-4 py-1.5'}
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
                  whileTap={{ scale: 0.85 }}
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
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
