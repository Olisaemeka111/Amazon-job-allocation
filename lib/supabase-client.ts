import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Server-side Supabase client (for API routes)
export function createServerSupabaseClient() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.warn("Missing Supabase environment variables for server client")
      throw new Error("Missing Supabase environment variables")
    }

    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
      },
    })
  } catch (error) {
    console.error("Error creating server Supabase client:", error)
    throw error
  }
}

// Client-side Supabase client (singleton pattern)
let clientSupabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function createClientSupabaseClient() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn("Missing Supabase environment variables for client")
      throw new Error("Missing Supabase environment variables")
    }

    if (!clientSupabaseClient) {
      clientSupabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
        },
      })
    }

    return clientSupabaseClient
  } catch (error) {
    console.error("Error creating client Supabase client:", error)
    throw error
  }
}
