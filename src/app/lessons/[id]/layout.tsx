import { Metadata } from 'next';
import { SITE_URL } from '@/lib/seo';

// Map lesson IDs to their metadata
const lessonMeta: Record<string, { title: string; description: string }> = {
  'lesson-1': {
    title: 'The Arabic Alphabet - Part 1',
    description: 'Learn your first 7 Arabic letters: Alif, Ba, Ta, Tha, Jeem, Ha, Kha. Start your Quran reading journey.',
  },
  'lesson-2': {
    title: 'The Arabic Alphabet - Part 2',
    description: 'Continue learning Arabic letters: Dal, Dhal, Ra, Zay, Seen, Sheen, Sad.',
  },
  'lesson-3': {
    title: 'The Arabic Alphabet - Part 3',
    description: 'Master the remaining Arabic letters and complete your alphabet knowledge.',
  },
  'lesson-4': {
    title: 'Short Vowels (Harakat)',
    description: 'Learn Fatha, Kasra, and Damma - the essential vowel marks for reading Arabic.',
  },
  'lesson-5': {
    title: 'Letter Connections',
    description: 'Understand how Arabic letters connect to form words and sentences.',
  },
  // Add more lessons as needed
};

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const lesson = lessonMeta[id] || {
    title: `Lesson ${id.replace('lesson-', '')}`,
    description: 'Learn Quran memorization with structured, AI-powered lessons.',
  };

  return {
    title: lesson.title,
    description: lesson.description,
    openGraph: {
      title: `${lesson.title} | HIFZ`,
      description: lesson.description,
      url: `${SITE_URL}/lessons/${id}`,
      type: 'article',
    },
    twitter: {
      title: `${lesson.title} | HIFZ`,
      description: lesson.description,
    },
    alternates: {
      canonical: `${SITE_URL}/lessons/${id}`,
    },
  };
}

export default function LessonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
