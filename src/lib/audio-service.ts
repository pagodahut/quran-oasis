/**
 * Quran Oasis - Comprehensive Audio Service
 * 
 * Provides audio for:
 * - Quranic recitation (EveryAyah.com, Quran.com API)
 * - Arabic letter/word pronunciation (existing audioService)
 * - Lesson audio segments with repeat/loop support
 * 
 * Audio URL Patterns:
 * - EveryAyah.com: https://everyayah.com/data/{reciter_folder}/{surah:03d}{ayah:03d}.mp3
 * - Quran.com API: https://api.quran.com/api/v4/recitations/{reciter_id}/by_ayah/{surah}:{ayah}
 * 
 * Supported Reciters (EveryAyah.com folders):
 * - Alafasy_128kbps (Mishary Rashid Alafasy)
 * - Husary_128kbps (Mahmoud Khalil Al-Husary)
 * - Abdul_Basit_Mujawwad_128kbps (Abdul Basit - Mujawwad)
 * - Abdurrahmaan_As-Sudais_192kbps (Abdul Rahman Al-Sudais)
 * - Ghamadi_40kbps (Saad Al-Ghamdi)
 * - Minshawi_Mujawwad_128kbps (Mohamed Siddiq Al-Minshawi)
 * - Shuraim_128kbps (Saud Al-Shuraim)
 */

// ============================================
// Types & Interfaces
// ============================================

export interface AudioReciter {
  id: string;
  name: string;
  arabicName: string;
  style: 'murattal' | 'mujawwad';
  description: string;
  everyAyahFolder: string;
  quranComId?: number; // Quran.com reciter ID
  qualities: AudioQuality[];
}

export type AudioQuality = 'high' | 'medium' | 'low';

export interface AudioConfig {
  surah: number;
  ayahStart: number;
  ayahEnd?: number;
  reciterId?: string;
  quality?: AudioQuality;
  repeat?: number; // Number of times to repeat (1 = play once)
  loopAyah?: boolean; // Loop individual ayah before moving to next
  pauseBetweenAyahs?: number; // Milliseconds
  playbackRate?: number;
}

export interface ListenRepeatConfig extends AudioConfig {
  mode: 'listen-first' | 'listen-repeat' | 'repeat-only';
  repeatCount: number; // Times user should repeat
  showTransliteration?: boolean;
  showTranslation?: boolean;
  recordUserAudio?: boolean;
}

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentSurah: number;
  currentAyah: number;
  currentRepeat: number;
  totalRepeats: number;
  progress: number; // 0-1
  duration: number;
  error?: string;
}

export interface PlaybackCallbacks {
  onStateChange?: (state: PlaybackState) => void;
  onAyahChange?: (surah: number, ayah: number) => void;
  onRepeatChange?: (currentRepeat: number, totalRepeats: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

// ============================================
// Reciter Configuration
// ============================================

export const RECITERS: AudioReciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'murattal',
    description: 'Clear, beautiful recitation - perfect for memorization',
    everyAyahFolder: 'Alafasy_128kbps',
    quranComId: 7,
    qualities: ['high', 'medium'],
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'murattal',
    description: 'Classic Egyptian style - excellent for learning tajweed',
    everyAyahFolder: 'Husary_128kbps',
    quranComId: 5,
    qualities: ['high', 'medium'],
  },
  {
    id: 'abdul_basit',
    name: 'Abdul Basit Abdul Samad',
    arabicName: 'عبدالباسط عبدالصمد',
    style: 'mujawwad',
    description: 'Legendary Egyptian reciter - melodious and emotional',
    everyAyahFolder: 'Abdul_Basit_Mujawwad_128kbps',
    quranComId: 1,
    qualities: ['high'],
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبدالرحمن السديس',
    style: 'murattal',
    description: 'Imam of Masjid Al-Haram - powerful and clear',
    everyAyahFolder: 'Abdurrahmaan_As-Sudais_192kbps',
    quranComId: 2,
    qualities: ['high', 'medium'],
  },
  {
    id: 'minshawi',
    name: 'Mohamed Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'mujawwad',
    description: 'Beautiful melodious recitation - deeply moving',
    everyAyahFolder: 'Minshawi_Mujawwad_128kbps',
    quranComId: 6,
    qualities: ['high'],
  },
  {
    id: 'shuraim',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    style: 'murattal',
    description: 'Imam of Masjid Al-Haram - clear and measured',
    everyAyahFolder: 'Shuraim_128kbps',
    quranComId: 3,
    qualities: ['high', 'medium'],
  },
  {
    id: 'ghamadi',
    name: 'Saad Al-Ghamdi',
    arabicName: 'سعد الغامدي',
    style: 'murattal',
    description: 'Clear recitation - good for beginners',
    everyAyahFolder: 'Ghamadi_40kbps',
    quranComId: 4,
    qualities: ['low'],
  },
];

// Quality folder mapping for EveryAyah.com
const QUALITY_FOLDERS: Record<string, Record<AudioQuality, string>> = {
  alafasy: {
    high: 'Alafasy_128kbps',
    medium: 'Alafasy_64kbps',
    low: 'Alafasy_32kbps',
  },
  husary: {
    high: 'Husary_128kbps',
    medium: 'Husary_64kbps',
    low: 'Husary_Muallim_128kbps', // Teaching version
  },
  abdul_basit: {
    high: 'Abdul_Basit_Mujawwad_128kbps',
    medium: 'Abdul_Basit_Murattal_192kbps',
    low: 'Abdul_Basit_Murattal_64kbps',
  },
  sudais: {
    high: 'Abdurrahmaan_As-Sudais_192kbps',
    medium: 'Abdurrahmaan_As-Sudais_64kbps',
    low: 'Abdurrahmaan_As-Sudais_32kbps',
  },
  minshawi: {
    high: 'Minshawi_Mujawwad_128kbps',
    medium: 'Minshawi_Murattal_128kbps',
    low: 'Minshawi_Murattal_32kbps',
  },
  shuraim: {
    high: 'Shuraim_128kbps',
    medium: 'Shuraim_64kbps',
    low: 'Shuraim_32kbps',
  },
  ghamadi: {
    high: 'Ghamadi_40kbps',
    medium: 'Ghamadi_40kbps',
    low: 'Ghamadi_40kbps',
  },
};

// ============================================
// URL Generation
// ============================================

/**
 * Get audio URL for a specific ayah from EveryAyah.com
 * 
 * URL Pattern: https://everyayah.com/data/{folder}/{surah:03d}{ayah:03d}.mp3
 * Example: https://everyayah.com/data/Alafasy_128kbps/001001.mp3 (Al-Fatiha:1)
 */
export function getAyahAudioUrl(
  surah: number,
  ayah: number,
  reciterId: string = 'alafasy',
  quality: AudioQuality = 'high'
): string {
  const folder = QUALITY_FOLDERS[reciterId]?.[quality] || 
                 QUALITY_FOLDERS.alafasy[quality] ||
                 'Alafasy_128kbps';
  
  const surahStr = surah.toString().padStart(3, '0');
  const ayahStr = ayah.toString().padStart(3, '0');
  
  return `https://everyayah.com/data/${folder}/${surahStr}${ayahStr}.mp3`;
}

/**
 * Get audio URLs for a range of ayahs
 */
export function getAyahRangeUrls(
  surah: number,
  ayahStart: number,
  ayahEnd: number,
  reciterId: string = 'alafasy',
  quality: AudioQuality = 'high'
): string[] {
  const urls: string[] = [];
  for (let ayah = ayahStart; ayah <= ayahEnd; ayah++) {
    urls.push(getAyahAudioUrl(surah, ayah, reciterId, quality));
  }
  return urls;
}

/**
 * Get Bismillah audio (Surah 1, Ayah 1)
 */
export function getBismillahUrl(reciterId: string = 'alafasy'): string {
  return getAyahAudioUrl(1, 1, reciterId);
}

/**
 * Generate audio config for a lesson step
 */
export function createAudioConfig(
  surah: number,
  ayahStart: number,
  ayahEnd?: number,
  options?: Partial<AudioConfig>
): AudioConfig {
  return {
    surah,
    ayahStart,
    ayahEnd: ayahEnd ?? ayahStart,
    reciterId: options?.reciterId ?? 'alafasy',
    quality: options?.quality ?? 'high',
    repeat: options?.repeat ?? 1,
    loopAyah: options?.loopAyah ?? false,
    pauseBetweenAyahs: options?.pauseBetweenAyahs ?? 500,
    playbackRate: options?.playbackRate ?? 1,
  };
}

/**
 * Create a listen-repeat configuration for memorization practice
 */
export function createListenRepeatConfig(
  surah: number,
  ayahStart: number,
  ayahEnd?: number,
  options?: Partial<ListenRepeatConfig>
): ListenRepeatConfig {
  return {
    ...createAudioConfig(surah, ayahStart, ayahEnd, options),
    mode: options?.mode ?? 'listen-repeat',
    repeatCount: options?.repeatCount ?? 3,
    showTransliteration: options?.showTransliteration ?? true,
    showTranslation: options?.showTranslation ?? true,
    recordUserAudio: options?.recordUserAudio ?? false,
  };
}

// ============================================
// Audio Playback Manager
// ============================================

let currentAudio: HTMLAudioElement | null = null;
let playbackState: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentSurah: 0,
  currentAyah: 0,
  currentRepeat: 0,
  totalRepeats: 1,
  progress: 0,
  duration: 0,
};
let callbacks: PlaybackCallbacks = {};

function updateState(updates: Partial<PlaybackState>): void {
  playbackState = { ...playbackState, ...updates };
  callbacks.onStateChange?.(playbackState);
}

/**
 * Stop all audio playback
 */
export function stopAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  updateState({
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    progress: 0,
  });
}

/**
 * Pause current audio
 */
export function pauseAudio(): void {
  if (currentAudio && playbackState.isPlaying) {
    currentAudio.pause();
    updateState({ isPlaying: false, isPaused: true });
  }
}

/**
 * Resume paused audio
 */
export function resumeAudio(): void {
  if (currentAudio && playbackState.isPaused) {
    currentAudio.play();
    updateState({ isPlaying: true, isPaused: false });
  }
}

/**
 * Play a single ayah
 */
export async function playAyah(
  surah: number,
  ayah: number,
  options?: {
    reciterId?: string;
    quality?: AudioQuality;
    playbackRate?: number;
    onEnd?: () => void;
    onError?: (error: string) => void;
  }
): Promise<void> {
  stopAudio();
  
  const url = getAyahAudioUrl(
    surah,
    ayah,
    options?.reciterId ?? 'alafasy',
    options?.quality ?? 'high'
  );
  
  updateState({
    isLoading: true,
    currentSurah: surah,
    currentAyah: ayah,
  });
  
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;
    
    if (options?.playbackRate) {
      audio.playbackRate = options.playbackRate;
    }
    
    audio.onloadedmetadata = () => {
      updateState({ duration: audio.duration, isLoading: false });
    };
    
    audio.ontimeupdate = () => {
      updateState({ progress: audio.currentTime / audio.duration });
    };
    
    audio.oncanplaythrough = () => {
      updateState({ isLoading: false });
      audio.play()
        .then(() => {
          updateState({ isPlaying: true });
        })
        .catch((err) => {
          updateState({ isPlaying: false, error: err.message });
          options?.onError?.(err.message);
          reject(err);
        });
    };
    
    audio.onended = () => {
      updateState({ isPlaying: false, progress: 1 });
      options?.onEnd?.();
      resolve();
    };
    
    audio.onerror = () => {
      const error = `Failed to load audio for ${surah}:${ayah}`;
      updateState({ isLoading: false, error });
      options?.onError?.(error);
      reject(new Error(error));
    };
  });
}

/**
 * Play a range of ayahs with optional repeat
 */
export async function playAyahRange(
  config: AudioConfig,
  playbackCallbacks?: PlaybackCallbacks
): Promise<void> {
  stopAudio();
  
  if (playbackCallbacks) {
    callbacks = playbackCallbacks;
  }
  
  const { surah, ayahStart, ayahEnd = ayahStart, repeat = 1, loopAyah = false } = config;
  const totalAyahs = ayahEnd - ayahStart + 1;
  
  updateState({
    currentSurah: surah,
    currentAyah: ayahStart,
    totalRepeats: repeat,
    currentRepeat: 1,
  });
  
  for (let repeatIndex = 0; repeatIndex < repeat; repeatIndex++) {
    updateState({ currentRepeat: repeatIndex + 1 });
    callbacks.onRepeatChange?.(repeatIndex + 1, repeat);
    
    for (let ayah = ayahStart; ayah <= ayahEnd; ayah++) {
      if (loopAyah && config.repeat && config.repeat > 1) {
        // Loop individual ayah
        for (let ayahRepeat = 0; ayahRepeat < (config.repeat || 1); ayahRepeat++) {
          await playAyah(surah, ayah, {
            reciterId: config.reciterId,
            quality: config.quality,
            playbackRate: config.playbackRate,
          });
          
          if (config.pauseBetweenAyahs && ayahRepeat < (config.repeat || 1) - 1) {
            await delay(config.pauseBetweenAyahs);
          }
        }
      } else {
        updateState({ currentAyah: ayah });
        callbacks.onAyahChange?.(surah, ayah);
        
        await playAyah(surah, ayah, {
          reciterId: config.reciterId,
          quality: config.quality,
          playbackRate: config.playbackRate,
        });
        
        if (config.pauseBetweenAyahs && ayah < ayahEnd) {
          await delay(config.pauseBetweenAyahs);
        }
      }
    }
  }
  
  callbacks.onComplete?.();
}

/**
 * Play audio for a listen-repeat exercise
 * Returns after the listening phase; caller handles user repeat timing
 */
export async function playListenRepeat(
  config: ListenRepeatConfig,
  playbackCallbacks?: PlaybackCallbacks
): Promise<void> {
  if (playbackCallbacks) {
    callbacks = playbackCallbacks;
  }
  
  const { mode, repeatCount } = config;
  
  if (mode === 'repeat-only') {
    // User repeats without hearing first
    return;
  }
  
  // Play the audio (listen phase)
  await playAyahRange({
    ...config,
    repeat: 1, // Play once for listening
  }, playbackCallbacks);
  
  if (mode === 'listen-first') {
    // Just play once, user repeats separately
    return;
  }
  
  // For listen-repeat mode, we could loop here
  // but typically the UI handles the repeat cycles
}

// ============================================
// Utility Functions
// ============================================

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Get reciter by ID
 */
export function getReciter(reciterId: string): AudioReciter | undefined {
  return RECITERS.find(r => r.id === reciterId);
}

/**
 * Get default reciter
 */
export function getDefaultReciter(): AudioReciter {
  return RECITERS[0];
}

/**
 * Get current playback state
 */
export function getPlaybackState(): PlaybackState {
  return { ...playbackState };
}

/**
 * Check if audio is currently playing
 */
export function isPlaying(): boolean {
  return playbackState.isPlaying;
}

/**
 * Set playback rate (0.5 - 2.0)
 */
export function setPlaybackRate(rate: number): void {
  const clampedRate = Math.max(0.5, Math.min(2, rate));
  if (currentAudio) {
    currentAudio.playbackRate = clampedRate;
  }
}

/**
 * Preload audio for a range of ayahs (for smoother playback)
 */
export function preloadAyahRange(
  surah: number,
  ayahStart: number,
  ayahEnd: number,
  reciterId: string = 'alafasy',
  quality: AudioQuality = 'high'
): void {
  for (let ayah = ayahStart; ayah <= ayahEnd; ayah++) {
    const url = getAyahAudioUrl(surah, ayah, reciterId, quality);
    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = url;
  }
}

/**
 * Generate a shareable audio link for an ayah
 */
export function getShareableAudioLink(surah: number, ayah: number): string {
  // Use Quran.com for sharing (more user-friendly)
  return `https://quran.com/${surah}/${ayah}`;
}

// ============================================
// Quran.com API Integration (Alternative Source)
// ============================================

interface QuranComAudioResponse {
  audio_files: Array<{
    url: string;
    verse_key: string;
  }>;
}

/**
 * Fetch audio URL from Quran.com API
 * Fallback option if EveryAyah is unavailable
 */
export async function fetchQuranComAudioUrl(
  surah: number,
  ayah: number,
  reciterId: number = 7 // Default: Alafasy
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/recitations/${reciterId}/by_ayah/${surah}:${ayah}`
    );
    
    if (!response.ok) {
      return null;
    }
    
    const data: QuranComAudioResponse = await response.json();
    
    if (data.audio_files?.[0]?.url) {
      // Quran.com URLs are relative, prepend the base
      const audioUrl = data.audio_files[0].url;
      if (audioUrl.startsWith('http')) {
        return audioUrl;
      }
      return `https://audio.qurancdn.com/${audioUrl}`;
    }
    
    return null;
  } catch {
    return null;
  }
}

// Types are exported inline with their definitions above
