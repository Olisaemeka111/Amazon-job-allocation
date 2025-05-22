import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/encryption"

export async function GET() {
  console.log("Direct login API route called")

  try {
    // Create admin user object
    const adminUser = {
      id: 1,
      email: "admin@amazon-warehouse.com",
      name: "System Administrator",
      role: "admin",
    }

    // Create session
    const session = {
      user: adminUser,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    }

    console.log("Creating direct login session:", session)

    // Set session cookie
    try {
      const encryptedSession = encrypt(JSON.stringify(session))
      console.log("Session encrypted successfully")

      cookies().set("session", encryptedSession, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })
      console.log("Session cookie set successfully")
    } catch (cookieError) {
      console.error("Error setting cookie:", cookieError)
    }

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/", "https://amazon-job-allocation.vercel.app"))
  } catch (error) {
    console.error("Direct login error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Direct login failed",
      },
      { status: 500 },
    )
  }
}
