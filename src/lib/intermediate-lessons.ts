/**
 * Quran Oasis - Intermediate Lesson Content
 * For users who know Arabic letters and can read basic Quran
 * 
 * Focus areas:
 * - Common Quranic vocabulary and root patterns
 * - Tajweed rules in depth (noon sakinah, meem sakinah, madd, qalqalah)
 * - Medium-length surah memorization (Al-Mulk, Ya-Sin portions, Al-Kahf portions)
 * 
 * Units 6-8: Lessons 20-38 (19 total lessons)
 * 
 * Audio Integration:
 * - EveryAyah.com: https://everyayah.com/data/{reciter_folder}/{surah:03d}{ayah:03d}.mp3
 * - Default reciter: Alafasy_128kbps (Mishary Rashid Alafasy)
 * - Supported reciters: alafasy, husary, abdul_basit, sudais, minshawi, shuraim, ghamadi
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
 * UNIT 6: COMMON QURANIC VOCABULARY (Lessons 20-24)
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
        audioConfig: audio(59, 22, 22), // Surah Al-Hashr, Ayah 22
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
        audioConfig: audio(1, 1, 3), // Al-Fatiha 1-3 for Bismillah context
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
        id: "int1-practice2",
        type: "exercise",
        title: "Root Connection Quiz",
        content: "Understanding roots helps you recognize related words!",
        exercise: {
          type: "word_match",
          question: "Which two Names share the root ر-ح-م (R-H-M)?",
          options: ["الله and الرَّبُّ", "الرَّحْمَٰنُ and الرَّحِيمُ", "الرَّبُّ and الْمَلِكُ", "الْمَلِكُ and مَالِكُ"],
          correctAnswer: 1,
          explanation: "الرَّحْمَٰنُ (Ar-Rahman) and الرَّحِيمُ (Ar-Raheem) both come from the root ر-ح-م meaning mercy!"
        }
      },
      {
        id: "int1-practice3",
        type: "exercise",
        title: "Complete the Phrase",
        content: "Fill in the missing Name of Allah:",
        exercise: {
          type: "fill_blank",
          question: "In Al-Fatiha, we say 'مَالِكِ يَوْمِ ___' - Owner of the Day of ___",
          options: ["الدِّينِ (Judgment)", "الْعَالَمِينَ (Worlds)", "الرَّحِيمِ (Mercy)", "الْحَمْدِ (Praise)"],
          correctAnswer: 0,
          explanation: "مَالِكِ يَوْمِ الدِّينِ - Owner of the Day of Judgment. This emphasizes Allah's complete ownership on that Day!"
        }
      },
      {
        id: "int1-practice4",
        type: "exercise",
        title: "Apply Your Knowledge",
        content: "Use what you've learned about Allah's Names:",
        exercise: {
          type: "comprehension",
          question: "When making du'a for forgiveness, which Name would be most appropriate to call upon?",
          options: ["الْمَلِكُ (The King)", "الرَّحِيمُ (The Merciful)", "الرَّبُّ (The Lord)", "All of these are appropriate"],
          correctAnswer: 3,
          explanation: "All are appropriate! الرَّحِيمُ for His mercy, الرَّبُّ as He is your Sustainer who reforms you, and الْمَلِكُ as He owns all authority to forgive."
        }
      },
      {
        id: "int1-timed-challenge",
        type: "exercise",
        title: "⏱️ Timed Challenge",
        content: "Quick! Answer these in 20 seconds each!",
        exercise: {
          type: "word_match",
          question: "How many times does 'الله' appear in the Quran approximately?",
          options: ["About 500 times", "About 1,000 times", "About 2,700 times", "About 5,000 times"],
          correctAnswer: 2,
          explanation: "الله appears approximately 2,699 times in the Quran - making it the most frequently mentioned Name!"
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
        id: "int2-practice2",
        type: "exercise",
        title: "Verb Form Quiz",
        content: "Match the verb to its root:",
        exercise: {
          type: "word_match",
          question: "The verb يَعْلَمُونَ (they know) comes from which root?",
          options: ["أ-م-ن (belief)", "ع-ل-م (knowledge)", "ع-م-ل (action)", "ه-د-ي (guidance)"],
          correctAnswer: 1,
          explanation: "يَعْلَمُونَ comes from ع-ل-م ('a-l-m) meaning knowledge. Words like عِلْم (knowledge), عَالِم (scholar), and عَلِيم (All-Knowing) share this root!"
        }
      },
      {
        id: "int2-practice3",
        type: "exercise",
        title: "Command Form Recognition",
        content: "Identify the command (imperative) form:",
        exercise: {
          type: "word_match",
          question: "Which of these means 'Guide us!' (command form)?",
          options: ["هَدَى (he guided)", "يَهْدِي (he guides)", "اهْدِنَا (guide us)", "مُهْتَدٍ (guided one)"],
          correctAnswer: 2,
          explanation: "اهْدِنَا is the command form meaning 'guide us!' - this is what we say in Al-Fatiha: اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ (Guide us to the straight path)."
        }
      },
      {
        id: "int2-practice4",
        type: "exercise",
        title: "Complete the Ayah",
        content: "Fill in the missing verb:",
        exercise: {
          type: "fill_blank",
          question: "إِنَّكَ لَا ___ مَنْ أَحْبَبْتَ (28:56) - 'You cannot ___ whom you love'",
          options: ["تَعْلَمُ (know)", "تَهْدِي (guide)", "تُؤْمِنُ (believe)", "تَقُولُ (say)"],
          correctAnswer: 1,
          explanation: "تَهْدِي (guide) - 'You cannot GUIDE whom you love.' This verse reminds us that guidance is from Allah alone, even for the Prophet ﷺ regarding his beloved uncle."
        }
      },
      {
        id: "int2-timed-challenge",
        type: "exercise",
        title: "⏱️ Timed Challenge",
        content: "Rapid verb identification!",
        exercise: {
          type: "word_match",
          question: "Which verb appears most frequently in the Quran (1,600+ times)?",
          options: ["آمَنَ (believed)", "عَلِمَ (knew)", "قَالَ (said)", "عَمِلَ (did)"],
          correctAnswer: 2,
          explanation: "قَالَ (he said) appears over 1,600 times! The Quran is full of conversations - what Allah said, what prophets said, what believers and disbelievers said."
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
        arabicContent: "وَاتَّقُوا يَوْمًا تُرْجَعُونَ فِيهِ إِلَى اللَّهِ",
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
        id: "int3-practice2",
        type: "exercise",
        title: "Negation Practice",
        content: "Distinguish between لَا and مَا:",
        exercise: {
          type: "word_match",
          question: "In 'لَا إِلَٰهَ إِلَّا اللَّهُ', what type of negation is لَا?",
          options: [
            "Past tense negation (did not)",
            "Absolute/total negation (there is absolutely no)",
            "Future negation (will not)",
            "Question word"
          ],
          correctAnswer: 1,
          explanation: "لَا here provides absolute negation - 'There is absolutely NO god except Allah.' It completely negates the existence of any other deity."
        }
      },
      {
        id: "int3-practice3",
        type: "exercise",
        title: "Connector Distinction",
        content: "فَ vs ثُمَّ - know the difference!",
        exercise: {
          type: "word_match",
          question: "He believed فَنَجَّيْنَاهُ (so We saved him) uses فَ because:",
          options: [
            "The saving happened much later",
            "The saving was an immediate result of belief",
            "The order doesn't matter",
            "It's a question"
          ],
          correctAnswer: 1,
          explanation: "فَ indicates immediate sequence/result. His belief led IMMEDIATELY to salvation - no delay. If it said ثُمَّ, it would suggest saving came after some time."
        }
      },
      {
        id: "int3-practice4",
        type: "exercise",
        title: "Relative Pronoun Quiz",
        content: "الَّذِي and مَنْ - when to use which?",
        exercise: {
          type: "word_match",
          question: "الَّذِينَ آمَنُوا means 'those who believe.' Why الَّذِينَ and not مَنْ?",
          options: [
            "الَّذِينَ refers to a specific known group, مَنْ is general/conditional",
            "They mean exactly the same thing",
            "مَنْ is only for questions",
            "الَّذِينَ is for past tense only"
          ],
          correctAnswer: 0,
          explanation: "الَّذِينَ refers to a specific, definite group (THE ones who believe). مَنْ يُؤْمِنُ (whoever believes) is more general/conditional."
        }
      },
      {
        id: "int3-timed-challenge",
        type: "exercise",
        title: "⏱️ Timed Challenge",
        content: "Quick particle identification!",
        exercise: {
          type: "word_match",
          question: "What is the most common word in the Quran?",
          options: ["الله (Allah)", "إِنَّ (Indeed)", "وَ (And)", "مِنْ (From)"],
          correctAnswer: 2,
          explanation: "وَ (and) is the most common word in the Quran! It connects ideas, shows simultaneity, and creates flow throughout the text."
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

**Coming up:** Arabic Root System - The Key to Vocabulary!`
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
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 23: Arabic Root System - The Key to Vocabulary
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-4",
    unit: 6,
    unitTitle: "Common Quranic Vocabulary",
    path: "intermediate",
    number: 23,
    title: "Arabic Root System - The Key to Vocabulary",
    description: "Unlock thousands of words by understanding 3-letter roots",
    surah: 2,
    ayahStart: 1,
    ayahEnd: 10,
    estimatedMinutes: 30,
    xpReward: 125,
    mastery_required: 70, // Must score 70%+ on previous lessons
    steps: [
      {
        id: "int4-intro",
        type: "instruction",
        title: "The Secret to Arabic Vocabulary",
        content: `**The Root System (الجذر)** is Arabic's superpower!

Almost every Arabic word comes from a **3-letter root** that carries a core meaning.

**Example: The root ك-ت-ب (K-T-B) = "writing"**
- كِتَاب (kitaab) - book (thing written)
- كَاتِب (kaatib) - writer (one who writes)
- مَكْتُوب (maktoob) - written (something written)
- مَكْتَبَة (maktaba) - library (place of writing)
- كَتَبَ (kataba) - he wrote (verb)

**One root → Dozens of related words!**

**Why this matters for Quran:**
- The Quran uses approximately 1,700 root words
- Knowing 500 roots = understanding 80%+ of Quranic vocabulary
- Roots reveal hidden connections between concepts

Let's explore the most important Quranic roots!`
      },
      {
        id: "int4-root-slm",
        type: "explanation",
        title: "Root: س-ل-م (S-L-M) - Peace/Submission",
        arabicContent: "إِسْلَام • مُسْلِم • سَلَام • سَلِيم",
        content: `**س-ل-م (S-L-M)** - Core meaning: Peace, Safety, Submission

**Words from this root:**

**سَلَام (salaam)** - peace
"السَّلَامُ عَلَيْكُمْ" - Peace be upon you

**إِسْلَام (islaam)** - submission (to Allah)
The religion's name: complete peace through submission to Allah

**مُسْلِم (muslim)** - one who submits
A person who has embraced Islam

**سَلِيم (saleem)** - sound, healthy, pure
"قَلْبٌ سَلِيمٌ" - a sound/pure heart (26:89)

**سَلَّمَ (sallama)** - he greeted, he submitted
"وَسَلِّمُوا تَسْلِيمًا" - and submit with complete submission

**The beautiful connection:**
ISLAM = finding PEACE (سلام) through SUBMISSION (إسلام)
A MUSLIM = one with a SOUND (سليم) heart who SUBMITS

**Quran insight:**
When you see any س-ل-م word, remember: true peace comes from submission to Allah.`
      },
      {
        id: "int4-root-hmd",
        type: "explanation",
        title: "Root: ح-م-د (H-M-D) - Praise",
        arabicContent: "الْحَمْدُ • مُحَمَّد • أَحْمَد • حَمِيد",
        content: `**ح-م-د (H-M-D)** - Core meaning: Praise, Commendation

**Words from this root:**

**حَمْد (hamd)** - praise
"الْحَمْدُ لِلَّهِ" - All praise is for Allah

**مُحَمَّد (Muhammad)** - The praised one
The Prophet's name ﷺ - "the one who is repeatedly praised"

**أَحْمَد (Ahmad)** - Most praiseworthy
Another name of the Prophet ﷺ mentioned in 61:6

**حَمِيد (Hameed)** - The Praiseworthy
One of Allah's Beautiful Names

**مَحْمُود (Mahmood)** - Praised
"مَقَامًا مَحْمُودًا" - a praised station (17:79)

**The connection:**
- الحَمْدُ (praise) → what we give to Allah
- حَمِيد (Praiseworthy) → Allah's attribute
- مُحَمَّد (praised one) → the Prophet embodying praise

**Pattern recognition:**
- فَعِيل pattern (حَمِيد) often indicates an intensified quality
- مُفَعَّل pattern (مُحَمَّد) indicates something done intensively`
      },
      {
        id: "int4-root-amn",
        type: "explanation",
        title: "Root: أ-م-ن (A-M-N) - Safety/Faith",
        arabicContent: "آمَنَ • إِيمَان • أَمَان • مُؤْمِن • أَمِين",
        content: `**أ-م-ن (A-M-N)** - Core meaning: Safety, Security, Trust

**Words from this root:**

**أَمَان (amaan)** - safety, security
Physical and spiritual protection

**آمَنَ (aamana)** - he believed
Finding spiritual security through faith

**إِيمَان (eemaan)** - faith, belief
The state of having believed

**مُؤْمِن (mu'min)** - believer
One who has found security in faith

**أَمِين (ameen)** - trustworthy
The Prophet ﷺ was called "الأمين" (The Trustworthy)

**The profound connection:**
True FAITH (إيمان) brings TRUE SECURITY (أمان)
A BELIEVER (مؤمن) is one who has found SAFETY in Allah
Being TRUSTWORTHY (أمين) reflects having real faith

**Quran frequency:**
This root appears in various forms over 800 times!
It's central to the Quranic message.`
      },
      {
        id: "int4-root-patterns",
        type: "explanation",
        title: "Common Word Patterns",
        arabicContent: "فَاعِل • مَفْعُول • فَعِيل",
        content: `**Arabic uses patterns (أوزان) to create meaning from roots:**

**Pattern: فَاعِل (faa'il) - Doer/Active Participle**
- كَاتِب (writer) from ك-ت-ب
- عَالِم (scholar) from ع-ل-م
- مُؤْمِن (believer) from أ-م-ن

**Pattern: مَفْعُول (maf'ool) - Done/Passive Participle**
- مَكْتُوب (written) from ك-ت-ب
- مَعْلُوم (known) from ع-ل-م
- مَرْزُوق (provided for) from ر-ز-ق

**Pattern: فَعِيل (fa'eel) - Intensive Quality**
- عَلِيم (All-Knowing) from ع-ل-م
- رَحِيم (Most Merciful) from ر-ح-م
- كَرِيم (Most Generous) from ك-ر-م

**Pattern: فَعَّال (fa''aal) - Intensive Doer**
- غَفَّار (Oft-Forgiving) from غ-ف-ر
- وَهَّاب (Bestower) from و-ه-ب

**Why this matters:**
When you learn one root + pattern recognition, you can understand NEW words you've never seen!`
      },
      {
        id: "int4-practice",
        type: "exercise",
        title: "Root Recognition Quiz",
        content: "Test your root knowledge!",
        exercise: {
          type: "word_match",
          question: "The words مُسْلِم, إِسْلَام, and سَلَام all share which root meaning?",
          options: [
            "Praise and gratitude",
            "Peace and submission",
            "Knowledge and learning",
            "Writing and recording"
          ],
          correctAnswer: 1,
          explanation: "They all come from the root س-ل-م (S-L-M) meaning peace/submission. Islam is submission, Muslim is one who submits, Salaam is peace - all connected!"
        }
      },
      {
        id: "int4-practice2",
        type: "exercise",
        title: "Pattern Recognition",
        content: "Identify the word pattern:",
        exercise: {
          type: "word_match",
          question: "عَالِم (scholar), كَاتِب (writer), and مُؤْمِن (believer) all follow the فَاعِل pattern. What does this pattern indicate?",
          options: [
            "The one who receives the action",
            "The place where action happens",
            "The one who DOES the action (doer)",
            "The result of the action"
          ],
          correctAnswer: 2,
          explanation: "فَاعِل indicates the DOER (active participle). عَالِم = one who knows, كَاتِب = one who writes, مُؤْمِن = one who believes!"
        }
      },
      {
        id: "int4-practice3",
        type: "exercise",
        title: "Root Family Building",
        content: "Build words from roots!",
        exercise: {
          type: "word_match",
          question: "From the root ح-م-د (praise), which word means 'the praised one'?",
          options: ["حَمْد (praise)", "حَمِيد (praiseworthy)", "مُحَمَّد (Muhammad)", "مَحْمُود (praised one)"],
          correctAnswer: 2,
          explanation: "مُحَمَّد means 'the repeatedly praised one' - the Prophet's name ﷺ! مَحْمُود also means 'praised one' (passive participle), while حَمِيد means 'praiseworthy' (one of Allah's Names)."
        }
      },
      {
        id: "int4-practice4",
        type: "exercise",
        title: "Root Connection",
        content: "Find the hidden root connection:",
        exercise: {
          type: "comprehension",
          question: "Why might إِيمَان (faith) and أَمَان (safety) share the same root أ-م-ن?",
          options: [
            "It's just a coincidence",
            "True faith brings spiritual safety and security",
            "They have opposite meanings",
            "The root changed over time"
          ],
          correctAnswer: 1,
          explanation: "Beautiful insight! True إِيمَان (faith) brings أَمَان (safety/security). A believer (مُؤْمِن) finds security in their faith in Allah. The Arabic language embeds deep wisdom in its root connections!"
        }
      },
      {
        id: "int4-timed-challenge",
        type: "exercise",
        title: "⏱️ Timed Challenge",
        content: "Rapid root identification!",
        exercise: {
          type: "word_match",
          question: "How many root words does the Quran approximately use?",
          options: ["About 500 roots", "About 1,700 roots", "About 5,000 roots", "About 10,000 roots"],
          correctAnswer: 1,
          explanation: "The Quran uses approximately 1,700 unique root words. Mastering just 500 of the most common roots will help you understand 80%+ of Quranic vocabulary!"
        }
      },
      {
        id: "int4-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Excellent! You've unlocked the Arabic root system!**

**Roots learned:**
- **س-ل-م** - Peace, Submission (إسلام, مسلم, سلام)
- **ح-م-د** - Praise (الحمد, محمد, حميد)
- **أ-م-ن** - Safety, Faith (إيمان, مؤمن, أمين)

**Patterns recognized:**
- فَاعِل = Doer
- مَفْعُول = Done to
- فَعِيل = Intensive quality

**Your superpower:**
Now when you see new Arabic words, ask:
1. What is the 3-letter root?
2. What pattern is it in?
3. What does this tell me about the meaning?

**Coming up:** More essential roots and patterns!`
      }
    ],
    memorizationTechniques: [
      "Group words by their root - they're related concepts",
      "Learn patterns: فاعل = doer, مفعول = done",
      "When you see a new word, extract the root first"
    ],
    keyVocabulary: [
      { arabic: "جَذْر", transliteration: "Jadhr", meaning: "Root" },
      { arabic: "س-ل-م", transliteration: "S-L-M", meaning: "Peace, Submission" },
      { arabic: "ح-م-د", transliteration: "H-M-D", meaning: "Praise" },
      { arabic: "أ-م-ن", transliteration: "A-M-N", meaning: "Safety, Faith" },
      { arabic: "وَزْن", transliteration: "Wazn", meaning: "Pattern/Form" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 24: Essential Quranic Roots Part 2
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-5",
    unit: 6,
    unitTitle: "Common Quranic Vocabulary",
    path: "intermediate",
    number: 24,
    title: "Essential Quranic Roots - Part 2",
    description: "Master more high-frequency roots for deeper comprehension",
    surah: 2,
    ayahStart: 1,
    ayahEnd: 10,
    estimatedMinutes: 30,
    xpReward: 125,
    steps: [
      {
        id: "int5-intro",
        type: "instruction",
        title: "More Root Power",
        content: `Let's expand your root vocabulary with more essential Quranic roots!

**Today's roots:**
- ع-ب-د ('A-B-D) - Worship/Servitude
- ر-ح-م (R-H-M) - Mercy
- ذ-ك-ر (Dh-K-R) - Remember/Mention
- ق-و-ل (Q-W-L) - Say/Speech
- ص-ل-ح (S-L-H) - Good/Righteous

These roots appear HUNDREDS of times in the Quran.
Mastering them will transform your understanding!`
      },
      {
        id: "int5-root-abd",
        type: "explanation",
        title: "Root: ع-ب-د ('A-B-D) - Worship",
        arabicContent: "عَبَدَ • عِبَادَة • عَبْد • مَعْبُود",
        content: `**ع-ب-د ('A-B-D)** - Core meaning: Worship, Servitude

**Words from this root:**

**عَبَدَ ('abada)** - he worshipped
The fundamental act of servitude

**عِبَادَة ('ibaadah)** - worship
All acts of devotion to Allah

**عَبْد ('abd)** - servant, slave
"عَبْدُ اللَّهِ" - Servant of Allah (the highest honor!)

**عِبَاد ('ibaad)** - servants (plural)
"يَا عِبَادِي" - O My servants

**مَعْبُود (ma'bood)** - the one worshipped
What/who people worship

**نَعْبُدُ (na'budu)** - we worship
"إِيَّاكَ نَعْبُدُ" - You alone we worship

**The profound insight:**
In Arabic, عَبْد (slave/servant) is the HIGHEST status!
The Prophet ﷺ was called "عَبْدُهُ وَرَسُولُهُ" - His servant AND messenger
Servitude to Allah = Ultimate freedom`
      },
      {
        id: "int5-root-rhm",
        type: "explanation",
        title: "Root: ر-ح-م (R-H-M) - Mercy",
        arabicContent: "رَحِمَ • رَحْمَة • رَحْمَٰن • رَحِيم • أَرْحَام",
        content: `**ر-ح-م (R-H-M)** - Core meaning: Mercy, Compassion

**Words from this root:**

**رَحِمَ (rahima)** - he showed mercy
The action of being merciful

**رَحْمَة (rahma)** - mercy
The quality itself

**رَحْمَٰن (Rahman)** - Most Merciful (intensity)
Overwhelming, vast mercy

**رَحِيم (Raheem)** - Most Merciful (continuity)
Ongoing, constant mercy

**رَحِم (rahim)** - womb
Where mercy begins - the mother's womb!

**أَرْحَام (arhaam)** - wombs, family ties
"صِلَةُ الرَّحِم" - maintaining family ties

**The beautiful connection:**
The WOMB (رَحِم) shares the same root as MERCY (رحمة)
A mother's instinctive care = natural mercy
Allah's mercy is infinitely greater than a mother's love!

**Hadith insight:**
Allah named the womb (رَحِم) after Himself (الرَّحْمَٰن)!`
      },
      {
        id: "int5-root-dhkr",
        type: "explanation",
        title: "Root: ذ-ك-ر (Dh-K-R) - Remember",
        arabicContent: "ذَكَرَ • ذِكْر • تَذْكِرَة • ذَاكِر",
        content: `**ذ-ك-ر (Dh-K-R)** - Core meaning: Remember, Mention

**Words from this root:**

**ذَكَرَ (dhakara)** - he remembered/mentioned
Both to recall and to speak about

**ذِكْر (dhikr)** - remembrance
"الذِّكْرُ الْحَكِيمُ" - the wise reminder (Quran)

**يَذْكُرُونَ (yadhkuroon)** - they remember
"الَّذِينَ يَذْكُرُونَ اللَّهَ قِيَامًا وَقُعُودًا"

**تَذْكِرَة (tadhkira)** - reminder
What reminds you of something

**مُذَكِّر (mudhakkir)** - reminder, warner
"إِنَّمَا أَنتَ مُذَكِّرٌ" - You are only a reminder

**ذَكَر (dhakar)** - male
(Same letters but different meaning!)

**Key Quranic concept:**
The Quran is called "الذِّكْر" - THE Reminder
Its purpose: to help us REMEMBER what we innately know
"فَاذْكُرُونِي أَذْكُرْكُمْ" - Remember Me, I will remember you (2:152)`
      },
      {
        id: "int5-root-qwl",
        type: "explanation",
        title: "Root: ق-و-ل (Q-W-L) - Say/Speech",
        arabicContent: "قَالَ • قَوْل • يَقُولُونَ • قُلْ",
        content: `**ق-و-ل (Q-W-L)** - Core meaning: Say, Speech

**Words from this root:**

**قَالَ (qaala)** - he said
The most common verb in Quran (1,600+ times!)

**قَوْل (qawl)** - speech, statement
"وَقُولُوا قَوْلًا سَدِيدًا" - speak a correct word

**يَقُولُ (yaqoolu)** - he says
Present tense form

**قُلْ (qul)** - Say! (command)
Appears 332 times commanding the Prophet ﷺ to say something

**أَقْوَال (aqwaal)** - statements (plural)
What people say

**Why so frequent?**
The Quran records conversations:
- What Allah said
- What prophets said
- What believers said
- What disbelievers said

**Tip:** When you see قَالَ, ask: WHO is speaking? This reveals the context!`
      },
      {
        id: "int5-root-slh",
        type: "explanation",
        title: "Root: ص-ل-ح (S-L-H) - Righteous",
        arabicContent: "صَالِح • صَالِحَات • إِصْلَاح • مُصْلِح",
        content: `**ص-ل-ح (S-L-H)** - Core meaning: Good, Righteous, Reform

**Words from this root:**

**صَالِح (saalih)** - righteous, good
Also the name of Prophet Salih

**صَالِحَات (saalihaat)** - righteous deeds
"وَعَمِلُوا الصَّالِحَاتِ" - and did righteous deeds

**صُلْح (sulh)** - reconciliation, peace
Making things right between people

**إِصْلَاح (islaah)** - reform, correction
Making something good/right

**مُصْلِح (muslih)** - reformer
One who makes things right

**أَصْلَحَ (aslaha)** - he corrected/reformed
The action of making right

**The pattern you know:**
"الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ"
- Faith (إيمان from أ-م-ن)
- PLUS Righteous action (صالحات from ص-ل-ح)
- = Complete formula repeated 50+ times!`
      },
      {
        id: "int5-practice",
        type: "exercise",
        title: "Root Application Quiz",
        content: "Apply your root knowledge!",
        exercise: {
          type: "word_match",
          question: "The word رَحْمَٰن (Rahman) comes from root ر-ح-م. What other word shares this root?",
          options: [
            "قَالَ (he said)",
            "رَحِم (womb)",
            "عَبَدَ (he worshipped)",
            "ذَكَرَ (he remembered)"
          ],
          correctAnswer: 1,
          explanation: "رَحِم (womb) shares the root ر-ح-م with رَحْمَٰن. The womb is named after mercy because it's where a mother's natural compassion begins - and Allah's mercy is even greater!"
        }
      },
      {
        id: "int5-practice2",
        type: "exercise",
        title: "Worship Root Family",
        content: "Build the ع-ب-د family:",
        exercise: {
          type: "word_match",
          question: "From root ع-ب-د (worship/servitude), which word means 'servants' (plural)?",
          options: ["عَبَدَ (he worshipped)", "عِبَادَة (worship)", "عَبْد (servant-singular)", "عِبَاد (servants-plural)"],
          correctAnswer: 3,
          explanation: "عِبَاد is the plural of عَبْد (servant). You see this in 'يَا عِبَادِي' (O My servants) - Allah's loving address to believers!"
        }
      },
      {
        id: "int5-practice3",
        type: "exercise",
        title: "Speech Root Family",
        content: "The most frequent verb's family:",
        exercise: {
          type: "word_match",
          question: "From ق-و-ل (speech), what does قُلْ mean?",
          options: ["He said", "They say", "Say! (command to Prophet)", "A saying"],
          correctAnswer: 2,
          explanation: "قُلْ means 'Say!' - it's the command form. It appears 332 times commanding the Prophet ﷺ to convey a message. 'قُلْ هُوَ اللَّهُ أَحَدٌ' - Say: He is Allah, the One!"
        }
      },
      {
        id: "int5-practice4",
        type: "exercise",
        title: "Complete the Formula",
        content: "The Quranic success formula:",
        exercise: {
          type: "fill_blank",
          question: "الَّذِينَ ___ وَعَمِلُوا الصَّالِحَاتِ (Those who ___ and do righteous deeds)",
          options: ["عَلِمُوا (knew)", "آمَنُوا (believed)", "قَالُوا (said)", "ذَكَرُوا (remembered)"],
          correctAnswer: 1,
          explanation: "آمَنُوا (believed)! This phrase 'الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ' (those who believe and do righteous deeds) appears 50+ times. Faith (أ-م-ن) + Action (ع-م-ل) + Righteousness (ص-ل-ح) = three roots combined!"
        }
      },
      {
        id: "int5-timed-challenge",
        type: "exercise",
        title: "⏱️ Rapid Root Match",
        content: "Quick! Match the word to its root!",
        exercise: {
          type: "word_match",
          question: "ذِكْر (remembrance) comes from which root?",
          options: ["ق-و-ل (speech)", "ع-ب-د (worship)", "ذ-ك-ر (remember)", "ص-ل-ح (righteous)"],
          correctAnswer: 2,
          explanation: "ذ-ك-ر! The Quran itself is called 'الذِّكْر' (The Reminder). Related words: ذَكَرَ (he remembered), تَذْكِرَة (reminder), مُذَكِّر (warner)."
        }
      },
      {
        id: "int5-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Outstanding! You now know 8 essential Quranic roots!**

**Today's roots:**
- **ع-ب-د** - Worship, Servitude (عبادة, عبد, نعبد)
- **ر-ح-م** - Mercy (رحمة, رحمن, رحيم, رحم)
- **ذ-ك-ر** - Remember, Mention (ذكر, تذكرة)
- **ق-و-ل** - Say, Speech (قال, قول, قل)
- **ص-ل-ح** - Righteous, Good (صالح, صالحات, إصلاح)

**Combined with previous lesson:**
- س-ل-م, ح-م-د, أ-م-ن

**Your vocabulary multiplied:**
8 roots × 5-10 words each = 40-80 word families understood!

**Coming up: Unit 7 - Basic Tajweed Rules!**`
      }
    ],
    memorizationTechniques: [
      "Connect roots to their most famous word (ر-ح-م → Rahman)",
      "Notice roots in your daily prayers",
      "Build word families around each root"
    ],
    keyVocabulary: [
      { arabic: "ع-ب-د", transliteration: "'A-B-D", meaning: "Worship, Servitude" },
      { arabic: "ر-ح-م", transliteration: "R-H-M", meaning: "Mercy" },
      { arabic: "ذ-ك-ر", transliteration: "Dh-K-R", meaning: "Remember, Mention" },
      { arabic: "ق-و-ل", transliteration: "Q-W-L", meaning: "Say, Speech" },
      { arabic: "ص-ل-ح", transliteration: "S-L-H", meaning: "Righteous, Good" }
    ]
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 7: TAJWEED RULES IN DEPTH (Lessons 25-29)
 * Master the essential rules for beautiful recitation
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_7_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 25: Noon Sakinah & Tanween Rules
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-6",
    unit: 7,
    unitTitle: "Tajweed Rules in Depth",
    path: "intermediate",
    number: 25,
    title: "Noon Sakinah & Tanween Rules",
    description: "Master the 4 rules for Noon Sakinah (نْ) and Tanween",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 35,
    xpReward: 125,
    mastery_required: 75, // Must score 75%+ on Unit 6 lessons
    steps: [
      {
        id: "int6-intro",
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
        id: "int6-izhar",
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
        id: "int6-idgham",
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
        id: "int6-checkpoint",
        type: "checkpoint",
        title: "Progress Check ✨",
        content: `**You've completed 50% of this lesson. Great progress!**

**So far you've learned:**
- **Izhar** (إِظْهَار) - Clear pronunciation with 6 throat letters
- **Idgham** (إِدْغَام) - Merging with YARMALOON letters

Take a moment to absorb this. You can continue now or save your progress for later.

**Quick review:**
- Throat letters (ء ه ع ح غ خ) → Izhar
- YARMALOON (ي ر م ل و ن) → Idgham`,
        progressPercent: 50,
        offerBreak: true
      },
      {
        id: "int6-iqlab",
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
        id: "int6-ikhfa",
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
        id: "int6-summary-practice",
        type: "practice",
        title: "Putting It All Together",
        arabicContent: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        audioConfig: audio(1, 1, 7, { repeat: 2, pauseBetweenAyahs: 1000 }), // Full Al-Fatiha with pauses
        content: `**Let's apply these rules to Al-Fatiha!**

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
        id: "int6-listen-repeat",
        type: "listen-repeat",
        title: "Practice: Al-Fatiha Tajweed",
        arabicContent: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        listenRepeatConfig: listenRepeat(1, 6, 7, 3),
        content: `**Listen and Repeat Exercise**

Listen to the recitation of Al-Fatiha verses 6-7, focusing on the tajweed rules we learned:

1. **Listen** to the reciter's pronunciation
2. **Identify** the noon sakinah/tanween rules being applied
3. **Repeat** after the audio, mimicking the tajweed

Pay special attention to:
- "أَنْعَمْتَ" - Izhar (clear noon before 'Ayn)
- "عَلَيْهِمْ" - ending meem sakinah

Click play to begin the listen-repeat exercise.`
      },
      {
        id: "int6-quiz",
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
        id: "int6-quiz2",
        type: "exercise",
        title: "Throat Letters Quiz",
        content: "Test your knowledge of Izhar letters!",
        exercise: {
          type: "word_match",
          question: "In 'مَنْ آمَنَ' (whoever believes), which rule applies to the noon?",
          options: ["Izhar (clear)", "Idgham (merge)", "Iqlab (convert)", "Ikhfa (hide)"],
          correctAnswer: 0,
          explanation: "Izhar! The letter أ (Hamza/Alif) is one of the 6 throat letters (ء ه ع ح غ خ). The noon is pronounced clearly."
        }
      },
      {
        id: "int6-quiz3",
        type: "exercise",
        title: "YARMALOON Quiz",
        content: "Test your Idgham knowledge!",
        exercise: {
          type: "word_match",
          question: "In 'مِن لَّدُنَّا' (from Us), which type of Idgham occurs?",
          options: [
            "Idgham WITH ghunnah (ي ن م و)",
            "Idgham WITHOUT ghunnah (ل ر)",
            "No Idgham - Izhar",
            "Iqlab"
          ],
          correctAnswer: 1,
          explanation: "Idgham WITHOUT ghunnah! The noon before Lam (ل) merges completely without nasal sound. Pronounced 'mil-ladunna' - the noon disappears entirely."
        }
      },
      {
        id: "int6-quiz4",
        type: "exercise",
        title: "Ikhfa Practice",
        content: "The most common rule - 15 letters!",
        exercise: {
          type: "word_match",
          question: "In 'أَنتُمْ' (you all), what happens to the noon before Ta (ت)?",
          options: ["Izhar (clear)", "Idgham (merge)", "Iqlab (convert)", "Ikhfa (hide with ghunnah)"],
          correctAnswer: 3,
          explanation: "Ikhfa! Ta (ت) is one of the 15 Ikhfa letters. The noon is 'hidden' with a ghunnah (nasal humming) before the Ta."
        }
      },
      {
        id: "int6-timed-challenge",
        type: "exercise",
        title: "⏱️ Timed Tajweed Challenge",
        content: "Quick rule identification! 15 seconds each!",
        exercise: {
          type: "word_match",
          question: "مِن يَّقُولُ - What rule? (Noon + Ya)",
          options: ["Izhar", "Idgham with ghunnah", "Idgham without ghunnah", "Ikhfa"],
          correctAnswer: 1,
          explanation: "Idgham WITH ghunnah! Ya (ي) is one of the letters ي ن م و. The noon merges with a nasal humming sound: 'miy-yaqool'."
        }
      },
      {
        id: "int6-review",
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
  // LESSON 26: Meem Sakinah Rules
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-7",
    unit: 7,
    unitTitle: "Tajweed Rules in Depth",
    path: "intermediate",
    number: 26,
    title: "Meem Sakinah Rules",
    description: "Learn the 3 rules for Meem Sakinah (مْ)",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int7-intro",
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
        id: "int7-idgham-shafawi",
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
        id: "int7-ikhfa-shafawi",
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
        id: "int7-izhar-shafawi",
        type: "explanation",
        title: "Rule 3: Izhar Shafawi (إِظْهَار شَفَوِي)",
        arabicContent: "عَلَيْهِمْ غَيْرِ",
        content: `**Izhar Shafawi** - Clear pronunciation of Meem

**When:** Meem Sakinah (مْ) is followed by ANY letter EXCEPT Meem or Ba.

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
        id: "int7-comparison",
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
        id: "int7-quiz",
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
        id: "int7-quiz2",
        type: "exercise",
        title: "Idgham Shafawi Practice",
        content: "Meem meets meem!",
        exercise: {
          type: "word_match",
          question: "In 'لَهُم مَّا يَشَاءُونَ', what happens to the meem sakinah?",
          options: [
            "Pronounced clearly (Izhar)",
            "Merged into one elongated meem with ghunnah (Idgham)",
            "Hidden before the next letter (Ikhfa)",
            "Converted to noon"
          ],
          correctAnswer: 1,
          explanation: "Idgham Shafawi! When meem sakinah meets another meem, they merge into ONE meem with ghunnah. Pronounced 'lahum-maa' with one long nasal meem."
        }
      },
      {
        id: "int7-quiz3",
        type: "exercise",
        title: "Izhar Shafawi Practice",
        content: "Most letters = Izhar!",
        exercise: {
          type: "word_match",
          question: "In 'عَلَيْهِمْ غَيْرِ', what rule applies to the meem?",
          options: [
            "Izhar Shafawi - clear meem (غ is not م or ب)",
            "Idgham Shafawi - merging",
            "Ikhfa Shafawi - hiding",
            "No rule applies"
          ],
          correctAnswer: 0,
          explanation: "Izhar Shafawi! Ghayn (غ) is NOT meem or ba, so the meem is pronounced clearly. 26 letters trigger Izhar Shafawi - only م and ب are special!"
        }
      },
      {
        id: "int7-quiz4",
        type: "exercise",
        title: "Compare Noon vs Meem Rules",
        content: "Spot the difference!",
        exercise: {
          type: "comprehension",
          question: "Noon Sakinah has 4 rules (Izhar, Idgham, Iqlab, Ikhfa). Meem Sakinah has only 3. Which rule is missing for Meem?",
          options: ["Izhar", "Idgham", "Iqlab", "Ikhfa"],
          correctAnswer: 2,
          explanation: "Iqlab! There's no Iqlab for meem sakinah because Iqlab only applies to NOON converting to MEEM before Ba. Meem can't convert to itself!"
        }
      },
      {
        id: "int7-timed-challenge",
        type: "exercise",
        title: "⏱️ Rapid Meem Rules",
        content: "Quick identification!",
        exercise: {
          type: "word_match",
          question: "هُمْ فِيهَا - What rule? (Meem + Fa)",
          options: ["Izhar Shafawi (clear)", "Idgham Shafawi (merge)", "Ikhfa Shafawi (hide)", "No special rule"],
          correctAnswer: 0,
          explanation: "Izhar Shafawi! Fa (ف) is neither meem nor ba, so the meem is pronounced clearly. 'Hum feehaa' with a crisp, clear meem!"
        }
      },
      {
        id: "int7-review",
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
  // LESSON 27: Madd Rules - Elongation
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-8",
    unit: 7,
    unitTitle: "Tajweed Rules in Depth",
    path: "intermediate",
    number: 27,
    title: "Madd Rules - Elongation",
    description: "Learn the essential elongation rules for beautiful recitation",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 30,
    xpReward: 125,
    steps: [
      {
        id: "int8-intro",
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
- Build anticipation
- Mark endings
- Distinguish similar words`
      },
      {
        id: "int8-madd-tabee",
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
        id: "int8-madd-muttasil",
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

**Visual cue:** Look for آ (alif with hamza written as madda). It signals connected madd!`
      },
      {
        id: "int8-madd-munfasil",
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
The madd letter and hamza are SEPARATED in different words - you could stop between them.

**Flexibility:** 
Different reciters use different lengths. Hafs 'an Asim typically uses 4-5 counts.

**Recognition tip:**
Whenever a word ends with ا, و, or ي (as vowels) and the next word starts with أ, إ, or آ, it's separated madd!`
      },
      {
        id: "int8-checkpoint",
        type: "checkpoint",
        title: "Progress Check ✨",
        content: `**You've completed 60% of this lesson!**

**Madd types covered:**
- **Natural Madd** (طَبِيعِي) - 2 counts, the foundation
- **Connected Madd** (مُتَّصِل) - Hamza in same word, 4-5 counts
- **Separated Madd** (مُنْفَصِل) - Hamza in next word, 2-5 counts

One more type to go! Continue or take a break?`,
        progressPercent: 60,
        offerBreak: true
      },
      {
        id: "int8-madd-lazim",
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
        id: "int8-quiz",
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
        id: "int8-quiz2",
        type: "exercise",
        title: "Natural Madd Identification",
        content: "Find the basic 2-count madd:",
        exercise: {
          type: "word_match",
          question: "In 'قَالَ' (he said), what type of madd is on the alif?",
          options: [
            "Natural Madd (طَبِيعِي) - 2 counts",
            "Connected Madd (مُتَّصِل) - 4-5 counts",
            "Compulsory Madd (لَازِم) - 6 counts",
            "No madd - just a regular letter"
          ],
          correctAnswer: 0,
          explanation: "Natural Madd! There's no hamza or sukoon after the alif, so it's the basic 2-count stretch. This is the foundation - all other madds build on it!"
        }
      },
      {
        id: "int8-quiz3",
        type: "exercise",
        title: "Separated vs Connected",
        content: "Crucial distinction!",
        exercise: {
          type: "word_match",
          question: "In 'يَا أَيُّهَا' (O you), is the madd on 'يَا' connected or separated?",
          options: [
            "Connected (Muttasil) - hamza in same word",
            "Separated (Munfasil) - hamza in different word",
            "Natural - no hamza involved",
            "Compulsory - sukoon after"
          ],
          correctAnswer: 1,
          explanation: "Separated (Munfasil)! The alif is at the END of 'يَا' and the hamza is at the START of 'أَيُّهَا'. They're in DIFFERENT words, so it's separated."
        }
      },
      {
        id: "int8-quiz4",
        type: "exercise",
        title: "Compulsory Madd Practice",
        content: "The longest stretch - 6 counts!",
        exercise: {
          type: "word_match",
          question: "In 'الضَّالِّينَ', why is there a 6-count madd on the alif?",
          options: [
            "Because it's followed by hamza",
            "Because it's followed by a sukoon/shaddah on the Lam",
            "Because it's at the end of a verse",
            "There's no madd here"
          ],
          correctAnswer: 1,
          explanation: "The alif before the doubled Lam (لّ with shaddah) creates Madd Lazim (compulsory) - must be 6 full counts! This is the only Madd Lazim in Al-Fatiha."
        }
      },
      {
        id: "int8-timed-challenge",
        type: "exercise",
        title: "⏱️ Madd Speed Quiz",
        content: "Quick count determination!",
        exercise: {
          type: "word_match",
          question: "How many counts for الم at the beginning of surahs?",
          options: ["2 counts each", "4 counts each", "6 counts each", "No elongation"],
          correctAnswer: 2,
          explanation: "6 counts each! The huroof muqatta'at (mysterious letters) at surah beginnings have Madd Lazim - they contain inherent sukoon requiring maximum elongation. أَلِفْ لَامْ مِيمْ - each held for 6 counts!"
        }
      },
      {
        id: "int8-review",
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

**Coming up:** Qalqalah - The bouncing letters!`
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
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 28: Qalqalah - The Echo Letters
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-9",
    unit: 7,
    unitTitle: "Tajweed Rules in Depth",
    path: "intermediate",
    number: 28,
    title: "Qalqalah - The Echo Letters",
    description: "Master the bouncing sound of the Qalqalah letters",
    surah: 112,
    ayahStart: 1,
    ayahEnd: 4,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int9-intro",
        type: "instruction",
        title: "What is Qalqalah?",
        content: `**Qalqalah (قَلْقَلَة)** means "to shake" or "to disturb."

In tajweed, it refers to the slight bouncing or echoing sound made when certain letters have sukoon.

**The 5 Qalqalah Letters:**
**ق ط ب ج د**

**Memory phrase:** "قُطْبُ جَدّ" (Qutbu Jadd - "The grandfather's pole")

**Why do these letters echo?**
These letters are:
1. Strong consonants (not soft/flowing)
2. When they have sukoon (no vowel), they can't flow smoothly
3. So they "bounce" or "echo" slightly when released

**Two levels of Qalqalah:**
1. **Small (صُغْرَى)** - in the middle of a word
2. **Large (كُبْرَى)** - at the END of a word (when stopping)`
      },
      {
        id: "int9-small-qalqalah",
        type: "explanation",
        title: "Small Qalqalah (صُغْرَى)",
        arabicContent: "يَجْعَلُونَ",
        content: `**Small Qalqalah** - When the letter is in the MIDDLE of a word.

**Characteristics:**
- Subtle bounce
- Lighter echo
- Continues smoothly to next sound

**Examples:**

**ق in middle:** "يَقْتُلُونَ" (yaqtuloon) - slight bounce on Qaf
**ط in middle:** "يَطْمَعُونَ" (yatma'oon) - slight bounce on Ta
**ب in middle:** "يَبْتَغُونَ" (yabtaghoon) - slight bounce on Ba
**ج in middle:** "يَجْعَلُونَ" (yaj'aloon) - slight bounce on Jeem
**د in middle:** "يَدْخُلُونَ" (yadkhuloon) - slight bounce on Dal

**Practice:**
Read "أَقْرَبُ" (aqrabu) - Feel the slight bounce on the Qaf, but don't exaggerate!

**Common mistake:** Making the echo too strong. Small qalqalah is SUBTLE.`
      },
      {
        id: "int9-large-qalqalah",
        type: "explanation",
        title: "Large Qalqalah (كُبْرَى)",
        arabicContent: "أَحَدْ",
        content: `**Large Qalqalah** - When the letter is at the END and you STOP on it.

**Characteristics:**
- More pronounced bounce
- Clear echo
- The air pressure builds and releases

**Examples from Surah Al-Ikhlas:**

- "أَحَدٌ" → When stopping: "أَحَدْ" - strong bounce on Dal
- "الصَّمَدُ" → When stopping: "الصَّمَدْ" - strong bounce on Dal
- "يُولَدْ" - strong bounce on Dal
- "يَلِدْ" - strong bounce on Dal

**From Surah Al-Falaq:**
- "الْفَلَقْ" (al-falaq) - strong bounce on Qaf

**From Surah Al-Masad:**
- "تَبَّ" (tabb) - strong bounce on Ba
- "لَهَبْ" (lahab) - strong bounce on Ba

**Practice technique:**
1. Say the word normally
2. Stop on the final letter
3. Let the air release with a slight "pop"
4. It should sound like a very short echo: "ahad-d"`
      },
      {
        id: "int9-practice",
        type: "audio",
        title: "Qalqalah in Surah Al-Ikhlas",
        arabicContent: "قُلْ هُوَ ٱللَّهُ أَحَدٌ",
        content: `**Let's practice Qalqalah in Surah Al-Ikhlas!**

**قُلْ هُوَ ٱللَّهُ أَحَدٌ ﴿١﴾**
- "أَحَدٌ" when we stop → "أَحَدْ" - Large Qalqalah on Dal!

**ٱللَّهُ ٱلصَّمَدُ ﴿٢﴾**
- "ٱلصَّمَدُ" when we stop → "ٱلصَّمَدْ" - Large Qalqalah on Dal!

**لَمْ يَلِدْ وَلَمْ يُولَدْ ﴿٣﴾**
- "يَلِدْ" - Large Qalqalah on Dal
- "يُولَدْ" - Large Qalqalah on Dal

**Notice:** This surah is FULL of qalqalah because of words ending in Dal!

Listen and repeat:`,
        audioSegment: { surah: 112, ayahStart: 1, ayahEnd: 4, repeat: 5 }
      },
      {
        id: "int9-quiz",
        type: "exercise",
        title: "Qalqalah Quiz",
        content: "Identify the qalqalah!",
        exercise: {
          type: "letter_identify",
          question: "Which letter has Large Qalqalah when you stop on 'الْفَلَقْ'?",
          options: ["ف (Fa)", "ل (Lam)", "ق (Qaf)", "None"],
          correctAnswer: 2,
          explanation: "The Qaf (ق) at the end gets Large Qalqalah because it's a qalqalah letter at the end during a stop. The bouncing sound is more pronounced!"
        }
      },
      {
        id: "int9-quiz2",
        type: "exercise",
        title: "Qalqalah Letters Memory",
        content: "Remember all 5 letters!",
        exercise: {
          type: "word_match",
          question: "Which mnemonic helps remember the 5 Qalqalah letters?",
          options: ["يَرْمَلُون (YARMALOON)", "قُطْبُ جَدّ (QUTBU JADD)", "حُرُوف الحَلْق (Throat letters)", "None of these"],
          correctAnswer: 1,
          explanation: "قُطْبُ جَدّ (Qutbu Jadd) contains all 5 qalqalah letters: ق ط ب ج د - meaning 'the grandfather's pole' or similar phrase!"
        }
      },
      {
        id: "int9-quiz3",
        type: "exercise",
        title: "Small vs Large Qalqalah",
        content: "Context matters!",
        exercise: {
          type: "word_match",
          question: "In 'يَقْتُلُونَ' (they kill), what type of qalqalah is on the Qaf?",
          options: [
            "Large Qalqalah (كُبْرَى) - strong bounce",
            "Small Qalqalah (صُغْرَى) - subtle bounce",
            "No qalqalah because it's not at the end",
            "No qalqalah because Qaf isn't a qalqalah letter"
          ],
          correctAnswer: 1,
          explanation: "Small Qalqalah! The Qaf has sukoon but it's in the MIDDLE of the word, not at the end. The bounce is subtle, not pronounced."
        }
      },
      {
        id: "int9-quiz4",
        type: "exercise",
        title: "Surah Al-Ikhlas Qalqalah",
        content: "This surah is full of qalqalah!",
        exercise: {
          type: "word_match",
          question: "How many words in Surah Al-Ikhlas have Large Qalqalah when stopping? (أَحَدٌ, الصَّمَدُ, يَلِدْ, يُولَدْ, أَحَدٌ)",
          options: ["1 word", "2 words", "4 words", "5 words"],
          correctAnswer: 3,
          explanation: "5 words! أَحَدْ (twice), الصَّمَدْ, يَلِدْ, يُولَدْ - all end with Dal (د), a qalqalah letter! This makes Al-Ikhlas excellent qalqalah practice."
        }
      },
      {
        id: "int9-timed-challenge",
        type: "exercise",
        title: "⏱️ Quick Qalqalah Check",
        content: "Is it a qalqalah letter?",
        exercise: {
          type: "word_match",
          question: "Which of these is NOT a qalqalah letter?",
          options: ["ق (Qaf)", "ك (Kaf)", "ط (Ta)", "ب (Ba)"],
          correctAnswer: 1,
          explanation: "ك (Kaf) is NOT a qalqalah letter! The 5 qalqalah letters are ق ط ب ج د. Kaf looks similar to Qaf but produces no echo/bounce."
        }
      },
      {
        id: "int9-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Excellent! You've mastered Qalqalah!**

**Summary:**

**The 5 Letters:** ق ط ب ج د (قُطْبُ جَدّ)

| Type | Where | Intensity |
|------|-------|-----------|
| **Small (صُغْرَى)** | Middle of word | Subtle bounce |
| **Large (كُبْرَى)** | End (when stopping) | Clear bounce |

**Common errors to avoid:**
- Adding a full vowel (saying "ahad-a" instead of "ahad" with echo)
- Making middle qalqalah too strong
- Forgetting qalqalah entirely

**Coming up:** Ghunnah - The Nasal Sound!`
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
  // LESSON 29: Ghunnah - The Nasal Sound
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-10",
    unit: 7,
    unitTitle: "Tajweed Rules in Depth",
    path: "intermediate",
    number: 29,
    title: "Ghunnah - The Nasal Sound",
    description: "Perfect the beautiful nasal humming in Quran recitation",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 20,
    xpReward: 100,
    steps: [
      {
        id: "int10-intro",
        type: "instruction",
        title: "The Beauty of Ghunnah",
        content: `**Ghunnah (غُنَّة)** is the nasal humming sound produced through the nose.

**Which letters have Ghunnah?**
Only two: **ن (Noon)** and **م (Meem)**

**When is Ghunnah applied?**
1. When ن or م have shaddah (نّ, مّ)
2. During Idgham with ghunnah
3. During Ikhfa
4. During Iqlab

**Duration:**
Ghunnah is held for **2 counts** (like natural madd)

**The physical technique:**
1. Close your mouth (for meem) or let air flow through nose (for noon)
2. Let the sound resonate in your nasal cavity
3. You should feel vibration in your nose!`
      },
      {
        id: "int10-mushaddad",
        type: "explanation",
        title: "Ghunnah with Shaddah",
        arabicContent: "إِنَّ • أُمَّة",
        content: `**When Noon or Meem have Shaddah → Maximum Ghunnah!**

**Examples with Noon Mushaddad (نّ):**
- إِنَّ (inna) - "Indeed" - hum the doubled noon
- جَنَّة (jannah) - "Paradise" - nasal humming on نّ
- أَنَّ (anna) - "that" - ghunnah required

**Examples with Meem Mushaddad (مّ):**
- أُمَّة (ummah) - "nation" - hum the doubled meem
- ثُمَّ (thumma) - "then" - nasal humming on مّ
- لَمَّا (lammaa) - "when" - ghunnah required

**Practice technique:**
1. Say إِنَّ
2. On the نّ, pinch your nose
3. If the sound stops, you're doing it right! (sound comes from nose)
4. Release and let it hum for 2 counts

**In Al-Fatiha:**
- "الضَّالِّينَ" - the shaddah is on Lam (ل), not noon, so no ghunnah there
- But when you read "إِنَّا أَعْطَيْنَاكَ" in Al-Kawthar, the إِنَّ has ghunnah!`
      },
      {
        id: "int10-where-else",
        type: "explanation",
        title: "Where Else Ghunnah Appears",
        arabicContent: "مِن يَقُولُ",
        content: `**Ghunnah also appears in the tajweed rules you learned:**

**1. Idgham with Ghunnah:**
When Noon Sakinah meets ي ن م و
- "مِن يَقُولُ" → "miy-yaqool" - 2 count ghunnah
- "مِن وَلِيّ" → "miw-waliyy" - 2 count ghunnah

**2. Ikhfa (of Noon):**
When Noon Sakinah meets the 15 Ikhfa letters
- "مِن قَبْلِ" → soft noon with 2 count ghunnah
- "أَنتُمْ" → ghunnah on the hidden noon

**3. Iqlab:**
When Noon becomes Meem before Ba
- "مِنْ بَعْدِ" → "mim ba'd" - the meem has ghunnah

**4. Ikhfa Shafawi (of Meem):**
When Meem Sakinah meets Ba
- "هُمْ بِهِ" → soft meem with ghunnah

**Key insight:**
Almost every time you encounter noon or meem interacting with another letter, there's likely ghunnah involved!`
      },
      {
        id: "int10-quiz",
        type: "exercise",
        title: "Ghunnah Quiz",
        content: "Identify where ghunnah occurs!",
        exercise: {
          type: "word_match",
          question: "In the word 'إِنَّمَا', where does ghunnah occur?",
          options: [
            "On the Alif (ا)",
            "On the doubled Noon (نّ)",
            "On the Meem (م)",
            "On the final Alif (ا)"
          ],
          correctAnswer: 1,
          explanation: "The doubled Noon (نّ) requires ghunnah! When you say 'innama', the نّ should have a nasal humming sound held for 2 counts."
        }
      },
      {
        id: "int10-review",
        type: "instruction",
        title: "Lesson Complete! 🌟",
        content: `**Wonderful! You've mastered Ghunnah!**

**Summary:**
- Ghunnah = nasal humming on ن and م
- Duration = 2 counts
- Appears with: Shaddah, Idgham, Ikhfa, Iqlab

**Self-test:**
Pinch your nose while saying the ghunnah. 
If the sound stops, you're doing it correctly!

**You've completed Unit 7: Tajweed Rules in Depth!**

**Coming up: Unit 8 - Medium Surah Memorization!**`
      }
    ],
    memorizationTechniques: [
      "Ghunnah = nasal hum on Noon and Meem",
      "Always 2 counts duration",
      "Pinch test: if sound stops, ghunnah is correct"
    ],
    keyVocabulary: [
      { arabic: "غُنَّة", transliteration: "Ghunnah", meaning: "Nasal sound" },
      { arabic: "مُشَدَّد", transliteration: "Mushaddad", meaning: "Doubled (with shaddah)" },
      { arabic: "حَرَكَتَان", transliteration: "Harakatan", meaning: "Two counts" }
    ]
  }
];

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * UNIT 8: MEDIUM SURAH MEMORIZATION (Lessons 30-38)
 * Deep-dive memorization of Al-Mulk, Ya-Sin sections, Al-Kahf sections
 * ═══════════════════════════════════════════════════════════════════════════
 */

const UNIT_8_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 30: Al-Mulk Part 1 (Verses 1-10) - The Dominion
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-11",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 30,
    title: "Al-Mulk Part 1 - The Dominion",
    description: "Begin memorizing Surah Al-Mulk with deep understanding (verses 1-10)",
    surah: 67,
    ayahStart: 1,
    ayahEnd: 10,
    estimatedMinutes: 40,
    xpReward: 150,
    mastery_required: 80, // Must master Tajweed basics before surah memorization
    steps: [
      {
        id: "int11-intro",
        type: "instruction",
        title: "The Protector Surah",
        content: `**Surah Al-Mulk (الملك)** - The Dominion/Sovereignty

**Also called:** Surah Tabarak, Al-Munjiyah (The Savior)

**The Prophet ﷺ said:**
"There is a surah in the Quran of thirty verses that intercedes for its reciter until he is forgiven: Tabaarakalladhi biyadihil-mulk." (Tirmidhi, Abu Dawud)

**Another narration** (graded weak/da'if by many scholars — take as encouragement, not as established proof):
"It is the protector; it is the savior, delivering from the punishment of the grave." (Tirmidhi)

**Key themes:**
1. Allah's absolute dominion over creation
2. The purpose of life and death
3. Signs of Allah in creation
4. Warning to disbelievers
5. The security of believers

**Memorization goal:** 30 verses in 3 lessons (10 verses each)

Let's begin with the powerful opening...`
      },
      {
        id: "int11-verses1-2",
        type: "explanation",
        title: "Verses 1-2: Blessed Sovereignty",
        arabicContent: "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ • الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا",
        content: `**Verse 1:**
تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ

**"Blessed is He in Whose Hand is the dominion, and He has power over all things."**

**Key vocabulary:**
- تَبَارَكَ (tabaaraka) - Blessed (exalted beyond measure)
- بِيَدِهِ (biyadihi) - in His Hand
- الْمُلْكُ (al-mulk) - the dominion/sovereignty
- قَدِيرٌ (qadeer) - All-Powerful

**Verse 2:**
الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ

**"Who created death and life to test you: which of you is best in deed. And He is the Mighty, the Forgiving."**

**Profound insight:**
- Death is CREATED (not just absence of life)
- Death mentioned BEFORE life (we start dead, live, then die again)
- Purpose: To test "أَحْسَنُ عَمَلًا" (BEST in deed) - quality, not quantity!`
      },
      {
        id: "int11-verses3-4",
        type: "explanation",
        title: "Verses 3-4: The Perfect Heavens",
        arabicContent: "الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ",
        content: `**Verse 3:**
الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ

**"Who created seven heavens in layers. You see no imperfection in the creation of the Most Merciful. So look again—do you see any flaw?"**

**Key vocabulary:**
- سَبْعَ سَمَاوَاتٍ (sab'a samaawaat) - seven heavens
- طِبَاقًا (tibaaqan) - in layers
- تَفَاوُتٍ (tafaawut) - inconsistency/imperfection
- فُطُورٍ (futoor) - cracks/flaws

**Verse 4:**
ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ

**"Then look again and again—your sight will return humbled and exhausted."**

**The challenge:**
Allah challenges us to find ANY flaw in His creation. Look at the sky, the universe - perfect design! Your eyes will tire before finding an imperfection.`
      },
      {
        id: "int11-checkpoint",
        type: "checkpoint",
        title: "Halfway Through! ⭐",
        content: `**Excellent progress! You've covered verses 1-4.**

**Key themes so far:**
1. **Verse 1:** Allah's blessed sovereignty over all things
2. **Verse 2:** Death and life created as a TEST - for best deeds, not most!
3. **Verses 3-4:** Challenge to find any flaw in creation

**Memorization tip:** These first 4 verses flow together:
تَبَارَكَ → الَّذِي (x3) → showing Allah's power through creation.

Continue now or save for later?`,
        progressPercent: 50,
        offerBreak: true
      },
      {
        id: "int11-verses5-6",
        type: "explanation",
        title: "Verses 5-6: Stars and Hell",
        arabicContent: "وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ",
        content: `**Verse 5:**
وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ

**"And We adorned the nearest heaven with lamps and made them missiles against the devils, and We prepared for them the punishment of the Blaze."**

**Key vocabulary:**
- زَيَّنَّا (zayyannaa) - We adorned/beautified
- مَصَابِيحَ (masaabeeh) - lamps (stars)
- رُجُومًا (rujooman) - missiles
- السَّعِيرِ (as-sa'eer) - the Blaze (Hell)

**Verse 6:**
وَلِلَّذِينَ كَفَرُوا بِرَبِّهِمْ عَذَابُ جَهَنَّمَ ۖ وَبِئْسَ الْمَصِيرُ

**"And for those who disbelieved in their Lord is the punishment of Hell. And wretched is the destination."**

**Dual purpose of stars:**
1. Beauty (زَيَّنَّا) - aesthetic design
2. Protection (رُجُومًا) - missiles against devils`
      },
      {
        id: "int11-verses7-8",
        type: "explanation",
        title: "Verses 7-8: Hell's Fury",
        arabicContent: "إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ",
        content: `**Verse 7:**
إِذَا أُلْقُوا فِيهَا سَمِعُوا لَهَا شَهِيقًا وَهِيَ تَفُورُ

**"When they are thrown into it, they hear from it an inhaling while it boils up."**

**Key vocabulary:**
- أُلْقُوا (ulqoo) - they are thrown
- شَهِيقًا (shaheeqan) - an inhaling/roaring sound
- تَفُورُ (tafoor) - it boils over

**Verse 8:**
تَكَادُ تَمَيَّزُ مِنَ الْغَيْظِ ۖ كُلَّمَا أُلْقِيَ فِيهَا فَوْجٌ سَأَلَهُمْ خَزَنَتُهَا أَلَمْ يَأْتِكُمْ نَذِيرٌ

**"It almost bursts with rage. Every time a group is thrown into it, its keepers ask them, 'Did there not come to you a warner?'"**

**Powerful imagery:**
- Hell is described as ANGRY (غَيْظ)
- It almost BURSTS from rage against the disbelievers
- Each group is asked: "Didn't a warner come to you?"

**The question we'll all face:** Did you not receive the message?`
      },
      {
        id: "int11-verses9-10",
        type: "explanation",
        title: "Verses 9-10: The Admission",
        arabicContent: "قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ",
        content: `**Verse 9:**
قَالُوا بَلَىٰ قَدْ جَاءَنَا نَذِيرٌ فَكَذَّبْنَا وَقُلْنَا مَا نَزَّلَ اللَّهُ مِن شَيْءٍ إِنْ أَنتُمْ إِلَّا فِي ضَلَالٍ كَبِيرٍ

**"They will say, 'Yes, a warner had come to us, but we denied and said: Allah has not sent down anything; you are only in great error.'"**

**Verse 10:**
وَقَالُوا لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ مَا كُنَّا فِي أَصْحَابِ السَّعِيرِ

**"And they will say, 'If only we had listened or reasoned, we would not be among the companions of the Blaze.'"**

**The tragic admission:**
- They ADMIT a warner came (بَلَىٰ)
- They ADMIT they denied (فَكَذَّبْنَا)
- They ADMIT they didn't listen or reason (لَوْ كُنَّا نَسْمَعُ أَوْ نَعْقِلُ)

**The solution was simple:** Listen (نَسْمَعُ) + Think (نَعْقِلُ)
They chose to reject both.`
      },
      {
        id: "int11-audio",
        type: "audio",
        title: "Listen and Memorize (Verses 1-10)",
        content: `**Listen to verses 1-10 with focus:**

Follow along with the Arabic text. Notice:
- The rhythm and rhyme scheme
- How the themes flow from sovereignty → creation → punishment → admission

**Memorization tips for Al-Mulk:**
1. Group by theme (1-2: Power, 3-4: Creation, 5-6: Stars/Hell, 7-10: Hell scene)
2. Notice the question-answer pattern (7-8 question, 9-10 answer)
3. Pay attention to the tajweed: ghunnah, madd, qalqalah

**Listen and repeat each verse 10 times:**`,
        audioSegment: { surah: 67, ayahStart: 1, ayahEnd: 10, repeat: 10 }
      },
      {
        id: "int11-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: `تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ ﴿١﴾
الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ ﴿٢﴾
الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ ﴿٣﴾
ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ ﴿٤﴾
وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ ﴿٥﴾`,
        audioSegment: { surah: 67, ayahStart: 1, ayahEnd: 10 }
      },
      {
        id: "int11-review",
        type: "instruction",
        title: "Part 1 Complete! 🌟",
        content: `**MashaAllah! You've memorized Al-Mulk verses 1-10!**

**Themes covered:**
1. Allah's blessed sovereignty (1)
2. Death and life as a test (2)
3. Perfect creation of the heavens (3-4)
4. Stars as beauty and protection (5)
5. The punishment of Hell (6-8)
6. The admission of the deniers (9-10)

**Key vocabulary learned:**
- تَبَارَكَ - Blessed be
- الْمُلْكُ - The dominion
- أَحْسَنُ عَمَلًا - Best in deed
- تَفَاوُتٍ - Imperfection

**Review schedule:**
- Today: Review 3 more times
- Tomorrow: Review in morning and evening
- This week: Daily review

**Coming up:** Al-Mulk Part 2 (Verses 11-20)!`
      }
    ],
    memorizationTechniques: [
      "Group by theme: Sovereignty → Creation → Punishment → Admission",
      "Notice repeated patterns: الَّذِي appears multiple times",
      "Visualize: Stars as lamps (مَصَابِيح)"
    ],
    keyVocabulary: [
      { arabic: "تَبَارَكَ", transliteration: "Tabaaraka", meaning: "Blessed is" },
      { arabic: "الْمُلْكُ", transliteration: "Al-Mulk", meaning: "The dominion" },
      { arabic: "أَحْسَنُ عَمَلًا", transliteration: "Ahsanu 'amalan", meaning: "Best in deed" },
      { arabic: "تَفَاوُتٍ", transliteration: "Tafaawut", meaning: "Inconsistency" },
      { arabic: "مَصَابِيحَ", transliteration: "Masaabeeh", meaning: "Lamps (stars)" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 31: Al-Mulk Part 2 (Verses 11-20)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-12",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 31,
    title: "Al-Mulk Part 2 - Signs in Creation",
    description: "Continue memorizing Surah Al-Mulk (verses 11-20)",
    surah: 67,
    ayahStart: 11,
    ayahEnd: 20,
    estimatedMinutes: 40,
    xpReward: 150,
    steps: [
      {
        id: "int12-intro",
        type: "instruction",
        title: "Continuing Al-Mulk",
        content: `**Verses 11-20 continue with:**
- The confession of sinners (11)
- The reward of believers (12)
- Allah's complete knowledge (13-14)
- Signs in the earth and sky (15-19)
- Challenge to the disbelievers (20)

Let's continue building on your memorization!`
      },
      {
        id: "int12-audio",
        type: "audio",
        title: "Listen and Memorize (Verses 11-20)",
        content: `Listen carefully to verses 11-20 and repeat:`,
        audioSegment: { surah: 67, ayahStart: 11, ayahEnd: 20, repeat: 10 }
      },
      {
        id: "int12-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "فَاعْتَرَفُوا بِذَنبِهِمْ فَسُحْقًا لِّأَصْحَابِ السَّعِيرِ ﴿١١﴾",
        audioSegment: { surah: 67, ayahStart: 11, ayahEnd: 20 }
      },
      {
        id: "int12-review",
        type: "instruction",
        title: "Part 2 Complete! 🌟",
        content: `**Excellent! You've memorized Al-Mulk verses 11-20!**

Keep reviewing daily!`
      }
    ],
    memorizationTechniques: [
      "Connect to Part 1 themes",
      "Notice the contrast between believers and disbelievers"
    ],
    keyVocabulary: [
      { arabic: "فَاعْتَرَفُوا", transliteration: "Fa'tarafoo", meaning: "So they confessed" },
      { arabic: "أَلَا يَعْلَمُ", transliteration: "Alaa ya'lamu", meaning: "Does He not know" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 32: Al-Mulk Part 3 (Verses 21-30)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-13",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 32,
    title: "Al-Mulk Part 3 - Complete the Surah",
    description: "Complete memorizing Surah Al-Mulk (verses 21-30)",
    surah: 67,
    ayahStart: 21,
    ayahEnd: 30,
    estimatedMinutes: 40,
    xpReward: 175,
    steps: [
      {
        id: "int13-intro",
        type: "instruction",
        title: "Completing Al-Mulk",
        content: `**The final verses bring it all together:**
- Who provides for you? (21)
- Guidance from Allah (22)
- Signs all around (23-24)
- When is the promise? (25-27)
- The final message (28-30)

Complete this blessed surah!`
      },
      {
        id: "int13-audio",
        type: "audio",
        title: "Listen and Memorize (Verses 21-30)",
        content: `Listen to the final verses:`,
        audioSegment: { surah: 67, ayahStart: 21, ayahEnd: 30, repeat: 10 }
      },
      {
        id: "int13-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "قُلْ أَرَأَيْتُمْ إِنْ أَصْبَحَ مَاؤُكُمْ غَوْرًا فَمَن يَأْتِيكُم بِمَاءٍ مَّعِينٍ ﴿٣٠﴾",
        audioSegment: { surah: 67, ayahStart: 21, ayahEnd: 30 }
      },
      {
        id: "int13-review",
        type: "instruction",
        title: "Al-Mulk Complete! 🏆",
        content: `**Alhamdulillah! You've memorized all 30 verses of Surah Al-Mulk!**

This surah will intercede for you. Recite it every night!`
      }
    ],
    memorizationTechniques: [
      "Final verses have powerful rhetorical questions",
      "End with water imagery - essential provision from Allah"
    ],
    keyVocabulary: [
      { arabic: "مَاءٍ مَّعِينٍ", transliteration: "Maa'in ma'een", meaning: "Flowing water" },
      { arabic: "قُلْ أَرَأَيْتُمْ", transliteration: "Qul ara'aytum", meaning: "Say: Have you considered" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 33: Al-Kahf - First 10 Verses (Protection from Dajjal)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-14",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 33,
    title: "Al-Kahf First 10 Verses - Protection",
    description: "Memorize the protective opening of Surah Al-Kahf",
    surah: 18,
    ayahStart: 1,
    ayahEnd: 10,
    estimatedMinutes: 45,
    xpReward: 175,
    steps: [
      {
        id: "int14-intro",
        type: "instruction",
        title: "The Protected Verses",
        content: `**The Prophet ﷺ said:**
"Whoever memorizes ten verses from the beginning of Surah Al-Kahf will be protected from the Dajjal." (Muslim)

**Surah Al-Kahf themes:**
1. Praise of the Quran (1-3)
2. Warning to those who claim Allah has a son (4-6)
3. Introduction to the story of the cave (7-10)

These 10 verses contain powerful protection!`
      },
      {
        id: "int14-verses",
        type: "explanation",
        title: "The Opening Praise",
        arabicContent: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا",
        content: `**Verse 1:**
"All praise is for Allah Who revealed the Book to His servant, and made it flawless."

**Key points:**
- الْحَمْدُ لِلَّهِ - All praise to Allah
- عَبْدِهِ - His servant (Muhammad ﷺ)
- عِوَجًا - Any crookedness (there is none!)

The Quran is PERFECT, without any defect.`
      },
      {
        id: "int14-audio",
        type: "audio",
        title: "Listen and Memorize",
        content: `Listen to the first 10 verses:`,
        audioSegment: { surah: 18, ayahStart: 1, ayahEnd: 10, repeat: 10 }
      },
      {
        id: "int14-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا ﴿١﴾",
        audioSegment: { surah: 18, ayahStart: 1, ayahEnd: 10 }
      },
      {
        id: "int14-review",
        type: "instruction",
        title: "Protected! 🛡️",
        content: `**You've memorized the protective 10 verses of Al-Kahf!**

Recite these every Friday for special blessing and protection.`
      }
    ],
    memorizationTechniques: [
      "Recite every Friday for blessing",
      "Protection from Dajjal",
      "Praise → Warning → Story introduction"
    ],
    keyVocabulary: [
      { arabic: "عِوَجًا", transliteration: "'Iwajan", meaning: "Crookedness/defect" },
      { arabic: "قَيِّمًا", transliteration: "Qayyiman", meaning: "Straight/upright" },
      { arabic: "الْكَهْفِ", transliteration: "Al-Kahf", meaning: "The Cave" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 34: Ya-Sin Opening (Verses 1-12) - The Heart of the Quran
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-15",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 34,
    title: "Ya-Sin Opening - The Heart of Quran",
    description: "Begin memorizing the blessed Surah Ya-Sin",
    surah: 36,
    ayahStart: 1,
    ayahEnd: 12,
    estimatedMinutes: 45,
    xpReward: 175,
    steps: [
      {
        id: "int15-intro",
        type: "instruction",
        title: "The Heart of the Quran",
        content: `**A well-known narration** (Tirmidhi 2887 — graded gharib/weak by Tirmidhi himself and later scholars; widely circulated, but not established as authentic):
"Everything has a heart, and the heart of the Quran is Ya-Sin."

"Whoever recites Ya-Sin seeking Allah's pleasure, his past sins will be forgiven." (Bayhaqi — also weak)

**Opening themes (1-12):**
1. The Wise Quran confirms Muhammad ﷺ (1-6)
2. Most people are heedless (7-10)
3. Who truly benefits from warning (11-12)`
      },
      {
        id: "int15-audio",
        type: "audio",
        title: "Listen and Memorize",
        content: `Listen to Ya-Sin 1-12:`,
        audioSegment: { surah: 36, ayahStart: 1, ayahEnd: 12, repeat: 10 }
      },
      {
        id: "int15-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "يس ﴿١﴾ وَالْقُرْآنِ الْحَكِيمِ ﴿٢﴾ إِنَّكَ لَمِنَ الْمُرْسَلِينَ ﴿٣﴾",
        audioSegment: { surah: 36, ayahStart: 1, ayahEnd: 12 }
      },
      {
        id: "int15-review",
        type: "instruction",
        title: "Ya-Sin Opening Complete! 🌟",
        content: `**Beautiful! You've started memorizing Ya-Sin!**

Continue with the rest of this blessed surah.`
      }
    ],
    memorizationTechniques: [
      "يس - mysterious letters, mark the beginning",
      "Oath by the Wise Quran",
      "Confirmation of prophethood"
    ],
    keyVocabulary: [
      { arabic: "يس", transliteration: "Ya-Sin", meaning: "Mysterious letters" },
      { arabic: "الْقُرْآنِ الْحَكِيمِ", transliteration: "Al-Qur'an al-Hakeem", meaning: "The Wise Quran" },
      { arabic: "الْمُرْسَلِينَ", transliteration: "Al-Mursaleen", meaning: "The messengers" }
    ]
  },

  // ─────────────────────────────────────────────────────────────────────────
  // LESSON 35-38: More Surah Content (Condensed)
  // ─────────────────────────────────────────────────────────────────────────
  {
    id: "int-lesson-16",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 35,
    title: "Ya-Sin Middle Section (Verses 13-32)",
    description: "The story of the messengers and the believing man",
    surah: 36,
    ayahStart: 13,
    ayahEnd: 32,
    estimatedMinutes: 50,
    xpReward: 200,
    steps: [
      {
        id: "int16-intro",
        type: "instruction",
        title: "The City and Its People",
        content: `This section tells the story of messengers sent to a city and a believing man who supported them.`
      },
      {
        id: "int16-audio",
        type: "audio",
        title: "Listen and Memorize",
        content: "Listen and repeat:",
        audioSegment: { surah: 36, ayahStart: 13, ayahEnd: 32, repeat: 10 }
      },
      {
        id: "int16-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "وَاضْرِبْ لَهُم مَّثَلًا أَصْحَابَ الْقَرْيَةِ إِذْ جَاءَهَا الْمُرْسَلُونَ ﴿١٣﴾",
        audioSegment: { surah: 36, ayahStart: 13, ayahEnd: 32 }
      },
      {
        id: "int16-review",
        type: "instruction",
        title: "Section Complete!",
        content: "Continue building your Ya-Sin memorization!"
      }
    ],
    memorizationTechniques: ["Story format aids memory", "Believing man's courage"],
    keyVocabulary: [
      { arabic: "أَصْحَابَ الْقَرْيَةِ", transliteration: "Ashaab al-Qaryah", meaning: "People of the city" }
    ]
  },

  {
    id: "int-lesson-17",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 36,
    title: "Short Surah Review - Al-Masad",
    description: "Deep review of Surah Al-Masad with tajweed focus",
    surah: 111,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int17-audio",
        type: "audio",
        title: "Review Al-Masad",
        content: "Review with perfect tajweed:",
        audioSegment: { surah: 111, ayahStart: 1, ayahEnd: 5, repeat: 10 }
      },
      {
        id: "int17-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "تَبَّتْ يَدَا أَبِي لَهَبٍ وَتَبَّ ﴿١﴾",
        audioSegment: { surah: 111, ayahStart: 1, ayahEnd: 5 }
      }
    ],
    memorizationTechniques: ["Review strengthens memory"],
    keyVocabulary: [{ arabic: "تَبَّتْ", transliteration: "Tabbat", meaning: "Perished" }]
  },

  {
    id: "int-lesson-18",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 37,
    title: "Short Surah Review - Al-Fil & Quraysh",
    description: "Review the twin surahs together",
    surah: 105,
    ayahStart: 1,
    ayahEnd: 5,
    estimatedMinutes: 25,
    xpReward: 100,
    steps: [
      {
        id: "int18-audio",
        type: "audio",
        title: "Review Al-Fil",
        content: "Review both surahs together:",
        audioSegment: { surah: 105, ayahStart: 1, ayahEnd: 5, repeat: 5 }
      },
      {
        id: "int18-memorization",
        type: "practice",
        title: "🎯 Memorization Practice",
        content: "MEMORIZATION_MODULE",
        arabicContent: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ ﴿١﴾",
        audioSegment: { surah: 105, ayahStart: 1, ayahEnd: 5 }
      }
    ],
    memorizationTechniques: ["Connect twin surahs"],
    keyVocabulary: [{ arabic: "أَصْحَابِ الْفِيلِ", transliteration: "Ashaab al-Feel", meaning: "People of the Elephant" }]
  },

  {
    id: "int-lesson-19",
    unit: 8,
    unitTitle: "Medium Surah Memorization",
    path: "intermediate",
    number: 38,
    title: "Intermediate Path Completion",
    description: "Review and celebrate your intermediate achievements",
    surah: 1,
    ayahStart: 1,
    ayahEnd: 7,
    estimatedMinutes: 30,
    xpReward: 250,
    steps: [
      {
        id: "int19-intro",
        type: "instruction",
        title: "Congratulations! 🎉",
        content: `**You've completed the Intermediate Path!**

**Your achievements:**
- Mastered 8 essential Quranic roots
- Learned all tajweed rules (Noon, Meem, Madd, Qalqalah, Ghunnah)
- Memorized Surah Al-Mulk (30 verses)
- Memorized Al-Kahf first 10 verses
- Started Ya-Sin memorization

**You're ready for the Advanced Path!**`
      },
      {
        id: "int19-final",
        type: "instruction",
        title: "Next Steps",
        content: `Continue to the Advanced Path for:
- Advanced tajweed
- Mutashabihat (similar verses)
- Long surah strategies
- Revision systems

May Allah bless your journey!`
      }
    ],
    memorizationTechniques: ["Celebrate milestones", "Review what you've learned"],
    keyVocabulary: []
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
  { number: 6, title: "Common Quranic Vocabulary", lessons: 6, description: "Names of Allah, verbs, particles, root patterns, + Review", hasReview: true },
  { number: 7, title: "Tajweed Rules in Depth", lessons: 6, description: "Noon Sakinah, Meem Sakinah, Madd, Qalqalah, Ghunnah, + Review", hasReview: true },
  { number: 8, title: "Medium Surah Memorization", lessons: 9, description: "Al-Mulk, Al-Kahf (first 10), Ya-Sin portions" }
];
