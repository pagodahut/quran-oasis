# Quran Oasis - Design Overhaul Plan

## Immediate Fixes (Priority 1)
- [ ] Fix audio regression (letters saying "hamza fawq alif")
- [ ] Fix markdown rendering (`**tip:**` showing as raw text)
- [ ] Fix spacing/overlap issues in letter display

## Auth Setup (Priority 2)
- [ ] Install Clerk (`@clerk/nextjs`)
- [ ] Add ClerkProvider to layout
- [ ] Create middleware for auth
- [ ] Connect bookmark functionality to user accounts

## Design System Overhaul (Priority 3)

### Research Phase
- [ ] Study Islamic manuscript illumination styles
- [ ] Analyze trending designs on Landbook/Dribbble (last 30 days)
- [ ] Research Islamic geometric patterns that work for UI
- [ ] Study successful Quran/Islamic apps (Tarteel, Quran.com, Muslim Pro)

### Design Principles
1. **Clean for learning** - Not distracting, focused content areas
2. **Islamic aesthetic** - Illumination-inspired, calligraphic accents
3. **Liquid glass depth** - Better differentiation with textures/patterns
4. **Spiritual engagement** - Colors and typography that inspire

### Specific Improvements

#### Homepage
- [ ] Hero section with Islamic geometric pattern overlay
- [ ] Animated Bismillah with illumination-style frame
- [ ] Better visual hierarchy with gold accents
- [ ] Floating particles with Islamic star shapes
- [ ] Background texture (subtle arabesque pattern)

#### Glass Elements Enhancement
- [ ] Add subtle noise/grain texture to glass surfaces
- [ ] Implement layered glass with color tinting
- [ ] Create depth with multiple glass layers
- [ ] Add shimmer effects inspired by manuscript gold leaf

#### Typography
- [ ] Custom Arabic display font for headers
- [ ] Better font pairing (Arabic + Latin)
- [ ] Gold gradient text for important elements
- [ ] Proper Quranic text styling (Uthmani script)

#### Color Refinement
- [ ] Deep midnight blue backgrounds with warmth
- [ ] Richer gold tones (manuscript gold leaf inspired)
- [ ] Sage/emerald accents for Islamic feel
- [ ] Subtle warm undertones throughout

#### Textures & Patterns
- [ ] Arabesque pattern overlay (very subtle)
- [ ] Islamic geometric patterns for section dividers
- [ ] Illumination-style borders for special content
- [ ] Noise texture for glass depth

#### Micro-interactions
- [ ] Page transitions with fade/slide
- [ ] Button hover states with subtle glow
- [ ] Card hover with gentle lift + shadow
- [ ] Loading states with Islamic patterns

## Implementation Order
1. Fix immediate bugs (audio, markdown, spacing)
2. Install Clerk auth
3. Research and create mood board
4. Implement texture/pattern system
5. Refine homepage
6. Update component library
7. Polish all pages

## Sub-agent Tasks
- **Design Research Agent**: Analyze Landbook/Dribbble trends, Islamic art references
- **Implementation Agent**: Apply design changes across components
- **QA Agent**: Test all interactions and responsive behavior
