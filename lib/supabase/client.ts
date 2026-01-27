import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set.'
    )
  }

  if (supabaseAnonKey === 'your_anon_key_here' || supabaseAnonKey.includes('your_')) {
    throw new Error(
      'Supabase anon key not configured. Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file with your actual Supabase anon key from the dashboard.'
    )
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
