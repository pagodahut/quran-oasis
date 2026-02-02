# HIFZ Performance Optimizations

## Summary

Performance optimizations implemented to achieve 90+ Lighthouse scores.

## Optimizations Applied

### 1. ✅ Font Optimization
**Location:** `src/lib/fonts.ts`, `src/app/layout.tsx`, `src/app/globals.css`

- Replaced render-blocking `@import` CSS with Next.js font optimization
- Uses `next/font/google` for automatic font loading
- Fonts preloaded with `preload: true` for Arabic fonts
- `font-display: swap` applied automatically by Next.js
- CSS variables defined for consistent font usage

**Before:**
```css
@import url('https://fonts.googleapis.com/css2?family=Amiri...');
```

**After:**
```typescript
import { Amiri, Noto_Naskh_Arabic } from 'next/font/google';
export const amiri = Amiri({ preload: true, display: 'swap' });
```

### 2. ✅ Image Optimization
**Location:** `next.config.js`, `src/app/profile/page.tsx`

- Enabled Next.js image optimization (removed `unoptimized: true`)
- Added AVIF and WebP format support
- Fixed `<img>` tags to use `<Image>` component with proper dimensions
- Avatar images use `priority` prop for LCP optimization

**Before:**
```jsx
<img src={avatarUrl} alt={displayName} />
```

**After:**
```jsx
<Image src={avatarUrl} alt={displayName} width={80} height={80} priority />
```

### 3. ✅ JavaScript Optimization
**Location:** `src/components/dynamic.tsx`, `src/components/LazyMotion.tsx`

- Created dynamic import wrappers for heavy components
- Lazy load: JourneyMap, Celebrations, AudioPlayer, TafsirDrawer, WordByWord, etc.
- Created `LazyMotion` component using framer-motion's `domAnimation` features
- SSR disabled for client-only components to reduce server bundle

**Available dynamic components:**
- `DynamicJourneyMap`
- `DynamicCelebrationOverlay`
- `DynamicStreakDisplay`
- `DynamicGoalProgressRing`
- `DynamicAudioPlayer`
- `DynamicTafsirDrawer`
- `DynamicQuranSearch`
- `DynamicWordByWord`
- `DynamicMemorizationPractice`
- `DynamicPageTransition`

### 4. ✅ Caching Headers
**Location:** `next.config.js`

Headers configured:
| Asset Type | Cache Duration |
|------------|----------------|
| Icons, Audio | 1 year (immutable) |
| Static chunks | 1 year (immutable) |
| API routes | 60s + stale-while-revalidate |
| HTML pages | 60s + 10min stale |
| Service worker | No cache (must-revalidate) |
| Manifest | 24 hours |

### 5. ✅ Audio Preloading
**Location:** `src/lib/audioPreload.ts`

- Created audio preloading utility with LRU cache (10 items)
- `preloadNextAyahs()` - Preload upcoming ayahs
- `preloadAudioWhenIdle()` - Use requestIdleCallback for low-priority loading
- `preloadAyahRange()` - Preload a full range of ayahs

### 6. ✅ Security Headers
**Location:** `next.config.js`

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### 7. ✅ Build Optimization
**Location:** `next.config.js`

- Console logs removed in production
- Image formats: AVIF, WebP
- Device-specific image sizes configured

## Bundle Analysis

Current static bundle: **7.0MB total**

Largest chunks:
| Size | Likely Content |
|------|----------------|
| 4.2MB | Lesson content data |
| 308KB | React/Framework |
| 220KB | Framer Motion |
| 124KB | Page components |

**Recommendation:** The 4.2MB chunk contains lesson content. Consider:
1. Moving lesson content to API/database
2. Lazy loading lessons on-demand
3. Code-splitting lesson data by curriculum level

## Core Web Vitals Targets

| Metric | Target | Status |
|--------|--------|--------|
| LCP | < 2.5s | ✅ Font preloading, image priority |
| FID | < 100ms | ✅ Dynamic imports reduce main thread |
| CLS | < 0.1 | ✅ Image dimensions, font-display: swap |

## Usage Examples

### Using Dynamic Components
```tsx
import { DynamicAudioPlayer, DynamicWordByWord } from '@/components/dynamic';

// These load only when rendered
<DynamicAudioPlayer surah={1} ayah={1} />
<DynamicWordByWord surah={1} ayah={1} />
```

### Using Audio Preloading
```tsx
import { preloadNextAyahs, preloadAudioWhenIdle } from '@/lib/audioPreload';

// Preload next 3 ayahs
await preloadNextAyahs(surah, currentAyah, 'alafasy', 3);

// Preload during idle time
preloadAudioWhenIdle(surah, ayah, 'alafasy');
```

### Using LazyMotion
```tsx
import { MotionProvider, motion } from '@/components/LazyMotion';

// Wrap your app or component tree
<MotionProvider>
  <motion.div animate={{ opacity: 1 }}>...</motion.div>
</MotionProvider>
```

## Files Modified

- `src/lib/fonts.ts` (new)
- `src/lib/audioPreload.ts` (new)
- `src/components/LazyMotion.tsx` (new)
- `src/components/dynamic.tsx` (new)
- `src/app/layout.tsx` (updated)
- `src/app/globals.css` (updated - removed @import)
- `src/app/profile/page.tsx` (updated - Image component)
- `src/app/twitter-image.tsx` (updated - fix for Turbopack)
- `next.config.js` (updated)

## Lighthouse Testing

Run Lighthouse in production mode:
```bash
npm run build
npm start

# In another terminal
npx lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

## Further Optimizations (Future)

1. **Code Splitting Lesson Content:** Move the 4.2MB lesson data to:
   - Server-side with ISR
   - Lazy-loaded chunks by level (beginner/intermediate/advanced)
   
2. **Service Worker Enhancements:**
   - Pre-cache critical assets
   - Background sync for offline lessons
   
3. **Bundle Analyzer:**
   ```bash
   ANALYZE=true npm run build
   ```
   Add @next/bundle-analyzer for visual analysis

4. **Edge Caching:**
   - Deploy to Vercel for edge caching
   - Use stale-while-revalidate for API routes
