/**
 * HIFZ Flashcard System
 * 
 * Spaced repetition flashcards for Arabic vocabulary and Quranic phrases
 * Uses SM-2 algorithm principles for optimal learning
 */

export interface Flashcard {
  id: string;
  arabic: string;
  transliteration: string;
  english: string;
  audioUrl?: string;
  category: 'letter' | 'word' | 'phrase' | 'verse' | 'rule';
  lessonId?: string;  // Links to specific lesson
  difficulty: 1 | 2 | 3 | 4 | 5;  // 1 = easiest
  tags: string[];
  examples?: {
    arabic: string;
    english: string;
  }[];
}

export interface FlashcardProgress {
  cardId: string;
  easeFactor: number;  // SM-2 ease factor (default 2.5)
  interval: number;    // Days until next review
  repetitions: number; // Successful reviews in a row
  nextReview: number;  // Timestamp
  lastReview: number;  // Timestamp
  totalReviews: number;
  correctCount: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  description: string;
  icon: string;
  cards: Flashcard[];
  lessonIds?: string[];  // Associated lessons
}

// ============================================
// Arabic Alphabet Flashcards
// ============================================
const ARABIC_LETTERS: Flashcard[] = [
  { id: 'letter-alif', arabic: 'ا', transliteration: 'alif', english: 'A / silent', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-ba', arabic: 'ب', transliteration: 'bā', english: 'B', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-ta', arabic: 'ت', transliteration: 'tā', english: 'T', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-tha', arabic: 'ث', transliteration: 'thā', english: 'Th (as in "think")', category: 'letter', difficulty: 2, tags: ['alphabet', 'beginner'] },
  { id: 'letter-jim', arabic: 'ج', transliteration: 'jīm', english: 'J', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-ha', arabic: 'ح', transliteration: 'ḥā', english: 'H (emphatic, from throat)', category: 'letter', difficulty: 3, tags: ['alphabet', 'beginner'] },
  { id: 'letter-kha', arabic: 'خ', transliteration: 'khā', english: 'Kh (as in "Bach")', category: 'letter', difficulty: 3, tags: ['alphabet', 'beginner'] },
  { id: 'letter-dal', arabic: 'د', transliteration: 'dāl', english: 'D', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-dhal', arabic: 'ذ', transliteration: 'dhāl', english: 'Dh (as in "this")', category: 'letter', difficulty: 2, tags: ['alphabet', 'beginner'] },
  { id: 'letter-ra', arabic: 'ر', transliteration: 'rā', english: 'R (rolled)', category: 'letter', difficulty: 2, tags: ['alphabet', 'beginner'] },
  { id: 'letter-zay', arabic: 'ز', transliteration: 'zāy', english: 'Z', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-sin', arabic: 'س', transliteration: 'sīn', english: 'S', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-shin', arabic: 'ش', transliteration: 'shīn', english: 'Sh', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-sad', arabic: 'ص', transliteration: 'ṣād', english: 'S (emphatic)', category: 'letter', difficulty: 3, tags: ['alphabet', 'intermediate'] },
  { id: 'letter-dad', arabic: 'ض', transliteration: 'ḍād', english: 'D (emphatic)', category: 'letter', difficulty: 4, tags: ['alphabet', 'intermediate'] },
  { id: 'letter-tah', arabic: 'ط', transliteration: 'ṭā', english: 'T (emphatic)', category: 'letter', difficulty: 3, tags: ['alphabet', 'intermediate'] },
  { id: 'letter-dhah', arabic: 'ظ', transliteration: 'ẓā', english: 'Dh (emphatic)', category: 'letter', difficulty: 4, tags: ['alphabet', 'intermediate'] },
  { id: 'letter-ayn', arabic: 'ع', transliteration: "'ayn", english: "' (voiced throat sound)", category: 'letter', difficulty: 5, tags: ['alphabet', 'intermediate'] },
  { id: 'letter-ghayn', arabic: 'غ', transliteration: 'ghayn', english: 'Gh (French R-like)', category: 'letter', difficulty: 4, tags: ['alphabet', 'intermediate'] },
  { id: 'letter-fa', arabic: 'ف', transliteration: 'fā', english: 'F', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-qaf', arabic: 'ق', transliteration: 'qāf', english: 'Q (deep K)', category: 'letter', difficulty: 4, tags: ['alphabet', 'intermediate'] },
  { id: 'letter-kaf', arabic: 'ك', transliteration: 'kāf', english: 'K', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-lam', arabic: 'ل', transliteration: 'lām', english: 'L', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-mim', arabic: 'م', transliteration: 'mīm', english: 'M', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-nun', arabic: 'ن', transliteration: 'nūn', english: 'N', category: 'letter', difficulty: 1, tags: ['alphabet', 'beginner'] },
  { id: 'letter-ha2', arabic: 'ه', transliteration: 'hā', english: 'H (light)', category: 'letter', difficulty: 2, tags: ['alphabet', 'beginner'] },
  { id: 'letter-waw', arabic: 'و', transliteration: 'wāw', english: 'W / Ū / Ō', category: 'letter', difficulty: 2, tags: ['alphabet', 'beginner'] },
  { id: 'letter-ya', arabic: 'ي', transliteration: 'yā', english: 'Y / Ī / Ē', category: 'letter', difficulty: 2, tags: ['alphabet', 'beginner'] },
];

// ============================================
// Common Quranic Vocabulary
// ============================================
const QURANIC_WORDS: Flashcard[] = [
  // Names of Allah
  { id: 'word-allah', arabic: 'الله', transliteration: 'Allāh', english: 'Allah (God)', category: 'word', difficulty: 1, tags: ['names-of-allah', 'essential'] },
  { id: 'word-rahman', arabic: 'الرَّحْمَٰن', transliteration: 'ar-Raḥmān', english: 'The Most Gracious', category: 'word', difficulty: 2, tags: ['names-of-allah', 'al-fatiha'] },
  { id: 'word-raheem', arabic: 'الرَّحِيم', transliteration: 'ar-Raḥīm', english: 'The Most Merciful', category: 'word', difficulty: 2, tags: ['names-of-allah', 'al-fatiha'] },
  { id: 'word-malik', arabic: 'مَالِك', transliteration: 'Mālik', english: 'Master / Owner', category: 'word', difficulty: 2, tags: ['names-of-allah', 'al-fatiha'] },
  { id: 'word-rabb', arabic: 'رَبّ', transliteration: 'Rabb', english: 'Lord / Sustainer', category: 'word', difficulty: 1, tags: ['names-of-allah', 'essential'] },
  
  // Essential Quranic Words
  { id: 'word-bismillah', arabic: 'بِسْمِ', transliteration: 'bismi', english: 'In the name of', category: 'word', difficulty: 1, tags: ['essential', 'bismillah'] },
  { id: 'word-alhamdulillah', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'al-ḥamdu lillāh', english: 'All praise is for Allah', category: 'phrase', difficulty: 1, tags: ['essential', 'al-fatiha'] },
  { id: 'word-alameen', arabic: 'الْعَالَمِينَ', transliteration: "al-'ālamīn", english: 'The worlds / All creation', category: 'word', difficulty: 2, tags: ['al-fatiha'] },
  { id: 'word-yawm', arabic: 'يَوْم', transliteration: 'yawm', english: 'Day', category: 'word', difficulty: 1, tags: ['common', 'al-fatiha'] },
  { id: 'word-deen', arabic: 'الدِّين', transliteration: 'ad-dīn', english: 'The Day of Judgment / Religion', category: 'word', difficulty: 2, tags: ['al-fatiha'] },
  { id: 'word-iyyaka', arabic: 'إِيَّاكَ', transliteration: 'iyyāka', english: 'You alone', category: 'word', difficulty: 2, tags: ['al-fatiha'] },
  { id: 'word-nabudu', arabic: 'نَعْبُدُ', transliteration: "na'budu", english: 'We worship', category: 'word', difficulty: 2, tags: ['al-fatiha'] },
  { id: 'word-nastaeen', arabic: 'نَسْتَعِينُ', transliteration: "nasta'īn", english: 'We seek help', category: 'word', difficulty: 2, tags: ['al-fatiha'] },
  { id: 'word-ihdina', arabic: 'اهْدِنَا', transliteration: 'ihdinā', english: 'Guide us', category: 'word', difficulty: 2, tags: ['al-fatiha'] },
  { id: 'word-sirat', arabic: 'الصِّرَاطَ', transliteration: 'aṣ-ṣirāṭ', english: 'The path', category: 'word', difficulty: 2, tags: ['al-fatiha'] },
  { id: 'word-mustaqeem', arabic: 'الْمُسْتَقِيمَ', transliteration: 'al-mustaqīm', english: 'The straight', category: 'word', difficulty: 2, tags: ['al-fatiha'] },
  
  // Juz Amma Vocabulary
  { id: 'word-qul', arabic: 'قُلْ', transliteration: 'qul', english: 'Say', category: 'word', difficulty: 1, tags: ['common', 'juz-amma'] },
  { id: 'word-huwa', arabic: 'هُوَ', transliteration: 'huwa', english: 'He', category: 'word', difficulty: 1, tags: ['common', 'al-ikhlas'] },
  { id: 'word-ahad', arabic: 'أَحَدٌ', transliteration: 'aḥad', english: 'One (unique)', category: 'word', difficulty: 1, tags: ['al-ikhlas'] },
  { id: 'word-samad', arabic: 'الصَّمَدُ', transliteration: 'aṣ-Ṣamad', english: 'The Eternal / Self-Sufficient', category: 'word', difficulty: 3, tags: ['al-ikhlas', 'names-of-allah'] },
  { id: 'word-lam', arabic: 'لَمْ', transliteration: 'lam', english: 'Did not / Has not', category: 'word', difficulty: 1, tags: ['common'] },
  { id: 'word-yalid', arabic: 'يَلِدْ', transliteration: 'yalid', english: 'Beget (have child)', category: 'word', difficulty: 2, tags: ['al-ikhlas'] },
  { id: 'word-yulad', arabic: 'يُولَدْ', transliteration: 'yūlad', english: 'Be begotten (born)', category: 'word', difficulty: 2, tags: ['al-ikhlas'] },
  { id: 'word-kufuwan', arabic: 'كُفُوًا', transliteration: 'kufuwan', english: 'Equal / Comparable', category: 'word', difficulty: 3, tags: ['al-ikhlas'] },
  
  // An-Nas vocabulary
  { id: 'word-audhu', arabic: 'أَعُوذُ', transliteration: "a'ūdhu", english: 'I seek refuge', category: 'word', difficulty: 2, tags: ['an-nas', 'al-falaq'] },
  { id: 'word-nas', arabic: 'النَّاسِ', transliteration: 'an-nās', english: 'Mankind / People', category: 'word', difficulty: 1, tags: ['an-nas'] },
  { id: 'word-sharr', arabic: 'شَرِّ', transliteration: 'sharr', english: 'Evil', category: 'word', difficulty: 2, tags: ['an-nas', 'al-falaq'] },
  { id: 'word-waswas', arabic: 'الْوَسْوَاسِ', transliteration: 'al-waswās', english: 'The whisperer', category: 'word', difficulty: 3, tags: ['an-nas'] },
  { id: 'word-khannas', arabic: 'الْخَنَّاسِ', transliteration: 'al-khannās', english: 'The retreater (when Allah is mentioned)', category: 'word', difficulty: 4, tags: ['an-nas'] },
  { id: 'word-sudur', arabic: 'صُدُورِ', transliteration: 'ṣudūr', english: 'Chests / Hearts', category: 'word', difficulty: 2, tags: ['an-nas'] },
  { id: 'word-jinna', arabic: 'الْجِنَّةِ', transliteration: 'al-jinna', english: 'The jinn', category: 'word', difficulty: 2, tags: ['an-nas'] },
  
  // Al-Falaq vocabulary
  { id: 'word-falaq', arabic: 'الْفَلَقِ', transliteration: 'al-falaq', english: 'The daybreak / Dawn', category: 'word', difficulty: 2, tags: ['al-falaq'] },
  { id: 'word-khalaq', arabic: 'خَلَقَ', transliteration: 'khalaqa', english: 'He created', category: 'word', difficulty: 1, tags: ['common', 'al-falaq'] },
  { id: 'word-ghasiq', arabic: 'غَاسِقٍ', transliteration: 'ghāsiq', english: 'Darkness', category: 'word', difficulty: 3, tags: ['al-falaq'] },
  { id: 'word-waqab', arabic: 'وَقَبَ', transliteration: 'waqab', english: 'When it settles', category: 'word', difficulty: 3, tags: ['al-falaq'] },
  { id: 'word-naffathat', arabic: 'النَّفَّاثَاتِ', transliteration: 'an-naffāthāt', english: 'Those who blow (on knots)', category: 'word', difficulty: 4, tags: ['al-falaq'] },
  { id: 'word-hasid', arabic: 'حَاسِدٍ', transliteration: 'ḥāsid', english: 'An envier', category: 'word', difficulty: 2, tags: ['al-falaq'] },
];

// ============================================
// Tajweed Rule Cards
// ============================================
const TAJWEED_RULES: Flashcard[] = [
  {
    id: 'rule-izhar',
    arabic: 'إِظْهَار',
    transliteration: 'Iẓhār',
    english: 'Clear pronunciation (no nasalization)',
    category: 'rule',
    difficulty: 2,
    tags: ['tajweed', 'noon-sakinah'],
    examples: [
      { arabic: 'مِنْ عِلْمٍ', english: "min 'ilmin - clear noon before 'ayn" },
      { arabic: 'مَنْ أَنْتَ', english: "man anta - clear noon before hamza" },
    ]
  },
  {
    id: 'rule-idgham',
    arabic: 'إِدْغَام',
    transliteration: 'Idghām',
    english: 'Merging (with ghunnah)',
    category: 'rule',
    difficulty: 3,
    tags: ['tajweed', 'noon-sakinah'],
    examples: [
      { arabic: 'مِن يَشَاءُ', english: 'miy-yashā\'u - noon merges into yā' },
      { arabic: 'مَن نَّعَمَ', english: 'man-na\'ama - noon merges with ghunnah' },
    ]
  },
  {
    id: 'rule-iqlab',
    arabic: 'إِقْلَاب',
    transliteration: 'Iqlāb',
    english: 'Conversion (noon becomes mīm)',
    category: 'rule',
    difficulty: 3,
    tags: ['tajweed', 'noon-sakinah'],
    examples: [
      { arabic: 'مِن بَعْدِ', english: "mim ba'di - noon converts to mīm before bā" },
    ]
  },
  {
    id: 'rule-ikhfa',
    arabic: 'إِخْفَاء',
    transliteration: 'Ikhfā\'',
    english: 'Hiding (subtle nasalization)',
    category: 'rule',
    difficulty: 3,
    tags: ['tajweed', 'noon-sakinah'],
    examples: [
      { arabic: 'مَن ذَا', english: 'man thā - hidden noon before dhāl' },
      { arabic: 'أَنْتَ', english: 'anta - hidden noon before tā' },
    ]
  },
  {
    id: 'rule-ghunnah',
    arabic: 'غُنَّة',
    transliteration: 'Ghunnah',
    english: 'Nasalization (2 counts)',
    category: 'rule',
    difficulty: 2,
    tags: ['tajweed', 'fundamental'],
    examples: [
      { arabic: 'إِنَّ', english: 'inna - ghunnah on doubled nūn' },
      { arabic: 'ثُمَّ', english: 'thumma - ghunnah on doubled mīm' },
    ]
  },
  {
    id: 'rule-madd',
    arabic: 'مَدّ',
    transliteration: 'Madd',
    english: 'Elongation (stretching vowels)',
    category: 'rule',
    difficulty: 2,
    tags: ['tajweed', 'fundamental'],
    examples: [
      { arabic: 'قَالَ', english: 'qāla - natural madd (2 counts)' },
      { arabic: 'الرَّحِيمِ', english: 'ar-raḥīm - madd with yā' },
    ]
  },
  {
    id: 'rule-qalqalah',
    arabic: 'قَلْقَلَة',
    transliteration: 'Qalqalah',
    english: 'Echoing bounce (letters ق ط ب ج د)',
    category: 'rule',
    difficulty: 3,
    tags: ['tajweed', 'fundamental'],
    examples: [
      { arabic: 'أَحَدْ', english: 'aḥad - bounce on final dāl' },
      { arabic: 'الْحَقّ', english: 'al-ḥaqq - bounce on qāf' },
    ]
  },
];

// ============================================
// Pre-built Decks
// ============================================
export const FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-alphabet',
    name: 'Arabic Alphabet',
    description: 'Learn all 28 Arabic letters',
    icon: '🔤',
    cards: ARABIC_LETTERS,
    lessonIds: ['arabic-alphabet-1', 'arabic-alphabet-2'],
  },
  {
    id: 'deck-al-fatiha',
    name: 'Al-Fatiha Vocabulary',
    description: 'Essential words from Surah Al-Fatiha',
    icon: '📖',
    cards: QURANIC_WORDS.filter(c => c.tags.includes('al-fatiha') || c.tags.includes('essential')),
    lessonIds: ['fatiha-1', 'fatiha-2', 'fatiha-3'],
  },
  {
    id: 'deck-juz-amma',
    name: 'Juz Amma Words',
    description: 'Common vocabulary from short surahs',
    icon: '⭐',
    cards: QURANIC_WORDS.filter(c => 
      c.tags.includes('juz-amma') || 
      c.tags.includes('al-ikhlas') || 
      c.tags.includes('an-nas') || 
      c.tags.includes('al-falaq')
    ),
    lessonIds: ['ikhlas', 'nas', 'falaq'],
  },
  {
    id: 'deck-tajweed',
    name: 'Tajweed Rules',
    description: 'Master the rules of Quranic recitation',
    icon: '🎯',
    cards: TAJWEED_RULES,
    lessonIds: ['noon-sakinah', 'meem-sakinah', 'madd-rules'],
  },
  {
    id: 'deck-all-words',
    name: 'All Quranic Words',
    description: 'Complete vocabulary collection',
    icon: '📚',
    cards: QURANIC_WORDS,
  },
];

// ============================================
// Spaced Repetition Logic (SM-2 based)
// ============================================

const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5;  // 0-2 = fail, 3-5 = pass
}

/**
 * Calculate next review interval using SM-2 algorithm
 */
export function calculateNextReview(
  progress: FlashcardProgress | null,
  result: ReviewResult
): FlashcardProgress {
  const now = Date.now();
  
  if (!progress) {
    // First review of this card
    progress = {
      cardId: '',
      easeFactor: DEFAULT_EASE,
      interval: 0,
      repetitions: 0,
      nextReview: now,
      lastReview: now,
      totalReviews: 0,
      correctCount: 0,
    };
  }
  
  const { quality } = result;
  let { easeFactor, interval, repetitions } = progress;
  
  // Update ease factor
  easeFactor = Math.max(
    MIN_EASE,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  
  if (quality < 3) {
    // Failed - reset
    repetitions = 0;
    interval = 1;  // Review again in 1 day
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }
  
  // Cap interval at 365 days
  interval = Math.min(interval, 365);
  
  return {
    ...progress,
    easeFactor,
    interval,
    repetitions,
    nextReview: now + interval * 24 * 60 * 60 * 1000,
    lastReview: now,
    totalReviews: progress.totalReviews + 1,
    correctCount: progress.correctCount + (quality >= 3 ? 1 : 0),
  };
}

// ============================================
// Progress Storage
// ============================================

const STORAGE_KEY = 'quranOasis_flashcardProgress';

export function getFlashcardProgress(): Record<string, FlashcardProgress> {
  if (typeof window === 'undefined') return {};
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

export function saveFlashcardProgress(cardId: string, progress: FlashcardProgress): void {
  if (typeof window === 'undefined') return;
  const all = getFlashcardProgress();
  all[cardId] = { ...progress, cardId };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function getDueCards(deckId?: string): Flashcard[] {
  const progress = getFlashcardProgress();
  const now = Date.now();
  
  let cards: Flashcard[] = [];
  if (deckId) {
    const deck = FLASHCARD_DECKS.find(d => d.id === deckId);
    cards = deck?.cards || [];
  } else {
    cards = FLASHCARD_DECKS.flatMap(d => d.cards);
  }
  
  return cards.filter(card => {
    const cardProgress = progress[card.id];
    if (!cardProgress) return true;  // Never reviewed = due
    return cardProgress.nextReview <= now;
  });
}

export function getNewCards(deckId: string, limit: number = 10): Flashcard[] {
  const progress = getFlashcardProgress();
  const deck = FLASHCARD_DECKS.find(d => d.id === deckId);
  if (!deck) return [];
  
  return deck.cards
    .filter(card => !progress[card.id])
    .slice(0, limit);
}

export function getDeckStats(deckId: string): {
  total: number;
  learned: number;
  due: number;
  mastered: number;
} {
  const deck = FLASHCARD_DECKS.find(d => d.id === deckId);
  if (!deck) return { total: 0, learned: 0, due: 0, mastered: 0 };
  
  const progress = getFlashcardProgress();
  const now = Date.now();
  
  let learned = 0;
  let due = 0;
  let mastered = 0;
  
  for (const card of deck.cards) {
    const p = progress[card.id];
    if (p) {
      learned++;
      if (p.nextReview <= now) due++;
      if (p.interval >= 21) mastered++;  // 21+ day interval = mastered
    }
  }
  
  return {
    total: deck.cards.length,
    learned,
    due,
    mastered,
  };
}

// Export all cards for searching
export const ALL_FLASHCARDS = [...ARABIC_LETTERS, ...QURANIC_WORDS, ...TAJWEED_RULES];
