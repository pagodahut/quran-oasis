# W0-3: Lesson-memorized verses must enter the review queue

**Spec:** `docs/design/01-STATE-CONSOLIDATION.md` §B (completeMemorization
facade). Read it first.
**Branch:** `fix/lesson-srs-write`. One PR.

## Problem

There are two memorization UIs writing different stores:

- The canonical runner `src/app/memorize/[surah]/[ayah]/page.tsx` double-writes
  on completion: `progressStore` (key `quranOasis_progress`) AND the SRS store
  (`src/lib/spaced-repetition.ts`, key `qo_srs_state`) — around lines 596–611.
- `src/components/MemorizationPractice.tsx` (embedded in lesson pages via
  `src/app/lessons/[id]/page.tsx`) writes ONLY `progressStore` (~line 175).

Verses memorized inside lessons therefore never appear in Smart Review /
practice queues — they silently vanish from the spaced-repetition system.

## Changes

1. Create a small facade `completeMemorization(surah, ayah, quality)` in
   `src/lib/spaced-repetition.ts` (or a new `src/lib/memorizationFacade.ts` if
   circular imports bite) that performs BOTH writes exactly the way the
   memorize page currently does (progress verse record + SRS
   `recordReview`/initial add), plus dispatches the same update events.
2. Replace the memorize page's inline double-write with the facade (behavior
   must be identical — diff the resulting localStorage payloads).
3. Call the facade from `MemorizationPractice.tsx` on verse completion.

## Acceptance criteria

- Memorize a verse inside a lesson → it appears in the practice hub's due/review
  data (inspect `qo_srs_state` in localStorage) with a first-review record.
- The standalone memorize flow's stored payloads are unchanged (same keys, same
  shapes, same values for the same actions).
- Add a vitest covering the facade: fresh verse → both stores populated;
  repeat review → SRS updated, no duplicate progress entries.
- `npm run type-check && npm run lint && npm test && npx next build` pass.
