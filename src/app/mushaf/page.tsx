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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { 
  getSurah, 
  getAllSurahs, 
  getAudioUrl, 
  RECITERS,
  BISMILLAH,
  shouldShowBismillah,
  type Surah,
  type Ayah
} from '@/lib/quranData';
import BottomNav from '@/components/BottomNav';
import QuranSearch from '@/components/QuranSearch';
import TafsirDrawer from '@/components/TafsirDrawer';

export default function MushafPage() {
  const router = useRouter();
  
  // State
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [surahNumber, setSurahNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedReciter, setSelectedReciter] = useState('alafasy');
  const [showTranslation, setShowTranslation] = useState(true);
  const [translationEdition, setTranslationEdition] = useState<'sahih' | 'asad'>('sahih');
  const [fontSize, setFontSize] = useState(28);
  
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
  
  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

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

      {/* Header */}
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="btn-icon">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <button onClick={() => setShowSurahList(true)} className="btn-icon">
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Surah Title */}
          <button 
            onClick={() => setShowSurahList(true)}
            className="text-center flex-1 mx-4"
          >
            {currentSurah && (
              <>
                <h1 className="quran-text text-xl text-gold-400">{currentSurah.name}</h1>
                <p className="text-xs text-night-400">{currentSurah.englishName}</p>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowSearch(true)} className="btn-icon">
              <Search className="w-5 h-5" />
            </button>
            <button className="btn-icon">
              <Bookmark className="w-5 h-5" />
            </button>
            <button onClick={() => setShowSettings(true)} className="btn-icon">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-night-800/30 text-sm">
          <button
            onClick={() => surahNumber > 1 && setSurahNumber(surahNumber - 1)}
            disabled={surahNumber === 1}
            className="flex items-center gap-1 text-night-400 disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          
          <span className="text-night-500">
            {currentSurah && (
              <>Surah {surahNumber} • {currentSurah.numberOfAyahs} verses • {currentSurah.revelationType}</>
            )}
          </span>
          
          <button
            onClick={() => surahNumber < 114 && setSurahNumber(surahNumber + 1)}
            disabled={surahNumber === 114}
            className="flex items-center gap-1 text-night-400 disabled:opacity-30"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mushaf Content */}
      <main className="pb-48">
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
              {currentSurah.ayahs.map((ayah) => (
                <motion.div
                  key={ayah.numberInSurah}
                  ref={(el) => { verseRefs.current[ayah.numberInSurah] = el; }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`verse-card ${currentAyah === ayah.numberInSurah && isPlaying ? 'active' : ''}`}
                  onClick={() => playAyah(ayah.numberInSurah)}
                >
                  {/* Arabic Text */}
                  <p 
                    className="quran-text text-night-100 mb-4"
                    style={{ fontSize }}
                  >
                    {ayah.text.arabic}
                    <span className="verse-number">{ayah.numberInSurah}</span>
                  </p>

                  {/* Translation */}
                  {showTranslation && (
                    <p className="text-night-400 text-sm leading-relaxed border-t border-night-800/30 pt-4">
                      {ayah.text.translations[translationEdition]}
                    </p>
                  )}

                  {/* Verse Meta */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-night-800/20">
                    <div className="flex items-center gap-4 text-xs text-night-500">
                      <span>Juz {ayah.juz}</span>
                      <span>Page {ayah.page}</span>
                      <span>Ruku {ayah.ruku}</span>
                      {ayah.sajda && <span className="text-gold-400">۩ Sajda</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/memorize/${surahNumber}/${ayah.numberInSurah}`);
                        }}
                        className="text-xs text-gold-500 hover:text-gold-400 transition-colors flex items-center gap-1 bg-gold-500/10 px-2 py-1 rounded-lg"
                      >
                        <Brain className="w-3.5 h-3.5" />
                        Memorize
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTafsirAyah(ayah.numberInSurah);
                          setShowTafsir(true);
                        }}
                        className="text-xs text-night-500 hover:text-gold-400 transition-colors flex items-center gap-1"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Tafsir
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-20">
            <p className="text-night-400">Surah not found</p>
          </div>
        )}
      </main>

      {/* Audio Player - positioned above BottomNav */}
      <div className="fixed bottom-16 left-0 right-0 liquid-glass z-40">
        <div className="px-4 py-3 max-w-3xl mx-auto">
          {/* Now Playing */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm">
              <span className="text-night-400">Playing:</span>
              <span className="text-night-200 ml-2">
                {currentSurah?.englishName} {surahNumber}:{currentAyah}
              </span>
              {loopRange && (
                <span className="text-gold-400 ml-2 text-xs">
                  (loop {loopRange.start}-{loopRange.end})
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {/* Multi-ayah loop button */}
              <button
                onClick={() => setShowLoopPicker(!showLoopPicker)}
                className={`text-xs px-2 py-1 rounded-lg transition-colors ${
                  loopRange 
                    ? 'bg-gold-500/20 text-gold-400 border border-gold-500/50' 
                    : 'bg-night-800 text-night-400 hover:bg-night-700'
                }`}
              >
                {loopRange ? `${loopRange.start}-${loopRange.end}` : 'Range'}
              </button>
              <button
                onClick={cycleRepeatMode}
                className={`repeat-badge ${repeatMode !== 1 ? 'active' : ''}`}
              >
                <Repeat className="w-3 h-3 inline mr-1" />
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

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={playPrevious} className="btn-icon">
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gold-500 hover:bg-gold-400 flex items-center justify-center transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-night-950" />
              ) : (
                <Play className="w-6 h-6 text-night-950 ml-1" />
              )}
            </button>
            
            <button onClick={playNext} className="btn-icon">
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Reciter & Speed */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-night-400">
            <span>{RECITERS.find(r => r.id === selectedReciter)?.name}</span>
            <span>•</span>
            <select
              value={playbackRate}
              onChange={(e) => {
                const rate = parseFloat(e.target.value);
                setPlaybackRate(rate);
                if (audioRef.current) audioRef.current.playbackRate = rate;
              }}
              className="bg-transparent text-night-400 text-xs"
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
              className="sheet max-h-[70vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sheet-handle" />
              
              <div className="flex items-center justify-between px-4 py-3 border-b border-night-800/50">
                <h2 className="font-semibold text-night-100">Settings</h2>
                <button onClick={() => setShowSettings(false)} className="btn-icon">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-6 overflow-y-auto">
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
    </div>
  );
}
