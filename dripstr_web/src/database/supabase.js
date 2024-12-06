import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    "https://pbghpzmbfeahlhmopapy.supabase.co", // Replace with your Supabase URL
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBiZ2hwem1iZmVhaGxobW9wYXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxNDMyMjUsImV4cCI6MjA0ODcxOTIyNX0.myG1QviFCUXz2_7StygEbCss0nKKU36IU8cC0qQpRpI" // Replace with your Supabase API Key
  );