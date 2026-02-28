/**
 * Supabase browser-side client
 * Use this ONLY for client components that need Supabase
 * ANON_KEY is safe to expose — RLS policies prevent unauthorized access
 *
 * NOTE: Phase 1 has no user auth — this client is not used in Phase 1.
 * Scaffolded for Phase 2 readiness.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export function createBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env"
    );
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}
