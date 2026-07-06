# 01 — State Consolidation Architecture

**Status:** Approved for implementation
**Scope:** localStorage-first client state (Clerk/Turso sync consumes the same stores via existing `exportForSync`/`importFromSync` seams)
**Stack:** Next.js 16, React 19, TypeScript, vitest 4

---

## 0. The problem, verified in code

Every claim below was re-verified against source at design time. Citations are `file:line`.

### 0.1 Three live, mutually-unaware SRS schedulers

| Engine | Key | Algorithm | Live consumers |
|---|---|---|---|
| `src/lib/spaced-repetition.ts` (`srs` singleton) | `qo_srs_state` (`spaced-repetition.ts:84`) | SM-2, graduation 1→3→`interval*ease`, cap 180d (`:154-164`); sabaq ≤3d / sabqi ≤14d / manzil >14d (`:181-185`) | memorize page (`src/app/memorize/[surah]/[ayah]/page.tsx:610-611`), practice hub (`src/app/practice/page.tsx:55,116,170`), review queue (`src/lib/reviewQueue.ts:33-34`), dashboard (`src/lib/dashboardData.ts`) |
| `src/lib/memorizationSystem.ts` (via progressStore) | `quranOasis_progress` (`progressStore.ts:51`) | SM-2 variant with `QURAN_INTERVALS` ladder `[1,2,4,7,14,30,60,120]` (`memorizationSystem.ts:47,98-99`), confidence 0-100 (`:74-83`), ease clamped 1.3–3.0 (`:109`) | `MemorizationPractice.tsx:175` (lessons), progressStore query fns |
| `src/lib/flashcardSystem.ts` | `quranOasis_flashcardProgress` (`flashcardSystem.ts:1468`) | Third SM-2 copy: graduation 1→6, cap 365d, epoch-ms dates (`:1441-1458`) | `src/app/practice/flashcards/page.tsx:25,68` |

Consequence (verified): `MemorizationPractice.tsx:30,175` writes **only** `markVerseMemorized` (progressStore) — lesson-memorized verses never enter the `qo_srs_state` review queue. The memorize page papers over the split by double-writing (`memorize/[surah]/[ayah]/page.tsx:596` progressStore + `:610-611` srs).

Dead schedulers: `src/lib/spacedRepetition.ts` (239 lines, imported only by the repo's **only** test file `src/lib/__tests__/spacedRepetition.test.ts`, 187 lines) and `src/lib/spacedRepetition-manus.ts` (188 lines, zero importers). `src/lib/memorization-flow.ts` (1,280 lines, zero importers) is unwired but contains the traditional hifz session model needed for the Phase-2 journey engine — **preserved, not deleted**.

### 0.2 Two settings stores, one live bug

- `src/lib/settings.ts` — key `hifz-settings` (`settings.ts:43`). Importers: **only** `AudioPlayer.tsx:19-24` and `quranAudioService.ts:23` (relative import `'./settings'`). Playback reads `getSetting('reciter')` at `quranAudioService.ts:284,364`.
- `src/lib/preferencesStore.ts` — key `hifz-preferences` (`preferencesStore.ts:79`). 13 importers, including the settings page.
- **The bug:** `src/app/settings/page.tsx:399` writes `update('audio', { reciter })` → `hifz-preferences`. Playback reads `hifz-settings`. Changing the reciter in Settings does nothing. Only `AudioPlayer.tsx:246`'s own inline picker (`update({ reciter })` → `hifz-settings`) works.

### 0.3 Seven RECITERS definitions, diverging IDs

| # | Definition | Count | Shuraym ID |
|---|---|---|---|
| 1 (canonical) | `quranData.ts:227` | 8 | `shuraym` (`:279`) |
| 2 | `settings.ts:62` | 5 | `shuraim` (`:92`) |
| 3 | `quran.ts:54` | 5 | — |
| 4 | `quranAudioService.ts:39` | 5 | `shuraim` (`:77`) |
| 5 (dead) | `audio-service.ts:85` | 7 | `shuraim` (`:137`) |
| 6 (dead) | `quranAudio.ts:19` (`AUDIO_RECITERS`) | 5 | — (also `abdulbasit` vs canonical `abdul_basit`) |
| 7 (dead) | `arabicAudio.ts:244` (`QURAN_RECITERS`) | 4 | — |

(`preferencesStore.ts:163` re-exports the canonical list; not counted.)

### 0.4 Duplicated preferences and stats

- **Reciter stored in 4 places:** `hifz-preferences` `audio.reciter` (settings page writes), `hifz-settings` `reciter` (playback reads; `settings.ts:16,46`), `quranOasis_progress` `settings.preferredReciter` (`progressStore.ts:37,67`), `hifz-surah-reciters` per-surah map (`settings.ts:214`).
- **Daily goal in 5 client places** (plus a Prisma table in dead `dailyGoals.ts`): `hifz-settings` `dailyGoal` (`settings.ts:29,55`), `hifz-preferences` `learning.dailyGoalMinutes`/`dailyGoalVerses` (`preferencesStore.ts:45-46`), `quranOasis_progress` `settings.dailyGoalMinutes` (`progressStore.ts:38,68`), `quranOasis_motivation` `dailyGoal.{type,target}` (`motivationStore.ts:161-166`) — with mixed units.
- **Three streak engines:** progressStore (`progressStore.ts:382-403`), motivationStore (`motivationStore.ts:267-311`, the richest: freezes, milestones), studyTracker (`studyTracker.ts:118-127`, key `hifz_study_data`). The profile page renders two disagreeing values side by side: `profile/page.tsx:268/277` (progressStore `stats.currentStreak` via `getProgressStats`, set at `:167`) vs `:306-311` (motivationStore `getStreakInfo()`, set at `:174`).

### 0.5 Three recitation engines, three accuracy formulas, three persistence targets

| Engine | Accuracy formula | Persists to |
|---|---|---|
| `LiveRecitation.tsx` | `matched / totalWords` (`LiveRecitation.tsx:671-675`; live variant `matched / processed` at `:247-256`) | `recitation-history` (`:698-701`), read by `src/app/recite/history/page.tsx` |
| `RevealRecitation.tsx` | `(correct + 0.5*partial) / totalWords` (`RevealRecitation.tsx:740-743`) | **nothing** — zero `localStorage.setItem` calls; results discarded after `onComplete` |
| `TajweedPractice.tsx` | averages Claude-analysis accuracy with realtime accuracy (`TajweedPractice.tsx:284-289`); realtime accuracy from `realtimeTajweedService.ts:709-724` | `quran_oasis_practice_sessions` via `savePracticeSession` (`tajweedService.ts:814,819`) |
| memorize page recall | re-implements the Tarteel→WebSpeech provider probe inline (`memorize/[surah]/[ayah]/page.tsx:630-669`) | nothing (feeds SRS quality only) |

Two duplicate `normalizeArabic` implementations exist (`hybridTranscription.ts:423`, `realtimeTajweedService.ts:213`) and three Levenshtein copies (`hybridTranscription.ts`, `realtimeTajweedService.ts`, `tajweedService.ts`).

### 0.6 Key-prefix chaos

Live keys today span four conventions: `quranOasis_*` (progress, motivation, flashcards, session, userName, onboarding…), `hifz-*` (settings, preferences, bookmarks, surah-reciters), `hifz_*` (study_data, early_access, premium_interactions), `qo_*` (srs_state, user_profile, calibration_complete), plus unprefixed `recitation-history`, `quran_oasis_practice_sessions`, `verse_difficulty`, `sheikh_fab_position`. The full inventory is the `clearAllLocalData` list at `preferencesStore.ts:399-437`.

---

## A. Target store architecture

**Design principle: one concept = one owner.** Everything else is a derived view. All keys use the `hifz:` prefix. Every store dispatches a namespaced `CustomEvent` on write so React consumers stay in sync without prop drilling (same pattern already used by `preferences-updated` / `progress-updated`).

### A.1 Final store modules

| Module | Owns | Key | Event | Notes |
|---|---|---|---|---|
| `src/lib/srs.ts` (new; unified engine) | All review scheduling: ayah memorization state **and** vocab flashcard state | `hifz:srs` | `hifz:srs-updated` | Absorbs `spaced-repetition.ts`, the scheduling half of `memorizationSystem.ts`, and the SM-2 half of `flashcardSystem.ts` (§B) |
| `src/lib/preferencesStore.ts` (kept; absorbs `settings.ts`) | Every user preference: audio (incl. reciter + per-surah overrides), display, learning goals config, privacy, AI sheikh | `hifz:preferences` | `hifz:preferences-updated` | Sole owner of reciter and daily-goal *targets* (§A.3) |
| `src/lib/activityStore.ts` (new; the surviving half of `progressStore.ts`) | Append-only daily activity log (`versesMemorized`, `versesReviewed`, `minutesPracticed`, `sessionsCompleted` per local date) + XP/level | `hifz:activity` | `hifz:activity-updated` | Verse scheduling moves to `srs.ts`; streak moves to motivationStore; stats become derived (§A.4) |
| `src/lib/motivationStore.ts` (kept; single streak engine) | Streak (current/longest/freezes), daily-goal *progress today*, achievements, celebrations | `hifz:motivation` | `hifz:motivation-updated` | The only streak in the app (§A.5) |
| `src/lib/recitationStore.ts` (new) | Recitation session history — the one store all recitation UIs write | `hifz:recitation-sessions` | `hifz:recitation-updated` | Shape in §D.3 |
| `src/lib/studyTracker.ts` (kept, shrunk) | Page-visit usage telemetry only | `hifz:study-usage` | none needed | Its private `streakDays` is deleted; `getStudyInsights()` reads streak from motivationStore |
| `src/lib/migrations.ts` (new) | Schema version stamp + all legacy-key migration | `hifz:schema-version` | none | §C |
| `src/lib/arabicText.ts` (new) | `normalizeArabic`, `levenshtein`, `wordAccuracy` — pure functions, no storage | — | — | Extracted from `hybridTranscription.ts:423-460`; the other copies delegate to it |

`quranData.ts:227` remains the **only** `RECITERS` definition. `quranAudioService.ts:39` and `quran.ts:54` drop their local copies and import it; the canonical IDs win (`shuraym`, `abdul_basit`). The migration normalizes stored legacy IDs (`shuraim`→`shuraym`, `abdulbasit`→`abdul_basit`, `minshawi` → nearest canonical or default `alafasy` since the canonical list has no Minshawi entry).

Untouched small keys are renamed but not restructured: `hifz-bookmarks`→`hifz:bookmarks`, `quranOasis_userName`→`hifz:user-name`, `quranOasis_onboarding`/`quranOasis_onboardingComplete`→`hifz:onboarding`, `qo_user_profile`→`hifz:user-profile`, `qo_calibration_complete`→`hifz:calibration-complete`, `hifz_early_access`→`hifz:early-access`, `hifz_premium_interactions`→`hifz:premium-interactions`, `sheikh_fab_position`→`hifz:sheikh-fab-position`, `quranOasis_completedLessons`→`hifz:completed-lessons`, `quranOasis_currentSession`→`hifz:current-session`.

### A.2 Unified SRS store interface (summary; full spec §B)

```ts
// src/lib/srs.ts
export type ItemType = 'ayah' | 'vocab';
export type ReviewQuality = 'again' | 'hard' | 'good' | 'easy';   // unchanged from spaced-repetition.ts:25
export type HifzCategory = 'sabaq' | 'sabqi' | 'manzil';

export interface SRSItemState {
  /** 'ayah:2:255' | 'vocab:letter-alif' */
  id: string;
  type: ItemType;
  // ayah items only
  surahNumber?: number;
  ayahNumber?: number;
  // vocab items only
  cardId?: string;
  // shared SM-2 state (superset of AyahSRSState, spaced-repetition.ts:28-49)
  easeFactor: number;        // 1.3–3.0
  interval: number;          // days
  repetitions: number;
  nextReviewDate: string;    // local YYYY-MM-DD (vocab converted from epoch ms on migration)
  lastReviewDate: string | null;
  addedDate: string;
  lastAccuracy: number;      // 0–1
  totalReviews: number;
  correctCount: number;      // absorbed from FlashcardProgress (flashcardSystem.ts:29)
}
```

### A.3 Unified preferences (absorbs `settings.ts`)

`UserPreferences` (`preferencesStore.ts:64-73`) is already the richer shape; it gains the two things only `settings.ts` had:

```ts
export interface AudioPreferences {
  reciter: string;                       // SOLE owner of reciter preference
  surahReciters: Record<string, string>; // absorbs hifz-surah-reciters (settings.ts:214)
  playbackSpeed: PlaybackSpeed;
  autoPlayOnLesson: boolean;
  volume: number;
  audioQuality: AudioQuality;
  crossfadeEnabled: boolean;
  crossfadeDuration: number;
  autoPreload: boolean;
  gaplessPlayback: boolean;
}
export function getEffectiveReciter(surah?: number): string;  // moves here from settings.ts:265
```

**Bug fix falls out structurally:** `quranAudioService.ts:284,364` change from `getSetting('reciter')` to `getPreference('audio', 'reciter')` (or `getEffectiveReciter(surah)`), and `AudioPlayer.tsx` swaps `useSettings()` for `useAudioPreferences()` (`preferencesStore.ts:526`). The settings page already writes the right store; now playback reads it. `settings.ts` is then deleted — its remaining exports (`DAILY_GOAL_OPTIONS`, `AUDIO_QUALITY_OPTIONS`, `PLAYBACK_SPEED_OPTIONS`, `TRANSLATIONS`) already exist in preferencesStore.

Daily goal: the *target* lives only in `learning.dailyGoalMinutes` / `learning.dailyGoalVerses` (`hifz:preferences`). motivationStore's `dailyGoal.target`/`type` fields are dropped; it keeps only `todayProgress`/`todayDate` and reads the target from preferences. `progressStore.settings` (reciter + goal duplicates, `progressStore.ts:36-41,66-71`) is deleted entirely.

### A.4 Progress/stats: derived, not stored

`activityStore.ts` keeps the two things that are genuinely primary data: the daily activity log (`progressStore.ts:20-26` shape, unchanged) and XP/level. Everything else the profile/dashboard shows becomes a pure function over the two primary stores:

```ts
// src/lib/derivedStats.ts (pure; no localStorage key of its own)
export function getMemorizedVerseCount(): number;        // from srs: ayah items with totalReviews > 0
export function getSurahProgress(surah: number): {...};  // from srs ayah items + SURAH_METADATA
export function getSurahProgressList(): SurahProgressItem[];
export function getJuzProgress(): JuzProgress[];         // motivationStore.ts:514-565 logic, reading srs instead of quranOasis_progress
export function getQuranProgress(): {...};
export function getProfileStats(): {...};                // replaces progressStore.getProgressStats (progressStore.ts:587)
```

This removes motivationStore's three raw `localStorage.getItem('quranOasis_progress')` reads (`motivationStore.ts:488,520,573`) — a hidden cross-store coupling that breaks the moment the key is renamed.

### A.5 Streak: single engine in motivationStore

motivationStore's engine wins — it is the only one with freezes, milestones, and gap tolerance (`motivationStore.ts:267-311`). The merge:

1. **Delete** `progressStore.ts:382-403` (`updateStreak`) and the `streak` field of `UserProgress`; delete `studyTracker.ts:118-127` streak fields.
2. **Migration merges the three stored values** (§C): `current = max` of the three (they measure the same behavioral concept; user-visible number must not go down), `longest = max`, `lastActiveDate = most recent`; freezes kept from motivationStore.
3. All activity funnels through one call: `recordActivity({ versesMemorized?, versesReviewed?, minutesPracticed? })` in activityStore appends to the daily log **and** calls `motivationStore.updateStreak()` + `updateDailyProgress()`. `markVerseMemorized` already did this (`progressStore.ts:256-261`); now it is the only path.
4. Profile page renders **one** streak: `getStreakInfo()` everywhere (`profile/page.tsx:268` badge switches to the same source as `:306`).

---

## B. Unified SRS engine spec

### B.1 One scheduler, per-type config

The three legacy formulas differ only in graduation steps, interval ladder, and cap. One `schedule()` with a per-type config table preserves each behavior where it matters:

```ts
interface SchedulerConfig {
  graduation: [number, number];   // interval for repetitions 1 and 2
  ladder?: number[];              // optional fixed early intervals (traditional hifz)
  maxIntervalDays: number;
  minEase: number;                // 1.3
  maxEase: number;                // 3.0 (memorizationSystem.ts:109 — adopted globally; unbounded ease was a latent bug in the other two)
}

const CONFIGS: Record<ItemType, SchedulerConfig> = {
  ayah:  { graduation: [1, 3], ladder: [1, 2, 4, 7, 14, 30, 60, 120], maxIntervalDays: 180, minEase: 1.3, maxEase: 3.0 },
  vocab: { graduation: [1, 6],                                        maxIntervalDays: 365, minEase: 1.3, maxEase: 3.0 },
};
```

- **Ayah items** adopt the `QURAN_INTERVALS` ladder from `memorizationSystem.ts:47,98-99` — the traditional-hifz pacing is the point of the app; pure SM-2 growth (`interval*ease`) takes over only after the ladder is exhausted (repetitions ≥ 8). Cap 180d (`spaced-repetition.ts:164`).
- **Vocab items** keep flashcard behavior exactly (`flashcardSystem.ts:1444-1451`): 1 → 6 → `interval*ease`, cap 365d.
- **Quality:** the public type stays `ReviewQuality` (`'again'|'hard'|'good'|'easy'`) with the existing map `{again:0, hard:3, good:4, easy:5}` (`spaced-repetition.ts:75-80`). Numeric `0–5` is also accepted (the flashcards page passes numbers today) and clamped into the same SM-2 ease update `ease + (0.1 − (5−q)(0.08 + (5−q)·0.02))`. `q < 3` resets `repetitions = 0, interval = 1`.
- **Dates:** local-calendar `YYYY-MM-DD` via the existing `localDateKey` (`spaced-repetition.ts:114-119`) for both types. (Flashcards' epoch-ms `nextReview` is converted on migration; day-granularity is correct for both.)
- **Confidence** (memorizationSystem's stored 0-100 field) becomes derived, for UI compatibility: `confidence(s) = Math.min(100, Math.round(40·min(1,reps/5) + 40·s.lastAccuracy + 20·min(1, s.interval/30)))`. No stored field.

### B.2 Category model (ayah only)

Categories are **derived from interval**, exactly as `spaced-repetition.ts:181-185` (interval-based beats memorizationSystem's date-since-first-memorized model because a failed manzil verse correctly falls back to sabaq):

- `sabaq` — interval ≤ 3 days (new lesson, reviewed daily)
- `sabqi` — 3 < interval ≤ 14 days (recent)
- `manzil` — interval > 14 days (long-term)

Transitions are implicit: success walks a verse up the ladder into sabqi then manzil; any `again` resets interval to 1 → back to sabaq. `getDueItems` never mixes types, so **vocab cards cannot pollute ayah review queues**: the ayah UIs call `getDueAyahs()` (type-filtered to `'ayah'`, categorized) and the flashcards page calls `getDueCards(deckId?)` (type-filtered to `'vocab'`, joined to `FLASHCARD_DECKS` for card content — deck definitions stay in `flashcardSystem.ts`, which shrinks to pure content data).

### B.3 Public API

Drop-in compatible with every verified call site (`practice/page.tsx:55-170`, `memorize/[surah]/[ayah]/page.tsx:610-611`, `reviewQueue.ts:33-34`, `flashcards/page.tsx:68`):

```ts
class SRSEngine {
  reload(): void;                                                   // after profile sync (practice/page.tsx:94)
  // ayah API (signature-compatible with spaced-repetition.ts)
  addAyah(surah: number, ayah: number): void;
  addAyahs(surah: number, start: number, end: number): void;
  removeAyahs(surah: number, start: number, end: number): void;
  recordReview(surah: number, ayah: number, q: ReviewQuality | number): SRSItemState;
  getDueAyahs(): { sabaq: SRSItemState[]; sabqi: SRSItemState[]; manzil: SRSItemState[] };
  getDueCount(): { sabaq: number; sabqi: number; manzil: number; total: number };
  getAyahState(surah: number, ayah: number): SRSItemState | undefined;
  getAllAyahs(): SRSItemState[];
  // vocab API (replaces flashcardSystem storage fns)
  recordCardReview(cardId: string, q: ReviewQuality | number): SRSItemState;
  getDueCardIds(): Set<string>;                                     // flashcards page filters decks against this
  getCardState(cardId: string): SRSItemState | undefined;
  // generic
  getItemState(id: string): SRSItemState | undefined;
  getDueItems(type?: ItemType): SRSItemState[];
  getStats(): SRSStats;                                             // NO streak field — streak belongs to motivationStore
  exportForSync(): SRSItemState[];
  importFromSync(items: SRSItemState[]): void;                      // keep more-recent lastReviewDate, as today (spaced-repetition.ts:352-361)
  reset(): void;
}
export const srs: SRSEngine;   // singleton, same import shape as today
```

Every mutation saves and dispatches `hifz:srs-updated`.

### B.4 Migration from the 3 legacy stores (detail in §C)

Read order: `qo_srs_state` (canonical) → `quranOasis_progress.verses` → `quranOasis_flashcardProgress`.

- `qo_srs_state` entries map 1:1 (`key "2:255"` → `id "ayah:2:255"`, `correctCount` seeded as `round(totalReviews * lastAccuracy)`).
- `quranOasis_progress.verses` (`VerseProgress`, `memorizationSystem.ts:19-31`): `surah/ayah` → id; `lastReview`/`nextReview` Date-ISO strings → local `YYYY-MM-DD`; `confidence`/`status`/`category` dropped (derived); ease clamped to [1.3, 3.0].
- `quranOasis_flashcardProgress` (`FlashcardProgress`, `flashcardSystem.ts:21-30`): `cardId` → `id "vocab:"+cardId`; epoch-ms `nextReview`/`lastReview` → local date strings; `correctCount` carried over.
- **Conflict resolution when the same ayah exists in both verse stores: keep the record with the higher `totalReviews`** (more history = more schedule information). Tie → keep the `qo_srs_state` record. Never sum fields across records.

---

## C. Migration module design

### C.1 `src/lib/migrations.ts` — run-once-per-version

```ts
const VERSION_KEY = 'hifz:schema-version';
const CURRENT_SCHEMA_VERSION = 2;   // v0/absent = legacy keys; v1 = the quran-oasis-* rename preferencesStore.ts:223 already did

export function runMigrations(): void {
  if (typeof window === 'undefined') return;
  const v = Number(localStorage.getItem(VERSION_KEY) ?? '0');
  if (v >= CURRENT_SCHEMA_VERSION) return;
  try {
    if (v < 2) migrateToV2();
    localStorage.setItem(VERSION_KEY, String(CURRENT_SCHEMA_VERSION));
  } catch (e) {
    console.error('[migrations] failed; will retry next load', e);
    // version stamp NOT written → retried next load; steps are individually idempotent
  }
}
```

Called from one place: a `useEffect`-free inline call at the top of the existing client bootstrap (the root providers component in `src/app/layout.tsx`'s client shell), **before** any store's first read. Store modules also defensively call `runMigrations()` at the top of their `load*()` functions (cheap: one `getItem` when already stamped) so a store imported by an isolated page can't race it. The existing ad-hoc migration `migrateStorageKeys()` (`preferencesStore.ts:223-240`) is deleted; its four renames move into the v2 table below.

**Idempotency rules:** every step is (a) read legacy → (b) merge/write new **only if new key absent or merging is order-independent** → (c) `removeItem(legacy)`. Because legacy keys are removed on success, a re-run after partial failure only replays the steps whose legacy keys still exist. Malformed JSON in any legacy key is caught per-key and the key is discarded (same policy as every current store's `catch { return default }`).

### C.2 Key-by-key migration table (old → new)

| Legacy key | → New key | Transform |
|---|---|---|
| `qo_srs_state` | `hifz:srs` | §B.4 mapping; merge |
| `quranOasis_progress` `.verses` | `hifz:srs` | §B.4 mapping; conflict = keep higher `totalReviews` |
| `quranOasis_flashcardProgress` | `hifz:srs` | §B.4 mapping (`vocab:` ids, ms→date) |
| `quranOasis_progress` `.dailyActivity`, `.totalXP`, `.level` | `hifz:activity` | verbatim |
| `quranOasis_progress` `.streak` | `hifz:motivation` `.streak` | 3-way max-merge (§A.5) |
| `quranOasis_progress` `.settings.preferredReciter` | — | dropped (preferences own reciter) |
| `quranOasis_progress` `.settings.dailyGoalMinutes` | `hifz:preferences` `.learning.dailyGoalMinutes` | only if preferences has no explicit value |
| `quranOasis_motivation` | `hifz:motivation` | rename; drop `dailyGoal.type/target` (move target into preferences if user-set ≠ default); streak max-merged |
| `hifz_study_data` `.streakDays/.lastStreakDate` | `hifz:motivation` `.streak` | included in 3-way max-merge |
| `hifz_study_data` (rest) | `hifz:study-usage` | verbatim |
| `hifz-settings` | `hifz:preferences` | field map: `reciter`→`audio.reciter` (**only if** the preferences value is still the default `'alafasy'` and settings differs — playback obeyed hifz-settings, so it is the user's real intent), `playbackSpeed/audioQuality/crossfade*/autoPreload`→`audio.*`, `translation/showTranslation/arabicFontSize`→`display.*` (px→nearest `FontSize`), `dailyGoal`→`learning.dailyGoalVerses`, `reminderEnabled/reminderTime`→`learning.*`, `theme`→`display.theme` |
| `hifz-surah-reciters` | `hifz:preferences` `.audio.surahReciters` | verbatim map; normalize IDs |
| `hifz-preferences` | `hifz:preferences` | rename + reciter-ID normalization (`shuraim`→`shuraym`, `abdulbasit`→`abdul_basit`, `minshawi`→`alafasy`) |
| `recitation-history` | `hifz:recitation-sessions` | wrap each record as `mode:'live'` session (§D.3) |
| `quran_oasis_practice_sessions` | `hifz:recitation-sessions` | map `PracticeSession` (`tajweedService.ts:75-82`) → session with `mode:'tajweed'`, `tajweedFeedback` |
| `quranOasis_currentSession` | `hifz:current-session` | rename |
| `hifz-bookmarks` | `hifz:bookmarks` | rename |
| `quranOasis_userName` | `hifz:user-name` | rename |
| `quranOasis_onboarding`, `quranOasis_onboardingComplete` | `hifz:onboarding` | merge into one object |
| `quranOasis_completedLessons` | `hifz:completed-lessons` | rename |
| `qo_user_profile` | `hifz:user-profile` | rename |
| `qo_calibration_complete` | `hifz:calibration-complete` | rename |
| `hifz_early_access` | `hifz:early-access` | rename |
| `hifz_premium_interactions` | `hifz:premium-interactions` | rename |
| `sheikh_fab_position` | `hifz:sheikh-fab-position` | rename |
| `verse_difficulty` | — | delete (nothing ever wrote it — see `reviewQueue.ts:26-28` comment) |
| `qo_srs_stats` (`spaced-repetition.ts:85`, never written) | — | delete |
| `quran-oasis-preferences/-settings/-bookmarks/-surah-reciters` (pre-v1 relics) | — | run the old v1 rename first, then v2 |

### C.3 `clearAllLocalData` afterwards

Rewritten (currently `preferencesStore.ts:399-437`) and moved into `migrations.ts` next to the key registry so the two lists cannot drift:

```ts
export const ALL_APP_KEYS = [...NEW_KEYS, ...ALL_LEGACY_KEYS, VERSION_KEY];
export function clearAllLocalData(): void { /* remove all ALL_APP_KEYS; dispatch the three *-updated events */ }
```

Clearing also removes the version stamp so a fresh session starts clean at v2 (migrations find nothing to migrate — a no-op by construction).

---

## D. Unified recitation engine

### D.1 `useRecitationSession` hook

One hook replaces the four inline implementations. Location: `src/hooks/useRecitationSession.ts`.

```ts
export type RecitationProvider = 'tarteel' | 'webspeech' | 'manual';
export type RecitationMode = 'live' | 'reveal' | 'tajweed' | 'memorize-recall';

interface UseRecitationSessionOptions {
  surah: number;
  ayahStart: number;
  ayahEnd?: number;
  expectedText: string;           // display text, pre-cleaned (cleanAyahText)
  mode: RecitationMode;
  onWordEvent?: (e: WordEvent) => void;   // word matched/partial/missed — drives Live/Reveal word UIs
  persist?: boolean;              // default true; memorize-recall may opt out of history
}

export function useRecitationSession(opts: UseRecitationSessionOptions): {
  provider: RecitationProvider | null;    // resolved async on mount
  isRecording: boolean;
  start(): Promise<void>;
  stop(): Promise<RecitationResult>;      // computes accuracy, persists, returns
  gradeManually(quality: ReviewQuality): RecitationResult;  // manual fallback path
};
```

**Provider chain** (extracted verbatim from `memorize/[surah]/[ayah]/page.tsx:635-668`, which is the most complete implementation):

1. **Tarteel** — `GET /api/tarteel` with 3s timeout; if `res.ok && data.configured === true` → `new TarteelService({expectedText, chunkIntervalMs: 3000, onStateChange})` (`src/lib/tarteelService.ts`). The configured-check result is cached module-level for 5 minutes so Live/Reveal/Tajweed don't each re-probe.
2. **WebSpeech** — `WebSpeechService.isSupported()` → `new WebSpeechService({expectedText, onStateChange})` (`src/lib/webSpeechService.ts:39`).
3. **Manual** — no mic pipeline; the UI shows self-grade buttons (`again/hard/good/easy`) and `gradeManually()` produces a result with `accuracy` mapped `{easy:100, good:80, hard:55, again:25}` and `provider:'manual'`.

### D.2 The ONE accuracy formula

Word-level alignment on normalized Arabic, in `src/lib/arabicText.ts` (pure, unit-testable):

```ts
/** hybridTranscription.ts:423-438, extracted verbatim:
 *  strip tashkeel U+064B–065F,U+0670; unify alef forms U+0622/0623/0625→U+0627;
 *  taa marbuta→haa; alef maksura→yaa; strip tatweel; collapse whitespace. */
export function normalizeArabic(text: string): string;

/** Char-level Levenshtein similarity 0–1 on normalized words
 *  (= hybridTranscription.ts calculateArabicSimilarity / 100). */
export function wordSimilarity(a: string, b: string): number;

export interface WordAccuracyResult {
  accuracy: number;   // 0–100
  total: number; matched: number; partial: number; missed: number; extra: number;
  perWord: ('matched' | 'partial' | 'missed')[];   // aligned to expected tokens — drives word-reveal UIs
}

export function computeWordAccuracy(expected: string, transcript: string): WordAccuracyResult;
```

`computeWordAccuracy` spec:

1. `normalizeArabic` both strings; tokenize on whitespace.
2. Dynamic-programming alignment over **word tokens** (word-level Levenshtein): insertion/deletion cost 1; substitution cost `0` when `wordSimilarity ≥ 0.8` (**matched**), `0.5` when `≥ 0.5` (**partial**), else `1` (**missed**, transcript word counted as `extra` substitution).
3. `accuracy = round(100 · (matched + 0.5·partial) / expectedTokens.length)`; `0` expected tokens → `0`.

This generalizes all three legacy formulas: RevealRecitation's `(correct + 0.5·partial)/total` (`RevealRecitation.tsx:743`) is the same shape; LiveRecitation's `matched/total` (`LiveRecitation.tsx:671-675`) is the degenerate case with no partial credit; the realtime word matcher's per-word 0.3 threshold (`realtimeTajweedService.ts:609-614`) is replaced by the calibrated 0.8/0.5 bands. The 0.8/0.5 thresholds are constants in `arabicText.ts` covered by the accuracy test suite (§E.2).

### D.3 One session persistence shape

```ts
// src/lib/recitationStore.ts — key 'hifz:recitation-sessions', event 'hifz:recitation-updated'
export interface RecitationSessionRecord {
  id: string;                       // crypto.randomUUID()
  surah: number;
  ayahStart: number;
  ayahEnd: number;
  mode: RecitationMode;
  provider: RecitationProvider;
  accuracy: number;                 // 0–100, from computeWordAccuracy
  words: { total: number; matched: number; partial: number; missed: number };
  durationSec: number;
  tajweedFeedback?: TajweedFeedback;   // tajweed mode only (tajweedService.ts type)
  createdAt: string;                // ISO
}
export function saveSession(r: Omit<RecitationSessionRecord, 'id' | 'createdAt'>): void;  // unshift, cap 200
export function getSessions(filter?: { mode?: RecitationMode; surah?: number }): RecitationSessionRecord[];
```

### D.4 Consumer adoption

| Consumer | Change |
|---|---|
| `LiveRecitation.tsx` | Drops its stats/persistence block (`:660-704`); word states still driven live via `onWordEvent`; `stop()` persists `mode:'live'`. `src/app/recite/history/page.tsx` reads `getSessions({mode:'live'})` (plus migrated legacy records). |
| `RevealRecitation.tsx` | `finishSession` (`:730-756`) delegates scoring to `computeWordAccuracy` and **gains persistence** (`mode:'reveal'`) — fixing the discard bug. |
| `TajweedPractice.tsx` | Keeps its Claude analysis; replaces `savePracticeSession` (`:296,337`) with `saveSession({mode:'tajweed', tajweedFeedback, ...})`. Its accuracy field = `computeWordAccuracy` result; Claude analysis stays advisory inside `tajweedFeedback` (no more averaging two formulas at `:284-289`). `tajweedService.ts:814-910` storage fns are deleted; its history readers switch to recitationStore. |
| Memorize page recall | `startRecallRecording`/`stopRecallRecording` (`memorize/[surah]/[ayah]/page.tsx:629-680`) replaced by the hook (`mode:'memorize-recall'`); the returned accuracy feeds the existing quality mapping (`:604-609`) which then makes the **single** `srs.recordReview` call — the progressStore double-write at `:596` is replaced by `activityStore.recordActivity(...)`. |

---

## E. Deletion manifest & test plan

### E.1 Deletion manifest (verified zero importers unless noted)

All verdicts confirmed by import-scan; line counts from `wc -l`. Ordered so nothing breaks: each phase's deletions have no remaining importers when that phase lands.

**Phase E-1 — dead already (deletable in one PR today, ~3,900 lines):**

| File | Lines | Note |
|---|---|---|
| `src/lib/spacedRepetition-manus.ts` | 188 | zero importers |
| `src/lib/audio-service.ts` | 634 | zero importers (do **not** confuse with live `audioService.ts`) |
| `src/lib/quranAudio.ts` | 101 | zero importers |
| `src/lib/arabicAudio.ts` | 410 | zero importers |
| `src/lib/practice-drills.ts` | 695 | zero importers |
| `src/lib/dailyGoals.ts` | 87 | zero importers (Prisma daily-goal remnant) |
| `src/components/KanbanBoard.tsx` | 294 | zero importers |
| 18 further zero-import components | ~3,065 total | `LazyMotion` 69, `ui/LiquidGlassNav` 176, `DashboardGreeting` 169, `ErrorFallback` 206, `TajweedHighlighter` 216, `AnimatedBackground` 288, `ShareProgress` 130, `DailyGoalCard` 220, `FeedbackOverlay` 33, `WordByWordGrid` 208, `EmptyState` 307, `StaggerList` 49, `ArabicText` 79, `TajweedReport` 403, `AnimatedNumber` 28, `TajweedSheikhFeedback` 276, `SheikhErrorBoundary` 141, `MarkdownContent` 67 |

**Phase E-2 — orphan routes & API routes (one PR):**

- Pages: `src/app/browse` (only reference is a nav-highlight path array `BottomNav.tsx:102`, no link — remove the array entry too), `src/app/sheikh`, `src/app/brand`, `src/app/onboarding/welcome`, `src/app/onboarding/calibration`, `src/app/onboarding/complete`. (`/memorize-index` does not exist — audit item closed.)
- API routes (6, no in-repo caller): `api/recitation/route.ts`, `api/goals/daily/route.ts`, `api/progress/weekly/route.ts`, `api/email/weekly-progress/route.ts`, `api/push/send/route.ts`, `api/difficulty/update/route.ts`. **Caveat:** confirm no external scheduler hits `email/weekly-progress` and `push/send` before deleting (note `api/tarteel/keep-warm` is NOT orphaned — wired as a Vercel cron in `vercel.json`). Trim the corresponding `middleware.ts` matchers.

**Phase E-3 — deletable only after the unified engine lands:**

| File | Lines | Unblocked by |
|---|---|---|
| `src/lib/spacedRepetition.ts` | 239 | new SRS test suite replaces its only consumer (the test) |
| `src/lib/__tests__/spacedRepetition.test.ts` | 187 | **deleted last**, after new suites are green (§E.2) |
| `src/lib/settings.ts` | 271 | preferences absorption (PR 3) |
| `src/lib/memorizationSystem.ts` | 362 | unified SRS (PR 4/5); UI helpers (`formatNextReview`, colors) move to a small `src/lib/srsUi.ts` |
| `src/lib/spaced-repetition.ts` | 395 | superseded by `src/lib/srs.ts` (PR 4) |
| `flashcardSystem.ts` SM-2/storage half (~170 of 1,581) | | unified SRS; deck/content data stays |
| `progressStore.ts` scheduling/streak/settings (~300 of 689) | | activityStore + motivationStore + derivedStats |
| `tajweedService.ts` session storage (~100) | | recitationStore |
| duplicate `normalizeArabic`/Levenshtein in `realtimeTajweedService.ts`, `hybridTranscription.ts`, `tajweedService.ts` | ~120 | `arabicText.ts` |

**Preserved:** `src/lib/memorization-flow.ts` (1,280 lines, zero importers) — contains the traditional hifz session model absorbed by the Phase-2 journey engine. Add a file-header comment marking it as such so nobody "cleans it up".

Total deletion: **~6,500 lines**, matching the audit estimate.

### E.2 Test plan — new suites BEFORE deleting the old test

vitest is already configured (`package.json:12-13`, `vitest.config.ts`). The only existing test file covers a dead module; it is deleted **last**. New suites, written against the spec above and landed with their implementation PRs:

1. `src/lib/__tests__/srs.test.ts` — SM-2 math per type (graduation, ladder walk-up for ayah, failure reset, ease clamp 1.3–3.0, interval caps); category derivation and sabaq→sabqi→manzil→sabaq transitions; due-query type isolation (a due vocab card never appears in `getDueAyahs`); `importFromSync` recency rule; port the still-relevant cases from the 26 old tests (interval progression, quality mapping) so no behavioral coverage is lost.
2. `src/lib/__tests__/migrations.test.ts` — seeded-localStorage fixtures for: 3-way SRS merge with `totalReviews` conflict rule; `hifz-settings`→preferences field map incl. the reciter-intent rule; reciter-ID normalization; streak 3-way max-merge; idempotency (run twice = run once); partial-failure retry (one malformed key doesn't block the rest); version stamp; `clearAllLocalData` removes every key in `ALL_APP_KEYS`.
3. `src/lib/__tests__/streak.test.ts` — motivationStore engine: consecutive day, same-day no-op, freeze consumption on 1-day gap (`motivationStore.ts:289-298`), break/reset, milestone unlocks incl. jump-past (`:254-264`), local-midnight date keys.
4. `src/lib/__tests__/arabicText.test.ts` — `normalizeArabic` (tashkeel/alef/taa-marbuta/maksura/tatweel cases); `computeWordAccuracy`: perfect match = 100, empty transcript = 0, partial band, word skip, extra words, real ayah fixtures (Fatiha with/without diacritics, common WebSpeech mis-transcriptions).
5. `src/lib/__tests__/recitationStore.test.ts` — save/cap-200/filter; legacy `recitation-history` and `quran_oasis_practice_sessions` record migration shapes.

Delete `src/lib/__tests__/spacedRepetition.test.ts` + `src/lib/spacedRepetition.ts` only when suites 1–2 are green in CI.

---

## F. Execution order — PR-by-PR

Each PR is independently shippable; nothing user-visible breaks mid-sequence because legacy stores keep working until their consumers are switched, and migrations only fire when the new store ships.

| # | PR | Contents | Effort |
|---|---|---|---|
| 1 | **Dead-code sweep** | Phase E-1 + E-2 deletions (verify importers in CI via `tsc`/build; external-cron caveat for 2 API routes). No behavior change. | 0.5–1 d |
| 2 | **`arabicText.ts` + accuracy suite** | Extract `normalizeArabic`/Levenshtein/`computeWordAccuracy`; point `hybridTranscription.ts`/`realtimeTajweedService.ts`/`tajweedService.ts` at it; land `arabicText.test.ts`. Pure refactor. | 1 d |
| 3 | **Preferences unification (fixes the reciter bug)** | Add `audio.surahReciters` + `getEffectiveReciter` to preferencesStore; switch `quranAudioService.ts:284,364` and `AudioPlayer.tsx` to preferences; migrate `hifz-settings`/`hifz-surah-reciters` inline (interim, folded into `migrations.ts` in PR 6); delete `settings.ts`; canonical-RECITERS dedupe in `quranAudioService.ts:39` + `quran.ts:54`; ID normalization. **User-visible fix: Settings reciter now affects playback.** | 1–1.5 d |
| 4 | **Unified SRS engine + suite** | New `src/lib/srs.ts` with compat API (§B.3); reads `hifz:srs` with lazy import of `qo_srs_state` if unmigrated; switch the 4 `srs` consumers (import path only — API compatible); land `srs.test.ts`. | 2 d |
| 5 | **SRS absorption of lessons + flashcards** | `MemorizationPractice.tsx:175` gains `srs.recordReview` via a single `completeMemorization(surah, ayah, quality)` facade (fixes lesson-verses-never-reviewed); flashcards page switches to `recordCardReview`/`getDueCardIds`; strip SM-2/storage from `flashcardSystem.ts`; memorize page double-write (`:596-611`) collapses to facade + srs. | 1.5 d |
| 6 | **`migrations.ts` + key standardization + suite** | Full §C table incl. 3-store SRS merge and streak max-merge; version stamp; bootstrap call; rewritten `clearAllLocalData` over `ALL_APP_KEYS`; land `migrations.test.ts`. | 1.5–2 d |
| 7 | **Streak/goal single ownership** | motivationStore as sole streak engine (+ `streak.test.ts`); `activityStore.ts` extracted (activity log + XP); `derivedStats.ts` replaces stored stats; progressStore reduced then deleted; profile page single streak; daily-goal target reads from preferences; studyTracker streak removed. | 2 d |
| 8 | **`recitationStore` + `useRecitationSession`** | Store + hook + provider chain (§D); memorize page recall switches first (it already has the reference implementation); land `recitationStore.test.ts`. | 1.5 d |
| 9 | **Recitation UI adoption** | LiveRecitation, RevealRecitation (gains persistence), TajweedPractice switch to the hook + one formula; history page reads recitationStore; delete `tajweedService.ts` storage fns. | 1.5–2 d |
| 10 | **Legacy scheduler deletion** | Delete `spaced-repetition.ts`, `memorizationSystem.ts` (helpers → `srsUi.ts`), `spacedRepetition.ts` + its old test (suites 1–2 green as precondition). | 0.5 d |

**Total: ~13–15 dev-days.** Dependency edges: 2→9, 3→6, 4→5→6(SRS merge)→7, 8→9, {4,6}→10. PRs 1–3 can land in any order relative to each other.

**Rollback posture:** every PR before 6 leaves legacy keys in place (dual-read, no destructive writes). PR 6 is the point of no return per user (legacy keys removed after merge); its test suite and per-key idempotency are the safety net, and `exportForSync` snapshots to Clerk metadata provide an extra recovery path for signed-in users.
