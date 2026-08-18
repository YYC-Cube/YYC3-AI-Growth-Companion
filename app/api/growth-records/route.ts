import { type NextRequest, NextResponse } from "next/server"
import { listRows, createRow, isForeignKeyError } from "@/lib/db/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const childId = searchParams.get("childId")
    const type = searchParams.get("type")

    const conditions: Record<string, unknown> = {}
    if (childId) conditions.child_id = childId
    if (type) conditions.type = type

    const records = await listRows("growth_records", conditions)
    records.sort(
      (a: Record<string, unknown>, b: Record<string, unknown>) =>
        new Date(String(b.recorded_at)).getTime() - new Date(String(a.recorded_at)).getTime()
    )

    return NextResponse.json({ data: records, success: true })
  } catch (error) {
    console.error("[api] Error fetching growth records:", error)
    return NextResponse.json({ error: "Failed to fetch growth records", success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body?.child_id || !body?.title || !body?.content) {
      return NextResponse.json({ error: "child_id/title/content 为必填项", success: false }, { status: 400 })
    }
    if (!body.recorded_at) body.recorded_at = new Date().toISOString()
    const newRecord = await createRow("growth_records", body)
    return NextResponse.json({ data: newRecord, success: true }, { status: 201 })
  } catch (error) {
    console.error("[api] Error creating growth record:", error)
    if (isForeignKeyError(error)) {
      return NextResponse.json({ error: "关联的 child_id 不存在", success: false }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create growth record", success: false }, { status: 500 })
  }
}
