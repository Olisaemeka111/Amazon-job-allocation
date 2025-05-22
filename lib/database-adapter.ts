import { createClient } from '@supabase/supabase-js';
import { hash, compare } from 'bcryptjs';

// Initialize Supabase client with environment variables if available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xghxfzeojrwpvdpazova.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaHhmemVvanJ3cHZkcGF6b3ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkyNjI4NiwiZXhwIjoyMDYzNTAyMjg2fQ.qM8ZKVNPlXAEMQ23favbbeE76lKGCc4p5S7_FATH4LQ';

// Log initialization info (don't log the actual key for security)
console.log('Initializing Supabase client with URL:', supabaseUrl);
console.log('API key length:', supabaseKey?.length || 0);
console.log('API key type:', typeof supabaseKey);
console.log('API key first 10 chars:', supabaseKey?.substring(0, 10));

// Create the Supabase client with additional options
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

// Track if we're using the real database or fallback
let usingFallback = false;

/**
 * Execute a query against the PostgreSQL database
 */
export async function executeQuery(query: string, params: any[] = []) {
  if (usingFallback) {
    throw new Error('Cannot execute query on PostgreSQL database - using fallback database');
  }
  
  try {
    console.log(`Executing Supabase query: ${query.substring(0, 50)}...`);
    
    // Handle different query types
    if (query.toUpperCase().startsWith('SELECT')) {
      if (query.includes('FROM users')) {
        if (query.includes('WHERE email =')) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', params[0])
            .single();
            
          if (error) throw error;
          return { rows: data ? [data] : [] };
        } 
        else if (query.includes('WHERE id =')) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', params[0])
            .single();
            
          if (error) throw error;
          return { rows: data ? [data] : [] };
        }
        else if (query.includes('WHERE role =')) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', params[0]);
            
          if (error) throw error;
          return { rows: data || [] };
        }
        else if (query.includes('COUNT(*)')) {
          // Handle count query
          if (query.includes("WHERE role = 'admin'")) {
            const { data, error } = await supabase
              .from('users')
              .select('id', { count: 'exact' })
              .eq('role', 'admin');
              
            if (error) throw error;
            return { rows: [{ count: data?.length || 0 }] };
          }
          
          const { data, error } = await supabase
            .from('users')
            .select('id', { count: 'exact' });
            
          if (error) throw error;
          return { rows: [{ count: data?.length || 0 }] };
        }
        else {
          // Default to returning all users
          const { data, error } = await supabase
            .from('users')
            .select('*');
            
          if (error) throw error;
          return { rows: data || [] };
        }
      }
      else if (query.includes('FROM employees')) {
        const { data, error } = await supabase
          .from('employees')
          .select('*');
          
        if (error) throw error;
        return { rows: data || [] };
      }
      else if (query.includes('FROM tasks')) {
        const { data, error } = await supabase
          .from('tasks')
          .select('*');
          
        if (error) throw error;
        return { rows: data || [] };
      }
      else if (query.includes('FROM alerts')) {
        const { data, error } = await supabase
          .from('alerts')
          .select('*');
          
        if (error) throw error;
        return { rows: data || [] };
      }
      else if (query.includes('FROM shifts')) {
        const { data, error } = await supabase
          .from('shifts')
          .select('*');
          
        if (error) throw error;
        return { rows: data || [] };
      }
      else if (query.includes('FROM zones')) {
        const { data, error } = await supabase
          .from('zones')
          .select('*');
          
        if (error) throw error;
        return { rows: data || [] };
      }
      else if (query.includes('SELECT 1')) {
        // Connection test - just return successful
        return { rows: [{ '1': 1 }] };
      }
    }
    else if (query.toUpperCase().startsWith('INSERT INTO users')) {
      // Insert a new user
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: params[0],
          password: params[1],
          name: params[2],
          role: params[3],
          created_at: new Date().toISOString(),
          last_login: null
        })
        .select();
        
      if (error) throw error;
      return { rows: [], lastInsertRowid: data?.[0]?.id };
    }
    else if (query.toUpperCase().startsWith('UPDATE users')) {
      if (query.includes('SET last_login')) {
        // Update last login time
        const { error } = await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', params[0]);
          
        if (error) throw error;
        return { rows: [] };
      }
      else if (query.includes('SET password')) {
        // Update password
        const { error } = await supabase
          .from('users')
          .update({ password: params[0] })
          .eq('id', params[1]);
          
        if (error) throw error;
        return { rows: [] };
      }
      else if (query.includes('SET name')) {
        // Update name
        const { error } = await supabase
          .from('users')
          .update({ name: params[0] })
          .eq('id', params[1]);
          
        if (error) throw error;
        return { rows: [] };
      }
      else if (query.includes('SET role')) {
        // Update role
        const { error } = await supabase
          .from('users')
          .update({ role: params[0] })
          .eq('id', params[1]);
          
        if (error) throw error;
        return { rows: [] };
      }
    }
    else if (query.toUpperCase().startsWith('DELETE FROM users')) {
      // Delete user
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', params[0]);
        
      if (error) throw error;
      return { rows: [] };
    }
    
    // Default fallback for queries not specifically handled
    console.warn(`Unhandled query: ${query}`);
    return { rows: [] };
  }
  catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

/**
 * Initialize the database tables and seed data if needed
 */
export async function initDatabase() {
  console.log('Initializing PostgreSQL database...');
  
  try {
    // Test connection by checking auth status
    console.log('Testing Supabase authentication...');
    const { data, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Database connection test failed:', sessionError);
      usingFallback = true;
      return { success: false, usingFallback: true, error: sessionError };
    }
    
    console.log('Supabase authentication successful');
    
    // Try to check if tables exist by querying the users table
    console.log('Checking if users table exists...');
    const { error: tableError } = await supabase.from('users').select('count').limit(1);
    
    if (tableError) {
      if (tableError.code === '42P01') { // Table doesn't exist
        console.error('Users table does not exist in Supabase. Using in-memory fallback database.');
      } else {
        console.error('Error checking users table:', tableError);
      }
      usingFallback = true;
      return { success: false, usingFallback: true, error: tableError };
    }
    
    console.log('Supabase database connection and table verification successful');
    
    // Check if admin user exists, if not create default admin
    const { data: admins, error: countError } = await supabase
      .from('users')
      .select('*')
      .eq('role', 'admin');
      
    if (countError) {
      console.error('Error checking admin users:', countError);
      usingFallback = true;
      return { success: false, usingFallback: true, error: countError };
    }
    
    const count = admins?.length || 0;
    console.log(`Found ${count} admin users in Supabase`);
    
    if (count === 0) {
      console.log('Creating default admin user in Supabase...');
      const hashedPassword = "$2a$10$8OwZ1wG9Y5.lQOJ2QrUoWO9RQzaby/Hg.jWQ.TD8KI0.fNrEPD7nS"; // admin123
      
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          email: 'admin@amazon-warehouse.com',
          password: hashedPassword,
          name: 'System Administrator',
          role: 'admin',
          created_at: new Date().toISOString(),
          last_login: null
        });
        
      if (insertError) {
        console.error('Error creating default admin user:', insertError);
        usingFallback = true;
        return { success: false, usingFallback: true, error: insertError };
      }
      
      console.log('Default admin user created in Supabase');
    }
    
    usingFallback = false;
    console.log('Supabase database initialization completed successfully');
    return { success: true, usingFallback };
  }
  catch (error) {
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
    // Check if tables exist
    const { error: tablesError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
      
    if (!tablesError) {
      console.log('Tables already exist, skipping creation');
      return true;
    }
    
    // Create users table
    const { error: createUsersError } = await supabase.rpc('create_users_table');
    if (createUsersError) throw createUsersError;
    
    // Create employees table
    const { error: createEmployeesError } = await supabase.rpc('create_employees_table');
    if (createEmployeesError) throw createEmployeesError;
    
    // Create tasks table
    const { error: createTasksError } = await supabase.rpc('create_tasks_table');
    if (createTasksError) throw createTasksError;
    
    console.log('Tables created successfully');
    return true;
  }
  catch (error) {
    console.error('Error creating tables:', error);
    return false;
  }
} 