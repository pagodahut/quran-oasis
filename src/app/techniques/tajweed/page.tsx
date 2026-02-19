'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  BookOpen,
  Volume2,
  Layers,
} from 'lucide-react';
import BottomNav from '@/components/BottomNav';

// ============ Tajweed Rule Data ============

interface TajweedRuleDetail {
  id: string;
  arabicName: string;
  transliteration: string;
  englishName: string;
  category: string;
  categoryColor: string;
  color: string;
  description: string;
  detailedExplanation: string;
  letters?: string;
  example: {
    arabic: string;
    surah: string;
    reference: string;
  };
  tips: string[];
}

const TAJWEED_CATEGORIES = [
  { id: 'noon-meem', label: 'Noon & Meem Rules', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  { id: 'madd', label: 'Madd (Elongation)', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  { id: 'qalqalah', label: 'Qalqalah (Echo)', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  { id: 'pronunciation', label: 'Pronunciation', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  { id: 'stopping', label: 'Stopping Rules', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
];

const TAJWEED_RULES: TajweedRuleDetail[] = [
  // Noon & Meem Rules
  {
    id: 'idgham',
    arabicName: 'إدغام',
    transliteration: 'Idghām',
    englishName: 'Merging / Assimilation',
    category: 'noon-meem',
    categoryColor: 'text-green-400',
    color: 'green',
    description: 'Noon sakinah or tanween merges into the following letter when it is one of يَرْمَلُون (Ya, Ra, Meem, Lam, Waw, Noon).',
    detailedExplanation: 'Idgham occurs when a noon sakinah (نْ) or tanween is followed by one of six letters: ي ر م ل و ن. The noon sound is assimilated into the next letter. With ghunnah (nasalization) for ي ن م و, and without ghunnah for ل ر.',
    letters: 'ي ر م ل و ن',
    example: {
      arabic: 'مِن يَّعْمَلْ',
      surah: 'An-Nisa',
      reference: '4:123',
    },
    tips: [
      'The noon disappears and the next letter is pronounced with shaddah',
      'Idgham with ghunnah: nasalize for 2 counts (ي ن م و)',
      'Idgham without ghunnah: merge completely (ل ر)',
    ],
  },
  {
    id: 'ikhfa',
    arabicName: 'إخفاء',
    transliteration: 'Ikhfāʾ',
    englishName: 'Concealment / Hiding',
    category: 'noon-meem',
    categoryColor: 'text-orange-400',
    color: 'orange',
    description: 'Noon sakinah or tanween is hidden (not fully pronounced) before 15 specific letters, with a nasal sound for 2 counts.',
    detailedExplanation: 'Ikhfa is the concealment of noon sakinah or tanween when followed by one of 15 letters: ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك. The tongue position moves toward the articulation point of the next letter.',
    letters: 'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك',
    example: {
      arabic: 'مِن قَبْلِ',
      surah: 'Al-Baqarah',
      reference: '2:25',
    },
    tips: [
      'The noon is not fully pronounced nor fully hidden — it\'s in between',
      'Nasalize (ghunnah) for 2 counts',
      'Position your tongue toward the next letter\'s articulation point',
    ],
  },
  {
    id: 'iqlab',
    arabicName: 'إقلاب',
    transliteration: 'Iqlāb',
    englishName: 'Conversion / Changing',
    category: 'noon-meem',
    categoryColor: 'text-blue-400',
    color: 'blue',
    description: 'Noon sakinah or tanween changes to a meem sound when followed by the letter ب (ba), with nasalization for 2 counts.',
    detailedExplanation: 'Iqlab literally means "to convert." When noon sakinah or tanween is followed by ب, the noon changes to a meem (م) and is pronounced with ghunnah for 2 counts while the lips close for the ba.',
    letters: 'ب',
    example: {
      arabic: 'مِنۢ بَعْدِ',
      surah: 'Al-Baqarah',
      reference: '2:27',
    },
    tips: [
      'Change the noon to a meem sound',
      'Close your lips gently (like pronouncing meem)',
      'Hold the nasal sound for 2 counts, then release into ب',
    ],
  },
  {
    id: 'izhar',
    arabicName: 'إظهار',
    transliteration: 'Iẓhār',
    englishName: 'Manifestation / Clear',
    category: 'noon-meem',
    categoryColor: 'text-violet-400',
    color: 'violet',
    description: 'Noon sakinah or tanween is pronounced clearly without nasalization when followed by one of the six throat letters.',
    detailedExplanation: 'Izhar means to make clear. When noon sakinah or tanween is followed by a throat letter (ء ه ع ح غ خ), the noon must be pronounced clearly and distinctly without any nasalization or merging.',
    letters: 'ء ه ع ح غ خ',
    example: {
      arabic: 'مِنْ عِلْمٍ',
      surah: 'An-Najm',
      reference: '53:28',
    },
    tips: [
      'Pronounce the noon clearly and distinctly',
      'No ghunnah (nasalization) at all',
      'These six letters are from the throat (halqi)',
    ],
  },
  {
    id: 'ghunnah',
    arabicName: 'غُنّة',
    transliteration: 'Ghunnah',
    englishName: 'Nasalization',
    category: 'noon-meem',
    categoryColor: 'text-purple-400',
    color: 'purple',
    description: 'A nasal resonance produced from the nose, lasting 2 counts, on noon or meem with shaddah.',
    detailedExplanation: 'Ghunnah is the nasalization that accompanies noon and meem. It is most prominent (obligatory for 2 counts) when noon or meem carry a shaddah (نّ or مّ). The sound resonates from the nasal passage (khayshoom).',
    example: {
      arabic: 'إِنَّ اللَّهَ',
      surah: 'Al-Baqarah',
      reference: '2:222',
    },
    tips: [
      'The sound comes from the nasal passage, not the mouth',
      'Hold the sound for exactly 2 counts (about 1 second)',
      'Try humming to feel the nasal resonance',
    ],
  },
  {
    id: 'ikhfa-shafawi',
    arabicName: 'إخفاء شفوي',
    transliteration: 'Ikhfāʾ Shafawī',
    englishName: 'Labial Concealment',
    category: 'noon-meem',
    categoryColor: 'text-green-400',
    color: 'green',
    description: 'Meem sakinah is hidden with ghunnah when followed by the letter ب (ba).',
    detailedExplanation: 'When meem sakinah (مْ) is followed by ب, the meem is hidden (concealed) with nasalization. The lips remain slightly closed during the ghunnah.',
    letters: 'ب',
    example: {
      arabic: 'تَرْمِيهِم بِحِجَارَةٍ',
      surah: 'Al-Fil',
      reference: '105:4',
    },
    tips: [
      'Keep lips lightly together during the ghunnah',
      'Nasalize for 2 counts',
      'Different from iqlab — here the meem stays as meem',
    ],
  },

  // Madd Rules
  {
    id: 'madd-tabii',
    arabicName: 'مَدّ طبيعي',
    transliteration: 'Madd Ṭabīʿī',
    englishName: 'Natural Elongation',
    category: 'madd',
    categoryColor: 'text-yellow-400',
    color: 'yellow',
    description: 'The natural stretching of alif, waw, or ya vowel sounds for exactly 2 counts.',
    detailedExplanation: 'Madd Tabii is the foundational elongation in Quran recitation. It occurs with the three madd letters (ا و ي) when they follow their corresponding vowel (fatha for alif, dammah for waw, kasrah for ya) and are not followed by hamzah or sukoon.',
    example: {
      arabic: 'قَالُوا',
      surah: 'Al-Baqarah',
      reference: '2:11',
    },
    tips: [
      'Always exactly 2 counts — not more, not less',
      'This is the base unit for measuring all other madd types',
      'Practice with a metronome to keep consistent timing',
    ],
  },
  {
    id: 'madd-muttasil',
    arabicName: 'مَدّ مُتَّصِل',
    transliteration: 'Madd Muttaṣil',
    englishName: 'Connected Elongation',
    category: 'madd',
    categoryColor: 'text-yellow-400',
    color: 'yellow',
    description: 'When a madd letter is followed by hamzah within the same word, elongate for 4–5 counts.',
    detailedExplanation: 'Madd Muttasil (obligatory connected madd) occurs when a madd letter and hamzah appear in the same word. It must be elongated for 4–5 counts (obligatory). This is considered wajib (obligatory).',
    example: {
      arabic: 'جَآءَ',
      surah: 'An-Nasr',
      reference: '110:1',
    },
    tips: [
      'This madd is obligatory — you must elongate',
      'Hold for 4–5 counts in Hafs reading',
      'The hamzah and madd letter are in the same word',
    ],
  },
  {
    id: 'madd-munfasil',
    arabicName: 'مَدّ مُنْفَصِل',
    transliteration: 'Madd Munfaṣil',
    englishName: 'Separated Elongation',
    category: 'madd',
    categoryColor: 'text-yellow-400',
    color: 'yellow',
    description: 'When a madd letter ends a word and the next word begins with hamzah, elongate for 4–5 counts.',
    detailedExplanation: 'Madd Munfasil (permissible separated madd) occurs when a madd letter is at the end of one word and the beginning of the next word starts with hamzah. This is jaiz (permissible), with duration of 4–5 counts in Hafs.',
    example: {
      arabic: 'بِمَا أُنزِلَ',
      surah: 'Al-Baqarah',
      reference: '2:4',
    },
    tips: [
      'The madd letter and hamzah are in different words',
      'Hold for 4–5 counts (same as muttasil in Hafs)',
      'This madd disappears when you stop on the first word',
    ],
  },
  {
    id: 'madd-lazim',
    arabicName: 'مَدّ لازِم',
    transliteration: 'Madd Lāzim',
    englishName: 'Necessary Elongation',
    category: 'madd',
    categoryColor: 'text-yellow-400',
    color: 'yellow',
    description: 'When a madd letter is followed by a sukoon or shaddah in the same word, elongate for 6 counts.',
    detailedExplanation: 'Madd Lazim is the longest obligatory madd. It occurs when a madd letter is followed by sukoon (original, not due to stopping) or shaddah. Found in words like الضَّالِّين and in the opening letters of some surahs (الم، حم).',
    example: {
      arabic: 'الضَّآلِّينَ',
      surah: 'Al-Fatihah',
      reference: '1:7',
    },
    tips: [
      'Always 6 counts — the longest madd',
      'The sukoon must be original (asliy), not due to stopping',
      'Common in الم حم يس and similar opening letters',
    ],
  },

  // Qalqalah
  {
    id: 'qalqalah',
    arabicName: 'قلقلة',
    transliteration: 'Qalqalah',
    englishName: 'Echo / Bouncing',
    category: 'qalqalah',
    categoryColor: 'text-red-400',
    color: 'red',
    description: 'A slight bouncing or echoing sound produced when the letters ق ط ب ج د have sukoon.',
    detailedExplanation: 'Qalqalah means "shaking" or "disturbance." When the five qalqalah letters (ق ط ب ج د — remembered by the phrase قُطْبُ جَدّ) carry sukoon, they produce a slight echoing bounce. Qalqalah is stronger at the end of a verse (kubra) than in the middle of a word (sughra).',
    letters: 'ق ط ب ج د',
    example: {
      arabic: 'يَخْلُقْ',
      surah: 'An-Nahl',
      reference: '16:17',
    },
    tips: [
      'Remember the letters: قُطْبُ جَدّ',
      'Sughra (minor): in the middle of a word — subtle bounce',
      'Kubra (major): at the end of an ayah — stronger bounce',
      'Don\'t add a vowel — it should be a clean echo',
    ],
  },

  // Pronunciation Rules
  {
    id: 'tafkheem',
    arabicName: 'تفخيم',
    transliteration: 'Tafkhīm',
    englishName: 'Heavy / Full Pronunciation',
    category: 'pronunciation',
    categoryColor: 'text-blue-400',
    color: 'blue',
    description: 'Certain letters are always pronounced with a heavy, full mouth sound by raising the tongue toward the palate.',
    detailedExplanation: 'Tafkheem (heaviness/fullness) applies to seven letters that are always pronounced with a full, heavy sound: خ ص ض غ ط ق ظ (remembered by the phrase خُصَّ ضَغْطٍ قِظ). The tongue is raised toward the palate, creating resonance in the upper mouth.',
    letters: 'خ ص ض غ ط ق ظ',
    example: {
      arabic: 'الصِّرَاطَ',
      surah: 'Al-Fatihah',
      reference: '1:6',
    },
    tips: [
      'Remember: خُصَّ ضَغْطٍ قِظ',
      'Raise the back of your tongue toward the soft palate',
      'The sound should feel full and heavy in your mouth',
    ],
  },
  {
    id: 'tarqeeq',
    arabicName: 'ترقيق',
    transliteration: 'Tarqīq',
    englishName: 'Light / Thin Pronunciation',
    category: 'pronunciation',
    categoryColor: 'text-blue-400',
    color: 'blue',
    description: 'Most Arabic letters are pronounced with a light, thin sound — the tongue stays low and flat.',
    detailedExplanation: 'Tarqeeq is the default state for most Arabic letters. The tongue remains in its natural, relaxed position. This contrasts with tafkheem. Note: the letter ر (ra) and ل (lam) in the word Allah can be either heavy or light depending on context.',
    example: {
      arabic: 'بِسْمِ',
      surah: 'Al-Fatihah',
      reference: '1:1',
    },
    tips: [
      'Keep the tongue relaxed and natural',
      'Most letters in Arabic are light — tafkheem is the exception',
      'Pay attention to ر (ra) which switches between heavy and light',
    ],
  },
  {
    id: 'lam-shamsiyyah',
    arabicName: 'لام شمسيّة',
    transliteration: 'Lām Shamsiyyah',
    englishName: 'Sun Letter Assimilation',
    category: 'pronunciation',
    categoryColor: 'text-blue-400',
    color: 'blue',
    description: 'When "al" (الـ) precedes a sun letter, the lam is silent and the sun letter is doubled.',
    detailedExplanation: 'Sun letters (حروف شمسيّة) are 14 letters that cause the lam of "al" to assimilate: ت ث د ذ ر ز س ش ص ض ط ظ ل ن. When "al" precedes one of these, the lam is not pronounced and the sun letter gets shaddah.',
    letters: 'ت ث د ذ ر ز س ش ص ض ط ظ ل ن',
    example: {
      arabic: 'الشَّمْسُ',
      surah: 'At-Takwir',
      reference: '81:1',
    },
    tips: [
      'The lam is written but NOT pronounced',
      'The following letter gets shaddah (doubled)',
      'Example: الشمس is pronounced "ash-shamsu" not "al-shamsu"',
    ],
  },

  // Stopping Rules
  {
    id: 'waqf',
    arabicName: 'وقف',
    transliteration: 'Waqf',
    englishName: 'Stopping / Pausing',
    category: 'stopping',
    categoryColor: 'text-purple-400',
    color: 'purple',
    description: 'Rules for pausing during recitation, including where it is obligatory, recommended, permissible, or forbidden.',
    detailedExplanation: 'Waqf (stopping) has several categories marked in the mushaf: ۘ (obligatory stop), ۘ (forbidden stop), ج (permissible), صلى (better to continue), قلى (better to stop). Proper waqf preserves the meaning of the Quran.',
    example: {
      arabic: 'وَمَا يَعْلَمُ تَأْوِيلَهُ إِلَّا اللَّهُ ۗ',
      surah: 'Aal-e-Imran',
      reference: '3:7',
    },
    tips: [
      'Always stop at the end of an ayah (verse)',
      'Never stop in the middle of a word',
      'Pay attention to waqf marks in the mushaf: ۘ ج صلى قلى',
      'If you must stop mid-ayah, repeat from the beginning when resuming',
    ],
  },
  {
    id: 'sakt',
    arabicName: 'سكت',
    transliteration: 'Sakt',
    englishName: 'Brief Pause',
    category: 'stopping',
    categoryColor: 'text-purple-400',
    color: 'purple',
    description: 'A brief pause without taking a breath, used at specific marked locations in the Quran.',
    detailedExplanation: 'Sakt is a very brief pause (less than 2 counts) without taking a breath. In the Hafs reading, there are four places where sakt is observed: Surah Al-Kahf 18:1-2, Surah Ya-Sin 36:52, Surah Al-Qiyamah 75:27, and Surah Al-Mutaffifin 83:14.',
    example: {
      arabic: 'عِوَجَاۜ ١ قَيِّمًا',
      surah: 'Al-Kahf',
      reference: '18:1-2',
    },
    tips: [
      'Pause briefly but do NOT take a breath',
      'Only 4 places in Hafs reading',
      'The pause separates meanings without disconnecting the recitation',
    ],
  },
];

// ============ Page Component ============

export default function TajweedReferencePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  const filteredRules = useMemo(() => {
    let rules = TAJWEED_RULES;

    if (activeCategory) {
      rules = rules.filter((r) => r.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      rules = rules.filter(
        (r) =>
          r.englishName.toLowerCase().includes(q) ||
          r.transliteration.toLowerCase().includes(q) ||
          r.arabicName.includes(searchQuery) ||
          r.description.toLowerCase().includes(q)
      );
    }

    return rules;
  }, [searchQuery, activeCategory]);

  return (
    <div className="min-h-screen pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[var(--theme-surface)]/90 backdrop-blur-xl border-b border-night-800/30">
        <div className="px-4 pt-safe-top">
          <div className="flex items-center gap-3 py-4">
            <Link
              href="/techniques"
              className="w-9 h-9 rounded-full bg-night-800/60 border border-night-700/30 
                flex items-center justify-center hover:bg-night-700/60 transition"
            >
              <ChevronLeft className="w-5 h-5 text-night-300" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-night-100">Tajweed Rules</h1>
              <p className="text-xs text-night-500 mt-0.5">
                Complete reference for Quranic recitation rules
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-gold-400" />
            </div>
          </div>

          {/* Search */}
          <div className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-night-500" />
              <input
                type="text"
                placeholder="Search rules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-night-900/60 border border-night-800/50 
                  text-sm text-night-100 placeholder:text-night-600 focus:outline-none 
                  focus:border-gold-500/30 focus:ring-1 focus:ring-gold-500/10 transition"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="px-4 py-4 space-y-4">
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition border ${
              !activeCategory
                ? 'bg-gold-500/15 text-gold-400 border-gold-500/30'
                : 'bg-night-900/50 text-night-400 border-night-800/40 hover:bg-night-800/60'
            }`}
          >
            All Rules
          </button>
          {TAJWEED_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition border ${
                activeCategory === cat.id
                  ? `${cat.bg} ${cat.color} ${cat.border}`
                  : 'bg-night-900/50 text-night-400 border-night-800/40 hover:bg-night-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Rules List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredRules.map((rule, idx) => {
              const isExpanded = expandedRule === rule.id;
              const category = TAJWEED_CATEGORIES.find((c) => c.id === rule.category);

              return (
                <motion.div
                  key={rule.id}
                  id={rule.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: idx * 0.03 }}
                  className="bg-night-900/60 rounded-2xl border border-night-800/50 backdrop-blur-sm overflow-hidden"
                >
                  {/* Rule Header */}
                  <button
                    onClick={() => setExpandedRule(isExpanded ? null : rule.id)}
                    className="w-full px-4 py-4 flex items-start gap-3 hover:bg-white/[0.02] transition text-left"
                  >
                    {/* Color indicator */}
                    <div
                      className={`w-1.5 h-12 rounded-full flex-shrink-0 mt-0.5`}
                      style={{
                        backgroundColor:
                          rule.color === 'green' ? '#22c55e' :
                          rule.color === 'orange' ? '#fb923c' :
                          rule.color === 'blue' ? '#60a5fa' :
                          rule.color === 'violet' ? '#a78bfa' :
                          rule.color === 'red' ? '#f87171' :
                          rule.color === 'purple' ? '#c084fc' :
                          rule.color === 'yellow' ? '#facc15' :
                          '#94a3b8',
                      }}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-arabic text-night-100" dir="rtl" lang="ar">
                          {rule.arabicName}
                        </span>
                        <span className={`text-sm font-medium ${rule.categoryColor}`}>
                          {rule.transliteration}
                        </span>
                      </div>
                      <p className="text-xs text-night-400 mt-0.5">{rule.englishName}</p>
                      <p className="text-xs text-night-500 mt-1.5 leading-relaxed line-clamp-2">
                        {rule.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-night-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-night-500" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-4 border-t border-night-800/30 pt-4">
                          {/* Detailed Explanation */}
                          <div>
                            <h4 className="text-xs font-semibold text-night-400 uppercase tracking-wider mb-2">
                              Explanation
                            </h4>
                            <p className="text-sm text-night-300 leading-relaxed">
                              {rule.detailedExplanation}
                            </p>
                          </div>

                          {/* Letters */}
                          {rule.letters && (
                            <div>
                              <h4 className="text-xs font-semibold text-night-400 uppercase tracking-wider mb-2">
                                Letters
                              </h4>
                              <div className="flex gap-2 flex-wrap" dir="rtl">
                                {rule.letters.split(' ').map((letter, i) => (
                                  <span
                                    key={i}
                                    className="w-9 h-9 rounded-lg bg-night-800/80 border border-night-700/30 
                                      flex items-center justify-center text-lg font-arabic text-night-200"
                                  >
                                    {letter}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Example */}
                          <div>
                            <h4 className="text-xs font-semibold text-night-400 uppercase tracking-wider mb-2">
                              Example from Quran
                            </h4>
                            <div className="bg-night-800/50 rounded-xl p-4 border border-night-700/20">
                              <p
                                className="text-xl font-arabic text-night-100 text-center mb-2"
                                dir="rtl"
                                lang="ar"
                              >
                                {rule.example.arabic}
                              </p>
                              <p className="text-xs text-night-500 text-center">
                                {rule.example.surah} ({rule.example.reference})
                              </p>
                            </div>
                          </div>

                          {/* Tips */}
                          <div>
                            <h4 className="text-xs font-semibold text-night-400 uppercase tracking-wider mb-2">
                              Practice Tips
                            </h4>
                            <div className="space-y-2">
                              {rule.tips.map((tip, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <span className="text-gold-500 text-xs mt-0.5">💡</span>
                                  <p className="text-xs text-night-400 leading-relaxed">{tip}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Category Badge */}
                          {category && (
                            <div className="flex items-center gap-2 pt-2 border-t border-night-800/20">
                              <Layers className="w-3.5 h-3.5 text-night-500" />
                              <span className={`text-xs ${category.color}`}>
                                {category.label}
                              </span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredRules.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-8 h-8 text-night-600 mx-auto mb-3" />
              <p className="text-sm text-night-500">No rules match your search</p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
