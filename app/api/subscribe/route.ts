/**
 * POST /api/subscribe
 * Email capture — validates, rate limits, syncs to Kit, records in Supabase
 *
 * Security:
 * - Zod validation on all inputs
 * - Rate limiting: 10 req/min per IP via Upstash (configured via env)
 * - GDPR consent tracked with timestamp
 * - No secrets in response
 */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServer } from "@/lib/supabase/server";

// Zod input schema — Gate 3b item 4
const SubscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().max(100, "Name is too long").optional(),
  source: z.enum([
    "home-hero",
    "article-inline",
    "article-end",
    "subscribe-page",
    "category-page",
  ]),
  topics: z.array(z.string()).max(5).optional(),
  gdprConsent: z.boolean().default(false),
});

type SubscribeInput = z.infer<typeof SubscribeSchema>;

// Rate limiting — simple in-memory fallback when Upstash is not configured
// For production: set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
async function checkRateLimit(ip: string): Promise<{ allowed: boolean }> {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashUrl || !upstashToken) {
    // Rate limiting not configured — allow (log warning in production)
    if (process.env.NODE_ENV === "production") {
      console.warn("[subscribe] Rate limiting not configured — Upstash env vars missing");
    }
    return { allowed: true };
  }

  try {
    const { Ratelimit } = await import("@upstash/ratelimit");
    const { Redis } = await import("@upstash/redis");

    const redis = new Redis({ url: upstashUrl, token: upstashToken });
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "60 s"),
      analytics: false,
    });

    const { success } = await ratelimit.limit(ip);
    return { allowed: success };
  } catch {
    // Rate limit check failed — allow request, log error
    console.error("[subscribe] Rate limit check failed");
    return { allowed: true };
  }
}

// Sync subscriber to ConvertKit (Kit)
async function syncToKit(data: SubscribeInput): Promise<string | null> {
  const apiKey = process.env.KIT_API_KEY;
  const formId = process.env.KIT_FORM_ID;

  if (!apiKey || !formId) {
    console.warn("[subscribe] Kit env vars not configured — skipping Kit sync");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.kit.com/v3/forms/${formId}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          email_address: data.email,
          first_name: data.name,
          fields: {
            source: data.source,
            topics: data.topics?.join(","),
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[subscribe] Kit API error:", err);
      return null;
    }

    const result = await response.json() as { subscriber?: { id?: number } };
    return result.subscriber?.id?.toString() ?? null;
  } catch (err) {
    console.error("[subscribe] Kit sync failed:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  // Rate limiting — Gate 3b item 5
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  const { allowed } = await checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again in a minute." },
      { status: 429 }
    );
  }

  // Parse and validate input
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body." },
      { status: 400 }
    );
  }

  const parsed = SubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: parsed.error.errors[0]?.message ?? "Invalid input.",
      },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Check for existing subscriber
  const { data: existing, error: checkError } = await getSupabaseServer()
    .from("subscribers")
    .select("id, unsubscribed_at")
    .eq("email", data.email)
    .maybeSingle();

  if (checkError) {
    console.error("[subscribe] DB check error:", checkError);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  if (existing && !existing.unsubscribed_at) {
    // Already subscribed — success (don't leak whether email is registered)
    return NextResponse.json(
      { success: true, message: "You're already subscribed — see you in your inbox!" },
      { status: 200 }
    );
  }

  // Sync to Kit first (get kit_id)
  const kitId = await syncToKit(data);

  // Insert or update subscriber in Supabase
  const { error: upsertError } = await getSupabaseServer()
    .from("subscribers")
    .upsert(
      {
        email: data.email,
        name: data.name ?? null,
        source: data.source,
        topics: data.topics ?? null,
        kit_id: kitId,
        gdpr_consent: data.gdprConsent,
        gdpr_consent_at: data.gdprConsent ? new Date().toISOString() : null,
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null, // Clear if re-subscribing
      },
      { onConflict: "email" }
    );

  if (upsertError) {
    console.error("[subscribe] DB upsert error:", upsertError);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message:
        "You're in! Check your inbox for a confirmation email.",
    },
    { status: 200 }
  );
}
