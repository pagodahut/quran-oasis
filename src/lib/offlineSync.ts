/**
 * Offline Sync Queue
 * Stores pending updates in IndexedDB when offline, syncs when back online
 */

const DB_NAME = 'hifz-offline';
const DB_VERSION = 1;
const STORE_NAME = 'sync-queue';

interface SyncItem {
  id: string;
  timestamp: number;
  type: 'progress' | 'bookmark' | 'setting';
  data: any;
  attempts: number;
}

// Open IndexedDB
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('type', 'type', { unique: false });
      }
    };
  });
}

// Add item to sync queue
export async function addToSyncQueue(
  type: SyncItem['type'],
  data: any
): Promise<string> {
  const db = await openDB();
  
  const item: SyncItem = {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
    type,
    data,
    attempts: 0,
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const request = store.add(item);
    request.onsuccess = () => resolve(item.id);
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => db.close();
  });
}

// Get all pending items
export async function getPendingItems(): Promise<SyncItem[]> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => db.close();
  });
}

// Remove item from queue
export async function removeFromQueue(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const request = store.delete(id);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => db.close();
  });
}

// Increment attempt count
export async function incrementAttempt(id: string): Promise<void> {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const item = getRequest.result as SyncItem;
      if (item) {
        item.attempts += 1;
        store.put(item);
      }
      resolve();
    };
    getRequest.onerror = () => reject(getRequest.error);
    
    tx.oncomplete = () => db.close();
  });
}

// Clear old failed items (over 24 hours old with 5+ attempts)
export async function cleanupQueue(): Promise<number> {
  const db = await openDB();
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  let removed = 0;

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    const request = store.openCursor();
    request.onsuccess = (event) => {
      const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        const item = cursor.value as SyncItem;
        if (item.timestamp < cutoff && item.attempts >= 5) {
          cursor.delete();
          removed++;
        }
        cursor.continue();
      }
    };
    request.onerror = () => reject(request.error);
    
    tx.oncomplete = () => {
      db.close();
      resolve(removed);
    };
  });
}

// Process sync queue
export async function processSyncQueue(): Promise<{
  synced: number;
  failed: number;
}> {
  if (!navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const items = await getPendingItems();
  let synced = 0;
  let failed = 0;

  for (const item of items) {
    try {
      // Determine endpoint based on type
      let endpoint = '/api/user/sync';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: item.type,
          data: item.data,
          offlineId: item.id,
          timestamp: item.timestamp,
        }),
      });

      if (response.ok) {
        await removeFromQueue(item.id);
        synced++;
      } else {
        await incrementAttempt(item.id);
        failed++;
      }
    } catch (error) {
      console.error('[OfflineSync] Failed to sync item:', item.id, error);
      await incrementAttempt(item.id);
      failed++;
    }
  }

  // Cleanup old failed items
  await cleanupQueue();

  return { synced, failed };
}

// Register background sync
export async function registerBackgroundSync(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('sync' in ServiceWorkerRegistration.prototype)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await (registration as any).sync.register('sync-progress');
    console.log('[OfflineSync] Background sync registered');
    return true;
  } catch (error) {
    console.error('[OfflineSync] Background sync registration failed:', error);
    return false;
  }
}

// Queue progress update
export async function queueProgressUpdate(progress: any): Promise<void> {
  await addToSyncQueue('progress', progress);
  
  // Try to register background sync
  if (navigator.onLine) {
    // If online, sync immediately
    processSyncQueue();
  } else {
    // If offline, register for background sync
    registerBackgroundSync();
  }
}

// Queue bookmark update
export async function queueBookmarkUpdate(bookmark: any): Promise<void> {
  await addToSyncQueue('bookmark', bookmark);
  
  if (navigator.onLine) {
    processSyncQueue();
  } else {
    registerBackgroundSync();
  }
}

// Listen for online event and process queue
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[OfflineSync] Back online, processing queue...');
    processSyncQueue().then(({ synced, failed }) => {
      console.log(`[OfflineSync] Processed: ${synced} synced, ${failed} failed`);
    });
  });
}
