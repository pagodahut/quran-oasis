/**
 * Learning Mode System
 * 
 * Defines three modes that control what sections users see:
 * - beginner: New to Quran/Arabic → Shows Learn + Practice + Quran
 * - intermediate: Knows basics, memorizing → Shows Practice + Quran (hides Learn)
 * - hafiz: Already memorized, doing revision → Shows Quran only (hides Learn + standalone Practice)
 */

export type LearningMode = 'beginner' | 'intermediate' | 'hafiz';

export interface LearningModeConfig {
  id: LearningMode;
  label: string;
  description: string;
  shortDesc: string;
  showLearn: boolean;
  showPractice: boolean;
  showQuran: boolean; // Always true, but explicit for clarity
}

export const LEARNING_MODES: Record<LearningMode, LearningModeConfig> = {
  beginner: {
    id: 'beginner',
    label: "I'm new to Quran",
    description: "New to Quran/Arabic - Show all learning features including lessons, practice, and Quran",
    shortDesc: "Learn + Practice + Quran",
    showLearn: true,
    showPractice: true,
    showQuran: true,
  },
  intermediate: {
    id: 'intermediate',
    label: "I know basics, want to memorize",
    description: "Knows basics, focusing on memorization - Show practice and Quran, hide lessons",
    shortDesc: "Practice + Quran",
    showLearn: false,
    showPractice: true,
    showQuran: true,
  },
  hafiz: {
    id: 'hafiz',
    label: "I'm a Hafiz doing revision",
    description: "Already memorized, doing revision - Show Quran only with per-ayah memorization/practice",
    shortDesc: "Quran only",
    showLearn: false,
    showPractice: false,
    showQuran: true,
  },
};

export const LEARNING_MODE_OPTIONS = Object.values(LEARNING_MODES);

// Local storage key
const LEARNING_MODE_KEY = 'quranOasis_learningMode';

/**
 * Get learning mode from localStorage
 */
export function getLearningMode(): LearningMode {
  if (typeof window === 'undefined') return 'beginner';
  
  const stored = localStorage.getItem(LEARNING_MODE_KEY);
  if (stored && isValidLearningMode(stored)) {
    return stored as LearningMode;
  }
  return 'beginner';
}

/**
 * Set learning mode in localStorage
 */
export function setLearningMode(mode: LearningMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LEARNING_MODE_KEY, mode);
  
  // Dispatch custom event so other components can react
  window.dispatchEvent(new CustomEvent('learningModeChanged', { detail: mode }));
}

/**
 * Check if a string is a valid learning mode
 */
export function isValidLearningMode(mode: string): mode is LearningMode {
  return mode === 'beginner' || mode === 'intermediate' || mode === 'hafiz';
}

/**
 * Get the config for a learning mode
 */
export function getLearningModeConfig(mode: LearningMode): LearningModeConfig {
  return LEARNING_MODES[mode];
}

/**
 * Check if a specific section should be shown for a learning mode
 */
export function shouldShowSection(mode: LearningMode, section: 'learn' | 'practice' | 'quran'): boolean {
  const config = LEARNING_MODES[mode];
  switch (section) {
    case 'learn':
      return config.showLearn;
    case 'practice':
      return config.showPractice;
    case 'quran':
      return config.showQuran;
    default:
      return true;
  }
}

/**
 * Infer learning mode from onboarding data
 */
export function inferLearningModeFromOnboarding(
  arabicLevel: string,
  priorMemorization: string
): LearningMode {
  // If they know significant Quran (multiple juz or more), they're probably a hafiz or advanced
  if (priorMemorization === 'significant') {
    return 'hafiz';
  }
  
  // If they know multiple juz or juz amma and are fluent in Arabic, intermediate
  if (priorMemorization === 'multiple_juz' || priorMemorization === 'juz_amma') {
    if (arabicLevel === 'fluent' || arabicLevel === 'intermediate') {
      return 'intermediate';
    }
  }
  
  // If they're fluent and know some surahs, intermediate
  if ((arabicLevel === 'fluent' || arabicLevel === 'intermediate') && 
      priorMemorization === 'some_surahs') {
    return 'intermediate';
  }
  
  // Default to beginner
  return 'beginner';
}
