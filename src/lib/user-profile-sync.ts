/**
 * User Profile Sync
 * 
 * Handles persisting user profile (calibration level, preferences)
 * to localStorage with optional Clerk metadata sync.
 */

const PROFILE_KEY = 'qo_user_profile';
const CALIBRATION_KEY = 'qo_calibration_complete';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface UserProfile {
  level?: UserLevel;
  calibratedAt?: string;
  preferences?: {
    reciter?: string;
    fontSize?: string;
  };
}

export async function loadUserProfile(): Promise<UserProfile | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: Partial<UserProfile>): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const existing = await loadUserProfile();
    const merged = { ...existing, ...profile };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(merged));
  } catch {
    // Storage error
  }
}

export async function isCalibrationComplete(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  try {
    const profile = await loadUserProfile();
    if (profile?.level && profile?.calibratedAt) return true;
    
    // Also check direct flag
    return localStorage.getItem(CALIBRATION_KEY) === 'true';
  } catch {
    return false;
  }
}

export async function markCalibrationComplete(level: UserLevel): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    await saveUserProfile({
      level,
      calibratedAt: new Date().toISOString(),
    });
    localStorage.setItem(CALIBRATION_KEY, 'true');
  } catch {
    // Storage error
  }
}

export async function clearUserProfile(): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(CALIBRATION_KEY);
  } catch {
    // Storage error
  }
}
