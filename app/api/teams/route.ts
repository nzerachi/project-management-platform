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

    const { name, description } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Team name is required" }, { status: 400 })
    }

    const connection = await getConnection()
    const teamId = uuidv4()

    await connection.query("INSERT INTO teams (id, name, description, owner_id) VALUES (?, ?, ?, ?)", [
      teamId,
      name,
      description || null,
      decoded.userId,
    ])

    // Add owner as team member
    await connection.query("INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, ?)", [
      teamId,
      decoded.userId,
      "admin",
    ])

    return NextResponse.json({ id: teamId, name, description }, { status: 201 })
  } catch (error) {
    console.error("Create team error:", error)
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

    const connection = await getConnection()
    const [teams] = await connection.query<RowDataPacket[]>(
      "SELECT t.* FROM teams t JOIN team_members tm ON t.id = tm.team_id WHERE tm.user_id = ?",
      [decoded.userId],
    )

    return NextResponse.json(teams, { status: 200 })
  } catch (error) {
    console.error("Get teams error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
