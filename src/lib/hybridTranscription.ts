/**
 * Hybrid Transcription Service
 * 
 * Unified interface for Quran transcription supporting:
 * - Server-side: Tarteel Whisper via Modal (primary)
 * - Browser-side: Transformers.js offline mode
 * - Fallback: Deepgram (legacy)
 * 
 * @see /docs/TARTEEL_INTEGRATION_PLAN.md
 */

// ============================================
// Types
// ============================================

export type TranscriptionProvider = 'tarteel' | 'deepgram' | 'browser' | 'auto';

export interface TranscriptionResult {
  text: string;
  provider: TranscriptionProvider;
  mode: 'server' | 'offline';
  latencyMs: number;
  confidence?: number;
  words?: TranscribedWord[];
}

export interface TranscribedWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
}

export interface TranscriptionOptions {
  provider?: TranscriptionProvider;
  preferOffline?: boolean;
  fallbackToServer?: boolean;
  timeout?: number;
}

// ============================================
// Offline Transcription (Browser)
// ============================================

let offlineWhisperPipeline: any = null;
let offlineModelLoading = false;
let offlineModelProgress = 0;

type ProgressCallback = (progress: number) => void;

/**
 * Initialize offline Whisper model in browser
 * Downloads ~74MB model on first use, cached in IndexedDB
 */
export async function initOfflineWhisper(
  onProgress?: ProgressCallback
): Promise<void> {
  if (offlineWhisperPipeline) return;
  if (offlineModelLoading) {
    throw new Error('Model already loading');
  }
  
  offlineModelLoading = true;
  
  try {
    // Dynamic import to avoid SSR issues
    const { pipeline, env } = await import('@xenova/transformers');

    // Configure for browser
    env.allowLocalModels = false;
    env.useBrowserCache = true;

    // Safe progress callback that guards against undefined data
    const progressCallback = (data: any) => {
      if (data && data.status === 'progress' && data.progress !== undefined) {
        offlineModelProgress = data.progress;
        onProgress?.(data.progress);
      }
    };

    // Use the ONNX-converted version of the Tarteel Quran Whisper model
    // The original tarteel-ai/whisper-tiny-ar-quran only has PyTorch weights
    // Falls back to generic Xenova/whisper-tiny if the Quran-specific model fails
    const QURAN_MODEL = 'omartariq612/tarteel-ai-whisper-tiny-ar-quran-onnx';
    const FALLBACK_MODEL = 'Xenova/whisper-tiny';

    let modelId = QURAN_MODEL;
    try {
      offlineWhisperPipeline = await pipeline(
        'automatic-speech-recognition',
        modelId,
        {
          quantized: true,
          progress_callback: progressCallback,
        }
      );
    } catch (quranModelError) {
      console.warn('Quran-specific ONNX model failed, falling back to generic Whisper:', quranModelError);
      offlineWhisperPipeline = null;
      modelId = FALLBACK_MODEL;
      offlineWhisperPipeline = await pipeline(
        'automatic-speech-recognition',
        modelId,
        {
          quantized: true,
          progress_callback: progressCallback,
        }
      );
    }
  } catch (err) {
    offlineWhisperPipeline = null;
    offlineModelProgress = 0;
    throw err;
  } finally {
    offlineModelLoading = false;
  }
}

/**
 * Check if offline model is ready
 */
export function isOfflineReady(): boolean {
  return offlineWhisperPipeline !== null;
}

/**
 * Get offline model loading progress (0-100)
 */
export function getOfflineModelProgress(): number {
  return offlineModelProgress;
}

/**
 * Transcribe audio using browser-based model
 */
async function transcribeOffline(audioBlob: Blob): Promise<TranscriptionResult> {
  if (!offlineWhisperPipeline) {
    throw new Error('Offline whisper not initialized. Call initOfflineWhisper() first.');
  }
  
  const startTime = performance.now();
  
  // Convert blob to array buffer
  const arrayBuffer = await audioBlob.arrayBuffer();
  
  // Run inference
  const result = await offlineWhisperPipeline(arrayBuffer, {
    language: 'ar',
    task: 'transcribe',
    return_timestamps: true,
  });

  const latencyMs = performance.now() - startTime;

  return {
    text: result?.text || '',
    provider: 'browser',
    mode: 'offline',
    latencyMs,
    words: result?.chunks?.map((chunk: any) => ({
      word: chunk.text,
      start: chunk.timestamp?.[0] ?? 0,
      end: chunk.timestamp?.[1] ?? 0,
      confidence: 1.0, // Whisper doesn't provide confidence
    })),
  };
}

// ============================================
// Server-side Transcription
// ============================================

/**
 * Transcribe using Tarteel Whisper on Modal
 */
async function transcribeWithTarteel(
  audioBlob: Blob,
  timeout: number = 30000
): Promise<TranscriptionResult> {
  const startTime = performance.now();
  
  // Convert audio blob to base64 for the JSON API
  const arrayBuffer = await audioBlob.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  let binary = '';
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  const audio_base64 = btoa(binary);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch('/api/tarteel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audio_base64 }),
      signal: controller.signal,
    });
    
    if (!response.ok) {
      throw new Error(`Tarteel API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Tarteel transcription failed');
    }
    
    const latencyMs = performance.now() - startTime;
    
    return {
      text: data.text || '',
      provider: 'tarteel',
      mode: 'server',
      latencyMs,
      words: data.words,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Transcribe using Deepgram (fallback)
 */
async function transcribeWithDeepgram(
  audioBlob: Blob,
  timeout: number = 30000
): Promise<TranscriptionResult> {
  const startTime = performance.now();
  
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
    
    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.status}`);
    }
    
    const data = await response.json();
    const latencyMs = performance.now() - startTime;
    
    return {
      text: data.transcript || data.text || '',
      provider: 'deepgram',
      mode: 'server',
      latencyMs,
      words: data.words,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================
// Unified Transcription Interface
// ============================================

/**
 * Transcribe audio using the best available method
 * 
 * Strategy:
 * 1. If offline mode preferred and ready, use browser
 * 2. If online, use Tarteel server
 * 3. Fallback to Deepgram if Tarteel fails
 * 4. Fallback to offline if no network
 */
export async function transcribe(
  audioBlob: Blob,
  options: TranscriptionOptions = {}
): Promise<TranscriptionResult> {
  const {
    provider = 'auto',
    preferOffline = false,
    fallbackToServer = true,
    timeout = 30000,
  } = options;
  
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  
  // Explicit provider selection
  if (provider === 'browser') {
    return transcribeOffline(audioBlob);
  }
  if (provider === 'tarteel') {
    return transcribeWithTarteel(audioBlob, timeout);
  }
  if (provider === 'deepgram') {
    return transcribeWithDeepgram(audioBlob, timeout);
  }
  
  // Auto mode: smart provider selection
  
  // Prefer offline if requested and ready
  if (preferOffline && isOfflineReady()) {
    try {
      return await transcribeOffline(audioBlob);
    } catch (error) {
      console.warn('Offline transcription failed:', error);
      if (!fallbackToServer || !isOnline) {
        throw error;
      }
      // Fall through to server
    }
  }
  
  // No network and no offline mode
  if (!isOnline && !isOfflineReady()) {
    throw new Error('No internet connection and offline mode not available');
  }
  
  // No network but offline ready
  if (!isOnline) {
    return transcribeOffline(audioBlob);
  }
  
  // Online: try Tarteel first
  try {
    return await transcribeWithTarteel(audioBlob, timeout);
  } catch (error) {
    console.warn('Tarteel transcription failed:', error);
    
    // Fallback to Deepgram
    try {
      return await transcribeWithDeepgram(audioBlob, timeout);
    } catch (deepgramError) {
      console.warn('Deepgram transcription failed:', deepgramError);
      
      // Last resort: offline if available
      if (isOfflineReady()) {
        return transcribeOffline(audioBlob);
      }
      
      throw error; // Re-throw original error
    }
  }
}

// ============================================
// A/B Testing Utilities
// ============================================

export interface ABTestResult {
  tarteel: TranscriptionResult | null;
  deepgram: TranscriptionResult | null;
  browser: TranscriptionResult | null;
  expectedText?: string;
  accuracy?: {
    tarteel?: number;
    deepgram?: number;
    browser?: number;
  };
}

/**
 * Run all available transcription methods for comparison
 */
export async function runABTest(
  audioBlob: Blob,
  expectedText?: string
): Promise<ABTestResult> {
  const results: ABTestResult = {
    tarteel: null,
    deepgram: null,
    browser: null,
    expectedText,
  };
  
  // Run in parallel
  const [tarteelResult, deepgramResult, browserResult] = await Promise.allSettled([
    transcribeWithTarteel(audioBlob),
    transcribeWithDeepgram(audioBlob),
    isOfflineReady() ? transcribeOffline(audioBlob) : Promise.reject('Not ready'),
  ]);
  
  if (tarteelResult.status === 'fulfilled') {
    results.tarteel = tarteelResult.value;
  }
  if (deepgramResult.status === 'fulfilled') {
    results.deepgram = deepgramResult.value;
  }
  if (browserResult.status === 'fulfilled') {
    results.browser = browserResult.value;
  }
  
  // Calculate accuracy if expected text provided
  if (expectedText) {
    results.accuracy = {};
    if (results.tarteel) {
      results.accuracy.tarteel = calculateArabicSimilarity(results.tarteel.text, expectedText);
    }
    if (results.deepgram) {
      results.accuracy.deepgram = calculateArabicSimilarity(results.deepgram.text, expectedText);
    }
    if (results.browser) {
      results.accuracy.browser = calculateArabicSimilarity(results.browser.text, expectedText);
    }
  }
  
  return results;
}

// ============================================
// Arabic Text Utilities
// ============================================

/**
 * Normalize Arabic text for comparison
 * Removes diacritics, normalizes alef forms, etc.
 */
export function normalizeArabic(text: string): string {
  return text
    // Remove tashkeel (diacritics)
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Normalize alef forms
    .replace(/[\u0622\u0623\u0625]/g, '\u0627')
    // Normalize taa marbuta
    .replace(/\u0629/g, '\u0647')
    // Normalize alef maksura
    .replace(/\u0649/g, '\u064A')
    // Remove tatweel
    .replace(/\u0640/g, '')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity between two Arabic strings (0-100)
 * Uses Levenshtein distance on normalized text
 */
export function calculateArabicSimilarity(a: string, b: string): number {
  const normA = normalizeArabic(a);
  const normB = normalizeArabic(b);
  
  if (normA === normB) return 100;
  if (normA.length === 0 || normB.length === 0) return 0;
  
  const distance = levenshteinDistance(normA, normB);
  const maxLength = Math.max(normA.length, normB.length);
  
  return Math.round((1 - distance / maxLength) * 100);
}

/**
 * Levenshtein distance implementation
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
}
