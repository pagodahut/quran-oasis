# Clerk Production Setup Guide

## Current State
- Clerk is in **Development/Test mode**
- App is deployed on Vercel: project `quran-oasis-git`, team `naimuls-projects`
- Clerk env vars are NOT in `.env.local` — only on Vercel (if at all)

## Steps to Go Production

### 1. Switch Clerk to Production
1. Go to [clerk.com/dashboard](https://clerk.com/dashboard)
2. Select the HIFZ / Quran Oasis app
3. Go to **Settings → Instance** and switch from Development to **Production**
4. Copy the new production keys:
   - `pk_live_...` (Publishable Key)
   - `sk_live_...` (Secret Key)

### 2. Set Environment Variables on Vercel
```bash
# From the project directory:
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY   # paste pk_live_...
vercel env add CLERK_SECRET_KEY                     # paste sk_live_...
```
Set for **Production** (and optionally Preview/Development).

### 3. Database — SQLite Won't Work on Vercel Serverless
SQLite (`file:./dev.db`) only works locally. For production, migrate to one of:

- **Turso** (SQLite-compatible, recommended): `libsql://your-db.turso.io`
- **Neon** (PostgreSQL): change `provider = "postgresql"` in schema.prisma
- **PlanetScale** (MySQL): change `provider = "mysql"` in schema.prisma

Set `DATABASE_URL` on Vercel for your chosen provider:
```bash
vercel env add DATABASE_URL   # paste the production connection string
```

### 4. Redeploy
```bash
vercel --prod
```

### 5. Local Development
For local dev, `.env.local` should have:
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...   # dev key from Clerk dashboard
CLERK_SECRET_KEY=sk_test_...                     # dev key from Clerk dashboard
```

## Verifying
- Visit your production URL → sign-in should work
- Check `/api/user/sync` returns user data (not 401)
- Confirm progress syncs between devices when signed in
