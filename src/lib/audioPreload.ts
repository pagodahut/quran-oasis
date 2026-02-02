/**
 * Audio Preloading Utilities for Performance
 * Preloads upcoming audio files to eliminate loading latency
 */

import { getAyahAudioUrl } from './quran';

// Cache for preloaded audio
const preloadedAudio = new Map<string, HTMLAudioElement>();
const preloadQueue: string[] = [];
const MAX_PRELOAD_CACHE = 10;

/**
 * Preload a single audio file
 */
export function preloadAudio(url: string): Promise<HTMLAudioElement> {
  if (preloadedAudio.has(url)) {
    return Promise.resolve(preloadedAudio.get(url)!);
  }

  return new Promise((resolve, reject) => {
    const audio = new Audio();
    audio.preload = 'auto';
    
    audio.oncanplaythrough = () => {
      // Manage cache size
      if (preloadedAudio.size >= MAX_PRELOAD_CACHE) {
        const oldestUrl = preloadQueue.shift();
        if (oldestUrl) {
          const oldAudio = preloadedAudio.get(oldestUrl);
          if (oldAudio) {
            oldAudio.src = '';
            preloadedAudio.delete(oldestUrl);
          }
        }
      }
      
      preloadedAudio.set(url, audio);
      preloadQueue.push(url);
      resolve(audio);
    };
    
    audio.onerror = () => {
      reject(new Error(`Failed to preload audio: ${url}`));
    };
    
    audio.src = url;
  });
}

/**
 * Preload the next N ayahs for a lesson
 */
export async function preloadNextAyahs(
  surah: number,
  currentAyah: number,
  reciter: string = 'alafasy',
  count: number = 3
): Promise<void> {
  const preloadPromises: Promise<HTMLAudioElement>[] = [];
  
  for (let i = 1; i <= count; i++) {
    const nextAyah = currentAyah + i;
    const url = getAyahAudioUrl(surah, nextAyah, reciter);
    preloadPromises.push(preloadAudio(url).catch(() => null as any));
  }
  
  await Promise.all(preloadPromises);
}

/**
 * Get a preloaded audio element if available
 */
export function getPreloadedAudio(url: string): HTMLAudioElement | null {
  return preloadedAudio.get(url) || null;
}

/**
 * Clear all preloaded audio
 */
export function clearPreloadCache(): void {
  preloadedAudio.forEach((audio) => {
    audio.src = '';
  });
  preloadedAudio.clear();
  preloadQueue.length = 0;
}

/**
 * Preload audio with low priority (uses requestIdleCallback)
 */
export function preloadAudioWhenIdle(
  surah: number,
  ayah: number,
  reciter: string = 'alafasy'
): void {
  const url = getAyahAudioUrl(surah, ayah, reciter);
  
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    (window as any).requestIdleCallback(
      () => preloadAudio(url).catch(() => {}),
      { timeout: 5000 }
    );
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => preloadAudio(url).catch(() => {}), 1000);
  }
}

/**
 * Preload audio for a range of ayahs
 */
export async function preloadAyahRange(
  surah: number,
  startAyah: number,
  endAyah: number,
  reciter: string = 'alafasy'
): Promise<void> {
  const promises: Promise<void>[] = [];
  
  for (let ayah = startAyah; ayah <= endAyah; ayah++) {
    promises.push(
      preloadAudio(getAyahAudioUrl(surah, ayah, reciter))
        .then(() => {})
        .catch(() => {})
    );
  }
  
  await Promise.all(promises);
}
