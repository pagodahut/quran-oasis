'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Bookmark, 
  Settings,
  List,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  Volume2,
  X,
  Search,
  BookOpen,
  Star,
  Brain,
  BookmarkPlus,
  Mic,
  Type,
  Layers,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  getSurah, 
  getAllSurahs, 
  getAudioUrl, 
  RECITERS,
  BISMILLAH,
  shouldShowBismillah,
  cleanAyahText,
  type Surah,
  type Ayah
} from '@/lib/quranData';
import BottomNav from '@/components/BottomNav';
import QuranSearch from '@/components/QuranSearch';
import TafsirDrawer from '@/components/TafsirDrawer';
import WordByWord from '@/components/WordByWord';
import TajweedPractice from '@/components/TajweedPractice';
import AskSheikhButton from '@/components/AskSheikhButton';
import { useBookmarks } from '@/lib/bookmarks';
import { useReadingPreferences } from '@/hooks/useAppliedPreferences';

export default function MushafPage() {
  const router = useRouter();
  const { toggle: toggleBookmark, check: isBookmarked } = useBookmarks();
  
  // Get preferences
  const prefs = useReadingPreferences();
  
  // State - initialized from preferences
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [surahNumber, setSurahNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState(prefs.reciter);
  const [showTranslation, setShowTranslation] = useState(prefs.showTranslation);
  const [translationEdition, setTranslationEdition] = useState<'sahih' | 'asad'>(prefs.translation);
  const [fontSize, setFontSize] = useState(prefs.arabicFontSize);
  
  // Audio state
  const [currentAyah, setCurrentAyah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatMode] = useState<1 | 3 | 5 | 10 | 'infinite'>(1);
  const [repeatCount, setRepeatCount] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Multi-ayah loop state
  const [loopRange, setLoopRange] = useState<{ start: number; end: number } | null>(null);
  const [showLoopPicker, setShowLoopPicker] = useState(false);
  
  // UI state
  const [showSurahList, setShowSurahList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirAyah, setTafsirAyah] = useState(1);
  
  // Word-by-word & Tajweed state
  const [wordByWordMode, setWordByWordMode] = useState(false);
  const [showTajweedPractice, setShowTajweedPractice] = useState(false);
  const [tajweedPracticeAyah, setTajweedPracticeAyah] = useState(1);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Sync with preferences
  useEffect(() => {
    setSelectedReciter(prefs.reciter);
    setShowTranslation(prefs.showTranslation);
    setTranslationEdition(prefs.translation);
    setFontSize(prefs.arabicFontSize);
    setPlaybackRate(prefs.playbackSpeed);
  }, [prefs]);

  // Load surah
  useEffect(() => {
    setLoading(true);
    const surah = getSurah(surahNumber);
    setCurrentSurah(surah || null);
    setCurrentAyah(1);
    setLoading(false);
  }, [surahNumber]);

  // Audio handlers
  const playAyah = (ayahNum: number) => {
    if (!currentSurah || !audioRef.current) return;
    
    const url = getAudioUrl(surahNumber, ayahNum, selectedReciter);
    audioRef.current.src = url;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play();
    setIsPlaying(true);
    setCurrentAyah(ayahNum);
    setRepeatCount(0);
    
    // Scroll to verse
    verseRefs.current[ayahNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current.src) {
        playAyah(currentAyah);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleAudioEnded = () => {
    // Handle single ayah repeat first
    if (repeatMode === 'infinite' || repeatCount + 1 < repeatMode) {
      // Repeat current ayah
      setRepeatCount(prev => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    
    // Reset repeat count after completing single ayah repeats
    setRepeatCount(0);
    
    // Handle multi-ayah loop range
    if (loopRange) {
      if (currentAyah < loopRange.end) {
        // Move to next ayah in range
        playAyah(currentAyah + 1);
      } else {
        // Loop back to start of range
        playAyah(loopRange.start);
      }
      return;
    }
    
    // Normal playback - move to next ayah
    if (currentSurah && currentAyah < currentSurah.numberOfAyahs) {
      playAyah(currentAyah + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (!currentSurah) return;
    if (currentAyah < currentSurah.numberOfAyahs) {
      playAyah(currentAyah + 1);
    } else if (surahNumber < 114) {
      setSurahNumber(surahNumber + 1);
    }
  };

  const playPrevious = () => {
    if (currentAyah > 1) {
      playAyah(currentAyah - 1);
    } else if (surahNumber > 1) {
      setSurahNumber(surahNumber - 1);
    }
  };

  const cycleRepeatMode = () => {
    const modes: (1 | 3 | 5 | 10 | 'infinite')[] = [1, 3, 5, 10, 'infinite'];
    const currentIndex = modes.indexOf(repeatMode);
    setRepeatMode(modes[(currentIndex + 1) % modes.length]);
    setRepeatCount(0);
  };

  const allSurahs = getAllSurahs();

  return (
    <div className="min-h-screen bg-night-950">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* Header - Premium Frosted Glass */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass rounded-b-2xl mx-2 mt-2">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-1.5">
            <Link href="/" className="liquid-icon-btn">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <button onClick={() => setShowSurahList(true)} className="liquid-icon-btn">
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Surah Title */}
          <button 
            onClick={() => setShowSurahList(true)}
            className="text-center flex-1 mx-3 py-1 px-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            {currentSurah && (
              <>
                <h1 className="quran-text text-xl text-gold-400" lang="ar" dir="rtl">{currentSurah.name}</h1>
                <p className="text-xs text-night-400">{currentSurah.englishName}</p>
              </>
            )}
          </button>

          <div className="flex items-center gap-1.5">
            <button onClick={() => setShowSearch(true)} className="liquid-icon-btn" aria-label="Search Quran">
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <Link href="/bookmarks" className="liquid-icon-btn" aria-label="View bookmarks">
              <Bookmark className="w-5 h-5" />
            </Link>
            <button onClick={() => setShowSettings(true)} className="liquid-icon-btn">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation - Smooth divider */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.04] text-sm">
          <button
            onClick={() => surahNumber > 1 && setSurahNumber(surahNumber - 1)}
            disabled={surahNumber === 1}
            className="flex items-center gap-1 text-night-400 disabled:opacity-30 min-h-[36px] px-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          
          <span className="text-night-500 text-xs">
            {currentSurah && (
              <>Surah {surahNumber} • {currentSurah.numberOfAyahs} verses • {currentSurah.revelationType}</>
            )}
          </span>
          
          <button
            onClick={() => surahNumber < 114 && setSurahNumber(surahNumber + 1)}
            disabled={surahNumber === 114}
            className="flex items-center gap-1 text-night-400 disabled:opacity-30 min-h-[36px] px-2 rounded-lg hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mushaf Content */}
      <main className="pb-56">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-gold-400">Loading...</div>
          </div>
        ) : currentSurah ? (
          <div className="px-4 py-6 max-w-3xl mx-auto">
            {/* Surah Header */}
            <div className="text-center mb-8">
              <h2 
                className="surah-header"
                style={{
                  direction: 'rtl',
                  textAlign: 'center',
                  width: '100%',
                  display: 'block',
                }}
              >
                {currentSurah.name}
              </h2>
              <p className="text-night-400 text-center">
                {currentSurah.englishName} — {currentSurah.englishNameTranslation}
              </p>
            </div>

            {/* Bismillah */}
            {shouldShowBismillah(surahNumber) && (
              <div className="text-center mb-8 py-4 border-y border-night-800/30">
                <p className="bismillah">{BISMILLAH}</p>
              </div>
            )}

            {/* Verses */}
            <div className="space-y-4">
              {currentSurah.ayahs.map((ayah) => {
                const isCurrentVerse = currentAyah === ayah.numberInSurah && isPlaying;
                
                return (
                  <motion.div
                    key={ayah.numberInSurah}
                    ref={(el) => { verseRefs.current[ayah.numberInSurah] = el; }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`verse-card ${isCurrentVerse ? 'active' : ''}`}
                    onClick={() => playAyah(ayah.numberInSurah)}
                  >
                    {/* Arabic Text - Word by Word or Regular */}
                    {wordByWordMode && isCurrentVerse ? (
                      <div className="mb-4">
                        <WordByWord
                          surah={surahNumber}
                          ayah={ayah.numberInSurah}
                          arabicText={cleanAyahText(ayah.text.arabic, surahNumber, ayah.numberInSurah)}
                          reciterId={selectedReciter}
                          isPlaying={isPlaying}
                          audioRef={audioRef}
                          fontSize={fontSize}
                          showWordTranslation={true}
                        />
                      </div>
                    ) : (
                      <p 
                        className="quran-text text-night-100 mb-4"
                        style={{ fontSize }}
                        lang="ar"
                        dir="rtl"
                      >
                        {cleanAyahText(ayah.text.arabic, surahNumber, ayah.numberInSurah)}
                        <span className="verse-number" aria-label={`Verse ${ayah.numberInSurah}`}>{ayah.numberInSurah}</span>
                      </p>
                    )}

                    {/* Translation */}
                    {showTranslation && (
                      <p className="text-night-400 text-sm leading-relaxed border-t border-night-800/30 pt-4">
                        {ayah.text.translations[translationEdition]}
                      </p>
                    )}

                    {/* Verse Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-3 pt-3 border-t border-night-800/20 gap-2">
                      <div className="flex items-center gap-3 text-[10px] sm:text-xs text-night-500">
                        <span>Juz {ayah.juz}</span>
                        <span>Pg {ayah.page}</span>
                        <span>Ruku {ayah.ruku}</span>
                        {ayah.sajda && <span className="text-gold-400">۩ Sajda</span>}
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {/* Practice Tajweed Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTajweedPracticeAyah(ayah.numberInSurah);
                            setShowTajweedPractice(true);
                          }}
                          className="text-xs text-sage-500 hover:text-sage-400 transition-colors flex items-center gap-1 bg-sage-500/10 px-2 py-1 rounded-lg"
                          title="Practice"
                        >
                          <Mic className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Practice</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark({
                              surah: surahNumber,
                              surahName: currentSurah.englishName,
                              surahArabicName: currentSurah.name,
                              ayah: ayah.numberInSurah,
                              text: ayah.text.arabic.slice(0, 100),
                              translation: ayah.text.translations[translationEdition].slice(0, 100),
                            });
                          }}
                          className={`text-xs transition-colors flex items-center gap-1 px-2 py-1 rounded-lg ${
                            isBookmarked(surahNumber, ayah.numberInSurah)
                              ? 'text-gold-400 bg-gold-500/20'
                              : 'text-night-500 hover:text-gold-400 bg-night-800/50'
                          }`}
                          title={isBookmarked(surahNumber, ayah.numberInSurah) ? 'Saved' : 'Save'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked(surahNumber, ayah.numberInSurah) ? 'fill-gold-400' : ''}`} />
                          <span className="hidden sm:inline">{isBookmarked(surahNumber, ayah.numberInSurah) ? 'Saved' : 'Save'}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/memorize/${surahNumber}/${ayah.numberInSurah}`);
                          }}
                          className="text-xs text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-1 bg-gold-500/10 px-2 py-1 rounded-lg"
                          title="Memorize"
                        >
                          <Brain className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Memorize</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setTafsirAyah(ayah.numberInSurah);
                            setShowTafsir(true);
                          }}
                          className="text-xs text-night-500 hover:text-gold-400 transition-colors flex items-center gap-1 bg-night-800/30 px-2 py-1 rounded-lg"
                          title="Tafsir"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Tafsir</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-night-400">Surah not found</p>
          </div>
        )}
      </main>

      {/* Audio Player - Premium Frosted Glass - positioned above BottomNav */}
      <div className="fixed bottom-20 left-2 right-2 z-40 liquid-glass-strong rounded-2xl">
        <div className="px-4 py-3.5 max-w-3xl mx-auto">
          {/* Now Playing */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <span className="text-night-500 text-xs">Now Playing</span>
              <p className="text-night-200 font-medium">
                {currentSurah?.englishName} {surahNumber}:{currentAyah}
                {loopRange && (
                  <span className="text-gold-400 ml-2 text-xs font-normal">
                    (loop {loopRange.start}-{loopRange.end})
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Word-by-word toggle */}
              <button
                onClick={() => setWordByWordMode(!wordByWordMode)}
                className={`text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 min-h-[32px] ${
                  wordByWordMode 
                    ? 'bg-sage-500/15 text-sage-400 border border-sage-500/30' 
                    : 'bg-white/5 text-night-400 border border-white/5 hover:bg-white/10'
                }`}
                title="Word-by-word highlighting"
              >
                <Type className="w-3 h-3" />
                Word
              </button>
              {/* Multi-ayah loop button */}
              <button
                onClick={() => setShowLoopPicker(!showLoopPicker)}
                className={`text-xs px-2.5 py-1.5 rounded-lg transition-all min-h-[32px] ${
                  loopRange 
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30' 
                    : 'bg-white/5 text-night-400 border border-white/5 hover:bg-white/10'
                }`}
              >
                {loopRange ? `${loopRange.start}-${loopRange.end}` : 'Range'}
              </button>
              <button
                onClick={cycleRepeatMode}
                className={`text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center min-h-[32px] ${
                  repeatMode !== 1 
                    ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30' 
                    : 'bg-white/5 text-night-400 border border-white/5 hover:bg-white/10'
                }`}
              >
                <Repeat className="w-3 h-3 mr-1" />
                {repeatMode === 'infinite' ? '∞' : `${repeatMode}x`}
                {repeatMode !== 1 && repeatCount > 0 && (
                  <span className="ml-1 opacity-70">({repeatCount + 1})</span>
                )}
              </button>
            </div>
          </div>
          
          {/* Loop Range Picker */}
          <AnimatePresence>
            {showLoopPicker && currentSurah && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-3"
              >
                <div className="bg-night-900/80 rounded-xl p-3 border border-night-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-night-400 font-medium">Loop Ayah Range</span>
                    {loopRange && (
                      <button
                        onClick={() => setLoopRange(null)}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-night-500 block mb-1">From</label>
                      <select
                        value={loopRange?.start || currentAyah}
                        onChange={(e) => {
                          const start = parseInt(e.target.value);
                          const end = loopRange?.end || Math.min(start + 2, currentSurah.numberOfAyahs);
                          setLoopRange({ start, end: Math.max(start, end) });
                        }}
                        className="w-full bg-night-800 text-night-200 text-sm rounded-lg px-3 py-2 border border-night-700"
                      >
                        {Array.from({ length: currentSurah.numberOfAyahs }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            Ayah {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <span className="text-night-600 mt-4">→</span>
                    <div className="flex-1">
                      <label className="text-xs text-night-500 block mb-1">To</label>
                      <select
                        value={loopRange?.end || Math.min(currentAyah + 2, currentSurah.numberOfAyahs)}
                        onChange={(e) => {
                          const end = parseInt(e.target.value);
                          const start = loopRange?.start || currentAyah;
                          setLoopRange({ start: Math.min(start, end), end });
                        }}
                        className="w-full bg-night-800 text-night-200 text-sm rounded-lg px-3 py-2 border border-night-700"
                      >
                        {Array.from({ length: currentSurah.numberOfAyahs }, (_, i) => i + 1).map((num) => (
                          <option key={num} value={num}>
                            Ayah {num}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        if (!loopRange) {
                          setLoopRange({ 
                            start: currentAyah, 
                            end: Math.min(currentAyah + 2, currentSurah.numberOfAyahs) 
                          });
                        }
                        setShowLoopPicker(false);
                        playAyah(loopRange?.start || currentAyah);
                      }}
                      className="mt-4 px-4 py-2 bg-gold-500 text-night-950 rounded-lg text-sm font-medium hover:bg-gold-400 transition-colors"
                    >
                      Start
                    </button>
                  </div>
                  <p className="text-xs text-night-500 mt-2">
                    Loop a range of ayahs continuously. Each ayah will repeat {repeatMode === 'infinite' ? '∞' : repeatMode}x before moving to the next.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls - Larger touch targets */}
          <div className="flex items-center justify-center gap-3">
            <button 
              onClick={playPrevious} 
              className="liquid-icon-btn !w-12 !h-12"
              aria-label="Previous verse"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-16 h-16 rounded-full flex items-center justify-center transition-all active:scale-95"
              style={{
                background: isPlaying 
                  ? 'linear-gradient(135deg, rgba(201,162,39,1) 0%, rgba(180,140,30,1) 100%)'
                  : 'linear-gradient(135deg, rgba(201,162,39,0.95) 0%, rgba(180,140,30,1) 100%)',
                boxShadow: isPlaying 
                  ? '0 0 32px rgba(201,162,39,0.5), 0 8px 24px rgba(0,0,0,0.3)'
                  : '0 4px 20px rgba(201,162,39,0.35), 0 8px 24px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 text-night-950" />
              ) : (
                <Play className="w-7 h-7 text-night-950 ml-1" />
              )}
            </button>
            
            <button 
              onClick={playNext} 
              className="liquid-icon-btn !w-12 !h-12"
              aria-label="Next verse"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Reciter & Speed */}
          <div className="flex items-center justify-center gap-3 mt-3 text-xs text-night-400">
            <span className="text-night-500">{RECITERS.find(r => r.id === selectedReciter)?.name}</span>
            <span className="text-night-700">•</span>
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                setPlaybackRate(rate);
                if (audioRef.current) audioRef.current.playbackRate = rate;
              }}
              className="bg-white/5 text-night-300 text-xs px-2 py-1 rounded-lg border border-white/5 min-h-[28px]"
            >
              <option value={0.5}>0.5x</option>
              <option value={0.75}>0.75x</option>
              <option value={1}>1x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
            </select>
          </div>
        </div>
      </div>

      {/* Surah List Sheet */}
      <AnimatePresence>
        {showSurahList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-night-950/90 backdrop-blur-sm"
            onClick={() => setShowSurahList(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="sheet max-h-[85vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sheet-handle" />
              
              <div className="flex items-center justify-between px-4 py-3 border-b border-night-800/50">
                <h2 className="font-semibold text-night-100">Select Surah</h2>
                <button onClick={() => setShowSurahList(false)} className="btn-icon">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[70vh] pb-safe">
                {allSurahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => {
                      setSurahNumber(surah.number);
                      setShowSurahList(false);
                    }}
                    className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-night-800/50 transition-colors ${
                      surah.number === surahNumber ? 'bg-gold-500/10' : ''
                    }`}
                  >
                    <span className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${
                      surah.number === surahNumber 
                        ? 'bg-gold-500 text-night-950' 
                        : 'bg-night-800 text-night-400'
                    }`}>
                      {surah.number}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="text-night-100">{surah.englishName}</p>
                      <p className="text-xs text-night-500">
                        {surah.englishNameTranslation} • {surah.numberOfAyahs} verses
                      </p>
                    </div>
                    <p className="quran-text text-gold-400/80 text-lg">{surah.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Sheet */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-night-950/90 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="sheet max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sheet-handle flex-shrink-0" />
              
              <div className="flex items-center justify-between px-4 py-3 border-b border-night-800/50 flex-shrink-0">
                <h2 className="font-semibold text-night-100">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="btn-icon">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-6 overflow-y-auto flex-1 pb-safe">
                {/* Reciter Selection */}
                <div>
                  <label className="text-sm text-night-400 mb-3 block">Reciter</label>
                  <div className="space-y-2">
                    {RECITERS.map((reciter) => (
                      <button
                        key={reciter.id}
                        onClick={() => setSelectedReciter(reciter.id)}
                        className={`reciter-preview w-full ${selectedReciter === reciter.id ? 'selected' : ''}`}
                      >
                        <div className="flex-1 text-left">
                          <p className="text-night-100">{reciter.name}</p>
                          <p className="text-xs text-night-500">{reciter.arabicName} • {reciter.style}</p>
                        </div>
                        {selectedReciter === reciter.id && (
                          <Star className="w-4 h-4 text-gold-400" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Translation */}
                <div>
                  <label className="text-sm text-night-400 mb-3 block">Translation</label>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-night-200">Show Translation</span>
                    <button
                      onClick={() => setShowTranslation(!showTranslation)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        showTranslation ? 'bg-gold-500' : 'bg-night-700'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        showTranslation ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                  {showTranslation && (
                    <select
                      value={translationEdition}
                      onChange={(e) => setTranslationEdition(e.target.value as 'sahih' | 'asad')}
                      className="w-full bg-night-800 text-night-200 rounded-xl px-4 py-3 border border-night-700"
                    >
                      <option value="sahih">Sahih International</option>
                      <option value="asad">Muhammad Asad</option>
                    </select>
                  )}
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-sm text-night-400 mb-3 block">
                    Arabic Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min={20}
                    max={48}
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="quran-text text-center mt-2 text-night-300" style={{ fontSize }}>
                    بِسْمِ اللَّهِ
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <BottomNav />
      
      {/* Quran Search */}
      <QuranSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectResult={(surah, ayah) => {
          setSurahNumber(surah);
          // Scroll to ayah after surah loads
          setTimeout(() => {
            setCurrentAyah(ayah);
            playAyah(ayah);
          }, 100);
        }}
      />
      
      {/* Tafsir Drawer */}
      <TafsirDrawer
        isOpen={showTafsir}
        onClose={() => setShowTafsir(false)}
        surahNumber={surahNumber}
        ayahNumber={tafsirAyah}
      />
      
      {/* Tajweed Practice Modal */}
      <AnimatePresence>
        {showTajweedPractice && currentSurah && (
          <TajweedPractice
            surah={surahNumber}
            ayah={tajweedPracticeAyah}
            arabicText={cleanAyahText(currentSurah.ayahs.find(a => a.numberInSurah === tajweedPracticeAyah)?.text.arabic || '', surahNumber, tajweedPracticeAyah)}
            translation={currentSurah.ayahs.find(a => a.numberInSurah === tajweedPracticeAyah)?.text.translations[translationEdition]}
            audioUrl={getAudioUrl(surahNumber, tajweedPracticeAyah, selectedReciter)}
            onClose={() => setShowTajweedPractice(false)}
          />
        )}
      </AnimatePresence>
      
      {/* AI Sheikh - Ask about the current ayah */}
      {currentSurah && (
        <AskSheikhButton
          ayahContext={{
            surahNumber: surahNumber,
            surahName: currentSurah.englishName,
            surahNameArabic: currentSurah.name,
            ayahNumber: currentAyah,
            arabicText: cleanAyahText(
              currentSurah.ayahs.find(a => a.numberInSurah === currentAyah)?.text.arabic || '', 
              surahNumber, 
              currentAyah
            ),
            translation: currentSurah.ayahs.find(a => a.numberInSurah === currentAyah)?.text.translations[translationEdition] || '',
            juz: currentSurah.ayahs.find(a => a.numberInSurah === currentAyah)?.juz,
          }}
          userLevel="beginner"
        />
      )}
    </div>
  );
}
