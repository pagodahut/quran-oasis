'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi, RefreshCw, BookOpen, Home, GraduationCap, Layers } from 'lucide-react';
import Link from 'next/link';
import { GlassPanel } from '@/components/ui/GlassPanel';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const quickLinks = [
  { href: '/practice', icon: Layers, label: 'Flashcards', color: 'text-gold-400' },
  { href: '/mushaf', icon: BookOpen, label: 'Read Quran', color: 'text-sage-400' },
  { href: '/lessons', icon: GraduationCap, label: 'Lessons', color: 'text-blue-400' },
  { href: '/', icon: Home, label: 'Home', color: 'text-purple-400' },
];

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (isOnline) {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="max-w-sm w-full"
      >
        {/* Status Icon */}
        <motion.div variants={fadeInUp} className="flex justify-center mb-8">
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-gold-500/15"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ margin: '-8px' }}
            />
            <GlassPanel tint="neutral" blur="md" rounded="rounded-full" className="w-24 h-24 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isOnline ? (
                  <motion.div
                    key="online"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <Wifi className="w-10 h-10 text-sage-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="offline"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                  >
                    <WifiOff className="w-10 h-10 text-night-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassPanel>
          </div>
        </motion.div>

        {/* Title & Status */}
        <motion.div variants={fadeInUp} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-night-100 mb-3">
            {isOnline ? "You're Back Online" : "You're Offline"}
          </h1>
          <p className="text-night-400 text-sm leading-relaxed mb-5">
            {isOnline
              ? "Your connection is restored. Tap below to continue your journey."
              : "Don't worry — your memorization progress is saved locally. Reconnect to sync your progress."}
          </p>

          <div className="flex items-center justify-center gap-2">
            <motion.div
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-sage-400' : 'bg-gold-400'}`}
              animate={isOnline ? {} : { opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className={`text-sm font-medium ${isOnline ? 'text-sage-400' : 'text-gold-400'}`}>
              {isOnline ? 'Connected' : 'No connection'}
            </span>
          </div>
        </motion.div>

        {/* Primary Action */}
        <motion.div variants={fadeInUp} className="mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRetry}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6
                     bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600
                     text-night-950 font-semibold rounded-xl
                     shadow-[0_2px_12px_rgba(201,162,39,0.3)] text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            {isOnline ? 'Go to App' : 'Try Again'}
          </motion.button>
        </motion.div>

        {/* Quick Links */}
        <motion.div variants={fadeInUp}>
          <GlassPanel tint="neutral" blur="md" className="p-4">
            <p className="text-xs text-night-500 mb-3 text-center">Available offline</p>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map(({ href, icon: Icon, label, color }) => (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl
                             bg-white/5 border border-white/5 hover:bg-white/8 transition-colors"
                  >
                    <Icon className={`w-4 h-4 ${color}`} />
                    <span className="text-sm text-night-300">{label}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={fadeInUp} className="mt-6 text-center">
          <p className="text-xs text-night-600 leading-relaxed">
            Sheikh AI recitation requires an internet connection.
            Your progress will sync when you&apos;re back online.
          </p>
          <p
            className="mt-6 text-gold-500/25 text-2xl"
            style={{ fontFamily: 'var(--font-arabic)' }}
          >
            بِسْمِ ٱللَّهِ
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
