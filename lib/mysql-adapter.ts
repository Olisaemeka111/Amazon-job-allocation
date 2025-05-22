import mysql from 'mysql2/promise';
import { hash, compare } from 'bcryptjs';

// MySQL connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  database: process.env.MYSQL_DATABASE || 'amazon_job_allocation',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create a pool connection that can be reused
let pool: mysql.Pool | null = null;

// Track if we're using the real database or fallback
let usingFallback = false;

/**
 * Get or create MySQL connection pool
 */
async function getPool() {
  if (!pool) {
    try {
      console.log('Creating MySQL connection pool with host:', dbConfig.host);
      pool = mysql.createPool(dbConfig);
    } catch (error) {
      console.error('Error creating MySQL connection pool:', error);
      throw error;
    }
  }
  return pool;
}

/**
 * Execute a query against the MySQL database
 */
export async function executeQuery(query: string, params: any[] = []) {
  if (usingFallback) {
    throw new Error('Cannot execute query on MySQL database - using fallback database');
  }
  
  try {
    const pool = await getPool();
    const [rows] = await pool.execute(query, params);
    return { rows };
  } catch (error) {
    console.error('Database query error:', error);
    // Switch to fallback mode in case of error
    usingFallback = true;
    throw error;
  }
}

/**
 * Initialize the database tables and seed data if needed
 */
export async function initDatabase() {
  console.log('Initializing MySQL database...');
  console.log('Using MySQL host:', dbConfig.host);
  
  try {
    // Test connection
    console.log('Testing database connection...');
    const pool = await getPool();
    await pool.execute('SELECT 1');
    
    console.log('Database connection successful');
    
    // Create tables if they don't exist
    await createTables();
    
    // Check if admin user exists, if not create default admin
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
    const count = (rows as any)[0]?.count || 0;
    console.log(`Found ${count} admin users`);
    
    if (count === 0) {
      console.log('Creating default admin user...');
      const hashedPassword = "$2a$10$8OwZ1wG9Y5.lQOJ2QrUoWO9RQzaby/Hg.jWQ.TD8KI0.fNrEPD7nS"; // admin123
      
      await pool.execute(
        'INSERT INTO users (email, password, name, role, created_at) VALUES (?, ?, ?, ?, ?)',
        [
          'admin@amazon-warehouse.com',
          hashedPassword,
          'System Administrator',
          'admin',
          new Date().toISOString()
        ]
      );
      console.log('Default admin user created');
    }
    
    usingFallback = false;
    console.log('Database initialization completed successfully');
    return { success: true, usingFallback };
  } catch (error) {
    console.error('Database initialization error:', error);
    usingFallback = true;
    return { success: false, usingFallback: true, error };
  }
}

/**
 * Check if we're using the fallback database
 */
export function isUsingFallback() {
  return usingFallback;
}

/**
 * Create necessary tables for the application
 */
export async function createTables() {
  try {
    const pool = await getPool();
    
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        created_at DATETIME NOT NULL,
        last_login DATETIME NULL
      )
    `);
    
    // Create employees table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        employee_id VARCHAR(50) NOT NULL UNIQUE,
        zone VARCHAR(50) NULL,
        shift VARCHAR(50) NULL,
        status VARCHAR(50) DEFAULT 'available',
        last_task_completed DATETIME NULL,
        efficiency_score FLOAT DEFAULT 0,
        created_at DATETIME NOT NULL
      )
    `);
    
    // Create tasks table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        priority VARCHAR(20) DEFAULT 'medium',
        employee_id INT NULL,
        zone VARCHAR(50) NULL,
        estimated_time INT NULL,
        actual_time INT NULL,
        created_at DATETIME NOT NULL,
        completed_at DATETIME NULL,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
      )
    `);
    
    // Create alerts table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        severity VARCHAR(20) DEFAULT 'medium',
        status VARCHAR(50) DEFAULT 'active',
        created_at DATETIME NOT NULL,
        resolved_at DATETIME NULL
      )
    `);
    
    // Create shifts table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS shifts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        days_of_week VARCHAR(100) NOT NULL
      )
    `);
    
    // Create zones table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS zones (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NULL,
        status VARCHAR(50) DEFAULT 'active'
      )
    `);
    
    console.log('Tables created successfully');
    return true;
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
} 