'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  ChevronLeft, 
  BookOpen,
  Filter,
  X,
  MapPin,
  Layers,
  Star,
} from 'lucide-react';
import { surahs, type Surah } from '@/data/surahs';
import BottomNav from '@/components/BottomNav';

type FilterType = 'all' | 'Meccan' | 'Medinan';
type SortType = 'number' | 'verses' | 'name';

function SurahCard({ surah, index }: { surah: Surah; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.3 }}
    >
      <Link href={`/mushaf?surah=${surah.number}`}>
        <div className="liquid-card-interactive p-4 group">
          <div className="flex items-center gap-4">
            {/* Surah Number */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-gold-600/10 flex items-center justify-center border border-gold-500/20 group-hover:border-gold-500/40 transition-colors">
                <span className="text-gold-400 font-semibold">{surah.number}</span>
              </div>
              {surah.juz === 30 && (
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sage-500 flex items-center justify-center">
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                </div>
              )}
            </div>

            {/* Surah Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-night-100 truncate">{surah.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  surah.revelationType === 'Meccan' 
                    ? 'bg-amber-500/10 text-amber-400' 
                    : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {surah.revelationType}
                </span>
              </div>
              <p className="text-night-500 text-sm truncate">{surah.meaning}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-night-600">
                <span>{surah.verses} verses</span>
                <span>•</span>
                <span>Juz {surah.juz}</span>
              </div>
            </div>

            {/* Arabic Name */}
            <div className="text-right flex-shrink-0">
              <p 
                className="text-xl text-gold-400 group-hover:text-gold-300 transition-colors"
                style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
              >
                {surah.arabicName}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FilterChip({ 
  label, 
  active, 
  onClick,
  count 
}: { 
  label: string; 
  active: boolean; 
  onClick: () => void;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30' 
          : 'bg-night-800/50 text-night-400 border border-night-700/50 hover:border-night-600'
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`ml-1.5 ${active ? 'text-gold-400/70' : 'text-night-500'}`}>
          ({count})
        </span>
      )}
    </button>
  );
}

export default function SurahsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('number');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort surahs
  const filteredSurahs = useMemo(() => {
    let result = [...surahs];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.arabicName.includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.number.toString() === q
      );
    }

    // Filter by revelation type
    if (filter !== 'all') {
      result = result.filter(s => s.revelationType === filter);
    }

    // Sort
    switch (sortBy) {
      case 'verses':
        result.sort((a, b) => b.verses - a.verses);
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => a.number - b.number);
    }

    return result;
  }, [searchQuery, filter, sortBy]);

  const meccanCount = surahs.filter(s => s.revelationType === 'Meccan').length;
  const medinanCount = surahs.filter(s => s.revelationType === 'Medinan').length;

  return (
    <div className="min-h-screen bg-night-950">
      {/* Header */}
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <Link href="/" className="btn-icon">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-display text-xl text-night-100">Surah Index</h1>
              <p className="text-xs text-night-500">114 Surahs • 6,236 Ayahs</p>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-icon ${showFilters ? 'text-gold-400' : ''}`}
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-night-500" />
            <input
              type="text"
              placeholder="Search by name, meaning, or number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="liquid-input pl-10 pr-10"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-night-500 hover:text-night-300"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 space-y-3">
                  {/* Revelation Type */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-night-500" />
                    <span className="text-sm text-night-400 mr-2">Revelation:</span>
                    <div className="flex gap-2 flex-wrap">
                      <FilterChip 
                        label="All" 
                        active={filter === 'all'} 
                        onClick={() => setFilter('all')}
                        count={114}
                      />
                      <FilterChip 
                        label="Meccan" 
                        active={filter === 'Meccan'} 
                        onClick={() => setFilter('Meccan')}
                        count={meccanCount}
                      />
                      <FilterChip 
                        label="Medinan" 
                        active={filter === 'Medinan'} 
                        onClick={() => setFilter('Medinan')}
                        count={medinanCount}
                      />
                    </div>
                  </div>

                  {/* Sort By */}
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-night-500" />
                    <span className="text-sm text-night-400 mr-2">Sort by:</span>
                    <div className="flex gap-2 flex-wrap">
                      <FilterChip 
                        label="Number" 
                        active={sortBy === 'number'} 
                        onClick={() => setSortBy('number')}
                      />
                      <FilterChip 
                        label="Verses" 
                        active={sortBy === 'verses'} 
                        onClick={() => setSortBy('verses')}
                      />
                      <FilterChip 
                        label="Name" 
                        active={sortBy === 'name'} 
                        onClick={() => setSortBy('name')}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Surah List */}
      <main className="px-4 py-6 pb-40">
        {filteredSurahs.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-12 h-12 text-night-700 mx-auto mb-4" />
            <p className="text-night-400">No surahs found</p>
            <button 
              onClick={() => { setSearchQuery(''); setFilter('all'); }}
              className="mt-4 text-gold-400 text-sm hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-sm text-night-500 mb-4">
              {filteredSurahs.length} surah{filteredSurahs.length !== 1 ? 's' : ''} found
            </p>

            {/* Juz Amma Quick Access */}
            {filter === 'all' && !searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="liquid-glass-gold rounded-2xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-night-100 flex items-center gap-2">
                        <Star className="w-4 h-4 text-gold-400" />
                        Juz Amma (Juz 30)
                      </h3>
                      <p className="text-sm text-night-400 mt-1">
                        37 short surahs • Perfect for beginners
                      </p>
                    </div>
                    <Link 
                      href="/mushaf?surah=78"
                      className="liquid-pill text-sm text-gold-400 hover:text-gold-300"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Surah Cards */}
            <div className="space-y-3">
              {filteredSurahs.map((surah, index) => (
                <SurahCard key={surah.number} surah={surah} index={index} />
              ))}
            </div>
          </>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
