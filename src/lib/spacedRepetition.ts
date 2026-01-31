/**
 * Spaced Repetition Algorithm (SM-2 based)
 * 
 * The SM-2 algorithm calculates optimal review intervals based on:
 * - Quality of recall (0-5 scale)
 * - Ease factor (difficulty multiplier)
 * - Number of successful repetitions
 * 
 * Modified for Quran memorization with Islamic learning principles
 */

// ============ TYPES ============

export interface ReviewCard {
  easeFactor: number;   // 1.3 - 2.5+, difficulty multiplier
  interval: number;     // Days until next review
  repetitions: number;  // Successful reviews in a row
  nextReview: Date;
  lastReview?: Date;
  lastQuality?: number;
}

export interface ReviewResult {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date;
}

// Quality ratings
export const QUALITY_RATINGS = {
  BLACKOUT: 0,        // Complete blackout, couldn't recall
  INCORRECT: 1,       // Incorrect response, but recognized
  HARD: 2,            // Correct with serious difficulty
  GOOD: 3,            // Correct with some hesitation
  EASY: 4,            // Correct with minor hesitation
  PERFECT: 5          // Perfect recall, immediate
} as const;

export type QualityRating = typeof QUALITY_RATINGS[keyof typeof QUALITY_RATINGS];

// ============ SM-2 ALGORITHM ============

/**
 * Calculate the next review based on quality rating
 * 
 * @param card Current card state
 * @param quality Quality of recall (0-5)
 * @returns Updated card state
 */
export function calculateNextReview(card: ReviewCard, quality: QualityRating): ReviewResult {
  let { easeFactor, interval, repetitions } = card;
  
  // If quality < 3, reset to beginning (failed recall)
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }
  
  // Update ease factor (minimum 1.3)
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  
  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return {
    easeFactor,
    interval,
    repetitions,
    nextReview
  };
}

// ============ QURAN-SPECIFIC INTERVALS ============

/**
 * Modified intervals based on traditional Hifz methodology
 * Combines SM-2 with Islamic memorization practices
 * 
 * Review intervals: 1, 2, 4, 7, 14, 30, 60 days
 */
export const QURAN_INTERVALS = [1, 2, 4, 7, 14, 30, 60];

export function getQuranReviewInterval(repetitions: number, easeFactor: number): number {
  if (repetitions < QURAN_INTERVALS.length) {
    return QURAN_INTERVALS[repetitions];
  }
  // Beyond the fixed intervals, use SM-2 calculation
  const lastFixedInterval = QURAN_INTERVALS[QURAN_INTERVALS.length - 1];
  const extraReps = repetitions - QURAN_INTERVALS.length + 1;
  return Math.round(lastFixedInterval * Math.pow(easeFactor, extraReps));
}

/**
 * Calculate next review using Quran-optimized intervals
 */
export function calculateQuranReview(card: ReviewCard, quality: QualityRating): ReviewResult {
  let { easeFactor, interval, repetitions } = card;
  
  if (quality < 3) {
    // Failed - reset
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    interval = getQuranReviewInterval(repetitions, easeFactor);
  }
  
  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;
  if (easeFactor > 2.5) easeFactor = 2.5;
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return { easeFactor, interval, repetitions, nextReview };
}

// ============ REVIEW SCHEDULING ============

/**
 * Get cards due for review
 */
export function getDueCards<T extends ReviewCard>(cards: T[]): T[] {
  const now = new Date();
  return cards.filter(card => new Date(card.nextReview) <= now);
}

/**
 * Sort cards by urgency (most overdue first)
 */
export function sortByUrgency<T extends ReviewCard>(cards: T[]): T[] {
  const now = new Date().getTime();
  return [...cards].sort((a, b) => {
    const aOverdue = now - new Date(a.nextReview).getTime();
    const bOverdue = now - new Date(b.nextReview).getTime();
    return bOverdue - aOverdue; // Most overdue first
  });
}

/**
 * Calculate daily review load
 */
export function getDailyLoad<T extends ReviewCard>(cards: T[], daysAhead: number = 7): { [day: string]: number } {
  const load: { [day: string]: number } = {};
  const now = new Date();
  
  for (let i = 0; i < daysAhead; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() + i);
    const dayKey = date.toISOString().split('T')[0];
    load[dayKey] = 0;
  }
  
  cards.forEach(card => {
    const reviewDate = new Date(card.nextReview).toISOString().split('T')[0];
    if (reviewDate in load) {
      load[reviewDate]++;
    }
  });
  
  return load;
}

// ============ SESSION PLANNING ============

/**
 * Recommended 70/30 ratio: 70% review, 30% new material
 */
export function planStudySession(
  dueCards: number,
  newCardsAvailable: number,
  targetMinutes: number,
  minutesPerCard: number = 2
): { reviewCount: number; newCount: number } {
  const totalCards = Math.floor(targetMinutes / minutesPerCard);
  
  // Always prioritize reviews
  const reviewCount = Math.min(dueCards, Math.ceil(totalCards * 0.7));
  const remainingSlots = totalCards - reviewCount;
  const newCount = Math.min(newCardsAvailable, remainingSlots, Math.floor(totalCards * 0.3));
  
  return { reviewCount, newCount };
}

// ============ HELPERS ============

/**
 * Create a new card with default values
 */
export function createNewCard(): ReviewCard {
  return {
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date(),
    lastReview: undefined,
    lastQuality: undefined
  };
}

/**
 * Get status label for a card
 */
export function getCardStatus(card: ReviewCard): 'new' | 'learning' | 'reviewing' | 'memorized' {
  if (card.repetitions === 0 && card.interval === 0) return 'new';
  if (card.interval < 7) return 'learning';
  if (card.interval < 30) return 'reviewing';
  return 'memorized';
}

/**
 * Get human-readable next review time
 */
export function getNextReviewText(nextReview: Date): string {
  const now = new Date();
  const diff = nextReview.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days <= 0) return 'Due now';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  if (days < 30) return `In ${Math.floor(days / 7)} weeks`;
  return `In ${Math.floor(days / 30)} months`;
}
