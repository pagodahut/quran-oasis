/**
 * Traditional Hifz Memorization Flow System
 * ==========================================
 * 
 * This is the CORE DIFFERENTIATOR of the HIFZ app - implementing authentic
 * traditional Tahfiz methodology in a modern app context.
 * 
 * Based on classical methods:
 * - Sabaq-Sabqi-Manzil three-part daily system
 * - 10-3 and 20-20 repetition methods
 * - Stacking (Takrar) for verse chaining
 * - Page method for structured memorization
 * 
 * @module memorization-flow
 */

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

/**
 * The three pillars of traditional Hifz training
 */
export type HifzCategory = 
  | 'sabaq'   // سبق - New lesson (today's memorization)
  | 'sabqi'   // سبقی - Recent review (last 7-30 days)
  | 'manzil'; // منزل - Old revision (older than 30 days)

/**
 * Memorization method selection
 */
export type MemorizationMethod = 
  | '10-3'      // Standard method: 10 reads + 3 recites
  | '20-20'     // Intensive method: 20 reads + 20 recites
  | 'stacking'  // Verse chaining method
  | 'page';     // Page-based structure

/**
 * Difficulty levels for adaptive learning
 */
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'hafiz';

/**
 * Single verse reference
 */
export interface VerseRef {
  surah: number;
  ayah: number;
}

/**
 * A range of verses (used for portions/sections)
 */
export interface VerseRange {
  start: VerseRef;
  end: VerseRef;
}

/**
 * Repetition tracking for the 10-3 and 20-20 methods
 */
export interface RepetitionState {
  method: '10-3' | '20-20';
  lookingReads: number;      // Times read while looking at text
  memoryRecites: number;     // Times recited from memory
  targetLookingReads: number;
  targetMemoryRecites: number;
  attemptsFromMemory: number; // Failed attempts (triggers restart)
  completed: boolean;
}

/**
 * Stacking method state
 */
export interface StackingState {
  currentVerseIndex: number;  // Which verse in the stack we're memorizing
  verses: VerseRef[];         // All verses in the stack
  chainProgress: number[];    // How many times each chain has been recited
  maxChainLength: number;     // Typically 7-10 verses
  consolidationRounds: number; // Full chain recitations
  targetConsolidations: number;
  completed: boolean;
}

/**
 * Page method state
 */
export interface PageMethodState {
  pageNumber: number;
  portions: VerseRange[];     // Page divided into portions
  currentPortion: number;
  portionProgress: {
    memorized: boolean;
    repetitions: number;
  }[];
  connectionRounds: number;   // Times connected to previous pages
  completed: boolean;
}

/**
 * Complete Sabaq (new lesson) session state
 */
export interface SabaqSession {
  category: 'sabaq';
  method: MemorizationMethod;
  verses: VerseRef[];
  startTime: Date;
  endTime?: Date;
  
  // Method-specific state
  repetitionState?: RepetitionState;
  stackingState?: StackingState;
  pageState?: PageMethodState;
  
  // Progress tracking
  currentVerseIndex: number;
  versesCompleted: number;
  totalTime: number; // seconds
  perfectRecites: number;
  mistakeCount: number;
}

/**
 * Sabqi (recent review) session state
 */
export interface SabqiSession {
  category: 'sabqi';
  verses: VerseRef[];
  daysSinceMemorized: number[];
  startTime: Date;
  endTime?: Date;
  
  // Review tracking
  currentVerseIndex: number;
  versesReviewed: number;
  qualityRatings: number[];
  needsReinforcement: VerseRef[]; // Verses that need more work
}

/**
 * Manzil (old revision) session state
 */
export interface ManzilSession {
  category: 'manzil';
  juzRange: { start: number; end: number };
  pagesReviewed: number;
  totalPages: number;
  startTime: Date;
  endTime?: Date;
  
  // Revision tracking
  weakSpots: VerseRef[];
  recitationSpeed: 'slow' | 'moderate' | 'fluent';
  completedJuz: number[];
}

/**
 * Union type for all session types
 */
export type MemorizationSession = SabaqSession | SabqiSession | ManzilSession;

/**
 * User's hifz profile and preferences
 */
export interface HifzProfile {
  level: DifficultyLevel;
  preferredMethod: MemorizationMethod;
  dailyGoalMinutes: number;
  dailyNewVerses: number;
  
  // Traditional schedule settings
  sabaqPagesPerDay: number;    // 0.5 - 2 pages for beginners, up to 1 juz for advanced
  sabqiDaysRange: [number, number]; // [7, 30] days
  manzilJuzPerDay: number;     // 1-3 juz daily
  
  // Adaptive settings
  preferMorningMemorization: boolean;
  enableTajweedReminders: boolean;
  stackingChainSize: number;   // 7-10 verses default
  pagePortionCount: number;    // 3-4 portions per page
}

/**
 * Daily study plan following traditional methodology
 */
export interface DailyStudyPlan {
  date: Date;
  
  // The three components
  sabaq: {
    verses: VerseRef[];
    estimatedMinutes: number;
    recommendedMethod: MemorizationMethod;
  };
  
  sabqi: {
    verses: VerseRef[];
    estimatedMinutes: number;
    priorityVerses: VerseRef[]; // Weakest recent verses
  };
  
  manzil: {
    juzToReview: number[];
    estimatedMinutes: number;
    focusAreas: VerseRange[]; // Known weak spots
  };
  
  totalEstimatedMinutes: number;
  recommendedSchedule: {
    time: string;
    activity: HifzCategory;
    duration: number;
  }[];
}

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Default configuration values
 */
export const HIFZ_DEFAULTS = {
  // 10-3 Method
  LOOKING_READS_10_3: 10,
  MEMORY_RECITES_10_3: 3,
  
  // 20-20 Method
  LOOKING_READS_20_20: 20,
  MEMORY_RECITES_20_20: 20,
  
  // Stacking
  MAX_STACK_SIZE: 10,
  MIN_STACK_SIZE: 3,
  CONSOLIDATION_ROUNDS: 3,
  
  // Page Method
  PORTIONS_PER_PAGE: 4,
  CONNECTION_ROUNDS: 2,
  
  // Sabqi range (days)
  SABQI_MIN_DAYS: 7,
  SABQI_MAX_DAYS: 30,
  
  // Time estimates (seconds per verse)
  SECONDS_PER_VERSE_NEW: 180,      // 3 minutes for new memorization
  SECONDS_PER_VERSE_SABQI: 30,     // 30 seconds for recent review
  SECONDS_PER_VERSE_MANZIL: 10,    // 10 seconds for old revision
  
  // Daily targets by level
  DAILY_TARGETS: {
    beginner: { newVerses: 3, sabqiVerses: 10, manzilJuz: 0.5 },
    intermediate: { newVerses: 7, sabqiVerses: 20, manzilJuz: 1 },
    advanced: { newVerses: 15, sabqiVerses: 40, manzilJuz: 2 },
    hafiz: { newVerses: 20, sabqiVerses: 60, manzilJuz: 3 },
  } as Record<DifficultyLevel, { newVerses: number; sabqiVerses: number; manzilJuz: number }>,
} as const;

/**
 * Recommended daily schedule (based on traditional Tahfiz)
 */
export const TRADITIONAL_SCHEDULE = [
  { time: 'fajr', activity: 'sabaq' as HifzCategory, description: 'New memorization - mind is fresh' },
  { time: 'morning', activity: 'sabqi' as HifzCategory, description: 'Recent review' },
  { time: 'dhuhr', activity: 'manzil' as HifzCategory, description: 'Old revision' },
  { time: 'asr', activity: 'sabqi' as HifzCategory, description: 'Test with teacher (Tasmik)' },
  { time: 'maghrib', activity: 'sabaq' as HifzCategory, description: 'Light review of new lesson' },
  { time: 'isha', activity: 'sabaq' as HifzCategory, description: 'Preparation for tomorrow' },
];

// ============================================================================
// SABAQ SYSTEM (سبق) - New Lesson Methods
// ============================================================================

/**
 * Initialize the 10-3 repetition method for a verse
 * Standard method: Read 10 times looking, then recite 3 times from memory
 */
export function initRepetition10_3(): RepetitionState {
  return {
    method: '10-3',
    lookingReads: 0,
    memoryRecites: 0,
    targetLookingReads: HIFZ_DEFAULTS.LOOKING_READS_10_3,
    targetMemoryRecites: HIFZ_DEFAULTS.MEMORY_RECITES_10_3,
    attemptsFromMemory: 0,
    completed: false,
  };
}

/**
 * Initialize the 20-20 repetition method for difficult verses
 * Intensive method: Read 20 times looking, then recite 20 times from memory
 */
export function initRepetition20_20(): RepetitionState {
  return {
    method: '20-20',
    lookingReads: 0,
    memoryRecites: 0,
    targetLookingReads: HIFZ_DEFAULTS.LOOKING_READS_20_20,
    targetMemoryRecites: HIFZ_DEFAULTS.MEMORY_RECITES_20_20,
    attemptsFromMemory: 0,
    completed: false,
  };
}

/**
 * Record a read while looking at the text
 */
export function recordLookingRead(state: RepetitionState): RepetitionState {
  return {
    ...state,
    lookingReads: state.lookingReads + 1,
  };
}

/**
 * Record a successful recitation from memory
 */
export function recordMemoryRecite(state: RepetitionState, successful: boolean): RepetitionState {
  if (!successful) {
    // Failed attempt - restart the looking phase
    return {
      ...state,
      lookingReads: 0,
      memoryRecites: 0,
      attemptsFromMemory: state.attemptsFromMemory + 1,
    };
  }
  
  const newRecites = state.memoryRecites + 1;
  const isCompleted = newRecites >= state.targetMemoryRecites;
  
  return {
    ...state,
    memoryRecites: newRecites,
    completed: isCompleted,
  };
}

/**
 * Check if ready to attempt recitation from memory
 */
export function canAttemptMemoryRecite(state: RepetitionState): boolean {
  return state.lookingReads >= state.targetLookingReads;
}

/**
 * Get progress percentage for the repetition method
 */
export function getRepetitionProgress(state: RepetitionState): number {
  const lookingProgress = Math.min(state.lookingReads / state.targetLookingReads, 1) * 50;
  const memoryProgress = (state.memoryRecites / state.targetMemoryRecites) * 50;
  return Math.round(lookingProgress + memoryProgress);
}

// ============================================================================
// STACKING METHOD (تكرار) - Verse Chaining
// ============================================================================

/**
 * Initialize stacking method for a set of verses
 * 
 * How it works:
 * 1. Memorize verse 1
 * 2. Memorize verse 2, then recite 1+2
 * 3. Memorize verse 3, then recite 1+2+3
 * 4. Continue until max chain size
 * 5. Consolidate by reciting the full chain multiple times
 */
export function initStackingMethod(
  verses: VerseRef[],
  maxChainLength: number = HIFZ_DEFAULTS.MAX_STACK_SIZE
): StackingState {
  return {
    currentVerseIndex: 0,
    verses: verses.slice(0, maxChainLength),
    chainProgress: new Array(Math.min(verses.length, maxChainLength)).fill(0),
    maxChainLength,
    consolidationRounds: 0,
    targetConsolidations: HIFZ_DEFAULTS.CONSOLIDATION_ROUNDS,
    completed: false,
  };
}

/**
 * Record completion of current verse memorization
 */
export function completeStackingVerse(state: StackingState): StackingState {
  if (state.currentVerseIndex >= state.verses.length - 1) {
    // All verses in stack memorized, now consolidating
    return {
      ...state,
      currentVerseIndex: state.verses.length,
    };
  }
  
  return {
    ...state,
    currentVerseIndex: state.currentVerseIndex + 1,
  };
}

/**
 * Record a chain recitation (verses 1 to currentIndex)
 */
export function recordChainRecitation(
  state: StackingState,
  successful: boolean
): StackingState {
  if (!successful) {
    // Failed - don't advance
    return state;
  }
  
  // Update progress for all verses in the current chain
  const newProgress = [...state.chainProgress];
  for (let i = 0; i <= state.currentVerseIndex && i < newProgress.length; i++) {
    newProgress[i]++;
  }
  
  return {
    ...state,
    chainProgress: newProgress,
  };
}

/**
 * Record a full chain consolidation round
 */
export function recordConsolidationRound(
  state: StackingState,
  successful: boolean
): StackingState {
  if (!successful) {
    return state;
  }
  
  const newRounds = state.consolidationRounds + 1;
  
  return {
    ...state,
    consolidationRounds: newRounds,
    completed: newRounds >= state.targetConsolidations,
  };
}

/**
 * Get current chain that needs to be recited
 */
export function getCurrentChain(state: StackingState): VerseRef[] {
  return state.verses.slice(0, state.currentVerseIndex + 1);
}

/**
 * Check if in consolidation phase (all verses memorized, now reinforcing)
 */
export function isInConsolidationPhase(state: StackingState): boolean {
  return state.currentVerseIndex >= state.verses.length;
}

/**
 * Get stacking progress percentage
 */
export function getStackingProgress(state: StackingState): number {
  if (state.completed) return 100;
  
  const versesProgress = (state.currentVerseIndex / state.verses.length) * 70;
  const consolidationProgress = (state.consolidationRounds / state.targetConsolidations) * 30;
  
  return Math.round(versesProgress + consolidationProgress);
}

// ============================================================================
// PAGE METHOD - Structured Page-Based Memorization
// ============================================================================

/**
 * Initialize page method for a Quran page
 * 
 * How it works:
 * 1. Divide page into portions (typically 3-4)
 * 2. Memorize each portion using 10-3 method
 * 3. Stack portions together
 * 4. Connect to previous pages
 */
export function initPageMethod(
  pageNumber: number,
  portions: VerseRange[],
  portionCount: number = HIFZ_DEFAULTS.PORTIONS_PER_PAGE
): PageMethodState {
  // If portions not provided, they should be calculated based on page content
  const actualPortions = portions.length > 0 ? portions : [];
  
  return {
    pageNumber,
    portions: actualPortions,
    currentPortion: 0,
    portionProgress: actualPortions.map(() => ({
      memorized: false,
      repetitions: 0,
    })),
    connectionRounds: 0,
    completed: false,
  };
}

/**
 * Mark current portion as memorized
 */
export function completePagePortion(state: PageMethodState): PageMethodState {
  const newProgress = [...state.portionProgress];
  newProgress[state.currentPortion] = {
    ...newProgress[state.currentPortion],
    memorized: true,
  };
  
  const nextPortion = state.currentPortion + 1;
  const allPortionsComplete = nextPortion >= state.portions.length;
  
  return {
    ...state,
    currentPortion: allPortionsComplete ? state.currentPortion : nextPortion,
    portionProgress: newProgress,
  };
}

/**
 * Record repetition for current portion
 */
export function recordPortionRepetition(state: PageMethodState): PageMethodState {
  const newProgress = [...state.portionProgress];
  newProgress[state.currentPortion] = {
    ...newProgress[state.currentPortion],
    repetitions: newProgress[state.currentPortion].repetitions + 1,
  };
  
  return {
    ...state,
    portionProgress: newProgress,
  };
}

/**
 * Record a page connection round (reciting this page with previous pages)
 */
export function recordPageConnection(state: PageMethodState): PageMethodState {
  const newRounds = state.connectionRounds + 1;
  
  return {
    ...state,
    connectionRounds: newRounds,
    completed: newRounds >= HIFZ_DEFAULTS.CONNECTION_ROUNDS && 
               state.portionProgress.every(p => p.memorized),
  };
}

/**
 * Get all portions memorized so far (for stacking)
 */
export function getMemorizedPortions(state: PageMethodState): VerseRange[] {
  return state.portions.filter((_, idx) => state.portionProgress[idx].memorized);
}

/**
 * Get page method progress percentage
 */
export function getPageProgress(state: PageMethodState): number {
  if (state.completed) return 100;
  
  const memorizedCount = state.portionProgress.filter(p => p.memorized).length;
  const portionsProgress = (memorizedCount / state.portions.length) * 80;
  const connectionProgress = (state.connectionRounds / HIFZ_DEFAULTS.CONNECTION_ROUNDS) * 20;
  
  return Math.round(portionsProgress + connectionProgress);
}

// ============================================================================
// SABQI SYSTEM (سبقی) - Recent Review
// ============================================================================

/**
 * Get verses that fall into the Sabqi category (7-30 days old)
 */
export function getSabqiVerses(
  allVerses: { verse: VerseRef; memorizedDate: Date }[],
  today: Date = new Date()
): { verse: VerseRef; daysSinceMemorized: number }[] {
  const minDays = HIFZ_DEFAULTS.SABQI_MIN_DAYS;
  const maxDays = HIFZ_DEFAULTS.SABQI_MAX_DAYS;
  
  return allVerses
    .map(v => {
      const daysSince = Math.floor(
        (today.getTime() - v.memorizedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { verse: v.verse, daysSinceMemorized: daysSince };
    })
    .filter(v => v.daysSinceMemorized >= minDays && v.daysSinceMemorized <= maxDays)
    .sort((a, b) => b.daysSinceMemorized - a.daysSinceMemorized); // Oldest first
}

/**
 * Initialize a Sabqi review session
 */
export function initSabqiSession(
  verses: { verse: VerseRef; daysSinceMemorized: number }[]
): SabqiSession {
  return {
    category: 'sabqi',
    verses: verses.map(v => v.verse),
    daysSinceMemorized: verses.map(v => v.daysSinceMemorized),
    startTime: new Date(),
    currentVerseIndex: 0,
    versesReviewed: 0,
    qualityRatings: [],
    needsReinforcement: [],
  };
}

/**
 * Record a Sabqi review result
 */
export function recordSabqiReview(
  session: SabqiSession,
  quality: number // 0-5 scale
): SabqiSession {
  const currentVerse = session.verses[session.currentVerseIndex];
  const needsReinforcement = quality < 3;
  
  return {
    ...session,
    currentVerseIndex: session.currentVerseIndex + 1,
    versesReviewed: session.versesReviewed + 1,
    qualityRatings: [...session.qualityRatings, quality],
    needsReinforcement: needsReinforcement 
      ? [...session.needsReinforcement, currentVerse]
      : session.needsReinforcement,
  };
}

/**
 * Get Sabqi progress
 */
export function getSabqiProgress(session: SabqiSession): number {
  if (session.verses.length === 0) return 100;
  return Math.round((session.versesReviewed / session.verses.length) * 100);
}

/**
 * Prioritize Sabqi verses (weakest and oldest first)
 */
export function prioritizeSabqiVerses(
  verses: { verse: VerseRef; daysSinceMemorized: number; lastQuality?: number }[]
): { verse: VerseRef; daysSinceMemorized: number; lastQuality?: number }[] {
  return [...verses].sort((a, b) => {
    // Lower quality = higher priority
    const qualityDiff = (a.lastQuality ?? 5) - (b.lastQuality ?? 5);
    if (qualityDiff !== 0) return qualityDiff;
    
    // Older = higher priority
    return b.daysSinceMemorized - a.daysSinceMemorized;
  });
}

// ============================================================================
// MANZIL SYSTEM (منزل) - Old Revision
// ============================================================================

/**
 * Standard Manzil division: Split Quran into 7 equal parts
 * Each day, review one Manzil to complete Quran in a week
 */
export const MANZIL_DIVISIONS = [
  { day: 1, name: 'First Manzil', surahs: [1, 2, 3, 4] }, // Al-Fatihah to An-Nisa
  { day: 2, name: 'Second Manzil', surahs: [5, 6, 7, 8, 9] }, // Al-Ma'idah to At-Tawbah
  { day: 3, name: 'Third Manzil', surahs: [10, 11, 12, 13, 14, 15, 16] }, // Yunus to An-Nahl
  { day: 4, name: 'Fourth Manzil', surahs: [17, 18, 19, 20, 21, 22, 23, 24, 25] }, // Al-Isra to Al-Furqan
  { day: 5, name: 'Fifth Manzil', surahs: [26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36] }, // Ash-Shu'ara to Ya-Sin
  { day: 6, name: 'Sixth Manzil', surahs: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49] }, // As-Saffat to Al-Hujurat
  { day: 7, name: 'Seventh Manzil', surahs: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114] }, // Qaf to An-Nas
];

/**
 * Get today's Manzil based on day of week (Saturday = Day 1 in Islamic tradition)
 */
export function getTodaysManzil(date: Date = new Date()): typeof MANZIL_DIVISIONS[0] {
  // Saturday = 6, we want it to be day 1
  const dayOfWeek = date.getDay();
  const manzilDay = dayOfWeek === 6 ? 1 : dayOfWeek + 2;
  const adjustedDay = ((manzilDay - 1) % 7) + 1;
  
  return MANZIL_DIVISIONS[adjustedDay - 1];
}

/**
 * Initialize a Manzil revision session
 */
export function initManzilSession(
  juzRange: { start: number; end: number },
  totalPages: number
): ManzilSession {
  return {
    category: 'manzil',
    juzRange,
    pagesReviewed: 0,
    totalPages,
    startTime: new Date(),
    weakSpots: [],
    recitationSpeed: 'moderate',
    completedJuz: [],
  };
}

/**
 * Record Manzil progress
 */
export function recordManzilProgress(
  session: ManzilSession,
  pagesReviewed: number,
  weakSpots: VerseRef[] = [],
  completedJuz?: number
): ManzilSession {
  return {
    ...session,
    pagesReviewed: session.pagesReviewed + pagesReviewed,
    weakSpots: [...session.weakSpots, ...weakSpots],
    completedJuz: completedJuz 
      ? [...session.completedJuz, completedJuz]
      : session.completedJuz,
  };
}

/**
 * Get Manzil progress
 */
export function getManzilProgress(session: ManzilSession): number {
  if (session.totalPages === 0) return 100;
  return Math.round((session.pagesReviewed / session.totalPages) * 100);
}

/**
 * Get verses older than 30 days (Manzil category)
 */
export function getManzilVerses(
  allVerses: { verse: VerseRef; memorizedDate: Date }[],
  today: Date = new Date()
): VerseRef[] {
  const minDays = HIFZ_DEFAULTS.SABQI_MAX_DAYS; // 30 days
  
  return allVerses
    .filter(v => {
      const daysSince = Math.floor(
        (today.getTime() - v.memorizedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSince > minDays;
    })
    .map(v => v.verse);
}

// ============================================================================
// DAILY STUDY PLAN GENERATION
// ============================================================================

/**
 * Generate a comprehensive daily study plan following traditional methodology
 */
export function generateDailyPlan(
  profile: HifzProfile,
  availableNewVerses: VerseRef[],
  sabqiVerses: { verse: VerseRef; daysSinceMemorized: number }[],
  manzilJuz: number[],
  date: Date = new Date()
): DailyStudyPlan {
  const targets = HIFZ_DEFAULTS.DAILY_TARGETS[profile.level];
  
  // Sabaq planning
  const sabaqVerses = availableNewVerses.slice(0, targets.newVerses);
  const sabaqMethod = sabaqVerses.length > 10 ? '20-20' : 
                      profile.preferredMethod === 'stacking' ? 'stacking' : '10-3';
  const sabaqMinutes = Math.round(
    sabaqVerses.length * HIFZ_DEFAULTS.SECONDS_PER_VERSE_NEW / 60
  );
  
  // Sabqi planning
  const prioritizedSabqi = prioritizeSabqiVerses(sabqiVerses);
  const sabqiVersesToReview = prioritizedSabqi.slice(0, targets.sabqiVerses);
  const sabqiMinutes = Math.round(
    sabqiVersesToReview.length * HIFZ_DEFAULTS.SECONDS_PER_VERSE_SABQI / 60
  );
  const priorityVerses = sabqiVersesToReview
    .filter(v => (v.lastQuality ?? 5) < 3)
    .map(v => v.verse);
  
  // Manzil planning
  const juzToReview = manzilJuz.slice(0, Math.ceil(targets.manzilJuz));
  const manzilPages = juzToReview.length * 20; // ~20 pages per juz
  const manzilMinutes = Math.round(
    manzilPages * 15 * HIFZ_DEFAULTS.SECONDS_PER_VERSE_MANZIL / 60
  ); // ~15 verses per page
  
  const totalMinutes = sabaqMinutes + sabqiMinutes + manzilMinutes;
  
  // Generate recommended schedule
  const schedule = generateSchedule(profile, sabaqMinutes, sabqiMinutes, manzilMinutes);
  
  return {
    date,
    sabaq: {
      verses: sabaqVerses,
      estimatedMinutes: sabaqMinutes,
      recommendedMethod: sabaqMethod as MemorizationMethod,
    },
    sabqi: {
      verses: sabqiVersesToReview.map(v => v.verse),
      estimatedMinutes: sabqiMinutes,
      priorityVerses,
    },
    manzil: {
      juzToReview,
      estimatedMinutes: manzilMinutes,
      focusAreas: [], // Would be populated from weak spots history
    },
    totalEstimatedMinutes: totalMinutes,
    recommendedSchedule: schedule,
  };
}

/**
 * Generate a time-based schedule
 */
function generateSchedule(
  profile: HifzProfile,
  sabaqMinutes: number,
  sabqiMinutes: number,
  manzilMinutes: number
): { time: string; activity: HifzCategory; duration: number }[] {
  const schedule: { time: string; activity: HifzCategory; duration: number }[] = [];
  
  if (profile.preferMorningMemorization) {
    // Traditional schedule
    schedule.push(
      { time: 'After Fajr', activity: 'sabaq', duration: sabaqMinutes },
      { time: 'Morning', activity: 'sabqi', duration: Math.round(sabqiMinutes / 2) },
      { time: 'After Dhuhr', activity: 'manzil', duration: manzilMinutes },
      { time: 'After Asr', activity: 'sabqi', duration: Math.round(sabqiMinutes / 2) },
    );
  } else {
    // Flexible schedule
    schedule.push(
      { time: 'Session 1', activity: 'sabaq', duration: sabaqMinutes },
      { time: 'Session 2', activity: 'sabqi', duration: sabqiMinutes },
      { time: 'Session 3', activity: 'manzil', duration: manzilMinutes },
    );
  }
  
  return schedule;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

/**
 * Create a new Sabaq session
 */
export function createSabaqSession(
  verses: VerseRef[],
  method: MemorizationMethod
): SabaqSession {
  const session: SabaqSession = {
    category: 'sabaq',
    method,
    verses,
    startTime: new Date(),
    currentVerseIndex: 0,
    versesCompleted: 0,
    totalTime: 0,
    perfectRecites: 0,
    mistakeCount: 0,
  };
  
  // Initialize method-specific state
  switch (method) {
    case '10-3':
      session.repetitionState = initRepetition10_3();
      break;
    case '20-20':
      session.repetitionState = initRepetition20_20();
      break;
    case 'stacking':
      session.stackingState = initStackingMethod(verses);
      break;
    // Page method would need page-specific data
  }
  
  return session;
}

/**
 * Complete current verse and move to next in Sabaq session
 */
export function advanceSabaqSession(session: SabaqSession): SabaqSession {
  const nextIndex = session.currentVerseIndex + 1;
  const completed = nextIndex >= session.verses.length;
  
  const newSession: SabaqSession = {
    ...session,
    currentVerseIndex: completed ? session.currentVerseIndex : nextIndex,
    versesCompleted: session.versesCompleted + 1,
  };
  
  // Reset method state for new verse
  if (!completed) {
    switch (session.method) {
      case '10-3':
        newSession.repetitionState = initRepetition10_3();
        break;
      case '20-20':
        newSession.repetitionState = initRepetition20_20();
        break;
    }
  }
  
  return newSession;
}

/**
 * Get overall session progress
 */
export function getSessionProgress(session: MemorizationSession): number {
  switch (session.category) {
    case 'sabaq':
      return Math.round((session.versesCompleted / session.verses.length) * 100);
    case 'sabqi':
      return getSabqiProgress(session);
    case 'manzil':
      return getManzilProgress(session);
  }
}

/**
 * End a session and calculate summary
 */
export function endSession(session: MemorizationSession): MemorizationSession & { endTime: Date } {
  return {
    ...session,
    endTime: new Date(),
  };
}

// ============================================================================
// INTEGRATION HOOKS
// ============================================================================

/**
 * Hook data for integrating with lesson system
 */
export interface MemorizationHookData {
  category: HifzCategory;
  method: MemorizationMethod;
  currentVerse: VerseRef | null;
  progress: number;
  
  // Actions
  onLookingRead: () => void;
  onMemoryRecite: (successful: boolean) => void;
  onChainRecite: (successful: boolean) => void;
  onConsolidate: (successful: boolean) => void;
  onAdvance: () => void;
  onComplete: () => void;
}

/**
 * Create hook data for a Sabaq session
 */
export function createMemorizationHook(
  session: SabaqSession,
  updateSession: (session: SabaqSession) => void,
  onSessionComplete: (session: SabaqSession) => void
): MemorizationHookData {
  const currentVerse = session.verses[session.currentVerseIndex] || null;
  
  return {
    category: session.category,
    method: session.method,
    currentVerse,
    progress: getSessionProgress(session),
    
    onLookingRead: () => {
      if (session.repetitionState) {
        updateSession({
          ...session,
          repetitionState: recordLookingRead(session.repetitionState),
        });
      }
    },
    
    onMemoryRecite: (successful: boolean) => {
      if (session.repetitionState) {
        const newState = recordMemoryRecite(session.repetitionState, successful);
        let newSession = {
          ...session,
          repetitionState: newState,
          perfectRecites: successful ? session.perfectRecites + 1 : session.perfectRecites,
          mistakeCount: successful ? session.mistakeCount : session.mistakeCount + 1,
        };
        
        if (newState.completed) {
          newSession = advanceSabaqSession(newSession) as typeof newSession;
        }
        
        updateSession(newSession);
        
        if (newSession.versesCompleted >= newSession.verses.length) {
          onSessionComplete(newSession);
        }
      }
    },
    
    onChainRecite: (successful: boolean) => {
      if (session.stackingState) {
        const newState = recordChainRecitation(session.stackingState, successful);
        updateSession({
          ...session,
          stackingState: newState,
        });
      }
    },
    
    onConsolidate: (successful: boolean) => {
      if (session.stackingState) {
        const newState = recordConsolidationRound(session.stackingState, successful);
        updateSession({
          ...session,
          stackingState: newState,
        });
        
        if (newState.completed) {
          onSessionComplete({
            ...session,
            stackingState: newState,
          });
        }
      }
    },
    
    onAdvance: () => {
      if (session.stackingState) {
        const newState = completeStackingVerse(session.stackingState);
        updateSession({
          ...session,
          stackingState: newState,
        });
      } else {
        updateSession(advanceSabaqSession(session));
      }
    },
    
    onComplete: () => {
      onSessionComplete(session);
    },
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Calculate estimated time for a set of verses
 */
export function estimateTime(
  category: HifzCategory,
  verseCount: number
): number {
  const secondsPerVerse = {
    sabaq: HIFZ_DEFAULTS.SECONDS_PER_VERSE_NEW,
    sabqi: HIFZ_DEFAULTS.SECONDS_PER_VERSE_SABQI,
    manzil: HIFZ_DEFAULTS.SECONDS_PER_VERSE_MANZIL,
  }[category];
  
  return Math.round(verseCount * secondsPerVerse / 60); // minutes
}

/**
 * Get human-readable method description
 */
export function getMethodDescription(method: MemorizationMethod): string {
  switch (method) {
    case '10-3':
      return 'Read 10 times looking, recite 3 times from memory';
    case '20-20':
      return 'Intensive: Read 20 times, recite 20 times (for difficult verses)';
    case 'stacking':
      return 'Chain verses together: 1, then 1+2, then 1+2+3...';
    case 'page':
      return 'Memorize page in portions, then connect together';
  }
}

/**
 * Get Arabic name for category
 */
export function getCategoryArabicName(category: HifzCategory): string {
  switch (category) {
    case 'sabaq': return 'سبق';
    case 'sabqi': return 'سبقی';
    case 'manzil': return 'منزل';
  }
}

/**
 * Get category description
 */
export function getCategoryDescription(category: HifzCategory): string {
  switch (category) {
    case 'sabaq': return 'New lesson - fresh verses to memorize';
    case 'sabqi': return 'Recent review - verses from the last 7-30 days';
    case 'manzil': return 'Old revision - maintaining what you\'ve memorized';
  }
}

/**
 * Recommend method based on verse count and difficulty
 */
export function recommendMethod(
  verseCount: number,
  averageVerseLength: 'short' | 'medium' | 'long',
  userLevel: DifficultyLevel
): MemorizationMethod {
  // Long verses or many verses = more intensive method
  if (averageVerseLength === 'long' || verseCount > 15) {
    return '20-20';
  }
  
  // Advanced users may prefer stacking for efficiency
  if (userLevel === 'advanced' || userLevel === 'hafiz') {
    return 'stacking';
  }
  
  // Beginners/intermediate use simple 10-3
  return '10-3';
}

/**
 * Create a default HifzProfile for a given level
 */
export function createDefaultProfile(level: DifficultyLevel): HifzProfile {
  const targets = HIFZ_DEFAULTS.DAILY_TARGETS[level];
  
  return {
    level,
    preferredMethod: level === 'beginner' ? '10-3' : 'stacking',
    dailyGoalMinutes: level === 'beginner' ? 30 : level === 'intermediate' ? 60 : 120,
    dailyNewVerses: targets.newVerses,
    sabaqPagesPerDay: level === 'beginner' ? 0.5 : level === 'intermediate' ? 1 : 2,
    sabqiDaysRange: [HIFZ_DEFAULTS.SABQI_MIN_DAYS, HIFZ_DEFAULTS.SABQI_MAX_DAYS],
    manzilJuzPerDay: targets.manzilJuz,
    preferMorningMemorization: true,
    enableTajweedReminders: true,
    stackingChainSize: HIFZ_DEFAULTS.MAX_STACK_SIZE,
    pagePortionCount: HIFZ_DEFAULTS.PORTIONS_PER_PAGE,
  };
}

/**
 * Format time in a human-readable way
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Check if user has completed their daily goals
 */
export function checkDailyCompletion(
  profile: HifzProfile,
  todayStats: {
    newVersesMemorized: number;
    sabqiVersesReviewed: number;
    manzilJuzReviewed: number;
    totalMinutes: number;
  }
): {
  sabaqComplete: boolean;
  sabqiComplete: boolean;
  manzilComplete: boolean;
  overallProgress: number;
} {
  const targets = HIFZ_DEFAULTS.DAILY_TARGETS[profile.level];
  
  const sabaqProgress = Math.min(todayStats.newVersesMemorized / targets.newVerses, 1);
  const sabqiProgress = Math.min(todayStats.sabqiVersesReviewed / targets.sabqiVerses, 1);
  const manzilProgress = Math.min(todayStats.manzilJuzReviewed / targets.manzilJuz, 1);
  
  return {
    sabaqComplete: sabaqProgress >= 1,
    sabqiComplete: sabqiProgress >= 1,
    manzilComplete: manzilProgress >= 1,
    overallProgress: Math.round((sabaqProgress + sabqiProgress + manzilProgress) / 3 * 100),
  };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Constants
  HIFZ_DEFAULTS,
  TRADITIONAL_SCHEDULE,
  MANZIL_DIVISIONS,
  
  // Repetition methods
  initRepetition10_3,
  initRepetition20_20,
  recordLookingRead,
  recordMemoryRecite,
  canAttemptMemoryRecite,
  getRepetitionProgress,
  
  // Stacking method
  initStackingMethod,
  completeStackingVerse,
  recordChainRecitation,
  recordConsolidationRound,
  getCurrentChain,
  isInConsolidationPhase,
  getStackingProgress,
  
  // Page method
  initPageMethod,
  completePagePortion,
  recordPortionRepetition,
  recordPageConnection,
  getMemorizedPortions,
  getPageProgress,
  
  // Sabqi system
  getSabqiVerses,
  initSabqiSession,
  recordSabqiReview,
  getSabqiProgress,
  prioritizeSabqiVerses,
  
  // Manzil system
  getTodaysManzil,
  initManzilSession,
  recordManzilProgress,
  getManzilProgress,
  getManzilVerses,
  
  // Planning
  generateDailyPlan,
  
  // Session management
  createSabaqSession,
  advanceSabaqSession,
  getSessionProgress,
  endSession,
  
  // Integration
  createMemorizationHook,
  
  // Utilities
  estimateTime,
  getMethodDescription,
  getCategoryArabicName,
  getCategoryDescription,
  recommendMethod,
  createDefaultProfile,
  formatDuration,
  checkDailyCompletion,
};
