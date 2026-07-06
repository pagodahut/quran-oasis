# HIFZ Rebuild Roadmap

**Goal:** a non-native Arabic reader can go from zero — unable to read the script — to memorizing the entire Qur'an (114 surahs, 6,236 ayahs), guided every day, never hitting a dead end.

This roadmap sequences the four implementation specs in `docs/design/`:

| Doc | Scope | Estimate |
|-----|-------|----------|
| [01-STATE-CONSOLIDATION](./01-STATE-CONSOLIDATION.md) | One SRS engine, one settings store, one reciter table, one recitation engine, migrations, dead-code deletion | ~13–15 dev-days (10 PRs) |
| [02-JOURNEY-ENGINE](./02-JOURNEY-ENGINE.md) | Tracks, daily sabaq/sabqi/manzil assignments, journey cursor, end-of-surah advance, WBW/transliteration bundling | MLV ~10.5 dev-days |
| [03-DESIGN-SYSTEM](./03-DESIGN-SYSTEM.md) | One token system, Arabic type scale, component primitives, memorize-screen redesign, CSS cleanup | 1 PR per page |
| [04-INTEGRATIONS](./04-INTEGRATIONS.md) | Recitation provider chain + circuit breaker, audio CDN fallback, optionalAuth, BYOK everywhere, env/health, Prisma fix, SW v2 | ~10 dev-days (9 PRs) |

## Dependency graph

```
04 §C optionalAuth ──────────────┐
04 §F Prisma fix ────────────────┤  independent, ship first
04 §E env.ts + /api/health ──────┘

01 PR1–5 (dual-read stores) ──► 01 PR6 (migrations, point of no return)
                                   │
01 unified srs ────────────────────┼──► 02 journey engine (cursor layers on srs)
01 useRecitationSession ◄── 04 §A provider-chain semantics (implement together)
02 WBW bundling ───────────────────────► 04 §G service-worker matrix (post-bundling)
02 journey changes to memorize page ───► 03 memorize-page migration (same file; journey first)
01 deletion manifest ── memorization-flow.ts deleted ONLY after 02 absorbs it
```

## Execution waves

### Wave 0 — Stop the bleeding (ship this week, all independent)
User-visible bugs and silent failures. No architectural risk.

1. **Tarteel honesty** (04 §A): health check requires 2xx + JSON shape; 3-failure circuit breaker in `TarteelService` → hot-swap to WebSpeech with a toast. Replace daily keep-warm cron with on-demand warmup when `/recite` mounts.
2. **Reciter split-brain** (01 PR3): playback reads `preferencesStore`; changing reciter in Settings works again.
3. **Lesson verses enter review** (01): `MemorizationPractice` writes SRS via the `completeMemorization` facade.
4. **One streak on profile** (01): render `motivationStore` only.
5. **Prisma version fix** (04 §F): pin `@prisma/adapter-libsql` to the v6 line, fix the `PrismaLibSQL` import casing.
6. **optionalAuth()** (04 §C): keyless deploys return 401/guest-mode JSON, never 500, across all 19 routes.
7. **Real `/api/health`** (04 §E): the route `useNetworkStatus` already calls.
8. **Delete placebos**: fake `AgentPanel` demo actions; `OfflineModelLoader` + `hybridTranscription` (74 MB download used by nothing — keep the provider interface hook for a future return).

### Wave 1 — One source of truth (01, PRs 1–10)
Unified SRS (ayah + vocab item types), unified preferences, unified recitation engine implementing 04's provider-chain semantics, single accuracy formula, `hifz:` key namespace + run-once migrations, new test suites BEFORE deleting the old dead-module test, then the deletion manifest (~6,500 lines).

**Corrections found during design (trust these over the original audit):**
- `/api/transcribe-tarteel` is **NOT dead** — it is the batch path for `TajweedPractice` (`tajweedService.ts:410`). Keep; bring under optionalAuth + BYOK.
- `/memorize/page.tsx` (orphan surah picker) **does exist** — delete or repurpose as the Custom-track picker (02 §A).
- `LiquidPill/LiquidCard/FloatingMenu/LiquidGlassNav` components have zero imports, but their **CSS classes are still used as raw classNames** — CSS families are delete-after-migration (03 §G), components delete-now.
- `tarteel/keep-warm` is Vercel-cron-wired — remove only together with the on-demand warmup swap.

### Wave 2 — The product: Hifz Journey (02, MLV first)
Tracks (Mufassal-first default) → daily assignment engine (letter-count budgeting, capped catch-up) → journey cursor in `hifz:journey` synced via `StudyPlan.journeyState` → dashboard Continue ribbon shows today's sabaq/sabqi/manzil → end-of-surah milestone + auto-advance. Then fast-follows: WBW/transliteration bundling (`scripts/fetch-wbw.ts`), real 30-juz JourneyMap, lesson prerequisite gates (restore `isLessonUnlocked`).

`memorization-flow.ts` is deleted at the END of this wave, after the engine absorbs its model.

### Wave 3 — One design language (03)
Token utilities in Tailwind first (kills inline-style idiom and the night-* remap), then page-by-page: **memorize** (after Wave 2 touches it) → mushaf → practice → settings → progress/profile → onboarding/recite. Each page PR = tokens + primitives + emoji→icons + animation prune. Finish with the CSS cleanup manifest (globals.css 3,409 → ~1,200 lines) and deletion of the night/gold scales.

### Wave 4 — Hardening + App Store (04 remainder)
Audio CDN fallback chain + `scripts/verify-reciters.ts`, BYOK across all five AI routes + per-key-hash rate limits + `/api/ai/status` UI gating, service-worker v2 matrix (offline target: memorize/review/mushaf/cached-audio all work), sync-offline badge.

**App Store gate:** 04 PR-1 (recitation robustness), PR-3 (no 500s for guests), PR-8 (offline robustness) must ship before submission, plus the iOS-shell items tracked separately (mic usage string, native speech bridge, Sign in with Apple, 1024px icon).

## Success metrics

- A brand-new user who cannot read Arabic reaches their first memorized ayah with transliteration on, entirely guided.
- Finishing any surah always presents the next step; the plan never runs out before ayah 6,236.
- Daily review load stays bounded (manzil = rolling 1/30 khatm; peak ~50 min/day around 15–20 juz, then falls).
- Every recitation mode persists results; provider failures fall back mid-session with a visible notice, never silently.
- One streak number, one reciter setting, one review queue — everywhere.
- The app works offline for memorize/review/mushaf once a surah has been visited.
