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
export const AVAILABLE_TAFSIRS: TafsirInfo[] = [
  { id: 169, name: "Tafsir Ibn Kathir (Abridged)", authorName: "Ibn Kathir", slug: "en-tafisr-ibn-kathir", languageCode: "en" },
  { id: 168, name: "Tafsir al-Jalalayn", authorName: "Jalal ad-Din al-Mahalli & Jalal ad-Din as-Suyuti", slug: "tafsir-al-jalalayn", languageCode: "en" },
  { id: 171, name: "Maarif-ul-Quran", authorName: "Mufti Muhammad Shafi", slug: "en-maarif-ul-quran", languageCode: "en" },
  { id: 166, name: "Tafheem-ul-Quran", authorName: "Sayyid Abul Ala Maududi", slug: "tafheem-ul-quran", languageCode: "en" },
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
 */
export function getReflectionPrompts(surah: number, ayah: number): string[] {
  const genericPrompts = [
    "What is Allah teaching me in this verse?",
    "How can I apply this to my life today?",
    "What emotions does this verse evoke?",
    "Is there a command or prohibition I should act on?",
    "What does this reveal about Allah's attributes?",
  ];
  
  // Could add surah-specific prompts in the future
  return genericPrompts;
}
