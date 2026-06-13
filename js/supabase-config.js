// ─────────────────────────────────────────────────────────────────────────────
//  CONFIGURACIÓN SUPABASE
//  Pegá aquí las credenciales de tu proyecto (Supabase Dashboard → Settings → API).
//  La "anon key" es PÚBLICA y segura de exponer en el navegador: la escritura está
//  protegida por Row Level Security (solo usuarios logueados pueden modificar).
//
//  Mientras esto esté vacío, la web pública funciona EXACTAMENTE igual que hoy
//  (usa el contenido hardcodeado como fallback). No se rompe nada.
// ─────────────────────────────────────────────────────────────────────────────

export const SUPABASE_URL = '';        // ej: 'https://abcdxyz.supabase.co'
export const SUPABASE_ANON_KEY = '';   // ej: 'eyJhbGciOi...'

export function isConfigured() {
  return !!(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.indexOf('http') === 0);
}

let _client = null;

// Crea (una sola vez) el cliente de Supabase. Carga la librería desde CDN solo
// cuando hace falta. Devuelve null si todavía no está configurado.
export async function getClient() {
  if (!isConfigured()) return null;
  if (_client) return _client;
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
  return _client;
}
