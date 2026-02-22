// import { prisma } from '@/lib/prisma'; // TODO: re-enable when verseDifficulty model exists

/**
 * Adaptive Difficulty Algorithm
 * 
 * Calculates verse difficulty based on:
 * - Historical accuracy (weighted average, recent attempts weighted more)
 * - Number of attempts needed to reach >80% accuracy
 * - Time between successful recalls (longer gaps = harder to retain)
 * - Arabic complexity hints (verse length as proxy)
 */

// TODO: verify if still needed - intervals for unused difficulty calculation
// const BASE_INTERVALS = [4, 12, 24, 72, 168, 336, 720]; // 4h, 12h, 1d, 3d, 1w, 2w, 1mo

// TODO: verify if still needed - helper functions for unused difficulty calculation
// function getNextReviewDate(difficulty: number, attemptCount: number, lastAccuracy: number): Date {
//   // Higher accuracy + more attempts = longer interval
//   const successLevel = Math.max(0, Math.min(attemptCount - 1, BASE_INTERVALS.length - 1));
//   const baseHours = BASE_INTERVALS[successLevel] || BASE_INTERVALS[BASE_INTERVALS.length - 1];
//   
//   // Scale interval: easy verses get longer gaps, hard ones shorter
//   const difficultyMultiplier = 1.5 - difficulty; // 0.5x for hard (1.0), 1.5x for easy (0.0)
//   const accuracyBonus = lastAccuracy > 0.8 ? 1.3 : lastAccuracy > 0.6 ? 1.0 : 0.6;
//   
//   const hours = baseHours * difficultyMultiplier * accuracyBonus;
//   const next = new Date();
//   next.setTime(next.getTime() + hours * 60 * 60 * 1000);
//   return next;
// }

// function computeDifficultyScore(
//   currentScore: number,
//   attemptCount: number,
//   latestAccuracy: number,
//   lastAttemptAt: Date | null,
// ): number {
//   // Weight recent accuracy more heavily
//   const recencyWeight = 0.6;
//   const historyWeight = 1 - recencyWeight;
//   
//   // Accuracy factor: low accuracy = high difficulty
//   const accuracyFactor = 1 - latestAccuracy;
//   
//   // Attempt factor: more attempts to master = harder
//   const attemptFactor = Math.min(1, attemptCount / 20); // Normalize to 0-1 over 20 attempts
//   
//   // Retention factor: if long time since last attempt and accuracy was low, harder
//   let retentionFactor = 0;
//   if (lastAttemptAt) {
//     const hoursSinceLast = (Date.now() - lastAttemptAt.getTime()) / (1000 * 60 * 60);
//     // Longer gap with mediocre accuracy = harder to retain
//     if (latestAccuracy < 0.8 && hoursSinceLast > 48) {
//       retentionFactor = Math.min(0.3, hoursSinceLast / 720 * 0.3);
//     }
//   }
//   
//   // Weighted combination
//   const newScore = 
//     recencyWeight * accuracyFactor + 
//     historyWeight * currentScore * 0.5 +
//     historyWeight * attemptFactor * 0.3 +
//     retentionFactor;
//   
//   return Math.max(0, Math.min(1, newScore));
// }

// TODO: verify if still needed - async difficulty calculation not currently used
// export async function calculateDifficulty(
//   _userId: string,
//   _surahNumber: number,
//   _ayahNumber: number,
//   latestAccuracy: number,
// ) {
//   // TODO: Re-enable when verseDifficulty model is added to Prisma schema
//   const difficultyScore = 1 - latestAccuracy;
//   return {
//     difficultyScore,
//     nextReviewAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
//     attemptCount: 1,
//   };
// }

// TODO: verify if still needed - local difficulty calculation not currently used
// export function calculateDifficultyLocal(
//   surahNumber: number,
//   ayahNumber: number,
//   latestAccuracy: number,
// ): { difficultyScore: number; nextReviewAt: string } {
//   const key = `verse_difficulty`;
//   const stored = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem(key) || '{}') : {};
//   const verseKey = `${surahNumber}:${ayahNumber}`;
//   
//   const existing = stored[verseKey] || { difficultyScore: 0.5, attemptCount: 0, lastAttemptAt: null };
//   const attemptCount = existing.attemptCount + 1;
//   
//   const difficultyScore = computeDifficultyScore(
//     existing.difficultyScore,
//     attemptCount,
//     latestAccuracy,
//     existing.lastAttemptAt ? new Date(existing.lastAttemptAt) : null,
//   );
//   
//   const nextReviewAt = getNextReviewDate(difficultyScore, attemptCount, latestAccuracy);
//   
//   stored[verseKey] = {
//     difficultyScore,
//     lastAttemptAccuracy: latestAccuracy,
//     attemptCount,
//     lastAttemptAt: new Date().toISOString(),
//     nextReviewAt: nextReviewAt.toISOString(),
//   };
//   
//   if (typeof window !== 'undefined') {
//     localStorage.setItem(key, JSON.stringify(stored));
//   }
//   
//   return { difficultyScore, nextReviewAt: nextReviewAt.toISOString() };
// }

/**
 * Get difficulty label from score.
 */
export function getDifficultyLabel(score: number): 'Easy' | 'Medium' | 'Hard' {
  if (score < 0.33) return 'Easy';
  if (score < 0.66) return 'Medium';
  return 'Hard';
}

/**
 * Get difficulty badge color classes.
 */
export function getDifficultyColor(score: number): string {
  if (score < 0.33) return 'bg-green-500/20 text-green-400 border-green-500/30';
  if (score < 0.66) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}
