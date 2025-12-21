import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  'https://iajjypnqzeyyhdfzrxvw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlhamp5cG5xemV5eWhkZnpyeHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNzE1MDEsImV4cCI6MjA4MTc0NzUwMX0.hzWARhfQdpzMQ0JxTmA-hC3rnCJawCLde7UF0xrxp20'
);
