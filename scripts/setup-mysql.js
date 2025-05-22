#!/usr/bin/env node

const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

// Configuration from environment variables with fallbacks
const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('Using MySQL host:', dbConfig.host);
console.log('Using MySQL port:', dbConfig.port);

// MySQL SQL statements to create database and tables
const createDatabaseSql = `CREATE DATABASE IF NOT EXISTS ${process.env.MYSQL_DATABASE || 'amazon_job_allocation'};`;

// SQL statements for each table
const createUsersSql = `
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  created_at DATETIME NOT NULL,
  last_login DATETIME NULL
);
`;

const createEmployeesSql = `
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
);
`;

const createTasksSql = `
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
);
`;

const createAlertsSql = `
CREATE TABLE IF NOT EXISTS alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(50) DEFAULT 'active',
  created_at DATETIME NOT NULL,
  resolved_at DATETIME NULL
);
`;

const createShiftsSql = `
CREATE TABLE IF NOT EXISTS shifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week VARCHAR(100) NOT NULL
);
`;

const createZonesSql = `
CREATE TABLE IF NOT EXISTS zones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  status VARCHAR(50) DEFAULT 'active'
);
`;

// Test connection function
const testConnection = async () => {
  try {
    console.log('Testing connection to MySQL...');
    
    // Create a connection without specifying a database
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    console.log('Connection test successful');
    return connection;
  } catch (error) {
    console.error('Connection test error:', error);
    throw error;
  }
};

// Create database function
const createDatabase = async (connection) => {
  try {
    console.log('Creating database if it does not exist...');
    await connection.execute(createDatabaseSql);
    console.log(`Database '${process.env.MYSQL_DATABASE || 'amazon_job_allocation'}' created or already exists`);
  } catch (error) {
    console.error('Database creation error:', error);
    throw error;
  }
};

// Connect to the database
const connectToDatabase = async () => {
  try {
    return await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: process.env.MYSQL_DATABASE || 'amazon_job_allocation'
    });
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// Create tables function
const createTables = async (connection) => {
  try {
    console.log('Creating tables if they do not exist...');
    
    // Create tables
    await connection.execute(createUsersSql);
    console.log('Users table created or already exists');
    
    await connection.execute(createEmployeesSql);
    console.log('Employees table created or already exists');
    
    await connection.execute(createTasksSql);
    console.log('Tasks table created or already exists');
    
    await connection.execute(createAlertsSql);
    console.log('Alerts table created or already exists');
    
    await connection.execute(createShiftsSql);
    console.log('Shifts table created or already exists');
    
    await connection.execute(createZonesSql);
    console.log('Zones table created or already exists');
    
  } catch (error) {
    console.error('Table creation error:', error);
    throw error;
  }
};

// Seed admin user
const seedAdminUser = async (connection) => {
  try {
    console.log('Checking for admin user...');
    
    // Check if admin exists
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE role = ?', ['admin']);
    const count = rows[0].count;
    
    if (count === 0) {
      console.log('Admin user not found, creating default admin...');
      
      // Create default admin
      const hashedPassword = "$2a$10$8OwZ1wG9Y5.lQOJ2QrUoWO9RQzaby/Hg.jWQ.TD8KI0.fNrEPD7nS"; // admin123
      
      await connection.execute(
        'INSERT INTO users (email, password, name, role, created_at) VALUES (?, ?, ?, ?, ?)',
        [
          'admin@amazon-warehouse.com',
          hashedPassword,
          'System Administrator',
          'admin',
          new Date().toISOString()
        ]
      );
      
      console.log('Default admin user created successfully');
    } else {
      console.log('Admin user already exists, skipping...');
    }
  } catch (error) {
    console.error('Admin user creation error:', error);
    throw error;
  }
};

// Main function to set up database
const setupDatabase = async () => {
  let rootConnection = null;
  let dbConnection = null;
  
  try {
    // Test connection first
    rootConnection = await testConnection();
    
    // Create database if it doesn't exist
    await createDatabase(rootConnection);
    
    // Close root connection
    await rootConnection.end();
    
    // Connect to the specific database
    dbConnection = await connectToDatabase();
    
    // Create tables
    await createTables(dbConnection);
    
    // Seed admin user
    await seedAdminUser(dbConnection);
    
    console.log('Database setup completed successfully');
  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    // Clean up connections
    if (rootConnection) {
      try {
        await rootConnection.end();
      } catch (err) {
        console.error('Error closing root connection:', err);
      }
    }
    
    if (dbConnection) {
      try {
        await dbConnection.end();
      } catch (err) {
        console.error('Error closing database connection:', err);
      }
    }
  }
};

// Run the setup
setupDatabase(); 