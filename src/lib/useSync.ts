'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getProgress, saveProgress, UserProgress } from './progressStore';
import { getBookmarks, Bookmark } from './bookmarks';

const SYNC_DEBOUNCE_MS = 5000; // Wait 5 seconds after last change before syncing
const LAST_SYNC_KEY = 'quranOasis_lastSync';

// Safely import useUser - returns null values if Clerk is not available
function useClerkUser() {
  try {
    // Dynamic import to avoid errors when Clerk isn't configured
    const { useUser } = require('@clerk/nextjs');
    return useUser();
  } catch {
    return { user: null, isSignedIn: false, isLoaded: true };
  }
}

export interface SyncState {
  isSyncing: boolean;
  lastSynced: Date | null;
  error: string | null;
  isOnline: boolean;
}

export function useSync() {
  const { user, isSignedIn, isLoaded } = useClerkUser();
  const [syncState, setSyncState] = useState<SyncState>({
    isSyncing: false,
    lastSynced: null,
    error: null,
    isOnline: true,
  });
  
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasSyncedRef = useRef(false);

  // Load data from server
  const loadFromServer = useCallback(async (): Promise<boolean> => {
    if (!isSignedIn) return false;

    try {
      const res = await fetch('/api/user/sync');
      if (!res.ok) throw new Error('Failed to load from server');

      const data = await res.json();
      
      // Get current local data
      const localProgress = getProgress();
      const localBookmarks = getBookmarks();
      
      // Merge strategy: keep whichever has more data or is more recent
      const serverUpdatedAt = data.user?.createdAt ? new Date(data.user.createdAt) : new Date(0);
      const localUpdatedAt = localProgress.updatedAt ? new Date(localProgress.updatedAt) : new Date(0);
      
      // Merge verses - keep verse with more reviews or higher confidence
      const mergedVerses = { ...localProgress.verses };
      if (data.progress?.verses) {
        for (const [key, serverVerse] of Object.entries(data.progress.verses) as [string, any][]) {
          const localVerse = mergedVerses[key];
          if (!localVerse || 
              (serverVerse.totalReviews || 0) > (localVerse.totalReviews || 0) ||
              (serverVerse.confidence || 0) > (localVerse.confidence || 0)) {
            mergedVerses[key] = serverVerse;
          }
        }
      }
      
      // Merge bookmarks - combine both sets
      const bookmarkSet = new Map<string, Bookmark>();
      for (const b of localBookmarks) {
        bookmarkSet.set(`${b.surah}:${b.ayah}`, b);
      }
      if (data.bookmarks) {
        for (const b of data.bookmarks) {
          const key = `${b.surah}:${b.ayah}`;
          if (!bookmarkSet.has(key) || b.createdAt > (bookmarkSet.get(key)?.createdAt || 0)) {
            bookmarkSet.set(key, b);
          }
        }
      }
      
      // Save merged data locally
      const mergedProgress: UserProgress = {
        ...localProgress,
        verses: mergedVerses,
        settings: data.progress?.settings || localProgress.settings,
      };
      saveProgress(mergedProgress);
      
      // Save merged bookmarks
      if (typeof window !== 'undefined') {
        localStorage.setItem('quran-oasis-bookmarks', JSON.stringify(Array.from(bookmarkSet.values())));
        window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: Array.from(bookmarkSet.values()) }));
      }

      // Record sync time
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      }

      return true;
    } catch (error) {
      console.error('Load from server failed:', error);
      return false;
    }
  }, [isSignedIn]);

  // Save data to server
  const saveToServer = useCallback(async (): Promise<boolean> => {
    if (!isSignedIn) return false;

    setSyncState(s => ({ ...s, isSyncing: true, error: null }));

    try {
      const progress = getProgress();
      const bookmarks = getBookmarks();

      const res = await fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          progress: {
            verses: progress.verses,
          },
          bookmarks,
          settings: progress.settings,
        }),
      });

      if (!res.ok) throw new Error('Failed to save to server');

      const now = new Date();
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_SYNC_KEY, now.toISOString());
      }

      setSyncState(s => ({ ...s, isSyncing: false, lastSynced: now }));
      return true;
    } catch (error) {
      console.error('Save to server failed:', error);
      setSyncState(s => ({ ...s, isSyncing: false, error: 'Sync failed' }));
      return false;
    }
  }, [isSignedIn]);

  // Debounced sync - call this when data changes
  const queueSync = useCallback(() => {
    if (!isSignedIn) return;

    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }

    syncTimeoutRef.current = setTimeout(() => {
      saveToServer();
    }, SYNC_DEBOUNCE_MS);
  }, [isSignedIn, saveToServer]);

  // Initial sync on sign in
  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasSyncedRef.current) return;

    hasSyncedRef.current = true;
    
    const doInitialSync = async () => {
      setSyncState(s => ({ ...s, isSyncing: true }));
      await loadFromServer();
      setSyncState(s => ({ ...s, isSyncing: false, lastSynced: new Date() }));
    };

    doInitialSync();
  }, [isLoaded, isSignedIn, loadFromServer]);

  // Listen for storage changes and trigger sync
  useEffect(() => {
    if (!isSignedIn) return;

    const handleStorageChange = () => {
      queueSync();
    };

    window.addEventListener('progress-updated', handleStorageChange);
    window.addEventListener('bookmarks-updated', handleStorageChange);

    return () => {
      window.removeEventListener('progress-updated', handleStorageChange);
      window.removeEventListener('bookmarks-updated', handleStorageChange);
    };
  }, [isSignedIn, queueSync]);

  // Track online status
  useEffect(() => {
    const handleOnline = () => setSyncState(s => ({ ...s, isOnline: true }));
    const handleOffline = () => setSyncState(s => ({ ...s, isOnline: false }));

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, []);

  return {
    ...syncState,
    isSignedIn: !!isSignedIn,
    syncNow: saveToServer,
    queueSync,
  };
}
