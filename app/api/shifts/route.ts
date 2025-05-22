import { NextResponse } from "next/server"
import { dummyDb } from "@/lib/dummy-db"

export async function GET() {
  try {
    return NextResponse.json(dummyDb.shifts)
  } catch (error) {
    console.error("Error fetching shifts:", error)
    return NextResponse.json({ error: "Failed to fetch shifts" }, { status: 500 })
  }
}
