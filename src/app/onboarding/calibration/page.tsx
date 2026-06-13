'use client';

import { useRouter } from 'next/navigation';
import OnboardingCalibration from '@/components/OnboardingCalibration';
import { useSheikh } from '@/contexts/SheikhContext';
import { markCalibrationComplete } from '@/lib/user-profile-sync';
import type { CalibrationAssessment } from '@/hooks/useCalibration';

export default function CalibrationPage() {
  const router = useRouter();
  const { setUserLevel } = useSheikh();

  const handleComplete = async (assessment: CalibrationAssessment) => {
    setUserLevel(assessment.level);
    await markCalibrationComplete(assessment.level);
    router.push('/dashboard');
  };

  const handleSkip = async () => {
    // Mark calibration complete on skip too — otherwise the dashboard guard
    // bounces the user straight back here, making "Skip" a dead loop.
    setUserLevel('beginner');
    await markCalibrationComplete('beginner');
    router.push('/dashboard');
  };

  return (
    <OnboardingCalibration
      onComplete={handleComplete}
      onSkip={handleSkip}
    />
  );
}
