'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  Star,
  Grid3X3,
  List,
  Layers,
  ChevronDown,
  Plus,
  BookOpen,
  Sun,
  Moon,
} from 'lucide-react';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 🕌 THE GARDEN OF SURAHS — A Living Map of the Quran
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ─── Complete Surah Data (114 Surahs) ─────────────────────────────
export interface SurahData {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  ayahs: number;
  revelation: 'makki' | 'madani';
  juz: number[];
  order: number;
  rukus: number;
}

export const SURAHS: SurahData[] = [
  { id: 1, name: "Al-Fatihah", arabic: "الفاتحة", meaning: "The Opening", ayahs: 7, revelation: "makki", juz: [1], order: 5, rukus: 1 },
  { id: 2, name: "Al-Baqarah", arabic: "البقرة", meaning: "The Cow", ayahs: 286, revelation: "madani", juz: [1,2,3], order: 87, rukus: 40 },
  { id: 3, name: "Ali 'Imran", arabic: "آل عمران", meaning: "Family of Imran", ayahs: 200, revelation: "madani", juz: [3,4], order: 89, rukus: 20 },
  { id: 4, name: "An-Nisa", arabic: "النساء", meaning: "The Women", ayahs: 176, revelation: "madani", juz: [4,5,6], order: 92, rukus: 24 },
  { id: 5, name: "Al-Ma'idah", arabic: "المائدة", meaning: "The Table Spread", ayahs: 120, revelation: "madani", juz: [6,7], order: 112, rukus: 16 },
  { id: 6, name: "Al-An'am", arabic: "الأنعام", meaning: "The Cattle", ayahs: 165, revelation: "makki", juz: [7,8], order: 55, rukus: 20 },
  { id: 7, name: "Al-A'raf", arabic: "الأعراف", meaning: "The Heights", ayahs: 206, revelation: "makki", juz: [8,9], order: 39, rukus: 24 },
  { id: 8, name: "Al-Anfal", arabic: "الأنفال", meaning: "The Spoils of War", ayahs: 75, revelation: "madani", juz: [9,10], order: 88, rukus: 10 },
  { id: 9, name: "At-Tawbah", arabic: "التوبة", meaning: "The Repentance", ayahs: 129, revelation: "madani", juz: [10,11], order: 113, rukus: 16 },
  { id: 10, name: "Yunus", arabic: "يونس", meaning: "Jonah", ayahs: 109, revelation: "makki", juz: [11], order: 51, rukus: 11 },
  { id: 11, name: "Hud", arabic: "هود", meaning: "Hud", ayahs: 123, revelation: "makki", juz: [11,12], order: 52, rukus: 10 },
  { id: 12, name: "Yusuf", arabic: "يوسف", meaning: "Joseph", ayahs: 111, revelation: "makki", juz: [12,13], order: 53, rukus: 12 },
  { id: 13, name: "Ar-Ra'd", arabic: "الرعد", meaning: "The Thunder", ayahs: 43, revelation: "madani", juz: [13], order: 96, rukus: 6 },
  { id: 14, name: "Ibrahim", arabic: "إبراهيم", meaning: "Abraham", ayahs: 52, revelation: "makki", juz: [13], order: 72, rukus: 7 },
  { id: 15, name: "Al-Hijr", arabic: "الحجر", meaning: "The Rocky Tract", ayahs: 99, revelation: "makki", juz: [14], order: 54, rukus: 6 },
  { id: 16, name: "An-Nahl", arabic: "النحل", meaning: "The Bee", ayahs: 128, revelation: "makki", juz: [14], order: 70, rukus: 16 },
  { id: 17, name: "Al-Isra", arabic: "الإسراء", meaning: "The Night Journey", ayahs: 111, revelation: "makki", juz: [15], order: 50, rukus: 12 },
  { id: 18, name: "Al-Kahf", arabic: "الكهف", meaning: "The Cave", ayahs: 110, revelation: "makki", juz: [15,16], order: 69, rukus: 12 },
  { id: 19, name: "Maryam", arabic: "مريم", meaning: "Mary", ayahs: 98, revelation: "makki", juz: [16], order: 44, rukus: 6 },
  { id: 20, name: "Ta-Ha", arabic: "طه", meaning: "Ta-Ha", ayahs: 135, revelation: "makki", juz: [16], order: 45, rukus: 8 },
  { id: 21, name: "Al-Anbiya", arabic: "الأنبياء", meaning: "The Prophets", ayahs: 112, revelation: "makki", juz: [17], order: 73, rukus: 7 },
  { id: 22, name: "Al-Hajj", arabic: "الحج", meaning: "The Pilgrimage", ayahs: 78, revelation: "madani", juz: [17], order: 103, rukus: 10 },
  { id: 23, name: "Al-Mu'minun", arabic: "المؤمنون", meaning: "The Believers", ayahs: 118, revelation: "makki", juz: [18], order: 74, rukus: 6 },
  { id: 24, name: "An-Nur", arabic: "النور", meaning: "The Light", ayahs: 64, revelation: "madani", juz: [18], order: 102, rukus: 9 },
  { id: 25, name: "Al-Furqan", arabic: "الفرقان", meaning: "The Criterion", ayahs: 77, revelation: "makki", juz: [18,19], order: 42, rukus: 6 },
  { id: 26, name: "Ash-Shu'ara", arabic: "الشعراء", meaning: "The Poets", ayahs: 227, revelation: "makki", juz: [19], order: 47, rukus: 11 },
  { id: 27, name: "An-Naml", arabic: "النمل", meaning: "The Ant", ayahs: 93, revelation: "makki", juz: [19,20], order: 48, rukus: 7 },
  { id: 28, name: "Al-Qasas", arabic: "القصص", meaning: "The Stories", ayahs: 88, revelation: "makki", juz: [20], order: 49, rukus: 9 },
  { id: 29, name: "Al-Ankabut", arabic: "العنكبوت", meaning: "The Spider", ayahs: 69, revelation: "makki", juz: [20,21], order: 85, rukus: 7 },
  { id: 30, name: "Ar-Rum", arabic: "الروم", meaning: "The Romans", ayahs: 60, revelation: "makki", juz: [21], order: 84, rukus: 6 },
  { id: 31, name: "Luqman", arabic: "لقمان", meaning: "Luqman", ayahs: 34, revelation: "makki", juz: [21], order: 57, rukus: 4 },
  { id: 32, name: "As-Sajdah", arabic: "السجدة", meaning: "The Prostration", ayahs: 30, revelation: "makki", juz: [21], order: 75, rukus: 3 },
  { id: 33, name: "Al-Ahzab", arabic: "الأحزاب", meaning: "The Combined Forces", ayahs: 73, revelation: "madani", juz: [21,22], order: 90, rukus: 9 },
  { id: 34, name: "Saba", arabic: "سبأ", meaning: "Sheba", ayahs: 54, revelation: "makki", juz: [22], order: 58, rukus: 6 },
  { id: 35, name: "Fatir", arabic: "فاطر", meaning: "The Originator", ayahs: 45, revelation: "makki", juz: [22], order: 43, rukus: 5 },
  { id: 36, name: "Ya-Sin", arabic: "يس", meaning: "Ya-Sin", ayahs: 83, revelation: "makki", juz: [22,23], order: 41, rukus: 5 },
  { id: 37, name: "As-Saffat", arabic: "الصافات", meaning: "Those Ranged in Ranks", ayahs: 182, revelation: "makki", juz: [23], order: 56, rukus: 5 },
  { id: 38, name: "Sad", arabic: "ص", meaning: "The Letter Sad", ayahs: 88, revelation: "makki", juz: [23], order: 38, rukus: 5 },
  { id: 39, name: "Az-Zumar", arabic: "الزمر", meaning: "The Troops", ayahs: 75, revelation: "makki", juz: [23,24], order: 59, rukus: 8 },
  { id: 40, name: "Ghafir", arabic: "غافر", meaning: "The Forgiver", ayahs: 85, revelation: "makki", juz: [24], order: 60, rukus: 9 },
  { id: 41, name: "Fussilat", arabic: "فصلت", meaning: "Explained in Detail", ayahs: 54, revelation: "makki", juz: [24,25], order: 61, rukus: 6 },
  { id: 42, name: "Ash-Shura", arabic: "الشورى", meaning: "The Consultation", ayahs: 53, revelation: "makki", juz: [25], order: 62, rukus: 5 },
  { id: 43, name: "Az-Zukhruf", arabic: "الزخرف", meaning: "The Gold Adornments", ayahs: 89, revelation: "makki", juz: [25], order: 63, rukus: 7 },
  { id: 44, name: "Ad-Dukhan", arabic: "الدخان", meaning: "The Smoke", ayahs: 59, revelation: "makki", juz: [25], order: 64, rukus: 3 },
  { id: 45, name: "Al-Jathiyah", arabic: "الجاثية", meaning: "The Crouching", ayahs: 37, revelation: "makki", juz: [25], order: 65, rukus: 4 },
  { id: 46, name: "Al-Ahqaf", arabic: "الأحقاف", meaning: "The Wind-Curved Sandhills", ayahs: 35, revelation: "makki", juz: [26], order: 66, rukus: 4 },
  { id: 47, name: "Muhammad", arabic: "محمد", meaning: "Muhammad", ayahs: 38, revelation: "madani", juz: [26], order: 95, rukus: 4 },
  { id: 48, name: "Al-Fath", arabic: "الفتح", meaning: "The Victory", ayahs: 29, revelation: "madani", juz: [26], order: 111, rukus: 4 },
  { id: 49, name: "Al-Hujurat", arabic: "الحجرات", meaning: "The Rooms", ayahs: 18, revelation: "madani", juz: [26], order: 106, rukus: 2 },
  { id: 50, name: "Qaf", arabic: "ق", meaning: "The Letter Qaf", ayahs: 45, revelation: "makki", juz: [26], order: 34, rukus: 3 },
  { id: 51, name: "Adh-Dhariyat", arabic: "الذاريات", meaning: "The Winnowing Winds", ayahs: 60, revelation: "makki", juz: [26,27], order: 67, rukus: 3 },
  { id: 52, name: "At-Tur", arabic: "الطور", meaning: "The Mount", ayahs: 49, revelation: "makki", juz: [27], order: 76, rukus: 2 },
  { id: 53, name: "An-Najm", arabic: "النجم", meaning: "The Star", ayahs: 62, revelation: "makki", juz: [27], order: 23, rukus: 3 },
  { id: 54, name: "Al-Qamar", arabic: "القمر", meaning: "The Moon", ayahs: 55, revelation: "makki", juz: [27], order: 37, rukus: 3 },
  { id: 55, name: "Ar-Rahman", arabic: "الرحمن", meaning: "The Beneficent", ayahs: 78, revelation: "madani", juz: [27], order: 97, rukus: 3 },
  { id: 56, name: "Al-Waqi'ah", arabic: "الواقعة", meaning: "The Inevitable", ayahs: 96, revelation: "makki", juz: [27], order: 46, rukus: 3 },
  { id: 57, name: "Al-Hadid", arabic: "الحديد", meaning: "The Iron", ayahs: 29, revelation: "madani", juz: [27], order: 94, rukus: 4 },
  { id: 58, name: "Al-Mujadila", arabic: "المجادلة", meaning: "The Pleading Woman", ayahs: 22, revelation: "madani", juz: [28], order: 105, rukus: 3 },
  { id: 59, name: "Al-Hashr", arabic: "الحشر", meaning: "The Exile", ayahs: 24, revelation: "madani", juz: [28], order: 101, rukus: 3 },
  { id: 60, name: "Al-Mumtahanah", arabic: "الممتحنة", meaning: "She That is Examined", ayahs: 13, revelation: "madani", juz: [28], order: 91, rukus: 2 },
  { id: 61, name: "As-Saff", arabic: "الصف", meaning: "The Ranks", ayahs: 14, revelation: "madani", juz: [28], order: 109, rukus: 2 },
  { id: 62, name: "Al-Jumu'ah", arabic: "الجمعة", meaning: "The Congregation", ayahs: 11, revelation: "madani", juz: [28], order: 110, rukus: 2 },
  { id: 63, name: "Al-Munafiqun", arabic: "المنافقون", meaning: "The Hypocrites", ayahs: 11, revelation: "madani", juz: [28], order: 104, rukus: 2 },
  { id: 64, name: "At-Taghabun", arabic: "التغابن", meaning: "The Mutual Disillusion", ayahs: 18, revelation: "madani", juz: [28], order: 108, rukus: 2 },
  { id: 65, name: "At-Talaq", arabic: "الطلاق", meaning: "The Divorce", ayahs: 12, revelation: "madani", juz: [28], order: 99, rukus: 2 },
  { id: 66, name: "At-Tahrim", arabic: "التحريم", meaning: "The Prohibition", ayahs: 12, revelation: "madani", juz: [28], order: 107, rukus: 2 },
  { id: 67, name: "Al-Mulk", arabic: "الملك", meaning: "The Sovereignty", ayahs: 30, revelation: "makki", juz: [29], order: 77, rukus: 2 },
  { id: 68, name: "Al-Qalam", arabic: "القلم", meaning: "The Pen", ayahs: 52, revelation: "makki", juz: [29], order: 2, rukus: 2 },
  { id: 69, name: "Al-Haqqah", arabic: "الحاقة", meaning: "The Reality", ayahs: 52, revelation: "makki", juz: [29], order: 78, rukus: 2 },
  { id: 70, name: "Al-Ma'arij", arabic: "المعارج", meaning: "The Ascending Stairways", ayahs: 44, revelation: "makki", juz: [29], order: 79, rukus: 2 },
  { id: 71, name: "Nuh", arabic: "نوح", meaning: "Noah", ayahs: 28, revelation: "makki", juz: [29], order: 71, rukus: 2 },
  { id: 72, name: "Al-Jinn", arabic: "الجن", meaning: "The Jinn", ayahs: 28, revelation: "makki", juz: [29], order: 40, rukus: 2 },
  { id: 73, name: "Al-Muzzammil", arabic: "المزمل", meaning: "The Enshrouded One", ayahs: 20, revelation: "makki", juz: [29], order: 3, rukus: 2 },
  { id: 74, name: "Al-Muddaththir", arabic: "المدثر", meaning: "The Cloaked One", ayahs: 56, revelation: "makki", juz: [29], order: 4, rukus: 2 },
  { id: 75, name: "Al-Qiyamah", arabic: "القيامة", meaning: "The Resurrection", ayahs: 40, revelation: "makki", juz: [29], order: 31, rukus: 2 },
  { id: 76, name: "Al-Insan", arabic: "الإنسان", meaning: "The Human", ayahs: 31, revelation: "madani", juz: [29], order: 98, rukus: 2 },
  { id: 77, name: "Al-Mursalat", arabic: "المرسلات", meaning: "The Emissaries", ayahs: 50, revelation: "makki", juz: [29], order: 33, rukus: 2 },
  { id: 78, name: "An-Naba", arabic: "النبأ", meaning: "The Tidings", ayahs: 40, revelation: "makki", juz: [30], order: 80, rukus: 2 },
  { id: 79, name: "An-Nazi'at", arabic: "النازعات", meaning: "Those Who Drag Forth", ayahs: 46, revelation: "makki", juz: [30], order: 81, rukus: 2 },
  { id: 80, name: "Abasa", arabic: "عبس", meaning: "He Frowned", ayahs: 42, revelation: "makki", juz: [30], order: 24, rukus: 1 },
  { id: 81, name: "At-Takwir", arabic: "التكوير", meaning: "The Overthrowing", ayahs: 29, revelation: "makki", juz: [30], order: 7, rukus: 1 },
  { id: 82, name: "Al-Infitar", arabic: "الانفطار", meaning: "The Cleaving", ayahs: 19, revelation: "makki", juz: [30], order: 82, rukus: 1 },
  { id: 83, name: "Al-Mutaffifin", arabic: "المطففين", meaning: "The Defrauding", ayahs: 36, revelation: "makki", juz: [30], order: 86, rukus: 1 },
  { id: 84, name: "Al-Inshiqaq", arabic: "الانشقاق", meaning: "The Sundering", ayahs: 25, revelation: "makki", juz: [30], order: 83, rukus: 1 },
  { id: 85, name: "Al-Buruj", arabic: "البروج", meaning: "The Mansions of the Stars", ayahs: 22, revelation: "makki", juz: [30], order: 27, rukus: 1 },
  { id: 86, name: "At-Tariq", arabic: "الطارق", meaning: "The Morning Star", ayahs: 17, revelation: "makki", juz: [30], order: 36, rukus: 1 },
  { id: 87, name: "Al-A'la", arabic: "الأعلى", meaning: "The Most High", ayahs: 19, revelation: "makki", juz: [30], order: 8, rukus: 1 },
  { id: 88, name: "Al-Ghashiyah", arabic: "الغاشية", meaning: "The Overwhelming", ayahs: 26, revelation: "makki", juz: [30], order: 68, rukus: 1 },
  { id: 89, name: "Al-Fajr", arabic: "الفجر", meaning: "The Dawn", ayahs: 30, revelation: "makki", juz: [30], order: 10, rukus: 1 },
  { id: 90, name: "Al-Balad", arabic: "البلد", meaning: "The City", ayahs: 20, revelation: "makki", juz: [30], order: 35, rukus: 1 },
  { id: 91, name: "Ash-Shams", arabic: "الشمس", meaning: "The Sun", ayahs: 15, revelation: "makki", juz: [30], order: 26, rukus: 1 },
  { id: 92, name: "Al-Layl", arabic: "الليل", meaning: "The Night", ayahs: 21, revelation: "makki", juz: [30], order: 9, rukus: 1 },
  { id: 93, name: "Ad-Duha", arabic: "الضحى", meaning: "The Morning Hours", ayahs: 11, revelation: "makki", juz: [30], order: 11, rukus: 1 },
  { id: 94, name: "Ash-Sharh", arabic: "الشرح", meaning: "The Relief", ayahs: 8, revelation: "makki", juz: [30], order: 12, rukus: 1 },
  { id: 95, name: "At-Tin", arabic: "التين", meaning: "The Fig", ayahs: 8, revelation: "makki", juz: [30], order: 28, rukus: 1 },
  { id: 96, name: "Al-Alaq", arabic: "العلق", meaning: "The Clinging Clot", ayahs: 19, revelation: "makki", juz: [30], order: 1, rukus: 1 },
  { id: 97, name: "Al-Qadr", arabic: "القدر", meaning: "The Power", ayahs: 5, revelation: "makki", juz: [30], order: 25, rukus: 1 },
  { id: 98, name: "Al-Bayyinah", arabic: "البينة", meaning: "The Clear Proof", ayahs: 8, revelation: "madani", juz: [30], order: 100, rukus: 1 },
  { id: 99, name: "Az-Zalzalah", arabic: "الزلزلة", meaning: "The Earthquake", ayahs: 8, revelation: "madani", juz: [30], order: 93, rukus: 1 },
  { id: 100, name: "Al-Adiyat", arabic: "العاديات", meaning: "The Courser", ayahs: 11, revelation: "makki", juz: [30], order: 14, rukus: 1 },
  { id: 101, name: "Al-Qari'ah", arabic: "القارعة", meaning: "The Calamity", ayahs: 11, revelation: "makki", juz: [30], order: 30, rukus: 1 },
  { id: 102, name: "At-Takathur", arabic: "التكاثر", meaning: "The Rivalry", ayahs: 8, revelation: "makki", juz: [30], order: 16, rukus: 1 },
  { id: 103, name: "Al-Asr", arabic: "العصر", meaning: "The Declining Day", ayahs: 3, revelation: "makki", juz: [30], order: 13, rukus: 1 },
  { id: 104, name: "Al-Humazah", arabic: "الهمزة", meaning: "The Traducer", ayahs: 9, revelation: "makki", juz: [30], order: 32, rukus: 1 },
  { id: 105, name: "Al-Fil", arabic: "الفيل", meaning: "The Elephant", ayahs: 5, revelation: "makki", juz: [30], order: 19, rukus: 1 },
  { id: 106, name: "Quraysh", arabic: "قريش", meaning: "Quraysh", ayahs: 4, revelation: "makki", juz: [30], order: 29, rukus: 1 },
  { id: 107, name: "Al-Ma'un", arabic: "الماعون", meaning: "The Small Kindnesses", ayahs: 7, revelation: "makki", juz: [30], order: 17, rukus: 1 },
  { id: 108, name: "Al-Kawthar", arabic: "الكوثر", meaning: "The Abundance", ayahs: 3, revelation: "makki", juz: [30], order: 15, rukus: 1 },
  { id: 109, name: "Al-Kafirun", arabic: "الكافرون", meaning: "The Disbelievers", ayahs: 6, revelation: "makki", juz: [30], order: 18, rukus: 1 },
  { id: 110, name: "An-Nasr", arabic: "النصر", meaning: "The Divine Support", ayahs: 3, revelation: "madani", juz: [30], order: 114, rukus: 1 },
  { id: 111, name: "Al-Masad", arabic: "المسد", meaning: "The Palm Fiber", ayahs: 5, revelation: "makki", juz: [30], order: 6, rukus: 1 },
  { id: 112, name: "Al-Ikhlas", arabic: "الإخلاص", meaning: "The Sincerity", ayahs: 4, revelation: "makki", juz: [30], order: 22, rukus: 1 },
  { id: 113, name: "Al-Falaq", arabic: "الفلق", meaning: "The Daybreak", ayahs: 5, revelation: "makki", juz: [30], order: 20, rukus: 1 },
  { id: 114, name: "An-Nas", arabic: "الناس", meaning: "The Mankind", ayahs: 6, revelation: "makki", juz: [30], order: 21, rukus: 1 },
];

const JUZ_NAMES = [
  "Alif Lam Mim", "Sayaqul", "Tilka ar-Rusul", "Lan Tanaalu", "Wal Muhsanat",
  "La Yuhibbullah", "Wa Idha Sami'u", "Wa Lau Annana", "Qalal Mala'u", "Wa A'lamu",
  "Ya'tadhiruna", "Wa Ma Min Dabbah", "Wa Ma Ubarri'u", "Rubama", "Subhan alladhi",
  "Qal Alam", "Iqtaraba", "Qad Aflaha", "Wa Qalal-ladhina", "A'man Khalaqa",
  "Utlu Ma Uhiya", "Wa Man Yaqnut", "Wa Mali", "Faman Azlamu", "Ilayhi Yuraddu",
  "Ha Mim", "Qala Fama Khatbukum", "Qad Sami'a", "Tabaraka alladhi", "Amma"
];

const MAX_AYAHS = 286;

type ViewMode = 'garden' | 'list' | 'juz';
type SortBy = 'number' | 'revelation' | 'ayahs' | 'name';
type FilterRevelation = 'all' | 'makki' | 'madani';

interface SurahBrowserProps {
  onAddToQueue?: (surah: SurahData) => void;
}

function getOrdinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ─── Main Component ───────────────────────────────────────────────
export default function SurahBrowser({ onAddToQueue }: SurahBrowserProps) {
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJuz, setActiveJuz] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('garden');
  const [sortBy, setSortBy] = useState<SortBy>('number');
  const [filterRevelation, setFilterRevelation] = useState<FilterRevelation>('all');

  const filteredSurahs = useMemo(() => {
    let result = [...SURAHS];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.meaning.toLowerCase().includes(q) ||
        s.arabic.includes(q) ||
        s.id.toString() === q
      );
    }
    if (filterRevelation !== 'all') {
      result = result.filter(s => s.revelation === filterRevelation);
    }
    if (activeJuz !== null) {
      result = result.filter(s => s.juz.includes(activeJuz));
    }

    switch (sortBy) {
      case 'revelation': result.sort((a, b) => a.order - b.order); break;
      case 'ayahs': result.sort((a, b) => b.ayahs - a.ayahs); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: result.sort((a, b) => a.id - b.id);
    }
    return result;
  }, [searchQuery, filterRevelation, activeJuz, sortBy]);

  const makki = SURAHS.filter(s => s.revelation === 'makki').length;
  const madani = SURAHS.filter(s => s.revelation === 'madani').length;

  const handleAddToQueue = (surah: SurahData) => {
    if (onAddToQueue) {
      onAddToQueue(surah);
    }
    setSelectedSurah(null);
  };

  return (
    <div className="min-h-screen bg-night-950 relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="fixed inset-0 bg-gradient-radial from-sage-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-sage-500/8 to-transparent blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 text-center px-5 pt-12 pb-6">
        <p className="text-2xl text-sage-500/50 mb-3" style={{ fontFamily: 'var(--font-arabic)' }}>﷽</p>
        <h1 className="text-3xl md:text-4xl font-light tracking-widest text-night-100 mb-2">
          The Garden of Surahs
        </h1>
        <p className="text-sm text-night-500 tracking-wide">
          114 chapters · {makki} Makki · {madani} Madani · 6,236 ayahs
        </p>
      </header>

      {/* Controls Bar */}
      <div className="relative z-10 max-w-4xl mx-auto px-5 pb-4">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-night-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, meaning, or number..."
            className="w-full bg-night-900/80 border border-night-700/50 rounded-xl py-3 pl-12 pr-10 text-night-100 placeholder:text-night-600 focus:outline-none focus:border-sage-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-night-500 hover:text-night-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* View toggles & filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* View mode toggle */}
          <div className="flex bg-night-900/80 rounded-lg p-0.5 border border-night-700/50">
            {[
              { mode: 'garden' as ViewMode, icon: Grid3X3, label: 'Garden' },
              { mode: 'list' as ViewMode, icon: List, label: 'List' },
              { mode: 'juz' as ViewMode, icon: Layers, label: 'Juz' },
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); if (mode !== 'juz') setActiveJuz(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === mode
                    ? 'bg-night-800 text-night-100 border border-night-600/50'
                    : 'text-night-500 hover:text-night-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="bg-night-900/80 border border-night-700/50 rounded-lg px-3 py-1.5 text-xs text-night-400 focus:outline-none focus:border-sage-500/50"
          >
            <option value="number">Order: Mushaf</option>
            <option value="revelation">Order: Revelation</option>
            <option value="ayahs">Order: Ayah Count</option>
            <option value="name">Order: Alphabetical</option>
          </select>

          {/* Revelation filter */}
          <div className="flex bg-night-900/80 rounded-lg p-0.5 border border-night-700/50">
            {[
              { v: 'all' as FilterRevelation, label: 'All' },
              { v: 'makki' as FilterRevelation, label: '☀ Makki', color: 'text-gold-400' },
              { v: 'madani' as FilterRevelation, label: '☽ Madani', color: 'text-sage-400' },
            ].map(({ v, label, color }) => (
              <button
                key={v}
                onClick={() => setFilterRevelation(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filterRevelation === v
                    ? `bg-night-800 ${color || 'text-night-100'} border border-night-600/50`
                    : 'text-night-500 hover:text-night-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Juz Navigator */}
      <AnimatePresence>
        {viewMode === 'juz' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-10 max-w-4xl mx-auto px-5 pb-4 overflow-hidden"
          >
            <div className="flex flex-wrap gap-1.5">
              {Array.from({ length: 30 }, (_, i) => i + 1).map(juz => {
                const count = SURAHS.filter(s => s.juz.includes(juz)).length;
                const isActive = activeJuz === juz;
                return (
                  <button
                    key={juz}
                    onClick={() => setActiveJuz(isActive ? null : juz)}
                    className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-sage-500/20 border border-sage-500/40 shadow-lg shadow-sage-500/10'
                        : 'bg-night-900/50 border border-night-700/30 hover:border-night-600'
                    }`}
                    title={`Juz ${juz}: ${JUZ_NAMES[juz - 1]} (${count} surahs)`}
                  >
                    <span className={`text-xs font-bold ${isActive ? 'text-sage-400' : 'text-night-500'}`}>{juz}</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: Math.min(count, 6) }, (_, i) => (
                        <span
                          key={i}
                          className={`w-1 h-1 rounded-full ${isActive ? 'bg-sage-400' : 'bg-night-600'}`}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results count */}
      {(searchQuery || filterRevelation !== 'all' || activeJuz !== null) && (
        <div className="relative z-10 max-w-4xl mx-auto px-5 pb-2">
          <p className="text-xs text-night-600">
            {filteredSurahs.length} surah{filteredSurahs.length !== 1 ? 's' : ''} found
            {activeJuz && <span> in Juz {activeJuz} ({JUZ_NAMES[activeJuz - 1]})</span>}
          </p>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-5 pb-32">
        {viewMode === 'list' ? (
          <ListView surahs={filteredSurahs} onSelect={setSelectedSurah} selected={selectedSurah} />
        ) : (
          <GardenView surahs={filteredSurahs} onSelect={setSelectedSurah} selected={selectedSurah} />
        )}
      </main>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedSurah && (
          <SurahDetail
            surah={SURAHS.find(s => s.id === selectedSurah)!}
            onClose={() => setSelectedSurah(null)}
            onAddToQueue={handleAddToQueue}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Garden View ──────────────────────────────────────────────────
function GardenView({ 
  surahs, 
  onSelect, 
  selected 
}: { 
  surahs: SurahData[]; 
  onSelect: (id: number) => void; 
  selected: number | null;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {surahs.map((s, i) => (
        <SurahCard key={s.id} surah={s} index={i} onSelect={onSelect} isSelected={selected === s.id} />
      ))}
    </div>
  );
}

// ─── Surah Card ───────────────────────────────────────────────────
function SurahCard({ 
  surah, 
  index, 
  onSelect, 
  isSelected 
}: { 
  surah: SurahData; 
  index: number; 
  onSelect: (id: number) => void; 
  isSelected: boolean;
}) {
  const isMakki = surah.revelation === 'makki';
  const ayahRatio = surah.ayahs / MAX_AYAHS;
  const ringSize = 40 + ayahRatio * 24;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.92, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.02, 0.5), duration: 0.3 }}
      onClick={() => onSelect(surah.id)}
      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-300 text-center group ${
        isSelected
          ? isMakki
            ? 'bg-gold-500/10 border-gold-500/40 shadow-lg shadow-gold-500/10'
            : 'bg-sage-500/10 border-sage-500/40 shadow-lg shadow-sage-500/10'
          : 'bg-night-900/60 border-night-700/30 hover:bg-night-900/80 hover:border-night-600/50 hover:-translate-y-1'
      }`}
    >
      {/* Ayah Ring */}
      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke={isMakki ? 'rgba(196, 148, 58, 0.15)' : 'rgba(45, 212, 150, 0.15)'}
            strokeWidth="2"
          />
          <circle
            cx="50" cy="50" r="44"
            fill="none"
            stroke={isMakki ? '#c4943a' : '#2dd496'}
            strokeWidth="2.5"
            strokeDasharray={`${ayahRatio * 276.5} ${276.5}`}
            strokeLinecap="round"
            transform="rotate(-90 50 50)"
            className={isMakki ? 'drop-shadow-[0_0_4px_rgba(196,148,58,0.4)]' : 'drop-shadow-[0_0_4px_rgba(45,212,150,0.4)]'}
          />
          <text
            x="50" y="50"
            textAnchor="middle"
            dominantBaseline="central"
            className={`font-bold ${isMakki ? 'fill-gold-400' : 'fill-sage-400'}`}
            style={{ fontSize: surah.id > 99 ? '20px' : '24px' }}
          >
            {surah.id}
          </text>
        </svg>
      </div>

      {/* Arabic Name */}
      <p
        className={`text-xl ${isMakki ? 'text-gold-400' : 'text-sage-400'}`}
        style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
      >
        {surah.arabic}
      </p>

      {/* English Name */}
      <p className="text-sm font-medium text-night-100 leading-tight">{surah.name}</p>

      {/* Meaning */}
      <p className="text-xs text-night-500 italic leading-tight">{surah.meaning}</p>

      {/* Meta bar */}
      <div className="flex items-center gap-2 mt-1">
        <span className={`text-[10px] px-2 py-0.5 rounded-md capitalize font-medium ${
          isMakki
            ? 'bg-gold-500/10 text-gold-400'
            : 'bg-sage-500/10 text-sage-400'
        }`}>
          {isMakki ? '☀' : '☽'} {surah.revelation}
        </span>
        <span className="text-[10px] text-night-600">{surah.ayahs} ayahs</span>
      </div>
    </motion.button>
  );
}

// ─── List View ────────────────────────────────────────────────────
function ListView({ 
  surahs, 
  onSelect, 
  selected 
}: { 
  surahs: SurahData[]; 
  onSelect: (id: number) => void; 
  selected: number | null;
}) {
  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="hidden sm:flex items-center gap-3 px-4 py-2 text-[10px] text-night-600 uppercase tracking-wider font-semibold border-b border-night-800">
        <span className="w-12">#</span>
        <span className="flex-1">Surah</span>
        <span className="w-24 text-center">Arabic</span>
        <span className="w-20 text-center">Revelation</span>
        <span className="w-16 text-right">Ayahs</span>
        <span className="w-12 text-right">Juz</span>
      </div>

      {surahs.map((s, i) => {
        const isMakki = s.revelation === 'makki';
        return (
          <motion.button
            key={s.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: Math.min(i * 0.015, 0.4) }}
            onClick={() => onSelect(s.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
              selected === s.id
                ? isMakki
                  ? 'bg-gold-500/10 border-gold-500/30'
                  : 'bg-sage-500/10 border-sage-500/30'
                : 'border-transparent hover:bg-night-900/60'
            }`}
          >
            <span className={`w-12 font-bold text-lg ${isMakki ? 'text-gold-400' : 'text-sage-400'}`}>
              {s.id}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-night-100 truncate">{s.name}</p>
              <p className="text-xs text-night-500 italic truncate">{s.meaning}</p>
            </div>
            <p
              className={`w-24 text-center text-lg ${isMakki ? 'text-gold-400' : 'text-sage-400'}`}
              style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
            >
              {s.arabic}
            </p>
            <span className={`w-20 text-center text-[10px] px-2 py-0.5 rounded-md font-medium ${
              isMakki
                ? 'bg-gold-500/10 text-gold-400'
                : 'bg-sage-500/10 text-sage-400'
            }`}>
              {isMakki ? '☀ Makki' : '☽ Madani'}
            </span>
            <span className="w-16 text-right text-sm text-night-500">{s.ayahs}</span>
            <span className="w-12 text-right text-xs text-night-600">{s.juz.join(',')}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────
function SurahDetail({
  surah,
  onClose,
  onAddToQueue,
}: {
  surah: SurahData;
  onClose: () => void;
  onAddToQueue: (surah: SurahData) => void;
}) {
  const isMakki = surah.revelation === 'makki';
  const ayahRatio = surah.ayahs / MAX_AYAHS;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-night-950/90 backdrop-blur-md flex items-center justify-center p-5"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        className="w-full max-w-md max-h-[85vh] overflow-y-auto bg-gradient-to-b from-night-900 to-night-950 border border-night-700/50 rounded-3xl p-7 relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-night-600 hover:text-night-300 text-2xl leading-none"
        >
          ×
        </button>

        {/* Header ring */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <svg viewBox="0 0 120 120" className="w-28 h-28">
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={isMakki ? 'rgba(196, 148, 58, 0.15)' : 'rgba(45, 212, 150, 0.15)'}
                strokeWidth="3"
              />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={isMakki ? '#c4943a' : '#2dd496'}
                strokeWidth="4"
                strokeDasharray={`${ayahRatio * 339.3} ${339.3}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                className={isMakki ? 'drop-shadow-[0_0_8px_rgba(196,148,58,0.5)]' : 'drop-shadow-[0_0_8px_rgba(45,212,150,0.5)]'}
              />
              <text
                x="60" y="54"
                textAnchor="middle"
                dominantBaseline="central"
                className={`font-bold ${isMakki ? 'fill-gold-400' : 'fill-sage-400'}`}
                style={{ fontSize: '32px' }}
              >
                {surah.id}
              </text>
              <text
                x="60" y="76"
                textAnchor="middle"
                className="fill-night-500"
                style={{ fontSize: '10px' }}
              >
                of 114
              </text>
            </svg>
          </div>

          <p
            className={`text-4xl mb-1 ${isMakki ? 'text-gold-400' : 'text-sage-400'}`}
            style={{ fontFamily: 'var(--font-arabic)', direction: 'rtl' }}
          >
            {surah.arabic}
          </p>
          <h2 className="text-2xl font-light text-night-100 tracking-wide">{surah.name}</h2>
          <p className="text-sm text-night-500 italic">{surah.meaning}</p>
        </div>

        {/* Revelation badge */}
        <div className="flex justify-center mb-6">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl border ${
            isMakki
              ? 'bg-gradient-to-r from-gold-500/10 to-gold-500/5 border-gold-500/20'
              : 'bg-gradient-to-r from-sage-500/10 to-sage-500/5 border-sage-500/20'
          }`}>
            <span className="text-xl">{isMakki ? '☀' : '☽'}</span>
            <div>
              <p className={`font-semibold ${isMakki ? 'text-gold-400' : 'text-sage-400'}`}>
                {isMakki ? 'Makki' : 'Madani'}
              </p>
              <p className="text-xs text-night-500">
                Revealed in {isMakki ? 'Makkah' : 'Madinah'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {[
            { value: surah.ayahs, label: 'Ayahs' },
            { value: surah.rukus, label: 'Rukus' },
            { value: surah.juz.join(', '), label: surah.juz.length > 1 ? 'Across Juz' : 'Juz' },
            { value: `#${surah.order}`, label: 'Revelation Order' },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="text-center p-4 bg-night-800/30 border border-night-700/30 rounded-xl"
            >
              <p className={`text-2xl font-bold ${isMakki ? 'text-gold-400' : 'text-sage-400'}`}>
                {value}
              </p>
              <p className="text-[10px] text-night-600 uppercase tracking-wider mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Context */}
        <div className="p-4 bg-night-800/20 border-l-2 border-night-700/50 rounded-r-xl mb-6">
          <p className="text-sm text-night-400 leading-relaxed">
            {surah.order === 1 && "The very first surah revealed to Prophet Muhammad ﷺ."}
            {surah.order === 114 && "The final surah revealed, completing the Quran."}
            {surah.order > 1 && surah.order < 114 && `Revealed ${getOrdinal(surah.order)} in the order of revelation.`}
          </p>
          {surah.ayahs <= 20 && (
            <p className="text-sm text-sage-400 mt-2">
              A short surah — great for memorization!
            </p>
          )}
          {surah.ayahs > 100 && (
            <p className="text-sm text-gold-400 mt-2">
              A major surah — consider memorizing it in sections.
            </p>
          )}
        </div>

        {/* Action button */}
        <button
          onClick={() => onAddToQueue(surah)}
          className={`w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 ${
            isMakki
              ? 'bg-gradient-to-r from-gold-500 to-gold-600'
              : 'bg-gradient-to-r from-sage-500 to-sage-600'
          }`}
        >
          <Plus className="w-5 h-5" />
          Add to Memorization Queue
        </button>
      </motion.div>
    </motion.div>
  );
}
