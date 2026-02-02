'use client';

import BottomNav from '@/components/BottomNav';

export default function SurahsLoading() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header skeleton */}
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-night-800/60 animate-pulse" />
            <div className="flex-1">
              <div className="h-6 w-28 bg-night-800/60 rounded-lg animate-pulse mb-1" />
              <div className="h-3 w-36 bg-night-800/40 rounded animate-pulse" />
            </div>
            <div className="w-10 h-10 rounded-xl bg-night-800/60 animate-pulse" />
          </div>

          {/* Search skeleton */}
          <div className="h-12 w-full bg-night-800/50 rounded-xl animate-pulse" />
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 pb-28">
        {/* Results count skeleton */}
        <div className="h-4 w-28 bg-night-800/40 rounded animate-pulse mb-4" />

        {/* Juz Amma card skeleton */}
        <div 
          className="mb-6 rounded-2xl p-4 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.03) 100%)',
            border: '1px solid rgba(201,162,39,0.1)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="h-5 w-36 bg-gold-500/20 rounded mb-2" />
              <div className="h-4 w-48 bg-gold-500/10 rounded" />
            </div>
            <div className="h-8 w-16 bg-gold-500/15 rounded-full" />
          </div>
        </div>

        {/* Surah cards skeleton */}
        <div className="space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div 
              key={i}
              className="liquid-card p-4 animate-pulse"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Number badge */}
                <div className="w-12 h-12 rounded-xl bg-gold-500/10" />
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-24 bg-night-800/60 rounded" />
                    <div className="h-4 w-14 bg-amber-500/10 rounded-full" />
                  </div>
                  <div className="h-4 w-32 bg-night-800/40 rounded mb-1" />
                  <div className="h-3 w-24 bg-night-800/30 rounded" />
                </div>
                
                {/* Arabic name */}
                <div className="h-6 w-16 bg-gold-500/15 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
