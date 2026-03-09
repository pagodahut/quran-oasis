'use client';

/**
 * Garden of Surahs v2 — Fast, responsive, integrated search
 * No per-card scroll tracking. Uniform grid. Verse search inline.
 */

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, BookOpen, Sparkles, SlidersHorizontal, ChevronDown, ArrowUpDown } from 'lucide-react';
import { SURAHS, type SurahData } from '@/components/SurahBrowser';
import { getSurahProgress } from '@/lib/progressStore';
import { searchQuran, type Ayah } from '@/lib/quranData';

// ─── Sort & Filter Types ─────────────────────────────────────────
type SortOption = 'number' | 'revelation' | 'verses' | 'alpha';
type RevelationFilter = 'all' | 'makki' | 'madani';

const SORT_LABELS: Record<SortOption, string> = {
  number: 'Number',
  revelation: 'Revelation',
  verses: 'Verses',
  alpha: 'A\u2013Z',
};

const ALL_JUZ = Array.from({ length: 30 }, (_, i) => i + 1);

const EASTERN_DIGITS = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
function toEastern(n: number): string {
  return n.toString().split('').map(d => EASTERN_DIGITS[parseInt(d)]).join('');
}

// ─── Compact Surah Row ───────────────────────────────────────────
function SurahRow({
  surah,
  progress,
  isJuzAmma,
  onSelect,
}: {
  surah: SurahData;
  progress: number;
  isJuzAmma: boolean;
  onSelect: (id: number) => void;
}) {
  const isMakki = surah.revelation === 'makki';

  return (
    <button
      onClick={() => onSelect(surah.id)}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all duration-200 active:scale-[0.98] group"
      style={{
        background: progress > 0
          ? `linear-gradient(135deg, ${isMakki ? 'rgba(196,148,58,0.06)' : 'rgba(45,212,150,0.06)'} 0%, rgba(15,15,20,0.6) 100%)`
          : 'rgba(20,20,30,0.4)',
        border: `1px solid ${progress > 0 ? (isMakki ? 'rgba(196,148,58,0.15)' : 'rgba(45,212,150,0.15)') : 'rgba(40,40,55,0.4)'}`,
      }}
    >
      {/* Number circle */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-semibold shrink-0 ${
          isMakki ? 'text-gold-400 bg-gold-500/10' : 'text-sage-400 bg-sage-500/10'
        }`}
      >
        {surah.id}
      </div>

      {/* Name block */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-night-100 truncate">{surah.name}</span>
          {isJuzAmma && (
            <span aria-hidden="true" className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400/70 border border-amber-500/15 shrink-0">
              30
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[11px] text-night-500">{surah.ayahs} verses</span>
          <span className="text-night-700">·</span>
          <span className={`text-[11px] ${isMakki ? 'text-gold-500/60' : 'text-sage-500/60'}`}>
            {isMakki ? 'Makki' : 'Madani'}
          </span>
        </div>
        {/* Progress bar */}
        {progress > 0 && (
          <div className="h-1.5 bg-night-800/40 rounded-full mt-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${isMakki ? 'bg-gold-500/60' : 'bg-sage-500/60'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Arabic name */}
      <span
        className={`text-lg shrink-0 ${isMakki ? 'text-gold-400/70' : 'text-sage-400/70'} group-hover:text-gold-300 transition-colors`}
        style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
      >
        {surah.arabic}
      </span>
    </button>
  );
}

// ─── Verse Result Card ───────────────────────────────────────────
function VerseResult({
  surah,
  surahName,
  ayah,
  query,
  onSelect,
}: {
  surah: number;
  surahName: string;
  ayah: Ayah;
  query: string;
  onSelect: (surah: number, ayah: number) => void;
}) {
  const highlightMatch = (text: string) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-gold-500/25 text-gold-200 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <button
      onClick={() => onSelect(surah, ayah.numberInSurah)}
      className="w-full p-4 rounded-2xl text-left transition-all duration-200 active:scale-[0.98] group"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold text-gold-300 bg-gold-500/15 border border-gold-500/20">
            {surah}
          </div>
          <div>
            <span className="text-sm font-medium text-night-100">{surahName}</span>
            <span className="text-night-600 text-xs ml-1.5">:{ayah.numberInSurah}</span>
          </div>
        </div>
        <ArrowRight className="w-3.5 h-3.5 text-night-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Arabic */}
      <p
        className="text-lg text-gold-200/80 leading-[2] mb-2"
        style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
      >
        {ayah.text.arabic}
      </p>

      {/* Translation */}
      <p className="text-xs text-night-400 leading-relaxed line-clamp-2">
        {highlightMatch(ayah.text.translations.sahih)}
      </p>
    </button>
  );
}

// ─── Main Component ──────────────────────────────────────────────
interface GardenOfSurahsProps {
  onSelectSurah?: (surahId: number) => void;
  showHeader?: boolean;
}

export default function GardenOfSurahs({ onSelectSurah, showHeader = true }: GardenOfSurahsProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});
  const [verseResults, setVerseResults] = useState<{ surah: number; surahName: string; ayah: Ayah }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Filter & sort state
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('number');
  const [revelationFilter, setRevelationFilter] = useState<RevelationFilter>('all');
  const [juzFilter, setJuzFilter] = useState<number | null>(null);
  const [verseMin, setVerseMin] = useState('');
  const [verseMax, setVerseMax] = useState('');

  const hasActiveFilters = revelationFilter !== 'all' || juzFilter !== null || verseMin !== '' || verseMax !== '' || sortBy !== 'number';

  const clearFilters = useCallback(() => {
    setSortBy('number');
    setRevelationFilter('all');
    setJuzFilter(null);
    setVerseMin('');
    setVerseMax('');
  }, []);

  // Load progress once
  useEffect(() => {
    try {
      const map: Record<number, number> = {};
      for (const s of SURAHS) {
        const p = getSurahProgress(s.id);
        if (p.versesMemorized > 0) {
          map[s.id] = Math.round((p.versesMemorized / s.ayahs) * 100);
        }
      }
      setProgressMap(map);
    } catch { /* SSR safety */ }
  }, []);

  const handleSelect = useCallback((surahId: number, ayah?: number) => {
    if (onSelectSurah) {
      onSelectSurah(surahId);
    } else {
      router.push(`/memorize/${surahId}/${ayah || 1}`);
    }
  }, [onSelectSurah, router]);

  // Handle search with verse lookup + direct reference parsing
  const handleSearch = useCallback((q: string) => {
    setQuery(q);

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);

    if (!q.trim()) {
      setVerseResults([]);
      setIsSearching(false);
      return;
    }

    // Direct verse reference: "2:255", "2.255", "surah 2 ayah 255"
    const refMatch = q.match(/^(\d{1,3})\s*[:\.]\s*(\d{1,3})$/);
    const longMatch = q.match(/^(?:surah\s+)?(\d{1,3})\s+(?:ayah\s+)?(\d{1,3})$/i);
    const nameMatch = q.match(/^(al-?\w+)\s+(\d{1,3})$/i);

    if (refMatch || longMatch) {
      const m = (refMatch || longMatch)!;
      const s = parseInt(m[1]), a = parseInt(m[2]);
      if (s >= 1 && s <= 114) {
        handleSelect(s, a);
        return;
      }
    }
    if (nameMatch) {
      const name = nameMatch[1].toLowerCase().replace('al-', '').replace('-', '');
      const match = SURAHS.find(s => s.name.toLowerCase().includes(name));
      if (match) {
        handleSelect(match.id, parseInt(nameMatch[2]));
        return;
      }
    }

    // Debounced verse search
    setIsSearching(true);
    searchTimerRef.current = setTimeout(() => {
      const results = searchQuran(q, 'both');
      setVerseResults(results.slice(0, 30));
      setIsSearching(false);
    }, 250);
  }, [handleSelect]);

  // Filter & sort surahs
  const filteredSurahs = useMemo(() => {
    let result = [...SURAHS];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.arabic.includes(q) ||
        s.id.toString() === q
      );
    }

    // Revelation filter
    if (revelationFilter !== 'all') {
      result = result.filter(s => s.revelation === revelationFilter);
    }

    // Juz filter
    if (juzFilter !== null) {
      result = result.filter(s => s.juz.includes(juzFilter));
    }

    // Verse count range
    const vMin = verseMin ? parseInt(verseMin) : 0;
    const vMax = verseMax ? parseInt(verseMax) : Infinity;
    if (vMin > 0 || vMax < Infinity) {
      result = result.filter(s => s.ayahs >= vMin && s.ayahs <= vMax);
    }

    // Sort
    switch (sortBy) {
      case 'number':
        result.sort((a, b) => a.id - b.id);
        break;
      case 'revelation':
        result.sort((a, b) => a.order - b.order);
        break;
      case 'verses':
        result.sort((a, b) => b.ayahs - a.ayahs);
        break;
      case 'alpha':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [query, sortBy, revelationFilter, juzFilter, verseMin, verseMax]);

  const inProgressCount = Object.keys(progressMap).length;
  const totalMemorized = Object.values(progressMap).filter(p => p === 100).length;

  return (
    <div className="relative min-h-screen">
      {/* Stats bar */}
      {showHeader && (
        <div className="px-4 pt-3 pb-1">
          <div className="flex items-center gap-3 text-[11px] text-night-500">
            <span>114 Surahs</span>
            <span className="text-night-700">·</span>
            <span>6,236 Ayahs</span>
            {inProgressCount > 0 && (
              <>
                <span className="text-night-700">·</span>
                <span className="text-sage-500/70">{inProgressCount} started</span>
              </>
            )}
            {totalMemorized > 0 && (
              <>
                <span className="text-night-700">·</span>
                <span className="text-gold-500/70">{totalMemorized} complete</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="sticky top-0 z-20 px-4 py-3 backdrop-blur-xl bg-night-950/80">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-night-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search surahs, verses, or jump to 2:255…"
            className="w-full bg-night-900/60 border border-night-700/30 rounded-xl py-2.5 pl-10 pr-10 text-sm text-night-100 placeholder:text-night-600 focus:outline-none focus:border-gold-500/30 transition-colors"
          />
          {query && (
            <button
              onClick={() => { setQuery(''); setVerseResults([]); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-night-500 hover:text-night-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isSearching && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>

      <div className="px-4 pb-32 space-y-2">
        {/* Verse results (when searching) */}
        {verseResults.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2 px-1">
              <h3 className="text-xs uppercase tracking-widest text-night-400 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-gold-400/60" />
                Verses
              </h3>
              <span className="text-[10px] text-night-600">{verseResults.length}+ matches</span>
            </div>
            <div className="space-y-2">
              {verseResults.slice(0, 8).map((r, i) => (
                <VerseResult
                  key={`${r.surah}-${r.ayah.numberInSurah}`}
                  surah={r.surah}
                  surahName={r.surahName}
                  ayah={r.ayah}
                  query={query}
                  onSelect={(s, a) => handleSelect(s, a)}
                />
              ))}
              {verseResults.length > 8 && (
                <p className="text-center text-xs text-night-600 py-2">
                  {verseResults.length - 8} more results — refine your search
                </p>
              )}
            </div>
          </div>
        )}

        {/* Surah list */}
        {filteredSurahs.length > 0 ? (
          <>
            {(query || hasActiveFilters) && (
              <div className="flex items-center justify-between px-1 mb-1 mt-2">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-3 h-3 text-night-500" />
                  <h3 className="text-xs uppercase tracking-widest text-night-400 font-medium">Surahs</h3>
                </div>
                <span className="text-[10px] text-night-600">{filteredSurahs.length} result{filteredSurahs.length !== 1 ? 's' : ''}</span>
              </div>
            )}
            <div className="space-y-1.5">
              {filteredSurahs.map(surah => (
                <SurahRow
                  key={surah.id}
                  surah={surah}
                  progress={progressMap[surah.id] || 0}
                  isJuzAmma={surah.juz.includes(30)}
                  onSelect={(id) => handleSelect(id)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-night-500 text-sm">No surahs match "{query}"</p>
            {verseResults.length === 0 && !isSearching && (
              <button
                onClick={() => { setQuery(''); setVerseResults([]); }}
                className="mt-2 text-gold-400/70 text-sm hover:underline"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
