/**
 * Tajweed Rules Library
 * 
 * Comprehensive rule definitions with colors, patterns, and helper functions
 * for identifying and visualizing tajweed rules in Quranic text.
 */

// ============================================
// Rule Color Definitions
// ============================================

export const TAJWEED_COLORS = {
  ghunnah: {
    name: 'Ghunnah',
    color: '#4ade80', // green-400
    bgColor: 'bg-green-400/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-400',
    description: 'Nasalization (2 counts)',
  },
  qalqalah: {
    name: 'Qalqalah',
    color: '#60a5fa', // blue-400
    bgColor: 'bg-blue-400/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-400',
    description: 'Echo/bounce effect',
  },
  madd: {
    name: 'Madd',
    color: '#f87171', // red-400
    bgColor: 'bg-red-400/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-400',
    description: 'Elongation (2-6 counts)',
  },
  idgham: {
    name: 'Idgham',
    color: '#c084fc', // purple-400
    bgColor: 'bg-purple-400/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-400',
    description: 'Merging letters',
  },
  ikhfa: {
    name: 'Ikhfa',
    color: '#facc15', // yellow-400
    bgColor: 'bg-yellow-400/20',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-400',
    description: 'Hidden pronunciation',
  },
  iqlab: {
    name: 'Iqlab',
    color: '#2dd4bf', // teal-400
    bgColor: 'bg-teal-400/20',
    textColor: 'text-teal-400',
    borderColor: 'border-teal-400',
    description: 'Conversion to meem',
  },
  izhar: {
    name: 'Izhar',
    color: '#fb923c', // orange-400
    bgColor: 'bg-orange-400/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-400',
    description: 'Clear pronunciation',
  },
  tafkheem: {
    name: 'Tafkheem',
    color: '#f472b6', // pink-400
    bgColor: 'bg-pink-400/20',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-400',
    description: 'Heavy/emphatic letters',
  },
  tarqeeq: {
    name: 'Tarqeeq',
    color: '#a78bfa', // violet-400
    bgColor: 'bg-violet-400/20',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-400',
    description: 'Light pronunciation',
  },
} as const;

export type TajweedRuleType = keyof typeof TAJWEED_COLORS;

// ============================================
// Arabic Letter Categories
// ============================================

// Qalqalah letters: ق ط ب ج د
export const QALQALAH_LETTERS = ['ق', 'ط', 'ب', 'ج', 'د'];

// Heavy/Tafkheem letters: خ ص ض غ ط ق ظ
export const TAFKHEEM_LETTERS = ['خ', 'ص', 'ض', 'غ', 'ط', 'ق', 'ظ'];

// Idgham letters (with ghunnah): ي ن م و
export const IDGHAM_WITH_GHUNNAH = ['ي', 'ن', 'م', 'و'];

// Idgham letters (without ghunnah): ل ر
export const IDGHAM_WITHOUT_GHUNNAH = ['ل', 'ر'];

// Ikhfa letters (15 letters)
export const IKHFA_LETTERS = ['ت', 'ث', 'ج', 'د', 'ذ', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ف', 'ق', 'ك'];

// Izhar letters (throat letters): ء ه ع ح غ خ
export const IZHAR_LETTERS = ['ء', 'ه', 'ع', 'ح', 'غ', 'خ'];

// Madd letters: ا و ي
export const MADD_LETTERS = ['ا', 'و', 'ي'];

// Sukoon (absence of vowel)
export const SUKOON = 'ْ';

// Shaddah (gemination)
export const SHADDAH = 'ّ';

// Tanween markers
export const TANWEEN = ['ً', 'ٌ', 'ٍ'];

// ============================================
// Detailed Rule Definitions
// ============================================

export interface TajweedRuleDefinition {
  id: TajweedRuleType;
  name: string;
  arabicName: string;
  description: string;
  explanation: string;
  examples: string[];
  tips: string[];
  audioExample?: string;
}

export const TAJWEED_RULE_DEFINITIONS: Record<TajweedRuleType, TajweedRuleDefinition> = {
  ghunnah: {
    id: 'ghunnah',
    name: 'Ghunnah',
    arabicName: 'غُنّة',
    description: 'Nasalization held for 2 counts',
    explanation: 'A nasal sound produced from the nose when pronouncing noon (ن) or meem (م) with shaddah, or during idgham and ikhfa.',
    examples: ['إِنَّ', 'مِمَّا', 'مِن مَّاء'],
    tips: [
      'Place tongue behind upper teeth',
      'Let sound resonate through nose',
      'Hold for approximately 2 counts',
      'Practice humming "mmm" or "nnn"',
    ],
  },
  qalqalah: {
    id: 'qalqalah',
    name: 'Qalqalah',
    arabicName: 'قَلْقَلة',
    description: 'Echo/bouncing effect on specific letters',
    explanation: 'A slight bouncing or echoing sound when pronouncing the letters ق ط ب ج د with sukoon. Stronger at the end of a word or verse.',
    examples: ['يَخْلُقْ', 'أَحَدْ', 'الْفَلَقْ'],
    tips: [
      'Remember: قُطْبُ جَدّ (Qutb Jadd)',
      'Light bounce mid-word',
      'Stronger bounce at word end',
      'Don\'t add vowel sounds',
    ],
  },
  madd: {
    id: 'madd',
    name: 'Madd',
    arabicName: 'مَدّ',
    description: 'Elongation of vowel sounds',
    explanation: 'Stretching the vowel sound. Natural madd is 2 counts. Other types range from 4-6 counts based on specific conditions.',
    examples: ['قَالَ', 'يَقُولُ', 'فِيهَا'],
    tips: [
      'Natural madd: 2 counts',
      'Connected madd: 4-5 counts',
      'Necessary madd: 6 counts',
      'Count using finger taps',
    ],
  },
  idgham: {
    id: 'idgham',
    name: 'Idgham',
    arabicName: 'إِدْغام',
    description: 'Merging noon sakinah into the next letter',
    explanation: 'When noon sakinah or tanween is followed by ي ن م و ل ر, the noon merges into the following letter. With ي ن م و includes ghunnah.',
    examples: ['مِن يَّعْمَل', 'مَن لَّمْ'],
    tips: [
      'Remember: يَرْمُلُون (Yarmaloon)',
      'With غ: ي ن م و',
      'Without غ: ل ر',
      'Complete merger - no noon sound',
    ],
  },
  ikhfa: {
    id: 'ikhfa',
    name: 'Ikhfa',
    arabicName: 'إِخْفاء',
    description: 'Hiding the noon sound',
    explanation: 'When noon sakinah or tanween is followed by one of 15 letters, the noon is "hidden" - pronounced lightly with ghunnah.',
    examples: ['مِن قَبْلِ', 'عَنْ ذِكْرِ'],
    tips: [
      'Between izhar and idgham',
      'Include ghunnah',
      '15 letters (exclude throat letters and ي ر ل م و ن ب)',
      'Tongue doesn\'t touch',
    ],
  },
  iqlab: {
    id: 'iqlab',
    name: 'Iqlab',
    arabicName: 'إِقْلاب',
    description: 'Converting noon to meem',
    explanation: 'When noon sakinah or tanween is followed by ب (ba), the noon changes to meem and is held with ghunnah.',
    examples: ['مِن بَعْدِ', 'سَمِيعٌ بَصِير'],
    tips: [
      'Only before ب (ba)',
      'Change ن to م sound',
      'Close lips for meem',
      'Include ghunnah (2 counts)',
    ],
  },
  izhar: {
    id: 'izhar',
    name: 'Izhar',
    arabicName: 'إِظْهار',
    description: 'Clear pronunciation of noon',
    explanation: 'When noon sakinah or tanween is followed by a throat letter (ء ه ع ح غ خ), pronounce the noon clearly without merging.',
    examples: ['مِنْ عِنْدِ', 'مَنْ آمَنَ'],
    tips: [
      'Throat letters: ء ه ع ح غ خ',
      'Clear noon sound',
      'No ghunnah',
      'Quick transition to next letter',
    ],
  },
  tafkheem: {
    id: 'tafkheem',
    name: 'Tafkheem',
    arabicName: 'تَفْخِيم',
    description: 'Heavy/emphatic pronunciation',
    explanation: 'Full, heavy pronunciation of specific letters. The tongue is raised to the roof of the mouth, creating a deeper sound.',
    examples: ['صَلاة', 'الظُّلُمات', 'غَفُور'],
    tips: [
      'Letters: خ ص ض غ ط ق ظ',
      'Raise back of tongue',
      'Full mouth resonance',
      'Sometimes ر and ل are heavy too',
    ],
  },
  tarqeeq: {
    id: 'tarqeeq',
    name: 'Tarqeeq',
    arabicName: 'تَرْقِيق',
    description: 'Light/soft pronunciation',
    explanation: 'Light pronunciation of letters. Most Arabic letters are naturally light. The tongue stays low and forward.',
    examples: ['بِسْمِ', 'الرَّحِيم'],
    tips: [
      'Most letters are light',
      'Tongue stays low',
      'No heavy emphasis',
      'Natural, relaxed pronunciation',
    ],
  },
};

// ============================================
// Pattern Matching Functions
// ============================================

export interface TajweedMatch {
  rule: TajweedRuleType;
  startIndex: number;
  endIndex: number;
  matchedText: string;
}

/**
 * Find all tajweed rules in a given Arabic text
 */
export function findTajweedRules(text: string): TajweedMatch[] {
  const matches: TajweedMatch[] = [];
  
  // Find Ghunnah (noon/meem with shaddah)
  const ghunnahPattern = /[نم]ّ/g;
  let match;
  while ((match = ghunnahPattern.exec(text)) !== null) {
    matches.push({
      rule: 'ghunnah',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      matchedText: match[0],
    });
  }
  
  // Find Qalqalah (قطبجد with sukoon or at word end)
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (QALQALAH_LETTERS.includes(char)) {
      const nextChar = text[i + 1];
      // Check for sukoon or end of word
      if (nextChar === SUKOON || nextChar === ' ' || nextChar === undefined || /[\s\u0640]/.test(nextChar)) {
        matches.push({
          rule: 'qalqalah',
          startIndex: i,
          endIndex: i + 1,
          matchedText: char,
        });
      }
    }
  }
  
  // Find Madd (elongation letters followed by sukoon on next consonant or madd indicator)
  const maddPattern = /[اوي](?=[^ًٌٍَُِّْ]*[ْ])|[اوي]ٓ/g;
  while ((match = maddPattern.exec(text)) !== null) {
    matches.push({
      rule: 'madd',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      matchedText: match[0],
    });
  }
  
  // Also find basic madd (alif after fatha, waw after damma, ya after kasra)
  const basicMaddPattern = /[َ][ا]|[ُ][و]|[ِ][ي]/g;
  while ((match = basicMaddPattern.exec(text)) !== null) {
    matches.push({
      rule: 'madd',
      startIndex: match.index,
      endIndex: match.index + match[0].length,
      matchedText: match[0],
    });
  }
  
  // Find Tafkheem letters
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (TAFKHEEM_LETTERS.includes(char)) {
      matches.push({
        rule: 'tafkheem',
        startIndex: i,
        endIndex: i + 1,
        matchedText: char,
      });
    }
  }
  
  // Find noon sakinah/tanween rules
  const noonSakinahPattern = /[نْ]|ن(?=[^ًٌٍَُِّ])|[ً ٌ ٍ]/g;
  while ((match = noonSakinahPattern.exec(text)) !== null) {
    const nextCharIndex = match.index + match[0].length;
    const nextChar = text[nextCharIndex];
    
    if (nextChar) {
      // Check for Iqlab (before ب)
      if (nextChar === 'ب') {
        matches.push({
          rule: 'iqlab',
          startIndex: match.index,
          endIndex: nextCharIndex + 1,
          matchedText: match[0] + nextChar,
        });
      }
      // Check for Idgham (before يرملون)
      else if ([...IDGHAM_WITH_GHUNNAH, ...IDGHAM_WITHOUT_GHUNNAH].includes(nextChar)) {
        matches.push({
          rule: 'idgham',
          startIndex: match.index,
          endIndex: nextCharIndex + 1,
          matchedText: match[0] + nextChar,
        });
      }
      // Check for Izhar (before throat letters)
      else if (IZHAR_LETTERS.includes(nextChar)) {
        matches.push({
          rule: 'izhar',
          startIndex: match.index,
          endIndex: nextCharIndex + 1,
          matchedText: match[0] + nextChar,
        });
      }
      // Check for Ikhfa (before ikhfa letters)
      else if (IKHFA_LETTERS.includes(nextChar)) {
        matches.push({
          rule: 'ikhfa',
          startIndex: match.index,
          endIndex: nextCharIndex + 1,
          matchedText: match[0] + nextChar,
        });
      }
    }
  }
  
  // Sort by start index and remove overlaps (keep first)
  matches.sort((a, b) => a.startIndex - b.startIndex);
  
  return matches;
}

/**
 * Get the color for a specific rule
 */
export function getRuleColor(rule: TajweedRuleType): string {
  return TAJWEED_COLORS[rule].color;
}

/**
 * Get all rule types as an array
 */
export function getAllRuleTypes(): TajweedRuleType[] {
  return Object.keys(TAJWEED_COLORS) as TajweedRuleType[];
}

/**
 * Check if a character is a diacritic/tashkeel
 */
export function isDiacritic(char: string): boolean {
  const diacritics = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/;
  return diacritics.test(char);
}

/**
 * Get the base letter without diacritics
 */
export function getBaseLetter(text: string): string {
  return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
}

// ============================================
// Makhraj (Articulation Points)
// ============================================

export interface MakhrajPoint {
  id: string;
  name: string;
  arabicName: string;
  location: string;
  letters: string[];
  x: number; // Percentage position
  y: number; // Percentage position
}

export const MAKHRAJ_POINTS: MakhrajPoint[] = [
  {
    id: 'jawf',
    name: 'Empty Space (Jawf)',
    arabicName: 'الجوف',
    location: 'Empty space in mouth and throat',
    letters: ['ا', 'و', 'ي'],
    x: 50,
    y: 50,
  },
  {
    id: 'halq-lower',
    name: 'Lower Throat',
    arabicName: 'أقصى الحلق',
    location: 'Deepest part of throat',
    letters: ['ء', 'ه'],
    x: 75,
    y: 75,
  },
  {
    id: 'halq-middle',
    name: 'Middle Throat',
    arabicName: 'وسط الحلق',
    location: 'Middle of throat',
    letters: ['ع', 'ح'],
    x: 70,
    y: 65,
  },
  {
    id: 'halq-upper',
    name: 'Upper Throat',
    arabicName: 'أدنى الحلق',
    location: 'Top of throat near tongue root',
    letters: ['غ', 'خ'],
    x: 65,
    y: 55,
  },
  {
    id: 'tongue-root',
    name: 'Tongue Root',
    arabicName: 'أقصى اللسان',
    location: 'Back of tongue against soft palate',
    letters: ['ق', 'ك'],
    x: 55,
    y: 45,
  },
  {
    id: 'tongue-middle',
    name: 'Middle Tongue',
    arabicName: 'وسط اللسان',
    location: 'Middle of tongue against hard palate',
    letters: ['ج', 'ش', 'ي'],
    x: 45,
    y: 35,
  },
  {
    id: 'tongue-side',
    name: 'Tongue Side',
    arabicName: 'حافة اللسان',
    location: 'Sides of tongue against molars',
    letters: ['ض'],
    x: 35,
    y: 40,
  },
  {
    id: 'tongue-side-front',
    name: 'Tongue Side Front',
    arabicName: 'حافة اللسان الأمامية',
    location: 'Front edge of tongue',
    letters: ['ل'],
    x: 30,
    y: 30,
  },
  {
    id: 'tongue-tip-upper',
    name: 'Tongue Tip (Upper)',
    arabicName: 'طرف اللسان',
    location: 'Tip of tongue against upper gum',
    letters: ['ن', 'ر'],
    x: 25,
    y: 25,
  },
  {
    id: 'tongue-tip-teeth',
    name: 'Tongue Tip (Teeth)',
    arabicName: 'طرف اللسان مع الأسنان',
    location: 'Tip of tongue against/near upper teeth',
    letters: ['ت', 'د', 'ط'],
    x: 20,
    y: 22,
  },
  {
    id: 'tongue-teeth-edge',
    name: 'Tongue Teeth Edge',
    arabicName: 'طرف اللسان مع أطراف الأسنان',
    location: 'Tongue tip against teeth edges',
    letters: ['ث', 'ذ', 'ظ'],
    x: 15,
    y: 18,
  },
  {
    id: 'tongue-gum',
    name: 'Tongue Gum',
    arabicName: 'طرف اللسان قريب من اللثة',
    location: 'Tongue tip near upper gum',
    letters: ['س', 'ص', 'ز'],
    x: 22,
    y: 20,
  },
  {
    id: 'lips-inner',
    name: 'Inner Lips',
    arabicName: 'بطن الشفة',
    location: 'Inner lower lip against upper teeth',
    letters: ['ف'],
    x: 10,
    y: 35,
  },
  {
    id: 'lips',
    name: 'Lips',
    arabicName: 'الشفتان',
    location: 'Both lips together',
    letters: ['ب', 'م', 'و'],
    x: 8,
    y: 40,
  },
  {
    id: 'nasal',
    name: 'Nasal Passage',
    arabicName: 'الخيشوم',
    location: 'Nasal cavity',
    letters: ['غنة'],
    x: 40,
    y: 15,
  },
];

/**
 * Get makhraj point for a letter
 */
export function getMakhrajForLetter(letter: string): MakhrajPoint | undefined {
  const baseLetter = getBaseLetter(letter);
  return MAKHRAJ_POINTS.find(point => point.letters.includes(baseLetter));
}

// ============================================
// Flowchart Decision Tree
// ============================================

export interface FlowchartNode {
  id: string;
  type: 'question' | 'rule' | 'start';
  text: string;
  arabicText?: string;
  rule?: TajweedRuleType;
  yes?: string;
  no?: string;
}

export const NOON_SAKINAH_FLOWCHART: FlowchartNode[] = [
  {
    id: 'start',
    type: 'start',
    text: 'Noon Sakinah (نْ) or Tanween',
    arabicText: 'نون ساكنة أو تنوين',
  },
  {
    id: 'q1',
    type: 'question',
    text: 'Is the next letter ب (Ba)?',
    arabicText: 'هل الحرف التالي ب؟',
    yes: 'iqlab',
    no: 'q2',
  },
  {
    id: 'q2',
    type: 'question',
    text: 'Is it a throat letter?\n(ء ه ع ح غ خ)',
    arabicText: 'هل هو حرف حلقي؟',
    yes: 'izhar',
    no: 'q3',
  },
  {
    id: 'q3',
    type: 'question',
    text: 'Is it ي ر م ل و ن?',
    arabicText: 'هل هو من يرملون؟',
    yes: 'idgham',
    no: 'ikhfa',
  },
  {
    id: 'iqlab',
    type: 'rule',
    text: 'Iqlab',
    arabicText: 'إقلاب',
    rule: 'iqlab',
  },
  {
    id: 'izhar',
    type: 'rule',
    text: 'Izhar',
    arabicText: 'إظهار',
    rule: 'izhar',
  },
  {
    id: 'idgham',
    type: 'rule',
    text: 'Idgham',
    arabicText: 'إدغام',
    rule: 'idgham',
  },
  {
    id: 'ikhfa',
    type: 'rule',
    text: 'Ikhfa',
    arabicText: 'إخفاء',
    rule: 'ikhfa',
  },
];

export const MEEM_SAKINAH_FLOWCHART: FlowchartNode[] = [
  {
    id: 'start',
    type: 'start',
    text: 'Meem Sakinah (مْ)',
    arabicText: 'ميم ساكنة',
  },
  {
    id: 'q1',
    type: 'question',
    text: 'Is the next letter م (Meem)?',
    arabicText: 'هل الحرف التالي م؟',
    yes: 'idgham-shafawi',
    no: 'q2',
  },
  {
    id: 'q2',
    type: 'question',
    text: 'Is the next letter ب (Ba)?',
    arabicText: 'هل الحرف التالي ب؟',
    yes: 'ikhfa-shafawi',
    no: 'izhar-shafawi',
  },
  {
    id: 'idgham-shafawi',
    type: 'rule',
    text: 'Idgham Shafawi\n(with Ghunnah)',
    arabicText: 'إدغام شفوي مع غنة',
    rule: 'idgham',
  },
  {
    id: 'ikhfa-shafawi',
    type: 'rule',
    text: 'Ikhfa Shafawi\n(with Ghunnah)',
    arabicText: 'إخفاء شفوي مع غنة',
    rule: 'ikhfa',
  },
  {
    id: 'izhar-shafawi',
    type: 'rule',
    text: 'Izhar Shafawi',
    arabicText: 'إظهار شفوي',
    rule: 'izhar',
  },
];
