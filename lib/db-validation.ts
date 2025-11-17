/**
 * Database connection validation and error handling
 */

export async function validateDatabaseConnection() {
  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"]
  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.error("Missing required environment variables:", missingVars.join(", "))
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }
}

export function getConnectionConfig() {
  return {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "teamflow",
  }
}
