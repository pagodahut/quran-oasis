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
