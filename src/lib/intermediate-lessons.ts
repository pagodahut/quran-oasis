/**
 * Quran Oasis - Intermediate Lesson Content
 * For users who know Arabic letters and can read basic Quran
 * 
 * Focus areas:
 * - Common Quranic vocabulary
 * - Short surah memorization (Al-Ikhlas through An-Nas)
 * - Basic tajweed rules (nun sakinah, meem sakinah)
 */

import type { Lesson } from './lesson-content';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 6: COMMON QURANIC VOCABULARY (Lessons 20-22)
 * Build your understanding of frequently appearing words
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_6_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 20: Names of Allah - Essential Vocabulary
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-1",
    unit: 6,
    unitTitle: "Common Quranic Vocabulary",
    path: "intermediate",
    number: 20,
    title: "Names of Allah - Essential Vocabulary",
    description: "Learn the most frequently used Names of Allah in the Quran",
    surah: 59,
    ayahStart: 22,
    ayahEnd: 24,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int1-intro",
        type: "instruction",
        title: "Understanding Allah's Names",
        content: `Welcome to Intermediate studies! Since you can already read Arabic, we'll focus on deeper understanding.

**The Prophet ﷺ said:** "Allah has ninety-nine names. Whoever memorizes them will enter Paradise." (Bukhari)

But memorizing isn't just reciting - it means understanding and living by them.

In this lesson, you'll learn the most frequently appearing Names in the Quran:
- الله (Allah) - appears 2,699 times
- الرحمن (Ar-Rahman) - appears 57 times
- الرحيم (Ar-Raheem) - appears 114 times
- الرب (Ar-Rabb) - appears 900+ times
- الملك (Al-Malik) - King, Owner

Let's explore each one deeply...`
      },
      {
        id: "int1-allah",
        type: "explanation",
        title: "الله - Allah (The God)",
        arabicContent: "لَا إِلَٰهَ إِلَّا اللَّهُ",
        content: `**الله (Allah)** - The proper name of God

**Linguistic root:** From إله (ilah) - a god
**Meaning:** THE God - the one true deity worthy of worship

**Why it's special:**
- This name encompasses ALL other names
- It can only refer to the One True God
- No plural form exists (unlike "god/gods" in English)

**Pattern in Quran:**
Often paired with other names:
- "اللَّهُ الرَّحْمَٰنُ الرَّحِيمُ" (Allah, the Most Gracious, Most Merciful)
- "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ" (Allah, there is no god except Him)

**Quran reference:** "He is Allah, other than whom there is no deity" (59:22)

**Reflection:** When you say "Allah," you're calling the One who has every perfect attribute.`
      },
      {
        id: "int1-rahman-raheem",
        type: "explanation",
        title: "الرحمن الرحيم - The Most Merciful",
        arabicContent: "الرَّحْمَٰنِ الرَّحِيمِ",
        content: `**Both derive from رَحِمَ (rahima)** - to show mercy

**الرَّحْمَٰنُ (Ar-Rahman) - The Most Gracious**
- Form: فَعْلَان (fa'lan) - indicates intensity and vastness
- Meaning: Overwhelming, all-encompassing mercy
- Scope: For ALL creation - believers and disbelievers

**الرَّحِيمُ (Ar-Raheem) - The Most Merciful**
- Form: فَعِيل (fa'eel) - indicates continuity
- Meaning: Constant, ongoing mercy
- Scope: Especially for believers in the Hereafter

**Together they teach:**
Allah's mercy is both vast (covering everyone) and specific (especially for believers).

**Hadith:** "Allah divided mercy into 100 parts. He kept 99 parts for the Day of Resurrection, and sent down 1 part to earth. From that 1 part comes all compassion creatures show one another." (Bukhari)

**Exercise:** In the next surah you read, count how many times you see رحم-root words!`
      },
      {
        id: "int1-rabb",
        type: "explanation",
        title: "الرَّبُّ - The Lord, Sustainer, Master",
        arabicContent: "رَبِّ الْعَالَمِينَ",
        content: `**الرَّبُّ (Ar-Rabb)** - Often translated as "Lord"

But it means SO much more:
1. **Creator** - who brought you into existence
2. **Owner** - who has full right over you
3. **Sustainer** - who provides everything you need
4. **Nurturer** - who raises and develops you
5. **Master** - who guides your affairs
6. **Reformer** - who corrects and improves

**Why prophets loved this name:**
- Ibrahim: "رَبَّنَا تَقَبَّلْ مِنَّا" (Our Lord, accept from us)
- Musa: "رَبِّ اشْرَحْ لِي صَدْرِي" (My Lord, expand for me my chest)
- Ayyub: "رَبِّ إِنِّي مَسَّنِيَ الضُّرُّ" (My Lord, adversity has touched me)

**Du'a using Rabb:**
When you call upon "Rabbi" (my Lord), you're acknowledging:
- He created you
- He provides for you
- He can solve your problems
- He has authority over everything in your life

**Practice:** Replace "God" in your thoughts with "my Rabb" - feel the relationship!`
      },
      {
        id: "int1-malik",
        type: "explanation",
        title: "الْمَلِكُ - The King, Owner",
        arabicContent: "مَالِكِ يَوْمِ الدِّينِ",
        content: `**Two related names from the root م-ل-ك (m-l-k):**

**الْمَلِكُ (Al-Malik) - The King**
- Absolute sovereign authority
- Rules without opposition
- His command is always executed

**مَالِكُ (Maalik) - The Owner**
- Owns everything completely
- Has full right to dispose as He wills
- Different from worldly "ownership" - total possession

**In Al-Fatiha:** 
"مَالِكِ يَوْمِ الدِّينِ" (Owner of the Day of Judgment)

**Why Owner, not King, here?**
On that Day, Allah is not just the KING (authority) but the OWNER (sole possessor).
No one can claim ownership of anything - not their deeds, not their bodies, nothing!

**Related words you'll see:**
- مُلْكُ (mulk) - kingdom, dominion
- مَمْلُوكُ (mamlook) - owned/slave
- مَلَكُوت (malakoot) - dominion (heavenly realm)

**Reflection:** Everything you "own" is actually borrowed from Al-Malik.`
      },
      {
        id: "int1-practice",
        type: "exercise",
        title: "Vocabulary Quiz",
        content: "Let's test your understanding of these essential Names!",
        exercise: {
          type: "word_match",
          question: "Which name indicates Allah's all-encompassing mercy for ALL creation?",
          options: ["الرَّحِيمُ (Ar-Raheem)", "الرَّحْمَٰنُ (Ar-Rahman)", "الرَّبُّ (Ar-Rabb)", "الْمَلِكُ (Al-Malik)"],
          correctAnswer: 1,
          explanation: "Ar-Rahman (الرَّحْمَٰنُ) indicates vast, overwhelming mercy for all creation, while Ar-Raheem is the ongoing mercy especially for believers."
        }
      },
      {
        id: "int1-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Excellent! You've learned the most frequent Names of Allah in the Quran.**

**Summary:**
- **الله** - The one true God (2,699 occurrences)
- **الرَّحْمَٰنُ** - All-encompassing mercy (57 times)
- **الرَّحِيمُ** - Ongoing mercy for believers (114 times)
- **الرَّبُّ** - Lord, Sustainer, Master (900+ times)
- **الْمَلِكُ** - King, Owner

**Action items:**
1. When reading Quran, pause when you see these names
2. Reflect on their meaning in the context of the verse
3. Use these names in your du'a appropriately

**Coming up:** Common action words (verbs) in the Quran!`
      }
    ],
    memorizationTechniques: [
      "Associate each name with its root meaning",
      "Notice these names in your daily prayers (especially Al-Fatiha)",
      "Make du'a using the appropriate name for your need"
    ],
    keyVocabulary: [
      { arabic: "الله", transliteration: "Allah", meaning: "The one true God" },
      { arabic: "الرَّحْمَٰنُ", transliteration: "Ar-Rahman", meaning: "The Most Gracious" },
      { arabic: "الرَّحِيمُ", transliteration: "Ar-Raheem", meaning: "The Most Merciful" },
      { arabic: "الرَّبُّ", transliteration: "Ar-Rabb", meaning: "The Lord, Sustainer" },
      { arabic: "الْمَلِكُ", transliteration: "Al-Malik", meaning: "The King" },
      { arabic: "مَالِكُ", transliteration: "Maalik", meaning: "Owner" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 21: Common Quranic Verbs
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-2",
    unit: 6,
    unitTitle: "Common Quranic Vocabulary",
    path: "intermediate",
    number: 21,
    title: "Common Quranic Verbs",
    description: "Master the most frequently used verbs in the Quran",
    surah: 2,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 30,
    xpReward: 100,
    steps: [
      {
        id: "int2-intro",
        type: "instruction",
        title: "The Action Words of the Quran",
        content: `Verbs are the engines of meaning. Understanding common Quranic verbs will transform your comprehension!

**Top 10 verbs by frequency:**
1. قَالَ (qaala) - he said - 1,600+ times
2. كَانَ (kaana) - was/is - 1,350+ times
3. آمَنَ (aamana) - he believed - 800+ times
4. عَلِمَ (alima) - he knew - 750+ times
5. جَعَلَ (ja'ala) - he made - 340+ times
6. جَاءَ (jaa'a) - he came - 280+ times
7. عَمِلَ ('amila) - he did/worked - 275+ times
8. رَأَى (ra'aa) - he saw - 270+ times
9. أَرَادَ (araada) - he wanted - 140+ times
10. هَدَى (hadaa) - he guided - 130+ times

Let's explore the most important ones...`
      },
      {
        id: "int2-amana",
        type: "explanation",
        title: "آمَنَ - To Believe",
        arabicContent: "الَّذِينَ آمَنُوا",
        content: `**آمَنَ (aamana)** - to believe, to have faith

**Root:** أ-م-ن (a-m-n) - safety, security, trust

**Key insight:** 
Iman (إيمان) comes from the same root as Amaan (أمان - safety).
To believe is to find SAFETY and SECURITY in Allah.

**Common patterns you'll see:**
- آمَنَ (aamana) - he believed
- آمَنُوا (aamanoo) - they believed
- الَّذِينَ آمَنُوا (alladheena aamanoo) - those who believe
- يُؤْمِنُ (yu'minu) - he believes
- مُؤْمِن (mu'min) - believer
- إِيمَان (eemaan) - faith/belief

**Quran frequency:** 
"الَّذِينَ آمَنُوا" (those who believe) appears 240+ times!

**Reflection:** Whenever you see this phrase, Allah is addressing YOU directly.`
      },
      {
        id: "int2-alima",
        type: "explanation",
        title: "عَلِمَ - To Know",
        arabicContent: "وَاللَّهُ يَعْلَمُ",
        content: `**عَلِمَ ('alima)** - to know

**Root:** ع-ل-م ('a-l-m) - knowledge

**Related words:**
- عِلْم ('ilm) - knowledge
- عَالِم ('aalim) - scholar, one who knows
- عَلِيم ('aleem) - All-Knowing (Name of Allah)
- عَالَم ('aalam) - world (place of things known)
- تَعَلَّمَ (ta'allama) - to learn
- عَلَّمَ ('allama) - to teach

**Key patterns:**
- عَلِمَ (alima) - he knew
- يَعْلَمُ (ya'lamu) - he knows
- اعْلَمْ (i'lam) - Know! (command)
- يَعْلَمُونَ (ya'lamoon) - they know
- لَا يَعْلَمُونَ (laa ya'lamoon) - they don't know

**In Quran:**
"وَاللَّهُ يَعْلَمُ وَأَنتُمْ لَا تَعْلَمُونَ" (2:216)
"Allah knows and you do not know"

**Reflection:** Every time you see عَلِمَ, remember: true knowledge leads to action.`
      },
      {
        id: "int2-amila",
        type: "explanation",
        title: "عَمِلَ - To Do/Work",
        arabicContent: "وَعَمِلُوا الصَّالِحَاتِ",
        content: `**عَمِلَ ('amila)** - to do, to work, to act

**Root:** ع-م-ل ('a-m-l) - action, deed

**Related words:**
- عَمَل ('amal) - deed, action
- عَامِل ('aamil) - worker, doer
- أَعْمَال (a'maal) - deeds (plural)

**The most important phrase:**
**"الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ"**
"Those who believe AND do righteous deeds"

This phrase appears 50+ times! It shows:
- Faith and action are INSEPARABLE
- Belief without action is incomplete
- Action without faith is directionless

**Pattern:**
- عَمِلَ ('amila) - he did
- يَعْمَلُ (ya'malu) - he does
- اعْمَلُوا (i'maloo) - Do! (command)
- عَمِلُوا ('amiloo) - they did
- يَعْمَلُونَ (ya'maloon) - they do

**Reflection:** Your 'amal (actions) are being recorded right now!`
      },
      {
        id: "int2-hadaa",
        type: "explanation",
        title: "هَدَى - To Guide",
        arabicContent: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        content: `**هَدَى (hadaa)** - to guide

**Root:** ه-د-ي (h-d-y) - guidance

**Related words:**
- هُدًى (hudan) - guidance
- هَادِي (haadi) - guide
- مَهْدِي (mahdi) - guided one
- هِدَايَة (hidaaya) - guidance

**Most famous use:**
"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ" (Al-Fatiha, 1:6)
"Guide us to the straight path"

**Key insight:** 
We ask for guidance at least 17 times daily (in the 5 prayers).
This shows: Guidance is not a one-time event - we need it constantly!

**Patterns:**
- هَدَى (hadaa) - he guided
- يَهْدِي (yahdi) - he guides
- اهْدِ (ihdi) - Guide! (command)
- اهْتَدَى (ihtadaa) - he was guided
- مُهْتَدٍ (muhtadi) - rightly guided

**Quran:** "إِنَّكَ لَا تَهْدِي مَنْ أَحْبَبْتَ" (28:56)
"You cannot guide whom you love" - guidance is from Allah alone!`
      },
      {
        id: "int2-practice",
        type: "exercise",
        title: "Verb Recognition",
        content: "Can you identify the verbs?",
        exercise: {
          type: "word_match",
          question: "In 'الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ', what do the two verbs mean?",
          options: [
            "They knew and they learned",
            "They believed and they did (righteous deeds)",
            "They came and they went",
            "They said and they heard"
          ],
          correctAnswer: 1,
          explanation: "آمَنُوا = they believed (from آمَنَ) and عَمِلُوا = they did/worked (from عَمِلَ). This phrase 'those who believe and do righteous deeds' appears 50+ times in the Quran!"
        }
      },
      {
        id: "int2-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Fantastic! You now know the most common Quranic verbs.**

**Verbs learned:**
- **آمَنَ** - to believe (800+ times)
- **عَلِمَ** - to know (750+ times)
- **عَمِلَ** - to do/work (275+ times)
- **هَدَى** - to guide (130+ times)

**Key phrase memorized:**
"الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ"
"Those who believe and do righteous deeds"

**Study tip:** 
When reading Quran, try to identify:
1. WHO is doing the action (subject)
2. WHAT action is being done (verb)
3. To WHOM/WHAT (object)

**Coming up:** Particles and connecting words!`
      }
    ],
    memorizationTechniques: [
      "Learn verbs with their common patterns (past, present, command)",
      "Notice how 'believe' and 'do good' almost always come together",
      "Connect each verb to its root meaning"
    ],
    keyVocabulary: [
      { arabic: "آمَنَ", transliteration: "Aamana", meaning: "He believed" },
      { arabic: "عَلِمَ", transliteration: "'Alima", meaning: "He knew" },
      { arabic: "عَمِلَ", transliteration: "'Amila", meaning: "He did/worked" },
      { arabic: "هَدَى", transliteration: "Hadaa", meaning: "He guided" },
      { arabic: "الصَّالِحَاتِ", transliteration: "As-Salihaat", meaning: "Righteous deeds" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 22: Particles and Connecting Words
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-3",
    unit: 6,
    unitTitle: "Common Quranic Vocabulary",
    path: "intermediate",
    number: 22,
    title: "Particles and Connecting Words",
    description: "Learn the small words that connect Quranic meanings",
    surah: 2,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int3-intro",
        type: "instruction",
        title: "The Glue of Arabic",
        content: `Small words, BIG impact!

Particles are tiny words that:
- Connect sentences
- Show relationships
- Change meanings dramatically

**Why they matter:**
The difference between "Allah guides" and "Allah WILL guide" or "MAY Allah guide" comes from a single particle!

**The essentials we'll cover:**
- إِنَّ (inna) - Indeed/Verily
- لَا (laa) - No/Not
- مَا (maa) - Not/What
- مَنْ (man) - Who/Whoever
- الَّذِي (allathee) - Who/Which (that)
- وَ (wa) - And
- فَ (fa) - Then/So
- ثُمَّ (thumma) - Then (after some time)

Let's decode them!`
      },
      {
        id: "int3-inna",
        type: "explanation",
        title: "إِنَّ - Indeed, Verily",
        arabicContent: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ",
        content: `**إِنَّ (inna)** - Indeed, verily, truly

**Function:** Emphasizes what follows. When Allah says "إِنَّ", pay extra attention!

**Grammar note:** إِنَّ changes the case of what follows (makes it accusative/منصوب).
That's why we say "إِنَّ اللَّهَ" (Allaha, not Allah).

**Common patterns:**
- إِنَّ اللَّهَ... (Indeed, Allah...)
- إِنَّا (Indeed, We...) - Majestic "We"
- إِنَّهُ (Indeed, He...)
- إِنَّكَ (Indeed, you...)

**Examples in Quran:**
- "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ" - Indeed, Allah is Forgiving, Merciful
- "إِنَّا أَنزَلْنَاهُ فِي لَيْلَةِ الْقَدْرِ" - Indeed, We sent it down on the Night of Power

**Tip:** When you see إِنَّ, mentally add "FOR CERTAIN" to understand the emphasis.`
      },
      {
        id: "int3-laa-maa",
        type: "explanation",
        title: "لَا and مَا - Negation",
        arabicContent: "لَا إِلَٰهَ إِلَّا اللَّهُ",
        content: `**Two ways to say "No/Not":**

**لَا (laa)** - No, not
- Used with verbs (present tense): لَا يَعْلَمُونَ (they don't know)
- Used in absolute negation: لَا إِلَٰهَ (there is no god)
- Used for prohibition: لَا تَقْرَبُوا (don't approach)

**مَا (maa)** - Not, did not
- Used with past tense verbs: مَا قَتَلُوهُ (they didn't kill him)
- Used to negate nouns: مَا هَٰذَا بَشَرًا (this is not a human)

**The Shahada uses both:**
"لَا إِلَٰهَ إِلَّا اللَّهُ"
- لَا = there is no
- إِلَٰهَ = god
- إِلَّا = except
- اللَّهُ = Allah

**Other uses of مَا:**
- As a question word: مَا هَٰذَا؟ (What is this?)
- As a relative pronoun: مَا أَنزَلْنَا (what We revealed)

**Recognition tip:** 
- لَا before a verb = "not doing"
- مَا before a past verb = "did not do"`
      },
      {
        id: "int3-man-alladhee",
        type: "explanation",
        title: "مَنْ and الَّذِي - Who/Which",
        arabicContent: "الَّذِينَ آمَنُوا",
        content: `**Relative pronouns - connecting ideas:**

**مَنْ (man)** - Who, whoever
- For people (unknown/general): مَنْ يُؤْمِنُ (whoever believes)
- In questions: مَنْ هَٰذَا؟ (Who is this?)
- Conditional: مَنْ يَعْمَلْ سُوءًا يُجْزَ بِهِ (whoever does evil will be recompensed for it)

**الَّذِي (alladhee)** - Who, which, that
- For specific known people/things
- Changes for gender and number:
  - الَّذِي (male singular) - who/which
  - الَّتِي (female singular) - who/which
  - الَّذِينَ (male plural) - those who
  - اللَّاتِي/اللَّائِي (female plural) - those (women) who

**Most common:** "الَّذِينَ آمَنُوا" (those who believe) - 240+ times!

**Comparison:**
- مَنْ يُؤْمِنُ = Whoever believes (general, conditional)
- الَّذِينَ آمَنُوا = Those who believe (specific, definite group)

**Example:**
"الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ"
"Those who believe and do righteous deeds"
The الَّذِينَ refers to a specific category of people.`
      },
      {
        id: "int3-connectors",
        type: "explanation",
        title: "وَ, فَ, ثُمَّ - Connecting Words",
        arabicContent: "وَاتَّقُوا يَوْمًا تُرْجَعُونَ فِيهِ إِلَى اللَّهِ ثُمَّ تُوَفَّىٰ كُلُّ نَفْسٍ مَّا كَسَبَتْ",
        content: `**Three connectors with different nuances:**

**وَ (wa)** - And
- The most common word in Quran!
- Simple connection: آمَنُوا وَعَمِلُوا (they believed AND did)
- Can also mean "while" or indicate a state

**فَ (fa)** - Then, so, and then (immediate)
- Shows quick sequence or result
- آمَنَ فَنَجَّيْنَاهُ (he believed, SO We saved him)
- Cause and effect: Belief → Salvation (immediate connection)

**ثُمَّ (thumma)** - Then (after some time)
- Shows sequence with a gap
- خَلَقَكُم ثُمَّ يَتَوَفَّاكُمْ (He created you, THEN (after a lifetime) causes you to die)
- Deliberate pause between events

**Why it matters:**
- فَ = immediate consequence
- ثُمَّ = consequence after time/reflection

**Example comparison:**
- "قَالَ فَخَرَجَ" - He said, THEN (immediately) left
- "قَالَ ثُمَّ خَرَجَ" - He said, THEN (after some time) left

**In your reading:** Pay attention to which connector is used - it changes the rhythm of events!`
      },
      {
        id: "int3-practice",
        type: "exercise",
        title: "Particle Recognition",
        content: "Let's test your understanding of particles!",
        exercise: {
          type: "word_match",
          question: "In 'إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ', what does إِنَّ do?",
          options: [
            "Negates the sentence (makes it 'Allah is NOT...')",
            "Emphasizes - 'Indeed/Truly' Allah is...",
            "Questions - 'Is Allah...?'",
            "Conditions - 'If Allah is...'"
          ],
          correctAnswer: 1,
          explanation: "إِنَّ emphasizes what follows, adding certainty. 'Indeed, Allah is Forgiving, Merciful' - this is a definite, emphasized statement!"
        }
      },
      {
        id: "int3-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Excellent! You've learned the essential Quranic particles.**

**Summary:**
- **إِنَّ** - Indeed/Verily (emphasis)
- **لَا** - No/Not (present negation/prohibition)
- **مَا** - Not/What (past negation/question)
- **مَنْ** - Who/Whoever (general/conditional)
- **الَّذِي** - Who/Which (specific)
- **وَ** - And (simple connection)
- **فَ** - So/Then (immediate sequence)
- **ثُمَّ** - Then (delayed sequence)

**Practice challenge:**
Read Surah Al-Baqarah, verses 1-5, and identify:
- All the particles
- What each one is doing

**Coming up in Unit 7:** Basic Tajweed rules for beautiful recitation!`
      }
    ],
    memorizationTechniques: [
      "Particles are tiny but transform meaning - always pause to consider them",
      "فَ vs ثُمَّ: immediate vs delayed consequence",
      "إِنَّ signals 'PAY ATTENTION' - something important follows"
    ],
    keyVocabulary: [
      { arabic: "إِنَّ", transliteration: "Inna", meaning: "Indeed, verily" },
      { arabic: "لَا", transliteration: "Laa", meaning: "No, not" },
      { arabic: "مَا", transliteration: "Maa", meaning: "Not, what" },
      { arabic: "مَنْ", transliteration: "Man", meaning: "Who, whoever" },
      { arabic: "الَّذِي", transliteration: "Alladhee", meaning: "Who, which, that" },
      { arabic: "وَ", transliteration: "Wa", meaning: "And" },
      { arabic: "فَ", transliteration: "Fa", meaning: "Then, so (immediate)" },
      { arabic: "ثُمَّ", transliteration: "Thumma", meaning: "Then (delayed)" }
    ]
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 7: BASIC TAJWEED RULES (Lessons 23-25)
 * Learn the essential rules for beautiful recitation
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_7_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 23: Noon Sakinah & Tanween Rules
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-4",
    unit: 7,
    unitTitle: "Basic Tajweed Rules",
    path: "intermediate",
    number: 23,
    title: "Noon Sakinah & Tanween Rules",
    description: "Master the 4 rules for Noon Sakinah (نْ) and Tanween",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 35,
    xpReward: 125,
    steps: [
      {
        id: "int4-intro",
        type: "instruction",
        title: "What is Tajweed?",
        content: `**Tajweed (تَجْوِيد)** comes from "جَوَّدَ" - to make better/beautiful.

It's the science of reciting Quran correctly, giving every letter its rights.

**Why it matters:**
The Prophet ﷺ said: "Beautify the Quran with your voices." (Abu Dawud)

Incorrect recitation can even change meanings!

**In this lesson:**
We'll focus on **Noon Sakinah (نْ)** and **Tanween (ـٌ ـً ـٍ)** rules.

**What is Noon Sakinah?**
- A ن with sukoon (no vowel): نْ
- Example: مِنْ, عَنْ, أَنْ

**What is Tanween?**
- The doubled vowel marks that add 'n' sound: ـٌ ـً ـٍ
- Examples: كِتَابٌ (kitaabun), كِتَابًا (kitaaban), كِتَابٍ (kitaabin)

**There are 4 rules depending on what letter comes next!**`
      },
      {
        id: "int4-izhar",
        type: "explanation",
        title: "Rule 1: Izhar (إِظْهَار) - Clear Pronunciation",
        arabicContent: "مِنْ خَيْرٍ",
        content: `**Izhar (إِظْهَار)** means to make clear/apparent.

**When:** Noon Sakinah or Tanween is followed by one of 6 throat letters:
**ء ه ع ح غ خ**
(Hamza, Ha, 'Ayn, Haa, Ghayn, Kha)

**How:** Pronounce the noon CLEARLY without any blending.

**Memory trick:** These 6 letters come from the throat (حُرُوفُ الحَلْق)

**Examples:**
- مِنْ خَيْرٍ (min khayrin) - clear ن before خ
- مَنْ آمَنَ (man aamana) - clear ن before ء
- عَلِيمٌ حَكِيمٌ ('aleemun hakeemun) - clear ن (tanween) before ح
- كِتَابًا أَنزَلَهُ (kitaaban anzalahu) - clear ن (tanween) before أ

**Practice:** Say "مِنْ هَادٍ" - make sure you clearly pronounce the noon before the Ha!

**Recognition tip:** If you see نْ or tanween followed by a throat letter, pronounce clearly!`
      },
      {
        id: "int4-idgham",
        type: "explanation",
        title: "Rule 2: Idgham (إِدْغَام) - Merging",
        arabicContent: "مَن يَقُولُ",
        content: `**Idgham (إِدْغَام)** means merging/assimilation.

**When:** Noon Sakinah or Tanween is followed by:
**ي ر م ل و ن**
(Ya, Ra, Meem, Lam, Waw, Noon)

**Memory trick:** These letters spell **يَرْمَلُونَ** (YARMALOON)

**Two types:**

**A) Idgham with Ghunnah (merging WITH nasal sound):**
When followed by: **ي ن م و** (Ya, Noon, Meem, Waw)
- The noon merges AND there's a humming/nasal sound (ghunnah)
- Hold the ghunnah for 2 counts
- Example: "مَن يَقُولُ" → pronounced "may-yaqool" with ghunnah

**B) Idgham without Ghunnah (merging WITHOUT nasal sound):**
When followed by: **ل ر** (Lam, Ra)
- The noon merges completely, no nasal sound
- Example: "مِن رَّبِّهِمْ" → pronounced "mir-rabbihim"

**Key point:** Idgham only happens when the noon/tanween and the next letter are in DIFFERENT words!

**If same word:** No idgham! Like "دُنْيَا" - say the noon clearly.`
      },
      {
        id: "int4-iqlab",
        type: "explanation",
        title: "Rule 3: Iqlab (إِقْلَاب) - Conversion",
        arabicContent: "مِنْ بَعْدِ",
        content: `**Iqlab (إِقْلَاب)** means to convert/flip.

**When:** Noon Sakinah or Tanween is followed by **ب (Ba)** only.

**How:** Convert the noon sound into a **meem** sound with ghunnah!

**Why?** Try saying "minba" quickly - your lips naturally want to close for the Ba, making it easier to say "mimba"!

**Examples:**
- مِنْ بَعْدِ → pronounced "mim ba'di" (with ghunnah)
- أَنْبِئْهُمْ → pronounced "ambi'hum" (with ghunnah)
- سَمِيعٌ بَصِيرٌ → "samee'um baseer" (with ghunnah)

**Recognition tip:** Whenever you see نْ before ب, say "m" with ghunnah instead!

**In the Mushaf:** Sometimes you'll see a small meem (ـ مـ) above the noon to remind you.

**Practice:** "مِنْ بَيْنِ يَدَيْهِ" - say "mim bayni yadayhi" with a humming meem.`
      },
      {
        id: "int4-ikhfa",
        type: "explanation",
        title: "Rule 4: Ikhfa (إِخْفَاء) - Hiding",
        arabicContent: "مَن تَابَ",
        content: `**Ikhfa (إِخْفَاء)** means to hide/conceal.

**When:** Noon Sakinah or Tanween is followed by any of these 15 letters:
**ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك**

**How:** The noon sound is "hidden" - not fully pronounced, not fully merged. It's between Izhar and Idgham!

**Characteristics:**
1. The noon sound is softened
2. There's a ghunnah (nasal humming)
3. Hold for approximately 2 counts
4. Prepare your tongue for the next letter

**Examples:**
- مَن تَابَ → soft noon with ghunnah before Ta
- مِنْ ذَهَبٍ → soft noon before Dhal
- أَنْزَلَ → soft noon before Za
- عَلِيمٌ قَدِيرٌ → soft noon (tanween) before Qaf

**The most common rule!** Since there are 15 letters, you'll encounter Ikhfa frequently.

**Practice tip:** Think of it as saying the noon "halfway" while your tongue moves toward the next letter's position.`
      },
      {
        id: "int4-summary-practice",
        type: "practice",
        title: "Putting It All Together",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        content: `**Let's apply these rules to Al-Fatiha!**

**Verse 2:** "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
- الْعَالَمِينَ ends with tanween (يـنَ = ين + hidden noon)
- Next verse starts with الرَّحْمَٰنِ
- But wait - there's a pause (waqf) here, so no rule applies!

**Verse 6:** "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ"
- أَنْعَمْتَ has noon sakinah (نْ) followed by 'Ayn (ع)
- Rule: **Izhar!** (ع is a throat letter)
- Pronounce: "an-'amta" with clear noon

**Verse 7:** "غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ"
- No noon sakinah/tanween issues here

**Practice all 4 rules:**
1. **Izhar:** مِنْ عِلْمٍ (min 'ilmin) - clear noon
2. **Idgham:** مِن يَّشَاءُ (miy-yashaa'u) - merged with ghunnah
3. **Iqlab:** مِنْ بَعْدُ (mim ba'du) - noon becomes meem
4. **Ikhfa:** مَنْ ذَا (man thaa) - hidden noon with ghunnah`
      },
      {
        id: "int4-quiz",
        type: "exercise",
        title: "Tajweed Rule Quiz",
        content: "Identify the correct rule!",
        exercise: {
          type: "word_match",
          question: "In 'مِنْ بَعْدِ', what happens to the noon before Ba (ب)?",
          options: [
            "Izhar - pronounced clearly",
            "Idgham - merged with next letter",
            "Iqlab - converted to meem sound",
            "Ikhfa - hidden with ghunnah"
          ],
          correctAnswer: 2,
          explanation: "Iqlab! When noon sakinah meets Ba (ب), the noon converts to a meem sound with ghunnah. So مِنْ بَعْدِ is pronounced 'mim ba'di'."
        }
      },
      {
        id: "int4-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Excellent! You've learned the 4 rules of Noon Sakinah and Tanween!**

**Quick Reference:**

| Rule | When | Letters | Action |
|------|------|---------|--------|
| **Izhar** | Throat letters | ء ه ع ح غ خ | Clear noon |
| **Idgham** | YARMALOON | ي ر م ل و ن | Merge (with/without ghunnah) |
| **Iqlab** | Ba only | ب | Convert to meem |
| **Ikhfa** | All other 15 | ت ث ج د ذ... | Hidden with ghunnah |

**Memory aids:**
- **6** throat letters → Izhar (clear)
- **6** YARMALOON → Idgham (merge)
- **1** Ba → Iqlab (flip to meem)
- **15** remaining → Ikhfa (hide)

**Practice daily:** When reciting, pause at each noon sakinah/tanween and apply the correct rule!

**Coming up:** Meem Sakinah rules!`
      }
    ],
    memorizationTechniques: [
      "6 throat letters (Izhar), 6 YARMALOON (Idgham), 1 Ba (Iqlab), 15 others (Ikhfa)",
      "Practice with Al-Fatiha - identify every noon sakinah and tanween",
      "Listen to a Qari and notice how they apply these rules"
    ],
    keyVocabulary: [
      { arabic: "إِظْهَار", transliteration: "Izhar", meaning: "Clear pronunciation" },
      { arabic: "إِدْغَام", transliteration: "Idgham", meaning: "Merging" },
      { arabic: "إِقْلَاب", transliteration: "Iqlab", meaning: "Conversion to meem" },
      { arabic: "إِخْفَاء", transliteration: "Ikhfa", meaning: "Hiding" },
      { arabic: "غُنَّة", transliteration: "Ghunnah", meaning: "Nasal sound" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 24: Meem Sakinah Rules
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-5",
    unit: 7,
    unitTitle: "Basic Tajweed Rules",
    path: "intermediate",
    number: 24,
    title: "Meem Sakinah Rules",
    description: "Learn the 3 rules for Meem Sakinah (مْ)",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int5-intro",
        type: "instruction",
        title: "Meem Sakinah - Simpler Than Noon!",
        content: `Good news! Meem Sakinah only has **3 rules** (compared to Noon's 4).

**What is Meem Sakinah?**
A meem with sukoon (no vowel): مْ
Example: هُمْ, لَهُمْ, عَلَيْهِمْ

**The 3 rules:**
1. **Idgham Shafawi** - Merging (مْ + م)
2. **Ikhfa Shafawi** - Hiding (مْ + ب)
3. **Izhar Shafawi** - Clear (مْ + all other letters)

**"Shafawi" (شَفَوِي)** means "labial" - relating to the lips. 
Because meem is pronounced with the lips!

Let's learn each one...`
      },
      {
        id: "int5-idgham-shafawi",
        type: "explanation",
        title: "Rule 1: Idgham Shafawi (إِدْغَام شَفَوِي)",
        arabicContent: "لَهُم مَّا يَشَاءُونَ",
        content: `**Idgham Shafawi** - Merging of Meem into Meem

**When:** Meem Sakinah (مْ) is followed by another Meem (م)

**How:** Merge them into ONE meem with ghunnah (nasal sound), held for 2 counts.

**Why?** It's natural - when two meems meet, they blend together!

**Examples:**
- لَهُم مَّا → "lahum-maa" (one long meem with ghunnah)
- هُم مُّؤْمِنُونَ → "hum-mu'minoon" (merged meems)
- وَلَكُم مَّا كَسَبْتُم → "walakum-maa kasabtum"

**Visual cue:** In Quran text, you'll often see the second meem with a shaddah (مّ) to indicate the merging.

**Practice:** Say "لَهُم مَّغْفِرَةٌ" - feel how the two meems naturally blend into one sustained meem with humming.`
      },
      {
        id: "int5-ikhfa-shafawi",
        type: "explanation",
        title: "Rule 2: Ikhfa Shafawi (إِخْفَاء شَفَوِي)",
        arabicContent: "تَرْمِيهِم بِحِجَارَةٍ",
        content: `**Ikhfa Shafawi** - Hiding of Meem before Ba

**When:** Meem Sakinah (مْ) is followed by Ba (ب)

**How:** 
1. Close your lips lightly (not completely)
2. Produce a soft ghunnah (nasal humming)
3. Then release into the Ba

**Why?** Meem and Ba are both lip letters. They're "cousins" - so the meem hides!

**Examples:**
- تَرْمِيهِم بِحِجَارَةٍ → soft meem with ghunnah before Ba
- أَنفُسَهُمْ بِذَٰلِكَ → "anfusahum-bi" with ghunnah
- هُمْ بِرَبِّهِمْ → "hum-bi" with soft meem and ghunnah

**Compare to Iqlab:** 
Remember how Noon before Ba becomes Meem? This is similar but simpler - the meem just gets "hidden" with ghunnah.

**Practice:** Say "عَلَيْهِمْ بِلِسَانِهِمْ" - feel the soft meem blending into the Ba.`
      },
      {
        id: "int5-izhar-shafawi",
        type: "explanation",
        title: "Rule 3: Izhar Shafawi (إِظْهَار شَفَوِي)",
        arabicContent: "عَلَيْهِمْ غَيْرِ",
        content: `**Izhar Shafawi** - Clear pronunciation of Meem

**When:** Meem Sakinah (مْ) is followed by ANY letter EXCEPT مeem or Ba.

**How:** Pronounce the meem clearly with NO ghunnah, then move to the next letter.

**Examples:**
- عَلَيْهِمْ غَيْرِ → clear "him" then "ghayri"
- أَنعَمْتَ → clear meem, then Ta
- أَلَمْ تَرَ → clear meem, then Ta
- وَهُمْ فِيهَا → clear meem, then Fa
- لَهُمْ جَنَّاتٌ → clear meem, then Jeem

**The default rule:** 
Since Meem + Meem and Meem + Ba are special cases, everything else is Izhar (clear pronunciation).

**26 letters** trigger Izhar Shafawi (all except م and ب).

**Practice:** In Al-Fatiha: "عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"
Find the meem sakinah and pronounce it clearly before غ and و.`
      },
      {
        id: "int5-comparison",
        type: "explanation",
        title: "Quick Comparison: Meem vs Noon Rules",
        content: `**How Meem Sakinah rules relate to Noon Sakinah:**

| Meem Sakinah | Noon Sakinah |
|--------------|--------------|
| مْ + م = Idgham Shafawi | نْ + (ي ر م ل و ن) = Idgham |
| مْ + ب = Ikhfa Shafawi | نْ + ب = Iqlab |
| مْ + others = Izhar Shafawi | نْ + (15 letters) = Ikhfa |
| | نْ + throat = Izhar |

**Key differences:**
1. Meem only interacts specially with م and ب (both lip letters)
2. Noon interacts with many more letters
3. Meem Ikhfa only has ONE letter (ب), Noon Ikhfa has 15!

**Same concept:** Letters that share articulation points affect each other more.

**Memory tip:**
- Meem + Meem = brothers merge
- Meem + Ba = cousins hide
- Meem + anyone else = strangers stay clear`
      },
      {
        id: "int5-quiz",
        type: "exercise",
        title: "Meem Sakinah Quiz",
        content: "Let's test your understanding!",
        exercise: {
          type: "word_match",
          question: "In 'أَنفُسَهُمْ بِذَٰلِكَ', what happens to the meem before Ba?",
          options: [
            "Izhar Shafawi - pronounced clearly",
            "Idgham Shafawi - merged with ghunnah",
            "Ikhfa Shafawi - hidden with ghunnah",
            "The meem converts to noon"
          ],
          correctAnswer: 2,
          explanation: "Ikhfa Shafawi! When meem sakinah meets Ba, the meem is 'hidden' with a soft ghunnah. Both are lip letters, so they partially blend."
        }
      },
      {
        id: "int5-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Great work! You've mastered Meem Sakinah rules!**

**Summary:**

| Rule | When | Action |
|------|------|--------|
| **Idgham Shafawi** | مْ + م | Merge with ghunnah |
| **Ikhfa Shafawi** | مْ + ب | Hide with ghunnah |
| **Izhar Shafawi** | مْ + others | Clear pronunciation |

**Memory aid:**
- Meem meets Meem → **Merge** (brothers)
- Meem meets Ba → **Hide** (cousins)
- Meem meets others → **Clear** (strangers)

**Combined knowledge:**
You now know 7 tajweed rules:
- 4 for Noon Sakinah/Tanween
- 3 for Meem Sakinah

**Coming up:** Madd (elongation) rules!`
      }
    ],
    memorizationTechniques: [
      "Meem rules are simpler: only م and ب get special treatment",
      "Both special cases involve ghunnah (nasal humming)",
      "All other 26 letters = Izhar (clear pronunciation)"
    ],
    keyVocabulary: [
      { arabic: "إِدْغَام شَفَوِي", transliteration: "Idgham Shafawi", meaning: "Labial merging (meem+meem)" },
      { arabic: "إِخْفَاء شَفَوِي", transliteration: "Ikhfa Shafawi", meaning: "Labial hiding (meem+ba)" },
      { arabic: "إِظْهَار شَفَوِي", transliteration: "Izhar Shafawi", meaning: "Labial clarity (meem+others)" },
      { arabic: "شَفَوِي", transliteration: "Shafawi", meaning: "Labial (lip-related)" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 25: Introduction to Madd (Elongation)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-6",
    unit: 7,
    unitTitle: "Basic Tajweed Rules",
    path: "intermediate",
    number: 25,
    title: "Introduction to Madd (Elongation)",
    description: "Learn the essential elongation rules for beautiful recitation",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 30,
    xpReward: 125,
    steps: [
      {
        id: "int6-intro",
        type: "instruction",
        title: "What is Madd?",
        content: `**Madd (مَدّ)** means to stretch or elongate.

In Tajweed, it refers to stretching the sound of certain letters.

**The 3 Madd Letters:**
1. **ا (Alif)** - when preceded by Fatha: بَا (baa)
2. **و (Waw)** - when preceded by Damma: بُو (boo)
3. **ي (Ya)** - when preceded by Kasra: بِي (bee)

**Madd Counts:**
We measure elongation in "counts" (حَرَكَات):
- 2 counts = natural length (طَبِيعِي)
- 4 counts = medium length
- 6 counts = maximum length

**Why it matters:**
Elongation adds beauty and meaning. A well-placed madd can:
- Create emphasis
- Build suspense
- Mark endings
- Distinguish similar words`
      },
      {
        id: "int6-madd-tabee",
        type: "explanation",
        title: "Natural Madd (مَدّ طَبِيعِي)",
        arabicContent: "قَالَ",
        content: `**Natural Madd (مَدّ طَبِيعِي)** - The Foundation

**Duration:** 2 counts (2 حَرَكَات)

**When:** Any madd letter (ا, و, ي) not followed by hamza or sukoon.

**Examples:**
- قَالَ (qaala) - stretch the "aa" for 2 counts
- يَقُولُ (yaqoolu) - stretch the "oo" for 2 counts
- فِيهَا (feehaa) - stretch both "ee" and final "aa"

**How to count:**
One count ≈ the time to open or close your fingers once.
Two counts = open, close. That's natural madd!

**In Al-Fatiha:**
- نَسْتَعِينُ (nasta'eenu) - "ee" is 2 counts
- الصِّرَاطَ (as-siraata) - "aa" is 2 counts
- الضَّالِّينَ (ad-daalleen) - "aa" and "ee" are each 2 counts

**Important:** Natural madd is the BASE - all other madd types build on it!`
      },
      {
        id: "int6-madd-muttasil",
        type: "explanation",
        title: "Connected Madd (مَدّ مُتَّصِل)",
        arabicContent: "جَآءَ",
        content: `**Connected Madd (مَدّ مُتَّصِل)** - Madd + Hamza in SAME word

**Duration:** 4-5 counts (obligatory elongation)

**When:** Madd letter followed by hamza (ء) in the SAME word.

**Examples:**
- جَآءَ (jaa'a) - the alif before hamza is stretched 4-5 counts
- سُوءٌ (soo'un) - the waw before hamza is stretched
- سِيئَتْ (see'at) - the ya before hamza is stretched

**Why it's called "connected" (muttasil):**
The madd letter and hamza are CONNECTED in one word - they can't be separated.

**In Quran:**
- "إِذَا جَآءَ نَصْرُ اللَّهِ" (When the victory of Allah comes)
- Stretch جَآءَ for 4-5 counts

**Practical tip:**
Look for this symbol: آ (alif with hamza written as madda). It signals connected madd!`
      },
      {
        id: "int6-madd-munfasil",
        type: "explanation",
        title: "Separated Madd (مَدّ مُنْفَصِل)",
        arabicContent: "يَا أَيُّهَا",
        content: `**Separated Madd (مَدّ مُنْفَصِل)** - Madd + Hamza in DIFFERENT words

**Duration:** 2, 4, or 5 counts (depending on Qira'at)

**When:** Madd letter at the END of one word, hamza at the START of the next.

**Examples:**
- يَا أَيُّهَا (yaa ayyuhaa) - the alif of "ya" before the hamza of "ayyuhaa"
- فِي أَنفُسِكُمْ (fee anfusikum) - the ya before the hamza
- قُوا أَنفُسَكُمْ (qoo anfusakum) - the waw before the hamza

**Why it's called "separated" (munfasil):**
The madd letter and hamza are SEPARATED in different words - you could theoretically stop between them.

**Flexibility:** 
Different reciters use different lengths. Hafs 'an Asim typically uses 4-5 counts.

**Recognition tip:**
Whenever a word ends with ا, و, or ي (as vowels) and the next word starts with أ, إ, or آ, it's separated madd!`
      },
      {
        id: "int6-madd-lazim",
        type: "explanation",
        title: "Compulsory Madd (مَدّ لَازِم)",
        arabicContent: "الضَّالِّينَ",
        content: `**Compulsory Madd (مَدّ لَازِم)** - Maximum Elongation

**Duration:** 6 counts (mandatory!)

**When:** Madd letter followed by a sukoon or shaddah.

**Types:**

**1. Kalimi (in a word):**
- الضَّالِّينَ (ad-DAAAL-leen) - the "aa" before the doubled Lam
- Stretch for 6 full counts!

**2. Harfi (in letters at beginning of surahs):**
- الم (Alif-Lam-Meem) - each letter name contains madd lazim
- Stretch each for 6 counts

**Why so long?**
The sukoon or shaddah after the madd creates a "heaviness" that requires maximum stretch.

**In Al-Fatiha:**
The ONLY madd lazim is: وَلَا الضَّالِّينَ
The alif before the shaddah on Lam gets 6 counts!

**Practice:** Say "الضَّالِّينَ" and count slowly: "ad-DAAAAA-AAAAL-leen" (6 counts on the "aa")`
      },
      {
        id: "int6-practice",
        type: "practice",
        title: "Madd in Al-Fatiha",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        content: `**Let's identify all the madd in Al-Fatiha!**

**Verse 1: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ**
- الرَّحْمَٰنِ - "aa" (special alif) = 2 counts
- الرَّحِيمِ - "ee" = 2 counts

**Verse 2: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ**
- الْعَالَمِينَ - "aa" and "ee" = 2 counts each

**Verse 4: مَالِكِ يَوْمِ الدِّينِ**
- مَالِكِ - "aa" = 2 counts
- الدِّينِ - "ee" = 2 counts

**Verse 5: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ**
- إِيَّاكَ - "ee" = 2 counts (x2)
- نَسْتَعِينُ - "ee" = 2 counts

**Verse 6: اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ**
- الصِّرَاطَ - "aa" = 2 counts
- الْمُسْتَقِيمَ - "ee" = 2 counts

**Verse 7: وَلَا الضَّالِّينَ**
- الضَّالِّينَ - "aa" = **6 counts** (Madd Lazim!)
- "ee" = 2 counts`
      },
      {
        id: "int6-quiz",
        type: "exercise",
        title: "Madd Quiz",
        content: "Identify the type of madd!",
        exercise: {
          type: "word_match",
          question: "In 'جَآءَ' (he came), what type of madd is on the alif?",
          options: [
            "Natural Madd - 2 counts",
            "Connected Madd (Muttasil) - 4-5 counts",
            "Separated Madd (Munfasil) - 2-5 counts",
            "Compulsory Madd (Lazim) - 6 counts"
          ],
          correctAnswer: 1,
          explanation: "Connected Madd (Muttasil)! The alif is followed by hamza in the SAME word, so it must be stretched 4-5 counts. This is obligatory."
        }
      },
      {
        id: "int6-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Wonderful! You've learned the essential Madd rules!**

**Summary:**

| Type | When | Duration |
|------|------|----------|
| **Natural (Tabee'i)** | No hamza/sukoon after | 2 counts |
| **Connected (Muttasil)** | Hamza in same word | 4-5 counts |
| **Separated (Munfasil)** | Hamza in next word | 2-5 counts |
| **Compulsory (Lazim)** | Sukoon/Shaddah after | 6 counts |

**Quick check:**
1. Is there hamza or sukoon after the madd letter?
   - No → Natural Madd (2 counts)
   - Yes → Continue...
2. Is the hamza in the same word?
   - Yes → Connected Madd (4-5 counts)
   - No → Separated Madd (2-5 counts)
3. Is there sukoon/shaddah after?
   - Yes → Compulsory Madd (6 counts)

**You've completed Unit 7: Basic Tajweed!** 🎉`
      }
    ],
    memorizationTechniques: [
      "Count madd using finger movements (open-close = 1 count)",
      "Natural madd is the base - everything else builds on it",
      "Look for hamza or sukoon to determine madd type"
    ],
    keyVocabulary: [
      { arabic: "مَدّ طَبِيعِي", transliteration: "Madd Tabee'i", meaning: "Natural elongation (2 counts)" },
      { arabic: "مَدّ مُتَّصِل", transliteration: "Madd Muttasil", meaning: "Connected elongation (4-5 counts)" },
      { arabic: "مَدّ مُنْفَصِل", transliteration: "Madd Munfasil", meaning: "Separated elongation (2-5 counts)" },
      { arabic: "مَدّ لَازِم", transliteration: "Madd Lazim", meaning: "Compulsory elongation (6 counts)" },
      { arabic: "حَرَكَة", transliteration: "Haraka", meaning: "Count (unit of time)" }
    ]
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 8: SHORT SURAH MEMORIZATION (Lessons 26-28)
 * Deep-dive memorization with understanding
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_8_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 26: Al-Masad (Surah 111) with Deep Understanding
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-7",
    unit: 8,
    unitTitle: "Short Surah Memorization",
    path: "intermediate",
    number: 26,
    title: "Al-Masad - The Palm Fiber",
    description: "Memorize Surah Al-Masad with deep tafsir understanding",
    surah: 111,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int7-intro",
        type: "instruction",
        title: "The Story Behind Al-Masad",
        content: `**Al-Masad (المسد)** tells the story of Abu Lahab, the Prophet's ﷺ own uncle who became his fiercest enemy.

**Historical context:**
When Allah commanded the Prophet ﷺ to warn his relatives publicly, he ﷺ called them to Mount Safa and asked:
"If I told you an army was about to attack, would you believe me?"
They said, "Yes, we've never known you to lie."
He ﷺ said, "Then I am warning you of severe punishment."

**Abu Lahab's response:**
"May you perish! Is this why you gathered us?!"

This surah was the divine response.

**Unique features:**
- Only surah naming a specific person (Abu Lahab)
- One of the clearest prophecies - Abu Lahab died a disbeliever as predicted
- Includes his wife (Umm Jamil) who would tie thorny branches on paths the Prophet ﷺ walked`
      },
      {
        id: "int7-verse1",
        type: "explanation",
        title: "Verse 1: The Hands of Abu Lahab",
        arabicContent: "تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ",
        content: `**تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ**
*"Tabbat yadaa Abi Lahabin wa tabb"*

**"May the hands of Abu Lahab perish, and he [himself] perish!"**

**Word breakdown:**
- **تَبَّتْ (tabbat)** - "perished/ruined" (past tense used as curse)
- **يَدَا (yadaa)** - "two hands of" (dual form)
- **أَبِى لَهَبٍ (Abi Lahab)** - "Father of Flame" (his kunyah/nickname)
- **وَتَبَّ (wa tabb)** - "and he perished"

**Why "hands"?**
- His hands worked against Islam
- He threw filth at the Prophet ﷺ with his hands
- "Hands" represents his deeds/efforts

**وَتَبَّ - A fulfilled prophecy:**
The second تَبَّ confirms the curse was fulfilled. He did perish!
Abu Lahab died shortly after Badr, covered in pustules, abandoned even by his family.`
      },
      {
        id: "int7-verse2",
        type: "explanation",
        title: "Verse 2: His Wealth Didn't Help",
        arabicContent: "مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ",
        content: `**مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ**
*"Maa aghnaa 'anhu maaluhu wa maa kasab"*

**"His wealth did not avail him, nor what he earned."**

**Word breakdown:**
- **مَآ أَغْنَىٰ (maa aghnaa)** - "did not avail/benefit"
- **عَنْهُ ('anhu)** - "him"
- **مَالُهُۥ (maaluhu)** - "his wealth"
- **وَمَا كَسَبَ (wa maa kasab)** - "and what he earned"

**Two interpretations of "what he earned":**
1. His profits and business earnings
2. His children (scholars say "what he earned" can mean offspring)

**The lesson:**
Abu Lahab was RICH. He thought his wealth made him untouchable.
But when facing divine punishment:
- Wealth = useless
- Status = worthless
- Family = abandoned him

**Reflection:** What are you relying on that won't help you on Judgment Day?`
      },
      {
        id: "int7-verse3",
        type: "explanation",
        title: "Verse 3: His Destination",
        arabicContent: "سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ",
        content: `**سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ**
*"Sayaslaa naaran dhata lahab"*

**"He will enter a Fire of blazing flames"**

**Word breakdown:**
- **سَيَصْلَىٰ (sayaslaa)** - "he will enter/burn in" (future tense)
- **نَارًا (naaran)** - "a fire"
- **ذَاتَ لَهَبٍ (dhata lahab)** - "possessing flames/blazing"

**The irony:**
His name was "Abu Lahab" (Father of Flame) because of his reddish complexion and fiery temper.
His punishment? **ACTUAL flames** (لَهَب)!

**Name becoming destiny:**
He chose to be the "Father of Flame" in opposition to Islam.
Allah made his name a prophecy of his end.

**Tajweed note:**
This verse contains the separated madd: نَارًا ذَاتَ
There's no madd here since the alif of نارا is tanween, not followed by hamza in the next word properly.`
      },
      {
        id: "int7-verse4-5",
        type: "explanation",
        title: "Verses 4-5: His Wife",
        arabicContent: "وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ • فِى جِيدِهَا حَبْلٌ مِّن مَّسَدٍۭ",
        content: `**وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ**
*"Wa mra-atuhu hammaalatal-hatab"*

**فِى جِيدِهَا حَبْلٌ مِّن مَّسَدٍۭ**
*"Fee jeedihaa hablum mim masad"*

**"And his wife, the carrier of firewood, around her neck is a rope of palm fiber"**

**Word breakdown:**
- **وَٱمْرَأَتُهُۥ (wa imra'atuhu)** - "and his wife"
- **حَمَّالَةَ ٱلْحَطَبِ (hammaalatal-hatab)** - "carrier of firewood"
- **فِى جِيدِهَا (fee jeedihaa)** - "around her neck" (جيد = neck, poetic)
- **حَبْلٌ (hablun)** - "a rope"
- **مِّن مَّسَدٍۭ (mim masad)** - "of palm fiber"

**Who was she?**
Arwa bint Harb (Umm Jamil), sister of Abu Sufyan.
She would:
- Spread thorns on paths the Prophet ﷺ walked
- Spread gossip and slander (another meaning of "carrying firewood")

**The punishment:**
In Hell, she'll carry firewood to fuel her husband's flames, tied by a rope of مَسَد (rough palm fiber) - the very material she used to harm others!

**Tajweed:** Notice the Idgham: "مِّن مَّسَدٍ" - the noon merges into the meem!`
      },
      {
        id: "int7-memorize",
        type: "audio",
        title: "Memorize Al-Masad",
        content: `**Now let's memorize using the 10-3 method!**

**Full Surah:**
تَبَّتْ يَدَآ أَبِى لَهَبٍ وَتَبَّ ﴿١﴾
مَآ أَغْنَىٰ عَنْهُ مَالُهُۥ وَمَا كَسَبَ ﴿٢﴾
سَيَصْلَىٰ نَارًا ذَاتَ لَهَبٍ ﴿٣﴾
وَٱمْرَأَتُهُۥ حَمَّالَةَ ٱلْحَطَبِ ﴿٤﴾
فِى جِيدِهَا حَبْلٌ مِّن مَّسَدٍۭ ﴿٥﴾

**Structure to remember:**
1. The curse on Abu Lahab
2. His wealth didn't help
3. His fiery punishment (irony of his name)
4-5. His wife's crime and punishment

Listen and repeat:`,
        audioSegment: { surah: 111, ayahStart: 1, ayahEnd: 5, repeat: 10 }
      },
      {
        id: "int7-review",
        type: "instruction",
        title: "Al-Masad Memorized! 🌟",
        content: `**Alhamdulillah! You've memorized Surah Al-Masad with deep understanding!**

**Key lessons:**
1. Family ties don't guarantee guidance
2. Wealth is useless against divine decree
3. Names can become destinies
4. Harming the Prophet ﷺ has eternal consequences
5. Partners in crime are partners in punishment

**Prophecy fulfilled:**
This surah was revealed while Abu Lahab was alive and healthy.
If he had accepted Islam, it would have "disproved" the Quran.
But Allah knew - and he died exactly as predicted.

**Application:**
- Don't let wealth deceive you
- Don't follow hostile relatives in wrongdoing
- Your actions today shape your eternal destination

**Coming up:** Surah Al-Fil - The Elephant!`
      }
    ],
    memorizationTechniques: [
      "Remember the irony: 'Father of Flame' will burn in flames",
      "Verse structure: His curse → His wealth fails → His punishment → Her punishment",
      "Notice the rhyme scheme: lahab, kasab, lahab, hatab, masad"
    ],
    keyVocabulary: [
      { arabic: "تَبَّتْ", transliteration: "Tabbat", meaning: "Perished/ruined" },
      { arabic: "أَغْنَىٰ", transliteration: "Aghnaa", meaning: "Availed/benefited" },
      { arabic: "سَيَصْلَىٰ", transliteration: "Sayaslaa", meaning: "He will burn in" },
      { arabic: "حَمَّالَةَ", transliteration: "Hammaalah", meaning: "Carrier" },
      { arabic: "مَّسَدٍ", transliteration: "Masad", meaning: "Palm fiber" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 27: Al-Fil (Surah 105) with Historical Context
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-8",
    unit: 8,
    unitTitle: "Short Surah Memorization",
    path: "intermediate",
    number: 27,
    title: "Al-Fil - The Elephant",
    description: "Learn the miraculous story of the Year of the Elephant",
    surah: 105,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int8-intro",
        type: "instruction",
        title: "The Year the Prophet ﷺ Was Born",
        content: `**The Year of the Elephant (عَام الفِيل)** - approximately 570 CE

This surah describes an event that happened the same year the Prophet ﷺ was born!

**The Story:**
Abraha, the Abyssinian (Ethiopian) ruler of Yemen, built a magnificent cathedral to divert Arab pilgrims from the Ka'bah.

When an Arab man defecated in his cathedral as an insult, Abraha was FURIOUS.

He marched toward Makkah with a massive army including WAR ELEPHANTS - the "tanks" of the ancient world!

**The Quraysh's response:**
They couldn't fight such an army. Abdul Muttalib (the Prophet's grandfather) said:
"The Ka'bah has a Lord who will protect it."

They evacuated to the mountains and watched...

**What happened next is the subject of this surah!**`
      },
      {
        id: "int8-verse1",
        type: "explanation",
        title: "Verse 1: Don't You Know?",
        arabicContent: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَـٰبِ ٱلْفِيلِ",
        content: `**أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَـٰبِ ٱلْفِيلِ**
*"Alam tara kayfa fa'ala Rabbuka bi-ashaabil-feel"*

**"Have you not seen how your Lord dealt with the companions of the elephant?"**

**Word breakdown:**
- **أَلَمْ تَرَ (alam tara)** - "have you not seen?" (rhetorical)
- **كَيْفَ (kayfa)** - "how"
- **فَعَلَ (fa'ala)** - "He dealt/did"
- **رَبُّكَ (Rabbuka)** - "your Lord"
- **بِأَصْحَـٰبِ (bi-ashaabi)** - "with the companions of"
- **ٱلْفِيلِ (al-feel)** - "the elephant"

**Why "have you not SEEN"?**
The Prophet ﷺ was born that year but didn't witness it himself. This language implies:
1. The event was so famous, it's as if everyone saw it
2. The evidence was still visible (destroyed army remnants)
3. It's addressed to all who hear it

**رَبُّكَ - "YOUR Lord":**
Personal address - Allah protected YOUR birthplace, YOUR family's sanctuary, for YOUR coming!`
      },
      {
        id: "int8-verse2",
        type: "explanation",
        title: "Verse 2: Their Plan Foiled",
        arabicContent: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍ",
        content: `**أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍ**
*"Alam yaj'al kaydahum fee tadleel"*

**"Did He not make their plan into misguidance/ruin?"**

**Word breakdown:**
- **أَلَمْ يَجْعَلْ (alam yaj'al)** - "did He not make"
- **كَيْدَهُمْ (kaydahum)** - "their plot/scheme"
- **فِى تَضْلِيلٍ (fee tadleel)** - "into misguidance/ruin"

**كَيْد (kayd)** - Plot, scheme, cunning plan
The same word used for:
- The brothers' plot against Yusuf
- The women's scheme in Yusuf's story
- Shaytan's plots

**تَضْلِيل (tadleel)** - Two meanings:
1. **Misguidance** - their plan led them astray
2. **Ruin/loss** - their plan brought destruction

Their sophisticated military strategy became WORTHLESS against Allah's plan!

**Lesson:** No matter how powerful the enemy or elaborate the scheme, Allah's protection cannot be defeated.`
      },
      {
        id: "int8-verse3",
        type: "explanation",
        title: "Verse 3: The Birds",
        arabicContent: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ",
        content: `**وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ**
*"Wa arsala 'alayhim tayran abaabeel"*

**"And He sent against them birds in flocks"**

**Word breakdown:**
- **وَأَرْسَلَ (wa arsala)** - "and He sent"
- **عَلَيْهِمْ ('alayhim)** - "upon them"
- **طَيْرًا (tayran)** - "birds"
- **أَبَابِيلَ (abaabeel)** - "in flocks/groups"

**أَبَابِيلَ (abaabeel):**
This unique word appears only here in the Quran. It means:
- Coming in successive waves
- In groups/flocks
- From all directions

**What kind of birds?**
The narrations describe them as:
- Smaller than pigeons
- Coming from the sea direction
- Each carrying stones

**The miracle:**
Allah didn't use angels or earthquakes. He used BIRDS - small, ordinary-seeming creatures.

**Lesson:** Allah's soldiers include the smallest creatures. A virus, an insect, a bird - all are armies of Allah!`
      },
      {
        id: "int8-verse4",
        type: "explanation",
        title: "Verse 4: Stones of Baked Clay",
        arabicContent: "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ",
        content: `**تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ**
*"Tarmeehim bi-hijaaratim min sijjeel"*

**"Striking them with stones of baked clay"**

**Word breakdown:**
- **تَرْمِيهِم (tarmeehim)** - "striking/pelting them"
- **بِحِجَارَةٍ (bi-hijaaratin)** - "with stones"
- **مِّن سِجِّيلٍ (min sijjeel)** - "of baked clay"

**سِجِّيل (sijjeel):**
Baked, hardite clay - similar to:
- The stones that destroyed the people of Lut
- Extremely hot/hard projectiles

**The scene:**
Each bird carried three stones:
- One in its beak
- One in each claw

When dropped, each stone:
- Would pierce through the soldier
- Enter from the top, exit from below
- Like bullets from heaven!

**Tajweed note:**
Notice: "تَرْمِيهِم بِحِجَارَةٍ" - Meem Sakinah before Ba = Ikhfa Shafawi (hide the meem)!

**Historical note:**
Elephants refused to march toward Makkah. They'd kneel or turn away. The lead elephant, Mahmoud, simply refused to attack the Ka'bah!`
      },
      {
        id: "int8-verse5",
        type: "explanation",
        title: "Verse 5: The Aftermath",
        arabicContent: "فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍۭ",
        content: `**فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍۭ**
*"Faja'alahum ka'asfim ma'kool"*

**"And He made them like eaten straw"**

**Word breakdown:**
- **فَجَعَلَهُمْ (faja'alahum)** - "so He made them"
- **كَعَصْفٍ (ka-'asfin)** - "like straw/chaff"
- **مَّأْكُولٍۭ (ma'kool)** - "eaten/consumed"

**عَصْف مَّأْكُول (asfin ma'kool):**
The image is powerful:
- Straw/chaff after animals have eaten it
- Full of holes
- Scattered and worthless
- Trampled and destroyed

**The mighty army:**
60,000 soldiers
War elephants
Sophisticated weapons
→ Became like chewed-up straw!

**Abraha's fate:**
He barely escaped back to Yemen, but his flesh began falling off his body. He died as his chest split open - a humiliating end for the would-be destroyer of the Ka'bah.

**The lesson:**
Size and power mean NOTHING before Allah. The greatest army became less than animal feed.`
      },
      {
        id: "int8-memorize",
        type: "audio",
        title: "Memorize Al-Fil",
        content: `**Let's memorize this miraculous account!**

**Full Surah:**
أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَـٰبِ ٱلْفِيلِ ﴿١﴾
أَلَمْ يَجْعَلْ كَيْدَهُمْ فِى تَضْلِيلٍ ﴿٢﴾
وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ ﴿٣﴾
تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ ﴿٤﴾
فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍۭ ﴿٥﴾

**Story flow to remember:**
1. Haven't you seen what Allah did? (Question)
2. Their plot was ruined (Consequence)
3. Birds came in flocks (Method)
4. With stones of baked clay (Weapon)
5. Made them like eaten straw (Result)

Listen and repeat:`,
        audioSegment: { surah: 105, ayahStart: 1, ayahEnd: 5, repeat: 10 }
      },
      {
        id: "int8-review",
        type: "instruction",
        title: "Al-Fil Memorized! 🌟",
        content: `**Alhamdulillah! You've memorized Surah Al-Fil!**

**Key lessons:**
1. Allah protects what He wills, with whatever means He chooses
2. Military might is worthless against divine decree
3. The Ka'bah was protected even before Islam
4. Small creatures can defeat great armies
5. This miracle heralded the Prophet's ﷺ birth

**Reflect:**
The same Lord who protected the Ka'bah with birds is YOUR Rabb.
What are the "elephants" in your life that seem unconquerable?
Remember: كَعَصْفٍ مَّأْكُولٍۭ - they can become like eaten straw!

**Coming up:** Surah Quraysh - The connection between Al-Fil and Quraysh's blessings!`
      }
    ],
    memorizationTechniques: [
      "Visualize the story: army → birds → stones → destruction",
      "Rhyme pattern: feel, tadleel, abaabeel, sijjeel, ma'kool",
      "Connect to the Prophet's ﷺ birth - same year!"
    ],
    keyVocabulary: [
      { arabic: "أَصْحَـٰبِ ٱلْفِيلِ", transliteration: "Ashaab al-Feel", meaning: "Companions of the Elephant" },
      { arabic: "كَيْدَ", transliteration: "Kayd", meaning: "Plot/scheme" },
      { arabic: "أَبَابِيلَ", transliteration: "Abaabeel", meaning: "In flocks" },
      { arabic: "سِجِّيلٍ", transliteration: "Sijjeel", meaning: "Baked clay" },
      { arabic: "عَصْفٍ", transliteration: "'Asf", meaning: "Straw/chaff" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 28: Quraysh (Surah 106) - The Connection
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-9",
    unit: 8,
    unitTitle: "Short Surah Memorization",
    path: "intermediate",
    number: 28,
    title: "Quraysh - For the Familiarity of Quraysh",
    description: "Learn how Al-Fil and Quraysh are connected",
    surah: 106,
    ayahStart: 1,
    ayahEnd: 4,
    estimatedMinutes: 20,
    xpReward: 100,
    steps: [
      {
        id: "int9-intro",
        type: "instruction",
        title: "The Twin Surahs",
        content: `**Surah Quraysh is intimately connected to Surah Al-Fil!**

Some scholars say they were originally ONE surah, or should always be recited together.

**The connection:**
- Al-Fil: Allah PROTECTED the Ka'bah
- Quraysh: Therefore, worship the Lord who protected you!

**Why it matters:**
The destruction of Abraha's army:
1. Saved the Ka'bah
2. Elevated Quraysh's status (they were the guardians)
3. Made their trade routes safe (who would attack Ka'bah's guardians?)
4. Brought them prosperity

**This surah says:** Given ALL these blessings, shouldn't you worship Allah alone?

**Quraysh** = The Prophet's ﷺ tribe, the guardians of the Ka'bah.`
      },
      {
        id: "int9-verse1",
        type: "explanation",
        title: "Verse 1: For Their Familiarity",
        arabicContent: "لِإِيلَـٰفِ قُرَيْشٍ",
        content: `**لِإِيلَـٰفِ قُرَيْشٍ**
*"Li-eelaafi Quraysh"*

**"For the familiarity/security of Quraysh"**

**Word breakdown:**
- **لِإِيلَـٰفِ (li-eelaafi)** - "for the familiarity/security of"
- **قُرَيْشٍ (Quraysh)** - the tribe

**إِيلَاف (eelaaf)** means:
1. **Familiarity** - they were familiar with their trade routes
2. **Security** - they felt safe traveling
3. **Covenant/treaty** - they had agreements with surrounding tribes
4. **Unity** - they were united and cohesive

**The "لِ" (for):**
This connects back to Al-Fil! "Because of what We did to the Elephant army, FOR THE SAKE OF Quraysh's security..."

**Historical context:**
Hashim (Prophet's great-great-grandfather) established trade covenants with Byzantine Rome and Abyssinia, allowing Quraysh safe passage.
After the Elephant incident, their status was even MORE elevated!`
      },
      {
        id: "int9-verse2",
        type: "explanation",
        title: "Verse 2: Their Trade Journeys",
        arabicContent: "إِۦلَـٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ",
        content: `**إِۦلَـٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ**
*"Eelaafihim rihlatash-shitaa'i was-sayf"*

**"Their familiarity with the winter and summer journeys"**

**Word breakdown:**
- **إِۦلَـٰفِهِمْ (eelaafihim)** - "their familiarity"
- **رِحْلَةَ (rihlata)** - "journey of"
- **ٱلشِّتَآءِ (ash-shitaa'i)** - "the winter"
- **وَٱلصَّيْفِ (was-sayf)** - "and the summer"

**The Two Trade Journeys:**

**Winter Journey (رِحْلَة الشِّتَاء):**
- Destination: Yemen (and beyond to India/Abyssinia)
- For: Spices, incense, textiles
- Warm climate during cold Meccan winters

**Summer Journey (رِحْلَة الصَّيْف):**
- Destination: Syria/Palestine (Byzantine territories)
- For: Wheat, olive oil, wine, manufactured goods
- Cooler climate during hot Meccan summers

**Economic genius:**
Makkah itself was barren, but its location made it a perfect trade hub!
Quraysh became wealthy MERCHANTS, not farmers or craftsmen.

**The blessing:** Safe, predictable trade routes = prosperity and stability.`
      },
      {
        id: "int9-verse3",
        type: "explanation",
        title: "Verse 3: The Command",
        arabicContent: "فَلْيَعْبُدُوا۟ رَبَّ هَـٰذَا ٱلْبَيْتِ",
        content: `**فَلْيَعْبُدُوا۟ رَبَّ هَـٰذَا ٱلْبَيْتِ**
*"Fal-ya'budoo Rabba haadhal-bayt"*

**"Let them worship the Lord of this House"**

**Word breakdown:**
- **فَلْيَعْبُدُوا۟ (fal-ya'budoo)** - "so let them worship"
- **رَبَّ (Rabba)** - "the Lord of"
- **هَـٰذَا (haadha)** - "this"
- **ٱلْبَيْتِ (al-bayt)** - "the House" (Ka'bah)

**The logical conclusion:**
Given that Allah:
1. Destroyed the elephant army (Al-Fil)
2. Preserved the Ka'bah
3. Elevated Quraysh's status
4. Made their trade routes safe
5. Gave them prosperity

**THEREFORE:** Worship the Lord of THIS HOUSE!

**"This House" = The Ka'bah:**
Not just any house - THE House of Allah that they are guardians of!
The same house Abraha tried to destroy!

**The irony:**
Quraysh worshipped IDOLS inside the Ka'bah.
They benefited from the House's prestige while filling it with false gods!
This verse calls them back to the House's TRUE Lord.`
      },
      {
        id: "int9-verse4",
        type: "explanation",
        title: "Verse 4: The Blessings",
        arabicContent: "ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنْ خَوْفٍۭ",
        content: `**ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنْ خَوْفٍۭ**
*"Alladhee at'amahum min joo'in wa aamanahum min khawf"*

**"Who fed them against hunger and made them safe from fear"**

**Word breakdown:**
- **ٱلَّذِىٓ (alladhee)** - "the One who"
- **أَطْعَمَهُم (at'amahum)** - "fed them"
- **مِّن جُوعٍ (min joo'in)** - "from/against hunger"
- **وَءَامَنَهُم (wa aamanahum)** - "and secured them"
- **مِّنْ خَوْفٍۭ (min khawf)** - "from fear"

**Two fundamental blessings:**

**1. Freedom from hunger (أَطْعَمَهُم مِّن جُوعٍ):**
- Trade brought food to barren Makkah
- Wealth meant they could buy provisions
- They were never food-insecure

**2. Freedom from fear (ءَامَنَهُم مِّنْ خَوْفٍۭ):**
- Safe from invasion (Elephant army lesson!)
- Safe during travel (covenant protections)
- Sacred months = no warfare near Makkah
- Respected status as Ka'bah guardians

**The two basic human needs:**
- Physical security (food)
- Emotional security (safety)

Allah gave them BOTH. What more do they need to worship Him?`
      },
      {
        id: "int9-memorize",
        type: "audio",
        title: "Memorize Quraysh",
        content: `**Let's memorize this short but profound surah!**

**Full Surah:**
لِإِيلَـٰفِ قُرَيْشٍ ﴿١﴾
إِۦلَـٰفِهِمْ رِحْلَةَ ٱلشِّتَآءِ وَٱلصَّيْفِ ﴿٢﴾
فَلْيَعْبُدُوا۟ رَبَّ هَـٰذَا ٱلْبَيْتِ ﴿٣﴾
ٱلَّذِىٓ أَطْعَمَهُم مِّن جُوعٍ وَءَامَنَهُم مِّنْ خَوْفٍۭ ﴿٤﴾

**Structure:**
1-2: The blessing (security and trade)
3: The command (worship the House's Lord)
4: The reason (He fed and protected you)

**Recite together with Al-Fil** for full context!

Listen and repeat:`,
        audioSegment: { surah: 106, ayahStart: 1, ayahEnd: 4, repeat: 10 }
      },
      {
        id: "int9-review",
        type: "instruction",
        title: "Quraysh Memorized! 🌟",
        content: `**Alhamdulillah! You've completed Surah Quraysh!**

**The twin-surah lesson:**
Al-Fil + Quraysh = Protection leads to gratitude

**Personal application:**
Think about YOUR "trade journeys":
- What routes does Allah keep safe for you? (commute, travel)
- What "hunger" has He freed you from? (not just food - emotional, spiritual)
- What "fears" has He removed?

**Response:** Like Quraysh were commanded → Worship the Lord who provides!

**Intermediate Path Progress:**
You've now completed:
- Unit 6: Quranic Vocabulary (3 lessons)
- Unit 7: Basic Tajweed (3 lessons)
- Unit 8: Short Surah Memorization (3 lessons)

**Coming up in Advanced Path:**
- Longer surah memorization techniques
- Mutashabihat (similar verses)
- Advanced tajweed
- Revision strategies`
      }
    ],
    memorizationTechniques: [
      "Connect to Al-Fil: Protection → Therefore worship",
      "Two journeys: Winter (South/Yemen) and Summer (North/Syria)",
      "Two blessings: Fed from hunger, Safe from fear"
    ],
    keyVocabulary: [
      { arabic: "إِيلَـٰفِ", transliteration: "Eelaaf", meaning: "Familiarity/security" },
      { arabic: "رِحْلَةَ", transliteration: "Rihlah", meaning: "Journey" },
      { arabic: "ٱلشِّتَآءِ", transliteration: "Ash-Shitaa", meaning: "Winter" },
      { arabic: "ٱلصَّيْفِ", transliteration: "As-Sayf", meaning: "Summer" },
      { arabic: "ٱلْبَيْتِ", transliteration: "Al-Bayt", meaning: "The House (Ka'bah)" },
      { arabic: "جُوعٍ", transliteration: "Joo'", meaning: "Hunger" },
      { arabic: "خَوْفٍ", transliteration: "Khawf", meaning: "Fear" }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export const ALL_INTERMEDIATE_LESSONS: Lesson[] = [
  ...UNIT_6_LESSONS,
  ...UNIT_7_LESSONS,
  ...UNIT_8_LESSONS
];

export const INTERMEDIATE_UNITS = [
  { number: 6, title: "Common Quranic Vocabulary", lessons: 3, description: "Build understanding of frequently appearing words" },
  { number: 7, title: "Basic Tajweed Rules", lessons: 3, description: "Master Noon Sakinah, Meem Sakinah, and Madd" },
  { number: 8, title: "Short Surah Memorization", lessons: 3, description: "Deep-dive memorization with understanding" }
];
