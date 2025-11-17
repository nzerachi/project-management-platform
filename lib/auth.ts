import crypto from "crypto"

// Hash password using bcrypt algorithm (simplified version)
export async function hashPassword(password: string): Promise<string> {
  // In production, use bcrypt or argon2
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return `${salt}:${hash}`
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const [salt, storedHash] = hash.split(":")
  const hashToCompare = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return hashToCompare === storedHash
}

// Generate JWT token (simplified)
export function generateToken(userId: string): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64")
  const payload = Buffer.from(
    JSON.stringify({
      userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    }),
  ).toString("base64")

  const signature = crypto
    .createHmac("sha256", process.env.JWT_SECRET || "your-secret-key")
    .update(`${header}.${payload}`)
    .digest("base64")

  return `${header}.${payload}.${signature}`
}

// Verify JWT token
export function verifyToken(token: string): { userId: string } | null {
  try {
    const [header, payload, signature] = token.split(".")
    const decodedPayload = JSON.parse(Buffer.from(payload, "base64").toString())

    if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null // Token expired
    }

    return { userId: decodedPayload.userId }
  } catch {
    return null
  }
}
