/**
 * Lightweight in-memory rate limiter for API routes.
 *
 * A token-bucket-ish fixed-window limiter keyed by user (or IP). This guards
 * against runaway cost on the AI routes — the previous limit was enforced only
 * in the browser (localStorage), which any user could bypass.
 *
 * Note: in-memory state is per-server-instance. For a single long-lived Node
 * server this is effective. On highly-distributed serverless it limits per
 * instance; for hard global guarantees, back this with Redis/Upstash. It is a
 * meaningful improvement over zero server-side limiting either way.
 */

interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

// Periodic cleanup so the map can't grow unbounded.
let lastSweep = Date.now();
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, w] of buckets) {
    if (w.resetAt < now) buckets.delete(key);
  }
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  resetAt: number;
  retryAfterSec: number;
}

/**
 * @param key      unique caller identity (userId preferred, else IP)
 * @param limit    max requests per window
 * @param windowMs window length in ms
 */
export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  sweep(now);

  let w = buckets.get(key);
  if (!w || w.resetAt < now) {
    w = { count: 0, resetAt: now + windowMs };
    buckets.set(key, w);
  }

  w.count += 1;
  const ok = w.count <= limit;
  return {
    ok,
    remaining: Math.max(0, limit - w.count),
    resetAt: w.resetAt,
    retryAfterSec: Math.max(1, Math.ceil((w.resetAt - now) / 1000)),
  };
}

/** Best-effort client identifier from request headers. */
export function clientKey(req: Request, userId?: string | null): string {
  if (userId) return `u:${userId}`;
  const fwd = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const ip = fwd || req.headers.get('x-real-ip') || 'unknown';
  return `ip:${ip}`;
}
