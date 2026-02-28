/**
 * L3 Integration Tests — POST /api/webhooks/lemonsqueezy
 *
 * These tests connect to the REAL Supabase database.
 * NO vi.mock of getSupabaseServer — Gate 4a Section G G4 compliance.
 *
 * Webhook secret: 'integration-test-webhook-secret-32!!'
 * Set in tests/integration/setup.ts — must match what these tests use to sign payloads.
 *
 * Test data isolation: unique lemon_order_id values with UUID run prefix.
 * Cleanup: afterAll deletes all test purchase rows.
 *
 * LL-GOV-023: L3 tests MUST use real DB. These are those tests.
 */

import { describe, it, expect, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { POST } from '@/app/api/webhooks/lemonsqueezy/route';
import { getSupabaseServer } from '@/lib/supabase/server';

const WEBHOOK_SECRET = 'integration-test-webhook-secret-32!!';
const RUN_ID = crypto.randomUUID().slice(0, 8);
const testOrderId = (tag: string) => `INT-TEST-${RUN_ID}-${tag}`;

const createdOrderIds: string[] = [];

/**
 * Build a signed NextRequest that mimics a real Lemon Squeezy delivery.
 * Uses the integration-test webhook secret set in setup.ts.
 */
function makeWebhookRequest(body: unknown, secret: string = WEBHOOK_SECRET): NextRequest {
  const bodyStr = JSON.stringify(body);
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(bodyStr, 'utf8')
    .digest('hex');

  return new NextRequest('http://localhost:3000/api/webhooks/lemonsqueezy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-signature': hmac,
    },
    body: bodyStr,
  });
}

/** Minimal order_created payload — mirrors real Lemon Squeezy webhook structure. */
function makeOrderPayload(orderId: string, overrides: Partial<{
  email: string;
  productName: string;
  total: number;
  currency: string;
  eventName: string;
}> = {}): unknown {
  return {
    meta: {
      event_name: overrides.eventName ?? 'order_created',
    },
    data: {
      id: '99999',
      attributes: {
        identifier: orderId,
        user_email: overrides.email ?? `buyer-${RUN_ID}@test.ahaecommerce.internal`,
        first_order_item: {
          product_id: 1234,
          variant_id: 5678,
          product_name: overrides.productName ?? 'Integration Test Product',
        },
        total: overrides.total ?? 4900,
        currency: overrides.currency ?? 'usd',
        status: 'paid',
      },
    },
  };
}

afterAll(async () => {
  if (createdOrderIds.length === 0) return;
  const { error } = await getSupabaseServer()
    .from('purchases')
    .delete()
    .in('lemon_order_id', createdOrderIds);
  if (error) {
    console.warn('[lemonsqueezy-integration] Cleanup error:', error.message);
  }
});

describe('POST /api/webhooks/lemonsqueezy — L3 Integration (real Supabase)', () => {
  it('G2: DB connection verified — purchases table is queryable', async () => {
    const { error } = await getSupabaseServer()
      .from('purchases')
      .select('id')
      .limit(1);
    expect(error).toBeNull();
  });

  describe('valid order_created webhook', () => {
    it('inserts a purchase row and returns received:true processed:true', async () => {
      const orderId = testOrderId('create');
      createdOrderIds.push(orderId);

      const req = makeWebhookRequest(makeOrderPayload(orderId));
      const res = await POST(req);
      const json = await res.json() as { received: boolean; processed: boolean };

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
      expect(json.processed).toBe(true);

      // Verify the actual DB row
      const { data, error } = await getSupabaseServer()
        .from('purchases')
        .select('lemon_order_id, amount_cents, currency, status, product_slug')
        .eq('lemon_order_id', orderId)
        .single();

      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data?.lemon_order_id).toBe(orderId);
      expect(data?.amount_cents).toBe(4900);
      expect(data?.currency).toBe('USD'); // route uppercases currency
      expect(data?.status).toBe('completed');
      expect(data?.product_slug).toBe('integration-test-product'); // slugified product name
    });

    it('stores correct email on the purchase record', async () => {
      const orderId = testOrderId('email');
      const buyerEmail = `specific-buyer-${RUN_ID}@test.ahaecommerce.internal`;
      createdOrderIds.push(orderId);

      const req = makeWebhookRequest(makeOrderPayload(orderId, { email: buyerEmail }));
      await POST(req);

      const { data, error } = await getSupabaseServer()
        .from('purchases')
        .select('email')
        .eq('lemon_order_id', orderId)
        .single();

      expect(error).toBeNull();
      expect(data?.email).toBe(buyerEmail);
    });
  });

  describe('idempotency (duplicate webhook)', () => {
    it('returns processed:false with reason:duplicate on second delivery', async () => {
      const orderId = testOrderId('dup');
      createdOrderIds.push(orderId);

      // First delivery — should process
      const req1 = makeWebhookRequest(makeOrderPayload(orderId));
      const res1 = await POST(req1);
      const json1 = await res1.json() as { processed: boolean };
      expect(res1.status).toBe(200);
      expect(json1.processed).toBe(true);

      // Second delivery — same order ID, should be rejected as duplicate
      const req2 = makeWebhookRequest(makeOrderPayload(orderId));
      const res2 = await POST(req2);
      const json2 = await res2.json() as { received: boolean; processed: boolean; reason?: string };

      expect(res2.status).toBe(200);
      expect(json2.received).toBe(true);
      expect(json2.processed).toBe(false);
      expect(json2.reason).toBe('duplicate');
    });

    it('does not create a second DB row for duplicate order', async () => {
      const orderId = testOrderId('dup2');
      createdOrderIds.push(orderId);

      await POST(makeWebhookRequest(makeOrderPayload(orderId)));
      await POST(makeWebhookRequest(makeOrderPayload(orderId)));

      const { data, error } = await getSupabaseServer()
        .from('purchases')
        .select('id')
        .eq('lemon_order_id', orderId);

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
    });
  });

  describe('invalid signature', () => {
    it('returns 401 for wrong webhook secret', async () => {
      const orderId = testOrderId('bad-sig');
      const req = makeWebhookRequest(makeOrderPayload(orderId), 'wrong-secret-entirely');
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('returns 401 for missing x-signature header', async () => {
      const req = new NextRequest('http://localhost:3000/api/webhooks/lemonsqueezy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(makeOrderPayload(testOrderId('no-sig'))),
      });
      const res = await POST(req);
      expect(res.status).toBe(401);
    });

    it('does not insert a row for an invalid signature request', async () => {
      const orderId = testOrderId('sig-no-row');
      const req = makeWebhookRequest(makeOrderPayload(orderId), 'bad-secret');
      await POST(req);

      const { data, error } = await getSupabaseServer()
        .from('purchases')
        .select('id')
        .eq('lemon_order_id', orderId);

      expect(error).toBeNull();
      expect(data).toHaveLength(0);
    });
  });

  describe('unhandled event types', () => {
    it('acknowledges subscription_created but does not process it', async () => {
      const payload = makeOrderPayload(testOrderId('sub-created'), {
        eventName: 'subscription_created',
      });
      const req = makeWebhookRequest(payload);
      const res = await POST(req);
      const json = await res.json() as { received: boolean; processed: boolean };

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
      expect(json.processed).toBe(false);
    });

    it('acknowledges order_refunded but does not process it', async () => {
      const payload = makeOrderPayload(testOrderId('refunded'), {
        eventName: 'order_refunded',
      });
      const req = makeWebhookRequest(payload);
      const res = await POST(req);
      const json = await res.json() as { received: boolean; processed: boolean };

      expect(res.status).toBe(200);
      expect(json.received).toBe(true);
      expect(json.processed).toBe(false);
    });
  });
});
