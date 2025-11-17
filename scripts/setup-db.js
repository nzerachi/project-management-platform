/**
 * Database Setup Script
 * Run this script to initialize the database schema
 * Usage: node scripts/setup-db.js
 */

const fs = require("fs")
const path = require("path")
const mysql = require("mysql2/promise")

async function setupDatabase() {
  const host = process.env.DB_HOST || "localhost"
  const user = process.env.DB_USER || "root"
  const password = process.env.DB_PASSWORD || ""
  const database = process.env.DB_NAME || "teamflow"

  console.log("[v0] Connecting to MySQL at", host)

  try {
    // Connect to MySQL
    const connection = await mysql.createConnection({
      host,
      user,
      password,
    })

    console.log("[v0] Connected to MySQL")

    // Create database if it doesn't exist
    console.log(`[v0] Creating database ${database} if it doesn't exist...`)
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`)
    console.log("[v0] Database ready")

    // Select the database
    await connection.query(`USE ${database}`)

    // Read and execute schema script
    const schemaPath = path.join(__dirname, "01-create-schema.sql")
    if (!fs.existsSync(schemaPath)) {
      console.error("[v0] Schema file not found at:", schemaPath)
      process.exit(1)
    }

    const schema = fs.readFileSync(schemaPath, "utf8")

    // Split and execute statements
    const statements = schema
      .split(";")
      .map((stmt) => stmt.trim())
      .filter((stmt) => stmt.length > 0)

    console.log(`[v0] Executing ${statements.length} SQL statements...`)

    for (const statement of statements) {
      try {
        await connection.query(statement)
      } catch (error) {
        // Ignore "table already exists" errors
        if (error instanceof Error && error.message.includes("already exists")) {
          console.log("[v0]", error.message)
        } else {
          throw error
        }
      }
    }

    console.log("[v0] Database schema setup completed successfully!")
    await connection.end()
  } catch (error) {
    console.error("[v0] Database setup failed:", error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

setupDatabase()
