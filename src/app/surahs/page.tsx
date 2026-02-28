'use client';

import GardenOfSurahs from '@/components/GardenOfSurahs';
import BottomNav from '@/components/BottomNav';

export default function SurahsPage() {
  return (
    <div className="min-h-screen mushaf-glass-bg">
      <GardenOfSurahs />
      <BottomNav />
    </div>
  );
}
