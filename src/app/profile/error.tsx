'use client';

import { useEffect } from 'react';
import { UserX, RefreshCw, Home, ArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProfileError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('[Profile Error]:', error);
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
            <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-pulse" />
            <div 
              className="relative flex items-center justify-center w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 100%)',
                border: '2px solid rgba(251, 191, 36, 0.2)',
              }}
            >
              <UserX className="w-10 h-10 text-amber-400" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-night-100 mb-3">
            Couldn't Load Profile
          </h1>

          {/* Description */}
          <p className="text-night-400 mb-6 leading-relaxed">
            We had trouble loading your profile data. Your learning progress 
            and settings are safely stored.
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
              Reload Profile
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

          {/* Alternative - Settings */}
          <div className="mt-8 p-4 rounded-2xl bg-night-900/50 border border-night-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                <Settings className="w-5 h-5 text-violet-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-night-200 font-medium">Need to change settings?</p>
                <p className="text-xs text-night-400">
                  You can access settings directly
                </p>
              </div>
              <Link
                href="/settings"
                className="ml-auto text-xs text-gold-400 hover:text-gold-300 font-medium"
              >
                Settings →
              </Link>
            </div>
          </div>

          {/* Dua verse */}
          <div className="mt-10 space-y-2">
            <p className="text-gold-500/40 text-xl font-arabic">
              رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا
            </p>
            <p className="text-night-500 text-xs">
              "Our Lord, do not hold us accountable if we forget or make a mistake." — Quran 2:286
            </p>
          </div>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
}
