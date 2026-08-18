import { type NextRequest, NextResponse } from "next/server"
import { updateRow, deleteRow } from "@/lib/db/server"

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    if (body?.status === "completed" && !body.completed_at) {
      body.completed_at = new Date().toISOString()
    }
    const updated = await updateRow("homework_tasks", id, body)

    if (!updated) {
      return NextResponse.json({ error: "Homework not found", success: false }, { status: 404 })
    }
    return NextResponse.json({ data: updated, success: true })
  } catch (error) {
    console.error("[api] Error updating homework:", error)
    return NextResponse.json({ error: "Failed to update homework", success: false }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await deleteRow("homework_tasks", id)
    if (!deleted) {
      return NextResponse.json({ error: "Homework not found", success: false }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[api] Error deleting homework:", error)
    return NextResponse.json({ error: "Failed to delete homework", success: false }, { status: 500 })
  }
}
