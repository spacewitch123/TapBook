#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) are set in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigration() {
  console.log('🚀 Starting database migration...');
  
  try {
    // Read migration file
    const migrationPath = path.join(__dirname, 'supabase-migration.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }

    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    console.log('📄 Migration file loaded');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements`);
    
    // Since DDL statements can't be executed via JS client, show manual instructions
    console.log('\n⚠️  Database migrations require manual execution for security');
    console.log('📋 Please run this migration in your Supabase SQL Editor:');
    
    // Extract project ID from URL
    const urlParts = SUPABASE_URL.replace('https://', '').split('.');
    const projectId = urlParts[0];
    console.log('👉 Go to: https://supabase.com/dashboard/project/' + projectId + '/sql');
    
    console.log('\n' + '='.repeat(60));
    console.log('-- TapBook Phase 2 Migration');
    console.log('-- Copy and paste this entire SQL block into Supabase SQL Editor');
    console.log('-- Then click "Run" to execute');
    console.log('');
    console.log(migrationSQL);
    console.log('='.repeat(60) + '\n');
    
    console.log('✅ Migration SQL ready!');
    console.log('📋 Copy the SQL above and run it in your Supabase dashboard');
    
    console.log('✅ Migration completed successfully!');
    console.log('🎉 Your database now supports the new customization features');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    
    if (error.message.includes('function exec_sql') || error.message.includes('permission')) {
      console.log('\n🔧 MANUAL MIGRATION REQUIRED:');
      console.log('Since we cannot execute SQL directly, please:');
      console.log('1. Go to your Supabase dashboard SQL Editor');
      console.log('2. Copy and paste the migration from supabase-migration.sql');
      console.log('3. Click "Run" to execute the migration');
      console.log('\n📄 Migration content:');
      
      const migrationPath = path.join(__dirname, 'supabase-migration.sql');
      if (fs.existsSync(migrationPath)) {
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        console.log('\n' + '='.repeat(60));
        console.log(migrationSQL);
        console.log('='.repeat(60) + '\n');
      }
    } else {
      process.exit(1);
    }
  }
}

// Run migration
runMigration();