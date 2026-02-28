-- Migration: Create purchases table
-- Date: 2026-02-28
-- Purpose: Record digital product purchases from Lemon Squeezy webhooks

CREATE TABLE IF NOT EXISTS public.purchases (
  id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT         NOT NULL,
  product_slug      TEXT         NOT NULL,   -- Maps to Velite product slug
  lemon_order_id    TEXT         UNIQUE NOT NULL,  -- Prevents duplicate webhook processing
  lemon_variant_id  TEXT         NOT NULL,
  amount_cents      INTEGER      NOT NULL CHECK (amount_cents >= 0),
  currency          TEXT         NOT NULL DEFAULT 'USD',
  status            TEXT         NOT NULL DEFAULT 'completed',  -- 'completed' | 'refunded'
  purchased_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security — service_role only (webhook handler is server-side)
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS purchases_email_idx ON public.purchases(email);
CREATE INDEX IF NOT EXISTS purchases_product_slug_idx ON public.purchases(product_slug);
CREATE INDEX IF NOT EXISTS purchases_lemon_order_id_idx ON public.purchases(lemon_order_id);

COMMENT ON TABLE public.purchases IS 'Digital product purchases recorded via Lemon Squeezy webhook. UNIQUE on lemon_order_id prevents duplicate processing.';
COMMENT ON COLUMN public.purchases.lemon_order_id IS 'Lemon Squeezy order ID — UNIQUE constraint prevents duplicate webhook processing';
COMMENT ON COLUMN public.purchases.product_slug IS 'Maps to content/products/[slug].mdx in the Velite content layer';
