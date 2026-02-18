/**
 * Web Speech API Service for Quran Recitation
 * 
 * Fallback when Modal/Tarteel endpoint is unavailable.
 * Uses browser's built-in SpeechRecognition with Arabic language support.
 * Works in Chrome, Edge, Safari (partial).
 */

import {
  normalizeArabic,
  arabicSimilarity,
  type WordAlignment,
} from './realtimeTajweedService';

export interface WebSpeechConfig {
  expectedText: string;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onWord?: (index: number, word: string, confidence: number) => void;
  onError?: (error: string) => void;
  onStateChange?: (state: WebSpeechState) => void;
}

export interface WebSpeechState {
  isRecording: boolean;
  currentWordIndex: number;
  transcription: string;
  alignments: WordAlignment[];
  error: string | null;
  audioLevel: number;
}

export interface WebSpeechSessionResult {
  transcription: string;
  alignments: WordAlignment[];
  accuracy: number;
  duration: number;
}

export class WebSpeechService {
  private config: WebSpeechConfig;
  private expectedWords: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private recognition: any = null;
  private mediaStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private startTime = 0;
  private stopped = false;
  private allTranscribedText = '';
  
  private state: WebSpeechState;

  constructor(config: WebSpeechConfig) {
    this.config = config;
    this.expectedWords = config.expectedText
      .replace(/[\u06DD\u0660-\u0669۰-۹]+/g, '')
      .split(/\s+/)
      .filter(w => w.length > 0);

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

  private emitStateChange(): void {
    this.config.onStateChange?.({ ...this.state });
  }

  getAudioLevel(): number {
    if (!this.analyser) return 0;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
    return Math.min(average / 128, 1);
  }

  async start(): Promise<void> {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not supported in this browser. Please use Chrome or Edge.');
    }

    // Get mic for audio visualization
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      this.audioContext = new AudioContext();
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      source.connect(this.analyser);
      this.analyser.fftSize = 256;
    } catch {
      // Visualization won't work but recognition still can
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = 'ar-SA';
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;

    this.stopped = false;
    this.allTranscribedText = '';

    this.recognition.onresult = (event: any) => {
      if (this.stopped) return;

      // Build full transcript from all results
      let fullTranscript = '';
      let latestInterim = '';
      
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          fullTranscript += result[0].transcript + ' ';
        } else {
          latestInterim = result[0].transcript;
        }
      }

      const combinedText = (fullTranscript + latestInterim).trim();
      if (!combinedText) return;

      this.allTranscribedText = combinedText;
      this.state.transcription = combinedText;
      this.config.onTranscript?.(combinedText, false);

      // Align with expected words
      this.alignWords(combinedText);
      this.emitStateChange();
    };

    this.recognition.onerror = (event: any) => {
      if (this.stopped) return;
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      console.error('Speech recognition error:', event.error);
      this.config.onError?.(event.error);
    };

    this.recognition.onend = () => {
      // Auto-restart if not manually stopped (recognition can timeout)
      if (!this.stopped && this.state.isRecording) {
        try {
          this.recognition?.start();
        } catch {
          // Already started or stopped
        }
      }
    };

    this.recognition.start();
    this.startTime = Date.now();
    this.state.isRecording = true;
    this.emitStateChange();
  }

  private alignWords(transcribedText: string): void {
    const transcribedWords = transcribedText
      .split(/\s+/)
      .filter(w => w.length > 0);

    // Reset alignments
    this.state.alignments = this.expectedWords.map((word, i) => ({
      expectedIndex: i,
      expectedWord: word,
      status: 'pending' as const,
      confidence: 0,
    }));

    let expectedIdx = 0;

    for (const transWord of transcribedWords) {
      if (expectedIdx >= this.expectedWords.length) break;

      // Look ahead up to 4 words
      let bestMatch = -1;
      let bestSim = 0;

      for (let j = expectedIdx; j < Math.min(expectedIdx + 4, this.expectedWords.length); j++) {
        const sim = arabicSimilarity(transWord, this.expectedWords[j]);
        if (sim > bestSim && sim > 0.35) {
          bestMatch = j;
          bestSim = sim;
        }
      }

      if (bestMatch >= 0) {
        // Mark skipped words as missed
        for (let j = expectedIdx; j < bestMatch; j++) {
          this.state.alignments[j].status = 'missed';
        }

        this.state.alignments[bestMatch].transcribedWord = transWord;
        this.state.alignments[bestMatch].status = bestSim > 0.7 ? 'matched' : 'partial';
        this.state.alignments[bestMatch].confidence = bestSim;

        // Emit word callback  
        this.config.onWord?.(bestMatch, transWord, bestSim);
        this.state.currentWordIndex = bestMatch;

        expectedIdx = bestMatch + 1;
      }
    }
  }

  async stop(): Promise<WebSpeechSessionResult> {
    this.stopped = true;
    this.state.isRecording = false;

    if (this.recognition) {
      try { this.recognition.stop(); } catch {}
      this.recognition = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }

    if (this.audioContext) {
      try { await this.audioContext.close(); } catch {}
      this.audioContext = null;
    }

    this.config.onTranscript?.(this.state.transcription, true);
    this.emitStateChange();

    const duration = (Date.now() - this.startTime) / 1000;
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

  getState(): WebSpeechState {
    return { ...this.state };
  }

  static isSupported(): boolean {
    return !!(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
  }
}
