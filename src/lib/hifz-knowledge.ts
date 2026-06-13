/**
 * The Hifz Knowledge Library
 * ───────────────────────────────────────────────────────────────
 * A comprehensive, authentic compendium of Quran memorization
 * methodology — drawn from the traditional Tahfiz (حفظ) tradition,
 * the practice of established huffaz and qurra, and the spiritual
 * adab transmitted from the salaf.
 *
 * Sourcing principles:
 *  • Hadith are cited with their collection. Where a narration is
 *    weak or disputed, it is framed as guidance, not as a hujjah.
 *  • Methods reflect the living practice of Tahfiz schools
 *    (Madinah, Egypt, the Indian subcontinent, Turkey) rather than
 *    any single madhhab.
 *  • The sacred text is never paraphrased; Arabic du'as are given
 *    with transliteration and meaning.
 * ─────────────────────────────────────────────────────────────── */

export interface KnowledgeStep {
  title: string;
  detail: string;
}

export interface KnowledgeCallout {
  kind: 'tip' | 'warning' | 'wisdom' | 'evidence';
  text: string;
  source?: string;
}

export interface KnowledgeSection {
  id: string;
  /** Short label for the table of contents */
  nav: string;
  title: string;
  arabic?: string;
  /** One-line summary shown under the title */
  summary: string;
  icon: string; // lucide icon name
  accent: 'gold' | 'sage' | 'indigo' | 'rose';
  body: string[];          // paragraphs
  steps?: KnowledgeStep[]; // optional ordered method
  checklist?: string[];    // optional bullet list
  callouts?: KnowledgeCallout[];
}

export interface KnowledgeChapter {
  id: string;
  title: string;
  description: string;
  sections: KnowledgeSection[];
}

// ════════════════════════════════════════════════════════════════
//  CHAPTER 1 — FOUNDATIONS (before you memorize a single letter)
// ════════════════════════════════════════════════════════════════

const foundations: KnowledgeChapter = {
  id: 'foundations',
  title: 'Foundations',
  description: 'What to settle in your heart and your routine before the first verse.',
  sections: [
    {
      id: 'niyyah',
      nav: 'Intention',
      title: 'Purify the Intention',
      arabic: 'النِّيَّة',
      summary: 'Hifz is an act of worship. Its reward — and its difficulty — both begin in the heart.',
      icon: 'Heart',
      accent: 'gold',
      body: [
        'The entire journey of hifz rests on one foundation: that you memorize for the pleasure of Allah alone, not for status, competition, or the praise of people. The Prophet ﷺ taught that actions are judged by their intentions, and that each person receives only what they intended.',
        'Renew this intention at the start of every session — out loud if it helps. The heart drifts, and the one who began for Allah can quietly slip into memorizing to be seen. Catch it, and return.',
        'Know also the weight of what you carry. To memorize the Quran is to host the speech of Allah in your chest. The huffaz are described in hadith as "the people of Allah and His elect." This is not a small thing you are attempting; treat it with the seriousness — and the hope — it deserves.',
      ],
      callouts: [
        {
          kind: 'evidence',
          text: '"Actions are but by intentions, and every person will have only what they intended."',
          source: 'Bukhari & Muslim',
        },
        {
          kind: 'wisdom',
          text: 'A warning the scholars repeat: the first to be thrown into the Fire on the Day of Judgement includes a reciter of Quran who recited so that people would call him a reciter. Guard your sincerity as carefully as you guard your hifz.',
          source: 'cf. Muslim',
        },
      ],
    },
    {
      id: 'teacher',
      nav: 'A Teacher',
      title: 'Learn from a Teacher (Talaqqi)',
      arabic: 'التَّلَقِّي',
      summary: 'The Quran was received mouth-to-mouth. An app supports you; it does not replace the chain.',
      icon: 'Users',
      accent: 'sage',
      body: [
        'The Quran reached us through talaqqi — a living chain of recitation passed from mouth to ear, teacher to student, unbroken back to the Prophet ﷺ and through him from Jibril. Jibril reviewed the Quran with the Prophet ﷺ once every Ramadan, and twice in the final year of his life. This is the model: memorization paired with correction by someone who has it.',
        'Use this app to listen, drill, schedule your review, and track your progress — but pair it with a qualified teacher or a reliable hifz circle wherever you can. A teacher catches the tajweed errors your own ear cannot, and gives you the ijazah (certification) that connects you to that chain.',
        'If a teacher is genuinely unavailable to you, do not let that stop you from beginning. Memorize with the most authentic recitation you can find, record yourself, and seek correction whenever the opportunity comes. The door is never fully closed.',
      ],
      callouts: [
        {
          kind: 'tip',
          text: 'Many masajid and online platforms offer free or low-cost hifz halaqahs over video call. Even one session a week to check your accuracy transforms the quality of your hifz.',
        },
      ],
    },
    {
      id: 'tajweed-first',
      nav: 'Tajweed First',
      title: 'Fix Your Recitation Before You Memorize',
      arabic: 'التَّجْوِيد',
      summary: 'A mistake memorized is a mistake repeated a thousand times. Correct the letters first.',
      icon: 'BookOpen',
      accent: 'indigo',
      body: [
        'Whatever you memorize, you memorize permanently — including your mistakes. If you fix a verse into memory with the wrong makhraj (point of articulation) or a missed rule of tajweed, you will recite that error every time, often for years, and unlearning it is far harder than learning it correctly the first time.',
        'Before serious hifz, invest in the basics of tajweed: the correct pronunciation of the letters from their makharij, the rules of noon saakin and tanween, the madd (elongations), and the qalqalah. You do not need to be a master — you need to be correct.',
        'Then, as you memorize, recite with tajweed from the very first repetition. Never drill a verse fast and sloppy "just to get the words," intending to beautify it later. The rushed version is what your memory will keep.',
      ],
      callouts: [
        {
          kind: 'evidence',
          text: '"The one who is proficient in the Quran will be with the noble, righteous scribes (the angels), and the one who recites it with difficulty, stumbling over it, will have a double reward."',
          source: 'Bukhari & Muslim',
        },
      ],
    },
    {
      id: 'one-mushaf',
      nav: 'One Mushaf',
      title: 'Memorize from a Single Mushaf',
      arabic: 'مُصْحَف وَاحِد',
      summary: 'Photographic memory of the page is one of the hafiz\'s greatest tools. Don\'t scatter it.',
      icon: 'Book',
      accent: 'sage',
      body: [
        'Choose one printed layout — ideally the 15-line Madinah mushaf used in most hifz schools — and stay with it for your entire hifz. Your visual memory anchors each verse to its place on the page: this ayah begins the top of the left page, that one sits where the page folds, this one ends a juz.',
        'This page-image memory is real and powerful. Huffaz routinely recall "it was near the bottom-right" before they recall the words, and that spatial cue pulls the words up with it. Switch mushafs and you throw that anchor away; the same verse now lives in a different place and your recall stumbles.',
        'This app uses the official Madinah Hafs Uthmani script for exactly this reason. If you also memorize from a physical mushaf, match the layout, and let the two reinforce the same mental image.',
      ],
      callouts: [
        {
          kind: 'tip',
          text: 'Notice where each new portion sits on the page as you memorize it. When you review, try to "see" the page before you recite. This visual recall is what saves you when the words alone won\'t come.',
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════
//  CHAPTER 2 — THE CORE METHODS (how to commit a verse to memory)
// ════════════════════════════════════════════════════════════════

const methods: KnowledgeChapter = {
  id: 'methods',
  title: 'The Memorization Methods',
  description: 'Proven techniques used in Tahfiz schools worldwide. Try them; keep what sticks.',
  sections: [
    {
      id: 'ten-three',
      nav: '10-3 Method',
      title: 'The 10-3 Method',
      summary: 'The most popular starting method. Read while looking, then recite from memory.',
      icon: 'Repeat',
      accent: 'gold',
      body: [
        'This is the gentlest on-ramp into hifz, and the method this app guides you through by default. It works by first building familiarity through looking, then forcing recall — the act that actually moves a verse from short-term into long-term memory.',
      ],
      steps: [
        { title: 'Read the verse 10 times while looking', detail: 'Slowly, with tajweed, eyes tracing every word. Do not rush — quality of attention here decides how fast it sticks.' },
        { title: 'Recite 3 times without looking', detail: 'Close your eyes or cover the text. Stumble, glance to recover, and continue. The struggle to recall is the learning.' },
        { title: 'Connect to what came before', detail: 'Recite the new verse joined to the previous one or two, so the surah flows as one piece, not isolated fragments.' },
      ],
      callouts: [
        {
          kind: 'tip',
          text: 'If three clean recitations from memory aren\'t coming, increase the looking phase: do 15-3 or 20-3. Adjust the numbers to the verse, not your ego.',
        },
        {
          kind: 'warning',
          text: 'Recall — not re-reading — is what builds memory. If you find yourself reading 13 times and reciting once, you are only building familiarity, which fades fast. Force the recall.',
        },
      ],
    },
    {
      id: 'stacking',
      nav: 'Stacking',
      title: 'The Stacking (Chain) Method',
      summary: 'Build the surah like a wall — every new verse is laid on the verses below it.',
      icon: 'Layers',
      accent: 'sage',
      body: [
        'Stacking is the single most important technique for not forgetting what you just learned. Instead of memorizing verses as separate islands, you continually re-recite the chain from the beginning of your portion, so earlier verses are reviewed dozens of times in the natural course of learning later ones.',
      ],
      steps: [
        { title: 'Memorize verse 1 alone', detail: 'Until it is solid and flows without effort.' },
        { title: 'Memorize verse 2, then recite 1+2 together', detail: 'The join between verses is where hifz breaks. Drill the transition itself.' },
        { title: 'Memorize verse 3, then recite 1+2+3', detail: 'Always return to the top of the portion and run the whole chain.' },
        { title: 'Continue to the end of the portion', detail: 'By the time you reach the last verse, the first verses have been reviewed so many times they are unshakeable.' },
      ],
      callouts: [
        {
          kind: 'wisdom',
          text: 'The transitions between verses (the "joins") are where memory fails most often, especially in long surahs. Spend extra repetitions specifically on the last word of one verse flowing into the first word of the next.',
        },
      ],
    },
    {
      id: 'twenty-twenty',
      nav: '20-20 Method',
      title: 'The 20-20 Method',
      summary: 'Heavier repetition for rock-solid hifz. Common in traditional full-time programs.',
      icon: 'Target',
      accent: 'gold',
      body: [
        'A more intensive approach favored when you want a portion fixed so deeply it never wobbles — or for verses that simply refuse to stick. The high repetition count carves a deep groove.',
      ],
      steps: [
        { title: 'Recite verse 1 twenty times', detail: 'Looking for the first several, then increasingly from memory.' },
        { title: 'Recite verse 2 twenty times', detail: 'Same process, fully on its own.' },
        { title: 'Recite verse 3 twenty times', detail: 'Each verse earns its twenty before joining.' },
        { title: 'Recite verses 1+2+3 together twenty times', detail: 'Now bind the three into a single flowing unit, twenty more times.' },
      ],
      callouts: [
        {
          kind: 'tip',
          text: 'Reserve 20-20 for your hardest verses or when you want maximum strength. For most people it is too slow for an entire surah, but unbeatable for the three or four verses that keep slipping.',
        },
      ],
    },
    {
      id: 'listening',
      nav: 'Listening',
      title: 'The Listening Method (Samaʿ)',
      arabic: 'السَّمَاع',
      summary: 'Saturate your ears. Many memorize faster by hearing than by reading.',
      icon: 'Headphones',
      accent: 'indigo',
      body: [
        'For a great many people — and for nearly all children — the ear is a faster road into memory than the eye. This was, after all, how the Companions first received the Quran: by listening to the Prophet ﷺ recite.',
        'Choose one reciter whose pace and style suit you, and listen to your target portion on heavy repeat — while commuting, cooking, before sleep. Let the rhythm and melody embed the verse before you ever sit to memorize it. When you then open the mushaf, half the work is already done.',
        'Consistency of reciter matters here as much as consistency of mushaf: the melody (maqam) becomes part of your memory hook. Switching reciters mid-surah can unsettle the recall the same way switching page layouts does.',
      ],
      callouts: [
        {
          kind: 'tip',
          text: 'Set your chosen portion to loop as you fall asleep and as you wake. Pairing audio with the edges of sleep is one of the most effective and least effortful memorization tools available.',
        },
      ],
    },
    {
      id: 'writing',
      nav: 'Writing',
      title: 'The Writing Method (Kitabah)',
      arabic: 'الكِتَابَة',
      summary: 'Write the verse from memory. The hand reveals exactly what the mind hasn\'t fixed.',
      icon: 'PenLine',
      accent: 'sage',
      body: [
        'Writing a verse out by hand from memory engages a different pathway than reciting, and it ruthlessly exposes the words you only "sort of" know. Where your pen hesitates is precisely where your hifz is weak.',
        'This method has deep roots — many huffaz of the past, and entire schools in West Africa, memorize primarily by writing on a wooden slate (lawh), erasing, and rewriting. The physical act of forming each letter cements both the spelling and the sequence.',
        'You do not need a slate. After memorizing a portion, close the mushaf and write it out. Check against the text, mark your errors, and rewrite only the parts you got wrong. It is slow, but what it fixes, stays fixed.',
      ],
      callouts: [
        {
          kind: 'warning',
          text: 'Take care with the Uthmani spelling, which differs from standard Arabic orthography. The goal is to test recall of the sequence and words — verify spelling against the mushaf, and never treat your handwritten copy as a reference to memorize from.',
        },
      ],
    },
    {
      id: 'understanding',
      nav: 'Meaning',
      title: 'Memorize with Meaning (Tadabbur)',
      arabic: 'التَّدَبُّر',
      summary: 'You remember a story far better than a list of sounds. Learn what you recite.',
      icon: 'Lightbulb',
      accent: 'gold',
      body: [
        'Memory clings to meaning. A verse you understand has handholds — a narrative, an argument, a turn of address from Allah to His servant — that pull the next words up. A verse memorized as pure sound has none, and is far more fragile.',
        'Before or alongside memorizing a portion, read a reliable translation and a short tafsir of it. Know what is being said, to whom, and why these words follow those. The mutashabihat (near-identical verses) that plague every hafiz become manageable once you grasp the subtle difference in meaning that distinguishes them.',
        'This is also where the deeper purpose lives. Hifz is not the goal; it is the vessel. The goal is to carry the guidance of Allah in your heart so it shapes how you live. Tadabbur turns memorization from a feat of recall into an act of nearness.',
      ],
      callouts: [
        {
          kind: 'evidence',
          text: '"(This is) a blessed Book which We have revealed to you, that they might reflect upon its verses and that those of understanding would be reminded."',
          source: 'Quran 38:29 (Sad)',
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════
//  CHAPTER 3 — THE DAILY SYSTEM (the engine of real hifz)
// ════════════════════════════════════════════════════════════════

const dailySystem: KnowledgeChapter = {
  id: 'daily-system',
  title: 'The Daily System: Sabaq, Sabqi, Manzil',
  description: 'The three-part traditional structure that turns memorization into a hafiz.',
  sections: [
    {
      id: 'three-part',
      nav: 'The Three Parts',
      title: 'Sabaq · Sabqi · Manzil',
      arabic: 'سَبَق · سَبْقِي · مَنْزِل',
      summary: 'Every day touches three things: new memorization, recent review, and old review.',
      icon: 'CalendarDays',
      accent: 'gold',
      body: [
        'This is the system that produced huffaz for centuries, refined in the Tahfiz schools of the Indian subcontinent and used in some form everywhere serious hifz is taught. Its genius is that it never lets you choose between learning new material and keeping the old — every single day, you do both, in a fixed ratio.',
        'The three daily portions are:',
      ],
      steps: [
        { title: 'Sabaq (سَبَق) — "the lesson"', detail: 'Your new memorization for today. Usually small: a few lines to half a page. This is where fresh Quran enters.' },
        { title: 'Sabqi (سَبْقِي) — "my recent lesson"', detail: 'The portion you memorized over roughly the last 7 days. Recited daily to harden it while it is still fresh and vulnerable.' },
        { title: 'Manzil (مَنْزِل) — "the stage / lodging"', detail: 'Everything you have ever memorized, cycled through on a schedule. This is the lifelong review that keeps the whole Quran alive in you.' },
      ],
      callouts: [
        {
          kind: 'wisdom',
          text: 'New material is exciting; review is not. But hifz is built and lost in the review. A hafiz is not someone who once memorized the Quran — it is someone who still has it today.',
        },
      ],
    },
    {
      id: 'ratio',
      nav: 'The 70/30 Balance',
      title: 'Spend Most of Your Time on Review',
      summary: 'Roughly 70% review, 30% new. When in doubt, review more.',
      icon: 'Scale',
      accent: 'sage',
      body: [
        'A common and hard-won rule of thumb: about 30% of your daily hifz time on new memorization (sabaq), and about 70% on review (sabqi + manzil). Beginners almost always invert this — racing to memorize more — and then watch the back of their hifz crumble as fast as they build the front.',
        'There is a point, usually around having memorized several juz, where review must take priority over new material entirely. If your old hifz is slipping, stop taking new sabaq until your manzil is solid again. A smaller amount held firmly is worth far more than a large amount half-forgotten.',
        'Let the Quran you hold be a trust you do not neglect. It is consistently reported in the hadith literature that to forget a portion of Quran one had memorized, through negligence, is a serious loss — a strong motivation to protect what you have before reaching for more.',
      ],
      callouts: [
        {
          kind: 'evidence',
          text: '"Keep refreshing your knowledge of the Quran, for by Him in Whose Hand my soul is, it slips away faster than a camel breaks loose from its tether."',
          source: 'Bukhari & Muslim',
        },
      ],
    },
    {
      id: 'review-schedule',
      nav: 'Review Cycle',
      title: 'How to Cycle Your Manzil',
      summary: 'A simple, durable schedule for reviewing everything you\'ve ever memorized.',
      icon: 'RefreshCw',
      accent: 'indigo',
      body: [
        'The manzil only works if it is systematic. Leaving review to "whenever I have time" guarantees that the oldest portions quietly rot. Pick a cycle and hold to it. Two classic approaches:',
      ],
      checklist: [
        'The juz-a-day cycle: once you have memorized several juz, review one full juz of old material every day, rotating through everything you know. A hafiz of the whole Quran completes a full self-review every 30 days.',
        'The weekly sweep: each week, recite everything you have memorized at least once. Manageable in the early juz; combine with the juz-a-day cycle as your hifz grows.',
        'The 7-day fresh window: keep the last week\'s new memorization (sabqi) on daily repeat until it has aged enough to fold into the slower manzil cycle.',
        'Recite from memory in your salah. Voluntary prayers especially are the ideal, built-in review — and the most rewarding.',
      ],
      callouts: [
        {
          kind: 'tip',
          text: 'This app schedules your reviews for you using spaced repetition — surfacing each portion right as it\'s due, and resurfacing weak verses more often. Trust the queue, and show up daily.',
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════
//  CHAPTER 4 — THE SCIENCE OF NOT FORGETTING
// ════════════════════════════════════════════════════════════════

const retention: KnowledgeChapter = {
  id: 'retention',
  title: 'The Science of Retention',
  description: 'Why you forget, and how spacing, sleep, and recall defeat forgetting.',
  sections: [
    {
      id: 'spacing',
      nav: 'Spaced Repetition',
      title: 'Space Your Reviews',
      summary: 'Review just as you\'re about to forget. Each timely review buys a longer interval.',
      icon: 'Clock',
      accent: 'gold',
      body: [
        'Memory follows a forgetting curve: what you learn decays over time unless it is refreshed. The discovery that underpins modern memorization is that the most efficient moment to review is right before you would have forgotten — not sooner (wasteful) and not later (relearning from scratch).',
        'Each successful, timely recall flattens the curve and pushes the next review further out: review after a day, then three days, then a week, then two, then a month. A verse you have correctly recalled at expanding intervals becomes nearly permanent.',
        'This is the modern name for what the huffaz always did by instinct through sabqi and manzil. The app times these intervals for you and adapts them to your accuracy — but the principle is worth understanding, because it tells you why daily, scheduled review beats occasional cramming every time.',
      ],
      callouts: [
        {
          kind: 'warning',
          text: 'Cramming — many repetitions in one sitting, then nothing — produces fast gains that vanish within days. Spacing the same number of repetitions across days produces durable hifz. Same effort, opposite result.',
        },
      ],
    },
    {
      id: 'sleep',
      nav: 'Sleep',
      title: 'Let Sleep Do the Work',
      summary: 'The brain consolidates memory during sleep. Memorize before bed; test in the morning.',
      icon: 'Moon',
      accent: 'indigo',
      body: [
        'Memory is not fixed at the moment you learn it; it is consolidated while you sleep, as the brain replays and files the day\'s learning. Practically, this means a portion memorized in the evening is often noticeably stronger the next morning, with no extra effort.',
        'Build this into your routine: review your new sabaq one last time right before sleeping, and test it first thing after Fajr. Many huffaz report that material "set" overnight is the most durable of all.',
        'This dovetails with the spiritual practice of the salaf, who guarded the last portion of the night for worship and recitation. The hours around sleep are precious for hifz in both senses.',
      ],
      callouts: [
        {
          kind: 'tip',
          text: 'Do not sacrifice sleep to memorize more. A rested brain memorizes and retains far more per hour than an exhausted one. Sleep is not the opposite of study — it is part of it.',
        },
      ],
    },
    {
      id: 'active-recall',
      nav: 'Active Recall',
      title: 'Test, Don’t Re-Read',
      summary: 'Struggling to recall builds memory. Comfortably re-reading does not.',
      icon: 'Brain',
      accent: 'sage',
      body: [
        'The most common hifz mistake is to "review" by reading the portion off the page. It feels productive and is almost worthless: recognizing words you can see is not the same skill as producing them from memory, and only the second is what you need in salah.',
        'Always review with the text hidden. Recite from memory, let yourself struggle, and only glance to recover when you are truly stuck — then hide it again. That moment of effortful retrieval is the exact mechanism that strengthens the memory.',
        'This app\'s "recite to reveal" mode is built on this principle: the words stay hidden until you produce them, turning every review into a real test rather than a comfortable re-read.',
      ],
      callouts: [
        {
          kind: 'wisdom',
          text: 'A useful self-check: if your review never feels difficult, it is not building anything. Productive review should make you work for the words.',
        },
      ],
    },
    {
      id: 'mutashabihat',
      nav: 'Similar Verses',
      title: 'Mastering the Mutashabihat',
      arabic: 'المُتَشَابِهَات',
      summary: 'Near-identical verses are every hafiz\'s nemesis. Meaning and deliberate contrast defeat them.',
      icon: 'GitCompare',
      accent: 'rose',
      body: [
        'The mutashabihat are the verses that are almost the same but not quite — a phrase that appears in three places with one word changed, or two passages that begin identically and then diverge. They are the number-one cause of the hafiz "jumping tracks" mid-recitation, especially in long, thematically repetitive surahs.',
        'They cannot be beaten by raw repetition alone — repetition only deepens the confusion. They are beaten by understanding and by deliberate, side-by-side contrast:',
      ],
      checklist: [
        'Learn the meaning of each version. The difference in wording almost always reflects a difference in meaning or context — once you see why this passage says "Rabbihim" and that one says "Allah," the words stop blurring.',
        'Study the look-alikes together on purpose. Put the two or three similar verses next to each other, identify the exact point of divergence, and drill the difference itself, not the whole verse.',
        'Anchor each version to its surah and page. "The one in Al-Anʽam vs. the one in Al-Aʽraf" — tying each to its place stops them from floating free.',
        'Make a personal note of your own confusions. The verses that trip you are personal; keep a running list and review the contrasts deliberately.',
      ],
      callouts: [
        {
          kind: 'tip',
          text: 'Dedicated reference works on the mutashabihat exist (kutub al-mutashabihat) and map every near-identical passage in the Quran. As your hifz grows, one of these becomes an invaluable companion.',
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════
//  CHAPTER 5 — RHYTHM, ENVIRONMENT, AND THE LONG ROAD
// ════════════════════════════════════════════════════════════════

const practice: KnowledgeChapter = {
  id: 'practice',
  title: 'Rhythm & Environment',
  description: 'When, where, and how to sit so the hifz actually happens — and keeps happening.',
  sections: [
    {
      id: 'timing',
      nav: 'Best Times',
      title: 'The Blessed Hours',
      summary: 'After Fajr above all. A fresh mind, a quiet world, and barakah in the early morning.',
      icon: 'Sunrise',
      accent: 'gold',
      body: [
        'The time after Fajr is, by near-universal agreement of the huffaz, the single best window for new memorization. The mind is rested and uncluttered, the world is silent, and the Prophet ﷺ specifically supplicated for barakah in the early part of the day for his Ummah.',
        'The last third of the night, before Fajr, is likewise treasured — the time of tahajjud and of the descent of mercy. For those who can rise for it, memorizing or reviewing then is exceptional.',
        'If mornings are impossible, the principle that matters more than any specific hour is to fix a consistent time and protect it. The brain loves routine; a portion learned at the same time each day, in the same place, becomes a habit that runs almost on its own.',
      ],
      callouts: [
        {
          kind: 'evidence',
          text: '"O Allah, bless my Ummah in the early part of their day."',
          source: 'Abu Dawud, Tirmidhi & others — hasan',
        },
      ],
    },
    {
      id: 'consistency',
      nav: 'Consistency',
      title: 'Small and Constant Beats Large and Rare',
      summary: 'The most beloved deeds to Allah are the consistent ones, even if few.',
      icon: 'Infinity',
      accent: 'sage',
      body: [
        'Fifteen unbroken minutes every single day will carry you further than a three-hour session once a week — not by a little, but by a great deal. Hifz compounds: daily contact keeps the whole structure warm and accruing, while long gaps let it cool and crack faster than any marathon session can rebuild.',
        'This is a spiritual law before it is a learning one. The Prophet ﷺ taught that the deeds most beloved to Allah are those done consistently, even if small. Choose a daily portion you can sustain on your worst, busiest, most tired day — and then never break the chain, even if all you manage is to hold your ground with review.',
        'Guard against the all-or-nothing trap: the day you cannot do your full session, do a tiny one. A single verse, a single page of review, keeps the streak and the habit alive. Zero days are how hifz dies.',
      ],
      callouts: [
        {
          kind: 'evidence',
          text: '"The most beloved of deeds to Allah are those that are most consistent, even if they are few."',
          source: 'Bukhari & Muslim',
        },
        {
          kind: 'tip',
          text: 'Set a daily goal you can keep 365 days a year, not one you can keep on a good week. One verse a day is 365 verses a year — and far more, because the habit pulls you past the minimum on most days.',
        },
      ],
    },
    {
      id: 'environment',
      nav: 'Environment',
      title: 'Shape Your Space and State',
      summary: 'Wudu, a quiet clean place, facing the qiblah, phone away. Small frictions, large effect.',
      icon: 'Sparkles',
      accent: 'indigo',
      body: [
        'The Quran is the speech of Allah; receive it in a state and a setting that honor it. Sit in wudu where you can — many find their memory itself is clearer in purity. Choose a clean, quiet place, ideally the same one each day, facing the qiblah if you can. The masjid is ideal for those able to use it.',
        'Remove distraction ruthlessly. The single greatest enemy of modern hifz is the phone in your hand: notifications shatter the focused attention that memorization demands. Put the device out of reach (or in this app\'s focused mode) for the duration of your session.',
        'Recite aloud, not silently. Hifz is an oral skill, built through the mouth and the ear together. Hearing your own voice produce the verse engages more of your memory than reading it in your head, and it lets you catch your own tajweed.',
      ],
      callouts: [
        {
          kind: 'wisdom',
          text: 'The state of the heart shows in the hifz. The salaf held that the Quran does not settle easily in a heart cluttered with heedlessness, grudges, and the residue of sin. Clear the space outwardly and inwardly.',
        },
      ],
    },
    {
      id: 'plateaus',
      nav: 'Plateaus',
      title: 'When It Gets Hard',
      summary: 'Every hafiz hits walls. They are part of the road, not a sign to leave it.',
      icon: 'Mountain',
      accent: 'rose',
      body: [
        'There will be stretches where nothing sticks, where old portions collapse faster than you can patch them, where you feel you are going backward. This is the universal experience of hifz, not evidence that you are uniquely unsuited to it. The huffaz before you all passed through it.',
        'When you stall: shrink the portion rather than abandoning the day. Drop new sabaq entirely for a while and pour everything into review until the foundation is firm again. Change method — if reading isn\'t working, switch to listening or writing for that stubborn passage. Rest properly; a plateau is often simple exhaustion.',
        'And turn to the One who taught the Quran. Difficulty in hifz is also a test of sincerity and patience (sabr), and the struggle itself is rewarded — recall that the one who recites with difficulty has a double reward. Do not measure yourself against the fast memorizer beside you; the Quran is not a race, and the slow, faithful road arrives.',
      ],
      callouts: [
        {
          kind: 'evidence',
          text: '"And We have certainly made the Quran easy to remember, so is there any who will be reminded?"',
          source: 'Quran 54:17 (Al-Qamar)',
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════
//  CHAPTER 6 — THE SPIRITUAL DIMENSION
// ════════════════════════════════════════════════════════════════

const spiritual: KnowledgeChapter = {
  id: 'spiritual',
  title: 'The Spiritual Dimension',
  description: 'Hifz is worship before it is study. Tend the heart, and the memory follows.',
  sections: [
    {
      id: 'dua',
      nav: 'Duʿa',
      title: 'Ask the One Who Taught the Quran',
      arabic: 'الدُّعَاء',
      summary: 'Hifz is a gift from Allah, sought through sincere supplication.',
      icon: 'HandHeart',
      accent: 'gold',
      body: [
        'No technique memorizes the Quran; Allah grants it. The huffaz across the centuries leaned on duʿa as heavily as on repetition, knowing that retention is a mercy bestowed, not a skill earned. Begin and end your sessions asking Him.',
        'Two supplications to keep on your tongue:',
      ],
      checklist: [
        'رَبِّ زِدْنِي عِلْمًا — "Rabbi zidni ʽilma" — "My Lord, increase me in knowledge." (Quran 20:114)',
        'اللَّهُمَّ ذَكِّرْنِي مِنْهُ مَا نُسِّيتُ وَعَلِّمْنِي مِنْهُ مَا جَهِلْتُ — "O Allah, remind me of what I have forgotten of it, and teach me of it what I do not know." (from a duʿa reported on reviewing the Quran)',
      ],
      callouts: [
        {
          kind: 'wisdom',
          text: 'Make duʿa in your own language too, in sujood, by name for the portion you are struggling with. The Quran came down as guidance for the humble heart; approach its memorization as a beggar at the door of the Generous.',
        },
      ],
    },
    {
      id: 'sins',
      nav: 'Sin & the Heart',
      title: 'A Pure Heart Holds the Quran',
      summary: 'The light of the Quran does not settle into a heart darkened by sin.',
      icon: 'Heart',
      accent: 'sage',
      body: [
        'The salaf were unanimous that disobedience to Allah weakens the memory and dims the light of the Quran in the heart. The most famous testimony is Imam al-Shafiʽi’s: he complained to his teacher Wakiʽ of his poor memory, and was advised to abandon sin — "for the knowledge of Allah is light, and the light of Allah is not given to a sinner."',
        'This is not a counsel of despair but of hope: it means the path to better hifz runs through taqwa. Guard the eyes, the tongue, the dealings; keep the heart turning back to Allah in tawbah; and you remove the very obstacle that the masters identified as the root of forgetting.',
        'Pair the outward effort with inward sincerity. The Quran is a witness for you or against you on the Day of Judgement — let your hifz be matched by a life that the verses you carry would recognize as their own.',
      ],
      callouts: [
        {
          kind: 'wisdom',
          text: 'Imam al-Shafiʽi: "I complained to Wakiʽ of my poor memory, and he guided me to abandon sins — and told me that the knowledge of Allah is a light, and the light of Allah is not granted to a disobedient one."',
          source: 'reported in his Diwan',
        },
      ],
    },
    {
      id: 'reward',
      nav: 'The Reward',
      title: 'What Awaits the Hafiz',
      summary: 'The honor of the Quran’s people, in this life and the next — keep it before your eyes.',
      icon: 'Crown',
      accent: 'gold',
      body: [
        'When the road is long, remember its end. The Quran will come on the Day of Resurrection as an intercessor for those who kept company with it. Its reciter — the one who struggled to learn it and held onto it — is told: "Recite and ascend, and recite as you used to recite in the world, for your rank is at the last verse you recite."',
        'The parents of a hafiz are crowned with a crown of light on that Day, brighter than the sun — a reward not for the parents’ own deeds but for what they raised. The huffaz are called "the people of Allah and those closest to Him."',
        'And it does not end at death. To teach the Quran, to leave behind a child or a student who carries it, to point others to its memorization — these are among the clearest forms of sadaqah jariyah, a charity that keeps flowing into your scale long after you are gone. Every letter another soul recites because of you is written for you.',
      ],
      callouts: [
        {
          kind: 'evidence',
          text: '"Recite the Quran, for it will come on the Day of Resurrection as an intercessor for its companions."',
          source: 'Muslim',
        },
        {
          kind: 'evidence',
          text: '"When a person dies, his deeds end except for three: ongoing charity (sadaqah jariyah), beneficial knowledge, or a righteous child who prays for him."',
          source: 'Muslim',
        },
      ],
    },
  ],
};

// ════════════════════════════════════════════════════════════════
//  EXPORT
// ════════════════════════════════════════════════════════════════

export const HIFZ_KNOWLEDGE: KnowledgeChapter[] = [
  foundations,
  methods,
  dailySystem,
  retention,
  practice,
  spiritual,
];

export function getAllSections(): KnowledgeSection[] {
  return HIFZ_KNOWLEDGE.flatMap((c) => c.sections);
}

export function getSection(id: string): KnowledgeSection | undefined {
  return getAllSections().find((s) => s.id === id);
}
