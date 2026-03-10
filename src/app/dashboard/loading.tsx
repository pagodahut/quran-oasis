'use client';

import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-night-950 pb-20">
      {/* Header skeleton */}
      <header className="px-4 pb-6 safe-area-top">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-gold-500/20 to-gold-600/10 animate-pulse" />
            <div>
              <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse mb-1" />
              <div className="h-4 w-24 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
        </div>
      </header>

      <main className="px-4 space-y-6">
        {/* Progress Cards */}
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass rounded-2xl p-4"
            >
              <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-gold-500/20 rounded-lg animate-pulse mb-3" />
              <div className="h-1.5 bg-night-800/60 rounded-full overflow-hidden">
                <div className="h-full bg-gold-500/30 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <div className="h-6 w-32 bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="liquid-card-interactive p-4 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 mx-auto mb-3 animate-pulse" />
                <div className="h-4 w-20 bg-white/10 rounded mx-auto animate-pulse mb-1" />
                <div className="h-3 w-24 bg-white/5 rounded mx-auto animate-pulse" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="h-6 w-40 bg-white/10 rounded-lg animate-pulse mb-4" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="liquid-card-interactive p-4 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                <div className="flex-1">
                  <div className="h-4 w-32 bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
                </div>
                <div className="h-3 w-16 bg-white/5 rounded animate-pulse" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}