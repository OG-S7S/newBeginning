import { createBrowserClient } from '@supabase/ssr'

// Client-side Supabase helper.
// In development, if env vars are missing we fall back to a no-op client so the
// app can still run without crashing. In production we keep the strict checks.
export function createClient() {
  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()

  const isMissingEnv = !supabaseUrl || !supabaseAnonKey
  const isPlaceholderKey =
    !!supabaseAnonKey &&
    (supabaseAnonKey === 'your_anon_key_here' || supabaseAnonKey.includes('your_'))

  if (process.env.NODE_ENV === 'production') {
    if (isMissingEnv) {
      throw new Error(
        'Missing Supabase environment variables. Please check your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY set.'
      )
    }

    if (isPlaceholderKey) {
      throw new Error(
        'Supabase anon key not configured. Please update NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file with your actual Supabase anon key from the dashboard.'
      )
    }

    return createBrowserClient(supabaseUrl!, supabaseAnonKey!)
  }

  // Development fallback: avoid crashing when env vars are not configured.
  if (isMissingEnv || isPlaceholderKey) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Supabase] Environment variables are not configured. Auth features will be disabled in development until you set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )

    const mockAuth = {
      getSession: async () => ({ data: { session: null }, error: null }),
      // Match the shape used in AuthProvider (subscription with unsubscribe()).
      onAuthStateChange: (_event: unknown, _callback: unknown) => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
      signOut: async () => ({ error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
    }

    const mockFrom = () => ({
      select: async () => ({ data: null, error: null }),
    })

    return {
      auth: mockAuth,
      from: mockFrom,
    } as any
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
