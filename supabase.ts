import { createClient } from '@supabase/supabase-js';

// Usamos import.meta.env para Vite (es más seguro)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ ADVERTENCIA: Faltan las claves de Supabase. La base de datos no funcionará.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);