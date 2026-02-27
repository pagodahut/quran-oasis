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

// Function to get card size based on ayah count (adapted from Garden of Surahs)
function getSurahCardSize(ayahs: number): 'lg' | 'md' | 'sm' {
  if (ayahs >= 100) return 'lg';
  if (ayahs >= 30) return 'md';
  return 'sm';
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
    
    // Check for precise verse reference patterns first
    const preciseRefPattern = /^(\d{1,3})\s*[:\.]\s*(\d{1,3})$/;
    const surahAyahPattern = /^(?:surah\s+)?(\d{1,3})\s+(?:ayah\s+)?(\d{1,3})$/i;
    const surahNamePattern = /^(al-?\w+)\s+(\d{1,3})$/i;
    
    const refMatch = query.match(preciseRefPattern);
    const surahAyahMatch = query.match(surahAyahPattern);
    const surahNameMatch = query.match(surahNamePattern);
    
    if (refMatch) {
      const surah = parseInt(refMatch[1]);
      const ayah = parseInt(refMatch[2]);
      if (surah >= 1 && surah <= 114) {
        onSelectResult(surah, ayah);
        onClose();
        return;
      }
    }
    
    if (surahAyahMatch) {
      const surah = parseInt(surahAyahMatch[1]);
      const ayah = parseInt(surahAyahMatch[2]);
      if (surah >= 1 && surah <= 114) {
        onSelectResult(surah, ayah);
        onClose();
        return;
      }
    }
    
    if (surahNameMatch) {
      const surahName = surahNameMatch[1].toLowerCase();
      const ayahNumber = parseInt(surahNameMatch[2]);
      const matchingSurah = allSurahs.find(s => 
        s.englishName.toLowerCase().includes(surahName.replace('al-', '').replace('-', ''))
      );
      if (matchingSurah) {
        onSelectResult(matchingSurah.number, ayahNumber);
        onClose();
        return;
      }
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
  }, [query, searchIn, allSurahs, onSelectResult, onClose]);
  
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
          role="dialog"
          aria-modal="true"
          aria-labelledby="search-title"
          aria-describedby="search-description"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="max-w-2xl mx-auto px-4 py-6 safe-area-top"
            onClick={e => e.stopPropagation()}
          >
            {/* Hidden title and description for screen readers */}
            <h1 id="search-title" className="sr-only">Quran Search</h1>
            <p id="search-description" className="sr-only">
              Search the Quran by verse content, surah names, or specific verse references like "2:255"
            </p>
            
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
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-night-400 z-10" aria-hidden="true" />
                <label htmlFor="search-input" className="sr-only">
                  Search Quran verses, surahs, or use specific references like "2:255"
                </label>
                <input
                  id="search-input"
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search verses or try '2:255', 'surah 18 ayah 10', or 'Al-Baqarah 255'..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-night-100 text-base placeholder:text-night-500 transition-all duration-300 focus:ring-2 focus:ring-gold-500/50"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.15)',
                    outline: 'none',
                  }}
                  aria-describedby="search-help"
                />
                <p id="search-help" className="sr-only">
                  You can search for verses by content, surah names, or use specific verse references like "2:255" or "surah 18 ayah 10"
                </p>
                {isSearching && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    aria-label="Searching"
                  >
                    <Loader2 className="w-5 h-5 text-gold-400 animate-spin" aria-hidden="true" />
                  </motion.div>
                )}
              </motion.div>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="liquid-icon-btn focus:ring-2 focus:ring-gold-500/50"
                aria-label="Close search"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            </div>
            
            {/* Filter Pills - Liquid Glass Tabs */}
            <fieldset className="mb-6">
              <legend className="sr-only">Search scope</legend>
              <div 
                className="inline-flex p-1 rounded-xl"
                role="radiogroup"
                aria-label="Search scope selection"
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
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 focus:ring-2 focus:ring-gold-500/50"
                    style={{
                      background: searchIn === filter.value 
                        ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                        : 'transparent',
                      color: searchIn === filter.value ? '#e5e5e5' : '#6b7280',
                      boxShadow: searchIn === filter.value 
                        ? '0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : 'none',
                    }}
                    role="radio"
                    aria-checked={searchIn === filter.value}
                    aria-label={`Search in ${filter.label.toLowerCase()}`}
                  >
                    {filter.label}
                  </motion.button>
                ))}
              </div>
            </fieldset>
            
            {/* Results */}
            <div 
              className="max-h-[70vh] overflow-y-auto space-y-6 pb-safe"
              aria-live="polite"
              aria-label="Search results"
            >
              {/* Surah Matches - Show on top */}
              {surahMatches.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 px-1 font-semibold">Surahs</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {surahMatches.map((surah, i) => {
                      const cardSize = getSurahCardSize(surah.numberOfAyahs);
                      const isMakki = surah.revelationType === 'Meccan';
                      const sizeClasses = {
                        lg: 'col-span-2 min-h-[140px]',
                        md: 'col-span-1 min-h-[120px]',
                        sm: 'col-span-1 min-h-[100px]',
                      };
                      
                      return (
                        <motion.button
                          key={surah.number}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                          whileHover={{ y: -2, transition: { duration: 0.2 } }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => {
                            onSelectResult(surah.number, 1);
                            onClose();
                          }}
                          className={`${sizeClasses[cardSize]} p-4 rounded-2xl text-left flex flex-col justify-between group relative overflow-hidden transition-all duration-300 focus:ring-2 focus:ring-gold-500/50 focus:outline-none`}
                          style={{
                            background: isMakki
                              ? 'linear-gradient(135deg, rgba(196,148,58,0.08) 0%, rgba(15,15,20,0.9) 100%)'
                              : 'linear-gradient(135deg, rgba(45,212,150,0.08) 0%, rgba(15,15,20,0.9) 100%)',
                            border: isMakki 
                              ? '1px solid rgba(196,148,58,0.25)' 
                              : '1px solid rgba(45,212,150,0.25)',
                            backdropFilter: 'blur(12px)',
                          }}
                          aria-label={`Go to ${surah.englishName} (${surah.englishNameTranslation}), Surah ${surah.number}, ${surah.numberOfAyahs} verses, ${surah.revelationType}`}
                        >
                          <div className="flex items-start justify-between">
                            <span className={`text-xl font-light opacity-40 ${isMakki ? 'text-gold-400' : 'text-sage-400'}`}>
                              {surah.number}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-lg font-medium ${
                              isMakki 
                                ? 'bg-gold-500/10 text-gold-400/80' 
                                : 'bg-sage-500/10 text-sage-400/80'
                            }`}>
                              {isMakki ? '🕋 Makki' : '🕌 Madani'}
                            </span>
                          </div>

                          <div className="flex-1 flex flex-col items-center justify-center py-2">
                            <p
                              className={`${cardSize === 'lg' ? 'text-2xl' : cardSize === 'md' ? 'text-xl' : 'text-lg'} leading-tight group-hover:scale-105 transition-transform duration-300 ${isMakki ? 'text-gold-400' : 'text-sage-400'} mb-1`}
                              style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
                            >
                              {surah.name}
                            </p>
                            <p className={`font-medium text-night-100 text-center ${cardSize === 'sm' ? 'text-sm' : 'text-base'}`}>
                              {highlightMatch(surah.englishName, query)}
                            </p>
                            <p className="text-xs text-night-500 italic text-center">{surah.englishNameTranslation}</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center justify-between text-[10px] text-night-500 mb-1">
                              <span>{surah.numberOfAyahs} verses</span>
                              <span className="opacity-60">#{surah.revelationType === 'Meccan' ? 'M' : 'Md'}</span>
                            </div>
                            <div className="h-1 bg-night-800/60 rounded-full">
                              <div 
                                className={`h-full rounded-full ${isMakki ? 'bg-gradient-to-r from-gold-600 to-gold-400' : 'bg-gradient-to-r from-sage-600 to-sage-400'}`}
                                style={{ width: '0%' }}
                              />
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Verse Results */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs uppercase tracking-widest text-night-300 font-semibold flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      Verses
                    </h3>
                    <span className="text-xs text-night-500 bg-night-800/50 px-2 py-1 rounded-lg">
                      {results.length}{results.length >= 50 ? '+' : ''} matches
                    </span>
                  </div>
                  <div className="space-y-3">
                    {results.map((result, i) => (
                      <motion.button
                        key={`${result.surah}-${result.ayah.numberInSurah}`}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.02 }}
                        whileHover={{ scale: 1.01, y: -1 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => {
                          onSelectResult(result.surah, result.ayah.numberInSurah);
                          onClose();
                        }}
                        className="w-full p-5 rounded-2xl transition-all text-left group shadow-lg hover:shadow-xl focus:ring-2 focus:ring-gold-500/50 focus:outline-none"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                        }}
                        aria-label={`Go to ${result.surahName}, verse ${result.ayah.numberInSurah}: ${result.ayah.text.translations.sahih.substring(0, 100)}${result.ayah.text.translations.sahih.length > 100 ? '...' : ''}`}
                      >
                        {/* Header with better styling */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold text-gold-300"
                              style={{
                                background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
                                border: '1px solid rgba(201,162,39,0.25)',
                              }}
                            >
                              {result.surah}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-night-100">
                                {result.surahName}
                              </p>
                              <p className="text-xs text-night-500">
                                Verse {result.ayah.numberInSurah}
                              </p>
                            </div>
                          </div>
                          <div className="text-right text-xs text-night-600">
                            <div>Juz {result.ayah.juz}</div>
                            <div>Page {result.ayah.page}</div>
                          </div>
                        </div>
                        
                        {/* Arabic Text - Enhanced */}
                        <div className="mb-4 p-4 rounded-xl bg-night-900/40 border border-night-800/50">
                          <p 
                            className="font-arabic text-2xl text-gold-200 leading-relaxed group-hover:text-gold-100 transition-colors" 
                            style={{ direction: 'rtl', lineHeight: '1.8' }}
                          >
                            {result.ayah.text.arabic}
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gold-500/20 text-gold-400 text-sm mx-2 align-middle">
                              {result.ayah.numberInSurah}
                            </span>
                          </p>
                        </div>
                        
                        {/* Translation - Enhanced */}
                        <div className="bg-night-800/30 rounded-xl p-4 border-l-4 border-sage-500/50">
                          <p className="text-sm text-night-300 leading-relaxed">
                            {highlightMatch(result.ayah.text.translations.sahih, query)}
                          </p>
                        </div>

                        {/* Action indicator */}
                        <div className="flex items-center justify-end mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-1 text-xs text-gold-400">
                            <span>Jump to verse</span>
                            <ArrowRight className="w-3 h-3" />
                          </div>
                        </div>
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
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{
                      background: 'linear-gradient(135deg, rgba(201,162,39,0.1) 0%, rgba(201,162,39,0.05) 100%)',
                      border: '1px solid rgba(201,162,39,0.15)',
                    }}
                  >
                    <Sparkles className="w-8 h-8 text-gold-400/60" />
                  </div>
                  <p className="text-night-300 font-medium mb-3">Search the Holy Quran</p>
                  <div className="space-y-2 text-night-500 text-sm max-w-md mx-auto">
                    <p className="flex items-center gap-2 justify-center">
                      <Search className="w-4 h-4 text-gold-400/60" />
                      Find verses by word or phrase
                    </p>
                    <p className="flex items-center gap-2 justify-center">
                      <BookOpen className="w-4 h-4 text-sage-400/60" />
                      Browse surahs by name
                    </p>
                    <p className="flex items-center gap-2 justify-center">
                      <ArrowRight className="w-4 h-4 text-amber-400/60" />
                      Jump to specific verses: "2:255" or "surah 18 ayah 10"
                    </p>
                  </div>
                  <p className="text-night-600 text-xs mt-4">Arabic and English supported</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
