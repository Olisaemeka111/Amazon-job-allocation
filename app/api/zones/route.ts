import { NextResponse } from "next/server"
import { dummyDb } from "@/lib/dummy-db"

export async function GET() {
  try {
    return NextResponse.json(dummyDb.zones)
  } catch (error) {
    console.error("Error fetching zones:", error)
    return NextResponse.json({ error: "Failed to fetch zones" }, { status: 500 })
  }
}
