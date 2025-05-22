import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { encrypt } from "@/lib/encryption"

export async function POST(request: NextRequest) {
  console.log("Login API route called")

  try {
    const body = await request.json().catch((err) => {
      console.error("Error parsing request body:", err)
      return null
    })

    if (!body) {
      console.error("Invalid request body")
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
    }

    const { email, password } = body

    if (!email || !password) {
      console.error("Missing email or password")
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log(`Login attempt: email=${email}, password=${password}`)

    // For simplicity, only allow admin login
    if (email === "admin@amazon-warehouse.com" && password === "admin123") {
      console.log("Admin credentials verified")

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

      console.log("Creating session:", session)

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

      return NextResponse.json({
        success: true,
        user: adminUser,
        message: "Login successful",
      })
    }

    console.error("Invalid credentials")
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Authentication failed",
      },
      { status: 500 },
    )
  }
}
