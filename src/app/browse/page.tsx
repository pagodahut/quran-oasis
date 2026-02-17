import { redirect } from 'next/navigation';

export default function BrowseRedirect() {
  redirect('/mushaf?view=explore');
}
