import { NextResponse } from "next/server"
import { dummyDb } from "@/lib/dummy-db"

export async function GET() {
  try {
    return NextResponse.json(dummyDb.tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const newTask = {
      ...data,
      id: dummyDb.generateTaskId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    dummyDb.tasks.push(newTask)

    return NextResponse.json(newTask)
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
