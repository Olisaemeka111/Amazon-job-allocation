import { NextResponse } from "next/server"
import { dummyDb } from "@/lib/dummy-db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const task = dummyDb.tasks.find(t => t.id === id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error fetching task:", error)
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const taskIndex = dummyDb.tasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    const data = await request.json()
    const updatedTask = {
      ...dummyDb.tasks[taskIndex],
      ...data,
      updated_at: new Date().toISOString(),
    }

    dummyDb.tasks[taskIndex] = updatedTask

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error("Error updating task:", error)
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const taskIndex = dummyDb.tasks.findIndex(t => t.id === id)

    if (taskIndex === -1) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    // Remove the task from the array
    dummyDb.tasks.splice(taskIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting task:", error)
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
} 