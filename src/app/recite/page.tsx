'use client';

import React, { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Mic,
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Star,
  History,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import LiveRecitation from '@/components/LiveRecitation';
import RevealRecitation, { DifficultySelector, type RevealDifficulty } from '@/components/RevealRecitation';
import { SURAH_METADATA, type SurahMeta } from '@/lib/surahMetadata';

// ============ Types ============

type ReciteMode = 'standard' | 'reveal';

interface SelectedSurah {
  surahNumber: number;
  startAyah: number;
  endAyah?: number;
  mode: ReciteMode;
  revealDifficulty?: RevealDifficulty;
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
        transition-all group text-left"
      style={{
        background: 'rgba(80,40,5,0.18)',
        border: '1px solid rgba(201,162,39,0.12)',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.3)'; (e.currentTarget as HTMLElement).style.background = 'rgba(100,55,8,0.28)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(80,40,5,0.18)'; }}
    >
      {/* Number badge */}
      <div className="flex-shrink-0 w-10 h-10 rounded-lg
        flex items-center justify-center transition"
        style={{ background: 'rgba(120,60,10,0.4)', border: '1px solid rgba(201,162,39,0.2)' }}
      >
        <span className="text-sm font-medium tabular-nums" style={{ color: 'rgba(251,191,36,0.8)' }}>
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
            className="text-lg font-arabic mr-1 flex-shrink-0"
            style={{ color: 'rgba(251,191,36,0.7)' }}
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
  onStart: (start: number, end?: number, mode?: ReciteMode, difficulty?: RevealDifficulty) => void;
  onBack: () => void;
}) {
  const [showOptions, setShowOptions] = useState(false);
  const [mode, setMode] = useState<'full' | 'range'>('full');
  const [reciteMode, setReciteMode] = useState<ReciteMode>('standard');
  const [revealDifficulty, setRevealDiff] = useState<RevealDifficulty>('medium');
  const [startAyah, setStartAyah] = useState(1);
  const [endAyah, setEndAyah] = useState(surah.numberOfAyahs);

  const handleStart = () => {
    if (mode === 'full') {
      onStart(1, undefined, reciteMode, revealDifficulty);
    } else {
      onStart(startAyah, endAyah, reciteMode, revealDifficulty);
    }
  };

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
      <div className="text-center mb-6">
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

      {/* Primary Start Button — one tap to go */}
      <motion.button
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-600 to-gold-500 
          text-night-950 font-semibold text-base transition hover:from-gold-500 hover:to-gold-400
          flex items-center justify-center gap-3 shadow-glow-gold mb-3"
      >
        <Mic className="w-5 h-5" />
        Start Reciting
      </motion.button>

      <p className="text-xs text-night-500 text-center mb-6">
        Full surah · Standard mode
        {showOptions ? '' : ' · '}
        {!showOptions && (
          <button
            onClick={() => setShowOptions(true)}
            className="text-gold-400/70 hover:text-gold-400 transition underline underline-offset-2"
          >
            Customize
          </button>
        )}
      </p>

      {/* Collapsible Options */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border border-night-800/50 rounded-xl p-4 mb-6 space-y-5 bg-night-900/30">
              {/* Practice Mode */}
              <div>
                <label className="block text-xs text-night-400 mb-2 font-semibold uppercase tracking-wider">
                  Practice Mode
                </label>
                <div className="flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={() => setReciteMode('standard')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
                      reciteMode === 'standard'
                        ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                        : 'bg-night-800/50 text-night-400 border-night-700/30 hover:bg-night-800'
                    }`}
                  >
                    <div>Standard</div>
                    <div className="text-[10px] mt-0.5 opacity-70">Word-by-word tracking</div>
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    onClick={() => setReciteMode('reveal')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition border ${
                      reciteMode === 'reveal'
                        ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                        : 'bg-night-800/50 text-night-400 border-night-700/30 hover:bg-night-800'
                    }`}
                  >
                    <div>Reveal</div>
                    <div className="text-[10px] mt-0.5 opacity-70">Hidden until you recite</div>
                  </motion.button>
                </div>
              </div>

              {/* Difficulty (Reveal mode only) */}
              {reciteMode === 'reveal' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-xs text-night-400 mb-2 font-semibold uppercase tracking-wider">
                    Hint Level
                  </label>
                  <DifficultySelector value={revealDifficulty} onChange={setRevealDiff} />
                </motion.div>
              )}

              {/* Ayah Range */}
              <div>
                <label className="block text-xs text-night-400 mb-2 font-semibold uppercase tracking-wider">
                  Ayah Range
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setMode('full')}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                      mode === 'full'
                        ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
                        : 'bg-night-800/50 text-night-400 border border-night-700/30 hover:bg-night-800'
                    }`}
                  >
                    Full Surah
                  </button>
                  <button
                    onClick={() => setMode('range')}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
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
                    className="mt-3 space-y-3"
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="mt-4 space-y-3">
        <h3 className="text-xs font-semibold text-night-400 uppercase tracking-wider">
          Tips
        </h3>
        <div className="space-y-2">
          {[
            'Find a quiet place for best results',
            'Recite at your natural pace',
            'Words light up as you recite correctly',
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
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-night-400">Loading...</div>
      </div>
    }>
      <RecitePageInner />
    </Suspense>
  );
}

function RecitePageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SelectedSurah | null>(null);
  const [selectingSurah, setSelectingSurah] = useState<SurahMeta | null>(null);

  // Handle URL parameters on mount
  useEffect(() => {
    const surahParam = searchParams.get('surah');
    const modeParam = searchParams.get('mode') as ReciteMode | null;
    const startParam = searchParams.get('start');

    if (surahParam) {
      const surahNumber = parseInt(surahParam);
      const surahMeta = SURAH_METADATA.find(s => s.number === surahNumber);
      
      if (surahMeta) {
        if (modeParam && startParam) {
          // Direct to recitation with specific mode and ayah
          setSelectedSurah({
            surahNumber,
            startAyah: parseInt(startParam),
            mode: modeParam,
            revealDifficulty: 'medium',
          });
        } else {
          // Go to ayah range selector for this surah
          setSelectingSurah(surahMeta);
        }
      }
    }
  }, [searchParams]);

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
    (startAyah: number, endAyah?: number, reciteMode?: ReciteMode, difficulty?: RevealDifficulty) => {
      if (!selectingSurah) return;
      setSelectedSurah({
        surahNumber: selectingSurah.number,
        startAyah,
        endAyah,
        mode: reciteMode || 'standard',
        revealDifficulty: difficulty,
      });
    },
    [selectingSurah]
  );

  const handleOriginBack = useCallback(() => {
    const fromOrigin = searchParams.get('from');
    const originSurah = searchParams.get('surah');
    if (fromOrigin === 'mushaf') {
      router.push(originSurah ? `/mushaf?surah=${originSurah}` : '/mushaf');
    } else {
      router.push('/practice');
    }
  }, [searchParams, router]);

  const handleBack = useCallback(() => {
    const from = searchParams.get('from');
    const surahParam = searchParams.get('surah');

    if (selectedSurah) {
      setSelectedSurah(null);
    } else if (selectingSurah) {
      setSelectingSurah(null);
    } else if (from === 'mushaf') {
      // Return to mushaf at the surah we came from
      router.push(surahParam ? `/mushaf?surah=${surahParam}` : '/mushaf');
    } else {
      router.push('/practice');
    }
  }, [selectedSurah, selectingSurah, router, searchParams]);

  // ============ Active Recitation ============

  if (selectedSurah) {
    if (selectedSurah.mode === 'reveal') {
      return (
        <RevealRecitation
          surahNumber={selectedSurah.surahNumber}
          startAyah={selectedSurah.startAyah}
          endAyah={selectedSurah.endAyah}
          difficulty={selectedSurah.revealDifficulty || 'medium'}
          onBack={() => setSelectedSurah(null)}
        />
      );
    }
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
      <div className="min-h-screen">
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
    <div className="min-h-screen pb-32">
      {/* Header — amber/gold theme to differentiate from recitation experience */}
      <header className="sticky top-0 z-20 backdrop-blur-xl border-b"
        style={{
          background: 'linear-gradient(135deg, rgba(120,60,10,0.92) 0%, rgba(90,50,8,0.95) 100%)',
          borderColor: 'rgba(201,162,39,0.15)',
        }}
      >
        <div className="px-4 pt-safe-top">
          <div className="flex items-center gap-3 py-4">
            {/* Back button — always visible */}
            <button
              onClick={handleOriginBack}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10 active:bg-white/15 flex-shrink-0"
              title={searchParams.get('from') === 'mushaf' ? 'Back to Mushaf' : 'Back to Practice'}
            >
              <ChevronLeft className="w-5 h-5 text-amber-300" />
            </button>

            <div className="flex-1">
              <h1 className="text-xl font-bold text-amber-100">Recite</h1>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(251,191,36,0.6)' }}>
                Live recitation with tajweed tracking
              </p>
            </div>
            <button
              onClick={() => router.push('/recite/history')}
              className="w-10 h-10 rounded-full border flex items-center justify-center transition hover:bg-white/10"
              style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(201,162,39,0.25)' }}
              title="Recitation History"
            >
              <History className="w-5 h-5 text-amber-300" />
            </button>
          </div>

          {/* Search */}
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(251,191,36,0.5)' }} />
              <input
                type="text"
                placeholder="Search surah..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-amber-100 placeholder:text-amber-900 focus:outline-none transition"
                style={{
                  background: 'rgba(0,0,0,0.25)',
                  border: '1px solid rgba(201,162,39,0.2)',
                }}
                onFocus={(e) => { e.target.style.borderColor = 'rgba(201,162,39,0.45)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(201,162,39,0.2)'; }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-6">
        {/* Quick Access - Only show when not searching */}
        {!searchQuery.trim() && (
          <section>
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(251,191,36,0.5)' }}>
              Popular Surahs
            </h2>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {popularSurahs.map((surah) => (
                <motion.button
                  key={surah.number}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectSurah(surah.number)}
                  className="flex-shrink-0 px-4 py-2.5 rounded-xl transition group"
                  style={{
                    background: 'rgba(120,60,10,0.25)',
                    border: '1px solid rgba(201,162,39,0.15)',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.4)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,162,39,0.15)'; }}
                >
                  <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'rgba(251,191,36,0.8)' }}>
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
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(251,191,36,0.5)' }}>
              All Surahs
            </h2>
          )}
          <motion.div
            className="space-y-2"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          >
            {filteredSurahs.map((surah) => (
              <motion.div
                key={surah.number}
                variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } } }}
              >
                <SurahCard
                  surah={surah}
                  onSelect={handleSelectSurah}
                />
              </motion.div>
            ))}
            {filteredSurahs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-8 h-8 text-night-600 mx-auto mb-3" />
                <p className="text-sm text-night-500">No surahs found</p>
              </div>
            )}
          </motion.div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
