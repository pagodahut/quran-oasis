'use client';

import { SkeletonLessonCard } from '@/components/Skeleton';
import BottomNav from '@/components/BottomNav';

export default function LessonsLoading() {
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
          <div className="w-11" />
        </div>
      </header>

      <main className="pb-28 px-4 py-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="text-center p-4 rounded-2xl bg-night-900/40 animate-pulse"
            >
              <div className="h-8 w-16 mx-auto bg-night-800/60 rounded-lg mb-2" />
              <div className="h-3 w-12 mx-auto bg-night-800/40 rounded" />
            </div>
          ))}
        </div>

        {/* Progress card skeleton */}
        <div 
          className="rounded-3xl p-6 mb-6 bg-night-900/40 animate-pulse"
        >
          <div className="flex justify-between mb-4">
            <div>
              <div className="h-4 w-24 bg-night-800/60 rounded mb-2" />
              <div className="h-8 w-16 bg-night-800/60 rounded" />
            </div>
            <div className="text-right">
              <div className="h-4 w-20 bg-night-800/60 rounded mb-2" />
              <div className="h-4 w-28 bg-night-800/40 rounded" />
            </div>
          </div>
          <div className="h-3 w-full bg-night-800/60 rounded-full" />
        </div>

        {/* Continue learning skeleton */}
        <div 
          className="rounded-2xl p-5 mb-8 bg-gold-500/10 animate-pulse flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gold-500/20" />
          <div className="flex-1">
            <div className="h-3 w-24 bg-gold-500/20 rounded mb-2" />
            <div className="h-5 w-40 bg-gold-500/20 rounded" />
          </div>
        </div>

        {/* Section title skeleton */}
        <div className="h-4 w-32 bg-night-800/40 rounded mb-4" />

        {/* Lesson cards skeleton */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="rounded-3xl overflow-hidden bg-night-900/40 animate-pulse"
            >
              {/* Unit header */}
              <div className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-night-800/60" />
                <div className="flex-1">
                  <div className="h-3 w-16 bg-night-800/40 rounded mb-2" />
                  <div className="h-5 w-40 bg-night-800/60 rounded mb-2" />
                  <div className="h-3 w-24 bg-night-800/40 rounded" />
                </div>
                <div className="w-10 h-10 rounded-xl bg-night-800/40" />
              </div>
              {/* Progress bar */}
              <div className="px-5 pb-4">
                <div className="h-2 w-full bg-night-800/40 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
