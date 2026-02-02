'use client';

import BottomNav from '@/components/BottomNav';
import Skeleton from '@/components/Skeleton';

export default function PracticeLoading() {
  return (
    <div className="min-h-screen bg-night-950 pb-24">
      {/* Background pattern placeholder */}
      <div className="fixed inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(201,162,39,0.15) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Header skeleton - Frosted glass style */}
      <header 
        className="sticky top-0 z-40 safe-area-top mx-2 mt-2 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(22, 27, 34, 0.72)',
          backdropFilter: 'blur(48px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-11 h-11 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(201,162,39,0.3) 0%, rgba(201,162,39,0.15) 100%)',
                  animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
                  backgroundSize: '200% 100%',
                }}
              />
              <div>
                <Skeleton width={120} height={20} className="mb-1.5" />
                <Skeleton width={140} height={14} />
              </div>
            </div>
            
            {/* Streak skeleton */}
            <div 
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="w-6 h-6 rounded-full bg-orange-500/30 animate-pulse" />
              <div>
                <Skeleton width={60} height={18} className="mb-1" />
                <Skeleton width={80} height={12} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative px-4 py-6 space-y-6">
        {/* Stats row skeleton */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="rounded-2xl p-4 flex flex-col items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl mb-2"
                style={{
                  background: i === 1 ? 'rgba(201,162,39,0.15)' : 
                             i === 2 ? 'rgba(134,169,113,0.15)' : 
                             i === 3 ? 'rgba(147,112,219,0.15)' : 
                             'rgba(251,146,60,0.15)',
                  animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
                  backgroundSize: '200% 100%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
              <Skeleton width={48} height={24} className="mb-1" />
              <Skeleton width={64} height={12} />
            </div>
          ))}
        </div>

        {/* Section title */}
        <Skeleton width={200} height={20} className="mb-2" />

        {/* Category cards skeleton */}
        <div className="space-y-4">
          {['gold', 'purple', 'sage'].map((color, i) => (
            <div 
              key={color}
              className="rounded-2xl p-5 relative overflow-hidden"
              style={{
                background: color === 'gold' 
                  ? 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(20,20,25,0.95) 100%)'
                  : color === 'purple'
                    ? 'linear-gradient(135deg, rgba(147,112,219,0.08) 0%, rgba(20,20,25,0.95) 100%)'
                    : 'linear-gradient(135deg, rgba(134,169,113,0.08) 0%, rgba(20,20,25,0.95) 100%)',
                border: `1px solid ${color === 'gold' ? 'rgba(201,162,39,0.15)' : color === 'purple' ? 'rgba(147,112,219,0.15)' : 'rgba(134,169,113,0.15)'}`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl"
                    style={{
                      background: color === 'gold' 
                        ? 'rgba(201,162,39,0.2)' 
                        : color === 'purple' 
                          ? 'rgba(147,112,219,0.2)' 
                          : 'rgba(134,169,113,0.2)',
                      animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
                      backgroundSize: '200% 100%',
                      animationDelay: `${i * 0.15}s`,
                    }}
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Skeleton width={80} height={20} />
                      <Skeleton width={40} height={16} />
                    </div>
                    <Skeleton width={180} height={14} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <Skeleton width={100} height={14} />
                <Skeleton width={80} height={36} variant="rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Activity chart skeleton */}
        <div 
          className="rounded-2xl p-5"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded bg-gold-500/20 animate-pulse" />
            <Skeleton width={120} height={18} />
          </div>
          
          <div className="flex items-end justify-between gap-2 h-24">
            {[40, 70, 30, 90, 60, 45, 80].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div 
                  className="w-full rounded-t-lg"
                  style={{
                    height: `${h}%`,
                    background: i === 6 
                      ? 'linear-gradient(to top, rgba(201,162,39,0.4), rgba(201,162,39,0.2))'
                      : 'rgba(201,162,39,0.15)',
                    animation: 'skeleton-shimmer 1.8s ease-in-out infinite',
                    backgroundSize: '200% 100%',
                    animationDelay: `${i * 0.08}s`,
                  }}
                />
                <Skeleton width={20} height={12} />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Shimmer animation styles */}
      <style jsx>{`
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
