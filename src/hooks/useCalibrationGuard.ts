'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isCalibrationComplete } from '@/lib/user-profile-sync';

/**
 * Hook that redirects uncalibrated users straight to /onboarding.
 * Returns { isChecking: true } while verifying, { isChecking: false } once confirmed calibrated.
 */
export function useCalibrationGuard() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const calibrated = await isCalibrationComplete();
      if (!calibrated) {
        // Go directly to /onboarding (was /onboarding/welcome → extra redirect hop).
        router.replace('/onboarding');
        return;
      }
      setIsChecking(false);
    }
    check();
  }, [router]);

  return { isChecking };
}
