/**
 * Quran Audio Service - Enhanced Edition
 * 
 * Features:
 * - Gapless playback between ayahs
 * - Optional crossfade transitions
 * - Integration with advanced preloading
 * - Quality selection
 * - Position persistence
 * - Background playback support
 */

import {
  preloadAudio,
  preloadNextAyahs,
  getPreloadedAudio,
  savePlaybackPosition,
  getPlaybackPosition,
  detectNetworkQuality,
  type AudioQuality,
  QUALITY_FOLDERS,
} from './audioPreload';
import { getSetting } from './settings';

// ============================================
// Reciter Configuration
// ============================================

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style: 'murattal' | 'mujawwad';
  description: string;
  hasHighQuality: boolean;
  hasMediumQuality: boolean;
}

export const RECITERS: Reciter[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    arabicName: 'مشاري راشد العفاسي',
    style: 'murattal',
    description: 'Clear, beautiful recitation perfect for memorization',
    hasHighQuality: true,
    hasMediumQuality: true,
  },
  {
    id: 'husary',
    name: 'Mahmoud Khalil Al-Husary',
    arabicName: 'محمود خليل الحصري',
    style: 'murattal',
    description: 'Classic Egyptian style, excellent for learning tajweed',
    hasHighQuality: true,
    hasMediumQuality: true,
  },
  {
    id: 'minshawi',
    name: 'Mohamed Siddiq Al-Minshawi',
    arabicName: 'محمد صديق المنشاوي',
    style: 'mujawwad',
    description: 'Melodious, emotional recitation',
    hasHighQuality: true,
    hasMediumQuality: false,
  },
  {
    id: 'sudais',
    name: 'Abdul Rahman Al-Sudais',
    arabicName: 'عبد الرحمن السديس',
    style: 'murattal',
    description: 'Imam of Masjid Al-Haram, powerful recitation',
    hasHighQuality: true,
    hasMediumQuality: true,
  },
  {
    id: 'shuraim',
    name: 'Saud Al-Shuraim',
    arabicName: 'سعود الشريم',
    style: 'murattal',
    description: 'Imam of Masjid Al-Haram, clear pronunciation',
    hasHighQuality: true,
    hasMediumQuality: true,
  },
];

// ============================================
// Audio URL Generation
// ============================================

export function getAyahAudioUrl(
  surah: number,
  ayah: number,
  reciterId: string = 'alafasy',
  quality: AudioQuality = 'high'
): string {
  const folder = QUALITY_FOLDERS[reciterId]?.[quality] || QUALITY_FOLDERS.alafasy[quality];
  const surahPadded = surah.toString().padStart(3, '0');
  const ayahPadded = ayah.toString().padStart(3, '0');
  return `https://everyayah.com/data/${folder}/${surahPadded}${ayahPadded}.mp3`;
}

export function getAyahRangeAudioUrls(
  surah: number,
  startAyah: number,
  endAyah: number,
  reciterId: string = 'alafasy',
  quality: AudioQuality = 'high'
): string[] {
  const urls: string[] = [];
  for (let ayah = startAyah; ayah <= endAyah; ayah++) {
    urls.push(getAyahAudioUrl(surah, ayah, reciterId, quality));
  }
  return urls;
}

// ============================================
// Enhanced Audio Playback Manager
// ============================================

interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSurah: number;
  currentAyah: number;
  totalAyahs: number;
  currentTime: number;
  duration: number;
  reciterId: string;
  quality: AudioQuality;
  playbackRate: number;
  volume: number;
  crossfadeEnabled: boolean;
  crossfadeDuration: number;
}

interface PlaybackCallbacks {
  onAyahChange?: (ayah: number, index: number) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
  onStateChange?: (state: PlaybackState) => void;
}

// State
let currentAudio: HTMLAudioElement | null = null;
let nextAudio: HTMLAudioElement | null = null; // For gapless playback
let crossfadeAudio: HTMLAudioElement | null = null;

let state: PlaybackState = {
  isPlaying: false,
  isPaused: false,
  currentSurah: 0,
  currentAyah: 0,
  totalAyahs: 0,
  currentTime: 0,
  duration: 0,
  reciterId: 'alafasy',
  quality: 'high',
  playbackRate: 1,
  volume: 1,
  crossfadeEnabled: false,
  crossfadeDuration: 500, // ms
};

let callbacks: PlaybackCallbacks = {};
let positionSaveInterval: ReturnType<typeof setInterval> | null = null;

// ============================================
// Core Playback Functions
// ============================================

function updateState(updates: Partial<PlaybackState>): void {
  state = { ...state, ...updates };
  callbacks.onStateChange?.(state);
}

async function loadAudio(
  surah: number,
  ayah: number,
  reciterId: string,
  quality: AudioQuality
): Promise<HTMLAudioElement> {
  // Try to get preloaded audio first
  const preloaded = getPreloadedAudio(surah, ayah, reciterId, quality);
  if (preloaded) {
    // Clone the audio element for playback
    const audio = preloaded.cloneNode(true) as HTMLAudioElement;
    return audio;
  }

  // Preload and return
  const audio = await preloadAudio(surah, ayah, reciterId, quality);
  if (!audio) {
    throw new Error(`Failed to load audio for ${surah}:${ayah}`);
  }
  return audio;
}

function setupAudioElement(audio: HTMLAudioElement): void {
  audio.playbackRate = state.playbackRate;
  audio.volume = state.volume;
}

async function prepareNextAudio(): Promise<void> {
  if (state.currentAyah >= state.totalAyahs) return;
  
  const nextAyah = state.currentAyah + 1;
  
  try {
    nextAudio = await loadAudio(
      state.currentSurah,
      nextAyah,
      state.reciterId,
      state.quality
    );
    setupAudioElement(nextAudio);
  } catch {
    nextAudio = null;
  }
}

// ============================================
// Crossfade Support
// ============================================

function crossfadeTo(newAudio: HTMLAudioElement, duration: number): void {
  if (!currentAudio) {
    newAudio.play();
    return;
  }

  const oldAudio = currentAudio;
  crossfadeAudio = oldAudio;
  
  const steps = 20;
  const stepDuration = duration / steps;
  const volumeStep = state.volume / steps;
  
  let step = 0;
  
  newAudio.volume = 0;
  newAudio.play();
  
  const fadeInterval = setInterval(() => {
    step++;
    
    if (crossfadeAudio) {
      crossfadeAudio.volume = Math.max(0, state.volume - (volumeStep * step));
    }
    newAudio.volume = Math.min(state.volume, volumeStep * step);
    
    if (step >= steps) {
      clearInterval(fadeInterval);
      if (crossfadeAudio) {
        crossfadeAudio.pause();
        crossfadeAudio = null;
      }
    }
  }, stepDuration);
}

// ============================================
// Public API
// ============================================

/**
 * Play a single ayah
 */
export async function playAyah(
  surah: number,
  ayah: number,
  options: {
    reciterId?: string;
    quality?: AudioQuality;
    totalAyahs?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}
): Promise<void> {
  const {
    reciterId = getSetting('reciter') || 'alafasy',
    quality = detectNetworkQuality(),
    totalAyahs = ayah,
    onStart,
    onEnd,
    onError,
  } = options;

  stopPlayback();

  callbacks.onLoading?.(true);
  
  try {
    const audio = await loadAudio(surah, ayah, reciterId, quality);
    setupAudioElement(audio);
    
    currentAudio = audio;
    
    updateState({
      isPlaying: true,
      isPaused: false,
      currentSurah: surah,
      currentAyah: ayah,
      totalAyahs,
      reciterId,
      quality,
    });

    audio.onloadedmetadata = () => {
      updateState({ duration: audio.duration });
    };

    audio.ontimeupdate = () => {
      updateState({ currentTime: audio.currentTime });
      callbacks.onTimeUpdate?.(audio.currentTime, audio.duration);
    };

    audio.onended = () => {
      updateState({ isPlaying: false });
      onEnd?.();
      callbacks.onEnd?.();
    };

    audio.onerror = () => {
      const error = 'Failed to play audio';
      updateState({ isPlaying: false });
      onError?.(error);
      callbacks.onError?.(error);
    };

    await audio.play();
    onStart?.();
    callbacks.onLoading?.(false);
    
    // Preload next ayahs
    preloadNextAyahs(surah, ayah, totalAyahs, reciterId, quality);
    
  } catch (error) {
    callbacks.onLoading?.(false);
    onError?.(error instanceof Error ? error.message : 'Failed to play');
    throw error;
  }
}

/**
 * Play a range of ayahs with gapless playback
 */
export async function playAyahRange(
  surah: number,
  startAyah: number,
  endAyah: number,
  options: {
    reciterId?: string;
    quality?: AudioQuality;
    crossfade?: boolean;
    crossfadeDuration?: number;
  } = {},
  playbackCallbacks: PlaybackCallbacks = {}
): Promise<void> {
  const {
    reciterId = getSetting('reciter') || 'alafasy',
    quality = detectNetworkQuality(),
    crossfade = false,
    crossfadeDuration = 500,
  } = options;

  stopPlayback();
  
  callbacks = playbackCallbacks;
  
  updateState({
    currentSurah: surah,
    currentAyah: startAyah,
    totalAyahs: endAyah,
    reciterId,
    quality,
    crossfadeEnabled: crossfade,
    crossfadeDuration,
  });

  // Start position saving
  startPositionSaving();

  // Start playback
  await playCurrentAyah();
}

async function playCurrentAyah(): Promise<void> {
  const { currentSurah, currentAyah, totalAyahs, reciterId, quality } = state;

  if (currentAyah > totalAyahs) {
    stopPlayback();
    callbacks.onEnd?.();
    return;
  }

  callbacks.onLoading?.(true);

  try {
    // Use pre-prepared next audio if available
    let audio: HTMLAudioElement;
    
    if (nextAudio && currentAyah > 1) {
      audio = nextAudio;
      nextAudio = null;
    } else {
      audio = await loadAudio(currentSurah, currentAyah, reciterId, quality);
      setupAudioElement(audio);
    }

    // Crossfade or immediate switch
    if (state.crossfadeEnabled && currentAudio) {
      crossfadeTo(audio, state.crossfadeDuration);
    }
    
    currentAudio = audio;
    updateState({ isPlaying: true, isPaused: false });
    
    callbacks.onAyahChange?.(currentAyah, currentAyah - 1);

    audio.onloadedmetadata = () => {
      updateState({ duration: audio.duration });
    };

    audio.ontimeupdate = () => {
      updateState({ currentTime: audio.currentTime });
      callbacks.onTimeUpdate?.(audio.currentTime, audio.duration);
    };

    audio.onended = () => {
      updateState({ currentAyah: state.currentAyah + 1 });
      playCurrentAyah();
    };

    audio.onerror = () => {
      callbacks.onError?.(`Failed to play ayah ${currentAyah}`);
      // Try next ayah
      updateState({ currentAyah: state.currentAyah + 1 });
      playCurrentAyah();
    };

    if (!state.crossfadeEnabled || !crossfadeAudio) {
      await audio.play();
    }
    
    callbacks.onLoading?.(false);

    // Prepare next audio for gapless playback
    prepareNextAudio();

    // Preload more ayahs ahead
    preloadNextAyahs(currentSurah, currentAyah, totalAyahs, reciterId, quality, 5);

  } catch (error) {
    callbacks.onLoading?.(false);
    callbacks.onError?.(error instanceof Error ? error.message : 'Playback error');
    
    // Try next ayah
    updateState({ currentAyah: state.currentAyah + 1 });
    playCurrentAyah();
  }
}

/**
 * Stop playback completely
 */
export function stopPlayback(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  
  if (nextAudio) {
    nextAudio = null;
  }
  
  if (crossfadeAudio) {
    crossfadeAudio.pause();
    crossfadeAudio = null;
  }

  stopPositionSaving();

  updateState({
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
  });
  
  callbacks = {};
}

/**
 * Pause playback
 */
export function pausePlayback(): void {
  if (currentAudio && state.isPlaying) {
    currentAudio.pause();
    updateState({ isPlaying: false, isPaused: true });
  }
}

/**
 * Resume playback
 */
export function resumePlayback(): void {
  if (currentAudio && state.isPaused) {
    currentAudio.play();
    updateState({ isPlaying: true, isPaused: false });
  }
}

/**
 * Toggle play/pause
 */
export function togglePlayback(): void {
  if (state.isPlaying) {
    pausePlayback();
  } else if (state.isPaused) {
    resumePlayback();
  }
}

/**
 * Seek within current audio
 */
export function seekTo(time: number): void {
  if (currentAudio) {
    currentAudio.currentTime = Math.max(0, Math.min(time, currentAudio.duration));
    updateState({ currentTime: currentAudio.currentTime });
  }
}

/**
 * Skip to a specific ayah
 */
export async function skipToAyah(ayah: number): Promise<void> {
  if (ayah < 1 || ayah > state.totalAyahs) return;
  
  updateState({ currentAyah: ayah });
  
  if (currentAudio) {
    currentAudio.pause();
  }
  
  await playCurrentAyah();
}

/**
 * Set playback rate
 */
export function setPlaybackRate(rate: number): void {
  const clampedRate = Math.max(0.5, Math.min(2, rate));
  
  if (currentAudio) {
    currentAudio.playbackRate = clampedRate;
  }
  
  updateState({ playbackRate: clampedRate });
}

/**
 * Set volume
 */
export function setVolume(volume: number): void {
  const clampedVolume = Math.max(0, Math.min(1, volume));
  
  if (currentAudio) {
    currentAudio.volume = clampedVolume;
  }
  
  updateState({ volume: clampedVolume });
}

/**
 * Get current playback state
 */
export function getPlaybackState(): PlaybackState {
  return { ...state };
}

/**
 * Subscribe to state changes
 */
export function onStateChange(callback: (state: PlaybackState) => void): () => void {
  callbacks.onStateChange = callback;
  return () => {
    callbacks.onStateChange = undefined;
  };
}

// ============================================
// Position Persistence
// ============================================

function startPositionSaving(): void {
  stopPositionSaving();
  
  positionSaveInterval = setInterval(() => {
    if (state.isPlaying && state.currentSurah > 0) {
      savePlaybackPosition(
        state.currentSurah,
        state.currentAyah,
        state.currentTime
      );
    }
  }, 5000); // Save every 5 seconds
}

function stopPositionSaving(): void {
  if (positionSaveInterval) {
    clearInterval(positionSaveInterval);
    positionSaveInterval = null;
  }
  
  // Save final position
  if (state.currentSurah > 0) {
    savePlaybackPosition(
      state.currentSurah,
      state.currentAyah,
      state.currentTime
    );
  }
}

export { getPlaybackPosition };

// ============================================
// Quick Reciter Switching
// ============================================

/**
 * Change reciter without restarting playback
 */
export async function changeReciter(newReciterId: string): Promise<void> {
  if (newReciterId === state.reciterId) return;
  
  const wasPlaying = state.isPlaying;
  const currentAyah = state.currentAyah;
  const currentTime = state.currentTime;
  
  // Update state
  updateState({ reciterId: newReciterId });
  
  // If currently playing, reload current ayah with new reciter
  if (wasPlaying || state.isPaused) {
    if (currentAudio) {
      currentAudio.pause();
    }
    
    try {
      const audio = await loadAudio(
        state.currentSurah,
        currentAyah,
        newReciterId,
        state.quality
      );
      
      setupAudioElement(audio);
      currentAudio = audio;
      
      // Try to restore position
      if (currentTime > 0 && currentTime < audio.duration) {
        audio.currentTime = currentTime;
      }
      
      if (wasPlaying) {
        audio.play();
        updateState({ isPlaying: true, isPaused: false });
      }
      
      // Re-prepare next audio
      prepareNextAudio();
      
    } catch (error) {
      callbacks.onError?.('Failed to switch reciter');
    }
  }
}

/**
 * Change audio quality
 */
export async function changeQuality(newQuality: AudioQuality): Promise<void> {
  if (newQuality === state.quality) return;
  
  const wasPlaying = state.isPlaying;
  const currentAyah = state.currentAyah;
  const currentTime = state.currentTime;
  
  updateState({ quality: newQuality });
  
  if (wasPlaying || state.isPaused) {
    if (currentAudio) {
      currentAudio.pause();
    }
    
    try {
      const audio = await loadAudio(
        state.currentSurah,
        currentAyah,
        state.reciterId,
        newQuality
      );
      
      setupAudioElement(audio);
      currentAudio = audio;
      
      if (currentTime > 0 && currentTime < audio.duration) {
        audio.currentTime = currentTime;
      }
      
      if (wasPlaying) {
        audio.play();
        updateState({ isPlaying: true, isPaused: false });
      }
      
      prepareNextAudio();
      
    } catch (error) {
      callbacks.onError?.('Failed to switch quality');
    }
  }
}

// ============================================
// Reciter Preview
// ============================================

let previewAudio: HTMLAudioElement | null = null;

/**
 * Play a short preview of a reciter (Al-Fatiha verse 1)
 */
export async function playReciterPreview(
  reciterId: string,
  onEnd?: () => void
): Promise<void> {
  stopReciterPreview();
  
  const url = getAyahAudioUrl(1, 1, reciterId, 'high');
  
  previewAudio = new Audio(url);
  previewAudio.volume = state.volume;
  
  previewAudio.onended = () => {
    previewAudio = null;
    onEnd?.();
  };
  
  previewAudio.onerror = () => {
    previewAudio = null;
    onEnd?.();
  };
  
  try {
    await previewAudio.play();
  } catch {
    previewAudio = null;
    onEnd?.();
  }
}

/**
 * Stop reciter preview
 */
export function stopReciterPreview(): void {
  if (previewAudio) {
    previewAudio.pause();
    previewAudio = null;
  }
}

/**
 * Check if preview is playing
 */
export function isPreviewPlaying(): boolean {
  return previewAudio !== null && !previewAudio.paused;
}

// ============================================
// Helper Functions
// ============================================

export function getReciter(reciterId: string): Reciter | undefined {
  return RECITERS.find(r => r.id === reciterId);
}

export function getDefaultReciter(): Reciter {
  return RECITERS[0];
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Export types
export type { AudioQuality, PlaybackState, PlaybackCallbacks };
