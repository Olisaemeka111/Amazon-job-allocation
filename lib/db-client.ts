import { hash, compare } from "bcryptjs"
import { dummyDb } from "./dummy-db"
import * as dbAdapter from "./database-adapter"

// Flag to track if we're using the fallback database
let usingFallback = true
let connectionError: Error | null = null

// Simple query executor for in-memory database
export async function executeQuery(query: string, params: any[] = []) {
  console.log(`Executing query: ${query.substring(0, 50)}...`)

  try {
    // Try to use the real database first
    if (!usingFallback) {
      try {
        return await dbAdapter.executeQuery(query, params);
      } catch (error) {
        console.error("Database adapter error, falling back to dummy database:", error)
        usingFallback = true;
      }
    }

    // Use in-memory database as fallback
    // Simple query parser for basic operations
    if (query.toUpperCase().startsWith("SELECT")) {
      if (query.includes("FROM users")) {
        if (query.includes("WHERE email =")) {
          const email = params[0]
          const user = dummyDb.users.find((u) => u.email === email)
          return { rows: user ? [user] : [] }
        } else if (query.includes("WHERE role =")) {
          const role = params[0]
          const users = dummyDb.users.filter((u) => u.role === role)
          return { rows: users }
        } else if (query.includes("WHERE id =")) {
          const id = params[0]
          const user = dummyDb.users.find((u) => u.id === id)
          return { rows: user ? [user] : [] }
        } else if (query.includes("COUNT(*)")) {
          if (query.includes("WHERE role = 'admin'")) {
            const count = dummyDb.users.filter((u) => u.role === "admin").length
            return { rows: [{ count }] }
          }
          return { rows: [{ count: dummyDb.users.length }] }
        } else {
          // Return all users
          return {
            rows: dummyDb.users.map((user) => ({ ...user })),
          }
        }
      } else if (query.includes("SELECT 1")) {
        // Connection test
        return { rows: [{ "1": 1 }] }
      }
    } else if (query.toUpperCase().startsWith("INSERT INTO users")) {
      // Simulate user creation
      const newId = dummyDb.generateId(dummyDb.users)
      const newUser = {
        id: newId,
        email: params[0],
        password: params[1],
        name: params[2],
        role: params[3],
        created_at: new Date().toISOString(),
        last_login: null,
      }
      dummyDb.users.push(newUser)
      return { rows: [], lastInsertRowid: newUser.id }
    } else if (query.toUpperCase().startsWith("UPDATE users")) {
      if (query.includes("SET last_login")) {
        const userId = params[0]
        const user = dummyDb.users.find((u) => u.id === userId)
        if (user) {
          user.last_login = new Date().toISOString()
        }
      } else if (query.includes("SET password")) {
        const password = params[0]
        const userId = params[1]
        const user = dummyDb.users.find((u) => u.id === userId)
        if (user) {
          user.password = password
        }
      } else if (query.includes("SET name")) {
        const name = params[0]
        const userId = params[1]
        const user = dummyDb.users.find((u) => u.id === userId)
        if (user) {
          user.name = name
        }
      } else if (query.includes("SET role")) {
        const role = params[0]
        const userId = params[1]
        const user = dummyDb.users.find((u) => u.id === userId)
        if (user) {
          user.role = role
        }
      }
      return { rows: [] }
    } else if (query.toUpperCase().startsWith("DELETE FROM users")) {
      const userId = params[0]
      const index = dummyDb.users.findIndex((u) => u.id === userId)
      if (index !== -1) {
        dummyDb.users.splice(index, 1)
      }
      return { rows: [] }
    } else if (query.toUpperCase().startsWith("CREATE TABLE")) {
      // Ignore table creation in memory mode
      return { rows: [] }
    }

    // Default fallback
    return { rows: [] }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Initialize the database
export async function initDatabase() {
  console.log('Starting database initialization...');
  
  try {
    // First, try to initialize using the Supabase adapter
    console.log('Attempting to connect to Supabase database...');
    const result = await dbAdapter.initDatabase();
    
    if (result.success) {
      // Successfully connected to Supabase
      usingFallback = false;
      connectionError = null;
      console.log('Supabase database initialization completed successfully');
      return { success: true, usingFallback: false };
    } else {
      // Connection failed, use in-memory fallback
      console.log('Connection to Supabase failed, using in-memory fallback database');
      usingFallback = true;
      connectionError = result.error instanceof Error 
        ? result.error 
        : new Error(typeof result.error === 'object' 
            ? JSON.stringify(result.error) 
            : String(result.error || 'Unknown error'));
      
      // Initialize the in-memory database
      await initInMemoryDatabase();
      
      console.log('In-memory database initialization completed successfully');
      return { success: true, usingFallback: true, connectionError };
    }
  } catch (error) {
    // Error during initialization, use in-memory fallback
    console.error('Database initialization error:', error);
    usingFallback = true;
    connectionError = error instanceof Error 
      ? error 
      : new Error(typeof error === 'object' 
          ? JSON.stringify(error) 
          : String(error || 'Unknown error'));
    
    // Initialize the in-memory database
    await initInMemoryDatabase();
    
    console.log('In-memory database initialization completed successfully');
    return { success: true, usingFallback: true, connectionError };
  }
}

// Initialize the in-memory database
async function initInMemoryDatabase() {
  console.log('Initializing in-memory database...');
  
  // Set up tables
  await executeQuery('SELECT 1');
  
  // Check if admin user exists
  const admins = await getAllUsers().then(users => users.filter(user => user.role === 'admin'));
  
  if (admins.length === 0) {
    console.log('Creating default admin user...');
    const hashedPassword = "$2a$10$8OwZ1wG9Y5.lQOJ2QrUoWO9RQzaby/Hg.jWQ.TD8KI0.fNrEPD7nS"; // admin123
    
    await createUser({
      email: 'admin@amazon-warehouse.com',
      password: hashedPassword,
      name: 'System Administrator',
      role: 'admin'
    });
    
    console.log('Default admin user created');
  }
}

/**
 * Check if we're using the fallback database
 */
export function isUsingFallback() {
  return usingFallback;
}

/**
 * Get the last connection error if any
 */
export function getConnectionError() {
  return connectionError;
}

// Special direct authentication function for admin
export async function authenticateAdmin(email: string, password: string) {
  console.log(`Attempting direct admin authentication for: ${email}`)

  // Check if this is the admin user
  if (email === "admin@amazon-warehouse.com") {
    try {
      // For admin, use direct comparison
      const adminUser = dummyDb.users.find((u) => u.email === email)
      if (adminUser) {
        // For deployment simplicity, just check if password is admin123
        const isMatch = password === "admin123" || (await compare(password, adminUser.password))
        console.log(`Admin password match: ${isMatch}`)

        if (isMatch) {
          // Return admin user without password
          const { password: _, ...userWithoutPassword } = adminUser
          return userWithoutPassword
        }
      }
    } catch (error) {
      console.error("Admin authentication error:", error)
    }
  }

  return null
}

// User authentication functions
export async function authenticateUser(email: string, password: string) {
  console.log(`Authenticating user: ${email}`)

  // First try direct admin authentication
  const adminUser = await authenticateAdmin(email, password)
  if (adminUser) {
    console.log("Admin authentication successful")
    return adminUser
  }

  try {
    const result = await executeQuery("SELECT * FROM users WHERE email = ?;", [email])
    const user = result.rows?.[0]

    if (!user) {
      console.log("Authentication failed: User not found")
      return null
    }

    // For non-admin users, use bcrypt compare
    try {
      const passwordMatch = await compare(password, user.password)
      console.log(`Password match: ${passwordMatch}`)

      if (!passwordMatch) {
        console.log("Authentication failed: Invalid password")
        return null
      }
    } catch (error) {
      console.error("Password comparison error:", error)
      return null
    }

    // Update last login time
    await executeQuery("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?;", [user.id])
    console.log(`Updated last login for user ID: ${user.id}`)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

// User management functions
export async function createUser(userData: { email: string; password: string; name: string; role: string }) {
  try {
    // Check if user already exists
    const existingUser = await executeQuery("SELECT id FROM users WHERE email = ?;", [userData.email])

    if (existingUser.rows?.length > 0) {
      throw new Error("User with this email already exists")
    }

    // Hash password
    const hashedPassword = await hash(userData.password, 10)

    // Insert new user
    await executeQuery("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?);", [
      userData.email,
      hashedPassword,
      userData.name,
      userData.role,
    ])

    return { success: true }
  } catch (error) {
    console.error("User creation error:", error)
    throw error
  }
}

export async function getUserByEmail(email: string) {
  try {
    const result = await executeQuery("SELECT * FROM users WHERE email = ?;", [email])

    const user = result.rows?.[0]

    if (!user) {
      return null
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  } catch (error) {
    console.error("Get user error:", error)
    throw new Error("Failed to get user")
  }
}

export async function getAllUsers() {
  try {
    const result = await executeQuery("SELECT id, email, name, role, created_at, last_login FROM users ORDER BY id;")

    return result.rows || []
  } catch (error) {
    console.error("Get all users error:", error)
    throw new Error("Failed to get users")
  }
}

export async function deleteUser(id: number) {
  try {
    // Don't allow deleting the last admin
    const adminCountResult = await executeQuery("SELECT COUNT(*) as count FROM users WHERE role = 'admin';")

    const adminCount = adminCountResult.rows?.[0]?.count || 0

    const userResult = await executeQuery("SELECT role FROM users WHERE id = ?;", [id])

    const userRole = userResult.rows?.[0]?.role

    if (userRole === "admin" && adminCount <= 1) {
      throw new Error("Cannot delete the last admin user")
    }

    await executeQuery("DELETE FROM users WHERE id = ?;", [id])

    return { success: true }
  } catch (error) {
    console.error("Delete user error:", error)
    throw error
  }
}

export async function updateUser(id: number, userData: { name?: string; role?: string; password?: string }) {
  try {
    // Don't allow changing the role of the last admin
    if (userData.role && userData.role !== "admin") {
      const adminCountResult = await executeQuery("SELECT COUNT(*) as count FROM users WHERE role = 'admin';")

      const adminCount = adminCountResult.rows?.[0]?.count || 0

      const userResult = await executeQuery("SELECT role FROM users WHERE id = ?;", [id])

      const userRole = userResult.rows?.[0]?.role

      if (userRole === "admin" && adminCount <= 1) {
        throw new Error("Cannot change the role of the last admin user")
      }
    }

    // Update user fields
    if (userData.password) {
      const hashedPassword = await hash(userData.password, 10)
      await executeQuery("UPDATE users SET password = ? WHERE id = ?;", [hashedPassword, id])
    }

    if (userData.name) {
      await executeQuery("UPDATE users SET name = ? WHERE id = ?;", [userData.name, id])
    }

    if (userData.role) {
      await executeQuery("UPDATE users SET role = ? WHERE id = ?;", [userData.role, id])
    }

    return { success: true }
  } catch (error) {
    console.error("Update user error:", error)
    throw error
  }
}

// New API functions for employees
export async function getAllEmployees() {
  return dummyDb.employees
}

export async function getEmployeeById(id: number) {
  return dummyDb.employees.find((e) => e.id === id) || null
}

export async function createEmployee(
  employeeData: Omit<(typeof dummyDb.employees)[0], "id" | "created_at" | "updated_at">,
) {
  const newEmployee = {
    ...employeeData,
    id: dummyDb.generateId(dummyDb.employees),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  dummyDb.employees.push(newEmployee)
  return newEmployee
}

export async function updateEmployee(id: number, data: Partial<(typeof dummyDb.employees)[0]>) {
  const index = dummyDb.employees.findIndex((e) => e.id === id)
  if (index === -1) return null

  dummyDb.employees[index] = {
    ...dummyDb.employees[index],
    ...data,
    updated_at: new Date().toISOString(),
  }

  return dummyDb.employees[index]
}

export async function deleteEmployee(id: number) {
  const index = dummyDb.employees.findIndex((e) => e.id === id)
  if (index === -1) return false

  dummyDb.employees.splice(index, 1)
  return true
}

// Task management functions
export async function getAllTasks() {
  return dummyDb.tasks
}

export async function getTaskById(id: string) {
  return dummyDb.tasks.find((t) => t.id === id) || null
}

export async function createTask(taskData: Omit<(typeof dummyDb.tasks)[0], "id" | "created_at" | "updated_at">) {
  const newTask = {
    ...taskData,
    id: dummyDb.generateTaskId(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  dummyDb.tasks.push(newTask)
  return newTask
}

export async function updateTask(id: string, data: Partial<(typeof dummyDb.tasks)[0]>) {
  const index = dummyDb.tasks.findIndex((t) => t.id === id)
  if (index === -1) return null

  dummyDb.tasks[index] = {
    ...dummyDb.tasks[index],
    ...data,
    updated_at: new Date().toISOString(),
  }

  return dummyDb.tasks[index]
}

export async function deleteTask(id: string) {
  const index = dummyDb.tasks.findIndex((t) => t.id === id)
  if (index === -1) return false

  dummyDb.tasks.splice(index, 1)
  return true
}

// Alert management functions
export async function getAllAlerts() {
  return dummyDb.alerts
}

export async function updateAlert(id: number, data: Partial<(typeof dummyDb.alerts)[0]>) {
  const index = dummyDb.alerts.findIndex((a) => a.id === id)
  if (index === -1) return null

  dummyDb.alerts[index] = {
    ...dummyDb.alerts[index],
    ...data,
  }

  return dummyDb.alerts[index]
}

// Zone management functions
export async function getAllZones() {
  return dummyDb.zones
}

// Shift management functions
export async function getAllShifts() {
  return dummyDb.shifts
}
