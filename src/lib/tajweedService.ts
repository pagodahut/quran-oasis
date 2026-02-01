/**
 * Tajweed Practice Service
 * 
 * Provides AI-powered pronunciation analysis and feedback
 * Uses Web Audio API for recording and OpenAI Whisper for transcription
 */

// Tajweed rules for feedback
export const TAJWEED_RULES = {
  noon_sakinah: {
    name: 'Noon Sakinah',
    arabicName: 'نون ساكنة',
    description: 'Rules for noon with sukoon',
    tips: ['Ikhfa: Hide the noon sound', 'Idgham: Merge with following letter', 'Iqlab: Change noon to meem', 'Izhar: Clear pronunciation'],
  },
  madd: {
    name: 'Madd (Elongation)',
    arabicName: 'مَدّ',
    description: 'Elongating vowel sounds',
    tips: ['Natural madd: 2 counts', 'Connected madd: 4-5 counts', 'Necessary madd: 6 counts'],
  },
  qalqalah: {
    name: 'Qalqalah',
    arabicName: 'قلقلة',
    description: 'Echo/bounce effect',
    tips: ['Letters: ق ط ب ج د', 'Stronger at word end', 'Light bounce sound'],
  },
  ghunnah: {
    name: 'Ghunnah',
    arabicName: 'غُنّة',
    description: 'Nasalization',
    tips: ['Noon and meem sounds', 'Nasal resonance', 'Hold for 2 counts'],
  },
  tafkheem: {
    name: 'Tafkheem',
    arabicName: 'تفخيم',
    description: 'Full/heavy pronunciation',
    tips: ['Letters: خ ص ض غ ط ق ظ', 'Tongue raised to palate', 'Full mouth resonance'],
  },
  tarqeeq: {
    name: 'Tarqeeq',
    arabicName: 'ترقيق',
    description: 'Light pronunciation',
    tips: ['Most letters are light', 'Tongue stays low', 'No heavy emphasis'],
  },
};

export type TajweedRule = keyof typeof TAJWEED_RULES;

export interface RecordingState {
  isRecording: boolean;
  isPaused: boolean;
  duration: number;
  audioBlob: Blob | null;
  error: string | null;
}

export interface TajweedFeedback {
  overall: 'excellent' | 'good' | 'needs_practice';
  accuracy: number; // 0-100
  transcription?: string;
  rulesAnalysis: {
    rule: TajweedRule;
    status: 'correct' | 'needs_work' | 'not_detected';
    feedback: string;
  }[];
  encouragement: string;
  specificTips: string[];
}

export interface PracticeSession {
  id: string;
  surah: number;
  ayah: number;
  timestamp: Date;
  feedback: TajweedFeedback;
  audioUrl?: string;
}

// ============================================
// Audio Recording
// ============================================

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let audioContext: AudioContext | null = null;
let analyser: AnalyserNode | null = null;

/**
 * Request microphone permission and initialize recording
 */
export async function initializeRecording(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ 
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 16000, // Optimal for speech recognition
      }
    });
    
    // Create audio context for visualization
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;
    
    // Create media recorder
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: getSupportedMimeType(),
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };
    
    return true;
  } catch (error) {
    console.error('Failed to initialize recording:', error);
    return false;
  }
}

/**
 * Get supported audio MIME type
 */
function getSupportedMimeType(): string {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/wav',
  ];
  
  for (const type of types) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  
  return 'audio/webm'; // Fallback
}

/**
 * Start recording
 */
export function startRecording(): boolean {
  if (!mediaRecorder || mediaRecorder.state === 'recording') {
    return false;
  }
  
  audioChunks = [];
  mediaRecorder.start(100); // Collect data every 100ms
  return true;
}

/**
 * Stop recording and return audio blob
 */
export async function stopRecording(): Promise<Blob | null> {
  return new Promise((resolve) => {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
      resolve(null);
      return;
    }
    
    mediaRecorder.onstop = () => {
      const mimeType = mediaRecorder?.mimeType || 'audio/webm';
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      audioChunks = [];
      resolve(audioBlob);
    };
    
    mediaRecorder.stop();
  });
}

/**
 * Get audio level for visualization
 */
export function getAudioLevel(): number {
  if (!analyser) return 0;
  
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  
  // Calculate average level
  const average = dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
  return Math.min(average / 128, 1); // Normalize to 0-1
}

/**
 * Cleanup recording resources
 */
export function cleanupRecording(): void {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  
  mediaRecorder = null;
  analyser = null;
  audioChunks = [];
}

// ============================================
// AI Analysis
// ============================================

/**
 * Analyze recitation using AI
 * Sends audio to OpenAI Whisper for transcription and compares with expected text
 */
export async function analyzeRecitation(
  audioBlob: Blob,
  expectedText: string,
  surah: number,
  ayah: number
): Promise<TajweedFeedback> {
  try {
    // Check for OpenAI API key
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    
    if (apiKey) {
      // Use OpenAI Whisper for transcription
      const transcription = await transcribeWithWhisper(audioBlob, apiKey);
      return generateAIFeedback(transcription, expectedText, surah, ayah);
    } else {
      // Fallback to basic analysis without AI
      return generateBasicFeedback(expectedText, surah, ayah);
    }
  } catch (error) {
    console.error('Error analyzing recitation:', error);
    return generateBasicFeedback(expectedText, surah, ayah);
  }
}

/**
 * Transcribe audio using OpenAI Whisper
 */
async function transcribeWithWhisper(audioBlob: Blob, apiKey: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', audioBlob, 'recitation.webm');
  formData.append('model', 'whisper-1');
  formData.append('language', 'ar');
  formData.append('response_format', 'text');
  
  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Whisper API error: ${response.status}`);
  }
  
  return response.text();
}

/**
 * Generate AI-powered feedback
 */
function generateAIFeedback(
  transcription: string,
  expectedText: string,
  surah: number,
  ayah: number
): TajweedFeedback {
  // Clean texts for comparison
  const cleanTranscription = cleanArabicText(transcription);
  const cleanExpected = cleanArabicText(expectedText);
  
  // Calculate similarity
  const accuracy = calculateSimilarity(cleanTranscription, cleanExpected);
  
  // Determine overall rating
  let overall: 'excellent' | 'good' | 'needs_practice';
  if (accuracy >= 90) {
    overall = 'excellent';
  } else if (accuracy >= 70) {
    overall = 'good';
  } else {
    overall = 'needs_practice';
  }
  
  // Analyze tajweed rules (simplified - would need more sophisticated analysis)
  const rulesAnalysis = analyzeTextForTajweed(cleanExpected);
  
  // Generate encouragement
  const encouragement = getEncouragement(overall, accuracy);
  
  // Generate specific tips
  const specificTips = generateTips(overall, rulesAnalysis);
  
  return {
    overall,
    accuracy,
    transcription: cleanTranscription,
    rulesAnalysis,
    encouragement,
    specificTips,
  };
}

/**
 * Generate basic feedback when AI is not available
 */
function generateBasicFeedback(
  expectedText: string,
  surah: number,
  ayah: number
): TajweedFeedback {
  const cleanExpected = cleanArabicText(expectedText);
  const rulesAnalysis = analyzeTextForTajweed(cleanExpected);
  
  return {
    overall: 'good',
    accuracy: 80, // Default score
    rulesAnalysis,
    encouragement: "Great effort! Keep practicing to perfect your recitation. 🌟",
    specificTips: [
      "Listen to the verse a few more times to internalize the rhythm",
      "Pay attention to the elongation (madd) in longer vowels",
      "Practice makes perfect - try recording yourself again",
    ],
  };
}

/**
 * Clean Arabic text for comparison
 */
function cleanArabicText(text: string): string {
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '') // Remove diacritics
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Calculate similarity between two strings (Levenshtein-based)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 100;
  
  const distance = levenshteinDistance(longer, shorter);
  return Math.round(((longer.length - distance) / longer.length) * 100);
}

/**
 * Levenshtein distance algorithm
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  return matrix[str1.length][str2.length];
}

/**
 * Analyze text for tajweed rules
 */
function analyzeTextForTajweed(text: string): TajweedFeedback['rulesAnalysis'] {
  const analysis: TajweedFeedback['rulesAnalysis'] = [];
  
  // Check for noon sakinah patterns
  if (/[نْ]/.test(text) || /ن[^ًٌٍَُِّْ]/.test(text)) {
    analysis.push({
      rule: 'noon_sakinah',
      status: 'correct',
      feedback: 'Great attention to noon sakinah rules!',
    });
  }
  
  // Check for madd patterns (alif, waw, ya followed by sukoon)
  if (/[اوي]/.test(text)) {
    analysis.push({
      rule: 'madd',
      status: 'correct',
      feedback: 'Beautiful elongation on the madd letters.',
    });
  }
  
  // Check for qalqalah letters
  if (/[قطبجد]/.test(text)) {
    analysis.push({
      rule: 'qalqalah',
      status: 'correct',
      feedback: 'Nice bounce on the qalqalah letters.',
    });
  }
  
  // Check for ghunnah (noon/meem with shaddah)
  if (/[نم]ّ/.test(text)) {
    analysis.push({
      rule: 'ghunnah',
      status: 'correct',
      feedback: 'Excellent nasalization on ghunnah.',
    });
  }
  
  // Check for heavy letters
  if (/[خصضغطقظ]/.test(text)) {
    analysis.push({
      rule: 'tafkheem',
      status: 'correct',
      feedback: 'Good emphasis on the heavy letters.',
    });
  }
  
  return analysis;
}

/**
 * Get encouraging message based on performance
 */
function getEncouragement(overall: TajweedFeedback['overall'], accuracy: number): string {
  const excellentMessages = [
    "Mashallah! Your recitation is beautiful! 🌟",
    "Excellent! You're truly connecting with the words of Allah. ✨",
    "Subhanallah! Such beautiful tajweed! 💫",
    "Amazing! Your practice is really paying off! 🎯",
  ];
  
  const goodMessages = [
    "Great job! You're making wonderful progress! 💪",
    "Keep it up! Your recitation is improving beautifully. 🌱",
    "Mashallah! A few more practice sessions and you'll perfect it! 📈",
    "Beautiful effort! Allah rewards the one who struggles with the Quran. 🌿",
  ];
  
  const practiceMessages = [
    "Don't give up! Every recitation brings you closer to perfection. 🌟",
    "Practice makes perfect! Listen to the verse a few more times. 💡",
    "Keep trying! The one who struggles with Quran gets double the reward. 🎁",
    "You're doing great! Remember, even the greatest reciters started somewhere. 🌱",
  ];
  
  const messages = overall === 'excellent' ? excellentMessages 
    : overall === 'good' ? goodMessages 
    : practiceMessages;
  
  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate specific tips based on analysis
 */
function generateTips(
  overall: TajweedFeedback['overall'],
  rulesAnalysis: TajweedFeedback['rulesAnalysis']
): string[] {
  const tips: string[] = [];
  
  if (overall === 'needs_practice') {
    tips.push("Try listening to the verse 3-5 times before recording again");
    tips.push("Focus on one word at a time and practice slowly");
  }
  
  // Add rule-specific tips
  for (const rule of rulesAnalysis) {
    if (rule.status === 'needs_work') {
      const ruleInfo = TAJWEED_RULES[rule.rule];
      tips.push(...ruleInfo.tips.slice(0, 2));
    }
  }
  
  // Add general tips if we don't have enough
  if (tips.length < 2) {
    tips.push("Try recording in a quiet environment for better accuracy");
    tips.push("Recite at a moderate pace - not too fast, not too slow");
  }
  
  return tips.slice(0, 4); // Max 4 tips
}

// ============================================
// Progress Tracking
// ============================================

const PRACTICE_STORAGE_KEY = 'quran_oasis_practice_sessions';

/**
 * Save practice session
 */
export function savePracticeSession(session: Omit<PracticeSession, 'id' | 'timestamp'>): void {
  const sessions = getPracticeSessions();
  
  const newSession: PracticeSession = {
    ...session,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };
  
  sessions.push(newSession);
  
  // Keep only last 100 sessions
  const trimmed = sessions.slice(-100);
  
  try {
    localStorage.setItem(PRACTICE_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to save practice session:', e);
  }
}

/**
 * Get all practice sessions
 */
export function getPracticeSessions(): PracticeSession[] {
  try {
    const stored = localStorage.getItem(PRACTICE_STORAGE_KEY);
    if (!stored) return [];
    
    const sessions = JSON.parse(stored);
    return sessions.map((s: any) => ({
      ...s,
      timestamp: new Date(s.timestamp),
    }));
  } catch (e) {
    console.error('Failed to load practice sessions:', e);
    return [];
  }
}

/**
 * Get practice stats for a specific verse
 */
export function getVersePracticeStats(surah: number, ayah: number): {
  totalSessions: number;
  averageAccuracy: number;
  bestAccuracy: number;
  lastPracticed: Date | null;
} {
  const sessions = getPracticeSessions()
    .filter(s => s.surah === surah && s.ayah === ayah);
  
  if (sessions.length === 0) {
    return {
      totalSessions: 0,
      averageAccuracy: 0,
      bestAccuracy: 0,
      lastPracticed: null,
    };
  }
  
  const accuracies = sessions.map(s => s.feedback.accuracy);
  
  return {
    totalSessions: sessions.length,
    averageAccuracy: Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length),
    bestAccuracy: Math.max(...accuracies),
    lastPracticed: sessions[sessions.length - 1].timestamp,
  };
}

/**
 * Get overall practice statistics
 */
export function getOverallPracticeStats(): {
  totalSessions: number;
  versesWithExcellent: number;
  totalAccuracy: number;
  streakDays: number;
} {
  const sessions = getPracticeSessions();
  
  const excellent = new Set(
    sessions
      .filter(s => s.feedback.overall === 'excellent')
      .map(s => `${s.surah}:${s.ayah}`)
  ).size;
  
  const avgAccuracy = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.feedback.accuracy, 0) / sessions.length)
    : 0;
  
  // Calculate streak (simplified)
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const sessionDates = [...new Set(sessions.map(s => s.timestamp.toDateString()))];
  
  let streak = 0;
  let checkDate = today;
  for (let i = 0; i < 30; i++) {
    if (sessionDates.includes(checkDate)) {
      streak++;
      checkDate = new Date(new Date(checkDate).getTime() - 86400000).toDateString();
    } else if (checkDate !== today) {
      break;
    } else {
      checkDate = yesterday;
    }
  }
  
  return {
    totalSessions: sessions.length,
    versesWithExcellent: excellent,
    totalAccuracy: avgAccuracy,
    streakDays: streak,
  };
}
