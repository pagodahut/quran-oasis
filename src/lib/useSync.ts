'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { getProgress, saveProgress, UserProgress } from './progressStore';
import { getBookmarks, Bookmark } from './bookmarks';

const SYNC_DEBOUNCE_MS = 5000; // Wait 5 seconds after last change before syncing
const LAST_SYNC_KEY = 'quranOasis_lastSync';

const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Hook that calls useUser — only used when Clerk is configured
function useClerkUserReal() {
  return useUser();
}

// Stub hook — stable shape, never calls useUser
function useClerkUserStub() {
  return { user: null, isSignedIn: false as const, isLoaded: true as const };
}

// Pick at module level so we never call hooks conditionally
const useClerkUser = isClerkConfigured ? useClerkUserReal : useClerkUserStub;

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
  // True only after an initial server pull has completed. Pushing before this
  // can overwrite/delete server data with an empty, not-yet-hydrated local state.
  const hasHydratedRef = useRef(false);

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

      // Merge verses — keep the version with more reviews; break ties by confidence
      const mergedVerses = { ...localProgress.verses };
      if (data.progress?.verses) {
        for (const [key, serverVerse] of Object.entries(data.progress.verses) as [string, any][]) {
          const localVerse = mergedVerses[key];
          if (!localVerse) {
            mergedVerses[key] = serverVerse;
          } else {
            const serverReviews = serverVerse.totalReviews || 0;
            const localReviews = localVerse.totalReviews || 0;
            if (serverReviews > localReviews ||
                (serverReviews === localReviews && (serverVerse.confidence || 0) > (localVerse.confidence || 0))) {
              mergedVerses[key] = serverVerse;
            }
          }
        }
      }

      // Merge bookmarks — union both sets, prefer the newer entry on conflicts
      const bookmarkSet = new Map<string, Bookmark>();
      for (const b of localBookmarks) {
        bookmarkSet.set(`${b.surah}:${b.ayah}`, b);
      }
      if (data.bookmarks) {
        for (const b of data.bookmarks) {
          const key = `${b.surah}:${b.ayah}`;
          const existing = bookmarkSet.get(key);
          if (!existing || (b.createdAt || 0) > (existing.createdAt || 0)) {
            bookmarkSet.set(key, b);
          }
        }
      }

      // Settings: prefer local when the user has customized them on this device.
      // Detect fresh local store by comparing createdAt ≈ updatedAt (within 10s).
      const localCreated = new Date(localProgress.createdAt || 0).getTime();
      const localUpdated = new Date(localProgress.updatedAt || 0).getTime();
      const isNewLocalStore = Math.abs(localUpdated - localCreated) < 10_000;
      const mergedSettings = (isNewLocalStore && data.progress?.settings)
        ? { ...localProgress.settings, ...data.progress.settings }
        : localProgress.settings;

      // Save merged data locally
      const mergedProgress: UserProgress = {
        ...localProgress,
        verses: mergedVerses,
        settings: mergedSettings,
      };
      saveProgress(mergedProgress);

      // Save merged bookmarks
      if (typeof window !== 'undefined') {
        localStorage.setItem('hifz-bookmarks', JSON.stringify(Array.from(bookmarkSet.values())));
        window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: Array.from(bookmarkSet.values()) }));
      }

      // Record sync time
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
      }

      hasHydratedRef.current = true; // safe to push from here on
      return true;
    } catch (error) {
      console.error('Load from server failed:', error);
      return false;
    }
  }, [isSignedIn]);

  // Save data to server
  const saveToServer = useCallback(async (): Promise<boolean> => {
    if (!isSignedIn) return false;
    // Never push before the initial pull has hydrated local state — otherwise
    // an empty fresh device would overwrite/delete the user's server data.
    if (!hasHydratedRef.current) return false;

    setSyncState((s: SyncState) => ({ ...s, isSyncing: true, error: null }));

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

      // Also push SRS state to Clerk metadata for cross-device sync
      try {
        await fetch('/api/srs/sync', { method: 'POST' });
      } catch (err) {
        console.error('SRS metadata push failed (non-blocking):', err);
      }

      const now = new Date();
      if (typeof window !== 'undefined') {
        localStorage.setItem(LAST_SYNC_KEY, now.toISOString());
      }

      setSyncState((s: SyncState) => ({ ...s, isSyncing: false, lastSynced: now }));
      return true;
    } catch (error) {
      console.error('Save to server failed:', error);
      setSyncState((s: SyncState) => ({ ...s, isSyncing: false, error: 'Sync failed' }));
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
      setSyncState((s: SyncState) => ({ ...s, isSyncing: true }));
      // Pull SRS state from Clerk metadata first (cross-device sync)
      try {
        await fetch('/api/srs/sync');
      } catch (err) {
        console.error('SRS metadata pull failed (non-blocking):', err);
      }
      await loadFromServer();
      setSyncState((s: SyncState) => ({ ...s, isSyncing: false, lastSynced: new Date() }));
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
    const handleOnline = () => setSyncState((s: SyncState) => ({ ...s, isOnline: true }));
    const handleOffline = () => setSyncState((s: SyncState) => ({ ...s, isOnline: false }));

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
