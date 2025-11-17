import { type NextRequest, NextResponse } from "next/server"
import { verifyPassword, generateToken } from "@/lib/auth"
import { getConnection } from "@/lib/db"
import { validateEmail } from "@/lib/validation"
import type { RowDataPacket } from "mysql2/promise"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const connection = await getConnection()
    const [rows] = await connection.query<RowDataPacket[]>("SELECT id, password_hash FROM users WHERE email = ?", [
      email.toLowerCase().trim(),
    ])

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const user = rows[0]
    const isPasswordValid = await verifyPassword(password, user.password_hash as string)

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = generateToken(user.id as string)

    return NextResponse.json({ token, userId: user.id }, { status: 200 })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
