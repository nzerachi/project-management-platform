import { type NextRequest, NextResponse } from "next/server"
import { getConnection } from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import type { RowDataPacket } from "mysql2/promise"

function getAuthToken(req: NextRequest): string | null {
  const authHeader = req.headers.get("Authorization")
  return authHeader?.replace("Bearer ", "") || null
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getAuthToken(req)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const connection = await getConnection()
    const [tasks] = await connection.query<RowDataPacket[]>(
      "SELECT t.*, u.full_name as created_by_name FROM tasks t LEFT JOIN users u ON t.created_by = u.id WHERE t.id = ?",
      [params.id],
    )

    if (!tasks || tasks.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    return NextResponse.json(tasks[0], { status: 200 })
  } catch (error) {
    console.error("Get task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = getAuthToken(req)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { status, priority, assignedTo, description } = await req.json()

    const connection = await getConnection()
    const updates: string[] = []
    const values: (string | null)[] = []

    if (status !== undefined) {
      updates.push("status = ?")
      values.push(status)
    }
    if (priority !== undefined) {
      updates.push("priority = ?")
      values.push(priority)
    }
    if (assignedTo !== undefined) {
      updates.push("assigned_to = ?")
      values.push(assignedTo)
    }
    if (description !== undefined) {
      updates.push("description = ?")
      values.push(description)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 })
    }

    values.push(params.id)
    const query = `UPDATE tasks SET ${updates.join(", ")} WHERE id = ?`

    await connection.query(query, values)

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Update task error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
