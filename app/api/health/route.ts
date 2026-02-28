/**
 * GET /api/health
 * Health check endpoint for monitoring + Gate 3c verification
 * Returns 200 with status and timestamp
 */
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "ahaecommerce",
    },
    { status: 200 }
  );
}
