/**
 * Bookmarks System
 * Store and manage bookmarked verses in localStorage
 */

export interface Bookmark {
  id: string;
  surah: number;
  surahName: string;
  surahArabicName: string;
  ayah: number;
  text?: string;           // First few words of Arabic text
  translation?: string;    // First few words of translation
  note?: string;           // User's personal note
  createdAt: number;       // Timestamp
}

const STORAGE_KEY = 'quran-oasis-bookmarks';

// Get all bookmarks
export function getBookmarks(): Bookmark[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Add a bookmark
export function addBookmark(bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Bookmark {
  const bookmarks = getBookmarks();
  
  // Check if already bookmarked
  const existing = bookmarks.find(b => b.surah === bookmark.surah && b.ayah === bookmark.ayah);
  if (existing) {
    return existing;
  }
  
  const newBookmark: Bookmark = {
    ...bookmark,
    id: `${bookmark.surah}-${bookmark.ayah}-${Date.now()}`,
    createdAt: Date.now(),
  };
  
  bookmarks.unshift(newBookmark); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  
  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: bookmarks }));
  
  return newBookmark;
}

// Remove a bookmark
export function removeBookmark(surah: number, ayah: number): boolean {
  const bookmarks = getBookmarks();
  const filtered = bookmarks.filter(b => !(b.surah === surah && b.ayah === ayah));
  
  if (filtered.length === bookmarks.length) {
    return false; // Nothing removed
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: filtered }));
  
  return true;
}

// Update a bookmark's note
export function updateBookmarkNote(surah: number, ayah: number, note: string): boolean {
  const bookmarks = getBookmarks();
  const index = bookmarks.findIndex(b => b.surah === surah && b.ayah === ayah);
  
  if (index === -1) return false;
  
  bookmarks[index].note = note;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
  window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: bookmarks }));
  
  return true;
}

// Check if a verse is bookmarked
export function isBookmarked(surah: number, ayah: number): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.some(b => b.surah === surah && b.ayah === ayah);
}

// Get a specific bookmark
export function getBookmark(surah: number, ayah: number): Bookmark | undefined {
  const bookmarks = getBookmarks();
  return bookmarks.find(b => b.surah === surah && b.ayah === ayah);
}

// Get bookmarks for a specific surah
export function getSurahBookmarks(surah: number): Bookmark[] {
  const bookmarks = getBookmarks();
  return bookmarks.filter(b => b.surah === surah);
}

// Clear all bookmarks
export function clearAllBookmarks(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: [] }));
}

// Get bookmark count
export function getBookmarkCount(): number {
  return getBookmarks().length;
}

// Export bookmarks as JSON
export function exportBookmarks(): string {
  const bookmarks = getBookmarks();
  return JSON.stringify(bookmarks, null, 2);
}

// Import bookmarks from JSON
export function importBookmarks(json: string): number {
  try {
    const imported = JSON.parse(json) as Bookmark[];
    const existing = getBookmarks();
    
    let addedCount = 0;
    for (const bookmark of imported) {
      if (!existing.some(b => b.surah === bookmark.surah && b.ayah === bookmark.ayah)) {
        existing.push(bookmark);
        addedCount++;
      }
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
    window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: existing }));
    
    return addedCount;
  } catch {
    throw new Error('Invalid bookmark data');
  }
}

// React hook for bookmarks
import { useState, useEffect, useCallback } from 'react';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    // Initial load
    setBookmarks(getBookmarks());

    // Listen for updates
    const handleUpdate = (e: CustomEvent<Bookmark[]>) => {
      setBookmarks(e.detail);
    };

    window.addEventListener('bookmarks-updated', handleUpdate as EventListener);
    return () => {
      window.removeEventListener('bookmarks-updated', handleUpdate as EventListener);
    };
  }, []);

  const add = useCallback((bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    return addBookmark(bookmark);
  }, []);

  const remove = useCallback((surah: number, ayah: number) => {
    return removeBookmark(surah, ayah);
  }, []);

  const toggle = useCallback((bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => {
    if (isBookmarked(bookmark.surah, bookmark.ayah)) {
      remove(bookmark.surah, bookmark.ayah);
      return false;
    } else {
      add(bookmark);
      return true;
    }
  }, [add, remove]);

  const check = useCallback((surah: number, ayah: number) => {
    return isBookmarked(surah, ayah);
  }, []);

  const updateNote = useCallback((surah: number, ayah: number, note: string) => {
    return updateBookmarkNote(surah, ayah, note);
  }, []);

  return {
    bookmarks,
    add,
    remove,
    toggle,
    check,
    updateNote,
    count: bookmarks.length,
    clear: clearAllBookmarks,
  };
}
