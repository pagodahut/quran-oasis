/**
 * Arabic Audio Utility
 * Provides audio playback for Arabic letters, words, and Quranic verses
 */

// ============================================
// Types
// ============================================

export interface AudioState {
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
  hasArabicVoice: boolean;
}

export interface ArabicVoice {
  voice: SpeechSynthesisVoice;
  name: string;
  lang: string;
}

// ============================================
// Voice Detection & Setup
// ============================================

let cachedArabicVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

/**
 * Get available Arabic voices
 */
export function getArabicVoices(): ArabicVoice[] {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return [];
  }
  
  const voices = window.speechSynthesis.getVoices();
  return voices
    .filter(voice => voice.lang.startsWith('ar'))
    .map(voice => ({
      voice,
      name: voice.name,
      lang: voice.lang,
    }));
}

/**
 * Get the best Arabic voice available
 * Prefers ar-SA (Saudi Arabian) for classical Arabic pronunciation
 */
export function getBestArabicVoice(): SpeechSynthesisVoice | null {
  if (cachedArabicVoice) return cachedArabicVoice;
  
  const voices = getArabicVoices();
  if (voices.length === 0) return null;
  
  // Priority order for Arabic dialects (prefer standard/classical)
  const priorities = ['ar-SA', 'ar-XA', 'ar-EG', 'ar-AE', 'ar'];
  
  for (const lang of priorities) {
    const match = voices.find(v => v.lang === lang || v.lang.startsWith(lang));
    if (match) {
      cachedArabicVoice = match.voice;
      return match.voice;
    }
  }
  
  // Fall back to first available
  cachedArabicVoice = voices[0].voice;
  return voices[0].voice;
}

/**
 * Check if Arabic TTS is available
 */
export function hasArabicTTS(): boolean {
  return getBestArabicVoice() !== null;
}

/**
 * Wait for voices to load (they load async in some browsers)
 */
export function waitForVoices(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve(false);
      return;
    }
    
    // If voices already loaded
    if (voicesLoaded || window.speechSynthesis.getVoices().length > 0) {
      voicesLoaded = true;
      resolve(hasArabicTTS());
      return;
    }
    
    // Wait for voices to load
    window.speechSynthesis.onvoiceschanged = () => {
      voicesLoaded = true;
      resolve(hasArabicTTS());
    };
    
    // Timeout fallback
    setTimeout(() => {
      voicesLoaded = true;
      resolve(hasArabicTTS());
    }, 1000);
  });
}

// ============================================
// Audio Playback Functions
// ============================================

let currentUtterance: SpeechSynthesisUtterance | null = null;

/**
 * Stop any currently playing audio
 */
export function stopAudio(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

/**
 * Play Arabic text using Web Speech API
 */
export function playArabicText(
  text: string,
  options: {
    rate?: number;      // 0.1 to 10, default 0.8 (slower for learning)
    pitch?: number;     // 0 to 2, default 1
    volume?: number;    // 0 to 1, default 1
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}
): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options.onError?.('Speech synthesis not available');
    return false;
  }
  
  const voice = getBestArabicVoice();
  if (!voice) {
    options.onError?.('No Arabic voice available');
    return false;
  }
  
  // Stop any current audio
  stopAudio();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = options.rate ?? 0.8;  // Slower for learning
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;
  
  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => {
    currentUtterance = null;
    options.onEnd?.();
  };
  utterance.onerror = (e) => {
    currentUtterance = null;
    options.onError?.(e.error || 'Unknown error');
  };
  
  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  
  return true;
}

/**
 * Play a single Arabic letter
 * Uses slower rate and may add a vowel for clarity
 */
export function playLetter(
  letter: string,
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}
): boolean {
  // For single letters, add a slight pause and use very slow rate
  return playArabicText(letter, {
    rate: 0.5,  // Very slow for single letters
    ...options,
  });
}

/**
 * Play an Arabic word
 */
export function playWord(
  word: string,
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}
): boolean {
  return playArabicText(word, {
    rate: 0.7,  // Moderate speed for words
    ...options,
  });
}

/**
 * Play a phrase or sentence
 */
export function playPhrase(
  phrase: string,
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}
): boolean {
  return playArabicText(phrase, {
    rate: 0.8,  // Normal-ish speed for phrases
    ...options,
  });
}

// ============================================
// Quranic Audio (EveryAyah.com)
// ============================================

export const QURAN_RECITERS = {
  'Mishary_Rashid_Alafasy': {
    id: 'Mishary_Rashid_Alafasy_64kbps',
    name: 'Mishary Rashid Alafasy',
    style: 'Murattal',
  },
  'Abdul_Basit_Murattal': {
    id: 'Abdul_Basit_Murattal_64kbps',
    name: 'Abdul Basit (Murattal)',
    style: 'Murattal',
  },
  'Hudhaify': {
    id: 'Hudhaify_64kbps',
    name: 'Ali Al-Hudhaify',
    style: 'Murattal',
  },
  'Minshawi_Murattal': {
    id: 'Minshawi_Murattal_128kbps',
    name: 'Mohamed Siddiq Al-Minshawi',
    style: 'Murattal',
  },
} as const;

export type ReciterId = keyof typeof QURAN_RECITERS;

/**
 * Get audio URL for a specific ayah from EveryAyah.com
 */
export function getAyahAudioUrl(
  surah: number,
  ayah: number,
  reciter: ReciterId = 'Mishary_Rashid_Alafasy'
): string {
  const reciterData = QURAN_RECITERS[reciter];
  const surahStr = String(surah).padStart(3, '0');
  const ayahStr = String(ayah).padStart(3, '0');
  return `https://everyayah.com/data/${reciterData.id}/${surahStr}${ayahStr}.mp3`;
}

/**
 * Play a specific ayah using audio element
 */
export function playAyah(
  surah: number,
  ayah: number,
  audioElement: HTMLAudioElement,
  reciter: ReciterId = 'Mishary_Rashid_Alafasy'
): void {
  const url = getAyahAudioUrl(surah, ayah, reciter);
  audioElement.src = url;
  audioElement.play();
}

// ============================================
// Letter-Specific Audio
// ============================================

// Extended letter names with pronunciation guide
export const ARABIC_LETTERS_AUDIO = {
  'أ': { name: 'Alif', sound: 'أَ', phonetic: 'a' },
  'ا': { name: 'Alif', sound: 'آ', phonetic: 'aa' },
  'ب': { name: 'Ba', sound: 'بَ', phonetic: 'ba' },
  'ت': { name: 'Ta', sound: 'تَ', phonetic: 'ta' },
  'ث': { name: 'Tha', sound: 'ثَ', phonetic: 'tha' },
  'ج': { name: 'Jeem', sound: 'جَ', phonetic: 'ja' },
  'ح': { name: 'Ha', sound: 'حَ', phonetic: 'ḥa' },
  'خ': { name: 'Kha', sound: 'خَ', phonetic: 'kha' },
  'د': { name: 'Dal', sound: 'دَ', phonetic: 'da' },
  'ذ': { name: 'Dhal', sound: 'ذَ', phonetic: 'dha' },
  'ر': { name: 'Ra', sound: 'رَ', phonetic: 'ra' },
  'ز': { name: 'Zay', sound: 'زَ', phonetic: 'za' },
  'س': { name: 'Seen', sound: 'سَ', phonetic: 'sa' },
  'ش': { name: 'Sheen', sound: 'شَ', phonetic: 'sha' },
  'ص': { name: 'Sad', sound: 'صَ', phonetic: 'ṣa' },
  'ض': { name: 'Dad', sound: 'ضَ', phonetic: 'ḍa' },
  'ط': { name: 'Ta', sound: 'طَ', phonetic: 'ṭa' },
  'ظ': { name: 'Dha', sound: 'ظَ', phonetic: 'ẓa' },
  'ع': { name: 'Ayn', sound: 'عَ', phonetic: 'ʿa' },
  'غ': { name: 'Ghayn', sound: 'غَ', phonetic: 'gha' },
  'ف': { name: 'Fa', sound: 'فَ', phonetic: 'fa' },
  'ق': { name: 'Qaf', sound: 'قَ', phonetic: 'qa' },
  'ك': { name: 'Kaf', sound: 'كَ', phonetic: 'ka' },
  'ل': { name: 'Lam', sound: 'لَ', phonetic: 'la' },
  'م': { name: 'Meem', sound: 'مَ', phonetic: 'ma' },
  'ن': { name: 'Noon', sound: 'نَ', phonetic: 'na' },
  'ه': { name: 'Ha', sound: 'هَ', phonetic: 'ha' },
  'و': { name: 'Waw', sound: 'وَ', phonetic: 'wa' },
  'ي': { name: 'Ya', sound: 'يَ', phonetic: 'ya' },
  'ء': { name: 'Hamza', sound: 'أَ', phonetic: "'" },
  'ة': { name: 'Ta Marbuta', sound: 'ةْ', phonetic: 'h/t' },
  'ى': { name: 'Alif Maqsura', sound: 'ى', phonetic: 'a' },
} as const;

/**
 * Get pronunciation data for a letter
 */
export function getLetterData(letter: string) {
  return ARABIC_LETTERS_AUDIO[letter as keyof typeof ARABIC_LETTERS_AUDIO] || null;
}

/**
 * Play a letter with its vowel sound for clarity
 */
export function playLetterSound(
  letter: string,
  options: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: string) => void;
  } = {}
): boolean {
  const letterData = getLetterData(letter);
  const textToPlay = letterData?.sound || letter;
  
  return playLetter(textToPlay, options);
}

// ============================================
// React Hook for Audio
// ============================================

/**
 * Creates audio state management for React components
 * Usage: const { play, stop, isPlaying } = useArabicAudio()
 */
export function createAudioController() {
  let isPlaying = false;
  let listeners: Set<() => void> = new Set();
  
  const notify = () => listeners.forEach(l => l());
  
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    
    getIsPlaying() {
      return isPlaying;
    },
    
    play(text: string, type: 'letter' | 'word' | 'phrase' = 'word') {
      const playFn = type === 'letter' ? playLetter : type === 'word' ? playWord : playPhrase;
      
      playFn(text, {
        onStart: () => {
          isPlaying = true;
          notify();
        },
        onEnd: () => {
          isPlaying = false;
          notify();
        },
        onError: () => {
          isPlaying = false;
          notify();
        },
      });
    },
    
    stop() {
      stopAudio();
      isPlaying = false;
      notify();
    },
  };
}
