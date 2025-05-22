#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// Configuration - use environment variables or fallback to hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xghxfzeojrwpvdpazova.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaHhmemVvanJ3cHZkcGF6b3ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkyNjI4NiwiZXhwIjoyMDYzNTAyMjg2fQ.qM8ZKVNPlXAEMQ23favbbeE76lKGCc4p5S7_FATH4LQ';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using API key of length:', supabaseKey.length);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// SQL definitions for tables
const userTableSQL = `
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);
`;

// Function to execute SQL queries directly
async function executeSql(sql) {
  try {
    console.log('Executing SQL:', sql.substring(0, 50) + '...');
    
    const result = await supabase.rpc('exec_sql', { sql });
    
    if (result.error) {
      console.log('Error executing SQL through RPC:', result.error);
      
      // Try through direct API access
      console.log('Trying SQL through direct API access...');
      
      const endpoint = `${supabaseUrl}/rest/v1/`;
      const response = await fetch(`${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
        },
        body: JSON.stringify({ command: sql })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error executing SQL through API:', errorData);
        return false;
      }
      
      console.log('SQL executed successfully through API');
      return true;
    }
    
    console.log('SQL executed successfully through RPC');
    return true;
  } catch (error) {
    console.error('Error executing SQL:', error);
    return false;
  }
}

// Setup database function
async function setupDatabase() {
  try {
    console.log('Setting up database tables...');
    
    // Test connection
    console.log('Testing connection to Supabase...');
    const { data, error: connectionError } = await supabase.auth.getSession();
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      return false;
    }
    
    console.log('Connection test successful');
    
    // Create users table
    console.log('Creating users table...');
    const usersCreated = await executeSql(userTableSQL);
    
    if (!usersCreated) {
      console.error('Failed to create users table');
    } else {
      console.log('Users table created successfully');
      
      // Check if admin user exists
      const { data: adminUsers, error: adminCheckError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin');
      
      if (adminCheckError && adminCheckError.code === '42P01') {
        console.error('Users table does not exist after creation attempt');
      } else if (adminCheckError) {
        console.error('Error checking for admin users:', adminCheckError);
      } else if (!adminUsers || adminUsers.length === 0) {
        // Create admin user
        console.log('Creating admin user...');
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            email: 'admin@amazon-warehouse.com',
            password: '$2a$10$8OwZ1wG9Y5.lQOJ2QrUoWO9RQzaby/Hg.jWQ.TD8KI0.fNrEPD7nS', // admin123
            name: 'System Administrator',
            role: 'admin',
            created_at: new Date().toISOString(),
            last_login: null
          }]);
        
        if (insertError) {
          console.error('Error creating admin user:', insertError);
        } else {
          console.log('Admin user created successfully');
        }
      } else {
        console.log(`Found ${adminUsers.length} existing admin users`);
      }
    }
    
    console.log('Database setup completed successfully');
    return true;
  } catch (error) {
    console.error('Database setup error:', error);
    return false;
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Database setup script completed');
  })
  .catch(error => {
    console.error('Database setup script failed:', error);
    process.exit(1);
  }); 