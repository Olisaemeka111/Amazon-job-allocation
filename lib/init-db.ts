import { initDatabase } from "./db-client"

let initialized = false

export async function initializeDatabase() {
  if (initialized) return

  try {
    console.log("Initializing database...")
    await initDatabase()
    console.log("Database initialized successfully")
    initialized = true
  } catch (error) {
    console.error("Failed to initialize database:", error)
  }
}
