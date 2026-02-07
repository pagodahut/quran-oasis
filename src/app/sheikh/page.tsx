'use client';

/**
 * Sheikh Demo Page
 * 
 * Route: /sheikh
 * 
 * Full-page demo of the AI Quran Teacher feature.
 * Shows the sheikh with a real ayah context (Ayatul Kursi by default)
 * so you can test the complete experience.
 * 
 * This page also serves as the marketing showcase for the feature.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import SheikhChat from '@/components/SheikhChat';
import type { AyahContext } from '@/hooks/useSheikhChat';

// Sample ayahs for demo
const SAMPLE_AYAHS: Record<string, AyahContext> = {
  'ayatul-kursi': {
    surahNumber: 2,
    surahName: 'Al-Baqarah',
    surahNameArabic: 'البقرة',
    ayahNumber: 255,
    arabicText:
      'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ',
    translation:
      'Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.',
    transliteration:
      'Allahu laa ilaaha illaa Huwal-Hayyul-Qayyoom. Laa ta\'khuzuhoo sinatun wa laa nawm. Lahoo maa fis-samaawaati wa maa fil-ard...',
    juz: 3,
  },
  fatiha: {
    surahNumber: 1,
    surahName: 'Al-Fatiha',
    surahNameArabic: 'الفاتحة',
    ayahNumber: 1,
    arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation:
      'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    transliteration: 'Bismillaahir Rahmaanir Raheem',
    juz: 1,
  },
  ikhlas: {
    surahNumber: 112,
    surahName: 'Al-Ikhlas',
    surahNameArabic: 'الإخلاص',
    ayahNumber: 1,
    arabicText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    translation: 'Say, "He is Allah, [who is] One."',
    transliteration: "Qul huwal-laahu Ahad",
    juz: 30,
  },
  yaseen: {
    surahNumber: 36,
    surahName: 'Ya-Sin',
    surahNameArabic: 'يس',
    ayahNumber: 1,
    arabicText: 'يس',
    translation: 'Ya, Sin.',
    transliteration: 'Yaa-Seeen',
    juz: 22,
  },
};

export default function SheikhPage() {
  const [selectedAyah, setSelectedAyah] = useState<string>('ayatul-kursi');
  const [userLevel, setUserLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

  const ayah = SAMPLE_AYAHS[selectedAyah];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/30 backdrop-blur-xl sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-lg">📖</a>
            <div>
              <h1 className="text-sm font-semibold">Sheikh HIFZ</h1>
              <p className="text-[11px] text-gray-500">AI Quran Teacher</p>
            </div>
          </div>
          <a
            href="/mushaf"
            className="text-xs text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            Open Mushaf →
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Ayah Selector */}
        <div className="mb-4">
          <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 block">
            Select Ayah to Study
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SAMPLE_AYAHS).map(([key, a]) => (
              <button
                key={key}
                onClick={() => setSelectedAyah(key)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-200 ${
                  selectedAyah === key
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {a.surahName} {a.ayahNumber > 1 ? `· ${a.ayahNumber}` : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Level Selector */}
        <div className="mb-6">
          <label className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 block">
            Your Level
          </label>
          <div className="flex gap-2">
            {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setUserLevel(level)}
                className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all duration-200 ${
                  userLevel === level
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Current Ayah Display */}
        <motion.div
          key={selectedAyah}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm"
        >
          <div className="text-right mb-3">
            <p className="font-arabic text-2xl leading-loose text-amber-100/90">
              {ayah.arabicText}
            </p>
          </div>
          {ayah.transliteration && (
            <p className="text-xs text-gray-500 italic mb-2">{ayah.transliteration}</p>
          )}
          <p className="text-sm text-gray-300 leading-relaxed">{ayah.translation}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded">
              {ayah.surahName} ({ayah.surahNameArabic})
            </span>
            <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded">
              Ayah {ayah.ayahNumber}
            </span>
            {ayah.juz && (
              <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-0.5 rounded">
                Juz {ayah.juz}
              </span>
            )}
          </div>
        </motion.div>

        {/* Chat Interface - Inline Mode */}
        <SheikhChat
          key={`${selectedAyah}-${userLevel}`}
          ayahContext={ayah}
          userLevel={userLevel}
          isOpen={true}
          mode="inline"
        />
      </div>
    </div>
  );
}
