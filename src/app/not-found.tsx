'use client';

import { Search, Home, BookOpen, GraduationCap, Compass } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BottomNav from '@/components/BottomNav';

export default function NotFound() {
  const suggestions = [
    { href: '/', icon: Home, label: 'Home', description: 'Return to dashboard' },
    { href: '/mushaf', icon: BookOpen, label: 'Read Quran', description: 'Open the Mushaf' },
    { href: '/lessons', icon: GraduationCap, label: 'Lessons', description: 'Continue learning' },
    { href: '/practice', icon: Compass, label: 'Practice', description: 'Review your progress' },
  ];

  return (
    <div className="min-h-screen bg-night-950 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-md w-full text-center"
        >
          {/* 404 Illustration */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="relative mx-auto w-32 h-32 mb-8"
          >
            {/* Decorative rings */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold-500/20 animate-[spin_20s_linear_infinite]" />
            <div className="absolute inset-2 rounded-full border-2 border-dashed border-gold-500/10 animate-[spin_15s_linear_infinite_reverse]" />
            
            {/* Center */}
            <div 
              className="absolute inset-4 flex items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.15) 0%, rgba(201, 162, 39, 0.05) 100%)',
                border: '2px solid rgba(201, 162, 39, 0.2)',
              }}
            >
              <span className="text-4xl font-bold text-gold-400">404</span>
            </div>
          </motion.div>

          {/* Title */}
          <h1 className="text-2xl font-semibold text-night-100 mb-3">
            Page Not Found
          </h1>

          {/* Description */}
          <p className="text-night-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's help you find your way back.
          </p>

          {/* Search suggestion */}
          <div className="mb-8">
            <div 
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-gold-400" />
              </div>
              <div className="text-left">
                <p className="text-sm text-night-300 font-medium">Looking for something?</p>
                <p className="text-xs text-night-500">Try searching for a surah or lesson</p>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <p className="text-xs text-night-500 uppercase tracking-wider mb-3">Quick Navigation</p>
            <div className="grid grid-cols-2 gap-3">
              {suggestions.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-night-900/50 hover:bg-night-800/50 border border-night-800/50 hover:border-gold-500/20 transition-all duration-200 active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 rounded-xl bg-night-800 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-night-300" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-night-200">{item.label}</p>
                      <p className="text-[10px] text-night-500">{item.description}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Quranic verse */}
          <div className="mt-12 space-y-2">
            <p className="text-gold-500/40 text-2xl font-arabic">
              وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
            </p>
            <p className="text-night-500 text-xs">
              "Whoever fears Allah, He will make a way out for them." — Quran 65:2
            </p>
          </div>
        </motion.div>
      </main>
      
      <BottomNav />
    </div>
  );
}
