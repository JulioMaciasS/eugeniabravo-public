import { createClient as createSupabaseClient } from '@supabase/supabase-js'

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

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton client instance
let supabaseClient: ReturnType<typeof createSupabaseClient<Database>> | null = null

// Client for use in client components - singleton pattern to prevent multiple instances
export const createClient = () => {
  // console.log(supabaseAnonKey);
  // console.log(supabaseUrl);
  if (!supabaseClient) {
    supabaseClient = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return supabaseClient
}