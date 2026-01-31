/**
 * Quran Oasis - Complete Lesson Content
 * A true zero-to-hifz curriculum for adults with no Arabic knowledge
 * 
 * Philosophy:
 * - Patient, encouraging tone
 * - Never assume prior knowledge
 * - Explain WHY, not just WHAT
 * - Celebrate small wins
 */

export type LessonType = "alphabet" | "reading" | "vocabulary" | "memorization" | "review" | "concept";

export type ExerciseType = 
  | "listen_repeat"      // Listen to audio and repeat
  | "letter_identify"    // Identify Arabic letter
  | "word_match"         // Match Arabic words with meanings
  | "fill_blank"         // Fill in missing words
  | "recite_test"        // Recite from memory
  | "pronunciation"      // Practice pronunciation
  | "letter_forms"       // Match letter forms
  | "comprehension";     // Answer questions about meaning

export interface LessonStep {
  id: string;
  type: "instruction" | "audio" | "exercise" | "explanation" | "practice";
  title: string;
  content: string;
  arabicContent?: string;
  audioSegment?: {
    surah: number;
    ayahStart: number;
    ayahEnd: number;
    repeat?: number;
  };
  exercise?: {
    type: ExerciseType;
    question: string;
    options?: string[];
    correctAnswer: string | number;
    explanation?: string;
  };
}

export interface Lesson {
  id: string;
  unit: number;
  unitTitle: string;
  path: "beginner" | "intermediate" | "advanced";
  number: number;
  title: string;
  description: string;
  surah: number;
  ayahStart: number;
  ayahEnd: number;
  estimatedMinutes: number;
  xpReward: number;
  prerequisites?: string[]; // EMPTY for testing - all lessons unlocked
  steps: LessonStep[];
  memorizationTechniques: string[];
  keyVocabulary: Array<{
    arabic: string;
    transliteration: string;
    meaning: string;
  }>;
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 1: ARABIC FOUNDATIONS (Lessons 1-5)
 * Learn the Arabic alphabet from scratch
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_1_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 1: Arabic Alphabet Part 1 - أ ب ت ث ج ح خ
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-1",
    unit: 1,
    unitTitle: "Arabic Foundations",
    path: "beginner",
    number: 1,
    title: "The Arabic Alphabet - Part 1",
    description: "Learn your first 7 Arabic letters: Alif, Ba, Ta, Tha, Jeem, Ha, Kha",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    estimatedMinutes: 20,
    xpReward: 50,
    steps: [
      {
        id: "l1-welcome",
        type: "instruction",
        title: "Welcome to Your Arabic Journey! 🌟",
        content: `Assalamu alaikum! You're about to learn to read the language of the Quran.

Here's something beautiful: Arabic has only 28 letters. That's fewer than English's 52 (uppercase + lowercase)! And unlike English, Arabic is completely phonetic - every letter makes ONE sound, always.

In this lesson, you'll learn your first 7 letters. By the end, you'll be able to recognize them anywhere in the Quran. Take your time - there's no rush. The Prophet ﷺ said: "The one who recites the Quran while struggling with it will have a double reward."

Let's begin with the very first letter...`
      },
      {
        id: "l1-alif",
        type: "explanation",
        title: "Letter 1: Alif (أ)",
        arabicContent: "أ",
        content: `**ALIF (أ)** - The King of Letters

**Sound:** Like the 'a' in "father" or the 'u' in "up"
**Shape:** A single vertical line - the simplest letter!

**How to say it:** Open your mouth slightly and let the sound come from your throat. It's a pure, open vowel sound.

**Memory trick:** Alif stands ALONE like the number 1. It's the first letter, and it looks like the number 1!

**Quran example:** The very first word of revelation was "اقْرَأْ" (Iqra - Read!). See the Alif at the beginning?

**Fun fact:** Alif is unique - it never connects to the letter after it. It's independent, like a leader standing at the front.`
      },
      {
        id: "l1-alif-practice",
        type: "exercise",
        title: "Find the Alif",
        content: "Which of these is Alif?",
        exercise: {
          type: "letter_identify",
          question: "Select the letter Alif (the vertical line):",
          options: ["أ", "ب", "ت", "ث"],
          correctAnswer: 0,
          explanation: "Correct! أ (Alif) is the straight vertical line. It's the simplest Arabic letter to recognize."
        }
      },
      {
        id: "l1-ba",
        type: "explanation",
        title: "Letter 2: Ba (ب)",
        arabicContent: "ب",
        content: `**BA (ب)** - The Boat with One Dot

**Sound:** Exactly like English 'b' in "book"
**Shape:** A curved boat shape with ONE dot BELOW

**How to say it:** Press your lips together and release with voice - just like English!

**Memory trick:** Think "Ba = Boat with a Ball (dot) Below"
The dot is like a ball that rolled under the boat and got stuck there.

**Writing tip:** Start from the right, draw the curve, then add the dot below.

**Quran connection:** "بِسْمِ" (Bismi - In the name of) - the first word you'll memorize starts with Ba!`
      },
      {
        id: "l1-ba-practice",
        type: "exercise",
        title: "Find the Ba",
        content: "Which letter has ONE dot BELOW?",
        exercise: {
          type: "letter_identify",
          question: "Select Ba (ب) - the letter with ONE dot below:",
          options: ["ت", "ث", "ب", "أ"],
          correctAnswer: 2,
          explanation: "Excellent! ب (Ba) has ONE dot below the boat shape. The dots are crucial - they're what distinguish similar letters!"
        }
      },
      {
        id: "l1-ta",
        type: "explanation",
        title: "Letter 3: Ta (ت)",
        arabicContent: "ت",
        content: `**TA (ت)** - The Boat with Two Dots on Top

**Sound:** Exactly like English 't' in "table"
**Shape:** Same boat as Ba, but TWO dots ABOVE

**How to say it:** Touch your tongue to the roof of your mouth behind your teeth and release.

**Memory trick:** "Ta = Two dots on Top"
Both words start with T!

**The Ba-Ta family:** Notice that ب, ت, and the next letter ث all share the same base shape. The DOTS are what make them different!
- ب = 1 dot below = Ba
- ت = 2 dots above = Ta
- ث = 3 dots above = Tha

This is a pattern in Arabic - similar shapes, different dots.`
      },
      {
        id: "l1-tha",
        type: "explanation",
        title: "Letter 4: Tha (ث)",
        arabicContent: "ث",
        content: `**THA (ث)** - The Boat with Three Dots

**Sound:** Like 'th' in "think" (NOT like "the")
**Shape:** Same boat, but THREE dots above

**How to say it:** Put your tongue between your teeth and blow air. It's the soft 'th' sound.

**Memory trick:** "THree dots for THa"
Count them: ث has 1-2-3 dots on top!

**Common mistake:** Don't confuse this with the 'th' in "the" - that's a different sound. Tha (ث) is lighter, like in "thought" or "think."

**Practice:** Say "think" slowly. Feel where your tongue is? That's the Tha position.`
      },
      {
        id: "l1-boat-family-quiz",
        type: "exercise",
        title: "The Boat Family Quiz 🚣",
        content: "Let's test your knowledge of ب ت ث",
        exercise: {
          type: "letter_identify",
          question: "Which letter makes the 'th' sound (as in 'think')?",
          options: ["ب (Ba)", "ت (Ta)", "ث (Tha)"],
          correctAnswer: 2,
          explanation: "Perfect! ث (Tha) with THREE dots makes the 'th' sound. Remember: THree dots for THa!"
        }
      },
      {
        id: "l1-jeem",
        type: "explanation",
        title: "Letter 5: Jeem (ج)",
        arabicContent: "ج",
        content: `**JEEM (ج)** - The Letter with a Belly

**Sound:** Like 'j' in "jam" (in most Arabic dialects)
**Shape:** A curved shape with a dot in the middle/belly

**How to say it:** Touch the middle of your tongue to the roof of your mouth and release with voice. Like starting to say "jam."

**Memory trick:** Jeem has a dot in its "tummy" - like it just ate something!

**Shape insight:** This letter has a hook at the top and a curved belly. The dot sits inside that belly, like food it just ate!

**Regional note:** In Egyptian Arabic, this sounds more like a hard 'g'. In Quranic recitation, we use the classical 'j' sound.`
      },
      {
        id: "l1-ha",
        type: "explanation",
        title: "Letter 6: Ha (ح)",
        arabicContent: "ح",
        content: `**HA (ح)** - The Breathless One

**Sound:** A breathy 'h' from deep in your throat - no English equivalent!
**Shape:** Same as Jeem, but NO DOT

**How to say it:** This is your first truly Arabic sound! Imagine you're fogging up a mirror, but from deeper in your throat. Or like a heavy sigh.

**Memory trick:** "ح is Hungry for a dot" - but it doesn't have one!
Compare: ج (Jeem) has eaten a dot, ح (Ha) is empty inside.

**Practice technique:** 
1. Say "ha" as if you're fogging a mirror
2. Now push that sound deeper into your throat
3. It should feel like it comes from where you swallow

**Be patient:** This sound takes practice. Don't worry if it's not perfect yet - you'll hear it many times in Quran recitation and your ear will train your tongue.`
      },
      {
        id: "l1-kha",
        type: "explanation",
        title: "Letter 7: Kha (خ)",
        arabicContent: "خ",
        content: `**KHA (خ)** - The Scratchy One

**Sound:** Like clearing your throat, or the 'ch' in Scottish "loch"
**Shape:** Same as ج and ح, but with a dot ABOVE

**How to say it:** This is a raspy, friction sound from the back of your throat. Imagine gargling without water!

**Memory trick:** Kha sounds like you're "coughing" - and cough has a 'K' sound at the start!

**The ج-ح-خ Family:**
- ج (Jeem) = dot INSIDE = 'j' sound
- ح (Ha) = NO dot = breathy 'h'
- خ (Kha) = dot ABOVE = scratchy 'kh'

**Practice:** Say the word "Bach" (the composer) with a German accent. That final sound is close to Kha!

**Congratulations!** You've learned your first 7 letters! 🎉`
      },
      {
        id: "l1-family-quiz",
        type: "exercise",
        title: "The ج-ح-خ Family Quiz",
        content: "These three letters look similar. Can you tell them apart?",
        exercise: {
          type: "letter_identify",
          question: "Which letter has NO dot at all?",
          options: ["ج (Jeem)", "ح (Ha)", "خ (Kha)"],
          correctAnswer: 1,
          explanation: "Yes! ح (Ha) has no dot - it's 'Hungry' for a dot but doesn't have one. ج has a dot inside, and خ has a dot above."
        }
      },
      {
        id: "l1-review",
        type: "instruction",
        title: "Lesson 1 Complete! 🌟",
        content: `**Mashallah! You've learned 7 Arabic letters!**

Let's review what you now know:

**The Independent:**
أ (Alif) - 'a' sound - the vertical line, stands alone

**The Boat Family:**
ب (Ba) - 'b' sound - 1 dot below
ت (Ta) - 't' sound - 2 dots above
ث (Tha) - 'th' sound - 3 dots above

**The Belly Family:**
ج (Jeem) - 'j' sound - dot inside
ح (Ha) - breathy 'h' - no dot (hungry!)
خ (Kha) - scratchy 'kh' - dot above

**Your homework:**
1. Look at any Arabic text and try to spot these 7 letters
2. Practice the two new sounds: ح (Ha) and خ (Kha)
3. Write each letter 5 times if you have paper

You're 25% through the alphabet! Keep going! 💪`
      }
    ],
    memorizationTechniques: [
      "Use the memory tricks: 'THree dots for THa', 'Ha is Hungry'",
      "Group similar shapes: The Boat Family (ب ت ث) and The Belly Family (ج ح خ)",
      "Practice writing each letter while saying its sound"
    ],
    keyVocabulary: [
      { arabic: "أ", transliteration: "Alif", meaning: "'a' sound - vertical line" },
      { arabic: "ب", transliteration: "Ba", meaning: "'b' sound - 1 dot below" },
      { arabic: "ت", transliteration: "Ta", meaning: "'t' sound - 2 dots above" },
      { arabic: "ث", transliteration: "Tha", meaning: "'th' sound - 3 dots above" },
      { arabic: "ج", transliteration: "Jeem", meaning: "'j' sound - dot inside" },
      { arabic: "ح", transliteration: "Ha", meaning: "breathy 'h' - no dot" },
      { arabic: "خ", transliteration: "Kha", meaning: "scratchy 'kh' - dot above" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 2: Arabic Alphabet Part 2 - د ذ ر ز س ش ص ض
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-2",
    unit: 1,
    unitTitle: "Arabic Foundations",
    path: "beginner",
    number: 2,
    title: "The Arabic Alphabet - Part 2",
    description: "Learn 8 more letters: Dal, Dhal, Ra, Zay, Seen, Sheen, Sad, Dad",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    estimatedMinutes: 25,
    xpReward: 50,
    steps: [
      {
        id: "l2-intro",
        type: "instruction",
        title: "Building on Your Foundation",
        content: `Welcome back! In Lesson 1, you learned 7 letters. Today you'll learn 8 more!

**Quick Review of Lesson 1:**
- أ (Alif) - vertical line
- ب ت ث (Boat family) - 1 dot below, 2 above, 3 above
- ج ح خ (Belly family) - dot inside, no dot, dot above

Today's letters include some pairs that look alike but have different dots - just like the boat family! You'll also learn some uniquely Arabic sounds.

Let's dive in!`
      },
      {
        id: "l2-dal",
        type: "explanation",
        title: "Letter 8: Dal (د)",
        arabicContent: "د",
        content: `**DAL (د)** - The Simple Curve

**Sound:** Like 'd' in "door" - nice and easy!
**Shape:** A small curved hump, leaning slightly right

**How to say it:** Touch your tongue to the ridge behind your upper teeth and release. Exactly like English!

**Memory trick:** Dal looks like a "Door" from the side - and both start with D!

**Writing insight:** Dal is one of the non-connecting letters (like Alif). It never connects to the letter that comes after it.

**Good news:** This sound is identical to English 'd'. No new mouth positions needed! 🎉`
      },
      {
        id: "l2-dhal",
        type: "explanation",
        title: "Letter 9: Dhal (ذ)",
        arabicContent: "ذ",
        content: `**DHAL (ذ)** - Dal's Dotted Twin

**Sound:** Like 'th' in "this" or "the" (the buzzy 'th')
**Shape:** Same as Dal, but with a dot above

**How to say it:** Put your tongue between your teeth (like Tha ث), but add voice/buzzing. Feel the vibration!

**Memory trick:** "Dhal is Dal with a Dot" - easy to remember!

**Key difference from ث (Tha):**
- ث (Tha) = "THink" - no voice, just air
- ذ (Dhal) = "THis" - with voice, buzzing

**Practice:** Say "this" and "think" - feel the difference? "This" has vocal cord vibration. That's Dhal!`
      },
      {
        id: "l2-dal-dhal-quiz",
        type: "exercise",
        title: "Dal vs Dhal",
        content: "Can you tell these twins apart?",
        exercise: {
          type: "letter_identify",
          question: "Which letter makes the 'th' sound in 'THIS' (the buzzy one)?",
          options: ["د (Dal)", "ذ (Dhal)"],
          correctAnswer: 1,
          explanation: "Right! ذ (Dhal) has a dot and makes the buzzy 'th' sound. Remember: dot = th!"
        }
      },
      {
        id: "l2-ra",
        type: "explanation",
        title: "Letter 10: Ra (ر)",
        arabicContent: "ر",
        content: `**RA (ر)** - The Rolling R

**Sound:** A rolled or tapped 'r', like Spanish or Italian
**Shape:** Like Dal but the tail dips below the line

**How to say it:** Tap your tongue once against the ridge behind your upper teeth. It's not the American 'r' - it's more like the 'r' in "butter" said quickly (British style), or a single Spanish 'r'.

**Memory trick:** Ra "Reaches down" below the line - that tail goes down!

**Comparison:**
- د (Dal) sits on the line
- ر (Ra) dips below the line

**Practice tip:** Say "butter" or "water" quickly with a British accent. That quick tap is close to Ra!`
      },
      {
        id: "l2-zay",
        type: "explanation",
        title: "Letter 11: Zay (ز)",
        arabicContent: "ز",
        content: `**ZAY (ز)** - Ra's Buzzing Brother

**Sound:** Like 'z' in "zebra"
**Shape:** Same as Ra, but with a dot above

**How to say it:** Just like English 'z' - tongue near the roof of your mouth, air flowing with voice.

**Memory trick:** "Zay = Ra + a dot = Zebra sound" 🦓

**Pattern recognition:** 
Just like د/ذ (Dal/Dhal), ر/ز (Ra/Zay) are a pair:
- ر (Ra) = no dot = 'r' sound
- ز (Zay) = dot above = 'z' sound

Arabic loves these dot-patterns!`
      },
      {
        id: "l2-seen",
        type: "explanation",
        title: "Letter 12: Seen (س)",
        arabicContent: "س",
        content: `**SEEN (س)** - The Three Teeth

**Sound:** Like 's' in "sun" - clean and simple!
**Shape:** Three pointed teeth/peaks in a row

**How to say it:** Exactly like English 's'. Tongue behind lower teeth, air hissing out.

**Memory trick:** Seen looks like it's "Smiling" with three teeth showing! 😁

**Writing note:** Those three peaks should be pointy, not rounded. Think of a tiny saw blade!

**Quranic appearance:** You'll see this letter a lot. "بِسْمِ" (Bismi) has a Seen right in the middle!`
      },
      {
        id: "l2-sheen",
        type: "explanation",
        title: "Letter 13: Sheen (ش)",
        arabicContent: "ش",
        content: `**SHEEN (ش)** - Seen's Showier Sister

**Sound:** Like 'sh' in "shine"
**Shape:** Same three teeth as Seen, plus three dots above

**How to say it:** Put your tongue where you'd say 's', but pull it back a tiny bit and round your lips slightly. "Shhh!"

**Memory trick:** "SHeen has SHimmer" - those three dots above make it fancy!

**Another pattern:**
- س (Seen) = no dots = 's' sound
- ش (Sheen) = 3 dots above = 'sh' sound`
      },
      {
        id: "l2-seen-sheen-quiz",
        type: "exercise",
        title: "Seen vs Sheen",
        content: "These look similar - the dots make all the difference!",
        exercise: {
          type: "letter_identify",
          question: "Which letter makes the 'sh' sound?",
          options: ["س (Seen)", "ش (Sheen)"],
          correctAnswer: 1,
          explanation: "Correct! ش (Sheen) has three dots above and makes the 'sh' sound. س (Seen) has no dots and makes the 's' sound."
        }
      },
      {
        id: "l2-sad",
        type: "explanation",
        title: "Letter 14: Sad (ص)",
        arabicContent: "ص",
        content: `**SAD (ص)** - The Heavy S

**Sound:** A "heavy" or "emphatic" 's' - unique to Arabic!
**Shape:** Like a closed loop/teardrop on its side

**How to say it:** 
1. Say 's' normally (that's س Seen)
2. Now push your tongue flat against the roof of your mouth
3. Lower the back of your tongue and round your lips slightly
4. Say 's' again - it should sound deeper, "heavier"

**Memory trick:** Sad sounds "Sad" - deeper, more serious than regular Seen!

**Listen closely:** In recitation, you'll hear the difference. Sad makes the surrounding vowels sound deeper, darker.

**Don't worry:** This is a new sound for English speakers. It takes time! For now, just recognize the letter shape.`
      },
      {
        id: "l2-dad",
        type: "explanation",
        title: "Letter 15: Dad (ض)",
        arabicContent: "ض",
        content: `**DAD (ض)** - The Unique One

**Sound:** A "heavy" or "emphatic" 'd'
**Shape:** Same as Sad, but with a dot above

**How to say it:** 
1. Say 'd' normally (that's د Dal)
2. Push your tongue flat against the roof of your mouth
3. Lower the back of your tongue
4. Say 'd' again - it should sound deeper

**Memory trick:** "Dad" sounds deep like a father's voice! 👨

**Why it's special:** Arabic is sometimes called "the language of Dad" (لغة الضاد) because this sound is unique to Arabic! No other language has it exactly.

**Pattern:**
- ص (Sad) = heavy 's' = no dot
- ض (Dad) = heavy 'd' = dot above`
      },
      {
        id: "l2-emphatic-quiz",
        type: "exercise",
        title: "Heavy Letters Quiz",
        content: "Sad and Dad are special Arabic sounds",
        exercise: {
          type: "letter_identify",
          question: "Which letter has a dot and makes the heavy 'd' sound?",
          options: ["ص (Sad)", "ض (Dad)", "د (Dal)"],
          correctAnswer: 1,
          explanation: "Perfect! ض (Dad) has a dot above and makes the emphatic/heavy 'd'. Arabic is called 'the language of Dad' because this sound is unique!"
        }
      },
      {
        id: "l2-review",
        type: "instruction",
        title: "Lesson 2 Complete! 🌟",
        content: `**Amazing progress! You now know 15 letters!**

Today you learned:

**Simple Letters:**
- د (Dal) - 'd' sound - like a door
- ر (Ra) - rolled 'r' - tail goes down

**Dotted Pairs:**
- ذ (Dhal) - buzzy 'th' (like "this") - Dal + dot
- ز (Zay) - 'z' sound - Ra + dot

**Three-Teeth Family:**
- س (Seen) - 's' sound - no dots
- ش (Sheen) - 'sh' sound - 3 dots above

**Heavy/Emphatic Letters:**
- ص (Sad) - heavy 's' - no dot
- ض (Dad) - heavy 'd' - dot above

**You're now over halfway through the alphabet!** 

**Coming up:** In Lesson 3, you'll learn 8 more letters including ع (Ayn) - the most distinctly Arabic sound of all!`
      }
    ],
    memorizationTechniques: [
      "Pair letters: Dal/Dhal, Ra/Zay, Seen/Sheen, Sad/Dad",
      "The dot pattern: adding a dot changes the sound predictably",
      "For heavy letters: practice saying the light version first, then make it 'deeper'"
    ],
    keyVocabulary: [
      { arabic: "د", transliteration: "Dal", meaning: "'d' sound - door shape" },
      { arabic: "ذ", transliteration: "Dhal", meaning: "'th' in THIS - Dal+dot" },
      { arabic: "ر", transliteration: "Ra", meaning: "rolled 'r' - tail goes down" },
      { arabic: "ز", transliteration: "Zay", meaning: "'z' sound - Ra+dot" },
      { arabic: "س", transliteration: "Seen", meaning: "'s' sound - three teeth" },
      { arabic: "ش", transliteration: "Sheen", meaning: "'sh' sound - three dots" },
      { arabic: "ص", transliteration: "Sad", meaning: "heavy 's' - closed loop" },
      { arabic: "ض", transliteration: "Dad", meaning: "heavy 'd' - loop+dot" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 3: Arabic Alphabet Part 3 - ط ظ ع غ ف ق ك ل
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-3",
    unit: 1,
    unitTitle: "Arabic Foundations",
    path: "beginner",
    number: 3,
    title: "The Arabic Alphabet - Part 3",
    description: "Learn 8 more letters including the special Ayn and Ghayn sounds",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    estimatedMinutes: 25,
    xpReward: 50,
    steps: [
      {
        id: "l3-intro",
        type: "instruction",
        title: "The Heart of Arabic Sounds",
        content: `You're doing amazing! 15 letters down, 13 to go.

Today's lesson includes two of the most unique Arabic sounds:
- ع (Ayn) - often called the most "Arabic" sound
- غ (Ghayn) - a gargling sound from deep in the throat

Don't worry if these are hard at first! Every Arabic learner struggles with them. The key is to LISTEN to them many times in Quran recitation. Your ear will train your tongue.

Let's start with two more heavy letters...`
      },
      {
        id: "l3-ta",
        type: "explanation",
        title: "Letter 16: Ta (ط)",
        arabicContent: "ط",
        content: `**TA (ط)** - The Heavy T

**Sound:** A "heavy" or "emphatic" 't'
**Shape:** A tall vertical line with a loop at the top

**How to say it:**
1. Say 't' normally (that's ت Ta)
2. Press your tongue flat against the roof of your mouth
3. Pull the back of your tongue down
4. Say 't' - it should sound deeper, fuller

**Memory trick:** This ط looks like it has a "hat" on top - fancy and heavy!

**Important:** Don't confuse with ت (Ta):
- ت (Ta) = light 't' = boat shape with 2 dots
- ط (Ta) = heavy 't' = tall shape with loop

**Hear the difference:** In "مُسْتَقِيم" (mustaqeem - straight path from Al-Fatiha), the ت is light. In "طَيِّبَة" (tayyiba - good), the ط is heavy.`
      },
      {
        id: "l3-dha",
        type: "explanation",
        title: "Letter 17: Dha (ظ)",
        arabicContent: "ظ",
        content: `**DHA (ظ)** - The Heavy TH

**Sound:** A heavy/emphatic version of ذ (Dhal)
**Shape:** Same as ط (Ta), but with a dot above

**How to say it:**
1. Say ذ (Dhal - buzzy 'th' like in "this")
2. Make it heavier/deeper by flattening your tongue
3. The result is ظ (Dha)

**Memory trick:** Same shape as ط but with a dot = same pattern as ص/ض!

**Pattern so far:**
- ط (Ta) = heavy 't' = no dot
- ظ (Dha) = heavy 'th' = dot above

These are the last of the "emphatic" letters!`
      },
      {
        id: "l3-emphatic-quiz",
        type: "exercise",
        title: "Heavy Letters Review",
        content: "Let's review all four emphatic letters",
        exercise: {
          type: "letter_identify",
          question: "We've learned 4 heavy letters. Which one is ظ (Dha)?",
          options: ["ص", "ض", "ط", "ظ"],
          correctAnswer: 3,
          explanation: "Yes! ظ (Dha) is the tall letter with a loop AND a dot above. It makes a heavy 'th' sound."
        }
      },
      {
        id: "l3-ayn",
        type: "explanation",
        title: "Letter 18: Ayn (ع)",
        arabicContent: "ع",
        content: `**AYN (ع)** - The Most Arabic Sound

**Sound:** A voiced sound from deep in your throat - NO English equivalent!
**Shape:** Looks like a backwards '3' or a stylized 'c'

**How to say it:**
This is THE hardest Arabic sound for English speakers. Here's how:
1. Pretend you're being choked (gently!)
2. Tighten the very back of your throat
3. Make a voiced "aaah" sound while squeezing that tightness
4. It should sound like you're straining

**Memory trick:** Ayn looks like an EYE (عين actually means "eye" in Arabic!)

**Practice technique:**
1. Put your hand on your throat
2. Say "uh-oh" - feel how your throat closes between the syllables?
3. That closing feeling, but sustained, is close to Ayn

**Be patient:** This sound takes months of practice. Hear it in "نَعْبُدُ" (na'budu - we worship) from Al-Fatiha.

**Don't give up:** Even a non-perfect Ayn is understood. Allah rewards your effort!`
      },
      {
        id: "l3-ghayn",
        type: "explanation",
        title: "Letter 19: Ghayn (غ)",
        arabicContent: "غ",
        content: `**GHAYN (غ)** - The Gargling Sound

**Sound:** Like gargling water, or the French 'r'
**Shape:** Same as Ayn, but with a dot above

**How to say it:**
1. Try gargling without water
2. Make that friction sound in the back of your throat
3. That's Ghayn!

**Alternative approach:** If you know French, German, or Hebrew:
- French 'r' in "Paris"
- German 'r' in "rot"
- Hebrew 'ר' (resh)
These are all similar to Ghayn!

**Memory trick:** "Ghayn = Gargling with a dot"

**Pattern (again!):**
- ع (Ayn) = no dot = throat squeeze
- غ (Ghayn) = dot above = gargling

**Quran example:** "المَغْضُوبِ" (al-maghdubi - those who earned anger) in Al-Fatiha has a Ghayn!`
      },
      {
        id: "l3-ayn-ghayn-quiz",
        type: "exercise",
        title: "Ayn vs Ghayn",
        content: "These look alike but sound very different",
        exercise: {
          type: "letter_identify",
          question: "Which letter has NO dot and makes the throat-squeeze sound?",
          options: ["ع (Ayn)", "غ (Ghayn)"],
          correctAnswer: 0,
          explanation: "Correct! ع (Ayn) has no dot and makes that distinctive throat sound. غ (Ghayn) has a dot and sounds like gargling."
        }
      },
      {
        id: "l3-fa",
        type: "explanation",
        title: "Letter 20: Fa (ف)",
        arabicContent: "ف",
        content: `**FA (ف)** - The Easy F

**Sound:** Like 'f' in "father" - finally, a simple one!
**Shape:** A small loop with a single dot above

**How to say it:** Exactly like English 'f'. Upper teeth on lower lip, blow air.

**Memory trick:** Fa has a dot like a "Fly" buzzing above it!

**Good news:** After Ayn and Ghayn, Fa is a breeze! It's identical to English 'f'.

**Shape note:** Fa looks like a small circle with a tail, and one dot above. Don't confuse with ق (Qaf) coming next - Qaf has TWO dots.`
      },
      {
        id: "l3-qaf",
        type: "explanation",
        title: "Letter 21: Qaf (ق)",
        arabicContent: "ق",
        content: `**QAF (ق)** - The Deep K

**Sound:** A 'k' sound but from very deep in your throat
**Shape:** Similar loop to Fa, but deeper/rounder, with TWO dots above

**How to say it:**
1. Say 'k' normally
2. Now move that 'k' as far back in your throat as possible
3. It should sound like a "cluck" from deep inside

**Memory trick:** "Qaf has two dots, very deep in the baq (back)"

**Comparison:**
- ف (Fa) = 1 dot = 'f' sound
- ق (Qaf) = 2 dots = deep 'k' sound

**Quran example:** The word "القرآن" (Al-Quran) starts with a Qaf! It's also in "مُسْتَقِيم" (mustaqeem - straight).`
      },
      {
        id: "l3-kaf",
        type: "explanation",
        title: "Letter 22: Kaf (ك)",
        arabicContent: "ك",
        content: `**KAF (ك)** - The Regular K

**Sound:** Like 'k' in "kite" - just a normal k!
**Shape:** An upward stroke with a small slash inside

**How to say it:** Exactly like English 'k'. Back of tongue touches soft palate, release with air.

**Memory trick:** Kaf looks like it has a small "kick" inside it!

**Important distinction:**
- ك (Kaf) = front 'k' (like "kite")
- ق (Qaf) = deep 'k' (from way back in throat)

**Listen carefully:** In recitation, Qaf sounds almost like a gulp or click, while Kaf sounds like normal English 'k'.`
      },
      {
        id: "l3-lam",
        type: "explanation",
        title: "Letter 23: Lam (ل)",
        arabicContent: "ل",
        content: `**LAM (ل)** - The Lovely L

**Sound:** Like 'l' in "love"
**Shape:** A tall vertical stroke that curves at the bottom

**How to say it:** Touch your tongue tip to the ridge behind your upper teeth. Just like English 'l'!

**Memory trick:** Lam looks like a tall "Lamp post" 🏮

**Super important:** You'll see Lam CONSTANTLY in Arabic because:
- "ال" (al-) means "the" - it's the most common prefix!
- "الله" (Allah) starts with Alif-Lam-Lam-Ha

**Special case:** When Lam meets Alif, they make a special combined shape: "لا" (la - meaning "no")

**Congratulations!** You now know 23 of 28 letters!`
      },
      {
        id: "l3-review",
        type: "instruction",
        title: "Lesson 3 Complete! 🌟",
        content: `**Incredible work! You've learned 23 letters!**

Today's additions:

**Heavy Letters:**
- ط (Ta) - heavy 't' - tall with loop
- ظ (Dha) - heavy 'th' - tall with loop and dot

**The Unique Throat Sounds:**
- ع (Ayn) - throat squeeze - looks like eye
- غ (Ghayn) - gargling - Ayn with dot

**Common Letters:**
- ف (Fa) - 'f' sound - small loop, 1 dot
- ق (Qaf) - deep 'k' - 2 dots above
- ك (Kaf) - normal 'k' - has a small stroke inside
- ل (Lam) - 'l' sound - tall like a lamp

**Only 5 letters left!** You'll learn them in Lesson 4.

**Practice:** Try to find ل (Lam) in Arabic text - you'll see it everywhere!`
      }
    ],
    memorizationTechniques: [
      "For Ayn (ع): Practice the 'uh-oh' throat closure daily",
      "For Ghayn (غ): Gargle without water to practice",
      "For Qaf (ق): Practice a very deep 'k' sound from your throat"
    ],
    keyVocabulary: [
      { arabic: "ط", transliteration: "Ta", meaning: "heavy 't' - tall with loop" },
      { arabic: "ظ", transliteration: "Dha", meaning: "heavy 'th' - with dot" },
      { arabic: "ع", transliteration: "Ayn", meaning: "throat squeeze - like eye" },
      { arabic: "غ", transliteration: "Ghayn", meaning: "gargling - Ayn+dot" },
      { arabic: "ف", transliteration: "Fa", meaning: "'f' sound - 1 dot" },
      { arabic: "ق", transliteration: "Qaf", meaning: "deep 'k' - 2 dots" },
      { arabic: "ك", transliteration: "Kaf", meaning: "normal 'k' sound" },
      { arabic: "ل", transliteration: "Lam", meaning: "'l' sound - tall lamp" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 4: Arabic Alphabet Part 4 - م ن ه و ي + special letters
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-4",
    unit: 1,
    unitTitle: "Arabic Foundations",
    path: "beginner",
    number: 4,
    title: "The Arabic Alphabet - Part 4 (Final Letters!)",
    description: "Complete the alphabet: Meem, Noon, Ha, Waw, Ya + special letters",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    estimatedMinutes: 20,
    xpReward: 75,
    steps: [
      {
        id: "l4-intro",
        type: "instruction",
        title: "The Final Five! 🎉",
        content: `This is it! After this lesson, you'll know ALL 28 Arabic letters!

Today's letters are some of the most common:
- م (Meem) - appears in "محمد" (Muhammad) and "بِسْمِ" (Bismi)
- ن (Noon) - appears in "الرَّحْمَٰنِ" (Ar-Rahman)
- ه (Ha) - appears in "اللَّهِ" (Allah)
- و (Waw) - means "and" and is everywhere!
- ي (Ya) - appears in "الرَّحِيمِ" (Ar-Raheem)

Plus, you'll learn about some special letter forms.

Let's finish strong!`
      },
      {
        id: "l4-meem",
        type: "explanation",
        title: "Letter 24: Meem (م)",
        arabicContent: "م",
        content: `**MEEM (م)** - The Circle with a Tail

**Sound:** Like 'm' in "moon" - close your lips!
**Shape:** A circle (or oval) with a small tail

**How to say it:** Close both lips and hum. Pure 'm' sound. Easy!

**Memory trick:** Meem looks like a "Moon" with a small tail!

**Where you'll see it:**
- "بِسْمِ" (Bismi - In the name of)
- "مُحَمَّد" (Muhammad ﷺ)
- "الرَّحْمَٰنِ" (Ar-Rahman - The Most Gracious)
- "الرَّحِيمِ" (Ar-Raheem - The Most Merciful)

Meem is EVERYWHERE in Arabic!`
      },
      {
        id: "l4-noon",
        type: "explanation",
        title: "Letter 25: Noon (ن)",
        arabicContent: "ن",
        content: `**NOON (ن)** - The Bowl with a Dot

**Sound:** Like 'n' in "noon" - tongue touches ridge behind teeth
**Shape:** A curved bowl shape with a dot above

**How to say it:** Touch your tongue tip to the ridge behind your upper teeth. Let the sound come through your nose.

**Memory trick:** Noon looks like a "bowl of Noodles" with steam (the dot) rising!

**Shape comparison:**
- ب (Ba) = dot below
- ت (Ta) = 2 dots above
- ث (Tha) = 3 dots above
- ن (Noon) = 1 dot above, different base shape!

Noon's curve is deeper/rounder than the boat letters.`
      },
      {
        id: "l4-ha",
        type: "explanation",
        title: "Letter 26: Ha (ه)",
        arabicContent: "ه",
        content: `**HA (ه)** - The Breathy H

**Sound:** Like 'h' in "hat" - a light, breathy sound
**Shape:** Looks different depending on position (we'll cover forms later!)

**How to say it:** Just breathe out with a tiny bit of voice. Like sighing "haaah."

**Memory trick:** Ha is like a "Hot breath" - light and airy!

**IMPORTANT - Don't confuse with ح!**
- ه (Ha) = light 'h' like in "hat" - the one we're learning now
- ح (Ha) = heavier 'h' from deeper in throat (Lesson 1)

Arabic has TWO H sounds!

**Where it appears:**
- "اللَّهِ" (Allah) - the ه is at the end
- "هُوَ" (Huwa - He) - at the beginning

**Shape tip:** ه changes form a lot - in the middle of words it can look like ـهـ`
      },
      {
        id: "l4-waw",
        type: "explanation",
        title: "Letter 27: Waw (و)",
        arabicContent: "و",
        content: `**WAW (و)** - The Hook

**Sound:** Like 'w' in "water" OR 'oo' in "moon"
**Shape:** A hook or comma shape, like a tiny apostrophe

**How to say it:** Round your lips like you're going to whistle, then make a voiced sound.

**Memory trick:** Waw looks like a little "Worm" curled up!

**Dual role:** Waw serves two functions:
1. As a consonant: 'w' sound (like "water")
2. As a long vowel: 'oo' sound (like "moon")

You'll learn more about this in the vowels lesson!

**Super common:** "و" by itself means "and" - you'll see it joining words constantly.

**Note:** Waw never connects to the next letter (like Alif and Dal).`
      },
      {
        id: "l4-ya",
        type: "explanation",
        title: "Letter 28: Ya (ي)",
        arabicContent: "ي",
        content: `**YA (ي)** - The Last Letter!

**Sound:** Like 'y' in "yes" OR 'ee' in "see"
**Shape:** Similar to Ba/Ta/Tha base, but curves down with 2 dots below

**How to say it:** Like the 'y' in "yes" - tongue close to roof of mouth, voiced.

**Memory trick:** Ya "Yawns" down below the line, with dots underneath!

**Dual role (like Waw):**
1. As a consonant: 'y' sound (like "yes")
2. As a long vowel: 'ee' sound (like "see")

**Shape comparison:**
- ب (Ba) = sits on line, 1 dot below
- ي (Ya) = curves below line, 2 dots below

**Where it appears:**
- "الرَّحِيمِ" (Ar-Raheem) - the long 'ee' sound
- "إِيَّاكَ" (Iyyaka - You alone) - consonant 'y'

🎊 **CONGRATULATIONS! YOU'VE LEARNED ALL 28 LETTERS!** 🎊`
      },
      {
        id: "l4-full-alphabet-quiz",
        type: "exercise",
        title: "Final Alphabet Quiz",
        content: "Let's test your knowledge of the complete alphabet!",
        exercise: {
          type: "letter_identify",
          question: "Which letter can sound like 'w' or 'oo'?",
          options: ["م (Meem)", "ن (Noon)", "و (Waw)", "ي (Ya)"],
          correctAnswer: 2,
          explanation: "Yes! و (Waw) has two roles: as a consonant it's 'w', and as a long vowel it's 'oo'!"
        }
      },
      {
        id: "l4-special-letters",
        type: "explanation",
        title: "Special Characters You'll See",
        content: `You now know all 28 letters! But Arabic has a few special characters:

**Hamza (ء)** - The Glottal Stop
- Sound: Like the pause in "uh-oh"
- Can appear alone, or sit on Alif (أ), Waw (ؤ), or Ya (ئ)
- Example: "القُرْآن" (Al-Qur'an) - the Hamza is on the Alif

**Alif Maqsura (ى)** 
- Looks like Ya without dots
- Only appears at the end of words
- Sounds like long 'a' (not 'ee')
- Example: "عَلَى" (ala - upon)

**Taa Marbuta (ة)**
- Looks like Ha with two dots
- Only appears at the end of words
- Can sound like 'a' or 't' depending on context
- Example: "رَحْمَة" (rahma - mercy)

**Alif with Madda (آ)**
- Alif with a wavy line above
- Makes a long 'aa' sound
- Example: "آمَنُوا" (aamanu - they believed)

Don't worry about memorizing all these now - you'll recognize them as you read more Quran!`
      },
      {
        id: "l4-review",
        type: "instruction",
        title: "UNIT 1 COMPLETE! 🏆",
        content: `**Alhamdulillah! You've mastered all 28 Arabic letters!**

**Today's letters:**
- م (Meem) - 'm' sound - the moon circle
- ن (Noon) - 'n' sound - bowl with dot
- ه (Ha) - light 'h' - breathy sound
- و (Waw) - 'w' or 'oo' - hook/worm shape
- ي (Ya) - 'y' or 'ee' - curves down, dots below

**What you've accomplished in Unit 1:**
✅ All 28 letters identified
✅ Unique Arabic sounds introduced (ع غ ح خ ق)
✅ Heavy/emphatic letters explained (ص ض ط ظ)
✅ Letter patterns recognized (dot = sound change)

**Coming up in Unit 2: Reading Skills**
Now you'll learn how to actually READ Arabic:
- Short vowels (the marks above/below letters)
- Long vowels (using و and ي)
- Special marks like Shadda (doubling)

You're ready to start reading Arabic! 🌟`
      }
    ],
    memorizationTechniques: [
      "Write out the full alphabet from memory daily",
      "Group by shape: similar shapes have related patterns",
      "Listen to Quran recitation and try to identify letters you hear"
    ],
    keyVocabulary: [
      { arabic: "م", transliteration: "Meem", meaning: "'m' sound - moon circle" },
      { arabic: "ن", transliteration: "Noon", meaning: "'n' sound - bowl with dot" },
      { arabic: "ه", transliteration: "Ha", meaning: "light 'h' - breathy" },
      { arabic: "و", transliteration: "Waw", meaning: "'w' or 'oo' - hook" },
      { arabic: "ي", transliteration: "Ya", meaning: "'y' or 'ee' - dots below" },
      { arabic: "ء", transliteration: "Hamza", meaning: "glottal stop" },
      { arabic: "ة", transliteration: "Taa Marbuta", meaning: "feminine ending" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 5: Letter Forms - How letters change shape
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-5",
    unit: 1,
    unitTitle: "Arabic Foundations",
    path: "beginner",
    number: 5,
    title: "Letter Forms - How Letters Connect",
    description: "Learn how Arabic letters change shape depending on their position in a word",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    estimatedMinutes: 25,
    xpReward: 75,
    steps: [
      {
        id: "l5-intro",
        type: "instruction",
        title: "The Shape-Shifting Letters!",
        content: `Here's something fascinating about Arabic: **letters change shape depending on where they appear in a word!**

Each letter has up to 4 forms:
1. **Isolated** - standing alone
2. **Initial** - at the beginning of a word
3. **Medial** - in the middle of a word
4. **Final** - at the end of a word

Think of it like English cursive, where letters connect. But in Arabic, the shape can change more dramatically!

Don't panic! There are patterns, and with practice, you'll recognize them all.`
      },
      {
        id: "l5-connecting-rule",
        type: "explanation",
        title: "The Connecting Rule",
        content: `**First, the good news:** 6 letters NEVER connect to the next letter!

These "non-connectors" are:
- أ (Alif)
- د (Dal)
- ذ (Dhal)
- ر (Ra)
- ز (Zay)
- و (Waw)

**Memory trick:** "A DaDa RaZoW never holds hands forward"

These letters can connect from the right (the previous letter connects to them), but they never reach out to the left.

**What this means:**
When you see one of these letters, the letter after it must start fresh, like a new word beginning.

Example: "دَار" (daar - house)
- The د (Dal) stands alone at the start
- The ا (Alif) is isolated because it follows Dal
- The ر (Ra) is final form`
      },
      {
        id: "l5-ba-forms",
        type: "explanation",
        title: "Example: Ba (ب) Forms",
        arabicContent: "ب ـبـ ـب بـ",
        content: `Let's look at how ب (Ba) changes:

**Isolated:** ب
Used when the letter stands alone or after a non-connector

**Initial:** بـ
At the start of a word. Notice the horizontal line extending left!

**Medial:** ـبـ
In the middle. Lines extend both left AND right.

**Final:** ـب
At the end. Line extends from the right only.

**See it in action:**
- "باب" (baab - door) = بـ + ا + ب
  - بـ = Initial Ba
  - ا = Alif (always isolated)
  - ب = Final Ba

The key: In connected forms, the "boat" base becomes a flat line, but the dot stays!`
      },
      {
        id: "l5-noon-forms",
        type: "explanation",
        title: "Example: Noon (ن) Forms",
        arabicContent: "ن ـنـ ـن نـ",
        content: `Let's see how ن (Noon) transforms:

**Isolated:** ن
The full bowl shape with dot above

**Initial:** نـ
Bowl is smaller, line extends left

**Medial:** ـنـ
Just a bump/curve with dot, connected both sides

**Final:** ـن
Full bowl shape, connected from right

**The key insight:**
- When NOT at the end: the bowl flattens into a small bump
- When at the end: the full bowl shape appears

**Pattern:** Many letters keep their full shape at the end, but simplify in the middle!`
      },
      {
        id: "l5-practice-forms",
        type: "exercise",
        title: "Identify the Form",
        content: "In the word بِسْمِ (Bismi), what form is the ب?",
        exercise: {
          type: "letter_forms",
          question: "In بِسْمِ (Bismi - 'In the name of'), the ب appears in which form?",
          options: ["Isolated", "Initial", "Medial", "Final"],
          correctAnswer: 1,
          explanation: "Correct! In بِسْمِ, the ب is at the BEGINNING of the word, so it's in Initial form. You can see it connects to the Seen (س) that follows!"
        }
      },
      {
        id: "l5-ha-forms",
        type: "explanation",
        title: "The Shape-Shifter: Ha (ه)",
        arabicContent: "ه ـهـ ـه هـ",
        content: `Ha (ه) is the champion of shape-shifting! It looks completely different in each position:

**Isolated:** ه
Looks like a small 'o' or a circle

**Initial:** هـ
Looks like a small curved hook

**Medial:** ـهـ
Looks like a connected infinity symbol ∞

**Final:** ـه
Looks like a connected version of isolated ه

**Don't worry!** You'll get used to recognizing these with exposure. Just know that when you see these different shapes in "اللَّهِ" (Allah), they're all the same letter ه!

**In Allah:**
الـلـهِ = Alif + Lam + Lam + Ha
The final ه looks different from isolated ه`
      },
      {
        id: "l5-common-patterns",
        type: "explanation",
        title: "Pattern Recognition Tips",
        content: `**Good news:** Most letters follow predictable patterns!

**Pattern 1: The Boat Family (ب ت ث ن ي)**
- Initial/Medial: Base becomes a flat line, dots stay
- Final: Returns to fuller shape

**Pattern 2: The Belly Family (ج ح خ)**
- Keep similar shape throughout
- Just adjust the connection points

**Pattern 3: The Three-Teeth (س ش)**
- Teeth may compress in connected forms
- But the basic shape is recognizable

**Pattern 4: The Tall Letters (ا ل ك ط)**
- Keep their height throughout
- The vertical part stays tall

**Pattern 5: The Non-Connectors (ا د ذ ر ز و)**
- Only have 2 forms: isolated and final
- They never connect forward!

**Pro tip:** Reading more Arabic is the best way to internalize these forms. Your brain will start recognizing patterns automatically!`
      },
      {
        id: "l5-word-building",
        type: "practice",
        title: "Building Words: بِسْمِ",
        content: `Let's trace how letters connect in the word "بِسْمِ" (Bismi):

**The word:** بِسْمِ (In the name of)

**Breaking it down:**
1. بـ (Ba - initial form) - starts the word, connects to next
2. ـسـ (Seen - medial form) - in the middle, connects both ways
3. ـمِ (Meem - final form) - ends the word, connected from right only

**Watch the flow:**
ب → س → م
Each letter connects to form one continuous script!

**Why this matters:**
Understanding connections helps you:
- Read Arabic text fluently
- Recognize words in the Quran
- Write Arabic yourself

**Practice exercise:** Try to identify where each letter starts and ends in the word اللَّهِ (Allah). How many letters do you see?`
      },
      {
        id: "l5-allah-breakdown",
        type: "exercise",
        title: "Breaking Down اللَّهِ",
        content: "The most important word! Let's decode it.",
        exercise: {
          type: "letter_identify",
          question: "The word اللَّهِ (Allah) contains how many letters?",
          options: ["2 letters", "3 letters", "4 letters", "5 letters"],
          correctAnswer: 2,
          explanation: "It's 4 letters! ا (Alif) + ل (Lam) + ل (Lam) + ه (Ha). The two Lams connect to each other, and the Shadda (ّ) mark above indicates the Lam is doubled in pronunciation."
        }
      },
      {
        id: "l5-review",
        type: "instruction",
        title: "Unit 1 COMPLETE! 🎊",
        content: `**Mashallah! You've completed the Arabic Foundations unit!**

**What you learned in Lesson 5:**
✅ Letters have up to 4 forms (isolated, initial, medial, final)
✅ 6 non-connecting letters: أ د ذ ر ز و
✅ Common patterns help predict letter shapes
✅ Letters flow together in connected script

**Your Arabic Foundation is solid! You now:**
- Know all 28 letters
- Understand unique Arabic sounds
- Recognize how letters connect
- Can start identifying words

**Up Next - Unit 2: Reading Skills**
In the next lessons, you'll learn:
- Short vowels (Harakat) - the marks above/below letters
- Long vowels - how و and ي become vowels
- Special marks - Shadda, Sukoon, Tanween

**You're ready to start READING Arabic!** 📖`
      }
    ],
    memorizationTechniques: [
      "Focus on the non-connectors first: أ د ذ ر ز و",
      "Practice tracing words in the Quran to see connections",
      "The more you read, the more patterns become automatic"
    ],
    keyVocabulary: [
      { arabic: "بِسْمِ", transliteration: "Bismi", meaning: "In the name of" },
      { arabic: "اللَّهِ", transliteration: "Allah", meaning: "Allah (God)" },
      { arabic: "باب", transliteration: "Baab", meaning: "Door" },
      { arabic: "دَار", transliteration: "Daar", meaning: "House" }
    ]
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 2: READING SKILLS (Lessons 6-8)
 * Learn to actually read Arabic with vowels and marks
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_2_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 6: Short Vowels (Harakat)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-6",
    unit: 2,
    unitTitle: "Reading Skills",
    path: "beginner",
    number: 6,
    title: "Short Vowels (Harakat)",
    description: "Learn Fatha, Kasra, Damma, and Sukoon - the marks that make letters speakable",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    estimatedMinutes: 20,
    xpReward: 75,
    steps: [
      {
        id: "l6-intro",
        type: "instruction",
        title: "The Missing Vowels! 🔍",
        content: `Here's something crucial about Arabic: **the 28 letters you learned are mostly consonants!**

So how do you know how to pronounce words? Enter the **Harakat** (حَرَكَات) - the vowel marks!

These small marks sit above or below letters to tell you what vowel sound to make. In the Quran, EVERY letter has marks, making pronunciation clear.

**The Big Four:**
1. **Fatha** (فَتْحَة) - 'a' sound
2. **Kasra** (كَسْرَة) - 'i' sound  
3. **Damma** (ضَمَّة) - 'u' sound
4. **Sukoon** (سُكُون) - no vowel

Let's learn each one!`
      },
      {
        id: "l6-fatha",
        type: "explanation",
        title: "Fatha (فَتْحَة) - The 'A' Sound",
        arabicContent: "بَ تَ نَ",
        content: `**FATHA (فَتْحَة)** - A small diagonal line ABOVE the letter

**Symbol:** ــَـ (looks like a tiny forward slash)
**Sound:** Like 'a' in "cat" or "bat"

**Examples:**
- بَ = ba (Ba + Fatha)
- تَ = ta (Ta + Fatha)
- نَ = na (Noon + Fatha)

**Memory trick:** Fatha is "above" the letter, and when you say 'a', your mouth opens upward!

**In context:**
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
See the Fatha on the ر (Ra)? That's why it's "Ra" not just "R"!

**Practice:** Look at بَاب (baab - door). The first Ba has a Fatha: "Ba-ab"`
      },
      {
        id: "l6-kasra",
        type: "explanation",
        title: "Kasra (كَسْرَة) - The 'I' Sound",
        arabicContent: "بِ تِ نِ",
        content: `**KASRA (كَسْرَة)** - A small diagonal line BELOW the letter

**Symbol:** ــِـ (looks like a tiny line under the letter)
**Sound:** Like 'i' in "sit" or "bit"

**Examples:**
- بِ = bi (Ba + Kasra)
- تِ = ti (Ta + Kasra)
- نِ = ni (Noon + Kasra)

**Memory trick:** Kasra is "below" the letter, and the 'i' sound is made with your tongue lower!

**In context:**
بِسْمِ - The Kasra under the Ba makes it "Bi" and under the Meem makes it "mi"
So: Bi-s-mi!

**Key phrase:** "بِسْمِ اللَّهِ" = Bismillah
Both Ba and Meem have Kasra underneath!`
      },
      {
        id: "l6-damma",
        type: "explanation",
        title: "Damma (ضَمَّة) - The 'U' Sound",
        arabicContent: "بُ تُ نُ",
        content: `**DAMMA (ضَمَّة)** - A small curl/comma shape ABOVE the letter

**Symbol:** ــُـ (looks like a tiny و sitting on top)
**Sound:** Like 'u' in "put" or 'oo' in "book" (short!)

**Examples:**
- بُ = bu (Ba + Damma)
- تُ = tu (Ta + Damma)
- نُ = nu (Noon + Damma)

**Memory trick:** Damma looks like a tiny Waw (و) - and Waw makes the 'oo' sound! The Damma is like its little brother.

**In context:**
نَعْبُدُ (na'budu - we worship)
The Damma on the Ba (بُ) and Dal (دُ) makes "bu" and "du"

**Pronunciation:** Shorter than English "oo" in "moon". More like "put".`
      },
      {
        id: "l6-vowel-quiz",
        type: "exercise",
        title: "Vowel Recognition",
        content: "Can you identify which vowel is which?",
        exercise: {
          type: "letter_identify",
          question: "Which vowel mark is placed BELOW the letter?",
          options: ["Fatha (a)", "Kasra (i)", "Damma (u)", "Sukoon (none)"],
          correctAnswer: 1,
          explanation: "Correct! Kasra goes below the letter and makes the 'i' sound. Fatha and Damma both go above."
        }
      },
      {
        id: "l6-sukoon",
        type: "explanation",
        title: "Sukoon (سُكُون) - No Vowel",
        arabicContent: "بْ تْ نْ",
        content: `**SUKOON (سُكُون)** - A small circle ABOVE the letter

**Symbol:** ــْـ (looks like a tiny circle)
**Sound:** NO vowel! Just the consonant sound.

**Examples:**
- بْ = just "b" with no vowel
- تْ = just "t" with no vowel  
- نْ = just "n" with no vowel

**Memory trick:** Sukoon looks like a "stop sign" (circle) - it tells you to STOP and not add a vowel!

**Why it matters:**
In بِسْمِ (Bismi):
- بِ = Bi (Ba + Kasra)
- سْ = s (Seen + Sukoon - no vowel!)
- مِ = mi (Meem + Kasra)

The Sukoon on the Seen (سْ) tells you there's no vowel - you go straight from "Bi" to "s" to "mi" = "Bismi"!

**Arabic term:** A letter with Sukoon is called "saakin" (ساكِن) meaning "still/quiet"`
      },
      {
        id: "l6-putting-together",
        type: "explanation",
        title: "Putting It All Together",
        content: `Let's read a word using all we've learned!

**Word:** كِتَابْ (kitaab - book)

**Breaking it down:**
- كِ = ki (Kaf + Kasra)
- تَ = ta (Ta + Fatha)
- ا = aa (Alif - long 'a')
- بْ = b (Ba + Sukoon)

**Reading it:** ki-ta-a-b = kitaab!

**Try another:** مُسْلِم (muslim)

- مُ = mu (Meem + Damma)
- سْ = s (Seen + Sukoon)
- لِ = li (Lam + Kasra)
- م = m (Meem with implied Sukoon at end)

**Reading it:** mu-s-li-m = muslim!

**You're reading Arabic!** 🎉`
      },
      {
        id: "l6-bismi-reading",
        type: "practice",
        title: "Read: بِسْمِ اللَّهِ",
        arabicContent: "بِسْمِ اللَّهِ",
        content: `Let's read the most blessed phrase in Arabic!

**بِسْمِ اللَّهِ** (Bismillah - In the name of Allah)

**Part 1: بِسْمِ (Bismi)**
- بِ = Bi (Kasra under Ba)
- سْ = s (Sukoon on Seen - no vowel)
- مِ = mi (Kasra under Meem)
- = "Bismi"

**Part 2: اللَّهِ (Allah)**
- ا = A (Alif)
- لْ = l (Lam with Sukoon)
- لَ = la (Lam with Fatha + Shadda - doubled!)
- هِ = hi (Ha with Kasra)
- = "Al-laa-hi" → "Allahi"

**Together:** Bismillahi = "In the name of Allah"

**Congratulations!** You just read your first Quranic phrase with proper vowels! 📖`
      },
      {
        id: "l6-review",
        type: "instruction",
        title: "Lesson 6 Complete! 🌟",
        content: `**Excellent! You've learned the short vowels!**

**Summary:**
- **Fatha (ـَ)** - above letter - 'a' sound (cat)
- **Kasra (ـِ)** - below letter - 'i' sound (sit)
- **Damma (ـُ)** - above letter (curl) - 'u' sound (put)
- **Sukoon (ـْ)** - above letter (circle) - no vowel

**What you can now do:**
✅ Read any Arabic letter with vowels
✅ Understand why بِسْمِ is "Bismi" not "Basama"
✅ Recognize vowel marks in the Quran

**Coming up in Lesson 7:**
- Long vowels (aa, ee, oo)
- Shadda (doubling)
- Tanween (nunation)

**Practice:** Look at any Quran page and try to identify the vowel marks on each letter!`
      }
    ],
    memorizationTechniques: [
      "Fatha Above = A, Kasra Below = I, Damma curls = U",
      "Sukoon is a stop sign - no vowel there!",
      "Practice reading بِسْمِ اللَّهِ with proper vowels daily"
    ],
    keyVocabulary: [
      { arabic: "فَتْحَة", transliteration: "Fatha", meaning: "'a' vowel - mark above" },
      { arabic: "كَسْرَة", transliteration: "Kasra", meaning: "'i' vowel - mark below" },
      { arabic: "ضَمَّة", transliteration: "Damma", meaning: "'u' vowel - curl above" },
      { arabic: "سُكُون", transliteration: "Sukoon", meaning: "no vowel - circle above" },
      { arabic: "بِسْمِ", transliteration: "Bismi", meaning: "In the name of" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 7: Long Vowels & Special Marks
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-7",
    unit: 2,
    unitTitle: "Reading Skills",
    path: "beginner",
    number: 7,
    title: "Long Vowels & Special Marks",
    description: "Learn long vowels (aa, ee, oo), Shadda, and Tanween for complete reading",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    estimatedMinutes: 25,
    xpReward: 75,
    steps: [
      {
        id: "l7-intro",
        type: "instruction",
        title: "Stretching the Sound! 🔊",
        content: `In Lesson 6, you learned short vowels: a, i, u

But Arabic also has **long vowels**: aa, ee, oo - held about twice as long!

The trick? Long vowels use letters you already know:
- ا (Alif) → long 'aa'
- ي (Ya) → long 'ee'
- و (Waw) → long 'oo'

You'll also learn two important marks:
- **Shadda** - doubles a consonant
- **Tanween** - adds 'n' sound to endings

Let's dive in!`
      },
      {
        id: "l7-long-aa",
        type: "explanation",
        title: "Long 'aa' - Using Alif",
        arabicContent: "بَا تَا نَا",
        content: `**LONG 'aa'** - Fatha + Alif (ا)

When you see a Fatha followed by Alif, stretch the 'a' sound!

**Pattern:** consonant + Fatha + Alif = "consonant-aa"

**Examples:**
- بَا = baa (Ba with Fatha, then Alif)
- كَا = kaa (Kaf with Fatha, then Alif)
- نَا = naa (Noon with Fatha, then Alif)

**Compare:**
- بَ = ba (short)
- بَا = baa (long - hold it!)

**In the Quran:**
- الرَّحْمَٰنِ (Ar-Rahman): The "maa" is long!
- Al-Ra-h-MAA-ni (The Most Gracious)

**Timing:** Long vowels are held about 2 counts, short vowels 1 count.`
      },
      {
        id: "l7-long-ee",
        type: "explanation",
        title: "Long 'ee' - Using Ya",
        arabicContent: "بِي تِي نِي",
        content: `**LONG 'ee'** - Kasra + Ya (ي)

When Kasra is followed by Ya, stretch the 'i' sound to 'ee'!

**Pattern:** consonant + Kasra + Ya = "consonant-ee"

**Examples:**
- بِي = bee (Ba with Kasra, then Ya)
- فِي = fee (Fa with Kasra, then Ya)
- كِي = kee (Kaf with Kasra, then Ya)

**Compare:**
- بِ = bi (short 'i')
- بِي = bee (long 'ee')

**In the Quran:**
- الرَّحِيمِ (Ar-Raheem): The "hee" is long!
- Ar-Ra-HEE-mi (The Most Merciful)
- فِي (fee) = "in" - very common word!

**The Ya (ي) at the end doesn't have dots when serving as a long vowel in some texts.`
      },
      {
        id: "l7-long-oo",
        type: "explanation",
        title: "Long 'oo' - Using Waw",
        arabicContent: "بُو تُو نُو",
        content: `**LONG 'oo'** - Damma + Waw (و)

When Damma is followed by Waw, stretch the 'u' sound to 'oo'!

**Pattern:** consonant + Damma + Waw = "consonant-oo"

**Examples:**
- بُو = boo (Ba with Damma, then Waw)
- نُو = noo (Noon with Damma, then Waw)
- يُو = yoo (Ya with Damma, then Waw)

**Compare:**
- بُ = bu (short 'u')
- بُو = boo (long 'oo')

**In the Quran:**
- نُورٌ (noor) = light
- سُورَة (soora) = chapter
- يَوْم (yawm) = day (here Waw is consonant 'w')

**Note:** و can be a consonant 'w' or long vowel 'oo' - context tells you which!`
      },
      {
        id: "l7-long-vowel-quiz",
        type: "exercise",
        title: "Long Vowel Practice",
        content: "Which combination makes a long 'ee' sound?",
        exercise: {
          type: "letter_identify",
          question: "To make the long 'ee' sound, you need:",
          options: ["Fatha + Alif", "Kasra + Ya", "Damma + Waw", "Fatha + Ya"],
          correctAnswer: 1,
          explanation: "Correct! Kasra (ِ) + Ya (ي) = long 'ee' sound. Remember: the vowel mark matches the letter - Kasra is the 'i' sound, Ya extends it!"
        }
      },
      {
        id: "l7-shadda",
        type: "explanation",
        title: "Shadda (شَدَّة) - The Doubler",
        arabicContent: "اللَّه",
        content: `**SHADDA (شَدَّة)** - The "W" shape above a letter

**Symbol:** ـّـ (looks like a small 'w' or '3' on its side)
**Effect:** DOUBLES the consonant! Say it twice, but connected.

**Example:**
- اللَّه (Allah): The Lam has a Shadda
- Pronounced: Al-LAH (the Lam is doubled)
- It's like saying "Al-lah" very smoothly

**More examples:**
- مُحَمَّد (Muhammad): The Meem is doubled = mu-HAM-mad
- رَبِّ (Rabbi - my Lord): The Ba is doubled = Rab-bi
- الرَّحْمَٰنِ (Ar-Rahman): The Ra is doubled = Ar-RAH-man

**How to pronounce:**
Don't separate the doubled letter - press into it and hold slightly longer.

**Memory trick:** Shadda looks like two mountains - it makes the letter "twice as big" in sound!`
      },
      {
        id: "l7-tanween",
        type: "explanation",
        title: "Tanween - Adding 'N'",
        arabicContent: "كِتَابٌ كِتَابًا كِتَابٍ",
        content: `**TANWEEN (تَنْوِين)** - Doubling the vowel mark adds 'n'!

Tanween appears at the END of words and adds an 'n' sound.

**Three types:**
1. **Tanween Fatha (ـًا)** - sounds like "an"
   - كِتَابًا = kitaab-AN
   - Note: Usually written with an Alif!

2. **Tanween Damma (ـٌ)** - sounds like "un"
   - كِتَابٌ = kitaab-UN

3. **Tanween Kasra (ـٍ)** - sounds like "in"
   - كِتَابٍ = kitaab-IN

**Why it matters:**
Tanween indicates grammatical case (like word endings in Latin/German). For now, just know to add 'n'!

**In Al-Fatiha:**
- الْعَالَمِينَ ends with Kasra + Ya + Noon
- But sometimes you'll see Tanween instead

**Memory trick:** Tanween = "noon-ing" - it adds a noon (n) sound!`
      },
      {
        id: "l7-shadda-tanween-quiz",
        type: "exercise",
        title: "Shadda Recognition",
        content: "Find the doubled letter!",
        exercise: {
          type: "letter_identify",
          question: "In the word مُحَمَّد (Muhammad), which letter has the Shadda (is doubled)?",
          options: ["Meem (م)", "Ha (ح)", "Second Meem (مّ)", "Dal (د)"],
          correctAnswer: 2,
          explanation: "Correct! The second Meem has the Shadda (مَّ), so it's doubled. That's why it's Mu-HAM-mad, with emphasis on the doubled 'M'."
        }
      },
      {
        id: "l7-complete-reading",
        type: "practice",
        title: "Read: الرَّحْمَٰنِ الرَّحِيمِ",
        arabicContent: "الرَّحْمَٰنِ الرَّحِيمِ",
        content: `Let's apply everything to read two Names of Allah!

**الرَّحْمَٰنِ (Ar-Rahman - The Most Gracious)**

Breaking it down:
- الـ = Al (the)
- رَّ = Ra with Shadda (doubled) + Fatha = RRA
- حْ = Ha with Sukoon = h (no vowel)
- مَٰ = Meem with Fatha + special Alif = MAA (long)
- نِ = Noon with Kasra = ni

**= Ar-Rah-maa-ni**

**الرَّحِيمِ (Ar-Raheem - The Most Merciful)**

Breaking it down:
- الـ = Al (the)
- رَّ = Ra with Shadda + Fatha = RRA
- حِ = Ha with Kasra = hi
- يـ = Ya (makes 'ee' long vowel)
- مِ = Meem with Kasra = mi

**= Ar-Ra-hee-mi**

**You're reading Quran! 📖**`
      },
      {
        id: "l7-review",
        type: "instruction",
        title: "Lesson 7 Complete! 🌟",
        content: `**Fantastic progress! You've mastered long vowels and special marks!**

**Long Vowels:**
- Fatha + Alif (ا) = aa (long 'a')
- Kasra + Ya (ي) = ee (long 'i')
- Damma + Waw (و) = oo (long 'u')

**Special Marks:**
- **Shadda (ـّـ)** = doubles the consonant
- **Tanween** = adds 'n' at word end (ـٌ ـً ـٍ)

**What you can now read:**
✅ Any Arabic word with full harakat
✅ Names of Allah: الرَّحْمَٰنِ الرَّحِيمِ
✅ Doubled letters with Shadda
✅ Word endings with Tanween

**Lesson 8 Preview:**
- Reading complete words
- Common Quranic vocabulary
- Bridge to reading Al-Fatiha!`
      }
    ],
    memorizationTechniques: [
      "Long vowels use the 3 'weak' letters: Alif, Waw, Ya",
      "Shadda = 'w' shape = say the letter twice",
      "Tanween = double the mark = add 'n' sound"
    ],
    keyVocabulary: [
      { arabic: "الرَّحْمَٰنِ", transliteration: "Ar-Rahman", meaning: "The Most Gracious" },
      { arabic: "الرَّحِيمِ", transliteration: "Ar-Raheem", meaning: "The Most Merciful" },
      { arabic: "شَدَّة", transliteration: "Shadda", meaning: "Doubling mark" },
      { arabic: "تَنْوِين", transliteration: "Tanween", meaning: "Nunation (n-ending)" },
      { arabic: "نُور", transliteration: "Noor", meaning: "Light" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 8: Putting It Together - Reading Quranic Words
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-8",
    unit: 2,
    unitTitle: "Reading Skills",
    path: "beginner",
    number: 8,
    title: "Putting It Together - Quranic Vocabulary",
    description: "Practice reading common Quranic words and prepare for Al-Fatiha",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 1,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "l8-intro",
        type: "instruction",
        title: "From Letters to Words! 📚",
        content: `You've learned:
✅ All 28 Arabic letters
✅ Letter forms and connections
✅ Short vowels (Fatha, Kasra, Damma, Sukoon)
✅ Long vowels (aa, ee, oo)
✅ Shadda (doubling) and Tanween (n-ending)

Now it's time to put it all together! In this lesson, you'll:
- Read common Quranic vocabulary
- Practice recognizing patterns
- Prepare to read Al-Fatiha

**Important:** Don't rush to memorize meanings yet. Focus on READING correctly. The meaning will come naturally with repetition.

Let's start with the most important word in the Quran...`
      },
      {
        id: "l8-allah",
        type: "explanation",
        title: "Word 1: اللَّه (Allah)",
        arabicContent: "اللَّه",
        content: `**اللَّه** - Allah (God)

**Letter by letter:**
- ا (Alif) = A
- لـ (Lam) = L (connected to next)
- ـلَّـ (Lam with Shadda & Fatha) = LA (doubled, long)
- ـه (Ha) = H

**Reading:** A-l-LA-h = Allah
The Shadda on the second Lam makes it emphatic and slightly longer.

**Special pronunciation:**
The word "Allah" has a special quality. When a Fatha or Damma comes before it, the Lam is pronounced "heavy" (thick). When Kasra comes before, it's "light."

**Appears:** Over 2,500 times in the Quran!

**In Bismillah:**
بِسْمِ اللَّهِ = "Bismillahi" (In the name of Allah)
- Here, اللَّهِ has Kasra at the end = Allahi`
      },
      {
        id: "l8-rabb",
        type: "explanation",
        title: "Word 2: رَبّ (Rabb - Lord)",
        arabicContent: "رَبِّ الْعَالَمِينَ",
        content: `**رَبّ** - Rabb (Lord, Master, Sustainer)

**Letter by letter:**
- رَ (Ra with Fatha) = Ra
- بّ (Ba with Shadda) = BB (doubled)

**Reading:** Ra-bb = Rabb

**Forms you'll see:**
- رَبِّ (Rabbi) = "my Lord" - with Kasra
- رَبِّنَا (Rabbana) = "our Lord"
- رَبَّكَ (Rabbaka) = "your Lord"
- رَبُّ (Rabbu) = "Lord of" - with Damma

**In Al-Fatiha:**
رَبِّ الْعَالَمِينَ = "Rabbil 'aalameen" (Lord of all worlds)

**Meaning:** "Rabb" means much more than "Lord" - it includes:
- Creator
- Sustainer
- Nurturer
- Provider
- Protector

Allah is THE Rabb of everything!`
      },
      {
        id: "l8-hamd",
        type: "explanation",
        title: "Word 3: الْحَمْد (Al-Hamd - Praise)",
        arabicContent: "الْحَمْدُ لِلَّهِ",
        content: `**الْحَمْد** - Al-Hamd (The Praise)

**Letter by letter:**
- الـ (Alif-Lam) = Al (the)
- ـحَـ (Ha with Fatha) = Ha
- ـمْـ (Meem with Sukoon) = m (no vowel)
- ـد (Dal) = d

**Reading:** Al-Ham-d = Al-Hamd (the praise)

**The famous phrase:**
الْحَمْدُ لِلَّهِ = "Alhamdulillah" (All praise is for Allah)

**Breaking down Alhamdulillah:**
- الْحَمْدُ = Al-hamdu (the praise)
- لِلَّهِ = lillahi (to/for Allah)

Together: "Al-ham-du li-llahi"

**When to say it:**
- After eating
- After sneezing
- When grateful
- When something good happens
- In prayer!

This is the first phrase of Al-Fatiha!`
      },
      {
        id: "l8-vocabulary-quiz",
        type: "exercise",
        title: "Vocabulary Check",
        content: "Let's test your reading!",
        exercise: {
          type: "word_match",
          question: "How do you read رَبِّ (with the Shadda on Ba)?",
          options: ["Ra-bi", "Rab-bi", "Ra-bb", "Rabi"],
          correctAnswer: 1,
          explanation: "Correct! رَبِّ is read 'Rab-bi'. The Shadda doubles the Ba, and the Kasra underneath makes it 'bi'. So Ra + bb + i = Rabbi (my Lord)."
        }
      },
      {
        id: "l8-iyyaka",
        type: "explanation",
        title: "Word 4: إِيَّاكَ (Iyyaka - You alone)",
        arabicContent: "إِيَّاكَ نَعْبُدُ",
        content: `**إِيَّاكَ** - Iyyaka (You alone)

**Letter by letter:**
- إِ (Alif with Hamza underneath + Kasra) = I
- يَّـ (Ya with Shadda + Fatha) = YYA (doubled)
- ـا (Alif) = extends the 'a'
- كَ (Kaf with Fatha) = ka

**Reading:** I-yya-ka = Iyyaka

**In Al-Fatiha:**
إِيَّاكَ نَعْبُدُ = "Iyyaka na'budu" (You alone we worship)
إِيَّاكَ نَسْتَعِينُ = "Iyyaka nasta'een" (You alone we ask for help)

**Grammar insight:**
The word order is reversed for emphasis:
- Instead of "we worship You" (na'budu iyyaka)
- It's "YOU ALONE we worship" (iyyaka na'budu)

This emphasizes that worship is ONLY for Allah!`
      },
      {
        id: "l8-siraat",
        type: "explanation",
        title: "Word 5: صِرَاط (Siraat - Path)",
        arabicContent: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        content: `**صِرَاط** - Siraat (Path, Way)

**Letter by letter:**
- صِ (Sad with Kasra) = Si (emphatic 's'!)
- رَ (Ra with Fatha) = ra
- ا (Alif) = aa (extends the vowel)
- ط (Ta) = t (emphatic!)

**Reading:** Si-raa-t = Siraat (with emphatic letters!)

**The full phrase in Al-Fatiha:**
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
= "Ihdinaa as-siraat al-mustaqeem"
= "Guide us to the straight path"

**Two emphatic letters:**
- ص (Sad) - heavy 's' sound
- ط (Ta) - heavy 't' sound

These make the word sound deeper, more serious - fitting for asking about THE path!

**Al-Mustaqeem:**
الْمُسْتَقِيمَ = "the straight/correct one"
Contains Qaf (ق) - that deep 'k' sound!`
      },
      {
        id: "l8-reading-practice",
        type: "practice",
        title: "Full Verse Reading Practice",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        content: `Let's read the complete Basmala (the opening phrase):

**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**

**Word by word:**

1. **بِسْمِ** = Bismi (In the name of)
   - بِ = bi
   - سْ = s
   - مِ = mi

2. **اللَّهِ** = Allahi (of Allah)
   - Remember the Shadda on the Lam!

3. **الرَّحْمَٰنِ** = Ar-Rahmani (The Most Gracious)
   - الـ = Ar (the)
   - رَّ = Ra (doubled with Shadda)
   - حْ = h
   - مَٰ = maa (long 'a')
   - نِ = ni

4. **الرَّحِيمِ** = Ar-Raheemi (The Most Merciful)
   - الـ = Ar (the)
   - رَّ = Ra (doubled)
   - حِ = hi
   - ي = ee (long vowel)
   - مِ = mi

**Full reading:** "Bismillahir-Rahmanir-Raheem"

You've just read the most frequently recited phrase in Islam! 🎉`
      },
      {
        id: "l8-reading-quiz",
        type: "exercise",
        title: "Final Reading Check",
        content: "One more test before Al-Fatiha!",
        exercise: {
          type: "word_match",
          question: "In الرَّحْمَٰنِ, which letter has the Shadda (is doubled)?",
          options: ["Alif (ا)", "Lam (ل)", "Ra (ر)", "Ha (ح)"],
          correctAnswer: 2,
          explanation: "Correct! The Ra (ر) has the Shadda, making it الرَّحْمَٰنِ = 'Ar-RAH-maan'. The doubled Ra gives it emphasis!"
        }
      },
      {
        id: "l8-review",
        type: "instruction",
        title: "UNIT 2 COMPLETE! 🏆",
        content: `**Subhanallah! You've completed the Reading Skills unit!**

**Words you can now read:**
- اللَّه (Allah) - God
- رَبّ (Rabb) - Lord
- الْحَمْد (Al-Hamd) - The Praise
- إِيَّاكَ (Iyyaka) - You alone
- صِرَاط (Siraat) - Path

**Skills mastered:**
✅ Reading with all vowel marks
✅ Long vowels (aa, ee, oo)
✅ Shadda (doubled letters)
✅ Recognizing word patterns
✅ Reading the complete Basmala!

**Coming up - UNIT 3: Your First Surah!**
You're now ready to learn Al-Fatiha - the most important surah in the Quran!

**Preview:**
- Lesson 9: Introduction to Al-Fatiha
- Lesson 10: Verses 1-3 (Word-by-word)
- Lesson 11: Verses 4-5 (Building on memory)
- Lesson 12: Verses 6-7 + Full Review

**You're about to memorize your first surah! 📖**`
      }
    ],
    memorizationTechniques: [
      "Read each word 10 times out loud before moving on",
      "Listen to recitation while following the text",
      "Try to spot these words in any Quran page"
    ],
    keyVocabulary: [
      { arabic: "اللَّه", transliteration: "Allah", meaning: "God" },
      { arabic: "رَبّ", transliteration: "Rabb", meaning: "Lord, Master, Sustainer" },
      { arabic: "الْحَمْدُ", transliteration: "Al-Hamd", meaning: "The Praise" },
      { arabic: "إِيَّاكَ", transliteration: "Iyyaka", meaning: "You alone" },
      { arabic: "نَعْبُدُ", transliteration: "Na'budu", meaning: "We worship" },
      { arabic: "صِرَاط", transliteration: "Siraat", meaning: "Path, Way" },
      { arabic: "مُسْتَقِيم", transliteration: "Mustaqeem", meaning: "Straight, Correct" }
    ]
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 3: YOUR FIRST SURAH - AL-FATIHA (Lessons 9-12)
 * Learn, understand, and memorize the Opening Chapter
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_3_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 9: Introduction to Al-Fatiha
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-9",
    unit: 3,
    unitTitle: "Your First Surah - Al-Fatiha",
    path: "beginner",
    number: 9,
    title: "Introduction to Al-Fatiha",
    description: "Learn why Al-Fatiha is the most important surah and its beautiful structure",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 20,
    xpReward: 100,
    steps: [
      {
        id: "l9-intro",
        type: "instruction",
        title: "The Greatest Surah 📖",
        content: `You're about to learn the most recited chapter in history.

**Al-Fatiha** (الفاتحة) means "The Opening" - and it opens:
- The Quran itself
- Every rak'ah (unit) of prayer
- Countless moments of supplication

**The Prophet ﷺ said:**
"The greatest surah in the Quran is Al-Fatiha." (Bukhari)

"No prayer is valid without reciting Al-Fatiha." (Bukhari, Muslim)

In the next 4 lessons, you'll:
1. Understand why it's special (this lesson)
2. Memorize verses 1-3 (Lesson 10)
3. Memorize verses 4-5 (Lesson 11)
4. Complete verses 6-7 and review (Lesson 12)

Let's begin with understanding what makes this surah so powerful...`
      },
      {
        id: "l9-names",
        type: "explanation",
        title: "The Names of Al-Fatiha",
        content: `Al-Fatiha has many names, each revealing something about it:

**1. الفاتحة (Al-Fatiha)** - "The Opening"
Because it opens the Quran and opens our prayers.

**2. أُمُّ الكِتَاب (Umm al-Kitab)** - "Mother of the Book"
Because all Quranic themes stem from it!

**3. السَّبْعُ المَثَانِي (As-Sab' al-Mathani)** - "The Seven Oft-Repeated"
Because it has 7 verses recited repeatedly in prayer.

**4. الحَمْد (Al-Hamd)** - "The Praise"
Because it begins with "All praise is for Allah."

**5. الشِّفَاء (Ash-Shifa)** - "The Cure"
Because the Prophet ﷺ called it a cure for illness!

**6. الرُّقْيَة (Ar-Ruqya)** - "The Spiritual Healing"
Because it provides protection and healing.

Each name teaches us something special about this surah!`
      },
      {
        id: "l9-revelation",
        type: "explanation",
        title: "When Was It Revealed?",
        content: `Al-Fatiha was revealed in **Makkah** - it was one of the first complete surahs revealed!

**The Sequence:**
1. First revelation: "Iqra" (Read!) - Surah Al-Alaq
2. Shortly after: Al-Fatiha was revealed complete

**Why it came early:**
Allah gave the Muslims their prayer guide from the beginning. Before battles, before migration, before the Muslim community was established - they had Al-Fatiha.

**A Divine Conversation:**
The Prophet ﷺ reported that Allah said:

"I have divided the prayer between Myself and My servant, and My servant will have what he asks for."

When the servant says الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ,
Allah says: "My servant has praised Me."

When the servant says الرَّحْمَٰنِ الرَّحِيمِ,
Allah says: "My servant has glorified Me."

...and so on for each verse!

**Think about that:** When you recite Al-Fatiha, Allah is responding to each verse! It's a real conversation.`
      },
      {
        id: "l9-structure",
        type: "explanation",
        title: "The Beautiful Structure",
        arabicContent: "٧ آيَات",
        content: `Al-Fatiha has exactly **7 verses** with a perfect structure:

**First 3 verses: PRAISING ALLAH**
1. All praise is for Allah, Lord of all worlds
2. The Most Gracious, the Most Merciful
3. Master of the Day of Judgment

**Middle verse (4): THE COVENANT**
4. You alone we worship, and You alone we ask for help

**Last 3 verses: ASKING ALLAH**
5. Guide us to the straight path
6. The path of those You blessed
7. Not of those who earned anger, nor of those astray

**Notice the symmetry:**
- 3 verses of praise → 1 covenant verse → 3 verses of request
- We praise Allah first, THEN we ask
- The covenant (You alone we worship) is the CENTER - the heart of our relationship with Allah!

**This is the perfect model of du'a (supplication):** Praise first, then ask.`
      },
      {
        id: "l9-themes",
        type: "explanation",
        title: "The Themes - Why It's 'Umm al-Kitab'",
        content: `Al-Fatiha is called "Mother of the Book" because the ENTIRE Quran's themes are contained in these 7 verses:

**Verse 1: Tawheed (Oneness of Allah)**
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
All praise belongs to Allah alone

**Verse 2: Allah's Names and Attributes**
الرَّحْمَٰنِ الرَّحِيمِ
His Mercy above all

**Verse 3: The Afterlife**
مَالِكِ يَوْمِ الدِّينِ
The Day when all will be judged

**Verse 4: Worship and Trust**
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
The purpose of creation

**Verses 5-7: Guidance**
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
The path of success and the paths of destruction

**Every surah after Al-Fatiha** expands on one or more of these themes. That's why it's the "mother" - all other surahs are its children!`
      },
      {
        id: "l9-listen-full",
        type: "audio",
        title: "Listen to Al-Fatiha Complete",
        content: `Before memorizing verse by verse, let's listen to the complete surah 3 times.

**Instructions:**
1. First time: Just listen and feel the rhythm
2. Second time: Follow along with your eyes (read the Arabic)
3. Third time: Try to mouth the words silently

**The Arabic text:**

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾
الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾
مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾

Press play to hear the recitation...`,
        audioSegment: {
          surah: 1,
          ayahStart: 1,
          ayahEnd: 7,
          repeat: 3
        }
      },
      {
        id: "l9-memorization-method",
        type: "explanation",
        title: "The 10-3 Memorization Method",
        content: `Before we start memorizing, let me teach you a proven method:

**THE 10-3 METHOD**

**Step 1: Read 10 times WHILE LOOKING**
- Read the verse slowly 10 times
- Focus on pronunciation
- Look at each word carefully

**Step 2: Recite 3 times WITHOUT LOOKING**
- Close your eyes or look away
- Try to recite from memory
- If you forget, glance and continue

**Step 3: Connect (when adding verses)**
- After memorizing verse 2, recite verses 1+2 together
- After verse 3, recite 1+2+3 together
- This is called "STACKING"

**Why it works:**
- The 10 repetitions build neural pathways
- The 3 attempts test and reinforce
- Stacking prevents forgetting earlier verses

**We'll use this method for each verse of Al-Fatiha!**

**Other helpful techniques:**
- Listen while reading (audio reinforcement)
- Understand the meaning (comprehension aids memory)
- Review at Fajr (best time for memorization)
- Use in prayer immediately (practical application)`
      },
      {
        id: "l9-quiz",
        type: "exercise",
        title: "Understanding Check",
        content: "Let's make sure you understand the surah!",
        exercise: {
          type: "comprehension",
          question: "Why is Al-Fatiha called 'Umm al-Kitab' (Mother of the Book)?",
          options: [
            "Because it was revealed first",
            "Because all Quranic themes are contained in it",
            "Because it's the longest surah",
            "Because women recite it more"
          ],
          correctAnswer: 1,
          explanation: "Correct! Al-Fatiha is called 'Mother of the Book' because all the major themes of the entire Quran are contained in its 7 verses - Tawheed, Allah's names, the afterlife, worship, and guidance."
        }
      },
      {
        id: "l9-review",
        type: "instruction",
        title: "Lesson 9 Complete! 🌟",
        content: `**Alhamdulillah! You now understand Al-Fatiha's significance!**

**What you learned:**
✅ Al-Fatiha's many names and meanings
✅ When and why it was revealed
✅ The perfect 3-1-3 structure
✅ How it contains all Quranic themes
✅ The 10-3 memorization method

**Key takeaways:**
- Al-Fatiha is a conversation with Allah
- Every prayer requires it
- It teaches us HOW to make du'a (praise first, then ask)

**Coming in Lesson 10:**
You'll memorize verses 1-3:
- بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
- الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
- الرَّحْمَٰنِ الرَّحِيمِ

**Preparation:** Listen to Al-Fatiha recitation multiple times before the next lesson. Let your ears get familiar!`
      }
    ],
    memorizationTechniques: [
      "10-3 Method: Read 10x looking, recite 3x without",
      "Stacking: Connect new verses to previous ones",
      "Use in prayer immediately to reinforce"
    ],
    keyVocabulary: [
      { arabic: "الفاتحة", transliteration: "Al-Fatiha", meaning: "The Opening" },
      { arabic: "أُمُّ الكِتَاب", transliteration: "Umm al-Kitab", meaning: "Mother of the Book" },
      { arabic: "السَّبْعُ المَثَانِي", transliteration: "As-Sab' al-Mathani", meaning: "The Seven Oft-Repeated" },
      { arabic: "يَوْمِ الدِّينِ", transliteration: "Yawm ad-Deen", meaning: "Day of Judgment" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 10: Al-Fatiha Verses 1-3
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-10",
    unit: 3,
    unitTitle: "Your First Surah - Al-Fatiha",
    path: "beginner",
    number: 10,
    title: "Al-Fatiha - Verses 1-3",
    description: "Memorize the first three verses: Basmala, Praise, and Mercy",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 3,
    estimatedMinutes: 30,
    xpReward: 150,
    steps: [
      {
        id: "l10-intro",
        type: "instruction",
        title: "Your First Verses! 📖",
        content: `Today you'll memorize your first three verses of Quran!

**What we'll cover:**
1. Verse 1: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
2. Verse 2: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
3. Verse 3: الرَّحْمَٰنِ الرَّحِيمِ

**Our method:**
- Learn each verse word-by-word
- Understand the meaning
- Apply the 10-3 method
- Stack the verses together

**Remember:** Take your time. Quality over speed. You'll recite these verses for the rest of your life - it's worth getting them right!

Let's begin with the Basmala...`
      },
      {
        id: "l10-verse1-arabic",
        type: "explanation",
        title: "Verse 1: The Basmala",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        content: `**بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**
"Bismillahir-Rahmanir-Raheem"

**Word-by-word:**

**بِسْمِ** (Bismi) = "In the name of"
- بِ = in/with
- سْمِ = name (from اسم = ism)

**اللَّهِ** (Allahi) = "Allah"
- The name of God
- The Lam has Shadda (doubled)

**الرَّحْمَٰنِ** (Ar-Rahman) = "The Most Gracious"
- From رحم (rahm) = mercy
- Indicates ALL-encompassing mercy

**الرَّحِيمِ** (Ar-Raheem) = "The Most Merciful"
- Also from رحم (rahm)
- Indicates CONTINUOUS mercy for believers

**Translation:** "In the name of Allah, the Most Gracious, the Most Merciful"

**Say this before:** eating, starting work, entering home, any good action!`
      },
      {
        id: "l10-verse1-pronunciation",
        type: "explanation",
        title: "Pronunciation Focus: Verse 1",
        content: `Let's perfect the pronunciation:

**بِسْمِ** (Bis-mi)
- The سْ has Sukoon - no vowel!
- Say: "Bis" then "mi" - not "Bisa-mi"

**اللَّهِ** (Al-laa-hi)
- Double the Lam! (Shadda)
- The ه at the end is a light 'h'

**الرَّحْمَٰنِ** (Ar-rah-maa-ni)
- Double the Ra! (Shadda)
- The مَٰ has a long 'aa'
- End with 'ni' not 'nun'

**الرَّحِيمِ** (Ar-ra-hee-mi)
- Double the Ra!
- The حِي is 'hee' (long 'i')
- End with 'mi'

**Common mistakes:**
❌ "Bis-a-millah" → ✅ "Bis-millah"
❌ "Rahman" (short) → ✅ "Rah-maan" (long aa)
❌ "Raheem" (flat) → ✅ "Ra-heem" (emphasize the Ra)`
      },
      {
        id: "l10-verse1-listen",
        type: "audio",
        title: "Listen & Repeat: Verse 1",
        content: `Now let's apply the 10-3 method!

**Step 1: Listen 3 times**
Focus on each word.

**Step 2: Read aloud 10 times**
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ

**Step 3: Recite 3 times without looking**
Test yourself!

Press play to begin...`,
        audioSegment: {
          surah: 1,
          ayahStart: 1,
          ayahEnd: 1,
          repeat: 3
        }
      },
      {
        id: "l10-verse2-arabic",
        type: "explanation",
        title: "Verse 2: All Praise for Allah",
        arabicContent: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        content: `**الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ**
"Alhamdu lillahi Rabbil 'aalameen"

**Word-by-word:**

**الْحَمْدُ** (Al-hamdu) = "All praise"
- ال = the (definite article)
- حَمْد = praise

**لِلَّهِ** (Lillahi) = "is for Allah"
- لِ = for/to
- اللَّهِ = Allah

**رَبِّ** (Rabbi) = "Lord of"
- From رَبّ = Lord, Master, Sustainer
- The ب has Shadda (doubled)

**الْعَالَمِينَ** ('Aalameen) = "all the worlds"
- عَالَم = world/realm
- ين = plural ending
- ALL creation: humans, jinn, angels, animals, seen & unseen!

**Translation:** "All praise is for Allah, Lord of all worlds"

**This establishes:** Everything good comes from Allah. He sustains ALL of creation, not just humans!`
      },
      {
        id: "l10-verse2-listen",
        type: "audio",
        title: "Listen & Repeat: Verse 2",
        content: `**Apply 10-3 method to verse 2:**

الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ

**Pronunciation tips:**
- الْعَالَمِينَ has the Ayn (ع) - that throat sound!
- Say "AAA-la-meen" not "ah-la-meen"

**Listen 3 times, then read 10 times, then recite 3 times without looking!**`,
        audioSegment: {
          surah: 1,
          ayahStart: 2,
          ayahEnd: 2,
          repeat: 3
        }
      },
      {
        id: "l10-verse3-arabic",
        type: "explanation",
        title: "Verse 3: The Two Mercies",
        arabicContent: "الرَّحْمَٰنِ الرَّحِيمِ",
        content: `**الرَّحْمَٰنِ الرَّحِيمِ**
"Ar-Rahmanir-Raheem"

**Wait - didn't we see this in verse 1?**
Yes! But here it's a CONTINUATION of verse 2:

"All praise is for Allah, Lord of all worlds, **the Most Gracious, the Most Merciful**"

**Why repeat these names?**

**الرَّحْمَٰنِ (Ar-Rahman):**
- Mercy that covers EVERYONE and EVERYTHING
- Even those who reject Allah receive His provision
- The sun shines on everyone - that's Rahman

**الرَّحِيمِ (Ar-Raheem):**
- Special mercy for BELIEVERS
- Guidance, forgiveness, Paradise
- Extended throughout life and afterlife

**Together:** Allah's mercy is both universal AND special - no one is excluded from His general mercy, and believers receive extra!

**Grammar note:** In verse 1, these were genitive (لِلَّهِ modifying). Here, they describe رَبِّ الْعَالَمِينَ.`
      },
      {
        id: "l10-verse3-listen",
        type: "audio",
        title: "Listen & Repeat: Verse 3",
        content: `**Good news:** You've already practiced these words in verse 1!

الرَّحْمَٰنِ الرَّحِيمِ

**Quick 10-3:**
Since you know this from the Basmala, do:
- Read 5 times looking
- Recite 3 times not looking

Now comes the STACKING...`,
        audioSegment: {
          surah: 1,
          ayahStart: 3,
          ayahEnd: 3,
          repeat: 3
        }
      },
      {
        id: "l10-stack-1-3",
        type: "practice",
        title: "Stacking: Verses 1-3 Together",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ",
        content: `Now let's STACK all three verses together!

**Read all three verses connected, 5 times:**

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾
الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾

**Translation flowing together:**
"In the name of Allah, the Most Gracious, the Most Merciful.
All praise is for Allah, Lord of all worlds,
The Most Gracious, the Most Merciful."

**Now close your eyes and recite all 3 verses 3 times!**

If you can do this, you've memorized the first half of Al-Fatiha! 🎉`
      },
      {
        id: "l10-quiz",
        type: "exercise",
        title: "Verse Check",
        content: "Let's verify your understanding!",
        exercise: {
          type: "comprehension",
          question: "What does 'Rabbil 'Aalameen' (رَبِّ الْعَالَمِينَ) mean?",
          options: [
            "King of mankind",
            "Lord of all worlds",
            "Master of the day",
            "Guide of the believers"
          ],
          correctAnswer: 1,
          explanation: "Correct! 'Rabbil 'Aalameen' means 'Lord of all worlds' - all creation, seen and unseen, is under Allah's care and sustenance!"
        }
      },
      {
        id: "l10-review",
        type: "instruction",
        title: "Lesson 10 Complete! 🌟",
        content: `**Mashallah! You've memorized verses 1-3!**

**What you now have memorized:**

**Verse 1:** بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
In the name of Allah, the Most Gracious, the Most Merciful

**Verse 2:** الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
All praise is for Allah, Lord of all worlds

**Verse 3:** الرَّحْمَٰنِ الرَّحِيمِ
The Most Gracious, the Most Merciful

**Daily practice:**
- Recite these 3 verses 10 times tomorrow morning
- Use them when starting any task
- Review before Lesson 11

**Coming in Lesson 11:**
Verses 4-5:
- مَالِكِ يَوْمِ الدِّينِ (Master of the Day of Judgment)
- إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ (You alone we worship...)

You're halfway through Al-Fatiha! Keep going! 💪`
      }
    ],
    memorizationTechniques: [
      "10-3 Method: Read 10x looking, recite 3x without",
      "Stack: After memorizing verse 3, recite 1+2+3 together",
      "Review verses 1-3 before starting lesson 11"
    ],
    keyVocabulary: [
      { arabic: "بِسْمِ", transliteration: "Bismi", meaning: "In the name of" },
      { arabic: "الْحَمْدُ", transliteration: "Al-Hamdu", meaning: "All praise" },
      { arabic: "لِلَّهِ", transliteration: "Lillahi", meaning: "is for Allah" },
      { arabic: "رَبِّ", transliteration: "Rabbi", meaning: "Lord of" },
      { arabic: "الْعَالَمِينَ", transliteration: "Al-'Aalameen", meaning: "All worlds" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 11: Al-Fatiha Verses 4-5
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-11",
    unit: 3,
    unitTitle: "Your First Surah - Al-Fatiha",
    path: "beginner",
    number: 11,
    title: "Al-Fatiha - Verses 4-5",
    description: "Memorize the middle verses: Master of Judgment Day and the Covenant of Worship",
    surah: 1,
    ayahStart: 4,
    ayahEnd: 5,
    estimatedMinutes: 30,
    xpReward: 150,
    steps: [
      {
        id: "l11-intro",
        type: "instruction",
        title: "The Heart of Al-Fatiha ❤️",
        content: `Welcome back! Let's review verses 1-3 first, then add two powerful new verses.

**Quick Review - Recite out loud:**
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
الرَّحْمَٰنِ الرَّحِيمِ

**Today's verses:**
- Verse 4: مَالِكِ يَوْمِ الدِّينِ - About Allah's sovereignty over Judgment Day
- Verse 5: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ - The central covenant!

**Verse 5 is special:** It's the EXACT MIDDLE of Al-Fatiha - the pivot point where we transition from praising Allah to asking from Him.`
      },
      {
        id: "l11-verse4-arabic",
        type: "explanation",
        title: "Verse 4: Master of Judgment Day",
        arabicContent: "مَالِكِ يَوْمِ الدِّينِ",
        content: `**مَالِكِ يَوْمِ الدِّينِ**
"Maaliki yawmid-deen"

**Word-by-word:**

**مَالِكِ** (Maaliki) = "Master/Owner of"
- From مَلَكَ (malaka) = to own, possess
- Allah owns EVERYTHING on that Day
- No one else has any authority

**يَوْمِ** (Yawmi) = "Day of"
- يَوْم = day
- Which day? The most important day...

**الدِّينِ** (Ad-Deen) = "The Judgment/Recompense"
- دِين has multiple meanings: religion, judgment, recompense
- Here it means the Day when all deeds are judged

**Translation:** "Master of the Day of Judgment"

**Why this matters:**
On that Day, no one can help you except Allah:
- No wealth will benefit
- No family can intervene  
- Only your deeds and Allah's mercy

Remembering this Day keeps us humble and motivated!`
      },
      {
        id: "l11-verse4-pronunciation",
        type: "explanation",
        title: "Pronunciation Focus: Verse 4",
        content: `**مَالِكِ يَوْمِ الدِّينِ**

**مَالِكِ** (Maa-li-ki)
- Long 'aa' after the Meem
- The Kasra at end connects to next word

**يَوْمِ** (Yaw-mi)
- The و here is consonant 'w', not long vowel
- Ya + Fatha + Waw + Meem + Kasra

**الدِّينِ** (Ad-dee-ni)
- The Lam merges into the Dal (sun letter!)
- So it's "ad-deen" not "al-deen"
- The دِّ has Shadda - double it!
- Long 'ee' sound: dee-ni

**Full pronunciation:** "Maa-li-ki yaw-mid-dee-ni"

**Common mistakes:**
❌ "Malik" (short a) → ✅ "Maalik" (long aa)
❌ "Al-deen" → ✅ "Ad-deen" (Lam assimilates)
❌ "Yowm" → ✅ "Yawm" (it's 'aw' not 'ow')`
      },
      {
        id: "l11-verse4-listen",
        type: "audio",
        title: "Listen & Repeat: Verse 4",
        content: `**Apply the 10-3 method:**

مَالِكِ يَوْمِ الدِّينِ

1. Listen 3 times
2. Read 10 times while looking
3. Recite 3 times without looking

Press play to begin...`,
        audioSegment: {
          surah: 1,
          ayahStart: 4,
          ayahEnd: 4,
          repeat: 3
        }
      },
      {
        id: "l11-stack-1-4",
        type: "practice",
        title: "Stack: Verses 1-4",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ",
        content: `Before learning verse 5, let's stack 1-4 together!

**Recite all four verses 3 times:**

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾
الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾
مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾

**Notice the flow:**
- Verse 1: We begin with Allah's name
- Verse 2: We praise Him as Lord of all
- Verse 3: We acknowledge His mercy
- Verse 4: We remember His judgment

**These 4 verses are all about ALLAH - His names, His attributes, His authority.**

Now verse 5 shifts to US - our relationship with Him!`
      },
      {
        id: "l11-verse5-arabic",
        type: "explanation",
        title: "Verse 5: The Covenant of Worship",
        arabicContent: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        content: `**إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ**
"Iyyaka na'budu wa iyyaka nasta'een"

**Word-by-word:**

**إِيَّاكَ** (Iyyaka) = "You alone"
- Special emphatic form
- Placed FIRST for emphasis!

**نَعْبُدُ** (Na'budu) = "we worship"
- نـ = "we" prefix
- عَبَدَ = to worship, serve
- Contains ع (Ayn) - practice that throat sound!

**وَ** (Wa) = "and"

**إِيَّاكَ** (Iyyaka) = "You alone" (repeated!)

**نَسْتَعِينُ** (Nasta'een) = "we ask for help"
- نـ = "we"
- اسْتَعَانَ = to seek help
- Also contains ع (Ayn)!

**Translation:** "You alone we worship, and You alone we ask for help"

**THIS IS THE HEART OF ISLAM:**
- Worship ONLY Allah
- Seek help ONLY from Allah
- This is Tawheed (monotheism) in action!`
      },
      {
        id: "l11-verse5-depth",
        type: "explanation",
        title: "The Deep Meaning of Verse 5",
        content: `**Why is word order reversed?**

Normal Arabic: "Na'budu iyyaka" (We worship You)
Quran: "Iyyaka na'budu" (YOU ALONE we worship)

Putting "Iyyaka" first creates EXCLUSIVITY:
- Not "we worship You among others"
- But "You ALONE - no one else"

**The two parts:**

**1. إِيَّاكَ نَعْبُدُ - You alone we worship**
- Worship (عِبَادَة) includes: prayer, fasting, charity, ALL acts of devotion
- We dedicate all worship to Allah alone

**2. إِيَّاكَ نَسْتَعِينُ - You alone we ask for help**
- We rely on Allah, not our own strength
- We seek His help in worshipping Him!

**The beautiful logic:**
We can't even worship properly without His help! So after declaring worship, we immediately ask for His assistance to do it right.

**This verse divides Al-Fatiha:**
- Verses 1-4: About Allah (praising Him)
- Verse 5: The connection (our covenant)
- Verses 6-7: Our request (guidance)`
      },
      {
        id: "l11-verse5-listen",
        type: "audio",
        title: "Listen & Repeat: Verse 5",
        content: `**This verse has Ayn (ع) twice - practice those throat sounds!**

إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ

**Pronunciation breakdown:**
- إِيَّاكَ = Iy-yaa-ka (Ya has Shadda!)
- نَعْبُدُ = Na'-bu-du (feel the Ayn!)
- نَسْتَعِينُ = Nas-ta-'ee-nu (Ayn + long ee)

**10-3 method - go!**`,
        audioSegment: {
          surah: 1,
          ayahStart: 5,
          ayahEnd: 5,
          repeat: 3
        }
      },
      {
        id: "l11-stack-1-5",
        type: "practice",
        title: "Stack: Verses 1-5",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        content: `**Now stack all five verses!**

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾
الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾
مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾

**Recite 5 times connected!**

**Feel the shift:**
Verses 1-4 talked ABOUT Allah (third person: He)
Verse 5 talks TO Allah (second person: You)

We've moved from describing Allah to addressing Him directly!

**You're over 70% done with Al-Fatiha!** 🎉`
      },
      {
        id: "l11-quiz",
        type: "exercise",
        title: "Understanding Check",
        content: "Let's verify your comprehension!",
        exercise: {
          type: "comprehension",
          question: "Why is إِيَّاكَ (Iyyaka - You alone) placed at the beginning of verse 5?",
          options: [
            "It's just the normal Arabic word order",
            "To emphasize EXCLUSIVITY - Allah alone, no one else",
            "Because it's easier to pronounce",
            "It's a mistake in the Quran"
          ],
          correctAnswer: 1,
          explanation: "Correct! Placing إِيَّاكَ (You alone) at the start emphasizes exclusivity. We worship Allah ALONE and seek help from Allah ALONE - no partners, no intermediaries."
        }
      },
      {
        id: "l11-review",
        type: "instruction",
        title: "Lesson 11 Complete! 🌟",
        content: `**Alhamdulillah! You've memorized 5 of 7 verses!**

**Today's verses:**

**Verse 4:** مَالِكِ يَوْمِ الدِّينِ
Master of the Day of Judgment

**Verse 5:** إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ
You alone we worship, and You alone we ask for help

**Key insights:**
- Verse 4 reminds us of accountability
- Verse 5 is the heart of Tawheed (monotheism)
- The word order emphasizes exclusivity

**Coming in Lesson 12:**
The final two verses + full surah review:
- اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ
- صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ...

**Only 2 more verses to go!** You're almost there! 💪`
      }
    ],
    memorizationTechniques: [
      "Feel the shift at verse 5: from 'about Allah' to 'to Allah'",
      "Practice the Ayn sound in نَعْبُدُ and نَسْتَعِينُ",
      "Remember: إِيَّاكَ first = EXCLUSIVE worship"
    ],
    keyVocabulary: [
      { arabic: "مَالِكِ", transliteration: "Maaliki", meaning: "Master/Owner of" },
      { arabic: "يَوْمِ", transliteration: "Yawmi", meaning: "Day of" },
      { arabic: "الدِّينِ", transliteration: "Ad-Deen", meaning: "The Judgment" },
      { arabic: "إِيَّاكَ", transliteration: "Iyyaka", meaning: "You alone" },
      { arabic: "نَعْبُدُ", transliteration: "Na'budu", meaning: "We worship" },
      { arabic: "نَسْتَعِينُ", transliteration: "Nasta'een", meaning: "We seek help" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 12: Al-Fatiha Verses 6-7 + Full Review
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-12",
    unit: 3,
    unitTitle: "Your First Surah - Al-Fatiha",
    path: "beginner",
    number: 12,
    title: "Al-Fatiha - Verses 6-7 + Complete Surah!",
    description: "Complete your memorization of Al-Fatiha and celebrate your achievement!",
    surah: 1,
    ayahStart: 6,
    ayahEnd: 7,
    estimatedMinutes: 35,
    xpReward: 200,
    steps: [
      {
        id: "l12-intro",
        type: "instruction",
        title: "The Final Verses! 🏁",
        content: `This is it! After this lesson, you'll have memorized your first complete surah!

**Review first - recite verses 1-5:**
بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
الرَّحْمَٰنِ الرَّحِيمِ
مَالِكِ يَوْمِ الدِّينِ
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ

**Today's verses (6-7):**
These are our REQUEST to Allah - the du'a portion!
After praising Him and declaring our worship, NOW we ask.

This is the perfect model of supplication:
1. Praise Allah
2. Acknowledge His authority  
3. Declare exclusive worship
4. THEN make your request

Let's complete the surah!`
      },
      {
        id: "l12-verse6-arabic",
        type: "explanation",
        title: "Verse 6: The Greatest Request",
        arabicContent: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        content: `**اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ**
"Ihdinas-siraatal-mustaqeem"

**Word-by-word:**

**اهْدِنَا** (Ihdina) = "Guide us"
- From هَدَى (hada) = to guide
- اِ = imperative (asking/commanding form)
- نَا = "us" (plural - includes all believers!)

**الصِّرَاطَ** (As-Siraat) = "the path"
- Note: It's صِرَاط not سِرَاط (emphatic Sad!)
- Siraat means a clear, wide road

**الْمُسْتَقِيمَ** (Al-Mustaqeem) = "the straight"
- From اِسْتَقَامَ = to be straight, upright
- Contains ق (Qaf) - that deep 'k' sound!

**Translation:** "Guide us to the straight path"

**Why this is THE request:**
If you only had ONE thing to ask Allah, this would be it!
- Guidance to truth
- Guidance to good deeds
- Guidance to Paradise

Every time you recite Al-Fatiha, you're asking for guidance!`
      },
      {
        id: "l12-verse6-pronunciation",
        type: "explanation",
        title: "Pronunciation Focus: Verse 6",
        content: `**اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ**

**اهْدِنَا** (Ih-di-naa)
- Starts with Hamza (glottal stop)
- The ه has Sukoon - no vowel
- نَا = long 'aa' at the end

**الصِّرَاطَ** (As-si-raa-ta)
- The ل merges into ص (sun letter!)
- So it's "as-siraat" not "al-siraat"
- ص is emphatic - make it heavy!
- Long 'aa' in the middle

**الْمُسْتَقِيمَ** (Al-mus-ta-qeem)
- This one keeps "al-" (Meem is a moon letter)
- The ق (Qaf) = very deep 'k' from throat
- Long 'ee' sound: qeem

**Full flow:** "Ih-di-nas-si-raa-tal-mus-ta-qeem"

**Key sounds:**
- ص (Sad) - heavy/emphatic 's'
- ق (Qaf) - deep throat 'k'`
      },
      {
        id: "l12-verse6-listen",
        type: "audio",
        title: "Listen & Repeat: Verse 6",
        content: `**Focus on the emphatic letters!**

اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ

Pay attention to:
- صِرَاط - heavy 'S' sound
- مُسْتَقِيم - deep 'Q' sound

**10-3 method - let's go!**`,
        audioSegment: {
          surah: 1,
          ayahStart: 6,
          ayahEnd: 6,
          repeat: 3
        }
      },
      {
        id: "l12-verse7-arabic",
        type: "explanation",
        title: "Verse 7: The Path Clarified",
        arabicContent: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        content: `**صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ**
"Siraatal-ladheena an'amta 'alayhim ghayril-maghdoobi 'alayhim walad-daalleen"

**This is the longest verse - let's break it into parts:**

**Part 1:** صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ
"The path of those You have blessed"
- الَّذِينَ = those who
- أَنْعَمْتَ = You blessed/favored
- عَلَيْهِمْ = upon them

**Part 2:** غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ
"Not of those who earned [Your] anger"
- غَيْرِ = not, other than
- الْمَغْضُوبِ = those angered upon (contains غ Ghayn!)
- عَلَيْهِمْ = upon them

**Part 3:** وَلَا الضَّالِّينَ
"Nor of those who went astray"
- وَلَا = and not
- الضَّالِّينَ = the ones astray (contains ض Dad and ل with Shadda!)

**Three groups:**
1. ✅ Those blessed (prophets, truthful ones, martyrs, righteous)
2. ❌ Those who knew truth but rejected it (earned anger)
3. ❌ Those who went astray from truth (misguided)`
      },
      {
        id: "l12-verse7-parts",
        type: "explanation",
        title: "Memorizing Verse 7 in Chunks",
        content: `Verse 7 is long, so let's break it into 3 chunks:

**CHUNK 1:** صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ
"Siraatal-ladheena an'amta 'alayhim"
(The path of those You have blessed)

**CHUNK 2:** غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ
"Ghayril-maghdoobi 'alayhim"
(Not of those who earned anger)

**CHUNK 3:** وَلَا الضَّالِّينَ
"Walad-daalleen"
(Nor of those astray)

**Memorization strategy:**
1. Master Chunk 1 (10-3 method)
2. Master Chunk 2 (10-3 method)
3. Connect Chunks 1+2
4. Master Chunk 3 (10-3 method)
5. Connect all three: 1+2+3

**Special sounds to practice:**
- غ (Ghayn) in مَغْضُوبِ - gargling sound
- ض (Dad) in الضَّالِّينَ - heavy 'd' (unique to Arabic!)
- الضَّالِّينَ has Shadda on both ض and ل`
      },
      {
        id: "l12-verse7-listen",
        type: "audio",
        title: "Listen & Repeat: Verse 7",
        content: `**The grand finale! Listen carefully to the full verse:**

صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ 
غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ 
وَلَا الضَّالِّينَ

**Apply 10-3 to each chunk, then connect!**`,
        audioSegment: {
          surah: 1,
          ayahStart: 7,
          ayahEnd: 7,
          repeat: 3
        }
      },
      {
        id: "l12-full-surah",
        type: "practice",
        title: "🎉 The Complete Al-Fatiha!",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nالرَّحْمَٰنِ الرَّحِيمِ\nمَالِكِ يَوْمِ الدِّينِ\nإِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nاهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nصِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        content: `**THE MOMENT OF TRUTH!**

Close your eyes and recite the complete Al-Fatiha:

بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ ﴿١﴾
الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ﴿٢﴾
الرَّحْمَٰنِ الرَّحِيمِ ﴿٣﴾
مَالِكِ يَوْمِ الدِّينِ ﴿٤﴾
إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ﴿٥﴾
اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ﴿٦﴾
صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ ﴿٧﴾

آمِين (Ameen)

**Recite the full surah 3 times from memory!**

Can you do it? If you stumble, glance at the text and continue. With practice, it will become second nature!`
      },
      {
        id: "l12-ameen",
        type: "explanation",
        title: "The Word After: آمِين (Ameen)",
        content: `After reciting Al-Fatiha, we say: **آمِين (Ameen)**

**What does it mean?**
"O Allah, answer/accept [this prayer]"

**It's not part of the Quran!**
Ameen is a du'a we add after Al-Fatiha. It's Sunnah (practice of the Prophet ﷺ).

**When to say it:**
- After reciting Al-Fatiha in prayer
- Especially after the Imam recites in congregation
- The Prophet ﷺ said: "When the Imam says Ameen, say Ameen, for whoever's Ameen coincides with that of the angels will have their past sins forgiven." (Bukhari)

**Pronunciation:**
آمِين = Aa-meen (long 'aa' at start, long 'ee' in middle)

**Tip:** In Fajr, Maghrib, and Isha prayers, say Ameen out loud after the Imam finishes Al-Fatiha!`
      },
      {
        id: "l12-quiz",
        type: "exercise",
        title: "Final Comprehension Check",
        content: "Let's make sure you understand the whole surah!",
        exercise: {
          type: "comprehension",
          question: "In verse 7, what are the THREE groups mentioned?",
          options: [
            "Angels, humans, and jinn",
            "Those blessed, those who earned anger, and those astray",
            "Prophets, scholars, and worshippers",
            "Past, present, and future believers"
          ],
          correctAnswer: 1,
          explanation: "Correct! Verse 7 mentions: (1) Those blessed by Allah - the path we want, (2) Those who earned anger - knew truth but rejected it, (3) Those who went astray - misguided from truth. We ask to be with group 1, not groups 2 or 3!"
        }
      },
      {
        id: "l12-celebration",
        type: "instruction",
        title: "🏆 CONGRATULATIONS! You've Memorized Al-Fatiha! 🏆",
        content: `**SUBHANALLAH! ALLAHU AKBAR! ALHAMDULILLAH!**

You have memorized the greatest surah in the Quran!

**What you've accomplished:**
✅ Learned all 28 Arabic letters
✅ Mastered vowels and special marks
✅ Memorized 7 verses of pure guidance
✅ Understood the meaning of each word

**What this means:**
- You can now pray with Al-Fatiha
- You recite what millions of Muslims recite daily
- You've taken the first step in Quran memorization
- The angels recorded this achievement for you!

**The Prophet ﷺ said:**
"Whoever recites a letter from the Book of Allah will receive a good deed, and each good deed is multiplied by ten."

You just recited dozens of letters. Imagine the rewards!

**Next steps:**
1. Use Al-Fatiha in your prayers starting TODAY
2. Review daily for 1 week to solidify
3. Continue to the next surahs: Al-Ikhlas, Al-Falaq, An-Nas

**You are now a Hafiz of Al-Fatiha!** 📖🌟`
      }
    ],
    memorizationTechniques: [
      "Break verse 7 into 3 chunks, memorize each, then connect",
      "Practice the unique sounds: غ (Ghayn) and ض (Dad)",
      "Recite the full surah in every prayer for reinforcement"
    ],
    keyVocabulary: [
      { arabic: "اهْدِنَا", transliteration: "Ihdina", meaning: "Guide us" },
      { arabic: "الصِّرَاطَ", transliteration: "As-Siraat", meaning: "The path" },
      { arabic: "الْمُسْتَقِيمَ", transliteration: "Al-Mustaqeem", meaning: "The straight" },
      { arabic: "أَنْعَمْتَ", transliteration: "An'amta", meaning: "You blessed" },
      { arabic: "الْمَغْضُوبِ", transliteration: "Al-Maghdoob", meaning: "Those angered upon" },
      { arabic: "الضَّالِّينَ", transliteration: "Ad-Daalleen", meaning: "Those astray" },
      { arabic: "آمِين", transliteration: "Ameen", meaning: "O Allah, accept" }
    ]
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 4: SHORT SURAHS (Lessons 13+)
 * Build your memorization with beautiful short surahs
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_4_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 13: Surah Al-Ikhlas
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-13",
    unit: 4,
    unitTitle: "Short Surahs",
    path: "beginner",
    number: 13,
    title: "Surah Al-Ikhlas - Pure Monotheism",
    description: "Memorize the surah equal to one-third of the Quran in reward",
    surah: 112,
    ayahStart: 1,
    ayahEnd: 4,
    estimatedMinutes: 20,
    xpReward: 100,
    steps: [
      {
        id: "l13-intro",
        type: "instruction",
        title: "The Essence of Tawheed 🌟",
        content: `After memorizing Al-Fatiha, you're ready for more!

**Surah Al-Ikhlas (الإخلاص)** is special:

**The Prophet ﷺ said:**
"Qul Huwa Allahu Ahad is equal to one-third of the Quran." (Bukhari, Muslim)

**Why?** Because the Quran covers three main topics:
1. Stories and history
2. Laws and guidance
3. Allah's nature and oneness (Tawheed)

Al-Ikhlas covers #3 COMPLETELY in just 4 short verses!

**Another hadith:**
A man kept reciting Al-Ikhlas in every prayer. The Prophet ﷺ asked why. He said, "Because it describes Ar-Rahman, and I love it." The Prophet ﷺ said: "Your love for it will admit you to Paradise."

Let's learn this beloved surah!`
      },
      {
        id: "l13-overview",
        type: "explanation",
        title: "Surah Overview",
        arabicContent: "قُلْ هُوَ ٱللَّهُ أَحَدٌ\nٱللَّهُ ٱلصَّمَدُ\nلَمْ يَلِدْ وَلَمْ يُولَدْ\nوَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
        content: `**Quick Facts:**
- Name: Al-Ikhlas (The Sincerity/Purity)
- Verses: 4 (very short!)
- Revealed: Makkah
- Position: 112th surah

**The Full Text:**

قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾
ٱللَّهُ ٱلصَّمَدُ ﴿٢﴾
لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾
وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ ﴿٤﴾

**Why it was revealed:**
The pagans of Makkah asked: "Tell us about your Lord - what is He made of? Is He gold, silver, or something else?"

Allah revealed this surah to describe Himself in terms NO creation can match.`
      },
      {
        id: "l13-verse1",
        type: "explanation",
        title: "Verse 1: The Declaration",
        arabicContent: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
        content: `**قُلْ هُوَ ٱللَّهُ أَحَدٌ**
"Qul huwa Allahu ahad"

**Word-by-word:**

**قُلْ** (Qul) = "Say"
- An command to the Prophet ﷺ (and us!)
- Contains ق (Qaf) - deep throat 'k'

**هُوَ** (Huwa) = "He"
- Referring to Allah

**ٱللَّهُ** (Allah) = "Allah"
- The name of God

**أَحَدٌ** (Ahad) = "One" (Unique One)
- Not just "one" in number
- Absolutely unique, without equal

**Translation:** "Say: He is Allah, the One"

**أَحَدٌ vs. وَاحِد:**
- واحد (wahid) = one (in counting: 1, 2, 3...)
- أحد (ahad) = uniquely one (no second possible!)

Allah is not "one god among many" - He is THE One, uniquely singular!`
      },
      {
        id: "l13-verse2",
        type: "explanation",
        title: "Verse 2: The Self-Sufficient",
        arabicContent: "ٱللَّهُ ٱلصَّمَدُ",
        content: `**ٱللَّهُ ٱلصَّمَدُ**
"Allahus-Samad"

**Word-by-word:**

**ٱللَّهُ** (Allah) = "Allah"

**ٱلصَّمَدُ** (As-Samad) = "The Self-Sufficient, The Eternal"

**What does As-Samad mean?**
This is a powerful name with layers:

1. **The One all creation depends on**
   - Everyone needs Allah
   - Allah needs no one

2. **The Eternal, without beginning or end**
   - Never changes
   - Never weakens

3. **The Perfect, complete in all attributes**
   - No deficiency
   - No limitation

**Translation:** "Allah, the Self-Sufficient (upon Whom all depend)"

**Reflection:** Everything in the universe turns to Allah for its needs - the sun, the stars, the angels, humans, animals. Yet Allah turns to no one. He is As-Samad.`
      },
      {
        id: "l13-verse3",
        type: "explanation",
        title: "Verse 3: Beyond Human Relationships",
        arabicContent: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        content: `**لَمْ يَلِدْ وَلَمْ يُولَدْ**
"Lam yalid wa lam yoolad"

**Word-by-word:**

**لَمْ** (Lam) = "did not" (negation)

**يَلِدْ** (Yalid) = "beget/give birth"
- From وَلَدَ = to give birth

**وَ** (Wa) = "and"

**لَمْ** (Lam) = "did not"

**يُولَدْ** (Yoolad) = "was begotten/born"
- Passive form: to be born

**Translation:** "He neither begets nor was begotten"

**Why is this important?**
This negates the beliefs of:
- Pagans who claimed angels were Allah's daughters
- Those who claim Allah has a son
- Any idea that Allah has family relations

**The logic:**
If Allah had children, they would be like Him.
If He was born, He had a beginning.
Both are impossible for the Eternal, Self-Sufficient One.`
      },
      {
        id: "l13-verse4",
        type: "explanation",
        title: "Verse 4: Absolutely Unique",
        arabicContent: "وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ",
        content: `**وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ**
"Wa lam yakul-lahu kufuwan ahad"

**Word-by-word:**

**وَ** (Wa) = "And"

**لَمْ يَكُن** (Lam yakun) = "there is not"

**لَّهُۥ** (Lahu) = "for Him"

**كُفُوًا** (Kufuwan) = "comparable/equal"
- From كَفَأَ = to be equal

**أَحَدٌ** (Ahad) = "anyone/one"

**Translation:** "And there is none comparable to Him"

**The perfect conclusion:**
After establishing:
- He is uniquely One (v.1)
- He is Self-Sufficient (v.2)
- He has no family relations (v.3)

The surah concludes: NO ONE is like Him. Not in essence, attributes, or actions.

**Nothing in creation resembles the Creator!**`
      },
      {
        id: "l13-listen",
        type: "audio",
        title: "Listen & Memorize",
        content: `**Now let's memorize all 4 verses!**

Since the surah is short, we can learn it all together:

قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾
ٱللَّهُ ٱلصَّمَدُ ﴿٢﴾
لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾
وَلَمْ يَكُن لَّهُۥ كُفُوًا أَحَدٌ ﴿٤﴾

**Listen 5 times, then recite 10 times looking, then 5 times from memory!**`,
        audioSegment: {
          surah: 112,
          ayahStart: 1,
          ayahEnd: 4,
          repeat: 5
        }
      },
      {
        id: "l13-quiz",
        type: "exercise",
        title: "Understanding Check",
        content: "Test your knowledge!",
        exercise: {
          type: "comprehension",
          question: "What does 'As-Samad' (الصَّمَدُ) mean?",
          options: [
            "The Most Merciful",
            "The Creator",
            "The Self-Sufficient (upon Whom all depend)",
            "The All-Knowing"
          ],
          correctAnswer: 2,
          explanation: "Correct! As-Samad means the Self-Sufficient, the Eternal One upon Whom all creation depends, while He depends on none. Everything needs Allah; Allah needs nothing."
        }
      },
      {
        id: "l13-review",
        type: "instruction",
        title: "Lesson 13 Complete! 🌟",
        content: `**Mashallah! You've memorized Surah Al-Ikhlas!**

**What you learned:**
- Verse 1: Allah is uniquely One
- Verse 2: Allah is Self-Sufficient (As-Samad)
- Verse 3: Allah has no family relations
- Verse 4: Nothing is comparable to Allah

**When to recite:**
- 3 times before sleep (Sunnah)
- 3 times after Fajr and Maghrib (Sunnah)
- In the last two rak'ahs of prayer
- Anytime for tremendous reward!

**Remember:** Each recitation = reward of 1/3 of Quran!

**Coming up:** Surah Al-Falaq (The Daybreak) - seeking protection from evil!

**You now have 2 complete surahs memorized!** 📖`
      }
    ],
    memorizationTechniques: [
      "Notice the rhyme: Ahad/Samad and Yalid/Yoolad",
      "It's short enough to memorize in one sitting!",
      "Recite 3 times before bed every night"
    ],
    keyVocabulary: [
      { arabic: "قُلْ", transliteration: "Qul", meaning: "Say" },
      { arabic: "أَحَدٌ", transliteration: "Ahad", meaning: "The Uniquely One" },
      { arabic: "الصَّمَدُ", transliteration: "As-Samad", meaning: "The Self-Sufficient" },
      { arabic: "يَلِدْ", transliteration: "Yalid", meaning: "Beget" },
      { arabic: "كُفُوًا", transliteration: "Kufuwan", meaning: "Comparable" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 14: Surah Al-Falaq
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-14",
    unit: 4,
    unitTitle: "Short Surahs",
    path: "beginner",
    number: 14,
    title: "Surah Al-Falaq - Seeking Refuge in the Lord of Daybreak",
    description: "Memorize the surah of protection from external evils",
    surah: 113,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 20,
    xpReward: 100,
    steps: [
      {
        id: "l14-intro",
        type: "instruction",
        title: "The Two Protectors 🛡️",
        content: `Surah Al-Falaq and Surah An-Nas together are called **Al-Mu'awwidhatayn** - "The Two Protectors."

**The Prophet ﷺ said:**
"Recite the Mu'awwidhatayn, for you will never recite anything like them." (Abu Dawud)

He ﷺ would recite them:
- Before sleep (blowing into hands and wiping over body)
- When sick
- To seek protection from all evils

**Al-Falaq (الفَلَق)** seeks protection from EXTERNAL evils:
- Darkness
- Magic
- Envy

**An-Nas** (next lesson) seeks protection from INTERNAL evils:
- Whispers of Satan

Let's learn Al-Falaq!`
      },
      {
        id: "l14-verse1",
        type: "explanation",
        title: "Verse 1: The Lord of Daybreak",
        arabicContent: "قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ",
        content: `**قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ**
"Qul a'oodhu bi-rabbil-falaq"

**Word-by-word:**

**قُلْ** (Qul) = "Say"
- Command to Prophet ﷺ (and us)

**أَعُوذُ** (A'oodhu) = "I seek refuge"
- From عاذ = to seek protection
- Contains ع (Ayn) - practice that throat sound!

**بِرَبِّ** (Bi-Rabbi) = "in the Lord of"

**ٱلْفَلَقِ** (Al-Falaq) = "the daybreak/dawn"
- The splitting of darkness by light
- Symbolizes Allah's power over darkness

**Translation:** "Say: I seek refuge in the Lord of the daybreak"

**Why "Lord of daybreak"?**
Allah splits the darkness to bring light. If He can overpower all darkness in the universe, He can protect you from any evil!`
      },
      {
        id: "l14-verses2-5",
        type: "explanation",
        title: "Verses 2-5: The Four Evils",
        arabicContent: "مِن شَرِّ مَا خَلَقَ\nوَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ\nوَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ\nوَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        content: `The surah asks protection from 4 evils:

**Verse 2:** مِن شَرِّ مَا خَلَقَ
"Min sharri ma khalaq"
"From the evil of what He created"
- All harmful things in creation

**Verse 3:** وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ
"Wa min sharri ghasiqin idha waqab"
"And from the evil of darkness when it settles"
- Night is when evils lurk
- غَاسِق (ghasiq) = intense darkness

**Verse 4:** وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ
"Wa min sharrin-naffathati fil-'uqad"
"And from the evil of those who blow on knots"
- Reference to black magic
- النَّفَّٰثَٰت = those who blow

**Verse 5:** وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ
"Wa min sharri hasidin idha hasad"
"And from the evil of an envier when they envy"
- حاسد (hasid) = envier
- The evil eye is real!

**Pattern:** Each verse starts with "min sharri" (from the evil of...)`
      },
      {
        id: "l14-listen",
        type: "audio",
        title: "Listen & Memorize",
        content: `**All 5 verses together:**

قُلْ أَعُوذُ بِرَبِّ ٱلْفَلَقِ ﴿١﴾
مِن شَرِّ مَا خَلَقَ ﴿٢﴾
وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴿٣﴾
وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِى ٱلْعُقَدِ ﴿٤﴾
وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ﴿٥﴾

**Notice:** "Min sharri" repeats 4 times - this helps memorization!

**10-3 method on entire surah!**`,
        audioSegment: {
          surah: 113,
          ayahStart: 1,
          ayahEnd: 5,
          repeat: 5
        }
      },
      {
        id: "l14-quiz",
        type: "exercise",
        title: "Understanding Check",
        content: "Test your knowledge!",
        exercise: {
          type: "comprehension",
          question: "What does 'Al-Falaq' (الفَلَق) mean?",
          options: [
            "The night",
            "The daybreak/dawn",
            "The envy",
            "The protection"
          ],
          correctAnswer: 1,
          explanation: "Correct! Al-Falaq means the daybreak or dawn - the splitting of darkness by light. We seek refuge in the Lord Who controls even this cosmic event!"
        }
      },
      {
        id: "l14-review",
        type: "instruction",
        title: "Lesson 14 Complete! 🌟",
        content: `**Mashallah! Surah Al-Falaq memorized!**

**The 4 evils we seek refuge from:**
1. All harmful creation
2. Darkness when it settles
3. Those who practice black magic
4. The envier when they envy

**When to recite:**
- Before sleep (blow on hands, wipe over body)
- Morning and evening (3 times each)
- When feeling afraid or unsafe
- When sensing evil eye

**Coming up:** Surah An-Nas - protection from the whisperer!

**You now have 3 surahs memorized!** 📖

**Tip:** Recite Al-Falaq and An-Nas together - they're a pair!`
      }
    ],
    memorizationTechniques: [
      "Remember: 'Min sharri' (from the evil of) repeats 4 times",
      "Learn with An-Nas as a pair - they protect from external and internal evils",
      "Recite every night before sleep"
    ],
    keyVocabulary: [
      { arabic: "أَعُوذُ", transliteration: "A'oodhu", meaning: "I seek refuge" },
      { arabic: "الْفَلَقِ", transliteration: "Al-Falaq", meaning: "The daybreak" },
      { arabic: "شَرِّ", transliteration: "Sharr", meaning: "Evil" },
      { arabic: "غَاسِقٍ", transliteration: "Ghasiq", meaning: "Darkness" },
      { arabic: "حَاسِدٍ", transliteration: "Hasid", meaning: "Envier" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 15: Surah An-Nas
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "lesson-15",
    unit: 4,
    unitTitle: "Short Surahs",
    path: "beginner",
    number: 15,
    title: "Surah An-Nas - Seeking Refuge from the Whisperer",
    description: "Memorize the final surah of the Quran - protection from Shaytan",
    surah: 114,
    ayahStart: 1,
    ayahEnd: 6,
    estimatedMinutes: 20,
    xpReward: 100,
    steps: [
      {
        id: "l15-intro",
        type: "instruction",
        title: "The Final Surah of the Quran 📖",
        content: `**Surah An-Nas (الناس)** is the last surah of the Quran!

Together with Al-Falaq, these are the Mu'awwidhatayn (Two Protectors).

**The difference:**
- Al-Falaq: Protection from EXTERNAL evils (darkness, magic, envy)
- An-Nas: Protection from INTERNAL evil (Satan's whispers)

**Why An-Nas comes last:**
The greatest battle is internal. Even after protecting from all external harms, we still face the whispers in our own hearts.

**The beautiful repetition:**
The word "الناس" (An-Nas - The People/Mankind) appears 5 times in 6 verses! This repetition makes it easy to memorize.

Let's complete the Mu'awwidhatayn!`
      },
      {
        id: "l15-verses1-3",
        type: "explanation",
        title: "Verses 1-3: Three Names of Allah",
        arabicContent: "قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ\nمَلِكِ ٱلنَّاسِ\nإِلَٰهِ ٱلنَّاسِ",
        content: `**Three powerful names of Allah:**

**Verse 1:** قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ
"Qul a'oodhu bi-rabbin-naas"
"Say: I seek refuge in the **Lord** of mankind"
- رَبِّ = Lord (Sustainer, Nurturer)

**Verse 2:** مَلِكِ ٱلنَّاسِ
"Malikin-naas"
"**King** of mankind"
- مَلِكِ = King (Ruler, Sovereign)

**Verse 3:** إِلَٰهِ ٱلنَّاسِ
"Ilaahin-naas"
"**God** of mankind"
- إِلَٰهِ = God (the one worshipped)

**The progression:**
1. Rabb - He nurtures and sustains us
2. Malik - He rules over us
3. Ilah - He alone deserves our worship

We seek protection in the One who is our Lord, King, AND God!`
      },
      {
        id: "l15-verses4-6",
        type: "explanation",
        title: "Verses 4-6: The Whisperer",
        arabicContent: "مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ\nٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ\nمِنَ ٱلْجِنَّةِ وَٱلنَّاسِ",
        content: `**The enemy identified:**

**Verse 4:** مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ
"Min sharril-waswaasil-khannaas"
"From the evil of the retreating whisperer"
- الوَسْوَاس = the one who whispers (repeatedly)
- الخَنَّاس = the one who retreats/hides

**Verse 5:** ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ
"Alladhee yuwaswisu fee sudoorin-naas"
"Who whispers in the breasts of mankind"
- صُدُور = chests/hearts
- This is where evil thoughts enter!

**Verse 6:** مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ
"Minal-jinnati wan-naas"
"From among jinn and mankind"
- Whisperers can be devils (jinn)
- Or evil people (humans)!

**Al-Khannas - The Retreater:**
When you remember Allah, Satan retreats. When you forget, he returns to whisper. This is why dhikr (remembrance) is so powerful!`
      },
      {
        id: "l15-listen",
        type: "audio",
        title: "Listen & Memorize",
        content: `**The complete surah:**

قُلْ أَعُوذُ بِرَبِّ ٱلنَّاسِ ﴿١﴾
مَلِكِ ٱلنَّاسِ ﴿٢﴾
إِلَٰهِ ٱلنَّاسِ ﴿٣﴾
مِن شَرِّ ٱلْوَسْوَاسِ ٱلْخَنَّاسِ ﴿٤﴾
ٱلَّذِى يُوَسْوِسُ فِى صُدُورِ ٱلنَّاسِ ﴿٥﴾
مِنَ ٱلْجِنَّةِ وَٱلنَّاسِ ﴿٦﴾

**Memory help:** "An-Nas" appears at the end of verses 1, 2, 3, 5, and 6!

**10-3 method - let's complete the pair!**`,
        audioSegment: {
          surah: 114,
          ayahStart: 1,
          ayahEnd: 6,
          repeat: 5
        }
      },
      {
        id: "l15-quiz",
        type: "exercise",
        title: "Understanding Check",
        content: "Test your knowledge!",
        exercise: {
          type: "comprehension",
          question: "What does 'Al-Khannas' (الخَنَّاس) mean?",
          options: [
            "The whisperer",
            "The retreater (one who hides when Allah is remembered)",
            "The envier",
            "The creator of evil"
          ],
          correctAnswer: 1,
          explanation: "Correct! Al-Khannas means 'the retreater' - Satan retreats and hides when you remember Allah. That's why saying 'A'oodhu billah' (I seek refuge in Allah) makes him flee!"
        }
      },
      {
        id: "l15-review",
        type: "instruction",
        title: "Lesson 15 Complete! 🌟",
        content: `**Subhanallah! You've memorized the FINAL SURAH of the Quran!**

**Key teachings:**
- Allah is our Rabb (Lord), Malik (King), and Ilah (God)
- Satan whispers in our hearts
- When we remember Allah, Satan retreats
- Whisperers can be jinn OR humans!

**Daily practice:**
- Recite both Al-Falaq and An-Nas:
  - 3 times after Fajr
  - 3 times after Maghrib
  - Before sleep (blow on hands, wipe body)

**The Mu'awwidhatayn are now yours!**

**You now have 4 surahs memorized:**
1. Al-Fatiha (7 verses)
2. Al-Ikhlas (4 verses)
3. Al-Falaq (5 verses)
4. An-Nas (6 verses)

**Total: 22 verses of Quran!** 📖🎉`
      }
    ],
    memorizationTechniques: [
      "An-Nas appears 5 times - use this rhythm!",
      "Pair with Al-Falaq - recite both together always",
      "Remember: External evils (Falaq) + Internal evils (Nas) = Complete protection"
    ],
    keyVocabulary: [
      { arabic: "النَّاسِ", transliteration: "An-Nas", meaning: "The people/mankind" },
      { arabic: "مَلِكِ", transliteration: "Malik", meaning: "King" },
      { arabic: "إِلَٰهِ", transliteration: "Ilah", meaning: "God" },
      { arabic: "الْوَسْوَاسِ", transliteration: "Al-Waswas", meaning: "The whisperer" },
      { arabic: "الْخَنَّاسِ", transliteration: "Al-Khannas", meaning: "The retreater" }
    ]
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * EXPORTS AND UTILITY FUNCTIONS
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Combine all lessons
export const ALL_BEGINNER_LESSONS: Lesson[] = [
  ...UNIT_1_LESSONS,
  ...UNIT_2_LESSONS,
  ...UNIT_3_LESSONS,
  ...UNIT_4_LESSONS
];

/**
 * Get lesson by ID
 */
export function getLessonById(id: string): Lesson | undefined {
  return ALL_BEGINNER_LESSONS.find(l => l.id === id);
}

/**
 * Get lessons by path
 */
export function getLessonsByPath(path: "beginner" | "intermediate" | "advanced"): Lesson[] {
  return ALL_BEGINNER_LESSONS.filter(l => l.path === path);
}

/**
 * Get lessons by unit
 */
export function getLessonsByUnit(unit: number): Lesson[] {
  return ALL_BEGINNER_LESSONS.filter(l => l.unit === unit);
}

/**
 * Check if lesson is unlocked - FOR TESTING, ALL LESSONS ARE UNLOCKED
 */
export function isLessonUnlocked(lessonId: string, completedLessonIds: string[]): boolean {
  // For testing purposes, all lessons are unlocked
  return true;
  
  // Original logic (uncomment when ready for production):
  // const lesson = getLessonById(lessonId);
  // if (!lesson) return false;
  // if (!lesson.prerequisites || lesson.prerequisites.length === 0) return true;
  // return lesson.prerequisites.every(prereq => completedLessonIds.includes(prereq));
}

/**
 * Get all lessons for display
 */
export function getAllLessons(): Lesson[] {
  return ALL_BEGINNER_LESSONS;
}

/**
 * Get unit information
 */
export const UNITS = [
  { number: 1, title: "Arabic Foundations", lessons: 5, description: "Learn the Arabic alphabet from scratch" },
  { number: 2, title: "Reading Skills", lessons: 3, description: "Master vowels and reading" },
  { number: 3, title: "Your First Surah - Al-Fatiha", lessons: 4, description: "Memorize the Opening Chapter" },
  { number: 4, title: "Short Surahs", lessons: 3, description: "Build your memorization repertoire" }
];