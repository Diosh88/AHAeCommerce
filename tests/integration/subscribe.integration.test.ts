/**
 * L3 Integration Tests — POST /api/subscribe
 *
 * These tests connect to the REAL Supabase database.
 * NO vi.mock of getSupabaseServer — Gate 4a Section G G4 compliance.
 *
 * Test data isolation: unique emails per run using a UUID prefix.
 * Cleanup: afterAll deletes all test rows by email.
 *
 * LL-GOV-023: L3 tests MUST use real DB. These are those tests.
 */

import { describe, it, expect, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import crypto from 'node:crypto';
import { POST } from '@/app/api/subscribe/route';
import { getSupabaseServer } from '@/lib/supabase/server';

// Unique prefix for this test run — avoids conflicts with concurrent runs
const RUN_ID = crypto.randomUUID().slice(0, 8);
const testEmail = (tag: string) =>
  `test-int-${RUN_ID}-${tag}@test.ahaecommerce.internal`;

const createdEmails: string[] = [];

function makeRequest(body: unknown, extraHeaders: Record<string, string> = {}): NextRequest {
  return new NextRequest('http://localhost:3000/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': '127.0.0.1',
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
}

afterAll(async () => {
  if (createdEmails.length === 0) return;
  const { error } = await getSupabaseServer()
    .from('subscribers')
    .delete()
    .in('email', createdEmails);
  if (error) {
    console.warn('[subscribe-integration] Cleanup error:', error.message);
  }
});

describe('POST /api/subscribe — L3 Integration (real Supabase)', () => {
  it('G2: DB connection verified — subscribers table is queryable', async () => {
    const { error } = await getSupabaseServer()
      .from('subscribers')
      .select('id')
      .limit(1);
    expect(error).toBeNull();
  });

  describe('happy path', () => {
    it('subscribes a new user and inserts a real row in Supabase', async () => {
      const email = testEmail('new');
      createdEmails.push(email);

      const req = makeRequest({
        email,
        name: 'Integration Tester',
        source: 'home-hero',
        gdprConsent: true,
      });

      const res = await POST(req);
      const json = await res.json() as { success: boolean; message: string };

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);

      // Verify the actual DB row was created
      const { data, error } = await getSupabaseServer()
        .from('subscribers')
        .select('email, name, source, gdpr_consent, unsubscribed_at')
        .eq('email', email)
        .single();

      expect(error).toBeNull();
      expect(data).not.toBeNull();
      expect(data?.email).toBe(email);
      expect(data?.name).toBe('Integration Tester');
      expect(data?.source).toBe('home-hero');
      expect(data?.gdpr_consent).toBe(true);
      expect(data?.unsubscribed_at).toBeNull();
    });

    it('stores gdpr_consent: false when not provided', async () => {
      const email = testEmail('noconsent');
      createdEmails.push(email);

      const req = makeRequest({
        email,
        source: 'article-end',
        gdprConsent: false,
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const { data, error } = await getSupabaseServer()
        .from('subscribers')
        .select('gdpr_consent')
        .eq('email', email)
        .single();

      expect(error).toBeNull();
      expect(data?.gdpr_consent).toBe(false);
    });
  });

  describe('idempotency', () => {
    it('returns 200 already-subscribed for duplicate active subscriber', async () => {
      const email = testEmail('dup');
      createdEmails.push(email);

      // First subscription
      await POST(makeRequest({ email, source: 'subscribe-page', gdprConsent: true }));

      // Second subscription — same email
      const res2 = await POST(makeRequest({ email, source: 'subscribe-page', gdprConsent: true }));
      const json2 = await res2.json() as { success: boolean; message: string };

      expect(res2.status).toBe(200);
      expect(json2.success).toBe(true);
      expect(json2.message).toContain('already subscribed');
    });

    it('does not create a second DB row for duplicate', async () => {
      const email = testEmail('dup2');
      createdEmails.push(email);

      await POST(makeRequest({ email, source: 'home-hero', gdprConsent: true }));
      await POST(makeRequest({ email, source: 'home-hero', gdprConsent: true }));

      const { data, error } = await getSupabaseServer()
        .from('subscribers')
        .select('id')
        .eq('email', email);

      expect(error).toBeNull();
      expect(data).toHaveLength(1);
    });
  });

  describe('re-subscribe', () => {
    it('allows an unsubscribed user to re-subscribe', async () => {
      const email = testEmail('resub');
      createdEmails.push(email);

      // Initial subscribe
      await POST(makeRequest({ email, source: 'article-end', gdprConsent: true }));

      // Mark as unsubscribed directly in DB
      const { error: unsubError } = await getSupabaseServer()
        .from('subscribers')
        .update({ unsubscribed_at: new Date().toISOString() })
        .eq('email', email);
      expect(unsubError).toBeNull();

      // Re-subscribe
      const res = await POST(makeRequest({ email, source: 'home-hero', gdprConsent: true }));
      const json = await res.json() as { success: boolean; message: string };

      expect(res.status).toBe(200);
      expect(json.success).toBe(true);
      // Should NOT say "already subscribed" — that message is for active subscribers
      expect(json.message).not.toContain('already subscribed');

      // Verify unsubscribed_at is cleared in DB
      const { data, error } = await getSupabaseServer()
        .from('subscribers')
        .select('unsubscribed_at')
        .eq('email', email)
        .single();

      expect(error).toBeNull();
      expect(data?.unsubscribed_at).toBeNull();
    });
  });

  describe('validation failures — no DB write', () => {
    it('returns 422 for missing source field', async () => {
      const res = await POST(makeRequest({ email: 'valid@example.com' }));
      expect(res.status).toBe(422);
      const json = await res.json() as { success: boolean };
      expect(json.success).toBe(false);
    });

    it('returns 422 for invalid email format', async () => {
      const res = await POST(makeRequest({ email: 'not-an-email', source: 'home-hero' }));
      expect(res.status).toBe(422);
    });

    it('returns 422 for invalid source enum value', async () => {
      const res = await POST(makeRequest({ email: 'valid@example.com', source: 'bad-source' }));
      expect(res.status).toBe(422);
    });

    it('returns 400 for malformed JSON body', async () => {
      const req = new NextRequest('http://localhost:3000/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
        body: 'not { valid json',
      });
      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });
});
