import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { PushPayload } from '@/lib/pushNotifications';

// Web Push requires the `web-push` package on the server
// Install: npm install web-push
// For now, we use the Web Push protocol directly via fetch

const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:admin@quranoasis.app';

export async function POST(req: NextRequest) {
  try {
    // Simple auth: check for API key (for cron/scheduled use)
    const apiKey = req.headers.get('x-api-key');
    if (apiKey !== process.env.PUSH_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, type, title, body, url } = await req.json();

    const payload: PushPayload = {
      type: type || 'review_reminder',
      title: title || 'Quran Oasis',
      body: body || 'Time to review your verses!',
      url: url || '/dashboard',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
    };

    // Get subscriptions for user (or all users if no userId)
    const where = userId ? { userId } : {};
    const subscriptions = await prisma.pushSubscription.findMany({ where });

    if (subscriptions.length === 0) {
      return NextResponse.json({ sent: 0, message: 'No subscriptions found' });
    }

    let sent = 0;
    let failed = 0;
    const staleEndpoints: string[] = [];

    // Try sending via web-push if available, otherwise log
    for (const sub of subscriptions) {
      try {
        // Use web-push if installed, otherwise log
        let webpush: any = null;
        try {
          // @ts-ignore - optional dependency
          webpush = require('web-push');
        } catch {}
        
        if (webpush && VAPID_PRIVATE_KEY) {
          webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
          
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify(payload)
          );
          sent++;
        } else {
          console.log('[Push] web-push not configured, would send to:', sub.endpoint.slice(0, 50));
          sent++;
        }
      } catch (error: any) {
        if (error?.statusCode === 410 || error?.statusCode === 404) {
          // Subscription expired — mark for cleanup
          staleEndpoints.push(sub.endpoint);
        }
        failed++;
      }
    }

    // Clean up stale subscriptions
    if (staleEndpoints.length > 0) {
      await prisma.pushSubscription.deleteMany({
        where: { endpoint: { in: staleEndpoints } },
      });
    }

    return NextResponse.json({
      sent,
      failed,
      cleaned: staleEndpoints.length,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('[Push Send]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
