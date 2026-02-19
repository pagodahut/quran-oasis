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

### 3. Database — Turso (libSQL) for Production

The app uses **Turso** (libSQL) for production. The Prisma client auto-detects:
- If `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` are set → uses libSQL adapter (production)
- Otherwise → uses local SQLite `file:./dev.db` (development)

#### Quick Setup
Run the helper script:
```bash
./scripts/setup-turso.sh
```

#### Manual Setup
```bash
# Install Turso CLI
brew install tursodatabase/tap/turso

# Login & create database
turso auth login
turso db create hifz-quran

# Get credentials
turso db show hifz-quran --url     # → libsql://hifz-quran-<username>.turso.io
turso db tokens create hifz-quran  # → eyJ...
```

#### Set on Vercel
```bash
vercel env add TURSO_DATABASE_URL    # libsql://hifz-quran-<username>.turso.io
vercel env add TURSO_AUTH_TOKEN      # the token from above
vercel env add DATABASE_URL          # same as TURSO_DATABASE_URL (for Prisma migrations)
```

#### Push Schema to Turso
```bash
npx prisma generate
DATABASE_URL="libsql://hifz-quran-<username>.turso.io?authToken=<token>" npx prisma db push
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
