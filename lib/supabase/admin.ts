import { createClient } from '@supabase/supabase-js'

/**
 * Service-role client. SERVER ONLY. Never import this into client components.
 * Used exclusively for privileged operations (creating officer accounts,
 * managing the officer roster) that bypass RLS.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  )
}
