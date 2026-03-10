'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, BookOpen, Search } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { SURAH_METADATA } from '@/lib/surahMetadata';

export default function MemorizePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');

  // Track origin for return navigation
  const fromOrigin = searchParams.get('from');
  const originSurah = searchParams.get('surah');

  const backHref = fromOrigin === 'mushaf'
    ? (originSurah ? `/mushaf?surah=${originSurah}` : '/mushaf')
    : '/mushaf';

  const filtered = SURAH_METADATA.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString().includes(search)
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 safe-area-top liquid-glass mx-2 rounded-2xl">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href={backHref} className="liquid-icon-btn">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-lg text-night-100">Start Memorizing</h1>
            <p className="text-xs text-night-500">Choose a surah to begin</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-gold-400" />
          </div>
        </div>
      </header>

      <main className="px-4 py-4 pb-32 max-w-lg mx-auto">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-night-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search surahs..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-night-800/50 border border-night-700/50 text-night-100 placeholder-night-600 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/20 transition-colors text-sm"
          />
        </div>

        {/* Surah list */}
        <div className="space-y-2">
          {filtered.map((surah) => (
            <button
              key={surah.number}
              onClick={() => {
                const suffix = fromOrigin === 'mushaf'
                  ? `?from=mushaf&surah=${originSurah || surah.number}`
                  : '';
                router.push(`/memorize/${surah.number}/1${suffix}`);
              }}
              className="w-full liquid-card p-4 flex items-center gap-3 text-left hover:bg-white/[0.04] transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-gold-500/10 flex items-center justify-center text-sm font-medium tabular-nums text-gold-400">
                {surah.number}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-night-100 font-medium">{surah.englishName}</p>
                <p className="text-xs text-night-500">{surah.numberOfAyahs} ayahs · {surah.revelationType}</p>
              </div>
              <p className="text-gold-400 text-lg" style={{ fontFamily: 'var(--font-arabic)' }}>
                {surah.name}
              </p>
            </button>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
