'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  BookOpen, 
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { searchQuran, getAllSurahs, type Ayah } from '@/lib/quranData';

interface SearchResult {
  surah: number;
  surahName: string;
  ayah: Ayah;
}

interface QuranSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (surah: number, ayah: number) => void;
}

// Fuzzy match for surah names
function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  
  if (lowerText.includes(lowerQuery)) return true;
  
  let queryIndex = 0;
  for (let i = 0; i < lowerText.length && queryIndex < lowerQuery.length; i++) {
    if (lowerText[i] === lowerQuery[queryIndex]) {
      queryIndex++;
    }
  }
  return queryIndex === lowerQuery.length;
}

export default function QuranSearch({ isOpen, onClose, onSelectResult }: QuranSearchProps) {
  const [query, setQuery] = useState('');
  const [searchIn, setSearchIn] = useState<'both' | 'arabic' | 'translation'>('both');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [surahMatches, setSurahMatches] = useState<ReturnType<typeof getAllSurahs>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const allSurahs = useMemo(() => getAllSurahs(), []);
  
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults([]);
      setSurahMatches([]);
    }
  }, [isOpen]);
  
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSurahMatches([]);
      return;
    }
    
    const matchingSurahs = allSurahs.filter(s => 
      fuzzyMatch(s.englishName, query) || 
      fuzzyMatch(s.englishNameTranslation, query) ||
      s.name.includes(query)
    );
    setSurahMatches(matchingSurahs.slice(0, 5));
    
    setIsSearching(true);
    const timer = setTimeout(() => {
      const searchResults = searchQuran(query, searchIn);
      setResults(searchResults.slice(0, 50));
      setIsSearching(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query, searchIn, allSurahs]);
  
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);
    
    if (index === -1) return text;
    
    return (
      <>
        {text.slice(0, index)}
        <mark className="bg-gold-500/30 text-gold-300 rounded px-0.5">
          {text.slice(index, index + query.length)}
        </mark>
        {text.slice(index + query.length)}
      </>
    );
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50"
          style={{
            background: 'rgba(10, 10, 15, 0.95)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="max-w-2xl mx-auto px-4 py-6 safe-area-top"
            onClick={e => e.stopPropagation()}
          >
            {/* Top glow effect */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 70%)',
              }}
            />

            {/* Search Header - Liquid Glass */}
            <div className="relative flex items-center gap-3 mb-4">
              <motion.div 
                className="flex-1 relative"
                initial={{ scale: 0.98 }}
                animate={{ scale: 1 }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400 z-10" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search Quran by text, surah name, or topic..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-night-100 placeholder:text-night-500 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.15)',
                    outline: 'none',
                  }}
                />
                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Loader2 className="w-5 h-5 text-gold-400 animate-spin" />
                  </motion.div>
                )}
              </motion.div>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="liquid-icon-btn"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Filter Pills - Liquid Glass Tabs */}
            <div 
              className="inline-flex p-1 rounded-xl mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                border: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {[
                { value: 'both' as const, label: 'All' },
                { value: 'arabic' as const, label: 'Arabic' },
                { value: 'translation' as const, label: 'Translation' },
              ].map(filter => (
                <motion.button
                  key={filter.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSearchIn(filter.value)}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300"
                  style={{
                    background: searchIn === filter.value 
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                      : 'transparent',
                    color: searchIn === filter.value ? '#e5e5e5' : '#6b7280',
                    boxShadow: searchIn === filter.value 
                      ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                      : 'none',
                  }}
                >
                  {filter.label}
                </motion.button>
              ))}
            </div>
            
            {/* Results */}
            <div className="max-h-[70vh] overflow-y-auto space-y-3 pb-safe">
              {/* Surah Matches */}
              {surahMatches.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 px-1 font-semibold">Surahs</h3>
                  <div className="space-y-2">
                    {surahMatches.map((surah, i) => (
                      <motion.button
                        key={surah.number}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          onSelectResult(surah.number, 1);
                          onClose();
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl group"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                        }}
                      >
                        <div 
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-gold-400 font-semibold"
                          style={{
                            background: 'linear-gradient(135deg, rgba(201,162,39,0.15) 0%, rgba(201,162,39,0.08) 100%)',
                            border: '1px solid rgba(201,162,39,0.2)',
                          }}
                        >
                          {surah.number}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-night-100 font-medium">{highlightMatch(surah.englishName, query)}</p>
                          <p className="text-xs text-night-500">{surah.englishNameTranslation} • {surah.numberOfAyahs} verses</p>
                        </div>
                        <p className="font-arabic text-gold-400/80 text-lg">{surah.name}</p>
                        <ArrowRight className="w-4 h-4 text-night-600 group-hover:text-gold-400 transition-colors" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Verse Results */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: surahMatches.length ? 0.1 : 0 }}
                >
                  <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 px-1 font-semibold">
                    Verses ({results.length}{results.length >= 50 ? '+' : ''})
                  </h3>
                  <div className="space-y-2">
                    {results.map((result, i) => (
                      <motion.button
                        key={`${result.surah}-${result.ayah.numberInSurah}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          onSelectResult(result.surah, result.ayah.numberInSurah);
                          onClose();
                        }}
                        className="w-full p-4 rounded-2xl transition-all text-left group"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
                          border: '1px solid rgba(255,255,255,0.05)',
                        }}
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="liquid-badge text-xs">
                            {result.surahName} {result.surah}:{result.ayah.numberInSurah}
                          </span>
                          <span className="text-xs text-night-600">
                            Juz {result.ayah.juz} • Page {result.ayah.page}
                          </span>
                        </div>
                        
                        {/* Arabic */}
                        <p className="font-arabic text-xl text-night-200 mb-2 line-clamp-2" style={{ direction: 'rtl' }}>
                          {result.ayah.text.arabic}
                        </p>
                        
                        {/* Translation */}
                        <p className="text-sm text-night-400 line-clamp-2">
                          {highlightMatch(result.ayah.text.translations.sahih, query)}
                        </p>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Empty State */}
              {query && !isSearching && results.length === 0 && surahMatches.length === 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <BookOpen className="w-8 h-8 text-night-600" />
                  </div>
                  <p className="text-night-400">No results found for "{query}"</p>
                  <p className="text-night-600 text-sm mt-1">Try different keywords or check spelling</p>
                </motion.div>
              )}
              
              {/* Initial State */}
              {!query && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(201,162,39,0.05) 100%)',
                      border: '1px solid rgba(201,162,39,0.15)',
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-gold-400/60" />
                  </div>
                  <p className="text-night-300">Search by word, phrase, or surah name</p>
                  <p className="text-night-600 text-sm mt-1">Arabic and English supported</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
