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

    const { name, description, teamId } = await req.json()

    if (!name || !teamId) {
      return NextResponse.json({ error: "Name and team ID are required" }, { status: 400 })
    }

    const connection = await getConnection()
    const projectId = uuidv4()

    await connection.query("INSERT INTO projects (id, name, description, team_id, created_by) VALUES (?, ?, ?, ?, ?)", [
      projectId,
      name,
      description || null,
      teamId,
      decoded.userId,
    ])

    return NextResponse.json({ id: projectId, name, description }, { status: 201 })
  } catch (error) {
    console.error("Create project error:", error)
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
    const teamId = searchParams.get("teamId")

    if (!teamId) {
      return NextResponse.json({ error: "Team ID is required" }, { status: 400 })
    }

    const connection = await getConnection()
    const [projects] = await connection.query<RowDataPacket[]>(
      "SELECT p.* FROM projects p JOIN teams t ON p.team_id = t.id JOIN team_members tm ON t.id = tm.team_id WHERE p.team_id = ? AND tm.user_id = ?",
      [teamId, decoded.userId],
    )

    return NextResponse.json(projects, { status: 200 })
  } catch (error) {
    console.error("Get projects error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
