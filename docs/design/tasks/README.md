# Delegatable Task Briefs

Self-contained task briefs for delegating implementation to an external coding
agent (OpenAI Codex, another Claude Code session, or a human contributor).
Each brief is a complete prompt: paste the whole file into the agent, or file
it as a GitHub issue for an agent integration to pick up.

Ground rules for any agent executing these:

- Read the referenced spec section in `docs/design/` before writing code — the
  briefs summarize, the specs decide.
- One brief = one PR. Do not batch briefs into a single PR.
- Every PR must pass: `npm run type-check`, `npm run lint`, `npm test`,
  `npx next build`.
- Do not rename localStorage keys or change store shapes unless the brief says
  so — key migration is owned exclusively by Wave 1 (spec 01 §C).
- Match existing code style; no drive-by refactors outside the brief's scope.

## Wave 0 (independent — safe to run in parallel)

| Brief | Title | Spec |
|-------|-------|------|
| [W0-1](./W0-1-tarteel-honesty.md) | Tarteel health honesty + circuit breaker | 04 §A |
| [W0-2](./W0-2-reciter-split-brain.md) | Fix reciter split-brain | 01 §A, PR3 |
| [W0-3](./W0-3-lesson-srs-write.md) | Lesson-memorized verses enter review | 01 §B |
| [W0-4](./W0-4-one-streak.md) | One streak source on profile | 01 §A |
| [W0-5](./W0-5-prisma-version.md) | Fix Prisma adapter/client mismatch | 04 §F |
| [W0-6](./W0-6-optional-auth.md) | optionalAuth() across API routes | 04 §C |
| [W0-7](./W0-7-health-route.md) | Real /api/health route | 04 §E |
| [W0-8](./W0-8-delete-placebos.md) | Delete fake AgentPanel + offline-model placebo | 04 §A.7 |

## Later waves

Waves 1–4 are sequenced (see [ROADMAP](../ROADMAP.md) dependency graph) and
should be delegated one PR at a time from the execution orders in specs
01/02/03/04 — not in parallel. Wave 1 PR briefs should be cut only after
Wave 0 merges.
