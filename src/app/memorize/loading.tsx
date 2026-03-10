'use client';

import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

export default function MemorizeLoading() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header skeleton */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass rounded-b-2xl mx-2">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
            </div>
            
            {/* Title skeleton */}
            <div className="flex-1 mx-3 text-center">
              <div className="h-6 w-28 mx-auto bg-gold-500/20 rounded-lg animate-pulse mb-1" />
              <div className="h-3 w-20 mx-auto bg-white/5 rounded animate-pulse" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
              <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="px-4 py-6 pb-32">
        <div className="max-w-2xl mx-auto">
          {/* Progress header */}
          <div className="text-center mb-8">
            <div className="h-8 w-40 mx-auto bg-gold-500/15 rounded-xl animate-pulse mb-2" />
            <div className="h-4 w-56 mx-auto bg-white/5 rounded animate-pulse mb-4" />
            
            {/* Progress bar */}
            <div className="w-full h-3 bg-night-800/60 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "45%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
            <div className="h-3 w-24 mx-auto bg-white/5 rounded animate-pulse" />
          </div>

          {/* Verse content skeleton */}
          <div className="liquid-card-interactive p-6 mb-6">
            {/* Ayah number */}
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500/20 mx-auto flex items-center justify-center">
                <div className="w-6 h-6 bg-gold-500/30 rounded animate-pulse" />
              </div>
            </div>

            {/* Arabic text skeleton */}
            <div className="text-center mb-6 space-y-3">
              <div className="h-12 w-full bg-gold-500/10 rounded-xl animate-pulse" />
              <div className="h-10 w-4/5 mx-auto bg-gold-500/10 rounded-xl animate-pulse" />
              <div className="h-8 w-3/5 mx-auto bg-gold-500/10 rounded-xl animate-pulse" />
            </div>

            {/* Translation skeleton */}
            <div className="bg-night-800/30 rounded-xl p-4 border-l-4 border-sage-500/50">
              <div className="space-y-2">
                <div className="h-4 w-full bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-5/6 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-4/5 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Action buttons skeleton */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.2 }}
                className="liquid-card-interactive p-4 text-center"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 mx-auto mb-2 animate-pulse" />
                <div className="h-4 w-20 bg-white/10 rounded mx-auto animate-pulse mb-1" />
                <div className="h-3 w-24 bg-white/5 rounded mx-auto animate-pulse" />
              </motion.div>
            ))}
          </div>

          {/* Navigation controls skeleton */}
          <div className="flex items-center justify-between">
            <div className="h-12 w-24 bg-white/5 rounded-xl animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-600/10 animate-pulse" />
              <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
            </div>
            <div className="h-12 w-24 bg-white/5 rounded-xl animate-pulse" />
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}