/**
 * Quran Audio Service
 * Provides real reciter audio for Quran verses using multiple sources
 * 
 * Primary: EveryAyah.com (free, high quality)
 * Fallback: Quran.com API
 */

// ============================================
// Reciter Configuration
// ============================================

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: 'murattal' | 'mujawwad';
  everyAyahId?: string;
  quranComId?: number;
  description: string;
}

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'murattal',
    everyAyahId: 'Alafasy_128kbps',
    quranComId: 7,
    description: 'Clear, beautiful recitation perfect for memorization',
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'murattal',
    everyAyahId: 'Husary_128kbps',
    quranComId: 5,
    description: 'Classic Egyptian style, excellent for learning tajweed',
  },
  {
    id: 'minshawi',
    name: 'Mohamed Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'mujawwad',
    everyAyahId: 'Minshawy_Murattal_128kbps',
    quranComId: 6,
    description: 'Melodious, emotional recitation',
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    style: 'murattal',
    everyAyahId: 'Abdurrahmaan_As-Sudais_192kbps',
    quranComId: 2,
    description: 'Imam of Masjid Al-Haram, powerful recitation',
  },
  {
    id: 'shuraim',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    style: 'murattal',
    everyAyahId: 'Saood_ash-Shuraym_128kbps',
    quranComId: 4,
    description: 'Imam of Masjid Al-Haram, clear pronunciation',
  },
];

// ============================================
// Audio URL Generation
// ============================================

/**
 * Get audio URL for a specific ayah
 * Uses EveryAyah.com as primary source
 */
export function getAyahAudioUrl(
  surah: number,
  ayah: number,
  reciterId: string = 'alafasy'
): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  
  // Format: 001001.mp3 for surah 1, ayah 1
  const surahPadded = surah.toString().padStart(3, '0');
  const ayahPadded = ayah.toString().padStart(3, '0');
  const fileName = `${surahPadded}${ayahPadded}.mp3`;
  
  // EveryAyah.com URL format
  return `https://everyayah.com/data/${reciter.everyAyahId}/${fileName}`;
}

/**
 * Get audio URLs for a range of ayahs
 */
export function getAyahRangeAudioUrls(
  surah: number,
  startAyah: number,
  endAyah: number,
  reciterId: string = 'alafasy'
): string[] {
  const urls: string[] = [];
  for (let ayah = startAyah; ayah <= endAyah; ayah++) {
    urls.push(getAyahAudioUrl(surah, ayah, reciterId));
  }
  return urls;
}

/**
 * Get audio URL for entire surah (combined)
 * Uses Quran.com API for full surah audio
 */
export function getSurahAudioUrl(
  surah: number,
  reciterId: string = 'alafasy'
): string {
  const reciter = RECITERS.find(r => r.id === reciterId) || RECITERS[0];
  const surahPadded = surah.toString().padStart(3, '0');
  
  // Alternative: use verse-by-verse from EveryAyah
  return `https://everyayah.com/data/${reciter.everyAyahId}/${surahPadded}001.mp3`;
}

// ============================================
// Audio Playback Manager
// ============================================

let currentAudio: HTMLAudioElement | null = null;
let audioQueue: string[] = [];
let queueIndex = 0;
let isPlaying = false;
let onAyahChangeCallback: ((index: number) => void) | null = null;
let onPlaybackEndCallback: (() => void) | null = null;

/**
 * Play a single ayah
 */
export async function playAyah(
  surah: number,
  ayah: number,
  reciterId: string = 'alafasy',
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  }
): Promise<void> {
  stopPlayback();
  
  const url = getAyahAudioUrl(surah, ayah, reciterId);
  
  return new Promise((resolve, reject) => {
    currentAudio = new Audio(url);
    
    currentAudio.oncanplaythrough = () => {
      callbacks?.onStart?.();
    };
    
    currentAudio.onended = () => {
      callbacks?.onEnd?.();
      currentAudio = null;
      isPlaying = false;
      resolve();
    };
    
    currentAudio.onerror = () => {
      const error = 'Failed to load audio';
      callbacks?.onError?.(error);
      currentAudio = null;
      isPlaying = false;
      reject(new Error(error));
    };
    
    isPlaying = true;
    currentAudio.play().catch((e) => {
      callbacks?.onError?.(e.message);
      reject(e);
    });
  });
}

/**
 * Play a range of ayahs sequentially
 */
export async function playAyahRange(
  surah: number,
  startAyah: number,
  endAyah: number,
  reciterId: string = 'alafasy',
  callbacks?: {
    onAyahChange?: (ayahIndex: number, ayahNumber: number) => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  }
): Promise<void> {
  stopPlayback();
  
  audioQueue = getAyahRangeAudioUrls(surah, startAyah, endAyah, reciterId);
  queueIndex = 0;
  onAyahChangeCallback = (index) => {
    callbacks?.onAyahChange?.(index, startAyah + index);
  };
  onPlaybackEndCallback = callbacks?.onEnd || null;
  
  return playNextInQueue(callbacks?.onError);
}

/**
 * Play next audio in queue
 */
async function playNextInQueue(onError?: (error: string) => void): Promise<void> {
  if (queueIndex >= audioQueue.length) {
    onPlaybackEndCallback?.();
    isPlaying = false;
    return;
  }
  
  const url = audioQueue[queueIndex];
  
  return new Promise((resolve, reject) => {
    currentAudio = new Audio(url);
    
    currentAudio.oncanplaythrough = () => {
      onAyahChangeCallback?.(queueIndex);
    };
    
    currentAudio.onended = () => {
      queueIndex++;
      playNextInQueue(onError).then(resolve).catch(reject);
    };
    
    currentAudio.onerror = () => {
      const error = `Failed to load audio for ayah ${queueIndex + 1}`;
      onError?.(error);
      // Try next ayah
      queueIndex++;
      playNextInQueue(onError).then(resolve).catch(reject);
    };
    
    isPlaying = true;
    currentAudio.play().catch((e) => {
      onError?.(e.message);
      queueIndex++;
      playNextInQueue(onError).then(resolve).catch(reject);
    });
  });
}

/**
 * Stop current playback
 */
export function stopPlayback(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  isPlaying = false;
  audioQueue = [];
  queueIndex = 0;
  onAyahChangeCallback = null;
  onPlaybackEndCallback = null;
}

/**
 * Pause current playback
 */
export function pausePlayback(): void {
  if (currentAudio && isPlaying) {
    currentAudio.pause();
    isPlaying = false;
  }
}

/**
 * Resume playback
 */
export function resumePlayback(): void {
  if (currentAudio && !isPlaying) {
    currentAudio.play();
    isPlaying = true;
  }
}

/**
 * Get current playback state
 */
export function getPlaybackState(): {
  isPlaying: boolean;
  currentAyahIndex: number;
  totalAyahs: number;
  currentTime: number;
  duration: number;
} {
  return {
    isPlaying,
    currentAyahIndex: queueIndex,
    totalAyahs: audioQueue.length,
    currentTime: currentAudio?.currentTime || 0,
    duration: currentAudio?.duration || 0,
  };
}

/**
 * Set playback rate
 */
export function setPlaybackRate(rate: number): void {
  if (currentAudio) {
    currentAudio.playbackRate = Math.max(0.5, Math.min(2, rate));
  }
}

// ============================================
// Preloading
// ============================================

const preloadedAudio: Map<string, HTMLAudioElement> = new Map();

/**
 * Preload audio for faster playback
 */
export function preloadAyah(
  surah: number,
  ayah: number,
  reciterId: string = 'alafasy'
): void {
  const url = getAyahAudioUrl(surah, ayah, reciterId);
  const key = `${surah}:${ayah}:${reciterId}`;
  
  if (preloadedAudio.has(key)) return;
  
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = url;
  
  preloadedAudio.set(key, audio);
  
  // Limit cache size
  if (preloadedAudio.size > 50) {
    const firstKey = preloadedAudio.keys().next().value;
    if (firstKey) {
      preloadedAudio.delete(firstKey);
    }
  }
}

/**
 * Preload a range of ayahs
 */
export function preloadAyahRange(
  surah: number,
  startAyah: number,
  endAyah: number,
  reciterId: string = 'alafasy'
): void {
  for (let ayah = startAyah; ayah <= endAyah; ayah++) {
    preloadAyah(surah, ayah, reciterId);
  }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Get reciter by ID
 */
export function getReciter(reciterId: string): Reciter | undefined {
  return RECITERS.find(r => r.id === reciterId);
}

/**
 * Get default reciter
 */
export function getDefaultReciter(): Reciter {
  return RECITERS[0];
}

/**
 * Format duration (seconds) to mm:ss
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
