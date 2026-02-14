'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, BookOpen } from 'lucide-react';
import SurahBrowser, { type SurahData } from '@/components/SurahBrowser';
import BottomNav from '@/components/BottomNav';
import { startMemorizingVerse } from '@/lib/progressStore';

export default function BrowsePage() {
  const router = useRouter();
  const [addedSurah, setAddedSurah] = useState<SurahData | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleAddToQueue = async (surah: SurahData) => {
    try {
      // Add first ayah of surah to queue (user can add more from mushaf)
      startMemorizingVerse(surah.id, 1);
      
      // Show success toast
      setAddedSurah(surah);
      setShowToast(true);
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false);
        setAddedSurah(null);
      }, 3000);
    } catch (error) {
      console.error('Error adding to queue:', error);
    }
  };

  return (
    <div className="min-h-screen bg-night-950">
      {/* Fixed header */}
      <header className="liquid-glass fixed top-0 left-0 right-0 z-40 safe-area-top">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="btn-icon">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-lg text-night-100">Browse Surahs</h1>
            <p className="text-xs text-night-500">Add surahs to your memorization queue</p>
          </div>
          <Link href="/practice" className="btn-icon text-sage-400">
            <BookOpen className="w-5 h-5" />
          </Link>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Main content */}
      <SurahBrowser onAddToQueue={handleAddToQueue} />

      {/* Success Toast */}
      <AnimatePresence>
        {showToast && addedSurah && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-28 left-4 right-4 z-50 flex justify-center"
          >
            <div className="bg-gradient-to-r from-sage-600 to-sage-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-sage-500/20 flex items-center gap-3 max-w-md">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Check className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Added to Queue!</p>
                <p className="text-sm text-white/80">
                  {addedSurah.name} · Start from Ayah 1
                </p>
              </div>
              <button
                onClick={() => router.push(`/mushaf?surah=${addedSurah.id}`)}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
              >
                Open
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
