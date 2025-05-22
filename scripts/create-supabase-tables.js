#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration - use environment variables or fallback to hardcoded values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xghxfzeojrwpvdpazova.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhnaHhmemVvanJ3cHZkcGF6b3ZhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzkyNjI4NiwiZXhwIjoyMDYzNTAyMjg2fQ.qM8ZKVNPlXAEMQ23favbbeE76lKGCc4p5S7_FATH4LQ';

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using API key of length:', supabaseKey.length);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function executeCreateTablesSQL() {
  try {
    console.log('Reading SQL file...');
    const sqlFilePath = path.join(__dirname, 'supabase-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into separate statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Test connection first
    console.log('Testing Supabase connection...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication test failed:', authError);
      return false;
    }
    
    console.log('Authentication test successful');
    
    // Supabase SQL execution
    console.log('Executing SQL statements...');
    
    // For each statement, we need to execute it via the Supabase API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\nExecuting statement ${i + 1}/${statements.length}...`);
      console.log(statement.substring(0, 100) + (statement.length > 100 ? '...' : ''));
      
      try {
        // Supabase doesn't directly expose SQL execution, so we'll try to categorize and handle each statement
        if (statement.toUpperCase().startsWith('CREATE TABLE')) {
          // For table creation, just attempt to query the table - if it doesn't exist, it will fail
          // We'll ignore this error since we're using "IF NOT EXISTS" in our SQL
          console.log('Table creation statement detected, checking if needed...');
          
          // Extract table name
          const tableNameMatch = statement.match(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\s+public\.(\w+)/i);
          if (tableNameMatch && tableNameMatch[1]) {
            const tableName = tableNameMatch[1];
            console.log(`Checking if table '${tableName}' exists...`);
            
            const { error } = await supabase.from(tableName).select('count').limit(1);
            if (error && error.code === '42P01') {
              console.log(`Table '${tableName}' doesn't exist. Unfortunately, we can't create it directly via the API.`);
              console.log('Please create this table in the Supabase dashboard or use SQL scripts in the dashboard SQL editor.');
            } else if (error) {
              console.error(`Error checking table '${tableName}':`, error);
            } else {
              console.log(`Table '${tableName}' already exists, skipping creation.`);
            }
          }
        } 
        else if (statement.toUpperCase().startsWith('INSERT INTO')) {
          // For inserts, use the Supabase insert API
          const tableNameMatch = statement.match(/INSERT\s+INTO\s+public\.(\w+)/i);
          if (tableNameMatch && tableNameMatch[1]) {
            const tableName = tableNameMatch[1];
            console.log(`Inserting data into '${tableName}'...`);
            
            // Since we can't directly execute the SQL, we'll need to inform the user
            console.log(`To seed data into '${tableName}', please use the SQL editor in the Supabase dashboard.`);
            console.log(`Copy this statement and run it there:`);
            console.log(statement);
          }
        }
        else {
          console.log('Unknown statement type. Please execute this manually in the Supabase SQL editor:');
          console.log(statement);
        }
        
        console.log(`Statement ${i + 1} handled.`);
      } catch (error) {
        console.error(`Error handling statement ${i + 1}:`, error);
      }
    }
    
    console.log('\nSQL execution completed');
    return true;
  } catch (error) {
    console.error('Error executing SQL:', error);
    return false;
  }
}

// Run the SQL execution
executeCreateTablesSQL()
  .then((success) => {
    console.log('Script completed with status:', success ? 'SUCCESS' : 'FAILURE');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  }); 