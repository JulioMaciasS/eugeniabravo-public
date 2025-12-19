import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { DEMO_MODE } from '@/app/lib/demo-mode'

// Database types - you can generate these with: npx supabase gen types typescript --local
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string | null
          image: string | null
          author: string
          visibility: string
          created_at: string
          date: string | null
          slug: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string | null
          image?: string | null
          author: string
          visibility?: string
          created_at?: string
          date?: string | null
          slug?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string | null
          image?: string | null
          author?: string
          visibility?: string
          created_at?: string
          date?: string | null
          slug?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      post_categories: {
        Row: {
          post_id: string
          category_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          category_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          category_id?: string
          created_at?: string
        }
      }
    }
  }
}

export const isSupabaseConfigured = () =>
  Boolean(!DEMO_MODE && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

type SupabaseClient = ReturnType<typeof createSupabaseClient<Database>>

const createNoopQuery = (message: string) => {
  const result = { data: null, error: { message }, count: 0 }
  const query: any = {
    select: () => query,
    insert: () => query,
    update: () => query,
    delete: () => query,
    upsert: () => query,
    order: () => query,
    eq: () => query,
    neq: () => query,
    in: () => query,
    ilike: () => query,
    range: () => query,
    limit: () => query,
    single: () => query,
    maybeSingle: () => query,
    then: (onFulfilled: any, onRejected: any) =>
      Promise.resolve(result).then(onFulfilled, onRejected),
    catch: (onRejected: any) => Promise.resolve(result).catch(onRejected),
  }
  return query
}

const createNoopClient = (message: string): SupabaseClient => {
  const noopQuery = createNoopQuery(message)
  const noopClient: any = {
    from: () => noopQuery,
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: { message } }),
        remove: async () => ({ data: null, error: { message } }),
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      refreshSession: async () => ({ data: { session: null }, error: { message } }),
      signOut: async () => ({ error: { message } }),
      mfa: {
        enroll: async () => ({ data: null, error: { message } }),
        challenge: async () => ({ data: null, error: { message } }),
        verify: async () => ({ data: null, error: { message } }),
        unenroll: async () => ({ data: null, error: { message } }),
        listFactors: async () => ({ data: { all: [] }, error: { message } }),
        getAuthenticatorAssuranceLevel: async () => ({ data: { currentLevel: null }, error: { message } }),
      },
    },
  }

  return noopClient as SupabaseClient
}

// Singleton client instance
let supabaseClient: SupabaseClient | null = null

// Client for use in client components - singleton pattern to prevent multiple instances
export const createClient = () => {
  if (!isSupabaseConfigured()) {
    const message = 'Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    if (typeof window !== 'undefined') {
      console.error(message)
    }
    return createNoopClient(message)
  }

  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
    supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}
