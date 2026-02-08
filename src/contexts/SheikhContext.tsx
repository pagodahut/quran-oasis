'use client';

/**
 * SheikhContext — The Global Brain for AI Sheikh Integration
 * 
 * This context makes the AI Sheikh contextually aware across the entire app.
 * Any page can:
 *   1. Set the current ayah/surah context (so the sheikh knows what you're studying)
 *   2. Set the current page context (so the sheikh adapts its behavior)
 *   3. Open/close the sheikh panel without navigating away
 *   4. Pre-load a question (e.g., "Ask about this ayah" sends a question on open)
 * 
 * Usage in any component:
 *   const { openSheikh, setAyahContext } = useSheikh();
 *   
 *   // When user taps an ayah:
 *   setAyahContext({ surahNumber: 2, ayahNumber: 255, ... });
 *   openSheikh(); // Opens panel overlay — user stays on current page
 *   
 *   // Or open with a pre-loaded question:
 *   openSheikh("What are the tajweed rules in this ayah?");
 * 
 * Wrap your app with <SheikhProvider> in layout.tsx
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { AyahContext } from '@/hooks/useSheikhChat';

// ─── Types ───────────────────────────────────────────────────────────

/** Where in the app the user currently is */
export type SheikhPage =
  | 'mushaf'
  | 'lesson'
  | 'recite'
  | 'practice'
  | 'dashboard'
  | 'techniques'
  | 'profile'
  | 'other';

/** Extra context about what the user is doing on the current page */
export interface SheikhPageContext {
  page: SheikhPage;
  /** Current lesson ID if on a lesson page */
  lessonId?: string;
  /** Lesson title for display */
  lessonTitle?: string;
  /** Whether the user is mid-recitation */
  isReciting?: boolean;
  /** Recent tajweed results if available */
  tajweedResults?: {
    rule: string;
    location: string;
    feedback: string;
  }[];
  /** How many times user replayed current section (for "stuck?" detection) */
  replayCount?: number;
  /** How many failed recitation attempts */
  failedAttempts?: number;
}

interface SheikhContextValue {
  // ─── Ayah Context ────────────────────────────────────────────────
  /** The ayah the user is currently looking at / studying */
  ayahContext: AyahContext | undefined;
  /** Set the current ayah context (call this from mushaf, lessons, etc.) */
  setAyahContext: (ctx: AyahContext | undefined) => void;

  // ─── Page Context ────────────────────────────────────────────────
  /** Which page the user is on + extra metadata */
  pageContext: SheikhPageContext;
  /** Update page context (call this from each page's useEffect) */
  setPageContext: (ctx: SheikhPageContext) => void;

  // ─── User Level ──────────────────────────────────────────────────
  /** User's learning level */
  userLevel: 'beginner' | 'intermediate' | 'advanced';
  /** Set user level (from onboarding/profile) */
  setUserLevel: (level: 'beginner' | 'intermediate' | 'advanced') => void;

  // ─── Panel State ─────────────────────────────────────────────────
  /** Whether the sheikh panel is open */
  isSheikhOpen: boolean;
  /** Open the sheikh panel, optionally with a pre-loaded question */
  openSheikh: (initialQuestion?: string) => void;
  /** Close the sheikh panel */
  closeSheikh: () => void;
  /** Toggle the panel */
  toggleSheikh: () => void;

  // ─── Pre-loaded Question ─────────────────────────────────────────
  /** A question to auto-send when the panel opens */
  pendingQuestion: string | undefined;
  /** Clear the pending question (called by SheikhChat after sending) */
  clearPendingQuestion: () => void;

  // ─── Stuck Detection ─────────────────────────────────────────────
  /** Increment replay count (call from lesson audio replay) */
  incrementReplayCount: () => void;
  /** Increment failed attempts (call from recitation failure) */
  incrementFailedAttempts: () => void;
  /** Whether the user appears stuck (5+ replays OR 3+ failures) */
  isUserStuck: boolean;
  /** Dismiss the "stuck" prompt so it doesn't show again this session */
  dismissStuckPrompt: () => void;
  /** Whether the stuck prompt was already dismissed */
  stuckPromptDismissed: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────

const SheikhContext = createContext<SheikhContextValue | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────

export function SheikhProvider({ children }: { children: ReactNode }) {
  // Ayah context
  const [ayahContext, setAyahContext] = useState<AyahContext | undefined>(undefined);

  // Page context
  const [pageContext, setPageContextState] = useState<SheikhPageContext>({
    page: 'other',
  });

  // User level (default beginner, should be set from user profile on auth)
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  // Panel state
  const [isSheikhOpen, setIsSheikhOpen] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<string | undefined>(undefined);

  // Stuck detection
  const [stuckPromptDismissed, setStuckPromptDismissed] = useState(false);

  // Use ref to avoid stale closures in stuck detection
  const pageContextRef = useRef(pageContext);
  pageContextRef.current = pageContext;

  const setPageContext = useCallback((ctx: SheikhPageContext) => {
    setPageContextState(ctx);
    // Reset stuck detection when changing pages
    setStuckPromptDismissed(false);
  }, []);

  const openSheikh = useCallback((initialQuestion?: string) => {
    if (initialQuestion) {
      setPendingQuestion(initialQuestion);
    }
    setIsSheikhOpen(true);
  }, []);

  const closeSheikh = useCallback(() => {
    setIsSheikhOpen(false);
    // Don't clear pending question here — SheikhChat handles it after sending
  }, []);

  const toggleSheikh = useCallback(() => {
    setIsSheikhOpen((prev) => !prev);
  }, []);

  const clearPendingQuestion = useCallback(() => {
    setPendingQuestion(undefined);
  }, []);

  const incrementReplayCount = useCallback(() => {
    setPageContextState((prev) => ({
      ...prev,
      replayCount: (prev.replayCount || 0) + 1,
    }));
  }, []);

  const incrementFailedAttempts = useCallback(() => {
    setPageContextState((prev) => ({
      ...prev,
      failedAttempts: (prev.failedAttempts || 0) + 1,
    }));
  }, []);

  const dismissStuckPrompt = useCallback(() => {
    setStuckPromptDismissed(true);
  }, []);

  const isUserStuck =
    !stuckPromptDismissed &&
    ((pageContext.replayCount || 0) >= 5 || (pageContext.failedAttempts || 0) >= 3);

  const value: SheikhContextValue = {
    ayahContext,
    setAyahContext,
    pageContext,
    setPageContext,
    userLevel,
    setUserLevel,
    isSheikhOpen,
    openSheikh,
    closeSheikh,
    toggleSheikh,
    pendingQuestion,
    clearPendingQuestion,
    incrementReplayCount,
    incrementFailedAttempts,
    isUserStuck,
    dismissStuckPrompt,
    stuckPromptDismissed,
  };

  return (
    <SheikhContext.Provider value={value}>
      {children}
    </SheikhContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useSheikh(): SheikhContextValue {
  const context = useContext(SheikhContext);
  if (!context) {
    throw new Error('useSheikh must be used within a SheikhProvider');
  }
  return context;
}
