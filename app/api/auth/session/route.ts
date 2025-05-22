import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/encryption"

export async function GET() {
  try {
    console.log("Session API route called")
    const sessionCookie = cookies().get("session")

    if (!sessionCookie) {
      console.log("No session cookie found")
      return NextResponse.json({ user: null })
    }

    try {
      const decryptedSession = decrypt(sessionCookie.value)
      const session = JSON.parse(decryptedSession)

      // Check if session is expired
      if (new Date(session.expires) < new Date()) {
        console.log("Session expired")
        cookies().delete("session")
        return NextResponse.json({ user: null })
      }

      console.log("Valid session found for user:", session.user.email)
      return NextResponse.json({ user: session.user })
    } catch (error) {
      console.error("Error decrypting session:", error)
      cookies().delete("session")
      return NextResponse.json({ user: null })
    }
  } catch (error) {
    console.error("Session error:", error)
    cookies().delete("session")
    return NextResponse.json({ user: null })
  }
}
