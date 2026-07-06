# 02 — Hifz Journey Engine

**Status:** Design / implementation-ready
**Author:** Journey Engine working group
**Depends on:** `01-STATE-CONSOLIDATION` (assumes `src/lib/spaced-repetition.ts` `srs` singleton is the single SRS engine and single source of memorization truth)
**Goal:** A non-native Arabic reader goes from zero to memorizing the entire Qur'an (114 surahs, 6,236 ayahs) on a guided daily plan that never runs out.

---

## 0. Problem statement (verified against code)

The app can teach ~131 authored ayahs, then falls off a cliff. There is no engine that (a) knows *what surah/ayah comes next*, (b) *sizes today's work*, or (c) *routes the user there*. Concretely:

| Symptom | Evidence |
|---|---|
| Authored lessons stop at ~131 ayahs | `src/lib/lesson-content.ts` beginner units 1–5 (alphabet → Al-Fatiha → 7 short surahs), `intermediate-lessons.ts`, `advanced-lessons.ts`. `BEGINNER_UNITS` at `lesson-content.ts:4743`. |
| Lesson gating disabled | `isLessonUnlocked()` hardcodes `return true` at `lesson-content.ts:4693-4696`; real prereq logic commented out. |
| A full traditional-hifz model exists but is **dead code** | `src/lib/memorization-flow.ts` (1,280 lines) — sabaq/sabqi/manzil, 10-3/20-20/stacking/page methods, `MANZIL_DIVISIONS`, `generateDailyPlan()`. **Zero importers** (`grep -rln memorization-flow src/` → none). |
| Live SRS store already has the three categories | `spaced-repetition.ts` — `srs` singleton, `qo_srs_state`, SM-2, `categorize()` by interval (sabaq ≤3d, sabqi ≤14d, manzil >14d), `getDueAyahs()`. |
| Memorize runner works for any ayah but does not sequence | `/memorize/[surah]/[ayah]/page.tsx`; `goToNextVerse()` at `:709-719` pushes to `/practice` after a surah's last ayah. SRS is recorded at `:610-611` (`srs.addAyah` + `srs.recordReview`). |
| Study plan set once, never advanced | `api/onboarding/route.ts:74-95` sets `StudyPlan.currentSurah/currentAyah`; nothing updates it. `lessonPlanner.ts` `determineStartingSurah()` (:305) is a stub, zero importers. |
| Dashboard "Continue" points at "most recently reviewed", not a plan | `dashboard/page.tsx:135-157` `lastActiveVerse` = max `lastReview`; ribbon links `memorize/{surah}/{ayah}` (`:285`, `:380`). "Up Next" (`:448-456`) links `memorize/{surahNumber}/1`. |
| JourneyMap is decorative | `components/JourneyMap.tsx` `JourneyOverview` — 6 hardcoded stages, `lessons: '∞'` (:65), `opacity-50` past stage 1 (:100, :115). |
| Transliteration + word-by-word are online-only | `WordByWordGrid.tsx:40-41` fetches `api.quran.com/api/v4/verses/by_key/...`. Nothing bundled. Surah JSON (`src/data/surahs/*.json`) carries only `text.arabic` + `translations.{asad,sahih}` per ayah — no words, no transliteration. |

**Design stance toward `memorization-flow.ts`:** We **absorb its domain concepts and delete the module.** Its session-state machines (RepetitionState, StackingState, PageMethodState) duplicate the 7-phase runner already in the memorize page; its `getSabqiVerses`/`getManzilVerses` reimplement day-since logic that `srs.categorize()` now owns via SM-2 intervals. We keep its *ideas* (portion sizing, sabaq/sabqi/manzil daily split, the 10-3 method, juz ranges) and re-express them against `srs`. See §H PR-0.

---

## A. Memorization tracks

### A.1 Data structure

A **track** is an ordered list of **segments**. A segment is a contiguous ayah range within one surah, tagged with juz/hizb metadata so surfaces can render progress without re-deriving it. Splitting on surah boundaries (not juz boundaries) keeps the end-of-surah milestone (§D.2) clean and matches how users think ("I finished An-Naba").

```ts
// src/lib/journey/tracks.ts  (NEW, static module — no network, no DB)

export type TrackId = 'mufassal' | 'sequential' | 'custom';

export interface TrackSegment {
  surah: number;        // 1..114
  startAyah: number;    // inclusive
  endAyah: number;      // inclusive (usually = numberOfAyahs)
  juz: number;          // juz of startAyah (from surah JSON ayah.juz)
  hizbQuarter: number;  // hizbQuarter of startAyah (from ayah.hizbQuarter)
}

export interface Track {
  id: TrackId;
  title: string;
  subtitle: string;
  /** Ordered segments. Concatenated, these cover exactly the track's scope. */
  segments: TrackSegment[];
  /** true only for 'custom' — user-editable, persisted in journey state, not here. */
  editable: boolean;
}
```

The two built-in tracks are **generated once at build time** from the bundled surah JSON (juz/hizbQuarter are already per-ayah, e.g. `surahs/78.json` ayah 1 → `"juz":30,"hizbQuarter":233`) and checked in as a static TS constant. No runtime computation, no fetch.

- **`mufassal` (classical madrasa order):** Juz 30 (surahs 78→114) as individual segments, then Juz 29 (67→77), then Juz 28 (58→66), then **Al-Baqarah forward** (2, 3, 4, … 57), and finally Al-Fatiha is treated as already-known on-ramp (it's an authored lesson). This is the default for `arabicLevel ∈ {none, letters}`.
- **`sequential`:** segments for surah 1, 2, 3, … 114 in order. Default for experienced readers who want a mushaf-order khatm.
- **`custom`:** empty at construction; the user's picked surahs become segments, stored in journey state (§C), ordered by pick order (or offered sorted by ascending length as an "easiest first" toggle).

`buildMufassalTrack()` / `buildSequentialTrack()` live in `scripts/build-tracks.ts` and emit `src/lib/journey/tracks.generated.ts`. `tracks.ts` re-exports them plus `getTrack(id)`, `nextSegment(track, i)`, and `segmentAyahCount(seg)`.

> Al-Fatiha (surah 1) is the one surah every track user already memorizes via authored beginner Unit 3. Mufassal therefore starts sabaq at An-Naba equivalents but the JourneyMap still shows surah 1 at 100% once its authored lesson completes (§E writes it into `srs`).

### A.2 Switching tracks mid-journey without losing progress

Progress lives in `srs` (`qo_srs_state`), keyed by `surah:ayah` — **not** by track. A track is only a *cursor + ordering*. Switching tracks therefore never touches memorization data:

1. User picks a new track in Settings → Journey.
2. `switchTrack(newId)` sets `journey.trackId = newId` and **recomputes the cursor** by scanning the new track's segments in order and skipping any segment already fully memorized in `srs` (every ayah in the range is `manzil`/`memorized` per §B.5). The cursor lands on the first not-yet-complete segment, ayah = first non-memorized ayah in it.
3. Segment `started/completed` timestamps (§C) are recomputed lazily from `srs` (`addedDate` / graduation date) — they are display metadata, not truth.

Net effect: a user who memorized Juz 30 on Mufassal and switches to Sequential resumes at Al-Baqarah (surahs 2–57 unmemorized come before 58–114), with Juz 30 already showing green on the map. No data migration, no loss.

---

## B. The daily assignment engine (the heart)

Location: `src/lib/journey/assignment.ts` (NEW). Pure functions; reads `srs` + journey state + bundled surah text lengths; returns a plain object. Called by dashboard, `/practice`, and the memorize runner so **all three surfaces show the identical assignment**.

### B.1 Inputs

```ts
interface AssignmentInput {
  track: Track;
  cursor: JourneyCursor;          // §C: { segmentIndex, ayahCursor }
  srsDue: DueAyahs;               // srs.getDueAyahs() — {sabaq, sabqi, manzil}
  allStates: AyahSRSState[];      // srs.getAllAyahs() — for corpus size / manzil rotation
  capacity: DailyCapacity;        // derived from onboarding time (§B.2)
  today: string;                  // localDateKey()
}
```

### B.2 Capacity: size by ayah **length**, not count

An-Naba ayahs (~30–60 Arabic chars) and Al-Baqarah ayahs (up to ~250 chars) are not interchangeable "1 ayah" units. Capacity is a **character budget** per category, derived once from onboarding `dailyTimeMinutes` and adjustable in Settings.

```ts
/** Diacritic-insensitive letter count = memorization difficulty proxy.
 *  Reuse stripMarks() from quranData.ts (already strips tashkeel/tatweel/BOM). */
function ayahWeight(arabic: string): number {
  return stripMarks(arabic).replace(/\s/g, '').length; // "letters" only
}

// Built at build time into src/data/journey/ayah-weights.json  (6,236 ints, ~25 KB)
// weights["2:255"] = 210, weights["114:1"] = 22, ...

const NEW_CHAR_BUDGET: Record<number, number> = { // dailyTimeMinutes → chars of NEW material
  10: 110,   // ≈ 2–3 short mufassal ayahs, or a fraction of one Baqarah ayah
  15: 170,
  20: 240,
  30: 360,
  45: 520,
  60: 720,
};
```

Sabaq is filled **up to** the char budget, always taking **whole ayahs** from the cursor forward, minimum 1 ayah (so a single 250-char Baqarah ayah is a valid, honest full day — the plan never demands half an ayah). This is the length-aware replacement for `memorization-flow.ts`'s count-based `DAILY_TARGETS` (`:251-256`) and the onboarding `dailyNewVerses` count (`onboarding/route.ts:36-61`).

### B.3 Adaptive sabaq sizing

Recent performance nudges the budget ±25%:

```
recentAccuracy = mean(lastAccuracy) over ayahs graduated in the last 7 days
if recentAccuracy < 0.6:  budget *= 0.75   // struggling → smaller bites
if recentAccuracy > 0.9:  budget *= 1.25   // cruising → let them go faster
budget = clamp(budget, weight(nextAyah), NEW_CHAR_BUDGET[time] * 1.5)
```

### B.4 The algorithm

```
function buildDailyAssignment(input): DailyAssignment {

  // ---- 1. REVIEW BACKLOG (sabqi + manzil) comes first; caps protect the user ----
  sabqiDue  = input.srsDue.sabqi            // due, most-overdue-first (srs already sorts)
  manzilDue = manzilForToday(input)         // §B.6 rotation, bounded

  reviewCap = REVIEW_CAP[time]              // §B.7 hard ceiling in ayahs-equivalent
  sabqiPlan  = takeWithinWeight(sabqiDue,  reviewCap.sabqiChars)
  manzilPlan = takeWithinWeight(manzilDue, reviewCap.manzilChars)
  reviewOverflow = (sabqiDue.length - sabqiPlan.length)
                 + (manzilDue.length - manzilPlan.length)

  // ---- 2. SABAQ (new) — only if the user is not drowning ----
  backlogRatio = (sabqiDue.weight + manzilDue.weight) / (reviewCap.total)
  if (backlogRatio > 1.5) {
     sabaqPlan = []                          // pause new memorization; clear the debt first
     mode = 'catch-up'
  } else {
     budget  = adaptiveBudget(input)         // §B.3
     sabaqPlan = takeAyahsFromCursor(input.track, input.cursor, budget)   // §B.2
     mode = 'normal'
  }

  return { date: today, mode, sabaq: sabaqPlan, sabqi: sabqiPlan,
           manzil: manzilPlan, reviewOverflow,
           estMinutes: estimate(sabaqPlan, sabqiPlan, manzilPlan) }
}
```

`takeAyahsFromCursor` walks segments starting at the cursor, accumulating whole ayahs until adding the next would exceed `budget` (but always ≥1). When it crosses a segment boundary it keeps going into the next segment — the daily plan is continuous even across surah ends; the *milestone screen* (§D.2) fires separately when the runner finishes a surah's last ayah.

`estimate()` reuses the per-category seconds from `memorization-flow.ts:246-248` (new 180s, sabqi 30s, manzil 10s **per ayah**) — the one constant worth keeping.

### B.5 "Memorized" — the completion criterion per ayah

An ayah counts toward journey % and toward "segment complete" when its `srs` state satisfies:

```
isMemorized(s) = categorize(s) === 'manzil'   // interval > 14d
              && s.repetitions >= 3
              && s.lastAccuracy >= 0.7
```

This is stricter than "reviewed once." It requires the ayah to have survived at least to the manzil interval band with three consecutive good-or-better recalls. It maps cleanly onto the existing DB `status` field (`sync/route.ts:175`) — `isMemorized` → `status: 'memorized'`; in-progress (sabaq/sabqi) → `'reviewing'`; brand-new → `'learning'`.

A **segment** is complete when every ayah in its range is `isMemorized`. The **journey** is complete when every segment of the track is complete (6,236 ayahs at manzil for the full-hifz tracks).

### B.6 Manzil rotation — "monthly khatm of what you know"

Pure SRS-due manzil can clump (many ayahs graduating the same week come due the same week). We guarantee a smooth maintenance load with a **rotation floor**: each day the user reviews at least `ceil(memorizedCorpus / 30)` of their oldest-reviewed memorized ayahs — a rolling monthly khatm of the memorized portion, the traditional manzil target (cf. `memorization-flow.ts` `MANZIL_DIVISIONS`, which hard-coded a 7-day cycle; we use 30-day and drive it off actual memorized set).

```
manzilForToday = union(
   srsDue.manzil,                                   // anything SM-2 says is due
   oldestReviewed(memorizedSet, count = ceil(|memorizedSet| / 30))
) sorted by lastReviewDate asc, deduped
```

then clipped by the cap in §B.7. The `srs` interval cap of 180 days (`spaced-repetition.ts:164`) already prevents any ayah from disappearing for more than 6 months; the 1/30 rotation tightens that to ~monthly for the memorized corpus.

### B.7 Catch-up after missed days (no shame spiral)

Missing days makes `srsDue.manzil`/`sabqi` pile up. Rules:

1. **Hard cap** on review shown per day, `REVIEW_CAP[time]` (ayah-equivalent chars ≈ what fits in the user's daily minutes for review, e.g. 30-min user → ~40 sabqi + ~120 manzil ayahs). Overflow is **not** discarded — those ayahs keep their past `nextReviewDate` and resurface next day, still most-overdue-first (already the sort order in `getDueAyahs`, `spaced-repetition.ts:277-284`). Debt drains over a few days instead of dumping 400 items at once.
2. **Pause new** when `backlogRatio > 1.5` (§B.4): no sabaq until review debt is back under control. The cursor does not move; the track waits.
3. **No shame surface.** UI says *"Welcome back — let's rebuild. N verses to refresh today,"* never *"473 overdue."* `reviewOverflow` is used only internally to decide pacing; the number shown is the capped, achievable amount.
4. **Streak grace** is out of scope here (owned by `motivationStore.ts`); the engine simply never punishes with an impossible pile.

---

## C. Journey state

Journey position is **cursor + display metadata only**. Memorization truth stays in `srs`. This keeps the two stores from disagreeing.

```ts
// src/lib/journey/journeyStore.ts  (NEW)

export interface JourneyCursor {
  segmentIndex: number;   // index into track.segments
  ayahCursor: number;     // next un-started ayah number within that segment
}

export interface SegmentStamp {
  segmentIndex: number;
  startedAt: string | null;    // ISO — first sabaq touch (from srs addedDate)
  completedAt: string | null;  // ISO — when last ayah hit isMemorized
}

export interface JourneyState {
  version: 1;
  trackId: TrackId;
  cursor: JourneyCursor;
  customSegments?: TrackSegment[];   // present only when trackId === 'custom'
  stamps: SegmentStamp[];            // sparse; only for started/completed segments
  startedAt: string;                 // journey start ISO
  lastAdvancedAt: string | null;     // last cursor move
  capacityOverride?: Partial<Record<'newCharBudget'|'reviewCap', number>>;
}
```

**Storage:** `localStorage` key `qo_journey` (mirrors `qo_srs_state`). Module exports a singleton `journey` with `get()`, `switchTrack(id)`, `setCustomSurahs(nums[])`, `advanceCursor(srs)`, `recomputeCursor(track, srs)`, `exportForSync()`, `importFromSync()`.

**Sync:** extend the existing `/api/user/sync` pattern (`api/user/sync/route.ts`). Add a nullable `journeyState Json?` column to `StudyPlan` (already 1:1 with user). GET returns `studyPlan.journeyState`; POST accepts `journey` in the body and upserts it. Conflict resolution mirrors `srs.importFromSync` (`spaced-repetition.ts:352-361`): keep the state with the later `lastAdvancedAt`. The cursor is cheap and idempotent to recompute, so even a lost sync self-heals via `recomputeCursor` on next load.

**`updateJourney()` call sites (exactly two writers):**

1. **End of a memorize session** — in the runner after `srs.recordReview` (`memorize/[surah]/[ayah]/page.tsx:610-611`), call `journey.advanceCursor(srs)`. It moves `ayahCursor` past every now-`isMemorized` ayah, crossing segment boundaries and writing `stamps[].completedAt` when a segment finishes. Then debounced push to `/api/user/sync`.
2. **End of a review session** — in `/practice` after `srs.recordBatchReview` (`practice/page.tsx:120`), call `journey.advanceCursor(srs)` too (a review can push a sabqi ayah over the `isMemorized` line and complete a segment). Same debounced sync.

Both are no-ops if nothing changed, so calling them liberally is safe.

---

## D. Surface integration

### D.1 Dashboard "Continue" ribbon = today's assignment

Replace the `lastActiveVerse` heuristic (`dashboard/page.tsx:135-157`, "max lastReview") with `buildDailyAssignment(...)`. The ribbon shows the three-part breakdown and deep-links into the right runner:

```
┌─────────────────────────────────────────────┐
│  Today's Journey        An-Naba · Juz 30      │
│  ● Sabaq   3 new ayahs (78:1–3)   →/memorize  │
│  ● Sabqi   12 to refresh          →/practice  │
│  ● Manzil  1/30 khatm · 18 ayahs  →/practice  │
│  ~22 min · [ Start ]                          │
└─────────────────────────────────────────────┘
```

`Start` routes to sabaq's first ayah: `/memorize/{sabaq[0].surah}/{sabaq[0].ayah}`. In **catch-up** mode the copy flips to the §B.7 rebuild message and `Start` routes to `/practice`. "Up Next" (`dashboard/page.tsx:448-456`) is replaced by the next 3 upcoming segments from the track cursor, not `memorize/{n}/1`.

### D.2 End-of-surah flow in the memorize runner

Rewrite `goToNextVerse()` (`page.tsx:709-719`). Instead of dumping to `/practice` at a surah's last ayah:

```
onLastAyahOfSurah:
  journey.advanceCursor(srs)                 // completes the segment, stamps completedAt
  if (justCompletedSegment) show <SegmentMilestone/>   // celebratory screen
  else router.push next ayah                 // mid-segment, continue
```

`<SegmentMilestone/>` (new, reuse `AchievementUnlock` from `JourneyMap.tsx:480`) shows: surah name, "Surah X memorized · Juz progress N%", corpus %, and a single primary button **"Continue to {nextSegment.surahName}"** → `/memorize/{next.surah}/{next.startAyah}`. If the track is finished, it shows the khatm screen. The within-surah branch (`ayahNum < numberOfAyahs`, `:712-713`) is unchanged.

### D.3 Real JourneyMap — 30-juz grid

Delete `JourneyOverview` (`JourneyMap.tsx:18-135`, the decorative 6-stage `'∞'` component). Replace with `<JourneyMap/>`: a 30-cell juz grid where each cell's fill % = memorized ayahs in that juz ÷ total ayahs in that juz, computed from `srs.getAllAyahs()` filtered by `isMemorized` and the bundled `ayah.juz` field. The current segment's juz is highlighted; tapping a juz opens its surah list with per-surah %. `UnitProgressCard`, `MilestoneBadge`, `WeeklyGoalTracker`, `DailyWisdom`, `AchievementUnlock` (all in `JourneyMap.tsx`) are **kept** and reused.

### D.4 `/practice` hub reads the same assignment

`practice/page.tsx` already reads `srs.getDueAyahs()`/`getDueCount()` (`:94-146`). Change it to call `buildDailyAssignment()` and render the *capped* sabqi/manzil sets (§B.7) rather than the raw due counts, so the number on the dashboard and the number in Practice match exactly. The sabaq card in Practice deep-links to the memorize runner.

**Component changes summary**

| Change | File |
|---|---|
| DELETE | `memorization-flow.ts`, `lessonPlanner.ts` (both zero-importer dead code) |
| DELETE | `JourneyOverview` export in `JourneyMap.tsx` |
| NEW | `journey/tracks.ts`, `journey/tracks.generated.ts`, `journey/assignment.ts`, `journey/journeyStore.ts`, `<JourneyMap/>`, `<SegmentMilestone/>` |
| EDIT | `dashboard/page.tsx` ribbon (§D.1), `memorize/.../page.tsx` `goToNextVerse` (§D.2), `practice/page.tsx` (§D.4), `sync/route.ts` + Prisma `StudyPlan.journeyState` (§C), `lesson-content.ts` `isLessonUnlocked` (§E) |
| KEEP | `spaced-repetition.ts` (the engine), the 7-phase runner, `quranData.ts` loaders |

---

## E. Where authored lessons fit — the on-ramp + generated lessons

### E.1 Authored lessons become prerequisite gates

The ~131 authored ayahs (alphabet → harakat → tajweed → Al-Fatiha → short surahs) are the **on-ramp**, not a parallel track. Map them to journey gates:

```ts
// journey/gates.ts
const SABAQ_PREREQUISITES = ['lesson-1','lesson-2','lesson-3','lesson-4','lesson-5', // alphabet
                             'lesson-6','lesson-7','lesson-8'];                       // harakat/reading
// A track user cannot begin sabaq on unauthored ayahs until these are complete,
// UNLESS onboarding calibration (arabicLevel ∈ {basic,intermediate,fluent}) skips them.
function canStartSabaq(completedLessonIds, arabicLevel) {
  if (arabicLevel !== 'none' && arabicLevel !== 'letters') return true; // calibrated skip
  return SABAQ_PREREQUISITES.every(id => completedLessonIds.includes(id));
}
```

### E.2 Fix `isLessonUnlocked` properly

Restore the commented real logic (`lesson-content.ts:4697-4701`), i.e. gate on `prerequisites`:

```ts
export function isLessonUnlocked(lessonId, completedLessonIds) {
  const lesson = getLessonById(lessonId);
  if (!lesson) return false;
  if (!lesson.prerequisites?.length) return true;
  return lesson.prerequisites.every(p => completedLessonIds.includes(p));
}
```

Authored beginner lessons already carry `prerequisites?: string[]` (`lesson-content.ts:87`). Populate them in a chain (lesson-2 requires lesson-1, …) if not already set. When Al-Fatiha's authored lesson completes, write its 7 ayahs into `srs` (`srs.addAyahs(1,1,7)` then mark reviewed) so surah 1 shows 100% on the map without a redundant sabaq.

### E.3 Generated lessons for the 6,100 unauthored ayahs (no AI, offline)

Every ayah past the authored set is memorized through a **generated lesson wrapper** — no hand-authoring, no model calls:

```
GeneratedLesson(surah, ayahRange) = {
  runner:   existing 7-phase /memorize/[surah]/[ayah]   (already works for any ayah)
  arabic:   surahs/{n}.json  ayah.text.arabic           (bundled)
  meaning:  surahs/{n}.json  ayah.translations.sahih     (bundled)
  wbw:      wbw/{n}.json     [ayah]                       (bundled — §F)
  tafsir:   tafsir/{n}.json  [ayah] (1–2 line snippet)    (bundled — §F, optional)
  audio:    everyayah.com per-ayah mp3                    (streamed, existing RECITERS)
}
```

The wrapper is a thin adapter that feeds the runner from bundled data. Because the runner already exists and works for any (surah, ayah), "authored vs generated" is invisible to the user — the only difference is the source of the surrounding word-by-word/tafsir panel.

---

## F. Data bundling plan — transliteration + word-by-word for all 6,236 ayahs

### F.1 Source & license

- **Word-by-word (Arabic word, transliteration, English gloss):** quran.com API v4 (`api.quran.com/api/v4/verses/by_key/{s}:{a}?words=true&word_fields=text_uthmani,translation,transliteration`) — the exact endpoint `WordByWordGrid.tsx:40-41` already hits at runtime. The underlying corpus (QuranWBW / corpus.quran.com lineage) is redistributable; we snapshot it at build time and ship it, converting today's online-only crutch into an offline asset.
- **Full-ayah transliteration:** Tanzil transliteration edition (permissive, attribution) as a fallback/whole-ayah string, matching the existing `translations` provenance noted in `quran-metadata.json` ("Al Quran Cloud API").
- Attribution recorded in `docs/AUDIO_SOURCES.md` sibling `docs/TEXT_SOURCES.md`.

### F.2 Build-time script

```
scripts/fetch-wbw.ts   (run once, committed output — mirrors how surahs/*.json were produced)
  for surah in 1..114:
    for ayah in surah:
      GET api.quran.com .../{surah}:{ayah}?words=true&word_fields=text_uthmani,translation,transliteration
      map → { words: [{ arabic, translit, gloss }], translit: <full-ayah Tanzil> }
    write src/data/wbw/{surah}.json          // same per-surah chunking as src/data/surahs/
  throttle + retry; idempotent (skip existing)
```

Output shape per surah file:

```json
{ "surah": 78,
  "ayahs": { "1": { "translit": "ʿamma yatasāʾalūn",
                    "words": [ {"arabic":"عَمَّ","translit":"ʿamma","gloss":"About what"}, ... ] } } }
```

### F.3 Size & loading

- ~6,236 ayahs × ~8 words × (~40 bytes) ≈ **3–5 MB** total across 114 files, gzip ~1.2–1.8 MB. Per-surah files keep any single import small (An-Naba ~6 KB, Al-Baqarah ~250 KB).
- **Lazy load mirroring `quranData.ts:70-83`:**

```ts
// src/lib/wbwData.ts
const cache = new Map<number, WbwSurah>();
export async function getWbw(surah: number) {
  if (cache.has(surah)) return cache.get(surah);
  const mod = await import(`@/data/wbw/${surah}.json`);   // same dynamic-import pattern
  cache.set(surah, mod.default); return mod.default;
}
```

### F.4 Everywhere, default-on for beginners

- `WordByWordGrid.tsx`: replace the `fetch` (`:40`) with `getWbw(surah)` — offline, instant.
- memorize runner, `/practice` review cards, `/mushaf`, and the review flow all render a transliteration line under each ayah via a shared `<Transliteration surah ayah/>` reading `getWbw`.
- Default **ON** when `onboarding.arabicLevel ∈ {'none','beginner'/'letters'}`; a toggle (persisted in `userPreferences.showTransliteration`, already in the schema — `sync/route.ts:110-112` reads it) lets fluent readers turn it off. For non-readers this is the load-bearing crutch that makes memorizing an unfamiliar script possible.

---

## G. Completion math sanity check

Assumptions: effective study **~6 days/week** (built-in slack for misses); "new ayah" is a mufassal-average ayah early, Baqarah-heavy later — the char-budget engine (§B.2) auto-slows on long ayahs, so the *calendar* below is an idealized count-based bound. Manzil = 1/30 rolling khatm of memorized corpus (§B.6); review recited from memory at 10 s/ayah (sabqi 30 s, sabaq 180 s — `memorization-flow.ts:246-248`).

**Years to memorize 6,236 ayahs (count-based, 6 days/wk):**

| New ayahs/day | Ayahs/week | Weeks | **Years** |
|---|---|---|---|
| 3  | 18  | ~346 | **~6.7** |
| 5  | 30  | ~208 | **~4.0** |
| 10 | 60  | ~104 | **~2.0** |

**Daily review burden vs. memorized corpus (does it stay bounded?):**

| Memorized corpus | Manzil/day (=corpus/30) | Manzil time @10 s | Sabqi/day (~7-day new intake) | Sabqi time @30 s | + Sabaq (5 new) @180 s | **Total/day** |
|---|---|---|---|---|---|---|
| 1 juz (~200) | 7 | ~1 min | ~35 | ~18 min | 15 min | **~34 min** |
| 5 juz (~1,040) | 35 | ~6 min | ~35 | ~18 min | 15 min | **~39 min** |
| 15 juz (~3,100) | 104 | ~17 min | ~35 | ~18 min | 15 min | **~50 min** |
| 30 juz (6,236) | 208 | ~35 min | ~0 (done) | 0 | 0 (done) | **~35 min** |

**Conclusion:** the manzil load is **bounded and self-limiting**. It peaks around the 15–20-juz mark (~50 min/day) — precisely when sabqi + sabaq are also active — then *drops* as memorization finishes and only maintenance remains (~35 min/day for a lifelong monthly khatm). The 1/30 divisor is the right parameter: a smaller divisor (e.g. 1/7, the old `MANZIL_DIVISIONS`) would push full-corpus maintenance to ~890 ayahs/day (~2.5 hrs) — untenable. 1/30 keeps a hafiz's daily maintenance under ~35 minutes. The `REVIEW_CAP` (§B.7) guarantees no day ever exceeds the user's chosen time even after a lapse.

---

## H. Execution order (PR-by-PR)

### Minimum Lovable Version (MLV) — a user can go 0 → full Quran end-to-end

| PR | Scope | Est |
|---|---|---|
| **PR-0** | Delete dead code: remove `memorization-flow.ts` + `lessonPlanner.ts` (zero importers — safe). Land `01-STATE-CONSOLIDATION` assumption: `srs` is the sole store. | 0.5 d |
| **PR-1** | `journey/tracks.ts` + `scripts/build-tracks.ts` + generated Mufassal/Sequential/Custom tracks + `ayah-weights.json`. Unit tests: tracks cover exactly 6,236 ayahs; weights present for all. | 2 d |
| **PR-2** | `journey/journeyStore.ts` (localStorage `qo_journey`, cursor, switchTrack, advanceCursor, recomputeCursor) + Prisma `StudyPlan.journeyState` + `/api/user/sync` wiring. | 2 d |
| **PR-3** | `journey/assignment.ts` — `buildDailyAssignment` (§B), char-budget capacity, catch-up caps. Heavily unit-tested (backlog, boundary crossing, length sizing). | 3 d |
| **PR-4** | Dashboard ribbon = today's assignment (§D.1) + `advanceCursor` call at memorize `:610` and practice `:120`. | 1.5 d |
| **PR-5** | End-of-surah advance + `<SegmentMilestone/>` (§D.2, rewrite `goToNextVerse`). | 1.5 d |

**MLV total ≈ 10.5 dev-days.** After PR-5, a beginner completes onboarding → gets a Mufassal plan → memorizes An-Naba ayah by ayah → hits a milestone → auto-advances to the next surah → forever, with bounded daily review.

### Later polish

| PR | Scope | Est |
|---|---|---|
| PR-6 | `scripts/fetch-wbw.ts` + `src/data/wbw/*.json` + `wbwData.ts`; swap `WordByWordGrid` fetch → offline (§F). | 3 d |
| PR-7 | Transliteration everywhere (`<Transliteration/>` in memorize/practice/mushaf/review), default-on for beginners (§F.4). | 2 d |
| PR-8 | Real `<JourneyMap/>` 30-juz grid; delete `JourneyOverview` (§D.3). | 2 d |
| PR-9 | Lesson gates: fix `isLessonUnlocked` (§E.2), wire `canStartSabaq` prereq gate + calibration skip (§E.1). | 1.5 d |
| PR-10 | Custom track editor UI + "easiest-first" ordering; adaptive sabaq sizing tuning (§B.3) with real telemetry. | 2 d |
| PR-11 | Tafsir snippet bundle (`src/data/tafsir/*.json`) for the generated-lesson panel (§E.3). | 2 d |

---

## Appendix — key file references

- `src/lib/spaced-repetition.ts` — `srs`, `getDueAyahs():265`, `categorize():181`, interval cap `:164`, `importFromSync():352`.
- `src/lib/quranData.ts` — dynamic-import loader `:70-83`, `stripMarks():379`.
- `src/lib/memorization-flow.ts` — (to delete) seconds/verse `:246-248`, `MANZIL_DIVISIONS:674`, `DAILY_TARGETS:251`.
- `src/app/memorize/[surah]/[ayah]/page.tsx` — SRS record `:610-611`, `goToNextVerse():709-719`.
- `src/app/practice/page.tsx` — due reads `:94-146`, batch record `:120`.
- `src/app/dashboard/page.tsx` — `lastActiveVerse:135`, ribbon `:281-322`, Up Next `:448-456`.
- `src/app/api/onboarding/route.ts` — `generateStudyPlan:16`, currentSurah `:74-95`.
- `src/app/api/user/sync/route.ts` — verse sync `:161-215`, prefs `:107-112`.
- `src/lib/lesson-content.ts` — `isLessonUnlocked:4693`, `getRecommendedStartLesson:4714`, `Lesson.prerequisites:87`.
- `src/components/JourneyMap.tsx` — decorative `JourneyOverview:18`, reusable `AchievementUnlock:480`.
- `src/components/WordByWordGrid.tsx` — online fetch `:40-41`.
</content>
