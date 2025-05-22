import { NextResponse } from "next/server"
import { dummyDb } from "@/lib/dummy-db"

// Fallback data that will always work
const fallbackAlerts = [
  {
    id: 1,
    type: "error",
    title: "Zone E Understaffed",
    description: "No employees assigned to Zone E with 30 pending tasks",
    time: "10 minutes ago",
    source: "system",
    resolved: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    type: "warning",
    title: "High Priority Tasks Increasing",
    description: "24 high priority tasks in queue, up 15% from average",
    time: "25 minutes ago",
    source: "task",
    resolved: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    type: "error",
    title: "Blocked Location",
    description: "Inventory location B-22 is blocked, affecting 3 tasks",
    time: "32 minutes ago",
    source: "employee",
    resolved: false,
    created_at: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    // Fetch alerts from dummyDb
    return NextResponse.json(dummyDb.alerts)
  } catch (error) {
    console.error("Error fetching alerts:", error)
    // Return empty array instead of error
    return NextResponse.json([])
  }
}
