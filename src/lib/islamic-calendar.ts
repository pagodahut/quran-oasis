/**
 * Islamic Calendar utilities — simplified Ramadan detection.
 * TODO: Replace hardcoded dates with proper Hijri calendar conversion.
 */

// Ramadan 1447 AH ≈ Feb 17 – Mar 19, 2026 (approximate)
const RAMADAN_2026_START = new Date(2026, 1, 17); // Feb 17
const RAMADAN_2026_END = new Date(2026, 2, 19);   // Mar 19
const LAST_TEN_START_DAY = 21; // Ramadan day 21+

export function isRamadan(date: Date = new Date()): boolean {
  return date >= RAMADAN_2026_START && date <= RAMADAN_2026_END;
}

export function getRamadanDay(date: Date = new Date()): number {
  if (!isRamadan(date)) return 0;
  const diffMs = date.getTime() - RAMADAN_2026_START.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

export function isLastTenNights(date: Date = new Date()): boolean {
  return getRamadanDay(date) >= LAST_TEN_START_DAY;
}

export function isJummah(date: Date = new Date()): boolean {
  return date.getDay() === 5;
}
