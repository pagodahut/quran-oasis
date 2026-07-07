---
name: manuscript-ui
description: Build or modify any UI in this app — components, pages, styling, theming, Arabic text rendering. Use BEFORE writing any JSX/CSS change. Encodes the manuscript design system, the inverted night-* palette semantics, the Arabic type scale, and the both-themes verification that prevents the contrast bugs this app repeatedly shipped.
---

# Manuscript UI Construction Rules

The app's visual identity: a warm illuminated-manuscript aesthetic — parchment
light mode, candlelit espresso dark mode, gold-leaf accents, prayer-time
ambient shifts. One design language, verse-first, dignified. Spec:
`docs/design/03-DESIGN-SYSTEM.md` (read it for any page-level work).

## The palette trap (cause of most shipped UI bugs)

`night-*` Tailwind classes are SEMANTIC ROLES remapped per theme via CSS
variables in `globals.css`:

| Class | Light (manuscript) | Dark (espresso) | Role |
|---|---|---|---|
| `night-950` | near-white parchment | near-black | page background |
| `night-900/800` | light cream | deep brown | raised surfaces |
| `night-500` | mid warm gray | mid warm gray | muted text |
| `night-100/50` | dark ink | light cream | primary text |

Therefore:
- NEVER `bg-black`, `bg-white`, `text-white`, `text-black`, or hex colors on
  theme-dependent elements. `text-white` is only legal on top of a fixed
  colored fill (e.g., a gold gradient badge) that is identical in both themes.
- NEVER assume night-* is "dark". `text-night-100` is the correct PRIMARY
  text color in both themes; `text-white/70` is a bug.
- Overlay/scrim: `bg-night-950/80 backdrop-blur` (theme-aware), not
  `bg-black/70`.
- Gold: `gold-400`/`gold-500` classes or `--gold-leaf` vars. Sage for success.
  There is NO purple/blue/indigo in this palette — if you're typing
  `purple-`, stop.

## Arabic text — the product's core asset

- Verse text: `font-quran` family (`--font-quran`, KFGQPC Hafs) with
  `dir="rtl" lang="ar" translate="no"` — all three attributes, every time.
- UI-level Arabic (labels, duas, greetings): `font-arabic` (Amiri).
- Sizes come from the semantic scale (spec 03 §B): display (memorize hero),
  reading (mushaf), inline (lists/cards). No new inline `fontSize:` styles on
  Arabic; the user font-size preference is a multiplier, not a new size.
- Never break a verse across a styling boundary mid-word; verse numbers use
  the existing `verse-number` treatment.
- Transliteration accompanies any NEW Arabic shown to learners (toggleable,
  default on for beginner levels).

## Components

- Primitives first: `GlassPanel`, `LiquidButton`, `LiquidToggle`, `Skeleton`,
  the icons in `src/components/icons/` and lucide-react. Check
  `src/components/ui/` before hand-rolling; if a primitive is missing
  (Input, EmptyState...), CREATE it in `ui/` rather than styling a one-off div.
- Icons: lucide-react or the project icon set. Emoji as UI controls are
  forbidden (150 were purged; don't reintroduce). Emoji in celebratory text
  copy is acceptable sparingly.
- Empty states: icon + one-line title + one-line body + a CTA that goes
  somewhere. Never a bare `<p>`.
- Loading: `Skeleton.tsx` patterns or the standard spinner — never a new
  bespoke motion.div spinner.
- Touch targets ≥44×44px (`min-h-[44px] min-w-[44px]`); every icon-only
  button gets `aria-label`.

## Motion policy

Purposeful only: phase transitions in learning flows, completion
celebrations, streak milestones. Do NOT add: `whileHover={{scale}}` on
buttons, entrance animations on list items, motion-powered spinners.
Respect `prefers-reduced-motion` (global CSS already handles most cases —
don't bypass it with inline animation).

## Every screen must work for a guest

No UI may dead-end on "sign in required" without a working guest alternative
or a clear, single sign-in prompt. AI-gated features hide their entry points
when no key is available (check `aiSheikh.enabled` / `/api/ai/status`
pattern) rather than erroring on tap.

## Verification (non-negotiable, per screen touched)

1. **Both themes**: view the screen in light AND dark (`.dark` class on root
   / theme toggle). Check: text readable on every surface, no white-on-light
   or dark-on-dark, borders visible, focus rings visible.
2. **Prayer ambience**: if the screen uses `--ambient-*`/`--theme-*` vars,
   sanity-check one warm (dhuhr) and one dark (isha) palette.
3. **Arabic render**: correct font applied (verses look like mushaf script,
   not system fallback), RTL punctuation sits correctly, verse numbers render.
4. **Mobile width**: 375px viewport — no horizontal scroll, no overlapping
   chrome, bottom content clears `BottomNav` (`pb-` on main).
5. **Guest pass**: the flow completes signed-out.
6. State the results of 1–5 explicitly in your report; "looks fine" is not a
   result.

## When restyling old-era screens

Follow spec 03's migration recipe: tokens + primitives + emoji→icons +
motion prune together, one page per PR. Do not mix old (`liquid-*`,
raw night hexes) and new idioms in the same component you're already
rewriting — finish the component you touch.
