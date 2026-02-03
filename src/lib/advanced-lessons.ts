/**
 * Quran Oasis - Advanced Lesson Content
 * For users with significant memorization experience
 * 
 * Focus areas:
 * - Longer surah memorization techniques
 * - Mutashabihat (similar verses) identification
 * - Advanced tajweed (madd, qalqalah, idgham)
 * - Revision strategies for large portions
 * 
 * Audio Integration:
 * - EveryAyah.com: https://everyayah.com/data/{reciter_folder}/{surah:03d}{ayah:03d}.mp3
 * - Default reciter: Alafasy_128kbps (Mishary Rashid Alafasy)
 * - For tajweed learning, consider: Husary_Muallim (teaching mode)
 */

import type { Lesson, AudioConfig, ListenRepeatConfig } from './lesson-content';

/** Helper to create audio config for steps */
function audio(surah: number, ayahStart: number, ayahEnd?: number, options?: Partial<AudioConfig>): AudioConfig {
  return {
    surah,
    ayahStart,
    ayahEnd: ayahEnd ?? ayahStart,
    reciterId: options?.reciterId ?? 'alafasy',
    repeat: options?.repeat ?? 1,
    loopAyah: options?.loopAyah ?? false,
    pauseBetweenAyahs: options?.pauseBetweenAyahs ?? 500,
    playbackRate: options?.playbackRate ?? 1,
  };
}

/** Helper to create listen-repeat config for memorization steps */
function listenRepeat(surah: number, ayahStart: number, ayahEnd?: number, repeatCount: number = 3): ListenRepeatConfig {
  return {
    surah,
    ayahStart,
    ayahEnd: ayahEnd ?? ayahStart,
    reciterId: 'alafasy',
    mode: 'listen-repeat',
    repeatCount,
    showTransliteration: true,
    showTranslation: true,
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 9: ADVANCED TAJWEED (Lessons 29-31)
 * Master the subtleties of Quranic recitation
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_9_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 29: Qalqalah - The Echo
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-1",
    unit: 9,
    unitTitle: "Advanced Tajweed",
    path: "advanced",
    number: 29,
    title: "Qalqalah - The Echo Letters",
    description: "Master the bouncing/echoing sound of the Qalqalah letters",
    surah: 112,
    ayahStart: 1,
    ayahEnd: 4,
    estimatedMinutes: 30,
    xpReward: 150,
    steps: [
      {
        id: "adv1-intro",
        type: "instruction",
        title: "What is Qalqalah?",
        content: `**Qalqalah (قَلْقَلَة)** means "to shake" or "to disturb."

In tajweed, it refers to the slight bouncing or echoing sound made when certain letters have sukoon.

**The 5 Qalqalah Letters:**
**ق ط ب ج د**

**Memory phrase:** "قُطْبُ جَدّ" (Qutbu Jadd - "The grandfather's pole")

**Why do these letters echo?**
These letters are:
1. **Shaddah/strong consonants** (not soft/flowing)
2. When they have sukoon (no vowel), they can't flow smoothly
3. So they "bounce" or "echo" slightly when released

**Two levels of Qalqalah:**
1. **Small (صُغْرَى)** - when the letter is in the middle of a word
2. **Large (كُبْرَى)** - when the letter is at the END of a word (during a stop)

Let's explore each!`
      },
      {
        id: "adv1-letters",
        type: "explanation",
        title: "The Five Letters Explained",
        arabicContent: "ق ط ب ج د",
        content: `**Let's understand each Qalqalah letter:**

**ق (Qaf)** - The deep 'k' from the back of the throat
- Example: "اقْرَأْ" (iqra') - the Qaf bounces slightly
- At end: "الْفَلَقْ" (al-falaq) - stronger bounce

**ط (Ta)** - The emphatic 't'
- Example: "مُطْمَئِنَّةً" (mutma'innah) - slight bounce
- At end: "أَحَدْ" when stopping contains... wait, that's Dal!

**ب (Ba)** - The 'b' sound
- Example: "يَكْسِبُونَ" (yaksiboon) - in middle
- At end: "تَبَّ" (tabb) - when stopping

**ج (Jeem)** - The 'j' sound
- Example: "يَجْعَلُونَ" (yaj'aloon) - slight bounce
- At end: "وَالْفَجْرِ" when stopping with sukoon

**د (Dal)** - The 'd' sound
- Example: "قَدْ" (qad) - common word!
- At end: "أَحَدٌ" (ahad) - prominent bounce when stopping

**Key insight:** These letters share a quality called "جَهْر" (voiced) and "شِدَّة" (stopping) which creates the echo.`
      },
      {
        id: "adv1-small-qalqalah",
        type: "explanation",
        title: "Small Qalqalah (قَلْقَلَة صُغْرَى)",
        arabicContent: "يَجْعَلُونَ",
        content: `**Small Qalqalah** - When the letter is in the MIDDLE of a word or phrase.

**Characteristics:**
- Subtle bounce
- Lighter echo
- Continues smoothly to next sound

**Examples:**

**ق in middle:** "يَقْتُلُونَ" (yaqtuloon) - slight bounce on Qaf before moving to Ta
**ط in middle:** "يَطْمَعُونَ" (yatma'oon) - slight bounce before 'Ayn
**ب in middle:** "يَبْتَغُونَ" (yabtaghoon) - slight bounce before Ta
**ج in middle:** "يَجْعَلُونَ" (yaj'aloon) - slight bounce before 'Ayn
**د in middle:** "يَدْخُلُونَ" (yadkhuloon) - slight bounce before Kha

**Practice:**
Read "أَقْرَبُ" (aqrabu) - Feel the slight bounce on the Qaf, but don't exaggerate!

**Common mistake:** Making the echo too strong. Small qalqalah is SUBTLE - just a tiny bounce.`
      },
      {
        id: "adv1-large-qalqalah",
        type: "explanation",
        title: "Large Qalqalah (قَلْقَلَة كُبْرَى)",
        arabicContent: "الْفَلَقْ",
        content: `**Large Qalqalah** - When the letter is at the END of a word and you STOP on it.

**Characteristics:**
- More pronounced bounce
- Clear echo
- The air pressure builds and releases

**Examples from Surahs you know:**

**Surah Al-Ikhlas:**
- "أَحَدٌ" → When stopping: "أَحَدْ" (ahad) - strong bounce on Dal
- "الصَّمَدُ" → When stopping: "الصَّمَدْ" (as-samad) - strong bounce on Dal
- "يُولَدْ" (yoolad) - strong bounce on Dal
- "يَلِدْ" (yalid) - strong bounce on Dal

**Surah Al-Falaq:**
- "الْفَلَقْ" (al-falaq) - strong bounce on Qaf
- "وَقَبْ" (wa qab) - strong bounce on Ba

**Surah Al-Masad:**
- "تَبَّ" (tabb) - strong bounce on Ba
- "لَهَبْ" (lahab) - strong bounce on Ba

**Practice technique:**
1. Say the word normally
2. Stop on the final letter
3. Let the air release with a slight "pop" or bounce
4. It should sound like there's a very short echo: "ahad-d" (not a full extra syllable!)`
      },
      {
        id: "adv1-practice",
        type: "practice",
        title: "Qalqalah in Surah Al-Ikhlas",
        arabicContent: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
        audioConfig: audio(112, 1, 4, { repeat: 3, pauseBetweenAyahs: 1500, playbackRate: 0.9 }),
        content: `**Let's practice Qalqalah in Surah Al-Ikhlas!**

**قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾**
- "قُلْ" has Lam with sukoon (not a qalqalah letter)
- "أَحَدٌ" when we stop → "أَحَدْ" - Large Qalqalah on Dal!

**ٱللَّهُ ٱلصَّمَدُ ﴿٢﴾**
- "ٱلصَّمَدُ" when we stop → "ٱلصَّمَدْ" - Large Qalqalah on Dal!

**لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾**
- "يَلِدْ" - Large Qalqalah on Dal
- "يُولَدْ" - Large Qalqalah on Dal
- Both are perfect examples!

**وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ ﴿٤﴾**
- "أَحَدٌۢ" when stopping → Large Qalqalah on Dal!

**Notice:** This surah is FULL of qalqalah opportunities because of all the words ending in Dal!

**Recording yourself:** Try recording your recitation and listen for the bounces. Are they clear but not exaggerated?`
      },
      {
        id: "adv1-listen-repeat",
        type: "listen-repeat",
        title: "Practice: Surah Al-Ikhlas with Qalqalah",
        arabicContent: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ٱللَّهُ ٱلصَّمَدُ لَمْ يَلِدْ وَلَمْ يُولَدْ وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌۢ",
        listenRepeatConfig: listenRepeat(112, 1, 4, 5),
        content: `**Listen and Repeat: Surah Al-Ikhlas**

Focus on the qalqalah letters: ق ط ب ج د

Listen carefully for the "echo" or "bounce" on:
- "أَحَدْ" (both occurrences)
- "الصَّمَدْ"
- "يَلِدْ"
- "يُولَدْ"

**Instructions:**
1. Listen to the complete surah
2. Repeat verse by verse, focusing on qalqalah
3. The audio will loop ${5} times - use each repetition to improve

Press play to begin!`
      },
      {
        id: "adv1-quiz",
        type: "exercise",
        title: "Qalqalah Quiz",
        content: "Identify the qalqalah!",
        exercise: {
          type: "letter_identify",
          question: "Which word has a Large Qalqalah (كُبْرَى) when you stop on it?",
          options: ["أَعُوذُ (a'oodhu)", "بِرَبِّ (bi-Rabbi)", "الْفَلَقِ (al-falaqi)", "الْفَلَقْ (al-falaq - with waqf)"],
          correctAnswer: 3,
          explanation: "When we STOP on 'الْفَلَقْ', the Qaf at the end gets Large Qalqalah because it's a qalqalah letter (ق) at the end during a stop. The bouncing sound is more pronounced!"
        }
      },
      {
        id: "adv1-quiz2",
        type: "exercise",
        title: "Qalqalah Intensity",
        content: "Compare small vs large:",
        exercise: {
          type: "word_match",
          question: "Why is qalqalah at the end of a word (when stopping) MORE pronounced than in the middle?",
          options: [
            "The rules are different",
            "Air pressure builds up with nowhere to go, creating stronger release",
            "It's just a stylistic choice",
            "There's no difference"
          ],
          correctAnswer: 1,
          explanation: "At the end (when stopping), there's no following letter to flow into. The air pressure builds up and releases with a stronger bounce. In the middle, the sound continues to the next letter."
        }
      },
      {
        id: "adv1-quiz3",
        type: "exercise",
        title: "Common Error Detection",
        content: "Spot the mistake:",
        exercise: {
          type: "comprehension",
          question: "A reciter says 'أَحَدَ' (ahad-a) with a full vowel at the end instead of 'أَحَدْ' with an echo. What's wrong?",
          options: [
            "Nothing - that's correct",
            "They added a vowel instead of making the echo/bounce",
            "They should merge into the next word",
            "Qalqalah doesn't apply here"
          ],
          correctAnswer: 1,
          explanation: "Adding a full vowel 'a' is incorrect! Qalqalah is a slight ECHO/BOUNCE, not an added vowel. 'Ahad-d' with a brief bounce, NOT 'ahad-a' with a vowel."
        }
      },
      {
        id: "adv1-quiz4",
        type: "exercise",
        title: "Surah Al-Masad Practice",
        content: "Find all qalqalah letters:",
        exercise: {
          type: "word_match",
          question: "In 'تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ', how many qalqalah letters are there?",
          options: ["1 (just one ب)", "2 (two ب letters)", "3 (counting the shaddah ب twice)", "4 or more"],
          correctAnswer: 1,
          explanation: "There are 2 qalqalah occurrences: تَبَّ (the ب with shaddah at the end - Large when stopping) and أَبِي (the ب in the middle - Small). Note: لَهَبٍ also ends with ب when we stop!"
        }
      },
      {
        id: "adv1-timed-challenge",
        type: "exercise",
        title: "⏱️ Rapid Qalqalah Identification",
        content: "Quick! 15 seconds!",
        exercise: {
          type: "word_match",
          question: "Does the word 'الْحَقّ' have qalqalah when stopping?",
          options: ["Yes - ق is a qalqalah letter", "No - shaddah cancels qalqalah", "Only small qalqalah", "Qaf isn't a qalqalah letter"],
          correctAnswer: 0,
          explanation: "Yes! Qaf (ق) is a qalqalah letter, and when stopping on الْحَقّ, there's Large Qalqalah on the Qaf despite the shaddah. The bounce still occurs!"
        }
      },
      {
        id: "adv1-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Excellent! You've mastered Qalqalah!**

**Summary:**

**The 5 Letters:** ق ط ب ج د (Qutbu Jadd - قُطْبُ جَدّ)

| Type | Where | Intensity |
|------|-------|-----------|
| **Small (صُغْرَى)** | Middle of word/phrase | Subtle bounce |
| **Large (كُبْرَى)** | End of word (when stopping) | Clear bounce |

**Practice checklist:**
✅ Can you identify qalqalah letters when reading?
✅ Do you make a subtle bounce in the middle?
✅ Do you make a clearer bounce at the end (when stopping)?
✅ Is your qalqalah not too exaggerated?

**Common errors to avoid:**
- Adding a full vowel (saying "ahad-a" instead of "ahad" with echo)
- Making middle qalqalah too strong
- Forgetting qalqalah entirely

**Coming up:** Advanced Idgham types!`
      }
    ],
    memorizationTechniques: [
      "قُطْبُ جَدّ (Qutbu Jadd) = The 5 qalqalah letters",
      "Small = middle, Large = end (when stopping)",
      "Echo, don't add a vowel!"
    ],
    keyVocabulary: [
      { arabic: "قَلْقَلَة", transliteration: "Qalqalah", meaning: "Echo/bounce" },
      { arabic: "صُغْرَى", transliteration: "Sughra", meaning: "Small (qalqalah)" },
      { arabic: "كُبْرَى", transliteration: "Kubra", meaning: "Large (qalqalah)" },
      { arabic: "قُطْبُ جَدّ", transliteration: "Qutbu Jadd", meaning: "Memory phrase for ق ط ب ج د" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 30: Advanced Types of Idgham
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-2",
    unit: 9,
    unitTitle: "Advanced Tajweed",
    path: "advanced",
    number: 30,
    title: "Advanced Types of Idgham",
    description: "Master the subtle differences between idgham types",
    surah: 36,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 35,
    xpReward: 150,
    steps: [
      {
        id: "adv2-intro",
        type: "instruction",
        title: "Beyond Basic Idgham",
        content: `You learned basic Idgham with Noon Sakinah (يَرْمَلُون - YARMALOON).

Now let's explore ADVANCED types of Idgham:

**1. Idgham Mutamaathilain (إِدْغَام مُتَمَاثِلَيْن)**
- Same letters merging (identical letters)

**2. Idgham Mutajaanisain (إِدْغَام مُتَجَانِسَيْن)**
- Similar letters merging (same articulation point)

**3. Idgham Mutaqaaribain (إِدْغَام مُتَقَارِبَيْن)**
- Close letters merging (nearby articulation points)

**Why it matters:**
These rules create the smooth, flowing sound of proper Quran recitation. Without them, the recitation sounds choppy and unnatural.

Let's dive into each type!`
      },
      {
        id: "adv2-mutamaathilain",
        type: "explanation",
        title: "Idgham Mutamaathilain - Identical Letters",
        arabicContent: "اذْهَب بِّكِتَابِي",
        content: `**Idgham Mutamaathilain (إِدْغَام مُتَمَاثِلَيْن)** - Merging of IDENTICAL letters

**When:** Two identical letters meet, the first having sukoon.

**Result:** They merge into ONE letter with shaddah.

**Examples:**

**ب + ب:**
"اذْهَب بِّكِتَابِي" → The Ba with sukoon merges into the Ba with kasra
Pronounced: "idh-hab-bi-kitaabi" (one doubled ba)

**ت + ت:**
"رَبَحَت تِّجَارَتُهُمْ" → Ta merges into Ta
Pronounced: "rabaha-tti-jaaratuhum"

**د + د:**
"قَد دَّخَلُوا" → Dal merges into Dal
Pronounced: "qa-da-khaloo" (one doubled dal)

**ك + ك:**
"مَنَاسِكَكُمْ" → Kaf merges into Kaf
Pronounced: "manaasi-kakum" with one elongated kaf

**Note:** This is essentially the same letter appearing twice, so natural speech makes them merge automatically. The tajweed rule just formalizes what's natural!`
      },
      {
        id: "adv2-mutajaanisain",
        type: "explanation",
        title: "Idgham Mutajaanisain - Similar Letters",
        arabicContent: "قَد تَّبَيَّنَ",
        content: `**Idgham Mutajaanisain (إِدْغَام مُتَجَانِسَيْن)** - Merging of SIMILAR letters

**When:** Two letters from the SAME articulation point meet.

**Three groups of similar letters:**

**1. Tongue-tip letters (ت - ط - د):**
- "قَد تَّبَيَّنَ" → Dal merges into Ta → "qa-tta-bayyana"
- "أَثْقَلَت دَّعَوَا" → Ta merges into Dal → "athqala-da'awa"

**2. Lip letters (ب - م):**
- "ارْكَب مَّعَنَا" → Ba merges into Meem → "irka-ma'ana"

**3. Tongue-tip letters (ط - ظ):**
- These rarely meet in the Quran

**Why "similar"?**
These letters share the SAME position in the mouth but differ in characteristics (like heaviness, voicing, etc.).

**The merge:**
The first letter takes on the characteristics of the second.
- "قَد تَّبَيَّنَ" - Dal becomes Ta (not the other way!)
- Written with shaddah on the second letter

**Practice:** "وَقَالَت طَّائِفَةٌ" → Ta merges? No! ت doesn't merge INTO ط typically.`
      },
      {
        id: "adv2-mutaqaaribain",
        type: "explanation",
        title: "Idgham Mutaqaaribain - Close Letters",
        arabicContent: "قُل رَّبِّ",
        content: `**Idgham Mutaqaaribain (إِدْغَام مُتَقَارِبَيْن)** - Merging of CLOSE letters

**When:** Two letters from NEARBY articulation points meet.

**Most common example: ل + ر (Lam + Ra):**
- "قُل رَّبِّ" → Lam merges into Ra → "qur-rabbi"
- "بَل رَّفَعَهُ" → "bar-rafa'ahu"

**Other examples:**

**ن + ل (Noon + Lam):**
- "مِن لَّدُنَّا" → Not quite! This is actually Idgham of Noon Sakinah (YARMALOON rule)

**ق + ك (Qaf + Kaf):**
- "أَلَمْ نَخْلُقكُّم" → Qaf can merge into Kaf
- Both are back-of-mouth letters

**Why "close"?**
These letters are articulated from NEARBY (not identical) positions. 
Lam = tip of tongue against upper gums
Ra = tip of tongue slightly further back
They're close enough to merge!

**Practical tip:**
The Lam-Ra idgham is by far the most common. Listen for it in phrases like:
- "قُل رَّبِّ" (say: My Lord)
- "يَقُول رَّبَّنَا" (says: Our Lord)
- "الَّذِي خَلَقَ وَالَّذِي رَّزَقَ" (did not create and... wait, that's not right)`
      },
      {
        id: "adv2-comparison",
        type: "explanation",
        title: "Comparison Chart",
        content: `**Let's compare all Idgham types:**

| Type | Meaning | Example | Pronunciation |
|------|---------|---------|---------------|
| **Mutamaathilain** | Identical | ب + ب | One letter, doubled |
| **Mutajaanisain** | Same point | د + ت | Second letter wins |
| **Mutaqaaribain** | Nearby points | ل + ر | Second letter wins |

**How to identify:**

**Step 1:** Is the first letter saakin (has sukoon)?
- Yes → Continue
- No → Not idgham

**Step 2:** Is the second letter identical?
- Yes → Mutamaathilain
- No → Continue

**Step 3:** Are they from the same articulation point?
- Yes → Mutajaanisain
- No → Continue

**Step 4:** Are they from nearby points?
- Yes → Mutaqaaribain
- No → No special idgham

**Memory aid:**
- **Ma-tha-ma-thi-lain** = MATCHING/IDENTICAL
- **Mu-ta-jaa-ni-sain** = from same GENUS/type
- **Mu-ta-qaa-ri-bain** = NEAR each other`
      },
      {
        id: "adv2-practice",
        type: "practice",
        title: "Practice in Context",
        arabicContent: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        audioConfig: audio(17, 24, 24, { repeat: 3, playbackRate: 0.85 }), // Surah Al-Isra 17:24
        content: `**Let's find idgham in Surah Al-Ikhlas and beyond:**

**Surah Al-Ikhlas:**
- "قُلْ هُوَ" - No idgham (Lam before Ha - not close)

**Surah Al-Kafirun:**
- "قُل يَا أَيُّهَا" - No idgham here
- "لَكُمْ دِينُكُمْ" - Meem before Dal? Not idgham material

**Where to find clear examples:**

**Mutamaathilain:**
- "يُدْرِككُّمُ الْمَوْتُ" (4:78) - Kaf + Kaf
- "وَقَد دَّخَلُوا" (5:61) - Dal + Dal

**Mutajaanisain:**
- "قَد تَّبَيَّنَ" (2:256) - Dal + Ta
- "أَثْقَلَت دَّعَوَا" (7:189) - Ta + Dal

**Mutaqaaribain:**
- "قُل رَّبِّ" (17:24) - Lam + Ra
- "بَل رَّبُّكُمْ" (21:56) - Lam + Ra

**Practice these phrases out loud, paying attention to smooth merging!**`
      },
      {
        id: "adv2-listen-repeat",
        type: "listen-repeat",
        title: "Practice: Idgham Mutaqaaribain",
        arabicContent: "وَقُل رَّبِّ ٱرْحَمْهُمَا كَمَا رَبَّيَانِى صَغِيرًا",
        listenRepeatConfig: listenRepeat(17, 24, 24, 3),
        content: `**Listen and Repeat: Surah Al-Isra 17:24**

This beautiful verse contains a clear example of Idgham Mutaqaaribain:
- "قُل رَّبِّ" - The Lam merges into the Ra

**Translation:** "And say: My Lord, have mercy upon them as they brought me up when I was small."

Focus on:
1. The smooth merging of Lam into Ra
2. The doubled Ra sound (qur-rabbi, not qul rabbi)

Press play and repeat until the merging feels natural.`
      },
      {
        id: "adv2-quiz",
        type: "exercise",
        title: "Idgham Type Quiz",
        content: "Identify the idgham type!",
        exercise: {
          type: "word_match",
          question: "In 'قُل رَّبِّ', what type of idgham occurs between Lam and Ra?",
          options: [
            "Idgham Mutamaathilain (identical)",
            "Idgham Mutajaanisain (same articulation)",
            "Idgham Mutaqaaribain (close articulation)",
            "No idgham occurs"
          ],
          correctAnswer: 2,
          explanation: "Idgham Mutaqaaribain! Lam (ل) and Ra (ر) come from CLOSE (not identical) articulation points on the tongue tip. The Lam merges into the Ra, producing 'qur-rabbi'."
        }
      },
      {
        id: "adv2-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Outstanding! You've mastered advanced Idgham types!**

**Summary:**

| Type | Letters | Example |
|------|---------|---------|
| **Mutamaathilain** | Identical (ك+ك) | يُدْرِككُّم |
| **Mutajaanisain** | Same point (ت+د+ط) | قَد تَّبَيَّنَ |
| **Mutaqaaribain** | Close points (ل+ر) | قُل رَّبِّ |

**Key takeaways:**
1. All require the FIRST letter to have sukoon
2. The SECOND letter "wins" - its sound dominates
3. Result is one elongated/doubled letter
4. Creates smooth, flowing recitation

**Practice tip:**
When reading any Quran passage, watch for:
- Two letters meeting
- First has sukoon
- Same, similar, or nearby articulation points

**Coming up:** Advanced Madd types and variations!`
      }
    ],
    memorizationTechniques: [
      "Mutamaathilain = MATCHING (identical)",
      "Mutajaanisain = same GENUS (articulation point)",
      "Mutaqaaribain = NEARBY points"
    ],
    keyVocabulary: [
      { arabic: "مُتَمَاثِلَيْن", transliteration: "Mutamaathilain", meaning: "Identical letters" },
      { arabic: "مُتَجَانِسَيْن", transliteration: "Mutajaanisain", meaning: "Same articulation point" },
      { arabic: "مُتَقَارِبَيْن", transliteration: "Mutaqaaribain", meaning: "Close articulation points" },
      { arabic: "مَخْرَج", transliteration: "Makhraj", meaning: "Articulation point" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 31: Advanced Madd - Variations and Rules
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-3",
    unit: 9,
    unitTitle: "Advanced Tajweed",
    path: "advanced",
    number: 31,
    title: "Advanced Madd - All Types",
    description: "Master all variations of elongation in Quranic recitation",
    surah: 2,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 40,
    xpReward: 175,
    steps: [
      {
        id: "adv3-intro",
        type: "instruction",
        title: "The Complete Madd System",
        content: `In Intermediate lessons, you learned 4 basic types of Madd.

Now let's explore the COMPLETE system with all variations!

**Primary (أَصْلِي) vs Secondary (فَرْعِي):**

**Primary Madd:**
- Natural/Original Madd (مَدّ طَبِيعِي) - 2 counts

**Secondary Madd (caused by hamza or sukoon):**
- Connected (مُتَّصِل) - hamza in same word
- Separated (مُنْفَصِل) - hamza in next word
- Exchange (عِوَض) - stopping on tanween fatha
- Compulsory (لَازِم) - sukoon after madd letter
- Soft (لِين) - special case with weak letters
- Presented Sukoon ('ارِض) - sukoon due to stopping

**Why so many?**
Each type responds to a different situation. Mastering them all gives your recitation authentic beauty and correctness.`
      },
      {
        id: "adv3-iwad",
        type: "explanation",
        title: "Madd 'Iwad - The Exchange",
        arabicContent: "عَلِيمًا حَكِيمًا",
        content: `**Madd 'Iwad (مَدّ عِوَض)** - The Exchange/Substitution Madd

**Duration:** 2 counts

**When:** Stopping on a word that ends with **tanween fatha** (ـًا).

**What happens:**
The tanween ( ً = double fatha) is "exchanged" for a long 'aa' sound.

**Examples:**
- "عَلِيمًا" when stopping → "aleemaa" (not 'aleeman')
- "حَكِيمًا" when stopping → "hakeemaa"
- "رَحِيمًا" when stopping → "raheemaa"

**Why?**
In continuous reading, you say the full tanween: "aleeman hakeeman"
When stopping, the 'n' disappears and is replaced with elongation.

**Written vs Spoken:**
- Written: عَلِيمًا (with tanween)
- Spoken when stopping: عَلِيمَا (with madd)

**Note:** This only applies to tanween FATHA ( ً), not kasra ( ٍ ) or damma ( ٌ ).
- "عَلِيمٍ" when stopping → "'aleem" (no exchange)
- "عَلِيمٌ" when stopping → "'aleem" (no exchange)`
      },
      {
        id: "adv3-aarid",
        type: "explanation",
        title: "Madd 'Aarid lil-Sukoon - Presented Sukoon",
        arabicContent: "الْعَالَمِينَ",
        content: `**Madd 'Aarid lil-Sukoon (مَدّ عَارِض للسُّكُون)**

**Duration:** 2, 4, or 6 counts (flexible!)

**When:** A madd letter is followed by a letter that gets sukoon DUE TO STOPPING.

**Example: "الْعَالَمِينَ"**
- When continuing: "al-'aalameena rabbil..." (natural madd, 2 counts)
- When stopping: "al-'aalameen" - the Noon gets sukoon
- The Yaa before it becomes Madd 'Aarid!

**Why "presented" (عَارِض)?**
The sukoon is temporary - it only appears because you stopped.
It's "presented" or "accidental" - not inherently part of the word.

**Flexibility:**
Unlike Madd Lazim (which MUST be 6 counts), Madd 'Aarid can be:
- 2 counts (short)
- 4 counts (medium)
- 6 counts (long)

Most reciters choose one length and maintain it throughout!

**Examples:**
- "نَسْتَعِينُ" when stopping → Madd 'Aarid on the Yaa
- "الرَّحِيمِ" when stopping → Madd 'Aarid on the Yaa
- "الدِّينِ" when stopping → Madd 'Aarid on the Yaa`
      },
      {
        id: "adv3-checkpoint",
        type: "checkpoint",
        title: "Progress Check ✨",
        content: `**You've completed 60% of this comprehensive lesson!**

**Madd types covered:**
- **Madd 'Iwad** - Exchange (tanween fatha → aa when stopping)
- **Madd 'Aarid** - Presented (sukoon created by stopping, 2/4/6 flexible)

**Coming up:** Madd Leen, Madd Sila, and the complete reference chart.

Take a breath - this is dense material! Continue or save for later?`,
        progressPercent: 60,
        offerBreak: true
      },
      {
        id: "adv3-leen",
        type: "explanation",
        title: "Madd Leen - The Soft Madd",
        arabicContent: "قُرَيْشٍ",
        content: `**Madd Leen (مَدّ لِين)** - The Soft/Easy Madd

**Duration:** 2, 4, or 6 counts (when stopping)

**What is a Leen letter?**
When و or ي have SUKOON but are preceded by a FATHA (not their matching vowel):
- "يْ" preceded by فَتْحَة (not kasra) → Leen
- "وْ" preceded by فَتْحَة (not damma) → Leen

**Examples:**
- "قُرَيْشٍ" - The Yaa has sukoon, preceded by Fatha on Ra
- "خَوْفٍ" - The Waw has sukoon, preceded by Fatha on Kha
- "الْبَيْتِ" - The Yaa has sukoon, preceded by Fatha on Ba

**When does it elongate?**
Only when STOPPING on the word!

- "قُرَيْشٍ" continuing → short (natural sound)
- "قُرَيْشٍ" when stopping → "qurayshhh" (can elongate 2, 4, or 6)

**Why "soft/easy"?**
These combinations (ay, aw) are softer sounds than true madd letters.
The elongation is gentler.

**Compare:**
- "فِيهِ" (fee-hi) - Regular long 'ee' (madd letter)
- "عَلَيْهِ" (alay-hi) - Leen sound 'ay' (not a true madd)`
      },
      {
        id: "adv3-sila",
        type: "explanation",
        title: "Madd Sila - The Connection",
        arabicContent: "إِنَّهُ هُوَ",
        content: `**Madd Sila (مَدّ صِلَة)** - The Connecting Madd

**When:** The pronoun هُ (hu) or هِ (hi) at the end of a word, followed by another word.

**Two types:**

**1. Sila Sughra (صِلَة صُغْرَى) - Small Connection:**
- When NOT followed by hamza
- Duration: 2 counts
- Example: "إِنَّهُ هُوَ" → "innahu huwwa" (slight elongation of the 'u')

**2. Sila Kubra (صِلَة كُبْرَى) - Large Connection:**
- When followed by hamza
- Duration: 4-5 counts
- Example: "مَالَهُ أَخْلَدَهُ" → "maalahuu akhladahu" (longer 'u' before hamza)

**The "invisible" و or ي:**
In Sila, we're essentially adding:
- A silent Waw after هُ: "lehuu" (لَهُو)
- A silent Yaa after هِ: "bihii" (بِهِي)

**Why?**
In classical Arabic recitation, these pronouns naturally connect and elongate to the next word.

**When does Sila NOT apply?**
- When STOPPING on the word
- When the ه has sukoon (هْ)
- In special exceptions noted by scholars`
      },
      {
        id: "adv3-chart",
        type: "explanation",
        title: "Complete Madd Chart",
        content: `**Master Reference: All Madd Types**

| Type | Arabic | When | Duration |
|------|--------|------|----------|
| **Natural** | طَبِيعِي | No hamza/sukoon after | 2 |
| **Connected** | مُتَّصِل | Hamza in same word | 4-5 |
| **Separated** | مُنْفَصِل | Hamza in next word | 2-5 |
| **Compulsory** | لَازِم | Sukoon/shaddah after | 6 |
| **Exchange** | عِوَض | Stop on tanween fatha | 2 |
| **Presented** | عَارِض | Stop creates sukoon | 2/4/6 |
| **Soft** | لِين | Waw/Yaa + fatha before | 2/4/6 |
| **Small Sila** | صِلَة صُغْرَى | Pronoun ه + no hamza | 2 |
| **Large Sila** | صِلَة كُبْرَى | Pronoun ه + hamza | 4-5 |

**Decision flowchart:**
1. Is there a madd letter? → Yes, continue
2. What follows it?
   - Nothing special → Natural (2)
   - Hamza same word → Connected (4-5)
   - Hamza next word → Separated (2-5)
   - Sukoon/Shaddah → Compulsory (6)
3. Are you stopping?
   - On tanween fatha → Exchange (2)
   - Creating sukoon → Presented (2/4/6)`
      },
      {
        id: "adv3-quiz",
        type: "exercise",
        title: "Advanced Madd Quiz",
        content: "Test your mastery!",
        exercise: {
          type: "word_match",
          question: "When stopping on 'الْعَالَمِينَ', what type of madd occurs on the Yaa?",
          options: [
            "Madd Tabee'i (Natural) - 2 counts only",
            "Madd Lazim (Compulsory) - 6 counts only",
            "Madd 'Aarid lil-Sukoon (Presented) - 2, 4, or 6 counts",
            "Madd Leen (Soft) - 2, 4, or 6 counts"
          ],
          correctAnswer: 2,
          explanation: "Madd 'Aarid lil-Sukoon! When stopping, the Noon gets sukoon, which 'presents' a sukoon after the Yaa. This temporary sukoon creates flexibility: you can hold for 2, 4, or 6 counts."
        }
      },
      {
        id: "adv3-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Exceptional work! You've mastered all Madd types!**

**Quick Reference:**
- **Natural (2)** - The base
- **Connected (4-5)** - Hamza in word
- **Separated (2-5)** - Hamza next word
- **Compulsory (6)** - Real sukoon
- **Exchange (2)** - Tanween fatha → aa
- **Presented (2/4/6)** - Stopping creates sukoon
- **Soft (2/4/6)** - Waw/Yaa after fatha
- **Sila (2 or 4-5)** - Pronoun connection

**Practice strategy:**
1. Pick one surah you know
2. Identify every madd
3. Name the type
4. Apply correct duration

**You've completed Unit 9: Advanced Tajweed!**`
      }
    ],
    memorizationTechniques: [
      "Cause determines type: hamza vs sukoon vs nothing",
      "Stopping changes rules: 'Aarid, 'Iwad, Leen",
      "Flexibility in presented madds - pick one length and be consistent"
    ],
    keyVocabulary: [
      { arabic: "مَدّ عِوَض", transliteration: "Madd 'Iwad", meaning: "Exchange madd (tanween fatha)" },
      { arabic: "مَدّ عَارِض", transliteration: "Madd 'Aarid", meaning: "Presented madd (stopping)" },
      { arabic: "مَدّ لِين", transliteration: "Madd Leen", meaning: "Soft madd" },
      { arabic: "مَدّ صِلَة", transliteration: "Madd Sila", meaning: "Connection madd" }
    ]
  }
];

  // ─────────────────────────────────────────────────────────────────────────
  // UNIT 9 REVIEW: Advanced Tajweed Consolidation
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-unit9-review",
    unit: 9,
    unitTitle: "Advanced Tajweed",
    path: "advanced",
    number: 31.5,
    title: "Unit 9 Review - Advanced Tajweed Mastery",
    description: "Consolidate all advanced tajweed concepts",
    surah: 112,
    ayahStart: 1,
    ayahEnd: 4,
    estimatedMinutes: 20,
    xpReward: 175,
    isUnitReview: true,
    steps: [
      {
        id: "u9r-intro",
        type: "instruction",
        title: "Advanced Tajweed Review 🎯",
        content: `**Unit 9 Complete - Let's consolidate!**

**Advanced concepts mastered:**
1. **Qalqalah** - Echo on قطبجد (small vs large)
2. **Advanced Idgham** - Mutamaathilain, Mutajaanisain, Mutaqaaribain
3. **Complete Madd System** - All 9 types with durations

This review ensures you can apply these in actual recitation!`
      },
      {
        id: "u9r-quiz1",
        type: "exercise",
        title: "Idgham Types Review",
        content: "Distinguish the idgham types:",
        exercise: {
          type: "word_match",
          question: "In 'قُل رَّبِّ', what type of idgham occurs between Lam and Ra?",
          options: ["Mutamaathilain (identical)", "Mutajaanisain (same point)", "Mutaqaaribain (close points)", "No idgham"],
          correctAnswer: 2,
          explanation: "Mutaqaaribain! Lam and Ra come from CLOSE articulation points. The Lam merges into Ra → 'qur-rabbi'."
        }
      },
      {
        id: "u9r-quiz2",
        type: "exercise",
        title: "Madd System Review",
        content: "Apply your complete madd knowledge:",
        exercise: {
          type: "word_match",
          question: "When stopping on 'الرَّحِيمِ', what type of madd occurs on the Yaa?",
          options: ["Madd Tabee'i (Natural)", "Madd Muttasil (Connected)", "Madd 'Aarid (Presented)", "Madd Lazim (Compulsory)"],
          correctAnswer: 2,
          explanation: "Madd 'Aarid lil-Sukoon! When stopping, the Meem gets sukoon, creating a 'presented' sukoon after the Yaa. You can hold 2, 4, or 6 counts."
        }
      },
      {
        id: "u9r-summary",
        type: "instruction",
        title: "Advanced Tajweed Mastered! 🏆",
        content: `**Excellent! You've mastered advanced tajweed!**

**Complete Madd Reference:**
| Type | Cause | Counts |
|------|-------|--------|
| Natural | Base | 2 |
| Connected | Hamza same word | 4-5 |
| Separated | Hamza next word | 2-5 |
| Compulsory | Sukoon/shaddah | 6 |
| Presented | Stop creates sukoon | 2/4/6 |
| Exchange | Tanween fatha stop | 2 |
| Soft | Waw/Ya + fatha | 2/4/6 |

**Ready for Mutashabihat - similar verses!**`
      }
    ],
    memorizationTechniques: [
      "Qalqalah: قُطْبُ جَدّ - echo the 5 letters",
      "3 idgham types: identical, same point, close points",
      "Madd: What follows determines the type"
    ],
    keyVocabulary: []
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 10: MUTASHABIHAT - SIMILAR VERSES (Lessons 32-33)
 * Learn to distinguish verses that sound or look alike
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_10_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 32: Introduction to Mutashabihat
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-4",
    unit: 10,
    unitTitle: "Mutashabihat - Similar Verses",
    path: "advanced",
    number: 32,
    title: "Understanding Mutashabihat",
    description: "Learn why similar verses exist and strategies to distinguish them",
    surah: 2,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 35,
    xpReward: 150,
    mastery_required: 80, // Must master advanced tajweed first
    steps: [
      {
        id: "adv4-intro",
        type: "instruction",
        title: "The Challenge of Similar Verses",
        content: `**Mutashabihat (مُتَشَابِهَات)** = Verses that resemble each other

Every Hafiz faces this challenge: verses that start the same, sound similar, or have slight word variations.

**Why do they exist?**

1. **Divine Wisdom:** Allah tests and strengthens the memorizer
2. **Emphasis:** Important concepts are repeated with variations
3. **Context:** Same themes expressed differently for different audiences
4. **Arabic eloquence:** Subtle changes create rhetorical effects

**The good news:**
Understanding WHY verses differ helps you remember WHICH version belongs where!

**Categories of Mutashabihat:**

1. **Word substitution:** Same verse, one word different
2. **Addition/deletion:** Same verse, extra word in one
3. **Word order change:** Same words, different sequence
4. **Identical openings:** Different verses starting the same way
5. **Similar endings:** Different verses ending similarly`
      },
      {
        id: "adv4-example1",
        type: "explanation",
        title: "Example 1: Word Substitution",
        arabicContent: "وَقَالُوا vs وَقَالَ",
        content: `**Word substitution** - One word differs between similar verses.

**Classic example in Surah Al-Baqarah:**

**Verse 2:80:**
"وَقَالُوا لَن تَمَسَّنَا النَّارُ إِلَّا أَيَّامًا مَّعْدُودَةً"
"And they say: The Fire will not touch us except for **numbered DAYS**"
(أَيَّامًا مَّعْدُودَةً - feminine plural)

**Verse 3:24:**
"ذَٰلِكَ بِأَنَّهُمْ قَالُوا لَن تَمَسَّنَا النَّارُ إِلَّا أَيَّامًا مَّعْدُودَاتٍ"
"That is because they said: The Fire will not touch us except for **counted DAYS**"
(أَيَّامًا مَّعْدُودَاتٍ - feminine plural, different form!)

**The difference:**
- معدودة = numbered (passive participle, feminine singular agreeing)
- معدودات = counted (sound feminine plural)

**Memory strategy:**
Baqarah (2) = "معدودة" (shorter word, earlier surah)
Aal-Imran (3) = "معدودات" (longer word, later surah)

Both convey the same meaning but the grammar varies!`
      },
      {
        id: "adv4-example2",
        type: "explanation",
        title: "Example 2: Addition/Deletion",
        arabicContent: "فَاذْكُرُونِي vs فَاذْكُرُوا اللَّهَ",
        content: `**Addition/Deletion** - One version has an extra word.

**Surah Al-Baqarah 2:152:**
"فَاذْكُرُونِي أَذْكُرْكُمْ"
"So remember **Me**; I will remember you"
(Direct address from Allah - "Me")

**Surah Al-Jumu'ah 62:10:**
"وَاذْكُرُوا اللَّهَ كَثِيرًا"
"And remember **Allah** much"
(Third person reference)

**The difference:**
- فَاذْكُرُونِي = "Remember ME" (first person)
- اذْكُرُوا اللَّهَ = "Remember ALLAH" (third person + His name)

**Memory strategy:**
Notice the CONTEXT:
- 2:152 is Allah speaking directly to believers (intimate, first person)
- 62:10 is instruction through the Prophet (uses Allah's name)

**Another example:**

**Surah Aal-Imran 3:133:**
"وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ"
"And hasten to forgiveness"

**Surah Al-Hadid 57:21:**
"سَابِقُوا إِلَىٰ مَغْفِرَةٍ"
"Race toward forgiveness"

Different verbs: سَارِعُوا (hasten) vs سَابِقُوا (race)
Same destination: forgiveness!`
      },
      {
        id: "adv4-example3",
        type: "explanation",
        title: "Example 3: Identical Openings",
        arabicContent: "وَإِذْ قَالَ رَبُّكَ",
        content: `**Identical Openings** - Different verses that begin the same way.

**The phrase "وَإِذْ قَالَ رَبُّكَ" (And when your Lord said...)**

Appears in multiple places with DIFFERENT continuations:

**Surah Al-Baqarah 2:30:**
"وَإِذْ قَالَ رَبُّكَ لِلْمَلَائِكَةِ إِنِّي جَاعِلٌ فِي الْأَرْضِ خَلِيفَةً"
"...to the angels: Indeed, I will make upon the earth a successor"

**Surah Al-Baqarah 2:124:**
"وَإِذْ ابْتَلَىٰ إِبْرَاهِيمَ رَبُّهُ بِكَلِمَاتٍ"
"And when Abraham was tried by his Lord with commands..."
(Note: Word order differs! رَبُّهُ not رَبُّكَ)

**Surah Al-A'raf 7:12:**
"قَالَ مَا مَنَعَكَ أَلَّا تَسْجُدَ"
"He said: What prevented you from prostrating..."

**Memory strategy:**
Build a MENTAL MAP of the narrative:
- Opening of creation story → Baqarah 30
- Abraham's test → Baqarah 124
- Conversation with Iblis → A'raf 12

CONTEXT helps you know which version comes next!`
      },
      {
        id: "adv4-strategies",
        type: "explanation",
        title: "Strategies for Mutashabihat",
        content: `**Proven strategies for mastering similar verses:**

**1. Create a Mutashabihat notebook:**
- Write pairs of similar verses
- Note the EXACT differences
- Mark which surah each belongs to

**2. Understand the context:**
- WHY does this version appear here?
- What's the theme of this surah?
- Who is being addressed?

**3. Use numerical associations:**
- "Baqarah is 2, معدودة is shorter" (2 = shorter)
- Create memorable number-word connections

**4. Focus on distinguishing words:**
- Don't just repeat the whole verse
- Isolate the DIFFERENT part
- Practice: "In Baqarah, it's X. In Aal-Imran, it's Y."

**5. Recite in context:**
- Don't just memorize isolated verses
- Include verses before and after
- The flow helps you "land" on the right version

**6. Listen to Qaris:**
- Pay attention when they pass similar sections
- Their rhythm and tajweed help distinguish

**7. Review regularly:**
- Mutashabihat are the FIRST to get confused
- Build dedicated revision sessions for them`
      },
      {
        id: "adv4-quiz",
        type: "exercise",
        title: "Mutashabihat Recognition",
        content: "Test your awareness!",
        exercise: {
          type: "comprehension",
          question: "Why do similar verses (mutashabihat) exist in the Quran?",
          options: [
            "They are mistakes in transmission",
            "They test memorizers and emphasize meanings through variation",
            "They are different versions from different companions",
            "They serve no particular purpose"
          ],
          correctAnswer: 1,
          explanation: "Mutashabihat exist by Divine wisdom - they test and strengthen memorizers, emphasize important concepts through repetition with variation, and create rhetorical effects. Understanding this helps you approach them strategically!"
        }
      },
      {
        id: "adv4-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Excellent! You understand the concept of Mutashabihat!**

**Key takeaways:**

**Types of Mutashabihat:**
1. Word substitution
2. Addition/deletion
3. Word order changes
4. Identical openings
5. Similar endings

**Mastery strategies:**
1. Dedicated notebook
2. Context understanding
3. Numerical associations
4. Focus on differences
5. Contextual recitation
6. Listen to reciters
7. Regular revision

**Coming up:** Practical Mutashabihat examples from Juz Amma!`
      }
    ],
    memorizationTechniques: [
      "Create a dedicated Mutashabihat notebook",
      "Understand WHY verses differ in context",
      "Focus on the distinguishing words, not whole verses"
    ],
    keyVocabulary: [
      { arabic: "مُتَشَابِهَات", transliteration: "Mutashabihat", meaning: "Similar/resembling verses" },
      { arabic: "مُحْكَمَات", transliteration: "Muhkamat", meaning: "Clear/decisive verses" },
      { arabic: "سِيَاق", transliteration: "Siyaaq", meaning: "Context" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 33: Mutashabihat in Juz Amma
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-5",
    unit: 10,
    unitTitle: "Mutashabihat - Similar Verses",
    path: "advanced",
    number: 33,
    title: "Mutashabihat in Juz Amma",
    description: "Master the similar verses in the short surahs you know",
    surah: 78,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 30,
    xpReward: 150,
    steps: [
      {
        id: "adv5-intro",
        type: "instruction",
        title: "Similar Verses in Short Surahs",
        content: `Even in Juz Amma, there are verses that can be confused!

Let's examine specific examples you may already know (or will soon memorize).

**We'll cover:**

1. **Al-Fajr vs Al-Balad** - Similar oath structures
2. **Ad-Duha vs Al-Inshirah** - Similar themes and structures
3. **Al-Kafirun** - Internal repetition (same surah!)
4. **Al-Fil vs Quraysh** - Connected surahs
5. **Ending patterns** - Many surahs end similarly

By mastering these, you'll avoid common mixing errors!`
      },
      {
        id: "adv5-fajr-balad",
        type: "explanation",
        title: "Al-Fajr vs Al-Balad Openings",
        arabicContent: "وَالْفَجْرِ vs لَا أُقْسِمُ",
        content: `**Both surahs begin with oaths, but differently:**

**Surah Al-Fajr (89) - Opening:**
وَالْفَجْرِ ﴿١﴾ وَلَيَالٍ عَشْرٍ ﴿٢﴾
"By the dawn, and by the ten nights..."
- Uses وَ (and) for oaths
- Multiple objects of the oath

**Surah Al-Balad (90) - Opening:**
لَا أُقْسِمُ بِهَٰذَا الْبَلَدِ ﴿١﴾
"I swear by this city..."
- Uses لَا أُقْسِمُ (I do/don't swear)
- Different oath structure

**Memory distinction:**
- **Al-Fajr (89)** = Simple "وَ" oaths
- **Al-Balad (90)** = "لَا أُقْسِمُ" formula

**Why the difference?**
Al-Fajr oaths are about TIME (dawn, nights, even/odd).
Al-Balad oath is about PLACE (this city - Makkah).

Different subjects → Different structures!`
      },
      {
        id: "adv5-duha-sharh",
        type: "explanation",
        title: "Ad-Duha vs Al-Inshirah",
        arabicContent: "أَلَمْ يَجِدْكَ vs أَلَمْ نَشْرَحْ",
        content: `**Two consecutive surahs with similar structure and theme!**

**Both comfort the Prophet ﷺ**
**Both use rhetorical questions**
**Both end with instruction**

**Surah Ad-Duha (93):**
"أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ" (6)
"أَلَمْ يَجِدْكَ ضَالًّا فَهَدَىٰ" (7)
"أَلَمْ يَجِدْكَ عَائِلًا فَأَغْنَىٰ" (8)
Pattern: "Did He not FIND you..." (يَجِدْكَ)

**Surah Al-Inshirah (94):**
"أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ" (1)
Pattern: "Did We not EXPAND..." (نَشْرَحْ)

**Key distinction:**
- Ad-Duha: "يَجِدْكَ" (find YOU) - Third person about Allah
- Al-Inshirah: "نَشْرَحْ" (WE expand) - First person, Allah speaking

**Memory aid:**
Duha = "He" (third person, like the sun is "it")
Sharh = "We" (first person, Allah opens YOUR heart directly)

Both surahs are sometimes recited together as they're thematically paired!`
      },
      {
        id: "adv5-kafirun",
        type: "explanation",
        title: "Al-Kafirun Internal Repetition",
        arabicContent: "لَا أَعْبُدُ مَا تَعْبُدُونَ",
        content: `**Surah Al-Kafirun (109) has internal similarity!**

**Verses 2-3:**
لَا أَعْبُدُ مَا تَعْبُدُونَ ﴿٢﴾
وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ﴿٣﴾

**Verses 4-5:**
وَلَا أَنَا عَابِدٌ مَّا عَبَدتُّمْ ﴿٤﴾
وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ ﴿٥﴾

**The differences:**
- Verse 2: "لَا أَعْبُدُ" (I do not worship - present)
- Verse 4: "وَلَا أَنَا عَابِدٌ" (Nor will I be a worshipper - active participle)

- Verse 3: "وَلَا أَنتُمْ عَابِدُونَ" (Nor are you worshippers)
- Verse 5: SAME! "وَلَا أَنتُمْ عَابِدُونَ مَا أَعْبُدُ"

**Why repeat?**
- Verses 2-3: Present state (now)
- Verses 4-5: Future state (never will be)

**Memory strategy:**
2-3 = Present (I don't / You don't - NOW)
4-5 = Future (I won't be / You won't be - EVER)

Verse 3 and 5 are IDENTICAL - the disbelievers' state doesn't change!`
      },
      {
        id: "adv5-endings",
        type: "explanation",
        title: "Common Ending Patterns",
        arabicContent: "إِنَّ رَبَّكَ",
        content: `**Many Juz Amma surahs share ending patterns:**

**"إِنَّ رَبَّكَ" (Indeed, your Lord...)**

**Surah Al-Fajr (89:14):**
"إِنَّ رَبَّكَ لَبِالْمِرْصَادِ"
"Indeed, your Lord is ever watchful"

**Surah Al-'Alaq (96:14):**
"أَلَمْ يَعْلَم بِأَنَّ اللَّهَ يَرَىٰ"
"Does he not know that Allah sees?"
(Different but similar theme!)

**"وَإِلَىٰ رَبِّكَ" Pattern:**

**Surah Ad-Duha (93:8):**
"وَأَمَّا بِنِعْمَةِ رَبِّكَ فَحَدِّثْ"
"And as for the favor of your Lord, report!"

**Surah Al-Inshirah (94:8):**
"وَإِلَىٰ رَبِّكَ فَارْغَب"
"And to your Lord direct your longing"

**Similar but different endings:**
- Duha: "report/proclaim" the favor
- Sharh: "turn to" the Lord

**Strategy:**
Group surahs by ending patterns. Know which ending belongs to which surah!`
      },
      {
        id: "adv5-practice",
        type: "practice",
        title: "Mutashabihat Drill",
        audioConfig: audio(93, 1, 8, { repeat: 1 }), // Surah Ad-Duha full
        content: `**Let's test your distinguishing ability!**

**Quick identification - which surah?**

1. "وَالْفَجْرِ" → ___
2. "لَا أُقْسِمُ بِهَٰذَا الْبَلَدِ" → ___
3. "أَلَمْ يَجِدْكَ يَتِيمًا" → ___
4. "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ" → ___
5. "لَا أَعْبُدُ مَا تَعْبُدُونَ" → ___

**Answers:**
1. Al-Fajr (89) - "By the dawn"
2. Al-Balad (90) - "I swear by this city"
3. Ad-Duha (93) - "Did He not find you an orphan"
4. Al-Inshirah/Ash-Sharh (94) - "Did We not expand your breast"
5. Al-Kafirun (109) - "I do not worship what you worship"

**How did you do?** These openings are KEY identifiers!`
      },
      {
        id: "adv5-listen-compare-1",
        type: "listen-repeat",
        title: "Compare: Ad-Duha vs Al-Inshirah",
        arabicContent: "أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ",
        listenRepeatConfig: listenRepeat(93, 6, 8, 2),
        content: `**Listen and Compare: Surah Ad-Duha (93:6-8)**

أَلَمْ يَجِدْكَ يَتِيمًا فَآوَىٰ ﴿٦﴾
أَلَمْ يَجِدْكَ ضَالًّا فَهَدَىٰ ﴿٧﴾
أَلَمْ يَجِدْكَ عَائِلًا فَأَغْنَىٰ ﴿٨﴾

Notice the pattern: "أَلَمْ يَجِدْكَ" (Did He not FIND you...)

This is DIFFERENT from Al-Inshirah which says "أَلَمْ نَشْرَحْ" (Did We not EXPAND...)

Listen carefully and note the difference!`
      },
      {
        id: "adv5-listen-compare-2",
        type: "listen-repeat",
        title: "Compare: Al-Inshirah Opening",
        arabicContent: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ",
        listenRepeatConfig: listenRepeat(94, 1, 4, 2),
        content: `**Listen and Compare: Surah Al-Inshirah (94:1-4)**

أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ﴿١﴾
وَوَضَعْنَا عَنكَ وِزْرَكَ ﴿٢﴾
الَّذِي أَنقَضَ ظَهْرَكَ ﴿٣﴾
وَرَفَعْنَا لَكَ ذِكْرَكَ ﴿٤﴾

Notice: "أَلَمْ نَشْرَحْ" (Did WE not EXPAND...) - First person "We"

Compare with Ad-Duha's "أَلَمْ يَجِدْكَ" (Did HE not FIND...) - Third person "He"

This distinction helps you know which surah you're reciting!`
      },
      {
        id: "adv5-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Fantastic! You've analyzed Mutashabihat in Juz Amma!**

**Key pairs to remember:**

| Similar | Distinction |
|---------|-------------|
| Al-Fajr / Al-Balad | وَ oaths vs لَا أُقْسِمُ |
| Ad-Duha / Al-Inshirah | يَجِدْكَ vs نَشْرَحْ |
| Al-Kafirun 2-3 / 4-5 | Present vs Future |
| Ending patterns | Group by final phrases |

**Action items:**
1. Make flashcards for these pairs
2. Practice rapid identification
3. Recite pairs back-to-back to feel differences
4. Note any other similarities you discover!

**Coming up in Unit 11:** Revision strategies for large portions!`
      }
    ],
    memorizationTechniques: [
      "Group surahs by similar openings and endings",
      "Use context (time vs place, He vs We) to distinguish",
      "Al-Kafirun: 2-3 = now, 4-5 = forever"
    ],
    keyVocabulary: [
      { arabic: "وَالْفَجْرِ", transliteration: "Wal-Fajr", meaning: "By the dawn (Surah 89)" },
      { arabic: "لَا أُقْسِمُ", transliteration: "Laa Uqsimu", meaning: "I swear (oath formula)" },
      { arabic: "أَلَمْ يَجِدْكَ", transliteration: "Alam yajidka", meaning: "Did He not find you" },
      { arabic: "أَلَمْ نَشْرَحْ", transliteration: "Alam nashrah", meaning: "Did We not expand" }
    ]
  }
];

  // ─────────────────────────────────────────────────────────────────────────
  // UNIT 10 REVIEW: Mutashabihat Consolidation
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-unit10-review",
    unit: 10,
    unitTitle: "Mutashabihat - Similar Verses",
    path: "advanced",
    number: 33.5,
    title: "Unit 10 Review - Mutashabihat Mastery",
    description: "Consolidate strategies for similar verses",
    surah: 93,
    ayahStart: 1,
    ayahEnd: 8,
    estimatedMinutes: 15,
    xpReward: 150,
    isUnitReview: true,
    steps: [
      {
        id: "u10r-intro",
        type: "instruction",
        title: "Mutashabihat Review 🔍",
        content: `**You've learned to tackle similar verses!**

**Key strategies:**
1. Create a dedicated mutashabihat notebook
2. Understand the context - WHY does each version appear?
3. Focus on the DISTINGUISHING words
4. Use numerical associations
5. Recite pairs side-by-side`
      },
      {
        id: "u10r-quiz",
        type: "exercise",
        title: "Quick Distinction Test",
        content: "Apply your mutashabihat skills:",
        exercise: {
          type: "word_match",
          question: "How do you distinguish Ad-Duha (93) from Al-Inshirah (94) openings?",
          options: [
            "They're identical - no distinction needed",
            "Duha uses يَجِدْكَ (He found you), Inshirah uses نَشْرَحْ (We expanded)",
            "Duha is longer than Inshirah",
            "Inshirah comes before Duha in order"
          ],
          correctAnswer: 1,
          explanation: "Ad-Duha asks 'أَلَمْ يَجِدْكَ' (Did He not FIND you) - third person. Al-Inshirah asks 'أَلَمْ نَشْرَحْ' (Did WE not EXPAND) - first person. Person and verb differ!"
        }
      },
      {
        id: "u10r-summary",
        type: "instruction",
        title: "Mutashabihat Strategies Mastered! ✅",
        content: `**You can now handle similar verses!**

**Remember:**
- Mutashabihat require EXTRA review time
- Context is your best friend
- Test specifically on the differences
- Teach others to cement your knowledge

**Ready for Revision Strategies!**`
      }
    ],
    memorizationTechniques: [
      "Dedicated mutashabihat notebook",
      "Context determines which version",
      "Test specifically on differences"
    ],
    keyVocabulary: []
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 11: REVISION STRATEGIES (Lessons 34-36)
 * Master techniques for maintaining large portions
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_11_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 34: The Science of Revision
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-6",
    unit: 11,
    unitTitle: "Revision Strategies",
    path: "advanced",
    number: 34,
    title: "The Science of Revision",
    description: "Understand how memory works and build an effective revision system",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 30,
    xpReward: 125,
    mastery_required: 75, // Must understand mutashabihat before revision strategies
    steps: [
      {
        id: "adv6-intro",
        type: "instruction",
        title: "Why Revision Matters More Than Memorization",
        content: `**The Prophet ﷺ said:**
"Keep reviewing the Quran, for by the One in Whose Hand is my soul, it escapes faster than camels from their ropes." (Bukhari & Muslim)

**The harsh truth:**
Memorizing is 20% of the work.
KEEPING IT is 80%.

**Why we forget:**
1. **Decay:** Neural pathways weaken without use
2. **Interference:** New memories compete with old
3. **Retrieval failure:** It's there, but you can't access it

**The solution:**
Strategic revision that works WITH your brain, not against it!

**In this lesson:**
- Understanding the forgetting curve
- Spaced repetition principles
- Building a sustainable system
- Different types of revision`
      },
      {
        id: "adv6-forgetting-curve",
        type: "explanation",
        title: "The Forgetting Curve",
        content: `**Ebbinghaus's Forgetting Curve:**

After learning something new:
- After 20 minutes: ~58% retained
- After 1 hour: ~44% retained
- After 1 day: ~34% retained
- After 1 week: ~25% retained
- After 1 month: ~21% retained

**Without review, you lose most of what you learn!**

**But there's good news:**
Each review "resets" and STRENGTHENS the memory!

**After 1st review:** Forgetting slows
**After 2nd review:** Even slower
**After 3rd review:** Much more stable
**After 5+ reviews:** Approaches permanent memory

**For Quran:**
- New memorization: Review same day, next day, 3 days, 1 week, 2 weeks, 1 month
- Old memorization: Regular cycles to maintain

**Key insight:**
It's not about HOW MUCH you review, but WHEN you review!
Reviewing at the right time (just before forgetting) is most effective.`
      },
      {
        id: "adv6-spaced-repetition",
        type: "explanation",
        title: "Spaced Repetition for Quran",
        content: `**Spaced Repetition:** Review at increasing intervals

**Classic schedule for NEW memorization:**

**Day 1:** Memorize Surah X, review 3x same day
**Day 2:** Review Surah X morning and evening
**Day 3:** Review Surah X once
**Day 5:** Review Surah X once
**Day 7:** Review Surah X once
**Day 14:** Review Surah X once
**Day 30:** Review Surah X once
**Day 60:** Review Surah X once
**Day 90:** Add to regular rotation

**For maintained portions:**

**Juz Amma (30th Juz):**
If you've memorized all of it:
- Recite 1 surah per day minimum
- Complete the Juz in ~30 days
- Or: 2-3 surahs daily to finish in 2 weeks

**Multiple Juz:**
- Divide into daily portions
- Rotate: Yesterday's new portion → Today's revision
- Weekly: Full Juz review at least once

**Quality check:**
Can you recite without looking? Without hesitation? With proper tajweed?
If NO, it needs MORE review!`
      },
      {
        id: "adv6-types-of-revision",
        type: "explanation",
        title: "Types of Revision",
        content: `**Not all revision is the same!**

**1. Fresh Revision (مُرَاجَعَة جَدِيدَة):**
- For newly memorized portions (< 30 days old)
- High frequency: Daily or every other day
- Goal: Solidify before it fades

**2. Old Revision (مُرَاجَعَة قَدِيمَة):**
- For established portions (> 30 days old)
- Lower frequency: Weekly or bi-weekly
- Goal: Maintain and catch weakening spots

**3. Deep Revision (مُرَاجَعَة مُعَمَّقَة):**
- Slow, focused recitation
- Check tajweed, meanings, context
- Fix ingrained mistakes

**4. Fast/Testing Revision (مُرَاجَعَة سَرِيعَة):**
- Quick recitation to test recall
- Identify weak spots for deeper work
- Build confidence and speed

**5. Listening Revision (مُرَاجَعَة بِالسَّمْع):**
- Listen to a Qari while following along
- Passive but reinforcing
- Good for commutes, chores

**Mix all types for complete mastery!**`
      },
      {
        id: "adv6-system",
        type: "explanation",
        title: "Building Your System",
        content: `**A practical daily revision system:**

**Morning (After Fajr) - 20-30 minutes:**
- New memorization (if applicable)
- Fresh revision of recent portions
- This is when memory is sharpest!

**Midday (Dhuhr time) - 10-15 minutes:**
- Quick revision of 1 Juz or portion
- Testing mode: How much can you recall?

**Evening (After Maghrib/Isha) - 15-20 minutes:**
- Old revision rotation
- Deep revision of weak spots
- Listening revision before sleep

**Weekly:**
- 1 complete Juz review (minimum)
- Mutashabihat practice session
- Test yourself with a partner/teacher

**Monthly:**
- Full progress assessment
- Adjust system based on weak areas
- Set next month's goals

**Key principles:**
1. Same time daily = habit formation
2. Short, frequent > long, rare
3. Test yourself, don't just read
4. Track what you've covered`
      },
      {
        id: "adv6-quiz",
        type: "exercise",
        title: "Revision Strategy Quiz",
        content: "Test your understanding!",
        exercise: {
          type: "comprehension",
          question: "According to spaced repetition, when is the BEST time to review something?",
          options: [
            "Immediately after first learning it",
            "Just before you would naturally forget it",
            "Once a month regardless of when you learned it",
            "Only when you realize you've forgotten it"
          ],
          correctAnswer: 1,
          explanation: "Just before forgetting! This is when review is most effective. Reviewing too early is inefficient (you still know it), too late means you've lost it. Spaced repetition schedules reviews at optimal intervals."
        }
      },
      {
        id: "adv6-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Outstanding! You understand the science of revision!**

**Key principles:**
1. **Forgetting is natural** - fight it with strategic review
2. **Spaced repetition** - review at increasing intervals
3. **Types of revision** - fresh, old, deep, fast, listening
4. **System > motivation** - habits beat willpower
5. **Test yourself** - active recall beats passive review

**Build your system:**
- Morning: New + Fresh
- Midday: Quick test
- Evening: Old + Deep
- Weekly: Full Juz + Mutashabihat
- Monthly: Assessment + goals

**Coming up:** Practical techniques for different memorization amounts!`
      }
    ],
    memorizationTechniques: [
      "Review just before you'd forget - optimal timing",
      "Morning for new, evening for old",
      "Test yourself, don't just read"
    ],
    keyVocabulary: [
      { arabic: "مُرَاجَعَة", transliteration: "Muraaja'ah", meaning: "Revision/review" },
      { arabic: "تَثْبِيت", transliteration: "Tathbeet", meaning: "Consolidation/strengthening" },
      { arabic: "حِفْظ جَدِيد", transliteration: "Hifdh Jadeed", meaning: "New memorization" },
      { arabic: "حِفْظ قَدِيم", transliteration: "Hifdh Qadeem", meaning: "Old memorization" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 35: Revision Techniques by Amount
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-7",
    unit: 11,
    unitTitle: "Revision Strategies",
    path: "advanced",
    number: 35,
    title: "Revision Techniques by Amount",
    description: "Customize your revision based on how much you've memorized",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 30,
    xpReward: 125,
    steps: [
      {
        id: "adv7-intro",
        type: "instruction",
        title: "Different Amounts, Different Strategies",
        content: `Your revision strategy should match how much you've memorized!

**Categories:**

1. **Beginner (< 3 Juz):** Focus on quality
2. **Intermediate (3-10 Juz):** Balance new and old
3. **Advanced (10-20 Juz):** Systematic rotation
4. **Hafiz (20-30 Juz):** Maintenance mode

Each level has unique challenges and solutions.

**The danger:**
As you memorize more, revision time doesn't scale equally.
You can't spend 1 hour per Juz if you have 20 Juz!

**The solution:**
Efficient systems that maximize retention with minimal time.

Let's explore each level!`
      },
      {
        id: "adv7-beginner",
        type: "explanation",
        title: "Level 1: Beginner (< 3 Juz)",
        content: `**You have:** Juz Amma + possibly Juz 29 + some scattered surahs

**Your advantage:** Manageable amount, can review everything frequently

**Recommended system:**

**Daily:**
- Full Juz Amma review (in prayer or dedicated time)
- This takes 30-45 minutes of recitation
- Break it into: Morning (10 surahs) + Evening (remaining)

**New memorization:**
- 3-5 verses per day
- Review same day, next day, 3 days, 1 week

**Weekly:**
- Recite all you know to a listener
- Identify weak surahs for extra review

**Focus areas:**
- Perfect tajweed from the beginning
- Strong foundation in common surahs
- Master Mutashabihat early (Al-Kafirun, Quraysh/Fil)

**Common mistake:**
Racing to memorize more before solidifying what you have.
RESIST! Quality now saves time later.`
      },
      {
        id: "adv7-intermediate",
        type: "explanation",
        title: "Level 2: Intermediate (3-10 Juz)",
        content: `**You have:** Several Juz, possibly non-contiguous

**Your challenge:** Balancing new memorization with growing revision load

**Recommended system:**

**Daily revision rotation:**
- Day 1: Juz 30
- Day 2: Juz 29
- Day 3: Juz 28
- Day 4: Other portions
- Day 5: Juz 30 again
...and rotate

**New memorization:**
- 1/4 to 1/2 page daily
- NEVER skip revision for new memorization
- Rule: Don't add new until recent is solid

**Weekly goals:**
- Minimum 2 complete Juz reviews
- 1 deep revision session (slow, checking tajweed)
- 1 fast revision session (testing recall)

**The 3:1 rule:**
For every 1 unit of new memorization time, spend 3 units on revision.

**Organization tip:**
Create a tracking sheet:
| Juz | Last Reviewed | Strength (1-5) |
Mark each Juz when reviewed, note weak areas.`
      },
      {
        id: "adv7-advanced",
        type: "explanation",
        title: "Level 3: Advanced (10-20 Juz)",
        content: `**You have:** Significant portion, commitment is real!

**Your challenge:** Time management, avoiding weak spots

**The 20-Juz revision system:**

**Divide into 4 groups:**
- Group A: Juz 1-5
- Group B: Juz 6-10
- Group C: Juz 11-15
- Group D: Juz 16-20

**Weekly rotation:**
- Week 1: Focus on Group A (1 Juz/day) + quick review of B
- Week 2: Focus on Group B + quick review of C
- Week 3: Focus on Group C + quick review of D
- Week 4: Focus on Group D + quick review of A

**Daily breakdown:**
- Morning: 1 Juz deep revision (current group)
- Evening: 1 Juz quick revision (next group)

**New memorization:**
- Slow down! 1/4 page maximum
- Only after morning revision is complete
- Consider "revision months" with no new memorization

**Monthly:**
- Full 10+ Juz marathon (over a weekend)
- Identify the 3 weakest Juz for extra focus
- Adjust groups based on strength`
      },
      {
        id: "adv7-hafiz",
        type: "explanation",
        title: "Level 4: Hafiz (20-30 Juz)",
        content: `**You have:** Most or all of the Quran, MashaAllah!

**Your challenge:** Maintaining 600+ pages is a lifelong commitment

**Traditional Hafiz systems:**

**System 1: 1 Juz daily**
- Complete Quran in 30 days
- 45-60 minutes of recitation daily
- Sustainable but intensive

**System 2: 10 Juz rotation**
- Divide into 3 groups of 10 Juz
- Focus: 2 Juz from current group daily
- Complete each group in 5 days
- Full Quran in 15 days

**System 3: The Scholar's Method**
- 3 Juz daily: 1 deep + 2 quick
- Full Quran in 10 days
- Used by those teaching Quran

**Maintenance principles:**
1. NEVER skip a day (even sick, recite from memory)
2. Weekly: Recite to a listener/partner
3. Monthly: Identify 3 weakest Juz
4. Yearly: Full Quran recitation marathon
5. Lifetime: Teach others (best way to retain!)

**The Hafiz's prayer:**
Use your hifdh in Tahajjud, Taraweeh, and nafl prayers.
Nothing strengthens memory like using it for worship!`
      },
      {
        id: "adv7-practical",
        type: "explanation",
        title: "Practical Tips for All Levels",
        content: `**Universal principles:**

**1. Fixed time, fixed place:**
- Same time every day
- Same spot if possible
- Brain associates location with activity

**2. Start with bismillah and du'a:**
- Ask Allah to help you retain
- Spiritual focus improves concentration

**3. Recite aloud:**
- Engages more senses
- Catches errors you'd miss silently
- Strengthens neural pathways

**4. Use multiple mushhafs:**
- Visual memory is powerful
- Same font/layout helps "see" the page
- Mark weak spots with light pencil

**5. Connect to salah:**
- Recite new portions in prayer
- Immediate practical use
- Spiritual reward compounds

**6. Find an accountability partner:**
- Weekly check-ins
- Recite to each other
- Encourage when struggling

**7. Sleep and nutrition:**
- Memory consolidates during sleep
- Avoid heavy meals before revision
- Stay hydrated!

**8. Make du'a consistently:**
- "Rabbi zidni 'ilma" (My Lord, increase me in knowledge)
- The Quran is divine - seek divine help to retain it!`
      },
      {
        id: "adv7-quiz",
        type: "exercise",
        title: "Strategy Selection Quiz",
        content: "Test your system knowledge!",
        exercise: {
          type: "comprehension",
          question: "If you have 5 Juz memorized, what's the recommended revision:memorization ratio?",
          options: [
            "1:1 - Equal time for both",
            "3:1 - Three times more revision than new memorization",
            "1:3 - More new memorization than revision",
            "Only revision, no new memorization"
          ],
          correctAnswer: 1,
          explanation: "3:1 ratio! For every unit of time spent on new memorization, spend three units on revision. This prevents the common mistake of memorizing faster than you can retain."
        }
      },
      {
        id: "adv7-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Excellent! You have strategies for every level!**

**Summary by level:**

| Level | Amount | Key Strategy |
|-------|--------|--------------|
| Beginner | < 3 Juz | Full daily review, perfect foundation |
| Intermediate | 3-10 Juz | 3:1 ratio, rotating groups |
| Advanced | 10-20 Juz | 4-group weekly rotation |
| Hafiz | 20-30 Juz | 1-3 Juz daily, use in worship |

**Universal principles:**
- Fixed time and place
- Recite aloud
- Use in prayer
- Accountability partner
- Consistent du'a

**Coming up:** Troubleshooting common revision problems!`
      }
    ],
    memorizationTechniques: [
      "Match strategy to memorization amount",
      "3:1 ratio: revision to new memorization",
      "Group large amounts into rotating sections"
    ],
    keyVocabulary: [
      { arabic: "حَافِظ", transliteration: "Hafiz", meaning: "One who has memorized the Quran" },
      { arabic: "جُزْء", transliteration: "Juz", meaning: "One of 30 parts of the Quran" },
      { arabic: "وِرْد", transliteration: "Wird", meaning: "Daily portion/assignment" },
      { arabic: "سَبْر", transliteration: "Sabr", meaning: "Testing/examination of memory" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 36: Troubleshooting Revision Problems
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-8",
    unit: 11,
    unitTitle: "Revision Strategies",
    path: "advanced",
    number: 36,
    title: "Troubleshooting Revision Problems",
    description: "Solve common challenges in maintaining your memorization",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 30,
    xpReward: 150,
    steps: [
      {
        id: "adv8-intro",
        type: "instruction",
        title: "Everyone Struggles - Here's How to Overcome",
        content: `**Common revision problems:**

1. "I keep forgetting the same spots"
2. "I don't have enough time"
3. "I mix up similar verses"
4. "I've lost motivation"
5. "I can't recite without looking"
6. "My tajweed has gotten sloppy"
7. "I start but don't finish"
8. "Life got busy and I stopped"

**Good news:** Every Hafiz has faced these challenges!

**Better news:** There are proven solutions for each one.

Let's troubleshoot together!`
      },
      {
        id: "adv8-forgetting-spots",
        type: "explanation",
        title: "Problem: Same Spots Keep Slipping",
        content: `**"I keep forgetting the same verses/connections"**

**Why it happens:**
- Initial memorization was weak
- Not enough repetition at that spot
- Mental "skip" formed - brain jumps over it

**Solutions:**

**1. Isolation drilling:**
- Extract JUST the problematic verse
- Repeat 50+ times in one session
- Connect to verse before AND after

**2. Write it out:**
- Physical writing engages different memory
- Write the weak section 10 times
- Visualize the writing when reciting

**3. Create a "weak spot" list:**
- Document every problem area
- Dedicated 5 minutes daily to these specific spots
- Remove from list only after 7 consecutive days of no errors

**4. Change the connection:**
- If verse A → B is weak, strengthen B → A
- Recite backwards through the section
- This creates multiple pathways in memory

**5. Add meaning:**
- Understand WHY this verse follows the previous
- Meaningful connections are stronger than rote

**Example:**
If you forget the connection between Al-Fatiha verse 4 → 5:
- Verse 4: "Master of the Day of Judgment" (مَالِكِ يَوْمِ الدِّينِ)
- Verse 5: "You alone we worship" (إِيَّاكَ نَعْبُدُ)
- Connection: Because He's the Master of Judgment, we worship Him alone!`
      },
      {
        id: "adv8-no-time",
        type: "explanation",
        title: "Problem: Not Enough Time",
        content: `**"I can't find time for revision"**

**Reality check:**
- How much time do you spend on social media?
- Commuting? Waiting?
- The time exists - it needs to be claimed.

**Solutions:**

**1. Habit stacking:**
- Attach revision to existing habits
- After Fajr → Revision (already awake, already spiritual)
- During commute → Listening revision

**2. Micro-revision sessions:**
- 5 minutes is better than 0 minutes
- Review 10 verses while waiting for food
- One page while kettle boils

**3. Replace, don't add:**
- What can you sacrifice? (One show? Scrolling?)
- The Quran is more valuable

**4. Morning wins:**
- Wake 15 minutes earlier
- Best memory time, best barakah
- Small sacrifice, huge reward

**5. Non-negotiable minimum:**
- Set a "never miss" amount: "I WILL do at least 1 page daily"
- This baseline survives busy days
- Adjust UP when possible, never below

**6. Weekend batching:**
- If weekdays are impossible, use weekends
- 1-2 hours Saturday + Sunday = 5 weekday sessions

**Prophet's guidance:**
"The most beloved deeds to Allah are those done consistently, even if small." (Bukhari)

5 minutes daily > 2 hours once a week!`
      },
      {
        id: "adv8-mixing-verses",
        type: "explanation",
        title: "Problem: Mixing Up Similar Verses",
        content: `**"I confuse mutashabihat all the time"**

**Why it's hard:**
- Similar sound patterns
- Similar themes
- Brain takes shortcuts

**Solutions:**

**1. Dedicated mutashabihat sessions:**
- Don't just note them - actively drill them
- 10 minutes daily on JUST these
- Recite pairs side by side

**2. Visual differentiation:**
- In your mushaf, lightly mark differences
- Use colored tabs for similar sections
- Create mental "snapshots" of each page

**3. Surah association:**
- "معدودة in Baqarah because Baqarah is..."
- Create memorable reasons for each version
- Context anchors memory

**4. The comparison method:**
- Write both versions on paper
- Circle ONLY what's different
- Drill JUST the different parts

**5. Test specifically:**
- Don't just recite through
- Stop before the mutashabihat and ask: "Which version?"
- This is harder but more effective

**6. Teach someone:**
- Explaining the difference forces clarity
- You learn best what you teach

**Critical point:**
Mutashabihat require EXTRA effort - don't expect them to stick like normal verses.
Budget specific time for them!`
      },
      {
        id: "adv8-motivation",
        type: "explanation",
        title: "Problem: Lost Motivation",
        content: `**"I don't feel like revising anymore"**

**Normal!** Every Hafiz goes through this. But quitting is not an option.

**Solutions:**

**1. Remember your 'why':**
- Why did you start memorizing?
- Imagine reciting in Jannah
- Imagine the crown for your parents
- Write your 'why' and read it when struggling

**2. Change the environment:**
- New mushaf
- Different room
- Study with a partner
- Go to the masjid

**3. Vary the method:**
- Bored of reading? Listen
- Bored of listening? Write
- Bored of alone? Find a group

**4. Set small wins:**
- "I'll just do one page" (you often do more)
- Celebrate completing even small portions
- Track streaks - don't break the chain

**5. Connect to prayer:**
- Recite new portions in tahajjud
- Nothing motivates like worship

**6. Take a strategic break:**
- Not quitting - RESTING
- 2-3 days of only listening (no active recitation)
- Return with fresh energy

**7. Renew your intention:**
- Make wudu
- Sit with the Quran
- Make du'a for love of the Quran
- Read about the virtues of memorization

**The Prophet ﷺ said:**
"The one who recites the Quran while struggling with it will have DOUBLE reward." (Bukhari)

Your struggle is rewarded!`
      },
      {
        id: "adv8-dependency",
        type: "explanation",
        title: "Problem: Can't Recite Without Looking",
        content: `**"I need to see the mushaf or I can't remember"**

**Why it happens:**
- Visual memory became a crutch
- Not enough "blind" testing
- Memorized the PAGE, not the TEXT

**Solutions:**

**1. Close-test-open method:**
- Memorize looking at mushaf
- CLOSE it and try to recite
- Open ONLY when you forget
- Repeat until you need no help

**2. Audio-only revision:**
- Listen to a Qari and mouth along
- Then recite without any support
- Builds auditory memory

**3. Recite in the dark:**
- Literally! Sit in a dark room
- Or close your eyes
- Forces brain to rely on memory alone

**4. Different mushaf test:**
- Your brain may have memorized the PAGE LAYOUT
- Use a mushaf with different font/layout
- If you struggle, you memorized the image, not the text!

**5. Gradual weaning:**
- Week 1: Full mushaf available
- Week 2: Only peek at first word of each verse
- Week 3: Only peek at first word of each page
- Week 4: No peeking

**6. Recite to someone:**
- They hold the mushaf, you don't
- Social pressure helps focus
- Immediate correction

**Goal:** You should be able to recite any portion:
- In any location
- With any mushaf (or none)
- At any time of day

That's TRUE memorization!`
      },
      {
        id: "adv8-restart",
        type: "explanation",
        title: "Problem: I Stopped and Need to Restart",
        content: `**"Life happened and I haven't revised in months/years"**

**First: Don't despair!**
The Quran is still in your heart. It may be covered, but it's there.

**Restarting strategy:**

**1. Assess honestly:**
- What can you still recite?
- What's weak but recoverable?
- What's basically gone?

**2. Start with what's strong:**
- Build confidence with retained portions
- This proves you CAN do it
- Motivation builds

**3. Recovery is faster than initial memorization:**
- Neural pathways exist, just weakened
- What took months may return in weeks
- Be patient but persistent

**4. Don't expect perfection:**
- You'll make mistakes
- That's OKAY
- Progress over perfection

**5. Forgive yourself:**
- Guilt is shaytanic
- Make tawbah and move forward
- Allah loves those who return

**6. Rebuild the habit first:**
- First 2 weeks: Just recite ANYTHING daily
- Don't worry about how much
- Establish consistency, then increase

**7. Tell someone:**
- Accountability helps
- "I'm recommitting to my hifdh"
- Their support sustains you

**The Quran's promise:**
"And We have certainly made the Quran easy for remembrance." (54:17)

Allah made it easy. It can be recovered. Start today!`
      },
      {
        id: "adv8-quiz",
        type: "exercise",
        title: "Troubleshooting Quiz",
        content: "Test your problem-solving!",
        exercise: {
          type: "comprehension",
          question: "What's the BEST first step if you've stopped revising for months?",
          options: [
            "Try to recite everything you knew at once",
            "Assess what's retained vs lost, start with strong portions",
            "Memorize new material to build motivation",
            "Wait until you feel motivated to restart"
          ],
          correctAnswer: 1,
          explanation: "Assess first, then start with strong portions! Building confidence with what's retained creates momentum. Trying everything at once leads to frustration, and waiting for motivation means waiting forever."
        }
      },
      {
        id: "adv8-review",
        type: "instruction",
        title: "Advanced Path COMPLETE! 🏆",
        content: `**Alhamdulillah! You've completed the Advanced lesson path!**

**Problems and solutions covered:**
1. **Same spots slipping** → Isolation drilling, write it out
2. **No time** → Micro-sessions, habit stacking, morning wins
3. **Mixing verses** → Dedicated sessions, visual diff, teach others
4. **Lost motivation** → Remember why, vary methods, small wins
5. **Need to look** → Close-test-open, audio-only, different mushaf
6. **Need to restart** → Assess, start strong, forgive yourself

**Your complete journey:**

**Beginner Path:** Arabic foundations, reading skills, first surahs
**Intermediate Path:** Vocabulary, basic tajweed, short surah mastery
**Advanced Path:** Advanced tajweed, mutashabihat, revision science

**What's next?**
- Continue memorizing at your pace
- Maintain with the systems you've learned
- Teach others what you know
- The journey never ends!

**May Allah bless your hifdh and make you among the people of the Quran!**

"الَّذِينَ آتَيْنَاهُمُ الْكِتَابَ يَتْلُونَهُ حَقَّ تِلَاوَتِهِ"
"Those to whom We have given the Book recite it with its true recitation." (2:121)`
      }
    ],
    memorizationTechniques: [
      "Isolation drilling for persistent weak spots",
      "5 minutes daily beats 0 minutes",
      "Restart with strong portions to build momentum"
    ],
    keyVocabulary: [
      { arabic: "مُرَاجَعَة", transliteration: "Muraaja'ah", meaning: "Revision/review" },
      { arabic: "ضَعْف", transliteration: "Da'f", meaning: "Weakness (in memorization)" },
      { arabic: "تَثْبِيت", transliteration: "Tathbeet", meaning: "Strengthening/consolidation" },
      { arabic: "اِسْتِمْرَار", transliteration: "Istimrar", meaning: "Continuity/persistence" }
    ]
  }
];

  // ─────────────────────────────────────────────────────────────────────────
  // UNIT 11 REVIEW: Revision Systems Consolidation
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-unit11-review",
    unit: 11,
    unitTitle: "Revision Strategies",
    path: "advanced",
    number: 36.5,
    title: "Unit 11 Review - Revision Systems Mastery",
    description: "Consolidate your revision strategies",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 15,
    xpReward: 150,
    isUnitReview: true,
    steps: [
      {
        id: "u11r-intro",
        type: "instruction",
        title: "Revision Systems Review 📊",
        content: `**You've built a complete revision system!**

**Key principles learned:**
1. **Forgetting curve** - Review at optimal intervals
2. **Spaced repetition** - Increasing gaps between reviews
3. **3:1 ratio** - 3 parts revision to 1 part new memorization
4. **Level-appropriate systems** - Different amounts need different strategies
5. **Troubleshooting** - Solutions for common problems`
      },
      {
        id: "u11r-quiz",
        type: "exercise",
        title: "Revision Strategy Check",
        content: "Test your system knowledge:",
        exercise: {
          type: "word_match",
          question: "If you've stopped revising for months and want to restart, what's the BEST first step?",
          options: [
            "Try to recite everything at once",
            "Start memorizing new material to build momentum",
            "Assess what's retained, start with strong portions",
            "Wait until you feel motivated"
          ],
          correctAnswer: 2,
          explanation: "Assess first, then start with strong portions! Building confidence with retained material creates momentum. Never wait for motivation - systems beat willpower."
        }
      },
      {
        id: "u11r-summary",
        type: "instruction",
        title: "Revision Master! 📈",
        content: `**You have the tools to maintain your hifdh!**

**Your daily system:**
- Morning: New + Fresh revision
- Midday: Quick test
- Evening: Old + Deep revision

**Weekly:** Complete portion review + Mutashabihat
**Monthly:** Assessment + adjust

**Ready for Long Surah Strategies!**`
      }
    ],
    memorizationTechniques: [
      "3:1 ratio - revision:memorization",
      "Morning for new, evening for old",
      "Test yourself, don't just read"
    ],
    keyVocabulary: []
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 12: LONG SURAH STRATEGIES (Lessons 37-42)
 * Systematic approaches for memorizing Al-Baqarah and other long surahs
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_12_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 37: The Manzil System
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-9",
    unit: 12,
    unitTitle: "Long Surah Strategies",
    path: "advanced",
    number: 37,
    title: "The Manzil System",
    description: "Learn the traditional 7-day Quran completion system",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 25,
    xpReward: 125,
    steps: [
      {
        id: "adv9-intro",
        type: "instruction",
        title: "What is the Manzil System?",
        content: `**Manzil (مَنْزِل)** means "station" or "stopping place."

The Companions divided the Quran into **7 portions** for weekly completion.

**The Prophet ﷺ said:**
"Recite the Quran in seven days, and do not recite it in less than three days." (Abu Dawud)

**The 7 Manzils (فَمِي بِشَوْقٍ):**
Using the mnemonic "فَمِي بِشَوْقٍ" (My mouth with longing):

1. **ف** = Fatiha → Al-Nisa (1-4)
2. **م** = Ma'ida → At-Tawba (5-9)
3. **ي** = Yunus → An-Nahl (10-16)
4. **ب** = Bani Isra'il → Al-Furqan (17-25)
5. **ش** = Shu'ara → Ya-Sin (26-36)
6. **و** = Was-Saffat → Al-Hujurat (37-49)
7. **ق** = Qaf → An-Nas (50-114)

This system is perfect for revision!`
      },
      {
        id: "adv9-application",
        type: "explanation",
        title: "Applying the Manzil System",
        content: `**For Huffaz:**
- Recite 1 manzil per day = complete Quran weekly
- Each manzil takes 45-90 minutes

**For those still memorizing:**
- Use manzil divisions to track progress
- Complete what you know from each manzil
- Gradually fill in gaps

**Weekly Schedule Example:**
| Day | Manzil | Surahs |
|-----|--------|--------|
| Sat | 1 | Al-Fatiha to An-Nisa |
| Sun | 2 | Al-Ma'ida to At-Tawba |
| Mon | 3 | Yunus to An-Nahl |
| Tue | 4 | Al-Isra to Al-Furqan |
| Wed | 5 | Ash-Shu'ara to Ya-Sin |
| Thu | 6 | As-Saffat to Al-Hujurat |
| Fri | 7 | Qaf to An-Nas |

**Friday advantage:**
Manzil 7 includes Juz Amma - easiest to recite on the blessed day!`
      },
      {
        id: "adv9-quiz",
        type: "exercise",
        title: "Manzil Quiz",
        content: "Test your manzil knowledge!",
        exercise: {
          type: "comprehension",
          question: "The mnemonic 'فَمِي بِشَوْقٍ' helps remember the 7 manzils. What does ش stand for?",
          options: [
            "Surah Ash-Shams",
            "Surah Ash-Shu'ara (Manzil 5 start)",
            "Surah Ash-Sharh",
            "Surah As-Saff"
          ],
          correctAnswer: 1,
          explanation: "ش = Ash-Shu'ara, which begins Manzil 5 (covering Surahs 26-36, ending at Ya-Sin)."
        }
      },
      {
        id: "adv9-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**You've learned the Manzil System!**

**Remember:**
- فَمِي بِشَوْقٍ = 7 manzil starting letters
- 1 manzil per day = weekly Quran completion
- Flexible: adapt to your level

Apply this to your revision schedule!`
      }
    ],
    memorizationTechniques: [
      "فَمِي بِشَوْقٍ = mnemonic for 7 manzils",
      "One manzil daily = weekly completion",
      "Friday = Manzil 7 (Juz Amma)"
    ],
    keyVocabulary: [
      { arabic: "مَنْزِل", transliteration: "Manzil", meaning: "Station/portion" },
      { arabic: "فَمِي بِشَوْقٍ", transliteration: "Fami bi-shawqin", meaning: "My mouth with longing (mnemonic)" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 38: Al-Baqarah Strategy - First Page
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-10",
    unit: 12,
    unitTitle: "Long Surah Strategies",
    path: "advanced",
    number: 38,
    title: "Al-Baqarah - Beginning Your Journey",
    description: "Start memorizing the longest surah with proven strategies",
    surah: 2,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 40,
    xpReward: 150,
    mastery_required: 80, // Must master revision strategies before tackling Al-Baqarah
    steps: [
      {
        id: "adv10-intro",
        type: "instruction",
        title: "The Mountain Surah",
        content: `**Surah Al-Baqarah** - 286 verses, ~2.5 Juz

**Why memorize it?**
The Prophet ﷺ said:
"Recite Al-Baqarah, for taking it is a blessing, leaving it is a regret, and the magicians cannot withstand it." (Muslim)

"Whoever recites the last two verses of Al-Baqarah at night, they will suffice him." (Bukhari)

**Strategy overview:**
1. Break into manageable sections (~10-15 verses/week)
2. Learn themes to create mental structure
3. Focus on key passages first (Ayat al-Kursi, last 2 verses)
4. Consistent daily review

**Let's start with verses 1-5!**`
      },
      {
        id: "adv10-verses",
        type: "explanation",
        title: "Verses 1-5: The Guided Ones",
        arabicContent: "الم • ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ",
        content: `**الم (Alif-Lam-Meem)** - Mysterious letters

**ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ**
"This is the Book about which there is no doubt, a guidance for those conscious of Allah"

**Key vocabulary:**
- لَا رَيْبَ - no doubt
- هُدًى - guidance
- لِّلْمُتَّقِينَ - for the God-conscious

**Verses 3-4 describe the متقين:**
- They believe in the unseen
- Establish prayer
- Spend from what We provide
- Believe in revelation

**Verse 5:**
أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ
"Those are upon guidance from their Lord, and they are the successful."`
      },
      {
        id: "adv10-audio",
        type: "audio",
        title: "Listen and Memorize",
        content: "Begin with the opening:",
        audioSegment: { surah: 2, ayahStart: 1, ayahEnd: 5, repeat: 10 }
      },
      {
        id: "adv10-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "الم ﴿١﴾ ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ ﴿٢﴾",
        audioSegment: { surah: 2, ayahStart: 1, ayahEnd: 5 }
      },
      {
        id: "adv10-review",
        type: "instruction",
        title: "First Steps Complete! 🌟",
        content: `**You've begun Al-Baqarah!**

This is a marathon, not a sprint. Key lessons:
- 5 verses is a great daily goal
- Review yesterday's portion before adding new
- The opening describes WHO benefits from Quran

**Coming up:** Ayat al-Kursi - the greatest verse!`
      }
    ],
    memorizationTechniques: [
      "5-10 verses daily maximum",
      "Opening describes the Muttaqeen (God-conscious)",
      "Review before adding new content"
    ],
    keyVocabulary: [
      { arabic: "الم", transliteration: "Alif-Lam-Meem", meaning: "Mysterious letters" },
      { arabic: "لَا رَيْبَ", transliteration: "Laa rayba", meaning: "No doubt" },
      { arabic: "الْمُتَّقِينَ", transliteration: "Al-Muttaqeen", meaning: "The God-conscious" },
      { arabic: "الْمُفْلِحُونَ", transliteration: "Al-Muflihoon", meaning: "The successful" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 39: Ayat al-Kursi - The Greatest Verse
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-11",
    unit: 12,
    unitTitle: "Long Surah Strategies",
    path: "advanced",
    number: 39,
    title: "Ayat al-Kursi - The Greatest Verse",
    description: "Memorize the most powerful verse in the Quran",
    surah: 2,
    ayahStart: 255,
    ayahEnd: 257,
    estimatedMinutes: 35,
    xpReward: 175,
    steps: [
      {
        id: "adv11-intro",
        type: "instruction",
        title: "The Throne Verse",
        content: `**The Prophet ﷺ asked Ubayy ibn Ka'b:**
"Which verse in the Quran is the greatest?"
Ubayy said: "Allah and His Messenger know best."
He ﷺ said: "Ayat al-Kursi."

**Benefits:**
- Recite after every prayer → guaranteed Paradise (Nasa'i)
- Recite before sleep → protected until morning (Bukhari)
- Contains 10 complete sentences
- Mentions 5 Names of Allah

**This ONE verse contains:**
The essence of tawheed (monotheism) and Allah's attributes.`
      },
      {
        id: "adv11-breakdown",
        type: "explanation",
        title: "Breaking Down Ayat al-Kursi",
        arabicContent: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
        content: `**10 Sentences of Ayat al-Kursi:**

1. اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ - Allah, no god except Him
2. الْحَيُّ الْقَيُّومُ - The Ever-Living, Self-Sustaining
3. لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ - Neither drowsiness nor sleep overtakes Him
4. لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ - To Him belongs what is in the heavens and earth
5. مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ - Who can intercede except by His permission?
6. يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ - He knows what is before and behind them
7. وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ - They encompass nothing of His knowledge except what He wills
8. وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ - His Kursi extends over the heavens and earth
9. وَلَا يَئُودُهُ حِفْظُهُمَا - Their preservation doesn't tire Him
10. وَهُوَ الْعَلِيُّ الْعَظِيمُ - And He is the Most High, the Most Great

**Memorize sentence by sentence!**`
      },
      {
        id: "adv11-checkpoint",
        type: "checkpoint",
        title: "Halfway Through! ⭐",
        content: `**Excellent! You've learned the 10 sentences of Ayat al-Kursi.**

**Key concepts so far:**
1. لَا إِلَٰهَ إِلَّا هُوَ - No god except Him
2. الْحَيُّ الْقَيُّومُ - Ever-Living, Self-Sustaining
3. لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ - Neither drowsiness nor sleep
4. Everything in heavens and earth belongs to Him
5. No intercession except by His permission

This is THE most powerful verse. Continue to memorize it!`,
        progressPercent: 50,
        offerBreak: true
      },
      {
        id: "adv11-audio",
        type: "audio",
        title: "Listen and Memorize",
        content: "Listen to Ayat al-Kursi:",
        audioSegment: { surah: 2, ayahStart: 255, ayahEnd: 255, repeat: 15 }
      },
      {
        id: "adv11-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ ﴿٢٥٥﴾",
        audioSegment: { surah: 2, ayahStart: 255, ayahEnd: 255 }
      },
      {
        id: "adv11-review",
        type: "instruction",
        title: "The Greatest Verse Memorized! 🏆",
        content: `**MashaAllah! You've memorized Ayat al-Kursi!**

**Daily practice:**
- After every fard prayer
- Before sleeping
- For protection from evil

**This is one of the most important verses you'll ever memorize!**`
      }
    ],
    memorizationTechniques: [
      "10 sentences = 10 concepts",
      "Each sentence is a complete statement about Allah",
      "Recite after every prayer for Paradise"
    ],
    keyVocabulary: [
      { arabic: "الْحَيُّ", transliteration: "Al-Hayy", meaning: "The Ever-Living" },
      { arabic: "الْقَيُّومُ", transliteration: "Al-Qayyoom", meaning: "The Self-Sustaining" },
      { arabic: "كُرْسِيُّ", transliteration: "Kursi", meaning: "Throne/Footstool" },
      { arabic: "الْعَلِيُّ الْعَظِيمُ", transliteration: "Al-'Aliyy Al-'Azeem", meaning: "The Most High, Most Great" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 40: Last Two Verses of Al-Baqarah
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-12",
    unit: 12,
    unitTitle: "Long Surah Strategies",
    path: "advanced",
    number: 40,
    title: "Last Two Verses of Al-Baqarah",
    description: "Memorize the protective closing of Al-Baqarah",
    surah: 2,
    ayahStart: 285,
    ayahEnd: 286,
    estimatedMinutes: 30,
    xpReward: 150,
    steps: [
      {
        id: "adv12-intro",
        type: "instruction",
        title: "The Sufficient Verses",
        content: `**The Prophet ﷺ said:**
"Whoever recites the last two verses of Surah Al-Baqarah at night, they will suffice him." (Bukhari, Muslim)

**What do they suffice?**
- Protection from evil
- Reward for night prayer
- Spiritual and worldly sufficiency

These verses were given to the Prophet ﷺ during the Mi'raj (Night Journey) - they came directly from above the seven heavens!`
      },
      {
        id: "adv12-verses",
        type: "explanation",
        title: "The Final Verses",
        arabicContent: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ",
        content: `**Verse 285:**
آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ ۚ وَقَالُوا سَمِعْنَا وَأَطَعْنَا ۖ غُفْرَانَكَ رَبَّنَا وَإِلَيْكَ الْمَصِيرُ

**Key phrases:**
- سَمِعْنَا وَأَطَعْنَا - We hear and we obey
- غُفْرَانَكَ رَبَّنَا - Your forgiveness, our Lord

**Verse 286 contains the famous du'a:**
رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا
"Our Lord, do not take us to account if we forget or make a mistake..."`
      },
      {
        id: "adv12-audio",
        type: "audio",
        title: "Listen and Memorize",
        content: "Listen to these blessed verses:",
        audioSegment: { surah: 2, ayahStart: 285, ayahEnd: 286, repeat: 10 }
      },
      {
        id: "adv12-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "آمَنَ الرَّسُولُ بِمَا أُنزِلَ إِلَيْهِ مِن رَّبِّهِ وَالْمُؤْمِنُونَ ۚ كُلٌّ آمَنَ بِاللَّهِ وَمَلَائِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ لَا نُفَرِّقُ بَيْنَ أَحَدٍ مِّن رُّسُلِهِ",
        audioSegment: { surah: 2, ayahStart: 285, ayahEnd: 286 }
      },
      {
        id: "adv12-review",
        type: "instruction",
        title: "Night Protection Memorized! 🌙",
        content: `**Alhamdulillah! You've memorized the last two verses!**

**Nightly practice:**
- Recite before sleeping
- Protection throughout the night
- Given during the Mi'raj

**You now have 3 key Al-Baqarah passages:**
1. Opening (1-5)
2. Ayat al-Kursi (255)
3. Closing (285-286)`
      }
    ],
    memorizationTechniques: [
      "Recite every night before sleeping",
      "Contains articles of faith",
      "Ends with powerful du'a"
    ],
    keyVocabulary: [
      { arabic: "سَمِعْنَا وَأَطَعْنَا", transliteration: "Sami'na wa ata'na", meaning: "We hear and obey" },
      { arabic: "غُفْرَانَكَ", transliteration: "Ghufranaka", meaning: "Your forgiveness" },
      { arabic: "لَا تُؤَاخِذْنَا", transliteration: "La tu'akhidhna", meaning: "Do not hold us accountable" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 41: Speed and Fluency Exercises
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-13",
    unit: 12,
    unitTitle: "Long Surah Strategies",
    path: "advanced",
    number: 41,
    title: "Speed and Fluency Exercises",
    description: "Build recitation speed while maintaining accuracy",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 25,
    xpReward: 125,
    steps: [
      {
        id: "adv13-intro",
        type: "instruction",
        title: "Why Speed Matters",
        content: `**The goal isn't racing** - it's building fluency!

**Benefits of increased speed:**
1. Complete more revision in less time
2. Build confidence in memory
3. Prepare for Taraweeh leading
4. More natural recitation flow

**The Prophet ﷺ completed Quran with Jibreel annually** - this requires fluency!

**Important:** Never sacrifice tajweed for speed. Build gradually.`
      },
      {
        id: "adv13-techniques",
        type: "explanation",
        title: "Speed Building Techniques",
        content: `**Technique 1: The 3-Speed Method**
1. First pass: SLOW - focus on accuracy
2. Second pass: MEDIUM - comfortable pace
3. Third pass: FAST - push your limits
4. Return to SLOW to check mistakes

**Technique 2: Chunking**
Instead of verse-by-verse, recite in:
- 5-verse chunks
- Page chunks
- Theme-based sections
Larger chunks = fewer pauses = better flow

**Technique 3: Following a Fast Qari**
1. Choose a Qari with faster recitation (Mishary Rashid - muratal)
2. Try to keep up while reading along
3. Gradually reduce looking at mushaf
4. Eventually recite along from memory

**Technique 4: Timer Challenge**
1. Time your Juz recitation
2. Record the time
3. Try to beat it next week
4. Track improvement over months`
      },
      {
        id: "adv13-exercises",
        type: "practice",
        title: "Practice Exercise",
        content: `**Today's Exercise: Juz Amma Speed Run**

1. Set a timer
2. Recite from An-Naba (78) to An-Nas (114)
3. Maintain tajweed but push for fluency
4. Record your time

**Target times:**
- Beginner: 45-60 minutes
- Intermediate: 30-45 minutes
- Advanced: 20-30 minutes
- Master: Under 20 minutes

**Start your timer and begin!**`
      },
      {
        id: "adv13-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**You've learned speed-building techniques!**

**Weekly practice:**
- One timed recitation per week
- Track your progress
- Never sacrifice accuracy

**Remember:** Fluency comes from consistent practice, not rushing!`
      }
    ],
    memorizationTechniques: [
      "3-Speed Method: Slow → Medium → Fast → Slow",
      "Chunk larger portions for better flow",
      "Follow along with fast Qaris"
    ],
    keyVocabulary: [
      { arabic: "سُرْعَة", transliteration: "Sur'ah", meaning: "Speed" },
      { arabic: "طَلَاقَة", transliteration: "Talaaqa", meaning: "Fluency" },
      { arabic: "تَدَرُّج", transliteration: "Tadarruj", meaning: "Gradual progression" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 42: Teaching Others - The Best Practice
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-14",
    unit: 12,
    unitTitle: "Long Surah Strategies",
    path: "advanced",
    number: 42,
    title: "Teaching Others - The Best Practice",
    description: "Learn how teaching strengthens your own memorization",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 25,
    xpReward: 150,
    steps: [
      {
        id: "adv14a-intro",
        type: "instruction",
        title: "The Teacher's Reward",
        content: `**The Prophet ﷺ said:**
"The best of you are those who learn the Quran and teach it." (Bukhari)

**Why teaching helps YOUR hifdh:**
1. Forces you to review deeply
2. Reveals gaps you didn't know existed
3. Strengthens neural pathways through repetition
4. Creates accountability
5. Earns extra reward

**You don't need to be a scholar to teach!**
Even teaching one surah to a child qualifies.`
      },
      {
        id: "adv14a-how",
        type: "explanation",
        title: "How to Start Teaching",
        content: `**Step 1: Start with what you know best**
- Your strongest surahs
- Juz Amma is perfect for beginners

**Step 2: Find a student**
- Your own children
- Younger siblings
- Mosque weekend school
- Online teaching platforms
- New Muslim revert circles

**Step 3: Prepare properly**
- Review the surah multiple times
- Know the tajweed rules that apply
- Understand the basic meaning
- Prepare for common mistakes

**Step 4: Use the sandwich method**
- Model (you recite)
- Practice (they recite with you)
- Independent (they recite alone)

**Step 5: Be patient**
The Prophet ﷺ was the most patient teacher!`
      },
      {
        id: "adv14a-review",
        type: "instruction",
        title: "Become a Link in the Chain",
        content: `**The Quran has been transmitted teacher-to-student for 1400+ years.**

When you teach, you become part of this blessed chain (سِلْسِلَة).

**Your assignment:**
1. Choose one surah you know well
2. Find one person to teach it to
3. Complete teaching it within 2 weeks
4. Notice how much stronger YOUR memory becomes!

**The Prophet ﷺ said:**
"Convey from me, even if it is one verse." (Bukhari)

Start today!`
      }
    ],
    memorizationTechniques: [
      "Teaching forces deep review",
      "Start with your strongest surahs",
      "Use the sandwich method: Model → Practice → Independent"
    ],
    keyVocabulary: [
      { arabic: "مُعَلِّم", transliteration: "Mu'allim", meaning: "Teacher" },
      { arabic: "سِلْسِلَة", transliteration: "Silsila", meaning: "Chain (of transmission)" },
      { arabic: "بَلِّغُوا", transliteration: "Ballighoo", meaning: "Convey" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 43: Advanced Path Completion
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "adv-lesson-15",
    unit: 12,
    unitTitle: "Long Surah Strategies",
    path: "advanced",
    number: 43,
    title: "Advanced Path Completion - Your Hifdh Journey",
    description: "Celebrate your achievements and plan your ongoing journey",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 20,
    xpReward: 300,
    steps: [
      {
        id: "adv14-celebration",
        type: "instruction",
        title: "Congratulations, Advanced Learner! 🏆",
        content: `**Alhamdulillah! You've completed ALL paths!**

**Your complete journey:**

**Beginner Path (Units 1-5):**
✅ Arabic alphabet
✅ Letter forms and connections
✅ Vowels and reading skills
✅ First surah memorization

**Intermediate Path (Units 6-8):**
✅ Quranic vocabulary and roots
✅ Tajweed rules (Noon, Meem, Madd, Qalqalah)
✅ Al-Mulk memorization
✅ Al-Kahf first 10 verses

**Advanced Path (Units 9-12):**
✅ Advanced tajweed
✅ Mutashabihat strategies
✅ Revision systems
✅ Long surah strategies
✅ Manzil system
✅ Al-Baqarah key passages`
      },
      {
        id: "adv14-future",
        type: "instruction",
        title: "Your Ongoing Journey",
        content: `**The journey of a Hafiz never ends!**

**Lifetime goals:**
1. Complete memorization of the entire Quran
2. Perfect your tajweed with a qualified teacher
3. Learn the meanings (tafsir) of what you recite
4. Teach others what you know
5. Recite regularly in night prayers

**Daily practice:**
- Morning: New memorization (if applicable)
- Afternoon: Review recent portions
- Evening: Old revision rotation
- Night: Use memorization in Tahajjud

**The Prophet ﷺ said:**
"The best of you are those who learn the Quran and teach it." (Bukhari)

**You are now among the People of the Quran! 📖**`
      },
      {
        id: "adv14-dua",
        type: "instruction",
        title: "Final Du'a",
        content: `**اللَّهُمَّ اجْعَلْنِي مِنْ أَهْلِ الْقُرْآنِ الَّذِينَ هُمْ أَهْلُكَ وَخَاصَّتُكَ**

"O Allah, make me from the people of the Quran who are Your people and Your special ones."

**رَبَّنَا تَقَبَّلْ مِنَّا ۖ إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ**

"Our Lord, accept from us. Indeed You are the Hearing, the Knowing."

**May your memorization be a light for you in this life, in the grave, and on the Day of Judgment.**

**Ameen! 🤲**`
      }
    ],
    memorizationTechniques: [
      "The journey never ends - keep learning",
      "Teach others to solidify your own knowledge",
      "Use your hifdh in worship (Tahajjud, Taraweeh)"
    ],
    keyVocabulary: [
      { arabic: "أَهْلُ الْقُرْآنِ", transliteration: "Ahl al-Quran", meaning: "People of the Quran" },
      { arabic: "حَافِظ", transliteration: "Hafiz", meaning: "One who memorized the Quran" },
      { arabic: "رِحْلَة", transliteration: "Rihla", meaning: "Journey" }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_ADVANCED_LESSONS: Lesson[] = [
  ...UNIT_9_LESSONS,
  ...UNIT_10_LESSONS,
  ...UNIT_11_LESSONS,
  ...UNIT_12_LESSONS
];

export const ADVANCED_UNITS = [
  { number: 9, title: "Advanced Tajweed", lessons: 4, description: "Qalqalah, advanced idgham, complete madd system, + Review", hasReview: true },
  { number: 10, title: "Mutashabihat - Similar Verses", lessons: 3, description: "Strategies for distinguishing similar verses, + Review", hasReview: true },
  { number: 11, title: "Revision Strategies", lessons: 4, description: "Science-backed systems for maintaining memorization, + Review", hasReview: true },
  { number: 12, title: "Long Surah Strategies", lessons: 7, description: "Manzil system, Al-Baqarah key passages, speed, teaching" }
];
