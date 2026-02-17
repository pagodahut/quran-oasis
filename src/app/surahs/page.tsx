import { redirect } from 'next/navigation';

export default function SurahsRedirect() {
  redirect('/mushaf?view=explore');
}
