/**
 * Advanced Audio Preloading System
 * 
 * Features:
 * - Intelligent preloading (next 3 ayahs, full surah)
 * - IndexedDB caching for offline access
 * - LRU eviction when cache gets large
 * - Network-aware quality selection
 * - Background preloading with idle callbacks
 */

import { getAyahAudioUrl } from './quran';

// ============================================
// Configuration
// ============================================

const DB_NAME = 'hifz-audio-cache';
const DB_VERSION = 1;
const STORE_NAME = 'audio-files';
const MAX_CACHE_SIZE_MB = 500; // 500MB max cache
const MAX_MEMORY_PRELOAD = 10; // Keep 10 in memory
const PRELOAD_AHEAD_COUNT = 3; // Preload next 3 ayahs

// Quality settings (bitrate folders on EveryAyah)
export type AudioQuality = 'high' | 'medium' | 'low';

export const QUALITY_FOLDERS: Record<string, Record<AudioQuality, string>> = {
  alafasy: {
    high: 'Alafasy_128kbps',
    medium: 'Alafasy_64kbps',
    low: 'Alafasy_64kbps', // Some reciters don't have lower quality
  },
  husary: {
    high: 'Husary_128kbps',
    medium: 'Husary_64kbps',
    low: 'Husary_64kbps',
  },
  minshawi: {
    high: 'Minshawy_Murattal_128kbps',
    medium: 'Minshawy_Murattal_128kbps',
    low: 'Minshawy_Murattal_128kbps',
  },
  sudais: {
    high: 'Abdurrahmaan_As-Sudais_192kbps',
    medium: 'Abdurrahmaan_As-Sudais_64kbps',
    low: 'Abdurrahmaan_As-Sudais_64kbps',
  },
  shuraim: {
    high: 'Saood_ash-Shuraym_128kbps',
    medium: 'Saood_ash-Shuraym_64kbps',
    low: 'Saood_ash-Shuraym_64kbps',
  },
};

// ============================================
// Types
// ============================================

interface CacheEntry {
  key: string;
  blob: Blob;
  size: number;
  lastAccessed: number;
  surah: number;
  ayah: number;
  reciter: string;
  quality: AudioQuality;
}

interface PreloadStatus {
  total: number;
  loaded: number;
  failed: number;
  inProgress: boolean;
}

type PreloadProgressCallback = (status: PreloadStatus) => void;

// ============================================
// IndexedDB Management
// ============================================

let db: IDBDatabase | null = null;

async function openDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('lastAccessed', 'lastAccessed');
        store.createIndex('surah', 'surah');
        store.createIndex('size', 'size');
      }
    };
  });
}

async function getCachedAudio(key: string): Promise<Blob | null> {
  try {
    const database = await openDB();
    return new Promise((resolve) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        if (request.result) {
          // Update last accessed time
          const entry = request.result as CacheEntry;
          entry.lastAccessed = Date.now();
          store.put(entry);
          resolve(entry.blob);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function cacheAudio(
  key: string,
  blob: Blob,
  surah: number,
  ayah: number,
  reciter: string,
  quality: AudioQuality
): Promise<void> {
  try {
    const database = await openDB();
    
    // Check cache size and evict if necessary
    await evictIfNeeded(blob.size);

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const entry: CacheEntry = {
        key,
        blob,
        size: blob.size,
        lastAccessed: Date.now(),
        surah,
        ayah,
        reciter,
        quality,
      };

      const request = store.put(entry);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn('Failed to cache audio:', error);
  }
}

async function evictIfNeeded(newSize: number): Promise<void> {
  try {
    const database = await openDB();
    const currentSize = await getCacheSize();
    const maxBytes = MAX_CACHE_SIZE_MB * 1024 * 1024;

    if (currentSize + newSize <= maxBytes) return;

    // Need to evict - use LRU strategy
    const toEvict = currentSize + newSize - maxBytes + (10 * 1024 * 1024); // Evict extra 10MB buffer

    return new Promise((resolve) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('lastAccessed');
      const request = index.openCursor();

      let evicted = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;
        
        if (cursor && evicted < toEvict) {
          const entry = cursor.value as CacheEntry;
          evicted += entry.size;
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => resolve();
    });
  } catch {
    // Ignore eviction errors
  }
}

async function getCacheSize(): Promise<number> {
  try {
    const database = await openDB();
    return new Promise((resolve) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      let totalSize = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;
        
        if (cursor) {
          totalSize += (cursor.value as CacheEntry).size;
          cursor.continue();
        } else {
          resolve(totalSize);
        }
      };

      request.onerror = () => resolve(0);
    });
  } catch {
    return 0;
  }
}

// ============================================
// Memory Cache (for immediate playback)
// ============================================

const memoryCache = new Map<string, HTMLAudioElement>();
const memoryCacheQueue: string[] = [];

function getCacheKey(surah: number, ayah: number, reciter: string, quality: AudioQuality): string {
  return `${reciter}:${quality}:${surah}:${ayah}`;
}

function getAudioUrlWithQuality(
  surah: number,
  ayah: number,
  reciterId: string,
  quality: AudioQuality
): string {
  const folder = QUALITY_FOLDERS[reciterId]?.[quality] || QUALITY_FOLDERS.alafasy[quality];
  const surahStr = surah.toString().padStart(3, '0');
  const ayahStr = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/${folder}/${surahStr}${ayahStr}.mp3`;
}

// ============================================
// Network Quality Detection
// ============================================

/** Network Information API (not in standard TypeScript lib) */
interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

export function detectNetworkQuality(): AudioQuality {
  if (typeof navigator === 'undefined') return 'high';

  const nav = navigator as NavigatorWithConnection;
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

  if (!connection) return 'high';

  // Effective type: 'slow-2g', '2g', '3g', '4g'
  const effectiveType = connection.effectiveType;
  
  if (effectiveType === 'slow-2g' || effectiveType === '2g') {
    return 'low';
  } else if (effectiveType === '3g') {
    return 'medium';
  }

  // Also check downlink speed (Mbps)
  const downlink = connection.downlink;
  if (downlink !== undefined) {
    if (downlink < 0.5) return 'low';
    if (downlink < 2) return 'medium';
  }

  return 'high';
}

// ============================================
// Preloading Functions
// ============================================

/**
 * Preload a single audio file
 */
export async function preloadAudio(
  surah: number,
  ayah: number,
  reciter: string = 'alafasy',
  quality: AudioQuality = 'high'
): Promise<HTMLAudioElement | null> {
  const key = getCacheKey(surah, ayah, reciter, quality);

  // Check memory cache first
  if (memoryCache.has(key)) {
    return memoryCache.get(key)!;
  }

  // Check IndexedDB cache
  const cachedBlob = await getCachedAudio(key);
  
  if (cachedBlob) {
    const audio = new Audio(URL.createObjectURL(cachedBlob));
    addToMemoryCache(key, audio);
    return audio;
  }

  // Fetch from network
  const url = getAudioUrlWithQuality(surah, ayah, reciter, quality);
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    
    const blob = await response.blob();
    
    // Cache to IndexedDB
    await cacheAudio(key, blob, surah, ayah, reciter, quality);
    
    // Create audio element and cache in memory
    const audio = new Audio(URL.createObjectURL(blob));
    addToMemoryCache(key, audio);
    
    return audio;
  } catch (error) {
    console.warn(`Failed to preload ${surah}:${ayah}:`, error);
    return null;
  }
}

function addToMemoryCache(key: string, audio: HTMLAudioElement): void {
  // Evict oldest if at capacity
  if (memoryCacheQueue.length >= MAX_MEMORY_PRELOAD) {
    const oldestKey = memoryCacheQueue.shift();
    if (oldestKey) {
      const oldAudio = memoryCache.get(oldestKey);
      if (oldAudio) {
        URL.revokeObjectURL(oldAudio.src);
        memoryCache.delete(oldestKey);
      }
    }
  }

  memoryCache.set(key, audio);
  memoryCacheQueue.push(key);
}

/**
 * Get a preloaded audio element (or fetch if not preloaded)
 */
export function getPreloadedAudio(
  surah: number,
  ayah: number,
  reciter: string = 'alafasy',
  quality: AudioQuality = 'high'
): HTMLAudioElement | null {
  const key = getCacheKey(surah, ayah, reciter, quality);
  return memoryCache.get(key) || null;
}

/**
 * Preload next N ayahs for smooth playback
 */
export async function preloadNextAyahs(
  surah: number,
  currentAyah: number,
  totalAyahs: number,
  reciter: string = 'alafasy',
  quality: AudioQuality = 'high',
  count: number = PRELOAD_AHEAD_COUNT
): Promise<void> {
  const preloadPromises: Promise<any>[] = [];

  for (let i = 1; i <= count; i++) {
    const nextAyah = currentAyah + i;
    if (nextAyah <= totalAyahs) {
      preloadPromises.push(
        preloadAudio(surah, nextAyah, reciter, quality).catch(() => null)
      );
    }
  }

  await Promise.all(preloadPromises);
}

/**
 * Preload entire surah (background, low priority)
 */
export async function preloadSurah(
  surah: number,
  totalAyahs: number,
  reciter: string = 'alafasy',
  quality: AudioQuality = 'high',
  onProgress?: PreloadProgressCallback
): Promise<void> {
  const status: PreloadStatus = {
    total: totalAyahs,
    loaded: 0,
    failed: 0,
    inProgress: true,
  };

  onProgress?.(status);

  // Preload in batches to avoid overwhelming the network
  const batchSize = 5;
  
  for (let start = 1; start <= totalAyahs; start += batchSize) {
    const end = Math.min(start + batchSize - 1, totalAyahs);
    const batch: Promise<any>[] = [];

    for (let ayah = start; ayah <= end; ayah++) {
      batch.push(
        preloadAudio(surah, ayah, reciter, quality)
          .then(() => {
            status.loaded++;
            onProgress?.(status);
          })
          .catch(() => {
            status.failed++;
            onProgress?.(status);
          })
      );
    }

    await Promise.all(batch);
    
    // Small delay between batches to be nice to the server
    if (end < totalAyahs) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  status.inProgress = false;
  onProgress?.(status);
}

/**
 * Preload audio with low priority using requestIdleCallback
 */
export function preloadAudioWhenIdle(
  surah: number,
  ayah: number,
  reciter: string = 'alafasy',
  quality: AudioQuality = 'high'
): void {
  if (typeof window === 'undefined') return;

  const doPreload = () => {
    preloadAudio(surah, ayah, reciter, quality).catch(() => {});
  };

  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(doPreload, { timeout: 5000 });
  } else {
    setTimeout(doPreload, 1000);
  }
}

// ============================================
// Cache Management
// ============================================

/**
 * Clear all cached audio
 */
export async function clearAudioCache(): Promise<void> {
  // Clear memory cache
  memoryCache.forEach((audio) => {
    URL.revokeObjectURL(audio.src);
  });
  memoryCache.clear();
  memoryCacheQueue.length = 0;

  // Clear IndexedDB
  try {
    const database = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    // Ignore errors
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  totalSize: number;
  totalSizeMB: string;
  itemCount: number;
  memoryItems: number;
}> {
  let totalSize = 0;
  let itemCount = 0;

  try {
    const database = await openDB();
    await new Promise<void>((resolve) => {
      const transaction = database.transaction(STORE_NAME, 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue | null;
        
        if (cursor) {
          totalSize += (cursor.value as CacheEntry).size;
          itemCount++;
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = () => resolve();
    });
  } catch {
    // Ignore errors
  }

  return {
    totalSize,
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    itemCount,
    memoryItems: memoryCache.size,
  };
}

/**
 * Check if a specific ayah is cached
 */
export async function isAyahCached(
  surah: number,
  ayah: number,
  reciter: string = 'alafasy',
  quality: AudioQuality = 'high'
): Promise<boolean> {
  const key = getCacheKey(surah, ayah, reciter, quality);
  
  // Check memory first
  if (memoryCache.has(key)) return true;
  
  // Check IndexedDB
  const cached = await getCachedAudio(key);
  return cached !== null;
}

/**
 * Download surah for offline use (returns blob for download)
 */
export async function downloadSurahForOffline(
  surah: number,
  totalAyahs: number,
  reciter: string = 'alafasy',
  quality: AudioQuality = 'high',
  onProgress?: PreloadProgressCallback
): Promise<void> {
  // Just preload to IndexedDB - this makes it available offline
  await preloadSurah(surah, totalAyahs, reciter, quality, onProgress);
}

// ============================================
// Playback Position Persistence
// ============================================

const POSITION_STORAGE_KEY = 'hifz-playback-positions';

interface PlaybackPositions {
  [surahKey: string]: {
    ayah: number;
    time: number;
    timestamp: number;
  };
}

export function savePlaybackPosition(surah: number, ayah: number, time: number): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    const positions: PlaybackPositions = JSON.parse(
      localStorage.getItem(POSITION_STORAGE_KEY) || '{}'
    );
    
    positions[`surah-${surah}`] = {
      ayah,
      time,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Ignore errors
  }
}

export function getPlaybackPosition(surah: number): { ayah: number; time: number } | null {
  if (typeof localStorage === 'undefined') return null;
  
  try {
    const positions: PlaybackPositions = JSON.parse(
      localStorage.getItem(POSITION_STORAGE_KEY) || '{}'
    );
    
    const position = positions[`surah-${surah}`];
    if (!position) return null;
    
    // Only return if position is less than 7 days old
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - position.timestamp > sevenDays) return null;
    
    return { ayah: position.ayah, time: position.time };
  } catch {
    return null;
  }
}

export function clearPlaybackPosition(surah: number): void {
  if (typeof localStorage === 'undefined') return;
  
  try {
    const positions: PlaybackPositions = JSON.parse(
      localStorage.getItem(POSITION_STORAGE_KEY) || '{}'
    );
    
    delete positions[`surah-${surah}`];
    
    localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(positions));
  } catch {
    // Ignore errors
  }
}
