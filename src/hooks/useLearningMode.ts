'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  LearningMode,
  LearningModeConfig,
  getLearningMode,
  setLearningMode as setLearningModeStorage,
  getLearningModeConfig,
  shouldShowSection,
} from '@/lib/learningMode';

interface UseLearningModeReturn {
  /** Current learning mode */
  mode: LearningMode;
  /** Config object for current mode */
  config: LearningModeConfig;
  /** Whether the mode has been loaded from storage */
  isLoaded: boolean;
  /** Update the learning mode */
  setMode: (mode: LearningMode) => void;
  /** Check if a section should be shown */
  shouldShow: (section: 'learn' | 'practice' | 'quran') => boolean;
  /** Quick access: should show Learn section */
  showLearn: boolean;
  /** Quick access: should show Practice section */
  showPractice: boolean;
  /** Quick access: should show Quran section (always true) */
  showQuran: boolean;
}

/**
 * Hook to manage user's learning mode preference
 * 
 * @example
 * const { mode, showLearn, showPractice, setMode } = useLearningMode();
 * 
 * // In navigation:
 * {showLearn && <LearnTab />}
 * {showPractice && <PracticeTab />}
 */
export function useLearningMode(): UseLearningModeReturn {
  const [mode, setModeState] = useState<LearningMode>('beginner');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = getLearningMode();
    setModeState(stored);
    setIsLoaded(true);
  }, []);

  // Listen for changes from other components/tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'quranOasis_learningMode' && e.newValue) {
        setModeState(e.newValue as LearningMode);
      }
    };

    const handleCustomEvent = (e: CustomEvent<LearningMode>) => {
      setModeState(e.detail);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('learningModeChanged', handleCustomEvent as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('learningModeChanged', handleCustomEvent as EventListener);
    };
  }, []);

  // Set mode and persist to storage
  const setMode = useCallback((newMode: LearningMode) => {
    setModeState(newMode);
    setLearningModeStorage(newMode);
  }, []);

  // Get config for current mode
  const config = getLearningModeConfig(mode);

  // Helper to check if section should show
  const shouldShow = useCallback(
    (section: 'learn' | 'practice' | 'quran') => shouldShowSection(mode, section),
    [mode]
  );

  return {
    mode,
    config,
    isLoaded,
    setMode,
    shouldShow,
    showLearn: config.showLearn,
    showPractice: config.showPractice,
    showQuran: config.showQuran,
  };
}

export default useLearningMode;
