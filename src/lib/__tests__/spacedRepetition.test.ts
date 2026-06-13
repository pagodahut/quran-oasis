import { describe, it, expect } from 'vitest';
import {
  calculateNextReview,
  calculateQuranReview,
  getQuranReviewInterval,
  createNewCard,
  getCardStatus,
  planStudySession,
  getDailyLoad,
  getNextReviewText,
  QUALITY_RATINGS,
  QURAN_INTERVALS,
} from '../spacedRepetition';

describe('SM-2 calculateNextReview', () => {
  it('resets repetitions on failed recall (quality < 3)', () => {
    const card = { ...createNewCard(), repetitions: 5, interval: 30, easeFactor: 2.5 };
    const result = calculateNextReview(card, QUALITY_RATINGS.HARD);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });

  it('sets interval to 1 on first successful review', () => {
    const card = createNewCard();
    const result = calculateNextReview(card, QUALITY_RATINGS.GOOD);
    expect(result.interval).toBe(1);
    expect(result.repetitions).toBe(1);
  });

  it('sets interval to 6 on second successful review', () => {
    const card = { ...createNewCard(), repetitions: 1, interval: 1, easeFactor: 2.5 };
    const result = calculateNextReview(card, QUALITY_RATINGS.GOOD);
    expect(result.interval).toBe(6);
    expect(result.repetitions).toBe(2);
  });

  it('multiplies interval by ease factor on subsequent reviews', () => {
    const card = { ...createNewCard(), repetitions: 2, interval: 6, easeFactor: 2.5 };
    const result = calculateNextReview(card, QUALITY_RATINGS.EASY);
    expect(result.interval).toBe(15); // 6 * 2.5 = 15
    expect(result.repetitions).toBe(3);
  });

  it('never drops ease factor below 1.3', () => {
    const card = { ...createNewCard(), easeFactor: 1.3 };
    const result = calculateNextReview(card, QUALITY_RATINGS.BLACKOUT);
    expect(result.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it('increases ease factor on perfect recall', () => {
    const card = createNewCard();
    const result = calculateNextReview(card, QUALITY_RATINGS.PERFECT);
    expect(result.easeFactor).toBeGreaterThan(2.5);
  });

  it('decreases ease factor on hard recall', () => {
    const card = { ...createNewCard(), easeFactor: 2.5, repetitions: 3, interval: 10 };
    const result = calculateNextReview(card, QUALITY_RATINGS.GOOD);
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it('sets nextReview in the future', () => {
    const card = createNewCard();
    const before = new Date();
    const result = calculateNextReview(card, QUALITY_RATINGS.GOOD);
    expect(result.nextReview.getTime()).toBeGreaterThanOrEqual(before.getTime());
  });
});

describe('Quran-specific intervals', () => {
  it('follows fixed interval schedule for early repetitions', () => {
    expect(QURAN_INTERVALS).toEqual([1, 2, 4, 7, 14, 30, 60]);
    for (let i = 0; i < QURAN_INTERVALS.length; i++) {
      expect(getQuranReviewInterval(i, 2.5)).toBe(QURAN_INTERVALS[i]);
    }
  });

  it('uses SM-2 calculation beyond fixed intervals', () => {
    const interval = getQuranReviewInterval(QURAN_INTERVALS.length, 2.5);
    expect(interval).toBe(Math.round(60 * Math.pow(2.5, 1)));
  });

  it('caps ease factor at 2.5 in Quran review', () => {
    const card = { ...createNewCard(), easeFactor: 2.5 };
    const result = calculateQuranReview(card, QUALITY_RATINGS.PERFECT);
    expect(result.easeFactor).toBeLessThanOrEqual(2.5);
  });

  it('resets on failed recall', () => {
    const card = { ...createNewCard(), repetitions: 5, interval: 30, easeFactor: 2.5 };
    const result = calculateQuranReview(card, QUALITY_RATINGS.INCORRECT);
    expect(result.repetitions).toBe(0);
    expect(result.interval).toBe(1);
  });
});

describe('getCardStatus', () => {
  it('returns new for fresh card', () => {
    expect(getCardStatus(createNewCard())).toBe('new');
  });

  it('returns learning for interval < 7', () => {
    expect(getCardStatus({ ...createNewCard(), repetitions: 1, interval: 3 })).toBe('learning');
  });

  it('returns reviewing for interval 7-29', () => {
    expect(getCardStatus({ ...createNewCard(), repetitions: 3, interval: 14 })).toBe('reviewing');
  });

  it('returns memorized for interval >= 30', () => {
    expect(getCardStatus({ ...createNewCard(), repetitions: 5, interval: 30 })).toBe('memorized');
  });
});

describe('planStudySession', () => {
  it('allocates 70/30 split between review and new', () => {
    const { reviewCount, newCount } = planStudySession(100, 100, 20);
    expect(reviewCount).toBe(7); // ceil(10 * 0.7)
    expect(newCount).toBe(3); // min(100, 3, floor(10 * 0.3))
  });

  it('caps review count by available due cards', () => {
    const { reviewCount, newCount } = planStudySession(2, 100, 20);
    expect(reviewCount).toBe(2);
    expect(newCount).toBe(3);
  });

  it('caps new count by available new cards', () => {
    const { reviewCount, newCount } = planStudySession(100, 1, 20);
    expect(reviewCount).toBe(7);
    expect(newCount).toBe(1);
  });

  it('handles zero available cards', () => {
    const { reviewCount, newCount } = planStudySession(0, 0, 20);
    expect(reviewCount).toBe(0);
    expect(newCount).toBe(0);
  });
});

describe('getDailyLoad', () => {
  it('returns correct number of days', () => {
    const cards = [createNewCard()];
    const load = getDailyLoad(cards, 3);
    expect(Object.keys(load)).toHaveLength(3);
  });

  it('counts cards due on each day', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const cards = [
      { ...createNewCard(), nextReview: new Date() },
      { ...createNewCard(), nextReview: tomorrow },
      { ...createNewCard(), nextReview: tomorrow },
    ];
    const load = getDailyLoad(cards, 3);
    const days = Object.values(load);
    expect(days[0]).toBe(1);
    expect(days[1]).toBe(2);
  });
});

describe('getNextReviewText', () => {
  it('shows "Due now" for past dates', () => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    expect(getNextReviewText(past)).toBe('Due now');
  });

  it('shows "Tomorrow" for next day', () => {
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 0);
    expect(getNextReviewText(tomorrow)).toBe('Tomorrow');
  });

  it('shows weeks for 7-29 days', () => {
    const future = new Date();
    future.setDate(future.getDate() + 14);
    expect(getNextReviewText(future)).toBe('In 2 weeks');
  });

  it('shows months for 30+ days', () => {
    const future = new Date();
    future.setDate(future.getDate() + 60);
    expect(getNextReviewText(future)).toBe('In 2 months');
  });
});
