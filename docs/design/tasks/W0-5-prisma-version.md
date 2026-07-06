# W0-5: Fix Prisma adapter/client major-version mismatch

**Spec:** `docs/design/04-INTEGRATIONS.md` §F. Read it first.
**Branch:** `fix/prisma-adapter-version`. One PR.

## Problem

`package.json` pins `@prisma/adapter-libsql ^7.4.0` against
`@prisma/client ^6.19.2` and `prisma ^6.x` — a major-version mismatch that can
break the Turso (libSQL) driver adapter at runtime in production.
`src/lib/prisma.ts:2` also imports the adapter class with suspicious casing
(`PrismaLibSql` vs the documented `PrismaLibSQL` in the v6 line).

## Changes

1. Align the adapter to the client's major: set `@prisma/adapter-libsql` to the
   latest 6.x matching `@prisma/client` (e.g. `^6.19.2`), run `npm install`,
   commit the lockfile.
2. Fix the import/usage in `src/lib/prisma.ts` to the exact export name the
   installed adapter version provides (check
   `node_modules/@prisma/adapter-libsql/dist/index.d.ts`), and align the
   constructor signature with that version's API (v6 takes a libSQL client
   instance; verify against the installed types rather than assuming).
3. Verify the Turso-vs-SQLite selection logic still holds: Turso only when both
   `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set; plain SQLite via
   `DATABASE_URL` otherwise. Add a clear thrown error message at client
   construction when neither configuration is complete.

## Acceptance criteria

- `npx prisma generate` succeeds; `npx tsc --noEmit` passes.
- With no Turso env vars and a local `DATABASE_URL`, `npx next build` passes
  and a dev-server hit to `/api/user/sync` (signed out) does not crash with an
  adapter/import error (auth errors are fine — that's W0-6's scope).
- `npm run lint && npm test` pass.
