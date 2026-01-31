/**
 * Complete Memorization System
 * Combines traditional Hifz methodology with modern spaced repetition
 */

// ============ TYPES ============

export type MemorizationStatus = 
  | 'not_started' 
  | 'learning'     // Currently memorizing
  | 'reviewing'    // In spaced repetition
  | 'memorized';   // Mastered (confidence >= 90%)

export type StudyCategory = 
  | 'sabaq'   // New lesson (today's memorization)
  | 'sabqi'   // Recent review (last 7 days)
  | 'manzil'; // Old revision (older than 7 days)

export interface VerseProgress {
  surah: number;
  ayah: number;
  status: MemorizationStatus;
  confidence: number;       // 0-100
  easeFactor: number;       // 1.3-3.0 (SM-2)
  interval: number;         // Days until next review
  repetitions: number;      // Successful reviews in a row
  lastReview: Date | null;
  nextReview: Date;
  totalReviews: number;
  category: StudyCategory;
}

export type QualityRating = 0 | 1 | 2 | 3 | 4 | 5;
// 0: Complete blackout
// 1: Incorrect, but recognized after seeing
// 2: Incorrect, but seemed easy after seeing
// 3: Correct with significant difficulty
// 4: Correct with slight hesitation
// 5: Perfect recall

// ============ TRADITIONAL HIFZ SCHEDULE ============

/**
 * Traditional Quran review intervals (days)
 * Based on classical Tahfiz methodology
 */
export const QURAN_INTERVALS = [1, 2, 4, 7, 14, 30, 60, 120];

/**
 * Determine study category based on when verse was memorized
 */
export function getStudyCategory(firstMemorized: Date, now: Date = new Date()): StudyCategory {
  const daysSince = Math.floor((now.getTime() - firstMemorized.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSince <= 1) return 'sabaq';   // Today's or yesterday's lesson
  if (daysSince <= 7) return 'sabqi';   // Last week
  return 'manzil';                       // Older
}

// ============ SM-2 ALGORITHM (Quran-optimized) ============

/**
 * Calculate next review based on quality rating
 * Modified SM-2 algorithm optimized for Quran memorization
 */
export function calculateNextReview(
  progress: VerseProgress,
  quality: QualityRating
): Partial<VerseProgress> {
  let { confidence, easeFactor, interval, repetitions } = progress;
  const now = new Date();
  
  // Update confidence based on quality
  if (quality >= 4) {
    // Good performance - increase confidence
    confidence = Math.min(100, confidence + (100 - confidence) * 0.2);
  } else if (quality === 3) {
    // Acceptable - slight increase
    confidence = Math.min(100, confidence + (100 - confidence) * 0.1);
  } else {
    // Poor performance - decrease confidence
    confidence = Math.max(0, confidence - 20);
  }
  
  // Calculate new interval using modified SM-2
  if (quality < 3) {
    // Failed - reset to beginning
    repetitions = 0;
    interval = 1;
  } else {
    // Successful - calculate next interval
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 3;
    } else {
      // Use Quran-specific intervals when available
      if (repetitions < QURAN_INTERVALS.length) {
        interval = QURAN_INTERVALS[repetitions];
      } else {
        interval = Math.round(interval * easeFactor);
      }
    }
    repetitions += 1;
  }
  
  // Update ease factor (minimum 1.3, maximum 3.0)
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, Math.min(3.0, easeFactor));
  
  // Cap maximum interval at 180 days
  interval = Math.min(interval, 180);
  
  // Calculate next review date
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);
  nextReview.setHours(0, 0, 0, 0);
  
  // Determine new status
  let status: MemorizationStatus = 'reviewing';
  if (confidence >= 90 && repetitions >= 5) {
    status = 'memorized';
  } else if (repetitions === 0) {
    status = 'learning';
  }
  
  return {
    confidence: Math.round(confidence),
    easeFactor,
    interval,
    repetitions,
    lastReview: now,
    nextReview,
    totalReviews: progress.totalReviews + 1,
    status,
  };
}

// ============ SESSION PLANNING ============

/**
 * Traditional 70/30 ratio: 70% review, 30% new material
 */
export function planStudySession(
  dueForReview: VerseProgress[],
  availableNew: number,
  dailyMinutes: number
): {
  reviewVerses: VerseProgress[];
  newVersesCount: number;
  estimatedMinutes: number;
} {
  const minutesPerVerse = 2; // Average time per verse
  const totalCapacity = Math.floor(dailyMinutes / minutesPerVerse);
  
  // Prioritize reviews (70%)
  const maxReview = Math.ceil(totalCapacity * 0.7);
  const reviewVerses = dueForReview.slice(0, maxReview);
  
  // Remaining capacity for new verses (30%)
  const remainingCapacity = totalCapacity - reviewVerses.length;
  const maxNew = Math.floor(totalCapacity * 0.3);
  const newVersesCount = Math.min(availableNew, remainingCapacity, maxNew);
  
  return {
    reviewVerses,
    newVersesCount,
    estimatedMinutes: (reviewVerses.length + newVersesCount) * minutesPerVerse,
  };
}

/**
 * Sort verses by review urgency
 */
export function sortByUrgency(verses: VerseProgress[]): VerseProgress[] {
  const now = new Date().getTime();
  
  return [...verses].sort((a, b) => {
    // Most overdue first
    const aOverdue = now - new Date(a.nextReview).getTime();
    const bOverdue = now - new Date(b.nextReview).getTime();
    return bOverdue - aOverdue;
  });
}

/**
 * Get verses due for review
 */
export function getDueVerses(verses: VerseProgress[]): VerseProgress[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  return verses.filter(v => new Date(v.nextReview) <= now);
}

/**
 * Split verses by study category
 */
export function categorizeVerses(verses: VerseProgress[]): {
  sabaq: VerseProgress[];
  sabqi: VerseProgress[];
  manzil: VerseProgress[];
} {
  return {
    sabaq: verses.filter(v => v.category === 'sabaq'),
    sabqi: verses.filter(v => v.category === 'sabqi'),
    manzil: verses.filter(v => v.category === 'manzil'),
  };
}

// ============ INITIALIZATION ============

/**
 * Create initial progress for a new verse
 */
export function initializeVerse(surah: number, ayah: number): VerseProgress {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return {
    surah,
    ayah,
    status: 'not_started',
    confidence: 0,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    lastReview: null,
    nextReview: tomorrow,
    totalReviews: 0,
    category: 'sabaq',
  };
}

/**
 * Start learning a verse (first memorization attempt)
 */
export function startLearning(progress: VerseProgress): VerseProgress {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  
  return {
    ...progress,
    status: 'learning',
    confidence: 30, // Start with low confidence
    nextReview: tomorrow,
  };
}

// ============ STATISTICS ============

export interface MemorizationStats {
  totalVerses: number;
  memorizedVerses: number;
  learningVerses: number;
  reviewingVerses: number;
  averageConfidence: number;
  currentStreak: number;
  longestStreak: number;
  totalReviewsDone: number;
  versesMemorizedThisWeek: number;
  versesReviewedToday: number;
}

export function calculateStats(
  verses: VerseProgress[],
  dailyActivity: { date: string; versesReviewed: number }[]
): MemorizationStats {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  
  const memorized = verses.filter(v => v.status === 'memorized');
  const learning = verses.filter(v => v.status === 'learning');
  const reviewing = verses.filter(v => v.status === 'reviewing');
  
  const totalConfidence = verses.reduce((sum, v) => sum + v.confidence, 0);
  const avgConfidence = verses.length > 0 ? totalConfidence / verses.length : 0;
  
  const totalReviews = verses.reduce((sum, v) => sum + v.totalReviews, 0);
  
  // Calculate streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const sortedActivity = [...dailyActivity].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  for (const day of sortedActivity) {
    if (day.versesReviewed > 0) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      if (currentStreak === 0) currentStreak = tempStreak;
      tempStreak = 0;
    }
  }
  if (currentStreak === 0) currentStreak = tempStreak;
  
  const todayStr = now.toISOString().split('T')[0];
  const todayActivity = dailyActivity.find(d => d.date === todayStr);
  
  return {
    totalVerses: verses.length,
    memorizedVerses: memorized.length,
    learningVerses: learning.length,
    reviewingVerses: reviewing.length,
    averageConfidence: Math.round(avgConfidence),
    currentStreak,
    longestStreak,
    totalReviewsDone: totalReviews,
    versesMemorizedThisWeek: memorized.filter(v => 
      v.lastReview && new Date(v.lastReview) >= weekAgo
    ).length,
    versesReviewedToday: todayActivity?.versesReviewed || 0,
  };
}

// ============ HELPERS ============

/**
 * Format next review time in human-readable format
 */
export function formatNextReview(nextReview: Date): string {
  const now = new Date();
  const diff = new Date(nextReview).getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  
  if (days <= 0) return 'Due now';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  if (days < 30) return `In ${Math.floor(days / 7)} weeks`;
  if (days < 365) return `In ${Math.floor(days / 30)} months`;
  return `In ${Math.floor(days / 365)} years`;
}

/**
 * Get status color for UI
 */
export function getStatusColor(status: MemorizationStatus): string {
  switch (status) {
    case 'memorized': return 'text-sage-400';
    case 'reviewing': return 'text-gold-400';
    case 'learning': return 'text-midnight-400';
    case 'not_started': return 'text-night-500';
    default: return 'text-night-400';
  }
}

/**
 * Get confidence color for progress bars
 */
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 90) return 'bg-sage-500';
  if (confidence >= 70) return 'bg-gold-500';
  if (confidence >= 50) return 'bg-midnight-500';
  return 'bg-night-600';
}
