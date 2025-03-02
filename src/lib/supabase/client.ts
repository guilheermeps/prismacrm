
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mqegfevdzvnxsajrotrx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xZWdmZXZkenZueHNhanJvdHJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA4NzQzNTksImV4cCI6MjA1NjQ1MDM1OX0.7ee-cZFd3f0CJZNOMw1WF28gbLQDnc_0r_mfxgIAKcY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export for easy access
export default supabase;
