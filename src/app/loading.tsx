'use client';

import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-night-950 overflow-hidden">
      {/* Hero section skeleton */}
      <div className="relative min-h-[75vh] flex flex-col items-center justify-center px-6">
        {/* Background glow effect */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(201,162,39,0.08) 0%, transparent 60%)',
          }}
        />

        {/* Logo placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 mb-8"
        >
          <div 
            className="w-24 h-24 rounded-3xl animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
              border: '1px solid rgba(201,162,39,0.2)',
            }}
          />
        </motion.div>

        {/* Title skeleton */}
        <div className="relative z-10 text-center space-y-4 mb-12">
          <div className="h-12 w-40 mx-auto bg-gold-500/15 rounded-xl animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-72 mx-auto bg-night-800/50 rounded animate-pulse" />
            <div className="h-4 w-56 mx-auto bg-night-800/50 rounded animate-pulse" />
          </div>
        </div>

        {/* CTA buttons skeleton */}
        <div className="relative z-10 flex flex-col gap-4 w-full max-w-xs">
          <div 
            className="h-14 w-full rounded-2xl animate-pulse"
            style={{
              background: 'linear-gradient(135deg, rgba(201,162,39,0.3) 0%, rgba(201,162,39,0.2) 100%)',
            }}
          />
          <div className="h-14 w-full rounded-2xl bg-night-800/40 animate-pulse" />
        </div>

        {/* Stats preview skeleton */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 mt-16 grid grid-cols-3 gap-6"
        >
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center animate-pulse">
              <div className="h-8 w-16 mx-auto bg-gold-500/15 rounded mb-1" />
              <div className="h-3 w-12 mx-auto bg-night-800/40 rounded" />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Features section skeleton */}
      <div className="px-6 py-12">
        {/* Section header */}
        <div className="text-center mb-8 animate-pulse">
          <div className="h-6 w-48 mx-auto bg-night-800/50 rounded mb-2" />
          <div className="h-4 w-64 mx-auto bg-night-800/40 rounded" />
        </div>

        {/* Feature cards */}
        <div className="space-y-4 max-w-md mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="liquid-card p-5 animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex-shrink-0"
                  style={{
                    background: i === 1 
                      ? 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)'
                      : i === 2
                        ? 'linear-gradient(135deg, rgba(134,169,113,0.2) 0%, rgba(134,169,113,0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(99,102,241,0.2) 0%, rgba(99,102,241,0.1) 100%)',
                  }}
                />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 bg-night-800/60 rounded" />
                  <div className="h-3 w-full bg-night-800/40 rounded" />
                  <div className="h-3 w-3/4 bg-night-800/40 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative divider skeleton */}
      <div className="py-8 flex items-center justify-center gap-4">
        <div className="h-px w-24 bg-gradient-to-r from-transparent to-gold-500/20" />
        <div className="w-5 h-5 rounded bg-gold-500/15 animate-pulse" />
        <div className="h-px w-24 bg-gradient-to-l from-transparent to-gold-500/20" />
      </div>

      <BottomNav />
    </div>
  );
}
