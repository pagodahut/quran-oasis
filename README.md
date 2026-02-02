# HIFZ 📖✨

AI-powered Quran memorization app with personalized lessons, real-time tajweed feedback, and the traditional 10-3 method.

![HIFZ Logo](public/icons/icon-192x192.png)

## ✨ Features

### 🎯 Learning
- **Structured Curriculum** - Beginner → Intermediate → Advanced paths
- **10-3 Method** - Time-tested memorization technique from Tahfiz schools
- **Real Reciter Audio** - Mishary Rashid Alafasy + 4 more reciters via EveryAyah.com
- **Memorization Modules** - Practice mode with listen → read → memorize flow

### 🎤 Real-Time Tajweed (Premium)
- **Deepgram Integration** - Live speech-to-text with word timestamps
- **Word Tracking** - Visual highlighting as you recite
- **AI Feedback** - Claude-powered analysis of pronunciation and tajweed rules
- **7 Tajweed Rules** - Idgham, Ikhfa, Iqlab, Izhar, Madd, Qalqalah, Ghunnah

### 📊 Progress
- **Streak Tracking** - Daily learning streaks with milestones
- **Progress Visualization** - Verses, surahs, juz completion
- **XP System** - Earn points for lessons and practice
- **Celebration Moments** - Confetti on completions

### 🔐 Authentication
- **Clerk Integration** - Sign in with Google, Apple, or email
- **Cloud Sync** - Progress saved across devices
- **Guest Mode** - Use without signing in (localStorage)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/pagodahut/quran-oasis.git
cd quran-oasis

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

### Environment Variables

Create `.env.local` with:

```env
# Clerk Authentication (required for auth features, app works without)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# Deepgram - Real-time speech recognition (optional, for tajweed)
# Get free credits at https://console.deepgram.com
NEXT_PUBLIC_DEEPGRAM_API_KEY=...

# Anthropic - Claude AI for tajweed analysis (optional)
# Get key at https://console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-...

# Site URL (required for production)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CLERK_*` | No | Authentication (app works in guest mode without) |
| `CLERK_SECRET_KEY` | No | Server-side Clerk auth |
| `NEXT_PUBLIC_DEEPGRAM_API_KEY` | No | Real-time tajweed feedback |
| `ANTHROPIC_API_KEY` | No | AI-powered tajweed analysis |
| `NEXT_PUBLIC_SITE_URL` | Prod | Canonical URL for SEO |

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Auth | Clerk |
| Database | Prisma + SQLite (local) |
| Speech | Deepgram Nova-3 |
| AI | Claude (Anthropic) |
| Audio | EveryAyah.com API |

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── api/               # API routes
│   │   ├── tajweed/       # Tajweed analysis endpoint
│   │   └── user/          # User sync endpoint
│   ├── lessons/           # Lesson browser + detail
│   ├── mushaf/            # Quran reader
│   ├── onboarding/        # Welcome flow
│   ├── practice/          # Practice mode
│   ├── profile/           # User profile
│   └── progress/          # Progress visualization
├── components/
│   ├── brand/             # Logo and brand assets
│   ├── AudioPlayer.tsx    # Quran audio player
│   ├── BottomNav.tsx      # Mobile navigation
│   ├── MemorizationPractice.tsx  # 10-3 method UI
│   ├── TajweedPractice.tsx       # Tajweed recording
│   └── WordTracker.tsx    # Real-time word highlighting
├── hooks/
│   └── useRealtimeTajweed.ts     # Deepgram hook
└── lib/
    ├── lesson-content.ts          # Beginner lessons
    ├── intermediate-lessons.ts    # Intermediate lessons
    ├── advanced-lessons.ts        # Advanced lessons
    ├── quranAudioService.ts       # Audio playback
    ├── realtimeTajweedService.ts  # Deepgram service
    └── motivationStore.ts         # Streaks & progress
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Set environment variables in Vercel dashboard:
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_DEEPGRAM_API_KEY` (optional)
- `ANTHROPIC_API_KEY` (optional)

### Docker

```bash
# Build
docker build -t hifz .

# Run
docker run -p 3000:3000 --env-file .env.local hifz
```

### Self-Hosted

```bash
# Build for production
npm run build

# Start production server
npm start
```

The app runs on port 3000 by default. Use a reverse proxy (nginx, Caddy) for SSL.

## 📖 Documentation

- [Tajweed Architecture](docs/TAJWEED_ARCHITECTURE.md) - Real-time tajweed system design
- [Real-time Integration](docs/REALTIME_TAJWEED_INTEGRATION.md) - Deepgram setup guide
- [UI/UX Changes](UI_UX_CHANGES.md) - Recent design updates

## 🎨 Brand

View all logo concepts at `/brand` route in the app.

The logo is a minimal gold open book on dark background - simple, iconic, and instantly recognizable.

## 📱 PWA

HIFZ is a Progressive Web App:
- Install on iOS/Android home screen
- Offline support for cached content
- Native app-like experience

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [EveryAyah.com](https://everyayah.com) - Quran audio
- [Tarteel AI](https://tarteel.ai) - Inspiration for real-time features
- [Clerk](https://clerk.com) - Authentication
- [Deepgram](https://deepgram.com) - Speech recognition

---

**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**

*"The best among you are those who learn the Quran and teach it."*
— Prophet Muhammad ﷺ (Bukhari)
