# W0-4: One streak number on the profile page

**Spec:** `docs/design/01-STATE-CONSOLIDATION.md` §A (streak ownership:
motivationStore wins). Read it first.
**Branch:** `fix/profile-streak`. One PR.

## Problem

`src/app/profile/page.tsx` renders two streaks from two different stores that
can disagree on the same screen:

- Avatar badge (~line 268) + stats grid use
  `progressStore.getProgressStats().currentStreak`.
- The `StreakDisplay` component just below (~line 306) uses
  `motivationStore.getStreakInfo()`.

`motivationStore` (`src/lib/motivationStore.ts`) is the richer engine (streak
freezes, milestones) and is what `/progress` uses.

## Changes

1. In `profile/page.tsx`, source ALL streak values (avatar badge, "Best
   Streak" stat card, StreakDisplay) from `motivationStore.getStreakInfo()`
   (`current`, `longest`). Remove the progressStore streak reads. Keep
   progressStore for the non-streak stats it still owns (verses memorized may
   also come from `getQuranProgress` — leave those reads as they are).
2. Do NOT modify progressStore's streak internals — store merge is Wave 1.
3. Relabel `StudyProfile`'s third "streak" (`src/components/StudyProfile.tsx`,
   `streakDays` from studyTracker) to "active days" so it doesn't read as a
   contradicting streak. Copy change only.

## Acceptance criteria

- Profile page shows one consistent streak number everywhere; matches the
  `/progress` page.
- StudyProfile's insight card says "active days" (or similar), not "streak".
- `npm run type-check && npm run lint && npm test && npx next build` pass.
