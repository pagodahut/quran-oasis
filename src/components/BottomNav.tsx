'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '@/components/ui/GlassPanel';

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

const spring = { type: 'spring' as const, stiffness: 400, damping: 25 };

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
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isHidden ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ padding: `0 16px max(${isCollapsed ? '8px' : '12px'}, env(safe-area-inset-bottom)) 16px` }}
    >
      <GlassPanel
        blur="xl"
        tint="neutral"
        glow={false}
        noise={true}
        rounded={isCollapsed ? 'rounded-full' : 'rounded-3xl'}
        className={`mx-auto transition-all duration-300 ease-out ${
          isCollapsed ? 'max-w-[280px]' : 'max-w-sm'
        }`}
      >
        <div
          className={`relative flex items-center justify-around ${
            isCollapsed ? 'px-3 py-1.5' : 'px-2 sm:px-4 py-2 sm:py-2.5'
          }`}
          style={{ transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/dashboard' && pathname === '/') ||
              (item.href === '/mushaf' &&
                ['/surahs', '/browse', '/identify', '/recite'].some((p) =>
                  pathname.startsWith(p)
                )) ||
              (item.href === '/profile' && pathname.startsWith('/settings')) ||
              (item.href === '/practice' && pathname.startsWith('/lessons')) ||
              (item.href !== '/' &&
                item.href !== '/dashboard' &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.ariaLabel}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  relative flex flex-col items-center gap-0.5
                  ${isCollapsed ? 'min-w-[40px] min-h-[36px] px-1.5 py-1' : 'min-w-[52px] min-h-[48px] px-3 sm:px-4 py-1.5'}
                  touch-manipulation
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/50
                  focus-visible:ring-offset-2 focus-visible:ring-offset-night-950
                  rounded-xl
                `}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {/* Active glow background */}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{
                      background:
                        'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201,162,39,0.14) 0%, transparent 70%)',
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                {/* Icon with spring tap animation */}
                <motion.div
                  className="relative p-1.5 rounded-xl"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(201,162,39,0.14) 0%, rgba(201,162,39,0.06) 100%)'
                      : 'transparent',
                    border: isActive
                      ? '1px solid rgba(201,162,39,0.18)'
                      : '1px solid transparent',
                  }}
                  whileTap={{ scale: 0.82 }}
                  animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                  transition={spring}
                >
                  <item.Icon
                    className={`w-5 h-5 sm:w-[22px] sm:h-[22px] transition-colors duration-200 ${
                      isActive ? 'text-gold-400' : 'text-night-400'
                    }`}
                    strokeWidth={isActive ? 2.25 : 1.75}
                  />
                </motion.div>

                {/* Label - hidden when collapsed */}
                <span
                  className={`text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                    isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                  } ${isActive ? 'text-gold-400' : 'text-night-500'}`}
                >
                  {item.label}
                </span>

                {/* Active bottom dot indicator */}
                {isActive && !isCollapsed && (
                  <motion.span
                    layoutId="nav-dot"
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-gold-400"
                    style={{ boxShadow: '0 0 6px rgba(201,162,39,0.6)' }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </GlassPanel>
    </nav>
  );
}
