/**
 * Tafsir & Contextual Learning Library
 * 
 * Enhanced wrapper around tafsirService with:
 * - In-memory caching for tafsir, translations, and reflections
 * - Verse connection data (thematic links between ayahs)
 * - Revelation context (Makki/Madani with brief historical notes)
 * - Integration with Sheikh API for dynamic reflections
 */

import { fetchTafsir, type TafsirContent } from './tafsirService';
import { getAyah } from './quranData';
import { getSurahMeta, type SurahMeta } from './surahMetadata';

// ─── Cache ───────────────────────────────────────────────────────────

const tafsirCache = new Map<string, TafsirContent>();
const translationCache = new Map<string, string>();
const reflectionCache = new Map<string, ReflectionCard>();

function cacheKey(surah: number, ayah: number, edition?: string): string {
  return `${surah}:${ayah}:${edition || 'default'}`;
}

// ─── Types ───────────────────────────────────────────────────────────

export interface VerseContextData {
  surah: number;
  ayah: number;
  meaning: string;
  tafsir: TafsirContent | null;
  revelationContext: RevelationContext;
  connectedVerses: ConnectedVerse[];
}

export interface RevelationContext {
  type: 'Meccan' | 'Medinan';
  period: string;        // Brief description of when/why
  themes: string[];      // Key themes of the surah
}

export interface ConnectedVerse {
  surah: number;
  ayah: number;
  surahName: string;
  text: string;          // Brief snippet or translation
  connection: string;    // Why they're connected
  theme: string;
}

export interface ReflectionCard {
  reflection: string;    // 1-2 sentence spiritual reflection
  generatedAt: number;
  source: 'sheikh' | 'static';
}

// ─── Main API ────────────────────────────────────────────────────────

/**
 * Get tafsir with in-memory caching
 */
export async function getTafsir(
  surahNumber: number,
  ayahNumber: number,
  edition: number = 169 // Ibn Kathir
): Promise<TafsirContent | null> {
  const key = cacheKey(surahNumber, ayahNumber, String(edition));
  
  if (tafsirCache.has(key)) {
    return tafsirCache.get(key)!;
  }
  
  const result = await fetchTafsir(surahNumber, ayahNumber, edition);
  if (result) {
    tafsirCache.set(key, result);
  }
  return result;
}

/**
 * Get English translation for a verse
 */
export function getTranslation(surahNumber: number, ayahNumber: number): string {
  const key = cacheKey(surahNumber, ayahNumber);
  if (translationCache.has(key)) return translationCache.get(key)!;
  
  const ayah = getAyah(surahNumber, ayahNumber);
  const translation = ayah?.text.translations.sahih || '';
  translationCache.set(key, translation);
  return translation;
}

/**
 * Get revelation context for a surah
 */
export function getRevelationContext(surahNumber: number): RevelationContext {
  const meta = getSurahMeta(surahNumber);
  const type = meta?.revelationType || 'Meccan';
  const context = REVELATION_CONTEXTS[surahNumber];
  
  return {
    type,
    period: context?.period || (type === 'Meccan' 
      ? 'Revealed in Makkah before the Hijrah, focusing on faith foundations.' 
      : 'Revealed in Madinah after the Hijrah, addressing community affairs.'),
    themes: context?.themes || [],
  };
}

/**
 * Get connected/related verses for a given ayah
 */
export function getConnectedVerses(surahNumber: number, ayahNumber: number): ConnectedVerse[] {
  const key = `${surahNumber}:${ayahNumber}`;
  
  // Check hardcoded connections first
  if (VERSE_CONNECTIONS[key]) {
    return VERSE_CONNECTIONS[key];
  }
  
  // Fall back to surah-level thematic connections
  const surahConnections = SURAH_THEMATIC_LINKS[surahNumber];
  if (surahConnections) {
    return surahConnections.slice(0, 3);
  }
  
  return [];
}

/**
 * Get full verse context (all sections combined)
 */
export async function getVerseContext(
  surahNumber: number,
  ayahNumber: number
): Promise<VerseContextData> {
  const [tafsir] = await Promise.all([
    getTafsir(surahNumber, ayahNumber),
  ]);
  
  return {
    surah: surahNumber,
    ayah: ayahNumber,
    meaning: getTranslation(surahNumber, ayahNumber),
    tafsir,
    revelationContext: getRevelationContext(surahNumber),
    connectedVerses: getConnectedVerses(surahNumber, ayahNumber),
  };
}

/**
 * Generate a "Why This Matters" reflection card via Sheikh API
 * Caches results to avoid repeated API calls
 */
export async function getReflectionCard(
  surahNumber: number,
  ayahNumber: number,
  translation: string
): Promise<ReflectionCard> {
  const key = cacheKey(surahNumber, ayahNumber, 'reflection');
  
  if (reflectionCache.has(key)) {
    return reflectionCache.get(key)!;
  }
  
  try {
    const response = await fetch('/api/sheikh/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'verse_reflection',
        context: {
          surahNumber,
          ayahNumber,
          translation,
          instruction: 'Give a 1-2 sentence spiritual reflection on this verse. Be brief, warm, and practical. Focus on how this verse can transform the reader\'s daily life. Do not use Arabic transliteration.',
        },
      }),
    });
    
    if (!response.ok) throw new Error('Sheikh API error');
    
    const data = await response.json();
    const card: ReflectionCard = {
      reflection: data.message || data.reflection || getStaticReflection(surahNumber, ayahNumber),
      generatedAt: Date.now(),
      source: 'sheikh',
    };
    
    reflectionCache.set(key, card);
    return card;
  } catch {
    // Fallback to static reflection
    const card: ReflectionCard = {
      reflection: getStaticReflection(surahNumber, ayahNumber),
      generatedAt: Date.now(),
      source: 'static',
    };
    reflectionCache.set(key, card);
    return card;
  }
}

/**
 * Static fallback reflections for common surahs
 */
function getStaticReflection(surah: number, ayah: number): string {
  const reflections: Record<string, string> = {
    '1:1': 'Every journey begins with His name. Starting anything with "Bismillah" transforms ordinary acts into worship.',
    '1:2': 'All praise belongs to Allah — when you truly feel this, gratitude becomes your default state, not something forced.',
    '1:5': 'Recognizing that we need Allah\'s help in everything removes the illusion of self-sufficiency and brings inner peace.',
    '1:6': 'The straight path isn\'t just about avoiding wrong — it\'s about actively seeking the best version of yourself every day.',
    '2:286': 'Allah never burdens a soul beyond its capacity. Whatever you\'re going through right now, you have the strength for it.',
    '3:139': 'Do not lose heart or grieve — if faith is in your heart, you are the upper hand even when the world says otherwise.',
    '94:5': 'With every hardship comes ease — not after, but alongside. Look for the ease hidden within your current struggle.',
    '94:6': 'Allah repeats this promise twice. Ease is not just coming — it\'s already here, woven into the difficulty itself.',
    '112:1': 'Allah is One. This simple truth, deeply understood, frees you from dependence on anything and anyone besides Him.',
    '113:1': 'Seeking refuge in Allah acknowledges that we are vulnerable — and that\'s not weakness, it\'s wisdom.',
    '114:1': 'The final refuge is always Allah. No anxiety, fear, or whisper can reach you when you return to Him.',
  };
  
  const key = `${surah}:${ayah}`;
  if (reflections[key]) return reflections[key];
  
  // Generic reflections based on surah themes
  const genericReflections = [
    'Every verse of the Quran was chosen for you to hear in this moment. What is Allah saying to your heart right now?',
    'The Quran speaks to every generation as if it were revealed today. This verse has something to teach you right now.',
    'Memorizing this verse means carrying a piece of divine guidance in your heart wherever you go.',
    'When you memorize Allah\'s words, you become a walking repository of His guidance — what a beautiful honor.',
    'This verse has been recited by millions before you. You\'re now part of an unbroken chain of hearts connected to the Quran.',
  ];
  
  return genericReflections[(surah + ayah) % genericReflections.length];
}

// ─── Revelation Contexts ─────────────────────────────────────────────

const REVELATION_CONTEXTS: Record<number, { period: string; themes: string[] }> = {
  1: { period: 'One of the earliest revelations. The Prophet ﷺ was taught this as the perfect prayer — a conversation between servant and Lord.', themes: ['Prayer', 'Guidance', 'Worship', 'Mercy'] },
  2: { period: 'Revealed in Madinah over several years. The longest surah, serving as a comprehensive guide for the new Muslim community.', themes: ['Law', 'Faith', 'History', 'Community'] },
  36: { period: 'Revealed in Makkah. Called "the Heart of the Quran" by the Prophet ﷺ for its powerful message about resurrection and divine signs.', themes: ['Resurrection', 'Prophethood', 'Divine Signs'] },
  55: { period: 'Revealed in Madinah (some say Makkah). Known as "The Bride of the Quran" for its poetic beauty and recurring refrain.', themes: ['Blessings', 'Gratitude', 'Paradise', 'Divine Favors'] },
  67: { period: 'Revealed in Makkah. The Prophet ﷺ said it intercedes for its reader until he is forgiven.', themes: ['Divine Power', 'Reflection', 'Accountability'] },
  78: { period: 'Early Meccan revelation. Opens Juz Amma with a powerful description of the Day of Judgment.', themes: ['Day of Judgment', 'Divine Power', 'Accountability'] },
  87: { period: 'Early Meccan revelation. The Prophet ﷺ loved reciting this in Friday and Eid prayers.', themes: ['Divine Glory', 'Reminder', 'Purification'] },
  88: { period: 'Early Meccan revelation, often paired with Al-A\'laa in prayers. Vivid imagery of the Hereafter.', themes: ['Hereafter', 'Warning', 'Reflection'] },
  89: { period: 'Early Meccan revelation. Addresses the soul\'s journey and Allah\'s tests through prosperity and hardship.', themes: ['Tests', 'Gratitude', 'Justice', 'The Soul'] },
  90: { period: 'Meccan revelation emphasizing the moral struggle of human existence in this sacred city.', themes: ['Moral Struggle', 'Compassion', 'Good Deeds'] },
  91: { period: 'Meccan revelation. Uses powerful oaths by natural phenomena to emphasize the soul\'s potential.', themes: ['Soul Purification', 'Nature', 'Success'] },
  92: { period: 'Meccan revelation contrasting the paths of generosity and miserliness.', themes: ['Generosity', 'Paths of Life', 'Divine Guidance'] },
  93: { period: 'Revealed after a pause in revelation when the Prophet ﷺ was anxious. A deeply personal, comforting surah.', themes: ['Comfort', 'Divine Care', 'Gratitude'] },
  94: { period: 'Closely linked to Ad-Duha. Revealed to comfort the Prophet ﷺ, reminding him of ease after hardship.', themes: ['Relief', 'Hope', 'Ease'] },
  95: { period: 'Meccan revelation affirming human dignity and the consequences of moral decline.', themes: ['Human Dignity', 'Faith', 'Moral Excellence'] },
  96: { period: 'The first revelation! These were the first words Gabriel spoke to the Prophet ﷺ in the Cave of Hira.', themes: ['Knowledge', 'Creation', 'First Revelation'] },
  97: { period: 'Meccan revelation describing the magnificent Night of Power when the Quran began to descend.', themes: ['Laylat al-Qadr', 'Angels', 'Peace'] },
  99: { period: 'One of the shortest yet most powerful surahs about the Day of Judgment\'s cosmic events.', themes: ['Day of Judgment', 'Accountability', 'Deeds'] },
  100: { period: 'Meccan revelation using the imagery of charging warhorses to describe human ingratitude.', themes: ['Ingratitude', 'Materialism', 'Judgment'] },
  101: { period: 'Meccan revelation with vivid imagery of the striking calamity of the Last Day.', themes: ['Day of Judgment', 'Scales of Deeds'] },
  102: { period: 'Meccan revelation warning against being distracted by worldly competition and accumulation.', themes: ['Materialism', 'Death', 'Accountability'] },
  103: { period: 'Imam Shafi\'i said if only this surah was revealed, it would be sufficient guidance for mankind.', themes: ['Time', 'Faith', 'Good Deeds', 'Patience'] },
  104: { period: 'Meccan revelation warning against backbiting, slander, and hoarding wealth.', themes: ['Backbiting', 'Wealth', 'Hellfire'] },
  105: { period: 'Describes the historic event of Abraha\'s army and the miraculous protection of the Ka\'bah.', themes: ['Divine Protection', 'History', 'Makkah'] },
  106: { period: 'Directly connected to Al-Fil. Reminds Quraysh to be grateful for their trade and security.', themes: ['Gratitude', 'Security', 'Worship'] },
  107: { period: 'Meccan revelation defining true religion as caring for orphans and the needy, not empty ritual.', themes: ['Social Justice', 'Sincerity', 'Prayer'] },
  108: { period: 'Revealed to comfort the Prophet ﷺ after his son\'s death and his enemies\' mockery.', themes: ['Abundance', 'Prayer', 'Sacrifice'] },
  109: { period: 'Clear declaration of religious freedom and the finality of the Prophet\'s ﷺ message.', themes: ['Monotheism', 'Religious Freedom', 'Identity'] },
  110: { period: 'One of the last surahs revealed, signaling the approach of the Prophet\'s ﷺ passing.', themes: ['Victory', 'Forgiveness', 'Completion'] },
  111: { period: 'Revealed in Makkah about Abu Lahab, the Prophet\'s ﷺ uncle who fiercely opposed Islam.', themes: ['Opposition to Truth', 'Consequences'] },
  112: { period: 'The Prophet ﷺ said this surah equals one-third of the Quran in meaning.', themes: ['Tawheed', 'God\'s Nature', 'Pure Monotheism'] },
  113: { period: 'One of the two "protection" surahs (Mu\'awwidhatain) the Prophet ﷺ recited for protection.', themes: ['Protection', 'Evil', 'Refuge'] },
  114: { period: 'The final surah, seeking protection from the whisperer who retreats — a fitting end to divine guidance.', themes: ['Protection', 'Whispers', 'Refuge in Allah'] },
};

// ─── Verse Connections (Hardcoded for Juz Amma + key verses) ─────────

const VERSE_CONNECTIONS: Record<string, ConnectedVerse[]> = {
  '1:5': [
    { surah: 51, ayah: 56, surahName: 'Adh-Dhariyat', text: 'I did not create jinn and mankind except to worship Me.', connection: 'The purpose of worship mentioned in Al-Fatiha', theme: 'Worship' },
    { surah: 6, ayah: 162, surahName: 'Al-An\'am', text: 'My prayer, sacrifice, life, and death are for Allah.', connection: 'Total devotion to Allah alone', theme: 'Worship' },
  ],
  '1:6': [
    { surah: 2, ayah: 2, surahName: 'Al-Baqarah', text: 'This is the Book in which there is no doubt, guidance for the God-conscious.', connection: 'The guidance asked for in Al-Fatiha is answered in Al-Baqarah', theme: 'Guidance' },
    { surah: 6, ayah: 153, surahName: 'Al-An\'am', text: 'This is My straight path, so follow it...', connection: 'The straight path defined', theme: 'Guidance' },
  ],
  '2:255': [
    { surah: 112, ayah: 1, surahName: 'Al-Ikhlas', text: 'Say: He is Allah, the One.', connection: 'Both describe Allah\'s absolute nature', theme: 'Tawheed' },
    { surah: 59, ayah: 23, surahName: 'Al-Hashr', text: 'He is Allah, other than whom there is no deity...', connection: 'Comprehensive description of Allah\'s attributes', theme: 'Tawheed' },
  ],
  '2:286': [
    { surah: 65, ayah: 7, surahName: 'At-Talaq', text: 'Allah does not burden a soul beyond what He has given it.', connection: 'Divine mercy in testing — parallel promise', theme: 'Mercy' },
    { surah: 94, ayah: 5, surahName: 'Ash-Sharh', text: 'Indeed, with hardship comes ease.', connection: 'Hardship always paired with relief', theme: 'Ease' },
  ],
  // Juz Amma connections
  '78:1': [
    { surah: 56, ayah: 1, surahName: 'Al-Waqi\'ah', text: 'When the Occurrence occurs...', connection: 'Both open with the overwhelming Day of Judgment', theme: 'Day of Judgment' },
  ],
  '87:1': [
    { surah: 56, ayah: 96, surahName: 'Al-Waqi\'ah', text: 'So exalt the name of your Lord, the Most Great.', connection: 'Glorifying Allah\'s name', theme: 'Glorification' },
    { surah: 69, ayah: 52, surahName: 'Al-Haqqah', text: 'So exalt the name of your Lord, the Most Great.', connection: 'Same command repeated — emphasizing its importance', theme: 'Glorification' },
  ],
  '93:1': [
    { surah: 94, ayah: 1, surahName: 'Ash-Sharh', text: 'Did We not expand for you your breast?', connection: 'Both console the Prophet ﷺ — often recited together', theme: 'Comfort' },
  ],
  '93:3': [
    { surah: 94, ayah: 5, surahName: 'Ash-Sharh', text: 'Indeed, with hardship comes ease.', connection: 'Allah has not abandoned you, and ease will come', theme: 'Hope' },
  ],
  '94:5': [
    { surah: 94, ayah: 6, surahName: 'Ash-Sharh', text: 'Indeed, with hardship comes ease.', connection: 'Repeated twice for emphasis — ease is guaranteed', theme: 'Ease' },
    { surah: 2, ayah: 286, surahName: 'Al-Baqarah', text: 'Allah does not burden a soul beyond its capacity.', connection: 'Allah\'s promise of manageable tests', theme: 'Mercy' },
    { surah: 65, ayah: 7, surahName: 'At-Talaq', text: 'After hardship, Allah will bring ease.', connection: 'The pattern of difficulty followed by relief throughout the Quran', theme: 'Ease' },
  ],
  '96:1': [
    { surah: 68, ayah: 1, surahName: 'Al-Qalam', text: 'By the pen and what they inscribe.', connection: 'First revelation (Read) linked to the Pen — knowledge is central to Islam', theme: 'Knowledge' },
    { surah: 20, ayah: 114, surahName: 'Ta-Ha', text: 'Say: My Lord, increase me in knowledge.', connection: 'The first command was to read — seeking knowledge is worship', theme: 'Knowledge' },
  ],
  '97:1': [
    { surah: 44, ayah: 3, surahName: 'Ad-Dukhan', text: 'Indeed, We sent it down during a blessed night.', connection: 'Both describe the night the Quran was revealed', theme: 'Revelation' },
    { surah: 2, ayah: 185, surahName: 'Al-Baqarah', text: 'The month of Ramadan in which the Quran was revealed.', connection: 'Laylat al-Qadr is in Ramadan', theme: 'Ramadan' },
  ],
  '103:1': [
    { surah: 90, ayah: 4, surahName: 'Al-Balad', text: 'We have certainly created man in hardship.', connection: 'Time is running out, and life is struggle — so act wisely', theme: 'Human Condition' },
  ],
  '103:3': [
    { surah: 90, ayah: 17, surahName: 'Al-Balad', text: '...those who believe and advise each other to patience and compassion.', connection: 'Nearly identical formula for salvation', theme: 'Salvation' },
  ],
  '108:1': [
    { surah: 93, ayah: 11, surahName: 'Ad-Duha', text: 'And as for the favor of your Lord, proclaim it.', connection: 'Gratitude for Allah\'s abundant gifts', theme: 'Gratitude' },
  ],
  '112:1': [
    { surah: 2, ayah: 255, surahName: 'Al-Baqarah', text: 'Allah — there is no deity except Him, the Ever-Living, the Sustainer.', connection: 'The most comprehensive verses on Tawheed', theme: 'Tawheed' },
    { surah: 59, ayah: 22, surahName: 'Al-Hashr', text: 'He is Allah, other than whom there is no deity...', connection: 'Allah\'s names and attributes expanded', theme: 'Tawheed' },
  ],
  '113:1': [
    { surah: 114, ayah: 1, surahName: 'An-Nas', text: 'Say: I seek refuge in the Lord of mankind.', connection: 'The two protection surahs — always recited together', theme: 'Protection' },
  ],
  '114:1': [
    { surah: 113, ayah: 1, surahName: 'Al-Falaq', text: 'Say: I seek refuge in the Lord of daybreak.', connection: 'The two protection surahs — always recited together', theme: 'Protection' },
  ],
};

// ─── Surah-Level Thematic Links (fallback) ───────────────────────────

const SURAH_THEMATIC_LINKS: Record<number, ConnectedVerse[]> = {
  78: [
    { surah: 56, ayah: 1, surahName: 'Al-Waqi\'ah', text: 'When the Occurrence occurs...', connection: 'Parallel description of the Day of Judgment', theme: 'Day of Judgment' },
    { surah: 81, ayah: 1, surahName: 'At-Takwir', text: 'When the sun is wrapped up...', connection: 'Cosmic signs of the Last Day', theme: 'Day of Judgment' },
  ],
  87: [
    { surah: 88, ayah: 1, surahName: 'Al-Ghashiyah', text: 'Has there reached you the report of the Overwhelming?', connection: 'Often paired in Jumu\'ah and Eid prayers', theme: 'Paired Surahs' },
  ],
  93: [
    { surah: 94, ayah: 1, surahName: 'Ash-Sharh', text: 'Did We not expand for you your breast?', connection: 'Continuation of comfort to the Prophet ﷺ', theme: 'Comfort' },
  ],
  105: [
    { surah: 106, ayah: 1, surahName: 'Quraysh', text: 'For the accustomed security of Quraysh.', connection: 'Directly linked — Al-Fil explains why Quraysh should be grateful', theme: 'Gratitude' },
  ],
  113: [
    { surah: 114, ayah: 1, surahName: 'An-Nas', text: 'Say: I seek refuge in the Lord of mankind.', connection: 'The Mu\'awwidhatain — twin surahs of protection', theme: 'Protection' },
  ],
  114: [
    { surah: 113, ayah: 1, surahName: 'Al-Falaq', text: 'Say: I seek refuge in the Lord of daybreak.', connection: 'The Mu\'awwidhatain — twin surahs of protection', theme: 'Protection' },
  ],
};

export { REVELATION_CONTEXTS, VERSE_CONNECTIONS, SURAH_THEMATIC_LINKS };
