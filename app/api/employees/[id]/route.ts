import { NextResponse } from "next/server"
import { dummyDb } from "@/lib/dummy-db"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const employee = dummyDb.employees.find(e => e.id === id)

    if (!employee) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error fetching employee:", error)
    return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const employeeIndex = dummyDb.employees.findIndex(e => e.id === id)

    if (employeeIndex === -1) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    const data = await request.json()
    const updatedEmployee = {
      ...dummyDb.employees[employeeIndex],
      ...data,
      updated_at: new Date().toISOString(),
    }

    dummyDb.employees[employeeIndex] = updatedEmployee

    return NextResponse.json(updatedEmployee)
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const employeeIndex = dummyDb.employees.findIndex(e => e.id === id)

    if (employeeIndex === -1) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 })
    }

    // Remove the employee from the array
    dummyDb.employees.splice(employeeIndex, 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
} 