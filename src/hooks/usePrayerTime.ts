'use client';

import { useState, useEffect } from 'react';

export type PrayerPeriod = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTimeInfo {
  period: PrayerPeriod;
  label: string;
  arabicLabel: string;
}

const PRAYER_INFO: Record<PrayerPeriod, Omit<PrayerTimeInfo, 'period'>> = {
  fajr:    { label: 'Fajr',    arabicLabel: 'الفجر' },
  dhuhr:   { label: 'Dhuhr',   arabicLabel: 'الظهر' },
  asr:     { label: 'Asr',     arabicLabel: 'العصر' },
  maghrib: { label: 'Maghrib', arabicLabel: 'المغرب' },
  isha:    { label: 'Isha',    arabicLabel: 'العشاء' },
};

function getPrayerPeriod(hour: number): PrayerPeriod {
  if (hour >= 4 && hour < 7) return 'fajr';
  if (hour >= 7 && hour < 15) return 'dhuhr';
  if (hour >= 15 && hour < 18) return 'asr';
  if (hour >= 18 && hour < 20) return 'maghrib';
  return 'isha';
}

export interface AmbientColors {
  bg: string;
  bgAlt: string;
  surface: string;
  warmth: string;
  accent: string;
  accentSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSubtle: string;
  goldLeaf: string;
  goldLeafSubtle: string;
}

export const AMBIENT_PALETTES: Record<PrayerPeriod, AmbientColors> = {
  fajr: {
    bg: '#f0eef5',
    bgAlt: '#e8e5f0',
    surface: '#faf9fc',
    warmth: 'rgba(147, 130, 180, 0.06)',
    accent: '#8b7aaf',
    accentSubtle: 'rgba(139, 122, 175, 0.12)',
    textPrimary: '#2a2438',
    textSecondary: '#5c5270',
    textMuted: '#9590a3',
    border: 'rgba(139, 122, 175, 0.15)',
    borderSubtle: 'rgba(139, 122, 175, 0.08)',
    goldLeaf: '#b8973a',
    goldLeafSubtle: 'rgba(184, 151, 58, 0.10)',
  },
  dhuhr: {
    bg: '#faf6ed',
    bgAlt: '#f3ede0',
    surface: '#fffcf5',
    warmth: 'rgba(201, 162, 39, 0.04)',
    accent: '#8b7a5e',
    accentSubtle: 'rgba(139, 122, 94, 0.10)',
    textPrimary: '#2d2a24',
    textSecondary: '#6b6356',
    textMuted: '#a09788',
    border: 'rgba(180, 160, 120, 0.15)',
    borderSubtle: 'rgba(180, 160, 120, 0.08)',
    goldLeaf: '#c9a227',
    goldLeafSubtle: 'rgba(201, 162, 39, 0.10)',
  },
  asr: {
    bg: '#faf3ea',
    bgAlt: '#f2e9dc',
    surface: '#fdf8f2',
    warmth: 'rgba(200, 150, 60, 0.06)',
    accent: '#a07840',
    accentSubtle: 'rgba(160, 120, 64, 0.12)',
    textPrimary: '#302820',
    textSecondary: '#705c44',
    textMuted: '#a09078',
    border: 'rgba(180, 140, 80, 0.18)',
    borderSubtle: 'rgba(180, 140, 80, 0.08)',
    goldLeaf: '#c49020',
    goldLeafSubtle: 'rgba(196, 144, 32, 0.12)',
  },
  maghrib: {
    bg: '#f8ede5',
    bgAlt: '#f0e2d6',
    surface: '#fcf5ef',
    warmth: 'rgba(200, 120, 60, 0.08)',
    accent: '#b07040',
    accentSubtle: 'rgba(176, 112, 64, 0.14)',
    textPrimary: '#2e2420',
    textSecondary: '#6e5040',
    textMuted: '#a08870',
    border: 'rgba(180, 120, 80, 0.18)',
    borderSubtle: 'rgba(180, 120, 80, 0.09)',
    goldLeaf: '#c08028',
    goldLeafSubtle: 'rgba(192, 128, 40, 0.14)',
  },
  isha: {
    // Candlelit manuscript at night — deep warm espresso, not cold navy
    bg: '#1b1712',
    bgAlt: '#13100b',
    surface: '#241e16',
    warmth: 'rgba(180, 150, 90, 0.05)',
    accent: '#c9aa6a',
    accentSubtle: 'rgba(201, 170, 106, 0.14)',
    textPrimary: '#efe7d6',
    textSecondary: '#b3a892',
    textMuted: '#7a7060',
    border: 'rgba(201, 170, 106, 0.14)',
    borderSubtle: 'rgba(201, 170, 106, 0.07)',
    goldLeaf: '#dcb863',
    goldLeafSubtle: 'rgba(220, 184, 99, 0.16)',
  },
};

export function usePrayerTime(): PrayerTimeInfo & { colors: AmbientColors; isDark: boolean } {
  const [period, setPeriod] = useState<PrayerPeriod>(() => getPrayerPeriod(new Date().getHours()));

  useEffect(() => {
    const interval = setInterval(() => {
      setPeriod(getPrayerPeriod(new Date().getHours()));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  return {
    period,
    ...PRAYER_INFO[period],
    colors: AMBIENT_PALETTES[period],
    isDark: period === 'isha',
  };
}
