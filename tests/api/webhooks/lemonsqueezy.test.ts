/**
 * [SPEC] POST /api/webhooks/lemonsqueezy
 * Security-critical tests for HMAC webhook validation — Gate 4c requirement.
 *
 * Strategy: Import route handler directly. Use Node's crypto module to generate
 * valid and invalid HMAC signatures that match the route's verifySignature logic.
 *
 * Spec source: app/api/webhooks/lemonsqueezy/route.ts
 *
 * Security requirements (P0 — BLOCK release if missing):
 *   - Invalid HMAC signature → 401
 *   - Missing X-Signature header → 401
 *   - Tampered body (signature doesn't match body) → 401
 *
 * Business requirements:
 *   - Valid HMAC + order_created event → 200, processed: true
 *   - Valid HMAC + unknown event type → 200, processed: false (graceful)
 *   - Valid HMAC + duplicate order_id → 200, reason: 'duplicate' (idempotent)
 *
 * [TEST] HMAC generation mirrors route's verifySignature exactly:
 *   crypto.createHmac('sha256', secret).update(body, 'utf8').digest('hex')
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import crypto from 'crypto';
import { NextRequest } from 'next/server';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('@/lib/supabase/server', () => ({
  getSupabaseServer: vi.fn(),
}));

import { getSupabaseServer } from '@/lib/supabase/server';
import { POST } from '@/app/api/webhooks/lemonsqueezy/route';

// ── Constants ─────────────────────────────────────────────────────────────────

// [TEST] Must match what tests/setup.ts sets for LEMON_SQUEEZY_WEBHOOK_SECRET
const TEST_SECRET = 'test-webhook-secret-32-chars-min!!';

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Generate a valid HMAC-SHA256 hex signature for the given body string.
 * Mirrors the route's verifySignature function exactly.
 */
function generateValidSignature(body: string, secret: string = TEST_SECRET): string {
  return crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('hex');
}

/**
 * Build a minimal order_created payload.
 * All fields match the LemonSqueezyOrderPayload interface in the route.
 */
function buildOrderPayload(orderId: string = 'order-abc-123'): string {
  return JSON.stringify({
    meta: {
      event_name: 'order_created',
    },
    data: {
      id: 'ls-data-id-1',
      attributes: {
        identifier: orderId,
        user_email: 'buyer@example.com',
        first_order_item: {
          product_id: 42,
          variant_id: 101,
          product_name: 'AHA Decision Playbook',
        },
        total: 4700,          // $47.00 in cents
        currency: 'usd',
        status: 'paid',
      },
    },
  });
}

/**
 * Build a NextRequest for the webhook endpoint.
 * The raw body string is passed through directly — HMAC is computed over it.
 */
function buildWebhookRequest(body: string, signature: string | null): NextRequest {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (signature !== null) {
    headers['x-signature'] = signature;
  }

  return new NextRequest('http://localhost:3000/api/webhooks/lemonsqueezy', {
    method: 'POST',
    headers,
    body,
  });
}

/**
 * Build a Supabase mock for the purchases table insert.
 */
function buildPurchasesMock({ dbError = null as null | { code: string; message: string } } = {}) {
  return {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockResolvedValue({ error: dbError }),
    }),
  };
}

// ── Setup ─────────────────────────────────────────────────────────────────────

beforeEach(() => {
  // Ensure the secret is always set for these tests
  process.env.LEMON_SQUEEZY_WEBHOOK_SECRET = TEST_SECRET;
});

afterEach(() => {
  vi.clearAllMocks();
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('POST /api/webhooks/lemonsqueezy', () => {

  // ── SECURITY CRITICAL ── P0 — BLOCK release if these fail ──────────────────

  describe('[SPEC][SECURITY] HMAC signature validation', () => {
    it('returns 401 when X-Signature header is missing', async () => {
      const body = buildOrderPayload();
      const req = buildWebhookRequest(body, null); // no signature header

      const response = await POST(req);

      // [SPEC] Missing header = reject immediately, no processing
      expect(response.status).toBe(401);
      const responseBody = await response.json() as { error: string };
      expect(responseBody.error).toBeTruthy();
    });

    it('returns 401 when X-Signature is an empty string', async () => {
      const body = buildOrderPayload();
      const req = buildWebhookRequest(body, '');

      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it('returns 401 when X-Signature does not match body (tampered body)', async () => {
      const originalBody = buildOrderPayload('original-order-id');
      const tamperedBody = buildOrderPayload('tampered-order-id');

      // Signature computed over original, but body is tampered
      const signature = generateValidSignature(originalBody);
      const req = buildWebhookRequest(tamperedBody, signature);

      const response = await POST(req);

      // [SPEC] Timing-safe comparison catches body tampering
      expect(response.status).toBe(401);
    });

    it('returns 401 when X-Signature is a random hex string (wrong secret)', async () => {
      const body = buildOrderPayload();
      // Generate HMAC with a different secret than what the server uses
      const wrongSignature = generateValidSignature(body, 'completely-wrong-secret!!!!!');

      const req = buildWebhookRequest(body, wrongSignature);
      const response = await POST(req);

      expect(response.status).toBe(401);
    });

    it('does NOT return 200 when X-Signature is non-hex garbage (route throws RangeError — P1 bug)', async () => {
      const body = buildOrderPayload();
      const req = buildWebhookRequest(body, 'not-a-hex-string-at-all');

      // [SPEC] Non-hex signature must NOT allow access (security invariant).
      // [FIX APPLIED] Buffer length guard added to verifySignature before timingSafeEqual.
      // Non-hex garbage now produces a clean 401 (not a thrown RangeError).
      const response = await POST(req);
      expect(response.status).toBe(401);
    });

    it('returns 401 when LEMON_SQUEEZY_WEBHOOK_SECRET env var is not set', async () => {
      // Remove the env var to simulate misconfigured deployment
      delete process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;

      const body = buildOrderPayload();
      const signature = generateValidSignature(body);
      const req = buildWebhookRequest(body, signature);

      const response = await POST(req);

      // [SPEC] Route returns false from verifySignature when secret is missing → 401
      expect(response.status).toBe(401);
    });
  });

  // ── BUSINESS LOGIC ──────────────────────────────────────────────────────────

  describe('[SPEC] Valid HMAC — event processing', () => {
    it('returns 200 with processed:true for a valid order_created event', async () => {
      const body = buildOrderPayload('unique-order-789');
      const signature = generateValidSignature(body);

      const mockClient = buildPurchasesMock({ dbError: null });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildWebhookRequest(body, signature);
      const response = await POST(req);
      const responseBody = await response.json() as { received: boolean; processed: boolean };

      expect(response.status).toBe(200);
      expect(responseBody.received).toBe(true);
      expect(responseBody.processed).toBe(true);
    });

    it('returns 200 with processed:false for an unhandled event type', async () => {
      // [SPEC] Route only handles HANDLED_EVENTS = ['order_created']
      // Other events should be acknowledged gracefully, not rejected
      const body = JSON.stringify({
        meta: { event_name: 'subscription_created' },  // unhandled event
        data: {
          id: 'sub-data-id',
          attributes: {
            identifier: 'sub-123',
            user_email: 'sub@example.com',
            first_order_item: { product_id: 1, variant_id: 1, product_name: 'Pro' },
            total: 9900,
            currency: 'usd',
            status: 'active',
          },
        },
      });
      const signature = generateValidSignature(body);
      const req = buildWebhookRequest(body, signature);

      const response = await POST(req);
      const responseBody = await response.json() as { received: boolean; processed: boolean };

      expect(response.status).toBe(200);
      expect(responseBody.received).toBe(true);
      expect(responseBody.processed).toBe(false);
    });

    it('returns 200 with processed:false and reason:duplicate for a duplicate order_id', async () => {
      // [SPEC] UNIQUE constraint on lemon_order_id — Postgres error code 23505
      // Route must handle this gracefully (webhook may fire multiple times)
      const body = buildOrderPayload('already-processed-order-id');
      const signature = generateValidSignature(body);

      const mockClient = buildPurchasesMock({
        dbError: { code: '23505', message: 'unique constraint violation on lemon_order_id' },
      });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildWebhookRequest(body, signature);
      const response = await POST(req);
      const responseBody = await response.json() as { received: boolean; processed: boolean; reason: string };

      expect(response.status).toBe(200);
      expect(responseBody.received).toBe(true);
      expect(responseBody.processed).toBe(false);
      expect(responseBody.reason).toBe('duplicate');
    });

    it('returns 500 for a non-duplicate DB error', async () => {
      const body = buildOrderPayload('order-with-db-error');
      const signature = generateValidSignature(body);

      const mockClient = buildPurchasesMock({
        dbError: { code: '42P01', message: 'relation does not exist' },
      });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildWebhookRequest(body, signature);
      const response = await POST(req);

      expect(response.status).toBe(500);
    });
  });

  // ── FORBIDDEN BEHAVIOR ──────────────────────────────────────────────────────

  describe('[SPEC] Forbidden behaviors — data integrity', () => {
    it('does NOT process the order before HMAC verification succeeds', async () => {
      // Verify that DB is never touched when signature is invalid
      const mockClient = buildPurchasesMock();
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const body = buildOrderPayload('should-not-be-inserted');
      const invalidSignature = 'a'.repeat(64); // 64 hex chars of garbage
      const req = buildWebhookRequest(body, invalidSignature);

      await POST(req);

      // [SPEC] DB insert must NOT have been called — auth gate is before processing
      expect(mockClient.from).not.toHaveBeenCalled();
    });

    it('does NOT expose internal error details in the response body', async () => {
      const body = buildOrderPayload('order-secret-leak-test');
      const signature = generateValidSignature(body);

      const mockClient = buildPurchasesMock({
        dbError: { code: '42501', message: 'permission denied for table purchases' },
      });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildWebhookRequest(body, signature);
      const response = await POST(req);
      const text = await response.text();

      // [SPEC] Internal DB error messages must never reach the response
      expect(text).not.toContain('permission denied');
      expect(text).not.toContain('purchases');
      expect(text).not.toContain('SUPABASE');
    });
  });

  // ── EDGE CASES ───────────────────────────────────────────────────────────────

  describe('[SPEC] Edge cases', () => {
    it('returns 400 for invalid JSON with a valid HMAC signature', async () => {
      // The body is valid text (HMAC computed over it correctly),
      // but JSON.parse inside the route should fail
      const body = 'this is not json but has a valid hmac';
      const signature = generateValidSignature(body);
      const req = buildWebhookRequest(body, signature);

      const response = await POST(req);
      expect(response.status).toBe(400);
    });

    it('handles order_created event with different currencies correctly', async () => {
      const body = JSON.stringify({
        meta: { event_name: 'order_created' },
        data: {
          id: 'eur-order-id',
          attributes: {
            identifier: 'eur-order-123',
            user_email: 'eu@example.com',
            first_order_item: {
              product_id: 10,
              variant_id: 20,
              product_name: 'EU Product',
            },
            total: 3900,
            currency: 'eur',   // lowercase — route uppercases it
            status: 'paid',
          },
        },
      });
      const signature = generateValidSignature(body);

      const mockClient = buildPurchasesMock({ dbError: null });
      vi.mocked(getSupabaseServer).mockReturnValue(mockClient as ReturnType<typeof getSupabaseServer>);

      const req = buildWebhookRequest(body, signature);
      const response = await POST(req);

      expect(response.status).toBe(200);
    });
  });
});
