'use client';

import BottomNav from '@/components/BottomNav';

export default function SettingsLoading() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header skeleton */}
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-night-800/60 animate-pulse" />
            <div className="h-6 w-24 bg-night-800/60 rounded-lg animate-pulse" />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 pb-28 space-y-8 max-w-2xl mx-auto">
        {/* Settings sections */}
        {[
          { icon: 'gold', items: 4 },
          { icon: 'purple', items: 3 },
          { icon: 'sage', items: 2 },
        ].map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-4 animate-pulse">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-xl ${
                  section.icon === 'gold' ? 'bg-gold-500/10' :
                  section.icon === 'purple' ? 'bg-purple-500/10' :
                  'bg-sage-500/10'
                }`}
              />
              <div>
                <div className="h-5 w-32 bg-night-800/60 rounded mb-1" />
                <div className="h-3 w-48 bg-night-800/40 rounded" />
              </div>
            </div>

            {/* Setting items */}
            <div className="space-y-3">
              {Array.from({ length: section.items }).map((_, i) => (
                <div 
                  key={i}
                  className="p-4 rounded-xl bg-night-800/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-5 w-36 bg-night-800/60 rounded mb-1" />
                      <div className="h-3 w-56 bg-night-800/40 rounded" />
                    </div>
                    <div className="w-12 h-7 rounded-full bg-night-700" />
                  </div>
                </div>
              ))}
            </div>

            {/* Divider */}
            {sectionIndex < 2 && (
              <div className="h-px bg-night-800/50 my-4" />
            )}
          </div>
        ))}

        {/* Grid section skeleton */}
        <div className="grid grid-cols-2 gap-3 animate-pulse">
          {[1, 2].map((i) => (
            <div 
              key={i}
              className="p-4 rounded-xl bg-night-800/50"
            >
              <div className="w-5 h-5 bg-night-700 rounded mb-2" />
              <div className="h-5 w-16 bg-night-800/60 rounded mb-1" />
              <div className="h-3 w-24 bg-night-800/40 rounded" />
            </div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
