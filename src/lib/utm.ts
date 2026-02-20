/**
 * UTM Tracking for Quran Oasis
 * Captures ?ref=youtube (and standard UTM params) on first visit,
 * stores in localStorage, and exposes for analytics/signup attribution.
 */

const UTM_STORAGE_KEY = 'qo_utm';
const REFERRAL_STORAGE_KEY = 'qo_ref';

export interface UTMParams {
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landed_at?: string;
  landing_page?: string;
}

/**
 * Call this on app mount (client-side only).
 * Captures UTM params from URL and stores them.
 * Only stores on first visit (doesn't overwrite existing attribution).
 */
export function captureUTM(): UTMParams | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  const utm_source = params.get('utm_source');

  // Only capture if there's attribution data in the URL
  if (!ref && !utm_source) return null;

  // Don't overwrite existing attribution (first-touch model)
  const existing = getStoredUTM();
  if (existing) return existing;

  const utm: UTMParams = {
    ref: ref || undefined,
    utm_source: utm_source || undefined,
    utm_medium: params.get('utm_medium') || undefined,
    utm_campaign: params.get('utm_campaign') || undefined,
    utm_content: params.get('utm_content') || undefined,
    utm_term: params.get('utm_term') || undefined,
    landed_at: new Date().toISOString(),
    landing_page: window.location.pathname,
  };

  // Clean undefined values
  const clean = Object.fromEntries(
    Object.entries(utm).filter(([, v]) => v !== undefined)
  );

  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(clean));
    if (ref) localStorage.setItem(REFERRAL_STORAGE_KEY, ref);
  } catch {
    // localStorage unavailable
  }

  return clean as UTMParams;
}

/**
 * Get stored UTM params (for signup attribution, analytics, etc.)
 */
export function getStoredUTM(): UTMParams | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(UTM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Get the simple ref value (e.g., "youtube")
 */
export function getReferralSource(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(REFERRAL_STORAGE_KEY);
  } catch {
    return null;
  }
}
