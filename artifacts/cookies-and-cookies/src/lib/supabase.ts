import { createClient } from '@supabase/supabase-js';

// Fallback seguro caso as variáveis de ambiente não estejam preenchidas no host
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://oafnbfrqrlpjkkngtdcy.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hZm5iZnJxcmxwamtrbmd0ZGN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNzMyMDksImV4cCI6MjEwMjY0OTIwOX0.L6uJqVzQimZYufTwQ7c7aIXN_rQBSHypcrECFmogu1k';

export const supabase = createClient(supabaseUrl, supabaseKey);
