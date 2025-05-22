import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Function to check database connection status
export async function checkDatabaseConnection() {
  try {
    console.log("Checking database connection...")

    // Check if Supabase environment variables exist
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Supabase environment variables are missing")
      return {
        connected: false,
        error: "Missing Supabase environment variables",
      }
    }

    try {
      // Create a direct client instance instead of using the shared one
      // This avoids any potential issues with the shared client
      const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })

      // Use a very simple RPC call that doesn't require parsing complex JSON
      const { error } = await supabase.rpc("version")

      if (error) {
        console.error("Database connection error:", error)
        return { connected: false, error: error.message }
      }

      console.log("Database connection successful")
      return { connected: true }
    } catch (error) {
      console.error("Supabase client error:", error)
      return {
        connected: false,
        error: error instanceof Error ? error.message : "Supabase client error",
      }
    }
  } catch (error) {
    console.error("Database connection check failed:", error)
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown database connection error",
    }
  }
}
