import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

/**
 * Server-only Supabase admin client.
 *
 * Uses the **service role key** which bypasses Row Level Security.
 * Use this for operations that must not be restricted by RLS:
 *   - Updating payment/order statuses from callbacks
 *   - Admin dashboard queries
 *   - Inserting audit logs
 *   - Any write that anonymous users should not perform directly
 *
 * The `.server.ts` suffix ensures Vite tree-shakes this file from the
 * client bundle — the service role key never reaches the browser.
 */
export function getSupabaseAdmin() {
  const url = process.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "[supabase.server] Missing VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
        "Set them in your .env file.",
    );
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
