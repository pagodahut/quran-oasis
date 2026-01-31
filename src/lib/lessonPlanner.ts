/**
 * Lesson Planner
 * Generates personalized study plans based on user's onboarding data
 * 
 * Incorporates proven Quran memorization techniques:
 * - 10-3 Method: Read 10x looking, 3x from memory
 * - 20-20 Method: 20 reps looking, 20 from memory
 * - Stacking: Learn verses incrementally, combining as you go
 * - Takrar (Repetition): Traditional method of constant review
 */

import { JUZ_AMMA_SURAHS, SURAH_NAMES } from './quran';

// ============ TYPES ============

export type ArabicLevel = 'none' | 'letters' | 'basic' | 'intermediate' | 'fluent';
export type Goal = 'full_hifz' | 'juz_amma' | 'selected_surahs' | 'daily_recitation';
export type DailyMinutes = 10 | 15 | 20 | 30 | 45 | 60;

export interface OnboardingData {
  arabicLevel: ArabicLevel;
  memorizedBefore: boolean;
  currentMemorized?: string;
  dailyTimeMinutes: DailyMinutes;
  goal: Goal;
}

export interface Lesson {
  id: string;
  type: 'arabic_basics' | 'pronunciation' | 'memorization' | 'review' | 'test';
  title: string;
  titleArabic?: string;
  description: string;
  estimatedMinutes: number;
  prerequisites: string[];
  content: LessonContent;
  xpReward: number;
}

export interface LessonContent {
  objectives: string[];
  steps: LessonStep[];
  techniques?: string[];
  tips?: string[];
}

export interface LessonStep {
  type: 'instruction' | 'audio' | 'practice' | 'quiz' | 'memorize';
  content: string;
  audioRef?: { surah: number; ayah: number };
  repeatCount?: number;
  options?: string[];
  correctAnswer?: number;
}

export interface StudyPlan {
  level: 'beginner' | 'intermediate' | 'advanced';
  dailyNewVerses: number;
  dailyReviewVerses: number;
  startingSurah: number;
  lessons: Lesson[];
  estimatedCompletionWeeks: number;
}

// ============ LESSON TEMPLATES ============

const BEGINNER_LESSONS: Lesson[] = [
  {
    id: 'arabic-alphabet-1',
    type: 'arabic_basics',
    title: 'Arabic Alphabet: Part 1',
    titleArabic: 'الحروف العربية',
    description: 'Learn the first 10 letters of the Arabic alphabet with their sounds',
    estimatedMinutes: 15,
    prerequisites: [],
    xpReward: 50,
    content: {
      objectives: [
        'Recognize letters: أ ب ت ث ج ح خ د ذ ر',
        'Understand letter positions (beginning, middle, end)',
        'Practice basic pronunciation'
      ],
      steps: [
        {
          type: 'instruction',
          content: 'Arabic has 28 letters. Unlike English, Arabic is read right to left. Let\'s start with the first 10 letters.'
        },
        {
          type: 'instruction',
          content: '**Alif (أ)** - The first letter. Sounds like "a" in "father". It\'s a tall vertical line.'
        },
        {
          type: 'audio',
          content: 'Listen to how Alif sounds in Al-Fatiha:',
          audioRef: { surah: 1, ayah: 1 }
        },
        {
          type: 'practice',
          content: 'Try saying "Alif" (أ) out loud 5 times'
        },
        {
          type: 'quiz',
          content: 'Which letter makes the "a" sound?',
          options: ['ب', 'أ', 'ت'],
          correctAnswer: 1
        }
      ],
      techniques: ['Visual association', 'Audio repetition'],
      tips: [
        'Practice writing each letter as you learn it',
        'Say the letter name and sound out loud',
        'Associate each letter with a familiar word'
      ]
    }
  },
  {
    id: 'pronunciation-basics',
    type: 'pronunciation',
    title: 'Tajweed Basics: Proper Pronunciation',
    titleArabic: 'أساسيات التجويد',
    description: 'Learn the fundamentals of Quranic pronunciation (Tajweed)',
    estimatedMinutes: 20,
    prerequisites: ['arabic-alphabet-1'],
    xpReward: 75,
    content: {
      objectives: [
        'Understand makharij (articulation points)',
        'Learn basic tajweed rules',
        'Practice with Al-Fatiha'
      ],
      steps: [
        {
          type: 'instruction',
          content: 'Tajweed (تجويد) means "improvement" or "beautification". It\'s the art of reciting the Quran correctly.'
        },
        {
          type: 'instruction',
          content: 'Every letter in Arabic has a specific point where the sound originates. This is called "makhraj" (مخرج).'
        },
        {
          type: 'audio',
          content: 'Listen carefully to how Sheikh Alafasy pronounces the Bismillah:',
          audioRef: { surah: 1, ayah: 1 }
        },
        {
          type: 'practice',
          content: 'Repeat after the reciter 5 times, focusing on matching the sounds exactly',
          repeatCount: 5
        }
      ],
      tips: [
        'Record yourself and compare with the reciter',
        'Focus on one rule at a time',
        'Practice daily, even for just 10 minutes'
      ]
    }
  },
  {
    id: 'fatiha-memorization',
    type: 'memorization',
    title: 'Memorize Al-Fatiha',
    titleArabic: 'حفظ سورة الفاتحة',
    description: 'Memorize the Opening chapter using the 10-3 method',
    estimatedMinutes: 30,
    prerequisites: ['pronunciation-basics'],
    xpReward: 200,
    content: {
      objectives: [
        'Memorize all 7 verses of Al-Fatiha',
        'Understand the meaning of each verse',
        'Recite with proper tajweed'
      ],
      steps: [
        {
          type: 'instruction',
          content: 'Al-Fatiha is the most important surah - you\'ll recite it in every prayer. Let\'s use the **10-3 method**: Read 10 times looking, then 3 times from memory.'
        },
        {
          type: 'instruction',
          content: '**Verse 1:** بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n"In the name of Allah, the Most Gracious, the Most Merciful"'
        },
        {
          type: 'audio',
          content: 'Listen to verse 1:',
          audioRef: { surah: 1, ayah: 1 }
        },
        {
          type: 'memorize',
          content: 'Read verse 1 while looking at the text, 10 times',
          audioRef: { surah: 1, ayah: 1 },
          repeatCount: 10
        },
        {
          type: 'practice',
          content: 'Now close your eyes and recite verse 1 from memory, 3 times',
          repeatCount: 3
        },
        {
          type: 'instruction',
          content: '**Verse 2:** الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\n"All praise is due to Allah, Lord of all worlds"'
        },
        {
          type: 'audio',
          content: 'Listen to verse 2:',
          audioRef: { surah: 1, ayah: 2 }
        },
        {
          type: 'memorize',
          content: 'Read verse 2 while looking, 10 times',
          audioRef: { surah: 1, ayah: 2 },
          repeatCount: 10
        },
        {
          type: 'practice',
          content: 'Recite verses 1-2 together from memory (stacking)',
          repeatCount: 3
        }
      ],
      techniques: [
        '**10-3 Method**: Read 10 times looking, 3 times from memory',
        '**Stacking**: After memorizing each verse, recite all previous verses together',
        '**Audio Association**: Listen to the reciter before and after your practice'
      ],
      tips: [
        'Memorize in the morning when your mind is fresh',
        'Understand the meaning - it helps retention',
        'Review what you memorized before going to sleep',
        'Recite in your prayers immediately'
      ]
    }
  }
];

// ============ PLAN GENERATION ============

/**
 * Generate a personalized study plan based on onboarding data
 */
export function generateStudyPlan(data: OnboardingData): StudyPlan {
  const level = determineLevel(data);
  const { dailyNew, dailyReview } = calculateDailyLoad(data);
  const lessons = selectLessons(data, level);
  const startingSurah = determineStartingSurah(data);
  const completionWeeks = estimateCompletion(data, lessons.length);
  
  return {
    level,
    dailyNewVerses: dailyNew,
    dailyReviewVerses: dailyReview,
    startingSurah,
    lessons,
    estimatedCompletionWeeks: completionWeeks
  };
}

function determineLevel(data: OnboardingData): 'beginner' | 'intermediate' | 'advanced' {
  if (data.arabicLevel === 'none' || data.arabicLevel === 'letters') {
    return 'beginner';
  }
  if (data.arabicLevel === 'fluent' && data.memorizedBefore) {
    return 'advanced';
  }
  return 'intermediate';
}

function calculateDailyLoad(data: OnboardingData): { dailyNew: number; dailyReview: number } {
  // Base on available time and experience
  const timeMultiplier = data.dailyTimeMinutes / 30; // Normalize to 30 min base
  const expMultiplier = data.memorizedBefore ? 1.5 : 1;
  
  let baseNew = 3; // 3 verses for 30 min session
  let baseReview = 7; // 70/30 ratio
  
  if (data.arabicLevel === 'none') {
    baseNew = 1;
    baseReview = 3;
  } else if (data.arabicLevel === 'fluent') {
    baseNew = 5;
    baseReview = 12;
  }
  
  return {
    dailyNew: Math.round(baseNew * timeMultiplier * expMultiplier),
    dailyReview: Math.round(baseReview * timeMultiplier)
  };
}

function selectLessons(data: OnboardingData, level: string): Lesson[] {
  const lessons: Lesson[] = [];
  
  // Everyone starts with Arabic basics if needed
  if (data.arabicLevel === 'none' || data.arabicLevel === 'letters') {
    lessons.push(...BEGINNER_LESSONS);
  } else if (data.arabicLevel === 'basic') {
    // Skip alphabet, start with pronunciation
    lessons.push(...BEGINNER_LESSONS.filter(l => l.type !== 'arabic_basics'));
  }
  
  // Add memorization lessons based on goal
  // (In full implementation, would generate surah-specific lessons)
  
  return lessons;
}

function determineStartingSurah(data: OnboardingData): number {
  // Most beginners start with Juz Amma (last 30th of Quran)
  // Specifically with short surahs at the end
  if (data.goal === 'juz_amma' || data.arabicLevel === 'none') {
    return 114; // Start with An-Nas
  }
  if (data.goal === 'full_hifz' && data.memorizedBefore) {
    return 1; // Start from the beginning
  }
  return 114; // Default to starting from the end
}

function estimateCompletion(data: OnboardingData, lessonCount: number): number {
  // Rough estimate based on daily time
  const lessonsPerWeek = Math.ceil(data.dailyTimeMinutes / 15) * 7; // Approx lessons per week
  return Math.ceil(lessonCount / lessonsPerWeek);
}

// ============ LESSON HELPERS ============

/**
 * Get the next lesson in the sequence
 */
export function getNextLesson(completedIds: string[], allLessons: Lesson[]): Lesson | null {
  for (const lesson of allLessons) {
    if (completedIds.includes(lesson.id)) continue;
    
    // Check prerequisites
    const prereqsMet = lesson.prerequisites.every(p => completedIds.includes(p));
    if (prereqsMet) return lesson;
  }
  return null;
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completedIds: string[], allLessons: Lesson[]): number {
  return Math.round((completedIds.length / allLessons.length) * 100);
}

/**
 * Get total XP earned
 */
export function calculateTotalXP(completedIds: string[], allLessons: Lesson[]): number {
  return allLessons
    .filter(l => completedIds.includes(l.id))
    .reduce((sum, l) => sum + l.xpReward, 0);
}
