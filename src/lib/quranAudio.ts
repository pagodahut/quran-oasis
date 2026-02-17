/**
 * Quran Audio Utility
 * Provides ayah-level audio playback URLs with caching and reciter selection.
 * 
 * Default source: everyayah.com (Mishary Alafasy)
 * Fallback: api.alquran.cloud
 */

// ============ RECITERS ============

export interface ReciterInfo {
  id: string;
  name: string;
  arabicName: string;
  folder: string; // everyayah.com folder path
  supportsPerAyah: boolean;
}

export const AUDIO_RECITERS: ReciterInfo[] = [
  { id: 'alafasy', name: 'Mishary Alafasy', arabicName: 'مشاري العفاسي', folder: 'Alafasy_128kbps', supportsPerAyah: true },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري', folder: 'Husary_128kbps', supportsPerAyah: true },
  { id: 'minshawi', name: 'Mohamed Siddiq Al-Minshawi', arabicName: 'محمد صديق المنشاوي', folder: 'Minshawy_Murattal_128kbps', supportsPerAyah: true },
  { id: 'abdulbasit', name: 'Abdul Basit Abdul Samad', arabicName: 'عبد الباسط عبد الصمد', folder: 'Abdul_Basit_Murattal_192kbps', supportsPerAyah: true },
  { id: 'sudais', name: 'Abdur-Rahman as-Sudais', arabicName: 'عبدالرحمن السديس', folder: 'Abdurrahmaan_As-Sudais_192kbps', supportsPerAyah: true },
];

export const DEFAULT_RECITER = 'alafasy';

// ============ URL CACHE ============

const urlCache = new Map<string, string>();

function cacheKey(surah: number, ayah: number, reciter: string): string {
  return `${reciter}:${surah}:${ayah}`;
}

// ============ PUBLIC API ============

/**
 * Get the audio URL for a specific ayah.
 * Uses everyayah.com CDN (fast, reliable, per-ayah files).
 */
export function getAyahAudio(
  surahNumber: number,
  ayahNumber: number,
  reciter: string = DEFAULT_RECITER,
): string {
  const key = cacheKey(surahNumber, ayahNumber, reciter);

  if (urlCache.has(key)) {
    return urlCache.get(key)!;
  }

  const reciterInfo = AUDIO_RECITERS.find(r => r.id === reciter)
    ?? AUDIO_RECITERS[0]; // fallback to Alafasy

  const surahStr = String(surahNumber).padStart(3, '0');
  const ayahStr = String(ayahNumber).padStart(3, '0');
  const url = `https://everyayah.com/data/${reciterInfo.folder}/${surahStr}${ayahStr}.mp3`;

  urlCache.set(key, url);
  return url;
}

/**
 * Get audio URL from api.alquran.cloud (fallback).
 */
export function getAyahAudioFallback(
  surahNumber: number,
  ayahNumber: number,
  reciter: string = 'ar.alafasy',
): string {
  return `https://cdn.islamic.network/quran/audio/128/${reciter}/${surahNumber}:${ayahNumber}.mp3`;
}

/**
 * Preload audio for upcoming ayahs (prefetch into browser cache).
 */
export function preloadAyahAudio(
  surahNumber: number,
  ayahNumbers: number[],
  reciter?: string,
): void {
  if (typeof window === 'undefined') return;

  for (const ayah of ayahNumbers) {
    const url = getAyahAudio(surahNumber, ayah, reciter);
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    link.as = 'audio';
    document.head.appendChild(link);
  }
}

/**
 * Get reciter info by id.
 */
export function getReciterInfo(reciterId: string): ReciterInfo | undefined {
  return AUDIO_RECITERS.find(r => r.id === reciterId);
}
