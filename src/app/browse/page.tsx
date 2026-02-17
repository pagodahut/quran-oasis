'use client';

/**
 * Garden of Surahs — A Visually Stunning Way to Explore the Quran
 * 
 * This is NOT the Mushaf (reading). This is for EXPLORING and CHOOSING
 * what to memorize. Think "album art" view — each surah is a beautiful
 * card that comes alive with parallax, stagger animations, and meaning.
 */

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { SURAHS, type SurahData } from '@/components/SurahBrowser';
import { getSurahProgress } from '@/lib/progressStore';
import BottomNav from '@/components/BottomNav';

// ─── Eastern Arabic Numerals ──────────────────────────────────────
const EASTERN_DIGITS = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toEastern(n: number): string {
  return n.toString().split('').map(d => EASTERN_DIGITS[parseInt(d)]).join('');
}

// ─── Card size tiers based on ayah count ──────────────────────────
type CardSize = 'lg' | 'md' | 'sm';
function getCardSize(ayahs: number): CardSize {
  if (ayahs >= 100) return 'lg';
  if (ayahs >= 30) return 'md';
  return 'sm';
}

// ─── Sort & Filter Types ──────────────────────────────────────────
type SortType = 'number' | 'revelation' | 'length' | 'alpha' | 'progress';
type FilterRevelation = 'all' | 'makki' | 'madani';

const SORT_OPTIONS: { value: SortType; label: string }[] = [
  { value: 'number', label: 'Mushaf Order' },
  { value: 'revelation', label: 'Revelation Order' },
  { value: 'length', label: 'Length' },
  { value: 'alpha', label: 'Alphabetical' },
  { value: 'progress', label: 'Your Progress' },
];

// ─── Surah Card with Parallax ─────────────────────────────────────
function SurahCard({
  surah,
  index,
  progress,
  isJuzAmma,
}: {
  surah: SurahData;
  index: number;
  progress: { versesMemorized: number; percentage: number };
  isJuzAmma: boolean;
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const isMakki = surah.revelation === 'makki';
  const size = getCardSize(surah.ayahs);
  const hasProgress = progress.versesMemorized > 0;

  // Parallax on scroll
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [8, -8]);

  const handleClick = () => {
    router.push(`/memorize/${surah.id}/1`);
  };

  const accentColor = isMakki ? 'gold' : 'sage';
  const sizeClasses = {
    lg: 'col-span-2 row-span-2 min-h-[280px]',
    md: 'col-span-1 row-span-2 min-h-[240px]',
    sm: 'col-span-1 row-span-1 min-h-[180px]',
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: Math.min(index * 0.03, 0.8),
        duration: 0.4,
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{ y }}
      className={sizeClasses[size]}
    >
      <motion.button
        onClick={handleClick}
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
        whileTap={{ scale: 0.97 }}
        className={`
          w-full h-full p-5 rounded-3xl border text-left
          flex flex-col justify-between
          transition-shadow duration-500 group relative overflow-hidden
          ${hasProgress
            ? `bg-${accentColor}-500/[0.06] border-${accentColor}-500/25 shadow-lg shadow-${accentColor}-500/5`
            : 'bg-night-900/60 border-night-700/30'
          }
          hover:shadow-xl hover:shadow-${accentColor}-500/10
          hover:border-${accentColor}-500/30
        `}
        style={{
          background: hasProgress
            ? isMakki
              ? 'linear-gradient(135deg, rgba(196,148,58,0.06) 0%, rgba(15,15,20,0.8) 100%)'
              : 'linear-gradient(135deg, rgba(45,212,150,0.06) 0%, rgba(15,15,20,0.8) 100%)'
            : 'linear-gradient(135deg, rgba(25,25,35,0.7) 0%, rgba(15,15,20,0.9) 100%)',
          borderColor: hasProgress
            ? isMakki ? 'rgba(196,148,58,0.25)' : 'rgba(45,212,150,0.25)'
            : 'rgba(40,40,55,0.5)',
        }}
      >
        {/* Juz Amma highlight badge */}
        {isJuzAmma && (
          <div className="absolute top-3 right-3">
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400/80 border border-amber-500/20">
              Juz ʿAmma
            </span>
          </div>
        )}

        {/* Top section: Number + Revelation badge */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`text-2xl font-light opacity-40 ${isMakki ? 'text-gold-400' : 'text-sage-400'}`}
              style={{ fontFamily: 'var(--font-arabic)' }}
            >
              {toEastern(surah.id)}
            </span>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-medium ${
            isMakki
              ? 'bg-gold-500/10 text-gold-400/80'
              : 'bg-sage-500/10 text-sage-400/80'
          }`}>
            {isMakki ? '🕋 Makki' : '🕌 Madani'}
          </span>
        </div>

        {/* Center: Arabic name (hero) */}
        <div className="flex-1 flex flex-col items-center justify-center py-3">
          <p
            className={`${size === 'lg' ? 'text-4xl' : size === 'md' ? 'text-3xl' : 'text-2xl'} leading-tight group-hover:scale-105 transition-transform duration-300 ${
              isMakki ? 'text-gold-400' : 'text-sage-400'
            }`}
            style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
          >
            {surah.arabic}
          </p>
          <p className={`font-medium text-night-100 mt-2 ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
            {surah.name}
          </p>
          <p className="text-xs text-night-500 italic mt-0.5">{surah.meaning}</p>
        </div>

        {/* Bottom: Meta info */}
        <div className="space-y-2">
          {/* Verse count + revelation order */}
          <div className="flex items-center justify-between text-[10px] text-night-500">
            <span>{surah.ayahs} verses</span>
            <span className="opacity-60">#{surah.order} revealed</span>
          </div>

          {/* Memorization progress */}
          {hasProgress && (
            <div>
              <div className="h-1.5 bg-night-800/60 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${
                    isMakki
                      ? 'bg-gradient-to-r from-gold-600 to-gold-400'
                      : 'bg-gradient-to-r from-sage-600 to-sage-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress.percentage}%` }}
                  transition={{ duration: 0.6, delay: index * 0.02 }}
                />
              </div>
              <p className="text-[9px] text-night-500 mt-0.5">
                {progress.versesMemorized}/{surah.ayahs} memorized
              </p>
            </div>
          )}

          {!hasProgress && (
            <div className="h-1.5 bg-night-800/30 rounded-full" />
          )}
        </div>

        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: isMakki
              ? 'radial-gradient(ellipse at 50% 30%, rgba(196,148,58,0.06) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 30%, rgba(45,212,150,0.06) 0%, transparent 70%)',
          }}
        />
      </motion.button>
    </motion.div>
  );
}

// ─── Filter Pill ──────────────────────────────────────────────────
function Pill({
  label,
  active,
  onClick,
  accent,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent?: 'gold' | 'sage';
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
        active
          ? accent === 'gold'
            ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30'
            : accent === 'sage'
            ? 'bg-sage-500/15 text-sage-400 border border-sage-500/30'
            : 'bg-night-700/60 text-night-100 border border-night-600/50'
          : 'bg-night-900/50 text-night-500 border border-night-700/30 hover:border-night-600/50'
      }`}
    >
      {label}
    </button>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function GardenOfSurahs() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortType>('number');
  const [filterRev, setFilterRev] = useState<FilterRevelation>('all');
  const [filterJuz, setFilterJuz] = useState<number | null>(null);
  const [filterInProgress, setFilterInProgress] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [progressMap, setProgressMap] = useState<Record<number, { versesMemorized: number; percentage: number }>>({});

  // Load progress on mount
  useEffect(() => {
    try {
      const map: Record<number, { versesMemorized: number; percentage: number }> = {};
      for (const s of SURAHS) {
        const p = getSurahProgress(s.id);
        if (p.versesMemorized > 0) {
          map[s.id] = {
            versesMemorized: p.versesMemorized,
            percentage: Math.round((p.versesMemorized / s.ayahs) * 100),
          };
        }
      }
      setProgressMap(map);
    } catch {
      // SSR safety
    }
  }, []);

  const filtered = useMemo(() => {
    let result = [...SURAHS];

    // Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.arabic.includes(q) ||
        s.id.toString() === q
      );
    }

    // Revelation filter
    if (filterRev !== 'all') {
      result = result.filter(s => s.revelation === filterRev);
    }

    // Juz filter
    if (filterJuz !== null) {
      result = result.filter(s => s.juz.includes(filterJuz));
    }

    // In-progress filter
    if (filterInProgress) {
      result = result.filter(s => progressMap[s.id]?.versesMemorized > 0);
    }

    // Sort
    switch (sort) {
      case 'revelation':
        result.sort((a, b) => a.order - b.order);
        break;
      case 'length':
        result.sort((a, b) => b.ayahs - a.ayahs);
        break;
      case 'alpha':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'progress':
        result.sort((a, b) => (progressMap[b.id]?.percentage || 0) - (progressMap[a.id]?.percentage || 0));
        break;
      default:
        result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [search, sort, filterRev, filterJuz, filterInProgress, progressMap]);

  const makkiCount = SURAHS.filter(s => s.revelation === 'makki').length;
  const madaniCount = SURAHS.filter(s => s.revelation === 'madani').length;
  const inProgressCount = Object.keys(progressMap).length;

  return (
    <div className="min-h-screen bg-night-950 relative">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-gradient-radial from-gold-500/[0.04] to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-[400px] h-[400px] bg-gradient-radial from-sage-500/[0.04] to-transparent blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 text-center px-5 pt-14 pb-4 safe-area-top">
        <p className="text-2xl text-gold-500/30 mb-2" style={{ fontFamily: 'var(--font-arabic)' }}>﷽</p>
        <h1 className="text-3xl font-light tracking-[0.2em] text-night-100 mb-1">
          Garden of Surahs
        </h1>
        <p className="text-xs text-night-500 tracking-wide">
          114 surahs · {makkiCount} Makki · {madaniCount} Madani · 6,236 āyāt
        </p>
      </header>

      {/* Search + Filter Bar */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-3 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-night-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, meaning, or number…"
            className="w-full bg-night-900/70 backdrop-blur-md border border-night-700/40 rounded-2xl py-3 pl-11 pr-20 text-sm text-night-100 placeholder:text-night-600 focus:outline-none focus:border-gold-500/30 transition-colors"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {search && (
              <button onClick={() => setSearch('')} className="p-1.5 text-night-500 hover:text-night-300">
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg transition-colors ${
                showFilters ? 'text-gold-400 bg-gold-500/10' : 'text-night-500 hover:text-night-300'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sort pills (always visible) */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {SORT_OPTIONS.map(opt => (
            <Pill
              key={opt.value}
              label={opt.label}
              active={sort === opt.value}
              onClick={() => setSort(opt.value)}
            />
          ))}
        </div>

        {/* Expanded filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden space-y-3"
            >
              {/* Revelation filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-night-600 uppercase tracking-wider w-16 shrink-0">Type</span>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  <Pill label="All" active={filterRev === 'all'} onClick={() => setFilterRev('all')} />
                  <Pill label={`🕋 Makki (${makkiCount})`} active={filterRev === 'makki'} onClick={() => setFilterRev('makki')} accent="gold" />
                  <Pill label={`🕌 Madani (${madaniCount})`} active={filterRev === 'madani'} onClick={() => setFilterRev('madani')} accent="sage" />
                </div>
              </div>

              {/* Juz filter */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-night-600 uppercase tracking-wider w-16 shrink-0">Juz</span>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                  <Pill label="All" active={filterJuz === null} onClick={() => setFilterJuz(null)} />
                  {Array.from({ length: 30 }, (_, i) => i + 1).map(j => (
                    <Pill
                      key={j}
                      label={j.toString()}
                      active={filterJuz === j}
                      onClick={() => setFilterJuz(filterJuz === j ? null : j)}
                    />
                  ))}
                </div>
              </div>

              {/* In progress filter */}
              {inProgressCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-night-600 uppercase tracking-wider w-16 shrink-0">Status</span>
                  <Pill
                    label={`In Progress (${inProgressCount})`}
                    active={filterInProgress}
                    onClick={() => setFilterInProgress(!filterInProgress)}
                    accent="sage"
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results count */}
      {(search || filterRev !== 'all' || filterJuz !== null || filterInProgress) && (
        <div className="relative z-10 max-w-5xl mx-auto px-5 pb-2">
          <p className="text-xs text-night-600">
            {filtered.length} surah{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Masonry Grid */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 pb-32">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4 opacity-30" style={{ fontFamily: 'var(--font-arabic)' }}>📖</p>
            <p className="text-night-400">No surahs found</p>
            <button
              onClick={() => { setSearch(''); setFilterRev('all'); setFilterJuz(null); setFilterInProgress(false); }}
              className="mt-3 text-gold-400 text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 auto-rows-min"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((surah, i) => (
                <SurahCard
                  key={surah.id}
                  surah={surah}
                  index={i}
                  progress={progressMap[surah.id] || { versesMemorized: 0, percentage: 0 }}
                  isJuzAmma={surah.juz.includes(30)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
