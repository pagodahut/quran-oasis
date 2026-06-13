import { NextRequest, NextResponse } from 'next/server';

/**
 * Tarteel Keep-Warm Cron Job
 * 
 * This endpoint should be called every 4 minutes via external cron
 * (e.g., Vercel Cron, GitHub Actions, or Uptime Kuma) to prevent 
 * Modal cold starts on the Tarteel Whisper endpoint.
 * 
 * Usage:
 * - Add to vercel.json cron job with schedule every 4 minutes
 * - Or use external service to ping this endpoint every 4 minutes
 */

const TARTEEL_ENDPOINT = process.env.MODAL_WHISPER_URL || 'https://pagodahut--hifz-whisper-transcribe-api.modal.run';

export async function GET(request: NextRequest) {
  try {
    console.log('[Keep-Warm] Pinging Tarteel endpoint...');
    
    // Send a minimal ping to the health endpoint (no GPU needed)
    const healthUrl = TARTEEL_ENDPOINT.replace('transcribe-api', 'health').replace(/\/+$/, '');
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5s timeout
    
    const startTime = Date.now();
    
    try {
      const response = await fetch(healthUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeout);
      const latency = Date.now() - startTime;
      
      if (response.ok) {
        console.log(`[Keep-Warm] ✅ Health endpoint responding (${latency}ms)`);
        return NextResponse.json({
          success: true,
          method: 'health-endpoint',
          latency,
          warm: true,
        });
      } else {
        console.log(`[Keep-Warm] ⚠️ Health endpoint returned ${response.status}, trying transcribe ping`);
      }
    } catch (healthError) {
      console.log('[Keep-Warm] Health endpoint not available, trying transcribe ping');
    }
    
    // Fallback: minimal POST request to transcribe endpoint
    const controller2 = new AbortController();
    const timeout2 = setTimeout(() => controller2.abort(), 8000); // 8s timeout for GPU warmup
    
    const response = await fetch(TARTEEL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        audio_base64: 'keep_warm_ping', // Special marker for keep-warm
        keep_warm: true 
      }),
      signal: controller2.signal,
    });
    
    clearTimeout(timeout2);
    const latency = Date.now() - startTime;
    
    if (response.status < 500) {
      // Any non-5xx response means the service is up (even if it rejects our ping)
      console.log(`[Keep-Warm] ✅ Transcribe endpoint responding (${latency}ms, status: ${response.status})`);
      return NextResponse.json({
        success: true,
        method: 'transcribe-ping',
        latency,
        status: response.status,
        warm: true,
      });
    } else {
      console.log(`[Keep-Warm] ❌ Transcribe endpoint error ${response.status} (${latency}ms)`);
      return NextResponse.json({
        success: false,
        method: 'transcribe-ping',
        error: `HTTP ${response.status}`,
        latency,
        warm: false,
      }, { status: 503 });
    }
    
  } catch (error) {
    console.error('[Keep-Warm] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Keep-warm check failed',
      warm: false,
    }, { status: 503 });
  }
}

// Allow POST for external cron services that prefer POST
export const POST = GET;