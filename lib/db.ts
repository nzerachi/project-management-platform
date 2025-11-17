import mysql from "mysql2/promise"
import type { Connection } from "mysql2/promise"

let connection: Connection | null = null

export async function getConnection(): Promise<Connection> {
  if (connection) {
    try {
      await connection.ping()
      return connection
    } catch (error) {
      console.warn("Database connection lost, reconnecting...")
      connection = null
    }
  }

  const host = process.env.DB_HOST
  const user = process.env.DB_USER
  const password = process.env.DB_PASSWORD
  const database = process.env.DB_NAME

  if (!host || !user || !database) {
    throw new Error("Missing required database configuration: DB_HOST, DB_USER, and DB_NAME must be set")
  }

  try {
    connection = await mysql.createConnection({
      host,
      user,
      password: password || "",
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    })

    await connection.ping()
    console.log("[v0] Database connected successfully")
    return connection
  } catch (error) {
    console.error("[v0] Database connection error:", error)
    throw new Error(`Failed to connect to database: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function closeConnection(): Promise<void> {
  if (connection) {
    try {
      await connection.end()
      connection = null
      console.log("[v0] Database connection closed")
    } catch (error) {
      console.error("[v0] Error closing database connection:", error)
    }
  }
}
