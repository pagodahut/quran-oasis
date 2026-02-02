'use client';

import BottomNav from '@/components/BottomNav';

export default function TechniquesLoading() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header skeleton */}
      <header 
        className="sticky top-0 z-40 safe-area-top"
        style={{
          background: 'linear-gradient(180deg, rgba(15,15,20,0.95) 0%, rgba(15,15,20,0.85) 100%)',
          backdropFilter: 'blur(24px) saturate(180%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-11 h-11 rounded-xl bg-night-800/60 animate-pulse" />
          <div className="h-6 w-48 bg-night-800/60 rounded-lg animate-pulse" />
          <div className="w-11" />
        </div>
      </header>

      <main className="px-4 py-6 pb-28 max-w-2xl mx-auto">
        {/* Intro card skeleton */}
        <div
          className="rounded-3xl p-6 mb-8 animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(201,162,39,0.12) 0%, rgba(201,162,39,0.04) 100%)',
            border: '1px solid rgba(201,162,39,0.2)',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-500/20" />
            <div className="flex-1">
              <div className="h-6 w-36 bg-gold-500/20 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gold-500/10 rounded" />
                <div className="h-4 w-5/6 bg-gold-500/10 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Technique sections skeleton */}
        <div className="space-y-8">
          {[1, 2, 3, 4].map((section) => (
            <div key={section} className="animate-pulse">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-sage-500/10" />
                <div className="h-6 w-40 bg-night-800/60 rounded" />
              </div>
              
              {/* Content card */}
              <div className="liquid-card rounded-2xl p-5 space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-night-800/50 rounded" />
                  <div className="h-4 w-4/5 bg-night-800/50 rounded" />
                </div>
                
                {/* Steps */}
                <div className="space-y-3">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gold-500/10" />
                      <div className="flex-1">
                        <div className="h-4 w-3/4 bg-night-800/50 rounded mb-1" />
                        <div className="h-3 w-1/2 bg-night-800/40 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Tip box */}
                <div 
                  className="rounded-xl p-4"
                  style={{
                    background: 'linear-gradient(135deg, rgba(134,169,113,0.12) 0%, rgba(134,169,113,0.04) 100%)',
                    border: '1px solid rgba(134,169,113,0.2)',
                  }}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-sage-500/20 rounded mt-0.5" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 w-full bg-sage-500/15 rounded" />
                      <div className="h-3 w-3/4 bg-sage-500/15 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
