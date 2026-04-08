/**
 * Web Push Notifications for Quran Oasis
 * Handles subscription management and permission requests
 */

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const PERMISSION_PROMPT_KEY = 'qo_push_prompt_visits';
const PERMISSION_DISMISSED_KEY = 'qo_push_dismissed';
const VISITS_BEFORE_PROMPT = 3;

// Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/** Check if push notifications are supported */
export function isPushSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/** Get current permission state */
export function getPermissionState(): NotificationPermission | 'unsupported' {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
}

/** Check if we should gently prompt for permission (after N visits) */
export function shouldPromptForPermission(): boolean {
  if (!isPushSupported()) return false;
  if (Notification.permission !== 'default') return false;

  const dismissed = localStorage.getItem(PERMISSION_DISMISSED_KEY);
  if (dismissed) {
    const dismissedAt = parseInt(dismissed, 10);
    // Don't prompt again for 30 days after dismissal
    if (Date.now() - dismissedAt < 30 * 24 * 60 * 60 * 1000) return false;
  }

  const visits = parseInt(localStorage.getItem(PERMISSION_PROMPT_KEY) || '0', 10);
  return visits >= VISITS_BEFORE_PROMPT;
}

/** Track a visit for the gentle prompt logic */
export function trackVisitForPrompt(): void {
  if (typeof window === 'undefined') return;
  const visits = parseInt(localStorage.getItem(PERMISSION_PROMPT_KEY) || '0', 10);
  localStorage.setItem(PERMISSION_PROMPT_KEY, (visits + 1).toString());
}

/** Dismiss the permission prompt */
export function dismissPermissionPrompt(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PERMISSION_DISMISSED_KEY, Date.now().toString());
}

/** Subscribe to push notifications */
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported() || !VAPID_PUBLIC_KEY) return null;

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisuallyIndicatesRequests: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    } as PushSubscriptionOptionsInit);

    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')!))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth')!))),
        },
      }),
    });

    return subscription;
  } catch (error) {
    console.error('[Push] Subscription failed:', error);
    return null;
  }
}

/** Unsubscribe from push notifications */
export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) return true;

    await fetch('/api/push/subscribe', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });

    await subscription.unsubscribe();
    return true;
  } catch (error) {
    console.error('[Push] Unsubscribe failed:', error);
    return false;
  }
}

/** Check if currently subscribed */
export async function isSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false;
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch {
    return false;
  }
}

/** Notification types for the app */
export type NotificationType = 'review_reminder' | 'streak_risk' | 'weekly_summary';

export interface PushPayload {
  type: NotificationType;
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
}
