'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';

interface IconProps { className?: string; strokeWidth?: number; style?: React.CSSProperties }

function HomeIcon({ className = "", strokeWidth = 1.75, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true" style={style}>
      <path d="M3 12l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-5a1 1 0 011-1h2a1 1 0 011 1v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuranIcon({ className = "", strokeWidth = 1.75, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true" style={style}>
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7h8M8 10h6M8 13h7" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  );
}

function PracticeIcon({ className = "", strokeWidth = 1.75, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true" style={style}>
      <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProfileIcon({ className = "", strokeWidth = 1.75, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor" aria-hidden="true" style={style}>
      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const navItems = [
  { href: '/dashboard', Icon: HomeIcon, label: 'Home', ariaLabel: 'Go to Dashboard' },
  { href: '/mushaf', Icon: QuranIcon, label: 'Quran', ariaLabel: 'Browse Quran' },
  { href: '/practice', Icon: PracticeIcon, label: 'Practice', ariaLabel: 'Go to Practice' },
  { href: '/profile', Icon: ProfileIcon, label: 'Profile', ariaLabel: 'View Profile' },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [isHidden, setIsHidden] = useState(false);
  const lastScrollY = useRef(0);

  const isMushafPage = pathname === '/mushaf' || pathname.startsWith('/mushaf?');

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY.current + 10 && currentScrollY > 100) {
      if (isMushafPage) setIsHidden(true);
    } else if (currentScrollY < lastScrollY.current - 10) {
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
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHidden ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      style={{ padding: '0 16px max(12px, env(safe-area-inset-bottom)) 16px' }}
    >
      <div
        className="mx-auto max-w-sm rounded-2xl"
        style={{
          background: 'var(--theme-card)',
          border: '1px solid var(--theme-border)',
          boxShadow: '0 -1px 20px rgba(0,0,0,0.06), 0 4px 20px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-around px-2 py-2">
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
                className="relative flex flex-col items-center gap-0.5 min-w-[52px] min-h-[48px] px-3 py-1.5 rounded-xl touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{ background: 'var(--ambient-gold-subtle)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div
                  className="p-1"
                  style={{ color: isActive ? 'var(--ambient-gold)' : 'var(--theme-text-muted)' }}
                >
                  <item.Icon
                    className="w-5 h-5 transition-colors duration-200"
                    strokeWidth={isActive ? 2 : 1.75}
                  />
                </div>

                <span
                  className="text-[10px] font-medium transition-colors duration-200"
                  style={{ color: isActive ? 'var(--ambient-gold)' : 'var(--theme-text-muted)' }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
