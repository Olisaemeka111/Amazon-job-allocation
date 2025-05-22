import { type NextRequest, NextResponse } from "next/server"
import { createUser, getAllUsers } from "@/lib/db-client"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/encryption"

// Get all users (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      const decryptedSession = decrypt(sessionCookie.value)
      const session = JSON.parse(decryptedSession)

      if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const users = await getAllUsers()

    return NextResponse.json({ users })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Failed to get users" }, { status: 500 })
  }
}

// Create a new user (admin only)
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
      const decryptedSession = decrypt(sessionCookie.value)
      const session = JSON.parse(decryptedSession)

      if (session.user.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const { email, password, name, role } = await request.json()

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    // Validate role
    const validRoles = ["admin", "manager"]
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    await createUser({ email, password, name, role })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Create user error:", error)

    if (error.message === "User with this email already exists") {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
