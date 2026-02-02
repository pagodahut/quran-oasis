/**
 * Motivation Store - Streaks, Goals, Achievements, and Celebrations
 * Offline-first with localStorage, syncs to Clerk when signed in
 */

import { SURAH_METADATA } from './surahMetadata';

// ============ TYPES ============

export interface StreakData {
  current: number;
  longest: number;
  lastActiveDate: string | null;
  freezesAvailable: number;
  freezesUsed: number;
  freezeLastUsedDate: string | null;
}

export interface DailyGoal {
  type: 'minutes' | 'verses';
  target: number;
  todayProgress: number;
  todayDate: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  category: 'streak' | 'progress' | 'milestone' | 'special';
}

export interface JuzProgress {
  juzNumber: number;
  versesMemorized: number;
  totalVerses: number;
  percentage: number;
  status: 'not_started' | 'in_progress' | 'complete';
}

export interface SurahProgressItem {
  surahNumber: number;
  name: string;
  englishName: string;
  versesMemorized: number;
  totalVerses: number;
  percentage: number;
  status: 'not_started' | 'in_progress' | 'complete';
  startedAt: string | null;
  completedAt: string | null;
}

export interface WeeklyStats {
  week: string; // YYYY-WW
  versesMemorized: number;
  versesReviewed: number;
  minutesPracticed: number;
  daysActive: number;
}

export interface MotivationState {
  streak: StreakData;
  dailyGoal: DailyGoal;
  achievements: Achievement[];
  weeklyStats: WeeklyStats[];
  totalVersesMemorized: number;
  totalMinutesLearned: number;
  lastCelebration: string | null;
  pendingCelebrations: string[];
}

// ============ CONSTANTS ============

const STORAGE_KEY = 'quranOasis_motivation';
const TOTAL_QURAN_VERSES = 6236;

// Juz verse ranges (start surah:ayah - end surah:ayah)
export const JUZ_RANGES: { juz: number; startSurah: number; startAyah: number; endSurah: number; endAyah: number; totalVerses: number }[] = [
  { juz: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141, totalVerses: 148 },
  { juz: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252, totalVerses: 111 },
  { juz: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92, totalVerses: 126 },
  { juz: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23, totalVerses: 131 },
  { juz: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147, totalVerses: 124 },
  { juz: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81, totalVerses: 110 },
  { juz: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110, totalVerses: 149 },
  { juz: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87, totalVerses: 142 },
  { juz: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40, totalVerses: 159 },
  { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92, totalVerses: 127 },
  { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5, totalVerses: 151 },
  { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52, totalVerses: 170 },
  { juz: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52, totalVerses: 154 },
  { juz: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128, totalVerses: 227 },
  { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74, totalVerses: 185 },
  { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135, totalVerses: 269 },
  { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78, totalVerses: 190 },
  { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20, totalVerses: 202 },
  { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55, totalVerses: 189 },
  { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45, totalVerses: 171 },
  { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30, totalVerses: 178 },
  { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27, totalVerses: 169 },
  { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31, totalVerses: 237 },
  { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46, totalVerses: 175 },
  { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37, totalVerses: 246 },
  { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30, totalVerses: 226 },
  { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, totalVerses: 399 },
  { juz: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12, totalVerses: 137 },
  { juz: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50, totalVerses: 431 },
  { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, totalVerses: 564 },
];

// Achievement definitions
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlockedAt'>[] = [
  // Streak achievements
  { id: 'streak_7', name: 'Week Warrior', description: '7 day streak', icon: '🔥', category: 'streak' },
  { id: 'streak_30', name: 'Monthly Master', description: '30 day streak', icon: '💪', category: 'streak' },
  { id: 'streak_100', name: 'Century Club', description: '100 day streak', icon: '🏆', category: 'streak' },
  { id: 'streak_365', name: 'Year of Dedication', description: '365 day streak', icon: '👑', category: 'streak' },
  
  // Progress achievements
  { id: 'first_verse', name: 'First Step', description: 'Memorized first verse', icon: '🌱', category: 'progress' },
  { id: 'verses_10', name: 'Getting Started', description: '10 verses memorized', icon: '📖', category: 'progress' },
  { id: 'verses_50', name: 'Growing Strong', description: '50 verses memorized', icon: '🌿', category: 'progress' },
  { id: 'verses_100', name: 'Centurion', description: '100 verses memorized', icon: '💯', category: 'progress' },
  { id: 'verses_500', name: 'Scholar', description: '500 verses memorized', icon: '🎓', category: 'progress' },
  { id: 'verses_1000', name: 'Rising Star', description: '1000 verses memorized', icon: '⭐', category: 'progress' },
  
  // Milestone achievements
  { id: 'first_surah', name: 'Surah Complete', description: 'Completed first surah', icon: '📜', category: 'milestone' },
  { id: 'first_juz', name: 'Juz Complete', description: 'Completed first juz', icon: '📚', category: 'milestone' },
  { id: 'juz_30', name: 'Juz Amma Master', description: 'Completed Juz 30', icon: '🌙', category: 'milestone' },
  { id: 'fatihah', name: 'The Opening', description: 'Memorized Al-Fatihah', icon: '🚪', category: 'milestone' },
  { id: 'kahf', name: 'The Cave', description: 'Memorized Al-Kahf', icon: '⛰️', category: 'milestone' },
  { id: 'yasin', name: 'Heart of Quran', description: 'Memorized Ya-Sin', icon: '❤️', category: 'milestone' },
  { id: 'mulk', name: 'The Sovereignty', description: 'Memorized Al-Mulk', icon: '👑', category: 'milestone' },
  
  // Special achievements
  { id: 'early_bird', name: 'Fajr Learner', description: 'Practiced before sunrise', icon: '🌅', category: 'special' },
  { id: 'night_owl', name: 'Tahajjud Scholar', description: 'Practiced after midnight', icon: '🌙', category: 'special' },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Practiced on both weekend days', icon: '💪', category: 'special' },
  { id: 'perfect_week', name: 'Perfect Week', description: 'Met daily goal every day for a week', icon: '✨', category: 'special' },
];

// Streak milestone thresholds
export const STREAK_MILESTONES = [7, 30, 100, 365];

// ============ DEFAULT STATE ============

function createDefaultState(): MotivationState {
  const today = getTodayKey();
  return {
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: null,
      freezesAvailable: 2,
      freezesUsed: 0,
      freezeLastUsedDate: null,
    },
    dailyGoal: {
      type: 'minutes',
      target: 15,
      todayProgress: 0,
      todayDate: today,
    },
    achievements: ACHIEVEMENT_DEFINITIONS.map(a => ({ ...a, unlockedAt: null })),
    weeklyStats: [],
    totalVersesMemorized: 0,
    totalMinutesLearned: 0,
    lastCelebration: null,
    pendingCelebrations: [],
  };
}

// ============ HELPERS ============

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayKey(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function getWeekKey(date: Date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week1 = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  return `${d.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
}

// ============ CORE OPERATIONS ============

export function getMotivationState(): MotivationState {
  if (typeof window === 'undefined') return createDefaultState();
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return createDefaultState();
    
    const parsed = JSON.parse(stored) as MotivationState;
    
    // Ensure all achievements exist
    const existingIds = new Set(parsed.achievements.map(a => a.id));
    const missingAchievements = ACHIEVEMENT_DEFINITIONS
      .filter(a => !existingIds.has(a.id))
      .map(a => ({ ...a, unlockedAt: null }));
    
    return {
      ...createDefaultState(),
      ...parsed,
      achievements: [...parsed.achievements, ...missingAchievements],
    };
  } catch {
    return createDefaultState();
  }
}

export function saveMotivationState(state: MotivationState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  
  // Dispatch event for UI updates
  window.dispatchEvent(new CustomEvent('motivation-updated', { detail: state }));
}

// ============ STREAK OPERATIONS ============

export function updateStreak(): { streakUpdated: boolean; newMilestone: number | null; streakBroken: boolean } {
  const state = getMotivationState();
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  
  let result = { streakUpdated: false, newMilestone: null as number | null, streakBroken: false };
  
  // Already active today
  if (state.streak.lastActiveDate === today) {
    return result;
  }
  
  // Consecutive day - increase streak
  if (state.streak.lastActiveDate === yesterday) {
    state.streak.current += 1;
    state.streak.longest = Math.max(state.streak.longest, state.streak.current);
    result.streakUpdated = true;
    
    // Check for milestone
    if (STREAK_MILESTONES.includes(state.streak.current)) {
      result.newMilestone = state.streak.current;
      unlockAchievement(`streak_${state.streak.current}`, state);
    }
  } else if (state.streak.lastActiveDate !== today) {
    // Streak broken - check if freeze available
    if (state.streak.freezesAvailable > 0 && state.streak.current > 0) {
      // Auto-use freeze (or prompt user)
      // For now, we reset but could add freeze logic
    }
    
    if (state.streak.current > 0) {
      result.streakBroken = true;
    }
    state.streak.current = 1;
  }
  
  state.streak.lastActiveDate = today;
  saveMotivationState(state);
  
  return result;
}

export function useStreakFreeze(): boolean {
  const state = getMotivationState();
  
  if (state.streak.freezesAvailable <= 0) {
    return false;
  }
  
  state.streak.freezesAvailable -= 1;
  state.streak.freezesUsed += 1;
  state.streak.freezeLastUsedDate = getTodayKey();
  
  saveMotivationState(state);
  return true;
}

export function getStreakInfo() {
  const state = getMotivationState();
  const today = getTodayKey();
  const yesterday = getYesterdayKey();
  
  const isActiveToday = state.streak.lastActiveDate === today;
  const wasActiveYesterday = state.streak.lastActiveDate === yesterday;
  const streakAtRisk = !isActiveToday && wasActiveYesterday && state.streak.current > 0;
  
  return {
    current: state.streak.current,
    longest: state.streak.longest,
    isActiveToday,
    streakAtRisk,
    freezesAvailable: state.streak.freezesAvailable,
    nextMilestone: STREAK_MILESTONES.find(m => m > state.streak.current) || null,
    daysUntilNextMilestone: STREAK_MILESTONES.find(m => m > state.streak.current) 
      ? STREAK_MILESTONES.find(m => m > state.streak.current)! - state.streak.current 
      : 0,
  };
}

// ============ DAILY GOAL OPERATIONS ============

export function setDailyGoal(type: 'minutes' | 'verses', target: number): void {
  const state = getMotivationState();
  state.dailyGoal.type = type;
  state.dailyGoal.target = target;
  saveMotivationState(state);
}

export function updateDailyProgress(amount: number): { goalMet: boolean; percentage: number } {
  const state = getMotivationState();
  const today = getTodayKey();
  
  // Reset if new day
  if (state.dailyGoal.todayDate !== today) {
    state.dailyGoal.todayProgress = 0;
    state.dailyGoal.todayDate = today;
  }
  
  state.dailyGoal.todayProgress += amount;
  
  const percentage = Math.min(100, (state.dailyGoal.todayProgress / state.dailyGoal.target) * 100);
  const goalMet = state.dailyGoal.todayProgress >= state.dailyGoal.target;
  
  saveMotivationState(state);
  
  return { goalMet, percentage };
}

export function getDailyGoalStatus() {
  const state = getMotivationState();
  const today = getTodayKey();
  
  // Reset if new day
  if (state.dailyGoal.todayDate !== today) {
    return {
      type: state.dailyGoal.type,
      target: state.dailyGoal.target,
      progress: 0,
      percentage: 0,
      goalMet: false,
    };
  }
  
  const percentage = Math.min(100, (state.dailyGoal.todayProgress / state.dailyGoal.target) * 100);
  
  return {
    type: state.dailyGoal.type,
    target: state.dailyGoal.target,
    progress: state.dailyGoal.todayProgress,
    percentage,
    goalMet: state.dailyGoal.todayProgress >= state.dailyGoal.target,
  };
}

// ============ ACHIEVEMENT OPERATIONS ============

function unlockAchievement(id: string, state: MotivationState): boolean {
  const achievement = state.achievements.find(a => a.id === id);
  if (!achievement || achievement.unlockedAt) {
    return false;
  }
  
  achievement.unlockedAt = new Date().toISOString();
  state.pendingCelebrations.push(id);
  
  return true;
}

export function checkAndUnlockAchievements(
  versesMemorized: number,
  completedSurahs: number[],
  completedJuz: number[]
): string[] {
  const state = getMotivationState();
  const newAchievements: string[] = [];
  
  // Verse milestones
  if (versesMemorized >= 1 && unlockAchievement('first_verse', state)) newAchievements.push('first_verse');
  if (versesMemorized >= 10 && unlockAchievement('verses_10', state)) newAchievements.push('verses_10');
  if (versesMemorized >= 50 && unlockAchievement('verses_50', state)) newAchievements.push('verses_50');
  if (versesMemorized >= 100 && unlockAchievement('verses_100', state)) newAchievements.push('verses_100');
  if (versesMemorized >= 500 && unlockAchievement('verses_500', state)) newAchievements.push('verses_500');
  if (versesMemorized >= 1000 && unlockAchievement('verses_1000', state)) newAchievements.push('verses_1000');
  
  // Surah milestones
  if (completedSurahs.length >= 1 && unlockAchievement('first_surah', state)) newAchievements.push('first_surah');
  if (completedSurahs.includes(1) && unlockAchievement('fatihah', state)) newAchievements.push('fatihah');
  if (completedSurahs.includes(18) && unlockAchievement('kahf', state)) newAchievements.push('kahf');
  if (completedSurahs.includes(36) && unlockAchievement('yasin', state)) newAchievements.push('yasin');
  if (completedSurahs.includes(67) && unlockAchievement('mulk', state)) newAchievements.push('mulk');
  
  // Juz milestones
  if (completedJuz.length >= 1 && unlockAchievement('first_juz', state)) newAchievements.push('first_juz');
  if (completedJuz.includes(30) && unlockAchievement('juz_30', state)) newAchievements.push('juz_30');
  
  state.totalVersesMemorized = versesMemorized;
  saveMotivationState(state);
  
  return newAchievements;
}

export function getAchievements() {
  const state = getMotivationState();
  return {
    unlocked: state.achievements.filter(a => a.unlockedAt !== null),
    locked: state.achievements.filter(a => a.unlockedAt === null),
    all: state.achievements,
    pendingCelebrations: state.pendingCelebrations,
  };
}

export function clearPendingCelebration(id: string): void {
  const state = getMotivationState();
  state.pendingCelebrations = state.pendingCelebrations.filter(c => c !== id);
  saveMotivationState(state);
}

export function clearAllPendingCelebrations(): void {
  const state = getMotivationState();
  state.pendingCelebrations = [];
  saveMotivationState(state);
}

// ============ PROGRESS CALCULATIONS ============

export function getQuranProgress(): {
  versesMemorized: number;
  totalVerses: number;
  percentage: number;
} {
  const state = getMotivationState();
  
  // Get from progress store for accurate count
  if (typeof window !== 'undefined') {
    try {
      const progressData = localStorage.getItem('quranOasis_progress');
      if (progressData) {
        const parsed = JSON.parse(progressData);
        const verses = Object.values(parsed.verses || {}) as { status: string }[];
        const memorized = verses.filter(v => 
          v.status === 'memorized' || v.status === 'reviewing' || v.status === 'learning'
        ).length;
        
        return {
          versesMemorized: memorized,
          totalVerses: TOTAL_QURAN_VERSES,
          percentage: Math.round((memorized / TOTAL_QURAN_VERSES) * 1000) / 10,
        };
      }
    } catch {
      // Fall back to motivation state
    }
  }
  
  return {
    versesMemorized: state.totalVersesMemorized,
    totalVerses: TOTAL_QURAN_VERSES,
    percentage: Math.round((state.totalVersesMemorized / TOTAL_QURAN_VERSES) * 1000) / 10,
  };
}

export function getJuzProgress(): JuzProgress[] {
  // Get memorized verses from progress store
  const memorizedVerses = new Set<string>();
  
  if (typeof window !== 'undefined') {
    try {
      const progressData = localStorage.getItem('quranOasis_progress');
      if (progressData) {
        const parsed = JSON.parse(progressData);
        Object.entries(parsed.verses || {}).forEach(([key, value]) => {
          const v = value as { status: string };
          if (v.status === 'memorized' || v.status === 'reviewing' || v.status === 'learning') {
            memorizedVerses.add(key);
          }
        });
      }
    } catch {
      // Empty set
    }
  }
  
  return JUZ_RANGES.map(juz => {
    let versesInJuz = 0;
    let memorizedInJuz = 0;
    
    // Count verses in this juz and how many are memorized
    for (let s = juz.startSurah; s <= juz.endSurah; s++) {
      const surahMeta = SURAH_METADATA.find(sm => sm.number === s);
      if (!surahMeta) continue;
      
      const startAyah = s === juz.startSurah ? juz.startAyah : 1;
      const endAyah = s === juz.endSurah ? juz.endAyah : surahMeta.numberOfAyahs;
      
      for (let a = startAyah; a <= endAyah; a++) {
        versesInJuz++;
        if (memorizedVerses.has(`${s}:${a}`)) {
          memorizedInJuz++;
        }
      }
    }
    
    const percentage = versesInJuz > 0 ? Math.round((memorizedInJuz / versesInJuz) * 100) : 0;
    
    return {
      juzNumber: juz.juz,
      versesMemorized: memorizedInJuz,
      totalVerses: versesInJuz,
      percentage,
      status: percentage === 0 ? 'not_started' : percentage === 100 ? 'complete' : 'in_progress',
    };
  });
}

export function getSurahProgressList(): SurahProgressItem[] {
  // Get memorized verses from progress store
  const memorizedVerses = new Map<number, { count: number; startedAt: string | null }>();
  
  if (typeof window !== 'undefined') {
    try {
      const progressData = localStorage.getItem('quranOasis_progress');
      if (progressData) {
        const parsed = JSON.parse(progressData);
        Object.entries(parsed.verses || {}).forEach(([key, value]) => {
          const v = value as { status: string; lastReview?: string };
          if (v.status === 'memorized' || v.status === 'reviewing' || v.status === 'learning') {
            const surah = parseInt(key.split(':')[0]);
            const current = memorizedVerses.get(surah) || { count: 0, startedAt: null };
            current.count++;
            if (!current.startedAt && v.lastReview) {
              current.startedAt = v.lastReview;
            }
            memorizedVerses.set(surah, current);
          }
        });
      }
    } catch {
      // Empty map
    }
  }
  
  return SURAH_METADATA.map(surah => {
    const progress = memorizedVerses.get(surah.number) || { count: 0, startedAt: null };
    const percentage = Math.round((progress.count / surah.numberOfAyahs) * 100);
    
    return {
      surahNumber: surah.number,
      name: surah.name,
      englishName: surah.englishName,
      versesMemorized: progress.count,
      totalVerses: surah.numberOfAyahs,
      percentage,
      status: percentage === 0 ? 'not_started' : percentage === 100 ? 'complete' : 'in_progress',
      startedAt: progress.startedAt,
      completedAt: percentage === 100 ? new Date().toISOString() : null,
    };
  });
}

export function getWeeklyProgress(weeks: number = 8): WeeklyStats[] {
  const state = getMotivationState();
  
  // Get activity from progress store
  if (typeof window !== 'undefined') {
    try {
      const progressData = localStorage.getItem('quranOasis_progress');
      if (progressData) {
        const parsed = JSON.parse(progressData);
        const dailyActivity = parsed.dailyActivity || [];
        
        // Group by week
        const weeklyMap = new Map<string, WeeklyStats>();
        
        dailyActivity.forEach((day: { 
          date: string; 
          versesMemorized: number; 
          versesReviewed: number; 
          minutesPracticed: number 
        }) => {
          const weekKey = getWeekKey(new Date(day.date));
          const existing = weeklyMap.get(weekKey) || {
            week: weekKey,
            versesMemorized: 0,
            versesReviewed: 0,
            minutesPracticed: 0,
            daysActive: 0,
          };
          
          existing.versesMemorized += day.versesMemorized || 0;
          existing.versesReviewed += day.versesReviewed || 0;
          existing.minutesPracticed += day.minutesPracticed || 0;
          if (day.versesMemorized > 0 || day.versesReviewed > 0) {
            existing.daysActive++;
          }
          
          weeklyMap.set(weekKey, existing);
        });
        
        // Get last N weeks
        const sortedWeeks = Array.from(weeklyMap.values())
          .sort((a, b) => a.week.localeCompare(b.week))
          .slice(-weeks);
        
        return sortedWeeks;
      }
    } catch {
      // Fall back to state
    }
  }
  
  return state.weeklyStats.slice(-weeks);
}

// ============ CELEBRATION TRIGGERS ============

export type CelebrationEvent = 
  | { type: 'lesson_complete'; xp: number }
  | { type: 'surah_complete'; surahNumber: number; surahName: string }
  | { type: 'juz_complete'; juzNumber: number }
  | { type: 'achievement_unlocked'; achievement: Achievement }
  | { type: 'streak_milestone'; days: number }
  | { type: 'daily_goal_met' }
  | { type: 'verse_memorized'; verseCount: number };

export function triggerCelebration(event: CelebrationEvent): void {
  const state = getMotivationState();
  state.lastCelebration = JSON.stringify(event);
  saveMotivationState(state);
  
  // Dispatch custom event for UI to react
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('celebration', { detail: event }));
  }
}

export function getLastCelebration(): CelebrationEvent | null {
  const state = getMotivationState();
  if (!state.lastCelebration) return null;
  
  try {
    return JSON.parse(state.lastCelebration);
  } catch {
    return null;
  }
}
