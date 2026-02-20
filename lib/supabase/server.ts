import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim()
  const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()
  const isMissingEnv = !supabaseUrl || !supabaseAnonKey

  if (process.env.NODE_ENV === 'production') {
    if (isMissingEnv) {
      throw new Error(
        'Missing Supabase environment variables on the server. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      )
    }

    return createServerClient(supabaseUrl!, supabaseAnonKey!, {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    })
  }

  // Development fallback: avoid crashing when env vars are not configured.
  if (isMissingEnv) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Supabase][server] Environment variables are not configured. Server-side Supabase features will be disabled in development until you set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    )

    const mockFrom = () => ({
      select: async () => ({ data: null, error: null }),
      insert: async () => ({ data: null, error: null }),
      update: async () => ({ data: null, error: null }),
      delete: async () => ({ data: null, error: null }),
      eq: () => mockFrom(),
      order: () => mockFrom(),
      limit: () => mockFrom(),
    })

    return {
      from: mockFrom,
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
    } as any
  }

  return createServerClient(supabaseUrl!, supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
