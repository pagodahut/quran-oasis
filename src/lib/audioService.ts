/**
 * Enhanced Arabic Audio Service
 * 
 * Priority order:
 * 1. ElevenLabs API (highest quality, requires API key)
 * 2. Pre-recorded audio files (free, high quality for letters)
 * 3. Web Speech API (fallback, poor quality)
 */

// ============================================
// Configuration
// ============================================

const ELEVENLABS_API_KEY = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

// Arabic voice ID for ElevenLabs - "Rachel" supports Arabic well
// You can change this to a native Arabic speaker voice
const ELEVENLABS_VOICE_ID = process.env.NEXT_PUBLIC_ELEVENLABS_VOICE_ID || 'EXAVITQu4vr4xnSDxMaL';

// Pre-recorded audio URLs for Arabic letters
// Using IslamCan.com free educational audio (with attribution)
// These are actual letter SOUNDS, not letter names being read by TTS
const ISLAMCAN_AUDIO_BASE = 'https://islamcan.com/learn-arabic/arabic-alphabets/';

// ============================================
// Types
// ============================================

export type AudioProvider = 'elevenlabs' | 'recorded' | 'webspeech';

export interface AudioOptions {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  rate?: number;
  provider?: AudioProvider;
}

interface LetterAudioMap {
  [key: string]: {
    name: string;
    nameArabic: string;
    soundFile: string;
    phonetic: string;
  };
}

// ============================================
// Letter Audio Mapping
// ============================================

// Mapping to IslamCan.com audio files (actual letter sounds)
export const LETTER_AUDIO: LetterAudioMap = {
  'أ': { name: 'Alif', nameArabic: 'أَلِف', soundFile: '001-alif.mp3', phonetic: 'a' },
  'ا': { name: 'Alif', nameArabic: 'أَلِف', soundFile: '001-alif.mp3', phonetic: 'aa' },
  'ب': { name: 'Ba', nameArabic: 'بَاء', soundFile: 'ba.mp3', phonetic: 'b' },
  'ت': { name: 'Ta', nameArabic: 'تَاء', soundFile: '003-taa.mp3', phonetic: 't' },
  'ث': { name: 'Tha', nameArabic: 'ثَاء', soundFile: '004-tha.mp3', phonetic: 'th' },
  'ج': { name: 'Jeem', nameArabic: 'جِيم', soundFile: '005-jeem.mp3', phonetic: 'j' },
  'ح': { name: 'Ha', nameArabic: 'حَاء', soundFile: '006-haa.mp3', phonetic: 'ḥ' },
  'خ': { name: 'Kha', nameArabic: 'خَاء', soundFile: '007-khaa.mp3', phonetic: 'kh' },
  'د': { name: 'Dal', nameArabic: 'دَال', soundFile: '008-dal.mp3', phonetic: 'd' },
  'ذ': { name: 'Dhal', nameArabic: 'ذَال', soundFile: '009-dhal.mp3', phonetic: 'dh' },
  'ر': { name: 'Ra', nameArabic: 'رَاء', soundFile: '010-raa.mp3', phonetic: 'r' },
  'ز': { name: 'Zay', nameArabic: 'زَاي', soundFile: '011-jaa.mp3', phonetic: 'z' },
  'س': { name: 'Seen', nameArabic: 'سِين', soundFile: '012-seen.mp3', phonetic: 's' },
  'ش': { name: 'Sheen', nameArabic: 'شِين', soundFile: '013-sheen.mp3', phonetic: 'sh' },
  'ص': { name: 'Sad', nameArabic: 'صَاد', soundFile: '014-saad.mp3', phonetic: 'ṣ' },
  'ض': { name: 'Dad', nameArabic: 'ضَاد', soundFile: '015-dhaad.mp3', phonetic: 'ḍ' },
  'ط': { name: 'Ta', nameArabic: 'طَاء', soundFile: '016-toa.mp3', phonetic: 'ṭ' },
  'ظ': { name: 'Dha', nameArabic: 'ظَاء', soundFile: '017-dhaa.mp3', phonetic: 'ẓ' },
  'ع': { name: 'Ayn', nameArabic: 'عَين', soundFile: '018-ain.mp3', phonetic: 'ʿ' },
  'غ': { name: 'Ghayn', nameArabic: 'غَين', soundFile: '019-ghain.mp3', phonetic: 'gh' },
  'ف': { name: 'Fa', nameArabic: 'فَاء', soundFile: '020-faa.mp3', phonetic: 'f' },
  'ق': { name: 'Qaf', nameArabic: 'قَاف', soundFile: '021-qaaf.mp3', phonetic: 'q' },
  'ك': { name: 'Kaf', nameArabic: 'كَاف', soundFile: '022-kaaf.mp3', phonetic: 'k' },
  'ل': { name: 'Lam', nameArabic: 'لَام', soundFile: '023-laam.mp3', phonetic: 'l' },
  'م': { name: 'Meem', nameArabic: 'مِيم', soundFile: '024-meem.mp3', phonetic: 'm' },
  'ن': { name: 'Noon', nameArabic: 'نُون', soundFile: '025-noon.mp3', phonetic: 'n' },
  'ه': { name: 'Ha', nameArabic: 'هَاء', soundFile: '027-ha.mp3', phonetic: 'h' },
  'و': { name: 'Waw', nameArabic: 'وَاو', soundFile: '026-waw.mp3', phonetic: 'w' },
  'ي': { name: 'Ya', nameArabic: 'يَاء', soundFile: '029-yaa.mp3', phonetic: 'y' },
  'ء': { name: 'Hamza', nameArabic: 'هَمْزَة', soundFile: '028-hamza.mp3', phonetic: "'" },
  'ة': { name: 'Ta Marbuta', nameArabic: 'تَاء مَرْبُوطَة', soundFile: '003-taa.mp3', phonetic: 'h/t' },
  'ى': { name: 'Alif Maqsura', nameArabic: 'أَلِف مَقْصُورَة', soundFile: '001-alif.mp3', phonetic: 'a' },
};

// ============================================
// Audio Element Management
// ============================================

let currentAudio: HTMLAudioElement | null = null;

export function stopAllAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// ============================================
// ElevenLabs TTS
// ============================================

async function playWithElevenLabs(
  text: string,
  options: AudioOptions = {}
): Promise<boolean> {
  if (!ELEVENLABS_API_KEY) {
    return false;
  }

  try {
    options.onStart?.();
    
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    return new Promise((resolve) => {
      const audio = new Audio(audioUrl);
      currentAudio = audio;
      
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        options.onEnd?.();
        resolve(true);
      };
      
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudio = null;
        options.onError?.('Audio playback failed');
        resolve(false);
      };
      
      audio.play().catch((e) => {
        options.onError?.(e.message);
        resolve(false);
      });
    });
  } catch (error) {
    options.onError?.(error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

// ============================================
// Pre-recorded Audio
// ============================================

function getLetterAudioUrl(letter: string): string | null {
  const cleanLetter = letter.replace(/[\u064B-\u0652]/g, ''); // Remove tashkeel
  const letterData = LETTER_AUDIO[cleanLetter];
  
  if (!letterData) return null;
  
  // Use IslamCan.com audio CDN for actual letter sounds
  return `${ISLAMCAN_AUDIO_BASE}${letterData.soundFile}`;
}

async function playRecordedAudio(
  letter: string,
  options: AudioOptions = {}
): Promise<boolean> {
  const audioUrl = getLetterAudioUrl(letter);
  if (!audioUrl) return false;

  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    currentAudio = audio;
    
    audio.oncanplaythrough = () => {
      options.onStart?.();
    };
    
    audio.onended = () => {
      currentAudio = null;
      options.onEnd?.();
      resolve(true);
    };
    
    audio.onerror = () => {
      currentAudio = null;
      // Silent fail - will fallback to other methods
      resolve(false);
    };
    
    audio.play().catch(() => {
      resolve(false);
    });
  });
}

// ============================================
// Web Speech API (Fallback)
// ============================================

function playWithWebSpeech(
  text: string,
  options: AudioOptions = {}
): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    options.onError?.('Speech synthesis not available');
    return false;
  }

  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
  
  if (!arabicVoice) {
    options.onError?.('No Arabic voice available');
    return false;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = arabicVoice;
  utterance.lang = arabicVoice.lang;
  utterance.rate = options.rate ?? 0.7;
  utterance.pitch = 1;
  utterance.volume = 1;

  utterance.onstart = () => options.onStart?.();
  utterance.onend = () => options.onEnd?.();
  utterance.onerror = (e) => options.onError?.(e.error || 'Unknown error');

  window.speechSynthesis.speak(utterance);
  return true;
}

// ============================================
// Main Play Functions
// ============================================

/**
 * Play a single Arabic letter with best available audio
 */
export async function playLetter(
  letter: string,
  options: AudioOptions = {}
): Promise<boolean> {
  stopAllAudio();
  
  // Clean the letter (remove tashkeel for lookup)
  const cleanLetter = letter.replace(/[\u064B-\u0652]/g, '');
  const letterData = LETTER_AUDIO[cleanLetter];
  
  // Try recorded audio first (best for letters)
  if (await playRecordedAudio(cleanLetter, options)) {
    return true;
  }
  
  // For TTS fallback, use the letter with fatha vowel for proper pronunciation
  // This makes the TTS say the letter SOUND (e.g., "ba") not the letter NAME
  const letterWithVowel = letterData 
    ? cleanLetter + '\u064E' // Add fatha (short 'a' sound)
    : letter;
  
  // Try ElevenLabs for high quality
  if (ELEVENLABS_API_KEY) {
    if (await playWithElevenLabs(letterWithVowel, options)) {
      return true;
    }
  }
  
  // Fallback to Web Speech API - use letter with vowel for sound, not name
  return playWithWebSpeech(letterWithVowel, { ...options, rate: 0.5 });
}

/**
 * Play an Arabic word
 */
export async function playWord(
  word: string,
  options: AudioOptions = {}
): Promise<boolean> {
  stopAllAudio();
  
  // Try ElevenLabs first for words (best quality)
  if (ELEVENLABS_API_KEY) {
    if (await playWithElevenLabs(word, options)) {
      return true;
    }
  }
  
  // Fallback to Web Speech API
  return playWithWebSpeech(word, { ...options, rate: 0.7 });
}

/**
 * Play a phrase or Quranic verse
 * For Quran, prefer using the EveryAyah.com audio instead
 */
export async function playPhrase(
  phrase: string,
  options: AudioOptions = {}
): Promise<boolean> {
  stopAllAudio();
  
  // Try ElevenLabs for phrases
  if (ELEVENLABS_API_KEY) {
    if (await playWithElevenLabs(phrase, options)) {
      return true;
    }
  }
  
  // Fallback to Web Speech API
  return playWithWebSpeech(phrase, { ...options, rate: 0.8 });
}

/**
 * Auto-detect content type and play appropriately
 */
export async function playArabic(
  text: string,
  options: AudioOptions = {}
): Promise<boolean> {
  const cleanText = text.replace(/[\u064B-\u0652]/g, '');
  const charCount = cleanText.length;
  
  if (charCount <= 2) {
    return playLetter(text, options);
  } else if (charCount <= 10 && !text.includes(' ')) {
    return playWord(text, options);
  } else {
    return playPhrase(text, options);
  }
}

// ============================================
// Utility Functions
// ============================================

export function getLetterInfo(letter: string) {
  const cleanLetter = letter.replace(/[\u064B-\u0652]/g, '');
  return LETTER_AUDIO[cleanLetter] || null;
}

export function hasElevenLabsKey(): boolean {
  return !!ELEVENLABS_API_KEY;
}

/**
 * Check what audio providers are available
 */
export async function checkAudioProviders(): Promise<{
  elevenlabs: boolean;
  recorded: boolean;
  webspeech: boolean;
}> {
  const hasWebSpeech = typeof window !== 'undefined' && 
    !!window.speechSynthesis &&
    window.speechSynthesis.getVoices().some(v => v.lang.startsWith('ar'));
  
  return {
    elevenlabs: !!ELEVENLABS_API_KEY,
    recorded: true, // We have the URLs mapped
    webspeech: hasWebSpeech,
  };
}
