import { createBrowserClient } from '@supabase/ssr'

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY

  if (!url || !key) {
    throw new Error(
      'Your project\'s URL and Key are required to create a Supabase client!\n\n' +
        'Check your Supabase project\'s API settings to find these values\n\n' +
        'https://supabase.com/dashboard/project/_/settings/api',
    )
  }

  return { url, key }
}

export function createClient() {
  const { url, key } = getSupabaseConfig()

  return createBrowserClient(url, key)
}
