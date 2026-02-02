'use client';

import BottomNav from '@/components/BottomNav';

export default function LessonLoading() {
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
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-night-800/60 animate-pulse" />
            <div className="flex-1 mx-4">
              {/* Progress bar skeleton */}
              <div className="h-2 w-full bg-night-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full w-1/3 rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, rgba(201,162,39,0.4) 0%, rgba(201,162,39,0.6) 100%)',
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <div className="h-3 w-16 bg-night-800/40 rounded animate-pulse" />
                <div className="h-3 w-12 bg-night-800/40 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-night-800/60 animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="px-4 py-6 pb-32 max-w-2xl mx-auto">
        {/* Lesson title */}
        <div className="mb-6 animate-pulse">
          <div className="h-4 w-20 bg-gold-500/15 rounded mb-2" />
          <div className="h-8 w-64 bg-night-800/60 rounded-lg mb-2" />
          <div className="h-4 w-48 bg-night-800/40 rounded" />
        </div>

        {/* Content blocks */}
        <div className="space-y-6">
          {/* Text block */}
          <div className="liquid-card rounded-2xl p-5 animate-pulse">
            <div className="space-y-3">
              <div className="h-5 w-full bg-night-800/50 rounded" />
              <div className="h-5 w-11/12 bg-night-800/50 rounded" />
              <div className="h-5 w-4/5 bg-night-800/50 rounded" />
            </div>
          </div>

          {/* Arabic verse block */}
          <div 
            className="rounded-2xl p-6 animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.03) 100%)',
              border: '1px solid rgba(201,162,39,0.15)',
            }}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-4/5 bg-gold-500/15 rounded" />
              <div className="h-8 w-3/5 bg-gold-500/15 rounded" />
              <div className="h-4 w-2/3 bg-gold-500/10 rounded mt-2" />
            </div>
          </div>

          {/* Audio player skeleton */}
          <div className="liquid-card rounded-2xl p-4 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/15" />
              <div className="flex-1">
                <div className="h-2 w-full bg-night-800/50 rounded-full mb-2" />
                <div className="flex justify-between">
                  <div className="h-3 w-12 bg-night-800/40 rounded" />
                  <div className="h-3 w-12 bg-night-800/40 rounded" />
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-night-800/50" />
            </div>
          </div>

          {/* Practice prompt */}
          <div className="liquid-card rounded-2xl p-5 animate-pulse">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sage-500/10" />
              <div className="flex-1">
                <div className="h-5 w-32 bg-night-800/50 rounded mb-2" />
                <div className="h-4 w-full bg-night-800/40 rounded" />
              </div>
            </div>
            <div className="h-12 w-full bg-sage-500/10 rounded-xl" />
          </div>
        </div>
      </main>

      {/* Bottom action button skeleton */}
      <div className="fixed bottom-24 left-4 right-4 z-30">
        <div 
          className="max-w-2xl mx-auto h-14 rounded-2xl animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(201,162,39,0.3) 0%, rgba(201,162,39,0.2) 100%)',
            border: '1px solid rgba(201,162,39,0.2)',
          }}
        />
      </div>

      <BottomNav />
    </div>
  );
}
