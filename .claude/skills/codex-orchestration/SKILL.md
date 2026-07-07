---
name: codex-orchestration
description: Drive OpenAI Codex as the executor for task briefs while Claude acts as planner-reviewer. Use when asked to "run the briefs through Codex", "have Codex execute", or "orchestrate Codex". Codex writes the code and self-reviews; Claude verifies scope, spec-adherence, failure-mode traps, and acceptance evidence before anything is pushed. REQUIRES Codex to be reachable + authenticated (see Preflight) — if it is not, STOP and report; never silently substitute Claude as the executor.
---

# Codex Orchestration

Role split, enforced:
- **Codex** = executor + first-pass reviewer. Writes the diff, runs the gate,
  self-reviews against the brief.
- **Claude** = planner-reviewer. Never writes the feature code. Verifies the
  brief was honored and the codebase's named traps were avoided, then decides
  push / revise / escalate.

## Preflight — do this ONCE before any brief (hard gate)

```
codex --version                                             # CLI present
curl -sS -o /dev/null -w "%{http_code}\n" --max-time 12 \
  https://api.openai.com/v1/models                          # must NOT be 000/403
codex login status                                          # must say logged in
```

If any check fails: **STOP.** Report exactly what's unreachable and the fix
(network policy must allow `api.openai.com`; `OPENAI_API_KEY` set, or
`codex login`). Do NOT execute the briefs as Claude — that defeats the role
split the owner asked for. This is an environment-start dependency: a policy/key
added mid-session does not apply; a fresh session is required.

Auth setup when a key is present but not logged in:
```
codex login --api-key "$OPENAI_API_KEY"
```

## Per-brief loop

Run briefs one at a time unless they are explicitly independent (Wave 0 is —
then use a git worktree per brief so parallel Codex runs don't collide).

### 1. Claude: prepare the execution prompt
Assemble a single self-contained prompt for Codex containing:
- The full brief file (`docs/design/tasks/<ID>.md`).
- A pointer to the spec section it cites and to `CLAUDE.md` (Codex must read
  both from the repo).
- This instruction block:
  > You are the executor. Work ONLY within this brief's scope. Before coding,
  > verify the brief's file:line premise still holds; if it doesn't, stop and
  > report — do not fix anything else. Obey CLAUDE.md's named failure modes and
  > canonical-vs-trap table. Do not rename localStorage keys. Every new external
  > call needs a user-visible failure path. When done, run in order:
  > `npm run type-check && npm run lint && npm test && npx next build` — all must
  > pass; do not weaken a check to make it pass. Then self-review against every
  > acceptance criterion and report criterion → evidence.

### 2. Codex: execute
```
codex exec --full-auto --cd /home/user/quran-oasis "<prompt>"
```
(Use the sandbox/approval flags the owner prefers; `--full-auto` runs
unattended. For a review-before-write posture, drop to the default approval
mode.) Capture Codex's final report.

### 3. Claude: planner review (the value-add — do not skip)
Independently verify, reading the actual diff (`git diff`), NOT just Codex's
word:
- **Scope**: `git diff --stat` — every changed file is implied by the brief.
  Zero drive-by hunks. Flag any file that shouldn't be there.
- **Premise**: confirm Codex verified the brief was still valid (not coding
  against drifted line numbers).
- **Traps**: for each concept the brief touched, check the relevant CLAUDE.md
  failure mode was avoided (e.g. wrote to the canonical store not a trap; no
  bare `auth()`; no `night-*` palette assumption; no swallowed external call;
  no key rename).
- **Gate**: re-run the four commands yourself. Trust but verify.
- **Acceptance**: walk each criterion; confirm Codex's evidence is real
  (run the test, hit the route, inspect localStorage). List any criterion not
  genuinely met.
- **Content/UI**: if the brief touched Islamic content or UI, apply the
  `quran-content` / `manuscript-ui` verification checklists.

Verdict:
- **PASS** → commit (if Codex didn't) with the repo's commit conventions,
  `git push -u origin <brief-branch>`, record the result.
- **REVISE** → send Codex a precise, minimal correction prompt (cite the
  failing criterion / trap), re-run step 2–3. Cap at 2 revise cycles, then
  escalate.
- **ESCALATE** → if the brief's premise was wrong, or it needs owner sign-off
  (key migration, content substance, spend), stop and report per CLAUDE.md.

### 4. Claude: record
Append to the run log (in your report, or `docs/design/tasks/RUN-LOG.md` if the
owner wants it persisted): brief ID, verdict, revise cycles, what you verified,
anything deferred.

## Batch posture for Wave 0

W0-1..W0-8 are independent (README says so). Recommended: a worktree +
branch per brief, Codex runs them concurrently, Claude planner-reviews each as
it lands. Do NOT batch multiple briefs into one Codex run or one PR — one brief
= one PR is absolute (CLAUDE.md).

## After the batch — return to planner review

When the delegated briefs are done, hand back a consolidated planner summary:
which briefs passed, which needed revision and why, which escalated, and the
recommended next wave to cut briefs for. The owner reviews outcomes, not
diffs — your summary is the review surface.

## Never

- Never let Codex rename/migrate localStorage keys outside the Wave-1 module.
- Never accept a Codex diff you haven't read because its report "looked good".
- Never substitute Claude as executor to "just get it done" when Codex is
  down — report the blocker instead.
