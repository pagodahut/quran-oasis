# HIFZ Brand & Logo

## The Logo: Open Quran

The HIFZ logo is an **ultra-simple open book silhouette** representing the Quran.

### Design Philosophy

**Simplicity over complexity.** The previous logo combined an 8-pointed star (octagram), a stylized Arabic ح, center circles, and corner dots. At small sizes, the ح looked like a question mark, and the complexity became visual noise.

The new logo follows Apple's design philosophy: **one iconic shape that's instantly recognizable**.

### Visual Elements

```
┌─────────────────────────────────┐
│                                 │
│      ╭───╮           ╭───╮      │
│     │     \         /     │     │
│     │      \       /      │     │
│     │       │     │       │     │
│     │       │     │       │     │
│     │      /       \      │     │
│      ╰───╯           ╰───╯      │
│                                 │
│         Open Quran Book         │
└─────────────────────────────────┘
```

1. **Dark circular background** - Night theme (#0f1419 to #1a1f25)
2. **Gold open book shape** - Premium gilded manuscript feel
3. **Dark spine** - Separates left and right pages

### Color Palette

| Element | Color | Hex |
|---------|-------|-----|
| Gold Light | Pale Gold | #f4d47c |
| Gold Primary | Rich Gold | #c9a227 |
| Gold Dark | Deep Gold | #8b6914 |
| Night Light | Slate | #1a1f25 |
| Night Dark | Ink | #0f1419 |

### Why This Works

1. **Works at ALL sizes** - Even a 16px favicon is recognizable
2. **Instant meaning** - An open book = reading/learning/Quran
3. **Memorable** - Simple shapes stick in memory
4. **Distinctive** - Not another generic star or crescent
5. **Contextual meaning** - Gold color + app context = Quran

### Usage

```tsx
import { HifzIcon, HifzLogo, HifzIconSimple } from '@/components/brand';

// App icon (main logo)
<HifzIcon size={48} />

// Full logo with wordmark
<HifzLogo variant="horizontal" />

// Small contexts (nav, tabs)
<HifzIconSimple size={24} />
```

### Files

- `HifzLogo.tsx` - React components
- `public/icon.svg` - Source SVG for icons
- `public/icons/` - Generated PNG icons (72-512px)
- `public/favicon.png` - 32px favicon
- `public/apple-touch-icon.png` - 180px iOS icon

### Alternative Concepts

During the redesign, 6 concepts were explored (see `/concepts/`):

1. Open Quran + crescent
2. Bold Arabic ح (Ha)
3. Crescent-book hybrid
4. Radiant Quran (book + light rays)
5. Hifz Shield (protective shape)
6. **Minimal Quran** ← CHOSEN

The Minimal Quran concept won due to maximum simplicity and size flexibility.

### Regenerating Icons

```bash
node scripts/generate-icons.js
```

This generates all PNG icons from `public/icon.svg`.
