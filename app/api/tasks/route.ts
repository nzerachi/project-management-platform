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

    const { title, description, projectId, priority, assignedTo, dueDate } = await req.json()

    if (!title || !projectId) {
      return NextResponse.json({ error: "Title and project ID are required" }, { status: 400 })
    }

    const connection = await getConnection()
    const taskId = uuidv4()

    await connection.query(
      "INSERT INTO tasks (id, title, description, project_id, priority, assigned_to, due_date, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        taskId,
        title,
        description || null,
        projectId,
        priority || "medium",
        assignedTo || null,
        dueDate || null,
        decoded.userId,
      ],
    )

    return NextResponse.json({ id: taskId, title, description }, { status: 201 })
  } catch (error) {
    console.error("Create task error:", error)
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
    const projectId = searchParams.get("projectId")

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
    }

    const connection = await getConnection()
    const [tasks] = await connection.query<RowDataPacket[]>(
      "SELECT t.* FROM tasks t JOIN projects p ON t.project_id = p.id WHERE t.project_id = ?",
      [projectId],
    )

    return NextResponse.json(tasks, { status: 200 })
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
