# W0-8: Delete the placebos (fake AgentPanel, unused 74MB offline model)

**Spec:** `docs/design/04-INTEGRATIONS.md` §A.7 + `01-STATE-CONSOLIDATION.md`
deletion notes. Read both first.
**Branch:** `chore/delete-placebos`. One PR.

## Problem

Two features actively mislead users:

1. `src/components/AgentPanel.tsx` — rendered on the profile page ("AI Agent
   Activity", `src/app/profile/page.tsx` ~line 527) but displays HARDCODED
   fake demo actions (`DEMO_ACTIONS`, ~lines 64–70) to real users.
2. `src/components/OfflineModelLoader.tsx` (Settings → "Offline Mode") lets
   users download a ~74 MB Whisper model via
   `src/lib/hybridTranscription.ts`, but `hybridTranscription.transcribe()` /
   `transcribeOffline()` have ZERO callers — nothing ever uses the model.
   Also, its "downloaded" state is in-memory only, so the tile re-shows
   "Download" after every reload.

## Changes

1. Remove the AgentPanel section from `profile/page.tsx` and delete
   `src/components/AgentPanel.tsx` (verify zero other importers first).
2. Remove the `OfflineModelSection` from `src/app/settings/page.tsx` and delete
   `src/components/OfflineModelLoader.tsx`.
3. Delete `src/lib/hybridTranscription.ts` UNLESS other code imports parts of
   it (verify with grep). If `@xenova/transformers` has no remaining importers,
   remove it from `package.json` dependencies (nontrivial bundle/install win)
   and commit the lockfile.
4. Leave a one-line note in `docs/design/04-INTEGRATIONS.md` §A.7 marking the
   offline provider as "removed <date>; reintroduce via RecitationProvider
   interface if revived" (the spec already describes the interface).

## Acceptance criteria

- Profile has no AI Agent Activity section; Settings has no offline-model tile.
- `grep -r "AgentPanel\|OfflineModelLoader\|hybridTranscription" src/` returns
  nothing.
- `npm run type-check && npm run lint && npm test && npx next build` pass.
