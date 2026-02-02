'use client';

import { SkeletonVerse } from '@/components/Skeleton';
import BottomNav from '@/components/BottomNav';

export default function MushafLoading() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header skeleton - Premium frosted glass style */}
      <header 
        className="sticky top-0 z-40 safe-area-top mx-2 mt-2 rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(22, 27, 34, 0.72)',
          backdropFilter: 'blur(48px)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-1.5">
            <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
            <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
          </div>
          
          {/* Surah title skeleton */}
          <div className="flex-1 mx-3 text-center">
            <div className="h-6 w-24 mx-auto bg-gold-500/20 rounded-lg animate-pulse mb-1" />
            <div className="h-3 w-20 mx-auto bg-white/5 rounded animate-pulse" />
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
            <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
            <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
          </div>
        </div>
        
        {/* Navigation skeleton */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.04]">
          <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
          <div className="h-3 w-32 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-12 bg-white/5 rounded animate-pulse" />
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="pb-48 px-4 py-6 max-w-3xl mx-auto">
        {/* Surah header skeleton */}
        <div className="text-center mb-8">
          <div className="h-12 w-40 mx-auto bg-gold-500/15 rounded-xl animate-pulse mb-2" />
          <div className="h-4 w-56 mx-auto bg-white/5 rounded animate-pulse" />
        </div>

        {/* Bismillah skeleton */}
        <div className="text-center mb-8 py-4 border-y border-white/5">
          <div className="h-8 w-64 mx-auto bg-gold-500/10 rounded-lg animate-pulse" />
        </div>

        {/* Verses skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div 
              key={i}
              className="rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <SkeletonVerse />
            </div>
          ))}
        </div>
      </main>

      {/* Audio player skeleton */}
      <div 
        className="fixed bottom-20 left-2 right-2 z-40 rounded-2xl p-4"
        style={{
          background: 'linear-gradient(180deg, rgba(28,33,40,0.92) 0%, rgba(22,27,34,0.96) 100%)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="max-w-3xl mx-auto">
          {/* Now playing skeleton */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="h-3 w-16 bg-white/5 rounded animate-pulse mb-1" />
              <div className="h-4 w-28 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="flex gap-1.5">
              <div className="h-8 w-14 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-8 w-14 bg-white/5 rounded-lg animate-pulse" />
              <div className="h-8 w-14 bg-white/5 rounded-lg animate-pulse" />
            </div>
          </div>
          
          {/* Controls skeleton */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
            <div className="w-16 h-16 rounded-full bg-gold-500/30 animate-pulse" />
            <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse" />
          </div>
          
          {/* Reciter skeleton */}
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
            <div className="h-5 w-12 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
