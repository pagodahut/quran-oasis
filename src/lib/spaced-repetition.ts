/**
 * Spaced Repetition System for Quran Memorization
 * 
 * Based on SM-2 algorithm, adapted for hifz (Quran memorization) categories:
 *   - Sabaq  (new lesson)  → reviewed daily until interval > 3 days
 *   - Sabqi  (recent)      → interval 3–14 days
 *   - Manzil (long-term)   → interval > 14 days
 * 
 * Usage:
 *   import { srs } from '@/lib/spaced-repetition';
 *   
 *   // Record a review
 *   srs.recordReview(2, 255, 'good');
 *   
 *   // Get what's due today
 *   const due = srs.getDueAyahs();
 *   // { sabaq: [...], sabqi: [...], manzil: [...] }
 *   
 *   // Add new ayahs to memorization queue
 *   srs.addAyahs(67, 1, 12); // Al-Mulk: 1-12
 */

// ─── Types ─────────────────────────────────────────────────────────

export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';
export type HifzCategory = 'sabaq' | 'sabqi' | 'manzil';

export interface AyahSRSState {
  /** Surah:Ayah key */
  key: string;
  surahNumber: number;
  ayahNumber: number;
  /** SM-2 ease factor (starts at 2.5) */
  easeFactor: number;
  /** Current interval in days */
  interval: number;
  /** Number of consecutive successful reviews */
  repetitions: number;
  /** ISO date of next review */
  nextReviewDate: string;
  /** ISO date of last review */
  lastReviewDate: string | null;
  /** ISO date when ayah was added */
  addedDate: string;
  /** Accuracy score from last session (0-1) */
  lastAccuracy: number;
  /** Total number of reviews */
  totalReviews: number;
}

export interface DueAyahs {
  sabaq: AyahSRSState[];
  sabqi: AyahSRSState[];
  manzil: AyahSRSState[];
}

export interface SRSStats {
  totalAyahs: number;
  dueToday: number;
  averageAccuracy: number;
  longestStreak: number;
  /** Days since first ayah was added */
  daysSinceStart: number;
  /** Ayahs that have graduated to manzil */
  manzilCount: number;
}

// ─── SM-2 Constants ────────────────────────────────────────────────

const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;
const SABQI_THRESHOLD_DAYS = 3;   // interval > 3 days → sabqi
const MANZIL_THRESHOLD_DAYS = 14; // interval > 14 days → manzil

const QUALITY_MAP: Record<ReviewQuality, number> = {
  again: 0,  // Complete blackout
  hard: 3,   // Recalled with difficulty
  good: 4,   // Recalled with some effort
  easy: 5,   // Perfect recall
};

// ─── Storage ───────────────────────────────────────────────────────

const STORAGE_KEY = 'qo_srs_state';
const STATS_KEY = 'qo_srs_stats';

function loadState(): Map<string, AyahSRSState> {
  if (typeof window === 'undefined') return new Map();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const arr: AyahSRSState[] = JSON.parse(raw);
    return new Map(arr.map(a => [a.key, a]));
  } catch {
    return new Map();
  }
}

function saveState(state: Map<string, AyahSRSState>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(state.values())));
  } catch {
    // Storage full — should alert user eventually
  }
}

function makeKey(surah: number, ayah: number): string {
  return `${surah}:${ayah}`;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── SM-2 Algorithm ────────────────────────────────────────────────

function calculateNextReview(
  state: AyahSRSState,
  quality: ReviewQuality
): AyahSRSState {
  const q = QUALITY_MAP[quality];
  const now = today();

  // Calculate new ease factor
  let newEase = state.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  newEase = Math.max(MIN_EASE, newEase);

  let newInterval: number;
  let newReps: number;

  if (q < 3) {
    // Failed — reset
    newInterval = 1;
    newReps = 0;
  } else {
    // Success
    newReps = state.repetitions + 1;
    if (newReps === 1) {
      newInterval = 1;
    } else if (newReps === 2) {
      newInterval = 3;
    } else {
      newInterval = Math.round(state.interval * newEase);
    }
  }

  // Cap interval at 180 days (6 months) for Quran retention
  newInterval = Math.min(newInterval, 180);

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);

  return {
    ...state,
    easeFactor: newEase,
    interval: newInterval,
    repetitions: newReps,
    nextReviewDate: nextDate.toISOString().split('T')[0],
    lastReviewDate: now,
    lastAccuracy: q >= 4 ? 1 : q === 3 ? 0.7 : 0.3,
    totalReviews: state.totalReviews + 1,
  };
}

function categorize(state: AyahSRSState): HifzCategory {
  if (state.interval <= SABQI_THRESHOLD_DAYS) return 'sabaq';
  if (state.interval <= MANZIL_THRESHOLD_DAYS) return 'sabqi';
  return 'manzil';
}

// ─── SRS Engine ────────────────────────────────────────────────────

class SpacedRepetitionEngine {
  private state: Map<string, AyahSRSState>;

  constructor() {
    this.state = loadState();
  }

  /** Reload from localStorage (call after profile sync) */
  reload(): void {
    this.state = loadState();
  }

  /** Add ayahs to the memorization queue */
  addAyahs(surahNumber: number, startAyah: number, endAyah: number): void {
    const now = today();
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      const key = makeKey(surahNumber, ayah);
      if (this.state.has(key)) continue; // Already tracked

      this.state.set(key, {
        key,
        surahNumber,
        ayahNumber: ayah,
        easeFactor: DEFAULT_EASE,
        interval: 0,
        repetitions: 0,
        nextReviewDate: now, // Due immediately
        lastReviewDate: null,
        addedDate: now,
        lastAccuracy: 0,
        totalReviews: 0,
      });
    }
    saveState(this.state);
  }

  /** Add a single ayah */
  addAyah(surahNumber: number, ayahNumber: number): void {
    this.addAyahs(surahNumber, ayahNumber, ayahNumber);
  }

  /** Remove ayahs from tracking */
  removeAyahs(surahNumber: number, startAyah: number, endAyah: number): void {
    for (let ayah = startAyah; ayah <= endAyah; ayah++) {
      this.state.delete(makeKey(surahNumber, ayah));
    }
    saveState(this.state);
  }

  /** Record a review result for a specific ayah */
  recordReview(surahNumber: number, ayahNumber: number, quality: ReviewQuality): AyahSRSState {
    const key = makeKey(surahNumber, ayahNumber);
    let current = this.state.get(key);

    if (!current) {
      // Auto-add if not tracked
      this.addAyah(surahNumber, ayahNumber);
      current = this.state.get(key)!;
    }

    const updated = calculateNextReview(current, quality);
    this.state.set(key, updated);
    saveState(this.state);
    return updated;
  }

  /** Record batch review results (from a review session) */
  recordBatchReview(
    results: { surahNumber: number; ayahNumber: number; quality: ReviewQuality }[]
  ): void {
    for (const r of results) {
      this.recordReview(r.surahNumber, r.ayahNumber, r.quality);
    }
  }

  /** Get all ayahs due for review today, categorized */
  getDueAyahs(): DueAyahs {
    const now = today();
    const due: DueAyahs = { sabaq: [], sabqi: [], manzil: [] };

    for (const state of this.state.values()) {
      if (state.nextReviewDate <= now) {
        const category = categorize(state);
        due[category].push(state);
      }
    }

    // Sort each category: most overdue first
    const sortByOverdue = (a: AyahSRSState, b: AyahSRSState) =>
      a.nextReviewDate.localeCompare(b.nextReviewDate);

    due.sabaq.sort(sortByOverdue);
    due.sabqi.sort(sortByOverdue);
    due.manzil.sort(sortByOverdue);

    return due;
  }

  /** Get count of ayahs due today */
  getDueCount(): { sabaq: number; sabqi: number; manzil: number; total: number } {
    const due = this.getDueAyahs();
    return {
      sabaq: due.sabaq.length,
      sabqi: due.sabqi.length,
      manzil: due.manzil.length,
      total: due.sabaq.length + due.sabqi.length + due.manzil.length,
    };
  }

  /** Get the state for a specific ayah */
  getAyahState(surahNumber: number, ayahNumber: number): AyahSRSState | undefined {
    return this.state.get(makeKey(surahNumber, ayahNumber));
  }

  /** Get all tracked ayahs */
  getAllAyahs(): AyahSRSState[] {
    return Array.from(this.state.values());
  }

  /** Get stats for dashboard display */
  getStats(): SRSStats {
    const all = this.getAllAyahs();
    if (all.length === 0) {
      return { totalAyahs: 0, dueToday: 0, averageAccuracy: 0, longestStreak: 0, daysSinceStart: 0, manzilCount: 0 };
    }

    const now = today();
    const dueToday = all.filter(a => a.nextReviewDate <= now).length;
    const reviewed = all.filter(a => a.totalReviews > 0);
    const avgAccuracy = reviewed.length > 0
      ? reviewed.reduce((sum, a) => sum + a.lastAccuracy, 0) / reviewed.length
      : 0;

    const earliest = all.reduce((min, a) => a.addedDate < min ? a.addedDate : min, all[0].addedDate);
    const daysSinceStart = daysBetween(earliest, now);

    const manzilCount = all.filter(a => categorize(a) === 'manzil').length;

    // Streak: consecutive days with at least one review
    let streak = 0;
    const reviewDates = new Set(all.filter(a => a.lastReviewDate).map(a => a.lastReviewDate!));
    const d = new Date();
    while (reviewDates.has(d.toISOString().split('T')[0])) {
      streak++;
      d.setDate(d.getDate() - 1);
    }

    return {
      totalAyahs: all.length,
      dueToday,
      averageAccuracy: Math.round(avgAccuracy * 100) / 100,
      longestStreak: streak,
      daysSinceStart,
      manzilCount,
    };
  }

  /** Export state for syncing to Clerk metadata */
  exportForSync(): AyahSRSState[] {
    return this.getAllAyahs();
  }

  /** Import state from Clerk metadata sync */
  importFromSync(ayahs: AyahSRSState[]): void {
    for (const a of ayahs) {
      const existing = this.state.get(a.key);
      // Keep whichever has the more recent review
      if (!existing || (a.lastReviewDate && (!existing.lastReviewDate || a.lastReviewDate > existing.lastReviewDate))) {
        this.state.set(a.key, a);
      }
    }
    saveState(this.state);
  }

  /** Clear all data */
  reset(): void {
    this.state.clear();
    saveState(this.state);
  }
}

// ─── Singleton ─────────────────────────────────────────────────────

export const srs = new SpacedRepetitionEngine();

// ─── Helper: Convert SRS state to ReviewAyah refs for SheikhReviewSession ───

export function srsStateToDueRefs(due: DueAyahs): {
  sabaq: { surahNumber: number; ayahNumber: number; daysSinceReview?: number; lastAccuracy?: number }[];
  sabqi: { surahNumber: number; ayahNumber: number; daysSinceReview?: number; lastAccuracy?: number }[];
  manzil: { surahNumber: number; ayahNumber: number; daysSinceReview?: number; lastAccuracy?: number }[];
} {
  const now = today();
  const toRefs = (ayahs: AyahSRSState[]) =>
    ayahs.map(a => ({
      surahNumber: a.surahNumber,
      ayahNumber: a.ayahNumber,
      daysSinceReview: a.lastReviewDate ? daysBetween(a.lastReviewDate, now) : undefined,
      lastAccuracy: a.lastAccuracy || undefined,
    }));

  return {
    sabaq: toRefs(due.sabaq),
    sabqi: toRefs(due.sabqi),
    manzil: toRefs(due.manzil),
  };
}
