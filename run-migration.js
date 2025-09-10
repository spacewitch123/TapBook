#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

// Read migration file
const migrationPath = path.join(__dirname, 'supabase-migration.sql');
if (!fs.existsSync(migrationPath)) {
  console.error('❌ Migration file not found:', migrationPath);
  process.exit(1);
}

const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

console.log('🚀 Running database migration...');
console.log('📄 Migration file:', migrationPath);

try {
  // Create a temporary SQL file with the migration
  const tempFile = path.join(__dirname, 'temp-migration.sql');
  fs.writeFileSync(tempFile, migrationSQL);
  
  // Extract project reference from URL
  const projectRef = SUPABASE_URL.replace('https://', '').replace('.supabase.co', '');
  
  // Run the migration using supabase CLI
  const command = `supabase db push --project-ref ${projectRef} --include-all`;
  
  console.log('⏳ Applying migration...');
  
  // Alternative approach: Use curl to call the Supabase REST API directly
  const curlCommand = `curl -X POST "${SUPABASE_URL}/rest/v1/rpc/execute_sql" \\
    -H "apikey: ${SUPABASE_ANON_KEY}" \\
    -H "Authorization: Bearer ${SUPABASE_ANON_KEY}" \\
    -H "Content-Type: application/json" \\
    -d '{"query": ${JSON.stringify(migrationSQL)}}'`;
  
  console.log('📝 Executing SQL via REST API...');
  console.log(migrationSQL);
  
  // For now, let's just show the user what needs to be run
  console.log('\n🔧 MANUAL STEP REQUIRED:');
  console.log('Copy and paste this SQL into your Supabase SQL Editor:');
  console.log('👉 Go to: ' + SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/') + '/sql');
  console.log('\n' + '='.repeat(50));
  console.log(migrationSQL);
  console.log('='.repeat(50) + '\n');
  
  // Clean up temp file
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
  
  console.log('✅ Migration ready to run!');
  console.log('📋 The SQL has been displayed above - copy it to your Supabase SQL Editor');
  
} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}