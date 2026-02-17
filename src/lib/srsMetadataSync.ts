/**
 * SRS Metadata Sync — syncs spaced repetition state to/from Clerk privateMetadata.
 * 
 * This enables cross-device persistence since the SQLite DB is local.
 * Clerk privateMetadata has a ~1MB limit, so we store a compact representation:
 * - key: "surah:ayah" 
 * - value: [easeFactor, interval, repetitions, nextReviewTimestamp, lastReviewTimestamp, status]
 * 
 * Status codes: 0=not_started, 1=learning, 2=reviewing, 3=memorized
 */

import { clerkClient } from '@clerk/nextjs/server';

const STATUS_MAP: Record<string, number> = {
  not_started: 0,
  learning: 1,
  reviewing: 2,
  memorized: 3,
};

const STATUS_REVERSE: Record<number, string> = {
  0: 'not_started',
  1: 'learning',
  2: 'reviewing',
  3: 'memorized',
};

export interface CompactSrsCard {
  /** [easeFactor, interval, repetitions, nextReviewMs, lastReviewMs | 0, statusCode] */
  [key: string]: [number, number, number, number, number, number];
}

export interface SrsMetadata {
  srs: CompactSrsCard;
  /** Timestamp of last sync */
  srsUpdatedAt: number;
}

/**
 * Encode a MemorizationProgress record into compact tuple format.
 */
export function encodeCard(card: {
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: Date | string;
  lastReview: Date | string | null;
  status: string;
}): [number, number, number, number, number, number] {
  return [
    Math.round(card.easeFactor * 100) / 100,
    card.interval,
    card.repetitions,
    new Date(card.nextReview).getTime(),
    card.lastReview ? new Date(card.lastReview).getTime() : 0,
    STATUS_MAP[card.status] ?? 0,
  ];
}

/**
 * Decode a compact tuple back into a usable object.
 */
export function decodeCard(tuple: [number, number, number, number, number, number]) {
  return {
    easeFactor: tuple[0],
    interval: tuple[1],
    repetitions: tuple[2],
    nextReview: new Date(tuple[3]),
    lastReview: tuple[4] ? new Date(tuple[4]) : null,
    status: STATUS_REVERSE[tuple[5]] ?? 'not_started',
  };
}

/**
 * Push SRS state to Clerk privateMetadata for the given user.
 */
export async function pushSrsToClerk(
  clerkUserId: string,
  cards: Array<{
    surahNumber: number;
    ayahNumber: number;
    easeFactor: number;
    interval: number;
    repetitions: number;
    nextReview: Date | string;
    lastReview: Date | string | null;
    status: string;
  }>
): Promise<void> {
  const srs: CompactSrsCard = {};
  for (const card of cards) {
    const key = `${card.surahNumber}:${card.ayahNumber}`;
    srs[key] = encodeCard(card);
  }

  const client = await clerkClient();
  await client.users.updateUserMetadata(clerkUserId, {
    privateMetadata: {
      srs,
      srsUpdatedAt: Date.now(),
    },
  });
}

/**
 * Pull SRS state from Clerk privateMetadata.
 * Returns null if no SRS data exists.
 */
export async function pullSrsFromClerk(
  clerkUserId: string
): Promise<{ cards: Record<string, ReturnType<typeof decodeCard>>; updatedAt: number } | null> {
  const client = await clerkClient();
  const user = await client.users.getUser(clerkUserId);
  const meta = user.privateMetadata as Partial<SrsMetadata> | undefined;

  if (!meta?.srs) return null;

  const cards: Record<string, ReturnType<typeof decodeCard>> = {};
  for (const [key, tuple] of Object.entries(meta.srs)) {
    cards[key] = decodeCard(tuple as [number, number, number, number, number, number]);
  }

  return {
    cards,
    updatedAt: meta.srsUpdatedAt ?? 0,
  };
}
