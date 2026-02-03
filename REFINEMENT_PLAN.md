# HIFZ Lesson Refinement Plan
*Started: Feb 3, 2026*

## Vision
Make it possible to become a hafiz on your own, without a Quran teacher.

## Target User
Everyone who wants to learn Quran — from casual readers to serious hafiz-track students. Show everyone a path to memorization.

---

## Workstreams

### 1. Practice Drills Enhancement
**Goal:** 4:1 explanation:practice ratio → 2:1
- [ ] Add vocabulary flashcard steps after each vocab lesson
- [ ] Add tajweed rule identification quizzes with examples
- [ ] Add "complete the ayah" exercises for memorization lessons
- [ ] Add root word recognition drills
- [ ] Add timed review challenges

### 2. Audio Integration
**Goal:** Every lesson has audio, every ayah is playable
- [ ] Add audioUrl to all lesson steps with Quranic content
- [ ] Create "listen and repeat" step type
- [ ] Add reciter selection (multiple qaris)
- [ ] Integrate with existing Quran.com/EveryAyah APIs

### 3. Memorization Flow System
**Goal:** Implement proven hifz methodology in-app
- [ ] Create Sabaq (new lesson) guided flow
- [ ] Create Sabqi (recent review) system
- [ ] Create Manzil (old revision) scheduling
- [ ] Implement 10-3 method as interactive exercise
- [ ] Implement stacking/chaining method
- [ ] Add "page method" for structured memorization

### 4. Visual Tajweed System
**Goal:** Make tajweed rules visual and intuitive
- [ ] Create TajweedHighlight component (color-coded rules)
- [ ] Add makharij (articulation point) diagrams
- [ ] Create rule application flowcharts
- [ ] Add visual comparison for similar sounds

### 5. Lesson Structure Optimization
**Goal:** Better pacing, clearer progression
- [ ] Split lessons >25 min into parts
- [ ] Add progress checkpoints within lessons
- [ ] Create unit review/consolidation lessons
- [ ] Add "mastery gates" before advancing

---

## Priority Order
1. Memorization Flow (core differentiator)
2. Practice Drills (engagement)
3. Audio Integration (essential for Quran learning)
4. Lesson Structure (UX improvement)
5. Visual Tajweed (polish)

---

## Files to Modify/Create
- `src/lib/intermediate-lessons.ts` — Add exercises, audio refs
- `src/lib/advanced-lessons.ts` — Add exercises, audio refs
- `src/lib/memorization-flow.ts` — NEW: Sabaq/Sabqi/Manzil system
- `src/lib/practice-drills.ts` — NEW: Drill generators
- `src/components/TajweedHighlight.tsx` — NEW: Visual tajweed
- `src/components/MemorizationExercise.tsx` — NEW: Interactive memorization
- `src/components/AudioPlayer.tsx` — Enhanced audio with repeat modes
