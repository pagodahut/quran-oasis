'use client';

import BottomNav from '@/components/BottomNav';

export default function BookmarksLoading() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header skeleton */}
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-night-800/60 animate-pulse" />
              <div>
                <div className="h-6 w-28 bg-night-800/60 rounded-lg animate-pulse mb-1" />
                <div className="h-3 w-20 bg-night-800/40 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-16 bg-night-800/40 rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <main className="px-4 py-6 pb-28">
        {/* Surah group */}
        <div className="space-y-6">
          {[1, 2].map((group) => (
            <div key={group}>
              {/* Surah header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-gold-500/10 animate-pulse" />
                  <div className="h-5 w-24 bg-night-800/60 rounded animate-pulse" />
                </div>
                <div className="h-4 w-16 bg-night-800/40 rounded animate-pulse" />
              </div>

              {/* Bookmark cards */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i}
                    className="liquid-card p-4 animate-pulse"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="h-5 w-32 bg-night-800/60 rounded mb-2" />
                        <div className="h-5 w-20 bg-gold-500/15 rounded" />
                      </div>
                      <div className="text-right">
                        <div className="w-5 h-5 bg-gold-500/20 rounded mb-1" />
                        <div className="h-3 w-16 bg-night-800/40 rounded" />
                      </div>
                    </div>
                    
                    {/* Arabic text skeleton */}
                    <div className="flex flex-col items-end gap-2 mb-3" style={{ direction: 'rtl' }}>
                      <div className="h-5 w-full bg-night-800/50 rounded" />
                      <div className="h-5 w-3/4 bg-night-800/50 rounded" />
                    </div>
                    
                    {/* Translation skeleton */}
                    <div className="space-y-1.5">
                      <div className="h-3 w-full bg-night-800/40 rounded" />
                      <div className="h-3 w-5/6 bg-night-800/40 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
