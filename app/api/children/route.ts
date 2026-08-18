import { type NextRequest, NextResponse } from "next/server"
import { listRows, createRow, isForeignKeyError } from "@/lib/db/server"

export async function GET(_request: NextRequest) {
  try {
    const children = await listRows("children")
    return NextResponse.json({ data: children, success: true })
  } catch (error) {
    console.error("[api] Error fetching children:", error)
    return NextResponse.json({ error: "Failed to fetch children", success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body?.name || !body?.birth_date) {
      return NextResponse.json({ error: "name 与 birth_date 为必填项", success: false }, { status: 400 })
    }
    const newChild = await createRow("children", body)
    return NextResponse.json({ data: newChild, success: true }, { status: 201 })
  } catch (error) {
    console.error("[api] Error creating child:", error)
    if (isForeignKeyError(error)) {
      return NextResponse.json({ error: "关联的 user_id 不存在", success: false }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create child", success: false }, { status: 500 })
  }
}
