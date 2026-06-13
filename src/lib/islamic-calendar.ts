/**
 * Islamic Calendar utilities.
 *
 * Uses the built-in Umm al-Qura Islamic calendar via Intl (no dependency) to
 * derive the Hijri month/day, so Ramadan detection works every year — not just
 * a single hardcoded Gregorian window. Note: actual Ramadan start can shift ±1
 * day by local moon-sighting; the Umm al-Qura calendar is the widely-used
 * civil approximation.
 */

interface HijriParts {
  year: number;
  month: number; // 1-12 (Ramadan = 9)
  day: number;   // 1-30
}

function getHijriParts(date: Date = new Date()): HijriParts | null {
  try {
    const fmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
    const parts = fmt.formatToParts(date);
    const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
    const year = get('year');
    const month = get('month');
    const day = get('day');
    if (!month || !day) return null;
    return { year, month, day };
  } catch {
    return null;
  }
}

export function isRamadan(date: Date = new Date()): boolean {
  const h = getHijriParts(date);
  return h ? h.month === 9 : false;
}

export function getRamadanDay(date: Date = new Date()): number {
  const h = getHijriParts(date);
  return h && h.month === 9 ? h.day : 0;
}

export function isLastTenNights(date: Date = new Date()): boolean {
  return getRamadanDay(date) >= 21;
}

export function isJummah(date: Date = new Date()): boolean {
  return date.getDay() === 5; // Friday (JS: Sunday=0)
}

/** Hijri date as a display string, e.g. "15 Ramadan 1447". */
export function getHijriDateString(date: Date = new Date()): string | null {
  try {
    return new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return null;
  }
}
