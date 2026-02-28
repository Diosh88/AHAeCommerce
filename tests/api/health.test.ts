/**
 * [SPEC] GET /api/health
 * Tests the health check endpoint — Gate 4c unit test requirement.
 *
 * Strategy: Import the route handler directly and call it.
 * No HTTP server required. NextResponse is available in Node via Next.js.
 *
 * Spec source: app/api/health/route.ts
 * Requirements:
 *   - Returns HTTP 200
 *   - Body shape: { status: 'ok', timestamp: string, service: 'ahaecommerce' }
 *   - timestamp is a valid ISO 8601 date string
 */

import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/health/route';

describe('GET /api/health', () => {
  it('[SPEC] returns HTTP 200', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('[SPEC] returns correct shape: { status, timestamp, service }', async () => {
    const response = await GET();
    const body = await response.json() as Record<string, unknown>;

    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('service');
  });

  it('[SPEC] status field is exactly "ok"', async () => {
    const response = await GET();
    const body = await response.json() as { status: string };

    expect(body.status).toBe('ok');
  });

  it('[SPEC] service field is exactly "ahaecommerce"', async () => {
    const response = await GET();
    const body = await response.json() as { service: string };

    expect(body.service).toBe('ahaecommerce');
  });

  it('[SPEC] timestamp is a valid ISO 8601 date string', async () => {
    const response = await GET();
    const body = await response.json() as { timestamp: string };

    // ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ
    const parsed = new Date(body.timestamp);
    expect(parsed.toString()).not.toBe('Invalid Date');
    // Verify it round-trips correctly (is a real ISO string)
    expect(typeof body.timestamp).toBe('string');
    expect(body.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  });

  it('[SPEC] timestamp is recent (within 5 seconds of test execution)', async () => {
    const before = Date.now();
    const response = await GET();
    const after = Date.now();
    const body = await response.json() as { timestamp: string };

    const ts = new Date(body.timestamp).getTime();
    expect(ts).toBeGreaterThanOrEqual(before - 1000); // 1s grace for clock drift
    expect(ts).toBeLessThanOrEqual(after + 1000);
  });

  it('[SPEC] Content-Type header is application/json', async () => {
    const response = await GET();
    const contentType = response.headers.get('content-type');
    expect(contentType).toContain('application/json');
  });

  it('[SPEC] response body has no extra unexpected fields beyond the three defined', async () => {
    const response = await GET();
    const body = await response.json() as Record<string, unknown>;

    const keys = Object.keys(body);
    expect(keys).toHaveLength(3);
    expect(keys).toEqual(expect.arrayContaining(['status', 'timestamp', 'service']));
  });
});
