/**
 * Real-time Tajweed Service
 * 
 * Provides real-time word-by-word tracking during Quran recitation
 * using Deepgram's streaming API with Arabic support.
 * 
 * Architecture:
 * 1. Browser captures audio via MediaRecorder
 * 2. Audio streams to Deepgram WebSocket for real-time transcription
 * 3. Transcribed words are aligned with expected Quran text
 * 4. UI highlights current word in real-time
 * 5. On completion, Claude analyzes tajweed rules
 * 
 * @see /docs/TAJWEED_ARCHITECTURE.md for full design
 */

// ============================================
// Types
// ============================================

export interface TranscribedWord {
  word: string;
  start: number;  // seconds
  end: number;    // seconds
  confidence: number;
  isFinal: boolean;
}

export interface WordAlignment {
  expectedIndex: number;
  expectedWord: string;
  transcribedWord?: string;
  status: 'pending' | 'current' | 'matched' | 'partial' | 'missed' | 'extra';
  confidence: number;
}

export interface RealtimeState {
  isConnected: boolean;
  isRecording: boolean;
  currentWordIndex: number;
  transcription: string;
  words: TranscribedWord[];
  alignments: WordAlignment[];
  error: string | null;
}

export interface TajweedRuleInstance {
  rule: string;
  arabicName: string;
  wordIndices: number[];
  description: string;
  tip: string;
}

export interface RealtimeSessionResult {
  transcription: string;
  words: TranscribedWord[];
  alignments: WordAlignment[];
  accuracy: number;
  rulesDetected: TajweedRuleInstance[];
  duration: number;
}

type StateCallback = (state: RealtimeState) => void;
type WordCallback = (index: number, word: TranscribedWord) => void;
type ErrorCallback = (error: string) => void;

// ============================================
// Tajweed Rule Detection (Static Analysis)
// ============================================

interface TajweedRuleDefinition {
  name: string;
  arabicName: string;
  description: string;
  tip: string;
  // Pattern to detect in Arabic text (simplified - would need more sophisticated phonetic analysis)
  patterns: RegExp[];
}

const TAJWEED_RULE_DEFINITIONS: TajweedRuleDefinition[] = [
  {
    name: 'Noon Sakinah - Ikhfa',
    arabicName: 'إخفاء',
    description: 'Hiding the noon sound before certain letters',
    tip: 'Make the noon sound soft and nasalized, blending into the next letter',
    patterns: [/نْ[تثجدذزسشصضطظفقك]/g, /[ًٌٍ][تثجدذزسشصضطظفقك]/g],
  },
  {
    name: 'Noon Sakinah - Idgham',
    arabicName: 'إدغام',
    description: 'Merging noon with the following letter',
    tip: 'Merge the noon completely into letters: ي ن م و ل ر',
    patterns: [/نْ[ينمولر]/g, /[ًٌٍ][ينمولر]/g],
  },
  {
    name: 'Noon Sakinah - Iqlab',
    arabicName: 'إقلاب',
    description: 'Changing noon to meem before ب',
    tip: 'Change the noon to a meem sound with nasalization',
    patterns: [/نْب/g, /[ًٌٍ]ب/g],
  },
  {
    name: 'Noon Sakinah - Izhar',
    arabicName: 'إظهار',
    description: 'Clear pronunciation of noon before throat letters',
    tip: 'Pronounce the noon clearly without nasalization: ء ه ع ح غ خ',
    patterns: [/نْ[ءهعحغخ]/g, /[ًٌٍ][ءهعحغخ]/g],
  },
  {
    name: 'Madd (Elongation)',
    arabicName: 'مَدّ',
    description: 'Elongating vowel sounds',
    tip: 'Hold the vowel for 2-6 counts depending on the type',
    patterns: [/[اوي]ٓ/g, /[اَوُيِ]/g],
  },
  {
    name: 'Qalqalah',
    arabicName: 'قلقلة',
    description: 'Echo/bounce effect on specific letters when they have sukoon',
    tip: 'Add a slight bounce when ق ط ب ج د have sukoon',
    patterns: [/[قطبجد]ْ/g, /[قطبجد]$/g],  // At end of word or with sukoon
  },
  {
    name: 'Ghunnah',
    arabicName: 'غُنّة',
    description: 'Nasalization on noon and meem with shaddah',
    tip: 'Hold the nasal sound for 2 counts',
    patterns: [/نّ/g, /مّ/g],
  },
];

/**
 * Detect tajweed rules present in Arabic text
 */
export function detectTajweedRules(text: string): TajweedRuleInstance[] {
  const rules: TajweedRuleInstance[] = [];
  const words = text.split(/\s+/);
  
  for (const ruleDef of TAJWEED_RULE_DEFINITIONS) {
    for (const pattern of ruleDef.patterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        if (match.index !== undefined) {
          // Find which word this match is in
          let charCount = 0;
          let wordIndex = 0;
          for (let i = 0; i < words.length; i++) {
            const wordEnd = charCount + words[i].length;
            if (match.index >= charCount && match.index < wordEnd) {
              wordIndex = i;
              break;
            }
            charCount = wordEnd + 1; // +1 for space
          }
          
          // Check if we already have this rule for this word
          const existing = rules.find(
            r => r.rule === ruleDef.name && r.wordIndices.includes(wordIndex)
          );
          
          if (existing) {
            continue;
          }
          
          const existingRule = rules.find(r => r.rule === ruleDef.name);
          if (existingRule) {
            existingRule.wordIndices.push(wordIndex);
          } else {
            rules.push({
              rule: ruleDef.name,
              arabicName: ruleDef.arabicName,
              wordIndices: [wordIndex],
              description: ruleDef.description,
              tip: ruleDef.tip,
            });
          }
        }
      }
    }
  }
  
  return rules;
}

// ============================================
// Arabic Text Processing
// ============================================

/**
 * Normalize Arabic text for comparison
 * Removes diacritics and normalizes characters
 */
export function normalizeArabic(text: string): string {
  return text
    // Remove diacritics (tashkeel)
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Normalize alef variants
    .replace(/[أإآٱ]/g, 'ا')
    // Normalize teh marbuta
    .replace(/ة/g, 'ه')
    // Normalize yeh variants
    .replace(/ى/g, 'ي')
    // Remove tatweel
    .replace(/ـ/g, '')
    // Normalize spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculate similarity between two Arabic words (0-1)
 */
export function arabicSimilarity(word1: string, word2: string): number {
  const norm1 = normalizeArabic(word1);
  const norm2 = normalizeArabic(word2);
  
  if (norm1 === norm2) return 1;
  if (norm1.length === 0 || norm2.length === 0) return 0;
  
  // Levenshtein distance
  const matrix: number[][] = [];
  for (let i = 0; i <= norm1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= norm2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= norm1.length; i++) {
    for (let j = 1; j <= norm2.length; j++) {
      const cost = norm1[i - 1] === norm2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const maxLen = Math.max(norm1.length, norm2.length);
  return 1 - matrix[norm1.length][norm2.length] / maxLen;
}

/**
 * Align transcribed words with expected Quran text
 */
export function alignWords(
  transcribed: TranscribedWord[],
  expected: string[]
): WordAlignment[] {
  const alignments: WordAlignment[] = expected.map((word, i) => ({
    expectedIndex: i,
    expectedWord: word,
    status: 'pending' as const,
    confidence: 0,
  }));
  
  let expectedIdx = 0;
  
  for (const trans of transcribed) {
    if (expectedIdx >= expected.length) {
      // Extra words at the end
      alignments.push({
        expectedIndex: -1,
        expectedWord: '',
        transcribedWord: trans.word,
        status: 'extra',
        confidence: trans.confidence,
      });
      continue;
    }
    
    // Try to find a match in the next few expected words
    let bestMatch = -1;
    let bestSimilarity = 0;
    
    for (let j = expectedIdx; j < Math.min(expectedIdx + 3, expected.length); j++) {
      const sim = arabicSimilarity(trans.word, expected[j]);
      if (sim > bestSimilarity && sim > 0.5) {
        bestMatch = j;
        bestSimilarity = sim;
      }
    }
    
    if (bestMatch >= 0) {
      // Mark skipped words as missed
      for (let j = expectedIdx; j < bestMatch; j++) {
        alignments[j].status = 'missed';
      }
      
      alignments[bestMatch].transcribedWord = trans.word;
      alignments[bestMatch].status = bestSimilarity > 0.8 ? 'matched' : 'partial';
      alignments[bestMatch].confidence = bestSimilarity;
      expectedIdx = bestMatch + 1;
    }
  }
  
  return alignments;
}

// ============================================
// Deepgram Real-time Service
// ============================================

/**
 * Configuration for Deepgram connection
 */
export interface DeepgramConfig {
  apiKey: string;
  model?: string;
  language?: string;
  interimResults?: boolean;
  smartFormat?: boolean;
  punctuate?: boolean;
}

const DEFAULT_CONFIG: Partial<DeepgramConfig> = {
  model: 'nova-3',
  language: 'ar',
  interimResults: true,
  smartFormat: false,
  punctuate: false,
};

/**
 * Real-time Tajweed Service using Deepgram
 * 
 * Usage:
 * ```typescript
 * const service = new RealtimeTajweedService({
 *   apiKey: process.env.DEEPGRAM_API_KEY!,
 *   expectedText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
 * });
 * 
 * service.onStateChange((state) => {
 *   console.log('Current word:', state.currentWordIndex);
 * });
 * 
 * service.onWord((index, word) => {
 *   highlightWord(index);
 * });
 * 
 * await service.start();
 * // ... user recites
 * const result = await service.stop();
 * ```
 */
export class RealtimeTajweedService {
  private config: DeepgramConfig;
  private expectedWords: string[];
  private expectedText: string;
  
  private websocket: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  
  private state: RealtimeState;
  private startTime: number = 0;
  
  private stateCallbacks: StateCallback[] = [];
  private wordCallbacks: WordCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  
  constructor(options: {
    apiKey: string;
    expectedText: string;
    config?: Partial<DeepgramConfig>;
  }) {
    this.config = { ...DEFAULT_CONFIG, apiKey: options.apiKey, ...options.config };
    this.expectedText = options.expectedText;
    this.expectedWords = this.parseExpectedText(options.expectedText);
    
    this.state = {
      isConnected: false,
      isRecording: false,
      currentWordIndex: -1,
      transcription: '',
      words: [],
      alignments: this.expectedWords.map((word, i) => ({
        expectedIndex: i,
        expectedWord: word,
        status: 'pending' as const,
        confidence: 0,
      })),
      error: null,
    };
  }
  
  private parseExpectedText(text: string): string[] {
    return text
      .replace(/[\u06DD\u0660-\u0669۰-۹]+/g, '') // Remove verse markers
      .split(/\s+/)
      .filter(w => w.length > 0);
  }
  
  // ============================================
  // Event Handlers
  // ============================================
  
  onStateChange(callback: StateCallback): () => void {
    this.stateCallbacks.push(callback);
    return () => {
      this.stateCallbacks = this.stateCallbacks.filter(cb => cb !== callback);
    };
  }
  
  onWord(callback: WordCallback): () => void {
    this.wordCallbacks.push(callback);
    return () => {
      this.wordCallbacks = this.wordCallbacks.filter(cb => cb !== callback);
    };
  }
  
  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter(cb => cb !== callback);
    };
  }
  
  private emitStateChange(): void {
    for (const cb of this.stateCallbacks) {
      cb({ ...this.state });
    }
  }
  
  private emitWord(index: number, word: TranscribedWord): void {
    for (const cb of this.wordCallbacks) {
      cb(index, word);
    }
  }
  
  private emitError(error: string): void {
    this.state.error = error;
    for (const cb of this.errorCallbacks) {
      cb(error);
    }
    this.emitStateChange();
  }
  
  // ============================================
  // Audio Capture
  // ============================================
  
  private async initializeAudio(): Promise<MediaStream> {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000,
      },
    });
    
    // Set up audio context for visualization
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
  // Deepgram WebSocket
  // ============================================
  
  private connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const params = new URLSearchParams({
        model: this.config.model!,
        language: this.config.language!,
        smart_format: String(this.config.smartFormat),
        punctuate: String(this.config.punctuate),
        interim_results: String(this.config.interimResults),
        utterance_end_ms: '1000',
        endpointing: '300',
      });
      
      const url = `wss://api.deepgram.com/v1/listen?${params}`;
      
      this.websocket = new WebSocket(url, ['token', this.config.apiKey]);
      
      this.websocket.onopen = () => {
        this.state.isConnected = true;
        this.emitStateChange();
        resolve();
      };
      
      this.websocket.onmessage = (event) => {
        this.handleTranscript(JSON.parse(event.data));
      };
      
      this.websocket.onerror = (event) => {
        this.emitError('WebSocket error');
        reject(new Error('WebSocket connection failed'));
      };
      
      this.websocket.onclose = () => {
        this.state.isConnected = false;
        this.emitStateChange();
      };
    });
  }
  
  private handleTranscript(data: any): void {
    if (!data.channel?.alternatives?.[0]) return;
    
    const alternative = data.channel.alternatives[0];
    const transcript = alternative.transcript;
    const isFinal = data.is_final;
    
    if (!transcript) return;
    
    // Extract words with timestamps
    const words: TranscribedWord[] = (alternative.words || []).map((w: any) => ({
      word: w.word,
      start: w.start,
      end: w.end,
      confidence: w.confidence,
      isFinal,
    }));
    
    if (isFinal) {
      // Add to cumulative transcription
      this.state.transcription += (this.state.transcription ? ' ' : '') + transcript;
      this.state.words.push(...words);
      
      // Re-align all words
      this.state.alignments = alignWords(this.state.words, this.expectedWords);
      
      // Find current word index
      const matchedIndices = this.state.alignments
        .filter(a => a.status === 'matched' || a.status === 'partial')
        .map(a => a.expectedIndex);
      
      if (matchedIndices.length > 0) {
        this.state.currentWordIndex = Math.max(...matchedIndices);
        
        // Emit word events for newly matched words
        for (const idx of matchedIndices) {
          const alignment = this.state.alignments[idx];
          if (alignment.transcribedWord) {
            const matchingWord = words.find(w => 
              normalizeArabic(w.word) === normalizeArabic(alignment.transcribedWord!)
            );
            if (matchingWord) {
              this.emitWord(idx, matchingWord);
            }
          }
        }
      }
    } else {
      // Interim result - try to match current word
      if (words.length > 0) {
        const lastWord = words[words.length - 1];
        const nextExpectedIdx = this.state.currentWordIndex + 1;
        
        if (nextExpectedIdx < this.expectedWords.length) {
          const similarity = arabicSimilarity(
            lastWord.word,
            this.expectedWords[nextExpectedIdx]
          );
          
          if (similarity > 0.3) {
            // Tentatively mark as current
            this.state.currentWordIndex = nextExpectedIdx;
            this.state.alignments[nextExpectedIdx].status = 'current';
            this.emitWord(nextExpectedIdx, lastWord);
          }
        }
      }
    }
    
    this.emitStateChange();
  }
  
  // ============================================
  // Public API
  // ============================================
  
  /**
   * Start real-time transcription
   */
  async start(): Promise<void> {
    try {
      // Initialize audio
      const stream = await this.initializeAudio();
      
      // Connect to Deepgram
      await this.connectWebSocket();
      
      // Start recording
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && this.websocket?.readyState === WebSocket.OPEN) {
          this.websocket.send(event.data);
        }
      };
      
      this.mediaRecorder.start(100); // Send chunks every 100ms
      this.startTime = Date.now();
      this.state.isRecording = true;
      this.emitStateChange();
      
    } catch (error) {
      this.emitError(error instanceof Error ? error.message : 'Failed to start recording');
      throw error;
    }
  }
  
  /**
   * Stop recording and return session result
   */
  async stop(): Promise<RealtimeSessionResult> {
    // Stop recording
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    // Close WebSocket
    if (this.websocket) {
      this.websocket.close();
    }
    
    // Close audio context
    if (this.audioContext) {
      await this.audioContext.close();
    }
    
    this.state.isRecording = false;
    this.state.isConnected = false;
    this.emitStateChange();
    
    const duration = (Date.now() - this.startTime) / 1000;
    
    // Calculate accuracy
    const matched = this.state.alignments.filter(
      a => a.status === 'matched' || a.status === 'partial'
    ).length;
    const accuracy = this.expectedWords.length > 0 
      ? (matched / this.expectedWords.length) * 100 
      : 0;
    
    // Detect tajweed rules in expected text
    const rulesDetected = detectTajweedRules(this.expectedText);
    
    return {
      transcription: this.state.transcription,
      words: this.state.words,
      alignments: this.state.alignments,
      accuracy: Math.round(accuracy),
      rulesDetected,
      duration,
    };
  }
  
  /**
   * Get current state
   */
  getState(): RealtimeState {
    return { ...this.state };
  }
  
  /**
   * Check if Deepgram API key is configured
   */
  static isConfigured(): boolean {
    return !!process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
  }
}

// ============================================
// Utility: Check Browser Support
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
  
  if (!window.WebSocket) {
    missing.push('WebSocket API');
  }
  
  if (!window.AudioContext && !(window as any).webkitAudioContext) {
    missing.push('Web Audio API');
  }
  
  return {
    supported: missing.length === 0,
    missing,
  };
}

// ============================================
// Fallback: Local Whisper (Future)
// ============================================

/**
 * Placeholder for local Whisper transcription
 * Would use transformers.js or similar for offline support
 */
export async function transcribeWithLocalWhisper(
  audioBlob: Blob,
  _modelId: string = 'tarteel-ai/whisper-base-ar-quran'
): Promise<TranscribedWord[]> {
  // TODO: Implement using @xenova/transformers
  // This would enable offline mode
  console.warn('Local Whisper not yet implemented');
  return [];
}
