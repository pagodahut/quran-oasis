'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft,
  Bookmark,
  BookOpen,
  Trash2,
  Edit3,
  X,
  Check,
  AlertCircle,
  Calendar,
  MessageSquare,
} from 'lucide-react';
import { useBookmarks, type Bookmark as BookmarkType } from '@/lib/bookmarks';
import BottomNav from '@/components/BottomNav';

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  }
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
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="liquid-card p-4 relative group"
    >
      <Link 
        href={`/mushaf?surah=${bookmark.surah}&ayah=${bookmark.ayah}`}
        className="block"
      >
        {/* Header */}
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
            <Bookmark className="w-5 h-5 text-gold-400 fill-gold-400 mb-1" />
            <p className="text-xs text-night-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(bookmark.createdAt)}
            </p>
          </div>
        </div>

        {/* Preview Text */}
        {bookmark.text && (
          <p 
            className="text-night-300 text-lg mb-2 line-clamp-2"
            style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
          >
            {bookmark.text}
          </p>
        )}
        
        {bookmark.translation && (
          <p className="text-night-500 text-sm line-clamp-2">
            {bookmark.translation}
          </p>
        )}
      </Link>

      {/* Note */}
      {(bookmark.note || showNoteEditor) && (
        <div className="mt-3 pt-3 border-t border-night-800/50">
          {showNoteEditor ? (
            <div className="space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a personal note..."
                className="w-full bg-night-900/50 text-night-200 text-sm rounded-lg px-3 py-2 
                          border border-night-700 focus:border-gold-500/50 focus:outline-none
                          resize-none h-20"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => { setShowNoteEditor(false); setNote(bookmark.note || ''); }}
                  className="text-night-400 text-sm px-3 py-1 hover:text-night-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="bg-gold-500/20 text-gold-400 text-sm px-3 py-1 rounded-lg 
                            hover:bg-gold-500/30 flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save
                </button>
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

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => { e.preventDefault(); setShowNoteEditor(true); }}
          className="p-1.5 rounded-lg bg-night-800/80 text-night-400 hover:text-gold-400 transition-colors"
          title="Edit note"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={(e) => { e.preventDefault(); setConfirmDelete(true); }}
          className="p-1.5 rounded-lg bg-night-800/80 text-night-400 hover:text-red-400 transition-colors"
          title="Remove bookmark"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-night-900/95 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4"
          >
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
              <p className="text-night-200 mb-4">Remove this bookmark?</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg bg-night-800 text-night-300 hover:bg-night-700"
                >
                  Cancel
                </button>
                <button
                  onClick={onRemove}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  Remove
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BookmarksPage() {
  const { bookmarks, remove, updateNote, clear } = useBookmarks();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Group bookmarks by surah
  const groupedBookmarks = bookmarks.reduce((acc, bookmark) => {
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
    <div className="min-h-screen bg-night-950">
      {/* Header */}
      <header className="liquid-glass sticky top-0 z-40 safe-area-top">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="btn-icon">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="font-display text-xl text-night-100">Bookmarks</h1>
                <p className="text-xs text-night-500">
                  {bookmarks.length} saved verse{bookmarks.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            {bookmarks.length > 0 && (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="text-night-500 text-sm hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6 pb-28">
        {bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-night-800/50 flex items-center justify-center mx-auto mb-4">
              <Bookmark className="w-8 h-8 text-night-600" />
            </div>
            <h2 className="text-night-300 font-medium mb-2">No bookmarks yet</h2>
            <p className="text-night-500 text-sm mb-6 max-w-xs mx-auto">
              Tap the bookmark icon while reading to save verses for later
            </p>
            <Link 
              href="/mushaf"
              className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300"
            >
              <BookOpen className="w-4 h-4" />
              Open Quran
            </Link>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-6">
              {Object.entries(groupedBookmarks)
                .sort(([a], [b]) => parseInt(a) - parseInt(b))
                .map(([surah, { surahName, surahArabicName, bookmarks: surahBookmarks }]) => (
                  <div key={surah}>
                    {/* Surah Header */}
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-night-200 font-medium flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-gold-500/10 flex items-center justify-center text-xs text-gold-400">
                          {surah}
                        </span>
                        {surahName}
                      </h2>
                      <span 
                        className="text-gold-400/60"
                        style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
                      >
                        {surahArabicName}
                      </span>
                    </div>

                    {/* Bookmarks */}
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
                  </div>
                ))}
            </div>
          </AnimatePresence>
        )}
      </main>

      {/* Clear All Confirmation Modal */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-night-950/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowClearConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="liquid-modal p-6 max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-night-100 mb-2">Clear All Bookmarks?</h2>
                <p className="text-night-400 mb-6">
                  This will remove all {bookmarks.length} bookmarks. This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="flex-1 py-3 rounded-xl bg-night-800 text-night-200 hover:bg-night-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      clear();
                      setShowClearConfirm(false);
                    }}
                    className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
