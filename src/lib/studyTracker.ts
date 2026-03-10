/**
 * Study Tracker - Lightweight usage tracking for personalized study insights
 * Uses localStorage to track which features students use most
 */

import { useEffect, useState, useCallback } from 'react';

// ============================================
// Types
// ============================================

export type StudyPage = 'mushaf' | 'recite' | 'practice' | 'lessons' | 'flashcards' | 'dashboard' | 'profile' | 'settings';

export interface PageVisit {
  page: StudyPage;
  timestamp: number;
  surahNumber?: number;
  lessonId?: string;
}

export interface StudySession {
  startTime: number;
  endTime: number;
  pages: StudyPage[];
}

export interface StudyData {
  visits: PageVisit[];
  totalSessions: number;
  lastVisit: number;
  streakDays: number;
  lastStreakDate: string; // YYYY-MM-DD
}

export interface StudyInsights {
  mostUsedFeature: { page: StudyPage; count: number } | null;
  topSurahs: { surah: number; count: number }[];
  streakDays: number;
  totalVisits: number;
  recentActivity: StudyPage[];
  suggestion: string;
}

// ============================================
// Constants
// ============================================

const STORAGE_KEY = 'hifz_study_data';
const MAX_VISITS = 500; // Keep last 500 visits to avoid bloat

const PAGE_LABELS: Record<StudyPage, string> = {
  mushaf: 'Mushaf Reading',
  recite: 'Recitation Practice',
  practice: 'Practice Sessions',
  lessons: 'Lessons',
  flashcards: 'Flashcard Review',
  dashboard: 'Dashboard',
  profile: 'Profile',
  settings: 'Settings',
};

const SUGGESTIONS: Record<StudyPage, string> = {
  mushaf: 'Try recitation practice to strengthen your memorization',
  recite: 'Review your flashcards to reinforce what you\'ve recited',
  practice: 'Open the Mushaf to deepen your connection with the text',
  lessons: 'Practice reciting what you\'ve learned in your lessons',
  flashcards: 'Read the Mushaf to see your vocabulary in context',
  dashboard: 'Start a study session to continue your progress',
  profile: 'Jump into a lesson to keep your streak going',
  settings: 'Time to study! Open the Mushaf or start a lesson',
};

// ============================================
// Storage helpers
// ============================================

function getStudyData(): StudyData {
  if (typeof window === 'undefined') {
    return { visits: [], totalSessions: 0, lastVisit: 0, streakDays: 0, lastStreakDate: '' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { visits: [], totalSessions: 0, lastVisit: 0, streakDays: 0, lastStreakDate: '' };
    return JSON.parse(raw);
  } catch {
    return { visits: [], totalSessions: 0, lastVisit: 0, streakDays: 0, lastStreakDate: '' };
  }
}

function saveStudyData(data: StudyData): void {
  if (typeof window === 'undefined') return;
  // Trim old visits
  if (data.visits.length > MAX_VISITS) {
    data.visits = data.visits.slice(-MAX_VISITS);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

// ============================================
// Core functions
// ============================================

export function trackPageVisit(page: StudyPage, surahNumber?: number, lessonId?: string): void {
  const data = getStudyData();
  const now = Date.now();
  const today = getTodayStr();

  // Update streak
  if (data.lastStreakDate === today) {
    // Already tracked today
  } else if (data.lastStreakDate === getYesterdayStr()) {
    data.streakDays += 1;
    data.lastStreakDate = today;
  } else if (data.lastStreakDate !== today) {
    data.streakDays = 1;
    data.lastStreakDate = today;
  }

  data.visits.push({ page, timestamp: now, surahNumber, lessonId });
  data.lastVisit = now;
  data.totalSessions += 1;

  saveStudyData(data);
}

export function getStudyInsights(): StudyInsights {
  const data = getStudyData();
  const studyPages: StudyPage[] = ['mushaf', 'recite', 'practice', 'lessons', 'flashcards'];

  // Count by page (only study-relevant pages)
  const pageCounts: Record<string, number> = {};
  const surahCounts: Record<number, number> = {};
  const recentPages: StudyPage[] = [];

  for (const visit of data.visits) {
    if (studyPages.includes(visit.page)) {
      pageCounts[visit.page] = (pageCounts[visit.page] || 0) + 1;
    }
    if (visit.surahNumber) {
      surahCounts[visit.surahNumber] = (surahCounts[visit.surahNumber] || 0) + 1;
    }
  }

  // Recent unique pages (last 10 visits)
  const recent = data.visits.slice(-10);
  const seen = new Set<StudyPage>();
  for (const v of recent.reverse()) {
    if (!seen.has(v.page) && studyPages.includes(v.page)) {
      recentPages.push(v.page);
      seen.add(v.page);
    }
  }

  // Most used feature
  let mostUsedFeature: { page: StudyPage; count: number } | null = null;
  for (const [page, count] of Object.entries(pageCounts)) {
    if (!mostUsedFeature || count > mostUsedFeature.count) {
      mostUsedFeature = { page: page as StudyPage, count };
    }
  }

  // Top surahs
  const topSurahs = Object.entries(surahCounts)
    .map(([s, c]) => ({ surah: Number(s), count: c }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Suggestion based on most used feature
  const suggestion = mostUsedFeature
    ? SUGGESTIONS[mostUsedFeature.page]
    : 'Start your Quran journey by opening the Mushaf or trying a lesson';

  return {
    mostUsedFeature,
    topSurahs,
    streakDays: data.streakDays,
    totalVisits: data.visits.filter(v => studyPages.includes(v.page)).length,
    recentActivity: recentPages,
    suggestion,
  };
}

export function getPageLabel(page: StudyPage): string {
  return PAGE_LABELS[page] || page;
}

// ============================================
// React Hook
// ============================================

export function useStudyTracker(page: StudyPage, surahNumber?: number, lessonId?: string) {
  useEffect(() => {
    trackPageVisit(page, surahNumber, lessonId);
  }, [page, surahNumber, lessonId]);
}

export function useStudyInsights() {
  const [insights, setInsights] = useState<StudyInsights | null>(null);

  useEffect(() => {
    setInsights(getStudyInsights());
  }, []);

  return insights;
}
