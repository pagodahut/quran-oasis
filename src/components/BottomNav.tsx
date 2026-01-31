'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// Custom geometric icons - cohesive Islamic-inspired design
function HomeIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M3 12l9-8 9 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 10v9a1 1 0 001 1h4v-5a1 1 0 011-1h2a1 1 0 011 1v5h4a1 1 0 001-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function QuranIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6v6m-3-3h6" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

function LearnIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <path d="M12 3L2 9l10 6 10-6-10-6z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12l10 6 10-6" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

function ProfileIcon({ className = "", strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} strokeWidth={strokeWidth} stroke="currentColor">
      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Collapse nav on scroll down, expand on scroll up (iOS-style)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsCollapsed(true);
      } else if (currentScrollY < lastScrollY) {
        setIsCollapsed(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { href: '/', Icon: HomeIcon, label: 'Home' },
    { href: '/mushaf', Icon: QuranIcon, label: 'Quran' },
    { href: '/lessons', Icon: LearnIcon, label: 'Learn' },
    { href: '/profile', Icon: ProfileIcon, label: 'Profile' },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 transition-all duration-300 ease-out ${
        isCollapsed ? 'pb-2' : 'pb-4'
      }`}
      style={{ paddingBottom: `max(${isCollapsed ? '0.5rem' : '1rem'}, env(safe-area-inset-bottom))` }}
    >
      {/* Liquid glass floating pill nav */}
      <div 
        className={`liquid-glass mx-auto transition-all duration-300 ease-out overflow-hidden ${
          isCollapsed 
            ? 'max-w-[200px] rounded-full' 
            : 'max-w-md rounded-2xl'
        }`}
      >
        <div className={`relative flex items-center justify-around transition-all duration-300 ${
          isCollapsed ? 'px-3 py-2' : 'px-4 py-3'
        }`}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1 transition-all duration-200 ${
                  isCollapsed ? 'px-2' : 'px-4 py-1'
                }`}
              >
                {/* Active indicator - subtle liquid glass glow */}
                {isActive && (
                  <div 
                    className="absolute inset-0 -z-10 rounded-xl"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
                    }}
                  />
                )}
                
                {/* Icon container with liquid glass effect when active */}
                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gold-500/10' 
                    : 'hover:bg-white/5'
                }`}
                style={isActive ? {
                  boxShadow: 'inset 0 1px 0 rgba(201, 162, 39, 0.1)',
                } : {}}
                >
                  <item.Icon 
                    className={`w-5 h-5 transition-all duration-200 ${
                      isActive 
                        ? 'text-gold-400' 
                        : 'text-night-400 hover:text-night-200'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {/* Glow effect for active state */}
                  {isActive && (
                    <div 
                      className="absolute inset-0 rounded-xl opacity-50 blur-sm -z-10"
                      style={{
                        background: 'radial-gradient(circle, rgba(201, 162, 39, 0.4) 0%, transparent 70%)',
                      }}
                    />
                  )}
                </div>
                
                {/* Label - hidden when collapsed */}
                <span 
                  className={`text-xs font-medium transition-all duration-200 ${
                    isCollapsed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
                  } ${
                    isActive ? 'text-gold-400' : 'text-night-500'
                  }`}
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
