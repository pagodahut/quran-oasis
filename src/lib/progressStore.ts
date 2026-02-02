/**
 * Progress Store - localStorage-based state management
 * Tracks memorization progress, streaks, and daily activity
 */

import { VerseProgress, MemorizationStatus, StudyCategory, calculateNextReview, initializeVerse, QualityRating } from './memorizationSystem';
import { 
  updateStreak, 
  updateDailyProgress, 
  triggerCelebration,
  checkAndUnlockAchievements,
  getSurahProgressList as getMotivationSurahProgress,
  getJuzProgress,
} from './motivationStore';
import { SURAH_METADATA } from './surahMetadata';

// ============ TYPES ============

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  versesMemorized: number;
  versesReviewed: number;
  minutesPracticed: number;
  sessionsCompleted: number;
}

export interface UserProgress {
  verses: Record<string, VerseProgress>; // key: "surah:ayah"
  dailyActivity: DailyActivity[];
  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };
  settings: {
    preferredReciter: string;
    dailyGoalMinutes: number;
    showTranslation: boolean;
    showTransliteration: boolean;
  };
  achievements: string[];
  totalXP: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

// ============ STORAGE KEYS ============

const STORAGE_KEY = 'quranOasis_progress';
const CURRENT_SESSION_KEY = 'quranOasis_currentSession';

// ============ DEFAULT STATE ============

function createDefaultProgress(): UserProgress {
  const now = new Date().toISOString();
  return {
    verses: {},
    dailyActivity: [],
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: null,
    },
    settings: {
      preferredReciter: 'alafasy',
      dailyGoalMinutes: 15,
      showTranslation: true,
      showTransliteration: false,
    },
    achievements: [],
    totalXP: 0,
    level: 1,
    createdAt: now,
    updatedAt: now,
  };
}

// ============ CORE OPERATIONS ============

/**
 * Get all progress data
 */
export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return createDefaultProgress();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultProgress();
    
    const parsed = JSON.parse(stored) as UserProgress;
    // Ensure all required fields exist
    return {
      ...createDefaultProgress(),
      ...parsed,
    };
  } catch {
    return createDefaultProgress();
  }
}

/**
 * Save progress data
 */
export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  
  progress.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  
  // Dispatch event for sync
  window.dispatchEvent(new CustomEvent('progress-updated', { detail: progress }));
}

/**
 * Get verse key
 */
function getVerseKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

// ============ VERSE OPERATIONS ============

/**
 * Get progress for a specific verse
 */
export function getVerseProgress(surah: number, ayah: number): VerseProgress | null {
  const progress = getProgress();
  const key = getVerseKey(surah, ayah);
  return progress.verses[key] || null;
}

/**
 * Start memorizing a verse
 */
export function startMemorizingVerse(surah: number, ayah: number): VerseProgress {
  const progress = getProgress();
  const key = getVerseKey(surah, ayah);
  
  // Check if already started
  if (progress.verses[key]) {
    return progress.verses[key];
  }
  
  // Initialize new verse
  const verse: VerseProgress = {
    ...initializeVerse(surah, ayah),
    status: 'learning',
    confidence: 0,
    category: 'sabaq',
  };
  
  progress.verses[key] = verse;
  saveProgress(progress);
  
  return verse;
}

/**
 * Complete a memorization session for a verse
 */
export function completeVerseSession(
  surah: number, 
  ayah: number, 
  quality: QualityRating
): VerseProgress {
  const progress = getProgress();
  const key = getVerseKey(surah, ayah);
  
  let verse = progress.verses[key];
  if (!verse) {
    verse = initializeVerse(surah, ayah);
  }
  
  // Calculate new review schedule
  const updates = calculateNextReview(verse, quality);
  verse = { ...verse, ...updates };
  
  // Update category based on when first memorized
  const firstMemorized = verse.lastReview 
    ? new Date(verse.lastReview) 
    : new Date();
  
  const daysSince = Math.floor(
    (new Date().getTime() - firstMemorized.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  if (daysSince <= 1) verse.category = 'sabaq';
  else if (daysSince <= 7) verse.category = 'sabqi';
  else verse.category = 'manzil';
  
  progress.verses[key] = verse;
  
  // Update daily activity
  updateDailyActivity(progress, { versesReviewed: 1 });
  
  // Update streak
  updateStreak(progress);
  
  // Add XP
  const xpGained = quality >= 4 ? 10 : quality >= 3 ? 5 : 2;
  progress.totalXP += xpGained;
  progress.level = Math.floor(progress.totalXP / 100) + 1;
  
  saveProgress(progress);
  
  return verse;
}

/**
 * Mark verse as memorized after 10-3 session
 */
export function markVerseMemorized(surah: number, ayah: number): VerseProgress {
  const progress = getProgress();
  const key = getVerseKey(surah, ayah);
  
  let verse = progress.verses[key];
  if (!verse) {
    verse = initializeVerse(surah, ayah);
  }
  
  verse = {
    ...verse,
    status: 'learning',
    confidence: 50, // Initial confidence after first memorization
    lastReview: new Date(),
    nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    totalReviews: verse.totalReviews + 1,
    category: 'sabaq',
  };
  
  progress.verses[key] = verse;
  
  // Update daily activity
  updateDailyActivity(progress, { versesMemorized: 1, sessionsCompleted: 1 });
  
  // Update streak
  updateStreak(progress);
  
  // Add XP for completing memorization
  progress.totalXP += 25;
  progress.level = Math.floor(progress.totalXP / 100) + 1;
  
  saveProgress(progress);
  
  return verse;
}

// ============ DAILY ACTIVITY ============

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function updateDailyActivity(
  progress: UserProgress, 
  updates: Partial<DailyActivity>
): void {
  const today = getTodayKey();
  let todayActivity = progress.dailyActivity.find(d => d.date === today);
  
  if (!todayActivity) {
    todayActivity = {
      date: today,
      versesMemorized: 0,
      versesReviewed: 0,
      minutesPracticed: 0,
      sessionsCompleted: 0,
    };
    progress.dailyActivity.push(todayActivity);
  }
  
  if (updates.versesMemorized) {
    todayActivity.versesMemorized += updates.versesMemorized;
  }
  if (updates.versesReviewed) {
    todayActivity.versesReviewed += updates.versesReviewed;
  }
  if (updates.minutesPracticed) {
    todayActivity.minutesPracticed += updates.minutesPracticed;
  }
  if (updates.sessionsCompleted) {
    todayActivity.sessionsCompleted += updates.sessionsCompleted;
  }
  
  // Keep only last 90 days of activity
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  progress.dailyActivity = progress.dailyActivity.filter(
    d => new Date(d.date) >= cutoff
  );
}

function updateStreak(progress: UserProgress): void {
  const today = getTodayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = yesterday.toISOString().split('T')[0];
  
  if (progress.streak.lastActiveDate === today) {
    // Already active today, no change needed
    return;
  }
  
  if (progress.streak.lastActiveDate === yesterdayKey) {
    // Consecutive day - increase streak
    progress.streak.current += 1;
    progress.streak.longest = Math.max(progress.streak.longest, progress.streak.current);
  } else if (progress.streak.lastActiveDate !== today) {
    // Streak broken - reset to 1
    progress.streak.current = 1;
  }
  
  progress.streak.lastActiveDate = today;
}

// ============ QUERY FUNCTIONS ============

/**
 * Get verses due for review today
 */
export function getDueVerses(): VerseProgress[] {
  const progress = getProgress();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return Object.values(progress.verses)
    .filter(v => v.status !== 'not_started' && new Date(v.nextReview) <= now)
    .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime());
}

/**
 * Get verses by category (Sabaq/Sabqi/Manzil)
 */
export function getVersesByCategory(): {
  sabaq: VerseProgress[];
  sabqi: VerseProgress[];
  manzil: VerseProgress[];
} {
  const progress = getProgress();
  const verses = Object.values(progress.verses).filter(v => v.status !== 'not_started');
  
  return {
    sabaq: verses.filter(v => v.category === 'sabaq'),
    sabqi: verses.filter(v => v.category === 'sabqi'),
    manzil: verses.filter(v => v.category === 'manzil'),
  };
}

/**
 * Get memorization statistics
 */
export function getStats() {
  const progress = getProgress();
  const verses = Object.values(progress.verses);
  const dueVerses = getDueVerses();
  
  const memorized = verses.filter(v => v.status === 'memorized').length;
  const learning = verses.filter(v => v.status === 'learning').length;
  const reviewing = verses.filter(v => v.status === 'reviewing').length;
  
  const totalConfidence = verses.reduce((sum, v) => sum + v.confidence, 0);
  const avgConfidence = verses.length > 0 ? Math.round(totalConfidence / verses.length) : 0;
  
  return {
    totalVerses: verses.length,
    memorized,
    learning,
    reviewing,
    dueToday: dueVerses.length,
    avgConfidence,
    streak: progress.streak.current,
    longestStreak: progress.streak.longest,
    totalXP: progress.totalXP,
    level: progress.level,
  };
}

/**
 * Get today's activity
 */
export function getTodayActivity(): DailyActivity {
  const progress = getProgress();
  const today = getTodayKey();
  
  return progress.dailyActivity.find(d => d.date === today) || {
    date: today,
    versesMemorized: 0,
    versesReviewed: 0,
    minutesPracticed: 0,
    sessionsCompleted: 0,
  };
}

/**
 * Get activity for last N days
 */
export function getRecentActivity(days: number = 7): DailyActivity[] {
  const progress = getProgress();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  
  return progress.dailyActivity
    .filter(d => new Date(d.date) >= cutoff)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// ============ SESSION MANAGEMENT ============

export interface MemorizationSession {
  surah: number;
  startAyah: number;
  endAyah: number;
  currentAyah: number;
  phase: 'intro' | 'listen' | 'read' | 'memorize' | 'recall' | 'stack' | 'complete';
  repetitions: Record<number, number>; // ayah -> rep count
  startedAt: string;
}

/**
 * Start a new memorization session
 */
export function startSession(surah: number, startAyah: number, endAyah: number): MemorizationSession {
  const session: MemorizationSession = {
    surah,
    startAyah,
    endAyah,
    currentAyah: startAyah,
    phase: 'intro',
    repetitions: {},
    startedAt: new Date().toISOString(),
  };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  }
  
  return session;
}

/**
 * Get current session
 */
export function getCurrentSession(): MemorizationSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(CURRENT_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

/**
 * Update current session
 */
export function updateSession(updates: Partial<MemorizationSession>): MemorizationSession | null {
  const session = getCurrentSession();
  if (!session) return null;
  
  const updated = { ...session, ...updates };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(updated));
  }
  
  return updated;
}

/**
 * End current session
 */
export function endSession(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  }
}

/**
 * Update settings
 */
export function updateSettings(settings: Partial<UserProgress['settings']>): void {
  const progress = getProgress();
  progress.settings = { ...progress.settings, ...settings };
  saveProgress(progress);
}

/**
 * Get settings
 */
export function getSettings(): UserProgress['settings'] {
  return getProgress().settings;
}

/**
 * Get stats formatted for profile display
 */
export function getProgressStats() {
  const progress = getProgress();
  const stats = getStats();
  const activity = getRecentActivity(30);
  
  // Calculate total minutes
  const totalMinutes = activity.reduce((sum, d) => sum + d.minutesPracticed, 0);
  const avgMinutes = activity.length > 0 
    ? Math.round(totalMinutes / activity.length) 
    : 0;
  
  // Calculate unique active days
  const uniqueDays = new Set(activity.filter(d => d.versesMemorized > 0 || d.versesReviewed > 0).map(d => d.date)).size;
  
  return {
    versesMemorized: stats.memorized + stats.learning + stats.reviewing,
    surahsCompleted: Object.keys(
      Object.entries(progress.verses).reduce((acc, [key, v]) => {
        if (v.status === 'memorized' || v.status === 'reviewing') {
          const surah = key.split(':')[0];
          acc[surah] = (acc[surah] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>)
    ).length,
    currentStreak: progress.streak.current,
    totalDaysActive: uniqueDays || 1,
    averageSessionMinutes: avgMinutes,
    totalMinutesLearned: totalMinutes,
  };
}

/**
 * Get all surah progress for profile display
 */
export function getSurahProgressList(): Record<string, { name: string; progress: number }> {
  const progress = getProgress();
  const surahNames: Record<number, string> = {
    1: 'Al-Fatihah',
    2: 'Al-Baqarah',
    112: 'Al-Ikhlas',
    113: 'Al-Falaq',
    114: 'An-Nas',
    103: 'Al-Asr',
    108: 'Al-Kawthar',
    110: 'An-Nasr',
    111: 'Al-Masad',
  };
  
  const surahProgress: Record<string, { name: string; progress: number }> = {};
  
  Object.entries(progress.verses).forEach(([key, verse]) => {
    const surah = parseInt(key.split(':')[0]);
    if (!surahProgress[surah]) {
      surahProgress[surah] = {
        name: surahNames[surah] || `Surah ${surah}`,
        progress: 0,
      };
    }
    if (verse.status === 'memorized' || verse.status === 'reviewing') {
      surahProgress[surah].progress = Math.min(100, surahProgress[surah].progress + 10);
    }
  });
  
  return surahProgress;
}

/**
 * Check if a surah is started
 */
export function isSurahStarted(surah: number): boolean {
  const progress = getProgress();
  return Object.keys(progress.verses).some(key => key.startsWith(`${surah}:`));
}

/**
 * Get progress for a surah
 */
export function getSurahProgress(surah: number): {
  versesMemorized: number;
  totalVerses: number;
  percentage: number;
} {
  const progress = getProgress();
  const surahVerses = Object.entries(progress.verses)
    .filter(([key]) => key.startsWith(`${surah}:`))
    .map(([, v]) => v);
  
  // We need to get total verses from quran data
  // For now return based on what we have
  const memorized = surahVerses.filter(v => 
    v.status === 'memorized' || v.status === 'reviewing'
  ).length;
  
  return {
    versesMemorized: memorized,
    totalVerses: surahVerses.length || 1,
    percentage: surahVerses.length > 0 
      ? Math.round((memorized / surahVerses.length) * 100) 
      : 0,
  };
}
