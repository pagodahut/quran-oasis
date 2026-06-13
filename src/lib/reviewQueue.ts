import { getDifficultyLabel } from '@/lib/adaptiveDifficulty';
import { srs } from '@/lib/spaced-repetition';

export type ReviewReason = 'overdue' | 'struggling' | 'due for review';

export interface ReviewItem {
  surahNumber: number;
  ayahNumber: number;
  difficultyScore: number;
  difficultyLabel: 'Easy' | 'Medium' | 'Hard';
  lastAccuracy: number;
  urgencyScore: number;
  reason: ReviewReason;
  nextReviewAt: Date;
  attemptCount: number;
}

function classifyReason(difficulty: number, overdueFactor: number): ReviewReason {
  if (overdueFactor > 1.5) return 'overdue';
  if (difficulty > 0.66) return 'struggling';
  return 'due for review';
}

/**
 * Smart Review queue for guest users — sourced from the spaced-repetition
 * store (the same store the memorize flow and Practice hub write to). Was
 * previously reading a `verse_difficulty` key that nothing ever wrote, so the
 * feature was permanently empty.
 */
export function getReviewQueueLocal(limit: number = 10): ReviewItem[] {
  if (typeof window === 'undefined') return [];

  srs.reload();
  const all = srs.getAllAyahs();
  const now = Date.now();
  const DAY = 24 * 60 * 60 * 1000;

  const items: ReviewItem[] = all.map((state) => {
    // Derive a difficulty score from recall accuracy (lower accuracy = harder).
    const difficultyScore = state.totalReviews > 0
      ? Math.min(1, Math.max(0, 1 - state.lastAccuracy))
      : 0.5; // unreviewed → medium urgency
    const nextReview = new Date(`${state.nextReviewDate}T00:00:00`);
    const msUntilDue = nextReview.getTime() - now;
    const overdueFactor = msUntilDue <= 0
      ? 1 + Math.abs(msUntilDue) / DAY
      : 1 / (1 + msUntilDue / DAY);

    return {
      surahNumber: state.surahNumber,
      ayahNumber: state.ayahNumber,
      difficultyScore,
      difficultyLabel: getDifficultyLabel(difficultyScore),
      lastAccuracy: state.lastAccuracy,
      urgencyScore: difficultyScore * overdueFactor,
      reason: classifyReason(difficultyScore, overdueFactor),
      nextReviewAt: nextReview,
      attemptCount: state.totalReviews,
    };
  });

  // Prioritize due/overdue and struggling verses.
  items.sort((a, b) => b.urgencyScore - a.urgencyScore);
  return items.slice(0, limit);
}
