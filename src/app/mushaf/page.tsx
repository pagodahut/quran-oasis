'use client';

import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const GardenOfSurahs = dynamic(() => import('@/components/GardenOfSurahs'), {
  loading: () => <div className="flex items-center justify-center py-20"><div className="animate-pulse text-gold-400">Loading...</div></div>,
});
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  Settings,
  List,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Repeat,
  X,
  Search,
  BookOpen,
  Star,
  Brain,
  Mic,
  Type,
  Layers,
  Compass,
  BookMarked,
  SlidersHorizontal,
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
import VerseContext from '@/components/VerseContext';
import WordByWord from '@/components/WordByWord';
import WordByWordInline from '@/components/WordByWordInline';
import TajweedPractice from '@/components/TajweedPractice';
import { TajweedText, TajweedToggle, TajweedLegend } from '@/components/TajweedHighlighter';
import { useSheikh } from '@/contexts/SheikhContext';
import { useBookmarks } from '@/lib/bookmarks';
import { useReadingPreferences } from '@/hooks/useAppliedPreferences';
import { useQuranScript } from '@/hooks/useQuranScript';
import { usePreferences, ARABIC_FONT_STYLE_OPTIONS } from '@/lib/preferencesStore';
import { QURAN_SCRIPT_OPTIONS, type QuranScript } from '@/lib/quranScripts';

// Spring animation config
const springTransition = { type: 'spring' as const, stiffness: 400, damping: 30 };
const pillSpring = { type: 'spring' as const, stiffness: 500, damping: 35 };

function MushafSearchParamsReader({ onView }: { onView: (v: 'read' | 'explore') => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const v = searchParams.get('view');
    if (v === 'explore') onView('explore');
  }, [searchParams, onView]);
  return null;
}

export default function MushafPage() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<'read' | 'explore'>('read');
  const { toggle: toggleBookmark, check: isBookmarked } = useBookmarks();
  const { setPageContext, setAyahContext } = useSheikh();
  
  const prefs = useReadingPreferences();
  const { preferences, update: updatePrefs } = usePreferences();
  
  const [currentSurah, setCurrentSurah] = useState<Surah | null>(null);
  const [surahNumber, setSurahNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const { getScriptText, isAlternateScript, script: currentScript } = useQuranScript(surahNumber);
  const currentFontStyle = preferences.display.arabicFontStyle;
  const fontOption = ARABIC_FONT_STYLE_OPTIONS.find(f => f.value === currentFontStyle);
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
  
  // Multi-ayah loop
  const [loopRange, setLoopRange] = useState<{ start: number; end: number } | null>(null);
  const [showLoopPicker, setShowLoopPicker] = useState(false);
  
  // UI state
  const [showSurahList, setShowSurahList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);
  const [tafsirAyah, setTafsirAyah] = useState(1);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  
  // Verse action menu
  const [activeVerseMenu, setActiveVerseMenu] = useState<number | null>(null);
  
  // Word-by-word & Tajweed
  const [wordByWordMode, setWordByWordMode] = useState(false);
  const [showTajweedPractice, setShowTajweedPractice] = useState(false);
  const [tajweedPracticeAyah, setTajweedPracticeAyah] = useState(1);
  const [showTajweedColors, setShowTajweedColors] = useState(false);
  const [showTajweedLegend, setShowTajweedLegend] = useState(false);
  
  const getDisplayText = (ayah: Ayah): string => {
    const scriptText = getScriptText(ayah.numberInSurah);
    if (scriptText) return scriptText;
    return cleanAyahText(ayah.text.arabic, surahNumber, ayah.numberInSurah);
  };

  const audioRef = useRef<HTMLAudioElement>(null);
  const verseRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  // Close verse menu on outside click
  useEffect(() => {
    if (activeVerseMenu === null) return;
    const handler = () => setActiveVerseMenu(null);
    const timer = setTimeout(() => document.addEventListener('click', handler), 10);
    return () => { clearTimeout(timer); document.removeEventListener('click', handler); };
  }, [activeVerseMenu]);

  useEffect(() => {
    setSelectedReciter(prefs.reciter);
    setShowTranslation(prefs.showTranslation);
    setTranslationEdition(prefs.translation);
    setFontSize(prefs.arabicFontSize);
    setPlaybackRate(prefs.playbackSpeed);
  }, [prefs]);

  useEffect(() => {
    setLoading(true);
    const surah = getSurah(surahNumber);
    setCurrentSurah(surah || null);
    setCurrentAyah(1);
    setLoading(false);
  }, [surahNumber]);

  useEffect(() => {
    setPageContext({ page: 'mushaf' });
    return () => setAyahContext(undefined);
  }, [setPageContext, setAyahContext]);

  useEffect(() => {
    if (currentSurah) {
      const ayah = currentSurah.ayahs.find(a => a.numberInSurah === currentAyah);
      if (ayah) {
        setAyahContext({
          surahNumber: surahNumber,
          surahName: currentSurah.englishName,
          surahNameArabic: currentSurah.name,
          ayahNumber: currentAyah,
          arabicText: cleanAyahText(ayah.text.arabic, surahNumber, currentAyah),
          translation: ayah.text.translations[translationEdition] || '',
          juz: ayah.juz,
        });
      }
    }
  }, [currentSurah, currentAyah, surahNumber, translationEdition, setAyahContext]);

  // Audio handlers
  const playAyah = useCallback((ayahNum: number) => {
    if (!currentSurah || !audioRef.current) return;
    const url = getAudioUrl(surahNumber, ayahNum, selectedReciter);
    audioRef.current.src = url;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.play();
    setIsPlaying(true);
    setCurrentAyah(ayahNum);
    setRepeatCount(0);
    verseRefs.current[ayahNum]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentSurah, surahNumber, selectedReciter, playbackRate]);

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
    if (repeatMode === 'infinite' || repeatCount + 1 < repeatMode) {
      setRepeatCount(prev => prev + 1);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      return;
    }
    setRepeatCount(0);
    if (loopRange) {
      if (currentAyah < loopRange.end) {
        playAyah(currentAyah + 1);
      } else {
        playAyah(loopRange.start);
      }
      return;
    }
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

  const handleExploreSurahSelect = (surahId: number) => {
    setSurahNumber(surahId);
    setActiveView('read');
  };

  return (
    <div className="min-h-screen">
      <Suspense fallback={null}>
        <MushafSearchParamsReader onView={setActiveView} />
      </Suspense>

      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass rounded-b-2xl mx-2 mt-2">
        <div className="flex items-center justify-between px-3 py-3">
          {/* Left: back + list */}
          <div className="flex items-center gap-1.5">
            <Link href="/" className="liquid-icon-btn">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <button onClick={() => setShowSurahList(true)} className="liquid-icon-btn">
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Center: hero surah name */}
          <button 
            onClick={() => setShowSurahList(true)}
            className="text-center flex-1 mx-3 py-1 px-2 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors"
          >
            {currentSurah && (
              <>
                <h1 className="quran-text text-2xl text-gold-400" style={{ fontFamily: 'var(--font-quran)' }} lang="ar" dir="rtl">{currentSurah.name}</h1>
                <p className="text-xs text-night-400">{currentSurah.englishName} &middot; {currentSurah.numberOfAyahs} verses</p>
              </>
            )}
          </button>

          {/* Right: search + view toggle */}
          <div className="flex items-center gap-1.5">
            <Link href="/recite" className="liquid-icon-btn" aria-label="Recite & Practice">
              <Mic className="w-5 h-5" aria-hidden="true" />
            </Link>
            <button onClick={() => setShowSearch(true)} className="liquid-icon-btn" aria-label="Search Quran">
              <Search className="w-5 h-5" aria-hidden="true" />
            </button>
            <button
              onClick={() => setActiveView(activeView === 'read' ? 'explore' : 'read')}
              className={`liquid-icon-btn ${activeView === 'explore' ? 'active' : ''}`}
              aria-label="Toggle explore view"
            >
              <Compass className="w-5 h-5" />
            </button>
            <button onClick={() => setShowSettings(true)} className="liquid-icon-btn">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Surah nav chevrons (Read mode only) */}
        {activeView === 'read' && (
          <div className="flex items-center justify-between px-4 pb-2.5">
            <button
              onClick={() => surahNumber > 1 && setSurahNumber(surahNumber - 1)}
              disabled={surahNumber === 1}
              className="liquid-icon-btn !w-9 !h-9 !min-w-[36px] !min-h-[36px] disabled:opacity-20"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-night-500 text-xs">
              {currentSurah && <>Surah {surahNumber} &middot; {currentSurah.revelationType}</>}
            </span>
            <button
              onClick={() => surahNumber < 114 && setSurahNumber(surahNumber + 1)}
              disabled={surahNumber === 114}
              className="liquid-icon-btn !w-9 !h-9 !min-w-[36px] !min-h-[36px] disabled:opacity-20"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* ── Explore View ── */}
      <AnimatePresence mode="wait">
        {activeView === 'explore' && (
          <motion.div
            key="explore"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <GardenOfSurahs
              onSelectSurah={handleExploreSurahSelect}
              showHeader={true}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Read View ── */}
      {activeView === 'read' && <main className="pb-56">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-gold-400">Loading...</div>
          </div>
        ) : currentSurah ? (
          <div className="px-4 py-6 max-w-3xl mx-auto">
            {/* Surah Header */}
            <div className="text-center mb-10">
              <h2 className="surah-header" style={{ direction: 'rtl', textAlign: 'center', width: '100%', display: 'block' }}>
                {currentSurah.name}
              </h2>
              <p className="text-night-400 text-center text-sm">
                {currentSurah.englishName} &mdash; {currentSurah.englishNameTranslation}
              </p>
            </div>

            {/* Bismillah */}
            {shouldShowBismillah(surahNumber) && (
              <div className="text-center mb-10 py-5">
                <div className="liquid-divider-gold mb-5" />
                <p className="bismillah">{BISMILLAH}</p>
                <div className="liquid-divider-gold mt-5" />
              </div>
            )}

            {/* Verses */}
            <div className="space-y-6">
              {currentSurah.ayahs.map((ayah) => {
                const isCurrentVerse = currentAyah === ayah.numberInSurah && isPlaying;
                const isMenuOpen = activeVerseMenu === ayah.numberInSurah;
                
                return (
                  <motion.div
                    key={ayah.numberInSurah}
                    ref={(el) => { verseRefs.current[ayah.numberInSurah] = el; }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`verse-card relative ${isCurrentVerse ? 'active' : ''}`}
                    style={{ padding: '1.5rem' }}
                    onClick={() => playAyah(ayah.numberInSurah)}
                  >
                    {/* Arabic Text */}
                    {wordByWordMode ? (
                      <div className="mb-4">
                        {isCurrentVerse ? (
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
                        ) : (
                          <WordByWordInline
                            surah={surahNumber}
                            ayah={ayah.numberInSurah}
                            showTransliteration={true}
                          />
                        )}
                      </div>
                    ) : (
                      <p 
                        className="quran-text text-night-100 mb-4"
                        style={{ fontSize, fontFamily: fontOption?.fontFamily || 'var(--font-arabic)' }}
                        lang="ar"
                        dir="rtl"
                      >
                        <TajweedText
                          text={getDisplayText(ayah)}
                          enabled={showTajweedColors && !isAlternateScript}
                          className="quran-text"
                        />
                        <span className="verse-number" aria-label={`Verse ${ayah.numberInSurah}`}>{ayah.numberInSurah}</span>
                      </p>
                    )}

                    {/* Translation */}
                    {showTranslation && (
                      <p className="text-night-400 text-sm leading-relaxed mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        {ayah.text.translations[translationEdition]}
                      </p>
                    )}

                    {/* Minimal verse footer: number + bookmark + actions trigger */}
                    <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                      <div className="flex items-center gap-2 text-[10px] text-night-500">
                        <span>Juz {ayah.juz}</span>
                        <span className="text-night-700">&middot;</span>
                        <span>Pg {ayah.page}</span>
                        {ayah.sajda && <span className="text-gold-400 flex items-center gap-0.5"><Star className="w-3 h-3" /> Sajda</span>}
                      </div>
                      
                      <div className="flex items-center gap-1.5 relative">
                        {/* Bookmark (always visible) */}
                        <motion.button
                          whileTap={{ scale: 1.15 }}
                          transition={springTransition}
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
                          className="liquid-icon-btn !w-9 !h-9 !min-w-[36px] !min-h-[36px]"
                          style={isBookmarked(surahNumber, ayah.numberInSurah) ? {
                            background: 'linear-gradient(135deg, rgba(201,162,39,0.15), rgba(201,162,39,0.08))',
                            borderColor: 'rgba(201,162,39,0.2)',
                          } : {}}
                          aria-label={isBookmarked(surahNumber, ayah.numberInSurah) ? 'Remove bookmark' : 'Add bookmark'}
                        >
                          <Bookmark className={`w-4 h-4 ${isBookmarked(surahNumber, ayah.numberInSurah) ? 'text-gold-400 fill-gold-400' : ''}`} />
                        </motion.button>

                        {/* More actions trigger */}
                        <motion.button
                          whileTap={{ scale: 1.1 }}
                          transition={springTransition}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveVerseMenu(isMenuOpen ? null : ayah.numberInSurah);
                          }}
                          className={`liquid-icon-btn !w-9 !h-9 !min-w-[36px] !min-h-[36px] ${isMenuOpen ? 'active' : ''}`}
                          aria-label="Verse actions"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </motion.button>

                        {/* Floating pill action menu */}
                        <AnimatePresence>
                          {isMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.85, y: 8 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.85, y: 8 }}
                              transition={pillSpring}
                              className="absolute bottom-full right-0 mb-2 z-30"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div
                                className="flex items-center gap-1 px-2 py-1.5 rounded-2xl"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(28,33,40,0.95), rgba(22,27,34,0.98))',
                                  backdropFilter: 'blur(24px) saturate(180%)',
                                  WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2)',
                                }}
                              >
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setTajweedPracticeAyah(ayah.numberInSurah);
                                    setShowTajweedPractice(true);
                                    setActiveVerseMenu(null);
                                  }}
                                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                                  title="Practice"
                                >
                                  <Mic className="w-4 h-4 text-sage-400" />
                                  <span className="text-[10px] text-night-400">Practice</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    router.push(`/memorize/${surahNumber}/${ayah.numberInSurah}`);
                                    setActiveVerseMenu(null);
                                  }}
                                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                                  title="Memorize"
                                >
                                  <Brain className="w-4 h-4 text-gold-400" />
                                  <span className="text-[10px] text-night-400">Memorize</span>
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => {
                                    setTafsirAyah(ayah.numberInSurah);
                                    setShowTafsir(true);
                                    setActiveVerseMenu(null);
                                  }}
                                  className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
                                  title="Tafsir"
                                >
                                  <BookOpen className="w-4 h-4 text-night-300" />
                                  <span className="text-[10px] text-night-400">Tafsir</span>
                                </motion.button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    
                    {/* Verse Context (progressive disclosure — only shown on active verse) */}
                    {isCurrentVerse && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        className="mt-3 overflow-hidden" 
                        onClick={(e) => e.stopPropagation()}
                      >
                        <VerseContext surahNumber={surahNumber} ayahNumber={ayah.numberInSurah} compact />
                      </motion.div>
                    )}
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
      </main>}

      {/* Tajweed Legend */}
      {activeView === 'read' && showTajweedColors && (
        <div className="fixed bottom-44 left-4 right-4 z-50">
          <TajweedLegend show={showTajweedLegend} onClose={() => setShowTajweedLegend(false)} />
        </div>
      )}

      {/* ── Audio Player — slim liquid-glass bar ── */}
      {activeView === 'read' && (
        <div className="fixed bottom-20 left-2 right-2 z-40">
          <div
            className="rounded-2xl max-w-3xl mx-auto overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, rgba(28,33,40,0.92), rgba(22,27,34,0.96))',
              backdropFilter: 'blur(48px) saturate(180%)',
              WebkitBackdropFilter: 'blur(48px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15), 0 12px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Main slim bar */}
            <div className="flex items-center gap-3 px-4 py-2.5">
              {/* Info: ayah + reciter */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-night-200 font-medium truncate">
                  {currentSurah?.englishName} {surahNumber}:{currentAyah}
                  {loopRange && <span className="text-gold-400 text-xs ml-1.5">({loopRange.start}-{loopRange.end})</span>}
                </p>
                <p className="text-[11px] text-night-500 truncate">{RECITERS.find(r => r.id === selectedReciter)?.name}</p>
              </div>

              {/* Transport: prev / play / next */}
              <div className="flex items-center gap-2">
                <button onClick={playPrevious} className="liquid-icon-btn !w-9 !h-9 !min-w-[36px] !min-h-[36px]" aria-label="Previous verse">
                  <SkipBack className="w-4 h-4" />
                </button>
                
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  transition={springTransition}
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,1), rgba(180,140,30,1))',
                    boxShadow: isPlaying
                      ? '0 0 24px rgba(201,162,39,0.5), 0 4px 16px rgba(0,0,0,0.3)'
                      : '0 2px 12px rgba(201,162,39,0.35), 0 4px 16px rgba(0,0,0,0.2)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-night-950" />
                  ) : (
                    <Play className="w-5 h-5 text-night-950 ml-0.5" />
                  )}
                </motion.button>
                
                <button onClick={playNext} className="liquid-icon-btn !w-9 !h-9 !min-w-[36px] !min-h-[36px]" aria-label="Next verse">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>

              {/* Settings gear — expand advanced controls */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowAudioSettings(!showAudioSettings)}
                className={`liquid-icon-btn !w-9 !h-9 !min-w-[36px] !min-h-[36px] ${showAudioSettings ? 'active' : ''}`}
                aria-label="Audio settings"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Expandable advanced controls */}
            <AnimatePresence>
              {showAudioSettings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-3 pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {/* Word-by-word */}
                      <button
                        onClick={() => setWordByWordMode(!wordByWordMode)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 min-h-[32px] ${
                          wordByWordMode 
                            ? 'bg-sage-500/15 text-sage-400 border border-sage-500/30' 
                            : 'bg-white/5 text-night-400 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Type className="w-3 h-3" />
                        Word
                      </button>
                      {/* Tajweed */}
                      <TajweedToggle
                        enabled={showTajweedColors}
                        onToggle={() => {
                          setShowTajweedColors(!showTajweedColors);
                          if (!showTajweedColors) setShowTajweedLegend(true);
                        }}
                      />
                      {/* Range */}
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
                      {/* Repeat */}
                      <button
                        onClick={cycleRepeatMode}
                        className={`text-xs px-2.5 py-1.5 rounded-lg transition-all flex items-center min-h-[32px] ${
                          repeatMode !== 1 
                            ? 'bg-gold-500/15 text-gold-400 border border-gold-500/30' 
                            : 'bg-white/5 text-night-400 border border-white/5 hover:bg-white/10'
                        }`}
                      >
                        <Repeat className="w-3 h-3 mr-1" />
                        {repeatMode === 'infinite' ? '\u221E' : `${repeatMode}x`}
                        {repeatMode !== 1 && repeatCount > 0 && <span className="ml-1 opacity-70">({repeatCount + 1})</span>}
                      </button>
                      {/* Speed */}
                      <select
                        value={playbackRate}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value);
                          setPlaybackRate(rate);
                          if (audioRef.current) audioRef.current.playbackRate = rate;
                        }}
                        className="bg-white/5 text-night-300 text-xs px-2 py-1.5 rounded-lg border border-white/5 min-h-[32px]"
                      >
                        <option value={0.5}>0.5x</option>
                        <option value={0.75}>0.75x</option>
                        <option value={1}>1x</option>
                        <option value={1.25}>1.25x</option>
                        <option value={1.5}>1.5x</option>
                      </select>
                    </div>

                    {/* Loop Range Picker */}
                    <AnimatePresence>
                      {showLoopPicker && currentSurah && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden mt-3"
                        >
                          <div className="bg-night-900/80 rounded-xl p-3 border border-night-800">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-night-400 font-medium">Loop Ayah Range</span>
                              {loopRange && (
                                <button onClick={() => setLoopRange(null)} className="text-xs text-red-400 hover:text-red-300">Clear</button>
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
                                    <option key={num} value={num}>Ayah {num}</option>
                                  ))}
                                </select>
                              </div>
                              <span className="text-night-600 mt-4">&rarr;</span>
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
                                    <option key={num} value={num}>Ayah {num}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                onClick={() => {
                                  if (!loopRange) {
                                    setLoopRange({ start: currentAyah, end: Math.min(currentAyah + 2, currentSurah.numberOfAyahs) });
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
                              Loop a range of ayahs continuously. Each ayah repeats {repeatMode === 'infinite' ? '\u221E' : repeatMode}x before advancing.
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ── Surah List Sheet ── */}
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
                <button onClick={() => setShowSurahList(false)} className="btn-icon"><X className="w-5 h-5" /></button>
              </div>
              <div className="overflow-y-auto max-h-[70vh] pb-safe">
                {allSurahs.map((surah) => (
                  <button
                    key={surah.number}
                    onClick={() => { setSurahNumber(surah.number); setShowSurahList(false); }}
                    className={`w-full flex items-center gap-4 px-4 py-3 hover:bg-night-800/50 transition-colors ${surah.number === surahNumber ? 'bg-gold-500/10' : ''}`}
                  >
                    <span className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium ${surah.number === surahNumber ? 'bg-gold-500 text-night-950' : 'bg-night-800 text-night-400'}`}>
                      {surah.number}
                    </span>
                    <div className="flex-1 text-left">
                      <p className="text-night-100">{surah.englishName}</p>
                      <p className="text-xs text-night-500">{surah.englishNameTranslation} &middot; {surah.numberOfAyahs} verses</p>
                    </div>
                    <p className="quran-text text-gold-400/80 text-lg">{surah.name}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Settings Sheet ── */}
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
                <h2 className="font-semibold text-night-100">Mushaf Settings</h2>
                <button onClick={() => setShowSettings(false)} className="btn-icon"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4 space-y-6 overflow-y-auto flex-1 pb-safe">
                {/* Reciter */}
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
                          <p className="text-xs text-night-500">{reciter.arabicName} &middot; {reciter.style}</p>
                        </div>
                        {selectedReciter === reciter.id && <Star className="w-4 h-4 text-gold-400" />}
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
                      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                        showTranslation ? 'bg-gold-500/80 shadow-[0_0_12px_rgba(201,162,39,0.3)]' : 'bg-white/10 backdrop-blur-md border border-white/10'
                      }`}
                    >
                      <div className={`absolute top-1 w-6 h-6 rounded-full shadow-md transition-all duration-300 ${showTranslation ? 'left-7 bg-white' : 'left-1 bg-night-300'}`} />
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

                {/* Script Style */}
                <div>
                  <label className="text-sm text-night-400 mb-3 block flex items-center gap-2">
                    <Layers className="w-4 h-4" /> Script Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {QURAN_SCRIPT_OPTIONS.map((scriptOpt) => {
                      const isSelected = currentScript === scriptOpt.value;
                      return (
                        <motion.button
                          key={scriptOpt.value}
                          onClick={() => updatePrefs('display', { quranScript: scriptOpt.value })}
                          className={`relative p-4 rounded-2xl text-left transition-all ${isSelected ? 'bg-gold-500/15 border-2 border-gold-500/40 shadow-[0_0_20px_rgba(201,162,39,0.15)]' : 'bg-white/[0.03] border-2 border-white/[0.06] hover:border-white/10'}`}
                          whileTap={{ scale: 0.97 }}
                        >
                          {isSelected && (
                            <motion.div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}>
                              <svg className="w-3 h-3 text-night-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </motion.div>
                          )}
                          <p className={`text-sm font-medium mb-1 ${isSelected ? 'text-gold-400' : 'text-night-200'}`}>{scriptOpt.label}</p>
                          <p className="text-[10px] text-night-500 mb-3 leading-tight">{scriptOpt.description}</p>
                          <p className="text-lg leading-relaxed" style={{ fontFamily: scriptOpt.value === 'indopak' ? 'var(--font-indopak)' : 'var(--font-arabic)', color: isSelected ? 'rgb(201,162,39)' : 'rgb(180,180,190)' }} dir="rtl" lang="ar">{scriptOpt.arabicSample}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Style */}
                <div>
                  <label className="text-sm text-night-400 mb-3 block flex items-center gap-2">
                    <Type className="w-4 h-4" /> Font Style
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {ARABIC_FONT_STYLE_OPTIONS.map((font) => {
                      const isSelected = currentFontStyle === font.value;
                      return (
                        <motion.button
                          key={font.value}
                          onClick={() => updatePrefs('display', { arabicFontStyle: font.value, ...(font.value === 'indopak' ? { quranScript: 'indopak' as QuranScript } : {}) })}
                          className={`relative p-3 rounded-2xl text-left transition-all ${isSelected ? 'bg-gold-500/15 border-2 border-gold-500/40' : 'bg-white/[0.03] border-2 border-white/[0.06] hover:border-white/10'}`}
                          whileTap={{ scale: 0.97 }}
                        >
                          <p className={`text-xs font-medium mb-1 ${isSelected ? 'text-gold-400' : 'text-night-300'}`}>{font.label}</p>
                          <p className="text-base" style={{ fontFamily: font.fontFamily, color: isSelected ? 'rgb(201,162,39)' : 'rgb(160,160,170)' }} dir="rtl" lang="ar">{font.arabicSample}</p>
                          <p className="text-[10px] text-night-600 mt-1">{font.description}</p>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-sm text-night-400 mb-3 block">Arabic Font Size: {fontSize}px</label>
                  <input type="range" min={20} max={48} value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value))} className="w-full" />
                  <p className="quran-text text-center mt-2 text-night-300" style={{ fontSize }} dir="rtl" lang="ar">بِسْمِ اللَّهِ</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <BottomNav />
      
      <QuranSearch
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectResult={(surah, ayah) => {
          setSurahNumber(surah);
          setTimeout(() => { setCurrentAyah(ayah); playAyah(ayah); }, 100);
        }}
      />
      
      <TafsirDrawer isOpen={showTafsir} onClose={() => setShowTafsir(false)} surahNumber={surahNumber} ayahNumber={tafsirAyah} />
      
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
    </div>
  );
}
