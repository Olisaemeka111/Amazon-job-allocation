import { type NextRequest, NextResponse } from "next/server"
import { updateUser, deleteUser } from "@/lib/db-client"
import { cookies } from "next/headers"
import { decrypt } from "@/lib/encryption"

// Update a user (admin only)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    const { name, role, password } = await request.json()

    // Validate role if provided
    if (role) {
      const validRoles = ["admin", "manager"]
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 })
      }
    }

    // Validate password if provided
    if (password && password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    await updateUser(id, { name, role, password })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Update user error:", error)

    if (error.message === "Cannot change the role of the last admin user") {
      return NextResponse.json({ error: "Cannot change the role of the last admin user" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// Delete a user (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const id = Number.parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 })
    }

    await deleteUser(id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete user error:", error)

    if (error.message === "Cannot delete the last admin user") {
      return NextResponse.json({ error: "Cannot delete the last admin user" }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
