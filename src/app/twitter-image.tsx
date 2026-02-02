import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'HIFZ - Memorize the Quran';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

// Twitter card uses same design as OG image
export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f1419 0%, #1a1f25 50%, #0f1419 100%)',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(201, 162, 39, 0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Golden glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '25%',
            width: '600px',
            height: '600px',
            borderRadius: '100%',
            background: 'radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Arabic decorative element */}
        <div
          style={{
            fontSize: 80,
            color: 'rgba(201, 162, 39, 0.2)',
            marginBottom: 20,
            fontFamily: 'serif',
          }}
        >
          ﷽
        </div>

        {/* Logo/Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: 'linear-gradient(135deg, #c9a227 0%, #8b6914 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              color: '#0f1419',
              fontWeight: 'bold',
            }}
          >
            ﻫ
          </div>
          <span
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #c9a227 0%, #f5e6a3 50%, #c9a227 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            HIFZ
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 36,
            color: '#e5e5e5',
            marginBottom: 20,
            fontWeight: 600,
          }}
        >
          Memorize the Quran with AI
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: '#9ca3af',
            textAlign: 'center',
            maxWidth: 800,
            lineHeight: 1.5,
          }}
        >
          Free personalized lessons • Spaced repetition • Beautiful recitations
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, transparent 0%, #c9a227 50%, transparent 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
