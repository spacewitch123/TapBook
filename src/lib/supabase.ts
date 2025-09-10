import { createClient } from '@supabase/supabase-js';
import { Business } from '@/types';

// Use placeholder values during build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: Business;
        Insert: Omit<Business, 'id' | 'created_at'>;
        Update: Partial<Omit<Business, 'id' | 'created_at'>>;
      };
    };
  };
};