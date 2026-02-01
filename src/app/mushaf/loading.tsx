'use client';

import { SkeletonVerse } from '@/components/Skeleton';
import BottomNav from '@/components/BottomNav';

export default function MushafLoading() {
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
          <div className="flex-1 text-center mx-4">
            <div className="h-5 w-24 mx-auto bg-night-800/60 rounded-lg animate-pulse mb-1" />
            <div className="h-3 w-32 mx-auto bg-night-800/40 rounded animate-pulse" />
          </div>
          <div className="w-11 h-11 rounded-xl bg-night-800/60 animate-pulse" />
        </div>
      </header>

      <main className="pb-28">
        {/* Bismillah skeleton */}
        <div className="py-8 text-center">
          <div 
            className="h-10 w-64 mx-auto bg-gold-500/10 rounded-lg animate-pulse"
            style={{ direction: 'rtl' }}
          />
        </div>

        {/* Verses skeleton */}
        <div className="px-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i}
              className="rounded-2xl border border-night-800/50 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
              }}
            >
              <SkeletonVerse />
            </div>
          ))}
        </div>
      </main>
      
      {/* Audio player skeleton */}
      <div 
        className="fixed bottom-20 left-4 right-4 rounded-2xl p-4 animate-pulse"
        style={{
          background: 'linear-gradient(135deg, rgba(30,30,35,0.95) 0%, rgba(25,25,30,0.98) 100%)',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-night-800/60" />
          <div className="flex-1">
            <div className="h-4 w-32 bg-night-800/60 rounded mb-2" />
            <div className="h-2 w-full bg-night-800/40 rounded-full" />
          </div>
          <div className="flex gap-2">
            <div className="w-10 h-10 rounded-xl bg-night-800/60" />
            <div className="w-10 h-10 rounded-xl bg-night-800/60" />
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
