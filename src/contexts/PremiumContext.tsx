'use client';

/**
 * PremiumContext — Premium gating state management
 * 
 * Tracks premium status and daily interaction limits.
 * Free tier: 3 Sheikh interactions per day.
 * Premium: Unlimited Sheikh, AI study plans, speech recognition.
 * 
 * BYPASS_PREMIUM=true in env skips all gates (dev mode).
 * Interaction count stored in localStorage, resets daily.
 */

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface PremiumState {
  isPremium: boolean;
  canBypass: boolean;
  sheikInteractionsToday: number;
  maxFreeInteractions: number;
  hasReachedLimit: boolean;
}

interface PremiumContextValue extends PremiumState {
  incrementInteraction: () => void;
  canUsePremiumFeature: (feature: 'sheikh' | 'study-plan' | 'speech') => boolean;
  resetDaily: () => void;
}

const STORAGE_KEY = 'hifz_premium_interactions';
const MAX_FREE_INTERACTIONS = 3;

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function getStoredInteractions(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    const data = JSON.parse(stored);
    if (data.date !== getTodayKey()) return 0; // Reset for new day
    return data.count ?? 0;
  } catch {
    return 0;
  }
}

function setStoredInteractions(count: number) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    date: getTodayKey(),
    count,
  }));
}

const PremiumContext = createContext<PremiumContextValue | null>(null);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const canBypass = process.env.NEXT_PUBLIC_BYPASS_PREMIUM === 'true';
  const [isPremium] = useState(false); // Will connect to real payment later
  const [sheikInteractionsToday, setSheikInteractionsToday] = useState(0);

  // Load stored interactions on mount
  useEffect(() => {
    setSheikInteractionsToday(getStoredInteractions());
  }, []);

  const hasReachedLimit = !isPremium && !canBypass && sheikInteractionsToday >= MAX_FREE_INTERACTIONS;

  const incrementInteraction = useCallback(() => {
    setSheikInteractionsToday(prev => {
      const next = prev + 1;
      setStoredInteractions(next);
      return next;
    });
  }, []);

  const canUsePremiumFeature = useCallback((feature: 'sheikh' | 'study-plan' | 'speech') => {
    if (isPremium || canBypass) return true;
    if (feature === 'sheikh') return sheikInteractionsToday < MAX_FREE_INTERACTIONS;
    // Study plans and speech are premium-only
    return false;
  }, [isPremium, canBypass, sheikInteractionsToday]);

  const resetDaily = useCallback(() => {
    setSheikInteractionsToday(0);
    setStoredInteractions(0);
  }, []);

  return (
    <PremiumContext.Provider value={{
      isPremium,
      canBypass,
      sheikInteractionsToday,
      maxFreeInteractions: MAX_FREE_INTERACTIONS,
      hasReachedLimit,
      incrementInteraction,
      canUsePremiumFeature,
      resetDaily,
    }}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium(): PremiumContextValue {
  const ctx = useContext(PremiumContext);
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider');
  return ctx;
}
