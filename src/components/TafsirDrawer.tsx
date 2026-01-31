'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Loader2,
  Sparkles,
  Volume2
} from 'lucide-react';
import { getAyah, getSurah, type Ayah } from '@/lib/quranData';
import { PlayButton } from './AudioPlayer';

interface TafsirDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  surahNumber: number;
  ayahNumber: number;
}

// Placeholder tafsir content - in a real app, this would come from an API
const getTafsirContent = (surah: number, ayah: number): {
  brief: string;
  detailed: string;
  context?: string;
  keyTerms?: { arabic: string; translation: string; explanation: string }[];
} => {
  return {
    brief: "Tafsir content for this ayah will be available in a future update. For now, please reflect on the translation provided.",
    detailed: "We are working on integrating comprehensive tafsir from reputable sources. In the meantime, we recommend studying with a qualified teacher or referring to established tafsir works like:\n\n• Tafsir Ibn Kathir\n• The Study Quran\n• Tafsir Al-Jalalayn\n• Ma'ariful Quran\n\nThese resources provide deep insights into the meanings, context, and lessons of each verse.",
    context: "Understanding the context (asbab al-nuzul) of each verse helps in proper interpretation. Many verses were revealed in response to specific events during the Prophet's ﷺ mission.",
    keyTerms: [
      { arabic: "تدبر", translation: "Tadabbur", explanation: "Deep reflection and contemplation on the meanings of the Quran" },
    ]
  };
};

export default function TafsirDrawer({ isOpen, onClose, surahNumber, ayahNumber }: TafsirDrawerProps) {
  const [ayahData, setAyahData] = useState<Ayah | null>(null);
  const [surahName, setSurahName] = useState('');
  const [showDetailedTafsir, setShowDetailedTafsir] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      const ayah = getAyah(surahNumber, ayahNumber);
      const surah = getSurah(surahNumber);
      setAyahData(ayah || null);
      setSurahName(surah?.englishName || '');
      setShowDetailedTafsir(false);
      setTimeout(() => setLoading(false), 300);
    }
  }, [isOpen, surahNumber, ayahNumber]);
  
  const tafsir = getTafsirContent(surahNumber, ayahNumber);
  
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
                  <h2 className="font-semibold text-night-100 text-lg">Tafsir & Commentary</h2>
                  <p className="text-sm text-night-500">
                    {surahName} {surahNumber}:{ayahNumber}
                  </p>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose} 
                className="liquid-icon-btn"
              >
                <X className="w-5 h-5" />
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
                  
                  {/* Brief Commentary */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 font-semibold">Overview</h3>
                    <div className="liquid-card">
                      <p className="text-night-300 leading-relaxed">
                        {tafsir.brief}
                      </p>
                    </div>
                  </motion.div>
                  
                  {/* Detailed Tafsir Toggle */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="liquid-card-interactive overflow-hidden !p-0"
                  >
                    <button
                      onClick={() => setShowDetailedTafsir(!showDetailedTafsir)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <span className="font-medium text-night-200">Detailed Commentary</span>
                      <motion.div
                        animate={{ rotate: showDetailedTafsir ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="liquid-icon-btn !w-8 !h-8"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {showDetailedTafsir && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 pt-0">
                            <div className="liquid-divider mb-4" />
                            <p className="text-night-400 text-sm leading-relaxed whitespace-pre-line">
                              {tafsir.detailed}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  {/* Context */}
                  {tafsir.context && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 font-semibold">Context</h3>
                      <div 
                        className="rounded-2xl p-4"
                        style={{
                          background: 'linear-gradient(135deg, rgba(134,169,113,0.1) 0%, rgba(134,169,113,0.05) 100%)',
                          border: '1px solid rgba(134,169,113,0.2)',
                        }}
                      >
                        <p className="text-night-300 text-sm leading-relaxed">
                          {tafsir.context}
                        </p>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Key Terms */}
                  {tafsir.keyTerms && tafsir.keyTerms.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h3 className="text-xs uppercase tracking-widest text-night-500 mb-3 font-semibold">Key Terms</h3>
                      <div className="space-y-3">
                        {tafsir.keyTerms.map((term, i) => (
                          <motion.div 
                            key={i}
                            whileHover={{ scale: 1.01 }}
                            className="liquid-card-interactive"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-arabic text-xl text-gold-400">{term.arabic}</span>
                              <span className="text-night-200 font-medium">{term.translation}</span>
                            </div>
                            <p className="text-night-400 text-sm">{term.explanation}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                  
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
