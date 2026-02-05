'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Mic,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import LiveRecitation from '@/components/LiveRecitation';
import { SURAH_METADATA, type SurahMeta } from '@/lib/surahMetadata';

// ============ Types ============

interface SelectedSurah {
  surahNumber: number;
  startAyah: number;
  endAyah?: number;
}

// ============ Popular Surahs for Quick Access ============

const POPULAR_SURAHS = [1, 36, 55, 56, 67, 78, 87, 93, 94, 97, 112, 113, 114];

// ============ Surah Card ============

function SurahCard({
  surah,
  onSelect,
}: {
  surah: SurahMeta;
  onSelect: (surahNumber: number) => void;
}) {
  // Convert number to Eastern Arabic
  const arabicNum = surah.number
    .toString()
    .replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[parseInt(d)]);

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(surah.number)}
      className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl 
        bg-night-900/40 border border-night-800/50 
        hover:bg-night-800/60 hover:border-night-700/50 
        transition-all group text-left"
    >
      {/* Number badge */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-night-800/80 
        flex items-center justify-center border border-night-700/30
        group-hover:border-gold-500/20 transition">
        <span className="text-sm font-mono text-night-400 group-hover:text-gold-400 transition">
          {surah.number}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-night-100 truncate">
            {surah.englishName}
          </h3>
          <span
            className="text-lg font-arabic text-night-300 mr-1 flex-shrink-0"
            dir="rtl"
            lang="ar"
          >
            {surah.name.replace(/سُورَةُ\s*/, '')}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-night-500">
            {surah.englishNameTranslation}
          </span>
          <span className="text-night-700">·</span>
          <span className="text-xs text-night-500">
            {surah.numberOfAyahs} ayahs
          </span>
          <span className="text-night-700">·</span>
          <span className="text-xs text-night-500 capitalize">
            {surah.revelationType}
          </span>
        </div>
      </div>

      <ChevronRight className="w-4 h-4 text-night-600 group-hover:text-night-400 transition flex-shrink-0" />
    </motion.button>
  );
}

// ============ Ayah Range Selector ============

function AyahRangeSelector({
  surah,
  onStart,
  onBack,
}: {
  surah: SurahMeta;
  onStart: (start: number, end?: number) => void;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<'full' | 'range'>('full');
  const [startAyah, setStartAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(surah.numberOfAyahs);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="px-4 py-6"
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-night-400 hover:text-night-200 transition mb-6"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">Choose another surah</span>
      </button>

      {/* Surah info */}
      <div className="text-center mb-8">
        <h2
          className="font-quran text-quran-lg text-gold-400 mb-2"
          dir="rtl"
          lang="ar"
        >
          {surah.name}
        </h2>
        <p className="text-night-300 font-medium">{surah.englishName}</p>
        <p className="text-xs text-night-500 mt-1">
          {surah.numberOfAyahs} ayahs · {surah.revelationType}
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setMode('full')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
            mode === 'full'
              ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
              : 'bg-night-800/50 text-night-400 border border-night-700/30 hover:bg-night-800'
          }`}
        >
          Full Surah
        </button>
        <button
          onClick={() => setMode('range')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition ${
            mode === 'range'
              ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
              : 'bg-night-800/50 text-night-400 border border-night-700/30 hover:bg-night-800'
          }`}
        >
          Custom Range
        </button>
      </div>

      {/* Range Inputs */}
      {mode === 'range' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-night-400 mb-1.5">
                Start Ayah
              </label>
              <input
                type="number"
                min={1}
                max={surah.numberOfAyahs}
                value={startAyah}
                onChange={(e) =>
                  setStartAyah(
                    Math.max(1, Math.min(surah.numberOfAyahs, parseInt(e.target.value) || 1))
                  )
                }
                className="w-full px-3 py-2.5 rounded-xl bg-night-800 border border-night-700 
                  text-night-100 text-center text-sm focus:outline-none focus:border-gold-500/50
                  focus:ring-1 focus:ring-gold-500/20"
              />
            </div>
            <div>
              <label className="block text-xs text-night-400 mb-1.5">
                End Ayah
              </label>
              <input
                type="number"
                min={startAyah}
                max={surah.numberOfAyahs}
                value={endAyah}
                onChange={(e) =>
                  setEndAyah(
                    Math.max(
                      startAyah,
                      Math.min(surah.numberOfAyahs, parseInt(e.target.value) || surah.numberOfAyahs)
                    )
                  )
                }
                className="w-full px-3 py-2.5 rounded-xl bg-night-800 border border-night-700 
                  text-night-100 text-center text-sm focus:outline-none focus:border-gold-500/50
                  focus:ring-1 focus:ring-gold-500/20"
              />
            </div>
          </div>
          <p className="text-xs text-night-500 text-center">
            {endAyah - startAyah + 1} ayah{endAyah - startAyah > 0 ? 's' : ''} selected
          </p>
        </motion.div>
      )}

      {/* Start Button */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          if (mode === 'full') {
            onStart(1, undefined);
          } else {
            onStart(startAyah, endAyah);
          }
        }}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 
          text-night-950 font-semibold text-base transition hover:from-gold-500 hover:to-gold-400
          flex items-center justify-center gap-3 shadow-glow-gold"
      >
        <Mic className="w-5 h-5" />
        Start Reciting
      </motion.button>

      {/* Tips */}
      <div className="mt-8 space-y-3">
        <h3 className="text-xs font-semibold text-night-400 uppercase tracking-wider">
          Tips
        </h3>
        <div className="space-y-2">
          {[
            'Find a quiet place for best results',
            'Recite at your natural pace',
            'Words light up as you recite correctly',
            'Red highlights indicate mistakes',
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-2">
              <Star className="w-3 h-3 text-gold-500/60 mt-0.5 flex-shrink-0" />
              <span className="text-xs text-night-400">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ============ Main Page ============

export default function RecitePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SelectedSurah | null>(null);
  const [selectingSurah, setSelectingSurah] = useState<SurahMeta | null>(null);

  // Filter surahs by search
  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) return SURAH_METADATA;

    const q = searchQuery.toLowerCase().trim();
    return SURAH_METADATA.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(q) ||
        s.number.toString() === q
    );
  }, [searchQuery]);

  // Popular surahs for quick access
  const popularSurahs = useMemo(
    () =>
      POPULAR_SURAHS.map((num) =>
        SURAH_METADATA.find((s) => s.number === num)
      ).filter(Boolean) as SurahMeta[],
    []
  );

  const handleSelectSurah = useCallback((surahNumber: number) => {
    const meta = SURAH_METADATA.find((s) => s.number === surahNumber);
    if (meta) {
      setSelectingSurah(meta);
    }
  }, []);

  const handleStartRecitation = useCallback(
    (startAyah: number, endAyah?: number) => {
      if (!selectingSurah) return;
      setSelectedSurah({
        surahNumber: selectingSurah.number,
        startAyah,
        endAyah,
      });
    },
    [selectingSurah]
  );

  const handleBack = useCallback(() => {
    if (selectedSurah) {
      setSelectedSurah(null);
    } else if (selectingSurah) {
      setSelectingSurah(null);
    } else {
      router.back();
    }
  }, [selectedSurah, selectingSurah, router]);

  // ============ Active Recitation ============

  if (selectedSurah) {
    return (
      <LiveRecitation
        surahNumber={selectedSurah.surahNumber}
        startAyah={selectedSurah.startAyah}
        endAyah={selectedSurah.endAyah}
        onBack={() => setSelectedSurah(null)}
      />
    );
  }

  // ============ Ayah Range Selection ============

  if (selectingSurah) {
    return (
      <div className="min-h-screen bg-night-950">
        <AyahRangeSelector
          surah={selectingSurah}
          onStart={handleStartRecitation}
          onBack={() => setSelectingSurah(null)}
        />
      </div>
    );
  }

  // ============ Surah Selection ============

  return (
    <div className="min-h-screen bg-night-950 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-night-950/90 backdrop-blur-xl border-b border-night-800/30">
        <div className="px-4 pt-safe-top">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-xl font-bold text-night-100">Recite</h1>
              <p className="text-xs text-night-500 mt-0.5">
                Live recitation with tajweed tracking
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
              <Mic className="w-5 h-5 text-gold-500" />
            </div>
          </div>

          {/* Search */}
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-night-500" />
              <input
                type="text"
                placeholder="Search surah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-night-900/60 border border-night-800/50 
                  text-sm text-night-100 placeholder:text-night-600 focus:outline-none 
                  focus:border-gold-500/30 focus:ring-1 focus:ring-gold-500/10 transition"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Quick Access - Only show when not searching */}
        {!searchQuery.trim() && (
          <section>
            <h2 className="text-xs font-semibold text-night-400 uppercase tracking-wider mb-3">
              Popular Surahs
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {popularSurahs.map((surah) => (
                <motion.button
                  key={surah.number}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectSurah(surah.number)}
                  className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-night-900/50 border border-night-800/40
                    hover:bg-night-800/60 hover:border-gold-500/20 transition group"
                >
                  <span className="text-xs font-medium text-night-300 group-hover:text-gold-400 transition whitespace-nowrap">
                    {surah.englishName}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>
        )}

        {/* Surah List */}
        <section>
          {!searchQuery.trim() && (
            <h2 className="text-xs font-semibold text-night-400 uppercase tracking-wider mb-3">
              All Surahs
            </h2>
          )}
          <div className="space-y-2">
            {filteredSurahs.map((surah) => (
              <SurahCard
                key={surah.number}
                surah={surah}
                onSelect={handleSelectSurah}
              />
            ))}
            {filteredSurahs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-8 h-8 text-night-600 mx-auto mb-3" />
                <p className="text-sm text-night-500">No surahs found</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
