---
name: quran-content
description: Author, edit, or review ANY Islamic content in this app — lesson text, tafsir snippets, hadith, duas, nudges, translations, transliteration, surah metadata, tajweed rules, Arabic processing. Use BEFORE touching content the user will read as religious teaching. The product's credibility and the owner's intention (sadaqa jariyah) depend on getting this exactly right.
---

# Qur'an & Islamic Content Rules

Errors here aren't bugs; they're a betrayal of user trust in a religious
teaching tool. The bar is: every religious claim is sourced or absent.

## Absolute rules

1. **Qur'anic text never comes from model memory.** Arabic ayah text,
   translations, ayah counts, juz/page/ruku numbers, sajda positions — all
   come from the bundled data (`src/data/surahs/*.json` via
   `src/lib/quranData.ts`). If writing content that quotes an ayah, READ the
   bundled JSON for that ayah and copy it exactly. (A wrong sajda count for
   Al-Baqarah shipped once. Never again.)
2. **No invented hadith.** Every hadith needs: named collection (Bukhari,
   Muslim, Tirmidhi...), reference number, and an honest authenticity note.
   If you cannot verify the reference, the hadith does not ship — flag it
   for the owner with your best-known sourcing instead.
3. **Weak hadith are labeled weak.** The app already frames the Ya-Sin
   ("heart of the Qur'an") and Al-Mulk-protection narrations honestly
   (`src/lib/intermediate-lessons.ts` pattern). Follow that pattern: state
   the grading, attribute the virtue as "some scholars hold...", never
   present da'if as sahih to make copy punchier.
4. **No fiqh rulings or sectarian positions.** The app teaches memorization,
   tajweed, and mainstream, consensus-level meaning. Anything beyond
   (rulings, madhhab differences, aqeedah disputes) → owner sign-off first.
5. **Respectful conventions:** ﷺ after the Prophet's name (match existing
   usage), honorifics for companions where used, "Qur'an" spelling per
   surrounding copy, correct common spellings (it's "Alhamdulillah" — a
   typo in a nudge shipped once).

## Working with the calendar

Hijri dates and Ramadan detection use
`Intl.DateTimeFormat('en-u-ca-islamic-umalqura')` via
`src/lib/islamic-calendar.ts`. Never hardcode Hijri years, Ramadan date
ranges, or prayer-time tables. Prayer periods come from `usePrayerTime`.

## Arabic text processing

Any normalization/matching/scoring change must preserve these invariants
(add test cases when touching them):

- **Dagger alef (U+0670)** maps to a full alef — it is NEVER stripped with
  diacritics (stripping it corrupted scoring of "Allah", "ar-Rahman" once).
  The safe diacritics range excludes it: `[ؐ-ًؚ-ٟۖ-ۭ]`.
- Alef variants (أ إ آ ا) normalize together for matching; ta marbuta ↔ ha
  handled consistently; hamza carriers normalized.
- Never normalize the DISPLAYED text — normalization is for comparison only.
  Displayed ayah text stays byte-exact from the bundle.
- Test vector minimum: fully-voweled ayah vs. bare-letters input; a word
  containing dagger alef; a word ending in ta marbuta.

## Pedagogy conventions (match the existing curriculum voice)

- Audience: adult non-native readers, possibly zero Arabic. Define every
  Arabic term at first use with transliteration + short gloss.
- Transliteration accompanies EVERY new Arabic string shown to learners.
  Scheme: match the existing lessons (ā/ī/ū long vowels, ʿ for ayn style
  as used in `lesson-content.ts`) — don't introduce a second scheme.
- Encouraging, warm, never guilt-based. Missed days get mercy, not shame
  (this is also encoded in the journey engine's catch-up design).
- Method claims ("the 10-3 method", interval choices) are presented as
  established memorization practice, not divine mandate.

## Checklist before shipping content

- [ ] Every ayah quote diffed against `src/data/surahs/<n>.json`
- [ ] Every metadata number (ayah count, sajda, juz) read from bundled data
- [ ] Every hadith: collection + number + grading present
- [ ] Transliteration present for all new Arabic
- [ ] Arabic strings have `dir="rtl" lang="ar" translate="no"` when rendered
- [ ] No rulings/sectarian content (or: owner sign-off obtained and noted)
- [ ] Honorifics and spellings match surrounding content
- [ ] Read the final copy once as a skeptical hafiz would — would they trust
      this app after reading it?

## When reviewing existing content

Report findings in three buckets: (a) factually wrong (must fix — cite the
bundled-data proof), (b) unsourced (needs a citation or removal), (c) tone/
pedagogy (suggest, don't unilaterally rewrite). Substance changes to (a) and
(b) proceed; anything touching rule 4 escalates to the owner first.
