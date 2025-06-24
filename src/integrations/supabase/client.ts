
import { createClient } from "@supabase/supabase-js";

// Hardcoded with your project values as per Lovable docs
const supabaseUrl = "https://mageumoyukdexmfucqrw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1hZ2V1bW95dWtkZXhtZnVjcXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDI4ODUsImV4cCI6MjA2MzUxODg4NX0.fgFmH9V4JW7ePZ5aRQI3pNVr48pfDWlOI5lUvE60WSI";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

