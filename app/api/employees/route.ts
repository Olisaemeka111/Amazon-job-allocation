import { NextResponse } from "next/server"
import { dummyDb } from "@/lib/dummy-db"

export async function GET() {
  try {
    return NextResponse.json(dummyDb.employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newEmployee = {
      ...data,
      id: dummyDb.generateId(dummyDb.employees),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    dummyDb.employees.push(newEmployee)

    return NextResponse.json(newEmployee)
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
