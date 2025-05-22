import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { initDatabase, isUsingFallback } from "@/lib/db-client"

// Track initialization status
let isInitializing = false
let isInitialized = false
let lastError: Error | null = null

export async function GET(request: NextRequest) {
  console.log("Database initialization API route called")

  const reset = request.nextUrl.searchParams.get("reset") === "true"

  if (reset) {
    console.log("Resetting database connection")
    isInitialized = false
    lastError = null
  }

  // If already initialized, return success
  if (isInitialized && !reset) {
    console.log("Database already initialized, returning status")
    return NextResponse.json({
      success: true,
      message: "Database already initialized",
      usingFallback: isUsingFallback(),
    })
  }

  // If currently initializing, return status
  if (isInitializing) {
    console.log("Database initialization in progress")
    return NextResponse.json({
      success: false,
      message: "Database initialization in progress",
      usingFallback: isUsingFallback(),
    })
  }

  // If previous attempt failed, return the error
  if (lastError && !reset) {
    console.log("Previous initialization attempt failed:", lastError)
    return NextResponse.json(
      {
        error: "Failed to initialize database: " + lastError.message,
        usingFallback: isUsingFallback(),
      },
      { status: 200 }, // Return 200 even for errors to allow the UI to handle it
    )
  }

  try {
    isInitializing = true
    console.log("Starting database initialization...")

    const result = await initDatabase()

    isInitialized = result.success
    isInitializing = false

    if (!result.success) {
      lastError = result.error instanceof Error ? result.error : new Error(String(result.error))
      console.error("Database initialization error:", lastError)

      return NextResponse.json(
        {
          error: "Failed to initialize database: " + lastError.message,
          usingFallback: result.usingFallback,
        },
        { status: 200 }, // Return 200 even for errors to allow the UI to handle it
      )
    }

    console.log("Database initialized successfully, using fallback:", result.usingFallback)

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      usingFallback: result.usingFallback,
    })
  } catch (error) {
    isInitializing = false
    lastError = error instanceof Error ? error : new Error(String(error))

    console.error("Database initialization error:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database: " + (error instanceof Error ? error.message : "Unknown error"),
        usingFallback: true,
      },
      { status: 200 }, // Return 200 even for errors to allow the UI to handle it
    )
  }
}
