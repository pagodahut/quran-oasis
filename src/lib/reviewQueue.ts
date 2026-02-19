// import { prisma } from '@/lib/prisma';
import { getDifficultyLabel } from '@/lib/adaptiveDifficulty';

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
 * Get a prioritized review queue for a user.
 */
export async function getReviewQueue(_userId: string, _limit: number = 10): Promise<ReviewItem[]> {
  // TODO: Re-enable when verseDifficulty model exists
  return [];
}

/**
 * Client-side localStorage fallback for guest users.
 */
export function getReviewQueueLocal(limit: number = 10): ReviewItem[] {
  if (typeof window === 'undefined') return [];
  
  const stored = JSON.parse(localStorage.getItem('verse_difficulty') || '{}');
  const now = Date.now();

  const items: ReviewItem[] = Object.entries(stored).map(([key, v]: [string, unknown]) => {
    const data = v as {
      difficultyScore: number;
      lastAttemptAccuracy: number;
      attemptCount: number;
      nextReviewAt: string;
    };
    const [surah, ayah] = key.split(':').map(Number);
    const nextReview = new Date(data.nextReviewAt);
    const msUntilDue = nextReview.getTime() - now;
    const overdueFactor = msUntilDue <= 0
      ? 1 + Math.abs(msUntilDue) / (24 * 60 * 60 * 1000)
      : 1 / (1 + msUntilDue / (24 * 60 * 60 * 1000));

    const urgencyScore = data.difficultyScore * overdueFactor;

    return {
      surahNumber: surah,
      ayahNumber: ayah,
      difficultyScore: data.difficultyScore,
      difficultyLabel: getDifficultyLabel(data.difficultyScore),
      lastAccuracy: data.lastAttemptAccuracy,
      urgencyScore,
      reason: classifyReason(data.difficultyScore, overdueFactor),
      nextReviewAt: nextReview,
      attemptCount: data.attemptCount,
    };
  });

  items.sort((a, b) => b.urgencyScore - a.urgencyScore);
  return items.slice(0, limit);
}
