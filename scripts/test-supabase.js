#!/usr/bin/env node

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

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

async function testConnection() {
  try {
    console.log('Testing connection to Supabase...');
    
    // Test authentication
    console.log('Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Authentication test failed:', authError);
    } else {
      console.log('Authentication test successful');
    }
    
    // Try to list tables
    console.log('\nTrying to list tables...');
    const tables = ['users', 'employees', 'tasks', 'alerts', 'shifts', 'zones'];
    
    for (const table of tables) {
      console.log(`\nChecking table: ${table}`);
      const { data, error } = await supabase.from(table).select('count').limit(1);
      
      if (error) {
        if (error.code === '42P01') {
          console.log(`Table '${table}' does not exist`);
        } else {
          console.error(`Error checking table '${table}':`, error);
        }
      } else {
        console.log(`Table '${table}' exists, count:`, data);
      }
    }
    
    // Test DNS resolution
    console.log('\nTesting DNS resolution...');
    const dns = require('dns');
    const hostname = supabaseUrl.replace('https://', '');
    
    dns.lookup(hostname, (err, address, family) => {
      if (err) {
        console.error('DNS lookup failed:', err);
      } else {
        console.log(`DNS lookup successful: ${hostname} resolves to ${address} (IPv${family})`);
      }
    });
    
    console.log('\nTest completed');
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testConnection()
  .catch(error => {
    console.error('Unhandled error during test:', error);
  }); 