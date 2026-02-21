import { redirect } from 'next/navigation';

// Consolidated: onboarding entry point is /onboarding
export default function WelcomePage() {
  redirect('/onboarding');
}
