/**
 * POST /api/webhooks/lemonsqueezy
 * Handles Lemon Squeezy order webhooks (order_created, order_refunded)
 *
 * Security:
 * - HMAC-SHA256 signature validation (Gate 3b item 5)
 * - Duplicate order prevention via UNIQUE on lemon_order_id
 * - No secrets in response
 * - Only processes order events (ignores subscription/other events)
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSupabaseServer } from "@/lib/supabase/server";
import type { PurchaseInsert } from "@/types/database.types";

// Lemon Squeezy webhook event types we handle
const HANDLED_EVENTS = ["order_created"] as const;
type HandledEvent = (typeof HANDLED_EVENTS)[number];

// Minimal type for Lemon Squeezy order webhook payload
interface LemonSqueezyOrderPayload {
  meta: {
    event_name: string;
    custom_data?: Record<string, string>;
  };
  data: {
    id: string;
    attributes: {
      identifier: string;           // order_id / lemon_order_id
      user_email: string;
      first_order_item: {
        product_id: number;
        variant_id: number;
        product_name: string;
      };
      total: number;                // amount in cents
      currency: string;
      status: string;
    };
    relationships?: {
      "order-items"?: {
        data?: Array<{ id: string; type: string }>;
      };
    };
  };
}

async function verifySignature(
  request: NextRequest,
  body: string
): Promise<boolean> {
  const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook/lemonsqueezy] LEMON_SQUEEZY_WEBHOOK_SECRET not set");
    return false;
  }

  const signature = request.headers.get("x-signature");
  if (!signature) {
    return false;
  }

  const hmac = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("hex");

  // Timing-safe comparison — buffers must have equal length or timingSafeEqual throws.
  // Non-hex or truncated signatures produce a shorter buffer, which must be rejected.
  const sigBuffer = Buffer.from(signature, "hex");
  const hmacBuffer = Buffer.from(hmac, "hex");
  if (sigBuffer.length !== hmacBuffer.length) return false;
  return crypto.timingSafeEqual(sigBuffer, hmacBuffer);
}

// Map Lemon Squeezy product ID to our product slug
// This mapping should be maintained as products are added
async function getProductSlug(
  productName: string,
  _variantId: number
): Promise<string> {
  // Normalize product name to slug format
  // In production, maintain a mapping table or use Lemon Squeezy custom data
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function POST(request: NextRequest) {
  // Read raw body for HMAC verification (must be done before parsing)
  const body = await request.text();

  // HMAC signature verification — Gate 3b item 5
  const isValid = await verifySignature(request, body);
  if (!isValid) {
    console.warn("[webhook/lemonsqueezy] Invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Parse payload
  let payload: LemonSqueezyOrderPayload;
  try {
    payload = JSON.parse(body) as LemonSqueezyOrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;

  // Only process handled events
  if (!HANDLED_EVENTS.includes(eventName as HandledEvent)) {
    // Acknowledge unhandled events gracefully
    return NextResponse.json({ received: true, processed: false }, { status: 200 });
  }

  const order = payload.data.attributes;
  const item = order.first_order_item;

  const productSlug = await getProductSlug(item.product_name, item.variant_id);
  const lemonOrderId = order.identifier;

  const purchaseInsert: PurchaseInsert = {
    email: order.user_email,
    product_slug: productSlug,
    lemon_order_id: lemonOrderId,
    lemon_variant_id: String(item.variant_id),
    amount_cents: order.total,
    currency: order.currency.toUpperCase(),
    status: "completed",
    purchased_at: new Date().toISOString(),
  };

  // Insert purchase — UNIQUE constraint on lemon_order_id prevents duplicates
  const { error } = await getSupabaseServer()
    .from("purchases")
    .insert(purchaseInsert);

  if (error) {
    // Check if duplicate (idempotency — webhook may fire multiple times)
    if (error.code === "23505") {
      // Unique constraint violation — already processed
      return NextResponse.json(
        { received: true, processed: false, reason: "duplicate" },
        { status: 200 }
      );
    }

    console.error("[webhook/lemonsqueezy] DB insert error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true, processed: true }, { status: 200 });
}
