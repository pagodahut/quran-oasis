'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Sparkles,
  Volume2,
  RefreshCw
} from 'lucide-react';
import { getAyah, getSurah, type Ayah } from '@/lib/quranData';
import { PlayButton } from './AudioPlayer';
import { 
  fetchTafsir, 
  AVAILABLE_TAFSIRS, 
  getReflectionPrompts,
  type TafsirContent 
} from '@/lib/tafsirService';

interface TafsirDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayahNumber: number;
}

export default function TafsirDrawer({ isOpen, onClose, surahNumber, ayahNumber }: TafsirDrawerProps) {
  const [ayahData, setAyahData] = useState<Ayah | null>(null);
  const [surahName, setSurahName] = useState('');
  const [showDetailedTafsir, setShowDetailedTafsir] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tafsirContent, setTafsirContent] = useState<TafsirContent | null>(null);
  const [tafsirLoading, setTafsirLoading] = useState(false);
  const [selectedTafsir, setSelectedTafsir] = useState(169); // Default to Ibn Kathir
  const [reflectionPrompts] = useState(() => getReflectionPrompts(surahNumber, ayahNumber));
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  
  // Handle escape key to close drawer
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);
  
  // Focus management and escape key
  useEffect(() => {
    if (isOpen) {
      // Add escape key listener
      document.addEventListener('keydown', handleKeyDown);
      
      // Focus the close button when drawer opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);
  
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const ayah = getAyah(surahNumber, ayahNumber);
      const surah = getSurah(surahNumber);
      setAyahData(ayah || null);
      setSurahName(surah?.englishName || '');
      setShowDetailedTafsir(false);
      setLoading(false);
      
      // Fetch tafsir
      loadTafsir(selectedTafsir);
    }
  }, [isOpen, surahNumber, ayahNumber]);
  
  const loadTafsir = async (tafsirId: number) => {
    setTafsirLoading(true);
    const content = await fetchTafsir(surahNumber, ayahNumber, tafsirId);
    setTafsirContent(content);
    setTafsirLoading(false);
  };
  
  const handleTafsirChange = (tafsirId: number) => {
    setSelectedTafsir(tafsirId);
    loadTafsir(tafsirId);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(10, 10, 15, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={onClose}
          />
          
          {/* Drawer - Liquid Glass Modal */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 overflow-hidden flex flex-col"
            style={{
              background: 'linear-gradient(180deg, rgba(20, 20, 25, 0.97) 0%, rgba(15, 15, 20, 0.99) 100%)',
              backdropFilter: 'blur(40px) saturate(200%)',
              WebkitBackdropFilter: 'blur(40px) saturate(200%)',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '-24px 0 80px rgba(0, 0, 0, 0.5)',
            }}
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tafsir-drawer-title"
          >
            {/* Top Glow Effect */}
            <div 
              className="absolute top-0 left-0 right-0 h-40 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.08) 0%, transparent 70%)',
              }}
            />

            {/* Header - Liquid Glass */}
            <div 
              className="relative flex items-center justify-between p-5 safe-area-top"
              style={{
                background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(201,162,39,0.2) 0%, rgba(201,162,39,0.1) 100%)',
                    border: '1px solid rgba(201,162,39,0.2)',
                    boxShadow: '0 4px 16px rgba(201,162,39,0.15)',
                  }}
                >
                  <BookOpen className="w-5 h-5 text-gold-400" />
                </motion.div>
                <div>
                  <h2 id="tafsir-drawer-title" className="font-semibold text-night-100 text-lg">Tafsir & Commentary</h2>
                  <p className="text-sm text-night-500">
                    {surahName} {surahNumber}:{ayahNumber}
                  </p>
                </div>
              </div>
              
              <motion.button 
                ref={closeButtonRef}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose} 
                className="liquid-icon-btn focus-visible-ring"
                aria-label="Close tafsir drawer"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            </div>
            
            {/* Content */}
            <div className="relative flex-1 overflow-y-auto p-5 pb-safe">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 className="w-8 h-8 text-gold-400" />
                  </motion.div>
                </div>
              ) : ayahData ? (
                <div className="space-y-6">
                  {/* Ayah Display Card - Main Glass Panel */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="liquid-glass-gold rounded-2xl p-6 relative overflow-hidden"
                  >
                    {/* Decorative sparkle */}
                    <Sparkles className="absolute top-4 right-4 w-4 h-4 text-gold-500/30" />
                    
                    <p 
                      className="font-arabic text-2xl text-night-100 leading-[2.5] mb-5"
                      style={{ direction: 'rtl' }}
                      lang="ar"
                      dir="rtl"
                    >
                      {ayahData.text.arabic}
                    </p>
                    
                    {/* Play button */}
                    <div className="flex items-center gap-3 mb-4">
                      <PlayButton surah={surahNumber} ayah={ayahNumber} size="md" />
                      <span className="text-sm text-night-500">Listen to recitation</span>
                    </div>
                    
                    <div className="liquid-divider mb-4" />
                    
                    <p className="text-night-300 text-sm leading-relaxed">
                      {ayahData.text.translations.sahih}
                    </p>
                  </motion.div>
                  
                  {/* Tafsir Source Selector */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 font-semibold">Tafsir Source</h3>
                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_TAFSIRS.map((tafsir) => (
                        <button
                          key={tafsir.id}
                          onClick={() => handleTafsirChange(tafsir.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                            selectedTafsir === tafsir.id
                              ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                              : 'bg-night-800/50 text-night-400 border border-night-700/50 hover:bg-night-800'
                          }`}
                        >
                          {tafsir.authorName.split(' ').pop()}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                  
                  {/* Tafsir Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs uppercase tracking-widest text-night-500 font-semibold">Commentary</h3>
                      {tafsirLoading && (
                        <RefreshCw className="w-4 h-4 text-gold-400 animate-spin" />
                      )}
                    </div>
                    <div className="liquid-card">
                      {tafsirLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
                        </div>
                      ) : tafsirContent ? (
                        <div>
                          <p className="text-xs text-gold-400/70 mb-3">{tafsirContent.resourceName}</p>
                          <p className="text-night-300 leading-relaxed text-sm whitespace-pre-line">
                            {tafsirContent.text.length > 500 && !showDetailedTafsir
                              ? tafsirContent.text.slice(0, 500) + '...'
                              : tafsirContent.text
                            }
                          </p>
                          {tafsirContent.text.length > 500 && (
                            <button
                              onClick={() => setShowDetailedTafsir(!showDetailedTafsir)}
                              className="mt-3 text-gold-400 text-sm flex items-center gap-1 hover:text-gold-300"
                            >
                              {showDetailedTafsir ? 'Show less' : 'Read more'}
                              <ChevronDown className={`w-4 h-4 transition-transform ${showDetailedTafsir ? 'rotate-180' : ''}`} />
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-night-500 text-sm">
                          Unable to load tafsir. Please check your connection and try again.
                        </p>
                      )}
                    </div>
                  </motion.div>
                  
                  {/* Reflection Prompts */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 font-semibold">Reflect (Tadabbur)</h3>
                    <div 
                      className="rounded-2xl p-4"
                      style={{
                        background: 'linear-gradient(135deg, rgba(134,169,113,0.1) 0%, rgba(134,169,113,0.05) 100%)',
                        border: '1px solid rgba(134,169,113,0.2)',
                      }}
                    >
                      <ul className="space-y-2">
                        {reflectionPrompts.slice(0, 3).map((prompt, i) => (
                          <li key={i} className="text-night-300 text-sm flex items-start gap-2">
                            <span className="text-sage-400 mt-0.5">•</span>
                            {prompt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                  
                  {/* Verse Metadata */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="liquid-glass-subtle rounded-2xl p-4"
                  >
                    <h3 className="text-xs uppercase tracking-widest text-night-500 mb-4 font-semibold">Verse Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        { label: 'Juz', value: ayahData.juz },
                        { label: 'Page', value: ayahData.page },
                        { label: 'Ruku', value: ayahData.ruku },
                        { label: 'Hizb Quarter', value: ayahData.hizbQuarter },
                      ].map((item) => (
                        <div key={item.label} className="flex justify-between items-center">
                          <span className="text-night-500">{item.label}</span>
                          <span className="text-night-200 font-medium liquid-badge !py-0.5 !px-2">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    {ayahData.sajda && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <span className="text-gold-400 text-sm flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          This verse contains a Sajda (prostration)
                        </span>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* External Resources */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 font-semibold">Learn More</h3>
                    <div className="space-y-2">
                      {[
                        { href: `https://quran.com/${surahNumber}/${ayahNumber}`, label: 'View on Quran.com' },
                        { href: `https://corpus.quran.com/translation.jsp?chapter=${surahNumber}&verse=${ayahNumber}`, label: 'Word-by-Word Analysis' },
                      ].map((link) => (
                        <motion.a 
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.01, x: 4 }}
                          className="flex items-center justify-between p-4 liquid-card-interactive group"
                        >
                          <span className="text-night-300 text-sm group-hover:text-night-100 transition-colors">
                            {link.label}
                          </span>
                          <ExternalLink className="w-4 h-4 text-night-500 group-hover:text-gold-400 transition-colors" />
                        </motion.a>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="liquid-glass-subtle inline-block px-6 py-4 rounded-2xl">
                    <p className="text-night-400">Unable to load verse data</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
