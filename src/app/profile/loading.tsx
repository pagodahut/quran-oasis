'use client';

import BottomNav from '@/components/BottomNav';

export default function ProfileLoading() {
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
          <div className="h-6 w-20 bg-night-800/60 rounded-lg animate-pulse" />
          <div className="w-11 h-11 rounded-xl bg-night-800/60 animate-pulse" />
        </div>
      </header>

      <main className="pb-28 px-4 py-6 max-w-lg mx-auto">
        {/* Profile header skeleton */}
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="w-24 h-24 mx-auto rounded-full bg-night-800/60 animate-pulse mb-4" />
          
          {/* Name */}
          <div className="h-7 w-40 mx-auto bg-night-800/60 rounded-lg animate-pulse mb-2" />
          
          {/* Email / subtitle */}
          <div className="h-4 w-48 mx-auto bg-night-800/40 rounded animate-pulse" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[1, 2, 3].map((i) => (
            <div 
              key={i}
              className="p-4 rounded-2xl animate-pulse"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="h-8 w-16 mx-auto bg-night-800/60 rounded-lg mb-2" />
              <div className="h-3 w-14 mx-auto bg-night-800/40 rounded" />
            </div>
          ))}
        </div>

        {/* Achievement section skeleton */}
        <div className="mb-8">
          <div className="h-5 w-28 bg-night-800/40 rounded mb-4 animate-pulse" />
          <div className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="flex-shrink-0 w-16 h-16 rounded-xl bg-night-800/40 animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Menu items skeleton */}
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="flex items-center gap-4 p-4 rounded-2xl animate-pulse"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-night-800/60" />
              <div className="flex-1">
                <div className="h-4 w-32 bg-night-800/60 rounded mb-1" />
                <div className="h-3 w-24 bg-night-800/40 rounded" />
              </div>
              <div className="w-5 h-5 bg-night-800/40 rounded" />
            </div>
          ))}
        </div>

        {/* Sign out button skeleton */}
        <div className="mt-8">
          <div className="h-12 w-full bg-red-500/10 rounded-xl animate-pulse" />
        </div>
      </main>
      
      <BottomNav />
    </div>
  );
}
