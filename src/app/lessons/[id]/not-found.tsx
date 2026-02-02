'use client';

import { BookX, Home, ArrowLeft, GraduationCap, Compass } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

export default function LessonNotFound() {
  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6 pb-28">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          {/* Icon */}
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative mx-auto w-24 h-24 mb-8"
          >
            <div className="absolute inset-0 bg-gold-500/20 rounded-full animate-pulse" />
            <div 
              className="relative flex items-center justify-center w-full h-full rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.05) 100%)',
                border: '2px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              <BookX className="w-10 h-10 text-gold-400" />
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-night-100 mb-3">
            Lesson Not Found
          </h1>

          {/* Description */}
          <p className="text-night-400 mb-8 leading-relaxed">
            This lesson doesn't exist or may have been moved. Let's find you 
            something else to learn!
          </p>

          {/* Primary Actions */}
          <div className="space-y-3 mb-8">
            <Link
              href="/lessons"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-gold-500 hover:bg-gold-400 text-night-950 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
            >
              <GraduationCap className="w-4 h-4" />
              Browse All Lessons
            </Link>

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

          {/* Suggested lessons */}
          <div className="p-4 rounded-2xl bg-night-900/50 border border-night-800/50">
            <p className="text-xs text-night-500 uppercase tracking-wider mb-4">Try These Instead</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/lessons"
                className="flex items-center gap-2 p-3 rounded-xl bg-night-800/50 hover:bg-night-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <span className="text-sm">📖</span>
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-night-200">Beginner</p>
                  <p className="text-[10px] text-night-500">Start fresh</p>
                </div>
              </Link>
              
              <Link
                href="/practice"
                className="flex items-center gap-2 p-3 rounded-xl bg-night-800/50 hover:bg-night-700/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Compass className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs font-medium text-night-200">Practice</p>
                  <p className="text-[10px] text-night-500">Review learned</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Quranic encouragement */}
          <div className="mt-10 space-y-2">
            <p className="text-gold-500/40 text-xl font-arabic">
              وَقُل رَّبِّ زِدْنِي عِلْمًا
            </p>
            <p className="text-night-500 text-xs">
              "And say: My Lord, increase me in knowledge." — Quran 20:114
            </p>
          </div>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
}
