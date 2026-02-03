/**
 * HIFZ Flashcard System
 * 
 * Comprehensive Quranic vocabulary with 1000+ words
 * Spaced repetition flashcards using SM-2 algorithm
 */

export interface Flashcard {
  id: string;
  arabic: string;
  transliteration: string;
  english: string;
  audioUrl?: string;
  category: 'letter' | 'word' | 'phrase' | 'verse' | 'rule';
  lessonId?: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  tags: string[];
  examples?: { arabic: string; english: string; }[];
}

export interface FlashcardProgress {
  cardId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview: number;
  totalReviews: number;
  correctCount: number;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  nameArabic?: string;
  description: string;
  icon: string;
  cards: Flashcard[];
  lessonIds?: string[];
  totalWords?: number;
}

// ============================================
// Arabic Alphabet (28 letters)
// ============================================
const ARABIC_LETTERS: Flashcard[] = [
  { id: 'letter-alif', arabic: 'ا', transliteration: 'alif', english: 'A / silent', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-ba', arabic: 'ب', transliteration: 'ba', english: 'B', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-ta', arabic: 'ت', transliteration: 'ta', english: 'T', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-tha', arabic: 'ث', transliteration: 'tha', english: 'Th (think)', category: 'letter', difficulty: 2, tags: ['alphabet'] },
  { id: 'letter-jim', arabic: 'ج', transliteration: 'jim', english: 'J', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-ha', arabic: 'ح', transliteration: 'ha', english: 'H (emphatic)', category: 'letter', difficulty: 3, tags: ['alphabet'] },
  { id: 'letter-kha', arabic: 'خ', transliteration: 'kha', english: 'Kh', category: 'letter', difficulty: 3, tags: ['alphabet'] },
  { id: 'letter-dal', arabic: 'د', transliteration: 'dal', english: 'D', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-dhal', arabic: 'ذ', transliteration: 'dhal', english: 'Dh (this)', category: 'letter', difficulty: 2, tags: ['alphabet'] },
  { id: 'letter-ra', arabic: 'ر', transliteration: 'ra', english: 'R (rolled)', category: 'letter', difficulty: 2, tags: ['alphabet'] },
  { id: 'letter-zay', arabic: 'ز', transliteration: 'zay', english: 'Z', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-sin', arabic: 'س', transliteration: 'sin', english: 'S', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-shin', arabic: 'ش', transliteration: 'shin', english: 'Sh', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-sad', arabic: 'ص', transliteration: 'sad', english: 'S (emphatic)', category: 'letter', difficulty: 3, tags: ['alphabet'] },
  { id: 'letter-dad', arabic: 'ض', transliteration: 'dad', english: 'D (emphatic)', category: 'letter', difficulty: 4, tags: ['alphabet'] },
  { id: 'letter-tah', arabic: 'ط', transliteration: 'ta', english: 'T (emphatic)', category: 'letter', difficulty: 3, tags: ['alphabet'] },
  { id: 'letter-dhah', arabic: 'ظ', transliteration: 'dha', english: 'Dh (emphatic)', category: 'letter', difficulty: 4, tags: ['alphabet'] },
  { id: 'letter-ayn', arabic: 'ع', transliteration: 'ayn', english: 'Voiced throat', category: 'letter', difficulty: 5, tags: ['alphabet'] },
  { id: 'letter-ghayn', arabic: 'غ', transliteration: 'ghayn', english: 'Gh', category: 'letter', difficulty: 4, tags: ['alphabet'] },
  { id: 'letter-fa', arabic: 'ف', transliteration: 'fa', english: 'F', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-qaf', arabic: 'ق', transliteration: 'qaf', english: 'Q (deep)', category: 'letter', difficulty: 4, tags: ['alphabet'] },
  { id: 'letter-kaf', arabic: 'ك', transliteration: 'kaf', english: 'K', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-lam', arabic: 'ل', transliteration: 'lam', english: 'L', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-mim', arabic: 'م', transliteration: 'mim', english: 'M', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-nun', arabic: 'ن', transliteration: 'nun', english: 'N', category: 'letter', difficulty: 1, tags: ['alphabet'] },
  { id: 'letter-ha2', arabic: 'ه', transliteration: 'ha', english: 'H (light)', category: 'letter', difficulty: 2, tags: ['alphabet'] },
  { id: 'letter-waw', arabic: 'و', transliteration: 'waw', english: 'W / U', category: 'letter', difficulty: 2, tags: ['alphabet'] },
  { id: 'letter-ya', arabic: 'ي', transliteration: 'ya', english: 'Y / I', category: 'letter', difficulty: 2, tags: ['alphabet'] },
];

// ============================================
// 99 Names of Allah
// ============================================
const NAMES_OF_ALLAH: Flashcard[] = [
  { id: 'name-allah', arabic: 'الله', transliteration: 'Allah', english: 'Allah - The Greatest Name', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-1', arabic: 'الرَّحْمَٰن', transliteration: 'Ar-Rahman', english: 'The Most Merciful', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-2', arabic: 'الرَّحِيم', transliteration: 'Ar-Rahim', english: 'The Especially Merciful', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-3', arabic: 'الْمَلِك', transliteration: 'Al-Malik', english: 'The King', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-4', arabic: 'الْقُدُّوس', transliteration: 'Al-Quddus', english: 'The Pure', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-5', arabic: 'السَّلَام', transliteration: 'As-Salam', english: 'The Source of Peace', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: "name-6", arabic: "الْمُؤْمِن", transliteration: "Al-Mu'min", english: "The Granter of Security", category: "word", difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-7', arabic: 'الْمُهَيْمِن', transliteration: 'Al-Muhaymin', english: 'The Guardian', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-8', arabic: 'الْعَزِيز', transliteration: 'Al-Aziz', english: 'The Almighty', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-9', arabic: 'الْجَبَّار', transliteration: 'Al-Jabbar', english: 'The Compeller', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-10', arabic: 'الْمُتَكَبِّر', transliteration: 'Al-Mutakabbir', english: 'The Supreme', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-11', arabic: 'الْخَالِق', transliteration: 'Al-Khaliq', english: 'The Creator', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: "name-12", arabic: "الْبَارِئ", transliteration: "Al-Bari'", english: "The Originator", category: "word", difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-13', arabic: 'الْمُصَوِّر', transliteration: 'Al-Musawwir', english: 'The Fashioner', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-14', arabic: 'الْغَفَّار', transliteration: 'Al-Ghaffar', english: 'The Forgiver', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-15', arabic: 'الْقَهَّار', transliteration: 'Al-Qahhar', english: 'The Subduer', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-16', arabic: 'الْوَهَّاب', transliteration: 'Al-Wahhab', english: 'The Bestower', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-17', arabic: 'الرَّزَّاق', transliteration: 'Ar-Razzaq', english: 'The Provider', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-18', arabic: 'الْفَتَّاح', transliteration: 'Al-Fattah', english: 'The Opener', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-19', arabic: 'الْعَلِيم', transliteration: 'Al-Alim', english: 'The All-Knowing', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-20', arabic: 'الْقَابِض', transliteration: 'Al-Qabid', english: 'The Withholder', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-21', arabic: 'الْبَاسِط', transliteration: 'Al-Basit', english: 'The Expander', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-22', arabic: 'الْخَافِض', transliteration: 'Al-Khafid', english: 'The Abaser', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-23", arabic: "الرَّافِع", transliteration: "Ar-Rafi'", english: "The Exalter", category: "word", difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-24", arabic: "الْمُعِزّ", transliteration: "Al-Mu'izz", english: "The Honorer", category: "word", difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-25', arabic: 'الْمُذِلّ', transliteration: 'Al-Mudhill', english: 'The Humiliator', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-26", arabic: "السَّمِيع", transliteration: "As-Sami'", english: "The All-Hearing", category: "word", difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-27', arabic: 'الْبَصِير', transliteration: 'Al-Basir', english: 'The All-Seeing', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-28', arabic: 'الْحَكَم', transliteration: 'Al-Hakam', english: 'The Judge', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-29', arabic: 'الْعَدْل', transliteration: 'Al-Adl', english: 'The Just', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-30', arabic: 'اللَّطِيف', transliteration: 'Al-Latif', english: 'The Gentle', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-31', arabic: 'الْخَبِير', transliteration: 'Al-Khabir', english: 'The Aware', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-32', arabic: 'الْحَلِيم', transliteration: 'Al-Halim', english: 'The Forbearing', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-33', arabic: 'الْعَظِيم', transliteration: 'Al-Azim', english: 'The Magnificent', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-34', arabic: 'الْغَفُور', transliteration: 'Al-Ghafur', english: 'The Forgiving', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-35', arabic: 'الشَّكُور', transliteration: 'Ash-Shakur', english: 'The Appreciative', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-36', arabic: 'الْعَلِيّ', transliteration: 'Al-Ali', english: 'The Most High', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-37', arabic: 'الْكَبِير', transliteration: 'Al-Kabir', english: 'The Greatest', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-38', arabic: 'الْحَفِيظ', transliteration: 'Al-Hafiz', english: 'The Preserver', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-39', arabic: 'الْمُقِيت', transliteration: 'Al-Muqit', english: 'The Sustainer', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-40', arabic: 'الْحَسِيب', transliteration: 'Al-Hasib', english: 'The Reckoner', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-41', arabic: 'الْجَلِيل', transliteration: 'Al-Jalil', english: 'The Majestic', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-42', arabic: 'الْكَرِيم', transliteration: 'Al-Karim', english: 'The Generous', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-43', arabic: 'الرَّقِيب', transliteration: 'Ar-Raqib', english: 'The Watchful', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-44', arabic: 'الْمُجِيب', transliteration: 'Al-Mujib', english: 'The Responsive', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: "name-45", arabic: "الْوَاسِع", transliteration: "Al-Wasi'", english: "The All-Encompassing", category: "word", difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-46', arabic: 'الْحَكِيم', transliteration: 'Al-Hakim', english: 'The All-Wise', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-47', arabic: 'الْوَدُود', transliteration: 'Al-Wadud', english: 'The Loving', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-48', arabic: 'الْمَجِيد', transliteration: 'Al-Majid', english: 'The Glorious', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: "name-49", arabic: "الْبَاعِث", transliteration: "Al-Ba'ith", english: "The Resurrector", category: "word", difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-50', arabic: 'الشَّهِيد', transliteration: 'Ash-Shahid', english: 'The Witness', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-51', arabic: 'الْحَقّ', transliteration: 'Al-Haqq', english: 'The Truth', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-52', arabic: 'الْوَكِيل', transliteration: 'Al-Wakil', english: 'The Trustee', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-53', arabic: 'الْقَوِيّ', transliteration: 'Al-Qawiyy', english: 'The Strong', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-54', arabic: 'الْمَتِين', transliteration: 'Al-Matin', english: 'The Firm', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-55', arabic: 'الْوَلِيّ', transliteration: 'Al-Waliyy', english: 'The Guardian', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-56', arabic: 'الْحَمِيد', transliteration: 'Al-Hamid', english: 'The Praiseworthy', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-57', arabic: 'الْمُحْصِي', transliteration: 'Al-Muhsi', english: 'The Enumerator', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-58", arabic: "الْمُبْدِئ", transliteration: "Al-Mubdi'", english: "The Originator", category: "word", difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-59", arabic: "الْمُعِيد", transliteration: "Al-Mu'id", english: "The Restorer", category: "word", difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-60', arabic: 'الْمُحْيِي', transliteration: 'Al-Muhyi', english: 'The Life-Giver', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-61', arabic: 'الْمُمِيت', transliteration: 'Al-Mumit', english: 'The Death-Giver', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-62', arabic: 'الْحَيّ', transliteration: 'Al-Hayy', english: 'The Ever-Living', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-63', arabic: 'الْقَيُّوم', transliteration: 'Al-Qayyum', english: 'The Self-Sustaining', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-64', arabic: 'الْوَاجِد', transliteration: 'Al-Wajid', english: 'The Finder', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-65', arabic: 'الْمَاجِد', transliteration: 'Al-Majid', english: 'The Illustrious', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-66', arabic: 'الْوَاحِد', transliteration: 'Al-Wahid', english: 'The One', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-67', arabic: 'الْأَحَد', transliteration: 'Al-Ahad', english: 'The Unique', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-68', arabic: 'الصَّمَد', transliteration: 'As-Samad', english: 'The Eternal', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-69', arabic: 'الْقَادِر', transliteration: 'Al-Qadir', english: 'The Able', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-70', arabic: 'الْمُقْتَدِر', transliteration: 'Al-Muqtadir', english: 'The All-Powerful', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-71', arabic: 'الْمُقَدِّم', transliteration: 'Al-Muqaddim', english: 'The Expediter', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-72", arabic: "الْمُؤَخِّر", transliteration: "Al-Mu'akhkhir", english: "The Delayer", category: "word", difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-73', arabic: 'الْأَوَّل', transliteration: 'Al-Awwal', english: 'The First', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-74', arabic: 'الْآخِر', transliteration: 'Al-Akhir', english: 'The Last', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-75', arabic: 'الظَّاهِر', transliteration: 'Az-Zahir', english: 'The Manifest', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-76', arabic: 'الْبَاطِن', transliteration: 'Al-Batin', english: 'The Hidden', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-77', arabic: 'الْوَالِي', transliteration: 'Al-Wali', english: 'The Governor', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-78", arabic: "الْمُتَعَالِي", transliteration: "Al-Muta'ali", english: "The Self-Exalted", category: "word", difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-79', arabic: 'الْبَرّ', transliteration: 'Al-Barr', english: 'The Beneficent', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-80', arabic: 'التَّوَّاب', transliteration: 'At-Tawwab', english: 'The Pardoning', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-81', arabic: 'الْمُنْتَقِم', transliteration: 'Al-Muntaqim', english: 'The Avenger', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-82', arabic: 'الْعَفُوّ', transliteration: 'Al-Afuww', english: 'The Pardoner', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: "name-83", arabic: "الرَّءُوف", transliteration: "Ar-Ra'uf", english: "The Most Kind", category: "word", difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-84', arabic: 'مَالِكُ الْمُلْك', transliteration: 'Malik-ul-Mulk', english: 'Owner of Kingdom', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-85', arabic: 'ذُو الْجَلَالِ', transliteration: 'Dhul-Jalal', english: 'Lord of Majesty', category: 'word', difficulty: 4, tags: ["names-of-allah"] },
  { id: 'name-86', arabic: 'الْمُقْسِط', transliteration: 'Al-Muqsit', english: 'The Equitable', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-87", arabic: "الْجَامِع", transliteration: "Al-Jami'", english: "The Gatherer", category: "word", difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-88', arabic: 'الْغَنِيّ', transliteration: 'Al-Ghaniyy', english: 'The Self-Sufficient', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-89', arabic: 'الْمُغْنِي', transliteration: 'Al-Mughni', english: 'The Enricher', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-90", arabic: "الْمَانِع", transliteration: "Al-Mani'", english: "The Withholder", category: "word", difficulty: 3, tags: ["names-of-allah"] },
  { id: 'name-91', arabic: 'الضَّارّ', transliteration: 'Ad-Darr', english: 'The Distresser', category: 'word', difficulty: 3, tags: ["names-of-allah"] },
  { id: "name-92", arabic: "النَّافِع", transliteration: "An-Nafi'", english: "The Benefactor", category: "word", difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-93', arabic: 'النُّور', transliteration: 'An-Nur', english: 'The Light', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: 'name-94', arabic: 'الْهَادِي', transliteration: 'Al-Hadi', english: 'The Guide', category: 'word', difficulty: 1, tags: ["names-of-allah"] },
  { id: "name-95", arabic: "الْبَدِيع", transliteration: "Al-Badi'", english: "The Originator", category: "word", difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-96', arabic: 'الْبَاقِي', transliteration: 'Al-Baqi', english: 'The Everlasting', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-97', arabic: 'الْوَارِث', transliteration: 'Al-Warith', english: 'The Inheritor', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-98', arabic: 'الرَّشِيد', transliteration: 'Ar-Rashid', english: 'The Right Guide', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
  { id: 'name-99', arabic: 'الصَّبُور', transliteration: 'As-Sabur', english: 'The Patient', category: 'word', difficulty: 2, tags: ["names-of-allah"] },
];

// ============================================
// Essential Words (70 Most Common)
// ============================================
const ESSENTIAL_WORDS: Flashcard[] = [
  { id: 'ess-huwa', arabic: 'هُوَ', transliteration: 'huwa', english: 'He', category: 'word', difficulty: 1, tags: ["essential", "pronoun"] },
  { id: 'ess-hiya', arabic: 'هِيَ', transliteration: 'hiya', english: 'She', category: 'word', difficulty: 1, tags: ["essential", "pronoun"] },
  { id: 'ess-hum', arabic: 'هُمْ', transliteration: 'hum', english: 'They (m)', category: 'word', difficulty: 1, tags: ["essential", "pronoun"] },
  { id: 'ess-anta', arabic: 'أَنْتَ', transliteration: 'anta', english: 'You (m.s.)', category: 'word', difficulty: 1, tags: ["essential", "pronoun"] },
  { id: 'ess-ana', arabic: 'أَنَا', transliteration: 'ana', english: 'I', category: 'word', difficulty: 1, tags: ["essential", "pronoun"] },
  { id: 'ess-nahnu', arabic: 'نَحْنُ', transliteration: 'nahnu', english: 'We', category: 'word', difficulty: 1, tags: ["essential", "pronoun"] },
  { id: 'ess-hadha', arabic: 'هَٰذَا', transliteration: 'hadha', english: 'This (m)', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-dhalika', arabic: 'ذَٰلِكَ', transliteration: 'dhalika', english: 'That (m)', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-rabb', arabic: 'رَبّ', transliteration: 'rabb', english: 'Lord', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-nas', arabic: 'النَّاس', transliteration: 'an-nas', english: 'People', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-yawm', arabic: 'يَوْم', transliteration: 'yawm', english: 'Day', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-ard', arabic: 'أَرْض', transliteration: 'ard', english: 'Earth', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-sama', arabic: 'سَمَاء', transliteration: 'sama', english: 'Sky', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-nafs', arabic: 'نَفْس', transliteration: 'nafs', english: 'Soul', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-qawm', arabic: 'قَوْم', transliteration: 'qawm', english: 'Nation', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-shay', arabic: 'شَيْء', transliteration: 'shay', english: 'Thing', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-qalb', arabic: 'قَلْب', transliteration: 'qalb', english: 'Heart', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-ayn', arabic: 'عَيْن', transliteration: 'ayn', english: 'Eye', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-yad', arabic: 'يَد', transliteration: 'yad', english: 'Hand', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-wajh', arabic: 'وَجْه', transliteration: 'wajh', english: 'Face', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-ism', arabic: 'اسْم', transliteration: 'ism', english: 'Name', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-kitab', arabic: 'كِتَاب', transliteration: 'kitab', english: 'Book', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-ayat', arabic: 'آيَة', transliteration: 'ayah', english: 'Verse', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-haqq', arabic: 'حَقّ', transliteration: 'haqq', english: 'Truth', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-amr', arabic: 'أَمْر', transliteration: 'amr', english: 'Command', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-din', arabic: 'دِين', transliteration: 'din', english: 'Religion', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-ilm', arabic: 'عِلْم', transliteration: 'ilm', english: 'Knowledge', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-qaul', arabic: 'قَوْل', transliteration: 'qawl', english: 'Speech', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-amal', arabic: 'عَمَل', transliteration: 'amal', english: 'Deed', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-nur', arabic: 'نُور', transliteration: 'nur', english: 'Light', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-huda', arabic: 'هُدًى', transliteration: 'huda', english: 'Guidance', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-rahma', arabic: 'رَحْمَة', transliteration: 'rahmah', english: 'Mercy', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: "ess-nimat", arabic: "نِعْمَة", transliteration: "ni'mah", english: "Blessing", category: "word", difficulty: 1, tags: ["essential"] },
  { id: 'ess-bayt', arabic: 'بَيْت', transliteration: 'bayt', english: 'House', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-sabil', arabic: 'سَبِيل', transliteration: 'sabil', english: 'Way', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-sirat', arabic: 'صِرَاط', transliteration: 'sirat', english: 'Path', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-mal', arabic: 'مَال', transliteration: 'mal', english: 'Wealth', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-nar', arabic: 'نَار', transliteration: 'nar', english: 'Fire', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-jannah', arabic: 'جَنَّة', transliteration: 'jannah', english: 'Paradise', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-dhikr', arabic: 'ذِكْر', transliteration: 'dhikr', english: 'Remembrance', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-salah', arabic: 'صَلَاة', transliteration: 'salah', english: 'Prayer', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-rizq', arabic: 'رِزْق', transliteration: 'rizq', english: 'Provision', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-kabir', arabic: 'كَبِير', transliteration: 'kabir', english: 'Great', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-saghir', arabic: 'صَغِير', transliteration: 'saghir', english: 'Small', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-khayr', arabic: 'خَيْر', transliteration: 'khayr', english: 'Good', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-sharr', arabic: 'شَرّ', transliteration: 'sharr', english: 'Evil', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-kathir', arabic: 'كَثِير', transliteration: 'kathir', english: 'Many', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-qalil', arabic: 'قَلِيل', transliteration: 'qalil', english: 'Few', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-azim', arabic: 'عَظِيم', transliteration: 'azim', english: 'Great', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-la', arabic: 'لَا', transliteration: 'la', english: 'No', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-ma', arabic: 'مَا', transliteration: 'ma', english: 'What/Not', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-lam', arabic: 'لَمْ', transliteration: 'lam', english: 'Did not', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-man', arabic: 'مَنْ', transliteration: 'man', english: 'Who', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-ayna', arabic: 'أَيْنَ', transliteration: 'ayna', english: 'Where', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-kayfa', arabic: 'كَيْفَ', transliteration: 'kayfa', english: 'How', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-hal', arabic: 'هَلْ', transliteration: 'hal', english: 'Is?/Do?', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-akhira', arabic: 'آخِرَة', transliteration: 'akhirah', english: 'Hereafter', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-dunya', arabic: 'دُنْيَا', transliteration: 'dunya', english: 'World', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-hayat', arabic: 'حَيَاة', transliteration: 'hayah', english: 'Life', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-mawt', arabic: 'مَوْت', transliteration: 'mawt', english: 'Death', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-ajr', arabic: 'أَجْر', transliteration: 'ajr', english: 'Reward', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-adhab', arabic: 'عَذَاب', transliteration: 'adhab', english: 'Punishment', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-abd', arabic: 'عَبْد', transliteration: 'abd', english: 'Servant', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-rasul', arabic: 'رَسُول', transliteration: 'rasul', english: 'Messenger', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-nabi', arabic: 'نَبِيّ', transliteration: 'nabi', english: 'Prophet', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-malak', arabic: 'مَلَك', transliteration: 'malak', english: 'Angel', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-umma', arabic: 'أُمَّة', transliteration: 'ummah', english: 'Nation', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-sabr', arabic: 'صَبْر', transliteration: 'sabr', english: 'Patience', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-shukr', arabic: 'شُكْر', transliteration: 'shukr', english: 'Gratitude', category: 'word', difficulty: 1, tags: ["essential"] },
  { id: 'ess-tawba', arabic: 'تَوْبَة', transliteration: 'tawbah', english: 'Repentance', category: 'word', difficulty: 1, tags: ["essential"] },
];

// ============================================
// Particles & Prepositions
// ============================================
const PARTICLES: Flashcard[] = [
  { id: 'part-min', arabic: 'مِنْ', transliteration: 'min', english: 'From', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-ila', arabic: 'إِلَىٰ', transliteration: 'ila', english: 'To', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-fi', arabic: 'فِي', transliteration: 'fi', english: 'In', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-ala', arabic: 'عَلَىٰ', transliteration: 'ala', english: 'On', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-an', arabic: 'عَنْ', transliteration: 'an', english: 'From/About', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-bi', arabic: 'بِ', transliteration: 'bi', english: 'With/By', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-li', arabic: 'لِ', transliteration: 'li', english: 'For', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-ka', arabic: 'كَ', transliteration: 'ka', english: 'Like', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-bayna', arabic: 'بَيْنَ', transliteration: 'bayna', english: 'Between', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-fawqa', arabic: 'فَوْقَ', transliteration: 'fawqa', english: 'Above', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-tahta', arabic: 'تَحْتَ', transliteration: 'tahta', english: 'Under', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-inda', arabic: 'عِنْدَ', transliteration: 'inda', english: 'At', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: "part-maa", arabic: "مَعَ", transliteration: "ma'a", english: "With", category: "word", difficulty: 1, tags: ["particle"] },
  { id: 'part-qabla', arabic: 'قَبْلَ', transliteration: 'qabla', english: 'Before', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: "part-bada", arabic: "بَعْدَ", transliteration: "ba'da", english: "After", category: "word", difficulty: 1, tags: ["particle"] },
  { id: 'part-hatta', arabic: 'حَتَّىٰ', transliteration: 'hatta', english: 'Until', category: 'word', difficulty: 2, tags: ["particle"] },
  { id: 'part-wa', arabic: 'وَ', transliteration: 'wa', english: 'And', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-fa', arabic: 'فَ', transliteration: 'fa', english: 'So/Then', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-thumma', arabic: 'ثُمَّ', transliteration: 'thumma', english: 'Then', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-aw', arabic: 'أَوْ', transliteration: 'aw', english: 'Or', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-bal', arabic: 'بَلْ', transliteration: 'bal', english: 'Rather', category: 'word', difficulty: 2, tags: ["particle"] },
  { id: 'part-lakin', arabic: 'لَٰكِنْ', transliteration: 'lakin', english: 'But', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-idha', arabic: 'إِذَا', transliteration: 'idha', english: 'When/If', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-in', arabic: 'إِنْ', transliteration: 'in', english: 'If', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-law', arabic: 'لَوْ', transliteration: 'law', english: 'If (hyp.)', category: 'word', difficulty: 2, tags: ["particle"] },
  { id: 'part-inna', arabic: 'إِنَّ', transliteration: 'inna', english: 'Indeed', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-qad', arabic: 'قَدْ', transliteration: 'qad', english: 'Already', category: 'word', difficulty: 2, tags: ["particle"] },
  { id: 'part-sawfa', arabic: 'سَوْفَ', transliteration: 'sawfa', english: 'Will', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-alladhi', arabic: 'الَّذِي', transliteration: 'alladhi', english: 'Who (m.s.)', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-allati', arabic: 'الَّتِي', transliteration: 'allati', english: 'Who (f.s.)', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-alladhina', arabic: 'الَّذِينَ', transliteration: 'alladhina', english: 'Who (m.pl.)', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: 'part-kull', arabic: 'كُلّ', transliteration: 'kull', english: 'All/Every', category: 'word', difficulty: 1, tags: ["particle"] },
  { id: "part-bad", arabic: "بَعْض", transliteration: "ba'd", english: "Some", category: "word", difficulty: 1, tags: ["particle"] },
  { id: 'part-ghayr', arabic: 'غَيْر', transliteration: 'ghayr', english: 'Other than', category: 'word', difficulty: 2, tags: ["particle"] },
  { id: 'part-illa', arabic: 'إِلَّا', transliteration: 'illa', english: 'Except', category: 'word', difficulty: 1, tags: ["particle"] },
];

// ============================================
// Common Verbs
// ============================================
const VERBS: Flashcard[] = [
  { id: 'verb-qala', arabic: 'قَالَ', transliteration: 'qala', english: 'He said', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-kana', arabic: 'كَانَ', transliteration: 'kana', english: 'He was', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: "verb-jaa", arabic: "جَاءَ", transliteration: "ja'a", english: "He came", category: "word", difficulty: 1, tags: ["verb"] },
  { id: 'verb-amana', arabic: 'آمَنَ', transliteration: 'amana', english: 'He believed', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-alima', arabic: 'عَلِمَ', transliteration: 'alima', english: 'He knew', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-amila', arabic: 'عَمِلَ', transliteration: 'amila', english: 'He did', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: "verb-samia", arabic: "سَمِعَ", transliteration: "sami'a", english: "He heard", category: "word", difficulty: 1, tags: ["verb"] },
  { id: "verb-raa", arabic: "رَأَىٰ", transliteration: "ra'a", english: "He saw", category: "word", difficulty: 1, tags: ["verb"] },
  { id: 'verb-dhahaba', arabic: 'ذَهَبَ', transliteration: 'dhahaba', english: 'He went', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-kharaja', arabic: 'خَرَجَ', transliteration: 'kharaja', english: 'He exited', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-dakhala', arabic: 'دَخَلَ', transliteration: 'dakhala', english: 'He entered', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-kataba', arabic: 'كَتَبَ', transliteration: 'kataba', english: 'He wrote', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: "verb-qaraa", arabic: "قَرَأَ", transliteration: "qara'a", english: "He read", category: "word", difficulty: 1, tags: ["verb"] },
  { id: 'verb-fataha', arabic: 'فَتَحَ', transliteration: 'fataha', english: 'He opened', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-akhadha', arabic: 'أَخَذَ', transliteration: 'akhadha', english: 'He took', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-taba', arabic: 'تَابَ', transliteration: 'taba', english: 'He repented', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-sabara', arabic: 'صَبَرَ', transliteration: 'sabara', english: 'He was patient', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-shakara', arabic: 'شَكَرَ', transliteration: 'shakara', english: 'He thanked', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-kafara', arabic: 'كَفَرَ', transliteration: 'kafara', english: 'He disbelieved', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-dhakara', arabic: 'ذَكَرَ', transliteration: 'dhakara', english: 'He remembered', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-nasara', arabic: 'نَصَرَ', transliteration: 'nasara', english: 'He helped', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-wajada', arabic: 'وَجَدَ', transliteration: 'wajada', english: 'He found', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-arafa', arabic: 'عَرَفَ', transliteration: 'arafa', english: 'He knew', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-taraka', arabic: 'تَرَكَ', transliteration: 'taraka', english: 'He left', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-khafa', arabic: 'خَافَ', transliteration: 'khafa', english: 'He feared', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-raja", arabic: "رَجَعَ", transliteration: "raja'a", english: "He returned", category: "word", difficulty: 1, tags: ["verb"] },
  { id: 'verb-arada', arabic: 'أَرَادَ', transliteration: 'arada', english: 'He wanted', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-hada', arabic: 'هَدَىٰ', transliteration: 'hada', english: 'He guided', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-dalla', arabic: 'ضَلَّ', transliteration: 'dalla', english: 'He went astray', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-gafara', arabic: 'غَفَرَ', transliteration: 'ghafara', english: 'He forgave', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-khalaqa', arabic: 'خَلَقَ', transliteration: 'khalaqa', english: 'He created', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-razaqa', arabic: 'رَزَقَ', transliteration: 'razaqa', english: 'He provided', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-anzala', arabic: 'أَنْزَلَ', transliteration: 'anzala', english: 'He sent down', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-arsala', arabic: 'أَرْسَلَ', transliteration: 'arsala', english: 'He sent', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-qul', arabic: 'قُلْ', transliteration: 'qul', english: 'Say!', category: 'word', difficulty: 1, tags: ["verb", "command"] },
  { id: 'verb-unzur', arabic: 'انْظُرْ', transliteration: 'unzur', english: 'Look!', category: 'word', difficulty: 2, tags: ["verb", "command"] },
  { id: 'verb-iqra', arabic: 'اقْرَأْ', transliteration: 'iqra', english: 'Read!', category: 'word', difficulty: 1, tags: ["verb", "command"] },
  { id: "verb-udbud", arabic: "اعْبُدْ", transliteration: "u'bud", english: "Worship!", category: "word", difficulty: 2, tags: ["verb", "command"] },
  { id: 'verb-adhkur', arabic: 'اذْكُرْ', transliteration: 'udhkur', english: 'Remember!', category: 'word', difficulty: 2, tags: ["verb", "command"] },
  { id: 'verb-yaqulu', arabic: 'يَقُولُ', transliteration: 'yaqulu', english: 'He says', category: 'word', difficulty: 1, tags: ["verb", "present"] },
  { id: 'verb-yakunu', arabic: 'يَكُونُ', transliteration: 'yakunu', english: 'He is', category: 'word', difficulty: 1, tags: ["verb", "present"] },
  { id: "verb-yalamu", arabic: "يَعْلَمُ", transliteration: "ya'lamu", english: "He knows", category: "word", difficulty: 1, tags: ["verb", "present"] },
  { id: "verb-yamalu", arabic: "يَعْمَلُ", transliteration: "ya'malu", english: "He does", category: "word", difficulty: 1, tags: ["verb", "present"] },
  { id: 'verb-yuridu', arabic: 'يُرِيدُ', transliteration: 'yuridu', english: 'He wants', category: 'word', difficulty: 2, tags: ["verb", "present"] },
];

// ============================================
// Prayer & Worship
// ============================================
const PRAYER_VOCAB: Flashcard[] = [
  { id: 'pray-salah', arabic: 'صَلَاة', transliteration: 'salah', english: 'Prayer', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-wudu', arabic: 'وُضُوء', transliteration: 'wudu', english: 'Ablution', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-tahara', arabic: 'طَهَارَة', transliteration: 'taharah', english: 'Purification', category: 'word', difficulty: 2, tags: ["prayer"] },
  { id: 'pray-qibla', arabic: 'قِبْلَة', transliteration: 'qiblah', english: 'Direction', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-ruku', arabic: 'رُكُوع', transliteration: 'ruku', english: 'Bowing', category: 'word', difficulty: 2, tags: ["prayer"] },
  { id: 'pray-sujud', arabic: 'سُجُود', transliteration: 'sujud', english: 'Prostration', category: 'word', difficulty: 2, tags: ["prayer"] },
  { id: 'pray-qiyam', arabic: 'قِيَام', transliteration: 'qiyam', english: 'Standing', category: 'word', difficulty: 2, tags: ["prayer"] },
  { id: 'pray-takbir', arabic: 'تَكْبِير', transliteration: 'takbir', english: 'Allahu Akbar', category: 'word', difficulty: 2, tags: ["prayer"] },
  { id: "pray-dua", arabic: "دُعَاء", transliteration: "du'a", english: "Supplication", category: "word", difficulty: 1, tags: ["prayer"] },
  { id: 'pray-dhikr', arabic: 'ذِكْر', transliteration: 'dhikr', english: 'Remembrance', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-tilawa', arabic: 'تِلَاوَة', transliteration: 'tilawah', english: 'Recitation', category: 'word', difficulty: 2, tags: ["prayer"] },
  { id: 'pray-masjid', arabic: 'مَسْجِد', transliteration: 'masjid', english: 'Mosque', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: "pray-jumuah", arabic: "جُمُعَة", transliteration: "jumu'ah", english: "Friday", category: "word", difficulty: 2, tags: ["prayer"] },
  { id: 'pray-fajr', arabic: 'فَجْر', transliteration: 'fajr', english: 'Dawn', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-zuhr', arabic: 'ظُهْر', transliteration: 'zuhr', english: 'Noon', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-asr', arabic: 'عَصْر', transliteration: 'asr', english: 'Afternoon', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-maghrib', arabic: 'مَغْرِب', transliteration: 'maghrib', english: 'Sunset', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-isha', arabic: 'عِشَاء', transliteration: 'isha', english: 'Night', category: 'word', difficulty: 1, tags: ["prayer"] },
  { id: 'pray-zakat', arabic: 'زَكَاة', transliteration: 'zakah', english: 'Charity', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'pray-sadaqa', arabic: 'صَدَقَة', transliteration: 'sadaqah', english: 'Charity', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'pray-sawm', arabic: 'صَوْم', transliteration: 'sawm', english: 'Fasting', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'pray-iftar', arabic: 'إِفْطَار', transliteration: 'iftar', english: 'Breaking fast', category: 'word', difficulty: 2, tags: ["fasting"] },
  { id: 'pray-suhur', arabic: 'سُحُور', transliteration: 'suhur', english: 'Pre-dawn meal', category: 'word', difficulty: 2, tags: ["fasting"] },
  { id: 'pray-hajj', arabic: 'حَجّ', transliteration: 'hajj', english: 'Pilgrimage', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'pray-umra', arabic: 'عُمْرَة', transliteration: 'umrah', english: 'Lesser pilgrimage', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'pray-tawaf', arabic: 'طَوَاف', transliteration: 'tawaf', english: 'Circumambulation', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: "pray-kabah", arabic: "كَعْبَة", transliteration: "ka'bah", english: "The Kaaba", category: "word", difficulty: 1, tags: ["worship"] },
  { id: 'pray-tawba', arabic: 'تَوْبَة', transliteration: 'tawbah', english: 'Repentance', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'pray-istighfar', arabic: 'اسْتِغْفَار', transliteration: 'istighfar', english: 'Seeking forgiveness', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'pray-tasbih', arabic: 'تَسْبِيح', transliteration: 'tasbih', english: 'Glorification', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'pray-tahmid', arabic: 'تَحْمِيد', transliteration: 'tahmid', english: 'Praising Allah', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'pray-ibadat', arabic: 'عِبَادَة', transliteration: 'ibadah', english: 'Worship', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'pray-taqwa', arabic: 'تَقْوَىٰ', transliteration: 'taqwa', english: 'God-consciousness', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'pray-iman', arabic: 'إِيمَان', transliteration: 'iman', english: 'Faith', category: 'word', difficulty: 1, tags: ["faith"] },
  { id: 'pray-islam', arabic: 'إِسْلَام', transliteration: 'islam', english: 'Submission', category: 'word', difficulty: 1, tags: ["faith"] },
  { id: 'pray-ihsan', arabic: 'إِحْسَان', transliteration: 'ihsan', english: 'Excellence', category: 'word', difficulty: 2, tags: ["faith"] },
];

// ============================================
// Nature & Creation
// ============================================
const NATURE_VOCAB: Flashcard[] = [
  { id: 'nat-shams', arabic: 'شَمْس', transliteration: 'shams', english: 'Sun', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-qamar', arabic: 'قَمَر', transliteration: 'qamar', english: 'Moon', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-najm', arabic: 'نَجْم', transliteration: 'najm', english: 'Star', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-sama', arabic: 'سَمَاء', transliteration: 'sama', english: 'Sky', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-ard', arabic: 'أَرْض', transliteration: 'ard', english: 'Earth', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-jabal', arabic: 'جَبَل', transliteration: 'jabal', english: 'Mountain', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-bahr', arabic: 'بَحْر', transliteration: 'bahr', english: 'Sea', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-nahar', arabic: 'نَهَر', transliteration: 'nahar', english: 'River', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-turab', arabic: 'تُرَاب', transliteration: 'turab', english: 'Dust', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-tin', arabic: 'طِين', transliteration: 'tin', english: 'Clay', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: "nat-maa", arabic: "مَاء", transliteration: "ma'", english: "Water", category: "word", difficulty: 1, tags: ["nature"] },
  { id: 'nat-nar', arabic: 'نَار', transliteration: 'nar', english: 'Fire', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-rih', arabic: 'رِيح', transliteration: 'rih', english: 'Wind', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-matar', arabic: 'مَطَر', transliteration: 'matar', english: 'Rain', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-sahab', arabic: 'سَحَاب', transliteration: 'sahab', english: 'Cloud', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-barq', arabic: 'بَرْق', transliteration: 'barq', english: 'Lightning', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: "nat-raad", arabic: "رَعْد", transliteration: "ra'd", english: "Thunder", category: "word", difficulty: 2, tags: ["nature"] },
  { id: 'nat-shajar', arabic: 'شَجَر', transliteration: 'shajar', english: 'Tree', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-nabat', arabic: 'نَبَات', transliteration: 'nabat', english: 'Plant', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-zaytun', arabic: 'زَيْتُون', transliteration: 'zaytun', english: 'Olive', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-nakhl', arabic: 'نَخْل', transliteration: 'nakhl', english: 'Date palm', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-tamr', arabic: 'تَمْر', transliteration: 'tamr', english: 'Dates', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-inab', arabic: 'عِنَب', transliteration: 'inab', english: 'Grapes', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-hayawan', arabic: 'حَيَوَان', transliteration: 'hayawan', english: 'Animal', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-jamal', arabic: 'جَمَل', transliteration: 'jamal', english: 'Camel', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-baqara', arabic: 'بَقَرَة', transliteration: 'baqarah', english: 'Cow', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-ghanam', arabic: 'غَنَم', transliteration: 'ghanam', english: 'Sheep', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-khayil', arabic: 'خَيْل', transliteration: 'khayl', english: 'Horses', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-kalb', arabic: 'كَلْب', transliteration: 'kalb', english: 'Dog', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-fil', arabic: 'فِيل', transliteration: 'fil', english: 'Elephant', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-tayr', arabic: 'طَيْر', transliteration: 'tayr', english: 'Bird', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat-hut', arabic: 'حُوت', transliteration: 'hut', english: 'Whale/Fish', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-nahl', arabic: 'نَحْل', transliteration: 'nahl', english: 'Bee', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-namla', arabic: 'نَمْلَة', transliteration: 'namlah', english: 'Ant', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat-layl', arabic: 'لَيْل', transliteration: 'layl', english: 'Night', category: 'word', difficulty: 1, tags: ["nature", "time"] },
  { id: 'nat-nahar2', arabic: 'نَهَار', transliteration: 'nahar', english: 'Day (time)', category: 'word', difficulty: 1, tags: ["nature", "time"] },
  { id: 'nat-subh', arabic: 'صُبْح', transliteration: 'subh', english: 'Morning', category: 'word', difficulty: 1, tags: ["nature", "time"] },
  { id: 'nat-fajr', arabic: 'فَجْر', transliteration: 'fajr', english: 'Dawn', category: 'word', difficulty: 1, tags: ["nature", "time"] },
];

// ============================================
// Day of Judgment
// ============================================
const JUDGMENT_VOCAB: Flashcard[] = [
  { id: 'jdg-qiyama', arabic: 'قِيَامَة', transliteration: 'qiyamah', english: 'Resurrection', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-yawm', arabic: 'يَوْمُ الدِّين', transliteration: 'yawm ad-din', english: 'Day of Judgment', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: "jdg-saa", arabic: "السَّاعَة", transliteration: "as-sa'ah", english: "The Hour", category: "word", difficulty: 1, tags: ["judgment"] },
  { id: "jdg-bath", arabic: "بَعْث", transliteration: "ba'th", english: "Resurrection", category: "word", difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-hashr', arabic: 'حَشْر', transliteration: 'hashr', english: 'Gathering', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-hisab', arabic: 'حِسَاب', transliteration: 'hisab', english: 'Reckoning', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-mizan', arabic: 'مِيزَان', transliteration: 'mizan', english: 'Scale', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-sirat', arabic: 'صِرَاط', transliteration: 'sirat', english: 'Bridge', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: "jdg-shafaa", arabic: "شَفَاعَة", transliteration: "shafa'ah", english: "Intercession", category: "word", difficulty: 3, tags: ["judgment"] },
  { id: 'jdg-kitab', arabic: 'كِتَاب', transliteration: 'kitab', english: 'Record', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-jannah', arabic: 'جَنَّة', transliteration: 'jannah', english: 'Paradise', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-firdaws', arabic: 'فِرْدَوْس', transliteration: 'firdaws', english: 'Highest Paradise', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: "jdg-naim", arabic: "نَعِيم", transliteration: "na'im", english: "Bliss", category: "word", difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-khuld', arabic: 'خُلْد', transliteration: 'khuld', english: 'Eternity', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-nar', arabic: 'نَار', transliteration: 'nar', english: 'Fire (Hell)', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-jahannam', arabic: 'جَهَنَّم', transliteration: 'jahannam', english: 'Hell', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: "jdg-sair", arabic: "سَعِير", transliteration: "sa'ir", english: "Blazing Fire", category: "word", difficulty: 3, tags: ["judgment"] },
  { id: 'jdg-jahim', arabic: 'جَحِيم', transliteration: 'jahim', english: 'Hellfire', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg-adhab', arabic: 'عَذَاب', transliteration: 'adhab', english: 'Punishment', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-malak', arabic: 'مَلَك', transliteration: 'malak', english: 'Angel', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: "jdg-malaika", arabic: "مَلَائِكَة", transliteration: "mala'ikah", english: "Angels", category: "word", difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-jibril', arabic: 'جِبْرِيل', transliteration: 'jibril', english: 'Gabriel', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-shaytan', arabic: 'شَيْطَان', transliteration: 'shaytan', english: 'Satan', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-iblis', arabic: 'إِبْلِيس', transliteration: 'iblis', english: 'Iblis', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-jinn', arabic: 'جِنّ', transliteration: 'jinn', english: 'Jinn', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-hasana', arabic: 'حَسَنَة', transliteration: 'hasanah', english: 'Good deed', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: "jdg-sayyia", arabic: "سَيِّئَة", transliteration: "sayyi'ah", english: "Bad deed", category: "word", difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-thawab', arabic: 'ثَوَاب', transliteration: 'thawab', english: 'Reward', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-ajr', arabic: 'أَجْر', transliteration: 'ajr', english: 'Reward', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg-iqab', arabic: 'عِقَاب', transliteration: 'iqab', english: 'Punishment', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-fawz', arabic: 'فَوْز', transliteration: 'fawz', english: 'Success', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg-khusr', arabic: 'خُسْر', transliteration: 'khusr', english: 'Loss', category: 'word', difficulty: 2, tags: ["judgment"] },
];

// ============================================
// Prophets & Stories
// ============================================
const PROPHETS_VOCAB: Flashcard[] = [
  { id: 'proph-muhammad', arabic: 'مُحَمَّد', transliteration: 'Muhammad', english: 'Muhammad (pbuh)', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-adam', arabic: 'آدَم', transliteration: 'Adam', english: 'Adam', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-nuh', arabic: 'نُوح', transliteration: 'Nuh', english: 'Noah', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-ibrahim', arabic: 'إِبْرَاهِيم', transliteration: 'Ibrahim', english: 'Abraham', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: "proph-ismail", arabic: "إِسْمَاعِيل", transliteration: "Isma'il", english: "Ishmael", category: "word", difficulty: 1, tags: ["prophet"] },
  { id: 'proph-ishaq', arabic: 'إِسْحَاق', transliteration: 'Ishaq', english: 'Isaac', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: "proph-yaqub", arabic: "يَعْقُوب", transliteration: "Ya'qub", english: "Jacob", category: "word", difficulty: 1, tags: ["prophet"] },
  { id: 'proph-yusuf', arabic: 'يُوسُف', transliteration: 'Yusuf', english: 'Joseph', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-musa', arabic: 'مُوسَىٰ', transliteration: 'Musa', english: 'Moses', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-harun', arabic: 'هَارُون', transliteration: 'Harun', english: 'Aaron', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-dawud', arabic: 'دَاوُود', transliteration: 'Dawud', english: 'David', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-sulayman', arabic: 'سُلَيْمَان', transliteration: 'Sulayman', english: 'Solomon', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-ayyub', arabic: 'أَيُّوب', transliteration: 'Ayyub', english: 'Job', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-yunus', arabic: 'يُونُس', transliteration: 'Yunus', english: 'Jonah', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-zakariyya', arabic: 'زَكَرِيَّا', transliteration: 'Zakariyya', english: 'Zechariah', category: 'word', difficulty: 2, tags: ["prophet"] },
  { id: 'proph-yahya', arabic: 'يَحْيَىٰ', transliteration: 'Yahya', english: 'John', category: 'word', difficulty: 2, tags: ["prophet"] },
  { id: 'proph-isa', arabic: 'عِيسَىٰ', transliteration: 'Isa', english: 'Jesus', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-hud', arabic: 'هُود', transliteration: 'Hud', english: 'Hud', category: 'word', difficulty: 2, tags: ["prophet"] },
  { id: 'proph-salih', arabic: 'صَالِح', transliteration: 'Salih', english: 'Salih', category: 'word', difficulty: 2, tags: ["prophet"] },
  { id: "proph-shuayb", arabic: "شُعَيْب", transliteration: "Shu'ayb", english: "Shuayb", category: "word", difficulty: 2, tags: ["prophet"] },
  { id: 'proph-lut', arabic: 'لُوط', transliteration: 'Lut', english: 'Lot', category: 'word', difficulty: 1, tags: ["prophet"] },
  { id: 'proph-idris', arabic: 'إِدْرِيس', transliteration: 'Idris', english: 'Enoch', category: 'word', difficulty: 2, tags: ["prophet"] },
  { id: 'proph-maryam', arabic: 'مَرْيَم', transliteration: 'Maryam', english: 'Mary', category: 'word', difficulty: 1, tags: ["figure"] },
  { id: "proph-firawn", arabic: "فِرْعَوْن", transliteration: "Fir'awn", english: "Pharaoh", category: "word", difficulty: 1, tags: ["figure"] },
  { id: 'proph-luqman', arabic: 'لُقْمَان', transliteration: 'Luqman', english: 'Luqman', category: 'word', difficulty: 2, tags: ["figure"] },
  { id: 'proph-nabi', arabic: 'نَبِيّ', transliteration: 'nabi', english: 'Prophet', category: 'word', difficulty: 1, tags: ["term"] },
  { id: 'proph-rasul', arabic: 'رَسُول', transliteration: 'rasul', english: 'Messenger', category: 'word', difficulty: 1, tags: ["term"] },
  { id: 'proph-wahy', arabic: 'وَحْي', transliteration: 'wahy', english: 'Revelation', category: 'word', difficulty: 2, tags: ["term"] },
  { id: "proph-mujiza", arabic: "مُعْجِزَة", transliteration: "mu'jizah", english: "Miracle", category: "word", difficulty: 2, tags: ["term"] },
  { id: 'proph-qissa', arabic: 'قِصَّة', transliteration: 'qissah', english: 'Story', category: 'word', difficulty: 1, tags: ["term"] },
  { id: 'proph-umma', arabic: 'أُمَّة', transliteration: 'ummah', english: 'Nation', category: 'word', difficulty: 1, tags: ["term"] },
  { id: "proph-quran", arabic: "قُرْآن", transliteration: "Qur'an", english: "Quran", category: "word", difficulty: 1, tags: ["scripture"] },
  { id: 'proph-tawrat', arabic: 'تَوْرَاة', transliteration: 'Tawrah', english: 'Torah', category: 'word', difficulty: 2, tags: ["scripture"] },
  { id: 'proph-injil', arabic: 'إِنْجِيل', transliteration: 'Injil', english: 'Gospel', category: 'word', difficulty: 2, tags: ["scripture"] },
  { id: 'proph-zabur', arabic: 'زَبُور', transliteration: 'Zabur', english: 'Psalms', category: 'word', difficulty: 2, tags: ["scripture"] },
  { id: 'proph-makka', arabic: 'مَكَّة', transliteration: 'Makkah', english: 'Mecca', category: 'word', difficulty: 1, tags: ["place"] },
  { id: 'proph-madina', arabic: 'الْمَدِينَة', transliteration: 'al-Madinah', english: 'Medina', category: 'word', difficulty: 1, tags: ["place"] },
  { id: 'proph-misr', arabic: 'مِصْر', transliteration: 'Misr', english: 'Egypt', category: 'word', difficulty: 1, tags: ["place"] },
];

// ============================================
// Tajweed Rules
// ============================================
const TAJWEED_RULES: Flashcard[] = [
  { id: 'rule-izhar', arabic: 'إِظْهَار', transliteration: 'Izhar', english: 'Clear pronunciation', category: 'rule', difficulty: 2, tags: ['tajweed'] },
  { id: 'rule-idgham', arabic: 'إِدْغَام', transliteration: 'Idgham', english: 'Merging', category: 'rule', difficulty: 3, tags: ['tajweed'] },
  { id: 'rule-iqlab', arabic: 'إِقْلَاب', transliteration: 'Iqlab', english: 'Conversion', category: 'rule', difficulty: 3, tags: ['tajweed'] },
  { id: 'rule-ikhfa', arabic: 'إِخْفَاء', transliteration: 'Ikhfa', english: 'Hiding', category: 'rule', difficulty: 3, tags: ['tajweed'] },
  { id: 'rule-ghunnah', arabic: 'غُنَّة', transliteration: 'Ghunnah', english: 'Nasalization', category: 'rule', difficulty: 2, tags: ['tajweed'] },
  { id: 'rule-madd', arabic: 'مَدّ', transliteration: 'Madd', english: 'Elongation', category: 'rule', difficulty: 2, tags: ['tajweed'] },
  { id: 'rule-qalqalah', arabic: 'قَلْقَلَة', transliteration: 'Qalqalah', english: 'Echoing bounce', category: 'rule', difficulty: 3, tags: ['tajweed'] },
];


// ============================================
// Additional Nouns
// ============================================
const ADDITIONAL_NOUNS: Flashcard[] = [
  { id: 'add-insan', arabic: 'إِنْسَان', transliteration: 'insan', english: 'Human being', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-rajul', arabic: 'رَجُل', transliteration: 'rajul', english: 'Man', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: "add-imraa", arabic: "امْرَأَة", transliteration: "imra'ah", english: "Woman", category: "word", difficulty: 1, tags: ["noun"] },
  { id: 'add-walad', arabic: 'وَلَد', transliteration: 'walad', english: 'Child', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-ibn', arabic: 'ابْن', transliteration: 'ibn', english: 'Son', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-bint', arabic: 'بِنْت', transliteration: 'bint', english: 'Daughter', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-ab', arabic: 'أَب', transliteration: 'ab', english: 'Father', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-umm', arabic: 'أُمّ', transliteration: 'umm', english: 'Mother', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-akh', arabic: 'أَخ', transliteration: 'akh', english: 'Brother', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-ukht', arabic: 'أُخْت', transliteration: 'ukht', english: 'Sister', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-zawj', arabic: 'زَوْج', transliteration: 'zawj', english: 'Husband/Spouse', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-zawja', arabic: 'زَوْجَة', transliteration: 'zawjah', english: 'Wife', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: "add-ras", arabic: "رَأْس", transliteration: "ra's", english: "Head", category: "word", difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-udhn', arabic: 'أُذُن', transliteration: 'udhun', english: 'Ear', category: 'word', difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-anf', arabic: 'أَنْف', transliteration: 'anf', english: 'Nose', category: 'word', difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-fam', arabic: 'فَم', transliteration: 'fam', english: 'Mouth', category: 'word', difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-lisan', arabic: 'لِسَان', transliteration: 'lisan', english: 'Tongue', category: 'word', difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-sadr', arabic: 'صَدْر', transliteration: 'sadr', english: 'Chest', category: 'word', difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-batn', arabic: 'بَطْن', transliteration: 'batn', english: 'Stomach', category: 'word', difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-rijl', arabic: 'رِجْل', transliteration: 'rijl', english: 'Foot/Leg', category: 'word', difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-jild', arabic: 'جِلْد', transliteration: 'jild', english: 'Skin', category: 'word', difficulty: 2, tags: ["noun", "body"] },
  { id: 'add-dam', arabic: 'دَم', transliteration: 'dam', english: 'Blood', category: 'word', difficulty: 1, tags: ["noun", "body"] },
  { id: 'add-ruh', arabic: 'رُوح', transliteration: 'ruh', english: 'Spirit', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-aql', arabic: 'عَقْل', transliteration: 'aql', english: 'Mind', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-hubb', arabic: 'حُبّ', transliteration: 'hubb', english: 'Love', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-khawf', arabic: 'خَوْف', transliteration: 'khawf', english: 'Fear', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-raja2', arabic: 'رَجَاء', transliteration: 'raja', english: 'Hope', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-huzn', arabic: 'حُزْن', transliteration: 'huzn', english: 'Sadness', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-farah', arabic: 'فَرَح', transliteration: 'farah', english: 'Joy', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-ghadab', arabic: 'غَضَب', transliteration: 'ghadab', english: 'Anger', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-salam2', arabic: 'سَلَام', transliteration: 'salam', english: 'Peace', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-harb', arabic: 'حَرْب', transliteration: 'harb', english: 'War', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-jihad', arabic: 'جِهَاد', transliteration: 'jihad', english: 'Struggle', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-nasr2', arabic: 'نَصْر', transliteration: 'nasr', english: 'Victory', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-adl', arabic: 'عَدْل', transliteration: 'adl', english: 'Justice', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-zulm', arabic: 'ظُلْم', transliteration: 'zulm', english: 'Oppression', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-sidq', arabic: 'صِدْق', transliteration: 'sidq', english: 'Truth', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-kadhib', arabic: 'كَذِب', transliteration: 'kadhib', english: 'Lying', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-amanah', arabic: 'أَمَانَة', transliteration: 'amanah', english: 'Trust', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-waqt', arabic: 'وَقْت', transliteration: 'waqt', english: 'Time', category: 'word', difficulty: 1, tags: ["noun", "time"] },
  { id: 'add-sana', arabic: 'سَنَة', transliteration: 'sanah', english: 'Year', category: 'word', difficulty: 1, tags: ["noun", "time"] },
  { id: 'add-shahr', arabic: 'شَهْر', transliteration: 'shahr', english: 'Month', category: 'word', difficulty: 1, tags: ["noun", "time"] },
  { id: "add-saa", arabic: "سَاعَة", transliteration: "sa'ah", english: "Hour", category: "word", difficulty: 1, tags: ["noun", "time"] },
  { id: 'add-abad', arabic: 'أَبَد', transliteration: 'abad', english: 'Eternity', category: 'word', difficulty: 2, tags: ["noun", "time"] },
  { id: 'add-makan', arabic: 'مَكَان', transliteration: 'makan', english: 'Place', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-madinah', arabic: 'مَدِينَة', transliteration: 'madinah', english: 'City', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-qarya', arabic: 'قَرْيَة', transliteration: 'qaryah', english: 'Village', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-tariq', arabic: 'طَرِيق', transliteration: 'tariq', english: 'Road', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-bab', arabic: 'بَاب', transliteration: 'bab', english: 'Door', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-yamin', arabic: 'يَمِين', transliteration: 'yamin', english: 'Right', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-shimal', arabic: 'شِمَال', transliteration: 'shimal', english: 'Left', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-qaum', arabic: 'قَوْم', transliteration: 'qawm', english: 'People', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-ahlu', arabic: 'أَهْل', transliteration: 'ahl', english: 'Family/People', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-walid', arabic: 'وَالِد', transliteration: 'walid', english: 'Parent', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-jad', arabic: 'جَدّ', transliteration: 'jadd', english: 'Grandfather', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-jadda', arabic: 'جَدَّة', transliteration: 'jaddah', english: 'Grandmother', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-amm', arabic: 'عَمّ', transliteration: 'amm', english: 'Uncle (paternal)', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-khal', arabic: 'خَال', transliteration: 'khal', english: 'Uncle (maternal)', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-rafiq', arabic: 'رَفِيق', transliteration: 'rafiq', english: 'Companion', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-sadiq', arabic: 'صَدِيق', transliteration: 'sadiq', english: 'Friend', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-aduww', arabic: 'عَدُوّ', transliteration: 'aduww', english: 'Enemy', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-malik2', arabic: 'مَلِك', transliteration: 'malik', english: 'King', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-amir', arabic: 'أَمِير', transliteration: 'amir', english: 'Prince/Leader', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-sultan2', arabic: 'سُلْطَان', transliteration: 'sultan', english: 'Authority', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-hakim2', arabic: 'حَاكِم', transliteration: 'hakim', english: 'Ruler', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-qadi', arabic: 'قَاضِي', transliteration: 'qadi', english: 'Judge', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-shahid', arabic: 'شَاهِد', transliteration: 'shahid', english: 'Witness', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-alim2', arabic: 'عَالِم', transliteration: 'alim', english: 'Scholar', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-jahil', arabic: 'جَاهِل', transliteration: 'jahil', english: 'Ignorant', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-faqir', arabic: 'فَقِير', transliteration: 'faqir', english: 'Poor', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-ghani', arabic: 'غَنِيّ', transliteration: 'ghani', english: 'Rich', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-sayf', arabic: 'سَيْف', transliteration: 'sayf', english: 'Sword', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-quwa', arabic: 'قُوَّة', transliteration: 'quwwah', english: 'Power', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-daraja', arabic: 'دَرَجَة', transliteration: 'darajah', english: 'Degree/Level', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-mathalu', arabic: 'مَثَل', transliteration: 'mathal', english: 'Example', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-hikma', arabic: 'حِكْمَة', transliteration: 'hikmah', english: 'Wisdom', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-fikr', arabic: 'فِكْر', transliteration: 'fikr', english: 'Thought', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: "add-ray", arabic: "رَأْي", transliteration: "ra'y", english: "Opinion", category: "word", difficulty: 2, tags: ["noun"] },
  { id: 'add-kalam', arabic: 'كَلَام', transliteration: 'kalam', english: 'Speech', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-lugha', arabic: 'لُغَة', transliteration: 'lughah', english: 'Language', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-surah', arabic: 'سُورَة', transliteration: 'surah', english: 'Chapter', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-ayat2', arabic: 'آيَات', transliteration: 'ayat', english: 'Verses', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'add-hukm', arabic: 'حُكْم', transliteration: 'hukm', english: 'Ruling', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: "add-shariah", arabic: "شَرِيعَة", transliteration: "shari'ah", english: "Law", category: "word", difficulty: 2, tags: ["noun"] },
  { id: 'add-sunnah', arabic: 'سُنَّة', transliteration: 'sunnah', english: 'Way/Tradition', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-hadith', arabic: 'حَدِيث', transliteration: 'hadith', english: 'Narration', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'add-tafsir', arabic: 'تَفْسِير', transliteration: 'tafsir', english: 'Interpretation', category: 'word', difficulty: 3, tags: ["noun"] },
  { id: 'add-fiqh', arabic: 'فِقْه', transliteration: 'fiqh', english: 'Jurisprudence', category: 'word', difficulty: 3, tags: ["noun"] },
  { id: 'add-aqida', arabic: 'عَقِيدَة', transliteration: 'aqidah', english: 'Creed', category: 'word', difficulty: 3, tags: ["noun"] },
  { id: 'add-shahada', arabic: 'شَهَادَة', transliteration: 'shahadah', english: 'Testimony', category: 'word', difficulty: 2, tags: ["noun"] },
];

// ============================================
// Additional Verbs
// ============================================
const ADDITIONAL_VERBS: Flashcard[] = [
  { id: 'verb-ahaba', arabic: 'أَحَبَّ', transliteration: 'ahabba', english: 'He loved', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-kariha', arabic: 'كَرِهَ', transliteration: 'kariha', english: 'He hated', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-fariha', arabic: 'فَرِحَ', transliteration: 'fariha', english: 'He rejoiced', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-hazina', arabic: 'حَزِنَ', transliteration: 'hazina', english: 'He grieved', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-daaa", arabic: "دَعَا", transliteration: "da'a", english: "He called", category: "word", difficulty: 1, tags: ["verb"] },
  { id: 'verb-istajaba', arabic: 'اسْتَجَابَ', transliteration: 'istajaba', english: 'He responded', category: 'word', difficulty: 3, tags: ["verb"] },
  { id: 'verb-salama', arabic: 'سَلَّمَ', transliteration: 'sallama', english: 'He greeted', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-baraaka', arabic: 'بَارَكَ', transliteration: 'baraka', english: 'He blessed', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-nadhara', arabic: 'نَذَرَ', transliteration: 'nadhara', english: 'He vowed', category: 'word', difficulty: 3, tags: ["verb"] },
  { id: 'verb-kasaba', arabic: 'كَسَبَ', transliteration: 'kasaba', english: 'He earned', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-anfaqa', arabic: 'أَنْفَقَ', transliteration: 'anfaqa', english: 'He spent', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-ata", arabic: "أَعْطَى", transliteration: "a'ta", english: "He gave", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'verb-akala', arabic: 'أَكَلَ', transliteration: 'akala', english: 'He ate', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-shariba', arabic: 'شَرِبَ', transliteration: 'shariba', english: 'He drank', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-nama', arabic: 'نَامَ', transliteration: 'nama', english: 'He slept', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-jalasa', arabic: 'جَلَسَ', transliteration: 'jalasa', english: 'He sat', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-qama', arabic: 'قَامَ', transliteration: 'qama', english: 'He stood', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-masha', arabic: 'مَشَى', transliteration: 'masha', english: 'He walked', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'verb-rakiba', arabic: 'رَكِبَ', transliteration: 'rakiba', english: 'He rode', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-sakana', arabic: 'سَكَنَ', transliteration: 'sakana', english: 'He dwelt', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-banaa', arabic: 'بَنَى', transliteration: 'bana', english: 'He built', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-hadama', arabic: 'هَدَمَ', transliteration: 'hadama', english: 'He destroyed', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-fath', arabic: 'فَتَّحَ', transliteration: 'fattaha', english: 'He opened wide', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-akhfa', arabic: 'أَخْفَى', transliteration: 'akhfa', english: 'He hid', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-azhara', arabic: 'أَظْهَرَ', transliteration: 'azhara', english: 'He showed', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-waqafa', arabic: 'وَقَفَ', transliteration: 'waqafa', english: 'He stopped', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-jara', arabic: 'جَرَى', transliteration: 'jara', english: 'He ran', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-tara', arabic: 'طَارَ', transliteration: 'tara', english: 'He flew', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-sabaha', arabic: 'سَبَحَ', transliteration: 'sabaha', english: 'He swam', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-qadda", arabic: "قَطَعَ", transliteration: "qata'a", english: "He cut", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'verb-wasal', arabic: 'وَصَلَ', transliteration: 'wasala', english: 'He arrived', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-farraqa', arabic: 'فَرَّقَ', transliteration: 'farraqa', english: 'He separated', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-jamaa", arabic: "جَمَعَ", transliteration: "jama'a", english: "He gathered", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'verb-qassama', arabic: 'قَسَّمَ', transliteration: 'qassama', english: 'He divided', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-aslaha', arabic: 'أَصْلَحَ', transliteration: 'aslaha', english: 'He reformed', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-afsada', arabic: 'أَفْسَدَ', transliteration: 'afsada', english: 'He corrupted', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-ahya', arabic: 'أَحْيَا', transliteration: 'ahya', english: 'He gave life', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-amata', arabic: 'أَمَاتَ', transliteration: 'amata', english: 'He caused death', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-shafa', arabic: 'شَفَى', transliteration: 'shafa', english: 'He healed', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-marida', arabic: 'مَرِضَ', transliteration: 'marida', english: 'He became sick', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-ataa", arabic: "أَطَاعَ", transliteration: "ata'a", english: "He obeyed", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'verb-asa', arabic: 'عَصَى', transliteration: 'asa', english: 'He disobeyed', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-sadaqa', arabic: 'صَدَقَ', transliteration: 'sadaqa', english: 'He was truthful', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-kadhaba', arabic: 'كَذَبَ', transliteration: 'kadhaba', english: 'He lied', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-waada", arabic: "وَعَدَ", transliteration: "wa'ada", english: "He promised", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'verb-ahsana', arabic: 'أَحْسَنَ', transliteration: 'ahsana', english: 'He did good', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-asaa", arabic: "أَسَاءَ", transliteration: "asa'a", english: "He did evil", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'verb-zalama', arabic: 'ظَلَمَ', transliteration: 'zalama', english: 'He wronged', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-adala', arabic: 'عَدَلَ', transliteration: 'adala', english: 'He was just', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-ittaqa', arabic: 'اتَّقَى', transliteration: 'ittaqa', english: 'He feared (Allah)', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-istaghfara', arabic: 'اسْتَغْفَرَ', transliteration: 'istaghfara', english: 'He sought forgiveness', category: 'word', difficulty: 3, tags: ["verb"] },
  { id: 'verb-aslama', arabic: 'أَسْلَمَ', transliteration: 'aslama', english: 'He submitted', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-sajada', arabic: 'سَجَدَ', transliteration: 'sajada', english: 'He prostrated', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "verb-rakaa", arabic: "رَكَعَ", transliteration: "raka'a", english: "He bowed", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'verb-sabbaha', arabic: 'سَبَّحَ', transliteration: 'sabbaha', english: 'He glorified', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-hamida', arabic: 'حَمِدَ', transliteration: 'hamida', english: 'He praised', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-kallama', arabic: 'كَلَّمَ', transliteration: 'kallama', english: 'He spoke to', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-bashhara', arabic: 'بَشَّرَ', transliteration: 'bashshara', english: 'He gave good news', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'verb-andhara', arabic: 'أَنْذَرَ', transliteration: 'andhara', english: 'He warned', category: 'word', difficulty: 2, tags: ["verb"] },
];

// ============================================
// Adjectives
// ============================================
const ADJECTIVES: Flashcard[] = [
  { id: 'adj-jadid', arabic: 'جَدِيد', transliteration: 'jadid', english: 'New', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-qadim', arabic: 'قَدِيم', transliteration: 'qadim', english: 'Old', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-jamil', arabic: 'جَمِيل', transliteration: 'jamil', english: 'Beautiful', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-qabih', arabic: 'قَبِيح', transliteration: 'qabih', english: 'Ugly', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-sahl', arabic: 'سَهْل', transliteration: 'sahl', english: 'Easy', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: "adj-saab", arabic: "صَعْب", transliteration: "sa'b", english: "Difficult", category: "word", difficulty: 2, tags: ["adjective"] },
  { id: 'adj-qawiy', arabic: 'قَوِيّ', transliteration: 'qawiyy', english: 'Strong', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: "adj-daif", arabic: "ضَعِيف", transliteration: "da'if", english: "Weak", category: "word", difficulty: 1, tags: ["adjective"] },
  { id: 'adj-tawil', arabic: 'طَوِيل', transliteration: 'tawil', english: 'Long/Tall', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-qasir', arabic: 'قَصِير', transliteration: 'qasir', english: 'Short', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: "adj-wasi", arabic: "وَاسِع", transliteration: "wasi'", english: "Wide", category: "word", difficulty: 2, tags: ["adjective"] },
  { id: 'adj-dayyiq', arabic: 'ضَيِّق', transliteration: 'dayyiq', english: 'Narrow', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-bard', arabic: 'بَارِد', transliteration: 'barid', english: 'Cold', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-harr', arabic: 'حَارّ', transliteration: 'harr', english: 'Hot', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-ratb', arabic: 'رَطْب', transliteration: 'ratb', english: 'Wet', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-jabis', arabic: 'يَابِس', transliteration: 'yabis', english: 'Dry', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-hafif', arabic: 'خَفِيف', transliteration: 'khafif', english: 'Light', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-thaqil', arabic: 'ثَقِيل', transliteration: 'thaqil', english: 'Heavy', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-naqi', arabic: 'نَقِيّ', transliteration: 'naqiyy', english: 'Pure', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-wasi', arabic: 'نَجِس', transliteration: 'najis', english: 'Impure', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-tayyib', arabic: 'طَيِّب', transliteration: 'tayyib', english: 'Good/Pure', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-khabith', arabic: 'خَبِيث', transliteration: 'khabith', english: 'Evil', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-halal', arabic: 'حَلَال', transliteration: 'halal', english: 'Lawful', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-haram', arabic: 'حَرَام', transliteration: 'haram', english: 'Forbidden', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-wajib', arabic: 'وَاجِب', transliteration: 'wajib', english: 'Obligatory', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-mustahab', arabic: 'مُسْتَحَبّ', transliteration: 'mustahabb', english: 'Recommended', category: 'word', difficulty: 3, tags: ["adjective"] },
  { id: 'adj-mubah', arabic: 'مُبَاح', transliteration: 'mubah', english: 'Permissible', category: 'word', difficulty: 3, tags: ["adjective"] },
  { id: 'adj-makruh', arabic: 'مَكْرُوه', transliteration: 'makruh', english: 'Disliked', category: 'word', difficulty: 3, tags: ["adjective"] },
  { id: "adj-saadi", arabic: "سَعِيد", transliteration: "sa'id", english: "Happy", category: "word", difficulty: 2, tags: ["adjective"] },
  { id: 'adj-shaqi', arabic: 'شَقِيّ', transliteration: 'shaqiyy', english: 'Wretched', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-muslim2', arabic: 'مُسْلِم', transliteration: 'muslim', english: 'Muslim', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-kafir2', arabic: 'كَافِر', transliteration: 'kafir', english: 'Disbeliever', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: "adj-mumin2", arabic: "مُؤْمِن", transliteration: "mu'min", english: "Believer", category: "word", difficulty: 1, tags: ["adjective"] },
  { id: 'adj-munafiq2', arabic: 'مُنَافِق', transliteration: 'munafiq', english: 'Hypocrite', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-hayy', arabic: 'حَيّ', transliteration: 'hayy', english: 'Alive', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-mayyit', arabic: 'مَيِّت', transliteration: 'mayyit', english: 'Dead', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-akhir2', arabic: 'آخِر', transliteration: 'akhir', english: 'Last', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-awwal', arabic: 'أَوَّل', transliteration: 'awwal', english: 'First', category: 'word', difficulty: 1, tags: ["adjective"] },
  { id: 'adj-zahir', arabic: 'ظَاهِر', transliteration: 'zahir', english: 'Apparent', category: 'word', difficulty: 2, tags: ["adjective"] },
  { id: 'adj-batin2', arabic: 'بَاطِن', transliteration: 'batin', english: 'Hidden', category: 'word', difficulty: 2, tags: ["adjective"] },
];

// ============================================
// More Nature & Creation
// ============================================
const MORE_NATURE: Flashcard[] = [
  { id: 'nat2-sama2', arabic: 'سَمَاوَات', transliteration: 'samawat', english: 'Heavens (pl)', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat2-ardin', arabic: 'أَرَضِين', transliteration: 'aradin', english: 'Earths', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-buruj', arabic: 'بُرُوج', transliteration: 'buruj', english: 'Constellations', category: 'word', difficulty: 3, tags: ["nature"] },
  { id: 'nat2-falak', arabic: 'فَلَك', transliteration: 'falak', english: 'Orbit', category: 'word', difficulty: 3, tags: ["nature"] },
  { id: 'nat2-ghayb', arabic: 'غَيْب', transliteration: 'ghayb', english: 'Unseen', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-malakut', arabic: 'مَلَكُوت', transliteration: 'malakut', english: 'Kingdom', category: 'word', difficulty: 3, tags: ["nature"] },
  { id: 'nat2-khalq', arabic: 'خَلْق', transliteration: 'khalq', english: 'Creation', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: 'nat2-fitrah', arabic: 'فِطْرَة', transliteration: 'fitrah', english: 'Natural state', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-thabir', arabic: 'ثَمَر', transliteration: 'thamar', english: 'Fruit', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-habb', arabic: 'حَبّ', transliteration: 'habb', english: 'Grain', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-waraq', arabic: 'وَرَق', transliteration: 'waraq', english: 'Leaf', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-zahra', arabic: 'زَهْرَة', transliteration: 'zahrah', english: 'Flower', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-hadid', arabic: 'حَدِيد', transliteration: 'hadid', english: 'Iron', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-dhahab', arabic: 'ذَهَب', transliteration: 'dhahab', english: 'Gold', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-fidda', arabic: 'فِضَّة', transliteration: 'fiddah', english: 'Silver', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-asbab', arabic: 'أَسْبَاب', transliteration: 'asbab', english: 'Means/Causes', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-asad', arabic: 'أَسَد', transliteration: 'asad', english: 'Lion', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: "nat2-dhiab", arabic: "ذِئْب", transliteration: "dhi'b", english: "Wolf", category: "word", difficulty: 2, tags: ["nature"] },
  { id: 'nat2-ghuraab', arabic: 'غُرَاب', transliteration: 'ghurab', english: 'Crow', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-hudhud', arabic: 'هُدْهُد', transliteration: 'hudhud', english: 'Hoopoe', category: 'word', difficulty: 3, tags: ["nature"] },
  { id: 'nat2-barud', arabic: 'بَرَد', transliteration: 'barad', english: 'Hail', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'nat2-thalj', arabic: 'ثَلْج', transliteration: 'thalj', english: 'Snow', category: 'word', difficulty: 2, tags: ["nature"] },
];

// ============================================
// More Day of Judgment
// ============================================
const MORE_JUDGMENT: Flashcard[] = [
  { id: 'jdg2-arsh', arabic: 'عَرْش', transliteration: 'arsh', english: 'Throne', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-kursi', arabic: 'كُرْسِيّ', transliteration: 'kursi', english: 'Footstool', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-lawh', arabic: 'لَوْح', transliteration: 'lawh', english: 'Tablet', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-qalam', arabic: 'قَلَم', transliteration: 'qalam', english: 'Pen', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-jannat', arabic: 'جَنَّات', transliteration: 'jannat', english: 'Gardens (pl)', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg2-nahar3', arabic: 'أَنْهَار', transliteration: 'anhar', english: 'Rivers (pl)', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg2-qasr', arabic: 'قَصْر', transliteration: 'qasr', english: 'Palace', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-harir', arabic: 'حَرِير', transliteration: 'harir', english: 'Silk', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-istabraq', arabic: 'إِسْتَبْرَق', transliteration: 'istabraq', english: 'Brocade', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg2-aniya', arabic: 'آنِيَة', transliteration: 'aniyah', english: 'Vessels', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: "jdg2-ka's", arabic: "كَأْس", transliteration: "ka's", english: "Cup", category: "word", difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-ridwan', arabic: 'رِضْوَان', transliteration: 'ridwan', english: 'Pleasure', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-jahanam', arabic: 'جَهَنَّم', transliteration: 'jahannam', english: 'Hell', category: 'word', difficulty: 1, tags: ["judgment"] },
  { id: 'jdg2-sakar', arabic: 'سَقَر', transliteration: 'saqar', english: 'Scorching fire', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg2-hawiya', arabic: 'هَاوِيَة', transliteration: 'hawiyah', english: 'Abyss', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg2-hamim', arabic: 'حَمِيم', transliteration: 'hamim', english: 'Scalding water', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg2-ghassaq', arabic: 'غَسَّاق', transliteration: 'ghassaq', english: 'Intensely cold', category: 'word', difficulty: 4, tags: ["judgment"] },
  { id: 'jdg2-zaqqum', arabic: 'زَقُّوم', transliteration: 'zaqqum', english: 'Zaqqum tree', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg2-silsila', arabic: 'سِلْسِلَة', transliteration: 'silsilah', english: 'Chain', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg2-yawm2', arabic: 'يَوْمُ الْحَشْر', transliteration: 'yawm al-hashr', english: 'Day of Gathering', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-yawm3', arabic: 'يَوْمُ الْحِسَاب', transliteration: 'yawm al-hisab', english: 'Day of Account', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: "jdg2-yawm4", arabic: "يَوْمُ الْبَعْث", transliteration: "yawm al-ba'th", english: "Day of Resurrection", category: "word", difficulty: 2, tags: ["judgment"] },
  { id: "jdg2-mikail", arabic: "مِيكَائِيل", transliteration: "Mika'il", english: "Michael", category: "word", difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-israfil', arabic: 'إِسْرَافِيل', transliteration: 'Israfil', english: 'Israfil', category: 'word', difficulty: 2, tags: ["judgment"] },
  { id: 'jdg2-munkar', arabic: 'مُنْكَر', transliteration: 'Munkar', english: 'Munkar (angel)', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg2-nakir', arabic: 'نَكِير', transliteration: 'Nakir', english: 'Nakir (angel)', category: 'word', difficulty: 3, tags: ["judgment"] },
  { id: 'jdg2-malik3', arabic: 'مَالِك', transliteration: 'Malik', english: 'Malik (angel)', category: 'word', difficulty: 2, tags: ["judgment"] },
];

// ============================================
// More Prophets & Stories
// ============================================
const MORE_PROPHETS: Flashcard[] = [
  { id: 'proph2-ashab', arabic: 'أَصْحَاب', transliteration: 'ashab', english: 'Companions', category: 'word', difficulty: 2, tags: ["story"] },
  { id: "proph2-tabi", arabic: "تَابِعِين", transliteration: "tabi'in", english: "Successors", category: "word", difficulty: 3, tags: ["story"] },
  { id: 'proph2-sahaba', arabic: 'صَحَابَة', transliteration: 'sahabah', english: 'Companions', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-ansar', arabic: 'أَنْصَار', transliteration: 'ansar', english: 'Helpers', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-muhajir', arabic: 'مُهَاجِرُون', transliteration: 'muhajirun', english: 'Emigrants', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-khalifa', arabic: 'خَلِيفَة', transliteration: 'khalifah', english: 'Successor/Caliph', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-imamun', arabic: 'إِمَام', transliteration: 'imam', english: 'Leader', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-shahid2', arabic: 'شَهِيد', transliteration: 'shahid', english: 'Martyr', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-mujtahid', arabic: 'مُجْتَهِد', transliteration: 'mujtahid', english: 'Scholar', category: 'word', difficulty: 3, tags: ["story"] },
  { id: 'proph2-ad', arabic: 'عَاد', transliteration: 'Ad', english: 'People of Ad', category: 'word', difficulty: 2, tags: ["nation"] },
  { id: 'proph2-thamud', arabic: 'ثَمُود', transliteration: 'Thamud', english: 'People of Thamud', category: 'word', difficulty: 2, tags: ["nation"] },
  { id: 'proph2-madyan', arabic: 'مَدْيَن', transliteration: 'Madyan', english: 'People of Midian', category: 'word', difficulty: 2, tags: ["nation"] },
  { id: 'proph2-quraysh', arabic: 'قُرَيْش', transliteration: 'Quraysh', english: 'Quraysh', category: 'word', difficulty: 2, tags: ["nation"] },
  { id: "proph2-bani", arabic: "بَنِي إِسْرَائِيل", transliteration: "Bani Isra'il", english: "Children of Israel", category: "word", difficulty: 2, tags: ["nation"] },
  { id: 'proph2-ahbar', arabic: 'أَحْبَار', transliteration: 'ahbar', english: 'Rabbis', category: 'word', difficulty: 3, tags: ["story"] },
  { id: 'proph2-ruhban', arabic: 'رُهْبَان', transliteration: 'ruhban', english: 'Monks', category: 'word', difficulty: 3, tags: ["story"] },
  { id: 'proph2-nassara', arabic: 'نَصَارَى', transliteration: 'nasara', english: 'Christians', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-yahud', arabic: 'يَهُود', transliteration: 'yahud', english: 'Jews', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-majus', arabic: 'مَجُوس', transliteration: 'majus', english: 'Magians', category: 'word', difficulty: 3, tags: ["story"] },
  { id: "proph2-sabiun", arabic: "صَابِئُون", transliteration: "sabi'un", english: "Sabians", category: "word", difficulty: 3, tags: ["story"] },
  { id: 'proph2-qarun', arabic: 'قَارُون', transliteration: 'Qarun', english: 'Korah', category: 'word', difficulty: 2, tags: ["figure"] },
  { id: 'proph2-jalut', arabic: 'جَالُوت', transliteration: 'Jalut', english: 'Goliath', category: 'word', difficulty: 2, tags: ["figure"] },
  { id: 'proph2-talut', arabic: 'طَالُوت', transliteration: 'Talut', english: 'Saul', category: 'word', difficulty: 2, tags: ["figure"] },
  { id: 'proph2-dhulqarnayn', arabic: 'ذُو الْقَرْنَيْن', transliteration: 'Dhul-Qarnayn', english: 'Dhul-Qarnayn', category: 'word', difficulty: 2, tags: ["figure"] },
  { id: 'proph2-samiri', arabic: 'السَّامِرِيّ', transliteration: 'as-Samiri', english: 'The Samaritan', category: 'word', difficulty: 3, tags: ["figure"] },
  { id: 'proph2-ijl', arabic: 'عِجْل', transliteration: 'ijl', english: 'Calf (golden)', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-tabut', arabic: 'تَابُوت', transliteration: 'tabut', english: 'Ark', category: 'word', difficulty: 2, tags: ["story"] },
  { id: 'proph2-asa', arabic: 'عَصَا', transliteration: 'asa', english: 'Staff', category: 'word', difficulty: 2, tags: ["story"] },
];

// ============================================
// More Worship & Spirituality
// ============================================
const MORE_WORSHIP: Flashcard[] = [
  { id: 'wor-adhan', arabic: 'أَذَان', transliteration: 'adhan', english: 'Call to prayer', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'wor-iqama', arabic: 'إِقَامَة', transliteration: 'iqamah', english: 'Second call', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: "wor-qiraa", arabic: "قِرَاءَة", transliteration: "qira'ah", english: "Recitation", category: "word", difficulty: 2, tags: ["worship"] },
  { id: 'wor-tilawa2', arabic: 'تِلَاوَة', transliteration: 'tilawah', english: 'Recitation', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-hifz', arabic: 'حِفْظ', transliteration: 'hifz', english: 'Memorization', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-tajwid', arabic: 'تَجْوِيد', transliteration: 'tajwid', english: 'Tajweed', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-tartil', arabic: 'تَرْتِيل', transliteration: 'tartil', english: 'Slow recitation', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: "wor-khushu2", arabic: "خُشُوع", transliteration: "khushu'", english: "Humility", category: "word", difficulty: 3, tags: ["worship"] },
  { id: 'wor-niyya', arabic: 'نِيَّة', transliteration: 'niyyah', english: 'Intention', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-ikhlas', arabic: 'إِخْلَاص', transliteration: 'ikhlas', english: 'Sincerity', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-yaqin', arabic: 'يَقِين', transliteration: 'yaqin', english: 'Certainty', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-shawk', arabic: 'شَوْق', transliteration: 'shawq', english: 'Longing', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-khashya', arabic: 'خَشْيَة', transliteration: 'khashyah', english: 'Fear (of Allah)', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-mahabbah', arabic: 'مَحَبَّة', transliteration: 'mahabbah', english: 'Love', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: "wor-raja3", arabic: "رَجَاء", transliteration: "raja'", english: "Hope", category: "word", difficulty: 2, tags: ["worship"] },
  { id: "wor-tawadu", arabic: "تَوَاضُع", transliteration: "tawadu'", english: "Humility", category: "word", difficulty: 2, tags: ["worship"] },
  { id: 'wor-sidq2', arabic: 'صِدْق', transliteration: 'sidq', english: 'Truthfulness', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: "wor-wara", arabic: "وَرَع", transliteration: "wara'", english: "Piety", category: "word", difficulty: 3, tags: ["worship"] },
  { id: 'wor-zuhd', arabic: 'زُهْد', transliteration: 'zuhd', english: 'Asceticism', category: 'word', difficulty: 3, tags: ["worship"] },
  { id: "wor-qanaah", arabic: "قَنَاعَة", transliteration: "qana'ah", english: "Contentment", category: "word", difficulty: 2, tags: ["worship"] },
  { id: 'wor-rida', arabic: 'رِضَا', transliteration: 'rida', english: 'Contentment', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: "wor-shafa", arabic: "شِفَاء", transliteration: "shifa'", english: "Healing", category: "word", difficulty: 2, tags: ["worship"] },
  { id: 'wor-barakah', arabic: 'بَرَكَة', transliteration: 'barakah', english: 'Blessing', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'wor-fadl', arabic: 'فَضْل', transliteration: 'fadl', english: 'Bounty', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'wor-karam', arabic: 'كَرَم', transliteration: 'karam', english: 'Generosity', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'wor-jud', arabic: 'جُود', transliteration: 'jud', english: 'Generosity', category: 'word', difficulty: 2, tags: ["worship"] },
];


// ============================================
// Concepts & Ideas
// ============================================
const CONCEPTS: Flashcard[] = [
  { id: 'con-huda2', arabic: 'هِدَايَة', transliteration: 'hidayah', english: 'Guidance', category: 'word', difficulty: 1, tags: ["concept"] },
  { id: 'con-dalal', arabic: 'ضَلَالَة', transliteration: 'dalalah', english: 'Misguidance', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-nifaq', arabic: 'نِفَاق', transliteration: 'nifaq', english: 'Hypocrisy', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-kufr', arabic: 'كُفْر', transliteration: 'kufr', english: 'Disbelief', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-shirk', arabic: 'شِرْك', transliteration: 'shirk', english: 'Polytheism', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: "con-bid'ah", arabic: "بِدْعَة", transliteration: "bid'ah", english: "Innovation", category: "word", difficulty: 3, tags: ["concept"] },
  { id: 'con-fitna', arabic: 'فِتْنَة', transliteration: 'fitnah', english: 'Trial/Discord', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: "con-balaa", arabic: "بَلَاء", transliteration: "bala'", english: "Test/Affliction", category: "word", difficulty: 2, tags: ["concept"] },
  { id: 'con-imtihan', arabic: 'امْتِحَان', transliteration: 'imtihan', english: 'Examination', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-ikhtibar', arabic: 'اخْتِبَار', transliteration: 'ikhtibar', english: 'Test', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-sabab', arabic: 'سَبَب', transliteration: 'sabab', english: 'Cause/Means', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-natija', arabic: 'نَتِيجَة', transliteration: 'natijah', english: 'Result', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-hukm2', arabic: 'حُكْم', transliteration: 'hukm', english: 'Judgment/Rule', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-amana2', arabic: 'أَمَانَة', transliteration: 'amanah', english: 'Trust', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-khiyana', arabic: 'خِيَانَة', transliteration: 'khiyanah', english: 'Betrayal', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-nasiha', arabic: 'نَصِيحَة', transliteration: 'nasihah', english: 'Advice', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: "con-mawiza", arabic: "مَوْعِظَة", transliteration: "maw'izah", english: "Admonition", category: "word", difficulty: 2, tags: ["concept"] },
  { id: 'con-tadhkir', arabic: 'تَذْكِير', transliteration: 'tadhkir', english: 'Reminder', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-ibra', arabic: 'عِبْرَة', transliteration: 'ibrah', english: 'Lesson', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-dalil', arabic: 'دَلِيل', transliteration: 'dalil', english: 'Evidence', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-burhan', arabic: 'بُرْهَان', transliteration: 'burhan', english: 'Proof', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-hujja', arabic: 'حُجَّة', transliteration: 'hujjah', english: 'Argument', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-sultan3', arabic: 'سُلْطَان', transliteration: 'sultan', english: 'Authority', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-tawhid', arabic: 'تَوْحِيد', transliteration: 'tawhid', english: 'Monotheism', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-iman2', arabic: 'إِيمَان', transliteration: 'iman', english: 'Faith', category: 'word', difficulty: 1, tags: ["concept"] },
  { id: 'con-yaqin2', arabic: 'يَقِين', transliteration: 'yaqin', english: 'Certainty', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-shak', arabic: 'شَكّ', transliteration: 'shakk', english: 'Doubt', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-zann', arabic: 'ظَنّ', transliteration: 'zann', english: 'Assumption', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-wahm', arabic: 'وَهْم', transliteration: 'wahm', english: 'Illusion', category: 'word', difficulty: 3, tags: ["concept"] },
  { id: 'con-hawa', arabic: 'هَوَى', transliteration: 'hawa', english: 'Desire', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-shahwa', arabic: 'شَهْوَة', transliteration: 'shahwah', english: 'Lust', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-ghaflah', arabic: 'غَفْلَة', transliteration: 'ghaflah', english: 'Heedlessness', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-tawakkul', arabic: 'تَوَكُّل', transliteration: 'tawakkul', english: 'Reliance', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: "con-istiana", arabic: "اسْتِعَانَة", transliteration: "isti'anah", english: "Seeking help", category: "word", difficulty: 2, tags: ["concept"] },
  { id: "con-duaa", arabic: "دُعَاء", transliteration: "du'a", english: "Supplication", category: "word", difficulty: 1, tags: ["concept"] },
  { id: 'con-qunoot', arabic: 'قُنُوت', transliteration: 'qunut', english: 'Devotion', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-tafakkur', arabic: 'تَفَكُّر', transliteration: 'tafakkur', english: 'Contemplation', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-tadabbur', arabic: 'تَدَبُّر', transliteration: 'tadabbur', english: 'Reflection', category: 'word', difficulty: 2, tags: ["concept"] },
  { id: 'con-muraqaba', arabic: 'مُرَاقَبَة', transliteration: 'muraqabah', english: 'Self-watching', category: 'word', difficulty: 3, tags: ["concept"] },
  { id: 'con-muhasaba', arabic: 'مُحَاسَبَة', transliteration: 'muhasabah', english: 'Self-accounting', category: 'word', difficulty: 3, tags: ["concept"] },
];

// ============================================
// More Verbs (Extended)
// ============================================
const MORE_VERBS: Flashcard[] = [
  { id: "v2-nafaa", arabic: "نَفَعَ", transliteration: "nafa'a", english: "He benefited", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'v2-darra', arabic: 'ضَرَّ', transliteration: 'darra', english: 'He harmed', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-hassala', arabic: 'حَصَلَ', transliteration: 'hasala', english: 'He obtained', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-wajaba', arabic: 'وَجَبَ', transliteration: 'wajaba', english: 'It became obligatory', category: 'word', difficulty: 3, tags: ["verb"] },
  { id: 'v2-istahaqqa', arabic: 'اسْتَحَقَّ', transliteration: 'istahaqqa', english: 'He deserved', category: 'word', difficulty: 3, tags: ["verb"] },
  { id: 'v2-qaala', arabic: 'قَالَ', transliteration: 'qala', english: 'He said', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'v2-yaquulu', arabic: 'يَقُولُ', transliteration: 'yaqulu', english: 'He says', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'v2-nazala', arabic: 'نَزَلَ', transliteration: 'nazala', english: 'He descended', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'v2-talaa', arabic: 'تَلَا', transliteration: 'tala', english: 'He recited', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-haafaza', arabic: 'حَافَظَ', transliteration: 'hafaza', english: 'He preserved', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "v2-taallama", arabic: "تَعَلَّمَ", transliteration: "ta'allama", english: "He learned", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'v2-allama', arabic: 'عَلَّمَ', transliteration: 'allama', english: 'He taught', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-fahima', arabic: 'فَهِمَ', transliteration: 'fahima', english: 'He understood', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-adraka', arabic: 'أَدْرَكَ', transliteration: 'adraka', english: 'He comprehended', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-nassara2', arabic: 'نَصَّرَ', transliteration: 'nassara', english: 'He supported', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-aaada', arabic: 'عَادَ', transliteration: 'ada', english: 'He returned', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-baqiya', arabic: 'بَقِيَ', transliteration: 'baqiya', english: 'He remained', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-fana', arabic: 'فَنِيَ', transliteration: 'faniya', english: 'He perished', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-zaada', arabic: 'زَادَ', transliteration: 'zada', english: 'He increased', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-naqasa', arabic: 'نَقَصَ', transliteration: 'naqasa', english: 'He decreased', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-athbata', arabic: 'أَثْبَتَ', transliteration: 'athbata', english: 'He established', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-nafaa2', arabic: 'نَفَى', transliteration: 'nafa', english: 'He negated', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-qabbala', arabic: 'قَبِلَ', transliteration: 'qabila', english: 'He accepted', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-rafada', arabic: 'رَفَضَ', transliteration: 'rafada', english: 'He rejected', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-waffaqa', arabic: 'وَفَّقَ', transliteration: 'waffaqa', english: 'He granted success', category: 'word', difficulty: 3, tags: ["verb"] },
  { id: "v2-akhata", arabic: "أَخْطَأَ", transliteration: "akhta'a", english: "He erred", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'v2-asaba', arabic: 'أَصَابَ', transliteration: 'asaba', english: 'He was correct', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-nazhar', arabic: 'نَظَرَ', transliteration: 'nazara', english: 'He looked', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'v2-intazhar', arabic: 'انْتَظَرَ', transliteration: 'intazara', english: 'He waited', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "v2-tawaqqaa", arabic: "تَوَقَّعَ", transliteration: "tawaqqa'a", english: "He expected", category: "word", difficulty: 3, tags: ["verb"] },
  { id: 'v2-baddala', arabic: 'بَدَّلَ', transliteration: 'baddala', english: 'He changed', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-harrafa', arabic: 'حَرَّفَ', transliteration: 'harrafa', english: 'He distorted', category: 'word', difficulty: 3, tags: ["verb"] },
  { id: 'v2-hassana', arabic: 'حَسَّنَ', transliteration: 'hassana', english: 'He beautified', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-qabbaha', arabic: 'قَبَّحَ', transliteration: 'qabbaha', english: 'He made ugly', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-nazzala', arabic: 'نَزَّلَ', transliteration: 'nazzala', english: 'He sent down', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "v2-rafaa", arabic: "رَفَعَ", transliteration: "rafa'a", english: "He raised", category: "word", difficulty: 2, tags: ["verb"] },
  { id: "v2-wadaa", arabic: "وَضَعَ", transliteration: "wada'a", english: "He placed", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'v2-akhraja', arabic: 'أَخْرَجَ', transliteration: 'akhraja', english: 'He brought out', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-adkhala', arabic: 'أَدْخَلَ', transliteration: 'adkhala', english: 'He entered (tr.)', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'v2-qasada', arabic: 'قَصَدَ', transliteration: 'qasada', english: 'He intended', category: 'word', difficulty: 2, tags: ["verb"] },
];

// ============================================
// Quranic Phrases & Expressions
// ============================================
const QURAN_PHRASES: Flashcard[] = [
  { id: 'qur-bismillah', arabic: 'بِسْمِ اللهِ', transliteration: 'bismillah', english: 'In the name of Allah', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-hamd', arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'alhamdulillah', english: 'Praise be to Allah', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-subhan', arabic: 'سُبْحَانَ اللهِ', transliteration: 'subhanallah', english: 'Glory to Allah', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-akbar', arabic: 'اللهُ أَكْبَر', transliteration: 'Allahu Akbar', english: 'Allah is Greatest', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-lailaha', arabic: 'لَا إِلَٰهَ إِلَّا اللهُ', transliteration: 'la ilaha illallah', english: 'No god but Allah', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: "qur-masha", arabic: "مَا شَاءَ اللهُ", transliteration: "masha'Allah", english: "As Allah willed", category: "word", difficulty: 1, tags: ["phrase"] },
  { id: "qur-insha", arabic: "إِنْ شَاءَ اللهُ", transliteration: "insha'Allah", english: "If Allah wills", category: "word", difficulty: 1, tags: ["phrase"] },
  { id: 'qur-jazak', arabic: 'جَزَاكَ اللهُ', transliteration: 'jazakAllah', english: 'May Allah reward you', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-barak', arabic: 'بَارَكَ اللهُ', transliteration: 'barakAllah', english: 'May Allah bless', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: "qur-astaghfir", arabic: "أَسْتَغْفِرُ اللهَ", transliteration: "astaghfirullah", english: "I seek Allah's forgiveness", category: "word", difficulty: 1, tags: ["phrase"] },
  { id: 'qur-salam3', arabic: 'السَّلَامُ عَلَيْكُم', transliteration: 'assalamu alaykum', english: 'Peace be upon you', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-amin', arabic: 'آمِين', transliteration: 'Amin', english: 'Amen', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-sadaqa', arabic: 'صَدَقَ اللهُ الْعَظِيم', transliteration: 'sadaqAllah', english: 'Allah has spoken the truth', category: 'word', difficulty: 2, tags: ["phrase"] },
  { id: 'qur-sallallahu', arabic: 'صَلَّى اللهُ عَلَيْهِ وَسَلَّم', transliteration: 'sallallahu alayhi wasallam', english: 'Peace be upon him', category: 'word', difficulty: 2, tags: ["phrase"] },
  { id: "qur-rahmatu", arabic: "رَحْمَةُ اللهِ", transliteration: "rahmatullah", english: "Allah's mercy", category: "word", difficulty: 2, tags: ["phrase"] },
  { id: 'qur-alayhim', arabic: 'عَلَيْهِمْ', transliteration: 'alayhim', english: 'Upon them', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-alayna', arabic: 'عَلَيْنَا', transliteration: 'alayna', english: 'Upon us', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-lahum', arabic: 'لَهُمْ', transliteration: 'lahum', english: 'For them', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-lana', arabic: 'لَنَا', transliteration: 'lana', english: 'For us', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-minhum', arabic: 'مِنْهُمْ', transliteration: 'minhum', english: 'From them', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-minna', arabic: 'مِنَّا', transliteration: 'minna', english: 'From us', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-fihi', arabic: 'فِيهِ', transliteration: 'fihi', english: 'In it', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-bihi', arabic: 'بِهِ', transliteration: 'bihi', english: 'With it', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-lahu', arabic: 'لَهُ', transliteration: 'lahu', english: 'For him', category: 'word', difficulty: 1, tags: ["phrase"] },
  { id: 'qur-minhu', arabic: 'مِنْهُ', transliteration: 'minhu', english: 'From him', category: 'word', difficulty: 1, tags: ["phrase"] },
];

// ============================================
// Numbers
// ============================================
const NUMBERS: Flashcard[] = [
  { id: 'num-wahid', arabic: 'وَاحِد', transliteration: 'wahid', english: 'One', category: 'word', difficulty: 1, tags: ["number"] },
  { id: 'num-ithnan', arabic: 'اثْنَان', transliteration: 'ithnan', english: 'Two', category: 'word', difficulty: 1, tags: ["number"] },
  { id: 'num-thalatha', arabic: 'ثَلَاثَة', transliteration: 'thalathah', english: 'Three', category: 'word', difficulty: 1, tags: ["number"] },
  { id: "num-arba", arabic: "أَرْبَعَة", transliteration: "arba'ah", english: "Four", category: "word", difficulty: 1, tags: ["number"] },
  { id: 'num-khamsa', arabic: 'خَمْسَة', transliteration: 'khamsah', english: 'Five', category: 'word', difficulty: 1, tags: ["number"] },
  { id: 'num-sitta', arabic: 'سِتَّة', transliteration: 'sittah', english: 'Six', category: 'word', difficulty: 1, tags: ["number"] },
  { id: "num-saba", arabic: "سَبْعَة", transliteration: "sab'ah", english: "Seven", category: "word", difficulty: 1, tags: ["number"] },
  { id: 'num-thamaniya', arabic: 'ثَمَانِيَة', transliteration: 'thamaniyah', english: 'Eight', category: 'word', difficulty: 1, tags: ["number"] },
  { id: "num-tisa", arabic: "تِسْعَة", transliteration: "tis'ah", english: "Nine", category: "word", difficulty: 1, tags: ["number"] },
  { id: 'num-ashara', arabic: 'عَشَرَة', transliteration: 'asharah', english: 'Ten', category: 'word', difficulty: 1, tags: ["number"] },
  { id: 'num-ihdaashar', arabic: 'أَحَدَ عَشَرَ', transliteration: 'ahada ashar', english: 'Eleven', category: 'word', difficulty: 2, tags: ["number"] },
  { id: 'num-ithnaashar', arabic: 'اثْنَا عَشَرَ', transliteration: 'ithna ashar', english: 'Twelve', category: 'word', difficulty: 2, tags: ["number"] },
  { id: 'num-ishrun', arabic: 'عِشْرُون', transliteration: 'ishrun', english: 'Twenty', category: 'word', difficulty: 2, tags: ["number"] },
  { id: 'num-thalathun', arabic: 'ثَلَاثُون', transliteration: 'thalathun', english: 'Thirty', category: 'word', difficulty: 2, tags: ["number"] },
  { id: "num-arbaun", arabic: "أَرْبَعُون", transliteration: "arba'un", english: "Forty", category: "word", difficulty: 2, tags: ["number"] },
  { id: 'num-khamsun', arabic: 'خَمْسُون', transliteration: 'khamsun', english: 'Fifty', category: 'word', difficulty: 2, tags: ["number"] },
  { id: "num-mia", arabic: "مِائَة", transliteration: "mi'ah", english: "Hundred", category: "word", difficulty: 2, tags: ["number"] },
  { id: 'num-alf', arabic: 'أَلْف', transliteration: 'alf', english: 'Thousand', category: 'word', difficulty: 2, tags: ["number"] },
  { id: 'num-awwal2', arabic: 'أَوَّل', transliteration: 'awwal', english: 'First', category: 'word', difficulty: 1, tags: ["number"] },
  { id: 'num-thani', arabic: 'ثَانِي', transliteration: 'thani', english: 'Second', category: 'word', difficulty: 1, tags: ["number"] },
  { id: 'num-thalith', arabic: 'ثَالِث', transliteration: 'thalith', english: 'Third', category: 'word', difficulty: 2, tags: ["number"] },
];

// ============================================
// Time Words
// ============================================
const TIME_WORDS: Flashcard[] = [
  { id: 'time-ghadan', arabic: 'غَدًا', transliteration: 'ghadan', english: 'Tomorrow', category: 'word', difficulty: 1, tags: ["time"] },
  { id: 'time-ams', arabic: 'أَمْس', transliteration: 'ams', english: 'Yesterday', category: 'word', difficulty: 1, tags: ["time"] },
  { id: 'time-alan', arabic: 'الْآن', transliteration: 'al-an', english: 'Now', category: 'word', difficulty: 1, tags: ["time"] },
  { id: 'time-yawman', arabic: 'يَوْمًا', transliteration: 'yawman', english: 'One day', category: 'word', difficulty: 1, tags: ["time"] },
  { id: 'time-laylatan', arabic: 'لَيْلَة', transliteration: 'laylah', english: 'Night', category: 'word', difficulty: 1, tags: ["time"] },
  { id: 'time-fajran', arabic: 'فَجْرًا', transliteration: 'fajran', english: 'At dawn', category: 'word', difficulty: 2, tags: ["time"] },
  { id: 'time-subhan', arabic: 'صُبْحًا', transliteration: 'subhan', english: 'In the morning', category: 'word', difficulty: 2, tags: ["time"] },
  { id: "time-maasan", arabic: "مَسَاءً", transliteration: "masa'an", english: "In the evening", category: "word", difficulty: 2, tags: ["time"] },
  { id: "time-daiman", arabic: "دَائِمًا", transliteration: "da'iman", english: "Always", category: "word", difficulty: 2, tags: ["time"] },
  { id: 'time-abadan', arabic: 'أَبَدًا', transliteration: 'abadan', english: 'Never/Forever', category: 'word', difficulty: 2, tags: ["time"] },
  { id: 'time-hina', arabic: 'حِين', transliteration: 'hin', english: 'Time/When', category: 'word', difficulty: 2, tags: ["time"] },
  { id: 'time-ajal', arabic: 'أَجَل', transliteration: 'ajal', english: 'Appointed time', category: 'word', difficulty: 2, tags: ["time"] },
  { id: "time-mawid", arabic: "مَوْعِد", transliteration: "maw'id", english: "Appointment", category: "word", difficulty: 2, tags: ["time"] },
  { id: 'time-muddah', arabic: 'مُدَّة', transliteration: 'muddah', english: 'Duration', category: 'word', difficulty: 2, tags: ["time"] },
  { id: 'time-umr', arabic: 'عُمْر', transliteration: 'umr', english: 'Lifespan', category: 'word', difficulty: 2, tags: ["time"] },
  { id: 'time-dahr', arabic: 'دَهْر', transliteration: 'dahr', english: 'Time/Era', category: 'word', difficulty: 2, tags: ["time"] },
  { id: 'time-asr2', arabic: 'عَصْر', transliteration: 'asr', english: 'Era/Epoch', category: 'word', difficulty: 2, tags: ["time"] },
  { id: 'time-qarn', arabic: 'قَرْن', transliteration: 'qarn', english: 'Century', category: 'word', difficulty: 2, tags: ["time"] },
  { id: 'time-zaman', arabic: 'زَمَان', transliteration: 'zaman', english: 'Time', category: 'word', difficulty: 1, tags: ["time"] },
  { id: 'time-makan2', arabic: 'مَكَان', transliteration: 'makan', english: 'Place', category: 'word', difficulty: 1, tags: ["time"] },
];

// ============================================
// Body Parts (Extended)
// ============================================
const BODY_PARTS: Flashcard[] = [
  { id: 'body-jasad', arabic: 'جَسَد', transliteration: 'jasad', english: 'Body', category: 'word', difficulty: 1, tags: ["body"] },
  { id: 'body-badan', arabic: 'بَدَن', transliteration: 'badan', english: 'Body', category: 'word', difficulty: 1, tags: ["body"] },
  { id: 'body-jism', arabic: 'جِسْم', transliteration: 'jism', english: 'Body/Physique', category: 'word', difficulty: 1, tags: ["body"] },
  { id: 'body-azm', arabic: 'عَظْم', transliteration: 'azm', english: 'Bone', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-lahm', arabic: 'لَحْم', transliteration: 'lahm', english: 'Flesh', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-shaff', arabic: 'شَفَة', transliteration: 'shafah', english: 'Lip', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-jafn', arabic: 'جَفْن', transliteration: 'jafn', english: 'Eyelid', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-jabha', arabic: 'جَبْهَة', transliteration: 'jabhah', english: 'Forehead', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-kaff', arabic: 'كَفّ', transliteration: 'kaff', english: 'Palm', category: 'word', difficulty: 2, tags: ["body"] },
  { id: "body-isba", arabic: "إِصْبَع", transliteration: "isba'", english: "Finger", category: "word", difficulty: 2, tags: ["body"] },
  { id: 'body-zufr', arabic: 'ظُفْر', transliteration: 'zufr', english: 'Nail', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-rukba', arabic: 'رُكْبَة', transliteration: 'rukbah', english: 'Knee', category: 'word', difficulty: 2, tags: ["body"] },
  { id: "body-kaab", arabic: "كَعْب", transliteration: "ka'b", english: "Ankle", category: "word", difficulty: 2, tags: ["body"] },
  { id: 'body-qadam', arabic: 'قَدَم', transliteration: 'qadam', english: 'Foot', category: 'word', difficulty: 1, tags: ["body"] },
  { id: 'body-dahr2', arabic: 'ظَهْر', transliteration: 'zahr', english: 'Back', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-janb', arabic: 'جَنْب', transliteration: 'janb', english: 'Side', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-katif', arabic: 'كَتِف', transliteration: 'katif', english: 'Shoulder', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-raqaba', arabic: 'رَقَبَة', transliteration: 'raqabah', english: 'Neck', category: 'word', difficulty: 2, tags: ["body"] },
  { id: 'body-sinn', arabic: 'سِنّ', transliteration: 'sinn', english: 'Tooth', category: 'word', difficulty: 2, tags: ["body"] },
  { id: "body-shaar", arabic: "شَعْر", transliteration: "sha'r", english: "Hair", category: "word", difficulty: 2, tags: ["body"] },
];

// ============================================
// Colors
// ============================================
const COLORS: Flashcard[] = [
  { id: 'color-abyad', arabic: 'أَبْيَض', transliteration: 'abyad', english: 'White', category: 'word', difficulty: 1, tags: ["color"] },
  { id: 'color-aswad', arabic: 'أَسْوَد', transliteration: 'aswad', english: 'Black', category: 'word', difficulty: 1, tags: ["color"] },
  { id: 'color-ahmar', arabic: 'أَحْمَر', transliteration: 'ahmar', english: 'Red', category: 'word', difficulty: 1, tags: ["color"] },
  { id: 'color-akhdar', arabic: 'أَخْضَر', transliteration: 'akhdar', english: 'Green', category: 'word', difficulty: 1, tags: ["color"] },
  { id: 'color-azraq', arabic: 'أَزْرَق', transliteration: 'azraq', english: 'Blue', category: 'word', difficulty: 1, tags: ["color"] },
  { id: 'color-asfar', arabic: 'أَصْفَر', transliteration: 'asfar', english: 'Yellow', category: 'word', difficulty: 1, tags: ["color"] },
  { id: 'color-bunni', arabic: 'بُنِّيّ', transliteration: 'bunni', english: 'Brown', category: 'word', difficulty: 2, tags: ["color"] },
  { id: 'color-ramadi', arabic: 'رَمَادِيّ', transliteration: 'ramadi', english: 'Gray', category: 'word', difficulty: 2, tags: ["color"] },
];

// ============================================
// Directions
// ============================================
const DIRECTIONS: Flashcard[] = [
  { id: 'dir-sharq', arabic: 'شَرْق', transliteration: 'sharq', english: 'East', category: 'word', difficulty: 1, tags: ["direction"] },
  { id: 'dir-gharb', arabic: 'غَرْب', transliteration: 'gharb', english: 'West', category: 'word', difficulty: 1, tags: ["direction"] },
  { id: 'dir-shamal2', arabic: 'شَمَال', transliteration: 'shamal', english: 'North', category: 'word', difficulty: 1, tags: ["direction"] },
  { id: 'dir-janub', arabic: 'جَنُوب', transliteration: 'janub', english: 'South', category: 'word', difficulty: 1, tags: ["direction"] },
  { id: 'dir-amam', arabic: 'أَمَام', transliteration: 'amam', english: 'In front', category: 'word', difficulty: 1, tags: ["direction"] },
  { id: "dir-wara", arabic: "وَرَاء", transliteration: "wara'", english: "Behind", category: "word", difficulty: 1, tags: ["direction"] },
  { id: 'dir-janib', arabic: 'جَانِب', transliteration: 'janib', english: 'Side', category: 'word', difficulty: 1, tags: ["direction"] },
  { id: 'dir-wasit', arabic: 'وَسَط', transliteration: 'wasat', english: 'Middle', category: 'word', difficulty: 1, tags: ["direction"] },
  { id: 'dir-qurb', arabic: 'قُرْب', transliteration: 'qurb', english: 'Nearness', category: 'word', difficulty: 2, tags: ["direction"] },
  { id: "dir-bud", arabic: "بُعْد", transliteration: "bu'd", english: "Distance", category: "word", difficulty: 2, tags: ["direction"] },
];

// ============================================
// Ethics & Character
// ============================================
const ETHICS: Flashcard[] = [
  { id: 'eth-akhlaq', arabic: 'أَخْلَاق', transliteration: 'akhlaq', english: 'Morals', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-adab', arabic: 'أَدَب', transliteration: 'adab', english: 'Manners', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-birr', arabic: 'بِرّ', transliteration: 'birr', english: 'Righteousness', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-silah', arabic: 'صِلَة', transliteration: 'silah', english: 'Connection (kin)', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-ihsan2', arabic: 'إِحْسَان', transliteration: 'ihsan', english: 'Excellence', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-iffah', arabic: 'عِفَّة', transliteration: 'iffah', english: 'Chastity', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: "eth-hayaa", arabic: "حَيَاء", transliteration: "haya'", english: "Modesty", category: "word", difficulty: 2, tags: ["ethics"] },
  { id: 'eth-afw', arabic: 'عَفْو', transliteration: 'afw', english: 'Pardon', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-hilm', arabic: 'حِلْم', transliteration: 'hilm', english: 'Forbearance', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-rifq', arabic: 'رِفْق', transliteration: 'rifq', english: 'Gentleness', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-lin', arabic: 'لِين', transliteration: 'lin', english: 'Softness', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: "eth-tawadu2", arabic: "تَوَاضُع", transliteration: "tawadu'", english: "Humility", category: "word", difficulty: 2, tags: ["ethics"] },
  { id: 'eth-kibr', arabic: 'كِبْر', transliteration: 'kibr', english: 'Arrogance', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-ujb', arabic: 'عُجْب', transliteration: 'ujb', english: 'Self-admiration', category: 'word', difficulty: 3, tags: ["ethics"] },
  { id: "eth-riya", arabic: "رِيَاء", transliteration: "riya'", english: "Showing off", category: "word", difficulty: 2, tags: ["ethics"] },
  { id: 'eth-hasad', arabic: 'حَسَد', transliteration: 'hasad', english: 'Envy', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-bughd', arabic: 'بُغْض', transliteration: 'bughd', english: 'Hatred', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-ghibah', arabic: 'غِيبَة', transliteration: 'ghibah', english: 'Backbiting', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-namimah', arabic: 'نَمِيمَة', transliteration: 'namimah', english: 'Tale-bearing', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-bukhl', arabic: 'بُخْل', transliteration: 'bukhl', english: 'Stinginess', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-israf', arabic: 'إِسْرَاف', transliteration: 'israf', english: 'Extravagance', category: 'word', difficulty: 2, tags: ["ethics"] },
  { id: 'eth-taqtir', arabic: 'تَقْتِير', transliteration: 'taqtir', english: 'Miserliness', category: 'word', difficulty: 3, tags: ["ethics"] },
  { id: 'eth-iqtisad', arabic: 'اقْتِصَاد', transliteration: 'iqtisad', english: 'Moderation', category: 'word', difficulty: 3, tags: ["ethics"] },
  { id: "eth-wafa", arabic: "وَفَاء", transliteration: "wafa'", english: "Loyalty", category: "word", difficulty: 2, tags: ["ethics"] },
  { id: 'eth-ghidr', arabic: 'غَدْر', transliteration: 'ghadr', english: 'Treachery', category: 'word', difficulty: 2, tags: ["ethics"] },
];

// ============================================
// Society & Relations
// ============================================
const SOCIETY: Flashcard[] = [
  { id: "soc-mujtama", arabic: "مُجْتَمَع", transliteration: "mujtama'", english: "Society", category: "word", difficulty: 2, tags: ["society"] },
  { id: 'soc-ahlu', arabic: 'أَهْل', transliteration: 'ahl', english: 'Family', category: 'word', difficulty: 1, tags: ["society"] },
  { id: 'soc-usra', arabic: 'أُسْرَة', transliteration: 'usrah', english: 'Family', category: 'word', difficulty: 1, tags: ["society"] },
  { id: 'soc-qarabah', arabic: 'قَرَابَة', transliteration: 'qarabah', english: 'Kinship', category: 'word', difficulty: 2, tags: ["society"] },
  { id: 'soc-jar', arabic: 'جَار', transliteration: 'jar', english: 'Neighbor', category: 'word', difficulty: 1, tags: ["society"] },
  { id: 'soc-dayf', arabic: 'ضَيْف', transliteration: 'dayf', english: 'Guest', category: 'word', difficulty: 1, tags: ["society"] },
  { id: 'soc-sakhiy', arabic: 'سَخِيّ', transliteration: 'sakhiyy', english: 'Generous', category: 'word', difficulty: 2, tags: ["society"] },
  { id: 'soc-bakhil', arabic: 'بَخِيل', transliteration: 'bakhil', english: 'Miser', category: 'word', difficulty: 2, tags: ["society"] },
  { id: 'soc-yatim', arabic: 'يَتِيم', transliteration: 'yatim', english: 'Orphan', category: 'word', difficulty: 1, tags: ["society"] },
  { id: 'soc-miskin', arabic: 'مِسْكِين', transliteration: 'miskin', english: 'Needy', category: 'word', difficulty: 1, tags: ["society"] },
  { id: "soc-sail", arabic: "سَائِل", transliteration: "sa'il", english: "Beggar/Asker", category: "word", difficulty: 2, tags: ["society"] },
  { id: 'soc-ibn2', arabic: 'ابْنُ السَّبِيل', transliteration: 'ibn as-sabil', english: 'Wayfarer', category: 'word', difficulty: 2, tags: ["society"] },
  { id: 'soc-armal', arabic: 'أَرْمَلَة', transliteration: 'armalah', english: 'Widow', category: 'word', difficulty: 2, tags: ["society"] },
  { id: 'soc-asir', arabic: 'أَسِير', transliteration: 'asir', english: 'Captive', category: 'word', difficulty: 2, tags: ["society"] },
  { id: 'soc-raqiq', arabic: 'رَقِيق', transliteration: 'raqiq', english: 'Slave', category: 'word', difficulty: 2, tags: ["society"] },
  { id: 'soc-hurr', arabic: 'حُرّ', transliteration: 'hurr', english: 'Free person', category: 'word', difficulty: 2, tags: ["society"] },
];

// ============================================
// Adverbs & Phrases
// ============================================
const ADVERBS: Flashcard[] = [
  { id: 'phr-awwalan', arabic: 'أَوَّلًا', transliteration: 'awwalan', english: 'Firstly', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: 'phr-thaniyan', arabic: 'ثَانِيًا', transliteration: 'thaniyan', english: 'Secondly', category: 'word', difficulty: 2, tags: ["adverb"] },
  { id: 'phr-akhiran', arabic: 'أَخِيرًا', transliteration: 'akhiran', english: 'Finally', category: 'word', difficulty: 2, tags: ["adverb"] },
  { id: 'phr-jiddan', arabic: 'جِدًّا', transliteration: 'jiddan', english: 'Very', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: 'phr-kathiran', arabic: 'كَثِيرًا', transliteration: 'kathiran', english: 'Much/Often', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: 'phr-qalilan', arabic: 'قَلِيلًا', transliteration: 'qalilan', english: 'A little', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: "phr-sariaan", arabic: "سَرِيعًا", transliteration: "sari'an", english: "Quickly", category: "word", difficulty: 2, tags: ["adverb"] },
  { id: "phr-batian", arabic: "بَطِيئًا", transliteration: "bati'an", english: "Slowly", category: "word", difficulty: 2, tags: ["adverb"] },
  { id: 'phr-faqat', arabic: 'فَقَط', transliteration: 'faqat', english: 'Only', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: 'phr-aydan', arabic: 'أَيْضًا', transliteration: 'aydan', english: 'Also', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: "phr-maan", arabic: "مَعًا", transliteration: "ma'an", english: "Together", category: "word", difficulty: 1, tags: ["adverb"] },
  { id: 'phr-wahda', arabic: 'وَحْدَهُ', transliteration: 'wahdahu', english: 'Alone', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: 'phr-huna', arabic: 'هُنَا', transliteration: 'huna', english: 'Here', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: 'phr-hunaka', arabic: 'هُنَاكَ', transliteration: 'hunaka', english: 'There', category: 'word', difficulty: 1, tags: ["adverb"] },
  { id: 'phr-haythu', arabic: 'حَيْثُ', transliteration: 'haythu', english: 'Where', category: 'word', difficulty: 2, tags: ["adverb"] },
  { id: 'phr-kadhaa', arabic: 'كَذَا', transliteration: 'kadha', english: 'Thus', category: 'word', difficulty: 2, tags: ["adverb"] },
];


// ============================================
// Final Vocabulary Batch
// ============================================
const FINAL_VOCAB: Flashcard[] = [
  { id: 'fin-surah2', arabic: 'صُورَة', transliteration: 'surah', english: 'Form/Image', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-maqam', arabic: 'مَقَام', transliteration: 'maqam', english: 'Station/Place', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-manzil', arabic: 'مَنْزِل', transliteration: 'manzil', english: 'House/Stage', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-minbar', arabic: 'مِنْبَر', transliteration: 'minbar', english: 'Pulpit', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-mihrab', arabic: 'مِحْرَاب', transliteration: 'mihrab', english: 'Prayer niche', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-qubla2', arabic: 'قُبَّة', transliteration: 'qubbah', english: 'Dome', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-minara', arabic: 'مِنَارَة', transliteration: 'minarah', english: 'Minaret', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-mushaf', arabic: 'مُصْحَف', transliteration: 'mushaf', english: 'Quran copy', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-juz', arabic: 'جُزْء', transliteration: 'juz', english: 'Part (of Quran)', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'fin-hizb', arabic: 'حِزْب', transliteration: 'hizb', english: 'Section', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-rub', arabic: 'رُبْع', transliteration: 'rub', english: 'Quarter', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-nisf', arabic: 'نِصْف', transliteration: 'nisf', english: 'Half', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'fin-thuluth', arabic: 'ثُلُث', transliteration: 'thuluth', english: 'Third', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-ism2', arabic: 'اسْمٌ', transliteration: 'ism', english: 'Name', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'fin-sifa', arabic: 'صِفَة', transliteration: 'sifah', english: 'Attribute', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: "fin-fil2", arabic: "فِعْل", transliteration: "fi'l", english: "Verb/Action", category: "word", difficulty: 2, tags: ["noun"] },
  { id: 'fin-harf', arabic: 'حَرْف', transliteration: 'harf', english: 'Letter', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'fin-kalima', arabic: 'كَلِمَة', transliteration: 'kalimah', english: 'Word', category: 'word', difficulty: 1, tags: ["noun"] },
  { id: 'fin-jumla', arabic: 'جُمْلَة', transliteration: 'jumlah', english: 'Sentence', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: "fin-mana", arabic: "مَعْنَى", transliteration: "ma'na", english: "Meaning", category: "word", difficulty: 1, tags: ["noun"] },
  { id: 'fin-lafz', arabic: 'لَفْظ', transliteration: 'lafz', english: 'Pronunciation', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: 'fin-aslu', arabic: 'أَصْل', transliteration: 'asl', english: 'Origin/Root', category: 'word', difficulty: 2, tags: ["noun"] },
  { id: "fin-far", arabic: "فَرْع", transliteration: "far'", english: "Branch", category: "word", difficulty: 2, tags: ["noun"] },
  { id: 'fin-jawhar', arabic: 'جَوْهَر', transliteration: 'jawhar', english: 'Essence', category: 'word', difficulty: 3, tags: ["noun"] },
  { id: 'fin-arad', arabic: 'عَرَض', transliteration: 'arad', english: 'Accident', category: 'word', difficulty: 3, tags: ["noun"] },
  { id: 'fin-yakhluqu', arabic: 'يَخْلُقُ', transliteration: 'yakhluqu', english: 'He creates', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'fin-yarzuqu', arabic: 'يَرْزُقُ', transliteration: 'yarzuqu', english: 'He provides', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'fin-yaghfiru', arabic: 'يَغْفِرُ', transliteration: 'yaghfiru', english: 'He forgives', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'fin-yuhyi', arabic: 'يُحْيِي', transliteration: 'yuhyi', english: 'He gives life', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'fin-yumitu', arabic: 'يُمِيتُ', transliteration: 'yumitu', english: 'He causes death', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'fin-yahdi', arabic: 'يَهْدِي', transliteration: 'yahdi', english: 'He guides', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'fin-yudillu', arabic: 'يُضِلُّ', transliteration: 'yudillu', english: 'He misguides', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'fin-yunzilu', arabic: 'يُنْزِلُ', transliteration: 'yunzilu', english: 'He sends down', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "fin-yarfau", arabic: "يَرْفَعُ", transliteration: "yarfa'u", english: "He raises", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'fin-yakhfidu', arabic: 'يَخْفِضُ', transliteration: 'yakhfidu', english: 'He lowers', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'fin-yuhibbu', arabic: 'يُحِبُّ', transliteration: 'yuhibbu', english: 'He loves', category: 'word', difficulty: 1, tags: ["verb"] },
  { id: 'fin-yakrahu', arabic: 'يَكْرَهُ', transliteration: 'yakrahu', english: 'He dislikes', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: "fin-yamuru", arabic: "يَأْمُرُ", transliteration: "ya'muru", english: "He commands", category: "word", difficulty: 2, tags: ["verb"] },
  { id: 'fin-yanha', arabic: 'يَنْهَى', transliteration: 'yanha', english: 'He forbids', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'fin-yajibu', arabic: 'يَجِبُ', transliteration: 'yajibu', english: 'It is necessary', category: 'word', difficulty: 2, tags: ["verb"] },
  { id: 'fin-kun', arabic: 'كُنْ', transliteration: 'kun', english: 'Be!', category: 'word', difficulty: 1, tags: ["command"] },
  { id: 'fin-fa', arabic: 'فَيَكُونُ', transliteration: 'fa-yakun', english: 'So it becomes', category: 'word', difficulty: 2, tags: ["phrase"] },
  { id: 'fin-ittaqi', arabic: 'اتَّقِ', transliteration: 'ittaqi', english: 'Fear (Allah)!', category: 'word', difficulty: 2, tags: ["command"] },
  { id: 'fin-taub', arabic: 'تُبْ', transliteration: 'tub', english: 'Repent!', category: 'word', difficulty: 2, tags: ["command"] },
  { id: 'fin-sabir', arabic: 'اصْبِرْ', transliteration: 'isbir', english: 'Be patient!', category: 'word', difficulty: 1, tags: ["command"] },
  { id: 'fin-ushkur', arabic: 'اشْكُرْ', transliteration: 'ushkur', english: 'Be grateful!', category: 'word', difficulty: 1, tags: ["command"] },
  { id: 'fin-wadi', arabic: 'وَادِي', transliteration: 'wadi', english: 'Valley', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'fin-bustan', arabic: 'بُسْتَان', transliteration: 'bustan', english: 'Garden', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'fin-jannat2', arabic: 'جَنَّات', transliteration: 'jannat', english: 'Gardens', category: 'word', difficulty: 1, tags: ["nature"] },
  { id: "fin-bi'r", arabic: "بِئْر", transliteration: "bi'r", english: "Well", category: "word", difficulty: 2, tags: ["nature"] },
  { id: 'fin-ayn2', arabic: 'عَيْن', transliteration: 'ayn', english: 'Spring', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: "fin-sahra", arabic: "صَحْرَاء", transliteration: "sahra'", english: "Desert", category: "word", difficulty: 2, tags: ["nature"] },
  { id: 'fin-ghabah', arabic: 'غَابَة', transliteration: 'ghabah', english: 'Forest', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'fin-zill', arabic: 'ظِلّ', transliteration: 'zill', english: 'Shadow/Shade', category: 'word', difficulty: 2, tags: ["nature"] },
  { id: 'fin-wuquf', arabic: 'وُقُوف', transliteration: 'wuquf', english: 'Standing (Arafat)', category: 'word', difficulty: 3, tags: ["hajj"] },
  { id: "fin-sai", arabic: "سَعْي", transliteration: "sa'y", english: "Walking (ritual)", category: "word", difficulty: 2, tags: ["hajj"] },
  { id: 'fin-rami', arabic: 'رَمْي', transliteration: 'ramy', english: 'Stoning (ritual)', category: 'word', difficulty: 3, tags: ["hajj"] },
  { id: 'fin-nahr', arabic: 'نَحْر', transliteration: 'nahr', english: 'Sacrifice', category: 'word', difficulty: 2, tags: ["hajj"] },
  { id: 'fin-ihram', arabic: 'إِحْرَام', transliteration: 'ihram', english: 'State of consecration', category: 'word', difficulty: 2, tags: ["hajj"] },
  { id: 'fin-tahallul', arabic: 'تَحَلُّل', transliteration: 'tahallul', english: 'Exiting ihram', category: 'word', difficulty: 3, tags: ["hajj"] },
  { id: 'fin-fidya', arabic: 'فِدْيَة', transliteration: 'fidyah', english: 'Ransom', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'fin-kaffara', arabic: 'كَفَّارَة', transliteration: 'kaffarah', english: 'Expiation', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'fin-qurbah', arabic: 'قُرْبَة', transliteration: 'qurbah', english: 'Act of nearness', category: 'word', difficulty: 2, tags: ["worship"] },
  { id: 'fin-thawaab', arabic: 'ثَوَاب', transliteration: 'thawab', english: 'Reward', category: 'word', difficulty: 1, tags: ["worship"] },
  { id: 'fin-halaal', arabic: 'حَلَال', transliteration: 'halal', english: 'Permissible', category: 'word', difficulty: 1, tags: ["fiqh"] },
  { id: 'fin-haraam', arabic: 'حَرَام', transliteration: 'haram', english: 'Forbidden', category: 'word', difficulty: 1, tags: ["fiqh"] },
  { id: 'fin-makruh2', arabic: 'مَكْرُوه', transliteration: 'makruh', english: 'Disliked', category: 'word', difficulty: 2, tags: ["fiqh"] },
  { id: 'fin-mandub', arabic: 'مَنْدُوب', transliteration: 'mandub', english: 'Recommended', category: 'word', difficulty: 2, tags: ["fiqh"] },
  { id: 'fin-fard', arabic: 'فَرْض', transliteration: 'fard', english: 'Obligatory', category: 'word', difficulty: 1, tags: ["fiqh"] },
  { id: 'fin-wajib2', arabic: 'وَاجِب', transliteration: 'wajib', english: 'Necessary', category: 'word', difficulty: 2, tags: ["fiqh"] },
  { id: 'fin-sunna', arabic: 'سُنَّة', transliteration: 'sunnah', english: 'Prophetic practice', category: 'word', difficulty: 1, tags: ["fiqh"] },
  { id: 'fin-nafl', arabic: 'نَفْل', transliteration: 'nafl', english: 'Voluntary', category: 'word', difficulty: 2, tags: ["fiqh"] },
  { id: "fin-ijma", arabic: "إِجْمَاع", transliteration: "ijma'", english: "Consensus", category: "word", difficulty: 3, tags: ["fiqh"] },
  { id: 'fin-qiyas', arabic: 'قِيَاس', transliteration: 'qiyas', english: 'Analogy', category: 'word', difficulty: 3, tags: ["fiqh"] },
  { id: 'fin-ijtihad', arabic: 'اجْتِهَاد', transliteration: 'ijtihad', english: 'Legal reasoning', category: 'word', difficulty: 3, tags: ["fiqh"] },
  { id: 'fin-fatwa', arabic: 'فَتْوَى', transliteration: 'fatwa', english: 'Legal opinion', category: 'word', difficulty: 2, tags: ["fiqh"] },
  { id: 'fin-ustad', arabic: 'أُسْتَاذ', transliteration: 'ustadh', english: 'Teacher', category: 'word', difficulty: 1, tags: ["people"] },
  { id: 'fin-talib', arabic: 'طَالِب', transliteration: 'talib', english: 'Student', category: 'word', difficulty: 1, tags: ["people"] },
  { id: 'fin-hafiz', arabic: 'حَافِظ', transliteration: 'hafiz', english: 'Memorizer', category: 'word', difficulty: 2, tags: ["people"] },
  { id: "fin-qari", arabic: "قَارِئ", transliteration: "qari'", english: "Reciter", category: "word", difficulty: 2, tags: ["people"] },
  { id: 'fin-mufassir', arabic: 'مُفَسِّر', transliteration: 'mufassir', english: 'Interpreter', category: 'word', difficulty: 3, tags: ["people"] },
  { id: 'fin-muhaddith', arabic: 'مُحَدِّث', transliteration: 'muhaddith', english: 'Hadith scholar', category: 'word', difficulty: 3, tags: ["people"] },
  { id: 'fin-faqih', arabic: 'فَقِيه', transliteration: 'faqih', english: 'Jurist', category: 'word', difficulty: 3, tags: ["people"] },
  { id: 'fin-mufti', arabic: 'مُفْتِي', transliteration: 'mufti', english: 'Legal expert', category: 'word', difficulty: 3, tags: ["people"] },
  { id: 'fin-imam2', arabic: 'إِمَام', transliteration: 'imam', english: 'Prayer leader', category: 'word', difficulty: 1, tags: ["people"] },
  { id: "fin-muadhin", arabic: "مُؤَذِّن", transliteration: "mu'adhin", english: "Caller to prayer", category: "word", difficulty: 2, tags: ["people"] },
  { id: 'fin-khatib', arabic: 'خَطِيب', transliteration: 'khatib', english: 'Preacher', category: 'word', difficulty: 2, tags: ["people"] },
];

// Flashcard Decks
// ============================================
export const FLASHCARD_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-alphabet',
    name: 'Arabic Alphabet',
    nameArabic: 'الحروف العربية',
    description: 'Learn all 28 Arabic letters',
    icon: '🔤',
    cards: ARABIC_LETTERS,
    totalWords: ARABIC_LETTERS.length,
  },
  {
    id: 'deck-names-of-allah',
    name: '99 Names of Allah',
    nameArabic: 'أسماء الله الحسنى',
    description: 'The beautiful names and attributes of Allah',
    icon: '✨',
    cards: NAMES_OF_ALLAH,
    totalWords: NAMES_OF_ALLAH.length,
  },
  {
    id: 'deck-essential',
    name: 'Essential Words',
    nameArabic: 'الكلمات الأساسية',
    description: 'The most common words in the Quran',
    icon: '⭐',
    cards: ESSENTIAL_WORDS,
    totalWords: ESSENTIAL_WORDS.length,
  },
  {
    id: 'deck-particles',
    name: 'Particles & Prepositions',
    nameArabic: 'الحروف والأدوات',
    description: 'Connecting words and prepositions',
    icon: '🔗',
    cards: PARTICLES,
    totalWords: PARTICLES.length,
  },
  {
    id: 'deck-verbs',
    name: 'Common Verbs',
    nameArabic: 'الأفعال الشائعة',
    description: 'Most frequent action words',
    icon: '🏃',
    cards: VERBS,
    totalWords: VERBS.length,
  },
  {
    id: 'deck-prayer',
    name: 'Prayer & Worship',
    nameArabic: 'الصلاة والعبادة',
    description: 'Prayer, fasting, and worship vocabulary',
    icon: '🕌',
    cards: PRAYER_VOCAB,
    totalWords: PRAYER_VOCAB.length,
  },
  {
    id: 'deck-nature',
    name: 'Nature & Creation',
    nameArabic: 'الطبيعة والخلق',
    description: 'Sky, earth, animals, plants',
    icon: '🌿',
    cards: NATURE_VOCAB,
    totalWords: NATURE_VOCAB.length,
  },
  {
    id: 'deck-judgment',
    name: 'Day of Judgment',
    nameArabic: 'يوم القيامة',
    description: 'Afterlife: paradise, hell, angels',
    icon: '⚖️',
    cards: JUDGMENT_VOCAB,
    totalWords: JUDGMENT_VOCAB.length,
  },
  {
    id: 'deck-prophets',
    name: 'Prophets & Stories',
    nameArabic: 'الأنبياء والقصص',
    description: 'Prophets, nations, and narratives',
    icon: '📖',
    cards: PROPHETS_VOCAB,
    totalWords: PROPHETS_VOCAB.length,
  },
  {
    id: 'deck-tajweed',
    name: 'Tajweed Rules',
    nameArabic: 'أحكام التجويد',
    description: 'Rules of Quranic recitation',
    icon: '🎯',
    cards: TAJWEED_RULES,
    totalWords: TAJWEED_RULES.length,
  },
  {
    id: 'deck-all-words',
    name: 'Complete Collection',
    nameArabic: 'المجموعة الكاملة',
    description: 'All vocabulary words combined',
    icon: '🎓',
    cards: [
      ...NAMES_OF_ALLAH,
      ...ESSENTIAL_WORDS,
      ...PARTICLES,
      ...VERBS,
      ...PRAYER_VOCAB,
      ...NATURE_VOCAB,
      ...JUDGMENT_VOCAB,
      ...PROPHETS_VOCAB,
      ...ADDITIONAL_NOUNS,
      ...ADDITIONAL_VERBS,
      ...ADJECTIVES,
      ...MORE_NATURE,
      ...MORE_JUDGMENT,
      ...MORE_PROPHETS,
      ...MORE_WORSHIP,
      ...CONCEPTS,
      ...MORE_VERBS,
      ...QURAN_PHRASES,
      ...NUMBERS,
      ...TIME_WORDS,
      ...BODY_PARTS,
      ...COLORS,
      ...DIRECTIONS,
      ...ETHICS,
      ...SOCIETY,
      ...ADVERBS,
      ...FINAL_VOCAB,
    ],
    totalWords: 0, // Set below
  },
];

// Set total for complete collection
FLASHCARD_DECKS.find(d => d.id === 'deck-all-words')!.totalWords = 
  FLASHCARD_DECKS.find(d => d.id === 'deck-all-words')!.cards.length;

// ============================================
// Spaced Repetition (SM-2)
// ============================================
const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5;
}

export function calculateNextReview(
  progress: FlashcardProgress | null,
  result: ReviewResult
): FlashcardProgress {
  const now = Date.now();
  
  if (!progress) {
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
  
  easeFactor = Math.max(
    MIN_EASE,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );
  
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);
    repetitions += 1;
  }
  
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
// Storage
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
  
  const seen = new Set<string>();
  cards = cards.filter(card => {
    if (seen.has(card.id)) return false;
    seen.add(card.id);
    return true;
  });
  
  return cards.filter(card => {
    const cardProgress = progress[card.id];
    if (!cardProgress) return true;
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

export function getDeckStats(deckId: string) {
  const deck = FLASHCARD_DECKS.find(d => d.id === deckId);
  if (!deck) return { total: 0, learned: 0, due: 0, mastered: 0 };
  
  const progress = getFlashcardProgress();
  const now = Date.now();
  
  let learned = 0, due = 0, mastered = 0;
  
  for (const card of deck.cards) {
    const p = progress[card.id];
    if (p) {
      learned++;
      if (p.nextReview <= now) due++;
      if (p.interval >= 21) mastered++;
    }
  }
  
  return { total: deck.cards.length, learned, due, mastered };
}

export function getTotalVocabularyCount(): number {
  const seen = new Set<string>();
  for (const deck of FLASHCARD_DECKS) {
    if (deck.id === 'deck-alphabet' || deck.id === 'deck-tajweed' || deck.id === 'deck-all-words') continue;
    for (const card of deck.cards) seen.add(card.id);
  }
  return seen.size;
}

export const ALL_FLASHCARDS = [
  ...ARABIC_LETTERS,
  ...NAMES_OF_ALLAH,
  ...ESSENTIAL_WORDS,
  ...PARTICLES,
  ...VERBS,
  ...PRAYER_VOCAB,
  ...NATURE_VOCAB,
  ...JUDGMENT_VOCAB,
  ...PROPHETS_VOCAB,
  ...ADDITIONAL_NOUNS,
  ...ADDITIONAL_VERBS,
  ...ADJECTIVES,
  ...MORE_NATURE,
  ...MORE_JUDGMENT,
  ...MORE_PROPHETS,
  ...MORE_WORSHIP,
  ...CONCEPTS,
  ...MORE_VERBS,
  ...QURAN_PHRASES,
  ...NUMBERS,
  ...TIME_WORDS,
  ...BODY_PARTS,
  ...COLORS,
  ...DIRECTIONS,
  ...ETHICS,
  ...SOCIETY,
  ...ADVERBS,
  ...FINAL_VOCAB,
  ...TAJWEED_RULES,
];

export const TOTAL_UNIQUE_WORDS = getTotalVocabularyCount();
