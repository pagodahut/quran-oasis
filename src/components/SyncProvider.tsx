'use client';

import { useSync } from '@/lib/useSync';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';
import { createContext, useContext, ReactNode } from 'react';

interface SyncContextValue {
  isSyncing: boolean;
  lastSynced: Date | null;
  error: string | null;
  isOnline: boolean;
  isSignedIn: boolean;
  syncNow: () => Promise<boolean>;
  queueSync: () => void;
}

const SyncContext = createContext<SyncContextValue | null>(null);

export function useSyncContext() {
  const context = useContext(SyncContext);
  if (!context) {
    return {
      isSyncing: false,
      lastSynced: null,
      error: null,
      isOnline: true,
      isSignedIn: false,
      syncNow: async () => false,
      queueSync: () => {},
    };
  }
  return context;
}

export function SyncProvider({ children }: { children: ReactNode }) {
  const syncState = useSync();

  return (
    <SyncContext.Provider value={syncState}>
      {children}
    </SyncContext.Provider>
  );
}

// Optional: Sync status indicator component
export function SyncIndicator() {
  const { isSyncing, isOnline, isSignedIn, lastSynced, error } = useSyncContext();

  // Don't show anything if not signed in
  if (!isSignedIn) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-night-800/80 backdrop-blur-sm px-3 py-2 rounded-full text-xs">
        {!isOnline ? (
          <>
            <CloudOff className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-amber-400">Offline</span>
          </>
        ) : isSyncing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 text-gold-400 animate-spin" />
            <span className="text-night-300">Syncing...</span>
          </>
        ) : error ? (
          <>
            <CloudOff className="w-3.5 h-3.5 text-red-400" />
            <span className="text-red-400">Sync error</span>
          </>
        ) : (
          <>
            <Cloud className="w-3.5 h-3.5 text-green-400" />
            <span className="text-night-400">Synced</span>
          </>
        )}
      </div>
    </div>
  );
}
