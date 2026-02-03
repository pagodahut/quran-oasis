/**
 * Tafsir Service
 * Fetches tafsir (commentary) from Quran.com API
 */

export interface TafsirInfo {
  id: number;
  name: string;
  authorName: string;
  slug: string;
  languageCode: string;
}

// Available English tafsirs from Quran.com
// Note: IDs verified against https://api.quran.com/api/v4/resources/tafsirs
export const AVAILABLE_TAFSIRS: TafsirInfo[] = [
  { id: 169, name: "Ibn Kathir (Abridged)", authorName: "Ibn Kathir", slug: "en-tafisr-ibn-kathir", languageCode: "en" },
  { id: 168, name: "Ma'arif al-Qur'an", authorName: "Mufti Shafi", slug: "en-tafsir-maarif-ul-quran", languageCode: "en" },
  { id: 817, name: "Tazkirul Quran", authorName: "Wahiduddin Khan", slug: "tazkirul-quran-en", languageCode: "en" },
];

export interface TafsirContent {
  verseKey: string;
  text: string;
  resourceName: string;
  resourceId: number;
}

export interface TafsirResponse {
  tafsirs: TafsirContent[];
}

/**
 * Fetch tafsir for a specific verse from Quran.com API
 */
export async function fetchTafsir(
  surah: number, 
  ayah: number, 
  tafsirId: number = 169 // Default to Ibn Kathir
): Promise<TafsirContent | null> {
  try {
    const response = await fetch(
      `https://api.quran.com/api/v4/tafsirs/${tafsirId}/by_ayah/${surah}:${ayah}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 86400 } // Cache for 24 hours
      }
    );

    if (!response.ok) {
      console.error(`Tafsir API error: ${response.status}`);
      return null;
    }

    const data = await response.json();
    
    if (data.tafsir) {
      return {
        verseKey: `${surah}:${ayah}`,
        text: cleanHtml(data.tafsir.text),
        resourceName: data.tafsir.resource_name || AVAILABLE_TAFSIRS.find(t => t.id === tafsirId)?.name || 'Tafsir',
        resourceId: tafsirId,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching tafsir:', error);
    return null;
  }
}

/**
 * Fetch multiple tafsirs for comparison
 */
export async function fetchMultipleTafsirs(
  surah: number, 
  ayah: number,
  tafsirIds: number[] = [169, 168] // Ibn Kathir and Jalalayn
): Promise<TafsirContent[]> {
  const results = await Promise.all(
    tafsirIds.map(id => fetchTafsir(surah, ayah, id))
  );
  
  return results.filter((t): t is TafsirContent => t !== null);
}

/**
 * Clean HTML from tafsir text
 */
function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Get word-by-word analysis URL
 */
export function getWordByWordUrl(surah: number, ayah: number): string {
  return `https://corpus.quran.com/wordbyword.jsp?chapter=${surah}&verse=${ayah}`;
}

/**
 * Get Quran.com URL for a verse
 */
export function getQuranComUrl(surah: number, ayah: number): string {
  return `https://quran.com/${surah}/${ayah}`;
}

/**
 * Verse reflection prompts for personal tadabbur (contemplation)
 * Varies based on surah and ayah for more personalized reflection
 */
export function getReflectionPrompts(surah: number, ayah: number): string[] {
  // Surah-specific reflection prompts
  const surahPrompts: Record<number, string[]> = {
    1: [ // Al-Fatiha
      "This surah is a conversation with Allah - what are you asking Him for?",
      "You recite this in every prayer - do you truly feel its meaning?",
      "Why does Allah teach us to say 'Guide us' in plural?",
    ],
    2: [ // Al-Baqarah
      "How does this verse distinguish the God-conscious (muttaqeen)?",
      "What guidance does Allah give for navigating this life?",
      "This is the longest surah - what comprehensive message is being built?",
    ],
    3: [ // Al Imran
      "How does this verse strengthen your faith when facing challenges?",
      "What lesson from previous nations applies to you today?",
    ],
    18: [ // Al-Kahf (Friday surah)
      "This surah protects from Dajjal - how does this verse guard your faith?",
      "What trial (fitna) does this verse help you navigate?",
      "Why is this surah recommended for Fridays?",
    ],
    36: [ // Ya-Sin
      "Called 'the heart of the Quran' - what touches your heart here?",
      "What does this verse reveal about resurrection?",
    ],
    55: [ // Ar-Rahman
      "'Which favor will you deny?' - What blessings come to mind?",
      "How does repetition in this surah affect your contemplation?",
    ],
    67: [ // Al-Mulk (protection from grave)
      "This surah protects in the grave - how does this verse prepare you?",
      "What does this reveal about Allah's dominion (mulk)?",
    ],
    112: [ // Al-Ikhlas
      "This surah equals 1/3 of the Quran - what does it teach about tawheed?",
      "How does knowing Allah is 'As-Samad' change how you make dua?",
    ],
  };

  // Generic prompts that rotate based on ayah number for variety
  const genericPromptSets = [
    [
      "What is Allah teaching me in this verse?",
      "How can I apply this to my life today?",
      "What emotions does this verse evoke?",
    ],
    [
      "Is there a command or prohibition I should act on?",
      "What does this reveal about Allah's attributes?",
      "How would my day change if I truly lived by this verse?",
    ],
    [
      "What connection does this verse have to other surahs?",
      "If I only had this verse to guide me, what would I do differently?",
      "How does this verse increase my gratitude or awe?",
    ],
    [
      "What comfort or warning does Allah give here?",
      "How does this verse relate to the Prophet's ﷺ example?",
      "What would I tell someone struggling if I shared this verse?",
    ],
  ];

  // Get surah-specific prompts if available
  const surahSpecific = surahPrompts[surah] || [];
  
  // Rotate generic prompts based on ayah number for variety
  const genericSet = genericPromptSets[ayah % genericPromptSets.length];
  
  // Combine: 1-2 surah-specific + generic prompts
  if (surahSpecific.length > 0) {
    const specific = surahSpecific.slice(0, Math.min(2, surahSpecific.length));
    return [...specific, ...genericSet.slice(0, 3 - specific.length)];
  }
  
  return genericSet;
}
