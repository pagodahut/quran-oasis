'use client';

import BottomNav from '@/components/BottomNav';

export default function PracticeLoading() {
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

      <main className="pb-28 px-4 py-6">
        {/* Streak and Today's Goal skeleton */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 px-4 py-3 rounded-xl bg-night-900/50 border border-night-800 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-night-800/60" />
              <div>
                <div className="h-6 w-16 bg-night-800/60 rounded mb-1" />
                <div className="h-3 w-20 bg-night-800/40 rounded" />
              </div>
            </div>
          </div>
          <div className="flex-1 px-4 py-3 rounded-xl bg-night-900/50 border border-night-800 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-night-800/60" />
              <div>
                <div className="h-6 w-12 bg-night-800/60 rounded mb-1" />
                <div className="h-3 w-16 bg-night-800/40 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="bg-night-900/50 border border-night-800 rounded-2xl p-4 animate-pulse"
            >
              <div className="w-10 h-10 rounded-xl bg-night-800/60 mx-auto mb-2" />
              <div className="h-6 w-8 mx-auto bg-night-800/60 rounded mb-2" />
              <div className="h-3 w-12 mx-auto bg-night-800/40 rounded" />
            </div>
          ))}
        </div>

        {/* Review section skeleton */}
        <div className="mb-8">
          <div className="h-5 w-28 bg-night-800/60 rounded mb-4 animate-pulse" />
          <div 
            className="rounded-2xl p-6 animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(201,162,39,0.03) 100%)',
              border: '1px solid rgba(201,162,39,0.15)',
            }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl bg-gold-500/20" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-gold-500/20 rounded mb-2" />
                <div className="h-4 w-48 bg-gold-500/10 rounded" />
              </div>
            </div>
            <div className="h-12 w-full bg-gold-500/20 rounded-xl" />
          </div>
        </div>

        {/* Practice modes skeleton */}
        <div className="h-5 w-32 bg-night-800/60 rounded mb-4 animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="rounded-2xl p-4 bg-night-900/50 border border-night-800 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-night-800/60" />
                <div className="flex-1">
                  <div className="h-5 w-28 bg-night-800/60 rounded mb-2" />
                  <div className="h-4 w-40 bg-night-800/40 rounded" />
                </div>
                <div className="w-6 h-6 rounded bg-night-800/40" />
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
