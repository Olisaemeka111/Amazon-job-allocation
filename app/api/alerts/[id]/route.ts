import { NextResponse } from "next/server"
import { dummyDb } from "@/lib/dummy-db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const index = dummyDb.alerts.findIndex((a) => a.id === id)

    if (index === -1) {
      return NextResponse.json({ success: true })
    }

    dummyDb.alerts[index] = {
      ...dummyDb.alerts[index],
      ...data,
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating alert:", error)
    return NextResponse.json({ success: true })
  }
}
