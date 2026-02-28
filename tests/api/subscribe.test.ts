/**
 * [SPEC] POST /api/subscribe
 * Tests for the email subscription handler — Gate 4c unit test requirement.
 *
 * Strategy: Import the route handler directly. Mock external dependencies:
 *   - @/lib/supabase/server (getSupabaseServer) — avoids real DB connection
 *   - fetch (global) — prevents real Kit API calls
 *   - @upstash/ratelimit / @upstash/redis — prevented via missing env vars
 *
 * Spec source: app/api/subscribe/route.ts
 * Schema: SubscribeSchema
 *   email: string (valid email required)
 *   name?: string (optional, max 100 chars)
 *   source: enum ['home-hero','article-inline','article-end','subscribe-page','category-page']
 *   topics?: string[] (max 5)
 *   gdprConsent: boolean (default false)
 *
 * Response codes:
 *   200 — already subscribed (idempotent) or successful new subscription
 *   422 — Zod validation failure
 *   429 — rate limited
 *   500 — DB error
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';

// ── Mocks (hoisted — must appear before imports of mocked modules) ──────────

// Mock getSupabaseServer to return a chainable query builder stub
vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServer: vi.fn(),
}));

// Import the mocked version after vi.mock is hoisted
import { getSupabaseServer } from '@/lib/supabase/server';
import { POST } from '@/app/api/subscribe/route';

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a minimal NextRequest for the subscribe endpoint.
 * Avoids real HTTP — handler is called directly.
 */
function buildRequest(body: unknown, ip = '127.0.0.1'): NextRequest {
  return new NextRequest('http://localhost:3000/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

/**
 * Build a Supabase query builder mock that chains correctly.
 * Returns a configurable result for the terminal `.maybeSingle()` / `.upsert()` calls.
 */
function buildSupabaseMock({
  existingSubscriber = null as Record<string, unknown> | null,
  checkError = null as { message: string } | null,
  upsertError = null as { message: string } | null,
} = {}) {
  const upsertChain = {
    // upsert returns { error }
    then: undefined as unknown,
  };

  // The mock needs to handle two separate call chains:
  //   Chain 1 (check): .from('subscribers').select(...).eq(...).maybeSingle()
  //   Chain 2 (upsert): .from('subscribers').upsert(...)
  const selectChain = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({
      data: existingSubscriber,
      error: checkError,
    }),
  };

  let callCount = 0;
  const fromMock = vi.fn().mockImplementation(() => {
    callCount++;
    if (callCount === 1) {
      // First .from() call = check for existing subscriber
      return selectChain;
    }
    // Second .from() call = upsert
    return {
      upsert: vi.fn().mockResolvedValue({ error: upsertError }),
    };
  });

  return { from: fromMock };
}

// ── Test setup ────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Ensure Upstash env vars are absent so rate limiting gracefully falls back
  delete process.env.UPSTASH_REDIS_REST_URL;
  delete process.env.UPSTASH_REDIS_REST_TOKEN;
  // Ensure Kit env vars are absent so syncToKit is skipped
  delete process.env.KIT_API_KEY;
  delete process.env.KIT_FORM_ID;
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/subscribe', () => {

  describe('[SPEC] Valid request — new subscriber', () => {
    it('returns 200 with success:true for a valid new subscriber', async () => {
      const mockClient = buildSupabaseMock({
        existingSubscriber: null,
        upsertError: null,
      });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildRequest({
        email: 'valid@example.com',
        source: 'subscribe-page',
        gdprConsent: true,
      });

      const response = await POST(req);
      const body = await response.json() as { success: boolean; message: string };

      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
      expect(typeof body.message).toBe('string');
    });

    it('accepts optional name field', async () => {
      const mockClient = buildSupabaseMock({ existingSubscriber: null });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildRequest({
        email: 'named@example.com',
        name: 'Jane Operator',
        source: 'home-hero',
        gdprConsent: true,
      });

      const response = await POST(req);
      expect(response.status).toBe(200);
    });

    it('accepts all valid source enum values', async () => {
      const sources = [
        'home-hero',
        'article-inline',
        'article-end',
        'subscribe-page',
        'category-page',
      ] as const;

      for (const source of sources) {
        const mockClient = buildSupabaseMock({ existingSubscriber: null });
        vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

        const req = buildRequest({ email: 'test@example.com', source, gdprConsent: true });
        const response = await POST(req);
        expect(response.status).toBe(200);
      }
    });

    it('accepts optional topics array', async () => {
      const mockClient = buildSupabaseMock({ existingSubscriber: null });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildRequest({
        email: 'topics@example.com',
        source: 'subscribe-page',
        gdprConsent: true,
        topics: ['platform', 'finance', 'logistics'],
      });

      const response = await POST(req);
      expect(response.status).toBe(200);
    });
  });

  describe('[SPEC] Already subscribed — idempotency', () => {
    it('returns 200 with success:true when email is already active subscriber', async () => {
      const mockClient = buildSupabaseMock({
        existingSubscriber: {
          id: 'existing-uuid',
          unsubscribed_at: null,  // active subscriber
        },
      });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildRequest({
        email: 'existing@example.com',
        source: 'home-hero',
        gdprConsent: true,
      });

      const response = await POST(req);
      const body = await response.json() as { success: boolean };

      // [SPEC] Already subscribed returns 200 — does not leak whether email is registered
      expect(response.status).toBe(200);
      expect(body.success).toBe(true);
    });
  });

  describe('[SPEC] Validation failures — returns 422', () => {
    it('returns 422 for invalid email format', async () => {
      // No DB mock needed — Zod rejects before reaching DB
      const req = buildRequest({
        email: 'not-a-valid-email',
        source: 'subscribe-page',
        gdprConsent: true,
      });

      const response = await POST(req);
      const body = await response.json() as { success: boolean };

      // [SPEC] Zod validation error returns 422, not 400
      expect(response.status).toBe(422);
      expect(body.success).toBe(false);
    });

    it('returns 422 when email field is missing', async () => {
      const req = buildRequest({
        source: 'subscribe-page',
        gdprConsent: true,
        // email intentionally omitted
      });

      const response = await POST(req);
      expect(response.status).toBe(422);
    });

    it('returns 422 for invalid source enum value', async () => {
      const req = buildRequest({
        email: 'valid@example.com',
        source: 'invalid-source-value',
        gdprConsent: true,
      });

      const response = await POST(req);
      expect(response.status).toBe(422);
    });

    it('returns 200 when gdprConsent is false (Zod default — not a hard block)', async () => {
      // [SPEC] gdprConsent has .default(false) in Zod schema — missing or false does NOT
      // cause validation failure. The subscribe route saves gdpr_consent: false.
      // This test documents the actual behavior: 200 with success (consent tracked as false).
      const mockClient = buildSupabaseMock({ existingSubscriber: null });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildRequest({
        email: 'noconsent@example.com',
        source: 'subscribe-page',
        gdprConsent: false,
      });

      const response = await POST(req);
      // The route does NOT reject gdprConsent: false — it records it as false
      expect(response.status).toBe(200);
    });

    it('returns 422 when source field is missing entirely', async () => {
      const req = buildRequest({
        email: 'valid@example.com',
        gdprConsent: true,
        // source intentionally omitted
      });

      const response = await POST(req);
      expect(response.status).toBe(422);
    });

    it('returns 422 when topics array exceeds 5 items', async () => {
      const req = buildRequest({
        email: 'valid@example.com',
        source: 'subscribe-page',
        gdprConsent: true,
        topics: ['a', 'b', 'c', 'd', 'e', 'f'], // 6 items — max is 5
      });

      const response = await POST(req);
      expect(response.status).toBe(422);
    });

    it('returns 400 for malformed JSON body', async () => {
      const req = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '127.0.0.1',
        },
        body: 'this is { not valid } json',
      });

      const response = await POST(req);
      expect(response.status).toBe(400);
    });
  });

  describe('[SPEC] Database error handling', () => {
    it('returns 500 when DB check query fails', async () => {
      const mockClient = buildSupabaseMock({
        checkError: { message: 'connection timeout' },
      });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildRequest({
        email: 'dberror@example.com',
        source: 'home-hero',
        gdprConsent: true,
      });

      const response = await POST(req);
      const body = await response.json() as { success: boolean };

      expect(response.status).toBe(500);
      expect(body.success).toBe(false);
    });

    it('returns 500 when DB upsert fails', async () => {
      const mockClient = buildSupabaseMock({
        existingSubscriber: null,
        upsertError: { message: 'unique constraint violation' },
      });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildRequest({
        email: 'upserterr@example.com',
        source: 'home-hero',
        gdprConsent: true,
      });

      const response = await POST(req);
      expect(response.status).toBe(500);
    });
  });

  describe('[SPEC] Security — no secrets in response', () => {
    it('response body never contains internal field names or stack traces', async () => {
      const mockClient = buildSupabaseMock({ existingSubscriber: null });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildRequest({
        email: 'secure@example.com',
        source: 'subscribe-page',
        gdprConsent: true,
      });

      const response = await POST(req);
      const text = await response.text();

      expect(text).not.toContain('SUPABASE');
      expect(text).not.toContain('KIT_API');
      expect(text).not.toContain('Error:');
      expect(text).not.toContain('at Object');   // no stack traces
    });
  });
});
