/**
 * Complete Surah Metadata with Juz Information
 * All 114 surahs with comprehensive data for the Surah Index page
 */

export interface Surah {
  number: number;
  name: string;           // English transliteration
  arabicName: string;     // Arabic script
  meaning: string;        // English translation of name
  verses: number;         // Total ayahs
  revelationType: 'Meccan' | 'Medinan';
  juz: number;            // Starting juz (1-30)
  rukus: number;          // Number of rukus
  sajdas: number;         // Number of sajda verses
}

export const surahs: Surah[] = [
  { number: 1, name: "Al-Fatiha", arabicName: "الفاتحة", meaning: "The Opening", verses: 7, revelationType: "Meccan", juz: 1, rukus: 1, sajdas: 0 },
  { number: 2, name: "Al-Baqarah", arabicName: "البقرة", meaning: "The Cow", verses: 286, revelationType: "Medinan", juz: 1, rukus: 40, sajdas: 1 },
  { number: 3, name: "Aal-i-Imran", arabicName: "آل عمران", meaning: "The Family of Imran", verses: 200, revelationType: "Medinan", juz: 3, rukus: 20, sajdas: 0 },
  { number: 4, name: "An-Nisa", arabicName: "النساء", meaning: "The Women", verses: 176, revelationType: "Medinan", juz: 4, rukus: 24, sajdas: 0 },
  { number: 5, name: "Al-Ma'idah", arabicName: "المائدة", meaning: "The Table Spread", verses: 120, revelationType: "Medinan", juz: 6, rukus: 16, sajdas: 0 },
  { number: 6, name: "Al-An'am", arabicName: "الأنعام", meaning: "The Cattle", verses: 165, revelationType: "Meccan", juz: 7, rukus: 20, sajdas: 0 },
  { number: 7, name: "Al-A'raf", arabicName: "الأعراف", meaning: "The Heights", verses: 206, revelationType: "Meccan", juz: 8, rukus: 24, sajdas: 1 },
  { number: 8, name: "Al-Anfal", arabicName: "الأنفال", meaning: "The Spoils of War", verses: 75, revelationType: "Medinan", juz: 9, rukus: 10, sajdas: 0 },
  { number: 9, name: "At-Tawbah", arabicName: "التوبة", meaning: "The Repentance", verses: 129, revelationType: "Medinan", juz: 10, rukus: 16, sajdas: 0 },
  { number: 10, name: "Yunus", arabicName: "يونس", meaning: "Jonah", verses: 109, revelationType: "Meccan", juz: 11, rukus: 11, sajdas: 0 },
  { number: 11, name: "Hud", arabicName: "هود", meaning: "Hud", verses: 123, revelationType: "Meccan", juz: 11, rukus: 10, sajdas: 0 },
  { number: 12, name: "Yusuf", arabicName: "يوسف", meaning: "Joseph", verses: 111, revelationType: "Meccan", juz: 12, rukus: 12, sajdas: 0 },
  { number: 13, name: "Ar-Ra'd", arabicName: "الرعد", meaning: "The Thunder", verses: 43, revelationType: "Medinan", juz: 13, rukus: 6, sajdas: 1 },
  { number: 14, name: "Ibrahim", arabicName: "إبراهيم", meaning: "Abraham", verses: 52, revelationType: "Meccan", juz: 13, rukus: 7, sajdas: 0 },
  { number: 15, name: "Al-Hijr", arabicName: "الحجر", meaning: "The Rocky Tract", verses: 99, revelationType: "Meccan", juz: 14, rukus: 6, sajdas: 0 },
  { number: 16, name: "An-Nahl", arabicName: "النحل", meaning: "The Bee", verses: 128, revelationType: "Meccan", juz: 14, rukus: 16, sajdas: 1 },
  { number: 17, name: "Al-Isra", arabicName: "الإسراء", meaning: "The Night Journey", verses: 111, revelationType: "Meccan", juz: 15, rukus: 12, sajdas: 1 },
  { number: 18, name: "Al-Kahf", arabicName: "الكهف", meaning: "The Cave", verses: 110, revelationType: "Meccan", juz: 15, rukus: 12, sajdas: 0 },
  { number: 19, name: "Maryam", arabicName: "مريم", meaning: "Mary", verses: 98, revelationType: "Meccan", juz: 16, rukus: 6, sajdas: 1 },
  { number: 20, name: "Ta-Ha", arabicName: "طه", meaning: "Ta-Ha", verses: 135, revelationType: "Meccan", juz: 16, rukus: 8, sajdas: 0 },
  { number: 21, name: "Al-Anbiya", arabicName: "الأنبياء", meaning: "The Prophets", verses: 112, revelationType: "Meccan", juz: 17, rukus: 7, sajdas: 0 },
  { number: 22, name: "Al-Hajj", arabicName: "الحج", meaning: "The Pilgrimage", verses: 78, revelationType: "Medinan", juz: 17, rukus: 10, sajdas: 2 },
  { number: 23, name: "Al-Mu'minun", arabicName: "المؤمنون", meaning: "The Believers", verses: 118, revelationType: "Meccan", juz: 18, rukus: 6, sajdas: 0 },
  { number: 24, name: "An-Nur", arabicName: "النور", meaning: "The Light", verses: 64, revelationType: "Medinan", juz: 18, rukus: 9, sajdas: 0 },
  { number: 25, name: "Al-Furqan", arabicName: "الفرقان", meaning: "The Criterion", verses: 77, revelationType: "Meccan", juz: 18, rukus: 6, sajdas: 1 },
  { number: 26, name: "Ash-Shu'ara", arabicName: "الشعراء", meaning: "The Poets", verses: 227, revelationType: "Meccan", juz: 19, rukus: 11, sajdas: 0 },
  { number: 27, name: "An-Naml", arabicName: "النمل", meaning: "The Ant", verses: 93, revelationType: "Meccan", juz: 19, rukus: 7, sajdas: 1 },
  { number: 28, name: "Al-Qasas", arabicName: "القصص", meaning: "The Stories", verses: 88, revelationType: "Meccan", juz: 20, rukus: 9, sajdas: 0 },
  { number: 29, name: "Al-Ankabut", arabicName: "العنكبوت", meaning: "The Spider", verses: 69, revelationType: "Meccan", juz: 20, rukus: 7, sajdas: 0 },
  { number: 30, name: "Ar-Rum", arabicName: "الروم", meaning: "The Romans", verses: 60, revelationType: "Meccan", juz: 21, rukus: 6, sajdas: 0 },
  { number: 31, name: "Luqman", arabicName: "لقمان", meaning: "Luqman", verses: 34, revelationType: "Meccan", juz: 21, rukus: 4, sajdas: 0 },
  { number: 32, name: "As-Sajdah", arabicName: "السجدة", meaning: "The Prostration", verses: 30, revelationType: "Meccan", juz: 21, rukus: 3, sajdas: 1 },
  { number: 33, name: "Al-Ahzab", arabicName: "الأحزاب", meaning: "The Combined Forces", verses: 73, revelationType: "Medinan", juz: 21, rukus: 9, sajdas: 0 },
  { number: 34, name: "Saba", arabicName: "سبأ", meaning: "Sheba", verses: 54, revelationType: "Meccan", juz: 22, rukus: 6, sajdas: 0 },
  { number: 35, name: "Fatir", arabicName: "فاطر", meaning: "The Originator", verses: 45, revelationType: "Meccan", juz: 22, rukus: 5, sajdas: 0 },
  { number: 36, name: "Ya-Sin", arabicName: "يس", meaning: "Ya-Sin", verses: 83, revelationType: "Meccan", juz: 22, rukus: 5, sajdas: 0 },
  { number: 37, name: "As-Saffat", arabicName: "الصافات", meaning: "Those Who Set The Ranks", verses: 182, revelationType: "Meccan", juz: 23, rukus: 5, sajdas: 0 },
  { number: 38, name: "Sad", arabicName: "ص", meaning: "The Letter Sad", verses: 88, revelationType: "Meccan", juz: 23, rukus: 5, sajdas: 1 },
  { number: 39, name: "Az-Zumar", arabicName: "الزمر", meaning: "The Troops", verses: 75, revelationType: "Meccan", juz: 23, rukus: 8, sajdas: 0 },
  { number: 40, name: "Ghafir", arabicName: "غافر", meaning: "The Forgiver", verses: 85, revelationType: "Meccan", juz: 24, rukus: 9, sajdas: 0 },
  { number: 41, name: "Fussilat", arabicName: "فصلت", meaning: "Explained in Detail", verses: 54, revelationType: "Meccan", juz: 24, rukus: 6, sajdas: 1 },
  { number: 42, name: "Ash-Shura", arabicName: "الشورى", meaning: "The Consultation", verses: 53, revelationType: "Meccan", juz: 25, rukus: 5, sajdas: 0 },
  { number: 43, name: "Az-Zukhruf", arabicName: "الزخرف", meaning: "The Gold Adornment", verses: 89, revelationType: "Meccan", juz: 25, rukus: 7, sajdas: 0 },
  { number: 44, name: "Ad-Dukhan", arabicName: "الدخان", meaning: "The Smoke", verses: 59, revelationType: "Meccan", juz: 25, rukus: 3, sajdas: 0 },
  { number: 45, name: "Al-Jathiyah", arabicName: "الجاثية", meaning: "The Crouching", verses: 37, revelationType: "Meccan", juz: 25, rukus: 4, sajdas: 0 },
  { number: 46, name: "Al-Ahqaf", arabicName: "الأحقاف", meaning: "The Wind-Curved Sandhills", verses: 35, revelationType: "Meccan", juz: 26, rukus: 4, sajdas: 0 },
  { number: 47, name: "Muhammad", arabicName: "محمد", meaning: "Muhammad", verses: 38, revelationType: "Medinan", juz: 26, rukus: 4, sajdas: 0 },
  { number: 48, name: "Al-Fath", arabicName: "الفتح", meaning: "The Victory", verses: 29, revelationType: "Medinan", juz: 26, rukus: 4, sajdas: 0 },
  { number: 49, name: "Al-Hujurat", arabicName: "الحجرات", meaning: "The Rooms", verses: 18, revelationType: "Medinan", juz: 26, rukus: 2, sajdas: 0 },
  { number: 50, name: "Qaf", arabicName: "ق", meaning: "The Letter Qaf", verses: 45, revelationType: "Meccan", juz: 26, rukus: 3, sajdas: 0 },
  { number: 51, name: "Adh-Dhariyat", arabicName: "الذاريات", meaning: "The Winnowing Winds", verses: 60, revelationType: "Meccan", juz: 26, rukus: 3, sajdas: 0 },
  { number: 52, name: "At-Tur", arabicName: "الطور", meaning: "The Mount", verses: 49, revelationType: "Meccan", juz: 27, rukus: 2, sajdas: 0 },
  { number: 53, name: "An-Najm", arabicName: "النجم", meaning: "The Star", verses: 62, revelationType: "Meccan", juz: 27, rukus: 3, sajdas: 1 },
  { number: 54, name: "Al-Qamar", arabicName: "القمر", meaning: "The Moon", verses: 55, revelationType: "Meccan", juz: 27, rukus: 3, sajdas: 0 },
  { number: 55, name: "Ar-Rahman", arabicName: "الرحمن", meaning: "The Beneficent", verses: 78, revelationType: "Medinan", juz: 27, rukus: 3, sajdas: 0 },
  { number: 56, name: "Al-Waqi'ah", arabicName: "الواقعة", meaning: "The Inevitable", verses: 96, revelationType: "Meccan", juz: 27, rukus: 3, sajdas: 0 },
  { number: 57, name: "Al-Hadid", arabicName: "الحديد", meaning: "The Iron", verses: 29, revelationType: "Medinan", juz: 27, rukus: 4, sajdas: 0 },
  { number: 58, name: "Al-Mujadila", arabicName: "المجادلة", meaning: "The Pleading Woman", verses: 22, revelationType: "Medinan", juz: 28, rukus: 3, sajdas: 0 },
  { number: 59, name: "Al-Hashr", arabicName: "الحشر", meaning: "The Exile", verses: 24, revelationType: "Medinan", juz: 28, rukus: 3, sajdas: 0 },
  { number: 60, name: "Al-Mumtahanah", arabicName: "الممتحنة", meaning: "She That Is Examined", verses: 13, revelationType: "Medinan", juz: 28, rukus: 2, sajdas: 0 },
  { number: 61, name: "As-Saff", arabicName: "الصف", meaning: "The Ranks", verses: 14, revelationType: "Medinan", juz: 28, rukus: 2, sajdas: 0 },
  { number: 62, name: "Al-Jumu'ah", arabicName: "الجمعة", meaning: "Friday", verses: 11, revelationType: "Medinan", juz: 28, rukus: 2, sajdas: 0 },
  { number: 63, name: "Al-Munafiqun", arabicName: "المنافقون", meaning: "The Hypocrites", verses: 11, revelationType: "Medinan", juz: 28, rukus: 2, sajdas: 0 },
  { number: 64, name: "At-Taghabun", arabicName: "التغابن", meaning: "The Mutual Disillusion", verses: 18, revelationType: "Medinan", juz: 28, rukus: 2, sajdas: 0 },
  { number: 65, name: "At-Talaq", arabicName: "الطلاق", meaning: "The Divorce", verses: 12, revelationType: "Medinan", juz: 28, rukus: 2, sajdas: 0 },
  { number: 66, name: "At-Tahrim", arabicName: "التحريم", meaning: "The Prohibition", verses: 12, revelationType: "Medinan", juz: 28, rukus: 2, sajdas: 0 },
  { number: 67, name: "Al-Mulk", arabicName: "الملك", meaning: "The Sovereignty", verses: 30, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 68, name: "Al-Qalam", arabicName: "القلم", meaning: "The Pen", verses: 52, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 69, name: "Al-Haqqah", arabicName: "الحاقة", meaning: "The Reality", verses: 52, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 70, name: "Al-Ma'arij", arabicName: "المعارج", meaning: "The Ascending Stairways", verses: 44, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 71, name: "Nuh", arabicName: "نوح", meaning: "Noah", verses: 28, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 72, name: "Al-Jinn", arabicName: "الجن", meaning: "The Jinn", verses: 28, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 73, name: "Al-Muzzammil", arabicName: "المزمل", meaning: "The Enshrouded One", verses: 20, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 74, name: "Al-Muddaththir", arabicName: "المدثر", meaning: "The Cloaked One", verses: 56, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 75, name: "Al-Qiyamah", arabicName: "القيامة", meaning: "The Resurrection", verses: 40, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 76, name: "Al-Insan", arabicName: "الإنسان", meaning: "The Human", verses: 31, revelationType: "Medinan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 77, name: "Al-Mursalat", arabicName: "المرسلات", meaning: "The Emissaries", verses: 50, revelationType: "Meccan", juz: 29, rukus: 2, sajdas: 0 },
  { number: 78, name: "An-Naba", arabicName: "النبأ", meaning: "The Tidings", verses: 40, revelationType: "Meccan", juz: 30, rukus: 2, sajdas: 0 },
  { number: 79, name: "An-Nazi'at", arabicName: "النازعات", meaning: "Those Who Drag Forth", verses: 46, revelationType: "Meccan", juz: 30, rukus: 2, sajdas: 0 },
  { number: 80, name: "Abasa", arabicName: "عبس", meaning: "He Frowned", verses: 42, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 81, name: "At-Takwir", arabicName: "التكوير", meaning: "The Overthrowing", verses: 29, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 82, name: "Al-Infitar", arabicName: "الانفطار", meaning: "The Cleaving", verses: 19, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 83, name: "Al-Mutaffifin", arabicName: "المطففين", meaning: "The Defrauding", verses: 36, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 84, name: "Al-Inshiqaq", arabicName: "الانشقاق", meaning: "The Splitting Open", verses: 25, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 1 },
  { number: 85, name: "Al-Buruj", arabicName: "البروج", meaning: "The Great Stars", verses: 22, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 86, name: "At-Tariq", arabicName: "الطارق", meaning: "The Nightcommer", verses: 17, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 87, name: "Al-A'la", arabicName: "الأعلى", meaning: "The Most High", verses: 19, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 88, name: "Al-Ghashiyah", arabicName: "الغاشية", meaning: "The Overwhelming", verses: 26, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 89, name: "Al-Fajr", arabicName: "الفجر", meaning: "The Dawn", verses: 30, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 90, name: "Al-Balad", arabicName: "البلد", meaning: "The City", verses: 20, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 91, name: "Ash-Shams", arabicName: "الشمس", meaning: "The Sun", verses: 15, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 92, name: "Al-Layl", arabicName: "الليل", meaning: "The Night", verses: 21, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 93, name: "Ad-Duha", arabicName: "الضحى", meaning: "The Morning Hours", verses: 11, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 94, name: "Ash-Sharh", arabicName: "الشرح", meaning: "The Relief", verses: 8, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 95, name: "At-Tin", arabicName: "التين", meaning: "The Fig", verses: 8, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 96, name: "Al-Alaq", arabicName: "العلق", meaning: "The Clot", verses: 19, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 1 },
  { number: 97, name: "Al-Qadr", arabicName: "القدر", meaning: "The Power", verses: 5, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 98, name: "Al-Bayyinah", arabicName: "البينة", meaning: "The Clear Proof", verses: 8, revelationType: "Medinan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 99, name: "Az-Zalzalah", arabicName: "الزلزلة", meaning: "The Earthquake", verses: 8, revelationType: "Medinan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 100, name: "Al-Adiyat", arabicName: "العاديات", meaning: "The Courser", verses: 11, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 101, name: "Al-Qari'ah", arabicName: "القارعة", meaning: "The Calamity", verses: 11, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 102, name: "At-Takathur", arabicName: "التكاثر", meaning: "The Rivalry in World Increase", verses: 8, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 103, name: "Al-Asr", arabicName: "العصر", meaning: "The Declining Day", verses: 3, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 104, name: "Al-Humazah", arabicName: "الهمزة", meaning: "The Traducer", verses: 9, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 105, name: "Al-Fil", arabicName: "الفيل", meaning: "The Elephant", verses: 5, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 106, name: "Quraysh", arabicName: "قريش", meaning: "Quraysh", verses: 4, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 107, name: "Al-Ma'un", arabicName: "الماعون", meaning: "The Small Kindnesses", verses: 7, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 108, name: "Al-Kawthar", arabicName: "الكوثر", meaning: "The Abundance", verses: 3, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 109, name: "Al-Kafirun", arabicName: "الكافرون", meaning: "The Disbelievers", verses: 6, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 110, name: "An-Nasr", arabicName: "النصر", meaning: "The Divine Support", verses: 3, revelationType: "Medinan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 111, name: "Al-Masad", arabicName: "المسد", meaning: "The Palm Fiber", verses: 5, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", meaning: "The Sincerity", verses: 4, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 113, name: "Al-Falaq", arabicName: "الفلق", meaning: "The Daybreak", verses: 5, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
  { number: 114, name: "An-Nas", arabicName: "الناس", meaning: "Mankind", verses: 6, revelationType: "Meccan", juz: 30, rukus: 1, sajdas: 0 },
];

// Helper functions
export function getSurah(number: number): Surah | undefined {
  return surahs.find(s => s.number === number);
}

export function getSurahsByRevelation(type: 'Meccan' | 'Medinan'): Surah[] {
  return surahs.filter(s => s.revelationType === type);
}

export function getSurahsByJuz(juz: number): Surah[] {
  return surahs.filter(s => s.juz === juz);
}

export function getJuzAmmaSurahs(): Surah[] {
  return surahs.filter(s => s.juz === 30);
}

export function searchSurahs(query: string): Surah[] {
  const q = query.toLowerCase();
  return surahs.filter(s => 
    s.name.toLowerCase().includes(q) ||
    s.arabicName.includes(q) ||
    s.meaning.toLowerCase().includes(q) ||
    s.number.toString() === q
  );
}

// Statistics
export const QURAN_STATS = {
  totalSurahs: 114,
  totalAyahs: 6236,
  totalJuz: 30,
  meccanSurahs: surahs.filter(s => s.revelationType === 'Meccan').length,
  medinanSurahs: surahs.filter(s => s.revelationType === 'Medinan').length,
  shortestSurah: { number: 108, name: 'Al-Kawthar', verses: 3 },
  longestSurah: { number: 2, name: 'Al-Baqarah', verses: 286 },
};
