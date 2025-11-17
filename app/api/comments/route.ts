import { type NextRequest, NextResponse } from "next/server"
import { getConnection } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"
import type { RowDataPacket } from "mysql2/promise"

function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("Authorization")
  return authHeader?.replace("Bearer ", "") || null
}

export async function POST(req: NextRequest) {
  try {
    const token = getAuthToken(req)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { taskId, content } = await req.json()

    if (!taskId || !content) {
      return NextResponse.json({ error: "Task ID and content are required" }, { status: 400 })
    }

    const connection = await getConnection()
    const commentId = uuidv4()

    await connection.query("INSERT INTO comments (id, task_id, user_id, content) VALUES (?, ?, ?, ?)", [
      commentId,
      taskId,
      decoded.userId,
      content,
    ])

    return NextResponse.json(
      {
        id: commentId,
        taskId,
        content,
        userId: decoded.userId,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create comment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = getAuthToken(req)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const taskId = searchParams.get("taskId")

    if (!taskId) {
      return NextResponse.json({ error: "Task ID is required" }, { status: 400 })
    }

    const connection = await getConnection()
    const [comments] = await connection.query<RowDataPacket[]>(
      "SELECT c.id, c.content, c.user_id, c.created_at, u.full_name, u.avatar_url FROM comments c JOIN users u ON c.user_id = u.id WHERE c.task_id = ? ORDER BY c.created_at DESC",
      [taskId],
    )

    return NextResponse.json(comments, { status: 200 })
  } catch (error) {
    console.error("Get comments error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
