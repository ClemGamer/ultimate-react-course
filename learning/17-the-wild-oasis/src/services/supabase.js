import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://qzuqdykaubypdkpjcupk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dXFkeWthdWJ5cGRrcGpjdXBrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyMTg5MzEsImV4cCI6MjA1MDc5NDkzMX0.BQWGeqMtibHKp20iYbi9W_Ufm1ItNAFKoGPlxZf4Vbw";
export const supabase = createClient(supabaseUrl, supabaseKey);
