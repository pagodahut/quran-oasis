'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This page now just redirects to dashboard.
// The old sign-up prompt flow is removed — onboarding ends at /dashboard.
export default function OnboardingCompletePage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem('quranOasis_onboardingComplete', 'true');
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-night-950 flex items-center justify-center">
      <p className="text-night-400">Redirecting to your dashboard...</p>
    </div>
  );
}
