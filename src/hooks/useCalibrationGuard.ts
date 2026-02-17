'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isCalibrationComplete } from '@/lib/user-profile-sync';

/**
 * Hook that redirects uncalibrated users to /onboarding/welcome.
 * Returns { isChecking: true } while verifying, { isChecking: false } once confirmed calibrated.
 */
export function useCalibrationGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const calibrated = await isCalibrationComplete();
      if (!calibrated) {
        router.replace('/onboarding/welcome');
        return;
      }
      setIsChecking(false);
    }
    check();
  }, [router]);

  return { isChecking };
}
