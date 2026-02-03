/**
 * Quran Oasis - Practice Drills System
 * 
 * Drill generators, quiz question types, and scoring helpers
 * Designed to increase the practice:explanation ratio to 2:1
 */

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type DrillType = 
  | "vocabulary_flashcard"
  | "complete_ayah"
  | "tajweed_identify"
  | "root_recognition"
  | "word_meaning"
  | "timed_challenge"
  | "audio_recall"
  | "fill_blank"
  | "multiple_choice"
  | "matching"
  | "true_false"
  | "sequence_order";

export interface DrillQuestion {
  id: string;
  type: DrillType;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  questionArabic?: string;
  options?: string[];
  correctAnswer: string | number | string[];
  explanation: string;
  hints?: string[];
  timeLimit?: number; // seconds
  xpValue: number;
}

export interface VocabularyFlashcard {
  arabic: string;
  transliteration: string;
  meaning: string;
  rootLetters?: string;
  exampleUsage?: string;
  audioRef?: string;
}

export interface CompleteAyahQuestion {
  surah: number;
  ayah: number;
  partialText: string;
  missingPortion: string;
  fullText: string;
  options: string[];
  correctIndex: number;
}

export interface TajweedIdentifyQuestion {
  ruleName: string;
  ruleNameArabic: string;
  exampleWord: string;
  exampleContext: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface TimedChallengeConfig {
  totalQuestions: number;
  timePerQuestion: number; // seconds
  passingScore: number; // percentage
  xpMultiplier: number;
}

export interface DrillResult {
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  timeSpent: number; // seconds
  xpEarned: number;
  weakAreas: string[];
  strongAreas: string[];
}

// ═══════════════════════════════════════════════════════════════════════════
// DRILL GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate vocabulary flashcard review drill
 */
export function generateVocabularyDrill(
  vocabulary: VocabularyFlashcard[],
  count: number = 5
): DrillQuestion[] {
  const shuffled = [...vocabulary].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, Math.min(count, vocabulary.length));
  
  return selected.map((word, index) => {
    // Create wrong options from other vocabulary
    const wrongOptions = vocabulary
      .filter(w => w.arabic !== word.arabic)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning);
    
    const options = [word.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
    const correctIndex = options.indexOf(word.meaning);
    
    return {
      id: `vocab-${index}`,
      type: "vocabulary_flashcard" as DrillType,
      difficulty: "medium" as const,
      question: `What does "${word.arabic}" (${word.transliteration}) mean?`,
      questionArabic: word.arabic,
      options,
      correctAnswer: correctIndex,
      explanation: word.exampleUsage || `${word.arabic} means "${word.meaning}"`,
      xpValue: 10
    };
  });
}

/**
 * Generate "complete the ayah" exercises
 */
export function generateCompleteAyahDrill(
  ayahData: CompleteAyahQuestion[]
): DrillQuestion[] {
  return ayahData.map((ayah, index) => ({
    id: `ayah-${ayah.surah}-${ayah.ayah}-${index}`,
    type: "complete_ayah" as DrillType,
    difficulty: "hard" as const,
    question: `Complete the ayah: ${ayah.partialText} ___`,
    questionArabic: ayah.partialText,
    options: ayah.options,
    correctAnswer: ayah.correctIndex,
    explanation: `The complete ayah is: ${ayah.fullText}`,
    hints: ["Think about the rhyme scheme", "Consider the context of the surah"],
    xpValue: 20
  }));
}

/**
 * Generate tajweed rule identification quiz
 */
export function generateTajweedDrill(
  questions: TajweedIdentifyQuestion[]
): DrillQuestion[] {
  return questions.map((q, index) => ({
    id: `tajweed-${index}`,
    type: "tajweed_identify" as DrillType,
    difficulty: "medium" as const,
    question: q.question,
    questionArabic: q.exampleWord,
    options: q.options,
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    xpValue: 15
  }));
}

/**
 * Generate root recognition drill
 */
export function generateRootDrill(
  rootData: Array<{
    root: string;
    meaning: string;
    derivatives: string[];
  }>
): DrillQuestion[] {
  return rootData.map((root, index) => {
    const wordToTest = root.derivatives[Math.floor(Math.random() * root.derivatives.length)];
    const wrongRoots = rootData
      .filter(r => r.root !== root.root)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(r => `${r.root} (${r.meaning})`);
    
    const options = [`${root.root} (${root.meaning})`, ...wrongRoots].sort(() => Math.random() - 0.5);
    
    return {
      id: `root-${index}`,
      type: "root_recognition" as DrillType,
      difficulty: "hard" as const,
      question: `What root does the word "${wordToTest}" come from?`,
      questionArabic: wordToTest,
      options,
      correctAnswer: options.indexOf(`${root.root} (${root.meaning})`),
      explanation: `The word "${wordToTest}" comes from the root ${root.root}, meaning "${root.meaning}"`,
      xpValue: 15
    };
  });
}

/**
 * Generate a timed challenge drill set
 */
export function generateTimedChallenge(
  allQuestions: DrillQuestion[],
  config: TimedChallengeConfig
): { questions: DrillQuestion[]; config: TimedChallengeConfig } {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, config.totalQuestions).map(q => ({
    ...q,
    timeLimit: config.timePerQuestion,
    xpValue: Math.round(q.xpValue * config.xpMultiplier)
  }));
  
  return { questions: selected, config };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMMON DRILL DATA
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Tajweed rules data for quizzes
 */
export const TAJWEED_RULES_DATA = {
  noonSakinah: {
    izhar: {
      name: "Izhar",
      nameArabic: "إِظْهَار",
      letters: "ء ه ع ح غ خ",
      description: "Clear pronunciation - noon sakinah followed by throat letters",
      examples: ["مِنْ خَيْرٍ", "مَنْ آمَنَ", "عَلِيمٌ حَكِيمٌ"]
    },
    idgham: {
      name: "Idgham",
      nameArabic: "إِدْغَام",
      letters: "ي ر م ل و ن",
      description: "Merging - letters of يَرْمَلُون",
      examples: ["مَن يَقُولُ", "مِن لَّدُنَّا", "مِن وَلِيّ"]
    },
    iqlab: {
      name: "Iqlab",
      nameArabic: "إِقْلَاب",
      letters: "ب",
      description: "Conversion - noon becomes meem before ba",
      examples: ["مِنْ بَعْدِ", "أَنْبِئْهُمْ", "سَمِيعٌ بَصِيرٌ"]
    },
    ikhfa: {
      name: "Ikhfa",
      nameArabic: "إِخْفَاء",
      letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك",
      description: "Hiding - noon sound hidden with ghunnah",
      examples: ["مَن تَابَ", "مِنْ ذَهَبٍ", "أَنْزَلَ"]
    }
  },
  meemSakinah: {
    idghamShafawi: {
      name: "Idgham Shafawi",
      nameArabic: "إِدْغَام شَفَوِي",
      description: "Meem merges into meem with ghunnah",
      examples: ["لَهُم مَّا", "هُم مُّؤْمِنُونَ"]
    },
    ikhfaShafawi: {
      name: "Ikhfa Shafawi", 
      nameArabic: "إِخْفَاء شَفَوِي",
      description: "Meem hidden before ba with ghunnah",
      examples: ["تَرْمِيهِم بِحِجَارَةٍ", "هُمْ بِرَبِّهِمْ"]
    },
    izharShafawi: {
      name: "Izhar Shafawi",
      nameArabic: "إِظْهَار شَفَوِي",
      description: "Clear meem before all other letters",
      examples: ["عَلَيْهِمْ غَيْرِ", "أَنعَمْتَ"]
    }
  },
  madd: {
    tabeei: {
      name: "Madd Tabee'i",
      nameArabic: "مَدّ طَبِيعِي",
      duration: "2 counts",
      description: "Natural elongation",
      examples: ["قَالَ", "يَقُولُ", "فِيهَا"]
    },
    muttasil: {
      name: "Madd Muttasil",
      nameArabic: "مَدّ مُتَّصِل",
      duration: "4-5 counts",
      description: "Connected - hamza in same word",
      examples: ["جَآءَ", "سُوءٌ", "سِيئَتْ"]
    },
    munfasil: {
      name: "Madd Munfasil",
      nameArabic: "مَدّ مُنْفَصِل",
      duration: "2-5 counts",
      description: "Separated - hamza in next word",
      examples: ["يَا أَيُّهَا", "فِي أَنفُسِكُمْ"]
    },
    lazim: {
      name: "Madd Lazim",
      nameArabic: "مَدّ لَازِم",
      duration: "6 counts",
      description: "Compulsory - sukoon/shaddah after madd",
      examples: ["الضَّالِّينَ", "الم"]
    }
  },
  qalqalah: {
    letters: "ق ط ب ج د",
    mnemonic: "قُطْبُ جَدّ",
    sughra: {
      name: "Qalqalah Sughra",
      nameArabic: "قَلْقَلَة صُغْرَى",
      description: "Small - in middle of word",
      examples: ["يَجْعَلُونَ", "يَقْتُلُونَ"]
    },
    kubra: {
      name: "Qalqalah Kubra",
      nameArabic: "قَلْقَلَة كُبْرَى",
      description: "Large - at end when stopping",
      examples: ["أَحَدْ", "الْفَلَقْ", "لَهَبْ"]
    }
  }
};

/**
 * Common Quranic vocabulary for drills
 */
export const COMMON_VOCABULARY: VocabularyFlashcard[] = [
  { arabic: "الله", transliteration: "Allah", meaning: "God", rootLetters: "أله" },
  { arabic: "الرَّحْمَٰنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious", rootLetters: "رحم" },
  { arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful", rootLetters: "رحم" },
  { arabic: "الرَّبُّ", transliteration: "Ar-Rabb", meaning: "The Lord, Sustainer", rootLetters: "ربب" },
  { arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King", rootLetters: "ملك" },
  { arabic: "آمَنَ", transliteration: "Aamana", meaning: "He believed", rootLetters: "أمن" },
  { arabic: "عَلِمَ", transliteration: "'Alima", meaning: "He knew", rootLetters: "علم" },
  { arabic: "عَمِلَ", transliteration: "'Amila", meaning: "He did/worked", rootLetters: "عمل" },
  { arabic: "هَدَى", transliteration: "Hadaa", meaning: "He guided", rootLetters: "هدي" },
  { arabic: "قَالَ", transliteration: "Qaala", meaning: "He said", rootLetters: "قول" },
  { arabic: "إِنَّ", transliteration: "Inna", meaning: "Indeed, verily", exampleUsage: "Used to emphasize statements" },
  { arabic: "لَا", transliteration: "Laa", meaning: "No, not", exampleUsage: "Negation particle" },
  { arabic: "الَّذِي", transliteration: "Alladhee", meaning: "Who, which", exampleUsage: "Relative pronoun" },
  { arabic: "ذِكْر", transliteration: "Dhikr", meaning: "Remembrance", rootLetters: "ذكر" },
  { arabic: "صَالِح", transliteration: "Saalih", meaning: "Righteous", rootLetters: "صلح" },
  { arabic: "تَوْبَة", transliteration: "Tawba", meaning: "Repentance", rootLetters: "توب" },
  { arabic: "صَبْر", transliteration: "Sabr", meaning: "Patience", rootLetters: "صبر" },
  { arabic: "شُكْر", transliteration: "Shukr", meaning: "Gratitude", rootLetters: "شكر" },
  { arabic: "إِيمَان", transliteration: "Eemaan", meaning: "Faith", rootLetters: "أمن" },
  { arabic: "إِسْلَام", transliteration: "Islaam", meaning: "Submission", rootLetters: "سلم" }
];

/**
 * Arabic root data for root recognition drills
 */
export const ARABIC_ROOTS = [
  {
    root: "ر-ح-م",
    meaning: "mercy",
    derivatives: ["رَحْمَة", "رَحِيم", "رَحْمَٰن", "أَرْحَام", "رَحِمَ"]
  },
  {
    root: "ع-ل-م",
    meaning: "knowledge",
    derivatives: ["عِلْم", "عَالِم", "عَلِيم", "عَالَم", "تَعَلَّمَ", "عَلَّمَ"]
  },
  {
    root: "أ-م-ن",
    meaning: "safety/faith",
    derivatives: ["أَمَان", "إِيمَان", "مُؤْمِن", "أَمِين", "آمَنَ"]
  },
  {
    root: "س-ل-م",
    meaning: "peace/submission",
    derivatives: ["سَلَام", "إِسْلَام", "مُسْلِم", "سَلِيم", "سَلَّمَ"]
  },
  {
    root: "ح-م-د",
    meaning: "praise",
    derivatives: ["حَمْد", "مُحَمَّد", "أَحْمَد", "حَمِيد", "مَحْمُود"]
  },
  {
    root: "ع-ب-د",
    meaning: "worship/servitude",
    derivatives: ["عَبَدَ", "عِبَادَة", "عَبْد", "عِبَاد", "مَعْبُود"]
  },
  {
    root: "ق-و-ل",
    meaning: "speech",
    derivatives: ["قَالَ", "قَوْل", "يَقُولُ", "قُلْ", "أَقْوَال"]
  },
  {
    root: "ك-ت-ب",
    meaning: "writing",
    derivatives: ["كِتَاب", "كَاتِب", "مَكْتُوب", "مَكْتَبَة", "كَتَبَ"]
  },
  {
    root: "ذ-ك-ر",
    meaning: "remembrance",
    derivatives: ["ذِكْر", "ذَكَرَ", "تَذْكِرَة", "مُذَكِّر", "يَذْكُرُونَ"]
  },
  {
    root: "ص-ل-ح",
    meaning: "righteousness",
    derivatives: ["صَالِح", "صَالِحَات", "صُلْح", "إِصْلَاح", "أَصْلَحَ"]
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// SCORING HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Calculate drill results and XP
 */
export function calculateDrillResults(
  answers: Array<{ questionId: string; correct: boolean; timeSpent: number }>,
  questions: DrillQuestion[]
): DrillResult {
  const questionsAttempted = answers.length;
  const questionsCorrect = answers.filter(a => a.correct).length;
  const accuracy = questionsAttempted > 0 
    ? Math.round((questionsCorrect / questionsAttempted) * 100) 
    : 0;
  const totalTime = answers.reduce((sum, a) => sum + a.timeSpent, 0);
  
  // Calculate XP with bonuses
  let xpEarned = 0;
  answers.forEach((answer, index) => {
    if (answer.correct) {
      const question = questions.find(q => q.id === answer.questionId);
      if (question) {
        xpEarned += question.xpValue;
        
        // Speed bonus: under half the time limit
        if (question.timeLimit && answer.timeSpent < question.timeLimit / 2) {
          xpEarned += Math.round(question.xpValue * 0.25);
        }
      }
    }
  });
  
  // Perfect score bonus
  if (accuracy === 100 && questionsAttempted >= 5) {
    xpEarned = Math.round(xpEarned * 1.5);
  }
  
  // Analyze weak/strong areas
  const topicPerformance: Record<string, { correct: number; total: number }> = {};
  answers.forEach((answer, index) => {
    const question = questions.find(q => q.id === answer.questionId);
    if (question) {
      if (!topicPerformance[question.type]) {
        topicPerformance[question.type] = { correct: 0, total: 0 };
      }
      topicPerformance[question.type].total++;
      if (answer.correct) {
        topicPerformance[question.type].correct++;
      }
    }
  });
  
  const weakAreas: string[] = [];
  const strongAreas: string[] = [];
  
  Object.entries(topicPerformance).forEach(([topic, perf]) => {
    const topicAccuracy = perf.correct / perf.total;
    if (topicAccuracy < 0.6) {
      weakAreas.push(topic);
    } else if (topicAccuracy >= 0.8) {
      strongAreas.push(topic);
    }
  });
  
  return {
    questionsAttempted,
    questionsCorrect,
    accuracy,
    timeSpent: totalTime,
    xpEarned,
    weakAreas,
    strongAreas
  };
}

/**
 * Get encouraging message based on performance
 */
export function getPerformanceMessage(accuracy: number): string {
  if (accuracy === 100) {
    return "🌟 Perfect! MashaAllah, excellent work!";
  } else if (accuracy >= 90) {
    return "🎉 Outstanding! You're mastering this material!";
  } else if (accuracy >= 80) {
    return "👏 Great job! Keep up the good work!";
  } else if (accuracy >= 70) {
    return "💪 Good effort! A little more practice will help!";
  } else if (accuracy >= 60) {
    return "📚 You're learning! Review the material and try again!";
  } else {
    return "🤲 Don't give up! The Prophet ﷺ said struggling with Quran brings double reward!";
  }
}

/**
 * Generate adaptive difficulty based on performance
 */
export function getAdaptiveDifficulty(
  recentResults: DrillResult[]
): "easy" | "medium" | "hard" {
  if (recentResults.length === 0) return "medium";
  
  const avgAccuracy = recentResults.reduce((sum, r) => sum + r.accuracy, 0) / recentResults.length;
  
  if (avgAccuracy >= 85) return "hard";
  if (avgAccuracy >= 60) return "medium";
  return "easy";
}

// ═══════════════════════════════════════════════════════════════════════════
// PRE-BUILT DRILL SETS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a complete drill set for a vocabulary lesson
 */
export function createVocabularyLessonDrills(
  vocabulary: VocabularyFlashcard[]
): DrillQuestion[] {
  const drills: DrillQuestion[] = [];
  
  // Meaning identification
  drills.push(...generateVocabularyDrill(vocabulary, 5));
  
  // Reverse: Arabic from meaning
  vocabulary.slice(0, 3).forEach((word, i) => {
    const wrongOptions = vocabulary
      .filter(w => w.arabic !== word.arabic)
      .slice(0, 3)
      .map(w => w.arabic);
    const options = [word.arabic, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    drills.push({
      id: `reverse-vocab-${i}`,
      type: "word_meaning",
      difficulty: "medium",
      question: `Which Arabic word means "${word.meaning}"?`,
      options,
      correctAnswer: options.indexOf(word.arabic),
      explanation: `${word.arabic} (${word.transliteration}) means "${word.meaning}"`,
      xpValue: 10
    });
  });
  
  return drills;
}

/**
 * Generate tajweed drill set for a tajweed lesson
 */
export function createTajweedLessonDrills(
  ruleCategory: keyof typeof TAJWEED_RULES_DATA
): DrillQuestion[] {
  const drills: DrillQuestion[] = [];
  const rules = TAJWEED_RULES_DATA[ruleCategory];
  
  if (!rules) return drills;
  
  Object.entries(rules).forEach(([ruleKey, rule], index) => {
    if (typeof rule === 'object' && 'name' in rule) {
      // Rule identification
      drills.push({
        id: `tajweed-id-${ruleCategory}-${index}`,
        type: "tajweed_identify",
        difficulty: "medium",
        question: `What tajweed rule applies in "${(rule as any).examples?.[0] || ''}"?`,
        questionArabic: (rule as any).examples?.[0],
        options: Object.values(rules)
          .filter(r => typeof r === 'object' && 'name' in r)
          .map(r => (r as any).name)
          .slice(0, 4),
        correctAnswer: Object.values(rules)
          .filter(r => typeof r === 'object' && 'name' in r)
          .map(r => (r as any).name)
          .indexOf((rule as any).name),
        explanation: (rule as any).description || '',
        xpValue: 15
      });
    }
  });
  
  return drills;
}

/**
 * Create timed challenge configuration
 */
export function createTimedChallengeConfig(
  lessonDifficulty: "beginner" | "intermediate" | "advanced"
): TimedChallengeConfig {
  const configs = {
    beginner: { totalQuestions: 5, timePerQuestion: 30, passingScore: 60, xpMultiplier: 1 },
    intermediate: { totalQuestions: 7, timePerQuestion: 25, passingScore: 70, xpMultiplier: 1.25 },
    advanced: { totalQuestions: 10, timePerQuestion: 20, passingScore: 80, xpMultiplier: 1.5 }
  };
  return configs[lessonDifficulty];
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPLETE AYAH DATA FOR DRILLS
// ═══════════════════════════════════════════════════════════════════════════

export const COMPLETE_AYAH_DATA: CompleteAyahQuestion[] = [
  // Al-Fatiha
  {
    surah: 1, ayah: 2,
    partialText: "الْحَمْدُ لِلَّهِ",
    missingPortion: "رَبِّ الْعَالَمِينَ",
    fullText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    options: ["رَبِّ الْعَالَمِينَ", "الرَّحْمَٰنِ الرَّحِيمِ", "مَالِكِ يَوْمِ الدِّينِ", "إِيَّاكَ نَعْبُدُ"],
    correctIndex: 0
  },
  {
    surah: 1, ayah: 5,
    partialText: "إِيَّاكَ نَعْبُدُ",
    missingPortion: "وَإِيَّاكَ نَسْتَعِينُ",
    fullText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    options: ["وَإِيَّاكَ نَسْتَعِينُ", "اهْدِنَا الصِّرَاطَ", "رَبِّ الْعَالَمِينَ", "الرَّحِيمِ"],
    correctIndex: 0
  },
  // Al-Ikhlas
  {
    surah: 112, ayah: 1,
    partialText: "قُلْ هُوَ",
    missingPortion: "اللَّهُ أَحَدٌ",
    fullText: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    options: ["اللَّهُ أَحَدٌ", "الصَّمَدُ", "لَمْ يَلِدْ", "كُفُوًا أَحَدٌ"],
    correctIndex: 0
  },
  {
    surah: 112, ayah: 3,
    partialText: "لَمْ يَلِدْ",
    missingPortion: "وَلَمْ يُولَدْ",
    fullText: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
    options: ["وَلَمْ يُولَدْ", "اللَّهُ الصَّمَدُ", "كُفُوًا أَحَدٌ", "قُلْ هُوَ"],
    correctIndex: 0
  },
  // Al-Mulk
  {
    surah: 67, ayah: 1,
    partialText: "تَبَارَكَ الَّذِي بِيَدِهِ",
    missingPortion: "الْمُلْكُ",
    fullText: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
    options: ["الْمُلْكُ", "الْحَمْدُ", "السَّمَاءُ", "الْكِتَابُ"],
    correctIndex: 0
  },
  {
    surah: 67, ayah: 2,
    partialText: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ",
    missingPortion: "لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
    fullText: "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
    options: ["لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا", "لِيَهْدِيَكُمْ إِلَى الصِّرَاطِ", "لِيَعْلَمَ مَا فِي قُلُوبِكُمْ", "لِيُعَذِّبَكُمْ"],
    correctIndex: 0
  },
  // Al-Baqarah (key verses)
  {
    surah: 2, ayah: 255,
    partialText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ",
    missingPortion: "الْحَيُّ الْقَيُّومُ",
    fullText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    options: ["الْحَيُّ الْقَيُّومُ", "الْعَزِيزُ الْحَكِيمُ", "الرَّحْمَٰنُ الرَّحِيمُ", "الْغَفُورُ الرَّحِيمُ"],
    correctIndex: 0
  },
  {
    surah: 2, ayah: 286,
    partialText: "رَبَّنَا لَا تُؤَاخِذْنَا",
    missingPortion: "إِن نَّسِينَا أَوْ أَخْطَأْنَا",
    fullText: "رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا",
    options: ["إِن نَّسِينَا أَوْ أَخْطَأْنَا", "بِمَا كَسَبَتْ أَيْدِينَا", "إِنَّكَ أَنتَ التَّوَّابُ", "وَاغْفِرْ لَنَا"],
    correctIndex: 0
  }
];

export default {
  generateVocabularyDrill,
  generateCompleteAyahDrill,
  generateTajweedDrill,
  generateRootDrill,
  generateTimedChallenge,
  calculateDrillResults,
  getPerformanceMessage,
  getAdaptiveDifficulty,
  createVocabularyLessonDrills,
  createTajweedLessonDrills,
  createTimedChallengeConfig,
  TAJWEED_RULES_DATA,
  COMMON_VOCABULARY,
  ARABIC_ROOTS,
  COMPLETE_AYAH_DATA
};
