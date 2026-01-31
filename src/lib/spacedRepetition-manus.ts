/**
 * Spaced Repetition Algorithm for Quran Memorization
 * Based on SuperMemo SM-2 algorithm with modifications for Quranic memorization
 */

/**
 * Calculate the next review date based on performance
 * @param confidence - Current confidence level (0-100)
 * @param reviewCount - Number of times reviewed
 * @param quality - Performance quality (0-5)
 *   0: Complete blackout
 *   1: Incorrect response, correct answer remembered
 *   2: Incorrect response, correct answer seemed easy to recall
 *   3: Correct response, but required significant effort
 *   4: Correct response, after some hesitation
 *   5: Perfect response
 * @returns Object with new confidence and next review date
 */
export function calculateNextReview(
  confidence: number,
  reviewCount: number,
  quality: 0 | 1 | 2 | 3 | 4 | 5
): {
  newConfidence: number;
  nextReviewDate: Date;
  intervalDays: number;
} {
  // Update confidence based on quality
  let newConfidence = confidence;

  if (quality >= 4) {
    // Good performance - increase confidence
    newConfidence = Math.min(100, confidence + (100 - confidence) * 0.2);
  } else if (quality === 3) {
    // Acceptable performance - slight increase
    newConfidence = Math.min(100, confidence + (100 - confidence) * 0.1);
  } else {
    // Poor performance - decrease confidence
    newConfidence = Math.max(0, confidence - 20);
  }

  // Calculate interval based on confidence and review count
  let intervalDays: number;

  if (quality < 3) {
    // Failed - review again soon
    intervalDays = 1;
  } else {
    // Calculate interval using modified SM-2 algorithm
    const easinessFactor = 1.3 + (newConfidence / 100) * 1.7; // 1.3 to 3.0

    if (reviewCount === 0) {
      intervalDays = 1;
    } else if (reviewCount === 1) {
      intervalDays = 3;
    } else {
      // Previous interval * easiness factor
      const previousInterval = calculatePreviousInterval(reviewCount - 1, confidence);
      intervalDays = Math.round(previousInterval * easinessFactor);
    }

    // Cap maximum interval at 180 days (6 months)
    intervalDays = Math.min(intervalDays, 180);
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + intervalDays);
  nextReviewDate.setHours(0, 0, 0, 0); // Reset to start of day

  return {
    newConfidence: Math.round(newConfidence),
    nextReviewDate,
    intervalDays,
  };
}

/**
 * Helper function to calculate what the previous interval was
 */
function calculatePreviousInterval(reviewCount: number, confidence: number): number {
  if (reviewCount === 0) return 1;
  if (reviewCount === 1) return 3;

  const easinessFactor = 1.3 + (confidence / 100) * 1.7;
  return Math.round(calculatePreviousInterval(reviewCount - 1, confidence) * easinessFactor);
}

/**
 * Generate initial review schedule for a new verse
 */
export function initializeVerseReview(): {
  confidence: number;
  nextReviewDate: Date;
  reviewCount: number;
} {
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + 1); // Review tomorrow
  nextReviewDate.setHours(0, 0, 0, 0);

  return {
    confidence: 30, // Start with low confidence
    nextReviewDate,
    reviewCount: 0,
  };
}

/**
 * Determine if a verse needs review today
 */
export function needsReview(nextReviewDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reviewDate = new Date(nextReviewDate);
  reviewDate.setHours(0, 0, 0, 0);

  return reviewDate <= today;
}

/**
 * Get recommended daily review count based on user's time commitment
 */
export function getRecommendedDailyReviews(dailyMinutes: number): number {
  // Assume ~2 minutes per verse review (recitation + reflection)
  const versesPerSession = Math.floor(dailyMinutes / 2);

  // Allocate 60% of time to reviews, 40% to new memorization
  return Math.max(1, Math.floor(versesPerSession * 0.6));
}

/**
 * Get recommended new verses per day based on user's level and time
 */
export function getRecommendedNewVerses(
  dailyMinutes: number,
  memorizationLevel: "none" | "some" | "juz_amma" | "multiple_juz" | "hafiz"
): number {
  const versesPerSession = Math.floor(dailyMinutes / 2);
  const newVersesAllocation = Math.floor(versesPerSession * 0.4);

  // Adjust based on experience level
  const levelMultiplier = {
    none: 0.5, // Start slow for beginners
    some: 0.75,
    juz_amma: 1.0,
    multiple_juz: 1.25,
    hafiz: 1.5,
  };

  const multiplier = levelMultiplier[memorizationLevel] || 1.0;
  const recommended = Math.floor(newVersesAllocation * multiplier);

  // Minimum 1, maximum 10 new verses per day
  return Math.max(1, Math.min(10, recommended));
}

/**
 * Calculate overall memorization statistics
 */
export function calculateMemorizationStats(verses: Array<{ confidence: number }>) {
  if (verses.length === 0) {
    return {
      totalVerses: 0,
      averageConfidence: 0,
      masteredVerses: 0, // confidence >= 80
      learningVerses: 0, // 50 <= confidence < 80
      strugglingVerses: 0, // confidence < 50
    };
  }

  const totalVerses = verses.length;
  const totalConfidence = verses.reduce((sum, v) => sum + v.confidence, 0);
  const averageConfidence = totalConfidence / totalVerses;

  const masteredVerses = verses.filter((v) => v.confidence >= 80).length;
  const learningVerses = verses.filter((v) => v.confidence >= 50 && v.confidence < 80).length;
  const strugglingVerses = verses.filter((v) => v.confidence < 50).length;

  return {
    totalVerses,
    averageConfidence: Math.round(averageConfidence),
    masteredVerses,
    learningVerses,
    strugglingVerses,
  };
}

