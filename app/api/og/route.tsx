/**
 * OG Image generation route
 *
 * Usage: /api/og?title=...&description=...&topic=...
 *
 * Produces a 1200×630 PNG for Open Graph previews.
 * Uses @vercel/og (ImageResponse) — runs on the Edge runtime.
 */

import { ImageResponse } from '@vercel/og';
import { type NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'AHAeCommerce';
  const description =
    searchParams.get('description') ??
    'A–Z eCommerce Decision Intelligence';
  const topic = searchParams.get('topic') ?? '';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#1e293b',
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: 'linear-gradient(90deg, #2563eb, #1d4ed8)',
          }}
        />

        {topic && (
          <div
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#93c5fd',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginBottom: 24,
              padding: '4px 12px',
              border: '1px solid #2563eb',
              borderRadius: '4px',
            }}
          >
            {topic}
          </div>
        )}

        <div
          style={{
            fontSize: title.length > 60 ? 44 : 52,
            fontWeight: 800,
            color: '#f8fafc',
            lineHeight: 1.15,
            marginBottom: 24,
            maxWidth: '960px',
          }}
        >
          {title}
        </div>

        {description && (
          <div
            style={{
              fontSize: 22,
              color: '#94a3b8',
              lineHeight: 1.5,
              maxWidth: '960px',
              marginBottom: 48,
            }}
          >
            {description}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              color: '#60a5fa',
              letterSpacing: '-0.02em',
            }}
          >
            AHAeCommerce
          </div>
          <div style={{ color: '#475569', fontSize: 20 }}>·</div>
          <div style={{ color: '#64748b', fontSize: 18 }}>
            A–Z eCommerce Decision Intelligence
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
