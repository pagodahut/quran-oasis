# HIFZ Design System — Liquid Glass

## Core Principles
This app uses a **dark luxury / liquid glass** aesthetic. Every UI element must follow these rules.

## Backgrounds
- **Never** use solid flat backgrounds for cards or containers
- Base screens: dark tones (navy/charcoal `night-950`) with softly blurred color orbs for depth
- Use existing `liquid-glass`, `liquid-glass-gold`, `liquid-glass-strong` Tailwind utilities

## Glass Cards & Containers
All cards, modals, bottom sheets, and floating elements:
```css
backdrop-blur-xl bg-white/[0.06]  /* frosted glass, never solid */
border border-white/[0.15]        /* 1px glass edge */
shadow-[0_8px_32px_rgba(0,0,0,0.25)]  /* soft depth shadow */
rounded-2xl                       /* consistent corner radius */
```

## Borders
- Every glass card must have a subtle white border: `border border-white/[0.12-0.20]`
- For gold-accented elements: `border border-gold-500/[0.20-0.30]`

## Typography
- White text with variable opacity:
  - Headers: `text-white/90` or `text-night-100`
  - Body: `text-white/70` or `text-night-300`
  - Subtitles/captions: `text-white/50` or `text-night-500`
- Accent text: `text-gold-400` for important labels
- Never use gray text on glass — use white with reduced opacity

## Buttons
- Primary: Gold gradient with glass overlay
- Secondary: Glass with white border
- FABs: Glass circle with subtle glow, never solid backgrounds

## Toasts & Notifications
- Must use glass treatment: `backdrop-blur-lg bg-night-900/80 border border-white/10`
- Never solid green/red/blue — use glass with a subtle color tint

## Spacing
- Consistent safe-area handling: `safe-area-inset + 0.5rem` max
- No double-padding between safe area and content padding
- Tight, space-efficient layouts

## Color Palette
- Background: `night-950` (#0a0a0f)
- Glass: `white/5-10%` on dark
- Gold accent: `gold-400` (#d4a843), `gold-500` (#c4982f)
- Sage (secondary): `sage-400`, `sage-700`
- Text: white at variable opacities
