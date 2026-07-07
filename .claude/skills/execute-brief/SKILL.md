---
name: execute-brief
description: Execute a task brief from docs/design/tasks/ (or an ad-hoc scoped task) as a single verified PR. Use whenever asked to "do W0-3", "execute the next brief", "implement this brief", or any bounded implementation task in this repo. Enforces scope discipline, the verification gate, and the PR conventions the owner reviews by.
---

# Execute a Task Brief

Turn one brief into one finished, verified, pushed PR. Nothing more.

## Step 1 — Load the contract

1. Read the brief in full. Read the spec section it cites in `docs/design/`
   (the spec wins where they disagree — note any disagreement in the PR body).
2. Read `CLAUDE.md` §"Named failure modes" — identify which of the 13 traps
   this task can trigger (state them to yourself; most tasks touch at least
   2). Read the canonical-vs-trap table for every concept the brief touches.
3. Restate the acceptance criteria as your own checklist. If any criterion is
   untestable as written, define the concrete test you WILL run before coding.

## Step 2 — Verify the premise

Briefs cite file:line evidence that may have drifted. Before writing code:

- Open every cited file; confirm the problem still exists as described.
- Grep for ALL readers and writers of any state the task touches
  (`Grep` for the localStorage key, the store function names, the concept).
- If the premise is wrong (already fixed, code moved, claim incorrect):
  STOP coding. Record the correction in `docs/design/ROADMAP.md`'s
  corrections list, report, and await direction. Do not "fix it anyway".

## Step 3 — Branch

```
git checkout main && git pull origin main   # or the branch the brief names
git checkout -b <branch-name-from-brief>    # fix/..., feat/..., chore/...
```

If working inside an existing session branch, confirm with the task context
which branch is designated — never invent a target branch.

## Step 4 — Implement, scope-locked

- Only files the brief implies. Adjacent problems you notice: append them to
  a `## Follow-ups` note in your PR body (or a new brief file if asked) —
  never fix in-scope.
- Match surrounding style exactly: comment density, naming, idiom.
- New persisted keys → `hifz:` prefix + register in `clearAllLocalData`.
  Renaming keys is FORBIDDEN outside the Wave-1 migration module.
- Any new external call gets a user-visible failure path (fallback/toast/
  disabled state). `catch {}` only for best-effort writes.
- If the brief requires a test, write the test FIRST and watch it fail.

## Step 5 — The gate (all four, in this order)

```
npm run type-check
npm run lint
npm test
npx next build
```

- A failure you caused → fix it.
- A failure you believe is pre-existing → prove it:
  `git stash && <command> && git stash pop`. Paste the proof in the PR body.
- Never weaken a check (skip test, eslint-disable, `as any`) to pass the gate.

## Step 6 — Self-review against acceptance criteria

Walk the brief's acceptance criteria one by one. For each: state HOW it was
verified (command output, manual dev-server check, test name). A criterion
you couldn't verify must be listed as such — visibly, not silently.

For UI-touching tasks additionally run the both-themes check from the
`manuscript-ui` skill (§Verification).

## Step 7 — Commit and push

- Imperative summary line ≤72 chars; body = bullet list of concrete changes.
- One logical commit is preferred; more is fine if genuinely separable.
- `git push -u origin <branch>` (retry 2s/4s/8s/16s on network failure only).
- Do NOT open a PR unless asked; if asked, the PR body must contain:
  1. What changed (bullets)
  2. Acceptance criteria → verification evidence table
  3. Grep proof for any deletion ("0 importers: <grep command + output>")
  4. Follow-ups noticed but not done
  5. Anything uncertain, stated plainly

## Step 8 — Report

Final message: outcome first ("W0-3 done: lesson verses now enter SRS review;
all gates pass"), then the criteria/evidence summary, then follow-ups. If
blocked at any step, report exactly what's blocked and what was completed.

## Refusal conditions

Decline (and say why) if the brief requires: localStorage key migration
outside Wave 1; touching Islamic content substance without the quran-content
skill's sourcing; force-push; or spending money. These need owner sign-off
per CLAUDE.md escalation rules.
