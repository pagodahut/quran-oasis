# W0-2: Fix reciter split-brain (Settings change does nothing)

**Spec:** `docs/design/01-STATE-CONSOLIDATION.md` §A + PR3 notes. Read it first.
**Branch:** `fix/reciter-split-brain`. One PR.

## Problem

Changing the reciter in Settings has no effect on playback:

- The Settings page writes the reciter via `preferencesStore`
  (`src/lib/preferencesStore.ts`, key `hifz-preferences`, field
  `audio.reciter`) — see `src/app/settings/page.tsx` reciter section.
- Playback reads from the OTHER store: `src/components/AudioPlayer.tsx`
  imports from `src/lib/settings.ts` (key `hifz-settings`), and
  `src/lib/quranAudioService.ts` (~lines 284, 364) calls
  `getSetting('reciter')` from the same legacy store.

## Changes (minimal, no key migration — that's Wave 1)

1. Point all playback reads at `preferencesStore`:
   - `quranAudioService.ts`: replace `getSetting('reciter')` /
     `getSetting('playbackSpeed')` etc. with the `preferencesStore` equivalents
     (`getPreferences().audio.reciter`, `.playbackSpeed`, `.audioQuality`,
     `.crossfadeEnabled`, `.autoPreload`).
   - `AudioPlayer.tsx`: swap its `settings.ts` imports for `preferencesStore`
     equivalents. Note it currently imports RECITERS from two different
     modules — standardize on the table exported from `src/lib/quranData.ts`.
2. One-time read-through: when reading `audio.reciter`, if the value is unset
   AND legacy `hifz-settings` has a reciter, honor the legacy value (playback
   obeyed `hifz-settings` until now, so that's the user's real intent). Do NOT
   delete `settings.ts` or migrate keys in this PR.
3. Normalize reciter IDs at the read boundary: the legacy table uses `shuraim`
   where `quranData.ts` uses `shuraym`; map legacy IDs to canonical ones so no
   stored preference silently falls back to Alafasy.

## Acceptance criteria

- Change reciter in Settings → next ayah playback in mushaf AND in the
  memorize flow uses the new reciter.
- A user whose old reciter lived only in `hifz-settings` keeps their reciter.
- `npm run type-check && npm run lint && npm test && npx next build` pass.
