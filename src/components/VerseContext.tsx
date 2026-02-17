'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Scroll,
  Globe,
  Link2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
  ExternalLink,
  Bookmark,
  BookmarkPlus,
  X,
  Heart,
} from 'lucide-react';
import {
  getVerseContext,
  getReflectionCard,
  getTranslation,
  type VerseContextData,
  type ReflectionCard,
} from '@/lib/tafsir';
import { addBookmark, isBookmarked } from '@/lib/bookmarks';
import { getSurahMeta } from '@/lib/surahMetadata';

// ─── Types ───────────────────────────────────────────────────────────

type TabId = 'meaning' | 'tafsir' | 'revelation' | 'connections';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'meaning', label: 'Meaning', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'tafsir', label: 'Tafsir', icon: <Scroll className="w-4 h-4" /> },
  { id: 'revelation', label: 'Context', icon: <Globe className="w-4 h-4" /> },
  { id: 'connections', label: 'Connected', icon: <Link2 className="w-4 h-4" /> },
];

// ─── Props ───────────────────────────────────────────────────────────

interface VerseContextProps {
  surahNumber: number;
  ayahNumber: number;
  /** Start expanded or collapsed */
  defaultExpanded?: boolean;
  /** Inline mode (no collapse toggle) */
  inline?: boolean;
  /** Compact mode for memorization flow */
  compact?: boolean;
  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────

export default function VerseContext({
  surahNumber,
  ayahNumber,
  defaultExpanded = false,
  inline = false,
  compact = false,
  className = '',
}: VerseContextProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || inline);
  const [activeTab, setActiveTab] = useState<TabId>('meaning');
  const [context, setContext] = useState<VerseContextData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tafsirExpanded, setTafsirExpanded] = useState(false);

  const surahMeta = getSurahMeta(surahNumber);

  const loadContext = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getVerseContext(surahNumber, ayahNumber);
      setContext(data);
    } catch (err) {
      console.error('Failed to load verse context:', err);
    } finally {
      setLoading(false);
    }
  }, [surahNumber, ayahNumber]);

  useEffect(() => {
    if (expanded && !context) {
      loadContext();
    }
  }, [expanded, context, loadContext]);

  // Reset when verse changes
  useEffect(() => {
    setContext(null);
    setTafsirExpanded(false);
    setActiveTab('meaning');
    if (expanded) loadContext();
  }, [surahNumber, ayahNumber]);

  const handleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`verse-context ${className}`}>
      {/* Toggle Button (unless inline) */}
      {!inline && (
        <motion.button
          onClick={handleExpand}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
          style={{
            background: expanded
              ? 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(201,162,39,0.03) 100%)'
              : 'rgba(255,255,255,0.03)',
            border: expanded
              ? '1px solid rgba(201,162,39,0.15)'
              : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold-500/70" />
            <span className="text-sm text-night-300 font-medium">
              Understand This Verse
            </span>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-night-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-night-500" />
          )}
        </motion.button>
      )}

      {/* Expandable Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className={`${inline ? '' : 'mt-3'}`}>
              {/* Tab Bar */}
              <div
                className="flex gap-1 p-1 rounded-xl mb-4"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-gold-500/15 text-gold-400 border border-gold-500/20'
                        : 'text-night-500 hover:text-night-300 hover:bg-white/5'
                    }`}
                  >
                    {tab.icon}
                    {!compact && <span className="hidden sm:inline">{tab.label}</span>}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
                </div>
              )}

              {/* Tab Content */}
              {!loading && context && (
                <AnimatePresence mode="wait">
                  {/* Meaning Tab */}
                  {activeTab === 'meaning' && (
                    <motion.div
                      key="meaning"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-3"
                    >
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: 'linear-gradient(135deg, rgba(201,162,39,0.06) 0%, rgba(201,162,39,0.02) 100%)',
                          border: '1px solid rgba(201,162,39,0.1)',
                        }}
                      >
                        <p className="text-xs text-gold-500/70 mb-2 font-medium uppercase tracking-wider">
                          Translation (Sahih International)
                        </p>
                        <p className="text-night-200 text-sm leading-relaxed">
                          {context.meaning}
                        </p>
                      </div>
                      
                      {/* Quick reference link */}
                      <a
                        href={`https://quran.com/${surahNumber}/${ayahNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-night-500 hover:text-gold-400 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View on Quran.com
                      </a>
                    </motion.div>
                  )}

                  {/* Tafsir Tab */}
                  {activeTab === 'tafsir' && (
                    <motion.div
                      key="tafsir"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                    >
                      {context.tafsir ? (
                        <div
                          className="rounded-xl p-4"
                          style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <p className="text-xs text-gold-500/70 font-medium">
                              {context.tafsir.resourceName}
                            </p>
                          </div>
                          <p className="text-night-300 text-sm leading-relaxed whitespace-pre-line">
                            {context.tafsir.text.length > 400 && !tafsirExpanded
                              ? context.tafsir.text.slice(0, 400) + '...'
                              : context.tafsir.text}
                          </p>
                          {context.tafsir.text.length > 400 && (
                            <button
                              onClick={() => setTafsirExpanded(!tafsirExpanded)}
                              className="mt-3 text-gold-400 text-xs flex items-center gap-1 hover:text-gold-300 transition-colors"
                            >
                              {tafsirExpanded ? 'Show less' : 'Read more'}
                              <ChevronDown
                                className={`w-3 h-3 transition-transform ${tafsirExpanded ? 'rotate-180' : ''}`}
                              />
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.02)' }}>
                          <p className="text-night-500 text-sm">
                            Unable to load tafsir. Check your connection.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Revelation Context Tab */}
                  {activeTab === 'revelation' && (
                    <motion.div
                      key="revelation"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-3"
                    >
                      {/* Makki/Madani badge */}
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            context.revelationContext.type === 'Meccan'
                              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {context.revelationContext.type === 'Meccan' ? '🕋 Makki' : '🕌 Madani'}
                        </span>
                        {surahMeta && (
                          <span className="text-xs text-night-500">
                            {surahMeta.englishName} • {surahMeta.numberOfAyahs} verses
                          </span>
                        )}
                      </div>

                      {/* Period description */}
                      <div
                        className="rounded-xl p-4"
                        style={{
                          background: 'rgba(255,255,255,0.02)',
                          border: '1px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <p className="text-night-300 text-sm leading-relaxed">
                          {context.revelationContext.period}
                        </p>
                      </div>

                      {/* Themes */}
                      {context.revelationContext.themes.length > 0 && (
                        <div>
                          <p className="text-xs text-night-500 mb-2 uppercase tracking-wider font-medium">
                            Key Themes
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {context.revelationContext.themes.map((theme) => (
                              <span
                                key={theme}
                                className="px-2.5 py-1 rounded-lg text-xs bg-night-800/80 text-night-300 border border-night-700/50"
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Connected Verses Tab */}
                  {activeTab === 'connections' && (
                    <motion.div
                      key="connections"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-3"
                    >
                      {context.connectedVerses.length > 0 ? (
                        context.connectedVerses.map((cv, i) => (
                          <motion.div
                            key={`${cv.surah}:${cv.ayah}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-xl p-4"
                            style={{
                              background: 'linear-gradient(135deg, rgba(134,169,113,0.06) 0%, rgba(134,169,113,0.02) 100%)',
                              border: '1px solid rgba(134,169,113,0.12)',
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Link2 className="w-3.5 h-3.5 text-sage-400" />
                                <span className="text-xs font-semibold text-sage-400">
                                  {cv.surahName} {cv.surah}:{cv.ayah}
                                </span>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-500/10 text-sage-400/70">
                                {cv.theme}
                              </span>
                            </div>
                            <p className="text-night-300 text-sm leading-relaxed italic mb-2">
                              "{cv.text}"
                            </p>
                            <p className="text-night-500 text-xs">
                              {cv.connection}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <div
                          className="rounded-xl p-4 text-center"
                          style={{ background: 'rgba(255,255,255,0.02)' }}
                        >
                          <Link2 className="w-8 h-8 text-night-600 mx-auto mb-2" />
                          <p className="text-night-500 text-sm">
                            No connections found for this verse yet.
                          </p>
                          <p className="text-night-600 text-xs mt-1">
                            We're expanding our verse connection database.
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── "Why This Matters" Reflection Card ──────────────────────────────

interface WhyThisMattersProps {
  surahNumber: number;
  ayahNumber: number;
  translation: string;
  onDismiss?: () => void;
  onBookmark?: () => void;
  className?: string;
}

export function WhyThisMatters({
  surahNumber,
  ayahNumber,
  translation,
  onDismiss,
  onBookmark,
  className = '',
}: WhyThisMattersProps) {
  const [reflection, setReflection] = useState<ReflectionCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    
    getReflectionCard(surahNumber, ayahNumber, translation).then((card) => {
      if (!cancelled) {
        setReflection(card);
        setLoading(false);
      }
    });
    
    return () => { cancelled = true; };
  }, [surahNumber, ayahNumber, translation]);

  const handleBookmark = () => {
    if (!reflection) return;
    
    const meta = getSurahMeta(surahNumber);
    addBookmark({
      surah: surahNumber,
      surahName: meta?.englishName || `Surah ${surahNumber}`,
      surahArabicName: meta?.name || '',
      ayah: ayahNumber,
      note: `💭 ${reflection.reflection}`,
    });
    setSaved(true);
    onBookmark?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      className={`rounded-2xl p-5 relative overflow-hidden ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(201,162,39,0.08) 0%, rgba(134,169,113,0.06) 100%)',
        border: '1px solid rgba(201,162,39,0.12)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
      }}
    >
      {/* Decorative */}
      <div
        className="absolute top-0 right-0 w-24 h-24 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(201,162,39,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4 text-gold-500/70" />
          <span className="text-xs font-semibold text-gold-400/80 uppercase tracking-wider">
            Why This Matters
          </span>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-lg hover:bg-white/5 text-night-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center gap-3 py-2">
          <Loader2 className="w-4 h-4 text-gold-400 animate-spin flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-white/5 rounded-full w-3/4 animate-pulse" />
          </div>
        </div>
      ) : reflection ? (
        <p className="text-night-200 text-sm leading-relaxed">
          {reflection.reflection}
        </p>
      ) : null}

      {/* Actions */}
      {!loading && reflection && (
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={handleBookmark}
            disabled={saved}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              saved
                ? 'bg-gold-500/15 text-gold-400'
                : 'bg-white/5 text-night-400 hover:bg-white/10 hover:text-night-200'
            }`}
          >
            {saved ? (
              <>
                <Bookmark className="w-3.5 h-3.5 fill-gold-400" />
                Saved
              </>
            ) : (
              <>
                <BookmarkPlus className="w-3.5 h-3.5" />
                Save Reflection
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
