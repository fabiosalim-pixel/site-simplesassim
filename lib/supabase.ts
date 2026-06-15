import { createClient } from '@supabase/supabase-js'

// Fallback evita erro de validação do createClient quando as variáveis
// ainda não foram configuradas (ex: em desenvolvimento local).
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
