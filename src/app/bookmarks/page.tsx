'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Bookmark,
  BookOpen,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Calendar,
  MessageSquare,
  Search,
} from 'lucide-react';
import { useBookmarks, type Bookmark as BookmarkType } from '@/lib/bookmarks';
import { GlassPanel } from '@/components/ui/GlassPanel';
import BottomNav from '@/components/BottomNav';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
};

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

function BookmarkCard({
  bookmark,
  onRemove,
  onUpdateNote
}: {
  bookmark: BookmarkType;
  onRemove: () => void;
  onUpdateNote: (note: string) => void;
}) {
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [note, setNote] = useState(bookmark.note || '');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSaveNote = () => {
    onUpdateNote(note);
    setShowNoteEditor(false);
  };

  return (
    <motion.div layout variants={fadeInUp} exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}>
      <GlassPanel tint="neutral" blur="sm" className="p-4 relative group">
        <Link
          href={`/mushaf?surah=${bookmark.surah}&ayah=${bookmark.ayah}`}
          className="block"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-night-100">
                {bookmark.surahName} {bookmark.surah}:{bookmark.ayah}
              </h3>
              <p
                className="text-gold-400 text-lg mt-1"
                style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
              >
                {bookmark.surahArabicName}
              </p>
            </div>
            <div className="text-right">
              <div className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center mb-1">
                <Bookmark className="w-4 h-4 text-gold-400 fill-gold-400" />
              </div>
              <p className="text-xs text-night-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(bookmark.createdAt)}
              </p>
            </div>
          </div>

          {bookmark.text && (
            <p
              className="text-night-300 text-lg mb-2 line-clamp-2"
              style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
            >
              {bookmark.text}
            </p>
          )}

          {bookmark.translation && (
            <p className="text-night-500 text-sm line-clamp-2 leading-relaxed">
              {bookmark.translation}
            </p>
          )}
        </Link>

        {(bookmark.note || showNoteEditor) && (
          <div className="mt-3 pt-3 border-t border-white/5">
            {showNoteEditor ? (
              <div className="space-y-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add a personal note..."
                  className="w-full bg-night-900/60 text-night-200 text-sm rounded-xl px-3 py-2.5
                            border border-white/10 focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/20
                            resize-none h-20 backdrop-blur-sm"
                  autoFocus
                />
                <div className="flex justify-end gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setShowNoteEditor(false); setNote(bookmark.note || ''); }}
                    className="text-night-400 text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSaveNote}
                    className="bg-gold-500/15 text-gold-400 text-sm px-3 py-1.5 rounded-lg
                              hover:bg-gold-500/25 flex items-center gap-1 border border-gold-500/20 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save
                  </motion.button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-night-500 mt-0.5 flex-shrink-0" />
                <p className="text-night-400 text-sm flex-1">{bookmark.note}</p>
              </div>
            )}
          </div>
        )}

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); setShowNoteEditor(true); }}
            className="p-2 rounded-xl bg-night-800/90 backdrop-blur-sm text-night-400 hover:text-gold-400 transition-colors border border-white/5"
            title="Edit note"
          >
            <Edit3 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.preventDefault(); setConfirmDelete(true); }}
            className="p-2 rounded-xl bg-night-800/90 backdrop-blur-sm text-night-400 hover:text-red-400 transition-colors border border-white/5"
            title="Remove bookmark"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>

        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-night-900/95 backdrop-blur-md rounded-2xl flex items-center justify-center p-4 z-10"
            >
              <div className="text-center">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <p className="text-night-200 mb-4 text-sm">Remove this bookmark?</p>
                <div className="flex gap-2 justify-center">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setConfirmDelete(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 text-night-300 hover:bg-white/10 text-sm border border-white/5 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onRemove}
                    className="px-4 py-2 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 text-sm border border-red-500/20 transition-colors"
                  >
                    Remove
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassPanel>
    </motion.div>
  );
}

export default function BookmarksPage() {
  const { bookmarks, remove, updateNote, clear } = useBookmarks();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = searchQuery.trim()
    ? bookmarks.filter(b =>
        b.surahName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.text?.includes(searchQuery) ||
        b.translation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.note?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${b.surah}:${b.ayah}`.includes(searchQuery)
      )
    : bookmarks;

  const groupedBookmarks = filteredBookmarks.reduce((acc, bookmark) => {
    const key = bookmark.surah;
    if (!acc[key]) {
      acc[key] = {
        surahName: bookmark.surahName,
        surahArabicName: bookmark.surahArabicName,
        bookmarks: [],
      };
    }
    acc[key].bookmarks.push(bookmark);
    return acc;
  }, {} as Record<number, { surahName: string; surahArabicName: string; bookmarks: BookmarkType[] }>);

  return (
    <div className="min-h-screen">
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1 rounded-lg hover:bg-white/5 transition-colors">
                <ChevronLeft className="w-5 h-5 text-night-400" />
              </Link>
              <div>
                <h1 className="font-display text-xl text-night-100">Bookmarks</h1>
                <p className="text-xs text-night-500">
                  {bookmarks.length} saved verse{bookmarks.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {bookmarks.length > 0 && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowClearConfirm(true)}
                className="text-night-500 text-sm hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-500/5"
              >
                Clear All
              </motion.button>
            )}
          </div>

          {bookmarks.length > 3 && (
            <div className="mt-3 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-night-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/8 text-sm text-night-200
                          placeholder:text-night-600 focus:outline-none focus:ring-1 focus:ring-gold-500/30 focus:border-gold-500/20"
              />
            </div>
          )}
        </div>
      </header>

      <main className="px-4 py-6 pb-28">
        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <GlassPanel tint="neutral" blur="md" className="inline-block p-8 max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gold-500/10 flex items-center justify-center mx-auto mb-5">
                <BookOpen className="w-8 h-8 text-gold-400" />
              </div>
              <h2 className="text-lg font-semibold text-night-200 mb-2">No bookmarks yet</h2>
              <p className="text-sm text-night-500 mb-6 leading-relaxed">
                Save your favorite ayahs while reading the Quran to revisit them later
              </p>
              <Link href="/mushaf">
                <motion.span
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600
                    text-night-950 font-semibold text-sm shadow-[0_2px_12px_rgba(201,162,39,0.3)]"
                >
                  <BookOpen className="w-4 h-4" />
                  Open Quran
                </motion.span>
              </Link>
            </GlassPanel>
          </motion.div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <AnimatePresence mode="popLayout">
              <div className="space-y-6">
                {Object.entries(groupedBookmarks)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([surah, { surahName, surahArabicName, bookmarks: surahBookmarks }]) => (
                    <motion.div key={surah} variants={fadeInUp}>
                      <div className="flex items-center justify-between mb-3 px-1">
                        <h2 className="text-night-200 font-medium flex items-center gap-2">
                          <span className="w-7 h-7 rounded-lg bg-gold-500/10 flex items-center justify-center text-xs font-semibold text-gold-400 border border-gold-500/15">
                            {surah}
                          </span>
                          {surahName}
                        </h2>
                        <span
                          className="text-gold-400/50 text-sm"
                          style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
                        >
                          {surahArabicName}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {surahBookmarks.map((bookmark) => (
                          <BookmarkCard
                            key={bookmark.id}
                            bookmark={bookmark}
                            onRemove={() => remove(bookmark.surah, bookmark.ayah)}
                            onUpdateNote={(note) => updateNote(bookmark.surah, bookmark.ayah, note)}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ))}
              </div>
            </AnimatePresence>
          </motion.div>
        )}

        {searchQuery && filteredBookmarks.length === 0 && bookmarks.length > 0 && (
          <div className="text-center py-12">
            <Search className="w-8 h-8 text-night-600 mx-auto mb-3" />
            <p className="text-night-400 text-sm">No bookmarks match &ldquo;{searchQuery}&rdquo;</p>
          </div>
        )}
      </main>

      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-night-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GlassPanel tint="deep" blur="xl" className="p-6 max-w-sm w-full">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-night-100 mb-2">Clear All Bookmarks?</h2>
                  <p className="text-night-400 text-sm mb-6">
                    This will remove all {bookmarks.length} bookmarks. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-3 rounded-xl bg-white/5 text-night-200 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        clear();
                        setShowClearConfirm(false);
                      }}
                      className="flex-1 py-3 rounded-xl bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors border border-red-500/20"
                    >
                      Clear All
                    </motion.button>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
