# 03 — Design System: UI Unification Plan

> **Status:** Implementation-ready
> **Scope:** Unify all pages onto the shipped "manuscript" design system (warm parchment light / candlelit espresso dark + 5 prayer-time ambient overlays). Kill the legacy "liquid-glass night/gold" era, the `night-*` remap hack, and the inline-`style` idiom in one coordinated migration.
> **Author:** Design-system working doc. Every spec below is grounded in the current code with `file:line` citations — verify before editing.

---

## 0. Problem statement (verified)

The manuscript redesign shipped to exactly **one** page. The dashboard (`src/app/dashboard/page.tsx`) reads tokens correctly but via a raw inline idiom — `style={{ background: 'var(--theme-surface)' }}` / `style={{ color: 'var(--theme-text)' }}` (e.g. dashboard `:177`, `:189`; 53 occurrences). Every other page still uses the old Tailwind scales `night-*` / `gold-*` / `.liquid-*`, which only render in light mode because of a remap hack: `globals.css:63–76` inverts the `night` scale inside `:root` (so `night-950` = lightest) and `.dark` (`globals.css:96–106`) restores the normal dark ramp. Both idioms are wrong long-term.

Confirmed metrics:

| Signal | Value | Source |
|---|---|---|
| `globals.css` size | **3,409 lines** | `wc -l` |
| `.liquid-glass` / `.liquid-modal` defined twice | yes | `649` & `3353`; `1179` & `3391` |
| Unused `.liquid-*-v2` families | 2 | `3105`, `3163` (0 tsx refs) |
| Unused `.quran-text-sm/-md/-lg/-responsive` | yes | `2551–2556` (0 tsx refs) |
| `--ambient-*` tokens written only from JS | yes | `ThemeContext.tsx:143–166` |
| Components with **zero** imports | LiquidPill, LiquidCard, FloatingMenu, LiquidGlassNav | `grep -rl` |
| Emoji-as-icon chars | **213 across 48 files** | python scan |
| `font-arabic` vs `font-quran` | 83 vs 24 (no rule) | `grep -roE` |
| `framer-motion` imports | 94 files | `grep -rl` |
| Recall screen control clusters | up to 14 at once | `[surah]/[ayah]/page.tsx:756–1404` |

---

## A. Token architecture — ONE system

### A.1 Current state (read first)

Three overlapping token layers exist today:

1. **`--theme-*`** (13 vars): `globals.css:37–51` static manuscript-light defaults; **overwritten at runtime** by `ThemeContext.tsx:143–157`. Consumed by the dashboard inline idiom and by `body` (`globals.css:124–125`).
2. **`--ambient-*`** (10 vars): `globals.css:27–35` defaults; runtime-written `ThemeContext.tsx:158–165`. Consumed by `GlassPanel` (`--panel-*` derive from these) and `::selection`.
3. **`--c-night-*`** (11 RGB-channel vars): the remap hack, `globals.css:66–76` (light, inverted) + `96–106` (dark). Fed into Tailwind's `night` color (`tailwind.config.ts:15–27`, `rgb(var(--c-night-N) / <alpha-value>)`).

The **single source of truth for palette values** is `AMBIENT_PALETTES` in `src/hooks/usePrayerTime.ts:45–122` — 5 prayer periods. `ThemeContext` maps a period → both `--theme-*` and `--ambient-*` (`applyThemeToDOM`, `ThemeContext.tsx:117–176`). `manuscript` = `dhuhr` palette, `manuscript-dark` = `isha`, `auto` = live period.

### A.2 Target: collapse to one namespace + Tailwind utilities

**Decision:** keep the runtime-driven `--theme-*` set as the canonical token surface (it already carries semantic names and is JS-written for prayer-time drift). Retire `--ambient-*` duplication into it, and expose every token as a **Tailwind utility** so pages write `bg-surface text-primary border-hairline` — killing BOTH the inline `style` idiom AND the `night-*` remap.

#### Canonical token set (rename map)

| Semantic token | CSS var | Source field (`AmbientColors`) | Notes |
|---|---|---|---|
| Surface (page bg) | `--surface` | `bg` | was `--theme-surface` |
| Surface alt | `--surface-alt` | `bgAlt` | |
| Card | `--surface-card` | `surface` | |
| Card hover | `--surface-card-hover` | derived | |
| Text primary | `--text` | `textPrimary` | was `--theme-text` |
| Text secondary | `--text-secondary` | `textSecondary` | |
| Text muted | `--text-muted` | `textMuted` | |
| Accent (gold leaf) | `--accent` | `goldLeaf` | was `--theme-accent` |
| Accent subtle fill | `--accent-subtle` | `goldLeafSubtle` | for chips/badges |
| Accent ink | `--accent-ink` | `accent` | period-specific warm ink |
| Border | `--border` | `border` | |
| Border subtle | `--border-subtle` | `borderSubtle` | |
| Warmth wash | `--warmth` | `warmth` | ambient gradient overlay |

**Semantic state tokens** (NEW — currently hand-rolled per page as `rose-*`/`amber-*`/`sage-*`; see recall banners `[ayah]/page.tsx:817,833,1122`). Add to `:root` and `.dark`:

```css
:root {
  --success:      #4e7a51;  --success-subtle: rgba(78,122,81,0.12);
  --warning:      #b8860b;  --warning-subtle: rgba(184,134,11,0.14);
  --danger:       #9e4f44;  --danger-subtle:  rgba(158,79,68,0.12);
  --info:         #4076d5;  --info-subtle:    rgba(64,118,213,0.12);
}
.dark {
  --success:      #7fa876;  --success-subtle: rgba(127,168,118,0.16);
  --warning:      #dcb863;  --warning-subtle: rgba(220,184,99,0.16);
  --danger:       #c87a68;  --danger-subtle:  rgba(200,122,104,0.16);
  --info:         #6496e0;  --info-subtle:    rgba(100,150,224,0.16);
}
```

Because state tokens do NOT drift with prayer time, they live in the CSS `:root`/`.dark` blocks (static), not in `applyThemeToDOM`. The prayer-driven tokens (surface/text/accent/border/warmth) stay JS-written.

#### The 5 prayer-time ambient overlays

These are the `AMBIENT_PALETTES` (`usePrayerTime.ts:45–122`) — the plan keeps them verbatim as the palette source; `applyThemeToDOM` already selects one per period. Summary of the identity each overlay carries (accent/`goldLeaf`):

| Period | bg | accent ink | goldLeaf | Feel |
|---|---|---|---|---|
| fajr | `#f0eef5` | `#8b7aaf` | `#b8973a` | cool dawn violet |
| dhuhr | `#faf6ed` | `#8b7a5e` | `#c9a227` | neutral parchment (= manuscript light) |
| asr | `#faf3ea` | `#a07840` | `#c49020` | warm amber afternoon |
| maghrib | `#f8ede5` | `#b07040` | `#c08028` | terracotta sunset |
| isha | `#1b1712` | `#c9aa6a` | `#dcb863` | candlelit espresso (= manuscript dark) |

No change to values. The only fix: **add static `:root`/`.dark` fallbacks for the renamed tokens** so first paint (pre-hydration) is correct, matching what `ThemeContext` will write.

### A.3 Tailwind mapping (kills both bad idioms)

Add a semantic color layer to `tailwind.config.ts` `theme.extend.colors` so utilities exist. Tokens are opaque hex/rgba (not RGB channels), so map them **without** `<alpha-value>`:

```ts
colors: {
  // NEW — semantic manuscript tokens (opaque, theme-driven)
  surface:      'var(--surface)',
  'surface-alt':'var(--surface-alt)',
  card:         'var(--surface-card)',
  primary:      'var(--text)',          // text-primary
  secondary:    'var(--text-secondary)',
  muted:        'var(--text-muted)',
  accent:       'var(--accent)',
  'accent-subtle':'var(--accent-subtle)',
  hairline:     'var(--border)',
  'hairline-subtle':'var(--border-subtle)',
  success: 'var(--success)', warning: 'var(--warning)',
  danger:  'var(--danger)',  info:    'var(--info)',
  // ...keep sage/midnight/etc. as static brand colors for now
}
```

This yields `bg-surface`, `text-primary`, `text-secondary`, `border-hairline`, `bg-card`, `text-accent`, `bg-accent-subtle`, `text-success`, etc. For per-token borders/text with the same key, also register:

```ts
borderColor:     { hairline: 'var(--border)', 'hairline-subtle':'var(--border-subtle)' },
textColor:       { primary:'var(--text)', secondary:'var(--text-secondary)', muted:'var(--text-muted)' },
backgroundColor: { surface:'var(--surface)', card:'var(--surface-card)', 'accent-subtle':'var(--accent-subtle)' },
```

(Tailwind derives `text-*`/`bg-*`/`border-*` from `colors` automatically; the explicit sub-keys above are only needed if a name collides between text and bg semantics — verify at build and prune.)

**Migration mapping for existing pages** (mechanical find/replace during each page's PR):

| Legacy | Replacement |
|---|---|
| `text-night-100` / `-200` | `text-primary` |
| `text-night-300` / `-400` | `text-secondary` |
| `text-night-500` / `-600` | `text-muted` |
| `bg-night-900` / `-950` | `bg-surface` |
| `bg-night-800` / `-700` | `bg-surface-alt` / `bg-card` |
| `border-night-800` | `border-hairline` |
| `text-gold-400` / `-500` | `text-accent` |
| `bg-gold-500/10` | `bg-accent-subtle` |
| `style={{ color:'var(--theme-text)' }}` | `className="text-primary"` |
| `style={{ background:'var(--theme-surface)' }}` | `className="bg-surface"` |

### A.4 Deprecation path for `night-*` / `gold-*`

1. **During migration (keep the crutch):** leave `--c-night-*` remap (`globals.css:66–76, 96–106`) and the `night`/`gold` Tailwind scales intact so unmigrated pages keep working. Migrated pages must use zero `night-*`/`gold-*`.
2. **CI guard:** add a lint check (grep in CI) that fails if a **migrated** file (tracked in the migration checklist, §E) contains `night-[0-9]` or `\bgold-[0-9]`.
3. **After the last page migrates:** delete `night` + `gold` from `tailwind.config.ts:15–41` and the `--c-night-*` blocks. `gold` keep-list: the `--gold-leaf-*` vars (`globals.css:21–25, 81–84`) stay — they drive `.text-gold-gradient` / `.hifz-brand` which remain valid.

---

## B. Arabic type scale — ONE semantic scale

### B.1 Current state

- Two font stacks with no rule: `font-arabic` (Amiri, 83 uses) and `font-quran` (Hafs → Kitab → Scheherazade, 24 uses) — `tailwind.config.ts:112–113`, mirrored `globals.css:14–16`. A third, `--font-indopak` (Nastaliq), is defined (`globals.css:16`) but only used by Word-by-Word components.
- 10+ size utilities (`quran-sm`…`quran-2xl` in `tailwind.config.ts:116–120`; `.quran-text*` in CSS) + 53 inline `fontSize` styles, 13 of them on Arabic text. `VerseDisplay` uses a good responsive ramp (`[ayah]/page.tsx:37–40`: `text-5xl md:text-6xl`) but `mushaf/page.tsx:82,1087,1091` drives a **stateful px number** (`style={{ fontSize }}`).

### B.2 Target: 4 semantic Arabic classes + font-size multiplier

Define once in `globals.css` (`@layer components`), replacing the dead `.quran-text-*` (`2551–2556`) and consolidating `.quran-text`/`.arabic-text` (`162–171`):

```css
:root { --quran-scale: 1; }   /* user font-size preference multiplier (0.85–1.5) */

@layer components {
  /* 1. Hero verse — the memorize/mushaf focal ayah */
  .quran-display {
    font-family: var(--font-quran);
    font-size: calc(2.75rem * var(--quran-scale));
    line-height: 2.1; letter-spacing: 0.01em;
    direction: rtl; text-align: center;
  }
  /* 2. Continuous reading — mushaf page flow, multi-verse */
  .quran-reading {
    font-family: var(--font-quran);
    font-size: calc(1.75rem * var(--quran-scale));
    line-height: 2.4; direction: rtl;
  }
  /* 3. Inline verse — cards, lists, flashcards, review */
  .quran-inline {
    font-family: var(--font-quran);
    font-size: calc(1.375rem * var(--quran-scale));
    line-height: 2.2; direction: rtl;
  }
  /* 4. Arabic UI chrome — surah names, labels, buttons (Amiri, NOT Hafs) */
  .arabic-ui {
    font-family: var(--font-arabic);
    line-height: 1.6; direction: rtl;
    /* size inherited from surrounding text utility */
  }
}
```

**Font-family rule (settles `font-arabic` vs `font-quran`):**

| Context | Font | Class |
|---|---|---|
| Any Qur'an *verse text* (the ayah itself) | Hafs (`--font-quran`) | `quran-display` / `quran-reading` / `quran-inline` |
| Arabic *UI labels* (surah name, نص, buttons, section titles) | Amiri (`--font-arabic`) | `arabic-ui` |
| Word-by-Word Urdu/Indo-Pak gloss only | Nastaliq (`--font-indopak`) | existing WBW components — unchanged |

Rule of thumb: **verses = Hafs, chrome = Amiri.** This ends the 83/24 split.

**User font-size preference** becomes `--quran-scale` (a CSS var multiplier), set from the existing pref (`mushaf/page.tsx:82` `prefs.arabicFontSize`). Convert the px slider to a 0.85–1.5 multiplier written to `document.documentElement.style.setProperty('--quran-scale', …)`. Every `.quran-*` class then scales together — no more per-element `style={{ fontSize }}`.

### B.3 Migration table — 13 inline-styled Arabic sites

| # | File:line | Current | → |
|---|---|---|---|
| 1 | `mushaf/page.tsx:1091` | `.quran-text` + `style={{ fontSize }}` | `.quran-reading` (drop inline) |
| 2 | `mushaf/page.tsx:511` | `fontSize={fontSize}` prop into verse renderer | pass `--quran-scale`, use `.quran-reading` |
| 3 | `[ayah]/page.tsx:68` (`VerseDisplay`) | `font-quran ${sizeClasses[size]}` | `.quran-display` (large) / `.quran-inline` (small/medium) |
| 4–13 | remaining 10 inline `fontSize` on Arabic (audit) — sweep with `grep -rn "fontSize" src --include=*.tsx` and map each to the nearest `.quran-*` level | | |

Acceptance: after migration, `grep -rn "fontSize" src` returns **zero** hits on Arabic text; `.quran-text-*` and the `quran-sm…2xl` `fontSize` entries in `tailwind.config.ts:116–120` are deleted (superseded).

---

## C. Component library v2

Target primitive set lives in `src/components/ui/`. Rule: **every page composes from these; no page hand-rolls a spinner, input, modal, or empty state.**

### C.1 Keep & rebrand

| Primitive | Absorbs / rebrands | Props | Replaces (cite) |
|---|---|---|---|
| **Panel** | rebrand `GlassPanel` (`ui/GlassPanel.tsx`, 12 imports — the success) to manuscript tokens | `blur, tint('neutral'\|'gold'\|'sage'\|'deep'), glow, noise, rounded` (unchanged API) | all `.liquid-glass` / `.liquid-card` className usages (24 / 13 files) |
| **Button** | replace `LiquidButton` (4) + `SheikhButton` (7) + all hand-rolled `<motion.button className="…bg-gold-500…">` | `variant('primary'\|'secondary'\|'ghost'\|'destructive'), size('sm'\|'md'\|'lg'), icon, loading, fullWidth` | recall/memorize buttons `[ayah]/page.tsx:1014,1149,1159,1170,1350,1366,1392`; `.liquid-btn`/`.sheikh-btn--*` |
| **Toggle** | keep `LiquidToggle` (1), rebrand to tokens | `checked, onChange, label` | word-by-word toggle `[ayah]/page.tsx:785` |

**Button spec** — one component, token-driven, no per-variant glass. Kills `SheikhButton`'s 180 lines of styled-jsx and `LiquidButton`'s gold-gradient hardcode:

```
primary:     bg-accent text-surface  (on dark: text stays legible via --surface being dark)
secondary:   bg-card border-hairline text-primary
ghost:       bg-transparent text-secondary hover:bg-surface-alt
destructive: bg-danger-subtle text-danger border-danger/20
loading:     renders <Spinner size="sm"/> in place of icon, disables
```

Motion: NO `whileHover` scale (see §F). Use CSS `:active` translate for tactile feedback only.

### C.2 New primitives (currently hand-rolled per page)

| Primitive | Props | Replaces (cite) |
|---|---|---|
| **Input** | `label, value, onChange, error, hint, type` | ad-hoc `<input>` in settings, onboarding |
| **Select** | `label, options, value, onChange` | ad-hoc selects in settings (reciter), practice |
| **Textarea** | `label, value, onChange, rows` | notes fields |
| **Sheet / Modal** | `open, onClose, title, side('bottom'\|'center'), children` | `.liquid-modal` usages (2 files); bottom sheets; absorbs `.liquid-modal` + `.bottom-sheet` CSS |
| **Spinner** | `size('sm'\|'md'\|'lg')` — **CSS-only** (`border` + `@keyframes spin`), no framer | the **5 different loaders**: `identify`, `profile`, `[ayah]`, `settings`, `practice/*`, `onboarding` (`grep animate-spin` + motion spinners) |
| **Skeleton** | `variant('text'\|'card'\|'verse'), lines` | replaces spinners on content-shaped loads (mushaf, progress) |
| **EmptyState** | `icon, title, body, cta?` | bare `<p>` empties (progress `:118,123`) ↔ designed (bookmarks). One component both directions. |
| **StatCard** | `label, value, icon, trend?` | progress `:117–126`; dashboard stat tiles; profile |
| **SectionHeader** | `title, subtitle?, action?` | repeated `<h2 className="text-2xl font-bold">` headers across all pages |

Each is a thin token-styled component; total new code is small because they replace far more hand-rolled markup than they add.

### C.3 Kill list

**Delete components (0 imports):**
- `src/components/ui/LiquidPill.tsx`
- `src/components/ui/LiquidCard.tsx`
- `src/components/ui/FloatingMenu.tsx`
- `src/components/ui/LiquidGlassNav.tsx`
- Remove their exports from `ui/index.ts:2–4` (and the `LiquidButton` export once Button lands).

**Delete after migration:** `LiquidButton.tsx`, `SheikhButton.tsx` (folded into Button), `LiquidToggle.tsx` (folded into Toggle) — keep until their importers migrate.

**Delete CSS `.liquid-*-v2` families now (0 refs):** `globals.css:3105–3159` (`.liquid-glass-v2`), `3163–3212` (`.liquid-modal-v2`). Also `.liquid-glass-sage` (`1818`, 0 refs) and `.liquid-glass-dark` (`750`, 0 refs). Full CSS manifest in §G.

---

## D. The memorize screen redesign (core screen)

File: `src/app/memorize/[surah]/[ayah]/page.tsx` (1,407 lines). 7 phases (`:47–71`): `intro → listen → read → memorize → recall → stack → complete`.

### D.1 The core problem

The recall phase renders **up to 14 control clusters simultaneously** (`:1052–1198`): header (X, progress bar, W-b-W toggle, N/7 counter), verse-info row, audio-error banner, reciter-fallback banner, Reveal-Mode toggle, DifficultySelector, verse box, tap hint, accuracy badges, RepetitionCounter, Reveal/Hide button, mic button, last-accuracy line, footer (Previous, 7 phase dots, Continue). The verse is correctly `text-5xl/6xl` (`VerseDisplay :37–40`) but buried.

**Two redundant progress systems:**
- Header gradient bar driven by `phaseProgress` (`:775–780`)
- Footer 7-dot row driven by `PHASES.map` + `currentPhaseIndex` (`:1335–1348`)

**Decision: the header progress bar dies.** Keep the footer dots (they show phase *position*, more meaningful than a continuous bar and they double as the phase label anchor). The header keeps only: close, surah/ayah title, phase name.

### D.2 Information-architecture principle per phase

Each phase screen = **[verse] + [ONE primary action] + [ONE progress indicator]**. Everything else moves to a **collapsible Setup layer** (a Sheet opened from a single ⚙ control in the header) OR is removed.

**Setup layer (persistent per-session, opened on demand):**
- Word-by-word toggle (`:785` — remove from header)
- Reciter selection + the "full-surah only" fallback note (`:832` — becomes a one-time Setup notice, not a persistent banner)
- Reveal-Mode on/off + DifficultySelector (`:1073–1091` — move out of the recall flow into Setup; when on, recall *is* reveal mode)

**Always-available (per Phase-2 doc): transliteration** renders inline under the verse in every phase where the verse text is shown, via `VerseDisplay` (`showTransliteration` already exists in the word-by-word path, `:258`). Promote it to a first-class always-on line under the ayah (muted, `text-secondary`), not gated behind word-by-word.

**Per-phase primary action / progress:**

| Phase | Primary action | Progress shown | Removed / moved |
|---|---|---|---|
| intro | "Begin" | dots | purple 10-3-method card (`:881`) → collapsed "How this works" disclosure; VerseContext stays but collapsed |
| listen | Play/Pause | "3 of 5 heard" | audio scrubber stays minimal |
| read | Play (follow along) | dots | — |
| memorize | "I've read it (n/10)" | RepetitionCounter only | secondary Play button → icon in header |
| recall | mic (or "I've recited it") | RepetitionCounter (n/3) | header progress bar; accuracy badges → single last-result line; reveal toggle → Setup |
| stack | "Recite all" | dots | — |
| complete | "Next verse" | celebration | — |

**Off-palette purple** (`:881–889`, `:1285` area — `from-purple-900/20`, `text-purple-300/400`): replace with `bg-accent-subtle` + `text-accent`. Purple is not in the manuscript palette.

### D.3 Recall phase — ASCII wireframe

**BEFORE** (`:1052–1198`, ~14 clusters):

```
┌───────────────────────────────────────────────┐
│ [X] ▓▓▓▓▓▓▓░░░ header progress bar  [W×W] 5/7  │  ← redundant bar + toggle
│ Al-Fatiha            Ayah 3   [brain] Recall   │
├───────────────────────────────────────────────┤
│ ⚠ Audio couldn't load — Retry                  │  ← banner
│ ♪ Per-verse audio uses Al-Afasy …              │  ← banner
│ ┌───────────────────────────────────────────┐ │
│ │ ✦ Reveal Mode  Words reveal as you…    → │ │  ← setup control in flow
│ └───────────────────────────────────────────┘ │
│ [ Easy ][ Medium ][ Hard ]  DifficultySelector │  ← setup control in flow
│                                                 │
│            بِسْمِ اللَّهِ …   (5xl)              │  ← THE VERSE (buried)
│         Tap the box above to reveal            │
│   [Attempt 1: 72%] [Attempt 2: 88%]  badges    │  ← noise
│              ●●○  From Memory                   │
│      [ Reveal ]   [ 🎤 Start Reciting (1/3) ]  │
│        ✓ Great recall — 88% accuracy!          │
├───────────────────────────────────────────────┤
│ [< Prev]      ● ● ● ● ● ○ ○      [Continue >] │  ← 2nd progress system
└───────────────────────────────────────────────┘
```

**AFTER** (verse-first, one action, one progress):

```
┌───────────────────────────────────────────────┐
│ [X]         Al-Fatiha · Ayah 3           [⚙]   │  ← setup sheet trigger
├───────────────────────────────────────────────┤
│                                                 │
│                                                 │
│            بِسْمِ اللَّهِ الرَّحْمَٰنِ            │  ← VERSE, hero, centered
│                  الرَّحِيمِ                       │     .quran-display
│         bismi llāhi r-raḥmāni r-raḥīm          │  ← transliteration (always on)
│                                                 │
│              Recite from memory                 │  ← one-line hint
│                                                 │
│                                                 │
│                  ●  ●  ○                         │  ← RepetitionCounter (only progress)
│                                                 │
│            ┌─────────────────────┐              │
│            │   🎤  Start (1 / 3)  │              │  ← ONE primary action
│            └─────────────────────┘              │
│               Reveal text  ·  88%               │  ← ghost secondary + last result inline
├───────────────────────────────────────────────┤
│  <  ── Recall ──  ● ● ● ● ○ ○ ○   >            │  ← footer dots = the ONLY nav+progress
└───────────────────────────────────────────────┘
```

Reveal-Mode, difficulty, word-by-word, reciter, and both banners now live behind `[⚙]`. Audio errors surface as a transient toast, not a persistent inline banner.

---

## E. Page migration order

**Rule:** one PR per page = tokens (§A) + primitives (§C) + emoji→icons (lucide/`src/components/icons/`) + animation prune (§F). A page is "done" only when it has zero `night-*`/`gold-*`, zero inline `style` theme vars, zero emoji-as-icon, and composes UI from `ui/` primitives.

Old-era class counts are **verified** via `grep -roE "night-[0-9]|gold-[0-9]|liquid-|sheikh-btn|bg-white/\[|text-white/"`:

| Order | Page(s) | Old-era count | Spot-check list | Effort |
|---|---|---:|---|---|
| 1 | **memorize** (`[surah]/[ayah]`, `memorize`) | 149 | recall IA rebuild (§D), 7 phases, 2 progress→1, purple→accent, RepetitionCounter, VerseDisplay→`.quran-*`, mic/reveal→Setup sheet | **L** (core screen + IA) |
| 2 | **mushaf** (`mushaf/page.tsx`) | 143 | px `fontSize`→`--quran-scale`, `.quran-reading`, reader glass bg (`globals.css:3213`), font-size slider→multiplier | **L** |
| 3 | **practice** (`practice`, `review`, `flashcards`) | 197 | flashcards `.quran-inline`, review empty/loading states, Select for filters | **M–L** |
| 4 | **settings** (`settings/page.tsx`) | 191 | Input/Select/Toggle rollout, reciter Select, theme picker already token-aware | **M** |
| 5 | **progress + profile** | 117 / 83 | StatCard (`progress:117–126`), EmptyState (bare `<p>`), Skeleton loads | **M** |
| 6 | **onboarding + recite** | 21 / 114 | onboarding lowest count (mostly done); recite history/live feedback tiers emoji→icons | **M** |

Dashboard is already migrated in spirit (token-aware) but must be **normalized**: convert its 53 inline `style={{…theme…}}` (e.g. `:177,189`) to the new `bg-surface`/`text-primary` utilities as a fast follow (order 0, trivial).

Suggested emoji→icon reference for the sweep (213 chars / 48 files): `LiveRecitation` feedback tiers (🌟✨💪 → `Star`/`Sparkles`/`Flame`), `SurahBrowser` (🕌☀☽ → `MosqueIcon`/`Sun`/`Moon`), `StudyProfile` (📖🎙✍ → `BookOpen`/`Mic`/`PenLine`), Celebrations, onboarding.

---

## F. Animation policy

94 files import `framer-motion`. Nearly every button has `whileHover={{ scale }}` (e.g. `[ayah]/page.tsx:1016,1151,1352`); list items animate in; spinners are motion-powered.

**Keep (motion earns its place):**
- Phase transitions in memorize (`AnimatePresence mode="wait"`, `[ayah]/page.tsx:843`)
- Completion celebration (`Celebration`, `:753`)
- Streak-milestone / XP moments
- Reveal-mode word reveal

**Kill:**
- `whileHover={{ scale }}` on ALL buttons → CSS `:active` translate in Button primitive. (Hover-scale is jittery on touch and inconsistent.)
- List-item entrance staggers (`variants={stagger}` on content lists, e.g. dashboard `:191`) → render immediately; keep only the top-level page fade if desired.
- Motion spinners → CSS `Spinner` (§C.2). Removes framer from every loading path.

**LazyMotion (bundle cut):**
Replace top-level `motion.*` imports with the `m.*` + `LazyMotion` + `domAnimation` strategy so the full DOM-animation feature set is not eagerly bundled.

1. Wrap the app once (in `src/app/layout.tsx` or a client provider):
   ```tsx
   import { LazyMotion, domAnimation } from 'framer-motion';
   <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
   ```
2. In components, import `m` not `motion`: `import { m, AnimatePresence } from 'framer-motion'` and use `<m.div>`.
3. `strict` makes `<motion.*>` throw, forcing the codemod to complete (mechanical `motion.` → `m.` find/replace per file during each page PR).

Expected: framer's animation runtime loads lazily; `whileHover` removal + spinner conversion drop most `m.button` usages entirely.

---

## G. CSS cleanup manifest

Target: `globals.css` **3,409 → under ~1,200 lines**.

### G.1 Duplicate-definition resolutions

| Class | Primary def | Duplicate | Resolution |
|---|---|---|---|
| `.liquid-glass` | `649–699` | noise override `3353–3378` | Fold the noise `::after` into Panel's `noise` prop; delete the `3349–3402` "Upgrade existing" block entirely. |
| `.liquid-modal` | `1179–1187` | `3391–3402` | Superseded by Sheet/Modal primitive; delete both. |
| `.liquid-glass-v2` | `3105–3159` | — | 0 refs — delete. |
| `.liquid-modal-v2` | `3163–3212` | — | 0 refs — delete. |

### G.2 Dead-class families to delete (0 tsx refs — verified)

| Range | What |
|---|---|
| `2551–2560` | `.quran-text-sm/-md/-lg/-responsive` (superseded by `.quran-*`, §B) |
| `3105–3159` | `.liquid-glass-v2` |
| `3163–3212` | `.liquid-modal-v2` |
| `3244–3272` | edge-refraction animation utilities (glass-only, 0 refs) |
| `1818–~1850` | `.liquid-glass-sage` (0 refs) |
| `750–759` | `.liquid-glass-dark` (0 refs) |
| `3069–3100` | gradient-mesh backgrounds (glass-era, verify refs, likely 0) |
| `3213–3243` | mushaf glass reader bg — replace with token bg during mushaf PR, then delete |

Audit finding: **129 of 245 selectors (53%) have zero tsx references (~951 provably dead lines).** Before deleting each block, confirm with `grep -rl "<class>" src --include=*.tsx`; the CI guard from §A.4 protects against reintroduction.

### G.3 Delete-after-migration families (live now, retire with their pages)

These have real usage today and can only be removed once §E completes:
`.liquid-glass` (24 files → Panel), `.liquid-card`/`-interactive` (13/4 → Panel), `.liquid-glass-gold`/`-premium` (8/1 → Panel `tint="gold"`), `.liquid-btn`/`-outline` (6/3 → Button), `.liquid-pill` (0 comp import but check className), `.sheikh-btn--*` (styled-jsx in `SheikhButton.tsx`, not globals). Their `.dark` overrides (`3023–3044`) and reduced-motion / focus blocks (`1998–2024`, `2050–2051`, `2156–2173`, `2891–2925`) delete alongside.

### G.4 Keep

Base/accessibility layers stay: reduced-motion (`1997`, `2771`), focus-visible ring (`2801`), 44px touch targets (`2821`), sr-only (`2858`), high-contrast/forced-colors (`2884`, `2910`), ARIA live (`2931`), safe-area, scrollbar, `.text-gold-gradient`/`.hifz-brand` (token-driven, `197–252`). Consolidate the `--theme-*`→`--*` rename in `:root`/`.dark` (§A.2).

---

## Appendix — verification commands

```bash
# per-page old-era count (migration acceptance = 0 on migrated pages)
grep -roE "night-[0-9]|gold-[0-9]|liquid-|sheikh-btn" src/app/<page>
# inline theme-var idiom
grep -rn "var(--theme-" src/app/<page> --include=*.tsx
# emoji sweep
python3 -c "import re,glob; [print(f) for f in glob.glob('src/**/*.tsx',recursive=True) if re.search('[\U0001F000-\U0001FAFF☀-➿]',open(f).read())]"
# arabic inline fontSize (target: 0)
grep -rn "fontSize" src --include=*.tsx
# dead-class check before deleting
grep -rl "<class>" src --include=*.tsx
```
