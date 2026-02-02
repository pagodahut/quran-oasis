'use client';

import BottomNav from '@/components/BottomNav';

export default function ProgressLoading() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header skeleton */}
      <header 
        className="sticky top-0 z-40 safe-area-top"
        style={{
          background: 'linear-gradient(180deg, rgba(15,15,20,0.95) 0%, rgba(15,15,20,0.85) 100%)',
          backdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-11 h-11 rounded-xl bg-night-800/60 animate-pulse" />
          <div className="h-6 w-24 bg-night-800/60 rounded-lg animate-pulse" />
          <div className="w-11 h-11 rounded-xl bg-night-800/60 animate-pulse" />
        </div>
      </header>

      <main className="pb-28 px-4 py-6 max-w-lg mx-auto">
        {/* Main progress card skeleton */}
        <div 
          className="p-6 rounded-3xl mb-6 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(201, 162, 39, 0.02) 100%)',
            border: '1px solid rgba(201, 162, 39, 0.1)',
          }}
        >
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-4 w-24 bg-gold-500/20 rounded mb-2" />
              <div className="h-10 w-20 bg-gold-500/20 rounded" />
            </div>
            <div className="text-right">
              <div className="h-4 w-16 bg-gold-500/20 rounded mb-2" />
              <div className="h-10 w-24 bg-gold-500/20 rounded" />
            </div>
          </div>
          <div className="h-4 w-full bg-gold-500/15 rounded-full" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl animate-pulse"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-night-800/60 mb-3" />
              <div className="h-6 w-16 bg-night-800/60 rounded mb-1" />
              <div className="h-3 w-20 bg-night-800/40 rounded" />
            </div>
          ))}
        </div>

        {/* Weekly activity skeleton */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="h-5 w-32 bg-night-800/40 rounded animate-pulse" />
            <div className="h-4 w-20 bg-night-800/30 rounded animate-pulse" />
          </div>
          <div 
            className="p-4 rounded-2xl animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            <div className="flex justify-between items-end h-32">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div 
                    className="w-8 bg-night-800/60 rounded-t"
                    style={{ height: `${20 + Math.random() * 60}%` }}
                  />
                  <div className="h-3 w-6 bg-night-800/40 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Streak section skeleton */}
        <div 
          className="p-4 rounded-2xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/15" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-night-800/60 rounded mb-2" />
              <div className="h-3 w-32 bg-night-800/40 rounded" />
            </div>
            <div className="h-8 w-12 bg-night-800/40 rounded" />
          </div>
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
