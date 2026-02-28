/**
 * Supabase server-side client
 * Use this for API routes and Server Components
 * SERVICE_ROLE_KEY — server-only, never expose to client
 *
 * Lazy initialization — not created at module load time to prevent
 * build failures during static analysis when env vars aren't present.
 */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseServer() {
  if (_client) return _client;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
    );
  }

  _client = createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _client;
}
