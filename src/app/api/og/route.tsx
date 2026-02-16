import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

/**
 * Social Sharing OG Image Generator
 * 
 * GET /api/og?type=progress&ayahs=42&streak=7&accuracy=92
 * GET /api/og?type=milestone&text=Completed+Juz+Amma
 * GET /api/og?type=quote&text=The+best+of+you+are+those+who+learn+the+Quran+and+teach+it
 * 
 * Returns a 1200x630 PNG image for social media sharing.
 */

export const runtime = 'edge';

const SHEIKH_QUOTES = [
  'Every ayah you memorize is a seed planted in your heart.',
  'The Quran intercedes for the one who recites it.',
  'Consistency over intensity — one ayah daily builds mountains.',
  'Your struggle with an ayah doubles your reward.',
  'The best of you are those who learn the Quran and teach it.',
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type') || 'progress';

  try {
    if (type === 'progress') {
      return generateProgressCard(searchParams);
    } else if (type === 'milestone') {
      return generateMilestoneCard(searchParams);
    } else if (type === 'quote') {
      return generateQuoteCard(searchParams);
    }

    return generateProgressCard(searchParams);
  } catch {
    return new Response('Failed to generate image', { status: 500 });
  }
}

function generateProgressCard(params: URLSearchParams) {
  const ayahs = params.get('ayahs') || '0';
  const streak = params.get('streak') || '0';
  const accuracy = params.get('accuracy') || '0';
  const name = params.get('name') || 'Student';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #080f0c 0%, #0c1f1a 50%, #132e25 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            width: '600px',
            height: '400px',
            background: 'radial-gradient(ellipse, rgba(45, 212, 150, 0.15) 0%, transparent 70%)',
            transform: 'translateX(-50%)',
          }}
        />

        {/* Mosque icon */}
        <div style={{ fontSize: 64, marginBottom: 16 }}>🕌</div>

        {/* Name */}
        <div style={{ fontSize: 24, color: '#6bb89a', marginBottom: 8 }}>
          {name}&apos;s Progress
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: 48,
            marginTop: 24,
            marginBottom: 32,
          }}
        >
          <StatBlock value={ayahs} label="Ayahs" />
          <StatBlock value={`${streak} days`} label="Streak" />
          <StatBlock value={`${accuracy}%`} label="Accuracy" />
        </div>

        {/* Quote */}
        <div
          style={{
            fontSize: 18,
            color: '#8ab8a4',
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          &ldquo;{SHEIKH_QUOTES[Math.floor(Math.random() * SHEIKH_QUOTES.length)]}&rdquo;
        </div>

        {/* Branding */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 20 }}>📖</div>
          <div style={{ fontSize: 16, color: '#4a7a66', fontWeight: 600 }}>
            Quran Oasis
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

function generateMilestoneCard(params: URLSearchParams) {
  const text = params.get('text') || 'Milestone Reached!';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #080f0c 0%, #0c1f1a 50%, #132e25 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>⭐</div>
        <div style={{ fontSize: 40, fontWeight: 800, color: '#2dd496', marginBottom: 12 }}>
          Milestone!
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#e8f5f0',
            maxWidth: 700,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          {text}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 20 }}>🕌</div>
          <div style={{ fontSize: 16, color: '#4a7a66', fontWeight: 600 }}>
            Quran Oasis
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

function generateQuoteCard(params: URLSearchParams) {
  const text = params.get('text') || SHEIKH_QUOTES[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #080f0c 0%, #0c1f1a 50%, #132e25 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: 60,
        }}
      >
        {/* Arabic bismillah at top */}
        <div style={{ fontSize: 28, color: '#2dd496', marginBottom: 32, opacity: 0.6 }}>
          ﷽
        </div>

        {/* Quote marks + text */}
        <div
          style={{
            fontSize: 32,
            color: '#e8f5f0',
            maxWidth: 800,
            textAlign: 'center',
            lineHeight: 1.5,
            fontStyle: 'italic',
          }}
        >
          &ldquo;{text}&rdquo;
        </div>

        {/* Attribution */}
        <div style={{ fontSize: 18, color: '#6bb89a', marginTop: 24 }}>
          — Sheikh HIFZ
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 32,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <div style={{ fontSize: 20 }}>🕌</div>
          <div style={{ fontSize: 16, color: '#4a7a66', fontWeight: 600 }}>
            Quran Oasis
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

// ─── Helper ────────────────────────────────────────────────────────

function StatBlock({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: 48, fontWeight: 800, color: '#2dd496' }}>{value}</div>
      <div style={{ fontSize: 14, color: '#4a7a66', textTransform: 'uppercase', letterSpacing: 1 }}>
        {label}
      </div>
    </div>
  );
}
