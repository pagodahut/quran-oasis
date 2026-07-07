# CLAUDE.md — Operating Manual for HIFZ

HIFZ (gethifz.com) teaches a non-native Arabic reader to memorize the entire
Qur'an — all 114 surahs, 6,236 ayahs — as an act of sadaqa jariyah for the
owner. Every change is judged against that goal and against the dignity the
subject matter demands. This file is the contract for any model working here.

## Ground truth — read before believing anything

- `docs/design/ROADMAP.md` — the master plan (5 waves). Current work aligns to it.
- `docs/design/01..04-*.md` — implementation specs. **Specs decide; briefs summarize.**
- `docs/design/tasks/` — delegatable task briefs. One brief = one PR, always.
- **Every root-level `*.md` except README.md and this file is a stale artifact**
  (old audits, QA reports, plans from previous eras). Never trust
  `CRITICAL_BUGS.md`, `CODEBASE-EXPORT.md`, `PROJECT.md`, etc. as current.
  Never add new status-report `.md` files to the root; docs go in `docs/`.
- The audit-corrections registry in `ROADMAP.md` overrides older claims
  (e.g. `/api/transcribe-tarteel` is LIVE — TajweedPractice's batch path).

## Commands — the verification gate

```
npm run type-check   # tsc --noEmit
npm run lint         # eslint src/
npm test             # vitest run
npx next build       # includes prisma generate
```

All four must pass before any commit is called "done". No exceptions, no
"the failure is pre-existing" unless you prove it existed on the base commit.

## How the owner works

- Work arrives as waves/briefs. Scope discipline is absolute: one brief = one
  PR; no drive-by refactors; if you notice an adjacent problem, write it down
  (add a brief or note in the PR body), don't fix it in-scope.
- Branches: `claude/<topic>-<suffix>` or `fix|feat|chore/<topic>`. Never push
  to `main` directly. Vercel deploys `main` to gethifz.com on merge.
- Commit style: imperative summary line, body lists concrete changes.
- The owner delegates heavily (Claude agents, Codex) and reviews outcomes,
  not diffs line-by-line. Your PR description IS the review surface: state
  what changed, what you verified, and anything you're unsure about.
- Production reality: Vercel **free tier** (cron max 1/day, no always-on),
  Turso free tier, optional Clerk. Guests must have a full experience.

## Codebase map — canonical vs. trap

This codebase contains multiple generations of half-migrated systems. For
every concept there is ONE canonical module and several look-alike traps.

| Concept | Canonical | Traps (do not use/extend) |
|---|---|---|
| SRS / review scheduling | `src/lib/spaced-repetition.ts` (`qo_srs_state`) | `memorizationSystem.ts`, `flashcardSystem.ts` internals, `spacedRepetition.ts`, `spacedRepetition-manus.ts` |
| Settings/preferences | `src/lib/preferencesStore.ts` | `src/lib/settings.ts` (legacy, being absorbed) |
| Reciter list | `src/lib/quranData.ts` RECITERS | 6 other RECITERS tables in lib/ |
| Surah metadata | `src/lib/quranData.ts` (bundled JSON) | `quran.ts` SURAH_NAMES, `surahMetadata.ts` |
| Quran text | bundled `src/data/surahs/*.json` via `quranData.ts` | any runtime fetch of alquran.cloud |
| Streaks | `src/lib/motivationStore.ts` | `progressStore` streak, `studyTracker` streak |
| Traditional hifz model | reserved: `memorization-flow.ts` is DEAD code kept only as reference for the Wave-2 journey engine (spec 02) | do not import it; do not delete it before Wave 2 absorbs it |
| Auth (client) | `src/hooks/useAuth.ts` (guest-safe) | importing `@clerk/nextjs` hooks directly in components |
| AI calls | `src/lib/ai.ts` helpers (support `apiKey` override for BYOK) | inline fetch to Anthropic |

When touching any of these areas, check the relevant spec in `docs/design/`
first — consolidation work may have moved the canonical since this file was
written. The spec wins over this table.

## Named failure modes — and the rule that prevents each

1. **The Two-Stores Trap.** You change a setting via one store; the feature
   reads the other; nothing happens (this shipped: reciter changes were
   no-ops). RULE: before adding any read/write of persisted state, grep for
   every existing reader AND writer of that concept; write only to the
   canonical store in the table above.
2. **The Fourth Scheduler.** Weak models see SM-2 math and reimplement it
   locally. RULE: never write interval/ease math outside
   `spaced-repetition.ts`. If a flow needs scheduling, it calls the SRS API.
3. **The Inverted Palette.** `night-*` Tailwind colors are SEMANTIC, not
   literal: in light mode `night-950` is near-white parchment and `night-100`
   is dark ink (CSS var remap in `globals.css`). RULE: never assume night-* is
   dark; never hardcode `bg-black`, `text-white`, or hex colors for
   theme-dependent surfaces; verify every UI change in BOTH themes.
4. **The Half-Write.** A memorization/review completion that updates one store
   but not the SRS (this shipped: lesson-memorized verses vanished from
   review). RULE: completion paths go through the shared facade
   (`completeMemorization`), never ad-hoc double-writes.
5. **The Key Cowboy.** Renaming or adding localStorage keys casually destroys
   real users' progress. RULE: key changes happen ONLY inside the Wave-1
   migration module (spec 01 §C) with old→new copy + removal. New keys use the
   `hifz:` prefix and must be added to `clearAllLocalData`'s registry.
6. **The UTC Streak Killer.** Date math with `toISOString().slice(0,10)`
   breaks streaks for anyone east of UTC. RULE: all day-boundary logic uses
   the local-date helpers (`localDateKey()` pattern in progressStore/
   motivationStore) — never raw UTC strings.
7. **The Silent Integration.** Swallowing a failed external call (this
   shipped: Tarteel 403 = "healthy", chunks failed silently, recitation dead).
   RULE: every external call has an explicit failure path the USER can see —
   fallback, toast, or disabled entry point. `catch { /* ignore */ }` is only
   legal for best-effort writes (analytics, caches), never for reads the UI
   depends on.
8. **The Clerk Assumption.** Calling `auth()` or Clerk hooks unconditionally
   500s every route / crashes guest mode when Clerk isn't configured. RULE:
   client uses `useAuth()`; server uses the optionalAuth/requireAuth helpers
   (spec 04 §C). AI routes must honor the user's own key (`x-user-api-key`).
9. **The Invented Hadith.** Generating Islamic content from model memory.
   RULE: never author a hadith, ayah, translation, or tafsir claim from
   memory. Qur'an text comes from bundled data ONLY. Hadith require a named
   collection + number and honest grading (weak hadith must be framed as
   weak). If you cannot source it, don't ship it — flag for the owner.
10. **The Emoji Icon.** Emoji as UI iconography (150 of them shipped). RULE:
    lucide-react or `src/components/icons/` only. Emoji are acceptable in
    user-generated or celebratory TEXT copy, never as interface controls.
11. **The Dead/Live Misread.** This repo has dead code that looks load-bearing
    and live code that looks dead. RULE: before deleting anything, grep both
    `@/lib/...` and relative-path imports, check `vercel.json` crons and
    `middleware.ts` matchers; before building ON something, confirm it has
    real importers.
12. **The Eager Push.** Syncing local→server before pulling hydrates an empty
    device over real server data (this nearly shipped data loss). RULE:
    never bypass `useSync`'s hydration guard; any new sync path must pull and
    merge before it can push.
13. **The Arabic Normalizer.** Stripping diacritics naively deletes the dagger
    alef (U+0670), corrupting accuracy scoring on words like "Allah". RULE:
    Arabic normalization changes require test cases for: dagger alef,
    ta marbuta, alef variants, and full-diacritic input.

## Quality bar — checkable, per deliverable

**Any code PR:**
- [ ] All four gate commands pass locally
- [ ] Scope matches the brief/request; zero unrelated diff hunks
- [ ] No new `any` outside Web-API boundaries; no new eslint-disable without a stated reason
- [ ] Every new external call has a visible failure path (rule 7)
- [ ] Grep proof for deletions ("0 importers") pasted into the PR body
- [ ] New persisted keys registered in clearAllLocalData; no renamed keys (rule 5)

**UI work, additionally:**
- [ ] Verified in light AND dark theme (screenshot or explicit statement per screen touched)
- [ ] Arabic text uses the semantic type scale / `--font-quran` for verses — no new inline `fontSize:` on Arabic
- [ ] RTL: verse text has `dir="rtl" lang="ar" translate="no"`
- [ ] Touch targets ≥44px; interactive elements have aria-labels
- [ ] No emoji-as-icon; no colors outside the token system; works for a guest (no auth-gated dead ends)

**Islamic content (lessons, tafsir, nudges, copy):**
- [ ] Qur'an text/ayah counts/sajda positions verified against `src/data/surahs/*.json`, not memory
- [ ] Every hadith: collection + number + authenticity grade; weak ones framed honestly
- [ ] Transliteration provided wherever new Arabic is shown
- [ ] Honorifics consistent (ﷺ style already in use); no theological claims beyond mainstream consensus without owner sign-off

**API routes:**
- [ ] optionalAuth/requireAuth helper (never bare `auth()`); guests get 401/guest-mode JSON, never 500
- [ ] Rate limit on anything that costs money or CPU
- [ ] Input size caps on user-provided strings
- [ ] Works with zero optional env vars set (Clerk, Turso, ANTHROPIC_API_KEY all absent)

**Design docs / briefs:**
- [ ] Every claim cites file:line and was verified in current code, not from an older report
- [ ] Includes acceptance criteria a different agent could check without context
- [ ] States its dependencies on other specs explicitly

## When uncertain — exact escalation rules

**Proceed without asking** (then report what you did):
- Bug fixes matching a spec/brief; dead-code deletion with pasted grep proof;
  test additions; copy typo fixes; anything already listed in ROADMAP waves.

**Ask first, with a recommendation** (use one question, give your pick):
- Any localStorage schema/key change outside the migration module
- Any change to Islamic content SUBSTANCE (rulings, hadith selection, translation choice) — wording polish is fine
- Adding a dependency >50KB or any new external service/endpoint
- Anything that changes what deployed users' stored data means
- Deleting anything you cannot prove is dead
- UX flows redesigns not covered by spec 03

**Stop and wait** (do not proceed on any answer you'd have to assume):
- Spending money (paid tiers, API keys, domains)
- Destructive git operations; force-push; history rewrites
- Publishing anything outside the repo (App Store, external posts)

**When a spec and this file conflict:** the newer document wins; note the
conflict in your PR body so the older one gets fixed.

**When you find the codebase contradicts an audit/spec claim:** trust the
code, record the correction in `docs/design/ROADMAP.md`'s corrections list.

**Blocked mid-task** (missing env, failing external service): finish every
part that doesn't depend on the blocker, then report precisely: what's blocked,
what you verified, the exact command/setting the owner must provide.
