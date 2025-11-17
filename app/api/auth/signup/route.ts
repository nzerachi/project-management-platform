import { type NextRequest, NextResponse } from "next/server"
import { hashPassword, generateToken } from "@/lib/auth"
import { getConnection } from "@/lib/db"
import { validateEmail, validatePassword, sanitizeInput } from "@/lib/validation"

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ error: passwordValidation.error }, { status: 400 })
    }

    const connection = await getConnection()

    // Check if user exists
    const [existingUsers] = await connection.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase().trim()])

    if (existingUsers && (existingUsers as []).length > 0) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    const passwordHash = await hashPassword(password)
    const sanitizedFullName = sanitizeInput(fullName || email.split("@")[0])

    await connection.query("INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)", [
      email.toLowerCase().trim(),
      passwordHash,
      sanitizedFullName,
    ])

    const [newUsers] = await connection.query("SELECT id FROM users WHERE email = ?", [email.toLowerCase().trim()])
    const newUser = (newUsers as any[])[0]
    const token = generateToken(newUser.id)

    return NextResponse.json({ token, userId: newUser.id }, { status: 201 })
  } catch (error) {
    console.error("[v0] Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
