/**
 * Tarteel Transcription Service
 * 
 * Uses Modal-hosted Tarteel Whisper model for Quran-optimized
 * speech recognition with diacritics support.
 * 
 * Architecture:
 * 1. Capture audio from microphone using MediaRecorder
 * 2. Send chunks to server API which proxies to Modal
 * 3. Accumulate transcriptions and align with expected text
 * 4. Emit word-level events for UI highlighting
 */

import {
  normalizeArabic,
  arabicSimilarity,
  type TranscribedWord,
  type WordAlignment,
} from './realtimeTajweedService';

// Re-export utilities
export { normalizeArabic, arabicSimilarity };

// ============================================
// Types
// ============================================

export interface TarteelConfig {
  expectedText: string;
  chunkIntervalMs?: number; // How often to send chunks (default: 3000ms)
  onTranscript?: (text: string, isFinal: boolean) => void;
  onWord?: (index: number, word: string, confidence: number) => void;
  onError?: (error: string) => void;
  onStateChange?: (state: TarteelState) => void;
}

export interface TarteelState {
  isRecording: boolean;
  currentWordIndex: number;
  transcription: string;
  alignments: WordAlignment[];
  error: string | null;
  audioLevel: number;
}

export interface TarteelSessionResult {
  transcription: string;
  alignments: WordAlignment[];
  accuracy: number;
  duration: number;
}

// ============================================
// Tarteel Service Class
// ============================================

export class TarteelService {
  private config: Required<Pick<TarteelConfig, 'expectedText' | 'chunkIntervalMs'>>;
  private callbacks: Omit<TarteelConfig, 'expectedText' | 'chunkIntervalMs'>;
  private expectedWords: string[];
  
  private mediaRecorder: MediaRecorder | null = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  
  private audioChunks: Blob[] = [];
  private chunkTimer: NodeJS.Timeout | null = null;
  private isProcessing = false;
  private startTime = 0;
  
  private state: TarteelState;
  private allTranscribedWords: Array<{ word: string; confidence: number }> = [];
  
  constructor(config: TarteelConfig) {
    this.config = {
      expectedText: config.expectedText,
      chunkIntervalMs: config.chunkIntervalMs ?? 3000,
    };
    
    this.callbacks = {
      onTranscript: config.onTranscript,
      onWord: config.onWord,
      onError: config.onError,
      onStateChange: config.onStateChange,
    };
    
    this.expectedWords = this.parseExpectedText(config.expectedText);
    
    this.state = {
      isRecording: false,
      currentWordIndex: -1,
      transcription: '',
      alignments: this.expectedWords.map((word, i) => ({
        expectedIndex: i,
        expectedWord: word,
        status: 'pending' as const,
        confidence: 0,
      })),
      error: null,
      audioLevel: 0,
    };
  }
  
  private parseExpectedText(text: string): string[] {
    return text
      .replace(/[\u06DD\u0660-\u0669۰-۹]+/g, '') // Remove verse markers
      .split(/\s+/)
      .filter(w => w.length > 0);
  }
  
  private emitStateChange(): void {
    this.callbacks.onStateChange?.({ ...this.state });
  }
  
  private emitError(error: string): void {
    this.state.error = error;
    this.callbacks.onError?.(error);
    this.emitStateChange();
  }
  
  // ============================================
  // Audio Capture
  // ============================================
  
  private async initializeAudio(): Promise<MediaStream> {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,
      },
    });
    
    this.mediaStream = stream;
    
    // Set up audio analysis for visualization
    this.audioContext = new AudioContext({ sampleRate: 16000 });
    this.analyser = this.audioContext.createAnalyser();
    const source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyser);
    this.analyser.fftSize = 256;
    
    return stream;
  }
  
  /**
   * Get current audio level (0-1) for visualization
   */
  getAudioLevel(): number {
    if (!this.analyser) return 0;
    
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    
    const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    return Math.min(average / 128, 1);
  }
  
  // ============================================
  // Chunk Processing
  // ============================================
  
  private async processChunk(): Promise<void> {
    if (this.isProcessing || this.audioChunks.length === 0) return;
    
    this.isProcessing = true;
    
    try {
      // Combine all collected chunks
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm;codecs=opus' });
      
      // Convert to base64
      const base64 = await this.blobToBase64(audioBlob);
      
      // Send to Tarteel API
      const response = await fetch('/api/tarteel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audio_base64: base64 }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Tarteel API error:', error);
        // Don't emit error for transient failures, just log
        return;
      }
      
      const result = await response.json();
      
      if (result.success && result.text) {
        this.handleTranscription(result.text, result.words || []);
      }
    } catch (error) {
      console.error('Chunk processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }
  
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        // Extract base64 part (after "data:audio/webm;codecs=opus;base64,")
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  
  private handleTranscription(
    text: string,
    words: Array<{ word: string; start?: number; end?: number; confidence?: number }>
  ): void {
    // Update cumulative transcription
    const newText = text.trim();
    if (!newText) return;
    
    // Add transcribed words
    const newWords = words.length > 0
      ? words.map(w => ({ word: w.word, confidence: w.confidence ?? 0.8 }))
      : newText.split(/\s+/).map(w => ({ word: w, confidence: 0.8 }));
    
    this.allTranscribedWords = newWords; // Replace with cumulative transcription
    this.state.transcription = newText;
    
    // Emit transcript callback
    this.callbacks.onTranscript?.(newText, false);
    
    // Align words with expected text
    this.alignTranscribedWords();
    
    this.emitStateChange();
  }
  
  private alignTranscribedWords(): void {
    const transcribed = this.allTranscribedWords;
    
    // Reset alignments
    this.state.alignments = this.expectedWords.map((word, i) => ({
      expectedIndex: i,
      expectedWord: word,
      status: 'pending' as const,
      confidence: 0,
    }));
    
    let expectedIdx = 0;
    
    for (const trans of transcribed) {
      if (expectedIdx >= this.expectedWords.length) break;
      
      // Look ahead up to 4 words for best match
      let bestMatch = -1;
      let bestSim = 0;
      
      for (let j = expectedIdx; j < Math.min(expectedIdx + 4, this.expectedWords.length); j++) {
        const sim = arabicSimilarity(trans.word, this.expectedWords[j]);
        if (sim > bestSim && sim > 0.4) {
          bestMatch = j;
          bestSim = sim;
        }
      }
      
      if (bestMatch >= 0) {
        // Mark skipped words as missed
        for (let j = expectedIdx; j < bestMatch; j++) {
          this.state.alignments[j].status = 'missed';
        }
        
        // Mark the matched word
        this.state.alignments[bestMatch].transcribedWord = trans.word;
        this.state.alignments[bestMatch].status = bestSim > 0.75 ? 'matched' : 'partial';
        this.state.alignments[bestMatch].confidence = bestSim;
        
        // Emit word callback
        this.callbacks.onWord?.(bestMatch, trans.word, bestSim);
        
        // Update current word index
        this.state.currentWordIndex = bestMatch;
        
        expectedIdx = bestMatch + 1;
      }
    }
  }
  
  // ============================================
  // Public API
  // ============================================
  
  /**
   * Start recording and transcribing
   */
  async start(): Promise<void> {
    try {
      const stream = await this.initializeAudio();
      
      // Create MediaRecorder
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      // Start recording with timeslice to get chunks regularly
      this.mediaRecorder.start(500); // Get data every 500ms
      
      this.startTime = Date.now();
      this.state.isRecording = true;
      this.emitStateChange();
      
      // Set up periodic processing
      this.chunkTimer = setInterval(() => {
        this.processChunk();
      }, this.config.chunkIntervalMs);
      
    } catch (error) {
      this.emitError(
        error instanceof Error
          ? error.message
          : 'Failed to start recording'
      );
      throw error;
    }
  }
  
  /**
   * Stop recording and return final results
   */
  async stop(): Promise<TarteelSessionResult> {
    // Stop chunk timer
    if (this.chunkTimer) {
      clearInterval(this.chunkTimer);
      this.chunkTimer = null;
    }
    
    // Stop MediaRecorder
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    // Stop media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
    
    // Close audio context
    if (this.audioContext) {
      await this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
    
    // Process any remaining audio
    if (this.audioChunks.length > 0 && !this.isProcessing) {
      await this.processChunk();
    }
    
    // Wait for any in-progress processing
    while (this.isProcessing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    this.state.isRecording = false;
    
    // Final transcript callback
    this.callbacks.onTranscript?.(this.state.transcription, true);
    
    this.emitStateChange();
    
    const duration = (Date.now() - this.startTime) / 1000;
    
    // Calculate accuracy
    const matched = this.state.alignments.filter(
      a => a.status === 'matched' || a.status === 'partial'
    ).length;
    const accuracy = this.expectedWords.length > 0
      ? Math.round((matched / this.expectedWords.length) * 100)
      : 0;
    
    return {
      transcription: this.state.transcription,
      alignments: this.state.alignments,
      accuracy,
      duration,
    };
  }
  
  /**
   * Get current state
   */
  getState(): TarteelState {
    return { ...this.state };
  }
  
  /**
   * Check if Tarteel API is configured
   */
  static async isConfigured(): Promise<boolean> {
    try {
      const response = await fetch('/api/tarteel');
      const data = await response.json();
      return data.configured === true;
    } catch {
      return false;
    }
  }
}

// ============================================
// Browser Support Check
// ============================================

export function checkBrowserSupport(): {
  supported: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  
  if (!navigator.mediaDevices?.getUserMedia) {
    missing.push('MediaDevices API');
  }
  
  if (!window.MediaRecorder) {
    missing.push('MediaRecorder API');
  }
  
  if (!window.AudioContext && !(window as any).webkitAudioContext) {
    missing.push('Web Audio API');
  }
  
  return {
    supported: missing.length === 0,
    missing,
  };
}
