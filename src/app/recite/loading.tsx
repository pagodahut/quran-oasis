'use client';

import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

export default function ReciteLoading() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header skeleton */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass rounded-b-2xl mx-2 mt-2">
        <div className="px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
              <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
            </div>
            
            {/* Title skeleton */}
            <div className="flex-1 mx-3 text-center">
              <div className="h-6 w-32 mx-auto bg-gold-500/20 rounded-lg animate-pulse mb-1" />
              <div className="h-3 w-24 mx-auto bg-white/5 rounded animate-pulse" />
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
              <div className="w-11 h-11 rounded-xl bg-white/5 animate-pulse" />
            </div>
          </div>

          {/* Mode selector skeleton */}
          <div className="mt-4 flex gap-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="flex-1 h-12 rounded-xl bg-white/5 animate-pulse"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="px-4 py-6 pb-32">
        {/* Practice area skeleton */}
        <div className="max-w-2xl mx-auto">
          {/* Verse display skeleton */}
          <div className="text-center mb-8">
            <div className="h-8 w-48 mx-auto bg-gold-500/15 rounded-xl animate-pulse mb-4" />
            <div className="space-y-3">
              <div className="h-16 w-full bg-white/5 rounded-2xl animate-pulse" />
              <div className="h-12 w-full bg-white/3 rounded-xl animate-pulse" />
            </div>
          </div>

          {/* Controls skeleton */}
          <div className="space-y-6">
            {/* Recording button */}
            <div className="text-center">
              <motion.div
                className="w-20 h-20 rounded-full mx-auto bg-gradient-to-r from-sage-500/20 to-sage-600/10 border border-sage-500/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="h-4 w-32 mx-auto bg-white/10 rounded animate-pulse mt-3" />
            </div>

            {/* Progress indicators */}
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="text-center p-4 rounded-xl bg-white/3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 mx-auto mb-2 animate-pulse" />
                  <div className="h-3 w-16 bg-white/5 rounded mx-auto animate-pulse" />
                </motion.div>
              ))}
            </div>

            {/* Action buttons skeleton */}
            <div className="flex gap-3 justify-center">
              {[1, 2].map((i) => (
                <div 
                  key={i}
                  className="h-12 px-6 rounded-xl bg-white/5 animate-pulse flex-1 max-w-32"
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Sheikh FAB skeleton */}
      <div className="fixed bottom-24 right-4 w-16 h-16 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-600/10 animate-pulse" />

      <BottomNav />
    </div>
  );
}