import { type NextRequest, NextResponse } from "next/server"
import { listRows, createRow, isForeignKeyError } from "@/lib/db/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const childId = searchParams.get("childId")
    const status = searchParams.get("status")

    const conditions: Record<string, unknown> = {}
    if (childId) conditions.child_id = childId
    if (status) conditions.status = status

    const homework = await listRows("homework_tasks", conditions)
    return NextResponse.json({ data: homework, success: true })
  } catch (error) {
    console.error("[api] Error fetching homework:", error)
    return NextResponse.json({ error: "Failed to fetch homework", success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body?.child_id || !body?.subject || !body?.title) {
      return NextResponse.json({ error: "child_id/subject/title 为必填项", success: false }, { status: 400 })
    }
    if (!body.status) body.status = "pending"
    if (!body.priority) body.priority = "normal"
    const newHomework = await createRow("homework_tasks", body)
    return NextResponse.json({ data: newHomework, success: true }, { status: 201 })
  } catch (error) {
    console.error("[api] Error creating homework:", error)
    if (isForeignKeyError(error)) {
      return NextResponse.json({ error: "关联的 child_id 不存在", success: false }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create homework", success: false }, { status: 500 })
  }
}
