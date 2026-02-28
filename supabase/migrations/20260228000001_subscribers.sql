-- Migration: Create subscribers table
-- Date: 2026-02-28
-- Purpose: Store email subscribers with GDPR consent tracking

CREATE TABLE IF NOT EXISTS public.subscribers (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT         UNIQUE NOT NULL,
  name              TEXT,
  source            TEXT         NOT NULL,  -- 'home-hero' | 'article-inline' | 'article-end' | 'subscribe-page' | 'category-page'
  topics            TEXT[],                 -- Subscriber's topic interests
  kit_id            TEXT,                   -- ConvertKit subscriber ID (set after sync)
  gdpr_consent      BOOLEAN      NOT NULL DEFAULT FALSE,
  gdpr_consent_at   TIMESTAMPTZ,
  subscribed_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  unsubscribed_at   TIMESTAMPTZ,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security — service_role only can access this table
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated access — only service_role (via API routes server-side)
-- This enforces that all subscriber writes go through /api/subscribe which validates input

-- Create index on email for fast duplicate detection
CREATE INDEX IF NOT EXISTS subscribers_email_idx ON public.subscribers(email);

-- Create index for Kit sync operations
CREATE INDEX IF NOT EXISTS subscribers_kit_id_idx ON public.subscribers(kit_id) WHERE kit_id IS NOT NULL;

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscribers_updated_at
  BEFORE UPDATE ON public.subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMENT ON TABLE public.subscribers IS 'Email subscribers with GDPR consent tracking. Access via service_role only.';
COMMENT ON COLUMN public.subscribers.source IS 'Where the subscriber signed up: home-hero | article-inline | article-end | subscribe-page | category-page';
COMMENT ON COLUMN public.subscribers.gdpr_consent IS 'GDPR explicit consent — must be TRUE before sending marketing emails';
