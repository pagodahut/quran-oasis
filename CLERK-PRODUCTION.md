# Clerk Production Keys — Action Required

## Current State

`.env.local` uses **development/test keys**:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."   ← DEV ONLY
CLERK_SECRET_KEY="sk_test_..."                    ← DEV ONLY
```

These keys display the **"Development mode"** banner and are only valid on `localhost` / development domains. They **must not** be deployed to production.

## How to Fix

### Step 1: Get production keys from Clerk Dashboard

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your **HIFZ** application
3. Go to **API Keys** (top-level sidebar)
4. Switch the environment toggle from **Development** → **Production**
5. Copy the production keys:
   - `Publishable key` → starts with `pk_live_...`
   - `Secret key` → starts with `sk_live_...`

### Step 2: Configure production environment

**Option A — Vercel (recommended for this project):**

1. Go to [https://vercel.com/naimuls-projects/quran-oasis/settings/environment-variables](https://vercel.com/naimuls-projects/quran-oasis/settings/environment-variables)
2. Add/update for **Production** environment:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` = `pk_live_...`
   - `CLERK_SECRET_KEY` = `sk_live_...`
3. Redeploy

**Option B — `.env.production` file (for self-hosted):**

Create `/Users/admin/quran-oasis/.env.production` (see `.env.production.template`):
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_live_YOUR_KEY_HERE
```

> ⚠️ Never commit `.env.production` to git — it contains secrets.

### Step 3: Configure allowed domains in Clerk

In the Clerk Dashboard (Production environment):
- Add your production domain: `gethifz.com` (or wherever deployed)
- Configure redirect URLs as needed

## Key Format Reference

| Environment | Publishable Key Prefix | Secret Key Prefix |
|-------------|------------------------|-------------------|
| Development | `pk_test_`             | `sk_test_`        |
| Production  | `pk_live_`             | `sk_live_`        |

## Impact of NOT fixing this

- "Development mode" warning badge shown to all users
- Clerk auth may be restricted to localhost only
- Some Clerk features are disabled in development mode
