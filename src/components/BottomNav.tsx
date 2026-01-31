'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, GraduationCap, Home, User } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    { href: '/', icon: Home, label: 'Home' },
    { href: '/mushaf', icon: BookOpen, label: 'Quran' },
    { href: '/lessons', icon: GraduationCap, label: 'Learn' },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav 
      className={`fixed bottom-0 left-0 right-0 z-50 px-4 transition-all duration-300 ease-out ${
        isCollapsed ? 'pb-2' : 'pb-4'
      }`}
      style={{ paddingBottom: `max(${isCollapsed ? '0.5rem' : '1rem'}, env(safe-area-inset-bottom))` }}
    >
      {/* Floating pill nav container */}
      <div 
        className={`mx-auto transition-all duration-300 ease-out ${
          isCollapsed 
            ? 'max-w-[200px] rounded-full' 
            : 'max-w-md rounded-2xl'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(40, 40, 45, 0.92) 0%, rgba(30, 30, 35, 0.96) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        {/* Inner glow effect */}
        <div 
          className="absolute inset-0 rounded-inherit opacity-50 pointer-events-none overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.08) 0%, transparent 60%)',
            borderRadius: 'inherit',
          }}
        />
        
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
                {/* Active indicator glow */}
                {isActive && (
                  <div 
                    className="absolute inset-0 -z-10 rounded-xl opacity-100"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(201, 162, 39, 0.2) 0%, transparent 70%)',
                    }}
                  />
                )}
                
                {/* Icon with liquid glass effect when active */}
                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-gold-500/10' 
                    : 'hover:bg-white/5'
                }`}>
                  <item.icon 
                    className={`transition-all duration-200 ${
                      isCollapsed ? 'w-5 h-5' : 'w-5 h-5'
                    } ${
                      isActive 
                        ? 'text-gold-400 drop-shadow-[0_0_8px_rgba(201,162,39,0.5)]' 
                        : 'text-night-400 hover:text-night-200'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
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
