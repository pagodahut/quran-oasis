'use client';

import { useEffect } from 'react';
import { TrendingUp, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProgressError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Progress Error]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6 pb-28">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          {/* Error Icon */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative mx-auto w-24 h-24 mb-8"
          >
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full animate-pulse" />
            <div 
              className="relative flex items-center justify-center w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                border: '2px solid rgba(16, 185, 129, 0.2)',
              }}
            >
              <TrendingUp className="w-10 h-10 text-emerald-400" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-night-100 mb-3">
            Couldn't Load Progress
          </h1>

          {/* Description */}
          <p className="text-night-400 mb-6 leading-relaxed">
            We had trouble loading your progress data. Don't worry — your 
            memorization stats are safely stored locally.
          </p>

          {/* Error details (development only) */}
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-left">
              <p className="text-xs text-red-400 font-mono break-all">
                {error.message}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gold-500 hover:bg-gold-400 text-night-950 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <RefreshCw className="w-4 h-4" />
              Reload Progress
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-night-800 hover:bg-night-700 text-night-200 font-medium rounded-xl transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </button>
              
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-night-800 hover:bg-night-700 text-night-200 font-medium rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
          </div>

          {/* Encouraging verse */}
          <div className="mt-10 space-y-2">
            <p className="text-gold-500/40 text-xl font-arabic">
              وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ
            </p>
            <p className="text-night-500 text-xs">
              "And do not despair of Allah's mercy." — Quran 12:87
            </p>
          </div>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
}
