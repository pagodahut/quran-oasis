# Quran Oasis — AI-Powered Quran Memorization App

**Status:** 🚧 Active Development (Claude leading)  
**Owner:** Naimul Huq  
**Started:** 2026-01-29  
**Platform:** Mobile-first web app (PWA), future native apps

## Vision

The best app in the world for memorizing the Quran. Takes someone from zero Arabic knowledge to full Hifz certification using:
- AI-powered personalized learning paths
- Spaced repetition (SM-2 algorithm)
- Interactive lessons with audio
- Progress tracking and gamification

## Target Users
- Adult Muslims worldwide
- Zero to advanced Arabic readers
- Goal: Full Quran memorization (Hifz)

## Tech Stack (from Manus build)
- **Frontend:** Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend:** tRPC API (20+ endpoints)
- **Database:** Prisma + SQLite (can migrate to Postgres)
- **Audio:** EveryAyah.com streaming
- **Auth:** Social login (Google/Apple via Manus OAuth for now)

## Core Features (V1)

### 1. Onboarding Flow
- 5-step personalization (Arabic level, experience, goals, time, reciter)
- Audio preview for reciter selection
- Generates custom lesson plan

### 2. Mushaf Reader
- Full Quran (114 surahs, 6,236 verses)
- Audio playback via EveryAyah.com
- 5 reciters: Al-Husary, Mishary Alafasy, Abdul Rahman Al-Sudais, Abdul Basit, Saad Al-Ghamadi
- Translation display (Asad & Sahih International)
- Bookmarks with notes

### 3. Memorization System
- Spaced repetition with SM-2 algorithm
- 7 review intervals (1, 2, 4, 7, 14, 30, 60 days)
- 70% review / 30% new material ratio
- Confidence tracking

### 4. Interactive Lessons
- Beginner: Arabic alphabet, pronunciation, Al-Fatiha
- Techniques: 10-3 method, 20-20 method, stacking
- Word-by-word breakdowns
- Audio practice with repeat modes (1x, 3x, 5x, 10x, infinite)

### 5. Progress Tracking
- Daily streaks
- Achievement system
- Detailed stats and analytics

## Database Schema (9 tables)
- Users & preferences
- Onboarding data
- Study plans
- Memorization progress
- Bookmarks
- Daily activity
- Achievements

## Memorization Techniques (from research)
1. **Takrār (Repetition)** — Traditional method
2. **10-3 Method** — Read 10 times looking, 3 times from memory
3. **20-20 Method** — 20 reps looking, 20 from memory
4. **Stacking** — Add verses incrementally
5. **Spaced Repetition** — Scientific review intervals
6. **Active Recall** — Testing > passive reading

## V2 Features (Future)
- Pronunciation analysis with AI
- Community features
- Certification system
- Subscription model

## Files to Import from Manus
- package.json
- prisma/schema.prisma
- src/pages/*.tsx (index, Mushaf, Lessons, Practice, Progress)
- src/server/api/routers/*.ts
- src/lib/*.ts (lessonPlanner, spacedRepetition, etc.)
- src/components/*.tsx
- src/data/quran.ts
